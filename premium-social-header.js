/* =========================================================
   MA7ALAK PREMIUM SOCIAL HEADER — GITHUB READY
   Converted from the exact Hostinger Custom Code version.
   Load this file with a normal <script src="..."></script> tag.
   ========================================================= */
(function(){
  "use strict";

  /*
     CRITICAL HOSTINGER SAFETY:
     Run this header ONLY in the real top-level website page.
     Do NOT run inside any Hostinger Embed/custom-code iframe.
  */
  if(window.self !== window.top){
    return;
  }

  /* =========================================================
     MA7ALAK PREMIUM SOCIAL HEADER
     HOSTINGER GLOBAL CUSTOM CODE SAFE VERSION

     This version uses JavaScript to inject the header into
     document.body. It does NOT place raw <header> markup
     directly inside Hostinger's Custom Code container.
  ========================================================= */

  if(window.__MA7ALAK_PREMIUM_HEADER_LOADED__){
    return;
  }
  window.__MA7ALAK_PREMIUM_HEADER_LOADED__ = true;


  function whenBodyReady(callback){
    if(document.body){
      callback();
      return;
    }

    document.addEventListener(
      "DOMContentLoaded",
      callback,
      {once:true}
    );
  }


  function loadSupabase(){
    return new Promise(function(resolve,reject){

      if(
        window.supabase &&
        typeof window.supabase.createClient === "function"
      ){
        resolve();
        return;
      }

      const existing =
        document.querySelector(
          'script[data-ma7alak-header-supabase="1"]'
        );

      if(existing){
        existing.addEventListener("load",function(){ resolve(); },{once:true});
        existing.addEventListener("error",reject,{once:true});
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

      script.async = true;
      script.dataset.ma7alakHeaderSupabase = "1";

      script.onload = function(){
        resolve();
      };

      script.onerror = function(){
        reject(
          new Error("Could not load Supabase JS")
        );
      };

      document.head.appendChild(script);

    });
  }


  function injectHeaderCSS(){
    if(
      document.getElementById(
        "ma7alak-premium-social-header-style"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "ma7alak-premium-social-header-style";

    style.textContent = `
:root{
  --m7-gold:#d9a441;
  --m7-gold-soft:#efc66e;
  --m7-bg:#08090a;
  --m7-panel:rgba(13,15,16,.94);
  --m7-line:rgba(217,164,65,.23);
  --m7-white:#f5f5f5;
  --m7-muted:rgba(255,255,255,.58);
  --m7-header-h:76px;
}

#ma7alak-social-header,
#ma7alak-social-header *{
  box-sizing:border-box;
}

body.ma7alak-header-page{
  padding-top:calc(var(--m7-header-h) + 18px)!important;
}

/* =========================================================
   HOMEPAGE-THEME HEADER BACKDROP
   ---------------------------------------------------------
   This is intentionally ABSOLUTE, not fixed.
   It sits behind the header only at the top of the page and
   scrolls away naturally while the floating header stays fixed.
   It does NOT replace/change the rest of the webpage background.
========================================================= */
#ma7alak-header-theme-backdrop{
  position:absolute;
  top:0;
  left:0;
  right:0;
  width:100%;
  height:calc(var(--m7-header-h) + 58px);
  overflow:hidden;
  pointer-events:none;
  z-index:2147482500;

  background:
    radial-gradient(
      circle at 12% 18%,
      rgba(125,33,23,.34) 0,
      rgba(125,33,23,.14) 22%,
      transparent 46%
    ),
    radial-gradient(
      circle at 84% 14%,
      rgba(217,164,65,.20) 0,
      rgba(217,164,65,.08) 24%,
      transparent 46%
    ),
    radial-gradient(
      circle at 54% -30%,
      rgba(202,72,31,.16) 0,
      transparent 52%
    ),
    linear-gradient(
      180deg,
      rgba(8,9,11,.99) 0%,
      rgba(12,12,14,.98) 45%,
      rgba(13,13,15,.94) 72%,
      rgba(13,13,15,.15) 96%,
      rgba(13,13,15,0) 100%
    );
}

#ma7alak-header-theme-backdrop::before{
  content:"";
  position:absolute;
  inset:0;
  opacity:.48;
  background:
    linear-gradient(
      110deg,
      transparent 0 18%,
      rgba(255,255,255,.018) 28%,
      transparent 39% 62%,
      rgba(217,164,65,.025) 72%,
      transparent 84%
    );
}

#ma7alak-header-theme-backdrop::after{
  content:"";
  position:absolute;
  left:7%;
  right:7%;
  bottom:9px;
  height:1px;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(217,164,65,.10),
      rgba(217,164,65,.28),
      rgba(217,164,65,.10),
      transparent
    );
  filter:blur(.2px);
}



#ma7alak-social-header{
  position:fixed;
  top:max(10px,env(safe-area-inset-top));
  left:50%;
  transform:translateX(-50%);

  /* Compact floating header shell */
  width:min(1180px,calc(100vw - 24px));
  min-height:var(--m7-header-h);

  display:grid;
  grid-template-columns:auto minmax(220px,440px) 1fr auto auto;
  align-items:center;
  gap:14px;
  padding:8px 12px 8px 16px;

  border:1px solid rgba(217,164,65,.20)!important;
  border-radius:24px!important;

  background:
    linear-gradient(
      180deg,
      rgba(25,26,28,.88),
      rgba(11,12,13,.86)
    )!important;

  box-shadow:
    0 14px 34px rgba(0,0,0,.34),
    0 1px 0 rgba(255,255,255,.035) inset,
    0 0 0 1px rgba(217,164,65,.025) inset!important;

  backdrop-filter:blur(18px) saturate(125%)!important;
  -webkit-backdrop-filter:blur(18px) saturate(125%)!important;

  z-index:2147483000;
  font-family:Arial,"Segoe UI",sans-serif;
  color:#fff;

  transition:
    background .22s ease,
    border-color .22s ease,
    box-shadow .22s ease,
    transform .22s ease;
}

#ma7alak-social-header.ma7alak-scrolled{
  border-color:rgba(217,164,65,.30)!important;

  background:
    linear-gradient(
      180deg,
      rgba(22,23,25,.95),
      rgba(8,9,10,.94)
    )!important;

  box-shadow:
    0 18px 42px rgba(0,0,0,.46),
    0 1px 0 rgba(255,255,255,.045) inset,
    0 0 22px rgba(217,164,65,.035)!important;

  backdrop-filter:blur(22px) saturate(135%)!important;
  -webkit-backdrop-filter:blur(22px) saturate(135%)!important;
}

.ma7alak-header-brand{
  display:flex;
  align-items:center;
  justify-content:center;
  min-width:170px;
  height:62px;
  padding:0 8px;
  text-decoration:none!important;
  -webkit-tap-highlight-color:transparent;
  overflow:visible;
}

.ma7alak-header-logo{
  display:block;
  width:auto;
  height:60px;
  max-width:168px;
  object-fit:contain;
  object-position:center;
  filter:
    drop-shadow(0 7px 16px rgba(0,0,0,.34))
    drop-shadow(0 0 9px rgba(217,164,65,.07));
  transition:
    transform .2s ease,
    filter .2s ease;
}

.ma7alak-header-brand:hover .ma7alak-header-logo{
  transform:translateY(-1px) scale(1.025);
  filter:
    drop-shadow(0 8px 18px rgba(0,0,0,.38))
    drop-shadow(0 0 12px rgba(217,164,65,.12));
}

/* =========================================================
   MENU BUTTON + DROPDOWN
========================================================= */

.ma7alak-header-menu-wrap{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
}

#ma7alak-header-menu-button{
  position:relative;
  width:44px;
  height:44px;
  flex:0 0 44px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
  padding:0;
  border:1px solid rgba(255,255,255,.10);
  border-radius:14px;
  background:
    linear-gradient(
      180deg,
      rgba(31,33,35,.90),
      rgba(15,16,18,.90)
    );
  color:#f5e1b7;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.045),
    0 8px 18px rgba(0,0,0,.20);
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  transition:
    transform .18s ease,
    border-color .18s ease,
    background .18s ease,
    box-shadow .18s ease;
}

#ma7alak-header-menu-button:hover{
  border-color:rgba(217,164,65,.42);
  background:
    linear-gradient(
      180deg,
      rgba(44,39,31,.94),
      rgba(19,17,15,.94)
    );
  box-shadow:
    0 8px 22px rgba(0,0,0,.26),
    0 0 18px rgba(217,164,65,.07);
}

#ma7alak-header-menu-button:active{
  transform:scale(.94);
}

#ma7alak-header-menu-button span{
  display:block;
  width:19px;
  height:2px;
  border-radius:999px;
  background:currentColor;
  transition:
    transform .22s ease,
    opacity .18s ease;
}

#ma7alak-header-menu-button.open span:nth-child(1){
  transform:translateY(6px) rotate(45deg);
}
#ma7alak-header-menu-button.open span:nth-child(2){
  opacity:0;
}
#ma7alak-header-menu-button.open span:nth-child(3){
  transform:translateY(-6px) rotate(-45deg);
}

#ma7alak-header-menu-panel{
  position:absolute;
  top:calc(100% + 12px);
  right:0;
  width:230px;
  padding:9px;
  border:1px solid rgba(217,164,65,.22);
  border-radius:19px;
  background:
    linear-gradient(
      180deg,
      rgba(24,25,27,.98),
      rgba(10,11,12,.98)
    );
  box-shadow:
    0 22px 50px rgba(0,0,0,.48),
    inset 0 1px 0 rgba(255,255,255,.045);
  backdrop-filter:blur(22px) saturate(135%);
  -webkit-backdrop-filter:blur(22px) saturate(135%);
  opacity:0;
  visibility:hidden;
  pointer-events:none;
  transform:translateY(-7px) scale(.98);
  transform-origin:top right;
  transition:
    opacity .18s ease,
    visibility .18s ease,
    transform .18s ease;
  z-index:2147483646;
}

#ma7alak-header-menu-panel.open{
  opacity:1;
  visibility:visible;
  pointer-events:auto;
  transform:translateY(0) scale(1);
}

.ma7alak-header-menu-link{
  min-height:48px;
  padding:0 13px;
  display:flex;
  align-items:center;
  gap:11px;
  border-radius:13px;
  color:rgba(255,255,255,.90)!important;
  text-decoration:none!important;
  font-size:13px;
  font-weight:750;
  letter-spacing:.05px;
  transition:
    background .18s ease,
    color .18s ease,
    transform .18s ease;
}

.ma7alak-header-menu-link + .ma7alak-header-menu-link{
  margin-top:4px;
}

.ma7alak-header-menu-link:hover{
  background:rgba(217,164,65,.10);
  color:#ffe3a8!important;
  transform:translateX(2px);
}

.ma7alak-header-menu-icon{
  width:33px;
  height:33px;
  flex:0 0 33px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px solid rgba(217,164,65,.18);
  border-radius:10px;
  background:rgba(217,164,65,.055);
  color:#e3b55b;
  font-size:16px;
}

.ma7alak-header-menu-text{
  display:flex;
  flex-direction:column;
  min-width:0;
}

.ma7alak-header-menu-main{
  color:inherit;
  line-height:1.1;
}

.ma7alak-header-menu-sub{
  margin-top:4px;
  color:rgba(255,255,255,.38);
  font-size:9px;
  font-weight:650;
  letter-spacing:.25px;
}

.ma7alak-header-search-wrap{position:relative;width:100%;}
#ma7alak-header-search{
  width:100%;
  height:48px;
  padding:0 48px 0 47px;
  border:1px solid rgba(255,255,255,.10);
  border-radius:999px;
  outline:none;
  background:linear-gradient(180deg,rgba(31,33,35,.92),rgba(18,20,22,.91));
  color:#fff;
  font:600 13px/1 Arial,"Segoe UI",sans-serif;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 20px rgba(0,0,0,.18);
  transition:.2s ease;
}
#ma7alak-header-search::placeholder{color:rgba(255,255,255,.38);}
#ma7alak-header-search:focus{
  border-color:rgba(217,164,65,.55);
  background:rgba(25,27,28,.98);
  box-shadow:0 0 0 3px rgba(217,164,65,.07),inset 0 1px 0 rgba(255,255,255,.05);
}
.ma7alak-header-search-icon{
  position:absolute;
  left:16px;
  top:50%;
  transform:translateY(-50%);
  width:21px;
  height:21px;
  color:var(--m7-gold-soft);
  pointer-events:none;
}
.ma7alak-header-search-kbd{
  position:absolute;
  right:11px;
  top:50%;
  transform:translateY(-50%);
  min-width:28px;
  height:28px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0 7px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:9px;
  background:rgba(255,255,255,.035);
  color:rgba(255,255,255,.32);
  font-size:10px;
  font-weight:800;
  pointer-events:none;
}

.ma7alak-header-nav{
  min-width:0;
  display:flex;
  align-items:stretch;
  justify-content:flex-end;
  height:56px;
}
.ma7alak-header-nav-item{
  position:relative;
  min-width:76px;
  height:56px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
  border:0;
  border-radius:15px;
  background:transparent;
  color:rgba(255,255,255,.80);
  cursor:pointer;
  font-family:Arial,"Segoe UI",sans-serif;
  transition:.18s ease;
  -webkit-tap-highlight-color:transparent;
}
.ma7alak-header-nav-item:hover{color:#fff;background:rgba(255,255,255,.045);}
.ma7alak-header-nav-item:active{transform:scale(.93);}
.ma7alak-header-nav-item::after{
  content:"";
  position:absolute;
  left:50%;
  bottom:-10px;
  width:0;
  height:2px;
  transform:translateX(-50%);
  border-radius:20px;
  background:var(--m7-gold-soft);
  box-shadow:0 0 12px rgba(217,164,65,.35);
  transition:width .2s ease;
}
.ma7alak-header-nav-item.ma7alak-active::after,
.ma7alak-header-nav-item:hover::after{width:30px;}
.ma7alak-header-nav-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;}
.ma7alak-header-nav-icon svg{width:24px;height:24px;display:block;}

#ma7alak-reels-badge{
  position:absolute;
  top:3px;
  right:13px;
  min-width:18px;
  height:18px;
  padding:0 5px;
  display:none;
  align-items:center;
  justify-content:center;
  border:2px solid rgba(10,11,12,.96);
  border-radius:999px;
  background:#e53935;
  color:#fff;
  font-size:10px;
  font-weight:900;
  line-height:1;
  letter-spacing:-.2px;
  box-shadow:
    0 3px 10px rgba(0,0,0,.42),
    0 0 12px rgba(229,57,53,.28);
  pointer-events:none;
  z-index:5;
  transform-origin:center;
}

#ma7alak-reels-badge.visible{
  display:flex;
  animation:ma7alakReelsBadgePop .28s cubic-bezier(.2,.9,.25,1.2);
}

@keyframes ma7alakReelsBadgePop{
  0%{transform:scale(.55);opacity:0;}
  70%{transform:scale(1.12);opacity:1;}
  100%{transform:scale(1);opacity:1;}
}

.ma7alak-header-nav-label{color:inherit;font-size:10px;font-weight:750;line-height:1;}

#ma7alak-header-likes-slot,
#ma7alak-header-notification-slot{
  position:relative;
  min-width:76px;
  height:56px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  padding-top:4px;
  border-radius:15px;
  transition:background .18s ease;
}
#ma7alak-header-likes-slot:hover,
#ma7alak-header-notification-slot:hover{background:rgba(255,255,255,.045);}
.ma7alak-integrated-label{
  position:absolute;
  bottom:4px;
  left:0;
  right:0;
  color:rgba(255,255,255,.80);
  font-size:10px;
  font-weight:750;
  line-height:1;
  text-align:center;
  pointer-events:none;
}

/* =========================================================
   INSTANT HEART PLACEHOLDER
   ---------------------------------------------------------
   The real Story Likes GitHub script can load a moment later.
   This placeholder is rendered by the header itself instantly,
   then disappears the moment the real Likes control exists.
========================================================= */
#ma7alak-instant-likes-placeholder{
  width:34px;
  height:34px;
  min-width:34px;
  padding:0;
  margin:0;
  display:flex;
  align-items:center;
  justify-content:center;
  border:0;
  border-radius:50%;
  background:transparent;
  color:#ff4d5a;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  animation:ma7alakInstantHeartPop .22s cubic-bezier(.2,.9,.25,1.18);
}

#ma7alak-instant-likes-placeholder svg{
  width:23px;
  height:23px;
  display:block;
  filter:drop-shadow(0 2px 7px rgba(255,77,90,.18));
}

#ma7alak-instant-likes-placeholder:active{
  transform:scale(.90);
}

@keyframes ma7alakInstantHeartPop{
  0%{opacity:0;transform:scale(.55);}
  70%{opacity:1;transform:scale(1.10);}
  100%{opacity:1;transform:scale(1);}
}

#ma7alak-social-header #ma7alak-story-likes-wrapper,
#ma7alak-social-header #ma7alak-notification-wrapper{
  position:static!important;
  top:auto!important;
  left:auto!important;
  right:auto!important;
  bottom:auto!important;
  width:auto!important;
  height:auto!important;
  margin:0!important;
  padding:0!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  transform:none!important;
  z-index:20!important;
}

#ma7alak-social-header #ma7alak-story-likes-button,
#ma7alak-social-header #ma7alak-notification-bell{
  width:34px!important;
  height:34px!important;
  min-width:34px!important;
  min-height:34px!important;
  border:0!important;
  border-radius:11px!important;
  background:transparent!important;
  box-shadow:none!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
  transform:none!important;
}
#ma7alak-social-header #ma7alak-story-likes-button:hover,
#ma7alak-social-header #ma7alak-notification-bell:hover{background:rgba(255,255,255,.06)!important;transform:none!important;}
#ma7alak-social-header #ma7alak-story-likes-button:active,
#ma7alak-social-header #ma7alak-notification-bell:active{transform:scale(.90)!important;}
#ma7alak-social-header #ma7alak-story-likes-icon,
#ma7alak-social-header #ma7alak-notification-bell-icon{width:23px!important;height:23px!important;}

#ma7alak-story-likes-panel,
#ma7alak-notification-panel{z-index:2147483647!important;}

#ma7alak-header-owner{
  position:relative;
  min-width:194px;
  height:60px;
  display:none;
  align-items:center;
  gap:11px;
  padding:3px 14px 3px 6px;
  margin-right:10px;
  border-left:1px solid rgba(255,255,255,.09);
  text-decoration:none!important;
  color:#fff!important;
  border-radius:0 15px 15px 0;
  cursor:pointer;
  transition:.18s ease;
  -webkit-tap-highlight-color:transparent;
}
#ma7alak-header-owner.visible{display:flex;}
#ma7alak-header-owner:hover{background:rgba(255,255,255,.045);}
#ma7alak-header-owner:active{transform:scale(.98);}
.ma7alak-owner-avatar-wrap{
  position:relative;
  width:54px;
  height:54px;
  flex:0 0 54px;
  padding:3px;
  border-radius:50%;
  background:transparent;
  box-shadow:0 0 0 1px rgba(217,164,65,.16),0 0 20px rgba(217,164,65,.13);
  isolation:isolate;
  transform-origin:50% 50%;
  animation:ma7alakOwnerCircleSpin 8s linear infinite!important;
  -webkit-animation:ma7alakOwnerCircleSpin 8s linear infinite!important;
  will-change:transform;
  -webkit-backface-visibility:hidden;
  backface-visibility:hidden;
}

.ma7alak-owner-avatar-wrap::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:50%;
  background:
    conic-gradient(
      from 0deg,
      #6b4a18 0deg,
      #efc66e 56deg,
      #8c6421 116deg,
      #f6d98f 184deg,
      #8b6220 246deg,
      #efc66e 306deg,
      #6b4a18 360deg
    );
  z-index:-1;
  transform-origin:50% 50%;
  /* V23: ring itself is static; the whole shop circle rotates instead. */
  animation:none!important;
  -webkit-animation:none!important;
}

@keyframes ma7alakOwnerCircleSpin{
  from{transform:translateZ(0) rotate(0deg);}
  to{transform:translateZ(0) rotate(360deg);}
}

@-webkit-keyframes ma7alakOwnerCircleSpin{
  from{-webkit-transform:translateZ(0) rotate(0deg);}
  to{-webkit-transform:translateZ(0) rotate(360deg);}
}

.ma7alak-owner-avatar-inner{
  position:relative;
  z-index:1;
  width:100%;
  height:100%;
  padding:2px;
  border-radius:50%;
  background:#090a0b;
  overflow:hidden;
}
.ma7alak-owner-avatar{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
  border-radius:50%;
  background:linear-gradient(145deg,#2a2c2e,#0c0d0e);
}
.ma7alak-owner-avatar-fallback{
  width:100%;
  height:100%;
  display:none;
  align-items:center;
  justify-content:center;
  border-radius:50%;
  background:linear-gradient(145deg,#292b2d,#101112);
  color:var(--m7-gold-soft);
  font-family:Georgia,"Times New Roman",serif;
  font-size:17px;
  font-weight:900;
}
.ma7alak-owner-copy{min-width:0;display:flex;flex-direction:column;}
#ma7alak-header-owner-name{
  max-width:118px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:#fff;
  font-size:13px;
  font-weight:800;
  line-height:1.15;
}
.ma7alak-owner-sub{margin-top:4px;color:var(--m7-gold-soft);font-size:9px;font-weight:750;}

#ma7alak-header-search-overlay{
  position:fixed;
  inset:0;
  display:none;
  background:rgba(0,0,0,.58);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  z-index:2147483200;
}
#ma7alak-header-search-overlay.open{display:block;animation:ma7alakSearchFade .16s ease-out;}
@keyframes ma7alakSearchFade{from{opacity:0}to{opacity:1}}
#ma7alak-header-search-panel{
  position:absolute;
  top:max(96px,calc(env(safe-area-inset-top) + 84px));
  left:50%;
  transform:translateX(-50%);
  width:min(680px,calc(100vw - 24px));
  max-height:min(650px,calc(100vh - 120px));
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border:1px solid rgba(217,164,65,.22);
  border-radius:24px;
  background:radial-gradient(circle at 15% 0%,rgba(217,164,65,.07),transparent 30%),rgba(11,12,13,.975);
  box-shadow:0 30px 80px rgba(0,0,0,.68),inset 0 1px 0 rgba(255,255,255,.04);
}
.ma7alak-search-panel-head{padding:14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px;}
.ma7alak-search-panel-field{position:relative;flex:1;}
#ma7alak-overlay-search-input{
  width:100%;
  height:48px;
  padding:0 44px 0 45px;
  border:1px solid rgba(255,255,255,.10);
  border-radius:16px;
  outline:none;
  background:rgba(255,255,255,.055);
  color:#fff;
  font-size:14px;
  font-weight:650;
}
#ma7alak-overlay-search-input:focus{border-color:rgba(217,164,65,.48);box-shadow:0 0 0 3px rgba(217,164,65,.07);}
.ma7alak-overlay-search-icon{position:absolute;left:15px;top:50%;transform:translateY(-50%);width:20px;height:20px;color:var(--m7-gold-soft);}
#ma7alak-search-clear{
  position:absolute;
  right:10px;
  top:50%;
  transform:translateY(-50%);
  width:30px;
  height:30px;
  border:0;
  border-radius:50%;
  background:rgba(255,255,255,.06);
  color:rgba(255,255,255,.60);
  cursor:pointer;
}
#ma7alak-search-close{
  width:42px;
  height:42px;
  flex:0 0 42px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:13px;
  background:rgba(255,255,255,.035);
  color:#fff;
  font-size:24px;
  line-height:1;
  cursor:pointer;
}
.ma7alak-search-panel-title{padding:16px 18px 7px;color:rgba(255,255,255,.38);font-size:10px;font-weight:850;letter-spacing:1.2px;text-transform:uppercase;}
#ma7alak-search-results{flex:1;min-height:120px;padding:7px 10px 14px;overflow-y:auto;overscroll-behavior:contain;}
#ma7alak-search-results::-webkit-scrollbar{width:6px;}
#ma7alak-search-results::-webkit-scrollbar-thumb{border-radius:99px;background:rgba(217,164,65,.25);}
.ma7alak-search-result{
  width:100%;
  display:flex;
  align-items:center;
  gap:12px;
  padding:10px;
  border:1px solid transparent;
  border-radius:16px;
  color:#fff;
  text-decoration:none!important;
  transition:.16s ease;
}
.ma7alak-search-result:hover{background:rgba(255,255,255,.045);border-color:rgba(217,164,65,.13);transform:translateX(2px);}
.ma7alak-search-result-img{width:48px;height:48px;flex:0 0 48px;object-fit:cover;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:#181a1b;}
.ma7alak-search-result-fallback{width:48px;height:48px;flex:0 0 48px;display:flex;align-items:center;justify-content:center;border-radius:13px;border:1px solid rgba(217,164,65,.15);background:linear-gradient(145deg,#222426,#101112);color:var(--m7-gold-soft);font-family:Georgia,"Times New Roman",serif;font-weight:900;}
.ma7alak-search-result-copy{min-width:0;flex:1;}
.ma7alak-search-result-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:800;}
.ma7alak-search-result-meta{margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.42);font-size:10px;font-weight:650;}
.ma7alak-search-result-arrow{width:34px;height:34px;display:flex;align-items:center;justify-content:center;flex:0 0 34px;border-radius:11px;background:rgba(255,255,255,.035);color:var(--m7-gold-soft);font-size:18px;}
.ma7alak-search-empty{min-height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;}
.ma7alak-search-empty-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;border:1px solid rgba(217,164,65,.16);border-radius:15px;background:rgba(217,164,65,.05);color:var(--m7-gold-soft);}
.ma7alak-search-empty-title{color:rgba(255,255,255,.75);font-size:13px;font-weight:800;}
.ma7alak-search-empty-text{margin-top:5px;color:rgba(255,255,255,.34);font-size:10px;}

#ma7alak-mobile-search-button{display:none;}

@media(max-width:900px){
  :root{--m7-header-h:64px;}
  body.ma7alak-header-page{padding-top:calc(var(--m7-header-h) + 16px)!important;}

  #ma7alak-header-theme-backdrop{
    height:calc(var(--m7-header-h) + 48px);
    background:
      radial-gradient(
        circle at 8% 16%,
        rgba(125,33,23,.32) 0,
        rgba(125,33,23,.12) 25%,
        transparent 52%
      ),
      radial-gradient(
        circle at 88% 12%,
        rgba(217,164,65,.17) 0,
        rgba(217,164,65,.06) 24%,
        transparent 48%
      ),
      linear-gradient(
        180deg,
        rgba(8,9,11,.99) 0%,
        rgba(12,12,14,.97) 55%,
        rgba(13,13,15,.82) 80%,
        rgba(13,13,15,0) 100%
      );
  }

  #ma7alak-social-header{
    top:max(8px,env(safe-area-inset-top));
    width:calc(100vw - 14px);
    min-height:60px;
    grid-template-columns:auto 1fr auto auto;
    gap:4px;
    padding:5px 7px 5px 12px;

    border-radius:22px!important;
    border:1px solid rgba(217,164,65,.22)!important;

    background:
      linear-gradient(
        180deg,
        rgba(24,25,27,.92),
        rgba(10,11,12,.90)
      )!important;

    box-shadow:
      0 12px 30px rgba(0,0,0,.38),
      0 1px 0 rgba(255,255,255,.035) inset!important;

    backdrop-filter:blur(18px) saturate(125%)!important;
    -webkit-backdrop-filter:blur(18px) saturate(125%)!important;
  }

  #ma7alak-social-header.ma7alak-scrolled{
    border-color:rgba(217,164,65,.34)!important;
    background:
      linear-gradient(
        180deg,
        rgba(20,21,23,.97),
        rgba(7,8,9,.96)
      )!important;
    box-shadow:
      0 15px 36px rgba(0,0,0,.48),
      0 0 18px rgba(217,164,65,.035)!important;
  }
  .ma7alak-header-brand{
    min-width:96px;
    width:96px;
    height:56px;
    padding:0 6px 0 4px;
    justify-content:center;
  }

  .ma7alak-header-logo{
    height:54px;
    max-width:90px;
  }

  #ma7alak-header-menu-button{
    width:40px;
    height:40px;
    flex-basis:40px;
    border-radius:13px;
  }

  #ma7alak-header-menu-panel{
    width:min(230px,calc(100vw - 28px));
    top:calc(100% + 10px);
    right:0;
  }
  .ma7alak-header-search-wrap{display:none;}
  .ma7alak-header-nav{justify-content:flex-end;height:48px;}
  .ma7alak-header-nav-item{min-width:45px;width:45px;height:48px;border-radius:13px;}
  .ma7alak-header-nav-icon,.ma7alak-header-nav-icon svg{width:22px;height:22px;}
  #ma7alak-reels-badge{top:1px;right:3px;min-width:17px;height:17px;font-size:9px;padding:0 4px;}
  .ma7alak-header-nav-label,.ma7alak-integrated-label{display:none;}
  .ma7alak-header-nav-item::after{bottom:-5px;}
  .ma7alak-header-nav-item.ma7alak-active::after,.ma7alak-header-nav-item:hover::after{width:22px;}
  #ma7alak-mobile-search-button{display:flex;}
  #ma7alak-header-likes-slot,#ma7alak-header-notification-slot{min-width:45px;width:45px;height:48px;justify-content:center;padding:0;}
  #ma7alak-social-header #ma7alak-story-likes-button,#ma7alak-social-header #ma7alak-notification-bell{width:38px!important;height:38px!important;min-width:38px!important;min-height:38px!important;border-radius:12px!important;}
  #ma7alak-header-owner{min-width:0;width:47px;height:48px;flex:0 0 47px;padding:0 0 0 5px;border-left:1px solid rgba(255,255,255,.08);border-radius:0;}
  .ma7alak-owner-avatar-wrap{
    width:40px;
    height:40px;
    flex-basis:40px;
    transform-origin:center center;
  }
  #ma7alak-social-header .ma7alak-owner-avatar-wrap{
    animation:ma7alakOwnerCircleSpin 8s linear infinite!important;
    -webkit-animation:ma7alakOwnerCircleSpin 8s linear infinite!important;
  }

  .ma7alak-owner-copy{display:none;}
  #ma7alak-header-search-panel{top:max(78px,calc(env(safe-area-inset-top) + 68px));width:calc(100vw - 14px);max-height:calc(100dvh - 92px);border-radius:20px;}
  .ma7alak-search-panel-head{padding:10px;}
  .ma7alak-search-panel-title{padding-top:12px;}
}

@media(max-width:480px){
  .ma7alak-header-brand{
    width:88px;
    min-width:88px;
    height:54px;
    padding-left:4px;
    padding-right:6px;
  }

  .ma7alak-header-logo{
    height:51px;
    max-width:82px;
  }
  .ma7alak-header-nav-item{min-width:42px;width:42px;}
  #ma7alak-header-likes-slot,#ma7alak-header-notification-slot{min-width:42px;width:42px;}
  #ma7alak-header-owner{width:43px;flex-basis:43px;}
  .ma7alak-owner-avatar-wrap{
    width:38px;
    height:38px;
    flex-basis:38px;
    transform-origin:center center;
  }
}

@media(prefers-reduced-motion:reduce){
  #ma7alak-social-header *,
  #ma7alak-header-search-overlay *{
    animation:none!important;
    transition:none!important;
  }

  /*
     IMPORTANT:
     The owner's decorative gold ring is intentionally kept animated.
     This selector is more specific than the rule above, so mobile
     reduced-motion settings cannot accidentally stop the ring.
  */
  #ma7alak-social-header .ma7alak-owner-avatar-wrap{
    animation:ma7alakOwnerCircleSpin 8s linear infinite!important;
    -webkit-animation:ma7alakOwnerCircleSpin 8s linear infinite!important;
  }
}
    

/* =========================================================
   V15 — NAV ORDER + OWNER SHOP CIRCLE TUNING
========================================================= */

#ma7alak-header-owner.visible{
  margin-right:10px;
}

#ma7alak-header-owner .ma7alak-owner-avatar-wrap{
  width:54px!important;
  height:54px!important;
  flex:0 0 54px!important;
}

@media(max-width:760px){
  #ma7alak-header-owner.visible{
    margin-right:12px!important;
    width:55px!important;
    flex-basis:55px!important;
  }

  #ma7alak-header-owner .ma7alak-owner-avatar-wrap{
    width:52px!important;
    height:52px!important;
    flex:0 0 52px!important;
  }
}

@media(max-width:480px){
  #ma7alak-header-owner.visible{
    margin-right:11px!important;
    width:54px!important;
    flex-basis:54px!important;
  }

  #ma7alak-header-owner .ma7alak-owner-avatar-wrap{
    width:52px!important;
    height:52px!important;
    flex:0 0 52px!important;
  }
}

@media(max-width:390px){
  #ma7alak-header-owner.visible{
    margin-right:9px!important;
    width:52px!important;
    flex-basis:52px!important;
  }

  #ma7alak-header-owner .ma7alak-owner-avatar-wrap{
    width:50px!important;
    height:50px!important;
    flex:0 0 50px!important;
  }
}

/* =========================================================
   V24 — PHONE HEADER MICRO-TUNING ONLY
   ========================================================= */

/* Heart/Likes is owner-only. It stays hidden until shop ownership is confirmed. */
#ma7alak-header-likes-slot{
  display:none!important;
}
body.ma7alak-owner-heart-visible #ma7alak-header-likes-slot{
  display:flex!important;
}

/* Slightly larger Reels glyph so it visually matches the other phone icons. */
#ma7alak-header-reels .ma7alak-header-nav-icon,
#ma7alak-header-reels .ma7alak-header-nav-icon svg{
  width:24px!important;
  height:24px!important;
}

/* Very light animated theme glow that travels around the header panel border. */
@property --m7-panel-glow-angle{
  syntax:"<angle>";
  inherits:false;
  initial-value:0deg;
}

#ma7alak-social-header{
  isolation:isolate;
}

#ma7alak-social-header::before{
  content:"";
  position:absolute;
  inset:-1px;
  border-radius:inherit;
  padding:1.15px;
  pointer-events:none;
  z-index:0;
  opacity:.72;
  background:
    conic-gradient(
      from var(--m7-panel-glow-angle),
      transparent 0deg,
      transparent 250deg,
      rgba(120,31,24,.05) 270deg,
      rgba(217,164,65,.28) 291deg,
      rgba(255,226,158,.40) 301deg,
      rgba(217,164,65,.18) 312deg,
      rgba(120,31,24,.04) 328deg,
      transparent 346deg,
      transparent 360deg
    );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask-composite:exclude;
  animation:ma7alakPanelGlowOrbit 7.5s linear infinite;
  -webkit-animation:ma7alakPanelGlowOrbit 7.5s linear infinite;
}

#ma7alak-social-header > *{
  position:relative;
  z-index:1;
}

@keyframes ma7alakPanelGlowOrbit{
  from{--m7-panel-glow-angle:0deg;}
  to{--m7-panel-glow-angle:360deg;}
}

@-webkit-keyframes ma7alakPanelGlowOrbit{
  from{--m7-panel-glow-angle:0deg;}
  to{--m7-panel-glow-angle:360deg;}
}

/* PHONE-FIRST: enlarge the left Ma7alak/eye mark and move it closer to the left
   edge while keeping a safe gap from the rounded panel corner. */
@media(max-width:900px){
  .ma7alak-header-brand{
    min-width:100px!important;
    width:100px!important;
    padding-left:1px!important;
    padding-right:6px!important;
    margin-left:-3px!important;
  }

  .ma7alak-header-logo{
    height:58px!important;
    max-width:96px!important;
  }

  /* Shop/owner circle stays clearly smaller than the left Ma7alak circle. */
  #ma7alak-header-owner.visible{
    width:51px!important;
    flex-basis:51px!important;
    margin-right:13px!important;
  }

  #ma7alak-header-owner .ma7alak-owner-avatar-wrap{
    width:48px!important;
    height:48px!important;
    flex:0 0 48px!important;
  }
}

@media(max-width:390px){
  .ma7alak-header-brand{
    min-width:94px!important;
    width:94px!important;
    margin-left:-2px!important;
  }

  .ma7alak-header-logo{
    height:55px!important;
    max-width:90px!important;
  }

  #ma7alak-header-owner.visible{
    width:48px!important;
    flex-basis:48px!important;
    margin-right:10px!important;
  }

  #ma7alak-header-owner .ma7alak-owner-avatar-wrap{
    width:45px!important;
    height:45px!important;
    flex:0 0 45px!important;
  }
}


/* =========================================================
   INLINE OWNER LOGIN / LOGOUT — SAME PAGE
========================================================= */
#ma7alak-login-overlay{
  position:fixed;
  inset:0;
  width:100vw;
  height:100vh;
  height:100dvh;
  display:none;
  align-items:center;
  justify-content:center;
  padding:max(16px,env(safe-area-inset-top)) 14px max(16px,env(safe-area-inset-bottom));
  background:rgba(0,0,0,.74);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  z-index:2147483647;
}

#ma7alak-login-overlay.open{
  display:flex;
  animation:ma7alakLoginFade .18s ease-out;
}

@keyframes ma7alakLoginFade{
  from{opacity:0}
  to{opacity:1}
}

#ma7alak-login-panel{
  position:relative;
  width:min(430px,100%);
  overflow:hidden;
  padding:34px 22px 22px;
  border:1px solid rgba(217,164,65,.25);
  border-radius:26px;
  background:
    radial-gradient(circle at 12% 0%,rgba(217,164,65,.10),transparent 32%),
    linear-gradient(180deg,rgba(25,26,28,.99),rgba(9,10,11,.99));
  box-shadow:
    0 30px 80px rgba(0,0,0,.72),
    inset 0 1px 0 rgba(255,255,255,.05);
  color:#fff;
}

#ma7alak-login-close{
  position:absolute;
  top:12px;
  right:12px;
  width:38px;
  height:38px;
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  background:rgba(255,255,255,.045);
  color:#fff;
  font-size:25px;
  line-height:1;
  cursor:pointer;
}

.ma7alak-login-brand{
  margin-bottom:22px;
  text-align:center;
}

.ma7alak-login-brand-small{
  margin-bottom:8px;
  color:var(--m7-gold-soft);
  font-size:9px;
  font-weight:900;
  letter-spacing:1.5px;
}

#ma7alak-login-title{
  margin:0;
  color:#fff;
  font-size:27px;
  line-height:1.12;
}

#ma7alak-login-title span{
  color:var(--m7-gold-soft);
}

.ma7alak-login-brand p{
  margin:9px auto 0;
  max-width:330px;
  color:rgba(255,255,255,.48);
  font-size:11px;
  line-height:1.5;
}

.ma7alak-login-label{
  display:block;
  margin:13px 2px 7px;
  color:rgba(255,255,255,.67);
  font-size:10px;
  font-weight:800;
}

.ma7alak-login-input-wrap{
  position:relative;
}

.ma7alak-login-input{
  width:100%;
  height:54px;
  padding:0 46px 0 16px;
  border:1px solid rgba(255,255,255,.10);
  border-radius:16px;
  outline:none;
  background:rgba(255,255,255,.05);
  color:#fff;
  font-size:14px;
  font-weight:650;
}

.ma7alak-login-input:focus{
  border-color:rgba(217,164,65,.50);
  box-shadow:0 0 0 3px rgba(217,164,65,.07);
}

#ma7alak-login-password-toggle{
  position:absolute;
  top:50%;
  right:10px;
  transform:translateY(-50%);
  width:36px;
  height:36px;
  border:0;
  border-radius:10px;
  background:transparent;
  color:rgba(255,255,255,.55);
  cursor:pointer;
  font-size:17px;
}

.ma7alak-inline-login-message{
  min-height:18px;
  margin:12px 2px 0;
  font-size:10px;
  font-weight:750;
  line-height:1.4;
}

.ma7alak-inline-login-message.error{
  color:#ff7777;
}

.ma7alak-inline-login-message.success{
  color:#8de39d;
}

#ma7alak-inline-login-button{
  width:100%;
  min-height:54px;
  margin-top:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  border:1px solid rgba(239,198,110,.42);
  border-radius:16px;
  background:
    linear-gradient(180deg,rgba(217,164,65,.95),rgba(156,105,26,.96));
  color:#100d08;
  font-size:13px;
  font-weight:900;
  cursor:pointer;
  box-shadow:0 10px 24px rgba(217,164,65,.12);
}

#ma7alak-inline-login-button:disabled{
  opacity:.65;
  cursor:wait;
}

#ma7alak-inline-login-spinner{
  width:16px;
  height:16px;
  display:none;
  border:2px solid rgba(16,13,8,.25);
  border-top-color:#100d08;
  border-radius:50%;
  animation:ma7alakLoginSpin .7s linear infinite;
}

@keyframes ma7alakLoginSpin{
  to{transform:rotate(360deg)}
}

@media(max-width:480px){
  #ma7alak-login-panel{
    padding:31px 16px 18px;
    border-radius:23px;
  }

  #ma7alak-login-title{
    font-size:25px;
  }

  .ma7alak-login-brand p{
    font-size:11px;
  }

  .ma7alak-login-input{
    height:52px;
    font-size:14px;
  }

  #ma7alak-inline-login-button{
    min-height:53px;
  }
}

`;

    document.head.appendChild(style);
  }


  function injectHeaderHTML(){
    if(
      document.getElementById(
        "ma7alak-social-header"
      )
    ){
      return;
    }

    document.body.classList.add(
      "ma7alak-header-page"
    );

    /*
      Theme backdrop is separate from the fixed header.
      Because it is position:absolute, it stays at page-top and
      disappears naturally when the visitor scrolls down.
    */
    if(
      !document.getElementById(
        "ma7alak-header-theme-backdrop"
      )
    ){
      const themeBackdrop =
        document.createElement("div");

      themeBackdrop.id =
        "ma7alak-header-theme-backdrop";

      themeBackdrop.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.insertBefore(
        themeBackdrop,
        document.body.firstChild
      );
    }

    const holder =
      document.createElement("div");

    holder.id =
      "ma7alak-premium-header-root";

    holder.innerHTML = `
<header id="ma7alak-social-header">
  <a class="ma7alak-header-brand" href="https://ma7alak.com/" aria-label="Ma7alak Home">
    <img
      class="ma7alak-header-logo"
      src="https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/020e2776-1fe4-4b32-9ac0-8e1358911397-removebg-preview.png?auto=format,compress&w=264&fit=max"
      alt="Ma7alak"
      width="264"
      height="88"
      decoding="async"
      fetchpriority="low"
    >
  </a>

  <div class="ma7alak-header-search-wrap">
    <svg class="ma7alak-header-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.9"/>
      <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
    </svg>
    <input id="ma7alak-header-search" type="search" autocomplete="off" placeholder="Search shops, categories, or locations..." aria-label="Search Ma7alak">
    <div class="ma7alak-header-search-kbd">⌘ K</div>
  </div>

  <nav class="ma7alak-header-nav" aria-label="Main navigation">
    <div id="ma7alak-header-likes-slot" aria-label="Story Likes">
      <button
        id="ma7alak-instant-likes-placeholder"
        type="button"
        aria-label="Story Likes"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s-7.1-4.35-9.45-8.38C.75 9.54 1.4 5.7 4.65 4.35c2.06-.86 4.3-.2 5.7 1.45L12 7.72l1.65-1.92c1.4-1.65 3.64-2.31 5.7-1.45 3.25 1.35 3.9 5.19 2.1 8.27C19.1 16.65 12 21 12 21Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <span class="ma7alak-integrated-label">Likes</span>
    </div>

    <button id="ma7alak-header-reels" class="ma7alak-header-nav-item" type="button" aria-label="Reels">
      <span class="ma7alak-header-nav-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="4" width="17" height="16" rx="4" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 4L11 8M14 4L17 8M3.8 8H20.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          <path d="M10 11.2L15.1 14L10 16.8V11.2Z" fill="currentColor"/>
        </svg>
      </span>
      <span id="ma7alak-reels-badge" aria-hidden="true">0</span>
      <span class="ma7alak-header-nav-label">Reels</span>
    </button>

    <div id="ma7alak-header-notification-slot" aria-label="Notifications">
      <span class="ma7alak-integrated-label">Notifications</span>
    </div>

    <button id="ma7alak-mobile-search-button" class="ma7alak-header-nav-item" type="button" aria-label="Search">
      <span class="ma7alak-header-nav-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.9"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="ma7alak-header-nav-label">Search</span>
    </button>
  </nav>

  <a id="ma7alak-header-owner" href="#" aria-label="Open your shop">
    <div class="ma7alak-owner-avatar-wrap">
      <div class="ma7alak-owner-avatar-inner">
        <img id="ma7alak-header-owner-image" class="ma7alak-owner-avatar" src="" alt="">
        <div id="ma7alak-header-owner-fallback" class="ma7alak-owner-avatar-fallback">M</div>
      </div>
    </div>
    <div class="ma7alak-owner-copy">
      <div id="ma7alak-header-owner-name">Your Shop</div>
      <div class="ma7alak-owner-sub">View Your Page →</div>
    </div>
  </a>

  <div class="ma7alak-header-menu-wrap">
    <button
      id="ma7alak-header-menu-button"
      type="button"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="ma7alak-header-menu-panel"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div id="ma7alak-header-menu-panel" aria-hidden="true">

      <a
        class="ma7alak-header-menu-link"
        href="https://ma7alak.com/dhyf-mhlk-"
      >
        <span class="ma7alak-header-menu-icon">＋</span>
        <span class="ma7alak-header-menu-text">
          <span class="ma7alak-header-menu-main">ضيف محلك</span>
          <span class="ma7alak-header-menu-sub">Add your shop</span>
        </span>
      </a>

      <a
        class="ma7alak-header-menu-link"
        href="https://ma7alak.com/shwf-almhlat-"
      >
        <span class="ma7alak-header-menu-icon">⌕</span>
        <span class="ma7alak-header-menu-text">
          <span class="ma7alak-header-menu-main">شوف المحلات</span>
          <span class="ma7alak-header-menu-sub">Explore shops</span>
        </span>
      </a>

      <a
        id="ma7alak-header-auth-action"
        class="ma7alak-header-menu-link"
        href="#"
        role="button"
        aria-label="Login"
        data-auth-state="login"
      >
        <span id="ma7alak-header-auth-icon" class="ma7alak-header-menu-icon">↪</span>
        <span class="ma7alak-header-menu-text">
          <span id="ma7alak-header-auth-main" class="ma7alak-header-menu-main">Login</span>
          <span id="ma7alak-header-auth-sub" class="ma7alak-header-menu-sub">Shop owner access</span>
        </span>
      </a>

    </div>
  </div>
</header>


<div id="ma7alak-login-overlay" aria-hidden="true">
  <div id="ma7alak-login-panel" role="dialog" aria-modal="true" aria-labelledby="ma7alak-login-title">
    <button id="ma7alak-login-close" type="button" aria-label="Close login">×</button>

    <div class="ma7alak-login-brand">
      <div class="ma7alak-login-brand-small">MA7ALAK FOR BUSINESS</div>
      <h2 id="ma7alak-login-title">Marhaba to <span>Ma7alak</span></h2>
      <p>Sign in to manage your shop, Stories, photos and videos.</p>
    </div>

    <form id="ma7alak-inline-login-form" autocomplete="on">
      <label class="ma7alak-login-label" for="ma7alak-login-email">Email</label>
      <div class="ma7alak-login-input-wrap">
        <input
          id="ma7alak-login-email"
          class="ma7alak-login-input"
          type="email"
          placeholder="example@email.com"
          autocomplete="email"
          required
        >
      </div>

      <label class="ma7alak-login-label" for="ma7alak-login-password">Password</label>
      <div class="ma7alak-login-input-wrap">
        <input
          id="ma7alak-login-password"
          class="ma7alak-login-input"
          type="password"
          placeholder="Your password"
          autocomplete="current-password"
          required
        >
        <button id="ma7alak-login-password-toggle" type="button" aria-label="Show password">◉</button>
      </div>

      <div id="ma7alak-inline-login-message" class="ma7alak-inline-login-message"></div>

      <button id="ma7alak-inline-login-button" type="submit">
        <span id="ma7alak-inline-login-spinner" aria-hidden="true"></span>
        <span id="ma7alak-inline-login-button-text">Log In</span>
      </button>
    </form>
  </div>
</div>

<div id="ma7alak-header-search-overlay" aria-hidden="true">
  <div id="ma7alak-header-search-panel" role="dialog" aria-modal="true" aria-label="Search shops">
    <div class="ma7alak-search-panel-head">
      <div class="ma7alak-search-panel-field">
        <svg class="ma7alak-overlay-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.9"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </svg>
        <input id="ma7alak-overlay-search-input" type="search" autocomplete="off" placeholder="Search Ma7alak shops..." aria-label="Search shops">
        <button id="ma7alak-search-clear" type="button" aria-label="Clear search">×</button>
      </div>
      <button id="ma7alak-search-close" type="button" aria-label="Close search">×</button>
    </div>
    <div class="ma7alak-search-panel-title">Shops</div>
    <div id="ma7alak-search-results"></div>
  </div>
</div>
    `;

    document.body.appendChild(holder);
  }


  whenBodyReady(async function(){

    injectHeaderCSS();
    injectHeaderHTML();

    try{
      await loadSupabase();
    }
    catch(error){
      console.error(
        "MA7ALAK header Supabase loader:",
        error
      );
    }


    /* =========================================================
       ORIGINAL HEADER FUNCTIONALITY
       ========================================================= */

"use strict";

  const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  let client=null;
  let shopProfiles=[];
  let ownerShop=null;
  let searchTimer=null;

  function getClient(){
    if(client){return client;}
    if(!window.supabase||typeof window.supabase.createClient!=="function"){return null;}
    client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    return client;
  }

  function escapeHTML(value){
    return String(value==null?"":value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function prettyShopName(slug){
    return String(slug||"Shop")
      .split("-")
      .filter(Boolean)
      .map(function(part){return part.charAt(0).toUpperCase()+part.slice(1);})
      .join(" ");
  }

  function initials(name){
    const parts=String(name||"M").trim().split(/\s+/).filter(Boolean);
    if(!parts.length){return "M";}
    return parts.slice(0,2).map(function(part){return part.charAt(0).toUpperCase();}).join("");
  }

  function integrateExistingControls(){
    const likesSlot=document.getElementById("ma7alak-header-likes-slot");
    const notificationSlot=document.getElementById("ma7alak-header-notification-slot");
    const likesWrapper=document.getElementById("ma7alak-story-likes-wrapper");
    const notificationWrapper=document.getElementById("ma7alak-notification-wrapper");
    const instantHeart=document.getElementById("ma7alak-instant-likes-placeholder");

    if(likesSlot&&likesWrapper&&likesWrapper.parentNode!==likesSlot){
      const label=likesSlot.querySelector(".ma7alak-integrated-label");
      likesSlot.insertBefore(likesWrapper,label||null);
    }

    /*
      As soon as the real Story Likes control exists, remove the
      temporary instant heart. No flicker / second icon remains.
    */
    if(likesWrapper&&instantHeart){
      instantHeart.remove();
    }

    if(notificationSlot&&notificationWrapper&&notificationWrapper.parentNode!==notificationSlot){
      const label=notificationSlot.querySelector(".ma7alak-integrated-label");
      notificationSlot.insertBefore(notificationWrapper,label||null);
    }
  }

  function setupInstantHeart(){
    const instantHeart=document.getElementById("ma7alak-instant-likes-placeholder");
    if(!instantHeart){return;}

    instantHeart.addEventListener("click",function(event){
      event.preventDefault();
      event.stopPropagation();

      integrateExistingControls();

      const realButton=document.getElementById("ma7alak-story-likes-button");

      if(realButton){
        realButton.click();
        return;
      }

      /*
        The GitHub Likes script may still be finishing its first load.
        Retry briefly so a very fast tap right after refresh still works.
      */
      let tries=0;
      const retry=setInterval(function(){
        tries++;
        integrateExistingControls();

        const button=document.getElementById("ma7alak-story-likes-button");

        if(button){
          clearInterval(retry);
          button.click();
          return;
        }

        if(tries>=20){
          clearInterval(retry);
        }
      },100);
    });
  }

  function startControlIntegrationWatcher(){
    integrateExistingControls();

    const observer=new MutationObserver(function(){
      integrateExistingControls();
    });

    observer.observe(
      document.documentElement,
      {childList:true,subtree:true}
    );

    /*
      Very fast checks during initial page boot so the real heart snaps
      into the header almost immediately after its GitHub script creates it.
    */
    let fastTries=0;
    const fastTimer=setInterval(function(){
      fastTries++;
      integrateExistingControls();
      if(fastTries>=50){clearInterval(fastTimer);}
    },50);

    let tries=0;
    const timer=setInterval(function(){
      tries++;
      integrateExistingControls();
      if(tries>=60){clearInterval(timer);}
    },500);
  }

  async function loadOwnerProfile(){
    const supabaseClient=getClient();
    if(!supabaseClient){return;}

    try{
      const sessionResult=await supabaseClient.auth.getSession();
      const session=sessionResult&&sessionResult.data&&sessionResult.data.session;

      if(!session||!session.user){hideOwnerProfile();return;}

      const ownerResult=await supabaseClient
        .from("shop_owners")
        .select("shop_slug")
        .eq("user_id",session.user.id)
        .limit(1)
        .maybeSingle();

      if(ownerResult.error||!ownerResult.data||!ownerResult.data.shop_slug){
        hideOwnerProfile();
        return;
      }

      const slug=String(ownerResult.data.shop_slug).trim();

      const profileResult=await supabaseClient
        .from("shop_profiles")
        .select("shop_slug,shop_name,profile_image_url")
        .eq("shop_slug",slug)
        .maybeSingle();

      const profile=(profileResult&&!profileResult.error&&profileResult.data)
        ? profileResult.data
        : {shop_slug:slug,shop_name:prettyShopName(slug),profile_image_url:""};

      ownerShop={
        shop_slug:slug,
        shop_name:profile.shop_name||prettyShopName(slug),
        profile_image_url:profile.profile_image_url||""
      };

      renderOwnerProfile();
    }
    catch(error){
      console.error("MA7ALAK header owner profile:",error);
      hideOwnerProfile();
    }
  }

  function hideOwnerProfile(){
    ownerShop=null;
    document.body.classList.remove("ma7alak-owner-heart-visible");
    const owner=document.getElementById("ma7alak-header-owner");
    if(owner){owner.classList.remove("visible");owner.removeAttribute("href");}
  }

  function renderOwnerProfile(){
    if(!ownerShop){hideOwnerProfile();return;}

    const owner=document.getElementById("ma7alak-header-owner");
    const name=document.getElementById("ma7alak-header-owner-name");
    const image=document.getElementById("ma7alak-header-owner-image");
    const fallback=document.getElementById("ma7alak-header-owner-fallback");
    if(!owner){return;}

    owner.href="/"+encodeURIComponent(ownerShop.shop_slug);
    if(name){name.textContent=ownerShop.shop_name;}

    if(image&&fallback){
      if(ownerShop.profile_image_url){
        image.style.display="block";
        fallback.style.display="none";
        image.src=ownerShop.profile_image_url;
        image.alt=ownerShop.shop_name;
        image.onerror=function(){
          image.style.display="none";
          fallback.style.display="flex";
          fallback.textContent=initials(ownerShop.shop_name);
        };
      }else{
        image.style.display="none";
        fallback.style.display="flex";
        fallback.textContent=initials(ownerShop.shop_name);
      }
    }

    owner.classList.add("visible");
    document.body.classList.add("ma7alak-owner-heart-visible");
  }

  async function loadShopProfiles(){
    const supabaseClient=getClient();
    if(!supabaseClient){return [];}

    try{
      const result=await supabaseClient
        .from("shop_profiles")
        .select("shop_slug,shop_name,profile_image_url")
        .order("shop_name",{ascending:true});

      if(result.error){throw result.error;}
      shopProfiles=(result.data||[]).filter(function(shop){return shop&&shop.shop_slug;});
      return shopProfiles;
    }
    catch(error){
      console.error("MA7ALAK header shop search:",error);
      shopProfiles=[];
      return [];
    }
  }

  function openSearch(initialValue){
    const overlay=document.getElementById("ma7alak-header-search-overlay");
    const input=document.getElementById("ma7alak-overlay-search-input");
    if(!overlay||!input){return;}

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";
    input.value=String(initialValue||"");
    renderSearchResults(input.value);
    setTimeout(function(){input.focus();input.select();},50);
  }

  function closeSearch(){
    const overlay=document.getElementById("ma7alak-header-search-overlay");
    if(!overlay){return;}
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow="";
    document.body.style.overflow="";
  }

  function renderSearchResults(query){
    const results=document.getElementById("ma7alak-search-results");
    if(!results){return;}

    const normalized=String(query||"").trim().toLowerCase();
    let matches=shopProfiles.slice();

    if(normalized){
      matches=shopProfiles.filter(function(shop){
        const haystack=(String(shop.shop_name||"")+" "+String(shop.shop_slug||"")).toLowerCase();
        return haystack.includes(normalized);
      });
    }

    matches=matches.slice(0,12);

    if(!matches.length){
      results.innerHTML=`
        <div class="ma7alak-search-empty">
          <div class="ma7alak-search-empty-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ma7alak-search-empty-title">No shops found</div>
          <div class="ma7alak-search-empty-text">Try another shop name.</div>
        </div>`;
      return;
    }

    results.innerHTML=matches.map(function(shop){
      const slug=String(shop.shop_slug);
      const name=String(shop.shop_name||prettyShopName(slug));
      const image=String(shop.profile_image_url||"");
      const mediaHTML=image
        ? `<img class="ma7alak-search-result-img" src="${escapeHTML(image)}" alt="${escapeHTML(name)}" loading="lazy">`
        : `<div class="ma7alak-search-result-fallback">${escapeHTML(initials(name))}</div>`;

      return `
        <a class="ma7alak-search-result" href="/${encodeURIComponent(slug)}">
          ${mediaHTML}
          <div class="ma7alak-search-result-copy">
            <div class="ma7alak-search-result-name">${escapeHTML(name)}</div>
            <div class="ma7alak-search-result-meta">View shop on Ma7alak</div>
          </div>
          <div class="ma7alak-search-result-arrow">→</div>
        </a>`;
    }).join("");
  }

  function setupSearchEvents(){
    const desktopInput=document.getElementById("ma7alak-header-search");
    const mobileButton=document.getElementById("ma7alak-mobile-search-button");
    const overlayInput=document.getElementById("ma7alak-overlay-search-input");
    const closeButton=document.getElementById("ma7alak-search-close");
    const clearButton=document.getElementById("ma7alak-search-clear");
    const overlay=document.getElementById("ma7alak-header-search-overlay");

    if(desktopInput){
      desktopInput.addEventListener("focus",function(){openSearch(desktopInput.value);});
      desktopInput.addEventListener("keydown",function(event){
        if(event.key==="Enter"){event.preventDefault();openSearch(desktopInput.value);}
      });
    }

    if(mobileButton){mobileButton.addEventListener("click",function(){openSearch("");});}

    if(overlayInput){
      overlayInput.addEventListener("input",function(){
        clearTimeout(searchTimer);
        searchTimer=setTimeout(function(){renderSearchResults(overlayInput.value);},70);
      });
    }

    if(clearButton){
      clearButton.addEventListener("click",function(){
        if(!overlayInput){return;}
        overlayInput.value="";
        overlayInput.focus();
        renderSearchResults("");
      });
    }

    if(closeButton){closeButton.addEventListener("click",closeSearch);}

    if(overlay){
      overlay.addEventListener("click",function(event){if(event.target===overlay){closeSearch();}});
    }

    document.addEventListener("keydown",function(event){
      if((event.ctrlKey||event.metaKey)&&String(event.key).toLowerCase()==="k"){
        event.preventDefault();
        openSearch("");
        return;
      }
      if(event.key==="Escape"&&overlay&&overlay.classList.contains("open")){closeSearch();}
    });
  }


  /* =========================================================
     INLINE OWNER LOGIN / LOGOUT
     Opens over the CURRENT page. Never navigates to /login.
  ========================================================= */

  function getHeaderAuthElements(){
    return {
      action:document.getElementById("ma7alak-header-auth-action"),
      icon:document.getElementById("ma7alak-header-auth-icon"),
      main:document.getElementById("ma7alak-header-auth-main"),
      sub:document.getElementById("ma7alak-header-auth-sub")
    };
  }

  function setHeaderAuthState(loggedIn){
    const auth=getHeaderAuthElements();
    if(!auth.action){return;}

    auth.action.dataset.authState=loggedIn ? "logout" : "login";
    auth.action.setAttribute("aria-label",loggedIn ? "Logout" : "Login");

    if(auth.icon){
      auth.icon.textContent=loggedIn ? "↩" : "↪";
    }

    if(auth.main){
      auth.main.textContent=loggedIn ? "Logout" : "Login";
    }

    if(auth.sub){
      auth.sub.textContent=loggedIn
        ? "Sign out of your shop"
        : "Shop owner access";
    }
  }

  async function refreshHeaderAuthState(){
    const supabaseClient=getClient();

    if(!supabaseClient){
      setHeaderAuthState(false);
      return false;
    }

    try{
      const result=await supabaseClient.auth.getSession();
      const loggedIn=Boolean(
        result &&
        result.data &&
        result.data.session &&
        result.data.session.user
      );

      setHeaderAuthState(loggedIn);
      return loggedIn;
    }
    catch(error){
      console.error("MA7ALAK header auth state:",error);
      setHeaderAuthState(false);
      return false;
    }
  }

  function clearInlineLoginMessage(){
    const message=document.getElementById("ma7alak-inline-login-message");
    if(!message){return;}
    message.textContent="";
    message.className="ma7alak-inline-login-message";
  }

  function showInlineLoginMessage(messageText,type){
    const message=document.getElementById("ma7alak-inline-login-message");
    if(!message){return;}
    message.textContent=String(messageText||"");
    message.className="ma7alak-inline-login-message "+(type||"error");
  }

  function setInlineLoginLoading(loading){
    const button=document.getElementById("ma7alak-inline-login-button");
    const label=document.getElementById("ma7alak-inline-login-button-text");
    const spinner=document.getElementById("ma7alak-inline-login-spinner");

    if(button){button.disabled=Boolean(loading);}
    if(label){label.textContent=loading ? "Signing in..." : "Log In";}
    if(spinner){spinner.style.display=loading ? "block" : "none";}
  }

  function openInlineLogin(){
    const overlay=document.getElementById("ma7alak-login-overlay");
    const email=document.getElementById("ma7alak-login-email");

    if(!overlay){return;}

    clearInlineLoginMessage();
    setInlineLoginLoading(false);

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");

    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";

    setTimeout(function(){
      if(email){email.focus();}
    },60);
  }

  function closeInlineLogin(){
    const overlay=document.getElementById("ma7alak-login-overlay");
    if(!overlay){return;}

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");

    document.documentElement.style.overflow="";
    document.body.style.overflow="";
  }

  async function verifyInlineShopOwner(userId){
    const supabaseClient=getClient();

    if(!supabaseClient){
      return {
        success:false,
        error:"Could not connect. Please try again."
      };
    }

    try{
      const ownerResult=await supabaseClient
        .from("shop_owners")
        .select("shop_slug")
        .eq("user_id",userId)
        .limit(1)
        .maybeSingle();

      if(
        ownerResult.error ||
        !ownerResult.data ||
        !ownerResult.data.shop_slug
      ){
        return {
          success:false,
          error:"This account is not linked to a Ma7alak shop."
        };
      }

      return {
        success:true,
        shop_slug:String(ownerResult.data.shop_slug).trim()
      };
    }
    catch(error){
      return {
        success:false,
        error:"Could not verify your shop. Please try again."
      };
    }
  }

  function setupInlineLogin(){
    const action=document.getElementById("ma7alak-header-auth-action");
    const overlay=document.getElementById("ma7alak-login-overlay");
    const close=document.getElementById("ma7alak-login-close");
    const form=document.getElementById("ma7alak-inline-login-form");
    const password=document.getElementById("ma7alak-login-password");
    const toggle=document.getElementById("ma7alak-login-password-toggle");

    if(action){
      action.addEventListener("click",async function(event){
        event.preventDefault();
        event.stopPropagation();

        const state=action.dataset.authState || "login";

        if(state==="logout"){
          const supabaseClient=getClient();

          if(!supabaseClient){return;}

          try{
            await supabaseClient.auth.signOut();
          }
          catch(error){
            console.error("MA7ALAK logout:",error);
          }

          try{
            sessionStorage.removeItem("ma7alak_owner_slug");
            sessionStorage.removeItem("ma7alak_owner_name");
          }
          catch(error){}

          hideOwnerProfile();
          setHeaderAuthState(false);
          return;
        }

        openInlineLogin();
      });
    }

    if(close){
      close.addEventListener("click",function(event){
        event.preventDefault();
        closeInlineLogin();
      });
    }

    if(overlay){
      overlay.addEventListener("click",function(event){
        if(event.target===overlay){
          closeInlineLogin();
        }
      });
    }

    if(toggle && password){
      toggle.addEventListener("click",function(event){
        event.preventDefault();

        const showing=password.type==="text";
        password.type=showing ? "password" : "text";
        toggle.setAttribute(
          "aria-label",
          showing ? "Show password" : "Hide password"
        );
        toggle.textContent=showing ? "◉" : "◎";
      });
    }

    document.addEventListener("keydown",function(event){
      if(
        event.key==="Escape" &&
        overlay &&
        overlay.classList.contains("open")
      ){
        closeInlineLogin();
      }
    });

    if(form){
      form.addEventListener("submit",async function(event){
        event.preventDefault();

        const email=document.getElementById("ma7alak-login-email");
        const passwordInput=document.getElementById("ma7alak-login-password");
        const emailValue=String(email ? email.value : "").trim();
        const passwordValue=String(passwordInput ? passwordInput.value : "");

        clearInlineLoginMessage();

        if(!emailValue || !passwordValue){
          showInlineLoginMessage("Enter your email and password.","error");
          return;
        }

        const supabaseClient=getClient();

        if(!supabaseClient){
          showInlineLoginMessage("Could not connect. Please try again.","error");
          return;
        }

        setInlineLoginLoading(true);

        try{
          const result=await supabaseClient.auth.signInWithPassword({
            email:emailValue,
            password:passwordValue
          });

          if(result.error){
            let errorText="Incorrect email or password.";

            if(
              String(result.error.message||"")
                .toLowerCase()
                .includes("email not confirmed")
            ){
              errorText="Please confirm your email first.";
            }

            showInlineLoginMessage(errorText,"error");
            setInlineLoginLoading(false);
            return;
          }

          if(!result.data || !result.data.user){
            showInlineLoginMessage("Login failed. Please try again.","error");
            setInlineLoginLoading(false);
            return;
          }

          const verification=await verifyInlineShopOwner(result.data.user.id);

          if(!verification.success){
            await supabaseClient.auth.signOut();
            showInlineLoginMessage(verification.error,"error");
            setHeaderAuthState(false);
            setInlineLoginLoading(false);
            return;
          }

          try{
            sessionStorage.setItem("ma7alak_owner_slug",verification.shop_slug);
          }
          catch(error){}

          showInlineLoginMessage("Logged in successfully.","success");
          setHeaderAuthState(true);

          await loadOwnerProfile();

          setInlineLoginLoading(false);

          setTimeout(function(){
            closeInlineLogin();
          },500);
        }
        catch(error){
          console.error("MA7ALAK inline login:",error);
          showInlineLoginMessage("Login failed. Please try again.","error");
          setInlineLoginLoading(false);
        }
      });
    }
  }

  /* =========================================================
     REELS NEW-ITEM NOTIFICATION BADGE
     ---------------------------------------------------------
     The Reels Embed sends the current Reel IDs to this header.
     We remember which Reel IDs this visitor has already seen.
     Any newly-added Reel IDs become the red notification count.
  ========================================================= */

  const REELS_SEEN_STORAGE_KEY =
    "ma7alak_seen_reel_fingerprints_v2";

  /*
     CLEAN BASELINE FOR THIS VERSION.
     These are the five Reels that already existed when V12 was made.
     They are treated as old. Any Reel added after this version becomes
     a notification automatically.
  */
  const REELS_BASELINE_V2 = [
    "masaya-cafe-2::https://vz-0bfd5f45-77d.b-cdn.net/63dfd3f2-881d-4bba-939c-4de7a6590190/play_720p.mp4::https://ma7alak.com/masaya-cafe",
    "zee-tattoo-1::https://vz-0bfd5f45-77d.b-cdn.net/2a34ce89-cdd6-4009-b10e-16307df0b39d/play_720p.mp4::https://ma7alak.com/Zee-Tattoo&-Piercing",
    "masaya-cafe-1::https://vz-0bfd5f45-77d.b-cdn.net/08014fd8-35d8-448c-a297-873f15828c8f/play_1080p.mp4::https://ma7alak.com/masaya-cafe",
    "doze-3ale-1::https://vz-0bfd5f45-77d.b-cdn.net/d9b32804-0db8-4263-9627-6d6e46c8de39/play_720p.mp4::https://ma7alak.com/doze-3ale",
    "doze-3ale-2::https://vz-0bfd5f45-77d.b-cdn.net/cfd5e24c-e300-4c8c-baee-faef3161a7f5/play_720p.mp4::https://ma7alak.com/doze-3ale"
  ];

  let currentReelIds = [];

  function normalizeReelIds(ids){
    if(!Array.isArray(ids)){return [];}

    return Array.from(
      new Set(
        ids
          .map(function(id){return String(id || "").trim();})
          .filter(Boolean)
      )
    );
  }

  function getSeenReelIds(){
    try{
      const raw = localStorage.getItem(
        REELS_SEEN_STORAGE_KEY
      );

      const parsed = raw ? JSON.parse(raw) : [];
      return normalizeReelIds(parsed);
    }
    catch(error){
      return [];
    }
  }

  function saveSeenReelIds(ids){
    try{
      localStorage.setItem(
        REELS_SEEN_STORAGE_KEY,
        JSON.stringify(normalizeReelIds(ids))
      );
    }
    catch(error){}
  }

  function updateReelsBadge(){
    const badge = document.getElementById(
      "ma7alak-reels-badge"
    );

    if(!badge){return;}

    const seenIds = getSeenReelIds();

    /*
      First run: seed ONLY the known old Reels.
      Storage access below is guarded so private/restricted browsers
      can never break Reels opening or badge rendering.
    */
    let hasBaseline = false;

    try{
      hasBaseline =
        localStorage.getItem(
          REELS_SEEN_STORAGE_KEY
        ) !== null;
    }
    catch(error){
      hasBaseline = false;
    }

    if(!hasBaseline){
      saveSeenReelIds(REELS_BASELINE_V2);
    }

    const seenSet = new Set(
      hasBaseline
        ? seenIds
        : normalizeReelIds(REELS_BASELINE_V2)
    );

    const newCount = currentReelIds.filter(
      function(id){return !seenSet.has(id);}
    ).length;

    badge.textContent =
      newCount > 99 ? "99+" : String(newCount);

    badge.classList.toggle(
      "visible",
      newCount > 0
    );

    const button = document.getElementById(
      "ma7alak-header-reels"
    );

    if(button){
      button.setAttribute(
        "aria-label",
        newCount > 0
          ? "Reels, " + newCount + " new"
          : "Reels"
      );
    }
  }

  function setCurrentReelIds(ids){
    const normalized=normalizeReelIds(ids);

    /*
      Never wipe a valid Reel state with an empty/late response.
      Hostinger pages can contain several embeds and delayed messages.
    */
    if(!normalized.length){
      return;
    }

    currentReelIds = normalized;
    updateReelsBadge();
  }

  function markCurrentReelsSeen(){
    if(!currentReelIds.length){return;}

    const seen = new Set(getSeenReelIds());

    currentReelIds.forEach(function(id){
      seen.add(id);
    });

    saveSeenReelIds(Array.from(seen));
    updateReelsBadge();
  }

  function requestReelsState(){
    /* Same-document Reels fallback. */
    const localIds = Array.from(
      document.querySelectorAll(
        ".ma7alak-reel[data-reel-id]"
      )
    ).map(function(reel){

      const reelId =
        String(
          reel.getAttribute("data-reel-id") || ""
        ).trim();

      const video =
        reel.querySelector(".ma7alak-video");

      const source =
        video
          ? (
              video.currentSrc ||
              video.getAttribute("src") ||
              (
                video.querySelector("source")
                  ? video.querySelector("source").getAttribute("src")
                  : ""
              ) ||
              ""
            )
          : "";

      const shopUrl =
        String(
          reel.getAttribute("data-shop-url") || ""
        ).trim();

      /*
        Use a fingerprint, not only data-reel-id.
        If a Reel is replaced/updated but an old numeric ID is reused,
        the new media still counts as a new Reel notification.
      */
      return [
        reelId,
        String(source || "").trim(),
        shopUrl
      ].join("::");
    }).filter(Boolean);

    if(localIds.length){
      setCurrentReelIds(localIds);
    }

    const localReels = Array.from(
      document.querySelectorAll(
        ".ma7alak-reel[data-reel-id]"
      )
    ).map(function(reel){
      const video = reel.querySelector(".ma7alak-video");
      const sourceEl = video ? video.querySelector("source") : null;
      const info = reel.querySelector(".reel-info strong");
      const iconEl = reel.querySelector(".reel-shop-icon");

      const id = String(reel.getAttribute("data-reel-id") || "").trim();
      const videoUrl = String(
        (video && (video.currentSrc || video.getAttribute("src"))) ||
        (sourceEl && sourceEl.getAttribute("src")) ||
        ""
      ).trim();

      if(!id || !videoUrl){return null;}

      return {
        id:id,
        shop:String(reel.getAttribute("data-shop-name") || (info ? info.textContent : "") || "").trim(),
        shopUrl:String(reel.getAttribute("data-shop-url") || "").trim(),
        icon:String(reel.getAttribute("data-shop-icon") || (iconEl ? iconEl.getAttribute("src") : "") || "").trim(),
        video:videoUrl
      };
    }).filter(Boolean);

    if(localReels.length){
      setGlobalReelsFromLiveData(localReels);
    }

    /* Ask every Hostinger Embed iframe for its Reel IDs + full Reel data. */
    document.querySelectorAll("iframe").forEach(
      function(frame){
        try{
          if(frame.contentWindow){
            frame.contentWindow.postMessage(
              {type:"MA7ALAK_REQUEST_REELS_STATE"},
              "*"
            );
          }
        }
        catch(error){}
      }
    );
  }

  /* =========================================================
     EXACT REEL OPENING
     Used by in-site notifications + phone push deep links.
     Reel ID is the source of truth (never the video URL).
  ========================================================= */
  let ma7alakPendingExactReelId = null;

  function openGlobalReelById(reelId){
    const targetId = String(reelId || "").trim();

    if(!targetId){
      return false;
    }

    const targetIndex =
      MA7ALAK_GLOBAL_REELS.findIndex(function(reel){
        return String(reel && reel.id ? reel.id : "").trim() === targetId;
      });

    if(targetIndex === -1){
      /* The live iframe/catalog may not have answered yet. Keep the
         exact ID pending and ask for fresh Reel state immediately. */
      ma7alakPendingExactReelId = targetId;
      try{ requestReelsState(); }catch(error){}
      return true;
    }

    ma7alakPendingExactReelId = null;
    loadGlobalReel(targetIndex, null);
    return true;
  }

  /* Direct API for notifications.js on the same page. */
  window.ma7alakOpenExactReel = openGlobalReelById;

  /* Event fallback so scripts do not depend on load order. */
  window.addEventListener(
    "MA7ALAK_OPEN_EXACT_REEL",
    function(event){
      const reelId =
        event && event.detail
          ? event.detail.reelId
          : "";
      openGlobalReelById(reelId);
    }
  );

  function setGlobalReelsFromLiveData(reels){
    if(!Array.isArray(reels) || !reels.length){
      return;
    }

    const normalized = reels
      .map(function(reel){
        if(!reel){return null;}

        const id = String(reel.id || "").trim();
        const video = String(reel.video || "").trim();

        if(!id || !video){
          return null;
        }

        return {
          id:id,
          shop:String(reel.shop || "").trim(),
          shopUrl:String(reel.shopUrl || "").trim(),
          icon:String(reel.icon || "").trim(),
          video:video
        };
      })
      .filter(Boolean);

    if(!normalized.length){
      return;
    }

    /*
      Replace the old hardcoded viewer catalog with the LIVE Reel panel.
      This means every Reel added to the panel automatically becomes
      available in the header Reel player too.
    */
    MA7ALAK_GLOBAL_REELS = normalized;

    if(ma7alakGlobalReelIndex >= MA7ALAK_GLOBAL_REELS.length){
      ma7alakGlobalReelIndex = 0;
    }

    /* If a notification/deep link arrived before the live catalog,
       open the exact Reel now that the catalog is ready. */
    if(ma7alakPendingExactReelId){
      const pendingId = ma7alakPendingExactReelId;
      setTimeout(function(){
        openGlobalReelById(pendingId);
      },0);
    }
  }


  window.addEventListener(
    "message",
    function(event){
      if(
        !event.data ||
        event.data.type !== "MA7ALAK_REELS_STATE"
      ){
        return;
      }

      setCurrentReelIds(
        event.data.reelIds || []
      );

      setGlobalReelsFromLiveData(
        event.data.reels || []
      );
    }
  );

  function setupHeaderMenu(){

    const button =
      document.getElementById(
        "ma7alak-header-menu-button"
      );

    const panel =
      document.getElementById(
        "ma7alak-header-menu-panel"
      );

    if(!button || !panel){
      return;
    }

    function setMenuOpen(open){

      const shouldOpen =
        Boolean(open);

      button.classList.toggle(
        "open",
        shouldOpen
      );

      panel.classList.toggle(
        "open",
        shouldOpen
      );

      button.setAttribute(
        "aria-expanded",
        shouldOpen ? "true" : "false"
      );

      panel.setAttribute(
        "aria-hidden",
        shouldOpen ? "false" : "true"
      );

    }

    button.addEventListener(
      "click",
      function(event){

        event.preventDefault();
        event.stopPropagation();

        setMenuOpen(
          !panel.classList.contains(
            "open"
          )
        );

      }
    );

    panel.addEventListener(
      "click",
      function(event){
        event.stopPropagation();
      }
    );

    document.addEventListener(
      "click",
      function(){
        setMenuOpen(false);
      }
    );

    document.addEventListener(
      "keydown",
      function(event){

        if(event.key === "Escape"){
          setMenuOpen(false);
        }

      }
    );

    window.addEventListener(
      "scroll",
      function(){
        setMenuOpen(false);
      },
      {passive:true}
    );

  }



  /* =========================================================
     GLOBAL REELS VIEWER INJECTION
     ---------------------------------------------------------
     V22 FIX:
     Hostinger Global Custom Code must not depend on raw HTML
     placed outside the JavaScript block. The stable header itself
     already follows this rule. So the Reel viewer and its CSS are
     now injected into the real top-level document.body/head by JS.
  ========================================================= */

  function injectGlobalReelViewer(){
    if(
      document.getElementById(
        "ma7alakGlobalReelViewer"
      )
    ){
      return;
    }

    if(
      !document.getElementById(
        "ma7alak-global-reel-viewer-style"
      )
    ){
      const style =
        document.createElement("style");

      style.id =
        "ma7alak-global-reel-viewer-style";

      style.textContent = `
#ma7alakGlobalReelViewer{
    position:fixed;
    inset:0;
    width:100vw;
    height:100dvh;
    background:#000;
    z-index:2147483646;
    display:none;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    touch-action:none;
  }

  #ma7alakGlobalReelViewer.open{
    display:flex;
  }

  #ma7alakGlobalReelVideo{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    object-fit:contain;
    background:#000;
    opacity:0;
    transform:translate3d(0,0,0) scale(.985);
    transition:
      opacity .22s ease,
      transform .32s cubic-bezier(.2,.8,.2,1);
  }

  #ma7alakGlobalReelVideo.ready{
    opacity:1;
    transform:translate3d(0,0,0) scale(1);
  }

  #ma7alakGlobalReelShop{
    position:absolute;
    top:max(22px,env(safe-area-inset-top));
    left:max(18px,env(safe-area-inset-left));
    z-index:5;
    display:flex;
    align-items:center;
    gap:10px;
    border:1px solid rgba(255,255,255,.12);
    background:rgba(12,12,14,.62);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    color:#fff;
    border-radius:999px;
    padding:7px 12px 7px 7px;
    cursor:pointer;
    box-shadow:0 10px 34px rgba(0,0,0,.3);
  }

  #ma7alakGlobalReelShopIcon{
    width:38px;
    height:38px;
    border-radius:50%;
    object-fit:cover;
    border:1px solid rgba(226,180,91,.55);
    background:#111;
  }

  .ma7alak-global-reel-shop-text{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    line-height:1.12;
  }

  .ma7alak-global-reel-shop-text strong{
    color:#fff;
    font-size:13px;
    font-weight:800;
  }

  .ma7alak-global-reel-shop-text small{
    color:rgba(255,255,255,.62);
    font-size:10px;
    margin-top:3px;
  }

  .ma7alak-global-reel-shop-arrow{
    color:#e2b45b;
    font-size:18px;
    font-weight:900;
  }

  #ma7alakGlobalReelClose,
  #ma7alakGlobalReelFavorite,
  #ma7alakGlobalReelPrev,
  #ma7alakGlobalReelNext{
    position:absolute;
    z-index:6;
    display:flex;
    align-items:center;
    justify-content:center;
    border:1px solid rgba(255,255,255,.12);
    background:rgba(12,12,14,.58);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    color:#fff;
    cursor:pointer;
    -webkit-tap-highlight-color:transparent;
  }

  #ma7alakGlobalReelClose{
    top:max(24px,env(safe-area-inset-top));
    right:max(18px,env(safe-area-inset-right));
    width:44px;
    height:44px;
    border-radius:50%;
    font-size:31px;
    line-height:1;
  }

  #ma7alakGlobalReelFavorite{
    right:max(18px,env(safe-area-inset-right));
    bottom:calc(max(82px,env(safe-area-inset-bottom)) + 8px);
    width:48px;
    height:48px;
    border-radius:50%;
    font-size:28px;
    color:#f2c96c;
    padding:0 0 3px 0!important;
    line-height:1!important;
    text-align:center;
  }

  #ma7alakGlobalReelFavorite.active{
    background:rgba(217,164,65,.19);
    border-color:rgba(226,180,91,.55);
  }

  #ma7alakGlobalReelPrev,
  #ma7alakGlobalReelNext{
    right:max(18px,env(safe-area-inset-right));
    width:42px;
    height:42px;
    border-radius:50%;
    font-size:25px;
  }

  #ma7alakGlobalReelPrev{
    top:42%;
  }

  #ma7alakGlobalReelNext{
    top:calc(42% + 54px);
  }


  /* V23 phone-first: swipe only, no up/down arrow controls. */
  #ma7alakGlobalReelPrev,
  #ma7alakGlobalReelNext{
    display:none!important;
  }

  .ma7alak-global-reel-hint{
    position:absolute;
    left:50%;
    bottom:max(22px,env(safe-area-inset-bottom));
    transform:translateX(-50%);
    z-index:5;
    color:rgba(255,255,255,.68);
    font-size:11px;
    font-weight:700;
    letter-spacing:.2px;
    background:rgba(0,0,0,.32);
    border:1px solid rgba(255,255,255,.08);
    padding:7px 12px;
    border-radius:999px;
    pointer-events:none;
  }

  @media (max-width:700px){
    #ma7alakGlobalReelVideo{
      object-fit:cover;
    }

    #ma7alakGlobalReelShop{
      top:max(16px,env(safe-area-inset-top));
      left:max(12px,env(safe-area-inset-left));
      max-width:calc(100vw - 88px);
    }

    #ma7alakGlobalReelClose{
      top:max(16px,env(safe-area-inset-top));
      right:max(12px,env(safe-area-inset-right));
    }

    #ma7alakGlobalReelFavorite,
    #ma7alakGlobalReelPrev,
    #ma7alakGlobalReelNext{
      right:max(12px,env(safe-area-inset-right));
    }

    #ma7alakGlobalReelPrev{
      top:43%;
    }

    #ma7alakGlobalReelNext{
      top:calc(43% + 52px);
    }
  }
      `;

      document.head.appendChild(style);
    }

    const holder =
      document.createElement("div");

    holder.id =
      "ma7alak-global-reel-viewer-root";

    holder.innerHTML = `
<div id="ma7alakGlobalReelViewer" aria-hidden="true">
  <button id="ma7alakGlobalReelShop" type="button">
    <img id="ma7alakGlobalReelShopIcon" src="" alt="">
    <span class="ma7alak-global-reel-shop-text">
      <strong id="ma7alakGlobalReelShopName">Shop</strong>
      <small>View shop</small>
    </span>
    <span class="ma7alak-global-reel-shop-arrow">→</span>
  </button>

  <button id="ma7alakGlobalReelClose" type="button" aria-label="Close">×</button>
  <button id="ma7alakGlobalReelFavorite" type="button" aria-label="Add to favorites">☆</button>

  <video
    id="ma7alakGlobalReelVideo"
    playsinline
    webkit-playsinline
    loop
    preload="metadata"
  ></video>

  <div class="ma7alak-global-reel-hint">Swipe</div>
</div>
    `;

    document.body.appendChild(holder);
  }


  /* =========================================================
     GLOBAL REELS VIEWER LOGIC
     ---------------------------------------------------------
     This deliberately does NOT talk to the offscreen Reels iframe.
     The header button opens a random Reel immediately from the same
     catalog used by the working Reels V5 section.
  ========================================================= */

  let MA7ALAK_GLOBAL_REELS = [{"id": "masaya-cafe-2", "shop": "Masaya Cafe", "shopUrl": "https://ma7alak.com/masaya-cafe", "icon": "https://i.ibb.co/RpLPX6jM/file-000000009170820c8b0604e92a7aa0d2.png", "video": "https://vz-0bfd5f45-77d.b-cdn.net/63dfd3f2-881d-4bba-939c-4de7a6590190/play_720p.mp4"}, {"id": "zee-tattoo-1", "shop": "Zee Tattoo", "shopUrl": "https://ma7alak.com/Zee-Tattoo&-Piercing", "icon": "https://i.ibb.co/Vpb84TJD/IMG-20260909-WA0100.jpg", "video": "https://vz-0bfd5f45-77d.b-cdn.net/2a34ce89-cdd6-4009-b10e-16307df0b39d/play_720p.mp4"}, {"id": "masaya-cafe-1", "shop": "Masaya Cafe", "shopUrl": "https://ma7alak.com/masaya-cafe", "icon": "https://i.ibb.co/RpLPX6jM/file-000000009170820c8b0604e92a7aa0d2.png", "video": "https://vz-0bfd5f45-77d.b-cdn.net/08014fd8-35d8-448c-a297-873f15828c8f/play_1080p.mp4"}, {"id": "doze-3ale-1", "shop": "Doze 3ale", "shopUrl": "https://ma7alak.com/doze-3ale", "icon": "https://i.ibb.co/nNhdqmjz/IMG-20260906-WA0108.jpg", "video": "https://vz-0bfd5f45-77d.b-cdn.net/d9b32804-0db8-4263-9627-6d6e46c8de39/play_720p.mp4"}, {"id": "doze-3ale-2", "shop": "Doze 3ale", "shopUrl": "https://ma7alak.com/doze-3ale", "icon": "https://i.ibb.co/nNhdqmjz/IMG-20260906-WA0108.jpg", "video": "https://vz-0bfd5f45-77d.b-cdn.net/cfd5e24c-e300-4c8c-baee-faef3161a7f5/play_720p.mp4"}];

  let ma7alakGlobalReelIndex = 0;
  let ma7alakGlobalTouchStartY = 0;
  let ma7alakGlobalTouchStartX = 0;
  let ma7alakGlobalTouchStartTime = 0;
  let ma7alakGlobalFavoriteIds = new Set();

  function getGlobalReelElements(){
    return {
      viewer:document.getElementById("ma7alakGlobalReelViewer"),
      video:document.getElementById("ma7alakGlobalReelVideo"),
      close:document.getElementById("ma7alakGlobalReelClose"),
      favorite:document.getElementById("ma7alakGlobalReelFavorite"),
      shop:document.getElementById("ma7alakGlobalReelShop"),
      shopName:document.getElementById("ma7alakGlobalReelShopName"),
      shopIcon:document.getElementById("ma7alakGlobalReelShopIcon"),
      prev:document.getElementById("ma7alakGlobalReelPrev"),
      next:document.getElementById("ma7alakGlobalReelNext")
    };
  }

  function getGlobalVisitorId(){
    let id = localStorage.getItem("ma7alak_visitor_id");

    if(!id){
      try{
        id = crypto.randomUUID();
      }
      catch(error){
        id = "visitor-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      }

      localStorage.setItem(
        "ma7alak_visitor_id",
        id
      );
    }

    return id;
  }

  async function loadGlobalFavoriteIds(){
    const client = getClient();
    if(!client){return;}

    try{
      const result = await client
        .from("ma7alak_favorites")
        .select("reel_id")
        .eq("visitor_id",getGlobalVisitorId());

      if(result.error){return;}

      ma7alakGlobalFavoriteIds =
        new Set(
          (result.data || []).map(function(row){
            return row.reel_id;
          })
        );

      updateGlobalFavoriteButton();
    }
    catch(error){}
  }

  function updateGlobalFavoriteButton(){
    const el = getGlobalReelElements();
    const reel = MA7ALAK_GLOBAL_REELS[ma7alakGlobalReelIndex];

    if(!el.favorite || !reel){return;}

    const active =
      ma7alakGlobalFavoriteIds.has(
        reel.id
      );

    el.favorite.classList.toggle(
      "active",
      active
    );

    el.favorite.textContent =
      active ? "★" : "☆";

    el.favorite.setAttribute(
      "aria-label",
      active
        ? "Remove from favorites"
        : "Add to favorites"
    );
  }

  async function toggleGlobalFavorite(){
    const client = getClient();
    const reel = MA7ALAK_GLOBAL_REELS[ma7alakGlobalReelIndex];

    if(!client || !reel){return;}

    const visitorId = getGlobalVisitorId();
    const active = ma7alakGlobalFavoriteIds.has(reel.id);

    try{
      if(active){
        const result = await client
          .from("ma7alak_favorites")
          .delete()
          .eq("visitor_id",visitorId)
          .eq("reel_id",reel.id);

        if(!result.error){
          ma7alakGlobalFavoriteIds.delete(reel.id);
        }
      }
      else{
        const result = await client
          .from("ma7alak_favorites")
          .insert({
            visitor_id:visitorId,
            reel_id:reel.id,
            shop_name:reel.shop
          });

        if(!result.error){
          ma7alakGlobalFavoriteIds.add(reel.id);
        }
      }

      updateGlobalFavoriteButton();

      try{
        window.dispatchEvent(
          new CustomEvent(
            "ma7alakFavoritesChanged"
          )
        );
      }
      catch(error){}
    }
    catch(error){}
  }

  function loadGlobalReel(index,direction){
    if(!MA7ALAK_GLOBAL_REELS.length){return;}

    const el = getGlobalReelElements();

    if(!el.viewer || !el.video){return;}

    if(index < 0){
      index = MA7ALAK_GLOBAL_REELS.length - 1;
    }

    if(index >= MA7ALAK_GLOBAL_REELS.length){
      index = 0;
    }

    ma7alakGlobalReelIndex = index;

    const reel =
      MA7ALAK_GLOBAL_REELS[index];

    el.video.pause();
    el.video.classList.remove("ready");

    if(direction === "next"){
      el.video.style.transform =
        "translate3d(0,55px,0) scale(.985)";
    }
    else if(direction === "prev"){
      el.video.style.transform =
        "translate3d(0,-55px,0) scale(.985)";
    }
    else{
      el.video.style.transform =
        "translate3d(0,0,0) scale(.985)";
    }

    el.video.src = reel.video;
    el.video.loop = true;
    el.video.playsInline = true;
    el.video.muted = false;

    if(el.shopName){
      el.shopName.textContent = reel.shop;
    }

    if(el.shop){
      el.shop.dataset.shopUrl =
        reel.shopUrl || "";
    }

    if(el.shopIcon){
      if(reel.icon){
        el.shopIcon.src = reel.icon;
        el.shopIcon.style.display = "block";
      }
      else{
        el.shopIcon.removeAttribute("src");
        el.shopIcon.style.display = "none";
      }
    }

    updateGlobalFavoriteButton();

    el.viewer.classList.add("open");
    el.viewer.setAttribute("aria-hidden","false");

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const start = function(){
      requestAnimationFrame(function(){
        el.video.classList.add("ready");
        el.video.style.transform =
          "translate3d(0,0,0) scale(1)";
      });

      const p = el.video.play();

      if(p && typeof p.catch === "function"){
        p.catch(function(){
          el.video.muted = true;
          el.video.play().catch(function(){});
        });
      }
    };

    if(el.video.readyState >= 2){
      start();
    }
    else{
      el.video.addEventListener(
        "loadeddata",
        start,
        {once:true}
      );
    }
  }

  function openRandomGlobalReel(){
    if(!MA7ALAK_GLOBAL_REELS.length){return;}

    let randomIndex =
      Math.floor(
        Math.random() *
        MA7ALAK_GLOBAL_REELS.length
      );

    if(
      MA7ALAK_GLOBAL_REELS.length > 1 &&
      randomIndex === ma7alakGlobalReelIndex
    ){
      randomIndex =
        (randomIndex + 1) %
        MA7ALAK_GLOBAL_REELS.length;
    }

    loadGlobalReel(
      randomIndex,
      null
    );

    /*
      Because THIS function runs directly from the real header click,
      native fullscreen has valid user activation and can work normally.
      The overlay already fills the viewport, so failure is harmless.
    */
    const viewer =
      document.getElementById(
        "ma7alakGlobalReelViewer"
      );

    if(viewer){
      try{
        if(viewer.requestFullscreen){
          const req =
            viewer.requestFullscreen();

          if(
            req &&
            typeof req.catch === "function"
          ){
            req.catch(function(){});
          }
        }
        else if(viewer.webkitRequestFullscreen){
          viewer.webkitRequestFullscreen();
        }
      }
      catch(error){}
    }

    loadGlobalFavoriteIds();
  }

  function nextGlobalReel(){
    loadGlobalReel(
      ma7alakGlobalReelIndex + 1,
      "next"
    );
  }

  function previousGlobalReel(){
    loadGlobalReel(
      ma7alakGlobalReelIndex - 1,
      "prev"
    );
  }

  function closeGlobalReel(){
    const el = getGlobalReelElements();

    if(!el.viewer || !el.video){return;}

    el.video.pause();
    el.video.muted = true;
    el.video.classList.remove("ready");
    el.video.removeAttribute("src");
    el.video.load();

    el.viewer.classList.remove("open");
    el.viewer.setAttribute("aria-hidden","true");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    try{
      if(document.fullscreenElement){
        const req = document.exitFullscreen();
        if(req && typeof req.catch === "function"){
          req.catch(function(){});
        }
      }
      else if(document.webkitFullscreenElement && document.webkitExitFullscreen){
        document.webkitExitFullscreen();
      }
    }
    catch(error){}
  }

  function setupGlobalReelViewer(){
    const el = getGlobalReelElements();

    if(!el.viewer){return;}

    if(el.close){
      el.close.addEventListener(
        "click",
        function(event){
          event.preventDefault();
          event.stopPropagation();
          closeGlobalReel();
        }
      );
    }

    if(el.favorite){
      el.favorite.addEventListener(
        "click",
        function(event){
          event.preventDefault();
          event.stopPropagation();
          toggleGlobalFavorite();
        }
      );
    }

    if(el.shop){
      el.shop.addEventListener(
        "click",
        function(event){
          event.preventDefault();
          event.stopPropagation();

          const reel =
            MA7ALAK_GLOBAL_REELS[
              ma7alakGlobalReelIndex
            ];

          if(reel && reel.shopUrl){
            window.top.location.href =
              reel.shopUrl;
          }
        }
      );
    }

    if(el.prev){
      el.prev.addEventListener(
        "click",
        function(event){
          event.preventDefault();
          event.stopPropagation();
          previousGlobalReel();
        }
      );
    }

    if(el.next){
      el.next.addEventListener(
        "click",
        function(event){
          event.preventDefault();
          event.stopPropagation();
          nextGlobalReel();
        }
      );
    }

    el.viewer.addEventListener(
      "touchstart",
      function(event){
        const touch =
          event.touches &&
          event.touches[0];

        if(!touch){return;}

        ma7alakGlobalTouchStartX =
          touch.clientX;

        ma7alakGlobalTouchStartY =
          touch.clientY;

        ma7alakGlobalTouchStartTime =
          Date.now();
      },
      {passive:true}
    );

    el.viewer.addEventListener(
      "touchend",
      function(event){
        const touch =
          event.changedTouches &&
          event.changedTouches[0];

        if(!touch){return;}

        const dx =
          touch.clientX -
          ma7alakGlobalTouchStartX;

        const dy =
          touch.clientY -
          ma7alakGlobalTouchStartY;

        const elapsed =
          Date.now() -
          ma7alakGlobalTouchStartTime;

        if(
          elapsed > 700 ||
          Math.abs(dy) < 50 ||
          Math.abs(dy) <
            Math.abs(dx)
        ){
          return;
        }

        if(dy < 0){
          nextGlobalReel();
        }
        else{
          previousGlobalReel();
        }
      },
      {passive:true}
    );

    document.addEventListener(
      "keydown",
      function(event){
        if(
          !el.viewer.classList.contains(
            "open"
          )
        ){
          return;
        }

        if(event.key === "Escape"){
          closeGlobalReel();
        }

        if(
          event.key === "ArrowUp" ||
          event.key === "ArrowRight"
        ){
          nextGlobalReel();
        }

        if(
          event.key === "ArrowDown" ||
          event.key === "ArrowLeft"
        ){
          previousGlobalReel();
        }
      }
    );

    document.addEventListener(
      "fullscreenchange",
      function(){
        if(
          !document.fullscreenElement &&
          el.viewer.classList.contains(
            "open"
          )
        ){
          /*
            Do NOT automatically close here. Some browsers reject or
            exit native fullscreen while the fixed overlay should stay
            open exactly like a normal Reel viewer.
          */
        }
      }
    );
  }


  function setupReelsButton(){
    const button =
      document.getElementById(
        "ma7alak-header-reels"
      );

    if(!button){
      return;
    }

    button.addEventListener(
      "click",
      function(event){
        event.preventDefault();
        event.stopPropagation();

        button.classList.add(
          "ma7alak-active"
        );

        /*
          DIRECT TOP-LEVEL OPEN.
          No iframe. No scrolling. No postMessage. No lazy-load race.
          Opens one random Reel immediately from the same current V5
          Reel catalog.
        */
        openRandomGlobalReel();

        try{
          markCurrentReelsSeen();
        }
        catch(error){}

        setTimeout(function(){
          button.classList.remove(
            "ma7alak-active"
          );
        },700);
      }
    );
  }

  function setupScrollEffect(){
    const header=document.getElementById("ma7alak-social-header");
    if(!header){return;}
    function update(){
      if(window.scrollY>24){header.classList.add("ma7alak-scrolled");}
      else{header.classList.remove("ma7alak-scrolled");}
    }
    update();
    window.addEventListener("scroll",update,{passive:true});
  }

  function setupAuthListener(){
    const supabaseClient=getClient();
    if(!supabaseClient){return;}

    supabaseClient.auth.onAuthStateChange(function(event,session){
      setHeaderAuthState(
        Boolean(
          session &&
          session.user
        )
      );

      setTimeout(
        loadOwnerProfile,
        80
      );
    });
  }

  async function start(){
    setupScrollEffect();
    setupHeaderMenu();
    setupInlineLogin();
    await refreshHeaderAuthState();
    setupInstantHeart();

    /*
      Inject the direct Reel viewer into the real page FIRST, then
      attach its controls and finally attach the header Reel button.
    */
    injectGlobalReelViewer();
    setupGlobalReelViewer();
    setupReelsButton();

    /* Phone push deep link: https://ma7alak.com/?reel=REEL_ID
       Store it until the live Supabase Reel catalog arrives. */
    try{
      const reelFromURL =
        new URLSearchParams(window.location.search).get("reel");

      if(reelFromURL){
        ma7alakPendingExactReelId = String(reelFromURL).trim();
      }
    }catch(error){}

    requestReelsState();
    setTimeout(requestReelsState,500);
    setTimeout(requestReelsState,1600);

    /*
      Keep checking for newly-added Reels while the visitor stays
      on the page. This fixes Hostinger/Embed cases where Reels are
      updated after the initial header load.
    */
    setInterval(
      requestReelsState,
      3000
    );

    setupSearchEvents();
    startControlIntegrationWatcher();
    await loadShopProfiles();
    renderSearchResults("");
    await loadOwnerProfile();
    setupAuthListener();
  }

  await start();


  });

})();


/* =========================================================
     WHAT CHANGED
     =========================================================
     1. V22 is based directly on V21 / stable V15 header logic.
     2. FOUND the V21 bug: the new Reel viewer HTML/CSS was placed as
        raw markup BEFORE the script, while this Hostinger global header
        is intentionally designed to inject UI through JavaScript only.
     3. The Reel viewer HTML is now created with JavaScript and appended
        directly to the real top-level document.body.
     4. The Reel viewer CSS is now injected into document.head by JS.
     5. The viewer is injected BEFORE setupGlobalReelViewer() and
        setupReelsButton(), so the button always has a real viewer to open.
     6. Header Reels button still opens a RANDOM Reel immediately, without
        scrolling, iframe messaging, MutationObserver, iframe moving or
        lazy-load hacks.
     7. Same current Reel catalog: Masaya Cafe, Zee Tattoo and Doze 3ale,
        with shop name, icon, shop page, video, favorites, swipe and sound.
     8. Actual working Reels V5 section stays completely untouched.
     9. Stable V15 Search, Notifications, Likes, owner profile, Reel badge,
        navigation order, header backdrop, logo and menu remain unchanged.
========================================================= */


/* =========================================================
     WHAT CHANGED — V23 PHONE-FIRST UI TUNING
     =========================================================
     1. Based directly on the confirmed-working V22. Reel opening/data logic was not rewritten.
     2. Removed the visible Reel up/down arrow buttons. Vertical swipe still changes Reels.
     3. Changed the Reel hint from “↑ Swipe ↓” to simply “Swipe”.
     4. Corrected the Favorite star visual centering inside its round button.
     5. Made the owner/shop circle larger on phones while keeping safe spacing from the header edges.
     6. Increased the gap between the owner/shop circle and the 3-line menu button.
     7. Removed the spinning ring effect. The complete owner/shop circle now rotates slowly instead.
     8. Added standard + WebKit animation rules, translateZ(0), will-change, and backface handling for phone browsers.
     9. Very small phones (390px and below) get a slightly smaller 50px circle so the header remains usable.
========================================================= */


/* =========================================================
     WHAT CHANGED — V24 PHONE HEADER POLISH
     =========================================================
     1. Based directly on confirmed-working V23. Reel opening/video logic was not changed.
     2. Enlarged the left Ma7alak/eye mark slightly and moved it farther left while keeping safe space from the rounded panel corner.
     3. Reduced the owner/shop profile circle so it is visibly smaller than the left Ma7alak circle.
     4. Story Likes/heart is now hidden by default and appears only after a real shop owner is confirmed from shop_owners.
     5. Made the Reels glyph slightly larger so it visually matches the other phone navigation icons.
     6. Swapped the Reels and Notifications positions in the header. Their existing functionality was not rewritten.
     7. Added a very light gold/burgundy moving glow around the complete header panel border, matching the existing Ma7alak theme.
     8. Kept V23 owner-circle rotation, direct random Reels viewer, Reel badge, search, notifications, menu and Supabase logic intact.
========================================================= */

/* =========================================================
   LIVE REELS HEADER SYNC FIX
   1. Header viewer no longer stays locked to old hardcoded reels.
   2. Accepts full live Reel catalog from MA7ALAK_REELS_STATE.
   3. New panel reels automatically become playable from header icon.
   4. Existing favorites, random opening, swipe, sound and badge remain.
========================================================= */


/* =========================================================
   EXACT REEL NOTIFICATION FIX
   - In-site Reel notifications open by exact reel_id.
   - Phone push deep links support ?reel=<reel_id>.
   - No random Reel is opened first.
   - Duplicate video URLs are safe because reel_id is authoritative.
   - Existing shop click in the Reel viewer still uses reel.shopUrl.
========================================================= */
