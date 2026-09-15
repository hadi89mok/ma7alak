    /* =========================================================
     MA7ALAK GLOBAL HOTFIX V1
     Load AFTER premium-social-header.js, show-shops.js and ma7alak-chat.js.
     Replaces the old show-shops-stability-fix.js.
    ========================================================= */
    (function(){
    "use strict";
    if(window.__MA7ALAK_GLOBAL_HOTFIX_V1__) return;
    window.__MA7ALAK_GLOBAL_HOTFIX_V1__=true;

    const SB_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
    const SB_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
    let sb=null;
    function client(){
      if(sb) return sb;
      if(window.Ma7alakAccount?.client) return (sb=window.Ma7alakAccount.client);
      if(window.Ma7alakOwnerAuth?.client) return (sb=window.Ma7alakOwnerAuth.client);
      if(window.supabase?.createClient) return (sb=window.supabase.createClient(SB_URL,SB_KEY));
      return null;
    }
    function visitorId(){
      let id="";
      try{id=localStorage.getItem("ma7alak_visitor_id")||"";}catch(_){}
      if(!id){
        id=(crypto?.randomUUID?.()||("visitor_"+Date.now()+"_"+Math.random().toString(36).slice(2)));
        try{localStorage.setItem("ma7alak_visitor_id",id);}catch(_){}
      }
      return id;
    }
    function css(){
      if(document.getElementById("m7-global-hotfix-css")) return;
      const s=document.createElement("style");
      s.id="m7-global-hotfix-css";
      s.textContent=`
      /* Following: clean right-side Unfollow action */
      #ma7alak-following-list .ma7alak-following-item{position:relative!important;padding-right:86px!important}
      #ma7alak-following-list .ma7alak-following-remove,#ma7alak-following-list [data-action="unfollow"]{position:absolute!important;right:10px!important;top:50%!important;transform:translateY(-50%)!important;min-width:68px!important;border:1px solid #ffffff1a!important;border-radius:999px!important;background:#ffffff0b!important;color:#ddd!important;font-size:10px!important;font-weight:800!important;padding:7px 9px!important}
      /* Shops page: never begin below a giant blank header gap */
      body.ma7alak-header-page.ma7alak-shops-body{padding-top:var(--m7-header-h,76px)!important}
      #ma7alak-shops-page{padding-top:8px!important;margin-top:0!important}
      @media(max-width:700px){#ma7alak-shops-page{padding-top:4px!important}}
      /* Keep story rings stable during live refresh */
      .ma7alak-shop-image-ring.m7-story-stable.ma7alak-has-story{visibility:visible!important;opacity:1!important}
      `;
      document.head.appendChild(s);
    }

    let shopState={area:"",category:"",openCategory:false},storyCache=new Map(),lockUntil=0;
    function captureShopState(e){
      const a=e.target.closest?.(".ma7alak-area-button"),c=e.target.closest?.(".ma7alak-category-button");
      if(a){shopState.area=(a.dataset.area||a.textContent||"").trim();shopState.openCategory=true;lockUntil=Date.now()+2500}
      if(c){shopState.category=(c.dataset.category||c.textContent||"").trim();shopState.openCategory=true;lockUntil=Date.now()+2500}
    }
    function restoreShopState(){
      if(Date.now()>lockUntil)return;
      const sec=document.querySelector(".ma7alak-category-section");if(shopState.openCategory&&sec)sec.classList.add("visible");
      if(shopState.area)document.querySelectorAll(".ma7alak-area-button").forEach(b=>{if((b.dataset.area||b.textContent||"").trim()===shopState.area)b.classList.add("active")});
      if(shopState.category)document.querySelectorAll(".ma7alak-category-button").forEach(b=>{if((b.dataset.category||b.textContent||"").trim()===shopState.category)b.classList.add("active")});
    }
    function stabilizeStories(){
      document.querySelectorAll(".ma7alak-shop-image-ring").forEach(r=>{
        const card=r.closest("[data-shop-slug],.ma7alak-shop-card"),slug=card?.dataset?.shopSlug||card?.querySelector?.("[data-shop-slug]")?.dataset?.shopSlug||"";
        if(!slug)return;
        if(r.classList.contains("ma7alak-has-story"))storyCache.set(slug,Date.now()+5000);
        if((storyCache.get(slug)||0)>Date.now())r.classList.add("ma7alak-has-story","m7-story-stable");
      });
    }
    async function unfollowFromFollowing(e){
      const btn=e.target.closest?.("#ma7alak-following-list .ma7alak-following-remove,#ma7alak-following-list [data-action='unfollow']");if(!btn)return;
      const row=btn.closest("[data-shop-slug],.ma7alak-following-item"),slug=String(row?.dataset?.shopSlug||btn.dataset.shopSlug||"");if(!slug)return;
      e.preventDefault();e.stopPropagation();
      const c=client();if(!c)return;
      btn.disabled=true;
      const r=await c.from("shop_follows").delete().eq("visitor_id",visitorId()).eq("shop_slug",slug);
      btn.disabled=false;
      if(r.error){console.warn(r.error);return}
      row?.remove();
      dispatchEvent(new CustomEvent("ma7alak:follow-change",{detail:{shop_slug:slug,following:false}}));
    }
    function bindMessageShortcuts(){
      document.addEventListener("click",e=>{
        const el=e.target.closest?.("[data-ma7alak-open-messages],[data-ma7alak-open-owner-messages]");if(!el)return;
        e.preventDefault();
        if(el.hasAttribute("data-ma7alak-open-owner-messages"))dispatchEvent(new Event("ma7alak:open-owner-messages"));
        else dispatchEvent(new Event("ma7alak:open-messages"));
      },true);
    }
    function boot(){
      css();
      document.addEventListener("pointerup",captureShopState,true);
      document.addEventListener("click",unfollowFromFollowing,true);
      bindMessageShortcuts();
      const mo=new MutationObserver(()=>{restoreShopState();stabilizeStories()});
      mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
      restoreShopState();stabilizeStories();
      const path=(location.pathname.replace(/\/+$/,"")||"/").toLowerCase();
      if(path==="/shwf-almhlat-"){scrollTo(0,0);requestAnimationFrame(()=>scrollTo(0,0))}
    }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
    })();
