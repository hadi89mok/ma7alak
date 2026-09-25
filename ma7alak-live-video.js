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
const BEAUTY_SDK="https://cdn.jsdelivr.net/npm/agora-extension-beauty-effect@1.1.1/agora-extension-beauty.js";

let c=null,streams=[],profiles=new Map(),ownerSlug="",ownerEnt=null,streamSub=null,refreshBusy=false,injectTimer=null;
let overlay=null,mode="",activeStream=null,rtcClient=null,localAudio=null,localVideo=null,roomChannel=null,roomClientKey="",hostUid=0,hostRemoteUid="";
let chatChannel=null,reactionChannel=null,chatProfileCache=new Map(),viewportBound=false,liveOffers=[];
let micMuted=false,videoPaused=false,torchOn=false,cameraFacing="environment",wakeLock=null,heartbeatTimer=null,qualityProfile="720p_3",qualityChangedAt=0,leaving=false,pushedHistory=false,viewerOpenSeq=0,agoraWarmScheduled=false,liveRequestedFps=30,liveActualFps=30;
let setupActive=false,setupStarting=false,setupReady=false,setupMirror=true,setupLook="natural",setupLookStrength=.58,setupCaps={},setupPrepareSeq=0,setupLookSeq=0;
let beautyExtension=null,beautyProcessor=null,beautyTrack=null,beautyRegistered=false;

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
  if(code==="RATE_LIMITED")return"Too many connection attempts. Try again in a minute.";
  if(code==="STREAM_EXPIRED"||code==="STREAM_ENDED"||code==="LIVE_NOT_AVAILABLE")return"This live has ended.";
  if(/permission|NotAllowedError/i.test(code))return"Camera or microphone permission was blocked.";
  return code.replace(/^Error:\s*/,"")||"Something went wrong.";
}

function ensureCss(){
  if($("#m7lv-css"))return;
  const s=document.createElement("style");s.id="m7lv-css";s.textContent=`
.m7lv-inline{margin:10px 0 13px!important}.m7lv-inline-title{display:flex;align-items:center;gap:7px;margin:0 0 8px;color:#fff;font:900 12px/1.2 Arial,sans-serif}.m7lv-live-dot{width:7px;height:7px;border-radius:50%;background:#ff3154;box-shadow:0 0 0 0 rgba(255,49,84,.55);animation:m7lvPulse 1.35s ease-out infinite}@keyframes m7lvPulse{70%{box-shadow:0 0 0 7px rgba(255,49,84,0)}100%{box-shadow:0 0 0 0 rgba(255,49,84,0)}}.m7lv-strip{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:1px 1px 4px}.m7lv-strip::-webkit-scrollbar{display:none}.m7lv-card{position:relative;flex:0 0 min(78vw,310px);height:152px;border:1px solid rgba(255,255,255,.1);border-radius:19px;overflow:hidden;background:linear-gradient(135deg,#191919,#090909);cursor:pointer;isolation:isolate;box-shadow:0 14px 30px rgba(0,0,0,.22)}.m7lv-card-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.8) brightness(.4);transform:scale(1.03);z-index:-2}.m7lv-card::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.24)),linear-gradient(to top,rgba(0,0,0,.72),transparent 65%)}.m7lv-card-copy{position:absolute;left:14px;right:14px;bottom:13px;color:#fff}.m7lv-card-badge{display:inline-flex;align-items:center;gap:6px;background:#ea2449;color:#fff;border-radius:999px;padding:5px 8px;font:950 10px/1 Arial,sans-serif;margin-bottom:7px}.m7lv-card h3{margin:0 0 3px;font:950 17px/1.1 Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7lv-card small{display:block;color:rgba(255,255,255,.72);font:750 11px/1.2 Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#m7lv-overlay{position:fixed;left:0;right:0;top:0;height:100dvh;z-index:2147483600;background:#000;color:#fff;font-family:Arial,"Segoe UI",sans-serif;overflow:hidden;overscroll-behavior:none}#m7lv-overlay *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}#m7lv-overlay button,#m7lv-overlay input{font:inherit}#m7lv-overlay button{outline:none}.m7lv-app{position:relative;width:min(100%,680px);height:100%;margin:0 auto;background:#000;overflow:hidden}.m7lv-stage{position:absolute;inset:0;background:#080808;overflow:hidden}#m7lv-local,#m7lv-remote{position:absolute;inset:0;width:100%;height:100%;background:#080808}#m7lv-local>div,#m7lv-remote>div{width:100%!important;height:100%!important}#m7lv-local video,#m7lv-remote video{width:100%!important;height:100%!important;object-fit:contain!important}.m7lv-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.54),rgba(0,0,0,.03) 25%,rgba(0,0,0,.02) 55%,rgba(0,0,0,.76) 100%)}.m7lv-topbar{position:absolute;z-index:40;left:0;right:0;top:0;padding:max(12px,env(safe-area-inset-top)) 12px 8px;display:flex;align-items:center;justify-content:space-between;gap:10px}.m7lv-shophead{min-width:0;display:flex;align-items:center;gap:9px}.m7lv-shop-avatar{width:38px;height:38px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#1b1b1b;border:1px solid rgba(255,255,255,.28);box-shadow:0 5px 18px rgba(0,0,0,.28);flex:0 0 auto;font-size:13px;font-weight:950}.m7lv-shop-avatar img{width:100%;height:100%;object-fit:cover}.m7lv-brand{min-width:0}.m7lv-brand-line{display:flex;align-items:center;gap:6px;min-width:0}.m7lv-brand strong{max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;text-shadow:0 1px 6px #000}.m7lv-live-chip{display:inline-flex;align-items:center;height:21px;padding:0 7px;border-radius:999px;background:#ed2450;color:#fff;font-size:8px;font-weight:950;letter-spacing:.4px}.m7lv-brand small{display:block;margin-top:2px;color:rgba(255,255,255,.72);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}.m7lv-top-actions{display:flex;align-items:center;gap:6px}.m7lv-pill{display:flex;align-items:center;gap:5px;height:30px;padding:0 8px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(8,8,8,.48);backdrop-filter:blur(12px);font-weight:900;font-size:10px}.m7lv-qdot{width:7px;height:7px;border-radius:50%;background:#777}.m7lv-close{width:32px;height:32px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(8,8,8,.5);backdrop-filter:blur(12px);color:#fff;font-size:20px;line-height:1;display:grid;place-items:center}.m7lv-status{position:absolute;z-index:32;left:50%;top:max(61px,calc(env(safe-area-inset-top) + 49px));transform:translateX(-50%);max-width:78%;padding:6px 10px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:rgba(0,0,0,.38);backdrop-filter:blur(10px);color:rgba(255,255,255,.88);font-size:10px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.m7lv-host-controls{position:absolute;z-index:35;right:10px;top:50%;transform:translateY(-42%);display:flex;flex-direction:column;gap:10px}.m7lv-host-btn,.m7lv-react-btn{width:48px;height:48px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(8,8,8,.48);backdrop-filter:blur(12px);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;box-shadow:0 5px 16px rgba(0,0,0,.22)}.m7lv-host-btn b,.m7lv-react-btn b{font-size:18px;line-height:1}.m7lv-host-btn span{font-size:7px;font-weight:900;color:rgba(255,255,255,.78)}.m7lv-host-btn.on{background:#fff;color:#111}.m7lv-host-btn.on span{color:#111}.m7lv-host-end{background:#e5234b;border-color:#ef4262}.m7lv-react-btn{position:absolute;z-index:35;right:12px;bottom:max(86px,calc(env(safe-area-inset-bottom) + 76px));width:50px;height:50px;font-size:22px}.m7lv-react-btn b{font-size:23px}.m7lv-comments{position:absolute;z-index:34;left:10px;right:78px;bottom:max(75px,calc(env(safe-area-inset-bottom) + 66px));max-height:36%;overflow:auto;scrollbar-width:none;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;mask-image:linear-gradient(to bottom,transparent 0,#000 14%,#000 100%);padding-top:26px;overscroll-behavior:contain}.m7lv-comments::-webkit-scrollbar{display:none}.m7lv-msg{max-width:min(94%,430px);display:flex;align-items:flex-start;gap:7px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.75)}.m7lv-msg-avatar{width:27px;height:27px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:rgba(35,35,35,.82);border:1px solid rgba(255,255,255,.2);flex:0 0 auto;font-size:9px;font-weight:950}.m7lv-msg-avatar img{width:100%;height:100%;object-fit:cover}.m7lv-msg-body{min-width:0;padding:5px 8px 6px;border-radius:12px;background:rgba(0,0,0,.42);backdrop-filter:blur(8px)}.m7lv-msg.host .m7lv-msg-body{background:rgba(151,18,48,.56);border:1px solid rgba(255,94,126,.28)}.m7lv-msg-meta{display:flex;align-items:center;gap:5px;min-width:0;margin-bottom:1px}.m7lv-msg-name{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.86);font-size:9px;font-weight:950}.m7lv-host-tag{flex:0 0 auto;padding:2px 5px;border-radius:999px;background:#f32b54;color:#fff;font-size:7px;font-weight:950;letter-spacing:.35px}.m7lv-msg-text{display:block;font-size:12px;line-height:1.28;color:#fff;word-break:break-word}.m7lv-composer{position:absolute;z-index:36;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:8px}.m7lv-input-wrap{flex:1;display:flex;align-items:center;gap:8px;min-width:0;height:46px;padding:0 12px;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(12,12,12,.58);backdrop-filter:blur(14px)}.m7lv-input-wrap input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#fff;font-size:13px}.m7lv-input-wrap input::placeholder{color:rgba(255,255,255,.55)}.m7lv-send-btn{height:38px;padding:0 14px;border:0;border-radius:999px;background:#fff;color:#111;font-size:11px;font-weight:950}.m7lv-guest-login{position:absolute;z-index:36;left:12px;bottom:max(12px,env(safe-area-inset-bottom));height:38px;padding:0 13px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(10,10,10,.5);backdrop-filter:blur(12px);color:rgba(255,255,255,.82);font-size:10px;font-weight:900}.m7lv-heart{position:absolute;z-index:45;right:29px;bottom:105px;font-size:27px;pointer-events:none;animation:m7lvHeart 1.55s ease-out forwards}@keyframes m7lvHeart{0%{opacity:0;transform:translateY(8px) scale(.72)}15%{opacity:1}100%{opacity:0;transform:translateY(-180px) translateX(-16px) scale(1.25) rotate(10deg)}}
#m7lv-preflight{position:fixed;inset:0;z-index:2147483601;display:grid;place-items:end center;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);padding:12px}.m7lv-sheet{width:min(100%,520px);border:1px solid rgba(255,255,255,.11);border-radius:25px;background:#0d0d0e;color:#fff;padding:18px;box-shadow:0 24px 60px rgba(0,0,0,.55)}.m7lv-sheet-mark{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border-radius:999px;background:rgba(235,35,76,.12);color:#ff708b;font-size:9px;font-weight:950;letter-spacing:.5px}.m7lv-sheet h2{margin:10px 0 5px;font-size:24px}.m7lv-sheet p{margin:0 0 14px;color:#9c9c9c;font-size:12px;line-height:1.45}.m7lv-sheet input{width:100%;border:1px solid #2b2b2b;border-radius:15px;background:#161616;color:#fff;padding:14px;outline:none;font-size:15px}.m7lv-sheet-actions{display:grid;grid-template-columns:1fr 1.6fr;gap:9px;margin-top:11px}.m7lv-sheet-actions button{border:0;border-radius:14px;min-height:50px;font-weight:950}.m7lv-cancel{background:#222;color:#fff}.m7lv-start{background:linear-gradient(135deg,#ef3156,#c9153d);color:#fff}.m7lv-start:disabled{opacity:.45}.m7lv-pre-status{min-height:18px;margin-top:8px;color:#ffb4c1;font-size:11px}
@media(max-width:520px){.m7lv-app{width:100%}.m7lv-brand strong{max-width:125px}.m7lv-brand small{max-width:145px}.m7lv-pill{height:28px;padding:0 7px}.m7lv-host-controls{right:8px}.m7lv-comments{right:70px;max-height:34%}.m7lv-msg-text{font-size:12px}.m7lv-guest-login{max-width:55vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
`;
  document.head.appendChild(s);
}

