/* =========================================================
   SHOUFHON — SHOP PROFILE HUB
   HOSTINGER-SAFE EXTERNAL LOADER

   Hostinger receives only a tiny mount + script tag.
   The exact proven About/Social/Location/Stats engines live here.
========================================================= */
(function(){
"use strict";

if(window.__MA7ALAK_EXTERNAL_PROFILE_HUB_RUNNING__){
  return;
}
window.__MA7ALAK_EXTERNAL_PROFILE_HUB_RUNNING__ = true;

/*
   The external Design Studio V2 runtime is authoritative.
   Older embedded style engines remain only as fallback code and must not
   overwrite the newer animation state.
*/
window.__MA7ALAK_HUB_DS_V2_AUTHORITATIVE__ = true;

const script = document.currentScript;

let mount =
  document.getElementById("ma7alak-shop-profile-hub-mount");

if(!mount && script){
  const prev = script.previousElementSibling;
  if(prev && prev.hasAttribute("data-shop-slug")){
    mount = prev;
  }
}

if(!mount){
  console.error("[ShoufHon Hub] Mount element not found.");
  return;
}

const slug =
  String(
    mount.getAttribute("data-shop-slug") ||
    ""
  )
  .trim()
  .toLowerCase();

if(!slug){
  mount.innerHTML =
    '<div style="padding:12px;color:#ffb7c5;font:600 12px Arial;text-align:center">Missing data-shop-slug</div>';
  return;
}

window.__MA7ALAK_EXACT_HUB_SLUG__ = slug;

const MARKUP = "<!-- =========================================================\n     SHOUFHON — EXACT MERGED SHOP HUB\n\n     WHY THIS VERSION EXISTS:\n     The first merged rewrite changed the proven animation engines,\n     service icon behavior, text typography and Location effects.\n\n     THIS VERSION DOES NOT REWRITE THEM.\n\n     ✓ Exact old About CSS/keyframes/Admin effects\n     ✓ Exact old service icon renderer\n     ✓ Tattoo ink-drop + Piercing sparkle restored\n     ✓ Exact old About text typography restored\n     ✓ Exact old Social design\n     ✓ Exact old Location aura / shimmer / pin / clock animations\n     ✓ Exact old optimized Stats design + eye animation\n     ✓ One Hostinger embed\n     ✓ One slug to change\n     ✓ Optional Google Map added without replacing old Location code\n========================================================= -->\n\n<style id=\"ma7alak-exact-merged-hub-shell-style\">\n/* =========================================================\n   SHOUFHON EXACT MERGED HUB SHELL\n   IMPORTANT:\n   The inner About / Social / Location / Stats modules below\n   are the SAME proven separate modules, not rewritten copies.\n   This shell only groups them into ONE Hostinger embed.\n========================================================= */\n\n#ma7alak-exact-merged-hub{\n  --m7-exact-shell-accent:#f2caed;\n  --m7-exact-shell-accent-rgb:242,202,237;\n\n  width:100%;\n  max-width:720px;\n  margin:0 auto;\n  padding:8px 0 10px;\n  box-sizing:border-box;\n\n  position:relative;\n  overflow:hidden;\n\n  border-radius:30px;\n\n  border:0;\n\n  background:\n    radial-gradient(\n      circle at 50% -8%,\n      rgba(var(--m7-exact-shell-accent-rgb),.085),\n      transparent 28%\n    ),\n    linear-gradient(\n      180deg,\n      rgba(9,8,10,.94),\n      rgba(5,5,6,.98)\n    );\n\n  box-shadow:\n    0 24px 58px rgba(0,0,0,.38),\n    0 0 25px rgba(var(--m7-exact-shell-accent-rgb),.06),\n    inset 0 1px 0 rgba(255,255,255,.025);\n\n  isolation:isolate;\n}\n\n#ma7alak-exact-merged-hub::before{\n  content:\"\";\n  position:absolute;\n  inset:0;\n  z-index:20;\n  pointer-events:none;\n\n  border:\n    1px solid\n    rgba(var(--m7-exact-shell-accent-rgb),.23);\n\n  border-radius:inherit;\n\n  box-sizing:border-box;\n}\n\n\n/*\n  Keep every proven module's own visual engine.\n  Only normalize its maximum width so it fits cleanly inside one embed.\n*/\n#ma7alak-exact-merged-hub > .zee-about-card,\n#ma7alak-exact-merged-hub > .ma7alak-social-section,\n#ma7alak-exact-merged-hub > .ma7alak-location-section,\n#ma7alak-exact-merged-hub > .ma7alak-realtime-stats{\n  max-width:680px;\n}\n\n\n/* Slightly reduce the empty gap created by separate Hostinger elements.\n   This does NOT touch typography, icons, keyframes, or Admin effect CSS. */\n#ma7alak-exact-merged-hub > .zee-about-card{\n  margin-top:8px;\n  margin-bottom:10px;\n}\n\n#ma7alak-exact-merged-hub > .ma7alak-social-section{\n  margin-top:10px;\n  margin-bottom:10px;\n}\n\n#ma7alak-exact-merged-hub > .ma7alak-location-section{\n  margin-top:10px;\n  margin-bottom:10px;\n}\n\n#ma7alak-exact-merged-hub > .ma7alak-realtime-stats{\n  margin-top:10px;\n  margin-bottom:8px;\n}\n\n\n/* =========================================================\n   OPTIONAL GOOGLE MAP\n   New addition only. Existing Location module stays untouched.\n========================================================= */\n\n#ma7alak-exact-map-section{\n  width:calc(100% - 20px);\n  max-width:680px;\n  margin:10px auto;\n  padding:12px;\n  box-sizing:border-box;\n\n  border-radius:20px;\n  border:1px solid rgba(var(--m7-exact-shell-accent-rgb),.24);\n\n  background:\n    radial-gradient(\n      circle at 15% 0%,\n      rgba(var(--m7-exact-shell-accent-rgb),.08),\n      transparent 34%\n    ),\n    linear-gradient(\n      145deg,\n      rgba(25,22,24,.94),\n      rgba(11,10,11,.97)\n    );\n\n  box-shadow:\n    0 12px 28px rgba(0,0,0,.22),\n    inset 0 1px 0 rgba(255,255,255,.035);\n}\n\n#ma7alak-exact-map-section[hidden]{\n  display:none!important;\n}\n\n.ma7alak-exact-map-heading{\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  gap:8px;\n  margin:0 0 10px;\n\n  color:var(--m7-shop-accent-light,#f2d99f);\n\n  font-family:Georgia,\"Times New Roman\",serif;\n  font-size:17px;\n  font-weight:800;\n\n  text-shadow:\n    0 0 8px rgba(var(--m7-exact-shell-accent-rgb),.24),\n    0 2px 8px rgba(0,0,0,.55);\n}\n\n.ma7alak-exact-map-heading svg{\n  width:19px;\n  height:19px;\n  display:block;\n}\n\n.ma7alak-exact-map-frame{\n  position:relative;\n  width:100%;\n  aspect-ratio:16 / 9;\n  min-height:150px;\n  overflow:hidden;\n\n  border-radius:15px;\n\n  background:rgba(255,255,255,.025);\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,.035);\n}\n\n.ma7alak-exact-map-frame iframe{\n  position:absolute;\n  inset:0;\n\n  width:100%;\n  height:100%;\n\n  border:0;\n  display:block;\n}\n\n\n/* =========================================================\n   PHONE\n========================================================= */\n\n@media(max-width:600px){\n\n  #ma7alak-exact-merged-hub{\n    width:100%;\n    padding:5px 0 8px;\n    border-radius:26px;\n  }\n\n}\n\n@media(max-width:390px){\n\n  #ma7alak-exact-map-section{\n    width:calc(100% - 14px);\n    margin-left:7px;\n    margin-right:7px;\n    padding:9px;\n  }\n\n}\n</style>\n\n<div id=\"ma7alak-exact-merged-hub\">\n<!-- =========================================================\n     SHOUFHON — ZEE PREMIUM ABOUT SECTION\n     PHONE-FIRST\n========================================================= -->\n\n<section class=\"zee-about-card m7-fx-title-sparkles m7-fx-title-shimmer m7-fx-ornament\">\n\n  <!-- DECORATIVE GLOW -->\n  <div class=\"zee-about-glow zee-glow-one\" aria-hidden=\"true\"></div>\n  <div class=\"zee-about-glow zee-glow-two\" aria-hidden=\"true\"></div>\n\n  <!-- OPTIONAL ADMIN-CONTROLLED FLOATING SPARKLES -->\n  <div id=\"ma7alak-about-floating-sparkles\" class=\"ma7alak-about-floating-sparkles\" aria-hidden=\"true\"></div>\n\n  <!-- TOP ORNAMENT -->\n  <div class=\"zee-about-topline\" aria-hidden=\"true\">\n\n    <span class=\"zee-line\"></span>\n\n    <span class=\"zee-center-symbol\">\n      ✦\n    </span>\n\n    <span class=\"zee-line zee-line-right\"></span>\n\n  </div>\n\n\n  <!-- TITLE — AUTO FROM SHOP SLUG -->\n  <div class=\"zee-about-heading\">\n\n    <div class=\"zee-kicker\" id=\"ma7alak-about-kicker\">\n      SHOP\n    </div>\n\n    <h2 class=\"zee-about-title\">\n\n      <span class=\"zee-title-word\" id=\"ma7alak-about-title\">\n        About\n      </span>\n\n      <span class=\"zee-title-sparkle zee-sparkle-one\" aria-hidden=\"true\">\n        ✦\n      </span>\n\n      <span class=\"zee-title-sparkle zee-sparkle-two\" aria-hidden=\"true\">\n        ✧\n      </span>\n\n    </h2>\n\n    <div id=\"ma7alak-about-arabic-name\" class=\"ma7alak-about-arabic-name\" hidden></div>\n\n  </div>\n\n\n  <!-- MAIN ABOUT CONTENT — AUTO FROM ADMIN -->\n  <div class=\"zee-about-content\">\n\n    <div class=\"zee-quote-mark\" aria-hidden=\"true\">\n      ❝\n    </div>\n\n    <p class=\"zee-about-text\" id=\"ma7alak-about-text\" dir=\"auto\">\n      Loading…\n    </p>\n\n  </div>\n\n\n  <!-- SERVICES — AUTO FROM ADMIN -->\n  <div class=\"zee-about-services\" id=\"ma7alak-about-services\"></div>\n\n\n  <!-- BOTTOM SIGNATURE -->\n  <div class=\"zee-about-signature\">\n\n    <span class=\"zee-signature-line\"></span>\n\n    <span class=\"zee-signature-text\" id=\"ma7alak-about-signature\">\n      Your style. Your story.\n    </span>\n\n    <span class=\"zee-signature-line zee-signature-line-right\"></span>\n\n  </div>\n\n</section>\n\n\n<style>\n\n/* =========================================================\n   ZEE PREMIUM ABOUT — ROOT\n========================================================= */\n\n.zee-about-card {\n\n  position: relative;\n\n  width: calc(100% - 18px);\n\n  max-width: 680px;\n\n  margin: 22px auto;\n\n  padding:\n    22px 18px 20px;\n\n  box-sizing: border-box;\n\n  overflow: hidden;\n\n  border-radius: 24px;\n\n  border:\n    1px solid rgba(239,143,182,.28);\n\n  background:\n    radial-gradient(\n      circle at 20% 0%,\n      rgba(239,143,182,.10),\n      transparent 34%\n    ),\n    radial-gradient(\n      circle at 90% 100%,\n      rgba(217,164,65,.08),\n      transparent 34%\n    ),\n    linear-gradient(\n      145deg,\n      rgba(24,20,24,.97),\n      rgba(10,10,12,.98)\n    );\n\n  box-shadow:\n    0 18px 44px rgba(0,0,0,.34),\n    inset 0 1px 0 rgba(255,255,255,.035),\n    0 0 24px rgba(239,143,182,.04);\n\n  backdrop-filter:\n    blur(16px)\n    saturate(120%);\n\n  -webkit-backdrop-filter:\n    blur(16px)\n    saturate(120%);\n\n  font-family:\n    Arial,\n    \"Segoe UI\",\n    sans-serif;\n\n  isolation: isolate;\n\n}\n\n\n/* =========================================================\n   SOFT BACKGROUND GLOWS\n========================================================= */\n\n.zee-about-glow {\n\n  position: absolute;\n\n  border-radius: 50%;\n\n  filter:\n    blur(30px);\n\n  pointer-events: none;\n\n  z-index: 0;\n\n}\n\n\n.zee-glow-one {\n\n  width: 120px;\n  height: 120px;\n\n  left: -55px;\n  top: 40px;\n\n  background:\n    rgba(239,143,182,.10);\n\n}\n\n\n.zee-glow-two {\n\n  width: 130px;\n  height: 130px;\n\n  right: -60px;\n  bottom: 24px;\n\n  background:\n    rgba(217,164,65,.08);\n\n}\n\n\n/* =========================================================\n   TOP DECORATIVE LINE\n========================================================= */\n\n.zee-about-topline {\n\n  position: relative;\n  z-index: 2;\n\n  width: 100%;\n\n  display: flex;\n\n  align-items: center;\n\n  justify-content: center;\n\n  gap: 10px;\n\n  margin-bottom: 15px;\n\n}\n\n\n.zee-line {\n\n  position: relative;\n\n  flex: 1;\n\n  max-width: 92px;\n\n  height: 2px;\n\n  overflow: visible;\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent 0%,\n      rgba(239,143,182,.32) 25%,\n      #ffd8e8 46%,\n      #f2c46d 58%,\n      transparent 100%\n    );\n\n  background-size:\n    240% 100%;\n\n  animation:\n    zeeLineShine\n    2.2s\n    linear\n    infinite;\n\n}\n\n\n.zee-line-right {\n\n  transform:\n    scaleX(-1);\n\n}\n\n\n.zee-line::after {\n\n  content: \"\";\n\n  position: absolute;\n\n  top: 50%;\n  left: -8px;\n\n  width: 8px;\n  height: 8px;\n\n  transform:\n    translateY(-50%);\n\n  border-radius: 50%;\n\n  background:\n    radial-gradient(\n      circle,\n      #ffffff 0 15%,\n      #ffd7e7 30%,\n      #f0bd65 48%,\n      transparent 70%\n    );\n\n  opacity: 0;\n\n  filter:\n    drop-shadow(\n      0 0 6px\n      rgba(255,188,216,.78)\n    );\n\n  animation:\n    zeeTravelSpark\n    2.2s\n    linear\n    infinite;\n\n}\n\n\n.zee-line-right::after {\n\n  animation-delay:\n    .15s;\n\n}\n\n\n@keyframes zeeLineShine {\n\n  from {\n    background-position:\n      130% 50%;\n  }\n\n  to {\n    background-position:\n      -130% 50%;\n  }\n\n}\n\n\n@keyframes zeeTravelSpark {\n\n  0% {\n    left: -8px;\n    opacity: 0;\n  }\n\n  12% {\n    opacity: 1;\n  }\n\n  84% {\n    opacity: .9;\n  }\n\n  100% {\n    left: calc(100% + 2px);\n    opacity: 0;\n  }\n\n}\n\n\n/* =========================================================\n   CENTER SYMBOL\n========================================================= */\n\n.zee-center-symbol {\n\n  color:\n    #ffd7e7;\n\n  font-size:\n    12px;\n\n  line-height:\n    1;\n\n  text-shadow:\n    0 0 7px rgba(255,255,255,.75),\n    0 0 12px rgba(239,143,182,.56);\n\n  animation:\n    zeeCenterPulse\n    1.8s\n    ease-in-out\n    infinite;\n\n}\n\n\n@keyframes zeeCenterPulse {\n\n  0%,\n  100% {\n\n    transform:\n      scale(.88)\n      rotate(0deg);\n\n    opacity:\n      .72;\n\n  }\n\n  50% {\n\n    transform:\n      scale(1.25)\n      rotate(45deg);\n\n    opacity:\n      1;\n\n  }\n\n}\n\n\n/* =========================================================\n   HEADING\n========================================================= */\n\n.zee-about-heading {\n\n  position: relative;\n  z-index: 2;\n\n  text-align: center;\n\n  margin-bottom:\n    16px;\n\n}\n\n\n.zee-kicker {\n\n  margin-bottom:\n    7px;\n\n  color:\n    rgba(255,216,232,.72);\n\n  font-size:\n    9px;\n\n  font-weight:\n    900;\n\n  letter-spacing:\n    2.7px;\n\n  text-transform:\n    uppercase;\n\n}\n\n\n.zee-about-title {\n\n  position: relative;\n\n  display: inline-block;\n\n  margin: 0;\n\n  padding:\n    0 12px;\n\n  font-family:\n    Georgia,\n    \"Times New Roman\",\n    serif;\n\n  font-size:\n    28px;\n\n  line-height:\n    1.08;\n\n  font-weight:\n    800;\n\n}\n\n\n.zee-title-word {\n\n  display: inline-block;\n\n  background:\n    linear-gradient(\n      105deg,\n      #ffffff 0%,\n      #ffd5e5 24%,\n      #ffffff 39%,\n      #efbc62 49%,\n      #fff5fa 60%,\n      #ee9fc0 75%,\n      #ffffff 100%\n    );\n\n  background-size:\n    280% 100%;\n\n  -webkit-background-clip:\n    text;\n\n  background-clip:\n    text;\n\n  color:\n    transparent;\n\n  -webkit-text-fill-color:\n    transparent;\n\n  animation:\n    zeeTitleShimmer\n    3.7s\n    ease-in-out\n    infinite;\n\n  filter:\n    drop-shadow(\n      0 3px 10px\n      rgba(0,0,0,.30)\n    );\n\n}\n\n\n@keyframes zeeTitleShimmer {\n\n  from {\n    background-position:\n      120% 50%;\n  }\n\n  to {\n    background-position:\n      -120% 50%;\n  }\n\n}\n\n\n/* =========================================================\n   TITLE SPARKLES\n========================================================= */\n\n.zee-title-sparkle {\n\n  position: absolute;\n\n  color:\n    #ffd5e5;\n\n  text-shadow:\n    0 0 6px rgba(255,255,255,.80),\n    0 0 12px rgba(239,143,182,.62);\n\n  pointer-events: none;\n\n}\n\n\n.zee-sparkle-one {\n\n  left: -3px;\n  top: -8px;\n\n  font-size:\n    11px;\n\n  animation:\n    zeeSparkleOne\n    3.2s\n    ease-in-out\n    infinite;\n\n}\n\n\n.zee-sparkle-two {\n\n  right: -1px;\n  bottom: -5px;\n\n  color:\n    #ffe3a1;\n\n  font-size:\n    12px;\n\n  animation:\n    zeeSparkleTwo\n    3.2s\n    ease-in-out\n    infinite;\n\n}\n\n\n@keyframes zeeSparkleOne {\n\n  0%,\n  20%,\n  100% {\n\n    opacity: 0;\n\n    transform:\n      scale(.5)\n      rotate(0deg);\n\n  }\n\n  38% {\n\n    opacity: 1;\n\n    transform:\n      scale(1.2)\n      rotate(36deg);\n\n  }\n\n  52% {\n\n    opacity: .4;\n\n    transform:\n      scale(.85)\n      rotate(68deg);\n\n  }\n\n}\n\n\n@keyframes zeeSparkleTwo {\n\n  0%,\n  48%,\n  100% {\n\n    opacity: 0;\n\n    transform:\n      scale(.5)\n      rotate(0deg);\n\n  }\n\n  68% {\n\n    opacity: 1;\n\n    transform:\n      scale(1.2)\n      rotate(-34deg);\n\n  }\n\n  84% {\n\n    opacity: .45;\n\n    transform:\n      scale(.85)\n      rotate(-70deg);\n\n  }\n\n}\n\n\n/* =========================================================\n   MAIN CONTENT BOX\n========================================================= */\n\n.zee-about-content {\n\n  position: relative;\n  z-index: 2;\n\n  padding:\n    18px 16px 17px;\n\n  border-radius:\n    18px;\n\n  border:\n    1px solid\n    rgba(255,255,255,.055);\n\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255,255,255,.035),\n      rgba(255,255,255,.012)\n    );\n\n  box-shadow:\n    inset 0 1px 0\n    rgba(255,255,255,.025);\n\n}\n\n\n/* =========================================================\n   QUOTE MARK\n========================================================= */\n\n.zee-quote-mark {\n\n  position: absolute;\n\n  left: 12px;\n  top: 5px;\n\n  color:\n    rgba(239,143,182,.17);\n\n  font-family:\n    Georgia,\n    serif;\n\n  font-size:\n    44px;\n\n  line-height:\n    1;\n\n  pointer-events:\n    none;\n\n}\n\n\n/* =========================================================\n   ARABIC TEXT\n========================================================= */\n\n.zee-about-text {\n\n  position: relative;\n\n  margin: 0;\n\n  color:\n    rgba(255,255,255,.92);\n\n  font-family:\n    Tahoma,\n    Arial,\n    sans-serif;\n\n  font-size:\n    15px;\n\n  font-weight:\n    650;\n\n  line-height:\n    2;\n\n  text-align:\n    right;\n\n  text-shadow:\n    0 2px 8px\n    rgba(0,0,0,.50);\n\n  -webkit-font-smoothing:\n    antialiased;\n\n  text-rendering:\n    optimizeLegibility;\n\n}\n\n\n.zee-about-text strong {\n\n  color:\n    #ffd0e2;\n\n  font-weight:\n    900;\n\n  text-shadow:\n    0 0 10px\n    rgba(239,143,182,.18);\n\n}\n\n\n/* =========================================================\n   SERVICE PILLS\n========================================================= */\n\n.zee-about-services {\n\n  position: relative;\n  z-index: 2;\n\n  display: grid;\n\n  grid-template-columns:\n    repeat(2,minmax(0,1fr));\n\n  gap:\n    9px;\n\n  margin-top:\n    12px;\n\n}\n\n\n.zee-service-pill {\n\n  position: relative;\n\n  min-height:\n    48px;\n\n  display: flex;\n\n  align-items: center;\n\n  justify-content: center;\n\n  gap:\n    8px;\n\n  overflow:\n    visible;\n\n  border-radius:\n    15px;\n\n  border:\n    1px solid\n    rgba(239,143,182,.18);\n\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255,255,255,.035),\n      rgba(255,255,255,.012)\n    );\n\n  color:\n    #fff;\n\n  font-size:\n    12px;\n\n  font-weight:\n    850;\n\n  letter-spacing:\n    .25px;\n\n  box-shadow:\n    inset 0 1px 0\n    rgba(255,255,255,.025);\n\n}\n\n\n.zee-service-icon {\n\n  position: relative;\n\n  width:\n    27px;\n\n  height:\n    27px;\n\n  display: flex;\n\n  align-items: center;\n\n  justify-content: center;\n\n  border-radius:\n    50%;\n\n  color:\n    #ffdca0;\n\n  border:\n    1px solid\n    rgba(244,194,103,.45);\n\n  background:\n    radial-gradient(\n      circle at 35% 30%,\n      rgba(255,240,200,.15),\n      rgba(217,164,65,.06)\n    );\n\n  box-shadow:\n    0 0 8px\n    rgba(217,164,65,.14);\n\n}\n\n\n.zee-service-icon svg {\n\n  width:\n    16px;\n\n  height:\n    16px;\n\n  display:\n    block;\n\n}\n\n\n/* =========================================================\n   TATTOO INK DROP\n========================================================= */\n\n.zee-ink-drop {\n\n  position:\n    absolute;\n\n  left:\n    calc(50% - 44px);\n\n  top:\n    32px;\n\n  width:\n    4px;\n\n  height:\n    7px;\n\n  border-radius:\n    55% 45% 62% 38%\n    /\n    42% 42% 58% 58%;\n\n  background:\n    linear-gradient(\n      180deg,\n      #35353a,\n      #050506\n    );\n\n  opacity:\n    0;\n\n  animation:\n    zeeInkDrop\n    3.3s\n    ease-in\n    infinite;\n\n}\n\n\n@keyframes zeeInkDrop {\n\n  0%,\n  46% {\n\n    opacity:\n      0;\n\n    transform:\n      translateY(-3px)\n      scale(.5);\n\n  }\n\n  58% {\n\n    opacity:\n      1;\n\n  }\n\n  76% {\n\n    opacity:\n      .8;\n\n    transform:\n      translateY(8px)\n      scale(.82);\n\n  }\n\n  90%,\n  100% {\n\n    opacity:\n      0;\n\n    transform:\n      translateY(15px)\n      scale(.55);\n\n  }\n\n}\n\n\n/* =========================================================\n   PIERCING SPARKLE\n========================================================= */\n\n.zee-piercing-spark {\n\n  position:\n    absolute;\n\n  right:\n    12px;\n\n  top:\n    6px;\n\n  color:\n    #ffd2e4;\n\n  font-size:\n    9px;\n\n  text-shadow:\n    0 0 6px rgba(255,255,255,.90),\n    0 0 10px rgba(239,143,182,.68);\n\n  animation:\n    zeePiercingSpark\n    2.1s\n    ease-in-out\n    infinite;\n\n}\n\n\n@keyframes zeePiercingSpark {\n\n  0%,\n  100% {\n\n    opacity:\n      .18;\n\n    transform:\n      scale(.7)\n      rotate(0deg);\n\n  }\n\n  50% {\n\n    opacity:\n      1;\n\n    transform:\n      scale(1.25)\n      rotate(45deg);\n\n  }\n\n}\n\n\n/* =========================================================\n   SIGNATURE\n========================================================= */\n\n.zee-about-signature {\n\n  position: relative;\n  z-index: 2;\n\n  margin-top:\n    15px;\n\n  display:\n    flex;\n\n  align-items:\n    center;\n\n  justify-content:\n    center;\n\n  gap:\n    9px;\n\n}\n\n\n.zee-signature-line {\n\n  flex:\n    1;\n\n  max-width:\n    55px;\n\n  height:\n    1px;\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(239,143,182,.42)\n    );\n\n}\n\n\n.zee-signature-line-right {\n\n  transform:\n    scaleX(-1);\n\n}\n\n\n.zee-signature-text {\n\n  color:\n    rgba(255,222,235,.72);\n\n  font-family:\n    Georgia,\n    serif;\n\n  font-size:\n    11px;\n\n  font-style:\n    italic;\n\n  letter-spacing:\n    .3px;\n\n}\n\n\n/* =========================================================\n   PHONE FIRST\n========================================================= */\n\n@media(max-width:600px) {\n\n  .zee-about-card {\n\n    width:\n      calc(100% - 16px);\n\n    margin:\n      18px 8px;\n\n    padding:\n      19px 14px 17px;\n\n    border-radius:\n      21px;\n\n  }\n\n\n  .zee-about-title {\n\n    font-size:\n      25px;\n\n  }\n\n\n  .zee-kicker {\n\n    font-size:\n      8px;\n\n    letter-spacing:\n      2.1px;\n\n  }\n\n\n  .zee-about-content {\n\n    padding:\n      16px 13px 15px;\n\n    border-radius:\n      16px;\n\n  }\n\n\n  .zee-about-text {\n\n    font-size:\n      14px;\n\n    line-height:\n      1.95;\n\n  }\n\n\n  .zee-service-pill {\n\n    min-height:\n      46px;\n\n    font-size:\n      11px;\n\n  }\n\n\n  .zee-signature-text {\n\n    font-size:\n      10px;\n\n  }\n\n}\n\n\n/* =========================================================\n   SMALL PHONES\n========================================================= */\n\n@media(max-width:380px) {\n\n  .zee-about-card {\n\n    width:\n      calc(100% - 12px);\n\n    margin:\n      16px 6px;\n\n    padding:\n      17px 11px 15px;\n\n  }\n\n\n  .zee-about-title {\n\n    font-size:\n      23px;\n\n  }\n\n\n  .zee-about-text {\n\n    font-size:\n      13px;\n\n  }\n\n\n  .zee-about-services {\n\n    gap:\n      7px;\n\n  }\n\n\n  .zee-service-pill {\n\n    min-height:\n      44px;\n\n    gap:\n      6px;\n\n  }\n\n}\n\n\n/* Mobile animation fix: reduced-motion auto-disable removed for this visual component. */\n\n\n\n/* =========================================================\n   WHAT CHANGED\n   =========================================================\n   1. Built a completely custom About section for Zee Tattoo & Piercing.\n   2. Designed specifically for a feminine tattoo / piercing / beauty aesthetic.\n   3. Added dark premium glass styling with blush pink, rose-gold, white, and gold accents.\n   4. Added animated decorative side lines with moving light.\n   5. Added animated sparkles around the \"About Zee\" title.\n   6. Added a subtle animated tattoo ink drop.\n   7. Added a piercing sparkle animation.\n   8. Added Tattoo and Piercing service pills.\n   9. Preserved the Arabic About text and improved readability.\n   10. Added \"Your style. Your story.\" signature detail.\n   11. Built phone-first for mobile viewing.\n   12. No JavaScript required — all visual effects are pure CSS.\n========================================================= */\n\n\n\n/* =========================================================\n   PHONE ANIMATION HARDENING — ABOUT ZEE\n   Same design; animation compatibility only.\n========================================================= */\n\n.zee-line,\n.zee-line::after,\n.zee-center-symbol,\n.zee-title-word,\n.zee-title-sparkle,\n.zee-ink-drop,\n.zee-piercing-spark{\n  animation-play-state:running!important;\n  -webkit-animation-play-state:running!important;\n  backface-visibility:hidden;\n  -webkit-backface-visibility:hidden;\n  will-change:transform,opacity,background-position;\n}\n\n.zee-line{\n  -webkit-animation:zeeLineShine 2.2s linear infinite!important;\n}\n\n.zee-line::after{\n  -webkit-animation:zeeTravelSpark 2.2s linear infinite!important;\n}\n\n.zee-line-right::after{\n  -webkit-animation-delay:.15s!important;\n}\n\n.zee-center-symbol{\n  -webkit-animation:zeeCenterPulse 1.8s ease-in-out infinite!important;\n}\n\n.zee-title-word{\n  -webkit-animation:zeeTitleShimmer 3.7s ease-in-out infinite!important;\n}\n\n.zee-sparkle-one{\n  -webkit-animation:zeeSparkleOne 3.2s ease-in-out infinite!important;\n}\n\n.zee-sparkle-two{\n  -webkit-animation:zeeSparkleTwo 3.2s ease-in-out infinite!important;\n}\n\n.zee-ink-drop{\n  -webkit-animation:zeeInkDrop 3.3s ease-in infinite!important;\n}\n\n.zee-piercing-spark{\n  -webkit-animation:zeePiercingSpark 2.1s ease-in-out infinite!important;\n}\n\n@media(max-width:600px){\n\n  .zee-line{\n    animation:zeeLineShine 2.2s linear infinite!important;\n    -webkit-animation:zeeLineShine 2.2s linear infinite!important;\n  }\n\n  .zee-line::after{\n    animation:zeeTravelSpark 2.2s linear infinite!important;\n    -webkit-animation:zeeTravelSpark 2.2s linear infinite!important;\n  }\n\n  .zee-center-symbol{\n    animation:zeeCenterPulse 1.8s ease-in-out infinite!important;\n    -webkit-animation:zeeCenterPulse 1.8s ease-in-out infinite!important;\n  }\n\n  .zee-title-word{\n    animation:zeeTitleShimmer 3.7s ease-in-out infinite!important;\n    -webkit-animation:zeeTitleShimmer 3.7s ease-in-out infinite!important;\n  }\n\n  .zee-sparkle-one{\n    animation:zeeSparkleOne 3.2s ease-in-out infinite!important;\n    -webkit-animation:zeeSparkleOne 3.2s ease-in-out infinite!important;\n  }\n\n  .zee-sparkle-two{\n    animation:zeeSparkleTwo 3.2s ease-in-out infinite!important;\n    -webkit-animation:zeeSparkleTwo 3.2s ease-in-out infinite!important;\n  }\n\n  .zee-ink-drop{\n    animation:zeeInkDrop 3.3s ease-in infinite!important;\n    -webkit-animation:zeeInkDrop 3.3s ease-in infinite!important;\n  }\n\n  .zee-piercing-spark{\n    animation:zeePiercingSpark 2.1s ease-in-out infinite!important;\n    -webkit-animation:zeePiercingSpark 2.1s ease-in-out infinite!important;\n  }\n}\n\n/* =========================================================\n   WHAT CHANGED — PHONE ANIMATION FIX\n   =========================================================\n   1. About Zee design, colors, layout and Arabic content are unchanged.\n   2. Removed the reduced-motion rule that could disable every About animation on phones.\n   3. Added WebKit animation support for mobile browsers.\n   4. Added explicit running animation state.\n   5. Added backface-visibility and will-change for mobile rendering.\n   6. Added phone-specific animation declarations below 600px.\n========================================================= */\n\n\n\n/* =========================================================\n   SHOUFHON SLUG-DRIVEN ABOUT\n   Shop color + Admin content\n========================================================= */\n\n:root{\n  --m7-about-accent:#ef8fb6;\n  --m7-about-accent-rgb:239,143,182;\n  --m7-about-accent-light:#f8cadd;\n  --m7-about-accent-dark:#985b73;\n}\n\n.zee-about-card{\n  border-color:rgba(var(--m7-about-accent-rgb),.34)!important;\n  background:\n    radial-gradient(circle at 20% 0%,rgba(var(--m7-about-accent-rgb),.12),transparent 34%),\n    radial-gradient(circle at 90% 100%,rgba(217,164,65,.08),transparent 34%),\n    linear-gradient(145deg,rgba(24,20,24,.97),rgba(10,10,12,.98))!important;\n  box-shadow:\n    0 18px 44px rgba(0,0,0,.34),\n    inset 0 1px 0 rgba(255,255,255,.035),\n    0 0 24px rgba(var(--m7-about-accent-rgb),.08)!important;\n}\n\n.zee-glow-one{\n  background:rgba(var(--m7-about-accent-rgb),.12)!important;\n}\n\n.zee-kicker,\n.zee-title-sparkle,\n.zee-about-text strong,\n.zee-signature-text{\n  color:var(--m7-about-accent-light)!important;\n}\n\n.zee-service-pill{\n  border-color:rgba(var(--m7-about-accent-rgb),.24)!important;\n}\n\n.zee-service-icon{\n  color:var(--m7-about-accent-light)!important;\n  border-color:rgba(var(--m7-about-accent-rgb),.42)!important;\n  background:\n    radial-gradient(\n      circle at 35% 30%,\n      rgba(255,255,255,.14),\n      rgba(var(--m7-about-accent-rgb),.08)\n    )!important;\n  box-shadow:0 0 10px rgba(var(--m7-about-accent-rgb),.15)!important;\n}\n\n.ma7alak-about-arabic-name{\n  margin-top:8px;\n  color:var(--m7-about-accent-light);\n  font-family:Tahoma,Arial,sans-serif;\n  font-size:15px;\n  font-weight:800;\n  line-height:1.4;\n  direction:rtl;\n  text-align:center;\n  opacity:.9;\n}\n\n#ma7alak-about-text{\n  white-space:pre-line!important;\n}\n\n.zee-about-services:empty{\n  display:none!important;\n}\n\n.ma7alak-service-svg{\n  width:16px;\n  height:16px;\n  display:block;\n}\n\n@media(max-width:600px){\n  .ma7alak-about-arabic-name{\n    font-size:14px;\n  }\n}\n\n\n\n/* =========================================================\n   ADMIN-CONTROLLED ABOUT EFFECTS\n========================================================= */\n\n.ma7alak-about-floating-sparkles{\n  position:absolute;\n  inset:0;\n  overflow:hidden;\n  pointer-events:none;\n  z-index:1;\n  display:none;\n}\n\n.zee-about-card.m7-fx-floating .ma7alak-about-floating-sparkles{\n  display:block;\n}\n\n.ma7alak-about-floating-sparkles span{\n  position:absolute;\n  left:var(--m7-left);\n  top:var(--m7-top);\n  width:var(--m7-size);\n  height:var(--m7-size);\n  border-radius:50%;\n  opacity:0;\n  background:\n    radial-gradient(\n      circle,\n      #fff 0 16%,\n      var(--m7-about-accent-light) 28%,\n      rgba(var(--m7-about-accent-rgb),.72) 48%,\n      transparent 72%\n    );\n  filter:\n    drop-shadow(0 0 5px rgba(var(--m7-about-accent-rgb),.72));\n  animation:\n    m7AboutFloatSpark\n    var(--m7-duration)\n    ease-in-out\n    var(--m7-delay)\n    infinite;\n  -webkit-animation:\n    m7AboutFloatSpark\n    var(--m7-duration)\n    ease-in-out\n    var(--m7-delay)\n    infinite;\n  animation-play-state:running;\n  -webkit-animation-play-state:running;\n  will-change:transform,opacity;\n  -webkit-backface-visibility:hidden;\n  backface-visibility:hidden;\n}\n\n@keyframes m7AboutFloatSpark{\n  0%,100%{\n    opacity:0;\n    transform:translate3d(0,10px,0) scale(.45) rotate(0deg);\n  }\n  18%{\n    opacity:.78;\n  }\n  55%{\n    opacity:1;\n    transform:\n      translate3d(var(--m7-drift),-14px,0)\n      scale(1.12)\n      rotate(35deg);\n  }\n  82%{\n    opacity:.34;\n  }\n}\n\n@-webkit-keyframes m7AboutFloatSpark{\n  0%,100%{\n    opacity:0;\n    -webkit-transform:translate3d(0,10px,0) scale(.45) rotate(0deg);\n  }\n  18%{\n    opacity:.78;\n  }\n  55%{\n    opacity:1;\n    -webkit-transform:\n      translate3d(var(--m7-drift),-14px,0)\n      scale(1.12)\n      rotate(35deg);\n  }\n  82%{\n    opacity:.34;\n  }\n}\n\n/* Title sparkles */\n.zee-about-card:not(.m7-fx-title-sparkles)\n.zee-title-sparkle{\n  display:none!important;\n}\n\n/* Title shimmer */\n.zee-about-card:not(.m7-fx-title-shimmer)\n.zee-title-word{\n  animation:none!important;\n  -webkit-animation:none!important;\n  background:none!important;\n  color:#fff!important;\n  -webkit-text-fill-color:#fff!important;\n  filter:none!important;\n}\n\n/* Top lines + center ornament */\n.zee-about-card:not(.m7-fx-ornament)\n.zee-line,\n.zee-about-card:not(.m7-fx-ornament)\n.zee-line::after,\n.zee-about-card:not(.m7-fx-ornament)\n.zee-center-symbol{\n  animation:none!important;\n  -webkit-animation:none!important;\n}\n\n/* Breathing outer panel glow */\n.zee-about-card.m7-fx-panel-glow{\n  animation:\n    m7AboutPanelGlow\n    var(--m7-page-animation-speed,3.2s)\n    ease-in-out\n    infinite!important;\n  -webkit-animation:\n    m7AboutPanelGlow\n    var(--m7-page-animation-speed,3.2s)\n    ease-in-out\n    infinite!important;\n  animation-play-state:running!important;\n  -webkit-animation-play-state:running!important;\n  will-change:box-shadow;\n}\n\n@keyframes m7AboutPanelGlow{\n  0%,100%{\n    box-shadow:\n      0 18px 44px rgba(0,0,0,.34),\n      inset 0 1px 0 rgba(255,255,255,.035),\n      0 0 var(--m7-page-glow-near,18px) rgba(var(--m7-about-accent-rgb),.10);\n  }\n  50%{\n    box-shadow:\n      0 18px 44px rgba(0,0,0,.34),\n      inset 0 1px 0 rgba(255,255,255,.045),\n      0 0 var(--m7-page-glow-near,18px) rgba(var(--m7-about-accent-rgb),.32),\n      0 0 var(--m7-page-glow-far,38px) rgba(var(--m7-about-accent-rgb),.16);\n  }\n}\n\n@-webkit-keyframes m7AboutPanelGlow{\n  0%,100%{\n    box-shadow:\n      0 18px 44px rgba(0,0,0,.34),\n      inset 0 1px 0 rgba(255,255,255,.035),\n      0 0 var(--m7-page-glow-near,18px) rgba(var(--m7-about-accent-rgb),.10);\n  }\n  50%{\n    box-shadow:\n      0 18px 44px rgba(0,0,0,.34),\n      inset 0 1px 0 rgba(255,255,255,.045),\n      0 0 var(--m7-page-glow-near,18px) rgba(var(--m7-about-accent-rgb),.32),\n      0 0 var(--m7-page-glow-far,38px) rgba(var(--m7-about-accent-rgb),.16);\n  }\n}\n\n/* Bottom service icon pulse */\n.zee-about-card.m7-fx-icons\n.zee-service-icon{\n  animation:\n    m7AboutIconPulse\n    var(--m7-page-animation-speed,2.2s)\n    ease-in-out\n    infinite!important;\n  -webkit-animation:\n    m7AboutIconPulse\n    var(--m7-page-animation-speed,2.2s)\n    ease-in-out\n    infinite!important;\n  animation-play-state:running!important;\n  -webkit-animation-play-state:running!important;\n  will-change:transform,box-shadow;\n  -webkit-backface-visibility:hidden;\n  backface-visibility:hidden;\n}\n\n.zee-about-card.m7-fx-icons\n.zee-service-pill:nth-child(2)\n.zee-service-icon{\n  animation-delay:.18s!important;\n}\n\n.zee-about-card.m7-fx-icons\n.zee-service-pill:nth-child(3)\n.zee-service-icon{\n  animation-delay:.36s!important;\n}\n\n.zee-about-card.m7-fx-icons\n.zee-service-pill:nth-child(4)\n.zee-service-icon{\n  animation-delay:.54s!important;\n}\n\n@keyframes m7AboutIconPulse{\n  0%,100%{\n    transform:scale(1);\n    box-shadow:\n      0 0 8px rgba(var(--m7-about-accent-rgb),.12);\n  }\n  50%{\n    transform:scale(var(--m7-page-scale-max,1.10));\n    box-shadow:\n      0 0 var(--m7-page-glow-near,10px) rgba(var(--m7-about-accent-rgb),.36),\n      0 0 var(--m7-page-glow-far,20px) rgba(var(--m7-about-accent-rgb),.16);\n  }\n}\n\n@-webkit-keyframes m7AboutIconPulse{\n  0%,100%{\n    -webkit-transform:scale(1);\n    box-shadow:\n      0 0 8px rgba(var(--m7-about-accent-rgb),.12);\n  }\n  50%{\n    -webkit-transform:scale(var(--m7-page-scale-max,1.10));\n    box-shadow:\n      0 0 var(--m7-page-glow-near,10px) rgba(var(--m7-about-accent-rgb),.36),\n      0 0 var(--m7-page-glow-far,20px) rgba(var(--m7-about-accent-rgb),.16);\n  }\n}\n\n/* Editable signature shimmer */\n.zee-about-card.m7-fx-signature\n.zee-signature-text{\n  display:inline-block;\n  background:\n    linear-gradient(\n      105deg,\n      var(--m7-about-accent-light) 0%,\n      var(--m7-about-accent-light) 30%,\n      rgba(255,255,255,var(--m7-page-shimmer-alpha,.88)) 46%,\n      #fff 51%,\n      rgba(255,255,255,var(--m7-page-shimmer-alpha,.88)) 56%,\n      var(--m7-about-accent-light) 70%,\n      var(--m7-about-accent-light) 100%\n    );\n  background-size:320% 100%;\n  background-position:145% 50%;\n  background-repeat:no-repeat;\n  -webkit-background-clip:text;\n  background-clip:text;\n  color:transparent!important;\n  -webkit-text-fill-color:transparent!important;\n  animation:\n    m7AboutSignatureShimmer\n    var(--m7-page-animation-speed,3.6s)\n    linear\n    infinite!important;\n  -webkit-animation:\n    m7AboutSignatureShimmer\n    var(--m7-page-animation-speed,3.6s)\n    linear\n    infinite!important;\n  animation-play-state:running!important;\n  -webkit-animation-play-state:running!important;\n  will-change:background-position,filter;\n  -webkit-backface-visibility:hidden;\n  backface-visibility:hidden;\n}\n\n@keyframes m7AboutSignatureShimmer{\n  from{background-position:145% 50%;}\n  to{background-position:-145% 50%;}\n}\n\n@-webkit-keyframes m7AboutSignatureShimmer{\n  from{background-position:145% 50%;}\n  to{background-position:-145% 50%;}\n}\n\n@media(max-width:600px){\n  .ma7alak-about-floating-sparkles span{\n    filter:\n      drop-shadow(0 0 4px rgba(var(--m7-about-accent-rgb),.62));\n  }\n}\n\n</style>\n<div class=\"ma7alak-social-section\" id=\"ma7alak-social-section\">\n\n  <div class=\"ma7alak-social-heading\">\n    <div class=\"ma7alak-social-line\"></div>\n\n    <div class=\"ma7alak-social-heading-text\">\n      <div class=\"ma7alak-social-title\">Connect with us</div>\n      <div class=\"ma7alak-social-subtitle\">Follow us & get in touch</div>\n    </div>\n\n    <div class=\"ma7alak-social-line\"></div>\n  </div>\n\n  <div class=\"ma7alak-social-links\" id=\"ma7alak-social-links\">\n    <div class=\"ma7alak-social-empty\">Loading…</div>\n  </div>\n\n</div>\n\n<style>\n\n\n/* =========================================================\n   SHOUFHON SOCIAL SECTION\n========================================================= */\n\n.ma7alak-social-section {\n\n  width: 100%;\n  max-width: 680px;\n\n  margin: 28px auto;\n\n  padding: 22px 24px 25px;\n\n  box-sizing: border-box;\n\n  border-radius: 22px;\n\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255,255,255,0.065),\n      rgba(255,255,255,0.018)\n    );\n\n  border: 1px solid rgba(255,255,255,0.10);\n\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n\n  box-shadow:\n    0 15px 40px rgba(0,0,0,0.22);\n\n}\n\n\n/* =========================================================\n   HEADING\n========================================================= */\n\n.ma7alak-social-heading {\n\n  position: relative;\n\n  display: flex;\n\n  align-items: center;\n\n  justify-content: center;\n\n  gap: 15px;\n\n  margin-bottom: 30px;\n\n}\n\n\n.ma7alak-social-heading-text {\n\n  text-align: center;\n\n}\n\n\n.ma7alak-social-title {\n\n  color: #f5b544;\n\n  font-size: 17px;\n\n  line-height: 1.2;\n\n  font-weight: 800;\n\n  letter-spacing: .4px;\n\n  text-shadow:\n    0 2px 9px rgba(0,0,0,.5);\n\n}\n\n\n.ma7alak-social-subtitle {\n\n  margin-top: 6px;\n\n  color: rgba(255,255,255,.58);\n\n  font-size: 12px;\n\n  line-height: 1.2;\n\n  font-weight: 500;\n\n  letter-spacing: .15px;\n\n}\n\n\n.ma7alak-social-line {\n\n  width: 50px;\n\n  height: 1px;\n\n  flex-shrink: 0;\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(245,181,68,.60)\n    );\n\n}\n\n\n.ma7alak-social-line:last-child {\n\n  background:\n    linear-gradient(\n      90deg,\n      rgba(245,181,68,.60),\n      transparent\n    );\n\n}\n\n\n/* =========================================================\n   SOCIAL LINKS\n========================================================= */\n\n.ma7alak-social-links {\n\n  display: flex;\n\n  align-items: flex-start;\n\n  justify-content: center;\n\n  gap: 42px;\n\n  width: 100%;\n\n}\n\n\n/* =========================================================\n   CLICKABLE ITEM\n========================================================= */\n\n.ma7alak-social-item {\n\n  display: flex;\n\n  flex-direction: column;\n\n  align-items: center;\n\n  justify-content: flex-start;\n\n  width: 92px;\n\n  min-height: 90px;\n\n  text-decoration: none;\n\n  cursor: pointer;\n\n  background: transparent;\n\n  border: none;\n\n  transition:\n    transform .25s ease;\n\n}\n\n\n/* =========================================================\n   ICON\n========================================================= */\n\n.ma7alak-social-icon {\n\n  width: 46px;\n\n  height: 46px;\n\n  display: flex;\n\n  align-items: center;\n\n  justify-content: center;\n\n}\n\n\n.ma7alak-social-icon svg {\n\n  width: 40px;\n\n  height: 40px;\n\n  display: block;\n\n}\n\n\n/* =========================================================\n   LABEL\n========================================================= */\n\n.ma7alak-social-label {\n\n  margin-top: 9px;\n\n  font-family:\n    Inter,\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    Arial,\n    sans-serif;\n\n  color: rgba(255,255,255,.78);\n\n  font-size: 13px;\n\n  line-height: 1.2;\n\n  font-weight: 650;\n\n  letter-spacing: .1px;\n\n  white-space: nowrap;\n\n  text-align: center;\n\n  text-shadow:\n    0 2px 7px rgba(0,0,0,.55);\n\n  transition:\n    color .25s ease,\n    transform .25s ease;\n\n}\n\n\n/* =========================================================\n   TIKTOK\n========================================================= */\n\n.ma7alak-tiktok .ma7alak-social-icon svg {\n\n  overflow: visible;\n\n  filter:\n    drop-shadow(-2px 0 #25F4EE)\n    drop-shadow(2px 0 #FE2C55);\n\n}\n\n\n.ma7alak-tiktok .tiktok-main {\n\n  fill: #050505;\n\n  stroke: #050505;\n\n  stroke-width: .35;\n\n}\n\n\n/* =========================================================\n   INSTAGRAM\n========================================================= */\n\n.ma7alak-instagram .ma7alak-social-icon svg {\n\n  overflow: visible;\n\n  filter:\n    drop-shadow(\n      0 4px 10px rgba(214,41,118,.28)\n    );\n\n}\n\n\n/* =========================================================\n   FACEBOOK\n========================================================= */\n\n.ma7alak-facebook .ma7alak-social-icon svg {\n\n  filter:\n    drop-shadow(\n      0 4px 10px rgba(24,119,242,.30)\n    );\n\n}\n\n\n/* =========================================================\n   WHATSAPP\n========================================================= */\n\n.ma7alak-whatsapp .ma7alak-social-icon svg {\n\n  filter:\n    drop-shadow(\n      0 4px 10px rgba(37,211,102,.30)\n    );\n\n}\n\n\n/* =========================================================\n   HOVER\n========================================================= */\n\n.ma7alak-social-item:hover {\n\n  transform:\n    translateY(-5px)\n    scale(1.07);\n\n}\n\n\n.ma7alak-social-item:hover .ma7alak-social-label {\n\n  color: #ffffff;\n\n  transform: translateY(-1px);\n\n}\n\n\n/* =========================================================\n   MOBILE\n========================================================= */\n\n@media (max-width: 600px) {\n\n  .ma7alak-social-section {\n\n    width: calc(100% - 20px);\n\n    margin: 20px 10px;\n\n    padding:\n      20px 10px\n      23px;\n\n    border-radius: 19px;\n\n  }\n\n\n  .ma7alak-social-heading {\n\n    gap: 9px;\n\n    margin-bottom: 28px;\n\n  }\n\n\n  .ma7alak-social-title {\n\n    font-size: 16px;\n\n  }\n\n\n  .ma7alak-social-subtitle {\n\n    margin-top: 6px;\n\n    font-size: 11px;\n\n  }\n\n\n  .ma7alak-social-line {\n\n    width: 27px;\n\n  }\n\n\n  .ma7alak-social-links {\n\n    gap: 0;\n\n    justify-content: space-between;\n\n  }\n\n\n  .ma7alak-social-item {\n\n    width: 72px;\n\n    min-height: 84px;\n\n  }\n\n\n  .ma7alak-social-icon {\n\n    width: 43px;\n\n    height: 43px;\n\n  }\n\n\n  .ma7alak-social-icon svg {\n\n    width: 37px;\n\n    height: 37px;\n\n  }\n\n\n  .ma7alak-social-label {\n\n    margin-top: 9px;\n\n    font-size: 12px;\n\n    font-weight: 650;\n\n  }\n\n}\n\n\n/* =========================================================\n   SMALL PHONES\n========================================================= */\n\n@media (max-width: 390px) {\n\n  .ma7alak-social-section {\n\n    padding-left: 7px;\n\n    padding-right: 7px;\n\n  }\n\n\n  .ma7alak-social-links {\n\n    gap: 0;\n\n  }\n\n\n  .ma7alak-social-item {\n\n    width: 70px;\n\n  }\n\n\n  .ma7alak-social-icon svg {\n\n    width: 35px;\n\n    height: 35px;\n\n  }\n\n\n  .ma7alak-social-label {\n\n    font-size: 11px;\n\n  }\n\n\n  .ma7alak-social-line {\n\n    width: 22px;\n\n  }\n\n}\n\n\n/* =========================================================\n   TOUCH DEVICES\n========================================================= */\n\n@media (hover: none) {\n\n  .ma7alak-social-item:active {\n\n    transform:\n      scale(.94);\n\n  }\n\n}\n\n\n/* =========================================================\n   REDUCED MOTION\n========================================================= */\n\n@media (prefers-reduced-motion: reduce) {\n\n  .ma7alak-social-item {\n\n    transition: none;\n\n  }\n\n  .ma7alak-social-label {\n\n    transition: none;\n\n  }\n\n}\n\n\n\n:root{\n  --m7-shop-accent:#d9a441;\n  --m7-shop-accent-rgb:217,164,65;\n  --m7-shop-accent-light:#f2d99f;\n  --m7-shop-accent-soft:#e2b85f;\n  --m7-shop-accent-dark:#8b6829;\n}\n\n/* Panel follows the Admin Story/card color. Social icon artwork is untouched. */\n.ma7alak-social-section{\n  position:relative!important;\n  overflow:hidden!important;\n  border-color:rgba(var(--m7-shop-accent-rgb),.30)!important;\n  background:\n    radial-gradient(circle at 15% 0%,rgba(var(--m7-shop-accent-rgb),.12),transparent 34%),\n    radial-gradient(circle at 92% 100%,rgba(var(--m7-shop-accent-rgb),.07),transparent 38%),\n    linear-gradient(145deg,rgba(25,22,20,.95),rgba(11,10,10,.98))!important;\n  box-shadow:\n    0 15px 40px rgba(0,0,0,.28),\n    0 0 22px rgba(var(--m7-shop-accent-rgb),.08),\n    inset 0 1px 0 rgba(255,255,255,.045)!important;\n}\n\n.ma7alak-social-title{\n  color:var(--m7-shop-accent-light)!important;\n  text-shadow:\n    0 0 8px rgba(var(--m7-shop-accent-rgb),.28),\n    0 2px 9px rgba(0,0,0,.55)!important;\n}\n\n.ma7alak-social-subtitle,\n.ma7alak-social-label{\n  color:rgba(var(--m7-shop-accent-rgb),.82)!important;\n}\n\n.ma7alak-social-line{\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(var(--m7-shop-accent-rgb),.74)\n    )!important;\n  box-shadow:0 0 7px rgba(var(--m7-shop-accent-rgb),.20)!important;\n}\n\n.ma7alak-social-line:last-child{\n  background:\n    linear-gradient(\n      90deg,\n      rgba(var(--m7-shop-accent-rgb),.74),\n      transparent\n    )!important;\n}\n\n/*\n  SMART SOCIAL LAYOUT\n  1 icon  = centered\n  2 icons = compact centered pair\n  3 icons = compact centered row\n  4 icons = all four fit cleanly\n*/\n.ma7alak-social-links{\n  display:grid!important;\n  grid-auto-flow:column!important;\n  grid-auto-columns:minmax(64px,78px)!important;\n  justify-content:center!important;\n  justify-items:center!important;\n  align-items:start!important;\n  gap:clamp(9px,3.2vw,22px)!important;\n  width:max-content!important;\n  max-width:100%!important;\n  margin:0 auto!important;\n}\n\n.ma7alak-social-item{\n  width:72px!important;\n  min-width:64px!important;\n}\n\n.ma7alak-social-empty{\n  width:100%;\n  text-align:center;\n  color:rgba(255,255,255,.48);\n  font-size:12px;\n}\n\n/* Keep the original branded icon design/colors exactly as-is. */\n.ma7alak-tiktok .ma7alak-social-icon svg,\n.ma7alak-instagram .ma7alak-social-icon svg,\n.ma7alak-facebook .ma7alak-social-icon svg,\n.ma7alak-whatsapp .ma7alak-social-icon svg{\n  opacity:1!important;\n}\n\n@media(max-width:600px){\n  .ma7alak-social-links{\n    grid-auto-columns:minmax(60px,72px)!important;\n    gap:clamp(5px,2.6vw,14px)!important;\n  }\n\n  .ma7alak-social-item{\n    width:68px!important;\n    min-width:60px!important;\n  }\n}\n\n</style>\n<div class=\"ma7alak-location-section\">\n\n  <!-- PERFECTLY CENTERED HEADER -->\n  <div class=\"ma7alak-location-header\">\n    <div class=\"ma7alak-location-title\">\n      <span class=\"ma7alak-location-title-icon\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <path d=\"M12 2C7.58 2 4 5.58 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.42-3.58-8-8-8z\" fill=\"#ff73b9\"/>\n          <circle cx=\"12\" cy=\"10\" r=\"3\" fill=\"#fff\"/>\n        </svg>\n      </span>\n      <span>Location</span>\n    </div>\n  </div>\n\n  <!-- LOCATION + HOURS -->\n  <div class=\"ma7alak-location-info\">\n\n    <!-- LOCATION BOX -->\n    <div class=\"ma7alak-info-row\">\n      <div class=\"ma7alak-info-content\">\n        <div class=\"ma7alak-info-label\">LOCATION</div>\n        <div class=\"ma7alak-info-text\" id=\"ma7alak-location-value\">Loading…</div>\n      </div>\n\n      <div class=\"ma7alak-info-icon ma7alak-location-icon\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <path d=\"M12 2C7.58 2 4 5.58 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.42-3.58-8-8-8z\" fill=\"#ff73b9\"/>\n          <circle cx=\"12\" cy=\"10\" r=\"3\" fill=\"#fff\"/>\n        </svg>\n      </div>\n    </div>\n\n    <!-- OPENING HOURS BOX -->\n    <div class=\"ma7alak-info-row\">\n      <div class=\"ma7alak-info-content\">\n        <div class=\"ma7alak-info-label\">AVAILABILITY</div>\n\n        <div class=\"ma7alak-hours-list\">\n          <div class=\"ma7alak-hours-text ma7alak-hours-primary\">\n            <span id=\"ma7alak-availability-days\">Loading…</span>\n            <strong id=\"ma7alak-availability-time\"></strong>\n          </div>\n          <div id=\"ma7alak-availability-extra\" class=\"ma7alak-availability-extra\"></div>\n        </div>\n      </div>\n\n      <div class=\"ma7alak-info-icon ma7alak-clock-icon\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#ff73b9\" stroke-width=\"2\"/>\n          <path d=\"M12 7v5l3.5 2\" fill=\"none\" stroke=\"#ff73b9\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </div>\n    </div>\n\n  </div>\n</div>\n\n<style>\n/* =========================================================\n   ZEE PREMIUM LOCATION — PHONE FIRST\n   Rose / pink / purple palette matching Premium About Zee\n========================================================= */\n\n.ma7alak-location-section{\n  width:calc(100% - 20px);\n  max-width:680px;\n  margin:20px 10px;\n  padding:20px 10px 14px;\n  box-sizing:border-box;\n  position:relative;\n  overflow:hidden;\n\n  border-radius:22px;\n  border:1px solid rgba(255,112,184,.32);\n\n  background:\n    radial-gradient(circle at 15% 0%,rgba(255,99,177,.11),transparent 34%),\n    radial-gradient(circle at 92% 100%,rgba(165,91,255,.10),transparent 38%),\n    linear-gradient(145deg,rgba(29,20,29,.92),rgba(13,11,16,.96));\n\n  box-shadow:\n    0 16px 40px rgba(0,0,0,.30),\n    0 0 24px rgba(255,93,170,.07),\n    inset 0 1px 0 rgba(255,255,255,.05);\n\n  backdrop-filter:blur(15px);\n  -webkit-backdrop-filter:blur(15px);\n\n  font-family:Arial,\"Segoe UI\",sans-serif;\n}\n\n/* soft premium moving blush light */\n.ma7alak-location-section::before{\n  content:\"\";\n  position:absolute;\n  width:150px;\n  height:150px;\n  left:-90px;\n  top:-80px;\n  border-radius:50%;\n  background:rgba(255,92,171,.14);\n  filter:blur(42px);\n  pointer-events:none;\n  animation:zeeLocationAura 5s ease-in-out infinite alternate;\n}\n\n@keyframes zeeLocationAura{\n  from{transform:translate(0,0) scale(.9);opacity:.45;}\n  to{transform:translate(190px,50px) scale(1.12);opacity:.85;}\n}\n\n/* =========================================================\n   HEADER — ACTUALLY CENTERED\n========================================================= */\n\n.ma7alak-location-header{\n  width:100%;\n  display:grid;\n  grid-template-columns:1fr auto 1fr;\n  align-items:center;\n  margin:0 0 18px;\n  position:relative;\n  z-index:2;\n}\n\n.ma7alak-location-header::before,\n.ma7alak-location-header::after{\n  content:\"\";\n  height:1px;\n  width:100%;\n  max-width:72px;\n  justify-self:center;\n  background:linear-gradient(\n    90deg,\n    transparent,\n    rgba(255,116,184,.78),\n    rgba(207,142,255,.70)\n  );\n  box-shadow:0 0 8px rgba(255,105,177,.25);\n}\n\n.ma7alak-location-header::after{\n  transform:scaleX(-1);\n}\n\n.ma7alak-location-title{\n  grid-column:2;\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  gap:8px;\n  margin:0;\n  padding:0 10px;\n\n  color:#ff9dce;\n  font-family:Georgia,\"Times New Roman\",serif;\n  font-size:21px;\n  font-weight:800;\n  line-height:1;\n  white-space:nowrap;\n\n  text-shadow:\n    0 0 8px rgba(255,105,178,.42),\n    0 0 18px rgba(194,103,255,.16),\n    0 2px 8px rgba(0,0,0,.65);\n}\n\n.ma7alak-location-title-icon{\n  width:20px;\n  height:20px;\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  flex:0 0 20px;\n}\n\n.ma7alak-location-title-icon svg{\n  width:19px;\n  height:19px;\n  display:block;\n  filter:\n    drop-shadow(0 0 5px rgba(255,103,177,.58))\n    drop-shadow(0 0 10px rgba(194,103,255,.18));\n}\n\n/* =========================================================\n   BOXES\n========================================================= */\n\n.ma7alak-location-info{\n  position:relative;\n  z-index:2;\n  display:flex;\n  flex-direction:column;\n  gap:10px;\n  margin:0;\n}\n\n.ma7alak-info-row{\n  position:relative;\n  width:100%;\n  min-height:78px;\n\n  display:flex;\n  align-items:center;\n  justify-content:center;\n\n  padding:13px 48px;\n  box-sizing:border-box;\n  overflow:hidden;\n\n  border-radius:15px;\n  border:1px solid rgba(255,124,187,.16);\n\n  background:\n    linear-gradient(135deg,rgba(255,108,179,.055),rgba(183,102,255,.025)),\n    rgba(255,255,255,.022);\n\n  box-shadow:\n    inset 0 1px 0 rgba(255,255,255,.035),\n    0 8px 22px rgba(0,0,0,.16);\n}\n\n/* tiny feminine shimmer through each box */\n.ma7alak-info-row::before{\n  content:\"\";\n  position:absolute;\n  top:0;\n  bottom:0;\n  left:-45%;\n  width:32%;\n  pointer-events:none;\n  transform:skewX(-20deg);\n  background:linear-gradient(\n    90deg,\n    transparent,\n    rgba(255,179,217,.055),\n    rgba(255,255,255,.08),\n    transparent\n  );\n  animation:zeeBoxShimmer 4.5s ease-in-out infinite;\n}\n\n.ma7alak-info-row:nth-child(2)::before{\n  animation-delay:1.1s;\n}\n\n@keyframes zeeBoxShimmer{\n  0%,55%{left:-45%;opacity:0;}\n  65%{opacity:1;}\n  88%{left:115%;opacity:.8;}\n  100%{left:115%;opacity:0;}\n}\n\n.ma7alak-info-content{\n  width:100%;\n  margin:0 auto;\n  text-align:center;\n  position:relative;\n  z-index:2;\n}\n\n/* =========================================================\n   TEXT — PREMIUM ABOUT ZEE COLORS\n========================================================= */\n\n.ma7alak-info-label{\n  margin:0 0 6px;\n\n  /* pink/purple instead of orange */\n  color:#f08bc5;\n\n  font-size:10px;\n  font-weight:900;\n  line-height:1;\n  letter-spacing:1px;\n  text-transform:uppercase;\n  text-align:center;\n\n  text-shadow:\n    0 0 7px rgba(240,139,197,.42),\n    0 0 14px rgba(181,103,255,.16);\n}\n\n.ma7alak-info-text{\n  color:#ffd1e7;\n  font-size:14px;\n  font-weight:800;\n  line-height:1.45;\n  text-align:center;\n\n  text-shadow:\n    0 0 7px rgba(255,113,181,.30),\n    0 2px 8px rgba(0,0,0,.72);\n}\n\n.ma7alak-hours-text{\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  gap:7px;\n  flex-wrap:wrap;\n\n  font-size:13px;\n  line-height:1.45;\n  text-align:center;\n}\n\n.ma7alak-hours-text span{\n  color:#e8a7ca;\n  font-weight:700;\n  text-shadow:\n    0 0 6px rgba(232,167,202,.18),\n    0 2px 7px rgba(0,0,0,.65);\n}\n\n.ma7alak-hours-text strong{\n  color:#ffd2e8;\n  font-size:13px;\n  font-weight:900;\n\n  text-shadow:\n    0 0 7px rgba(255,105,179,.38),\n    0 0 15px rgba(193,102,255,.16),\n    0 2px 8px rgba(0,0,0,.72);\n}\n\n.ma7alak-hours-list{\n  display:grid;\n  gap:6px;\n  width:100%;\n}\n\n.ma7alak-hours-primary:empty{\n  display:none;\n}\n\n.ma7alak-availability-extra{\n  display:grid;\n  gap:5px;\n  width:100%;\n}\n\n.ma7alak-availability-extra:empty{\n  display:none;\n}\n\n.ma7alak-availability-line{\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  gap:7px;\n  flex-wrap:wrap;\n  padding-top:5px;\n  border-top:1px solid rgba(var(--m7-shop-accent-rgb),.10);\n  font-size:12px;\n  line-height:1.45;\n  text-align:center;\n}\n\n.ma7alak-availability-line span{\n  color:#e8a7ca;\n  font-weight:700;\n  text-shadow:\n    0 0 6px rgba(232,167,202,.18),\n    0 2px 7px rgba(0,0,0,.65);\n}\n\n.ma7alak-availability-line strong{\n  color:#ffd2e8;\n  font-size:12px;\n  font-weight:900;\n  text-shadow:\n    0 0 7px rgba(255,105,179,.30),\n    0 2px 8px rgba(0,0,0,.72);\n}\n\n/* =========================================================\n   ICONS — PINK / PURPLE, NO ORANGE\n========================================================= */\n\n.ma7alak-info-icon{\n  position:absolute;\n  right:13px;\n  top:50%;\n  transform:translateY(-50%);\n\n  width:32px;\n  height:32px;\n\n  display:flex;\n  align-items:center;\n  justify-content:center;\n\n  border-radius:50%;\n  box-sizing:border-box;\n  z-index:3;\n\n  border:1px solid rgba(255,119,184,.20);\n  background:\n    radial-gradient(circle at 35% 25%,rgba(255,188,220,.15),rgba(255,105,177,.06) 52%,rgba(142,72,190,.05));\n\n  box-shadow:\n    0 0 10px rgba(255,98,174,.12),\n    inset 0 1px 0 rgba(255,255,255,.05);\n}\n\n.ma7alak-info-icon svg{\n  width:20px;\n  height:20px;\n  display:block;\n}\n\n.ma7alak-location-icon{\n  animation:zeePinGlow 2.5s ease-in-out infinite;\n}\n\n.ma7alak-clock-icon{\n  animation:zeeClockGlow 2.8s ease-in-out infinite;\n}\n\n@keyframes zeePinGlow{\n  0%,100%{\n    box-shadow:0 0 8px rgba(255,95,172,.10);\n  }\n  50%{\n    box-shadow:\n      0 0 11px rgba(255,95,172,.30),\n      0 0 20px rgba(184,101,255,.12);\n  }\n}\n\n@keyframes zeeClockGlow{\n  0%,100%{\n    box-shadow:0 0 8px rgba(255,95,172,.10);\n  }\n  50%{\n    box-shadow:\n      0 0 11px rgba(255,95,172,.26),\n      0 0 20px rgba(184,101,255,.10);\n  }\n}\n\n/* =========================================================\n   VERY SMALL PHONES\n========================================================= */\n\n@media(max-width:390px){\n  .ma7alak-location-section{\n    width:calc(100% - 14px);\n    margin:18px 7px;\n    padding:18px 7px 12px;\n  }\n\n  .ma7alak-location-header{\n    margin-bottom:16px;\n  }\n\n  .ma7alak-location-header::before,\n  .ma7alak-location-header::after{\n    max-width:45px;\n  }\n\n  .ma7alak-location-title{\n    font-size:20px;\n    padding:0 7px;\n  }\n\n  .ma7alak-info-row{\n    min-height:76px;\n    padding-left:38px;\n    padding-right:38px;\n  }\n\n  .ma7alak-info-icon{\n    right:9px;\n    width:29px;\n    height:29px;\n  }\n\n  .ma7alak-info-icon svg{\n    width:18px;\n    height:18px;\n  }\n\n  .ma7alak-info-text,\n  .ma7alak-hours-text,\n  .ma7alak-hours-text strong{\n    font-size:12px;\n  }\n}\n\n/* =========================================================\n   WHAT CHANGED\n   =========================================================\n   1. Removed the old orange/gold text palette.\n   2. Location/Availability labels now use Zee premium rose-pink.\n   3. Beirut/Flexible Time now use soft blush-pink.\n   4. Clock changed from orange/gold to pink.\n   5. Location pin changed to pink.\n   6. Box borders/glows now use pink + subtle purple.\n   7. Added soft feminine shimmer animation to both boxes.\n   8. Kept the Location title mathematically centered.\n   9. Kept Google Maps completely removed.\n   10. Phone-first layout preserved.\n========================================================= */\n</style>\n\n\n<style>\n:root{\n  --m7-shop-accent:#d9a441;\n  --m7-shop-accent-rgb:217,164,65;\n  --m7-shop-accent-light:#f2d99f;\n  --m7-shop-accent-soft:#e2b85f;\n  --m7-shop-accent-dark:#8b6829;\n}\n\n/* Same panel design, but now it follows the shop Story/card color. */\n.ma7alak-location-section{\n  border-color:rgba(var(--m7-shop-accent-rgb),.32)!important;\n  background:\n    radial-gradient(circle at 15% 0%,rgba(var(--m7-shop-accent-rgb),.12),transparent 34%),\n    radial-gradient(circle at 92% 100%,rgba(var(--m7-shop-accent-rgb),.07),transparent 38%),\n    linear-gradient(145deg,rgba(25,22,20,.94),rgba(11,10,10,.97))!important;\n  box-shadow:\n    0 16px 40px rgba(0,0,0,.30),\n    0 0 24px rgba(var(--m7-shop-accent-rgb),.08),\n    inset 0 1px 0 rgba(255,255,255,.05)!important;\n}\n\n.ma7alak-location-section::before{\n  background:rgba(var(--m7-shop-accent-rgb),.14)!important;\n}\n\n.ma7alak-location-title,\n.ma7alak-info-text,\n.ma7alak-hours-text strong{\n  color:var(--m7-shop-accent-light)!important;\n}\n\n.ma7alak-info-label,\n.ma7alak-hours-text span{\n  color:rgba(var(--m7-shop-accent-rgb),.86)!important;\n}\n\n.ma7alak-location-header::before,\n.ma7alak-location-header::after{\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(var(--m7-shop-accent-rgb),.78),\n      rgba(var(--m7-shop-accent-rgb),.42)\n    )!important;\n}\n\n.ma7alak-info-row{\n  border-color:rgba(var(--m7-shop-accent-rgb),.17)!important;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(var(--m7-shop-accent-rgb),.06),\n      rgba(var(--m7-shop-accent-rgb),.02)\n    ),\n    rgba(255,255,255,.022)!important;\n}\n\n.ma7alak-info-icon{\n  border-color:rgba(var(--m7-shop-accent-rgb),.22)!important;\n  background:\n    radial-gradient(\n      circle at 35% 25%,\n      rgba(var(--m7-shop-accent-rgb),.18),\n      rgba(var(--m7-shop-accent-rgb),.06) 52%,\n      rgba(0,0,0,.04)\n    )!important;\n}\n\n.ma7alak-location-title-icon path:first-child,\n.ma7alak-location-icon path:first-child{\n  fill:var(--m7-shop-accent)!important;\n}\n\n.ma7alak-clock-icon circle,\n.ma7alak-clock-icon path{\n  stroke:var(--m7-shop-accent)!important;\n}\n</style>\n<div id=\"ma7alak-exact-map-section\" hidden>\n\n  <div class=\"ma7alak-exact-map-heading\">\n    <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <path\n        d=\"M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Z\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"1.7\"\n        stroke-linecap=\"round\"\n        stroke-linejoin=\"round\"\n      />\n      <path\n        d=\"M9 4v13M15 7v13\"\n        fill=\"none\"\n        stroke=\"currentColor\"\n        stroke-width=\"1.7\"\n      />\n    </svg>\n    <span>Find us</span>\n  </div>\n\n  <div class=\"ma7alak-exact-map-frame\">\n    <iframe\n      id=\"ma7alak-exact-map\"\n      title=\"Shop location map\"\n      loading=\"lazy\"\n      referrerpolicy=\"no-referrer-when-downgrade\"\n      allowfullscreen\n    ></iframe>\n  </div>\n\n</div>\n\n<div class=\"ma7alak-realtime-stats\">\n\n    <div class=\"ma7alak-stats-panel\">\n\n        <div class=\"ma7alak-stat\" id=\"ma7alak-online-card\">\n            <span class=\"ma7alak-icon ma7alak-eye-icon\" id=\"ma7alak-online-eye\">👁️</span>\n            <div class=\"ma7alak-stat-copy\">\n                <strong id=\"ma7alak-online\">0</strong>\n                <span>Viewing now</span>\n            </div>\n        </div>\n\n        <div class=\"ma7alak-stat\">\n            <span class=\"ma7alak-icon\">👥</span>\n            <div class=\"ma7alak-stat-copy\">\n                <strong id=\"ma7alak-week\">0</strong>\n                <span>Views this week</span>\n            </div>\n        </div>\n\n        <div class=\"ma7alak-stat\">\n            <span class=\"ma7alak-icon\">🔥</span>\n            <div class=\"ma7alak-stat-copy\">\n                <strong id=\"ma7alak-today\">0</strong>\n                <span>Visitors today</span>\n            </div>\n        </div>\n\n        <div class=\"ma7alak-stat\">\n            <span class=\"ma7alak-icon\">👀</span>\n            <div class=\"ma7alak-stat-copy\">\n                <strong id=\"ma7alak-total\">0</strong>\n                <span>Total views</span>\n            </div>\n        </div>\n\n    </div>\n\n</div>\n\n<style>\n.ma7alak-realtime-stats {\n    width: min(100%, 420px);\n    margin: 16px auto;\n    padding: 0 6px;\n    font-family: Arial, sans-serif;\n    box-sizing: border-box;\n}\n\n.ma7alak-stats-panel {\n    position: relative;\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0;\n    overflow: hidden;\n\n    border-radius: 20px;\n    border: 1px solid rgba(242, 198, 209, 0.34);\n\n    background:\n        radial-gradient(\n            circle at 50% 0%,\n            rgba(201, 126, 148, 0.12),\n            transparent 50%\n        ),\n        linear-gradient(\n            145deg,\n            rgba(40, 25, 32, 0.97),\n            rgba(11, 8, 10, 0.98)\n        );\n\n    box-shadow:\n        0 12px 28px rgba(0, 0, 0, 0.34),\n        0 0 18px rgba(213, 141, 163, 0.08),\n        0 0 14px rgba(215, 168, 68, 0.06);\n\n    backdrop-filter: blur(10px);\n    -webkit-backdrop-filter: blur(10px);\n}\n\n.ma7alak-stats-panel::before {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    left: 16%;\n    right: 16%;\n    height: 2px;\n    z-index: 3;\n\n    background:\n        linear-gradient(\n            90deg,\n            transparent,\n            #c8879a 28%,\n            #e3b85f 52%,\n            #c8879a 74%,\n            transparent\n        );\n\n    border-radius: 0 0 8px 8px;\n\n    box-shadow:\n        0 0 8px rgba(227, 184, 95, 0.18);\n}\n\n.ma7alak-stat {\n    position: relative;\n    min-width: 0;\n    display: flex;\n    align-items: center;\n    gap: 9px;\n    padding: 12px 11px;\n    box-sizing: border-box;\n}\n\n.ma7alak-stat:nth-child(1),\n.ma7alak-stat:nth-child(2) {\n    border-bottom: 1px solid rgba(242, 198, 209, 0.10);\n}\n\n.ma7alak-stat:nth-child(1),\n.ma7alak-stat:nth-child(3) {\n    border-right: 1px solid rgba(242, 198, 209, 0.10);\n}\n\n.ma7alak-icon {\n    flex: 0 0 auto;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    width: 34px;\n    height: 34px;\n\n    font-size: 19px;\n    line-height: 1;\n\n    border-radius: 11px;\n\n    background:\n        linear-gradient(\n            145deg,\n            rgba(238, 200, 210, 0.13),\n            rgba(177, 105, 128, 0.07)\n        );\n\n    border: 1px solid rgba(239, 201, 211, 0.14);\n\n    box-shadow:\n        0 5px 14px rgba(0, 0, 0, 0.18);\n\n    transform-origin: center;\n}\n\n.ma7alak-stat-copy {\n    min-width: 0;\n    flex: 1;\n    text-align: left;\n}\n\n.ma7alak-stat strong {\n    display: block;\n    margin: 0;\n\n    font-size: 20px;\n    font-weight: 800;\n    line-height: 1;\n\n    color: #f7d7df;\n\n    text-shadow:\n        0 0 10px rgba(202, 137, 155, 0.10);\n}\n\n.ma7alak-stat-copy span {\n    display: block;\n    margin-top: 5px;\n\n    font-size: 10px;\n    font-weight: 600;\n    line-height: 1.25;\n\n    color: rgba(244, 211, 220, 0.70);\n\n    letter-spacing: 0.1px;\n\n    white-space: normal;\n    overflow-wrap: break-word;\n    word-break: normal;\n}\n\n\n/* =========================================================\n   VIEWING NOW EYE ANIMATION\n   Starts only when 2 or more people are viewing.\n========================================================= */\n\n@keyframes ma7alakEyeLook {\n    0%,\n    100% {\n        transform: translateX(0) scale(1);\n    }\n\n    20% {\n        transform: translateX(-3px) scale(1.04);\n    }\n\n    40% {\n        transform: translateX(3px) scale(1.04);\n    }\n\n    60% {\n        transform: translateX(-2px) scale(1.02);\n    }\n\n    80% {\n        transform: translateX(2px) scale(1.02);\n    }\n}\n\n@keyframes ma7alakEyeGlow {\n    0%,\n    100% {\n        filter:\n            drop-shadow(0 0 0 rgba(217,164,65,0));\n    }\n\n    50% {\n        filter:\n            drop-shadow(0 0 8px rgba(227,184,95,0.58));\n    }\n}\n\n#ma7alak-online-eye.ma7alak-eye-active {\n    animation:\n        ma7alakEyeLook 1.8s ease-in-out infinite,\n        ma7alakEyeGlow 1.8s ease-in-out infinite;\n}\n\n\n/* Smaller phones */\n@media (max-width: 380px) {\n    .ma7alak-realtime-stats {\n        width: min(100%, 360px);\n        padding: 0 4px;\n    }\n\n    .ma7alak-stat {\n        gap: 7px;\n        padding: 10px 8px;\n    }\n\n    .ma7alak-icon {\n        width: 31px;\n        height: 31px;\n        font-size: 17px;\n        border-radius: 10px;\n    }\n\n    .ma7alak-stat strong {\n        font-size: 18px;\n    }\n\n    .ma7alak-stat-copy span {\n        font-size: 9px;\n        line-height: 1.2;\n    }\n}\n\n\n/* Desktop */\n@media (min-width: 700px) {\n    .ma7alak-realtime-stats {\n        width: min(100%, 560px);\n    }\n\n    .ma7alak-stats-panel {\n        grid-template-columns: repeat(4, minmax(0, 1fr));\n    }\n\n    .ma7alak-stat {\n        padding: 13px 12px;\n    }\n\n    .ma7alak-stat:nth-child(1),\n    .ma7alak-stat:nth-child(2) {\n        border-bottom: 0;\n    }\n\n    .ma7alak-stat:nth-child(1),\n    .ma7alak-stat:nth-child(2),\n    .ma7alak-stat:nth-child(3) {\n        border-right: 1px solid rgba(242, 198, 209, 0.10);\n    }\n\n    .ma7alak-stat:nth-child(4) {\n        border-right: 0;\n    }\n}\n</style>\n\n\n<style>\n:root{\n  --m7-shop-accent:#d9a441;\n  --m7-shop-accent-rgb:217,164,65;\n  --m7-shop-accent-light:#f2d99f;\n  --m7-shop-accent-soft:#e2b85f;\n  --m7-shop-accent-dark:#8b6829;\n}\n\n.ma7alak-stats-panel{\n  border-color:rgba(var(--m7-shop-accent-rgb),.34)!important;\n  background:\n    radial-gradient(\n      circle at 50% 0%,\n      rgba(var(--m7-shop-accent-rgb),.12),\n      transparent 50%\n    ),\n    linear-gradient(\n      145deg,\n      rgba(32,27,25,.97),\n      rgba(10,9,9,.98)\n    )!important;\n  box-shadow:\n    0 12px 28px rgba(0,0,0,.34),\n    0 0 18px rgba(var(--m7-shop-accent-rgb),.10)!important;\n}\n\n.ma7alak-stats-panel::before{\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(var(--m7-shop-accent-rgb),.64) 28%,\n      var(--m7-shop-accent-light) 52%,\n      rgba(var(--m7-shop-accent-rgb),.64) 74%,\n      transparent\n    )!important;\n  box-shadow:\n    0 0 8px rgba(var(--m7-shop-accent-rgb),.22)!important;\n}\n\n.ma7alak-stat:nth-child(1),\n.ma7alak-stat:nth-child(2){\n  border-bottom-color:\n    rgba(var(--m7-shop-accent-rgb),.10)!important;\n}\n\n.ma7alak-stat:nth-child(1),\n.ma7alak-stat:nth-child(3){\n  border-right-color:\n    rgba(var(--m7-shop-accent-rgb),.10)!important;\n}\n\n.ma7alak-icon{\n  background:\n    linear-gradient(\n      145deg,\n      rgba(var(--m7-shop-accent-rgb),.14),\n      rgba(var(--m7-shop-accent-rgb),.06)\n    )!important;\n  border-color:\n    rgba(var(--m7-shop-accent-rgb),.15)!important;\n}\n\n.ma7alak-stat strong{\n  color:\n    var(--m7-shop-accent-light)!important;\n}\n\n.ma7alak-stat-copy span{\n  color:\n    rgba(var(--m7-shop-accent-rgb),.72)!important;\n}\n\n@media(min-width:700px){\n  .ma7alak-stat:nth-child(1),\n  .ma7alak-stat:nth-child(2),\n  .ma7alak-stat:nth-child(3){\n    border-right-color:\n      rgba(var(--m7-shop-accent-rgb),.10)!important;\n  }\n}\n</style>\n</div>\n";
mount.innerHTML = MARKUP;

/* ===== REST BRIDGE ===== */
(function(){
  "use strict";

  /*
     SHOUFHON REST CLIENT BRIDGE
     --------------------------
     The old separate embeds expected a Supabase client immediately.

     In one large Hostinger embed, the external Supabase library could be
     delayed/not ready when the old About script executed. About then
     returned once and stayed on "Loading…" forever.

     This small client is available IMMEDIATELY and implements only the
     exact methods used by these four proven modules:
       from(...).select(...).eq(...).maybeSingle()
       rpc(...)

     No visual CSS / animation / icon code is changed.
  */

  const URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


  function errorObject(message,status,details){

    return {
      message:String(message || "Request failed"),
      status:Number(status || 0),
      details:details || null
    };

  }


  async function parseResponse(response){

    const text =
      await response.text();

    if(!text){
      return null;
    }

    try{
      return JSON.parse(text);
    }
    catch(_){
      return text;
    }
  }


  async function restGet(
    table,
    selectColumns,
    filters
  ){

    try{

      const params =
        new URLSearchParams();

      params.set(
        "select",
        selectColumns || "*"
      );

      (filters || []).forEach(
        function(filter){

          params.append(
            filter.column,
            "eq." + String(filter.value)
          );

        }
      );

      params.set(
        "limit",
        "1"
      );


      const response =
        await fetch(
          URL +
          "/rest/v1/" +
          encodeURIComponent(table) +
          "?" +
          params.toString(),
          {
            method:"GET",
            headers:{
              "apikey":KEY,
              "Authorization":"Bearer " + KEY,
              "Accept":"application/json"
            },
            cache:"no-store"
          }
        );


      const payload =
        await parseResponse(response);


      if(!response.ok){

        const message =
          payload &&
          typeof payload === "object" &&
          payload.message
            ? payload.message
            : (
                typeof payload === "string" &&
                payload
                  ? payload
                  : "Profile request failed"
              );

        return {
          data:null,
          error:errorObject(
            message,
            response.status,
            payload
          )
        };
      }


      const row =
        Array.isArray(payload)
          ? (
              payload.length
                ? payload[0]
                : null
            )
          : payload;


      return {
        data:row || null,
        error:null
      };

    }
    catch(error){

      return {
        data:null,
        error:errorObject(
          error &&
          error.message
            ? error.message
            : error
        )
      };

    }

  }


  async function restRpc(
    functionName,
    args
  ){

    try{

      const response =
        await fetch(
          URL +
          "/rest/v1/rpc/" +
          encodeURIComponent(functionName),
          {
            method:"POST",
            headers:{
              "apikey":KEY,
              "Authorization":"Bearer " + KEY,
              "Accept":"application/json",
              "Content-Type":"application/json"
            },
            body:JSON.stringify(
              args || {}
            ),
            cache:"no-store"
          }
        );


      const payload =
        await parseResponse(response);


      if(!response.ok){

        const message =
          payload &&
          typeof payload === "object" &&
          payload.message
            ? payload.message
            : (
                typeof payload === "string" &&
                payload
                  ? payload
                  : "RPC request failed"
              );

        return {
          data:null,
          error:errorObject(
            message,
            response.status,
            payload
          )
        };
      }


      return {
        data:payload,
        error:null
      };

    }
    catch(error){

      return {
        data:null,
        error:errorObject(
          error &&
          error.message
            ? error.message
            : error
        )
      };

    }

  }


  const client = {

    from:function(table){

      return {

        select:function(columns){

          const filters = [];

          const query = {

            eq:function(column,value){

              filters.push({
                column:String(column),
                value:value
              });

              return query;
            },

            maybeSingle:function(){

              return restGet(
                String(table),
                String(columns || "*"),
                filters
              );
            }

          };

          return query;
        }

      };

    },


    rpc:function(functionName,args){

      return restRpc(
        String(functionName),
        args || {}
      );

    }

  };


  /*
     The proven old embeds already check this shared slot.
     Put our immediate REST client there BEFORE those scripts run.
  */
  /*
     Keep this client private to the merged hub.
     Do NOT overwrite ShoufHon's normal shared Supabase client because
     unrelated page scripts may need auth/realtime methods.
  */
  window.__MA7ALAK_EXACT_HUB_REST_CLIENT__ =
    client;

})();


/* =========================================================
   LIVE ADMIN REFRESH BUS
   ---------------------------------------------------------
   Each proven module registers its own loader here.
   A shop_profiles Realtime UPDATE then refreshes the open
   website immediately without rebuilding the whole embed.
========================================================= */

const MA7ALAK_HUB_REFRESHERS = [];

window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ =
  function(callback){

    if(
      typeof callback !== "function" ||
      MA7ALAK_HUB_REFRESHERS.includes(callback)
    ){
      return;
    }

    MA7ALAK_HUB_REFRESHERS.push(
      callback
    );
  };


window.__MA7ALAK_PROFILE_HUB_REFRESH__ =
  function(reason){

    MA7ALAK_HUB_REFRESHERS
      .slice()
      .forEach(
        function(callback){

          try{

            const result =
              callback(
                reason || "manual"
              );

            if(
              result &&
              typeof result.catch === "function"
            ){
              result.catch(
                function(error){
                  console.warn(
                    "[ShoufHon Hub] live refresh:",
                    error
                  );
                }
              );
            }

          }
          catch(error){

            console.warn(
              "[ShoufHon Hub] live refresh:",
              error
            );

          }

        }
      );
  };


/* =========================================================
   PAGE DESIGN STUDIO — HUB TYPOGRAPHY
   About keeps its own typography control.
   Social / Location / Stats / Map use the Hub typography control.
========================================================= */
(function(){
  "use strict";

  const SHOP_SLUG =
    window.__MA7ALAK_EXACT_HUB_SLUG__;

  function fontStack(mode){
    return({
      system:'"Segoe UI",Arial,Helvetica,sans-serif',
      modern:'"Trebuchet MS","Segoe UI",Arial,sans-serif',
      elegant:'Georgia,"Times New Roman",serif',
      classic:'"Times New Roman",Georgia,serif',
      mono:'"Courier New",Courier,monospace'
    }[String(mode||"").trim().toLowerCase()]||"");
  }

  function percent(value){
    const n=Number(value);
    return Number.isFinite(n)
      ? Math.max(70,Math.min(150,n))
      : 100;
  }

  function apply(root,options,moduleKey){
    if(!root)return;

    const globalStyle =
      String(
        options.global_font_style ||
        "current"
      )
        .trim()
        .toLowerCase();

    const localStyle =
      String(
        options[moduleKey+"_font_style"] ||
        "inherit"
      )
        .trim()
        .toLowerCase();

    const family =
      fontStack(
        localStyle === "inherit"
          ? globalStyle
          : localStyle
      );

    const scale =
      (
        percent(options.global_font_size) *
        percent(options[moduleKey+"_font_size"])
      ) / 10000;

    [root,...root.querySelectorAll("*")]
      .forEach(el=>{
        if(!el||!el.tagName)return;

        const tag =
          el.tagName.toUpperCase();

        if(
          [
            "STYLE","SCRIPT","SVG","PATH",
            "IMG","VIDEO","IFRAME"
          ].includes(tag)
        ){
          return;
        }

        const direct =
          [...(el.childNodes||[])]
            .some(
              n=>
                n.nodeType===3 &&
                String(n.textContent||"").trim()
            );

        const form =
          [
            "BUTTON","INPUT","TEXTAREA",
            "SELECT","OPTION","A"
          ].includes(tag);

        if(!direct&&!form)return;

        if(family){
          el.style.setProperty(
            "font-family",
            family,
            "important"
          );
        }
        else{
          el.style.removeProperty(
            "font-family"
          );
        }

        let base =
          Number(
            el.dataset.m7BaseFontSize
          );

        if(
          !Number.isFinite(base) ||
          base<=0
        ){
          base =
            parseFloat(
              getComputedStyle(el)
                .fontSize
            );

          if(
            !Number.isFinite(base) ||
            base<=0
          ){
            return;
          }

          el.dataset.m7BaseFontSize =
            String(base);
        }

        el.style.setProperty(
          "font-size",
          (base*scale).toFixed(2)+"px",
          "important"
        );
      });
  }

  function applyAll(options){
    apply(
      document.querySelector(
        "#ma7alak-exact-merged-hub > .zee-about-card"
      ),
      options,
      "about"
    );

    [
      document.querySelector(
        "#ma7alak-exact-merged-hub > .ma7alak-social-section"
      ),
      document.querySelector(
        "#ma7alak-exact-merged-hub > .ma7alak-location-section"
      ),
      document.querySelector(
        "#ma7alak-exact-merged-hub > .ma7alak-realtime-stats"
      ),
      document.getElementById(
        "ma7alak-exact-map-section"
      )
    ]
      .filter(Boolean)
      .forEach(
        root=>
          apply(
            root,
            options,
            "hub"
          )
      );
  }

  async function loadTypography(){
    const client =
      (
        window.Ma7alakAccount &&
        window.Ma7alakAccount.client
      ) ||
      window.__MA7ALAK_EXACT_HUB_REST_CLIENT__ ||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
      null;

    if(
      !client ||
      !SHOP_SLUG
    ){
      return;
    }

    try{
      const result =
        await client
          .from("shop_profiles")
          .select(
            "shop_slug,directory_options"
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          )
          .maybeSingle();

      if(
        result.error ||
        !result.data
      ){
        return;
      }

      const options =
        result.data.directory_options &&
        typeof result.data.directory_options ===
          "object"
          ? result.data.directory_options
          : {};

      applyAll(options);

      /*
        Some proven hub modules rebuild their inner text after
        the profile request completes. Reapply once after those
        renderers finish, without a permanent polling loop.
      */
      setTimeout(
        ()=>applyAll(options),
        250
      );
    }
    catch(error){
      console.warn(
        "[ShoufHon Hub] typography:",
        error
      );
    }
  }

  loadTypography();

  if(
    typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
      "function"
  ){
    window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
      loadTypography
    );
  }
})();


/* ===== EXACT OLD ABOUT ENGINE ===== */
(function(){
  "use strict";

  /* =========================================================
     ONLY CHANGE THIS FOR EACH MANUAL SHOP PAGE
  ========================================================= */
  const SHOP_SLUG = window.__MA7ALAK_EXACT_HUB_SLUG__;


  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


  let supabaseClient =
    (
      window.Ma7alakAccount &&
      window.Ma7alakAccount.client
    ) ||
    window.__MA7ALAK_EXACT_HUB_REST_CLIENT__ ||
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
    null;


  if(
    !supabaseClient &&
    window.supabase &&
    typeof window.supabase.createClient === "function"
  ){
    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );
  }


  function hexToRgb(hex){
    const clean =
      String(hex || "")
        .trim()
        .replace("#","");

    if(!/^[0-9a-f]{6}$/i.test(clean)){
      return null;
    }

    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }


  function mix(base,target,amount){
    function c(value){
      return Math.max(
        0,
        Math.min(
          255,
          Math.round(value)
        )
      );
    }

    return "#" +
      [
        c(base.r + (target.r-base.r)*amount),
        c(base.g + (target.g-base.g)*amount),
        c(base.b + (target.b-base.b)*amount)
      ]
      .map(function(v){
        return v.toString(16).padStart(2,"0");
      })
      .join("");
  }


  function applyAccent(hex){

    const rgb =
      hexToRgb(hex);

    if(!rgb){
      return;
    }

    document.documentElement.style.setProperty(
      "--m7-about-accent",
      hex
    );

    document.documentElement.style.setProperty(
      "--m7-about-accent-rgb",
      rgb.r + "," + rgb.g + "," + rgb.b
    );

    document.documentElement.style.setProperty(
      "--m7-about-accent-light",
      mix(
        rgb,
        {r:255,g:255,b:255},
        .38
      )
    );

    document.documentElement.style.setProperty(
      "--m7-about-accent-dark",
      mix(
        rgb,
        {r:0,g:0,b:0},
        .38
      )
    );

  }


  function iconSVG(key){

    const common =
      'viewBox="0 0 24 24" class="ma7alak-service-svg" aria-hidden="true"';

    const stroke =
      'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

    switch(String(key || "").toLowerCase()){

      case "hijab":
        return `<svg ${common}>
          <path ${stroke} d="M12 3c-3.7 0-6 2.7-6 6.3V20h12V9.3C18 5.7 15.7 3 12 3Z"/>
          <path ${stroke} d="M8.5 10.5c1.2 1.1 2.3 1.6 3.5 1.6s2.3-.5 3.5-1.6"/>
        </svg>`;

      case "clothing":
      case "dress":
        return `<svg ${common}>
          <path ${stroke} d="M9 4h6l1.2 4 3.3 3-2 3-2-1v7h-7v-7l-2 1-2-3 3.3-3L9 4Z"/>
        </svg>`;

      case "bag":
        return `<svg ${common}>
          <path ${stroke} d="M5 8h14l1 12H4L5 8Z"/>
          <path ${stroke} d="M9 8V6a3 3 0 0 1 6 0v2"/>
        </svg>`;

      case "beauty":
      case "sparkle":
        return `<svg ${common}>
          <path ${stroke} d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/>
          <path ${stroke} d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z"/>
        </svg>`;

      case "perfume":
        return `<svg ${common}>
          <path ${stroke} d="M9 3h6v4H9zM8 7h8l2 3v10H6V10l2-3Z"/>
          <path ${stroke} d="M10 12h4"/>
        </svg>`;

      case "tattoo":
        return `<svg ${common}>
          <path ${stroke} d="m5 18 9.2-9.2 2 2L7 20H5v-2Z"/>
          <path ${stroke} d="m13.2 7.8 2.2-2.2 3 3-2.2 2.2"/>
        </svg>`;

      case "piercing":
        return `<svg ${common}>
          <circle ${stroke} cx="12" cy="12" r="6"/>
          <circle ${stroke} cx="17.3" cy="7" r="2"/>
          <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
        </svg>`;

      case "coffee":
        return `<svg ${common}>
          <path ${stroke} d="M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z"/>
          <path ${stroke} d="M16 10h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1.3 1 2.2M12 4c0 1 1 1.3 1 2.2"/>
        </svg>`;

      case "food":
        return `<svg ${common}>
          <path ${stroke} d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10M9.5 3v4.5A2.5 2.5 0 0 1 7 10M7 10v11"/>
          <path ${stroke} d="M16 3v18M16 3c3 1.5 4 5 1.5 8H16"/>
        </svg>`;

      case "delivery":
        return `<svg ${common}>
          <path ${stroke} d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/>
          <circle ${stroke} cx="7" cy="18" r="2"/>
          <circle ${stroke} cx="17" cy="18" r="2"/>
        </svg>`;

      case "location":
        return `<svg ${common}>
          <path ${stroke} d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/>
          <circle ${stroke} cx="12" cy="10" r="2"/>
        </svg>`;

      case "phone":
        return `<svg ${common}>
          <rect ${stroke} x="7" y="2" width="10" height="20" rx="2"/>
          <path ${stroke} d="M10 5h4M11 19h2"/>
        </svg>`;

      case "heart":
        return `<svg ${common}>
          <path ${stroke} d="M20 8.8C20 14 12 19 12 19S4 14 4 8.8A4.3 4.3 0 0 1 12 6a4.3 4.3 0 0 1 8 2.8Z"/>
        </svg>`;

      case "star":
        return `<svg ${common}>
          <path ${stroke} d="m12 3 2.6 5.4 6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.8L12 3Z"/>
        </svg>`;

      case "shop":
      default:
        return `<svg ${common}>
          <path ${stroke} d="M4 10.5 12 4l8 6.5M6 9.5V21h12V9.5M9 21v-6h6v6"/>
        </svg>`;
    }

  }


  function renderServices(rows){

    const box =
      document.getElementById(
        "ma7alak-about-services"
      );

    if(!box){
      return;
    }

    const services =
      Array.isArray(rows)
        ? rows.filter(function(row){
            return row &&
              String(row.label || "").trim();
          })
        : [];


    box.innerHTML =
      services
        .slice(0,4)
        .map(function(row,index){

          const label =
            String(row.label || "").trim();

          const icon =
            String(row.icon || "sparkle")
              .trim()
              .toLowerCase();

          const extra =
            icon === "tattoo"
              ? '<span class="zee-ink-drop" aria-hidden="true"></span>'
              : (
                  icon === "piercing"
                    ? '<span class="zee-piercing-spark" aria-hidden="true">✦</span>'
                    : ""
                );

          return (
            '<div class="zee-service-pill zee-service-' + icon.replace(/[^a-z0-9_-]/g,"") + '" data-about-service-index="' + (index+1) + '">' +
              '<span class="zee-service-icon">' +
                iconSVG(icon) +
              '</span>' +
              '<span class="zee-service-label">' +
                label
                  .replace(/&/g,"&amp;")
                  .replace(/</g,"&lt;")
                  .replace(/>/g,"&gt;") +
              '</span>' +
              extra +
            '</div>'
          );

        })
        .join("");

  }



  function aboutOptionBool(options,key,fallback){
    if(
      !options ||
      options[key] === undefined ||
      options[key] === null
    ){
      return fallback;
    }

    return (
      options[key] === true ||
      String(options[key]).toLowerCase() === "true"
    );
  }


  function renderFloatingSparkles(enabled){

    const layer =
      document.getElementById(
        "ma7alak-about-floating-sparkles"
      );

    if(!layer){
      return;
    }

    if(!enabled){
      layer.innerHTML = "";
      return;
    }


    /*
       Fixed positions keep this lightweight and consistent on phone.
       No random timers and no extra outer layer around the panel.
    */
    const sparkles = [
      ["12%","18%","7px","3.9s","-.6s","8px"],
      ["82%","16%","6px","4.4s","-1.4s","-7px"],
      ["20%","62%","5px","3.6s","-2.1s","10px"],
      ["88%","58%","7px","4.8s","-.9s","-9px"],
      ["48%","12%","5px","3.7s","-1.8s","6px"],
      ["58%","76%","6px","4.2s","-2.8s","-6px"],
      ["8%","82%","5px","4.6s","-1.1s","8px"],
      ["92%","84%","5px","3.8s","-2.4s","-8px"]
    ];


    layer.innerHTML =
      sparkles
        .map(function(item){

          return (
            '<span style="' +
              '--m7-left:' + item[0] + ';' +
              '--m7-top:' + item[1] + ';' +
              '--m7-size:' + item[2] + ';' +
              '--m7-duration:' + item[3] + ';' +
              '--m7-delay:' + item[4] + ';' +
              '--m7-drift:' + item[5] + ';' +
            '"></span>'
          );

        })
        .join("");

  }


  function applyAboutEffects(options){

    const card =
      document.querySelector(
        ".zee-about-card"
      );

    if(!card){
      return;
    }


    const settings = {
      titleSparkles:
        aboutOptionBool(
          options,
          "about_fx_title_sparkles",
          true
        ),

      floatingSparkles:
        aboutOptionBool(
          options,
          "about_fx_floating_sparkles",
          false
        ),

      titleShimmer:
        aboutOptionBool(
          options,
          "about_fx_title_shimmer",
          true
        ),

      panelGlow:
        aboutOptionBool(
          options,
          "about_fx_panel_glow",
          false
        ),

      iconPulse:
        aboutOptionBool(
          options,
          "about_fx_icon_pulse",
          false
        ),

      signatureShimmer:
        aboutOptionBool(
          options,
          "about_fx_signature_shimmer",
          false
        ),

      ornamentShine:
        aboutOptionBool(
          options,
          "about_fx_ornament_shine",
          true
        )
    };


    card.classList.toggle(
      "m7-fx-title-sparkles",
      settings.titleSparkles
    );

    card.classList.toggle(
      "m7-fx-floating",
      settings.floatingSparkles
    );

    card.classList.toggle(
      "m7-fx-title-shimmer",
      settings.titleShimmer
    );

    card.classList.toggle(
      "m7-fx-panel-glow",
      settings.panelGlow
    );

    card.classList.toggle(
      "m7-fx-icons",
      settings.iconPulse
    );

    card.classList.toggle(
      "m7-fx-signature",
      settings.signatureShimmer
    );

    card.classList.toggle(
      "m7-fx-ornament",
      settings.ornamentShine
    );


    renderFloatingSparkles(
      settings.floatingSparkles
    );

  }


  async function loadAbout(){

    if(!supabaseClient){
      return;
    }

    try{

      const result =
        await supabaseClient
          .from("shop_profiles")
          .select(
            "shop_slug,shop_name,arabic_name,category,category_name,about_text,directory_options"
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          )
          .maybeSingle();


      if(result.error){
        throw result.error;
      }


      if(!result.data){
        console.warn(
          "SHOUFHON About: no shop found for slug:",
          SHOP_SLUG
        );
        return;
      }


      const shop =
        result.data;

      const options =
        shop.directory_options &&
        typeof shop.directory_options === "object"
          ? shop.directory_options
          : {};


      const shopName =
        String(
          shop.shop_name ||
          SHOP_SLUG
        ).trim();


      const arabicName =
        String(
          shop.arabic_name ||
          ""
        ).trim();


      const cardLabel =
        String(
          shop.category_name ||
          shop.category ||
          ""
        ).trim();


      const aboutText =
        String(
          shop.about_text ||
          ""
        ).trim();


      const kicker =
        document.getElementById(
          "ma7alak-about-kicker"
        );

      const title =
        document.getElementById(
          "ma7alak-about-title"
        );

      const arabic =
        document.getElementById(
          "ma7alak-about-arabic-name"
        );

      const text =
        document.getElementById(
          "ma7alak-about-text"
        );


      const signature =
        document.getElementById(
          "ma7alak-about-signature"
        );


      if(kicker){
        kicker.textContent =
          cardLabel ||
          shopName;
      }


      if(title){
        title.textContent =
          "About " + shopName;
      }


      if(arabic){
        arabic.textContent =
          arabicName;

        arabic.hidden =
          !arabicName;
      }


      if(text){
        text.textContent =
          aboutText ||
          "About information coming soon.";
      }


      if(signature){
        signature.textContent =
          String(
            options.about_signature ||
            "Your style. Your story."
          ).trim() ||
          "Your style. Your story.";
      }


      renderServices(
        options.about_services
      );


      applyAboutEffects(
        options
      );


      const color =
        String(
          options.story_color ||
          options.card_color ||
          ""
        ).trim();

      if(color){
        applyAccent(color);
      }

    }
    catch(error){

      console.error(
        "SHOUFHON About:",
        error
      );

    }

  }


  loadAbout();

  if(
    typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
      "function"
  ){
    window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
      loadAbout
    );
  }

})();

