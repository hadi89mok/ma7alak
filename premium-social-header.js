/* =========================================================
   V26 FOLLOWING POLISH
   - Following header icon no longer shows a count badge.
   - Following panel has a functional live search bar.
   - Followed shops with an active Story get a live animated gold ring.
   - Story-ring state syncs through Supabase Realtime + safe 1.5s refresh.
   - Existing Follow, Notifications, Reels, Search, owner profile and owner-only Story Likes are preserved.
========================================================= */

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
   V25 — FOLLOWING HEADER + LIVE FOLLOWING PANEL
========================================================= */
#ma7alak-header-following{
  position:relative;
}
#ma7alak-following-badge{
  position:absolute;
  top:2px;
  right:10px;
  min-width:18px;
  height:18px;
  padding:0 5px;
  display:none;
  align-items:center;
  justify-content:center;
  border:2px solid rgba(10,11,12,.96);
  border-radius:999px;
  background:#e08b22;
  color:#fff;
  font-size:10px;
  font-weight:900;
  line-height:1;
  box-shadow:0 3px 10px rgba(0,0,0,.42),0 0 12px rgba(224,139,34,.24);
  pointer-events:none;
  z-index:5;
}
#ma7alak-following-badge,#ma7alak-following-badge.visible{display:none!important;}
@keyframes ma7alakFollowingBadgePop{0%{transform:scale(.55);opacity:0}70%{transform:scale(1.12);opacity:1}100%{transform:scale(1);opacity:1}}

