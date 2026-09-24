/* =========================================================
   SHOUFHON LIVE VIDEO — AGORA + SUPABASE
   Production integration for shop-owner live broadcasting.
   ========================================================= */
(function(){
"use strict";
if(window.self!==window.top)return;
if(window.__SHOUFHON_LIVE_VIDEO_V1__)return;
window.__SHOUFHON_LIVE_VIDEO_V1__=true;

const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const FN_URL=SUPABASE_URL+"/functions/v1/shoufhon-agora";
const AGORA_SDK="https://cdn.jsdelivr.net/npm/agora-rtc-sdk-ng@4.24.8/AgoraRTC_N-production.js";

let c=null,streams=[],profiles=new Map(),ownerSlug="",ownerEnt=null,streamSub=null,refreshBusy=false,injectTimer=null;
let overlay=null,mode="",activeStream=null,rtcClient=null,localAudio=null,localVideo=null,roomChannel=null,roomClientKey="",hostUid=0;
let chatChannel=null,reactionChannel=null,chatProfileCache=new Map(),viewportBound=false;
let micMuted=false,videoPaused=false,torchOn=false,cameraFacing="environment",wakeLock=null,heartbeatTimer=null,qualityProfile="720p_3",qualityChangedAt=0,leaving=false,pushedHistory=false;

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function currentPathSlug(){return String((location.pathname||"/").replace(/^\/+|\/+$/g,"").split("/")[0]||"").trim().toLowerCase()}
function client(){return window.Ma7alakAccount?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||window.Ma7alakSupabaseBootstrap?.client||window.__MA7ALAK_LIVE_FALLBACK_SUPABASE__||null}
async function ready(){for(let i=0;i<180;i++){c=client();if(c)return true;await sleep(150)}return false}
async function sessionToken(){const direct=window.Ma7alakAccount?.session?.access_token||"";if(direct)return direct;try{const{data}=await c.auth.getSession();return data?.session?.access_token||""}catch(_){return""}}

async function api(action,data={}){
  const token=await sessionToken();
  const headers={"content-type":"application/json","apikey":SUPABASE_KEY};
  if(token)headers.authorization="Bearer "+token;
  const res=await fetch(FN_URL,{method:"POST",headers,body:JSON.stringify({action,...data}),credentials:"omit"});
  let body={};try{body=await res.json()}catch(_){}
  if(!res.ok){const code=String(body?.error||("HTTP_"+res.status)),e=new Error(code);e.code=code;e.status=res.status;throw e}
  return body;
}
function friendlyError(err){
  const code=String(err?.code||err?.message||err||"");
  if(code==="AGORA_NOT_CONFIGURED")return"Live video is installed but the secure Agora certificate still needs to be added to Supabase.";
  if(code==="AUTH_REQUIRED")return"Please log in as the shop owner first.";
  if(code==="NOT_OWNER")return"This account is not the owner of this shop.";
  if(code==="LIVE_NOT_ENABLED")return"Live & Offers is not enabled for this shop.";
  if(code==="VIDEO_LIVE_NOT_ENABLED")return"Video Live is turned off for this shop by ShoufHon admin.";
  if(code==="MONTHLY_LIVE_LIMIT_REACHED")return"This shop used its Video Live minutes for this month.";
  if(code==="LIVE_NOT_AVAILABLE")return"This live has ended.";
  if(/permission|NotAllowedError/i.test(code))return"Camera or microphone permission was blocked.";
  return code.replace(/^Error:\s*/,"")||"Something went wrong.";
}

function ensureCss(){
  if($("#m7lv-css"))return;
  const s=document.createElement("style");s.id="m7lv-css";s.textContent=`
.m7lv-inline{margin:10px 0 13px!important}.m7lv-inline-title{display:flex;align-items:center;gap:7px;margin:0 0 8px;color:#fff;font:900 12px/1.2 Arial,sans-serif}.m7lv-live-dot{width:7px;height:7px;border-radius:50%;background:#ff3154;box-shadow:0 0 0 0 rgba(255,49,84,.55);animation:m7lvPulse 1.35s ease-out infinite}@keyframes m7lvPulse{70%{box-shadow:0 0 0 7px rgba(255,49,84,0)}100%{box-shadow:0 0 0 0 rgba(255,49,84,0)}}.m7lv-strip{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:1px 1px 4px}.m7lv-strip::-webkit-scrollbar{display:none}.m7lv-card{position:relative;flex:0 0 min(78vw,310px);height:152px;border:1px solid rgba(255,255,255,.1);border-radius:19px;overflow:hidden;background:linear-gradient(135deg,#191919,#090909);cursor:pointer;isolation:isolate;box-shadow:0 14px 30px rgba(0,0,0,.22)}.m7lv-card-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.8) brightness(.4);transform:scale(1.03);z-index:-2}.m7lv-card::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.24)),linear-gradient(to top,rgba(0,0,0,.72),transparent 65%)}.m7lv-card-copy{position:absolute;left:14px;right:14px;bottom:13px;color:#fff}.m7lv-card-badge{display:inline-flex;align-items:center;gap:6px;background:#ea2449;color:#fff;border-radius:999px;padding:5px 8px;font:950 10px/1 Arial,sans-serif;margin-bottom:7px}.m7lv-card h3{margin:0 0 3px;font:950 17px/1.1 Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7lv-card small{display:block;color:rgba(255,255,255,.72);font:750 11px/1.2 Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#m7lv-overlay{position:fixed;left:0;right:0;top:0;height:100dvh;z-index:2147483600;background:#000;color:#fff;font-family:Arial,"Segoe UI",sans-serif;overflow:hidden;overscroll-behavior:none}#m7lv-overlay *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}#m7lv-overlay button,#m7lv-overlay input{font:inherit}#m7lv-overlay button{outline:none}.m7lv-app{position:relative;width:min(100%,680px);height:100%;margin:0 auto;background:#000;overflow:hidden}.m7lv-stage{position:absolute;inset:0;background:#080808;overflow:hidden}#m7lv-local,#m7lv-remote{position:absolute;inset:0;width:100%;height:100%;background:#080808}#m7lv-local>div,#m7lv-remote>div{width:100%!important;height:100%!important}#m7lv-local video,#m7lv-remote video{width:100%!important;height:100%!important;object-fit:cover!important}#m7lv-local.mirror video{transform:scaleX(-1)!important}.m7lv-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.54),rgba(0,0,0,.03) 25%,rgba(0,0,0,.02) 55%,rgba(0,0,0,.76) 100%)}.m7lv-topbar{position:absolute;z-index:40;left:0;right:0;top:0;padding:max(12px,env(safe-area-inset-top)) 12px 8px;display:flex;align-items:center;justify-content:space-between;gap:10px}.m7lv-shophead{min-width:0;display:flex;align-items:center;gap:9px}.m7lv-shop-avatar{width:38px;height:38px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#1b1b1b;border:1px solid rgba(255,255,255,.28);box-shadow:0 5px 18px rgba(0,0,0,.28);flex:0 0 auto;font-size:13px;font-weight:950}.m7lv-shop-avatar img{width:100%;height:100%;object-fit:cover}.m7lv-brand{min-width:0}.m7lv-brand-line{display:flex;align-items:center;gap:6px;min-width:0}.m7lv-brand strong{max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;text-shadow:0 1px 6px #000}.m7lv-live-chip{display:inline-flex;align-items:center;height:21px;padding:0 7px;border-radius:999px;background:#ed2450;color:#fff;font-size:8px;font-weight:950;letter-spacing:.4px}.m7lv-brand small{display:block;margin-top:2px;color:rgba(255,255,255,.72);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}.m7lv-top-actions{display:flex;align-items:center;gap:6px}.m7lv-pill{display:flex;align-items:center;gap:5px;height:30px;padding:0 8px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(8,8,8,.48);backdrop-filter:blur(12px);font-weight:900;font-size:10px}.m7lv-qdot{width:7px;height:7px;border-radius:50%;background:#777}.m7lv-close{width:32px;height:32px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(8,8,8,.5);backdrop-filter:blur(12px);color:#fff;font-size:20px;line-height:1;display:grid;place-items:center}.m7lv-status{position:absolute;z-index:32;left:50%;top:max(61px,calc(env(safe-area-inset-top) + 49px));transform:translateX(-50%);max-width:78%;padding:6px 10px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:rgba(0,0,0,.38);backdrop-filter:blur(10px);color:rgba(255,255,255,.88);font-size:10px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.m7lv-host-controls{position:absolute;z-index:35;right:10px;top:50%;transform:translateY(-42%);display:flex;flex-direction:column;gap:10px}.m7lv-host-btn,.m7lv-react-btn{width:48px;height:48px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(8,8,8,.48);backdrop-filter:blur(12px);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;box-shadow:0 5px 16px rgba(0,0,0,.22)}.m7lv-host-btn b,.m7lv-react-btn b{font-size:18px;line-height:1}.m7lv-host-btn span{font-size:7px;font-weight:900;color:rgba(255,255,255,.78)}.m7lv-host-btn.on{background:#fff;color:#111}.m7lv-host-btn.on span{color:#111}.m7lv-host-end{background:#e5234b;border-color:#ef4262}.m7lv-react-btn{position:absolute;z-index:35;right:12px;bottom:max(86px,calc(env(safe-area-inset-bottom) + 76px));width:50px;height:50px;font-size:22px}.m7lv-react-btn b{font-size:23px}.m7lv-comments{position:absolute;z-index:34;left:10px;right:78px;bottom:max(75px,calc(env(safe-area-inset-bottom) + 66px));max-height:36%;overflow:auto;scrollbar-width:none;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;mask-image:linear-gradient(to bottom,transparent 0,#000 14%,#000 100%);padding-top:26px;overscroll-behavior:contain}.m7lv-comments::-webkit-scrollbar{display:none}.m7lv-msg{max-width:min(94%,430px);display:flex;align-items:flex-start;gap:7px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.75)}.m7lv-msg-avatar{width:27px;height:27px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:rgba(35,35,35,.82);border:1px solid rgba(255,255,255,.2);flex:0 0 auto;font-size:9px;font-weight:950}.m7lv-msg-avatar img{width:100%;height:100%;object-fit:cover}.m7lv-msg-body{min-width:0;padding:5px 8px 6px;border-radius:12px;background:rgba(0,0,0,.42);backdrop-filter:blur(8px)}.m7lv-msg.host .m7lv-msg-body{background:rgba(151,18,48,.56);border:1px solid rgba(255,94,126,.28)}.m7lv-msg-meta{display:flex;align-items:center;gap:5px;min-width:0;margin-bottom:1px}.m7lv-msg-name{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.86);font-size:9px;font-weight:950}.m7lv-host-tag{flex:0 0 auto;padding:2px 5px;border-radius:999px;background:#f32b54;color:#fff;font-size:7px;font-weight:950;letter-spacing:.35px}.m7lv-msg-text{display:block;font-size:12px;line-height:1.28;color:#fff;word-break:break-word}.m7lv-composer{position:absolute;z-index:36;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:8px}.m7lv-input-wrap{flex:1;display:flex;align-items:center;gap:8px;min-width:0;height:46px;padding:0 12px;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(12,12,12,.58);backdrop-filter:blur(14px)}.m7lv-input-wrap input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#fff;font-size:13px}.m7lv-input-wrap input::placeholder{color:rgba(255,255,255,.55)}.m7lv-send-btn{height:38px;padding:0 14px;border:0;border-radius:999px;background:#fff;color:#111;font-size:11px;font-weight:950}.m7lv-guest-login{position:absolute;z-index:36;left:12px;bottom:max(12px,env(safe-area-inset-bottom));height:38px;padding:0 13px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(10,10,10,.5);backdrop-filter:blur(12px);color:rgba(255,255,255,.82);font-size:10px;font-weight:900}.m7lv-heart{position:absolute;z-index:45;right:29px;bottom:105px;font-size:27px;pointer-events:none;animation:m7lvHeart 1.55s ease-out forwards}@keyframes m7lvHeart{0%{opacity:0;transform:translateY(8px) scale(.72)}15%{opacity:1}100%{opacity:0;transform:translateY(-180px) translateX(-16px) scale(1.25) rotate(10deg)}}
#m7lv-preflight{position:fixed;inset:0;z-index:2147483601;display:grid;place-items:end center;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);padding:12px}.m7lv-sheet{width:min(100%,520px);border:1px solid rgba(255,255,255,.11);border-radius:25px;background:#0d0d0e;color:#fff;padding:18px;box-shadow:0 24px 60px rgba(0,0,0,.55)}.m7lv-sheet-mark{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border-radius:999px;background:rgba(235,35,76,.12);color:#ff708b;font-size:9px;font-weight:950;letter-spacing:.5px}.m7lv-sheet h2{margin:10px 0 5px;font-size:24px}.m7lv-sheet p{margin:0 0 14px;color:#9c9c9c;font-size:12px;line-height:1.45}.m7lv-sheet input{width:100%;border:1px solid #2b2b2b;border-radius:15px;background:#161616;color:#fff;padding:14px;outline:none;font-size:15px}.m7lv-sheet-actions{display:grid;grid-template-columns:1fr 1.6fr;gap:9px;margin-top:11px}.m7lv-sheet-actions button{border:0;border-radius:14px;min-height:50px;font-weight:950}.m7lv-cancel{background:#222;color:#fff}.m7lv-start{background:linear-gradient(135deg,#ef3156,#c9153d);color:#fff}.m7lv-start:disabled{opacity:.45}.m7lv-pre-status{min-height:18px;margin-top:8px;color:#ffb4c1;font-size:11px}
@media(max-width:520px){.m7lv-app{width:100%}.m7lv-brand strong{max-width:125px}.m7lv-brand small{max-width:145px}.m7lv-pill{height:28px;padding:0 7px}.m7lv-host-controls{right:8px}.m7lv-comments{right:70px;max-height:34%}.m7lv-msg-text{font-size:12px}.m7lv-guest-login{max-width:55vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
`;
  document.head.appendChild(s);
}

function ownerState(){ownerSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||window.Ma7alakOwnerAuth?.shop?.shop_slug||window.Ma7alakLiveOffers?.ownerSlug||"").trim().toLowerCase()}
async function loadOwnerEnt(){ownerState();ownerEnt=null;if(!ownerSlug||!c)return;try{const r=await c.from("shop_live_entitlements").select("enabled,active_limit,max_duration_hours,video_live_enabled,video_live_monthly_minutes").eq("shop_slug",ownerSlug).maybeSingle();if(!r.error)ownerEnt=r.data||null}catch(_){}}
function liveFresh(x){if(!x||x.status!=="live")return false;return new Date(x.last_heartbeat_at||0).getTime()>Date.now()-120000&&new Date(x.expires_at||0).getTime()>Date.now()}

async function refresh(){
  if(!c||refreshBusy)return;refreshBusy=true;
  try{
    const r=await c.from("shop_live_streams").select("id,shop_slug,title,status,started_at,last_heartbeat_at,expires_at").eq("status","live").order("started_at",{ascending:false}).limit(30);
    if(r.error)return;
    streams=(r.data||[]).filter(liveFresh);
    const slugs=[...new Set(streams.map(x=>String(x.shop_slug||"").toLowerCase()).filter(Boolean))];profiles=new Map();
    if(slugs.length){const p=await c.from("shop_profiles").select("shop_slug,shop_name,arabic_name,profile_image_url,shop_url").in("shop_slug",slugs);(p.error?[]:(p.data||[])).forEach(x=>profiles.set(String(x.shop_slug).toLowerCase(),x))}
    emitLiveState();
    if(overlay&&mode==="audience"&&activeStream&&!streams.some(x=>String(x.id)===String(activeStream.id))){
      setStatus("Live ended.");
      setTimeout(()=>cleanupOverlay(false),650);
    }
  }finally{refreshBusy=false}
}
function cardHtml(x){
  const p=profiles.get(String(x.shop_slug).toLowerCase())||{},name=p.shop_name||p.arabic_name||x.shop_slug,img=p.profile_image_url||"";
  return `<article class="m7lv-card" data-m7lv-watch="${esc(x.id)}">${img?`<div class="m7lv-card-bg" style="background-image:url('${esc(img)}')"></div>`:""}<div class="m7lv-card-copy"><div class="m7lv-card-badge"><i class="m7lv-live-dot"></i> LIVE NOW</div><h3>${esc(x.title||"Live now")}</h3><small>${esc(name)} · Tap to watch live</small></div></article>`;
}
function injectIntoRoot(root,list){
  root.querySelector(".m7lv-inline")?.remove();if(!list.length)return;
  const wrap=document.createElement("div");wrap.className="m7lv-inline";wrap.innerHTML=`<div class="m7lv-inline-title"><i class="m7lv-live-dot"></i> VIDEO LIVE</div><div class="m7lv-strip">${list.map(cardHtml).join("")}</div>`;
  const head=root.querySelector(".m7lo-head");if(head)head.insertAdjacentElement("afterend",wrap);else root.prepend(wrap);
  wrap.querySelectorAll("[data-m7lv-watch]").forEach(el=>el.addEventListener("click",()=>openViewer(el.dataset.m7lvWatch)));
}
function injectOwnerButton(){
  ownerState();if(!ownerSlug)return;
  const attach=bar=>{
    if(!bar)return;
    let btn=bar.querySelector(".m7lv-owner-go");
    const live=streams.find(x=>String(x.shop_slug).toLowerCase()===ownerSlug);
    if(!btn){
      btn=document.createElement("button");
      btn.type="button";
      btn.className="m7lv-owner-go";
      bar.appendChild(btn);
    }
    btn.disabled=!ownerEnt?.enabled;
    btn.textContent=live?"🔴 Resume Live":"📹 Go Live";
    btn.onclick=()=>{
      if(!ownerEnt?.enabled)return;
      preflight();
    };
  };

  document.querySelectorAll('[data-ma7alak-live="shop"]').forEach(root=>{
    const slug=String(root.dataset.shopSlug||currentPathSlug()).toLowerCase();
    if(slug===ownerSlug)attach(root.querySelector(".m7lo-owner"));
  });

  /* The manual Hostinger shop widget lives inside an iframe.
     Its + button opens the real Live & Offers owner panel in
     the top-level page. Put Go Live inside that management panel too. */
  document.querySelectorAll("#m7lo-overlay .m7lo-shop-panel .m7lo-owner").forEach(attach);
}
function inject(){
  document.querySelectorAll('[data-ma7alak-live="home"]').forEach(root=>injectIntoRoot(root,streams));
  document.querySelectorAll('[data-ma7alak-live="shop"]').forEach(root=>{const slug=String(root.dataset.shopSlug||currentPathSlug()).toLowerCase(),list=streams.filter(x=>String(x.shop_slug).toLowerCase()===slug);if(list.length)root.style.display="";injectIntoRoot(root,list)});
  document.querySelectorAll('#m7lo-overlay .m7lo-shop-panel[data-shop-slug]').forEach(panel=>{
    const slug=String(panel.dataset.shopSlug||"").trim().toLowerCase();
    const list=streams.filter(x=>String(x.shop_slug||"").trim().toLowerCase()===slug);
    const section=panel.querySelector(".m7lo");
    if(section)injectIntoRoot(section,list);
  });
  injectOwnerButton();
}

function loadAgora(){if(window.AgoraRTC)return Promise.resolve(window.AgoraRTC);if(window.__M7LV_AGORA_PROMISE__)return window.__M7LV_AGORA_PROMISE__;window.__M7LV_AGORA_PROMISE__=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=AGORA_SDK;s.async=true;s.onload=()=>resolve(window.AgoraRTC);s.onerror=()=>reject(new Error("Agora SDK failed to load."));document.head.appendChild(s)});return window.__M7LV_AGORA_PROMISE__}
function lock(){document.documentElement.style.overflow="hidden";document.body.style.overflow="hidden"}function unlock(){document.documentElement.style.overflow="";document.body.style.overflow=""}

