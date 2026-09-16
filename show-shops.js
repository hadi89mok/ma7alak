/* =========================================================
   MA7ALAK — PREMIUM SHOPS DIRECTORY
   GITHUB-READY JAVASCRIPT
========================================================= */

(function(){
  "use strict";

  if(!document.getElementById("ma7alak-show-shops-github-style")){
    const style = document.createElement("style");
    style.id = "ma7alak-show-shops-github-style";
    style.textContent = "/* =========================================================\n   MA7ALAK SHOPS — GLOBAL FOUNDATION\n========================================================= */\n\nhtml.ma7alak-shops-page-active,\nhtml.ma7alak-shops-page-active body{\n\n  background:#080706 !important;\n\n  color:#fff !important;\n\n}\n\n\nbody.ma7alak-shops-body{\n\n  background:#080706 !important;\n\n  color:#fff !important;\n\n}\n\n\n/* =========================================================\n   MAIN PAGE\n========================================================= */\n\n#ma7alak-shops-page{\n\n  --gold:#f5b83f;\n  --gold-light:#ffd982;\n  --gold-soft:#d69a42;\n\n  --cream:#f7efe4;\n\n  --white:#ffffff;\n\n  --muted:#b9b0a6;\n  --muted2:#8f877e;\n\n  --glass:rgba(46,35,27,.60);\n  --glass-light:rgba(255,255,255,.075);\n\n  --border:rgba(255,255,255,.20);\n  --gold-border:rgba(245,184,63,.55);\n\n  position:relative;\n\n  width:100%;\n\n  max-width:1500px;\n\n  margin:0 auto;\n\n  padding:\n    40px 42px 80px;\n\n  box-sizing:border-box;\n\n  overflow:hidden;\n\n  color:#fff;\n\n  font-family:\n    Inter,\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    Roboto,\n    Arial,\n    sans-serif;\n\n}\n\n\n/* =========================================================\n   CINEMATIC BACKGROUND\n========================================================= */\n\n#ma7alak-shops-page .ma7alak-background{\n\n  position:absolute;\n\n  inset:0;\n\n  z-index:-10;\n\n  overflow:hidden;\n\n  background:\n\n    linear-gradient(\n      180deg,\n      rgba(4,3,2,.25),\n      rgba(5,4,3,.82) 58%,\n      #080706 100%\n    );\n\n}\n\n\n#ma7alak-shops-page .ma7alak-background-image{\n\n  position:absolute;\n\n  inset:0;\n\n  width:100%;\n\n  height:100%;\n\n  object-fit:cover;\n\n  object-position:center top;\n\n  opacity:.38;\n\n  filter:\n    saturate(.75)\n    contrast(1.08)\n    brightness(.72);\n\n  transform:scale(1.03);\n\n}\n\n\n#ma7alak-shops-page .ma7alak-background-overlay{\n\n  position:absolute;\n\n  inset:0;\n\n  background:\n\n    radial-gradient(\n      circle at 50% 12%,\n      rgba(188,116,39,.28),\n      transparent 34%\n    ),\n\n    radial-gradient(\n      circle at 15% 58%,\n      rgba(172,103,35,.15),\n      transparent 30%\n    ),\n\n    radial-gradient(\n      circle at 88% 65%,\n      rgba(230,160,67,.13),\n      transparent 32%\n    ),\n\n    linear-gradient(\n      180deg,\n      rgba(8,7,5,.05),\n      rgba(8,7,5,.62) 50%,\n      #080706 92%\n    );\n\n}\n\n\n#ma7alak-shops-page .ma7alak-background-vignette{\n\n  position:absolute;\n\n  inset:0;\n\n  box-shadow:\n    inset 0 0 180px rgba(0,0,0,.72);\n\n}\n\n\n/* =========================================================\n   TOP BRAND\n========================================================= */\n\n.ma7alak-top-brand{\n\n  position:relative;\n\n  text-align:center;\n\n  padding-top:4px;\n\n  margin-bottom:25px;\n\n}\n\n\n.ma7alak-brand-name{\n\n  font-family:\n    Georgia,\n    \"Times New Roman\",\n    serif;\n\n  font-size:52px;\n\n  line-height:1;\n\n  font-weight:700;\n\n  letter-spacing:-2px;\n\n  color:#fff;\n\n  text-shadow:\n    0 5px 30px rgba(0,0,0,.7);\n\n}\n\n\n.ma7alak-brand-subtitle{\n\n  margin-top:9px;\n\n  font-size:9px;\n\n  line-height:1;\n\n  letter-spacing:5px;\n\n  color:#c7bdb1;\n\n  text-transform:uppercase;\n\n}\n\n\n.ma7alak-brand-rule{\n\n  width:75px;\n\n  height:1px;\n\n  margin:17px auto 0;\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      var(--gold),\n      transparent\n    );\n\n  opacity:.8;\n\n}\n\n\n/* =========================================================\n   DECORATIVE SIDE TEXT\n========================================================= */\n\n.ma7alak-side-left{\n\n  position:absolute;\n\n  left:4px;\n\n  top:28px;\n\n  width:120px;\n\n  color:#d8c8b5;\n\n  font-size:8px;\n\n  letter-spacing:5px;\n\n  line-height:2;\n\n  text-transform:uppercase;\n\n  opacity:.72;\n\n}\n\n\n.ma7alak-side-right{\n\n  position:absolute;\n\n  right:4px;\n\n  top:25px;\n\n  color:#f0d4a8;\n\n  font-family:\n    \"Brush Script MT\",\n    cursive;\n\n  font-size:19px;\n\n  line-height:1.05;\n\n  transform:rotate(-7deg);\n\n  opacity:.82;\n\n}\n\n\n/* =========================================================\n   HERO\n========================================================= */\n\n.ma7alak-hero{\n\n  text-align:center;\n\n  margin:\n    24px auto 32px;\n\n}\n\n\n.ma7alak-hero-icon{\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  width:48px;\n\n  height:48px;\n\n  margin:0 auto 8px;\n\n  color:var(--gold);\n\n  font-size:32px;\n\n  filter:\n    drop-shadow(\n      0 0 16px rgba(245,184,63,.24)\n    );\n\n}\n\n\n.ma7alak-hero h1{\n\n  margin:0;\n\n  font-family:\n    Georgia,\n    \"Times New Roman\",\n    serif;\n\n  font-size:\n    clamp(48px,6vw,74px);\n\n  line-height:1;\n\n  letter-spacing:-2px;\n\n  color:#fff;\n\n  text-shadow:\n    0 5px 35px rgba(0,0,0,.7);\n\n}\n\n\n.ma7alak-hero h1 span{\n\n  color:var(--gold);\n\n  text-shadow:\n    0 0 35px rgba(245,184,63,.16);\n\n}\n\n\n.ma7alak-hero p{\n\n  margin:\n    11px auto 0;\n\n  max-width:650px;\n\n  color:#c1b8af;\n\n  font-size:15px;\n\n  line-height:1.6;\n\n}\n\n\n/* =========================================================\n   SEARCH\n========================================================= */\n\n.ma7alak-search-wrapper{\n\n  width:100%;\n\n  max-width:860px;\n\n  margin:\n    0 auto 25px;\n\n  position:relative;\n\n}\n\n\n.ma7alak-search{\n\n  width:100%;\n\n  height:60px;\n\n  padding:\n    0 60px 0 22px;\n\n  box-sizing:border-box;\n\n  border-radius:18px;\n\n  border:\n    1px solid rgba(255,255,255,.25);\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(45,36,29,.72),\n      rgba(24,20,17,.65)\n    );\n\n  backdrop-filter:blur(22px);\n\n  -webkit-backdrop-filter:blur(22px);\n\n  color:#fff;\n\n  outline:none;\n\n  font-size:14px;\n\n  box-shadow:\n    0 18px 55px rgba(0,0,0,.34),\n    inset 0 1px rgba(255,255,255,.09);\n\n  transition:\n    border-color .25s ease,\n    box-shadow .25s ease;\n\n}\n\n\n.ma7alak-search::placeholder{\n\n  color:#9f968d;\n\n}\n\n\n.ma7alak-search:focus{\n\n  border-color:\n    rgba(245,184,63,.70);\n\n  box-shadow:\n    0 0 0 4px rgba(245,184,63,.07),\n    0 20px 60px rgba(0,0,0,.38);\n\n}\n\n\n.ma7alak-search-icon{\n\n  position:absolute;\n\n  right:21px;\n\n  top:50%;\n\n  transform:translateY(-50%);\n\n  width:25px;\n\n  height:25px;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  color:#e3d7c9;\n\n  font-size:25px;\n\n  pointer-events:none;\n\n}\n\n\n/* =========================================================\n   FILTER AREA\n========================================================= */\n\n.ma7alak-filter-block{\n\n  margin-bottom:20px;\n\n}\n\n\n.ma7alak-filter-label{\n\n  margin:\n    0 0 10px 2px;\n\n  color:#d1c6bb;\n\n  font-size:12px;\n\n  font-weight:600;\n\n}\n\n\n.ma7alak-area-grid{\n\n  display:grid;\n\n  grid-template-columns:\n    repeat(4,minmax(0,1fr));\n\n  gap:9px;\n\n}\n\n\n.ma7alak-area-button{\n\n  min-height:51px;\n\n  border-radius:14px;\n\n  border:\n    1px solid rgba(255,255,255,.20);\n\n  background:\n    rgba(22,19,17,.68);\n\n  backdrop-filter:blur(14px);\n\n  -webkit-backdrop-filter:blur(14px);\n\n  color:#e9e2da;\n\n  font-size:13px;\n\n  font-weight:600;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:8px;\n\n  cursor:pointer;\n\n  transition:\n    transform .22s ease,\n    border-color .22s ease,\n    background .22s ease,\n    box-shadow .22s ease;\n\n}\n\n\n.ma7alak-area-button:hover{\n\n  transform:translateY(-2px);\n\n  border-color:\n    rgba(245,184,63,.55);\n\n  background:\n    rgba(75,51,28,.55);\n\n}\n\n\n.ma7alak-area-button.active{\n\n  border-color:\n    var(--gold);\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(170,105,29,.42),\n      rgba(77,49,25,.45)\n    );\n\n  color:#ffe1a1;\n\n  box-shadow:\n    0 0 25px rgba(245,184,63,.09),\n    inset 0 1px rgba(255,255,255,.08);\n\n}\n\n\n.ma7alak-area-button .icon{\n\n  font-size:16px;\n\n}\n\n\n/* =========================================================\n   CATEGORY\n========================================================= */\n\n.ma7alak-category-section{\n\n  display:none;\n\n  padding-top:2px;\n\n  animation:\n    ma7alakSectionIn .42s ease both;\n\n}\n\n\n.ma7alak-category-section.visible{\n\n  display:block;\n\n}\n\n\n.ma7alak-category-grid{\n\n  display:grid;\n\n  grid-template-columns:\n    repeat(4,minmax(0,1fr));\n\n  gap:9px;\n\n}\n\n\n.ma7alak-category-button{\n\n  min-height:58px;\n\n  padding:\n    9px 12px;\n\n  border-radius:15px;\n\n  border:\n    1px solid rgba(255,255,255,.19);\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(41,34,29,.68),\n      rgba(21,19,17,.62)\n    );\n\n  color:#e9e2da;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:9px;\n\n  font-size:13px;\n\n  font-weight:600;\n\n  cursor:pointer;\n\n  transition:.22s ease;\n\n}\n\n\n.ma7alak-category-button:hover{\n\n  transform:translateY(-2px);\n\n  border-color:\n    rgba(245,184,63,.52);\n\n}\n\n\n.ma7alak-category-button.active{\n\n  border-color:\n    var(--gold);\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(174,109,29,.42),\n      rgba(75,48,26,.40)\n    );\n\n  color:#ffe7b2;\n\n  box-shadow:\n    0 0 25px rgba(245,184,63,.08);\n\n}\n\n\n.ma7alak-category-icon{\n\n  font-size:20px;\n\n}\n\n\n/* =========================================================\n   RESULTS\n========================================================= */\n\n.ma7alak-results{\n\n  display:none;\n\n  margin-top:30px;\n\n  animation:\n    ma7alakSectionIn .45s ease both;\n\n}\n\n\n.ma7alak-results.visible{\n\n  display:block;\n\n}\n\n\n.ma7alak-results-top{\n\n  display:flex;\n\n  align-items:flex-end;\n\n  justify-content:space-between;\n\n  gap:20px;\n\n  padding-bottom:15px;\n\n  border-bottom:\n    1px solid rgba(255,255,255,.13);\n\n}\n\n\n.ma7alak-results-kicker{\n\n  margin-bottom:6px;\n\n  color:#c2975b;\n\n  font-size:9px;\n\n  font-weight:700;\n\n  letter-spacing:3px;\n\n  text-transform:uppercase;\n\n}\n\n\n.ma7alak-results-title{\n\n  margin:0;\n\n  font-family:\n    Georgia,\n    \"Times New Roman\",\n    serif;\n\n  font-size:31px;\n\n  line-height:1.05;\n\n  color:#fff;\n\n  letter-spacing:-.7px;\n\n}\n\n\n.ma7alak-results-subtitle{\n\n  margin:\n    7px 0 0;\n\n  color:#aaa198;\n\n  font-size:12px;\n\n}\n\n\n.ma7alak-results-count{\n\n  padding:\n    8px 13px;\n\n  border-radius:999px;\n\n  white-space:nowrap;\n\n  border:\n    1px solid rgba(245,184,63,.30);\n\n  background:\n    rgba(245,184,63,.065);\n\n  color:#d6b47b;\n\n  font-size:10px;\n\n  font-weight:700;\n\n}\n\n\n/* =========================================================\n   SHOP GRID\n========================================================= */\n\n.ma7alak-shop-grid{\n\n  display:grid;\n\n  grid-template-columns:\n    repeat(4,minmax(0,1fr));\n\n  gap:12px;\n\n  padding-top:14px;\n\n}\n\n\n/* =========================================================\n   SHOP CARD\n========================================================= */\n\n.ma7alak-shop-card{\n\n  position:relative;\n\n  min-width:0;\n\n  padding:\n    20px 13px 13px;\n\n  border-radius:20px;\n\n  border:\n    1px solid rgba(255,255,255,.22);\n\n  background:\n\n    radial-gradient(\n      circle at 50% 10%,\n      rgba(198,126,48,.17),\n      transparent 42%\n    ),\n\n    linear-gradient(\n      145deg,\n      rgba(75,58,45,.72),\n      rgba(28,24,21,.72)\n    );\n\n  backdrop-filter:blur(19px);\n\n  -webkit-backdrop-filter:blur(19px);\n\n  box-shadow:\n    0 18px 48px rgba(0,0,0,.38),\n    inset 0 1px rgba(255,255,255,.10);\n\n  text-align:center;\n\n  overflow:hidden;\n\n  transition:\n    transform .28s ease,\n    border-color .28s ease,\n    box-shadow .28s ease;\n\n}\n\n\n.ma7alak-shop-card::before{\n\n  content:\"\";\n\n  position:absolute;\n\n  width:190px;\n\n  height:190px;\n\n  left:50%;\n\n  top:-110px;\n\n  transform:translateX(-50%);\n\n  border-radius:50%;\n\n  background:\n    radial-gradient(\n      circle,\n      rgba(229,159,69,.19),\n      transparent 68%\n    );\n\n  pointer-events:none;\n\n}\n\n\n.ma7alak-shop-card::after{\n\n  content:\"\";\n\n  position:absolute;\n\n  left:-80%;\n\n  top:0;\n\n  width:55%;\n\n  height:100%;\n\n  transform:skewX(-18deg);\n\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255,255,255,.035),\n      transparent\n    );\n\n  transition:\n    left .7s ease;\n\n  pointer-events:none;\n\n}\n\n\n.ma7alak-shop-card:hover{\n\n  transform:translateY(-6px);\n\n  border-color:\n    rgba(245,184,63,.48);\n\n  box-shadow:\n    0 27px 65px rgba(0,0,0,.48),\n    0 0 35px rgba(245,184,63,.06),\n    inset 0 1px rgba(255,255,255,.12);\n\n}\n\n\n.ma7alak-shop-card:hover::after{\n\n  left:130%;\n\n}\n\n\n/* =========================================================\n   CIRCULAR SHOP IMAGE\n========================================================= */\n\n.ma7alak-shop-image-link{\n\n  width:100%;\n\n  display:flex;\n\n  justify-content:center;\n\n  align-items:center;\n\n  text-decoration:none;\n\n  position:relative;\n\n  z-index:2;\n\n}\n\n\n.ma7alak-shop-image-ring{\n\n  position:relative;\n\n  width:146px;\n\n  height:146px;\n\n  padding:4px;\n\n  border-radius:50%;\n\n  box-sizing:border-box;\n\n  background:\n    linear-gradient(\n      145deg,\n      #fff0c6,\n      #d99a47 36%,\n      #76502d 70%,\n      #2c2118\n    );\n\n  box-shadow:\n    0 0 0 1px rgba(255,255,255,.16),\n    0 13px 35px rgba(0,0,0,.48),\n    0 0 27px rgba(230,158,68,.11);\n\n  transition:\n    transform .3s ease,\n    box-shadow .3s ease;\n\n}\n\n\n.ma7alak-shop-card:hover\n.ma7alak-shop-image-ring{\n\n  transform:scale(1.035);\n\n  box-shadow:\n    0 0 0 1px rgba(255,255,255,.22),\n    0 16px 42px rgba(0,0,0,.55),\n    0 0 38px rgba(245,184,63,.17);\n\n}\n\n\n.ma7alak-shop-image-inner{\n\n  width:100%;\n\n  height:100%;\n\n  border-radius:50%;\n\n  overflow:hidden;\n\n  background:#15110d;\n\n  border:\n    3px solid rgba(15,12,9,.84);\n\n  box-sizing:border-box;\n\n}\n\n\n.ma7alak-shop-image-inner img{\n\n  display:block;\n\n  width:100%;\n\n  height:100%;\n\n  object-fit:cover;\n\n  object-position:center;\n\n}\n\n\n/* =========================================================\n   VERIFIED BADGE\n========================================================= */\n\n.ma7alak-verified-badge{\n\n  position:absolute;\n\n  right:calc(50% - 74px);\n\n  bottom:0;\n\n  width:27px;\n\n  height:27px;\n\n  border-radius:50%;\n\n  background:#1688ef;\n\n  border:\n    2px solid #fff;\n\n  color:#fff;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  font-size:14px;\n\n  font-weight:900;\n\n  box-shadow:\n    0 5px 16px rgba(0,0,0,.40);\n\n}\n\n\n/* =========================================================\n   SHOP CONTENT\n========================================================= */\n\n.ma7alak-shop-content{\n\n  position:relative;\n\n  z-index:3;\n\n  margin-top:15px;\n\n}\n\n\n.ma7alak-shop-title-row{\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  flex-wrap:wrap;\n\n  gap:5px;\n\n}\n\n\n.ma7alak-shop-name{\n\n  margin:0;\n\n  color:#fff;\n\n  font-family:\n    Georgia,\n    \"Times New Roman\",\n    serif;\n\n  font-size:20px;\n\n  line-height:1.15;\n\n  font-weight:700;\n\n  letter-spacing:-.2px;\n\n}\n\n\n.ma7alak-shop-arabic{\n\n  min-height:21px;\n\n  margin-top:4px;\n\n  direction:rtl;\n\n  color:#e5ddd4;\n\n  font-size:13px;\n\n  font-weight:600;\n\n  line-height:1.5;\n\n}\n\n\n/* =========================================================\n   CATEGORY PILL\n========================================================= */\n\n.ma7alak-shop-category-pill{\n\n  display:inline-flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  margin-top:8px;\n\n  padding:\n    5px 12px;\n\n  border-radius:999px;\n\n  border:\n    1px solid rgba(225,164,91,.45);\n\n  background:\n    rgba(181,110,40,.16);\n\n  color:#d9b98a;\n\n  font-size:8px;\n\n  font-weight:800;\n\n  letter-spacing:1px;\n\n  text-transform:uppercase;\n\n}\n\n\n/* =========================================================\n   LOCATION\n========================================================= */\n\n.ma7alak-shop-location{\n\n  display:flex;\n\n  justify-content:center;\n\n  align-items:center;\n\n  gap:5px;\n\n  margin-top:9px;\n\n  color:#bdb5ad;\n\n  font-size:10px;\n\n  line-height:1.3;\n\n}\n\n\n.ma7alak-location-icon{\n\n  font-size:13px;\n\n}\n\n\n/* =========================================================\n   FEATURED\n========================================================= */\n\n.ma7alak-featured{\n\n  display:inline-flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:5px;\n\n  margin-top:9px;\n\n  padding:\n    5px 10px;\n\n  border-radius:999px;\n\n  border:\n    1px solid rgba(245,184,63,.78);\n\n  background:\n    rgba(171,106,26,.13);\n\n  color:#ffd15e;\n\n  font-size:8px;\n\n  font-weight:800;\n\n  letter-spacing:.8px;\n\n  text-transform:uppercase;\n\n  box-shadow:\n    0 0 17px rgba(245,184,63,.08);\n\n  animation:\n    ma7alakFeaturedGlow 2.6s ease-in-out infinite;\n\n}\n\n\n.ma7alak-featured.red{\n\n  border-color:\n    rgba(255,91,91,.75);\n\n  color:#ff8585;\n\n  background:\n    rgba(170,40,40,.11);\n\n  animation:\n    ma7alakRedGlow 2.6s ease-in-out infinite;\n\n}\n\n\n/* =========================================================\n   VIEW PROFILE\n========================================================= */\n\n.ma7alak-profile-button{\n\n  width:100%;\n\n  min-height:43px;\n\n  margin-top:12px;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:9px;\n\n  box-sizing:border-box;\n\n  border-radius:13px;\n\n  border:\n    1px solid rgba(232,174,101,.58);\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(179,115,52,.48),\n      rgba(112,69,34,.34)\n    );\n\n  color:#fff;\n\n  text-decoration:none;\n\n  font-size:11px;\n\n  font-weight:700;\n\n  transition:.22s ease;\n\n}\n\n\n.ma7alak-profile-button:hover{\n\n  transform:translateY(-2px);\n\n  border-color:\n    rgba(255,207,111,.9);\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(205,137,58,.57),\n      rgba(120,73,35,.42)\n    );\n\n  box-shadow:\n    0 9px 25px rgba(0,0,0,.30);\n\n}\n\n\n.ma7alak-profile-arrow{\n\n  font-size:17px;\n\n  transition:\n    transform .2s ease;\n\n}\n\n\n.ma7alak-profile-button:hover\n.ma7alak-profile-arrow{\n\n  transform:translateX(4px);\n\n}\n\n\n/* =========================================================\n   EMPTY\n========================================================= */\n\n.ma7alak-empty{\n\n  display:none;\n\n  padding:\n    50px 20px;\n\n  text-align:center;\n\n  border-radius:22px;\n\n  border:\n    1px solid rgba(255,255,255,.14);\n\n  background:\n    rgba(255,255,255,.045);\n\n  margin-top:15px;\n\n}\n\n\n.ma7alak-empty-icon{\n\n  font-size:40px;\n\n  margin-bottom:10px;\n\n}\n\n\n.ma7alak-empty h3{\n\n  margin:0 0 6px;\n\n  font-family:\n    Georgia,\n    serif;\n\n  font-size:24px;\n\n}\n\n\n.ma7alak-empty p{\n\n  margin:0;\n\n  color:#999189;\n\n  font-size:12px;\n\n}\n\n\n/* =========================================================\n   CHANGE AREA\n========================================================= */\n\n.ma7alak-change-area{\n\n  display:none;\n\n  margin:\n    20px auto 0;\n\n  padding:\n    8px 14px;\n\n  border-radius:999px;\n\n  border:\n    1px solid rgba(255,255,255,.15);\n\n  background:\n    rgba(255,255,255,.04);\n\n  color:#aaa29a;\n\n  font-size:11px;\n\n  cursor:pointer;\n\n}\n\n\n.ma7alak-change-area.visible{\n\n  display:block;\n\n}\n\n\n/* =========================================================\n   BUSINESS CTA\n========================================================= */\n\n.ma7alak-business-cta{\n\n  margin-top:45px;\n\n  min-height:125px;\n\n  padding:\n    25px 28px;\n\n  box-sizing:border-box;\n\n  border-radius:22px;\n\n  border:\n    1px solid rgba(245,184,63,.38);\n\n  background:\n\n    radial-gradient(\n      circle at 75% 50%,\n      rgba(226,155,59,.22),\n      transparent 38%\n    ),\n\n    linear-gradient(\n      135deg,\n      rgba(42,33,26,.82),\n      rgba(19,16,14,.78)\n    );\n\n  backdrop-filter:blur(18px);\n\n  -webkit-backdrop-filter:blur(18px);\n\n  box-shadow:\n    0 20px 60px rgba(0,0,0,.38),\n    inset 0 1px rgba(255,255,255,.08);\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:space-between;\n\n  gap:25px;\n\n}\n\n\n.ma7alak-business-small{\n\n  margin-bottom:6px;\n\n  color:#b48a54;\n\n  font-size:8px;\n\n  letter-spacing:3px;\n\n  font-weight:800;\n\n  text-transform:uppercase;\n\n}\n\n\n.ma7alak-business-cta h2{\n\n  margin:0;\n\n  font-family:\n    Georgia,\n    \"Times New Roman\",\n    serif;\n\n  color:#fff;\n\n  font-size:27px;\n\n  line-height:1.15;\n\n}\n\n\n.ma7alak-business-cta h2 span{\n\n  color:#efc477;\n\n}\n\n\n.ma7alak-business-cta p{\n\n  margin:\n    6px 0 0;\n\n  color:#a9a097;\n\n  font-size:11px;\n\n}\n\n\n.ma7alak-add-button{\n\n  min-width:180px;\n\n  height:52px;\n\n  padding:\n    0 22px;\n\n  border-radius:14px;\n\n  background:\n    linear-gradient(\n      135deg,\n      #ffc958,\n      #d88b29\n    );\n\n  color:#241608;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:8px;\n\n  text-decoration:none;\n\n  font-size:12px;\n\n  font-weight:800;\n\n  box-shadow:\n    0 12px 32px rgba(214,137,36,.24);\n\n  transition:.23s ease;\n\n}\n\n\n.ma7alak-add-button:hover{\n\n  transform:translateY(-3px);\n\n  box-shadow:\n    0 17px 40px rgba(214,137,36,.35);\n\n}\n\n\n/* =========================================================\n   FOOTER\n========================================================= */\n\n.ma7alak-footer{\n\n  margin-top:35px;\n\n  padding-top:25px;\n\n  border-top:\n    1px solid rgba(255,255,255,.10);\n\n  text-align:center;\n\n}\n\n\n.ma7alak-footer-features{\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:0;\n\n}\n\n\n.ma7alak-footer-feature{\n\n  min-width:190px;\n\n  padding:\n    0 25px;\n\n  display:flex;\n\n  align-items:center;\n\n  justify-content:center;\n\n  gap:9px;\n\n  color:#d4cbc1;\n\n  font-size:10px;\n\n}\n\n\n.ma7alak-footer-feature + .ma7alak-footer-feature{\n\n  border-left:\n    1px solid rgba(255,255,255,.16);\n\n}\n\n\n.ma7alak-footer-feature-icon{\n\n  color:#efc27a;\n\n  font-size:22px;\n\n}\n\n\n.ma7alak-footer-feature-text{\n\n  text-align:left;\n\n}\n\n\n.ma7alak-footer-feature-text strong{\n\n  display:block;\n\n  color:#eee6dc;\n\n  font-size:10px;\n\n}\n\n\n.ma7alak-footer-feature-text span{\n\n  display:block;\n\n  margin-top:2px;\n\n  color:#777069;\n\n  font-size:8px;\n\n}\n\n\n.ma7alak-footer-logo{\n\n  margin-top:23px;\n\n  font-family:\n    Georgia,\n    serif;\n\n  color:#ded5cb;\n\n  font-size:24px;\n\n}\n\n\n.ma7alak-footer-tagline{\n\n  margin-top:5px;\n\n  color:#766e67;\n\n  font-size:7px;\n\n  letter-spacing:3px;\n\n  text-transform:uppercase;\n\n}\n\n\n/* =========================================================\n   ANIMATIONS\n========================================================= */\n\n@keyframes ma7alakSectionIn{\n\n  from{\n\n    opacity:0;\n\n    transform:translateY(13px);\n\n  }\n\n  to{\n\n    opacity:1;\n\n    transform:translateY(0);\n\n  }\n\n}\n\n\n@keyframes ma7alakFeaturedGlow{\n\n  0%,\n  100%{\n\n    box-shadow:\n      0 0 0 rgba(245,184,63,0);\n\n  }\n\n  50%{\n\n    box-shadow:\n      0 0 19px rgba(245,184,63,.16);\n\n  }\n\n}\n\n\n@keyframes ma7alakRedGlow{\n\n  0%,\n  100%{\n\n    box-shadow:\n      0 0 0 rgba(255,80,80,0);\n\n  }\n\n  50%{\n\n    box-shadow:\n      0 0 20px rgba(255,80,80,.15);\n\n  }\n\n}\n\n\n/* =========================================================\n   TABLET\n========================================================= */\n\n@media(max-width:1050px){\n\n  #ma7alak-shops-page{\n\n    padding-left:20px;\n\n    padding-right:20px;\n\n  }\n\n\n  .ma7alak-shop-grid{\n\n    grid-template-columns:\n      repeat(3,minmax(0,1fr));\n\n  }\n\n}\n\n\n/* =========================================================\n   MOBILE\n========================================================= */\n\n@media(max-width:700px){\n\n  #ma7alak-shops-page{\n\n    padding:\n      27px 9px 55px;\n\n  }\n\n\n  .ma7alak-side-left{\n\n    display:none;\n\n  }\n\n\n  .ma7alak-side-right{\n\n    right:3px;\n\n    top:10px;\n\n    font-size:14px;\n\n  }\n\n\n  .ma7alak-brand-name{\n\n    font-size:39px;\n\n  }\n\n\n  .ma7alak-brand-subtitle{\n\n    font-size:7px;\n\n    letter-spacing:3px;\n\n  }\n\n\n  .ma7alak-hero{\n\n    margin-top:20px;\n\n    margin-bottom:23px;\n\n  }\n\n\n  .ma7alak-hero-icon{\n\n    width:39px;\n\n    height:39px;\n\n    font-size:26px;\n\n  }\n\n\n  .ma7alak-hero h1{\n\n    font-size:47px;\n\n    letter-spacing:-1.7px;\n\n  }\n\n\n  .ma7alak-hero p{\n\n    padding:0 16px;\n\n    font-size:13px;\n\n  }\n\n\n  .ma7alak-search{\n\n    height:55px;\n\n    border-radius:16px;\n\n    font-size:12px;\n\n  }\n\n\n  .ma7alak-search-wrapper{\n\n    margin-bottom:21px;\n\n  }\n\n\n  .ma7alak-filter-label{\n\n    font-size:11px;\n\n  }\n\n\n  .ma7alak-area-grid{\n\n    grid-template-columns:\n      repeat(2,minmax(0,1fr));\n\n    gap:7px;\n\n  }\n\n\n  .ma7alak-area-button{\n\n    min-height:49px;\n\n    border-radius:13px;\n\n    font-size:11px;\n\n  }\n\n\n  .ma7alak-category-grid{\n\n    grid-template-columns:\n      repeat(2,minmax(0,1fr));\n\n    gap:7px;\n\n  }\n\n\n  .ma7alak-category-button{\n\n    min-height:55px;\n\n    border-radius:13px;\n\n    font-size:10px;\n\n    padding:\n      8px 5px;\n\n  }\n\n\n  .ma7alak-category-icon{\n\n    font-size:17px;\n\n  }\n\n\n  .ma7alak-results{\n\n    margin-top:25px;\n\n  }\n\n\n  .ma7alak-results-top{\n\n    align-items:flex-start;\n\n    flex-direction:column;\n\n    gap:9px;\n\n  }\n\n\n  .ma7alak-results-title{\n\n    font-size:27px;\n\n  }\n\n\n  .ma7alak-results-subtitle{\n\n    font-size:10px;\n\n  }\n\n\n  .ma7alak-results-count{\n\n    font-size:9px;\n\n  }\n\n\n  /* =====================================================\n     TWO LARGE CARDS PER ROW\n  ===================================================== */\n\n  .ma7alak-shop-grid{\n\n    grid-template-columns:\n      repeat(2,minmax(0,1fr));\n\n    gap:9px;\n\n    padding-top:11px;\n\n  }\n\n\n  .ma7alak-shop-card{\n\n    padding:\n      15px 7px 9px;\n\n    border-radius:18px;\n\n  }\n\n\n  .ma7alak-shop-image-ring{\n\n    width:118px;\n\n    height:118px;\n\n    padding:4px;\n\n  }\n\n\n  .ma7alak-shop-image-inner{\n\n    border-width:2px;\n\n  }\n\n\n  .ma7alak-verified-badge{\n\n    right:calc(50% - 61px);\n\n    width:23px;\n\n    height:23px;\n\n    font-size:12px;\n\n    border-width:2px;\n\n  }\n\n\n  .ma7alak-shop-content{\n\n    margin-top:11px;\n\n  }\n\n\n  .ma7alak-shop-name{\n\n    font-size:16px;\n\n  }\n\n\n  .ma7alak-shop-arabic{\n\n    font-size:10px;\n\n    margin-top:3px;\n\n  }\n\n\n  .ma7alak-shop-category-pill{\n\n    margin-top:7px;\n\n    padding:\n      5px 7px;\n\n    font-size:6.5px;\n\n    letter-spacing:.5px;\n\n  }\n\n\n  .ma7alak-shop-location{\n\n    margin-top:7px;\n\n    font-size:8px;\n\n  }\n\n\n  .ma7alak-location-icon{\n\n    font-size:10px;\n\n  }\n\n\n  .ma7alak-featured{\n\n    margin-top:7px;\n\n    padding:\n      5px 7px;\n\n    font-size:6.5px;\n\n    letter-spacing:.4px;\n\n  }\n\n\n  .ma7alak-profile-button{\n\n    min-height:37px;\n\n    margin-top:9px;\n\n    border-radius:11px;\n\n    font-size:9px;\n\n    gap:5px;\n\n  }\n\n\n  .ma7alak-profile-arrow{\n\n    font-size:13px;\n\n  }\n\n\n  /* CTA */\n\n  .ma7alak-business-cta{\n\n    margin-top:35px;\n\n    padding:\n      23px 15px;\n\n    border-radius:19px;\n\n    flex-direction:column;\n\n    text-align:center;\n\n    gap:17px;\n\n  }\n\n\n  .ma7alak-business-cta h2{\n\n    font-size:24px;\n\n  }\n\n\n  .ma7alak-business-cta p{\n\n    font-size:10px;\n\n  }\n\n\n  .ma7alak-add-button{\n\n    width:100%;\n\n    min-height:50px;\n\n    height:50px;\n\n  }\n\n\n  /* FOOTER */\n\n  .ma7alak-footer-features{\n\n    flex-direction:column;\n\n    gap:17px;\n\n  }\n\n\n  .ma7alak-footer-feature{\n\n    min-width:0;\n\n    padding:0;\n\n  }\n\n\n  .ma7alak-footer-feature + .ma7alak-footer-feature{\n\n    border-left:none;\n\n  }\n\n}\n\n\n/* =========================================================\n   VERY SMALL PHONES\n========================================================= */\n\n@media(max-width:390px){\n\n  #ma7alak-shops-page{\n\n    padding-left:6px;\n\n    padding-right:6px;\n\n  }\n\n\n  .ma7alak-shop-grid{\n\n    gap:7px;\n\n  }\n\n\n  .ma7alak-shop-card{\n\n    padding-left:5px;\n\n    padding-right:5px;\n\n  }\n\n\n  .ma7alak-shop-image-ring{\n\n    width:105px;\n\n    height:105px;\n\n  }\n\n\n  .ma7alak-verified-badge{\n\n    right:calc(50% - 54px);\n\n    width:21px;\n\n    height:21px;\n\n  }\n\n\n  .ma7alak-shop-name{\n\n    font-size:14px;\n\n  }\n\n\n  .ma7alak-shop-arabic{\n\n    font-size:9px;\n\n  }\n\n\n  .ma7alak-shop-location{\n\n    font-size:7.5px;\n\n  }\n\n\n  .ma7alak-profile-button{\n\n    font-size:8px;\n\n  }\n\n}\n\n\n/* =========================================================\n   MA7ALAK 2026 VISUAL + SEARCH POLISH\n========================================================= */\n\n.ma7alak-hero-icon.ma7alak-hero-eye{\n  width:76px;\n  height:58px;\n  margin-bottom:10px;\n  overflow:visible;\n  filter:drop-shadow(0 8px 18px rgba(0,0,0,.42));\n}\n\n.ma7alak-hero-eye img{\n  display:block;\n  width:72px;\n  height:54px;\n  object-fit:contain;\n  transform-origin:center;\n  animation:ma7alakEyeLook 4.2s ease-in-out infinite;\n  will-change:transform;\n}\n\n@keyframes ma7alakEyeLook{\n  0%,12%,100%{transform:translate3d(0,0,0) rotate(0deg) scale(1);}\n  22%{transform:translate3d(-7px,1px,0) rotate(-3deg) scale(1.03);}\n  38%{transform:translate3d(7px,-1px,0) rotate(3deg) scale(1.03);}\n  52%{transform:translate3d(0,2px,0) rotate(0deg) scale(.96,1.04);}\n  58%{transform:translate3d(0,0,0) rotate(0deg) scale(1);}\n  74%{transform:translate3d(5px,1px,0) rotate(2deg) scale(1.02);}\n  88%{transform:translate3d(-4px,-1px,0) rotate(-2deg) scale(1.02);}\n}\n\n.ma7alak-hero h1 .ma7alak-arabic-hero-title{\n  display:inline-block;\n  direction:rtl;\n  font-family:Tahoma,Arial,sans-serif;\n  font-weight:900;\n  letter-spacing:0;\n  color:transparent;\n  background:linear-gradient(90deg,#fff2c7,#ffbe3f,#ff7a18,#ff3d6e,#8d6bff,#4fd5ff,#fff2c7);\n  background-size:280% 100%;\n  -webkit-background-clip:text;\n  background-clip:text;\n  -webkit-text-fill-color:transparent;\n  animation:ma7alakHeroColorFlow 5s linear infinite,ma7alakHeroFloat 3s ease-in-out infinite;\n  filter:drop-shadow(0 5px 20px rgba(245,184,63,.18));\n  will-change:background-position,transform;\n}\n\n@keyframes ma7alakHeroColorFlow{\n  0%{background-position:0% 50%;}\n  100%{background-position:280% 50%;}\n}\n\n@keyframes ma7alakHeroFloat{\n  0%,100%{transform:translateY(0) scale(1);}\n  50%{transform:translateY(-3px) scale(1.015);}\n}\n\n.ma7alak-google-maps-icon{\n  display:inline-flex !important;\n  align-items:center;\n  justify-content:center;\n  flex:0 0 auto;\n}\n\n.ma7alak-google-maps-icon img{\n  display:block;\n  width:18px;\n  height:22px;\n  object-fit:contain;\n  filter:drop-shadow(0 2px 4px rgba(0,0,0,.28));\n}\n\n.ma7alak-shop-location .ma7alak-google-maps-icon img{\n  width:13px;\n  height:17px;\n}\n\n.ma7alak-business-cta{\n  margin-top:90px;\n}\n\n@media(max-width:700px){\n  .ma7alak-hero-icon.ma7alak-hero-eye{\n    width:66px;\n    height:50px;\n    margin-bottom:8px;\n  }\n\n  .ma7alak-hero-eye img{\n    width:62px;\n    height:48px;\n  }\n\n  .ma7alak-hero h1{\n    font-size:43px;\n  }\n\n  .ma7alak-business-cta{\n    margin-top:72px;\n  }\n\n  .ma7alak-google-maps-icon img{\n    width:16px;\n    height:20px;\n  }\n\n  .ma7alak-shop-location .ma7alak-google-maps-icon img{\n    width:11px;\n    height:15px;\n  }\n}\n\n\n\n/* =========================================================\n   MA7ALAK — LIVE STORY RING + STORY VIEWER\n   ========================================================= */\n\n.ma7alak-shop-image-link{\n  cursor:pointer;\n}\n\n.ma7alak-shop-image-ring.ma7alak-has-story{\n  padding:5px;\n  background:\n    conic-gradient(\n      from 0deg,\n      #ffd86b 0deg,\n      #f5a623 65deg,\n      #ffcc66 130deg,\n      #fff0b0 190deg,\n      #f5a623 250deg,\n      #ffd86b 315deg,\n      #ffd86b 360deg\n    );\n  box-shadow:\n    0 0 0 1px rgba(255,255,255,.18),\n    0 13px 35px rgba(0,0,0,.48),\n    0 0 30px rgba(245,184,63,.28);\n}\n\n/* Instagram-style expanding pulse. The shop image stays completely still. */\n.ma7alak-shop-image-ring.ma7alak-has-story::after{\n  content:\"\";\n  position:absolute;\n  left:50%;\n  top:50%;\n  width:100%;\n  height:100%;\n  box-sizing:border-box;\n  border:3px solid rgba(255,216,107,.95);\n  border-radius:50%;\n  transform:translate(-50%,-50%) scale(.92);\n  opacity:0;\n  pointer-events:none;\n  z-index:5;\n  animation:ma7alakInstagramStoryPulse 1.8s ease-out infinite;\n}\n\n@keyframes ma7alakInstagramStoryPulse{\n  0%{\n    transform:translate(-50%,-50%) scale(.92);\n    opacity:.95;\n  }\n  45%{\n    transform:translate(-50%,-50%) scale(1.08);\n    opacity:.62;\n  }\n  100%{\n    transform:translate(-50%,-50%) scale(1.28);\n    opacity:0;\n  }\n}\n\n.ma7alak-shop-image-ring.ma7alak-has-story\n.ma7alak-shop-image-inner{\n  border-width:3px;\n  border-color:#080706;\n}\n\n@keyframes ma7alakShopStorySnake{\n  from{\n    transform:rotate(0deg);\n  }\n  to{\n    transform:rotate(360deg);\n  }\n}\n\n/* Keep the image itself upright while the outer ring rotates. */\n.ma7alak-shop-image-ring.ma7alak-has-story\n.ma7alak-shop-image-inner{\n  transform:rotate(0deg);\n}\n\n.ma7alak-story-viewer{\n  position:fixed;\n  inset:0;\n  z-index:2147483000;\n  display:none;\n  align-items:center;\n  justify-content:center;\n  padding:18px;\n  box-sizing:border-box;\n  background:rgba(0,0,0,.88);\n  backdrop-filter:blur(18px);\n  -webkit-backdrop-filter:blur(18px);\n}\n\n.ma7alak-story-viewer.visible{\n  display:flex;\n}\n\n.ma7alak-story-viewer-backdrop{\n  position:absolute;\n  inset:0;\n}\n\n.ma7alak-story-viewer-shell{\n  position:relative;\n  z-index:2;\n  width:min(430px,94vw);\n  height:min(820px,92vh);\n  border-radius:24px;\n  overflow:hidden;\n  background:#080706;\n  border:1px solid rgba(255,255,255,.14);\n  box-shadow:\n    0 30px 100px rgba(0,0,0,.72),\n    0 0 55px rgba(245,184,63,.08);\n}\n\n.ma7alak-story-viewer-progress{\n  position:absolute;\n  z-index:10;\n  top:12px;\n  left:12px;\n  right:12px;\n  display:flex;\n  gap:4px;\n  pointer-events:none;\n}\n\n.ma7alak-story-progress-item{\n  position:relative;\n  flex:1;\n  height:3px;\n  overflow:hidden;\n  border-radius:999px;\n  background:rgba(255,255,255,.28);\n}\n\n.ma7alak-story-progress-item.done{\n  background:#fff;\n}\n\n.ma7alak-story-progress-item.current{\n  background:rgba(255,255,255,.28);\n}\n\n.ma7alak-story-progress-item.current::after{\n  content:\"\";\n  position:absolute;\n  inset:0;\n  transform-origin:left center;\n  transform:scaleX(0);\n  background:#fff;\n}\n\n.ma7alak-story-viewer-top{\n  position:absolute;\n  z-index:11;\n  top:26px;\n  left:14px;\n  right:14px;\n  display:flex;\n  align-items:center;\n  justify-content:space-between;\n  gap:10px;\n  pointer-events:none;\n}\n\n.ma7alak-story-viewer-shop{\n  min-width:0;\n  pointer-events:auto;\n  cursor:pointer;\n  -webkit-tap-highlight-color:transparent;\n  touch-action:manipulation;\n  text-decoration:none;\n  display:flex;\n  align-items:center;\n  gap:8px;\n  color:#fff;\n  text-shadow:0 2px 8px rgba(0,0,0,.65);\n}\n\n.ma7alak-story-viewer-shop-image{\n  width:34px;\n  height:34px;\n  flex:0 0 34px;\n  border-radius:50%;\n  object-fit:cover;\n  border:2px solid rgba(255,255,255,.9);\n  box-shadow:0 4px 15px rgba(0,0,0,.45);\n}\n\n.ma7alak-story-viewer-shop-name{\n  min-width:0;\n  overflow:hidden;\n  text-overflow:ellipsis;\n  white-space:nowrap;\n  font-size:12px;\n  font-weight:700;\n}\n\n.ma7alak-story-viewer-close{\n  pointer-events:auto;\n  width:36px;\n  height:36px;\n  flex:0 0 36px;\n  border:0;\n  border-radius:50%;\n  background:rgba(0,0,0,.38);\n  color:#fff;\n  font-size:25px;\n  line-height:1;\n  cursor:pointer;\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  backdrop-filter:blur(10px);\n  -webkit-backdrop-filter:blur(10px);\n}\n\n.ma7alak-story-viewer-media{\n  width:100%;\n  height:100%;\n  display:flex;\n  align-items:center;\n  justify-content:center;\n  background:#050403;\n}\n\n.ma7alak-story-viewer-media img,\n.ma7alak-story-viewer-media video{\n  width:100%;\n  height:100%;\n  object-fit:contain;\n  background:#050403;\n}\n\n.ma7alak-story-viewer-tap-left,\n.ma7alak-story-viewer-tap-right,\n.ma7alak-story-viewer-tap-left:hover,\n.ma7alak-story-viewer-tap-right:hover,\n.ma7alak-story-viewer-tap-left:focus,\n.ma7alak-story-viewer-tap-right:focus,\n.ma7alak-story-viewer-tap-left:focus-visible,\n.ma7alak-story-viewer-tap-right:focus-visible,\n.ma7alak-story-viewer-tap-left:active,\n.ma7alak-story-viewer-tap-right:active{\n  position:absolute !important;\n  z-index:8 !important;\n  top:0 !important;\n  bottom:0 !important;\n  width:35% !important;\n  height:auto !important;\n  min-width:0 !important;\n  min-height:0 !important;\n  padding:0 !important;\n  margin:0 !important;\n  border:0 !important;\n  border-radius:0 !important;\n  outline:0 !important;\n  background:transparent !important;\n  background-color:transparent !important;\n  background-image:none !important;\n  box-shadow:none !important;\n  color:transparent !important;\n  text-shadow:none !important;\n  appearance:none !important;\n  -webkit-appearance:none !important;\n  -webkit-tap-highlight-color:transparent !important;\n  transform:none !important;\n  opacity:1 !important;\n  cursor:pointer !important;\n}\n\n.ma7alak-story-viewer-tap-left{\n  left:0 !important;\n  right:auto !important;\n}\n\n.ma7alak-story-viewer-tap-right{\n  right:0 !important;\n  left:auto !important;\n}\n\n.ma7alak-story-viewer-tap-left::before,\n.ma7alak-story-viewer-tap-left::after,\n.ma7alak-story-viewer-tap-right::before,\n.ma7alak-story-viewer-tap-right::after{\n  content:none !important;\n  display:none !important;\n}\n\n.ma7alak-story-viewer-loading{\n  position:absolute;\n  z-index:9;\n  inset:0;\n  display:none;\n  align-items:center;\n  justify-content:center;\n  color:#fff;\n  font-size:12px;\n  background:rgba(0,0,0,.18);\n  pointer-events:none;\n}\n\n.ma7alak-story-viewer-loading.visible{\n  display:flex;\n}\n\n.ma7alak-story-viewer-loading::before{\n  content:\"\";\n  width:28px;\n  height:28px;\n  border:2px solid rgba(255,255,255,.25);\n  border-top-color:#fff;\n  border-radius:50%;\n  animation:ma7alakStorySpin .7s linear infinite;\n}\n\n@keyframes ma7alakStorySpin{\n  to{\n    transform:rotate(360deg);\n  }\n}\n\n@media(max-width:700px){\n\n  .ma7alak-shop-image-ring.ma7alak-has-story{\n    padding:5px;\n  }\n\n  .ma7alak-story-viewer{\n    padding:0;\n  }\n\n  .ma7alak-story-viewer-shell{\n    width:100vw;\n    height:100dvh;\n    max-width:none;\n    max-height:none;\n    border-radius:0;\n    border:0;\n  }\n\n  .ma7alak-story-viewer-progress{\n    top:10px;\n    left:9px;\n    right:9px;\n  }\n\n  .ma7alak-story-viewer-top{\n    top:23px;\n  }\n}";
    (document.head || document.documentElement).appendChild(style);
  }
})();

