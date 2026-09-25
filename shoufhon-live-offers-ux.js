/* =========================================================
   SHOUFHON LIVE OFFERS — PHONE UX PATCH
   - Swipe offer media directly in the main viewer
   - Per-media captions stay with each photo/video
   - Real local thumbnails beside upload descriptions
   - Owner-only End offer controls on homepage + viewer
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_LIVE_OFFERS_UX_PATCH_V1__)return;
  window.__SHOUFHON_LIVE_OFFERS_UX_PATCH_V1__=true;

  let currentOfferId="";
  let scanTimer=0;
  const previewUrls=new Map();

  const esc=value=>String(value??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");

  function api(){
    return window.Ma7alakLiveOffers||null;
  }

  function offerItems(){
    try{
      const rows=api()?.items;
      return Array.isArray(rows)?rows:[];
    }catch(_){
      return [];
    }
  }

  function ownerSlug(){
    return String(api()?.ownerSlug||"").trim().toLowerCase();
  }

  function findOffer(id){
    const key=String(id||"").trim();
    if(!key)return null;
    return offerItems().find(row=>String(row?.id||"")===key)||null;
  }

  function mediaRows(item){
    const rows=Array.isArray(item?.media)
      ? item.media.filter(row=>row&&row.media_url).slice()
      : [];

    rows.sort((a,b)=>{
      const cover=Number(!!b.is_cover)-Number(!!a.is_cover);
      if(cover)return cover;
      return Number(a.sort_order||0)-Number(b.sort_order||0);
    });

    if(rows.length)return rows;

    return item?.media_url
      ? [{
          media_url:item.media_url,
          media_type:item.media_type||"image",
          caption:"",
          is_cover:true,
          sort_order:0
        }]
      : [];
  }

  function rememberOfferFromTarget(target){
    const card=target?.closest?.("[data-live-id],[data-m7-id]");
    if(!card)return;

    const id=String(
      card.dataset.liveId||
      card.dataset.m7Id||
      ""
    ).trim();

    if(id&&!id.startsWith("video:")){
      currentOfferId=id;
    }
  }

  document.addEventListener("pointerdown",event=>{
    rememberOfferFromTarget(event.target);
  },true);

  document.addEventListener("click",event=>{
    const endButton=event.target.closest?.("[data-shh-end-offer]");

    if(endButton){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const id=String(endButton.dataset.shhEndOffer||"").trim();
      const row=findOffer(id);
      const own=ownerSlug();

      if(!row||!own||String(row.shop_slug||"").trim().toLowerCase()!==own){
        return;
      }

      window.postMessage({
        type:"MA7ALAK_LIVE_OFFERS_END",
        shopSlug:own,
        id
      },"*");

      return;
    }

    rememberOfferFromTarget(event.target);
  },true);

  window.addEventListener("message",event=>{
    const data=event.data||{};

    if(data.type==="MA7ALAK_LIVE_OFFERS_VIEW"){
      const id=String(data.id||"").trim();
      if(id&&!id.startsWith("video:"))currentOfferId=id;
    }

    if(
      data.type==="MA7ALAK_LIVE_OFFERS_UPDATED"||
      data.type==="MA7ALAK_LIVE_OFFERS_STATE"
    ){
      scheduleScan(20);
    }
  });

  function resolveViewerOffer(view){
    let row=findOffer(currentOfferId);
    if(row)return row;

    const liveId=String(
      new URL(location.href).searchParams.get("live")||""
    ).trim();

    row=findOffer(liveId);
    if(row){
      currentOfferId=String(row.id);
      return row;
    }

    const title=String(view?.querySelector(".m7lo-view-info h2")?.textContent||"").trim();
    const shop=String(view?.querySelector(".m7lo-view-shopcopy strong")?.textContent||"").trim();

    row=offerItems().find(item=>
      String(item?.title||"").trim()===title&&
      String(item?.shop_name||item?.shop_slug||"").trim()===shop
    )||null;

    if(row)currentOfferId=String(row.id);
    return row;
  }

  function mediaVisual(row){
    if(String(row?.media_type||"").toLowerCase()==="video"){
      return '<video class="m7lo-view-media shh-offer-media" src="'+
        esc(row.media_url)+
        '" muted loop playsinline preload="metadata"></video>';
    }

    return '<img class="m7lo-view-media shh-offer-media" src="'+
      esc(row?.media_url||"")+
      '" alt="">';
  }

  function renderSwipeHero(view,item,index,direction){
    const rows=mediaRows(item);
    if(rows.length<2)return;

    index=(Number(index)+rows.length)%rows.length;
    const row=rows[index];
    const old=view.querySelector(".m7lo-hero");
    if(!old)return;

    const hero=document.createElement("div");
    hero.className="m7lo-hero shh-offer-swipe-hero";
    hero.dataset.shhSwipeReady="1";
    hero.dataset.shhOfferId=String(item.id||"");
    hero.dataset.shhMediaIndex=String(index);

    const caption=String(row.caption||"").trim();

    hero.innerHTML=
      '<div class="m7lo-media-progress">'+
        rows.map((_,i)=>'<i class="'+(i===index?"on":"")+'"></i>').join("")+
      '</div>'+
      mediaVisual(row)+
      (String(row.media_type||"").toLowerCase()==="video"
        ? '<button class="m7lo-play shh-media-play" type="button">▶<small>Play with sound</small></button>'
        : '')+
      '<div class="shh-media-counter" aria-label="'+rows.length+' media items">'+
        '<b>'+String(index+1)+' / '+String(rows.length)+'</b>'+
        '<span>SWIPE ↔</span>'+
      '</div>'+
      '<button class="shh-media-arrow prev" type="button" aria-label="Previous media">‹</button>'+
      '<button class="shh-media-arrow next" type="button" aria-label="Next media">›</button>'+
      (caption?'<div class="m7lo-hero-caption">'+esc(caption)+'</div>':'');

    if(direction){
      hero.classList.add(direction>0?"shh-media-enter-next":"shh-media-enter-prev");
    }

    old.replaceWith(hero);

    const show=next=>renderSwipeHero(
      view,
      item,
      next,
      next>index?1:-1
    );

    hero.querySelector(".shh-media-arrow.prev")?.addEventListener("click",event=>{
      event.preventDefault();
      event.stopPropagation();
      show(index-1);
    });

    hero.querySelector(".shh-media-arrow.next")?.addEventListener("click",event=>{
      event.preventDefault();
      event.stopPropagation();
      show(index+1);
    });

    const play=hero.querySelector(".shh-media-play");
    const video=hero.querySelector("video.shh-offer-media");

    if(play&&video){
      play.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        video.muted=false;
        video.controls=true;
        video.play().catch(()=>{});
        play.remove();
      });
    }

    let sx=0,sy=0;

    hero.addEventListener("touchstart",event=>{
      if(!event.touches?.[0])return;
      sx=event.touches[0].clientX;
      sy=event.touches[0].clientY;
    },{passive:true});

    hero.addEventListener("touchend",event=>{
      if(!event.changedTouches?.[0])return;

      const dx=event.changedTouches[0].clientX-sx;
      const dy=event.changedTouches[0].clientY-sy;

      if(Math.abs(dx)>46&&Math.abs(dx)>Math.abs(dy)*1.12){
        event.stopPropagation();
        show(index+(dx<0?1:-1));
      }
    },{passive:true});
  }

  function ensureViewerOwnerEnd(view,item){
    const own=ownerSlug();
    const itemSlug=String(item?.shop_slug||"").trim().toLowerCase();

    if(!own||!itemSlug||own!==itemSlug)return;

    let tools=view.querySelector(".m7lo-owner-tools");

    if(!tools){
      tools=document.createElement("div");
      tools.className="m7lo-owner-tools";
      view.querySelector(".m7lo-close")?.after(tools);
    }

    if(!tools.querySelector("[data-shh-end-offer]")){
      const button=document.createElement("button");
      button.type="button";
      button.className="shh-view-end-offer";
      button.dataset.shhEndOffer=String(item.id||"");
      button.textContent="■ End offer";
      tools.appendChild(button);
    }
  }

  function patchViewer(){
    const view=document.querySelector("#m7lo-overlay .m7lo-view");
    if(!view)return;

    const item=resolveViewerOffer(view);
    if(!item)return;

    ensureViewerOwnerEnd(view,item);

    const rows=mediaRows(item);
    const hero=view.querySelector(".m7lo-hero");

    if(rows.length>1&&hero&&!hero.dataset.shhSwipeReady){
      renderSwipeHero(view,item,0,0);
    }
  }

  function patchHomepageOwnerButtons(){
    const own=ownerSlug();

    document
      .querySelectorAll(".shh-home-end-offer")
      .forEach(button=>{
        const card=button.closest("[data-live-id]");
        const row=findOffer(card?.dataset.liveId);
        const rowSlug=String(row?.shop_slug||"").trim().toLowerCase();

        if(!own||rowSlug!==own){
          button.remove();
        }
      });

    if(!own)return;

    document
      .querySelectorAll("#m7-live-cards [data-live-id]")
      .forEach(card=>{
        const id=String(card.dataset.liveId||"").trim();
        const row=findOffer(id);

        if(
          !row||
          String(row.shop_slug||"").trim().toLowerCase()!==own||
          String(row.post_type||"").toLowerCase()==="video_live"||
          card.querySelector("[data-shh-end-offer]")
        ){
          return;
        }

        const button=document.createElement("button");
        button.type="button";
        button.className="shh-home-end-offer";
        button.dataset.shhEndOffer=id;
        button.textContent="■ End offer";
        card.appendChild(button);
      });
  }

  function clearPreviewUrls(input){
    const urls=previewUrls.get(input)||[];
    urls.forEach(url=>{
      try{URL.revokeObjectURL(url)}catch(_){}
    });
    previewUrls.delete(input);
  }

  function patchUploadPreviews(input){
    if(!input?.isConnected)return;

    clearPreviewUrls(input);

    const files=[...(input.files||[])];
    if(!files.length)return;

    const box=input.id==="m7lo-manager-files"
      ? document.getElementById("m7lo-manager-draft")
      : document.getElementById("m7lo-new-media-draft");

    if(!box)return;

    const rows=[
      ...box.querySelectorAll(".m7lo-pending-media")
    ];

    const urls=[];

    rows.forEach((row,index)=>{
      const file=files[index];
      if(!file)return;

      const old=row.querySelector(".m7lo-pending-icon,.shh-pending-thumb");
      const url=URL.createObjectURL(file);
      urls.push(url);

      let preview;

      if(String(file.type||"").startsWith("video/")){
        preview=document.createElement("video");
        preview.muted=true;
        preview.autoplay=true;
        preview.loop=true;
        preview.playsInline=true;
        preview.preload="metadata";
      }else{
        preview=document.createElement("img");
        preview.alt="";
      }

      preview.className="shh-pending-thumb";
      preview.src=url;

      if(old)old.replaceWith(preview);
      else row.prepend(preview);
    });

    previewUrls.set(input,urls);
  }

  document.addEventListener("change",event=>{
    const input=event.target;

    if(
      !(input instanceof HTMLInputElement)||
      !["m7lo-file","m7lo-manager-files"].includes(input.id)
    ){
      return;
    }

    requestAnimationFrame(()=>{
      setTimeout(()=>patchUploadPreviews(input),0);
    });
  },true);

  function cleanDetachedPreviewUrls(){
    for(const [input] of previewUrls){
      if(!input.isConnected)clearPreviewUrls(input);
    }
  }

  function scan(){
    cleanDetachedPreviewUrls();
    patchViewer();
    patchHomepageOwnerButtons();
  }

  function scheduleScan(delay=0){
    clearTimeout(scanTimer);
    scanTimer=setTimeout(scan,delay);
  }

  const style=document.createElement("style");
  style.id="shoufhon-live-offers-ux-patch-css";
  style.textContent=`
    .shh-media-counter{
      position:absolute;
      z-index:9;
      top:56px;
      right:12px;
      display:flex;
      align-items:center;
      gap:7px;
      min-height:31px;
      padding:5px 9px;
      border:1px solid rgba(243,195,105,.64);
      border-radius:999px;
      background:rgba(6,6,6,.78);
      box-shadow:0 8px 24px rgba(0,0,0,.36),0 0 17px rgba(228,170,79,.18);
      backdrop-filter:blur(10px);
      pointer-events:none;
    }
    .shh-media-counter b{
      color:#f4c874;
      font-size:11px;
      font-weight:950;
    }
    .shh-media-counter span{
      color:rgba(255,255,255,.82);
      font-size:7px;
      font-weight:950;
      letter-spacing:.75px;
    }
    .shh-media-arrow{
      position:absolute;
      z-index:8;
      top:50%;
      width:39px;
      height:50px;
      transform:translateY(-50%);
      border:1px solid rgba(255,255,255,.18);
      border-radius:14px;
      background:rgba(5,5,5,.48);
      color:#fff;
      font-size:26px;
      line-height:1;
      backdrop-filter:blur(8px);
      cursor:pointer;
    }
    .shh-media-arrow.prev{left:8px}
    .shh-media-arrow.next{right:8px}
    .shh-offer-swipe-hero{
      touch-action:pan-y;
    }
    .shh-offer-swipe-hero .m7lo-hero-caption{
      right:13px!important;
    }
    .shh-media-enter-next .shh-offer-media{
      animation:shhMediaNext .22s ease-out;
    }
    .shh-media-enter-prev .shh-offer-media{
      animation:shhMediaPrev .22s ease-out;
    }
    @keyframes shhMediaNext{
      from{opacity:.45;transform:translateX(16px) scale(1.015)}
      to{opacity:1;transform:none}
    }
    @keyframes shhMediaPrev{
      from{opacity:.45;transform:translateX(-16px) scale(1.015)}
      to{opacity:1;transform:none}
    }
    .shh-home-end-offer{
      position:absolute;
      z-index:7;
      top:10px;
      right:10px;
      min-height:31px;
      padding:0 10px;
      border:1px solid rgba(255,101,101,.48);
      border-radius:999px;
      background:rgba(101,20,20,.88);
      color:#ffd7d3;
      font-size:8px;
      font-weight:950;
      box-shadow:0 8px 20px rgba(0,0,0,.32);
      backdrop-filter:blur(8px);
    }
    .m7lo-owner-tools .shh-view-end-offer{
      border-color:rgba(255,91,91,.48)!important;
      background:rgba(111,25,25,.9)!important;
      color:#ffd4d0!important;
    }
    .shh-pending-thumb{
      width:78px;
      height:78px;
      display:block;
      object-fit:cover;
      border:1px solid rgba(228,170,79,.28);
      border-radius:12px;
      background:#050505;
    }
    .m7lo-pending-media:has(.shh-pending-thumb){
      grid-template-columns:78px minmax(0,1fr)!important;
      gap:10px!important;
      align-items:start!important;
    }
    @media(max-width:520px){
      .shh-media-arrow{display:none}
      .shh-media-counter{
        top:max(56px,calc(env(safe-area-inset-top) + 48px));
        right:10px;
      }
      .shh-offer-swipe-hero .m7lo-hero-caption{
        left:10px!important;
        right:10px!important;
        bottom:10px!important;
        max-height:4.5em!important;
        overflow:auto!important;
      }
      .shh-pending-thumb{
        width:68px;
        height:68px;
      }
      .m7lo-pending-media:has(.shh-pending-thumb){
        grid-template-columns:68px minmax(0,1fr)!important;
      }
    }
  `;
  document.head.appendChild(style);

  const observer=new MutationObserver(()=>scheduleScan(0));
  observer.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

  ["ma7alak:account-change","ma7alak:owner-auth-change","pageshow"].forEach(type=>{
    window.addEventListener(type,()=>scheduleScan(80));
  });

  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden)scheduleScan(50);
  });

  setInterval(()=>{
    if(!document.hidden)scan();
  },1500);

  scheduleScan(0);
})();