/* ===== EXACT OLD SOCIAL ENGINE ===== */
(function(){
  "use strict";

  /* =========================================================
     ONLY CHANGE THIS FOR EACH MANUAL SHOP PAGE
  ========================================================= */
  const SHOP_SLUG = window.__MA7ALAK_EXACT_HUB_SLUG__;


  function m7HexToRgb(hex){
    const clean = String(hex || "").trim().replace("#","");
    if(!/^[0-9a-f]{6}$/i.test(clean)) return null;
    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }

  function m7Mix(rgb,target,amount){
    const clamp = n => Math.max(0,Math.min(255,Math.round(n)));
    return "#" + [
      clamp(rgb.r + (target.r-rgb.r)*amount),
      clamp(rgb.g + (target.g-rgb.g)*amount),
      clamp(rgb.b + (target.b-rgb.b)*amount)
    ].map(v=>v.toString(16).padStart(2,"0")).join("");
  }

  function m7ApplyAccent(hex){
    const rgb = m7HexToRgb(hex);
    if(!rgb) return false;

    const root = document.documentElement;
    root.style.setProperty("--m7-shop-accent","#"+String(hex).replace("#",""));
    root.style.setProperty("--m7-shop-accent-rgb",rgb.r+","+rgb.g+","+rgb.b);
    root.style.setProperty("--m7-shop-accent-light",m7Mix(rgb,{r:255,g:255,b:255},.40));
    root.style.setProperty("--m7-shop-accent-soft",m7Mix(rgb,{r:255,g:255,b:255},.16));
    root.style.setProperty("--m7-shop-accent-dark",m7Mix(rgb,{r:0,g:0,b:0},.38));
    return true;
  }

  function m7AccentFromProfile(profile){
    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};

    return String(
      options.story_color ||
      options.card_color ||
      ""
    ).trim();
  }

  function m7GetClient(){
    if(
      window.Ma7alakAccount &&
      window.Ma7alakAccount.client
    ){
      return window.Ma7alakAccount.client;
    }

    if(window.__MA7ALAK_EXACT_HUB_REST_CLIENT__){
      return window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;
    }

    if(window.__MA7ALAK_SHARED_SUPABASE_CLIENT__){
      return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;
    }

    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){
      const client =
        window.supabase.createClient(
          "https://wdtaiuwtqdepzdamgsrs.supabase.co",
          "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl"
        );

      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ = client;
      return client;
    }

    return null;
  }


  function normalizeSocialUrl(type,value){
    const raw = String(value || "").trim();
    if(!raw) return "";

    if(/^https?:\/\//i.test(raw)){
      return raw;
    }

    if(type === "tiktok"){
      const handle = raw.replace(/^@/,"").replace(/^tiktok\.com\/@?/i,"");
      return handle ? "https://www.tiktok.com/@" + encodeURIComponent(handle) : "";
    }

    if(type === "instagram"){
      const handle = raw.replace(/^@/,"").replace(/^instagram\.com\//i,"").replace(/\/+$/,"");
      return handle ? "https://www.instagram.com/" + encodeURIComponent(handle) + "/" : "";
    }

    if(type === "facebook"){
      const page = raw.replace(/^@/,"").replace(/^facebook\.com\//i,"").replace(/\/+$/,"");
      return page ? "https://www.facebook.com/" + page : "";
    }

    if(type === "whatsapp"){
      const digits = raw.replace(/[^\d]/g,"");
      return digits ? "https://wa.me/" + digits : "";
    }

    return raw;
  }


  function iconMarkup(type){

    if(type === "tiktok"){
      return `
        <div class="ma7alak-social-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              class="tiktok-main"
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-3.77V2h-3.38v13.62a2.9 2.9 0 1 1-2-2.75v-3.4a6.3 6.3 0 1 0 5.38 6.15V8.73a8.2 8.2 0 0 0 4.79 1.53V6.89c-.35 0-.69-.07-1.02-.2z"
            />
          </svg>
        </div>
      `;
    }

    if(type === "instagram"){
      return `
        <div class="ma7alak-social-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient
                id="ma7alakInstagramGradient"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stop-color="#F58529"/>
                <stop offset="35%" stop-color="#DD2A7B"/>
                <stop offset="65%" stop-color="#8134AF"/>
                <stop offset="100%" stop-color="#515BD4"/>
              </linearGradient>
            </defs>

            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
              fill="none"
              stroke="url(#ma7alakInstagramGradient)"
              stroke-width="2"
            />

            <circle
              cx="12"
              cy="12"
              r="4.2"
              fill="none"
              stroke="url(#ma7alakInstagramGradient)"
              stroke-width="2"
            />

            <circle
              cx="17.4"
              cy="6.6"
              r="1.15"
              fill="#DD2A7B"
            />
          </svg>
        </div>
      `;
    }

    if(type === "facebook"){
      return `
        <div class="ma7alak-social-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient
                id="ma7alakFacebookGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#2d8cff"/>
                <stop offset="100%" stop-color="#0866ff"/>
              </linearGradient>
            </defs>

            <circle
              cx="12"
              cy="12"
              r="10"
              fill="url(#ma7alakFacebookGradient)"
            />

            <path
              d="M13.55 21v-7h2.35l.35-2.73h-2.7V9.53c0-.79.22-1.33 1.36-1.33h1.45V5.76c-.25-.03-1.11-.11-2.11-.11-2.09 0-3.52 1.28-3.52 3.62v2h-2.36V14h2.36v7h2.82z"
              fill="#ffffff"
            />
          </svg>
        </div>
      `;
    }

    return `
      <div class="ma7alak-social-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.49 0 .16 5.33.16 11.89c0 2.09.55 4.13 1.6 5.93L.05 24l6.32-1.66a11.87 11.87 0 0 0 5.67 1.44h.01c6.56 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.17-3.42-8.41zM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.65-.23-.38a9.83 9.83 0 0 1-1.51-5.26C2.16 6.45 6.6 2 12.05 2c2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.88 6.99c0 5.45-4.44 9.9-9.86 9.9zm5.42-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
            fill="#25D366"
          />
        </svg>
      </div>
    `;
  }


  function renderSocials(profile){

    const panel =
      document.getElementById(
        "ma7alak-social-section"
      );

    const box =
      document.getElementById(
        "ma7alak-social-links"
      );

    if(!panel || !box){
      return;
    }


    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};


    const rows = [
      {
        type:"tiktok",
        label:"TikTok",
        url:normalizeSocialUrl(
          "tiktok",
          profile && profile.tiktok_url
        )
      },
      {
        type:"instagram",
        label:"Instagram",
        url:normalizeSocialUrl(
          "instagram",
          profile && profile.instagram_url
        )
      },
      {
        type:"facebook",
        label:"Facebook",
        url:normalizeSocialUrl(
          "facebook",
          options.facebook_url
        )
      },
      {
        type:"whatsapp",
        label:"WhatsApp",
        url:normalizeSocialUrl(
          "whatsapp",
          profile && profile.whatsapp_url
        )
      }
    ].filter(row=>row.url);


    if(!rows.length){
      panel.hidden = true;
      return;
    }


    panel.hidden = false;


    box.innerHTML =
      rows
        .map(function(row){
          return (
            '<a ' +
              'href="' + row.url.replace(/"/g,"%22") + '" ' +
              'class="ma7alak-social-item ma7alak-' + row.type + '" ' +
              'target="_blank" ' +
              'rel="noopener noreferrer" ' +
              'aria-label="' + row.label + '"' +
            '>' +
              iconMarkup(row.type) +
              '<span class="ma7alak-social-label">' +
                row.label +
              '</span>' +
            '</a>'
          );
        })
        .join("");

  }


  async function loadSocialPanel(){

    const client =
      m7GetClient();

    if(!client){
      setTimeout(loadSocialPanel,300);
      return;
    }


    const result =
      await client
        .from("shop_profiles")
        .select(
          "shop_slug,tiktok_url,instagram_url,whatsapp_url,directory_options"
        )
        .eq("shop_slug",SHOP_SLUG)
        .maybeSingle();


    if(result.error){
      console.error(
        "SHOUFHON social profile:",
        result.error
      );
      return;
    }


    if(!result.data){
      console.warn(
        "SHOUFHON social: no Admin shop found for",
        SHOP_SLUG
      );
      return;
    }


    const accent =
      m7AccentFromProfile(
        result.data
      );

    if(accent){
      m7ApplyAccent(accent);
    }


    renderSocials(
      result.data
    );

  }


  loadSocialPanel();

  if(
    typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
      "function"
  ){
    window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
      loadSocialPanel
    );
  }

})();