function ensurePremiumCss(){
  if($("#m7lv-premium-css"))return;
  const s=document.createElement("style");
  s.id="m7lv-premium-css";
  s.textContent=`
#m7lv-overlay{background:#000!important}
.m7lv-app{isolation:isolate;background:#050505}
.m7lv-stage:after{content:"";position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 50% 12%,rgba(255,255,255,.055),transparent 28%),
  linear-gradient(180deg,rgba(0,0,0,.46),transparent 24%,transparent 55%,rgba(0,0,0,.82) 100%)}
.m7lv-topbar{padding:max(12px,env(safe-area-inset-top)) 12px 8px}
.m7lv-shophead{padding:5px 7px 5px 5px;border:1px solid rgba(255,255,255,.10);border-radius:999px;background:rgba(5,5,5,.28);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.m7lv-shop-avatar{width:39px;height:39px;border-color:rgba(228,170,79,.72);box-shadow:0 0 0 2px rgba(0,0,0,.28),0 0 18px rgba(228,170,79,.18)}
.m7lv-brand strong{font-size:13px}
.m7lv-live-chip{height:20px;background:linear-gradient(135deg,#ff3159,#d6173d);box-shadow:0 5px 14px rgba(222,24,63,.26)}
.m7lv-brand small{color:rgba(255,255,255,.68)}
.m7lv-pill{background:rgba(5,5,5,.42);border-color:rgba(255,255,255,.13)}
.m7lv-status{top:max(68px,calc(env(safe-area-inset-top) + 54px));background:rgba(5,5,5,.38);border-color:rgba(255,255,255,.10);opacity:.88}
.m7lv-comments{left:10px;right:78px;bottom:max(82px,calc(env(safe-area-inset-bottom) + 73px));max-height:35%;gap:7px}
.m7lv-msg{max-width:min(92%,410px)}
.m7lv-msg-body{padding:6px 9px 7px;border:1px solid rgba(255,255,255,.08);background:rgba(7,7,7,.48);box-shadow:0 5px 18px rgba(0,0,0,.12)}
.m7lv-msg.host .m7lv-msg-body{background:linear-gradient(135deg,rgba(171,20,54,.72),rgba(87,10,28,.64));border-color:rgba(255,99,128,.32)}
.m7lv-msg-avatar{width:29px;height:29px;border-color:rgba(228,170,79,.50)}
.m7lv-msg-name{font-size:9.5px}.m7lv-msg-text{font-size:12.5px}
.m7lv-composer{left:10px;right:74px;bottom:max(10px,env(safe-area-inset-bottom))}
.m7lv-input-wrap{height:48px;border-color:rgba(228,170,79,.34);background:rgba(8,8,8,.62);box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.m7lv-send-btn{height:40px;background:linear-gradient(135deg,#f2cb78,#c98931);color:#161008}
.m7lv-guest-login{left:10px;right:74px;width:auto;height:46px;display:flex;align-items:center;justify-content:center;border-color:rgba(228,170,79,.28);background:rgba(8,8,8,.62);color:#f5d394}
.m7lv-view-actions{position:absolute;z-index:39;right:10px;bottom:max(82px,calc(env(safe-area-inset-bottom) + 72px));display:flex;flex-direction:column;gap:9px}
.m7lv-action{width:52px;min-height:52px;padding:5px 3px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(6,6,6,.52);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:0 8px 22px rgba(0,0,0,.20)}
.m7lv-action b{font-size:22px;line-height:1}.m7lv-action span{max-width:46px;font-size:7.5px;font-weight:900;color:rgba(255,255,255,.76);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m7lv-action.like b{color:#ff4368}.m7lv-action.offer b{color:#f0bc60}
.m7lv-action.locked{opacity:.78}
.m7lv-host-controls{right:10px;top:50%;gap:9px}
.m7lv-host-btn{width:50px;height:50px;background:rgba(6,6,6,.52);border-radius:17px}
.m7lv-host-offers{border-color:rgba(228,170,79,.35)!important}.m7lv-host-offers b{color:#f0bc60}
.m7lv-featured{position:absolute;z-index:35;left:10px;right:78px;bottom:max(134px,calc(env(safe-area-inset-bottom) + 126px));display:none;align-items:center;gap:9px;padding:8px 9px;border:1px solid rgba(228,170,79,.46);border-radius:16px;background:linear-gradient(135deg,rgba(24,19,12,.88),rgba(6,6,6,.76));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 12px 28px rgba(0,0,0,.24);cursor:pointer}
.m7lv-featured.show{display:flex}.m7lv-featured-thumb{width:46px;height:46px;flex:0 0 46px;border-radius:12px;object-fit:cover;background:#191919;border:1px solid rgba(255,255,255,.10)}
.m7lv-featured-copy{min-width:0;flex:1}.m7lv-featured-kicker{display:block;color:#f0bc60;font-size:8px;font-weight:950;letter-spacing:.5px}.m7lv-featured-title{display:block;margin-top:2px;color:#fff;font-size:11px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7lv-featured-sub{display:block;margin-top:2px;color:rgba(255,255,255,.64);font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m7lv-featured-go{font-size:22px;color:#f0bc60}
.m7lv-offer-sheet{position:absolute;z-index:70;left:0;right:0;bottom:0;max-height:min(58dvh,620px);transform:translateY(104%);transition:transform .28s cubic-bezier(.16,1,.3,1);border-top:1px solid rgba(228,170,79,.42);border-radius:26px 26px 0 0;background:linear-gradient(180deg,rgba(18,16,13,.98),rgba(5,5,5,.99));box-shadow:0 -22px 60px rgba(0,0,0,.46);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);padding:10px 12px max(14px,env(safe-area-inset-bottom));overflow:auto}
.m7lv-offer-sheet.open{transform:translateY(0)}
.m7lv-offer-handle{width:42px;height:4px;border-radius:99px;background:rgba(255,255,255,.28);margin:0 auto 10px}
.m7lv-offer-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.m7lv-offer-head strong{font-size:18px}.m7lv-offer-head small{color:rgba(255,255,255,.56);font-size:9px}
.m7lv-offer-close{width:34px;height:34px;border:1px solid rgba(255,255,255,.12);border-radius:50%;background:#171717;color:#fff;font-size:19px}
.m7lv-offer-list{display:grid;gap:9px}
.m7lv-offer-card{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;padding:9px;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(255,255,255,.035)}
.m7lv-offer-card:first-child{border-color:rgba(228,170,79,.50);background:linear-gradient(135deg,rgba(228,170,79,.09),rgba(255,255,255,.025))}
.m7lv-offer-img{width:72px;height:72px;border-radius:14px;object-fit:cover;background:#151515}
.m7lv-offer-card h4{margin:2px 0 3px;font-size:14px}.m7lv-offer-card p{margin:0;color:rgba(255,255,255,.64);font-size:9px;line-height:1.3}
.m7lv-offer-price{margin-top:6px;color:#f0bc60;font-size:13px;font-weight:950}.m7lv-offer-old{margin-right:6px;color:rgba(255,255,255,.42);text-decoration:line-through;font-size:9px}
.m7lv-offer-empty{padding:24px 12px;text-align:center;color:rgba(255,255,255,.55);font-size:11px}
.m7lv-owner-add-offer{width:100%;min-height:46px;margin-top:10px;border:0;border-radius:14px;background:linear-gradient(135deg,#f0c36d,#c8882f);color:#171008;font-weight:950}
.m7lv-owner-add-offer:disabled{opacity:.42}

/* =========================================================
   GO LIVE STUDIO — SIMPLE CAMERA-FIRST PREVIEW
========================================================= */
#m7lv-preflight{
  position:fixed!important;
  inset:0!important;
  z-index:2147483601!important;
  display:block!important;
  padding:0!important;
  background:#000!important;
  color:#fff!important;
  overflow:hidden!important;
  overscroll-behavior:none!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
#m7lv-preflight *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.m7lv-setup{
  --m7studio-accent:#ff3159;
  position:relative;
  width:min(100%,680px);
  height:100%;
  height:100dvh;
  margin:0 auto;
  overflow:hidden;
  background:#050505;
  font-family:Arial,"Segoe UI",sans-serif;
}
.m7lv-setup-stage{position:absolute;inset:0;overflow:hidden;background:#050505}
#m7lv-setup-camera{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  overflow:hidden;
  background:#050505;
  touch-action:none;
}
#m7lv-setup-camera>div{width:100%!important;height:100%!important}
#m7lv-setup-camera video{
  width:100%!important;
  height:100%!important;
  object-fit:contain!important;
  object-position:center center!important;
  transform:none!important;
  -webkit-transform:none!important;
}
.m7lv-setup-shade{
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.50),rgba(0,0,0,.02) 19%,rgba(0,0,0,.01) 55%,rgba(0,0,0,.78) 100%);
}
.m7lv-setup-loading{
  position:absolute;
  z-index:3;
  left:50%;
  top:40%;
  transform:translate(-50%,-50%);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:9px;
  color:rgba(255,255,255,.78);
  font-size:11px;
  font-weight:800;
  text-align:center;
  pointer-events:none;
}
.m7lv-setup-spinner{
  width:30px;height:30px;border:3px solid rgba(255,255,255,.16);border-top-color:#fff;border-radius:50%;
  animation:m7StudioSpin .8s linear infinite;
}
@keyframes m7StudioSpin{to{transform:rotate(360deg)}}
.m7lv-setup-top{
  position:absolute;
  z-index:30;
  left:0;right:0;top:0;
  display:grid;
  grid-template-columns:44px minmax(0,1fr) auto;
  align-items:center;
  gap:8px;
  padding:max(10px,env(safe-area-inset-top)) 10px 8px;
}
.m7lv-setup-topbtn{
  width:42px;height:42px;display:grid;place-items:center;padding:0;
  border:1px solid rgba(255,255,255,.16);border-radius:50%;
  background:rgba(7,7,8,.44);color:#fff;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:0 8px 22px rgba(0,0,0,.20);
  font-size:20px;line-height:1;
}
.m7lv-setup-preview-chip{
  justify-self:center;
  min-height:32px;
  max-width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  padding:0 11px;
  border:1px solid rgba(255,255,255,.14);
  border-radius:999px;
  background:rgba(5,5,6,.42);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  color:rgba(255,255,255,.90);
  font-size:9px;font-weight:950;letter-spacing:.45px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.m7lv-setup-preview-chip i{width:7px;height:7px;flex:0 0 7px;border-radius:50%;background:#aaa;box-shadow:0 0 8px rgba(255,255,255,.28)}
.m7lv-setup-fps{
  min-height:34px;
  display:flex;align-items:center;justify-content:center;
  padding:0 10px;
  border:1px solid rgba(255,255,255,.14);
  border-radius:999px;
  background:rgba(5,5,6,.42);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  color:rgba(255,255,255,.84);
  font-size:9px;font-weight:950;
  white-space:nowrap;
}
.m7lv-setup-tools{
  position:absolute;
  z-index:24;
  right:10px;
  top:31%;
  display:flex;
  flex-direction:column;
  gap:9px;
}
.m7lv-setup-tool{
  width:48px;min-height:48px;padding:4px 3px;
  border:1px solid rgba(255,255,255,.15);border-radius:50%;
  background:rgba(7,7,8,.46);color:#fff;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  box-shadow:0 8px 22px rgba(0,0,0,.20);
}
.m7lv-setup-tool b{font-size:17px;line-height:1}
.m7lv-setup-tool span{font-size:7px;font-weight:900;color:rgba(255,255,255,.72)}
.m7lv-setup-tool.on{border-color:rgba(255,255,255,.56);background:#fff;color:#111}
.m7lv-setup-tool.on span{color:#111}
.m7lv-setup-tool:disabled{opacity:.28}
.m7lv-pinch-hint{
  position:absolute;
  z-index:20;
  left:50%;
  bottom:268px;
  transform:translateX(-50%);
  padding:6px 10px;
  border-radius:999px;
  background:rgba(0,0,0,.34);
  color:rgba(255,255,255,.70);
  font-size:8px;font-weight:850;
  backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);
  pointer-events:none;
  transition:opacity .25s ease;
}
.m7lv-studio-actions{
  position:absolute;
  z-index:28;
  left:12px;right:12px;
  bottom:176px;
  display:flex;
  align-items:flex-start;
  justify-content:center;
  gap:18px;
  transition:bottom .24s cubic-bezier(.16,1,.3,1);
}
.m7lv-setup.panel-open .m7lv-studio-actions{bottom:325px}
.m7lv-studio-action{
  width:58px;
  border:0;
  background:transparent;
  color:#fff;
  display:flex;flex-direction:column;align-items:center;gap:5px;
  font-size:9px;font-weight:850;
  text-shadow:0 2px 9px rgba(0,0,0,.8);
}
.m7lv-studio-action b{
  width:45px;height:45px;
  display:grid;place-items:center;
  border:1px solid rgba(255,255,255,.18);
  border-radius:50%;
  background:rgba(5,5,6,.38);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:0 8px 22px rgba(0,0,0,.18);
  font-size:20px;
  line-height:1;
}
.m7lv-studio-action.active b{background:#fff;color:#111}
.m7lv-setup-panel{
  position:absolute;
  z-index:29;
  left:9px;right:9px;
  bottom:159px;
  max-height:0;
  overflow:hidden;
  opacity:0;
  pointer-events:none;
  transform:translateY(10px);
  padding:0 12px;
  border:1px solid transparent;
  border-radius:22px;
  background:linear-gradient(180deg,rgba(18,18,19,.80),rgba(7,7,8,.94));
  backdrop-filter:blur(22px) saturate(125%);
  -webkit-backdrop-filter:blur(22px) saturate(125%);
  transition:max-height .26s cubic-bezier(.16,1,.3,1),opacity .18s ease,transform .22s ease,padding .22s ease,border-color .22s ease;
}
.m7lv-setup-panel.open{
  max-height:165px;
  overflow:auto;
  opacity:1;
  pointer-events:auto;
  transform:none;
  padding:10px 12px 11px;
  border-color:rgba(255,255,255,.13);
  scrollbar-width:none;
}
.m7lv-setup-panel::-webkit-scrollbar{display:none}
.m7lv-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
.m7lv-panel-head strong{font-size:11px;font-weight:950}
.m7lv-panel-close{
  width:28px;height:28px;border:1px solid rgba(255,255,255,.12);border-radius:50%;
  background:rgba(255,255,255,.06);color:#fff;font-size:16px;line-height:1;
}
.m7lv-panel-section{display:none}
.m7lv-panel-section.show{display:block}
.m7lv-look-row{
  display:flex;
  gap:7px;
  overflow-x:auto;
  scrollbar-width:none;
  padding:1px 0 3px;
}
.m7lv-look-row::-webkit-scrollbar{display:none}
.m7lv-look{
  flex:0 0 70px;
  min-height:48px;
  padding:6px 4px;
  border:1px solid rgba(255,255,255,.11);
  border-radius:14px;
  background:rgba(255,255,255,.045);
  color:#fff;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  font-size:8px;font-weight:900;
}
.m7lv-look b{font-size:16px;line-height:1}
.m7lv-look[data-look="soft"] b{color:#ffc3d3}
.m7lv-look[data-look="glow"] b{color:#f1c76d}
.m7lv-look[data-look="warm"] b{color:#ffad66}
.m7lv-look[data-look="vivid"] b{color:#9bdcff}
.m7lv-look[data-look="clean"] b{color:#dcfce7}
.m7lv-look.active{border-color:rgba(255,255,255,.75);background:rgba(255,255,255,.15);box-shadow:0 0 0 1px rgba(255,255,255,.06)}
.m7lv-shared-strength{display:none;margin-top:6px}
.m7lv-setup-panel[data-mode="beauty"] .m7lv-shared-strength,
.m7lv-setup-panel[data-mode="effects"] .m7lv-shared-strength{display:grid}
.m7lv-setup-range{
  display:grid;
  grid-template-columns:66px minmax(0,1fr) 42px;
  align-items:center;
  gap:7px;
  min-height:32px;
}
.m7lv-setup-range + .m7lv-setup-range{margin-top:3px}
.m7lv-setup-range>span{color:rgba(255,255,255,.74);font-size:8.5px;font-weight:850}
.m7lv-setup-range output{color:rgba(255,255,255,.56);font-size:8px;font-weight:850;text-align:right}
.m7lv-setup-range input[type="range"]{width:100%;accent-color:#f1c66e}
.m7lv-setup-range.is-off{display:none!important}
.m7lv-setup-bottom{
  position:absolute;
  z-index:30;
  left:8px;right:8px;
  bottom:max(8px,env(safe-area-inset-bottom));
  padding:9px;
  border:1px solid rgba(255,255,255,.13);
  border-radius:22px;
  background:linear-gradient(180deg,rgba(16,16,17,.70),rgba(6,6,7,.91));
  backdrop-filter:blur(22px) saturate(125%);
  -webkit-backdrop-filter:blur(22px) saturate(125%);
  box-shadow:0 18px 50px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.05);
}
.m7lv-setup-shop{display:flex;align-items:center;gap:8px;min-width:0;min-height:32px;margin-bottom:6px}
.m7lv-setup-avatar{
  width:32px;height:32px;flex:0 0 32px;display:grid;place-items:center;overflow:hidden;
  border:1px solid rgba(228,170,79,.58);border-radius:50%;background:#181818;font-size:12px;font-weight:950;
}
.m7lv-setup-avatar img{width:100%;height:100%;object-fit:cover}
.m7lv-setup-shopcopy{min-width:0}
.m7lv-setup-shopcopy strong{display:block;max-width:72vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:950}
.m7lv-setup-shopcopy small{display:block;margin-top:1px;color:rgba(255,255,255,.50);font-size:7px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#m7lv-title{
  width:100%!important;
  min-height:40px!important;
  padding:0 12px!important;
  border:1px solid rgba(255,255,255,.13)!important;
  border-radius:13px!important;
  background:rgba(255,255,255,.055)!important;
  color:#fff!important;
  outline:none!important;
  font-size:13px!important;
  font-weight:750!important;
}
#m7lv-title::placeholder{color:rgba(255,255,255,.43)}
.m7lv-pre-status{
  min-height:12px!important;
  max-height:24px!important;
  margin:4px 2px 0!important;
  overflow:hidden!important;
  color:rgba(255,255,255,.60)!important;
  font-size:8px!important;
  line-height:1.25!important;
  text-align:center!important;
}
.m7lv-start{
  width:100%;
  min-height:49px;
  margin-top:5px;
  border:0;
  border-radius:999px;
  background:linear-gradient(135deg,#ff4164,#e01a45);
  color:#fff;
  font-size:14px;
  font-weight:950;
  box-shadow:0 12px 28px rgba(218,21,62,.24),inset 0 1px 0 rgba(255,255,255,.18);
}
.m7lv-start:disabled{opacity:.42}
.m7lv-setup-footnote{display:none!important}
.m7lv-zoom-indicator{
  position:absolute;
  z-index:60;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  min-width:56px;
  padding:8px 11px;
  border-radius:999px;
  background:rgba(0,0,0,.55);
  color:#fff;
  font-size:12px;
  font-weight:950;
  text-align:center;
  pointer-events:none;
  opacity:0;
  transition:opacity .18s ease;
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
}
.m7lv-zoom-indicator.show{opacity:1}
.m7lv-app.is-host #m7lv-local{touch-action:none}
@media(max-height:720px){
  .m7lv-setup-shopcopy small{display:none}
  .m7lv-setup-tools{top:27%}
  .m7lv-studio-actions{bottom:164px;gap:12px}
  .m7lv-setup.panel-open .m7lv-studio-actions{bottom:298px}
  .m7lv-setup-panel{bottom:149px}.m7lv-setup-panel.open{max-height:145px}
  .m7lv-pinch-hint{bottom:247px}
  .m7lv-start{min-height:45px}
}

@media(max-width:520px){
  .m7lv-topbar{gap:6px;padding-left:8px;padding-right:8px}.m7lv-shophead{gap:7px;max-width:62vw}.m7lv-shop-avatar{width:36px;height:36px}.m7lv-brand strong{max-width:112px}
  .m7lv-top-actions{gap:4px}.m7lv-pill{padding:0 7px}.m7lv-comments{right:70px;bottom:max(78px,calc(env(safe-area-inset-bottom) + 69px));max-height:33%}
  .m7lv-composer,.m7lv-guest-login{right:68px}.m7lv-view-actions{right:7px}.m7lv-action{width:50px;min-height:50px;border-radius:16px}
  .m7lv-featured{right:69px;bottom:max(130px,calc(env(safe-area-inset-bottom) + 122px))}
}
@media(max-width:380px){
  .m7lv-shophead{max-width:58vw}.m7lv-brand strong{max-width:94px}.m7lv-brand small{max-width:112px}.m7lv-pill{font-size:8px}
  .m7lv-comments{max-height:31%}.m7lv-featured{padding:7px}.m7lv-featured-thumb{width:42px;height:42px;flex-basis:42px}
}
`;
  document.head.appendChild(s);
}

