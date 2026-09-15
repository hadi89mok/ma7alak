/* =========================================================
   MA7ALAK MESSAGING INTEGRATION V2 — FREEZE FIX
   Safe add-on: DOES NOT modify Premium Header / Follow / Owner login.

   Requires, in this order:
   1) viewer-account.js V2+
   2) ma7alak-chat.js
   3) this file

   Adds:
   - Viewer Account/Profile button to Premium Header
   - Messages icon only after viewer has at least one conversation
   - Live unread badge
   - Message button beside Follow on real shop pages
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_MESSAGING_INTEGRATION_V2__) return;
window.__MA7ALAK_MESSAGING_INTEGRATION_V2__=true;

const RESERVED=new Set(["","admin","dhyf-mhlk-","shwf-almhlat-","login"]);
let realtime=null, refreshTimer=null, mountTimer=null, refreshBusy=false;

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function slug(){
 const explicit=document.documentElement.getAttribute("data-ma7alak-shop-slug")||(document.body&&document.body.getAttribute("data-ma7alak-shop-slug"));
 if(explicit)return String(explicit).trim();
 let p=String(location.pathname||"").replace(/^\/+|\/+$/g,"");
 if(!p||p.includes("/"))return "";
 try{p=decodeURIComponent(p)}catch(_){}
 return RESERVED.has(p.toLowerCase())?"":p;
}
function readyAccount(){
 return new Promise(resolve=>{
   let n=0;
   (function wait(){
     if(window.Ma7alakAccount){Promise.resolve(window.Ma7alakAccount.ready?.()).finally(()=>resolve(true));return;}
     if(++n>120){resolve(false);return;} setTimeout(wait,100);
   })();
 });
}
function readyChat(){
 return new Promise(resolve=>{
   let n=0;(function wait(){if(window.Ma7alakChat){resolve(true);return;}if(++n>120){resolve(false);return;}setTimeout(wait,100);})();
 });
}
function style(){
 if(document.getElementById("m7-msg-int-css"))return;
 const s=document.createElement("style");s.id="m7-msg-int-css";s.textContent=`
#m7-viewer-account-btn,#m7-header-messages{position:relative}
#m7-viewer-account-btn .m7-viewer-avatar{width:25px;height:25px;border-radius:50%;object-fit:cover;border:1px solid rgba(239,198,110,.65);display:block}
#m7-msg-badge{position:absolute;top:1px;right:5px;min-width:17px;height:17px;padding:0 4px;display:none;align-items:center;justify-content:center;border:2px solid #0b0c0d;border-radius:999px;background:#e08b22;color:#fff;font:900 9px/1 Arial;z-index:8;pointer-events:none}
#m7-msg-badge.visible{display:flex}
#m7-header-messages.m7-hidden{display:none!important}
#m7-shop-message-btn{min-width:126px;height:43px;flex:0 0 auto;border:1px solid rgba(217,164,65,.46);border-radius:14px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;background:rgba(255,255,255,.055);color:#f4c96f;font:900 14px/1 Arial;transition:transform .16s ease,background .18s ease,border-color .18s ease}
#m7-shop-message-btn:hover{background:rgba(217,164,65,.10);border-color:rgba(217,164,65,.65)}
#m7-shop-message-btn:active{transform:scale(.96)}
#m7-shop-message-btn svg{width:18px;height:18px;display:block}
#ma7alak-shop-follow-root .ma7alak-follow-card{flex-wrap:nowrap}
#ma7alak-shop-follow-root .m7-follow-actions{display:flex;align-items:center;gap:8px;flex:0 0 auto}
@media(max-width:600px){
 #m7-shop-message-btn{min-width:45px;width:45px;height:41px;padding:0;border-radius:13px}
 #m7-shop-message-btn .m7-msg-text{display:none}
 #ma7alak-shop-follow-root .ma7alak-follow-btn{min-width:104px!important}
 #ma7alak-shop-follow-root .m7-follow-actions{gap:6px}
}
@media(max-width:480px){
 #m7-viewer-account-btn,#m7-header-messages{min-width:35px!important;width:35px!important}
}
`;document.head.appendChild(s);
}
const personSVG=`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5 20c.4-4 2.9-6.2 7-6.2s6.6 2.2 7 6.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const msgSVG=`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.2 5.2h13.6c1.2 0 2.2 1 2.2 2.2v8.1c0 1.2-1 2.2-2.2 2.2H11l-4.8 3v-3H5.2c-1.2 0-2.2-1-2.2-2.2V7.4c0-1.2 1-2.2 2.2-2.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

function header(){
 const nav=document.querySelector("#ma7alak-social-header .ma7alak-header-nav");
 if(!nav)return;
 if(!document.getElementById("m7-viewer-account-btn")){
   const b=document.createElement("button");
   b.id="m7-viewer-account-btn";b.className="ma7alak-header-nav-item";b.type="button";b.setAttribute("aria-label","My Account");
   b.innerHTML=`<span class="ma7alak-header-nav-icon">${personSVG}</span><span class="ma7alak-header-nav-label">Profile</span>`;
   const following=document.getElementById("ma7alak-header-following");
   nav.insertBefore(b,following||nav.firstChild);
   b.onclick=e=>{e.preventDefault();e.stopPropagation();window.Ma7alakAccount?.open();};
 }
 if(!document.getElementById("m7-header-messages")){
   const b=document.createElement("button");
   b.id="m7-header-messages";b.className="ma7alak-header-nav-item m7-hidden";b.type="button";b.setAttribute("aria-label","Messages");
   b.innerHTML=`<span class="ma7alak-header-nav-icon">${msgSVG}</span><span id="m7-msg-badge">0</span><span class="ma7alak-header-nav-label">Messages</span>`;
   const following=document.getElementById("ma7alak-header-following");
   nav.insertBefore(b,following||null);
   b.onclick=e=>{e.preventDefault();e.stopPropagation();window.Ma7alakChat?.openInbox();};
 }
 renderViewer();
}
function renderViewer(){
 const b=document.getElementById("m7-viewer-account-btn"); if(!b||!window.Ma7alakAccount)return;
 const p=window.Ma7alakAccount.profile,u=window.Ma7alakAccount.user;
 const icon=b.querySelector(".ma7alak-header-nav-icon");
 if(icon){
   const wanted=(u&&p?.avatar_url)?String(p.avatar_url):"";
   const current=icon.getAttribute("data-m7-avatar")||"";
   if(current!==wanted){
     icon.setAttribute("data-m7-avatar",wanted);
     icon.innerHTML=wanted?`<img class="m7-viewer-avatar" src="${esc(wanted)}" alt="">`:personSVG;
   }
 }
 const wantedLabel=u?"My Ma7alak Profile":"Log in / Create account";
 if(b.getAttribute("aria-label")!==wantedLabel)b.setAttribute("aria-label",wantedLabel);
}
function shopButton(){
 const s=slug();if(!s)return;
 const root=document.getElementById("ma7alak-shop-follow-root");
 const follow=root?.querySelector(".ma7alak-follow-btn");
 const card=root?.querySelector(".ma7alak-follow-card");
 if(!root||!follow||!card||document.getElementById("m7-shop-message-btn"))return;
 let actions=card.querySelector(".m7-follow-actions");
 if(!actions){
   actions=document.createElement("div");actions.className="m7-follow-actions";
   follow.parentNode.insertBefore(actions,follow);
   actions.appendChild(follow);
 }
 const b=document.createElement("button");b.id="m7-shop-message-btn";b.type="button";b.setAttribute("aria-label","Message this shop");
 b.innerHTML=`${msgSVG}<span class="m7-msg-text">Message</span>`;
 actions.appendChild(b);
 b.onclick=async e=>{
   e.preventDefault();e.stopPropagation();
   if(!window.Ma7alakAccount?.user){window.Ma7alakAccount?.open();return;}
   if(!window.Ma7alakChat){return;}
   window.Ma7alakChat.openShop(s);
 };
}
async function conversationStats(){
 const btn=document.getElementById("m7-header-messages"),badge=document.getElementById("m7-msg-badge");
 if(!btn||!badge||!window.Ma7alakAccount)return;
 const user=window.Ma7alakAccount.user, c=window.Ma7alakAccount.client;
 if(!user||!c){btn.classList.add("m7-hidden");badge.classList.remove("visible");badge.textContent="0";return;}
 if(refreshBusy)return;refreshBusy=true;
 try{
   const cr=await c.from("ma7alak_conversations").select("id,viewer_id,viewer_last_read_at,owner_last_read_at,created_at");
   if(cr.error)throw cr.error;
   const conv=cr.data||[];
   if(!conv.length){btn.classList.add("m7-hidden");badge.classList.remove("visible");badge.textContent="0";return;}
   btn.classList.remove("m7-hidden");
   const ids=conv.map(x=>x.id);
   const mr=await c.from("ma7alak_messages").select("conversation_id,sender_id,created_at").in("conversation_id",ids).order("created_at",{ascending:false});
   if(mr.error)throw mr.error;
   let unread=0;
   const map=new Map(conv.map(x=>[x.id,x]));
   for(const m of (mr.data||[])){
     const x=map.get(m.conversation_id);if(!x)continue;
     const viewerSide=x.viewer_id===user.id;
     const readAt=viewerSide?x.viewer_last_read_at:x.owner_last_read_at;
     const incoming=viewerSide?m.sender_id!==user.id:m.sender_id!==user.id;
     if(incoming && (!readAt || new Date(m.created_at)>new Date(readAt))) unread++;
   }
   badge.textContent=unread>99?"99+":String(unread);
   badge.classList.toggle("visible",unread>0);
 }catch(err){console.warn("[Ma7alak Messaging Integration]",err);}
 finally{refreshBusy=false;}
}
function subscribe(){
 const c=window.Ma7alakAccount?.client,u=window.Ma7alakAccount?.user;
 if(realtime&&c){try{c.removeChannel(realtime)}catch(_){} realtime=null;}
 if(!c||!u)return;
 try{
   realtime=c.channel("m7-msg-header-"+Math.random().toString(36).slice(2))
     .on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_conversations"},()=>setTimeout(conversationStats,30))
     .on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_messages"},()=>setTimeout(conversationStats,30))
     .subscribe();
 }catch(_){}
}
async function refreshAll(){
 header();shopButton();renderViewer();await conversationStats();
}
async function boot(){
 style();
 await readyAccount(); await readyChat();
 refreshAll();subscribe();
 window.addEventListener("ma7alak:account-change",()=>{setTimeout(()=>{refreshAll();subscribe();},30)});
 window.addEventListener("focus",conversationStats);
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)conversationStats();});
 /* PERFORMANCE FIX:
    Do NOT observe the entire Hostinger DOM. The old MutationObserver could
    react to our own DOM writes and create a mutation loop that froze pages.
    Mount-check briefly at low frequency, then stop.
 */
 let mountChecks=0;
 mountTimer=setInterval(()=>{
   header();
   shopButton();
   if(++mountChecks>=20){clearInterval(mountTimer);mountTimer=null;}
 },500);
 refreshTimer=setInterval(conversationStats,5000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