function viewerCanInteract(){return !!window.Ma7alakAccount?.session?.user}
function currentViewerIdentity(){
  const p=window.Ma7alakAccount?.profile||{},u=window.Ma7alakAccount?.user||{};
  return {
    user_id:String(u?.id||""),
    name:String(p.display_name||u?.user_metadata?.full_name||u?.user_metadata?.name||"ShoufHon User"),
    avatar:String(p.avatar_url||u?.user_metadata?.avatar_url||u?.user_metadata?.picture||"")
  };
}
function overlayBase(stream,host){
  const p=profiles.get(String(stream.shop_slug||ownerSlug).toLowerCase())||window.Ma7alakOwnerAuth?.shop||{};
  const name=p.shop_name||p.arabic_name||stream.shop_slug||"ShoufHon Live";
  const avatar=p.profile_image_url||"";
  const initial=(name.charAt(0)||"S").toUpperCase();
  const interactive=host||viewerCanInteract();
  const composer=interactive
    ? `<div class="m7lv-composer"><div class="m7lv-input-wrap"><input id="m7lv-chat-input" maxlength="160" autocomplete="off" placeholder="${host?"Talk to your viewers…":"Say something…"}"></div><button id="m7lv-send" class="m7lv-send-btn" type="button">Send</button></div>`
    : `<button id="m7lv-login-chat" class="m7lv-guest-login" type="button">Log in to chat & react</button>`;
  const viewerReaction=!host&&interactive?`<button class="m7lv-react-btn" id="m7lv-heart-view" type="button" aria-label="Send heart"><b>❤</b></button>`:"";
  const hostControls=host?`<div class="m7lv-host-controls">
      <button class="m7lv-host-btn" id="m7lv-switch" type="button"><b>↻</b><span>Flip</span></button>
      <button class="m7lv-host-btn" id="m7lv-mute" type="button"><b>🎤</b><span>Mic</span></button>
      <button class="m7lv-host-btn" id="m7lv-pause" type="button"><b>▣</b><span>Pause</span></button>
      <button class="m7lv-host-btn" id="m7lv-torch" type="button"><b>⚡</b><span>Flash</span></button>
      <button class="m7lv-host-btn m7lv-host-end" id="m7lv-end" type="button"><b>■</b><span>End</span></button>
    </div>`:"";
  return `<div class="m7lv-app">
    <div id="m7lv-stage" class="m7lv-stage"><div id="m7lv-local"></div><div id="m7lv-remote"></div><div class="m7lv-shade"></div></div>
    <div class="m7lv-topbar">
      <div class="m7lv-shophead">
        <div class="m7lv-shop-avatar">${avatar?`<img src="${esc(avatar)}" alt="">`:esc(initial)}</div>
        <div class="m7lv-brand"><div class="m7lv-brand-line"><strong>${esc(name)}</strong><span class="m7lv-live-chip">LIVE</span></div><small>${esc(stream.title||"Live now")}</small></div>
      </div>
      <div class="m7lv-top-actions"><div class="m7lv-pill"><i id="m7lv-qdot" class="m7lv-qdot"></i><span id="m7lv-qtext">Checking…</span></div><div class="m7lv-pill">👥 <span id="m7lv-count">0</span></div>${host?"":'<button id="m7lv-close" class="m7lv-close" type="button">×</button>'}</div>
    </div>
    <div id="m7lv-status" class="m7lv-status">${host?"Starting camera…":"Connecting to live…"}</div>
    ${hostControls}
    <div id="m7lv-chat-list" class="m7lv-comments"></div>
    ${viewerReaction}
    ${composer}
  </div>`;
}
function syncLiveViewport(){
  if(!overlay)return;
  const vv=window.visualViewport;
  const h=Math.round(vv?.height||window.innerHeight||document.documentElement.clientHeight||0);
  const top=Math.round(vv?.offsetTop||0);
  if(h>0)overlay.style.height=h+"px";
  overlay.style.top=top+"px";
}
function bindLiveViewport(){
  if(viewportBound)return;
  viewportBound=true;
  window.visualViewport?.addEventListener("resize",syncLiveViewport);
  window.visualViewport?.addEventListener("scroll",syncLiveViewport);
  window.addEventListener("resize",syncLiveViewport);
}
function unbindLiveViewport(){
  if(!viewportBound)return;
  viewportBound=false;
  window.visualViewport?.removeEventListener("resize",syncLiveViewport);
  window.visualViewport?.removeEventListener("scroll",syncLiveViewport);
  window.removeEventListener("resize",syncLiveViewport);
}

