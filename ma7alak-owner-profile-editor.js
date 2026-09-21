/* =========================================================
   SHOUFHON — OWNER PROFILE / BANNER EDITOR V1
   Loaded inside the manual Story/Profile embed.
   - Uses the existing + button as an owner action menu.
   - Admin-gated by directory_options.owner_profile_edit_enabled.
   - Uploads unique files to shop-gallery owner-profile/owner-banner.
   - Updates shop_profiles through owner_update_profile_media RPC.
   - Deletes replaced Storage objects after the DB update succeeds.
   - Phone-first: Samsung/Chromium/Brave + iOS Safari.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_OWNER_PROFILE_EDITOR_V1__)return;
  window.__SHOUFHON_OWNER_PROFILE_EDITOR_V1__=true;

  const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const BUCKET="shop-gallery";

  let client=null;
  let slug="";
  let owner=false;
  let allowed=false;
  let profile=null;
  let mounted=false;
  let busy=false;
  let profileFile=null;
  let bannerFile=null;

  const bool=v=>v===true||String(v||"").trim().toLowerCase()==="true"||String(v||"")==="1";

  function safeSlug(value){
    let next=String(value||"").trim().toLowerCase();
    try{next=decodeURIComponent(next)}catch(_){}
    next=next.replace(/^\/+|\/+$/g,"");
    return /^[a-z0-9][a-z0-9._&-]*$/i.test(next)?next:"";
  }

  function esc(value){
    return String(value==null?"":value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  async function getClient(){
    if(client)return client;

    try{
      if(window.Ma7alakAccount?.ready)await window.Ma7alakAccount.ready();
    }catch(_){}

    try{
      if(window.Ma7alakSupabaseBootstrap?.ready){
        client=await window.Ma7alakSupabaseBootstrap.ready();
      }
    }catch(_){}

    client=
      client||
      window.Ma7alakAccount?.client||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
      null;

    if(!client&&window.supabase?.createClient){
      client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    }

    return client;
  }

  async function resolveSlug(){
    if(slug)return slug;

    const shell=document.getElementById("ma7alak-profile-shell");
    const wrapper=document.getElementById("ma7alak-story-wrapper");
    slug=safeSlug(shell?.getAttribute("data-shop-slug")||wrapper?.getAttribute("data-shop-slug")||"");
    if(slug)return slug;

    try{
      const ctx=window.ShoufHonShopContextClient;
      if(ctx){
        slug=safeSlug(await ctx.resolve({
          explicit:"",
          fallback:()=>ctx.detectPageSlug(),
          timeout:1200
        }));
      }
    }catch(_){}

    return slug;
  }

  function extFor(file){
    const name=String(file?.name||"");
    const ext=(name.split(".").pop()||"").toLowerCase().replace(/[^a-z0-9]/g,"");
    if(ext&&ext.length<=8)return ext;
    const type=String(file?.type||"").toLowerCase();
    if(type.includes("png"))return "png";
    if(type.includes("webp"))return "webp";
    if(type.includes("gif"))return "gif";
    return "jpg";
  }

  function uniquePath(kind,file){
    const id=(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+"-"+Date.now();
    const prefix=kind==="banner"?"owner-banner":"owner-profile";
    return `${prefix}/${slug}/${id}.${extFor(file)}`;
  }

  function publicObjectPath(bucket,url){
    const raw=String(url||"").trim();
    if(!raw)return "";
    try{
      const parsed=new URL(raw,location.href);
      if(parsed.hostname!=="wdtaiuwtqdepzdamgsrs.supabase.co")return "";
      const marker=`/storage/v1/object/public/${bucket}/`;
      const idx=parsed.pathname.indexOf(marker);
      if(idx<0)return "";
      return decodeURIComponent(parsed.pathname.slice(idx+marker.length));
    }catch(_){return ""}
  }

  async function deleteStoragePath(path){
    const clean=String(path||"").trim();
    if(!clean)return;
    const result=await client.storage.from(BUCKET).remove([clean]);
    if(result.error)throw result.error;
  }

  function setStatus(message,type=""){
    const el=document.getElementById("m7-owner-profile-status");
    if(!el)return;
    el.textContent=message||"";
    el.dataset.type=type;
  }

  function postPortal(open){
    try{
      if(window.parent&&window.parent!==window){
        window.parent.postMessage({type:open?"SHOUFHON_EMBED_VIEWER_OPEN":"SHOUFHON_EMBED_VIEWER_CLOSE"},"*");
      }
    }catch(_){}
  }

  function closeMenu(){document.getElementById("m7-owner-profile-menu")?.classList.remove("open")}

  function openSheet(kind){
    closeMenu();
    profileFile=null;
    bannerFile=null;
    const sheet=document.getElementById("m7-owner-profile-sheet");
    if(!sheet)return;

    const isBanner=kind==="banner";
    sheet.dataset.kind=kind;
    sheet.querySelector("[data-m7op-title]").textContent=isBanner?"Change banner":"Change profile photo";
    sheet.querySelector("[data-m7op-copy]").textContent=isBanner
      ?"Choose a new banner from your phone. It replaces the current banner only after upload succeeds."
      :"Choose a new profile photo from your phone. It also becomes the image used by Show Shops.";

    const input=sheet.querySelector("#m7-owner-profile-file");
    input.value="";
    input.accept="image/jpeg,image/png,image/webp,image/gif";
    const current=isBanner
      ?String(profile?.directory_options?.profile_banner_image_url||"")
      :String(profile?.profile_image_url||"");
    const preview=sheet.querySelector("[data-m7op-preview]");
    preview.innerHTML=current?`<img src="${esc(current)}" alt="Current image">`:'<div class="m7op-empty">No current image</div>';
    sheet.querySelector("[data-m7op-save]").disabled=true;
    setStatus("");
    sheet.classList.add("open");
    postPortal(true);
  }

  function closeSheet(){
    if(busy)return;
    document.getElementById("m7-owner-profile-sheet")?.classList.remove("open");
    postPortal(false);
  }

  function updateLocalProfileImage(url){
    document.querySelectorAll("#ma7alak-story-preview img").forEach(img=>{img.src=url});
    try{
      window.dispatchEvent(new CustomEvent("ma7alak:owner-profile-media-updated",{detail:{shop_slug:slug,profile_image_url:url}}));
    }catch(_){}
  }

  function updateLocalBanner(url){
    const banner=document.getElementById("ma7alak-profile-banner");
    if(banner){
      banner.classList.add("visible");
      banner.style.setProperty("background-image",`url("${String(url).replace(/\\/g,"%5C").replace(/"/g,"%22")}")`,"important");
    }
    try{
      window.dispatchEvent(new CustomEvent("ma7alak:owner-profile-media-updated",{detail:{shop_slug:slug,profile_banner_image_url:url}}));
    }catch(_){}
  }

  async function saveSelected(){
    if(busy||!owner||!allowed)return;
    const sheet=document.getElementById("m7-owner-profile-sheet");
    const kind=sheet?.dataset.kind||"profile";
    const file=kind==="banner"?bannerFile:profileFile;
    if(!file)return;

    if(!file.type.startsWith("image/")){
      setStatus("Please choose an image file.","error");
      return;
    }

    if(file.size>12*1024*1024){
      setStatus("Image is too large. Maximum 12 MB.","error");
      return;
    }

    busy=true;
    const save=sheet.querySelector("[data-m7op-save]");
    save.disabled=true;
    save.textContent="Uploading…";
    setStatus("Uploading new image…");

    const oldUrl=kind==="banner"
      ?String(profile?.directory_options?.profile_banner_image_url||"")
      :String(profile?.profile_image_url||"");
    const oldPath=publicObjectPath(BUCKET,oldUrl);
    const newPath=uniquePath(kind,file);
    let uploaded=false;

    try{
      const upload=await client.storage.from(BUCKET).upload(newPath,file,{cacheControl:"0",upsert:false,contentType:file.type||undefined});
      if(upload.error)throw upload.error;
      uploaded=true;

      const publicUrl=client.storage.from(BUCKET).getPublicUrl(newPath).data.publicUrl;
      if(!publicUrl)throw new Error("Could not create the public image URL.");

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
        updateLocalProfileImage(publicUrl);
      }else{
        profile={...(profile||{}),directory_options:rpc.data?.directory_options||{...(profile?.directory_options||{}),profile_banner_image_url:publicUrl,profile_banner_enabled:true}};
        updateLocalBanner(publicUrl);
      }

      if(oldPath&&oldPath!==newPath){
        try{await deleteStoragePath(oldPath)}catch(error){console.warn("[ShoufHon owner profile] old file cleanup:",error)}
      }

      setStatus(kind==="banner"?"Banner updated.":"Profile photo updated everywhere.","ok");
      save.textContent="Saved ✓";
      setTimeout(()=>{
        busy=false;
        save.textContent="Save replacement";
        closeSheet();
      },700);
    }catch(error){
      if(uploaded){try{await deleteStoragePath(newPath)}catch(_){}}
      busy=false;
      save.disabled=false;
      save.textContent="Save replacement";
      setStatus(error?.message||"Could not update this image.","error");
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
      #m7-owner-profile-menu{position:absolute!important;right:calc(50% - 125px)!important;bottom:43px!important;z-index:240!important;width:min(245px,78vw)!important;padding:8px!important;border:1px solid rgba(217,164,65,.34)!important;border-radius:18px!important;background:linear-gradient(160deg,rgba(18,15,12,.98),rgba(7,7,8,.995))!important;box-shadow:0 18px 42px rgba(0,0,0,.58)!important;display:none!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
      #m7-owner-profile-menu.open{display:grid!important;gap:6px!important}
      #m7-owner-profile-menu button{min-height:44px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:13px!important;background:rgba(255,255,255,.045)!important;color:#fff!important;padding:8px 10px!important;text-align:left!important;display:flex!important;align-items:center!important;gap:10px!important;font:800 11px/1.2 Arial,"Segoe UI",sans-serif!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #m7-owner-profile-menu button i{width:31px;height:31px;border-radius:10px;display:grid;place-items:center;background:rgba(217,164,65,.12);color:#f2c967;font-style:normal;font-size:15px}
      #m7-owner-profile-menu button span{display:block}#m7-owner-profile-menu button small{display:block;color:#988d7d;font-size:8px;margin-top:3px;font-weight:650}
      #m7-owner-profile-sheet{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none!important;background:rgba(4,4,5,.96)!important;color:#fff!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;padding:max(18px,env(safe-area-inset-top)) 14px max(24px,env(safe-area-inset-bottom))!important;font-family:Arial,"Segoe UI",sans-serif!important}
      #m7-owner-profile-sheet.open{display:block!important}
      .m7op-card{width:min(100%,520px);margin:0 auto;padding:16px;border:1px solid rgba(217,164,65,.32);border-radius:24px;background:linear-gradient(155deg,#15120f,#080809 72%);box-shadow:0 22px 60px rgba(0,0,0,.58)}
      .m7op-head{display:flex;gap:10px;align-items:flex-start;padding-right:44px;position:relative}.m7op-head b{font-size:18px}.m7op-head small{display:block;color:#998c79;font-size:10px;line-height:1.45;margin-top:5px}
      .m7op-close{position:absolute;right:0;top:-3px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#fff;font-size:23px;touch-action:manipulation}
      .m7op-preview{margin:16px 0 12px;min-height:190px;border:1px dashed rgba(217,164,65,.32);border-radius:20px;background:#050506;display:grid;place-items:center;overflow:hidden}.m7op-preview img{display:block;width:100%;height:min(46vh,340px);object-fit:contain;background:#000}.m7op-empty{color:#817665;font-size:10px}
      .m7op-choose{display:flex!important;align-items:center!important;justify-content:center!important;min-height:48px!important;border:1px solid rgba(217,164,65,.38)!important;border-radius:15px!important;background:rgba(217,164,65,.11)!important;color:#f1c866!important;font-weight:900!important;font-size:11px!important;touch-action:manipulation!important}
      #m7-owner-profile-file{position:absolute;inline-size:1px;block-size:1px;opacity:0;pointer-events:none}
      .m7op-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.m7op-actions button{min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:#111;color:#fff;font-weight:900;touch-action:manipulation}.m7op-actions [data-m7op-save]{background:linear-gradient(135deg,#f0c864,#b57518);color:#171006;border-color:#efc65d}.m7op-actions button:disabled{opacity:.45}
      #m7-owner-profile-status{min-height:18px;margin-top:9px;text-align:center;color:#a99b87;font-size:9px}#m7-owner-profile-status[data-type="ok"]{color:#7ee3a0}#m7-owner-profile-status[data-type="error"]{color:#ff8f8f}
      @media(max-width:600px){#m7-owner-profile-menu{right:14px!important;bottom:43px!important;width:min(250px,82vw)!important}.m7op-card{border-radius:20px}.m7op-actions{grid-template-columns:1fr}.m7op-preview{min-height:160px}}
    `;
    document.head.appendChild(style);

    const menu=document.createElement("div");
    menu.id="m7-owner-profile-menu";
    menu.innerHTML=`
      <button type="button" data-m7op-action="story"><i>＋</i><span>Add Story<small>Photo or video Story</small></span></button>
      <button type="button" data-m7op-action="profile"><i>◉</i><span>Change profile photo<small>Also updates Show Shops</small></span></button>
      <button type="button" data-m7op-action="banner"><i>▰</i><span>Change banner<small>Replace the profile banner</small></span></button>
    `;
    plus.parentElement?.appendChild(menu);

    const sheet=document.createElement("div");
    sheet.id="m7-owner-profile-sheet";
    sheet.setAttribute("aria-hidden","true");
    sheet.innerHTML=`<div class="m7op-card">
      <div class="m7op-head"><div><b data-m7op-title>Change profile photo</b><small data-m7op-copy></small></div><button class="m7op-close" type="button" aria-label="Close">×</button></div>
      <div class="m7op-preview" data-m7op-preview></div>
      <input id="m7-owner-profile-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif">
      <label for="m7-owner-profile-file" class="m7op-choose">Choose image from phone</label>
      <div class="m7op-actions"><button type="button" data-m7op-cancel>Cancel</button><button type="button" data-m7op-save disabled>Save replacement</button></div>
      <div id="m7-owner-profile-status" aria-live="polite"></div>
    </div>`;
    document.body.appendChild(sheet);

    plus.addEventListener("click",event=>{
      if(!owner)return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      menu.classList.toggle("open");
    },true);

    menu.addEventListener("click",event=>{
      const button=event.target.closest("[data-m7op-action]");
      if(!button)return;
      event.preventDefault();
      event.stopPropagation();
      const action=button.dataset.m7opAction;
      if(action==="story"){
        closeMenu();
        try{
          window.parent.postMessage({type:"MA7ALAK_OPEN_STORY_UPLOADER",shopSlug:slug,__ma7alakOpenStoryNow:true},"*");
        }catch(_){}
        return;
      }
      if(!allowed){
        closeMenu();
        return;
      }
      openSheet(action);
    });

    const input=sheet.querySelector("#m7-owner-profile-file");
    input.addEventListener("change",()=>{
      const file=input.files?.[0]||null;
      if(!file)return;
      const kind=sheet.dataset.kind||"profile";
      if(kind==="banner")bannerFile=file;else profileFile=file;
      const preview=sheet.querySelector("[data-m7op-preview]");
      const local=URL.createObjectURL(file);
      preview.innerHTML=`<img src="${esc(local)}" alt="New image preview">`;
      sheet.querySelector("[data-m7op-save]").disabled=false;
      setStatus(`${file.name} ÷ ${(file.size/1024/1024).toFixed(1)} MB`);
    });

    sheet.querySelector(".m7op-close").addEventListener("click",closeSheet);
    sheet.querySelector("[data-m7op-cancel]").addEventListener("click",closeSheet);
    sheet.querySelector("[data-m7op-save]").addEventListener("click",saveSelected);

    document.addEventListener("click",event=>{
      if(menu.classList.contains("open")&&!menu.contains(event.target)&&event.target!==plus)closeMenu();
    });
  }

  async function refresh(){
    inject();
    const c=await getClient();
    slug=await resolveSlug();
    if(!c||!slug)return;

    try{
      const user=(await c.auth.getUser()).data?.user;
      if(!user){owner=false;allowed=false;return}

      const ownerResult=await c.from("shop_owners").select("shop_slug").eq("user_id",user.id).eq("shop_slug",slug).maybeSingle();
      if(ownerResult.error)throw ownerResult.error;
      owner=!!ownerResult.data;
      if(!owner){allowed=false;return}

      const profileResult=await c.from("shop_profiles").select("shop_slug,profile_image_url,story_logo_url,directory_options").eq("shop_slug",slug).maybeSingle();
      if(profileResult.error)throw profileResult.error;
      profile=profileResult.data||null;
      allowed=bool(profile?.directory_options/.owner_profile_edit_enabled);

      const menu=document.getElementById("m7-owner-profile-menu");
      if(menu){
        menu.querySelector('[data-m7op-action="profile"]')?.toggleAttribute("hidden",!allowed);
        menu.querySelector('[data-m7op-action="banner"]')?.toggleAttribute("hidden",allowed===false);
      }
    }catch(error){
      owner=false;allowed=false;
      console.warn("[ShoufHon owner profile editor]",error);
    }
  }

  async function start(){
    for(let i=0;i<180&&!document.getElementById("ma7alak-owner-add-story");i++){
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    inject();
    await refresh();
    const c=await getClient();
    c?.auth?.onAuthStateChange?.(()=>setTimeout(refresh,60));
    window.addEventListener("ma7alak:profile-design-saved",()=>setTimeout(refresh,60));
  }

  start().catch(error=>console.warn("[ShoufHon owner profile editor]",error));
})();
