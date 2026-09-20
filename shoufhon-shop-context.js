/* =========================================================
   SHOUFHON — UNIVERSAL SHOP CONTEXT V1

   One file, two jobs:
   1) Top-level ShoufHon page: remembers one shop slug and shares it
      with all Hostinger Custom Embed iframes.
   2) Inside an embed iframe: requests that slug before the module boots.

   No Supabase. No polling database. No localStorage shop identity.
========================================================= */
(function(){
  "use strict";

  const TYPE_SET="SHOUFHON_SHOP_CONTEXT_SET";
  const TYPE_GET="SHOUFHON_SHOP_CONTEXT_GET";
  const TYPE_STATE="SHOUFHON_SHOP_CONTEXT_STATE";
  const TYPE_ACK="SHOUFHON_SHOP_CONTEXT_ACK";
  const EVENT_NAME="shoufhon:shop-context";

  function normalize(value){
    let slug=String(value||"").trim().toLowerCase();
    try{slug=decodeURIComponent(slug)}catch(_){}
    slug=slug.replace(/^\/+|\/+$/g,"");
    if(!slug||slug.length>120)return "";
    if(!/^[a-z0-9][a-z0-9._&-]*$/i.test(slug))return "";
    return slug;
  }

  function emit(target,slug,source){
    try{
      target.dispatchEvent(new CustomEvent(EVENT_NAME,{detail:{shopSlug:slug,shop_slug:slug,source:source||"context"}}));
    }catch(_){}
  }

  function post(target,payload){
    try{target&&target.postMessage(payload,"*")}catch(_){}
  }

  function detectPageSlug(){
    const candidates=[];
    try{
      if(window.parent&&window.parent!==window){
        candidates.push(window.parent.location.pathname||"");
      }
    }catch(_){}
    try{
      if(document.referrer)candidates.push(new URL(document.referrer).pathname||"");
    }catch(_){}
    try{candidates.push(window.location.pathname||"")}catch(_){}

    for(const pathname of candidates){
      const parts=String(pathname||"").split("/").filter(Boolean);
      if(!parts.length)continue;
      let last=parts[parts.length-1];
      try{last=decodeURIComponent(last)}catch(_){}
      last=normalize(last);
      if(last&&last!=="embed"&&last!=="editor"&&last!=="admin")return last;
    }
    return "";
  }

  /* =======================================================
     TOP-LEVEL BRIDGE
  ======================================================= */
  if(window.top===window){
    if(window.__SHOUFHON_SHOP_CONTEXT_BRIDGE_V1__)return;
    window.__SHOUFHON_SHOP_CONTEXT_BRIDGE_V1__=true;

    let pageSlug="";
    let revision=0;

    function payload(type){
      return {type,shopSlug:pageSlug,shop_slug:pageSlug,revision,sentAt:Date.now()};
    }

    function sendState(target,type){
      post(target,payload(type||TYPE_STATE));
    }

    function broadcast(source){
      const data=payload(TYPE_STATE);
      try{window.postMessage(data,"*")}catch(_){}
      document.querySelectorAll("iframe").forEach(function(frame){
        try{post(frame.contentWindow,data)}catch(_){}
      });
      emit(window,pageSlug,source||"broadcast");
    }

    function setPageSlug(value,source){
      const next=normalize(value);
      if(!next)return false;
      if(next!==pageSlug){
        pageSlug=next;
        revision++;
      }
      broadcast(source||"set");
      return true;
    }

    window.addEventListener("message",function(event){
      const data=event.data||{};
      if(data.type===TYPE_SET){
        if(setPageSlug(data.shopSlug||data.shop_slug,"embed-set")){
          sendState(event.source,TYPE_ACK);
        }
        return;
      }
      if(data.type===TYPE_GET){
        sendState(event.source,TYPE_STATE);
      }
    });

    window.ShoufHonShopContext={
      get slug(){return pageSlug},
      set:function(slug){return setPageSlug(slug,"api-set")},
      refresh:function(){broadcast("api-refresh")}
    };

    return;
  }

  /* =======================================================
     EMBED CLIENT
  ======================================================= */
  if(window.__SHOUFHON_SHOP_CONTEXT_CLIENT_V1__)return;
  window.__SHOUFHON_SHOP_CONTEXT_CLIENT_V1__=true;

  let currentSlug="";
  let revision=0;
  const waiters=[];

  function settle(slug,source){
    const next=normalize(slug);
    if(!next)return false;
    currentSlug=next;
    emit(window,currentSlug,source||"state");
    while(waiters.length){
      try{waiters.shift()(currentSlug)}catch(_){}
    }
    return true;
  }

  window.addEventListener("message",function(event){
    const data=event.data||{};
    if(data.type!==TYPE_STATE&&data.type!==TYPE_ACK)return;
    const incomingRevision=Number(data.revision)||0;
    if(incomingRevision<revision)return;
    revision=incomingRevision;
    settle(data.shopSlug||data.shop_slug,data.type===TYPE_ACK?"ack":"state");
  });

  function request(){
    post(window.parent,{type:TYPE_GET,sentAt:Date.now()});
  }

  function waitForContext(timeoutMs){
    if(currentSlug)return Promise.resolve(currentSlug);
    return new Promise(function(resolve){
      let finished=false;
      const done=function(slug){
        if(finished)return;
        finished=true;
        clearInterval(retryTimer);
        clearTimeout(timeoutTimer);
        resolve(slug||"");
      };
      waiters.push(done);
      request();
      const retryTimer=setInterval(request,180);
      const timeoutTimer=setTimeout(function(){
        const index=waiters.indexOf(done);
        if(index>=0)waiters.splice(index,1);
        done("");
      },Math.max(500,Number(timeoutMs)||4500));
    });
  }

  async function resolveSlug(options){
    options=options||{};
    if(currentSlug)return currentSlug;
    const fromContext=await waitForContext(options.timeout||4500);
    if(fromContext)return fromContext;

    const explicit=normalize(options.explicit||"");
    if(explicit){
      settle(explicit,"explicit-fallback");
      return explicit;
    }

    const fallback=normalize(
      typeof options.fallback==="function"
        ? options.fallback()
        : (options.fallback||detectPageSlug())
    );
    if(fallback){
      settle(fallback,"page-fallback");
      return fallback;
    }

    return "";
  }

  function setPage(value){
    const slug=normalize(value);
    if(!slug)return Promise.resolve(false);

    let tries=0;
    return new Promise(function(resolve){
      let done=false;
      const finish=function(ok){
        if(done)return;
        done=true;
        clearInterval(timer);
        clearTimeout(stopTimer);
        window.removeEventListener("message",onAck);
        resolve(!!ok);
      };
      const onAck=function(event){
        const data=event.data||{};
        if(data.type!==TYPE_ACK)return;
        if(normalize(data.shopSlug||data.shop_slug)!==slug)return;
        settle(slug,"set-page-ack");
        finish(true);
      };
      const send=function(){
        tries++;
        post(window.parent,{type:TYPE_SET,shopSlug:slug,shop_slug:slug,sentAt:Date.now()});
        if(tries>=40)finish(false);
      };
      window.addEventListener("message",onAck);
      send();
      const timer=setInterval(send,200);
      const stopTimer=setTimeout(function(){finish(false)},8500);
    });
  }

  window.ShoufHonShopContextClient={
    get slug(){return currentSlug},
    request,
    resolve:resolveSlug,
    setPage,
    detectPageSlug,
    normalize
  };

  request();
})();