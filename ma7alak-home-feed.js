(function(){
"use strict";
/* Global Custom Code only — never run inside a Hostinger Custom Embed iframe. */
if(window.self!==window.top)return;
if(window.__MA7ALAK_HOME_FEED_ORIGINAL_GLOBAL__)return;
const __m7Path=(location.pathname||"/").replace(/\/+$/,"")||"/";
const __m7IsHome=(__m7Path==="/"||__m7Path==="/home");
if(!__m7IsHome)return;
window.__MA7ALAK_HOME_FEED_ORIGINAL_GLOBAL__=1;

function m7Mount(){
 if(document.getElementById("m7-global-home-feed-shell"))return;
 /* Keep Hostinger's real section/page background untouched. */
 const style=document.createElement("style"); style.id="m7-global-home-feed-original-css"; style.textContent=`\n#m7-global-home-feed-shell,#m7-global-home-feed-shell *{box-sizing:border-box}#m7-home-feed{width:100%;font-family:Arial,"Segoe UI",sans-serif;color:#fff}
/* GLOBAL SHELL ONLY — transparent, so the real Hostinger background shows through. */
#m7-global-home-feed-shell{position:relative!important;isolation:isolate!important;width:100%!important;max-width:100%!important;margin:12px 0 0!important;padding:0 12px 18px!important;background:transparent!important;background-image:none!important;overflow:visible!important}
#m7-global-home-feed-shell:before,#m7-global-home-feed-shell:after{content:none!important;display:none!important}
#m7-global-home-feed-shell #m7-home-feed{width:min(100%,900px)!important;max-width:900px!important;margin:0 auto!important;position:relative!important;z-index:1!important;background:transparent!important}
/* TRUE APP-LEVEL REEL VIEWER — above the fixed SHOUFHON header */
html.m7-reel-open,body.m7-reel-open{overflow:hidden!important;overscroll-behavior:none!important}
body.m7-reel-open #ma7alak-premium-header-root,body.m7-reel-open #ma7alak-premium-social-header,body.m7-reel-open .ma7alak-premium-social-header,body.m7-reel-open #ma7alak-opening-header-root{visibility:hidden!important;pointer-events:none!important}
body>.ma7alak-reel-viewer{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;z-index:2147483647!important}
\n/* LIVE */\n#m7-live-home{width:100%;padding:18px;border-radius:25px;background:linear-gradient(145deg,#12110f,#070707);border:1px solid rgba(228,170,79,.18);box-shadow:0 18px 45px #0004;overflow:hidden}\n.m7-live-head{margin-bottom:15px}.m7-live-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.m7-live-status{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:900;letter-spacing:2px}.m7-live-status i{display:block;width:10px;height:10px;border-radius:50%;background:#777;transform:translateZ(0)}.m7-live-active .m7-live-status i{background:#36dc82;-webkit-animation:m7pulse 1.25s ease-out infinite;animation:m7pulse 1.25s ease-out infinite;will-change:transform,box-shadow,opacity}#m7-live-count{padding:6px 9px;border:1px solid #ffffff17;border-radius:99px;background:#ffffff0a;color:#ffffff7a;font-size:9px;font-weight:900;letter-spacing:.7px}@-webkit-keyframes m7pulse{0%{-webkit-transform:scale(.9);box-shadow:0 0 0 0 #36dc82cc,0 0 10px #36dc82aa}55%{-webkit-transform:scale(1.08);box-shadow:0 0 0 9px #36dc8218,0 0 18px #36dc8299}100%{-webkit-transform:scale(.9);box-shadow:0 0 0 13px #36dc8200,0 0 5px #36dc8244}}@keyframes m7pulse{0%{transform:scale(.9);box-shadow:0 0 0 0 #36dc82cc,0 0 10px #36dc82aa}55%{transform:scale(1.08);box-shadow:0 0 0 9px #36dc8218,0 0 18px #36dc8299}100%{transform:scale(.9);box-shadow:0 0 0 13px #36dc8200,0 0 5px #36dc8244}}\n#m7-live-home h2{margin:9px 0 5px;font-size:30px;line-height:1.04;letter-spacing:-.8px}.m7-live-head p{margin:0;color:#ffffff7a;font-size:13px}.m7-live-cards{display:flex;gap:13px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 2px 9px}.m7-live-cards::-webkit-scrollbar{display:none}.m7-live-card{position:relative;flex:0 0 88%;height:470px;scroll-snap-align:start;overflow:hidden;border-radius:23px;border:1px solid #36dc824d;background:#111;box-shadow:0 14px 34px #0006;cursor:pointer;isolation:isolate;-webkit-animation:m7cardglow 2.4s ease-in-out infinite;animation:m7cardglow 2.4s ease-in-out infinite;will-change:box-shadow,border-color}.m7-live-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.m7-live-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 15%,#0002 40%,#000 100%)}.m7-live-copy{position:absolute;z-index:2;left:17px;right:17px;bottom:17px}.m7-live-badge{display:inline-flex;padding:7px 10px;border-radius:99px;background:#050505e0;border:1px solid #ffffff26;font-size:10px;font-weight:900}.m7-live-title{margin:10px 0 9px;font-size:25px;line-height:1.08;font-weight:900}.m7-shop-line{display:flex;align-items:center;gap:10px;min-width:0}.m7-shop-avatar{position:relative;z-index:1;isolation:isolate;flex:0 0 42px;width:42px;height:42px;padding:3px;border-radius:50%;background:#07110c;box-shadow:0 0 18px #36dc8273;transform:translateZ(0);-webkit-animation:m7avatarglow 1.55s ease-in-out infinite;animation:m7avatarglow 1.55s ease-in-out infinite;will-change:box-shadow}.m7-shop-avatar:before{content:"";position:absolute;z-index:-1;inset:-3px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 12%,#36dc82 24%,#b7ffd7 31%,#36dc82 38%,transparent 52% 72%,#36dc82 86%,transparent 100%);-webkit-animation:m7spin 1.35s linear infinite;animation:m7spin 1.35s linear infinite;will-change:transform}.m7-shop-avatar:after{content:"";position:absolute;z-index:-2;inset:-7px;border:2px solid #36dc8266;border-radius:50%;-webkit-animation:m7ring 1.55s ease-out infinite;animation:m7ring 1.55s ease-out infinite;will-change:transform,opacity}.m7-shop-avatar img,.m7-avatar-fallback{position:relative;z-index:2;display:flex;width:100%;height:100%;border:2px solid #07100b;border-radius:50%;object-fit:cover;background:#171717;align-items:center;justify-content:center;color:#efbd70;font-weight:900;-webkit-transform:translateZ(0);transform:translateZ(0)}@-webkit-keyframes m7spin{to{-webkit-transform:rotate(360deg)}}@keyframes m7spin{to{transform:rotate(360deg)}}@-webkit-keyframes m7ring{0%{-webkit-transform:scale(.78);opacity:.95}100%{-webkit-transform:scale(1.35);opacity:0}}@keyframes m7ring{0%{transform:scale(.78);opacity:.95}100%{transform:scale(1.35);opacity:0}}@-webkit-keyframes m7avatarglow{0%,100%{box-shadow:0 0 10px #36dc8266}50%{box-shadow:0 0 27px #36dc82cc}}@keyframes m7avatarglow{0%,100%{box-shadow:0 0 10px #36dc8266}50%{box-shadow:0 0 27px #36dc82cc}}@-webkit-keyframes m7cardglow{0%,100%{border-color:#36dc8238;box-shadow:0 14px 34px #0006,0 0 0 #36dc8200}50%{border-color:#36dc8273;box-shadow:0 14px 34px #0006,0 0 18px #36dc822e}}@keyframes m7cardglow{0%,100%{border-color:#36dc8238;box-shadow:0 14px 34px #0006,0 0 0 #36dc8200}50%{border-color:#36dc8273;box-shadow:0 14px 34px #0006,0 0 18px #36dc822e}}.m7-shop-info{min-width:0}.m7-shop-name{overflow:hidden;color:#efbd70;font-size:13px;font-weight:900;text-overflow:ellipsis;white-space:nowrap}.m7-shop-now{margin-top:3px;color:#36dc82;font-size:9px;font-weight:900;letter-spacing:1px;text-shadow:0 0 10px #36dc8299}.m7-live-price{margin-top:9px;color:#f1bb61;font-size:23px;font-weight:900}.m7-live-old{margin-right:7px;color:#ffffff73;text-decoration:line-through;font-size:13px}.m7-live-times{display:flex;justify-content:space-between;gap:8px;margin-top:10px;padding-top:9px;border-top:1px solid #ffffff1a;color:#ffffff9e;font-size:10px;font-weight:800}.m7-live-empty{width:100%;min-height:105px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;text-align:center;border:1px solid #36dc8221;border-radius:18px;background:#36dc8208;color:#ffffff73}.m7-live-empty b{color:#ffffffb8;font-size:14px}.m7-live-empty small{margin-top:5px;font-size:11px}\n
/* Compact empty Live state — no oversized empty card. */
#m7-live-home.m7-live-empty-state{position:relative;padding-bottom:17px}
#m7-live-home.m7-live-empty-state .m7-live-head{margin-bottom:0}
#m7-live-home.m7-live-empty-state .m7-live-cards{display:none!important}
#m7-live-home.m7-live-empty-state h2{margin-top:11px}
#m7-live-home.m7-live-empty-state #m7-live-sub{max-width:82%;line-height:1.35}

/* SHOUFHON LOCAL SPOTLIGHT — integrated into the same homepage feed. */
#ma7alak-home-shop-spotlight{box-sizing:border-box;width:100%;margin:8px auto 0;padding:4px 3px 10px;color:#fff;font-family:Arial,"Segoe UI",sans-serif}
.m7hs *{box-sizing:border-box}
.m7hs-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:0 3px 12px}
.m7hs-kicker{color:#e9bf6d;font-size:9px;font-weight:900;letter-spacing:2.1px}
.m7hs h2{margin:4px 0 0;font:900 26px/1.05 Georgia,serif}
.m7hs-count{color:#9e988e;font-size:10px;white-space:nowrap}
.m7hs-track{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:3px 3px 15px;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.m7hs-track::-webkit-scrollbar{display:none}
.m7hs-card{--accent:#e3b85f;position:relative;flex:0 0 84%;height:360px;overflow:hidden;border:1px solid color-mix(in srgb,var(--accent) 48%,transparent);border-radius:23px;background:#12110e;scroll-snap-align:center;scroll-snap-stop:always;box-shadow:none;cursor:pointer;transform:translateZ(0);will-change:transform}
.m7hs-card.featured{border-color:#ff596a}
.m7hs-card.featured:before{content:"";position:absolute;z-index:4;inset:0;border-radius:22px;border:2px solid #ff405b;pointer-events:none;opacity:.55;transform:translateZ(0);-webkit-transform:translateZ(0);animation:m7hs-red-frame 1.25s ease-in-out infinite;-webkit-animation:m7hs-red-frame 1.25s ease-in-out infinite}
.m7hs-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.m7hs-card:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#070707f2 0,#090909c9 43%,#0909093d 78%),linear-gradient(0deg,#070707f2 0,#090909ba 28%,transparent 62%)}
.m7hs-ribbon{position:absolute;z-index:3;right:12px;top:12px;padding:7px 11px;border-radius:999px;background:#e6ba66;color:#1b1308;font-size:9px;font-weight:950;letter-spacing:1px;transform:translateZ(0);will-change:transform,box-shadow,filter}
.m7hs-card.featured .m7hs-ribbon{background:#be1830;color:#fff;animation:m7hs-ribbon 1.35s ease-in-out infinite;-webkit-animation:m7hs-ribbon 1.35s ease-in-out infinite;box-shadow:0 0 17px #ff314eaa}
.m7hs-body{position:absolute;z-index:2;left:18px;right:18px;bottom:17px}
.m7hs-profile{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.m7hs-profile img,.m7hs-fallback{width:56px;height:56px;border:2px solid var(--accent);border-radius:50%;object-fit:cover;background:#242018;display:grid;place-items:center;box-shadow:0 0 16px color-mix(in srgb,var(--accent) 48%,transparent)}
.m7hs-profile strong{display:block;font-size:19px;line-height:1.08;text-shadow:0 2px 9px #000}
.m7hs-profile small{display:block;color:#e7c98d;margin-top:4px;font-size:10px;text-shadow:0 2px 7px #000}
.m7hs-about{max-width:310px;margin:0 0 13px;color:#ded8ce;font-size:12px;line-height:1.4;text-shadow:0 2px 8px #000;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.m7hs-bottom{display:flex;align-items:center;justify-content:space-between;gap:9px;border-top:1px solid #ffffff20;padding-top:11px}
.m7hs-location{min-width:0;color:#bdb5a9;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.m7hs-button{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--accent) 75%,white);border-radius:999px;background:#090806cc;color:#f3d493;padding:9px 13px;font-size:10px;font-weight:900}
.m7hs-empty{padding:22px 16px;border:1px dashed #d9b66c45;border-radius:20px;text-align:center;color:#aaa399;background:radial-gradient(circle at top,#d8aa4315,transparent 70%)}
.m7hs-empty strong{display:block;color:#f1e5cf;margin-bottom:4px}
@keyframes m7hs-red-frame{0%,100%{opacity:.45;box-shadow:inset 0 0 5px #ff29468a}50%{opacity:1;box-shadow:inset 0 0 18px #ff2946,inset 0 0 0 1px #ff7184}}
@-webkit-keyframes m7hs-red-frame{0%,100%{opacity:.45;-webkit-box-shadow:inset 0 0 5px #ff29468a}50%{opacity:1;-webkit-box-shadow:inset 0 0 18px #ff2946,inset 0 0 0 1px #ff7184}}
@keyframes m7hs-ribbon{0%,100%{transform:translateZ(0) scale(1);opacity:.88;box-shadow:0 0 8px #ff314e80,inset 0 0 0 #fff0}50%{transform:translateZ(0) scale(1.07);opacity:1;box-shadow:0 0 18px #ff314ed9,inset 0 0 10px #ff8794}}
@-webkit-keyframes m7hs-ribbon{0%,100%{-webkit-transform:translateZ(0) scale(1);opacity:.88;-webkit-box-shadow:0 0 8px #ff314e80,inset 0 0 0 #fff0}50%{-webkit-transform:translateZ(0) scale(1.07);opacity:1;-webkit-box-shadow:0 0 18px #ff314ed9,inset 0 0 10px #ff8794}}
@media(min-width:700px){.m7hs-card{flex-basis:48%;height:420px}.m7hs h2{font-size:34px}}
@media(max-width:600px){#m7-live-home.m7-live-empty-state{padding:14px 15px 15px}#m7-live-home.m7-live-empty-state h2{font-size:25px!important;margin-bottom:4px}#ma7alak-home-shop-spotlight{margin-top:5px;padding-bottom:8px}.m7hs-card{flex-basis:calc(100% - 42px);max-width:calc(100vw - 62px);height:360px}.m7hs-head{margin-bottom:10px}}
@media(prefers-reduced-motion:reduce){.m7hs-card.featured:before,.m7hs-card.featured .m7hs-ribbon{animation-duration:2s!important;-webkit-animation-duration:2s!important}}

/* REELS — naturally follows LIVE with no reserved gap */\n.ma7alak-reels-wrapper{position:relative;width:100%;margin:28px 0 14px;padding:15px 0 14px}.ma7alak-reels-wrapper:before,.ma7alak-reels-wrapper:after{content:"";position:absolute;left:50%;width:100vw;height:3px;transform:translateX(-50%);background:#ffffff1a;box-shadow:0 1px #0009}.ma7alak-reels-wrapper:before{top:0}.ma7alak-reels-wrapper:after{bottom:0}.ma7alak-reels-title{display:flex;align-items:center;gap:8px;margin:0 0 10px 4px;font-size:20px;font-weight:800}.ma7alak-reels{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;padding:5px 4px 14px;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}.ma7alak-reels::-webkit-scrollbar{display:none}.ma7alak-reel{position:relative;flex:0 0 290px;height:515px;border-radius:22px;overflow:hidden;background:#0d0d0e;border:1px solid #e2b45b38;scroll-snap-align:start;scroll-snap-stop:always}.ma7alak-video{width:100%;height:100%;display:block;object-fit:cover;cursor:pointer}.reel-info{position:absolute;left:14px;right:14px;bottom:14px;z-index:10;display:flex;align-items:center;gap:11px;padding:10px 13px;border:1px solid #ffffff12;border-radius:15px;background:linear-gradient(to top,#0006,#0001);backdrop-filter:blur(5px);cursor:pointer}.reel-shop-icon{width:42px;height:42px;min-width:42px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover;background:#171717}.reel-info-text{min-width:0;display:flex;flex-direction:column;gap:3px;overflow:hidden}.reel-info-text strong,.reel-info-text span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px #000}.reel-info-text strong{font-size:17px}.reel-info-text span{font-size:12px;color:#fffffff5}.coming-soon{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#f5d48a;background:radial-gradient(circle,#e2b45b17,transparent 60%)}.coming-soon span{font-size:42px}.ma7alak-favorites-corner{display:flex;justify-content:flex-end;margin-top:8px;padding:0 6px}.ma7alak-favorites-button{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border:1px solid #e2b45b4d;border-radius:99px;background:linear-gradient(135deg,#e2b45b21,#000a);color:#f5d48a;font-size:13px;font-weight:700}.ma7alak-favorites-button b{min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#e2b45b;color:#111;font-size:11px}\n/* VIEWER */\n.ma7alak-reel-viewer{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;background:#000;overflow:hidden;touch-action:none}.ma7alak-reel-viewer.open{display:flex}.ma7alak-reel-viewer-video{position:absolute;inset:5px;width:calc(100vw - 10px);height:calc(100dvh - 10px);object-fit:contain;background:#000;border-radius:18px;transition:opacity .35s ease,transform .45s cubic-bezier(.16,1,.3,1)}.ma7alak-reel-viewer-shop{position:absolute;top:15px;left:10px;z-index:2147483646;max-width:70%;display:flex;align-items:center;gap:9px;padding:6px 13px 6px 6px;border:1px solid #ffffff3d;border-radius:99px;background:#000b;color:#fff;backdrop-filter:blur(14px)}.ma7alak-reel-viewer-shop img{width:40px;height:40px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover}.ma7alak-reel-viewer-shop span{min-width:0;display:flex;flex-direction:column;text-align:left}.ma7alak-reel-viewer-shop strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.ma7alak-reel-viewer-shop small{color:#ffffffad;font-size:10px}.ma7alak-reel-viewer-shop em{color:#f5d48a;font-size:18px;font-style:normal}.ma7alak-reel-viewer-close,.ma7alak-viewer-favorite{position:absolute;z-index:2147483646;display:flex;align-items:center;justify-content:center;border:1px solid #ffffff40;border-radius:50%;background:#000b;color:#fff;backdrop-filter:blur(12px)}.ma7alak-reel-viewer-close{top:14px;right:10px;width:45px;height:45px;font-size:31px}.ma7alak-viewer-favorite{right:10px;bottom:72px;width:50px;height:50px;font-size:28px}.ma7alak-viewer-favorite.active{color:#f5d48a;background:#e2b45b2b;border-color:#e2b45b8c}.ma7alak-swipe-hint{position:absolute;bottom:20px;left:50%;z-index:2147483645;transform:translateX(-50%);color:#ffffff73;font-size:11px;pointer-events:none}\n@media(max-width:600px){#m7-global-home-feed-shell{padding-left:10px!important;padding-right:10px!important}#m7-home-feed{min-width:0!important}#m7-live-home{width:100%!important;max-width:100%!important;min-width:0!important;padding:15px;border-radius:23px}#m7-live-home h2{font-size:27px}.m7-live-cards,.ma7alak-reels{max-width:100%!important;min-width:0!important;scroll-padding-inline:2px 10px}.m7-live-card{flex-basis:calc(100% - 20px)!important;max-width:calc(100% - 20px)!important;height:465px}.ma7alak-reel{flex-basis:min(68vw,290px)!important;max-width:calc(100vw - 42px)!important;height:auto;aspect-ratio:9/16;border-radius:18px}.reel-info{left:10px;right:10px;bottom:10px;padding:8px 10px}.reel-shop-icon{width:37px;height:37px;min-width:37px}.reel-info-text strong{font-size:15px}.reel-info-text span{font-size:10px}}\n/* Exact Lebanon schedule + live countdown. Only this text updates every second;\n   the card and its video stay mounted, preventing black flicker. */\n.m7-live-times{display:block;margin-top:11px;padding:10px 11px;border:1px solid #ffffff17;border-radius:13px;background:#050807b8}.m7-live-schedule{display:grid;gap:4px}.m7-live-schedule b{color:#fff;font-size:11px;line-height:1.25}.m7-live-schedule small{color:#36dc82;font-size:10px;font-weight:900;line-height:1.2;text-shadow:0 0 9px #36dc826b}.m7-live-schedule span{color:#ffffff9c;font-size:10px;font-weight:800;line-height:1.25}\n/* Live indicators intentionally remain animated on mobile, including browsers\n   that inherit Android\'s reduced-motion preference. */\n@media(prefers-reduced-motion:reduce){.ma7alak-reel-viewer-video{transition:none}.m7-live-status i,.m7-live-card,.m7-shop-avatar,.m7-shop-avatar:before,.m7-shop-avatar:after{-webkit-animation-play-state:running!important;animation-play-state:running!important}}\n\n/* FINAL HOSTINGER BACKGROUND LOCK
   The global feed owns NO page/background layer.
   Only the actual Live/Reel/Spotlight cards keep their intended styling. */
#m7-global-home-feed-shell,
#m7-global-home-feed-shell #m7-home-feed,
#m7-global-home-feed-shell .ma7alak-reels-wrapper{
  background:transparent!important;
  background-color:transparent!important;
  background-image:none!important;
  box-shadow:none!important;
}
/* Never paint a replacement canvas behind the panels. */
#m7-global-home-feed-shell,
#m7-global-home-feed-shell #m7-home-feed,
#m7-global-home-feed-shell .ma7alak-reels-wrapper{
  --m7-feed-host-background:transparent;
}
#m7-global-home-feed-shell{
  border:0!important;
  border-radius:0!important;
  width:100%!important;
  max-width:100%!important;
  margin:10px 0 0!important;
  padding:18px 12px 18px!important;
  overflow:visible!important;
}
/* Visual separator only — this does NOT paint any background behind the feed. */
#m7-global-home-feed-shell:before{
  content:""!important;
  display:block!important;
  position:absolute!important;
  top:0!important;
  left:12px!important;
  right:12px!important;
  height:1px!important;
  background:linear-gradient(90deg,transparent,rgba(217,164,65,.48) 20%,rgba(245,215,150,.82) 50%,rgba(217,164,65,.48) 80%,transparent)!important;
  box-shadow:0 0 10px rgba(217,164,65,.18)!important;
  pointer-events:none!important;
}
#m7-global-home-feed-shell:after{
  content:none!important;
  display:none!important;
  background:none!important;
  box-shadow:none!important;
}
@media(max-width:600px){
  #m7-global-home-feed-shell{
    width:100%!important;
    margin:10px 0 0!important;
    padding:17px 10px 16px!important;
    border-radius:0!important;
  }
  #m7-global-home-feed-shell:before{
    left:8px!important;
    right:8px!important;
  }
}
/* Keep the original phone animations alive. */
@media(max-width:700px){
  .m7-live-status i,
  .m7-live-card,
  .m7-shop-avatar,
  .m7-shop-avatar:before,
  .m7-shop-avatar:after{
    -webkit-animation-play-state:running!important;
    animation-play-state:running!important;
  }
}
\n`; document.head.appendChild(style);
 const shell=document.createElement("div"); shell.id="m7-global-home-feed-shell"; shell.innerHTML=`<div id="m7-home-feed">\n  <section id="m7-live-home">\n    <div class="m7-live-head">\n      <div class="m7-live-top"><span class="m7-live-status"><i></i> LIVE</span><span id="m7-live-count">0 UPDATES</span></div>\n      <h2>🔥 Happening Today</h2>\n      <p id="m7-live-sub">Offers, events &amp; special things happening now</p>\n    </div>\n    <div id="m7-live-cards" class="m7-live-cards"><div class="m7-live-empty"><b>Loading live updates...</b></div></div>\n  </section>\n\n  <section class="ma7alak-reels-wrapper">\n    <div class="ma7alak-reels-title"><span>🎬</span><span>Reels</span></div>\n    <div class="ma7alak-reels"><div class="ma7alak-reel coming-soon-reel"><div class="coming-soon"><span>🎥</span><strong>New video coming soon</strong></div></div></div>\n    <div class="ma7alak-favorites-corner"><button id="ma7alakFavoritesButton" class="ma7alak-favorites-button" type="button"><span>⭐</span><span>Favorites</span><b id="ma7alakFavoritesCount">0</b></button></div>\n  </section>\n\n  <section id="ma7alak-home-shop-spotlight" class="m7hs" aria-label="ShoufHon local spotlight">\n    <header class="m7hs-head"><div><div class="m7hs-kicker">SHOUFHON SPOTLIGHT</div><h2>Local spotlight</h2></div><span class="m7hs-count">Loading…</span></header>\n    <div class="m7hs-empty"><strong>Loading local picks…</strong></div>\n  </section>\n</div>\n\n<div id="ma7alakReelViewer" class="ma7alak-reel-viewer" aria-hidden="true">\n  <button id="ma7alakReelViewerShop" class="ma7alak-reel-viewer-shop" type="button"><img id="ma7alakReelViewerShopIcon" src="" alt="Shop"><span><strong id="ma7alakReelViewerShopName">Shop</strong><small>View shop</small></span><em>→</em></button>\n  <button id="ma7alakReelViewerClose" class="ma7alak-reel-viewer-close" type="button">×</button>\n  <button id="ma7alakViewerFavorite" class="ma7alak-viewer-favorite" type="button" aria-label="Add to favorites">☆</button>\n  <video id="ma7alakReelViewerVideo" class="ma7alak-reel-viewer-video" playsinline webkit-playsinline loop preload="none"></video>\n  <div class="ma7alak-swipe-hint">↑ &nbsp; Swipe &nbsp; ↓</div>\n</div>`;
 const cfg={enabled:true};

 function m7HasVisibleBackground(el){
   if(!el||el===shell)return false;
   try{
     const cs=getComputedStyle(el);
     const img=String(cs.backgroundImage||"");
     const col=String(cs.backgroundColor||"");
     const hasImage=img&&img!=="none";
     const m=col.match(/rgba?\(([^)]+)\)/i);
     let alpha=1;
     if(m){
       const parts=m[1].split(",").map(v=>v.trim());
       if(parts.length>3)alpha=Number(parts[3]);
     }
     const r=el.getBoundingClientRect();
     return (hasImage||alpha>.02)&&r.width>=Math.min(innerWidth*.72,680)&&r.height>70;
   }catch(_){return false}
 }

 function m7FindHostingerBackgroundHost(hero){
   /* The Opening Header is injected BEFORE Hostinger's original page root.
      We must put the feed INSIDE Hostinger's real section/background,
      not beside it on BODY (which exposes the site's black body canvas). */
   let original=hero?.nextElementSibling||null;
   while(original===shell)original=original?.nextElementSibling||null;
   if(!original)return null;

   if(m7HasVisibleBackground(original))return original;

   const candidates=[...original.querySelectorAll("section,div")];
   for(const el of candidates){
     if(el.closest("#m7-global-home-feed-shell"))continue;
     if(m7HasVisibleBackground(el))return el;
   }

   /* Fallback: use the first real Hostinger content container.
      Even when Hostinger draws its background via a pseudo-element,
      descendants inherit that visual canvas because the feed is now
      physically inside the section instead of sitting on BODY. */
   return original.matches("main,section,div")?original:
          original.querySelector?.("main,section,div")||original;
 }

 function place(){
   shell.style.display=cfg.enabled===false?"none":"block";
   shell.style.setProperty("width","100%","important");
   shell.style.setProperty("max-width","100%","important");
   shell.style.setProperty("margin-top","12px","important");

   const hero=document.getElementById("ma7alak-opening-header-root");
   if(hero&&hero.parentNode){
     const host=m7FindHostingerBackgroundHost(hero);
     if(host){
       if(shell.parentNode!==host||host.firstElementChild!==shell){
         host.insertBefore(shell,host.firstElementChild);
       }
       return;
     }
   }

   const main=document.querySelector("main");
   if(main){
     if(shell.parentNode!==main||main.firstElementChild!==shell)main.insertBefore(shell,main.firstElementChild);
   }else if(!shell.isConnected){
     document.body.appendChild(shell);
   }
 }

 /* Hostinger can hydrate/rebuild the page after Custom Code first renders.
    Reinsert the SAME feed node if its Hostinger section gets replaced.
    Reusing the same node preserves all Reel/Live click handlers, observers,
    realtime subscriptions and mobile video behavior. */
 let m7PlacementTimer=null;
 function keepFeedMounted(){
   if(document.hidden)return;
   if(!style.isConnected&&document.head)document.head.appendChild(style);
   if(!shell.isConnected){
     place();
     return;
   }

   const hero=document.getElementById("ma7alak-opening-header-root");
   const wanted=hero?m7FindHostingerBackgroundHost(hero):null;
   if(wanted&&shell.parentNode!==wanted)place();
 }

 place();
 [80,300,800,1600,3000].forEach(ms=>setTimeout(place,ms));
 clearInterval(m7PlacementTimer);
 m7PlacementTimer=setInterval(keepFeedMounted,1200);
 window.addEventListener("pageshow",keepFeedMounted);
 window.addEventListener("focus",keepFeedMounted);
 window.addEventListener("popstate",keepFeedMounted);
 document.addEventListener("visibilitychange",()=>{
   if(document.visibilityState==="visible"){
     keepFeedMounted();
     setTimeout(keepFeedMounted,120);
     setTimeout(keepFeedMounted,600);
   }
 });

(function(){"use strict";
const SB_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",SB_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const sb=(window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||(window.Ma7alakSupabaseBootstrap&&window.Ma7alakSupabaseBootstrap.client)||(window.supabase&&window.supabase.createClient?window.supabase.createClient(SB_URL,SB_KEY):null));
if(!sb){console.error("SHOUFHON home feed: Supabase client unavailable");return;}
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
/* LIVE OFFERS */
const liveRoot=document.getElementById("m7-live-home"),liveCards=document.getElementById("m7-live-cards"),liveSub=document.getElementById("m7-live-sub"),liveCount=document.getElementById("m7-live-count");let livePosts=[],liveSignature="";const LIVE_TIME_ZONE="Asia/Beirut";
function remain(date){let s=Math.max(0,Math.floor((new Date(date)-Date.now())/1000)),d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60),q=s%60;return d?`${d}d ${h}h ${m}m`:[h,m,q].map(v=>String(v).padStart(2,"0")).join(":")}
function started(x){let s=Math.floor((Date.now()-new Date(x.starts_at))/1000);if(s<0)return"Starts in "+remain(x.starts_at);if(s<60)return`Started ${s}s ago`;let m=Math.floor(s/60);if(m<60)return`Started ${m}m ago`;let h=Math.floor(m/60);return h<24?`Started ${h}h ${m%60}m ago`:`Started ${Math.floor(h/24)}d ago`}
function beirutParts(value){let parts=new Intl.DateTimeFormat("en-CA",{timeZone:LIVE_TIME_ZONE,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(value)),o={};parts.forEach(p=>o[p.type]=p.value);return o}
function beirutDay(value){let p=beirutParts(value);return Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day))/86400000}
function friendlyDate(value){let d=new Date(value),diff=beirutDay(d)-beirutDay(Date.now()),day=diff===0?"Today":diff===1?"Tomorrow":new Intl.DateTimeFormat("en-US",{timeZone:LIVE_TIME_ZONE,weekday:"short",month:"short",day:"numeric"}).format(d),time=new Intl.DateTimeFormat("en-US",{timeZone:LIVE_TIME_ZONE,hour:"numeric",minute:"2-digit",hour12:true}).format(d);return`${day} • ${time}`}
function startedFrom(value){let s=Math.max(0,Math.floor((Date.now()-new Date(value))/1000));if(s<60)return`Started ${s}s ago`;let m=Math.floor(s/60);if(m<60)return`Started ${m}m ago`;let h=Math.floor(m/60);return h<24?`Started ${h}h ${m%60}m ago`:`Started ${Math.floor(h/24)}d ago`}
function scheduleHTML(start,end){let future=new Date(start)>Date.now();return future?`<b>📅 Starts ${friendlyDate(start)}</b><small>⏳ ${remain(start)} until start</small><span>Ends ${friendlyDate(end)} · Lebanon time</span>`:`<b>🟢 Live now</b><small>${startedFrom(start)} · ${remain(end)} remaining</small><span>Ends ${friendlyDate(end)} · Lebanon time</span>`}
function updateLiveTimers(){liveCards.querySelectorAll(".m7-live-schedule").forEach(el=>{el.innerHTML=scheduleHTML(el.dataset.start,el.dataset.end)})}
function getLiveSignature(list){return JSON.stringify(list.map(x=>[x.id,x.post_type,x.title,x.shop_slug,x.shop_name,x.profile_image_url,x.media_url,x.media_type,x.original_price,x.offer_price,x.starts_at,x.ends_at,x.status]))}
const liveMeta=t=>({offer:"🏷️ OFFER",happening:"🟢 HAPPENING NOW",arrival:"✨ NEW ARRIVAL",event:"📅 EVENT"}[t]||"⚡ LIVE");
function liveMedia(x){if(!x.media_url)return"";return x.media_type==="video"?`<video class="m7-live-media" data-src="${esc(x.media_url)}" muted loop playsinline preload="none"></video>`:`<img class="m7-live-media" src="${esc(x.media_url)}" alt="" loading="lazy" decoding="async">`}
function liveAvatar(x){let name=String(x.shop_name||x.shop_slug||"Shop"),letter=esc(name.charAt(0).toUpperCase());return`<div class="m7-shop-avatar">${x.profile_image_url?`<img src="${esc(x.profile_image_url)}" alt="${esc(name)}" onerror="this.outerHTML='<span class=&quot;m7-avatar-fallback&quot;>${letter}</span>'">`:`<span class="m7-avatar-fallback">${letter}</span>`}</div>`}
function renderLive(){let n=livePosts.length;liveRoot.classList.toggle("m7-live-active",n>0);liveRoot.classList.toggle("m7-live-empty-state",n===0);liveCount.textContent=`${n} ${n===1?"UPDATE":"UPDATES"}`;if(!n){liveSub.textContent="Check back for new offers, events & updates";liveCards.innerHTML="";liveCards.hidden=true;return}liveCards.hidden=false;liveSub.textContent=n===1?"1 update happening now":`${n} updates — swipe to see more`;liveCards.innerHTML=livePosts.map(x=>{let price=x.post_type==="offer"&&(x.original_price!=null||x.offer_price!=null)?`<div class="m7-live-price">${x.original_price!=null?`<span class="m7-live-old">$${esc(x.original_price)}</span>`:""}${x.offer_price!=null?`$${esc(x.offer_price)}`:""}</div>`:"";return`<article class="m7-live-card" data-live-id="${esc(x.id)}">${liveMedia(x)}<div class="m7-live-copy"><span class="m7-live-badge">${liveMeta(x.post_type)}</span><div class="m7-live-title">${esc(x.title)}</div><div class="m7-shop-line">${liveAvatar(x)}<div class="m7-shop-info"><div class="m7-shop-name">${esc(x.shop_name||x.shop_slug)}</div><div class="m7-shop-now">● LIVE NOW</div></div></div>${price}<div class="m7-live-times"><div class="m7-live-schedule" data-start="${esc(x.starts_at)}" data-end="${esc(x.ends_at)}"></div></div></div></article>`}).join("");liveCards.querySelectorAll("[data-live-id]").forEach(c=>c.onclick=()=>window.postMessage({type:"MA7ALAK_LIVE_OFFERS_VIEW",id:c.dataset.liveId},"*"));updateLiveTimers()}
addEventListener("message",e=>{let d=e.data||{};if((d.type==="MA7ALAK_LIVE_OFFERS_STATE"&&!d.shopSlug)||d.type==="MA7ALAK_LIVE_OFFERS_UPDATED"){let next=Array.isArray(d.items)?d.items:[],signature=getLiveSignature(next);livePosts=next;if(signature!==liveSignature){liveSignature=signature;renderLive()}else updateLiveTimers()}if(d.type==="MA7ALAK_OPEN_REELS")openRandomReel()});function requestLive(){window.postMessage({type:"MA7ALAK_LIVE_OFFERS_GET",shopSlug:""},"*")}requestLive();setTimeout(requestLive,300);setTimeout(requestLive,1000);setInterval(updateLiveTimers,1000);
const liveMediaObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 const v=entry.target;
 if(entry.isIntersecting&&!document.hidden){
   if(!v.dataset.m7Loaded&&v.dataset.src){
     v.src=v.dataset.src;
     v.dataset.m7Loaded="1";
     v.load();
   }
   v.muted=true;
   v.play().catch(()=>{})
 }else{
   v.pause();
   v.muted=true
 }
}),{rootMargin:"120px 0px",threshold:.01});
function observeLiveMedia(){document.querySelectorAll("#m7-live-home video").forEach(v=>{if(!v.dataset.m7Observed){v.dataset.m7Observed="1";liveMediaObserver.observe(v)}})}
new MutationObserver(observeLiveMedia).observe(liveCards,{childList:true,subtree:true});
observeLiveMedia();
/* LOCAL SPOTLIGHT — integrated with the same homepage feed + Supabase client. */
window.__M7_HOME_SPOTLIGHT__=true;
const spotlightRoot=document.getElementById("ma7alak-home-shop-spotlight");
let spotlightRows=[],spotlightChannel=null,spotlightTimer=null,spotlightInteracting=false,spotlightSignature="";
const spotlightSafeUrl=v=>{try{const u=new URL(v,location.href);return /^https?:$/.test(u.protocol)?u.href:""}catch(_){return""}};
function spotlightFeatured(s){if(!s.featured)return false;const end=s.directory_options?.featured_until;return !end||new Date(end)>new Date()}
function spotlightShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function spotlightGo(s){const href=spotlightSafeUrl(s.shop_url)||`https://shoufhon.com/${encodeURIComponent(s.shop_slug)}`;window.location.href=href}
function spotlightClearAuto(){if(spotlightTimer){clearTimeout(spotlightTimer);spotlightTimer=null}}
function spotlightScheduleAuto(delay=4000){spotlightClearAuto();const track=spotlightRoot?.querySelector(".m7hs-track");if(!track||spotlightRows.length<2||document.hidden||spotlightInteracting)return;spotlightTimer=setTimeout(()=>{spotlightTimer=null;if(document.hidden||spotlightInteracting){spotlightScheduleAuto(4000);return}const width=track.firstElementChild?.getBoundingClientRect().width||0,max=Math.max(0,track.scrollWidth-track.clientWidth);if(track.scrollLeft>=max-10)track.scrollTo({left:0,behavior:"smooth"});else track.scrollBy({left:width+12,behavior:"smooth"});spotlightScheduleAuto(4000)},delay)}
function spotlightBindAuto(){const track=spotlightRoot?.querySelector(".m7hs-track");if(!track||track.dataset.m7AutoBound==="1")return;track.dataset.m7AutoBound="1";const begin=()=>{spotlightInteracting=true;spotlightClearAuto()},end=()=>{spotlightInteracting=false;spotlightScheduleAuto(4000)};track.addEventListener("pointerdown",begin,{passive:true});track.addEventListener("pointerup",end,{passive:true});track.addEventListener("pointercancel",end,{passive:true});track.addEventListener("touchstart",begin,{passive:true});track.addEventListener("touchend",end,{passive:true});track.addEventListener("touchcancel",end,{passive:true});track.addEventListener("wheel",()=>{spotlightInteracting=false;spotlightScheduleAuto(4000)},{passive:true});track.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key))spotlightScheduleAuto(4000)})}
function renderSpotlight(){if(!spotlightRoot)return;const cards=spotlightRows.map(s=>{const o=s.directory_options||{},featured=spotlightFeatured(s),cover=spotlightSafeUrl(o.cover||s.main_image_url||s.intro_poster_url||s.profile_image_url),avatar=spotlightSafeUrl(s.profile_image_url),accent=/^#[0-9a-f]{6}$/i.test(o.home_spotlight_accent||"")?o.home_spotlight_accent:(o.story_color||"#e3b85f"),label=o.home_spotlight_label||(featured?"FEATURED":"NEW"),about=o.home_spotlight_about||s.about_text||`Discover ${s.shop_name} on ShoufHon.`,locationText=s.location||s.area||s.city||"Lebanon";return `<article class="m7hs-card ${featured?"featured":""}" data-slug="${esc(s.shop_slug)}" style="--accent:${esc(accent)}" tabindex="0" role="link">${cover?`<img class="m7hs-cover" src="${esc(cover)}" alt="" loading="lazy" decoding="async">`:""}<span class="m7hs-ribbon">${esc(label)}</span><div class="m7hs-body"><div class="m7hs-profile">${avatar?`<img src="${esc(avatar)}" alt="" loading="lazy" decoding="async">`:'<span class="m7hs-fallback">✦</span>'}<div><strong>${esc(s.shop_name)}</strong><small>${esc(s.category_name||s.category||"Local business")}</small></div></div><p class="m7hs-about">${esc(about)}</p><div class="m7hs-bottom"><span class="m7hs-location">⌖ ${esc(locationText)}</span><button class="m7hs-button" type="button">${esc(o.home_spotlight_cta||"Discover shop")} →</button></div></div></article>`}).join("");spotlightRoot.innerHTML=`<header class="m7hs-head"><div><div class="m7hs-kicker">SHOUFHON SPOTLIGHT</div><h2>Local spotlight</h2></div><span class="m7hs-count">${spotlightRows.length} ${spotlightRows.length===1?"shop":"shops"} · swipe</span></header>${cards?`<div class="m7hs-track">${cards}</div>`:'<div class="m7hs-empty"><strong>Fresh local picks are coming</strong>Featured and new shops will appear here automatically.</div>'}`;spotlightRoot.querySelectorAll("[data-slug]").forEach((card,i)=>{card.onclick=e=>{e.preventDefault();spotlightGo(spotlightRows[i])};card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();spotlightGo(spotlightRows[i])}}});spotlightBindAuto();spotlightScheduleAuto(4000)}
async function loadSpotlight(){if(!spotlightRoot)return;const r=await sb.from("shop_profiles").select("shop_slug,shop_name,shop_url,profile_image_url,main_image_url,intro_poster_url,category,category_name,city,area,location,about_text,featured,is_active,directory_options").eq("is_active",true);if(r.error){console.warn("Homepage spotlight:",r.error);return}let next=(r.data||[]).filter(s=>spotlightFeatured(s)||String(s.directory_options?.badge||"").toLowerCase()==="new"),signature=JSON.stringify(next.map(s=>[s.shop_slug,s.shop_name,s.shop_url,s.profile_image_url,s.main_image_url,s.intro_poster_url,s.category,s.category_name,s.city,s.area,s.location,s.about_text,s.featured,s.directory_options]));if(signature===spotlightSignature&&spotlightRows.length===next.length)return;spotlightSignature=signature;spotlightRows=spotlightShuffle(next.slice());renderSpotlight()}
loadSpotlight();
spotlightChannel=sb.channel("home-shop-spotlight-feed").on("postgres_changes",{event:"*",schema:"public",table:"shop_profiles"},loadSpotlight).subscribe();
document.addEventListener("visibilitychange",()=>{if(document.hidden)spotlightClearAuto();else{loadSpotlight();spotlightScheduleAuto(4000)}});

/* REELS */
const reelsContainer=document.querySelector(".ma7alak-reels"),viewer=document.getElementById("ma7alakReelViewer"),viewerVideo=document.getElementById("ma7alakReelViewerVideo"),viewerClose=document.getElementById("ma7alakReelViewerClose"),viewerShop=document.getElementById("ma7alakReelViewerShop"),viewerName=document.getElementById("ma7alakReelViewerShopName"),viewerIcon=document.getElementById("ma7alakReelViewerShopIcon"),viewerFav=document.getElementById("ma7alakViewerFavorite"),favCount=document.getElementById("ma7alakFavoritesCount");let reels=[],viewerIndex=0,favoriteIds=new Set(),channel,loading=false,lastRandom=null,reelDataSignature="";
let visitorId=localStorage.getItem("ma7alak_visitor_id");if(!visitorId){visitorId=crypto.randomUUID();localStorage.setItem("ma7alak_visitor_id",visitorId)}
function refreshReels(){reels=[...document.querySelectorAll(".ma7alak-reel[data-reel-id]")];return reels}
function card(row){let d=document.createElement("div");d.className="ma7alak-reel";d.dataset.reelId=row.reel_id;d.dataset.shopName=row.shop_name||"Shop";d.dataset.shopUrl=row.shop_url||"";d.dataset.shopIcon=row.shop_icon||"";d.dataset.videoUrl=row.video_url||"";d.innerHTML=`<video class="ma7alak-video" muted loop playsinline webkit-playsinline preload="none"></video><div class="reel-info" role="link" tabindex="0"><img class="reel-shop-icon" src="${esc(row.shop_icon||"")}" alt="${esc(row.shop_name||"Shop")}" loading="lazy" decoding="async"><div class="reel-info-text"><strong>${esc(row.shop_name||"Shop")}</strong><span>${esc(row.caption||"")}</span></div></div>`;return d}
function ensureCardVideo(v){if(!v||v.dataset.m7Loaded==="1")return;let reel=v.closest(".ma7alak-reel"),src=reel?.dataset.videoUrl||"";if(!src)return;v.src=src;v.dataset.m7Loaded="1";v.load()}
function bindCard(reel){let v=reel.querySelector("video"),info=reel.querySelector(".reel-info"),sx=0,sy=0,swiped=false;v.draggable=false;v.addEventListener("timeupdate",()=>{if(!viewer.classList.contains("open")&&v.currentTime>=1){v.currentTime=0;v.play().catch(()=>{})}});v.addEventListener("touchstart",e=>{sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY;swiped=false},{passive:true});v.addEventListener("touchmove",e=>{let t=e.changedTouches[0];if(Math.abs(t.clientX-sx)>10&&Math.abs(t.clientX-sx)>Math.abs(t.clientY-sy))swiped=true},{passive:true});v.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();if(swiped){swiped=false;return}openViewer(reel)});let openShop=e=>{e.preventDefault();e.stopPropagation();if(reel.dataset.shopUrl)window.top.location.href=reel.dataset.shopUrl};info.onclick=openShop;info.onkeydown=e=>{if(e.key==="Enter"||e.key===" ")openShop(e)};observer.observe(v)}
async function loadReels(){if(loading)return;loading=true;try{let r=await sb.from("shop_reels").select("reel_id,shop_slug,shop_name,shop_url,shop_icon,video_url,caption,created_at").eq("active",true).order("created_at",{ascending:false});if(r.error)throw r.error;let rows=(r.data||[]).slice();let nextSignature=JSON.stringify(rows.map(x=>[x.reel_id,x.shop_slug,x.shop_name,x.shop_url,x.shop_icon,x.video_url,x.caption,x.created_at]));if(nextSignature===reelDataSignature&&reelsContainer.querySelectorAll("[data-reel-id]").length===rows.length){refreshReels();sendReelsState();return}reelDataSignature=nextSignature;reelsContainer.querySelectorAll("[data-reel-id]").forEach(n=>n.remove());if(!window.__M7_REELS_SHUFFLED__){for(let i=rows.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]]}window.__M7_REELS_SHUFFLED__=1;window.__M7_REEL_ORDER__=rows.map(x=>String(x.reel_id))}else{let order=window.__M7_REEL_ORDER__||[],pos=new Map(order.map((id,i)=>[id,i]));rows.sort((a,b)=>(pos.has(String(a.reel_id))?pos.get(String(a.reel_id)): -1)-(pos.has(String(b.reel_id))?pos.get(String(b.reel_id)): -1));window.__M7_REEL_ORDER__=rows.map(x=>String(x.reel_id))}let soon=reelsContainer.querySelector(".coming-soon-reel");rows.forEach(row=>{let c=card(row);reelsContainer.insertBefore(c,soon);bindCard(c)});refreshReels();sendReelsState()}catch(e){console.error("Live Reels:",e)}finally{loading=false}}
function updateViewerFav(){let r=reels[viewerIndex];if(!r)return;let on=favoriteIds.has(r.dataset.reelId);viewerFav.classList.toggle("active",on);viewerFav.textContent=on?"★":"☆"}
function stopCards(){document.querySelectorAll(".ma7alak-video").forEach(v=>{v.pause();v.muted=true})}
function loadViewer(reel,direction){
  let src=reel?.dataset.videoUrl||"";
  if(!src)return;
  if(viewer.parentNode!==document.body)document.body.appendChild(viewer);
  document.documentElement.classList.add("m7-reel-open");
  document.body.classList.add("m7-reel-open");
  viewerIndex=reels.indexOf(reel);
  viewerName.textContent=reel.dataset.shopName||"Shop";
  viewerShop.dataset.shopUrl=reel.dataset.shopUrl||"";
  viewerIcon.src=reel.dataset.shopIcon||"";
  viewerIcon.style.display=reel.dataset.shopIcon?"block":"none";

  viewerVideo.pause();
  viewerVideo.removeAttribute("src");
  viewerVideo.load();

  viewerVideo.style.opacity="0";
  viewerVideo.style.transform=
    direction==="next"
      ?"translateY(55px) scale(.985)"
      :direction==="prev"
        ?"translateY(-55px) scale(.985)"
        :"none";

  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden","false");
  updateViewerFav();

  let revealed=false;
  const reveal=()=>{
    if(revealed)return;
    revealed=true;
    viewerVideo.style.opacity="1";
    viewerVideo.style.transform="none";
  };

  const startPlayback=()=>{
    reveal();
    viewerVideo.muted=false;
    const p=viewerVideo.play();
    if(p&&typeof p.catch==="function"){
      p.catch(()=>{
        viewerVideo.muted=true;
        viewerVideo.play().catch(()=>{});
      });
    }
  };

  viewerVideo.addEventListener("loadeddata",startPlayback,{once:true});
  viewerVideo.addEventListener("canplay",startPlayback,{once:true});
  viewerVideo.addEventListener("error",()=>{
    reveal();
    console.error("SHOUFHON Reel viewer video failed:",src);
  },{once:true});

  viewerVideo.src=src;
  viewerVideo.load();

  viewerVideo.muted=false;
  const immediatePlay=viewerVideo.play();
  if(immediatePlay&&typeof immediatePlay.catch==="function"){
    immediatePlay.catch(()=>{
      viewerVideo.muted=true;
      viewerVideo.play().catch(()=>{});
    });
  }

  if(viewerVideo.readyState>=2)startPlayback();
}
let reelNativeFullscreenOwned=false;

