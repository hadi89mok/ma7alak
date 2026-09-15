/* =========================================================
   MA7ALAK LIVE CHAT UI V1
   Requires viewer-account.js + LIVE CHAT V1 SQL.
   Exposes window.Ma7alakChat.openShop(slug) / openInbox()
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_CHAT_V1__)return;
window.__MA7ALAK_CHAT_V1__=true;
let client,user,activeConversation=null,channel=null;

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=v=>String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

async function ready(){
 for(let i=0;i<100&&!window.Ma7alakAccount;i++)await sleep(50);
 if(!window.Ma7alakAccount)throw new Error("viewer-account.js is not loaded");
 await window.Ma7alakAccount.ready();
 client=window.Ma7alakAccount.client;
 user=window.Ma7alakAccount.user;
}
function styles(){
 if(document.getElementById("m7-chat-css"))return;
 const s=document.createElement("style");s.id="m7-chat-css";s.textContent=`
#m7-chat-shell{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:2147483500;display:flex;align-items:flex-end;justify-content:center;font-family:Arial,sans-serif}
#m7-chat{width:min(520px,100%);height:min(760px,92vh);background:#100e0d;color:#fff;border:1px solid rgba(219,155,70,.35);border-radius:24px 24px 0 0;display:flex;flex-direction:column;overflow:hidden}
#m7-chat-head{padding:14px 16px;background:#1d1511;border-bottom:1px solid #3b2a20;display:flex;align-items:center;gap:10px}#m7-chat-title{font-weight:900;flex:1;color:#f1b45a}
.m7c-icon{border:0;background:#30251f;color:#fff;border-radius:10px;padding:8px 11px;cursor:pointer}
#m7-chat-body{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:9px}
.m7-msg{max-width:78%;padding:10px 12px;border-radius:16px;background:#29231f;line-height:1.35;word-break:break-word}.m7-msg.mine{align-self:flex-end;background:#a96d28;color:#fff}.m7-msg-time{font-size:10px;opacity:.65;margin-top:4px}
#m7-chat-send{display:flex;gap:8px;padding:10px;background:#171310;border-top:1px solid #34261e}#m7-chat-input{flex:1;border:1px solid #453327;background:#0e0c0b;color:#fff;border-radius:14px;padding:12px;outline:none}#m7-chat-send button{border:0;border-radius:14px;background:#d99a45;font-weight:900;padding:0 17px;cursor:pointer}
.m7-convo{padding:13px;border:1px solid #34281f;border-radius:15px;background:#191512;cursor:pointer}.m7-convo strong{color:#f1b45a}.m7-convo small{display:block;color:#aaa;margin-top:4px}
`;document.head.appendChild(s);
}
function shell(title){
 styles();document.getElementById("m7-chat-shell")?.remove();
 const x=document.createElement("div");x.id="m7-chat-shell";
 x.innerHTML=`<div id="m7-chat"><div id="m7-chat-head"><button class="m7c-icon" id="m7-chat-back" style="display:none">‹</button><div id="m7-chat-title">${esc(title)}</div><button class="m7c-icon" id="m7-chat-close">✕</button></div><div id="m7-chat-body"></div></div>`;
 document.body.appendChild(x);document.getElementById("m7-chat-close").onclick=close;x.onclick=e=>{if(e.target===x)close();};return x;
}
function close(){if(channel&&client)client.removeChannel(channel);channel=null;activeConversation=null;document.getElementById("m7-chat-shell")?.remove();}
function time(v){try{return new Date(v).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}catch(e){return "";}}
async function requireLogin(){
 await ready();user=window.Ma7alakAccount.user;
 if(!user){window.Ma7alakAccount.open();return false;}return true;
}
async function loadMessages(id){
 const body=document.getElementById("m7-chat-body");if(!body)return;
 const r=await client.from("ma7alak_messages").select("*").eq("conversation_id",id).order("created_at",{ascending:true});
 if(r.error){body.innerHTML=`<div>${esc(r.error.message)}</div>`;return;}
 body.innerHTML=(r.data||[]).map(m=>`<div class="m7-msg ${m.sender_id===user.id?"mine":""}">${esc(m.body)}<div class="m7-msg-time">${time(m.created_at)}</div></div>`).join("");
 body.scrollTop=body.scrollHeight;
 await client.rpc("ma7alak_mark_conversation_read",{p_conversation_id:id});
}
async function showConversation(c,title){
 activeConversation=c;shell(title||c.shop_slug);
 const chat=document.getElementById("m7-chat");
 chat.insertAdjacentHTML("beforeend",`<form id="m7-chat-send"><input id="m7-chat-input" maxlength="2000" autocomplete="off" placeholder="Type a message..."><button>Send</button></form>`);
 await loadMessages(c.id);
 document.getElementById("m7-chat-send").onsubmit=async e=>{
  e.preventDefault();const input=document.getElementById("m7-chat-input");const text=input.value.trim();if(!text)return;
  input.value="";const r=await client.rpc("ma7alak_send_message",{p_conversation_id:c.id,p_body:text});if(r.error){alert(r.error.message);input.value=text;}
 };
 if(channel)client.removeChannel(channel);
 channel=client.channel("m7-chat-"+c.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"ma7alak_messages",filter:"conversation_id=eq."+c.id},()=>loadMessages(c.id)).subscribe();
}
async function openShop(slug){
 if(!await requireLogin())return;
 const r=await client.rpc("ma7alak_start_conversation",{p_shop_slug:String(slug||"").trim()});
 if(r.error){alert(r.error.message);return;}
 let c=Array.isArray(r.data)?r.data[0]:r.data;
 let name=slug;
 const sp=await client.from("shop_profiles").select("shop_name").eq("shop_slug",slug).maybeSingle();if(sp.data?.shop_name)name=sp.data.shop_name;
 await showConversation(c,name);
}
async function openInbox(){
 if(!await requireLogin())return;
 shell("Messages");
 const body=document.getElementById("m7-chat-body");body.innerHTML="Loading...";
 const owned=await client.from("shop_owners").select("shop_slug").eq("user_id",user.id);
 const ownedSlugs=(owned.data||[]).map(x=>x.shop_slug);
 let q=client.from("ma7alak_conversations").select("*").order("updated_at",{ascending:false});
 const r=await q;
 if(r.error){body.innerHTML=esc(r.error.message);return;}
 const rows=r.data||[];
 if(!rows.length){body.innerHTML="<div style='color:#aaa;text-align:center;margin-top:30px'>No conversations yet.</div>";return;}
 const profiles={};
 const ids=[...new Set(rows.map(x=>x.viewer_id))];
 if(ids.length){const p=await client.from("viewer_profiles").select("user_id,display_name,username").in("user_id",ids);(p.data||[]).forEach(x=>profiles[x.user_id]=x);}
 body.innerHTML=rows.map(c=>{
   const isOwner=ownedSlugs.includes(c.shop_slug),p=profiles[c.viewer_id];
   const label=isOwner?(p?.display_name||p?.username||"Customer"):c.shop_slug;
   return `<div class="m7-convo" data-id="${c.id}"><strong>${esc(label)}</strong><small>${isOwner?"Shop inbox · "+esc(c.shop_slug):"Shop · "+esc(c.shop_slug)}</small></div>`;
 }).join("");
 body.querySelectorAll(".m7-convo").forEach(el=>el.onclick=()=>{
   const c=rows.find(x=>x.id===el.dataset.id);const p=profiles[c.viewer_id];const isOwner=ownedSlugs.includes(c.shop_slug);
   showConversation(c,isOwner?(p?.display_name||"Customer"):c.shop_slug);
 });
}
window.Ma7alakChat={openShop,openInbox,close};
window.addEventListener("ma7alak:open-chat",e=>openShop(e.detail?.shop_slug));
window.addEventListener("ma7alak:open-messages",()=>openInbox());
})();
