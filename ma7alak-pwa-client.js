(function(){
  "use strict";

  if(window.self!==window.top)return;
  if(window.__MA7ALAK_PWA_CLIENT__)return;
  window.__MA7ALAK_PWA_CLIENT__=true;

  const VERSION="2026.09.20.3";
  const ICON_BASE="https://ma7alak-pwa.hadizeboss89.workers.dev";
  const DISMISS_KEY="ma7alak_pwa_install_dismissed_until";
  const THREE_DAYS=3*24*60*60*1000;
  let deferredPrompt=null;

  function isStandalone(){
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone===true
    );
  }

  function injectHead(){
    let link=document.querySelector('link[rel="manifest"]');
    if(!link){
      link=document.createElement("link");
      link.rel="manifest";
      document.head.appendChild(link);
    }
    link.href="/manifest.webmanifest?v="+encodeURIComponent(VERSION);

    function meta(name,content){
      let el=document.querySelector('meta[name="'+name+'"]');
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
    meta("apple-mobile-web-app-status-bar-style","black-translucent");
    meta("apple-mobile-web-app-title","Ma7alak");

    let icon=document.querySelector('link[rel="apple-touch-icon"]');
    if(!icon){
      icon=document.createElement("link");
      icon.rel="apple-touch-icon";
      document.head.appendChild(icon);
    }
    icon.href=ICON_BASE+"/pwa-icon-192.png?v="+encodeURIComponent(VERSION);
  }

  async function registerServiceWorker(){
    if(!("serviceWorker" in navigator))return;
    try{
      const registration=await navigator.serviceWorker.register(
        "/sw.js?v="+encodeURIComponent(VERSION),
        {scope:"/",updateViaCache:"none"}
      );

      setTimeout(()=>registration.update().catch(()=>{}),3500);

      window.Ma7alakPWA={
        ...(window.Ma7alakPWA||{}),
        registration,
        version:VERSION,
        standalone:isStandalone()
      };

      window.dispatchEvent(new CustomEvent("ma7alak:pwa-ready",{
        detail:{registration,standalone:isStandalone(),version:VERSION}
      }));
    }catch(error){
      console.warn("[Ma7alak PWA] Service worker registration failed:",error);
    }
  }

  function css(){
    if(document.getElementById("m7-pwa-install-style"))return;
    const style=document.createElement("style");
    style.id="m7-pwa-install-style";
    style.textContent=`
      #m7-pwa-install-card{
        --m7p-gold:#d9a441;
        position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));
        transform:translateX(-50%) translateY(18px);z-index:2147483000;
        width:min(430px,calc(100vw - 24px));display:grid;
        grid-template-columns:48px minmax(0,1fr) auto;gap:11px;align-items:center;
        padding:11px;border:1px solid rgba(217,164,65,.58);border-radius:20px;
        background:radial-gradient(circle at 8% 0%,rgba(217,164,65,.14),transparent 32%),rgba(14,10,8,.96);
        box-shadow:0 16px 38px rgba(0,0,0,.48),0 0 20px rgba(217,164,65,.09),inset 0 1px 0 rgba(255,255,255,.045);
        color:#fff;font-family:Arial,"Segoe UI",sans-serif;backdrop-filter:blur(14px) saturate(125%);
        opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease
      }
      #m7-pwa-install-card.show{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
      #m7-pwa-install-card .m7p-icon{width:46px;height:46px;border-radius:14px;overflow:hidden;border:1px solid rgba(217,164,65,.6);background:#100b08;display:grid;place-items:center}
      #m7-pwa-install-card .m7p-icon img{width:100%;height:100%;display:block}
      #m7-pwa-install-card .m7p-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
      #m7-pwa-install-card .m7p-copy b{font-size:13px;line-height:1.2;font-weight:900}
      #m7-pwa-install-card .m7p-copy span{color:rgba(255,255,255,.62);font-size:9px;line-height:1.25;font-weight:650}
      #m7-pwa-install-card .m7p-actions{display:flex;align-items:center;gap:7px}
      #m7-pwa-install-card button{border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
      #m7-pwa-install-card .m7p-install{min-height:36px;padding:0 13px;border-radius:11px;background:linear-gradient(135deg,#f4ce75,#d9a441);color:#190f07;font-size:10px;font-weight:950}
      #m7-pwa-install-card .m7p-close{width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.055);color:rgba(255,255,255,.65);font-size:16px}
    `;
    document.head.appendChild(style);
  }

  function dismissed(){
    const until=Number(localStorage.getItem(DISMISS_KEY)||0);
    return Number.isFinite(until)&&until>Date.now();
  }

  function hideCard(){
    document.getElementById("m7-pwa-install-card")?.classList.remove("show");
  }

  function showCard(){
    if(isStandalone()||!deferredPrompt||dismissed())return;
    css();

    let card=document.getElementById("m7-pwa-install-card");
    if(!card){
      card=document.createElement("div");
      card.id="m7-pwa-install-card";
      card.setAttribute("role","dialog");
      card.setAttribute("aria-label","Install Ma7alak");
      card.innerHTML=`
        <span class="m7p-icon" aria-hidden="true"><img src="${ICON_BASE}/pwa-icon-192.png?v=${VERSION}" alt=""></span>
        <span class="m7p-copy"><b>Install Ma7alak</b><span>Faster access · opens like an app</span></span>
        <span class="m7p-actions">
          <button class="m7p-install" type="button">Install</button>
          <button class="m7p-close" type="button" aria-label="Not now">×</button>
        </span>
      `;
      document.body.appendChild(card);

      card.querySelector(".m7p-install").addEventListener("click",async()=>{
        const prompt=deferredPrompt;
        if(!prompt)return;
        hideCard();
        deferredPrompt=null;
        try{
          await prompt.prompt();
          const choice=await prompt.userChoice;
          window.dispatchEvent(new CustomEvent("ma7alak:pwa-install-choice",{detail:choice}));
        }catch(error){
          console.warn("[Ma7alak PWA] Install prompt:",error);
        }
      });

      card.querySelector(".m7p-close").addEventListener("click",()=>{
        localStorage.setItem(DISMISS_KEY,String(Date.now()+THREE_DAYS));
        hideCard();
      });
    }

    requestAnimationFrame(()=>card.classList.add("show"));
  }

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredPrompt=event;
    window.Ma7alakPWA={
      ...(window.Ma7alakPWA||{}),
      installAvailable:true,
      showInstallPrompt:showCard
    };
    setTimeout(showCard,900);
  });

  window.addEventListener("appinstalled",()=>{
    deferredPrompt=null;
    hideCard();
    localStorage.removeItem(DISMISS_KEY);
    window.Ma7alakPWA={
      ...(window.Ma7alakPWA||{}),
      installAvailable:false,
      standalone:true
    };
    window.dispatchEvent(new CustomEvent("ma7alak:pwa-installed"));
  });

  injectHead();
  if(document.readyState==="complete"){
    registerServiceWorker();
  }else{
    window.addEventListener("load",registerServiceWorker,{once:true});
  }

  window.Ma7alakPWA={
    ...(window.Ma7alakPWA||{}),
    version:VERSION,
    standalone:isStandalone(),
    showInstallPrompt:showCard
  };
})();