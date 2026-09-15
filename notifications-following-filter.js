    /* =========================================================
     MA7ALAK FOLLOWING-ONLY NOTIFICATION FILTER V2
     FULL REPLACEMENT: notifications-following-filter.js
     - Story/Reel rows only for followed shops
     - Owner never sees notifications for own Story/Reel uploads
     - Badge is recalculated from ACTUALLY VISIBLE notifications
     - Empty panel is corrected after filtering
    ========================================================= */
    (function(){
    "use strict";
    if(window.__M7_FOLLOWING_NOTIF_FILTER_V2__)return;
    window.__M7_FOLLOWING_NOTIF_FILTER_V2__=true;
    const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
    let c=null,allowed=new Set(),busy=false;
    function vid(){try{return localStorage.getItem("ma7alak_visitor_id")||""}catch(_){return""}}
    function ownerSlug(){return String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"")}
    function client(){return c||(c=window.Ma7alakAccount?.client||window.Ma7alakOwnerAuth?.client||(window.supabase?.createClient?window.supabase.createClient(URL,KEY):null))}
    async function load(){
      if(busy)return;busy=true;
      try{
        const cl=client(),id=vid();if(!cl||!id)return;
        const r=await cl.from("shop_follows").select("shop_slug").eq("visitor_id",id);
        if(!r.error)allowed=new Set((r.data||[]).map(x=>String(x.shop_slug||"")));
        filter();
      }finally{busy=false}
    }
    function filter(){
      const list=document.getElementById("ma7alak-notification-list");if(!list)return;
      const own=ownerSlug();let visible=0,unread=0;
      list.querySelectorAll(".ma7alak-notification-item").forEach(el=>{
        const slug=String(el.dataset.shopSlug||el.getAttribute("data-shop-slug")||"");
        const type=String(el.dataset.notificationType||el.getAttribute("data-notification-type")||"");
        const social=(type==="story"||type==="reel");
        const show=!social || (!!slug&&allowed.has(slug)&&(!own||slug!==own));
        el.style.display=show?"":"none";
        if(show){visible++;if(el.classList.contains("unread")||el.dataset.read==="false"||el.getAttribute("data-read")==="false")unread++}
      });
      const empty=list.querySelector(".ma7alak-notification-empty,.ma7alak-empty-notifications");if(empty)empty.style.display=visible?"none":"";
      const badge=document.getElementById("ma7alak-notification-badge");if(badge){badge.textContent=unread>99?"99+":String(unread);badge.style.display=unread?"":"none"}
    }
    function boot(){
      load();
      new MutationObserver(()=>filter()).observe(document.body,{subtree:true,childList:true});
      addEventListener("ma7alak:follow-change",load);
      addEventListener("ma7alak:owner-ready",()=>{load();filter()});
      setInterval(load,4000);
    }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
    })();
