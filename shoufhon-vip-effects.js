/* =========================================================
   SHOUFHON VIP EFFECTS V1

   Optional visual extension for the existing one-slug profile.
   It never creates a second Story engine, fetches Story rows, or
   changes uploads/likes. It only decorates the existing profile circle
   from per-shop directory_options supplied by Ma7alakProfileShell.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_VIP_EFFECTS_V1__)return;
  window.__SHOUFHON_VIP_EFFECTS_V1__=true;

  const STYLE_ID="shoufhon-vip-effects-v1-css";
  const LAYER_CLASS="m7vip-story-fx";
  const ALLOWED_RING=new Set(["aurora","double","neon","segments","pearls","classic"]);
  const ALLOWED_PARTICLES=new Set(["sparkles","stars","petals","bubbles","hearts","dots","none"]);
  const PARTICLE_SYMBOLS={sparkles:"✦",stars:"★",petals:"❋",bubbles:"○",hearts:"♥",dots:"•"};

  let shell=null;
  let wrapper=null;
  let button=null;
  let layer=null;
  let frameLayer=null;
  let ogLayer=null;
  let categoryIconOriginal=null;
  let options={};
  let resizeObserver=null;
  let storyObserver=null;
  let intersectionObserver=null;
  let visible=true;
  let bootTimer=0;

  function clamp(value,min,max,fallback){
    const n=Number(value);
    return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
  }

  function bool(value,fallback){
    if(value===undefined||value===null||value==="")return fallback;
    if(value===true||String(value).toLowerCase()==="true")return true;
    if(value===false||String(value).toLowerCase()==="false")return false;
    return fallback;
  }

  function hex(value,fallback){
    const v=String(value||"").trim();
    return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;
  }

  function choice(value,allowed,fallback){
    const v=String(value||"").trim().toLowerCase();
    return allowed.has(v)?v:fallback;
  }

  function safeUrl(value){
    const v=String(value||"").trim();
    return /^https:\/\//i.test(v)?v:"";
  }

  function slug(){
    const raw=String(
      shell?.getAttribute("data-shop-slug")||
      window.Ma7alakProfileShell?.slug||
      window.ShoufHonShopContextClient?.slug||
      ""
    ).trim().toLowerCase();
    return raw.replace(/^\/+|\/+$/g,"");
  }

  function cachedOptions(){
    try{
      const direct=window.Ma7alakProfileShell?.getCachedOptions?.();
      if(direct&&typeof direct==="object"&&!Array.isArray(direct))return direct;
    }catch(_){}
    try{
      const s=slug();
      if(!s)return null;
      const parsed=JSON.parse(localStorage.getItem("ma7alak_profile_theme_v1:"+s)||"null");
      return parsed&&typeof parsed==="object"&&!Array.isArray(parsed)?parsed:null;
    }catch(_){return null;}
  }

  function installCss(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .${LAYER_CLASS}{
        --m7vip-c1:#f2caed;
        --m7vip-c2:#d9a441;
        --m7vip-c3:#fff;
        --m7vip-particle:#f2caed;
        --m7vip-size:220px;
        --m7vip-width:4px;
        --m7vip-speed:5s;
        --m7vip-particle-speed:4.5s;
        --m7vip-orbit-distance:12px;
        --m7vip-orbit-size:18px;
        position:absolute!important;
        left:50%!important;
        top:50%!important;
        width:var(--m7vip-size)!important;
        height:var(--m7vip-size)!important;
        transform:translate(-50%,-50%) translateZ(0)!important;
        z-index:6!important;
        border-radius:50%!important;
        pointer-events:none!important;
        opacity:0!important;
        visibility:hidden!important;
        transition:opacity .22s ease!important;
        contain:layout style!important;
      }
      .${LAYER_CLASS}[data-active="1"]{opacity:1!important;visibility:visible!important}
      .${LAYER_CLASS}[data-paused="1"] *,
      #ma7alak-profile-shell[data-motion-mode="off"] .${LAYER_CLASS} *{
        animation-play-state:paused!important;
        -webkit-animation-play-state:paused!important;
      }
      .m7vip-ring,.m7vip-ring::before,.m7vip-ring::after{
        position:absolute!important;
        inset:0!important;
        border-radius:50%!important;
        box-sizing:border-box!important;
        pointer-events:none!important;
      }
      .m7vip-ring::before,.m7vip-ring::after{content:""!important}
      .m7vip-ring::before{
        padding:var(--m7vip-width)!important;
        background:conic-gradient(from 0deg,var(--m7vip-c1),var(--m7vip-c3) 14%,var(--m7vip-c2) 32%,transparent 44%,var(--m7vip-c1) 63%,var(--m7vip-c3) 78%,var(--m7vip-c2))!important;
        -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)!important;
        -webkit-mask-composite:xor!important;
        mask-composite:exclude!important;
        animation:m7vip-spin var(--m7vip-speed) linear infinite!important;
      }
      .${LAYER_CLASS}[data-ring="classic"] .m7vip-ring::before{
        background:none!important;
        border:var(--m7vip-width) solid var(--m7vip-c1)!important;
        -webkit-mask:none!important;mask:none!important;animation:none!important;
      }
      .${LAYER_CLASS}[data-ring="double"] .m7vip-ring::before{
        inset:-3px!important;
        background:none!important;
        border:var(--m7vip-width) solid var(--m7vip-c1)!important;
        -webkit-mask:none!important;mask:none!important;
        box-shadow:inset 0 0 0 2px rgba(0,0,0,.8),inset 0 0 0 4px var(--m7vip-c2),0 0 15px color-mix(in srgb,var(--m7vip-c1) 52%,transparent)!important;
        animation:m7vip-breathe calc(var(--m7vip-speed) * .65) ease-in-out infinite!important;
      }
      .${LAYER_CLASS}[data-ring="neon"] .m7vip-ring::before{
        background:none!important;
        border:var(--m7vip-width) solid var(--m7vip-c1)!important;
        -webkit-mask:none!important;mask:none!important;
        box-shadow:0 0 5px var(--m7vip-c3),0 0 13px var(--m7vip-c1),0 0 27px var(--m7vip-c2),inset 0 0 10px var(--m7vip-c1)!important;
        animation:m7vip-neon calc(var(--m7vip-speed) * .55) ease-in-out infinite!important;
      }
      .${LAYER_CLASS}[data-ring="segments"] .m7vip-ring::before{
        background:repeating-conic-gradient(from 0deg,var(--m7vip-c1) 0 9deg,transparent 9deg 17deg,var(--m7vip-c2) 17deg 24deg,transparent 24deg 34deg)!important;
      }
      .${LAYER_CLASS}[data-ring="pearls"] .m7vip-ring::before{
        padding:0!important;
        background:repeating-conic-gradient(from 0deg,var(--m7vip-c3) 0 3deg,transparent 3deg 14deg)!important;
        -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--m7vip-width) - 2px),#000 calc(100% - var(--m7vip-width)),#000 99%,transparent 100%)!important;
        mask:radial-gradient(farthest-side,transparent calc(100% - var(--m7vip-width) - 2px),#000 calc(100% - var(--m7vip-width)),#000 99%,transparent 100%)!important;
      }
      .m7vip-ring::after{
        inset:-6px!important;
        border:1px solid color-mix(in srgb,var(--m7vip-c1) 32%,transparent)!important;
        box-shadow:0 0 18px color-mix(in srgb,var(--m7vip-c2) 30%,transparent)!important;
        animation:m7vip-breathe calc(var(--m7vip-speed) * .72) ease-in-out infinite!important;
      }
      .m7vip-orbit,.m7vip-particles{position:absolute!important;inset:0!important;border-radius:50%!important;pointer-events:none!important}
      .m7vip-orbit-item{position:absolute!important;inset:0!important;animation:m7vip-orbit var(--m7vip-speed) linear infinite!important;animation-delay:var(--m7vip-delay,0s)!important}
      .${LAYER_CLASS}[data-direction="counter"] .m7vip-orbit-item{animation-direction:reverse!important}
      .m7vip-orbit-icon{
        position:absolute!important;
        left:50%!important;
        top:calc(0px - var(--m7vip-orbit-distance))!important;
        width:var(--m7vip-orbit-size)!important;
        height:var(--m7vip-orbit-size)!important;
        margin-left:calc(var(--m7vip-orbit-size) / -2)!important;
        display:grid!important;
        place-items:center!important;
        color:var(--m7vip-c3)!important;
        font-size:calc(var(--m7vip-orbit-size) * .78)!important;
        line-height:1!important;
        filter:drop-shadow(0 0 5px var(--m7vip-c1))!important;
        animation:m7vip-counter var(--m7vip-speed) linear infinite!important;
      }
      .${LAYER_CLASS}[data-direction="counter"] .m7vip-orbit-icon{animation-direction:reverse!important}
      .m7vip-orbit-icon img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;filter:drop-shadow(0 2px 4px rgba(0,0,0,.55))!important}
      .m7vip-particle{position:absolute!important;left:var(--m7vip-x)!important;top:var(--m7vip-y)!important;color:var(--m7vip-particle)!important;font-size:var(--m7vip-particle-size)!important;line-height:1!important;text-shadow:0 0 8px currentColor!important;opacity:0!important;animation:m7vip-float var(--m7vip-particle-speed) ease-in-out infinite!important;animation-delay:var(--m7vip-delay)!important}
      .${LAYER_CLASS}[data-particle="petals"] .m7vip-particle{transform:rotate(var(--m7vip-turn))}
      .${LAYER_CLASS}[data-quality="light"] .m7vip-particles{display:none!important}
      .${LAYER_CLASS}[data-quality="light"] .m7vip-ring::after{display:none!important}

      .m7og-badge{--m7og-primary:#d9a441;--m7og-secondary:#fff2a4;--m7og-bg:#160e06;--m7og-text:#fff0b8;--m7og-size:30px;--m7og-font:8.7px;--m7og-speed:2.8s;--m7og-glow:13px;position:absolute!important;right:-8px!important;bottom:-4px!important;z-index:28!important;width:var(--m7og-size)!important;height:var(--m7og-size)!important;display:grid!important;place-items:center!important;padding:0!important;border:0!important;border-radius:50%!important;pointer-events:none!important;filter:drop-shadow(0 4px 7px rgba(0,0,0,.72))!important}
      .m7og-badge.has-verified{bottom:calc(var(--m7og-size) * .72)!important}
      .m7og-core{position:relative!important;width:100%!important;height:100%!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:0!important;overflow:hidden!important;border:2px solid var(--m7og-secondary)!important;border-radius:50%!important;box-sizing:border-box!important;color:var(--m7og-text)!important;background:radial-gradient(circle at 34% 23%,color-mix(in srgb,var(--m7og-primary) 27%,var(--m7og-bg)),var(--m7og-bg) 64%)!important;box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--m7og-primary) 82%,transparent),0 0 var(--m7og-glow) color-mix(in srgb,var(--m7og-primary) 74%,transparent)!important;font-family:Arial,sans-serif!important;line-height:1!important;isolation:isolate!important;will-change:transform,filter,box-shadow!important}
      .m7og-core small{position:relative!important;z-index:1!important;height:calc(var(--m7og-size) * .25)!important;margin-top:calc(var(--m7og-size) * -.07)!important;color:var(--m7og-primary)!important;font-size:calc(var(--m7og-size) * .25)!important;line-height:1!important;text-shadow:0 0 7px currentColor!important}
      .m7og-core b{position:relative!important;z-index:1!important;display:block!important;max-width:88%!important;overflow:hidden!important;color:var(--m7og-text)!important;font-size:var(--m7og-font)!important;font-weight:950!important;letter-spacing:-.3px!important;line-height:1.05!important;text-overflow:clip!important;white-space:nowrap!important;text-shadow:0 1px 3px rgba(0,0,0,.9)!important}
      .m7og-core::after{content:""!important;position:absolute!important;inset:-38%!important;z-index:0!important;background:linear-gradient(105deg,transparent 38%,color-mix(in srgb,var(--m7og-secondary) 72%,transparent) 49%,transparent 60%)!important;transform:translateX(-72%) rotate(8deg)}
      .m7og-badge[data-animation="shimmer"] .m7og-core::after{animation:m7og-shimmer var(--m7og-speed) ease-in-out infinite!important}
      .m7og-badge[data-animation="breathe"] .m7og-core{animation:m7og-breathe var(--m7og-speed) ease-in-out infinite!important}
      .m7og-badge[data-animation="float"] .m7og-core{animation:m7og-float var(--m7og-speed) ease-in-out infinite!important}
      .m7og-badge[data-animation="pulse"] .m7og-core{animation:m7og-pulse var(--m7og-speed) ease-in-out infinite!important}
      .m7og-badge[data-animation="sparkle"] .m7og-core{animation:m7og-sparkle var(--m7og-speed) steps(2,end) infinite!important}
      #ma7alak-profile-shell.m7vip-paused .m7og-core,#ma7alak-profile-shell.m7vip-paused .m7og-core::after,#ma7alak-profile-shell[data-motion-mode="off"] .m7og-core,#ma7alak-profile-shell[data-motion-mode="off"] .m7og-core::after{animation-play-state:paused!important;-webkit-animation-play-state:paused!important}

      #ma7alak-profile-shell.m7vip-brand-enabled #ma7alak-shop-name{
        position:relative!important;
        display:inline-block!important;
        max-width:100%!important;
        letter-spacing:var(--m7vip-name-spacing,0px)!important;
        -webkit-text-stroke:var(--m7vip-name-outline-width,0px) var(--m7vip-name-outline,#100d0b)!important;
        paint-order:stroke fill!important;
        text-shadow:0 2px 7px rgba(0,0,0,.48),0 0 var(--m7vip-name-shadow,16px) color-mix(in srgb,var(--m7vip-name-c1) 72%,transparent)!important;
        animation-duration:var(--m7vip-name-speed,3.2s)!important;
        animation-iteration-count:infinite!important;
        animation-timing-function:ease-in-out!important;
        will-change:transform,filter,background-position!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="gradient"] #ma7alak-shop-name,
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="glass"] #ma7alak-shop-name{
        color:transparent!important;
        background:linear-gradient(var(--m7vip-name-angle,110deg),var(--m7vip-name-c1),var(--m7vip-name-c3) 42%,var(--m7vip-name-c2) 72%,var(--m7vip-name-c1))!important;
        background-size:240% 100%!important;
        -webkit-background-clip:text!important;
        background-clip:text!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="gold"] #ma7alak-shop-name{
        color:transparent!important;
        background:linear-gradient(var(--m7vip-name-angle,110deg),#75450e,var(--m7vip-name-c2) 25%,#fff1a8 46%,var(--m7vip-name-c1) 64%,#6a3b08)!important;
        background-size:220% 100%!important;
        -webkit-background-clip:text!important;background-clip:text!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="chrome"] #ma7alak-shop-name{
        color:transparent!important;
        background:linear-gradient(180deg,var(--m7vip-name-c3) 0 18%,var(--m7vip-name-c1) 34%,#4a4a4a 49%,var(--m7vip-name-c3) 58%,var(--m7vip-name-c2) 82%,#222 100%)!important;
        -webkit-background-clip:text!important;background-clip:text!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="neon"] #ma7alak-shop-name{
        color:var(--m7vip-name-c1)!important;background:none!important;
        text-shadow:0 0 3px var(--m7vip-name-c3),0 0 calc(var(--m7vip-name-shadow,16px) * .55) var(--m7vip-name-c1),0 0 var(--m7vip-name-shadow,16px) var(--m7vip-name-c2)!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="outline"] #ma7alak-shop-name{
        color:transparent!important;background:none!important;
        -webkit-text-stroke:max(1px,var(--m7vip-name-outline-width,1px)) var(--m7vip-name-c1)!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-style="solid"] #ma7alak-shop-name{color:var(--m7vip-name-c1)!important;background:none!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-animation="shimmer"] #ma7alak-shop-name,
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-animation="gradient-flow"] #ma7alak-shop-name{animation-name:m7vip-name-flow!important;animation-timing-function:linear!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-animation="neon-pulse"] #ma7alak-shop-name{animation-name:m7vip-name-neon!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-animation="float"] #ma7alak-shop-name{animation-name:m7vip-name-float!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-animation="pulse"] #ma7alak-shop-name{animation-name:m7vip-name-pulse!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-name-animation="none"] #ma7alak-shop-name{animation:none!important}

      #ma7alak-profile-shell.m7vip-brand-enabled #ma7alak-shop-identity-category-row{
        width:max-content!important;
        max-width:calc(100% - 20px)!important;
        margin-left:auto!important;margin-right:auto!important;
        color:var(--m7vip-category-text,#fff)!important;
        border:1px solid var(--m7vip-category-border,#f2caed)!important;
        background:color-mix(in srgb,var(--m7vip-category-bg,#171217) 88%,transparent)!important;
        box-shadow:0 6px 18px rgba(0,0,0,.24),0 0 13px color-mix(in srgb,var(--m7vip-category-border) 24%,transparent)!important;
        animation-duration:var(--m7vip-category-speed)!important;
        animation-iteration-count:infinite!important;
        animation-timing-function:ease-in-out!important;
        overflow:hidden!important;
        isolation:isolate!important;
      }
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-style="pill"] #ma7alak-shop-identity-category-row{padding:7px 14px!important;border-radius:999px!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-style="glass"] #ma7alak-shop-identity-category-row{padding:7px 14px!important;border-radius:999px!important;backdrop-filter:blur(10px) saturate(135%)!important;-webkit-backdrop-filter:blur(10px) saturate(135%)!important;background:linear-gradient(135deg,color-mix(in srgb,var(--m7vip-category-bg) 82%,transparent),rgba(255,255,255,.055))!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-style="ribbon"] #ma7alak-shop-identity-category-row{padding:7px 20px!important;border-radius:5px!important;clip-path:polygon(7% 0,93% 0,100% 50%,93% 100%,7% 100%,0 50%)}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-style="seal"] #ma7alak-shop-identity-category-row{padding:8px 13px!important;border-radius:14px 4px 14px 4px!important;border-width:2px!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-style="neon"] #ma7alak-shop-identity-category-row{padding:7px 14px!important;border-radius:999px!important;box-shadow:0 0 4px var(--m7vip-category-border),0 0 15px var(--m7vip-category-border),inset 0 0 9px color-mix(in srgb,var(--m7vip-category-border) 40%,transparent)!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-style="minimal"] #ma7alak-shop-identity-category-row{padding:5px 8px!important;border-width:0 0 1px!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
      #ma7alak-profile-shell.m7vip-brand-enabled #ma7alak-shop-category-text{color:var(--m7vip-category-text,#fff)!important}
      #ma7alak-profile-shell.m7vip-brand-enabled #ma7alak-shop-category-icon{color:var(--m7vip-category-icon,#d9a441)!important}
      #ma7alak-profile-shell.m7vip-brand-enabled #ma7alak-shop-category-icon img{display:block!important;width:1.35em!important;height:1.35em!important;object-fit:contain!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-animation="float"] #ma7alak-shop-identity-category-row{animation-name:m7vip-category-float!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-animation="pulse"] #ma7alak-shop-identity-category-row{animation-name:m7vip-category-pulse!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-animation="glow"] #ma7alak-shop-identity-category-row{animation-name:m7vip-category-glow!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-animation="shimmer"] #ma7alak-shop-identity-category-row{animation-name:m7vip-category-shimmer!important;background:linear-gradient(110deg,var(--m7vip-category-bg) 0 38%,color-mix(in srgb,var(--m7vip-category-border) 34%,var(--m7vip-category-bg)) 50%,var(--m7vip-category-bg) 62% 100%)!important;background-size:240% 100%!important}
      #ma7alak-profile-shell.m7vip-brand-enabled[data-vip-category-animation="none"] #ma7alak-shop-identity-category-row{animation:none!important}

      .m7vip-shell-frame{--m7vip-frame-c1:#f2caed;--m7vip-frame-c2:#d9a441;--m7vip-frame-c3:#fff;--m7vip-frame-c4:#8a2cff;--m7vip-frame-width:2px;--m7vip-frame-gap:3px;--m7vip-frame-speed:5s;--m7vip-frame-glow:16px;position:absolute!important;inset:0!important;z-index:40!important;border-radius:inherit!important;pointer-events:none!important;overflow:visible!important}
      .m7vip-frame-layer{position:absolute!important;inset:var(--m7vip-frame-inset,0px)!important;border:var(--m7vip-frame-width) solid var(--m7vip-frame-color)!important;border-radius:max(5px,calc(var(--m7-profile-shell-radius,30px) - var(--m7vip-frame-radius-cut,0px)))!important;box-sizing:border-box!important;opacity:var(--m7vip-frame-opacity,1)!important}
      .m7vip-shell-frame[data-style="gradient"] .m7vip-frame-layer,.m7vip-shell-frame[data-style="glass"] .m7vip-frame-layer,.m7vip-shell-frame[data-style="metallic"] .m7vip-frame-layer{border:0!important;padding:var(--m7vip-frame-width)!important;background:linear-gradient(var(--m7vip-frame-angle,120deg),var(--m7vip-frame-c1),var(--m7vip-frame-c3),var(--m7vip-frame-c2),var(--m7vip-frame-c4),var(--m7vip-frame-c1))!important;background-size:300% 300%!important;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)!important;-webkit-mask-composite:xor!important;mask-composite:exclude!important}
      .m7vip-shell-frame[data-style="neon"] .m7vip-frame-layer{box-shadow:0 0 calc(var(--m7vip-frame-glow) * .4) var(--m7vip-frame-color),inset 0 0 calc(var(--m7vip-frame-glow) * .3) var(--m7vip-frame-color)!important}
      .m7vip-shell-frame[data-style="segments"] .m7vip-frame-layer{border-style:dashed!important}
      .m7vip-shell-frame[data-animation="flow"] .m7vip-frame-layer,.m7vip-shell-frame[data-animation="shimmer"] .m7vip-frame-layer{animation:m7vip-frame-flow var(--m7vip-frame-speed) linear infinite!important}
      .m7vip-shell-frame[data-animation="breathe"] .m7vip-frame-layer{animation:m7vip-frame-breathe var(--m7vip-frame-speed) ease-in-out infinite!important}
      .m7vip-shell-frame[data-animation="comet"] .m7vip-frame-layer{animation:m7vip-frame-comet var(--m7vip-frame-speed) ease-in-out infinite!important;animation-delay:calc(var(--m7vip-frame-index) * -.35s)!important}
      .m7vip-corner{position:absolute!important;width:var(--m7vip-corner-size,20px)!important;height:var(--m7vip-corner-size,20px)!important;display:grid!important;place-items:center!important;color:var(--m7vip-frame-c1)!important;font-size:calc(var(--m7vip-corner-size,20px) * .75)!important;line-height:1!important;text-shadow:0 0 8px currentColor!important;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))!important}
      .m7vip-corner img{width:100%!important;height:100%!important;display:block!important;object-fit:contain!important}
      .m7vip-corner[data-corner="tl"]{left:5px;top:5px}.m7vip-corner[data-corner="tr"]{right:5px;top:5px}.m7vip-corner[data-corner="bl"]{left:5px;bottom:5px}.m7vip-corner[data-corner="br"]{right:5px;bottom:5px}
      .m7vip-shell-frame[data-corner-animation="float"] .m7vip-corner{animation:m7vip-corner-float 3s ease-in-out infinite!important}.m7vip-shell-frame[data-corner-animation="pulse"] .m7vip-corner{animation:m7vip-corner-pulse 2.4s ease-in-out infinite!important}.m7vip-shell-frame[data-corner-animation="spin"] .m7vip-corner{animation:m7vip-corner-spin 6s linear infinite!important}
      #ma7alak-profile-shell.m7vip-paused #ma7alak-shop-name,#ma7alak-profile-shell.m7vip-paused #ma7alak-shop-identity-category-row,#ma7alak-profile-shell.m7vip-paused .m7vip-shell-frame *{animation-play-state:paused!important;-webkit-animation-play-state:paused!important}
      @keyframes m7vip-spin{to{transform:rotate(360deg)}}
      @keyframes m7vip-orbit{to{transform:rotate(360deg)}}
      @keyframes m7vip-counter{to{transform:rotate(-360deg)}}
      @keyframes m7vip-breathe{0%,100%{opacity:.48;transform:scale(.992)}50%{opacity:1;transform:scale(1.018)}}
      @keyframes m7vip-neon{0%,100%{opacity:.72;filter:brightness(.9)}50%{opacity:1;filter:brightness(1.28)}}
      @keyframes m7vip-float{0%{opacity:0;transform:translate3d(0,8px,0) scale(.65)}24%{opacity:.95}70%{opacity:.72}100%{opacity:0;transform:translate3d(var(--m7vip-drift),-25px,0) scale(1.12) rotate(24deg)}}
      @keyframes m7vip-name-flow{0%{background-position:180% 50%}100%{background-position:-80% 50%}}
      @keyframes m7vip-name-neon{0%,100%{filter:brightness(.88)}50%{filter:brightness(1.34)}}
      @keyframes m7vip-name-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes m7vip-name-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
      @keyframes m7vip-category-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
      @keyframes m7vip-category-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
      @keyframes m7vip-category-glow{0%,100%{filter:brightness(.9)}50%{filter:brightness(1.24);box-shadow:0 0 18px var(--m7vip-category-border)}}
      @keyframes m7vip-category-shimmer{0%{background-position:160% 50%}100%{background-position:-60% 50%}}
      @keyframes m7vip-frame-flow{0%{background-position:0 50%;filter:hue-rotate(0deg)}50%{background-position:100% 50%;filter:brightness(1.2)}100%{background-position:0 50%;filter:hue-rotate(0deg)}}
      @keyframes m7vip-frame-breathe{0%,100%{filter:brightness(.82);opacity:.58}50%{filter:brightness(1.3);opacity:1}}
      @keyframes m7vip-frame-comet{0%,100%{opacity:.28;filter:brightness(.8)}45%,58%{opacity:1;filter:brightness(1.5)}}
      @keyframes m7vip-corner-float{0%,100%{margin-top:0}50%{margin-top:-5px}}
      @keyframes m7vip-corner-pulse{0%,100%{scale:1;opacity:.68}50%{scale:1.18;opacity:1}}
      @keyframes m7vip-corner-spin{to{rotate:360deg}}
      @keyframes m7og-shimmer{0%,28%{transform:translateX(-72%) rotate(8deg);opacity:0}48%{opacity:1}72%,100%{transform:translateX(72%) rotate(8deg);opacity:0}}
      @keyframes m7og-breathe{0%,100%{filter:brightness(.92);box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--m7og-primary) 70%,transparent),0 0 calc(var(--m7og-glow) * .55) color-mix(in srgb,var(--m7og-primary) 50%,transparent)}50%{filter:brightness(1.24);box-shadow:inset 0 0 0 2px var(--m7og-primary),0 0 var(--m7og-glow) color-mix(in srgb,var(--m7og-primary) 82%,transparent)}}
      @keyframes m7og-float{0%,100%{transform:translate3d(0,0,0) rotate(-2deg)}50%{transform:translate3d(0,-4px,0) rotate(2deg)}}
      @keyframes m7og-pulse{0%,100%{transform:scale(.96)}50%{transform:scale(1.08)}}
      @keyframes m7og-sparkle{0%,100%{filter:brightness(1)}25%{filter:brightness(1.48)}50%{filter:brightness(1.08)}75%{filter:brightness(1.38)}}
      @media(max-width:700px){
        .${LAYER_CLASS}[data-quality="balanced"] .m7vip-particle:nth-child(n+7){display:none!important}
        .${LAYER_CLASS}[data-quality="balanced"] .m7vip-orbit-item:nth-child(n+7){display:none!important}
        #ma7alak-profile-shell.m7vip-quality-light .m7vip-frame-layer:nth-child(n+3){display:none!important}
        #ma7alak-profile-shell.m7vip-quality-light .m7vip-corner{display:none!important}
      }
      @media(prefers-reduced-motion:reduce){
        #ma7alak-profile-shell:not([data-motion-mode="full"]) .${LAYER_CLASS} *{animation-duration:12s!important}
        #ma7alak-profile-shell:not([data-motion-mode="full"]) .m7og-core,#ma7alak-profile-shell:not([data-motion-mode="full"]) .m7og-core::after{animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function locate(){
    shell=document.getElementById("ma7alak-profile-shell");
    wrapper=document.getElementById("ma7alak-story-wrapper");
    button=document.getElementById("ma7alak-story-button");
    return !!(shell&&wrapper&&button);
  }

  function ensureLayer(){
    if(!locate())return false;
    layer=wrapper.querySelector("."+LAYER_CLASS);
    if(!layer){
      layer=document.createElement("div");
      layer.className=LAYER_CLASS;
      layer.setAttribute("aria-hidden","true");
      layer.innerHTML='<div class="m7vip-ring"></div><div class="m7vip-orbit"></div><div class="m7vip-particles"></div>';
      wrapper.appendChild(layer);
    }
    return true;
  }

  function quality(){
    const selected=String(options.vip_mobile_quality||"balanced").toLowerCase();
    const valid=["full","balanced","light"].includes(selected)?selected:"balanced";
    return matchMedia("(max-width:700px)").matches?valid:"full";
  }

  function effectiveCount(raw,max,q){
    let count=Math.round(clamp(raw,0,max,0));
    if(q==="light")count=Math.min(count,3);
    if(q==="balanced")count=Math.min(count,6);
    return count;
  }

  function renderOrbit(q){
    const stage=layer.querySelector(".m7vip-orbit");
    stage.replaceChildren();
    if(!bool(options.vip_orbit_enabled,false))return;
    const count=effectiveCount(options.vip_orbit_count,8,q);
    const symbol=String(options.vip_orbit_symbol||"✦").trim().slice(0,12)||"✦";
    const imageUrl=safeUrl(options.vip_orbit_image_url);
    const speed=clamp(options.vip_ring_speed,1.5,14,5);
    for(let i=0;i<count;i++){
      const item=document.createElement("span");
      item.className="m7vip-orbit-item";
      item.style.setProperty("--m7vip-delay",(-speed*i/Math.max(1,count)).toFixed(3)+"s");
      const icon=document.createElement("span");
      icon.className="m7vip-orbit-icon";
      if(imageUrl){
        const img=document.createElement("img");
        img.src=imageUrl;
        img.alt="";
        img.loading="lazy";
        img.decoding="async";
        icon.appendChild(img);
      }else{
        icon.textContent=symbol;
      }
      item.appendChild(icon);
      stage.appendChild(item);
    }
  }

  function renderParticles(q){
    const stage=layer.querySelector(".m7vip-particles");
    stage.replaceChildren();
    const style=choice(options.vip_particle_style,ALLOWED_PARTICLES,"sparkles");
    if(style==="none"||q==="light")return;
    const count=effectiveCount(options.vip_particle_count,12,q);
    const symbol=PARTICLE_SYMBOLS[style]||"✦";
    const speed=clamp(options.vip_particle_speed,2,12,4.5);
    for(let i=0;i<count;i++){
      const particle=document.createElement("span");
      particle.className="m7vip-particle";
      particle.textContent=symbol;
      const seed=(i*47+19)%101;
      const seed2=(i*71+13)%97;
      particle.style.setProperty("--m7vip-x",(8+seed*.82).toFixed(1)+"%");
      particle.style.setProperty("--m7vip-y",(14+seed2*.70).toFixed(1)+"%");
      particle.style.setProperty("--m7vip-delay",(-speed*((i*37)%100)/100).toFixed(3)+"s");
      particle.style.setProperty("--m7vip-drift",(((i%5)-2)*6)+"px");
      particle.style.setProperty("--m7vip-turn",((i*43)%180)+"deg");
      particle.style.setProperty("--m7vip-particle-size",(7+(i%4)*2)+"px");
      stage.appendChild(particle);
    }
  }

  function removeOgBadge(){
    ogLayer?.remove();
    ogLayer=null;
  }

  function syncOgPlacement(){
    if(!ogLayer||!wrapper)return;
    const verified=wrapper.classList.contains("m7-profile-is-verified")||wrapper.getAttribute("data-verified")==="true"||document.getElementById("ma7alak-profile-verified-badge")?.classList.contains("visible");
    ogLayer.classList.toggle("has-verified",verified);
  }

  function renderOgBadge(){
    removeOgBadge();
    if(!bool(options.og_badge_enabled,false)||!wrapper)return;

    ogLayer=document.createElement("span");
    ogLayer.className="m7og-badge";
    ogLayer.title="OG Member · One of ShoufHon’s original shops";
    ogLayer.setAttribute("aria-label","OG Member");

    const animations=new Set(["none","shimmer","breathe","float","pulse","sparkle"]);
    ogLayer.dataset.animation=choice(options.og_badge_animation,animations,"shimmer");
    ogLayer.style.setProperty("--m7og-primary",hex(options.og_badge_primary_color,"#d9a441"));
    ogLayer.style.setProperty("--m7og-secondary",hex(options.og_badge_secondary_color,"#fff2a4"));
    ogLayer.style.setProperty("--m7og-bg",hex(options.og_badge_background_color,"#160e06"));
    ogLayer.style.setProperty("--m7og-text",hex(options.og_badge_text_color,"#fff0b8"));
    const badgeSize=clamp(options.og_badge_size,22,40,30);
    ogLayer.style.setProperty("--m7og-size",badgeSize+"px");
    ogLayer.style.setProperty("--m7og-speed",clamp(options.og_badge_animation_speed,1,8,2.8)+"s");
    ogLayer.style.setProperty("--m7og-glow",(2+clamp(options.og_badge_glow_strength,0,100,55)*.22).toFixed(1)+"px");

    const core=document.createElement("span");
    core.className="m7og-core";
    const icon=String(options.og_badge_icon===undefined||options.og_badge_icon===null?"♛":options.og_badge_icon).trim().slice(0,4);
    const badgeText=String(options.og_badge_text||"OG").trim().slice(0,8)||"OG";
    ogLayer.style.setProperty("--m7og-font",Math.max(5,badgeSize*(badgeText.length<=3?.29:badgeText.length<=5?.20:.16)).toFixed(1)+"px");
    if(icon){
      const iconNode=document.createElement("small");
      iconNode.setAttribute("aria-hidden","true");
      iconNode.textContent=icon;
      core.appendChild(iconNode);
    }
    const textNode=document.createElement("b");
    textNode.dir="auto";
    textNode.textContent=badgeText;
    core.appendChild(textNode);
    ogLayer.appendChild(core);
    wrapper.appendChild(ogLayer);
    syncOgPlacement();
  }

  function restoreCategoryIcon(){
    const icon=document.getElementById("ma7alak-shop-category-icon");
    if(icon&&categoryIconOriginal!==null){
      icon.innerHTML=categoryIconOriginal;
      categoryIconOriginal=null;
    }
  }

  function renderCategoryIcon(){
    const icon=document.getElementById("ma7alak-shop-category-icon");
    if(!icon)return;
    if(categoryIconOriginal===null)categoryIconOriginal=icon.innerHTML;

    const imageUrl=safeUrl(options.vip_category_icon_image_url);
    const symbol=String(options.vip_category_icon_text||"").trim().slice(0,12);

    if(imageUrl){
      icon.replaceChildren();
      const img=document.createElement("img");
      img.src=imageUrl;
      img.alt="";
      img.loading="lazy";
      img.decoding="async";
      icon.appendChild(img);
    }else if(symbol){
      icon.textContent=symbol;
    }else if(categoryIconOriginal!==null){
      icon.innerHTML=categoryIconOriginal;
    }
  }

  function removeFrame(){
    frameLayer?.remove();
    frameLayer=null;
  }

  function cornerContent(node,imageUrl,symbol){
    if(imageUrl){
      const img=document.createElement("img");
      img.src=imageUrl;
      img.alt="";
      img.loading="lazy";
      img.decoding="async";
      node.appendChild(img);
    }else{
      node.textContent=symbol;
    }
  }

  function renderFrame(q){
    removeFrame();
    if(!bool(options.vip_frame_enabled,false)||!shell)return;

    frameLayer=document.createElement("div");
    frameLayer.className="m7vip-shell-frame";
    frameLayer.setAttribute("aria-hidden","true");

    const styles=new Set(["layered","gradient","neon","metallic","glass","segments"]);
    const animations=new Set(["flow","comet","breathe","shimmer","none"]);
    frameLayer.dataset.style=choice(options.vip_frame_style,styles,"layered");
    frameLayer.dataset.animation=choice(options.vip_frame_animation,animations,"flow");
    frameLayer.dataset.cornerAnimation=String(options.vip_corner_animation||"float").toLowerCase();

    const colors=[
      hex(options.vip_frame_color_1,"#f2caed"),
      hex(options.vip_frame_color_2,"#d9a441"),
      hex(options.vip_frame_color_3,"#ffffff"),
      hex(options.vip_frame_color_4,"#8a2cff")
    ];
    colors.forEach((color,index)=>frameLayer.style.setProperty("--m7vip-frame-c"+(index+1),color));
    const frameWidth=clamp(options.vip_frame_width,1,6,2);
    const frameGap=clamp(options.vip_frame_gap,0,10,3);
    frameLayer.style.setProperty("--m7vip-frame-width",frameWidth+"px");
    frameLayer.style.setProperty("--m7vip-frame-gap",frameGap+"px");
    frameLayer.style.setProperty("--m7vip-frame-angle",clamp(options.vip_frame_angle,0,360,120)+"deg");
    frameLayer.style.setProperty("--m7vip-frame-speed",clamp(options.vip_frame_animation_speed,2,14,5)+"s");
    frameLayer.style.setProperty("--m7vip-frame-glow",(4+clamp(options.vip_frame_glow,0,100,38)*.30).toFixed(1)+"px");
    frameLayer.style.setProperty("--m7vip-corner-size",clamp(options.vip_corner_size,10,52,20)+"px");

    let count=Math.round(clamp(options.vip_frame_layer_count,1,4,3));
    if(q==="light")count=Math.min(count,2);
    else if(q==="balanced")count=Math.min(count,3);
    for(let i=0;i<count;i++){
      const frame=document.createElement("span");
      frame.className="m7vip-frame-layer";
      frame.style.setProperty("--m7vip-frame-index",String(i));
      frame.style.setProperty("--m7vip-frame-color",colors[i]);
      frame.style.setProperty("--m7vip-frame-inset",(i*(frameWidth+frameGap)).toFixed(1)+"px");
      frame.style.setProperty("--m7vip-frame-radius-cut",(i*3)+"px");
      frame.style.setProperty("--m7vip-frame-opacity",String((1-i*.11).toFixed(2)));
      frameLayer.appendChild(frame);
    }

    if(bool(options.vip_corner_enabled,false)&&q!=="light"){
      const imageUrl=safeUrl(options.vip_corner_image_url);
      const symbol=String(options.vip_corner_symbol||"✦").trim().slice(0,12)||"✦";
      ["tl","tr","bl","br"].forEach(key=>{
        const corner=document.createElement("span");
        corner.className="m7vip-corner";
        corner.dataset.corner=key;
        cornerContent(corner,imageUrl,symbol);
        frameLayer.appendChild(corner);
      });
    }

    shell.appendChild(frameLayer);
  }

  function applyBrand(q){
    const enabled=bool(options.vip_effects_enabled,false);
    shell.classList.toggle("m7vip-brand-enabled",enabled);
    shell.classList.toggle("m7vip-quality-light",enabled&&q==="light");

    if(!enabled){
      restoreCategoryIcon();
      removeFrame();
      return;
    }

    const accent=hex(options.story_color||options.card_color,"#d9a441");
    const nameStyles=new Set(["gradient","gold","chrome","neon","glass","outline","solid"]);
    const nameAnimations=new Set(["shimmer","gradient-flow","neon-pulse","float","pulse","none"]);
    const categoryStyles=new Set(["glass","pill","ribbon","seal","neon","minimal"]);
    const categoryAnimations=new Set(["float","shimmer","pulse","glow","none"]);

    shell.dataset.vipNameStyle=choice(options.vip_name_style,nameStyles,"gradient");
    shell.dataset.vipNameAnimation=choice(options.vip_name_animation,nameAnimations,"shimmer");
    shell.dataset.vipCategoryStyle=choice(options.vip_category_style,categoryStyles,"glass");
    shell.dataset.vipCategoryAnimation=choice(options.vip_category_animation,categoryAnimations,"float");

    shell.style.setProperty("--m7vip-name-c1",hex(options.vip_name_color_1,accent));
    shell.style.setProperty("--m7vip-name-c2",hex(options.vip_name_color_2,"#d9a441"));
    shell.style.setProperty("--m7vip-name-c3",hex(options.vip_name_color_3,"#ffffff"));
    shell.style.setProperty("--m7vip-name-angle",clamp(options.vip_name_gradient_angle,0,360,110)+"deg");
    shell.style.setProperty("--m7vip-name-outline",hex(options.vip_name_outline_color,"#100d0b"));
    shell.style.setProperty("--m7vip-name-outline-width",clamp(options.vip_name_outline_width,0,4,0)+"px");
    shell.style.setProperty("--m7vip-name-spacing",clamp(options.vip_name_letter_spacing,-2,12,0)+"px");
    shell.style.setProperty("--m7vip-name-shadow",(2+clamp(options.vip_name_shadow_power,0,100,45)*.34).toFixed(1)+"px");
    shell.style.setProperty("--m7vip-name-speed",clamp(options.vip_name_animation_speed,1.5,12,3.2)+"s");

    shell.style.setProperty("--m7vip-category-text",hex(options.vip_category_text_color,"#ffffff"));
    shell.style.setProperty("--m7vip-category-bg",hex(options.vip_category_bg_color,"#171217"));
    shell.style.setProperty("--m7vip-category-border",hex(options.vip_category_border_color,accent));
    shell.style.setProperty("--m7vip-category-icon",hex(options.vip_category_icon_color,"#d9a441"));
    shell.style.setProperty("--m7vip-category-speed",clamp(options.vip_category_animation_speed,1.5,12,3)+"s");

    renderCategoryIcon();
    renderFrame(q);
  }

  function syncSize(){
    if(!button||!layer)return;
    const rect=button.getBoundingClientRect();
    const base=Math.max(rect.width,rect.height,120);
    const distance=clamp(options.vip_orbit_distance,2,42,12);
    layer.style.setProperty("--m7vip-size",(base+10)+"px");
    layer.style.setProperty("--m7vip-orbit-distance",distance+"px");
  }

  function syncActive(){
    if(!layer||!wrapper)return;
    const enabled=bool(options.vip_effects_enabled,false);
    const mode=String(options.vip_ring_visibility||"unseen").toLowerCase();
    const hasNew=wrapper.classList.contains("story-has-new");
    const motionOff=String(shell?.dataset?.motionMode||"").toLowerCase()==="off";
    layer.dataset.active=enabled&&(mode==="always"||hasNew)?"1":"0";
    layer.dataset.paused=(!visible||document.hidden||motionOff)?"1":"0";
    shell?.classList.toggle("m7vip-paused",!visible||document.hidden||motionOff);
    syncOgPlacement();
  }

  function apply(next){
    if(!next||typeof next!=="object"||Array.isArray(next))return;
    options={...options,...next};
    if(!ensureLayer())return;

    const accent=hex(options.story_color||options.card_color,"#d9a441");
    const c1=hex(options.vip_ring_color_1,hex(options.profile_ring_color,accent));
    const c2=hex(options.vip_ring_color_2,accent);
    const c3=hex(options.vip_ring_color_3,"#ffffff");
    const particle=hex(options.vip_particle_color,c1);
    const q=quality();

    layer.dataset.ring=choice(options.vip_ring_style,ALLOWED_RING,"aurora");
    layer.dataset.direction=String(options.vip_orbit_direction||"").toLowerCase()==="counter"?"counter":"clockwise";
    layer.dataset.particle=choice(options.vip_particle_style,ALLOWED_PARTICLES,"sparkles");
    layer.dataset.quality=q;
    layer.style.setProperty("--m7vip-c1",c1);
    layer.style.setProperty("--m7vip-c2",c2);
    layer.style.setProperty("--m7vip-c3",c3);
    layer.style.setProperty("--m7vip-particle",particle);
    layer.style.setProperty("--m7vip-width",clamp(options.vip_ring_width,1,10,4)+"px");
    layer.style.setProperty("--m7vip-speed",clamp(options.vip_ring_speed,1.5,14,5)+"s");
    layer.style.setProperty("--m7vip-particle-speed",clamp(options.vip_particle_speed,2,12,4.5)+"s");
    layer.style.setProperty("--m7vip-orbit-size",clamp(options.vip_orbit_size,8,42,18)+"px");

    applyBrand(q);
    renderOgBadge();
    renderOrbit(q);
    renderParticles(q);
    syncSize();
    syncActive();
  }

  function receive(event){
    const detail=event?.detail||{};
    const eventSlug=String(detail.shop_slug||detail.shopSlug||"").trim().toLowerCase();
    const current=slug();
    if(eventSlug&&current&&eventSlug!==current)return;
    apply(detail.directory_options);
  }

  function observe(){
    resizeObserver?.disconnect();
    storyObserver?.disconnect();
    intersectionObserver?.disconnect();

    if("ResizeObserver" in window){
      resizeObserver=new ResizeObserver(syncSize);
      resizeObserver.observe(button);
    }
    storyObserver=new MutationObserver(syncActive);
    storyObserver.observe(wrapper,{attributes:true,attributeFilter:["class","data-verified"]});
    if("IntersectionObserver" in window){
      intersectionObserver=new IntersectionObserver(entries=>{
        visible=!!entries[0]?.isIntersecting;
        syncActive();
      },{rootMargin:"120px 0px"});
      intersectionObserver.observe(wrapper);
    }
  }

  function boot(){
    installCss();
    if(!ensureLayer()){
      if(bootTimer<120){
        bootTimer++;
        setTimeout(boot,50);
      }
      return;
    }
    observe();
    apply(cachedOptions()||{});
  }

  window.addEventListener("ma7alak:profile-design-preview",receive);
  window.addEventListener("ma7alak:profile-design-saved",receive);
  window.addEventListener("ma7alak:profile-draft-preview",receive);
  document.addEventListener("visibilitychange",syncActive);
  window.addEventListener("resize",()=>{syncSize();apply(options);},{passive:true});

  window.ShoufHonVipEffects={apply,refresh:function(){apply(options);}};
  boot();
})();
