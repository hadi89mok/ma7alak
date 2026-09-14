/* =========================================================
   MA7ALAK — DOZE 3ALE COMPLETE GITHUB PAGE CODE
   ---------------------------------------------------------
   SINGLE FILE:
   ✓ Existing Doze Story system
   ✓ Existing Nutella jar orbit
   ✓ Existing chocolate premium identity design
   ✓ Existing Supabase Story/owner/like/view logic
   ✓ Crepe/chocolate full-page background merged into same file
   ✓ Hostinger global Custom Website Code compatible
   ✓ Runs ONLY on /doze-3ale

   Generated from the user's confirmed Doze code.
========================================================= */

(function(){
  "use strict";

  /* ---------------------------------------------------------
     HOSTINGER LIVE + EDITOR MODE
     ---------------------------------------------------------
     LIVE SITE:
       - Runs ONLY on /doze-3ale

     HOSTINGER EDITOR:
       - The editor renders the page inside an iframe.
       - We allow that iframe so the Doze design can be seen
         while editing.
       - Published pages still keep the exact route protection.
  --------------------------------------------------------- */

  const TARGET_PATH = "/doze-3ale";
  const APP_ID = "ma7alak-doze-github-app";
  const STORY_STYLE_ID = "ma7alak-doze-story-style";
  const BG_STYLE_ID = "ma7alak-doze-overlay-bg-style";
  const BG_ID = "ma7alak-doze-overlay-bg";

  function normalizePath(path){
    let p = String(path || "/").replace(/\/+/g, "/");
    if(p.length > 1 && p.endsWith("/")) p = p.slice(0,-1);
    return p;
  }

  const IS_IFRAME =
    window.self !== window.top;

  const CURRENT_PATH =
    normalizePath(window.location.pathname);

  const IS_LIVE_DOZE_PAGE =
    !IS_IFRAME &&
    CURRENT_PATH === TARGET_PATH;

  /*
     Hostinger editor preview is an iframe and may not expose the
     public /doze-3ale pathname inside that frame. Allow the iframe
     only for editor rendering. This exception never applies to a
     normal published top-level page.
  */
  const IS_HOSTINGER_EDITOR_FRAME =
    IS_IFRAME;

  if(!IS_LIVE_DOZE_PAGE && !IS_HOSTINGER_EDITOR_FRAME){
    return;
  }

  if(window.__MA7ALAK_DOZE_COMPLETE_GITHUB_LOADED__){
    return;
  }
  window.__MA7ALAK_DOZE_COMPLETE_GITHUB_LOADED__ = true;

  const STORY_CSS = "\n\n/* =========================================================\n   STORY WRAPPER\n========================================================= */\n\n#ma7alak-story-wrapper{\n\n  width:100%!important;\n\n  display:flex!important;\n\n  justify-content:center!important;\n  align-items:center!important;\n\n  margin:15px 0!important;\n\n  padding:0!important;\n\n  position:relative!important;\n\n  min-height:min(240px,calc(100vw - 92px))!important;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  border-radius:0!important;\n\n  box-shadow:none!important;\n\n  -webkit-box-shadow:none!important;\n\n  outline:none!important;\n\n  overflow:visible!important;\n\n  z-index:999999!important;\n\n}\n\n\n/* =========================================================\n   NEW STORY RING\n========================================================= */\n\n#ma7alak-story-new-ring{\n\n  position:absolute!important;\n\n  left:50%!important;\n  top:50%!important;\n\n  width:min(262px,calc(100vw - 70px))!important;\n  height:min(262px,calc(100vw - 70px))!important;\n\n  transform:\n    translate(-50%,-50%)\n    scale(.88);\n\n  border-radius:50%!important;\n\n  border:2px solid rgba(106,45,22,.72)!important;\n\n  background:transparent!important;\n\n  box-shadow:none!important;\n\n  pointer-events:none!important;\n\n  opacity:0;\n\n  z-index:1!important;\n\n  box-sizing:border-box!important;\n\n}\n\n/* =========================================================\n   NEW / UNSEEN STORY GOLD ORBIT RING\n   Visible and rotating only while this Story is still unseen.\n========================================================= */\n\n#ma7alak-story-active-ring{\n\n  position:absolute!important;\n\n  left:50%!important;\n  top:50%!important;\n\n  width:min(252px,calc(100vw - 80px))!important;\n  height:min(252px,calc(100vw - 80px))!important;\n\n  transform:translate(-50%,-50%);\n\n  border-radius:50%!important;\n\n  padding:4px!important;\n\n  pointer-events:none!important;\n\n  opacity:0;\n\n  z-index:3!important;\n\n  box-sizing:border-box!important;\n\n  background:\n    conic-gradient(\n      from 0deg,\n      rgba(106,45,22,.10) 0deg,\n      #3c150a 35deg,\n      #ffd97c 78deg,\n      #6a2d16 120deg,\n      rgba(106,45,22,.18) 165deg,\n      #f2d4bc 210deg,\n      #6a2d16 255deg,\n      #3c150a 310deg,\n      rgba(106,45,22,.10) 360deg\n    )!important;\n\n  -webkit-mask:\n    linear-gradient(#000 0 0) content-box,\n    linear-gradient(#000 0 0)!important;\n\n  -webkit-mask-composite:xor!important;\n  mask-composite:exclude!important;\n\n  filter:\n    drop-shadow(0 0 5px rgba(106,45,22,.50))\n    drop-shadow(0 0 12px rgba(106,45,22,.24))!important;\n\n}\n\n#ma7alak-story-wrapper.story-has-new\n#ma7alak-story-active-ring{\n\n  opacity:1;\n\n  animation:\n    ma7alakStoryGoldOrbit\n    2.8s\n    linear\n    infinite!important;\n\n  -webkit-animation:\n    ma7alakStoryGoldOrbit\n    2.8s\n    linear\n    infinite!important;\n\n}\n\n@keyframes ma7alakStoryGoldOrbit{\n  from{\n    transform:translate(-50%,-50%) rotate(0deg);\n  }\n  to{\n    transform:translate(-50%,-50%) rotate(360deg);\n  }\n}\n\n@-webkit-keyframes ma7alakStoryGoldOrbit{\n  from{\n    -webkit-transform:translate(-50%,-50%) rotate(0deg);\n  }\n  to{\n    -webkit-transform:translate(-50%,-50%) rotate(360deg);\n  }\n}\n\n\n\n/* =========================================================\n   NEW STORY ACTIVE\n========================================================= */\n\n#ma7alak-story-wrapper.story-has-new\n#ma7alak-story-new-ring{\n\n  opacity:1;\n\n  animation:\n    ma7alakNewStoryPulse\n    1.65s\n    ease-out\n    infinite;\n\n  -webkit-animation:\n    ma7alakNewStoryPulse\n    1.65s\n    ease-out\n    infinite;\n\n}\n\n\n/* =========================================================\n   NEW STORY PULSE\n========================================================= */\n\n@keyframes ma7alakNewStoryPulse{\n\n  0%{\n\n    transform:\n      translate(-50%,-50%)\n      scale(.88);\n\n    opacity:1;\n\n    border-width:3px;\n\n  }\n\n  55%{\n\n    transform:\n      translate(-50%,-50%)\n      scale(1.08);\n\n    opacity:.58;\n\n    border-width:2px;\n\n  }\n\n  100%{\n\n    transform:\n      translate(-50%,-50%)\n      scale(1.30);\n\n    opacity:0;\n\n    border-width:1px;\n\n  }\n\n}\n\n\n@-webkit-keyframes ma7alakNewStoryPulse{\n\n  0%{\n\n    -webkit-transform:\n      translate(-50%,-50%)\n      scale(.88);\n\n    opacity:1;\n\n    border-width:3px;\n\n  }\n\n  55%{\n\n    -webkit-transform:\n      translate(-50%,-50%)\n      scale(1.08);\n\n    opacity:.58;\n\n    border-width:2px;\n\n  }\n\n  100%{\n\n    -webkit-transform:\n      translate(-50%,-50%)\n      scale(1.30);\n\n    opacity:0;\n\n    border-width:1px;\n\n  }\n\n}\n\n\n/* =========================================================\n   STORY BUTTON\n========================================================= */\n\n#ma7alak-story-button{\n\n  position:relative!important;\n\n  width:min(240px,calc(100vw - 92px))!important;\n  height:min(240px,calc(100vw - 92px))!important;\n\n  padding:3px!important;\n\n  margin:0!important;\n\n  border-radius:50%!important;\n\n  border:3px solid #6a2d16!important;\n\n  background:transparent!important;\n\n  box-shadow:none!important;\n\n  -webkit-box-shadow:none!important;\n\n  filter:none!important;\n\n  cursor:pointer!important;\n\n  overflow:hidden!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  outline:none!important;\n\n  z-index:2!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n  box-sizing:border-box!important;\n\n  clip-path:\n    circle(50% at 50% 50%)!important;\n\n  -webkit-clip-path:\n    circle(50% at 50% 50%)!important;\n\n}\n\n\n/* =========================================================\n   REMOVE BUTTON EFFECTS\n========================================================= */\n\n#ma7alak-story-button::before,\n#ma7alak-story-button::after{\n\n  content:none!important;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  box-shadow:none!important;\n\n}\n\n\n#ma7alak-story-button:hover,\n#ma7alak-story-button:focus,\n#ma7alak-story-button:focus-visible,\n#ma7alak-story-button:active{\n\n  outline:none!important;\n\n  background:#111!important;\n\n  box-shadow:none!important;\n\n  -webkit-box-shadow:none!important;\n\n}\n\n\n/* =========================================================\n   STORY PREVIEW\n========================================================= */\n\n#ma7alak-story-preview{\n\n  width:100%!important;\n  height:100%!important;\n\n  margin:0!important;\n\n  padding:0!important;\n\n  border-radius:50%!important;\n\n  overflow:hidden!important;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  box-shadow:none!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n}\n\n\n#ma7alak-story-preview img{\n\n  width:100%!important;\n  height:100%!important;\n\n  object-fit:cover!important;\n\n  border-radius:50%!important;\n\n  border:none!important;\n\n  box-shadow:none!important;\n\n  display:block!important;\n\n}\n\n\n/* =========================================================\n   EMPTY CIRCLE\n   Permanent shop logo is used instead of Story media.\n========================================================= */\n\n.ma7alak-story-placeholder{\n\n  width:100%!important;\n  height:100%!important;\n\n  border-radius:50%!important;\n\n  display:block!important;\n\n  background:transparent!important;\n\n}\n\n\n/* =========================================================\n   OWNER PLUS\n========================================================= */\n\n#ma7alak-owner-add-story{\n\n  position:absolute!important;\n\n  width:28px!important;\n  height:28px!important;\n\n  right:calc(50% - 127px)!important;\n\n  bottom:8px!important;\n\n  border:2px solid #111!important;\n\n  border-radius:50%!important;\n\n  background:#6a2d16!important;\n\n  color:#111!important;\n\n  display:none;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  font-size:21px!important;\n\n  font-weight:900!important;\n\n  line-height:1!important;\n\n  padding:0!important;\n\n  margin:0!important;\n\n  cursor:pointer!important;\n\n  z-index:20!important;\n\n  box-shadow:\n    0 3px 12px rgba(0,0,0,.45)!important;\n\n  -webkit-box-shadow:\n    0 3px 12px rgba(0,0,0,.45)!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  outline:none!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n}\n\n\n#ma7alak-owner-add-story.visible{\n\n  display:flex!important;\n\n}\n\n\n#ma7alak-owner-add-story:active{\n\n  transform:scale(.90)!important;\n\n}\n\n\n/* =========================================================\n   FULL STORY\n========================================================= */\n\n#ma7alak-full-story{\n\n  position:fixed!important;\n\n  inset:0!important;\n\n  width:100vw!important;\n  height:100vh!important;\n\n  width:100dvw!important;\n  height:100dvh!important;\n\n  background:#000!important;\n\n  display:none;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  overflow:hidden!important;\n\n  z-index:2147483647!important;\n\n  margin:0!important;\n\n  padding:0!important;\n\n  box-sizing:border-box!important;\n\n  isolation:isolate;\n\n  border:none!important;\n\n  outline:none!important;\n\n}\n\n\n#ma7alak-full-story.active{\n\n  display:flex!important;\n\n}\n\n\n/* =========================================================\n   NATIVE FULLSCREEN\n========================================================= */\n\n#ma7alak-full-story:fullscreen{\n\n  width:100vw!important;\n  height:100vh!important;\n\n  background:#000!important;\n\n}\n\n\n#ma7alak-full-story:-webkit-full-screen{\n\n  width:100vw!important;\n  height:100vh!important;\n\n  background:#000!important;\n\n}\n\n\n/* =========================================================\n   STORY MEDIA\n========================================================= */\n\n#ma7alak-full-story-media{\n\n  position:absolute!important;\n\n  top:50%!important;\n  left:50%!important;\n\n  transform:\n    translate(-50%,-50%);\n\n  width:\n    calc(100vw - 24px)!important;\n\n  height:\n    calc(100vh - 24px)!important;\n\n  width:\n    calc(100dvw - 24px)!important;\n\n  height:\n    calc(100dvh - 24px)!important;\n\n  background:#000!important;\n\n  display:block!important;\n\n  overflow:hidden!important;\n\n  border-radius:24px!important;\n\n  box-sizing:border-box!important;\n\n  isolation:isolate;\n\n  border:none!important;\n\n  outline:none!important;\n\n}\n\n\n/* =========================================================\n   MEDIA LAYERS\n========================================================= */\n\n.ma7alak-story-media-layer{\n\n  position:absolute!important;\n\n  inset:0!important;\n\n  width:100%!important;\n  height:100%!important;\n\n  object-fit:contain!important;\n\n  background:#000!important;\n\n  border-radius:24px!important;\n\n  display:block!important;\n\n  opacity:0;\n\n  visibility:hidden;\n\n  transition:\n    opacity .32s ease;\n\n  will-change:opacity;\n\n  backface-visibility:hidden;\n\n  -webkit-backface-visibility:hidden;\n\n  transform:\n    translateZ(0);\n\n  z-index:1;\n\n  border:none!important;\n\n  outline:none!important;\n\n}\n\n\n.ma7alak-story-media-layer.active{\n\n  opacity:1;\n\n  visibility:visible;\n\n  z-index:2;\n\n}\n\n\n/* =========================================================\n   STORY SHOP NAME\n========================================================= */\n\n#ma7alak-story-shop-name{\n\n  position:absolute!important;\n\n  top:64px!important;\n\n  left:20px!important;\n\n  max-width:calc(100% - 130px)!important;\n\n  color:#fff!important;\n\n  font-family:\n    Arial,\n    \"Segoe UI\",\n    sans-serif!important;\n\n  font-size:16px!important;\n\n  font-weight:800!important;\n\n  line-height:22px!important;\n\n  white-space:nowrap!important;\n\n  overflow:hidden!important;\n\n  text-overflow:ellipsis!important;\n\n  text-shadow:\n    0 2px 10px rgba(0,0,0,.55)!important;\n\n  pointer-events:none!important;\n\n  z-index:125!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n/* =========================================================\n   STORY TIME\n========================================================= */\n\n#ma7alak-story-time{\n\n  position:absolute!important;\n\n  top:90px!important;\n\n  left:20px!important;\n\n  min-height:32px!important;\n\n  padding:\n    0 12px!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  border:\n    1px solid\n    rgba(255,255,255,.14)!important;\n\n  border-radius:18px!important;\n\n  background:\n    rgba(15,15,15,.68)!important;\n\n  color:\n    rgba(255,255,255,.88)!important;\n\n  font-family:\n    Arial,\n    \"Segoe UI\",\n    sans-serif!important;\n\n  font-size:11px!important;\n\n  font-weight:700!important;\n\n  line-height:32px!important;\n\n  white-space:nowrap!important;\n\n  backdrop-filter:blur(12px)!important;\n\n  -webkit-backdrop-filter:blur(12px)!important;\n\n  box-shadow:\n    0 5px 20px rgba(0,0,0,.28)!important;\n\n  pointer-events:none!important;\n\n  z-index:125!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n/* =========================================================\n   OWNER DELETE BUTTON\n========================================================= */\n\n#ma7alak-story-delete-btn{\n\n  position:absolute!important;\n\n  top:106px!important;\n\n  right:20px!important;\n\n  width:48px!important;\n\n  height:48px!important;\n\n  display:none!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  border:\n    1px solid\n    rgba(255,255,255,.13)!important;\n\n  border-radius:50%!important;\n\n  background:\n    rgba(20,20,20,.72)!important;\n\n  color:#fff!important;\n\n  font-size:20px!important;\n\n  line-height:1!important;\n\n  padding:0!important;\n\n  margin:0!important;\n\n  cursor:pointer!important;\n\n  z-index:125!important;\n\n  backdrop-filter:blur(10px)!important;\n\n  -webkit-backdrop-filter:blur(10px)!important;\n\n  outline:none!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n#ma7alak-story-delete-btn.visible{\n\n  display:flex!important;\n\n}\n\n\n#ma7alak-story-delete-btn:hover{\n\n  background:\n    rgba(150,25,25,.78)!important;\n\n  border-color:\n    rgba(255,90,90,.35)!important;\n\n}\n\n\n#ma7alak-story-delete-btn:active{\n\n  transform:scale(.90)!important;\n\n  background:\n    rgba(180,25,25,.88)!important;\n\n}\n\n\n/* =========================================================\n   DESKTOP STORY\n========================================================= */\n\n@media(min-width:601px){\n\n  #ma7alak-full-story-media{\n\n    width:\n      min(\n        520px,\n        calc(100vw - 40px)\n      )!important;\n\n    height:\n      min(\n        900px,\n        calc(100vh - 30px)\n      )!important;\n\n    width:\n      min(\n        520px,\n        calc(100dvw - 40px)\n      )!important;\n\n    height:\n      min(\n        900px,\n        calc(100dvh - 30px)\n      )!important;\n\n    border-radius:26px!important;\n\n  }\n\n\n  .ma7alak-story-media-layer{\n\n    border-radius:26px!important;\n\n  }\n\n}\n\n\n/* =========================================================\n   MOBILE\n========================================================= */\n\n@media(max-width:600px){\n\n  #ma7alak-story-wrapper{\n\n    min-height:min(240px,calc(100vw - 92px))!important;\n\n    margin:18px 0!important;\n\n  }\n\n\n  #ma7alak-story-button{\n\n    width:calc(100vw - 92px)!important;\n\n    max-width:240px!important;\n\n    height:calc(100vw - 92px)!important;\n\n    max-height:240px!important;\n\n  }\n\n\n  #ma7alak-story-new-ring{\n\n    width:calc(100vw - 70px)!important;\n\n    max-width:262px!important;\n\n    height:calc(100vw - 70px)!important;\n\n    max-height:262px!important;\n\n  }\n\n  #ma7alak-story-active-ring{\n\n    width:calc(100vw - 80px)!important;\n\n    max-width:252px!important;\n\n    height:calc(100vw - 80px)!important;\n\n    max-height:252px!important;\n\n  }\n\n\n\n  #ma7alak-owner-add-story{\n\n    width:34px!important;\n\n    height:34px!important;\n\n    right:calc(50% - 125px)!important;\n\n    bottom:6px!important;\n\n    font-size:24px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     STORY VIEWER\n  ----------------------------------------- */\n\n  #ma7alak-full-story-media{\n\n    width:\n      calc(100vw - 12px)!important;\n\n    height:\n      calc(100vh - 12px)!important;\n\n    width:\n      calc(100dvw - 12px)!important;\n\n    height:\n      calc(100dvh - 12px)!important;\n\n    border-radius:20px!important;\n\n  }\n\n\n  .ma7alak-story-media-layer{\n\n    border-radius:20px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     SHOP NAME\n  ----------------------------------------- */\n\n  #ma7alak-story-shop-name{\n\n    top:54px!important;\n\n    left:14px!important;\n\n    max-width:calc(100% - 105px)!important;\n\n    font-size:15px!important;\n\n    line-height:21px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     TIME\n  ----------------------------------------- */\n\n  #ma7alak-story-time{\n\n    top:80px!important;\n\n    left:14px!important;\n\n    min-height:30px!important;\n\n    padding:\n      0 10px!important;\n\n    font-size:10px!important;\n\n    line-height:30px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     DELETE\n  ----------------------------------------- */\n\n  #ma7alak-story-delete-btn{\n\n    top:106px!important;\n\n    right:14px!important;\n\n    width:44px!important;\n\n    height:44px!important;\n\n    font-size:18px!important;\n\n  }\n\n}\n\n\n/* =========================================================\n   VERY SMALL PHONES\n========================================================= */\n\n@media(max-width:380px){\n\n  #ma7alak-story-button{\n\n    width:calc(100vw - 64px)!important;\n    max-width:250px!important;\n    height:calc(100vw - 64px)!important;\n    max-height:250px!important;\n\n  }\n\n\n  #ma7alak-story-new-ring{\n\n    width:calc(100vw - 42px)!important;\n    max-width:252px!important;\n    height:calc(100vw - 42px)!important;\n    max-height:252px!important;\n\n  }\n\n\n  #ma7alak-owner-add-story{\n\n    right:14px!important;\n\n  }\n\n\n  #ma7alak-story-delete-btn{\n\n    top:104px!important;\n\n    right:14px!important;\n\n    width:42px!important;\n\n    height:42px!important;\n\n  }\n\n}\n\n\n/* =========================================================\n   STORY LIKE BUTTON\n========================================================= */\n\n#ma7alak-story-like-btn{\n\n  position:absolute!important;\n  left:50%!important;\n  bottom:34px!important;\n  transform:translateX(-50%)!important;\n\n  width:56px!important;\n  min-width:56px!important;\n  height:56px!important;\n  padding:0!important;\n  margin:0!important;\n\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n\n  border:1px solid rgba(255,255,255,.28)!important;\n  border-radius:50%!important;\n  background:linear-gradient(145deg,rgba(28,28,31,.86),rgba(8,8,10,.72))!important;\n  color:rgba(255,255,255,.96)!important;\n\n  font-family:Arial,\"Segoe UI\",sans-serif!important;\n  font-size:30px!important;\n  line-height:1!important;\n  font-weight:400!important;\n\n  backdrop-filter:blur(18px) saturate(140%)!important;\n  -webkit-backdrop-filter:blur(18px) saturate(140%)!important;\n  box-shadow:\n    0 10px 30px rgba(0,0,0,.38),\n    inset 0 1px 0 rgba(255,255,255,.18),\n    inset 0 -1px 0 rgba(0,0,0,.35)!important;\n\n  cursor:pointer!important;\n  z-index:2147483646!important;\n  outline:none!important;\n  appearance:none!important;\n  -webkit-appearance:none!important;\n  -webkit-tap-highlight-color:transparent!important;\n  box-sizing:border-box!important;\n  pointer-events:auto!important;\n  touch-action:manipulation!important;\n  transition:\n    transform .18s ease,\n    border-color .22s ease,\n    box-shadow .22s ease,\n    background .22s ease!important;\n}\n\n#ma7alak-story-like-btn::before{\n  content:\"\"!important;\n  position:absolute!important;\n  inset:-3px!important;\n  border-radius:50%!important;\n  border:1px solid rgba(106,45,22,.28)!important;\n  pointer-events:none!important;\n  opacity:.8!important;\n}\n\n#ma7alak-story-like-btn .ma7alak-like-heart{\n  display:block!important;\n  position:relative!important;\n  z-index:1!important;\n  font-size:30px!important;\n  line-height:1!important;\n  transform:translateY(1px)!important;\n  text-shadow:0 2px 10px rgba(0,0,0,.35)!important;\n  transition:\n    transform .18s ease,\n    color .22s ease,\n    text-shadow .22s ease!important;\n}\n\n#ma7alak-story-like-btn.liked{\n  color:#ff4b67!important;\n  border-color:rgba(255,92,115,.72)!important;\n  background:linear-gradient(145deg,rgba(62,17,28,.94),rgba(22,8,14,.9))!important;\n  box-shadow:\n    0 10px 34px rgba(0,0,0,.42),\n    0 0 24px rgba(255,64,91,.22),\n    inset 0 1px 0 rgba(255,255,255,.14),\n    inset 0 -1px 0 rgba(0,0,0,.35)!important;\n}\n\n#ma7alak-story-like-btn.liked::before{\n  border-color:rgba(255,92,115,.5)!important;\n}\n\n#ma7alak-story-like-btn.liked .ma7alak-like-heart{\n  color:#ff4b67!important;\n  text-shadow:\n    0 0 12px rgba(255,64,91,.42),\n    0 2px 10px rgba(0,0,0,.3)!important;\n  animation:ma7alakHeartPop .32s ease-out!important;\n}\n\n#ma7alak-story-like-btn:active{\n  transform:translateX(-50%) scale(.9)!important;\n}\n\n#ma7alak-story-like-btn:hover{\n  border-color:rgba(255,255,255,.42)!important;\n  box-shadow:\n    0 12px 34px rgba(0,0,0,.42),\n    0 0 18px rgba(106,45,22,.10),\n    inset 0 1px 0 rgba(255,255,255,.2)!important;\n}\n\n#ma7alak-story-like-btn.liked:hover{\n  border-color:rgba(255,92,115,.86)!important;\n  box-shadow:\n    0 12px 36px rgba(0,0,0,.44),\n    0 0 28px rgba(255,64,91,.28),\n    inset 0 1px 0 rgba(255,255,255,.16)!important;\n}\n\n#ma7alak-story-like-btn:disabled{\n  cursor:default!important;\n  opacity:.72!important;\n}\n\n@keyframes ma7alakHeartPop{\n  0%{transform:translateY(1px) scale(.72);}\n  55%{transform:translateY(1px) scale(1.18);}\n  100%{transform:translateY(1px) scale(1);}\n}\n\n@media(max-width:600px){\n  #ma7alak-story-like-btn{\n    bottom:28px!important;\n    width:54px!important;\n    min-width:54px!important;\n    height:54px!important;\n  }\n\n  #ma7alak-story-like-btn .ma7alak-like-heart{\n    font-size:29px!important;\n  }\n}\n\n\n/* =========================================================\n   OWNER-ONLY STORY VIEW COUNT\n========================================================= */\n\n#ma7alak-story-view-count{\n  position:absolute!important;\n  left:50%!important;\n  bottom:102px!important;\n  transform:translateX(-50%)!important;\n\n  min-width:94px!important;\n  height:38px!important;\n  padding:0 13px!important;\n  margin:0!important;\n\n  display:none;\n  align-items:center!important;\n  justify-content:center!important;\n  gap:7px!important;\n\n  border:1px solid rgba(255,255,255,.20)!important;\n  border-radius:22px!important;\n  background:linear-gradient(145deg,rgba(28,28,31,.86),rgba(8,8,10,.76))!important;\n\n  color:#fff!important;\n  font-family:Arial,\"Segoe UI\",sans-serif!important;\n  font-size:12px!important;\n  font-weight:800!important;\n  line-height:1!important;\n\n  backdrop-filter:blur(18px) saturate(140%)!important;\n  -webkit-backdrop-filter:blur(18px) saturate(140%)!important;\n\n  box-shadow:\n    0 9px 26px rgba(0,0,0,.34),\n    inset 0 1px 0 rgba(255,255,255,.12)!important;\n\n  z-index:2147483646!important;\n  pointer-events:none!important;\n  box-sizing:border-box!important;\n  white-space:nowrap!important;\n}\n\n#ma7alak-story-view-count.visible{\n  display:flex!important;\n}\n\n#ma7alak-story-view-count .ma7alak-view-eye{\n  font-size:17px!important;\n  line-height:1!important;\n  opacity:.96!important;\n  transform:translateY(-1px)!important;\n}\n\n#ma7alak-story-view-count .ma7alak-view-number{\n  color:#fff!important;\n  font-size:13px!important;\n  font-weight:900!important;\n}\n\n#ma7alak-story-view-count .ma7alak-view-label{\n  color:rgba(255,255,255,.68)!important;\n  font-size:10px!important;\n  font-weight:700!important;\n}\n\n@media(max-width:600px){\n  #ma7alak-story-view-count{\n    bottom:92px!important;\n    min-width:88px!important;\n    height:36px!important;\n    padding:0 12px!important;\n    gap:6px!important;\n  }\n}\n\n\n/* =========================================================\n   FACEBOOK-STYLE LIKE HEART BURST\n========================================================= */\n\n#ma7alak-story-heart-burst{\n  position:absolute!important;\n  inset:0!important;\n  overflow:hidden!important;\n  pointer-events:none!important;\n  z-index:2147483645!important;\n}\n\n.ma7alak-story-floating-heart{\n  position:absolute!important;\n  left:50%!important;\n  bottom:52px!important;\n  color:#ff405b!important;\n  font-family:Arial,sans-serif!important;\n  font-weight:900!important;\n  line-height:1!important;\n  opacity:0;\n  pointer-events:none!important;\n  text-shadow:0 3px 14px rgba(255,64,91,.35)!important;\n  animation:ma7alakStoryHeartFloat var(--heart-duration,1.45s) ease-out forwards!important;\n}\n\n@keyframes ma7alakStoryHeartFloat{\n  0%{opacity:0;transform:translate(-50%,0) scale(.45) rotate(0deg);}\n  12%{opacity:1;}\n  100%{opacity:0;transform:translate(calc(-50% + var(--heart-x,0px)),var(--heart-y,-360px)) scale(var(--heart-scale,1)) rotate(var(--heart-rotate,0deg));}\n}\n\n/* =========================================================\n   PROGRESS BARS\n========================================================= */\n\n#ma7alak-story-progress-wrap{\n\n  position:absolute;\n\n  top:10px;\n\n  left:12px;\n  right:12px;\n\n  height:4px;\n\n  display:flex;\n\n  gap:4px;\n\n  z-index:100;\n\n  pointer-events:none;\n\n}\n\n\n.ma7alak-story-progress-segment{\n\n  flex:1;\n\n  height:4px;\n\n  border-radius:20px;\n\n  background:\n    rgba(255,255,255,.30);\n\n  overflow:hidden;\n\n  position:relative;\n\n}\n\n\n.ma7alak-story-progress-fill{\n\n  position:absolute;\n\n  left:0;\n  top:0;\n\n  width:0%;\n\n  height:100%;\n\n  background:#6a2d16;\n\n  border-radius:20px;\n\n}\n\n\n/* =========================================================\n   CLOSE STORY\n========================================================= */\n\n#ma7alak-story-close-btn{\n\n  position:absolute;\n\n  top:48px;\n  right:20px;\n\n  width:48px;\n  height:48px;\n\n  border:none!important;\n\n  border-radius:50%;\n\n  background:\n    rgba(20,20,20,.72);\n\n  color:#fff;\n\n  font-size:30px;\n\n  line-height:48px;\n\n  padding:0;\n\n  text-align:center;\n\n  cursor:pointer;\n\n  z-index:120;\n\n  backdrop-filter:blur(10px);\n\n  -webkit-backdrop-filter:blur(10px);\n\n  -webkit-tap-highlight-color:\n    transparent;\n\n  outline:none!important;\n\n}\n\n\n/* =========================================================\n   TAP AREAS\n========================================================= */\n\n#ma7alak-story-tap-left,\n#ma7alak-story-tap-right{\n\n  position:absolute;\n\n  top:0;\n  bottom:0;\n\n  width:50%;\n\n  z-index:90;\n\n  cursor:pointer;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  padding:0;\n\n  margin:0;\n\n  outline:none!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n  box-shadow:none!important;\n\n}\n\n\n#ma7alak-story-tap-left{\n\n  left:0;\n\n}\n\n\n#ma7alak-story-tap-right{\n\n  right:0;\n\n}\n\n\n#ma7alak-story-tap-left:focus,\n#ma7alak-story-tap-left:focus-visible,\n#ma7alak-story-tap-left:active,\n#ma7alak-story-tap-right:focus,\n#ma7alak-story-tap-right:focus-visible,\n#ma7alak-story-tap-right:active{\n\n  background:transparent!important;\n\n  border:0!important;\n\n  outline:none!important;\n\n  box-shadow:none!important;\n\n}\n\n\n/* =========================================================\n   MOBILE STORY CONTROLS\n========================================================= */\n\n@media(max-width:600px){\n\n  #ma7alak-story-close-btn{\n\n    top:54px;\n\n    right:14px;\n\n    width:44px;\n\n    height:44px;\n\n    line-height:44px;\n\n  }\n\n\n  #ma7alak-story-progress-wrap{\n\n    top:8px;\n\n    left:9px;\n    right:9px;\n\n    height:3px;\n\n    gap:3px;\n\n  }\n\n\n  .ma7alak-story-progress-segment{\n\n    height:3px;\n\n  }\n\n}\n\n\n\n/* =========================================================\n   DOZE 3ALE — SIGNATURE GOLD CREPE EXPERIENCE\n   $30 LUXURY DESIGN TIER\n   ---------------------------------------------------------\n   Visual only. Story / Supabase / owner / likes / views logic\n   remains untouched.\n========================================================= */\n\n/* ---------------------------------------------------------\n   STORY AREA — LUXURY AMBIENT STAGE\n--------------------------------------------------------- */\n\n#ma7alak-story-wrapper::before{\n  content:\"\"!important;\n  position:absolute!important;\n  left:50%!important;\n  top:50%!important;\n  width:min(330px,calc(100vw - 24px))!important;\n  height:min(330px,calc(100vw - 24px))!important;\n  transform:translate(-50%,-50%)!important;\n  border-radius:50%!important;\n  background:\n    radial-gradient(circle at 50% 50%,\n      rgba(178,91,49,.13) 0%,\n      rgba(194,119,27,.08) 30%,\n      rgba(80,38,8,.04) 50%,\n      transparent 72%)!important;\n  filter:blur(2px)!important;\n  pointer-events:none!important;\n  z-index:0!important;\n  animation:dozeAmbientBreath 4.8s ease-in-out infinite!important;\n  -webkit-animation:dozeAmbientBreath 4.8s ease-in-out infinite!important;\n}\n\n#ma7alak-story-button{\n  border:3px solid #8a4726!important;\n  box-shadow:\n    0 0 0 1px rgba(238,205,184,.14),\n    0 12px 34px rgba(0,0,0,.46),\n    0 0 26px rgba(106,45,22,.17),\n    inset 0 0 0 1px rgba(244,226,215,.08)!important;\n  -webkit-box-shadow:\n    0 0 0 1px rgba(238,205,184,.14),\n    0 12px 34px rgba(0,0,0,.46),\n    0 0 26px rgba(106,45,22,.17),\n    inset 0 0 0 1px rgba(244,226,215,.08)!important;\n}\n\n#ma7alak-story-button:hover,\n#ma7alak-story-button:focus,\n#ma7alak-story-button:focus-visible,\n#ma7alak-story-button:active{\n  box-shadow:\n    0 0 0 1px rgba(238,205,184,.14),\n    0 12px 34px rgba(0,0,0,.46),\n    0 0 28px rgba(106,45,22,.21),\n    inset 0 0 0 1px rgba(244,226,215,.08)!important;\n  -webkit-box-shadow:\n    0 0 0 1px rgba(238,205,184,.14),\n    0 12px 34px rgba(0,0,0,.46),\n    0 0 28px rgba(106,45,22,.21),\n    inset 0 0 0 1px rgba(244,226,215,.08)!important;\n}\n\n#ma7alak-doze-luxury-ring{\n  position:absolute!important;\n  left:50%!important;\n  top:50%!important;\n  width:min(258px,calc(100vw - 74px))!important;\n  height:min(258px,calc(100vw - 74px))!important;\n  transform:translate(-50%,-50%)!important;\n  border-radius:50%!important;\n  padding:2px!important;\n  pointer-events:none!important;\n  z-index:1!important;\n  box-sizing:border-box!important;\n  opacity:.74!important;\n  background:\n    conic-gradient(\n      from 0deg,\n      rgba(255,234,173,.08) 0deg,\n      rgba(239,198,110,.25) 24deg,\n      #f2d4bc 41deg,\n      #7a3318 56deg,\n      rgba(122,65,13,.12) 88deg,\n      rgba(205,126,79,.16) 155deg,\n      #cf8656 188deg,\n      #9d5f19 208deg,\n      rgba(255,232,166,.10) 256deg,\n      #f5d77f 322deg,\n      rgba(255,234,173,.08) 360deg\n    )!important;\n  -webkit-mask:\n    linear-gradient(#000 0 0) content-box,\n    linear-gradient(#000 0 0)!important;\n  -webkit-mask-composite:xor!important;\n  mask-composite:exclude!important;\n  filter:\n    drop-shadow(0 0 5px rgba(178,91,49,.28))\n    drop-shadow(0 0 13px rgba(185,107,28,.14))!important;\n  animation:dozeLuxuryRingRotate 13s linear infinite!important;\n  -webkit-animation:dozeLuxuryRingRotate 13s linear infinite!important;\n}\n\n.ma7alak-doze-orbit-spark{\n  position:absolute!important;\n  left:50%!important;\n  top:50%!important;\n  width:6px!important;\n  height:6px!important;\n  margin:-3px!important;\n  border-radius:50%!important;\n  background:#f2d4bc!important;\n  box-shadow:\n    0 0 6px rgba(238,205,184,.95),\n    0 0 14px rgba(106,45,22,.60)!important;\n  pointer-events:none!important;\n  z-index:4!important;\n  opacity:.8!important;\n}\n\n.ma7alak-doze-orbit-spark.s1{\n  animation:dozeOrbitSparkOne 6.2s linear infinite!important;\n  -webkit-animation:dozeOrbitSparkOne 6.2s linear infinite!important;\n}\n\n.ma7alak-doze-orbit-spark.s2{\n  width:4px!important;\n  height:4px!important;\n  animation:dozeOrbitSparkTwo 8.1s linear infinite!important;\n  -webkit-animation:dozeOrbitSparkTwo 8.1s linear infinite!important;\n}\n\n.ma7alak-doze-orbit-spark.s3{\n  width:3px!important;\n  height:3px!important;\n  background:#d29137!important;\n  animation:dozeOrbitSparkThree 9.5s linear infinite!important;\n  -webkit-animation:dozeOrbitSparkThree 9.5s linear infinite!important;\n}\n\n#ma7alak-owner-add-story{\n  border:2px solid #130b04!important;\n  background:linear-gradient(145deg,#d79a74,#84401f 54%,#4c1c0d)!important;\n  color:#160d04!important;\n  box-shadow:\n    0 5px 16px rgba(0,0,0,.48),\n    0 0 16px rgba(106,45,22,.26),\n    inset 0 1px 0 rgba(244,226,215,.66)!important;\n}\n\n/* ---------------------------------------------------------\n   SIGNATURE IDENTITY CARD\n--------------------------------------------------------- */\n\n#ma7alak-shop-identity{\n  position:relative!important;\n  width:calc(100% - 24px)!important;\n  max-width:440px!important;\n  margin:8px auto 24px!important;\n  padding:24px 18px 21px!important;\n  display:flex!important;\n  flex-direction:column!important;\n  align-items:center!important;\n  justify-content:center!important;\n  overflow:hidden!important;\n  isolation:isolate!important;\n  border:1px solid rgba(224,173,67,.34)!important;\n  border-radius:28px!important;\n  background:\n    radial-gradient(circle at 50% -15%,rgba(178,91,49,.13),transparent 36%),\n    radial-gradient(circle at 12% 78%,rgba(128,66,19,.11),transparent 34%),\n    linear-gradient(160deg,rgba(27,20,12,.90),rgba(9,8,7,.96) 48%,rgba(17,11,7,.94))!important;\n  box-shadow:\n    0 22px 48px rgba(0,0,0,.42),\n    0 0 0 1px rgba(255,237,179,.03),\n    inset 0 1px 0 rgba(255,238,188,.08),\n    inset 0 -22px 50px rgba(0,0,0,.23)!important;\n  text-align:center!important;\n  box-sizing:border-box!important;\n  font-family:Arial,\"Segoe UI\",sans-serif!important;\n}\n\n#ma7alak-shop-identity::before{\n  content:\"\"!important;\n  position:absolute!important;\n  inset:-1px!important;\n  border-radius:28px!important;\n  padding:1px!important;\n  background:linear-gradient(\n    115deg,\n    transparent 0%,\n    rgba(205,126,79,.15) 18%,\n    rgba(239,218,204,.80) 27%,\n    rgba(210,145,42,.26) 38%,\n    transparent 53%,\n    rgba(255,216,120,.13) 73%,\n    rgba(229,190,165,.58) 83%,\n    transparent 100%\n  )!important;\n  background-size:260% 100%!important;\n  -webkit-mask:\n    linear-gradient(#000 0 0) content-box,\n    linear-gradient(#000 0 0)!important;\n  -webkit-mask-composite:xor!important;\n  mask-composite:exclude!important;\n  pointer-events:none!important;\n  z-index:0!important;\n  animation:dozeCardBorderSweep 6.8s linear infinite!important;\n  -webkit-animation:dozeCardBorderSweep 6.8s linear infinite!important;\n}\n\n#ma7alak-shop-identity::after{\n  content:\"\"!important;\n  position:absolute!important;\n  width:180px!important;\n  height:180px!important;\n  right:-72px!important;\n  bottom:-92px!important;\n  border-radius:50%!important;\n  background:radial-gradient(circle,rgba(178,100,24,.15),transparent 68%)!important;\n  filter:blur(3px)!important;\n  pointer-events:none!important;\n  z-index:0!important;\n}\n\n#ma7alak-doze-signature{\n  position:relative!important;\n  z-index:2!important;\n  min-height:28px!important;\n  margin:0 0 13px!important;\n  padding:0 13px!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  gap:8px!important;\n  border:1px solid rgba(232,184,84,.30)!important;\n  border-radius:999px!important;\n  background:linear-gradient(180deg,rgba(71,45,18,.34),rgba(17,12,8,.44))!important;\n  color:#8a4726!important;\n  box-shadow:\n    0 6px 18px rgba(0,0,0,.22),\n    inset 0 1px 0 rgba(229,190,165,.07)!important;\n  font-size:8px!important;\n  font-weight:900!important;\n  letter-spacing:2.4px!important;\n  text-transform:uppercase!important;\n}\n\n#ma7alak-doze-signature .sig-star{\n  color:#f2d4bc!important;\n  font-size:9px!important;\n  text-shadow:0 0 8px rgba(255,230,150,.65)!important;\n  animation:dozeTinyStar 2.4s ease-in-out infinite!important;\n  -webkit-animation:dozeTinyStar 2.4s ease-in-out infinite!important;\n}\n\n#ma7alak-doze-signature .sig-star:last-child{\n  animation-delay:1.2s!important;\n}\n\n#ma7alak-doze-crest{\n  position:relative!important;\n  z-index:2!important;\n  width:68px!important;\n  height:68px!important;\n  margin:0 auto 12px!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  border:1px solid rgba(231,181,76,.46)!important;\n  border-radius:50%!important;\n  background:\n    radial-gradient(circle at 34% 25%,rgba(255,235,178,.18),rgba(83,47,16,.18) 47%,rgba(8,8,8,.62) 100%)!important;\n  color:#c47a4a!important;\n  box-shadow:\n    0 10px 28px rgba(0,0,0,.34),\n    0 0 20px rgba(106,45,22,.10),\n    inset 0 0 0 5px rgba(255,255,255,.015)!important;\n  animation:dozeCrestFloat 4s ease-in-out infinite!important;\n  -webkit-animation:dozeCrestFloat 4s ease-in-out infinite!important;\n}\n\n#ma7alak-doze-crest::before{\n  content:\"\"!important;\n  position:absolute!important;\n  inset:5px!important;\n  border-radius:50%!important;\n  border:1px dashed rgba(245,205,116,.22)!important;\n  animation:dozeCrestSpin 18s linear infinite!important;\n  -webkit-animation:dozeCrestSpin 18s linear infinite!important;\n}\n\n#ma7alak-doze-crest::after{\n  content:\"\"!important;\n  position:absolute!important;\n  left:50%!important;\n  bottom:-11px!important;\n  width:7px!important;\n  height:13px!important;\n  transform:translateX(-50%)!important;\n  border-radius:50% 50% 70% 70%!important;\n  background:linear-gradient(180deg,#71400f,#321b08)!important;\n  box-shadow:0 5px 10px rgba(81,37,5,.28)!important;\n  animation:dozeChocolateDrip 3.7s ease-in-out infinite!important;\n  -webkit-animation:dozeChocolateDrip 3.7s ease-in-out infinite!important;\n}\n\n#ma7alak-doze-crest svg{\n  width:40px!important;\n  height:40px!important;\n  display:block!important;\n  filter:drop-shadow(0 3px 7px rgba(0,0,0,.34))!important;\n}\n\n#ma7alak-shop-identity-category-row{\n  position:relative!important;\n  z-index:2!important;\n  width:100%!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  gap:9px!important;\n  margin:0 0 13px!important;\n}\n\n.ma7alak-shop-identity-line{\n  flex:1 1 54px!important;\n  max-width:74px!important;\n  height:1px!important;\n  position:relative!important;\n  overflow:visible!important;\n  background:linear-gradient(90deg,transparent,rgba(178,105,26,.30),rgba(255,218,132,.92))!important;\n}\n\n.ma7alak-shop-identity-line.right{\n  transform:scaleX(-1)!important;\n}\n\n.ma7alak-shop-identity-line::before{\n  content:\"\"!important;\n  position:absolute!important;\n  left:-12px!important;\n  top:-1px!important;\n  width:18px!important;\n  height:3px!important;\n  border-radius:5px!important;\n  background:linear-gradient(90deg,transparent,#f2d4bc,transparent)!important;\n  filter:drop-shadow(0 0 4px rgba(205,126,79,.72))!important;\n  animation:dozeLineSpark 2.9s linear infinite!important;\n  -webkit-animation:dozeLineSpark 2.9s linear infinite!important;\n}\n\n.ma7alak-shop-identity-line.right::before{\n  animation-delay:.35s!important;\n}\n\n.ma7alak-shop-identity-line::after{\n  content:\"\"!important;\n  position:absolute!important;\n  top:50%!important;\n  right:-2px!important;\n  width:5px!important;\n  height:5px!important;\n  transform:translateY(-50%) rotate(45deg)!important;\n  border-radius:1px!important;\n  background:#f0c766!important;\n  box-shadow:0 0 9px rgba(106,45,22,.46)!important;\n}\n\n#ma7alak-shop-category-pill{\n  min-height:38px!important;\n  max-width:min(270px,72vw)!important;\n  padding:0 15px 0 9px!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  gap:9px!important;\n  border:1px solid rgba(106,45,22,.58)!important;\n  border-radius:999px!important;\n  background:linear-gradient(180deg,rgba(58,38,17,.68),rgba(12,10,8,.78))!important;\n  color:#f2cc78!important;\n  box-shadow:\n    0 7px 22px rgba(0,0,0,.28),\n    0 0 20px rgba(106,45,22,.07),\n    inset 0 1px 0 rgba(229,190,165,.11)!important;\n  backdrop-filter:blur(12px)!important;\n  -webkit-backdrop-filter:blur(12px)!important;\n}\n\n#ma7alak-shop-category-icon{\n  width:29px!important;\n  height:29px!important;\n  flex:0 0 29px!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  border:1px solid rgba(106,45,22,.45)!important;\n  border-radius:50%!important;\n  background:radial-gradient(circle at 35% 28%,rgba(255,231,170,.18),rgba(134,74,20,.10) 50%,rgba(0,0,0,.14) 100%)!important;\n  color:#c77b4a!important;\n  box-shadow:inset 0 0 0 2px rgba(255,255,255,.018)!important;\n}\n\n#ma7alak-shop-category-icon svg{\n  width:18px!important;\n  height:18px!important;\n  display:block!important;\n}\n\n#ma7alak-shop-category-text{\n  min-width:0!important;\n  overflow:hidden!important;\n  text-overflow:ellipsis!important;\n  white-space:nowrap!important;\n  color:#b66a3c!important;\n  font-size:10px!important;\n  font-weight:900!important;\n  line-height:1!important;\n  letter-spacing:1.85px!important;\n  text-transform:uppercase!important;\n}\n\n#ma7alak-shop-name{\n  position:relative!important;\n  z-index:2!important;\n  width:100%!important;\n  margin:0!important;\n  font-family:Georgia,\"Times New Roman\",serif!important;\n  font-size:38px!important;\n  font-weight:900!important;\n  line-height:1.04!important;\n  letter-spacing:-1px!important;\n  background:linear-gradient(\n    100deg,\n    #f8e9df 0%,\n    #c47a4a 18%,\n    #efd4c0 33%,\n    #7a3318 47%,\n    #dc9a70 61%,\n    #f8ebe4 76%,\n    #8e4626 100%\n  )!important;\n  background-size:280% 100%!important;\n  -webkit-background-clip:text!important;\n  background-clip:text!important;\n  color:transparent!important;\n  -webkit-text-fill-color:transparent!important;\n  text-shadow:0 5px 20px rgba(0,0,0,.36)!important;\n  filter:drop-shadow(0 2px 7px rgba(106,45,22,.10))!important;\n  animation:dozeMoltenGoldTitle 4.6s ease-in-out infinite!important;\n  -webkit-animation:dozeMoltenGoldTitle 4.6s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-name::before,\n#ma7alak-shop-name::after{\n  position:absolute!important;\n  color:#f2d4bc!important;\n  -webkit-text-fill-color:#f2d4bc!important;\n  font-family:Arial,sans-serif!important;\n  font-size:10px!important;\n  font-weight:900!important;\n  line-height:1!important;\n  text-shadow:\n    0 0 7px rgba(255,255,255,.72),\n    0 0 13px rgba(106,45,22,.60)!important;\n  pointer-events:none!important;\n}\n\n#ma7alak-shop-name::before{\n  content:\"✦\"!important;\n  left:8%!important;\n  top:-6px!important;\n  animation:dozeTitleSparkOne 3.4s ease-in-out infinite!important;\n  -webkit-animation:dozeTitleSparkOne 3.4s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-name::after{\n  content:\"✧\"!important;\n  right:9%!important;\n  bottom:-3px!important;\n  animation:dozeTitleSparkTwo 3.4s ease-in-out infinite!important;\n  -webkit-animation:dozeTitleSparkTwo 3.4s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-arabic-name{\n  position:relative!important;\n  z-index:2!important;\n  width:100%!important;\n  margin:8px 0 0!important;\n  color:#cf8b62!important;\n  font-family:Georgia,\"Times New Roman\",Tahoma,Arial,sans-serif!important;\n  font-size:19px!important;\n  font-weight:700!important;\n  font-style:italic!important;\n  line-height:1.25!important;\n  direction:ltr!important;\n  letter-spacing:1.1px!important;\n  text-shadow:\n    0 3px 13px rgba(0,0,0,.38),\n    0 0 13px rgba(106,45,22,.12)!important;\n}\n\n#ma7alak-doze-flavor-line{\n  position:relative!important;\n  z-index:2!important;\n  width:100%!important;\n  margin:12px 0 0!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  flex-wrap:wrap!important;\n  gap:7px!important;\n  color:rgba(238,211,194,.64)!important;\n  font-size:8px!important;\n  font-weight:900!important;\n  letter-spacing:1.8px!important;\n  text-transform:uppercase!important;\n}\n\n#ma7alak-doze-flavor-line i{\n  width:3px!important;\n  height:3px!important;\n  border-radius:50%!important;\n  background:#7a3318!important;\n  box-shadow:0 0 6px rgba(106,45,22,.42)!important;\n}\n\n#ma7alak-shop-identity-divider{\n  position:relative!important;\n  z-index:2!important;\n  width:min(220px,64vw)!important;\n  height:13px!important;\n  margin:14px auto 0!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n}\n\n#ma7alak-shop-identity-divider::before,\n#ma7alak-shop-identity-divider::after{\n  content:\"\"!important;\n  flex:1!important;\n  height:1px!important;\n  background:linear-gradient(90deg,transparent,rgba(106,45,22,.80))!important;\n}\n\n#ma7alak-shop-identity-divider::after{\n  transform:scaleX(-1)!important;\n}\n\n#ma7alak-shop-identity-divider span{\n  position:relative!important;\n  width:9px!important;\n  height:9px!important;\n  margin:0 10px!important;\n  transform:rotate(45deg)!important;\n  border:1px solid rgba(223,164,126,.94)!important;\n  border-radius:2px!important;\n  background:linear-gradient(145deg,#d48b60,#5a2411)!important;\n  box-shadow:\n    0 0 10px rgba(106,45,22,.45),\n    0 0 20px rgba(106,45,22,.14)!important;\n  animation:dozeDividerGem 2.7s ease-in-out infinite!important;\n  -webkit-animation:dozeDividerGem 2.7s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-identity.ma7alak-identity-ready{\n  animation:ma7alakIdentityReveal .62s cubic-bezier(.2,.78,.2,1) both!important;\n  -webkit-animation:ma7alakIdentityReveal .62s cubic-bezier(.2,.78,.2,1) both!important;\n}\n\n/* ---------------------------------------------------------\n   CREPE / CHOCOLATE MICRO DECOR\n--------------------------------------------------------- */\n\n.ma7alak-doze-choco-drop{\n  position:absolute!important;\n  z-index:1!important;\n  width:7px!important;\n  height:10px!important;\n  border-radius:60% 60% 70% 70%!important;\n  background:linear-gradient(180deg,#7c4315,#291306)!important;\n  opacity:.42!important;\n  pointer-events:none!important;\n  filter:drop-shadow(0 3px 4px rgba(0,0,0,.32))!important;\n}\n\n.ma7alak-doze-choco-drop.d1{\n  left:27px!important;\n  top:84px!important;\n  animation:dozeDropFloat 5.3s ease-in-out infinite!important;\n}\n\n.ma7alak-doze-choco-drop.d2{\n  right:31px!important;\n  bottom:54px!important;\n  width:5px!important;\n  height:8px!important;\n  opacity:.30!important;\n  animation:dozeDropFloat 6.2s ease-in-out 1.4s infinite!important;\n}\n\n.ma7alak-doze-hazelnut{\n  position:absolute!important;\n  z-index:1!important;\n  width:9px!important;\n  height:7px!important;\n  border-radius:58% 42% 62% 38%!important;\n  background:linear-gradient(145deg,#71371e,#3e190c)!important;\n  box-shadow:inset -2px -2px 3px rgba(49,23,4,.32)!important;\n  opacity:.42!important;\n  pointer-events:none!important;\n}\n\n.ma7alak-doze-hazelnut.n1{\n  right:40px!important;\n  top:89px!important;\n  transform:rotate(24deg)!important;\n  animation:dozeNutFloat 6.6s ease-in-out infinite!important;\n}\n\n.ma7alak-doze-hazelnut.n2{\n  left:38px!important;\n  bottom:45px!important;\n  transform:rotate(-18deg)!important;\n  opacity:.28!important;\n  animation:dozeNutFloat 7.5s ease-in-out 1.8s infinite!important;\n}\n\n/* ---------------------------------------------------------\n   ANIMATIONS\n--------------------------------------------------------- */\n\n@keyframes dozeAmbientBreath{\n  0%,100%{opacity:.72;transform:translate(-50%,-50%) scale(.97);}\n  50%{opacity:1;transform:translate(-50%,-50%) scale(1.04);}\n}\n@-webkit-keyframes dozeAmbientBreath{\n  0%,100%{opacity:.72;-webkit-transform:translate(-50%,-50%) scale(.97);}\n  50%{opacity:1;-webkit-transform:translate(-50%,-50%) scale(1.04);}\n}\n\n@keyframes dozeLuxuryRingRotate{\n  from{transform:translate(-50%,-50%) rotate(0deg);}\n  to{transform:translate(-50%,-50%) rotate(360deg);}\n}\n@-webkit-keyframes dozeLuxuryRingRotate{\n  from{-webkit-transform:translate(-50%,-50%) rotate(0deg);}\n  to{-webkit-transform:translate(-50%,-50%) rotate(360deg);}\n}\n\n@keyframes dozeOrbitSparkOne{\n  from{transform:rotate(0deg) translateX(132px) rotate(0deg);}\n  to{transform:rotate(360deg) translateX(132px) rotate(-360deg);}\n}\n@keyframes dozeOrbitSparkTwo{\n  from{transform:rotate(130deg) translateX(128px) rotate(-130deg);}\n  to{transform:rotate(490deg) translateX(128px) rotate(-490deg);}\n}\n@keyframes dozeOrbitSparkThree{\n  from{transform:rotate(240deg) translateX(125px) rotate(-240deg);}\n  to{transform:rotate(600deg) translateX(125px) rotate(-600deg);}\n}\n@-webkit-keyframes dozeOrbitSparkOne{\n  from{-webkit-transform:rotate(0deg) translateX(132px) rotate(0deg);}\n  to{-webkit-transform:rotate(360deg) translateX(132px) rotate(-360deg);}\n}\n@-webkit-keyframes dozeOrbitSparkTwo{\n  from{-webkit-transform:rotate(130deg) translateX(128px) rotate(-130deg);}\n  to{-webkit-transform:rotate(490deg) translateX(128px) rotate(-490deg);}\n}\n@-webkit-keyframes dozeOrbitSparkThree{\n  from{-webkit-transform:rotate(240deg) translateX(125px) rotate(-240deg);}\n  to{-webkit-transform:rotate(600deg) translateX(125px) rotate(-600deg);}\n}\n\n@keyframes dozeCardBorderSweep{\n  from{background-position:140% 50%;}\n  to{background-position:-140% 50%;}\n}\n@-webkit-keyframes dozeCardBorderSweep{\n  from{background-position:140% 50%;}\n  to{background-position:-140% 50%;}\n}\n\n@keyframes dozeCrestFloat{\n  0%,100%{transform:translateY(0) rotate(-1deg);}\n  50%{transform:translateY(-4px) rotate(1deg);}\n}\n@-webkit-keyframes dozeCrestFloat{\n  0%,100%{-webkit-transform:translateY(0) rotate(-1deg);}\n  50%{-webkit-transform:translateY(-4px) rotate(1deg);}\n}\n\n@keyframes dozeCrestSpin{\n  from{transform:rotate(0deg);}\n  to{transform:rotate(360deg);}\n}\n@-webkit-keyframes dozeCrestSpin{\n  from{-webkit-transform:rotate(0deg);}\n  to{-webkit-transform:rotate(360deg);}\n}\n\n@keyframes dozeChocolateDrip{\n  0%,18%,100%{height:7px;opacity:.18;transform:translateX(-50%) translateY(-1px) scale(.78);}\n  45%{height:15px;opacity:.82;transform:translateX(-50%) translateY(3px) scale(1);}\n  66%{height:10px;opacity:.52;transform:translateX(-50%) translateY(9px) scale(.76);}\n  80%{height:6px;opacity:0;transform:translateX(-50%) translateY(17px) scale(.48);}\n}\n@-webkit-keyframes dozeChocolateDrip{\n  0%,18%,100%{height:7px;opacity:.18;-webkit-transform:translateX(-50%) translateY(-1px) scale(.78);}\n  45%{height:15px;opacity:.82;-webkit-transform:translateX(-50%) translateY(3px) scale(1);}\n  66%{height:10px;opacity:.52;-webkit-transform:translateX(-50%) translateY(9px) scale(.76);}\n  80%{height:6px;opacity:0;-webkit-transform:translateX(-50%) translateY(17px) scale(.48);}\n}\n\n@keyframes dozeLineSpark{\n  0%{left:-12px;opacity:0;}\n  12%{opacity:1;}\n  82%{opacity:.9;}\n  100%{left:calc(100% - 5px);opacity:0;}\n}\n@-webkit-keyframes dozeLineSpark{\n  0%{left:-12px;opacity:0;}\n  12%{opacity:1;}\n  82%{opacity:.9;}\n  100%{left:calc(100% - 5px);opacity:0;}\n}\n\n@keyframes dozeMoltenGoldTitle{\n  0%{background-position:120% 50%;}\n  50%{background-position:20% 50%;}\n  100%{background-position:-120% 50%;}\n}\n@-webkit-keyframes dozeMoltenGoldTitle{\n  0%{background-position:120% 50%;}\n  50%{background-position:20% 50%;}\n  100%{background-position:-120% 50%;}\n}\n\n@keyframes dozeTitleSparkOne{\n  0%,18%,100%{opacity:0;transform:scale(.5) rotate(0deg);}\n  34%{opacity:1;transform:scale(1.25) rotate(40deg);}\n  50%{opacity:.35;transform:scale(.82) rotate(80deg);}\n}\n@keyframes dozeTitleSparkTwo{\n  0%,50%,100%{opacity:0;transform:scale(.5) rotate(0deg);}\n  67%{opacity:1;transform:scale(1.22) rotate(-35deg);}\n  84%{opacity:.35;transform:scale(.80) rotate(-76deg);}\n}\n@-webkit-keyframes dozeTitleSparkOne{\n  0%,18%,100%{opacity:0;-webkit-transform:scale(.5) rotate(0deg);}\n  34%{opacity:1;-webkit-transform:scale(1.25) rotate(40deg);}\n  50%{opacity:.35;-webkit-transform:scale(.82) rotate(80deg);}\n}\n@-webkit-keyframes dozeTitleSparkTwo{\n  0%,50%,100%{opacity:0;-webkit-transform:scale(.5) rotate(0deg);}\n  67%{opacity:1;-webkit-transform:scale(1.22) rotate(-35deg);}\n  84%{opacity:.35;-webkit-transform:scale(.80) rotate(-76deg);}\n}\n\n@keyframes dozeTinyStar{\n  0%,100%{opacity:.35;transform:scale(.72) rotate(0deg);}\n  50%{opacity:1;transform:scale(1.15) rotate(45deg);}\n}\n@-webkit-keyframes dozeTinyStar{\n  0%,100%{opacity:.35;-webkit-transform:scale(.72) rotate(0deg);}\n  50%{opacity:1;-webkit-transform:scale(1.15) rotate(45deg);}\n}\n\n@keyframes dozeDividerGem{\n  0%,100%{filter:brightness(.9);box-shadow:0 0 8px rgba(106,45,22,.34);}\n  50%{filter:brightness(1.25);box-shadow:0 0 15px rgba(255,220,132,.62),0 0 27px rgba(106,45,22,.18);}\n}\n@-webkit-keyframes dozeDividerGem{\n  0%,100%{filter:brightness(.9);box-shadow:0 0 8px rgba(106,45,22,.34);}\n  50%{filter:brightness(1.25);box-shadow:0 0 15px rgba(255,220,132,.62),0 0 27px rgba(106,45,22,.18);}\n}\n\n@keyframes dozeDropFloat{\n  0%,100%{transform:translateY(0) rotate(3deg);opacity:.22;}\n  50%{transform:translateY(7px) rotate(-4deg);opacity:.52;}\n}\n@keyframes dozeNutFloat{\n  0%,100%{translate:0 0;}\n  50%{translate:3px -5px;}\n}\n\n@keyframes ma7alakIdentityReveal{\n  from{opacity:0;transform:translateY(10px) scale(.985);}\n  to{opacity:1;transform:translateY(0) scale(1);}\n}\n@-webkit-keyframes ma7alakIdentityReveal{\n  from{opacity:0;-webkit-transform:translateY(10px) scale(.985);}\n  to{opacity:1;-webkit-transform:translateY(0) scale(1);}\n}\n\n/* ---------------------------------------------------------\n   PHONE TUNING\n--------------------------------------------------------- */\n\n@media(max-width:600px){\n  #ma7alak-shop-identity{\n    width:calc(100% - 18px)!important;\n    max-width:100%!important;\n    margin:8px auto 20px!important;\n    padding:21px 13px 18px!important;\n    border-radius:24px!important;\n  }\n\n  #ma7alak-shop-identity::before{\n    border-radius:24px!important;\n  }\n\n  #ma7alak-doze-signature{\n    min-height:27px!important;\n    margin-bottom:12px!important;\n    font-size:7.5px!important;\n    letter-spacing:2px!important;\n  }\n\n  #ma7alak-doze-crest{\n    width:62px!important;\n    height:62px!important;\n    margin-bottom:11px!important;\n  }\n\n  #ma7alak-doze-crest svg{\n    width:36px!important;\n    height:36px!important;\n  }\n\n  #ma7alak-shop-identity-category-row{\n    gap:8px!important;\n    margin-bottom:11px!important;\n  }\n\n  .ma7alak-shop-identity-line{\n    max-width:42px!important;\n  }\n\n  #ma7alak-shop-category-pill{\n    min-height:36px!important;\n    max-width:72vw!important;\n    padding:0 12px 0 8px!important;\n    gap:8px!important;\n  }\n\n  #ma7alak-shop-category-icon{\n    width:26px!important;\n    height:26px!important;\n    flex-basis:26px!important;\n  }\n\n  #ma7alak-shop-category-icon svg{\n    width:16px!important;\n    height:16px!important;\n  }\n\n  #ma7alak-shop-category-text{\n    font-size:9px!important;\n    letter-spacing:1.5px!important;\n  }\n\n  #ma7alak-shop-name{\n    font-size:34px!important;\n  }\n\n  #ma7alak-shop-arabic-name{\n    margin-top:7px!important;\n    font-size:18px!important;\n  }\n\n  #ma7alak-doze-flavor-line{\n    margin-top:10px!important;\n    gap:6px!important;\n    font-size:7px!important;\n    letter-spacing:1.45px!important;\n  }\n\n  #ma7alak-doze-luxury-ring{\n    width:calc(100vw - 74px)!important;\n    max-width:258px!important;\n    height:calc(100vw - 74px)!important;\n    max-height:258px!important;\n  }\n\n  .ma7alak-doze-orbit-spark.s1{display:none!important;}\n  .ma7alak-doze-orbit-spark.s2{display:none!important;}\n  .ma7alak-doze-orbit-spark.s3{display:none!important;}\n}\n\n@media(max-width:380px){\n  #ma7alak-shop-identity{\n    width:calc(100% - 12px)!important;\n    padding:19px 10px 17px!important;\n  }\n\n  #ma7alak-doze-signature{\n    letter-spacing:1.65px!important;\n    padding:0 10px!important;\n  }\n\n  .ma7alak-shop-identity-line{\n    max-width:28px!important;\n  }\n\n  #ma7alak-shop-category-pill{\n    max-width:78vw!important;\n  }\n\n  #ma7alak-shop-name{\n    font-size:31px!important;\n  }\n\n  #ma7alak-shop-arabic-name{\n    font-size:17px!important;\n  }\n}\n\n\n\n/* =========================================================\n   DOZE 3ALE — FULL CHOCOLATE OVERRIDE\n   Chocolate palette + Nutella orbit + moving logo + melting tag\n========================================================= */\n\n:root{\n  --doze-dark-chocolate:#180a05;\n  --doze-cocoa:#2b1008;\n  --doze-cocoa-2:#41180b;\n  --doze-milk:#6a2d16;\n  --doze-milk-2:#8a4726;\n  --doze-caramel:#b66a3c;\n  --doze-cream:#f2d4bc;\n}\n\n/* Entire Story-stage ambience is chocolate, not gold. */\n#ma7alak-story-wrapper::before{\n  background:\n    radial-gradient(circle at 50% 50%,\n      rgba(138,71,38,.24) 0%,\n      rgba(90,33,14,.18) 32%,\n      rgba(43,16,8,.10) 52%,\n      transparent 74%)!important;\n}\n\n/* OUTER Story circle — chocolate. */\n#ma7alak-story-button{\n  border-color:#6a2d16!important;\n  background:#160904!important;\n  box-shadow:\n    0 0 0 2px rgba(75,25,10,.70),\n    0 12px 34px rgba(0,0,0,.52),\n    0 0 25px rgba(106,45,22,.30),\n    inset 0 0 0 1px rgba(242,212,188,.06)!important;\n}\n\n#ma7alak-story-button:hover,\n#ma7alak-story-button:focus,\n#ma7alak-story-button:focus-visible,\n#ma7alak-story-button:active{\n  background:#160904!important;\n  box-shadow:\n    0 0 0 2px rgba(75,25,10,.78),\n    0 12px 34px rgba(0,0,0,.54),\n    0 0 31px rgba(138,71,38,.36),\n    inset 0 0 0 1px rgba(242,212,188,.08)!important;\n}\n\n/* Permanent premium outer ring. */\n#ma7alak-doze-luxury-ring{\n  background:\n    conic-gradient(\n      from 0deg,\n      #210b05 0deg,\n      #4b190b 44deg,\n      #8a4726 78deg,\n      #2c0f07 118deg,\n      #6a2d16 166deg,\n      #c47a4a 205deg,\n      #381309 248deg,\n      #7a3318 302deg,\n      #210b05 360deg\n    )!important;\n  filter:\n    drop-shadow(0 0 5px rgba(106,45,22,.62))\n    drop-shadow(0 0 14px rgba(74,24,9,.35))!important;\n}\n\n/* New/unseen Story ring is also chocolate. */\n#ma7alak-story-active-ring{\n  background:\n    conic-gradient(\n      from 0deg,\n      rgba(45,14,6,.18) 0deg,\n      #2c0d05 36deg,\n      #8a4726 76deg,\n      #4c190b 120deg,\n      #c47a4a 165deg,\n      #351006 211deg,\n      #6a2d16 265deg,\n      #a85c34 318deg,\n      rgba(45,14,6,.18) 360deg\n    )!important;\n  filter:\n    drop-shadow(0 0 6px rgba(106,45,22,.68))\n    drop-shadow(0 0 15px rgba(86,28,11,.35))!important;\n}\n\n#ma7alak-story-new-ring{\n  border-color:rgba(138,71,38,.80)!important;\n}\n\n#ma7alak-owner-add-story{\n  background:linear-gradient(145deg,#a15a34,#6a2d16 54%,#321006)!important;\n  border-color:#160904!important;\n  color:#f7dfcf!important;\n  box-shadow:\n    0 5px 16px rgba(0,0,0,.52),\n    0 0 18px rgba(106,45,22,.34),\n    inset 0 1px 0 rgba(242,212,188,.22)!important;\n}\n\n/* ---------------------------------------------------------\n   NUTELLA JAR ORBIT\n--------------------------------------------------------- */\n\n#ma7alak-doze-nutella-orbit{\n  position:absolute!important;\n  left:50%!important;\n  top:50%!important;\n  width:min(304px,calc(100vw - 26px))!important;\n  height:min(304px,calc(100vw - 26px))!important;\n  transform:translate(-50%,-50%) rotate(0deg);\n  border-radius:50%!important;\n  z-index:6!important;\n  pointer-events:none!important;\n  animation:dozeNutellaOrbit 7.6s linear infinite!important;\n  -webkit-animation:dozeNutellaOrbit 7.6s linear infinite!important;\n}\n\n.ma7alak-doze-nutella-jar{\n  position:absolute!important;\n  left:50%!important;\n  top:-7px!important;\n  width:42px!important;\n  height:51px!important;\n  margin-left:-21px!important;\n  transform:rotate(0deg);\n  transform-origin:center center!important;\n  filter:\n    drop-shadow(0 8px 9px rgba(0,0,0,.52))\n    drop-shadow(0 0 8px rgba(121,53,27,.30))!important;\n  animation:dozeNutellaKeepUpright 7.6s linear infinite!important;\n  -webkit-animation:dozeNutellaKeepUpright 7.6s linear infinite!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-lid{\n  position:absolute!important;\n  left:5px!important;\n  top:0!important;\n  width:32px!important;\n  height:9px!important;\n  border-radius:5px 5px 3px 3px!important;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      #f7f4ed 0 3px,\n      #ded9d0 3px 5px\n    )!important;\n  border:1px solid rgba(95,78,67,.34)!important;\n  box-shadow:inset 0 -2px 3px rgba(0,0,0,.12)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-glass{\n  position:absolute!important;\n  left:2px!important;\n  top:8px!important;\n  width:38px!important;\n  height:41px!important;\n  overflow:hidden!important;\n  border-radius:5px 5px 9px 9px!important;\n  background:linear-gradient(90deg,#f4eee6,#fff 38%,#e8ded5 100%)!important;\n  border:1px solid rgba(75,49,33,.35)!important;\n  box-shadow:\n    inset 3px 0 4px rgba(255,255,255,.62),\n    inset -3px 0 4px rgba(58,25,12,.10)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-choco{\n  position:absolute!important;\n  left:0!important;\n  right:0!important;\n  bottom:0!important;\n  height:31px!important;\n  background:\n    linear-gradient(160deg,#57200f 0%,#2a0d05 58%,#6a2a14 100%)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-label{\n  position:absolute!important;\n  left:3px!important;\n  right:3px!important;\n  top:14px!important;\n  height:16px!important;\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  border-radius:2px!important;\n  background:#fffdf8!important;\n  color:#d51f27!important;\n  font-family:Arial,sans-serif!important;\n  font-size:8px!important;\n  font-weight:900!important;\n  letter-spacing:-.45px!important;\n  text-transform:lowercase!important;\n  box-shadow:0 1px 2px rgba(0,0,0,.18)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-label b{\n  color:#111!important;\n  font-size:9px!important;\n  margin-right:-.3px!important;\n}\n\n@keyframes dozeNutellaOrbit{\n  from{transform:translate(-50%,-50%) rotate(0deg);}\n  to{transform:translate(-50%,-50%) rotate(360deg);}\n}\n@-webkit-keyframes dozeNutellaOrbit{\n  from{-webkit-transform:translate(-50%,-50%) rotate(0deg);}\n  to{-webkit-transform:translate(-50%,-50%) rotate(360deg);}\n}\n\n@keyframes dozeNutellaKeepUpright{\n  from{transform:rotate(0deg) scale(1);}\n  25%{transform:rotate(-90deg) scale(1.06);}\n  50%{transform:rotate(-180deg) scale(.98);}\n  75%{transform:rotate(-270deg) scale(1.06);}\n  to{transform:rotate(-360deg) scale(1);}\n}\n@-webkit-keyframes dozeNutellaKeepUpright{\n  from{-webkit-transform:rotate(0deg) scale(1);}\n  25%{-webkit-transform:rotate(-90deg) scale(1.06);}\n  50%{-webkit-transform:rotate(-180deg) scale(.98);}\n  75%{-webkit-transform:rotate(-270deg) scale(1.06);}\n  to{-webkit-transform:rotate(-360deg) scale(1);}\n}\n\n/* ---------------------------------------------------------\n   IDENTITY CARD — CHOCOLATE THROUGHOUT\n--------------------------------------------------------- */\n\n#ma7alak-shop-identity{\n  border-color:rgba(106,45,22,.62)!important;\n  background:\n    radial-gradient(circle at 50% -10%,rgba(138,71,38,.22),transparent 37%),\n    radial-gradient(circle at 12% 78%,rgba(82,25,9,.19),transparent 34%),\n    linear-gradient(158deg,rgba(41,13,6,.96),rgba(12,5,3,.98) 50%,rgba(27,8,4,.97))!important;\n  box-shadow:\n    0 22px 48px rgba(0,0,0,.48),\n    0 0 0 1px rgba(106,45,22,.16),\n    inset 0 1px 0 rgba(242,212,188,.06),\n    inset 0 -24px 55px rgba(0,0,0,.32)!important;\n}\n\n#ma7alak-shop-identity::before{\n  background:linear-gradient(\n    115deg,\n    transparent 0%,\n    rgba(83,25,10,.28) 18%,\n    rgba(180,96,54,.72) 28%,\n    rgba(71,20,8,.35) 39%,\n    transparent 53%,\n    rgba(113,42,18,.26) 73%,\n    rgba(199,123,74,.58) 83%,\n    transparent 100%\n  )!important;\n  background-size:260% 100%!important;\n}\n\n#ma7alak-shop-identity::after{\n  background:radial-gradient(circle,rgba(112,39,15,.25),transparent 68%)!important;\n}\n\n/* Hide old Signature badge even if Hostinger cached markup. */\n#ma7alak-doze-signature{\n  display:none!important;\n}\n\n#ma7alak-doze-crest{\n  border-color:rgba(138,71,38,.66)!important;\n  background:\n    radial-gradient(circle at 34% 25%,rgba(226,165,128,.13),rgba(84,28,12,.28) 47%,rgba(10,4,2,.78) 100%)!important;\n  color:#b66a3c!important;\n  box-shadow:\n    0 10px 28px rgba(0,0,0,.40),\n    0 0 22px rgba(106,45,22,.20),\n    inset 0 0 0 5px rgba(255,255,255,.012)!important;\n}\n\n#ma7alak-doze-crest::before{\n  border-color:rgba(169,83,43,.34)!important;\n}\n\n#ma7alak-doze-crest::after{\n  background:linear-gradient(180deg,#6a2d16,#220b05)!important;\n  box-shadow:0 5px 10px rgba(54,15,5,.36)!important;\n}\n\n.ma7alak-shop-identity-line{\n  background:linear-gradient(90deg,transparent,rgba(74,22,8,.45),rgba(138,71,38,.96))!important;\n}\n\n.ma7alak-shop-identity-line::before{\n  background:linear-gradient(90deg,transparent,#c47a4a,transparent)!important;\n  filter:drop-shadow(0 0 5px rgba(138,71,38,.72))!important;\n}\n\n.ma7alak-shop-identity-line::after{\n  background:#8a4726!important;\n  box-shadow:0 0 9px rgba(106,45,22,.52)!important;\n}\n\n#ma7alak-shop-category-pill{\n  border-color:rgba(106,45,22,.74)!important;\n  background:\n    linear-gradient(180deg,rgba(77,26,12,.82),rgba(21,7,3,.90))!important;\n  color:#d18a61!important;\n  box-shadow:\n    0 7px 22px rgba(0,0,0,.34),\n    0 0 20px rgba(106,45,22,.13),\n    inset 0 1px 0 rgba(242,212,188,.08)!important;\n}\n\n#ma7alak-shop-category-icon{\n  border-color:rgba(106,45,22,.68)!important;\n  background:\n    radial-gradient(circle at 35% 28%,rgba(208,132,87,.15),rgba(87,28,12,.20) 50%,rgba(0,0,0,.20) 100%)!important;\n  color:#c47a4a!important;\n}\n\n#ma7alak-shop-category-text{\n  color:#c47a4a!important;\n}\n\n/* ---------------------------------------------------------\n   DOZE 3ALE — OBVIOUS MOVING LOGO/TITLE\n--------------------------------------------------------- */\n\n#ma7alak-shop-name{\n  background:\n    linear-gradient(\n      100deg,\n      #f6e0d2 0%,\n      #9a5030 20%,\n      #f0b089 34%,\n      #5b1f0d 48%,\n      #c4774c 63%,\n      #f7ded0 78%,\n      #7d3219 100%\n    )!important;\n  background-size:300% 100%!important;\n  -webkit-background-clip:text!important;\n  background-clip:text!important;\n  -webkit-text-fill-color:transparent!important;\n  color:transparent!important;\n  filter:\n    drop-shadow(0 5px 9px rgba(0,0,0,.48))\n    drop-shadow(0 0 11px rgba(106,45,22,.25))!important;\n  transform-origin:center bottom!important;\n  animation:\n    dozeLogoMove 2.15s cubic-bezier(.45,.05,.28,1) infinite,\n    dozeLogoChocolateSweep 3.1s linear infinite!important;\n  -webkit-animation:\n    dozeLogoMove 2.15s cubic-bezier(.45,.05,.28,1) infinite,\n    dozeLogoChocolateSweep 3.1s linear infinite!important;\n}\n\n#ma7alak-shop-name::before{\n  content:\"●\"!important;\n  color:#8a4726!important;\n  -webkit-text-fill-color:#8a4726!important;\n  text-shadow:0 0 9px rgba(106,45,22,.70)!important;\n  animation:dozeTitleDropLeft 2.15s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-name::after{\n  content:\"●\"!important;\n  color:#c4774c!important;\n  -webkit-text-fill-color:#c4774c!important;\n  text-shadow:0 0 9px rgba(138,71,38,.70)!important;\n  animation:dozeTitleDropRight 2.15s ease-in-out .72s infinite!important;\n}\n\n@keyframes dozeLogoMove{\n  0%,100%{transform:translateY(0) scale(1) rotate(0deg);}\n  18%{transform:translateY(-5px) scale(1.045) rotate(-1.2deg);}\n  36%{transform:translateY(2px) scale(.99) rotate(.8deg);}\n  55%{transform:translateY(-3px) scale(1.03) rotate(1deg);}\n  74%{transform:translateY(1px) scale(1) rotate(-.5deg);}\n}\n@-webkit-keyframes dozeLogoMove{\n  0%,100%{-webkit-transform:translateY(0) scale(1) rotate(0deg);}\n  18%{-webkit-transform:translateY(-5px) scale(1.045) rotate(-1.2deg);}\n  36%{-webkit-transform:translateY(2px) scale(.99) rotate(.8deg);}\n  55%{-webkit-transform:translateY(-3px) scale(1.03) rotate(1deg);}\n  74%{-webkit-transform:translateY(1px) scale(1) rotate(-.5deg);}\n}\n\n@keyframes dozeLogoChocolateSweep{\n  from{background-position:130% 50%;}\n  to{background-position:-130% 50%;}\n}\n@-webkit-keyframes dozeLogoChocolateSweep{\n  from{background-position:130% 50%;}\n  to{background-position:-130% 50%;}\n}\n\n@keyframes dozeTitleDropLeft{\n  0%,22%,100%{opacity:.25;transform:translateY(0) scale(.55);}\n  45%{opacity:1;transform:translateY(7px) scale(.85);}\n  67%{opacity:.68;transform:translateY(16px) scale(.58);}\n  78%{opacity:0;transform:translateY(25px) scale(.35);}\n}\n@keyframes dozeTitleDropRight{\n  0%,22%,100%{opacity:.20;transform:translateY(0) scale(.45);}\n  45%{opacity:.9;transform:translateY(6px) scale(.76);}\n  67%{opacity:.6;transform:translateY(14px) scale(.52);}\n  78%{opacity:0;transform:translateY(22px) scale(.30);}\n}\n\n/* ---------------------------------------------------------\n   \"3a zaw2ak\" — MELTING CHOCOLATE TEXT\n--------------------------------------------------------- */\n\n#ma7alak-shop-arabic-name{\n  display:inline-block!important;\n  width:auto!important;\n  min-width:140px!important;\n  margin:10px auto 8px!important;\n  padding:0 18px 9px!important;\n  overflow:visible!important;\n  color:#a95c39!important;\n  font-style:normal!important;\n  font-weight:900!important;\n  letter-spacing:1.6px!important;\n  text-shadow:\n    0 2px 0 #3d1308,\n    0 4px 8px rgba(0,0,0,.50),\n    0 0 12px rgba(106,45,22,.30)!important;\n  transform-origin:center top!important;\n  animation:dozeMeltText 3.3s ease-in-out infinite!important;\n  -webkit-animation:dozeMeltText 3.3s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-arabic-name::before,\n#ma7alak-shop-arabic-name::after{\n  content:\"\"!important;\n  position:absolute!important;\n  top:78%!important;\n  width:7px!important;\n  height:9px!important;\n  border-radius:0 0 8px 8px!important;\n  background:\n    linear-gradient(180deg,#8a4726 0%,#5a1d0d 65%,#2b0d05 100%)!important;\n  box-shadow:\n    0 3px 5px rgba(0,0,0,.30),\n    inset 1px 0 2px rgba(227,160,119,.18)!important;\n  transform-origin:50% 0!important;\n  pointer-events:none!important;\n}\n\n#ma7alak-shop-arabic-name::before{\n  left:31%!important;\n  animation:dozeMeltDripOne 3.3s ease-in-out infinite!important;\n}\n\n#ma7alak-shop-arabic-name::after{\n  right:25%!important;\n  width:5px!important;\n  animation:dozeMeltDripTwo 3.3s ease-in-out .75s infinite!important;\n}\n\n@keyframes dozeMeltText{\n  0%,100%{transform:scaleX(1) scaleY(1) translateY(0);filter:blur(0);}\n  35%{transform:scaleX(1.03) scaleY(1.05) translateY(1px);filter:blur(.05px);}\n  55%{transform:scaleX(.985) scaleY(1.10) translateY(3px);filter:blur(.18px);}\n  72%{transform:scaleX(1.015) scaleY(1.035) translateY(1px);filter:blur(.05px);}\n}\n@-webkit-keyframes dozeMeltText{\n  0%,100%{-webkit-transform:scaleX(1) scaleY(1) translateY(0);}\n  35%{-webkit-transform:scaleX(1.03) scaleY(1.05) translateY(1px);}\n  55%{-webkit-transform:scaleX(.985) scaleY(1.10) translateY(3px);}\n  72%{-webkit-transform:scaleX(1.015) scaleY(1.035) translateY(1px);}\n}\n\n@keyframes dozeMeltDripOne{\n  0%,18%,100%{height:5px;transform:translateY(-2px) scaleX(.85);opacity:.38;}\n  42%{height:18px;transform:translateY(1px) scaleX(1);opacity:1;}\n  62%{height:27px;transform:translateY(6px) scaleX(.72);opacity:.78;}\n  78%{height:11px;transform:translateY(20px) scaleX(.45);opacity:0;}\n}\n@keyframes dozeMeltDripTwo{\n  0%,18%,100%{height:4px;transform:translateY(-2px) scaleX(.80);opacity:.28;}\n  42%{height:13px;transform:translateY(1px) scaleX(1);opacity:.90;}\n  64%{height:22px;transform:translateY(7px) scaleX(.68);opacity:.68;}\n  80%{height:9px;transform:translateY(18px) scaleX(.40);opacity:0;}\n}\n\n#ma7alak-doze-flavor-line{\n  color:rgba(220,168,137,.72)!important;\n}\n\n#ma7alak-doze-flavor-line i{\n  background:#6a2d16!important;\n  box-shadow:0 0 7px rgba(106,45,22,.62)!important;\n}\n\n#ma7alak-shop-identity-divider::before,\n#ma7alak-shop-identity-divider::after{\n  background:linear-gradient(90deg,transparent,rgba(106,45,22,.90))!important;\n}\n\n#ma7alak-shop-identity-divider span{\n  border-color:rgba(180,96,54,.96)!important;\n  background:linear-gradient(145deg,#a65d38,#4a1609)!important;\n  box-shadow:\n    0 0 10px rgba(106,45,22,.52),\n    0 0 20px rgba(74,22,8,.20)!important;\n}\n\n.ma7alak-story-progress-fill{\n  background:linear-gradient(90deg,#3b1208,#6a2d16,#b66a3c)!important;\n}\n\n/* Keep the Nutella orbit readable on phones. */\n@media(max-width:600px){\n  #ma7alak-doze-nutella-orbit{\n    width:calc(100vw - 30px)!important;\n    max-width:300px!important;\n    height:calc(100vw - 30px)!important;\n    max-height:300px!important;\n  }\n\n  .ma7alak-doze-nutella-jar{\n    width:38px!important;\n    height:47px!important;\n    margin-left:-19px!important;\n  }\n\n  .ma7alak-doze-nutella-jar .nutella-lid{\n    left:5px!important;\n    width:28px!important;\n  }\n\n  .ma7alak-doze-nutella-jar .nutella-glass{\n    width:34px!important;\n    height:38px!important;\n  }\n\n  #ma7alak-shop-name{\n    font-size:35px!important;\n  }\n\n  #ma7alak-shop-arabic-name{\n    font-size:18px!important;\n    min-width:132px!important;\n  }\n}\n\n@media(max-width:380px){\n  #ma7alak-doze-nutella-orbit{\n    width:calc(100vw - 18px)!important;\n    height:calc(100vw - 18px)!important;\n  }\n}\n\n\n\n/* =========================================================\n   DOZE 3ALE — REAL NUTELLA JAR + CHOCOLATE BACKGROUND V2\n   ---------------------------------------------------------\n   Visual upgrade only. Existing Story / Supabase logic stays\n   untouched.\n========================================================= */\n\n/* Add a subtle melted-chocolate texture inside the identity card too. */\n#ma7alak-shop-identity{\n  background:\n    radial-gradient(circle at 18% 8%,rgba(196,122,74,.13),transparent 30%),\n    radial-gradient(circle at 82% 26%,rgba(98,31,13,.22),transparent 33%),\n    radial-gradient(circle at 53% 118%,rgba(126,43,18,.28),transparent 46%),\n    linear-gradient(158deg,rgba(50,15,7,.98),rgba(13,5,3,.99) 50%,rgba(30,8,4,.98))!important;\n}\n\n/* ---------------------------------------------------------\n   REALER NUTELLA JAR\n   A taller 3D ribbed white cap + glass shoulders + glossy jar.\n--------------------------------------------------------- */\n.ma7alak-doze-nutella-jar{\n  width:46px!important;\n  height:60px!important;\n  margin-left:-23px!important;\n  top:-13px!important;\n  filter:\n    drop-shadow(0 9px 10px rgba(0,0,0,.58))\n    drop-shadow(0 0 9px rgba(124,53,28,.34))!important;\n  transform-origin:center 32px!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-lid{\n  left:5px!important;\n  top:0!important;\n  width:36px!important;\n  height:13px!important;\n  z-index:5!important;\n  border-radius:6px 6px 4px 4px!important;\n  border:1px solid rgba(99,86,76,.42)!important;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      #fffefa 0 2px,\n      #e6e2dc 2px 4px,\n      #faf8f3 4px 6px\n    )!important;\n  box-shadow:\n    inset 0 -3px 3px rgba(74,60,49,.13),\n    inset 0 2px 2px rgba(255,255,255,.9),\n    0 2px 2px rgba(0,0,0,.13)!important;\n}\n\n/* Top disc of the screw cap — this makes it read like a real jar cap. */\n.ma7alak-doze-nutella-jar .nutella-lid::before{\n  content:\"\"!important;\n  position:absolute!important;\n  left:1px!important;\n  right:1px!important;\n  top:-4px!important;\n  height:8px!important;\n  border-radius:50%!important;\n  border:1px solid rgba(112,99,89,.28)!important;\n  background:\n    radial-gradient(ellipse at 46% 35%,#ffffff 0 30%,#f2efe9 55%,#d7d1c9 100%)!important;\n  box-shadow:\n    inset 0 2px 3px rgba(255,255,255,.95),\n    0 1px 2px rgba(0,0,0,.13)!important;\n}\n\n/* Lower lip / screw rim under the cap. */\n.ma7alak-doze-nutella-jar .nutella-lid::after{\n  content:\"\"!important;\n  position:absolute!important;\n  left:2px!important;\n  right:2px!important;\n  bottom:-3px!important;\n  height:4px!important;\n  border-radius:0 0 5px 5px!important;\n  background:linear-gradient(180deg,#ece9e3,#cfc9c1)!important;\n  box-shadow:inset 0 -1px 1px rgba(68,57,48,.16)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-glass{\n  left:2px!important;\n  top:11px!important;\n  width:42px!important;\n  height:46px!important;\n  border-radius:7px 7px 11px 11px!important;\n  background:\n    linear-gradient(90deg,\n      #e7dfd6 0%,\n      #fff 15%,\n      #f9f5ef 39%,\n      #fff 58%,\n      #e2d8ce 100%)!important;\n  border:1px solid rgba(74,45,28,.42)!important;\n  box-shadow:\n    inset 4px 0 4px rgba(255,255,255,.68),\n    inset -4px 0 5px rgba(58,25,12,.13),\n    inset 0 2px 2px rgba(255,255,255,.55)!important;\n}\n\n/* Glass shoulder highlight */\n.ma7alak-doze-nutella-jar .nutella-glass::before{\n  content:\"\"!important;\n  position:absolute!important;\n  left:4px!important;\n  top:2px!important;\n  width:8px!important;\n  height:31px!important;\n  border-radius:50%!important;\n  background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.06))!important;\n  opacity:.72!important;\n  z-index:4!important;\n  pointer-events:none!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-choco{\n  height:35px!important;\n  background:\n    radial-gradient(circle at 62% 12%,rgba(156,76,42,.32),transparent 20%),\n    linear-gradient(160deg,#6b2b16 0%,#2a0d05 57%,#743018 100%)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-label{\n  left:3px!important;\n  right:3px!important;\n  top:15px!important;\n  height:18px!important;\n  font-size:8.5px!important;\n  border-radius:2px!important;\n  transform:skewY(-1deg)!important;\n}\n\n.ma7alak-doze-nutella-jar .nutella-label b{\n  font-size:10px!important;\n}\n\n/* ---------------------------------------------------------\n   STRONGER / CLEARER FULL-CIRCLE ORBIT\n--------------------------------------------------------- */\n#ma7alak-doze-nutella-orbit{\n  width:min(312px,calc(100vw - 18px))!important;\n  height:min(312px,calc(100vw - 18px))!important;\n  animation:dozeNutellaOrbitV2 6.4s linear infinite!important;\n  -webkit-animation:dozeNutellaOrbitV2 6.4s linear infinite!important;\n}\n\n.ma7alak-doze-nutella-jar{\n  animation:dozeNutellaJarRideV2 6.4s linear infinite!important;\n  -webkit-animation:dozeNutellaJarRideV2 6.4s linear infinite!important;\n}\n\n@keyframes dozeNutellaOrbitV2{\n  from{transform:translate(-50%,-50%) rotate(0deg);}\n  to{transform:translate(-50%,-50%) rotate(360deg);}\n}\n@-webkit-keyframes dozeNutellaOrbitV2{\n  from{-webkit-transform:translate(-50%,-50%) rotate(0deg);}\n  to{-webkit-transform:translate(-50%,-50%) rotate(360deg);}\n}\n\n/* Counter-rotation keeps the label readable while adding a visible jar wobble. */\n@keyframes dozeNutellaJarRideV2{\n  0%{transform:rotate(0deg) translateY(0) scale(1);}\n  12.5%{transform:rotate(-45deg) translateY(-2px) scale(1.07);}\n  25%{transform:rotate(-90deg) translateY(0) scale(1.02);}\n  37.5%{transform:rotate(-135deg) translateY(2px) scale(1.07);}\n  50%{transform:rotate(-180deg) translateY(0) scale(1);}\n  62.5%{transform:rotate(-225deg) translateY(-2px) scale(1.07);}\n  75%{transform:rotate(-270deg) translateY(0) scale(1.02);}\n  87.5%{transform:rotate(-315deg) translateY(2px) scale(1.07);}\n  100%{transform:rotate(-360deg) translateY(0) scale(1);}\n}\n@-webkit-keyframes dozeNutellaJarRideV2{\n  0%{-webkit-transform:rotate(0deg) translateY(0) scale(1);}\n  12.5%{-webkit-transform:rotate(-45deg) translateY(-2px) scale(1.07);}\n  25%{-webkit-transform:rotate(-90deg) translateY(0) scale(1.02);}\n  37.5%{-webkit-transform:rotate(-135deg) translateY(2px) scale(1.07);}\n  50%{-webkit-transform:rotate(-180deg) translateY(0) scale(1);}\n  62.5%{-webkit-transform:rotate(-225deg) translateY(-2px) scale(1.07);}\n  75%{-webkit-transform:rotate(-270deg) translateY(0) scale(1.02);}\n  87.5%{-webkit-transform:rotate(-315deg) translateY(2px) scale(1.07);}\n  100%{-webkit-transform:rotate(-360deg) translateY(0) scale(1);}\n}\n\n@media(max-width:600px){\n  #ma7alak-story-wrapper::after{\n    width:min(342px,calc(100vw - 4px))!important;\n    height:min(342px,calc(100vw - 4px))!important;\n  }\n\n  #ma7alak-doze-nutella-orbit{\n    width:calc(100vw - 16px)!important;\n    max-width:308px!important;\n    height:calc(100vw - 16px)!important;\n    max-height:308px!important;\n  }\n\n  .ma7alak-doze-nutella-jar{\n    width:43px!important;\n    height:56px!important;\n    margin-left:-21.5px!important;\n    top:-12px!important;\n  }\n\n  .ma7alak-doze-nutella-jar .nutella-lid{\n    left:5px!important;\n    width:33px!important;\n    height:12px!important;\n  }\n\n  .ma7alak-doze-nutella-jar .nutella-glass{\n    width:39px!important;\n    height:43px!important;\n    top:10px!important;\n  }\n}\n\n\n/* ---------------------------------------------------------\n   PHONE ORBIT SAFETY FIX\n   IMPORTANT: animated transforms must NOT be !important,\n   otherwise Chrome/Brave Android can keep the static transform\n   and ignore the keyframe movement.\n--------------------------------------------------------- */\n#ma7alak-doze-nutella-orbit{\n  transform:translate3d(-50%,-50%,0) rotate(0deg);\n  transform-origin:50% 50%!important;\n  will-change:transform!important;\n  backface-visibility:hidden!important;\n  -webkit-backface-visibility:hidden!important;\n}\n\n.ma7alak-doze-nutella-jar{\n  transform:translateZ(0) rotate(0deg);\n  transform-origin:50% 50%!important;\n  will-change:transform!important;\n  backface-visibility:hidden!important;\n  -webkit-backface-visibility:hidden!important;\n}\n\n@keyframes dozeNutellaOrbitV2{\n  0%{transform:translate3d(-50%,-50%,0) rotate(0deg);}\n  25%{transform:translate3d(-50%,-50%,0) rotate(90deg);}\n  50%{transform:translate3d(-50%,-50%,0) rotate(180deg);}\n  75%{transform:translate3d(-50%,-50%,0) rotate(270deg);}\n  100%{transform:translate3d(-50%,-50%,0) rotate(360deg);}\n}\n@-webkit-keyframes dozeNutellaOrbitV2{\n  0%{-webkit-transform:translate3d(-50%,-50%,0) rotate(0deg);}\n  25%{-webkit-transform:translate3d(-50%,-50%,0) rotate(90deg);}\n  50%{-webkit-transform:translate3d(-50%,-50%,0) rotate(180deg);}\n  75%{-webkit-transform:translate3d(-50%,-50%,0) rotate(270deg);}\n  100%{-webkit-transform:translate3d(-50%,-50%,0) rotate(360deg);}\n}\n\n@keyframes dozeNutellaJarRideV2{\n  0%{transform:translateZ(0) rotate(0deg) scale(1);}\n  12.5%{transform:translateZ(0) rotate(-45deg) translateY(-2px) scale(1.06);}\n  25%{transform:translateZ(0) rotate(-90deg) scale(1.02);}\n  37.5%{transform:translateZ(0) rotate(-135deg) translateY(2px) scale(1.06);}\n  50%{transform:translateZ(0) rotate(-180deg) scale(1);}\n  62.5%{transform:translateZ(0) rotate(-225deg) translateY(-2px) scale(1.06);}\n  75%{transform:translateZ(0) rotate(-270deg) scale(1.02);}\n  87.5%{transform:translateZ(0) rotate(-315deg) translateY(2px) scale(1.06);}\n  100%{transform:translateZ(0) rotate(-360deg) scale(1);}\n}\n@-webkit-keyframes dozeNutellaJarRideV2{\n  0%{-webkit-transform:translateZ(0) rotate(0deg) scale(1);}\n  12.5%{-webkit-transform:translateZ(0) rotate(-45deg) translateY(-2px) scale(1.06);}\n  25%{-webkit-transform:translateZ(0) rotate(-90deg) scale(1.02);}\n  37.5%{-webkit-transform:translateZ(0) rotate(-135deg) translateY(2px) scale(1.06);}\n  50%{-webkit-transform:translateZ(0) rotate(-180deg) scale(1);}\n  62.5%{-webkit-transform:translateZ(0) rotate(-225deg) translateY(-2px) scale(1.06);}\n  75%{-webkit-transform:translateZ(0) rotate(-270deg) scale(1.02);}\n  87.5%{-webkit-transform:translateZ(0) rotate(-315deg) translateY(2px) scale(1.06);}\n  100%{-webkit-transform:translateZ(0) rotate(-360deg) scale(1);}\n}\n\n@media(max-width:600px){\n  #ma7alak-doze-nutella-orbit{\n    animation-duration:5.8s!important;\n    -webkit-animation-duration:5.8s!important;\n  }\n  .ma7alak-doze-nutella-jar{\n    animation-duration:5.8s!important;\n    -webkit-animation-duration:5.8s!important;\n  }\n}\n\n@media(max-width:380px){\n  #ma7alak-story-wrapper::after{\n    width:calc(100vw - 2px)!important;\n    height:calc(100vw - 2px)!important;\n  }\n\n  #ma7alak-doze-nutella-orbit{\n    width:calc(100vw - 2px)!important;\n    height:calc(100vw - 2px)!important;\n  }\n}\n\n";
  const STORY_MARKUP = "<!-- =========================================================\n     STORY CIRCLE\n========================================================= -->\n\n<div\n  id=\"ma7alak-story-wrapper\"\n  style=\"\n    background:transparent !important;\n    border:none !important;\n    box-shadow:none !important;\n    outline:none !important;\n  \"\n>\n\n  <div\n    id=\"ma7alak-story-new-ring\"\n    aria-hidden=\"true\"\n  ></div>\n\n\n  <div\n    id=\"ma7alak-story-active-ring\"\n    aria-hidden=\"true\"\n  ></div>\n\n\n  <div id=\"ma7alak-doze-luxury-ring\" aria-hidden=\"true\"></div>\n\n  <!-- NUTELLA JAR ORBIT — VISUAL ONLY -->\n  <div id=\"ma7alak-doze-nutella-orbit\" aria-hidden=\"true\">\n    <div class=\"ma7alak-doze-nutella-jar\">\n      <span class=\"nutella-lid\"></span>\n      <span class=\"nutella-glass\">\n        <span class=\"nutella-choco\"></span>\n        <span class=\"nutella-label\"><b>n</b>utella</span>\n      </span>\n    </div>\n  </div>\n\n  <span class=\"ma7alak-doze-orbit-spark s1\" aria-hidden=\"true\"></span>\n  <span class=\"ma7alak-doze-orbit-spark s2\" aria-hidden=\"true\"></span>\n  <span class=\"ma7alak-doze-orbit-spark s3\" aria-hidden=\"true\"></span>\n\n\n  <button\n    id=\"ma7alak-story-button\"\n    type=\"button\"\n    aria-label=\"View stories\"\n  >\n\n    <div id=\"ma7alak-story-preview\">\n\n      <div\n        class=\"ma7alak-story-placeholder\"\n      ></div>\n\n    </div>\n\n  </button>\n\n\n  <button\n    id=\"ma7alak-owner-add-story\"\n    type=\"button\"\n    aria-label=\"Add story\"\n  >\n    +\n  </button>\n\n</div>\n\n\n<!-- =========================================================\n     PREMIUM SHOP IDENTITY\n========================================================= -->\n\n<section id=\"ma7alak-shop-identity\" aria-label=\"Shop identity\">\n  <span class=\"ma7alak-doze-choco-drop d1\" aria-hidden=\"true\"></span>\n  <span class=\"ma7alak-doze-choco-drop d2\" aria-hidden=\"true\"></span>\n  <span class=\"ma7alak-doze-hazelnut n1\" aria-hidden=\"true\"></span>\n  <span class=\"ma7alak-doze-hazelnut n2\" aria-hidden=\"true\"></span>\n<div id=\"ma7alak-doze-crest\" aria-hidden=\"true\">\n    <svg viewBox=\"0 0 64 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M13 19.5C22.2 11.1 40.6 9.8 51 18.6L33.5 51.5L13 19.5Z\" fill=\"rgba(106,45,22,.14)\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>\n      <path d=\"M17.8 21.2C25.2 16.3 39.7 15.1 47.8 20.1\" stroke=\"#F2D4BC\" stroke-width=\"1.7\" stroke-linecap=\"round\"/>\n      <path d=\"M22 26.5C29.2 23 38.3 23.1 44.4 26.6\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" opacity=\".78\"/>\n      <path d=\"M26 31.8C31.2 29.2 36.4 29.2 41.1 31.7\" stroke=\"#4C1C0D\" stroke-width=\"2.3\" stroke-linecap=\"round\"/>\n      <path d=\"M29.1 37.2C32.7 35.7 35.7 35.8 38.4 37.1\" stroke=\"#F2D4BC\" stroke-width=\"1.5\" stroke-linecap=\"round\" opacity=\".85\"/>\n      <circle cx=\"21.4\" cy=\"19.2\" r=\"2\" fill=\"#CF8656\"/>\n      <circle cx=\"42.7\" cy=\"19\" r=\"1.7\" fill=\"#7A3318\"/>\n      <circle cx=\"32\" cy=\"25.8\" r=\"1.5\" fill=\"#F2D4BC\"/>\n    </svg>\n  </div>\n\n  <div id=\"ma7alak-shop-identity-category-row\">\n    <span class=\"ma7alak-shop-identity-line\" aria-hidden=\"true\"></span>\n\n    <div id=\"ma7alak-shop-category-pill\">\n      <span id=\"ma7alak-shop-category-icon\" aria-hidden=\"true\"></span>\n      <span id=\"ma7alak-shop-category-text\"></span>\n    </div>\n\n    <span class=\"ma7alak-shop-identity-line right\" aria-hidden=\"true\"></span>\n  </div>\n\n  <h1 id=\"ma7alak-shop-name\"></h1>\n  <div id=\"ma7alak-shop-arabic-name\"></div>\n\n  <div id=\"ma7alak-doze-flavor-line\" aria-hidden=\"true\">\n    <span>CREPE</span><i></i><span>CHOCOLATE</span><i></i><span>DESSERT</span>\n  </div>\n\n  <div id=\"ma7alak-shop-identity-divider\" aria-hidden=\"true\">\n    <span></span>\n  </div>\n</section>\n\n\n<!-- =========================================================\n     SUPABASE\n========================================================= -->";
  const BACKGROUND_CSS = "\n      html.ma7alak-doze-overlay-active,\n      body.ma7alak-doze-overlay-active{\n        min-height:100%!important;\n      }\n\n      body.ma7alak-doze-overlay-active{\n        position:relative!important;\n        isolation:isolate!important;\n      }\n\n      /*\n        IMPORTANT:\n        This layer sits ABOVE Hostinger's own background,\n        but BELOW your actual content.\n      */\n      #ma7alak-doze-overlay-bg{\n        position:fixed!important;\n        inset:0!important;\n        width:100vw!important;\n        height:100vh!important;\n        width:100dvw!important;\n        height:100dvh!important;\n        z-index:2147483000!important;\n        pointer-events:none!important;\n        overflow:hidden!important;\n        opacity:1!important;\n\n        background:\n          radial-gradient(circle at 14% 17%, rgba(130,62,28,.24), transparent 29%),\n          radial-gradient(circle at 86% 22%, rgba(95,41,18,.21), transparent 30%),\n          radial-gradient(circle at 17% 83%, rgba(103,47,21,.22), transparent 31%),\n          radial-gradient(circle at 84% 77%, rgba(139,68,31,.18), transparent 31%),\n          linear-gradient(180deg,\n            rgba(27,13,8,.91) 0%,\n            rgba(13,7,5,.89) 46%,\n            rgba(22,10,6,.91) 100%\n          )!important;\n      }\n\n      /*\n        Put real page UI above our decorative overlay.\n        We deliberately use an even higher z-index.\n      */\n      body.ma7alak-doze-overlay-active > *:not(#ma7alak-doze-overlay-bg){\n        position:relative!important;\n        z-index:2147483001!important;\n      }\n\n      /*\n        Hostinger often nests the page inside one root wrapper.\n        Keep the wrapper and its children above the background.\n      */\n      body.ma7alak-doze-overlay-active main,\n      body.ma7alak-doze-overlay-active #root,\n      body.ma7alak-doze-overlay-active #__next,\n      body.ma7alak-doze-overlay-active [class*=\"website\"],\n      body.ma7alak-doze-overlay-active [class*=\"page-content\"]{\n        position:relative!important;\n        z-index:2147483001!important;\n      }\n\n      #ma7alak-doze-overlay-bg svg{\n        position:absolute!important;\n        inset:0!important;\n        width:100%!important;\n        height:100%!important;\n        display:block!important;\n      }\n\n      #ma7alak-doze-overlay-bg .m7-dark-center{\n        position:absolute!important;\n        left:50%!important;\n        top:50%!important;\n        width:min(900px,92vw)!important;\n        height:120vh!important;\n        transform:translate(-50%,-50%)!important;\n        background:\n          radial-gradient(\n            ellipse at center,\n            rgba(6,4,3,.42) 0%,\n            rgba(7,4,3,.31) 48%,\n            rgba(7,4,3,.08) 72%,\n            transparent 100%\n          )!important;\n        filter:blur(8px)!important;\n      }\n\n      #ma7alak-doze-overlay-bg .m7-vignette{\n        position:absolute!important;\n        inset:0!important;\n        background:\n          radial-gradient(\n            ellipse at center,\n            rgba(0,0,0,0) 34%,\n            rgba(0,0,0,.18) 64%,\n            rgba(0,0,0,.48) 100%\n          )!important;\n      }\n\n      #ma7alak-doze-overlay-bg .m7-crepe-a{\n        transform-box:fill-box;\n        transform-origin:center;\n        animation:m7CrepeFloatA 10s ease-in-out infinite;\n      }\n\n      #ma7alak-doze-overlay-bg .m7-crepe-b{\n        transform-box:fill-box;\n        transform-origin:center;\n        animation:m7CrepeFloatB 12s ease-in-out infinite;\n      }\n\n      #ma7alak-doze-overlay-bg .m7-choco-gloss{\n        animation:m7ChocoGloss 7s ease-in-out infinite;\n      }\n\n      @keyframes m7CrepeFloatA{\n        0%,100%{transform:translate3d(0,0,0) rotate(-1deg);}\n        50%{transform:translate3d(0,-8px,0) rotate(1deg);}\n      }\n\n      @keyframes m7CrepeFloatB{\n        0%,100%{transform:translate3d(0,0,0) rotate(1deg);}\n        50%{transform:translate3d(0,9px,0) rotate(-1deg);}\n      }\n\n      @keyframes m7ChocoGloss{\n        0%,100%{opacity:.55;}\n        50%{opacity:.90;}\n      }\n\n      @media(max-width:600px){\n        #ma7alak-doze-overlay-bg svg{\n          width:120%!important;\n          left:-10%!important;\n        }\n\n        #ma7alak-doze-overlay-bg .m7-dark-center{\n          width:96vw!important;\n          background:\n            radial-gradient(\n              ellipse at center,\n              rgba(5,3,2,.48) 0%,\n              rgba(6,4,3,.37) 50%,\n              rgba(6,4,3,.10) 76%,\n              transparent 100%\n            )!important;\n        }\n      }\n\n      @media(max-width:380px){\n        #ma7alak-doze-overlay-bg svg{\n          width:128%!important;\n          left:-14%!important;\n        }\n      }\n\n      @media(prefers-reduced-motion:reduce){\n        #ma7alak-doze-overlay-bg *{\n          animation:none!important;\n        }\n      }\n    ";
  const BACKGROUND_MARKUP = "\n      <svg viewBox=\"0 0 1440 2560\" preserveAspectRatio=\"xMidYMid slice\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"m7Crepe\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#f4c98e\"/>\n            <stop offset=\"28%\" stop-color=\"#dfa45f\"/>\n            <stop offset=\"58%\" stop-color=\"#be7439\"/>\n            <stop offset=\"82%\" stop-color=\"#e2a763\"/>\n            <stop offset=\"100%\" stop-color=\"#925025\"/>\n          </linearGradient>\n\n          <linearGradient id=\"m7CrepeHi\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n            <stop offset=\"0%\" stop-color=\"#ffe7ba\" stop-opacity=\".72\"/>\n            <stop offset=\"52%\" stop-color=\"#f4bd7a\" stop-opacity=\".20\"/>\n            <stop offset=\"100%\" stop-color=\"#7a3518\" stop-opacity=\".06\"/>\n          </linearGradient>\n\n          <linearGradient id=\"m7Chocolate\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#955332\"/>\n            <stop offset=\"24%\" stop-color=\"#5d2919\"/>\n            <stop offset=\"58%\" stop-color=\"#2d1109\"/>\n            <stop offset=\"78%\" stop-color=\"#713821\"/>\n            <stop offset=\"100%\" stop-color=\"#180704\"/>\n          </linearGradient>\n\n          <radialGradient id=\"m7Nut\" cx=\"35%\" cy=\"28%\" r=\"75%\">\n            <stop offset=\"0%\" stop-color=\"#d8a46c\"/>\n            <stop offset=\"42%\" stop-color=\"#9b5d33\"/>\n            <stop offset=\"100%\" stop-color=\"#472211\"/>\n          </radialGradient>\n\n          <filter id=\"m7Shadow\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\">\n            <feDropShadow dx=\"0\" dy=\"22\" stdDeviation=\"24\" flood-color=\"#000\" flood-opacity=\".48\"/>\n          </filter>\n        </defs>\n\n        <!-- TOP LEFT CREPE -->\n        <g class=\"m7-crepe-a\" filter=\"url(#m7Shadow)\" opacity=\".88\">\n          <path d=\"M-215 160 C38 83 258 151 403 343 C489 457 470 612 365 738 C231 899 36 943 -190 881 Z\"\n                fill=\"url(#m7Crepe)\"/>\n          <path d=\"M-84 265 C71 196 244 225 346 357 C286 344 225 350 167 378 C61 428 -15 519 -77 634 Z\"\n                fill=\"url(#m7CrepeHi)\"/>\n          <path d=\"M43 270 C133 330 198 405 207 501 C214 568 190 630 145 687\"\n                fill=\"none\" stroke=\"url(#m7Chocolate)\" stroke-width=\"50\" stroke-linecap=\"round\"/>\n          <path class=\"m7-choco-gloss\" d=\"M65 281 C133 334 174 402 180 463\"\n                fill=\"none\" stroke=\"#d99b73\" stroke-opacity=\".28\" stroke-width=\"9\" stroke-linecap=\"round\"/>\n        </g>\n\n        <!-- BOTTOM RIGHT CREPE -->\n        <g class=\"m7-crepe-b\" filter=\"url(#m7Shadow)\" opacity=\".87\">\n          <path d=\"M1080 1768 C1207 1602 1426 1535 1644 1618 L1647 2348 C1437 2416 1240 2326 1127 2179 C1033 2054 1018 1870 1080 1768 Z\"\n                fill=\"url(#m7Crepe)\"/>\n          <path d=\"M1194 1713 C1290 1645 1416 1628 1520 1664 C1415 1737 1366 1842 1370 1954 C1375 2052 1414 2124 1485 2198 C1328 2201 1201 2128 1146 2011 C1101 1913 1116 1792 1194 1713 Z\"\n                fill=\"url(#m7CrepeHi)\" opacity=\".74\"/>\n          <path d=\"M1461 1658 C1348 1742 1283 1836 1282 1949 C1280 2044 1326 2128 1411 2210\"\n                fill=\"none\" stroke=\"url(#m7Chocolate)\" stroke-width=\"51\" stroke-linecap=\"round\"/>\n          <path class=\"m7-choco-gloss\" d=\"M1443 1673 C1367 1737 1326 1811 1315 1883\"\n                fill=\"none\" stroke=\"#da9b71\" stroke-opacity=\".25\" stroke-width=\"9\" stroke-linecap=\"round\"/>\n        </g>\n\n        <!-- TOP RIGHT CHOCOLATE SPLASH -->\n        <g opacity=\".42\">\n          <path d=\"M1116 226 C1248 140 1394 157 1516 267 C1574 320 1607 382 1652 455 C1515 400 1400 408 1299 457 C1227 491 1167 542 1117 610 C1112 450 1109 332 1116 226 Z\"\n                fill=\"url(#m7Chocolate)\"/>\n          <circle cx=\"1245\" cy=\"209\" r=\"27\" fill=\"#70331e\"/>\n          <circle cx=\"1384\" cy=\"177\" r=\"17\" fill=\"#934b2b\"/>\n        </g>\n\n        <!-- HAZELNUT DETAILS -->\n        <g opacity=\".74\">\n          <ellipse cx=\"1118\" cy=\"706\" rx=\"43\" ry=\"36\" fill=\"url(#m7Nut)\" filter=\"url(#m7Shadow)\"/>\n          <ellipse cx=\"1258\" cy=\"805\" rx=\"31\" ry=\"26\" fill=\"url(#m7Nut)\" filter=\"url(#m7Shadow)\"/>\n          <ellipse cx=\"243\" cy=\"1748\" rx=\"37\" ry=\"31\" fill=\"url(#m7Nut)\" filter=\"url(#m7Shadow)\"/>\n        </g>\n\n        <!-- COCOA DUST -->\n        <g fill=\"#d08b5c\" opacity=\".09\">\n          <circle cx=\"331\" cy=\"1101\" r=\"8\"/>\n          <circle cx=\"1111\" cy=\"1160\" r=\"10\"/>\n          <circle cx=\"1191\" cy=\"1361\" r=\"6\"/>\n          <circle cx=\"223\" cy=\"1451\" r=\"8\"/>\n          <circle cx=\"1041\" cy=\"1499\" r=\"7\"/>\n          <circle cx=\"383\" cy=\"2070\" r=\"6\"/>\n        </g>\n      </svg>\n\n      <div class=\"m7-dark-center\"></div>\n      <div class=\"m7-vignette\"></div>\n    ";

  function installBackground(){
    if(!document.getElementById(BG_STYLE_ID)){
      const style = document.createElement("style");
      style.id = BG_STYLE_ID;
      style.textContent = BACKGROUND_CSS;
      document.head.appendChild(style);
    }

    document.documentElement.classList.add("ma7alak-doze-overlay-active");
    document.body.classList.add("ma7alak-doze-overlay-active");

    if(!document.getElementById(BG_ID)){
      const bg = document.createElement("div");
      bg.id = BG_ID;
      bg.setAttribute("aria-hidden","true");
      bg.innerHTML = BACKGROUND_MARKUP;
      document.body.prepend(bg);
    }
  }

  function installStoryStyle(){
    if(document.getElementById(STORY_STYLE_ID)){
      return;
    }

    const style = document.createElement("style");
    style.id = STORY_STYLE_ID;
    style.textContent = STORY_CSS;
    document.head.appendChild(style);
  }

  function chooseMountTarget(){
    return (
      document.querySelector("main") ||
      document.querySelector('[role="main"]') ||
      document.querySelector(".website-content") ||
      document.querySelector(".page-content") ||
      document.body
    );
  }

  function installStoryMarkup(){
    /*
       If the page already contains the Story block, do NOT duplicate it.
       This makes the file safe while testing against an existing Doze page.
    */
    if(document.getElementById("ma7alak-story-wrapper")){
      return;
    }

    const app = document.createElement("div");
    app.id = APP_ID;
    app.innerHTML = STORY_MARKUP;

    const target = chooseMountTarget();

    /*
       Global Hostinger Custom Code has no visual placement block.
       Put the Doze Story/identity experience at the beginning of the
       page's main content. If the original Story markup already exists,
       the code above leaves it exactly where it already is.
    */
    if(target.firstChild){
      target.insertBefore(app, target.firstChild);
    } else {
      target.appendChild(app);
    }
  }

  function loadSupabase(callback){
    if(window.supabase && typeof window.supabase.createClient === "function"){
      callback();
      return;
    }

    const existing = document.querySelector('script[data-ma7alak-supabase-v2="1"]');

    if(existing){
      if(existing.dataset.loaded === "1"){
        callback();
      } else {
        existing.addEventListener("load", callback, {once:true});
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.dataset.ma7alakSupabaseV2 = "1";

    script.addEventListener("load", function(){
      script.dataset.loaded = "1";
      callback();
    }, {once:true});

    script.addEventListener("error", function(){
      console.error("MA7ALAK: Supabase library failed to load.");
    }, {once:true});

    document.head.appendChild(script);
  }

  function bootStoryCode(){
    if(window.__MA7ALAK_DOZE_STORY_LOGIC_BOOTED__){
      return;
    }
    window.__MA7ALAK_DOZE_STORY_LOGIC_BOOTED__ = true;

      (function(){

        "use strict";


        /* =========================================================
           SUPABASE
        ========================================================= */

        const SUPABASE_URL =
          "https://wdtaiuwtqdepzdamgsrs.supabase.co";


        const SUPABASE_KEY =
          "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


        const supabaseClient =
          window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
          );


        /* =========================================================
           SHOP
        ========================================================= */

        const SHOP_SLUG =
          "doze-3ale";

        /* =========================================================
           STORY CIRCLE IMAGE
           PASTE THIS SHOP'S PERMANENT LOGO / IMAGE URL HERE.
           This image NEVER changes when a Story is uploaded.
        ========================================================= */

        const STORY_CIRCLE_IMAGE_URL =
          "https://i.ibb.co/nNhdqmjz/IMG-20260906-WA0108.jpg";


        /* =========================================================
           SHOP IDENTITY — EDIT THESE FOR EACH SHOP
           icon:"auto" detects the icon from category text.
        ========================================================= */

        const SHOP_IDENTITY = {
          category: "CREPE & DESSERTS",
          name: "Doze 3ale",
          arabicName: "3a zaw2ak",
          icon: "crepe"
        };


        /* =========================================================
           SEEN KEY
        ========================================================= */

        const STORY_SEEN_KEY =
          "ma7alak_story_seen_" +
          SHOP_SLUG;


        /* =========================================================
           ELEMENTS
        ========================================================= */

        const storyWrapper =
          document.getElementById(
            "ma7alak-story-wrapper"
          );


        const storyButton =
          document.getElementById(
            "ma7alak-story-button"
          );


        const storyPreview =
          document.getElementById(
            "ma7alak-story-preview"
          );


        const ownerAddButton =
          document.getElementById(
            "ma7alak-owner-add-story"
          );


        const newRing =
          document.getElementById(
            "ma7alak-story-new-ring"
          );


        const activeStoryRing =
          document.getElementById(
            "ma7alak-story-active-ring"
          );


        /* =========================================================
           DATA
        ========================================================= */

        let stories = [];

        let currentStory = 0;

        let timer = null;

        let currentMedia = null;

        let transitionToken = 0;

        let isShopOwner = false;

        let newRingAnimation = null;

        let isDeletingStory = false;


        /* =========================================================
           STORY LIKES
        ========================================================= */

        const VISITOR_ID_KEY =
          "ma7alak_visitor_id";

        let visitorId = null;

        const likedStoryIds = new Set();

        /*
           Avoid sending the same Story-view request repeatedly
           during one page session. Supabase also enforces one
           unique view per visitor per Story.
        */
        const recordedStoryViews = new Set();

        try{

          visitorId =
            localStorage.getItem(
              VISITOR_ID_KEY
            );

        }
        catch(error){}

        if(!visitorId){

          try{

            visitorId =
              crypto.randomUUID();

          }
          catch(error){

            visitorId =
              "visitor_" +
              Date.now() +
              "_" +
              Math.random()
                .toString(36)
                .slice(2);

          }

          try{

            localStorage.setItem(
              VISITOR_ID_KEY,
              visitorId
            );

          }
          catch(error){}

        }

        try{

          const savedLikes =
            JSON.parse(
              localStorage.getItem(
                "ma7alak_story_liked_ids"
              ) || "[]"
            );

          if(Array.isArray(savedLikes)){

            savedLikes.forEach(
              function(id){

                if(id != null){
                  likedStoryIds.add(
                    String(id)
                  );
                }

              }
            );

          }

        }
        catch(error){}

        function saveLikedStories(){

          try{

            localStorage.setItem(
              "ma7alak_story_liked_ids",
              JSON.stringify(
                Array.from(
                  likedStoryIds
                )
              )
            );

          }
          catch(error){}

        }


        /* =========================================================
           PREMIUM SHOP IDENTITY — AUTO CATEGORY ICON
        ========================================================= */

        function normalizeIdentityText(value){
          return String(value || "").toLowerCase().trim();
        }

        function detectShopIconKey(){

          const forced =
            normalizeIdentityText(
              SHOP_IDENTITY && SHOP_IDENTITY.icon
            );

          if(forced && forced !== "auto"){
            return forced;
          }

          const category =
            normalizeIdentityText(
              SHOP_IDENTITY && SHOP_IDENTITY.category
            );

          if(category.includes("cafe") || category.includes("coffee") || category.includes("كافيه") || category.includes("قهوة")) return "cafe";
          if(category.includes("tattoo") || category.includes("piercing") || category.includes("تاتو") || category.includes("بيرسنغ")) return "tattoo";
          if(category.includes("phone") || category.includes("mobile") || category.includes("cell") || category.includes("electronics") || category.includes("موبايل")) return "phone";
          if(category.includes("fashion") || category.includes("clothing") || category.includes("clothes") || category.includes("boutique") || category.includes("ملابس")) return "fashion";
          if(category.includes("barber") || category.includes("hair") || category.includes("حلاق")) return "barber";
          if(category.includes("beauty") || category.includes("nails") || category.includes("salon") || category.includes("makeup") || category.includes("صالون")) return "beauty";
          if(category.includes("restaurant") || category.includes("food") || category.includes("kitchen") || category.includes("مطعم")) return "food";
          if(category.includes("gym") || category.includes("fitness") || category.includes("sport") || category.includes("جيم")) return "gym";
          if(category.includes("kiosk") || category.includes("market") || category.includes("دكان") || category.includes("كشك")) return "kiosk";

          return "shop";
        }

        function shopIdentityIconSVG(iconKey){

          const common =
            'viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

          switch(iconKey){

            case "crepe":
              return `<svg ${common}>
                <path d="M4.5 7.2c4.5-3.1 10.6-3.1 15 0L12 20.2 4.5 7.2Z"/>
                <path d="M7.4 8.7c3.2-1.8 6-1.8 9.2 0"/>
                <path d="M9.2 11c2-1.1 3.6-1.1 5.6 0"/>
                <circle cx="8" cy="7.2" r=".9" fill="currentColor" stroke="none"/>
                <circle cx="15.8" cy="7.3" r=".8" fill="currentColor" stroke="none"/>
              </svg>`;

            case "cafe":
              return `<svg ${common}>
                <path d="M7.3 14.8c3.7 1.1 7.3-.8 8.4-4.4.7-2.2.2-4.5-1.1-6.2-3.8.3-6.9 2.9-7.8 6.2-.4 1.5-.2 3 .5 4.4Z"/>
                <path d="M8.1 14.2c2.1-1.7 4.1-4.2 5.6-7.1"/>
                <path d="M5 18.3h14"/>
              </svg>`;

            case "tattoo":
              return `<svg ${common}>
                <path d="m5 18 9.2-9.2 2 2L7 20H5v-2Z"/>
                <path d="m13.2 7.8 2.2-2.2 3 3-2.2 2.2"/>
                <path d="M4 6c2.2 0 2.2-2 4.4-2S10.6 6 12.8 6"/>
              </svg>`;

            case "phone":
              return `<svg ${common}>
                <rect x="7" y="2.8" width="10" height="18.4" rx="2.2"/>
                <path d="M10 5.6h4M11.2 18.3h1.6"/>
              </svg>`;

            case "fashion":
              return `<svg ${common}>
                <path d="M9 5.2a3 3 0 0 0 6 0"/>
                <path d="m9.2 7-5 3.2 2.1 3 2.2-1.2V21h7v-9l2.2 1.2 2.1-3-5-3.2"/>
              </svg>`;

            case "barber":
              return `<svg ${common}>
                <circle cx="6.5" cy="7" r="2.2"/>
                <circle cx="6.5" cy="17" r="2.2"/>
                <path d="m8.4 8.2 10 7.3M8.4 15.8l10-7.3"/>
              </svg>`;

            case "beauty":
              return `<svg ${common}>
                <path d="M12 3.2 13.4 8l4.8 1.4-4.8 1.4L12 15.6l-1.4-4.8-4.8-1.4L10.6 8 12 3.2Z"/>
              </svg>`;

            case "food":
              return `<svg ${common}>
                <path d="M6 3v7M3.8 3v4.2C3.8 8.8 4.8 10 6 10s2.2-1.2 2.2-2.8V3M6 10v11"/>
                <path d="M15 3v18M15 3c3 1.7 4.6 4.1 4.6 7.2H15"/>
              </svg>`;

            case "gym":
              return `<svg ${common}>
                <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>
              </svg>`;

            case "kiosk":
              return `<svg ${common}>
                <path d="M4 9h16M5 4l-1 5c0 1.3 1 2.3 2.3 2.3 1.1 0 2-.7 2.3-1.7.3 1 1.2 1.7 2.4 1.7s2.1-.7 2.4-1.7c.3 1 1.2 1.7 2.3 1.7C19 11.3 20 10.3 20 9l-1-5H5Z"/>
                <path d="M6 11.3V21h12v-9.7M9 21v-5h6v5"/>
              </svg>`;

            default:
              return `<svg ${common}>
                <path d="M4 10.5 12 4l8 6.5M6 9.5V21h12V9.5M9 21v-6h6v6"/>
              </svg>`;
          }
        }

        function renderShopIdentity(){

          const root = document.getElementById("ma7alak-shop-identity");
          const categoryText = document.getElementById("ma7alak-shop-category-text");
          const icon = document.getElementById("ma7alak-shop-category-icon");
          const name = document.getElementById("ma7alak-shop-name");
          const arabicName = document.getElementById("ma7alak-shop-arabic-name");

          if(!root) return;

          if(categoryText){
            categoryText.textContent = String(SHOP_IDENTITY.category || "");
          }

          if(icon){
            icon.innerHTML = shopIdentityIconSVG(detectShopIconKey());
          }

          if(name){
            name.textContent = String(SHOP_IDENTITY.name || "");
          }

          if(arabicName){
            const value = String(SHOP_IDENTITY.arabicName || "").trim();
            arabicName.textContent = value;
            arabicName.style.display = value ? "block" : "none";
          }

          root.classList.add("ma7alak-identity-ready");
        }


        /* =========================================================
           STORY URL
        ========================================================= */

        function storyURL(path){

          return (
            SUPABASE_URL +
            "/storage/v1/object/public/shop-stories/" +
            path
          );

        }


        /* =========================================================
           MEDIA TYPE
        ========================================================= */

        function mediaType(story){

          if(
            story.media_type ===
            "video"
          ){

            return "video";

          }


          if(
            story.media_type ===
            "image"
          ){

            return "image";

          }


          const path =
            String(
              story.storage_path ||
              ""
            ).toLowerCase();


          if(
            path.endsWith(".mp4") ||
            path.endsWith(".webm") ||
            path.endsWith(".mov") ||
            path.endsWith(".m4v")
          ){

            return "video";

          }


          return "image";

        }


        /* =========================================================
           TIME AGO
        ========================================================= */

        function storyTimeAgo(createdAt){

          const created =
            new Date(createdAt).getTime();

          if(!Number.isFinite(created)){
            return "Just now";
          }

          const now = Date.now();

          let seconds =
            Math.floor(
              (now - created) /
              1000
            );

          if(seconds < 0){
            seconds = 0;
          }

          if(seconds < 10){
            return "Just now";
          }

          if(seconds < 60){
            return seconds + (seconds === 1 ? " second ago" : " seconds ago");
          }

          const minutes =
            Math.floor(seconds / 60);

          if(minutes < 60){
            return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
          }

          const hours =
            Math.floor(minutes / 60);

          if(hours < 24){
            return hours + (hours === 1 ? " hour ago" : " hours ago");
          }

          const days =
            Math.floor(hours / 24);

          if(days === 1){
            return "Yesterday";
          }

          if(days < 7){
            return days + " days ago";
          }

          const weeks =
            Math.floor(days / 7);

          if(weeks === 1){
            return "1 week ago";
          }

          return weeks + " weeks ago";

        }


        /* =========================================================
           UPDATE STORY TIME
        ========================================================= */

        function updateStoryTime(){

          const timeElement =
            document.getElementById(
              "ma7alak-story-time"
            );

          const nameElement =
            document.getElementById(
              "ma7alak-story-shop-name"
            );


          if(
            !stories.length
          ){

            return;

          }


          const story =
            stories[
              currentStory
            ];


          if(!story){

            return;

          }


          if(timeElement){

            timeElement.textContent =
              storyTimeAgo(
                story.created_at
              );

          }


          if(nameElement){

            const shopName =
              String(story.shop_slug || SHOP_SLUG)
                .split("-")
                .filter(Boolean)
                .map(function(part){
                  return part.charAt(0).toUpperCase() + part.slice(1);
                })
                .join(" ");

            nameElement.textContent =
              shopName || "Ma7alak";

            /*
              Every Story already has its own unique Supabase
              story.id. Keep that ID attached to the displayed
              shop name so the name always belongs to the exact
              Story currently open.
            */
            nameElement.setAttribute(
              "data-story-id",
              String(story.id)
            );

          }

        }


        /* =========================================================
           START NEW STORY ANIMATION
        ========================================================= */

        function startNewStoryAnimation(){

          if(!storyWrapper){

            return;

          }


          storyWrapper.classList.remove(
            "story-has-new"
          );


          void storyWrapper.offsetWidth;


          storyWrapper.classList.add(
            "story-has-new"
          );


          if(
            newRing &&
            typeof newRing.animate ===
            "function"
          ){

            try{

              if(
                newRingAnimation
              ){

                newRingAnimation.cancel();

              }


              newRingAnimation =
                newRing.animate(

                  [

                    {

                      transform:
                        "translate(-50%,-50%) scale(.88)",

                      opacity:1

                    },

                    {

                      transform:
                        "translate(-50%,-50%) scale(1.08)",

                      opacity:.58

                    },

                    {

                      transform:
                        "translate(-50%,-50%) scale(1.30)",

                      opacity:0

                    }

                  ],

                  {

                    duration:1650,

                    easing:
                      "cubic-bezier(.2,.65,.3,1)",

                    iterations:
                      Infinity

                  }

                );

            }

            catch(error){

              console.log(
                "MA7ALAK animation fallback"
              );

            }

          }

        }


        /* =========================================================
           STOP NEW STORY ANIMATION
        ========================================================= */

        function stopNewStoryAnimation(){

          if(
            storyWrapper
          ){

            storyWrapper.classList.remove(
              "story-has-new"
            );

          }


          if(
            newRingAnimation
          ){

            try{

              newRingAnimation.cancel();

            }

            catch(error){}


            newRingAnimation =
              null;

          }


          if(newRing){

            newRing.style.opacity =
              "0";

          }

        }


        /* =========================================================
           CHECK NEW STORY
        ========================================================= */

        function updateNewStoryAnimation(){

          if(!storyWrapper){

            return;

          }


          if(
            !stories.length
          ){

            stopNewStoryAnimation();

            return;

          }


          const newestStory =
            stories[0];


          let lastSeen =
            null;


          try{

            lastSeen =
              localStorage.getItem(
                STORY_SEEN_KEY
              );

          }

          catch(error){

            lastSeen =
              null;

          }


          if(!lastSeen){

            startNewStoryAnimation();

            return;

          }


          const newestTime =
            new Date(
              newestStory.created_at
            ).getTime();


          const lastSeenTime =
            new Date(
              lastSeen
            ).getTime();


          if(
            newestTime >
            lastSeenTime
          ){

            startNewStoryAnimation();

          }

          else{

            stopNewStoryAnimation();

          }

        }


        /* =========================================================
           MARK STORIES AS SEEN
        ========================================================= */

        function markStoriesAsSeen(){

          if(
            !stories.length
          ){

            return;

          }


          const newestStory =
            stories[0];


          if(
            !newestStory.created_at
          ){

            return;

          }


          try{

            localStorage.setItem(
              STORY_SEEN_KEY,
              newestStory.created_at
            );

          }

          catch(error){}


          stopNewStoryAnimation();

        }


        /* =========================================================
           CHECK OWNER
        ========================================================= */

        async function checkShopOwner(){

          try{

            const result =
              await supabaseClient.auth.getSession();


            const session =
              result &&
              result.data &&
              result.data.session;


            if(!session){

              isShopOwner =
                false;

              ownerAddButton.classList.remove(
                "visible"
              );

              updateStoryViewCount();

              return;

            }


            const user =
              session.user;


            if(!user){

              isShopOwner =
                false;

              ownerAddButton.classList.remove(
                "visible"
              );

              updateStoryViewCount();

              return;

            }


            const ownerResult =
              await supabaseClient
                .from("shop_owners")
                .select(
                  "shop_slug"
                )
                .eq(
                  "user_id",
                  user.id
                )
                .eq(
                  "shop_slug",
                  SHOP_SLUG
                )
                .maybeSingle();


            if(
              ownerResult.error ||
              !ownerResult.data
            ){

              isShopOwner =
                false;

              ownerAddButton.classList.remove(
                "visible"
              );

              updateStoryViewCount();

              return;

            }


            isShopOwner =
              true;


            ownerAddButton.classList.add(
              "visible"
            );

            updateStoryViewCount();

          }

          catch(error){

            console.error(
              "MA7ALAK owner check:",
              error
            );

            isShopOwner =
              false;

            ownerAddButton.classList.remove(
              "visible"
            );

          }

        }


        /* =========================================================
           OPEN OWNER UPLOADER

           IMPORTANT:
           The actual uploader is handled by
           PAGE-LEVEL CUSTOM CODE.
        ========================================================= */

        function openOwnerUpload(){

          if(!isShopOwner){

            return;

          }

          /*
             Prevent the live uploader bridge from firing into
             Hostinger's editor shell while previewing the page.
          */
          if(window.self !== window.top){
            console.log(
              "MA7ALAK: uploader bridge disabled in Hostinger editor preview."
            );
            return;
          }


          try{

            window.parent.postMessage(

              {

                type:
                  "MA7ALAK_OPEN_STORY_UPLOADER",

                shopSlug:
                  SHOP_SLUG

              },

              "*"

            );

          }

          catch(error){

            console.error(
              "MA7ALAK uploader bridge:",
              error
            );

          }

        }


        /* =========================================================
           UPLOAD FINISHED MESSAGE
        ========================================================= */

        window.addEventListener(
          "message",
          function(event){

            if(
              !event.data ||
              event.data.type !==
              "MA7ALAK_STORY_UPLOADED"
            ){

              return;

            }


            if(
              event.data.shopSlug !==
              SHOP_SLUG
            ){

              return;

            }


            loadStories();

          }
        );


        /* =========================================================
           PERMANENT STORY CIRCLE IMAGE
           The Story itself NEVER replaces this image.
        ========================================================= */

        function renderStoryCircleImage(){

          if(!storyPreview){
            return;
          }

          const imageURL =
            String(
              STORY_CIRCLE_IMAGE_URL || ""
            ).trim();

          storyPreview.innerHTML = "";

          if(
            !imageURL ||
            imageURL === "PASTE_IMAGE_URL_HERE"
          ){

            const placeholder =
              document.createElement("div");

            placeholder.className =
              "ma7alak-story-placeholder";

            storyPreview.appendChild(
              placeholder
            );

            return;

          }

          const image =
            document.createElement("img");

          image.src =
            imageURL;

          image.alt =
            "Shop logo";

          image.loading =
            "eager";

          image.decoding =
            "async";

          storyPreview.appendChild(
            image
          );

        }


        /* =========================================================
           LOAD STORIES
        ========================================================= */

        async function loadStories(){

          /*
             Always keep the permanent shop image in the circle.
             Stories only control the ring + fullscreen Story viewer.
          */
          renderStoryCircleImage();

          try{

            const now =
              new Date().toISOString();


            const result =
              await supabaseClient
                .from("shop_stories")
                .select(
                  "id,shop_slug,media_type,storage_path,expires_at,created_at"
                )
                .eq(
                  "shop_slug",
                  SHOP_SLUG
                )
                .gt(
                  "expires_at",
                  now
                )
                .order(
                  "created_at",
                  {
                    ascending:false
                  }
                );


            if(
              result.error
            ){

              console.error(
                "MA7ALAK Stories:",
                result.error
              );

              return;

            }


            stories =
              result.data || [];


            if(storyWrapper){

              storyWrapper.classList.toggle(
                "story-has-story",
                stories.length > 0
              );

            }


            /*
               Keep the same permanent logo whether there are
               zero Stories, image Stories, or video Stories.
            */
            renderStoryCircleImage();


            /*
               The existing new-Story gold animation still works.
            */
            updateNewStoryAnimation();

          }

          catch(error){

            console.error(
              "MA7ALAK Stories:",
              error
            );

          }

        }

        /* =========================================================
           CREATE STORY VIEWER
        ========================================================= */

        function createStoryScreen(){

          const existing =
            document.getElementById(
              "ma7alak-full-story"
            );


          if(existing){

            return existing;

          }


          const screen =
            document.createElement(
              "div"
            );


          screen.id =
            "ma7alak-full-story";


          screen.innerHTML = `

            <div
              id="ma7alak-full-story-media"
            ></div>


            <div
              id="ma7alak-story-progress-wrap"
            ></div>


            <div
              id="ma7alak-story-shop-name"
            ></div>


            <div
              id="ma7alak-story-time"
            ></div>


            <button
              id="ma7alak-story-delete-btn"
              type="button"
              aria-label="Delete story"
            >
              🗑️
            </button>


            <div
              id="ma7alak-story-view-count"
              aria-label="Story views"
            >
              <span class="ma7alak-view-eye">👁</span>
              <span class="ma7alak-view-number">0</span>
              <span class="ma7alak-view-label">views</span>
            </div>


            <div
              id="ma7alak-story-heart-burst"
              aria-hidden="true"
            ></div>


            <button
              id="ma7alak-story-like-btn"
              type="button"
              aria-label="Like story"
            >
              <span class="ma7alak-like-heart">♡</span>
            </button>


            <button
              id="ma7alak-story-tap-left"
              type="button"
              aria-label="Previous story"
            ></button>


            <button
              id="ma7alak-story-tap-right"
              type="button"
              aria-label="Next story"
            ></button>


            <button
              id="ma7alak-story-close-btn"
              type="button"
              aria-label="Close"
            >
              ×
            </button>

          `;


          document.body.appendChild(
            screen
          );

          /*
            Final safety net for mobile/fullscreen:
            if a parent or another transparent control
            receives the event first, detect the Like
            button and handle it here.
          */
          screen.addEventListener(
            "click",
            function(event){

              const target =
                event.target &&
                event.target.closest &&
                event.target.closest(
                  "#ma7alak-story-like-btn"
                );

              if(!target){
                return;
              }

              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();

              likeCurrentStory();

            },
            true
          );


          document
            .getElementById(
              "ma7alak-story-close-btn"
            )
            .onclick =
            closeStories;


          document
            .getElementById(
              "ma7alak-story-tap-right"
            )
            .onclick =
            nextStory;


          document
            .getElementById(
              "ma7alak-story-tap-left"
            )
            .onclick =
            previousStory;


          document
            .getElementById(
              "ma7alak-story-delete-btn"
            )
            .onclick =
            deleteCurrentStory;


          const likeButton =
            document.getElementById(
              "ma7alak-story-like-btn"
            );

          if(likeButton){

            /*
              IMPORTANT:
              Use the button itself as the click target.
              The story navigation tap areas must NEVER
              be able to steal a Like press.
            */
            likeButton.onclick = function(event){

              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();

              likeCurrentStory();

              return false;

            };

            likeButton.addEventListener(
              "pointerdown",
              function(event){
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
              },
              true
            );

            likeButton.addEventListener(
              "touchstart",
              function(event){
                event.stopPropagation();
              },
              {passive:true,capture:true}
            );

          }


          return screen;

        }


        /* =========================================================
           UPDATE OWNER DELETE BUTTON
        ========================================================= */

        function updateDeleteButton(){

          const deleteButton =
            document.getElementById(
              "ma7alak-story-delete-btn"
            );


          if(
            !deleteButton
          ){

            return;

          }


          if(
            isShopOwner &&
            stories.length
          ){

            deleteButton.classList.add(
              "visible"
            );

          }

          else{

            deleteButton.classList.remove(
              "visible"
            );

          }

        }


        /* =========================================================
           DELETE CURRENT STORY
        ========================================================= */

        async function deleteCurrentStory(){

          if(
            !isShopOwner ||
            isDeletingStory ||
            !stories.length
          ){

            return;

          }


          const story =
            stories[
              currentStory
            ];


          if(!story){

            return;

          }


          const confirmed =
            window.confirm(
              "حذف هالستوري؟\n\nما رح تقدر ترجعها بعد الحذف."
            );


          if(!confirmed){

            return;

          }


          try{

            isDeletingStory =
              true;


            const deleteButton =
              document.getElementById(
                "ma7alak-story-delete-btn"
              );


            if(deleteButton){

              deleteButton.disabled =
                true;

              deleteButton.textContent =
                "⏳";

            }


            clearInterval(
              timer
            );


            /*
              Stop current video immediately.
            */

            if(
              currentMedia &&
              currentMedia.tagName ===
              "VIDEO"
            ){

              try{

                currentMedia.pause();

                currentMedia.muted =
                  true;

              }

              catch(error){}

            }


            /*
              Delete physical file first.
            */

            const storageResult =
              await supabaseClient
                .storage
                .from("shop-stories")
                .remove([
                  story.storage_path
                ]);


            if(
              storageResult.error
            ){

              throw storageResult.error;

            }


            /*
              Delete database row.
            */

            const databaseResult =
              await supabaseClient
                .from("shop_stories")
                .delete()
                .eq(
                  "id",
                  story.id
                )
                .eq(
                  "shop_slug",
                  SHOP_SLUG
                );


            if(
              databaseResult.error
            ){

              throw databaseResult.error;

            }


            /*
              Remove locally.
            */

            stories.splice(
              currentStory,
              1
            );


            /*
              No stories left.
            */

            if(
              stories.length === 0
            ){

              closeStories();

              await loadStories();

              return;

            }


            /*
              If we deleted the last story,
              move to the new last story.
            */

            if(
              currentStory >=
              stories.length
            ){

              currentStory =
                stories.length - 1;

            }


            createProgressBars();


            showStory(
              currentStory
            );


            await loadStories();

          }

          catch(error){

            console.error(
              "MA7ALAK delete story error:",
              error
            );


            alert(
              "صار خطأ أثناء حذف الستوري. جرّب مرة ثانية."
            );

          }

          finally{

            isDeletingStory =
              false;


            const deleteButton =
              document.getElementById(
                "ma7alak-story-delete-btn"
              );


            if(deleteButton){

              deleteButton.disabled =
                false;

              deleteButton.textContent =
                "🗑️";

            }


            updateDeleteButton();

          }

        }


        /* =========================================================
           PROGRESS BARS
        ========================================================= */

        function createProgressBars(){

          const wrap =
            document.getElementById(
              "ma7alak-story-progress-wrap"
            );


          if(!wrap){

            return;

          }


          wrap.innerHTML =
            "";


          stories.forEach(
            function(){

              const segment =
                document.createElement(
                  "div"
                );


              segment.className =
                "ma7alak-story-progress-segment";


              const fill =
                document.createElement(
                  "div"
                );


              fill.className =
                "ma7alak-story-progress-fill";


              segment.appendChild(
                fill
              );


              wrap.appendChild(
                segment
              );

            }
          );

        }


        /* =========================================================
           UPDATE PROGRESS
        ========================================================= */

        function updateProgressBars(
          activeIndex,
          percent
        ){

          const fills =
            document.querySelectorAll(
              ".ma7alak-story-progress-fill"
            );


          fills.forEach(
            function(
              fill,
              index
            ){

              if(
                index <
                activeIndex
              ){

                fill.style.width =
                  "100%";

              }

              else if(
                index ===
                activeIndex
              ){

                fill.style.width =
                  Math.max(
                    0,
                    Math.min(
                      100,
                      percent
                    )
                  ) +
                  "%";

              }

              else{

                fill.style.width =
                  "0%";

              }

            }
          );

        }


        /* =========================================================
           OPEN STORIES
        ========================================================= */

        function openStories(){

          if(
            stories.length === 0
          ){

            alert(
              "ما في ستوري حالياً 📸"
            );

            return;

          }


          markStoriesAsSeen();


          const screen =
            createStoryScreen();


          currentStory =
            0;


          screen.style.position =
            "fixed";


          screen.style.left =
            "0";


          screen.style.top =
            "0";


          screen.style.width =
            "100vw";


          screen.style.height =
            "100vh";


          screen.classList.add(
            "active"
          );


          document.documentElement.style.overflow =
            "hidden";


          document.body.style.overflow =
            "hidden";


          createProgressBars();


          updateDeleteButton();


          enterNativeFullscreen(
            screen
          );


          showStory(
            currentStory
          );

        }


        /* =========================================================
           NATIVE FULLSCREEN
        ========================================================= */

        function enterNativeFullscreen(
          screen
        ){

          /*
             Hostinger editor runs inside an iframe.
             Show the Story viewer there, but do not request
             browser-native fullscreen from the editor canvas.
          */
          if(window.self !== window.top){
            return;
          }

          try{

            if(
              screen.requestFullscreen
            ){

              const request =
                screen.requestFullscreen();


              if(
                request &&
                typeof request.catch ===
                "function"
              ){

                request.catch(
                  function(){}
                );

              }

            }

            else if(
              screen.webkitRequestFullscreen
            ){

              screen.webkitRequestFullscreen();

            }

          }

          catch(error){}

        }


        /* =========================================================
           CREATE MEDIA
        ========================================================= */

        function createMediaElement(
          story
        ){

          const type =
            mediaType(
              story
            );


          const url =
            storyURL(
              story.storage_path
            );


          let media;


          if(
            type === "video"
          ){

            media =
              document.createElement(
                "video"
              );


            media.autoplay =
              false;


            media.muted =
              true;


            media.playsInline =
              true;


            media.controls =
              false;


            media.preload =
              "auto";


            media.setAttribute(
              "playsinline",
              ""
            );


            media.setAttribute(
              "webkit-playsinline",
              ""
            );


            media.setAttribute(
              "disablepictureinpicture",
              ""
            );


            media.setAttribute(
              "controlslist",
              "nodownload noplaybackrate"
            );

          }

          else{

            media =
              document.createElement(
                "img"
              );


            media.alt =
              "Story";

          }


          media.className =
            "ma7alak-story-media-layer";


          media.src =
            url;


          media.style.opacity =
            "0";


          media.style.visibility =
            "hidden";


          return {

            media:
              media,

            type:
              type,

            url:
              url

          };

        }


        /* =========================================================
           STORY VIEW TRACKING
        ========================================================= */

        async function recordCurrentStoryView(){

          const story =
            stories[currentStory];

          if(
            !story ||
            !story.id ||
            !visitorId
          ){
            return;
          }

          const storyId =
            String(story.id);

          if(
            recordedStoryViews.has(
              storyId
            )
          ){
            return;
          }

          /*
             Mark locally first so fast swipes/back-and-forth do not
             fire duplicate requests. The database unique constraint
             is the final protection against duplicate views.
          */
          recordedStoryViews.add(
            storyId
          );

          try{

            const result =
              await supabaseClient.rpc(
                "record_story_view",
                {
                  p_story_id:
                    story.id,

                  p_shop_slug:
                    story.shop_slug || SHOP_SLUG,

                  p_visitor_id:
                    visitorId
                }
              );

            if(result.error){
              throw result.error;
            }

          }
          catch(error){

            /*
               Allow a retry later if the network request failed.
            */
            recordedStoryViews.delete(
              storyId
            );

            console.error(
              "MA7ALAK story view:",
              error
            );

          }

        }


        async function updateStoryViewCount(){

          const box =
            document.getElementById(
              "ma7alak-story-view-count"
            );

          if(!box){
            return;
          }

          /*
             Only the verified shop owner can ever see this control.
          */
          if(
            !isShopOwner ||
            !stories.length
          ){
            box.classList.remove(
              "visible"
            );
            return;
          }

          const story =
            stories[currentStory];

          if(
            !story ||
            !story.id
          ){
            box.classList.remove(
              "visible"
            );
            return;
          }

          box.classList.add(
            "visible"
          );

          const number =
            box.querySelector(
              ".ma7alak-view-number"
            );

          const label =
            box.querySelector(
              ".ma7alak-view-label"
            );

          try{

            const result =
              await supabaseClient.rpc(
                "get_story_view_count",
                {
                  p_story_id:
                    story.id,

                  p_shop_slug:
                    story.shop_slug || SHOP_SLUG
                }
              );

            if(result.error){
              throw result.error;
            }

            const count =
              Math.max(
                0,
                Number(result.data) || 0
              );

            if(number){
              number.textContent =
                String(count);
            }

            if(label){
              label.textContent =
                count === 1
                  ? "view"
                  : "views";
            }

          }
          catch(error){

            /*
               If Supabase rejects the owner-only count request,
               hide it instead of exposing an incorrect number.
            */
            box.classList.remove(
              "visible"
            );

            console.error(
              "MA7ALAK story view count:",
              error
            );

          }

        }


        /* =========================================================
           STORY LIKE BUTTON STATE
        ========================================================= */

        function updateLikeButton(){

          const button =
            document.getElementById(
              "ma7alak-story-like-btn"
            );

          if(!button){
            return;
          }

          const story =
            stories[currentStory];

          if(!story){
            button.style.display = "none";
            return;
          }

          button.style.display = "flex";

          const liked =
            likedStoryIds.has(
              String(story.id)
            );

          const heart =
            button.querySelector(
              ".ma7alak-like-heart"
            );

          if(liked){

            button.classList.add("liked");

            if(heart){
              heart.textContent = "♥";
            }

            button.setAttribute(
              "aria-label",
              "Story liked"
            );

          }
          else{

            button.classList.remove("liked");

            if(heart){
              heart.textContent = "♡";
            }

            button.setAttribute(
              "aria-label",
              "Like story"
            );

          }

        }


        function launchLikeHearts(){

          const burst =
            document.getElementById(
              "ma7alak-story-heart-burst"
            );

          if(!burst){ return; }

          burst.innerHTML = "";

          for(let i = 0; i < 14; i++){
            const heart = document.createElement("span");
            heart.className = "ma7alak-story-floating-heart";
            heart.textContent = "♥";
            heart.style.setProperty("--heart-x", ((Math.random() * 240) - 120) + "px");
            heart.style.setProperty("--heart-y", (-(230 + Math.random() * 330)) + "px");
            heart.style.setProperty("--heart-scale", (.65 + Math.random() * 1.15).toFixed(2));
            heart.style.setProperty("--heart-rotate", ((Math.random() * 60) - 30) + "deg");
            heart.style.setProperty("--heart-duration", (1.05 + Math.random() * .75).toFixed(2) + "s");
            heart.style.fontSize = (20 + Math.random() * 22) + "px";
            heart.style.animationDelay = (Math.random() * .16) + "s";
            burst.appendChild(heart);
          }

          setTimeout(function(){
            if(burst){ burst.innerHTML = ""; }
          }, 2100);
        }


        /* =========================================================
           LIKE CURRENT STORY
        ========================================================= */

        async function likeCurrentStory(){

          const story =
            stories[currentStory];

          if(!story || !story.id || !visitorId){
            console.warn(
              "MA7ALAK: cannot like story - missing story ID or visitor ID"
            );
            return;
          }

          const storyId =
            String(story.id);

          const button =
            document.getElementById(
              "ma7alak-story-like-btn"
            );

          /*
            Each story/video has its own ID.
            One visitor can therefore like Story 1, Story 2,
            Story 3, etc. independently.
          */
          if(likedStoryIds.has(storyId)){
            updateLikeButton();
            return;
          }

          if(button){
            button.disabled = true;
            button.style.pointerEvents = "none";
          }

          try{

            const result =
              await supabaseClient.rpc(
                "like_story",
                {
                  p_story_id: story.id,
                  p_visitor_id: visitorId
                }
              );

            if(result.error){
              throw result.error;
            }

            const data =
              result.data;

            console.log(
              "MA7ALAK story like result:",
              data
            );

            if(!data || data.success !== true){
              throw new Error(
                (data && data.message) ||
                "Like was not accepted by Supabase"
              );
            }

            /*
              Supabase is the source of truth.
              If this visitor already liked this exact story,
              the RPC returns already_liked=true and we still
              show the correct liked state.
            */
            likedStoryIds.add(storyId);
            saveLikedStories();

            updateLikeButton();
            launchLikeHearts();

          }
          catch(error){

            console.error(
              "MA7ALAK story like error:",
              error
            );

            alert(
              "ما قدرنا نسجّل اللايك. جرّب مرة ثانية."
            );

            /*
              Do not permanently mark the story as liked when
              Supabase rejects the request.
            */
            likedStoryIds.delete(storyId);
            saveLikedStories();

          }
          finally{

            if(button){
              button.disabled = false;
              button.style.pointerEvents = "auto";
            }

          }

        }


        /* =========================================================
           SHOW STORY
        ========================================================= */

        function showStory(
          index
        ){

          if(
            !stories.length
          ){

            return;

          }


          clearInterval(
            timer
          );


          if(
            index < 0
          ){

            index =
              stories.length - 1;

          }


          if(
            index >=
            stories.length
          ){

            index =
              0;

          }


          currentStory =
            index;


          const story =
            stories[
              currentStory
            ];


          const screen =
            document.getElementById(
              "ma7alak-full-story"
            );


          const container =
            document.getElementById(
              "ma7alak-full-story-media"
            );


          if(
            !screen ||
            !container
          ){

            return;

          }


          /*
            Update timestamp immediately.
          */

          updateStoryTime();


          /*
            Make sure owner controls match
            current authentication state.
          */

          updateDeleteButton();
          updateLikeButton();

          /*
             Record one unique view for this exact Story.
             The owner-only eye/count is refreshed separately.
          */
          recordCurrentStoryView();
          updateStoryViewCount();


          const thisTransition =
            ++transitionToken;


          updateProgressBars(
            currentStory,
            0
          );


          if(
            currentMedia &&
            currentMedia.tagName ===
            "VIDEO"
          ){

            try{

              currentMedia.pause();

              currentMedia.muted =
                true;

            }

            catch(error){}

          }


          const result =
            createMediaElement(
              story
            );


          const media =
            result.media;


          const type =
            result.type;


          container.appendChild(
            media
          );


          function activateMedia(){

            if(
              thisTransition !==
              transitionToken
            ){

              if(
                media.tagName ===
                "VIDEO"
              ){

                try{

                  media.pause();

                  media.muted =
                    true;

                }

                catch(error){}

              }


              if(
                media.parentNode
              ){

                media.parentNode.removeChild(
                  media
                );

              }


              return;

            }


            const allVideos =
              container.querySelectorAll(
                "video"
              );


            allVideos.forEach(
              function(video){

                if(
                  video !==
                  media
                ){

                  try{

                    video.pause();

                    video.muted =
                      true;

                  }

                  catch(error){}

                }

              }
            );


            media.style.visibility =
              "visible";


            if(
              type === "video"
            ){

              media.muted =
                false;


              const playPromise =
                media.play();


              if(
                playPromise &&
                typeof playPromise.catch ===
                "function"
              ){

                playPromise.catch(
                  function(){

                    const activeScreen =
                      document.getElementById(
                        "ma7alak-full-story"
                      );

                    if(
                      thisTransition !== transitionToken ||
                      !activeScreen ||
                      !activeScreen.classList.contains("active") ||
                      !media.isConnected
                    ){
                      try{
                        media.pause();
                        media.muted = true;
                        media.volume = 0;
                      }
                      catch(error){}
                      return;
                    }

                    media.muted = true;
                    media.play().catch(function(){});

                  }
                );

              }

            }


            requestAnimationFrame(
              function(){

                if(
                  thisTransition !==
                  transitionToken
                ){

                  return;

                }


                media.style.opacity =
                  "1";


                media.classList.add(
                  "active"
                );


                const oldMedia =
                  currentMedia;


                currentMedia =
                  media;


                if(
                  oldMedia &&
                  oldMedia !==
                  media
                ){

                  oldMedia.style.opacity =
                    "0";


                  oldMedia.classList.remove(
                    "active"
                  );


                  setTimeout(
                    function(){

                      if(
                        oldMedia &&
                        oldMedia !==
                        currentMedia
                      ){

                        if(
                          oldMedia.tagName ===
                          "VIDEO"
                        ){

                          try{

                            oldMedia.pause();

                            oldMedia.muted =
                              true;

                            oldMedia.removeAttribute(
                              "src"
                            );

                            oldMedia.load();

                          }

                          catch(error){}

                        }


                        if(
                          oldMedia.parentNode
                        ){

                          oldMedia.parentNode.removeChild(
                            oldMedia
                          );

                        }

                      }

                    },
                    360
                  );

                }

              }
            );

          }


          if(
            type === "video"
          ){

            let activated =
              false;


            function activateVideoOnce(){

              if(activated){

                return;

              }


              activated =
                true;


              activateMedia();

            }


            media.addEventListener(
              "loadeddata",
              activateVideoOnce,
              {
                once:true
              }
            );


            media.addEventListener(
              "canplay",
              activateVideoOnce,
              {
                once:true
              }
            );


            if(
              media.readyState >=
              2
            ){

              activateVideoOnce();

            }


            media.addEventListener(
              "timeupdate",
              function(){

                if(
                  media.duration &&
                  isFinite(
                    media.duration
                  )
                ){

                  updateProgressBars(
                    currentStory,
                    (
                      media.currentTime /
                      media.duration
                    ) *
                    100
                  );

                }

              }
            );


            media.addEventListener(
              "ended",
              function(){

                if(
                  thisTransition ===
                  transitionToken &&
                  currentMedia ===
                  media
                ){

                  nextStory();

                }

              }
            );

          }


          else{

            let activated =
              false;


            function activateImageOnce(){

              if(activated){

                return;

              }


              activated =
                true;


              activateMedia();


              const started =
                Date.now();


              timer =
                setInterval(
                  function(){

                    if(
                      thisTransition !==
                      transitionToken
                    ){

                      clearInterval(
                        timer
                      );

                      return;

                    }


                    const elapsed =
                      Date.now() -
                      started;


                    const percent =
                      Math.min(
                        100,
                        (
                          elapsed /
                          5000
                        ) *
                        100
                      );


                    updateProgressBars(
                      currentStory,
                      percent
                    );


                    if(
                      percent >=
                      100
                    ){

                      clearInterval(
                        timer
                      );


                      nextStory();

                    }

                  },
                  50
                );

            }


            media.addEventListener(
              "load",
              activateImageOnce,
              {
                once:true
              }
            );


            if(
              media.complete
            ){

              activateImageOnce();

            }

          }

        }


        /* =========================================================
           NEXT
        ========================================================= */

        function nextStory(){

          if(
            !stories.length ||
            isDeletingStory
          ){

            return;

          }


          currentStory++;


          if(
            currentStory >=
            stories.length
          ){

            currentStory =
              0;

          }


          showStory(
            currentStory
          );

        }


        /* =========================================================
           PREVIOUS
        ========================================================= */

        function previousStory(){

          if(
            !stories.length ||
            isDeletingStory
          ){

            return;

          }


          currentStory--;


          if(
            currentStory < 0
          ){

            currentStory =
              stories.length - 1;

          }


          showStory(
            currentStory
          );

        }


        function stopStoryPlayback(unloadMedia){

          clearInterval(timer);
          transitionToken++;

          if(currentMedia && currentMedia.tagName === "VIDEO"){
            try{
              currentMedia.pause();
              currentMedia.muted = true;
              currentMedia.volume = 0;
              if(unloadMedia){
                currentMedia.removeAttribute("src");
                currentMedia.load();
              }
            }
            catch(error){}
          }

          const screen = document.getElementById("ma7alak-full-story");
          if(screen){
            screen.querySelectorAll("video").forEach(function(video){
              try{
                video.pause();
                video.muted = true;
                video.volume = 0;
                if(unloadMedia){
                  video.removeAttribute("src");
                  video.load();
                }
              }
              catch(error){}
            });
          }

          currentMedia = null;
        }


        /* =========================================================
           CLOSE STORIES
        ========================================================= */

        function closeStories(){

          const screen =
            document.getElementById(
              "ma7alak-full-story"
            );


          if(!screen){

            return;

          }


          stopStoryPlayback(true);


          try{

            if(
              document.fullscreenElement
            ){

              const exit =
                document.exitFullscreen();


              if(
                exit &&
                typeof exit.catch ===
                "function"
              ){

                exit.catch(
                  function(){}
                );

              }

            }

            else if(
              document.webkitFullscreenElement
            ){

              if(
                document.webkitExitFullscreen
              ){

                document.webkitExitFullscreen();

              }

            }

          }

          catch(error){}


          screen.classList.remove(
            "active"
          );


          document.documentElement.style.overflow =
            "";


          document.body.style.overflow =
            "";


          setTimeout(
            function(){

              if(
                !screen.classList.contains(
                  "active"
                )
              ){

                const container =
                  document.getElementById(
                    "ma7alak-full-story-media"
                  );


                if(container){

                  container.innerHTML =
                    "";

                }


                currentMedia =
                  null;

              }

            },
            350
          );

        }


        /* =========================================================
           FULLSCREEN CHANGE
        ========================================================= */

        function fullscreenChanged(){

          const screen =
            document.getElementById(
              "ma7alak-full-story"
            );


          if(!screen){

            return;

          }


          if(
            !document.fullscreenElement &&
            !document.webkitFullscreenElement
          ){

            if(
              screen.classList.contains(
                "active"
              )
            ){

              stopStoryPlayback(true);

              screen.classList.remove(
                "active"
              );

              document.documentElement.style.overflow = "";
              document.body.style.overflow = "";

            }

          }

        }


        document.addEventListener(
          "fullscreenchange",
          fullscreenChanged
        );


        document.addEventListener(
          "webkitfullscreenchange",
          fullscreenChanged
        );


        function stopStoryOnPageExit(){
          stopStoryPlayback(true);
        }

        window.addEventListener("pagehide", stopStoryOnPageExit);
        window.addEventListener("beforeunload", stopStoryOnPageExit);
        window.addEventListener("popstate", stopStoryOnPageExit);

        document.addEventListener("visibilitychange", function(){
          if(document.hidden){
            stopStoryPlayback(false);
          }
        });

        try{
          if(window.parent && window.parent !== window && window.parent.location.origin === window.location.origin){
            window.parent.addEventListener("pagehide", stopStoryOnPageExit);
            window.parent.addEventListener("beforeunload", stopStoryOnPageExit);
            window.parent.addEventListener("popstate", stopStoryOnPageExit);
          }
        }
        catch(error){}


        /* =========================================================
           STORY BUTTON
        ========================================================= */

        storyButton.addEventListener(
          "click",
          openStories
        );


        /* =========================================================
           OWNER PLUS BUTTON
        ========================================================= */

        ownerAddButton.addEventListener(
          "click",
          function(event){

            event.preventDefault();

            event.stopPropagation();

            openOwnerUpload();

          }
        );


        /* =========================================================
           AUTH CHANGE
        ========================================================= */

        supabaseClient.auth.onAuthStateChange(
          function(){

            setTimeout(
              checkShopOwner,
              100
            );

          }
        );


        /* =========================================================
           KEYBOARD
        ========================================================= */

        document.addEventListener(
          "keydown",
          function(event){

            const screen =
              document.getElementById(
                "ma7alak-full-story"
              );


            if(
              !screen ||
              !screen.classList.contains(
                "active"
              )
            ){

              return;

            }


            if(
              event.key ===
              "Escape"
            ){

              closeStories();

            }

            else if(
              event.key ===
              "ArrowRight"
            ){

              nextStory();

            }

            else if(
              event.key ===
              "ArrowLeft"
            ){

              previousStory();

            }

            else if(
              event.key ===
              "Delete" &&
              isShopOwner
            ){

              deleteCurrentStory();

            }

          }
        );


        /* =========================================================
           UPDATE TIME WHILE STORY IS OPEN
     
           Keeps:
             الآن
             1 د
             2 د
             1 س
             etc.
           accurate.
        ========================================================= */

        setInterval(
          function(){

            const screen =
              document.getElementById(
                "ma7alak-full-story"
              );


            if(
              screen &&
              screen.classList.contains(
                "active"
              )
            ){

              updateStoryTime();

            }

          },
          30000
        );


        /* =========================================================
           OWNER VIEW COUNT REFRESH

           While the owner is watching Stories, refresh the count
           every 5 seconds so new views appear without reopening.
        ========================================================= */

        setInterval(
          function(){

            const screen =
              document.getElementById(
                "ma7alak-full-story"
              );

            if(
              isShopOwner &&
              screen &&
              screen.classList.contains(
                "active"
              )
            ){
              updateStoryViewCount();
            }

          },
          5000
        );


        /* =========================================================
           SYNC MANUAL OWNER-PAGE LOGO TO SUPABASE
           ---------------------------------------------------------
           OWNER PAGE remains the source of truth.

           This sends the manually configured STORY_CIRCLE_IMAGE_URL
           to the secure sync_shop_profile_image RPC.

           The RPC itself verifies that the logged-in user is either:
             - the owner of this exact SHOP_SLUG, or
             - a site admin

           Normal visitors cannot change the database.
        ========================================================= */

        async function syncStoryCircleImageToSupabase(){

          const imageURL =
            String(
              STORY_CIRCLE_IMAGE_URL || ""
            ).trim();

          if(
            !imageURL ||
            imageURL === "PASTE_IMAGE_URL_HERE"
          ){
            return;
          }


          try{

            const {
              data: sessionData
            } =
              await supabaseClient
                .auth
                .getSession();


            const session =
              sessionData &&
              sessionData.session
                ? sessionData.session
                : null;


            /*
               Do nothing for normal/public visitors.
               Only authenticated users even attempt the secure RPC.
            */
            if(!session){
              return;
            }


            const {
              error
            } =
              await supabaseClient
                .rpc(
                  "sync_shop_profile_image",
                  {
                    p_shop_slug:
                      SHOP_SLUG,

                    p_image_url:
                      imageURL
                  }
                );


            if(error){

              console.warn(
                "MA7ALAK logo sync skipped:",
                error.message || error
              );

            }

          }

          catch(error){

            console.warn(
              "MA7ALAK logo sync skipped:",
              error
            );

          }

        }


        /* =========================================================
           INITIALIZE
        ========================================================= */

        createStoryScreen();

        renderShopIdentity();

        renderStoryCircleImage();

        checkShopOwner();

        /*
           If the authenticated user owns this shop (or is site admin),
           sync the MANUAL owner-page logo URL into shop_profiles so
           the GitHub Show Shops directory can use the same image.
        */
        syncStoryCircleImageToSupabase();

        loadStories();


        /* =========================================================
           CHECK FOR NEW STORIES
           EVERY 10 SECONDS
        ========================================================= */

        setInterval(
          function(){

            loadStories();

          },
          10000
        );


      })();
  }

  function boot(){
    if(!document.body){
      document.addEventListener("DOMContentLoaded", boot, {once:true});
      return;
    }

    installBackground();
    installStoryStyle();
    installStoryMarkup();
    loadSupabase(bootStoryCode);
  }

  boot();

})();
