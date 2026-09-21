(function(){
  "use strict";

  if(window.self!==window.top)return;
  if(window.__MA7ALAK_PWA_CLIENT__)return;
  window.__MA7ALAK_PWA_CLIENT__=true;

  const VERSION="2026.09.22.1";
  const CONTENT_PROTECTION_URL=
    "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@38a17c4f43780d05715f445b629ac4492cc3be57/shoufhon-content-protection.js";
  const DISMISS_KEY="shoufhon_pwa_install_dismissed_session";

  let deferredPrompt=null;
  let registration=null;
  let fallbackTimer=0;
  let lastChecks=null;

  function isStandalone(){
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone===true
    );
  }

  function isIOS(){
    const ua=String(navigator.userAgent||"");
    return (
      /iPad|iPhone|iPod/i.test(ua) ||
      (
        navigator.platform==="MacIntel" &&
        Number(navigator.maxTouchPoints||0)>1
      )
    );
  }

  function dismissed(){
    try{
      return sessionStorage.getItem(DISMISS_KEY)==="1";
    }catch(_){
      return false;
    }
  }

  function markDismissed(){
    try{
      sessionStorage.setItem(DISMISS_KEY,"1");
    }catch(_){}
  }

  function ensureStandaloneContentProtection(){
    if(!isStandalone())return;
    if(window.__SHOUFHON_CONTENT_PROTECTION__)return;

    const existing=
      document.querySelector(
        'script[data-shoufhon-pwa-content-protection="1"]'
      );

    if(existing)return;

    const script=document.createElement("script");
    script.src=CONTENT_PROTECTION_URL;
    script.async=false;
    script.dataset.shoufhonPwaContentProtection="1";

    script.addEventListener(
      "load",
      ()=>{
        try{
          window.ShoufHonContentProtection?.refresh?.();
        }catch(_){}
      },
      {once:true}
    );

    script.addEventListener(
      "error",
      ()=>{
        console.warn(
          "[ShoufHon PWA] Content protection failed to load."
        );
      },
      {once:true}
    );

    (
      document.head ||
      document.documentElement
    ).appendChild(script);
  }

  function injectHead(){
    let manifest=document.querySelector('link[rel="manifest"]');

    if(!manifest){
      manifest=document.createElement("link");
      manifest.rel="manifest";
      document.head.appendChild(manifest);
    }

    manifest.href=
      "/manifest.webmanifest?v="+
      encodeURIComponent(VERSION);

    function meta(name,content){
      let el=document.querySelector(
        'meta[name="'+name+'"]'
      );

      if(!el){
        el=document.createElement("meta");
        el.name=name;
        document.head.appendChild(el);
      }

      el.content=content;
    }

    meta("theme-color","#d9a441");
    meta("mobile-web-app-capable","yes");
    meta("apple-mobile-web-app-capable","yes");
    meta(
      "apple-mobile-web-app-status-bar-style",
      "black-translucent"
    );
    meta(
      "apple-mobile-web-app-title",
      "ShoufHon"
    );

    let appleIcon=
      document.querySelector(
        'link[rel="apple-touch-icon"]'
      );

    if(!appleIcon){
      appleIcon=document.createElement("link");
      appleIcon.rel="apple-touch-icon";
      document.head.appendChild(appleIcon);
    }

    appleIcon.href=
      "/pwa-icon-192.png?v="+
      encodeURIComponent(VERSION);
  }

  function installCss(){
    if(
      document.getElementById(
        "m7-pwa-install-style"
      )
    ){
      return;
    }

    const style=document.createElement("style");
    style.id="m7-pwa-install-style";
    style.textContent=`
      #m7-pwa-install-card{
        position:fixed;
        left:50%;
        bottom:max(16px,env(safe-area-inset-bottom));
        z-index:2147483000;
        width:min(390px,calc(100vw - 22px));
        transform:translateX(-50%) translateY(18px);
        display:grid;
        grid-template-columns:44px minmax(0,1fr) auto;
        gap:10px;
        align-items:center;
        box-sizing:border-box;
        padding:10px;
        border:1px solid rgba(217,164,65,.54);
        border-radius:18px;
        background:rgba(12,10,9,.96);
        box-shadow:
          0 18px 42px rgba(0,0,0,.50),
          0 0 18px rgba(217,164,65,.08);
        color:#fff;
        font-family:Arial,"Segoe UI",sans-serif;
        opacity:0;
        pointer-events:none;
        transition:opacity .18s ease,transform .18s ease;
        -webkit-backdrop-filter:blur(12px);
        backdrop-filter:blur(12px)
      }

      #m7-pwa-install-card.show{
        opacity:1;
        pointer-events:auto;
        transform:translateX(-50%) translateY(0)
      }

      #m7-pwa-install-card .m7p-icon{
        width:42px;
        height:42px;
        border-radius:12px;
        overflow:hidden;
        display:grid;
        place-items:center;
        border:1px solid rgba(217,164,65,.45);
        background:#090706
      }

      #m7-pwa-install-card .m7p-icon img{
        width:100%;
        height:100%;
        display:block;
        object-fit:cover
      }

      #m7-pwa-install-card .m7p-copy{
        min-width:0
      }

      #m7-pwa-install-card .m7p-copy b{
        display:block;
        margin:0 0 2px;
        font-size:13px;
        line-height:1.2;
        font-weight:950
      }

      #m7-pwa-install-card .m7p-copy span{
        display:block;
        color:rgba(255,255,255,.64);
        font-size:9px;
        line-height:1.35;
        font-weight:650
      }

      #m7-pwa-install-card .m7p-help{
        grid-column:1/-1;
        display:none;
        margin:0;
        padding:9px 10px;
        border-radius:11px;
        background:rgba(255,255,255,.045);
        color:#f2d69b;
        font-size:10px;
        line-height:1.45
      }

      #m7-pwa-install-card.help .m7p-help{
        display:block
      }

      #m7-pwa-install-card .m7p-actions{
        display:flex;
        align-items:center;
        gap:6px
      }

      #m7-pwa-install-card button{
        border:0;
        cursor:pointer;
        -webkit-tap-highlight-color:transparent;
        touch-action:manipulation
      }

      #m7-pwa-install-card .m7p-install{
        min-height:34px;
        padding:0 11px;
        border-radius:10px;
        background:linear-gradient(135deg,#f1ce7e,#d9a441);
        color:#1b1208;
        font-size:10px;
        font-weight:950
      }

      #m7-pwa-install-card .m7p-close{
        width:30px;
        height:30px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:rgba(255,255,255,.055);
        color:rgba(255,255,255,.68);
        font-size:16px
      }

      @media(max-width:390px){
        #m7-pwa-install-card{
          grid-template-columns:40px minmax(0,1fr) auto;
          gap:8px;
          padding:9px
        }

        #m7-pwa-install-card .m7p-icon{
          width:38px;
          height:38px
        }

        #m7-pwa-install-card .m7p-copy b{
          font-size:12px
        }

        #m7-pwa-install-card .m7p-install{
          padding:0 9px
        }
      }

      @media(prefers-reduced-motion:reduce){
        #m7-pwa-install-card{
          transition:none!important
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureCard(){
    installCss();

    let card=
      document.getElementById(
        "m7-pwa-install-card"
      );

    if(card){
      return card;
    }

    card=document.createElement("div");
    card.id="m7-pwa-install-card";
    card.setAttribute("role","dialog");
    card.setAttribute(
      "aria-label",
      "Install ShoufHon"
    );

    card.innerHTML=`
      <span class="m7p-icon" aria-hidden="true">
        <img src="/pwa-icon-192.png?v=${VERSION}" alt="">
      </span>

      <span class="m7p-copy">
        <b>Install ShoufHon</b>
        <span data-m7p-subtitle>Faster access · opens like an app</span>
      </span>

      <span class="m7p-actions">
        <button class="m7p-install" type="button">Install</button>
        <button class="m7p-close" type="button" aria-label="Not now">×</button>
      </span>

      <p class="m7p-help" data-m7p-help></p>
    `;

    document.body.appendChild(card);

    card
      .querySelector(".m7p-close")
      .addEventListener(
        "click",
        ()=>{
          markDismissed();
          hideCard();
        }
      );

    card
      .querySelector(".m7p-install")
      .addEventListener(
        "click",
        handleInstallClick
      );

    return card;
  }

  function hideCard(){
    document
      .getElementById(
        "m7-pwa-install-card"
      )
      ?.classList
      .remove("show","help");
  }

  function setHelp(text){
    const card=ensureCard();
    const help=
      card.querySelector(
        "[data-m7p-help]"
      );

    if(help){
      help.textContent=text;
    }

    card.classList.add("help");
  }

  function showCard(mode){
    if(
      isStandalone() ||
      dismissed()
    ){
      return;
    }

    const card=ensureCard();
    const subtitle=
      card.querySelector(
        "[data-m7p-subtitle]"
      );
    const button=
      card.querySelector(
        ".m7p-install"
      );

    card.dataset.mode=mode||"manual";
    card.classList.remove("help");

    if(mode==="native"){
      if(subtitle){
        subtitle.textContent=
          "Faster access · opens like an app";
      }

      if(button){
        button.textContent="Install";
      }
    }
    else if(mode==="ios"){
      if(subtitle){
        subtitle.textContent=
          "Add ShoufHon to your Home Screen";
      }

      if(button){
        button.textContent="How";
      }
    }
    else{
      if(subtitle){
        subtitle.textContent=
          "Install from your browser menu";
      }

      if(button){
        button.textContent="How";
      }
    }

    requestAnimationFrame(
      ()=>card.classList.add("show")
    );
  }

  async function handleInstallClick(){
    const card=ensureCard();
    const mode=card.dataset.mode||"manual";

    if(
      mode==="native" &&
      deferredPrompt
    ){
      const prompt=deferredPrompt;

      hideCard();
      deferredPrompt=null;

      try{
        await prompt.prompt();
        const choice=
          await prompt.userChoice;

        window.dispatchEvent(
          new CustomEvent(
            "ma7alak:pwa-install-choice",
            {detail:choice}
          )
        );
      }
      catch(error){
        console.warn(
          "[ShoufHon PWA] Install prompt:",
          error
        );
      }

      return;
    }

    if(mode==="ios"){
      setHelp(
        "Tap Share in Safari, then choose Add to Home Screen."
      );
      return;
    }

    setHelp(
      "Open your browser menu (⋮) and choose Install app or Add to Home screen."
    );
  }

  async function verifyAsset(url,kind){
    try{
      const response=
        await fetch(
          url,
          {
            cache:"no-store",
            credentials:"same-origin"
          }
        );

      const type=
        String(
          response.headers.get(
            "content-type"
          )||""
        ).toLowerCase();

      let typeOk=true;

      if(kind==="manifest"){
        typeOk=
          type.includes("manifest") ||
          type.includes("json");
      }
      else if(kind==="script"){
        typeOk=
          type.includes("javascript") ||
          type.includes("text/plain");
      }
      else if(kind==="image"){
        typeOk=
          type.includes("image/png");
      }

      return {
        url,
        ok:response.ok&&typeOk,
        status:response.status,
        contentType:type
      };
    }
    catch(error){
      return {
        url,
        ok:false,
        status:0,
        contentType:"",
        error:String(
          error?.message||
          error||
          "Request failed"
        )
      };
    }
  }

  async function verifyAssets(){
    const checks=
      await Promise.all([
        verifyAsset(
          "/manifest.webmanifest?v="+
          encodeURIComponent(VERSION),
          "manifest"
        ),
        verifyAsset(
          "/sw.js?v="+
          encodeURIComponent(VERSION),
          "script"
        ),
        verifyAsset(
          "/pwa-icon-192.png?v="+
          encodeURIComponent(VERSION),
          "image"
        ),
        verifyAsset(
          "/pwa-icon-512.png?v="+
          encodeURIComponent(VERSION),
          "image"
        )
      ]);

    const ok=
      checks.every(item=>item.ok);

    lastChecks={
      ok,
      checks,
      checkedAt:Date.now()
    };

    window.Ma7alakPWA={
      ...(window.Ma7alakPWA||{}),
      assetChecks:lastChecks
    };

    if(!ok){
      console.warn(
        "[ShoufHon PWA] Install assets are not ready:",
        checks
      );
    }

    return lastChecks;
  }

  async function registerServiceWorker(){
    if(
      !("serviceWorker" in navigator)
    ){
      return null;
    }

    try{
      registration=
        await navigator.serviceWorker.register(
          "/sw.js?v="+
          encodeURIComponent(VERSION),
          {
            scope:"/",
            updateViaCache:"none"
          }
        );

      setTimeout(
        ()=>registration
          .update()
          .catch(()=>{}),
        1500
      );

      window.Ma7alakPWA={
        ...(window.Ma7alakPWA||{}),
        registration,
        version:VERSION,
        standalone:isStandalone()
      };

      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:pwa-ready",
          {
            detail:{
              registration,
              standalone:isStandalone(),
              version:VERSION
            }
          }
        )
      );

      return registration;
    }
    catch(error){
      console.warn(
        "[ShoufHon PWA] Service worker registration failed:",
        error
      );

      window.Ma7alakPWA={
        ...(window.Ma7alakPWA||{}),
        registrationError:String(
          error?.message||
          error
        )
      };

      return null;
    }
  }

  function scheduleFallback(){
    clearTimeout(fallbackTimer);

    if(
      isStandalone() ||
      deferredPrompt
    ){
      return;
    }

    if(isIOS()){
      fallbackTimer=setTimeout(
        ()=>showCard("ios"),
        900
      );
      return;
    }

    fallbackTimer=setTimeout(
      async()=>{
        if(
          isStandalone() ||
          deferredPrompt ||
          dismissed()
        ){
          return;
        }

        const checks=
          lastChecks||
          await verifyAssets();

        if(checks.ok){
          showCard("manual");
        }
      },
      2600
    );
  }

  window.addEventListener(
    "beforeinstallprompt",
    event=>{
      event.preventDefault();
      deferredPrompt=event;

      clearTimeout(fallbackTimer);

      window.Ma7alakPWA={
        ...(window.Ma7alakPWA||{}),
        installAvailable:true,
        showInstallPrompt:
          ()=>showCard("native")
      };

      setTimeout(
        ()=>showCard("native"),
        500
      );
    }
  );

  window.addEventListener(
    "appinstalled",
    ()=>{
      deferredPrompt=null;
      hideCard();

      try{
        sessionStorage.removeItem(
          DISMISS_KEY
        );
      }catch(_){}

      window.Ma7alakPWA={
        ...(window.Ma7alakPWA||{}),
        installAvailable:false,
        standalone:true
      };

      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:pwa-installed"
        )
      );
    }
  );

  ensureStandaloneContentProtection();
  injectHead();

  const start=async()=>{
    await registerServiceWorker();
    scheduleFallback();
  };

  if(document.readyState==="complete"){
    start();
  }
  else{
    window.addEventListener(
      "load",
      start,
      {once:true}
    );
  }

  window.Ma7alakPWA={
    ...(window.Ma7alakPWA||{}),
    version:VERSION,
    standalone:isStandalone(),
    showInstallPrompt:()=>{
      if(isStandalone())return;

      if(deferredPrompt){
        showCard("native");
      }
      else if(isIOS()){
        showCard("ios");
      }
      else{
        showCard("manual");
      }
    },
    checkInstallAssets:verifyAssets
  };
})();
