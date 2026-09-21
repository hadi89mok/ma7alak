/* =========================================================
   SHOUFHON — OWNER PROFILE / BANNER EDITOR V1
   Companion for the manual Story/Profile embed.
   Phone-first owner self-service, Admin gated.
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_OWNER_PROFILE_EDITOR_V1__)return;
  window.__SHOUFHON_OWNER_PROFILE_EDITOR_V1__=true;

  const URL_="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const KEY_="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const BUCKET="shop-gallery";

  let client=null,slug="",owner=false,allowed=false,profile=null,mounted=false,busy=false;
  let selectedKind="profile",selectedFile=null;

  const bool=v=>v===true||["true","1","yes","on"].includes(String(v||"").trim().toLowerCase());
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
    const shell=document.getElementById("ma7alak-profile-shell");
    const wrap=document.getElementById("ma7alak-story-wrapper");
    slug=String(shell?.getAttribute("data-shop-slug")||wrap?.getAttribute("data-shop-slug")||"").trim().toLowerCase();
    if(slug)return slug;
    try{
      const ctx=window.ShoufHonShopContextClient;
      if(ctx)slug=String(await ctx.resolve({explicit:"",fallback:()=>ctx.detectPageSlug(),timeout:1200})||"").trim().toLowerCase();
    }catch(_){}
    return slug;
  }

  function ext(file){
    const e=String(file?.name||"").split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"");
    if(e&&e.length<=8)return e;
    const t=String(file?.type||"").toLowerCase();
    return t.includes("png")?"png":t.includes("webp")?"webp":t.includes("gif")?"gif":"jpg";
  }

  function newPath(kind,file){
    const id=(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+"-"+Date.now();
    return (kind==="banner"?"owner-banner/":"owner-profile/")+slug+"/"+id+"."+ext(file);
  }

  function publicPath(url){
    const raw=String(url||"").trim();
    if(!raw)return "";
    try{
      const u=new URL(raw,location.href);
      if(u.hostname!=="wdtaiuwtqdepzdamgsrs.supabase.co")return "";
      const marker="/storage/v1/object/public/"+BUCKET+"/";
      const at=u.pathname.indexOf(marker);
      return at<0?"":decodeURIComponent(u.pathname.slice(at+marker.length));
    }catch(_){return ""}
  }

  async function removePath(path){
    if(!path)return;
    const r=await client.storage.from(BUCKET).remove([path]);
    if(r.error)throw r.error;
  }

  function portal(open){
    try{
      if(window.parent&&window.parent!==window){
        window.parent.postMessage({type:open?"SHOUFHON_EMBED_VIEWER_OPEN":"SHOUFHON_EMBED_VIEWER_CLOSE"},"*");
      }
    }catch(_){}
  }

  function status(message,type=""){
    const el=document.getElementById("m7-owner-profile-status");
    if(!el)return;
    el.textContent=message||"";el.dataset.type=type;
  }

  function openMenu(){
    if(!owner)return;
    document.getElementById("m7-owner-profile-menu")?.classList.toggle("open");
  }
  function closeMenu(){document.getElementById("m7-owner-profile-menu")?.classList.remove("open")}

  function openSheet(kind){
    if(!allowed)return;
    selectedKind=kind;selectedFile=null;closeMenu();
    const sheet=document.getElementById("m7-owner-profile-sheet");
    if(!sheet)return;
    const banner=kind==="banner";
    sheet.querySelector("[data-title]").textContent=banner?"Change banner":"Change profile photo";
    sheet.querySelector("[data-copy]").textContent=banner
      ?"Choose a new banner from your phone. The old uploaded banner is removed after the new one saves."
      :"Choose a new profile image. It also becomes the image used by Show Shops.";
    const current=banner?String(profile?.directory_options?.profile_banner_image_url||""):String(profile?.profile_image_url||"");
    sheet.querySelector("[data-preview]").innerHTML=current?'<img src="'+esc(current)+'" alt="">':'<div class="m7op-empty">No current image</div>';
    const input=sheet.querySelector("#m7-owner-profile-file");input.value="";
    sheet.querySelector("[data-save]").disabled=true;
    status("");
    sheet.classList.add("open");sheet.setAttribute("aria-hidden","false");portal(true);
  }

  function closeSheet(){
    if(busy)return;
    const sheet=document.getElementById("m7-owner-profile-sheet");
    sheet?.classList.remove("open");sheet?.setAttribute("aria-hidden","true");portal(false);
  }

  function updateLocal(kind,url){
    if(kind==="profile"){
      document.querySelectorAll("#ma7alak-story-preview img,#ma7alak-story-button img,.ma7alak-story-profile-image").forEach(img=>img.src=url);
      try{window.dispatchEvent(new CustomEvent("ma7alak:owner-profile-media-updated",{detail:{shop_slug:slug,profile_image_url:url}}))}catch(_){}
    }else{
      const banner=document.getElementById("ma7alak-profile-banner");
      if(banner){
        banner.classList.add("visible");
        banner.style.setProperty("background-image",'url("'+String(url).replace(/"/g,"%22")+'")',"important");
      }
      try{window.dispatchEvent(new CustomEvent("ma7alak:owner-profile-media-updated",{detail:{shop_slug:slug,profile_banner_image_url:url}}))}catch(_){}
    }
  }

  async function save(){
    if(busy||!allowed||!selectedFile)return;
    if(!String(selectedFile.type||"").startsWith("image/")){status("Choose an image file.","error");return}
    if(selectedFile.size>12*1024*1024){status("Image is too large. Maximum 12 MB.","error");return}

    busy=true;
    const sheet=document.getElementById("m7-owner-profile-sheet");
    const button=sheet.querySelector("[data-save]");
    button.disabled=true;button.textContent="Uploading…";status("Uploading new image…");

    const kind=selectedKind;
    const oldUrl=kind==="banner"?String(profile?.directory_options?.profile_banner_image_url||""):String(profile?.profile_image_url||"");
    const oldPath=publicPath(oldUrl);
    const path=newPath(kind,selectedFile);
    let uploaded=false;

    try{
      const up=await client.storage.from(BUCKET).upload(path,selectedFile,{cacheControl:"0",upsert:false,contentType:selectedFile.type||undefined});
      if(up.error)throw up.error;uploaded=true;
      const publicUrl=client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      if(!publicUrl)throw new Error("Could not create image URL.");

      const rpc=await client.rpc("owner_update_profile_media",{
        p_shop_slug:slug,
        p_profile_image_url:kind==="profile"?publicUrl:null,
        p_banner_image_url:kind==="banner"?publicUrl:null,
        p_update_profile:kind==="profile",
        p_update_banner:kind==="banner"
      });
      if(rpc.error)throw rpc.error;

      if(kind==="profile"){
        profile={...(profile||{}),profile_image_url:publicUrl,story_logo_url:publicUrl,directory_options:rpc.data?.directory_options||profile?.directory_options||{}};
      }else{
        profile={...(profile||{}),directory_options:rpc.data?.directory_options||{...(profile?.directory_options||{}),profile_banner_image_url:publicUrl,profile_banner_enabled:true}};
      }
      updateLocal(kind,publicUrl);

      if(oldPath&&oldPath!==path){
        try{await removePath(oldPath)}catch(error){console.warn("[ShoufHon owner profile] old file cleanup:",error)}
      }

      status(kind==="banner"?"Banner updated.":"Profile photo updated everywhere.","ok");
      button.textContent="Saved ✓";
      setTimeout(()=>{busy=false;button.textContent="Save replacement";closeSheet()},650);
    }catch(error){
      if(uploaded)try{await removePath(path)}catch(_){}
      busy=false;button.disabled=false;button.textContent="Save replacement";
      status(error?.message||"Could not update image.","error");
    }
  }

  function inject(){
    if(mounted)return;
    const plus=document.getElementById("ma7alak-owner-add-story");
    if(!plus)return;
    mounted=true;

    const style=document.createElement("style");
    style.id="m7-owner-profile-editor-style";
    style.textContent=`
      #m7-owner-profile-menu{position:absolute!important;right:calc(50% - 125px)!important;bottom:43px!important;z-index:245!important;width:min(250px,82vw)!important;padding:8px!important;border:1px solid rgba(217,164,65,.34)!important;border-radius:18px!important;background:linear-gradient(160deg,rgba(18,15,12,.985),rgba(7,7,8,.995))!important;box-shadow:0 18px 46px rgba(0,0,0,.62)!important;display:none!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
      #m7-owner-profile-menu.open{display:grid!important;gap:6px!important}
      #m7-owner-profile-menu button{min-height:44px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:13px!important;background:rgba(255,255,255,.045)!important;color:#fff!important;padding:8px 10px!important;text-align:left!important;display:flex!important;align-items:center!important;gap:10px!important;font:800 11px/1.2 Arial,"Segoe UI",sans-serif!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #m7-owner-profile-menu button i{width:31px;height:31px;border-radius:10px;display:grid;place-items:center;background:rgba(217,164,65,.12);color:#f2c967;font-style:normal;font-size:15px}
      #m7-owner-profile-menu button small{display:block;color:#988d7d;font-size:8px;margin-top:3px;font-weight:650}
      #m7-owner-profile-sheet{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none!important;background:rgba(4,4,5,.97)!important;color:#fff!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;padding:max(18px,env(safe-area-inset-top)) 14px max(24px,env(safe-area-inset-bottom))!important;font-family:Arial,"Segoe UI",sans-serif!important}
      #m7-owner-profile-sheet.open{display:block!important}.m7op-card{width:min(100%,520px);margin:0 auto;padding:16px;border:1px solid rgba(217,164,65,.32);border-radius:24px;background:linear-gradient(155deg,#15120f,#080809 72%);box-shadow:0 22px 60px rgba(0,0,0,.6)}
      .m7op-head{display:flex;position:relative;padding-right:44px}.m7op-head b{font-size:18px}.m7op-head small{display:block;color:#998c79;font-size:10px;line-height:1.45;margin-top:5px}.m7op-close{position:absolute;right:0;top:-4px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:#111;color:#fff;font-size:23px;touch-action:manipulation}
      .m7op-preview{margin:16px 0 12px;min-height:180px;border:1px dashed rgba(217,164,65,.30);border-radius:20px;background:#050506;display:grid;place-items:center;overflow:hidden}.m7op-preview img{width:100%;height:min(45vh,340px);display:block;object-fit:contain;background:#000}.m7op-empty{color:#817665;font-size:10px}
      #m7-owner-profile-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.m7op-choose{display:flex;min-height:48px;align-items:center;justify-content:center;border:1px solid rgba(217,164,65,.38);border-radius:15px;background:rgba(217,164,65,.11);color:#f1c866;font-weight:900;font-size:11px;touch-action:manipulation}
      .m7op-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.m7op-actions button{min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:#111;color:#fff;font-weight:900;touch-action:manipulation}.m7op-actions [data-save]{background:linear-gradient(135deg,#f0c864,#b57518);color:#171006;border-color:#efc65d}.m7op-actions button:disabled{opacity:.45}
      #m7-owner-profile-status{min-height:18px;margin-top:9px;text-align:center;color:#aa9b87;font-size:9px}#m7-owner-profile-status[data-type="ok"]{color:#7ee3a0}#m7-owner-profile-status[data-type="error"]{color:#ff8f8f}
      @media(max-width:600px){#m7-owner-profile-menu{right:14px!important;width:min(260px,84vw)!important}.m7op-card{border-radius:20px}.m7op-actions{grid-template-columns:1fr}.m7op-actions button{min-height:50px}}
    `;
    document.head.appendChild(style);

    const menu=document.createElement("div");
    menu.id="m7-owner-profile-menu";
    menu.innerHTML='<button type="button" data-action="story"><i>＋</i><span>Add Story<small>Photo or video Story</small></span></button><button type="button" data-action="profile"><i>◉</i><span>Change profile photo<small>Also updates Show Shops</small></span></button><button type="button" data-action="banner"><i>▰</i><span>Change banner<small>Replace the profile banner</small></span></button>';
    plus.parentElement?.appendChild(menu);

    const sheet=document.createElement("div");
    sheet.id="m7-owner-profile-sheet";sheet.setAttribute("aria-hidden","true");
    sheet.innerHTML='<div class="m7op-card"><div class="m7op-head"><div><b data-title>Change profile photo</b><small data-copy></small></div><button type="button" class="m7op-close" aria-label="Close">×</button></div><div class="m7op-preview" data-preview></div><input id="m7-owner-profile-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif"><label class="m7op-choose" for="m7-owner-profile-file">Choose image from phone</label><div class="m7op-actions"><button type="button" data-cancel>Cancel</button><button type="button" data-save disabled>Save replacement</button></div><div id="m7-owner-profile-status" aria-live="polite"></div></div>';
    document.body.appendChild(sheet);

    // Capture beats the old Story-only click listener on the existing + button.
    plus.addEventListener("click",event=>{
      if(!owner)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();openMenu();
    },true);

    menu.addEventListener("click",event=>{
      const button=event.target.closest("[data-action]");if(!button)return;
      event.preventDefault();event.stopPropagation();
      const action=button.dataset.action;
      if(action==="story"){
        closeMenu();
        try{window.parent.postMessage({type:"MA7ALAK_OPEN_STORY_UPLOADER",shopSlug:slug,__ma7alakOpenStoryNow:true},"*")}catch(_){}
        return;
      }
      if(allowed)openSheet(action);
    });

    const input=sheet.querySelector("#m7-owner-profile-file");
    input.addEventListener("change",()=>{
      selectedFile=input.files?.[0]||null;if(!selectedFile)return;
      const local=URL.createObjectURL(selectedFile);
      sheet.querySelector("[data-preview]").innerHTML='<img src="'+esc(local)+'" alt="New image preview">';
      sheet.querySelector("[data-save]").disabled=false;
      status(selectedFile.name+" · "+(selectedFile.size/1024/1024).toFixed(1)+" MB");
    });
    sheet.querySelector(".m7op-close").addEventListener("click",closeSheet);
    sheet.querySelector("[data-cancel]").addEventListener("click",closeSheet);
    sheet.querySelector("[data-save]").addEventListener("click",save);
    document.addEventListener("click",event=>{if(menu.classList.contains("open")&&!menu.contains(event.target)&&event.target!==plus)closeMenu()});
  }

  async function refresh(){
    inject();
    const c=await getClient();slug=await getSlug();
    if(!c||!slug)return;
    try{
      const user=(await c.auth.getUser()).data?.user;
      if(!user){owner=false;allowed=false;closeMenu();return}
      const own=await c.from("shop_owners").select("shop_slug").eq("user_id",user.id).eq("shop_slug",slug).maybeSingle();
      if(own.error)throw own.error;
      owner=!!own.data;if(!owner){allowed=false;closeMenu();return}
      const p=await c.from("shop_profiles").select("shop_slug,profile_image_url,story_logo_url,directory_options").eq("shop_slug",slug).maybeSingle();
      if(p.error)throw p.error;
      profile=p.data||null;allowed=bool(profile?.directory_options?.owner_profile_edit_enabled);
      const menu=document.getElementById("m7-owner-profile-menu");
      menu?.querySelector('[data-action="profile"]')?.toggleAttribute("hidden",!allowed);
      menu?.querySelector('[data-action="banner"]')?.toggleAttribute("hidden",!allowed);
    }catch(error){owner=false;allowed=false;closeMenu();console.warn("[ShoufHon owner profile editor]",error)}
  }

  async function start(){
    for(let i=0;i<180&&!document.getElementById("ma7alak-owner-add-story");i++)await new Promise(r=>setTimeout(r,50));
    inject();await refresh();
    const c=await getClient();
    c?.auth?.onAuthStateChange?.(()=>setTimeout(refresh,80));
    window.addEventListener("ma7alak:profile-design-saved",()=>setTimeout(refresh,80));
  }

  start().catch(error=>console.warn("[ShoufHon owner profile editor]",error));
})();