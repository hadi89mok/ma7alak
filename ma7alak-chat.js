/* =========================================================
 SHOUFHON LIVE CHAT V10.2 — WHATSAPP VOICE + MEDIA + TEXT STORY REPLIES + REACTIONS
 - keeps avatars/unread/report/message acceptance/delete controls
 - Story replies stay inside the existing viewer↔shop conversation
 - WhatsApp-style long-press reactions with realtime counts
 - clickable Story cards open the exact active Story
 - expired/deleted Story context degrades safely
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_CHAT_V10__)return;window.__MA7ALAK_CHAT_V10__=true;window.__MA7ALAK_CHAT_V9__=true;window.__MA7ALAK_CHAT_V8__=true;window.__MA7ALAK_CHAT_V7__=true;
const CHAT_SCRIPT_SRC=document.currentScript?.src||"";
let client,user,mode="viewer",channel=null,settingsChannel=null,reactionPicker=null,reactionPickerOutside=null,sharedStoryViewerPromise=null,inboxClockTimer=null,inboxRefreshTimer=null,inboxLiveFallbackTimer=null,inboxWakeHandler=null,activeRecorder=null,activeMicStream=null,voiceTimer=null,voiceStartedAt=0,voiceChunks=[],voiceDraft=null,recordingDiscard=false,pendingMedia=null,pendingMediaUrl="",composerBusy=false,voiceGesture=null,voiceLocked=false,voiceStartPromise=null,activeVoiceConversation=null;const CHAT_MEDIA_BUCKET="chat-media";const chatMediaSignedCache=new Map();
const sleep=m=>new Promise(r=>setTimeout(r,m));
const esc=v=>String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function vr(){for(let i=0;i<100&&!window.Ma7alakAccount;i++)await sleep(50);if(!window.Ma7alakAccount)throw new Error("ShoufHon account system is not ready.");await window.Ma7alakAccount.ready();client=window.Ma7alakAccount.client;user=window.Ma7alakAccount.user;mode="viewer"}
async function or(){for(let i=0;i<100&&!window.Ma7alakOwnerAuth;i++)await sleep(50);if(!window.Ma7alakOwnerAuth)throw new Error("ShoufHon owner system is not ready.");await window.Ma7alakOwnerAuth.ready();client=window.Ma7alakOwnerAuth.client;user=window.Ma7alakOwnerAuth.user;mode="owner";return !!window.Ma7alakOwnerAuth.owner}
function css(){if(document.getElementById("m7c-v9-css"))return;document.getElementById("m7c-v8-css")?.remove();document.getElementById("m7c-v7-css")?.remove();document.getElementById("m7c-v6-css")?.remove();let s=document.createElement("style");s.id="m7c-v9-css";s.textContent=`
#m7-chat-shell{position:fixed;inset:0;background:#000b;z-index:2147483500;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:Arial;overscroll-behavior:contain}
#m7-chat{width:min(540px,100%);height:min(760px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);background:#100e0d;color:#fff;border:1px solid #db9b4659;border-radius:24px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 70px #000b;min-height:0}
#m7-chat-head{padding:12px 14px;background:#1d1511;border-bottom:1px solid #3b2a20;display:flex;align-items:center;gap:8px;flex:0 0 auto;min-height:64px;box-sizing:border-box}
.m7-head-person{display:flex;align-items:center;gap:9px;min-width:0;flex:1}.m7-head-person.m7-shop-profile-link{cursor:pointer;border-radius:12px;padding:3px 5px;margin-left:-5px;transition:background .16s ease,transform .16s ease}.m7-head-person.m7-shop-profile-link:hover{background:#ffffff0b}.m7-head-person.m7-shop-profile-link:active{transform:scale(.985)}.m7-head-person.m7-shop-profile-link:focus-visible{outline:2px solid #d99a45;outline-offset:2px}.m7-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #d99a45;background:#30251f;flex:0 0 40px}.m7-avatar.fallback{display:grid;place-items:center;font-weight:900;color:#f1b45a}#m7-chat-title{font-weight:900;color:#f1b45a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7c-icon{border:0;background:#30251f;color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer;flex:0 0 auto}.m7c-danger{background:#4a211f;color:#ffb5ae}.m7c-icon.m7c-block-active{background:#6b2722;color:#ffd4cf;box-shadow:inset 0 0 0 1px #ff8f8245}.m7-chat-block-note{margin:0 10px 10px;padding:9px 12px;border:1px solid #ff8f8240;border-radius:12px;background:#321816;color:#ffd1cb;font:800 11px/1.35 Arial;text-align:center}
#m7-owner-accept{border:1px solid #ffffff18;border-radius:10px;padding:8px 9px;font:800 10px Arial;cursor:pointer;white-space:nowrap}#m7-owner-accept.on{background:#24452e;color:#bff1cb}#m7-owner-accept.off{background:#522b27;color:#ffd0ca}
#m7-chat-body{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:9px;overscroll-behavior:contain}
.m7-msg{max-width:78%;padding:10px 12px;border-radius:16px;background:#29231f;line-height:1.35;word-break:break-word;position:relative}.m7-msg.mine{align-self:flex-end;background:#a96d28;padding-right:34px}.m7-msg-text{white-space:pre-wrap}.m7-msg-time{font-size:10px;opacity:.6;margin-top:4px}.m7-msg-delete{position:absolute;right:5px;top:5px;width:25px;height:25px;border:0;border-radius:8px;background:#0003;color:#fff;display:grid;place-items:center;font-size:14px;cursor:pointer;padding:0}
.m7-story-reply-card{width:min(260px,100%);margin:0 0 8px;padding:0;border:1px solid #ffffff22;border-radius:14px;overflow:hidden;background:#0f0d0c;color:#fff;text-align:left;cursor:pointer;display:block;box-shadow:0 8px 22px #0004}.m7-story-reply-card:active{transform:scale(.985)}.m7-story-card-top{display:flex;gap:10px;align-items:center;padding:8px}.m7-story-card-media{width:62px;height:78px;border-radius:10px;overflow:hidden;background:linear-gradient(145deg,#2c241e,#0d0b0a);display:grid;place-items:center;position:relative;flex:0 0 62px;border:1px solid #ffffff17}.m7-story-card-media img,.m7-story-card-media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}.m7-story-card-media video{background:#18130f}.m7-story-card-fallback{font-size:24px;opacity:.75}.m7-story-card-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#0009;border:1px solid #fff5;font-size:16px;padding-left:2px;box-shadow:0 3px 10px #0008}.m7-story-card-copy{min-width:0;flex:1}.m7-story-card-label,.m7-story-card-name,.m7-story-card-status{display:block}.m7-story-card-label{font-size:11px;font-weight:900;color:#efb35d;letter-spacing:.02em}.m7-story-card-name{margin-top:4px;font-size:12px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7-story-card-status{margin-top:4px;font-size:11px;color:#bdb3aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7-story-card-badge{display:inline-flex;margin-top:6px;padding:3px 6px;border-radius:999px;background:#4a211f;color:#ffb9b1;font-size:9px;font-weight:900}.m7-story-reply-card.is-expired{cursor:default;opacity:.72}.m7-story-reply-card.is-expired .m7-story-card-label{color:#c7b8aa}
.m7-msg-reactions{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.m7-msg-reactions:empty{display:none}.m7-reaction-pill{border:1px solid #ffffff1c;background:#171310;color:#fff;border-radius:999px;min-height:27px;padding:3px 8px;font:700 13px/1 Arial,sans-serif;display:inline-flex;align-items:center;gap:4px;cursor:pointer;box-shadow:0 2px 8px #0002}.m7-msg.mine .m7-reaction-pill{background:#6f451f}.m7-reaction-pill.mine{border-color:#e7aa50;background:#3b2a16!important;box-shadow:0 0 0 1px #e7aa5033}.m7-reaction-count{font-size:10px;opacity:.82}.m7-reaction-picker{position:fixed;z-index:2147483646;display:flex;align-items:center;gap:4px;padding:7px;border:1px solid #ffffff24;border-radius:999px;background:#171310f5;box-shadow:0 14px 38px #000b;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);touch-action:manipulation}.m7-reaction-choice{width:39px;height:39px;border:0;border-radius:50%;background:transparent;color:#fff;font-size:23px;display:grid;place-items:center;padding:0;cursor:pointer;transition:transform .12s ease,background .12s ease}.m7-reaction-choice:active{transform:scale(.86)}.m7-reaction-choice.selected{background:#d99a452a;box-shadow:inset 0 0 0 1px #d99a4560}
#m7-chat-send{display:flex;gap:8px;padding:10px max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:#171310;border-top:1px solid #34261e;flex:0 0 auto}#m7-chat-input{flex:1;min-width:0;border:1px solid #453327;background:#0e0c0b;color:#fff;border-radius:14px;padding:12px;font-size:16px}#m7-chat-send button{border:0;border-radius:14px;background:#d99a45;font-weight:900;padding:0 17px}
.m7-convo{display:flex;align-items:center;gap:11px;padding:12px;border:1px solid #34281f;border-radius:16px;background:#191512;cursor:pointer;position:relative;flex:0 0 auto}.m7-convo.unread{border-color:#49ce78;background:linear-gradient(135deg,#1f2e22,#181512);box-shadow:0 0 0 1px #49ce7838,0 0 22px #49ce7815}.m7-convo-copy{min-width:0;flex:1}.m7-convo strong{color:#f1b45a}.m7-convo small{display:block;color:#aaa;margin-top:4px}.m7-convo-time{display:block;margin-top:5px;color:#8f877f;font-size:10px;font-weight:700;white-space:nowrap}.m7-convo.unread .m7-convo-time{color:#8fd9a6}.m7-convo-delete{border:0;border-radius:10px;width:34px;height:34px;background:#3b1f1c;color:#ffb0a7;font-size:16px;cursor:pointer;flex:0 0 34px}.m7-new{position:relative;background:#13c45b;color:#fff;font-size:10px;font-weight:950;letter-spacing:.25px;border:1px solid #91ffb8;border-radius:999px;padding:7px 10px;box-shadow:0 0 0 1px #13c45b66,0 0 18px #13c45b70;text-shadow:0 1px 1px #0008;transform-origin:50% 50%;will-change:transform;animation:m7NewWiggle 1.65s ease-in-out infinite;-webkit-animation:m7NewWiggle 1.65s ease-in-out infinite}.m7-new::before{content:"";width:6px;height:6px;border-radius:50%;background:#fff;display:inline-block;margin-right:4px;vertical-align:1px;box-shadow:0 0 8px #fff}.m7-empty{text-align:center;color:#aaa;margin-top:30px}.m7-loading{text-align:center;color:#b7aa9d;margin-top:25px}.m7-error{text-align:center;color:#ffb3a8;margin:25px 12px;line-height:1.45}@keyframes m7NewWiggle{0%,58%,100%{transform:translate3d(0,0,0) rotate(0deg) scale(1)}10%{transform:translate3d(-2px,0,0) rotate(-4deg) scale(1.03)}20%{transform:translate3d(2px,0,0) rotate(4deg) scale(1.05)}30%{transform:translate3d(-2px,0,0) rotate(-3deg) scale(1.04)}40%{transform:translate3d(2px,0,0) rotate(3deg) scale(1.05)}50%{transform:translate3d(0,0,0) rotate(0deg) scale(1.08)}}@-webkit-keyframes m7NewWiggle{0%,58%,100%{-webkit-transform:translate3d(0,0,0) rotate(0deg) scale(1)}10%{-webkit-transform:translate3d(-2px,0,0) rotate(-4deg) scale(1.03)}20%{-webkit-transform:translate3d(2px,0,0) rotate(4deg) scale(1.05)}30%{-webkit-transform:translate3d(-2px,0,0) rotate(-3deg) scale(1.04)}40%{-webkit-transform:translate3d(2px,0,0) rotate(3deg) scale(1.05)}50%{-webkit-transform:translate3d(0,0,0) rotate(0deg) scale(1.08)}}
#m7-chat.m7-inbox-panel{height:min(500px,calc(100dvh - 120px));max-height:min(500px,calc(100dvh - 120px))}
#m7-chat.m7-inbox-panel #m7-chat-body{overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#d9a44155 transparent}
#m7-chat.m7-inbox-panel #m7-chat-body::-webkit-scrollbar{width:5px}
#m7-chat.m7-inbox-panel #m7-chat-body::-webkit-scrollbar-thumb{background:#d9a44155;border-radius:20px}
@media(max-width:600px){#m7-chat-shell{padding:0;align-items:stretch;justify-content:stretch;background:#100e0d}#m7-chat{width:100%;height:100dvh;max-height:100dvh;border:0;border-radius:0;box-shadow:none}#m7-chat-head{padding-top:max(12px,env(safe-area-inset-top));min-height:calc(64px + env(safe-area-inset-top))}#m7-chat-body{padding:12px}.m7-msg{max-width:86%}#m7-chat-shell.m7-inbox-shell{padding:0 14px 14px;align-items:flex-start;justify-content:center;background:#0009}#m7-chat.m7-inbox-panel{width:calc(100% - 28px);height:min(500px,calc(100dvh - 104px));max-height:min(500px,calc(100dvh - 104px));margin-top:max(78px,calc(env(safe-area-inset-top) + 68px));border:1px solid #db9b4659;border-radius:22px;box-shadow:0 24px 70px #000b}#m7-chat.m7-inbox-panel #m7-chat-head{padding-top:12px;min-height:64px}.m7-convo{min-height:68px;box-sizing:border-box}}
@supports not (height:100dvh){@media(max-width:600px){#m7-chat{height:100vh;max-height:100vh}}}
`;document.head.appendChild(s)}
function chatMediaCss(){
  if(document.getElementById("m7c-v10-media-css"))return;
  const s=document.createElement("style");
  s.id="m7c-v10-media-css";
  s.textContent=[
    "#m7-chat-send{display:block!important;padding:8px max(8px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))!important;background:#171310;border-top:1px solid #34261e}",
    ".m7-compose-row{display:flex;align-items:center;gap:7px}",
    ".m7-compose-tool{width:42px;height:42px;flex:0 0 42px;border:1px solid #4a382b!important;border-radius:50%!important;background:#241c17!important;color:#f2c36f!important;padding:0!important;display:grid;place-items:center;font-size:21px;font-weight:900;transition:transform .12s ease,background .12s ease}",
    ".m7-compose-tool:active{transform:scale(.91)}.m7-compose-tool:disabled{opacity:.42;cursor:not-allowed}",
    "#m7-chat-input{height:42px;box-sizing:border-box;padding:10px 12px!important;border-radius:18px!important}",
    ".m7-send-button{width:44px;height:42px;flex:0 0 44px;padding:0!important;border-radius:15px!important;background:linear-gradient(135deg,#efbd66,#c9822e)!important;color:#160f09!important;font-size:19px;font-weight:950;display:grid;place-items:center;box-shadow:0 6px 16px #0004}",
    ".m7-send-button:disabled{opacity:.45}",
    "#m7-compose-preview,#m7-voice-recording{margin:0 0 8px;padding:9px;border:1px solid #4c3829;border-radius:15px;background:linear-gradient(145deg,#201914,#100d0b);box-sizing:border-box}",
    "#m7-compose-preview[hidden],#m7-voice-recording[hidden]{display:none!important}",
    ".m7-compose-preview-inner{display:flex;align-items:center;gap:10px;min-width:0}",
    ".m7-compose-thumb{width:56px;height:56px;flex:0 0 56px;border-radius:12px;overflow:hidden;background:#0b0908;border:1px solid #ffffff18;display:grid;place-items:center}",
    ".m7-compose-thumb img,.m7-compose-thumb video{width:100%;height:100%;display:block;object-fit:cover}",
    ".m7-compose-preview-copy{min-width:0;flex:1}.m7-compose-preview-copy b{display:block;color:#f7d48f;font-size:12px}.m7-compose-preview-copy small{display:block;color:#9f958c;font-size:10px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".m7-compose-remove{width:34px;height:34px;flex:0 0 34px;border:0;border-radius:50%;background:#3d211e;color:#ffc0b8;font-size:19px;display:grid;place-items:center}",
    "#m7-voice-recording{padding:8px 9px!important;border-color:#503529!important;background:linear-gradient(145deg,#221714,#110d0b)!important;box-shadow:inset 0 1px 0 #ffffff0a}",
    ".m7-record-row{display:flex;align-items:center;gap:8px;min-height:40px}.m7-record-dot{width:9px;height:9px;flex:0 0 9px;border-radius:50%;background:#ff4f48;box-shadow:0 0 12px #ff514780;animation:m7RecPulse 1s ease-in-out infinite}.m7-record-time{min-width:38px;font:900 12px/1 Arial;color:#fff;font-variant-numeric:tabular-nums}.m7-record-hint{min-width:0;flex:1;color:#b9ada4;font:800 10px/1.2 Arial;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7-record-wave{width:54px;flex:0 0 54px;height:25px;display:flex;align-items:center;justify-content:center;gap:2px;overflow:hidden}.m7-record-wave i{width:2px;border-radius:5px;background:#d99a45;animation:m7Wave .85s ease-in-out infinite alternate}.m7-record-wave i:nth-child(2n){animation-delay:-.35s}.m7-record-wave i:nth-child(3n){animation-delay:-.6s}",
    ".m7-record-cancel,.m7-record-stop{display:none;min-height:34px;border:0;border-radius:999px;padding:0 11px;font-size:10px;font-weight:950}.m7-record-cancel{background:#312925;color:#e4d7ce}.m7-record-stop{background:#d99a45;color:#170f08}.voice-locked .m7-record-cancel,.voice-locked .m7-record-stop{display:inline-flex;align-items:center;justify-content:center}.voice-locked .m7-record-wave{display:none}.voice-locked .m7-record-hint{color:#efbd66}",
    "#m7-chat-mic{touch-action:none!important;user-select:none;-webkit-user-select:none}#m7-chat-mic.is-recording{background:#84251f!important;color:#fff!important;border-color:#ff6c62!important;box-shadow:0 0 0 3px #ff3d3427,0 0 18px #ff3d3438!important;transform:scale(1.04)}",
    ".m7-voice-draft{display:flex;align-items:center;gap:9px}.m7-voice-draft audio{min-width:0;flex:1;height:36px}.m7-voice-draft strong{font-size:11px;color:#f2c36f;white-space:nowrap}",
    ".m7-msg.m7-msg-media{padding:6px 7px;min-width:0;max-width:min(320px,86vw)}.m7-msg.mine.m7-msg-media{padding-right:30px}.m7-msg.m7-msg-media .m7-msg-time{margin-top:2px;padding-left:2px;font-size:9px}.m7-msg.m7-msg-media .m7-msg-reactions{position:absolute;left:9px;bottom:-13px;margin:0;z-index:6}.m7-msg.m7-msg-media.has-reactions{margin-bottom:13px}.m7-msg.m7-msg-media .m7-reaction-pill{min-height:24px;padding:2px 7px;font-size:12px}",
    ".m7-chat-photo{display:block;width:min(272px,72vw);max-height:330px;border:0;border-radius:12px;overflow:hidden;padding:0;background:#0b0908;cursor:pointer;touch-action:manipulation}.m7-chat-photo img{display:block;width:100%;height:auto;max-height:330px;object-fit:cover}",
    ".m7-chat-video{display:block;width:min(300px,72vw);max-height:360px;border-radius:13px;background:#000}",
    ".m7-media-caption{margin:7px 3px 1px;white-space:pre-wrap;font-size:13px;color:#fff}",
    ".m7-voice-bubble{width:min(268px,74vw);display:grid;grid-template-columns:38px minmax(0,1fr);gap:8px;align-items:center;padding:1px 1px;touch-action:manipulation}.m7-voice-play{width:38px;height:38px;border:0;border-radius:50%;background:#f0b85c;color:#1c1208;display:grid;place-items:center;font-size:16px;padding:0 0 0 2px;flex:0 0 38px}.m7-voice-main{min-width:0;display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:7px;align-items:center}.m7-voice-track{position:relative;min-width:0;height:30px;display:flex;align-items:center}.m7-voice-wave{width:100%;height:23px;display:flex;align-items:center;gap:2px;opacity:.86;pointer-events:none}.m7-voice-wave i{display:block;flex:1 1 0;min-width:2px;max-width:3px;border-radius:3px;background:#7f6b57;transition:background .08s ease,opacity .08s ease}.m7-voice-wave i.played{background:#f3c36d}.m7-voice-range{position:absolute;inset:0;width:100%;height:30px;margin:0;opacity:1;display:block;cursor:pointer;background:transparent;appearance:none;-webkit-appearance:none;touch-action:none}.m7-voice-range::-webkit-slider-runnable-track{height:2px;background:transparent}.m7-voice-range::-webkit-slider-thumb{-webkit-appearance:none;width:11px;height:11px;margin-top:-4.5px;border:0;border-radius:50%;background:#ffd17d;box-shadow:0 0 0 2px #2a2119,0 1px 5px #0008}.m7-voice-range::-moz-range-track{height:2px;background:transparent}.m7-voice-range::-moz-range-progress{height:2px;background:transparent}.m7-voice-range::-moz-range-thumb{width:11px;height:11px;border:0;border-radius:50%;background:#ffd17d;box-shadow:0 0 0 2px #2a2119,0 1px 5px #0008}.m7-voice-time{font-size:9px;color:#f1dbc0;opacity:.82;min-width:58px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}.m7-voice-audio{display:none}",
    "#m7-chat-media-viewer{position:fixed;inset:0;z-index:2147483647;background:#000e;display:grid;place-items:center;padding:max(16px,env(safe-area-inset-top)) 12px max(16px,env(safe-area-inset-bottom));box-sizing:border-box}.m7-media-viewer-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:10px}.m7-media-viewer-close{position:absolute;right:15px;top:max(15px,env(safe-area-inset-top));width:44px;height:44px;border:1px solid #ffffff32;border-radius:50%;background:#111d;color:#fff;font-size:25px}",
    ".m7-media-loading{padding:10px;border-radius:12px;background:#17120f;color:#c7b9ac;font-size:11px;text-align:center}",
    "@keyframes m7RecPulse{50%{transform:scale(1.28);opacity:.55}}@keyframes m7Wave{from{height:6px}to{height:24px}}",
    "@media(max-width:600px){#m7-chat-send{padding-bottom:max(9px,env(safe-area-inset-bottom))!important}.m7-compose-tool{width:40px;height:40px;flex-basis:40px}.m7-send-button{width:42px;height:40px;flex-basis:42px}.m7-chat-photo{width:min(276px,76vw)}.m7-chat-video{width:min(286px,78vw)}.m7-voice-bubble{width:min(268px,76vw)}.m7-record-hint{font-size:9px}.m7-record-wave{width:42px;flex-basis:42px}.voice-locked .m7-record-hint{font-size:10px}}",
    "@media(prefers-reduced-motion:reduce){.m7-record-dot,.m7-record-wave i{animation:none!important}}"
  ].join("");
  document.head.appendChild(s);
}
function av(url,name){return url?`<img class="m7-avatar" src="${esc(url)}" alt="">`:`<div class="m7-avatar fallback">${esc((name||"?").slice(0,1).toUpperCase())}</div>`}
function shell(title,avatar,back){css();chatMediaCss();close(true);let x=document.createElement("div");x.id="m7-chat-shell";x.innerHTML=`<div id="m7-chat"><div id="m7-chat-head"><button class="m7c-icon" id="m7-back" style="display:${back?"block":"none"}">‹</button><div class="m7-head-person">${av(avatar,title)}<div id="m7-chat-title">${esc(title)}</div></div><button class="m7c-icon" id="m7-report" title="Report">⚑</button><button class="m7c-icon" id="m7-block-user" title="Block user" style="display:none">🚫</button><button class="m7c-icon" id="m7-delete-convo" title="Delete conversation" style="display:none">🗑</button><button class="m7c-icon" id="m7-close">✕</button></div><div id="m7-chat-body"><div class="m7-loading">Loading…</div></div></div>`;document.body.appendChild(x);x.querySelector("#m7-close").onclick=()=>close();x.onclick=e=>{if(e.target===x)close()};return x}
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
function closeReactionPicker(){
  if(reactionPicker){reactionPicker.remove();reactionPicker=null}
  if(reactionPickerOutside){document.removeEventListener("pointerdown",reactionPickerOutside,true);reactionPickerOutside=null}
}
function close(remove=true){closeReactionPicker();resetChatComposerDrafts();clearInterval(inboxClockTimer);inboxClockTimer=null;clearTimeout(inboxRefreshTimer);inboxRefreshTimer=null;clearInterval(inboxLiveFallbackTimer);inboxLiveFallbackTimer=null;if(inboxWakeHandler){window.removeEventListener("ma7alak:page-wake",inboxWakeHandler);inboxWakeHandler=null}if(channel&&client)try{client.removeChannel(channel)}catch(_){}channel=null;if(settingsChannel&&client)try{client.removeChannel(settingsChannel)}catch(_){}settingsChannel=null;if(remove)document.getElementById("m7-chat-shell")?.remove()}
const tm=v=>{try{return new Date(v).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch(_){return""}};
function inboxRelativeTime(value){
  const time=new Date(value||0).getTime();
  if(!Number.isFinite(time)||time<=0)return "";
  const diff=Math.max(0,Date.now()-time);
  const sec=Math.floor(diff/1000);
  if(sec<45)return "Now";
  const min=Math.floor(sec/60);
  if(min<60)return min+"m ago";
  const hour=Math.floor(min/60);
  if(hour<24)return hour+"h ago";
  const day=Math.floor(hour/24);
  if(day<7)return day+"d ago";
  try{return new Date(time).toLocaleDateString([],{month:"short",day:"numeric"})}catch(_){return ""}
}
function refreshInboxTimes(scope){
  const root=scope||document;
  root.querySelectorAll?.("[data-msg-time]").forEach(el=>{
    const raw=el.getAttribute("data-msg-time")||"";
    el.textContent=inboxRelativeTime(raw);
    try{el.title=new Date(raw).toLocaleString()}catch(_){}
  });
}
function startInboxClock(scope){
  clearInterval(inboxClockTimer);
  refreshInboxTimes(scope);
  inboxClockTimer=setInterval(()=>{
    const shell=document.getElementById("m7-chat-shell");
    if(!shell){
      clearInterval(inboxClockTimer);
      inboxClockTimer=null;
      return;
    }
    refreshInboxTimes(shell);
  },15000);
}
const sameId=(a,b)=>String(a??"")===String(b??"");
const STORY_MEDIA_BASE="https://wdtaiuwtqdepzdamgsrs.supabase.co/storage/v1/object/public/shop-stories/";
function storyCtx(m){let x=m&&m.context;if(!x)return{};if(typeof x==="string"){try{x=JSON.parse(x)}catch(_){return{}}}return x&&typeof x==="object"?x:{}}
function storyMediaUrl(path){path=String(path||"").trim();while(path.startsWith("/"))path=path.slice(1);return path?STORY_MEDIA_BASE+path.split("/").map(encodeURIComponent).join("/"):""}
function cleanPath(path){path=String(path||"");while(path.length>1&&path.endsWith("/"))path=path.slice(0,-1);return path}
function storyExpired(ctx){const x=ctx&&ctx.story_expires_at;if(!x)return false;const t=new Date(x).getTime();return Number.isFinite(t)&&t<=Date.now()}
function storyCardHtml(m){
  const ctx=storyCtx(m);
  const isStoryReply=
    String(m?.message_type||"")==="story_reply" ||
    ctx.story_reply===true ||
    String(ctx.story_reply||"").toLowerCase()==="true";
  if(!isStoryReply)return"";
  const storyId=String(m?.reply_story_id??ctx.story_id??"").trim(),slug=String(ctx.shop_slug||"").trim(),shopUrl=String(ctx.shop_url||"").trim(),expires=String(ctx.story_expires_at||"").trim(),mediaType=String(ctx.story_media_type||ctx.media_type||"").trim().toLowerCase(),storagePath=String(ctx.story_storage_path||ctx.storage_path||"").trim(),status=String(ctx.story_status_text||ctx.status_text||"").trim(),shopName=String(ctx.shop_name||slug||"Story").trim(),expired=storyExpired(ctx),mediaUrl=storyMediaUrl(storagePath),imageUrl=mediaType==="image"?mediaUrl:"";
  const visual=mediaType==="video"&&mediaUrl
    ? '<video muted playsinline preload="none" data-story-video-preview data-story-video-src="'+esc(mediaUrl)+'"></video><span class="m7-story-card-play" aria-hidden="true">▶</span>'
    : (imageUrl?'<span class="m7-story-card-fallback" aria-hidden="true">▧</span><img loading="lazy" decoding="async" data-story-thumb src="'+esc(imageUrl)+'" alt="">':'<span class="m7-story-card-fallback" aria-hidden="true">▧</span>');
  return '<button type="button" class="m7-story-reply-card '+(expired?"is-expired":"")+'" data-story-open="'+esc(storyId)+'" data-story-shop="'+esc(slug)+'" data-story-url="'+esc(shopUrl)+'" data-story-expires="'+esc(expires)+'" '+(expired?'aria-disabled="true"':'')+'><span class="m7-story-card-top"><span class="m7-story-card-media">'+visual+'</span><span class="m7-story-card-copy"><span class="m7-story-card-label">Replied to story</span><span class="m7-story-card-name">'+esc(shopName)+'</span>'+(status?'<span class="m7-story-card-status">'+esc(status)+'</span>':"")+(expired?'<span class="m7-story-card-badge">Story expired</span>':"")+'</span></span></button>';
}
function sharedStoryViewerUrl(){
  try{
    return new URL(
      "shoufhon-story-viewer.js",
      CHAT_SCRIPT_SRC||location.href
    ).href;
  }
  catch(_){
    return "shoufhon-story-viewer.js";
  }
}

function ensureSharedStoryViewer(){

  if(
    window.ShoufHonStoryViewer &&
    typeof window.ShoufHonStoryViewer.open==="function"
  ){
    return Promise.resolve(
      window.ShoufHonStoryViewer
    );
  }

  if(sharedStoryViewerPromise){
    return sharedStoryViewerPromise;
  }

  sharedStoryViewerPromise=
    new Promise(function(resolve){

      const existing=
        Array.from(
          document.scripts
        ).find(function(script){
          return /shoufhon-story-viewer\.js(?:$|[?#])/.test(
            script.src||""
          );
        });

      if(existing){

        let tries=0;

        const wait=function(){

          if(
            window.ShoufHonStoryViewer &&
            typeof window.ShoufHonStoryViewer.open==="function"
          ){
            resolve(
              window.ShoufHonStoryViewer
            );
            return;
          }

          tries++;

          if(tries<100){
            setTimeout(
              wait,
              40
            );
          }
          else{
            resolve(
              null
            );
          }

        };

        wait();

        return;
      }

      const script=
        document.createElement(
          "script"
        );

      script.src=
        sharedStoryViewerUrl();

      script.onload=function(){
        resolve(
          window.ShoufHonStoryViewer||
          null
        );
      };

      script.onerror=function(){
        resolve(
          null
        );
      };

      document.head.appendChild(
        script
      );

    });

  return sharedStoryViewerPromise;

}

async function openStoryFromMessage(button){

  if(
    !button ||
    button.classList.contains(
      "is-expired"
    )
  ){
    alert(
      "This Story has expired."
    );
    return;
  }

  const storyId=
    String(
      button.dataset.storyOpen||
      ""
    ).trim();

  const slug=
    String(
      button.dataset.storyShop||
      ""
    ).trim();

  if(
    !storyId ||
    !slug
  ){
    alert(
      "This Story is no longer available."
    );
    return;
  }

  try{

    const viewer=
      await ensureSharedStoryViewer();

    if(
      !viewer ||
      typeof viewer.open!=="function"
    ){
      throw new Error(
        "Story viewer unavailable."
      );
    }

    const opened=
      await viewer.open({
        shopSlug:slug,
        storyId:storyId,
        preferUnseen:false
      });

    if(
      !opened &&
      !viewer.isOpen?.()
    ){
      throw new Error(
        "This Story is no longer available."
      );
    }

  }
  catch(error){

    console.warn(
      "Open Story reply:",
      error
    );

    alert(
      error?.message||
      "Could not open this Story."
    );

  }

}

function wireStoryCards(b){
  b.querySelectorAll("[data-story-open]").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();openStoryFromMessage(btn)});
  b.querySelectorAll("[data-story-thumb]").forEach(img=>img.addEventListener("error",()=>{img.style.display="none"},{once:true}));

  const videos=[...b.querySelectorAll("[data-story-video-preview]")];
  const prime=video=>{
    if(!video||video.dataset.previewPrimed==="1")return;
    const src=String(video.dataset.storyVideoSrc||"").trim();
    if(!src)return;
    video.dataset.previewPrimed="1";
    video.preload="metadata";
    video.src=src;

    const seekFirstFrame=()=>{
      try{
        const duration=Number(video.duration||0);
        const target=duration>0?Math.min(.18,Math.max(.03,duration*.015)):.06;
        if(Math.abs(Number(video.currentTime||0)-target)>.01)video.currentTime=target;
      }catch(_){}
    };
    video.addEventListener("loadedmetadata",seekFirstFrame,{once:true});
    video.addEventListener("loadeddata",()=>{try{video.pause()}catch(_){}},{once:true});
    video.addEventListener("error",()=>{video.style.display="none"},{once:true});
    try{video.load()}catch(_){}
  };

  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          prime(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },{root:b,rootMargin:"120px 0px"});
    videos.forEach(video=>observer.observe(video));
  }else{
    videos.slice(0,4).forEach(prime);
  }
}
const REACTION_EMOJIS=["❤️","😂","👍","😮","😢","🙏"];

function reactionGroups(rows){
  const out=new Map();
  for(const row of rows||[]){
    const id=String(row.message_id||"");
    if(!id)continue;
    let g=out.get(id);
    if(!g){g={counts:new Map(),mine:""};out.set(id,g)}
    const emoji=String(row.emoji||"");
    if(!REACTION_EMOJIS.includes(emoji))continue;
    g.counts.set(emoji,(g.counts.get(emoji)||0)+1);
    if(sameId(row.reactor_id,user?.id))g.mine=emoji;
  }
  return out;
}

function applyReactionGroups(b,c,groups){
  b.querySelectorAll("[data-reactions-for]").forEach(slot=>{
    const id=String(slot.dataset.reactionsFor||"");
    const g=groups.get(id);
    if(!g){
      slot.innerHTML="";
      slot.closest(".m7-msg")?.classList.remove("has-reactions");
      return;
    }
    slot.innerHTML=REACTION_EMOJIS.filter(e=>g.counts.get(e)).map(emoji=>{
      const count=g.counts.get(emoji)||0;
      return '<button type="button" class="m7-reaction-pill '+(g.mine===emoji?"mine":"")+'" data-reaction-message="'+esc(id)+'" data-reaction-emoji="'+esc(emoji)+'" aria-label="'+esc(emoji)+" reaction"+'">'+emoji+(count>1?'<span class="m7-reaction-count">'+count+'</span>':"")+'</button>';
    }).join("");
    slot.closest(".m7-msg")?.classList.toggle("has-reactions",!!slot.children.length);
  });
  b.querySelectorAll(".m7-reaction-pill").forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      toggleMessageReaction(btn.dataset.reactionMessage,btn.dataset.reactionEmoji,c);
    };
  });
}

async function refreshReactionsOnly(c){
  const b=document.getElementById("m7-chat-body");
  if(!b||!c?.id)return;
  try{
    const r=await client.from("ma7alak_message_reactions").select("message_id,reactor_id,emoji").eq("conversation_id",c.id);
    if(r.error)throw r.error;
    if(!b.isConnected)return;
    applyReactionGroups(b,c,reactionGroups(r.data||[]));
  }catch(e){
    console.warn("Message reactions:",e);
  }
}

async function toggleMessageReaction(messageId,emoji,c){
  messageId=String(messageId||"").trim();
  emoji=String(emoji||"").trim();
  if(!messageId||!REACTION_EMOJIS.includes(emoji))return;
  closeReactionPicker();
  try{
    const r=await client.rpc("ma7alak_toggle_message_reaction",{p_message_id:messageId,p_emoji:emoji});
    if(r.error)throw r.error;
    const data=r.data||{};
    if(data.blocked){
      alert("Too many reaction changes. Try again in "+String(data.retry_after_seconds||120)+" seconds.");
      return;
    }
    await refreshReactionsOnly(c);
  }catch(e){
    console.error("Message reaction:",e);
    alert(e?.message||"Could not update reaction.");
  }
}

function openReactionPicker(messageEl,c){
  if(!messageEl||!c?.id)return;
  const messageId=String(messageEl.dataset.messageId||"").trim();
  if(!messageId)return;
  closeReactionPicker();

  const current=messageEl.querySelector(".m7-reaction-pill.mine")?.dataset.reactionEmoji||"";
  const picker=document.createElement("div");
  picker.className="m7-reaction-picker";
  picker.setAttribute("role","menu");
  picker.innerHTML=REACTION_EMOJIS.map(emoji=>
    '<button type="button" class="m7-reaction-choice '+(emoji===current?"selected":"")+'" data-choice="'+esc(emoji)+'" aria-label="React '+esc(emoji)+'">'+emoji+'</button>'
  ).join("");
  document.body.appendChild(picker);
  reactionPicker=picker;

  const rect=messageEl.getBoundingClientRect();
  const pr=picker.getBoundingClientRect();
  const margin=8;
  let left=rect.left+(rect.width-pr.width)/2;
  left=Math.max(margin,Math.min(left,window.innerWidth-pr.width-margin));
  let top=rect.top-pr.height-8;
  if(top<margin)top=Math.min(window.innerHeight-pr.height-margin,rect.bottom+8);
  picker.style.left=Math.round(left)+"px";
  picker.style.top=Math.round(top)+"px";

  picker.querySelectorAll("[data-choice]").forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      toggleMessageReaction(messageId,btn.dataset.choice,c);
    };
  });

  try{navigator.vibrate?.(14)}catch(_){}

  reactionPickerOutside=e=>{
    if(reactionPicker&&!reactionPicker.contains(e.target))closeReactionPicker();
  };
  setTimeout(()=>{
    if(reactionPickerOutside)document.addEventListener("pointerdown",reactionPickerOutside,true);
  },0);
}

function wireMessageReactionGestures(b,c){
  b.querySelectorAll(".m7-msg[data-message-id]").forEach(el=>{
    let timer=null,startX=0,startY=0,reactionFired=false;
    const clear=()=>{if(timer){clearTimeout(timer);timer=null}};
    const isMediaTarget=target=>!!(el.classList.contains("m7-msg-media")&&target?.closest?.(".m7-chat-photo,.m7-voice-bubble"));
    const suppressMediaClick=e=>{
      if(!reactionFired||!isMediaTarget(e.target))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      reactionFired=false;
    };
    el.addEventListener("click",suppressMediaClick,true);
    el.addEventListener("pointerdown",e=>{
      const mediaTarget=isMediaTarget(e.target);
      if(!mediaTarget&&e.target.closest("button,input,a"))return;
      if(e.pointerType==="mouse"&&e.button!==0)return;
      reactionFired=false;
      startX=e.clientX;startY=e.clientY;
      clear();
      timer=setTimeout(()=>{
        timer=null;
        reactionFired=true;
        openReactionPicker(el,c);
        try{navigator.vibrate?.(14)}catch(_){}
        setTimeout(()=>{reactionFired=false},850);
      },e.pointerType==="mouse"?650:430);
    },{passive:true});
    el.addEventListener("pointermove",e=>{
      if(!timer)return;
      if(Math.abs(e.clientX-startX)>10||Math.abs(e.clientY-startY)>10)clear();
    },{passive:true});
    ["pointerup","pointercancel","pointerleave"].forEach(name=>el.addEventListener(name,clear,{passive:true}));
    el.addEventListener("contextmenu",e=>{
      const mediaTarget=isMediaTarget(e.target);
      if(!mediaTarget&&e.target.closest("button,input,a"))return;
      e.preventDefault();
      clear();
      reactionFired=true;
      openReactionPicker(el,c);
      setTimeout(()=>{reactionFired=false},850);
    });
  });
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
      if(msg.includes("CHAT_BLOCKED"))return{ok:false,error:"This shop has blocked this chat."};
      return{ok:false,error:msg||"Could not send Story reply."};
    }
    dispatchEvent(new Event("ma7alak:messages-read"));
    return{ok:true,message:Array.isArray(r.data)?r.data[0]:r.data};
  }catch(e){console.error("Story reply send:",e);return{ok:false,error:e?.message||"Could not send Story reply."}}
}
function loadError(b,e){if(!b)return;console.error("ShoufHon chat load error:",e);b.innerHTML=`<div class="m7-error">Could not load this conversation.<br><small>${esc(e?.message||"Please close Messages and try again.")}</small></div>`}

async function sendStoryMediaReply(payload){
  payload=payload&&typeof payload==="object"?payload:{};

  try{
    await vr();

    if(!user){
      window.Ma7alakAccount?.open?.();
      return{ok:false,login_required:true,error:"Sign in with Google to reply."};
    }

    const storyId=String(payload.story_id||payload.storyId||"").trim();
    const requestedSlug=String(payload.shop_slug||payload.shopSlug||"").trim().toLowerCase();
    const type=String(payload.message_type||payload.type||"").trim().toLowerCase();
    const originalBlob=payload.blob||payload.file||null;
    const originalName=String(payload.original_name||payload.name||originalBlob?.name||type||"media").slice(0,180);

    if(!storyId)return{ok:false,error:"Story is unavailable."};
    if(!["voice","image","video"].includes(type))return{ok:false,error:"Unsupported Story reply media."};
    if(!originalBlob||typeof originalBlob.size!=="number"||originalBlob.size<=0)return{ok:false,error:"Media is empty."};

    let blob=originalBlob;
    if(type==="image"){
      blob=await compressChatImage(originalBlob);
    }

    const mime=mediaBaseMime(payload.mime_type||payload.mime||blob?.type||originalBlob?.type||"");

    if(type==="image"&&blob.size>8388608)return{ok:false,error:"Photo must be 8 MB or smaller."};
    if(type==="video"&&blob.size>26214400)return{ok:false,error:"Video must be 25 MB or smaller."};
    if(type==="voice"&&blob.size>10485760)return{ok:false,error:"Voice message must be 10 MB or smaller."};

    const storyResult=
      await client
        .from("shop_stories")
        .select("id,shop_slug,media_type,storage_path,status_text,expires_at,created_at")
        .eq("id",storyId)
        .maybeSingle();

    if(storyResult.error)throw storyResult.error;

    const story=storyResult.data||null;

    if(!story)return{ok:false,error:"This Story has expired or was deleted."};

    const expiresAt=new Date(story.expires_at||0).getTime();
    if(Number.isFinite(expiresAt)&&expiresAt<=Date.now()){
      return{ok:false,error:"This Story has expired or was deleted."};
    }

    const slug=String(story.shop_slug||requestedSlug||"").trim().toLowerCase();
    if(!slug)return{ok:false,error:"Story shop is unavailable."};
    if(requestedSlug&&slug!==requestedSlug)return{ok:false,error:"Story shop mismatch."};

    const ownSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim().toLowerCase();
    if(ownSlug&&slug===ownSlug)return{ok:false,error:"You cannot reply to your own Story."};
    if(!(await accepts(slug)))return{ok:false,error:"This shop is not accepting messages right now."};

    const conversationResult=
      await client.rpc(
        "ma7alak_start_conversation",
        {p_shop_slug:slug}
      );

    if(conversationResult.error)throw conversationResult.error;

    const conversation=
      Array.isArray(conversationResult.data)
        ? conversationResult.data[0]
        : conversationResult.data;

    if(!conversation?.id)return{ok:false,error:"Could not open this conversation."};

    let shopName=slug;
    try{
      const shop=
        await client
          .from("shop_profiles")
          .select("shop_name")
          .eq("shop_slug",slug)
          .maybeSingle();
      if(!shop.error&&shop.data?.shop_name)shopName=String(shop.data.shop_name);
    }catch(_){}

    const path=chatMediaPath(conversation,mime,originalName);
    const upload=
      await client
        .storage
        .from(CHAT_MEDIA_BUCKET)
        .upload(
          path,
          blob,
          {
            contentType:mime,
            upsert:false,
            cacheControl:"3600"
          }
        );

    if(upload.error)throw upload.error;

    const context={
      story_reply:true,
      story_id:String(story.id),
      shop_slug:slug,
      story_expires_at:String(story.expires_at||""),
      story_media_type:String(story.media_type||""),
      story_storage_path:String(story.storage_path||""),
      story_status_text:String(story.status_text||""),
      story_created_at:String(story.created_at||""),
      shop_name:shopName,
      shop_url:"https://www.shoufhon.com/"+encodeURIComponent(slug),
      duration:type==="voice"?Math.max(0,Number(payload.duration)||0):undefined,
      original_name:originalName
    };

    Object.keys(context).forEach(key=>context[key]===undefined&&delete context[key]);

    const sent=
      await client.rpc(
        "ma7alak_send_media_message",
        {
          p_conversation_id:conversation.id,
          p_message_type:type,
          p_storage_path:path,
          p_body:null,
          p_context:context
        }
      );

    if(sent.error){
      try{
        await client.storage.from(CHAT_MEDIA_BUCKET).remove([path]);
      }catch(_){}
      throw sent.error;
    }

    dispatchEvent(new Event("ma7alak:messages-read"));

    return{
      ok:true,
      message:Array.isArray(sent.data)?sent.data[0]:sent.data
    };
  }
  catch(e){
    console.error("Story media reply send:",e);
    const msg=String(e?.message||"");
    if(msg.includes("CHAT_BLOCKED"))return{ok:false,error:"This shop has blocked this chat."};
    if(msg.includes("SHOP_NOT_ACCEPTING_MESSAGES"))return{ok:false,error:"This shop is not accepting messages right now."};
    return{ok:false,error:msg||"Could not send Story reply."};
  }
}
const CHAT_MEDIA_DEFAULT_BODY={voice:"Voice message",image:"Photo",video:"Video"};
function chatMediaCtx(m){let x=m&&m.context;if(!x)return{};if(typeof x==="string"){try{x=JSON.parse(x)}catch(_){return{}}}return x&&typeof x==="object"?x:{}}
function chatMediaType(m){const t=String(m?.message_type||"").toLowerCase();return t==="voice"||t==="image"||t==="video"?t:""}
function formatDuration(seconds){seconds=Math.max(0,Math.round(Number(seconds)||0));const m=Math.floor(seconds/60),s=seconds%60;return m+":"+String(s).padStart(2,"0")}
function formatBytes(bytes){bytes=Math.max(0,Number(bytes)||0);if(bytes<1024)return bytes+" B";if(bytes<1048576)return (bytes/1024).toFixed(bytes<10240?1:0)+" KB";return (bytes/1048576).toFixed(bytes<10485760?1:0)+" MB"}
function mediaBaseMime(value){return String(value||"").split(";")[0].trim().toLowerCase()}
function mediaExt(mime,name){mime=mediaBaseMime(mime);const map={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","video/mp4":"mp4","video/webm":"webm","video/quicktime":"mov","audio/webm":"webm","audio/ogg":"ogg","audio/mp4":"m4a","audio/mpeg":"mp3","audio/wav":"wav","audio/aac":"aac","audio/x-m4a":"m4a"};if(map[mime])return map[mime];const m=String(name||"").match(/\.([a-z0-9]{1,6})$/i);return m?m[1].toLowerCase():"bin"}
function mediaRandomId(){try{return crypto.randomUUID()}catch(_){return Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)}}
function chatMediaPath(c,mime,name){return String(c.id)+"/"+String(user.id)+"/"+Date.now()+"-"+mediaRandomId()+"."+mediaExt(mime,name)}
async function signedChatMediaUrl(path){path=String(path||"").trim();if(!path)return"";const cached=chatMediaSignedCache.get(path);if(cached&&cached.expires>Date.now()+60000)return cached.url;const r=await client.storage.from(CHAT_MEDIA_BUCKET).createSignedUrl(path,3600);if(r.error)throw r.error;const url=String(r.data?.signedUrl||"");if(url)chatMediaSignedCache.set(path,{url,expires:Date.now()+3500000});return url}
async function signedChatMediaMap(rows){const entries=(rows||[]).filter(m=>chatMediaType(m)).map(m=>[String(m.id),String(chatMediaCtx(m).storage_path||"")]).filter(x=>x[1]);const out=new Map();await Promise.all(entries.map(async pair=>{try{out.set(pair[0],await signedChatMediaUrl(pair[1]))}catch(e){console.warn("Chat media URL:",e);out.set(pair[0],"")}}));return out}
function chatMediaCaption(m,type){const body=String(m?.body||"").trim();return body&&body!==CHAT_MEDIA_DEFAULT_BODY[type]?body:""}
function voiceWaveHtml(){const h=[8,14,20,11,24,16,9,19,13,23,10,17,22,12,18,8,21,15,10,19,24,12,17,9];return h.map((v,i)=>"<i data-voice-bar=\""+i+"\" style=\"height:"+v+"px\"></i>").join("")}
function chatMediaHtml(m,url){
  const type=chatMediaType(m);if(!type)return"";
  const ctx=chatMediaCtx(m),caption=chatMediaCaption(m,type);
  if(!url)return "<div class=\"m7-media-loading\">Media unavailable</div>"+(caption?"<div class=\"m7-media-caption\">"+esc(caption)+"</div>":"");
  if(type==="image")return "<button class=\"m7-chat-photo\" type=\"button\" data-chat-photo=\""+esc(url)+"\" aria-label=\"Open photo\"><img src=\""+esc(url)+"\" alt=\"\" loading=\"lazy\" decoding=\"async\"></button>"+(caption?"<div class=\"m7-media-caption\">"+esc(caption)+"</div>":"");
  if(type==="video")return "<video class=\"m7-chat-video\" controls playsinline preload=\"metadata\" src=\""+esc(url)+"\"></video>"+(caption?"<div class=\"m7-media-caption\">"+esc(caption)+"</div>":"");
  const duration=Math.max(0,Number(ctx.duration)||0);
  return "<div class=\"m7-voice-bubble\" data-voice-bubble><button type=\"button\" class=\"m7-voice-play\" aria-label=\"Play voice message\">▶</button><div class=\"m7-voice-main\"><div class=\"m7-voice-track\"><div class=\"m7-voice-wave\" aria-hidden=\"true\">"+voiceWaveHtml()+"</div><input class=\"m7-voice-range\" type=\"range\" min=\"0\" max=\"100\" value=\"0\" step=\"0.1\" aria-label=\"Voice message position\"></div><span class=\"m7-voice-time\" data-duration=\""+duration+"\">0:00 / "+formatDuration(duration)+"</span></div><audio class=\"m7-voice-audio\" preload=\"metadata\" src=\""+esc(url)+"\"></audio></div>";
}
function openChatPhoto(url){document.getElementById("m7-chat-media-viewer")?.remove();const v=document.createElement("div");v.id="m7-chat-media-viewer";v.innerHTML="<button type=\"button\" class=\"m7-media-viewer-close\" aria-label=\"Close\">×</button><img class=\"m7-media-viewer-img\" src=\""+esc(url)+"\" alt=\"\">";document.body.appendChild(v);const done=()=>v.remove();v.querySelector(".m7-media-viewer-close").onclick=done;v.onclick=e=>{if(e.target===v)done()}}
function wireChatMediaMessages(root){
  root.querySelectorAll("[data-chat-photo]").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();openChatPhoto(btn.dataset.chatPhoto)});
  root.querySelectorAll("[data-voice-bubble]").forEach(w=>{
    const audio=w.querySelector(".m7-voice-audio"),play=w.querySelector(".m7-voice-play"),range=w.querySelector(".m7-voice-range"),time=w.querySelector(".m7-voice-time"),bars=[...w.querySelectorAll("[data-voice-bar]")];
    if(!audio||!play||!range||!time)return;
    const defaultDuration=Math.max(0,Number(time.dataset.duration)||0);
    let seeking=false;
    const getDuration=()=>Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:defaultDuration;
    const sync=()=>{
      const dur=getDuration(),cur=Math.max(0,Math.min(dur||Infinity,Number(audio.currentTime)||0)),pct=dur?Math.max(0,Math.min(100,cur/dur*100)):0;
      if(!seeking)range.value=String(pct);
      const displayPct=seeking?Math.max(0,Math.min(100,Number(range.value)||0)):pct;
      const shownCur=seeking&&dur?dur*displayPct/100:cur;
      time.textContent=formatDuration(shownCur)+" / "+formatDuration(dur);
      const played=Math.round((displayPct/100)*bars.length);
      bars.forEach((bar,index)=>bar.classList.toggle("played",index<played));
    };
    audio.addEventListener("loadedmetadata",sync);
    audio.addEventListener("durationchange",sync);
    audio.addEventListener("timeupdate",sync);
    audio.addEventListener("ended",()=>{audio.currentTime=0;play.textContent="▶";sync()});
    audio.addEventListener("pause",()=>{if(!audio.ended)play.textContent="▶";sync()});
    audio.addEventListener("play",()=>{play.textContent="❚❚";sync()});
    play.onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      if(audio.paused){
        root.querySelectorAll(".m7-voice-audio").forEach(other=>{if(other!==audio&&!other.paused)other.pause()});
        try{await audio.play()}catch(err){console.warn("Voice playback:",err)}
      }else{
        audio.pause();
      }
    };
    const seek=()=>{
      const dur=getDuration();
      if(dur){
        audio.currentTime=dur*(Math.max(0,Math.min(100,Number(range.value)||0))/100);
      }
      sync();
    };
    range.addEventListener("pointerdown",()=>{seeking=true});
    range.addEventListener("input",()=>{seeking=true;seek()});
    range.addEventListener("change",()=>{seek();seeking=false;sync()});
    range.addEventListener("pointerup",()=>{seek();seeking=false;sync()});
    range.addEventListener("pointercancel",()=>{seeking=false;sync()});
    sync();
  });
}
function revokeObjectUrl(value){try{if(value)URL.revokeObjectURL(value)}catch(_){}}
function stopMicTracks(){if(activeMicStream){try{activeMicStream.getTracks().forEach(t=>t.stop())}catch(_){}activeMicStream=null}}
function clearVoiceTimer(){clearInterval(voiceTimer);voiceTimer=null}
function resetChatComposerDrafts(){recordingDiscard=true;clearVoiceTimer();if(activeRecorder&&activeRecorder.state!=="inactive"){try{activeRecorder.ondataavailable=null;activeRecorder.onstop=null;activeRecorder.stop()}catch(_){}}activeRecorder=null;stopMicTracks();voiceChunks=[];voiceStartedAt=0;voiceGesture=null;voiceLocked=false;voiceStartPromise=null;activeVoiceConversation=null;if(voiceDraft?.url)revokeObjectUrl(voiceDraft.url);voiceDraft=null;if(pendingMediaUrl)revokeObjectUrl(pendingMediaUrl);pendingMediaUrl="";pendingMedia=null;composerBusy=false}
function setComposerBusy(busy,label){composerBusy=!!busy;const form=document.getElementById("m7-chat-send");if(!form)return;form.classList.toggle("busy",composerBusy);form.querySelectorAll("button,input").forEach(el=>{if(el.id!=="m7-chat-input"||composerBusy)el.disabled=composerBusy});const send=form.querySelector(".m7-send-button");if(send){send.dataset.normal=send.dataset.normal||send.textContent;send.textContent=composerBusy?(label||"…"):(send.dataset.normal||"➤")}}
function renderComposerState(){
  const form=document.getElementById("m7-chat-send");if(!form)return;
  const preview=document.getElementById("m7-compose-preview"),record=document.getElementById("m7-voice-recording"),input=document.getElementById("m7-chat-input"),mediaBtn=document.getElementById("m7-chat-media"),micBtn=document.getElementById("m7-chat-mic"),send=form.querySelector(".m7-send-button"),hint=document.getElementById("m7-record-hint");
  const recording=!!(activeRecorder&&activeRecorder.state==="recording");
  const voiceActive=recording||!!voiceStartPromise;
  form.classList.toggle("is-recording",voiceActive);
  form.classList.toggle("voice-locked",voiceActive&&voiceLocked);
  form.classList.toggle("has-media",!!pendingMedia);
  form.classList.remove("has-voice-draft");
  if(record)record.hidden=!voiceActive;
  if(hint){
    hint.textContent=voiceLocked
      ?"Locked · tap Send when finished"
      :"← Slide left to cancel · ↑ Lock";
  }
  if(preview){
    preview.hidden=!pendingMedia;
    if(pendingMedia){
      const isImage=pendingMedia.type==="image";
      const visual=isImage?"<img src=\""+esc(pendingMediaUrl)+"\" alt=\"\">":"<video src=\""+esc(pendingMediaUrl)+"\" muted playsinline preload=\"metadata\"></video>";
      preview.innerHTML="<div class=\"m7-compose-preview-inner\"><div class=\"m7-compose-thumb\">"+visual+"</div><div class=\"m7-compose-preview-copy\"><b>"+(isImage?"Photo":"Video")+"</b><small>"+esc(pendingMedia.name||"Media")+" · "+formatBytes(pendingMedia.blob.size)+"</small></div><button class=\"m7-compose-remove\" type=\"button\" data-remove-draft aria-label=\"Remove\">×</button></div>";
    }
  }
  if(input){input.disabled=voiceActive||composerBusy;input.placeholder=pendingMedia?"Add a caption…":"Type a message..."}
  if(mediaBtn)mediaBtn.disabled=voiceActive||composerBusy;
  if(micBtn){
    micBtn.disabled=!!pendingMedia||composerBusy;
    micBtn.classList.toggle("is-recording",voiceActive);
    micBtn.textContent="🎤";
    micBtn.title=voiceActive?(voiceLocked?"Recording locked":"Recording · slide left to cancel"):"Voice message";
  }
  if(send)send.disabled=voiceActive||composerBusy;
  form.querySelector("[data-remove-draft]")?.addEventListener("click",()=>{if(pendingMediaUrl)revokeObjectUrl(pendingMediaUrl);pendingMediaUrl="";pendingMedia=null;renderComposerState()},{once:true});
}
async function compressChatImage(file){if(!file||!String(file.type||"").startsWith("image/"))return file;if(file.size<=2097152||file.type==="image/gif")return file;let url="";try{url=URL.createObjectURL(file);const img=new Image();img.decoding="async";await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});const max=1600,scale=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1)),w=Math.max(1,Math.round((img.naturalWidth||1)*scale)),h=Math.max(1,Math.round((img.naturalHeight||1)*scale)),canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d",{alpha:false});ctx.drawImage(img,0,0,w,h);const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/webp",.82));if(blob&&blob.size>0&&blob.size<file.size)return blob}catch(e){console.warn("Image compression:",e)}finally{revokeObjectUrl(url)}return file}
function voiceMimeChoice(){if(!window.MediaRecorder)return"";const list=["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus"];for(const x of list){try{if(MediaRecorder.isTypeSupported(x))return x}catch(_){}}return""}
async function startVoiceRecording(c){
  if(composerBusy||activeRecorder?.state==="recording"||voiceStartPromise)return voiceStartPromise;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){
    alert("Voice messages are not supported by this browser.");
    return;
  }
  if(pendingMedia){
    alert("Remove the selected media first.");
    return;
  }

  activeVoiceConversation=c||activeVoiceConversation;
  recordingDiscard=false;
  voiceChunks=[];

  voiceStartPromise=(async()=>{
    try{
      renderComposerState();

      activeMicStream=
        await navigator.mediaDevices.getUserMedia({
          audio:{
            echoCancellation:true,
            noiseSuppression:true,
            autoGainControl:true
          }
        });

      if(voiceGesture?.cancelled){
        stopMicTracks();
        return;
      }

      const choice=voiceMimeChoice();
      const opts=choice
        ? {mimeType:choice,audioBitsPerSecond:64000}
        : {audioBitsPerSecond:64000};

      activeRecorder=
        new MediaRecorder(
          activeMicStream,
          opts
        );

      voiceStartedAt=Date.now();

      activeRecorder.ondataavailable=e=>{
        if(e.data&&e.data.size){
          voiceChunks.push(e.data);
        }
      };

      activeRecorder.onstop=async()=>{
        const rec=activeRecorder;
        const conversation=activeVoiceConversation;
        const duration=Math.max(0,(Date.now()-voiceStartedAt)/1000);
        const discard=recordingDiscard;

        activeRecorder=null;
        clearVoiceTimer();
        stopMicTracks();
        voiceStartedAt=0;

        const mime=
          mediaBaseMime(
            rec?.mimeType||
            choice||
            voiceChunks[0]?.type||
            "audio/webm"
          )||
          "audio/webm";

        const blob=
          new Blob(
            voiceChunks,
            {type:mime}
          );

        voiceChunks=[];
        recordingDiscard=false;

        const finish=()=>{
          voiceGesture=null;
          voiceLocked=false;
          activeVoiceConversation=null;
          renderComposerState();
        };

        if(discard){
          finish();
          return;
        }

        if(blob.size<700||duration<.35){
          finish();
          alert("Voice message was too short. Try again.");
          return;
        }

        if(blob.size>10485760){
          finish();
          alert("Voice message is too large.");
          return;
        }

        if(!conversation?.id){
          finish();
          alert("Conversation is not ready. Try again.");
          return;
        }

        try{
          await uploadChatMedia(
            conversation,
            "voice",
            blob,
            mime,
            "voice."+mediaExt(mime),
            {duration:Number(duration.toFixed(2))},
            ""
          );
        }finally{
          finish();
        }
      };

      activeRecorder.start(250);
      renderComposerState();

      const timerEl=
        document.getElementById(
          "m7-record-time"
        );

      clearVoiceTimer();

      voiceTimer=
        setInterval(()=>{
          const seconds=
            Math.max(
              0,
              (
                Date.now()-
                voiceStartedAt
              )/
              1000
            );

          if(timerEl){
            timerEl.textContent=
              formatDuration(seconds);
          }

          if(seconds>=120){
            voiceLocked=true;
            stopVoiceRecording(false);
          }
        },250);

      /*
        Permission prompts can finish after the finger is already released.
        Honor the gesture decision once recording actually starts.
      */
      if(voiceGesture?.pendingAction==="cancel"){
        stopVoiceRecording(true);
      }
      else if(voiceGesture?.pendingAction==="send"){
        stopVoiceRecording(false);
      }
    }
    catch(e){
      stopMicTracks();
      activeRecorder=null;
      clearVoiceTimer();
      voiceChunks=[];
      voiceStartedAt=0;
      voiceGesture=null;
      voiceLocked=false;
      activeVoiceConversation=null;
      console.warn("Microphone:",e);
      alert("Microphone permission is required to send voice messages.");
      renderComposerState();
    }
    finally{
      voiceStartPromise=null;
      renderComposerState();
    }
  })();

  return voiceStartPromise;
}

