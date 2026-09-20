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

/* Route every opening-header “Add your shop” action to the new plan page. */
(function(){
  function sync(){document.querySelectorAll('#ma7alak-opening-header-root a[href*="dhyf-mhlk-"]').forEach(function(link){link.href="https://shoufhon.com/add-shop-";link.onclick=function(e){e.preventDefault();window.top.location.href="https://shoufhon.com/add-shop-"}})}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
  const observer=new MutationObserver(sync);observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){observer.disconnect()},15000);
})();


/* =========================================================
   SHOUFHON HOMEPAGE BUNDLE
   Opening Header + Happening Today + Reels
   The feed module below is the exact verified ma7alak-home-feed.js logic.
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
\n/* LIVE */\n#m7-live-home{width:100%;padding:18px;border-radius:25px;background:linear-gradient(145deg,#12110f,#070707);border:1px solid rgba(228,170,79,.18);box-shadow:0 18px 45px #0004;overflow:hidden}\n.m7-live-head{margin-bottom:15px}.m7-live-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.m7-live-status{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:900;letter-spacing:2px}.m7-live-status i{display:block;width:10px;height:10px;border-radius:50%;background:#777;transform:translateZ(0)}.m7-live-active .m7-live-status i{background:#36dc82;-webkit-animation:m7pulse 1.25s ease-out infinite;animation:m7pulse 1.25s ease-out infinite;will-change:transform,box-shadow,opacity}#m7-live-count{padding:6px 9px;border:1px solid #ffffff17;border-radius:99px;background:#ffffff0a;color:#ffffff7a;font-size:9px;font-weight:900;letter-spacing:.7px}@-webkit-keyframes m7pulse{0%{-webkit-transform:scale(.9);box-shadow:0 0 0 0 #36dc82cc,0 0 10px #36dc82aa}55%{-webkit-transform:scale(1.08);box-shadow:0 0 0 9px #36dc8218,0 0 18px #36dc8299}100%{-webkit-transform:scale(.9);box-shadow:0 0 0 13px #36dc8200,0 0 5px #36dc8244}}@keyframes m7pulse{0%{transform:scale(.9);box-shadow:0 0 0 0 #36dc82cc,0 0 10px #36dc82aa}55%{transform:scale(1.08);box-shadow:0 0 0 9px #36dc8218,0 0 18px #36dc8299}100%{transform:scale(.9);box-shadow:0 0 0 13px #36dc8200,0 0 5px #36dc8244}}\n#m7-live-home h2{margin:9px 0 5px;font-size:30px;line-height:1.04;letter-spacing:-.8px}.m7-live-head p{margin:0;color:#ffffff7a;font-size:13px}.m7-live-cards{display:flex;gap:13px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 2px 9px}.m7-live-cards::-webkit-scrollbar{display:none}.m7-live-card{position:relative;flex:0 0 88%;height:470px;scroll-snap-align:start;overflow:hidden;border-radius:23px;border:1px solid #36dc824d;background:#111;box-shadow:0 14px 34px #0006;cursor:pointer;isolation:isolate;-webkit-animation:m7cardglow 2.4s ease-in-out infinite;animation:m7cardglow 2.4s ease-in-out infinite;will-change:box-shadow,border-color}.m7-live-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.m7-live-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 15%,#0002 40%,#000 100%)}.m7-live-copy{position:absolute;z-index:2;left:17px;right:17px;bottom:17px}.m7-live-badge{display:inline-flex;padding:7px 10px;border-radius:99px;background:#050505e0;border:1px solid #ffffff26;font-size:10px;font-weight:900}.m7-live-title{margin:10px 0 9px;font-size:25px;line-height:1.08;font-weight:900}.m7-shop-line{display:flex;align-items:center;gap:10px;min-width:0}.m7-shop-avatar{position:relative;z-index:1;isolation:isolate;flex:0 0 42px;width:42px;height:42px;padding:3px;border-radius:50%;background:#07110c;box-shadow:0 0 18px #36dc8273;transform:translateZ(0);-webkit-animation:m7avatarglow 1.55s ease-in-out infinite;animation:m7avatarglow 1.55s ease-in-out infinite;will-change:box-shadow}.m7-shop-avatar:before{content:"";position:absolute;z-index:-1;inset:-3px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 12%,#36dc82 24%,#b7ffd7 31%,#36dc82 38%,transparent 52% 72%,#36dc82 86%,transparent 100%);-webkit-animation:m7spin 1.35s linear infinite;animation:m7spin 1.35s linear infinite;will-change:transform}.m7-shop-avatar:after{content:"";position:absolute;z-index:-2;inset:-7px;border:2px solid #36dc8266;border-radius:50%;-webkit-animation:m7ring 1.55s ease-out infinite;animation:m7ring 1.55s ease-out infinite;will-change:transform,opacity}.m7-shop-avatar img,.m7-avatar-fallback{position:relative;z-index:2;display:flex;width:100%;height:100%;border:2px solid #07100b;border-radius:50%;object-fit:cover;background:#171717;align-items:center;justify-content:center;color:#efbd70;font-weight:900;-webkit-transform:translateZ(0);transform:translateZ(0)}@-webkit-keyframes m7spin{to{-webkit-transform:rotate(360deg)}}@keyframes m7spin{to{transform:rotate(360deg)}}@-webkit-keyframes m7ring{0%{-webkit-transform:scale(.78);opacity:.95}100%{-webkit-transform:scale(1.35);opacity:0}}@keyframes m7ring{0%{transform:scale(.78);opacity:.95}100%{transform:scale(1.35);opacity:0}}@-webkit-keyframes m7avatarglow{0%,100%{box-shadow:0 0 10px #36dc8266}50%{box-shadow:0 0 27px #36dc82cc}}@keyframes m7avatarglow{0%,100%{box-shadow:0 0 10px #36dc8266}50%{box-shadow:0 0 27px #36dc82cc}}@-webkit-keyframes m7cardglow{0%,100%{border-color:#36dc8238;box-shadow:0 14px 34px #0006,0 0 0 #36dc8200}50%{border-color:#36dc8273;box-shadow:0 14px 34px #0006,0 0 18px #36dc822e}}@keyframes m7cardglow{0%,100%{border-color:#36dc8238;box-shadow:0 14px 34px #0006,0 0 0 #36dc8200}50%{border-color:#36dc8273;box-shadow:0 14px 34px #0006,0 0 18px #36dc822e}}.m7-shop-info{min-width:0}.m7-shop-name{overflow:hidden;color:#efbd70;font-size:13px;font-weight:900;text-overflow:ellipsis;white-space:nowrap}.m7-shop-now{margin-top:3px;color:#36dc82;font-size:9px;font-weight:900;letter-spacing:1px;text-shadow:0 0 10px #36dc8299}.m7-live-price{margin-top:9px;color:#f1bb61;font-size:23px;font-weight:900}.m7-live-old{margin-right:7px;color:#ffffff73;text-decoration:line-through;font-size:13px}.m7-live-times{display:flex;justify-content:space-between;gap:8px;margin-top:10px;padding-top:9px;border-top:1px solid #ffffff1a;color:#ffffff9e;font-size:10px;font-weight:800}.m7-live-empty{width:100%;min-height:105px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;text-align:center;border:1px solid #36dc8221;border-radius:18px;background:#36dc8208;color:#ffffff73}.m7-live-empty b{color:#ffffffb8;font-size:14px}.m7-live-empty small{margin-top:5px;font-size:11px}\n/* REELS — naturally follows LIVE with no reserved gap */\n.ma7alak-reels-wrapper{position:relative;width:100%;margin:28px 0 14px;padding:15px 0 14px}.ma7alak-reels-wrapper:before,.ma7alak-reels-wrapper:after{content:"";position:absolute;left:50%;width:100vw;height:3px;transform:translateX(-50%);background:#ffffff1a;box-shadow:0 1px #0009}.ma7alak-reels-wrapper:before{top:0}.ma7alak-reels-wrapper:after{bottom:0}.ma7alak-reels-title{display:flex;align-items:center;gap:8px;margin:0 0 10px 4px;font-size:20px;font-weight:800}.ma7alak-reels{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;padding:5px 4px 14px;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}.ma7alak-reels::-webkit-scrollbar{display:none}.ma7alak-reel{position:relative;flex:0 0 290px;height:515px;border-radius:22px;overflow:hidden;background:#0d0d0e;border:1px solid #e2b45b38;scroll-snap-align:start;scroll-snap-stop:always}.ma7alak-video{width:100%;height:100%;display:block;object-fit:cover;cursor:pointer}.reel-info{position:absolute;left:14px;right:14px;bottom:14px;z-index:10;display:flex;align-items:center;gap:11px;padding:10px 13px;border:1px solid #ffffff12;border-radius:15px;background:linear-gradient(to top,#0006,#0001);backdrop-filter:blur(5px);cursor:pointer}.reel-shop-icon{width:42px;height:42px;min-width:42px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover;background:#171717}.reel-info-text{min-width:0;display:flex;flex-direction:column;gap:3px;overflow:hidden}.reel-info-text strong,.reel-info-text span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px #000}.reel-info-text strong{font-size:17px}.reel-info-text span{font-size:12px;color:#fffffff5}.coming-soon{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#f5d48a;background:radial-gradient(circle,#e2b45b17,transparent 60%)}.coming-soon span{font-size:42px}.ma7alak-favorites-corner{display:flex;justify-content:flex-end;margin-top:8px;padding:0 6px}.ma7alak-favorites-button{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border:1px solid #e2b45b4d;border-radius:99px;background:linear-gradient(135deg,#e2b45b21,#000a);color:#f5d48a;font-size:13px;font-weight:700}.ma7alak-favorites-button b{min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#e2b45b;color:#111;font-size:11px}\n/* VIEWER */\n.ma7alak-reel-viewer{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;background:#000;overflow:hidden;touch-action:none}.ma7alak-reel-viewer.open{display:flex}.ma7alak-reel-viewer-video{position:absolute;inset:5px;width:calc(100vw - 10px);height:calc(100dvh - 10px);object-fit:contain;background:#000;border-radius:18px;transition:opacity .35s ease,transform .45s cubic-bezier(.16,1,.3,1)}.ma7alak-reel-viewer-shop{position:absolute;top:15px;left:10px;z-index:2147483646;max-width:70%;display:flex;align-items:center;gap:9px;padding:6px 13px 6px 6px;border:1px solid #ffffff3d;border-radius:99px;background:#000b;color:#fff;backdrop-filter:blur(14px)}.ma7alak-reel-viewer-shop img{width:40px;height:40px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover}.ma7alak-reel-viewer-shop span{min-width:0;display:flex;flex-direction:column;text-align:left}.ma7alak-reel-viewer-shop strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.ma7alak-reel-viewer-shop small{color:#ffffffad;font-size:10px}.ma7alak-reel-viewer-shop em{color:#f5d48a;font-size:18px;font-style:normal}.ma7alak-reel-viewer-close,.ma7alak-viewer-favorite{position:absolute;z-index:2147483646;display:flex;align-items:center;justify-content:center;border:1px solid #ffffff40;border-radius:50%;background:#000b;color:#fff;backdrop-filter:blur(12px)}.ma7alak-reel-viewer-close{top:14px;right:10px;width:45px;height:45px;font-size:31px}.ma7alak-viewer-favorite{right:10px;bottom:72px;width:50px;height:50px;font-size:28px}.ma7alak-viewer-favorite.active{color:#f5d48a;background:#e2b45b2b;border-color:#e2b45b8c}.ma7alak-swipe-hint{position:absolute;bottom:20px;left:50%;z-index:2147483645;transform:translateX(-50%);color:#ffffff73;font-size:11px;pointer-events:none}\n@media(max-width:600px){#m7-global-home-feed-shell{padding-left:10px!important;padding-right:10px!important}#m7-home-feed{min-width:0!important}#m7-live-home{width:100%!important;max-width:100%!important;min-width:0!important;padding:15px;border-radius:23px}#m7-live-home h2{font-size:27px}.m7-live-cards,.ma7alak-reels{max-width:100%!important;min-width:0!important;scroll-padding-inline:2px 10px}.m7-live-card{flex-basis:calc(100% - 20px)!important;max-width:calc(100% - 20px)!important;height:465px}.ma7alak-reel{flex-basis:min(68vw,290px)!important;max-width:calc(100vw - 42px)!important;height:auto;aspect-ratio:9/16;border-radius:18px}.reel-info{left:10px;right:10px;bottom:10px;padding:8px 10px}.reel-shop-icon{width:37px;height:37px;min-width:37px}.reel-info-text strong{font-size:15px}.reel-info-text span{font-size:10px}}\n/* Exact Lebanon schedule + live countdown. Only this text updates every second;\n   the card and its video stay mounted, preventing black flicker. */\n.m7-live-times{display:block;margin-top:11px;padding:10px 11px;border:1px solid #ffffff17;border-radius:13px;background:#050807b8}.m7-live-schedule{display:grid;gap:4px}.m7-live-schedule b{color:#fff;font-size:11px;line-height:1.25}.m7-live-schedule small{color:#36dc82;font-size:10px;font-weight:900;line-height:1.2;text-shadow:0 0 9px #36dc826b}.m7-live-schedule span{color:#ffffff9c;font-size:10px;font-weight:800;line-height:1.25}\n/* Live indicators intentionally remain animated on mobile, including browsers\n   that inherit Android\'s reduced-motion preference. */\n@media(prefers-reduced-motion:reduce){.ma7alak-reel-viewer-video{transition:none}.m7-live-status i,.m7-live-card,.m7-shop-avatar,.m7-shop-avatar:before,.m7-shop-avatar:after{-webkit-animation-play-state:running!important;animation-play-state:running!important}}\n\n/* FINAL HOSTINGER BACKGROUND LOCK
   The global feed owns NO page/background layer.
   Only the actual Live/Reel cards keep their original card styling. */
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
 const shell=document.createElement("div"); shell.id="m7-global-home-feed-shell"; shell.innerHTML=`<div id="m7-home-feed">\n  <section id="m7-live-home">\n    <div class="m7-live-head">\n      <div class="m7-live-top"><span class="m7-live-status"><i></i> LIVE</span><span id="m7-live-count">0 UPDATES</span></div>\n      <h2>🔥 Happening Today</h2>\n      <p id="m7-live-sub">Offers, events &amp; special things happening now</p>\n    </div>\n    <div id="m7-live-cards" class="m7-live-cards"><div class="m7-live-empty"><b>Loading live updates...</b></div></div>\n  </section>\n\n  <section class="ma7alak-reels-wrapper">\n    <div class="ma7alak-reels-title"><span>🎬</span><span>Reels</span></div>\n    <div class="ma7alak-reels"><div class="ma7alak-reel coming-soon-reel"><div class="coming-soon"><span>🎥</span><strong>New video coming soon</strong></div></div></div>\n    <div class="ma7alak-favorites-corner"><button id="ma7alakFavoritesButton" class="ma7alak-favorites-button" type="button"><span>⭐</span><span>Favorites</span><b id="ma7alakFavoritesCount">0</b></button></div>\n  </section>\n</div>\n\n<div id="ma7alakReelViewer" class="ma7alak-reel-viewer" aria-hidden="true">\n  <button id="ma7alakReelViewerShop" class="ma7alak-reel-viewer-shop" type="button"><img id="ma7alakReelViewerShopIcon" src="" alt="Shop"><span><strong id="ma7alakReelViewerShopName">Shop</strong><small>View shop</small></span><em>→</em></button>\n  <button id="ma7alakReelViewerClose" class="ma7alak-reel-viewer-close" type="button">×</button>\n  <button id="ma7alakViewerFavorite" class="ma7alak-viewer-favorite" type="button" aria-label="Add to favorites">☆</button>\n  <video id="ma7alakReelViewerVideo" class="ma7alak-reel-viewer-video" playsinline webkit-playsinline loop preload="none"></video>\n  <div class="ma7alak-swipe-hint">↑ &nbsp; Swipe &nbsp; ↓</div>\n</div>`;
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
     /* Permanent order: Opening Header -> separator -> Live/Reels.
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
function renderLive(){let n=livePosts.length;liveRoot.classList.toggle("m7-live-active",n>0);liveCount.textContent=`${n} ${n===1?"UPDATE":"UPDATES"}`;if(!n){liveSub.textContent="Offers, events & special things happening now";liveCards.innerHTML='<div class="m7-live-empty"><b>Nothing live right now</b><small>New updates will appear here automatically.</small></div>';return}liveSub.textContent=n===1?"1 update happening now":`${n} updates — swipe to see more`;liveCards.innerHTML=livePosts.map(x=>{let price=x.post_type==="offer"&&(x.original_price!=null||x.offer_price!=null)?`<div class="m7-live-price">${x.original_price!=null?`<span class="m7-live-old">$${esc(x.original_price)}</span>`:""}${x.offer_price!=null?`$${esc(x.offer_price)}`:""}</div>`:"";return`<article class="m7-live-card" data-live-id="${esc(x.id)}">${liveMedia(x)}<div class="m7-live-copy"><span class="m7-live-badge">${liveMeta(x.post_type)}</span><div class="m7-live-title">${esc(x.title)}</div><div class="m7-shop-line">${liveAvatar(x)}<div class="m7-shop-info"><div class="m7-shop-name">${esc(x.shop_name||x.shop_slug)}</div><div class="m7-shop-now">● LIVE NOW</div></div></div>${price}<div class="m7-live-times"><div class="m7-live-schedule" data-start="${esc(x.starts_at)}" data-end="${esc(x.ends_at)}"></div></div></div></article>`}).join("");liveCards.querySelectorAll("[data-live-id]").forEach(c=>c.onclick=()=>window.postMessage({type:"MA7ALAK_LIVE_OFFERS_VIEW",id:c.dataset.liveId},"*"));updateLiveTimers()}
let liveStateReceived=false;
const liveRequestTimers=[];
function stopLiveRequests(){while(liveRequestTimers.length)clearTimeout(liveRequestTimers.pop())}
addEventListener("message",e=>{let d=e.data||{};if((d.type==="MA7ALAK_LIVE_OFFERS_STATE"&&!d.shopSlug)||d.type==="MA7ALAK_LIVE_OFFERS_UPDATED"){liveStateReceived=true;stopLiveRequests();let next=Array.isArray(d.items)?d.items:[],signature=getLiveSignature(next);livePosts=next;if(signature!==liveSignature){liveSignature=signature;renderLive()}else updateLiveTimers()}if(d.type==="MA7ALAK_OPEN_REELS")openRandomReel()});
function requestLive(){if(!liveStateReceived)window.postMessage({type:"MA7ALAK_LIVE_OFFERS_GET",shopSlug:""},"*")}
[0,250,750,1500,3000,5000,8000,12000].forEach(ms=>liveRequestTimers.push(setTimeout(requestLive,ms)));
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
let viewerReturnScrollY=0,viewerHistoryArmed=false,viewerCloseFallbackTimer=null;
function rememberViewerPosition(){viewerReturnScrollY=Math.max(0,window.scrollY||document.documentElement.scrollTop||0)}
function restoreViewerPosition(){let y=viewerReturnScrollY;requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:"auto"}));setTimeout(()=>window.scrollTo({top:y,left:0,behavior:"auto"}),90)}
function armViewerBack(){if(viewerHistoryArmed)return;try{history.pushState({...history.state,__m7ReelViewer:true},"",location.href);viewerHistoryArmed=true}catch(_){}}
function requestNativeViewerFullscreen(){
  try{
    const fn=viewer.requestFullscreen||viewer.webkitRequestFullscreen;
    if(typeof fn!=="function"){armViewerBack();return}
    const p=fn.call(viewer,{navigationUI:"hide"});
    if(p&&typeof p.catch==="function")p.catch(()=>armViewerBack());
  }catch(_){armViewerBack()}
}
function openViewer(reel){refreshReels();stopCards();rememberViewerPosition();loadViewer(reel);requestNativeViewerFullscreen()}
function moveViewer(step){refreshReels();if(!reels.length)return;viewerIndex=(viewerIndex+step+reels.length)%reels.length;stopCards();loadViewer(reels[viewerIndex],step>0?"next":"prev")}
function finishViewerClose(){document.documentElement.classList.remove("m7-reel-open");document.body.classList.remove("m7-reel-open");viewerVideo.pause();viewerVideo.muted=true;viewerVideo.removeAttribute("src");viewerVideo.load();viewer.classList.remove("open");viewer.setAttribute("aria-hidden","true");restoreViewerPosition();let card=reels[viewerIndex],v=card?.querySelector("video");if(card&&v){setTimeout(()=>{let r=card.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth){ensureCardVideo(v);v.muted=true;v.play().catch(()=>{})}},110)}}
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
  try{
    const fs=document.fullscreenElement||document.webkitFullscreenElement;
    if(fs){
      const exit=document.exitFullscreen||document.webkitExitFullscreen;
      if(typeof exit==="function"){
        const p=exit.call(document);
        p?.catch?.(()=>{});
      }
    }
  }catch(_){}
  finishViewerClose()
}
viewerClose.onclick=e=>{e.stopPropagation();closeViewer()};viewerShop.onclick=e=>{e.stopPropagation();if(viewerShop.dataset.shopUrl)window.top.location.href=viewerShop.dataset.shopUrl};viewerFav.onclick=async e=>{e.stopPropagation();let reel=reels[viewerIndex],id=reel?.dataset.reelId;if(!id)return;viewerFav.disabled=true;if(favoriteIds.has(id)){let r=await sb.from("ma7alak_favorites").delete().eq("visitor_id",visitorId).eq("reel_id",id);if(!r.error)favoriteIds.delete(id)}else{let r=await sb.from("ma7alak_favorites").insert({visitor_id:visitorId,reel_id:id,shop_name:reel.dataset.shopName});if(!r.error)favoriteIds.add(id)}viewerFav.disabled=false;updateViewerFav();await syncFavorites()};
let tx=0,ty=0,tt=0;viewer.addEventListener("touchstart",e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY;tt=Date.now()},{passive:true});viewer.addEventListener("touchend",e=>{let t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Date.now()-tt<700&&Math.abs(dy)>70&&Math.abs(dy)>Math.abs(dx))moveViewer(dy<0?1:-1)},{passive:true});
window.addEventListener("popstate",()=>{if(viewer.classList.contains("open"))closeViewer(true);else viewerHistoryArmed=false});
document.addEventListener("keydown",e=>{if(!viewer.classList.contains("open"))return;if(e.key==="Escape")closeViewer();if(e.key==="ArrowUp")moveViewer(1);if(e.key==="ArrowDown")moveViewer(-1)});
const onViewerFullscreenChange=()=>{if(!(document.fullscreenElement||document.webkitFullscreenElement)&&viewer.classList.contains("open")&&!viewerHistoryArmed)finishViewerClose()};
document.addEventListener("fullscreenchange",onViewerFullscreenChange);document.addEventListener("webkitfullscreenchange",onViewerFullscreenChange);
const observer=new IntersectionObserver(es=>es.forEach(e=>{let v=e.target;if(e.isIntersecting&&!viewer.classList.contains("open")&&!document.hidden){ensureCardVideo(v);v.muted=true;v.play().catch(()=>{})}else{v.pause();v.muted=true}}),{rootMargin:"80px 80px",threshold:.05});
async function syncFavorites(){let r=await sb.from("ma7alak_favorites").select("reel_id").eq("visitor_id",visitorId);if(!r.error){favoriteIds=new Set((r.data||[]).map(x=>String(x.reel_id)));favCount.textContent=favoriteIds.size;updateViewerFav()}}
document.getElementById("ma7alakFavoritesButton").onclick=e=>{e.preventDefault();let msg={type:"ma7alak-scroll-favorites"};try{window.postMessage(msg,"*")}catch(_){}try{let bc=new BroadcastChannel("ma7alak-favorites-navigation");bc.postMessage(msg);bc.close()}catch(_){}};
function reelsData(){return refreshReels().map(r=>({id:r.dataset.reelId,shop:r.dataset.shopName,shopUrl:r.dataset.shopUrl,icon:r.dataset.shopIcon,video:r.dataset.videoUrl||""}))}
function sendReelsState(){let data=reelsData();if(!data.length)return;window.postMessage({type:"MA7ALAK_REELS_STATE",source:"ma7alak-reels-embed",sentAt:Date.now(),reelIds:data.map(x=>[x.id,x.video,x.shopUrl].join("::")),reels:data},"*")}
function openRandomReel(){let a=refreshReels();if(!a.length)return;let candidates=a.length>1&&lastRandom?a.filter(r=>r.dataset.reelId!==lastRandom):a,reel=candidates[Math.floor(Math.random()*candidates.length)];lastRandom=reel.dataset.reelId;openViewer(reel)}
loadReels();syncFavorites();channel=sb.channel("ma7alak-combined-reels").on("postgres_changes",{event:"*",schema:"public",table:"shop_reels"},loadReels).subscribe();setInterval(()=>{if(!document.hidden)sendReelsState()},10000);document.addEventListener("visibilitychange",()=>{if(!document.hidden){loadReels();syncFavorites()}});
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