/* =========================================================
   SHOUFHON OPENING HEADER — GITHUB / CUSTOM CODE VERSION
   V5 — VISUAL TOP PLACEMENT UNDER FIXED PREMIUM HEADER + TRANSPARENT BACKGROUND

   POSITION options:
   "under-premium"   -> directly under Premium Panel
   "top-page"        -> first item in body
   "before-stats"    -> before live stats when found
   "before-happening"-> before Happening Today when found

   Default: under-premium
========================================================= */
(function () {
  "use strict";

  if (window.self !== window.top) return;

  /* =========================================================
     HOMEPAGE ONLY
     Allowed:
       https://shoufhon.com/
       https://www.shoufhon.com/
     Blocked:
       /admin
       /doze-3ale
       /masaya-cafe
       /shwf-almhlat-
       /dhyf-mhlk-
       and every other page/path.
  ========================================================= */
  const MA7ALAK_HOME_HOST = (window.location.hostname || "")
    .toLowerCase()
    .replace(/^www\./, "");

  const MA7ALAK_HOME_PATH =
    (window.location.pathname || "/").replace(/\/+$/, "") || "/";

  if (
    MA7ALAK_HOME_HOST !== "shoufhon.com" ||
    MA7ALAK_HOME_PATH !== "/"
  ) {
    return;
  }

  if (window.__MA7ALAK_OPENING_HEADER_V5__) return;
  window.__MA7ALAK_OPENING_HEADER_V5__ = true;

  const ma7alakOpeningJoinFix = document.createElement("style");
  ma7alakOpeningJoinFix.id = "ma7alak-opening-join-four-corners-fix";
  ma7alakOpeningJoinFix.textContent = `
/* =========================================================
   V7 FINAL MOBILE JOIN + FOUR-CORNER FIX
   - Tiny visual gap below the fixed Premium Header.
   - Same radius on all four Opening Header corners.
   - Clip image/content inside the rounded hero.
========================================================= */
#ma7alak-opening-header-root{
  margin-top:7px!important;
  padding-top:0!important;
}

#ma7alak-opening-header-root .ma7alak-ultra-hero{
  border-radius:22px!important;
  overflow:hidden!important;
  clip-path:inset(0 round 22px)!important;
  -webkit-mask-image:-webkit-radial-gradient(white,black)!important;
  isolation:isolate!important;
}

#ma7alak-opening-header-root .ma7alak-ultra-hero::before,
#ma7alak-opening-header-root .ma7alak-ultra-hero::after{
  border-radius:inherit!important;
}

#ma7alak-opening-header-root .ma7alak-ultra-hero img,
#ma7alak-opening-header-root .ma7alak-ultra-hero video,
#ma7alak-opening-header-root .ma7alak-ultra-hero picture,
#ma7alak-opening-header-root .ma7alak-ultra-hero canvas{
  border-radius:inherit!important;
}

@media (max-width:900px){
  #ma7alak-opening-header-root .ma7alak-ultra-hero{
    border-radius:18px!important;
    clip-path:inset(0 round 18px)!important;
  }
}
`;
  document.head.appendChild(ma7alakOpeningJoinFix);

  const POSITION = "under-premium";
  const ROOT_ID = "ma7alak-opening-header-root";
  const HOME_BLOCK_ID = "shoufhon-homepage-content-block";
  const HERO_IMAGE_URL = "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/2.0%20shuf.jfif";

  function primeOpeningHeroImage(){
    if(window.__M7_OPENING_HERO_PRIMED__)return;
    window.__M7_OPENING_HERO_PRIMED__=true;

    try{
      const link=document.createElement("link");
      link.rel="preload";
      link.as="image";
      link.href=HERO_IMAGE_URL;
      link.setAttribute("fetchpriority","high");
      link.dataset.m7OpeningHeroPreload="1";
      (document.head||document.documentElement).appendChild(link);
    }catch(_){}

    try{
      const image=new Image();
      image.fetchPriority="high";
      image.decoding="async";
      image.src=HERO_IMAGE_URL;
      window.__M7_OPENING_HERO_WARM_IMAGE__=image;
    }catch(_){}
  }

  primeOpeningHeroImage();
  let homepageBlock = null;
  let openingRootRef = null;
  let openingGlobalEventsBound = false;
  let openingResizeObserver = null;

  function ensureHomepageBlock(){
    const body=document.body;
    if(!body)return null;

    if(!homepageBlock){
      homepageBlock=document.getElementById(HOME_BLOCK_ID)||document.createElement("div");
      homepageBlock.id=HOME_BLOCK_ID;
      Object.assign(homepageBlock.style,{
        display:"block",
        width:"100%",
        maxWidth:"100%",
        margin:"0",
        padding:"0",
        position:"relative",
        background:"transparent",
        backgroundColor:"transparent",
        boxSizing:"border-box"
      });
    }

    /* One permanent owner for Opening Header + Live Offers + Reels.
       Never mount any of these inside the footer or scan for a background. */
    const host=document.querySelector("main");
    if(host){
      if(homepageBlock.parentNode!==host||host.firstElementChild!==homepageBlock){
        host.insertBefore(homepageBlock,host.firstElementChild);
      }
    }else if(homepageBlock.parentNode!==body){
      const firstReal=Array.from(body.children).find(el=>
        el!==homepageBlock &&
        el.id!=="ma7alak-social-header" &&
        el.id!=="ma7alak-header-theme-backdrop" &&
        el.tagName!=="SCRIPT" &&
        el.tagName!=="STYLE"
      );
      if(firstReal)body.insertBefore(homepageBlock,firstReal);
      else body.prepend(homepageBlock);
    }

    return homepageBlock;
  }

  window.Ma7alakHomepageBlock={
    id:HOME_BLOCK_ID,
    ensure:ensureHomepageBlock
  };

  /* =========================================================
     FULL-WIDTH OPENING HEADER BACKGROUND
     - Solid black behind the homepage image header.
     - The actual hero image/card remains unchanged.
     - Hero/card remains aligned to the Premium Panel.
  ========================================================= */
  const ma7alakFullWidthBg = document.createElement("style");
  ma7alakFullWidthBg.id = "ma7alak-opening-fullwidth-user-background";
  ma7alakFullWidthBg.textContent = `
    #${ROOT_ID} {
      position: relative !important;
      overflow: visible !important;
      isolation: isolate !important;
      background: transparent !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
    }

    #${ROOT_ID}::before {
      content: "" !important;
      position: absolute !important;
      z-index: -1 !important;
      top: 0 !important;
      bottom: 0 !important;
      left: 50% !important;
      width: 100vw !important;
      transform: translateX(-50%) !important;
      pointer-events: none !important;
      background:#000 !important;\n      background-image:none !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
    }

    /* Remove the extra bottom band/layer seen in the screenshot. */
    #${ROOT_ID} .ma7alak-ultra-hero {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      position: relative !important;
      z-index: 1 !important;
    }
  `;
  (document.head || document.documentElement).appendChild(ma7alakFullWidthBg);


  const MARKUP = "<!-- =========================================================\n     SHOUFHON COMPACT PREMIUM OPENING HEADER\n     IMAGE + TITLE + FUNCTION BUTTONS\n========================================================= -->\n\n<section class=\"ma7alak-ultra-hero\" aria-label=\"ShoufHon\">\n\n  <img\n    class=\"ma7alak-ultra-hero-image\"\n    src=\"https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/2.0%20shuf.jfif\"\n    alt=\"\"\n    aria-hidden=\"true\"\n    decoding=\"async\"\n    fetchpriority=\"high\"\n  >\n\n  <div class=\"ma7alak-ultra-hero-image-polish\"></div>\n  <div class=\"ma7alak-ultra-hero-vignette\"></div>\n  <div class=\"ma7alak-ultra-hero-spotlight\"></div>\n\n  <div class=\"ma7alak-ultra-hero-frame\" aria-hidden=\"true\"></div>\n\n  <div class=\"ma7alak-ultra-hero-content\">\n\n    <div class=\"ma7alak-ultra-kicker\">\n      <span class=\"ma7alak-ultra-kicker-dot\"></span>\n      <span>SHOUFHON</span>\n    </div>\n\n\n    <p class=\"ma7alak-ultra-subtitle ma7alak-platform-line\">\n      \u0645\u0634 \u0628\u0633 \u0635\u0641\u062d\u0629...\u0645\u0646\u0635\u0629\n    </p>\n\n    <!-- =====================================================\n         FUNCTION BUTTONS \u2014 SAME DESTINATIONS / SAME BEHAVIOR\n    ====================================================== -->\n    <div class=\"ma7alak-hero-buttons\">\n\n      <!-- \u0636\u064a\u0641 \u0645\u062d\u0644\u0643 -->\n      <a\n        href=\"https://shoufhon.com/dhyf-mhlk-\"\n        class=\"ma7alak-btn ma7alak-btn-primary\"\n        aria-label=\"\u0636\u064a\u0641 \u0645\u062d\u0644\u0643\"\n        onclick=\"window.top.location.href='https://shoufhon.com/dhyf-mhlk-'; return false;\"\n      >\n        <span class=\"ma7alak-btn-icon plus-icon\">\u2795\ufe0f</span>\n        <span class=\"ma7alak-btn-text\">\u0636\u064a\u0641 \u0645\u062d\u0644\u0643</span>\n      </a>\n\n      <!-- \u0634\u0648\u0641 \u0627\u0644\u0645\u062d\u0644\u0651\u0627\u062a -->\n      <a\n        href=\"https://shoufhon.com/shwf-almhlat-\"\n        class=\"ma7alak-btn ma7alak-btn-secondary\"\n        aria-label=\"\u0634\u0648\u0641 \u0627\u0644\u0645\u062d\u0644\u0651\u0627\u062a\"\n        onclick=\"window.top.location.href='https://shoufhon.com/shwf-almhlat-'; return false;\"\n      >\n        <span class=\"ma7alak-btn-text\">\u0634\u0648\u0641 \u0627\u0644\u0645\u062d\u0644\u0651\u0627\u062a</span>\n        <span class=\"ma7alak-btn-icon eye-icon\">\ud83d\udc41\ufe0f</span>\n      </a>\n\n    </div>\n\n    <div class=\"ma7alak-ultra-scroll-cue\" aria-hidden=\"true\">\n      <span></span>\n    </div>\n\n  </div>\n\n</section>\n\n\n<style>\n\n/* =========================================================\n   HERO FOUNDATION\n========================================================= */\n\n.ma7alak-ultra-hero {\n  --m7-gold:#e7b95d;\n  --m7-gold-2:#ffd27a;\n  --m7-orange:#ff9800;\n  --m7-ink:#07090d;\n\n  position:relative;\n\n  width:min(1180px,calc(100% - 18px));\n  height:clamp(540px,78vh,820px);\n  min-height:540px;\n\n  margin:8px auto 22px;\n\n  overflow:hidden;\n  isolation:isolate;\n\n  border-radius:30px;\n\n  background:#07090d;\n\n  border:\n    1px solid rgba(231,185,93,.26);\n\n  /* Outer shadow box removed \u2014 keep only the subtle inner edge */\n  box-shadow:\n    0 0 0 1px rgba(255,255,255,.025) inset;\n\n  font-family:\n    Inter,\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    Tahoma,\n    Arial,\n    sans-serif;\n\n  direction:rtl;\n\n  -webkit-font-smoothing:antialiased;\n  text-rendering:optimizeLegibility;\n}\n\n\n/* =========================================================\n   BACKGROUND IMAGE\n========================================================= */\n\n.ma7alak-ultra-hero-image {\n  position:absolute;\n  inset:0;\n  z-index:-10;\n\n  width:100%;\n  height:100%;\n\n  object-fit:cover;\n  object-position:center 48%;\n\n  transform:scale(1.02);\n\n  filter:\n    saturate(1.08)\n    contrast(1.06)\n    brightness(.92);\n\n  animation:\n    ma7alakHeroImageIn\n    1.2s\n    cubic-bezier(.22,1,.36,1)\n    both;\n}\n\n\n.ma7alak-ultra-hero-image-polish {\n  position:absolute;\n  inset:0;\n  z-index:-9;\n\n  background:\n    linear-gradient(\n      180deg,\n      rgba(3,5,9,.12) 0%,\n      rgba(3,5,9,.04) 30%,\n      rgba(4,6,10,.12) 46%,\n      rgba(5,7,10,.58) 72%,\n      rgba(5,7,10,.92) 100%\n    );\n}\n\n\n.ma7alak-ultra-hero-vignette {\n  position:absolute;\n  inset:0;\n  z-index:-8;\n\n  background:\n    radial-gradient(\n      ellipse at 50% 44%,\n      transparent 24%,\n      rgba(0,0,0,.04) 48%,\n      rgba(0,0,0,.42) 100%\n    );\n}\n\n\n.ma7alak-ultra-hero-spotlight {\n  position:absolute;\n  left:50%;\n  bottom:-8%;\n  z-index:-7;\n\n  width:82%;\n  height:48%;\n\n  transform:translateX(-50%);\n\n  background:\n    radial-gradient(\n      ellipse,\n      rgba(217,157,56,.22) 0%,\n      rgba(217,157,56,.08) 34%,\n      transparent 72%\n    );\n\n  filter:blur(26px);\n  pointer-events:none;\n}\n\n\n/* =========================================================\n   PREMIUM FRAME\n========================================================= */\n\n.ma7alak-ultra-hero-frame {\n  position:absolute;\n  inset:10px;\n  z-index:2;\n\n  border-radius:22px;\n\n  border:\n    1px solid rgba(255,210,122,.10);\n\n  pointer-events:none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,.018);\n}\n\n\n.ma7alak-ultra-hero-frame::before,\n.ma7alak-ultra-hero-frame::after {\n  content:\"\";\n\n  position:absolute;\n  left:50%;\n\n  width:180px;\n  height:1px;\n\n  transform:translateX(-50%);\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255,210,122,.55),\n      transparent\n    );\n}\n\n\n.ma7alak-ultra-hero-frame::before {\n  top:-1px;\n}\n\n\n.ma7alak-ultra-hero-frame::after {\n  bottom:-1px;\n}\n\n\n/* =========================================================\n   CONTENT\n========================================================= */\n\n.ma7alak-ultra-hero-content {\n  position:absolute;\n  left:0;\n  right:0;\n  bottom:0;\n  z-index:5;\n\n  display:flex;\n  flex-direction:column;\n  align-items:center;\n\n  padding:\n    92px\n    clamp(18px,5vw,72px)\n    40px;\n\n  text-align:center;\n\n  background:\n    linear-gradient(\n      180deg,\n      transparent 0%,\n      rgba(4,6,9,.08) 14%,\n      rgba(4,6,9,.44) 45%,\n      rgba(4,6,9,.78) 73%,\n      rgba(4,6,9,.94) 100%\n    );\n}\n\n\n/* =========================================================\n   SHOUFHON KICKER\n========================================================= */\n\n.ma7alak-ultra-kicker {\n  display:inline-flex;\n  align-items:center;\n  justify-content:center;\n\n  gap:9px;\n\n  min-height:31px;\n\n  padding:6px 14px;\n\n  margin-bottom:13px;\n\n  border-radius:999px;\n\n  color:#ffd38a;\n\n  background:\n    rgba(8,10,13,.62);\n\n  border:\n    1px solid rgba(231,185,93,.28);\n\n  box-shadow:\n    0 8px 24px rgba(0,0,0,.26),\n    inset 0 1px 0 rgba(255,255,255,.035);\n\n  backdrop-filter:blur(11px);\n  -webkit-backdrop-filter:blur(11px);\n\n  font-size:9px;\n  font-weight:900;\n  letter-spacing:2.4px;\n\n  animation:\n    ma7alakHeroContentIn\n    .72s\n    .08s\n    cubic-bezier(.22,1,.36,1)\n    both;\n}\n\n\n.ma7alak-ultra-kicker-dot {\n  width:7px;\n  height:7px;\n\n  border-radius:50%;\n\n  background:#ffad32;\n\n  box-shadow:\n    0 0 0 3px rgba(255,173,50,.10),\n    0 0 12px rgba(255,173,50,.66);\n\n  animation:\n    ma7alakKickerPulse\n    2.2s\n    ease-in-out\n    infinite;\n}\n\n\n/* =========================================================\n   TITLE\n========================================================= */\n\n.ma7alak-ultra-title {\n  margin:0;\n\n  max-width:950px;\n\n  display:flex;\n  flex-direction:column;\n  align-items:center;\n\n  font-size:\n    clamp(38px,5.4vw,68px);\n\n  line-height:1.13;\n\n  font-weight:950;\n\n  letter-spacing:-1.5px;\n\n  text-shadow:\n    0 4px 18px rgba(0,0,0,.72),\n    0 1px 2px rgba(0,0,0,.92);\n\n  animation:\n    ma7alakHeroContentIn\n    .86s\n    .16s\n    cubic-bezier(.22,1,.36,1)\n    both;\n}\n\n\n.ma7alak-ultra-title-white {\n  color:#fff;\n}\n\n\n.ma7alak-ultra-title-gold {\n  position:relative;\n\n  margin-top:4px;\n\n  color:#f0bc5d;\n\n  text-shadow:\n    0 4px 18px rgba(0,0,0,.72),\n    0 0 22px rgba(217,157,56,.13);\n}\n\n\n.ma7alak-ultra-title-gold::after {\n  content:\"\";\n\n  position:absolute;\n\n  left:9%;\n  right:9%;\n  bottom:-9px;\n\n  height:3px;\n\n  border-radius:999px;\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(231,185,93,.56),\n      #ffd27a,\n      rgba(231,185,93,.56),\n      transparent\n    );\n\n  box-shadow:\n    0 0 12px rgba(217,157,56,.34);\n\n  animation:\n    ma7alakHeroUnderline\n    3.1s\n    ease-in-out\n    infinite;\n}\n\n\n/* =========================================================\n   SUBTITLE\n========================================================= */\n\n.ma7alak-ultra-subtitle {\n  margin:\n    20px 0 0;\n\n  color:\n    rgba(255,255,255,.90);\n\n  font-size:\n    clamp(13px,1.5vw,17px);\n\n  line-height:1.55;\n\n  font-weight:600;\n\n  text-shadow:\n    0 2px 10px rgba(0,0,0,.82);\n\n  animation:\n    ma7alakHeroContentIn\n    .86s\n    .24s\n    cubic-bezier(.22,1,.36,1)\n    both;\n}\n\n\n/* =========================================================\n   SHOUFHON PLATFORM LINE \u2014 UNIQUE ANIMATED GOLD\n========================================================= */\n\n.ma7alak-platform-line {\n  position:relative;\n  display:inline-block;\n  width:auto;\n  max-width:100%;\n  margin-top:0!important;\n  color:#ffd36f!important;\n  font-size:clamp(18px,2.6vw,27px)!important;\n  font-weight:900!important;\n  line-height:1.45!important;\n  letter-spacing:.1px;\n  background:linear-gradient(100deg,#b97a20 0%,#ffd36f 22%,#fff0b0 42%,#d99a32 58%,#fff3bd 76%,#c88725 100%);\n  background-size:240% 100%;\n  -webkit-background-clip:text;\n  background-clip:text;\n  -webkit-text-fill-color:transparent;\n  filter:drop-shadow(0 2px 8px rgba(0,0,0,.82));\n  text-shadow:none!important;\n  animation:ma7alakPlatformGoldFlow 3.4s linear infinite,ma7alakPlatformGoldPulse 2.4s ease-in-out infinite!important;\n}\n\n.ma7alak-platform-line::after {\n  content:\"\";\n  position:absolute;\n  left:12%;\n  right:12%;\n  bottom:-5px;\n  height:2px;\n  border-radius:999px;\n  background:linear-gradient(90deg,transparent,rgba(231,185,93,.22),#ffd36f,rgba(255,239,174,.95),#d99a32,transparent);\n  background-size:220% 100%;\n  box-shadow:0 0 8px rgba(255,204,92,.35),0 0 16px rgba(217,154,50,.16);\n  animation:ma7alakPlatformLineFlow 2.8s linear infinite;\n}\n\n@keyframes ma7alakPlatformGoldFlow {\n  0%{background-position:200% 50%;}\n  100%{background-position:-40% 50%;}\n}\n\n@keyframes ma7alakPlatformGoldPulse {\n  0%,100%{filter:drop-shadow(0 2px 8px rgba(0,0,0,.82)) drop-shadow(0 0 2px rgba(231,185,93,.12));}\n  50%{filter:drop-shadow(0 2px 8px rgba(0,0,0,.82)) drop-shadow(0 0 8px rgba(255,211,111,.42));}\n}\n\n@keyframes ma7alakPlatformLineFlow {\n  0%{background-position:200% 50%;opacity:.58;}\n  50%{opacity:1;}\n  100%{background-position:-20% 50%;opacity:.58;}\n}\n\n/* =====================================================\n   FUNCTION BUTTONS \u2014 PREMIUM HERO VERSION\n===================================================== */\n\n.ma7alak-hero-buttons {\n  display:flex;\n  justify-content:center;\n  align-items:center;\n\n  gap:13px;\n\n  margin-top:24px;\n\n  direction:rtl;\n\n  animation:\n    ma7alakHeroContentIn\n    .86s\n    .32s\n    cubic-bezier(.22,1,.36,1)\n    both;\n}\n\n\n.ma7alak-btn {\n  position:relative;\n\n  height:52px;\n  min-width:158px;\n\n  padding:0 22px;\n\n  display:inline-flex;\n  align-items:center;\n  justify-content:center;\n\n  gap:9px;\n\n  box-sizing:border-box;\n\n  border-radius:999px;\n\n  text-decoration:none!important;\n\n  font-family:\n    Tahoma,\n    Arial,\n    sans-serif;\n\n  font-size:15px;\n  font-weight:800;\n\n  line-height:1.4;\n\n  overflow:hidden;\n\n  cursor:pointer;\n\n  border-width:1px;\n  border-style:solid;\n\n  -webkit-tap-highlight-color:transparent;\n  -webkit-touch-callout:none;\n\n  outline:none!important;\n\n  transform:translateZ(0);\n\n  transition:\n    transform .20s ease,\n    background .24s ease,\n    border-color .24s ease,\n    box-shadow .24s ease;\n}\n\n\n.ma7alak-btn:focus,\n.ma7alak-btn:focus-visible,\n.ma7alak-btn:active {\n  outline:none!important;\n}\n\n\n.ma7alak-btn-primary {\n  color:#151515;\n\n  background:\n    linear-gradient(\n      135deg,\n      #f0c873 0%,\n      #dda646 52%,\n      #c88a2f 100%\n    );\n\n  border-color:\n    rgba(255,220,151,.88);\n\n  box-shadow:\n    0 10px 28px rgba(0,0,0,.34),\n    0 0 22px rgba(214,165,72,.12),\n    inset 0 1px 0 rgba(255,255,255,.34);\n}\n\n\n.ma7alak-btn-secondary {\n  color:#f0c56c;\n\n  background:\n    linear-gradient(\n      180deg,\n      rgba(16,18,21,.70),\n      rgba(9,11,14,.62)\n    );\n\n  border-color:\n    rgba(220,170,75,.66);\n\n  box-shadow:\n    0 10px 28px rgba(0,0,0,.32),\n    inset 0 1px 0 rgba(255,255,255,.035);\n\n  backdrop-filter:blur(9px);\n  -webkit-backdrop-filter:blur(9px);\n}\n\n\n.ma7alak-btn-text {\n  display:inline-block;\n\n  white-space:nowrap;\n\n  position:relative;\n  z-index:5;\n}\n\n\n.ma7alak-btn-icon {\n  display:inline-flex;\n  align-items:center;\n  justify-content:center;\n\n  flex-shrink:0;\n\n  line-height:1;\n\n  position:relative;\n  z-index:5;\n\n  transform-origin:center;\n}\n\n\n.plus-icon {\n  font-size:16px;\n}\n\n\n.eye-icon {\n  font-size:18px;\n}\n\n\n.ma7alak-btn::before {\n  content:\"\";\n\n  position:absolute;\n  inset:1px;\n\n  border-radius:inherit;\n\n  pointer-events:none;\n\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255,255,255,.08),\n      transparent 42%\n    );\n\n  opacity:.55;\n}\n\n\n.ma7alak-btn::after {\n  content:\"\";\n\n  position:absolute;\n\n  top:0;\n  left:-120%;\n\n  width:55%;\n  height:100%;\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255,255,255,.24),\n      transparent\n    );\n\n  transform:skewX(-20deg);\n\n  pointer-events:none;\n\n  z-index:2;\n\n  opacity:0;\n}\n\n\n.ma7alak-btn:hover {\n  transform:translateY(-2px);\n}\n\n\n.ma7alak-btn-primary:hover {\n  border-color:#f5d18a;\n\n  background:\n    linear-gradient(\n      135deg,\n      #f4d184,\n      #e1ad51,\n      #cf9136\n    );\n\n  box-shadow:\n    0 14px 34px rgba(0,0,0,.36),\n    0 0 26px rgba(214,165,72,.20);\n}\n\n\n.ma7alak-btn-secondary:hover {\n  color:#ffd37f;\n\n  background:\n    linear-gradient(\n      180deg,\n      rgba(46,37,24,.54),\n      rgba(14,15,18,.72)\n    );\n\n  border-color:#e5b45a;\n\n  box-shadow:\n    0 14px 34px rgba(0,0,0,.34),\n    0 0 24px rgba(214,165,72,.13);\n}\n\n\n.ma7alak-btn:active {\n  transform:translateY(0) scale(.985);\n\n  box-shadow:\n    0 4px 12px rgba(0,0,0,.35)!important;\n}\n\n\n/* =========================================================\n   SCROLL CUE\n========================================================= */\n\n.ma7alak-ultra-scroll-cue {\n  margin-top:18px;\n\n  width:28px;\n  height:28px;\n\n  display:flex;\n  align-items:center;\n  justify-content:center;\n\n  opacity:.58;\n\n  animation:\n    ma7alakHeroContentIn\n    .8s\n    .42s\n    cubic-bezier(.22,1,.36,1)\n    both;\n}\n\n\n.ma7alak-ultra-scroll-cue span {\n  width:7px;\n  height:7px;\n\n  border-right:\n    1.5px solid rgba(255,210,122,.72);\n\n  border-bottom:\n    1.5px solid rgba(255,210,122,.72);\n\n  transform:rotate(45deg);\n\n  animation:\n    ma7alakScrollCue\n    1.6s\n    ease-in-out\n    infinite;\n}\n\n\n/* =========================================================\n   ANIMATION\n========================================================= */\n\n@keyframes ma7alakHeroImageIn {\n  from {\n    opacity:.35;\n    transform:scale(1.075);\n  }\n\n  to {\n    opacity:1;\n    transform:scale(1.02);\n  }\n}\n\n\n@keyframes ma7alakHeroContentIn {\n  from {\n    opacity:0;\n    transform:translateY(18px);\n  }\n\n  to {\n    opacity:1;\n    transform:translateY(0);\n  }\n}\n\n\n@keyframes ma7alakHeroUnderline {\n  0%,\n  100% {\n    opacity:.46;\n    transform:scaleX(.72);\n  }\n\n  50% {\n    opacity:1;\n    transform:scaleX(1);\n  }\n}\n\n\n@keyframes ma7alakKickerPulse {\n  0%,\n  100% {\n    opacity:.58;\n    transform:scale(.9);\n  }\n\n  50% {\n    opacity:1;\n    transform:scale(1.08);\n  }\n}\n\n\n@keyframes ma7alakScrollCue {\n  0%,\n  100% {\n    opacity:.35;\n    transform:\n      translateY(-2px)\n      rotate(45deg);\n  }\n\n  50% {\n    opacity:1;\n    transform:\n      translateY(4px)\n      rotate(45deg);\n  }\n}\n\n\n/* =========================================================\n   MOBILE\n========================================================= */\n\n@media(max-width:600px) {\n\n  .ma7alak-ultra-hero {\n    width:calc(100% - 10px);\n\n    height:\n      min(78vh,720px);\n\n    min-height:570px;\n\n    margin:\n      5px auto 17px;\n\n    border-radius:22px;\n  }\n\n\n  .ma7alak-ultra-hero-frame {\n    inset:7px;\n    border-radius:17px;\n  }\n\n\n  .ma7alak-ultra-hero-image {\n    object-position:center 44%;\n  }\n\n\n  .ma7alak-ultra-hero-content {\n    padding:\n      96px\n      14px\n      24px;\n  }\n\n\n  .ma7alak-ultra-kicker {\n    min-height:27px;\n\n    padding:\n      5px 12px;\n\n    margin-bottom:10px;\n\n    font-size:8px;\n  }\n\n\n  .ma7alak-ultra-title {\n    font-size:\n      clamp(29px,9vw,40px);\n\n    line-height:1.18;\n\n    letter-spacing:-.7px;\n  }\n\n\n  .ma7alak-ultra-title-gold::after {\n    bottom:-6px;\n    height:2px;\n  }\n\n\n  .ma7alak-ultra-subtitle {\n    margin-top:16px;\n\n    font-size:12px;\n\n    font-weight:650;\n  }\n\n\n  .ma7alak-hero-buttons {\n    width:100%;\n\n    gap:9px;\n\n    margin-top:20px;\n  }\n\n\n  .ma7alak-btn {\n    flex:1;\n\n    min-width:0;\n\n    max-width:172px;\n\n    height:48px;\n\n    padding:\n      0 13px;\n\n    font-size:13.5px;\n\n    gap:6px;\n  }\n\n\n  .plus-icon {\n    font-size:15px;\n  }\n\n\n  .eye-icon {\n    font-size:17px;\n  }\n\n\n  .ma7alak-ultra-scroll-cue {\n    margin-top:13px;\n  }\n\n}\n\n\n/* =========================================================\n   VERY SMALL PHONES\n========================================================= */\n\n@media(max-width:370px) {\n\n  .ma7alak-ultra-hero {\n    height:660px;\n    min-height:550px;\n  }\n\n\n  .ma7alak-ultra-hero-content {\n    padding:\n      88px\n      10px\n      21px;\n  }\n\n\n  .ma7alak-ultra-title {\n    font-size:27px;\n  }\n\n\n  .ma7alak-ultra-subtitle {\n    font-size:11px;\n  }\n\n\n  .ma7alak-hero-buttons {\n    gap:7px;\n  }\n\n\n  .ma7alak-btn {\n    height:46px;\n\n    padding:\n      0 10px;\n\n    font-size:12.5px;\n  }\n\n}\n\n\n/* =========================================================\n   REDUCED MOTION\n========================================================= */\n\n@media(prefers-reduced-motion:reduce) {\n\n  .ma7alak-ultra-hero *,\n  .ma7alak-ultra-hero::before,\n  .ma7alak-ultra-hero::after {\n    animation:none!important;\n    transition:none!important;\n  }\n\n}\n\n\n/* =========================================================\n   SHOUFHON COMPACT OPENING HEADER \u2014 V1\n   Keeps the original hero/details/functions, but turns the\n   section into a short opening header under the premium panel.\n========================================================= */\n\n.ma7alak-ultra-hero{\n  width:min(1180px,calc(100% - 18px))!important;\n  height:430px!important;\n  min-height:430px!important;\n  margin:4px auto 16px!important;\n  border-radius:24px!important;\n}\n\n.ma7alak-ultra-hero-image{\n  object-fit:cover!important;\n  object-position:center 43%!important;\n  transform:scale(1.01)!important;\n}\n\n.ma7alak-ultra-hero-image-polish{\n  background:\n    linear-gradient(\n      180deg,\n      rgba(3,5,9,.05) 0%,\n      rgba(3,5,9,.03) 25%,\n      rgba(4,6,10,.12) 48%,\n      rgba(4,6,9,.66) 78%,\n      rgba(4,6,9,.94) 100%\n    )!important;\n}\n\n.ma7alak-ultra-hero-vignette{\n  background:\n    radial-gradient(\n      ellipse at 50% 40%,\n      transparent 30%,\n      rgba(0,0,0,.03) 56%,\n      rgba(0,0,0,.34) 100%\n    )!important;\n}\n\n.ma7alak-ultra-hero-spotlight{\n  height:42%!important;\n  bottom:-12%!important;\n}\n\n.ma7alak-ultra-hero-frame{\n  inset:8px!important;\n  border-radius:17px!important;\n}\n\n.ma7alak-ultra-hero-content{\n  padding:54px 22px 22px!important;\n}\n\n.ma7alak-ultra-kicker{\n  min-height:25px!important;\n  padding:4px 11px!important;\n  margin-bottom:8px!important;\n  font-size:8px!important;\n}\n\n.ma7alak-ultra-title{\n  font-size:clamp(27px,4.1vw,43px)!important;\n  line-height:1.13!important;\n}\n\n.ma7alak-ultra-subtitle{\n  margin-top:12px!important;\n  font-size:12px!important;\n}\n\n.ma7alak-hero-buttons{\n  margin-top:15px!important;\n  gap:9px!important;\n}\n\n.ma7alak-btn{\n  height:44px!important;\n  min-height:44px!important;\n  padding:0 16px!important;\n  font-size:13px!important;\n}\n\n.ma7alak-ultra-scroll-cue{\n  margin-top:8px!important;\n}\n\n/* PHONE \u2014 compact opening header, not a full-screen hero */\n@media(max-width:600px){\n  .ma7alak-ultra-hero{\n    width:calc(100% - 8px)!important;\n    height:390px!important;\n    min-height:390px!important;\n    margin:3px auto 13px!important;\n    border-radius:19px!important;\n  }\n\n  .ma7alak-ultra-hero-image{\n    object-position:center 41%!important;\n  }\n\n  .ma7alak-ultra-hero-frame{\n    inset:6px!important;\n    border-radius:14px!important;\n  }\n\n  .ma7alak-ultra-hero-content{\n    padding:48px 11px 17px!important;\n  }\n\n  .ma7alak-ultra-kicker{\n    min-height:22px!important;\n    padding:3px 9px!important;\n    margin-bottom:7px!important;\n    font-size:7.5px!important;\n  }\n\n  .ma7alak-ultra-title{\n    font-size:clamp(24px,7.7vw,32px)!important;\n    line-height:1.12!important;\n    letter-spacing:-.4px!important;\n  }\n\n  .ma7alak-ultra-subtitle{\n    margin-top:10px!important;\n    font-size:10.5px!important;\n  }\n\n  .ma7alak-hero-buttons{\n    width:100%!important;\n    gap:7px!important;\n    margin-top:13px!important;\n  }\n\n  .ma7alak-btn{\n    flex:1!important;\n    max-width:155px!important;\n    height:41px!important;\n    min-height:41px!important;\n    padding:0 9px!important;\n    font-size:12px!important;\n    gap:5px!important;\n  }\n\n  .plus-icon{font-size:14px!important;}\n  .eye-icon{font-size:16px!important;}\n\n  .ma7alak-ultra-scroll-cue{\n    margin-top:6px!important;\n  }\n}\n\n@media(max-width:370px){\n  .ma7alak-ultra-hero{\n    height:365px!important;\n    min-height:365px!important;\n  }\n\n  .ma7alak-ultra-hero-content{\n    padding:42px 9px 15px!important;\n  }\n\n  .ma7alak-ultra-title{\n    font-size:23px!important;\n  }\n\n  .ma7alak-ultra-subtitle{\n    font-size:10px!important;\n  }\n\n  .ma7alak-btn{\n    height:39px!important;\n    min-height:39px!important;\n    font-size:11.5px!important;\n  }\n}\n\n\n/* =========================================================\n   SHOUFHON COMPACT HEADER V2 \u2014 PREMIUM PANEL ALIGNMENT\n   - Same left/right mobile margin as premium panel\n   - Removes SHOUFHON glowing badge/kicker under the eye\n========================================================= */\n.ma7alak-ultra-kicker{display:none!important;}\n\n@media(max-width:600px){\n  .ma7alak-ultra-hero{\n    width:calc(100% - 28px)!important;\n    max-width:none!important;\n    margin:4px 14px 13px!important;\n  }\n  .ma7alak-ultra-hero-content{\n    padding-top:44px!important;\n  }\n}\n\n@media(max-width:370px){\n  .ma7alak-ultra-hero{\n    width:calc(100% - 24px)!important;\n    margin-left:12px!important;\n    margin-right:12px!important;\n  }\n}\n</style>";
  const ORIGINAL_BEHAVIOR = "(function () {\n\n  /* =====================================================\n     FIND BUTTONS\n  ===================================================== */\n\n  const buttons =\n    document.querySelectorAll(\".ma7alak-btn\");\n\n  if (!buttons.length) return;\n\n\n  /* =====================================================\n     ANIMATION TIMER\n  ===================================================== */\n\n  let startTime =\n    performance.now();\n\n\n  /* =====================================================\n     MAIN ANIMATION\n  ===================================================== */\n\n  function animate(time) {\n\n    const elapsed =\n      (time - startTime) / 1000;\n\n\n    buttons.forEach(function(button, index) {\n\n      const isPrimary =\n        button.classList.contains(\n          \"ma7alak-btn-primary\"\n        );\n\n\n      const plus =\n        button.querySelector(\n          \".plus-icon\"\n        );\n\n\n      const eye =\n        button.querySelector(\n          \".eye-icon\"\n        );\n\n\n      /* =================================================\n         BUTTON GLOW\n         Faster and slightly more noticeable\n      ================================================= */\n\n      const glow =\n        (Math.sin(\n          elapsed * 2.6 + index\n        ) + 1) / 2;\n\n\n      if (isPrimary) {\n\n        const shadow =\n          16 + glow * 11;\n\n        const opacity =\n          0.08 + glow * 0.20;\n\n\n        button.style.boxShadow =\n          \"0 5px \" +\n          shadow +\n          \"px rgba(0,0,0,.30),\" +\n\n          \"0 0 15px rgba(214,165,72,\" +\n          opacity +\n          \")\";\n\n      } else {\n\n        const shadow =\n          16 + glow * 10;\n\n        const opacity =\n          0.07 + glow * 0.16;\n\n\n        button.style.boxShadow =\n          \"0 5px \" +\n          shadow +\n          \"px rgba(0,0,0,.28),\" +\n\n          \"0 0 15px rgba(214,165,72,\" +\n          opacity +\n          \")\";\n\n      }\n\n\n      /* =================================================\n         PLUS\n         \n         OLD:\n         ~3.2 second cycle\n\n         NEW:\n         ~1.8 second cycle\n\n         So the animation appears much sooner.\n      ================================================= */\n\n      if (plus) {\n\n        const cycle =\n          (elapsed + index * 0.3) % 1.8;\n\n\n        let scale = 1;\n        let rotate = 0;\n\n\n        /*\n         Start animation quickly\n        */\n\n        if (\n          cycle > 0.55 &&\n          cycle < 0.82\n        ) {\n\n          const p =\n            (cycle - 0.55) / 0.27;\n\n\n          scale =\n            1 +\n            Math.sin(\n              p * Math.PI\n            ) * 0.20;\n\n\n          rotate =\n            Math.sin(\n              p * Math.PI\n            ) * -7;\n\n        }\n\n\n        plus.style.transform =\n          \"scale(\" +\n          scale +\n          \") rotate(\" +\n          rotate +\n          \"deg)\";\n\n      }\n\n\n      /* =================================================\n         EYE\n         \n         OLD:\n         ~4 second cycle\n\n         NEW:\n         ~2.2 second cycle\n\n         Much faster blinking / looking.\n      ================================================= */\n\n      if (eye) {\n\n        const eyeCycle =\n          (elapsed + 0.4) % 2.2;\n\n\n        let scaleY = 1;\n        let moveX = 0;\n\n\n        /*\n         -----------------------------------------------\n         BLINK\n         -----------------------------------------------\n        */\n\n        if (\n          eyeCycle > 0.55 &&\n          eyeCycle < 0.76\n        ) {\n\n          const p =\n            (eyeCycle - 0.55) / 0.21;\n\n\n          scaleY =\n            1 -\n            Math.sin(\n              p * Math.PI\n            ) * 0.80;\n\n        }\n\n\n        /*\n         -----------------------------------------------\n         LOOK LEFT / RIGHT\n         -----------------------------------------------\n        */\n\n        if (\n          eyeCycle > 1.05 &&\n          eyeCycle < 1.65\n        ) {\n\n          const p =\n            (eyeCycle - 1.05) / 0.60;\n\n\n          moveX =\n            Math.sin(\n              p * Math.PI * 2\n            ) * 2.5;\n\n        }\n\n\n        eye.style.transform =\n          \"translateX(\" +\n          moveX +\n          \"px) \" +\n\n          \"scaleY(\" +\n          scaleY +\n          \")\";\n\n      }\n\n\n      /* =================================================\n         SHIMMER\n         \n         Slightly faster than before\n      ================================================= */\n\n      const shineCycle =\n        (elapsed + index * 1.4) % 4.5;\n\n\n      if (\n        shineCycle > 2.5 &&\n        shineCycle < 3.5\n      ) {\n\n        const p =\n          (shineCycle - 2.5) / 1;\n\n\n        button.style.setProperty(\n          \"--ma7alak-shine\",\n          (p * 250 - 120) + \"%\"\n        );\n\n\n        button.style.setProperty(\n          \"--ma7alak-shine-opacity\",\n          \"1\"\n        );\n\n      } else {\n\n        button.style.setProperty(\n          \"--ma7alak-shine\",\n          \"-120%\"\n        );\n\n\n        button.style.setProperty(\n          \"--ma7alak-shine-opacity\",\n          \"0\"\n        );\n\n      }\n\n    });\n\n\n    requestAnimationFrame(\n      animate\n    );\n\n  }\n\n\n  requestAnimationFrame(\n    animate\n  );\n\n\n  /* =====================================================\n     SHIMMER CSS\n  ===================================================== */\n\n  const style =\n    document.createElement(\"style\");\n\n\n  style.innerHTML = `\n\n    .ma7alak-btn::after {\n\n      left:\n        var(--ma7alak-shine, -120%)\n        !important;\n\n      opacity:\n        var(--ma7alak-shine-opacity, 0);\n\n      transition:\n        none !important;\n\n    }\n\n  `;\n\n\n  document.head.appendChild(style);\n\n\n})();";

  function findPremiumPanel() {
    return document.querySelector(
      "#ma7alak-social-header, .ma7alak-social-header, [data-ma7alak-premium-header]"
    );
  }

  function findStats() {
    return document.querySelector(
      "#ma7alak-live-stats, .ma7alak-live-stats, .ma7alak-stats, [data-ma7alak-stats]"
    );
  }

  function findHappening() {
    const candidates = Array.from(document.querySelectorAll("section,div"));
    return candidates.find(el => /Happening Today/i.test(el.textContent || "")) || null;
  }

  function placeRoot(root) {
    const block=ensureHomepageBlock();
    if(!block)return false;

    /* Header is always the first child of the permanent homepage block.
       Live/Reels is mounted immediately after it by the bundled feed module. */
    if(root.parentNode!==block||block.firstElementChild!==root){
      block.insertBefore(root,block.firstElementChild);
    }

    return true;
  }

  function syncWidth() {
    const root = document.getElementById(ROOT_ID);
    const hero = root && root.querySelector(".ma7alak-ultra-hero");
    const premium = findPremiumPanel();
    if (!root || !hero || !premium) return;

    const r = premium.getBoundingClientRect();
    if (r.width > 0) {
      root.style.width = r.width + "px";
      root.style.maxWidth = r.width + "px";
      hero.style.setProperty("width", "100%", "important");
      hero.style.setProperty("max-width", "100%", "important");
      hero.style.setProperty("margin-left", "0", "important");
      hero.style.setProperty("margin-right", "0", "important");
    }
  }

  function boot() {
    if (!document.body) return;

    /* Reuse the SAME header node if Hostinger temporarily removed it.
       This preserves the existing header animation DOM and avoids duplicate
       animation loops/listeners from recreating the component. */
    let root =
      document.getElementById(ROOT_ID) ||
      openingRootRef;

    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.innerHTML = MARKUP;

      Object.assign(root.style, {
        display: "block",
        boxSizing: "border-box",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "0",
        marginBottom: "0",
        padding: "0",
        position: "relative",
        zIndex: "2",
        background: "transparent",
        backgroundColor: "transparent"
      });

      /* This component must never create a white Hostinger-style box. */
      if(!document.getElementById("ma7alak-opening-transparent-fix")){
        const transparentFix = document.createElement("style");
        transparentFix.id = "ma7alak-opening-transparent-fix";
        transparentFix.textContent = `
          #${ROOT_ID},
          #${ROOT_ID} > *,
          #${ROOT_ID} .ma7alak-ultra-hero {
            background-color: transparent !important;
          }
          #${ROOT_ID} {
            padding: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
          }
        `;
        document.head.appendChild(transparentFix);
      }
    }

    openingRootRef = root;

    if (!placeRoot(root)) return;

    syncWidth();

    /* ORIGINAL_BEHAVIOR is initialized once for this exact DOM node.
       Reattaching after a Hostinger refresh does not duplicate animations. */
    if(root.dataset.m7OpeningBehaviorInit!=="1"){
      root.dataset.m7OpeningBehaviorInit="1";
      try {
        if (ORIGINAL_BEHAVIOR) (new Function(ORIGINAL_BEHAVIOR))();
      } catch (err) {
        root.dataset.m7OpeningBehaviorInit="";
        console.error("[ShoufHon Opening Header] animation init:", err);
      }
    }

    if(!openingGlobalEventsBound){
      openingGlobalEventsBound=true;
      window.addEventListener("resize", syncWidth, {passive:true});
      window.addEventListener("orientationchange", syncWidth, {passive:true});
    }

    if ("ResizeObserver" in window) {
      const premium = findPremiumPanel();
      if (premium) {
        try{
          openingResizeObserver?.disconnect?.();
        }catch(_){}
        openingResizeObserver = new ResizeObserver(syncWidth);
        openingResizeObserver.observe(premium);
      }
    }
  }

  function ensureOpeningHeaderAlive(){
    if(document.hidden)return;

    const block=ensureHomepageBlock();
    if(!block)return;

    let root =
      document.getElementById(ROOT_ID) ||
      openingRootRef;

    /* If the node never existed, boot creates it.
       Otherwise reattach the SAME node if Hostinger detached it. */
    if(!root){
      boot();
      return;
    }

    openingRootRef=root;

    if(
      root.parentNode!==block ||
      block.firstElementChild!==root
    ){
      block.insertBefore(root,block.firstElementChild);
    }

    syncWidth();
  }

  if(!window.__SHOUFHON_HOME_BLOCK_KEEPER__){
    window.__SHOUFHON_HOME_BLOCK_KEEPER__=setInterval(
      ensureOpeningHeaderAlive,
      1200
    );

    window.addEventListener(
      "pageshow",
      ensureOpeningHeaderAlive
    );

    window.addEventListener(
      "focus",
      ensureOpeningHeaderAlive
    );

    document.addEventListener(
      "visibilitychange",
      ()=>{
        if(document.visibilityState==="visible"){
          ensureOpeningHeaderAlive();
          setTimeout(ensureOpeningHeaderAlive,120);
          setTimeout(ensureOpeningHeaderAlive,600);
        }
      }
    );
  }

  let tries = 0;
  const timer = setInterval(function () {
    tries++;

    if (findPremiumPanel()) {
      clearInterval(timer);
      boot();
      return;
    }

    if (tries >= 80) {
      clearInterval(timer);
      boot();
    }
  }, 100);

})();