(function(){

  "use strict";


  /* =========================================================
     ONLY RUN ON ACTUAL SHOPS PAGE
  ========================================================= */

  function getPath(){

    return window.location.pathname
      .replace(/\/+/g,"/")
      .replace(/\/$/,"")
      .toLowerCase();

  }


  if(
    getPath() !== "/shwf-almhlat-"
  ){

    return;

  }


  /* =========================================================
     PAGE CLASSES
  ========================================================= */

  document.documentElement.classList.add(
    "ma7alak-shops-page-active"
  );


  if(document.body){

    document.body.classList.add(
      "ma7alak-shops-body"
    );

  }


  /* =========================================================
     SHOP DATA — LIVE FROM SUPABASE

     Shops are no longer hardcoded in this GitHub file.
     Active rows from public.shop_profiles are loaded at runtime
     and normalized into the exact object shape the existing
     filters, cards and Story system already use.
  ========================================================= */

  let shops = [];


  /* =========================================================
     BUILD PAGE
  ========================================================= */

  const page =
    document.createElement("div");


  page.id =
    "ma7alak-shops-page";


  page.innerHTML = `

    <!-- =====================================================
         BRAND
    ====================================================== -->

    <div class="ma7alak-top-brand">

      <div class="ma7alak-side-left">

        EXPLORE<br>
        SHOP LOCAL<br>
        BE PART OF IT

      </div>


      <div class="ma7alak-side-right">

        Lebanon<br>
        Local<br>
        Always ♡

      </div>


      <div class="ma7alak-brand-name">
        Ma7alak
      </div>


      <div class="ma7alak-brand-subtitle">

        SUPPORT LOCAL
        &nbsp; • &nbsp;
        DISCOVER MORE

      </div>


      <div class="ma7alak-brand-rule"></div>

    </div>


    <!-- =====================================================
         HERO
    ====================================================== -->

    <section class="ma7alak-hero">

      <div class="ma7alak-hero-icon ma7alak-hero-eye" aria-hidden="true">
        <img
          src="https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/020e2776-1fe4-4b32-9ac0-8e1358911397-removebg-preview.png"
          alt=""
          draggable="false"
        >
      </div>


      <h1>

        <span class="ma7alak-arabic-hero-title">شوف المحلات</span>

      </h1>


      <p>

        Discover amazing local businesses,
        hidden gems and places worth seeing around you.

      </p>

    </section>


    <!-- =====================================================
         SEARCH
    ====================================================== -->

    <div class="ma7alak-search-wrapper">

      <input
        id="ma7alak-shop-search"
        class="ma7alak-search"
        type="search"
        autocomplete="off"
        placeholder="Search shops, places or categories..."
      >


      <div class="ma7alak-search-icon">
        ⌕
      </div>

    </div>


    <!-- =====================================================
         AREA
    ====================================================== -->

    <div class="ma7alak-filter-block">

      <div class="ma7alak-filter-label">
        Select Area
      </div>


      <div
        id="ma7alak-area-grid"
        class="ma7alak-area-grid"
      ></div>

    </div>


    <!-- =====================================================
         CATEGORY
    ====================================================== -->

    <section
      id="ma7alak-category-section"
      class="ma7alak-category-section"
    >

      <div class="ma7alak-filter-label">
        Select Category
      </div>


      <div
        id="ma7alak-category-grid"
        class="ma7alak-category-grid"
      ></div>

    </section>


    <!-- =====================================================
         RESULTS
    ====================================================== -->

    <section
      id="ma7alak-results"
      class="ma7alak-results"
    >

      <div class="ma7alak-results-top">

        <div>

          <div
            id="ma7alak-results-kicker"
            class="ma7alak-results-kicker"
          >
            SELECTED AREA
          </div>


          <h2
            id="ma7alak-results-title"
            class="ma7alak-results-title"
          >
            Cafés & Coffee Spots
          </h2>


          <p
            id="ma7alak-results-subtitle"
            class="ma7alak-results-subtitle"
          >
            Discover local businesses around you.
          </p>

        </div>


        <div
          id="ma7alak-results-count"
          class="ma7alak-results-count"
        >
          0 shops
        </div>

      </div>


      <div
        id="ma7alak-shop-grid"
        class="ma7alak-shop-grid"
      ></div>


      <div
        id="ma7alak-empty"
        class="ma7alak-empty"
      >

        <div class="ma7alak-empty-icon">
          🔎
        </div>


        <h3>
          Nothing found yet
        </h3>


        <p>
          Try another shop, area or category.
        </p>

      </div>


      <button
        id="ma7alak-change-area"
        class="ma7alak-change-area"
      >

        ← Change area

      </button>

    </section>


    <!-- =====================================================
         BUSINESS CTA
    ====================================================== -->

    <section class="ma7alak-business-cta">

      <div>

        <div class="ma7alak-business-small">
          FOR LOCAL BUSINESSES
        </div>


        <h2>

          Your shop belongs on
          <span>Ma7alak.</span>

        </h2>


        <p>

          Reach more people.
          Grow your business.
          Be part of something local.

        </p>

      </div>


      <a
        class="ma7alak-add-button"
        href="https://ma7alak.com/dhyf-mhlk-"
        onclick="
          window.top.location.href='https://ma7alak.com/dhyf-mhlk-';
          return false;
        "
      >

        Add Your Shop

        <span>
          →
        </span>

      </a>

    </section>


    <!-- =====================================================
         FOOTER
    ====================================================== -->

    <footer class="ma7alak-footer">

      <div class="ma7alak-footer-features">


        <div class="ma7alak-footer-feature">

          <div class="ma7alak-footer-feature-icon">
            ♡
          </div>

          <div class="ma7alak-footer-feature-text">

            <strong>
              Support Local
            </strong>

            <span>
              Stronger Communities
            </span>

          </div>

        </div>


        <div class="ma7alak-footer-feature">

          <div class="ma7alak-footer-feature-icon">
            ◈
          </div>

          <div class="ma7alak-footer-feature-text">

            <strong>
              Discover More
            </strong>

            <span>
              Hidden Gems
            </span>

          </div>

        </div>


        <div class="ma7alak-footer-feature">

          <div class="ma7alak-footer-feature-icon">
            ✦
          </div>

          <div class="ma7alak-footer-feature-text">

            <strong>
              A Stronger Lebanon
            </strong>

            <span>
              Together
            </span>

          </div>

        </div>


      </div>


      <div class="ma7alak-footer-logo">
        Ma7alak
      </div>


      <div class="ma7alak-footer-tagline">
        More Than A Place • A Community
      </div>

    </footer>

  `;


  /* =========================================================
     HEADER DETECTION
  ========================================================= */

  function findHeader(){

    const selectors = [

      "header",

      "[role='banner']",

      ".site-header",

      ".main-header",

      ".website-header",

      ".header",

      "nav"

    ];


    for(
      const selector of selectors
    ){

      const found =
        document.querySelector(selector);


      if(found){

        return found;

      }

    }


    return null;

  }


  /* =========================================================
     INSERT PAGE
  ========================================================= */

  function insertPage(){

    if(
      document.getElementById(
        "ma7alak-shops-page"
      )
    ){

      return true;

    }


    const header =
      findHeader();


    if(header){

      header.insertAdjacentElement(
        "afterend",
        page
      );

      return true;

    }


    if(document.body){

      document.body.insertBefore(
        page,
        document.body.firstChild
      );

      return true;

    }


    return false;

  }


  /* =========================================================
     STATE
  ========================================================= */

  let selectedArea =
    null;


  let selectedCategory =
    null;


  let searchTerm =
    "";


  /* =========================================================
     ELEMENT REFERENCES
  ========================================================= */

  let areaButtons;

  let categoryButtons;

  let areaGrid;

  let areaFilterBlock;

  let categoryGrid;

  let categorySection;

  let results;

  let shopGrid;

  let resultCount;

  let resultsTitle;

  let resultsSubtitle;

  let resultsKicker;

  let empty;

  let changeArea;

  let searchInput;


  /* =========================================================
     INITIALIZE
  ========================================================= */

  async function initialize(){

    areaGrid =
      page.querySelector(
        "#ma7alak-area-grid"
      );

    areaFilterBlock =
      areaGrid ? areaGrid.closest(".ma7alak-filter-block") : null;


    categoryGrid =
      page.querySelector(
        "#ma7alak-category-grid"
      );


    areaButtons =
      page.querySelectorAll(
        ".ma7alak-area-button"
      );


    categoryButtons =
      page.querySelectorAll(
        ".ma7alak-category-button"
      );


    categorySection =
      page.querySelector(
        "#ma7alak-category-section"
      );


    results =
      page.querySelector(
        "#ma7alak-results"
      );


    shopGrid =
      page.querySelector(
        "#ma7alak-shop-grid"
      );


    resultCount =
      page.querySelector(
        "#ma7alak-results-count"
      );


    resultsTitle =
      page.querySelector(
        "#ma7alak-results-title"
      );


    resultsSubtitle =
      page.querySelector(
        "#ma7alak-results-subtitle"
      );


    resultsKicker =
      page.querySelector(
        "#ma7alak-results-kicker"
      );


    empty =
      page.querySelector(
        "#ma7alak-empty"
      );


    changeArea =
      page.querySelector(
        "#ma7alak-change-area"
      );


    searchInput =
      page.querySelector(
        "#ma7alak-shop-search"
      );


    ma7alakBindStoryCardClicks();

    /*
     * Load the live shop directory first.
     * No placeholder cards are created: only active Supabase rows
     * become real shop cards when the visitor selects filters.
     */
    await ma7alakLoadShopProfiles();

    /*
     * Build Area buttons from the live shop rows.
     * Category buttons are then built dynamically for the selected area.
     */
    ma7alakRenderDynamicAreas();

    bindEvents();

    /*
     * Start the existing live Story system after shop data exists,
     * so shop_slug keeps linking each owner's Story to its shop.
     */
    ma7alakStartStorySystem();
    ma7alakStartDirectoryRealtime();

  }


  /* =========================================================
     DYNAMIC AREA + CATEGORY FILTERS
  ========================================================= */

  function ma7alakEscapeHtml(value){

    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");

  }


  let ma7alakLiveCategoryIcons = new Map();
  let ma7alakLiveCategoryNames = new Map();
  let ma7alakLiveCityNames = new Map();

  /*
     Directory filter identity and card label are intentionally separate.
     - shop.category = stable category/filter key assigned by Admin
     - shop.categoryName = free text shown only on the shop card
     - ma7alakLiveCategoryNames = official Directory Control category label
  */
  function ma7alakShopRegion(shop){
    if(!shop) return "";

    const area=String(shop.area || "").trim();
    if(area) return area;

    const cityKey=String(shop.city || "").trim();
    if(!cityKey) return "";

    return String(
      ma7alakLiveCityNames.get(cityKey) ||
      ma7alakLiveCityNames.get(cityKey.toLocaleLowerCase()) ||
      cityKey
    ).trim();
  }

  function ma7alakCategoryIcon(category,name){

    const exactKey = String(category || "").trim();

    if(ma7alakLiveCategoryIcons.has(exactKey)){
      return ma7alakLiveCategoryIcons.get(exactKey) || "🏪";
    }

    const text =
      (String(category || "") + " " + String(name || ""))
        .toLowerCase();

    if(text.includes("cafe") || text.includes("coffee")) return "☕";
    if(text.includes("food") || text.includes("restaurant") || text.includes("kiosk")) return "🍴";
    if(text.includes("cloth") || text.includes("fashion")) return "👕";
    if(text.includes("tattoo") || text.includes("piercing") || text.includes("makeup") || text.includes("beauty")) return "✦";
    if(text.includes("gym") || text.includes("fitness")) return "🏋";
    if(text.includes("barber") || text.includes("salon") || text.includes("hair")) return "✂";
    if(text.includes("phone") || text.includes("mobile") || text.includes("electronic")) return "📱";
    if(text.includes("service")) return "⚒";

    return "🏪";

  }


  function ma7alakRenderDynamicAreas(){

    const areas =
      Array.from(
        new Set(
          shops
            .map(shop => ma7alakShopRegion(shop))
            .filter(Boolean)
        )
      )
      .sort((a,b) =>
        a.localeCompare(b,undefined,{sensitivity:"base"})
      );

    areaGrid.innerHTML =
      areas
        .map(area => `
          <button
            class="ma7alak-area-button"
            data-area="${ma7alakEscapeHtml(area)}"
            type="button"
          >
            <span class="icon ma7alak-google-maps-icon" aria-hidden="true">
              <img src="https://www.gstatic.com/images/branding/product/2x/maps_96in128dp.png" alt="">
            </span>
            ${ma7alakEscapeHtml(area)}
          </button>
        `)
        .join("");

    areaButtons =
      page.querySelectorAll(
        ".ma7alak-area-button"
      );

  }


  function ma7alakNormalizeCategory(value){
    return String(value || "").trim().toLocaleLowerCase();
  }

  function ma7alakCategoryMatches(shopCategory, selectedKey){
    const shopValue = ma7alakNormalizeCategory(shopCategory);
    const selectedValue = ma7alakNormalizeCategory(selectedKey);
    if(!shopValue || !selectedValue) return false;
    if(shopValue === selectedValue) return true;

    const officialName = ma7alakNormalizeCategory(
      ma7alakLiveCategoryNames.get(selectedKey) ||
      ma7alakLiveCategoryNames.get(selectedValue) ||
      ""
    );

    return Boolean(officialName && shopValue === officialName);
  }

  async function ma7alakRenderDynamicCategories(area){

    /*
     * Load category metadata from Admin/Supabase, but ONLY render categories
     * that are actually assigned to at least one active shop in this Area.
     */
    try{
      const liveClient = await ma7alakLoadSupabase();
      if(liveClient && typeof liveClient.from === "function"){
        const { data:liveRows, error:liveError } = await liveClient
          .from("shop_categories")
          .select("category_key,category_name,icon,is_active,sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending:true });

        if(!liveError && Array.isArray(liveRows)){
          ma7alakLiveCategoryIcons = new Map();
          ma7alakLiveCategoryNames = new Map();

          liveRows.forEach(function(row){
            const key = String(row && row.category_key || "").trim();
            if(!key) return;
            const name = String(row.category_name || key).trim();
            const icon = String(row.icon || "🏪").trim() || "🏪";
            ma7alakLiveCategoryIcons.set(key,icon);
            ma7alakLiveCategoryIcons.set(key.toLocaleLowerCase(),icon);
            ma7alakLiveCategoryNames.set(key,name);
            ma7alakLiveCategoryNames.set(key.toLocaleLowerCase(),name);
          });
        }
      }
    }catch(liveCategoryError){
      console.error("Ma7alak Shops: direct category metadata load failed.", liveCategoryError);
    }

    const categoryMap = new Map();
    const areaValue = String(area || "").trim().toLocaleLowerCase();

    shops.forEach(function(shop){
      if(!shop) return;
      if(String(ma7alakShopRegion(shop) || "").trim().toLocaleLowerCase() !== areaValue) return;

      const rawCategory = String(shop.category || "").trim();
      if(!rawCategory) return;

      const normalizedRaw = ma7alakNormalizeCategory(rawCategory);
      let key = rawCategory;
      let name = String(shop.categoryName || rawCategory).trim();

      /* Resolve Admin category key/name even if an older shop row stored the label. */
      ma7alakLiveCategoryNames.forEach(function(liveName, liveKey){
        if(ma7alakNormalizeCategory(liveKey) === normalizedRaw ||
           ma7alakNormalizeCategory(liveName) === normalizedRaw){
          key = String(liveKey || rawCategory).trim();
          name = String(liveName || shop.categoryName || rawCategory).trim();
        }
      });

      const duplicate = Array.from(categoryMap.keys()).some(function(existing){
        return ma7alakNormalizeCategory(existing) === ma7alakNormalizeCategory(key);
      });

      if(!duplicate){
        categoryMap.set(key,name);
      }
    });

    const categories = Array.from(categoryMap.entries()).sort(function(a,b){
      return a[1].localeCompare(b[1],undefined,{sensitivity:"base"});
    });

    categoryGrid.innerHTML = categories.map(function(entry){
      const key = entry[0];
      const name = entry[1];
      return `
        <button
          class="ma7alak-category-button"
          data-category="${ma7alakEscapeHtml(key)}"
          type="button"
        >
          <span class="ma7alak-category-icon">
            ${ma7alakCategoryIcon(key,name)}
          </span>
          ${ma7alakEscapeHtml(name)}
        </button>
      `;
    }).join("");

    categoryButtons = page.querySelectorAll(".ma7alak-category-button");
  }


  /* =========================================================
     EVENTS
  ========================================================= */

  function bindEvents(){


    /* AREA — DYNAMIC BUTTONS */

    areaGrid.addEventListener(
      "click",
      async function(event){

        const button =
          event.target.closest(
            ".ma7alak-area-button"
          );

        if(!button){
          return;
        }

        const clickedArea = button.dataset.area;
        /* Only treat it as a toggle-close when this Area is already OPEN.
           selectedArea can remain set while the Category panel is hidden,
           so comparing selectedArea alone could swallow the next tap. */
        const sameArea =
          selectedArea === clickedArea &&
          categorySection.classList.contains("visible");

        areaButtons = page.querySelectorAll(
          ".ma7alak-area-button"
        );

        areaButtons.forEach(function(item){
          item.classList.remove("active");
        });

        selectedCategory = null;
        searchInput.value = "";
        searchTerm = "";
        results.classList.remove("visible");
        shopGrid.innerHTML = "";
        empty.style.display = "none";
        changeArea.classList.remove("visible");

        /* Tapping the selected Area again closes its Category panel. */
        if(sameArea){
          selectedArea = null;
          categorySection.classList.remove("visible");
          categoryGrid.innerHTML = "";
          button.blur();
          return;
        }

        selectedArea = clickedArea;
        button.classList.add("active");

        /*
         * Render categories for the selected Area. If anything in the live
         * category metadata path fails on a browser, never leave the visitor
         * with an empty Category section: rebuild directly from the already
         * loaded active shop_profiles rows.
         */
        try{
          await ma7alakRenderDynamicCategories(selectedArea);
        }catch(categoryRenderError){
          console.error("Ma7alak Shops: category render failed.", categoryRenderError);
          categoryGrid.innerHTML = "";
        }

        if(!categoryGrid.children.length){
          const emergencyCategories = new Map();

          shops.forEach(function(shop){
            const key = String(shop && shop.category || "").trim();
            if(!key) return;

            const name = String(
              (shop && shop.categoryName) ||
              key
            ).trim();

            if(!Array.from(emergencyCategories.keys()).some(function(existing){
              return String(existing).toLocaleLowerCase() === key.toLocaleLowerCase();
            })){
              emergencyCategories.set(key,name);
            }
          });

          categoryGrid.innerHTML = Array.from(emergencyCategories.entries())
            .sort(function(a,b){
              return a[1].localeCompare(b[1],undefined,{sensitivity:"base"});
            })
            .map(function(entry){
              const key = entry[0];
              const name = entry[1];
              return `
                <button
                  class="ma7alak-category-button"
                  data-category="${ma7alakEscapeHtml(key)}"
                  type="button"
                >
                  <span class="ma7alak-category-icon">🏪</span>
                  ${ma7alakEscapeHtml(name)}
                </button>
              `;
            })
            .join("");
        }

        /* A newly opened Area must never inherit an old Category selection. */
        categoryButtons = page.querySelectorAll(
          ".ma7alak-category-button"
        );
        categoryButtons.forEach(function(item){
          item.classList.remove("active");
        });

        categorySection.classList.add("visible");
        button.blur();

      }
    );


    /* CATEGORY — DYNAMIC BUTTONS */

    categoryGrid.addEventListener(
      "click",
      function(event){

        const button =
          event.target.closest(
            ".ma7alak-category-button"
          );

        if(
          !button ||
          !selectedArea
        ){
          return;
        }

        const clickedCategory = button.dataset.category;
        const sameCategory = selectedCategory === clickedCategory;

        categoryButtons = page.querySelectorAll(
          ".ma7alak-category-button"
        );

        categoryButtons.forEach(function(item){
          item.classList.remove("active");
        });

        /* Tapping the selected Category again deselects it and closes results. */
        if(sameCategory){
          selectedCategory = null;
          results.classList.remove("visible");
          shopGrid.innerHTML = "";
          empty.style.display = "none";
          changeArea.classList.remove("visible");
          button.blur();
          return;
        }

        selectedCategory = clickedCategory;
        button.classList.add("active");
        renderResults();
        categorySection.classList.add("visible");
        button.blur();

      }
    );


    /* SEARCH */

    searchInput.addEventListener(
      "input",
      function(){

        searchTerm =
          this.value
            .trim()
            .toLowerCase();

        /*
           LIVE GLOBAL SEARCH:
           As soon as the visitor types, search every active shop.
           This works whether no filter, one filter, or both filters are selected.
        */
        if(searchTerm){
          renderResults();
          return;
        }

        /* If search is cleared, return to the chosen Area + Category view. */
        if(selectedArea && selectedCategory){
          renderResults();
        }
        else{
          results.classList.remove("visible");
          shopGrid.innerHTML = "";
          empty.style.display = "none";
          changeArea.classList.remove("visible");
        }

      }
    );


    /* CHANGE AREA */

    changeArea.addEventListener(
      "click",
      function(){

        selectedArea =
          null;


        selectedCategory =
          null;


        searchTerm =
          "";


        searchInput.value =
          "";


        results.classList.remove(
          "visible"
        );


        categorySection.classList.remove(
          "visible"
        );

        if(areaFilterBlock){
          areaFilterBlock.style.display = "block";
        }


        categoryGrid.innerHTML =
          "";


        categoryButtons =
          page.querySelectorAll(
            ".ma7alak-category-button"
          );


        areaButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        categoryButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );

        /* Return the visitor to the Area selector after leaving results. */
        if(areaFilterBlock){
          requestAnimationFrame(function(){
            areaFilterBlock.scrollIntoView({
              behavior:"smooth",
              block:"start"
            });
          });
        }


      }
    );

  }


  /* =========================================================
     RENDER RESULTS
  ========================================================= */

  function renderResults(){

    const isLiveSearch = Boolean(searchTerm);

    /*
       Normal browsing still uses Area + Category.
       Typing in Search bypasses those requirements and searches globally.
    */
    if(!isLiveSearch && (!selectedArea || !selectedCategory)){
      return;
    }

    results.classList.add(
      "visible"
    );

    const categoryButton =
      selectedCategory
        ? page.querySelector(
            '.ma7alak-category-button[data-category="' +
            selectedCategory +
            '"]'
          )
        : null;

    let categoryName =
      categoryButton
        ? categoryButton.textContent.trim()
        : "Shops";

    let filtered =
      shops.filter(
        shop => {

          /*
             While typing, ignore selected Area/Category completely.
             This makes the search bar useful from anywhere on the page.
          */
          if(isLiveSearch){

            const searchable = (
              shop.name +
              " " +
              shop.arabic +
              " " +
              ma7alakShopRegion(shop) +
              " " +
              shop.category +
              " " +
              (ma7alakLiveCategoryNames.get(shop.category) || "") +
              " " +
              shop.categoryName +
              " " +
              shop.location
            ).toLowerCase();

            return searchable.includes(searchTerm);

          }

          return (
            String(ma7alakShopRegion(shop) || "").trim().toLocaleLowerCase() ===
              String(selectedArea || "").trim().toLocaleLowerCase() &&
            ma7alakCategoryMatches(shop.category, selectedCategory)
          );

        }
      );

    if(isLiveSearch){

      resultsKicker.textContent =
        "LIVE SEARCH";

      resultsTitle.textContent =
        'Results for “' + searchInput.value.trim() + '”';

      resultsSubtitle.textContent =
        filtered.length +
        (filtered.length === 1 ? " matching shop" : " matching shops") +
        " found across Ma7alak";

    }
    else{

      resultsKicker.textContent =
        selectedArea.toUpperCase();

      resultsTitle.textContent =
        categoryName;

      resultsSubtitle.textContent =
        filtered.length +
        (filtered.length === 1 ? " local shop" : " local shops") +
        " found in " +
        selectedArea;

    }

    resultCount.textContent =
      filtered.length +
      (filtered.length === 1 ? " shop" : " shops");

    shopGrid.innerHTML =
      "";


    if(
      filtered.length === 0
    ){

      empty.style.display =
        "block";


      changeArea.classList.add(
        "visible"
      );


      return;

    }


    empty.style.display =
      "none";


    changeArea.classList.add(
      "visible"
    );


    filtered.forEach(
      shop => {

        shopGrid.appendChild(
          createShopCard(shop)
        );

      }
    );

  }



  /* =========================================================
     LIVE STORIES — SUPABASE
     ========================================================= */

  const MA7ALAK_SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const MA7ALAK_SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  let ma7alakSupabaseClient =
    null;

  let ma7alakActiveStoryShops =
    new Set();

  /*
   * Story IDs already viewed by this visitor.
   * Stored locally so a viewed shop does not keep
   * showing the "new story" animation after opening it.
   */
  const MA7ALAK_VIEWED_STORIES_KEY =
    "ma7alak_viewed_story_ids";

  let ma7alakViewedStoryIds =
    new Set();

  try{
    const savedViewedStories =
      JSON.parse(
        localStorage.getItem(
          MA7ALAK_VIEWED_STORIES_KEY
        ) || "[]"
      );

    if(Array.isArray(savedViewedStories)){
      ma7alakViewedStoryIds =
        new Set(
          savedViewedStories.map(
            function(id){
              return String(id);
            }
          )
        );
    }
  }catch(e){}

  function ma7alakSaveViewedStories(){
    try{
      localStorage.setItem(
        MA7ALAK_VIEWED_STORIES_KEY,
        JSON.stringify(
          Array.from(ma7alakViewedStoryIds)
        )
      );
    }catch(e){}
  }

  function ma7alakMarkStoriesViewed(stories){
    (stories || []).forEach(
      function(story){
        if(story && story.id != null){
          ma7alakViewedStoryIds.add(
            String(story.id)
          );
        }
      }
    );

    ma7alakSaveViewedStories();
  }

  let ma7alakStoryViewer =
    null;

  let ma7alakStoryItems =
    [];

  let ma7alakStoryIndex =
    0;

  let ma7alakStoryTimer =
    null;

  let ma7alakStoryViewerShop =
    null;

  let ma7alakStoryChannel =
    null;

  let ma7alakStoryLoaded =
    false;


  function ma7alakGetSupabaseClient(){

    /*
     * IMPORTANT: use the same authenticated/shared Supabase client already
     * used by the rest of Ma7alak. Creating a private client here can leave
     * Directory metadata on a different auth/bootstrap state: the page can
     * load Areas from shop_profiles while shop_categories stays empty.
     */
    const sharedCandidates = [
      window.Ma7alakAccount && window.Ma7alakAccount.client,
      window.Ma7alakSupabaseBootstrap && window.Ma7alakSupabaseBootstrap.client,
      window.Ma7alakSupabase && window.Ma7alakSupabase.client,
      window.__MA7ALAK_SHARED_SUPABASE__,
      window.Ma7alakOwnerAuth && window.Ma7alakOwnerAuth.client
    ];

    for(const candidate of sharedCandidates){
      if(candidate && typeof candidate.from === "function"){
        ma7alakSupabaseClient = candidate;
        return ma7alakSupabaseClient;
      }
    }

    if(
      ma7alakSupabaseClient &&
      typeof ma7alakSupabaseClient.from === "function"
    ){
      return ma7alakSupabaseClient;
    }

    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){
      ma7alakSupabaseClient =
        window.supabase.createClient(
          MA7ALAK_SUPABASE_URL,
          MA7ALAK_SUPABASE_KEY
        );

      return ma7alakSupabaseClient;
    }

    return null;

  }


  function ma7alakLoadSupabase(){

    return new Promise(
      function(resolve){

        const existing =
          ma7alakGetSupabaseClient();

        if(existing){

          resolve(existing);

          return;

        }

        const script =
          document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload =
          function(){

            resolve(
              ma7alakGetSupabaseClient()
            );

          };

        script.onerror =
          function(){

            resolve(null);

          };

        document.head.appendChild(
          script
        );

      }
    );

  }


  /* =========================================================
     LOAD ACTIVE SHOP DIRECTORY DATA FROM SUPABASE
  ========================================================= */

  async function ma7alakLoadShopProfiles(){

    const client =
      await ma7alakLoadSupabase();

    if(!client){
      console.error(
        "Ma7alak Shops: Supabase client could not load."
      );
      shops = [];
      return false;
    }

    const { data:categoryRows, error:categoryError } =
      await client
        .from("shop_categories")
        .select("category_key,category_name,icon,is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending:true });

    if(!categoryError){
      ma7alakLiveCategoryIcons = new Map();
      ma7alakLiveCategoryNames = new Map();
      (categoryRows || []).forEach(row => {
        const key=String(row.category_key || "").trim();
        const name=String(row.category_name || row.category_key || "").trim();
        const icon=String(row.icon || "🏪").trim() || "🏪";
        if(!key) return;
        ma7alakLiveCategoryIcons.set(key,icon);
        ma7alakLiveCategoryIcons.set(key.toLocaleLowerCase(),icon);
        ma7alakLiveCategoryNames.set(key,name);
        ma7alakLiveCategoryNames.set(key.toLocaleLowerCase(),name);
      });
    }

    const { data:cityRows, error:cityError } =
      await client
        .from("shop_cities")
        .select("city_key,city_name,is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending:true });

    if(!cityError){
      ma7alakLiveCityNames = new Map();
      (cityRows || []).forEach(row => {
        const key=String(row.city_key || "").trim();
        const name=String(row.city_name || row.city_key || "").trim();
        if(!key) return;
        ma7alakLiveCityNames.set(key,name);
        ma7alakLiveCityNames.set(key.toLocaleLowerCase(),name);
      });
    }

    const { data, error } =
      await client
        .from("shop_profiles")
        .select(
          "shop_slug,shop_name,arabic_name,profile_image_url,shop_url,city,area,category,category_name,location,verified,featured,featured_red,is_active"
        )
        .eq("is_active", true)
        .order("shop_name", { ascending:true });

    if(error){
      console.error(
        "Ma7alak Shops: could not load shop_profiles.",
        error
      );
      shops = [];
      return false;
    }

    shops =
      (data || [])
        .filter(
          function(row){
            return row && String(row.shop_slug || "").trim();
          }
        )
        .map(
          function(row){

            const slug =
              String(row.shop_slug || "").trim();

            return {
              id:slug,
              name:String(row.shop_name || slug).trim(),
              arabic:String(row.arabic_name || "").trim(),
              city:String(row.city || "").trim(),
              area:String(row.area || "").trim(),
              category:String(row.category || "").trim(),
              categoryName:String(row.category_name || "").trim(),
              location:String(row.location || "").trim(),
              image:String(row.profile_image_url || "").trim(),
              url:String(
                row.shop_url ||
                ("https://ma7alak.com/" + encodeURIComponent(slug))
              ).trim(),
              verified:row.verified === true,
              featured:row.featured === true,
              redFeatured:row.featured_red === true
            };

          }
        );

    return true;
  }



  let ma7alakDirectoryRealtimeChannel = null;
  let ma7alakDirectoryRefreshTimer = null;

  function ma7alakDirectoryDataSignature(){
    return JSON.stringify(
      shops.map(function(shop){
        return [
          shop.id,
          shop.name,
          shop.arabic,
          shop.city,
          shop.area,
          shop.category,
          shop.categoryName,
          shop.location,
          shop.image,
          shop.url,
          shop.verified,
          shop.featured,
          shop.redFeatured
        ];
      })
    ) + "|" + JSON.stringify(Array.from(ma7alakLiveCategoryNames.entries()))
      + "|" + JSON.stringify(Array.from(ma7alakLiveCityNames.entries()));
  }

  async function ma7alakRefreshDirectoryLive(){
    clearTimeout(ma7alakDirectoryRefreshTimer);
    ma7alakDirectoryRefreshTimer = setTimeout(async function(){
      const oldArea = selectedArea;
      const oldCategory = selectedCategory;
      const beforeSignature = ma7alakDirectoryDataSignature();
      const ok = await ma7alakLoadShopProfiles();
      if(!ok) return;

      /*
       * Do not rebuild Area/Category buttons and shop cards when the
       * fallback poll returns exactly the same directory data. Rebuilding
       * every 1.5 seconds was resetting selected categories and replacing
       * Story-ring DOM nodes, which made the Doze 3ale ring flicker.
       */
      if(beforeSignature === ma7alakDirectoryDataSignature()){
        return;
      }

      ma7alakRenderDynamicAreas();

      if(oldArea && Array.from(page.querySelectorAll(".ma7alak-area-button")).some(b => b.dataset.area === oldArea)){
        selectedArea = oldArea;
        const btn = Array.from(page.querySelectorAll(".ma7alak-area-button")).find(b=>b.dataset.area===oldArea);
        if(btn) btn.classList.add("active");
        await ma7alakRenderDynamicCategories(oldArea);

        if(oldCategory && Array.from(page.querySelectorAll(".ma7alak-category-button")).some(b=>b.dataset.category===oldCategory)){
          selectedCategory = oldCategory;
          const cbtn = Array.from(page.querySelectorAll(".ma7alak-category-button")).find(b=>b.dataset.category===oldCategory);
          if(cbtn) cbtn.classList.add("active");
          if(areaFilterBlock) areaFilterBlock.style.display = "block";
          categorySection.classList.add("visible");
          renderResults();
          ma7alakRefreshStoryRings();
        }else{
          selectedCategory = null;
          if(areaFilterBlock) areaFilterBlock.style.display = "block";
          categorySection.classList.add("visible");
          results.classList.remove("visible");
        }
      }else{
        selectedArea = null;
        selectedCategory = null;
        if(areaFilterBlock) areaFilterBlock.style.display = "block";
        categorySection.classList.remove("visible");
        results.classList.remove("visible");
      }
    },80);
  }

  let ma7alakDirectoryFallbackTimer = null;

  async function ma7alakStartDirectoryRealtime(){
    const client = await ma7alakLoadSupabase();
    if(!client) return;

    if(!ma7alakDirectoryRealtimeChannel){
      ma7alakDirectoryRealtimeChannel = client
        .channel("ma7alak-live-directory-v3")
        .on("postgres_changes",{event:"*",schema:"public",table:"shop_profiles"},ma7alakRefreshDirectoryLive)
        .on("postgres_changes",{event:"*",schema:"public",table:"shop_categories"},ma7alakRefreshDirectoryLive)
        .on("postgres_changes",{event:"*",schema:"public",table:"shop_cities"},ma7alakRefreshDirectoryLive)
        .on("postgres_changes",{event:"*",schema:"public",table:"shop_areas"},ma7alakRefreshDirectoryLive)
        .subscribe();
    }

    /*
       Realtime is the primary path. This lightweight fallback means an
       already-open Directory still updates even if a Supabase publication
       or mobile connection temporarily misses a Realtime event.
    */
    if(!ma7alakDirectoryFallbackTimer){
      ma7alakDirectoryFallbackTimer = setInterval(function(){
        if(!document.hidden){
          ma7alakRefreshDirectoryLive();
        }
      }, 1500);
    }

    if(!window.__MA7ALAK_DIRECTORY_VISIBILITY_REFRESH__){
      window.__MA7ALAK_DIRECTORY_VISIBILITY_REFRESH__ = true;
      window.addEventListener("focus", ma7alakRefreshDirectoryLive);
      document.addEventListener("visibilitychange", function(){
        if(!document.hidden){
          ma7alakRefreshDirectoryLive();
        }
      });
    }
  }


  function ma7alakSetStoryRing(
    shopSlug,
    active
  ){

    const rings =
      page.querySelectorAll(
        '.ma7alak-shop-image-ring[data-shop-slug="' +
        CSS.escape(shopSlug) +
        '"]'
      );

    rings.forEach(
      function(ring){

        ring.classList.toggle(
          "ma7alak-has-story",
          !!active
        );

      }
    );

  }


  function ma7alakRefreshStoryRings(){

    ma7alakActiveStoryShops.forEach(
      function(slug){

        ma7alakSetStoryRing(
          slug,
          true
        );

      }
    );

  }


  async function ma7alakLoadActiveStoryShops(){

    const client =
      ma7alakGetSupabaseClient();

    if(!client){

      return;

    }

    const now =
      new Date().toISOString();

    const result =
      await client
        .from("shop_stories")
        .select(
          "shop_slug,id,expires_at,created_at"
        )
        .gt(
          "expires_at",
          now
        );

    if(result.error){

      console.warn(
        "Ma7alak stories:",
        result.error
      );

      return;

    }

    const nextActiveStoryShops =
      new Set(
        (result.data || [])
          .filter(
            function(row){
              return row &&
                row.shop_slug &&
                !ma7alakViewedStoryIds.has(
                  String(row.id)
                );
            }
          )
          .map(
            function(row){
              return row.shop_slug;
            }
          )
          .filter(Boolean)
      );

    ma7alakActiveStoryShops.forEach(
      function(slug){
        if(!nextActiveStoryShops.has(slug)){
          ma7alakSetStoryRing(slug, false);
        }
      }
    );

    nextActiveStoryShops.forEach(
      function(slug){
        if(!ma7alakActiveStoryShops.has(slug)){
          ma7alakSetStoryRing(slug, true);
        }
      }
    );

    ma7alakActiveStoryShops =
      nextActiveStoryShops;

    ma7alakStoryLoaded =
      true;

    ma7alakRefreshStoryRings();

  }


  async function ma7alakOpenShopStories(
    shop,
    targetStoryId
  ){

    const client =
      ma7alakGetSupabaseClient();

    if(!client){

      return;

    }

    clearTimeout(
      ma7alakStoryTimer
    );

    ma7alakStoryViewerShop =
      shop;

    if(!ma7alakStoryViewer){

      ma7alakCreateStoryViewer();

    }

    ma7alakStoryViewer.classList.add(
      "visible"
    );

    document.documentElement.style.overflow =
      "hidden";

    if(document.body){

      document.body.style.overflow =
        "hidden";

    }

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-loading"
      )
      .classList.add(
        "visible"
      );

    const now =
      new Date().toISOString();

    const result =
      await client
        .from("shop_stories")
        .select(
          "id,shop_slug,media_type,storage_path,expires_at,created_at"
        )
        .eq(
          "shop_slug",
          shop.id
        )
        .gt(
          "expires_at",
          now
        )
        .order(
          "created_at",
          {
            ascending:true
          }
        );

    if(result.error){

      console.warn(
        "Ma7alak story viewer:",
        result.error
      );

      ma7alakCloseStoryViewer();

      return;

    }

    ma7alakStoryItems =
      result.data || [];

    /*
     * Opening the story means the visitor has seen it.
     * Mark the current active stories as viewed immediately
     * so the ring stops pulsing without needing a refresh.
     */
    ma7alakMarkStoriesViewed(
      ma7alakStoryItems
    );

    ma7alakActiveStoryShops.delete(
      shop.id
    );

    ma7alakSetStoryRing(
      shop.id,
      false
    );

    if(
      ma7alakStoryItems.length === 0
    ){

      ma7alakActiveStoryShops.delete(
        shop.id
      );

      ma7alakSetStoryRing(
        shop.id,
        false
      );

      ma7alakCloseStoryViewer();

      return;

    }

    ma7alakStoryIndex =
      0;

    if(
      targetStoryId !== undefined &&
      targetStoryId !== null &&
      String(targetStoryId).trim() !== ""
    ){

      const targetIndex =
        ma7alakStoryItems.findIndex(
          function(item){
            return String(item.id) === String(targetStoryId);
          }
        );

      if(targetIndex !== -1){
        ma7alakStoryIndex = targetIndex;
      }
    }

    ma7alakRenderStoryViewer();

  }


  function ma7alakStoryURL(
    storagePath
  ){

    return (
      MA7ALAK_SUPABASE_URL +
      "/storage/v1/object/public/shop-stories/" +
      storagePath
    );

  }


  function ma7alakCreateStoryViewer(){

    ma7alakStoryViewer =
      document.createElement("div");

    ma7alakStoryViewer.className =
      "ma7alak-story-viewer";

    ma7alakStoryViewer.innerHTML = `

      <div
        class="ma7alak-story-viewer-backdrop"
      ></div>

      <div
        class="ma7alak-story-viewer-shell"
      >

        <div
          class="ma7alak-story-viewer-progress"
        ></div>

        <div
          class="ma7alak-story-viewer-top"
        >

          <a
            class="ma7alak-story-viewer-shop"
            href="#"
            aria-label="Open shop"
          >

            <img
              class="ma7alak-story-viewer-shop-image"
              alt=""
            >

            <div
              class="ma7alak-story-viewer-shop-name"
            ></div>

          </a>

          <button
            type="button"
            class="ma7alak-story-viewer-close"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        <div
          class="ma7alak-story-viewer-media"
        ></div>

        <button
          type="button"
          class="ma7alak-story-viewer-tap-left"
          aria-label="Previous story"
        ></button>

        <button
          type="button"
          class="ma7alak-story-viewer-tap-right"
          aria-label="Next story"
        ></button>

        <div
          class="ma7alak-story-viewer-loading"
        ></div>

      </div>

    `;

    document.body.appendChild(
      ma7alakStoryViewer
    );

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-backdrop"
      )
      .addEventListener(
        "click",
        ma7alakCloseStoryViewer
      );

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-close"
      )
      .addEventListener(
        "click",
        ma7alakCloseStoryViewer
      );


    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-shop"
      )
      .addEventListener(
        "click",
        function(event){
          event.stopPropagation();

          const shop =
            ma7alakStoryViewerShop;

          if(!shop){
            event.preventDefault();
            return;
          }

          const shopUrl =
            String(
              shop.url ||
              (shop.id
                ? "https://ma7alak.com/" + encodeURIComponent(shop.id)
                : "")
            ).trim();

          if(!shopUrl){
            event.preventDefault();
            return;
          }

          this.href = shopUrl;
        }
      );

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-tap-left"
      )
      .addEventListener(
        "click",
        function(){
          ma7alakPreviousStory();
        }
      );

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-tap-right"
      )
      .addEventListener(
        "click",
        function(){
          ma7alakNextStory();
        }
      );

  }


  function ma7alakRenderStoryViewer(){

    if(
      !ma7alakStoryViewer ||
      !ma7alakStoryItems.length
    ){

      return;

    }

    clearTimeout(
      ma7alakStoryTimer
    );

    const story =
      ma7alakStoryItems[
        ma7alakStoryIndex
      ];

    const progress =
      ma7alakStoryViewer.querySelector(
        ".ma7alak-story-viewer-progress"
      );

    progress.innerHTML =
      ma7alakStoryItems
        .map(
          function(item,index){

            return `
              <div
                class="
                  ma7alak-story-progress-item
                  ${index < ma7alakStoryIndex ? "done" : ""}
                  ${index === ma7alakStoryIndex ? "current" : ""}
                "
              ></div>
            `;

          }
        )
        .join("");

    const shopImage =
      ma7alakStoryViewer.querySelector(
        ".ma7alak-story-viewer-shop-image"
      );

    shopImage.src =
      ma7alakStoryViewerShop.image;

    shopImage.alt =
      ma7alakStoryViewerShop.name;

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-shop-name"
      )
      .textContent =
      ma7alakStoryViewerShop.name;

    const storyShopLink =
      ma7alakStoryViewer.querySelector(
        ".ma7alak-story-viewer-shop"
      );

    if(storyShopLink){
      storyShopLink.href =
        String(
          ma7alakStoryViewerShop.url ||
          (ma7alakStoryViewerShop.id
            ? "https://ma7alak.com/" +
              encodeURIComponent(
                ma7alakStoryViewerShop.id
              )
            : "#")
        );
    }

    const media =
      ma7alakStoryViewer.querySelector(
        ".ma7alak-story-viewer-media"
      );

    media.innerHTML =
      "";

    ma7alakStoryViewer
      .querySelector(
        ".ma7alak-story-viewer-loading"
      )
      .classList.remove(
        "visible"
      );

    const url =
      ma7alakStoryURL(
        story.storage_path
      );

    if(
      story.media_type === "video"
    ){

      const video =
        document.createElement("video");

      video.src =
        url;

      video.autoplay =
        true;

      video.playsInline =
        true;

      video.controls =
        false;

      video.muted =
        false;

      video.preload =
        "auto";

      video.setAttribute(
        "playsinline",
        ""
      );

      video.setAttribute(
        "webkit-playsinline",
        ""
      );

      video.addEventListener(
        "ended",
        function(){

          ma7alakNextStory();

        }
      );

      video.addEventListener(
        "waiting",
        function(){

          ma7alakStoryViewer
            .querySelector(
              ".ma7alak-story-viewer-loading"
            )
            .classList.add(
              "visible"
            );

        }
      );

      video.addEventListener(
        "playing",
        function(){

          ma7alakStoryViewer
            .querySelector(
              ".ma7alak-story-viewer-loading"
            )
            .classList.remove(
              "visible"
            );

        }
      );

      media.appendChild(
        video
      );

      video.play()
        .catch(
          function(){

            /*
             * Some mobile browsers block
             * unmuted autoplay. In that case
             * the user can tap the story and
             * playback will start normally.
             */

          }
        );

    }else{

      const image =
        document.createElement("img");

      image.src =
        url;

      image.alt =
        ma7alakStoryViewerShop.name;

      image.addEventListener(
        "load",
        function(){

          ma7alakStoryTimer =
            setTimeout(
              ma7alakNextStory,
              5000
            );

        }
      );

      media.appendChild(
        image
      );

    }

    const currentProgress =
      progress.querySelector(
        ".current"
      );

    if(currentProgress){

      if(
        story.media_type === "image"
      ){

        currentProgress
          .style
          .setProperty(
            "transition",
            "transform 5s linear"
          );

        currentProgress
          .style
          .setProperty(
            "transform-origin",
            "left center"
          );

        currentProgress
          .style
          .setProperty(
            "transform",
            "scaleX(1)"
          );

      }else{

        const video =
          media.querySelector(
            "video"
          );

        if(video){

          const updateProgress =
            function(){

              if(
                video.duration &&
                isFinite(video.duration)
              ){

                currentProgress.style
                  .width =
                  (
                    video.currentTime /
                    video.duration *
                    100
                  ) +
                  "%";

              }

            };

          video.addEventListener(
            "timeupdate",
            updateProgress
          );

        }

      }

    }

  }


  function ma7alakNextStory(){

    clearTimeout(
      ma7alakStoryTimer
    );

    if(
      ma7alakStoryIndex <
      ma7alakStoryItems.length - 1
    ){

      ma7alakStoryIndex++;

      ma7alakRenderStoryViewer();

      return;

    }

    /*
     * We reached the end.
     * The shop's active story ring stops.
     */
    ma7alakActiveStoryShops.delete(
      ma7alakStoryViewerShop.id
    );

    ma7alakSetStoryRing(
      ma7alakStoryViewerShop.id,
      false
    );

    ma7alakCloseStoryViewer();

  }


  function ma7alakPreviousStory(){

    clearTimeout(
      ma7alakStoryTimer
    );

    if(
      ma7alakStoryIndex > 0
    ){

      ma7alakStoryIndex--;

      ma7alakRenderStoryViewer();

    }

  }


  function ma7alakCloseStoryViewer(){

    clearTimeout(
      ma7alakStoryTimer
    );

    if(
      ma7alakStoryViewer
    ){

      const video =
        ma7alakStoryViewer.querySelector(
          "video"
        );

      if(video){

        video.pause();

      }

      ma7alakStoryViewer.classList.remove(
        "visible"
      );

    }

    document.documentElement.style.overflow =
      "";

    if(document.body){

      document.body.style.overflow =
        "";

    }

  }


  function ma7alakBindStoryCardClicks(){

    if(!shopGrid){

      return;

    }

    if(
      shopGrid.dataset.storyClickBound === "1"
    ){

      return;

    }

    shopGrid.dataset.storyClickBound =
      "1";

    /* Capture the click before any link/navigation handler can follow the shop URL. */
    shopGrid.addEventListener(
      "click",
      function(event){

        const link =
          event.target.closest(
            ".ma7alak-shop-image-link"
          );

        if(!link){

          return;

        }

        const ring =
          link.querySelector(
            ".ma7alak-shop-image-ring"
          );

        if(
          !ring ||
          !ring.classList.contains(
            "ma7alak-has-story"
          )
        ){

          return;

        }

        const slug =
          ring.dataset.shopSlug;

        const shop =
          shops.find(
            function(item){
              return item.id === slug;
            }
          );

        if(!shop){

          return;

        }

        event.preventDefault();
        event.stopPropagation();

        ma7alakOpenShopStories(
          shop
        );

      }
    );

  }

  /* =========================================================
     STORY RING CLICK — HARD NAVIGATION OVERRIDE
     If a shop has a live story, tapping its ring opens
     the story viewer instead of navigating to the shop page.
  ========================================================= */
  document.addEventListener(
    "click",
    function(event){

      const link =
        event.target.closest &&
        event.target.closest(
          ".ma7alak-shop-image-link"
        );

      if(!link){
        return;
      }

      const ring =
        link.querySelector(
          ".ma7alak-shop-image-ring"
        );

      if(!ring || !ring.classList.contains("ma7alak-has-story")){
        return;
      }

      const slug =
        ring.dataset.shopSlug;

      const shop =
        shops.find(function(item){
          return String(item.id) === String(slug);
        });

      if(!shop){
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      /*
       * Do not let the shop anchor navigate when a live Story exists.
       * The image link has no inline navigation handler anymore, so mobile
       * ghost/touch clicks cannot open the Story and then jump to the shop.
       */
      ma7alakOpenShopStories(shop);

    },
    true
  );


  function ma7alakOpenStoryFromURL(){

    const params = new URLSearchParams(window.location.search);
    const storyId = params.get("story");
    const shopSlug = params.get("shop");

    if(!storyId || !shopSlug){
      return;
    }

    const shop = shops.find(function(item){
      return String(item.id) === String(shopSlug);
    });

    if(!shop){
      return;
    }

    ma7alakOpenShopStories(shop, storyId);

  }


  async function ma7alakStartStorySystem(){

    const client =
      await ma7alakLoadSupabase();

    if(!client){

      return;

    }

    await ma7alakLoadActiveStoryShops();

    ma7alakBindStoryCardClicks();

    /* Push notification: open exact Story from URL. */
    ma7alakOpenStoryFromURL();

    if(
      ma7alakStoryChannel
    ){

      try{
        await client.removeChannel(
          ma7alakStoryChannel
        );
      }catch(e){}

    }

    ma7alakStoryChannel =
      client
        .channel(
          "ma7alak-shops-live-stories"
        )
        .on(
          "postgres_changes",
          {
            event:"INSERT",
            schema:"public",
            table:"shop_stories"
          },
          function(payload){

            const row =
              payload.new;

            if(
              !row ||
              !row.shop_slug
            ){

              return;

            }

            const expires =
              new Date(
                row.expires_at
              ).getTime();

            if(
              expires <= Date.now()
            ){

              return;

            }

            /*
             * A newly inserted story has a new ID, so it is
             * automatically treated as unseen even if this shop
             * was viewed before.
             */
            ma7alakViewedStoryIds.delete(
              String(row.id)
            );
            ma7alakSaveViewedStories();

            ma7alakActiveStoryShops.add(
              row.shop_slug
            );

            ma7alakSetStoryRing(
              row.shop_slug,
              true
            );

          }
        )
        .on(
          "postgres_changes",
          {
            event:"DELETE",
            schema:"public",
            table:"shop_stories"
          },
          function(payload){

            const slug =
              payload.old &&
              payload.old.shop_slug;

            if(!slug){

              return;

            }

            /*
             * Re-query because there may be
             * another active story for this shop.
             */
            ma7alakLoadActiveStoryShops();

          }
        )
        .subscribe();

    /*
     * Stories expire after 24 hours. Re-check
     * periodically so the ring disappears even
     * when no database DELETE event occurs.
     */
    /*
     * Fast fallback polling. Realtime normally updates the ring
     * instantly; this catches cases where Supabase Realtime is
     * delayed/not enabled for the table. Maximum delay is ~2 sec.
     */
    if(!window.ma7alakStoryFallbackTimer){
      window.ma7alakStoryFallbackTimer =
        setInterval(
          ma7alakLoadActiveStoryShops,
          2000
        );
    }

  }


  /* =========================================================
     CREATE SHOP CARD
  ========================================================= */

  function createShopCard(shop){

    const card =
      document.createElement("article");


    card.className =
      "ma7alak-shop-card";


    const verifiedHTML =
      shop.verified

        ? `

          <div
            class="ma7alak-verified-badge"
            title="Verified"
          >
            ✓
          </div>

        `

        : "";


    let featuredHTML =
      "";


    if(shop.featured){

      featuredHTML = `

        <div
          class="
            ma7alak-featured
            ${shop.redFeatured ? "red" : ""}
          "
        >

          ★ FEATURED

        </div>

      `;

    }


    card.innerHTML = `


      <!-- SHOP IMAGE -->

      <a
        class="ma7alak-shop-image-link"
        href="${shop.url}"
      >

        <div
          class="ma7alak-shop-image-ring"
          data-shop-slug="${escapeHTML(shop.id)}"
        >

          <div class="ma7alak-shop-image-inner">

            <img
              src="${shop.image}"
              alt="${escapeHTML(shop.name)}"
              loading="lazy"
            >

          </div>


          ${verifiedHTML}

        </div>

      </a>


      <!-- SHOP INFORMATION -->

      <div class="ma7alak-shop-content">


        <div class="ma7alak-shop-title-row">

          <h3 class="ma7alak-shop-name">

            ${escapeHTML(shop.name)}

          </h3>

        </div>


        <div class="ma7alak-shop-arabic">

          ${escapeHTML(shop.arabic)}

        </div>


        <div class="ma7alak-shop-category-pill">

          ${escapeHTML(
            shop.categoryName ||
            ma7alakLiveCategoryNames.get(shop.category) ||
            ma7alakLiveCategoryNames.get(String(shop.category || "").toLocaleLowerCase()) ||
            shop.category
          )}

        </div>


        <div class="ma7alak-shop-location">

          <span class="ma7alak-location-icon ma7alak-google-maps-icon" aria-hidden="true">
            <img src="https://www.gstatic.com/images/branding/product/2x/maps_96in128dp.png" alt="">
          </span>

          <span>
            ${escapeHTML(shop.location)}
          </span>

        </div>


        ${featuredHTML}


        <a
          class="ma7alak-profile-button"
          href="${shop.url}"
          onclick="
            window.top.location.href='${shop.url}';
            return false;
          "
        >

          View Profile

          <span class="ma7alak-profile-arrow">
            →
          </span>

        </a>


      </div>

    `;


    return card;

  }


  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHTML(value){

    return String(value)

      .replace(
        /&/g,
        "&amp;"
      )

      .replace(
        /</g,
        "&lt;"
      )

      .replace(
        />/g,
        "&gt;"
      )

      .replace(
        /"/g,
        "&quot;"
      )

      .replace(
        /'/g,
        "&#039;"
      );

  }


  /* =========================================================
     INSERT WITH RETRIES
  ========================================================= */

  let attempts =
    0;


  function start(){

    attempts++;


    if(
      insertPage()
    ){

      initialize();

      return;

    }


    if(
      attempts < 35
    ){

      setTimeout(
        start,
        350
      );

    }

  }


  /* =========================================================
     START AFTER DOM
  ========================================================= */

  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  }else{

    start();

  }


  /* =========================================================
     HOSTINGER HEADER WATCH
  ========================================================= */

  const observer =
    new MutationObserver(
      function(){

        if(
          !document.getElementById(
            "ma7alak-shops-page"
          )
        ){

          start();

        }

      }
    );


  observer.observe(
    document.documentElement,
    {
      childList:true,
      subtree:true
    }
  );


})();

/* =========================================================
   WHAT CHANGED — DYNAMIC AREAS + CATEGORIES
   - Based directly on the last confirmed working Supabase-live Show Shops code.
   - Removed hardcoded Area buttons from the page markup.
   - Removed hardcoded Category buttons from the page markup.
   - Area buttons now build automatically from active shop_profiles rows.
   - Category buttons now stay available across Areas instead of disappearing based on the selected Area.
   - category_name controls the visible category label; category remains the filter key.
   - Added automatic category icons with a safe shop fallback icon for new categories.
   - If a new active shop uses a new Area, that Area appears automatically after refresh.
   - If a shop uses a new Category, that Category appears automatically inside its Area after refresh.
   - No GitHub edit is needed just to add future Cities / Regions or Categories.
   - Existing search, shop cards, Story linking/viewer and mobile two-card layout were preserved.
========================================================= */
