/* =========================================================
   MA7ALAK — DOZE 3ALE FULL-PAGE CHOCOLATE CREPE BACKGROUND
   GitHub-ready JavaScript
   Activates ONLY on: https://ma7alak.com/doze-3ale
   ---------------------------------------------------------
   ✓ Full-page background
   ✓ Resolution-independent SVG artwork
   ✓ Mobile-safe
   ✓ Does not block clicks
   ✓ Dark center for readable content
   ✓ Crepes / chocolate / hazelnut theme
   ✓ Subtle ambient animation
   ✓ Automatically removes itself on other pages
========================================================= */

(function () {
  "use strict";

  const TARGET_PATH = "/doze-3ale";
  const STYLE_ID = "ma7alak-doze-page-bg-style";
  const BG_ID = "ma7alak-doze-page-bg";

  function normalizePath(path) {
    let value = String(path || "/").replace(/\/+/g, "/");
    if (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
    return value;
  }

  function isDozePage() {
    return normalizePath(window.location.pathname) === TARGET_PATH;
  }

  function removeBackground() {
    const bg = document.getElementById(BG_ID);
    const style = document.getElementById(STYLE_ID);

    if (bg) bg.remove();
    if (style) style.remove();

    document.documentElement.classList.remove("ma7alak-doze-bg-active");
    document.body.classList.remove("ma7alak-doze-bg-active");
  }

  function updateBackgroundHeight() {
    if (!isDozePage()) return;

    const bg = document.getElementById(BG_ID);
    if (!bg) return;

    const doc = document.documentElement;
    const body = document.body;

    const pageHeight = Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      doc ? doc.scrollHeight : 0,
      doc ? doc.offsetHeight : 0,
      window.innerHeight
    );

    bg.style.setProperty("--ma7alak-doze-page-height", pageHeight + "px");
  }

  function installBackground() {
    if (!isDozePage()) {
      removeBackground();
      return;
    }

    if (document.getElementById(BG_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html.ma7alak-doze-bg-active{
        background:#120906!important;
        min-height:100%!important;
      }

      body.ma7alak-doze-bg-active{
        min-height:100%!important;
      }

      body.ma7alak-doze-bg-active{
        position:relative!important;
        isolation:isolate!important;
        background:transparent!important;
      }

      /* HOSTINGER STACKING FIX:
         Keep the page artwork inside the body's stacking context instead
         of putting it behind html/body where mobile browsers can hide it. */
      #${BG_ID}{
        position:absolute!important;
        left:0!important;
        top:0!important;
        width:100%!important;
        height:var(--ma7alak-doze-page-height, 100vh)!important;
        min-height:100vh!important;
        pointer-events:none!important;
        overflow:hidden!important;
        z-index:0!important;
        background:
          radial-gradient(circle at 50% 18%,rgba(117,55,25,.19),transparent 34%),
          radial-gradient(circle at 17% 78%,rgba(92,35,16,.23),transparent 31%),
          radial-gradient(circle at 86% 70%,rgba(130,61,24,.20),transparent 34%),
          linear-gradient(180deg,#1a0d08 0%,#100705 48%,#160a06 100%)!important;
      }

      body.ma7alak-doze-bg-active > *:not(#${BG_ID}){
        position:relative;
        z-index:1;
      }

      /* Hostinger's outer page shells can otherwise paint an opaque page
         color over the fixed background. Only the outer shells are cleared;
         cards/components keep their own styling. */
      body.ma7alak-doze-bg-active > div:not(#${BG_ID}),
      body.ma7alak-doze-bg-active > main,
      body.ma7alak-doze-bg-active > #root,
      body.ma7alak-doze-bg-active main,
      body.ma7alak-doze-bg-active section,
      body.ma7alak-doze-bg-active [data-section-id],
      body.ma7alak-doze-bg-active [class*="section-wrapper"],
      body.ma7alak-doze-bg-active [class*="page-section"]{
        background-color:transparent!important;
        background-image:none!important;
      }

      #${BG_ID} .m7-bg-svg{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        display:block!important;
      }

      #${BG_ID} .m7-bg-vignette{
        position:absolute!important;
        inset:-4%!important;
        background:
          radial-gradient(ellipse at center,
            rgba(13,7,5,.20) 0%,
            rgba(12,6,4,.34) 42%,
            rgba(5,3,2,.70) 100%)!important;
      }

      #${BG_ID} .m7-bg-center-readability{
        position:absolute!important;
        left:50%!important;
        top:50%!important;
        width:min(820px,88vw)!important;
        height:118vh!important;
        transform:translate(-50%,-50%)!important;
        background:radial-gradient(
          ellipse at center,
          rgba(8,5,4,.64) 0%,
          rgba(10,6,4,.43) 45%,
          rgba(10,6,4,.10) 73%,
          transparent 100%
        )!important;
        filter:blur(8px)!important;
      }

      #${BG_ID} .m7-bg-cocoa-haze{
        position:absolute!important;
        left:50%!important;
        top:50%!important;
        width:120vw!important;
        height:120vh!important;
        transform:translate(-50%,-50%) scale(1)!important;
        opacity:.56!important;
        background:
          radial-gradient(circle at 24% 26%,rgba(177,91,42,.09),transparent 22%),
          radial-gradient(circle at 77% 31%,rgba(103,45,22,.12),transparent 24%),
          radial-gradient(circle at 62% 83%,rgba(150,71,31,.09),transparent 20%)!important;
        animation:ma7alakDozeBgBreathe 10s ease-in-out infinite!important;
      }

      @keyframes ma7alakDozeBgBreathe{
        0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.48;}
        50%{transform:translate(-50%,-50%) scale(1.045);opacity:.66;}
      }

      #${BG_ID} .m7-crepe-left,
      #${BG_ID} .m7-crepe-right,
      #${BG_ID} .m7-choco-streak,
      #${BG_ID} .m7-hazelnut{
        transform-box:fill-box;
        transform-origin:center;
      }

      #${BG_ID} .m7-crepe-left{
        animation:ma7alakCrepeFloatLeft 9s ease-in-out infinite;
      }

      #${BG_ID} .m7-crepe-right{
        animation:ma7alakCrepeFloatRight 11s ease-in-out infinite;
      }

      #${BG_ID} .m7-choco-streak{
        animation:ma7alakChocolateShimmer 7s ease-in-out infinite;
      }

      #${BG_ID} .m7-hazelnut.h1{animation:ma7alakNutFloat1 8s ease-in-out infinite;}
      #${BG_ID} .m7-hazelnut.h2{animation:ma7alakNutFloat2 10s ease-in-out infinite;}
      #${BG_ID} .m7-hazelnut.h3{animation:ma7alakNutFloat3 9s ease-in-out infinite;}

      @keyframes ma7alakCrepeFloatLeft{
        0%,100%{transform:translate3d(0,0,0) rotate(-1deg);}
        50%{transform:translate3d(0,-9px,0) rotate(1.2deg);}
      }

      @keyframes ma7alakCrepeFloatRight{
        0%,100%{transform:translate3d(0,0,0) rotate(1deg);}
        50%{transform:translate3d(0,10px,0) rotate(-1.2deg);}
      }

      @keyframes ma7alakChocolateShimmer{
        0%,100%{opacity:.66;filter:brightness(.9);}
        50%{opacity:.95;filter:brightness(1.13);}
      }

      @keyframes ma7alakNutFloat1{
        0%,100%{transform:translate3d(0,0,0) rotate(0deg);}
        50%{transform:translate3d(5px,-8px,0) rotate(7deg);}
      }

      @keyframes ma7alakNutFloat2{
        0%,100%{transform:translate3d(0,0,0) rotate(0deg);}
        50%{transform:translate3d(-5px,7px,0) rotate(-8deg);}
      }

      @keyframes ma7alakNutFloat3{
        0%,100%{transform:translate3d(0,0,0) rotate(0deg);}
        50%{transform:translate3d(3px,-6px,0) rotate(6deg);}
      }

      @media(max-width:600px){
        #${BG_ID} .m7-bg-center-readability{
          width:94vw!important;
          height:124vh!important;
          background:radial-gradient(
            ellipse at center,
            rgba(8,5,4,.69) 0%,
            rgba(10,6,4,.48) 49%,
            rgba(10,6,4,.14) 76%,
            transparent 100%
          )!important;
        }

        #${BG_ID} .m7-bg-svg{
          width:116%!important;
          left:-8%!important;
        }

        #${BG_ID} .m7-edge-detail{
          opacity:.74!important;
        }
      }

      @media(max-width:380px){
        #${BG_ID} .m7-bg-svg{
          width:126%!important;
          left:-13%!important;
        }
      }

      @media(prefers-reduced-motion:reduce){
        #${BG_ID} *{
          animation:none!important;
        }
      }
    `;

    const bg = document.createElement("div");
    bg.id = BG_ID;
    bg.setAttribute("aria-hidden", "true");

    bg.innerHTML = `
      <svg class="m7-bg-svg" viewBox="0 0 1440 2560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m7Crepe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f2c27f"/>
            <stop offset="27%" stop-color="#d89a55"/>
            <stop offset="56%" stop-color="#bd7437"/>
            <stop offset="78%" stop-color="#e6ad68"/>
            <stop offset="100%" stop-color="#9f5829"/>
          </linearGradient>

          <linearGradient id="m7CrepeLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ffdfaa" stop-opacity=".76"/>
            <stop offset="45%" stop-color="#f4bd78" stop-opacity=".22"/>
            <stop offset="100%" stop-color="#7a3518" stop-opacity=".06"/>
          </linearGradient>

          <linearGradient id="m7Choco" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#8b4925"/>
            <stop offset="22%" stop-color="#4f2414"/>
            <stop offset="56%" stop-color="#2c120b"/>
            <stop offset="77%" stop-color="#6f371f"/>
            <stop offset="100%" stop-color="#1c0a06"/>
          </linearGradient>

          <radialGradient id="m7ChocoGloss" cx="35%" cy="20%" r="78%">
            <stop offset="0%" stop-color="#d69059" stop-opacity=".72"/>
            <stop offset="23%" stop-color="#8d4e30" stop-opacity=".42"/>
            <stop offset="58%" stop-color="#4b2114" stop-opacity=".24"/>
            <stop offset="100%" stop-color="#1e0a06" stop-opacity=".08"/>
          </radialGradient>

          <radialGradient id="m7Nut" cx="35%" cy="28%" r="76%">
            <stop offset="0%" stop-color="#d49a5d"/>
            <stop offset="42%" stop-color="#9b5d31"/>
            <stop offset="100%" stop-color="#4a2413"/>
          </radialGradient>

          <filter id="m7Shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#000" flood-opacity=".48"/>
          </filter>

          <filter id="m7SoftShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".38"/>
          </filter>

          <filter id="m7Blur">
            <feGaussianBlur stdDeviation="18"/>
          </filter>
        </defs>

        <!-- LEFT CREPE -->
        <g class="m7-crepe-left m7-edge-detail" filter="url(#m7Shadow)" opacity=".92">
          <path d="M-210 245 C50 120 250 164 390 330 C475 432 472 564 396 670 C280 832 68 910 -180 886 Z"
                fill="url(#m7Crepe)"/>
          <path d="M-90 280 C76 204 247 226 352 356 C397 413 403 477 385 542 C316 485 244 458 165 465 C58 474 -23 535 -92 627 Z"
                fill="url(#m7CrepeLight)" opacity=".73"/>
          <path d="M-82 616 C75 510 237 486 392 572 C352 705 217 812 22 855 C-55 871 -122 866 -182 851 Z"
                fill="#8b4c27" opacity=".22"/>
          <path d="M34 339 C138 298 249 316 322 389" fill="none" stroke="#ffe0aa" stroke-opacity=".32" stroke-width="16" stroke-linecap="round"/>
          <path d="M6 398 C126 354 245 378 323 459" fill="none" stroke="#744022" stroke-opacity=".24" stroke-width="12" stroke-linecap="round"/>
          <path d="M35 510 C139 472 244 492 316 559" fill="none" stroke="#fff1c8" stroke-opacity=".18" stroke-width="9" stroke-linecap="round"/>

          <!-- chocolate on left crepe -->
          <path class="m7-choco-streak" d="M72 278 C159 350 208 418 211 507 C212 565 189 617 146 670"
                fill="none" stroke="url(#m7Choco)" stroke-width="42" stroke-linecap="round" opacity=".92"/>
          <path d="M89 289 C155 350 183 415 184 476"
                fill="none" stroke="#c77c4d" stroke-opacity=".27" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="170" cy="610" rx="57" ry="36" fill="url(#m7ChocoGloss)" opacity=".88"/>
        </g>

        <!-- RIGHT CREPE -->
        <g class="m7-crepe-right m7-edge-detail" filter="url(#m7Shadow)" opacity=".90">
          <path d="M1100 1760 C1238 1575 1458 1514 1656 1600 L1625 2320 C1450 2390 1253 2327 1134 2184 C1029 2059 1013 1881 1100 1760 Z"
                fill="url(#m7Crepe)"/>
          <path d="M1175 1728 C1261 1634 1399 1602 1518 1642 C1430 1713 1376 1808 1368 1922 C1361 2027 1395 2110 1472 2186 C1320 2203 1194 2131 1136 2014 C1090 1922 1100 1811 1175 1728 Z"
                fill="url(#m7CrepeLight)" opacity=".69"/>
          <path d="M1141 1968 C1258 2034 1388 2078 1544 2060" fill="none" stroke="#fff0c2" stroke-opacity=".18" stroke-width="12" stroke-linecap="round"/>
          <path d="M1174 1874 C1290 1917 1405 1923 1515 1891" fill="none" stroke="#6e3b20" stroke-opacity=".22" stroke-width="12" stroke-linecap="round"/>

          <!-- chocolate ribbon -->
          <path class="m7-choco-streak" d="M1454 1654 C1330 1742 1269 1840 1275 1949 C1280 2035 1321 2110 1401 2189"
                fill="none" stroke="url(#m7Choco)" stroke-width="46" stroke-linecap="round" opacity=".94"/>
          <path d="M1439 1670 C1348 1741 1308 1821 1308 1891"
                fill="none" stroke="#d18c5f" stroke-opacity=".24" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="1330" cy="2100" rx="64" ry="39" fill="url(#m7ChocoGloss)" opacity=".85"/>
        </g>

        <!-- TOP RIGHT CHOCOLATE SPLASH -->
        <g class="m7-edge-detail" opacity=".64">
          <path d="M1160 228 C1277 142 1396 156 1497 242 C1558 295 1594 357 1637 423 C1529 386 1434 383 1344 417 C1266 446 1196 500 1129 577 C1126 439 1129 327 1160 228 Z"
                fill="url(#m7ChocoGloss)"/>
          <circle cx="1260" cy="219" r="31" fill="#5a2818"/>
          <circle cx="1385" cy="176" r="19" fill="#7f4024"/>
          <circle cx="1490" cy="271" r="24" fill="#3d180f"/>
          <path d="M1210 265 C1285 246 1366 257 1434 301" fill="none" stroke="#d18a58" stroke-opacity=".18" stroke-width="10" stroke-linecap="round"/>
        </g>

        <!-- BOTTOM LEFT CHOCOLATE POOL -->
        <g class="m7-edge-detail" opacity=".62">
          <ellipse cx="75" cy="2290" rx="322" ry="178" fill="url(#m7ChocoGloss)"/>
          <ellipse cx="16" cy="2248" rx="252" ry="120" fill="#31120a" opacity=".47"/>
          <path d="M-148 2252 C-12 2174 143 2157 276 2216" fill="none" stroke="#b8653b" stroke-opacity=".18" stroke-width="14" stroke-linecap="round"/>
        </g>

        <!-- HAZELNUTS -->
        <g class="m7-hazelnut h1" transform="translate(1110 660)" filter="url(#m7SoftShadow)">
          <ellipse rx="46" ry="38" fill="url(#m7Nut)"/>
          <path d="M-36 -7 C-7 -26 18 -25 38 -8" fill="none" stroke="#e8b87e" stroke-opacity=".38" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="-9" cy="-11" rx="10" ry="7" fill="#f0c58f" opacity=".15"/>
        </g>

        <g class="m7-hazelnut h2" transform="translate(1260 782)" filter="url(#m7SoftShadow)">
          <ellipse rx="34" ry="29" fill="url(#m7Nut)"/>
          <path d="M-26 -5 C-8 -18 13 -19 28 -6" fill="none" stroke="#efc894" stroke-opacity=".32" stroke-width="5" stroke-linecap="round"/>
        </g>

        <g class="m7-hazelnut h3" transform="translate(244 1750)" filter="url(#m7SoftShadow)">
          <ellipse rx="38" ry="31" fill="url(#m7Nut)"/>
          <path d="M-29 -7 C-6 -21 14 -20 30 -5" fill="none" stroke="#efc894" stroke-opacity=".34" stroke-width="5" stroke-linecap="round"/>
        </g>

        <!-- SMALL COCOA DUST / BOKEH -->
        <g fill="#c1794d" opacity=".12">
          <circle cx="318" cy="1070" r="7"/>
          <circle cx="1140" cy="1116" r="9"/>
          <circle cx="1222" cy="1300" r="5"/>
          <circle cx="206" cy="1408" r="8"/>
          <circle cx="1060" cy="1462" r="6"/>
          <circle cx="382" cy="2020" r="5"/>
          <circle cx="989" cy="2118" r="8"/>
        </g>
      </svg>

      <div class="m7-bg-cocoa-haze"></div>
      <div class="m7-bg-center-readability"></div>
      <div class="m7-bg-vignette"></div>
    `;

    document.documentElement.classList.add("ma7alak-doze-bg-active");
    document.body.classList.add("ma7alak-doze-bg-active");

    document.head.appendChild(style);
    document.body.prepend(bg);

    updateBackgroundHeight();

    requestAnimationFrame(updateBackgroundHeight);
    setTimeout(updateBackgroundHeight, 250);
    setTimeout(updateBackgroundHeight, 1000);
    setTimeout(updateBackgroundHeight, 2500);

    if (!window.__MA7ALAK_DOZE_BG_RESIZE_OBSERVER__) {
      window.__MA7ALAK_DOZE_BG_RESIZE_OBSERVER__ = new ResizeObserver(function () {
        updateBackgroundHeight();
      });

      window.__MA7ALAK_DOZE_BG_RESIZE_OBSERVER__.observe(document.documentElement);
      window.__MA7ALAK_DOZE_BG_RESIZE_OBSERVER__.observe(document.body);
    }
  }

  function boot() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
      return;
    }

    installBackground();
  }

  /* Support Hostinger / SPA-style navigation if path changes without full reload. */
  function handleRouteChange() {
    setTimeout(function () {
      if (isDozePage()) installBackground();
      else removeBackground();
    }, 40);
  }

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    const result = originalPushState.apply(this, arguments);
    handleRouteChange();
    return result;
  };

  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments);
    handleRouteChange();
    return result;
  };

  window.addEventListener("popstate", handleRouteChange);
  window.addEventListener("pageshow", handleRouteChange);
  window.addEventListener("resize", updateBackgroundHeight, { passive:true });
  window.addEventListener("orientationchange", function(){
    setTimeout(updateBackgroundHeight, 250);
  });

  boot();
})();
