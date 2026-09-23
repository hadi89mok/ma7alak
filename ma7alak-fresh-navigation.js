/* =========================================================
   SHOUFHON PAGE WAKE / SOFT DATA REFRESH V2
   ---------------------------------------------------------
   - NEVER reloads the page for normal navigation/resume.
   - One deduped wake pulse for pageshow/focus/visibility/popstate/online.
   - Trailing pulse is queued instead of dropping a wake during debounce.
   - Broadcasts the same wake into Hostinger iframes.
   - One startup-settle pulse catches late Hostinger hydration.
   - Keeps window.ma7alakFreshNavigate() for compatibility.
========================================================= */
(function(){
  "use strict";

  if(window.self!==window.top)return;
  if(window.__MA7ALAK_FRESH_NAVIGATION_LOADED__)return;
  window.__MA7ALAK_FRESH_NAVIGATION_LOADED__=true;

  const LEGACY_FRESH_PARAM="fresh";
  const WAKE_DEBOUNCE_MS=700;

  let lastWakeAt=0;
  let wakeSeq=0;
  let trailingTimer=null;
  let trailingReason="";
  let trailingMeta=null;

  function cleanLegacyFreshParam(){
    try{
      const current=new URL(location.href);
      if(!current.searchParams.has(LEGACY_FRESH_PARAM))return;
      current.searchParams.delete(LEGACY_FRESH_PARAM);
      history.replaceState(
        history.state,
        "",
        current.pathname+(current.search||"")+(current.hash||"")
      );
    }catch(_){}
  }

  function emitWake(reason,meta){
    if(document.visibilityState==="hidden")return;

    const now=Date.now();
    lastWakeAt=now;
    wakeSeq++;

    const detail={
      reason:String(reason||"wake"),
      at:now,
      seq:wakeSeq,
      url:String(location.href||""),
      ...(meta&&typeof meta==="object"?meta:{})
    };

    try{
      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:page-wake",
          {detail}
        )
      );
    }catch(_){}

    const message={
      type:"MA7ALAK_PAGE_WAKE",
      ...detail
    };

    try{
      window.postMessage(message,"*");
    }catch(_){}

    document.querySelectorAll("iframe").forEach(frame=>{
      try{
        frame.contentWindow?.postMessage(message,"*");
      }catch(_){}
    });

    window.Ma7alakPageWake.last=detail;
  }

  function requestWake(reason,meta){
    if(document.visibilityState==="hidden")return;

    const now=Date.now();
    const elapsed=now-lastWakeAt;

    if(elapsed>=WAKE_DEBOUNCE_MS){
      clearTimeout(trailingTimer);
      trailingTimer=null;
      trailingReason="";
      trailingMeta=null;
      emitWake(reason,meta);
      return;
    }

    trailingReason=String(reason||"wake");
    trailingMeta=meta&&typeof meta==="object"?meta:null;

    clearTimeout(trailingTimer);
    trailingTimer=setTimeout(()=>{
      trailingTimer=null;
      const nextReason=trailingReason||"wake";
      const nextMeta=trailingMeta;
      trailingReason="";
      trailingMeta=null;
      emitWake(nextReason,nextMeta);
    },Math.max(40,WAKE_DEBOUNCE_MS-elapsed));
  }

  cleanLegacyFreshParam();

  window.Ma7alakPageWake={
    version:2,
    last:null,
    refresh(reason="manual"){
      requestWake(reason,{manual:true});
    }
  };

  window.addEventListener("pageshow",event=>{
    requestWake(
      event.persisted?"bfcache":"pageshow",
      {persisted:!!event.persisted}
    );
  });

  window.addEventListener(
    "focus",
    ()=>requestWake("focus")
  );

  document.addEventListener(
    "visibilitychange",
    ()=>{
      if(document.visibilityState==="visible"){
        requestWake("visible");
      }
    }
  );

  window.addEventListener(
    "online",
    ()=>requestWake("online")
  );

  window.addEventListener(
    "popstate",
    ()=>requestWake("popstate")
  );

  const scheduleStartupSettle=()=>{
    setTimeout(
      ()=>requestWake("startup-settle",{startup:true}),
      1200
    );
  };

  if(document.readyState==="complete"){
    scheduleStartupSettle();
  }else{
    window.addEventListener(
      "load",
      scheduleStartupSettle,
      {once:true}
    );
  }

  window.ma7alakFreshNavigate=function(url){
    try{
      location.assign(
        new URL(url,location.href).href
      );
    }catch(_){
      location.assign(url);
    }
  };
})();