function reelFullscreenElement(){
  return document.fullscreenElement||document.webkitFullscreenElement||null;
}

function requestReelNativeFullscreen(){
  if(!viewer||reelFullscreenElement())return;

  try{
    const request=
      viewer.requestFullscreen||
      viewer.webkitRequestFullscreen;

    if(typeof request!=="function")return;

    reelNativeFullscreenOwned=true;

    const result=request.call(viewer);
    if(result&&typeof result.catch==="function"){
      result.catch(()=>{
        reelNativeFullscreenOwned=false;
      });
    }
  }catch(_){
    reelNativeFullscreenOwned=false;
  }
}

function exitReelNativeFullscreen(){
  if(!reelNativeFullscreenOwned)return;
  reelNativeFullscreenOwned=false;

  try{
    if(document.fullscreenElement&&document.exitFullscreen){
      const result=document.exitFullscreen();
      if(result&&typeof result.catch==="function")result.catch(()=>{});
    }else if(document.webkitFullscreenElement&&document.webkitExitFullscreen){
      document.webkitExitFullscreen();
    }
  }catch(_){}
}

function openViewer(reel){
  refreshReels();
  stopCards();

  if(!reel?.dataset.videoUrl)return;

  if(viewer.parentNode!==document.body){
    document.body.appendChild(viewer);
  }

  /* Must happen directly inside the user's tap. This is what lets
     Chrome/Brave hide their browser chrome instead of only showing
     a CSS overlay below the address bar. */
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden","false");
  requestReelNativeFullscreen();

  loadViewer(reel);
}

