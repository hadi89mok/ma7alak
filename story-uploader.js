/*
  MA7ALAK STORIES — GITHUB-READY VERSION

  IMPORTANT:
  This file is pure JavaScript for <script src="..."></script>.
  It injects the original Story CSS + Story circle markup,
  ensures Supabase JS is loaded, then starts the original Story logic.
*/

(function(){

  "use strict";

  const MA7ALAK_STORY_STYLE_ID =
    "ma7alak-stories-injected-style";

  const MA7ALAK_SUPABASE_SRC =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


  function injectStoryCss(){

    if(
      document.getElementById(
        MA7ALAK_STORY_STYLE_ID
      )
    ){
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      MA7ALAK_STORY_STYLE_ID;

    style.textContent =
      "/* =========================================================\n   STORY WRAPPER\n========================================================= */\n\n#ma7alak-story-wrapper{\n\n  width:100%!important;\n\n  display:flex!important;\n\n  justify-content:center!important;\n  align-items:center!important;\n\n  margin:15px 0!important;\n\n  padding:0!important;\n\n  position:relative!important;\n\n  min-height:82px!important;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  border-radius:0!important;\n\n  box-shadow:none!important;\n\n  -webkit-box-shadow:none!important;\n\n  outline:none!important;\n\n  overflow:visible!important;\n\n  z-index:999999!important;\n\n}\n\n\n/* =========================================================\n   NEW STORY RING\n========================================================= */\n\n#ma7alak-story-new-ring{\n\n  position:absolute!important;\n\n  left:50%!important;\n  top:50%!important;\n\n  width:90px!important;\n  height:90px!important;\n\n  transform:\n    translate(-50%,-50%)\n    scale(.88);\n\n  border-radius:50%!important;\n\n  border:3px solid #d9a441!important;\n\n  background:transparent!important;\n\n  box-shadow:none!important;\n\n  pointer-events:none!important;\n\n  opacity:0;\n\n  z-index:1!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n/* =========================================================\n   NEW STORY ACTIVE\n========================================================= */\n\n#ma7alak-story-wrapper.story-has-new\n#ma7alak-story-new-ring{\n\n  opacity:1;\n\n  animation:\n    ma7alakNewStoryPulse\n    1.65s\n    ease-out\n    infinite;\n\n  -webkit-animation:\n    ma7alakNewStoryPulse\n    1.65s\n    ease-out\n    infinite;\n\n}\n\n\n/* =========================================================\n   NEW STORY PULSE\n========================================================= */\n\n@keyframes ma7alakNewStoryPulse{\n\n  0%{\n\n    transform:\n      translate(-50%,-50%)\n      scale(.88);\n\n    opacity:1;\n\n    border-width:3px;\n\n  }\n\n  55%{\n\n    transform:\n      translate(-50%,-50%)\n      scale(1.08);\n\n    opacity:.58;\n\n    border-width:2px;\n\n  }\n\n  100%{\n\n    transform:\n      translate(-50%,-50%)\n      scale(1.30);\n\n    opacity:0;\n\n    border-width:1px;\n\n  }\n\n}\n\n\n@-webkit-keyframes ma7alakNewStoryPulse{\n\n  0%{\n\n    -webkit-transform:\n      translate(-50%,-50%)\n      scale(.88);\n\n    opacity:1;\n\n    border-width:3px;\n\n  }\n\n  55%{\n\n    -webkit-transform:\n      translate(-50%,-50%)\n      scale(1.08);\n\n    opacity:.58;\n\n    border-width:2px;\n\n  }\n\n  100%{\n\n    -webkit-transform:\n      translate(-50%,-50%)\n      scale(1.30);\n\n    opacity:0;\n\n    border-width:1px;\n\n  }\n\n}\n\n\n/* =========================================================\n   STORY BUTTON\n========================================================= */\n\n#ma7alak-story-button{\n\n  position:relative!important;\n\n  width:82px!important;\n  height:82px!important;\n\n  padding:3px!important;\n\n  margin:0!important;\n\n  border-radius:50%!important;\n\n  border:3px solid #d9a441!important;\n\n  background:#111!important;\n\n  box-shadow:none!important;\n\n  -webkit-box-shadow:none!important;\n\n  filter:none!important;\n\n  cursor:pointer!important;\n\n  overflow:hidden!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  outline:none!important;\n\n  z-index:2!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n  box-sizing:border-box!important;\n\n  clip-path:\n    circle(50% at 50% 50%)!important;\n\n  -webkit-clip-path:\n    circle(50% at 50% 50%)!important;\n\n}\n\n\n/* =========================================================\n   REMOVE BUTTON EFFECTS\n========================================================= */\n\n#ma7alak-story-button::before,\n#ma7alak-story-button::after{\n\n  content:none!important;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  box-shadow:none!important;\n\n}\n\n\n#ma7alak-story-button:hover,\n#ma7alak-story-button:focus,\n#ma7alak-story-button:focus-visible,\n#ma7alak-story-button:active{\n\n  outline:none!important;\n\n  background:#111!important;\n\n  box-shadow:none!important;\n\n  -webkit-box-shadow:none!important;\n\n}\n\n\n/* =========================================================\n   STORY PREVIEW\n========================================================= */\n\n#ma7alak-story-preview{\n\n  width:100%!important;\n  height:100%!important;\n\n  margin:0!important;\n\n  padding:0!important;\n\n  border-radius:50%!important;\n\n  overflow:hidden!important;\n\n  background:#171717!important;\n\n  border:none!important;\n\n  box-shadow:none!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n}\n\n\n#ma7alak-story-preview img,\n#ma7alak-story-preview video{\n\n  width:100%!important;\n  height:100%!important;\n\n  object-fit:cover!important;\n\n  border-radius:50%!important;\n\n  border:none!important;\n\n  box-shadow:none!important;\n\n  display:block!important;\n\n}\n\n\n/* =========================================================\n   EMPTY CIRCLE\n========================================================= */\n\n.ma7alak-story-placeholder{\n\n  width:100%!important;\n  height:100%!important;\n\n  border-radius:50%!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  background:\n    linear-gradient(\n      135deg,\n      #121212,\n      #292929\n    )!important;\n\n  color:transparent!important;\n\n  font-size:0!important;\n\n}\n\n\n/* =========================================================\n   OWNER PLUS\n========================================================= */\n\n#ma7alak-owner-add-story{\n\n  position:absolute!important;\n\n  width:28px!important;\n  height:28px!important;\n\n  right:calc(50% - 49px)!important;\n\n  bottom:-2px!important;\n\n  border:2px solid #111!important;\n\n  border-radius:50%!important;\n\n  background:#d9a441!important;\n\n  color:#111!important;\n\n  display:none;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  font-size:21px!important;\n\n  font-weight:900!important;\n\n  line-height:1!important;\n\n  padding:0!important;\n\n  margin:0!important;\n\n  cursor:pointer!important;\n\n  z-index:20!important;\n\n  box-shadow:\n    0 3px 12px rgba(0,0,0,.45)!important;\n\n  -webkit-box-shadow:\n    0 3px 12px rgba(0,0,0,.45)!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  outline:none!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n}\n\n\n#ma7alak-owner-add-story.visible{\n\n  display:flex!important;\n\n}\n\n\n#ma7alak-owner-add-story:active{\n\n  transform:scale(.90)!important;\n\n}\n\n\n/* =========================================================\n   FULL STORY\n========================================================= */\n\n#ma7alak-full-story{\n\n  position:fixed!important;\n\n  inset:0!important;\n\n  width:100vw!important;\n  height:100vh!important;\n\n  width:100dvw!important;\n  height:100dvh!important;\n\n  background:#000!important;\n\n  display:none;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  overflow:hidden!important;\n\n  z-index:2147483647!important;\n\n  margin:0!important;\n\n  padding:0!important;\n\n  box-sizing:border-box!important;\n\n  isolation:isolate;\n\n  border:none!important;\n\n  outline:none!important;\n\n}\n\n\n#ma7alak-full-story.active{\n\n  display:flex!important;\n\n}\n\n\n/* =========================================================\n   NATIVE FULLSCREEN\n========================================================= */\n\n#ma7alak-full-story:fullscreen{\n\n  width:100vw!important;\n  height:100vh!important;\n\n  background:#000!important;\n\n}\n\n\n#ma7alak-full-story:-webkit-full-screen{\n\n  width:100vw!important;\n  height:100vh!important;\n\n  background:#000!important;\n\n}\n\n\n/* =========================================================\n   STORY MEDIA\n========================================================= */\n\n#ma7alak-full-story-media{\n\n  position:absolute!important;\n\n  top:50%!important;\n  left:50%!important;\n\n  transform:\n    translate(-50%,-50%);\n\n  width:\n    calc(100vw - 24px)!important;\n\n  height:\n    calc(100vh - 24px)!important;\n\n  width:\n    calc(100dvw - 24px)!important;\n\n  height:\n    calc(100dvh - 24px)!important;\n\n  background:#000!important;\n\n  display:block!important;\n\n  overflow:hidden!important;\n\n  border-radius:24px!important;\n\n  box-sizing:border-box!important;\n\n  isolation:isolate;\n\n  border:none!important;\n\n  outline:none!important;\n\n}\n\n\n/* =========================================================\n   MEDIA LAYERS\n========================================================= */\n\n.ma7alak-story-media-layer{\n\n  position:absolute!important;\n\n  inset:0!important;\n\n  width:100%!important;\n  height:100%!important;\n\n  object-fit:contain!important;\n\n  background:#000!important;\n\n  border-radius:24px!important;\n\n  display:block!important;\n\n  opacity:0;\n\n  visibility:hidden;\n\n  transition:\n    opacity .32s ease;\n\n  will-change:opacity;\n\n  backface-visibility:hidden;\n\n  -webkit-backface-visibility:hidden;\n\n  transform:\n    translateZ(0);\n\n  z-index:1;\n\n  border:none!important;\n\n  outline:none!important;\n\n}\n\n\n.ma7alak-story-media-layer.active{\n\n  opacity:1;\n\n  visibility:visible;\n\n  z-index:2;\n\n}\n\n\n/* =========================================================\n   STORY SHOP NAME\n========================================================= */\n\n#ma7alak-story-shop-name{\n\n  position:absolute!important;\n\n  top:76px!important;\n\n  left:20px!important;\n\n  max-width:calc(100% - 130px)!important;\n\n  color:#fff!important;\n\n  font-family:\n    Arial,\n    \"Segoe UI\",\n    sans-serif!important;\n\n  font-size:16px!important;\n\n  font-weight:800!important;\n\n  line-height:22px!important;\n\n  white-space:nowrap!important;\n\n  overflow:hidden!important;\n\n  text-overflow:ellipsis!important;\n\n  text-shadow:\n    0 2px 10px rgba(0,0,0,.55)!important;\n\n  pointer-events:none!important;\n\n  z-index:125!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n/* =========================================================\n   STORY TIME\n========================================================= */\n\n#ma7alak-story-time{\n\n  position:absolute!important;\n\n  top:104px!important;\n\n  left:20px!important;\n\n  min-height:32px!important;\n\n  padding:\n    0 12px!important;\n\n  display:flex!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  border:\n    1px solid\n    rgba(255,255,255,.14)!important;\n\n  border-radius:18px!important;\n\n  background:\n    rgba(15,15,15,.68)!important;\n\n  color:\n    rgba(255,255,255,.88)!important;\n\n  font-family:\n    Arial,\n    \"Segoe UI\",\n    sans-serif!important;\n\n  font-size:11px!important;\n\n  font-weight:700!important;\n\n  line-height:32px!important;\n\n  white-space:nowrap!important;\n\n  backdrop-filter:blur(12px)!important;\n\n  -webkit-backdrop-filter:blur(12px)!important;\n\n  box-shadow:\n    0 5px 20px rgba(0,0,0,.28)!important;\n\n  pointer-events:none!important;\n\n  z-index:125!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n/* =========================================================\n   OWNER DELETE BUTTON\n========================================================= */\n\n#ma7alak-story-delete-btn{\n\n  position:absolute!important;\n\n  top:136px!important;\n\n  right:20px!important;\n\n  width:48px!important;\n\n  height:48px!important;\n\n  display:none!important;\n\n  align-items:center!important;\n\n  justify-content:center!important;\n\n  border:\n    1px solid\n    rgba(255,255,255,.13)!important;\n\n  border-radius:50%!important;\n\n  background:\n    rgba(20,20,20,.72)!important;\n\n  color:#fff!important;\n\n  font-size:20px!important;\n\n  line-height:1!important;\n\n  padding:0!important;\n\n  margin:0!important;\n\n  cursor:pointer!important;\n\n  z-index:125!important;\n\n  backdrop-filter:blur(10px)!important;\n\n  -webkit-backdrop-filter:blur(10px)!important;\n\n  outline:none!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n  box-sizing:border-box!important;\n\n}\n\n\n#ma7alak-story-delete-btn.visible{\n\n  display:flex!important;\n\n}\n\n\n#ma7alak-story-delete-btn:hover{\n\n  background:\n    rgba(150,25,25,.78)!important;\n\n  border-color:\n    rgba(255,90,90,.35)!important;\n\n}\n\n\n#ma7alak-story-delete-btn:active{\n\n  transform:scale(.90)!important;\n\n  background:\n    rgba(180,25,25,.88)!important;\n\n}\n\n\n/* =========================================================\n   DESKTOP STORY\n========================================================= */\n\n@media(min-width:601px){\n\n  #ma7alak-full-story-media{\n\n    width:\n      min(\n        520px,\n        calc(100vw - 40px)\n      )!important;\n\n    height:\n      min(\n        900px,\n        calc(100vh - 30px)\n      )!important;\n\n    width:\n      min(\n        520px,\n        calc(100dvw - 40px)\n      )!important;\n\n    height:\n      min(\n        900px,\n        calc(100dvh - 30px)\n      )!important;\n\n    border-radius:26px!important;\n\n  }\n\n\n  .ma7alak-story-media-layer{\n\n    border-radius:26px!important;\n\n  }\n\n}\n\n\n/* =========================================================\n   MOBILE\n========================================================= */\n\n@media(max-width:600px){\n\n  #ma7alak-story-wrapper{\n\n    min-height:76px!important;\n\n    margin:15px 0!important;\n\n  }\n\n\n  #ma7alak-story-button{\n\n    width:76px!important;\n\n    height:76px!important;\n\n  }\n\n\n  #ma7alak-story-new-ring{\n\n    width:82px!important;\n\n    height:82px!important;\n\n  }\n\n\n  #ma7alak-owner-add-story{\n\n    width:27px!important;\n\n    height:27px!important;\n\n    right:calc(50% - 47px)!important;\n\n    bottom:-1px!important;\n\n    font-size:20px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     STORY VIEWER\n  ----------------------------------------- */\n\n  #ma7alak-full-story-media{\n\n    width:\n      calc(100vw - 12px)!important;\n\n    height:\n      calc(100vh - 12px)!important;\n\n    width:\n      calc(100dvw - 12px)!important;\n\n    height:\n      calc(100dvh - 12px)!important;\n\n    border-radius:20px!important;\n\n  }\n\n\n  .ma7alak-story-media-layer{\n\n    border-radius:20px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     SHOP NAME\n  ----------------------------------------- */\n\n  #ma7alak-story-shop-name{\n\n    top:68px!important;\n\n    left:14px!important;\n\n    max-width:calc(100% - 105px)!important;\n\n    font-size:15px!important;\n\n    line-height:21px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     TIME\n  ----------------------------------------- */\n\n  #ma7alak-story-time{\n\n    top:94px!important;\n\n    left:14px!important;\n\n    min-height:30px!important;\n\n    padding:\n      0 10px!important;\n\n    font-size:10px!important;\n\n    line-height:30px!important;\n\n  }\n\n\n  /* -----------------------------------------\n     DELETE\n  ----------------------------------------- */\n\n  #ma7alak-story-delete-btn{\n\n    top:124px!important;\n\n    right:14px!important;\n\n    width:44px!important;\n\n    height:44px!important;\n\n    font-size:18px!important;\n\n  }\n\n}\n\n\n/* =========================================================\n   VERY SMALL PHONES\n========================================================= */\n\n@media(max-width:380px){\n\n  #ma7alak-story-button{\n\n    width:74px!important;\n    height:74px!important;\n\n  }\n\n\n  #ma7alak-story-delete-btn{\n\n    top:122px!important;\n\n    right:14px!important;\n\n    width:42px!important;\n\n    height:42px!important;\n\n  }\n\n}\n\n\n/* =========================================================\n   STORY LIKE BUTTON\n========================================================= */\n\n#ma7alak-story-like-btn{\n\n  position:absolute!important;\n  left:50%!important;\n  bottom:105px!important;\n  transform:translateX(-50%)!important;\n\n  width:56px!important;\n  min-width:56px!important;\n  height:56px!important;\n  padding:0!important;\n  margin:0!important;\n\n  display:flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n\n  border:1px solid rgba(255,255,255,.28)!important;\n  border-radius:50%!important;\n  background:linear-gradient(145deg,rgba(28,28,31,.86),rgba(8,8,10,.72))!important;\n  color:rgba(255,255,255,.96)!important;\n\n  font-family:Arial,\"Segoe UI\",sans-serif!important;\n  font-size:30px!important;\n  line-height:1!important;\n  font-weight:400!important;\n\n  backdrop-filter:blur(18px) saturate(140%)!important;\n  -webkit-backdrop-filter:blur(18px) saturate(140%)!important;\n  box-shadow:\n    0 10px 30px rgba(0,0,0,.38),\n    inset 0 1px 0 rgba(255,255,255,.18),\n    inset 0 -1px 0 rgba(0,0,0,.35)!important;\n\n  cursor:pointer!important;\n  z-index:2147483646!important;\n  outline:none!important;\n  appearance:none!important;\n  -webkit-appearance:none!important;\n  -webkit-tap-highlight-color:transparent!important;\n  box-sizing:border-box!important;\n  pointer-events:auto!important;\n  touch-action:manipulation!important;\n  transition:\n    transform .18s ease,\n    border-color .22s ease,\n    box-shadow .22s ease,\n    background .22s ease!important;\n}\n\n#ma7alak-story-like-btn::before{\n  content:\"\"!important;\n  position:absolute!important;\n  inset:-3px!important;\n  border-radius:50%!important;\n  border:1px solid rgba(217,164,65,.28)!important;\n  pointer-events:none!important;\n  opacity:.8!important;\n}\n\n#ma7alak-story-like-btn .ma7alak-like-heart{\n  display:block!important;\n  position:relative!important;\n  z-index:1!important;\n  font-size:30px!important;\n  line-height:1!important;\n  transform:translateY(1px)!important;\n  text-shadow:0 2px 10px rgba(0,0,0,.35)!important;\n  transition:\n    transform .18s ease,\n    color .22s ease,\n    text-shadow .22s ease!important;\n}\n\n#ma7alak-story-like-btn.liked{\n  color:#ff4b67!important;\n  border-color:rgba(255,92,115,.72)!important;\n  background:linear-gradient(145deg,rgba(62,17,28,.94),rgba(22,8,14,.9))!important;\n  box-shadow:\n    0 10px 34px rgba(0,0,0,.42),\n    0 0 24px rgba(255,64,91,.22),\n    inset 0 1px 0 rgba(255,255,255,.14),\n    inset 0 -1px 0 rgba(0,0,0,.35)!important;\n}\n\n#ma7alak-story-like-btn.liked::before{\n  border-color:rgba(255,92,115,.5)!important;\n}\n\n#ma7alak-story-like-btn.liked .ma7alak-like-heart{\n  color:#ff4b67!important;\n  text-shadow:\n    0 0 12px rgba(255,64,91,.42),\n    0 2px 10px rgba(0,0,0,.3)!important;\n  animation:ma7alakHeartPop .32s ease-out!important;\n}\n\n#ma7alak-story-like-btn:active{\n  transform:translateX(-50%) scale(.9)!important;\n}\n\n#ma7alak-story-like-btn:hover{\n  border-color:rgba(255,255,255,.42)!important;\n  box-shadow:\n    0 12px 34px rgba(0,0,0,.42),\n    0 0 18px rgba(217,164,65,.10),\n    inset 0 1px 0 rgba(255,255,255,.2)!important;\n}\n\n#ma7alak-story-like-btn.liked:hover{\n  border-color:rgba(255,92,115,.86)!important;\n  box-shadow:\n    0 12px 36px rgba(0,0,0,.44),\n    0 0 28px rgba(255,64,91,.28),\n    inset 0 1px 0 rgba(255,255,255,.16)!important;\n}\n\n#ma7alak-story-like-btn:disabled{\n  cursor:default!important;\n  opacity:.72!important;\n}\n\n@keyframes ma7alakHeartPop{\n  0%{transform:translateY(1px) scale(.72);}\n  55%{transform:translateY(1px) scale(1.18);}\n  100%{transform:translateY(1px) scale(1);}\n}\n\n@media(max-width:600px){\n  #ma7alak-story-like-btn{\n    bottom:95px!important;\n    width:54px!important;\n    min-width:54px!important;\n    height:54px!important;\n  }\n\n  #ma7alak-story-like-btn .ma7alak-like-heart{\n    font-size:29px!important;\n  }\n}\n\n\n/* =========================================================\n   PROGRESS BARS\n========================================================= */\n\n#ma7alak-story-progress-wrap{\n\n  position:absolute;\n\n  top:10px;\n\n  left:12px;\n  right:12px;\n\n  height:4px;\n\n  display:flex;\n\n  gap:4px;\n\n  z-index:100;\n\n  pointer-events:none;\n\n}\n\n\n.ma7alak-story-progress-segment{\n\n  flex:1;\n\n  height:4px;\n\n  border-radius:20px;\n\n  background:\n    rgba(255,255,255,.30);\n\n  overflow:hidden;\n\n  position:relative;\n\n}\n\n\n.ma7alak-story-progress-fill{\n\n  position:absolute;\n\n  left:0;\n  top:0;\n\n  width:0%;\n\n  height:100%;\n\n  background:#d9a441;\n\n  border-radius:20px;\n\n}\n\n\n/* =========================================================\n   CLOSE STORY\n========================================================= */\n\n#ma7alak-story-close-btn{\n\n  position:absolute;\n\n  top:60px;\n  right:20px;\n\n  width:48px;\n  height:48px;\n\n  border:none!important;\n\n  border-radius:50%;\n\n  background:\n    rgba(20,20,20,.72);\n\n  color:#fff;\n\n  font-size:30px;\n\n  line-height:48px;\n\n  padding:0;\n\n  text-align:center;\n\n  cursor:pointer;\n\n  z-index:120;\n\n  backdrop-filter:blur(10px);\n\n  -webkit-backdrop-filter:blur(10px);\n\n  -webkit-tap-highlight-color:\n    transparent;\n\n  outline:none!important;\n\n}\n\n\n/* =========================================================\n   TAP AREAS\n========================================================= */\n\n#ma7alak-story-tap-left,\n#ma7alak-story-tap-right{\n\n  position:absolute;\n\n  top:0;\n  bottom:0;\n\n  width:50%;\n\n  z-index:90;\n\n  cursor:pointer;\n\n  background:transparent!important;\n\n  border:none!important;\n\n  padding:0;\n\n  margin:0;\n\n  outline:none!important;\n\n  appearance:none!important;\n\n  -webkit-appearance:none!important;\n\n  -webkit-tap-highlight-color:\n    transparent!important;\n\n  box-shadow:none!important;\n\n}\n\n\n#ma7alak-story-tap-left{\n\n  left:0;\n\n}\n\n\n#ma7alak-story-tap-right{\n\n  right:0;\n\n}\n\n\n#ma7alak-story-tap-left:focus,\n#ma7alak-story-tap-left:focus-visible,\n#ma7alak-story-tap-left:active,\n#ma7alak-story-tap-right:focus,\n#ma7alak-story-tap-right:focus-visible,\n#ma7alak-story-tap-right:active{\n\n  background:transparent!important;\n\n  border:0!important;\n\n  outline:none!important;\n\n  box-shadow:none!important;\n\n}\n\n\n/* =========================================================\n   MOBILE STORY CONTROLS\n========================================================= */\n\n@media(max-width:600px){\n\n  #ma7alak-story-close-btn{\n\n    top:68px;\n\n    right:14px;\n\n    width:44px;\n\n    height:44px;\n\n    line-height:44px;\n\n  }\n\n\n  #ma7alak-story-progress-wrap{\n\n    top:8px;\n\n    left:9px;\n    right:9px;\n\n    height:3px;\n\n    gap:3px;\n\n  }\n\n\n  .ma7alak-story-progress-segment{\n\n    height:3px;\n\n  }\n\n}";

    document.head.appendChild(
      style
    );

  }


  function injectStoryMarkup(){

    if(
      document.getElementById(
        "ma7alak-story-wrapper"
      )
    ){
      return;
    }

    const holder =
      document.createElement(
        "div"
      );

    holder.innerHTML =
      "<div\n  id=\"ma7alak-story-wrapper\"\n  style=\"\n    background:transparent !important;\n    border:none !important;\n    box-shadow:none !important;\n    outline:none !important;\n  \"\n>\n\n  <div\n    id=\"ma7alak-story-new-ring\"\n    aria-hidden=\"true\"\n  ></div>\n\n\n  <button\n    id=\"ma7alak-story-button\"\n    type=\"button\"\n    aria-label=\"View stories\"\n  >\n\n    <div id=\"ma7alak-story-preview\">\n\n      <div\n        class=\"ma7alak-story-placeholder\"\n      ></div>\n\n    </div>\n\n  </button>\n\n\n  <button\n    id=\"ma7alak-owner-add-story\"\n    type=\"button\"\n    aria-label=\"Add story\"\n  >\n    +\n  </button>\n\n</div>\n\n\n<!-- =========================================================\n     SUPABASE\n========================================================= -->";

    const wrapper =
      holder.firstElementChild;

    if(!wrapper){
      return;
    }

    /*
      Insert exactly where this external script is running.
      If document.currentScript is available, place the Story
      circle immediately before it; otherwise append to body.
    */
    const currentScript =
      document.currentScript;

    if(
      currentScript &&
      currentScript.parentNode
    ){

      currentScript.parentNode.insertBefore(
        wrapper,
        currentScript
      );

    }
    else{

      document.body.appendChild(
        wrapper
      );

    }

  }


  function startMa7alakStories(){

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
        "masaya-cafe";
    
    
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
    
      /*
        Phone/browser Back handling:
        when a Story opens we add one same-page history entry.
        This makes the Back button close the Story first instead
        of leaving a hidden playing video behind.
      */
      let storyHistoryPushed = false;
    
    
      /* =========================================================
         STORY LIKES
      ========================================================= */
    
      const VISITOR_ID_KEY =
        "ma7alak_visitor_id";
    
      let visitorId = null;
    
      const likedStoryIds = new Set();
    
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
    
            return;
    
          }
    
    
          isShopOwner =
            true;
    
    
          ownerAddButton.classList.add(
            "visible"
          );
    
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
         LOAD STORIES
      ========================================================= */
    
      async function loadStories(){
    
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
    
    
          updateNewStoryAnimation();
    
    
          if(
            stories.length === 0
          ){
    
            storyPreview.innerHTML =
              `
                <div
                  class="ma7alak-story-placeholder"
                ></div>
              `;
    
            return;
    
          }
    
    
          const story =
            stories[0];
    
    
          const url =
            storyURL(
              story.storage_path
            );
    
    
          const type =
            mediaType(
              story
            );
    
    
          storyPreview.innerHTML =
            "";
    
    
          if(
            type === "video"
          ){
    
            const video =
              document.createElement(
                "video"
              );
    
    
            video.src =
              url;
    
    
            video.autoplay =
              true;
    
    
            video.loop =
              true;
    
    
            video.muted =
              true;
    
    
            video.playsInline =
              true;
    
    
            video.setAttribute(
              "playsinline",
              ""
            );
    
    
            video.setAttribute(
              "webkit-playsinline",
              ""
            );
    
    
            video.preload =
              "metadata";
    
    
            storyPreview.appendChild(
              video
            );
    
    
            video.play().catch(
              function(){}
            );
    
          }
    
    
          else{
    
            const image =
              document.createElement(
                "img"
              );
    
    
            image.src =
              url;
    
    
            image.alt =
              "Story";
    
    
            storyPreview.appendChild(
              image
            );
    
          }
    
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
    
    
        /*
          IMPORTANT FOR PHONE BACK BUTTON:
          Add one temporary same-page history entry while the
          Story viewer is open. Android/browser Back will pop
          this entry first, which lets us stop the video/audio
          before any page navigation happens.
        */
        if(!storyHistoryPushed){
    
          try{
    
            window.history.pushState(
              {
                ma7alakStoryOpen:true
              },
              "",
              window.location.href
            );
    
            storyHistoryPushed =
              true;
    
          }
    
          catch(error){}
    
        }
    
    
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
    
                  const screen =
                    document.getElementById(
                      "ma7alak-full-story"
                    );
    
    
                  if(
                    thisTransition !==
                    transitionToken ||
                    !screen ||
                    !screen.classList.contains(
                      "active"
                    ) ||
                    !media.isConnected
                  ){
    
                    try{
    
                      media.pause();
    
                      media.muted =
                        true;
    
                    }
    
                    catch(error){}
    
                    return;
    
                  }
    
    
                  media.muted =
                    true;
    
    
                  media.play().catch(
                    function(){}
                  );
    
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
    
    
      /* =========================================================
         STOP STORY PLAYBACK
         ONE SAFE CLEANUP FUNCTION FOR EVERY EXIT METHOD
      ========================================================= */
    
      function stopStoryPlayback(
        unloadMedia
      ){
    
        clearInterval(
          timer
        );
    
    
        transitionToken++;
    
    
        const screen =
          document.getElementById(
            "ma7alak-full-story"
          );
    
    
        if(!screen){
    
          currentMedia =
            null;
    
          return;
    
        }
    
    
        /*
          Kill the referenced current video first, even if the
          browser has already detached/hidden it from the viewer.
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
    
            currentMedia.volume =
              0;
    
            if(
              unloadMedia !==
              false
            ){
    
              currentMedia.removeAttribute(
                "src"
              );
    
              currentMedia.load();
    
            }
    
          }
    
          catch(error){}
    
        }
    
    
        const videos =
          screen.querySelectorAll(
            "video"
          );
    
    
        videos.forEach(
          function(video){
    
            try{
    
              video.pause();
    
              video.muted =
                true;
    
              video.volume =
                0;
    
    
              if(
                unloadMedia !==
                false
              ){
    
                video.removeAttribute(
                  "src"
                );
    
                video.load();
    
              }
    
            }
    
            catch(error){}
    
          }
        );
    
    
        currentMedia =
          null;
    
      }
    
    
      /* =========================================================
         CLOSE STORIES
      ========================================================= */
    
      function closeStories(
        fromHistory
      ){
    
        const screen =
          document.getElementById(
            "ma7alak-full-story"
          );
    
    
        if(!screen){
    
          return;
    
        }
    
    
        stopStoryPlayback(
          true
        );
    
    
        /*
          If the X button closed the Story, remove our temporary
          same-page Story history entry too. When Back itself
          caused the close, fromHistory=true prevents a second
          history.back() call.
        */
        if(
          !fromHistory &&
          storyHistoryPushed
        ){
    
          storyHistoryPushed =
            false;
    
          try{
    
            if(
              window.history.state &&
              window.history.state.ma7alakStoryOpen ===
              true
            ){
    
              window.history.back();
    
            }
    
          }
    
          catch(error){}
    
        }
    
        else if(fromHistory){
    
          storyHistoryPushed =
            false;
    
        }
    
    
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
    
            /*
              Mobile/system Back can exit native fullscreen
              without pressing the Story X button.
            */
            stopStoryPlayback(
              true
            );
    
    
            screen.classList.remove(
              "active"
            );
    
    
            document.documentElement.style.overflow =
              "";
    
    
            document.body.style.overflow =
              "";
    
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
    
    
      /* =========================================================
         STOP STORY VIDEO/AUDIO ON EVERY PAGE EXIT METHOD
      ========================================================= */
    
      window.addEventListener(
        "pagehide",
        function(){
    
          stopStoryPlayback(
            true
          );
    
        }
      );
    
    
      window.addEventListener(
        "beforeunload",
        function(){
    
          stopStoryPlayback(
            true
          );
    
        }
      );
    
    
      window.addEventListener(
        "popstate",
        function(){
    
          const screen =
            document.getElementById(
              "ma7alak-full-story"
            );
    
    
          /*
            This is the actual phone/browser Back path.
            Close the viewer AND destroy playback.
          */
          if(
            screen &&
            screen.classList.contains(
              "active"
            )
          ){
    
            closeStories(
              true
            );
    
          }
    
          else{
    
            storyHistoryPushed =
              false;
    
            stopStoryPlayback(
              true
            );
    
          }
    
        }
      );
    
    
      document.addEventListener(
        "visibilitychange",
        function(){
    
          if(
            document.visibilityState ===
            "hidden"
          ){
    
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
    
              stopStoryPlayback(
                true
              );
    
            }
    
          }
    
        }
      );
    
    
      /*
        Hostinger embeds can run this Story code inside an iframe.
        If the parent page is same-origin, also listen to the
        parent's navigation lifecycle so hidden iframe audio
        cannot survive a parent-page Back action.
      */
      try{
    
        if(
          window.parent &&
          window.parent !== window
        ){
    
          window.parent.addEventListener(
            "pagehide",
            function(){
    
              stopStoryPlayback(
                true
              );
    
            }
          );
    
    
          window.parent.addEventListener(
            "beforeunload",
            function(){
    
              stopStoryPlayback(
                true
              );
    
            }
          );
    
    
          window.parent.addEventListener(
            "popstate",
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
    
                closeStories(
                  true
                );
    
              }
    
              else{
    
                stopStoryPlayback(
                  true
                );
    
              }
    
            }
          );
    
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
         INITIALIZE
      ========================================================= */
    
      createStoryScreen();
    
      checkShopOwner();
    
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

  }


  function bootMa7alakStories(){

    injectStoryCss();
    injectStoryMarkup();

    if(
      window.supabase &&
      typeof window.supabase.createClient ===
      "function"
    ){

      startMa7alakStories();
      return;

    }

    const existing =
      document.querySelector(
        'script[src="' +
        MA7ALAK_SUPABASE_SRC +
        '"]'
      );

    if(existing){

      if(
        window.supabase &&
        typeof window.supabase.createClient ===
        "function"
      ){

        startMa7alakStories();

      }
      else{

        existing.addEventListener(
          "load",
          startMa7alakStories,
          {
            once:true
          }
        );

      }

      return;

    }

    const script =
      document.createElement(
        "script"
      );

    script.src =
      MA7ALAK_SUPABASE_SRC;

    script.onload =
      startMa7alakStories;

    script.onerror =
      function(){

        console.error(
          "MA7ALAK: Supabase library failed to load."
        );

      };

    document.head.appendChild(
      script
    );

  }


  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      bootMa7alakStories,
      {
        once:true
      }
    );

  }
  else{

    bootMa7alakStories();

  }

})();


/* =========================================================
   WHAT CHANGED
   =========================================================
   1. Converted the full working Story block into true GitHub-ready JavaScript.
   2. Removed outer HTML <style>, Story-circle HTML, and <script> tags from executable source.
   3. The original Story CSS is now injected by JavaScript.
   4. The original Story circle / owner + markup is now injected by JavaScript.
   5. Supabase JS is loaded automatically only when it is not already available.
   6. Preserved the V2 phone/browser Back audio cleanup and Story-history fix.
   7. Preserved the existing owner + button and MA7ALAK_OPEN_STORY_UPLOADER bridge.
   8. No Story likes, owner verification, upload logic, navigation, timing, Supabase data, or viewer-count logic was intentionally changed.
========================================================= */ 

