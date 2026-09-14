/* =========================================================
   MA7ALAK â€” DOZE 3ALE FULL PAGE BACKGROUND
   HOSTINGER BACKGROUND OVERRIDE / KILLER
   Activates ONLY on https://ma7alak.com/doze-3ale
   ========================================================= */
(function(){
  "use strict";

  const TARGET = "/doze-3ale";
  const STYLE_ID = "m7-doze-full-bg-style";
  const BG_ID = "m7-doze-full-bg";
  const MARK = "data-m7-doze-transparent";

  function pathOK(){
    let p = (location.pathname || "/").replace(/\/+$/,"") || "/";
    return p === TARGET;
  }

  if(!pathOK()) return;

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;

    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = `
      html, body{
        min-height:100%!important;
        background:#120806!important;
      }

      body{
        position:relative!important;
      }

      #${BG_ID}{
        position:fixed!important;
        inset:0!important;
        width:100vw!important;
        height:100vh!important;
        width:100dvw!important;
        height:100dvh!important;
        z-index:0!important;
        pointer-events:none!important;
        overflow:hidden!important;
        background:
          radial-gradient(circle at 14% 18%, rgba(126,58,26,.30), transparent 28%),
          radial-gradient(circle at 86% 24%, rgba(92,40,17,.26), transparent 31%),
          radial-gradient(circle at 18% 82%, rgba(94,41,19,.28), transparent 30%),
          radial-gradient(circle at 83% 77%, rgba(130,64,31,.20), transparent 31%),
          linear-gradient(180deg,#1c0d08 0%,#100705 46%,#180a06 100%)!important;
      }

      #${BG_ID} svg{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        display:block!important;
      }

      #${BG_ID}::after{
        content:"";
        position:absolute;
        inset:0;
        background:
          radial-gradient(ellipse at 50% 48%,
            rgba(7,4,3,.20) 0%,
            rgba(7,4,3,.35) 45%,
            rgba(4,2,2,.66) 100%);
      }

      /* Everything real stays above our background. */
      body > *:not(#${BG_ID}){
        position:relative;
        z-index:1;
      }

      /* Elements identified by the JS as HOSTINGER layout/background shells only. */
      [${MARK}="1"]{
        background-color:transparent!important;
        background-image:none!important;
      }

      /* Common Hostinger/Zyro page shells. */
      #root,
      #__next,
      main,
      .website-content,
      .page-content,
      [class*="website-content"],
      [class*="page-content"],
      [class*="layout__section"],
      [class*="section-wrapper"],
      [class*="block-wrapper"],
      [class*="block-background"],
      [class*="section-background"]{
        background-color:transparent!important;
      }

      @media(max-width:600px){
        #${BG_ID} svg{
          width:118%!important;
          left:-9%!important;
        }
      }

      @media(prefers-reduced-motion:reduce){
        #${BG_ID} *{
          animation:none!important;
        }
      }

      @keyframes m7CrepeDriftA{
        0%,100%{transform:translate3d(0,0,0) rotate(-2deg)}
        50%{transform:translate3d(0,-10px,0) rotate(1deg)}
      }
      @keyframes m7CrepeDriftB{
        0%,100%{transform:translate3d(0,0,0) rotate(2deg)}
        50%{transform:translate3d(0,9px,0) rotate(-1deg)}
      }
      @keyframes m7Gloss{
        0%,100%{opacity:.58}
        50%{opacity:.92}
      }

      #${BG_ID} .crepeA{animation:m7CrepeDriftA 10s ease-in-out infinite}
      #${BG_ID} .crepeB{animation:m7CrepeDriftB 12s ease-in-out infinite}
      #${BG_ID} .gloss{animation:m7Gloss 7s ease-in-out infinite}
    `;
    document.head.appendChild(st);
  }

  function addBackground(){
    if(document.getElementById(BG_ID)) return;

    const bg = document.createElement("div");
    bg.id = BG_ID;
    bg.setAttribute("aria-hidden","true");

    bg.innerHTML = `
      <svg viewBox="0 0 1440 2560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m7c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f2c487"/>
            <stop offset=".28" stop-color="#dda25f"/>
            <stop offset=".58" stop-color="#bb733a"/>
            <stop offset=".82" stop-color="#e0a361"/>
            <stop offset="1" stop-color="#915022"/>
          </linearGradient>
          <linearGradient id="m7ch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#8c4828"/>
            <stop offset=".25" stop-color="#562515"/>
            <stop offset=".6" stop-color="#2e1009"/>
            <stop offset="1" stop-color="#160604"/>
          </linearGradient>
          <radialGradient id="m7nut" cx=".3" cy=".25" r=".8">
            <stop offset="0" stop-color="#d5a06b"/>
            <stop offset=".45" stop-color="#96582f"/>
            <stop offset="1" stop-color="#47210f"/>
          </radialGradient>
          <filter id="m7sh" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000" flood-opacity=".52"/>
          </filter>
        </defs>

        <!-- left/top folded crepe -->
        <g class="crepeA" filter="url(#m7sh)" opacity=".90">
          <path d="M-210 160 C45 86 260 160 398 345 C486 463 465 611 362 735 C228 898 32 940 -186 880 Z" fill="url(#m7c)"/>
          <path d="M-80 263 C74 195 243 226 342 356 C285 344 225 349 170 374 C63 423 -14 516 -75 632 Z" fill="#ffe0a9" opacity=".23"/>
          <path d="M42 269 C128 328 194 403 205 499 C213 568 188 629 144 685" fill="none" stroke="url(#m7ch)" stroke-width="48" stroke-linecap="round"/>
          <path class="gloss" d="M62 278 C132 333 170 399 177 462" fill="none" stroke="#d79769" stroke-opacity=".28" stroke-width="9" stroke-linecap="round"/>
        </g>

        <!-- right/bottom folded crepe -->
        <g class="crepeB" filter="url(#m7sh)" opacity=".88">
          <path d="M1082 1770 C1204 1607 1425 1536 1640 1620 L1644 2345 C1440 2414 1240 2328 1129 2181 C1035 2057 1018 1871 1082 1770 Z" fill="url(#m7c)"/>
          <path d="M1195 1714 C1290 1647 1414 1629 1518 1664 C1414 1736 1365 1842 1371 1952 C1376 2050 1414 2122 1484 2196 C1330 2201 1203 2127 1148 2011 C1103 1916 1117 1792 1195 1714 Z" fill="#ffe2ad" opacity=".19"/>
          <path d="M1460 1659 C1348 1741 1285 1835 1283 1947 C1281 2043 1325 2128 1410 2209" fill="none" stroke="url(#m7ch)" stroke-width="50" stroke-linecap="round"/>
          <path class="gloss" d="M1443 1674 C1366 1737 1325 1809 1314 1882" fill="none" stroke="#d9986b" stroke-opacity=".25" stroke-width="9" stroke-linecap="round"/>
        </g>

        <!-- subtle chocolate splash, top right -->
        <g opacity=".48">
          <path d="M1121 228 C1250 142 1394 159 1513 268 C1571 322 1604 382 1647 453 C1511 400 1400 409 1301 456 C1229 490 1171 540 1119 607 C1116 448 1112 332 1121 228 Z" fill="url(#m7ch)"/>
          <circle cx="1248" cy="211" r="28" fill="#6b301b"/>
          <circle cx="1382" cy="179" r="17" fill="#8a4728"/>
        </g>

        <!-- hazelnuts -->
        <g opacity=".80">
          <ellipse cx="1120" cy="707" rx="43" ry="36" fill="url(#m7nut)" filter="url(#m7sh)"/>
          <ellipse cx="1255" cy="804" rx="31" ry="26" fill="url(#m7nut)" filter="url(#m7sh)"/>
          <ellipse cx="242" cy="1749" rx="37" ry="31" fill="url(#m7nut)" filter="url(#m7sh)"/>
        </g>

        <!-- cocoa glow -->
        <g fill="#d28a57" opacity=".10">
          <circle cx="330" cy="1100" r="8"/>
          <circle cx="1110" cy="1160" r="10"/>
          <circle cx="1190" cy="1360" r="6"/>
          <circle cx="224" cy="1450" r="8"/>
          <circle cx="1040" cy="1500" r="7"/>
          <circle cx="385" cy="2070" r="6"/>
        </g>
      </svg>
    `;

    document.body.prepend(bg);
  }

  /* 
     Hostinger's problem is not the background itself:
     each builder section can paint an opaque background over the body.
     We clear ONLY large page-layout shells, not cards/components.
  */
  function clearHostingerSectionBackgrounds(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    const candidates = document.querySelectorAll(
      'main, section, #root, #__next, .website-content, .page-content, ' +
      '[class*="section"], [class*="block"], [class*="layout"], [class*="background"]'
    );

    candidates.forEach(el => {
      if(el.id === BG_ID || el.closest("#" + BG_ID)) return;
      if(el.closest("header") || el.closest("nav")) return;

      const r = el.getBoundingClientRect();
      if(r.width < vw * 0.84 || r.height < 80) return;

      /*
        Keep obvious inner cards/widgets alone. Hostinger layout shells are
        usually full-width; compact/custom cards won't pass this test.
      */
      const cs = getComputedStyle(el);
      const bgImage = cs.backgroundImage;
      const bgColor = cs.backgroundColor;

      const looksLikePageShell =
        el === document.body ||
        el === document.documentElement ||
        el.tagName === "MAIN" ||
        el.tagName === "SECTION" ||
        /section|block|layout|background|content/i.test(String(el.className));

      if(!looksLikePageShell) return;

      if(bgImage !== "none" || (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent")){
        el.setAttribute(MARK,"1");
        el.style.setProperty("background-color","transparent","important");
        el.style.setProperty("background-image","none","important");
      }
    });
  }

  function run(){
    if(!pathOK()) return;
    if(!document.body){
      document.addEventListener("DOMContentLoaded", run, {once:true});
      return;
    }

    addStyle();
    addBackground();
    clearHostingerSectionBackgrounds();

    /* Hostinger can repaint/rebuild sections after initial load. */
    setTimeout(clearHostingerSectionBackgrounds, 300);
    setTimeout(clearHostingerSectionBackgrounds, 1000);
    setTimeout(clearHostingerSectionBackgrounds, 2500);

    if(!window.__M7_DOZE_BG_OBSERVER__){
      let timer = 0;
      window.__M7_DOZE_BG_OBSERVER__ = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(clearHostingerSectionBackgrounds, 80);
      });
      window.__M7_DOZE_BG_OBSERVER__.observe(document.body,{
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:["class","style"]
      });
    }
  }

  run();
})();