/* Homepage Stories live inside the Opening Header and share follow/story state with the rest of ShoufHon. */
(function(){
  "use strict";
  if(window.__shoufhonHomeStoriesTray)return;
  window.__shoufhonHomeStoriesTray=true;
  if(location.pathname.replace(/\/+$/,'') && !/^\/(?:home|index)?$/i.test(location.pathname.replace(/\/+$/,'')))return;
  const url="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const key="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const storyScriptSrc=document.currentScript?.src||"";
  let storyViewerPromise=null;
  let client,slugs=[],owner=null,rows=[],profiles=new Map(),timer=0,expiryTimer=0,version=0,channel=null,storyBus=null,playing=[],index=0,mediaTimer=0,viewerOpen=false;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const path=s=>'/'+encodeURIComponent(s);
  function db(){return client||(client=window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||window.Ma7alakSupabase?.client||window.supabase?.createClient?.(url,key));}
  function mount(){
    const host=document.getElementById('ma7alak-opening-header-root');
    if(!host)return null;
    let root=document.getElementById('shoufhon-home-stories');
    if(!root){
      root=document.createElement('section');
      root.id='shoufhon-home-stories';
      root.hidden=true;
      root.setAttribute('aria-label','Stories from shops you follow');
    }
    if(!document.getElementById('shoufhon-home-stories-style')){
      const style=document.createElement('style');
      style.id='shoufhon-home-stories-style';
      style.textContent=`
#shoufhon-home-stories{box-sizing:border-box;width:min(1180px,calc(100% - 18px));max-width:100%;margin:0 auto 8px;padding:4px 2px 9px;position:relative;z-index:20;overflow:visible;border:0;border-radius:0;background:transparent;box-shadow:none;color:#f7dfaa;font:600 12px Arial,sans-serif}
#shoufhon-home-stories[hidden]{display:none!important}
#shoufhon-home-stories::after{content:"";display:block;height:1px;margin:5px 8px 0;background:linear-gradient(90deg,transparent,rgba(217,164,65,.26),transparent);pointer-events:none}
#shoufhon-home-stories .shs-list{display:flex;align-items:flex-start;gap:13px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;padding:7px 5px 9px;scrollbar-width:none}
#shoufhon-home-stories .shs-list::-webkit-scrollbar{display:none}
#shoufhon-home-stories .shs-item{--shs-story-color:#e3b85f;--shs-story-speed:2.2s;--shs-story-glow:18px;--shs-story-opacity:.82;--shs-vip-c1:#e3b85f;--shs-vip-c2:#d9a441;--shs-vip-c3:#fff;--shs-vip-width:4px;--shs-vip-speed:5s;flex:0 0 70px;width:70px;display:flex;align-items:center;flex-direction:column;gap:6px;text-align:center;color:#f6e5c4;scroll-snap-align:start;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
#shoufhon-home-stories .shs-circle-wrap{position:relative;width:66px;height:66px;flex:0 0 66px}
#shoufhon-home-stories .shs-circle-button{display:block;width:66px;height:66px;margin:0;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
#shoufhon-home-stories .shs-circle-button[aria-disabled="true"]{cursor:default}
#shoufhon-home-stories .shs-ring{position:relative;display:block;width:66px;height:66px;padding:3px;border-radius:50%;box-sizing:border-box;background:#16110d;isolation:isolate;box-shadow:0 0 0 1px rgba(217,164,65,.12);transform:translateZ(0)}
#shoufhon-home-stories .shs-ring::before,#shoufhon-home-stories .shs-ring::after{content:"";position:absolute;inset:0;z-index:0;border-radius:50%;box-sizing:border-box;pointer-events:none}
#shoufhon-home-stories .shs-ring::before{background:#68635e}
#shoufhon-home-stories .shs-ring img,#shoufhon-home-stories .shs-fallback{position:relative;z-index:2;display:grid;place-items:center;width:100%;height:100%;object-fit:cover;border:3px solid #080808;box-sizing:border-box;border-radius:50%;background:#201814;color:#fff;font-size:21px}
#shoufhon-home-stories .shs-empty .shs-ring::before{background:none;border:2px solid color-mix(in srgb,var(--shs-story-color) 68%,#3e3e3e);box-shadow:0 0 9px color-mix(in srgb,var(--shs-story-color) 18%,transparent)}
#shoufhon-home-stories .shs-unseen .shs-ring::before{opacity:var(--shs-story-opacity)}
#shoufhon-home-stories .shs-unseen[data-story-effect="premium"] .shs-ring::before,#shoufhon-home-stories .shs-unseen[data-story-effect="shimmer"] .shs-ring::before,#shoufhon-home-stories .shs-unseen[data-story-effect="sparkle"] .shs-ring::before,#shoufhon-home-stories .shs-unseen[data-story-effect="comet"] .shs-ring::before,#shoufhon-home-stories .shs-unseen[data-story-effect="neon-wave"] .shs-ring::before{background:conic-gradient(from 0deg,transparent 0 15%,var(--shs-story-color) 31%,#fff 47%,var(--shs-story-color) 63%,transparent 83%);animation:shsStorySpin var(--shs-story-speed) linear infinite;-webkit-animation:shsStorySpin var(--shs-story-speed) linear infinite;will-change:transform}
#shoufhon-home-stories .shs-unseen[data-story-effect="glow"] .shs-ring::before,#shoufhon-home-stories .shs-unseen[data-story-effect="soft"] .shs-ring::before{background:none;border:3px solid var(--shs-story-color);box-shadow:0 0 var(--shs-story-glow) color-mix(in srgb,var(--shs-story-color) 72%,transparent);animation:shsStoryGlow var(--shs-story-speed) ease-in-out infinite;-webkit-animation:shsStoryGlow var(--shs-story-speed) ease-in-out infinite}
#shoufhon-home-stories .shs-unseen[data-story-effect="heartbeat"] .shs-ring::before{background:none;border:3px solid var(--shs-story-color);box-shadow:0 0 var(--shs-story-glow) color-mix(in srgb,var(--shs-story-color) 58%,transparent)}
#shoufhon-home-stories .shs-unseen[data-story-effect="heartbeat"] .shs-ring{animation:shsStoryHeartbeat var(--shs-story-speed) ease-in-out infinite;-webkit-animation:shsStoryHeartbeat var(--shs-story-speed) ease-in-out infinite}
#shoufhon-home-stories .shs-unseen[data-story-effect="radar"] .shs-ring::before,#shoufhon-home-stories .shs-unseen[data-story-effect="halo"] .shs-ring::before{background:none;border:3px solid var(--shs-story-color);box-shadow:0 0 var(--shs-story-glow) color-mix(in srgb,var(--shs-story-color) 56%,transparent)}
#shoufhon-home-stories .shs-unseen[data-story-effect="radar"] .shs-ring::after,#shoufhon-home-stories .shs-unseen[data-story-effect="halo"] .shs-ring::after{inset:-3px;border:2px solid var(--shs-story-color);animation:shsStoryRadar var(--shs-story-speed) ease-out infinite;-webkit-animation:shsStoryRadar var(--shs-story-speed) ease-out infinite}
#shoufhon-home-stories .shs-unseen[data-story-effect="halo"] .shs-ring::before{animation:shsStoryHalo var(--shs-story-speed) ease-in-out infinite;-webkit-animation:shsStoryHalo var(--shs-story-speed) ease-in-out infinite}
#shoufhon-home-stories .shs-unseen[data-story-effect="neon-wave"] .shs-ring{filter:drop-shadow(0 0 7px var(--shs-story-color));animation:shsStoryNeon calc(var(--shs-story-speed) * .72) ease-in-out infinite;-webkit-animation:shsStoryNeon calc(var(--shs-story-speed) * .72) ease-in-out infinite}
#shoufhon-home-stories .shs-unseen[data-story-effect="none"] .shs-ring::before{background:none;border:3px solid var(--shs-story-color);box-shadow:none}
#shoufhon-home-stories .shs-image-pulse.shs-unseen .shs-ring img{animation:shsStoryLogo var(--shs-story-speed) ease-in-out infinite;-webkit-animation:shsStoryLogo var(--shs-story-speed) ease-in-out infinite}
#shoufhon-home-stories .shs-spark{position:absolute;z-index:4;left:50%;top:-5px;color:#fff;font-size:10px;line-height:1;text-shadow:0 0 7px var(--shs-story-color);transform-origin:0 38px;animation:shsStorySpark var(--shs-story-speed) linear infinite;-webkit-animation:shsStorySpark var(--shs-story-speed) linear infinite;animation-delay:var(--shs-spark-delay,0s);pointer-events:none}
#shoufhon-home-stories .shs-vip{position:absolute;z-index:3;inset:-4px;border-radius:50%;pointer-events:none;transform:translateZ(0)}
#shoufhon-home-stories .shs-vip::before,#shoufhon-home-stories .shs-vip::after{content:"";position:absolute;inset:0;border-radius:50%;box-sizing:border-box;pointer-events:none}
#shoufhon-home-stories .shs-vip::before{padding:var(--shs-vip-width);background:conic-gradient(from 0deg,var(--shs-vip-c1),var(--shs-vip-c3) 14%,var(--shs-vip-c2) 32%,transparent 44%,var(--shs-vip-c1) 63%,var(--shs-vip-c3) 78%,var(--shs-vip-c2));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:shsVipSpin var(--shs-vip-speed) linear infinite;-webkit-animation:shsVipSpin var(--shs-vip-speed) linear infinite;will-change:transform}
#shoufhon-home-stories .shs-vip[data-vip-ring="classic"]::before{padding:0;background:none;border:var(--shs-vip-width) solid var(--shs-vip-c1);-webkit-mask:none;mask:none;animation:none;-webkit-animation:none}
#shoufhon-home-stories .shs-vip[data-vip-ring="double"]::before{inset:-2px;padding:0;background:none;border:var(--shs-vip-width) solid var(--shs-vip-c1);-webkit-mask:none;mask:none;box-shadow:inset 0 0 0 2px rgba(0,0,0,.8),inset 0 0 0 4px var(--shs-vip-c2),0 0 12px color-mix(in srgb,var(--shs-vip-c1) 52%,transparent);animation:shsVipBreathe calc(var(--shs-vip-speed) * .65) ease-in-out infinite;-webkit-animation:shsVipBreathe calc(var(--shs-vip-speed) * .65) ease-in-out infinite}
#shoufhon-home-stories .shs-vip[data-vip-ring="neon"]::before{padding:0;background:none;border:var(--shs-vip-width) solid var(--shs-vip-c1);-webkit-mask:none;mask:none;box-shadow:0 0 4px var(--shs-vip-c3),0 0 10px var(--shs-vip-c1),0 0 18px var(--shs-vip-c2),inset 0 0 7px var(--shs-vip-c1);animation:shsVipNeon calc(var(--shs-vip-speed) * .55) ease-in-out infinite;-webkit-animation:shsVipNeon calc(var(--shs-vip-speed) * .55) ease-in-out infinite}
#shoufhon-home-stories .shs-vip[data-vip-ring="segments"]::before{background:repeating-conic-gradient(from 0deg,var(--shs-vip-c1) 0 9deg,transparent 9deg 17deg,var(--shs-vip-c2) 17deg 24deg,transparent 24deg 34deg)}
#shoufhon-home-stories .shs-vip[data-vip-ring="pearls"]::before{padding:0;background:repeating-conic-gradient(from 0deg,var(--shs-vip-c3) 0 3deg,transparent 3deg 14deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--shs-vip-width) - 2px),#000 calc(100% - var(--shs-vip-width)),#000 99%,transparent 100%);mask:radial-gradient(farthest-side,transparent calc(100% - var(--shs-vip-width) - 2px),#000 calc(100% - var(--shs-vip-width)),#000 99%,transparent 100%)}
#shoufhon-home-stories .shs-vip::after{inset:-3px;border:1px solid color-mix(in srgb,var(--shs-vip-c1) 30%,transparent);box-shadow:0 0 12px color-mix(in srgb,var(--shs-vip-c2) 28%,transparent);animation:shsVipBreathe calc(var(--shs-vip-speed) * .72) ease-in-out infinite;-webkit-animation:shsVipBreathe calc(var(--shs-vip-speed) * .72) ease-in-out infinite}
#shoufhon-home-stories .shs-plus{position:absolute;z-index:6;right:-4px;bottom:0;display:grid;place-items:center;background:#dca746;color:#100b07;border:2px solid #080808;border-radius:50%;height:22px;width:22px;padding:0;line-height:18px;font-size:19px;font-weight:900;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
#shoufhon-home-stories .shs-name{max-width:70px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:10.5px}
#shoufhon-home-stories .shs-motion-off .shs-ring,#shoufhon-home-stories .shs-motion-off .shs-ring::before,#shoufhon-home-stories .shs-motion-off .shs-ring::after,#shoufhon-home-stories .shs-motion-off .shs-ring img,#shoufhon-home-stories .shs-motion-off .shs-spark,#shoufhon-home-stories .shs-motion-off .shs-vip,#shoufhon-home-stories .shs-motion-off .shs-vip::before,#shoufhon-home-stories .shs-motion-off .shs-vip::after{animation:none!important;-webkit-animation:none!important}
@keyframes shsStorySpin{to{transform:rotate(360deg)}}@-webkit-keyframes shsStorySpin{to{-webkit-transform:rotate(360deg)}}@keyframes shsStoryGlow{0%,100%{opacity:.55;transform:scale(.985)}50%{opacity:1;transform:scale(1.045);filter:brightness(1.4)}}@keyframes shsStoryHeartbeat{10%,30%{transform:scale(1.055)}20%,40%,100%{transform:scale(1)}}@keyframes shsStoryRadar{0%{opacity:.72;transform:scale(.94)}100%{opacity:0;transform:scale(1.28)}}@keyframes shsStoryHalo{50%{box-shadow:0 0 var(--shs-story-glow) var(--shs-story-color),0 0 calc(var(--shs-story-glow) * 1.6) color-mix(in srgb,var(--shs-story-color) 42%,transparent)}}@keyframes shsStoryNeon{50%{filter:brightness(1.45) hue-rotate(24deg)}}@keyframes shsStoryLogo{50%{filter:brightness(1.13) saturate(1.15)}}@keyframes shsStorySpark{to{transform:rotate(360deg)}}@keyframes shsVipSpin{to{transform:rotate(360deg)}}@keyframes shsVipBreathe{0%,100%{opacity:.48;transform:scale(.992)}50%{opacity:1;transform:scale(1.018)}}@keyframes shsVipNeon{0%,100%{opacity:.72;filter:brightness(.9)}50%{opacity:1;filter:brightness(1.28)}}
@media(max-width:600px){#shoufhon-home-stories{width:min(1180px,calc(100% - 12px));margin-bottom:7px;padding:3px 0 8px}#shoufhon-home-stories .shs-list{gap:10px;padding-left:4px;padding-right:4px}}
html.shoufhon-story-open,body.shoufhon-story-open{overflow:hidden!important;overscroll-behavior:none!important}
#shoufhon-story-viewer{position:fixed;inset:0;z-index:2147483647;background:#000;display:grid;place-items:center;color:#fff;touch-action:none;overscroll-behavior:none}
#shoufhon-story-viewer[hidden]{display:none}
#shoufhon-story-viewer .shv-frame{position:relative;width:min(100vw,460px);height:100dvh;overflow:hidden;background:#000}
#shoufhon-story-viewer .shv-content{position:absolute;inset:0}
#shoufhon-story-viewer .shv-media{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}
#shoufhon-story-viewer .shv-top{position:absolute;top:0;left:0;right:0;padding:max(10px,env(safe-area-inset-top)) 12px 12px;z-index:5;background:linear-gradient(#000b,transparent)}
#shoufhon-story-viewer .shv-bars{display:flex;gap:3px;margin-bottom:10px}
#shoufhon-story-viewer .shv-bars i{flex:1;height:3px;border-radius:4px;background:#fff6}
#shoufhon-story-viewer .shv-bars i.done{background:#fff}
#shoufhon-story-viewer .shv-close{float:right;color:white;background:#0009;border:1px solid #ffffff35;border-radius:50%;width:40px;height:40px;font-size:25px;touch-action:manipulation}
#shoufhon-story-viewer .shv-name{display:block;padding-top:9px;max-width:75%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#shoufhon-story-viewer .shv-nav{position:absolute;z-index:4;top:78px;bottom:0;width:38%;border:0;background:transparent;color:transparent}
#shoufhon-story-viewer .shv-prev{left:0}#shoufhon-story-viewer .shv-next{right:0}
@media(max-width:600px){#shoufhon-home-stories{margin-bottom:7px;padding:10px 10px 9px;border-radius:18px}#shoufhon-home-stories .shs-list{gap:10px}}
`;
      document.head.appendChild(style);
    }
    const hero=host.querySelector('.ma7alak-ultra-hero');
    if(root.parentNode!==host || (hero && root.nextElementSibling!==hero))host.insertBefore(root,hero||host.firstChild);
    return root;
  }
  function bool(value,fallback){if(value===undefined||value===null||value==="")return !!fallback;if(typeof value==="boolean")return value;return !["false","0","off","no"].includes(String(value).trim().toLowerCase())}
  function clamp(value,min,max,fallback){const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback}
  function hex(value,fallback){const v=String(value||"").trim();return /^#[0-9a-f]{6}$/i.test(v)?v:fallback}
  function choice(value,allowed,fallback){const v=String(value||"").trim().toLowerCase();return allowed.has(v)?v:fallback}
  const storyEffects=new Set(["premium","glow","shimmer","sparkle","heartbeat","soft","radar","halo","comet","neon-wave","none"]);
  const vipRings=new Set(["aurora","double","neon","segments","pearls","classic"]);
  function item(slug,name,image,storyId,isOwner){
    const safeImage=/^https:\/\//i.test(image)?image:"";
    const hasStory=!!storyId;
    const unseen=hasStory&&hasUnseen(slug);
    const profile=profiles.get(slug)||{};
    const o=profile.directory_options&&typeof profile.directory_options==="object"?profile.directory_options:{};
    const baseColor=hex(o.story_color,"#e3b85f");
    const ringColor=hex(o.profile_ring_color,baseColor);
    const storyColor=hex(o.story_glow_color,ringColor);
    const effect=choice(o.story_new_effect,storyEffects,"premium");
    const speed=clamp(o.story_new_speed,1,6,2.2);
    const intensity=(.32+clamp(o.story_new_intensity,0,100,72)/100*.68).toFixed(2);
    const glow=(4+clamp(o.story_glow_power,0,100,72)*.28).toFixed(1)+"px";
    const sparkleCount=Math.round(clamp(o.story_new_sparkle_count,0,2,2));
    const imagePulse=bool(o.story_new_image_pulse,true);
    const motionOff=String(o.page_motion_mode||"").trim().toLowerCase()==="off";
    const vipEnabled=bool(o.vip_effects_enabled,false)&&bool(o.vip_ring_enabled,true);
    const vipVisibility=String(o.vip_ring_visibility||"unseen").trim().toLowerCase();
    const vipActive=vipEnabled&&(vipVisibility==="always"||unseen);
    const vipStyle=choice(o.vip_ring_style,vipRings,"aurora");
    const vipC1=hex(o.vip_ring_color_1,ringColor);
    const vipC2=hex(o.vip_ring_color_2,baseColor);
    const vipC3=hex(o.vip_ring_color_3,"#ffffff");
    const vipWidth=clamp(o.vip_ring_width,1,10,4)+"px";
    const vipSpeed=clamp(o.vip_ring_speed,1.5,14,5)+"s";
    const cls="shs-item"+(hasStory?(unseen?" shs-unseen":" shs-seen"):" shs-empty")+(imagePulse?" shs-image-pulse":"")+(motionOff?" shs-motion-off":"");
    const style="--shs-story-color:"+storyColor+";--shs-story-speed:"+speed+"s;--shs-story-glow:"+glow+";--shs-story-opacity:"+intensity+";--shs-vip-c1:"+vipC1+";--shs-vip-c2:"+vipC2+";--shs-vip-c3:"+vipC3+";--shs-vip-width:"+vipWidth+";--shs-vip-speed:"+vipSpeed;
    let sparks="";
    if(unseen&&effect!=="none"){
      for(let i=0;i<sparkleCount;i++)sparks+='<i class="shs-spark" aria-hidden="true" style="--shs-spark-delay:'+(-speed*i/Math.max(1,sparkleCount)).toFixed(2)+'s">✦</i>';
    }
    const vip=vipActive?'<i class="shs-vip" data-vip-ring="'+esc(vipStyle)+'" aria-hidden="true"></i>':"";
    const media=safeImage?'<img src="'+esc(safeImage)+'" alt="" loading="lazy" referrerpolicy="no-referrer">':'<span class="shs-fallback">'+esc(name.slice(0,1).toUpperCase())+'</span>';
    const viewLabel=hasStory?"View "+name+" story":(isOwner?"No active story. Use plus to upload.":"No active story");
    return '<div class="'+cls+'" data-slug="'+esc(slug)+'" data-story-effect="'+esc(effect)+'" style="'+style+'" role="listitem"><div class="shs-circle-wrap"><button class="shs-circle-button" type="button" data-action="view" data-slug="'+esc(slug)+'" data-has-story="'+(hasStory?"1":"0")+'" aria-disabled="'+(hasStory?"false":"true")+'" aria-label="'+esc(viewLabel)+'"><span class="shs-ring">'+media+sparks+vip+'</span></button>'+(isOwner?'<button class="shs-plus" type="button" data-action="upload" data-slug="'+esc(slug)+'" aria-label="Add to your story">+</button>':"")+'</div><span class="shs-name" dir="auto">'+esc(isOwner?"Your story":name)+'</span></div>';
  }
  function seenStoryTime(slug){try{return new Date(localStorage.getItem('ma7alak_story_seen_'+slug)||0).getTime()||0}catch(_){return 0}}
  function hasUnseen(slug){const now=Date.now(),last=seenStoryTime(slug);return rows.filter(r=>r.shop_slug===slug&&new Date(r.expires_at||0).getTime()>now).some(r=>new Date(r.created_at||r.expires_at||0).getTime()>last)}
  function markStoriesSeen(slug){
    const now=Date.now(),list=rows.filter(r=>r.shop_slug===slug&&new Date(r.expires_at||0).getTime()>now);if(!list.length)return;
    const latest=list.reduce((value,item)=>new Date(item.created_at||0).getTime()>new Date(value||0).getTime()?item.created_at:value,'');
    if(latest)try{localStorage.setItem('ma7alak_story_seen_'+slug,latest)}catch(_){}
    render();
  }
  function sharedViewerUrl(){
    try{
      return new URL(
        "shoufhon-story-viewer.js",
        storyScriptSrc||location.href
      ).href;
    }
    catch(_){
      return "shoufhon-story-viewer.js";
    }
  }

  function ensureSharedViewer(){

    if(
      window.ShoufHonStoryViewer &&
      typeof window.ShoufHonStoryViewer.open==="function"
    ){
      return Promise.resolve(
        window.ShoufHonStoryViewer
      );
    }

    if(storyViewerPromise){
      return storyViewerPromise;
    }

    storyViewerPromise=
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
          sharedViewerUrl();

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

    return storyViewerPromise;

  }

  async function openViewer(slug){

    const viewer=
      await ensureSharedViewer();

    if(
      !viewer ||
      typeof viewer.open!=="function"
    ){
      console.warn(
        "ShoufHon Story viewer could not load."
      );
      return;
    }

    viewer.open({
      shopSlug:slug,
      preferUnseen:true
    });

  }

  function openOwnerUploader(){
    if(!owner)return;
    const send=()=>window.postMessage({type:'MA7ALAK_OPEN_STORY_UPLOADER',shopSlug:owner.shop_slug,__ma7alakOpenStoryNow:true},location.origin);
    if([...document.scripts].some(s=>/story-upload-panel\.js/.test(s.src))){send();return}
    const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@5995532fee4b27abfec30318769e6761547448d8/story-upload-panel.js';script.onload=send;script.onerror=()=>console.warn('Story uploader could not load');document.head.appendChild(script);
  }
  function scheduleExpiry(activeRows){
    clearTimeout(expiryTimer);expiryTimer=0;
    const now=Date.now();
    const next=(activeRows||rows).map(r=>new Date(r.expires_at||0).getTime()).filter(t=>Number.isFinite(t)&&t>now).sort((a,b)=>a-b)[0];
    if(!next)return;
    expiryTimer=setTimeout(()=>{
      const cutoff=Date.now();
      rows=rows.filter(r=>new Date(r.expires_at||0).getTime()>cutoff);
      render();
      setTimeout(refresh,120);
    },Math.max(80,next-now+60));
  }
  function render(){
    const root=mount();if(!root)return;
    const now=Date.now();
    const activeRows=rows.filter(r=>new Date(r.expires_at||0).getTime()>now);
    const byShop=new Map();activeRows.forEach(r=>{if(!byShop.has(r.shop_slug))byShop.set(r.shop_slug,r)});
    const cards=[];
    if(owner){
      const p=profiles.get(owner.shop_slug)||owner;
      cards.push(item(owner.shop_slug,owner.shop_name||"Your shop",p.story_logo_url||owner.story_logo_url||p.profile_image_url||owner.profile_image_url||"",byShop.get(owner.shop_slug)?.id,true));
    }
    slugs.forEach(slug=>{
      if(slug===owner?.shop_slug)return;
      const story=byShop.get(slug);if(!story)return;
      const p=profiles.get(slug)||{};
      cards.push(item(slug,p.shop_name||slug,p.story_logo_url||p.profile_image_url||"",story.id,false));
    });
    scheduleExpiry(activeRows);
    if(!cards.length){root.hidden=true;root.replaceChildren();return}
    root.hidden=false;
    root.innerHTML='<div class="shs-list" role="list" aria-label="Stories">'+cards.join("")+'</div>';
  }
  async function refresh(){
    if(document.hidden)return;const c=db();if(!c)return;const turn=++version;
    try{
      const user=(await c.auth.getUser()).data?.user;
      let nextOwner=null;
      if(user){const o=await c.from('shop_owners').select('shop_slug').eq('user_id',user.id).limit(1).maybeSingle();if(!o.error&&o.data?.shop_slug)nextOwner={shop_slug:o.data.shop_slug};}
      const wanted=[...new Set([...slugs,...(nextOwner?[nextOwner.shop_slug]:[])])].slice(0,100);
      let nextRows=[],nextProfiles=new Map();
      if(wanted.length){
        const [s,p]=await Promise.all([c.from('shop_stories').select('id,shop_slug,media_type,storage_path,expires_at,created_at').in('shop_slug',wanted).gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false}).limit(500),c.from('shop_profiles').select('shop_slug,shop_name,profile_image_url,story_logo_url,directory_options').in('shop_slug',wanted)]);
        if(s.error||p.error)throw s.error||p.error;
        nextRows=s.data||[];nextProfiles=new Map((p.data||[]).map(x=>[x.shop_slug,x]));
      }
      if(turn!==version)return;
      owner=nextOwner?{...nextOwner,...nextProfiles.get(nextOwner.shop_slug)}:null;rows=nextRows;profiles=nextProfiles;render();
    }catch(e){console.warn('ShoufHon homepage stories:',e);}
  }
  let rootBindTries=0;
  function bindStoryTray(){
    const root=mount();
    if(!root){if(rootBindTries++<100)setTimeout(bindStoryTray,100);return}
    if(root.dataset.shsBound==='1')return;
    root.dataset.shsBound='1';
    root.addEventListener('click',e=>{
      const upload=e.target.closest('[data-action="upload"]');
      if(upload){e.preventDefault();e.stopPropagation();openOwnerUploader();return}
      const view=e.target.closest('[data-action="view"]');
      if(!view)return;
      e.preventDefault();e.stopPropagation();
      if(view.dataset.hasStory==="1")openViewer(view.dataset.slug);
    });
    render();
  }
  function scheduleRefresh(){clearTimeout(window.__shoufhonHomeStoryRefreshTimer);window.__shoufhonHomeStoryRefreshTimer=setTimeout(refresh,50)}
  window.addEventListener('ma7alak:following-state',e=>{slugs=Array.isArray(e.detail?.slugs)?e.detail.slugs.filter(x=>typeof x==='string'&&x.length<150):[];scheduleRefresh()});
  window.addEventListener('ma7alak:follow-change',scheduleRefresh);
  window.addEventListener('ma7alak:follow-changed',scheduleRefresh);
  function applyStoryMutation(message){
    if(!message||typeof message!=="object")return;
    const type=String(message.type||"");
    if(type==="MA7ALAK_STORY_DELETED"){
      const id=Number(message.storyId??message.story_id);
      const slug=String(message.shopSlug||message.shop_slug||"").trim().toLowerCase();
      rows=rows.filter(r=>(Number.isFinite(id)&&id>0)?Number(r.id)!==id:(!slug||String(r.shop_slug).toLowerCase()!==slug));
      render();
    }
    scheduleRefresh();
  }
  function onStoryRealtime(payload){
    const eventType=String(payload?.eventType||payload?.event||"").toUpperCase();
    if(eventType==="DELETE"){
      const id=Number(payload?.old?.id);
      const slug=String(payload?.old?.shop_slug||"").trim().toLowerCase();
      rows=rows.filter(r=>(Number.isFinite(id)&&id>0)?Number(r.id)!==id:(!slug||String(r.shop_slug).toLowerCase()!==slug));
      render();
    }
    scheduleRefresh();
  }
  window.addEventListener('storage',e=>{
    if(String(e.key||'').startsWith('ma7alak_story_seen_'))render();
    if(e.key==='shoufhon_story_mutation'&&e.newValue){try{applyStoryMutation(JSON.parse(e.newValue))}catch(_){}}
  });
  window.addEventListener('ma7alak:story-mutation',e=>applyStoryMutation(e.detail));
  window.addEventListener('message',e=>{if(['MA7ALAK_FOLLOW_CHANGED','MA7ALAK_FOLLOW_STATE_CHANGED','MA7ALAK_STORY_UPLOADED','MA7ALAK_STORY_DELETED'].includes(e.data?.type))applyStoryMutation(e.data)});
  function start(){
    slugs=Array.isArray(window.Ma7alakFollowingState?.slugs)?window.Ma7alakFollowingState.slugs:[];
    bindStoryTray();
    refresh();
    ensureSharedViewer();
    timer=setInterval(()=>{if(!document.hidden)refresh()},30000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
    const c=db();
    if(c?.channel)channel=c.channel('shoufhon-home-stories')
      .on('postgres_changes',{event:'*',schema:'public',table:'shop_stories'},onStoryRealtime)
      .on('postgres_changes',{event:'*',schema:'public',table:'shop_profiles'},scheduleRefresh)
      .subscribe();
    try{
      if('BroadcastChannel' in window){
        storyBus=new BroadcastChannel('shoufhon-stories');
        storyBus.onmessage=e=>applyStoryMutation(e.data);
      }
    }catch(_){};
    try{c?.auth?.onAuthStateChange?.(()=>setTimeout(refresh,0))}catch(_){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();


/* Route every opening-header “Add your shop” action to the new plan page. */
(function(){
  function sync(){document.querySelectorAll('#ma7alak-opening-header-root a[href*="dhyf-mhlk-"]').forEach(function(link){link.href="https://shoufhon.com/add-shop-";link.onclick=function(e){e.preventDefault();window.top.location.href="https://shoufhon.com/add-shop-"}})}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
  const observer=new MutationObserver(sync);observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){observer.disconnect()},15000);
})();


/* =========================================================
   SHOUFHON HOMEPAGE BUNDLE
   Opening Header + Happening Today + Reels + Local Spotlight + Shop Promo
   The homepage feed is bundled here so Hostinger needs no separate home-feed or promo loader.
   Keep viewer/open/realtime/mobile behavior unchanged.
========================================================= */
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

/* SHOUFHON LOCAL SPOTLIGHT — bundled into the same Live/Reels homepage feed. */
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


/* SHOUFHON SHOP-OWNER PROMO — integrated after Local Spotlight. */
#ma7alak-add-shop-promo{box-sizing:border-box;width:100%;margin:18px auto 4px;padding:2px;color:#fff;font-family:Arial,"Segoe UI",sans-serif}
.m7ap *{box-sizing:border-box}
.m7ap-shell{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(226,185,104,.38);border-radius:28px;padding:28px 20px;background:radial-gradient(circle at 88% 10%,rgba(221,168,64,.24),transparent 31%),radial-gradient(circle at 8% 92%,rgba(153,91,23,.12),transparent 34%),linear-gradient(145deg,#20170d,#0b0a08 64%);box-shadow:0 20px 58px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.035);transform:translateZ(0)}
.m7ap-shell::after{content:"";position:absolute;inset:0;z-index:6;border:1px solid rgba(244,203,123,.56);border-radius:inherit;box-shadow:inset 0 0 18px rgba(226,185,104,.08),0 0 16px rgba(226,185,104,.10);pointer-events:none;opacity:.34;animation:m7apFrameBreathe 3.2s ease-in-out infinite;will-change:opacity}
.m7ap-frame-sweep{position:absolute;inset:0;z-index:7;overflow:hidden;border-radius:inherit;pointer-events:none}
.m7ap-frame-sweep::before,.m7ap-frame-sweep::after{content:"";position:absolute;width:26%;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#ffe7a8 42%,#fff8d9 54%,#e2b75e 69%,transparent);box-shadow:0 0 7px #ffd36c,0 0 16px rgba(226,185,104,.6);will-change:transform}
.m7ap-frame-sweep::before{top:0;left:-28%;animation:m7apSweepTop 4.8s linear infinite}
.m7ap-frame-sweep::after{bottom:0;right:-28%;animation:m7apSweepBottom 4.8s linear infinite 2.4s}
.m7ap-content{position:relative;z-index:2}
.m7ap-kicker{display:flex;align-items:center;gap:8px;color:#e9bf6d;font-size:10px;font-weight:950;letter-spacing:2.35px}
.m7ap-kicker::before{content:"";width:7px;height:7px;border-radius:50%;background:#e9bf6d;box-shadow:0 0 11px rgba(233,191,109,.7)}
.m7ap h2{max-width:650px;margin:12px 0 11px;font:900 clamp(34px,8.4vw,54px)/.98 Georgia,"Times New Roman",serif;letter-spacing:-1.2px;text-wrap:balance}
.m7ap h2 em{color:#f0c66e;font-style:normal}
.m7ap-intro{max-width:610px;margin:0;color:#c8c0b4;font-size:14px;line-height:1.45}
.m7ap-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:22px 0}
.m7ap-benefit{position:relative;min-height:158px;padding:14px 13px 15px;border:1px solid rgba(255,255,255,.10);border-radius:19px;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.022));box-shadow:inset 0 1px 0 rgba(255,255,255,.025);overflow:hidden}
.m7ap-benefit::after{content:"";position:absolute;inset:auto -28% -45% 35%;height:70%;background:radial-gradient(circle,rgba(226,185,104,.10),transparent 68%);pointer-events:none}
.m7ap-icon{position:relative;z-index:1;width:56px;height:56px;display:grid;place-items:center;margin-bottom:12px;border:1px solid rgba(226,185,104,.35);border-radius:17px;background:linear-gradient(145deg,rgba(219,161,65,.19),rgba(102,61,19,.08));color:#f0c875;box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 0 18px rgba(217,164,65,.06)}
.m7ap-icon svg{width:29px;height:29px;display:block;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.m7ap-benefit strong{position:relative;z-index:1;display:block;font-size:14px;line-height:1.22}
.m7ap-benefit span.m7ap-copy{position:relative;z-index:1;display:block;margin-top:6px;color:#aaa39a;font-size:11px;line-height:1.42}
.m7ap-action{width:100%;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:14px;border:1px solid #ffe5a2;border-radius:20px;padding:14px 18px;background:linear-gradient(110deg,#f7d986,#dfa23f 75%,#d18a2d);color:#201507!important;text-decoration:none!important;font-weight:950;box-shadow:0 12px 34px rgba(199,143,41,.20),inset 0 1px 0 rgba(255,255,255,.45);transition:transform .18s ease,filter .18s ease}
.m7ap-action:active{transform:scale(.985);filter:brightness(.97)}
.m7ap-action small{display:block;margin-top:3px;text-align:left;font-size:10px;font-weight:750;opacity:.72}
.m7ap-action b{font-size:17px}
.m7ap-action i{font-style:normal;font-size:30px;line-height:1}
@keyframes m7apFrameBreathe{0%,100%{opacity:.24}50%{opacity:.62}}
@-webkit-keyframes m7apFrameBreathe{0%,100%{opacity:.24}50%{opacity:.62}}
@keyframes m7apSweepTop{from{transform:translate3d(0,0,0)}to{transform:translate3d(500%,0,0)}}
@-webkit-keyframes m7apSweepTop{from{-webkit-transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(500%,0,0)}}
@keyframes m7apSweepBottom{from{transform:translate3d(0,0,0)}to{transform:translate3d(-500%,0,0)}}
@-webkit-keyframes m7apSweepBottom{from{-webkit-transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(-500%,0,0)}}
@media(min-width:700px){.m7ap-shell{padding:38px}.m7ap-grid{grid-template-columns:repeat(4,1fr);gap:12px}.m7ap-benefit{min-height:185px}.m7ap-benefit strong{font-size:15px}.m7ap-benefit span.m7ap-copy{font-size:12px}}
@media(max-width:600px){#ma7alak-add-shop-promo{margin-top:14px}.m7ap-shell{padding:24px 15px 18px;border-radius:24px}.m7ap h2{font-size:clamp(32px,9.5vw,42px);line-height:1}.m7ap-intro{font-size:13px}.m7ap-grid{gap:9px;margin:19px 0}.m7ap-benefit{min-height:164px;padding:13px 11px}.m7ap-icon{width:54px;height:54px;border-radius:16px}.m7ap-icon svg{width:28px;height:28px}.m7ap-benefit strong{font-size:13px}.m7ap-benefit span.m7ap-copy{font-size:10.5px}.m7ap-action{min-height:68px;padding:12px 15px;border-radius:18px}.m7ap-action b{font-size:16px}.m7ap-action small{font-size:9.5px}}

/* REELS — naturally follows LIVE with no reserved gap */\n.ma7alak-reels-wrapper{position:relative;width:100%;margin:28px 0 14px;padding:15px 0 14px}.ma7alak-reels-wrapper:before,.ma7alak-reels-wrapper:after{content:"";position:absolute;left:50%;width:100vw;height:3px;transform:translateX(-50%);background:#ffffff1a;box-shadow:0 1px #0009}.ma7alak-reels-wrapper:before{top:0}.ma7alak-reels-wrapper:after{bottom:0}.ma7alak-reels-title{display:flex;align-items:center;gap:8px;margin:0 0 10px 4px;font-size:20px;font-weight:800}.ma7alak-reels{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;padding:5px 4px 14px;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}.ma7alak-reels::-webkit-scrollbar{display:none}.ma7alak-reel{position:relative;flex:0 0 270px;height:480px;border-radius:22px;overflow:hidden;background:#0d0d0e;border:1px solid #e2b45b38;scroll-snap-align:start;scroll-snap-stop:always}.ma7alak-video{width:100%;height:100%;display:block;object-fit:cover;cursor:pointer}.reel-info{position:absolute;left:14px;right:14px;bottom:14px;z-index:10;display:flex;align-items:center;gap:11px;padding:10px 13px;border:1px solid #ffffff12;border-radius:15px;background:linear-gradient(to top,#0006,#0001);backdrop-filter:blur(5px);cursor:pointer}.reel-shop-icon{width:42px;height:42px;min-width:42px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover;background:#171717}.reel-info-text{min-width:0;display:flex;flex-direction:column;gap:3px;overflow:hidden}.reel-info-text strong,.reel-info-text span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px #000}.reel-info-text strong{font-size:17px}.reel-info-text span{font-size:12px;color:#fffffff5}.coming-soon{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#f5d48a;background:radial-gradient(circle,#e2b45b17,transparent 60%)}.coming-soon span{font-size:42px}.ma7alak-favorites-corner{display:flex;justify-content:flex-end;margin-top:8px;padding:0 6px}.ma7alak-favorites-button{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border:1px solid #e2b45b4d;border-radius:99px;background:linear-gradient(135deg,#e2b45b21,#000a);color:#f5d48a;font-size:13px;font-weight:700}.ma7alak-favorites-button b{min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#e2b45b;color:#111;font-size:11px}\n/* SAVED REELS — 50% mobile drawer, created/loaded only when opened. */
html.m7-saved-open,body.m7-saved-open{overflow:hidden!important}
.m7-saved-drawer{position:fixed;inset:0;z-index:2147483600;display:none;align-items:flex-end;background:rgba(0,0,0,.52);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.m7-saved-drawer.open{display:flex}
.m7-saved-sheet{position:relative;width:100%;height:50dvh;min-height:330px;max-height:560px;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(226,180,91,.34);border-bottom:0;border-radius:26px 26px 0 0;background:linear-gradient(180deg,#17120d 0,#0a0908 26%,#050505 100%);box-shadow:0 -18px 55px rgba(0,0,0,.62),0 0 30px rgba(226,180,91,.08);transform:translate3d(0,100%,0);transition:transform .28s cubic-bezier(.2,.8,.2,1);will-change:transform}
.m7-saved-drawer.open .m7-saved-sheet{transform:translate3d(0,0,0)}
.m7-saved-handle{width:42px;height:4px;flex:0 0 auto;margin:8px auto 4px;border-radius:999px;background:#ffffff45}
.m7-saved-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px 12px;border-bottom:1px solid #ffffff12}
.m7-saved-title{min-width:0}.m7-saved-title b{display:block;color:#fff;font-size:18px}.m7-saved-title small{display:block;margin-top:3px;color:#ffffff72;font-size:11px}
.m7-saved-head-right{display:flex;align-items:center;gap:8px}
.m7-saved-count{min-width:30px;height:30px;display:grid;place-items:center;padding:0 8px;border:1px solid #e2b45b55;border-radius:999px;background:#e2b45b16;color:#f5d48a;font-size:11px;font-weight:900}
.m7-saved-close{width:36px;height:36px;display:grid;place-items:center;border:1px solid #ffffff20;border-radius:50%;background:#ffffff0a;color:#fff;font-size:23px;line-height:1}
.m7-saved-body{min-height:0;flex:1;overflow:hidden;padding:12px 0 max(10px,env(safe-area-inset-bottom))}
.m7-saved-track{height:100%;display:flex;gap:11px;overflow-x:auto;overflow-y:hidden;padding:0 14px 8px;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.m7-saved-track::-webkit-scrollbar{display:none}
.m7-saved-card{position:relative;flex:0 0 min(43vw,190px);height:100%;min-width:138px;max-height:330px;overflow:hidden;border:1px solid #e2b45b30;border-radius:18px;background:#101010;scroll-snap-align:start;cursor:pointer;isolation:isolate}
.m7-saved-card video{width:100%;height:100%;display:block;object-fit:cover;background:#090909}
.m7-saved-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 35%,rgba(0,0,0,.12) 52%,rgba(0,0,0,.92) 100%)}
.m7-saved-card-info{position:absolute;z-index:3;left:10px;right:10px;bottom:10px;display:flex;align-items:center;gap:8px;min-width:0}
.m7-saved-card-info img{width:31px;height:31px;flex:0 0 31px;border:1.5px solid #f5d48a;border-radius:50%;object-fit:cover;background:#171717}
.m7-saved-card-copy{min-width:0;flex:1}.m7-saved-card-copy strong,.m7-saved-card-copy small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px #000}
.m7-saved-card-copy strong{font-size:11px;color:#fff}.m7-saved-card-copy small{margin-top:2px;font-size:9px;color:#ffffff9b}
.m7-saved-remove{position:absolute;z-index:5;top:9px;right:9px;width:34px;height:34px;display:grid;place-items:center;border:1px solid #e2b45b70;border-radius:50%;background:#080705d9;color:#f5d48a;font-size:18px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.m7-saved-empty{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;color:#ffffff72}
.m7-saved-empty .star{color:#e2b45b;font-size:38px;line-height:1}.m7-saved-empty strong{margin-top:8px;color:#fff;font-size:15px}.m7-saved-empty span{margin-top:5px;font-size:11px}
@media(min-width:700px){.m7-saved-sheet{left:50%;width:min(720px,100%);transform:translate3d(-50%,100%,0)}.m7-saved-drawer.open .m7-saved-sheet{transform:translate3d(-50%,0,0)}.m7-saved-card{flex-basis:190px}}
@media(prefers-reduced-motion:reduce){.m7-saved-sheet{transition:none!important}}

/* VIEWER */\n.ma7alak-reel-viewer{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;background:#000;overflow:hidden;touch-action:none}.ma7alak-reel-viewer.open{display:flex}.ma7alak-reel-viewer-video{position:absolute;inset:5px;width:calc(100vw - 10px);height:calc(100dvh - 10px);object-fit:contain;background:#000;border-radius:18px;transition:opacity .35s ease,transform .45s cubic-bezier(.16,1,.3,1)}.ma7alak-reel-viewer-shop{position:absolute;top:15px;left:10px;z-index:2147483646;max-width:70%;display:flex;align-items:center;gap:9px;padding:6px 13px 6px 6px;border:1px solid #ffffff3d;border-radius:99px;background:#000b;color:#fff;backdrop-filter:blur(14px)}.ma7alak-reel-viewer-shop img{width:40px;height:40px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover}.ma7alak-reel-viewer-shop span{min-width:0;display:flex;flex-direction:column;text-align:left}.ma7alak-reel-viewer-shop strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.ma7alak-reel-viewer-shop small{color:#ffffffad;font-size:10px}.ma7alak-reel-viewer-shop em{color:#f5d48a;font-size:18px;font-style:normal}.ma7alak-reel-viewer-close,.ma7alak-viewer-favorite{position:absolute;z-index:2147483646;display:flex;align-items:center;justify-content:center;border:1px solid #ffffff40;border-radius:50%;background:#000b;color:#fff;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}.ma7alak-reel-viewer-shop{touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}.ma7alak-reel-viewer-close{top:14px;right:10px;width:45px;height:45px;font-size:31px}.ma7alak-viewer-favorite{right:10px;bottom:72px;width:50px;height:50px;font-size:28px}.ma7alak-viewer-favorite.active{color:#f5d48a;background:#e2b45b2b;border-color:#e2b45b8c}.ma7alak-swipe-hint{position:absolute;bottom:20px;left:50%;z-index:2147483645;transform:translateX(-50%);color:#ffffff73;font-size:11px;pointer-events:none}\n@media(max-width:600px){#m7-global-home-feed-shell{padding-left:10px!important;padding-right:10px!important}#m7-home-feed{min-width:0!important}#m7-live-home{width:100%!important;max-width:100%!important;min-width:0!important;padding:15px;border-radius:23px}#m7-live-home h2{font-size:27px}.m7-live-cards,.ma7alak-reels{max-width:100%!important;min-width:0!important;scroll-padding-inline:2px 10px}.m7-live-card{flex-basis:calc(100% - 20px)!important;max-width:calc(100% - 20px)!important;height:465px}.ma7alak-reel{flex-basis:min(62vw,270px)!important;max-width:calc(100vw - 58px)!important;height:auto;aspect-ratio:9/16;border-radius:18px}.reel-info{left:10px;right:10px;bottom:10px;padding:8px 10px}.reel-shop-icon{width:37px;height:37px;min-width:37px}.reel-info-text strong{font-size:15px}.reel-info-text span{font-size:10px}}\n/* Exact Lebanon schedule + live countdown. Only this text updates every second;\n   the card and its video stay mounted, preventing black flicker. */\n.m7-live-times{display:block;margin-top:11px;padding:10px 11px;border:1px solid #ffffff17;border-radius:13px;background:#050807b8}.m7-live-schedule{display:grid;gap:4px}.m7-live-schedule b{color:#fff;font-size:11px;line-height:1.25}.m7-live-schedule small{color:#36dc82;font-size:10px;font-weight:900;line-height:1.2;text-shadow:0 0 9px #36dc826b}.m7-live-schedule span{color:#ffffff9c;font-size:10px;font-weight:800;line-height:1.25}\n/* Live indicators intentionally remain animated on mobile, including browsers\n   that inherit Android\'s reduced-motion preference. */\n@media(prefers-reduced-motion:reduce){.ma7alak-reel-viewer-video{transition:none}.m7-live-status i,.m7-live-card,.m7-shop-avatar,.m7-shop-avatar:before,.m7-shop-avatar:after{-webkit-animation-play-state:running!important;animation-play-state:running!important}}\n\n/* FINAL HOSTINGER BACKGROUND LOCK
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
 const shell=document.createElement("div"); shell.id="m7-global-home-feed-shell"; shell.innerHTML=`<div id="m7-home-feed">\n  <section id="m7-live-home">\n    <div class="m7-live-head">\n      <div class="m7-live-top"><span class="m7-live-status"><i></i> LIVE</span><span id="m7-live-count">0 UPDATES</span></div>\n      <h2>🔥 Happening Today</h2>\n      <p id="m7-live-sub">Offers, events &amp; special things happening now</p>\n    </div>\n    <div id="m7-live-cards" class="m7-live-cards"><div class="m7-live-empty"><b>Loading live updates...</b></div></div>\n  </section>\n\n  <section class="ma7alak-reels-wrapper">\n    <div class="ma7alak-reels-title"><span>🎬</span><span>Reels</span></div>\n    <div class="ma7alak-reels"><div class="ma7alak-reel coming-soon-reel"><div class="coming-soon"><span>🎥</span><strong>New video coming soon</strong></div></div></div>\n    <div class="ma7alak-favorites-corner"><button id="ma7alakFavoritesButton" class="ma7alak-favorites-button" type="button" aria-haspopup="dialog" aria-controls="ma7alakSavedDrawer"><span>⭐</span><span>Saved</span><b id="ma7alakFavoritesCount">0</b></button></div>\n  </section>\n\n  <section id="ma7alak-home-shop-spotlight" class="m7hs" aria-label="ShoufHon local spotlight">\n    <header class="m7hs-head"><div><div class="m7hs-kicker">SHOUFHON SPOTLIGHT</div><h2>Local spotlight</h2></div><span class="m7hs-count">Loading…</span></header>\n    <div class="m7hs-empty"><strong>Loading local picks…</strong></div>\n  </section>\n\n  <section id="ma7alak-add-shop-promo" class="m7ap" aria-label="Add your shop to ShoufHon">\n    <div class="m7ap-shell">\n      <span class="m7ap-frame-sweep" aria-hidden="true"></span>\n      <div class="m7ap-content">\n        <div class="m7ap-kicker">BUILT FOR LOCAL BUSINESSES</div>\n        <h2>Turn your local shop into a page people <em>discover, follow and come back to.</em></h2>\n        <p class="m7ap-intro">ShoufHon brings your shop, content, offers and customers together in one place.</p>\n        <div class="m7ap-grid">\n          <div class="m7ap-benefit"><span class="m7ap-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v9h16v-9"/><path d="M3 10l2-5h14l2 5"/><path d="M3 10c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2c0 1.2 1 2 2 2s2-.8 2-2"/><path d="M9 19v-4h6v4"/></svg></span><strong>Create your shop page</strong><span class="m7ap-copy">Add your profile, banner, location, hours, gallery and what customers need to know.</span></div>\n          <div class="m7ap-benefit"><span class="m7ap-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="4"/><path d="M4 9h16M8 5l3 4M14 5l3 4"/><path d="m10 13 5 3-5 3z"/></svg></span><strong>Share what’s happening</strong><span class="m7ap-copy">Post Stories, Reels, new arrivals and Live offers directly from your shop.</span></div>\n          <div class="m7ap-benefit"><span class="m7ap-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 12s3.3-6 9.2-6 9.2 6 9.2 6-3.3 6-9.2 6-9.2-6-9.2-6z"/><circle cx="12" cy="12" r="2.6"/></svg></span><strong>Get discovered locally</strong><span class="m7ap-copy">Appear across ShoufHon, categories, areas, Spotlight and other discovery sections.</span></div>\n          <div class="m7ap-benefit"><span class="m7ap-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 9.1c0 5.1-8.5 10-8.5 10s-8.5-4.9-8.5-10A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5z"/></svg></span><strong>Build real connections</strong><span class="m7ap-copy">Customers can follow your shop, save content, message you and return for updates.</span></div>\n        </div>\n        <a class="m7ap-action" href="https://shoufhon.com/add-shop-" aria-label="Add your shop to ShoufHon"><span><b>Add your shop</b><small>Create your ShoufHon shop page</small></span><i>→</i></a>\n      </div>\n    </div>\n  </section>\n</div>\n\n<div id="ma7alakSavedDrawer" class="m7-saved-drawer" aria-hidden="true">
  <section class="m7-saved-sheet" role="dialog" aria-modal="true" aria-labelledby="ma7alakSavedTitle">
    <div class="m7-saved-handle" aria-hidden="true"></div>
    <header class="m7-saved-head">
      <div class="m7-saved-title"><b id="ma7alakSavedTitle">⭐ Saved Reels</b><small>Tap a Reel to watch it</small></div>
      <div class="m7-saved-head-right"><span id="ma7alakSavedCount" class="m7-saved-count">0</span><button id="ma7alakSavedClose" class="m7-saved-close" type="button" aria-label="Close saved Reels">×</button></div>
    </header>
    <div id="ma7alakSavedBody" class="m7-saved-body"></div>
  </section>
</div>

<div id="ma7alakReelViewer" class="ma7alak-reel-viewer" aria-hidden="true">\n  <button id="ma7alakReelViewerShop" class="ma7alak-reel-viewer-shop" type="button"><img id="ma7alakReelViewerShopIcon" src="" alt="Shop"><span><strong id="ma7alakReelViewerShopName">Shop</strong><small>View shop</small></span><em>→</em></button>\n  <button id="ma7alakReelViewerClose" class="ma7alak-reel-viewer-close" type="button">×</button>\n  <button id="ma7alakViewerFavorite" class="ma7alak-viewer-favorite" type="button" aria-label="Add to favorites">☆</button>\n  <video id="ma7alakReelViewerVideo" class="ma7alak-reel-viewer-video" playsinline webkit-playsinline loop preload="none"></video>\n  <div class="ma7alak-swipe-hint">↑ &nbsp; Swipe &nbsp; ↓</div>\n</div>`;
 const cfg={enabled:true};

 function homepageBlock(){
   return window.Ma7alakHomepageBlock?.ensure?.()||
          document.getElementById("shoufhon-homepage-content-block");
 }

 function place(){
   shell.style.display=cfg.enabled===false?"none":"block";
   shell.style.setProperty("width","100%","important");
   shell.style.setProperty("max-width","100%","important");

   const block=homepageBlock();
   const hero=document.getElementById("ma7alak-opening-header-root");

   if(block&&hero){
     /* Permanent order: Opening Header -> separator -> Live/Reels/Spotlight/Shop Promo.
        No footer detection, no Hostinger-child scanning, no background guessing. */
     if(hero.parentNode!==block){
       block.insertBefore(hero,block.firstElementChild);
     }
     if(shell.parentNode!==block||hero.nextElementSibling!==shell){
       hero.insertAdjacentElement("afterend",shell);
     }
     return;
   }

   if(block&&shell.parentNode!==block){
     block.appendChild(shell);
   }
 }

 function keepFeedMounted(){
   if(document.hidden)return;
   if(!style.isConnected&&document.head)document.head.appendChild(style);
   place();
 }

 place();
 [80,300,800,1600,3000].forEach(ms=>setTimeout(place,ms));
 const m7PlacementTimer=setInterval(keepFeedMounted,1200);
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
const M7_HOME_FEED_SB_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",M7_HOME_FEED_SB_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const M7_HOME_FEED_START_DELAYS=[100,250,500,1000,2000,4000,8000,12000];
let m7HomeFeedDataStarted=false,m7HomeFeedStartTimer=null,m7HomeFeedStartIndex=0;

function m7ResolveHomeFeedClient(){
  const shared=
    (window.Ma7alakAccount&&window.Ma7alakAccount.client)||
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
    (window.Ma7alakSupabaseBootstrap&&window.Ma7alakSupabaseBootstrap.client);
  if(shared)return shared;
  if(window.__MA7ALAK_HOME_FEED_FALLBACK_SUPABASE__)return window.__MA7ALAK_HOME_FEED_FALLBACK_SUPABASE__;
  if(window.supabase&&typeof window.supabase.createClient==="function"){
    try{
      window.__MA7ALAK_HOME_FEED_FALLBACK_SUPABASE__=window.supabase.createClient(M7_HOME_FEED_SB_URL,M7_HOME_FEED_SB_KEY);
      return window.__MA7ALAK_HOME_FEED_FALLBACK_SUPABASE__;
    }catch(err){
      console.warn("SHOUFHON home feed: Supabase client creation delayed",err);
    }
  }
  return null;
}

function m7StartHomeFeedData(){
  if(m7HomeFeedDataStarted||window.__MA7ALAK_HOME_FEED_DATA_STARTED__)return true;
  const sb=m7ResolveHomeFeedClient();
  if(!sb)return false;
  m7HomeFeedDataStarted=true;
  window.__MA7ALAK_HOME_FEED_DATA_STARTED__=1;
  if(m7HomeFeedStartTimer){
    clearTimeout(m7HomeFeedStartTimer);
    m7HomeFeedStartTimer=null;
  }

(function(sb){"use strict";
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
/* LIVE OFFERS */
const liveRoot=document.getElementById("m7-live-home"),liveCards=document.getElementById("m7-live-cards"),liveSub=document.getElementById("m7-live-sub"),liveCount=document.getElementById("m7-live-count");let livePosts=[],liveSignature="",liveDirectLoading=false,liveDirectQueued=false,liveDirectRetryTimer=null,liveDirectRetryIndex=0,liveDirectChannel=null;const LIVE_TIME_ZONE="Asia/Beirut";
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
let liveStateReceived=false;
const liveRequestTimers=[];
const M7_LIVE_CACHE_KEY="ma7alak-live-public-cache-v1";
function readHomepageLiveCache(){
  try{
    const raw=localStorage.getItem(M7_LIVE_CACHE_KEY);
    if(!raw)return[];
    const parsed=JSON.parse(raw);
    const now=Date.now();
    const cached=(Array.isArray(parsed&&parsed.items)?parsed.items:[]).filter(x=>{
      if(!x||String(x.status||"active")!=="active")return false;
      const end=new Date(x.ends_at).getTime();
      return Number.isFinite(end)&&end>now;
    });
    if(!cached.length&&Array.isArray(parsed&&parsed.items)&&(parsed.items||[]).length){
      localStorage.removeItem(M7_LIVE_CACHE_KEY);
    }
    return cached;
  }catch(_){
    return[];
  }
}
function hydrateHomepageLiveCache(){
  const cached=readHomepageLiveCache();
  if(!cached.length)return;
  const signature=getLiveSignature(cached);
  livePosts=cached;
  liveSignature=signature;
  renderLive();
}
function stopLiveRequests(){while(liveRequestTimers.length)clearTimeout(liveRequestTimers.pop())}
function applyLiveState(next){
  next=Array.isArray(next)?next:[];
  liveStateReceived=true;
  stopLiveRequests();
  const signature=getLiveSignature(next);
  livePosts=next;
  if(signature!==liveSignature){
    liveSignature=signature;
    renderLive();
  }else{
    updateLiveTimers();
  }
}
function syncLiveFromProviderCache(){
  if(document.hidden)return;
  const provider=window.Ma7alakLiveOffers;
  if(!provider)return;
  try{
    const next=provider.items;
    if(Array.isArray(next))applyLiveState(next);
  }catch(_){}
}
addEventListener("message",e=>{
  const d=e.data||{};
  if((d.type==="MA7ALAK_LIVE_OFFERS_STATE"&&!d.shopSlug)||d.type==="MA7ALAK_LIVE_OFFERS_UPDATED"){
    applyLiveState(d.items);
  }
  if(d.type==="MA7ALAK_OPEN_REELS")openRandomReel();
});
function requestLive(){if(!liveStateReceived)window.postMessage({type:"MA7ALAK_LIVE_OFFERS_GET",shopSlug:""},"*")}

const LIVE_DIRECT_RETRY_DELAYS=[400,1000,2200,5000,9000];

function withHomeFeedTimeout(promise,label,ms=8000){
  let timer;

  return Promise.race([
    Promise.resolve(promise),
    new Promise((_,reject)=>{
      timer=setTimeout(
        ()=>reject(new Error(label+" timed out")),
        ms
      );
    })
  ]).finally(()=>clearTimeout(timer));
}

function scheduleLiveDirectRetry(){
  clearTimeout(liveDirectRetryTimer);

  const delay=
    LIVE_DIRECT_RETRY_DELAYS[
      Math.min(
        liveDirectRetryIndex++,
        LIVE_DIRECT_RETRY_DELAYS.length-1
      )
    ];

  liveDirectRetryTimer=setTimeout(
    ()=>{
      if(!document.hidden){
        loadHomepageLiveDirect();
      }
    },
    delay
  );
}

function applyDirectLiveState(next){
  next=Array.isArray(next)?next:[];

  const signature=getLiveSignature(next);
  livePosts=next;

  if(signature!==liveSignature){
    liveSignature=signature;
    renderLive();
  }else{
    updateLiveTimers();
  }
}

async function loadHomepageLiveDirect(){
  if(liveDirectLoading){
    liveDirectQueued=true;
    return;
  }

  liveDirectLoading=true;

  try{
    const now=new Date().toISOString();

    const result=await withHomeFeedTimeout(
      sb.from("shop_live_posts")
        .select("id,shop_slug,shop_name,post_type,title,description,media_url,media_type,original_price,offer_price,starts_at,ends_at,status,created_at")
        .eq("status","active")
        .gt("ends_at",now)
        .order("starts_at",{ascending:false})
        .limit(80),
      "Homepage Live refresh"
    );

    if(result.error)throw result.error;

    let next=result.data||[];

    const slugs=[
      ...new Set(
        next
          .map(x=>String(x.shop_slug||"").trim().toLowerCase())
          .filter(Boolean)
      )
    ];

    if(slugs.length){
      const profiles=await withHomeFeedTimeout(
        sb.from("shop_profiles")
          .select("shop_slug,profile_image_url,shop_url")
          .in("shop_slug",slugs),
        "Homepage Live profiles"
      );

      if(!profiles.error){
        const bySlug=
          new Map(
            (profiles.data||[]).map(
              profile=>[
                String(profile.shop_slug||"").trim().toLowerCase(),
                profile
              ]
            )
          );

        next=next.map(item=>{
          const profile=
            bySlug.get(
              String(item.shop_slug||"").trim().toLowerCase()
            )||{};

          return {
            ...item,
            profile_image_url:profile.profile_image_url||null,
            shop_url:profile.shop_url||null
          };
        });
      }
    }

    liveDirectRetryIndex=0;
    clearTimeout(liveDirectRetryTimer);
    liveDirectRetryTimer=null;

    applyDirectLiveState(next);
  }
  catch(error){
    console.warn(
      "SHOUFHON homepage Live direct refresh:",
      error
    );

    scheduleLiveDirectRetry();
  }
  finally{
    liveDirectLoading=false;

    if(liveDirectQueued){
      liveDirectQueued=false;
      setTimeout(
        loadHomepageLiveDirect,
        0
      );
    }
  }
}

function setupHomepageLiveDirect(){
  loadHomepageLiveDirect();

  try{
    liveDirectChannel=
      sb.channel("shoufhon-home-live-direct")
        .on(
          "postgres_changes",
          {
            event:"*",
            schema:"public",
            table:"shop_live_posts"
          },
          loadHomepageLiveDirect
        )
        .subscribe();
  }
  catch(_){}
}

hydrateHomepageLiveCache();
setupHomepageLiveDirect();
[0,250,750,1500,3000,5000,8000,12000].forEach(ms=>liveRequestTimers.push(setTimeout(requestLive,ms)));
const liveProviderCacheTimer=setInterval(syncLiveFromProviderCache,4000);
window.addEventListener("focus",syncLiveFromProviderCache);
window.addEventListener("pageshow",()=>{syncLiveFromProviderCache();loadHomepageLiveDirect()});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"){syncLiveFromProviderCache();loadHomepageLiveDirect();requestLive()}});
setInterval(updateLiveTimers,1000);
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
spotlightChannel=sb.channel("home-shop-spotlight-bundled").on("postgres_changes",{event:"*",schema:"public",table:"shop_profiles"},loadSpotlight).subscribe();
document.addEventListener("visibilitychange",()=>{if(document.hidden)spotlightClearAuto();else{loadSpotlight();spotlightScheduleAuto(4000)}});

/* REELS */
const reelsContainer=document.querySelector(".ma7alak-reels"),viewer=document.getElementById("ma7alakReelViewer"),viewerVideo=document.getElementById("ma7alakReelViewerVideo"),viewerClose=document.getElementById("ma7alakReelViewerClose"),viewerShop=document.getElementById("ma7alakReelViewerShop"),viewerName=document.getElementById("ma7alakReelViewerShopName"),viewerIcon=document.getElementById("ma7alakReelViewerShopIcon"),viewerFav=document.getElementById("ma7alakViewerFavorite"),favCount=document.getElementById("ma7alakFavoritesCount"),savedDrawer=document.getElementById("ma7alakSavedDrawer"),savedBody=document.getElementById("ma7alakSavedBody"),savedClose=document.getElementById("ma7alakSavedClose"),savedCount=document.getElementById("ma7alakSavedCount"),savedButton=document.getElementById("ma7alakFavoritesButton");let reels=[],viewerIndex=0,favoriteIds=new Set(),channel,loading=false,reelReloadQueued=false,reelRetryTimer=null,reelRetryIndex=0,lastRandom=null,reelDataSignature="",savedHistoryArmed=false,savedCloseFallbackTimer=null;
let visitorId=localStorage.getItem("ma7alak_visitor_id");if(!visitorId){visitorId=crypto.randomUUID();localStorage.setItem("ma7alak_visitor_id",visitorId)}
const favoriteTokenKey="ma7alak_favorite_token_v1";
let favoriteToken=String(localStorage.getItem(favoriteTokenKey)||"").trim();
if(!/^[A-Za-z0-9._:-]{32,200}$/.test(favoriteToken)){favoriteToken=crypto.randomUUID()+"-"+crypto.randomUUID();localStorage.setItem(favoriteTokenKey,favoriteToken)}
function refreshReels(){reels=[...document.querySelectorAll(".ma7alak-reel[data-reel-id]")];return reels}
let m7InitialReelStripResetDone=false;
function resetReelsStripToStart(){
  if(!reelsContainer)return;
  const reset=()=>{
    try{
      reelsContainer.scrollTo({left:0,top:0,behavior:"auto"});
    }catch(_){
      reelsContainer.scrollLeft=0;
    }
    if(reelsContainer.scrollLeft!==0)reelsContainer.scrollLeft=0;
  };
  reset();
  requestAnimationFrame(reset);
  setTimeout(reset,80);
  setTimeout(reset,240);
}
function card(row){let d=document.createElement("div");d.className="ma7alak-reel";d.dataset.reelId=row.reel_id;d.dataset.shopName=row.shop_name||"Shop";d.dataset.shopUrl=row.shop_url||"";d.dataset.shopIcon=row.shop_icon||"";d.dataset.videoUrl=row.video_url||"";d.innerHTML=`<video class="ma7alak-video" muted loop playsinline webkit-playsinline preload="none"></video><div class="reel-info" role="link" tabindex="0"><img class="reel-shop-icon" src="${esc(row.shop_icon||"")}" alt="${esc(row.shop_name||"Shop")}" loading="lazy" decoding="async"><div class="reel-info-text"><strong>${esc(row.shop_name||"Shop")}</strong><span>${esc(row.caption||"")}</span></div></div>`;return d}
function ensureCardVideo(v){if(!v||v.dataset.m7Loaded==="1")return;let reel=v.closest(".ma7alak-reel"),src=reel?.dataset.videoUrl||"";if(!/^https?:\/\//i.test(src))return;v.src=src;v.dataset.m7Loaded="1";v.load()}
function bindCard(reel){let v=reel.querySelector("video"),info=reel.querySelector(".reel-info"),sx=0,sy=0,swiped=false;v.draggable=false;v.addEventListener("timeupdate",()=>{if(!viewer.classList.contains("open")&&v.currentTime>=1){v.currentTime=0;v.play().catch(()=>{})}});v.addEventListener("error",()=>{let tries=Number(v.dataset.m7VideoRetry||0);if(tries>=2)return;v.dataset.m7VideoRetry=String(tries+1);v.dataset.m7Loaded="";try{v.pause();v.removeAttribute("src");v.load()}catch(_){}setTimeout(()=>{let r=reel.getBoundingClientRect();if(r.bottom>-120&&r.top<innerHeight+180){ensureCardVideo(v);v.muted=true;v.play().catch(()=>{})}},700*(tries+1))});v.addEventListener("touchstart",e=>{sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY;swiped=false},{passive:true});v.addEventListener("touchmove",e=>{let t=e.changedTouches[0];if(Math.abs(t.clientX-sx)>10&&Math.abs(t.clientX-sx)>Math.abs(t.clientY-sy))swiped=true},{passive:true});v.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();if(swiped){swiped=false;return}openViewer(reel)});let openShop=e=>{e.preventDefault();e.stopPropagation();if(reel.dataset.shopUrl)window.top.location.href=reel.dataset.shopUrl};info.onclick=openShop;info.onkeydown=e=>{if(e.key==="Enter"||e.key===" ")openShop(e)};observer.observe(v)}
const REEL_RETRY_DELAYS=[350,900,1900,4000,8000];

function scheduleReelRetry(){
  clearTimeout(reelRetryTimer);

  const delay=
    REEL_RETRY_DELAYS[
      Math.min(
        reelRetryIndex++,
        REEL_RETRY_DELAYS.length-1
      )
    ];

  reelRetryTimer=setTimeout(
    ()=>{
      if(!document.hidden){
        loadReels();
      }
    },
    delay
  );
}

function primeVisibleReelCards(){
  requestAnimationFrame(()=>{
    refreshReels().forEach(reel=>{
      const video=reel.querySelector("video");

      if(!video){
        return;
      }

      const rect=reel.getBoundingClientRect();

      if(
        rect.bottom>-120 &&
        rect.top<innerHeight+180
      ){
        ensureCardVideo(video);
        video.muted=true;
        video.play().catch(()=>{});
      }
    });
  });
}

async function loadReels(){
  if(loading){
    reelReloadQueued=true;
    return;
  }

  loading=true;

  try{
    const result=await withHomeFeedTimeout(
      sb.from("shop_reels")
        .select("reel_id,shop_slug,shop_name,shop_url,shop_icon,video_url,caption,created_at")
        .eq("active",true)
        .order("created_at",{ascending:false}),
      "Homepage Reels refresh"
    );

    if(result.error){
      throw result.error;
    }

    const rows=
      (result.data||[])
        .filter(
          row=>
            String(row?.reel_id||"").trim() &&
            /^https?:\/\//i.test(
              String(row?.video_url||"").trim()
            )
        );

    reelRetryIndex=0;
    clearTimeout(reelRetryTimer);
    reelRetryTimer=null;

    const nextSignature=
      JSON.stringify(
        rows.map(
          row=>[
            row.reel_id,
            row.shop_slug,
            row.shop_name,
            row.shop_url,
            row.shop_icon,
            row.video_url,
            row.caption,
            row.created_at
          ]
        )
      );

    if(
      nextSignature===reelDataSignature &&
      reelsContainer.querySelectorAll("[data-reel-id]").length===rows.length
    ){
      refreshReels();
      primeVisibleReelCards();
      sendReelsState();
      return;
    }

    reelDataSignature=nextSignature;

    reelsContainer
      .querySelectorAll("[data-reel-id]")
      .forEach(
        node=>node.remove()
      );

    if(!window.__M7_REELS_SHUFFLED__){
      for(
        let i=rows.length-1;
        i>0;
        i--
      ){
        const j=
          Math.floor(
            Math.random()*
            (i+1)
          );

        [
          rows[i],
          rows[j]
        ]=[
          rows[j],
          rows[i]
        ];
      }

      window.__M7_REELS_SHUFFLED__=1;
      window.__M7_REEL_ORDER__=
        rows.map(
          row=>String(row.reel_id)
        );
    }
    else{
      const order=
        window.__M7_REEL_ORDER__||
        [];

      const pos=
        new Map(
          order.map(
            (id,index)=>[
              id,
              index
            ]
          )
        );

      rows.sort(
        (a,b)=>
          (
            pos.has(String(a.reel_id))
              ? pos.get(String(a.reel_id))
              : -1
          )-
          (
            pos.has(String(b.reel_id))
              ? pos.get(String(b.reel_id))
              : -1
          )
      );

      window.__M7_REEL_ORDER__=
        rows.map(
          row=>String(row.reel_id)
        );
    }

    const soon=
      reelsContainer.querySelector(
        ".coming-soon-reel"
      );

    rows.forEach(
      row=>{
        const reel=card(row);
        reelsContainer.insertBefore(
          reel,
          soon
        );
        bindCard(reel);
      }
    );

    refreshReels();

    if(!m7InitialReelStripResetDone){
      m7InitialReelStripResetDone=true;
      resetReelsStripToStart();
    }

    primeVisibleReelCards();
    sendReelsState();
  }
  catch(error){
    console.error(
      "Live Reels:",
      error
    );

    scheduleReelRetry();
  }
  finally{
    loading=false;

    if(reelReloadQueued){
      reelReloadQueued=false;
      setTimeout(
        loadReels,
        0
      );
    }
  }
}

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

  if(viewerVideo.__m7WatchedHandler){
    viewerVideo.removeEventListener(
      "playing",
      viewerVideo.__m7WatchedHandler
    );
    viewerVideo.__m7WatchedHandler=null;
  }

  viewerVideo.__m7WatchedHandler=()=>{
    if(
      viewerIndex===
      reels.indexOf(reel)
    ){
      try{
        window.postMessage({
          type:"MA7ALAK_REEL_WATCHED",
          reelId:String(reel.dataset.reelId||""),
          video:String(reel.dataset.videoUrl||""),
          shopUrl:String(reel.dataset.shopUrl||"")
        },"*");
      }
      catch(_){}
    }

    viewerVideo.__m7WatchedHandler=null;
  };

  viewerVideo.addEventListener(
    "playing",
    viewerVideo.__m7WatchedHandler,
    {once:true}
  );

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
let viewerReturnScrollY=0,viewerHistoryArmed=false,viewerCloseFallbackTimer=null;
function rememberViewerPosition(){viewerReturnScrollY=Math.max(0,window.scrollY||document.documentElement.scrollTop||0)}
function restoreViewerPosition(){let y=viewerReturnScrollY;requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:"auto"}));setTimeout(()=>window.scrollTo({top:y,left:0,behavior:"auto"}),90)}
function armViewerBack(){if(viewerHistoryArmed)return;try{history.pushState({...history.state,__m7ReelViewer:true},"",location.href);viewerHistoryArmed=true}catch(_){}}
let viewerNativeFullscreenOwned=false,viewerNativeFullscreenClosing=false;
function reelFullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement||null}
function requestNativeViewerFullscreen(){
  armViewerBack();
  if(reelFullscreenElement())return;
  try{
    let p;
    if(typeof viewer.requestFullscreen==="function"){
      p=viewer.requestFullscreen({navigationUI:"hide"});
    }else if(typeof viewer.webkitRequestFullscreen==="function"){
      p=viewer.webkitRequestFullscreen();
    }else{
      return;
    }
    if(p&&typeof p.then==="function"){
      p.then(()=>{viewerNativeFullscreenOwned=reelFullscreenElement()===viewer}).catch(()=>{viewerNativeFullscreenOwned=false});
    }
  }catch(_){viewerNativeFullscreenOwned=false}
}
function exitNativeViewerFullscreen(){
  if(reelFullscreenElement()!==viewer){viewerNativeFullscreenOwned=false;return}
  viewerNativeFullscreenClosing=true;
  viewerNativeFullscreenOwned=false;
  try{
    let p;
    if(typeof document.exitFullscreen==="function")p=document.exitFullscreen();
    else if(typeof document.webkitExitFullscreen==="function")p=document.webkitExitFullscreen();
    if(p&&typeof p.finally==="function")p.finally(()=>{viewerNativeFullscreenClosing=false});
    else setTimeout(()=>{viewerNativeFullscreenClosing=false},80);
  }catch(_){viewerNativeFullscreenClosing=false}
}
function openViewer(reel){
  refreshReels();stopCards();
  if(!reel?.dataset.videoUrl)return;
  rememberViewerPosition();
  if(viewer.parentNode!==document.body)document.body.appendChild(viewer);
  /* Make the viewer visible and request native fullscreen synchronously from
     the user's tap. This is required by Chrome's transient-user-activation rule. */
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden","false");
  requestNativeViewerFullscreen();
  loadViewer(reel);
}
function moveViewer(step){refreshReels();if(!reels.length)return;viewerIndex=(viewerIndex+step+reels.length)%reels.length;stopCards();loadViewer(reels[viewerIndex],step>0?"next":"prev")}
function finishViewerClose(){document.documentElement.classList.remove("m7-reel-open");document.body.classList.remove("m7-reel-open");viewerVideo.pause();viewerVideo.muted=true;viewerVideo.removeAttribute("src");viewerVideo.load();viewer.classList.remove("open");viewer.setAttribute("aria-hidden","true");exitNativeViewerFullscreen();restoreViewerPosition();let card=reels[viewerIndex],v=card?.querySelector("video");if(card&&v){setTimeout(()=>{let r=card.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth){ensureCardVideo(v);v.muted=true;v.play().catch(()=>{})}},110)}}
function closeViewer(fromPopState=false){
  clearTimeout(viewerCloseFallbackTimer);
  if(!viewer.classList.contains("open")){if(fromPopState)viewerHistoryArmed=false;return}
  if(fromPopState){viewerHistoryArmed=false;finishViewerClose();return}
  if(viewerHistoryArmed){
    try{
      history.back();
      viewerCloseFallbackTimer=setTimeout(()=>{if(viewer.classList.contains("open")){viewerHistoryArmed=false;finishViewerClose()}},260);
      return
    }catch(_){viewerHistoryArmed=false}
  }
  finishViewerClose()
}
function bindViewerTap(el,handler){
  if(!el)return;
  let pointerHandledAt=0;
  ["touchstart","touchmove","touchend","touchcancel"].forEach(type=>el.addEventListener(type,e=>e.stopPropagation(),{passive:true}));
  el.addEventListener("pointerdown",e=>{e.stopPropagation()},{passive:true});
  el.addEventListener("pointerup",e=>{
    if(e.pointerType==="touch"||e.pointerType==="pen"){
      e.preventDefault();e.stopPropagation();pointerHandledAt=Date.now();handler(e);
    }
  });
  el.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    if(Date.now()-pointerHandledAt<650)return;
    handler(e);
  });
}
bindViewerTap(viewerClose,()=>closeViewer());
bindViewerTap(viewerShop,()=>{if(viewerShop.dataset.shopUrl)window.top.location.href=viewerShop.dataset.shopUrl});
let viewerFavoriteBusy=false;
bindViewerTap(viewerFav,async()=>{
  if(viewerFavoriteBusy)return;
  let reel=reels[viewerIndex],id=reel?.dataset.reelId;
  if(!id)return;
  viewerFavoriteBusy=true;viewerFav.disabled=true;
  try{
    if(favoriteIds.has(id)){
      let r=await sb.rpc("remove_my_favorite",{p_visitor_id:visitorId,p_favorite_token:favoriteToken,p_reel_id:id});
      if(!r.error)favoriteIds.delete(id);
    }else{
      let r=await sb.rpc("add_my_favorite",{p_visitor_id:visitorId,p_favorite_token:favoriteToken,p_reel_id:id});
      if(!r.error&&r.data!==false)favoriteIds.add(id);
    }
    favCount.textContent=String(favoriteIds.size);
    if(savedCount)savedCount.textContent=String(favoriteIds.size);
    updateViewerFav();
    if(savedDrawer?.classList.contains("open"))renderSavedDrawer();
    await syncFavorites();
  }finally{
    viewerFavoriteBusy=false;viewerFav.disabled=false;
  }
});
let tx=0,ty=0,tt=0;viewer.addEventListener("touchstart",e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY;tt=Date.now()},{passive:true});viewer.addEventListener("touchend",e=>{let t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Date.now()-tt<700&&Math.abs(dy)>70&&Math.abs(dy)>Math.abs(dx))moveViewer(dy<0?1:-1)},{passive:true});
window.addEventListener("popstate",()=>{if(viewer.classList.contains("open")){closeViewer(true);return}if(savedDrawer?.classList.contains("open")){closeSavedDrawer(true);return}viewerHistoryArmed=false;savedHistoryArmed=false});
document.addEventListener("keydown",e=>{if(!viewer.classList.contains("open"))return;if(e.key==="Escape")closeViewer();if(e.key==="ArrowUp")moveViewer(1);if(e.key==="ArrowDown")moveViewer(-1)});
function onViewerFullscreenChange(){
  const current=reelFullscreenElement();
  if(current===viewer){
    viewerNativeFullscreenOwned=true;
    return;
  }
  if(viewerNativeFullscreenClosing){
    viewerNativeFullscreenClosing=false;
    return;
  }
  /* If Chrome/Brave exits native fullscreen itself, close the Reel viewer too
     so the user does not fall back into a half-fullscreen browser state. */
  if(viewerNativeFullscreenOwned&&viewer.classList.contains("open")){
    viewerNativeFullscreenOwned=false;
    closeViewer();
  }
}
document.addEventListener("fullscreenchange",onViewerFullscreenChange);
document.addEventListener("webkitfullscreenchange",onViewerFullscreenChange);
const observer=new IntersectionObserver(es=>es.forEach(e=>{let v=e.target;if(e.isIntersecting&&!viewer.classList.contains("open")&&!document.hidden){ensureCardVideo(v);v.muted=true;v.play().catch(()=>{})}else{v.pause();v.muted=true}}),{rootMargin:"80px 80px",threshold:.05});
function unloadSavedMedia(){
  if(!savedBody)return;
  savedBody.querySelectorAll("video").forEach(v=>{
    try{v.pause();v.removeAttribute("src");v.load()}catch(_){}
  });
}
function renderSavedDrawer(){
  if(!savedBody||!savedDrawer?.classList.contains("open"))return;
  refreshReels();
  const saved=reels.filter(r=>favoriteIds.has(String(r.dataset.reelId)));
  savedCount.textContent=String(saved.length);
  if(!saved.length){
    savedBody.innerHTML='<div class="m7-saved-empty"><div class="star">☆</div><strong>No saved Reels yet</strong><span>Save a Reel and it’ll appear here.</span></div>';
    return;
  }
  savedBody.innerHTML='<div class="m7-saved-track"></div>';
  const track=savedBody.querySelector(".m7-saved-track");
  saved.forEach(reel=>{
    const id=String(reel.dataset.reelId||"");
    const cardEl=document.createElement("article");
    cardEl.className="m7-saved-card";
    cardEl.dataset.reelId=id;
    const icon=String(reel.dataset.shopIcon||"");
    const name=String(reel.dataset.shopName||"Shop");
    const caption=String(reel.querySelector(".reel-info-text span")?.textContent||"");
    cardEl.innerHTML=`<video muted playsinline webkit-playsinline preload="metadata"></video><button class="m7-saved-remove" type="button" aria-label="Remove saved Reel">★</button><div class="m7-saved-card-info">${icon?`<img src="${esc(icon)}" alt="" loading="lazy" decoding="async">`:""}<div class="m7-saved-card-copy"><strong>${esc(name)}</strong><small>${esc(caption||"Saved Reel")}</small></div></div>`;
    const preview=cardEl.querySelector("video");
    preview.src=reel.dataset.videoUrl||"";
    preview.muted=true;
    preview.loop=false;
    preview.autoplay=false;
    preview.playsInline=true;
    preview.addEventListener("loadedmetadata",()=>{
      try{
        const seek=Math.min(.12,Math.max(0,(preview.duration||1)-.05));
        if(Number.isFinite(seek)&&seek>0)preview.currentTime=seek;
      }catch(_){}
    },{once:true});
    preview.addEventListener("play",()=>preview.pause());
    cardEl.querySelector(".m7-saved-remove").onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      const btn=e.currentTarget;btn.disabled=true;
      const r=await sb.rpc("remove_my_favorite",{p_visitor_id:visitorId,p_favorite_token:favoriteToken,p_reel_id:id});
      btn.disabled=false;
      if(!r.error){
        favoriteIds.delete(id);
        favCount.textContent=String(favoriteIds.size);
        savedCount.textContent=String(favoriteIds.size);
        updateViewerFav();
        renderSavedDrawer();
        try{window.dispatchEvent(new CustomEvent("ma7alakFavoritesChanged"))}catch(_){}
        try{const bc=new BroadcastChannel("ma7alak-favorites");bc.postMessage({reelId:id});bc.close()}catch(_){}
      }
    };
    cardEl.onclick=e=>{
      if(e.target.closest(".m7-saved-remove"))return;
      const liveReel=reels.find(r=>String(r.dataset.reelId)===id);
      if(liveReel)openViewer(liveReel);
    };
    track.appendChild(cardEl);
  });
}
function armSavedHistory(){
  if(savedHistoryArmed)return;
  try{history.pushState({...history.state,__m7SavedDrawer:true},"",location.href);savedHistoryArmed=true}catch(_){}
}
function openSavedDrawer(){
  if(!savedDrawer)return;
  unloadSavedMedia();
  savedDrawer.classList.add("open");
  savedDrawer.setAttribute("aria-hidden","false");
  document.documentElement.classList.add("m7-saved-open");
  document.body.classList.add("m7-saved-open");
  armSavedHistory();
  renderSavedDrawer();
}
function finishSavedClose(){
  clearTimeout(savedCloseFallbackTimer);
  savedHistoryArmed=false;
  unloadSavedMedia();
  if(savedBody)savedBody.innerHTML="";
  savedDrawer?.classList.remove("open");
  savedDrawer?.setAttribute("aria-hidden","true");
  document.documentElement.classList.remove("m7-saved-open");
  document.body.classList.remove("m7-saved-open");
}
function closeSavedDrawer(fromPopState=false){
  clearTimeout(savedCloseFallbackTimer);
  if(!savedDrawer?.classList.contains("open")){if(fromPopState)savedHistoryArmed=false;return}
  if(fromPopState){finishSavedClose();return}
  if(savedHistoryArmed){
    try{
      history.back();
      savedCloseFallbackTimer=setTimeout(()=>{if(savedDrawer.classList.contains("open"))finishSavedClose()},260);
      return;
    }catch(_){}
  }
  finishSavedClose();
}
async function syncFavorites(){
  let r=await sb.rpc("get_my_favorites",{p_visitor_id:visitorId,p_favorite_token:favoriteToken});
  if(!r.error){
    favoriteIds=new Set((r.data||[]).map(x=>String(x.reel_id)));
    favCount.textContent=String(favoriteIds.size);
    if(savedCount)savedCount.textContent=String(favoriteIds.size);
    updateViewerFav();
    if(savedDrawer?.classList.contains("open"))renderSavedDrawer();
  }
}
savedButton.onclick=e=>{e.preventDefault();openSavedDrawer()};
savedClose.onclick=e=>{e.preventDefault();e.stopPropagation();closeSavedDrawer()};
savedDrawer.addEventListener("click",e=>{if(e.target===savedDrawer)closeSavedDrawer()});
function reelsData(){return refreshReels().map(r=>({id:r.dataset.reelId,shop:r.dataset.shopName,shopUrl:r.dataset.shopUrl,icon:r.dataset.shopIcon,video:r.dataset.videoUrl||""}))}
function sendReelsState(){let data=reelsData();window.postMessage({type:"MA7ALAK_REELS_STATE",source:"ma7alak-reels-embed",authoritative:true,sentAt:Date.now(),reelIds:data.map(x=>[x.id,x.video,x.shopUrl].join("::")),reels:data},"*")}
function openRandomReel(){let a=refreshReels();if(!a.length)return;let candidates=a.length>1&&lastRandom?a.filter(r=>r.dataset.reelId!==lastRandom):a,reel=candidates[Math.floor(Math.random()*candidates.length)];lastRandom=reel.dataset.reelId;openViewer(reel)}
loadReels();syncFavorites();window.addEventListener("pageshow",()=>{resetReelsStripToStart();primeVisibleReelCards();loadReels()});channel=sb.channel("ma7alak-combined-reels").on("postgres_changes",{event:"*",schema:"public",table:"shop_reels"},()=>{loadReels()}).subscribe();setInterval(()=>{if(!document.hidden)sendReelsState()},10000);let m7HomeWakeAt=0;function refreshHomeFeedOnWake(){const now=Date.now();if(document.hidden||now-m7HomeWakeAt<800)return;m7HomeWakeAt=now;loadReels();syncFavorites();try{window.Ma7alakLiveOffers?.refresh?.()}catch(_){}try{window.postMessage({type:"MA7ALAK_LIVE_OFFERS_GET",shopSlug:""},"*")}catch(_){}}window.addEventListener("ma7alak:page-wake",refreshHomeFeedOnWake);window.addEventListener("pageshow",refreshHomeFeedOnWake);document.addEventListener("visibilitychange",()=>{if(document.hidden){unloadSavedMedia()}else{refreshHomeFeedOnWake();if(savedDrawer?.classList.contains("open"))renderSavedDrawer()}});
})(sb);

 const client=sb;
 if(client){
   client.from("homepage_layout_settings").select("*").eq("key","live_offers_reels").maybeSingle().then(r=>{if(r.data){cfg.enabled=r.data.enabled!==false;place();}});
   client.channel("m7-original-home-layout").on("postgres_changes",{event:"*",schema:"public",table:"homepage_layout_settings",filter:"key=eq.live_offers_reels"},p=>{if(p.new){cfg.enabled=p.new.enabled!==false;place();}}).subscribe();
 }
 return true;
}

function m7ScheduleHomeFeedDataStart(){
  if(m7StartHomeFeedData()){
    m7HomeFeedStartIndex=0;
    return;
  }
  if(m7HomeFeedStartTimer)return;
  if(m7HomeFeedStartIndex>=M7_HOME_FEED_START_DELAYS.length){
    m7HomeFeedStartIndex=0;
    console.warn("SHOUFHON home feed: Supabase still unavailable; will retry on next page wake.");
    return;
  }
  const delay=M7_HOME_FEED_START_DELAYS[m7HomeFeedStartIndex++];
  m7HomeFeedStartTimer=setTimeout(()=>{
    m7HomeFeedStartTimer=null;
    m7ScheduleHomeFeedDataStart();
  },delay);
}

m7ScheduleHomeFeedDataStart();
window.addEventListener("pageshow",()=>{if(!m7HomeFeedDataStarted)m7ScheduleHomeFeedDataStart()});
window.addEventListener("focus",()=>{if(!m7HomeFeedDataStarted)m7ScheduleHomeFeedDataStart()});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&!m7HomeFeedDataStarted)m7ScheduleHomeFeedDataStart()});

}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",m7Mount,{once:true});else m7Mount();
})();