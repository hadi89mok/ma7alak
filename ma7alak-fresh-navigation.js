/* =========================================================
   SHOUFHON PAGE WAKE / FRESH DATA NAVIGATION
   ---------------------------------------------------------
   - Normal internal navigation (no ?fresh cache-busting)
   - One deduped page-wake event on pageshow/focus/visibility/online
   - Broadcasts wake to iframes
   - Hard reload only for a genuinely stale BFCache restore
   - Keeps window.ma7alakFreshNavigate() as a compatibility helper
========================================================= */
(function(){
  "use strict";

  if(window.self!==window.top)return;
  if(window.__MA7ALAK_FRESH_NAVIGATION_LOADED__)return;
  window.__MA7ALAK_FRESH_NAVIGATION_LOADED__=true;

  const LEGACY_FRESH_PARAM="fresh";
  const STALE_BFCACHE_MS=10*60*1000;
  const WAKE_DEBOUNCE_MS=700;
  const RELOAD_GUARD_KEY="m7-stale-bfcache-reload";
  const loadedAt=Date.now();
  let lastWakeAt=0;

  function cleanLegacyFreshParam(){
    try{
      const current=new URL(location.href);
      if(!current.searchParams.has(LEGACY_FRESH_PARAM))return;
      current.searchParams.delete(LEGACY_FRESH_PARAM);
      const clean=current.pathname+(current.search||"")+(current.hash||"");
      history.replaceState(history.state,"",clean);
    }catch(_){}
  }

  function broadcastWake(reason){
    const now=Date.now();
    if(now-lastWakeAt<WAKE_DEBOUNCE_MS)return;
    lastWakeAt=now;

    const detail={reason:String(reason||"wake"),at:now};

    try{
      window.dispatchEvent(new CustomEvent("ma7alak:page-wake",{detail}));
    }catch(_){}

    try{
      window.postMessage({type:"MA7ALAK_PAGE_WAKE",...detail},"*");
    }catch(_){}

    document.querySelectorAll("iframe").forEach(frame=>{
      try{
        frame.contentWindow?.postMessage({type:"MA7ALAK_PAGE_WAKE",...detail},"*");
      }catch(_){}
    });
  }

  function staleBfcacheReloadNeeded(event){
    if(!event?.persisted)return false;
    return Date.now()-loadedAt>STALE_BFCACHE_MS;
  }

  cleanLegacyFreshParam();

  window.addEventListener("pageshow",event=>{
    if(staleBfcacheReloadNeeded(event)){
      try{
        const guarded=sessionStorage.getItem(RELOAD_GUARD_KEY)==="1";
        if(!guarded){
          sessionStorage.setItem(RELOAD_GUARD_KEY,"1");
          location.reload();
          return;
        }
        sessionStorage.removeItem(RELOAD_GUARD_KEY);
      }catch(_){}
    }
    broadcastWake(event.persisted?"bfcache":"pageshow");
  });

  window.addEventListener("focus",()=>broadcastWake("focus"));

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible")broadcastWake("visible");
  });

  window.addEventListener("online",()=>broadcastWake("online"));
  window.addEventListener("popstate",()=>broadcastWake("popstate"));

  window.ma7alakFreshNavigate=function(url){
    try{
      const parsed=new URL(url,location.href);
      location.assign(parsed.href);
    }catch(_){
      location.assign(url);
    }
  };

  window.Ma7alakPageWake={
    refresh(reason="manual"){
      broadcastWake(reason);
    }
  };
})();
