/* =========================================================
   MA7ALAK — DOZE 3ALE FULL-PAGE CREPE BACKGROUND
   OVERLAY METHOD — HOSTINGER SAFE
   Activates ONLY on: https://ma7alak.com/doze-3ale

   METHOD:
   - Does NOT try to make Hostinger backgrounds transparent.
   - Places the decorative crepe/chocolate layer ABOVE Hostinger's page
     background, but BELOW all real page content.
   - pointer-events:none so it never blocks taps/clicks.
========================================================= */

(function () {
  "use strict";

  const TARGET_PATH = "/doze-3ale";
  const STYLE_ID = "ma7alak-doze-overlay-bg-style";
  const BG_ID = "ma7alak-doze-overlay-bg";

  function normalizePath(path) {
    let p = String(path || "/").replace(/\/+/g, "/");
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }

  function isTargetPage() {
    return normalizePath(window.location.pathname) === TARGET_PATH;
  }

  function removeDozeBackground() {
    const bg = document.getElementById(BG_ID);
    const style = document.getElementById(STYLE_ID);

    if (bg) bg.remove();
    if (style) style.remove();

    document.documentElement.classList.remove("ma7alak-doze-overlay-active");
    document.body.classList.remove("ma7alak-doze-overlay-active");
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      html.ma7alak-doze-overlay-active,
      body.ma7alak-doze-overlay-active{
        min-height:100%!important;
      }

      body.ma7alak-doze-overlay-active{
        position:relative!important;
        isolation:isolate!important;
      }

      /*
        IMPORTANT:
        This layer sits ABOVE Hostinger's own background,
        but BELOW your actual content.
      */
      #${BG_ID}{
        position:fixed!important;
        inset:0!important;
        width:100vw!important;
        height:100vh!important;
        width:100dvw!important;
        height:100dvh!important;
        z-index:2147483000!important;
        pointer-events:none!important;
        overflow:hidden!important;
        opacity:1!important;

        background:
          radial-gradient(circle at 14% 17%, rgba(130,62,28,.24), transparent 29%),
          radial-gradient(circle at 86% 22%, rgba(95,41,18,.21), transparent 30%),
          radial-gradient(circle at 17% 83%, rgba(103,47,21,.22), transparent 31%),
          radial-gradient(circle at 84% 77%, rgba(139,68,31,.18), transparent 31%),
          linear-gradient(180deg,
            rgba(27,13,8,.91) 0%,
            rgba(13,7,5,.89) 46%,
            rgba(22,10,6,.91) 100%
          )!important;
      }

      /*
        Put real page UI above our decorative overlay.
        We deliberately use an even higher z-index.
      */
      body.ma7alak-doze-overlay-active > *:not(#${BG_ID}){
        position:relative!important;
        z-index:2147483001!important;
      }

      /*
        Hostinger often nests the page inside one root wrapper.
        Keep the wrapper and its children above the background.
      */
      body.ma7alak-doze-overlay-active main,
      body.ma7alak-doze-overlay-active #root,
      body.ma7alak-doze-overlay-active #__next,
      body.ma7alak-doze-overlay-active [class*="website"],
      body.ma7alak-doze-overlay-active [class*="page-content"]{
        position:relative!important;
        z-index:2147483001!important;
      }

      #${BG_ID} svg{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        display:block!important;
      }

      #${BG_ID} .m7-dark-center{
        position:absolute!important;
        left:50%!important;
        top:50%!important;
        width:min(900px,92vw)!important;
        height:120vh!important;
        transform:translate(-50%,-50%)!important;
        background:
          radial-gradient(
            ellipse at center,
            rgba(6,4,3,.42) 0%,
            rgba(7,4,3,.31) 48%,
            rgba(7,4,3,.08) 72%,
            transparent 100%
          )!important;
        filter:blur(8px)!important;
      }

      #${BG_ID} .m7-vignette{
        position:absolute!important;
        inset:0!important;
        background:
          radial-gradient(
            ellipse at center,
            rgba(0,0,0,0) 34%,
            rgba(0,0,0,.18) 64%,
            rgba(0,0,0,.48) 100%
          )!important;
      }

      #${BG_ID} .m7-crepe-a{
        transform-box:fill-box;
        transform-origin:center;
        animation:m7CrepeFloatA 10s ease-in-out infinite;
      }

      #${BG_ID} .m7-crepe-b{
        transform-box:fill-box;
        transform-origin:center;
        animation:m7CrepeFloatB 12s ease-in-out infinite;
      }

      #${BG_ID} .m7-choco-gloss{
        animation:m7ChocoGloss 7s ease-in-out infinite;
      }

      @keyframes m7CrepeFloatA{
        0%,100%{transform:translate3d(0,0,0) rotate(-1deg);}
        50%{transform:translate3d(0,-8px,0) rotate(1deg);}
      }

      @keyframes m7CrepeFloatB{
        0%,100%{transform:translate3d(0,0,0) rotate(1deg);}
        50%{transform:translate3d(0,9px,0) rotate(-1deg);}
      }

      @keyframes m7ChocoGloss{
        0%,100%{opacity:.55;}
        50%{opacity:.90;}
      }

      @media(max-width:600px){
        #${BG_ID} svg{
          width:120%!important;
          left:-10%!important;
        }

        #${BG_ID} .m7-dark-center{
          width:96vw!important;
          background:
            radial-gradient(
              ellipse at center,
              rgba(5,3,2,.48) 0%,
              rgba(6,4,3,.37) 50%,
              rgba(6,4,3,.10) 76%,
              transparent 100%
            )!important;
        }
      }

      @media(max-width:380px){
        #${BG_ID} svg{
          width:128%!important;
          left:-14%!important;
        }
      }

      @media(prefers-reduced-motion:reduce){
        #${BG_ID} *{
          animation:none!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function makeBackground() {
    if (document.getElementById(BG_ID)) return;

    const bg = document.createElement("div");
    bg.id = BG_ID;
    bg.setAttribute("aria-hidden", "true");

    bg.innerHTML = `
      <svg viewBox="0 0 1440 2560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m7Crepe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f4c98e"/>
            <stop offset="28%" stop-color="#dfa45f"/>
            <stop offset="58%" stop-color="#be7439"/>
            <stop offset="82%" stop-color="#e2a763"/>
            <stop offset="100%" stop-color="#925025"/>
          </linearGradient>

          <linearGradient id="m7CrepeHi" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ffe7ba" stop-opacity=".72"/>
            <stop offset="52%" stop-color="#f4bd7a" stop-opacity=".20"/>
            <stop offset="100%" stop-color="#7a3518" stop-opacity=".06"/>
          </linearGradient>

          <linearGradient id="m7Chocolate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#955332"/>
            <stop offset="24%" stop-color="#5d2919"/>
            <stop offset="58%" stop-color="#2d1109"/>
            <stop offset="78%" stop-color="#713821"/>
            <stop offset="100%" stop-color="#180704"/>
          </linearGradient>

          <radialGradient id="m7Nut" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stop-color="#d8a46c"/>
            <stop offset="42%" stop-color="#9b5d33"/>
            <stop offset="100%" stop-color="#472211"/>
          </radialGradient>

          <filter id="m7Shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000" flood-opacity=".48"/>
          </filter>
        </defs>

        <!-- TOP LEFT CREPE -->
        <g class="m7-crepe-a" filter="url(#m7Shadow)" opacity=".88">
          <path d="M-215 160 C38 83 258 151 403 343 C489 457 470 612 365 738 C231 899 36 943 -190 881 Z"
                fill="url(#m7Crepe)"/>
          <path d="M-84 265 C71 196 244 225 346 357 C286 344 225 350 167 378 C61 428 -15 519 -77 634 Z"
                fill="url(#m7CrepeHi)"/>
          <path d="M43 270 C133 330 198 405 207 501 C214 568 190 630 145 687"
                fill="none" stroke="url(#m7Chocolate)" stroke-width="50" stroke-linecap="round"/>
          <path class="m7-choco-gloss" d="M65 281 C133 334 174 402 180 463"
                fill="none" stroke="#d99b73" stroke-opacity=".28" stroke-width="9" stroke-linecap="round"/>
        </g>

        <!-- BOTTOM RIGHT CREPE -->
        <g class="m7-crepe-b" filter="url(#m7Shadow)" opacity=".87">
          <path d="M1080 1768 C1207 1602 1426 1535 1644 1618 L1647 2348 C1437 2416 1240 2326 1127 2179 C1033 2054 1018 1870 1080 1768 Z"
                fill="url(#m7Crepe)"/>
          <path d="M1194 1713 C1290 1645 1416 1628 1520 1664 C1415 1737 1366 1842 1370 1954 C1375 2052 1414 2124 1485 2198 C1328 2201 1201 2128 1146 2011 C1101 1913 1116 1792 1194 1713 Z"
                fill="url(#m7CrepeHi)" opacity=".74"/>
          <path d="M1461 1658 C1348 1742 1283 1836 1282 1949 C1280 2044 1326 2128 1411 2210"
                fill="none" stroke="url(#m7Chocolate)" stroke-width="51" stroke-linecap="round"/>
          <path class="m7-choco-gloss" d="M1443 1673 C1367 1737 1326 1811 1315 1883"
                fill="none" stroke="#da9b71" stroke-opacity=".25" stroke-width="9" stroke-linecap="round"/>
        </g>

        <!-- TOP RIGHT CHOCOLATE SPLASH -->
        <g opacity=".42">
          <path d="M1116 226 C1248 140 1394 157 1516 267 C1574 320 1607 382 1652 455 C1515 400 1400 408 1299 457 C1227 491 1167 542 1117 610 C1112 450 1109 332 1116 226 Z"
                fill="url(#m7Chocolate)"/>
          <circle cx="1245" cy="209" r="27" fill="#70331e"/>
          <circle cx="1384" cy="177" r="17" fill="#934b2b"/>
        </g>

        <!-- HAZELNUT DETAILS -->
        <g opacity=".74">
          <ellipse cx="1118" cy="706" rx="43" ry="36" fill="url(#m7Nut)" filter="url(#m7Shadow)"/>
          <ellipse cx="1258" cy="805" rx="31" ry="26" fill="url(#m7Nut)" filter="url(#m7Shadow)"/>
          <ellipse cx="243" cy="1748" rx="37" ry="31" fill="url(#m7Nut)" filter="url(#m7Shadow)"/>
        </g>

        <!-- COCOA DUST -->
        <g fill="#d08b5c" opacity=".09">
          <circle cx="331" cy="1101" r="8"/>
          <circle cx="1111" cy="1160" r="10"/>
          <circle cx="1191" cy="1361" r="6"/>
          <circle cx="223" cy="1451" r="8"/>
          <circle cx="1041" cy="1499" r="7"/>
          <circle cx="383" cy="2070" r="6"/>
        </g>
      </svg>

      <div class="m7-dark-center"></div>
      <div class="m7-vignette"></div>
    `;

    document.body.prepend(bg);
  }

  function run() {
    if (!isTargetPage()) {
      removeDozeBackground();
      return;
    }

    if (!document.body) {
      document.addEventListener("DOMContentLoaded", run, { once: true });
      return;
    }

    document.documentElement.classList.add("ma7alak-doze-overlay-active");
    document.body.classList.add("ma7alak-doze-overlay-active");

    installStyle();
    makeBackground();
  }

  function handleRouteChange() {
    setTimeout(run, 40);
  }

  const push = history.pushState;
  const replace = history.replaceState;

  history.pushState = function () {
    const result = push.apply(this, arguments);
    handleRouteChange();
    return result;
  };

  history.replaceState = function () {
    const result = replace.apply(this, arguments);
    handleRouteChange();
    return result;
  };

  window.addEventListener("popstate", handleRouteChange);
  window.addEventListener("pageshow", handleRouteChange);

  run();
})();
