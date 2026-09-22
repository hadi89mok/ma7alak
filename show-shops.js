/* ShoufHon directory v3 — one layout, live admin data, same-page panels. */
(function(){
  'use strict';
  const directoryPath=location.pathname.replace(/\/+$/,'').toLowerCase();
  if(directoryPath!=='/shwf-almhlat-')return;

  /*
    Recovery-safe duplicate guard:
    - A second copy exits only when the real directory root is already mounted.
    - A stale __M7_DIRECTORY_V3__ flag can no longer leave the Hostinger page blank.
  */
  if(window.__M7_DIRECTORY_V3__&&document.getElementById('ma7alak-shops-page'))return;
  window.__M7_DIRECTORY_V3_BOOTING__=true;
  const assetBase=document.currentScript?.src||location.href;
  const defaults={title:'شوف المحلات',subtitle:'Discover what’s around you',hero:new URL('assets/directory-beirut-night.webp',assetBase).href,logo:'https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/hadi%20new.png',search:'Search shops, food, services...',location_title:'Where are you looking?',categories_title:'Browse categories',shops_title:'Popular near you',cta_title:'Own a local business?',cta_text:'Add your shop and reach more people.',cta_button:'Add your shop',show_cta:true,show_categories:true,category_order:['cafe','food','beauty','clothing','services'],category_labels:{cafe:'Cafés',food:'Food',beauty:'Beauty',clothing:'Fashion',services:'Services'},category_icons:{},radius:25};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url=v=>{try{const u=new URL(v);return /^https?:$/.test(u.protocol)?u.href:''}catch{return ''}};
  const norm=v=>String(v||'').trim().toLocaleLowerCase();
  const paths={search:'M21 21l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',filter:'M3 6h6m4 0h8M3 12h12m4 0h2M3 18h3m4 0h11M9 3v6m6 0v6M6 15v6',near:'M12 2v3m0 14v3M2 12h3m14 0h3M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0',plane:'m3 10 19-8-8 19-3-8-8-3Zm8 3L22 2',heart:'M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-5 4 1 10 8 16 7-6 13-12 8-16Z',cafe:'M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm13 1h2a3 3 0 0 1 0 6h-2M2 23h20M7 2c-2 2 2 3 0 5m5-6c-2 2 2 3 0 5',food:'M4 2v7m4-7v7M2 2v5a4 4 0 0 0 8 0V2M6 11v12M20 2c-4 3-4 8 0 10V2Zm0 10v11',beauty:'M12 21C4 21 1 16 2 10c5 0 8 4 10 11Zm0 0c8 0 11-5 10-11-5 0-8 4-10 11Zm0-4C6 11 9 5 12 2c3 3 6 9 0 15Z',clothing:'M4 8h16l2 15H2L4 8Zm4 0V6a4 4 0 0 1 8 0v2',services:'m14 4 3 3 5-4c2 7-3 11-8 8L5 22l-3-3 11-9c-3-5 1-10 7-8l-6 2Z',shop:'M3 9h18l-2-7H5L3 9Zm0 0v3a3 3 0 0 0 6 0V9m0 0v3a3 3 0 0 0 6 0V9m0 0v3a3 3 0 0 0 6 0V9M4 15v8h16v-8M10 23v-7h5v7',arrow:'M4 12h16m-6-6 6 6-6 6'};
  const icon=(name)=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]||paths.shop}"/></svg>`;
  let client,root,dialog,panel,returnFocus,shopOpen='',tab='about',loadToken=0,loading=false,queued=false,refreshTimer,ownerSlug='',returnObserver,toastTimer;
  let storyViewer=null,storyViewerMedia=null,storyViewerProgress=null,storyViewerShop=null,storyViewerClose=null;
  let storyViewerOpen=false,storyViewerSlug='',storyViewerIndex=0,storyViewerList=[],storyViewerTimer=0,storyViewerRaf=0;
  let storyTouchStartX=0,storyTouchStartY=0,storyTouchX=0,storyTouchY=0,storyHistoryArmed=false,storyScrollState=null;
  let state={shops:[],categories:[],cities:[],areas:[],stories:[],live:[],popularity:[],settings:defaults},q='',area='',category='',followedOnly=false,liveOnly=false,coords=null,sort='popular',limit=24;
  let followed=new Set(),followBusy=new Set(),rotation=new Map();
  let designPreviewChannel=null,designPreviewBc=null,lastDesignPreviewStamp=new Map();

  function applyDirectoryDesignPreview(message){
    if(!message||message.type!=="MA7ALAK_DESIGN_PREVIEW")return;
    const slug=norm(message.shop_slug||message.shopSlug||"");
    if(!slug)return;

    const stamp=Number(message.sent_at)||Date.now();
    if(stamp<(lastDesignPreviewStamp.get(slug)||0))return;
    lastDesignPreviewStamp.set(slug,stamp);

    const index=state.shops.findIndex(shop=>norm(shop.shop_slug)===slug);
    if(index<0)return;

    const current=state.shops[index]||{};
    const draft=message.profile&&typeof message.profile==="object"
      ? message.profile
      : {};
    const options=message.directory_options&&typeof message.directory_options==="object"
      ? message.directory_options
      : {};

    const safeDraft={...draft};
    delete safeDraft.shop_slug;
    delete safeDraft.original_shop_slug;
    delete safeDraft.directory_options;

    state.shops[index]={
      ...current,
      ...safeDraft,
      shop_slug:current.shop_slug,
      directory_options:{
        ...(current.directory_options||{}),
        ...options
      }
    };

    renderCards();

    if(shopOpen&&norm(shopOpen)===slug&&dialog?.open){
      const activeTab=tab;
      Promise.resolve().then(()=>showShop(shopOpen,activeTab)).catch(()=>{});
    }
  }

  function startDirectoryDesignPreview(){
    if(!client)return;

    if(!designPreviewChannel&&typeof client.channel==="function"){
      designPreviewChannel=client
        .channel("ma7alak-design-preview-global")
        .on("broadcast",{event:"design-preview"},payload=>{
          applyDirectoryDesignPreview(payload&&payload.payload);
        })
        .subscribe();
    }

    if(!designPreviewBc&&"BroadcastChannel" in window){
      try{
        designPreviewBc=new BroadcastChannel("ma7alak-design-live-v1");
        designPreviewBc.onmessage=event=>applyDirectoryDesignPreview(event.data);
      }catch(_){}
    }
  }
  const saved=followed;
  const visitorKey='ma7alak_visitor_id';
  function visitorId(){let id='';try{id=localStorage.getItem(visitorKey)||'';if(!id){id=crypto.randomUUID();localStorage.setItem(visitorKey,id)}}catch{id=crypto.randomUUID()}return id}
  const css=`
html.ma7alak-shops-page-active,html.ma7alak-shops-page-active body{background:#080806!important;color:#fff}body.ma7alak-shops-body>div:not([id]) main.page{display:none!important}
#ma7alak-shops-page.m7d{box-sizing:border-box;width:100%;max-width:1100px;margin:0 auto!important;padding:0 12px 28px!important;position:relative;isolation:isolate;color:#f5f2eb;background:#080806;font:14px/1.4 Arial,"Segoe UI",sans-serif;overflow:clip}
.m7d *,.m7d-dialog *{box-sizing:border-box}.m7d button,.m7d-dialog button,.m7d input,.m7d-dialog input,.m7d-dialog textarea,.m7d-dialog select{font:inherit}.m7d button,.m7d-dialog button{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.m7d button:focus-visible,.m7d-dialog :focus-visible{outline:2px solid #f3cc7f;outline-offset:3px}.m7d svg,.m7d-dialog svg{width:22px;height:22px;flex-shrink:0}.m7d [hidden],.m7d-dialog [hidden]{display:none!important}
.m7d-hero{position:relative;text-align:center;margin:0 -12px;min-height:142px;padding:6px 12px 12px;isolation:isolate}.m7d-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;opacity:.85}.m7d-hero:after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(#08080615,#08080620 45%,#080806)}.m7d-logo{width:148px;height:83px;object-fit:contain;display:block;margin:0 auto 0;animation:m7dLogoFloat 2.8s ease-in-out infinite!important;-webkit-animation:m7dLogoFloat 2.8s ease-in-out infinite!important;transform:translate3d(0,24px,0) scale(3.35);transform-origin:center;will-change:transform;-webkit-backface-visibility:hidden;backface-visibility:hidden}
@keyframes m7dLogoFloat{0%,100%{transform:translate3d(0,24px,0) scale(3.35)}50%{transform:translate3d(0,13px,0) scale(3.35)}}@-webkit-keyframes m7dLogoFloat{0%,100%{-webkit-transform:translate3d(0,24px,0) scale(3.35);transform:translate3d(0,24px,0) scale(3.35)}50%{-webkit-transform:translate3d(0,13px,0) scale(3.35);transform:translate3d(0,13px,0) scale(3.35)}}
@media(prefers-reduced-motion:reduce){.m7d-logo{animation:m7dLogoFloat 2.8s ease-in-out infinite!important;-webkit-animation:m7dLogoFloat 2.8s ease-in-out infinite!important;will-change:transform}}.m7d-hero h1{font-size:30px;line-height:1.2;color:#efce86;margin:0;font-weight:700}.m7d-hero p{font-size:15px;color:#c4c1b9;margin:3px 0 0;letter-spacing:.3px}.m7d-side{position:absolute;right:14px;top:15px;color:#d1bc8b;font:italic 13px/1.05 Georgia,serif;transform:rotate(-8deg)}
.m7d-hero-bg,.m7d-hero:after,.m7d-logo,.m7d-side{pointer-events:none!important}
.m7d-search{position:relative;z-index:20;display:flex;align-items:center;gap:14px;height:51px;padding:0 14px;margin:0 0 10px;border:1px solid #bda27066;border-radius:18px;background:linear-gradient(110deg,#292721,#181816 80%,#40301a);box-shadow:inset 0 1px 6px #ffe4a719;color:#daceb6;pointer-events:auto!important}.m7d-search input{position:relative;z-index:2;background:none;border:0;outline:0;color:white;min-width:0;flex:1;width:100%;font-size:13px;pointer-events:auto!important;touch-action:auto!important;-webkit-user-select:text!important;user-select:text!important}.m7d-search input::placeholder{color:#aaa69d}.m7d-search button{position:relative;z-index:2;border:0;border-left:1px solid #ffffff20;padding:4px 0 4px 12px;background:none;color:#e6c888;height:30px;display:flex;align-items:center;pointer-events:auto!important}
.m7d-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 0 8px}.m7d-row h2{font-size:15px;line-height:1.3;margin:0;font-weight:600}.m7d-row .m7d-link{font-size:11px}.m7d-location{display:flex;align-items:center;gap:8px;font-size:13px}.m7d-location svg{width:18px;color:#ead09a}.m7d-link{border:0;background:none;color:#bdb8ad;padding:4px 0;display:flex;align-items:center;gap:5px;white-space:nowrap;min-height:30px}.m7d-link svg{width:16px}
.m7d-areas{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:0 0 2px}.m7d-pill{white-space:nowrap;border:1px solid #c3ab7877;border-radius:30px;background:#11110d;color:#ddd8cd;padding:6px 14px;min-height:32px;font-size:12px!important;display:inline-flex;align-items:center;justify-content:center;gap:5px}.m7d-pill svg{width:14px;height:14px}.m7d-pill[aria-pressed=true]{background:linear-gradient(110deg,#f7d483,#dba64e);color:#21180b;border-color:#e8c783;font-weight:700}.m7d-categories{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.m7d-category{min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid #ffffff20;border-radius:11px;background:linear-gradient(125deg,#302c2070,#11110f);color:#eee9df;min-height:70px;padding:8px 2px;font-size:11px!important}.m7d-category svg,.m7d-category img{width:26px;height:26px;color:#edc675;object-fit:contain}.m7d-category .emoji{font-size:24px}.m7d-category[aria-pressed=true]{border-color:#e7c581;box-shadow:inset 0 0 20px #d8ac4225}.m7d-category span:last-child{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.m7d-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px 8px;padding:2px 0 5px}.m7d-strip{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 0 11px;-webkit-overflow-scrolling:touch}.m7d-strip::-webkit-scrollbar{display:none}.m7d-strip>.m7d-card-wrap{flex:0 0 calc(50% - 4px);scroll-snap-align:start}.m7d-section[hidden]{display:none!important}.m7d-card-wrap{position:relative;min-width:0;padding-top:19px;display:flex;align-items:stretch}.m7d-card-tab{position:absolute;z-index:5;left:9px;top:0;display:inline-flex;align-items:center;justify-content:center;min-height:29px;padding:5px 12px;border:1px solid #f0cb7e;border-radius:999px;background:linear-gradient(135deg,#f7dc99,#dba74f);box-shadow:0 6px 15px #0008;color:#1a1309;font-size:8px;font-weight:950;letter-spacing:.7px;pointer-events:none;transform:translateZ(0);will-change:transform,filter,box-shadow}.m7d-card-tab.featured{color:#fff;border-color:#ff7983;background:linear-gradient(135deg,#930d23,#ed3448);animation:m7d-featured-badge 1.35s ease-in-out infinite;box-shadow:0 0 14px #ff294b88,0 7px 17px #0009}.m7d-card{--card-accent:#c1a66a;height:100%;width:100%;min-width:0;display:flex;flex-direction:column;border:1px solid color-mix(in srgb,var(--card-accent) 52%,transparent);border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#24231d,#11110e);position:relative;box-shadow:0 10px 26px #0007;transform:translateZ(0);will-change:transform,box-shadow}.m7d-card.card-glow:not(.is-featured){animation:m7d-card-accent 2s ease-in-out infinite}.m7d-card.is-featured{border-color:#ff5265cc;animation:m7d-card-featured 1.55s ease-in-out infinite}.m7d-cover{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;background:#302b21;z-index:1}.m7d-cover-button{position:relative;display:block;flex:0 0 var(--m7-card-cover-height,126px);height:var(--m7-card-cover-height,126px);min-height:90px;overflow:hidden;border:0;background:#1d1a14;padding:0;width:100%}.m7d-cover-fallback{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:5px;color:color-mix(in srgb,var(--card-accent) 78%,white);background:radial-gradient(circle at 50% 35%,color-mix(in srgb,var(--card-accent) 24%,transparent),transparent 48%),linear-gradient(135deg,color-mix(in srgb,var(--m7-card-surface,#171611) 82%,white 18%),var(--m7-card-surface,#171611));z-index:0}.m7d-cover-fallback:before,.m7d-cover-fallback:after{content:"";position:absolute;border:1px solid color-mix(in srgb,var(--card-accent) 20%,transparent);border-radius:50%}.m7d-cover-fallback:before{width:110px;height:110px;left:-38px;top:-52px}.m7d-cover-fallback:after{width:88px;height:88px;right:-34px;bottom:-48px}.m7d-cover-mark{font:800 24px/1 Georgia,serif;letter-spacing:1px;text-shadow:0 4px 16px #000}.m7d-cover-fallback small{font-size:7px;font-weight:800;letter-spacing:2.4px;opacity:.72}.m7d-heart{position:absolute;right:8px;top:8px;width:34px;height:34px;display:grid;place-items:center;border:1px solid #ffffff2c;background:#070707b8;color:white;border-radius:50%;z-index:3;backdrop-filter:blur(7px)}.m7d-heart svg{width:20px}.m7d-heart[aria-pressed=true]{color:#f5ce7e;border-color:#f5ce7e88}.m7d-heart[aria-pressed=true] svg{fill:#f5ce7e}.m7d-owner-label{position:absolute;right:8px;top:8px;z-index:3;border:1px solid #eacb8966;border-radius:999px;background:#090806d9;color:#eacb89;padding:6px 8px;font-size:8px;font-weight:900}.m7d-live-badge{position:absolute;left:8px;top:8px;z-index:3;border-radius:999px;padding:4px 8px;background:#08752ddd;color:#d9ffce;font-size:8px;font-weight:900;pointer-events:none;backdrop-filter:blur(6px)}.m7d-live-badge:before{content:'';width:6px;height:6px;border-radius:50%;display:inline-block;background:#8eff8a;margin-right:4px;animation:m7d-pulse 1.6s infinite}.m7d-card-content{padding:0 9px 11px;display:flex;flex:1;flex-direction:column}.m7d-identity{display:grid;grid-template-columns:68px minmax(0,1fr);grid-template-rows:auto auto auto;column-gap:9px;align-items:center;min-width:0;margin-top:-33px;position:relative;z-index:2}.m7d-avatar{--story:#e3bf77;position:relative;display:block;grid-row:1/4;border:3px solid var(--card-accent);border-radius:50%;padding:2px;width:68px;height:68px;background:#1e1b14;overflow:hidden;z-index:1;box-shadow:0 7px 16px #000b}.m7d-avatar:before{content:'';position:absolute;inset:-45%;border-radius:50%;background:transparent;z-index:0}.m7d-avatar-fallback{position:absolute;inset:2px;z-index:1;display:grid;place-items:center;border-radius:50%;color:color-mix(in srgb,var(--card-accent) 75%,white);background:radial-gradient(circle at 35% 25%,color-mix(in srgb,var(--card-accent) 32%,#272117),#15130f 68%);font:800 17px/1 Georgia,serif;letter-spacing:.5px}.m7d-avatar img{position:absolute;inset:2px;z-index:2;width:calc(100% - 4px);height:calc(100% - 4px);border-radius:50%;object-fit:cover;background:#16130e}.m7d-avatar.story{border-color:transparent;box-shadow:0 0 0 2px color-mix(in srgb,var(--story) 42%,transparent),0 0 16px color-mix(in srgb,var(--story) 72%,transparent),0 7px 16px #000b}.m7d-avatar.story:before{background:conic-gradient(from 0deg,var(--story),#fff3b0,var(--story),transparent 82%,var(--story));animation:m7d-story-spin 2.2s linear infinite;will-change:transform}.m7d-card h3{font-size:14px;line-height:1.15;margin:34px 0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.m7d-verified{display:inline-flex;vertical-align:-3px;color:#2f9cff;margin-left:2px}.m7d-verified svg{width:15px;height:15px;fill:currentColor;stroke:#fff;stroke-width:1.2}.m7d-card-label{font-size:9px;color:#c8c0b2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7d-address{display:flex;align-items:center;gap:3px;color:#bdb6a9;font-size:9px;margin:3px 0 10px;min-height:14px;overflow:hidden}.m7d-address span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7d-address svg{width:10px;height:12px;color:#edcc8b}.m7d-rating{color:#efd391;font-size:9px;margin:-4px 0 9px;min-height:12px}.m7d-rating.is-empty{visibility:hidden}.m7d-view{width:100%;margin-top:auto;border:1px solid var(--card-accent);border-radius:9px;min-height:35px;padding:6px 8px;background:#0b0b08;color:#ead49e;display:flex;align-items:center;justify-content:center;gap:8px;font-size:10px!important}.m7d-view svg{width:14px;height:14px}.m7d-empty{grid-column:1/-1;border:1px dashed #e5c48144;border-radius:16px;padding:27px 15px;text-align:center;color:#bdb5a4;background:radial-gradient(circle at 50% 0,#d4ad4c12,transparent 65%)}.m7d-empty-icon{width:44px;height:44px;margin:0 auto 8px;border:1px solid #d6b66844;border-radius:50%;display:grid;place-items:center;color:#e9c77e;background:#d9ad4510}.m7d-empty strong{display:block;color:#eee5d6}.m7d-empty p{margin:5px}.m7d-category-empty{flex:1 0 100%;padding:18px;border:1px dashed #e5c48138;border-radius:14px;text-align:center;color:#a9a294;font-size:11px}.m7d-cta{display:flex;align-items:center;gap:10px;padding:14px 13px;margin-top:13px;border:1px solid #dfbd7744;border-radius:16px;background:linear-gradient(110deg,#362d1c,#21190f 70%,#4b361c)}.m7d-cta>svg{width:31px;height:34px;color:#efc676}.m7d-cta div{flex:1}.m7d-cta strong{font-size:11px;display:block}.m7d-cta small{font-size:9px;color:#cbb387}.m7d-gold{border:0;border-radius:10px;color:#231908;background:linear-gradient(110deg,#f6d58e,#cb9442);padding:11px 14px;font-weight:700!important}.m7d-cta button{font-size:10px;white-space:nowrap;padding:10px 12px}.m7d-feedback{font-size:12px;color:#ddc38e;margin:8px 0;min-height:0}.m7d-feedback:empty{display:none}.m7d-more{margin:14px auto;display:block}.m7d-return{position:fixed;left:12px;bottom:max(18px,env(safe-area-inset-bottom));z-index:2147482000;display:flex;align-items:center;gap:7px;border:1px solid #e8c87b77;border-radius:999px;padding:9px 12px;background:#12100fed;color:#f1d391;box-shadow:0 10px 30px #000a,0 0 18px #d6a84c20;backdrop-filter:blur(12px);font-size:10px!important;font-weight:900;transform:translateY(90px);opacity:0;pointer-events:none;transition:.25s ease}.m7d-return.visible{transform:none;opacity:1;pointer-events:auto}.m7d-return svg{width:15px;height:15px;transform:rotate(-90deg)}.m7d-toast{position:fixed;left:50%;bottom:max(20px,env(safe-area-inset-bottom));z-index:2147483000;width:min(340px,calc(100vw - 24px));display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #e2bd704c;border-radius:16px;background:#151310f2;color:#fff;box-shadow:0 16px 50px #000c;backdrop-filter:blur(14px);transform:translate(-50%,35px);opacity:0;pointer-events:none;transition:.22s ease}.m7d-toast.show{transform:translate(-50%,0);opacity:1}.m7d-toast img,.m7d-toast-fallback{width:38px;height:38px;flex:0 0 38px;border:2px solid #e2bd70;border-radius:50%;object-fit:cover;background:#292219;display:grid;place-items:center}.m7d-toast div{min-width:0}.m7d-toast strong,.m7d-toast small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7d-toast strong{font-size:12px}.m7d-toast small{color:#bdb3a2;font-size:10px;margin-top:2px}
.m7d-dialog{padding:0;border:1px solid #e5bd7355;border-radius:22px;width:min(620px,calc(100% - 20px));max-height:calc(100dvh - 24px);background:#13120f;color:#f6f0e4;box-shadow:0 25px 100px #000b;font:14px/1.5 Arial,sans-serif;overflow:auto;overscroll-behavior:contain}.m7d-dialog::backdrop{background:#000c;backdrop-filter:blur(7px)}.m7d-dialog[open]{animation:m7d-in .25s ease-out}.m7d-dialog-header{display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#13120ff5;padding:12px 18px;z-index:4;border-bottom:1px solid #ffffff16}.m7d-dialog-header h2{font-size:17px;margin:0}.m7d-close{border:1px solid #ffffff26;background:#26231a;color:#fff;border-radius:50%;height:36px;width:36px;font-size:24px!important}.m7d-panel{padding:18px}.m7d-panel label{display:block;margin:12px 0;color:#e1d0af}.m7d-panel input:not([type=checkbox]),.m7d-panel textarea,.m7d-panel select{width:100%;padding:10px;border:1px solid #c9ad7060;border-radius:9px;background:#25221a;color:white;margin-top:5px}.m7d-panel textarea{min-height:85px;resize:vertical}.m7d-panel .m7d-areas{flex-wrap:wrap}.m7d-panel .m7d-categories{grid-template-columns:repeat(3,minmax(0,1fr))}.m7d-detail-cover{width:100%;max-height:240px;object-fit:cover;border-radius:12px}.m7d-detail-head{display:flex;gap:13px;align-items:center;margin:14px 0}.m7d-detail-head img{width:58px;height:58px;border-radius:50%;border:2px solid #e2bf7c;object-fit:cover}.m7d-detail-head h3{margin:0;font-size:22px}.m7d-detail-head p{margin:2px 0;color:#c8beaa}.m7d-tabs{display:flex;gap:6px;overflow:auto;padding:4px 0 12px;scrollbar-width:none}.m7d-tab-body{white-space:normal;overflow-wrap:anywhere}.m7d-tab-body p{white-space:pre-line}.m7d-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.m7d-gallery img,.m7d-gallery video{width:100%;height:190px;object-fit:cover;border-radius:10px;background:#080806}.m7d-gallery button{padding:0;background:none;border:0}.m7d-media-full{width:100%;max-height:65dvh;object-fit:contain;background:#050505}.m7d-map{width:100%;height:300px;border:0;border-radius:12px}.m7d-offer{border:1px solid #d3b57444;padding:12px;border-radius:12px;margin:10px 0}.m7d-offer img,.m7d-offer video{width:100%;max-height:300px;object-fit:contain}.m7d-offer h3{margin:6px 0}.m7d-muted{color:#afa99b;font-size:12px}.m7d-story-nav{display:flex;justify-content:space-between;align-items:center;margin:12px 0}.m7d-story-nav button{min-height:44px}.m7d-loading{opacity:.65}
@keyframes m7d-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}@keyframes m7d-pulse{50%{box-shadow:0 0 0 4px #42ff7330}}@keyframes m7d-featured-badge{0%,100%{transform:translateZ(0) scale(1);filter:brightness(1);box-shadow:0 0 10px #ff294b70,0 7px 17px #0009}50%{transform:translateZ(0) scale(1.045);filter:brightness(1.18);box-shadow:0 0 23px #ff294bd9,0 0 0 4px #ff405b24,0 7px 17px #0009}}@keyframes m7d-card-featured{0%,100%{box-shadow:0 10px 26px #0008,0 0 7px #ff28406b}50%{box-shadow:0 11px 29px #000a,0 0 23px #ff2840e8,0 0 0 2px #ff405b3d}}@keyframes m7d-card-accent{0%,100%{box-shadow:0 10px 26px #0008,0 0 5px color-mix(in srgb,var(--card-accent) 48%,transparent)}50%{box-shadow:0 11px 29px #000a,0 0 19px color-mix(in srgb,var(--card-accent) 82%,transparent),0 0 0 2px color-mix(in srgb,var(--card-accent) 25%,transparent)}}@keyframes m7d-story-spin{to{transform:rotate(360deg)}}
.m7d-categories{display:flex;grid-template-columns:none;gap:7px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding:1px 1px 5px;-webkit-overflow-scrolling:touch}.m7d-categories::-webkit-scrollbar{display:none}.m7d-category{flex:0 0 82px;min-width:82px;scroll-snap-align:start;padding-inline:5px}.m7d-card{cursor:pointer;transition:transform .18s ease,border-color .18s ease}.m7d-card:active{transform:scale(.985)}.m7d-card:focus-visible{outline:2px solid #f3cc7f;outline-offset:3px}.m7d-heart{width:34px;height:34px;border:1px solid #ffffff22;background:#090806b8;backdrop-filter:blur(7px)}.m7d-heart[aria-pressed=true]{border-color:#f5ce7e88}.m7d-heart:disabled{opacity:.58}
@media(min-width:700px){#ma7alak-shops-page.m7d{padding:0 28px 50px!important}.m7d-hero{margin:0 -28px;min-height:260px;padding:26px}.m7d-logo{width:230px;height:132px}.m7d-hero h1{font-size:42px}.m7d-hero p{font-size:19px}.m7d-search{height:62px}.m7d-categories{gap:10px}.m7d-category{min-height:95px;font-size:14px!important}.m7d-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.m7d-strip{gap:14px}.m7d-strip>.m7d-card-wrap{flex-basis:calc(33.333% - 10px)}.m7d-cover{height:170px}.m7d-card h3{font-size:18px}.m7d-address{font-size:12px}.m7d-identity{grid-template-columns:74px minmax(0,1fr);margin-top:-36px}.m7d-avatar{width:74px;height:74px}.m7d-view{min-height:36px}.m7d-cta strong{font-size:17px}.m7d-cta small,.m7d-cta button{font-size:13px}.m7d-row h2{font-size:20px}.m7d-row{margin-top:22px}}
/* Compact Featured pill keeps LIVE fully visible.
   Verified stays on the south-east edge.
   VIP crown sits on the top-center edge so both badges fit the same circle. */
.m7d-card-wrap{padding-top:16px}
.m7d-card-tab{left:10px;min-height:23px;padding:3px 8px;font-size:7px;letter-spacing:.5px;box-shadow:0 5px 12px #0008}
.m7d-card-tab.featured{box-shadow:0 0 10px #ff294b70,0 6px 14px #0009}
.m7d-avatar-shell{position:relative;display:block;grid-row:1/4;width:68px;height:68px;overflow:visible}
.m7d-avatar-shell>.m7d-avatar{grid-row:auto}
.m7d-avatar-shell>.m7d-verified{position:absolute;right:-4px;bottom:-3px;z-index:8;display:grid;place-items:center;width:21px;height:21px;margin:0;border:2px solid #111;border-radius:50%;color:#2f9cff;background:#fff;box-shadow:0 3px 9px #000b,0 0 0 1px #2f9cff55}
.m7d-avatar-shell>.m7d-verified svg{width:18px;height:18px}
.m7d-avatar-shell>.m7d-og-badge{--m7d-og-primary:#d9a441;--m7d-og-secondary:#fff2a4;--m7d-og-bg:#160e06;--m7d-og-text:#fff0b8;--m7d-og-size:21px;--m7d-og-font:6.5px;--m7d-og-speed:2.8s;--m7d-og-glow:9px;position:absolute;right:-4px;bottom:-3px;z-index:10;width:var(--m7d-og-size);height:var(--m7d-og-size);display:grid;place-items:center;border:0;padding:0;border-radius:50%;pointer-events:none;filter:drop-shadow(0 3px 5px #000b)}
.m7d-avatar-shell>.m7d-og-badge.has-verified{right:-4px;bottom:23px}
.m7d-og-core{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;overflow:hidden;border:1.5px solid var(--m7d-og-secondary);border-radius:50%;box-sizing:border-box;color:var(--m7d-og-text);background:radial-gradient(circle at 35% 24%,color-mix(in srgb,var(--m7d-og-primary) 25%,var(--m7d-og-bg)),var(--m7d-og-bg) 62%);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--m7d-og-primary) 80%,transparent),0 0 var(--m7d-og-glow) color-mix(in srgb,var(--m7d-og-primary) 72%,transparent);font-family:Arial,sans-serif;line-height:1;isolation:isolate;will-change:transform,filter,box-shadow}
.m7d-og-core small{position:relative;z-index:1;height:7px;margin-top:-2px;color:var(--m7d-og-primary);font-size:7px;line-height:7px;text-shadow:0 0 5px currentColor}
.m7d-og-core b{position:relative;z-index:1;display:block;max-width:90%;overflow:hidden;color:var(--m7d-og-text);font-size:var(--m7d-og-font);font-weight:950;letter-spacing:-.3px;line-height:10px;text-overflow:clip;white-space:nowrap;text-shadow:0 1px 2px #000}
.m7d-og-core::after{content:"";position:absolute;inset:-35%;z-index:0;background:linear-gradient(105deg,transparent 38%,color-mix(in srgb,var(--m7d-og-secondary) 70%,transparent) 49%,transparent 60%);transform:translateX(-70%) rotate(8deg)}
.m7d-og-badge[data-animation="shimmer"] .m7d-og-core::after{animation:m7dOgShimmer var(--m7d-og-speed) ease-in-out infinite}
.m7d-og-badge[data-animation="breathe"] .m7d-og-core{animation:m7dOgBreathe var(--m7d-og-speed) ease-in-out infinite}
.m7d-og-badge[data-animation="float"] .m7d-og-core{animation:m7dOgFloat var(--m7d-og-speed) ease-in-out infinite}
.m7d-og-badge[data-animation="pulse"] .m7d-og-core{animation:m7dOgPulse var(--m7d-og-speed) ease-in-out infinite}
.m7d-og-badge[data-animation="sparkle"] .m7d-og-core{animation:m7dOgSparkle var(--m7d-og-speed) steps(2,end) infinite}
@keyframes m7dOgShimmer{0%,28%{transform:translateX(-70%) rotate(8deg);opacity:0}48%{opacity:1}72%,100%{transform:translateX(70%) rotate(8deg);opacity:0}}
@keyframes m7dOgBreathe{0%,100%{filter:brightness(.92);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--m7d-og-primary) 70%,transparent),0 0 calc(var(--m7d-og-glow) * .55) color-mix(in srgb,var(--m7d-og-primary) 48%,transparent)}50%{filter:brightness(1.22);box-shadow:inset 0 0 0 1.5px var(--m7d-og-primary),0 0 var(--m7d-og-glow) color-mix(in srgb,var(--m7d-og-primary) 80%,transparent)}}
@keyframes m7dOgFloat{0%,100%{transform:translate3d(0,0,0) rotate(-2deg)}50%{transform:translate3d(0,-3px,0) rotate(2deg)}}
@keyframes m7dOgPulse{0%,100%{transform:scale(.96)}50%{transform:scale(1.07)}}
@keyframes m7dOgSparkle{0%,100%{filter:brightness(1)}25%{filter:brightness(1.45)}50%{filter:brightness(1.08)}75%{filter:brightness(1.35)}}

.m7d-avatar-shell>.m7d-vip-crown{
  position:absolute;
  left:50%;
  top:-13px;
  z-index:9;
  width:31px;
  height:23px;
  display:block;
  transform:translate3d(-50%,0,0);
  -webkit-transform:translate3d(-50%,0,0);
  pointer-events:none;
  filter:drop-shadow(0 3px 5px #000a) drop-shadow(0 0 6px #ffc94188);
  -webkit-filter:drop-shadow(0 3px 5px #000a) drop-shadow(0 0 6px #ffc94188);
  animation:m7dVipCrownFloat 2.2s ease-in-out infinite!important;
  -webkit-animation:m7dVipCrownFloat 2.2s ease-in-out infinite!important;
  transform-origin:50% 100%;
  -webkit-transform-origin:50% 100%;
  will-change:transform,filter;
  -webkit-backface-visibility:hidden;
  backface-visibility:hidden;
}
.m7d-avatar-shell>.m7d-vip-crown svg{
  display:block;
  width:100%;
  height:100%;
  overflow:visible;
  animation:m7dVipCrownGlow 1.65s ease-in-out infinite!important;
  -webkit-animation:m7dVipCrownGlow 1.65s ease-in-out infinite!important;
  will-change:filter;
}
.m7d-avatar-shell>.m7d-vip-crown::before,
.m7d-avatar-shell>.m7d-vip-crown::after{
  content:"";
  position:absolute;
  width:3px;
  height:3px;
  border-radius:50%;
  background:#fff2a4;
  box-shadow:0 0 7px #ffd34d;
  opacity:.25;
  animation:m7dVipSpark 1.35s ease-in-out infinite!important;
  -webkit-animation:m7dVipSpark 1.35s ease-in-out infinite!important;
  will-change:transform,opacity;
}
.m7d-avatar-shell>.m7d-vip-crown::before{left:-1px;top:6px}
.m7d-avatar-shell>.m7d-vip-crown::after{right:-1px;top:2px;animation-delay:.62s!important;-webkit-animation-delay:.62s!important}

@keyframes m7dVipCrownFloat{
  0%,100%{transform:translate3d(-50%,0,0) rotate(-2deg) scale(1)}
  50%{transform:translate3d(-50%,-4px,0) rotate(2deg) scale(1.045)}
}
@-webkit-keyframes m7dVipCrownFloat{
  0%,100%{-webkit-transform:translate3d(-50%,0,0) rotate(-2deg) scale(1);transform:translate3d(-50%,0,0) rotate(-2deg) scale(1)}
  50%{-webkit-transform:translate3d(-50%,-4px,0) rotate(2deg) scale(1.045);transform:translate3d(-50%,-4px,0) rotate(2deg) scale(1.045)}
}
@keyframes m7dVipCrownGlow{
  0%,100%{filter:brightness(1) drop-shadow(0 0 0 rgba(255,211,77,0))}
  50%{filter:brightness(1.28) drop-shadow(0 0 5px rgba(255,211,77,.72))}
}
@-webkit-keyframes m7dVipCrownGlow{
  0%,100%{-webkit-filter:brightness(1) drop-shadow(0 0 0 rgba(255,211,77,0))}
  50%{-webkit-filter:brightness(1.28) drop-shadow(0 0 5px rgba(255,211,77,.72))}
}
@keyframes m7dVipSpark{
  0%,100%{opacity:.16;transform:translate3d(0,1px,0) scale(.62)}
  50%{opacity:1;transform:translate3d(0,-2px,0) scale(1.35)}
}
@-webkit-keyframes m7dVipSpark{
  0%,100%{opacity:.16;-webkit-transform:translate3d(0,1px,0) scale(.62)}
  50%{opacity:1;-webkit-transform:translate3d(0,-2px,0) scale(1.35)}
}

@media(min-width:700px){
  .m7d-avatar-shell{width:74px;height:74px}
  .m7d-avatar-shell>.m7d-vip-crown{width:33px;height:24px;top:-14px}
}
@media(prefers-reduced-motion:reduce){
  .m7d *,.m7d-dialog[open]{scroll-behavior:auto!important}
  .m7d-card.is-featured,.m7d-card-tab.featured,.m7d-avatar.story:before,.m7d-card.card-glow{animation-duration:3.2s!important;-webkit-animation-duration:3.2s!important}
  .m7d-avatar-shell>.m7d-vip-crown{animation-duration:4.2s!important;-webkit-animation-duration:4.2s!important}
  .m7d-avatar-shell>.m7d-vip-crown svg{animation-duration:3.4s!important;-webkit-animation-duration:3.4s!important}
  .m7d-avatar-shell>.m7d-vip-crown::before,
  .m7d-avatar-shell>.m7d-vip-crown::after{animation-duration:3.2s!important;-webkit-animation-duration:3.2s!important}
  .m7d-og-badge .m7d-og-core,.m7d-og-badge .m7d-og-core::after{animation:none!important}
}

/* SHOW SHOPS — SAME-PAGE STORY VIEWER */
.m7d-story-viewer{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;z-index:2147483647!important;display:none;overflow:hidden;background:#000;color:#fff;touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}
.m7d-story-viewer.open{display:block!important}
.m7d-story-stage{position:absolute;inset:0;display:grid;place-items:center;background:#000;overflow:hidden}
.m7d-story-media-host{position:absolute;inset:0;z-index:5}
.m7d-story-media{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;display:none}
.m7d-story-media.active{display:block}
.m7d-story-progress{position:absolute;z-index:20;top:max(8px,env(safe-area-inset-top));left:9px;right:9px;display:flex;gap:4px;height:3px}
.m7d-story-progress>i{position:relative;flex:1;height:3px;border-radius:999px;background:rgba(255,255,255,.28);overflow:hidden}
.m7d-story-progress>i>b{position:absolute;inset:0 auto 0 0;width:0;background:#fff;border-radius:inherit}
.m7d-story-head{position:absolute;z-index:24;top:max(18px,calc(env(safe-area-inset-top) + 10px));left:12px;right:58px;display:flex;align-items:center;gap:9px;pointer-events:none;text-shadow:0 2px 8px #000}
.m7d-story-head img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.48);background:#151515}
.m7d-story-head span{min-width:0}
.m7d-story-head strong,.m7d-story-head small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.m7d-story-head strong{font-size:12px}
.m7d-story-head small{font-size:9px;color:rgba(255,255,255,.72);margin-top:2px}
.m7d-story-close{position:absolute;z-index:28;top:max(16px,calc(env(safe-area-inset-top) + 8px));right:10px;width:38px;height:38px;border:0;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,10,.58);color:#fff;font-size:27px!important;line-height:1;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.m7d-story-hit{position:absolute;z-index:12;top:0;bottom:0;border:0;background:transparent;padding:0;margin:0}
.m7d-story-hit.prev{left:0;width:38%}
.m7d-story-hit.next{right:0;width:62%}
.m7d-story-viewer .m7d-story-loading{position:absolute;z-index:8;inset:0;display:grid;place-items:center;color:#e8d5a2;font-size:11px;letter-spacing:.5px;background:#000}
.m7d-story-viewer.ready .m7d-story-loading{display:none}
.m7d-avatar-shell[data-story-circle]{cursor:pointer;touch-action:manipulation}
.m7d-avatar-shell[data-story-circle]:active{transform:scale(.97)}
`;
  function img(src,cls='',alt=''){return url(src)?`<img class="${cls}" src="${esc(url(src))}" alt="${esc(alt)}" loading="lazy" decoding="async">`:''}
  function initials(value){const parts=String(value||'Shop').trim().split(/\s+/).filter(Boolean);return (parts.slice(0,2).map(part=>part[0]).join('')||'S').toLocaleUpperCase()}
  function categoryIcon(c){const custom=state.settings.category_icons?.[c.category_key];if(custom&&url(custom))return img(custom);if(custom)return `<span class="emoji">${esc(custom)}</span>`;return paths[c.category_key]?icon(c.category_key):`<span class="emoji">${esc(c.icon||'✦')}</span>`}
  function categories(){const order=state.settings.category_order||[];return [...state.categories].sort((a,b)=>{let ai=order.indexOf(a.category_key),bi=order.indexOf(b.category_key);return (ai<0?1000+a.sort_order:ai)-(bi<0?1000+b.sort_order:bi)})}
  function matches(s,ignoreCategory=false){const place=places().find(p=>norm(p.key)===norm(area));const areaMatch=!area||[s.area,s.city].some(v=>[area,place?.name].some(p=>p&&norm(p)===norm(v)));return areaMatch&&(ignoreCategory||!category||s.category===category)&&(!q||norm([s.shop_name,s.arabic_name,s.category_name,s.location,s.area,s.city].join(' ')).includes(norm(q)))&&(!followedOnly||followed.has(s.shop_slug))&&(!liveOnly||live(s))&&(!coords||distance(s)<=Number(state.settings.radius||25))}
  function categoryButtons(){const available=new Set(state.shops.filter(s=>matches(s,true)).map(s=>s.category));const list=categories().filter(c=>available.has(c.category_key));return list.length?list.map(c=>`<button class="m7d-category" data-category="${esc(c.category_key)}" aria-pressed="${category===c.category_key}">${categoryIcon(c)}<span>${esc(state.settings.category_labels?.[c.category_key]||c.category_name)}</span></button>`).join(''):'<div class="m7d-category-empty"><strong>No matching categories yet</strong><br>New categories will appear here automatically.</div>'}
  function places(){const p=state.areas.map(a=>({key:a.area_key,name:a.area_name,city:a.city_key}));state.cities.forEach(c=>{if(!p.some(a=>norm(a.key)===norm(c.city_key)))p.push({key:c.city_key,name:c.city_name})});return p}
  function areaButtons(){return `<button class="m7d-pill" data-area="" aria-pressed="${!area&&!coords}">All areas</button>`+places().map(a=>`<button class="m7d-pill" data-area="${esc(a.key)}" aria-pressed="${norm(area)===norm(a.key)}">${esc(a.name)}</button>`).join('')+`<button class="m7d-pill" data-action="near" aria-pressed="${!!coords}">${icon('near')}Near me</button>`}
  function live(s){return state.live.some(p=>p.shop_slug===s.shop_slug&&new Date(p.starts_at)<=new Date()&&new Date(p.ends_at)>new Date())}
  function featured(s){const end=s.directory_options?.featured_until;return s.featured===true&&(!end||new Date(end)>new Date())}
  function stories(s){return state.stories.filter(p=>p.shop_slug===s.shop_slug&&new Date(p.expires_at)>new Date())}
  function distance(s){const o=s.directory_options||{};if(!coords||o.latitude==null||o.longitude==null)return Infinity;const r=x=>Number(x)*Math.PI/180;const a=Math.sin(r(o.latitude-coords.latitude)/2)**2+Math.cos(r(coords.latitude))*Math.cos(r(o.latitude))*Math.sin(r(o.longitude-coords.longitude)/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)))}
  function score(s){const row=state.popularity.find(x=>x.shop_slug===s.shop_slug),base=Number(row?.popularity_score||0);if(!coords)return base;const km=distance(s),radius=Math.max(1,Number(state.settings.radius||25));return base+(Number.isFinite(km)?Math.max(0,25-(km/radius)*25):0)}
  function rotationRank(s){if(!rotation.has(s.shop_slug)){const weight=Math.max(1,score(s)+8);rotation.set(s.shop_slug,Math.log(Math.max(Math.random(),1e-9))/weight)}return rotation.get(s.shop_slug)}
  function filtered(){const a=state.shops.filter(s=>matches(s));return a.sort((a,b)=>sort==='name'?a.shop_name.localeCompare(b.shop_name):rotationRank(b)-rotationRank(a)||a.shop_name.localeCompare(b.shop_name))}
  function verifiedIcon(){return '<span class="m7d-verified" title="Verified shop" aria-label="Verified shop"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l2.3 1.7 2.9-.1.8 2.8 2.4 1.7-.9 2.8.9 2.8-2.4 1.7-.8 2.8-2.9-.1L12 21.6l-2.3-1.7-2.9.1-.8-2.8-2.4-1.7.9-2.8-.9-2.8L6 6.8 6.8 4l2.9.1L12 2.4z"/><path d="m8.2 12.1 2.3 2.3 5.2-5.2" fill="none"/></svg></span>'}
  function ogBadgeOn(s){const v=s?.directory_options?.og_badge_enabled;return v===true||String(v).toLowerCase()==="true"||String(v)==="1"}
  function ogBadgeIcon(s){
    const o=s?.directory_options||{};
    const color=(value,fallback)=>/^#[0-9a-f]{6}$/i.test(String(value||"").trim())?String(value).trim():fallback;
    const number=(value,min,max,fallback)=>{const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback};
    const animation=["none","shimmer","breathe","float","pulse","sparkle"].includes(String(o.og_badge_animation||"").toLowerCase())?String(o.og_badge_animation).toLowerCase():"shimmer";
    const text=String(o.og_badge_text||"OG").trim().slice(0,8)||"OG";
    const icon=String(o.og_badge_icon===undefined||o.og_badge_icon===null?"♛":o.og_badge_icon).trim().slice(0,4);
    /*
       The shop-page badge may be 22–40px, but the Directory avatar is only
       68–74px. Scale the same saved setting into a card-safe 18–24px range.
    */
    const configuredBadgeSize=number(o.og_badge_size,22,40,29);
    const badgeSize=Math.max(18,Math.min(24,Math.round(configuredBadgeSize*.72)));
    const badgeFont=Math.max(5,badgeSize*(text.length<=3?.29:text.length<=5?.20:.16));
    const style=[
      "--m7d-og-primary:"+color(o.og_badge_primary_color,"#d9a441"),
      "--m7d-og-secondary:"+color(o.og_badge_secondary_color,"#fff2a4"),
      "--m7d-og-bg:"+color(o.og_badge_background_color,"#160e06"),
      "--m7d-og-text:"+color(o.og_badge_text_color,"#fff0b8"),
      "--m7d-og-size:"+badgeSize+"px",
      "--m7d-og-font:"+badgeFont.toFixed(1)+"px",
      "--m7d-og-speed:"+number(o.og_badge_animation_speed,1,8,2.8)+"s",
      "--m7d-og-glow:"+(2+number(o.og_badge_glow_strength,0,100,55)*.2).toFixed(1)+"px"
    ].join(";");
    return '<span class="m7d-og-badge '+(s.verified?'has-verified':'')+'" data-animation="'+animation+'" style="'+style+'" title="OG Member · One of ShoufHon’s original shops" aria-label="OG Member"><span class="m7d-og-core">'+(icon?'<small aria-hidden="true">'+esc(icon)+'</small>':'')+'<b dir="auto">'+esc(text)+'</b></span></span>';
  }
  function vipCrownOn(s){const v=s?.directory_options?.vip_crown_enabled;return v===true||String(v).toLowerCase()==="true"||String(v)==="1"}
  function vipCrownIcon(){return '<span class="m7d-vip-crown" title="VIP shop" aria-label="VIP shop"><svg viewBox="0 0 64 46" aria-hidden="true"><defs><linearGradient id="m7d-vip-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff5ad"/><stop offset=".28" stop-color="#ffd65b"/><stop offset=".62" stop-color="#df941f"/><stop offset="1" stop-color="#ffec8b"/></linearGradient></defs><path d="M5 35 9 13l14 11L32 5l9 19 14-11 4 22-6 6H11Z" fill="url(#m7d-vip-gold)" stroke="#fff0a0" stroke-width="2" stroke-linejoin="round"/><path d="M11 35h42v7H11Z" rx="3.5" fill="#b86e12" stroke="#ffe889" stroke-width="1.5"/><circle cx="9" cy="12" r="3" fill="#fff7bf"/><circle cx="32" cy="5" r="3.2" fill="#fffbd6"/><circle cx="55" cy="12" r="3" fill="#fff7bf"/></svg></span>'}
  function storyColor(s){const value=String(s.directory_options?.story_color||'#e3b85f').trim();return /^#[0-9a-f]{6}$/i.test(value)?value:'#e3b85f'}
  function cardColor(s){const value=String(s.directory_options?.card_color||'#dabb7a').trim();return /^#[0-9a-f]{6}$/i.test(value)?value:'#dabb7a'}
  function seenStoryTime(s){try{return new Date(localStorage.getItem('ma7alak_story_seen_'+s.shop_slug)||0).getTime()||0}catch{return 0}}
  function hasUnseenStory(s){const list=stories(s);if(!list.length)return false;const last=seenStoryTime(s);return list.some(item=>new Date(item.created_at||item.expires_at||0).getTime()>last)}
  function markStoriesSeen(s){const list=stories(s);if(!list.length)return;const latest=list.reduce((value,item)=>new Date(item.created_at||0).getTime()>new Date(value||0).getTime()?item.created_at:value,'');if(latest)try{localStorage.setItem('ma7alak_story_seen_'+s.shop_slug,latest)}catch{}renderCards()}
  function card(s){
    const o=s.directory_options||{};
    const slug=esc(s.shop_slug);
    const rating=Number(o.rating);
    const count=Number(o.review_count);
    const isFollowed=followed.has(s.shop_slug);
    const storyList=stories(s);
    const hasAnyStory=storyList.length>0;
    const hasStory=hasUnseenStory(s);
    const isOwner=norm(ownerSlug)===norm(s.shop_slug);
    const isFeatured=featured(s);
    const badge=isFeatured?"FEATURED":norm(o.badge)==="new"?"NEW":"";
    const accent=cardColor(s);
    const legacyGlow=o.card_glow===true||String(o.card_glow).toLowerCase()==="true";

    const hex=(value,fallback)=>{
      const raw=String(value||"").trim();
      return /^#[0-9a-f]{6}$/i.test(raw)?raw:fallback;
    };

    const num=(value,min,max,fallback)=>{
      const n=Number(value);
      return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
    };

    const allowed=(value,list,fallback)=>{
      const raw=String(value||"").trim().toLowerCase();
      return list.includes(raw)?raw:fallback;
    };

    const edge=allowed(
      o.card_edge_style,
      ["rounded","corners","double","soft","none"],
      "rounded"
    );

    const animation=allowed(
      o.card_animation,
      ["auto","none","glow","breathe","edge","shimmer","float","pulse","sway","bounce"],
      "auto"
    );

    const radius=num(o.card_radius,0,34,16);
    const borderWidth=num(o.card_border_width,0,4,1);
    const coverHeight=num(o.card_cover_height,90,220,126);
    const shadow=num(o.card_shadow_strength,0,100,48)/100;
    const glowStrength=num(o.card_glow_strength,0,100,28)/100;
    const speed=num(o.card_animation_speed,0.8,8,2.4);
    const intensity=num(o.card_animation_intensity,0,100,55);
    const shimmerStrength=num(o.card_shimmer_strength,0,100,70)/100;
    const move=2+intensity*.10;
    const scale=1+intensity*.0005;
    const rotate=.3+intensity*.025;
    const shimmerWhite=.08+shimmerStrength*.42;
    const shimmerAccent=.12+shimmerStrength*.48;
    const shimmerSoft=.06+shimmerStrength*.30;

    const surface=hex(o.card_surface_color,"#171611");
    const nameColor=hex(o.card_name_color,"#ffffff");
    const metaColor=hex(o.card_meta_color,"#c8c0b2");
    const buttonColor=hex(o.card_button_color,"#ead49e");
    const buttonBg=hex(o.card_button_bg_color,"#0b0b08");

    const cleanAccent=accent.replace("#","");
    const ar=parseInt(cleanAccent.slice(0,2),16)||193;
    const ag=parseInt(cleanAccent.slice(2,4),16)||166;
    const ab=parseInt(cleanAccent.slice(4,6),16)||106;

    const style=[
      "--card-accent:"+accent,
      "--m7-card-accent-rgb:"+ar+","+ag+","+ab,
      "--m7-card-radius:"+radius+"px",
      "--m7-card-border-width:"+borderWidth+"px",
      "--m7-card-cover-height:"+coverHeight+"px",
      "--m7-card-shadow-alpha:"+shadow.toFixed(2),
      "--m7-card-glow-alpha:"+glowStrength.toFixed(2),
      "--m7-card-speed:"+speed+"s",
      "--m7-card-intensity:"+(intensity/100).toFixed(2),
      "--m7-card-shimmer:"+shimmerStrength.toFixed(2),
      "--m7-card-shimmer-white:"+shimmerWhite.toFixed(3),
      "--m7-card-shimmer-accent:"+shimmerAccent.toFixed(3),
      "--m7-card-shimmer-soft:"+shimmerSoft.toFixed(3),
      "--m7-card-move:"+move.toFixed(1)+"px",
      "--m7-card-move-neg:"+(-move).toFixed(1)+"px",
      "--m7-card-move-quarter:"+(move*.25).toFixed(1)+"px",
      "--m7-card-scale:"+scale.toFixed(4),
      "--m7-card-rotate:"+rotate.toFixed(2)+"deg",
      "--m7-card-rotate-neg:"+(-rotate).toFixed(2)+"deg",
      "--m7-card-surface:"+surface,
      "--m7-card-name:"+nameColor,
      "--m7-card-meta:"+metaColor,
      "--m7-card-button:"+buttonColor,
      "--m7-card-button-bg:"+buttonBg
    ].join(";");

    const mark=esc(initials(s.shop_name));
    const ratingMarkup=rating>0&&count>0?`<div class="m7d-rating">★ ${rating.toFixed(1)} <span>(${count} reviews)</span></div>`:'<div class="m7d-rating is-empty" aria-hidden="true">★ 0.0</div>';
    return `<div class="m7d-card-wrap">${badge?`<span class="m7d-card-tab ${isFeatured?"featured":""}">${isFeatured?"★ ":""}${badge}</span>`:""}<article class="m7d-card ${isFeatured?"is-featured":""} ${legacyGlow?"card-glow":""} m7d-edge-${edge} m7d-anim-${animation}" style="${style}" data-shop-card="${slug}" data-shop-slug="${slug}" role="link" tabindex="0" aria-label="Open ${esc(s.shop_name)}"><div class="m7d-cover-button"><div class="m7d-cover-fallback" aria-hidden="true"><span class="m7d-cover-mark">${mark}</span><small>SHOUFHON</small></div>${img(o.profile_banner_image_url,"m7d-cover",`${s.shop_name||'Shop'} banner`)}</div>${live(s)?'<span class="m7d-live-badge">LIVE</span>':""}${isOwner?'<span class="m7d-owner-label">YOUR SHOP</span>':`<button class="m7d-heart" data-follow="${slug}" aria-label="${isFollowed?"Unfollow":"Follow"} ${esc(s.shop_name)}" aria-pressed="${isFollowed}" ${followBusy.has(s.shop_slug)?"disabled":""}>${icon("heart")}</button>`}<div class="m7d-card-content"><div class="m7d-identity"><div class="m7d-avatar-shell" ${hasAnyStory?`data-story-circle="${slug}" role="button" tabindex="0" aria-label="Watch ${esc(s.shop_name)} stories"`:""}><div class="m7d-avatar ${hasStory?"story":""}" style="--story:${storyColor(s)}"><span class="m7d-avatar-fallback" aria-hidden="true">${mark}</span>${img(s.profile_image_url,'',`${s.shop_name||'Shop'} profile`)}</div>${vipCrownOn(s)?vipCrownIcon():""}${ogBadgeOn(s)?ogBadgeIcon(s):""}${s.verified?verifiedIcon():""}</div><h3>${esc(s.shop_name)}</h3><div class="m7d-card-label">${esc(s.category_name||s.category||"Local shop")}${o.price?" · "+esc(o.price):""}</div><div class="m7d-address">${icon("pin")}<span>${esc(s.location||s.area||s.city||"Location coming soon")}${coords&&Number.isFinite(distance(s))?" · "+distance(s).toFixed(1)+" km":""}</span></div></div>${ratingMarkup}<button class="m7d-view" data-open-shop="${slug}">View shop ${icon("arrow")}</button></div></article></div>`;
  }

  function render(){const c=state.settings;root.querySelector('.m7d-hero').innerHTML=`${img(c.hero,'m7d-hero-bg')}${img(c.logo,'m7d-logo','ShoufHon')}<span class="m7d-side">Lebanon<br>Local<br>Always ♡</span><h1 dir="auto">${esc(c.title)}</h1><p>${esc(c.subtitle)}</p>`;root.querySelector('input').placeholder=c.search;root.querySelector('[data-location-title]').textContent=c.location_title;root.querySelector('[data-areas]').innerHTML=areaButtons();root.querySelector('[data-categories]').innerHTML=categoryButtons();root.querySelector('[data-category-section]').hidden=c.show_categories===false;root.querySelector('[data-category-title]').textContent=c.categories_title;root.querySelector('[data-cta]').hidden=c.show_cta===false;root.querySelector('[data-cta-title]').textContent=c.cta_title;root.querySelector('[data-cta-text]').textContent=c.cta_text;root.querySelector('[data-action=add]').textContent=c.cta_button+' →';renderCards()}
  function emptyState(){const label=[area,category].filter(Boolean).join(' · ');return `<div class="m7d-empty"><div class="m7d-empty-icon">${icon('search')}</div><strong>No matching shops yet</strong><p>${label?'Nothing is listed for '+esc(label)+' yet. ':''}New shops will appear here automatically.</p><button class="m7d-pill" data-action="reset">Explore every shop</button></div>`}
  function renderCards(){const a=filtered(),filteredMode=!!(q||category||area||coords||followedOnly||liveOnly),featuredShops=a.filter(featured);root.querySelector('[data-categories]').innerHTML=categoryButtons();root.querySelector('[data-results-title]').textContent=filteredMode?'Explore shops':state.settings.shops_title;root.querySelector('[data-count]').textContent=a.length+' shop'+(a.length===1?'':'s')+(coords?' nearby':'')+' ›';const grid=root.querySelector('[data-grid]'),markup=a.slice(0,limit).map(card).join('')||emptyState();grid.classList.remove('m7d-strip');if(grid.dataset.signature!==markup){grid.innerHTML=markup;grid.dataset.signature=markup}const section=root.querySelector('[data-featured-section]'),featuredGrid=root.querySelector('[data-featured-grid]');section.hidden=filteredMode||!featuredShops.length;const featureMarkup=featuredShops.map(card).join('');if(featuredGrid.dataset.signature!==featureMarkup){featuredGrid.innerHTML=featureMarkup;featuredGrid.dataset.signature=featureMarkup}root.querySelector('[data-featured-count]').textContent=featuredShops.length+' featured ›';root.querySelector('[data-action=more]').hidden=a.length<=limit;root.querySelector('[data-saved]').textContent=followedOnly?'Show all shops':'♡ Following ('+followed.size+')'}
  function setPanel(title,html){panel.querySelectorAll('video').forEach(v=>v.pause());loadToken++;dialog.querySelector('h2').textContent=title;panel.innerHTML=html;if(!dialog.open){returnFocus=document.activeElement;dialog.showModal();document.documentElement.style.overflow='hidden';window.dispatchEvent(new CustomEvent('ma7alak:panel-open',{detail:{panel:'directory'}}))}panel.scrollTop=0;return loadToken}
  function close(){loadToken++;panel.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});dialog.close();document.documentElement.style.overflow=oldOverflow;shopOpen='';returnFocus?.focus({preventScroll:true})}
  let oldOverflow='';
  function feedback(t){root.querySelector('[data-feedback]').textContent=t}
  function showFilters(){shopOpen='';setPanel('Find your next local favorite',`<label>Sort by<select data-sort><option value="popular">Most popular</option><option value="name">Name A–Z</option></select></label><label><input type="checkbox" data-live ${liveOnly?'checked':''}> Live offers now</label><label><input type="checkbox" data-followed-only ${followedOnly?'checked':''}> Only shops I follow</label><h3>Choose an area</h3><div class="m7d-areas">${areaButtons()}</div><h3>Categories</h3><div class="m7d-categories">${categoryButtons()}</div><p><button class="m7d-gold" data-action="apply">Show results</button> <button class="m7d-pill" data-action="reset">Reset filters</button></p>`);panel.querySelector('[data-sort]').value=sort}
  async function near(){if(!navigator.geolocation){feedback('Location is unavailable. Choose an area instead.');return}feedback('Finding shops near you…');navigator.geolocation.getCurrentPosition(p=>{coords=p.coords;area='';limit=24;render();feedback(filtered().length?'Sorted by distance from you.':'No shops with a mapped location within '+state.settings.radius+' km. Choose an area to browse all shops.');if(dialog.open&& !shopOpen)close()},()=>feedback('Location wasn’t available. You can choose an area instead.'),{timeout:10000,maximumAge:60000})}
  function detailHead(s){return `${img(s.directory_options?.profile_banner_image_url,'m7d-detail-cover')}<div class="m7d-detail-head">${img(s.profile_image_url)}<div><h3>${esc(s.shop_name)}</h3><p>${esc(s.category_name||'')} · ${esc(s.location||s.area||s.city||'')}</p></div></div>`}
  async function showShop(slug,nextTab='about'){const s=state.shops.find(x=>x.shop_slug===slug);if(!s)return;shopOpen=slug;tab=nextTab;const token=setPanel(s.shop_name,detailHead(s)+`<div class="m7d-tabs">${['about','gallery','reels','offers','stories','location'].map(t=>`<button class="m7d-pill" data-tab="${t}" aria-pressed="${tab===t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div><div class="m7d-tab-body" aria-live="polite">Loading…</div>`);const body=panel.querySelector('.m7d-tab-body');try{let html='';if(tab==='about'){const hours=s.opening_hours;html=`<p>${esc(s.about_text||'More details from this shop are coming soon.')}</p><p>${esc(s.address_text||s.location||'')}</p>${hours?'<h4>Opening hours</h4><p>'+esc(typeof hours==='string'?hours:Object.entries(hours).map(([day,v])=>day+': '+(typeof v==='object'?v.closed?'Closed':[v.open,v.close].filter(Boolean).join(' – '):v)).join('\n'))+'</p>':''}${s.menu_image_url?'<h4>Menu</h4>'+img(s.menu_image_url,'m7d-media-full','Menu'):''}<button class="m7d-pill" data-save="${esc(slug)}" aria-pressed="${saved.has(slug)}">${saved.has(slug)?'♥ Saved':'♡ Save shop'}</button>`}else if(tab==='location'){let map=url(s.map_embed_url);if(map&&!/^https:\/\/(www\.)?google\.(com|[a-z.]+)\/maps\//.test(map))map='';html=`<p>${esc(s.address_text||s.location||s.area||'Location details coming soon.')}</p>${map?`<iframe class="m7d-map" src="${esc(map)}" title="Map for ${esc(s.shop_name)}" loading="lazy" referrerpolicy="no-referrer"></iframe>`:'<p class="m7d-muted">The shop has not added an embedded map yet.</p>'}`}else if(tab==='stories'){const list=stories(s);html=list.length?`<button class="m7d-gold" data-story="${esc(slug)}">Watch ${list.length} ${list.length===1?'story':'stories'}</button>`:'No stories right now.'}else if(tab==='offers'){const list=state.live.filter(p=>p.shop_slug===slug&&new Date(p.ends_at)>new Date());html=list.map(p=>`<article class="m7d-offer">${p.media_type==='video'?`<video controls playsinline preload="metadata" src="${esc(url(p.media_url))}"></video>`:img(p.media_url)}<h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.offer_price!=null?`<strong>$${esc(p.offer_price)}</strong>`:''}<p class="m7d-muted">Starts ${esc(new Date(p.starts_at).toLocaleString())}<br>Ends ${esc(new Date(p.ends_at).toLocaleString())}</p><button class="m7d-pill" data-offer="${esc(p.id)}">View offer & media</button></article>`).join('')||'Nothing live right now.'}else{const result=tab==='reels'?await client.from('shop_reels').select('reel_id,video_url,caption').eq('shop_slug',slug).eq('active',true).order('created_at',{ascending:false}):await client.from('shop_media').select('id,media_type,media_url,poster_url,source_type').eq('shop_slug',slug).eq('is_active',true).order('sort_order');if(result.error)throw result.error;html='<div class="m7d-gallery">'+(result.data||[]).map(m=>tab==='reels'||m.media_type==='video'?`<div><video controls playsinline preload="none" ${m.poster_url?`poster="${esc(url(m.poster_url))}"`:''} src="${esc(url(m.video_url||m.media_url))}"></video>${m.caption?`<p>${esc(m.caption)}</p>`:''}</div>`:`<button data-photo="${esc(url(m.media_url))}" aria-label="Enlarge photo">${img(m.media_url)}</button>`).join('')+'</div>';if(!result.data?.length)html='No '+tab+' yet.'}if(token===loadToken&&dialog.open)body.innerHTML=html}catch(e){if(token===loadToken)body.textContent='Could not load this section. Please try again.';console.warn('Directory detail:',e)}}
  function storyPublicUrl(item){
    const direct=url(item?.storage_path||item?.media_url||item?.url||"");
    if(direct)return direct;
    const path=String(item?.storage_path||"").trim();
    if(!path||!client)return "";
    try{return client.storage.from("shop-stories").getPublicUrl(path).data.publicUrl||""}catch{return ""}
  }

  function storyTimeAgo(value){
    const time=new Date(value||0).getTime();
    if(!time)return "";
    const seconds=Math.max(0,Math.floor((Date.now()-time)/1000));
    if(seconds<60)return seconds+"s ago";
    const minutes=Math.floor(seconds/60);
    if(minutes<60)return minutes+"m ago";
    const hours=Math.floor(minutes/60);
    if(hours<24)return hours+"h ago";
    return Math.floor(hours/24)+"d ago";
  }

  function clearStoryPlayback(){
    clearTimeout(storyViewerTimer);
    storyViewerTimer=0;
    cancelAnimationFrame(storyViewerRaf);
    storyViewerRaf=0;
    if(!storyViewerMedia)return;
    storyViewerMedia.querySelectorAll("video").forEach(video=>{
      try{video.pause()}catch(_){}
      video.removeAttribute("src");
      try{video.load()}catch(_){}
    });
    storyViewerMedia.innerHTML="";
  }

  function setStoryProgress(value){
    if(!storyViewerProgress)return;
    const bars=[...storyViewerProgress.querySelectorAll("i>b")];
    bars.forEach((bar,i)=>{
      bar.style.width=i<storyViewerIndex?"100%":i>storyViewerIndex?"0%":Math.max(0,Math.min(100,value))+"%";
    });
  }

  function nextDirectoryStory(){
    if(!storyViewerOpen)return;
    if(storyViewerIndex>=storyViewerList.length-1){
      closeDirectoryStory();
      return;
    }
    renderDirectoryStory(storyViewerIndex+1);
  }

  function previousDirectoryStory(){
    if(!storyViewerOpen)return;
    if(storyViewerIndex<=0){
      renderDirectoryStory(0);
      return;
    }
    renderDirectoryStory(storyViewerIndex-1);
  }

  function startImageStoryTimer(){
    const duration=5200;
    const started=performance.now();
    const tick=now=>{
      if(!storyViewerOpen)return;
      const progress=Math.min(100,((now-started)/duration)*100);
      setStoryProgress(progress);
      if(progress>=100){
        nextDirectoryStory();
        return;
      }
      storyViewerRaf=requestAnimationFrame(tick);
    };
    storyViewerRaf=requestAnimationFrame(tick);
  }

  function startVideoStoryProgress(video){
    const update=()=>{
      if(!storyViewerOpen||!video.isConnected)return;
      const duration=Number(video.duration);
      const current=Number(video.currentTime);
      if(Number.isFinite(duration)&&duration>0&&Number.isFinite(current)){
        setStoryProgress((current/duration)*100);
      }
      storyViewerRaf=requestAnimationFrame(update);
    };
    storyViewerRaf=requestAnimationFrame(update);
    video.addEventListener("ended",nextDirectoryStory,{once:true});
    const play=video.play();
    if(play&&typeof play.catch==="function"){
      play.catch(()=>{video.muted=true;video.play().catch(()=>{})});
    }
  }

  function renderDirectoryStory(index){
    if(!storyViewerOpen||!storyViewerList.length)return;
    clearStoryPlayback();
    storyViewerIndex=Math.max(0,Math.min(storyViewerList.length-1,Number(index)||0));
    const item=storyViewerList[storyViewerIndex];
    const shop=state.shops.find(x=>x.shop_slug===storyViewerSlug);
    const src=storyPublicUrl(item);

    storyViewer.classList.remove("ready");
    storyViewerProgress.innerHTML=storyViewerList.map(()=>"<i><b></b></i>").join("");
    setStoryProgress(0);

    const avatar=url(shop?.profile_image_url);
    storyViewerShop.innerHTML=(avatar?`<img src="${esc(avatar)}" alt="">`:"")+`<span><strong>${esc(shop?.shop_name||"Shop")}</strong><small>${esc(storyTimeAgo(item?.created_at))}</small></span>`;

    const isVideo=String(item?.media_type||"").toLowerCase()==="video"||/\.(mp4|webm|mov|m4v)(?:$|\?)/i.test(src);
    if(isVideo){
      const video=document.createElement("video");
      video.className="m7d-story-media active";
      video.playsInline=true;
      video.setAttribute("playsinline","");
      video.setAttribute("webkit-playsinline","");
      video.preload="auto";
      video.autoplay=true;
      video.muted=false;
      video.src=src;
      storyViewerMedia.appendChild(video);
      video.addEventListener("loadedmetadata",()=>{
        storyViewer.classList.add("ready");
        startVideoStoryProgress(video);
      },{once:true});
      video.addEventListener("canplay",()=>storyViewer.classList.add("ready"),{once:true});
      video.addEventListener("error",()=>{storyViewer.classList.add("ready");storyViewerTimer=setTimeout(nextDirectoryStory,1800)},{once:true});
      requestAnimationFrame(()=>{
        const play=video.play();
        if(play&&typeof play.catch==="function"){
          play.catch(()=>{video.muted=true;video.play().catch(()=>{})});
        }
      });
    }else{
      const image=document.createElement("img");
      image.className="m7d-story-media active";
      image.alt="";
      image.decoding="async";
      image.src=src;
      storyViewerMedia.appendChild(image);
      const ready=()=>{
        storyViewer.classList.add("ready");
        startImageStoryTimer();
      };
      if(image.complete)ready();
      else{
        image.addEventListener("load",ready,{once:true});
        image.addEventListener("error",()=>{storyViewer.classList.add("ready");storyViewerTimer=setTimeout(nextDirectoryStory,1800)},{once:true});
      }
    }
  }

  function restoreStoryScroll(){
    if(!storyScrollState)return;
    const restore=(node,value,priority)=>{
      if(value)node.style.setProperty("overflow",value,priority||"");
      else node.style.removeProperty("overflow");
    };
    restore(document.documentElement,storyScrollState.html,storyScrollState.htmlPriority);
    restore(document.body,storyScrollState.body,storyScrollState.bodyPriority);
    storyScrollState=null;
  }

  function exitDirectoryStoryFullscreen(){
    try{
      const fs=document.fullscreenElement||document.webkitFullscreenElement;
      if(fs===storyViewer||storyViewer?.contains?.(fs)){
        const exit=document.exitFullscreen||document.webkitExitFullscreen;
        if(typeof exit==="function"){
          const result=exit.call(document);
          if(result&&typeof result.catch==="function")result.catch(()=>{});
        }
      }
    }catch(_){}
  }

  function closeDirectoryStory(fromHistory=false){
    if(!storyViewerOpen)return;
    storyViewerOpen=false;
    clearStoryPlayback();
    exitDirectoryStoryFullscreen();
    storyViewer?.classList.remove("open","ready");
    storyViewer?.setAttribute("aria-hidden","true");
    restoreStoryScroll();
    if(storyHistoryArmed){
      storyHistoryArmed=false;
      if(!fromHistory&&history.state?.m7DirectoryStory){
        history.back();
      }
    }
  }

  function openDirectoryStory(slug,index=0){
    const shop=state.shops.find(x=>x.shop_slug===slug);
    const list=shop?stories(shop):[];
    if(!shop||!list.length)return;

    markStoriesSeen(shop);
    storyViewerSlug=slug;
    storyViewerList=list;
    storyViewerIndex=Math.max(0,Math.min(list.length-1,Number(index)||0));
    storyViewerOpen=true;

    if(dialog?.open)dialog.querySelectorAll("video").forEach(v=>v.pause());

    storyScrollState={
      html:document.documentElement.style.overflow,
      body:document.body.style.overflow,
      htmlPriority:document.documentElement.style.getPropertyPriority("overflow"),
      bodyPriority:document.body.style.getPropertyPriority("overflow")
    };
    document.documentElement.style.setProperty("overflow","hidden","important");
    document.body.style.setProperty("overflow","hidden","important");

    storyViewer.classList.add("open");
    storyViewer.setAttribute("aria-hidden","false");

    /*
       Request real fullscreen directly from the user's profile-circle tap.
       This is required on Android/Chrome/Brave to hide browser chrome.
       If a browser does not support element fullscreen, the fixed viewer
       remains as the fallback.
    */
    try{
      const request=storyViewer.requestFullscreen||storyViewer.webkitRequestFullscreen;
      if(typeof request==="function"){
        const result=request.call(storyViewer,{navigationUI:"hide"});
        if(result&&typeof result.catch==="function")result.catch(()=>{});
      }
    }catch(_){}

    renderDirectoryStory(storyViewerIndex);

    if(!storyHistoryArmed){
      try{
        history.pushState({...history.state,m7DirectoryStory:true},"");
        storyHistoryArmed=true;
      }catch(_){}
    }
  }

  async function showStories(slug,index=0){
    openDirectoryStory(slug,index);
  }
  async function showOffer(id){const offer=state.live.find(x=>String(x.id)===String(id));if(!offer)return;const token=setPanel(offer.title,'Loading offer media…');try{const r=await client.from('shop_live_post_media').select('media_url,media_type').eq('post_id',id).order('sort_order');if(r.error)throw r.error;if(token!==loadToken)return;const media=r.data?.length?r.data:[offer];panel.innerHTML=`<p>${esc(offer.description)}</p>${media.map(m=>m.media_type==='video'?`<video class="m7d-media-full" controls playsinline preload="metadata" src="${esc(url(m.media_url))}"></video>`:img(m.media_url,'m7d-media-full')).join('')}<p class="m7d-muted">Starts ${esc(new Date(offer.starts_at).toLocaleString())}<br>Ends ${esc(new Date(offer.ends_at).toLocaleString())}</p><button class="m7d-gold" data-shop="${esc(offer.shop_slug)}">Back to shop</button>`}catch{if(token===loadToken)panel.innerHTML='<p>Could not load the media. Please try again.</p>'+`<button class="m7d-pill" data-offer="${esc(id)}">Retry</button>`}}
  function addShop(){const target='https://shoufhon.com/add-shop-';try{window.top.location.href=target}catch{window.location.href=target}}
  function shopUrl(slug){const s=state.shops.find(x=>x.shop_slug===slug);return url(s?.shop_url)||url('https://shoufhon.com/'+encodeURIComponent(slug))}
  function navigateShop(slug){const target=shopUrl(slug);if(!target)return;try{window.top.location.href=target}catch{window.location.href=target}}
  async function loadOwner(){if(!client)return;const user=(await client.auth.getUser()).data?.user;if(!user){ownerSlug='';return}const r=await client.from('shop_owners').select('shop_slug').eq('user_id',user.id).limit(1).maybeSingle();if(r.error)throw r.error;ownerSlug=String(r.data?.shop_slug||'');if(ownerSlug)followed.delete(ownerSlug)}
  async function loadFollowed(){if(!client)return;const r=await client.rpc('get_visitor_followed_shops',{p_visitor_id:visitorId()});if(r.error)throw r.error;followed.clear();(Array.isArray(r.data)?r.data:[]).forEach(x=>{const slug=typeof x==='string'?x:x?.shop_slug;if(slug&&norm(slug)!==norm(ownerSlug))followed.add(String(slug))});renderCards()}
  function showFollowToast(slug,following,message=''){const s=state.shops.find(x=>x.shop_slug===slug),toast=root.querySelector('[data-follow-toast]');if(!toast)return;clearTimeout(toastTimer);const avatar=url(s?.profile_image_url);toast.innerHTML=`${avatar?`<img src="${esc(avatar)}" alt="">`:'<span class="m7d-toast-fallback">♡</span>'}<div><strong>${esc(s?.shop_name||'Shop')}</strong><small>${esc(message||(following?'Added to your Following list':'Removed from your Following list'))}</small></div>`;toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
  function announceFollow(slug,following){const detail={shopSlug:slug,following};window.dispatchEvent(new CustomEvent('ma7alak:follow-change',{detail}));window.dispatchEvent(new CustomEvent('ma7alak:follow-changed',{detail}));window.postMessage({type:'MA7ALAK_FOLLOW_CHANGED',...detail},'*');window.postMessage({type:'MA7ALAK_FOLLOW_STATE_CHANGED',...detail},'*')}
  async function toggleFollow(slug){if(!client||followBusy.has(slug))return;if(ownerSlug&&norm(slug)===norm(ownerSlug)){showFollowToast(slug,false,'This is your shop · owners cannot follow themselves');return}const was=followed.has(slug),next=!was;followBusy.add(slug);next?followed.add(slug):followed.delete(slug);renderCards();try{const r=await client.rpc(next?'follow_shop':'unfollow_shop',{p_shop_slug:slug,p_visitor_id:visitorId()});if(r.error)throw r.error;announceFollow(slug,next);showFollowToast(slug,next)}catch(e){was?followed.add(slug):followed.delete(slug);showFollowToast(slug,was,'Follow could not be updated · please try again');console.warn('Directory follow:',e)}finally{followBusy.delete(slug);renderCards()}}
  function handle(e){const storyCircle=e.target.closest('[data-story-circle]');if(storyCircle){e.preventDefault();e.stopPropagation();return openDirectoryStory(storyCircle.dataset.storyCircle,0)}const b=e.target.closest('button');if(b?.dataset.follow||b?.dataset.save){e.preventDefault();e.stopPropagation();return toggleFollow(b.dataset.follow||b.dataset.save)}if(b?.dataset.openShop||b?.dataset.shop){e.preventDefault();return navigateShop(b.dataset.openShop||b.dataset.shop)}if(!b){const card=e.target.closest('[data-shop-card]');if(card)return navigateShop(card.dataset.shopCard);return}if(b.dataset.story)return showStories(b.dataset.story,Number(b.dataset.index||0));if(b.dataset.tab)return showShop(shopOpen,b.dataset.tab);if(b.dataset.photo){setPanel('Photo',img(b.dataset.photo,'m7d-media-full')+`<p><button class="m7d-pill" data-open-shop="${esc(shopOpen)}">Visit shop</button></p>`);return}if(b.dataset.offer){showOffer(b.dataset.offer);return}if('area'in b.dataset){area=b.dataset.area;coords=null;limit=24;render();if(dialog.open)showFilters();return}if('category'in b.dataset){category=category===b.dataset.category?'':b.dataset.category;limit=24;render();if(dialog.open)showFilters();return}switch(b.dataset.action){case'close':close();break;case'filters':case'areas':showFilters();break;case'results':shopOpen='';setPanel('Explore shops','<div class="m7d-grid">'+(filtered().map(card).join('')||emptyState())+'</div>');break;case'categories':shopOpen='';setPanel('Browse categories','<div class="m7d-categories">'+categoryButtons()+'</div>');break;case'return-categories':if(dialog.open)close();root.querySelector('[data-category-anchor]')?.scrollIntoView({behavior:'smooth',block:'start'});break;case'apply':sort=panel.querySelector('[data-sort]')?.value||sort;liveOnly=!!panel.querySelector('[data-live]')?.checked;followedOnly=!!panel.querySelector('[data-followed-only]')?.checked;renderCards();close();break;case'near':near();break;case'reset':q='';area='';category='';coords=null;liveOnly=false;followedOnly=false;root.querySelector('input').value='';feedback('');render();if(dialog.open)close();break;case'saved':followedOnly=!followedOnly;renderCards();break;case'more':limit+=24;renderCards();break;case'add':addShop();break;case'retry':refresh();break}}
  async function all(table,configure=x=>x){let rows=[];for(let n=0;;n+=500){const r=await configure(client.from(table).select('*')).range(n,n+499);if(r.error)throw r.error;rows.push(...r.data);if(r.data.length<500)return rows}}
  async function refresh(){if(loading){queued=true;return}loading=true;try{const results=await Promise.all([all('shop_profiles',x=>x.eq('is_active',true).order('shop_slug')),all('shop_categories',x=>x.eq('is_active',true).order('sort_order')),all('shop_cities',x=>x.eq('is_active',true).order('sort_order')),all('shop_areas',x=>x.eq('is_active',true).order('sort_order')),all('directory_settings'),all('shop_stories',x=>x.gt('expires_at',new Date().toISOString()).order('created_at')),all('shop_live_posts',x=>x.eq('status','active').gt('ends_at',new Date().toISOString()).order('created_at')),client.rpc('get_directory_popularity')]);if(results[7].error)throw results[7].error;const next={shops:results[0],categories:results[1],cities:results[2],areas:results[3],settings:{...defaults,...(results[4][0]?.settings||{})},stories:results[5],live:results[6],popularity:Array.isArray(results[7].data)?results[7].data:[]};if(JSON.stringify(next)!==JSON.stringify(state)){const priorShop=JSON.stringify(state.shops.find(s=>s.shop_slug===shopOpen)),priorLive=JSON.stringify(state.live.filter(p=>p.shop_slug===shopOpen));state=next;feedback('');render();if(shopOpen&&dialog.open){if(!state.shops.some(s=>s.shop_slug===shopOpen)){setPanel('Shop unavailable','This shop is no longer listed.');shopOpen=''}else if(panel.querySelector('.m7d-tab-body')&&(priorShop!==JSON.stringify(state.shops.find(s=>s.shop_slug===shopOpen))||(tab==='offers'&&priorLive!==JSON.stringify(state.live.filter(p=>p.shop_slug===shopOpen)))))showShop(shopOpen,tab)}}}catch(e){feedback('Updates couldn’t load. We’ll retry shortly.');if(!state.shops.length)root.querySelector('[data-grid]').innerHTML='<div class="m7d-empty">Could not load shops. <button class="m7d-pill" data-action="retry">Try again</button></div>';console.warn('Directory refresh:',e)}finally{loading=false;if(queued){queued=false;refresh()}}}
  async function boot(){document.getElementById('ma7alak-shops-page')?.remove();document.getElementById('m7-directory-v3-style')?.remove();document.querySelectorAll('dialog.m7d-dialog').forEach(el=>el.remove());document.querySelectorAll('.m7d-story-viewer').forEach(el=>el.remove());document.documentElement.classList.add('ma7alak-shops-page-active');document.body.classList.add('ma7alak-shops-body');oldOverflow=document.documentElement.style.overflow;const style=document.createElement('style');style.id='m7-directory-v3-style';style.textContent=css;document.head.appendChild(style);root=document.createElement('main');root.id='ma7alak-shops-page';root.className='m7d';root.innerHTML=`<div class="m7d-hero"></div><div class="m7d-search">${icon('search')}<input type="search" aria-label="Search shops"><button data-action="filters" aria-label="Open filters">${icon('filter')}</button></div><div class="m7d-row"><div class="m7d-location">${icon('plane')}<span data-location-title></span></div><button class="m7d-link" data-action="areas">${icon('near')}Near you ⌄</button></div><div class="m7d-areas" data-areas></div><section data-category-section data-category-anchor><div class="m7d-row"><h2 data-category-title></h2><button class="m7d-link" data-action="categories">See all ›</button></div><div class="m7d-categories" data-categories></div></section><section class="m7d-section" data-featured-section hidden><div class="m7d-row"><h2>Featured shops</h2><span class="m7d-link" data-featured-count></span></div><div class="m7d-strip" data-featured-grid></div></section><div class="m7d-row"><h2 data-results-title></h2><button class="m7d-link" data-action="results" data-count></button></div><p class="m7d-feedback" role="status" data-feedback></p><div class="m7d-grid" data-grid></div><button class="m7d-pill m7d-more" data-action="more" hidden>Show more shops</button><div class="m7d-cta" data-cta>${icon('shop')}<div><strong data-cta-title></strong><small data-cta-text></small></div><button class="m7d-gold" data-action="add"></button></div><button class="m7d-link" data-action="saved" data-saved></button><button class="m7d-return" data-action="return-categories">${icon('arrow')} Back to categories</button><div class="m7d-toast" role="status" aria-live="polite" data-follow-toast></div>`;document.body.prepend(root);dialog=document.createElement('dialog');dialog.className='m7d-dialog';dialog.innerHTML='<div class="m7d-dialog-header"><h2 id="m7d-panel-title"></h2><button class="m7d-close" data-action="close" aria-label="Close panel">×</button></div><div class="m7d-panel"></div>';dialog.setAttribute('aria-labelledby','m7d-panel-title');document.body.append(dialog);panel=dialog.querySelector('.m7d-panel');
    storyViewer=document.createElement('div');
    storyViewer.className='m7d-story-viewer';
    storyViewer.setAttribute('aria-hidden','true');
    storyViewer.innerHTML='<div class="m7d-story-stage"><div class="m7d-story-loading">Loading story…</div><div class="m7d-story-progress"></div><div class="m7d-story-head"></div><button class="m7d-story-close" type="button" aria-label="Close story">×</button><div class="m7d-story-media-host"></div><button class="m7d-story-hit prev" type="button" aria-label="Previous story"></button><button class="m7d-story-hit next" type="button" aria-label="Next story"></button></div>';
    document.body.append(storyViewer);
    storyViewerMedia=storyViewer.querySelector('.m7d-story-media-host');
    storyViewerProgress=storyViewer.querySelector('.m7d-story-progress');
    storyViewerShop=storyViewer.querySelector('.m7d-story-head');
    storyViewerClose=storyViewer.querySelector('.m7d-story-close');
    storyViewerClose.onclick=e=>{e.preventDefault();e.stopPropagation();closeDirectoryStory()};
    storyViewer.querySelector('.m7d-story-hit.prev').onclick=e=>{e.preventDefault();e.stopPropagation();previousDirectoryStory()};
    storyViewer.querySelector('.m7d-story-hit.next').onclick=e=>{e.preventDefault();e.stopPropagation();nextDirectoryStory()};
    storyViewer.addEventListener('touchstart',e=>{if(!storyViewerOpen||!e.touches?.[0])return;storyTouchStartX=e.touches[0].clientX;storyTouchStartY=e.touches[0].clientY;storyTouchX=storyTouchStartX;storyTouchY=storyTouchStartY},{passive:true});
    storyViewer.addEventListener('touchmove',e=>{if(!storyViewerOpen||!e.touches?.[0])return;storyTouchX=e.touches[0].clientX;storyTouchY=e.touches[0].clientY;const dx=storyTouchX-storyTouchStartX,dy=storyTouchY-storyTouchStartY;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.08&&e.cancelable)e.preventDefault()},{passive:false});
    storyViewer.addEventListener('touchend',()=>{if(!storyViewerOpen)return;const dx=storyTouchX-storyTouchStartX,dy=storyTouchY-storyTouchStartY;if(Math.abs(dx)<48||Math.abs(dx)<=Math.abs(dy)*1.05)return;dx<0?nextDirectoryStory():previousDirectoryStory()},{passive:true});
    window.addEventListener('popstate',()=>{if(storyViewerOpen)closeDirectoryStory(true)});
    const onStoryFullscreenChange=()=>{
      const fs=document.fullscreenElement||document.webkitFullscreenElement;
      if(storyViewerOpen&&!fs){
        /* Keep the same-page viewer open as fallback; browser Back/history still closes it. */
        storyViewer?.classList.add('open');
      }
    };
    document.addEventListener('fullscreenchange',onStoryFullscreenChange);
    document.addEventListener('webkitfullscreenchange',onStoryFullscreenChange);root.addEventListener('error',e=>{if(e.target.tagName==='IMG')e.target.style.visibility='hidden'},true);root.onclick=handle;root.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-story-circle]')){e.preventDefault();openDirectoryStory(e.target.dataset.storyCircle,0);return}if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-shop-card]')){e.preventDefault();navigateShop(e.target.dataset.shopCard)}};dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}else handle(e)};dialog.addEventListener('change',e=>{if(e.target.matches('[data-sort]'))sort=e.target.value;if(e.target.matches('[data-live]'))liveOnly=e.target.checked;if(e.target.matches('[data-followed-only]'))followedOnly=e.target.checked});dialog.addEventListener('cancel',e=>{e.preventDefault();close()});dialog.addEventListener('play',e=>{dialog.querySelectorAll('video').forEach(v=>{if(v!==e.target)v.pause()})},true);root.querySelector('input').oninput=e=>{q=e.target.value;limit=24;renderCards()};const anchor=root.querySelector('[data-category-anchor]'),returnButton=root.querySelector('[data-action=return-categories]');if('IntersectionObserver'in window){returnObserver=new IntersectionObserver(entries=>returnButton.classList.toggle('visible',!entries[0].isIntersecting&&window.scrollY>320),{threshold:.05});returnObserver.observe(anchor)}render();root.querySelector('[data-grid]').innerHTML='<div class="m7d-empty">Loading local shops…</div>';
    try{if(!window.supabase?.createClient){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=reject;document.head.append(s)})}try{await window.Ma7alakSupabaseBootstrap?.ready?.()}catch(_){}client=window.Ma7alakSupabase?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||window.Ma7alakSupabaseBootstrap?.client||window.supabase.createClient('https://wdtaiuwtqdepzdamgsrs.supabase.co','sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});await loadOwner().catch(e=>console.warn('Directory owner:',e));await Promise.all([refresh(),loadFollowed().catch(e=>console.warn('Directory follows:',e))]);let channel=client.channel('directory-v4');['shop_profiles','shop_categories','shop_cities','shop_areas','directory_settings','shop_stories','shop_live_posts','shop_media','shop_reels'].forEach(table=>{channel=channel.on('postgres_changes',{event:'*',schema:'public',table},()=>{clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{refresh();if(shopOpen&&['gallery','reels'].includes(tab))showShop(shopOpen,tab)},40)})});channel.subscribe();startDirectoryDesignPreview();client.auth.onAuthStateChange(()=>setTimeout(async()=>{await loadOwner().catch(()=>{});await loadFollowed().catch(()=>{});renderCards()},0));setInterval(()=>{if(!document.hidden){refresh();loadFollowed().catch(()=>{})}},120000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){refresh();loadOwner().then(loadFollowed).catch(()=>{});if(storyViewerOpen){const v=storyViewer?.querySelector('video.active');if(v)v.play().catch(()=>{})}}else{dialog.querySelectorAll('video').forEach(v=>v.pause());storyViewer?.querySelectorAll('video').forEach(v=>v.pause())}});window.addEventListener('message',e=>{if(['MA7ALAK_FOLLOW_CHANGED','MA7ALAK_FOLLOW_STATE_CHANGED'].includes(e.data?.type))loadFollowed().catch(()=>{})});window.addEventListener('ma7alak:follow-change',()=>loadFollowed().catch(()=>{}));window.addEventListener('ma7alak:follow-changed',()=>loadFollowed().catch(()=>{}));window.Ma7alakDirectory={refresh,openShop:navigateShop,openDetails:showShop,openStories:showStories,version:6}}catch(e){feedback('Connection unavailable. Reload the page to retry.');console.warn(e)}
  }
  function directoryBootFailed(error){
    console.error('ShoufHon directory boot failed:',error);
    window.__M7_DIRECTORY_V3__=false;
    window.__M7_DIRECTORY_V3_BOOTING__=false;
    try{returnObserver?.disconnect()}catch(_){}
    document.getElementById('ma7alak-shops-page')?.remove();
    document.querySelectorAll('dialog.m7d-dialog').forEach(el=>el.remove());
    document.querySelectorAll('.m7d-story-viewer').forEach(el=>el.remove());
    restoreStoryScroll();
    document.getElementById('m7-directory-v3-style')?.remove();
    document.documentElement.classList.remove('ma7alak-shops-page-active');
    document.body?.classList.remove('ma7alak-shops-body');
    if(document.documentElement)document.documentElement.style.overflow=oldOverflow||'';
  }

  function startDirectory(){
    Promise.resolve()
      .then(boot)
      .then(()=>{
        window.__M7_DIRECTORY_V3__=true;
        window.__M7_DIRECTORY_V3_BOOTING__=false;
      })
      .catch(directoryBootFailed);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startDirectory,{once:true});else startDirectory();
})();