#ma7alak-following-overlay{
  position:fixed;
  inset:0;
  display:none;
  align-items:flex-start;
  justify-content:center;
  padding:max(96px,calc(env(safe-area-inset-top) + 84px)) 12px 24px;
  background:rgba(0,0,0,.62);
  backdrop-filter:blur(9px);
  -webkit-backdrop-filter:blur(9px);
  z-index:2147483646;
}
#ma7alak-following-overlay.open{display:flex;animation:ma7alakFollowingFade .16s ease-out;}
@keyframes ma7alakFollowingFade{from{opacity:0}to{opacity:1}}
#ma7alak-following-panel{
  width:min(470px,100%);
  max-height:min(680px,calc(100dvh - 118px));
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border:1px solid rgba(217,164,65,.30);
  border-radius:25px;
  background:radial-gradient(circle at 15% 0%,rgba(217,164,65,.08),transparent 31%),linear-gradient(180deg,rgba(20,21,23,.99),rgba(8,9,10,.99));
  box-shadow:0 30px 80px rgba(0,0,0,.72),inset 0 1px 0 rgba(255,255,255,.045),0 0 32px rgba(217,164,65,.04);
  color:#fff;
  font-family:Arial,"Segoe UI",sans-serif;
}
.ma7alak-following-head{display:flex;align-items:center;gap:12px;padding:19px 19px 15px;border-bottom:1px solid rgba(255,255,255,.07);}
.ma7alak-following-head-copy{min-width:0;flex:1;}
.ma7alak-following-title{font-size:21px;font-weight:900;letter-spacing:-.35px;}
.ma7alak-following-subtitle{margin-top:5px;color:rgba(255,255,255,.46);font-size:11px;font-weight:650;}
.ma7alak-following-search-wrap{position:relative;margin-top:12px;}
.ma7alak-following-search-icon{position:absolute;left:13px;top:50%;width:17px;height:17px;transform:translateY(-50%);color:#efc66e;pointer-events:none;}
#ma7alak-following-search{width:100%;height:40px;padding:0 38px 0 39px;border:1px solid rgba(255,255,255,.09);border-radius:13px;outline:none;background:rgba(255,255,255,.045);color:#fff;font:650 12px/1 Arial,"Segoe UI",sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.025);transition:border-color .18s ease,background .18s ease,box-shadow .18s ease;}
#ma7alak-following-search::placeholder{color:rgba(255,255,255,.34);}
#ma7alak-following-search:focus{border-color:rgba(217,164,65,.46);background:rgba(255,255,255,.06);box-shadow:0 0 0 3px rgba(217,164,65,.06);}
#ma7alak-following-search-clear{position:absolute;right:6px;top:50%;width:28px;height:28px;transform:translateY(-50%);display:none;align-items:center;justify-content:center;border:0;border-radius:9px;background:transparent;color:rgba(255,255,255,.48);font-size:18px;cursor:pointer;}
#ma7alak-following-search-clear.visible{display:flex;}
#ma7alak-following-search-clear:active{transform:translateY(-50%) scale(.9);}
#ma7alak-following-close{width:39px;height:39px;flex:0 0 39px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.035);color:rgba(255,255,255,.72);font-size:23px;line-height:1;cursor:pointer;}
#ma7alak-following-close:active{transform:scale(.92)}
#ma7alak-following-list{padding:10px;overflow-y:auto;overscroll-behavior:contain;}
#ma7alak-following-list::-webkit-scrollbar{width:6px}#ma7alak-following-list::-webkit-scrollbar-thumb{border-radius:99px;background:rgba(217,164,65,.25)}
.ma7alak-following-row{display:flex;align-items:center;gap:12px;min-height:72px;padding:9px 10px;border:1px solid rgba(255,255,255,.055);border-radius:17px;background:linear-gradient(180deg,rgba(255,255,255,.032),rgba(255,255,255,.018));color:#fff!important;text-decoration:none!important;transition:transform .16s ease,border-color .16s ease,background .16s ease;}
.ma7alak-following-row + .ma7alak-following-row{margin-top:8px}.ma7alak-following-row:hover{transform:translateX(2px);border-color:rgba(217,164,65,.22);background:rgba(217,164,65,.055)}.ma7alak-following-row:active{transform:scale(.985)}
.ma7alak-following-avatar-ring{position:relative;width:54px;height:54px;flex:0 0 54px;padding:2px;border-radius:50%;background:rgba(217,164,65,.22);box-shadow:0 0 0 1px rgba(217,164,65,.12);isolation:isolate}
.ma7alak-following-avatar-ring::before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#6b4515,#efc66e,#8a5d1d,#f6d98f,#6b4515);opacity:0;z-index:-1;transform:translateZ(0);}
.ma7alak-following-row.ma7alak-has-live-story .ma7alak-following-avatar-ring::before{opacity:1;animation:ma7alakFollowingStoryRing 2.4s linear infinite;-webkit-animation:ma7alakFollowingStoryRing 2.4s linear infinite;will-change:transform;box-shadow:0 0 18px rgba(217,164,65,.18);}
.ma7alak-following-row.ma7alak-has-live-story .ma7alak-following-avatar-ring{box-shadow:0 0 0 1px rgba(239,198,110,.24),0 0 20px rgba(217,164,65,.11);}
@keyframes ma7alakFollowingStoryRing{from{transform:translateZ(0) rotate(0deg)}to{transform:translateZ(0) rotate(360deg)}}
@-webkit-keyframes ma7alakFollowingStoryRing{from{-webkit-transform:translateZ(0) rotate(0deg)}to{-webkit-transform:translateZ(0) rotate(360deg)}}
.ma7alak-following-avatar-inner{width:100%;height:100%;padding:2px;border-radius:50%;background:#090a0b;overflow:hidden}.ma7alak-following-avatar{width:100%;height:100%;display:block;object-fit:cover;border-radius:50%;background:#151719}.ma7alak-following-avatar-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(145deg,#252729,#0f1011);color:#efc66e;font-family:Georgia,"Times New Roman",serif;font-size:14px;font-weight:900}
.ma7alak-following-copy{min-width:0;flex:1}.ma7alak-following-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:850}.ma7alak-following-status{margin-top:5px;color:#7fc5ff;font-size:10px;font-weight:700}.ma7alak-following-check{color:#efc66e}.ma7alak-following-arrow{width:34px;height:34px;flex:0 0 34px;display:flex;align-items:center;justify-content:center;border-radius:11px;background:rgba(255,255,255,.035);color:#efc66e;font-size:20px}
.ma7alak-following-empty{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center}.ma7alak-following-empty-icon{width:58px;height:58px;display:flex;align-items:center;justify-content:center;margin-bottom:13px;border:1px solid rgba(217,164,65,.18);border-radius:18px;background:rgba(217,164,65,.055);color:#efc66e}.ma7alak-following-empty-title{font-size:15px;font-weight:850}.ma7alak-following-empty-text{max-width:260px;margin-top:7px;color:rgba(255,255,255,.40);font-size:11px;line-height:1.5}
.ma7alak-following-foot{padding:12px 15px 15px;border-top:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.36);font-size:10px;text-align:center}.ma7alak-following-foot strong{color:#efc66e;font-weight:800}

/* Owner heart stays outline/normal in the header placeholder too. */
#ma7alak-instant-likes-placeholder{color:#fff!important;}
#ma7alak-instant-likes-placeholder svg{filter:drop-shadow(0 2px 7px rgba(255,255,255,.10))!important;}
#ma7alak-instant-likes-placeholder svg path{fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;}

@media(max-width:900px){
  #ma7alak-header-following{min-width:40px!important;width:40px!important;height:48px!important;}
  #ma7alak-following-badge{top:1px;right:1px;min-width:17px;height:17px;font-size:9px;padding:0 4px;}
  #ma7alak-following-overlay{padding-top:max(78px,calc(env(safe-area-inset-top) + 68px));}
  #ma7alak-following-panel{max-height:calc(100dvh - 92px);border-radius:21px;}
}
@media(max-width:480px){
  /* Five personal/action icons fit without removing Reels, Search, Bell or owner Likes. */
  .ma7alak-header-brand{min-width:82px!important;width:82px!important;padding-right:2px!important;}
  .ma7alak-header-logo{height:51px!important;max-width:80px!important;}
  .ma7alak-header-nav-item,#ma7alak-header-following,#ma7alak-header-likes-slot,#ma7alak-header-notification-slot{min-width:35px!important;width:35px!important;}
  #ma7alak-social-header #ma7alak-story-likes-button,#ma7alak-social-header #ma7alak-notification-bell{width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;}
  #ma7alak-header-owner.visible{width:43px!important;flex-basis:43px!important;margin-right:5px!important;}
  #ma7alak-header-owner .ma7alak-owner-avatar-wrap{width:40px!important;height:40px!important;flex:0 0 40px!important;}
  #ma7alak-header-menu-button{width:38px;height:38px;flex-basis:38px;}
  .ma7alak-following-head{padding:16px 15px 13px}.ma7alak-following-title{font-size:19px}.ma7alak-following-row{min-height:68px;padding:8px}.ma7alak-following-avatar-ring{width:50px;height:50px;flex-basis:50px}
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

    <button id="ma7alak-header-following" class="ma7alak-header-nav-item" type="button" aria-label="Following">
      <span class="ma7alak-header-nav-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8.3 11.2a3.55 3.55 0 1 0 0-7.1 3.55 3.55 0 0 0 0 7.1Z" stroke="currentColor" stroke-width="1.8"/>
          <path d="M2.7 19.5c.35-3.45 2.35-5.45 5.6-5.45 3.26 0 5.25 2 5.6 5.45" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M16.1 10.25a2.75 2.75 0 1 0 0-5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          <path d="M16.15 13.85c2.75.12 4.48 1.92 4.78 4.85" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
      </span>
      <span id="ma7alak-following-badge" aria-hidden="true">0</span>
      <span class="ma7alak-header-nav-label">Following</span>
    </button>

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
        class="ma7alak-header-menu-link"
        href="https://ma7alak.com/login"
      >
        <span class="ma7alak-header-menu-icon">↪</span>
        <span class="ma7alak-header-menu-text">
          <span class="ma7alak-header-menu-main">Login</span>
          <span class="ma7alak-header-menu-sub">Shop owner access</span>
        </span>
      </a>

    </div>
  </div>
</header>

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

    if(!document.getElementById("ma7alak-following-overlay")){
      const followingOverlay=document.createElement("div");
      followingOverlay.id="ma7alak-following-overlay";
      followingOverlay.setAttribute("aria-hidden","true");
      followingOverlay.innerHTML=`
        <section id="ma7alak-following-panel" role="dialog" aria-modal="true" aria-labelledby="ma7alak-following-title">
          <div class="ma7alak-following-head">
            <div class="ma7alak-following-head-copy">
              <div id="ma7alak-following-title" class="ma7alak-following-title">Following</div>
              <div class="ma7alak-following-search-wrap">
                <svg class="ma7alak-following-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.9"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
                <input id="ma7alak-following-search" type="search" autocomplete="off" placeholder="Search following shops..." aria-label="Search following shops">
                <button id="ma7alak-following-search-clear" type="button" aria-label="Clear Following search">×</button>
              </div>
            </div>
            <button id="ma7alak-following-close" type="button" aria-label="Close Following">×</button>
          </div>
          <div id="ma7alak-following-list"></div>
          <div class="ma7alak-following-foot"><strong>Ma7alak</strong> · Stay connected with your favorite local shops</div>
        </section>`;
      document.body.appendChild(followingOverlay);
    }
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
  let followedShopSlugs=[];
  let followingPanelOpen=false;
  let followingRefreshTimer=null;
  let followingRealtimeChannel=null;
  let followingStoryRealtimeChannel=null;
  let followingSearchQuery="";
  let activeFollowingStorySlugs=new Set();
  const FOLLOW_VISITOR_KEY="ma7alak_visitor_id";

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

  function getFollowVisitorId(){
    try{
      let id=String(localStorage.getItem(FOLLOW_VISITOR_KEY)||"").trim();
      if(!id){
        if(window.crypto&&typeof window.crypto.randomUUID==="function"){
          id=window.crypto.randomUUID();
        }else{
          id="m7-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
        }
        localStorage.setItem(FOLLOW_VISITOR_KEY,id);
      }
      return id;
    }catch(error){
      return "";
    }
  }

  function normalizeFollowedSlugs(data){
    const rows=Array.isArray(data)?data:[];
    return Array.from(new Set(rows.map(function(row){
      if(typeof row==="string"){return row.trim();}
      return String((row&&(row.shop_slug||row.p_shop_slug||row.slug))||"").trim();
    }).filter(Boolean)));
  }

  function updateFollowingBadge(){
    /* Following is a library/count relationship, not an unread notification.
       Keep the header icon clean: no persistent number badge. */
    const badge=document.getElementById("ma7alak-following-badge");
    if(!badge){return;}
    badge.textContent="";
    badge.classList.remove("visible");
    badge.style.display="none";
  }

  function getFollowedProfiles(){
    const map=new Map();
    shopProfiles.forEach(function(shop){
      if(shop&&shop.shop_slug){map.set(String(shop.shop_slug),shop);}
    });
    return followedShopSlugs.map(function(slug){
      return map.get(slug)||{shop_slug:slug,shop_name:prettyShopName(slug),profile_image_url:""};
    });
  }

  function renderFollowingPanel(){
    const list=document.getElementById("ma7alak-following-list");
    if(!list){return;}
    const allProfiles=getFollowedProfiles();
    const query=String(followingSearchQuery||"").trim().toLowerCase();
    const profiles=query
      ? allProfiles.filter(function(shop){
          const slug=String(shop.shop_slug||"").toLowerCase();
          const name=String(shop.shop_name||prettyShopName(slug)).toLowerCase();
          return name.includes(query)||slug.includes(query);
        })
      : allProfiles;

    if(!allProfiles.length){
      list.innerHTML=`
        <div class="ma7alak-following-empty">
          <div class="ma7alak-following-empty-icon">
            <svg viewBox="0 0 24 24" width="27" height="27" fill="none" aria-hidden="true">
              <path d="M8.3 11.2a3.55 3.55 0 1 0 0-7.1 3.55 3.55 0 0 0 0 7.1Z" stroke="currentColor" stroke-width="1.8"/>
              <path d="M2.7 19.5c.35-3.45 2.35-5.45 5.6-5.45 3.26 0 5.25 2 5.6 5.45" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M16 7.5h5M18.5 5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ma7alak-following-empty-title">You're not following any shops yet</div>
          <div class="ma7alak-following-empty-text">Follow shops you like and they'll appear here automatically.</div>
        </div>`;
      return;
    }

    if(!profiles.length){
      list.innerHTML=`<div class="ma7alak-following-empty"><div class="ma7alak-following-empty-icon"><svg viewBox="0 0 24 24" width="27" height="27" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div><div class="ma7alak-following-empty-title">No followed shops found</div><div class="ma7alak-following-empty-text">Try another shop name.</div></div>`;
      return;
    }

    list.innerHTML=profiles.map(function(shop){
      const slug=String(shop.shop_slug||"").trim();
      const name=String(shop.shop_name||prettyShopName(slug));
      const image=String(shop.profile_image_url||"").trim();
      const hasStory=activeFollowingStorySlugs.has(slug);
      const media=image
        ? `<img class="ma7alak-following-avatar" src="${escapeHTML(image)}" alt="${escapeHTML(name)}" loading="lazy">`
        : `<div class="ma7alak-following-avatar-fallback">${escapeHTML(initials(name))}</div>`;
      return `
        <a class="ma7alak-following-row${hasStory?' ma7alak-has-live-story':''}" href="/${encodeURIComponent(slug)}" aria-label="Open ${escapeHTML(name)}">
          <div class="ma7alak-following-avatar-ring"><div class="ma7alak-following-avatar-inner">${media}</div></div>
          <div class="ma7alak-following-copy">
            <div class="ma7alak-following-name">${escapeHTML(name)}</div>
            <div class="ma7alak-following-status">You are following this shop <span class="ma7alak-following-check">✓</span></div>
          </div>
          <div class="ma7alak-following-arrow">›</div>
        </a>`;
    }).join("");
  }

  async function refreshFollowingStoryState(){
    const supabaseClient=getClient();
    if(!supabaseClient){return;}
    if(!followedShopSlugs.length){
      activeFollowingStorySlugs=new Set();
      if(followingPanelOpen){renderFollowingPanel();}
      return;
    }
    try{
      const result=await supabaseClient
        .from("shop_stories")
        .select("shop_slug,id,expires_at,created_at")
        .in("shop_slug",followedShopSlugs)
        .gt("expires_at",new Date().toISOString());
      if(result.error){throw result.error;}
      const next=new Set((result.data||[]).map(function(row){return String(row.shop_slug||"").trim();}).filter(Boolean));
      const changed=JSON.stringify(Array.from(next).sort())!==JSON.stringify(Array.from(activeFollowingStorySlugs).sort());
      activeFollowingStorySlugs=next;
      if(changed||followingPanelOpen){renderFollowingPanel();}
    }catch(error){
      console.warn("MA7ALAK Following story rings:",error);
    }
  }

  async function refreshFollowingState(){
    const supabaseClient=getClient();
    const visitorId=getFollowVisitorId();
    if(!supabaseClient||!visitorId){return;}
    try{
      const result=await supabaseClient.rpc("get_visitor_followed_shops",{p_visitor_id:visitorId});
      if(result.error){throw result.error;}
      const next=normalizeFollowedSlugs(result.data);
      const changed=JSON.stringify(next.slice().sort())!==JSON.stringify(followedShopSlugs.slice().sort());
      followedShopSlugs=next;
      updateFollowingBadge();
      if(changed||followingPanelOpen){renderFollowingPanel();}
      await refreshFollowingStoryState();
    }catch(error){
      console.error("MA7ALAK header Following:",error);
    }
  }

  function openFollowingPanel(){
    const overlay=document.getElementById("ma7alak-following-overlay");
    if(!overlay){return;}
    followingPanelOpen=true;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";
    renderFollowingPanel();
    refreshFollowingState();
  }

  function closeFollowingPanel(){
    const overlay=document.getElementById("ma7alak-following-overlay");
    if(!overlay){return;}
    followingPanelOpen=false;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow="";
    document.body.style.overflow="";
  }

  function setupFollowingSystem(){
    const button=document.getElementById("ma7alak-header-following");
    const close=document.getElementById("ma7alak-following-close");
    const overlay=document.getElementById("ma7alak-following-overlay");
    if(button){button.addEventListener("click",function(event){event.preventDefault();event.stopPropagation();openFollowingPanel();});}
    if(close){close.addEventListener("click",closeFollowingPanel);}
    if(overlay){overlay.addEventListener("click",function(event){if(event.target===overlay){closeFollowingPanel();}});}
    document.addEventListener("keydown",function(event){if(event.key==="Escape"&&followingPanelOpen){closeFollowingPanel();}});

    const followingSearch=document.getElementById("ma7alak-following-search");
    const followingSearchClear=document.getElementById("ma7alak-following-search-clear");
    function syncFollowingSearch(){
      followingSearchQuery=followingSearch?followingSearch.value:"";
      if(followingSearchClear){followingSearchClear.classList.toggle("visible",!!followingSearchQuery.trim());}
      renderFollowingPanel();
    }
    if(followingSearch){followingSearch.addEventListener("input",syncFollowingSearch);}
    if(followingSearchClear){followingSearchClear.addEventListener("click",function(){if(followingSearch){followingSearch.value="";followingSearch.focus();}syncFollowingSearch();});}

    refreshFollowingState();
    followingRefreshTimer=setInterval(refreshFollowingState,1500);

    const supabaseClient=getClient();
    if(supabaseClient&&typeof supabaseClient.channel==="function"){
      try{
        followingRealtimeChannel=supabaseClient
          .channel("ma7alak-header-following-live-"+Math.random().toString(36).slice(2))
          .on("postgres_changes",{event:"*",schema:"public",table:"shop_follows"},function(){refreshFollowingState();})
          .subscribe();
      }catch(error){}
    }

    if(supabaseClient&&typeof supabaseClient.channel==="function"){
      try{
        followingStoryRealtimeChannel=supabaseClient
          .channel("ma7alak-header-following-stories-live-"+Math.random().toString(36).slice(2))
          .on("postgres_changes",{event:"*",schema:"public",table:"shop_stories"},function(payload){
            const row=(payload&&((payload.new&&payload.new.shop_slug?payload.new:payload.old)))||null;
            const slug=row?String(row.shop_slug||"").trim():"";
            if(!slug||followedShopSlugs.includes(slug)){setTimeout(refreshFollowingStoryState,25);}
          })
          .subscribe();
      }catch(error){}
    }

    window.addEventListener("focus",refreshFollowingState);
    document.addEventListener("visibilitychange",function(){if(!document.hidden){refreshFollowingState();}});
    window.addEventListener("storage",function(event){if(event.key===FOLLOW_VISITOR_KEY){refreshFollowingState();}});
    window.addEventListener("message",function(event){
      if(!event.data){return;}
      if(event.data.type==="MA7ALAK_FOLLOW_CHANGED"||event.data.type==="MA7ALAK_FOLLOW_STATE_CHANGED"){
        setTimeout(refreshFollowingState,30);
      }
    });
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
    supabaseClient.auth.onAuthStateChange(function(){setTimeout(loadOwnerProfile,80);});
  }

  async function start(){
    setupScrollEffect();
    setupHeaderMenu();
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
    setupFollowingSystem();
    await refreshFollowingState();
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


/* =========================================================
   WHAT CHANGED — V25 FOLLOWING SYSTEM
   1. Added a Following icon to the existing premium header.
   2. Badge shows the live number of shops followed by this visitor.
   3. Clicking Following opens a premium dark/gold panel matching Ma7alak.
   4. Every followed shop shows its real shop icon/name and “You are following this shop ✓”.
   5. Clicking the shop row/circle opens that shop page.
   6. Uses the existing get_visitor_followed_shops RPC and ma7alak_visitor_id — no second follow system.
   7. Live refresh via Supabase Realtime when available + 1.5s safe fallback, focus/visibility/message sync.
   8. Works for normal viewers and shop owners following other shops.
   9. Existing Reels, Search, Notifications, owner profile and owner-only Story Likes remain intact.
   10. Owner heart placeholder is now white outline so it matches the real owner-only heart instead of flashing filled red.
========================================================= */

/* =========================================================
   MA7ALAK V29 — IMAGE HERO LOCKED DIRECTLY UNDER TOP PANEL
   - Uses the supplied Ma7alak Lebanon shops artwork as the hero background
   - Hero is PREPENDED to document.body so Hostinger cannot push it to page bottom
   - Existing fixed premium panel remains above it
   - Mobile keeps the original vertical artwork ratio
   - Existing V26 header systems above remain untouched
========================================================= */
(function(){
  "use strict";

  if(window.self !== window.top){ return; }
  if(window.__MA7ALAK_IMAGE_HERO_V29__){ return; }
  window.__MA7ALAK_IMAGE_HERO_V29__ = true;

  const HERO_IMAGE = "data:image/jpeg;base64,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";

  function mountHero(){
    if(document.getElementById("ma7alak-top-image-hero")){ return; }
    if(!document.body){ setTimeout(mountHero,80); return; }

    const hero=document.createElement("section");
    hero.id="ma7alak-top-image-hero";
    hero.setAttribute("aria-label","Ma7alak — بيستاهل ينشاف");
    hero.innerHTML=`
      <img class="m7hero-bg" src="${HERO_IMAGE}" alt="Ma7alak — بيستاهل ينشاف" decoding="async" fetchpriority="high">
      <div class="m7hero-bottom-shade" aria-hidden="true"></div>
      <div class="m7hero-actions-wrap">
        <div class="m7hero-discovery" dir="rtl">
          <span>وفّر ع حالك الجولات</span>
          <i>—</i>
          <b>عنا بتلاقي المحلات</b>
        </div>
        <div class="m7hero-actions">
          <a class="m7hero-btn m7hero-primary" href="https://ma7alak.com/dhyf-mhlk-" aria-label="ضيف محلك">
            <span class="m7hero-plus">+</span><span>ضيف محلك</span>
          </a>
          <a class="m7hero-btn m7hero-secondary" href="https://ma7alak.com/shwf-almhlat-" aria-label="شوف المحلّات">
            <span>شوف المحلّات</span><span class="m7hero-eye">◉</span>
          </a>
        </div>
      </div>`;

    /*
       CRITICAL PLACEMENT FIX:
       Do NOT insert after #ma7alak-social-header. The premium header is injected
       late into body, so Hostinger can make an afterend element appear at the bottom.
       This hero becomes the FIRST normal-flow element in body instead.
       body.ma7alak-header-page already has top padding for the fixed panel.
    */
    document.body.insertBefore(hero,document.body.firstChild);

    const style=document.createElement("style");
    style.id="ma7alak-top-image-hero-style";
    style.textContent=`
      #ma7alak-top-image-hero,
      #ma7alak-top-image-hero *{box-sizing:border-box}

      #ma7alak-top-image-hero{
        position:relative;
        z-index:2;
        width:min(1180px,calc(100vw - 24px));
        height:clamp(430px,62vw,690px);
        margin:0 auto 18px!important;
        padding:0!important;
        overflow:hidden;
        border-radius:0 0 26px 26px;
        background:#07090d;
        border:1px solid rgba(217,164,65,.20);
        border-top:0;
        box-shadow:0 18px 44px rgba(0,0,0,.32),0 0 30px rgba(217,164,65,.04);
        font-family:Arial,"Noto Sans Arabic",Tahoma,sans-serif;
        isolation:isolate;
      }

      #ma7alak-top-image-hero .m7hero-bg{
        position:absolute;
        inset:0;
        z-index:0;
        display:block;
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center 42%;
        user-select:none;
        -webkit-user-drag:none;
        pointer-events:none;
        transform:scale(1.002);
        animation:m7heroBreath 10s ease-in-out infinite alternate;
      }

      @keyframes m7heroBreath{
        from{transform:scale(1.002)}
        to{transform:scale(1.025)}
      }

      .m7hero-bottom-shade{
        position:absolute;
        z-index:1;
        left:0;right:0;bottom:0;
        height:34%;
        pointer-events:none;
        background:linear-gradient(180deg,transparent 0%,rgba(3,4,6,.20) 25%,rgba(3,4,6,.80) 100%);
      }

      .m7hero-actions-wrap{
        position:absolute;
        z-index:3;
        left:18px;
        right:18px;
        bottom:22px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:11px;
        pointer-events:none;
      }

      .m7hero-discovery{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        flex-wrap:wrap;
        color:#fff;
        font-size:clamp(15px,2vw,21px);
        font-weight:900;
        line-height:1.25;
        text-align:center;
        text-shadow:0 3px 12px rgba(0,0,0,.90);
        animation:m7heroDiscovery 3.8s ease-in-out infinite;
      }
      .m7hero-discovery b{color:#f1bf59}
      .m7hero-discovery i{font-style:normal;color:rgba(241,191,89,.75)}

      @keyframes m7heroDiscovery{
        0%,100%{transform:translateY(0);filter:brightness(1)}
        50%{transform:translateY(-2px);filter:brightness(1.12)}
      }

      .m7hero-actions{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:12px;
        width:100%;
        pointer-events:auto;
      }

      .m7hero-btn{
        position:relative;
        isolation:isolate;
        overflow:hidden;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:10px;
        min-width:190px;
        height:50px;
        padding:0 24px;
        border-radius:999px;
        border:1px solid rgba(240,188,78,.78);
        color:#fff!important;
        text-decoration:none!important;
        font-size:15px;
        font-weight:900;
        background:rgba(5,6,8,.76);
        box-shadow:0 8px 26px rgba(0,0,0,.40),0 0 18px rgba(217,164,65,.10),inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(9px);
        -webkit-backdrop-filter:blur(9px);
        transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;
        -webkit-tap-highlight-color:transparent;
      }

      .m7hero-primary{
        background:linear-gradient(135deg,rgba(226,174,68,.94),rgba(133,79,15,.92));
        color:#090806!important;
        border-color:#efc05f;
      }

      .m7hero-btn::before{
        content:"";
        position:absolute;
        z-index:-1;
        inset:-2px;
        background:linear-gradient(110deg,transparent 28%,rgba(255,241,196,.42) 48%,transparent 67%);
        transform:translateX(-130%);
        animation:m7heroShine 4s ease-in-out infinite;
      }
      .m7hero-secondary::before{animation-delay:-2s}

      @keyframes m7heroShine{
        0%,56%{transform:translateX(-130%)}
        86%,100%{transform:translateX(130%)}
      }

      .m7hero-btn:hover{
        transform:translateY(-2px);
        border-color:#f3c768;
        box-shadow:0 10px 30px rgba(0,0,0,.46),0 0 24px rgba(217,164,65,.16);
      }
      .m7hero-btn:active{transform:scale(.97)}

      .m7hero-plus{
        width:25px;height:25px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        font-size:22px;
        line-height:1;
        animation:m7heroPlus 1.7s ease-in-out infinite;
      }
      @keyframes m7heroPlus{
        0%,100%{transform:scale(1) rotate(0)}
        45%{transform:scale(1.18) rotate(-9deg)}
        65%{transform:scale(1.08) rotate(6deg)}
      }

      .m7hero-eye{
        display:inline-block;
        font-size:24px;
        line-height:1;
        animation:m7heroEye 2.2s ease-in-out infinite;
      }
      @keyframes m7heroEye{
        0%,100%{transform:translateX(0) scaleY(1)}
        24%{transform:translateX(-2px) scaleY(1)}
        38%{transform:translateX(0) scaleY(.24)}
        53%{transform:translateX(2px) scaleY(1)}
      }

      /* PHONE — preserve the supplied artwork's vertical 2:3 composition */
      @media(max-width:700px){
        #ma7alak-top-image-hero{
          width:calc(100vw - 12px);
          height:auto;
          aspect-ratio:2 / 3;
          margin:0 auto 14px!important;
          border-radius:0 0 20px 20px;
        }
        #ma7alak-top-image-hero .m7hero-bg{
          object-fit:cover;
          object-position:center top;
          animation:none;
          transform:none;
        }
        .m7hero-bottom-shade{height:29%}
        .m7hero-actions-wrap{left:10px;right:10px;bottom:14px;gap:8px}
        .m7hero-discovery{font-size:13px;gap:5px}
        .m7hero-actions{gap:8px}
        .m7hero-btn{
          flex:1 1 0;
          min-width:0;
          max-width:190px;
          height:44px;
          padding:0 10px;
          gap:7px;
          font-size:13px;
        }
        .m7hero-plus{width:22px;height:22px;font-size:20px}
        .m7hero-eye{font-size:21px}
      }

      @media(max-width:390px){
        #ma7alak-top-image-hero{width:calc(100vw - 8px)}
        .m7hero-actions-wrap{left:7px;right:7px;bottom:10px}
        .m7hero-discovery{font-size:11.5px}
        .m7hero-btn{height:41px;font-size:12px;padding:0 8px}
      }

      @media(prefers-reduced-motion:reduce){
        #ma7alak-top-image-hero .m7hero-bg,
        .m7hero-discovery,
        .m7hero-btn::before,
        .m7hero-plus,
        .m7hero-eye{animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",mountHero,{once:true});
  }else{
    mountHero();
  }
})();
