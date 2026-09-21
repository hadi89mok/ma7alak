/* =========================================================
   SHOUFHON — OWNER MEDIA EDITOR V1
   Manual Media Showcase companion.
   - Admin gated by directory_options.owner_media_edit_enabled
   - Separate photo/video limits
   - Add / replace / delete
   - Removes replaced/deleted uploaded files from Supabase Storage
   - Phone-first: Samsung Chromium/Brave + iOS Safari
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_OWNER_MEDIA_EDITOR_V1__)return;
  window.__SHOUFHON_OWNER_MEDIA_EDITOR_V1__=true;

  const URL_="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const KEY_="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const PHOTO_BUCKET="shop-gallery";
  const VIDEO_BUCKET="shop-videos";

  let client=null,slug="",owner=false,allowed=false,busy=false,mounted=false;
  let photoLimit=0,videoLimit=0,photos=[],videos=[];
  let picker={mode:"",type:"",id:null};

  const bool=v=>v===true||["true","1","yes","on"].includes(String(v||"").trim().toLowerCase());
  const limit=(v,f)=>Number.isFinite(Number(v))?Math.max(0,Math.min(100,Math.round(Number(v)))):f;
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

  async function getClient(){
    if(client)return client;
    try{if(window.Ma7alakSupabaseBootstrap?.ready)client=await window.Ma7alakSupabaseBootstrap.ready()}catch(_){}
    client=client||window.Ma7alakAccount?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null;
    if(!client&&window.supabase?.createClient)client=window.supabase.createClient(URL_,KEY_);
    return client;
  }

  async function getSlug(){
    if(slug)return slug;
    const root=document.getElementById("m7-media-showcase");
    slug=String(root?.getAttribute("data-shop-slug")||"").trim().toLowerCase();
    if(slug)return slug;
    try{
      const ctx=window.ShoufHonShopContextClient;
      if(ctx)slug=String(await ctx.resolve({explicit:"",fallback:()=>ctx.detectPageSlug(),timeout:1200})||"").trim().toLowerCase();
    }catch(_){}
    return slug;
  }

  function ext(file,type){
    const fromName=String(file?.name||"").split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"");
    if(fromName&&fromName.length<=8)return fromName;
    const mime=String(file?.type||"").toLowerCase();
    if(type==="video")return mime.includes("webm")?"webm":mime.includes("quicktime")?"mov":"mp4";
    return mime.includes("png")?"png":mime.includes("webp")?"webp":mime.includes("gif")?"gif":"jpg";
  }

  function pathFor(type,file){
    const id=(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+"-"+Date.now();
    return (type==="video"?"owner-media/":"owner-gallery/")+slug+"/"+id+"."+ext(file,type);
  }

  function portal(open){
    try{
      if(window.parent&&window.parent!==window){
        window.parent.postMessage({type:open?"SHOUFHON_EMBED_VIEWER_OPEN":"SHOUFHON_EMBED_VIEWER_CLOSE"},"*");
      }
    }catch(_){}
  }

  function status(message,type=""){
    const el=document.getElementById("m7-owner-media-status");
    if(!el)return;
    el.textContent=message||"";
    el.dataset.type=type;
  }

  function row(type,id){
    return (type==="video"?videos:photos).find(x=>String(x.id)===String(id))||null;
  }

  async function removeStored(bucket,path){
    if(!path)return;
    const r=await client.storage.from(bucket).remove([path]);
    if(r.error)throw r.error;
  }

  async function loadRows(){
    const [g,v,p]=await Promise.all([
      client.from("shop_gallery").select("id,image_url,storage_path,sort_order,is_featured,created_at").eq("shop_slug",slug).order("sort_order",{ascending:true}).order("created_at",{ascending:true}),
      client.from("shop_videos").select("id,video_url,storage_path,sort_order,created_at").eq("shop_slug",slug).order("sort_order",{ascending:true}).order("created_at",{ascending:true}),
      client.from("shop_profiles").select("directory_options").eq("shop_slug",slug).maybeSingle()
    ]);
    if(g.error)throw g.error;if(v.error)throw v.error;if(p.error)throw p.error;
    photos=g.data||[];videos=v.data||[];
    const o=p.data?.directory_options||{};
    allowed=bool(o.owner_media_edit_enabled);
    photoLimit=limit(o.owner_media_photo_limit,6);
    videoLimit=limit(o.owner_media_video_limit,2);
    render();
  }

  function render(){
    const quota=document.getElementById("m7-owner-media-quota");
    const list=document.getElementById("m7-owner-media-list");
    if(!quota||!list)return;
    quota.innerHTML='<span><b>'+photos.length+'</b> / '+photoLimit+' photos</span><span><b>'+videos.length+'</b> / '+videoLimit+' videos</span>';
    const items=[
      ...photos.map(x=>({type:"photo",id:x.id,url:x.image_url,path:x.storage_path||"",featured:x.is_featured===true})),
      ...videos.map(x=>({type:"video",id:x.id,url:x.video_url,path:x.storage_path||"",featured:false}))
    ];
    if(!items.length){list.innerHTML='<div class="m7om-empty">No Media yet. Add photos or videos above.</div>';return}
    list.innerHTML=items.map(x=>'<article class="m7om-item" data-type="'+x.type+'" data-id="'+esc(x.id)+'">'+
      '<div class="m7om-thumb">'+(x.type==="video"?'<video src="'+esc(x.url)+'" muted playsinline preload="metadata"></video><em>VIDEO</em>':'<img src="'+esc(x.url)+'" alt=""><em>'+(x.featured?"FEATURED":"PHOTO")+'</em>')+'</div>'+
      '<div class="m7om-copy"><b>'+(x.type==="video"?"Video":"Photo")+'</b><small>'+(x.path?"Uploaded file":"Existing URL media")+'</small></div>'+
      '<div class="m7om-actions"><button type="button" data-replace>Replace</button><button type="button" data-delete>Delete</button></div>'+
    '</article>').join("");
  }

  function choose(mode,type,id=null){
    if(busy||!allowed)return;
    picker={mode,type,id};
    const input=document.getElementById("m7-owner-media-file");
    input.value="";
    input.multiple=mode==="add";
    input.accept=type==="video"?"video/mp4,video/webm,video/quicktime":"image/jpeg,image/png,image/webp,image/gif";
    input.click();
  }

  async function uploadOne(type,file,sortOrder){
    const max=type==="video"?100*1024*1024:12*1024*1024;
    if(file.size>max)throw new Error(file.name+" is too large.");
    if(type==="video"&&!String(file.type||"").startsWith("video/"))throw new Error("Choose video files only.");
    if(type==="photo"&&!String(file.type||"").startsWith("image/"))throw new Error("Choose image files only.");
    const bucket=type==="video"?VIDEO_BUCKET:PHOTO_BUCKET;
    const path=pathFor(type,file);
    let uploaded=false;
    try{
      const up=await client.storage.from(bucket).upload(path,file,{cacheControl:"0",upsert:false,contentType:file.type||undefined});
      if(up.error)throw up.error;
      uploaded=true;
      const publicUrl=client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      const payload=type==="video"
        ?{shop_slug:slug,video_url:publicUrl,storage_path:path,sort_order:sortOrder}
        :{shop_slug:slug,image_url:publicUrl,storage_path:path,sort_order:sortOrder,is_featured:false};
      const ins=await client.from(type==="video"?"shop_videos":"shop_gallery").insert(payload);
      if(ins.error)throw ins.error;
    }catch(error){
      if(uploaded)try{await removeStored(bucket,path)}catch(_){}
      throw error;
    }
  }

  async function addFiles(type,fileList){
    const files=[...(fileList||[])];
    if(!files.length)return;
    const current=type==="video"?videos.length:photos.length;
    const cap=type==="video"?videoLimit:photoLimit;
    if(current+files.length>cap)throw new Error("This shop can have up to "+cap+" "+(type==="video"?"videos":"photos")+". It currently has "+current+".");
    let order=Math.max(-1,...(type==="video"?videos:photos).map(x=>Number(x.sort_order)||0))+1;
    for(let i=0;i<files.length;i++){
      status("Uploading "+(i+1)+" / "+files.length+"…");
      await uploadOne(type,files[i],order+i);
    }
  }

  async function replaceOne(type,id,file){
    const old=row(type,id);
    if(!old)throw new Error("Media item not found.");
    const max=type==="video"?100*1024*1024:12*1024*1024;
    if(file.size>max)throw new Error("Replacement file is too large.");
    if(type==="video"&&!String(file.type||"").startsWith("video/"))throw new Error("Choose a video file.");
    if(type==="photo"&&!String(file.type||"").startsWith("image/"))throw new Error("Choose an image file.");
    const bucket=type==="video"?VIDEO_BUCKET:PHOTO_BUCKET;
    const table=type==="video"?"shop_videos":"shop_gallery";
    const path=pathFor(type,file);
    let uploaded=false;
    try{
      const up=await client.storage.from(bucket).upload(path,file,{cacheControl:"0",upsert:false,contentType:file.type||undefined});
      if(up.error)throw up.error;
      uploaded=true;
      const publicUrl=client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      const patch=type==="video"?{video_url:publicUrl,storage_path:path}:{image_url:publicUrl,storage_path:path};
      const upd=await client.from(table).update(patch).eq("id",old.id).eq("shop_slug",slug);
      if(upd.error)throw upd.error;
      if(old.storage_path&&old.storage_path!==path){
        try{await removeStored(bucket,old.storage_path)}catch(error){console.warn("[ShoufHon owner media] old file cleanup:",error)}
      }
    }catch(error){
      if(uploaded)try{await removeStored(bucket,path)}catch(_){}
      throw error;
    }
  }

  async function deleteOne(type,id){
    const old=row(type,id);
    if(!old)throw new Error("Media item not found.");
    const bucket=type==="video"?VIDEO_BUCKET:PHOTO_BUCKET;
    const table=type==="video"?"shop_videos":"shop_gallery";
    const del=await client.from(table).delete().eq("id",old.id).eq("shop_slug",slug);
    if(del.error)throw del.error;
    if(old.storage_path){
      try{await removeStored(bucket,old.storage_path)}
      catch(first){
        await new Promise(r=>setTimeout(r,250));
        try{await removeStored(bucket,old.storage_path)}catch(second){console.warn("[ShoufHon owner media] storage cleanup:",second)}
      }
    }
  }

  function openEditor(){
    if(!owner||!allowed)return;
    const sheet=document.getElementById("m7-owner-media-sheet");
    sheet.classList.add("open");sheet.setAttribute("aria-hidden","false");portal(true);status("");
    loadRows().catch(e=>status(e?.message||"Could not load Media.","error"));
  }
  function closeEditor(){
    if(busy)return;
    const sheet=document.getElementById("m7-owner-media-sheet");
    sheet.classList.remove("open");sheet.setAttribute("aria-hidden","true");portal(false);
  }

  function inject(){
    if(mounted)return;
    const heading=document.querySelector(".m7-media-heading-row");
    if(!heading)return;
    mounted=true;
    const style=document.createElement("style");
    style.id="m7-owner-media-editor-style";
    style.textContent=`
      #m7-owner-media-edit{display:none;min-height:34px;padding:0 10px;border:1px solid rgba(217,164,65,.42);border-radius:999px;background:rgba(217,164,65,.10);color:#f0ca6b;font:900 9px/1 Arial,"Segoe UI",sans-serif;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      #m7-owner-media-edit.visible{display:inline-flex;align-items:center;gap:5px}
      #m7-owner-media-sheet{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none!important;background:rgba(4,4,5,.98);color:#fff;overflow:auto;-webkit-overflow-scrolling:touch;padding:max(16px,env(safe-area-inset-top)) 12px max(24px,env(safe-area-inset-bottom));font-family:Arial,"Segoe UI",sans-serif}
      #m7-owner-media-sheet.open{display:block!important}.m7om-card{width:min(100%,640px);margin:0 auto;padding:15px;border:1px solid rgba(217,164,65,.30);border-radius:22px;background:linear-gradient(155deg,#15120f,#080809 72%);box-shadow:0 24px 70px rgba(0,0,0,.62)}
      .m7om-head{display:flex;gap:10px;align-items:flex-start;position:relative;padding-right:44px}.m7om-head b{font-size:18px}.m7om-head small{display:block;margin-top:4px;color:#978b79;font-size:9px;line-height:1.45}.m7om-close{position:absolute;right:0;top:-4px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:#111;color:#fff;font-size:23px;touch-action:manipulation}
      #m7-owner-media-quota{display:flex;flex-wrap:wrap;gap:7px;margin:13px 0}#m7-owner-media-quota span{padding:7px 9px;border:1px solid rgba(217,164,65,.20);border-radius:999px;background:rgba(217,164,65,.065);color:#aa9e8a;font-size:8px}#m7-owner-media-quota b{color:#f0ca6b;font-size:10px}
      .m7om-add{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:13px}.m7om-add button{min-height:46px;border:1px solid rgba(217,164,65,.34);border-radius:14px;background:rgba(217,164,65,.10);color:#f0ca6b;font-weight:900;font-size:10px;touch-action:manipulation}
      #m7-owner-media-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.m7om-list{display:grid;gap:8px}.m7om-item{display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:9px;align-items:center;padding:8px;border:1px solid rgba(255,255,255,.065);border-radius:15px;background:rgba(255,255,255,.025)}
      .m7om-thumb{width:72px;height:66px;border-radius:11px;overflow:hidden;background:#000;position:relative}.m7om-thumb img,.m7om-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-thumb em{position:absolute;left:4px;bottom:4px;padding:3px 5px;border-radius:999px;background:#000b;color:#e7c36d;font:900 6px/1 Arial;font-style:normal}
      .m7om-copy{min-width:0}.m7om-copy b,.m7om-copy small{display:block}.m7om-copy b{font-size:11px}.m7om-copy small{font-size:8px;color:#8f8474;margin-top:4px}.m7om-actions{display:grid;gap:5px}.m7om-actions button{min-height:31px;padding:0 8px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:#111;color:#ddd;font-size:8px;font-weight:900;touch-action:manipulation}.m7om-actions [data-delete]{color:#ff9696;border-color:rgba(255,80,80,.16)}
      .m7om-empty{padding:25px;text-align:center;border:1px dashed rgba(217,164,65,.20);border-radius:16px;color:#8e8373;font-size:9px}#m7-owner-media-status{min-height:20px;margin-top:10px;text-align:center;color:#a99b87;font-size:9px}#m7-owner-media-status[data-type="ok"]{color:#7ee3a0}#m7-owner-media-status[data-type="error"]{color:#ff8f8f}
      @media(max-width:600px){.m7om-card{border-radius:19px}.m7om-item{grid-template-columns:64px minmax(0,1fr)}.m7om-thumb{width:64px;height:62px}.m7om-actions{grid-column:1/-1;grid-template-columns:1fr 1fr}.m7om-actions button{min-height:40px}.m7om-add{grid-template-columns:1fr}.m7om-add button{min-height:50px}}
    `;
    document.head.appendChild(style);

    const edit=document.createElement("button");
    edit.id="m7-owner-media-edit";edit.type="button";edit.innerHTML="✎ Edit Media";heading.appendChild(edit);
    edit.addEventListener("click",openEditor);

    const sheet=document.createElement("div");
    sheet.id="m7-owner-media-sheet";sheet.setAttribute("aria-hidden","true");
    sheet.innerHTML='<div class="m7om-card"><div class="m7om-head"><div><b>Edit Media</b><small>Add, replace or delete your Gallery photos and videos. Uploaded files are removed from Storage when you replace/delete them.</small></div><button type="button" class="m7om-close" aria-label="Close">×</button></div><div id="m7-owner-media-quota"></div><div class="m7om-add"><button type="button" data-add="photo">＋ Add photos</button><button type="button" data-add="video">▶ Add videos</button></div><input id="m7-owner-media-file" type="file"><div id="m7-owner-media-list" class="m7om-list"></div><div id="m7-owner-media-status" aria-live="polite"></div></div>';
    document.body.appendChild(sheet);
    sheet.querySelector(".m7om-close").addEventListener("click",closeEditor);
    sheet.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>choose("add",b.dataset.add)));
    const file=sheet.querySelector("#m7-owner-media-file");
    file.addEventListener("change",async()=>{
      if(busy)return;
      busy=true;status(picker.mode==="replace"?"Replacing Media…":"Uploading Media…");
      try{
        if(picker.mode==="replace"){
          if(file.files?.[0])await replaceOne(picker.type,picker.id,file.files[0]);
        }else await addFiles(picker.type,file.files||[]);
        await loadRows();status("Media updated.","ok");
      }catch(error){status(error?.message||"Could not update Media.","error")}
      finally{busy=false}
    });
    sheet.addEventListener("click",async event=>{
      const item=event.target.closest(".m7om-item");if(!item)return;
      const type=item.dataset.type,id=item.dataset.id;
      if(event.target.closest("[data-replace]")){choose("replace",type,id);return}
      if(!event.target.closest("[data-delete]")||busy)return;
      if(!confirm("Delete this "+type+"? The uploaded file will also be removed from Storage."))return;
      busy=true;status("Deleting Media…");
      try{await deleteOne(type,id);await loadRows();status("Deleted.","ok")}
      catch(error){status(error?.message||"Could not delete Media.","error")}
      finally{busy=false}
    });
  }

  async function refresh(){
    inject();
    const c=await getClient();slug=await getSlug();
    if(!c||!slug)return;
    try{
      const user=(await c.auth.getUser()).data?.user;
      if(!user){owner=false;allowed=false;document.getElementById("m7-owner-media-edit")?.classList.remove("visible");return}
      const own=await c.from("shop_owners").select("shop_slug").eq("user_id",user.id).eq("shop_slug",slug).maybeSingle();
      if(own.error)throw own.error;
      owner=!!own.data;
      if(!owner){allowed=false;document.getElementById("m7-owner-media-edit")?.classList.remove("visible");return}
      await loadRows();
      document.getElementById("m7-owner-media-edit")?.classList.toggle("visible",allowed);
    }catch(error){
      owner=false;allowed=false;document.getElementById("m7-owner-media-edit")?.classList.remove("visible");
      console.warn("[ShoufHon owner media editor]",error);
    }
  }

  async function start(){
    for(let i=0;i<180&&!document.querySelector(".m7-media-heading-row");i++)await new Promise(r=>setTimeout(r,50));
    inject();await refresh();
    const c=await getClient();
    c?.auth?.onAuthStateChange?.(()=>setTimeout(refresh,80));
    window.addEventListener("focus",()=>setTimeout(refresh,80));
  }

  start().catch(error=>console.warn("[ShoufHon owner media editor]",error));
})();