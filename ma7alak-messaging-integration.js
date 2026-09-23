/* =========================================================
   SHOUFHON MESSAGING INTEGRATION V4.4
   - Header badge counts conversations, never individual messages.
   - Opening an inbox acknowledges only the HEADER badge.
   - Conversation NEW/read state remains untouched until a conversation opens.
   - Message icons stay mounted/stable during auth-owner transitions.
   - Badge acknowledgement is server-side and bound to auth.uid().
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_MESSAGING_INTEGRATION_V44__)return;
window.__MA7ALAK_MESSAGING_INTEGRATION_V44__=true;

let viewerRealtime=null;
let ownerRealtime=null;
let timer=null;
let busy=false;
let authSettling=false;
let settleToken=0;
const lastAckAt={viewer:0,owner:0};

const personSVG=`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5 20c.4-4 2.9-6.2 7-6.2s6.6 2.2 7 6.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const msgSVG=`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.2 5.2h13.6c1.2 0 2.2 1 2.2 2.2v8.1c0 1.2-1 2.2-2.2 2.2H11l-4.8 3v-3H5.2c-1.2 0-2.2-1-2.2-2.2V7.4c0-1.2 1-2.2 2.2-2.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

function style(){
  if(document.getElementById("m7-msg-int-css"))return;
  const s=document.createElement("style");
  s.id="m7-msg-int-css";
  s.textContent=`#m7-viewer-account-btn,#m7-header-messages,#m7-owner-messages{position:relative}.m7-msg-badge{position:absolute;top:1px;right:5px;min-width:17px;height:17px;padding:0 4px;display:none;align-items:center;justify-content:center;border:2px solid #0b0c0d;border-radius:999px;background:#e08b22;color:#fff;font:900 9px/1 Arial;z-index:8;pointer-events:none}.m7-msg-badge.visible{display:flex}.m7-hidden{display:none!important}@media(max-width:900px){#ma7alak-social-header{padding-left:4px!important}#ma7alak-social-header .ma7alak-header-brand{margin-left:0!important;padding-left:0!important}}@media(max-width:480px){#m7-viewer-account-btn,#m7-header-messages,#m7-owner-messages{min-width:35px!important;width:35px!important}}`;
  document.head.appendChild(s);
}

async function ready(){
  for(let i=0;i<120&&!window.Ma7alakAccount;i++)await new Promise(r=>setTimeout(r,50));
  try{await window.Ma7alakAccount?.ready?.()}catch(_){}
  for(let i=0;i<120&&!window.Ma7alakOwnerAuth;i++)await new Promise(r=>setTimeout(r,50));
  try{await window.Ma7alakOwnerAuth?.ready?.()}catch(_){}
}

function badgeEl(kind){
  return document.getElementById(kind==="owner"?"m7-owner-msg-badge":"m7-viewer-msg-badge");
}

function setBadge(kind,count){
  const badge=badgeEl(kind);
  if(!badge)return;
  const n=Math.max(0,Number(count)||0);
  badge.textContent=n>99?"99+":String(n);
  badge.classList.toggle("visible",n>0);
}

function clearBadge(kind){
  setBadge(kind,0);
}

function clientFor(kind){
  return kind==="owner"
    ? (window.Ma7alakOwnerAuth?.client||window.Ma7alakAccount?.client||null)
    : (window.Ma7alakAccount?.client||null);
}

async function acknowledgeInboxBadge(kind){
  kind=kind==="owner"?"owner":"viewer";
  clearBadge(kind);

  const now=Date.now();
  if(now-lastAckAt[kind]<800)return true;
  lastAckAt[kind]=now;

  const client=clientFor(kind);
  if(!client)return false;

  try{
    const r=await client.rpc("ma7alak_ack_inbox_badge",{p_scope:kind});
    if(r.error)throw r.error;
    return true;
  }catch(error){
    console.warn("ShoufHon inbox badge acknowledge:",error);
    return false;
  }
}

async function openChatInbox(kind){
  kind=kind==="owner"?"owner":"viewer";
  clearBadge(kind);
  acknowledgeInboxBadge(kind).catch(()=>{});

  for(let i=0;i<120&&!window.Ma7alakChat;i++){
    await new Promise(r=>setTimeout(r,50));
  }

  if(kind==="owner")window.Ma7alakChat?.openOwnerInbox?.();
  else window.Ma7alakChat?.openViewerInbox?.();
}

function syncLoginButton(nav){
  const logged=!!window.Ma7alakAccount?.user;
  let p=document.getElementById("m7-viewer-account-btn");

  if(logged){
    p?.remove();
    return;
  }

  if(!p){
    p=document.createElement("button");
    p.id="m7-viewer-account-btn";
    p.className="ma7alak-header-nav-item";
    p.type="button";
    p.setAttribute("aria-label","Log in / Create ShoufHon account");
    p.innerHTML=`<span class="ma7alak-header-nav-icon">${personSVG}</span><span class="ma7alak-header-nav-label">Login</span>`;
    const f=document.getElementById("ma7alak-header-following");
    nav.insertBefore(p,f||nav.firstChild);
    p.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      window.Ma7alakAccount?.open?.();
    };
  }
}

function header(){
  const nav=document.querySelector("#ma7alak-social-header .ma7alak-header-nav");
  if(!nav)return;

  syncLoginButton(nav);

  let v=document.getElementById("m7-header-messages");
  if(!v){
    v=document.createElement("button");
    v.id="m7-header-messages";
    v.className="ma7alak-header-nav-item m7-hidden";
    v.type="button";
    v.innerHTML=`<span class="ma7alak-header-nav-icon">${msgSVG}</span><span id="m7-viewer-msg-badge" class="m7-msg-badge">0</span><span class="ma7alak-header-nav-label">Messages</span>`;
    const f=document.getElementById("ma7alak-header-following");
    nav.insertBefore(v,f||null);
    v.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      openChatInbox("viewer");
    };
  }

  let o=document.getElementById("m7-owner-messages");
  if(!o){
    o=document.createElement("button");
    o.id="m7-owner-messages";
    o.className="ma7alak-header-nav-item m7-hidden";
    o.type="button";
    o.innerHTML=`<span class="ma7alak-header-nav-icon">${msgSVG}</span><span id="m7-owner-msg-badge" class="m7-msg-badge">0</span><span class="ma7alak-header-nav-label">Shop Messages</span>`;
    const f=document.getElementById("ma7alak-header-following");
    nav.insertBefore(o,f||null);
    o.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      openChatInbox("owner");
    };
  }

  renderIdentity();
}

function renderIdentity(){
  const nav=document.querySelector("#ma7alak-social-header .ma7alak-header-nav");
  if(nav)syncLoginButton(nav);

  if(authSettling)return;

  const logged=!!window.Ma7alakAccount?.user;
  const owner=!!window.Ma7alakOwnerAuth?.owner;
  const v=document.getElementById("m7-header-messages");
  const o=document.getElementById("m7-owner-messages");

  if(!logged){
    v?.classList.add("m7-hidden");
    o?.classList.add("m7-hidden");
    clearBadge("viewer");
    clearBadge("owner");
    return;
  }

  if(owner){
    v?.classList.add("m7-hidden");
    o?.classList.remove("m7-hidden");
  }else{
    o?.classList.add("m7-hidden");
    v?.classList.remove("m7-hidden");
  }
}

async function fallbackConversationCount(c,u,ownerSide){
  if(!c||!u)return 0;

  const cr=await c
    .from("ma7alak_conversations")
    .select("id,shop_slug,viewer_id,viewer_last_read_at,owner_last_read_at");

  if(cr.error)return 0;

  let conv=cr.data||[];

  if(ownerSide){
    const slug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim().toLowerCase();
    if(!slug)return 0;
    conv=conv.filter(x=>
      String(x.shop_slug||"").trim().toLowerCase()===slug ||
      String(x.viewer_id||"")===String(u.id||"")
    );
  }

  if(!conv.length)return 0;

  const ids=conv.map(x=>x.id);
  const mr=await c
    .from("ma7alak_messages")
    .select("conversation_id,sender_id,created_at")
    .in("conversation_id",ids)
    .order("created_at",{ascending:false});

  if(mr.error)return 0;

  const map=new Map(conv.map(x=>[String(x.id),x]));
  const unreadConversations=new Set();

  for(const m of mr.data||[]){
    const id=String(m.conversation_id||"");
    const x=map.get(id);
    if(!x||unreadConversations.has(id))continue;

    const viewerSide=String(x.viewer_id||"")===String(u.id||"");
    const readAt=ownerSide
      ? (viewerSide?x.viewer_last_read_at:x.owner_last_read_at)
      : x.viewer_last_read_at;

    if(
      String(m.sender_id||"")!==String(u.id||"") &&
      (!readAt||new Date(m.created_at)>new Date(readAt))
    ){
      unreadConversations.add(id);
    }
  }

  return unreadConversations.size;
}

async function badgeCount(c,u,kind){
  if(!c||!u)return 0;

  try{
    const r=await c.rpc("ma7alak_get_inbox_badge_count",{p_scope:kind});
    if(r.error)throw r.error;
    return Math.max(0,Number(r.data)||0);
  }catch(error){
    console.warn("ShoufHon inbox badge count fallback:",error);
    return fallbackConversationCount(c,u,kind==="owner");
  }
}

async function stats(){
  if(busy||authSettling)return;
  busy=true;

  try{
    header();
    if(authSettling)return;

    const owner=!!window.Ma7alakOwnerAuth?.owner;
    const vbtn=document.getElementById("m7-header-messages");
    const obtn=document.getElementById("m7-owner-messages");

    if(owner){
      vbtn?.classList.add("m7-hidden");
      obtn?.classList.remove("m7-hidden");

      const c=window.Ma7alakOwnerAuth?.client||window.Ma7alakAccount?.client;
      const u=window.Ma7alakOwnerAuth?.user||window.Ma7alakAccount?.user;
      const n=await badgeCount(c,u,"owner");

      if(!authSettling)setBadge("owner",n);
    }else{
      obtn?.classList.add("m7-hidden");

      const c=window.Ma7alakAccount?.client;
      const u=window.Ma7alakAccount?.user;

      if(!u){
        vbtn?.classList.add("m7-hidden");
        clearBadge("viewer");
      }else{
        vbtn?.classList.remove("m7-hidden");
        const n=await badgeCount(c,u,"viewer");
        if(!authSettling)setBadge("viewer",n);
      }
    }
  }finally{
    busy=false;
  }
}

function subscribe(){
  if(viewerRealtime&&window.Ma7alakAccount?.client){
    try{window.Ma7alakAccount.client.removeChannel(viewerRealtime)}catch(_){}
  }
  if(ownerRealtime&&window.Ma7alakOwnerAuth?.client){
    try{window.Ma7alakOwnerAuth.client.removeChannel(ownerRealtime)}catch(_){}
  }

  viewerRealtime=ownerRealtime=null;
  if(authSettling)return;

  if(window.Ma7alakOwnerAuth?.owner){
    const c=window.Ma7alakOwnerAuth.client;
    ownerRealtime=c
      .channel("m7-owner-msg-"+Math.random().toString(36).slice(2))
      .on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_conversations"},stats)
      .on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_messages"},stats)
      .subscribe();
  }else if(window.Ma7alakAccount?.user){
    const c=window.Ma7alakAccount.client;
    viewerRealtime=c
      .channel("m7-viewer-msg-"+Math.random().toString(36).slice(2))
      .on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_conversations"},stats)
      .on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_messages"},stats)
      .subscribe();
  }
}

async function settleAuth(){
  const token=++settleToken;
  authSettling=true;

  try{await window.Ma7alakAccount?.ready?.()}catch(_){}
  try{await window.Ma7alakOwnerAuth?.ready?.()}catch(_){}

  await new Promise(r=>setTimeout(r,120));
  if(token!==settleToken)return;

  authSettling=false;
  renderIdentity();
  await stats();
  subscribe();
}

async function boot(){
  style();
  header();

  let checks=0;
  const mount=setInterval(()=>{
    header();
    if(!authSettling)renderIdentity();
    if(++checks>=50)clearInterval(mount);
  },100);

  await ready();
  header();
  renderIdentity();
  await stats();
  subscribe();

  window.addEventListener("ma7alak:account-change",settleAuth);
  window.addEventListener("ma7alak:owner-auth-change",settleAuth);
  window.addEventListener("ma7alak:messages-read",stats);
  window.addEventListener("ma7alak:inbox-open",event=>{
    const kind=event?.detail?.kind==="owner"?"owner":"viewer";
    clearBadge(kind);
    acknowledgeInboxBadge(kind).then(()=>stats()).catch(()=>{});
  });

  timer=setInterval(stats,30000);
}

window.Ma7alakMessagingBadge={
  acknowledge:acknowledgeInboxBadge,
  refresh:stats
};

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}
})();