function moveViewer(step){
  refreshReels();
  if(!reels.length)return;
  viewerIndex=(viewerIndex+step+reels.length)%reels.length;
  stopCards();
  loadViewer(reels[viewerIndex],step>0?"next":"prev");
}

function closeViewer(){
  document.documentElement.classList.remove("m7-reel-open");
  document.body.classList.remove("m7-reel-open");
  viewerVideo.pause();
  viewerVideo.muted=true;
  viewerVideo.removeAttribute("src");
  viewerVideo.load();
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden","true");
  exitReelNativeFullscreen();

  let card=reels[viewerIndex],v=card?.querySelector("video");
  if(card&&v){
    let r=card.getBoundingClientRect();
    if(r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth){
      ensureCardVideo(v);
      v.muted=true;
      v.play().catch(()=>{});
    }
  }
}

viewerClose.onclick=e=>{e.stopPropagation();closeViewer()};
viewerShop.onclick=e=>{e.stopPropagation();if(viewerShop.dataset.shopUrl)window.top.location.href=viewerShop.dataset.shopUrl};
viewerFav.onclick=async e=>{e.stopPropagation();let reel=reels[viewerIndex],id=reel?.dataset.reelId;if(!id)return;viewerFav.disabled=true;if(favoriteIds.has(id)){let r=await sb.from("ma7alak_favorites").delete().eq("visitor_id",visitorId).eq("reel_id",id);if(!r.error)favoriteIds.delete(id)}else{let r=await sb.from("ma7alak_favorites").insert({visitor_id:visitorId,reel_id:id,shop_name:reel.dataset.shopName});if(!r.error)favoriteIds.add(id)}viewerFav.disabled=false;updateViewerFav();await syncFavorites()};