function setStatus(v){const e=$("#m7lv-status",overlay);if(e)e.textContent=String(v||"")}function setQuality(label,color){const t=$("#m7lv-qtext",overlay),d=$("#m7lv-qdot",overlay);if(t)t.textContent=label;if(d)d.style.background=color}
function quality(q){if(q===1)return["Excellent","#35d07f"];if(q===2)return["Good","#75d45b"];if(q===3)return["Fair","#e8be3e"];if(q===4)return["Weak","#f18438"];if(q===5)return["Very weak","#ef4444"];if(q===6)return["Disconnected","#dc2626"];return["Checking…","#888"]}

function createOverlay(stream,host){
  closePreflight();if(overlay)cleanupOverlay(false);
  overlay=document.createElement("div");overlay.id="m7lv-overlay";overlay.innerHTML=overlayBase(stream,host);document.body.appendChild(overlay);lock();activeStream=stream;mode=host?"host":"audience";
  if(!host){$("#m7lv-local",overlay).style.display="none";$("#m7lv-close",overlay).onclick=()=>cleanupOverlay(false)}else $("#m7lv-remote",overlay).style.display="none";
  if(!pushedHistory){try{history.pushState({m7lv:true},"",location.href);pushedHistory=true}catch(_){}}
  bindLiveViewport();syncLiveViewport();
  $("#m7lv-login-chat",overlay)?.addEventListener("click",()=>window.Ma7alakAccount?.open?.());
}
function preflight(){
  if($("#m7lv-preflight"))return;
  try{window.Ma7alakLiveOffers?.close?.()}catch(_){}
  const p=document.createElement("div");p.id="m7lv-preflight";const shop=window.Ma7alakOwnerAuth?.shop||{};
  const allowed=!!ownerEnt?.enabled&&!!ownerEnt?.video_live_enabled;
  p.innerHTML=`<div class="m7lv-sheet"><div class="m7lv-sheet-mark">● SHOUFHON VIDEO LIVE</div><h2>Ready to go live?</h2><p>Rear camera starts first. While live you get one clean control rail for camera, mic, pause, flash and End Live. Comments appear directly over the video.</p><input id="m7lv-title" maxlength="80" placeholder="Add a short live title (optional)"><div class="m7lv-sheet-actions"><button class="m7lv-cancel" type="button">Cancel</button><button class="m7lv-start" type="button" ${allowed?"":"disabled"}>${allowed?"Start Live":"Live disabled"}</button></div><div class="m7lv-pre-status">${allowed?"":"Video Live is disabled for this shop in Admin."}</div></div>`;document.body.appendChild(p);
  const cancel=$(".m7lv-cancel",p),start=$(".m7lv-start",p),st=$(".m7lv-pre-status",p);cancel.onclick=closePreflight;start.onclick=async()=>{start.disabled=true;st.textContent="Preparing secure live session…";try{const title=$("#m7lv-title",p).value.trim()||`${shop.shop_name||ownerSlug} is live`;await startHost(title)}catch(err){st.textContent=friendlyError(err);start.disabled=false}}
}
function closePreflight(){document.querySelector("#m7lv-preflight")?.remove()}

