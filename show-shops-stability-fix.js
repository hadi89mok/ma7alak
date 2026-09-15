/* =========================================================
 MA7ALAK SHUF MA7ALET STABILITY FIX V1
 Load AFTER show-shops.js
 - fixes page starting too low
 - keeps filters from flickering/auto-closing during live refresh
 - stabilizes Story ring state instead of half-second loop
========================================================= */
(function(){
"use strict";if((location.pathname.replace(/\/+$/,"")||"/").toLowerCase()!=="/shwf-almhlat-")return;
if(window.__M7_SHOPS_STABILITY__)return;window.__M7_SHOPS_STABILITY__=true;
let state={area:"",category:"",openCategory:false},storyCache=new Map(),lockUntil=0;
function css(){let s=document.createElement("style");s.id="m7-shops-stability-css";s.textContent=`
body.ma7alak-header-page.ma7alak-shops-body{padding-top:var(--m7-header-h,76px)!important}
#ma7alak-shops-page{padding-top:8px!important;margin-top:0!important}
@media(max-width:700px){#ma7alak-shops-page{padding-top:4px!important}}
.ma7alak-shop-image-ring.m7-story-stable.ma7alak-has-story{visibility:visible!important;opacity:1!important}`;document.head.appendChild(s)}
function capture(e){let a=e.target.closest?.(".ma7alak-area-button"),c=e.target.closest?.(".ma7alak-category-button");if(a){state.area=(a.dataset.area||a.textContent||"").trim();state.openCategory=true;lockUntil=Date.now()+2500}if(c){state.category=(c.dataset.category||c.textContent||"").trim();state.openCategory=true;lockUntil=Date.now()+2500}}
function restore(){
 if(Date.now()>lockUntil)return;
 let sec=document.querySelector(".ma7alak-category-section");if(state.openCategory&&sec)sec.classList.add("visible");
 if(state.area)document.querySelectorAll(".ma7alak-area-button").forEach(b=>{if((b.dataset.area||b.textContent||"").trim()===state.area)b.classList.add("active")});
 if(state.category)document.querySelectorAll(".ma7alak-category-button").forEach(b=>{if((b.dataset.category||b.textContent||"").trim()===state.category)b.classList.add("active")});
}
function stabilizeStories(){
 document.querySelectorAll(".ma7alak-shop-image-ring").forEach(r=>{
  let card=r.closest("[data-shop-slug],.ma7alak-shop-card"),slug=card?.dataset?.shopSlug||card?.querySelector?.("[data-shop-slug]")?.dataset?.shopSlug||"";
  if(!slug)return;
  if(r.classList.contains("ma7alak-has-story"))storyCache.set(slug,Date.now()+5000);
  if((storyCache.get(slug)||0)>Date.now()){r.classList.add("ma7alak-has-story","m7-story-stable")}
 });
}
function boot(){css();document.addEventListener("pointerup",capture,true);let mo=new MutationObserver(()=>{restore();stabilizeStories()});mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});restore();stabilizeStories();scrollTo(0,0);requestAnimationFrame(()=>scrollTo(0,0))}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
