
/* =========================================================
   SHOUFHON — OWNER MEDIA EDITOR V2
   Hostinger-safe iframe UI.
   Owner state comes from the parent page.
   Protected Media actions execute through story-upload-panel.js.
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_OWNER_MEDIA_EDITOR_V2__)return;
  window.__SHOUFHON_OWNER_MEDIA_EDITOR_V2__=true;

  let slug="";
  let mounted=false;
  let owner=false;
  let allowed=false;
  let busy=false;
  let changed=false;
  let snapshot={photos:[],videos:[],photoLimit:0,videoLimit:0};
  let pending=new Map();

  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

  async function resolveSlug(){
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

  function pageTarget(){
    try{
      if(window.top&&window.top!==window)return window.top;
    }catch(_){}
    try{
      if(window.parent&&window.parent!==window)return window.parent;
    }catch(_){}
    return null;
  }

  function portal(open){
    try{
      pageTarget()?.postMessage({type:open?"SHOUFHON_EMBED_VIEWER_OPEN":"SHOUFHON_EMBED_VIEWER_CLOSE"},"*");
    }catch(_){}
  }

  function ownerStateRequest(){
    try{
      pageTarget()?.postMessage({type:"MA7ALAK_OWNER_STATE_GET",shopSlug:slug},"*");
    }catch(_){}
  }

  function request(payload){
    return new Promise((resolve,reject)=>{
      const requestId=(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+"-"+Date.now();
      const timer=setTimeout(()=>{
        pending.delete(requestId);
        reject(new Error("Owner Media request timed out."));
      },45000);
      pending.set(requestId,{resolve,reject,timer});
      try{
        const target=pageTarget();
        if(!target)throw new Error("Owner page bridge is unavailable.");
        target.postMessage({type:"SHOUFHON_OWNER_MEDIA_REQUEST",requestId,shopSlug:slug,...payload},"*");
      }catch(error){
        clearTimeout(timer);pending.delete(requestId);reject(error);
      }
    });
  }

  function status(message,type=""){
    const el=document.getElementById("m7-owner-media-status");
    if(!el)return;
    el.textContent=message||"";
    el.dataset.type=type;
  }

  function render(){
    const quota=document.getElementById("m7-owner-media-quota");
    const list=document.getElementById("m7-owner-media-list");
    if(!quota||!list)return;

    quota.innerHTML='<span><b>'+snapshot.photos.length+'</b> / '+snapshot.photoLimit+' photos</span><span><b>'+snapshot.videos.length+'</b> / '+snapshot.videoLimit+' videos</span>';

    const items=[
      ...snapshot.photos.map(x=>({type:"photo",id:x.id,url:x.image_url,path:x.storage_path||"",featured:x.is_featured===true})),
      ...snapshot.videos.map(x=>({type:"video",id:x.id,url:x.video_url,path:x.storage_path||"",featured:false}))
    ];

    list.innerHTML=items.length?items.map(x=>
      '<article class="m7om-item" data-type="'+x.type+'" data-id="'+esc(x.id)+'">'+
        '<div class="m7om-thumb">'+
          (x.type==="video"
            ?'<video src="'+esc(x.url)+'" muted playsinline preload="metadata"></video><em>VIDEO</em>'
            :'<img src="'+esc(x.url)+'" alt=""><em>'+(x.featured?"FEATURED":"PHOTO")+'</em>')+
        '</div>'+
        '<div class="m7om-copy"><b>'+(x.type==="video"?"Video":"Photo")+'</b><small>'+(x.path?"Uploaded file":"URL media")+'</small></div>'+
        '<div class="m7om-actions"><button type="button" data-replace>Replace</button><button type="button" data-delete>Delete</button></div>'+
      '</article>'
    ).join(""):'<div class="m7om-empty">No Media yet. Add photos or videos above.</div>';
  }

  async function syncPermission(){
    if(!owner){allowed=false;document.getElementById("m7-owner-media-edit")?.classList.remove("visible");return}
    try{
      const data=await request({op:"load"});
      snapshot=data||snapshot;
      allowed=true;
      document.getElementById("m7-owner-media-edit")?.classList.add("visible");
      render();
    }catch(error){
      allowed=false;
      document.getElementById("m7-owner-media-edit")?.classList.remove("visible");
      if(/disabled by Admin/i.test(String(error?.message||"")))return;
      console.warn("[ShoufHon owner Media permission]",error);
    }
  }

  async function openEditor(){
    if(!owner)return;
    status("Loading Media…");
    try{
      const data=await request({op:"load"});
      snapshot=data||snapshot;allowed=true;render();
      document.getElementById("m7-owner-media-sheet")?.classList.add("open");
      portal(true);status("");
    }catch(error){
      allowed=false;
      document.getElementById("m7-owner-media-edit")?.classList.remove("visible");
      status(error?.message||"Could not open Media editor.","error");
    }
  }

  function closeEditor(){
    if(busy)return;
    document.getElementById("m7-owner-media-sheet")?.classList.remove("open");
    portal(false);
    if(changed){
      changed=false;
      setTimeout(()=>location.reload(),120);
    }
  }

  function choose(mode,type,id=""){
    if(busy||!allowed)return;
    const input=document.getElementById("m7-owner-media-file");
    if(!input)return;
    input.value="";
    input.dataset.mode=mode;
    input.dataset.type=type;
    input.dataset.id=id;
    input.multiple=mode==="add";
    input.accept=type==="video"?"video/mp4,video/webm,video/quicktime":"image/jpeg,image/png,image/webp,image/gif";
    input.click();
  }

  function inject(){
    const existing=document.getElementById("m7-owner-media-edit");
    if(existing){
      mounted=true;
      return;
    }
    const heading=document.querySelector(".m7-media-heading-row");
    if(!heading)return;
    mounted=true;

    const style=document.createElement("style");
    style.id="m7-owner-media-editor-style";
    style.textContent=`
      #m7-owner-media-edit{display:none;min-height:34px;padding:0 10px;border:1px solid rgba(217,164,65,.42);border-radius:999px;background:rgba(217,164,65,.10);color:#f0ca6b;font:900 9px/1 Arial,"Segoe UI",sans-serif;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      #m7-owner-media-edit.visible{display:inline-flex;align-items:center;gap:5px}
      #m7-owner-media-sheet{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none!important;background:rgba(4,4,5,.98);color:#fff;overflow:auto;-webkit-overflow-scrolling:touch;padding:max(16px,env(safe-area-inset-top)) 12px max(24px,env(safe-area-inset-bottom));font-family:Arial,"Segoe UI",sans-serif}
      #m7-owner-media-sheet.open{display:block!important}
      .m7om-card{width:min(100%,640px);margin:0 auto;padding:15px;border:1px solid rgba(217,164,65,.30);border-radius:22px;background:linear-gradient(155deg,#15120f,#080809 72%);box-shadow:0 24px 70px rgba(0,0,0,.62)}
      .m7om-head{display:flex;gap:10px;align-items:flex-start;position:relative;padding-right:44px}.m7om-head b{font-size:18px}.m7om-head small{display:block;margin-top:4px;color:#978b79;font-size:9px;line-height:1.45}
      .m7om-close{position:absolute;right:0;top:-4px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:#111;color:#fff;font-size:23px;touch-action:manipulation}
      #m7-owner-media-quota{display:flex;flex-wrap:wrap;gap:7px;margin:13px 0}#m7-owner-media-quota span{padding:7px 9px;border:1px solid rgba(217,164,65,.20);border-radius:999px;background:rgba(217,164,65,.065);color:#aa9e8a;font-size:8px}#m7-owner-media-quota b{color:#f0ca6b;font-size:10px}
      .m7om-add{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:13px}.m7om-add button{min-height:46px;border:1px solid rgba(217,164,65,.34);border-radius:14px;background:rgba(217,164,65,.10);color:#f0ca6b;font-weight:900;font-size:10px;touch-action:manipulation}
      #m7-owner-media-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
      .m7om-list{display:grid;gap:8px}.m7om-item{display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:9px;align-items:center;padding:8px;border:1px solid rgba(255,255,255,.065);border-radius:15px;background:rgba(255,255,255,.025)}
      .m7om-thumb{width:72px;height:66px;border-radius:11px;overflow:hidden;background:#000;position:relative}.m7om-thumb img,.m7om-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-thumb em{position:absolute;left:4px;bottom:4px;padding:3px 5px;border-radius:999px;background:#000b;color:#e7c36d;font:900 6px/1 Arial;font-style:normal}
      .m7om-copy{min-width:0}.m7om-copy b,.m7om-copy small{display:block}.m7om-copy b{font-size:11px}.m7om-copy small{font-size:8px;color:#8f8474;margin-top:4px}
      .m7om-actions{display:grid;gap:5px}.m7om-actions button{min-height:31px;padding:0 8px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:#111;color:#ddd;font-size:8px;font-weight:900;touch-action:manipulation}.m7om-actions [data-delete]{color:#ff9696;border-color:rgba(255,80,80,.16)}
      .m7om-empty{padding:25px;text-align:center;border:1px dashed rgba(217,164,65,.20);border-radius:16px;color:#8e8373;font-size:9px}
      #m7-owner-media-status{min-height:20px;margin-top:10px;text-align:center;color:#a99b87;font-size:9px}#m7-owner-media-status[data-type="ok"]{color:#7ee3a0}#m7-owner-media-status[data-type="error"]{color:#ff8f8f}
      @media(max-width:600px){.m7om-card{border-radius:19px}.m7om-item{grid-template-columns:64px minmax(0,1fr)}.m7om-thumb{width:64px;height:62px}.m7om-actions{grid-column:1/-1;grid-template-columns:1fr 1fr}.m7om-actions button{min-height:40px}.m7om-add{grid-template-columns:1fr}.m7om-add button{min-height:50px}}
    `;
    document.head.appendChild(style);

    const edit=document.createElement("button");
    edit.id="m7-owner-media-edit";
    edit.type="button";
    edit.innerHTML="✎ Edit Media";
    heading.appendChild(edit);
    edit.addEventListener("click",openEditor);

    const sheet=document.createElement("div");
    sheet.id="m7-owner-media-sheet";
    sheet.innerHTML='<div class="m7om-card"><div class="m7om-head"><div><b>Edit Media</b><small>Add, replace or delete Gallery photos and videos. Your Admin-set photo/video limits are enforced.</small></div><button type="button" class="m7om-close" aria-label="Close">×</button></div><div id="m7-owner-media-quota"></div><div class="m7om-add"><button type="button" data-add="photo">＋ Add photos</button><button type="button" data-add="video">▶ Add videos</button></div><input id="m7-owner-media-file" type="file"><div id="m7-owner-media-list" class="m7om-list"></div><div id="m7-owner-media-status" aria-live="polite"></div></div>';
    document.body.appendChild(sheet);

    sheet.querySelector(".m7om-close").addEventListener("click",closeEditor);
    sheet.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>choose("add",b.dataset.add)));

    const input=sheet.querySelector("#m7-owner-media-file");
    input.addEventListener("change",async()=>{
      if(busy)return;
      const files=[...(input.files||[])];
      if(!files.length)return;
      busy=true;
      status(input.dataset.mode==="replace"?"Replacing Media…":"Uploading Media…");
      try{
        const payload=input.dataset.mode==="replace"
          ?{op:"replace",mediaType:input.dataset.type,id:input.dataset.id,file:files[0]}
          :{op:"add",mediaType:input.dataset.type,files};
        const data=await request(payload);
        snapshot=data||snapshot;changed=true;render();status("Media updated.","ok");
      }catch(error){status(error?.message||"Could not update Media.","error")}
      finally{busy=false;input.value=""}
    });

    sheet.querySelector("#m7-owner-media-list").addEventListener("click",async event=>{
      const item=event.target.closest(".m7om-item");
      if(!item||busy)return;
      const type=item.dataset.type,id=item.dataset.id;
      if(event.target.closest("[data-replace]")){choose("replace",type,id);return}
      if(!event.target.closest("[data-delete]"))return;
      if(!confirm("Delete this "+type+"? Its uploaded Storage file will also be removed."))return;
      busy=true;status("Deleting Media…");
      try{
        const data=await request({op:"delete",mediaType:type,id});
        snapshot=data||snapshot;changed=true;render();status("Deleted.","ok");
      }catch(error){status(error?.message||"Could not delete Media.","error")}
      finally{busy=false}
    });
  }

  window.addEventListener("message",event=>{
    const data=event.data||{};
    if(data.type==="MA7ALAK_OWNER_STATE"){
      const incoming=String(data.shopSlug||"").trim().toLowerCase();
      owner=!!data.isOwner&&incoming===slug;
      if(!owner){
        allowed=false;
        document.getElementById("m7-owner-media-edit")?.classList.remove("visible");
      }else{
        syncPermission();
      }
      return;
    }
    if(data.type==="SHOUFHON_OWNER_MEDIA_RESULT"){
      const key=String(data.requestId||"");
      const job=pending.get(key);
      if(!job)return;
      clearTimeout(job.timer);pending.delete(key);
      if(data.ok)job.resolve(data.data);
      else job.reject(new Error(data.error||"Media action failed."));
    }
  });

  async function start(){
    for(let i=0;i<180&&!document.querySelector(".m7-media-heading-row");i++)await new Promise(r=>setTimeout(r,50));
    inject();
    await resolveSlug();
    ownerStateRequest();
    setTimeout(ownerStateRequest,350);
    setTimeout(ownerStateRequest,1200);
  }

  start().catch(error=>console.warn("[ShoufHon owner Media editor]",error));
})();