function hostChatIdentity(){
  const p=profiles.get(String(activeStream?.shop_slug||ownerSlug).toLowerCase())||window.Ma7alakOwnerAuth?.shop||{};
  const slug=String(activeStream?.shop_slug||ownerSlug||"").trim();
  return {name:String(p.shop_name||p.arabic_name||slug||"Shop"),avatar:String(p.profile_image_url||""),host:true};
}
async function resolveViewerProfile(userId){
  const id=String(userId||"");
  if(!id)return{name:"Viewer",avatar:""};
  const me=currentViewerIdentity();
  if(me.user_id===id)return{name:me.name,avatar:me.avatar};
  if(chatProfileCache.has(id))return chatProfileCache.get(id);
  let value={name:"Viewer",avatar:""};
  try{
    const r=await c.from("viewer_profiles").select("display_name,avatar_url").eq("user_id",id).maybeSingle();
    if(!r.error&&r.data)value={name:String(r.data.display_name||"Viewer"),avatar:String(r.data.avatar_url||"")};
  }catch(_){}
  chatProfileCache.set(id,value);
  return value;
}
async function renderChatRow(row){
  if(!overlay||!row?.message)return;
  const list=$("#m7lv-chat-list",overlay);if(!list)return;
  const isHost=row.sender_role==="host";
  const fallback=isHost?hostChatIdentity():await resolveViewerProfile(row.user_id);
  const identity={
    name:String(row.sender_name||fallback.name||"Viewer"),
    avatar:String(row.sender_avatar||fallback.avatar||"")
  };
  if(!overlay||!list.isConnected)return;
  const d=document.createElement("div");d.className="m7lv-msg"+(isHost?" host":"");
  const av=document.createElement("div");av.className="m7lv-msg-avatar";
  if(identity.avatar){
    const img=document.createElement("img");img.src=identity.avatar;img.alt="";img.loading="lazy";
    img.onerror=()=>{img.remove();av.textContent=(identity.name.charAt(0)||"?").toUpperCase()};av.appendChild(img);
  }else av.textContent=(identity.name.charAt(0)||"?").toUpperCase();
  const body=document.createElement("div");body.className="m7lv-msg-body";
  const meta=document.createElement("div");meta.className="m7lv-msg-meta";
  const nm=document.createElement("span");nm.className="m7lv-msg-name";nm.textContent=identity.name;meta.appendChild(nm);
  if(isHost){const tag=document.createElement("span");tag.className="m7lv-host-tag";tag.textContent="LIVE HOST";meta.appendChild(tag)}
  const txt=document.createElement("span");txt.className="m7lv-msg-text";txt.textContent=String(row.message).slice(0,160);
  body.append(meta,txt);d.append(av,body);list.appendChild(d);
  while(list.children.length>40)list.firstChild.remove();
  requestAnimationFrame(()=>{list.scrollTop=list.scrollHeight});
}
async function loadRecentChat(){
  if(!activeStream||!c)return;
  try{
    const r=await c.from("shop_live_chat_messages").select("id,stream_id,user_id,sender_role,sender_name,sender_avatar,message,created_at").eq("stream_id",activeStream.id).order("created_at",{ascending:true}).limit(40);
    if(r.error)return;
    const list=$("#m7lv-chat-list",overlay);if(list)list.innerHTML="";
    for(const row of (r.data||[]))await renderChatRow(row);
  }catch(_){}
}
async function setupInteractions(){
  if(!activeStream||!c)return;
  try{if(chatChannel)await c.removeChannel(chatChannel)}catch(_){}
  try{if(reactionChannel)await c.removeChannel(reactionChannel)}catch(_){}
  await loadRecentChat();
  chatChannel=c.channel("m7lv-chat:"+activeStream.id)
    .on("postgres_changes",{event:"INSERT",schema:"public",table:"shop_live_chat_messages",filter:"stream_id=eq."+activeStream.id},payload=>renderChatRow(payload.new))
    .subscribe();
  reactionChannel=c.channel("m7lv-react:"+activeStream.id)
    .on("postgres_changes",{event:"*",schema:"public",table:"shop_live_reactions",filter:"stream_id=eq."+activeStream.id},()=>spawnHeart())
    .subscribe();
  wireChat();
}
async function setupRoom(nextRole){
  roomClientKey=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()).replace(/-/g,"").slice(0,18);
  roomChannel=c.channel("m7lv:"+activeStream.id,{config:{presence:{key:roomClientKey}}});
  roomChannel.on("presence",{event:"sync"},updateCount).subscribe(async status=>{
    if(status==="SUBSCRIBED"){
      try{
        const id=nextRole==="host"?hostChatIdentity():currentViewerIdentity();
        await roomChannel.track({role:nextRole,name:id.name||"Viewer",avatar:id.avatar||"",joined_at:new Date().toISOString()});
      }catch(_){}
      updateCount();
    }
  });
  await setupInteractions();
}
function updateCount(){if(!roomChannel||!overlay)return;let count=0;try{Object.values(roomChannel.presenceState()).flat().forEach(p=>{if(p?.role==="audience")count++})}catch(_){}const e=$("#m7lv-count",overlay);if(e)e.textContent=String(count)}
function spawnHeart(){if(!overlay)return;const stage=$("#m7lv-stage",overlay);if(!stage)return;const h=document.createElement("div");h.className="m7lv-heart";h.textContent=["❤","💛","💚","💙","💜"][Math.floor(Math.random()*5)];h.style.right=(18+Math.random()*56)+"px";stage.appendChild(h);setTimeout(()=>h.remove(),1600)}
async function sendHeart(){
  if(mode==="host"||!viewerCanInteract()||!activeStream)return;
  try{await c.rpc("shoufhon_live_react",{p_stream_id:activeStream.id})}catch(_){}
}
function wireChat(){
  const input=$("#m7lv-chat-input",overlay),send=$("#m7lv-send",overlay),heart=$("#m7lv-heart-view",overlay);
  const canSend=mode==="host"||viewerCanInteract();
  const go=async()=>{
    if(!canSend||!activeStream)return;
    const text=String(input?.value||"").trim();if(!text)return;
    input.value="";
    const user=window.Ma7alakAccount?.session?.user;
    if(!user?.id){window.Ma7alakAccount?.open?.();return}
    try{
      const r=await c.from("shop_live_chat_messages").insert({stream_id:activeStream.id,user_id:user.id,message:text});
      if(r.error)throw r.error;
    }catch(err){setStatus(String(err?.message||"Could not send message."))}
  };
  if(send)send.onclick=go;
  if(heart&&viewerCanInteract())heart.onclick=sendHeart;
  if(input){
    input.addEventListener("focus",()=>setTimeout(syncLiveViewport,80));
    input.addEventListener("blur",()=>setTimeout(syncLiveViewport,100));
    input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();go()}});
  }
}

