/* =========================================================
   MA7ALAK SUPABASE BOOTSTRAP V1
   One Supabase library load + one shared project client.
   Load BEFORE viewer-account.js and all Ma7alak modules.
========================================================= */
(function(){
  "use strict";
  if(window.__MA7ALAK_SUPABASE_BOOTSTRAP_V1__) return;
  window.__MA7ALAK_SUPABASE_BOOTSTRAP_V1__ = true;

  const URL = "https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const KEY = "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const STORAGE_KEY = "ma7alak-viewer-auth-v1";
  let nativeCreateClient = null;

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

    /* Compatibility bridge for older Ma7alak modules.
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
    console.error("MA7ALAK Supabase bootstrap:",error);
  });

  window.Ma7alakSupabaseBootstrap = {
    ready:function(){ return readyPromise; },
    get client(){ return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ || null; },
    url:URL,
    key:KEY
  };
})();