function ensureImmersiveLiveCss(){
  if($("#m7lv-immersive-css"))return;
  const s=document.createElement("style");
  s.id="m7lv-immersive-css";
  s.textContent="#m7lv-overlay .m7lv-app{width:100%!important;height:100%!important;max-width:none!important;background:#000!important}\n#m7lv-overlay .m7lv-stage{inset:0!important;background:#000!important}\n#m7lv-overlay #m7lv-local,#m7lv-overlay #m7lv-remote{inset:0!important;background:#000!important}\n#m7lv-overlay #m7lv-local video,#m7lv-overlay #m7lv-remote video{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important}\n#m7lv-overlay .m7lv-stage:after{background:linear-gradient(180deg,rgba(0,0,0,.54),transparent 20%,transparent 57%,rgba(0,0,0,.72) 100%)!important}\n#m7lv-overlay .m7lv-topbar{padding:max(10px,env(safe-area-inset-top)) 10px 6px!important;align-items:flex-start!important}\n#m7lv-overlay .m7lv-shophead{max-width:min(64vw,330px)!important;padding:4px 7px 4px 4px!important;background:rgba(5,5,5,.32)!important}\n#m7lv-overlay .m7lv-shop-avatar{width:36px!important;height:36px!important}\n#m7lv-overlay .m7lv-brand strong{font-size:12.5px!important}\n#m7lv-overlay .m7lv-brand small{font-size:9px!important;max-width:180px!important}\n#m7lv-overlay .m7lv-top-actions{gap:5px!important}\n#m7lv-overlay .m7lv-pill{height:29px!important;padding:0 8px!important;background:rgba(5,5,5,.34)!important;backdrop-filter:blur(13px)!important;-webkit-backdrop-filter:blur(13px)!important}\n#m7lv-overlay .m7lv-status{top:max(58px,calc(env(safe-area-inset-top) + 45px))!important;max-width:62%!important;padding:5px 9px!important;font-size:9px!important;background:rgba(0,0,0,.32)!important;opacity:.78!important}\n#m7lv-overlay .m7lv-host-controls{right:8px!important;top:auto!important;bottom:max(82px,calc(env(safe-area-inset-bottom) + 73px))!important;transform:none!important;gap:6px!important}\n#m7lv-overlay .m7lv-host-btn{width:44px!important;height:44px!important;min-height:44px!important;border-radius:50%!important;background:rgba(5,5,5,.43)!important;backdrop-filter:blur(13px)!important;-webkit-backdrop-filter:blur(13px)!important;box-shadow:0 6px 18px rgba(0,0,0,.18)!important}\n#m7lv-overlay .m7lv-host-btn b{font-size:16px!important}\n#m7lv-overlay .m7lv-host-btn span{font-size:6.5px!important}\n#m7lv-overlay .m7lv-host-btn.on{background:#fff!important;color:#111!important}\n#m7lv-overlay .m7lv-host-end{background:rgba(66,10,21,.72)!important;border-color:rgba(255,60,98,.78)!important;color:#fff!important}\n#m7lv-overlay .m7lv-comments{left:10px!important;right:63px!important;bottom:max(70px,calc(env(safe-area-inset-bottom) + 61px))!important;max-height:30%!important;padding-top:24px!important;gap:5px!important}\n#m7lv-overlay .m7lv-msg-body{background:rgba(0,0,0,.33)!important;border-color:rgba(255,255,255,.055)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important}\n#m7lv-overlay .m7lv-composer{left:9px!important;right:9px!important;bottom:max(9px,env(safe-area-inset-bottom))!important;gap:7px!important}\n#m7lv-overlay .m7lv-input-wrap{height:43px!important;border-color:rgba(255,255,255,.17)!important;background:rgba(5,5,5,.40)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}\n#m7lv-overlay .m7lv-send-btn{height:40px!important;min-width:62px!important;padding:0 13px!important;border-radius:999px!important}\n#m7lv-overlay .m7lv-guest-login{left:10px!important;right:65px!important;bottom:max(10px,env(safe-area-inset-bottom))!important;width:auto!important;background:rgba(5,5,5,.43)!important}\n#m7lv-overlay .m7lv-view-actions{right:8px!important;bottom:max(72px,calc(env(safe-area-inset-bottom) + 63px))!important;gap:7px!important}\n#m7lv-overlay .m7lv-action{width:46px!important;min-height:46px!important;border-radius:50%!important;background:rgba(5,5,5,.43)!important}\n#m7lv-overlay .m7lv-featured{left:10px!important;right:63px!important;bottom:max(121px,calc(env(safe-area-inset-bottom) + 112px))!important}\n#m7lv-preflight #m7lv-setup-camera video{object-fit:cover!important;object-position:center center!important}\n@media(max-width:390px){\n  #m7lv-overlay .m7lv-shophead{max-width:58vw!important}\n  #m7lv-overlay .m7lv-pill{padding:0 6px!important;font-size:8px!important}\n  #m7lv-overlay .m7lv-host-btn{width:41px!important;height:41px!important;min-height:41px!important}\n  #m7lv-overlay .m7lv-host-controls{gap:5px!important}\n}";
  document.head.appendChild(s);
}

