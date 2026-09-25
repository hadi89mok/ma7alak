
/* =========================================================
   SHOUFHON — OWNER MEDIA EDITOR V3
   Hostinger-safe iframe UI.
   Owner state comes from the parent page.
   Protected Media actions execute through story-upload-panel.js.
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_OWNER_MEDIA_EDITOR_V3__)return;
  window.__SHOUFHON_OWNER_MEDIA_EDITOR_V3__=true;

  let slug="";
  let mounted=false;
  let owner=false;
  let allowed=false;
  let busy=false;
  let changed=false;
  let nativeFullscreenEntered=false;
  let closingEditor=false;
  let snapshot={photos:[],videos:[],albums:[],albumItems:[],photoLimit:0,videoLimit:0,albumLimit:8};
  let pending=new Map();
  let reviewUrls=[];

  function finiteLimit(value,fallback){
    if(value===null||value===undefined||value==="")return fallback;
    const n=Number(value);
    return Number.isFinite(n)
      ?Math.max(0,Math.min(100,Math.round(n)))
      :fallback;
  }

  function applySnapshot(data){
    if(!data||typeof data!=="object")return snapshot;

    snapshot={
      ...snapshot,
      ...data,
      photos:Array.isArray(data.photos)?data.photos:(snapshot.photos||[]),
      videos:Array.isArray(data.videos)?data.videos:(snapshot.videos||[]),
      albums:Array.isArray(data.albums)?data.albums:(snapshot.albums||[]),
      albumItems:Array.isArray(data.albumItems)?data.albumItems:(snapshot.albumItems||[]),
      photoLimit:finiteLimit(data.photoLimit,snapshot.photoLimit||6),
      videoLimit:finiteLimit(data.videoLimit,snapshot.videoLimit||2),
      albumLimit:finiteLimit(data.albumLimit,snapshot.albumLimit??8)
    };

    return snapshot;
  }

  function notifyMediaUpdated(reason){
    try{
      window.dispatchEvent(
        new CustomEvent(
          "shoufhon:owner-media-updated",
          {
            detail:{
              shopSlug:slug,
              reason:String(reason||"update"),
              snapshot
            }
          }
        )
      );
    }catch(_){}
  }

  function clearReviewUrls(){
    reviewUrls.forEach(url=>{
      try{URL.revokeObjectURL(url)}catch(_){}
    });
    reviewUrls=[];
  }

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

  function trustedParentEvent(event){
    const target=pageTarget();
    return !!(event&&target&&event.source===target);
  }

  function portal(open){
    try{
      pageTarget()?.postMessage({
        type:open?"SHOUFHON_EMBED_VIEWER_OPEN":"SHOUFHON_EMBED_VIEWER_CLOSE",
        viewerKind:"owner-media-editor",
        shopSlug:slug
      },"*");
    }catch(_){}
  }

  function editorSheet(){
    return document.getElementById("m7-owner-media-sheet");
  }

  function editorOpen(){
    return !!editorSheet()?.classList.contains("open");
  }

  function requestNativeFullscreen(sheet){
    if(!sheet)return;

    try{
      if(typeof sheet.requestFullscreen==="function"){
        const result=sheet.requestFullscreen({navigationUI:"hide"});
        Promise.resolve(result).catch(()=>{});
        return;
      }

      if(typeof sheet.webkitRequestFullscreen==="function"){
        const result=sheet.webkitRequestFullscreen();
        Promise.resolve(result).catch(()=>{});
      }
    }catch(_){}
  }

  function exitNativeFullscreen(){
    try{
      const current=
        document.fullscreenElement ||
        document.webkitFullscreenElement;

      if(!current)return;

      if(typeof document.exitFullscreen==="function"){
        const result=document.exitFullscreen();
        Promise.resolve(result).catch(()=>{});
        return;
      }

      if(typeof document.webkitExitFullscreen==="function"){
        const result=document.webkitExitFullscreen();
        Promise.resolve(result).catch(()=>{});
      }
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

  function mediaKey(type,id){
    return String(type==="video"?"video":"photo")+":"+String(id);
  }

  function mediaItems(){
    return[
      ...snapshot.photos.map(x=>({type:"photo",id:x.id,url:x.image_url,path:x.storage_path||"",featured:x.is_featured===true,sort:Number(x.sort_order)||0})),
      ...snapshot.videos.map(x=>({type:"video",id:x.id,url:x.video_url,path:x.storage_path||"",featured:false,sort:Number(x.sort_order)||0}))
    ];
  }

  function albumItemsFor(albumId){
    return (snapshot.albumItems||[])
      .filter(item=>String(item.album_id)===String(albumId))
      .slice()
      .sort((a,b)=>(Number(a.sort_order)||0)-(Number(b.sort_order)||0));
  }

  function albumMembership(){
    const map=new Map();
    const names=new Map((snapshot.albums||[]).map(album=>[String(album.id),String(album.title||"Album")]));
    (snapshot.albumItems||[]).forEach(item=>{
      map.set(mediaKey(item.media_type,item.media_id),{
        albumId:item.album_id,
        albumTitle:names.get(String(item.album_id))||"Album"
      });
    });
    return map;
  }

  function albumCover(album){
    const items=albumItemsFor(album.id);
    const cover=items.find(item=>item.is_cover===true)||items[0]||null;
    if(!cover)return null;
    return mediaItems().find(media=>mediaKey(media.type,media.id)===mediaKey(cover.media_type,cover.media_id))||null;
  }

  function render(){
    const sheet=editorSheet();
    const keepScroll=sheet?.classList.contains("open")
      ?sheet.scrollTop
      :0;

    const quota=document.getElementById("m7-owner-media-quota");
    const list=document.getElementById("m7-owner-media-list");
    const albumsBox=document.getElementById("m7-owner-media-albums");
    const albumButton=document.querySelector("[data-create-album]");
    if(!quota||!list||!albumsBox)return;

    const albums=snapshot.albums||[];
    const limit=Math.max(0,Number(snapshot.albumLimit)||0);

    quota.innerHTML=
      '<span><b>'+snapshot.photos.length+'</b> / '+snapshot.photoLimit+' photos</span>'+
      '<span><b>'+snapshot.videos.length+'</b> / '+snapshot.videoLimit+' videos</span>'+
      '<span><b>'+limit+'</b> max / album</span>';

    if(albumButton){
      albumButton.disabled=limit<2||mediaItems().length<2;
      albumButton.textContent=limit<2?"Albums disabled by Admin":"▣ Create album";
    }

    albumsBox.innerHTML=albums.length
      ? '<div class="m7om-section-title"><b>Albums</b><small>One album = one public Media frame.</small></div>'+
        albums.map(album=>{
          const members=albumItemsFor(album.id);
          const cover=albumCover(album);
          const coverHtml=cover
            ?(cover.type==="video"
              ?'<video src="'+esc(cover.url)+'" muted playsinline preload="metadata"></video>'
              :'<img src="'+esc(cover.url)+'" alt="">')
            :'<span class="m7om-album-placeholder">▣</span>';
          return '<article class="m7om-album" data-album-id="'+esc(album.id)+'">'+
            '<div class="m7om-album-cover">'+coverHtml+'<em>ALBUM · '+members.length+'</em></div>'+
            '<div class="m7om-album-copy"><b>'+esc(album.title||"Album")+'</b><small>'+esc(album.description||"Tap Edit to change items or cover.")+'</small></div>'+
            '<div class="m7om-actions"><button type="button" data-album-edit>Edit album</button><button type="button" data-album-delete>Ungroup</button></div>'+
          '</article>';
        }).join("")
      :"";

    const membership=albumMembership();
    const items=mediaItems();

    list.innerHTML=items.length
      ?'<div class="m7om-section-title"><b>Media library</b><small>Items inside an album still count toward your photo/video limits.</small></div>'+
       items.map(x=>{
         const member=membership.get(mediaKey(x.type,x.id));
         return '<article class="m7om-item" data-type="'+x.type+'" data-id="'+esc(x.id)+'">'+
           '<div class="m7om-thumb">'+
             (x.type==="video"
               ?'<video src="'+esc(x.url)+'" muted playsinline preload="metadata"></video><em>VIDEO</em>'
               :'<img src="'+esc(x.url)+'" alt=""><em>'+(x.featured?"FEATURED":"PHOTO")+'</em>')+
           '</div>'+
           '<div class="m7om-copy"><b>'+(x.type==="video"?"Video":"Photo")+'</b><small>'+(member?"In album · "+esc(member.albumTitle):(x.path?"Standalone · Uploaded file":"Standalone · URL media"))+'</small></div>'+
           '<div class="m7om-actions"><button type="button" data-replace>Replace</button><button type="button" data-delete>Delete</button></div>'+
         '</article>';
       }).join("")
      :'<div class="m7om-empty">No Media yet. Add photos or videos above.</div>';

    if(sheet?.classList.contains("open")){
      requestAnimationFrame(()=>{
        try{sheet.scrollTop=keepScroll}catch(_){}
      });
    }
  }

  async function refreshSnapshot(){
    const data=await request({op:"load"});
    applySnapshot(data);
    return snapshot;
  }

  async function openAlbumEditor(albumId=null){
    if(busy||!allowed)return;

    try{
      busy=true;
      status("Loading album…");
      await refreshSnapshot();
    }catch(error){
      status(error?.message||"Could not load album.","error");
      busy=false;
      return;
    }
    busy=false;

    const limit=Math.max(0,Number(snapshot.albumLimit)||0);
    if(limit<2){
      status("Albums are disabled by Admin.","error");
      return;
    }

    const all=mediaItems();
    if(all.length<2){
      status("Add at least 2 photos/videos before creating an album.","error");
      return;
    }

    const album=(snapshot.albums||[]).find(row=>String(row.id)===String(albumId))||null;
    const existing=album?albumItemsFor(album.id):[];
    const membership=albumMembership();
    const selectedOrder=existing.map(item=>mediaKey(item.media_type,item.media_id));
    const selected=new Set(selectedOrder);
    let coverKey=existing.find(item=>item.is_cover===true)
      ?mediaKey(existing.find(item=>item.is_cover===true).media_type,existing.find(item=>item.is_cover===true).media_id)
      :(selectedOrder[0]||"");

    document.getElementById("m7om-album-builder")?.remove();

    const builder=document.createElement("div");
    builder.id="m7om-album-builder";
    builder.innerHTML=
      '<div class="m7om-album-builder-card">'+
        '<div class="m7om-builder-head"><div><b>'+(album?"Edit album":"Create album")+'</b><small>Select 2–'+limit+' existing Media items. They stay in your normal photo/video quota.</small></div><button type="button" data-album-cancel aria-label="Close">×</button></div>'+
        '<label class="m7om-builder-field"><span>Album title</span><input data-album-title maxlength="80" value="'+esc(album?.title||"")+'" placeholder="e.g. Summer Collection"></label>'+
        '<label class="m7om-builder-field"><span>Short description <small>optional</small></span><textarea data-album-description maxlength="300" placeholder="What is inside this album?">'+esc(album?.description||"")+'</textarea></label>'+
        '<div class="m7om-builder-count" data-album-count></div>'+
        '<div class="m7om-choice-grid">'+
          all.map((media,index)=>{
            const key=mediaKey(media.type,media.id);
            const other=membership.get(key);
            const locked=!!other&&(!album||String(other.albumId)!==String(album.id));
            const thumb=media.type==="video"
              ?'<video src="'+esc(media.url)+'" muted playsinline preload="metadata"></video>'
              :'<img src="'+esc(media.url)+'" alt="">';
            return '<article class="m7om-choice '+(selected.has(key)?"selected ":"")+(locked?"locked":"")+'" data-album-choice="'+esc(key)+'" data-type="'+media.type+'" data-id="'+esc(media.id)+'">'+
              '<div class="m7om-choice-thumb">'+thumb+'<em>'+(media.type==="video"?"VIDEO":"PHOTO")+'</em></div>'+
              '<div class="m7om-choice-meta"><b>'+(media.type==="video"?"Video ":"Photo ")+(index+1)+'</b><small>'+(locked?"Already in "+esc(other.albumTitle):"Tap to "+(selected.has(key)?"remove":"add"))+'</small></div>'+
              (locked?'':'<button type="button" data-album-cover="'+esc(key)+'">'+(coverKey===key?"★ COVER":"☆ Cover")+'</button>')+
            '</article>';
          }).join("")+
        '</div>'+
        '<div class="m7om-builder-actions"><button type="button" data-album-cancel>Cancel</button><button type="button" class="primary" data-album-save>'+(album?"Save album":"Create album")+'</button></div>'+
        '<div class="m7om-builder-status" data-album-builder-status></div>'+
      '</div>';

    document.getElementById("m7-owner-media-sheet")?.appendChild(builder);

    const countEl=builder.querySelector("[data-album-count]");
    const sync=()=>{
      if(!selected.has(coverKey))coverKey=selectedOrder.find(key=>selected.has(key))||"";
      countEl.textContent=selected.size+" / "+limit+" selected";
      builder.querySelectorAll("[data-album-choice]").forEach(card=>{
        const key=card.dataset.albumChoice;
        card.classList.toggle("selected",selected.has(key));
        const small=card.querySelector(".m7om-choice-meta small");
        if(small&&!card.classList.contains("locked"))small.textContent=selected.has(key)?"Selected · tap card to remove":"Tap to add";
        const cover=card.querySelector("[data-album-cover]");
        if(cover)cover.textContent=coverKey===key?"★ COVER":"☆ Cover";
      });
    };
    sync();

    builder.addEventListener("click",async event=>{
      if(event.target.closest("[data-album-cancel]")){
        builder.remove();
        return;
      }

      const coverButton=event.target.closest("[data-album-cover]");
      if(coverButton){
        event.preventDefault();
        event.stopPropagation();
        const key=coverButton.dataset.albumCover;
        if(!selected.has(key)){
          if(selected.size>=limit){builder.querySelector("[data-album-builder-status]").textContent="Album limit reached.";return}
          selected.add(key);
          if(!selectedOrder.includes(key))selectedOrder.push(key);
        }
        coverKey=key;
        sync();
        return;
      }

      const choice=event.target.closest("[data-album-choice]");
      if(choice&&!choice.classList.contains("locked")){
        const key=choice.dataset.albumChoice;
        if(selected.has(key)){
          selected.delete(key);
        }else{
          if(selected.size>=limit){
            builder.querySelector("[data-album-builder-status]").textContent="Admin limit: maximum "+limit+" items in one album.";
            return;
          }
          selected.add(key);
          if(!selectedOrder.includes(key))selectedOrder.push(key);
        }
        sync();
        return;
      }

      const save=event.target.closest("[data-album-save]");
      if(!save)return;

      const title=String(builder.querySelector("[data-album-title]")?.value||"").trim();
      const description=String(builder.querySelector("[data-album-description]")?.value||"").trim();
      const statusBox=builder.querySelector("[data-album-builder-status]");

      if(!title){statusBox.textContent="Give the album a title.";return}
      if(selected.size<2){statusBox.textContent="Choose at least 2 Media items.";return}

      const items=selectedOrder
        .filter(key=>selected.has(key))
        .map(key=>{
          const [mediaType,mediaId]=key.split(":");
          return{mediaType,mediaId:Number(mediaId)};
        });

      const [coverType,coverId]=String(coverKey||mediaKey(items[0].mediaType,items[0].mediaId)).split(":");

      save.disabled=true;
      statusBox.textContent="Saving album…";
      try{
        const data=await request({
          op:"album-save",
          albumId:album?.id||null,
          title,
          description,
          items,
          cover:{mediaType:coverType,mediaId:Number(coverId)}
        });
        applySnapshot(data);
        changed=true;
        render();
        notifyMediaUpdated(album?"album-update":"album-create");
        builder.remove();
        status(album?"Album updated.":"Album created.","ok");
      }catch(error){
        statusBox.textContent=error?.message||"Could not save album.";
        save.disabled=false;
      }
    });
  }

  async function syncPermission(){
    if(!owner){allowed=false;document.getElementById("m7-owner-media-edit")?.classList.remove("visible");return}
    try{
      const data=await request({op:"load"});
      applySnapshot(data);
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

    const sheet=editorSheet();
    if(!sheet)return;

    /*
       Open immediately while the tap is still a user gesture:
       - the top-page portal can promote the Hostinger iframe
       - browsers that allow iframe fullscreen can hide browser chrome
       - loading happens after the editor is already visible
    */
    sheet.classList.add("open");
    portal(true);

    /*
       The parent portal already promotes this iframe to the real viewport.
       Avoid browser Fullscreen API here: native confirm/file dialogs can exit
       browser fullscreen and expose page sections underneath the editor.
    */
    status("Loading Media…");

    try{
      const data=await request({op:"load"});
      applySnapshot(data);
      allowed=true;
      render();
      status("");
    }catch(error){
      allowed=false;
      document.getElementById("m7-owner-media-edit")?.classList.remove("visible");
      status(error?.message||"Could not open Media editor.","error");
    }
  }

  function closeEditor(options={}){
    if(closingEditor)return;

    const fromPortalBack=options.fromPortalBack===true;
    const force=options.force===true;

    if(busy&&!force)return;

    closingEditor=true;

    document.getElementById("m7om-album-builder")?.remove();
    editorSheet()?.classList.remove("open");

    if(!fromPortalBack){
      portal(false);
    }

    if(nativeFullscreenEntered){
      nativeFullscreenEntered=false;
      exitNativeFullscreen();
    }

    clearReviewUrls();
    changed=false;

    /*
       Public Media updates live through Realtime + owner-media-updated.
       Never reload the iframe on close; reload was causing the page to jump
       up and then snap back to the Media section.
    */
    setTimeout(()=>{
      closingEditor=false;
    },40);
  }

  function removeReview(){
    clearReviewUrls();
    document.getElementById("m7om-media-review")?.remove();
  }

  function reviewVisual(file,type){
    const url=URL.createObjectURL(file);
    reviewUrls.push(url);

    return type==="video"
      ?'<video src="'+esc(url)+'" muted autoplay loop playsinline preload="metadata"></video>'
      :'<img src="'+esc(url)+'" alt="">';
  }

  function fileSizeText(file){
    const bytes=Number(file?.size||0);
    if(bytes>=1048576)return (bytes/1048576).toFixed(bytes>=10485760?0:1)+" MB";
    if(bytes>=1024)return Math.max(1,Math.round(bytes/1024))+" KB";
    return bytes+" B";
  }

  function openMediaReview({mode,type,id="",files,onConfirm}){
    removeReview();

    const sheet=editorSheet();
    if(!sheet||!Array.isArray(files)||!files.length)return;

    const review=document.createElement("div");
    review.id="m7om-media-review";

    const replacing=mode==="replace";

    review.innerHTML=
      '<div class="m7om-review-card">'+
        '<div class="m7om-review-head">'+
          '<div><b>'+(replacing?"Confirm replacement":"Confirm "+(type==="video"?"videos":"photos"))+'</b>'+
          '<small>'+(replacing?"Check the new file before replacing the current Media.":"Review what you selected before anything is uploaded.")+'</small></div>'+
          '<button type="button" data-review-cancel aria-label="Close">×</button>'+
        '</div>'+
        '<div class="m7om-review-grid">'+
          files.map((file,index)=>
            '<article class="m7om-review-item">'+
              '<div class="m7om-review-thumb">'+reviewVisual(file,type)+'</div>'+
              '<div class="m7om-review-copy"><b>'+(replacing?"New "+(type==="video"?"video":"photo"):(type==="video"?"Video ":"Photo ")+(index+1))+'</b>'+
              '<small>'+esc(file.name||"Selected file")+' · '+esc(fileSizeText(file))+'</small></div>'+
            '</article>'
          ).join("")+
        '</div>'+
        '<div class="m7om-review-actions">'+
          '<button type="button" data-review-cancel>Cancel</button>'+
          '<button type="button" class="primary" data-review-confirm>'+(replacing?"Replace Media":"Confirm & upload")+'</button>'+
        '</div>'+
        '<div class="m7om-review-status" data-review-status></div>'+
      '</div>';

    sheet.appendChild(review);

    review.addEventListener("click",async event=>{
      if(event.target.closest("[data-review-cancel]")){
        removeReview();
        return;
      }

      const confirmButton=event.target.closest("[data-review-confirm]");
      if(!confirmButton||busy)return;

      confirmButton.disabled=true;
      const statusBox=review.querySelector("[data-review-status]");
      statusBox.textContent=replacing?"Replacing Media…":"Uploading Media…";
      busy=true;

      try{
        await onConfirm();
        removeReview();
      }catch(error){
        statusBox.textContent=error?.message||"Could not update Media.";
        confirmButton.disabled=false;
      }finally{
        busy=false;
      }
    });
  }

  function openActionConfirm({title,text,confirmText="Confirm",danger=false,onConfirm}){
    removeReview();
    const sheet=editorSheet();
    if(!sheet)return;

    const review=document.createElement("div");
    review.id="m7om-media-review";
    review.innerHTML=
      '<div class="m7om-review-card compact">'+
        '<div class="m7om-review-head"><div><b>'+esc(title)+'</b><small>'+esc(text)+'</small></div><button type="button" data-review-cancel aria-label="Close">×</button></div>'+
        '<div class="m7om-review-actions">'+
          '<button type="button" data-review-cancel>Cancel</button>'+
          '<button type="button" class="primary '+(danger?"danger":"")+'" data-review-confirm>'+esc(confirmText)+'</button>'+
        '</div>'+
        '<div class="m7om-review-status" data-review-status></div>'+
      '</div>';
    sheet.appendChild(review);

    review.addEventListener("click",async event=>{
      if(event.target.closest("[data-review-cancel]")){
        removeReview();
        return;
      }
      const button=event.target.closest("[data-review-confirm]");
      if(!button||busy)return;
      button.disabled=true;
      busy=true;
      const statusBox=review.querySelector("[data-review-status]");
      statusBox.textContent="Working…";
      try{
        await onConfirm();
        removeReview();
      }catch(error){
        statusBox.textContent=error?.message||"Could not complete this action.";
        button.disabled=false;
      }finally{
        busy=false;
      }
    });
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
      #m7-media-showcase .m7-media-head{position:relative!important;width:calc(100% + 12px)!important;margin-left:-6px!important;margin-bottom:8px!important;padding:13px 13px 12px!important;border-radius:19px 19px 12px 12px!important;border-color:color-mix(in srgb,var(--m7-photo,#f2caed) 48%,transparent)!important;background:linear-gradient(180deg,color-mix(in srgb,var(--m7-media-header-bg,#100e0c) 92%,transparent),color-mix(in srgb,var(--m7-media-header-bg,#100e0c) 74%,transparent))!important;box-shadow:0 10px 25px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.035)!important}
      #m7-media-showcase .m7-media-head:after{content:"";position:absolute;left:16px;right:16px;bottom:-5px;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--m7-photo,#f2caed) 36%,transparent),transparent);pointer-events:none}
      #m7-media-showcase .m7-media-heading-row{align-items:center!important}
      #m7-owner-media-tools{display:flex;align-items:center;justify-content:flex-end;gap:7px;min-width:0}
      #m7-owner-media-tools .m7-media-counts{padding:0!important;text-align:right!important}
      #m7-media-showcase .m7-media-filters{margin-top:10px!important;gap:6px!important}
      #m7-media-showcase .m7-media-filter{min-height:32px!important;border-radius:9px!important;background:color-mix(in srgb,var(--m7-media-button-bg,#17130f) 88%,transparent)!important}
      #m7-media-showcase .m7-media-filter.active{box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 0 0 1px color-mix(in srgb,var(--m7-media-button-active-frame,#f2caed) 18%,transparent)!important}
      #m7-media-showcase .m7-media-hero{margin-top:0!important}
      #m7-owner-media-edit{display:none;align-items:center;gap:5px;min-height:31px;padding:0 9px;border:1px solid color-mix(in srgb,var(--m7-media-edit-frame,#d9a441) 72%,transparent);border-radius:10px;background:color-mix(in srgb,var(--m7-media-edit-bg,#17130f) 88%,transparent);color:var(--m7-media-edit-frame,#f0ca6b);font:900 8px/1 Arial,"Segoe UI",sans-serif;letter-spacing:.15px;box-shadow:inset 0 1px 0 rgba(255,255,255,.035);touch-action:manipulation;-webkit-tap-highlight-color:transparent;outline:none}
      #m7-owner-media-edit .m7ome-icon{font-size:12px;line-height:1}
      #m7-owner-media-edit:active{transform:scale(.97)}
      @media(max-width:520px){
        #m7-media-showcase .m7-media-head{padding:11px 10px 10px!important;margin-bottom:7px!important;border-radius:17px 17px 11px 11px!important}
        #m7-owner-media-tools{gap:5px}
        #m7-owner-media-tools .m7-media-counts{font-size:7px!important;max-width:72px;white-space:normal!important;line-height:1.2!important}
        #m7-owner-media-edit{min-height:30px;padding:0 8px;font-size:7.5px}
        #m7-media-showcase .m7-media-title{font-size:24px!important}
        #m7-media-showcase .m7-media-symbol{width:33px!important;height:33px!important;flex-basis:33px!important}
      }
      #m7-owner-media-edit.visible{display:inline-flex;align-items:center;gap:5px}
      #m7-owner-media-sheet{position:fixed!important;inset:0!important;width:100vw!important;width:100dvw!important;height:100vh!important;height:100dvh!important;z-index:2147483646!important;display:none!important;background:#050506!important;color:#fff!important;overflow:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;padding:max(10px,env(safe-area-inset-top)) 12px max(24px,env(safe-area-inset-bottom))!important;font-family:Arial,"Segoe UI",sans-serif!important;box-sizing:border-box!important}
      #m7-owner-media-sheet.open{display:block!important}
      #m7-owner-media-sheet:fullscreen,#m7-owner-media-sheet:-webkit-full-screen{width:100vw!important;width:100dvw!important;height:100vh!important;height:100dvh!important;background:#050506!important}
      .m7om-card{width:min(100%,640px);margin:0 auto;padding:15px;border:1px solid rgba(217,164,65,.30);border-radius:22px;background:linear-gradient(155deg,#15120f,#080809 72%);box-shadow:0 24px 70px rgba(0,0,0,.62)}
      .m7om-head{display:flex;gap:10px;align-items:flex-start;position:relative;padding-right:48px}.m7om-head b{font-size:18px}.m7om-head small{display:block;margin-top:4px;color:#978b79;font-size:9px;line-height:1.45}
      .m7om-close{position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;top:max(10px,env(safe-area-inset-top))!important;z-index:2147483647!important;width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid rgba(217,164,65,.38)!important;background:rgba(10,10,11,.94)!important;color:#fff!important;font-size:27px!important;line-height:1!important;display:grid!important;place-items:center!important;box-shadow:0 8px 24px rgba(0,0,0,.48)!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #m7-owner-media-quota{display:flex;flex-wrap:wrap;gap:7px;margin:13px 0}#m7-owner-media-quota span{padding:7px 9px;border:1px solid rgba(217,164,65,.20);border-radius:999px;background:rgba(217,164,65,.065);color:#aa9e8a;font-size:8px}#m7-owner-media-quota b{color:#f0ca6b;font-size:10px}
      .m7om-add{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-bottom:13px;padding:6px;border:1px solid rgba(217,164,65,.13);border-radius:16px;background:rgba(255,255,255,.018)}
      .m7om-add button{min-width:0;min-height:58px;padding:7px 4px;border:1px solid rgba(217,164,65,.22);border-radius:12px;background:linear-gradient(180deg,rgba(217,164,65,.09),rgba(217,164,65,.035));color:#f0ca6b;font-weight:900;font-size:8px;touch-action:manipulation;display:grid;place-items:center;align-content:center;gap:4px}
      .m7om-add button:before{display:block;font-size:19px;line-height:1}
      .m7om-add [data-add="photo"]:before{content:"▧"}
      .m7om-add [data-add="video"]:before{content:"▶"}
      .m7om-add [data-create-album]:before{content:"▣"}
      .m7om-add button:disabled{opacity:.36}
      #m7-owner-media-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
      .m7om-list{display:grid;gap:9px}.m7om-item{display:grid;grid-template-columns:104px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px;border:1px solid rgba(255,255,255,.065);border-radius:16px;background:rgba(255,255,255,.025)}
      .m7om-thumb{width:104px;height:88px;border-radius:12px;overflow:hidden;background:#000;position:relative}.m7om-thumb img,.m7om-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-thumb em{position:absolute;left:5px;bottom:5px;padding:4px 6px;border-radius:999px;background:#000c;color:#e7c36d;font:900 6px/1 Arial;font-style:normal}
      .m7om-copy{min-width:0}.m7om-copy b,.m7om-copy small{display:block}.m7om-copy b{font-size:12px}.m7om-copy small{font-size:8px;color:#8f8474;margin-top:4px;line-height:1.35}
      .m7om-actions{display:flex;gap:5px;align-items:center}.m7om-actions button{width:34px;height:34px;padding:0;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#111;color:#ddd;font-size:0;font-weight:900;touch-action:manipulation;display:grid;place-items:center}.m7om-actions button:before{font-size:13px;line-height:1}.m7om-actions [data-replace]:before{content:"↻"}.m7om-actions [data-delete]:before{content:"×"}.m7om-actions [data-delete]{color:#ff9696;border-color:rgba(255,80,80,.16)}
      .m7om-empty{padding:25px;text-align:center;border:1px dashed rgba(217,164,65,.20);border-radius:16px;color:#8e8373;font-size:9px}
      .m7om-section-title{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:13px 1px 7px}.m7om-section-title b{font-size:11px;color:#f2d18d}.m7om-section-title small{font-size:7px;color:#8f8474;text-align:right}
      #m7-owner-media-albums{display:grid;gap:8px;margin-bottom:12px}.m7om-album{display:grid;grid-template-columns:80px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px;border:1px solid rgba(217,164,65,.20);border-radius:16px;background:linear-gradient(145deg,rgba(217,164,65,.07),rgba(255,255,255,.018))}
      .m7om-album-cover{width:80px;height:68px;position:relative;overflow:hidden;border-radius:12px;background:#050505}.m7om-album-cover img,.m7om-album-cover video{width:100%;height:100%;object-fit:cover;display:block}.m7om-album-cover em{position:absolute;left:5px;bottom:5px;padding:4px 6px;border-radius:999px;background:#050505d9;color:#f0ca6b;font:900 6px/1 Arial;font-style:normal}.m7om-album-placeholder{display:grid;place-items:center;width:100%;height:100%;font-size:24px;color:#d9a441}
      .m7om-album-copy{min-width:0}.m7om-album-copy b{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7om-album-copy small{display:block;margin-top:4px;color:#938775;font-size:8px;line-height:1.35;max-height:2.7em;overflow:hidden}
      #m7om-album-builder{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.86);overflow:auto;padding:max(12px,env(safe-area-inset-top)) 10px max(18px,env(safe-area-inset-bottom));backdrop-filter:blur(9px)}
      .m7om-album-builder-card{width:min(100%,620px);margin:0 auto;padding:14px;border:1px solid rgba(217,164,65,.34);border-radius:20px;background:#0c0b0b;box-shadow:0 24px 70px rgba(0,0,0,.7)}
      .m7om-builder-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.m7om-builder-head b{font-size:18px}.m7om-builder-head small{display:block;margin-top:4px;color:#968a79;font-size:8px;line-height:1.4}.m7om-builder-head button{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:#151515;color:#fff;font-size:22px}
      .m7om-builder-field{display:block;margin-top:12px}.m7om-builder-field>span{display:block;margin-bottom:5px;color:#d7c5a2;font-size:8px;font-weight:900}.m7om-builder-field input,.m7om-builder-field textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:#060606;color:#fff;padding:10px;font:700 11px/1.35 Arial}.m7om-builder-field textarea{min-height:70px;resize:vertical}
      .m7om-builder-count{margin:11px 0 7px;color:#f0ca6b;font-size:9px;font-weight:900}
      .m7om-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.m7om-choice{min-width:0;padding:6px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:#111;cursor:pointer}.m7om-choice.selected{border-color:rgba(217,164,65,.72);box-shadow:0 0 0 1px rgba(217,164,65,.18) inset}.m7om-choice.locked{opacity:.42;cursor:not-allowed}
      .m7om-choice-thumb{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;border-radius:10px;background:#000}.m7om-choice-thumb img,.m7om-choice-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-choice-thumb em{position:absolute;left:4px;bottom:4px;padding:3px 5px;border-radius:999px;background:#000c;color:#f0ca6b;font:900 6px/1 Arial;font-style:normal}
      .m7om-choice-meta{padding:6px 2px 2px}.m7om-choice-meta b,.m7om-choice-meta small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7om-choice-meta b{font-size:8px}.m7om-choice-meta small{margin-top:3px;color:#857a6c;font-size:6.5px}.m7om-choice [data-album-cover]{width:100%;min-height:28px;margin-top:5px;border:1px solid rgba(217,164,65,.2);border-radius:8px;background:rgba(217,164,65,.07);color:#d9b461;font-size:7px;font-weight:900}
      .m7om-builder-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:8px;margin-top:12px}.m7om-builder-actions button{min-height:42px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:#121212;color:#ddd;font-weight:900}.m7om-builder-actions .primary{border-color:rgba(217,164,65,.5);background:#b98d39;color:#080706}.m7om-builder-status{min-height:18px;padding-top:7px;text-align:center;color:#ff9b91;font-size:8px}
      #m7om-media-review{position:fixed;inset:0;z-index:2147483647;display:grid;align-items:end;background:rgba(0,0,0,.76);backdrop-filter:blur(8px);padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom));overflow:auto}
      .m7om-review-card{width:min(100%,620px);max-height:min(84dvh,760px);overflow:auto;margin:auto auto 0;padding:14px;border:1px solid rgba(217,164,65,.34);border-radius:20px 20px 14px 14px;background:#0d0c0b;box-shadow:0 -18px 60px rgba(0,0,0,.65)}
      .m7om-review-card.compact{max-width:460px;margin:auto}
      .m7om-review-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.m7om-review-head b{font-size:17px}.m7om-review-head small{display:block;margin-top:4px;color:#968a79;font-size:8px;line-height:1.4}.m7om-review-head>button{width:34px;height:34px;flex:0 0 34px;border:1px solid rgba(255,255,255,.1);border-radius:50%;background:#171717;color:#fff;font-size:21px}
      .m7om-review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.m7om-review-item{min-width:0;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:#111;overflow:hidden}.m7om-review-thumb{width:100%;aspect-ratio:1.25/1;background:#000}.m7om-review-thumb img,.m7om-review-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-review-copy{padding:8px}.m7om-review-copy b,.m7om-review-copy small{display:block}.m7om-review-copy b{font-size:10px}.m7om-review-copy small{margin-top:3px;color:#8e8374;font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .m7om-review-actions{display:grid;grid-template-columns:1fr 1.45fr;gap:8px;margin-top:12px}.m7om-review-actions button{min-height:43px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:#141414;color:#ddd;font-weight:900}.m7om-review-actions .primary{border-color:rgba(217,164,65,.45);background:linear-gradient(135deg,#e0ae4e,#ba8431);color:#080706}.m7om-review-actions .primary.danger{border-color:rgba(255,88,88,.35);background:#7d2020;color:#fff}.m7om-review-status{min-height:17px;padding-top:7px;text-align:center;color:#ff9b91;font-size:8px}
      #m7-owner-media-status{min-height:20px;margin-top:10px;text-align:center;color:#a99b87;font-size:9px}#m7-owner-media-status[data-type="ok"]{color:#7ee3a0}#m7-owner-media-status[data-type="error"]{color:#ff8f8f}
      @media(max-width:600px){#m7-owner-media-sheet{padding-left:8px!important;padding-right:8px!important}.m7om-card{border-radius:19px;padding:12px}.m7om-item{grid-template-columns:92px minmax(0,1fr) auto}.m7om-album{grid-template-columns:86px minmax(0,1fr) auto}.m7om-thumb{width:92px;height:82px}.m7om-album-cover{width:86px;height:74px}.m7om-actions{grid-column:auto;display:flex}.m7om-actions button{width:33px;height:33px;min-height:33px}.m7om-add{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.m7om-add button{min-height:56px;padding:6px 2px;font-size:7.4px}.m7om-choice-grid,.m7om-review-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.m7om-review-card{padding:12px}}

      /*
         The Media embed intentionally treats a selected frame animation as
         authoritative. Its older blanket .m7-media-static rule accidentally
         cancelled those explicit Gallery/Video choices on Basic/Minimal shops.
         These later, more specific rules restore only the selected frame FX;
         unrelated ambient page motion stays disabled.
      */
      #m7-media-showcase.m7-media-static.m7-frame-anim-pulse .photo::after{animation:m7GalleryFramePulse var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFramePulse var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-frame-anim-wave .photo::after{animation:m7GalleryFrameWave var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameWave var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-frame-anim-glow .photo::after{animation:m7GalleryFrameGlow var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameGlow var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-frame-anim-shimmer .photo::after{animation:m7GalleryFrameShimmer var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameShimmer var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-frame-anim-breathe .photo::after{animation:m7GalleryFrameBreathe var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameBreathe var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-frame-anim-flicker .photo::after{animation:m7GalleryFrameFlicker var(--m7-gallery-frame-speed,3.2s) linear infinite!important;-webkit-animation:m7GalleryFrameFlicker var(--m7-gallery-frame-speed,3.2s) linear infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-anim-pulse .video::after{animation:m7VideoFramePulse var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFramePulse var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-anim-wave .video::after{animation:m7VideoFrameWave var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameWave var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-anim-glow .video::after{animation:m7VideoFrameGlow var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameGlow var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-anim-shimmer .video::after{animation:m7VideoFrameShimmer var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameShimmer var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-anim-breathe .video::after{animation:m7VideoFrameBreathe var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameBreathe var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-anim-flicker .video::after{animation:m7VideoFrameFlicker var(--m7-video-frame-speed,3.2s) linear infinite!important;-webkit-animation:m7VideoFrameFlicker var(--m7-video-frame-speed,3.2s) linear infinite!important}

      #m7-media-showcase.m7-media-static.m7-gallery-frame-layers.m7-frame-anim-pulse .photo .m7-media-frame-layer{animation:m7GalleryFramePulse var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFramePulse var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-gallery-frame-layers.m7-frame-anim-wave .photo .m7-media-frame-layer{animation:m7GalleryFrameWave var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameWave var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-gallery-frame-layers.m7-frame-anim-glow .photo .m7-media-frame-layer{animation:m7GalleryFrameGlow var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameGlow var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-gallery-frame-layers.m7-frame-anim-shimmer .photo .m7-media-frame-layer{animation:m7GalleryFrameShimmer var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameShimmer var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-gallery-frame-layers.m7-frame-anim-breathe .photo .m7-media-frame-layer{animation:m7GalleryFrameBreathe var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7GalleryFrameBreathe var(--m7-gallery-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-gallery-frame-layers.m7-frame-anim-flicker .photo .m7-media-frame-layer{animation:m7GalleryFrameFlicker var(--m7-gallery-frame-speed,3.2s) linear infinite!important;-webkit-animation:m7GalleryFrameFlicker var(--m7-gallery-frame-speed,3.2s) linear infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-layers.m7-video-frame-anim-pulse .video .m7-media-frame-layer{animation:m7VideoFramePulse var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFramePulse var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-layers.m7-video-frame-anim-wave .video .m7-media-frame-layer{animation:m7VideoFrameWave var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameWave var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-layers.m7-video-frame-anim-glow .video .m7-media-frame-layer{animation:m7VideoFrameGlow var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameGlow var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-layers.m7-video-frame-anim-shimmer .video .m7-media-frame-layer{animation:m7VideoFrameShimmer var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameShimmer var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-layers.m7-video-frame-anim-breathe .video .m7-media-frame-layer{animation:m7VideoFrameBreathe var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important;-webkit-animation:m7VideoFrameBreathe var(--m7-video-frame-speed,3.2s) ease-in-out infinite!important}
      #m7-media-showcase.m7-media-static.m7-video-frame-layers.m7-video-frame-anim-flicker .video .m7-media-frame-layer{animation:m7VideoFrameFlicker var(--m7-video-frame-speed,3.2s) linear infinite!important;-webkit-animation:m7VideoFrameFlicker var(--m7-video-frame-speed,3.2s) linear infinite!important}

      #m7-media-showcase.m7-media-effects-paused .photo::after,#m7-media-showcase.m7-media-effects-paused .video::after,#m7-media-showcase.m7-media-effects-paused .m7-media-frame-layer{animation-play-state:paused!important;-webkit-animation-play-state:paused!important}
    `;
    document.head.appendChild(style);

    /* Stop decorative frame work while this embed is off-screen or hidden. */
    const mediaRoot=document.getElementById("m7-media-showcase");
    if(mediaRoot&&!mediaRoot.__m7FrameVisibilityBound){
      mediaRoot.__m7FrameVisibilityBound=true;
      let onScreen=true;
      const syncFrameMotion=()=>mediaRoot.classList.toggle("m7-media-effects-paused",document.hidden||!onScreen);
      document.addEventListener("visibilitychange",syncFrameMotion,{passive:true});
      if("IntersectionObserver" in window){
        const frameObserver=new IntersectionObserver(entries=>{
          const entry=entries[entries.length-1];
          onScreen=!!entry?.isIntersecting;
          syncFrameMotion();
        },{threshold:[0,.02]});
        frameObserver.observe(mediaRoot);
      }
      syncFrameMotion();
    }

    const counts=heading.querySelector(".m7-media-counts");
    const tools=document.createElement("div");
    tools.id="m7-owner-media-tools";
    if(counts)tools.appendChild(counts);

    const edit=document.createElement("button");
    edit.id="m7-owner-media-edit";
    edit.type="button";
    edit.innerHTML='<span class="m7ome-icon" aria-hidden="true">✎</span><span>Edit</span>';
    tools.appendChild(edit);
    heading.appendChild(tools);
    edit.addEventListener("click",openEditor);

    const sheet=document.createElement("div");
    sheet.id="m7-owner-media-sheet";
    sheet.innerHTML='<div class="m7om-card"><div class="m7om-head"><div><b>Edit Media</b><small>Add photos/videos normally, or group existing Media into one clean album frame. Admin limits are enforced.</small></div><button type="button" class="m7om-close" aria-label="Close">×</button></div><div id="m7-owner-media-quota"></div><div class="m7om-add"><button type="button" data-add="photo">Photos</button><button type="button" data-add="video">Videos</button><button type="button" data-create-album>Album</button></div><input id="m7-owner-media-file" type="file"><div id="m7-owner-media-albums"></div><div id="m7-owner-media-list" class="m7om-list"></div><div id="m7-owner-media-status" aria-live="polite"></div></div>';
    document.body.appendChild(sheet);

    sheet.querySelector(".m7om-close").addEventListener("click",()=>closeEditor());
    sheet.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>choose("add",b.dataset.add)));
    sheet.querySelector("[data-create-album]")?.addEventListener("click",()=>openAlbumEditor(null));

    window.addEventListener("message",event=>{
      if(!trustedParentEvent(event))return;
      const data=event&&event.data||{};
      if(
        data.type!=="SHOUFHON_EMBED_VIEWER_BACK" ||
        data.viewerKind!=="owner-media-editor"
      )return;
      if(data.shopSlug&&slug&&String(data.shopSlug)!==String(slug))return;
      if(editorOpen())closeEditor({fromPortalBack:true,force:true});
    });

    const onFullscreenChange=()=>{
      const current=
        document.fullscreenElement ||
        document.webkitFullscreenElement;

      if(current===sheet){
        nativeFullscreenEntered=true;
        return;
      }

      if(nativeFullscreenEntered){
        nativeFullscreenEntered=false;
        if(editorOpen()&&!closingEditor){
          closeEditor();
        }
      }
    };

    document.addEventListener("fullscreenchange",onFullscreenChange);
    document.addEventListener("webkitfullscreenchange",onFullscreenChange);

    const input=sheet.querySelector("#m7-owner-media-file");
    input.addEventListener("change",()=>{
      if(busy)return;
      const files=[...(input.files||[])];
      if(!files.length)return;

      const mode=input.dataset.mode||"add";
      const type=input.dataset.type==="video"?"video":"photo";
      const id=input.dataset.id||"";

      openMediaReview({
        mode,
        type,
        id,
        files,
        onConfirm:async()=>{
          const payload=mode==="replace"
            ?{op:"replace",mediaType:type,id,file:files[0]}
            :{op:"add",mediaType:type,files};

          const data=await request(payload);
          applySnapshot(data);
          changed=true;
          render();
          notifyMediaUpdated(mode==="replace"?"replace":"add");
          status(mode==="replace"?"Media replaced.":"Media added.","ok");
          input.value="";
        }
      });
    });

    sheet.querySelector("#m7-owner-media-albums").addEventListener("click",async event=>{
      if(busy)return;
      const album=event.target.closest("[data-album-id]");
      if(!album)return;
      const albumId=album.dataset.albumId;

      if(event.target.closest("[data-album-edit]")){
        openAlbumEditor(albumId);
        return;
      }

      if(!event.target.closest("[data-album-delete]"))return;

      openActionConfirm({
        title:"Ungroup this album?",
        text:"The album frame will be removed, but every photo/video stays safely in the Media library.",
        confirmText:"Ungroup album",
        onConfirm:async()=>{
          const data=await request({op:"album-delete",albumId});
          applySnapshot(data);
          changed=true;
          render();
          notifyMediaUpdated("album-delete");
          status("Album removed. Media items are still available.","ok");
        }
      });
    });

    sheet.querySelector("#m7-owner-media-list").addEventListener("click",async event=>{
      const item=event.target.closest(".m7om-item");
      if(!item||busy)return;
      const type=item.dataset.type,id=item.dataset.id;
      if(event.target.closest("[data-replace]")){choose("replace",type,id);return}
      if(!event.target.closest("[data-delete]"))return;

      openActionConfirm({
        title:"Delete this "+type+"?",
        text:"This permanently removes the Media and its uploaded file. Albums containing it will update automatically.",
        confirmText:"Delete "+type,
        danger:true,
        onConfirm:async()=>{
          const data=await request({op:"delete",mediaType:type,id});
          applySnapshot(data);
          changed=true;
          render();
          notifyMediaUpdated("delete");
          status("Deleted.","ok");
        }
      });
    });
  }

  window.addEventListener("shoufhon:media-profile-options",event=>{
    const detail=event?.detail||{};
    if(
      detail.shopSlug &&
      slug &&
      String(detail.shopSlug)!==String(slug)
    ){
      return;
    }

    const options=
      detail.directory_options&&
      typeof detail.directory_options==="object"
        ?detail.directory_options
        :{};

    const number=(key,fallback)=>{
      const raw=options[key];
      if(raw===null||raw===undefined||raw==="")return fallback;
      const value=Number(raw);
      return Number.isFinite(value)
        ?Math.max(0,Math.min(100,Math.round(value)))
        :fallback;
    };

    snapshot.photoLimit=
      number("owner_media_photo_limit",snapshot.photoLimit||6);
    snapshot.videoLimit=
      number("owner_media_video_limit",snapshot.videoLimit||2);
    snapshot.albumLimit=
      number("owner_media_album_item_limit",snapshot.albumLimit??8);

    if(editorOpen())render();
  });

  window.addEventListener("message",event=>{
    if(!trustedParentEvent(event))return;
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
