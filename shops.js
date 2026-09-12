(function () {
  "use strict";

  /* =========================================================
     MA7ALAK SHOPS
     GitHub external JS
     ========================================================= */

  /* =========================================================
     PAGE CHECK
     ========================================================= */

  function getPath() {
    return window.location.pathname
      .replace(/\/+/g, "/")
      .replace(/\/$/, "")
      .toLowerCase();
  }

  if (getPath() !== "/shwf-almhlat-") {
    return;
  }

  /* =========================================================
     PREVENT DUPLICATES
     ========================================================= */

  if (window.__MA7ALAK_SHOPS_LOADED__) {
    return;
  }

  window.__MA7ALAK_SHOPS_LOADED__ = true;

  /* =========================================================
     GLOBAL PAGE CLASSES
     ========================================================= */

  document.documentElement.classList.add(
    "ma7alak-shops-page-active"
  );

  if (document.body) {
    document.body.classList.add(
      "ma7alak-shops-body"
    );
  }

  /* =========================================================
     SHOP DATA
     ========================================================= */

  const shops = [

    {
      name: "Masaya Cafe",
      arabic: "ماسایا كافيه",
      area: "da7ye",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "حارة حريك - الصفير",
      image:
        "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/IMG-20260906-WA0049.jpg",
      url:
        "https://ma7alak.com/masaya-cafe",
      verified: true,
      featured: true
    },

    {
      name: "Doze 3ale",
      arabic: "دوز عَلي",
      area: "da7ye",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "الحدث",
      image:
        "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/IMG-20260906-WA0108.jpg",
      url:
        "https://ma7alak.com/doze-3-ale",
      verified: true,
      featured: true,
      redFeatured: true
    },

    {
      name: "Beirut Coffee",
      arabic: "بيروت كوفي",
      area: "beirut",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "الحمرا - بيروت",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: true
    },

    {
      name: "Urban Brew",
      arabic: "أوربان برو",
      area: "beirut",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "مار مخايل - بيروت",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: true
    },

    {
      name: "Kaif Café",
      arabic: "كيف كافيه",
      area: "beirut",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "بيروت",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: true
    },

    {
      name: "The Daily Cup",
      arabic: "ذا ديلي كب",
      area: "da7ye",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "صيدا",
      image:
        "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: false,
      featured: false
    },

    {
      name: "North Brew",
      arabic: "نورث برو",
      area: "north",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "طرابلس",
      image:
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: false
    },

    {
      name: "Roasted Lounge",
      arabic: "روستد لاونج",
      area: "south",
      category: "cafe",
      categoryName: "Café & Coffee",
      location: "صور",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: false,
      featured: false
    },

    {
      name: "Local Style",
      arabic: "لوكال ستايل",
      area: "da7ye",
      category: "clothing",
      categoryName: "Clothing Stores",
      location: "حارة حريك",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: false
    },

    {
      name: "Beirut Fashion",
      arabic: "بيروت فاشن",
      area: "beirut",
      category: "clothing",
      categoryName: "Clothing Stores",
      location: "بدارو - بيروت",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: false,
      featured: true
    },

    {
      name: "Local Services",
      arabic: "خدمات محلية",
      area: "da7ye",
      category: "services",
      categoryName: "General Services",
      location: "الضاحية الجنوبية",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: false
    },

    {
      name: "Corner Bites",
      arabic: "كورنر بايتس",
      area: "south",
      category: "food",
      categoryName: "Kiosks & Food",
      location: "صيدا",
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
      url:
        "https://ma7alak.com/shwf-almhlat-",
      verified: true,
      featured: true
    }

  ];

  /* =========================================================
     STYLE
     ========================================================= */

  const style = document.createElement("style");

  style.id = "ma7alak-shops-style";

  style.textContent = `

    html.ma7alak-shops-page-active,
    html.ma7alak-shops-page-active body,
    body.ma7alak-shops-body {
      background:#080706 !important;
      color:#fff !important;
    }

    #ma7alak-shops-page {
      --gold:#f5b83f;
      --gold-light:#ffd982;
      --cream:#f7efe4;
      --white:#fff;
      --muted:#b9b0a6;

      position:relative;
      width:100%;
      max-width:1500px;
      margin:0 auto;
      padding:42px 42px 80px;
      box-sizing:border-box;
      color:#fff;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Arial,
        sans-serif;

      overflow:hidden;
      isolation:isolate;
    }

    #ma7alak-shops-page * {
      box-sizing:border-box;
    }

    /* BACKGROUND */

    .ma7alak-background {
      position:absolute;
      inset:0;
      z-index:-5;
      overflow:hidden;
      background:#080706;
    }

    .ma7alak-background-image {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center top;
      opacity:.28;
      filter:
        saturate:.72
        contrast:1.08
        brightness:.60;
      transform:scale(1.04);
    }

    .ma7alak-background-overlay {
      position:absolute;
      inset:0;
      background:
        radial-gradient(
          circle at 50% 8%,
          rgba(210,137,45,.22),
          transparent 34%
        ),
        radial-gradient(
          circle at 10% 45%,
          rgba(180,100,30,.10),
          transparent 30%
        ),
        radial-gradient(
          circle at 90% 55%,
          rgba(220,150,55,.10),
          transparent 30%
        ),
        linear-gradient(
          180deg,
          rgba(8,7,5,.10),
          rgba(8,7,5,.72) 55%,
          #080706 100%
        );
    }

    .ma7alak-background-vignette {
      position:absolute;
      inset:0;
      box-shadow:
        inset 0 0 170px rgba(0,0,0,.78);
    }

    /* BRAND */

    .ma7alak-top-brand {
      text-align:center;
      margin-bottom:30px;
      position:relative;
    }

    .ma7alak-brand-name {
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
        0 5px 30px rgba(0,0,0,.75);
    }

    .ma7alak-brand-subtitle {
      margin-top:10px;
      font-size:9px;
      letter-spacing:5px;
      color:#c7bdb1;
      text-transform:uppercase;
    }

    .ma7alak-brand-rule {
      width:78px;
      height:1px;
      margin:17px auto 0;

      background:
        linear-gradient(
          90deg,
          transparent,
          var(--gold),
          transparent
        );
    }

    /* HERO */

    .ma7alak-hero {
      text-align:center;
      margin:22px auto 32px;
    }

    .ma7alak-hero-icon {
      display:flex;
      align-items:center;
      justify-content:center;

      width:52px;
      height:52px;
      margin:0 auto 10px;

      color:var(--gold);
      font-size:31px;

      filter:
        drop-shadow(
          0 0 17px rgba(245,184,63,.28)
        );
    }

    .ma7alak-hero h1 {
      margin:0;

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:
        clamp(46px,6vw,74px);

      line-height:1;
      letter-spacing:-2px;
      color:#fff;

      text-shadow:
        0 5px 35px rgba(0,0,0,.72);
    }

    .ma7alak-hero h1 span {
      color:var(--gold);

      text-shadow:
        0 0 30px rgba(245,184,63,.18);
    }

    .ma7alak-hero p {
      max-width:650px;
      margin:13px auto 0;

      color:#c0b7ae;
      font-size:15px;
      line-height:1.7;
    }

    /* SEARCH */

    .ma7alak-search-wrapper {
      position:relative;
      width:100%;
      max-width:880px;
      margin:0 auto 28px;
    }

    .ma7alak-search {
      width:100%;
      height:62px;

      padding:
        0 60px 0 22px;

      border:
        1px solid rgba(255,255,255,.22);

      border-radius:20px;

      outline:none;

      background:
        linear-gradient(
          135deg,
          rgba(49,39,31,.76),
          rgba(22,19,17,.70)
        );

      backdrop-filter:blur(22px);
      -webkit-backdrop-filter:blur(22px);

      color:#fff;
      font-size:14px;

      box-shadow:
        0 18px 55px rgba(0,0,0,.36),
        inset 0 1px rgba(255,255,255,.08);

      transition:
        border-color .25s ease,
        box-shadow .25s ease;
    }

    .ma7alak-search::placeholder {
      color:#999087;
    }

    .ma7alak-search:focus {
      border-color:
        rgba(245,184,63,.70);

      box-shadow:
        0 0 0 4px rgba(245,184,63,.07),
        0 20px 60px rgba(0,0,0,.40);
    }

    .ma7alak-search-icon {
      position:absolute;
      right:20px;
      top:50%;
      transform:translateY(-50%);

      width:28px;
      height:28px;

      display:flex;
      align-items:center;
      justify-content:center;

      color:#e6d9c9;
      font-size:24px;

      pointer-events:none;
    }

    /* FILTERS */

    .ma7alak-filter-block {
      margin-bottom:22px;
    }

    .ma7alak-filter-label {
      margin:0 0 10px 2px;
      color:#d3c8bd;
      font-size:12px;
      font-weight:600;
    }

    .ma7alak-area-grid,
    .ma7alak-category-grid {
      display:grid;
      grid-template-columns:
        repeat(4,minmax(0,1fr));
      gap:10px;
    }

    .ma7alak-area-button,
    .ma7alak-category-button {
      border:
        1px solid rgba(255,255,255,.19);

      background:
        rgba(22,19,17,.70);

      color:#eae2d9;

      border-radius:15px;

      cursor:pointer;

      transition:
        transform .22s ease,
        border-color .22s ease,
        background .22s ease,
        box-shadow .22s ease;

      font-family:inherit;
    }

    .ma7alak-area-button {
      min-height:54px;

      display:flex;
      align-items:center;
      justify-content:center;

      gap:8px;

      font-size:13px;
      font-weight:600;
    }

    .ma7alak-category-button {
      min-height:61px;

      display:flex;
      align-items:center;
      justify-content:center;

      gap:10px;

      padding:10px 12px;

      font-size:13px;
      font-weight:600;
    }

    .ma7alak-area-button:hover,
    .ma7alak-category-button:hover {
      transform:translateY(-2px);

      border-color:
        rgba(245,184,63,.55);

      background:
        rgba(72,50,28,.62);
    }

    .ma7alak-area-button.active,
    .ma7alak-category-button.active {
      border-color:var(--gold);

      color:#ffe3a6;

      background:
        linear-gradient(
          135deg,
          rgba(173,108,29,.43),
          rgba(72,47,25,.48)
        );

      box-shadow:
        0 0 27px rgba(245,184,63,.09),
        inset 0 1px rgba(255,255,255,.08);
    }

    .ma7alak-area-button .icon,
    .ma7alak-category-icon {
      font-size:19px;
    }

    /* CATEGORY */

    .ma7alak-category-section {
      display:none;
      padding-top:2px;
    }

    .ma7alak-category-section.visible {
      display:block;
      animation:
        ma7alakFadeIn .35s ease both;
    }

    /* RESULTS */

    .ma7alak-results {
      display:none;
      margin-top:32px;
    }

    .ma7alak-results.visible {
      display:block;
      animation:
        ma7alakFadeIn .4s ease both;
    }

    .ma7alak-results-top {
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap:20px;

      padding-bottom:15px;

      border-bottom:
        1px solid rgba(255,255,255,.13);
    }

    .ma7alak-results-kicker {
      margin-bottom:6px;

      color:#c2975b;

      font-size:9px;
      font-weight:700;
      letter-spacing:3px;

      text-transform:uppercase;
    }

    .ma7alak-results-title {
      margin:0;

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size:31px;
      line-height:1.05;

      color:#fff;
    }

    .ma7alak-results-subtitle {
      margin:7px 0 0;

      color:#aaa198;
      font-size:12px;
    }

    .ma7alak-results-count {
      padding:8px 14px;

      border-radius:999px;

      white-space:nowrap;

      border:
        1px solid rgba(245,184,63,.30);

      background:
        rgba(245,184,63,.07);

      color:#d9b87e;

      font-size:10px;
      font-weight:700;
    }

    /* SHOP GRID */

    .ma7alak-shop-grid {
      display:grid;

      grid-template-columns:
        repeat(4,minmax(0,1fr));

      gap:14px;

      padding-top:15px;
    }

    /* SHOP CARD */

    .ma7alak-shop-card {
      position:relative;

      min-width:0;

      padding:
        20px 14px 14px;

      border:
        1px solid rgba(255,255,255,.20);

      border-radius:21px;

      background:
        radial-gradient(
          circle at 50% 5%,
          rgba(198,126,48,.18),
          transparent 43%
        ),
        linear-gradient(
          145deg,
          rgba(72,56,43,.76),
          rgba(27,23,20,.76)
        );

      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);

      box-shadow:
        0 18px 48px rgba(0,0,0,.40),
        inset 0 1px rgba(255,255,255,.10);

      text-align:center;

      overflow:hidden;

      transition:
        transform .28s ease,
        border-color .28s ease,
        box-shadow .28s ease;
    }

    .ma7alak-shop-card:hover {
      transform:translateY(-5px);

      border-color:
        rgba(245,184,63,.48);

      box-shadow:
        0 25px 60px rgba(0,0,0,.48),
        0 0 25px rgba(245,184,63,.07),
        inset 0 1px rgba(255,255,255,.12);
    }

    .ma7alak-shop-card::before {
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
          rgba(229,159,69,.18),
          transparent 68%
        );

      pointer-events:none;
    }

    .ma7alak-shop-card::after {
      content:"";

      position:absolute;

      left:-90%;
      top:0;

      width:60%;
      height:100%;

      transform:skewX(-18deg);

      background:
        linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,.035),
          transparent
        );

      transition:left .75s ease;

      pointer-events:none;
    }

    .ma7alak-shop-card:hover::after {
      left:130%;
    }

    /* SHOP IMAGE */

    .ma7alak-shop-image-link {
      width:100%;

      display:flex;

      justify-content:center;
      align-items:center;

      text-decoration:none;

      position:relative;
      z-index:2;
    }

    .ma7alak-shop-image-ring {
      position:relative;

      width:145px;
      height:145px;

      display:flex;
      align-items:center;
      justify-content:center;

      border-radius:50%;

      background:
        conic-gradient(
          from 0deg,
          rgba(245,184,63,.95),
          rgba(255,218,130,.22),
          rgba(245,184,63,.55),
          rgba(255,255,255,.13),
          rgba(245,184,63,.95)
        );

      box-shadow:
        0 0 0 1px rgba(245,184,63,.20),
        0 0 28px rgba(245,184,63,.12);
    }

    .ma7alak-shop-image-inner {
      width:135px;
      height:135px;

      border-radius:50%;

      overflow:hidden;

      border:
        4px solid #17130f;

      background:#15120f;
    }

    .ma7alak-shop-image-inner img {
      width:100%;
      height:100%;

      display:block;

      object-fit:cover;

      object-position:center;

      transition:
        transform .35s ease;
    }

    .ma7alak-shop-card:hover
    .ma7alak-shop-image-inner img {
      transform:scale(1.06);
    }

    /* VERIFIED */

    .ma7alak-verified-badge {
      position:absolute;

      right:2px;
      bottom:6px;

      width:31px;
      height:31px;

      display:flex;
      align-items:center;
      justify-content:center;

      border-radius:50%;

      background:
        linear-gradient(
          145deg,
          #ffd66d,
          #d99a2f
        );

      color:#211608;

      border:
        3px solid #17130f;

      font-size:16px;
      font-weight:900;

      box-shadow:
        0 5px 15px rgba(0,0,0,.40);
    }

    /* CONTENT */

    .ma7alak-shop-content {
      position:relative;
      z-index:2;

      padding-top:15px;
    }

    .ma7alak-shop-title-row {
      display:flex;
      justify-content:center;
      align-items:center;
    }

    .ma7alak-shop-name {
      margin:0;

      color:#fff;

      font-size:18px;
      line-height:1.2;

      font-weight:750;
      letter-spacing:-.25px;
    }

    .ma7alak-shop-arabic {
      margin-top:5px;

      color:#d9cfc4;

      font-size:15px;
      line-height:1.5;

      font-weight:600;

      direction:rtl;
    }

    .ma7alak-shop-category-pill {
      display:inline-flex;

      align-items:center;
      justify-content:center;

      margin-top:10px;

      padding:
        6px 11px;

      border-radius:999px;

      border:
        1px solid rgba(245,184,63,.22);

      background:
        rgba(245,184,63,.07);

      color:#d6b577;

      font-size:10px;
      font-weight:700;
    }

    .ma7alak-shop-location {
      display:flex;

      justify-content:center;
      align-items:center;

      gap:5px;

      margin-top:9px;

      color:#aaa097;

      font-size:11px;

      line-height:1.5;
    }

    .ma7alak-location-icon {
      font-size:12px;
    }

    /* FEATURED */

    .ma7alak-featured {
      position:relative;

      display:inline-flex;

      align-items:center;
      justify-content:center;

      margin-top:12px;

      padding:
        6px 12px;

      border-radius:999px;

      background:
        linear-gradient(
          135deg,
          rgba(245,184,63,.18),
          rgba(245,184,63,.07)
        );

      border:
        1px solid rgba(245,184,63,.42);

      color:#ffd36e;

      font-size:9px;
      font-weight:800;
      letter-spacing:1.1px;

      box-shadow:
        0 0 16px rgba(245,184,63,.08);

      animation:
        ma7alakFeaturedPulse 2.4s ease-in-out infinite;
    }

    .ma7alak-featured.red {
      color:#ff5f67;

      border-color:
        rgba(255,71,81,.55);

      background:
        linear-gradient(
          135deg,
          rgba(255,57,69,.17),
          rgba(115,20,25,.14)
        );

      box-shadow:
        0 0 20px rgba(255,50,60,.13);
    }

    /* PROFILE BUTTON */

    .ma7alak-profile-button {
      width:100%;

      min-height:44px;

      display:flex;

      align-items:center;
      justify-content:center;

      gap:9px;

      margin-top:14px;

      border:
        1px solid rgba(245,184,63,.34);

      border-radius:13px;

      background:
        linear-gradient(
          135deg,
          rgba(245,184,63,.13),
          rgba(245,184,63,.04)
        );

      color:#f4d08a;

      text-decoration:none;

      font-size:11px;
      font-weight:750;

      transition:
        transform .22s ease,
        background .22s ease,
        border-color .22s ease;
    }

    .ma7alak-profile-button:hover {
      transform:translateY(-2px);

      border-color:
        rgba(245,184,63,.65);

      background:
        rgba(245,184,63,.15);
    }

    .ma7alak-profile-arrow {
      font-size:16px;
      line-height:1;
    }

    /* EMPTY */

    #ma7alak-empty {
      display:none;

      padding:50px 20px;

      text-align:center;

      color:#a79e95;
    }

    .ma7alak-empty-icon {
      font-size:38px;
      margin-bottom:12px;
    }

    .ma7alak-empty-title {
      color:#fff;
      font-size:19px;
      font-weight:700;
    }

    .ma7alak-empty-text {
      margin-top:7px;
      font-size:12px;
      color:#9c938a;
    }

    /* CHANGE AREA */

    #ma7alak-change-area {
      display:none;

      margin:20px auto 0;

      width:max-content;
      max-width:100%;

      padding:
        9px 15px;

      border:
        1px solid rgba(255,255,255,.18);

      border-radius:999px;

      background:
        rgba(255,255,255,.045);

      color:#c8beb4;

      font-size:11px;
      font-weight:650;

      cursor:pointer;

      transition:.22s ease;
    }

    #ma7alak-change-area.visible {
      display:block;
    }

    #ma7alak-change-area:hover {
      border-color:
        rgba(245,184,63,.40);

      color:#f2cf8d;
    }

    /* BUSINESS CTA */

    .ma7alak-business-cta {
      position:relative;

      margin-top:55px;

      padding:
        34px 28px;

      text-align:center;

      border:
        1px solid rgba(245,184,63,.22);

      border-radius:25px;

      background:
        radial-gradient(
          circle at 50% 0%,
          rgba(245,184,63,.13),
          transparent 55%
        ),
        rgba(29,24,20,.62);

      backdrop-filter:blur(18px);
      -webkit-backdrop-filter:blur(18px);

      box-shadow:
        0 20px 60px rgba(0,0,0,.30);
    }

    .ma7alak-business-cta-kicker {
      color:#bd985d;

      font-size:9px;
      font-weight:800;
      letter-spacing:3px;

      text-transform:uppercase;
    }

    .ma7alak-business-cta h2 {
      margin:8px 0 0;

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      color:#fff;

      font-size:30px;
    }

    .ma7alak-business-cta p {
      max-width:620px;

      margin:10px auto 20px;

      color:#a99f96;

      font-size:12px;
      line-height:1.7;
    }

    .ma7alak-business-button {
      display:inline-flex;

      align-items:center;
      justify-content:center;

      min-height:47px;

      padding:
        0 22px;

      border-radius:13px;

      background:
        linear-gradient(
          135deg,
          #f6c45c,
          #d9972f
        );

      color:#241809;

      text-decoration:none;

      font-size:12px;
      font-weight:850;

      box-shadow:
        0 10px 28px rgba(210,145,44,.20);

      transition:
        transform .22s ease,
        box-shadow .22s ease;
    }

    .ma7alak-business-button:hover {
      transform:translateY(-2px);

      box-shadow:
        0 15px 35px rgba(210,145,44,.28);
    }

    /* FOOTER */

    .ma7alak-shops-footer {
      padding-top:35px;

      text-align:center;

      color:#706961;

      font-size:9px;

      letter-spacing:2px;

      text-transform:uppercase;
    }

    /* ANIMATIONS */

    @keyframes ma7alakFadeIn {
      from {
        opacity:0;
        transform:translateY(8px);
      }

      to {
        opacity:1;
        transform:translateY(0);
      }
    }

    @keyframes ma7alakFeaturedPulse {
      0%,100% {
        transform:scale(1);
      }

      50% {
        transform:scale(1.025);
      }
    }

    /* =========================================================
       TABLET
    ========================================================= */

    @media (max-width:1050px) {

      #ma7alak-shops-page {
        padding:
          35px 25px 65px;
      }

      .ma7alak-shop-grid {
        grid-template-columns:
          repeat(3,minmax(0,1fr));
      }

    }

    /* =========================================================
       MOBILE
    ========================================================= */

    @media (max-width:700px) {

      #ma7alak-shops-page {
        padding:
          28px 12px 55px;
      }

      .ma7alak-brand-name {
        font-size:43px;
      }

      .ma7alak-brand-subtitle {
        font-size:8px;
        letter-spacing:4px;
      }

      .ma7alak-hero {
        margin-top:18px;
        margin-bottom:24px;
      }

      .ma7alak-hero h1 {
        font-size:
          clamp(42px,13vw,60px);
      }

      .ma7alak-hero p {
        padding:0 12px;
        font-size:13px;
      }

      .ma7alak-search {
        height:56px;
        border-radius:17px;
      }

      .ma7alak-area-grid,
      .ma7alak-category-grid {
        grid-template-columns:
          repeat(2,minmax(0,1fr));

        gap:8px;
      }

      .ma7alak-area-button {
        min-height:53px;
        font-size:12px;
      }

      .ma7alak-category-button {
        min-height:60px;
        font-size:11px;
      }

      .ma7alak-results {
        margin-top:25px;
      }

      .ma7alak-results-top {
        align-items:center;
      }

      .ma7alak-results-title {
        font-size:25px;
      }

      .ma7alak-results-subtitle {
        font-size:10px;
      }

      .ma7alak-results-count {
        padding:7px 10px;
        font-size:9px;
      }

      /* TWO SHOP CARDS SIDE BY SIDE */

      .ma7alak-shop-grid {
        grid-template-columns:
          repeat(2,minmax(0,1fr));

        gap:9px;

        padding-top:12px;
      }

      .ma7alak-shop-card {
        padding:
          15px 8px 9px;

        border-radius:17px;
      }

      .ma7alak-shop-image-ring {
        width:104px;
        height:104px;
      }

      .ma7alak-shop-image-inner {
        width:96px;
        height:96px;

        border-width:3px;
      }

      .ma7alak-verified-badge {
        width:25px;
        height:25px;

        right:0;
        bottom:3px;

        border-width:2px;

        font-size:13px;
      }

      .ma7alak-shop-content {
        padding-top:11px;
      }

      .ma7alak-shop-name {
        font-size:14px;
      }

      .ma7alak-shop-arabic {
        font-size:12px;
      }

      .ma7alak-shop-category-pill {
        margin-top:7px;
        padding:5px 7px;
        font-size:8px;
      }

      .ma7alak-shop-location {
        margin-top:7px;
        font-size:9px;
      }

      .ma7alak-featured {
        margin-top:8px;
        padding:5px 7px;
        font-size:7px;
        letter-spacing:.7px;
      }

      .ma7alak-profile-button {
        min-height:38px;

        margin-top:9px;

        border-radius:10px;

        font-size:9px;

        gap:5px;
      }

      .ma7alak-profile-arrow {
        font-size:13px;
      }

      .ma7alak-business-cta {
        margin-top:38px;
        padding:28px 18px;
        border-radius:20px;
      }

      .ma7alak-business-cta h2 {
        font-size:25px;
      }

    }

    /* =========================================================
       SMALL PHONES
    ========================================================= */

    @media (max-width:390px) {

      #ma7alak-shops-page {
        padding-left:9px;
        padding-right:9px;
      }

      .ma7alak-shop-grid {
        gap:7px;
      }

      .ma7alak-shop-card {
        padding:
          13px 6px 8px;
      }

      .ma7alak-shop-image-ring {
        width:94px;
        height:94px;
      }

      .ma7alak-shop-image-inner {
        width:87px;
        height:87px;
      }

      .ma7alak-shop-name {
        font-size:13px;
      }

      .ma7alak-shop-arabic {
        font-size:11px;
      }

      .ma7alak-shop-location {
        font-size:8px;
      }

    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     HTML
     ========================================================= */

  function createPage() {

    if (
      document.getElementById(
        "ma7alak-shops-page"
      )
    ) {
      return;
    }

    const page =
      document.createElement("main");

    page.id =
      "ma7alak-shops-page";

    page.innerHTML = `

      <!-- BACKGROUND -->

      <div class="ma7alak-background">

        <img
          class="ma7alak-background-image"
          src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1800&q=85"
          alt=""
        >

        <div class="ma7alak-background-overlay"></div>

        <div class="ma7alak-background-vignette"></div>

      </div>


      <!-- BRAND -->

      <div class="ma7alak-top-brand">

        <div class="ma7alak-brand-name">
          Ma7alak
        </div>

        <div class="ma7alak-brand-subtitle">
          LOCAL SHOPS • LEBANON
        </div>

        <div class="ma7alak-brand-rule"></div>

      </div>


      <!-- HERO -->

      <section class="ma7alak-hero">

        <div class="ma7alak-hero-icon">
          👁
        </div>

        <h1>
          Discover
          <span>Shops.</span>
        </h1>

        <p>
          اكتشف المحلّات القريبة منك،
          شوف شو بتقدّم وتعرّف عليها بمكان واحد.
        </p>

      </section>


      <!-- SEARCH -->

      <div class="ma7alak-search-wrapper">

        <input
          id="ma7alak-shop-search"
          class="ma7alak-search"
          type="search"
          autocomplete="off"
          placeholder="Search shops, places or categories..."
        >

        <div class="ma7alak-search-icon">
          🔎
        </div>

      </div>


      <!-- AREAS -->

      <section class="ma7alak-filter-block">

        <div class="ma7alak-filter-label">
          Choose an area
        </div>

        <div class="ma7alak-area-grid">

          <button
            type="button"
            class="ma7alak-area-button"
            data-area="da7ye"
          >
            <span class="icon">📍</span>
            Da7ye
          </button>

          <button
            type="button"
            class="ma7alak-area-button"
            data-area="beirut"
          >
            <span class="icon">🏙️</span>
            Central Beirut
          </button>

          <button
            type="button"
            class="ma7alak-area-button"
            data-area="south"
          >
            <span class="icon">🌊</span>
            South Lebanon
          </button>

          <button
            type="button"
            class="ma7alak-area-button"
            data-area="north"
          >
            <span class="icon">⛰️</span>
            North Lebanon
          </button>

        </div>

      </section>


      <!-- CATEGORIES -->

      <section
        id="ma7alak-category-section"
        class="ma7alak-category-section"
      >

        <div class="ma7alak-filter-label">
          Choose a category
        </div>

        <div class="ma7alak-category-grid">

          <button
            type="button"
            class="ma7alak-category-button"
            data-category="cafe"
          >
            <span class="ma7alak-category-icon">
              ☕
            </span>
            Café & Coffee
          </button>

          <button
            type="button"
            class="ma7alak-category-button"
            data-category="clothing"
          >
            <span class="ma7alak-category-icon">
              👕
            </span>
            Clothing Stores
          </button>

          <button
            type="button"
            class="ma7alak-category-button"
            data-category="services"
          >
            <span class="ma7alak-category-icon">
              🛠️
            </span>
            General Services
          </button>

          <button
            type="button"
            class="ma7alak-category-button"
            data-category="food"
          >
            <span class="ma7alak-category-icon">
              🍔
            </span>
            Kiosks & Food
          </button>

        </div>

      </section>


      <!-- RESULTS -->

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
              AREA
            </div>

            <h2
              id="ma7alak-results-title"
              class="ma7alak-results-title"
            >
              Shops
            </h2>

            <div
              id="ma7alak-results-subtitle"
              class="ma7alak-results-subtitle"
            >
              Local shops
            </div>

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
        >

          <div class="ma7alak-empty-icon">
            🔎
          </div>

          <div class="ma7alak-empty-title">
            No shops found
          </div>

          <div class="ma7alak-empty-text">
            Try another search or category.
          </div>

        </div>


        <button
          type="button"
          id="ma7alak-change-area"
        >
          ← Change area
        </button>

      </section>


      <!-- BUSINESS CTA -->

      <section class="ma7alak-business-cta">

        <div class="ma7alak-business-cta-kicker">
          FOR SHOP OWNERS
        </div>

        <h2>
          خلّي محلك ينشاف.
        </h2>

        <p>
          عندك محل بلبنان؟
          خليه موجود على Ma7alak وخلي الناس
          تكتشفك، تشوف شو بتقدّم وتتواصل معك.
        </p>

        <a
          class="ma7alak-business-button"
          href="https://ma7alak.com/dhyf-mhlk-"
          onclick="
            window.top.location.href='https://ma7alak.com/dhyf-mhlk-';
            return false;
          "
        >
          Add Your Shop
          &nbsp; →
        </a>

      </section>


      <!-- FOOTER -->

      <div class="ma7alak-shops-footer">
        MA7ALAK • LEBANON
      </div>

    `;

    return page;
  }

  /* =========================================================
     FIND HOSTINGER HEADER
     ========================================================= */

  function findHeader() {

    const selectors = [
      "header",
      "nav",
      "[role='navigation']",
      ".header",
      ".navbar",
      ".site-header",
      ".wsite-header",
      "[data-testid='header']"
    ];

    for (
      let i = 0;
      i < selectors.length;
      i++
    ) {

      const element =
        document.querySelector(
          selectors[i]
        );

      if (element) {
        return element;
      }

    }

    return null;
  }

  /* =========================================================
     INSERT PAGE
     ========================================================= */

  function insertPage() {

    if (
      document.getElementById(
        "ma7alak-shops-page"
      )
    ) {
      return true;
    }

    if (!document.body) {
      return false;
    }

    const page =
      createPage();

    const header =
      findHeader();

    if (header) {

      let container =
        header.closest(
          "header"
        );

      if (!container) {
        container = header;
      }

      if (
        container.parentNode
      ) {

        container.parentNode.insertBefore(
          page,
          container.nextSibling
        );

        return true;
      }

    }

    /* FALLBACK */

    const firstChild =
      document.body.firstElementChild;

    if (firstChild) {

      document.body.insertBefore(
        page,
        firstChild
      );

    } else {

      document.body.appendChild(
        page
      );

    }

    return true;
  }

  /* =========================================================
     STATE
     ========================================================= */

  let selectedArea = null;

  let selectedCategory = null;

  let searchTerm = "";

  let page = null;

  let areaButtons = [];

  let categoryButtons = [];

  let categorySection = null;

  let results = null;

  let shopGrid = null;

  let resultsKicker = null;

  let resultsTitle = null;

  let resultsSubtitle = null;

  let resultCount = null;

  let empty = null;

  let changeArea = null;

  let searchInput = null;

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function initialize() {

    page =
      document.getElementById(
        "ma7alak-shops-page"
      );

    if (!page) {
      return;
    }

    areaButtons =
      Array.from(
        page.querySelectorAll(
          ".ma7alak-area-button"
        )
      );

    categoryButtons =
      Array.from(
        page.querySelectorAll(
          ".ma7alak-category-button"
        )
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

    resultsKicker =
      page.querySelector(
        "#ma7alak-results-kicker"
      );

    resultsTitle =
      page.querySelector(
        "#ma7alak-results-title"
      );

    resultsSubtitle =
      page.querySelector(
        "#ma7alak-results-subtitle"
      );

    resultCount =
      page.querySelector(
        "#ma7alak-results-count"
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

  function bindEvents() {

    /* AREA */

    areaButtons.forEach(
      function(button) {

        button.addEventListener(
          "click",
          function() {

            selectedArea =
              this.dataset.area;

            selectedCategory =
              null;

            searchTerm =
              "";

            searchInput.value =
              "";

            areaButtons.forEach(
              function(item) {

                item.classList.remove(
                  "active"
                );

              }
            );

            this.classList.add(
              "active"
            );

            categoryButtons.forEach(
              function(item) {

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

            setTimeout(
              function() {

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
      function(button) {

        button.addEventListener(
          "click",
          function() {

            if (!selectedArea) {
              return;
            }

            selectedCategory =
              this.dataset.category;

            categoryButtons.forEach(
              function(item) {

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
              function() {

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
      function() {

        searchTerm =
          this.value
            .trim()
            .toLowerCase();

        if (
          selectedArea &&
          selectedCategory
        ) {

          renderResults();

        }

      }
    );

    /* CHANGE AREA */

    changeArea.addEventListener(
      "click",
      function() {

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
          function(item) {

            item.classList.remove(
              "active"
            );

          }
        );

        categoryButtons.forEach(
          function(item) {

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

  function renderResults() {

    if (
      !selectedArea ||
      !selectedCategory
    ) {
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

    const categoryName =
      categoryButton
        ? categoryButton.textContent.trim()
        : "Shops";

    const filtered =
      shops.filter(
        function(shop) {

          if (
            shop.area !==
            selectedArea
          ) {
            return false;
          }

          if (
            shop.category !==
            selectedCategory
          ) {
            return false;
          }

          if (!searchTerm) {
            return true;
          }

          const searchable = (
            shop.name +
            " " +
            shop.arabic +
            " " +
            shop.area +
            " " +
            shop.category +
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
      selectedArea === "da7ye"
        ? "DA7YE"
        : selectedArea === "beirut"
          ? "CENTRAL BEIRUT"
          : selectedArea === "south"
            ? "SOUTH LEBANON"
            : "NORTH LEBANON";

    resultsTitle.textContent =
      categoryName;

    resultsSubtitle.textContent =
      filtered.length +
      (
        filtered.length === 1
          ? " local shop"
          : " local shops"
      ) +
      " found";

    resultCount.textContent =
      filtered.length +
      (
        filtered.length === 1
          ? " shop"
          : " shops"
      );

    shopGrid.innerHTML =
      "";

    if (
      filtered.length === 0
    ) {

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
      function(shop) {

        shopGrid.appendChild(
          createShopCard(shop)
        );

      }
    );

  }

  /* =========================================================
     CREATE SHOP CARD
     ========================================================= */

  function createShopCard(shop) {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "ma7alak-shop-card";

    const verifiedHTML =
      shop.verified
        ? `
          <div
            class="ma7alak-verified-badge"
            title="Verified shop"
          >
            ✓
          </div>
        `
        : "";

    const featuredHTML =
      shop.featured
        ? `
          <div
            class="
              ma7alak-featured
              ${shop.redFeatured ? "red" : ""}
            "
          >
            ★ FEATURED
          </div>
        `
        : "";

    const safeURL =
      escapeAttribute(
        shop.url
      );

    card.innerHTML = `

      <a
        class="ma7alak-shop-image-link"
        href="${safeURL}"
        data-shop-url="${safeURL}"
      >

        <div class="ma7alak-shop-image-ring">

          <div class="ma7alak-shop-image-inner">

            <img
              src="${escapeAttribute(shop.image)}"
              alt="${escapeHTML(shop.name)}"
              loading="lazy"
            >

          </div>

          ${verifiedHTML}

        </div>

      </a>


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
          href="${safeURL}"
          data-shop-url="${safeURL}"
        >

          View Profile

          <span class="ma7alak-profile-arrow">
            →
          </span>

        </a>

      </div>

    `;

    card
      .querySelectorAll(
        "[data-shop-url]"
      )
      .forEach(
        function(link) {

          link.addEventListener(
            "click",
            function(event) {

              event.preventDefault();

              const url =
                this.getAttribute(
                  "data-shop-url"
                );

              window.top.location.href =
                url;

            }
          );

        }
      );

    return card;
  }

  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHTML(value) {

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
     ESCAPE ATTRIBUTE
     ========================================================= */

  function escapeAttribute(value) {

    return escapeHTML(
      value
    );

  }

  /* =========================================================
     START
     ========================================================= */

  let attempts = 0;

  function start() {

    attempts++;

    if (
      insertPage()
    ) {

      initialize();

      return;

    }

    if (
      attempts < 40
    ) {

      setTimeout(
        start,
        400
      );

    }

  }

  /* =========================================================
     DOM READY
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once:true
      }
    );

  } else {

    start();

  }

  /* =========================================================
     HOSTINGER WATCH
     ========================================================= */

  const observer =
    new MutationObserver(
      function() {

        if (
          !document.getElementById(
            "ma7alak-shops-page"
          )
        ) {

          start();

        }

      }
    );

  if (
    document.documentElement
  ) {

    observer.observe(
      document.documentElement,
      {
        childList:true,
        subtree:true
      }
    );

  }

})();