function ownerState(){ownerSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||window.Ma7alakOwnerAuth?.shop?.shop_slug||window.Ma7alakLiveOffers?.ownerSlug||"").trim().toLowerCase()}
async function loadOwnerEnt(){ownerState();ownerEnt=null;if(!ownerSlug||!c)return;try{const r=await c.from("shop_live_entitlements").select("enabled,active_limit,max_duration_hours,video_live_enabled,video_live_monthly_minutes").eq("shop_slug",ownerSlug).maybeSingle();if(!r.error)ownerEnt=r.data||null}catch(_){}}
async function ownerVideoLiveAccess(){
  ownerState();
  if(!ownerSlug||!c)return null;
  try{
    const r=await c.rpc("shoufhon_owner_get_video_live_access",{p_shop_slug:ownerSlug});
    if(r.error)throw r.error;
    const row=Array.isArray(r.data)?r.data[0]:r.data;
    return row&&typeof row==="object"?row:null;
  }catch(err){
    console.warn("ShoufHon Video LIVE access check:",err);
    return null;
  }
}
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
    /* If at least one Video Live is visible, warm the Agora SDK quietly.
       Opening the viewer still happens only after a real user tap. */
    warmLiveViewerDependencies();
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
  /* Intentionally empty.
     Video LIVE controls are rendered by their own surfaces:
     - ma7alak-live-offers.js for the management panel
     - shoufhon-shop-live-panel.js for manual shop pages
     Keeping this file out of those controls prevents cross-feature state races. */
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

function loadAgora(){if(window.AgoraRTC)return Promise.resolve(window.AgoraRTC);if(window.__M7LV_AGORA_PROMISE__)return window.__M7LV_AGORA_PROMISE__;window.__M7LV_AGORA_PROMISE__=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=AGORA_SDK;s.async=true;s.crossOrigin="anonymous";s.onload=()=>resolve(window.AgoraRTC);s.onerror=()=>{window.__M7LV_AGORA_PROMISE__=null;reject(new Error("Agora SDK failed to load."))};document.head.appendChild(s)});return window.__M7LV_AGORA_PROMISE__}
function warmLiveViewerDependencies(){
  if(!streams.length||window.AgoraRTC||window.__M7LV_AGORA_PROMISE__||agoraWarmScheduled)return;
  agoraWarmScheduled=true;
  const warm=()=>{
    agoraWarmScheduled=false;
    if(!streams.length||window.AgoraRTC||window.__M7LV_AGORA_PROMISE__)return;
    loadAgora().catch(()=>{});
  };
  if(typeof window.requestIdleCallback==="function"){
    window.requestIdleCallback(warm,{timeout:900});
  }else{
    setTimeout(warm,160);
  }
}
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
  const signedIn=viewerCanInteract();
  const interactive=host||signedIn;
  const composer=interactive
    ? `<div class="m7lv-composer"><div class="m7lv-input-wrap"><input id="m7lv-chat-input" maxlength="160" autocomplete="off" enterkeyhint="send" placeholder="${host?"Talk to your viewers…":"Add a comment…"}"></div><button id="m7lv-send" class="m7lv-send-btn" type="button">Send</button></div>`
    : `<button id="m7lv-login-chat" class="m7lv-guest-login" type="button">Log in to comment &amp; react</button>`;
  const viewerActions=!host?`<div class="m7lv-view-actions">
      <button class="m7lv-action like ${signedIn?"":"locked"}" id="m7lv-heart-view" type="button" aria-label="${signedIn?"Send heart":"Log in to react"}"><b>♥</b><span>${signedIn?"Like":"Log in"}</span></button>
      <button class="m7lv-action" id="m7lv-share" type="button" aria-label="Share live"><b>↗</b><span>Share</span></button>
      <button class="m7lv-action offer" id="m7lv-offers-open" type="button" aria-label="Open live offers"><b>▣</b><span><i id="m7lv-offers-count">0</i> Offers</span></button>
    </div>`:"";
  const hostControls=host?`<div class="m7lv-host-controls">
      <button class="m7lv-host-btn" id="m7lv-switch" type="button"><b>↻</b><span>Flip</span></button>
      <button class="m7lv-host-btn" id="m7lv-mute" type="button"><b>🎤</b><span>Mic</span></button>
      <button class="m7lv-host-btn" id="m7lv-pause" type="button"><b>▣</b><span>Pause</span></button>
      <button class="m7lv-host-btn" id="m7lv-torch" type="button"><b>⚡</b><span>Flash</span></button>
      <button class="m7lv-host-btn m7lv-host-offers" id="m7lv-host-offers" type="button"><b>＋</b><span>Offers</span></button>
      <button class="m7lv-host-btn m7lv-host-end" id="m7lv-end" type="button"><b>■</b><span>End</span></button>
    </div>`:"";
  return `<div class="m7lv-app ${host?"is-host":"is-viewer"}">
    <div id="m7lv-stage" class="m7lv-stage"><div id="m7lv-local"></div><div id="m7lv-remote"></div><div class="m7lv-shade"></div></div>
    <div class="m7lv-topbar">
      <div class="m7lv-shophead">
        <div class="m7lv-shop-avatar">${avatar?`<img src="${esc(avatar)}" alt="">`:esc(initial)}</div>
        <div class="m7lv-brand"><div class="m7lv-brand-line"><strong>${esc(name)}</strong><span class="m7lv-live-chip">LIVE</span></div><small>${esc(stream.title||"Live now")}</small></div>
      </div>
      <div class="m7lv-top-actions"><div class="m7lv-pill"><i id="m7lv-qdot" class="m7lv-qdot"></i><span id="m7lv-qtext">Checking…</span></div><div class="m7lv-pill" title="Watching now">◉ <span id="m7lv-count">0</span></div>${host?"":'<button id="m7lv-close" class="m7lv-close" type="button" aria-label="Close live">×</button>'}</div>
    </div>
    <div id="m7lv-status" class="m7lv-status">${host?"Starting camera…":"Connecting to live…"}</div>
    ${hostControls}
    <div id="m7lv-featured-offer" class="m7lv-featured" role="button" tabindex="0" aria-label="View live offers"></div>
    <div id="m7lv-chat-list" class="m7lv-comments" aria-live="polite"></div>
    ${viewerActions}
    ${composer}
    <section id="m7lv-offers-sheet" class="m7lv-offer-sheet" aria-label="Live offers">
      <div class="m7lv-offer-handle"></div>
      <div class="m7lv-offer-head"><div><strong>Live Offers</strong><small id="m7lv-offer-summary">Loading current offers…</small></div><button id="m7lv-offers-close" class="m7lv-offer-close" type="button" aria-label="Close offers">×</button></div>
      <div id="m7lv-offer-list" class="m7lv-offer-list"></div>
      ${host?'<button id="m7lv-add-offer-live" class="m7lv-owner-add-offer" type="button">＋ Add Offer / Update</button>':""}
    </section>
  </div>`;
}

function liveOfferPrice(x){
  const old=x?.original_price;
  const now=x?.offer_price;
  const f=v=>v==null||v===""?"":Number(v).toFixed(Number(v)%1?2:0);
  if(now!=null&&now!=="")return `${old!=null&&old!==""?`<span class="m7lv-offer-old">${esc(f(old))}</span>`:""}${esc(f(now))}`;
  return "";
}

function liveOfferSub(x){
  if(x?.description)return String(x.description).slice(0,86);
  if(x?.location_text)return "📍 "+String(x.location_text).slice(0,72);
  const end=new Date(x?.ends_at||0);
  if(Number.isFinite(end.getTime()))return "Ends "+end.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  return "Happening now";
}

async function loadStreamOffers(){
  liveOffers=[];
  if(!activeStream||!c){renderLiveOffers();return}
  try{
    const now=new Date().toISOString();
    const r=await c.from("shop_live_posts").select("*").eq("shop_slug",String(activeStream.shop_slug||"").toLowerCase()).eq("status","active").gt("ends_at",now).order("starts_at",{ascending:false}).limit(12);
    if(!r.error)liveOffers=(r.data||[]).filter(x=>new Date(x.ends_at||0).getTime()>Date.now());
  }catch(_){}
  renderLiveOffers();
}

function renderLiveOffers(){
  if(!overlay)return;
  const count=liveOffers.length;
  const countEl=$("#m7lv-offers-count",overlay);if(countEl)countEl.textContent=String(count);
  const summary=$("#m7lv-offer-summary",overlay);if(summary)summary.textContent=count?`${count} active ${count===1?"offer / update":"offers / updates"}`:"No active offers right now";
  const featured=$("#m7lv-featured-offer",overlay);
  const first=liveOffers.find(x=>String(x.post_type||"").toLowerCase()==="offer")||liveOffers[0];
  if(featured){
    if(first){
      featured.classList.add("show");
      featured.innerHTML=`${first.media_url?`<img class="m7lv-featured-thumb" src="${esc(first.media_url)}" alt="">`:'<div class="m7lv-featured-thumb"></div>'}<span class="m7lv-featured-copy"><b class="m7lv-featured-kicker">FEATURED NOW</b><strong class="m7lv-featured-title">${esc(first.title||"Live offer")}</strong><small class="m7lv-featured-sub">${esc(liveOfferSub(first))}</small></span><b class="m7lv-featured-go">›</b>`;
    }else{
      featured.classList.remove("show");
      featured.innerHTML="";
    }
  }
  const list=$("#m7lv-offer-list",overlay);
  if(list){
    list.innerHTML=count?liveOffers.map(x=>`<article class="m7lv-offer-card">${x.media_url?`<img class="m7lv-offer-img" src="${esc(x.media_url)}" alt="">`:'<div class="m7lv-offer-img"></div>'}<div><h4>${esc(x.title||"Live update")}</h4><p>${esc(liveOfferSub(x))}</p>${liveOfferPrice(x)?`<div class="m7lv-offer-price">${liveOfferPrice(x)}</div>`:""}</div></article>`).join(""):'<div class="m7lv-offer-empty">Nothing active right now. The live broadcast is still running.</div>';
  }
  const add=$("#m7lv-add-offer-live",overlay);
  if(add){
    const lim=Math.max(0,Number(ownerEnt?.active_limit||0));
    add.disabled=!ownerEnt?.enabled||(lim>0&&count>=lim);
    add.textContent=lim>0&&count>=lim?"Offer slots full":"＋ Add Offer / Update";
  }
}

function toggleOffersSheet(open){
  const sheet=$("#m7lv-offers-sheet",overlay);if(!sheet)return;
  sheet.classList.toggle("open",open===undefined?!sheet.classList.contains("open"):!!open);
}

async function shareLive(){
  if(!activeStream)return;
  const p=profiles.get(String(activeStream.shop_slug||"").toLowerCase())||{};
  const name=p.shop_name||p.arabic_name||activeStream.shop_slug||"ShoufHon";
  let u;
  try{
    u=new URL(p.shop_url||("/"+encodeURIComponent(activeStream.shop_slug||"")),location.origin);
    u.searchParams.set("liveVideo",String(activeStream.id));
  }catch(_){u=new URL(location.href);u.searchParams.set("liveVideo",String(activeStream.id))}
  const data={title:`${name} is live on ShoufHon`,text:`Watch ${name} live on ShoufHon`,url:u.toString()};
  try{
    if(navigator.share){await navigator.share(data);return}
    await navigator.clipboard?.writeText?.(data.url);
    setStatus("Live link copied.");
  }catch(_){}
}

function wireLiveChrome(){
  if(!overlay)return;
  $("#m7lv-share",overlay)?.addEventListener("click",shareLive);
  $("#m7lv-offers-open",overlay)?.addEventListener("click",()=>toggleOffersSheet(true));
  $("#m7lv-host-offers",overlay)?.addEventListener("click",()=>toggleOffersSheet(true));
  $("#m7lv-featured-offer",overlay)?.addEventListener("click",()=>toggleOffersSheet(true));
  $("#m7lv-featured-offer",overlay)?.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleOffersSheet(true)}});
  $("#m7lv-offers-close",overlay)?.addEventListener("click",()=>toggleOffersSheet(false));
  $("#m7lv-add-offer-live",overlay)?.addEventListener("click",()=>{
    toggleOffersSheet(false);
    try{window.Ma7alakLiveOffers?.create?.()}catch(_){}
  });
  if(!viewerCanInteract()&&mode!=="host"){
    $("#m7lv-heart-view",overlay)?.addEventListener("click",()=>window.Ma7alakAccount?.open?.());
  }
}

function presenceViewerCount(){
  if(!roomChannel)return null;
  try{
    const state=roomChannel.presenceState?.()||{};
    let viewers=0;
    Object.values(state).forEach(entries=>(Array.isArray(entries)?entries:[]).forEach(p=>{if(p?.role==="viewer")viewers++}));
    return viewers;
  }catch(_){return null}
}

function updateViewerCount(){
  if(!overlay)return;
  let count=presenceViewerCount();
  if(count==null||count===0){
    try{
      const remote=Array.isArray(rtcClient?.remoteUsers)?rtcClient.remoteUsers.length:0;
      count=mode==="host"?remote:Math.max(1,remote);
    }catch(_){count=mode==="audience"?1:0}
  }
  const e=$("#m7lv-count",overlay);if(e)e.textContent=String(Math.max(0,count||0));
}