/* ===== EXACT OLD LOCATION ENGINE ===== */
(function(){
  "use strict";

  /* =========================================================
     ONLY CHANGE THIS FOR EACH MANUAL SHOP PAGE
  ========================================================= */
  const SHOP_SLUG = window.__MA7ALAK_EXACT_HUB_SLUG__;


  function m7HexToRgb(hex){
    const clean = String(hex || "").trim().replace("#","");
    if(!/^[0-9a-f]{6}$/i.test(clean)) return null;
    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }

  function m7Mix(rgb,target,amount){
    const clamp = n => Math.max(0,Math.min(255,Math.round(n)));
    return "#" + [
      clamp(rgb.r + (target.r-rgb.r)*amount),
      clamp(rgb.g + (target.g-rgb.g)*amount),
      clamp(rgb.b + (target.b-rgb.b)*amount)
    ].map(v=>v.toString(16).padStart(2,"0")).join("");
  }

  function m7ApplyAccent(hex){
    const rgb = m7HexToRgb(hex);
    if(!rgb) return false;

    const root = document.documentElement;
    root.style.setProperty("--m7-shop-accent","#"+String(hex).replace("#",""));
    root.style.setProperty("--m7-shop-accent-rgb",rgb.r+","+rgb.g+","+rgb.b);
    root.style.setProperty("--m7-shop-accent-light",m7Mix(rgb,{r:255,g:255,b:255},.40));
    root.style.setProperty("--m7-shop-accent-soft",m7Mix(rgb,{r:255,g:255,b:255},.16));
    root.style.setProperty("--m7-shop-accent-dark",m7Mix(rgb,{r:0,g:0,b:0},.38));
    return true;
  }

  function m7AccentFromProfile(profile){
    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};

    return String(
      options.story_color ||
      options.card_color ||
      ""
    ).trim();
  }

  function m7GetClient(){
    if(
      window.Ma7alakAccount &&
      window.Ma7alakAccount.client
    ){
      return window.Ma7alakAccount.client;
    }

    if(window.__MA7ALAK_EXACT_HUB_REST_CLIENT__){
      return window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;
    }

    if(window.__MA7ALAK_SHARED_SUPABASE_CLIENT__){
      return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;
    }

    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){
      const client =
        window.supabase.createClient(
          "https://wdtaiuwtqdepzdamgsrs.supabase.co",
          "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl"
        );

      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ = client;
      return client;
    }

    return null;
  }


  async function loadLocationPanel(){

    const client =
      m7GetClient();

    if(!client){
      setTimeout(loadLocationPanel,300);
      return;
    }


    const result =
      await client
        .from("shop_profiles")
        .select(
          "shop_slug,address_text,directory_options"
        )
        .eq("shop_slug",SHOP_SLUG)
        .maybeSingle();


    if(result.error){
      console.error(
        "SHOUFHON location profile:",
        result.error
      );
      return;
    }


    if(!result.data){
      console.warn(
        "SHOUFHON location: no Admin shop found for",
        SHOP_SLUG
      );
      return;
    }


    const profile =
      result.data;

    const options =
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};


    const locationValue =
      String(
        profile.address_text ||
        "Full address not added"
      ).trim();


    /*
       These two Admin fields are deliberately FREE TEXT.
       Examples:
       days: "Monday – Sunday", "By appointment", "Free days"
       time: "10 AM – 8 PM", "Flexible Time", "Free Time"
    */
    const days =
      String(
        options.availability_days ||
        ""
      ).trim();

    const time =
      String(
        options.availability_time ||
        ""
      ).trim();


    const extraRows =
      Array.isArray(
        options.availability_extra_rows
      )
        ? options.availability_extra_rows
            .map(
              function(row){

                return {
                  days:
                    String(
                      row &&
                      row.days ||
                      ""
                    ).trim(),

                  time:
                    String(
                      row &&
                      row.time ||
                      ""
                    ).trim()
                };

              }
            )
            .filter(
              function(row){
                return row.days || row.time;
              }
            )
        : [];


    const locationEl =
      document.getElementById(
        "ma7alak-location-value"
      );

    const daysEl =
      document.getElementById(
        "ma7alak-availability-days"
      );

    const timeEl =
      document.getElementById(
        "ma7alak-availability-time"
      );


    const extraEl =
      document.getElementById(
        "ma7alak-availability-extra"
      );


    if(locationEl){
      locationEl.textContent =
        locationValue;
    }


    if(daysEl){
      daysEl.textContent =
        days ||
        (
          time || extraRows.length
            ? ""
            : "Contact shop for availability"
        );

      daysEl.hidden =
        !days &&
        (
          !!time ||
          extraRows.length > 0
        );
    }


    if(timeEl){
      timeEl.textContent =
        time;

      timeEl.hidden =
        !time;
    }


    if(extraEl){

      extraEl.innerHTML =
        "";

      extraRows.forEach(
        function(row){

          const line =
            document.createElement(
              "div"
            );

          line.className =
            "ma7alak-availability-line";


          if(row.days){

            const daysPart =
              document.createElement(
                "span"
              );

            daysPart.textContent =
              row.days;

            line.appendChild(
              daysPart
            );

          }


          if(row.time){

            const timePart =
              document.createElement(
                "strong"
              );

            timePart.textContent =
              row.time;

            line.appendChild(
              timePart
            );

          }


          extraEl.appendChild(
            line
          );

        }
      );

    }


    const accent =
      m7AccentFromProfile(
        profile
      );

    if(accent){
      m7ApplyAccent(accent);
    }

  }


  loadLocationPanel();

  if(
    typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
      "function"
  ){
    window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
      loadLocationPanel
    );
  }

})();

