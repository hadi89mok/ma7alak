(function(){
  "use strict";

  if(window.self!==window.top)return;
  if(window.__MA7ALAK_PWA_CLIENT__)return;
  window.__MA7ALAK_PWA_CLIENT__=true;

  const VERSION="2026.09.24.8";
  const PWA_CLIENT_SCRIPT_SRC=
    String(document.currentScript?.src||"");
  const CONTENT_PROTECTION_URL=
    resolveSiblingScript(
      "shoufhon-content-protection.js"
    );
  const DISMISS_KEY="shoufhon_pwa_install_dismissed_session_v2";

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

  function resolveSiblingScript(file){
    if(PWA_CLIENT_SCRIPT_SRC){
      try{
        return new URL(
          file,
          PWA_CLIENT_SCRIPT_SRC
        ).href;
      }catch(_){}
    }

    return "";
  }

  function loadWebPushClient(){
    if(window.__SHOUFHON_WEB_PUSH__)return;

    if(
      document.querySelector(
        'script[data-shoufhon-web-push="1"]'
      )
    ){
      return;
    }

    const src=
      resolveSiblingScript(
        "shoufhon-web-push.js"
      );

    if(!src){
      console.warn(
        "[ShoufHon PWA] Could not resolve web push client."
      );
      return;
    }

    const script=
      document.createElement("script");

    script.src=src;
    script.async=true;
    script.dataset.shoufhonWebPush="1";

    script.addEventListener(
      "error",
      ()=>{
        console.warn(
          "[ShoufHon PWA] Web push client failed to load."
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

    meta("theme-color","#050403");
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

      #m7-pwa-install-card[data-mode="ios"] .m7p-help{
        margin-top:2px;
        padding:11px 12px;
        border:1px solid rgba(217,164,65,.16);
        background:
          linear-gradient(
            145deg,
            rgba(217,164,65,.075),
            rgba(255,255,255,.025)
          )
      }

      #m7-pwa-install-card .m7p-ios-title{
        display:block;
        margin-bottom:8px;
        color:#fff;
        font-size:10px;
        font-weight:900
      }

      #m7-pwa-install-card .m7p-ios-steps{
        display:grid;
        gap:7px
      }

      #m7-pwa-install-card .m7p-ios-step{
        display:grid;
        grid-template-columns:22px minmax(0,1fr);
        gap:8px;
        align-items:center;
        color:rgba(255,255,255,.80)
      }

      #m7-pwa-install-card .m7p-ios-step b{
        width:22px;
        height:22px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:rgba(217,164,65,.18);
        color:#f2d69b;
        font-size:10px;
        line-height:1
      }

      #m7-pwa-install-card .m7p-ios-step span{
        min-width:0
      }

      #m7-pwa-install-card .m7p-ios-note{
        display:block;
        margin-top:8px;
        color:rgba(255,255,255,.46);
        font-size:9px;
        line-height:1.4
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
    card.setAttribute(
      "aria-live",
      "polite"
    );

    card.innerHTML=`
      <span class="m7p-icon" aria-hidden="true">
        <img src="/pwa-icon-192.png?v=${VERSION}" alt="">
      </span>

      <span class="m7p-copy">
        <b>Install ShoufHon</b>
        <span data-m7p-subtitle>Faster access · direct app experience</span>
      </span>

      <span class="m7p-actions">
        <button class="m7p-install" type="button">Install app</button>
        <button class="m7p-close" type="button" aria-label="Not now">×</button>
      </span>

      <span class="m7p-benefits" aria-label="App benefits">
        <span class="m7p-benefit"><i aria-hidden="true">⚡</i><span>Faster access</span></span>
        <span class="m7p-benefit"><i aria-hidden="true">↗</i><span>Direct app</span></span>
        <span class="m7p-benefit"><i aria-hidden="true">●</i><span>Notifications</span></span>
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

  function setHelpHtml(html){
    const card=ensureCard();
    const help=
      card.querySelector(
        "[data-m7p-help]"
      );

    if(help){
      help.innerHTML=html;
    }

    card.classList.add("help");
  }

  function iosInstallHelp(){
    return `
      <strong class="m7p-ios-title">Install ShoufHon like an app</strong>
      <span class="m7p-ios-steps">
        <span class="m7p-ios-step">
          <b>1</b>
          <span>Tap the <strong>Share</strong> button on your iPhone.</span>
        </span>
        <span class="m7p-ios-step">
          <b>2</b>
          <span>Choose <strong>Add to Home Screen</strong>.</span>
        </span>
        <span class="m7p-ios-step">
          <b>3</b>
          <span>Keep <strong>Open as Web App</strong> on if shown, then tap <strong>Add</strong>.</span>
        </span>
      </span>
      <span class="m7p-ios-note">After that, ShoufHon opens from its own Home Screen icon without the normal browser tab.</span>
    `;
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
          "Faster access · direct app experience";
      }

      if(button){
        button.textContent="Install app";
      }
    }
    else if(mode==="ios"){
      if(subtitle){
        subtitle.textContent=
          "Add ShoufHon to your iPhone Home Screen";
      }

      if(button){
        button.textContent="Install";
      }

      setHelpHtml(
        iosInstallHelp()
      );
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
      setHelpHtml(
        iosInstallHelp()
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

      loadWebPushClient();

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

  /*
     Load the push client early too. It waits for serviceWorker.ready
     before subscribing, so this is safe even while registration is
     still finishing.
  */
  loadWebPushClient();

  /*
     iPhone/iPad do not provide beforeinstallprompt.
     Show ShoufHon's own install guide as soon as the DOM is ready instead
     of waiting for the full page load, videos, or service-worker setup.
     This makes the install prompt reliable even on media-heavy pages.
  */
  const startIOSInstallHint=()=>{
    if(
      !isIOS() ||
      isStandalone() ||
      dismissed()
    ){
      return;
    }

    clearTimeout(
      fallbackTimer
    );

    fallbackTimer=setTimeout(
      ()=>showCard("ios"),
      650
    );
  };

  if(document.readyState==="loading"){
    document.addEventListener(
      "DOMContentLoaded",
      startIOSInstallHint,
      {once:true}
    );
  }
  else{
    startIOSInstallHint();
  }

  const start=()=>{
    registerServiceWorker()
      .catch(()=>{});

    if(!isIOS()){
      scheduleFallback();
    }
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


/* =========================================================
   SHOUFHON PWA INSTALL CARD PREMIUM V2
   Bigger, clearer, animated mobile install prompt.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_PWA_INSTALL_CARD_PREMIUM_V2__)return;
  window.__SHOUFHON_PWA_INSTALL_CARD_PREMIUM_V2__=true;

  const style=document.createElement("style");
  style.id="shoufhon-pwa-install-card-premium-v2";
  style.textContent=`
    #m7-pwa-install-card{
      width:min(440px,calc(100vw - 20px))!important;
      grid-template-columns:58px minmax(0,1fr) auto!important;
      gap:11px 13px!important;
      padding:14px!important;
      border:1px solid rgba(224,177,82,.58)!important;
      border-radius:23px!important;
      background:
        radial-gradient(circle at 12% 0%,rgba(217,164,65,.13),transparent 34%),
        radial-gradient(circle at 90% 115%,rgba(112,38,24,.13),transparent 42%),
        linear-gradient(155deg,rgba(20,17,13,.985),rgba(7,8,9,.985))!important;
      box-shadow:
        0 22px 55px rgba(0,0,0,.58),
        0 0 0 1px rgba(255,255,255,.022) inset,
        0 0 28px rgba(217,164,65,.08)!important;
      overflow:hidden!important;
      isolation:isolate!important;
      transition:
        opacity .20s ease,
        transform .28s cubic-bezier(.2,.82,.22,1.12)!important;
    }

    #m7-pwa-install-card::before{
      content:""!important;
      position:absolute!important;
      inset:-1px!important;
      z-index:-1!important;
      pointer-events:none!important;
      border-radius:inherit!important;
      background:
        linear-gradient(
          110deg,
          transparent 0 38%,
          rgba(255,229,168,.09) 48%,
          rgba(239,191,96,.22) 50%,
          rgba(255,229,168,.07) 52%,
          transparent 62% 100%
        )!important;
      transform:translateX(-120%)!important;
      animation:m7pInstallSweep 4.8s ease-in-out infinite!important;
    }

    #m7-pwa-install-card::after{
      content:""!important;
      position:absolute!important;
      left:11%!important;
      right:11%!important;
      top:0!important;
      height:1px!important;
      pointer-events:none!important;
      background:linear-gradient(90deg,transparent,rgba(255,224,157,.72),transparent)!important;
      box-shadow:0 0 11px rgba(217,164,65,.20)!important;
    }

    #m7-pwa-install-card.show{
      transform:translateX(-50%) translateY(0) scale(1)!important;
    }

    #m7-pwa-install-card .m7p-icon{
      width:56px!important;
      height:56px!important;
      border-radius:16px!important;
      border:1px solid rgba(226,180,86,.56)!important;
      background:#090706!important;
      box-shadow:
        0 8px 20px rgba(0,0,0,.34),
        0 0 18px rgba(217,164,65,.10)!important;
    }

    #m7-pwa-install-card .m7p-copy b{
      margin:0 0 4px!important;
      font-size:17px!important;
      line-height:1.05!important;
      letter-spacing:-.22px!important;
      font-weight:950!important;
      color:#fffaf0!important;
    }

    #m7-pwa-install-card .m7p-copy span{
      color:rgba(255,255,255,.62)!important;
      font-size:10.5px!important;
      line-height:1.35!important;
      font-weight:700!important;
    }

    #m7-pwa-install-card .m7p-actions{
      gap:8px!important;
    }

    #m7-pwa-install-card .m7p-install{
      min-height:44px!important;
      padding:0 16px!important;
      border-radius:13px!important;
      background:
        linear-gradient(135deg,#f7d98c 0%,#e7b957 52%,#d79a33 100%)!important;
      color:#191008!important;
      font-size:12px!important;
      font-weight:950!important;
      letter-spacing:-.1px!important;
      box-shadow:
        0 8px 18px rgba(181,117,30,.22),
        inset 0 1px 0 rgba(255,255,255,.48)!important;
      transition:transform .14s ease,filter .14s ease,box-shadow .14s ease!important;
      white-space:nowrap!important;
    }

    #m7-pwa-install-card .m7p-install:active{
      transform:scale(.95)!important;
      filter:brightness(.96)!important;
      box-shadow:
        0 4px 10px rgba(181,117,30,.16),
        inset 0 1px 0 rgba(255,255,255,.34)!important;
    }

    #m7-pwa-install-card .m7p-close{
      width:36px!important;
      height:36px!important;
      border:1px solid rgba(255,255,255,.06)!important;
      background:rgba(255,255,255,.055)!important;
      color:rgba(255,255,255,.70)!important;
      font-size:20px!important;
    }

    #m7-pwa-install-card .m7p-benefits{
      grid-column:1/-1!important;
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:7px!important;
      margin-top:1px!important;
    }

    #m7-pwa-install-card .m7p-benefit{
      min-width:0!important;
      min-height:32px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      gap:5px!important;
      padding:5px 7px!important;
      border:1px solid rgba(217,164,65,.13)!important;
      border-radius:10px!important;
      background:rgba(255,255,255,.027)!important;
      color:rgba(255,243,216,.74)!important;
      font-size:8.5px!important;
      line-height:1!important;
      font-weight:820!important;
      white-space:nowrap!important;
    }

    #m7-pwa-install-card .m7p-benefit i{
      width:18px!important;
      height:18px!important;
      flex:0 0 18px!important;
      display:grid!important;
      place-items:center!important;
      border-radius:6px!important;
      background:rgba(217,164,65,.10)!important;
      color:#efc66e!important;
      font-style:normal!important;
      font-size:10px!important;
      line-height:1!important;
    }

    #m7-pwa-install-card .m7p-benefit:nth-child(3) i{
      color:#71df94!important;
      text-shadow:0 0 7px rgba(113,223,148,.25)!important;
    }

    #m7-pwa-install-card .m7p-help{
      grid-column:1/-1!important;
      margin-top:0!important;
      border:1px solid rgba(217,164,65,.14)!important;
      border-radius:12px!important;
      background:rgba(255,255,255,.035)!important;
      font-size:10px!important;
    }

    @keyframes m7pInstallSweep{
      0%,68%{transform:translateX(-120%)}
      88%,100%{transform:translateX(120%)}
    }

    @media(max-width:390px){
      #m7-pwa-install-card{
        width:calc(100vw - 14px)!important;
        grid-template-columns:52px minmax(0,1fr) auto!important;
        gap:9px 10px!important;
        padding:11px!important;
        border-radius:20px!important;
      }

      #m7-pwa-install-card .m7p-icon{
        width:50px!important;
        height:50px!important;
        border-radius:14px!important;
      }

      #m7-pwa-install-card .m7p-copy b{
        font-size:15px!important;
      }

      #m7-pwa-install-card .m7p-copy span{
        font-size:9.2px!important;
      }

      #m7-pwa-install-card .m7p-install{
        min-height:40px!important;
        padding:0 11px!important;
        font-size:11px!important;
      }

      #m7-pwa-install-card .m7p-close{
        width:32px!important;
        height:32px!important;
        font-size:18px!important;
      }

      #m7-pwa-install-card .m7p-benefits{
        gap:5px!important;
      }

      #m7-pwa-install-card .m7p-benefit{
        min-height:29px!important;
        gap:4px!important;
        padding:4px 5px!important;
        font-size:7.6px!important;
      }

      #m7-pwa-install-card .m7p-benefit i{
        width:16px!important;
        height:16px!important;
        flex-basis:16px!important;
        font-size:9px!important;
      }
    }

    @media(max-width:340px){
      #m7-pwa-install-card .m7p-benefit span{
        font-size:7px!important;
      }

      #m7-pwa-install-card .m7p-install{
        padding:0 9px!important;
      }
    }

    @media(prefers-reduced-motion:reduce){
      #m7-pwa-install-card::before{
        animation:none!important;
        display:none!important;
      }
    }
  `;

  (document.head||document.documentElement).appendChild(style);
})();