function stopVoiceRecording(discard){
  recordingDiscard=!!discard;

  if(!activeRecorder||activeRecorder.state==="inactive"){
    if(voiceGesture){
      voiceGesture.pendingAction=discard?"cancel":"send";
    }
    return;
  }

  try{
    activeRecorder.stop();
  }
  catch(_){
    stopMicTracks();
    activeRecorder=null;
    clearVoiceTimer();
    voiceChunks=[];
    voiceStartedAt=0;
    voiceGesture=null;
    voiceLocked=false;
    activeVoiceConversation=null;
    renderComposerState();
  }
}

function voiceGestureCancel(){
  if(voiceGesture){
    voiceGesture.cancelled=true;
    voiceGesture.pendingAction="cancel";
  }

  voiceLocked=false;
  try{navigator.vibrate?.(18)}catch(_){}
  stopVoiceRecording(true);
  renderComposerState();
}

function voiceGestureLock(){
  if(!voiceGesture||voiceGesture.cancelled)return;
  voiceGesture.locked=true;
  voiceLocked=true;
  try{navigator.vibrate?.(12)}catch(_){}
  renderComposerState();
}

function wireWhatsAppMic(mic,c){
  if(!mic||mic.dataset.m7VoiceGesture==="1")return;
  mic.dataset.m7VoiceGesture="1";

  const MOVE_CANCEL=72;
  const MOVE_LOCK=72;
  const TAP_LOCK_MS=320;

  mic.addEventListener(
    "pointerdown",
    event=>{
      if(
        composerBusy||
        pendingMedia||
        blockedComposer()
      ){
        return;
      }

      if(activeRecorder?.state==="recording"){
        if(voiceLocked){
          return;
        }
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      voiceGesture={
        pointerId:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        startedAt:Date.now(),
        locked:false,
        cancelled:false,
        pendingAction:""
      };

      voiceLocked=false;
      activeVoiceConversation=c;

      try{
        mic.setPointerCapture(
          event.pointerId
        );
      }catch(_){}

      startVoiceRecording(c);
      renderComposerState();
    },
    {passive:false}
  );

  mic.addEventListener(
    "pointermove",
    event=>{
      const gesture=voiceGesture;

      if(
        !gesture||
        gesture.pointerId!==event.pointerId||
        gesture.cancelled||
        gesture.locked
      ){
        return;
      }

      const dx=
        event.clientX-
        gesture.startX;

      const dy=
        event.clientY-
        gesture.startY;

      if(
        dx<=-MOVE_CANCEL &&
        Math.abs(dx)>=Math.abs(dy)*.65
      ){
        event.preventDefault();
        voiceGestureCancel();
        return;
      }

      if(
        dy<=-MOVE_LOCK &&
        Math.abs(dy)>=Math.abs(dx)*.65
      ){
        event.preventDefault();
        voiceGestureLock();
      }
    },
    {passive:false}
  );

  mic.addEventListener(
    "pointerup",
    event=>{
      const gesture=voiceGesture;

      if(
        !gesture||
        gesture.pointerId!==event.pointerId
      ){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      try{
        mic.releasePointerCapture(
          event.pointerId
        );
      }catch(_){}

      if(gesture.cancelled){
        return;
      }

      if(
        gesture.locked||
        voiceLocked
      ){
        voiceGestureLock();
        return;
      }

      const elapsed=
        Date.now()-
        gesture.startedAt;

      /*
        Quick tap = hands-free locked recording.
        Hold and release = send, like WhatsApp.
      */
      if(elapsed<TAP_LOCK_MS){
        voiceGestureLock();
        return;
      }

      gesture.pendingAction="send";
      stopVoiceRecording(false);
    },
    {passive:false}
  );

  mic.addEventListener(
    "pointercancel",
    event=>{
      const gesture=voiceGesture;

      if(
        !gesture||
        gesture.pointerId!==event.pointerId
      ){
        return;
      }

      if(
        gesture.locked||
        voiceLocked
      ){
        return;
      }

      voiceGestureCancel();
    },
    {passive:true}
  );

  mic.addEventListener(
    "contextmenu",
    event=>{
      event.preventDefault();
    }
  );
}

async function chooseChatMedia(file){
  if(!file)return;
  let kind="";if(String(file.type||"").startsWith("image/"))kind="image";else if(["video/mp4","video/webm","video/quicktime"].includes(mediaBaseMime(file.type)))kind="video";else{alert("Choose a photo or MP4/WebM/MOV video.");return}
  let blob=file;if(kind==="image")blob=await compressChatImage(file);
  if(kind==="image"&&blob.size>8388608){alert("Photo must be 8 MB or smaller.");return}
  if(kind==="video"&&blob.size>26214400){alert("Video must be 25 MB or smaller.");return}
  if(voiceDraft?.url)revokeObjectUrl(voiceDraft.url);voiceDraft=null;if(pendingMediaUrl)revokeObjectUrl(pendingMediaUrl);
  pendingMedia={type:kind,blob:blob,mime:mediaBaseMime(blob.type||file.type),name:file.name||kind};pendingMediaUrl=URL.createObjectURL(blob);renderComposerState();
}
async function uploadChatMedia(c,type,blob,mime,name,context,body){
  const path=chatMediaPath(c,mime,name);setComposerBusy(true,"…");
  try{
    const up=await client.storage.from(CHAT_MEDIA_BUCKET).upload(path,blob,{contentType:mediaBaseMime(mime),upsert:false,cacheControl:"3600"});if(up.error)throw up.error;
    const ctx=Object.assign({},context||{},{storage_path:path,mime_type:mediaBaseMime(mime),size:blob.size,original_name:String(name||"").slice(0,180)});
    const r=await client.rpc("ma7alak_send_media_message",{p_conversation_id:c.id,p_message_type:type,p_storage_path:path,p_body:String(body||"").trim()||null,p_context:ctx});
    if(r.error){await client.storage.from(CHAT_MEDIA_BUCKET).remove([path]).catch(()=>{});throw r.error}
    await messages(c);return true;
  }catch(e){console.error("Send media:",e);alert(friendlyChatError(e));return false}finally{setComposerBusy(false);renderComposerState()}
}
async function sendPendingMedia(c){if(!pendingMedia)return false;const input=document.getElementById("m7-chat-input"),caption=String(input?.value||"").trim();const item=pendingMedia;const ok=await uploadChatMedia(c,item.type,item.blob,item.mime,item.name,{},caption);if(ok){if(input)input.value="";revokeObjectUrl(pendingMediaUrl);pendingMediaUrl="";pendingMedia=null;renderComposerState()}return ok}
async function sendVoiceDraft(c){if(!voiceDraft)return false;const item=voiceDraft;const ok=await uploadChatMedia(c,"voice",item.blob,item.mime,"voice."+mediaExt(item.mime),{duration:Number(item.duration.toFixed(2))},"");if(ok){revokeObjectUrl(item.url);voiceDraft=null;renderComposerState()}return ok}
function blockedComposer(){return mode==="owner"&&document.getElementById("m7-block-user")?.dataset.blocked==="1"}
async function sendTextFromComposer(c){const i=document.getElementById("m7-chat-input"),t=String(i?.value||"").trim();if(!t)return false;i.value="";try{const r=await client.rpc("ma7alak_send_message",{p_conversation_id:c.id,p_body:t});if(r.error){i.value=t;throw r.error}return true}catch(e){alert(friendlyChatError(e));if(String(e?.message||"").includes("CHAT_BLOCKED")&&mode==="owner")applyConversationBlockUi(true);return false}}
function wireChatComposer(c){
  const form=document.getElementById("m7-chat-send");if(!form)return;
  const picker=document.getElementById("m7-chat-media-input"),media=document.getElementById("m7-chat-media"),mic=document.getElementById("m7-chat-mic"),stop=document.getElementById("m7-record-stop"),cancel=document.getElementById("m7-record-cancel");

  media.onclick=()=>{if(!composerBusy&&!activeRecorder&&!voiceStartPromise)picker.click()};
  picker.onchange=async()=>{const file=picker.files?.[0]||null;picker.value="";if(file)await chooseChatMedia(file)};

  wireWhatsAppMic(mic,c);

  stop.onclick=event=>{
    event.preventDefault();
    if(!activeRecorder&&voiceStartPromise){
      if(voiceGesture)voiceGesture.pendingAction="send";
      return;
    }
    stopVoiceRecording(false);
  };

  cancel.onclick=event=>{
    event.preventDefault();
    voiceGestureCancel();
  };

  form.onsubmit=async e=>{
    e.preventDefault();
    if(composerBusy)return;
    if(blockedComposer()){alert("Unblock this user before sending a message.");return}
    if(activeRecorder?.state==="recording"||voiceStartPromise)return;
    if(pendingMedia){await sendPendingMedia(c);return}
    await sendTextFromComposer(c);
  };

  renderComposerState();
}
async function cleanupConversationMedia(c){try{const r=await client.from("ma7alak_messages").select("message_type,context").eq("conversation_id",c.id).in("message_type",["voice","image","video"]);if(r.error)throw r.error;const mine=String(user?.id||"");const paths=[...new Set((r.data||[]).map(m=>String(chatMediaCtx(m).storage_path||"").trim()).filter(p=>p&&p.split("/")[1]===mine))];if(paths.length){const del=await client.storage.from(CHAT_MEDIA_BUCKET).remove(paths);if(del.error)console.warn("Conversation media cleanup:",del.error)}}catch(e){console.warn("Conversation media cleanup:",e)}}
async function deleteMessage(id,c){
  if(!id||!c)return;
  if(!confirm("Delete this message?"))return;
  const r=await client.rpc("ma7alak_delete_my_message_v2",{p_message_id:id});
  if(r.error){alert(r.error.message);return}
  const path=String(r.data?.storage_path||"").trim();
  if(path){const del=await client.storage.from(CHAT_MEDIA_BUCKET).remove([path]);if(del.error)console.warn("Delete media file:",del.error);chatMediaSignedCache.delete(path)}
  await messages(c);
}
async function deleteConversation(c,back){
  if(!c?.id)return false;
  if(!confirm("Delete this entire conversation and all its messages? This cannot be undone."))return false;
  await cleanupConversationMedia(c);
  const r=await client.rpc("ma7alak_delete_conversation",{p_conversation_id:c.id});
  if(r.error){alert(r.error.message);return false}
  dispatchEvent(new Event("ma7alak:messages-read"));
  if(typeof back==="function")await back();else close();
  return true;
}
async function messages(c){
  const b=document.getElementById("m7-chat-body");if(!b)return false;
  if(!c||c.id==null){loadError(b,new Error("Conversation not found."));return false}
  try{
    const r=await Promise.race([
      client.from("ma7alak_messages").select("*").eq("conversation_id",c.id).order("created_at"),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error("Message loading timed out. Please try again.")),12000))
    ]);
    if(!b.isConnected)return false;if(r.error)throw r.error;
    const rows=r.data||[],mediaUrls=await signedChatMediaMap(rows);
    if(!b.isConnected)return false;
    b.innerHTML=rows.map(m=>{
      const mine=sameId(m.sender_id,user?.id),card=storyCardHtml(m),type=chatMediaType(m),media=type?chatMediaHtml(m,mediaUrls.get(String(m.id))||""):"";
      const text=!type?"<div class=\"m7-msg-text\">"+esc(m.body)+"</div>":"";
      return "<div class=\"m7-msg "+(mine?"mine ":"")+(type?"m7-msg-media":"")+"\" data-message-id=\""+esc(m.id)+"\">"+card+media+text+(mine?"<button class=\"m7-msg-delete\" type=\"button\" data-delete-message=\""+esc(m.id)+"\" title=\"Delete message\">×</button>":"")+"<div class=\"m7-msg-time\">"+tm(m.created_at)+"</div><div class=\"m7-msg-reactions\" data-reactions-for=\""+esc(m.id)+"\"></div></div>";
    }).join("")||"<div class=\"m7-empty\">No messages yet.</div>";
    wireStoryCards(b);wireChatMediaMessages(b);
    b.querySelectorAll("[data-delete-message]").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();deleteMessage(btn.dataset.deleteMessage,c)});
    wireMessageReactionGestures(b,c);await refreshReactionsOnly(c);b.scrollTop=b.scrollHeight;
    client.rpc("ma7alak_mark_conversation_read",{p_conversation_id:c.id}).then(()=>dispatchEvent(new Event("ma7alak:messages-read"))).catch(e=>console.warn("Mark read failed:",e));
    return true;
  }catch(e){loadError(b,e);return false}
}
function friendlyChatError(error){
  const message=String(error?.message||error||"");
  if(message.includes("CHAT_BLOCKED"))return "This chat is blocked.";
  return message||"Could not send message";
}
function applyConversationBlockUi(blocked){
  const btn=document.getElementById("m7-block-user");
  const form=document.getElementById("m7-chat-send");
  const input=document.getElementById("m7-chat-input");
  const send=form?.querySelector("button");
  let note=document.getElementById("m7-chat-block-note");

  if(btn){
    btn.dataset.blocked=blocked?"1":"0";
    btn.classList.toggle("m7c-block-active",!!blocked);
    btn.textContent=blocked?"↩":"🚫";
    btn.title=blocked?"Unblock user":"Block user";
    btn.setAttribute("aria-label",btn.title);
  }

  if(mode==="owner"){
    if(blocked){
      if(!note){
        note=document.createElement("div");
        note.id="m7-chat-block-note";
        note.className="m7-chat-block-note";
        form?.insertAdjacentElement("beforebegin",note);
      }
      if(note)note.textContent="User blocked · Unblock to continue chatting";
    }else{
      note?.remove();
    }

    if(input){
      input.disabled=!!blocked;
      input.placeholder=blocked?"User blocked":"Type a message...";
    }
    if(send)send.disabled=!!blocked;const mediaButton=document.getElementById("m7-chat-media"),micButton=document.getElementById("m7-chat-mic");if(mediaButton)mediaButton.disabled=!!blocked;if(micButton)micButton.disabled=!!blocked;
  }
}
async function syncConversationBlock(c){
  const btn=document.getElementById("m7-block-user");
  if(!btn||mode!=="owner"){
    if(btn)btn.style.display="none";
    return false;
  }

  btn.style.display="block";
  btn.disabled=true;

  try{
    const result=await client.rpc(
      "ma7alak_chat_block_state",
      {p_conversation_id:c.id}
    );

    if(result.error)throw result.error;

    const blocked=result.data===true;
    applyConversationBlockUi(blocked);
    return blocked;
  }
  catch(error){
    console.warn("Chat block state:",error);
    applyConversationBlockUi(false);
    return false;
  }
  finally{
    btn.disabled=false;
  }
}
async function toggleConversationBlock(c){
  const btn=document.getElementById("m7-block-user");
  if(!btn||mode!=="owner")return false;

  const next=btn.dataset.blocked!=="1";

  if(
    next &&
    !confirm("Block this user from messaging your shop? You can unblock them from this chat later.")
  ){
    return false;
  }

  btn.disabled=true;

  try{
    const result=await client.rpc(
      "ma7alak_set_chat_block",
      {
        p_conversation_id:c.id,
        p_blocked:next
      }
    );

    if(result.error)throw result.error;

    applyConversationBlockUi(result.data===true);
    return true;
  }
  catch(error){
    alert(friendlyChatError(error));
    return false;
  }
  finally{
    btn.disabled=false;
  }
}
async function convo(c,title,avatar,back,shopProfile){
  ensureSharedStoryViewer();
  shell(title,avatar,!!back);

  if(!c||c.id==null){
    loadError(document.getElementById("m7-chat-body"),new Error("Conversation not found."));
    return;
  }

  if(shopProfile&&shopProfile.isShop){
    bindShopProfileLink(shopProfile.url,shopProfile.slug);
  }

  if(back)document.getElementById("m7-back").onclick=back;

  const del=document.getElementById("m7-delete-convo");
  del.style.display="block";
  del.onclick=()=>deleteConversation(c,back);

  const blockButton=document.getElementById("m7-block-user");
  if(blockButton){
    blockButton.style.display=mode==="owner"?"block":"none";
    blockButton.onclick=()=>toggleConversationBlock(c);
  }

  document.getElementById("m7-report").onclick=async()=>{
    const reason=prompt("Why are you reporting this conversation?","Abusive messages");
    if(!reason)return;
    const r=await client.rpc(
      "ma7alak_report_conversation",
      {
        p_conversation_id:c.id,
        p_reason:reason,
        p_details:"Reported from ShoufHon chat"
      }
    );
    alert(r.error?r.error.message:"Report sent to ShoufHon Admin ✓");
  };

  document.getElementById("m7-chat").insertAdjacentHTML(
    "beforeend",
    `<form id="m7-chat-send"><input id="m7-chat-media-input" type="file" accept="image/*,video/mp4,video/webm,video/quicktime" hidden><div id="m7-compose-preview" hidden></div><div id="m7-voice-recording" hidden><div class="m7-record-row"><span class="m7-record-dot" aria-hidden="true"></span><span class="m7-record-time" id="m7-record-time">0:00</span><span class="m7-record-hint" id="m7-record-hint">← Slide left to cancel · ↑ Lock</span><span class="m7-record-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><button class="m7-record-cancel" id="m7-record-cancel" type="button">Cancel</button><button class="m7-record-stop" id="m7-record-stop" type="button">Send</button></div></div><div class="m7-compose-row"><button class="m7-compose-tool" id="m7-chat-media" type="button" aria-label="Send photo or video" title="Photo or video">＋</button><input id="m7-chat-input" maxlength="2000" placeholder="Type a message..." autocomplete="off"><button class="m7-compose-tool" id="m7-chat-mic" type="button" aria-label="Voice message" title="Voice message">🎤</button><button class="m7-send-button" type="submit" aria-label="Send">➤</button></div></form>`
  );

  await Promise.all([
    messages(c),
    mode==="owner"
      ? syncConversationBlock(c)
      : Promise.resolve(false)
  ]);

  wireChatComposer(c);

  channel=
    client
      .channel("m7c-"+c.id+Math.random())
      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"ma7alak_messages",
          filter:"conversation_id=eq."+c.id
        },
        ()=>messages(c)
      )
      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"ma7alak_message_reactions",
          filter:"conversation_id=eq."+c.id
        },
        ()=>refreshReactionsOnly(c)
      )
      .on(
        "postgres_changes",
        {
          event:"DELETE",
          schema:"public",
          table:"ma7alak_conversations",
          filter:"id=eq."+c.id
        },
        ()=>{
          if(typeof back==="function")back();
          else close();
        }
      )
      .subscribe();
}
async function inboxMessageState(rows,sideFor){
  const state={unread:new Set(),latest:new Map()};
  if(!rows.length)return state;

  try{
    const ids=rows.map(x=>x.id);

    const r=await client
      .from("ma7alak_messages")
      .select("conversation_id,sender_id,created_at")
      .in("conversation_id",ids)
      .order("created_at",{ascending:false});

    if(r.error)return state;

    const byId=new Map(
      rows.map(c=>[String(c.id),c])
    );

    for(const m of r.data||[]){
      const id=String(m.conversation_id||"");
      const c=byId.get(id);

      if(!c)continue;

      if(!state.latest.has(id)){
        state.latest.set(id,m.created_at);
      }

      const side=
        typeof sideFor==="function"
          ? sideFor(c)
          : mode;

      const rd=
        side==="owner"
          ? c.owner_last_read_at
          : c.viewer_last_read_at;

      if(
        !sameId(m.sender_id,user?.id) &&
        (!rd||new Date(m.created_at)>new Date(rd))
      ){
        state.unread.add(id);
      }
    }
  }
  catch(e){
    console.warn("Inbox message state failed:",e);
  }

  return state;
}

