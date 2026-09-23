/* =========================================================
   SHOUFHON SUPABASE BOOTSTRAP V1
   One Supabase library load + one shared project client.
   Load BEFORE viewer-account.js and all ShoufHon modules.
========================================================= */
(function(){
  "use strict";
  if(window.__MA7ALAK_SUPABASE_BOOTSTRAP_V1__) return;
  window.__MA7ALAK_SUPABASE_BOOTSTRAP_V1__ = true;

  const URL = "https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const KEY = "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const STORAGE_KEY = "ma7alak-viewer-auth-v1";
  const FOLLOW_VISITOR_KEY = "ma7alak_visitor_id";
  const FOLLOW_TOKEN_KEY = "ma7alak_follow_token_v1";
  const INTERACTION_TOKEN_KEY = "ma7alak_interaction_token_v1";
  const SECURE_FOLLOW_RPCS = new Set([
    "follow_shop",
    "unfollow_shop",
    "get_shop_follow_state",
    "get_visitor_followed_shops"
  ]);
  const SECURE_INTERACTION_RPC_MAP = new Map([
    ["like_shop","like_shop_secure"],
    ["get_shop_like_state","get_shop_like_state_secure"],
    ["like_story","like_story_secure"],
    ["get_story_notification_seen_state","get_story_notification_seen_state_secure"],
    ["get_unseen_story_count","get_unseen_story_count_secure"],
    ["mark_story_notifications_seen","mark_story_notifications_seen_secure"],
    ["record_shop_view","record_shop_view_secure"],
    ["record_story_view","record_story_view_secure"],
    ["record_website_visit","record_website_visit_secure"],
    ["update_shop_presence","update_shop_presence_secure"],
    ["update_website_presence","update_website_presence_secure"],
    ["ma7alak_live_tick","ma7alak_live_tick_secure"]
  ]);
  let nativeCreateClient = null;

  function randomFollowToken(){
    try{
      if(window.crypto && typeof window.crypto.randomUUID === "function"){
        return window.crypto.randomUUID()+"-"+window.crypto.randomUUID();
      }
      if(window.crypto && typeof window.crypto.getRandomValues === "function"){
        const bytes=new Uint8Array(32);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes,function(value){
          return value.toString(16).padStart(2,"0");
        }).join("");
      }
    }catch(_){}
    return "ft_"+Date.now().toString(36)+"_"+
      Math.random().toString(36).slice(2)+
      Math.random().toString(36).slice(2)+
      Math.random().toString(36).slice(2);
  }

  function getFollowVisitorId(){
    try{
      let value=String(localStorage.getItem(FOLLOW_VISITOR_KEY)||"").trim();
      if(!value){
        value=(window.crypto&&typeof window.crypto.randomUUID==="function")
          ? window.crypto.randomUUID()
          : "v_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
        localStorage.setItem(FOLLOW_VISITOR_KEY,value);
      }
      return value;
    }catch(_){
      return "";
    }
  }

  function getFollowToken(){
    try{
      let value=String(localStorage.getItem(FOLLOW_TOKEN_KEY)||"").trim();
      if(value.length<32||value.length>200||!/^[A-Za-z0-9._:-]+$/.test(value)){
        value=randomFollowToken();
        localStorage.setItem(FOLLOW_TOKEN_KEY,value);
      }
      return value;
    }catch(_){
      return randomFollowToken();
    }
  }

  function getInteractionToken(){
    try{
      let value=String(localStorage.getItem(INTERACTION_TOKEN_KEY)||"").trim();
      if(value.length<32||value.length>200||!/^[A-Za-z0-9._:-]+$/.test(value)){
        value=randomFollowToken();
        localStorage.setItem(INTERACTION_TOKEN_KEY,value);
      }
      return value;
    }catch(_){
      return randomFollowToken();
    }
  }

  async function getFollowBroadcastTopic(){
    const visitorId=getFollowVisitorId();
    const token=getFollowToken();
    if(!visitorId||!token||!window.crypto||!window.crypto.subtle||typeof TextEncoder==="undefined"){
      return "";
    }
    try{
      const bytes=new TextEncoder().encode(visitorId+":"+token);
      const digest=await window.crypto.subtle.digest("SHA-256",bytes);
      const hex=Array.from(new Uint8Array(digest),function(value){
        return value.toString(16).padStart(2,"0");
      }).join("");
      return "follow-private:"+hex;
    }catch(_){
      return "";
    }
  }

  function loadLibrary(){
    if(window.supabase && typeof window.supabase.createClient === "function"){
      return Promise.resolve(window.supabase);
    }
    if(window.__MA7ALAK_SUPABASE_LIB_PROMISE__){
      return window.__MA7ALAK_SUPABASE_LIB_PROMISE__;
    }

    window.__MA7ALAK_SUPABASE_LIB_PROMISE__ = new Promise(function(resolve,reject){
      const existing = document.querySelector('script[data-ma7alak-supabase-lib="1"],script[src*="@supabase/supabase-js@2"]');
      let finished = false;
      let timer = null;

      function cleanup(){
        if(timer){ clearInterval(timer); timer = null; }
      }
      function ready(){
        if(finished) return;
        if(window.supabase && typeof window.supabase.createClient === "function"){
          finished = true;
          cleanup();
          resolve(window.supabase);
        }
      }
      function fail(){
        if(finished) return;
        finished = true;
        cleanup();
        reject(new Error("SUPABASE_LOAD_FAILED"));
      }

      if(existing){
        existing.addEventListener("load",ready,{once:true});
        existing.addEventListener("error",fail,{once:true});
        timer = setInterval(ready,50);
        setTimeout(function(){ if(!finished) fail(); },15000);
        ready();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async = true;
      script.dataset.ma7alakSupabaseLib = "1";
      script.onload = ready;
      script.onerror = fail;
      (document.head || document.documentElement).appendChild(script);
    });

    return window.__MA7ALAK_SUPABASE_LIB_PROMISE__;
  }

  async function init(){
    const lib = await loadLibrary();
    nativeCreateClient = nativeCreateClient || lib.createClient.bind(lib);

    if(!window.__MA7ALAK_SHARED_SUPABASE_CLIENT__){
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ = nativeCreateClient(URL,KEY,{
        auth:{
          storage:localStorage,
          storageKey:STORAGE_KEY,
          persistSession:true,
          autoRefreshToken:true,
          detectSessionInUrl:true
        }
      });
    }

    const shared = window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;

    /*
       Follow security bridge.
       Existing ShoufHon modules can keep their current RPC names; the shared
       client quietly upgrades those calls to the private-token overloads.
       Raw token values stay in this browser only. Supabase stores only the
       SHA-256 ownership hash.
    */
    if(!shared.__ma7alakSecureVisitorRpcBridgeV2){
      const originalRpc=shared.rpc.bind(shared);
      shared.rpc=function(functionName,args,options){
        const originalName=String(functionName||"");
        let nextName=originalName;
        let nextArgs=args;

        if(
          SECURE_FOLLOW_RPCS.has(originalName) &&
          args &&
          typeof args==="object" &&
          !Array.isArray(args) &&
          !Object.prototype.hasOwnProperty.call(args,"p_follow_token")
        ){
          const token=getFollowToken();
          if(token){
            nextArgs=Object.assign({},args,{p_follow_token:token});
          }
        }

        const secureInteractionName=SECURE_INTERACTION_RPC_MAP.get(originalName);
        if(
          secureInteractionName &&
          args &&
          typeof args==="object" &&
          !Array.isArray(args)
        ){
          const token=getInteractionToken();
          if(token){
            nextName=secureInteractionName;
            nextArgs=Object.assign({},nextArgs,{p_interaction_token:token});
          }
        }

        return originalRpc(nextName,nextArgs,options);
      };
      shared.__ma7alakSecureVisitorRpcBridgeV2=true;
      shared.__ma7alakSecureFollowRpcBridge=true;
    }

    window.Ma7alakFollowSecurity={
      visitorKey:FOLLOW_VISITOR_KEY,
      tokenKey:FOLLOW_TOKEN_KEY,
      getVisitorId:getFollowVisitorId,
      getToken:getFollowToken,
      getBroadcastTopic:getFollowBroadcastTopic
    };

    window.Ma7alakInteractionSecurity={
      tokenKey:INTERACTION_TOKEN_KEY,
      getToken:getInteractionToken
    };

    /* Compatibility bridge for older ShoufHon modules.
       Calls using this exact project/key and no custom options reuse the
       shared client instead of constructing another GoTrue/Realtime client. */
    if(!lib.__ma7alakSharedCreateClientBridge){
      const original = nativeCreateClient;
      lib.createClient = function(url,key,options){
        if(String(url||"") === URL && String(key||"") === KEY && (options == null || Object.keys(options).length === 0)){
          return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ || original(url,key,options);
        }
        return original(url,key,options);
      };
      lib.__ma7alakSharedCreateClientBridge = true;
    }

    return shared;
  }

  const readyPromise = init();
  readyPromise.catch(function(error){
    console.error("SHOUFHON Supabase bootstrap:",error);
  });

  window.Ma7alakSupabaseBootstrap = {
    ready:function(){ return readyPromise; },
    get client(){ return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ || null; },
    url:URL,
    key:KEY
  };

  /* Compatibility alias for older ShoufHon modules.
     This avoids them creating a second project client when the shared
     bootstrap client is already available. */
  window.Ma7alakSupabase = {
    ready:function(){ return readyPromise; },
    get client(){ return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ || null; },
    url:URL,
    key:KEY
  };
})();
