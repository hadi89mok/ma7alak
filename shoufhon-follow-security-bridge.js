/* =========================================================
   SHOUFHON FOLLOW SECURITY BRIDGE V1

   For Hostinger Custom Embed iframes that still use the original
   Follow RPC names and old shop_follows postgres_changes listeners.

   - Adds private per-browser p_follow_token automatically.
   - Keeps visitor ID + token in sync with the parent page when allowed.
   - Replaces raw shop_follows Realtime listeners with safe Broadcast topics:
       follow-private:<sha256(visitor_id:token)>
       shop-followers:<sha256(shop_slug)>
       profile-following:<sha256(profile_shop_slug)>
   - Does not change Stories, media, messaging, likes or profile design.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_FOLLOW_SECURITY_BRIDGE_V1__)return;
  window.__SHOUFHON_FOLLOW_SECURITY_BRIDGE_V1__=true;

  const VISITOR_KEY="ma7alak_visitor_id";
  const TOKEN_KEY="ma7alak_follow_token_v1";
  const FOLLOW_RPCS=new Set([
    "follow_shop",
    "unfollow_shop",
    "get_shop_follow_state",
    "get_visitor_followed_shops"
  ]);

  function parentWindow(){
    try{
      return window.parent&&window.parent!==window?window.parent:null;
    }catch(_){
      return null;
    }
  }

  function validToken(value){
    return (
      typeof value==="string" &&
      value.length>=32 &&
      value.length<=200 &&
      /^[A-Za-z0-9._:-]+$/.test(value)
    );
  }

  function randomToken(){
    try{
      if(window.crypto&&typeof window.crypto.randomUUID==="function"){
        return window.crypto.randomUUID()+"-"+window.crypto.randomUUID();
      }
      if(window.crypto&&typeof window.crypto.getRandomValues==="function"){
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

  function readStorage(key){
    const parent=parentWindow();

    try{
      const helper=parent&&parent.Ma7alakFollowSecurity;
      if(key===TOKEN_KEY&&helper&&typeof helper.getToken==="function"){
        const value=String(helper.getToken()||"").trim();
        if(value)return value;
      }
      if(key===VISITOR_KEY&&helper&&typeof helper.getVisitorId==="function"){
        const value=String(helper.getVisitorId()||"").trim();
        if(value)return value;
      }
    }catch(_){}

    try{
      if(parent){
        const value=String(parent.localStorage.getItem(key)||"").trim();
        if(value)return value;
      }
    }catch(_){}

    try{
      return String(localStorage.getItem(key)||"").trim();
    }catch(_){
      return "";
    }
  }

  function writeStorage(key,value){
    try{localStorage.setItem(key,value)}catch(_){}
    const parent=parentWindow();
    try{if(parent)parent.localStorage.setItem(key,value)}catch(_){}
  }

  function getVisitorId(){
    let value=readStorage(VISITOR_KEY);
    if(value)return value;

    try{
      value=(window.crypto&&typeof window.crypto.randomUUID==="function")
        ? window.crypto.randomUUID()
        : "v_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
    }catch(_){
      value="v_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
    }

    writeStorage(VISITOR_KEY,value);
    return value;
  }

  function getToken(){
    let value=readStorage(TOKEN_KEY);
    if(!validToken(value)){
      value=randomToken();
      writeStorage(TOKEN_KEY,value);
    }else{
      writeStorage(TOKEN_KEY,value);
    }
    return value;
  }

  async function sha256(value){
    if(!window.crypto||!window.crypto.subtle||typeof TextEncoder==="undefined"){
      return "";
    }
    try{
      const bytes=new TextEncoder().encode(String(value||""));
      const digest=await window.crypto.subtle.digest("SHA-256",bytes);
      return Array.from(new Uint8Array(digest),function(part){
        return part.toString(16).padStart(2,"0");
      }).join("");
    }catch(_){
      return "";
    }
  }

  async function privateTopic(){
    const visitorId=getVisitorId();
    const token=getToken();
    const hash=await sha256(visitorId+":"+token);
    return hash?"follow-private:"+hash:"";
  }

  async function shopFollowersTopic(slug){
    const hash=await sha256(String(slug||"").trim().toLowerCase());
    return hash?"shop-followers:"+hash:"";
  }

  async function profileFollowingTopic(slug){
    const hash=await sha256(String(slug||"").trim().toLowerCase());
    return hash?"profile-following:"+hash:"";
  }

  function currentShopSlug(){
    try{
      const shell=document.getElementById("ma7alak-profile-shell");
      const explicit=String(shell&&shell.getAttribute("data-shop-slug")||"").trim().toLowerCase();
      if(explicit)return explicit;
    }catch(_){}

    try{
      const slug=String(window.ShoufHonShopContextClient&&window.ShoufHonShopContextClient.slug||"").trim().toLowerCase();
      if(slug)return slug;
    }catch(_){}

    try{
      const detected=window.ShoufHonShopContextClient&&window.ShoufHonShopContextClient.detectPageSlug;
      if(typeof detected==="function"){
        return String(detected()||"").trim().toLowerCase();
      }
    }catch(_){}

    return "";
  }

  function secureRpcArgs(functionName,args){
    if(
      !FOLLOW_RPCS.has(String(functionName||"")) ||
      !args ||
      typeof args!=="object" ||
      Array.isArray(args) ||
      Object.prototype.hasOwnProperty.call(args,"p_follow_token")
    ){
      return args;
    }

    return Object.assign({},args,{p_follow_token:getToken()});
  }

  function parseEqFilter(filter,prefix){
    const value=String(filter||"");
    return value.indexOf(prefix)===0
      ? value.slice(prefix.length).trim()
      : "";
  }

  async function safeBindingTopic(binding){
    const config=binding&&binding.config||{};
    const filter=String(config.filter||"");

    const shopSlug=parseEqFilter(filter,"shop_slug=eq.");
    if(shopSlug){
      return {
        topic:await shopFollowersTopic(shopSlug),
        event:"followers_changed"
      };
    }

    const visitorId=parseEqFilter(filter,"visitor_id=eq.");
    if(visitorId){
      return {
        topic:await privateTopic(),
        event:"follow_changed"
      };
    }

    const profileSlug=currentShopSlug();
    if(profileSlug){
      return {
        topic:await profileFollowingTopic(profileSlug),
        event:"following_changed"
      };
    }

    return null;
  }

  function patchClient(client){
    if(!client||client.__shoufhonFollowSecurityPatched)return client;

    try{
      const originalRpc=client.rpc.bind(client);
      client.rpc=function(functionName,args,options){
        return originalRpc(
          functionName,
          secureRpcArgs(functionName,args),
          options
        );
      };
    }catch(_){}

    try{
      const originalChannel=client.channel.bind(client);

      client.channel=function(channelName,options){
        const real=originalChannel(channelName,options);
        if(!real||real.__shoufhonFollowCompat)return real;

        real.__shoufhonFollowCompat=true;

        const bindings=[];
        const auxChannels=[];
        const originalOn=real.on.bind(real);
        const originalSubscribe=real.subscribe.bind(real);
        const originalUnsubscribe=
          typeof real.unsubscribe==="function"
            ? real.unsubscribe.bind(real)
            : null;

        real.on=function(type,config,callback){
          if(
            type==="postgres_changes" &&
            config &&
            config.schema==="public" &&
            config.table==="shop_follows" &&
            typeof callback==="function"
          ){
            bindings.push({config:Object.assign({},config),callback});
            return real;
          }

          originalOn(type,config,callback);
          return real;
        };

        real.subscribe=function(statusCallback,timeout){
          if(!bindings.length){
            return originalSubscribe(statusCallback,timeout);
          }

          Promise.all(
            bindings.map(async function(binding){
              const safe=await safeBindingTopic(binding);
              if(!safe||!safe.topic)return null;

              /*
                 Broadcast channel topic must exactly match the server topic.
                 The payload contains only a generic "changed" signal; the
                 embed then refreshes its existing RPC count/state.
              */
              const channel=originalChannel(safe.topic)
                .on(
                  "broadcast",
                  {event:safe.event},
                  function(payload){
                    try{
                      binding.callback({
                        eventType:"BROADCAST",
                        schema:"public",
                        table:"shop_follows",
                        payload:payload&&payload.payload
                      });
                    }catch(_){}
                  }
                )
                .subscribe();

              auxChannels.push(channel);
              return channel;
            })
          )
            .then(function(){
              if(typeof statusCallback==="function"){
                try{statusCallback("SUBSCRIBED")}catch(_){}
              }
            })
            .catch(function(){
              if(typeof statusCallback==="function"){
                try{statusCallback("CHANNEL_ERROR")}catch(_){}
              }
            });

          return real;
        };

        if(originalUnsubscribe){
          real.unsubscribe=function(timeout){
            const jobs=auxChannels.splice(0).map(function(channel){
              try{
                return Promise.resolve(channel.unsubscribe(timeout)).catch(function(){});
              }catch(_){
                return Promise.resolve();
              }
            });

            if(bindings.length){
              return Promise.all(jobs)
                .then(function(){
                  return Promise.resolve(originalUnsubscribe(timeout))
                    .catch(function(){return "ok"});
                });
            }

            return originalUnsubscribe(timeout);
          };
        }

        return real;
      };
    }catch(_){}

    client.__shoufhonFollowSecurityPatched=true;
    return client;
  }

  function installFactoryBridge(){
    if(
      !window.supabase ||
      typeof window.supabase.createClient!=="function"
    ){
      return false;
    }

    if(window.supabase.__shoufhonFollowSecurityFactoryPatched){
      return true;
    }

    const originalCreateClient=window.supabase.createClient.bind(window.supabase);

    window.supabase.createClient=function(){
      return patchClient(
        originalCreateClient.apply(null,arguments)
      );
    };

    window.supabase.__shoufhonFollowSecurityFactoryPatched=true;

    try{patchClient(window.__MA7ALAK_SHARED_SUPABASE_CLIENT__)}catch(_){}
    try{patchClient(window.Ma7alakAccount&&window.Ma7alakAccount.client)}catch(_){}
    try{patchClient(window.Ma7alakOwnerAuth&&window.Ma7alakOwnerAuth.client)}catch(_){}

    return true;
  }

  window.ShoufHonFollowSecurityBridge={
    visitorKey:VISITOR_KEY,
    tokenKey:TOKEN_KEY,
    getVisitorId,
    getToken,
    privateTopic,
    patchClient,
    install:installFactoryBridge
  };

  if(!installFactoryBridge()){
    let tries=0;
    const timer=setInterval(function(){
      tries++;
      if(installFactoryBridge()||tries>=600){
        clearInterval(timer);
      }
    },25);
  }
})();