async function acquireWake(){if(!("wakeLock" in navigator))return;try{wakeLock=await navigator.wakeLock.request("screen")}catch(_){}}async function releaseWake(){try{await wakeLock?.release()}catch(_){}wakeLock=null}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&overlay)acquireWake()});

async function tryRear(){if(!localVideo)return;try{await localVideo.setDevice({facingMode:"environment"});cameraFacing="environment";$("#m7lv-local",overlay)?.classList.remove("mirror")}catch(_){}}
async function switchCamera(){if(!localVideo)return;const next=cameraFacing==="environment"?"user":"environment";setStatus("Switching camera…");try{await localVideo.setDevice({facingMode:next});cameraFacing=next;$("#m7lv-local",overlay)?.classList.toggle("mirror",next==="user");setStatus("Camera switched.");return}catch(_){}try{const cams=await window.AgoraRTC.getCameras();if(cams.length>1){const cur=localVideo.getTrackLabel?localVideo.getTrackLabel():"";let idx=cams.findIndex(x=>x.label===cur);idx=(idx+1)%cams.length;await localVideo.setDevice(cams[idx].deviceId);cameraFacing=next;$("#m7lv-local",overlay)?.classList.toggle("mirror",next==="user");setStatus("Camera switched.")}else setStatus("Only one camera is available.")}catch(_){setStatus("Camera switch is not supported here.")}}
async function toggleMic(){if(!localAudio)return;micMuted=!micMuted;await localAudio.setMuted(micMuted);["#m7lv-mute","#m7lv-mute-f"].forEach(s=>$(s,overlay)?.classList.toggle("on",micMuted));const f=$("#m7lv-mute-f",overlay);if(f)f.textContent=micMuted?"🔇":"🎤";const b=$("#m7lv-mute b",overlay);if(b)b.textContent=micMuted?"🔇":"🎤"}
async function toggleVideo(){if(!localVideo)return;videoPaused=!videoPaused;await localVideo.setEnabled(!videoPaused);["#m7lv-pause","#m7lv-pause-f"].forEach(s=>$(s,overlay)?.classList.toggle("on",videoPaused));const f=$("#m7lv-pause-f",overlay);if(f)f.textContent=videoPaused?"🚫":"🎥";setStatus(videoPaused?"Video paused. Audio is still live.":"Video resumed.")}
async function toggleTorch(){if(!localVideo)return;try{const track=localVideo.getMediaStreamTrack(),caps=track.getCapabilities?track.getCapabilities():{};if(!caps.torch){setStatus("Flash is not supported by this phone/browser.");return}torchOn=!torchOn;await track.applyConstraints({advanced:[{torch:torchOn}]});["#m7lv-torch","#m7lv-torch-f"].forEach(s=>$(s,overlay)?.classList.toggle("on",torchOn));setStatus(torchOn?"Flash on.":"Flash off.")}catch(_){setStatus("Flash is not available on this camera.")}}
async function fullscreen(){try{if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if($("#m7lv-stage",overlay)?.webkitRequestFullscreen)$("#m7lv-stage",overlay).webkitRequestFullscreen()}else if(document.exitFullscreen)await document.exitFullscreen()}catch(_){setStatus("Fullscreen is controlled by this browser.")}}