/* ===== EXACT OLD OPTIMIZED STATS ENGINE ===== */
(function(){
  "use strict";

  /* =========================================================
     SHOUFHON SHOP STATS — OPTIMIZED
     ---------------------------------------------------------
     ✓ Same slug-driven shop detection
     ✓ Same colors / design
     ✓ Same unique daily view rule
     ✓ Presence heartbeat: every 12 seconds
     ✓ Visible stats: every 10 seconds
     ✓ ONE stats RPC instead of TWO
     ✓ Pauses polling while browser tab is hidden
     ✓ Restarts immediately when visitor comes back
     ✓ Prevents overlapping requests on slow connections
  ========================================================= */

  /* =========================================================
     ONLY CHANGE THIS FOR EACH MANUAL SHOP PAGE
  ========================================================= */
  const SHOP_SLUG = window.__MA7ALAK_EXACT_HUB_SLUG__;


  const PRESENCE_INTERVAL_MS = 12000;
  const STATS_INTERVAL_MS = 10000;


  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


  function m7HexToRgb(hex){
    const clean =
      String(hex || "")
        .trim()
        .replace("#","");

    if(!/^[0-9a-f]{6}$/i.test(clean)){
      return null;
    }

    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }


  function m7Mix(rgb,target,amount){

    const clamp =
      n => Math.max(
        0,
        Math.min(
          255,
          Math.round(n)
        )
      );

    return "#" +
      [
        clamp(
          rgb.r +
          (target.r-rgb.r)*amount
        ),
        clamp(
          rgb.g +
          (target.g-rgb.g)*amount
        ),
        clamp(
          rgb.b +
          (target.b-rgb.b)*amount
        )
      ]
      .map(
        v =>
          v
            .toString(16)
            .padStart(2,"0")
      )
      .join("");
  }


  function m7ApplyAccent(hex){

    const rgb =
      m7HexToRgb(hex);

    if(!rgb){
      return false;
    }

    const root =
      document.documentElement;

    root.style.setProperty(
      "--m7-shop-accent",
      "#" +
      String(hex).replace("#","")
    );

    root.style.setProperty(
      "--m7-shop-accent-rgb",
      rgb.r +
      "," +
      rgb.g +
      "," +
      rgb.b
    );

    root.style.setProperty(
      "--m7-shop-accent-light",
      m7Mix(
        rgb,
        {r:255,g:255,b:255},
        .40
      )
    );

    root.style.setProperty(
      "--m7-shop-accent-soft",
      m7Mix(
        rgb,
        {r:255,g:255,b:255},
        .16
      )
    );

    root.style.setProperty(
      "--m7-shop-accent-dark",
      m7Mix(
        rgb,
        {r:0,g:0,b:0},
        .38
      )
    );

    return true;
  }


  function m7AccentFromProfile(profile){

    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};

    return String(
      options.story_color ||
      options.card_color ||
      ""
    ).trim();
  }


  function m7GetClient(){

    if(
      window.Ma7alakAccount &&
      window.Ma7alakAccount.client
    ){
      return window.Ma7alakAccount.client;
    }


    if(
      window.__MA7ALAK_EXACT_HUB_REST_CLIENT__
    ){
      return window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;
    }


    if(
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__
    ){
      return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;
    }


    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){

      const client =
        window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        );


      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ =
        client;


      return client;
    }


    return null;
  }


  const startedKey =
    "__MA7ALAK_STATS_STARTED__" +
    SHOP_SLUG;


  if(window[startedKey]){
    return;
  }


  window[startedKey] = true;


  function getVisitorId(){

    let visitorId =
      localStorage.getItem(
        "ma7alak_visitor_id"
      );


    if(!visitorId){

      visitorId =
        (
          window.crypto &&
          typeof window.crypto.randomUUID === "function"
        )
          ? window.crypto.randomUUID()
          : (
              Date.now().toString(36) +
              Math.random().toString(36).slice(2)
            );


      localStorage.setItem(
        "ma7alak_visitor_id",
        visitorId
      );

    }


    return visitorId;
  }


  async function start(){

    const client =
      m7GetClient();


    if(!client){

      setTimeout(
        start,
        300
      );

      return;
    }


    const visitorId =
      getVisitorId();


    let presenceTimer =
      null;

    let statsTimer =
      null;

    let presenceRunning =
      false;

    let statsRunning =
      false;


    async function loadShopTheme(){

      const result =
        await client
          .from("shop_profiles")
          .select(
            "shop_slug,directory_options"
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          )
          .maybeSingle();


      if(result.error){

        console.warn(
          "SHOUFHON stats theme:",
          result.error
        );

        return;
      }


      if(result.data){

        const accent =
          m7AccentFromProfile(
            result.data
          );


        if(accent){

          m7ApplyAccent(
            accent
          );

        }

      }

    }


    async function recordPageView(){

      const { error } =
        await client.rpc(
          "record_shop_view",
          {
            p_shop_id:
              SHOP_SLUG,

            p_visitor_id:
              visitorId
          }
        );


      if(error){

        console.error(
          "SHOUFHON record view error:",
          error
        );

      }

    }


    async function updatePresence(){

      if(
        document.visibilityState === "hidden" ||
        presenceRunning
      ){
        return;
      }


      presenceRunning =
        true;


      try{

        const { error } =
          await client.rpc(
            "update_shop_presence",
            {
              p_shop_id:
                SHOP_SLUG,

              p_visitor_id:
                visitorId
            }
          );


        if(error){

          console.error(
            "SHOUFHON presence error:",
            error
          );

        }

      }
      finally{

        presenceRunning =
          false;

      }

    }


    function renderStats(data){

      if(!data){
        return;
      }


      const total =
        document.getElementById(
          "ma7alak-total"
        );

      const week =
        document.getElementById(
          "ma7alak-week"
        );

      const today =
        document.getElementById(
          "ma7alak-today"
        );

      const online =
        document.getElementById(
          "ma7alak-online"
        );

      const onlineEye =
        document.getElementById(
          "ma7alak-online-eye"
        );


      const onlineCount =
        Number(
          data.online ||
          0
        );


      if(total){

        total.textContent =
          Number(
            data.total_views ||
            0
          );

      }


      if(week){

        week.textContent =
          Number(
            data.weekly_views ||
            0
          );

      }


      if(today){

        today.textContent =
          Number(
            data.today_visitors ||
            0
          );

      }


      if(online){

        online.textContent =
          onlineCount;

      }


      if(onlineEye){

        onlineEye.classList.toggle(
          "ma7alak-eye-active",
          onlineCount >= 2
        );

      }

    }


    async function refreshStats(){

      if(
        document.visibilityState === "hidden" ||
        statsRunning
      ){
        return;
      }


      statsRunning =
        true;


      try{

        /*
           One RPC now returns:
           - total views
           - weekly views
           - today's visitors
           - viewing now

           Previously this required TWO RPC calls.
        */
        const { data,error } =
          await client.rpc(
            "get_shop_stats_live",
            {
              p_shop_id:
                SHOP_SLUG
            }
          );


        if(error){

          console.error(
            "SHOUFHON stats error:",
            error
          );

          return;
        }


        renderStats(
          data
        );

      }
      finally{

        statsRunning =
          false;

      }

    }


    function clearTimers(){

      if(presenceTimer){

        clearTimeout(
          presenceTimer
        );

        presenceTimer =
          null;

      }


      if(statsTimer){

        clearTimeout(
          statsTimer
        );

        statsTimer =
          null;

      }

    }


    function schedulePresence(){

      if(
        document.visibilityState === "hidden"
      ){
        return;
      }


      presenceTimer =
        setTimeout(
          async function(){

            await updatePresence();

            schedulePresence();

          },
          PRESENCE_INTERVAL_MS
        );

    }


    function scheduleStats(){

      if(
        document.visibilityState === "hidden"
      ){
        return;
      }


      statsTimer =
        setTimeout(
          async function(){

            await refreshStats();

            scheduleStats();

          },
          STATS_INTERVAL_MS
        );

    }


    async function resumeLiveUpdates(){

      clearTimers();


      if(
        document.visibilityState === "hidden"
      ){
        return;
      }


      /*
         Refresh immediately when the visitor returns
         instead of waiting for the next interval.
      */
      await Promise.all([
        updatePresence(),
        refreshStats()
      ]);


      schedulePresence();
      scheduleStats();

    }


    document.addEventListener(
      "visibilitychange",
      function(){

        if(
          document.visibilityState === "hidden"
        ){

          clearTimers();

          return;

        }


        resumeLiveUpdates();

      }
    );


    /*
       Load color once.
       Record unique daily view once.
       Then start the optimized live loops.
    */
    await loadShopTheme();

    await recordPageView();

    await resumeLiveUpdates();

  }


  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once:true
      }
    );

  }
  else{

    start();

  }

})();

