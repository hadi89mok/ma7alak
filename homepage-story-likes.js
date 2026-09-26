/* =========================================================
 SHOUFHON OWNER SOCIAL HEART V8
 - owner-only activity heart
 - live Realtime + adaptive recovery fallback refresh
 - signed follower/story/shop-like identity + circular avatar enrichment
 - shop-owner follows show the follower shop identity and open that shop
 - anonymous activity says Someone, never Guest
 - Just now / live relative timestamps
 - never shows owner's own activity
========================================================= */
(function(){
"use strict";
if(window.__M7_OWNER_SOCIAL_V8__)return;window.__M7_OWNER_SOCIAL_V8__=true;
let c=null,owner=null,rows=[],ch=null,loading=false,poll=null,lastSig="",clock=null,realtimeHealthy=false;
let heartHoldTimer=null,heartHoldX=0,heartHoldY=0,suppressHeartClickUntil=0;
const esc=v=>String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const heartSVG=`<svg viewBox="0 0 24 24" width="25" height="25" fill="none" aria-hidden="true"><path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 5.9l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.3 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const actorUserId=x=>String(x?.actor_user_id||x?.user_id||x?.viewer_user_id||x?.liked_by_user_id||x?.follower_user_id||x?.actor_id||"").trim();
async function shopLikeBridgeClient(){
  try{await window.Ma7alakAccount?.ready?.()}catch(_){}
  let bridgeClient=window.Ma7alakAccount?.client||window.Ma7alakOwnerAuth?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null;
  if(!bridgeClient&&window.Ma7alakSupabaseBootstrap?.ready){try{bridgeClient=await window.Ma7alakSupabaseBootstrap.ready()}catch(_){}}
  return bridgeClient;
}
function installShopLikeBridge(){
  if(window.__M7_SHOP_LIKE_BRIDGE__)return;window.__M7_SHOP_LIKE_BRIDGE__=true;
  window.addEventListener("message",async event=>{
    const data=event?.data||{};
    if(data.type!=="MA7ALAK_SHOP_LIKE_RPC")return;
    const requestId=String(data.requestId||"");
    const operation=data.operation==="like"?"like_shop":data.operation==="state"?"get_shop_like_state":"";
    const shopSlug=String(data.shopSlug||"").trim().toLowerCase();
    const visitorId=String(data.visitorId||"").trim();
    if(!/^[a-z0-9_-]{8,100}$/i.test(requestId)||!operation||shopSlug.length<1||shopSlug.length>160||visitorId.length<8||visitorId.length>160)return;
    let payload={type:"MA7ALAK_SHOP_LIKE_RPC_RESULT",requestId,data:null,error:"Could not connect"};
    try{
      const bridgeClient=await shopLikeBridgeClient();
      if(!bridgeClient)throw new Error("Could not connect");
      const result=await bridgeClient.rpc(operation,{p_shop_slug:shopSlug,p_visitor_id:visitorId});
      if(result.error)throw result.error;
      payload={type:"MA7ALAK_SHOP_LIKE_RPC_RESULT",requestId,data:result.data,error:""};
    }catch(error){payload.error=String(error?.message||"Could not update shop like")}
    try{event.source?.postMessage(payload,"*")}catch(_){}
  });
}
function relativeTime(value){const t=new Date(value).getTime();if(!Number.isFinite(t))return"Just now";const sec=Math.max(0,Math.floor((Date.now()-t)/1000));if(sec<45)return"Just now";const min=Math.floor(sec/60);if(min<60)return min+"m ago";const hr=Math.floor(min/60);if(hr<24)return hr+"h ago";const day=Math.floor(hr/24);if(day<7)return day+"d ago";return new Date(t).toLocaleDateString()}
function safeName(x){const raw=String(x?.actor_name||"").trim();if(!raw||/^(guest|anonymous|visitor|null|undefined)$/i.test(raw))return"Someone";return raw}
async function ready(){for(let i=0;i<120&&!window.Ma7alakOwnerAuth;i++)await new Promise(r=>setTimeout(r,75));await window.Ma7alakOwnerAuth?.ready?.();owner=window.Ma7alakOwnerAuth?.owner;if(!owner)return;c=window.Ma7alakOwnerAuth.client;mount();await load(true);subscribe();startFallback();startClock()}
function mount(){
  document.getElementById("ma7alak-story-likes-wrapper")?.remove();
  document.getElementById("m7-owner-heart-v5-css")?.remove();
  document.getElementById("m7-owner-heart-v6-css")?.remove();
  document.getElementById("m7-owner-heart-v8-css")?.remove();

  const s=document.createElement("style");
  s.id="m7-owner-heart-v8-css";
  s.textContent=`
#ma7alak-story-likes-wrapper{position:fixed;top:max(18px,env(safe-area-inset-top));right:78px;z-index:2147483646;font-family:Arial,"Segoe UI",sans-serif}
#ma7alak-story-likes-button{width:48px;height:48px;padding:0;display:grid;place-items:center;border-radius:50%;border:1px solid #d9a44155;background:#121212e8;color:#fff;cursor:pointer;position:relative;-webkit-tap-highlight-color:transparent}
#ma7alak-story-likes-button svg{display:block;width:25px;height:25px}
#m7-heart-badge{position:absolute;right:-4px;top:-4px;background:#e53935;border:2px solid #111;border-radius:20px;min-width:19px;height:19px;padding:0 4px;color:#fff;font:900 10px Arial;display:none;place-items:center}
#m7-owner-social-panel{display:none;position:fixed;right:18px;top:76px;width:min(390px,calc(100vw - 28px));max-height:min(620px,calc(100dvh - 90px));overflow:hidden;background:#0d0d0df8;border:1px solid #d9a44144;border-radius:20px;box-shadow:0 25px 80px #000a;color:#fff}
#m7-owner-social-panel.open{display:flex;flex-direction:column}
#m7sn-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px 9px 16px;border-bottom:1px solid #ffffff0f}
#m7sn-head>b{font-size:17px}
#m7sn-head-actions{display:flex;align-items:center;gap:7px}
#m7sn-mark-all{min-height:32px;padding:0 10px;border:1px solid #d9a44140;border-radius:999px;background:#d9a44112;color:#e8c77e;font:900 9px Arial;white-space:nowrap}
#m7sn-mark-all:disabled{opacity:.4;pointer-events:none}
#m7sn-close{width:34px;height:34px;padding:0;display:grid;place-items:center;border:1px solid #ffffff16;border-radius:50%;background:#ffffff0b;color:#ddd;font:400 20px/1 Arial;cursor:pointer}
#m7sn-list{padding:8px;overflow-y:auto;overflow-x:hidden;max-height:min(420px,calc(100dvh - 170px));min-height:0;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#d9a44155 transparent}
#m7sn-list::-webkit-scrollbar{width:5px}
#m7sn-list::-webkit-scrollbar-track{background:transparent}
#m7sn-list::-webkit-scrollbar-thumb{background:#d9a44155;border-radius:20px}
.m7sn{display:flex;align-items:center;gap:11px;padding:11px;border-radius:14px;outline:0;border:1px solid transparent;position:relative;transition:background .16s ease,transform .16s ease,border-color .16s ease}
.m7sn+.m7sn{margin-top:3px}
.m7sn.follow{cursor:pointer}
.m7sn.follow:hover,.m7sn.follow:focus-visible{background:#ffffff0b;border-color:#d9a44130}
.m7sn.follow:active,.m7sn.hold-active{transform:scale(.985);background:#ffffff0b}
.m7sn-action.comment{background:#24364b;color:#d8ebff}
.m7sn-preview{display:block;margin-top:5px;overflow:hidden;color:#aaa;font-size:10px;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}
.m7sn.new{background:linear-gradient(90deg,#d9a44112,#ff2d550d);border-color:#d9a4411f}
.m7sn-avatar-wrap{position:relative;width:44px;height:44px;flex:0 0 44px}
.m7sn-avatar-wrap>img,.m7sn-avatar-wrap>.av{width:44px;height:44px;border-radius:50%;object-fit:cover;background:#29221e;display:grid;place-items:center}
.m7sn-action{position:absolute;right:-5px;bottom:-4px;min-width:20px;height:20px;padding:0 4px;display:grid;place-items:center;border:2px solid #0d0d0d;border-radius:999px;background:#2a2118;color:#efc66e;font:900 11px/1 Arial;box-sizing:border-box}
.m7sn-action.like{background:#8c2435;color:#fff}
.m7sn-copy{min-width:0;flex:1;line-height:1.25}
.m7sn-copy b{font-size:14px}
.m7sn-count{color:#efc66e;font-weight:900;white-space:nowrap}
.m7sn-copy small{display:block;color:#888;margin-top:4px;font-size:11px}
.m7sn-empty{padding:28px;text-align:center;color:#999}
#m7sn-action-sheet{position:fixed;inset:0;z-index:2147483647;display:none;align-items:flex-end;justify-content:center;padding:14px max(12px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:#0009;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
#m7sn-action-sheet.open{display:flex}
#m7sn-action-card{width:min(100%,430px);padding:10px;border:1px solid #ffffff18;border-radius:22px;background:#111;box-shadow:0 24px 70px #000b}
#m7sn-action-title{padding:8px 10px 10px;color:#aaa;font-size:10px;font-weight:800}
.m7sn-sheet-btn{width:100%;min-height:48px;margin:3px 0;padding:0 14px;border:0;border-radius:14px;background:#191919;color:#fff;font-size:12px;font-weight:900;text-align:left}
.m7sn-sheet-btn.delete{background:#7b252533;color:#ff9292}
.m7sn-sheet-btn.cancel{margin-top:8px;text-align:center;color:#bbb}
@media(max-width:520px){#m7-owner-social-panel{right:8px;width:calc(100vw - 16px)}#m7sn-head{padding-left:13px}#m7sn-mark-all{padding:0 8px;font-size:8px}}
`;
  document.head.appendChild(s);

  const w=document.createElement("div");
  w.id="ma7alak-story-likes-wrapper";
  w.innerHTML=`<button id="ma7alak-story-likes-button" type="button" aria-label="Shop activity">${heartSVG}<span id="m7-heart-badge">0</span></button><div id="m7-owner-social-panel" aria-hidden="true"><div id="m7sn-head"><b>Activity</b><div id="m7sn-head-actions"><button id="m7sn-mark-all" type="button">Mark all read</button><button id="m7sn-close" type="button" aria-label="Close">×</button></div></div><div id="m7sn-list"><div class="m7sn-empty">Loading…</div></div></div><div id="m7sn-action-sheet" aria-hidden="true"><div id="m7sn-action-card"></div></div>`;
  document.body.appendChild(w);

  const panel=document.getElementById("m7-owner-social-panel");
  const list=document.getElementById("m7sn-list");
  const actionSheet=document.getElementById("m7sn-action-sheet");

  document.getElementById("ma7alak-story-likes-button").onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("ma7alak:panel-open",{detail:{panel:"heart"}}));
    const open=!panel.classList.contains("open");
    panel.classList.toggle("open",open);
    panel.setAttribute("aria-hidden",String(!open));
    if(open){
      load(true);
      render();
    }
  };

  document.getElementById("m7sn-close").onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden","true");
  };

  document.getElementById("m7sn-mark-all").onclick=async e=>{
    e.preventDefault();
    e.stopPropagation();
    const button=e.currentTarget;
    button.disabled=true;
    button.textContent="Marking…";
    try{
      await markSeen();
      button.textContent="All read";
      setTimeout(()=>{button.textContent="Mark all read"},850);
    }finally{
      button.disabled=false;
    }
  };

  actionSheet.onclick=e=>{
    if(e.target===actionSheet||e.target.closest("[data-m7sn-cancel]")){
      closeHeartActionSheet();
    }
  };

  const cancelHold=row=>{
    if(heartHoldTimer){
      clearTimeout(heartHoldTimer);
      heartHoldTimer=null;
    }
    row?.classList.remove("hold-active");
  };

  list.addEventListener("pointerdown",e=>{
    const row=e.target.closest(".m7sn[data-m7-notification-ids]");
    if(!row)return;
    if(e.pointerType==="mouse"&&e.button!==0)return;

    cancelHold(row);
    heartHoldX=Number(e.clientX||0);
    heartHoldY=Number(e.clientY||0);
    row.classList.add("hold-active");

    heartHoldTimer=setTimeout(()=>{
      heartHoldTimer=null;
      suppressHeartClickUntil=Date.now()+650;
      openHeartActionSheet(row);
      try{navigator.vibrate?.(18)}catch(_){}
    },520);
  });

  list.addEventListener("pointermove",e=>{
    if(!heartHoldTimer)return;
    const dx=Number(e.clientX||0)-heartHoldX;
    const dy=Number(e.clientY||0)-heartHoldY;
    if(Math.hypot(dx,dy)>10){
      cancelHold(e.target.closest(".m7sn"));
    }
  });

  ["pointerup","pointercancel","pointerleave"].forEach(type=>{
    list.addEventListener(type,e=>cancelHold(e.target.closest(".m7sn")));
  });

  const openRow=e=>{
    const row=e.target.closest?.("[data-m7-shop-target]");
    if(!row)return;

    if(Date.now()<suppressHeartClickUntil){
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const target=String(row.dataset.m7ShopTarget||"").trim();
    if(!target)return;

    e.preventDefault();
    e.stopPropagation();

    const ids=parseHeartIds(row.dataset.m7NotificationIds);
    markOwnerRows(ids,true).catch(()=>{});

    rows=rows.map(x=>ids.includes(String(x.id))?{...x,seen:true}:x);
    render();

    try{window.top.location.href=target}
    catch(_){window.location.href=target}
  };

  list.onclick=openRow;
  list.onkeydown=e=>{
    if(e.key==="Enter"||e.key===" "){
      openRow(e);
    }
  };
}
function actorKey(x){return actorUserId(x)||String(x.actor_visitor_id||x.visitor_id||x.actor_name||x.actor_avatar||"anonymous")}
function isStoryLike(x){return x?.type==="like"||x?.type==="story_like"}
function followShopTarget(x){if(x?.type!=="follow")return"";const marker=String(x?.actor_username||"").trim();if(!marker.toLowerCase().startsWith("shop:"))return"";let raw=marker.slice(5).trim();if(!raw)return"";if(/^https?:\/\//i.test(raw))return raw;if(raw.startsWith("/"))return location.origin+raw;if(/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(raw))return"https://"+raw;return location.origin+"/"+raw.replace(/^\/+/, "")}
function mediaActivityTarget(x){const type=String(x?.media_type||"").trim(),id=String(x?.media_id||"").trim(),slug=String(x?.shop_slug||owner?.shop_slug||"").trim();if(!slug||!id||!["photo","video"].includes(type))return"";const url=new URL("/"+encodeURIComponent(slug),location.origin);url.searchParams.set("media",type+":"+id);if(x?.comment_id){url.searchParams.set("comments","1");url.searchParams.set("comment",String(x.comment_id))}return url.href}
function storyActivityTarget(x){const slug=String(x?.shop_slug||owner?.shop_slug||"").trim(),storyId=String(x?.story_id||"").trim();if(!slug||!storyId||!isStoryLike(x))return"";const url=new URL("/"+encodeURIComponent(slug),location.origin);url.searchParams.set("story",storyId);url.searchParams.set("shop",slug);return url.href}
function cleanRows(input){const seen=new Set(),out=[];for(const x of input||[]){const key=(x.type||"")+"|"+actorKey(x)+"|"+String(x.story_id||x.content_id||"");if(x.type==="follow"&&seen.has(key))continue;seen.add(key);out.push(x)}return out}
function groupRows(input){const out=[];const HOUR=60*60*1000;const groupable=x=>isStoryLike(x)||x?.type==="media_like";for(const row of input||[]){const rowId=String(row?.id||"");if(!groupable(row)){out.push({...row,_groupCount:1,_groupIds:rowId?[rowId]:[]});continue}const who=actorKey(row),time=Date.parse(row.created_at||"")||0;let match=null;for(const existing of out){if(!groupable(existing)||existing.type!==row.type||actorKey(existing)!==who)continue;const existingTime=Date.parse(existing.created_at||"")||0;if(Math.abs(existingTime-time)<=HOUR){match=existing;break}}if(!match){out.push({...row,_groupCount:1,_groupIds:rowId?[rowId]:[]});continue}const ids=new Set([...(match._groupIds||[]),...(rowId?[rowId]:[])]);const combinedSeen=!!match.seen&&!!row.seen;match._groupCount=(match._groupCount||1)+1;match._groupIds=[...ids];const currentTime=Date.parse(match.created_at||"")||0;if(time>currentTime){Object.assign(match,row,{_groupCount:match._groupCount,_groupIds:match._groupIds,seen:combinedSeen})}else{match.seen=combinedSeen}}return out}
function render(){
  const b=document.getElementById("m7-heart-badge");
  const list=document.getElementById("m7sn-list");
  const markAll=document.getElementById("m7sn-mark-all");
  if(!b||!list)return;

  const clean=cleanRows(rows);
  const displayRows=groupRows(clean);
  const n=displayRows.filter(x=>!x.seen).length;

  b.textContent=n>99?"99+":n;
  b.style.display=n?"grid":"none";
  if(markAll)markAll.disabled=n===0;

  list.innerHTML=displayRows.length
    ?displayRows.map(x=>{
      const name=safeName(x);
      const avatar=String(x.actor_avatar||"").trim();
      const shopTarget=followShopTarget(x);
      const mediaTarget=mediaActivityTarget(x);
      const storyTarget=storyActivityTarget(x);
      const target=shopTarget||mediaTarget||storyTarget;
      const isInteractive=!!target;
      const count=Math.max(1,Number(x._groupCount||1));
      const ids=(x._groupIds&&x._groupIds.length?x._groupIds:[String(x.id||"")]).filter(Boolean);
      const isShopLike=x.type==="shop_like";
      const isMediaLike=x.type==="media_like";
      const isMediaComment=x.type==="media_comment";
      const isMediaReply=x.type==="media_reply";
      const isCommentLike=x.type==="comment_like";
      const mediaLabel=x.media_type==="video"?"video":"photo";

      let message="";
      if(x.type==="follow"){
        message=shopTarget
          ?`Shop <b>${esc(name)}</b> followed you.`
          :`<b>${esc(name)}</b> followed you.`;
      }else if(isShopLike){
        message=`<b>${esc(name)}</b> liked your shop.`;
      }else if(isMediaLike){
        message=count>1
          ?`<b>${esc(name)}</b> liked <span class="m7sn-count">${count}</span> of your media posts.`
          :`<b>${esc(name)}</b> liked your ${mediaLabel}.`;
      }else if(isMediaComment){
        message=`<b>${esc(name)}</b> commented on your ${mediaLabel}.`;
      }else if(isMediaReply){
        message=`<b>${esc(name)}</b> replied in your ${mediaLabel} comments.`;
      }else if(isCommentLike){
        message=`<b>${esc(name)}</b> liked your comment.`;
      }else{
        message=`<b>${esc(name)}</b> liked your ${count>1?"stories":"story"}${count>1?` <span class="m7sn-count">× ${count}</span>`:""}`;
      }

      const preview=(isMediaComment||isMediaReply||isCommentLike)&&x.preview_text
        ?`<span class="m7sn-preview">“${esc(String(x.preview_text).slice(0,110))}”</span>`
        :"";

      const avatarHTML=avatar
        ?`<img src="${esc(avatar)}" alt="${esc(name)}">`
        :`<div class="av">${shopTarget?"🏪":"👤"}</div>`;

      const action=x.type==="follow"?"＋":(isMediaComment||isMediaReply?"💬":"♥");
      const actionClass=(isStoryLike(x)||isShopLike||isMediaLike||isCommentLike)
        ?"like"
        :(isMediaComment||isMediaReply?"comment":"follow");

      return `<div class="m7sn ${x.seen?"":"new"} ${isInteractive?"follow":""}" data-m7-notification-ids="${esc(ids.join(","))}" data-m7-seen="${x.seen?"1":"0"}" ${isInteractive?`role="button" tabindex="0" data-m7-shop-target="${esc(target)}" aria-label="Open activity from ${esc(name)}"`:""}><div class="m7sn-avatar-wrap">${avatarHTML}<span class="m7sn-action ${actionClass}">${action}</span></div><div class="m7sn-copy">${message}${preview}<small data-m7-time="${esc(x.created_at)}">${esc(relativeTime(x.created_at))}</small></div></div>`;
    }).join("")
    :'<div class="m7sn-empty">No activity yet.</div>';
}
function parseHeartIds(value){
  return String(value||"")
    .split(",")
    .map(x=>x.trim())
    .filter(Boolean);
}

async function markOwnerRows(ids,seen){
  const clean=[...new Set((ids||[]).map(String).filter(Boolean))];
  if(!clean.length||!c)return;
  const result=await c.rpc(
    "ma7alak_set_my_owner_notifications_seen",
    {
      p_notification_ids:clean,
      p_seen:seen!==false
    }
  );
  if(result.error)throw result.error;
}

async function deleteOwnerRows(ids){
  const clean=[...new Set((ids||[]).map(String).filter(Boolean))];
  if(!clean.length||!c)return;
  const result=await c.rpc(
    "ma7alak_delete_my_owner_notifications",
    {
      p_notification_ids:clean
    }
  );
  if(result.error)throw result.error;

  const set=new Set(clean);
  rows=rows.filter(x=>!set.has(String(x.id)));
  lastSig="";
  render();
}

function closeHeartActionSheet(){
  const sheet=document.getElementById("m7sn-action-sheet");
  const card=document.getElementById("m7sn-action-card");
  if(sheet){
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden","true");
  }
  if(card)card.innerHTML="";
}

function openHeartActionSheet(row){
  const ids=parseHeartIds(row?.dataset?.m7NotificationIds);
  if(!ids.length)return;

  const sheet=document.getElementById("m7sn-action-sheet");
  const card=document.getElementById("m7sn-action-card");
  if(!sheet||!card)return;

  const isSeen=row.dataset.m7Seen==="1";

  card.innerHTML=
    '<div id="m7sn-action-title">Activity options</div>'+
    (isSeen?"":'<button type="button" class="m7sn-sheet-btn" data-m7sn-read>✓ Mark as read</button>')+
    '<button type="button" class="m7sn-sheet-btn delete" data-m7sn-delete>Delete notification</button>'+
    '<button type="button" class="m7sn-sheet-btn cancel" data-m7sn-cancel>Cancel</button>';

  card.querySelector("[data-m7sn-read]")?.addEventListener("click",async()=>{
    try{
      await markOwnerRows(ids,true);
      const set=new Set(ids);
      rows=rows.map(x=>set.has(String(x.id))?{...x,seen:true}:x);
      render();
      closeHeartActionSheet();
    }catch(error){
      console.warn("SHOUFHON owner activity mark read:",error);
    }
  });

  card.querySelector("[data-m7sn-delete]")?.addEventListener("click",async e=>{
    const button=e.currentTarget;
    button.disabled=true;
    button.textContent="Deleting…";
    try{
      await deleteOwnerRows(ids);
      closeHeartActionSheet();
    }catch(error){
      button.disabled=false;
      button.textContent="Could not delete · try again";
      console.warn("SHOUFHON owner activity delete:",error);
    }
  });

  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden","false");
}

function refreshTimes(){document.querySelectorAll("#m7sn-list [data-m7-time]").forEach(el=>{el.textContent=relativeTime(el.getAttribute("data-m7-time"))})}
async function enrichViewerIdentity(input){const list=Array.isArray(input)?input:[],needsViewer=x=>!(x?.type==="follow"&&String(x?.actor_username||"").toLowerCase().startsWith("shop:")),ids=[...new Set(list.filter(needsViewer).map(actorUserId).filter(Boolean))];if(!ids.length)return list;try{const r=await c.from("viewer_profiles").select("user_id,display_name,username,avatar_url").in("user_id",ids);if(r.error)return list;const map=new Map((r.data||[]).map(p=>[String(p.user_id),p]));return list.map(x=>{if(!needsViewer(x))return x;const p=map.get(actorUserId(x));if(!p)return x;return {...x,actor_name:String(p.display_name||p.username||x.actor_name||"").trim(),actor_avatar:String(p.avatar_url||x.actor_avatar||"").trim()}})}catch(_){return list}}
async function load(force=false){if(loading||!c)return;loading=true;try{const r=await c.rpc("ma7alak_get_my_owner_activity_v2");if(r.error){console.warn("SHOUFHON owner activity:",r.error);return}let next=await enrichViewerIdentity(r.data||[]);const ownerUid=String(owner?.user_id||owner?.id||"");if(ownerUid)next=next.filter(x=>actorUserId(x)!==ownerUid);const sig=next.map(x=>[x.id,x.type,x.created_at,x.seen,actorUserId(x),x.actor_name,x.actor_avatar,x.media_type,x.media_id,x.comment_id,x.preview_text].join("|")).join(";");if(force||sig!==lastSig){lastSig=sig;rows=next;render()}}finally{loading=false}}
async function markSeen(){
  const result=await c.rpc(
    "ma7alak_mark_my_owner_notifications_seen"
  );
  if(result?.error)throw result.error;
  rows=rows.map(x=>({...x,seen:true}));
  render();
}
function restartFallback(){if(poll)clearInterval(poll);const delay=realtimeHealthy?30000:2000;poll=setInterval(()=>{if(document.visibilityState==="visible")load(false)},delay)}
function subscribe(){if(ch)try{c.removeChannel(ch)}catch(_){}ch=c.channel("m7-owner-social-v6-"+owner.shop_slug).on("postgres_changes",{event:"INSERT",schema:"public",table:"ma7alak_owner_notifications",filter:"shop_slug=eq."+owner.shop_slug},()=>setTimeout(()=>load(true),40)).on("postgres_changes",{event:"UPDATE",schema:"public",table:"ma7alak_owner_notifications",filter:"shop_slug=eq."+owner.shop_slug},()=>setTimeout(()=>load(true),40)).on("postgres_changes",{event:"DELETE",schema:"public",table:"ma7alak_owner_notifications"},()=>setTimeout(()=>load(true),40)).subscribe(status=>{const healthy=status==="SUBSCRIBED";if(healthy!==realtimeHealthy){realtimeHealthy=healthy;restartFallback()}if(healthy)load(true)})}
function startFallback(){restartFallback();document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")load(true)})}
function startClock(){if(clock)clearInterval(clock);clock=setInterval(()=>{if(document.visibilityState==="visible")refreshTimes()},15000)}
installShopLikeBridge();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
})();