async function adapt(q){if(mode!=="host"||!localVideo)return;const now=Date.now();if(now-qualityChangedAt<8000)return;try{if(q>=5&&qualityProfile!=="360p_7"){await localVideo.setEncoderConfiguration("360p_7");qualityProfile="360p_7";qualityChangedAt=now}else if(q===4&&qualityProfile!=="480p_2"){await localVideo.setEncoderConfiguration("480p_2");qualityProfile="480p_2";qualityChangedAt=now}else if(q>0&&q<=2&&qualityProfile!=="720p_3"){await localVideo.setEncoderConfiguration("720p_3");qualityProfile="720p_3";qualityChangedAt=now}}catch(_){}}
async function renewToken(){if(!rtcClient||!activeStream)return;try{const r=mode==="host"?await api("host-token",{stream_id:activeStream.id,uid:hostUid}):await api("join",{stream_id:activeStream.id,uid:hostUid});if(r?.token)await rtcClient.renewToken(r.token)}catch(err){console.warn("ShoufHon Live token renewal failed",err)}}
function wireRtcEvents(){rtcClient.on("network-quality",async q=>{const raw=mode==="host"?q.uplinkNetworkQuality:q.downlinkNetworkQuality,[label,color]=quality(raw);setQuality(label,color);await adapt(raw)});rtcClient.on("connection-state-change",cur=>{if(cur==="RECONNECTING")setStatus("Connection weak — reconnecting automatically…");else if(cur==="CONNECTED"&&mode==="host")setStatus("You are LIVE.");else if(cur==="DISCONNECTED"&&overlay)setStatus("Disconnected. Waiting for network…")});rtcClient.on("token-privilege-will-expire",renewToken);rtcClient.on("token-privilege-did-expire",renewToken)}

