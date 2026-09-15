/* =========================================================
 MA7ALAK FOLLOWING NOTIFICATION FILTER V3 — PERFORMANCE SAFE
 - No broad MutationObserver
 - Shows Story/Reel activity only if created AFTER visitor followed shop
 - Owner never sees own Story/Reel rows
 - Recalculates visible badge after filtering
========================================================= */
(function(){
"use strict";
if(window.__M7_FOLLOW_FILTER_V3__)return;window.__M7_FOLLOW_FILTER_V3__=true;
const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
let c=null,running=false;
function client(){return c||(c=window.Ma7alakAccount?.client||window.Ma7alakOwnerAuth?.client||(window.supabase?.createClient?window.supabase.createClient(URL,KEY):null))}
function visitor(){try{return localStorage.getItem("ma7alak_visitor_id")||""}catch(_){return""}}
function ownerSlug(){return String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim()}
async function sync(){if(running)return;const sb=client(),vid=visitor(),list=document.getElementById("ma7alak-notification-list");if(!sb||!vid||!list)return;running=true;try{const f=await sb.from("shop_follows").select("shop_slug,created_at").eq("visitor_id",vid);if(f.error)return;const followed=new Map((f.data||[]).map(x=>[String(x.shop_slug),new Date(x.created_at||0).getTime()]));const rows=[...list.querySelectorAll(".ma7alak-notification-item")],storyIds=[],reelIds=[];rows.forEach(r=>{const id=String(r.dataset.notificationId||"");if(r.dataset.notificationType==="reel")reelIds.push(id);else if(id)storyIds.push(Number(id))});const times=new Map();if(storyIds.length){const q=await sb.from("shop_stories").select("id,created_at").in("id",storyIds.filter(Number.isFinite));if(!q.error)(q.data||[]).forEach(x=>times.set("story:"+x.id,new Date(x.created_at||0).getTime()))}if(reelIds.length){const q=await sb.from("shop_reels").select("reel_id,created_at").in("reel_id",reelIds);if(!q.error)(q.data||[]).forEach(x=>times.set("reel:"+x.reel_id,new Date(x.created_at||0).getTime()))}const own=ownerSlug();rows.forEach(r=>{const slug=String(r.dataset.shopSlug||""),type=String(r.dataset.notificationType||"story"),id=String(r.dataset.notificationId||""),followedAt=followed.get(slug),created=times.get(type+":"+id)||0;const visible=!!followedAt&&slug!==own&&created>followedAt;r.style.display=visible?"":"none";r.dataset.m7FollowVisible=visible?"1":"0"});const visible=rows.filter(r=>r.dataset.m7FollowVisible==="1"),unread=visible.filter(r=>r.classList.contains("highlighted")).length,b=document.getElementById("ma7alak-notification-badge");if(b){b.textContent=unread>99?"99+":unread?String(unread):"";b.classList.toggle("visible",unread>0)}if(!visible.length){const prev=list.querySelector(".m7-follow-filter-empty");if(!prev){const e=document.createElement("div");e.className="m7-follow-filter-empty";e.style.cssText="padding:28px;text-align:center;color:#999";e.textContent="No new notifications from shops you follow.";list.appendChild(e)}}else list.querySelector(".m7-follow-filter-empty")?.remove()}catch(e){console.warn("MA7ALAK follow notification filter:",e)}finally{running=false}}
function schedule(){[0,120,450,1200].forEach(ms=>setTimeout(sync,ms))}
document.addEventListener("click",e=>{if(e.target.closest?.("#ma7alak-notification-bell,#ma7alak-see-previous"))schedule()},true);
window.addEventListener("message",e=>{if(e.data?.type==="MA7ALAK_FOLLOW_CHANGED"||e.data?.type==="MA7ALAK_FOLLOW_STATE_CHANGED")schedule()});
window.addEventListener("ma7alak:follow-change",schedule);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(schedule,700),{once:true});else setTimeout(schedule,700);
})();