/* ===== OPTIONAL MAP / OUTER SHELL ACCENT ===== */
(function(){
  "use strict";

  const SHOP_SLUG =
    window.__MA7ALAK_EXACT_HUB_SLUG__;

  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


  function safeHttpUrl(value){

    const raw =
      String(value || "").trim();

    if(!raw){
      return "";
    }

    try{

      const url =
        new URL(raw);

      if(
        url.protocol !== "https:" &&
        url.protocol !== "http:"
      ){
        return "";
      }

      return url.href;

    }
    catch(_){
      return "";
    }
  }


  function hexToRgb(hex){

    const clean =
      String(hex || "")
        .trim()
        .replace("#","");

    if(!/^[0-9a-f]{6}$/i.test(clean)){
      return null;
    }

    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }


  function applyShellAccent(hex){

    const rgb =
      hexToRgb(hex);

    if(!rgb){
      return;
    }

    const shell =
      document.getElementById(
        "ma7alak-exact-merged-hub"
      );

    if(!shell){
      return;
    }

    shell.style.setProperty(
      "--m7-exact-shell-accent",
      "#" + String(hex).replace("#","")
    );

    shell.style.setProperty(
      "--m7-exact-shell-accent-rgb",
      rgb.r + "," + rgb.g + "," + rgb.b
    );
  }


  function renderMap(profile){

    const section =
      document.getElementById(
        "ma7alak-exact-map-section"
      );

    const iframe =
      document.getElementById(
        "ma7alak-exact-map"
      );

    if(!section || !iframe){
      return;
    }

    const url =
      safeHttpUrl(
        profile &&
        profile.map_embed_url
      );

    if(!url){

      iframe.removeAttribute("src");
      section.hidden = true;
      return;
    }

    iframe.src = url;
    section.hidden = false;
  }


  async function loadExtraProfile(){

    try{

      const client =
        window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;


      if(!client){
        return;
      }


      const result =
        await client
          .from("shop_profiles")
          .select(
            "shop_slug,map_embed_url,directory_options"
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          )
          .maybeSingle();


      if(
        result.error ||
        !result.data
      ){
        return;
      }


      const profile =
        result.data;


      const options =
        profile &&
        profile.directory_options &&
        typeof profile.directory_options === "object"
          ? profile.directory_options
          : {};


      const accent =
        String(
          options.story_color ||
          options.card_color ||
          ""
        ).trim();


      if(accent){
        applyShellAccent(accent);
      }


      renderMap(profile);

    }
    catch(error){

      console.warn(
        "[ShoufHon Exact Hub] optional map:",
        error
      );

    }

  }


  loadExtraProfile();

  if(
    typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
      "function"
  ){
    window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
      loadExtraProfile
    );
  }

})();