async function startHost(title){
  await loadAgora();const start=await api("start",{shop_slug:ownerSlug,title}),stream={...start.stream,shop_slug:ownerSlug,title:start.stream?.title||title};createOverlay(stream,true);activeStream=stream;hostUid=Number(start.uid)||0;
  try{
    rtcClient=window.AgoraRTC.createClient({mode:"live",codec:"vp8"});await rtcClient.setClientRole("host");wireRtcEvents();await rtcClient.join(start.app_id,start.stream.channel_name,start.token,hostUid);
    [localAudio,localVideo]=await window.AgoraRTC.createMicrophoneAndCameraTracks({}, {encoderConfig:"720p_3",optimizationMode:"motion"});await tryRear();localVideo.play($("#m7lv-local",overlay));await rtcClient.publish([localAudio,localVideo]);await setupRoom("host");await api("activate",{stream_id:stream.id});activeStream.status="live";setStatus("You are LIVE.");await acquireWake();heartbeatTimer=setInterval(async()=>{
      try{await api("heartbeat",{stream_id:stream.id})}
      catch(err){
        const code=String(err?.code||err?.message||"");
        if(code==="MONTHLY_LIVE_LIMIT_REACHED"||code==="VIDEO_LIVE_NOT_ENABLED"||code==="LIVE_NOT_ENABLED"){
          setStatus(friendlyError(err));
          setTimeout(()=>cleanupOverlay(false),1200);
        }
      }
    },30000);wireHostControls();await refresh();
  }catch(err){try{await api("fail",{stream_id:stream.id})}catch(_){}setStatus(friendlyError(err));setTimeout(()=>cleanupOverlay(false),2200);throw err}
}
function wireHostControls(){const bind=(id,fn)=>{const e=$(id,overlay);if(e)e.onclick=fn};bind("#m7lv-switch",switchCamera);bind("#m7lv-mute",toggleMic);bind("#m7lv-pause",toggleVideo);bind("#m7lv-torch",toggleTorch);bind("#m7lv-end",endLive)}

