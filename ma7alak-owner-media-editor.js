
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
  let librarySelectionMode="";
  let librarySelected=new Set();
  let suppressLibraryClickUntil=0;

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

  function clearLibrarySelection(){
    librarySelectionMode="";
    librarySelected.clear();
    syncLibrarySelectionUI();
  }

  function syncLibrarySelectionUI(){
    const sheet=editorSheet();
    const bar=document.getElementById("m7om-library-selection");
    if(!sheet||!bar)return;

    const active=!!librarySelectionMode;
    sheet.classList.toggle("m7om-selecting",active);

    document.querySelectorAll(".m7om-item").forEach(card=>{
      const key=String(card.dataset.selectKey||"");
      const relevant=librarySelectionMode==="media";
      card.classList.toggle("selection-mode",relevant);
      card.classList.toggle("delete-selected",relevant&&librarySelected.has(key));
    });

    document.querySelectorAll(".m7om-album").forEach(card=>{
      const key=String(card.dataset.selectKey||"");
      const relevant=librarySelectionMode==="album";
      card.classList.toggle("selection-mode",relevant);
      card.classList.toggle("delete-selected",relevant&&librarySelected.has(key));
    });

    bar.hidden=!active;
    const count=librarySelected.size;
    const countEl=bar.querySelector("[data-library-select-count]");
    const labelEl=bar.querySelector("[data-library-select-label]");
    const deleteButton=bar.querySelector("[data-library-select-delete]");

    if(countEl)countEl.textContent=count+" selected";
    if(labelEl){
      labelEl.textContent=librarySelectionMode==="album"
        ?"Albums"
        :"Photos & videos";
    }
    if(deleteButton){
      deleteButton.disabled=count===0;
      deleteButton.textContent=count
        ?"Delete "+count
        :"Delete";
    }
  }

  function startLibrarySelection(mode,key){
    librarySelectionMode=mode;
    librarySelected.clear();
    if(key)librarySelected.add(key);
    try{navigator.vibrate?.(22)}catch(_){}
    syncLibrarySelectionUI();
  }

  function toggleLibrarySelection(mode,key){
    if(librarySelectionMode!==mode){
      startLibrarySelection(mode,key);
      return;
    }
    if(librarySelected.has(key))librarySelected.delete(key);
    else librarySelected.add(key);
    if(librarySelected.size===0){
      clearLibrarySelection();
      return;
    }
    syncLibrarySelectionUI();
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
      const disabledByAdmin=limit<2;
      albumButton.disabled=disabledByAdmin;
      albumButton.textContent="Album";
      albumButton.title=disabledByAdmin
        ?"Albums disabled by Admin"
        :"Create a photo album from your device";
      albumButton.setAttribute(
        "aria-label",
        albumButton.title
      );
    }

    albumsBox.innerHTML=albums.length
      ? '<div class="m7om-section-title"><b>Albums</b><small>Tap to open · hold to select/delete.</small></div>'+
        '<div class="m7om-album-grid">'+
        albums.map(album=>{
          const members=albumItemsFor(album.id);
          const cover=albumCover(album);
          const coverHtml=cover
            ?(cover.type==="video"
              ?'<video src="'+esc(cover.url)+'" muted playsinline preload="metadata"></video>'
              :'<img src="'+esc(cover.url)+'" alt="">')
            :'<span class="m7om-album-placeholder">▣</span>';
          return '<article class="m7om-album" data-album-id="'+esc(album.id)+'" data-select-key="album:'+esc(album.id)+'">'+
            '<div class="m7om-album-cover">'+coverHtml+
              '<em>ALBUM · '+members.length+'</em>'+
              '<span class="m7om-select-check">✓</span>'+
            '</div>'+
            '<div class="m7om-album-copy"><b>'+esc(album.title||"Album")+'</b><small>'+esc(album.description||"Tap to open album")+'</small></div>'+
          '</article>';
        }).join("")+
        '</div>'
      :"";

    const membership=albumMembership();
    const items=mediaItems();

    list.innerHTML=items.length
      ?'<div class="m7om-section-title"><b>Media library</b><small>Hold one item, then tap more to select/deselect.</small></div>'+
       '<div class="m7om-media-grid">'+
       items.map(x=>{
         const member=membership.get(mediaKey(x.type,x.id));
         const key="media:"+x.type+":"+x.id;
         return '<article class="m7om-item" data-type="'+x.type+'" data-id="'+esc(x.id)+'" data-select-key="'+esc(key)+'">'+
           '<div class="m7om-thumb">'+
             (x.type==="video"
               ?'<video src="'+esc(x.url)+'" muted playsinline preload="metadata"></video><em>VIDEO</em>'
               :'<img src="'+esc(x.url)+'" alt=""><em>'+(x.featured?"FEATURED":"PHOTO")+'</em>')+
             '<span class="m7om-select-check">✓</span>'+
           '</div>'+
           '<div class="m7om-copy"><b>'+(x.type==="video"?"Video":"Photo")+'</b><small>'+(member?"In "+esc(member.albumTitle):(x.path?"Uploaded":"URL media"))+'</small></div>'+
         '</article>';
       }).join("")+
       '</div>'
      :'<div class="m7om-empty">No Media yet. Add photos or videos above.</div>';

    syncLibrarySelectionUI();

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

  function removeAlbumBuilder(){
    const builder=document.getElementById("m7om-album-builder");
    if(!builder)return;
    const urls=Array.isArray(builder.__m7AlbumObjectUrls)
      ?builder.__m7AlbumObjectUrls
      :[];
    urls.forEach(url=>{try{URL.revokeObjectURL(url)}catch(_){}});
    builder.remove();
  }

  async function openAlbumEditor(albumId=null){
    if(busy||!allowed)return;

    const limit=Math.max(0,Number(snapshot.albumLimit)||0);
    if(limit<2){
      status("Albums are disabled by Admin.","error");
      return;
    }

    /*
       Album opens from the snapshot already loaded by the Media editor.
       That keeps the tap instant instead of waiting on another database load.
       New album photos are selected directly from the phone/device.
    */
    const album=(snapshot.albums||[]).find(row=>String(row.id)===String(albumId))||null;
    if(albumId!==null&&!album){
      status("Album could not be found. Reopen Media and try again.","error");
      return;
    }

    const existingRows=album?albumItemsFor(album.id):[];
    const allMedia=mediaItems();
    let existingMedia=existingRows
      .map(row=>{
        const media=allMedia.find(item=>mediaKey(item.type,item.id)===mediaKey(row.media_type,row.media_id));
        return media?{row,media,key:mediaKey(row.media_type,row.media_id)}:null;
      })
      .filter(Boolean);

    const selectedExisting=new Set(existingMedia.map(item=>item.key));
    const originalCover=existingRows.find(item=>item.is_cover===true)||null;
    let coverToken=originalCover
      ?("existing:"+mediaKey(originalCover.media_type,originalCover.media_id))
      :(existingMedia[0]?("existing:"+existingMedia[0].key):"");

    let draftFiles=[];
    let draftUrls=[];

    removeAlbumBuilder();

    const builder=document.createElement("div");
    builder.id="m7om-album-builder";
    builder.__m7AlbumObjectUrls=draftUrls;

    const existingHtml=
      '<div class="m7om-builder-subhead" data-album-existing-head '+(existingMedia.length?"":"hidden")+'><b>Current album</b><small>Hold one image, then tap more to select/deselect for deletion.</small></div>'+
      '<div class="m7om-choice-grid" data-album-existing></div>';

    builder.innerHTML=
      '<div class="m7om-album-builder-card">'+
        '<div class="m7om-builder-head"><div><b>'+(album?"Edit album":"Create album")+'</b><small>'+(album
          ?"Add more photos directly from your phone, or remove current album items."
          :"Choose 2–"+limit+" photos directly from your phone/device. You do not need to add them to Media first.")+'</small></div><button type="button" data-album-cancel aria-label="Close">×</button></div>'+
        '<label class="m7om-builder-field"><span>Album title</span><input data-album-title maxlength="80" value="'+esc(album?.title||"")+'" placeholder="e.g. Summer Collection"></label>'+
        '<label class="m7om-builder-field"><span>Short description <small>optional</small></span><textarea data-album-description maxlength="300" placeholder="What is inside this album?">'+esc(album?.description||"")+'</textarea></label>'+
        '<div class="m7om-album-device-picker">'+
          '<button type="button" data-album-pick>＋ Choose photos from device</button>'+
          '<input data-album-file type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple>'+
          '<small>JPG, PNG, WEBP or GIF · album photos still use your normal photo allowance.</small>'+
        '</div>'+
        '<div class="m7om-builder-count" data-album-count></div>'+
        existingHtml+
        '<div class="m7om-builder-subhead" data-album-new-head hidden><b>New photos</b><small>Remove any mistake before saving. Choose one as the cover.</small></div>'+
        '<div class="m7om-choice-grid m7om-album-device-grid" data-album-drafts></div>'+
        '<div class="m7om-album-selection" data-album-selection hidden><div><b data-album-select-count>0 selected</b><small>Select or deselect photos</small></div><button type="button" data-album-select-cancel>Cancel</button><button type="button" class="danger" data-album-select-delete>Delete</button></div>'+
        '<div class="m7om-builder-actions"><button type="button" data-album-cancel>Cancel</button><button type="button" class="primary" data-album-save>'+(album?"Save album":"Create album")+'</button></div>'+
        '<div class="m7om-builder-status" data-album-builder-status></div>'+
      '</div>';

    document.getElementById("m7-owner-media-sheet")?.appendChild(builder);

    const countEl=builder.querySelector("[data-album-count]");
    const statusBox=builder.querySelector("[data-album-builder-status]");
    const fileInput=builder.querySelector("[data-album-file]");
    const pickButton=builder.querySelector("[data-album-pick]");
    const draftsBox=builder.querySelector("[data-album-drafts]");
    const existingBox=builder.querySelector("[data-album-existing]");
    const existingHead=builder.querySelector("[data-album-existing-head]");
    const newHead=builder.querySelector("[data-album-new-head]");
    const saveButton=builder.querySelector("[data-album-save]");
    const albumSelectionBar=builder.querySelector("[data-album-selection]");
    let albumSelectionActive=false;
    const albumDeleteSelected=new Set();
    let suppressAlbumClickUntil=0;

    const totalCount=()=>selectedExisting.size+draftFiles.length;

    const chooseFallbackCover=()=>{
      if(coverToken.startsWith("existing:")){
        const key=coverToken.slice(9);
        if(selectedExisting.has(key))return;
      }
      if(coverToken.startsWith("draft:")){
        const index=Number(coverToken.slice(6));
        if(Number.isInteger(index)&&index>=0&&index<draftFiles.length)return;
      }
      const firstExisting=existingMedia.find(entry=>selectedExisting.has(entry.key));
      coverToken=firstExisting
        ?("existing:"+firstExisting.key)
        :(draftFiles.length?"draft:0":"");
    };

    const renderExisting=()=>{
      existingHead.hidden=existingMedia.length===0;
      existingBox.innerHTML=existingMedia.map((entry,index)=>{
        const media=entry.media;
        const token="existing:"+entry.key;
        const thumb=media.type==="video"
          ?'<video src="'+esc(media.url)+'" muted playsinline preload="metadata"></video>'
          :'<img src="'+esc(media.url)+'" alt="">';
        return '<article class="m7om-choice selected '+(albumDeleteSelected.has(token)?"delete-selected ":"")+'" data-album-existing-choice="'+esc(entry.key)+'" data-album-select-token="'+esc(token)+'">'+
          '<div class="m7om-choice-thumb">'+thumb+'<em>'+(media.type==="video"?"VIDEO":"PHOTO")+'</em><span class="m7om-select-check">✓</span></div>'+
          '<div class="m7om-choice-meta"><b>'+(media.type==="video"?"Video ":"Photo ")+(index+1)+'</b><small>Saved in this album</small></div>'+
          '<button type="button" data-album-existing-cover="'+esc(entry.key)+'">'+(coverToken==="existing:"+entry.key?"★ COVER":"☆ Cover")+'</button>'+
        '</article>';
      }).join("");
    };

    const renderDrafts=()=>{
      newHead.hidden=draftFiles.length===0;
      draftsBox.innerHTML=draftFiles.map((file,index)=>{
        const token="draft:"+index;
        return '<article class="m7om-choice selected m7om-device-choice '+(albumDeleteSelected.has(token)?"delete-selected ":"")+'" data-album-draft="'+index+'" data-album-select-token="'+token+'">'+
          '<div class="m7om-choice-thumb"><img src="'+esc(draftUrls[index]||"")+'" alt=""><em>NEW</em><span class="m7om-select-check">✓</span></div>'+
          '<div class="m7om-choice-meta"><b>Photo '+(index+1)+'</b><small>'+esc(file.name||"Selected photo")+' · '+esc(fileSizeText(file))+'</small></div>'+
          '<div class="m7om-device-actions">'+
            '<button type="button" data-album-draft-cover="'+index+'">'+(coverToken==="draft:"+index?"★ COVER":"☆ Cover")+'</button>'+
          '</div>'+
        '</article>';
      }).join("");
    };

    const syncAlbumSelection=()=>{
      if(albumDeleteSelected.size===0)albumSelectionActive=false;
      builder.classList.toggle("m7om-album-selecting",albumSelectionActive);
      albumSelectionBar.hidden=!albumSelectionActive;
      const count=albumDeleteSelected.size;
      const countEl=albumSelectionBar.querySelector("[data-album-select-count]");
      const del=albumSelectionBar.querySelector("[data-album-select-delete]");
      if(countEl)countEl.textContent=count+" selected";
      if(del){
        del.disabled=count===0;
        del.textContent=count?"Delete "+count:"Delete";
      }
    };

    const sync=()=>{
      chooseFallbackCover();
      const total=totalCount();
      const remaining=Math.max(0,limit-total);
      const uploadAllowanceLeft=Math.max(
        0,
        Number(snapshot.photoLimit||0)-
        (snapshot.photos||[]).length-
        draftFiles.length
      );

      countEl.innerHTML=
        '<b>'+total+' / '+limit+' selected</b>'+
        '<span>'+remaining+' album spot'+(remaining===1?"":"s")+' left</span>'+
        (uploadAllowanceLeft<=0&&remaining>0
          ?'<em>Photo allowance full</em>'
          :'');
      countEl.dataset.full=remaining<=0?"true":"false";

      if(pickButton){
        pickButton.disabled=remaining<=0||uploadAllowanceLeft<=0;
        pickButton.textContent=remaining<=0
          ?'✓ Album full · '+total+' / '+limit
          :(uploadAllowanceLeft<=0
            ?'Photo allowance full'
            :'＋ Choose photos · '+remaining+' album spot'+(remaining===1?"":"s")+' left');
      }

      if(saveButton)saveButton.disabled=total<2||total>limit;

      renderExisting();
      renderDrafts();
      syncAlbumSelection();
    };

    builder.querySelector("[data-album-pick]")?.addEventListener("click",()=>{
      if(busy)return;
      fileInput.value="";
      fileInput.click();
    });

    fileInput?.addEventListener("change",()=>{
      if(busy)return;
      const incoming=[...(fileInput.files||[])];
      fileInput.value="";
      if(!incoming.length)return;

      const invalid=incoming.find(file=>!["image/jpeg","image/png","image/webp","image/gif"].includes(String(file.type||"").toLowerCase()));
      if(invalid){
        statusBox.textContent="Use JPG, PNG, WEBP or GIF photos.";
        return;
      }

      const albumSpace=Math.max(0,limit-totalCount());
      const photoSpace=Math.max(
        0,
        Number(snapshot.photoLimit||0)-
        (snapshot.photos||[]).length-
        draftFiles.length
      );
      const canAdd=Math.min(albumSpace,photoSpace);

      if(canAdd<=0){
        statusBox.textContent=albumSpace<=0
          ?"This album already reached its "+limit+" item limit."
          :"Your photo allowance is full. Delete a photo first or ask Admin to raise the limit.";
        return;
      }

      if(incoming.length>canAdd){
        statusBox.textContent="You can add "+canAdd+" more photo"+(canAdd===1?"":"s")+" right now.";
        return;
      }

      incoming.forEach(file=>{
        draftFiles.push(file);
        const url=URL.createObjectURL(file);
        draftUrls.push(url);
      });

      if(!coverToken&&draftFiles.length)coverToken="draft:0";
      statusBox.textContent="";
      sync();
    });

    builder.addEventListener("click",async event=>{
      if(event.target.closest("[data-album-cancel]")){
        removeAlbumBuilder();
        return;
      }

      const existingCover=event.target.closest("[data-album-existing-cover]");
      if(existingCover){
        event.preventDefault();
        event.stopPropagation();
        const key=existingCover.dataset.albumExistingCover;
        if(selectedExisting.has(key)){
          coverToken="existing:"+key;
          sync();
        }
        return;
      }

      const albumChoice=event.target.closest("[data-album-select-token]");
      if(
        albumChoice &&
        albumSelectionActive &&
        !event.target.closest("button") &&
        Date.now()>=suppressAlbumClickUntil
      ){
        const token=String(albumChoice.dataset.albumSelectToken||"");
        if(albumDeleteSelected.has(token))albumDeleteSelected.delete(token);
        else albumDeleteSelected.add(token);
        sync();
        return;
      }

      const draftCover=event.target.closest("[data-album-draft-cover]");
      if(draftCover){
        event.preventDefault();
        event.stopPropagation();
        const index=Number(draftCover.dataset.albumDraftCover);
        if(Number.isInteger(index)&&draftFiles[index]){
          coverToken="draft:"+index;
          sync();
        }
        return;
      }

      if(event.target.closest("[data-album-select-cancel]")){
        albumDeleteSelected.clear();
        albumSelectionActive=false;
        sync();
        return;
      }

      const deleteSelected=event.target.closest("[data-album-select-delete]");
      if(deleteSelected&&albumDeleteSelected.size&&!busy){
        const selectedTokens=[...albumDeleteSelected];
        const existingKeys=selectedTokens
          .filter(token=>token.startsWith("existing:"))
          .map(token=>token.slice(9));
        const draftIndexes=selectedTokens
          .filter(token=>token.startsWith("draft:"))
          .map(token=>Number(token.slice(6)))
          .filter(Number.isInteger)
          .sort((a,b)=>b-a);

        openActionConfirm({
          title:"Delete "+selectedTokens.length+" selected item"+(selectedTokens.length===1?"":"s")+"?",
          text:existingKeys.length
            ?"Saved photos/videos will be permanently deleted from Media. New unsaved photos will simply be removed from this album draft."
            :"These selected new photos will be removed from this album draft.",
          confirmText:"Delete selected",
          danger:true,
          onConfirm:async()=>{
            if(existingKeys.length){
              const payload=existingKeys.map(key=>{
                const parts=key.split(":");
                return{mediaType:parts[0]==="video"?"video":"photo",id:Number(parts[1])};
              });
              const data=await request({op:"batch-delete",items:payload});
              applySnapshot(data);
              existingMedia=existingMedia.filter(entry=>!existingKeys.includes(entry.key));
              existingKeys.forEach(key=>selectedExisting.delete(key));
              changed=true;
              notifyMediaUpdated("batch-delete");
            }

            draftIndexes.forEach(index=>{
              const url=draftUrls[index];
              try{if(url)URL.revokeObjectURL(url)}catch(_){}
              draftFiles.splice(index,1);
              draftUrls.splice(index,1);
            });

            coverToken="";
            albumDeleteSelected.clear();
            albumSelectionActive=false;
            statusBox.textContent="";
            sync();
          }
        });
        return;
      }

      const save=event.target.closest("[data-album-save]");
      if(!save||busy)return;

      const title=String(builder.querySelector("[data-album-title]")?.value||"").trim();
      const description=String(builder.querySelector("[data-album-description]")?.value||"").trim();
      const total=totalCount();

      if(!title){statusBox.textContent="Give the album a title.";return}
      if(total<2){statusBox.textContent="Choose at least 2 photos for the album.";return}
      if(total>limit){statusBox.textContent="Admin limit: maximum "+limit+" items in one album.";return}

      const keptItems=existingMedia
        .filter(entry=>selectedExisting.has(entry.key))
        .map(entry=>({
          mediaType:entry.row.media_type==="video"?"video":"photo",
          mediaId:Number(entry.row.media_id)
        }));

      let coverExisting=null;
      let coverNewIndex=null;

      if(coverToken.startsWith("existing:")){
        const key=coverToken.slice(9);
        const kept=existingMedia.find(entry=>entry.key===key&&selectedExisting.has(key));
        if(kept){
          coverExisting={
            mediaType:kept.row.media_type==="video"?"video":"photo",
            mediaId:Number(kept.row.media_id)
          };
        }
      }else if(coverToken.startsWith("draft:")){
        const index=Number(coverToken.slice(6));
        if(Number.isInteger(index)&&draftFiles[index])coverNewIndex=index;
      }

      save.disabled=true;
      statusBox.textContent=draftFiles.length
        ?"Uploading photos & saving album…"
        :"Saving album…";
      busy=true;

      try{
        const data=await request({
          op:"album-save-device",
          albumId:album?.id||null,
          title,
          description,
          items:keptItems,
          files:draftFiles,
          coverExisting,
          coverNewIndex
        });
        applySnapshot(data);
        changed=true;
        render();
        notifyMediaUpdated(album?"album-update":"album-create");
        removeAlbumBuilder();
        status(album?"Album updated.":"Album created.","ok");
      }catch(error){
        statusBox.textContent=error?.message||"Could not save album.";
        save.disabled=false;
      }finally{
        busy=false;
      }
    });

    let albumHoldTimer=0;
    let albumHoldX=0;
    let albumHoldY=0;
    let albumHoldCard=null;

    const cancelAlbumHold=()=>{
      if(albumHoldTimer){
        clearTimeout(albumHoldTimer);
        albumHoldTimer=0;
      }
      albumHoldCard=null;
    };

    builder.addEventListener("pointerdown",event=>{
      if(event.target.closest("button,input,textarea"))return;
      const card=event.target.closest("[data-album-select-token]");
      if(!card||busy)return;
      if(event.pointerType==="mouse"&&event.button!==0)return;

      cancelAlbumHold();
      albumHoldCard=card;
      albumHoldX=Number(event.clientX||0);
      albumHoldY=Number(event.clientY||0);

      albumHoldTimer=setTimeout(()=>{
        const held=albumHoldCard;
        albumHoldTimer=0;
        albumHoldCard=null;
        if(!held||busy)return;
        albumSelectionActive=true;
        const token=String(held.dataset.albumSelectToken||"");
        if(token)albumDeleteSelected.add(token);
        suppressAlbumClickUntil=Date.now()+450;
        try{navigator.vibrate?.(22)}catch(_){}
        sync();
      },520);
    });

    builder.addEventListener("pointermove",event=>{
      if(!albumHoldTimer)return;
      const dx=Number(event.clientX||0)-albumHoldX;
      const dy=Number(event.clientY||0)-albumHoldY;
      if(Math.hypot(dx,dy)>10)cancelAlbumHold();
    });
    ["pointerup","pointercancel","pointerleave"].forEach(type=>{
      builder.addEventListener(type,cancelAlbumHold);
    });
    builder.addEventListener("contextmenu",event=>{
      if(event.target.closest("[data-album-select-token]"))event.preventDefault();
    });

    sync();
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

    removeAlbumBuilder();
    clearLibrarySelection();
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
      html:has(#m7-owner-media-sheet.open),body:has(#m7-owner-media-sheet.open){margin:0!important;padding:0!important;width:100%!important;height:100%!important;min-height:100%!important;overflow:hidden!important;background:#050506!important}
      #m7-owner-media-sheet{position:fixed!important;inset:-1px!important;top:-1px!important;left:-1px!important;width:calc(100vw + 2px)!important;width:calc(100dvw + 2px)!important;height:calc(100vh + 2px)!important;height:calc(100dvh + 2px)!important;z-index:2147483646!important;display:none!important;background:#050506!important;color:#fff!important;overflow:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;padding:max(11px,env(safe-area-inset-top)) 13px max(25px,env(safe-area-inset-bottom))!important;font-family:Arial,"Segoe UI",sans-serif!important;box-sizing:border-box!important}
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
      .m7om-list{display:grid;gap:9px}.m7om-media-grid,.m7om-album-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      .m7om-item,.m7om-album{position:relative;min-width:0;padding:7px;border:1px solid rgba(255,255,255,.065);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;touch-action:pan-y}
      .m7om-item.delete-selected,.m7om-album.delete-selected{border-color:rgba(217,164,65,.82);box-shadow:0 0 0 2px rgba(217,164,65,.18) inset}
      .m7om-thumb,.m7om-album-cover{width:100%;aspect-ratio:1/1;border-radius:12px;overflow:hidden;background:#000;position:relative;user-select:none;-webkit-user-select:none;touch-action:pan-y;-webkit-touch-callout:none}
      .m7om-thumb img,.m7om-thumb video,.m7om-album-cover img,.m7om-album-cover video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;user-select:none;-webkit-user-select:none;-webkit-user-drag:none}.m7om-thumb em,.m7om-album-cover em{position:absolute;left:5px;bottom:5px;padding:4px 6px;border-radius:999px;background:#000c;color:#e7c36d;font:900 6px/1 Arial;font-style:normal}
      .m7om-copy,.m7om-album-copy{min-width:0;padding:8px 3px 4px}.m7om-copy b,.m7om-copy small,.m7om-album-copy b,.m7om-album-copy small{display:block}.m7om-copy b,.m7om-album-copy b{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7om-copy small,.m7om-album-copy small{font-size:7.5px;color:#8f8474;margin-top:4px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .m7om-select-check{position:absolute;right:7px;top:7px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;border:2px solid rgba(255,255,255,.72);background:rgba(0,0,0,.46);color:transparent;font-size:14px;font-weight:950;opacity:0;transform:scale(.8);transition:.15s ease;pointer-events:none}.selection-mode .m7om-select-check,.m7om-album-selecting .m7om-choice .m7om-select-check{opacity:1;transform:scale(1)}.delete-selected .m7om-select-check{background:#d9a441;border-color:#f3d98e;color:#111}
      .m7om-selection-bar{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483647;width:min(calc(100% - 20px),620px);display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:10px;border:1px solid rgba(217,164,65,.42);border-radius:16px;background:rgba(10,9,8,.97);box-shadow:0 18px 50px rgba(0,0,0,.65);backdrop-filter:blur(12px)}.m7om-selection-bar[hidden]{display:none!important}.m7om-selection-bar b,.m7om-selection-bar small{display:block}.m7om-selection-bar b{font-size:12px;color:#f2d18d}.m7om-selection-bar small{margin-top:2px;font-size:7px;color:#8f8474}.m7om-selection-bar button{min-height:38px;padding:0 12px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:#151515;color:#ddd;font-weight:900}.m7om-selection-bar .danger{border-color:rgba(255,95,95,.3);background:#7d2020;color:#fff}.m7om-selection-bar button:disabled{opacity:.4}
      .m7om-empty{padding:25px;text-align:center;border:1px dashed rgba(217,164,65,.20);border-radius:16px;color:#8e8373;font-size:9px}
      .m7om-section-title{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:13px 1px 7px}.m7om-section-title b{font-size:11px;color:#f2d18d}.m7om-section-title small{font-size:7px;color:#8f8474;text-align:right}
      #m7-owner-media-albums{display:grid;gap:8px;margin-bottom:12px}.m7om-album{border-color:rgba(217,164,65,.20);background:linear-gradient(145deg,rgba(217,164,65,.07),rgba(255,255,255,.018))}.m7om-album-placeholder{display:grid;place-items:center;width:100%;height:100%;font-size:24px;color:#d9a441}
      #m7om-album-builder{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.86);overflow:auto;padding:max(12px,env(safe-area-inset-top)) 10px max(18px,env(safe-area-inset-bottom));backdrop-filter:blur(9px)}
      .m7om-album-builder-card{width:min(100%,620px);margin:0 auto;padding:14px;border:1px solid rgba(217,164,65,.34);border-radius:20px;background:#0c0b0b;box-shadow:0 24px 70px rgba(0,0,0,.7)}
      .m7om-builder-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.m7om-builder-head b{font-size:18px}.m7om-builder-head small{display:block;margin-top:4px;color:#968a79;font-size:8px;line-height:1.4}.m7om-builder-head button{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:#151515;color:#fff;font-size:22px}
      .m7om-builder-field{display:block;margin-top:12px}.m7om-builder-field>span{display:block;margin-bottom:5px;color:#d7c5a2;font-size:8px;font-weight:900}.m7om-builder-field input,.m7om-builder-field textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:#060606;color:#fff;padding:10px;font:700 11px/1.35 Arial}.m7om-builder-field textarea{min-height:70px;resize:vertical}
      .m7om-album-device-picker{display:grid;grid-template-columns:1fr;gap:6px;margin-top:12px;padding:10px;border:1px dashed rgba(217,164,65,.32);border-radius:14px;background:rgba(217,164,65,.045)}
      .m7om-album-device-picker>button{min-height:46px;border:1px solid rgba(217,164,65,.45);border-radius:12px;background:linear-gradient(135deg,rgba(224,174,78,.18),rgba(186,132,49,.10));color:#f2cf80;font-size:11px;font-weight:950;touch-action:manipulation}
      .m7om-album-device-picker>input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
      .m7om-album-device-picker>small{color:#8f8371;font-size:8px;line-height:1.35;text-align:center}
      .m7om-builder-count{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:11px 0 7px;color:#f0ca6b;font-size:10px;font-weight:900}
      .m7om-builder-count b{font-size:11px;color:#f5d88f}
      .m7om-builder-count span{padding:4px 7px;border:1px solid rgba(217,164,65,.22);border-radius:999px;background:rgba(217,164,65,.07);color:#d9b461;font-size:8.5px}
      .m7om-builder-count em{padding:4px 7px;border:1px solid rgba(255,104,104,.24);border-radius:999px;background:rgba(255,84,84,.06);color:#ff9d9d;font-size:8px;font-style:normal}
      .m7om-builder-count[data-full="true"] span{color:#86dda1;border-color:rgba(94,214,130,.24);background:rgba(94,214,130,.06)}
      .m7om-builder-subhead{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:10px 1px 7px}.m7om-builder-subhead b{color:#f2d18d;font-size:10px}.m7om-builder-subhead small{max-width:68%;color:#8f8474;font-size:7.5px;line-height:1.3;text-align:right}
      .m7om-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.m7om-choice{min-width:0;padding:6px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:#111;cursor:pointer}.m7om-choice.selected{border-color:rgba(217,164,65,.72);box-shadow:0 0 0 1px rgba(217,164,65,.18) inset}.m7om-choice.removed{opacity:.46}.m7om-choice.locked{opacity:.42;cursor:not-allowed}
      .m7om-choice-thumb{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;border-radius:10px;background:#000}.m7om-choice-thumb img,.m7om-choice-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-choice-thumb em{position:absolute;left:4px;bottom:4px;padding:3px 5px;border-radius:999px;background:#000c;color:#f0ca6b;font:900 6px/1 Arial;font-style:normal}
      .m7om-choice-meta{padding:6px 2px 2px}.m7om-choice-meta b,.m7om-choice-meta small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7om-choice-meta b{font-size:8px}.m7om-choice-meta small{margin-top:3px;color:#857a6c;font-size:6.5px}.m7om-choice [data-album-existing-cover]{width:100%;min-height:28px;margin-top:5px;border:1px solid rgba(217,164,65,.2);border-radius:8px;background:rgba(217,164,65,.07);color:#d9b461;font-size:7px;font-weight:900}
      .m7om-device-actions{display:grid;grid-template-columns:1fr;gap:5px;margin-top:5px}.m7om-device-actions button{min-height:28px;border:1px solid rgba(217,164,65,.2);border-radius:8px;background:rgba(217,164,65,.07);color:#d9b461;font-size:7px;font-weight:900}
      .m7om-album-selection{position:sticky;bottom:8px;z-index:8;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:7px;align-items:center;margin-top:12px;padding:9px;border:1px solid rgba(217,164,65,.4);border-radius:14px;background:rgba(9,8,7,.96);box-shadow:0 14px 35px rgba(0,0,0,.5)}.m7om-album-selection[hidden]{display:none!important}.m7om-album-selection b,.m7om-album-selection small{display:block}.m7om-album-selection b{font-size:11px;color:#f0ca6b}.m7om-album-selection small{font-size:7px;color:#8f8474;margin-top:2px}.m7om-album-selection button{min-height:36px;padding:0 10px;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:#151515;color:#ddd;font-weight:900}.m7om-album-selection .danger{background:#7d2020;border-color:rgba(255,94,94,.28);color:#fff}
      .m7om-builder-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:8px;margin-top:12px}.m7om-builder-actions button{min-height:42px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:#121212;color:#ddd;font-weight:900}.m7om-builder-actions .primary{border-color:rgba(217,164,65,.5);background:#b98d39;color:#080706}.m7om-builder-status{min-height:18px;padding-top:7px;text-align:center;color:#ff9b91;font-size:8px}
      #m7om-media-review{position:fixed;inset:0;z-index:2147483647;display:grid;align-items:end;background:rgba(0,0,0,.76);backdrop-filter:blur(8px);padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom));overflow:auto}
      .m7om-review-card{width:min(100%,620px);max-height:min(84dvh,760px);overflow:auto;margin:auto auto 0;padding:14px;border:1px solid rgba(217,164,65,.34);border-radius:20px 20px 14px 14px;background:#0d0c0b;box-shadow:0 -18px 60px rgba(0,0,0,.65)}
      .m7om-review-card.compact{max-width:460px;margin:auto}
      .m7om-review-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.m7om-review-head b{font-size:17px}.m7om-review-head small{display:block;margin-top:4px;color:#968a79;font-size:8px;line-height:1.4}.m7om-review-head>button{width:34px;height:34px;flex:0 0 34px;border:1px solid rgba(255,255,255,.1);border-radius:50%;background:#171717;color:#fff;font-size:21px}
      .m7om-review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.m7om-review-item{min-width:0;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:#111;overflow:hidden}.m7om-review-thumb{width:100%;aspect-ratio:1.25/1;background:#000}.m7om-review-thumb img,.m7om-review-thumb video{width:100%;height:100%;object-fit:cover;display:block}.m7om-review-copy{padding:8px}.m7om-review-copy b,.m7om-review-copy small{display:block}.m7om-review-copy b{font-size:10px}.m7om-review-copy small{margin-top:3px;color:#8e8374;font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .m7om-review-actions{display:grid;grid-template-columns:1fr 1.45fr;gap:8px;margin-top:12px}.m7om-review-actions button{min-height:43px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:#141414;color:#ddd;font-weight:900}.m7om-review-actions .primary{border-color:rgba(217,164,65,.45);background:linear-gradient(135deg,#e0ae4e,#ba8431);color:#080706}.m7om-review-actions .primary.danger{border-color:rgba(255,88,88,.35);background:#7d2020;color:#fff}.m7om-review-status{min-height:17px;padding-top:7px;text-align:center;color:#ff9b91;font-size:8px}
      #m7-owner-media-status{min-height:20px;margin-top:10px;text-align:center;color:#a99b87;font-size:9px}#m7-owner-media-status[data-type="ok"]{color:#7ee3a0}#m7-owner-media-status[data-type="error"]{color:#ff8f8f}
      @media(max-width:600px){#m7-owner-media-sheet{padding-left:8px!important;padding-right:8px!important}.m7om-card{border-radius:19px;padding:12px}.m7om-media-grid,.m7om-album-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.m7om-item,.m7om-album{padding:6px}.m7om-add{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.m7om-add button{min-height:56px;padding:6px 2px;font-size:7.4px}.m7om-choice-grid,.m7om-review-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.m7om-review-card{padding:12px}.m7om-selection-bar{grid-template-columns:minmax(0,1fr) auto auto}.m7om-selection-bar button{padding:0 9px;font-size:8px}}

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
    sheet.innerHTML='<div class="m7om-card"><div class="m7om-head"><div><b>Edit Media</b><small>Add photos/videos normally, or create an album by selecting multiple photos directly from your phone. Hold any Media or album card to enter multi-select mode.</small></div><button type="button" class="m7om-close" aria-label="Close">×</button></div><div id="m7-owner-media-quota"></div><div class="m7om-add"><button type="button" data-add="photo">Photos</button><button type="button" data-add="video">Videos</button><button type="button" data-create-album>Album</button></div><input id="m7-owner-media-file" type="file"><div id="m7-owner-media-albums"></div><div id="m7-owner-media-list" class="m7om-list"></div><div id="m7-owner-media-status" aria-live="polite"></div></div><div id="m7om-library-selection" class="m7om-selection-bar" hidden><div><b data-library-select-count>0 selected</b><small data-library-select-label>Photos & videos</small></div><button type="button" data-library-select-cancel>Cancel</button><button type="button" class="danger" data-library-select-delete>Delete</button></div>';
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

    const albumsPanel=sheet.querySelector("#m7-owner-media-albums");
    const mediaList=sheet.querySelector("#m7-owner-media-list");
    const selectionBar=sheet.querySelector("#m7om-library-selection");

    const itemForSelectionEvent=event=>{
      const album=event.target.closest(".m7om-album");
      if(album)return{mode:"album",card:album,key:String(album.dataset.selectKey||"")};
      const media=event.target.closest(".m7om-item");
      if(media)return{mode:"media",card:media,key:String(media.dataset.selectKey||"")};
      return null;
    };

    albumsPanel.addEventListener("click",event=>{
      if(busy)return;
      const hit=itemForSelectionEvent(event);
      if(!hit||hit.mode!=="album")return;

      if(librarySelectionMode){
        if(librarySelectionMode!=="album")return;
        if(Date.now()<suppressLibraryClickUntil)return;
        toggleLibrarySelection("album",hit.key);
        return;
      }

      openAlbumEditor(hit.card.dataset.albumId);
    });

    mediaList.addEventListener("click",event=>{
      if(busy)return;
      const hit=itemForSelectionEvent(event);
      if(!hit||hit.mode!=="media")return;

      if(librarySelectionMode){
        if(librarySelectionMode!=="media")return;
        if(Date.now()<suppressLibraryClickUntil)return;
        toggleLibrarySelection("media",hit.key);
      }
    });

    selectionBar.querySelector("[data-library-select-cancel]")?.addEventListener("click",()=>{
      clearLibrarySelection();
    });

    selectionBar.querySelector("[data-library-select-delete]")?.addEventListener("click",()=>{
      if(busy||!librarySelectionMode||!librarySelected.size)return;
      const mode=librarySelectionMode;
      const selected=[...librarySelected];

      if(mode==="album"){
        const albumIds=selected
          .map(key=>Number(key.replace(/^album:/,"")))
          .filter(Number.isFinite);

        openActionConfirm({
          title:"Delete "+albumIds.length+" album"+(albumIds.length===1?"":"s")+"?",
          text:"The album frame will be deleted. Its photos/videos will stay safely in the Media library.",
          confirmText:"Delete album"+(albumIds.length===1?"":"s"),
          danger:true,
          onConfirm:async()=>{
            const data=await request({op:"album-delete-batch",albumIds});
            applySnapshot(data);
            changed=true;
            clearLibrarySelection();
            render();
            notifyMediaUpdated("album-delete-batch");
            status("Album"+(albumIds.length===1?"":"s")+" deleted. Media files were kept.","ok");
          }
        });
        return;
      }

      const items=selected.map(key=>{
        const parts=key.split(":");
        return{
          mediaType:parts[1]==="video"?"video":"photo",
          id:Number(parts[2])
        };
      }).filter(item=>Number.isFinite(item.id));

      openActionConfirm({
        title:"Delete "+items.length+" selected item"+(items.length===1?"":"s")+"?",
        text:"This permanently deletes the selected Media files. Any albums using them will update automatically.",
        confirmText:"Delete selected",
        danger:true,
        onConfirm:async()=>{
          const data=await request({op:"batch-delete",items});
          applySnapshot(data);
          changed=true;
          clearLibrarySelection();
          render();
          notifyMediaUpdated("batch-delete");
          status(items.length+" Media item"+(items.length===1?"":"s")+" deleted.","ok");
        }
      });
    });

    let libraryHoldTimer=0;
    let libraryHoldX=0;
    let libraryHoldY=0;
    let libraryHoldHit=null;

    const cancelLibraryHold=()=>{
      if(libraryHoldTimer){
        clearTimeout(libraryHoldTimer);
        libraryHoldTimer=0;
      }
      libraryHoldHit=null;
    };

    const beginLibraryHold=event=>{
      const hit=itemForSelectionEvent(event);
      if(!hit||busy)return;
      if(event.pointerType==="mouse"&&event.button!==0)return;

      cancelLibraryHold();
      libraryHoldHit=hit;
      libraryHoldX=Number(event.clientX||0);
      libraryHoldY=Number(event.clientY||0);

      libraryHoldTimer=setTimeout(()=>{
        const held=libraryHoldHit;
        libraryHoldTimer=0;
        libraryHoldHit=null;
        if(!held||busy)return;
        startLibrarySelection(held.mode,held.key);
        suppressLibraryClickUntil=Date.now()+450;
      },520);
    };

    const moveLibraryHold=event=>{
      if(!libraryHoldTimer)return;
      const dx=Number(event.clientX||0)-libraryHoldX;
      const dy=Number(event.clientY||0)-libraryHoldY;
      if(Math.hypot(dx,dy)>10)cancelLibraryHold();
    };

    [albumsPanel,mediaList].forEach(panel=>{
      panel.addEventListener("pointerdown",beginLibraryHold);
      panel.addEventListener("pointermove",moveLibraryHold);
      ["pointerup","pointercancel","pointerleave"].forEach(type=>{
        panel.addEventListener(type,cancelLibraryHold);
      });
      panel.addEventListener("contextmenu",event=>{
        if(event.target.closest(".m7om-item,.m7om-album"))event.preventDefault();
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
