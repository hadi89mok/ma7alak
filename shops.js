(function(){
  "use strict";

  function getPath(){
    return window.location.pathname
      .replace(/\/+/g,"/")
      .replace(/\/$/,"")
      .toLowerCase();
  }

  if(getPath() !== "/shwf-almhlat-"){
    return;
  }

  const style = document.createElement("style");

  style.textContent = `
/* =========================================================
   MA7ALAK SHOPS — GLOBAL FOUNDATION
========================================================= */

html.ma7alak-shops-page-active,
html.ma7alak-shops-page-active body{

  background:#080706 !important;

  color:#fff !important;

}


body.ma7alak-shops-body{

  background:#080706 !important;

  color:#fff !important;

}


/* =========================================================
   MAIN PAGE
========================================================= */

#ma7alak-shops-page{

  --gold:#f5b83f;
  --gold-light:#ffd982;
  --gold-soft:#d69a42;

  --cream:#f7efe4;

  --white:#ffffff;

  --muted:#b9b0a6;
  --muted2:#8f877e;

  --glass:rgba(46,35,27,.60);
  --glass-light:rgba(255,255,255,.075);

  --border:rgba(255,255,255,.20);
  --gold-border:rgba(245,184,63,.55);

  position:relative;

  width:100%;

  max-width:1500px;

  margin:0 auto;

  padding:
    40px 42px 80px;

  box-sizing:border-box;

  overflow:hidden;

  color:#fff;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;

}


/* =========================================================
   CINEMATIC BACKGROUND
========================================================= */

#ma7alak-shops-page .ma7alak-background{

  position:absolute;

  inset:0;

  z-index:-10;

  overflow:hidden;

  background:

    linear-gradient(
      180deg,
      rgba(4,3,2,.25),
      rgba(5,4,3,.82) 58%,
      #080706 100%
    );

}


#ma7alak-shops-page .ma7alak-background-image{

  position:absolute;

  inset:0;

  width:100%;

  height:100%;

  object-fit:cover;

  object-position:center top;

  opacity:.38;

  filter:
    saturate(.75)
    contrast(1.08)
    brightness(.72);

  transform:scale(1.03);

}


#ma7alak-shops-page .ma7alak-background-overlay{

  position:absolute;

  inset:0;

  background:

    radial-gradient(
      circle at 50% 12%,
      rgba(188,116,39,.28),
      transparent 34%
    ),

    radial-gradient(
      circle at 15% 58%,
      rgba(172,103,35,.15),
      transparent 30%
    ),

    radial-gradient(
      circle at 88% 65%,
      rgba(230,160,67,.13),
      transparent 32%
    ),

    linear-gradient(
      180deg,
      rgba(8,7,5,.05),
      rgba(8,7,5,.62) 50%,
      #080706 92%
    );

}


#ma7alak-shops-page .ma7alak-background-vignette{

  position:absolute;

  inset:0;

  box-shadow:
    inset 0 0 180px rgba(0,0,0,.72);

}


/* =========================================================
   TOP BRAND
========================================================= */

.ma7alak-top-brand{

  position:relative;

  text-align:center;

  padding-top:4px;

  margin-bottom:25px;

}


.ma7alak-brand-name{

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size:52px;

  line-height:1;

  font-weight:700;

  letter-spacing:-2px;

  color:#fff;

  text-shadow:
    0 5px 30px rgba(0,0,0,.7);

}


.ma7alak-brand-subtitle{

  margin-top:9px;

  font-size:9px;

  line-height:1;

  letter-spacing:5px;

  color:#c7bdb1;

  text-transform:uppercase;

}


.ma7alak-brand-rule{

  width:75px;

  height:1px;

  margin:17px auto 0;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold),
      transparent
    );

  opacity:.8;

}


/* =========================================================
   DECORATIVE SIDE TEXT
========================================================= */

.ma7alak-side-left{

  position:absolute;

  left:4px;

  top:28px;

  width:120px;

  color:#d8c8b5;

  font-size:8px;

  letter-spacing:5px;

  line-height:2;

  text-transform:uppercase;

  opacity:.72;

}


.ma7alak-side-right{

  position:absolute;

  right:4px;

  top:25px;

  color:#f0d4a8;

  font-family:
    "Brush Script MT",
    cursive;

  font-size:19px;

  line-height:1.05;

  transform:rotate(-7deg);

  opacity:.82;

}


/* =========================================================
   HERO
========================================================= */

.ma7alak-hero{

  text-align:center;

  margin:
    24px auto 32px;

}


.ma7alak-hero-icon{

  display:flex;

  align-items:center;

  justify-content:center;

  width:48px;

  height:48px;

  margin:0 auto 8px;

  color:var(--gold);

  font-size:32px;

  filter:
    drop-shadow(
      0 0 16px rgba(245,184,63,.24)
    );

}


.ma7alak-hero h1{

  margin:0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size:
    clamp(48px,6vw,74px);

  line-height:1;

  letter-spacing:-2px;

  color:#fff;

  text-shadow:
    0 5px 35px rgba(0,0,0,.7);

}


.ma7alak-hero h1 span{

  color:var(--gold);

  text-shadow:
    0 0 35px rgba(245,184,63,.16);

}


.ma7alak-hero p{

  margin:
    11px auto 0;

  max-width:650px;

  color:#c1b8af;

  font-size:15px;

  line-height:1.6;

}


/* =========================================================
   SEARCH
========================================================= */

.ma7alak-search-wrapper{

  width:100%;

  max-width:860px;

  margin:
    0 auto 25px;

  position:relative;

}


.ma7alak-search{

  width:100%;

  height:60px;

  padding:
    0 60px 0 22px;

  box-sizing:border-box;

  border-radius:18px;

  border:
    1px solid rgba(255,255,255,.25);

  background:
    linear-gradient(
      135deg,
      rgba(45,36,29,.72),
      rgba(24,20,17,.65)
    );

  backdrop-filter:blur(22px);

  -webkit-backdrop-filter:blur(22px);

  color:#fff;

  outline:none;

  font-size:14px;

  box-shadow:
    0 18px 55px rgba(0,0,0,.34),
    inset 0 1px rgba(255,255,255,.09);

  transition:
    border-color .25s ease,
    box-shadow .25s ease;

}


.ma7alak-search::placeholder{

  color:#9f968d;

}


.ma7alak-search:focus{

  border-color:
    rgba(245,184,63,.70);

  box-shadow:
    0 0 0 4px rgba(245,184,63,.07),
    0 20px 60px rgba(0,0,0,.38);

}


.ma7alak-search-icon{

  position:absolute;

  right:21px;

  top:50%;

  transform:translateY(-50%);

  width:25px;

  height:25px;

  display:flex;

  align-items:center;

  justify-content:center;

  color:#e3d7c9;

  font-size:25px;

  pointer-events:none;

}


/* =========================================================
   FILTER AREA
========================================================= */

.ma7alak-filter-block{

  margin-bottom:20px;

}


.ma7alak-filter-label{

  margin:
    0 0 10px 2px;

  color:#d1c6bb;

  font-size:12px;

  font-weight:600;

}


.ma7alak-area-grid{

  display:grid;

  grid-template-columns:
    repeat(4,minmax(0,1fr));

  gap:9px;

}


.ma7alak-area-button{

  min-height:51px;

  border-radius:14px;

  border:
    1px solid rgba(255,255,255,.20);

  background:
    rgba(22,19,17,.68);

  backdrop-filter:blur(14px);

  -webkit-backdrop-filter:blur(14px);

  color:#e9e2da;

  font-size:13px;

  font-weight:600;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:8px;

  cursor:pointer;

  transition:
    transform .22s ease,
    border-color .22s ease,
    background .22s ease,
    box-shadow .22s ease;

}


.ma7alak-area-button:hover{

  transform:translateY(-2px);

  border-color:
    rgba(245,184,63,.55);

  background:
    rgba(75,51,28,.55);

}


.ma7alak-area-button.active{

  border-color:
    var(--gold);

  background:
    linear-gradient(
      135deg,
      rgba(170,105,29,.42),
      rgba(77,49,25,.45)
    );

  color:#ffe1a1;

  box-shadow:
    0 0 25px rgba(245,184,63,.09),
    inset 0 1px rgba(255,255,255,.08);

}


.ma7alak-area-button .icon{

  font-size:16px;

}


/* =========================================================
   CATEGORY
========================================================= */

.ma7alak-category-section{

  display:none;

  padding-top:2px;

  animation:
    ma7alakSectionIn .42s ease both;

}


.ma7alak-category-section.visible{

  display:block;

}


.ma7alak-category-grid{

  display:grid;

  grid-template-columns:
    repeat(4,minmax(0,1fr));

  gap:9px;

}


.ma7alak-category-button{

  min-height:58px;

  padding:
    9px 12px;

  border-radius:15px;

  border:
    1px solid rgba(255,255,255,.19);

  background:
    linear-gradient(
      135deg,
      rgba(41,34,29,.68),
      rgba(21,19,17,.62)
    );

  color:#e9e2da;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:9px;

  font-size:13px;

  font-weight:600;

  cursor:pointer;

  transition:.22s ease;

}


.ma7alak-category-button:hover{

  transform:translateY(-2px);

  border-color:
    rgba(245,184,63,.52);

}


.ma7alak-category-button.active{

  border-color:
    var(--gold);

  background:
    linear-gradient(
      135deg,
      rgba(174,109,29,.42),
      rgba(75,48,26,.40)
    );

  color:#ffe7b2;

  box-shadow:
    0 0 25px rgba(245,184,63,.08);

}


.ma7alak-category-icon{

  font-size:20px;

}


/* =========================================================
   RESULTS
========================================================= */

.ma7alak-results{

  display:none;

  margin-top:30px;

  animation:
    ma7alakSectionIn .45s ease both;

}


.ma7alak-results.visible{

  display:block;

}


.ma7alak-results-top{

  display:flex;

  align-items:flex-end;

  justify-content:space-between;

  gap:20px;

  padding-bottom:15px;

  border-bottom:
    1px solid rgba(255,255,255,.13);

}


.ma7alak-results-kicker{

  margin-bottom:6px;

  color:#c2975b;

  font-size:9px;

  font-weight:700;

  letter-spacing:3px;

  text-transform:uppercase;

}


.ma7alak-results-title{

  margin:0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size:31px;

  line-height:1.05;

  color:#fff;

  letter-spacing:-.7px;

}


.ma7alak-results-subtitle{

  margin:
    7px 0 0;

  color:#aaa198;

  font-size:12px;

}


.ma7alak-results-count{

  padding:
    8px 13px;

  border-radius:999px;

  white-space:nowrap;

  border:
    1px solid rgba(245,184,63,.30);

  background:
    rgba(245,184,63,.065);

  color:#d6b47b;

  font-size:10px;

  font-weight:700;

}


/* =========================================================
   SHOP GRID
========================================================= */

.ma7alak-shop-grid{

  display:grid;

  grid-template-columns:
    repeat(4,minmax(0,1fr));

  gap:12px;

  padding-top:14px;

}


/* =========================================================
   SHOP CARD
========================================================= */

.ma7alak-shop-card{

  position:relative;

  min-width:0;

  padding:
    20px 13px 13px;

  border-radius:20px;

  border:
    1px solid rgba(255,255,255,.22);

  background:

    radial-gradient(
      circle at 50% 10%,
      rgba(198,126,48,.17),
      transparent 42%
    ),

    linear-gradient(
      145deg,
      rgba(75,58,45,.72),
      rgba(28,24,21,.72)
    );

  backdrop-filter:blur(19px);

  -webkit-backdrop-filter:blur(19px);

  box-shadow:
    0 18px 48px rgba(0,0,0,.38),
    inset 0 1px rgba(255,255,255,.10);

  text-align:center;

  overflow:hidden;

  transition:
    transform .28s ease,
    border-color .28s ease,
    box-shadow .28s ease;

}


.ma7alak-shop-card::before{

  content:"";

  position:absolute;

  width:190px;

  height:190px;

  left:50%;

  top:-110px;

  transform:translateX(-50%);

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(229,159,69,.19),
      transparent 68%
    );

  pointer-events:none;

}


.ma7alak-shop-card::after{

  content:"";

  position:absolute;

  left:-80%;

  top:0;

  width:55%;

  height:100%;

  transform:skewX(-18deg);

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.035),
      transparent
    );

  transition:
    left .7s ease;

  pointer-events:none;

}


.ma7alak-shop-card:hover::after{

  left:130%;

}


/* =========================================================
   CIRCULAR SHOP IMAGE
========================================================= */

.ma7alak-shop-image-link{

  width:100%;

  display:flex;

  justify-content:center;

  align-items:center;

  text-decoration:none;

  position:relative;

  z-index:2;

}


.ma7alak-shop-image-ring{

  position:relative;

  width:146px;

  height:146px;

  padding:4px;

  border-radius:50%;

  box-sizing:border-box;

  background:
    linear-gradient(
      145deg,
      #fff0c6,
      #d99a47 36%,
      #76502d 70%,
      #2c2118
    );

  box-shadow:
    0 0 0 1px rgba(255,255,255,.16),
    0 13px 35px rgba(0,0,0,.48),
    0 0 27px rgba(230,158,68,.11);

  transition:
    transform .3s ease,
    box-shadow .3s ease;

}


.ma7alak-shop-card:hover
.ma7alak-shop-image-ring{

  transform:scale(1.035);

  box-shadow:
    0 0 0 1px rgba(255,255,255,.22),
    0 16px 42px rgba(0,0,0,.55),
    0 0 38px rgba(245,184,63,.17);

}


.ma7alak-shop-image-inner{

  width:100%;

  height:100%;

  border-radius:50%;

  overflow:hidden;

  background:#15110d;

  border:
    3px solid rgba(15,12,9,.84);

  box-sizing:border-box;

}


.ma7alak-shop-image-inner img{

  display:block;

  width:100%;

  height:100%;

  object-fit:cover;

  object-position:center;

}


/* =========================================================
   VERIFIED BADGE
========================================================= */

.ma7alak-verified-badge{

  position:absolute;

  right:calc(50% - 74px);

  bottom:0;

  width:27px;

  height:27px;

  border-radius:50%;

  background:#1688ef;

  border:
    2px solid #fff;

  color:#fff;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:14px;

  font-weight:900;

  box-shadow:
    0 5px 16px rgba(0,0,0,.40);

}


/* =========================================================
   SHOP CONTENT
========================================================= */

.ma7alak-shop-content{

  position:relative;

  z-index:3;

  margin-top:15px;

}


.ma7alak-shop-title-row{

  display:flex;

  align-items:center;

  justify-content:center;

  flex-wrap:wrap;

  gap:5px;

}


.ma7alak-shop-name{

  margin:0;

  color:#fff;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size:20px;

  line-height:1.15;

  font-weight:700;

  letter-spacing:-.2px;

}


.ma7alak-shop-arabic{

  min-height:21px;

  margin-top:4px;

  direction:rtl;

  color:#e5ddd4;

  font-size:13px;

  font-weight:600;

  line-height:1.5;

}


/* =========================================================
   CATEGORY PILL
========================================================= */

.ma7alak-shop-category-pill{

  display:inline-flex;

  align-items:center;

  justify-content:center;

  margin-top:8px;

  padding:
    5px 12px;

  border-radius:999px;

  border:
    1px solid rgba(225,164,91,.45);

  background:
    rgba(181,110,40,.16);

  color:#d9b98a;

  font-size:8px;

  font-weight:800;

  letter-spacing:1px;

  text-transform:uppercase;

}


/* =========================================================
   LOCATION
========================================================= */

.ma7alak-shop-location{

  display:flex;

  justify-content:center;

  align-items:center;

  gap:5px;

  margin-top:9px;

  color:#bdb5ad;

  font-size:10px;

  line-height:1.3;

}


.ma7alak-location-icon{

  font-size:13px;

}


/* =========================================================
   FEATURED
========================================================= */

.ma7alak-featured{

  display:inline-flex;

  align-items:center;

  justify-content:center;

  gap:5px;

  margin-top:9px;

  padding:
    5px 10px;

  border-radius:999px;

  border:
    1px solid rgba(245,184,63,.78);

  background:
    rgba(171,106,26,.13);

  color:#ffd15e;

  font-size:8px;

  font-weight:800;

  letter-spacing:.8px;

  text-transform:uppercase;

  box-shadow:
    0 0 17px rgba(245,184,63,.08);

  animation:
    ma7alakFeaturedGlow 2.6s ease-in-out infinite;

}


.ma7alak-featured.red{

  border-color:
    rgba(255,91,91,.75);

  color:#ff8585;

  background:
    rgba(170,40,40,.11);

  animation:
    ma7alakRedGlow 2.6s ease-in-out infinite;

}


/* =========================================================
   VIEW PROFILE
========================================================= */

.ma7alak-profile-button{

  width:100%;

  min-height:43px;

  margin-top:12px;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:9px;

  box-sizing:border-box;

  border-radius:13px;

  border:
    1px solid rgba(232,174,101,.58);

  background:
    linear-gradient(
      135deg,
      rgba(179,115,52,.48),
      rgba(112,69,34,.34)
    );

  color:#fff;

  text-decoration:none;

  font-size:11px;

  font-weight:700;

  transition:.22s ease;

}


.ma7alak-profile-button:hover{

  transform:translateY(-2px);

  border-color:
    rgba(255,207,111,.9);

  background:
    linear-gradient(
      135deg,
      rgba(205,137,58,.57),
      rgba(120,73,35,.42)
    );

  box-shadow:
    0 9px 25px rgba(0,0,0,.30);

}


.ma7alak-profile-arrow{

  font-size:17px;

  transition:
    transform .2s ease;

}


.ma7alak-profile-button:hover
.ma7alak-profile-arrow{

  transform:translateX(4px);

}


/* =========================================================
   EMPTY
========================================================= */

.ma7alak-empty{

  display:none;

  padding:
    50px 20px;

  text-align:center;

  border-radius:22px;

  border:
    1px solid rgba(255,255,255,.14);

  background:
    rgba(255,255,255,.045);

  margin-top:15px;

}


.ma7alak-empty-icon{

  font-size:40px;

  margin-bottom:10px;

}


.ma7alak-empty h3{

  margin:0 0 6px;

  font-family:
    Georgia,
    serif;

  font-size:24px;

}


.ma7alak-empty p{

  margin:0;

  color:#999189;

  font-size:12px;

}


/* =========================================================
   CHANGE AREA
========================================================= */

.ma7alak-change-area{

  display:none;

  margin:
    20px auto 0;

  padding:
    8px 14px;

  border-radius:999px;

  border:
    1px solid rgba(255,255,255,.15);

  background:
    rgba(255,255,255,.04);

  color:#aaa29a;

  font-size:11px;

  cursor:pointer;

}


.ma7alak-change-area.visible{

  display:block;

}


/* =========================================================
   BUSINESS CTA
========================================================= */

.ma7alak-business-cta{

  margin-top:45px;

  min-height:125px;

  padding:
    25px 28px;

  box-sizing:border-box;

  border-radius:22px;

  border:
    1px solid rgba(245,184,63,.38);

  background:

    radial-gradient(
      circle at 75% 50%,
      rgba(226,155,59,.22),
      transparent 38%
    ),

    linear-gradient(
      135deg,
      rgba(42,33,26,.82),
      rgba(19,16,14,.78)
    );

  backdrop-filter:blur(18px);

  -webkit-backdrop-filter:blur(18px);

  box-shadow:
    0 20px 60px rgba(0,0,0,.38),
    inset 0 1px rgba(255,255,255,.08);

  display:flex;

  align-items:center;

  justify-content:space-between;

  gap:25px;

}


.ma7alak-business-small{

  margin-bottom:6px;

  color:#b48a54;

  font-size:8px;

  letter-spacing:3px;

  font-weight:800;

  text-transform:uppercase;

}


.ma7alak-business-cta h2{

  margin:0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  color:#fff;

  font-size:27px;

  line-height:1.15;

}


.ma7alak-business-cta h2 span{

  color:#efc477;

}


.ma7alak-business-cta p{

  margin:
    6px 0 0;

  color:#a9a097;

  font-size:11px;

}


.ma7alak-add-button{

  min-width:180px;

  height:52px;

  padding:
    0 22px;

  border-radius:14px;

  background:
    linear-gradient(
      135deg,
      #ffc958,
      #d88b29
    );

  color:#241608;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:8px;

  text-decoration:none;

  font-size:12px;

  font-weight:800;

  box-shadow:
    0 12px 32px rgba(214,137,36,.24);

  transition:.23s ease;

}


.ma7alak-add-button:hover{

  transform:translateY(-3px);

  box-shadow:
    0 17px 40px rgba(214,137,36,.35);

}


/* =========================================================
   FOOTER
========================================================= */

.ma7alak-footer{

  margin-top:35px;

  padding-top:25px;

  border-top:
    1px solid rgba(255,255,255,.10);

  text-align:center;

}


.ma7alak-footer-features{

  display:flex;

  align-items:center;

  justify-content:center;

  gap:0;

}


.ma7alak-footer-feature{

  min-width:190px;

  padding:
    0 25px;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:9px;

  color:#d4cbc1;

  font-size:10px;

}


.ma7alak-footer-feature
+ .ma7alak-footer-feature{

  border-left:
    1px solid rgba(255,255,255,.16);

}


.ma7alak-footer-feature-icon{

  color:#efc27a;

  font-size:22px;

}


.ma7alak-footer-feature-text{

  text-align:left;

}


.ma7alak-footer-feature-text strong{

  display:block;

  color:#eee6dc;

  font-size:10px;

}


.ma7alak-footer-feature-text span{

  display:block;

  margin-top:2px;

  color:#777069;

  font-size:8px;

}


.ma7alak-footer-logo{

  margin-top:23px;

  font-family:
    Georgia,
    serif;

  color:#ded5cb;

  font-size:24px;

}


.ma7alak-footer-tagline{

  margin-top:5px;

  color:#766e67;

  font-size:7px;

  letter-spacing:3px;

  text-transform:uppercase;

}


/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes ma7alakSectionIn{

  from{

    opacity:0;

    transform:translateY(13px);

  }

  to{

    opacity:1;

    transform:translateY(0);

  }

}


@keyframes ma7alakFeaturedGlow{

  0%,
  100%{

    box-shadow:
      0 0 0 rgba(245,184,63,0);

  }

  50%{

    box-shadow:
      0 0 19px rgba(245,184,63,.16);

  }

}


@keyframes ma7alakRedGlow{

  0%,
  100%{

    box-shadow:
      0 0 0 rgba(255,80,80,0);

  }

  50%{

    box-shadow:
      0 0 20px rgba(255,80,80,.15);

  }

}


/* =========================================================
   TABLET
========================================================= */

@media(max-width:1050px){

  #ma7alak-shops-page{

    padding-left:20px;

    padding-right:20px;

  }

  .ma7alak-shop-grid{

    grid-template-columns:
      repeat(3,minmax(0,1fr));

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media(max-width:700px){

  #ma7alak-shops-page{

    padding:
      27px 9px 55px;

  }


  .ma7alak-side-left{

    display:none;

  }


  .ma7alak-side-right{

    right:3px;

    top:10px;

    font-size:14px;

  }


  .ma7alak-brand-name{

    font-size:39px;

  }


  .ma7alak-brand-subtitle{

    font-size:7px;

    letter-spacing:3px;

  }


  .ma7alak-hero{

    margin-top:20px;

    margin-bottom:23px;

  }


  .ma7alak-hero-icon{

    width:39px;

    height:39px;

    font-size:26px;

  }


  .ma7alak-hero h1{

    font-size:47px;

    letter-spacing:-1.7px;

  }


  .ma7alak-hero p{

    padding:0 16px;

    font-size:13px;

  }


  .ma7alak-search{

    height:55px;

    border-radius:16px;

    font-size:12px;

  }


  .ma7alak-search-wrapper{

    margin-bottom:21px;

  }


  .ma7alak-filter-label{

    font-size:11px;

  }


  .ma7alak-area-grid{

    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:7px;

  }


  .ma7alak-area-button{

    min-height:49px;

    border-radius:13px;

    font-size:11px;

  }


  .ma7alak-category-grid{

    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:7px;

  }


  .ma7alak-category-button{

    min-height:55px;

    border-radius:13px;

    font-size:10px;

    padding:
      8px 5px;

  }


  .ma7alak-category-icon{

    font-size:17px;

  }


  .ma7alak-results{

    margin-top:25px;

  }


  .ma7alak-results-top{

    align-items:flex-start;

    flex-direction:column;

    gap:9px;

  }


  .ma7alak-results-title{

    font-size:27px;

  }


  .ma7alak-results-subtitle{

    font-size:10px;

  }


  .ma7alak-results-count{

    font-size:9px;

  }


  /* =====================================================
     TWO LARGE CARDS PER ROW
  ===================================================== */

  .ma7alak-shop-grid{

    grid-template-columns:
      repeat(2,minmax(0,1fr));

    gap:9px;

    padding-top:11px;

  }


  .ma7alak-shop-card{

    padding:
      15px 7px 9px;

    border-radius:18px;

  }


  .ma7alak-shop-image-ring{

    width:118px;

    height:118px;

    padding:4px;

  }


  .ma7alak-shop-image-inner{

    border-width:2px;

  }


  .ma7alak-verified-badge{

    right:calc(50% - 61px);

    width:23px;

    height:23px;

    font-size:12px;

    border-width:2px;

  }


  .ma7alak-shop-content{

    margin-top:11px;

  }


  .ma7alak-shop-name{

    font-size:16px;

  }


  .ma7alak-shop-arabic{

    font-size:10px;

    margin-top:3px;

  }


  .ma7alak-shop-category-pill{

    margin-top:7px;

    padding:
      5px 7px;

    font-size:6.5px;

    letter-spacing:.5px;

  }


  .ma7alak-shop-location{

    margin-top:7px;

    font-size:8px;

  }


  .ma7alak-location-icon{

    font-size:10px;

  }


  .ma7alak-featured{

    margin-top:7px;

    padding:
      5px 7px;

    font-size:6.5px;

    letter-spacing:.4px;

  }


  .ma7alak-profile-button{

    min-height:37px;

    margin-top:9px;

    border-radius:11px;

    font-size:9px;

    gap:5px;

  }


  .ma7alak-profile-arrow{

    font-size:13px;

  }


  /* CTA */

  .ma7alak-business-cta{

    margin-top:35px;

    padding:
      23px 15px;

    border-radius:19px;

    flex-direction:column;

    text-align:center;

    gap:17px;

  }


  .ma7alak-business-cta h2{

    font-size:24px;

  }


  .ma7alak-business-cta p{

    font-size:10px;

  }


  .ma7alak-add-button{

    width:100%;

    min-height:50px;

    height:50px;

  }


  /* FOOTER */

  .ma7alak-footer-features{

    flex-direction:column;

    gap:17px;

  }


  .ma7alak-footer-feature{

    min-width:0;

    padding:0;

  }


  .ma7alak-footer-feature
  + .ma7alak-footer-feature{

    border-left:none;

  }

}


/* =========================================================
   VERY SMALL PHONES
========================================================= */

@media(max-width:390px){

  #ma7alak-shops-page{

    padding-left:6px;

    padding-right:6px;

  }


  .ma7alak-shop-grid{

    gap:7px;

  }


  .ma7alak-shop-card{

    padding-left:5px;

    padding-right:5px;

  }


  .ma7alak-shop-image-ring{

    width:105px;

    height:105px;

  }


  .ma7alak-verified-badge{

    right:calc(50% - 54px);

    width:21px;

    height:21px;

  }


  .ma7alak-shop-name{

    font-size:14px;

  }


  .ma7alak-shop-arabic{

    font-size:9px;

  }


  .ma7alak-shop-location{

    font-size:7.5px;

  }


  .ma7alak-profile-button{

    font-size:8px;

  }

}

`;

  document.head.appendChild(style);


  /* =========================================================
     ONLY RUN ON ACTUAL SHOPS PAGE
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
     SHOP DATA

     These are the current sample shops.

     Later these can be replaced by Supabase data
     without changing the design.
  ========================================================= */

  const shops = [

    /* =====================================================
       MASAYA
    ===================================================== */

    {
      id:"masaya-cafe",

      name:"Masaya Cafe",

      arabic:"كافية مسايا",

      area:"Da7ye",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"حارة حريك - الصفير",

      image:
        "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/IMG-20260906-WA0049.jpg",

      url:
        "https://ma7alak.com/masaya-cafe",

      verified:true,

      featured:true,

      redFeatured:false

    },


    /* =====================================================
       DOZE 3ALE
    ===================================================== */

    {
      id:"doze-3-ale",

      name:"Doze 3ale",

      arabic:"دوزة عاله",

      area:"Da7ye",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"الحدث",

      image:
        "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/IMG-20260906-WA0108.jpg",

      url:
        "https://ma7alak.com/doze-3-ale",

      verified:true,

      featured:true,

      redFeatured:true

    },


    /* =====================================================
       BEIRUT COFFEE
    ===================================================== */

    {
      id:"beirut-coffee",

      name:"Beirut Coffee",

      arabic:"قهوة بيروت",

      area:"Central Beirut",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"الحمرا - بيروت",

      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:true,

      redFeatured:false

    },


    /* =====================================================
       URBAN BREW
    ===================================================== */

    {
      id:"urban-brew",

      name:"Urban Brew",

      arabic:"أوربان برو",

      area:"Central Beirut",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"مار مخايل - بيروت",

      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:true,

      redFeatured:false

    },


    /* =====================================================
       DAILY CUP
    ===================================================== */

    {
      id:"daily-cup",

      name:"The Daily Cup",

      arabic:"ذا ديلي كب",

      area:"Da7ye",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"صيدا",

      image:
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:false,

      featured:false,

      redFeatured:false

    },


    /* =====================================================
       NORTH BREW
    ===================================================== */

    {
      id:"north-brew",

      name:"North Brew",

      arabic:"نورث برو",

      area:"North Lebanon",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"طرابلس",

      image:
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:false,

      redFeatured:false

    },


    /* =====================================================
       ROASTED LOUNGE
    ===================================================== */

    {
      id:"roasted-lounge",

      name:"Roasted Lounge",

      arabic:"روستد لاونج",

      area:"South Lebanon",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"صور",

      image:
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:false,

      featured:false,

      redFeatured:false

    },


    /* =====================================================
       KAIF
    ===================================================== */

    {
      id:"kaif-cafe",

      name:"Kaif Café",

      arabic:"كيف كافيه",

      area:"Central Beirut",

      category:"cafe",

      categoryName:"Café & Coffee",

      location:"بيروت",

      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:true,

      redFeatured:false

    },


    /* =====================================================
       CLOTHING
    ===================================================== */

    {
      id:"local-style",

      name:"Local Style",

      arabic:"لوكل ستايل",

      area:"Da7ye",

      category:"clothing",

      categoryName:"Clothing Stores",

      location:"حارة حريك",

      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:false,

      redFeatured:false

    },


    {
      id:"beirut-fashion",

      name:"Beirut Fashion",

      arabic:"بيروت فاشن",

      area:"Central Beirut",

      category:"clothing",

      categoryName:"Clothing Stores",

      location:"بدارو - بيروت",

      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:false,

      featured:true,

      redFeatured:false

    },


    /* =====================================================
       GENERAL SERVICES
    ===================================================== */

    {
      id:"local-services",

      name:"Local Services",

      arabic:"خدمات محلية",

      area:"Da7ye",

      category:"services",

      categoryName:"General Services",

      location:"الضاحية الجنوبية",

      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:false,

      redFeatured:false

    },


    /* =====================================================
       FOOD
    ===================================================== */

    {
      id:"corner-bites",

      name:"Corner Bites",

      arabic:"كورنر بايتس",

      area:"South Lebanon",

      category:"food",

      categoryName:"Kiosks & Food",

      location:"صيدا",

      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=90",

      url:
        "https://ma7alak.com/shwf-almhlat-",

      verified:true,

      featured:true,

      redFeatured:false

    }

  ];


  /* =========================================================
     BUILD PAGE
  ========================================================= */

  const page =
    document.createElement("div");


  page.id =
    "ma7alak-shops-page";


  page.innerHTML = `

    <!-- =====================================================
         BACKGROUND
    ====================================================== -->

    <div class="ma7alak-background">

      <img
        class="ma7alak-background-image"
        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2200&q=85"
        alt=""
      >

      <div class="ma7alak-background-overlay"></div>

      <div class="ma7alak-background-vignette"></div>

    </div>


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

      <div class="ma7alak-hero-icon">

        ☕

      </div>


      <h1>

        Discover

        <span>Shops.</span>

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
      >

        <button
          class="ma7alak-area-button"
          data-area="Da7ye"
        >

          <span class="icon">

            📍

          </span>

          Da7ye

        </button>


        <button
          class="ma7alak-area-button"
          data-area="Central Beirut"
        >

          <span class="icon">

            📍

          </span>

          Central Beirut

        </button>


        <button
          class="ma7alak-area-button"
          data-area="South Lebanon"
        >

          <span class="icon">

            📍

          </span>

          South Lebanon

        </button>


        <button
          class="ma7alak-area-button"
          data-area="North Lebanon"
        >

          <span class="icon">

            📍

          </span>

          North Lebanon

        </button>

      </div>

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


      <div class="ma7alak-category-grid">

        <button
          class="ma7alak-category-button"
          data-category="cafe"
        >

          <span class="ma7alak-category-icon">

            ☕

          </span>

          Café & Coffee

        </button>


        <button
          class="ma7alak-category-button"
          data-category="clothing"
        >

          <span class="ma7alak-category-icon">

            ♧

          </span>

          Clothing Stores

        </button>


        <button
          class="ma7alak-category-button"
          data-category="services"
        >

          <span class="ma7alak-category-icon">

            ⚒

          </span>

          General Services

        </button>


        <button
          class="ma7alak-category-button"
          data-category="food"
        >

          <span class="ma7alak-category-icon">

            🍴

          </span>

          Kiosks & Food

        </button>

      </div>

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

  function initialize(){

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


    bindEvents();

  }


  /* =========================================================
     EVENTS
  ========================================================= */

  function bindEvents(){


    /* AREA */

    areaButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          function(){

            selectedArea =
              this.dataset.area;


            selectedCategory =
              null;


            areaButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


            this.classList.add(
              "active"
            );


            categoryButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


            categorySection.classList.add(
              "visible"
            );


            results.classList.remove(
              "visible"
            );


            searchInput.value =
              "";


            searchTerm =
              "";


            setTimeout(
              function(){

                categorySection.scrollIntoView({

                  behavior:"smooth",

                  block:"center"

                });

              },
              80
            );

          }
        );

      }
    );


    /* CATEGORY */

    categoryButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          function(){

            if(!selectedArea){

              return;

            }


            selectedCategory =
              this.dataset.category;


            categoryButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


            this.classList.add(
              "active"
            );


            renderResults();


            setTimeout(
              function(){

                results.scrollIntoView({

                  behavior:"smooth",

                  block:"start"

                });

              },
              100
            );

          }
        );

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


        if(
          selectedArea &&
          selectedCategory
        ){

          renderResults();

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


        page.querySelector(
          ".ma7alak-area-grid"
        ).scrollIntoView({

          behavior:"smooth",

          block:"center"

        });

      }
    );

  }


  /* =========================================================
     RENDER RESULTS
  ========================================================= */

  function renderResults(){

    if(
      !selectedArea ||
      !selectedCategory
    ){

      return;

    }


    results.classList.add(
      "visible"
    );


    const categoryButton =
      page.querySelector(
        '.ma7alak-category-button[data-category="' +
        selectedCategory +
        '"]'
      );


    let categoryName =
      categoryButton
        ? categoryButton.textContent.trim()
        : "Shops";


    let filtered =
      shops.filter(
        shop => {

          if(
            shop.area !== selectedArea
          ){

            return false;

          }


          if(
            shop.category !== selectedCategory
          ){

            return false;

          }


          if(
            !searchTerm
          ){

            return true;

          }


          const searchable = (

            shop.name +
            " " +
            shop.arabic +
            " " +
            shop.area +
            " " +
            shop.categoryName +
            " " +
            shop.location

          ).toLowerCase();


          return searchable.includes(
            searchTerm
          );

        }
      );


    resultsKicker.textContent =
      selectedArea.toUpperCase();


    resultsTitle.textContent =
      categoryName;


    resultsSubtitle.textContent =
      filtered.length +
      (
        filtered.length === 1
          ? " local shop"
          : " local shops"
      ) +
      " found in " +
      selectedArea;


    resultCount.textContent =
      filtered.length +
      (
        filtered.length === 1
          ? " shop"
          : " shops"
      );


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
        onclick="
          window.top.location.href='${shop.url}';
          return false;
        "
      >

        <div class="ma7alak-shop-image-ring">

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

          ${escapeHTML(shop.categoryName)}

        </div>


        <div class="ma7alak-shop-location">

          <span class="ma7alak-location-icon">

            📍

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