/* Re-evaluate timed Featured badges even when no database row changes. */
(function(){
  if(location.pathname.replace(/\/+$/,'').toLowerCase()!=='/shwf-almhlat-')return;
  setInterval(()=>{
    if(document.hidden)return;
    const search=document.querySelector('#ma7alak-shops-page input[type="search"]');
    if(search)search.dispatchEvent(new Event('input',{bubbles:true}));
  },30000);
})();

/* =========================================================
   SHOUFHON DIRECTORY — PER-SHOP CARD DESIGN RUNTIME V1
========================================================= */
(function(){
  "use strict";
  if(document.getElementById("m7-card-design-runtime-v1"))return;

  const style=document.createElement("style");
  style.id="m7-card-design-runtime-v1";
  style.textContent=`
    .m7d-card{
      border-width:var(--m7-card-border-width,1px)!important;
      border-radius:var(--m7-card-radius,16px)!important;
      border-color:color-mix(in srgb,var(--card-accent) 52%,transparent)!important;
      background:
        linear-gradient(
          145deg,
          color-mix(in srgb,var(--m7-card-surface,#171611) 88%,white 12%),
          var(--m7-card-surface,#171611)
        )!important;
      box-shadow:
        0 10px 26px rgba(0,0,0,var(--m7-card-shadow-alpha,.48)),
        0 0 16px rgba(var(--m7-card-accent-rgb,193,166,106),var(--m7-card-glow-alpha,.16))!important;
    }

    .m7d-card .m7d-cover{
      height:100%!important;
    }

    .m7d-card h3{
      color:var(--m7-card-name,#fff)!important;
    }

    .m7d-card .m7d-card-label,
    .m7d-card .m7d-address{
      color:var(--m7-card-meta,#c8c0b2)!important;
    }

    .m7d-card .m7d-view{
      color:var(--m7-card-button,#ead49e)!important;
      background:var(--m7-card-button-bg,#0b0b08)!important;
      border-color:var(--card-accent)!important;
    }

    .m7d-card.m7d-edge-none{
      border-color:transparent!important;
      border-width:0!important;
    }

    .m7d-card.m7d-edge-soft{
      border-color:color-mix(in srgb,var(--card-accent) 26%,transparent)!important;
      box-shadow:
        0 10px 26px rgba(0,0,0,var(--m7-card-shadow-alpha,.48)),
        inset 0 0 0 1px rgba(255,255,255,.035),
        0 0 22px rgba(var(--m7-card-accent-rgb,193,166,106),var(--m7-card-glow-alpha,.16))!important;
    }

    .m7d-card.m7d-edge-double{
      border-color:color-mix(in srgb,var(--card-accent) 72%,transparent)!important;
      box-shadow:
        0 10px 26px rgba(0,0,0,var(--m7-card-shadow-alpha,.48)),
        inset 0 0 0 max(1px,var(--m7-card-border-width,1px))
          color-mix(in srgb,var(--card-accent) 28%,transparent),
        0 0 16px rgba(var(--m7-card-accent-rgb,193,166,106),var(--m7-card-glow-alpha,.16))!important;
    }

    .m7d-card.m7d-edge-corners{
      border-color:transparent!important;
    }

    .m7d-card.m7d-edge-corners::before{
      content:"";
      position:absolute;
      inset:0;
      z-index:7;
      border-radius:inherit;
      pointer-events:none;
      background:
        linear-gradient(90deg,var(--card-accent),var(--card-accent)) left top/34% var(--m7-card-border-width,2px) no-repeat,
        linear-gradient(180deg,var(--card-accent),var(--card-accent)) left top/var(--m7-card-border-width,2px) 30px no-repeat,
        linear-gradient(270deg,var(--card-accent),var(--card-accent)) right top/34% var(--m7-card-border-width,2px) no-repeat,
        linear-gradient(180deg,var(--card-accent),var(--card-accent)) right top/var(--m7-card-border-width,2px) 30px no-repeat,
        linear-gradient(90deg,var(--card-accent),var(--card-accent)) left bottom/34% var(--m7-card-border-width,2px) no-repeat,
        linear-gradient(0deg,var(--card-accent),var(--card-accent)) left bottom/var(--m7-card-border-width,2px) 30px no-repeat,
        linear-gradient(270deg,var(--card-accent),var(--card-accent)) right bottom/34% var(--m7-card-border-width,2px) no-repeat,
        linear-gradient(0deg,var(--card-accent),var(--card-accent)) right bottom/var(--m7-card-border-width,2px) 30px no-repeat;
      filter:
        drop-shadow(
          0 0 5px
          rgba(var(--m7-card-accent-rgb,193,166,106),var(--m7-card-glow-alpha,.20))
        );
    }

    .m7d-card.m7d-anim-none{
      animation:none!important;
      -webkit-animation:none!important;
    }

    .m7d-card.m7d-anim-glow{
      animation:m7d-card-accent var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7d-card-accent var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    @keyframes m7CardAdminBreathe{
      0%,100%{transform:translateZ(0) scale(1)}
      50%{transform:translateZ(0) scale(1.018)}
    }

    @-webkit-keyframes m7CardAdminBreathe{
      0%,100%{-webkit-transform:translateZ(0) scale(1)}
      50%{-webkit-transform:translateZ(0) scale(1.018)}
    }

    .m7d-card.m7d-anim-breathe{
      animation:m7CardAdminBreathe var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7CardAdminBreathe var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    @keyframes m7CardAdminEdge{
      0%,100%{opacity:.58;filter:drop-shadow(0 0 3px rgba(var(--m7-card-accent-rgb,193,166,106),.20))}
      50%{opacity:1;filter:drop-shadow(0 0 10px rgba(var(--m7-card-accent-rgb,193,166,106),.72))}
    }

    /* Edge Pulse also works on normal/double/soft cards, not only Corner Lines. */
    .m7d-card.m7d-anim-edge:not(.m7d-edge-corners)::before{
      content:"";
      position:absolute;
      inset:0;
      z-index:7;
      pointer-events:none;
      border-radius:inherit;
      border:max(1px,var(--m7-card-border-width,1px)) solid var(--card-accent);
      opacity:.62;
    }

    .m7d-card.m7d-anim-edge::before{
      animation:m7CardAdminEdge var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7CardAdminEdge var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    .m7d-card.m7d-anim-shimmer::after{
      content:"";
      position:absolute;
      inset:0;
      z-index:6;
      pointer-events:none;
      border-radius:inherit;
      background:
        linear-gradient(
          112deg,
          transparent 0 38%,
          rgba(255,255,255,var(--m7-card-shimmer-white,.37)) 47%,
          rgba(var(--m7-card-accent-rgb,193,166,106),var(--m7-card-shimmer-accent,.46)) 52%,
          rgba(255,255,255,var(--m7-card-shimmer-soft,.27)) 57%,
          transparent 68% 100%
        );
      background-size:300% 100%;
      background-position:150% 0;
      animation:m7CardAdminShimmer var(--m7-card-speed,2.8s) linear infinite;
      -webkit-animation:m7CardAdminShimmer var(--m7-card-speed,2.8s) linear infinite;
      animation-play-state:running;
      -webkit-animation-play-state:running;
      will-change:background-position,opacity;
      -webkit-backface-visibility:hidden;
      backface-visibility:hidden;
    }

    @keyframes m7CardAdminShimmer{
      from{background-position:150% 0;opacity:.15}
      45%,55%{opacity:1}
      to{background-position:-150% 0;opacity:.15}
    }

    @-webkit-keyframes m7CardAdminShimmer{
      from{background-position:150% 0;opacity:.15}
      45%,55%{opacity:1}
      to{background-position:-150% 0;opacity:.15}
    }

    @keyframes m7CardAdminFloat{
      50%{transform:translateY(var(--m7-card-move-neg,-6px))}
    }

    @-webkit-keyframes m7CardAdminFloat{
      50%{-webkit-transform:translateY(var(--m7-card-move-neg,-6px))}
    }

    @keyframes m7CardAdminPulse{
      50%{transform:scale(var(--m7-card-scale,1.018));opacity:.78}
    }

    @-webkit-keyframes m7CardAdminPulse{
      50%{-webkit-transform:scale(var(--m7-card-scale,1.018));opacity:.78}
    }

    @keyframes m7CardAdminSway{
      25%{transform:rotate(var(--m7-card-rotate-neg,-1.4deg))}
      75%{transform:rotate(var(--m7-card-rotate,1.4deg))}
    }

    @-webkit-keyframes m7CardAdminSway{
      25%{-webkit-transform:rotate(var(--m7-card-rotate-neg,-1.4deg))}
      75%{-webkit-transform:rotate(var(--m7-card-rotate,1.4deg))}
    }

    @keyframes m7CardAdminBounce{
      0%,100%{transform:translateY(0)}
      45%{transform:translateY(var(--m7-card-move-neg,-6px))}
      62%{transform:translateY(var(--m7-card-move-quarter,1.5px))}
    }

    @-webkit-keyframes m7CardAdminBounce{
      0%,100%{-webkit-transform:translateY(0)}
      45%{-webkit-transform:translateY(var(--m7-card-move-neg,-6px))}
      62%{-webkit-transform:translateY(var(--m7-card-move-quarter,1.5px))}
    }

    .m7d-card.m7d-anim-glow,
    .m7d-card.m7d-anim-breathe,
    .m7d-card.m7d-anim-float,
    .m7d-card.m7d-anim-pulse,
    .m7d-card.m7d-anim-sway,
    .m7d-card.m7d-anim-bounce{
      animation-play-state:running!important;
      -webkit-animation-play-state:running!important;
      will-change:transform,box-shadow,opacity;
      -webkit-backface-visibility:hidden;
      backface-visibility:hidden;
    }

    .m7d-card.m7d-anim-float{
      animation:m7CardAdminFloat var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7CardAdminFloat var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    .m7d-card.m7d-anim-pulse{
      animation:m7CardAdminPulse var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7CardAdminPulse var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    .m7d-card.m7d-anim-sway{
      animation:m7CardAdminSway var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7CardAdminSway var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    .m7d-card.m7d-anim-bounce{
      animation:m7CardAdminBounce var(--m7-card-speed,2.4s) ease-in-out infinite!important;
      -webkit-animation:m7CardAdminBounce var(--m7-card-speed,2.4s) ease-in-out infinite!important;
    }

    @media(prefers-reduced-motion:reduce){
      .m7d-card.m7d-anim-glow,
      .m7d-card.m7d-anim-breathe,
      .m7d-card.m7d-anim-float,
      .m7d-card.m7d-anim-pulse,
      .m7d-card.m7d-anim-sway,
      .m7d-card.m7d-anim-bounce,
      .m7d-card.m7d-anim-edge::before,
      .m7d-card.m7d-anim-shimmer::after{
        animation:none!important;
        -webkit-animation:none!important;
      }
    }
  `;

  document.head.appendChild(style);
})();