/* =========================================================
   SUPABASE REALTIME — ADMIN SAVE -> LIVE WEBSITE UPDATE
   ---------------------------------------------------------
   Initial page content still uses the private REST bridge.
   Realtime is loaded AFTER render, so it cannot cause the old
   Hostinger "Loading…" race.
========================================================= */

(function installMa7alakHubAdminLiveSync(){

  const SHOP_SLUG =
    window.__MA7ALAK_EXACT_HUB_SLUG__;

  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  let realtimeChannel = null;
  let realtimeClient = null;
  let libraryPromise = null;


  function refreshNow(reason){

    if(
      typeof window.__MA7ALAK_PROFILE_HUB_REFRESH__ ===
        "function"
    ){
      window.__MA7ALAK_PROFILE_HUB_REFRESH__(
        reason || "admin-live"
      );
    }

  }


  function loadSupabaseLibrary(){

    if(
      window.supabase &&
      typeof window.supabase.createClient ===
        "function"
    ){
      return Promise.resolve(
        window.supabase
      );
    }

    if(libraryPromise){
      return libraryPromise;
    }

    libraryPromise =
      new Promise(
        function(resolve,reject){

          const existing =
            document.querySelector(
              'script[data-ma7alak-hub-realtime-lib="1"],script[src*="@supabase/supabase-js@2"]'
            );

          function finish(){

            if(
              window.supabase &&
              typeof window.supabase.createClient ===
                "function"
            ){
              resolve(
                window.supabase
              );
              return;
            }

            reject(
              new Error(
                "SUPABASE_REALTIME_LIBRARY_NOT_READY"
              )
            );
          }

          if(existing){

            if(
              window.supabase &&
              typeof window.supabase.createClient ===
                "function"
            ){
              finish();
              return;
            }

            existing.addEventListener(
              "load",
              finish,
              {once:true}
            );

            existing.addEventListener(
              "error",
              reject,
              {once:true}
            );

            return;
          }

          const script =
            document.createElement(
              "script"
            );

          script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

          script.async =
            true;

          script.dataset.ma7alakHubRealtimeLib =
            "1";

          script.onload =
            finish;

          script.onerror =
            function(){
              reject(
                new Error(
                  "SUPABASE_REALTIME_LIBRARY_LOAD_FAILED"
                )
              );
            };

          document.head.appendChild(
            script
          );
        }
      );

    return libraryPromise;
  }


  async function getRealtimeClient(){

    if(
      window.Ma7alakAccount &&
      typeof window.Ma7alakAccount.ready ===
        "function"
    ){
      try{
        await window.Ma7alakAccount.ready();
      }
      catch(_){}
    }

    if(
      window.Ma7alakAccount &&
      window.Ma7alakAccount.client &&
      typeof window.Ma7alakAccount.client.channel ===
        "function"
    ){
      return window.Ma7alakAccount.client;
    }

    if(
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ &&
      typeof window.__MA7ALAK_SHARED_SUPABASE_CLIENT__.channel ===
        "function"
    ){
      return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;
    }

    const library =
      await loadSupabaseLibrary();

    if(!realtimeClient){

      realtimeClient =
        library.createClient(
          SUPABASE_URL,
          SUPABASE_KEY,
          {
            auth:{
              persistSession:false,
              autoRefreshToken:false,
              detectSessionInUrl:false
            }
          }
        );
    }

    return realtimeClient;
  }


  async function startRealtime(){

    if(realtimeChannel){
      return;
    }

    try{

      const client =
        await getRealtimeClient();

      if(
        !client ||
        typeof client.channel !==
          "function"
      ){
        return;
      }

      realtimeChannel =
        client
          .channel(
            "ma7alak-profile-hub-" +
            SHOP_SLUG +
            "-" +
            Math.random()
              .toString(36)
              .slice(2)
          )
          .on(
            "postgres_changes",
            {
              event:"UPDATE",
              schema:"public",
              table:"shop_profiles",
              filter:
                "shop_slug=eq." +
                SHOP_SLUG
            },
            function(){

              refreshNow(
                "supabase-realtime"
              );

            }
          )
          .subscribe();

    }
    catch(error){

      console.warn(
        "[ShoufHon Hub] Realtime unavailable:",
        error
      );

    }
  }


  document.addEventListener(
    "visibilitychange",
    function(){

      if(
        document.visibilityState ===
          "visible"
      ){

        refreshNow(
          "visibility"
        );

        startRealtime();
      }
    }
  );


  window.addEventListener(
    "focus",
    function(){
      refreshNow(
        "focus"
      );
    }
  );


  startRealtime();

})();


})();