async function unreadMap(rows,sideFor){
  return (await inboxMessageState(rows,sideFor)).unread;
}
async function accepts(slug){let r=await client.rpc("ma7alak_shop_accepts_messages",{p_shop_slug:String(slug||"").trim()});if(r.error){console.warn("Message setting:",r.error);return true}return r.data!==false}
async function openShop(slug){try{await vr();if(!user){window.Ma7alakAccount?.open();return}slug=String(slug||"").trim();const ownSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim();if(ownSlug&&ownSlug.toLowerCase()===slug.toLowerCase()){alert("You cannot message your own shop");return}if(!await accepts(slug)){alert("Shop owner is currently not accepting messages");return}let r=await client.rpc("ma7alak_start_conversation",{p_shop_slug:slug});if(r.error){alert(String(r.error.message||"").includes("CHAT_BLOCKED")?"This shop has blocked this chat.":r.error.message);return}let c=Array.isArray(r.data)?r.data[0]:r.data;if(!c){alert("Could not open conversation.");return}let sp=await client.from("shop_profiles").select("shop_name,profile_image_url,shop_url").eq("shop_slug",c.shop_slug).maybeSingle();mode="viewer";convo(c,sp.data?.shop_name||c.shop_slug,sp.data?.profile_image_url||"",null,{isShop:true,url:sp.data?.shop_url||"",slug:c.shop_slug})}catch(e){console.error(e);alert(e?.message||"Could not open messages.")}}
function wireInboxDeletes(b,rows,reopen){b.querySelectorAll("[data-delete-convo]").forEach(btn=>btn.onclick=async e=>{e.preventDefault();e.stopPropagation();let c=rows.find(x=>sameId(x.id,btn.dataset.deleteConvo));if(c)await deleteConversation(c,reopen)})}
async function viewerInbox(){try{await vr();if(!user){window.Ma7alakAccount?.open();return}dispatchEvent(new CustomEvent("ma7alak:inbox-open",{detail:{kind:"viewer"}}));shell("Messages","",false);document.getElementById("m7-chat")?.classList.add("m7-inbox-panel");document.getElementById("m7-chat-shell")?.classList.add("m7-inbox-shell");document.getElementById("m7-report").style.display="none";let b=document.getElementById("m7-chat-body"),r=await client.from("ma7alak_conversations").select("*").order("updated_at",{ascending:false});if(r.error){b.textContent=r.error.message;return}let rows=r.data||[],slugs=[...new Set(rows.map(x=>x.shop_slug))];let [un,p]=await Promise.all([unreadMap(rows),slugs.length?client.from("shop_profiles").select("shop_slug,shop_name,profile_image_url,shop_url").in("shop_slug",slugs):Promise.resolve({data:[]})]);let map={};for(let x of p.data||[])map[x.shop_slug]=x;b.innerHTML=rows.length?rows.map(c=>{let p=map[c.shop_slug]||{},n=p.shop_name||c.shop_slug,id=String(c.id);return `<div class="m7-convo ${un.has(id)?"unread":""}" data-id="${esc(id)}">${av(p.profile_image_url,n)}<div class="m7-convo-copy"><strong>${esc(n)}</strong><small>Shop conversation</small></div>${un.has(id)?'<span class="m7-new">NEW</span>':""}<button class="m7-convo-delete" type="button" data-delete-convo="${esc(id)}" title="Delete conversation">🗑</button></div>`}).join(""):'<div class="m7-empty">No conversations yet.</div>';wireInboxDeletes(b,rows,viewerInbox);b.querySelectorAll(".m7-convo").forEach(el=>el.onclick=()=>{let c=rows.find(x=>sameId(x.id,el.dataset.id));if(!c){loadError(b,new Error("Conversation not found."));return}let p=map[c.shop_slug]||{};convo(c,p.shop_name||c.shop_slug,p.profile_image_url||"",viewerInbox,{isShop:true,url:p.shop_url||"",slug:c.shop_slug})})}catch(e){loadError(document.getElementById("m7-chat-body"),e)}}
async function ownerInbox(){
  try{
    if(!await or()){
      window.Ma7alakOwnerAuth?.open();
      return;
    }

    const shop=String(
      window.Ma7alakOwnerAuth.owner.shop_slug||
      ""
    ).trim();

    dispatchEvent(
      new CustomEvent(
        "ma7alak:inbox-open",
        {detail:{kind:"owner"}}
      )
    );

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

    async function syncSetting(){
      const on=await accepts(shop);
      toggle.className=on?"on":"off";
      toggle.textContent=on?"Messages ON":"Messages OFF";
      toggle.dataset.on=on?"1":"0";
    }

    toggle.onclick=async()=>{
      toggle.disabled=true;
      const next=toggle.dataset.on!=="1";

      const result=await client.rpc(
        "ma7alak_set_my_shop_accepting_messages",
        {
          p_shop_slug:shop,
          p_accepting:next
        }
      );

      toggle.disabled=false;

      if(result.error){
        alert(result.error.message);
        return;
      }

      syncSetting();
    };

    await syncSetting();

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
          syncSetting
        )
        .subscribe();

    const b=document.getElementById("m7-chat-body");
    let renderTurn=0;

    async function renderOwnerInboxList(){
      if(!b||!b.isConnected)return;

      const turn=++renderTurn;

      try{
        const result=
          await client
            .from("ma7alak_conversations")
            .select("*")
            .order("updated_at",{ascending:false});

        if(result.error)throw result.error;
        if(turn!==renderTurn||!b.isConnected)return;

        let rows=(result.data||[]).filter(c=>{
          const incoming=
            String(c.shop_slug||"").toLowerCase()===
            shop.toLowerCase();

          const outgoing=
            sameId(c.viewer_id,user?.id);

          return incoming||outgoing;
        });

        const ids=rows.map(x=>x.id);

        const [messageState,partnersResult]=await Promise.all([
          inboxMessageState(
            rows,
            c=>sameId(c.viewer_id,user?.id)
              ?"viewer"
              :"owner"
          ),
          ids.length
            ? client.rpc(
                "ma7alak_get_conversation_partners",
                {p_conversation_ids:ids}
              )
            : Promise.resolve({data:[]})
        ]);

        if(turn!==renderTurn||!b.isConnected)return;

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

        rows=rows.slice().sort((a,bRow)=>{
          const aTime=new Date(
            messageState.latest.get(String(a.id))||
            a.updated_at||
            a.created_at||
            0
          ).getTime()||0;

          const bTime=new Date(
            messageState.latest.get(String(bRow.id))||
            bRow.updated_at||
            bRow.created_at||
            0
          ).getTime()||0;

          return bTime-aTime;
        });

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
                          ?"Shop · You messaged this shop"
                          :"Shop · Messaged your shop"
                      )
                    : (
                        p.username
                          ?"@"+p.username
                          :"Customer"
                      );

                const lastAt=
                  messageState.latest.get(id)||
                  c.updated_at||
                  c.created_at||
                  "";

                const unread=
                  messageState.unread.has(id);

                return `<div class="m7-convo ${unread?"unread":""}" data-id="${esc(id)}" data-side="${outgoing?"viewer":"owner"}">${av(p.avatar_url,n)}<div class="m7-convo-copy"><strong>${esc(n)}</strong><small>${esc(subtitle)}</small><time class="m7-convo-time" data-msg-time="${esc(lastAt)}"></time></div>${unread?'<span class="m7-new">NEW</span>':""}<button class="m7-convo-delete" type="button" data-delete-convo="${esc(id)}" title="Delete conversation">🗑</button></div>`;
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
              ?"viewer"
              :"owner";

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

        startInboxClock(b);
      }
      catch(error){
        if(turn===renderTurn){
          loadError(b,error);
        }
      }
    }

    function scheduleOwnerInboxRefresh(){
      clearTimeout(inboxRefreshTimer);

      inboxRefreshTimer=setTimeout(
        ()=>{
          inboxRefreshTimer=null;
          renderOwnerInboxList();
        },
        70
      );
    }

    await renderOwnerInboxList();

    channel=
      client
        .channel(
          "m7-owner-inbox-live-"+
          shop+
          "-"+
          Math.random()
        )
        .on(
          "postgres_changes",
          {
            event:"*",
            schema:"public",
            table:"ma7alak_messages"
          },
          scheduleOwnerInboxRefresh
        )
        .on(
          "postgres_changes",
          {
            event:"*",
            schema:"public",
            table:"ma7alak_conversations"
          },
          scheduleOwnerInboxRefresh
        )
        .subscribe(status=>{
          if(
            status==="CHANNEL_ERROR"||
            status==="TIMED_OUT"||
            status==="CLOSED"
          ){
            setTimeout(
              scheduleOwnerInboxRefresh,
              250
            );
          }
        });

    inboxWakeHandler=()=>{
      if(
        document
          .getElementById("m7-chat-shell")
          ?.classList.contains("m7-inbox-shell")
      ){
        scheduleOwnerInboxRefresh();
      }
    };

    window.addEventListener(
      "ma7alak:page-wake",
      inboxWakeHandler
    );

    /*
      Realtime stays primary. While the inbox is visibly open, use a tiny
      one-row message probe as a reliability fallback for browsers/mobile
      WebViews that silently drop a Realtime socket. Only a changed message
      signal triggers the heavier inbox render.
    */
    let inboxLivePollBusy=false;
    let inboxLiveSignal="";

    async function pollOwnerInboxSignal(){
      if(
        inboxLivePollBusy||
        document.hidden||
        !document
          .getElementById("m7-chat-shell")
          ?.classList.contains("m7-inbox-shell")
      ){
        return;
      }

      inboxLivePollBusy=true;

      try{
        const probe=
          await client
            .from("ma7alak_messages")
            .select("id,conversation_id,created_at")
            .order("created_at",{ascending:false})
            .limit(1);

        if(probe.error){
          console.warn(
            "Inbox live probe:",
            probe.error
          );
          return;
        }

        const latest=(probe.data||[])[0]||null;
        const nextSignal=
          latest
            ? String(latest.id)+"|"+
              String(latest.conversation_id)+"|"+
              String(latest.created_at||"")
            : "";

        if(
          inboxLiveSignal&&
          nextSignal!==inboxLiveSignal
        ){
          scheduleOwnerInboxRefresh();
        }

        inboxLiveSignal=nextSignal;
      }
      catch(error){
        console.warn(
          "Inbox live probe:",
          error
        );
      }
      finally{
        inboxLivePollBusy=false;
      }
    }

    await pollOwnerInboxSignal();

    inboxLiveFallbackTimer=setInterval(
      pollOwnerInboxSignal,
      1800
    );
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