async function setupPresence(){
  if(!activeStream||!c)return;
  try{if(roomChannel)await c.removeChannel(roomChannel)}catch(_){}
  roomClientKey=(mode==="host"?"host":"viewer")+"-"+String(window.Ma7alakAccount?.session?.user?.id||Math.random().toString(36).slice(2));
  try{
    roomChannel=c.channel("m7lv-presence:"+activeStream.id,{config:{presence:{key:roomClientKey}}})
      .on("presence",{event:"sync"},updateViewerCount)
      .on("presence",{event:"join"},updateViewerCount)
      .on("presence",{event:"leave"},updateViewerCount)
      .subscribe(async status=>{
        if(status==="SUBSCRIBED"){
          try{await roomChannel.track({role:mode==="host"?"host":"viewer",at:new Date().toISOString()})}catch(_){}
          updateViewerCount();
        }
      });
  }catch(_){roomChannel=null}
}

function detectCameraFacing(track=localVideo){
  try{
    const media=track?.getMediaStreamTrack?.();
    const settings=media?.getSettings?.()||{};
    const facing=String(settings.facingMode||"").toLowerCase();
    if(facing==="user"||facing==="environment")return facing;

    const label=String(track?.getTrackLabel?.()||media?.label||"").toLowerCase();
    if(/front|selfie|facing front|user/.test(label))return"user";
    if(/back|rear|facing back|environment|world/.test(label))return"environment";
  }catch(_){}
  return"";
}
function actualCameraFacing(track=localVideo,fallback=cameraFacing){
  return detectCameraFacing(track)||(fallback==="user"?"user":"environment");
}
function localPreview(){
  if(!localVideo||!overlay)return;
  try{
    const target=$("#m7lv-local",overlay);
    if(!target)return;
    target.innerHTML="";
    const actual=actualCameraFacing(localVideo,cameraFacing);
    cameraFacing=actual;
    localVideo.play(target,{fit:"contain",mirror:actual==="user"});
  }catch(_){}
}

async function switchCamera(){
  if(!localVideo)return;
  await setCameraFacing(cameraFacing==="environment"?"user":"environment");
}

