/* =========================================================
   SHOUFHON — UNIVERSAL SHOP CONTEXT V1

   One file, two jobs:
   1) Top-level ShoufHon page: remembers one shop slug and shares it
      with all Hostinger Custom Embed iframes.
   2) Inside an embed iframe: requests that slug before the module boots.

   No database polling. Reuses the site's existing Supabase client only for
   instant Admin design-preview broadcast; shop identity is never stored locally.
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

    let pageSlug=detectPageSlug();
    let revision=pageSlug?1:0;

    const DESIGN_TYPE="MA7ALAK_DESIGN_PREVIEW";
    const DESIGN_CHANNEL_LOCAL="ma7alak-design-live-v1";
    let designRealtimeChannel=null;
    let designRealtimeClient=null;
    let designRealtimeSlug="";
    let designRetryTimer=0;
    let designBc=null;
    let lastDesignStamp=0;

    function designClient(){
      return (
        window.Ma7alakSupabase?.client ||
        window.Ma7alakSupabaseBootstrap?.client ||
        window.Ma7alakAccount?.client ||
        window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
        null
      );
    }

    function relayDesignPreview(message,source){
      if(!message||message.type!==DESIGN_TYPE)return;
      const slug=normalize(message.shop_slug||message.shopSlug||"");
      if(!slug||!pageSlug||slug!==pageSlug)return;

      const stamp=Number(message.sent_at)||Date.now();
      if(stamp<=lastDesignStamp)return;
      lastDesignStamp=stamp;

      const payload={
        ...message,
        shop_slug:pageSlug,
        shopSlug:pageSlug,
        source:source||message.source||"shop-context-relay"
      };

      try{window.postMessage(payload,"*")}catch(_){}
      document.querySelectorAll("iframe").forEach(function(frame){
        try{post(frame.contentWindow,payload)}catch(_){}
      });

      try{
        window.dispatchEvent(
          new CustomEvent(
            "shoufhon:design-preview",
            {detail:payload}
          )
        );
      }catch(_){}
    }

    function stopDesignRealtime(){
      if(designRealtimeClient&&designRealtimeChannel){
        try{
          designRealtimeClient.removeChannel(designRealtimeChannel);
        }catch(_){}
      }
      designRealtimeChannel=null;
      designRealtimeClient=null;
      designRealtimeSlug="";
    }

    async function startDesignRealtime(){
      clearTimeout(designRetryTimer);
      designRetryTimer=0;

      if(!pageSlug){
        stopDesignRealtime();
        return;
      }

      let client=designClient();

      if(
        !client &&
        window.Ma7alakSupabaseBootstrap &&
        typeof window.Ma7alakSupabaseBootstrap.ready==="function"
      ){
        try{
          client=await window.Ma7alakSupabaseBootstrap.ready();
        }catch(_){}
      }

      client=client||designClient();

      if(!client||typeof client.channel!=="function"){
        designRetryTimer=setTimeout(startDesignRealtime,350);
        return;
      }

      if(
        designRealtimeChannel &&
        designRealtimeClient===client &&
        designRealtimeSlug===pageSlug
      ){
        return;
      }

      stopDesignRealtime();

      designRealtimeClient=client;
      designRealtimeSlug=pageSlug;
      designRealtimeChannel=
        client
          .channel("ma7alak-design-preview-"+pageSlug)
          .on(
            "broadcast",
            {event:"design-preview"},
            function(payload){
              relayDesignPreview(
                payload&&payload.payload,
                "supabase"
              );
            }
          )
          .subscribe();
    }

    function scheduleDesignRealtime(){
      clearTimeout(designRetryTimer);
      designRetryTimer=setTimeout(startDesignRealtime,0);
    }

    try{
      if("BroadcastChannel" in window){
        designBc=new BroadcastChannel(DESIGN_CHANNEL_LOCAL);
        designBc.onmessage=function(event){
          relayDesignPreview(event.data,"broadcast-channel");
        };
      }
    }catch(_){}

    window.addEventListener("storage",function(event){
      if(!event.key||!event.newValue)return;
      if(event.key!=="ma7alak_design_live_v1:"+pageSlug)return;
      try{
        relayDesignPreview(JSON.parse(event.newValue),"storage");
      }catch(_){}
    });

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
      scheduleDesignRealtime();
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

    /*
       Hostinger normally isolates Custom Embeds in iframes, but expose the
       same client API on the top window too. This keeps the universal embeds
       working even if Hostinger renders one directly in the page document.
    */
    window.ShoufHonShopContextClient={
      get slug(){return pageSlug},
      request:function(){},
      resolve:async function(options){
        options=options||{};
        if(pageSlug)return pageSlug;

        const waitMs=Math.max(300,Number(options.timeout)||4500);
        const started=Date.now();
        while(!pageSlug&&Date.now()-started<waitMs){
          await new Promise(function(resolve){setTimeout(resolve,50)});
        }
        if(pageSlug)return pageSlug;

        const explicit=normalize(options.explicit||"");
        if(explicit){
          setPageSlug(explicit,"top-explicit-fallback");
          return pageSlug;
        }

        const fallback=normalize(
          typeof options.fallback==="function"
            ? options.fallback()
            : (options.fallback||detectPageSlug())
        );
        if(fallback){
          setPageSlug(fallback,"top-page-fallback");
          return pageSlug;
        }
        return "";
      },
      setPage:function(value){
        return Promise.resolve(setPageSlug(value,"top-client-set"));
      },
      detectPageSlug,
      normalize
    };

    window.addEventListener("ma7alak:account-change",scheduleDesignRealtime);
    window.addEventListener("ma7alak:owner-auth-change",scheduleDesignRealtime);
    window.addEventListener("pageshow",scheduleDesignRealtime);
    document.addEventListener("visibilitychange",function(){
      if(document.visibilityState==="visible")scheduleDesignRealtime();
    });

    scheduleDesignRealtime();

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
      const retryTimer=setInterval(request,120);
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

    const explicit=normalize(options.explicit||"");
    if(explicit){
      settle(explicit,"explicit");
      return explicit;
    }

    /*
       The parent bridge now pre-seeds from the published page URL, so under
       normal conditions this resolves on the first postMessage round-trip.
       Keep only a short wait for Hostinger/editor startup before falling
       back locally.
    */
    const fromContext=await waitForContext(options.timeout||800);
    if(fromContext)return fromContext;

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