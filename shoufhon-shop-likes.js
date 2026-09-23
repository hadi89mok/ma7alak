/* =========================================================
   SHOUFHON SHOP LIKES V1
   - one permanent like per browser visitor and shop
   - signed-in identity is attached by the server
   - five-minute click cooldown
   - mounts inside the existing profile statistics row
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_SHOP_LIKES_V1__)return;
  window.__SHOUFHON_SHOP_LIKES_V1__=true;

  const COOLDOWN_SECONDS=300;
  const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 5.9l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.3 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  let client=null;
  let slug="";
  let busy=false;
  let state={liked:false,like_count:0,cooldown_seconds:0};
  let cooldownTimer=0;

  function visitorId(){
    const key="ma7alak_visitor_id";
    let value="";
    try{value=localStorage.getItem(key)||""}catch(_){}
    if(!value){
      value=crypto?.randomUUID?.()||("v_"+Date.now()+"_"+Math.random().toString(36).slice(2));
      try{localStorage.setItem(key,value)}catch(_){}
    }
    return value;
  }

  function cooldownKey(){return "m7_shop_like_cooldown_"+slug}
  function storedCooldown(){
    try{return Math.max(0,Math.ceil((Number(localStorage.getItem(cooldownKey())||0)-Date.now())/1000))}catch(_){return 0}
  }
  function saveCooldown(seconds){
    const until=Date.now()+Math.max(0,Number(seconds)||0)*1000;
    try{localStorage.setItem(cooldownKey(),String(until))}catch(_){}
  }

  async function getClient(){
    if(client)return client;
    try{if(window.Ma7alakSupabaseBootstrap?.ready)client=await window.Ma7alakSupabaseBootstrap.ready()}catch(_){}
    client=client||window.Ma7alakOwnerAuth?.client||window.Ma7alakAccount?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null;
    try{client=client||window.parent?.Ma7alakAccount?.client||window.parent?.Ma7alakOwnerAuth?.client||window.parent?.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null}catch(_){}
    if(!client&&window.supabase?.createClient){
      client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    }
    return client;
  }

  function bridgeRpc(operation){
    if(!window.parent||window.parent===window)return Promise.reject(new Error("NO_PARENT_BRIDGE"));
    const requestId="m7like_"+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{window.removeEventListener("message",onMessage);reject(new Error("LIKE_BRIDGE_TIMEOUT"))},1400);
      function onMessage(event){
        const data=event?.data||{};
        if(data.type!=="MA7ALAK_SHOP_LIKE_RPC_RESULT"||data.requestId!==requestId)return;
        clearTimeout(timer);window.removeEventListener("message",onMessage);
        if(data.error)reject(new Error(data.error));else resolve(data.data);
      }
      window.addEventListener("message",onMessage);
      window.parent.postMessage({type:"MA7ALAK_SHOP_LIKE_RPC",requestId,operation,shopSlug:slug,visitorId:visitorId()},"*");
    });
  }

  async function rpc(operation){
    try{return {data:await bridgeRpc(operation),error:null}}catch(_){}
    const c=await getClient();
    if(!c)return {data:null,error:new Error("Could not connect")};
    return c.rpc(operation==="like"?"like_shop":"get_shop_like_state",{p_shop_slug:slug,p_visitor_id:visitorId()});
  }

  async function getSlug(){
    if(slug)return slug;
    const explicit=[
      window.__MA7ALAK_EXACT_HUB_SLUG__,
      document.getElementById("ma7alak-profile-shell")?.getAttribute("data-shop-slug"),
      document.getElementById("ma7alak-story-wrapper")?.getAttribute("data-shop-slug"),
      document.getElementById("ma7alak-shop-profile-hub-mount")?.getAttribute("data-shop-slug")
    ].find(Boolean);
    slug=String(explicit||"").trim().toLowerCase();
    if(!slug&&window.ShoufHonShopContextClient){
      try{
        slug=String(await window.ShoufHonShopContextClient.resolve({
          explicit:"",
          fallback:()=>window.ShoufHonShopContextClient.detectPageSlug(),
          timeout:1200
        })||"").trim().toLowerCase();
      }catch(_){}
    }
    if(!slug){
      const parts=decodeURIComponent(location.pathname||"").replace(/^\/+|\/+$/g,"").split("/").filter(Boolean);
      slug=String(parts[parts.length-1]||"").trim().toLowerCase();
    }
    return slug;
  }

  function ownerOwnsShop(){
    return String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim().toLowerCase()===slug;
  }

  function ensureStyle(){
    if(document.getElementById("m7-shop-like-style"))return;
    const style=document.createElement("style");
    style.id="m7-shop-like-style";
    style.textContent=`
      #ma7alak-follow-embed .m7-shop-like-stat{appearance:none;-webkit-appearance:none;min-width:0;margin:0;padding:7px 8px;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;position:relative;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:3px;-webkit-tap-highlight-color:transparent;transition:transform .16s ease,background .16s ease}
      #ma7alak-follow-embed .m7-shop-like-stat::before{content:"";position:absolute;left:0;top:18%;bottom:18%;width:1px;background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--m7-profile-stats-border,#d9a441) 58%,transparent),transparent)}
      #ma7alak-follow-embed .m7-shop-like-stat:hover{background:rgba(255,255,255,.025)}
      #ma7alak-follow-embed .m7-shop-like-stat:active{transform:scale(.94)}
      #ma7alak-follow-embed .m7-shop-like-stat.is-disabled{cursor:default;opacity:.92;pointer-events:none}
      #ma7alak-follow-embed .m7-shop-like-top{display:flex;align-items:center;justify-content:center;gap:5px}
      #ma7alak-follow-embed .m7-shop-like-heart{width:17px;height:17px;display:block;color:rgba(255,255,255,.60);filter:drop-shadow(0 2px 5px rgba(0,0,0,.38));transition:color .18s ease,transform .22s cubic-bezier(.2,.9,.25,1.3),filter .18s ease}
      #ma7alak-follow-embed .m7-shop-like-heart svg{width:100%;height:100%;display:block;fill:transparent;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      #ma7alak-follow-embed .m7-shop-like-stat.is-liked .m7-shop-like-heart{color:#ff557a;filter:drop-shadow(0 0 8px rgba(255,85,122,.45))}
      #ma7alak-follow-embed .m7-shop-like-stat.is-liked .m7-shop-like-heart svg{fill:currentColor}
      #ma7alak-follow-embed .m7-shop-like-stat.is-pop .m7-shop-like-heart{animation:m7ShopHeartPop .52s cubic-bezier(.2,.9,.25,1.3)}
      #ma7alak-follow-embed .m7-shop-like-stat .m7-shop-like-count{font:900 17px/1 Arial,"Segoe UI",sans-serif;color:var(--m7-profile-stats-number,#fff)}
      #ma7alak-follow-embed .m7-shop-like-stat .m7-shop-like-label{font:800 9px/1.1 Arial,"Segoe UI",sans-serif;letter-spacing:.3px;color:var(--m7-profile-stats-label,rgba(255,255,255,.58))}
      #m7-shop-like-toast{position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom));z-index:2147483647;max-width:calc(100vw - 32px);transform:translate(-50%,16px);padding:10px 14px;border:1px solid rgba(217,164,65,.32);border-radius:999px;background:rgba(13,11,10,.96);box-shadow:0 14px 35px rgba(0,0,0,.42);color:#fff;font:750 12px/1.25 Arial,"Segoe UI",sans-serif;text-align:center;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}
      #m7-shop-like-toast.show{opacity:1;transform:translate(-50%,0)}
      @keyframes m7ShopHeartPop{0%{transform:scale(.72)}45%{transform:scale(1.38) rotate(-8deg)}72%{transform:scale(.94) rotate(3deg)}100%{transform:scale(1)}}
      @media(max-width:430px){#ma7alak-follow-embed .m7-shop-like-stat{padding-left:5px;padding-right:5px}#ma7alak-follow-embed .m7-shop-like-stat .m7-shop-like-count{font-size:16px}}
      @media(prefers-reduced-motion:reduce){#ma7alak-follow-embed .m7-shop-like-stat,#ma7alak-follow-embed .m7-shop-like-heart,#m7-shop-like-toast{transition:none!important}#ma7alak-follow-embed .m7-shop-like-stat.is-pop .m7-shop-like-heart{animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function toast(message){
    let el=document.getElementById("m7-shop-like-toast");
    if(!el){el=document.createElement("div");el.id="m7-shop-like-toast";el.setAttribute("role","status");el.setAttribute("aria-live","polite");document.body.appendChild(el)}
    el.textContent=message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>el.classList.remove("show"),2100);
  }

  function mount(){
    const stats=document.querySelector("#ma7alak-follow-embed .ma7alak-profile-stats")||document.querySelector("#ma7alak-profile-shell .ma7alak-profile-stats");
    if(!stats)return false;
    let button=document.getElementById("m7-shop-like-button")||stats.querySelector(".ma7alak-like-stat");
    if(!button)return false;
    if(!button.id){
      button.id="m7-shop-like-button";
      button.classList.add("m7-shop-like-stat");
      button.setAttribute("role","button");
      button.setAttribute("tabindex","0");
      button.innerHTML='<span class="m7-shop-like-top"><i class="m7-shop-like-heart">'+HEART+'</i><strong class="ma7alak-like-count m7-shop-like-count">0</strong></span><span class="m7-shop-like-label">Likes</span>';
      button.addEventListener("click",likeShop);
      button.addEventListener("keydown",event=>{
        if(event.key!=="Enter"&&event.key!==" ")return;
        event.preventDefault();
        likeShop();
      });
    }
    paint();
    return true;
  }

  function paint(){
    const button=document.getElementById("m7-shop-like-button");
    if(!button)return;
    const count=button.querySelector(".m7-shop-like-count");
    if(count)count.textContent=String(Math.max(0,Number(state.like_count)||0));
    button.classList.toggle("is-liked",!!state.liked);
    button.setAttribute("aria-pressed",String(!!state.liked));
    button.setAttribute("aria-label",state.liked?"You liked this shop":"Like this shop");
    button.title=ownerOwnsShop()?"This is your shop":state.liked?"You liked this shop":"Like this shop";
    const disabled=busy||ownerOwnsShop();
    button.classList.toggle("is-disabled",disabled);
    button.setAttribute("aria-disabled",String(disabled));
    button.tabIndex=disabled?-1:0;
  }

  function normalize(data){
    const row=Array.isArray(data)?data[0]:(data||{});
    return {
      liked:row.liked===true||row.already_liked===true,
      like_count:Math.max(0,Number(row.like_count??row.count??0)||0),
      cooldown_seconds:Math.max(0,Number(row.cooldown_seconds||0)||0),
      blocked:row.blocked===true,
      message:String(row.message||"")
    };
  }

  async function loadState(){
    if(!slug)return;
    const result=await rpc("state");
    if(result.error){console.warn("[ShoufHon shop likes]",result.error);return}
    state=normalize(result.data);
    mount();
  }

  async function likeShop(){
    if(busy)return;
    if(ownerOwnsShop()){toast("This is your shop");return}
    if(state.liked){toast("You already liked this shop");return}
    const remaining=Math.max(storedCooldown(),Number(state.cooldown_seconds)||0);
    if(remaining>0){toast("Please wait "+Math.ceil(remaining/60)+" minute"+(remaining>60?"s":""));return}
    busy=true;paint();
    try{
      const result=await rpc("like");
      if(result.error)throw result.error;
      const next=normalize(result.data);
      if(next.blocked){toast(next.message||"You cannot like your own shop");return}
      state=next;
      saveCooldown(next.cooldown_seconds||COOLDOWN_SECONDS);
      paint();
      const button=document.getElementById("m7-shop-like-button");
      button?.classList.add("is-pop");
      setTimeout(()=>button?.classList.remove("is-pop"),600);
      toast(next.message||"Shop liked ♥");
      const detail={shopSlug:slug,shop_slug:slug,likeCount:state.like_count,like_count:state.like_count,count:state.like_count};
      window.dispatchEvent(new CustomEvent("ma7alak:shop-like-count",{detail}));
      window.dispatchEvent(new CustomEvent("ma7alak:shop-likes-changed",{detail}));
      try{
        if(window.parent&&window.parent!==window){
          window.parent.dispatchEvent(new CustomEvent("ma7alak:shop-like-count",{detail}));
          window.parent.dispatchEvent(new CustomEvent("ma7alak:shop-likes-changed",{detail}));
          window.parent.postMessage({type:"MA7ALAK_SHOP_LIKES_CHANGED",...detail},"*");
        }
      }catch(_){}
    }catch(error){
      console.warn("[ShoufHon shop likes]",error);
      toast("Could not like this shop. Try again.");
    }finally{busy=false;paint()}
  }

  function watchMount(){
    if(mount())return;
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),30000);
  }

  async function start(){
    ensureStyle();
    await getSlug();
    if(!slug)return;
    watchMount();
    await loadState();
    window.addEventListener("ma7alak:owner-auth-change",()=>{paint();loadState()});
    window.addEventListener("ma7alak:account-change",()=>loadState());

    let wakeAt=0;
    const refreshOnWake=()=>{
      const now=Date.now();
      if(document.hidden||now-wakeAt<900)return;
      wakeAt=now;
      loadState();
    };

    window.addEventListener("ma7alak:page-wake",refreshOnWake);
    window.addEventListener("message",event=>{
      if(event.data?.type==="MA7ALAK_PAGE_WAKE")refreshOnWake();
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