async function openViewer(id){
  if(overlay)return;const base=streams.find(x=>String(x.id)===String(id));if(!base)return;await loadAgora();let join;try{join=await api("join",{stream_id:id})}catch(err){alert(friendlyError(err));await refresh();return}
  const stream={...base,...join.stream};createOverlay(stream,false);hostUid=Number(join.uid)||0;
  try{
    rtcClient=window.AgoraRTC.createClient({mode:"live",codec:"vp8"});await rtcClient.setClientRole("audience");wireRtcEvents();rtcClient.on("user-published",async(user,mediaType)=>{try{await rtcClient.subscribe(user,mediaType);if(mediaType==="video"){user.videoTrack.play($("#m7lv-remote",overlay));setStatus("Live video connected.")}if(mediaType==="audio")user.audioTrack.play()}catch(_){}});rtcClient.on("user-unpublished",(user,mediaType)=>{if(mediaType==="video")setStatus("Host paused video.")});rtcClient.on("user-left",()=>{setStatus("Host left the live.");setTimeout(()=>cleanupOverlay(false),1700)});await rtcClient.join(join.app_id,stream.channel_name,join.token,hostUid);await setupRoom("audience");await acquireWake();setStatus("Connected. Waiting for video…");
  }catch(err){setStatus(friendlyError(err));setTimeout(()=>cleanupOverlay(false),1800)}
}

async function endLive(){if(leaving)return;if(!confirm("End this live video now?"))return;leaving=true;setStatus("Ending live…");try{await api("end",{stream_id:activeStream?.id})}catch(_){}await cleanupOverlay(false);leaving=false;await refresh()}
async function cleanupOverlay(popHistory=true){
  if(!overlay)return;
  clearInterval(heartbeatTimer);heartbeatTimer=null;
  try{localAudio?.stop();localAudio?.close()}catch(_){}
  try{localVideo?.stop();localVideo?.close()}catch(_){}
  localAudio=null;localVideo=null;
  try{if(rtcClient)await rtcClient.leave()}catch(_){}rtcClient=null;
  try{if(roomChannel)await c.removeChannel(roomChannel)}catch(_){}roomChannel=null;
  try{if(chatChannel)await c.removeChannel(chatChannel)}catch(_){}chatChannel=null;
  try{if(reactionChannel)await c.removeChannel(reactionChannel)}catch(_){}reactionChannel=null;
  unbindLiveViewport();chatProfileCache.clear();
  await releaseWake();
  overlay.remove();overlay=null;mode="";activeStream=null;hostUid=0;
  micMuted=false;videoPaused=false;torchOn=false;cameraFacing="environment";qualityProfile="720p_3";
  unlock();
  if(popHistory&&pushedHistory){pushedHistory=false;try{history.back()}catch(_){}}else pushedHistory=false;
}
window.addEventListener("popstate",()=>{if(!overlay)return;if(mode==="host"){history.pushState({m7lv:true},"",location.href);pushedHistory=true}else{pushedHistory=false;cleanupOverlay(false)}});
window.addEventListener("pagehide",()=>{if(mode!=="host"||!activeStream)return;try{const token=window.Ma7alakAccount?.session?.access_token||"";fetch(FN_URL,{method:"POST",headers:{"content-type":"application/json","apikey":SUPABASE_KEY,...(token?{authorization:"Bearer "+token}:{})},body:JSON.stringify({action:"end",stream_id:activeStream.id}),keepalive:true,credentials:"omit"})}catch(_){}});

async function subscribeStreams(){if(streamSub){try{await c.removeChannel(streamSub)}catch(_){}}streamSub=c.channel("m7lv-stream-table").on("postgres_changes",{event:"*",schema:"public",table:"shop_live_streams"},()=>setTimeout(refresh,120)).subscribe()}
function bridgeVideoItems(){
  return streams.map(x=>{
    const p=profiles.get(String(x.shop_slug||"").trim().toLowerCase())||{};
    return {
      id:"video:"+x.id,
      stream_id:x.id,
      shop_slug:x.shop_slug,
      shop_name:p.shop_name||p.arabic_name||x.shop_slug,
      profile_image_url:p.profile_image_url||null,
      shop_url:p.shop_url||("/"+encodeURIComponent(x.shop_slug||"")),
      title:x.title||"Video live now",
      description:"Live video broadcast",
      status:"active",
      post_type:"video_live",
      is_video_live:true,
      media_url:p.profile_image_url||null,
      media_type:p.profile_image_url?"image":null,
      starts_at:x.started_at||new Date().toISOString(),
      ends_at:x.expires_at||new Date(Date.now()+4*60*60*1000).toISOString(),
      created_at:x.started_at||new Date().toISOString()
    };
  });
}
function emitLiveState(){
  try{window.dispatchEvent(new CustomEvent("shoufhon:live-video-state",{detail:{items:streams.slice()}}))}catch(_){}
}
window.ShoufHonLiveVideo={
  refresh,
  open:openViewer,
  goLive:preflight,
  get items(){return streams.slice()},
  get bridgeItems(){return bridgeVideoItems()}
};

async function boot(){
  ensureCss();
  if(!await ready())return;
  await loadOwnerEnt();
  await refresh();
  await subscribeStreams();

  window.addEventListener("ma7alak:owner-auth-change",async()=>{
    await loadOwnerEnt();
    emitLiveState();
  });

  window.addEventListener("focus",()=>{if(!document.hidden)refresh()});
  window.addEventListener("pageshow",()=>{if(!document.hidden)refresh()});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});

  /* Realtime is the primary path. This is only a quiet recovery poll.
     Do not watch the whole DOM: the old MutationObserver caused the
     homepage Live cards to be constantly removed/reinserted while scrolling. */
  setInterval(()=>{if(!document.hidden)refresh()},30000);
}
boot();
})();