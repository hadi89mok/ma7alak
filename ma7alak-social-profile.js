/* =========================================================
   MA7ALAK — SOCIAL SHOP PROFILE
   Unified social-style top profile for manual shop pages.

   Reads shop data + directory_options directly.
   Keeps:
   - Story viewer + owner add
   - Follow / unfollow
   - Messaging
   - Gallery Posts
   - Videos / Reels
   - Live / Offers preview
   - Share
   - Page Design Studio accent / motion / shop-name controls
========================================================= */
(function(){
  "use strict";

  if(window.__MA7ALAK_SOCIAL_SHOP_PROFILE__){
    return;
  }
  window.__MA7ALAK_SOCIAL_SHOP_PROFILE__ = true;

  const mount =
    document.getElementById("ma7alak-social-profile-mount");

  if(!mount){
    return;
  }

  const SB_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SB_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  const slug =
    String(
      mount.getAttribute("data-shop-slug") ||
      window.__MA7ALAK_EXACT_HUB_SLUG__ ||
      ""
    )
      .trim()
      .toLowerCase();

  if(!slug){
    return;
  }

  const state = {
    profile:null,
    gallery:[],
    videos:[],
    stories:[],
    live:[],
    followed:false,
    followers:0,
    storyIndex:0,
    storyTimer:null,
    mediaMode:"posts"
  };

  function esc(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

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
      return {r:242,g:202,b:237};
    }

    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }

  function mix(rgb,target,amount){
    const c = n =>
      Math.max(0,Math.min(255,Math.round(n)));

    return "#" + [
      c(rgb.r+(target.r-rgb.r)*amount),
      c(rgb.g+(target.g-rgb.g)*amount),
      c(rgb.b+(target.b-rgb.b)*amount)
    ].map(v=>v.toString(16).padStart(2,"0")).join("");
  }

  function visitorId(){
    const key = "ma7alak_visitor_id";
    let value = "";

    try{
      value = localStorage.getItem(key) || "";
    }catch(_){}

    if(!value){
      value =
        crypto.randomUUID
          ? crypto.randomUUID()
          : "v_"+Date.now()+"_"+Math.random().toString(36).slice(2);

      try{
        localStorage.setItem(key,value);
      }catch(_){}
    }

    return value;
  }

  function headers(extra){
    return Object.assign({
      "apikey":SB_KEY,
      "Authorization":"Bearer "+SB_KEY,
      "Accept":"application/json",
      "Content-Type":"application/json"
    },extra || {});
  }

  async function rest(path){
    const response =
      await fetch(
        SB_URL + "/rest/v1/" + path,
        {
          method:"GET",
          headers:headers(),
          cache:"no-store"
        }
      );

    if(!response.ok){
      throw new Error("REST "+response.status);
    }

    return response.json();
  }

  async function rpc(name,body){
    const response =
      await fetch(
        SB_URL + "/rest/v1/rpc/" + encodeURIComponent(name),
        {
          method:"POST",
          headers:headers(),
          body:JSON.stringify(body || {})
        }
      );

    const text =
      await response.text();

    if(!response.ok){
      throw new Error(text || ("RPC "+response.status));
    }

    if(!text){
      return null;
    }

    try{
      return JSON.parse(text);
    }catch(_){
      return text;
    }
  }

  function storyUrl(row){
    if(!row){
      return "";
    }

    const direct =
      String(
        row.media_url ||
        row.url ||
        ""
      ).trim();

    if(/^https?:\/\//i.test(direct)){
      return direct;
    }

    const path =
      String(row.storage_path || "").trim();

    if(/^https?:\/\//i.test(path)){
      return path;
    }

    if(!path){
      return "";
    }

    return (
      SB_URL +
      "/storage/v1/object/public/shop-stories/" +
      path.split("/").map(encodeURIComponent).join("/")
    );
  }

  function mediaImage(row){
    return String(
      row &&
      (
        row.image_url ||
        row.media_url ||
        row.url
      ) ||
      ""
    ).trim();
  }

  function mediaVideo(row){
    return String(
      row &&
      (
        row.video_url ||
        row.media_url ||
        row.url
      ) ||
      ""
    ).trim();
  }

  function profileOptions(){
    return (
      state.profile &&
      state.profile.directory_options &&
      typeof state.profile.directory_options === "object"
        ? state.profile.directory_options
        : {}
    );
  }

  function isOwner(){
    return !!(
      window.Ma7alakOwnerAuth &&
      window.Ma7alakOwnerAuth.owner &&
      String(
        window.Ma7alakOwnerAuth.owner.shop_slug || ""
      ).toLowerCase() === slug
    );
  }

  function normalizedHandle(){
    const o = profileOptions();

    const manual =
      String(
        o.profile_handle ||
        ""
      ).trim();

    if(manual){
      return manual.charAt(0) === "@"
        ? manual
        : "@"+manual;
    }

    return "@"+slug.replace(/[^a-z0-9._-]+/g,"");
  }

  function getAccent(){
    const o = profileOptions();

    return safeHex(
      o.story_color ||
      o.card_color,
      "#f2caed"
    );
  }

  function motionOff(){
    const o = profileOptions();

    const preset =
      String(
        o.page_design_preset ||
        "premium"
      ).toLowerCase();

    const mode =
      String(
        o.page_motion_mode ||
        "preset"
      ).toLowerCase();

    return (
      mode === "off" ||
      (
        mode === "preset" &&
        (
          preset === "basic" ||
          preset === "minimal"
        )
      )
    );
  }

  function motionSubtle(){
    return (
      String(
        profileOptions().page_motion_mode ||
        "preset"
      ).toLowerCase() === "subtle"
    );
  }

  function shopNameAnimation(){
    if(motionOff()){
      return "none";
    }

    return String(
      profileOptions().shop_name_animation ||
      "current"
    )
      .trim()
      .toLowerCase();
  }

  function css(){
    if(document.getElementById("m7-social-profile-css")){
      return;
    }

    const style =
      document.createElement("style");

    style.id = "m7-social-profile-css";

    style.textContent = `
      #ma7alak-social-profile-mount{
        width:100%;
        max-width:720px;
        margin:0 auto 12px;
        font-family:Arial,"Segoe UI",sans-serif;
      }

      #m7sp{
        --m7sp-accent:#f2caed;
        --m7sp-accent-rgb:242,202,237;
        --m7sp-accent-light:#f8e3f4;
        --m7sp-accent-dark:#8f6f8a;
        --m7sp-name:#ffffff;

        position:relative;
        overflow:hidden;
        border-radius:28px;
        background:#070707;
        color:#fff;
        isolation:isolate;
        box-shadow:
          0 18px 52px rgba(0,0,0,.34);
      }

      #m7sp *{
        box-sizing:border-box;
      }

      .m7sp-hero{
        position:relative;
        min-height:520px;
        padding:18px 18px 28px;
        text-align:center;
        background:#090909;
        overflow:hidden;
      }

      .m7sp-bg{
        position:absolute;
        inset:0;
        z-index:-3;
        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(var(--m7sp-accent-rgb),.18),
            transparent 36%
          ),
          linear-gradient(
            180deg,
            #211315,
            #090909 66%,
            #070707
          );
      }

      .m7sp-bg.has-image{
        background-position:center top;
        background-repeat:no-repeat;
        background-size:cover;
      }

      .m7sp-bg::after{
        content:"";
        position:absolute;
        inset:0;
        background:
          linear-gradient(
            180deg,
            rgba(0,0,0,.18) 0%,
            rgba(0,0,0,.22) 30%,
            rgba(7,7,7,.70) 65%,
            #070707 100%
          );
        backdrop-filter:saturate(112%);
        -webkit-backdrop-filter:saturate(112%);
      }

      .m7sp-top{
        display:grid;
        grid-template-columns:44px 1fr 44px;
        align-items:center;
        gap:10px;
        position:relative;
        z-index:3;
      }

      .m7sp-icon-btn{
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        border:1px solid rgba(255,255,255,.18);
        border-radius:50%;
        background:rgba(8,8,8,.46);
        color:#fff;
        font-size:23px;
        cursor:pointer;
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
      }

      .m7sp-hours{
        justify-self:center;
        min-height:42px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        max-width:100%;
        padding:0 16px;
        border:1px solid rgba(var(--m7sp-accent-rgb),.48);
        border-radius:999px;
        background:rgba(12,9,11,.70);
        color:var(--m7sp-accent-light);
        font-size:12px;
        font-weight:900;
        box-shadow:
          0 0 18px rgba(var(--m7sp-accent-rgb),.10),
          inset 0 1px 0 rgba(255,255,255,.05);
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .m7sp-hours i{
        width:10px;
        height:10px;
        border-radius:50%;
        background:var(--m7sp-accent);
        box-shadow:
          0 0 9px rgba(var(--m7sp-accent-rgb),.65);
        animation:m7spPulse 1.8s ease-in-out infinite;
      }

      .m7sp-profile{
        position:relative;
        width:210px;
        height:210px;
        margin:22px auto 13px;
      }

      .m7sp-ring{
        position:absolute;
        inset:0;
        border-radius:50%;
        padding:4px;
        background:
          conic-gradient(
            from 30deg,
            var(--m7sp-accent),
            var(--m7sp-accent-light),
            var(--m7sp-accent-dark),
            var(--m7sp-accent)
          );
        box-shadow:
          0 0 24px rgba(var(--m7sp-accent-rgb),.25);
        animation:m7spRing 8s linear infinite;
      }

      .m7sp-story{
        position:absolute;
        inset:5px;
        width:calc(100% - 10px);
        height:calc(100% - 10px);
        border:4px solid #080808;
        border-radius:50%;
        padding:0;
        overflow:hidden;
        background:#111;
        cursor:pointer;
      }

      .m7sp-story img,
      .m7sp-story video{
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
      }

      .m7sp-verified{
        position:absolute;
        right:8px;
        bottom:13px;
        width:43px;
        height:43px;
        display:grid;
        place-items:center;
        border:3px solid #090909;
        border-radius:50%;
        background:linear-gradient(
          145deg,
          var(--m7sp-accent-light),
          var(--m7sp-accent)
        );
        color:#181018;
        font-size:21px;
        font-weight:950;
        box-shadow:
          0 0 16px rgba(var(--m7sp-accent-rgb),.38);
        z-index:4;
      }

      .m7sp-add{
        position:absolute;
        left:8px;
        bottom:13px;
        width:40px;
        height:40px;
        display:none;
        place-items:center;
        border:2px solid #090909;
        border-radius:50%;
        background:#fff;
        color:#111;
        font-size:24px;
        font-weight:900;
        cursor:pointer;
        z-index:4;
      }

      #m7sp.is-owner .m7sp-add{
        display:grid;
      }

      .m7sp-name{
        margin:3px 0 2px;
        color:var(--m7sp-name);
        font-family:Georgia,"Times New Roman",serif;
        font-size:34px;
        line-height:1.05;
        font-weight:900;
        letter-spacing:-.6px;
        text-shadow:
          0 4px 16px rgba(0,0,0,.56);
      }

      .m7sp-handle{
        color:rgba(255,255,255,.72);
        font-size:15px;
        font-weight:650;
      }

      .m7sp-category{
        margin:12px auto 0;
        min-height:35px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        padding:0 14px;
        border:1px solid rgba(var(--m7sp-accent-rgb),.45);
        border-radius:999px;
        background:rgba(10,9,10,.52);
        color:var(--m7sp-accent-light);
        font-size:11px;
        font-weight:900;
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
      }

      .m7sp-tagline{
        max-width:560px;
        margin:12px auto 0;
        color:rgba(255,255,255,.88);
        font-size:13px;
        line-height:1.5;
      }

      .m7sp-signature{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
        margin:16px auto 0;
        color:var(--m7sp-accent);
        font-family:Georgia,"Times New Roman",serif;
        font-size:9px;
        font-weight:800;
        letter-spacing:3px;
        text-transform:uppercase;
      }

      .m7sp-signature::before,
      .m7sp-signature::after{
        content:"";
        width:78px;
        height:1px;
        background:
          linear-gradient(
            90deg,
            transparent,
            var(--m7sp-accent)
          );
        opacity:.8;
      }

      .m7sp-signature::after{
        transform:scaleX(-1);
      }

      .m7sp-body{
        padding:0 16px 26px;
        background:#070707;
      }

      .m7sp-stats{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        margin:-1px 0 14px;
        border:1px solid rgba(255,255,255,.16);
        border-radius:20px;
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.045),
            rgba(255,255,255,.015)
          );
        overflow:hidden;
      }

      .m7sp-stat{
        padding:15px 6px 14px;
        text-align:center;
      }

      .m7sp-stat + .m7sp-stat{
        border-left:1px solid rgba(255,255,255,.12);
      }

      .m7sp-stat b{
        display:block;
        color:#fff;
        font-size:22px;
        line-height:1;
      }

      .m7sp-stat span{
        display:block;
        margin-top:6px;
        color:rgba(255,255,255,.63);
        font-size:11px;
      }

      .m7sp-actions{
        display:grid;
        grid-template-columns:1.35fr 1.25fr 48px;
        gap:8px;
      }

      .m7sp-action{
        min-height:48px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        border:1px solid rgba(255,255,255,.17);
        border-radius:15px;
        background:#111;
        color:#fff;
        font:900 13px Arial,"Segoe UI",sans-serif;
        cursor:pointer;
      }

      .m7sp-action.primary{
        border-color:rgba(var(--m7sp-accent-rgb),.65);
        background:
          linear-gradient(
            135deg,
            var(--m7sp-accent-light),
            var(--m7sp-accent)
          );
        color:#160f14;
        box-shadow:
          0 8px 25px rgba(var(--m7sp-accent-rgb),.18);
      }

      .m7sp-action.icon{
        padding:0;
        font-size:22px;
      }

      .m7sp-tabs{
        display:grid;
        grid-template-columns:1fr 1fr;
        margin:24px -16px 0;
        border-bottom:1px solid rgba(255,255,255,.14);
      }

      .m7sp-tab{
        position:relative;
        min-height:52px;
        border:0;
        background:transparent;
        color:rgba(255,255,255,.55);
        font:900 13px Arial,"Segoe UI",sans-serif;
        cursor:pointer;
      }

      .m7sp-tab.active{
        color:var(--m7sp-accent-light);
      }

      .m7sp-tab.active::after{
        content:"";
        position:absolute;
        left:18%;
        right:18%;
        bottom:-1px;
        height:3px;
        border-radius:999px;
        background:var(--m7sp-accent);
        box-shadow:
          0 0 12px rgba(var(--m7sp-accent-rgb),.42);
      }

      .m7sp-content{
        padding-top:16px;
      }

      .m7sp-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:2px;
        overflow:hidden;
        border-radius:18px;
        background:#111;
      }

      .m7sp-tile{
        position:relative;
        aspect-ratio:1/1;
        border:0;
        padding:0;
        overflow:hidden;
        background:#111;
        cursor:pointer;
      }

      .m7sp-tile img,
      .m7sp-tile video{
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
      }

      .m7sp-tile .m7sp-play{
        position:absolute;
        right:7px;
        top:7px;
        width:25px;
        height:25px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:rgba(0,0,0,.62);
        color:#fff;
        font-size:11px;
      }

      .m7sp-live-panel{
        margin-top:14px;
        padding:28px 18px;
        border:1px solid rgba(255,255,255,.14);
        border-radius:21px;
        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(var(--m7sp-accent-rgb),.08),
            transparent 40%
          ),
          linear-gradient(
            145deg,
            #141414,
            #090909
          );
        text-align:center;
      }

      .m7sp-live-icon{
        width:56px;
        height:56px;
        display:grid;
        place-items:center;
        margin:0 auto 15px;
        border:1px solid rgba(var(--m7sp-accent-rgb),.5);
        border-radius:14px;
        color:var(--m7sp-accent-light);
        font-size:25px;
        box-shadow:
          0 0 18px rgba(var(--m7sp-accent-rgb),.08);
      }

      .m7sp-live-panel h3{
        margin:0;
        color:#fff;
        font-size:19px;
      }

      .m7sp-live-panel p{
        margin:7px auto 0;
        max-width:420px;
        color:rgba(255,255,255,.57);
        font-size:12px;
        line-height:1.5;
      }

      .m7sp-notify{
        min-height:42px;
        margin:18px auto 0;
        padding:0 18px;
        border:1px solid rgba(var(--m7sp-accent-rgb),.5);
        border-radius:999px;
        background:transparent;
        color:#fff;
        font-size:11px;
        font-weight:900;
        cursor:pointer;
      }

      .m7sp-live-card{
        display:grid;
        grid-template-columns:100px 1fr;
        gap:12px;
        text-align:left;
        align-items:center;
      }

      .m7sp-live-media{
        width:100px;
        height:100px;
        border-radius:16px;
        overflow:hidden;
        background:#151515;
      }

      .m7sp-live-media img,
      .m7sp-live-media video{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .m7sp-live-copy small{
        color:var(--m7sp-accent);
        font-weight:900;
        letter-spacing:.7px;
      }

      .m7sp-live-copy h3{
        margin:5px 0 4px;
        font-size:17px;
      }

      .m7sp-live-copy p{
        margin:0;
        text-align:left;
      }

      .m7sp-footer{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:11px;
        margin-top:22px;
        color:rgba(var(--m7sp-accent-rgb),.72);
        font-family:Georgia,"Times New Roman",serif;
        font-size:9px;
        letter-spacing:3px;
        text-transform:uppercase;
      }

      .m7sp-footer::before,
      .m7sp-footer::after{
        content:"";
        width:62px;
        height:1px;
        background:
          linear-gradient(
            90deg,
            transparent,
            var(--m7sp-accent)
          );
      }

      .m7sp-footer::after{
        transform:scaleX(-1);
      }

      #m7sp-viewer{
        position:fixed;
        inset:0;
        z-index:2147483646;
        display:none;
        background:#000;
      }

      #m7sp-viewer.open{
        display:block;
      }

      .m7sp-view-stage{
        position:absolute;
        inset:0;
        display:grid;
        place-items:center;
      }

      .m7sp-view-stage img,
      .m7sp-view-stage video{
        width:100%;
        height:100%;
        object-fit:contain;
        background:#000;
      }

      .m7sp-view-close{
        position:absolute;
        right:14px;
        top:14px;
        z-index:5;
        width:44px;
        height:44px;
        border:0;
        border-radius:50%;
        background:rgba(20,20,20,.82);
        color:#fff;
        font-size:27px;
        cursor:pointer;
      }

      .m7sp-story-progress{
        position:absolute;
        left:10px;
        right:10px;
        top:9px;
        z-index:5;
        display:flex;
        gap:4px;
      }

      .m7sp-story-progress i{
        flex:1;
        height:3px;
        border-radius:999px;
        overflow:hidden;
        background:rgba(255,255,255,.25);
      }

      .m7sp-story-progress b{
        display:block;
        width:0;
        height:100%;
        background:#fff;
      }

      .m7sp-story-tools{
        position:absolute;
        left:12px;
        right:12px;
        bottom:18px;
        z-index:5;
        display:flex;
        justify-content:center;
        gap:8px;
      }

      .m7sp-story-tools button,
      .m7sp-story-tools span{
        min-height:38px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:0 13px;
        border:1px solid rgba(255,255,255,.2);
        border-radius:999px;
        background:rgba(12,12,12,.76);
        color:#fff;
        font-size:11px;
        font-weight:900;
      }

      .m7sp-story-delete{
        display:none!important;
      }

      #m7sp.is-owner .m7sp-story-delete{
        display:inline-flex!important;
      }

      .m7sp-name.anim-shimmer{
        background:
          linear-gradient(
            105deg,
            var(--m7sp-name) 0%,
            #fff 38%,
            var(--m7sp-name) 62%,
            #fff 100%
          );
        background-size:260% 100%;
        -webkit-background-clip:text;
        background-clip:text;
        color:transparent;
        -webkit-text-fill-color:transparent;
        animation:m7spNameShimmer 3.6s ease-in-out infinite;
      }

      .m7sp-name.anim-glow{
        animation:m7spNameGlow 2.2s ease-in-out infinite;
      }

      .m7sp-name.anim-breathe{
        animation:m7spNameBreathe 2.8s ease-in-out infinite;
      }

      .m7sp-name.anim-none{
        animation:none!important;
      }

      #m7sp.motion-off *,
      #m7sp.motion-off *::before,
      #m7sp.motion-off *::after{
        animation:none!important;
        -webkit-animation:none!important;
      }

      #m7sp.motion-subtle .m7sp-ring,
      #m7sp.motion-subtle .m7sp-hours i,
      #m7sp.motion-subtle .m7sp-name{
        animation-duration:6s!important;
      }

      @keyframes m7spNameShimmer{
        from{background-position:120% 50%}
        to{background-position:-120% 50%}
      }

      @keyframes m7spNameGlow{
        0%,100%{
          text-shadow:
            0 0 5px rgba(var(--m7sp-accent-rgb),.18),
            0 4px 16px rgba(0,0,0,.56);
        }
        50%{
          text-shadow:
            0 0 16px var(--m7sp-name),
            0 0 28px rgba(var(--m7sp-accent-rgb),.28),
            0 4px 16px rgba(0,0,0,.56);
        }
      }

      @keyframes m7spNameBreathe{
        0%,100%{transform:scale(1);opacity:.94}
        50%{transform:scale(1.035);opacity:1}
      }

      @keyframes m7spRing{
        to{transform:rotate(360deg)}
      }

      @keyframes m7spPulse{
        0%,100%{transform:scale(.9);opacity:.7}
        50%{transform:scale(1.15);opacity:1}
      }

      @media(max-width:600px){
        #m7sp{
          border-radius:0;
        }

        .m7sp-hero{
          min-height:500px;
          padding-left:14px;
          padding-right:14px;
        }

        .m7sp-profile{
          width:190px;
          height:190px;
          margin-top:20px;
        }

        .m7sp-name{
          font-size:31px;
        }

        .m7sp-body{
          padding-left:12px;
          padding-right:12px;
        }

        .m7sp-tabs{
          margin-left:-12px;
          margin-right:-12px;
        }
      }

      @media(max-width:380px){
        .m7sp-hours{
          padding:0 11px;
          font-size:10px;
        }

        .m7sp-actions{
          grid-template-columns:1.25fr 1fr 44px;
        }

        .m7sp-action{
          min-height:45px;
          font-size:11px;
        }

        .m7sp-profile{
          width:178px;
          height:178px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function nameClass(){
    const mode =
      shopNameAnimation();

    if(mode === "glow"){
      return "anim-glow";
    }

    if(mode === "breathe"){
      return "anim-breathe";
    }

    if(mode === "none"){
      return "anim-none";
    }

    return "anim-shimmer";
  }

  function profileImage(){
    const p = state.profile || {};

    return String(
      p.story_logo_url ||
      p.profile_image_url ||
      p.main_image_url ||
      ""
    ).trim();
  }

  function backgroundImage(){
    const p = state.profile || {};
    const o = profileOptions();

    return String(
      o.profile_background_image ||
      o.cover ||
      p.cover_image_url ||
      ""
    ).trim();
  }

  function shortTagline(){
    const p = state.profile || {};
    const o = profileOptions();

    const text =
      String(
        o.profile_tagline ||
        p.about_text ||
        ""
      ).trim();

    if(!text){
      const bits = [
        p.category_name || p.category || "",
        p.location || p.area || ""
      ].filter(Boolean);

      return bits.join(" • ");
    }

    return text.length > 115
      ? text.slice(0,112).trim()+"…"
      : text;
  }

  function galleryHtml(){
    if(!state.gallery.length){
      return "";
    }

    return (
      '<div class="m7sp-grid">' +
      state.gallery
        .slice(0,12)
        .map((row,index)=>{
          const url = mediaImage(row);
          if(!url){
            return "";
          }

          return (
            '<button class="m7sp-tile" type="button" data-m7sp-post="'+index+'">' +
              '<img src="'+esc(url)+'" alt="" loading="lazy">' +
            '</button>'
          );
        })
        .join("") +
      '</div>'
    );
  }

  function reelsHtml(){
    if(!state.videos.length){
      return "";
    }

    return (
      '<div class="m7sp-grid">' +
      state.videos
        .slice(0,12)
        .map((row,index)=>{
          const url = mediaVideo(row);
          if(!url){
            return "";
          }

          return (
            '<button class="m7sp-tile" type="button" data-m7sp-reel="'+index+'">' +
              '<video src="'+esc(url)+'" muted playsinline preload="metadata"></video>' +
              '<span class="m7sp-play">▶</span>' +
            '</button>'
          );
        })
        .join("") +
      '</div>'
    );
  }

  function livePanelHtml(){
    const live =
      state.live[0];

    if(!live){
      return (
        '<div class="m7sp-live-panel">' +
          '<div class="m7sp-live-icon">▧</div>' +
          '<h3>Nothing live right now</h3>' +
          '<p>New posts, offers and updates will appear here when they are available.</p>' +
          (
            isOwner()
              ? '<button class="m7sp-notify" id="m7sp-live-manage" type="button">＋ Add Live / Offer</button>'
              : (
                  '<button class="m7sp-notify" id="m7sp-notify" type="button">' +
                    (state.followed ? "✓ Notifications on" : "♧ Notify me") +
                  '</button>'
                )
          ) +
        '</div>'
      );
    }

    const media =
      String(
        live.media_url ||
        ""
      ).trim();

    let visual = "";

    if(media){
      visual =
        String(live.media_type || "").toLowerCase() === "video"
          ? '<video src="'+esc(media)+'" muted autoplay loop playsinline></video>'
          : '<img src="'+esc(media)+'" alt="">';
    }

    return (
      '<div class="m7sp-live-panel">' +
        '<div class="m7sp-live-card">' +
          '<div class="m7sp-live-media">'+visual+'</div>' +
          '<div class="m7sp-live-copy">' +
            '<small>● LIVE NOW</small>' +
            '<h3>'+esc(live.title || "Happening now")+'</h3>' +
            '<p>'+esc(live.description || "Tap into the latest update from this shop.")+'</p>' +
            '<button class="m7sp-notify" id="m7sp-live-open" data-live-id="'+esc(live.id || "")+'" type="button">Open Live</button>' +
            (
              isOwner()
                ? '<button class="m7sp-notify" id="m7sp-live-manage" type="button">＋ Add Live / Offer</button>'
                : ''
            ) +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function mediaContent(){
    const html =
      state.mediaMode === "reels"
        ? reelsHtml()
        : galleryHtml();

    return (
      html ||
      (
        '<div class="m7sp-live-panel">' +
          '<div class="m7sp-live-icon">'+
            (state.mediaMode === "reels" ? "▷" : "▧")+
          '</div>' +
          '<h3>No '+(state.mediaMode === "reels" ? "reels" : "posts")+' yet</h3>' +
          '<p>New '+(state.mediaMode === "reels" ? "videos" : "photos")+' will appear here automatically.</p>' +
        '</div>'
      )
    );
  }

  function render(){
    css();

    const p = state.profile || {};
    const o = profileOptions();

    const accent =
      getAccent();

    const rgb =
      hexToRgb(accent);

    const nameColor =
      safeHex(
        o.shop_name_color,
        accent
      );

    const profile =
      profileImage();

    const bg =
      backgroundImage();

    const hoursMain =
      String(
        o.hours_status_text ||
        "Flexible hours"
      ).trim();

    const hoursSub =
      String(
        o.hours_sub_text ||
        "Request Only"
      ).trim();

    const category =
      String(
        p.category_name ||
        p.category ||
        "SHOP"
      ).trim();

    const owner =
      isOwner();

    const motionClass =
      motionOff()
        ? " motion-off"
        : (
            motionSubtle()
              ? " motion-subtle"
              : ""
          );

    const bgStyle =
      bg
        ? ' style="background-image:url(\''+esc(bg)+'\')"'
        : "";

    mount.innerHTML =
      '<section id="m7sp" class="'+(owner ? "is-owner" : "")+motionClass+'" ' +
        'style="--m7sp-accent:'+accent+';' +
        '--m7sp-accent-rgb:'+rgb.r+','+rgb.g+','+rgb.b+';' +
        '--m7sp-accent-light:'+mix(rgb,{r:255,g:255,b:255},.48)+';' +
        '--m7sp-accent-dark:'+mix(rgb,{r:0,g:0,b:0},.42)+';' +
        '--m7sp-name:'+nameColor+'">' +

        '<div class="m7sp-hero">' +
          '<div class="m7sp-bg '+(bg ? "has-image" : "")+'"'+bgStyle+'></div>' +

          '<div class="m7sp-top">' +
            '<button class="m7sp-icon-btn" id="m7sp-back" type="button" aria-label="Back">‹</button>' +
            '<div class="m7sp-hours"><i></i><span>'+esc(hoursMain)+' &nbsp;•&nbsp; '+esc(hoursSub)+'</span></div>' +
            '<button class="m7sp-icon-btn" id="m7sp-menu" type="button" aria-label="Share">•••</button>' +
          '</div>' +

          '<div class="m7sp-profile">' +
            '<div class="m7sp-ring"></div>' +
            '<button class="m7sp-story" id="m7sp-story" type="button" aria-label="Open story">' +
              (
                profile
                  ? '<img src="'+esc(profile)+'" alt="'+esc(p.shop_name || slug)+'">'
                  : '<span style="display:grid;place-items:center;width:100%;height:100%;font-size:44px;color:var(--m7sp-accent-light)">'+esc((p.shop_name || slug).charAt(0).toUpperCase())+'</span>'
              ) +
            '</button>' +
            (p.verified ? '<span class="m7sp-verified">✓</span>' : '') +
            '<button class="m7sp-add" id="m7sp-add" type="button" aria-label="Add story">+</button>' +
          '</div>' +

          '<h1 class="m7sp-name '+nameClass()+'">'+esc(p.shop_name || slug)+'</h1>' +
          '<div class="m7sp-handle">'+esc(normalizedHandle())+'</div>' +
          '<div class="m7sp-category">◇ '+esc(category)+'</div>' +
          '<div class="m7sp-tagline">'+esc(shortTagline())+'</div>' +
          '<div class="m7sp-signature">Beauty lives here</div>' +
        '</div>' +

        '<div class="m7sp-body">' +
          '<div class="m7sp-stats">' +
            '<div class="m7sp-stat"><b id="m7sp-followers">'+state.followers+'</b><span>Followers</span></div>' +
            '<div class="m7sp-stat"><b>'+state.gallery.length+'</b><span>Posts</span></div>' +
            '<div class="m7sp-stat"><b>'+state.videos.length+'</b><span>Reels</span></div>' +
          '</div>' +

          '<div class="m7sp-actions">' +
            '<button class="m7sp-action primary" id="m7sp-follow" type="button">'+
              (state.followed ? "✓ Following" : "＋ Follow")+
            '</button>' +
            '<button class="m7sp-action" id="m7sp-message" type="button">◌ Message</button>' +
            '<button class="m7sp-action icon" id="m7sp-share" type="button" aria-label="Share">↗</button>' +
          '</div>' +

          '<div class="m7sp-tabs">' +
            '<button class="m7sp-tab '+(state.mediaMode === "posts" ? "active" : "")+'" data-m7sp-tab="posts" type="button">▦ &nbsp; Posts</button>' +
            '<button class="m7sp-tab '+(state.mediaMode === "reels" ? "active" : "")+'" data-m7sp-tab="reels" type="button">▷ &nbsp; Reels</button>' +
          '</div>' +

          '<div class="m7sp-content" id="m7sp-content">'+mediaContent()+'</div>' +
          livePanelHtml() +
          '<div class="m7sp-footer">Modesty creates confidence</div>' +
        '</div>' +

        '<div id="m7sp-viewer">' +
          '<div class="m7sp-story-progress" id="m7sp-progress"></div>' +
          '<button class="m7sp-view-close" id="m7sp-view-close" type="button">×</button>' +
          '<div class="m7sp-view-stage" id="m7sp-view-stage"></div>' +
          '<div class="m7sp-story-tools">' +
            '<span>◉ <b id="m7sp-story-views">0</b></span>' +
            '<button id="m7sp-like-story" type="button">♡ Like</button>' +
            '<button class="m7sp-story-delete" id="m7sp-delete-story" type="button">Delete</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    bind();
  }

  async function loadFollow(){
    try{
      const id = visitorId();

      const result =
        await rpc(
          "get_shop_follow_state",
          {
            p_shop_slug:slug,
            p_visitor_id:id
          }
        );

      const row =
        Array.isArray(result)
          ? result[0]
          : result;

      state.followed =
        !!(
          row &&
          (
            row.following ??
            row.is_following ??
            row.followed
          )
        ) ||
        result === true;
    }catch(_){}

    try{
      const result =
        await rpc(
          "get_shop_follower_count",
          {
            p_shop_slug:slug
          }
        );

      let value =
        Array.isArray(result)
          ? result[0]
          : result;

      if(
        value &&
        typeof value === "object"
      ){
        value =
          value.count ??
          value.follower_count ??
          Object.values(value)[0];
      }

      state.followers =
        Number(value || 0);
    }catch(_){}
  }

  async function loadData(){
    const encoded =
      encodeURIComponent(slug);

    const now =
      encodeURIComponent(
        new Date().toISOString()
      );

    const queries =
      await Promise.allSettled([
        rest(
          "shop_profiles?select=*&shop_slug=eq."+
          encoded+
          "&limit=1"
        ),
        rest(
          "shop_gallery?select=*&shop_slug=eq."+
          encoded+
          "&order=sort_order.asc"
        ),
        rest(
          "shop_videos?select=*&shop_slug=eq."+
          encoded+
          "&order=sort_order.asc"
        ),
        rest(
          "shop_reels?select=*&shop_slug=eq."+
          encoded+
          "&active=eq.true&order=sort_order.asc"
        ),
        rest(
          "shop_stories?select=*&shop_slug=eq."+
          encoded+
          "&expires_at=gt."+
          now+
          "&order=created_at.asc"
        ),
        rest(
          "shop_live_posts?select=*&shop_slug=eq."+
          encoded+
          "&status=eq.active&ends_at=gt."+
          now+
          "&order=starts_at.desc"
        )
      ]);

    const value =
      index =>
        queries[index].status === "fulfilled"
          ? queries[index].value
          : [];

    state.profile =
      value(0)[0] ||
      null;

    state.gallery =
      value(1) || [];

    state.videos =
      []
        .concat(value(2) || [])
        .concat(value(3) || []);

    state.stories =
      value(4) || [];

    state.live =
      value(5) || [];

    if(state.live.length){
      const first =
        state.live[0];

      if(
        first &&
        first.id &&
        !String(first.media_url || "").trim()
      ){
        try{
          const media =
            await rest(
              "shop_live_post_media?select=*&post_id=eq."+
              encodeURIComponent(first.id)+
              "&order=is_cover.desc,sort_order.asc&limit=1"
            );

          if(media && media[0]){
            first.media_url =
              media[0].media_url ||
              "";

            first.media_type =
              media[0].media_type ||
              "image";
          }
        }catch(_){}
      }
    }

    await loadFollow();
  }

  async function toggleFollow(){
    if(isOwner()){
      alert("You cannot follow your own shop.");
      return;
    }

    const previous =
      state.followed;

    state.followed =
      !state.followed;

    state.followers =
      Math.max(
        0,
        state.followers +
        (state.followed ? 1 : -1)
      );

    render();

    try{
      await rpc(
        state.followed
          ? "follow_shop"
          : "unfollow_shop",
        {
          p_shop_slug:slug,
          p_visitor_id:visitorId()
        }
      );

      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:follow-change",
          {
            detail:{
              shop_slug:slug,
              following:state.followed,
              notifications:state.followed
            }
          }
        )
      );
    }
    catch(_){
      state.followed =
        previous;

      state.followers =
        Math.max(
          0,
          state.followers +
          (state.followed ? 1 : -1)
        );

      render();
    }
  }

  function openMessage(){
    if(
      window.Ma7alakChat &&
      typeof window.Ma7alakChat.openShop === "function"
    ){
      window.Ma7alakChat.openShop(slug);
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "ma7alak:open-chat",
        {
          detail:{
            shop_slug:slug
          }
        }
      )
    );
  }

  async function share(){
    const data = {
      title:
        state.profile &&
        state.profile.shop_name
          ? state.profile.shop_name
          : "Ma7alak shop",
      text:"Check this shop on Ma7alak",
      url:location.href
    };

    if(navigator.share){
      try{
        await navigator.share(data);
        return;
      }catch(_){}
    }

    try{
      await navigator.clipboard.writeText(location.href);
      alert("Shop link copied.");
    }catch(_){}
  }

  function openViewer(html){
    const viewer =
      document.getElementById(
        "m7sp-viewer"
      );

    const stage =
      document.getElementById(
        "m7sp-view-stage"
      );

    if(!viewer || !stage){
      return;
    }

    stage.innerHTML =
      html;

    viewer.classList.add("open");

    document.documentElement.style.overflow =
      "hidden";
  }

  function closeViewer(){
    clearTimeout(
      state.storyTimer
    );

    const viewer =
      document.getElementById(
        "m7sp-viewer"
      );

    const stage =
      document.getElementById(
        "m7sp-view-stage"
      );

    if(stage){
      const video =
        stage.querySelector("video");

      if(video){
        video.pause();
      }

      stage.innerHTML = "";
    }

    viewer?.classList.remove("open");

    document.documentElement.style.overflow =
      "";
  }

  async function openStory(index){
    if(!state.stories.length){
      if(isOwner()){
        window.postMessage(
          {
            type:"MA7ALAK_OPEN_STORY_UPLOADER",
            shopSlug:slug
          },
          "*"
        );
      }
      return;
    }

    state.storyIndex =
      Math.max(
        0,
        Math.min(
          Number(index || 0),
          state.stories.length - 1
        )
      );

    paintStory();
  }

  async function paintStory(){
    clearTimeout(
      state.storyTimer
    );

    const row =
      state.stories[
        state.storyIndex
      ];

    if(!row){
      closeViewer();
      return;
    }

    const url =
      storyUrl(row);

    if(!url){
      return;
    }

    const isVideo =
      String(
        row.media_type || ""
      ).toLowerCase() === "video";

    openViewer(
      isVideo
        ? '<video src="'+esc(url)+'" autoplay playsinline></video>'
        : '<img src="'+esc(url)+'" alt="">'
    );

    const progress =
      document.getElementById(
        "m7sp-progress"
      );

    if(progress){
      progress.innerHTML =
        state.stories
          .map(
            (_,i)=>
              '<i><b style="width:'+
              (i < state.storyIndex ? "100" : "0")+
              '%"></b></i>'
          )
          .join("");

      const active =
        progress.children[
          state.storyIndex
        ]?.firstElementChild;

      if(active){
        requestAnimationFrame(()=>{
          active.style.transition =
            "width 6s linear";

          active.style.width =
            "100%";
        });
      }
    }

    state.storyTimer =
      window.setTimeout(
        ()=>{
          if(
            state.storyIndex <
            state.stories.length - 1
          ){
            state.storyIndex++;
            paintStory();
          }
          else{
            closeViewer();
          }
        },
        6000
      );

    try{
      await rpc(
        "record_story_view",
        {
          p_story_id:row.id,
          p_shop_slug:slug,
          p_visitor_id:visitorId()
        }
      );

      const count =
        await rpc(
          "get_story_view_count",
          {
            p_story_id:row.id,
            p_shop_slug:slug
          }
        );

      let number =
        Array.isArray(count)
          ? count[0]
          : count;

      if(
        number &&
        typeof number === "object"
      ){
        number =
          number.view_count ??
          number.count ??
          Object.values(number)[0];
      }

      const el =
        document.getElementById(
          "m7sp-story-views"
        );

      if(el){
        el.textContent =
          Number(number || 0);
      }
    }catch(_){}
  }

  async function likeStory(){
    const row =
      state.stories[
        state.storyIndex
      ];

    if(!row){
      return;
    }

    const button =
      document.getElementById(
        "m7sp-like-story"
      );

    if(button){
      button.disabled = true;
    }

    try{
      await rpc(
        "like_story",
        {
          p_story_id:row.id,
          p_visitor_id:visitorId()
        }
      );

      if(button){
        button.textContent =
          "♥ Liked";
      }
    }
    catch(_){
      if(button){
        button.textContent =
          "Could not like";
      }
    }
    finally{
      if(button){
        button.disabled = false;
      }
    }
  }

  async function deleteStory(){
    const row =
      state.stories[
        state.storyIndex
      ];

    if(
      !row ||
      !isOwner() ||
      !confirm("Delete this Story?")
    ){
      return;
    }

    try{
      const response =
        await fetch(
          SB_URL +
          "/rest/v1/shop_stories?id=eq."+
          encodeURIComponent(row.id)+
          "&shop_slug=eq."+
          encodeURIComponent(slug),
          {
            method:"DELETE",
            headers:headers({
              "Prefer":"return=minimal"
            })
          }
        );

      if(!response.ok){
        throw new Error("Delete failed");
      }

      state.stories.splice(
        state.storyIndex,
        1
      );

      closeViewer();
      render();
    }catch(error){
      alert(
        error.message ||
        "Could not delete Story."
      );
    }
  }

  function openPost(index){
    const row =
      state.gallery[index];

    const url =
      mediaImage(row);

    if(url){
      openViewer(
        '<img src="'+esc(url)+'" alt="">'
      );
    }
  }

  function openReel(index){
    const row =
      state.videos[index];

    const url =
      mediaVideo(row);

    if(url){
      openViewer(
        '<video src="'+esc(url)+'" autoplay controls playsinline></video>'
      );
    }
  }

  function switchTab(mode){
    state.mediaMode =
      mode === "reels"
        ? "reels"
        : "posts";

    render();
  }

  function bind(){
    document
      .getElementById("m7sp-back")
      ?.addEventListener(
        "click",
        ()=>history.length > 1
          ? history.back()
          : location.assign("/")
      );

    document
      .getElementById("m7sp-menu")
      ?.addEventListener(
        "click",
        share
      );

    document
      .getElementById("m7sp-share")
      ?.addEventListener(
        "click",
        share
      );

    document
      .getElementById("m7sp-follow")
      ?.addEventListener(
        "click",
        toggleFollow
      );

    document
      .getElementById("m7sp-notify")
      ?.addEventListener(
        "click",
        ()=>{
          if(!state.followed){
            toggleFollow();
          }
        }
      );

    document
      .getElementById("m7sp-live-open")
      ?.addEventListener(
        "click",
        event=>{
          const id =
            event.currentTarget?.getAttribute(
              "data-live-id"
            );

          if(
            id &&
            window.Ma7alakLiveOffers &&
            typeof window.Ma7alakLiveOffers.open === "function"
          ){
            window.Ma7alakLiveOffers.open(id);
          }
        }
      );

    document
      .getElementById("m7sp-live-manage")
      ?.addEventListener(
        "click",
        ()=>{
          if(
            window.Ma7alakLiveOffers &&
            typeof window.Ma7alakLiveOffers.create === "function"
          ){
            window.Ma7alakLiveOffers.create();
          }
          else{
            window.postMessage(
              {
                type:"MA7ALAK_LIVE_OFFERS_CREATE",
                shopSlug:slug
              },
              "*"
            );
          }
        }
      );

    document
      .getElementById("m7sp-message")
      ?.addEventListener(
        "click",
        openMessage
      );

    document
      .getElementById("m7sp-story")
      ?.addEventListener(
        "click",
        ()=>openStory(0)
      );

    document
      .getElementById("m7sp-add")
      ?.addEventListener(
        "click",
        ()=>{
          window.postMessage(
            {
              type:"MA7ALAK_OPEN_STORY_UPLOADER",
              shopSlug:slug
            },
            "*"
          );
        }
      );

    document
      .querySelectorAll(
        "[data-m7sp-tab]"
      )
      .forEach(button=>{
        button.addEventListener(
          "click",
          ()=>switchTab(
            button.dataset.m7spTab
          )
        );
      });

    document
      .querySelectorAll(
        "[data-m7sp-post]"
      )
      .forEach(button=>{
        button.addEventListener(
          "click",
          ()=>openPost(
            Number(
              button.dataset.m7spPost
            )
          )
        );
      });

    document
      .querySelectorAll(
        "[data-m7sp-reel]"
      )
      .forEach(button=>{
        button.addEventListener(
          "click",
          ()=>openReel(
            Number(
              button.dataset.m7spReel
            )
          )
        );
      });

    document
      .getElementById("m7sp-view-close")
      ?.addEventListener(
        "click",
        closeViewer
      );

    document
      .getElementById("m7sp-like-story")
      ?.addEventListener(
        "click",
        likeStory
      );

    document
      .getElementById("m7sp-delete-story")
      ?.addEventListener(
        "click",
        deleteStory
      );
  }

  async function refresh(){
    try{
      await loadData();

      if(state.profile){
        render();
      }
    }
    catch(error){
      console.warn(
        "[Ma7alak Social Profile]",
        error
      );
    }
  }

  window.addEventListener(
    "ma7alak:owner-auth-change",
    ()=>{
      if(state.profile){
        render();
      }
    }
  );

  window.addEventListener(
    "message",
    event=>{
      const data =
        event.data;

      if(
        data &&
        data.type ===
          "MA7ALAK_STORY_UPDATED" &&
        String(
          data.shopSlug || ""
        ).toLowerCase() === slug
      ){
        refresh();
      }
    }
  );

  refresh();

  window.setInterval(
    refresh,
    12000
  );

})();
