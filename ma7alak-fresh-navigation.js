/* =========================================================
   SHOUFHON PAGE WAKE / SOFT DATA REFRESH V3
   ---------------------------------------------------------
   - NEVER reloads the page for normal navigation/resume.
   - Refreshes live data on real page resume/navigation events.
   - UI-only history changes (panels, chat, story/reel viewers) do NOT
     trigger a page-wide refresh, preventing header/ring flicker.
   - Native fullscreen exit gets a short quiet window so Android/Brave
     focus/visibility noise cannot restart animations.
   - Trailing pulse is queued instead of dropping a real wake.
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
  let suppressWakeUntil=0;

  function suppressTransientWake(ms=1000){
    suppressWakeUntil=Math.max(
      suppressWakeUntil,
      Date.now()+Math.max(0,Number(ms)||0)
    );
    clearTimeout(trailingTimer);
    trailingTimer=null;
    trailingReason="";
    trailingMeta=null;
  }

  function transientUiOpen(){
    try{
      return !!(
        document.getElementById("m7-chat-shell") ||
        document.getElementById("ma7alak-header-search-overlay")?.classList.contains("open") ||
        document.getElementById("ma7alak-notification-panel")?.classList.contains("open") ||
        document.getElementById("m7-owner-social-panel")?.classList.contains("open") ||
        document.getElementById("m7-account-overlay") ||
        document.getElementById("ma7alak-following-overlay")?.classList.contains("open") ||
        document.getElementById("ma7alak-full-story")?.classList.contains("active") ||
        document.getElementById("shoufhon-global-story-viewer")?.hidden===false ||
        document.getElementById("ma7alakGlobalReelViewer")?.classList.contains("open") ||
        document.getElementById("ma7alakReelViewer")?.classList.contains("open")
      );
    }catch(_){
      return false;
    }
  }

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

    /*
      Do not refresh the whole page while an in-page panel/viewer is open
      or immediately after Android/Brave fullscreen/history UI transitions.
      Those are not real page navigations.
    */
    if(
      transientUiOpen() ||
      (
        now<suppressWakeUntil &&
        (reason==="focus"||reason==="visible"||reason==="popstate")
      )
    ){
      return;
    }

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
    version:3,
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

  /*
    ShoufHon uses pushState/history.back for in-page UI such as
    Notifications, Messages, Following and viewer close behavior.
    A popstate from those controls must NOT refresh/re-render the page.
    Real browser back/forward page restores still fire pageshow, including
    BFCache restores, so live data remains fresh without the visual reset.
  */
  window.addEventListener(
    "popstate",
    ()=>suppressTransientWake(900)
  );

  /*
    Mobile browsers may emit focus/visibility changes when entering/leaving
    native fullscreen. Give that transition a short quiet window so story
    and reel rings/animations keep their visual state.
  */
  document.addEventListener(
    "fullscreenchange",
    ()=>suppressTransientWake(1200)
  );

  document.addEventListener(
    "webkitfullscreenchange",
    ()=>suppressTransientWake(1200)
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

  function safeInternalNavigationUrl(value){
    try{
      const parsed=
        new URL(
          String(value||""),
          location.href
        );

      if(
        parsed.protocol!=="https:" &&
        parsed.protocol!=="http:"
      ){
        return "";
      }

      if(parsed.origin!==location.origin){
        return "";
      }

      return parsed.href;
    }catch(_){
      return "";
    }
  }

  window.ma7alakFreshNavigate=function(url){
    const target=
      safeInternalNavigationUrl(url);

    if(!target){
      console.warn(
        "ShoufHon blocked unsafe navigation target."
      );
      return false;
    }

    location.assign(target);
    return true;
  };
})();