/* =========================================================
   SHOUFHON PROFILE HUB — LIVE ABOUT TITLE STYLE
   directory_options:
     about_title_color
     about_title_animation
========================================================= */
(function(){
  "use strict";

  if(window.__MA7ALAK_HUB_DS_V2_AUTHORITATIVE__){
    return;
  }

  if(window.__MA7ALAK_ABOUT_TITLE_STYLE_LIVE__){
    return;
  }

  window.__MA7ALAK_ABOUT_TITLE_STYLE_LIVE__ = true;

  function safeHex(value,fallback){
    const raw = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(raw)
      ? raw
      : fallback;
  }

  function hexToRgb(hex){
    const clean =
      String(hex || "")
        .replace("#","")
        .trim();

    if(!/^[0-9a-f]{6}$/i.test(clean)){
      return null;
    }

    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }

  function mix(rgb,target,amount){
    const clamp = n =>
      Math.max(
        0,
        Math.min(
          255,
          Math.round(n)
        )
      );

    return (
      "#" +
      [
        clamp(rgb.r+(target.r-rgb.r)*amount),
        clamp(rgb.g+(target.g-rgb.g)*amount),
        clamp(rgb.b+(target.b-rgb.b)*amount)
      ]
        .map(v=>
          v.toString(16).padStart(2,"0")
        )
        .join("")
    );
  }

  function rgba(rgb,a){
    return (
      "rgba(" +
      rgb.r + "," +
      rgb.g + "," +
      rgb.b + "," +
      a +
      ")"
    );
  }

  function apply(profile){
    const title =
      document.getElementById(
        "ma7alak-about-title"
      );

    if(!title){
      return;
    }

    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};

    const fallback =
      safeHex(
        options.story_color ||
        options.card_color,
        "#f2caed"
      );

    const color =
      safeHex(
        options.about_title_color,
        fallback
      );

    const mode =
      String(
        options.about_title_animation ||
        "current"
      )
        .trim()
        .toLowerCase();

    const rgb =
      hexToRgb(color) ||
      {
        r:242,
        g:202,
        b:237
      };

    const light =
      mix(
        rgb,
        {r:255,g:255,b:255},
        .48
      );

    const soft =
      mix(
        rgb,
        {r:255,g:255,b:255},
        .20
      );

    let style =
      document.getElementById(
        "m7-about-title-live-style"
      );

    if(!style){
      style =
        document.createElement(
          "style"
        );

      style.id =
        "m7-about-title-live-style";

      document.head.appendChild(
        style
      );
    }

    let modeCss = "";

    if(mode === "shimmer"){
      modeCss = `
        animation:m7AdminAboutTitleShimmer 3.4s ease-in-out infinite!important;
        -webkit-animation:m7AdminAboutTitleShimmer 3.4s ease-in-out infinite!important;
      `;
    }
    else if(mode === "glow"){
      modeCss = `
        background:none!important;
        color:${color}!important;
        -webkit-text-fill-color:${color}!important;
        animation:m7AdminAboutTitleGlow 2.1s ease-in-out infinite!important;
        -webkit-animation:m7AdminAboutTitleGlow 2.1s ease-in-out infinite!important;
      `;
    }
    else if(mode === "breathe"){
      modeCss = `
        background:none!important;
        color:${color}!important;
        -webkit-text-fill-color:${color}!important;
        animation:m7AdminAboutTitleBreathe 2.6s ease-in-out infinite!important;
        -webkit-animation:m7AdminAboutTitleBreathe 2.6s ease-in-out infinite!important;
      `;
    }
    else if(mode === "none"){
      modeCss = `
        background:none!important;
        color:${color}!important;
        -webkit-text-fill-color:${color}!important;
        animation:none!important;
        -webkit-animation:none!important;
      `;
    }

    style.textContent = `
      @keyframes m7AdminAboutTitleShimmer{
        from{background-position:120% 50%}
        to{background-position:-120% 50%}
      }

      @-webkit-keyframes m7AdminAboutTitleShimmer{
        from{background-position:120% 50%}
        to{background-position:-120% 50%}
      }

      @keyframes m7AdminAboutTitleGlow{
        0%,100%{
          text-shadow:
            0 0 5px ${rgba(rgb,.24)},
            0 2px 10px rgba(0,0,0,.45);
        }
        50%{
          text-shadow:
            0 0 13px ${rgba(rgb,.80)},
            0 0 22px ${rgba(rgb,.34)},
            0 2px 10px rgba(0,0,0,.45);
        }
      }

      @-webkit-keyframes m7AdminAboutTitleGlow{
        0%,100%{
          text-shadow:
            0 0 5px ${rgba(rgb,.24)},
            0 2px 10px rgba(0,0,0,.45);
        }
        50%{
          text-shadow:
            0 0 13px ${rgba(rgb,.80)},
            0 0 22px ${rgba(rgb,.34)},
            0 2px 10px rgba(0,0,0,.45);
        }
      }

      @keyframes m7AdminAboutTitleBreathe{
        0%,100%{transform:scale(1);opacity:.94}
        50%{transform:scale(1.035);opacity:1}
      }

      @-webkit-keyframes m7AdminAboutTitleBreathe{
        0%,100%{-webkit-transform:scale(1);opacity:.94}
        50%{-webkit-transform:scale(1.035);opacity:1}
      }

      html body .zee-about-card #ma7alak-about-title{
        background:
          linear-gradient(
            105deg,
            ${light} 0%,
            ${soft} 24%,
            #ffffff 39%,
            ${color} 52%,
            ${light} 72%,
            #ffffff 100%
          )!important;

        background-size:280% 100%!important;

        -webkit-background-clip:text!important;
        background-clip:text!important;

        color:transparent!important;
        -webkit-text-fill-color:transparent!important;

        filter:
          drop-shadow(
            0 3px 10px
            rgba(0,0,0,.30)
          )!important;

        ${modeCss}
      }
    `;
  }

  async function load(){
    const slug =
      String(
        window.__MA7ALAK_EXACT_HUB_SLUG__ ||
        document
          .getElementById(
            "ma7alak-shop-profile-hub-mount"
          )
          ?.getAttribute(
            "data-shop-slug"
          ) ||
        ""
      )
        .trim()
        .toLowerCase();

    const client =
      window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;

    if(
      !slug ||
      !client
    ){
      return;
    }

    const result =
      await client
        .from("shop_profiles")
        .select(
          "shop_slug,directory_options"
        )
        .eq(
          "shop_slug",
          slug
        )
        .maybeSingle();

    if(
      !result.error &&
      result.data
    ){
      apply(result.data);
    }
  }

  async function start(){
    for(let i=0;i<120;i++){
      if(
        document.getElementById(
          "ma7alak-about-title"
        ) &&
        window.__MA7ALAK_EXACT_HUB_REST_CLIENT__
      ){
        break;
      }

      await new Promise(resolve=>
        setTimeout(resolve,50)
      );
    }

    await load();

    if(
      typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
        "function"
    ){
      window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
        load
      );
    }
  }

  start().catch(error=>
    console.warn(
      "[ShoufHon Hub] About title style:",
      error
    )
  );

})();


