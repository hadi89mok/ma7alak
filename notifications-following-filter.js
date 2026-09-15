/* =========================================================
 MA7ALAK FOLLOWING-ONLY STORY/REEL NOTIFICATION FILTER V1
 Load AFTER notifications.js.
 It filters the existing notification rows to shops this visitor follows.
========================================================= */
(function(){
"use strict";if(window.__M7_FOLLOWING_NOTIF_FILTER__)return;window.__M7_FOLLOWING_NOTIF_FILTER__=true;
const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
let c=null,allowed=new Set();
function vid(){return localStorage.getItem("ma7alak_visitor_id")||""}
async function load(){if(!window.supabase?.createClient)return;c=c||window.supabase.createClient(URL,KEY);let id=vid();if(!id)return;let r=await c.from("shop_follows").select("shop_slug").eq("visitor_id",id);allowed=new Set((r.data||[]).map(x=>x.shop_slug));filter()}
function filter(){document.querySelectorAll("#ma7alak-notification-list [data-shop-slug],.ma7alak-notification-item").forEach(el=>{let slug=el.dataset.shopSlug||el.getAttribute("data-shop-slug")||"";if(slug&&!allowed.has(slug))el.style.display="none";else el.style.display=""})}
function boot(){load();new MutationObserver(filter).observe(document.body,{subtree:true,childList:true});addEventListener("ma7alak:follow-change",load);setInterval(load,5000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