function openVideoDeepLinkFromUrl(){
  try{
    const u=new URL(location.href),id=String(u.searchParams.get("liveVideo")||"").trim();
    if(!id)return false;
    if(!streams.some(x=>String(x.id)===id))return false;
    u.searchParams.delete("liveVideo");
    history.replaceState(history.state||null,"",u.pathname+(u.searchParams.toString()?"?"+u.searchParams.toString():"")+u.hash);
    setTimeout(()=>openViewer(id),0);
    return true;
  }catch(_){return false}
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

function setupStatus(message,isError=false){
  const p=$("#m7lv-preflight");
  const e=p?$(".m7lv-pre-status",p):null;
  if(e){
    e.textContent=String(message||"");
    e.style.color=isError?"#ff9bae":"rgba(255,255,255,.60)";
  }
  if(overlay)setStatus(message);
}
function cameraMediaTrack(){
  try{return localVideo?.getMediaStreamTrack?.()||null}catch(_){return null}
}
function rangeCaps(value){
  if(!value||typeof value!=="object")return null;
  const min=Number(value.min),max=Number(value.max),step=Number(value.step);
  if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min)return null;
  return {min,max,step:Number.isFinite(step)&&step>0?step:(max-min)/100};
}
function applySetupButtonState(){
  const p=$("#m7lv-preflight");if(!p)return;
  const mic=$("#m7lv-setup-mic",p),flash=$("#m7lv-setup-flash",p),mirror=$("#m7lv-setup-mirror",p);
  mic?.classList.toggle("on",micMuted);
  if(mic){$("b",mic).textContent=micMuted?"🔇":"🎤";$("span",mic).textContent=micMuted?"Muted":"Mic"}
  flash?.classList.toggle("on",torchOn);
  if(flash)flash.disabled=!setupCaps?.torch;
  mirror?.classList.toggle("on",cameraFacing==="user"&&setupMirror);
  if(mirror)mirror.disabled=cameraFacing!=="user";
}
function playSetupPreview(){
  const p=$("#m7lv-preflight"),target=p?$("#m7lv-setup-camera",p):null;
  if(!localVideo||!target)return;
  try{
    target.innerHTML="";
    const actual=actualCameraFacing(localVideo,cameraFacing);
    cameraFacing=actual;
    localVideo.play(target,{fit:"contain",mirror:actual==="user"&&setupMirror});
  }catch(_){}
}
async function resetCameraZoom(){
  const track=cameraMediaTrack();if(!track)return;
  try{
    const caps=track.getCapabilities?.()||{},zoom=rangeCaps(caps.zoom);
    if(!zoom)return;
    const base=Math.max(zoom.min,Math.min(1,zoom.max));
    const current=Number(track.getSettings?.().zoom);
    if(!Number.isFinite(current)||Math.abs(current-base)>.01){
      await track.applyConstraints({advanced:[{zoom:base}]});
    }
  }catch(_){}
}
function showZoomIndicator(target,value){
  const stage=target?.closest?.(".m7lv-setup-stage")||target?.closest?.(".m7lv-stage");
  if(!stage)return;
  let badge=$(".m7lv-zoom-indicator",stage);
  if(!badge){
    badge=document.createElement("div");
    badge.className="m7lv-zoom-indicator";
    stage.appendChild(badge);
  }
  badge.textContent=Number(value).toFixed(value<2?1:0)+"×";
  badge.classList.add("show");
  clearTimeout(badge._m7hide);
  badge._m7hide=setTimeout(()=>badge.classList.remove("show"),650);
}
function bindPinchZoom(target){
  if(!target||target.dataset.m7PinchZoom==="1")return;
  target.dataset.m7PinchZoom="1";
  target.style.touchAction="none";

  let startDistance=0,startZoom=1,desiredZoom=null,busy=false;

  const distance=touches=>{
    if(!touches||touches.length<2)return 0;
    const dx=touches[0].clientX-touches[1].clientX;
    const dy=touches[0].clientY-touches[1].clientY;
    return Math.hypot(dx,dy);
  };
  const flush=async()=>{
    if(busy||desiredZoom==null)return;
    busy=true;
    const value=desiredZoom;
    desiredZoom=null;
    try{
      const track=cameraMediaTrack(),caps=track?.getCapabilities?.()||{},range=rangeCaps(caps.zoom);
      if(range){
        const zoom=Math.max(range.min,Math.min(range.max,value));
        await track.applyConstraints({advanced:[{zoom}]});
        showZoomIndicator(target,zoom);
      }
    }catch(_){}
    busy=false;
    if(desiredZoom!=null)requestAnimationFrame(flush);
  };

  target.addEventListener("touchstart",e=>{
    if(e.touches.length!==2)return;
    const track=cameraMediaTrack(),caps=track?.getCapabilities?.()||{},range=rangeCaps(caps.zoom);
    if(!range)return;
    startDistance=distance(e.touches);
    const current=Number(track.getSettings?.().zoom);
    startZoom=Number.isFinite(current)?current:Math.max(range.min,Math.min(1,range.max));
    showZoomIndicator(target,startZoom);
    e.preventDefault();
  },{passive:false});

  target.addEventListener("touchmove",e=>{
    if(e.touches.length!==2||!startDistance)return;
    const track=cameraMediaTrack(),caps=track?.getCapabilities?.()||{},range=rangeCaps(caps.zoom);
    if(!range)return;
    const d=distance(e.touches);
    if(!d)return;
    const factor=d/startDistance;
    desiredZoom=Math.max(range.min,Math.min(range.max,startZoom*factor));
    requestAnimationFrame(flush);
    e.preventDefault();
  },{passive:false});

  const finish=e=>{
    if((e.touches?.length||0)<2)startDistance=0;
  };
  target.addEventListener("touchend",finish,{passive:true});
  target.addEventListener("touchcancel",finish,{passive:true});
}
function refreshSetupCameraControls(){
  const p=$("#m7lv-preflight");if(!p)return;
  const track=cameraMediaTrack();
  let caps={},settings={};
  try{caps=track?.getCapabilities?.()||{};settings=track?.getSettings?.()||{}}catch(_){}
  setupCaps=caps||{};
  const bindRange=(id,key,formatter)=>{
    const input=$(id,p),row=input?.closest(".m7lv-setup-range"),out=row?$("output",row):null;
    if(!input||!row)return;
    const range=rangeCaps(caps[key]);
    if(!range){row.classList.add("is-off");return}
    row.classList.remove("is-off");
    input.min=String(range.min);input.max=String(range.max);input.step=String(range.step);
    let value=Number(settings[key]);
    if(!Number.isFinite(value))value=key==="zoom"?Math.max(range.min,Math.min(1,range.max)):(range.min+range.max)/2;
    value=Math.max(range.min,Math.min(range.max,value));
    input.value=String(value);
    if(out)out.textContent=formatter(value);
  };
  bindRange("#m7lv-setup-exposure","exposureCompensation",v=>(v>0?"+":"")+Number(v).toFixed(1));
  bindRange("#m7lv-setup-color","colorTemperature",v=>Math.round(Number(v))+"K");
  applySetupButtonState();
}
async function applyCameraConstraint(key,value){
  const track=cameraMediaTrack();if(!track)return;
  try{
    const caps=track.getCapabilities?.()||{};
    const range=rangeCaps(caps[key]);if(!range)return;
    const number=Math.max(range.min,Math.min(range.max,Number(value)));
    const advanced={};advanced[key]=number;
    if(key==="colorTemperature"&&Array.isArray(caps.whiteBalanceMode)&&caps.whiteBalanceMode.includes("manual")){
      advanced.whiteBalanceMode="manual";
    }
    await track.applyConstraints({advanced:[advanced]});
    refreshSetupCameraControls();
  }catch(_){setupStatus("This camera does not allow that adjustment.",true)}
}
function beautyPresetOptions(key,strength){
  const s=Math.max(.15,Math.min(1,Number(strength)||.58));
  if(key==="soft")return{lighteningContrastLevel:1,lighteningLevel:.16+.18*s,smoothnessLevel:.24+.42*s,sharpnessLevel:.08+.12*s,rednessLevel:.10+.12*s};
  if(key==="glow")return{lighteningContrastLevel:2,lighteningLevel:.22+.34*s,smoothnessLevel:.18+.28*s,sharpnessLevel:.14+.24*s,rednessLevel:.10+.15*s};
  if(key==="warm")return{lighteningContrastLevel:1,lighteningLevel:.12+.15*s,smoothnessLevel:.15+.24*s,sharpnessLevel:.10+.17*s,rednessLevel:.24+.34*s};
  if(key==="vivid")return{lighteningContrastLevel:2,lighteningLevel:.12+.18*s,smoothnessLevel:.08+.12*s,sharpnessLevel:.28+.34*s,rednessLevel:.12+.12*s};
  if(key==="clean")return{lighteningContrastLevel:1,lighteningLevel:.20+.20*s,smoothnessLevel:.12+.18*s,sharpnessLevel:.20+.24*s,rednessLevel:.08+.08*s};
  return null;
}
function loadBeautyExtension(){
  const existing=window.BeautyExtension||window.AgoraBeautyExtension;
  if(existing)return Promise.resolve(existing);
  if(window.__M7LV_BEAUTY_PROMISE__)return window.__M7LV_BEAUTY_PROMISE__;
  window.__M7LV_BEAUTY_PROMISE__=new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src=BEAUTY_SDK;s.async=true;s.crossOrigin="anonymous";
    s.onload=()=>{
      const Ctor=window.BeautyExtension||window.AgoraBeautyExtension;
      if(Ctor)resolve(Ctor);else reject(new Error("Beauty effects are unavailable on this browser."));
    };
    s.onerror=()=>reject(new Error("Beauty effects could not load."));
    document.head.appendChild(s);
  }).catch(err=>{window.__M7LV_BEAUTY_PROMISE__=null;throw err});
  return window.__M7LV_BEAUTY_PROMISE__;
}
async function releaseBeautyProcessor(){
  try{if(beautyTrack&&typeof beautyTrack.unpipe==="function")beautyTrack.unpipe()}catch(_){}
  try{await beautyProcessor?.disable?.()}catch(_){}
  try{await beautyProcessor?.release?.()}catch(_){}
  beautyProcessor=null;beautyTrack=null;
}
async function ensureBeautyProcessor(){
  if(!localVideo)throw new Error("Camera is not ready.");
  if(beautyProcessor&&beautyTrack===localVideo)return beautyProcessor;
  await releaseBeautyProcessor();
  const Ctor=await loadBeautyExtension();
  if(!beautyExtension)beautyExtension=new Ctor();
  if(!beautyRegistered){
    window.AgoraRTC.registerExtensions([beautyExtension]);
    beautyRegistered=true;
  }
  beautyProcessor=beautyExtension.createProcessor();
  localVideo.pipe(beautyProcessor).pipe(localVideo.processorDestination);
  beautyTrack=localVideo;
  return beautyProcessor;
}
function renderLookButtons(){
  const p=$("#m7lv-preflight");if(!p)return;
  $$(".m7lv-look",p).forEach(b=>b.classList.toggle("active",b.dataset.look===setupLook));
  const strength=$("#m7lv-look-strength",p),out=$("#m7lv-look-strength-value",p);
  if(strength)strength.disabled=setupLook==="natural";
  if(out)out.textContent=setupLook==="natural"?"Off":Math.round(setupLookStrength*100)+"%";
  const label=$("#m7lv-setup-look-label",p);
  if(label)label.textContent=setupLook.charAt(0).toUpperCase()+setupLook.slice(1);
}
async function applySetupLook(key=setupLook){
  const seq=++setupLookSeq;
  setupLook=["natural","soft","glow","warm","vivid","clean"].includes(key)?key:"natural";
  renderLookButtons();
  if(setupLook==="natural"){
    try{await beautyProcessor?.disable?.()}catch(_){}
    if(seq===setupLookSeq)setupStatus("Natural camera · no beauty processing.");
    return;
  }
  setupStatus("Applying "+setupLook+" look…");
  try{
    const processor=await ensureBeautyProcessor();
    if(seq!==setupLookSeq)return;
    processor.setOptions(beautyPresetOptions(setupLook,setupLookStrength));
    await processor.enable();
    if(seq===setupLookSeq)setupStatus("Look is active and will be sent to viewers.");
  }catch(err){
    if(seq!==setupLookSeq)return;
    setupLook="natural";renderLookButtons();
    try{await beautyProcessor?.disable?.()}catch(_){}
    setupStatus("This phone/browser could not enable Live looks. Natural camera is still ready.",true);
  }
}
async function createSetupCapture(){
  await loadAgora();
  if(localAudio||localVideo){
    try{localAudio?.stop();localAudio?.close()}catch(_){}
    try{localVideo?.stop();localVideo?.close()}catch(_){}
    localAudio=null;localVideo=null;
    await releaseBeautyProcessor();
  }
  [localAudio,localVideo]=await Promise.all([
    window.AgoraRTC.createMicrophoneAudioTrack(),
    makePhoneDefaultCamera("environment")
  ]);
  cameraFacing=actualCameraFacing(localVideo,"environment");qualityProfile="device-default";micMuted=false;torchOn=false;setupMirror=true;
  await resetCameraZoom();
  playSetupPreview();
  syncFpsUi(localVideo);
  refreshSetupCameraControls();
}
function cameraSideFromLabel(label){
  const s=String(label||"").toLowerCase();
  if(/front|selfie|facing front|user/.test(s))return"user";
  if(/back|rear|facing back|environment|world/.test(s))return"environment";
  return"";
}
function cameraSpecialty(label){
  return /ultra\s*-?\s*wide|ultrawide|telephoto|\btele\b|macro|depth|infrared|\bir\b|zoom camera/.test(String(label||"").toLowerCase());
}
function cameraNumericHint(label,next){
  const s=String(label||"").toLowerCase();
  const m=s.match(/camera2?\s*[-_: ]?\s*(\d+)/);
  if(!m)return 0;
  const n=Number(m[1]);
  /* Chromium/Android commonly exposes the primary rear as camera 0 and
     primary front as camera 1. This is only a tie-breaker, never the only
     way we decide which side a camera belongs to. */
  if(next==="environment"&&n===0)return 18;
  if(next==="user"&&n===1)return 18;
  return 0;
}
function cameraLabelScore(cam,next){
  const label=String(cam?.label||"").toLowerCase();
  const side=cameraSideFromLabel(label);
  let score=0;

  if(side===next)score+=120;
  else if(side&&side!==next)score-=180;

  if(cameraSpecialty(label))score-=100;
  if(/main|primary/.test(label))score+=35;
  if(next==="environment"&&/back camera|rear camera|facing back/.test(label))score+=25;
  if(next==="user"&&/front camera|selfie|facing front/.test(label))score+=25;
  score+=cameraNumericHint(label,next);
  return score;
}
async function chooseNormalPhysicalCamera(next,track){
  try{
    const cams=await window.AgoraRTC.getCameras();
    if(!cams?.length)return false;

    /* Only force a physical device when labels clearly identify the side.
       If a browser hides/genericizes labels, keep its logical facingMode
       choice rather than guessing and risking the opposite camera. */
    const sideMatches=cams.filter(cam=>cameraSideFromLabel(cam.label)===next);
    if(!sideMatches.length)return false;

    const normal=sideMatches.filter(cam=>!cameraSpecialty(cam.label));
    const pool=normal.length?normal:sideMatches;
    const ordered=[...pool].sort((a,b)=>cameraLabelScore(b,next)-cameraLabelScore(a,next));
    const target=ordered[0];
    if(!target?.deviceId)return false;

    const current=String(track?.getMediaStreamTrack?.()?.getSettings?.()?.deviceId||"");
    if(current!==String(target.deviceId))await track.setDevice(target.deviceId);
    return true;
  }catch(_){return false}
}
function preferredLiveFps(){
  try{
    const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection||null;
    const type=String(conn?.effectiveType||"").toLowerCase();
    if(conn?.saveData||type==="slow-2g"||type==="2g"||type==="3g")return 30;
    const cores=Number(navigator.hardwareConcurrency||0);
    const memory=Number(navigator.deviceMemory||0);
    if(cores>=6&&(memory===0||memory>=4))return 60;
  }catch(_){}
  return 30;
}
function cameraReportedFps(track=localVideo){
  try{
    const value=Number(track?.getMediaStreamTrack?.()?.getSettings?.()?.frameRate);
    return Number.isFinite(value)&&value>0?value:0;
  }catch(_){return 0}
}
function syncFpsUi(track=localVideo){
  const reported=cameraReportedFps(track);
  liveActualFps=reported||liveRequestedFps||30;
  const shown=liveActualFps>=50?60:30;
  const e=$("#m7lv-setup-fps");
  if(e)e.textContent=shown+" FPS";
}
async function makePhoneDefaultCamera(next){
  const preferred=preferredLiveFps();
  let track=null;
  try{
    liveRequestedFps=preferred;
    track=await window.AgoraRTC.createCameraVideoTrack({
      facingMode:next,
      encoderConfig:{frameRate:preferred},
      optimizationMode:"motion"
    });
  }catch(err){
    if(preferred!==60)throw err;
    liveRequestedFps=30;
    track=await window.AgoraRTC.createCameraVideoTrack({
      facingMode:next,
      encoderConfig:{frameRate:30},
      optimizationMode:"motion"
    });
  }
  await chooseNormalPhysicalCamera(next,track);
  syncFpsUi(track);
  return track;
}
async function setCameraFacing(next){
  if(!localVideo)return;

  const previousSide=cameraFacing==="user"?"user":"environment";
  if(next===previousSide)return;

  setupStatus(next==="user"?"Switching to selfie camera…":"Switching to main rear camera…");

  const previous=localVideo;
  const wasLive=mode==="host"&&!!rtcClient&&!!activeStream;
  const wantedLook=setupLook;

  /* First choice: switch the EXISTING Agora camera track to the desired
     physical device. Mobile browsers often refuse opening front + rear
     cameras at the same time, so creating a second camera track while the
     first one is still running can fail even though Flip is supported. */
  try{
    await releaseBeautyProcessor();

    const switchedInPlace=await chooseNormalPhysicalCamera(next,previous);
    if(switchedInPlace){
      localVideo=previous;
      cameraFacing=actualCameraFacing(localVideo,next);
      torchOn=false;
      await resetCameraZoom();

      if(wantedLook!=="natural")await applySetupLook(wantedLook);

      if($("#m7lv-preflight"))playSetupPreview();else localPreview();
      refreshSetupCameraControls();
      syncFpsUi(localVideo);
      applySetupButtonState();

      setupStatus(cameraFacing==="user"
        ?"Selfie camera ready · mirrored preview only."
        :"Main rear camera ready · normal direction, 1×, no mirror.");
      return;
    }
  }catch(err){
    console.warn("ShoufHon Live in-place camera switch failed",err);
  }

  /* Fallback for browsers that hide/genericize device labels:
     release the current camera FIRST, then request the other facingMode.
     This avoids the common mobile 'camera already in use' failure. */
  let replacementTrack=null;
  let unpublished=false;

  try{
    if(wasLive){
      try{
        await rtcClient.unpublish(previous);
        unpublished=true;
      }catch(_){}
    }

    try{previous.stop()}catch(_){}
    try{previous.close()}catch(_){}
    localVideo=null;

    replacementTrack=await makePhoneDefaultCamera(next);

    const detected=detectCameraFacing(replacementTrack);
    if(detected&&detected!==next){
      const corrected=await chooseNormalPhysicalCamera(next,replacementTrack);
      const correctedFacing=detectCameraFacing(replacementTrack);
      if(!corrected||correctedFacing&&correctedFacing!==next){
        throw new Error("WRONG_CAMERA_SIDE");
      }
    }

    localVideo=replacementTrack;
    replacementTrack=null;
    cameraFacing=actualCameraFacing(localVideo,next);
    torchOn=false;
    await resetCameraZoom();

    if(wantedLook!=="natural")await applySetupLook(wantedLook);
    if(wasLive)await rtcClient.publish(localVideo);

    if($("#m7lv-preflight"))playSetupPreview();else localPreview();
    refreshSetupCameraControls();
    syncFpsUi(localVideo);
    applySetupButtonState();

    setupStatus(cameraFacing==="user"
      ?"Selfie camera ready · mirrored preview only."
      :"Main rear camera ready · normal direction, 1×, no mirror.");
  }catch(err){
    console.warn("ShoufHon Live camera switch fallback failed",err);
    try{replacementTrack?.stop()}catch(_){}
    try{replacementTrack?.close()}catch(_){}

    /* Restore the camera we had before so a failed Flip never leaves the
       owner with a dead preview/live stream. */
    try{
      await releaseBeautyProcessor();
      localVideo=await makePhoneDefaultCamera(previousSide);
      cameraFacing=actualCameraFacing(localVideo,previousSide);
      torchOn=false;
      await resetCameraZoom();
      if(wantedLook!=="natural")await applySetupLook(wantedLook);
      if(wasLive&&unpublished)await rtcClient.publish(localVideo);

      if($("#m7lv-preflight"))playSetupPreview();else localPreview();
      refreshSetupCameraControls();
      syncFpsUi(localVideo);
      applySetupButtonState();
      setupStatus("Camera stayed on the current side. Tap Flip again.",true);
    }catch(restoreErr){
      console.warn("ShoufHon Live could not restore camera after Flip failure",restoreErr);
      localVideo=null;
      setupStatus("Camera needs to reopen. Close Live setup and open it again.",true);
    }
  }
}
async function prepareSetupPreview(p){
  const seq=++setupPrepareSeq;
  const start=$(".m7lv-start",p),loading=$(".m7lv-setup-loading",p);
  if(start)start.disabled=true;
  setupReady=false;
  setupStatus("Requesting camera and microphone…");
  try{
    await createSetupCapture();
    if(seq!==setupPrepareSeq||!p.isConnected)return;
    setupReady=true;
    if(loading)loading.style.display="none";
    if(start)start.disabled=!ownerEnt?.video_live_enabled;
    setupStatus("Preview ready · you are not live yet.");
  }catch(err){
    if(seq!==setupPrepareSeq||!p.isConnected)return;
    setupReady=false;
    if(start)start.disabled=true;
    if(loading)loading.innerHTML='<div style="font-size:28px">📷</div><strong>Camera unavailable</strong>';
    setupStatus(friendlyError(err),true);
  }
}
async function closePreflight(keepTracks=false,keepLock=false){
  const p=$("#m7lv-preflight");
  if(p)p.remove();
  setupActive=false;setupStarting=false;setupReady=false;setupPrepareSeq++;setupLookSeq++;
  if(!keepTracks){
    await releaseBeautyProcessor();
    try{localAudio?.stop();localAudio?.close()}catch(_){}
    try{localVideo?.stop();localVideo?.close()}catch(_){}
    localAudio=null;localVideo=null;micMuted=false;torchOn=false;cameraFacing="environment";setupCaps={};
  }
  if(!keepLock&&!overlay)unlock();
}
function createOverlay(stream,host){
  closePreflight(host&&!!localVideo,true);if(overlay)cleanupOverlay(false);
  overlay=document.createElement("div");overlay.id="m7lv-overlay";overlay.innerHTML=overlayBase(stream,host);document.body.appendChild(overlay);lock();activeStream=stream;mode=host?"host":"audience";
  if(!host){$("#m7lv-local",overlay).style.display="none";$("#m7lv-close",overlay).onclick=()=>cleanupOverlay(false)}else $("#m7lv-remote",overlay).style.display="none";
  if(!pushedHistory){try{history.pushState({m7lv:true},"",location.href);pushedHistory=true}catch(_){}}
  bindLiveViewport();syncLiveViewport();wireLiveChrome();
  if(host){
    bindPinchZoom($("#m7lv-local",overlay));
    syncMicUi();
  }
  $("#m7lv-login-chat",overlay)?.addEventListener("click",()=>window.Ma7alakAccount?.open?.());
}
async function preflight(){
  if($("#m7lv-preflight")||setupActive)return;
  ownerState();
  await loadOwnerEnt();

  /* If the parent Live/Offers bridge just verified Video LIVE access,
     reuse that result for a few seconds instead of making the owner wait
     through the same quota RPC twice. The backend still validates again
     when the stream actually starts. */
  const parentVerified=Number(window.__SHOUFHON_VIDEO_ACCESS_VERIFIED_UNTIL__||0)>Date.now();
  let liveAccess=null;

  if(!parentVerified){
    liveAccess=await ownerVideoLiveAccess();

    if(liveAccess){
      if(!liveAccess.video_live_enabled){
        window.ShoufHonMembershipGate?.("video");
        return;
      }
      if(liveAccess.exhausted){
        window.ShoufHonMembershipGate?.("video_limit",liveAccess);
        return;
      }
    }else if(!ownerEnt?.video_live_enabled){
      /* Only fall back to the row snapshot if the RPC is unavailable. */
      window.ShoufHonMembershipGate?.("video");
      return;
    }
  }

  try{window.Ma7alakLiveOffers?.close?.()}catch(_){}
  ownerState();
  const shop=window.Ma7alakOwnerAuth?.shop||{},allowed=true;
  const name=String(shop.shop_name||shop.arabic_name||ownerSlug||"Your shop"),avatar=String(shop.profile_image_url||"");
  const initial=(name.charAt(0)||"S").toUpperCase();
  const existing=streams.find(x=>String(x.shop_slug||"").toLowerCase()===ownerSlug);
  const p=document.createElement("div");p.id="m7lv-preflight";
  p.innerHTML=`<div class="m7lv-setup">
    <div class="m7lv-setup-stage">
      <div id="m7lv-setup-camera"></div>
      <div class="m7lv-setup-loading"><div class="m7lv-setup-spinner"></div><strong>Opening camera…</strong><span>You are not live yet</span></div>
      <div class="m7lv-setup-shade"></div>
      <div class="m7lv-setup-top">
        <button id="m7lv-setup-close" class="m7lv-setup-topbtn" type="button" aria-label="Close Live setup">×</button>
        <div class="m7lv-setup-preview-chip"><i></i> LIVE PREVIEW · NOT BROADCASTING</div>
        <div id="m7lv-setup-fps" class="m7lv-setup-fps">AUTO FPS</div>
      </div>
      <div class="m7lv-setup-tools">
        <button id="m7lv-setup-mic" class="m7lv-setup-tool" type="button"><b>🎤</b><span>Mic</span></button>
        <button id="m7lv-setup-flash" class="m7lv-setup-tool" type="button"><b>⚡</b><span>Flash</span></button>
      </div>
      <div class="m7lv-pinch-hint">Pinch with two fingers to zoom</div>
      <div class="m7lv-studio-actions">
        <button id="m7lv-setup-flip" class="m7lv-studio-action" type="button"><b>↻</b><span>Flip</span></button>
        <button id="m7lv-setup-beauty" class="m7lv-studio-action" type="button"><b>✿</b><span>Beauty</span></button>
        <button id="m7lv-setup-effects" class="m7lv-studio-action" type="button"><b>✨</b><span>Effects</span></button>
        <button id="m7lv-setup-adjust" class="m7lv-studio-action" type="button"><b>☼</b><span>Adjust</span></button>
      </div>
      <div id="m7lv-setup-panel" class="m7lv-setup-panel" data-mode="">
        <div class="m7lv-panel-head"><strong id="m7lv-panel-title">Beauty</strong><button id="m7lv-panel-close" class="m7lv-panel-close" type="button" aria-label="Close controls">×</button></div>
        <div class="m7lv-panel-section" data-panel="beauty">
          <div class="m7lv-look-row">
            <button class="m7lv-look active" data-look="natural" type="button"><b>◉</b><span>Off</span></button>
            <button class="m7lv-look" data-look="soft" type="button"><b>✿</b><span>Soft</span></button>
            <button class="m7lv-look" data-look="glow" type="button"><b>✦</b><span>Glow</span></button>
          </div>
        </div>
        <div class="m7lv-panel-section" data-panel="effects">
          <div class="m7lv-look-row">
            <button class="m7lv-look active" data-look="natural" type="button"><b>◉</b><span>None</span></button>
            <button class="m7lv-look" data-look="warm" type="button"><b>☀</b><span>Warm</span></button>
            <button class="m7lv-look" data-look="vivid" type="button"><b>◆</b><span>Vivid</span></button>
            <button class="m7lv-look" data-look="clean" type="button"><b>◇</b><span>Clean</span></button>
          </div>
        </div>
        <div class="m7lv-panel-section" data-panel="adjust">
          <label class="m7lv-setup-range is-off"><span>Exposure</span><input id="m7lv-setup-exposure" type="range"><output>0.0</output></label>
          <label class="m7lv-setup-range is-off"><span>Color</span><input id="m7lv-setup-color" type="range"><output>Auto</output></label>
        </div>
        <label class="m7lv-setup-range m7lv-shared-strength"><span>Strength</span><input id="m7lv-look-strength" type="range" min="15" max="100" step="1" value="${Math.round(setupLookStrength*100)}" disabled><output id="m7lv-look-strength-value">Off</output></label>
      </div>
      <div class="m7lv-setup-bottom">
        <div class="m7lv-setup-shop">
          <div class="m7lv-setup-avatar">${avatar?`<img src="${esc(avatar)}" alt="">`:esc(initial)}</div>
          <div class="m7lv-setup-shopcopy"><strong>${esc(name)}</strong><small>Set up your camera before viewers can see you</small></div>
        </div>
        <input id="m7lv-title" maxlength="80" autocomplete="off" placeholder="What is this Live about? (optional)" value="${esc(existing?.title||"")}">
        <div class="m7lv-pre-status">${allowed?"Opening your camera…":"Video Live is disabled for this shop in Admin."}</div>
        <button class="m7lv-start" type="button" disabled>${allowed?(existing?"Resume Live":"Go Live"):"Live disabled"}</button>
        <div class="m7lv-setup-footnote">ShoufHon now keeps the phone camera's native framing. Selfie preview is mirrored like a normal phone camera; viewers receive the normal orientation.</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(p);lock();setupActive=true;setupStarting=false;setupReady=false;setupLook="natural";setupLookStrength=.58;setupMirror=true;
  renderLookButtons();

  $("#m7lv-setup-close",p).onclick=()=>closePreflight();
  $("#m7lv-setup-flip",p).onclick=()=>setCameraFacing(cameraFacing==="environment"?"user":"environment");
  $("#m7lv-setup-mic",p).onclick=()=>toggleMic();
  $("#m7lv-setup-flash",p).onclick=()=>toggleTorch();
  const studio=$(".m7lv-setup",p),panel=$("#m7lv-setup-panel",p);
  const openStudioPanel=mode=>{
    if(!studio||!panel)return;
    panel.dataset.mode=mode;
    panel.classList.add("open");
    studio.classList.add("panel-open");
    $$(".m7lv-panel-section",panel).forEach(section=>section.classList.toggle("show",section.dataset.panel===mode));
    const title=$("#m7lv-panel-title",panel);
    if(title)title.textContent=mode==="beauty"?"Beauty":mode==="effects"?"Effects":"Adjust camera";
    ["beauty","effects","adjust"].forEach(key=>$("#m7lv-setup-"+key,p)?.classList.toggle("active",key===mode));
  };
  const closeStudioPanel=()=>{
    if(!studio||!panel)return;
    panel.classList.remove("open");
    studio.classList.remove("panel-open");
    ["beauty","effects","adjust"].forEach(key=>$("#m7lv-setup-"+key,p)?.classList.remove("active"));
  };
  $("#m7lv-setup-beauty",p).onclick=()=>openStudioPanel("beauty");
  $("#m7lv-setup-effects",p).onclick=()=>openStudioPanel("effects");
  $("#m7lv-setup-adjust",p).onclick=()=>openStudioPanel("adjust");
  $("#m7lv-panel-close",p).onclick=closeStudioPanel;
  bindPinchZoom($("#m7lv-setup-camera",p));
  $$(".m7lv-look",p).forEach(button=>button.onclick=()=>applySetupLook(button.dataset.look));
  const strength=$("#m7lv-look-strength",p);
  if(strength)strength.oninput=()=>{
    setupLookStrength=Math.max(.15,Math.min(1,Number(strength.value)/100));
    renderLookButtons();
    if(setupLook!=="natural"){
      clearTimeout(strength._m7timer);
      strength._m7timer=setTimeout(()=>applySetupLook(setupLook),65);
    }
  };
  const bindTune=(id,key)=>{
    const input=$(id,p);if(!input)return;
    input.oninput=()=>{
      const row=input.closest(".m7lv-setup-range"),out=row?$("output",row):null;
      if(out){
        const v=Number(input.value);
        out.textContent=key==="zoom"?v.toFixed(v<2?1:0)+"×":key==="colorTemperature"?Math.round(v)+"K":(v>0?"+":"")+v.toFixed(1);
      }
    };
    input.onchange=()=>applyCameraConstraint(key,input.value);
  };
  bindTune("#m7lv-setup-exposure","exposureCompensation");
  bindTune("#m7lv-setup-color","colorTemperature");

  const start=$(".m7lv-start",p);
  start.onclick=async()=>{
    if(setupStarting||!setupReady||!allowed)return;
    setupStarting=true;start.disabled=true;start.textContent=existing?"Resuming…":"Going live…";
    setupStatus("Creating your secure Live room…");
    try{
      const title=$("#m7lv-title",p).value.trim()||`${name} is live`;
      await startHost(title);
    }catch(err){
      setupStarting=false;
      if(p.isConnected){
        start.disabled=!setupReady;start.textContent=existing?"Resume Live":"Go Live";
        setupStatus(friendlyError(err),true);
      }
    }
  };

  if(allowed)prepareSetupPreview(p);else{
    $(".m7lv-setup-loading",p).innerHTML='<div style="font-size:28px">🔒</div><strong>Video Live disabled</strong>';
    applySetupButtonState();
  }
}

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
async function setupRoom(){
  await setupInteractions();
  await setupPresence();
  updateViewerCount();
}
function updateRtcViewerCount(){updateViewerCount()}
function spawnHeart(){if(!overlay)return;const stage=$("#m7lv-stage",overlay);if(!stage)return;const h=document.createElement("div");h.className="m7lv-heart";h.textContent=["❤","💛","💚","💙","💜"][Math.floor(Math.random()*5)];h.style.right=(18+Math.random()*56)+"px";stage.appendChild(h);setTimeout(()=>h.remove(),1600)}
async function sendHeart(){
  if(mode==="host"||!viewerCanInteract()||!activeStream)return;
  try{await c.rpc("shoufhon_live_react",{p_stream_id:activeStream.id})}catch(_){}
}
function wireChat(){
  const input=$("#m7lv-chat-input",overlay),send=$("#m7lv-send",overlay),heart=$("#m7lv-heart-view",overlay);
  const canSend=mode==="host"||viewerCanInteract();
  let sending=false;
  const go=async()=>{
    if(sending||!canSend||!activeStream)return;
    const text=String(input?.value||"").trim();if(!text)return;
    const user=window.Ma7alakAccount?.session?.user;
    if(!user?.id){window.Ma7alakAccount?.open?.();return}
    sending=true;
    try{
      const r=await c.from("shop_live_chat_messages").insert({stream_id:activeStream.id,user_id:user.id,message:text});
      if(r.error)throw r.error;
      input.value="";
    }catch(err){
      const msg=String(err?.message||"");
      setStatus(msg.includes("CHAT_RATE_LIMIT")?"Slow down a little.":(msg||"Could not send message."));
    }finally{sending=false}
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

function cameraPortrait(){return (window.visualViewport?.height||window.innerHeight||0)>=(window.visualViewport?.width||window.innerWidth||0)}
function videoEncoder(level="720"){
  const portrait=cameraPortrait();
  if(level==="360")return portrait?{width:360,height:640,frameRate:24,bitrateMin:260,bitrateMax:700}:{width:640,height:360,frameRate:24,bitrateMin:260,bitrateMax:700};
  if(level==="480")return portrait?{width:480,height:854,frameRate:30,bitrateMin:420,bitrateMax:1100}:{width:854,height:480,frameRate:30,bitrateMin:420,bitrateMax:1100};
  return portrait?{width:720,height:1280,frameRate:30,bitrateMin:650,bitrateMax:1900}:{width:1280,height:720,frameRate:30,bitrateMin:650,bitrateMax:1900};
}
async function syncEncoderOrientation(){
  /* Keep the phone camera's native framing/aspect ratio.
     Do not force portrait encoder dimensions here. */
  return;
}
function syncMicUi(){
  const muted=!!micMuted;
  if(overlay){
    ["#m7lv-mute","#m7lv-mute-f"].forEach(s=>{
      const el=$(s,overlay);
      if(!el)return;
      el.classList.toggle("on",muted);
      el.setAttribute("aria-pressed",muted?"true":"false");
    });
    const f=$("#m7lv-mute-f",overlay);if(f)f.textContent=muted?"🔇":"🎤";
    const b=$("#m7lv-mute b",overlay);if(b)b.textContent=muted?"🔇":"🎤";
    const label=$("#m7lv-mute span",overlay);if(label)label.textContent=muted?"Muted":"Mic";
  }
  applySetupButtonState();
}
async function toggleMic(){
  if(!localAudio)return;
  const previous=micMuted;
  micMuted=!micMuted;
  syncMicUi();
  setupStatus(micMuted?"Microphone muted.":"Microphone ready.");
  try{
    await localAudio.setMuted(micMuted);
  }catch(err){
    micMuted=previous;
    syncMicUi();
    setupStatus("Microphone change failed. Try again.",true);
  }
}
async function toggleVideo(){if(!localVideo)return;videoPaused=!videoPaused;await localVideo.setEnabled(!videoPaused);["#m7lv-pause","#m7lv-pause-f"].forEach(s=>$(s,overlay)?.classList.toggle("on",videoPaused));const f=$("#m7lv-pause-f",overlay);if(f)f.textContent=videoPaused?"🚫":"🎥";setStatus(videoPaused?"Video paused. Audio is still live.":"Video resumed.")}
async function toggleTorch(){
  if(!localVideo)return;
  try{
    const track=cameraMediaTrack(),caps=track?.getCapabilities?track.getCapabilities():{};
    if(!caps.torch){setupStatus("Flash is not supported by this camera/browser.",true);return}
    torchOn=!torchOn;
    await track.applyConstraints({advanced:[{torch:torchOn}]});
    if(overlay)["#m7lv-torch","#m7lv-torch-f"].forEach(s=>$(s,overlay)?.classList.toggle("on",torchOn));
    applySetupButtonState();
    setupStatus(torchOn?"Flash on.":"Flash off.");
  }catch(_){setupStatus("Flash is not available on this camera.",true)}
}
async function fullscreen(){try{if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if($("#m7lv-stage",overlay)?.webkitRequestFullscreen)$("#m7lv-stage",overlay).webkitRequestFullscreen()}else if(document.exitFullscreen)await document.exitFullscreen()}catch(_){setStatus("Fullscreen is controlled by this browser.")}}

async function adapt(q){
  /* Agora can handle network adaptation without us changing the camera's
     width/height. Forced portrait encoder sizes were making the phone view
     look cropped/zoomed, so preserve native camera framing. */
  return;
}
async function renewToken(){if(!rtcClient||!activeStream)return;try{const r=mode==="host"?await api("host-token",{stream_id:activeStream.id,uid:hostUid}):await api("join",{stream_id:activeStream.id,uid:hostUid});if(r?.token)await rtcClient.renewToken(r.token)}catch(err){console.warn("ShoufHon Live token renewal failed",err)}}
function wireRtcEvents(){
  rtcClient.on("network-quality",async q=>{const raw=mode==="host"?q.uplinkNetworkQuality:q.downlinkNetworkQuality,[label,color]=quality(raw);setQuality(label,color);await adapt(raw)});
  rtcClient.on("connection-state-change",cur=>{if(cur==="RECONNECTING")setStatus("Connection weak — reconnecting automatically…");else if(cur==="CONNECTED"&&mode==="host")setStatus("You are LIVE.");else if(cur==="DISCONNECTED"&&overlay)setStatus("Disconnected. Waiting for network…")});
  rtcClient.on("user-joined",()=>updateRtcViewerCount());
  rtcClient.on("user-left",()=>updateRtcViewerCount());
  rtcClient.on("token-privilege-will-expire",renewToken);
  rtcClient.on("token-privilege-did-expire",renewToken);
}

async function startHost(title){
  await loadAgora();
  if(!localAudio||!localVideo){
    await createSetupCapture();
    if(setupLook!=="natural")await applySetupLook(setupLook);
  }
  const start=await api("start",{shop_slug:ownerSlug,title});
  const stream={...start.stream,shop_slug:ownerSlug,title:start.stream?.title||title};
  createOverlay(stream,true);activeStream=stream;hostUid=Number(start.uid)||0;
  try{
    rtcClient=window.AgoraRTC.createClient({mode:"live",codec:"vp8"});
    await rtcClient.setClientRole("host");
    wireRtcEvents();
    setStatus("Connecting your prepared camera…");
    await rtcClient.join(start.app_id,start.stream.channel_name,start.token,hostUid);
    localPreview();
    await loadStreamOffers();
    try{await localAudio.setMuted(!!micMuted)}catch(_){}
    syncMicUi();
    await rtcClient.publish([localAudio,localVideo]);
    await setupRoom("host");
    await api("activate",{stream_id:stream.id});
    activeStream.status="live";
    setStatus("You are LIVE.");
    await acquireWake();
    heartbeatTimer=setInterval(async()=>{
      try{await api("heartbeat",{stream_id:stream.id})}
      catch(err){
        const code=String(err?.code||err?.message||"");
        if(code==="MONTHLY_LIVE_LIMIT_REACHED"||code==="VIDEO_LIVE_NOT_ENABLED"||code==="LIVE_NOT_ENABLED"||code==="STREAM_EXPIRED"||code==="STREAM_ENDED"){
          setStatus(friendlyError(err));
          setTimeout(()=>cleanupOverlay(false),1200);
        }
      }
    },30000);
    wireHostControls();
    await refresh();
  }catch(err){
    try{await api("fail",{stream_id:stream.id})}catch(_){}
    const code=String(err?.code||err?.message||"");
    if(code==="MONTHLY_LIVE_LIMIT_REACHED"){
      const access=await ownerVideoLiveAccess();
      await cleanupOverlay(false);
      window.ShoufHonMembershipGate?.("video_limit",access||{});
      return;
    }
    setStatus(friendlyError(err));
    setTimeout(()=>cleanupOverlay(false),2200);
    throw err;
  }
}
function wireHostControls(){const bind=(id,fn)=>{const e=$(id,overlay);if(e)e.onclick=fn};bind("#m7lv-switch",switchCamera);bind("#m7lv-mute",toggleMic);bind("#m7lv-pause",toggleVideo);bind("#m7lv-torch",toggleTorch);bind("#m7lv-end",endLive)}

async function openViewer(id){
  if(overlay)return;
  const base=streams.find(x=>String(x.id)===String(id));
  if(!base)return;

  /*
     Open the real Live room immediately on the user's tap.
     Agora SDK loading + secure join-token request happen behind this UI,
     so a normal 1–2 second network connection never feels like a dead tap.
  */
  const openSeq=++viewerOpenSeq;
  createOverlay(base,false);
  const openedOverlay=overlay;
  setStatus("Connecting to live…");
  setQuality("Connecting…","#e8be3e");

  /* Offers can load while Agora/token work is happening. */
  const offersPromise=loadStreamOffers().catch(()=>{});

  let AgoraRTC,join;
  try{
    [AgoraRTC,join]=await Promise.all([
      loadAgora(),
      api("join",{stream_id:id})
    ]);
  }catch(err){
    if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;
    setStatus(friendlyError(err));
    setQuality("Unavailable","#ef4444");
    refresh().catch(()=>{});
    setTimeout(()=>{
      if(openSeq===viewerOpenSeq&&overlay===openedOverlay){
        cleanupOverlay(false);
      }
    },1450);
    return;
  }

  if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;

  const stream={...base,...join.stream};
  activeStream=stream;
  hostUid=Number(join.uid)||0;
  setStatus("Joining live…");

  try{
    const thisClient=AgoraRTC.createClient({mode:"live",codec:"vp8"});
    rtcClient=thisClient;
    await thisClient.setClientRole("audience");

    if(openSeq!==viewerOpenSeq||overlay!==openedOverlay){
      try{await thisClient.leave()}catch(_){}
      if(rtcClient===thisClient)rtcClient=null;
      return;
    }

    wireRtcEvents();

    thisClient.on("user-published",async(user,mediaType)=>{
      try{
        await thisClient.subscribe(user,mediaType);
        if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;

        if(mediaType==="video"){
          const remote=$("#m7lv-remote",openedOverlay);
          if(!remote)return;
          hostRemoteUid=String(user.uid);
          user.videoTrack.play(remote,{fit:"contain",mirror:false});
          setStatus("Live video connected.");
          updateRtcViewerCount();
        }

        if(mediaType==="audio"){
          user.audioTrack.play();
        }
      }catch(_){}
    });

    thisClient.on("user-unpublished",(user,mediaType)=>{
      if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;
      if(mediaType==="video"&&String(user.uid)===hostRemoteUid){
        setStatus("Host paused video.");
      }
    });

    thisClient.on("user-left",user=>{
      if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;
      updateViewerCount();
      if(hostRemoteUid&&String(user.uid)===hostRemoteUid){
        setStatus("Host left the live.");
        setTimeout(()=>{
          if(openSeq===viewerOpenSeq&&overlay===openedOverlay){
            cleanupOverlay(false);
          }
        },1700);
      }
    });

    await thisClient.join(
      join.app_id,
      stream.channel_name,
      join.token,
      hostUid
    );

    if(openSeq!==viewerOpenSeq||overlay!==openedOverlay){
      try{await thisClient.leave()}catch(_){}
      if(rtcClient===thisClient)rtcClient=null;
      return;
    }

    await offersPromise;
    await setupRoom("audience");

    if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;

    await acquireWake();
    setStatus("Connected. Waiting for video…");
  }catch(err){
    if(openSeq!==viewerOpenSeq||overlay!==openedOverlay)return;
    setStatus(friendlyError(err));
    setQuality("Connection issue","#ef4444");
    setTimeout(()=>{
      if(openSeq===viewerOpenSeq&&overlay===openedOverlay){
        cleanupOverlay(false);
      }
    },1800);
  }
}

async function endLive(){if(leaving)return;if(!confirm("End this live video now?"))return;leaving=true;setStatus("Ending live…");try{await api("end",{stream_id:activeStream?.id})}catch(_){}await cleanupOverlay(false);leaving=false;await refresh()}
async function cleanupOverlay(popHistory=true){
  if(!overlay)return;
  /* Cancels any in-flight audience join so a fast Close can never reopen
     or continue wiring a viewer after the panel has already disappeared. */
  viewerOpenSeq++;
  clearInterval(heartbeatTimer);heartbeatTimer=null;
  await releaseBeautyProcessor();
  try{localAudio?.stop();localAudio?.close()}catch(_){}
  try{localVideo?.stop();localVideo?.close()}catch(_){}
  localAudio=null;localVideo=null;
  try{if(rtcClient)await rtcClient.leave()}catch(_){}rtcClient=null;
  try{if(roomChannel)await c.removeChannel(roomChannel)}catch(_){}roomChannel=null;
  try{if(chatChannel)await c.removeChannel(chatChannel)}catch(_){}chatChannel=null;
  try{if(reactionChannel)await c.removeChannel(reactionChannel)}catch(_){}reactionChannel=null;
  unbindLiveViewport();chatProfileCache.clear();liveOffers=[];
  await releaseWake();
  overlay.remove();overlay=null;mode="";activeStream=null;hostUid=0;hostRemoteUid="";
  micMuted=false;videoPaused=false;torchOn=false;cameraFacing="environment";qualityProfile="device-default";
  unlock();
  if(popHistory&&pushedHistory){pushedHistory=false;try{history.back()}catch(_){}}else pushedHistory=false;
}
window.addEventListener("popstate",()=>{if(!overlay)return;if(mode==="host"){history.pushState({m7lv:true},"",location.href);pushedHistory=true}else{pushedHistory=false;cleanupOverlay(false)}});
window.addEventListener("pagehide",()=>{if(mode!=="host"||!activeStream)return;try{const token=window.Ma7alakAccount?.session?.access_token||"";fetch(FN_URL,{method:"POST",headers:{"content-type":"application/json","apikey":SUPABASE_KEY,...(token?{authorization:"Bearer "+token}:{})},body:JSON.stringify({action:"end",stream_id:activeStream.id}),keepalive:true,credentials:"omit"})}catch(_){}});
window.addEventListener("pagehide",()=>{if($("#m7lv-preflight"))closePreflight()});

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
  ensurePremiumCss();
  ensureImmersiveLiveCss();
  if(!await ready())return;
  await loadOwnerEnt();
  await refresh();
  openVideoDeepLinkFromUrl();
  await subscribeStreams();

  window.addEventListener("ma7alak:owner-auth-change",async()=>{
    await loadOwnerEnt();
    emitLiveState();
  });

  window.addEventListener("focus",()=>{if(!document.hidden)refresh()});
  window.addEventListener("pageshow",()=>{if(!document.hidden)refresh()});
  window.addEventListener("orientationchange",()=>setTimeout(syncEncoderOrientation,280));
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});

  /* Realtime is the primary path. This is only a quiet recovery poll.
     Do not watch the whole DOM: the old MutationObserver caused the
     homepage Live cards to be constantly removed/reinserted while scrolling. */
  setInterval(()=>{if(!document.hidden)refresh()},30000);
}
boot();
})();