let tx=0,ty=0,tt=0;
viewer.addEventListener("touchstart",e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY;tt=Date.now()},{passive:true});
viewer.addEventListener("touchend",e=>{let t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Date.now()-tt<700&&Math.abs(dy)>70&&Math.abs(dy)>Math.abs(dx))moveViewer(dy<0?1:-1)},{passive:true});
document.addEventListener("keydown",e=>{if(!viewer.classList.contains("open"))return;if(e.key==="Escape")closeViewer();if(e.key==="ArrowUp")moveViewer(1);if(e.key==="ArrowDown")moveViewer(-1)});

function onReelFullscreenChange(){
  if(
    reelNativeFullscreenOwned &&
    !reelFullscreenElement() &&
    viewer.classList.contains("open")
  ){
    reelNativeFullscreenOwned=false;
    closeViewer();
  }
}

document.addEventListener("fullscreenchange",onReelFullscreenChange);
document.addEventListener("webkitfullscreenchange",onReelFullscreenChange);
const observer=new IntersectionObserver(es=>es.forEach(e=>{let v=e.target;if(e.isIntersecting&&!viewer.classList.contains("open")&&!document.hidden){ensureCardVideo(v);v.muted=true;v.play().catch(()=>{})}else{v.pause();v.muted=true}}),{rootMargin:"80px 80px",threshold:.05});
async function syncFavorites(){let r=await sb.from("ma7alak_favorites").select("reel_id").eq("visitor_id",visitorId);if(!r.error){favoriteIds=new Set((r.data||[]).map(x=>String(x.reel_id)));favCount.textContent=favoriteIds.size;updateViewerFav()}}
document.getElementById("ma7alakFavoritesButton").onclick=e=>{e.preventDefault();let msg={type:"ma7alak-scroll-favorites"};try{window.postMessage(msg,"*")}catch(_){}try{let bc=new BroadcastChannel("ma7alak-favorites-navigation");bc.postMessage(msg);bc.close()}catch(_){}};
function reelsData(){return refreshReels().map(r=>({id:r.dataset.reelId,shop:r.dataset.shopName,shopUrl:r.dataset.shopUrl,icon:r.dataset.shopIcon,video:r.dataset.videoUrl||""}))}
function sendReelsState(){let data=reelsData();if(!data.length)return;window.postMessage({type:"MA7ALAK_REELS_STATE",source:"ma7alak-reels-embed",sentAt:Date.now(),reelIds:data.map(x=>[x.id,x.video,x.shopUrl].join("::")),reels:data},"*")}
function openRandomReel(){let a=refreshReels();if(!a.length)return;let candidates=a.length>1&&lastRandom?a.filter(r=>r.dataset.reelId!==lastRandom):a,reel=candidates[Math.floor(Math.random()*candidates.length)];lastRandom=reel.dataset.reelId;openViewer(reel)}
loadReels();syncFavorites();channel=sb.channel("ma7alak-combined-reels").on("postgres_changes",{event:"*",schema:"public",table:"shop_reels"},loadReels).subscribe();setInterval(()=>{if(!document.hidden)sendReelsState()},10000);document.addEventListener("visibilitychange",()=>{if(!document.hidden){loadReels();syncFavorites()}});
})();

 const client=window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||(window.Ma7alakSupabaseBootstrap&&window.Ma7alakSupabaseBootstrap.client);
 if(client){
   client.from("homepage_layout_settings").select("*").eq("key","live_offers_reels").maybeSingle().then(r=>{if(r.data){cfg.enabled=r.data.enabled!==false;place();}});
   client.channel("m7-original-home-layout").on("postgres_changes",{event:"*",schema:"public",table:"homepage_layout_settings",filter:"key=eq.live_offers_reels"},p=>{if(p.new){cfg.enabled=p.new.enabled!==false;place();}}).subscribe();
 }

}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",m7Mount,{once:true});else m7Mount();
})();