/* =========================================================
   SHOUFHON PROFILE HUB — PAGE DESIGN STUDIO LIVE RUNTIME
   Uses directory_options saved from Admin.
========================================================= */
(function(){
  "use strict";

  if(window.__MA7ALAK_HUB_DS_V2_AUTHORITATIVE__){
    return;
  }

  if(window.__MA7ALAK_HUB_PAGE_DESIGN_STUDIO__){
    return;
  }

  window.__MA7ALAK_HUB_PAGE_DESIGN_STUDIO__ = true;

  function safeHex(value,fallback){
    const raw = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(raw) ? raw : fallback;
  }

  function hexToRgb(hex){
    const clean = String(hex || "").trim().replace("#","");
    if(!/^[0-9a-f]{6}$/i.test(clean)) return null;
    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }

  function mix(rgb,target,amount){
    const clamp = n => Math.max(0,Math.min(255,Math.round(n)));
    return "#" + [
      clamp(rgb.r+(target.r-rgb.r)*amount),
      clamp(rgb.g+(target.g-rgb.g)*amount),
      clamp(rgb.b+(target.b-rgb.b)*amount)
    ].map(v=>v.toString(16).padStart(2,"0")).join("");
  }

  function rgba(rgb,a){
    return "rgba("+rgb.r+","+rgb.g+","+rgb.b+","+a+")";
  }

  function symbol(kind,custom){
    const own = String(custom || "").trim();
    if(kind === "custom" && own) return own.slice(0,5);
    return ({diamond:"◆",star:"★",sparkle:"✦",dot:"•",none:""}[kind] || "◆");
  }

  function lineBackground(style,color,rgbaColor){
    if(style === "solid") return color;
    if(style === "double"){
      return "linear-gradient(to bottom,"+color+" 0 1px,transparent 1px 2px,"+color+" 2px 3px)";
    }
    if(style === "dotted"){
      return "radial-gradient(circle,"+color+" 0 1.2px,transparent 1.4px) 0 50% / 7px 3px repeat-x";
    }
    return "linear-gradient(90deg,transparent 0%,"+rgbaColor+" 28%,"+color+" 52%,"+rgbaColor+" 70%,transparent 100%)";
  }

  function apply(profile){
    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};

    const universal = safeHex(options.story_color || options.card_color,"#f2caed");

    const useUniversal =
      options.page_use_universal_accent === undefined
        ? true
        : (
            options.page_use_universal_accent === true ||
            String(options.page_use_universal_accent).toLowerCase() === "true"
          );

    const accent =
      useUniversal
        ? universal
        : safeHex(options.hub_accent_color,universal);

    const rgb = hexToRgb(accent) || {r:242,g:202,b:237};
    const light = mix(rgb,{r:255,g:255,b:255},.44);
    const dark = mix(rgb,{r:0,g:0,b:0},.42);

    const preset =
      String(options.page_design_preset || "premium")
        .trim()
        .toLowerCase();

    const motionMode =
      String(options.page_motion_mode || "preset")
        .trim()
        .toLowerCase();

    const motionOff =
      motionMode === "off" ||
      (
        motionMode === "preset" &&
        (preset === "basic" || preset === "minimal")
      );

    const motionSubtle = motionMode === "subtle";

    function picked(key,fallback){
      return useUniversal ? accent : safeHex(options[key],fallback || accent);
    }

    const kickerColor = picked("about_kicker_color",accent);
    const ornamentColor = picked("about_ornament_color",accent);

    const serviceText =
      useUniversal
        ? "#ffffff"
        : safeHex(options.about_service_text_color,"#ffffff");

    const serviceBorder = picked("about_service_border_color",accent);
    const serviceIcon = picked("about_service_icon_color",accent);
    const signatureColor = picked("about_signature_color",accent);
    const bodyText = safeHex(options.about_text_color,"#ffffff");

    const panelBg =
      safeHex(
        options.about_panel_bg_color,
        preset === "basic" ? "#17130d" : "#141014"
      );

    const panelBorder = picked("about_panel_border_color",accent);

    const contentBg =
      safeHex(
        options.about_content_bg_color,
        preset === "basic" ? "#15130f" : "#161316"
      );

    const contentBorder = safeHex(options.about_content_border_color,"#453b43");
    const serviceBg = safeHex(options.about_service_bg_color,"#151215");

    const ornamentStyle =
      String(
        options.about_ornament_style ||
        (preset === "minimal" ? "solid" : "fade")
      )
        .trim()
        .toLowerCase();

    const ornamentSymbol =
      symbol(
        String(options.about_ornament_symbol || "diamond").trim().toLowerCase(),
        options.about_ornament_symbol_text
      );

    const ornamentRgb = hexToRgb(ornamentColor) || rgb;

    const ornamentBg =
      lineBackground(
        ornamentStyle,
        ornamentColor,
        rgba(ornamentRgb,.58)
      );

    const center = document.querySelector(".zee-center-symbol");
    if(center) center.textContent = ornamentSymbol;

    const root = document.documentElement;

    root.style.setProperty("--m7-shop-accent",accent);
    root.style.setProperty("--m7-shop-accent-rgb",rgb.r+","+rgb.g+","+rgb.b);
    root.style.setProperty("--m7-shop-accent-light",light);
    root.style.setProperty("--m7-shop-accent-soft",mix(rgb,{r:255,g:255,b:255},.16));
    root.style.setProperty("--m7-shop-accent-dark",dark);
    root.style.setProperty("--m7-exact-shell-accent-rgb",rgb.r+","+rgb.g+","+rgb.b);

    let style = document.getElementById("m7-hub-page-design-studio");
    if(!style){
      style = document.createElement("style");
      style.id = "m7-hub-page-design-studio";
      document.head.appendChild(style);
    }

    const staticCss =
      motionOff
        ? `
            html body #ma7alak-exact-merged-hub .zee-line,
            html body #ma7alak-exact-merged-hub .zee-line::after,
            html body #ma7alak-exact-merged-hub .zee-center-symbol,
            html body #ma7alak-exact-merged-hub .zee-title-word,
            html body #ma7alak-exact-merged-hub .zee-title-sparkle,
            html body #ma7alak-exact-merged-hub .zee-about-card,
            html body #ma7alak-exact-merged-hub .ma7alak-about-floating-sparkles span,
            html body #ma7alak-exact-merged-hub .zee-service-icon,
            html body #ma7alak-exact-merged-hub .zee-signature-text,
            html body #ma7alak-exact-merged-hub .ma7alak-location-section::before,
            html body #ma7alak-exact-merged-hub .ma7alak-info-row::before,
            html body #ma7alak-exact-merged-hub .ma7alak-location-icon,
            html body #ma7alak-exact-merged-hub .ma7alak-clock-icon,
            html body #ma7alak-exact-merged-hub #ma7alak-online-eye{
              animation:none!important;
              -webkit-animation:none!important;
            }

            html body #ma7alak-exact-merged-hub .zee-line::after,
            html body #ma7alak-exact-merged-hub .zee-title-sparkle,
            html body #ma7alak-exact-merged-hub #ma7alak-about-floating-sparkles{
              display:none!important;
            }
          `
        : "";

    const subtleCss =
      motionSubtle
        ? `
            html body #ma7alak-exact-merged-hub .zee-line,
            html body #ma7alak-exact-merged-hub .zee-title-word,
            html body #ma7alak-exact-merged-hub .zee-center-symbol,
            html body #ma7alak-exact-merged-hub .zee-service-icon{
              animation-duration:5s!important;
              -webkit-animation-duration:5s!important;
            }
          `
        : "";

    const basicCss =
      preset === "basic"
        ? `
            html body #ma7alak-exact-merged-hub .zee-about-card{
              box-shadow:0 12px 30px rgba(0,0,0,.28)!important;
              backdrop-filter:none!important;
              -webkit-backdrop-filter:none!important;
            }

            html body #ma7alak-exact-merged-hub .zee-about-glow{
              display:none!important;
            }
          `
        : "";

    style.textContent = `
      html body #ma7alak-exact-merged-hub .zee-about-card{
        border-color:${panelBorder}!important;
        background:
          linear-gradient(
            145deg,
            ${panelBg},
            #090909
          )!important;
      }

      html body #ma7alak-exact-merged-hub .zee-about-content{
        border-color:${contentBorder}!important;
        background:
          linear-gradient(
            145deg,
            ${contentBg},
            rgba(8,8,8,.96)
          )!important;
      }

      html body #ma7alak-exact-merged-hub .zee-kicker{
        color:${kickerColor}!important;
      }

      html body #ma7alak-exact-merged-hub #ma7alak-about-title{
        ${motionOff ? "animation:none!important;-webkit-animation:none!important;" : ""}
      }

      html body #ma7alak-exact-merged-hub .zee-line{
        ${ornamentStyle === "none" ? "display:none!important;" : ""}
        height:${ornamentStyle === "double" ? "3px" : "2px"}!important;
        background:${ornamentBg}!important;
        box-shadow:0 0 6px ${rgba(ornamentRgb,.18)}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-center-symbol{
        display:${ornamentSymbol ? "inline-block" : "none"}!important;
        color:${ornamentColor}!important;
        text-shadow:0 0 8px ${rgba(ornamentRgb,.48)}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-about-text{
        color:${bodyText}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-service-pill{
        color:${serviceText}!important;
        border-color:${serviceBorder}!important;
        background:
          linear-gradient(
            145deg,
            ${serviceBg},
            rgba(8,8,8,.96)
          )!important;
      }

      html body #ma7alak-exact-merged-hub .zee-service-icon{
        color:${serviceIcon}!important;
        border-color:${serviceIcon}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-signature-text{
        color:${signatureColor}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-signature-line{
        background:
          linear-gradient(
            90deg,
            transparent,
            ${signatureColor},
            transparent
          )!important;
      }

      html body #ma7alak-exact-merged-hub::before{
        border-color:${rgba(rgb,.26)}!important;
      }

      ${staticCss}
      ${subtleCss}
      ${basicCss}
    `;
  }

  async function load(){
    const slug =
      String(
        window.__MA7ALAK_EXACT_HUB_SLUG__ ||
        document
          .getElementById("ma7alak-shop-profile-hub-mount")
          ?.getAttribute("data-shop-slug") ||
        ""
      )
        .trim()
        .toLowerCase();

    const client = window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;

    if(!slug || !client){
      return;
    }

    const result =
      await client
        .from("shop_profiles")
        .select("shop_slug,directory_options")
        .eq("shop_slug",slug)
        .maybeSingle();

    if(!result.error && result.data){
      apply(result.data);
    }
  }

  async function start(){
    for(let i=0;i<120;i++){
      if(
        document.getElementById("ma7alak-about-title") &&
        window.__MA7ALAK_EXACT_HUB_REST_CLIENT__
      ){
        break;
      }

      await new Promise(resolve=>setTimeout(resolve,50));
    }

    await load();

    if(
      typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ === "function"
    ){
      window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(load);
    }
  }

  start().catch(error=>
    console.warn("[ShoufHon Hub] Design Studio:",error)
  );

})();


/* =========================================================
   SHOUFHON PROFILE HUB — PAGE DESIGN STUDIO V2 ADDON LOADER
========================================================= */
(function(){
  "use strict";

  if(window.__MA7ALAK_HUB_DS_V2_LOADER__){
    return;
  }

  window.__MA7ALAK_HUB_DS_V2_LOADER__ = true;

  const current = document.currentScript;

  if(
    !current ||
    !current.src
  ){
    return;
  }

  const base =
    current.src.slice(
      0,
      current.src.lastIndexOf("/") + 1
    );

  const script =
    document.createElement("script");

  script.src =
    base +
    "ma7alak-hub-design-studio-v2.js";

  script.async = false;

  document.head.appendChild(script);

})();


/* =========================================================
   SHOUFHON PROFILE HUB — INDIVIDUAL ABOUT TEXT STYLE V1
   ---------------------------------------------------------
   Per-text Admin controls:
   - Kicker
   - About title
   - Arabic name
   - Description
   - Signature
   - Service labels 1–4

   Existing About module typography remains the fallback.
========================================================= */
(function(){
"use strict";

if(window.__MA7ALAK_ABOUT_INDIVIDUAL_TEXT_RUNTIME_V1__)return;
window.__MA7ALAK_ABOUT_INDIVIDUAL_TEXT_RUNTIME_V1__=true;

const FONT_STACKS={
  system:'"Segoe UI",Arial,Helvetica,sans-serif',
  modern:'"Trebuchet MS","Segoe UI",Arial,sans-serif',
  elegant:'Georgia,"Times New Roman",serif',
  classic:'"Times New Roman",Georgia,serif',
  mono:'"Courier New",Courier,monospace'
};

function safeHex(value,fallback){
  const raw=String(value||"").trim();
  return /^#[0-9a-f]{6}$/i.test(raw)?raw:fallback;
}

function percent(value,min,max,fallback){
  const n=Number(value);
  return Number.isFinite(n)
    ? Math.max(min,Math.min(max,n))
    : fallback;
}

function fontFamily(value){
  const mode=String(value||"current").trim().toLowerCase();
  return FONT_STACKS[mode]||"";
}

function resolvedFamily(options,key){
  let mode=String(options["about_"+key+"_font_style"]||"inherit").trim().toLowerCase();

  if(mode==="inherit"){
    mode=String(options.about_font_style||"inherit").trim().toLowerCase();
  }

  if(mode==="inherit"){
    mode=String(options.global_font_style||"current").trim().toLowerCase();
  }

  return {
    mode,
    family:fontFamily(mode)
  };
}

function rawBaseSize(el){
  if(!el)return 0;

  const genericBase=Number(el.dataset.m7BaseFontSize);
  if(Number.isFinite(genericBase)&&genericBase>0){
    return genericBase;
  }

  let base=Number(el.dataset.m7IndividualAboutBaseSize);

  if(!Number.isFinite(base)||base<=0){
    const current=parseFloat(getComputedStyle(el).fontSize);
    if(!Number.isFinite(current)||current<=0)return 0;
    base=current;
    el.dataset.m7IndividualAboutBaseSize=String(base);
  }

  return base;
}

function styleText(el,options,key,colorKey,fallbackColor){
  if(!el)return;

  const resolved=resolvedFamily(options,key);

  if(resolved.family){
    el.style.setProperty("font-family",resolved.family,"important");
  }else if(resolved.mode==="current"){
    el.style.removeProperty("font-family");
  }

  const base=rawBaseSize(el);

  const globalScale=
    percent(options.global_font_size,70,150,100)/100;

  const aboutScale=
    percent(options.about_font_size,70,150,100)/100;

  const individualScale=
    percent(options["about_"+key+"_font_size"],60,200,100)/100;

  if(base>0){
    el.style.setProperty(
      "font-size",
      (base*globalScale*aboutScale*individualScale).toFixed(2)+"px",
      "important"
    );
  }

  if(colorKey){
    const color=safeHex(options[colorKey],fallbackColor||"#ffffff");

    /*
      Animated text fill is owned by the Design Studio V2 runtime.
      A solid inline -webkit-text-fill-color would kill Shimmer on mobile.
    */
    const arabicMode=
      String(options.arabic_name_animation||"none")
        .trim()
        .toLowerCase();

    const signatureShimmer=
      options.about_fx_signature_shimmer===true ||
      String(options.about_fx_signature_shimmer).toLowerCase()==="true";

    const animatedFill=
      key==="title" ||
      (
        key==="arabic" &&
        arabicMode!=="none"
      ) ||
      (
        key==="signature" &&
        signatureShimmer
      );

    if(!animatedFill){
      el.style.setProperty("color",color,"important");
      el.style.setProperty("-webkit-text-fill-color",color,"important");
    }else{
      el.style.removeProperty("color");
      el.style.removeProperty("-webkit-text-fill-color");
    }
  }
}

function apply(profile){
  const options=
    profile &&
    profile.directory_options &&
    typeof profile.directory_options==="object"
      ? profile.directory_options
      : {};

  const accent=safeHex(
    options.story_color||options.card_color,
    "#f2caed"
  );

  styleText(
    document.getElementById("ma7alak-about-kicker"),
    options,
    "kicker",
    "about_kicker_color",
    accent
  );

  styleText(
    document.getElementById("ma7alak-about-title"),
    options,
    "title",
    "about_title_color",
    accent
  );

  styleText(
    document.getElementById("ma7alak-about-arabic-name"),
    options,
    "arabic",
    "about_arabic_color",
    safeHex(options.arabic_name_color,"#ffffff")
  );

  styleText(
    document.getElementById("ma7alak-about-text"),
    options,
    "body",
    "about_text_color",
    "#ffffff"
  );

  styleText(
    document.getElementById("ma7alak-about-signature"),
    options,
    "signature",
    "about_signature_color",
    accent
  );

  for(let i=1;i<=4;i++){
    const label=document.querySelector(
      '.zee-service-pill[data-about-service-index="'+i+'"] .zee-service-label'
    );

    if(!label)continue;

    const key="service_"+i;
    const colorKey="about_service_"+i+"_color";

    styleText(
      label,
      options,
      key,
      colorKey,
      safeHex(options.about_service_text_color,"#ffffff")
    );
  }
}

async function load(){
  const slug=String(
    window.__MA7ALAK_EXACT_HUB_SLUG__||
    document.getElementById("ma7alak-shop-profile-hub-mount")?.getAttribute("data-shop-slug")||
    ""
  ).trim().toLowerCase();

  const client=window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;

  if(!slug||!client)return;

  const result=await client
    .from("shop_profiles")
    .select("shop_slug,directory_options")
    .eq("shop_slug",slug)
    .maybeSingle();

  if(result.error||!result.data)return;

  apply(result.data);

  /*
    The external Design Studio V2 loader may finish a fraction later.
    Reapply only the individual text overrides after it settles.
  */
  window.setTimeout(()=>apply(result.data),140);
  window.setTimeout(()=>apply(result.data),420);
}

async function start(){
  for(let i=0;i<160;i++){
    if(
      document.getElementById("ma7alak-about-title") &&
      window.__MA7ALAK_EXACT_HUB_REST_CLIENT__
    ){
      break;
    }

    await new Promise(resolve=>setTimeout(resolve,50));
  }

  await load();

  if(
    typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__==="function"
  ){
    window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(load);
  }
}

start().catch(error=>
  console.warn("[ShoufHon Hub] individual About text:",error)
);
})();


