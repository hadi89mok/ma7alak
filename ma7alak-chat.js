/* =========================================================
 SHOUFHON LIVE CHAT V8 — STORY REPLIES + MOBILE CHAT
 - keeps avatars/unread/report/message acceptance/delete controls
 - Story replies stay inside the existing viewer↔shop conversation
 - clickable Story cards open the exact active Story
 - expired/deleted Story context degrades safely
 - realtime refreshes on INSERT/UPDATE/DELETE
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_CHAT_V8__)return;window.__MA7ALAK_CHAT_V8__=true;window.__MA7ALAK_CHAT_V7__=true;
let client,user,mode="viewer",channel=null,settingsChannel=null;
const sleep=m=>new Promise(r=>setTimeout(r,m));
const esc=v=>String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function vr(){for(let i=0;i<100&&!window.Ma7alakAccount;i++)await sleep(50);if(!window.Ma7alakAccount)throw new Error("ShoufHon account system is not ready.");await window.Ma7alakAccount.ready();client=window.Ma7alakAccount.client;user=window.Ma7alakAccount.user;mode="viewer"}
async function or(){for(let i=0;i<100&&!window.Ma7alakOwnerAuth;i++)await sleep(50);if(!window.Ma7alakOwnerAuth)throw new Error("ShoufHon owner system is not ready.");await window.Ma7alakOwnerAuth.ready();client=window.Ma7alakOwnerAuth.client;user=window.Ma7alakOwnerAuth.user;mode="owner";return !!window.Ma7alakOwnerAuth.owner}
function css(){if(document.getElementById("m7c-v8-css"))return;document.getElementById("m7c-v7-css")?.remove();document.getElementById("m7c-v6-css")?.remove();let s=document.createElement("style");s.id="m7c-v8-css";s.textContent=`
#m7-chat-shell{position:fixed;inset:0;background:#000b;z-index:2147483500;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:Arial;overscroll-behavior:contain}
#m7-chat{width:min(540px,100%);height:min(760px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);background:#100e0d;color:#fff;border:1px solid #db9b4659;border-radius:24px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 70px #000b;min-height:0}
#m7-chat-head{padding:12px 14px;background:#1d1511;border-bottom:1px solid #3b2a20;display:flex;align-items:center;gap:8px;flex:0 0 auto;min-height:64px;box-sizing:border-box}
.m7-head-person{display:flex;align-items:center;gap:9px;min-width:0;flex:1}.m7-head-person.m7-shop-profile-link{cursor:pointer;border-radius:12px;padding:3px 5px;margin-left:-5px;transition:background .16s ease,transform .16s ease}.m7-head-person.m7-shop-profile-link:hover{background:#ffffff0b}.m7-head-person.m7-shop-profile-link:active{transform:scale(.985)}.m7-head-person.m7-shop-profile-link:focus-visible{outline:2px solid #d99a45;outline-offset:2px}.m7-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #d99a45;background:#30251f;flex:0 0 40px}.m7-avatar.fallback{display:grid;place-items:center;font-weight:900;color:#f1b45a}#m7-chat-title{font-weight:900;color:#f1b45a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7c-icon{border:0;background:#30251f;color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer;flex:0 0 auto}.m7c-danger{background:#4a211f;color:#ffb5ae}
#m7-owner-accept{border:1px solid #ffffff18;border-radius:10px;padding:8px 9px;font:800 10px Arial;cursor:pointer;white-space:nowrap}#m7-owner-accept.on{background:#24452e;color:#bff1cb}#m7-owner-accept.off{background:#522b27;color:#ffd0ca}
#m7-chat-body{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:9px;overscroll-behavior:contain}
.m7-msg{max-width:78%;padding:10px 12px;border-radius:16px;background:#29231f;line-height:1.35;word-break:break-word;position:relative}.m7-msg.mine{align-self:flex-end;background:#a96d28;padding-right:34px}.m7-msg-text{white-space:pre-wrap}.m7-msg-time{font-size:10px;opacity:.6;margin-top:4px}.m7-msg-delete{position:absolute;right:5px;top:5px;width:25px;height:25px;border:0;border-radius:8px;background:#0003;color:#fff;display:grid;place-items:center;font-size:14px;cursor:pointer;padding:0}
.m7-story-reply-card{width:min(260px,100%);margin:0 0 8px;padding:0;border:1px solid #ffffff22;border-radius:14px;overflow:hidden;background:#0f0d0c;color:#fff;text-align:left;cursor:pointer;display:block;box-shadow:0 8px 22px #0004}.m7-story-reply-card:active{transform:scale(.985)}.m7-story-card-top{display:flex;gap:10px;align-items:center;padding:8px}.m7-story-card-media{width:62px;height:78px;border-radius:10px;overflow:hidden;background:linear-gradient(145deg,#2c241e,#0d0b0a);display:grid;place-items:center;position:relative;flex:0 0 62px;border:1px solid #ffffff17}.m7-story-card-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}.m7-story-card-fallback{font-size:24px;opacity:.75}.m7-story-card-play{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#0009;border:1px solid #fff5;font-size:16px;padding-left:2px}.m7-story-card-copy{min-width:0;flex:1}.m7-story-card-label{font-size:11px;font-weight:900;color:#efb35d;letter-spacing:.02em}.m7-story-card-name{margin-top:4px;font-size:12px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7-story-card-status{margin-top:4px;font-size:11px;color:#bdb3aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7-story-card-badge{display:inline-flex;margin-top:6px;padding:3px 6px;border-radius:999px;background:#4a211f;color:#ffb9b1;font-size:9px;font-weight:900}.m7-story-reply-card.is-expired{cursor:default;opacity:.72}.m7-story-reply-card.is-expired .m7-story-card-label{color:#c7b8aa}
#m7-chat-send{display:flex;gap:8px;padding:10px max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:#171310;border-top:1px solid #34261e;flex:0 0 auto}#m7-chat-input{flex:1;min-width:0;border:1px solid #453327;background:#0e0c0b;color:#fff;border-radius:14px;padding:12px;font-size:16px}#m7-chat-send button{border:0;border-radius:14px;background:#d99a45;font-weight:900;padding:0 17px}
.m7-convo{display:flex;align-items:center;gap:11px;padding:12px;border:1px solid #34281f;border-radius:16px;background:#191512;cursor:pointer;position:relative;flex:0 0 auto}.m7-convo.unread{border-color:#e7a84f;background:linear-gradient(135deg,#332215,#1a1512);box-shadow:0 0 0 1px #e7a84f22}.m7-convo-copy{min-width:0;flex:1}.m7-convo strong{color:#f1b45a}.m7-convo small{display:block;color:#aaa;margin-top:4px}.m7-convo-delete{border:0;border-radius:10px;width:34px;height:34px;background:#3b1f1c;color:#ffb0a7;font-size:16px;cursor:pointer;flex:0 0 34px}.m7-new{background:#e58f25;color:#fff;font-size:9px;font-weight:900;border-radius:999px;padding:5px 7px}.m7-empty{text-align:center;color:#aaa;margin-top:30px}.m7-loading{text-align:center;color:#b7aa9d;margin-top:25px}.m7-error{text-align:center;color:#ffb3a8;margin:25px 12px;line-height:1.45}
#m7-chat.m7-inbox-panel{height:min(500px,calc(100dvh - 120px));max-height:min(500px,calc(100dvh - 120px))}
#m7-chat.m7-inbox-panel #m7-chat-body{overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#d9a44155 transparent}
#m7-chat.m7-inbox-panel #m7-chat-body::-webkit-scrollbar{width:5px}
#m7-chat.m7-inbox-panel #m7-chat-body::-webkit-scrollbar-thumb{background:#d9a44155;border-radius:20px}
@media(max-width:600px){#m7-chat-shell{padding:0;align-items:stretch;justify-content:stretch;background:#100e0d}#m7-chat{width:100%;height:100dvh;max-height:100dvh;border:0;border-radius:0;box-shadow:none}#m7-chat-head{padding-top:max(12px,env(safe-area-inset-top));min-height:calc(64px + env(safe-area-inset-top))}#m7-chat-body{padding:12px}.m7-msg{max-width:86%}#m7-chat-shell.m7-inbox-shell{padding:0 14px 14px;align-items:flex-start;justify-content:center;background:#0009}#m7-chat.m7-inbox-panel{width:calc(100% - 28px);height:min(500px,calc(100dvh - 104px));max-height:min(500px,calc(100dvh - 104px));margin-top:max(78px,calc(env(safe-area-inset-top) + 68px));border:1px solid #db9b4659;border-radius:22px;box-shadow:0 24px 70px #000b}#m7-chat.m7-inbox-panel #m7-chat-head{padding-top:12px;min-height:64px}.m7-convo{min-height:68px;box-sizing:border-box}}
@supports not (height:100dvh){@media(max-width:600px){#m7-chat{height:100vh;max-height:100vh}}}
`;document.head.appendChild(s)}
function av(url,name){return url?`<img class="m7-avatar" src="${esc(url)}" alt="">`:`<div class="m7-avatar fallback">${esc((name||"?").slice(0,1).toUpperCase())}</div>`}
function shell(title,avatar,back){css();close(true);let x=document.createElement("div");x.id="m7-chat-shell";x.innerHTML=`<div id="m7-chat"><div id="m7-chat-head"><button class="m7c-icon" id="m7-back" style="display:${back?"block":"none"}">‹</button><div class="m7-head-person">${av(avatar,title)}<div id="m7-chat-title">${esc(title)}</div></div><button class="m7c-icon" id="m7-report" title="Report">⚑</button><button class="m7c-icon" id="m7-delete-convo" title="Delete conversation" style="display:none">🗑</button><button class="m7c-icon" id="m7-close">✕</button></div><div id="m7-chat-body"><div class="m7-loading">Loading…</div></div></div>`;document.body.appendChild(x);x.querySelector("#m7-close").onclick=()=>close();x.onclick=e=>{if(e.target===x)close()};return x}
function bindShopProfileLink(url,slug){
  const node=document.querySelector("#m7-chat-head .m7-head-person");
  if(!node)return;
  let target=String(url||"").trim();
  const shopSlug=String(slug||"").trim();
  if(!target&&shopSlug)target="/"+encodeURIComponent(shopSlug);
  if(!target)return;
  node.classList.add("m7-shop-profile-link");
  node.setAttribute("role","link");
  node.setAttribute("tabindex","0");
  node.setAttribute("aria-label","Open shop page");
  const go=e=>{
    if(e){e.preventDefault();e.stopPropagation()}
    try{window.location.href=new URL(target,window.location.origin).toString()}
    catch(_){window.location.href=target}
  };
  node.onclick=go;
  node.onkeydown=e=>{
    if(e.key==="Enter"||e.key===" "){go(e)}
  };
}
function close(remove=true){if(channel&&client)try{client.removeChannel(channel)}catch(_){}channel=null;if(settingsChannel&&client)try{client.removeChannel(settingsChannel)}catch(_){}settingsChannel=null;if(remove)document.getElementById("m7-chat-shell")?.remove()}
const tm=v=>{try{return new Date(v).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch(_){return""}};
const sameId=(a,b)=>String(a??"")===String(b??"");
const STORY_MEDIA_BASE="https://wdtaiuwtqdepzdamgsrs.supabase.co/storage/v1/object/public/shop-stories/";
function storyCtx(m){let x=m&&m.context;if(!x)return{};if(typeof x==="string"){try{x=JSON.parse(x)}catch(_){return{}}}return x&&typeof x==="object"?x:{}}
function storyMediaUrl(path){path=String(path||"").trim();while(path.startsWith("/"))path=path.slice(1);return path?STORY_MEDIA_BASE+path.split("/").map(encodeURIComponent).join("/"):""}
function cleanPath(path){path=String(path||"");while(path.length>1&&path.endsWith("/"))path=path.slice(0,-1);return path}
function storyExpired(ctx){const x=ctx&&ctx.story_expires_at;if(!x)return false;const t=new Date(x).getTime();return Number.isFinite(t)&&t<=Date.now()}
function storyCardHtml(m){
  if(String(m?.message_type||"")!=="story_reply")return"";
  const ctx=storyCtx(m),storyId=String(m?.reply_story_id??ctx.story_id??"").trim(),slug=String(ctx.shop_slug||"").trim(),shopUrl=String(ctx.shop_url||"").trim(),expires=String(ctx.story_expires_at||"").trim(),mediaType=String(ctx.media_type||"").trim().toLowerCase(),storagePath=String(ctx.storage_path||"").trim(),status=String(ctx.status_text||"").trim(),shopName=String(ctx.shop_name||slug||"Story").trim(),expired=storyExpired(ctx),imageUrl=mediaType==="image"?storyMediaUrl(storagePath):"";
  const visual=mediaType==="video"?'<span class="m7-story-card-play" aria-hidden="true">▶</span>':(imageUrl?'<span class="m7-story-card-fallback" aria-hidden="true">▧</span><img loading="lazy" decoding="async" data-story-thumb src="'+esc(imageUrl)+'" alt="">':'<span class="m7-story-card-fallback" aria-hidden="true">▧</span>');
  return '<button type="button" class="m7-story-reply-card '+(expired?"is-expired":"")+'" data-story-open="'+esc(storyId)+'" data-story-shop="'+esc(slug)+'" data-story-url="'+esc(shopUrl)+'" data-story-expires="'+esc(expires)+'" '+(expired?'aria-disabled="true"':'')+'><span class="m7-story-card-top"><span class="m7-story-card-media">'+visual+'</span><span class="m7-story-card-copy"><span class="m7-story-card-label">Replied to story</span><span class="m7-story-card-name">'+esc(shopName)+'</span>'+(status?'<span class="m7-story-card-status">'+esc(status)+'</span>':"")+(expired?'<span class="m7-story-card-badge">Story expired</span>':"")+'</span></span></button>';
}
async function openStoryFromMessage(button){
  if(!button||button.classList.contains("is-expired")){alert("This Story has expired.");return}
  const storyId=String(button.dataset.storyOpen||"").trim(),slug=String(button.dataset.storyShop||"").trim();
  if(!storyId||!slug){alert("This Story is no longer available.");return}
  let shopUrl=String(button.dataset.storyUrl||"").trim();
  try{
    if(!shopUrl){
      if(!client)await vr();
      const r=await client.from("shop_profiles").select("shop_url").eq("shop_slug",slug).maybeSingle();
      if(!r.error)shopUrl=String(r.data?.shop_url||"").trim();
    }
    if(!shopUrl)shopUrl="/"+encodeURIComponent(slug);
    const target=new URL(shopUrl,window.location.origin);
    target.searchParams.set("story",storyId);target.searchParams.set("shop",slug);
    const samePage=target.origin===window.location.origin&&cleanPath(target.pathname)===cleanPath(window.location.pathname);
    if(samePage){
      let delivered=false;
      document.querySelectorAll("iframe").forEach(frame=>{try{frame.contentWindow?.postMessage({type:"SHOUFHON_OPEN_STORY_BY_ID",storyId,shopSlug:slug},"*");delivered=true}catch(_){}});
      if(delivered){close();return}
    }
    window.location.href=target.toString();
  }catch(e){console.warn("Open Story reply:",e);alert("Could not open this Story.")}
}
function wireStoryCards(b){
  b.querySelectorAll("[data-story-open]").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();openStoryFromMessage(btn)});
  b.querySelectorAll("[data-story-thumb]").forEach(img=>img.addEventListener("error",()=>{img.style.display="none"},{once:true}));
}
async function sendStoryReply(input){
  const storyId=Number(input?.story_id??input?.storyId),body=String(input?.body||"").trim(),slug=String(input?.shop_slug??input?.shopSlug??"").trim();
  if(!Number.isFinite(storyId)||storyId<=0)return{ok:false,error:"Story is unavailable."};
  if(!body)return{ok:false,error:"Write a reply first."};
  if(body.length>2000)return{ok:false,error:"Reply is too long."};
  try{
    await vr();
    if(!user){window.Ma7alakAccount?.open?.();return{ok:false,login_required:true,error:"Sign in with Google to reply."}}
    const ownSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim().toLowerCase();
    if(slug&&ownSlug&&slug.toLowerCase()===ownSlug)return{ok:false,error:"You cannot reply to your own Story."};
    if(slug&&!(await accepts(slug)))return{ok:false,error:"This shop is not accepting messages right now."};
    const r=await client.rpc("ma7alak_send_story_reply",{p_story_id:storyId,p_body:body});
    if(r.error){
      const msg=String(r.error.message||"");
      if(msg.includes("LOGIN_REQUIRED"))return{ok:false,login_required:true,error:"Sign in with Google to reply."};
      if(msg.includes("STORY_UNAVAILABLE"))return{ok:false,error:"This Story has expired or was deleted."};
      if(msg.includes("SHOP_NOT_ACCEPTING_MESSAGES"))return{ok:false,error:"This shop is not accepting messages right now."};
      if(msg.includes("OWN_STORY_REPLY_NOT_ALLOWED"))return{ok:false,error:"You cannot reply to your own Story."};
      if(msg.includes("ACCOUNT_NOT_ACTIVE"))return{ok:false,error:"This account cannot send messages."};
      return{ok:false,error:msg||"Could not send Story reply."};
    }
    dispatchEvent(new Event("ma7alak:messages-read"));
    return{ok:true,message:Array.isArray(r.data)?r.data[0]:r.data};
  }catch(e){console.error("Story reply send:",e);return{ok:false,error:e?.message||"Could not send Story reply."}}
}
function loadError(b,e){if(!b)return;console.error("ShoufHon chat load error:",e);b.innerHTML=`<div class="m7-error">Could not load this conversation.<br><small>${esc(e?.message||"Please close Messages and try again.")}</small></div>`}
async function deleteMessage(id,c){if(!id||!c)return;if(!confirm("Delete this message?"))return;let r=await client.rpc("ma7alak_delete_my_message",{p_message_id:id});if(r.error){alert(r.error.message);return}await messages(c)}
async function deleteConversation(c,back){if(!c?.id)return;if(!confirm("Delete this entire conversation and all its messages? This cannot be undone."))return false;let r=await client.rpc("ma7alak_delete_conversation",{p_conversation_id:c.id});if(r.error){alert(r.error.message);return false}dispatchEvent(new Event("ma7alak:messages-read"));if(typeof back==="function")await back();else close();return true}
async function messages(c){let b=document.getElementById("m7-chat-body");if(!b)return false;if(!c||c.id==null){loadError(b,new Error("Conversation not found."));return false}try{let r=await Promise.race([client.from("ma7alak_messages").select("*").eq("conversation_id",c.id).order("created_at"),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Message loading timed out. Please try again.")),12000))]);if(!b.isConnected)return false;if(r.error)throw r.error;b.innerHTML=(r.data||[]).map(m=>{let mine=sameId(m.sender_id,user?.id),card=storyCardHtml(m);return `<div class="m7-msg ${mine?"mine":""}">${card}<div class="m7-msg-text">${esc(m.body)}</div>${mine?`<button class="m7-msg-delete" type="button" data-delete-message="${esc(m.id)}" title="Delete message">×</button>`:""}<div class="m7-msg-time">${tm(m.created_at)}</div></div>`}).join("")||'<div class="m7-empty">No messages yet.</div>';wireStoryCards(b);b.querySelectorAll("[data-delete-message]").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();deleteMessage(btn.dataset.deleteMessage,c)});b.scrollTop=b.scrollHeight;client.rpc("ma7alak_mark_conversation_read",{p_conversation_id:c.id}).then(()=>dispatchEvent(new Event("ma7alak:messages-read"))).catch(e=>console.warn("Mark read failed:",e));return true}catch(e){loadError(b,e);return false}}
async function convo(c,title,avatar,back,shopProfile){shell(title,avatar,!!back);if(!c||c.id==null){loadError(document.getElementById("m7-chat-body"),new Error("Conversation not found."));return}if(shopProfile&&shopProfile.isShop){bindShopProfileLink(shopProfile.url,shopProfile.slug)}if(back)document.getElementById("m7-back").onclick=back;let del=document.getElementById("m7-delete-convo");del.style.display="block";del.onclick=()=>deleteConversation(c,back);document.getElementById("m7-report").onclick=async()=>{let reason=prompt("Why are you reporting this conversation?","Abusive messages");if(!reason)return;let r=await client.rpc("ma7alak_report_conversation",{p_conversation_id:c.id,p_reason:reason,p_details:"Reported from ShoufHon chat"});alert(r.error?r.error.message:"Report sent to ShoufHon Admin ✓")};document.getElementById("m7-chat").insertAdjacentHTML("beforeend",`<form id="m7-chat-send"><input id="m7-chat-input" maxlength="2000" placeholder="Type a message..." autocomplete="off"><button>Send</button></form>`);await messages(c);let form=document.getElementById("m7-chat-send");if(form)form.onsubmit=async e=>{e.preventDefault();let i=document.getElementById("m7-chat-input"),t=i?.value.trim();if(!t)return;i.value="";try{let r=await client.rpc("ma7alak_send_message",{p_conversation_id:c.id,p_body:t});if(r.error){alert(r.error.message);i.value=t}}catch(err){alert(err?.message||"Could not send message");i.value=t}};channel=client.channel("m7c-"+c.id+Math.random()).on("postgres_changes",{event:"*",schema:"public",table:"ma7alak_messages",filter:"conversation_id=eq."+c.id},()=>messages(c)).on("postgres_changes",{event:"DELETE",schema:"public",table:"ma7alak_conversations",filter:"id=eq."+c.id},()=>{if(typeof back==="function")back();else close()}).subscribe()}
async function unreadMap(rows,sideFor){let out=new Set;if(!rows.length)return out;try{let ids=rows.map(x=>x.id),r=await client.from("ma7alak_messages").select("conversation_id,sender_id,created_at").in("conversation_id",ids);if(r.error)return out;for(let m of r.data||[]){let c=rows.find(x=>sameId(x.id,m.conversation_id));if(!c)continue;let side=typeof sideFor==="function"?sideFor(c):mode,rd=side==="owner"?c.owner_last_read_at:c.viewer_last_read_at;if(!sameId(m.sender_id,user?.id)&&(!rd||new Date(m.created_at)>new Date(rd)))out.add(String(m.conversation_id))}}catch(e){console.warn("Unread map failed:",e)}return out}
async function accepts(slug){let r=await client.rpc("ma7alak_shop_accepts_messages",{p_shop_slug:String(slug||"").trim()});if(r.error){console.warn("Message setting:",r.error);return true}return r.data!==false}
async function openShop(slug){try{await vr();if(!user){window.Ma7alakAccount?.open();return}slug=String(slug||"").trim();const ownSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim();if(ownSlug&&ownSlug.toLowerCase()===slug.toLowerCase()){alert("You cannot message your own shop");return}if(!await accepts(slug)){alert("Shop owner is currently not accepting messages");return}let r=await client.rpc("ma7alak_start_conversation",{p_shop_slug:slug});if(r.error){alert(r.error.message);return}let c=Array.isArray(r.data)?r.data[0]:r.data;if(!c){alert("Could not open conversation.");return}let sp=await client.from("shop_profiles").select("shop_name,profile_image_url,shop_url").eq("shop_slug",c.shop_slug).maybeSingle();mode="viewer";convo(c,sp.data?.shop_name||c.shop_slug,sp.data?.profile_image_url||"",null,{isShop:true,url:sp.data?.shop_url||"",slug:c.shop_slug})}catch(e){console.error(e);alert(e?.message||"Could not open messages.")}}
function wireInboxDeletes(b,rows,reopen){b.querySelectorAll("[data-delete-convo]").forEach(btn=>btn.onclick=async e=>{e.preventDefault();e.stopPropagation();let c=rows.find(x=>sameId(x.id,btn.dataset.deleteConvo));if(c)await deleteConversation(c,reopen)})}
async function viewerInbox(){try{await vr();if(!user){window.Ma7alakAccount?.open();return}shell("Messages","",false);document.getElementById("m7-chat")?.classList.add("m7-inbox-panel");document.getElementById("m7-chat-shell")?.classList.add("m7-inbox-shell");document.getElementById("m7-report").style.display="none";let b=document.getElementById("m7-chat-body"),r=await client.from("ma7alak_conversations").select("*").order("updated_at",{ascending:false});if(r.error){b.textContent=r.error.message;return}let rows=r.data||[],slugs=[...new Set(rows.map(x=>x.shop_slug))];let [un,p]=await Promise.all([unreadMap(rows),slugs.length?client.from("shop_profiles").select("shop_slug,shop_name,profile_image_url,shop_url").in("shop_slug",slugs):Promise.resolve({data:[]})]);let map={};for(let x of p.data||[])map[x.shop_slug]=x;b.innerHTML=rows.length?rows.map(c=>{let p=map[c.shop_slug]||{},n=p.shop_name||c.shop_slug,id=String(c.id);return `<div class="m7-convo ${un.has(id)?"unread":""}" data-id="${esc(id)}">${av(p.profile_image_url,n)}<div class="m7-convo-copy"><strong>${esc(n)}</strong><small>Shop conversation</small></div>${un.has(id)?'<span class="m7-new">NEW</span>':""}<button class="m7-convo-delete" type="button" data-delete-convo="${esc(id)}" title="Delete conversation">🗑</button></div>`}).join(""):'<div class="m7-empty">No conversations yet.</div>';wireInboxDeletes(b,rows,viewerInbox);b.querySelectorAll(".m7-convo").forEach(el=>el.onclick=()=>{let c=rows.find(x=>sameId(x.id,el.dataset.id));if(!c){loadError(b,new Error("Conversation not found."));return}let p=map[c.shop_slug]||{};convo(c,p.shop_name||c.shop_slug,p.profile_image_url||"",viewerInbox,{isShop:true,url:p.shop_url||"",slug:c.shop_slug})})}catch(e){loadError(document.getElementById("m7-chat-body"),e)}}
async function ownerInbox(){
  try{
    if(!await or()){
      window.Ma7alakOwnerAuth?.open();
      return;
    }

    const shop=String(window.Ma7alakOwnerAuth.owner.shop_slug||"").trim();

    shell(
      "Shop Messages",
      window.Ma7alakOwnerAuth.owner.profile_image_url||"",
      false
    );

    document.getElementById("m7-chat")?.classList.add("m7-inbox-panel");
    document.getElementById("m7-chat-shell")?.classList.add("m7-inbox-shell");
    document.getElementById("m7-report").style.display="none";

    const head=document.getElementById("m7-chat-head");
    const toggle=document.createElement("button");
    toggle.id="m7-owner-accept";
    head.insertBefore(toggle,document.getElementById("m7-close"));

    async function sync(){
      const on=await accepts(shop);
      toggle.className=on?"on":"off";
      toggle.textContent=on?"Messages ON":"Messages OFF";
      toggle.dataset.on=on?"1":"0";
    }

    toggle.onclick=async()=>{
      toggle.disabled=true;
      const next=toggle.dataset.on!=="1";
      const r=await client.rpc(
        "ma7alak_set_my_shop_accepting_messages",
        {
          p_shop_slug:shop,
          p_accepting:next
        }
      );
      toggle.disabled=false;

      if(r.error){
        alert(r.error.message);
        return;
      }

      sync();
    };

    await sync();

    settingsChannel=
      client
        .channel("m7-msg-setting-"+shop+Math.random())
        .on(
          "postgres_changes",
          {
            event:"*",
            schema:"public",
            table:"ma7alak_shop_message_settings",
            filter:"shop_slug=eq."+shop
          },
          sync
        )
        .subscribe();

    const b=document.getElementById("m7-chat-body");

    /*
      RLS returns both:
      - conversations sent TO this owner's shop
      - conversations this same owner started with another shop
    */
    const r=
      await client
        .from("ma7alak_conversations")
        .select("*")
        .order("updated_at",{ascending:false});

    if(r.error){
      b.textContent=r.error.message;
      return;
    }

    const rows=(r.data||[]).filter(c=>{
      const incoming=
        String(c.shop_slug||"").toLowerCase()===
        shop.toLowerCase();

      const outgoing=
        sameId(c.viewer_id,user?.id);

      return incoming||outgoing;
    });

    const ids=rows.map(x=>x.id);

    const [un,partnersResult]=await Promise.all([
      unreadMap(
        rows,
        c=>sameId(c.viewer_id,user?.id)
          ? "viewer"
          : "owner"
      ),
      ids.length
        ? client.rpc(
            "ma7alak_get_conversation_partners",
            {p_conversation_ids:ids}
          )
        : Promise.resolve({data:[]})
    ]);

    if(partnersResult.error){
      console.warn(
        "Conversation partner identities:",
        partnersResult.error
      );
    }

    const partnerMap=new Map(
      (partnersResult.data||[]).map(
        p=>[String(p.conversation_id),p]
      )
    );

    b.innerHTML=
      rows.length
        ? rows.map(c=>{
            const id=String(c.id);
            const outgoing=sameId(c.viewer_id,user?.id);
            const p=partnerMap.get(id)||{};
            const n=
              p.display_name||
              (outgoing?c.shop_slug:"Customer");

            const shopActor=
              p.counterpart_type==="shop";

            const subtitle=
              shopActor
                ? (
                    outgoing
                      ? "Shop · You messaged this shop"
                      : "Shop · Messaged your shop"
                  )
                : (
                    p.username
                      ? "@"+p.username
                      : "Customer"
                  );

            return `<div class="m7-convo ${un.has(id)?"unread":""}" data-id="${esc(id)}" data-side="${outgoing?"viewer":"owner"}">${av(p.avatar_url,n)}<div class="m7-convo-copy"><strong>${esc(n)}</strong><small>${esc(subtitle)}</small></div>${un.has(id)?'<span class="m7-new">NEW</span>':""}<button class="m7-convo-delete" type="button" data-delete-convo="${esc(id)}" title="Delete conversation">🗑</button></div>`;
          }).join("")
        : '<div class="m7-empty">No shop messages yet.</div>';

    wireInboxDeletes(
      b,
      rows,
      ownerInbox
    );

    b.querySelectorAll(".m7-convo").forEach(el=>{
      el.onclick=()=>{
        const c=rows.find(
          x=>sameId(x.id,el.dataset.id)
        );

        if(!c){
          loadError(
            b,
            new Error("Conversation not found.")
          );
          return;
        }

        const p=
          partnerMap.get(String(c.id))||
          {};

        const outgoing=
          sameId(c.viewer_id,user?.id);

        mode=outgoing
          ? "viewer"
          : "owner";

        const n=
          p.display_name||
          (outgoing?c.shop_slug:"Customer");

        convo(
          c,
          n,
          p.avatar_url||"",
          ownerInbox,
          {
            isShop:p.counterpart_type==="shop",
            url:p.shop_url||"",
            slug:p.shop_slug||""
          }
        );
      };
    });
  }
  catch(e){
    loadError(
      document.getElementById("m7-chat-body"),
      e
    );
  }
}
window.Ma7alakChat={openShop,openInbox:viewerInbox,openViewerInbox:viewerInbox,openOwnerInbox:ownerInbox,sendStoryReply,openStoryFromMessage,close};
addEventListener("ma7alak:open-chat",e=>openShop(e.detail?.shop_slug));addEventListener("ma7alak:open-messages",viewerInbox);addEventListener("ma7alak:open-owner-messages",ownerInbox);
})();
