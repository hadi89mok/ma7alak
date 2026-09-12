(function(){
  "use strict";

  if(window.__MA7ALAK_STORIES_GITHUB_READY_LOADED__){
    return;
  }
  window.__MA7ALAK_STORIES_GITHUB_READY_LOADED__ = true;

  const MA7ALAK_STORY_CSS = `/* =========================================================
   STORY WRAPPER
========================================================= */

#ma7alak-story-wrapper{

  width:100%!important;

  display:flex!important;

  justify-content:center!important;
  align-items:center!important;

  margin:15px 0!important;

  padding:0!important;

  position:relative!important;

  min-height:82px!important;

  background:transparent!important;

  border:none!important;

  border-radius:0!important;

  box-shadow:none!important;

  -webkit-box-shadow:none!important;

  outline:none!important;

  overflow:visible!important;

  z-index:999999!important;

}


/* =========================================================
   NEW STORY RING
========================================================= */

#ma7alak-story-new-ring{

  position:absolute!important;

  left:50%!important;
  top:50%!important;

  width:90px!important;
  height:90px!important;

  transform:
    translate(-50%,-50%)
    scale(.88);

  border-radius:50%!important;

  border:3px solid #d9a441!important;

  background:transparent!important;

  box-shadow:none!important;

  pointer-events:none!important;

  opacity:0;

  z-index:1!important;

  box-sizing:border-box!important;

}


/* =========================================================
   NEW STORY ACTIVE
========================================================= */

#ma7alak-story-wrapper.story-has-new
#ma7alak-story-new-ring{

  opacity:1;

  animation:
    ma7alakNewStoryPulse
    1.65s
    ease-out
    infinite;

  -webkit-animation:
    ma7alakNewStoryPulse
    1.65s
    ease-out
    infinite;

}


/* =========================================================
   NEW STORY PULSE
========================================================= */

@keyframes ma7alakNewStoryPulse{

  0%{

    transform:
      translate(-50%,-50%)
      scale(.88);

    opacity:1;

    border-width:3px;

  }

  55%{

    transform:
      translate(-50%,-50%)
      scale(1.08);

    opacity:.58;

    border-width:2px;

  }

  100%{

    transform:
      translate(-50%,-50%)
      scale(1.30);

    opacity:0;

    border-width:1px;

  }

}


@-webkit-keyframes ma7alakNewStoryPulse{

  0%{

    -webkit-transform:
      translate(-50%,-50%)
      scale(.88);

    opacity:1;

    border-width:3px;

  }

  55%{

    -webkit-transform:
      translate(-50%,-50%)
      scale(1.08);

    opacity:.58;

    border-width:2px;

  }

  100%{

    -webkit-transform:
      translate(-50%,-50%)
      scale(1.30);

    opacity:0;

    border-width:1px;

  }

}


/* =========================================================
   STORY BUTTON
========================================================= */

#ma7alak-story-button{

  position:relative!important;

  width:82px!important;
  height:82px!important;

  padding:3px!important;

  margin:0!important;

  border-radius:50%!important;

  border:3px solid #d9a441!important;

  background:#111!important;

  box-shadow:none!important;

  -webkit-box-shadow:none!important;

  filter:none!important;

  cursor:pointer!important;

  overflow:hidden!important;

  display:flex!important;

  align-items:center!important;

  justify-content:center!important;

  appearance:none!important;

  -webkit-appearance:none!important;

  outline:none!important;

  z-index:2!important;

  -webkit-tap-highlight-color:
    transparent!important;

  box-sizing:border-box!important;

  clip-path:
    circle(50% at 50% 50%)!important;

  -webkit-clip-path:
    circle(50% at 50% 50%)!important;

}


/* =========================================================
   REMOVE BUTTON EFFECTS
========================================================= */

#ma7alak-story-button::before,
#ma7alak-story-button::after{

  content:none!important;

  background:transparent!important;

  border:none!important;

  box-shadow:none!important;

}


#ma7alak-story-button:hover,
#ma7alak-story-button:focus,
#ma7alak-story-button:focus-visible,
#ma7alak-story-button:active{

  outline:none!important;

  background:#111!important;

  box-shadow:none!important;

  -webkit-box-shadow:none!important;

}


/* =========================================================
   STORY PREVIEW
========================================================= */

#ma7alak-story-preview{

  width:100%!important;
  height:100%!important;

  margin:0!important;

  padding:0!important;

  border-radius:50%!important;

  overflow:hidden!important;

  background:#171717!important;

  border:none!important;

  box-shadow:none!important;

  display:flex!important;

  align-items:center!important;

  justify-content:center!important;

}


#ma7alak-story-preview img,
#ma7alak-story-preview video{

  width:100%!important;
  height:100%!important;

  object-fit:cover!important;

  border-radius:50%!important;

  border:none!important;

  box-shadow:none!important;

  display:block!important;

}


/* =========================================================
   EMPTY CIRCLE
========================================================= */

.ma7alak-story-placeholder{

  width:100%!important;
  height:100%!important;

  border-radius:50%!important;

  display:flex!important;

  align-items:center!important;

  justify-content:center!important;

  background:
    linear-gradient(
      135deg,
      #121212,
      #292929
    )!important;

  color:transparent!important;

  font-size:0!important;

}


/* =========================================================
   OWNER PLUS
========================================================= */

#ma7alak-owner-add-story{

  position:absolute!important;

  width:28px!important;
  height:28px!important;

  right:calc(50% - 49px)!important;

  bottom:-2px!important;

  border:2px solid #111!important;

  border-radius:50%!important;

  background:#d9a441!important;

  color:#111!important;

  display:none;

  align-items:center!important;

  justify-content:center!important;

  font-size:21px!important;

  font-weight:900!important;

  line-height:1!important;

  padding:0!important;

  margin:0!important;

  cursor:pointer!important;

  z-index:20!important;

  box-shadow:
    0 3px 12px rgba(0,0,0,.45)!important;

  -webkit-box-shadow:
    0 3px 12px rgba(0,0,0,.45)!important;

  appearance:none!important;

  -webkit-appearance:none!important;

  outline:none!important;

  -webkit-tap-highlight-color:
    transparent!important;

}


#ma7alak-owner-add-story.visible{

  display:flex!important;

}


#ma7alak-owner-add-story:active{

  transform:scale(.90)!important;

}


/* =========================================================
   FULL STORY
========================================================= */

#ma7alak-full-story{

  position:fixed!important;

  inset:0!important;

  width:100vw!important;
  height:100vh!important;

  width:100dvw!important;
  height:100dvh!important;

  background:#000!important;

  display:none;

  align-items:center!important;

  justify-content:center!important;

  overflow:hidden!important;

  z-index:2147483647!important;

  margin:0!important;

  padding:0!important;

  box-sizing:border-box!important;

  isolation:isolate;

  border:none!important;

  outline:none!important;

}


#ma7alak-full-story.active{

  display:flex!important;

}


/* =========================================================
   NATIVE FULLSCREEN
========================================================= */

#ma7alak-full-story:fullscreen{

  width:100vw!important;
  height:100vh!important;

  background:#000!important;

}


#ma7alak-full-story:-webkit-full-screen{

  width:100vw!important;
  height:100vh!important;

  background:#000!important;

}


/* =========================================================
   STORY MEDIA
========================================================= */

#ma7alak-full-story-media{

  position:absolute!important;

  top:50%!important;
  left:50%!important;

  transform:
    translate(-50%,-50%);

  width:
    calc(100vw - 24px)!important;

  height:
    calc(100vh - 24px)!important;

  width:
    calc(100dvw - 24px)!important;

  height:
    calc(100dvh - 24px)!important;

  background:#000!important;

  display:block!important;

  overflow:hidden!important;

  border-radius:24px!important;

  box-sizing:border-box!important;

  isolation:isolate;

  border:none!important;

  outline:none!important;

}


/* =========================================================
   MEDIA LAYERS
========================================================= */

.ma7alak-story-media-layer{

  position:absolute!important;

  inset:0!important;

  width:100%!important;
  height:100%!important;

  object-fit:contain!important;

  background:#000!important;

  border-radius:24px!important;

  display:block!important;

  opacity:0;

  visibility:hidden;

  transition:
    opacity .32s ease;

  will-change:opacity;

  backface-visibility:hidden;

  -webkit-backface-visibility:hidden;

  transform:
    translateZ(0);

  z-index:1;

  border:none!important;

  outline:none!important;

}


.ma7alak-story-media-layer.active{

  opacity:1;

  visibility:visible;

  z-index:2;

}


/* =========================================================
   STORY SHOP NAME
========================================================= */

#ma7alak-story-shop-name{

  position:absolute!important;

  top:64px!important;

  left:20px!important;

  max-width:calc(100% - 130px)!important;

  color:#fff!important;

  font-family:
    Arial,
    "Segoe UI",
    sans-serif!important;

  font-size:16px!important;

  font-weight:800!important;

  line-height:22px!important;

  white-space:nowrap!important;

  overflow:hidden!important;

  text-overflow:ellipsis!important;

  text-shadow:
    0 2px 10px rgba(0,0,0,.55)!important;

  pointer-events:none!important;

  z-index:125!important;

  box-sizing:border-box!important;

}


/* =========================================================
   STORY TIME
========================================================= */

#ma7alak-story-time{

  position:absolute!important;

  top:90px!important;

  left:20px!important;

  min-height:32px!important;

  padding:
    0 12px!important;

  display:flex!important;

  align-items:center!important;

  justify-content:center!important;

  border:
    1px solid
    rgba(255,255,255,.14)!important;

  border-radius:18px!important;

  background:
    rgba(15,15,15,.68)!important;

  color:
    rgba(255,255,255,.88)!important;

  font-family:
    Arial,
    "Segoe UI",
    sans-serif!important;

  font-size:11px!important;

  font-weight:700!important;

  line-height:32px!important;

  white-space:nowrap!important;

  backdrop-filter:blur(12px)!important;

  -webkit-backdrop-filter:blur(12px)!important;

  box-shadow:
    0 5px 20px rgba(0,0,0,.28)!important;

  pointer-events:none!important;

  z-index:125!important;

  box-sizing:border-box!important;

}


/* =========================================================
   OWNER DELETE BUTTON
========================================================= */

#ma7alak-story-delete-btn{

  position:absolute!important;

  top:106px!important;

  right:20px!important;

  width:48px!important;

  height:48px!important;

  display:none!important;

  align-items:center!important;

  justify-content:center!important;

  border:
    1px solid
    rgba(255,255,255,.13)!important;

  border-radius:50%!important;

  background:
    rgba(20,20,20,.72)!important;

  color:#fff!important;

  font-size:20px!important;

  line-height:1!important;

  padding:0!important;

  margin:0!important;

  cursor:pointer!important;

  z-index:125!important;

  backdrop-filter:blur(10px)!important;

  -webkit-backdrop-filter:blur(10px)!important;

  outline:none!important;

  appearance:none!important;

  -webkit-appearance:none!important;

  -webkit-tap-highlight-color:
    transparent!important;

  box-sizing:border-box!important;

}


#ma7alak-story-delete-btn.visible{

  display:flex!important;

}


#ma7alak-story-delete-btn:hover{

  background:
    rgba(150,25,25,.78)!important;

  border-color:
    rgba(255,90,90,.35)!important;

}


#ma7alak-story-delete-btn:active{

  transform:scale(.90)!important;

  background:
    rgba(180,25,25,.88)!important;

}


/* =========================================================
   DESKTOP STORY
========================================================= */

@media(min-width:601px){

  #ma7alak-full-story-media{

    width:
      min(
        520px,
        calc(100vw - 40px)
      )!important;

    height:
      min(
        900px,
        calc(100vh - 30px)
      )!important;

    width:
      min(
        520px,
        calc(100dvw - 40px)
      )!important;

    height:
      min(
        900px,
        calc(100dvh - 30px)
      )!important;

    border-radius:26px!important;

  }


  .ma7alak-story-media-layer{

    border-radius:26px!important;

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media(max-width:600px){

  #ma7alak-story-wrapper{

    min-height:76px!important;

    margin:15px 0!important;

  }


  #ma7alak-story-button{

    width:76px!important;

    height:76px!important;

  }


  #ma7alak-story-new-ring{

    width:82px!important;

    height:82px!important;

  }


  #ma7alak-owner-add-story{

    width:27px!important;

    height:27px!important;

    right:calc(50% - 47px)!important;

    bottom:-1px!important;

    font-size:20px!important;

  }


  /* -----------------------------------------
     STORY VIEWER
  ----------------------------------------- */

  #ma7alak-full-story-media{

    width:
      calc(100vw - 12px)!important;

    height:
      calc(100vh - 12px)!important;

    width:
      calc(100dvw - 12px)!important;

    height:
      calc(100dvh - 12px)!important;

    border-radius:20px!important;

  }


  .ma7alak-story-media-layer{

    border-radius:20px!important;

  }


  /* -----------------------------------------
     SHOP NAME
  ----------------------------------------- */

  #ma7alak-story-shop-name{

    top:54px!important;

    left:14px!important;

    max-width:calc(100% - 105px)!important;

    font-size:15px!important;

    line-height:21px!important;

  }


  /* -----------------------------------------
     TIME
  ----------------------------------------- */

  #ma7alak-story-time{

    top:80px!important;

    left:14px!important;

    min-height:30px!important;

    padding:
      0 10px!important;

    font-size:10px!important;

    line-height:30px!important;

  }


  /* -----------------------------------------
     DELETE
  ----------------------------------------- */

  #ma7alak-story-delete-btn{

    top:106px!important;

    right:14px!important;

    width:44px!important;

    height:44px!important;

    font-size:18px!important;

  }

}


/* =========================================================
   VERY SMALL PHONES
========================================================= */

@media(max-width:380px){

  #ma7alak-story-button{

    width:74px!important;
    height:74px!important;

  }


  #ma7alak-story-delete-btn{

    top:104px!important;

    right:14px!important;

    width:42px!important;

    height:42px!important;

  }

}


/* =========================================================
   STORY LIKE BUTTON
========================================================= */

#ma7alak-story-like-btn{

  position:absolute!important;
  left:50%!important;
  bottom:34px!important;
  transform:translateX(-50%)!important;

  width:56px!important;
  min-width:56px!important;
  height:56px!important;
  padding:0!important;
  margin:0!important;

  display:flex!important;
  align-items:center!important;
  justify-content:center!important;

  border:1px solid rgba(255,255,255,.28)!important;
  border-radius:50%!important;
  background:linear-gradient(145deg,rgba(28,28,31,.86),rgba(8,8,10,.72))!important;
  color:rgba(255,255,255,.96)!important;

  font-family:Arial,"Segoe UI",sans-serif!important;
  font-size:30px!important;
  line-height:1!important;
  font-weight:400!important;

  backdrop-filter:blur(18px) saturate(140%)!important;
  -webkit-backdrop-filter:blur(18px) saturate(140%)!important;
  box-shadow:
    0 10px 30px rgba(0,0,0,.38),
    inset 0 1px 0 rgba(255,255,255,.18),
    inset 0 -1px 0 rgba(0,0,0,.35)!important;

  cursor:pointer!important;
  z-index:2147483646!important;
  outline:none!important;
  appearance:none!important;
  -webkit-appearance:none!important;
  -webkit-tap-highlight-color:transparent!important;
  box-sizing:border-box!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
  transition:
    transform .18s ease,
    border-color .22s ease,
    box-shadow .22s ease,
    background .22s ease!important;
}

#ma7alak-story-like-btn::before{
  content:""!important;
  position:absolute!important;
  inset:-3px!important;
  border-radius:50%!important;
  border:1px solid rgba(217,164,65,.28)!important;
  pointer-events:none!important;
  opacity:.8!important;
}

#ma7alak-story-like-btn .ma7alak-like-heart{
  display:block!important;
  position:relative!important;
  z-index:1!important;
  font-size:30px!important;
  line-height:1!important;
  transform:translateY(1px)!important;
  text-shadow:0 2px 10px rgba(0,0,0,.35)!important;
  transition:
    transform .18s ease,
    color .22s ease,
    text-shadow .22s ease!important;
}

#ma7alak-story-like-btn.liked{
  color:#ff4b67!important;
  border-color:rgba(255,92,115,.72)!important;
  background:linear-gradient(145deg,rgba(62,17,28,.94),rgba(22,8,14,.9))!important;
  box-shadow:
    0 10px 34px rgba(0,0,0,.42),
    0 0 24px rgba(255,64,91,.22),
    inset 0 1px 0 rgba(255,255,255,.14),
    inset 0 -1px 0 rgba(0,0,0,.35)!important;
}

#ma7alak-story-like-btn.liked::before{
  border-color:rgba(255,92,115,.5)!important;
}

#ma7alak-story-like-btn.liked .ma7alak-like-heart{
  color:#ff4b67!important;
  text-shadow:
    0 0 12px rgba(255,64,91,.42),
    0 2px 10px rgba(0,0,0,.3)!important;
  animation:ma7alakHeartPop .32s ease-out!important;
}

#ma7alak-story-like-btn:active{
  transform:translateX(-50%) scale(.9)!important;
}

#ma7alak-story-like-btn:hover{
  border-color:rgba(255,255,255,.42)!important;
  box-shadow:
    0 12px 34px rgba(0,0,0,.42),
    0 0 18px rgba(217,164,65,.10),
    inset 0 1px 0 rgba(255,255,255,.2)!important;
}

#ma7alak-story-like-btn.liked:hover{
  border-color:rgba(255,92,115,.86)!important;
  box-shadow:
    0 12px 36px rgba(0,0,0,.44),
    0 0 28px rgba(255,64,91,.28),
    inset 0 1px 0 rgba(255,255,255,.16)!important;
}

#ma7alak-story-like-btn:disabled{
  cursor:default!important;
  opacity:.72!important;
}

@keyframes ma7alakHeartPop{
  0%{transform:translateY(1px) scale(.72);}
  55%{transform:translateY(1px) scale(1.18);}
  100%{transform:translateY(1px) scale(1);}
}

/* =========================================================
   FACEBOOK-STYLE LIKE HEART BURST
========================================================= */

#ma7alak-story-heart-burst{
  position:absolute!important;
  inset:0!important;
  overflow:hidden!important;
  pointer-events:none!important;
  z-index:2147483647!important;
}

.ma7alak-story-floating-heart{
  position:absolute!important;
  left:50%!important;
  bottom:42px!important;
  display:block!important;
  pointer-events:none!important;
  user-select:none!important;
  -webkit-user-select:none!important;
  color:#ff4b67!important;
  font-family:Arial,"Segoe UI",sans-serif!important;
  font-weight:900!important;
  line-height:1!important;
  text-shadow:
    0 4px 12px rgba(0,0,0,.28),
    0 0 14px rgba(255,75,103,.38)!important;
  will-change:transform,opacity!important;
  animation:
    ma7alakStoryHeartFloat
    var(--ma7alak-heart-duration,1.35s)
    cubic-bezier(.16,.75,.28,1)
    forwards!important;
}

@keyframes ma7alakStoryHeartFloat{
  0%{
    opacity:0;
    transform:
      translate3d(-50%,12px,0)
      scale(.45)
      rotate(0deg);
  }
  12%{
    opacity:1;
  }
  60%{
    opacity:.96;
  }
  100%{
    opacity:0;
    transform:
      translate3d(
        calc(-50% + var(--ma7alak-heart-x,0px)),
        var(--ma7alak-heart-y,-62vh),
        0
      )
      scale(var(--ma7alak-heart-scale,1.15))
      rotate(var(--ma7alak-heart-rotate,0deg));
  }
}

@media(max-width:600px){
  .ma7alak-story-floating-heart{
    bottom:34px!important;
  }
}


@media(max-width:600px){
  #ma7alak-story-like-btn{
    bottom:28px!important;
    width:54px!important;
    min-width:54px!important;
    height:54px!important;
  }

  #ma7alak-story-like-btn .ma7alak-like-heart{
    font-size:29px!important;
  }
}


/* =========================================================
   PROGRESS BARS
========================================================= */

#ma7alak-story-progress-wrap{

  position:absolute;

  top:10px;

  left:12px;
  right:12px;

  height:4px;

  display:flex;

  gap:4px;

  z-index:100;

  pointer-events:none;

}


.ma7alak-story-progress-segment{

  flex:1;

  height:4px;

  border-radius:20px;

  background:
    rgba(255,255,255,.30);

  overflow:hidden;

  position:relative;

}


.ma7alak-story-progress-fill{

  position:absolute;

  left:0;
  top:0;

  width:0%;

  height:100%;

  background:#d9a441;

  border-radius:20px;

}


/* =========================================================
   CLOSE STORY
========================================================= */

#ma7alak-story-close-btn{

  position:absolute;

  top:48px;
  right:20px;

  width:48px;
  height:48px;

  border:none!important;

  border-radius:50%;

  background:
    rgba(20,20,20,.72);

  color:#fff;

  font-size:30px;

  line-height:48px;

  padding:0;

  text-align:center;

  cursor:pointer;

  z-index:120;

  backdrop-filter:blur(10px);

  -webkit-backdrop-filter:blur(10px);

  -webkit-tap-highlight-color:
    transparent;

  outline:none!important;

}


/* =========================================================
   TAP AREAS
========================================================= */

#ma7alak-story-tap-left,
#ma7alak-story-tap-right{

  position:absolute;

  top:0;
  bottom:0;

  width:50%;

  z-index:90;

  cursor:pointer;

  background:transparent!important;

  border:none!important;

  padding:0;

  margin:0;

  outline:none!important;

  appearance:none!important;

  -webkit-appearance:none!important;

  -webkit-tap-highlight-color:
    transparent!important;

  box-shadow:none!important;

}


#ma7alak-story-tap-left{

  left:0;

}


#ma7alak-story-tap-right{

  right:0;

}


#ma7alak-story-tap-left:focus,
#ma7alak-story-tap-left:focus-visible,
#ma7alak-story-tap-left:active,
#ma7alak-story-tap-right:focus,
#ma7alak-story-tap-right:focus-visible,
#ma7alak-story-tap-right:active{

  background:transparent!important;

  border:0!important;

  outline:none!important;

  box-shadow:none!important;

}


/* =========================================================
   MOBILE STORY CONTROLS
========================================================= */

@media(max-width:600px){

  #ma7alak-story-close-btn{

    top:54px;

    right:14px;

    width:44px;

    height:44px;

    line-height:44px;

  }


  #ma7alak-story-progress-wrap{

    top:8px;

    left:9px;
    right:9px;

    height:3px;

    gap:3px;

  }


  .ma7alak-story-progress-segment{

    height:3px;

  }

}`;

  const MA7ALAK_STORY_MARKUP = `<div
  id="ma7alak-story-wrapper"
  style="
    background:transparent !important;
    border:none !important;
    box-shadow:none !important;
    outline:none !important;
  "
>

  <div
    id="ma7alak-story-new-ring"
    aria-hidden="true"
  ></div>

<button
id="ma7alak-story-button"
type="button"
aria-label="View stories"



<div id="ma7alak-story-preview">

  <div
    class="ma7alak-story-placeholder"
  ></div>

</div>

  </button>

<button
id="ma7alak-owner-add-story"
type="button"
aria-label="Add story"



+

  </button>

</div>`;

  function injectStoryUI(){
    if(!document.getElementById("ma7alak-stories-injected-style")){
      const style = document.createElement("style");
      style.id = "ma7alak-stories-injected-style";
      style.textContent = MA7ALAK_STORY_CSS;
      document.head.appendChild(style);
    }

    if(!document.getElementById("ma7alak-story-wrapper")){
      const holder = document.createElement("div");
      holder.innerHTML = MA7ALAK_STORY_MARKUP;

      const currentScript = document.currentScript;
      const parent = currentScript && currentScript.parentNode
        ? currentScript.parentNode
        : document.body;

      while(holder.firstChild){
        parent.insertBefore(
          holder.firstChild,
          currentScript && currentScript.parentNode === parent
            ? currentScript
            : null
        );
      }
    }
  }

  function startMa7alakStories(){
(function(){

  "use strict";


  /* =========================================================
     SUPABASE
  ========================================================= */

  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";


  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


  const supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );


  /* =========================================================
     SHOP
  ========================================================= */

  const SHOP_SLUG =
    "masaya-cafe";


  /* =========================================================
     SEEN KEY
  ========================================================= */

  const STORY_SEEN_KEY =
    "ma7alak_story_seen_" +
    SHOP_SLUG;


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const storyWrapper =
    document.getElementById(
      "ma7alak-story-wrapper"
    );


  const storyButton =
    document.getElementById(
      "ma7alak-story-button"
    );


  const storyPreview =
    document.getElementById(
      "ma7alak-story-preview"
    );


  const ownerAddButton =
    document.getElementById(
      "ma7alak-owner-add-story"
    );


  const newRing =
    document.getElementById(
      "ma7alak-story-new-ring"
    );


  /* =========================================================
     DATA
  ========================================================= */

  let stories = [];

  let currentStory = 0;

  let timer = null;

  let currentMedia = null;

  let transitionToken = 0;

  let isShopOwner = false;

  let newRingAnimation = null;

  let isDeletingStory = false;

  let storyHistoryPushed = false;


  /* =========================================================
     STORY LIKES
  ========================================================= */

  const VISITOR_ID_KEY =
    "ma7alak_visitor_id";

  let visitorId = null;

  const likedStoryIds = new Set();

  try{

    visitorId =
      localStorage.getItem(
        VISITOR_ID_KEY
      );

  }
  catch(error){}

  if(!visitorId){

    try{

      visitorId =
        crypto.randomUUID();

    }
    catch(error){

      visitorId =
        "visitor_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2);

    }

    try{

      localStorage.setItem(
        VISITOR_ID_KEY,
        visitorId
      );

    }
    catch(error){}

  }

  try{

    const savedLikes =
      JSON.parse(
        localStorage.getItem(
          "ma7alak_story_liked_ids"
        ) || "[]"
      );

    if(Array.isArray(savedLikes)){

      savedLikes.forEach(
        function(id){

          if(id != null){
            likedStoryIds.add(
              String(id)
            );
          }

        }
      );

    }

  }
  catch(error){}

  function saveLikedStories(){

    try{

      localStorage.setItem(
        "ma7alak_story_liked_ids",
        JSON.stringify(
          Array.from(
            likedStoryIds
          )
        )
      );

    }
    catch(error){}

  }


  /* =========================================================
     STORY URL
  ========================================================= */

  function storyURL(path){

    return (
      SUPABASE_URL +
      "/storage/v1/object/public/shop-stories/" +
      path
    );

  }


  /* =========================================================
     MEDIA TYPE
  ========================================================= */

  function mediaType(story){

    if(
      story.media_type ===
      "video"
    ){

      return "video";

    }


    if(
      story.media_type ===
      "image"
    ){

      return "image";

    }


    const path =
      String(
        story.storage_path ||
        ""
      ).toLowerCase();


    if(
      path.endsWith(".mp4") ||
      path.endsWith(".webm") ||
      path.endsWith(".mov") ||
      path.endsWith(".m4v")
    ){

      return "video";

    }


    return "image";

  }


  /* =========================================================
     TIME AGO
  ========================================================= */

  function storyTimeAgo(createdAt){

    const created =
      new Date(createdAt).getTime();

    if(!Number.isFinite(created)){
      return "Just now";
    }

    const now = Date.now();

    let seconds =
      Math.floor(
        (now - created) /
        1000
      );

    if(seconds < 0){
      seconds = 0;
    }

    if(seconds < 10){
      return "Just now";
    }

    if(seconds < 60){
      return seconds + (seconds === 1 ? " second ago" : " seconds ago");
    }

    const minutes =
      Math.floor(seconds / 60);

    if(minutes < 60){
      return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    }

    const hours =
      Math.floor(minutes / 60);

    if(hours < 24){
      return hours + (hours === 1 ? " hour ago" : " hours ago");
    }

    const days =
      Math.floor(hours / 24);

    if(days === 1){
      return "Yesterday";
    }

    if(days < 7){
      return days + " days ago";
    }

    const weeks =
      Math.floor(days / 7);

    if(weeks === 1){
      return "1 week ago";
    }

    return weeks + " weeks ago";

  }


  /* =========================================================
     UPDATE STORY TIME
  ========================================================= */

  function updateStoryTime(){

    const timeElement =
      document.getElementById(
        "ma7alak-story-time"
      );

    const nameElement =
      document.getElementById(
        "ma7alak-story-shop-name"
      );


    if(
      !stories.length
    ){

      return;

    }


    const story =
      stories[
        currentStory
      ];


    if(!story){

      return;

    }


    if(timeElement){

      timeElement.textContent =
        storyTimeAgo(
          story.created_at
        );

    }


    if(nameElement){

      const shopName =
        String(story.shop_slug || SHOP_SLUG)
          .split("-")
          .filter(Boolean)
          .map(function(part){
            return part.charAt(0).toUpperCase() + part.slice(1);
          })
          .join(" ");

      nameElement.textContent =
        shopName || "Ma7alak";

      /*
        Every Story already has its own unique Supabase
        story.id. Keep that ID attached to the displayed
        shop name so the name always belongs to the exact
        Story currently open.
      */
      nameElement.setAttribute(
        "data-story-id",
        String(story.id)
      );

    }

  }


  /* =========================================================
     START NEW STORY ANIMATION
  ========================================================= */

  function startNewStoryAnimation(){

    if(!storyWrapper){

      return;

    }


    storyWrapper.classList.remove(
      "story-has-new"
    );


    void storyWrapper.offsetWidth;


    storyWrapper.classList.add(
      "story-has-new"
    );


    if(
      newRing &&
      typeof newRing.animate ===
      "function"
    ){

      try{

        if(
          newRingAnimation
        ){

          newRingAnimation.cancel();

        }


        newRingAnimation =
          newRing.animate(

            [

              {

                transform:
                  "translate(-50%,-50%) scale(.88)",

                opacity:1

              },

              {

                transform:
                  "translate(-50%,-50%) scale(1.08)",

                opacity:.58

              },

              {

                transform:
                  "translate(-50%,-50%) scale(1.30)",

                opacity:0

              }

            ],

            {

              duration:1650,

              easing:
                "cubic-bezier(.2,.65,.3,1)",

              iterations:
                Infinity

            }

          );

      }

      catch(error){

        console.log(
          "MA7ALAK animation fallback"
        );

      }

    }

  }


  /* =========================================================
     STOP NEW STORY ANIMATION
  ========================================================= */

  function stopNewStoryAnimation(){

    if(
      storyWrapper
    ){

      storyWrapper.classList.remove(
        "story-has-new"
      );

    }


    if(
      newRingAnimation
    ){

      try{

        newRingAnimation.cancel();

      }

      catch(error){}


      newRingAnimation =
        null;

    }


    if(newRing){

      newRing.style.opacity =
        "0";

    }

  }


  /* =========================================================
     CHECK NEW STORY
  ========================================================= */

  function updateNewStoryAnimation(){

    if(!storyWrapper){

      return;

    }


    if(
      !stories.length
    ){

      stopNewStoryAnimation();

      return;

    }


    const newestStory =
      stories[0];


    let lastSeen =
      null;


    try{

      lastSeen =
        localStorage.getItem(
          STORY_SEEN_KEY
        );

    }

    catch(error){

      lastSeen =
        null;

    }


    if(!lastSeen){

      startNewStoryAnimation();

      return;

    }


    const newestTime =
      new Date(
        newestStory.created_at
      ).getTime();


    const lastSeenTime =
      new Date(
        lastSeen
      ).getTime();


    if(
      newestTime >
      lastSeenTime
    ){

      startNewStoryAnimation();

    }

    else{

      stopNewStoryAnimation();

    }

  }


  /* =========================================================
     MARK STORIES AS SEEN
  ========================================================= */

  function markStoriesAsSeen(){

    if(
      !stories.length
    ){

      return;

    }


    const newestStory =
      stories[0];


    if(
      !newestStory.created_at
    ){

      return;

    }


    try{

      localStorage.setItem(
        STORY_SEEN_KEY,
        newestStory.created_at
      );

    }

    catch(error){}


    stopNewStoryAnimation();

  }


  /* =========================================================
     CHECK OWNER
  ========================================================= */

  async function checkShopOwner(){

    try{

      const result =
        await supabaseClient.auth.getSession();


      const session =
        result &&
        result.data &&
        result.data.session;


      if(!session){

        isShopOwner =
          false;

        ownerAddButton.classList.remove(
          "visible"
        );

        return;

      }


      const user =
        session.user;


      if(!user){

        isShopOwner =
          false;

        ownerAddButton.classList.remove(
          "visible"
        );

        return;

      }


      const ownerResult =
        await supabaseClient
          .from("shop_owners")
          .select(
            "shop_slug"
          )
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          )
          .maybeSingle();


      if(
        ownerResult.error ||
        !ownerResult.data
      ){

        isShopOwner =
          false;

        ownerAddButton.classList.remove(
          "visible"
        );

        return;

      }


      isShopOwner =
        true;


      ownerAddButton.classList.add(
        "visible"
      );

    }

    catch(error){

      console.error(
        "MA7ALAK owner check:",
        error
      );

      isShopOwner =
        false;

      ownerAddButton.classList.remove(
        "visible"
      );

    }

  }


  /* =========================================================
     OPEN OWNER UPLOADER

     IMPORTANT:
     The actual uploader is handled by
     PAGE-LEVEL CUSTOM CODE.
  ========================================================= */

  function openOwnerUpload(){

    if(!isShopOwner){

      return;

    }


    try{

      window.parent.postMessage(

        {

          type:
            "MA7ALAK_OPEN_STORY_UPLOADER",

          shopSlug:
            SHOP_SLUG

        },

        "*"

      );

    }

    catch(error){

      console.error(
        "MA7ALAK uploader bridge:",
        error
      );

    }

  }


  /* =========================================================
     UPLOAD FINISHED MESSAGE
  ========================================================= */

  window.addEventListener(
    "message",
    function(event){

      if(
        !event.data ||
        event.data.type !==
        "MA7ALAK_STORY_UPLOADED"
      ){

        return;

      }


      if(
        event.data.shopSlug !==
        SHOP_SLUG
      ){

        return;

      }


      loadStories();

    }
  );


  /* =========================================================
     LOAD STORIES
  ========================================================= */

  async function loadStories(){

    try{

      const now =
        new Date().toISOString();


      const result =
        await supabaseClient
          .from("shop_stories")
          .select(
            "id,shop_slug,media_type,storage_path,expires_at,created_at"
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          )
          .gt(
            "expires_at",
            now
          )
          .order(
            "created_at",
            {
              ascending:false
            }
          );


      if(
        result.error
      ){

        console.error(
          "MA7ALAK Stories:",
          result.error
        );

        return;

      }


      stories =
        result.data || [];


      updateNewStoryAnimation();


      if(
        stories.length === 0
      ){

        storyPreview.innerHTML =
          `
            <div
              class="ma7alak-story-placeholder"
            ></div>
          `;

        return;

      }


      const story =
        stories[0];


      const url =
        storyURL(
          story.storage_path
        );


      const type =
        mediaType(
          story
        );


      storyPreview.innerHTML =
        "";


      if(
        type === "video"
      ){

        const video =
          document.createElement(
            "video"
          );


        video.src =
          url;


        video.autoplay =
          true;


        video.loop =
          true;


        video.muted =
          true;


        video.playsInline =
          true;


        video.setAttribute(
          "playsinline",
          ""
        );


        video.setAttribute(
          "webkit-playsinline",
          ""
        );


        video.preload =
          "metadata";


        storyPreview.appendChild(
          video
        );


        video.play().catch(
          function(){}
        );

      }


      else{

        const image =
          document.createElement(
            "img"
          );


        image.src =
          url;


        image.alt =
          "Story";


        storyPreview.appendChild(
          image
        );

      }

    }

    catch(error){

      console.error(
        "MA7ALAK Stories:",
        error
      );

    }

  }


  /* =========================================================
     CREATE STORY VIEWER
  ========================================================= */

  function createStoryScreen(){

    const existing =
      document.getElementById(
        "ma7alak-full-story"
      );


    if(existing){

      return existing;

    }


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      "ma7alak-full-story";


    screen.innerHTML = `

      <div
        id="ma7alak-full-story-media"
      ></div>


      <div
        id="ma7alak-story-progress-wrap"
      ></div>


      <div
        id="ma7alak-story-shop-name"
      ></div>


      <div
        id="ma7alak-story-time"
      ></div>


      <button
        id="ma7alak-story-delete-btn"
        type="button"
        aria-label="Delete story"
      >
        🗑️
      </button>


      <button
        id="ma7alak-story-like-btn"
        type="button"
        aria-label="Like story"
      >
        <span class="ma7alak-like-heart">♡</span>
      </button>


      <button
        id="ma7alak-story-tap-left"
        type="button"
        aria-label="Previous story"
      ></button>


      <button
        id="ma7alak-story-tap-right"
        type="button"
        aria-label="Next story"
      ></button>


      <button
        id="ma7alak-story-close-btn"
        type="button"
        aria-label="Close"
      >
        ×
      </button>

    `;


    document.body.appendChild(
      screen
    );

    /*
      Final safety net for mobile/fullscreen:
      if a parent or another transparent control
      receives the event first, detect the Like
      button and handle it here.
    */
    screen.addEventListener(
      "click",
      function(event){

        const target =
          event.target &&
          event.target.closest &&
          event.target.closest(
            "#ma7alak-story-like-btn"
          );

        if(!target){
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        likeCurrentStory();

      },
      true
    );


    document
      .getElementById(
        "ma7alak-story-close-btn"
      )
      .onclick =
      closeStories;


    document
      .getElementById(
        "ma7alak-story-tap-right"
      )
      .onclick =
      nextStory;


    document
      .getElementById(
        "ma7alak-story-tap-left"
      )
      .onclick =
      previousStory;


    document
      .getElementById(
        "ma7alak-story-delete-btn"
      )
      .onclick =
      deleteCurrentStory;


    const likeButton =
      document.getElementById(
        "ma7alak-story-like-btn"
      );

    if(likeButton){

      /*
        IMPORTANT:
        Use the button itself as the click target.
        The story navigation tap areas must NEVER
        be able to steal a Like press.
      */
      likeButton.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        likeCurrentStory();

        return false;

      };

      likeButton.addEventListener(
        "pointerdown",
        function(event){
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        },
        true
      );

      likeButton.addEventListener(
        "touchstart",
        function(event){
          event.stopPropagation();
        },
        {passive:true,capture:true}
      );

    }


    return screen;

  }


  /* =========================================================
     UPDATE OWNER DELETE BUTTON
  ========================================================= */

  function updateDeleteButton(){

    const deleteButton =
      document.getElementById(
        "ma7alak-story-delete-btn"
      );


    if(
      !deleteButton
    ){

      return;

    }


    if(
      isShopOwner &&
      stories.length
    ){

      deleteButton.classList.add(
        "visible"
      );

    }

    else{

      deleteButton.classList.remove(
        "visible"
      );

    }

  }


  /* =========================================================
     DELETE CURRENT STORY
  ========================================================= */

  async function deleteCurrentStory(){

    if(
      !isShopOwner ||
      isDeletingStory ||
      !stories.length
    ){

      return;

    }


    const story =
      stories[
        currentStory
      ];


    if(!story){

      return;

    }


    const confirmed =
      window.confirm(
        "حذف هالستوري؟\n\nما رح تقدر ترجعها بعد الحذف."
      );


    if(!confirmed){

      return;

    }


    try{

      isDeletingStory =
        true;


      const deleteButton =
        document.getElementById(
          "ma7alak-story-delete-btn"
        );


      if(deleteButton){

        deleteButton.disabled =
          true;

        deleteButton.textContent =
          "⏳";

      }


      clearInterval(
        timer
      );


      /*
        Stop current video immediately.
      */

      if(
        currentMedia &&
        currentMedia.tagName ===
        "VIDEO"
      ){

        try{

          currentMedia.pause();

          currentMedia.muted =
            true;

        }

        catch(error){}

      }


      /*
        Delete physical file first.
      */

      const storageResult =
        await supabaseClient
          .storage
          .from("shop-stories")
          .remove([
            story.storage_path
          ]);


      if(
        storageResult.error
      ){

        throw storageResult.error;

      }


      /*
        Delete database row.
      */

      const databaseResult =
        await supabaseClient
          .from("shop_stories")
          .delete()
          .eq(
            "id",
            story.id
          )
          .eq(
            "shop_slug",
            SHOP_SLUG
          );


      if(
        databaseResult.error
      ){

        throw databaseResult.error;

      }


      /*
        Remove locally.
      */

      stories.splice(
        currentStory,
        1
      );


      /*
        No stories left.
      */

      if(
        stories.length === 0
      ){

        closeStories();

        await loadStories();

        return;

      }


      /*
        If we deleted the last story,
        move to the new last story.
      */

      if(
        currentStory >=
        stories.length
      ){

        currentStory =
          stories.length - 1;

      }


      createProgressBars();


      showStory(
        currentStory
      );


      await loadStories();

    }

    catch(error){

      console.error(
        "MA7ALAK delete story error:",
        error
      );


      alert(
        "صار خطأ أثناء حذف الستوري. جرّب مرة ثانية."
      );

    }

    finally{

      isDeletingStory =
        false;


      const deleteButton =
        document.getElementById(
          "ma7alak-story-delete-btn"
        );


      if(deleteButton){

        deleteButton.disabled =
          false;

        deleteButton.textContent =
          "🗑️";

      }


      updateDeleteButton();

    }

  }


  /* =========================================================
     PROGRESS BARS
  ========================================================= */

  function createProgressBars(){

    const wrap =
      document.getElementById(
        "ma7alak-story-progress-wrap"
      );


    if(!wrap){

      return;

    }


    wrap.innerHTML =
      "";


    stories.forEach(
      function(){

        const segment =
          document.createElement(
            "div"
          );


        segment.className =
          "ma7alak-story-progress-segment";


        const fill =
          document.createElement(
            "div"
          );


        fill.className =
          "ma7alak-story-progress-fill";


        segment.appendChild(
          fill
        );


        wrap.appendChild(
          segment
        );

      }
    );

  }


  /* =========================================================
     UPDATE PROGRESS
  ========================================================= */

  function updateProgressBars(
    activeIndex,
    percent
  ){

    const fills =
      document.querySelectorAll(
        ".ma7alak-story-progress-fill"
      );


    fills.forEach(
      function(
        fill,
        index
      ){

        if(
          index <
          activeIndex
        ){

          fill.style.width =
            "100%";

        }

        else if(
          index ===
          activeIndex
        ){

          fill.style.width =
            Math.max(
              0,
              Math.min(
                100,
                percent
              )
            ) +
            "%";

        }

        else{

          fill.style.width =
            "0%";

        }

      }
    );

  }


  /* =========================================================
     OPEN STORIES
  ========================================================= */

  function openStories(){

    if(
      stories.length === 0
    ){

      alert(
        "ما في ستوري حالياً 📸"
      );

      return;

    }


    markStoriesAsSeen();


    const screen =
      createStoryScreen();


    currentStory =
      0;


    screen.style.position =
      "fixed";


    screen.style.left =
      "0";


    screen.style.top =
      "0";


    screen.style.width =
      "100vw";


    screen.style.height =
      "100vh";


    screen.classList.add(
      "active"
    );


    if(!storyHistoryPushed){

      try{

        window.history.pushState(
          {
            ma7alakStoryOpen:true
          },
          "",
          window.location.href
        );

        storyHistoryPushed =
          true;

      }
      catch(error){}

    }


    document.documentElement.style.overflow =
      "hidden";


    document.body.style.overflow =
      "hidden";


    createProgressBars();


    updateDeleteButton();


    enterNativeFullscreen(
      screen
    );


    showStory(
      currentStory
    );

  }


  /* =========================================================
     NATIVE FULLSCREEN
  ========================================================= */

  function enterNativeFullscreen(
    screen
  ){

    try{

      if(
        screen.requestFullscreen
      ){

        const request =
          screen.requestFullscreen();


        if(
          request &&
          typeof request.catch ===
          "function"
        ){

          request.catch(
            function(){}
          );

        }

      }

      else if(
        screen.webkitRequestFullscreen
      ){

        screen.webkitRequestFullscreen();

      }

    }

    catch(error){}

  }


  /* =========================================================
     CREATE MEDIA
  ========================================================= */

  function createMediaElement(
    story
  ){

    const type =
      mediaType(
        story
      );


    const url =
      storyURL(
        story.storage_path
      );


    let media;


    if(
      type === "video"
    ){

      media =
        document.createElement(
          "video"
        );


      media.autoplay =
        false;


      media.muted =
        true;


      media.playsInline =
        true;


      media.controls =
        false;


      media.preload =
        "auto";


      media.setAttribute(
        "playsinline",
        ""
      );


      media.setAttribute(
        "webkit-playsinline",
        ""
      );


      media.setAttribute(
        "disablepictureinpicture",
        ""
      );


      media.setAttribute(
        "controlslist",
        "nodownload noplaybackrate"
      );

    }

    else{

      media =
        document.createElement(
          "img"
        );


      media.alt =
        "Story";

    }


    media.className =
      "ma7alak-story-media-layer";


    media.src =
      url;


    media.style.opacity =
      "0";


    media.style.visibility =
      "hidden";


    return {

      media:
        media,

      type:
        type,

      url:
        url

    };

  }


  /* =========================================================
     STORY LIKE BUTTON STATE
  ========================================================= */

  function updateLikeButton(){

    const button =
      document.getElementById(
        "ma7alak-story-like-btn"
      );

    if(!button){
      return;
    }

    const story =
      stories[currentStory];

    if(!story){
      button.style.display = "none";
      return;
    }

    button.style.display = "flex";

    const liked =
      likedStoryIds.has(
        String(story.id)
      );

    const heart =
      button.querySelector(
        ".ma7alak-like-heart"
      );

    if(liked){

      button.classList.add("liked");

      if(heart){
        heart.textContent = "♥";
      }

      button.setAttribute(
        "aria-label",
        "Story liked"
      );

    }
    else{

      button.classList.remove("liked");

      if(heart){
        heart.textContent = "♡";
      }

      button.setAttribute(
        "aria-label",
        "Like story"
      );

    }

  }


  /* =========================================================
     LIKE HEARTS ANIMATION
  ========================================================= */

  function launchLikeHearts(){

    const screen =
      document.getElementById(
        "ma7alak-full-story"
      );

    if(
      !screen ||
      !screen.classList.contains("active")
    ){
      return;
    }

    let burst =
      document.getElementById(
        "ma7alak-story-heart-burst"
      );

    if(!burst){

      burst =
        document.createElement("div");

      burst.id =
        "ma7alak-story-heart-burst";

      screen.appendChild(
        burst
      );

    }

    const totalHearts = 14;

    for(
      let i = 0;
      i < totalHearts;
      i++
    ){

      const heart =
        document.createElement("span");

      heart.className =
        "ma7alak-story-floating-heart";

      heart.textContent =
        i % 4 === 0 ? "❤" : "♥";

      const x =
        Math.round(
          (Math.random() * 180) - 90
        );

      const y =
        -Math.round(
          46 + (Math.random() * 32)
        ) + "vh";

      const rotate =
        Math.round(
          (Math.random() * 50) - 25
        ) + "deg";

      const scale =
        (
          .82 +
          Math.random() * .72
        ).toFixed(2);

      const duration =
        (
          1.05 +
          Math.random() * .75
        ).toFixed(2) + "s";

      const size =
        Math.round(
          18 +
          Math.random() * 18
        );

      heart.style.setProperty(
        "--ma7alak-heart-x",
        x + "px"
      );

      heart.style.setProperty(
        "--ma7alak-heart-y",
        y
      );

      heart.style.setProperty(
        "--ma7alak-heart-rotate",
        rotate
      );

      heart.style.setProperty(
        "--ma7alak-heart-scale",
        scale
      );

      heart.style.setProperty(
        "--ma7alak-heart-duration",
        duration
      );

      heart.style.fontSize =
        size + "px";

      heart.style.animationDelay =
        (i * 32) + "ms";

      burst.appendChild(
        heart
      );

      setTimeout(
        function(){

          if(
            heart &&
            heart.parentNode
          ){

            heart.parentNode.removeChild(
              heart
            );

          }

        },
        2300
      );

    }

  }


  /* =========================================================
     LIKE CURRENT STORY
  ========================================================= */

  async function likeCurrentStory(){

    const story =
      stories[currentStory];

    if(!story || !story.id || !visitorId){
      console.warn(
        "MA7ALAK: cannot like story - missing story ID or visitor ID"
      );
      return;
    }

    const storyId =
      String(story.id);

    const button =
      document.getElementById(
        "ma7alak-story-like-btn"
      );

    /*
      Each story/video has its own ID.
      One visitor can therefore like Story 1, Story 2,
      Story 3, etc. independently.
    */
    if(likedStoryIds.has(storyId)){
      updateLikeButton();
      return;
    }

    if(button){
      button.disabled = true;
      button.style.pointerEvents = "none";
    }

    try{

      const result =
        await supabaseClient.rpc(
          "like_story",
          {
            p_story_id: story.id,
            p_visitor_id: visitorId
          }
        );

      if(result.error){
        throw result.error;
      }

      const data =
        result.data;

      console.log(
        "MA7ALAK story like result:",
        data
      );

      if(!data || data.success !== true){
        throw new Error(
          (data && data.message) ||
          "Like was not accepted by Supabase"
        );
      }

      /*
        Supabase is the source of truth.
        If this visitor already liked this exact story,
        the RPC returns already_liked=true and we still
        show the correct liked state.
      */
      likedStoryIds.add(storyId);
      saveLikedStories();

      updateLikeButton();

      launchLikeHearts();

    }
    catch(error){

      console.error(
        "MA7ALAK story like error:",
        error
      );

      alert(
        "ما قدرنا نسجّل اللايك. جرّب مرة ثانية."
      );

      /*
        Do not permanently mark the story as liked when
        Supabase rejects the request.
      */
      likedStoryIds.delete(storyId);
      saveLikedStories();

    }
    finally{

      if(button){
        button.disabled = false;
        button.style.pointerEvents = "auto";
      }

    }

  }


  /* =========================================================
     SHOW STORY
  ========================================================= */

  function showStory(
    index
  ){

    if(
      !stories.length
    ){

      return;

    }


    clearInterval(
      timer
    );


    if(
      index < 0
    ){

      index =
        stories.length - 1;

    }


    if(
      index >=
      stories.length
    ){

      index =
        0;

    }


    currentStory =
      index;


    const story =
      stories[
        currentStory
      ];


    const screen =
      document.getElementById(
        "ma7alak-full-story"
      );


    const container =
      document.getElementById(
        "ma7alak-full-story-media"
      );


    if(
      !screen ||
      !container
    ){

      return;

    }


    /*
      Update timestamp immediately.
    */

    updateStoryTime();


    /*
      Make sure owner controls match
      current authentication state.
    */

    updateDeleteButton();
    updateLikeButton();


    const thisTransition =
      ++transitionToken;


    updateProgressBars(
      currentStory,
      0
    );


    if(
      currentMedia &&
      currentMedia.tagName ===
      "VIDEO"
    ){

      try{

        currentMedia.pause();

        currentMedia.muted =
          true;

      }

      catch(error){}

    }


    const result =
      createMediaElement(
        story
      );


    const media =
      result.media;


    const type =
      result.type;


    container.appendChild(
      media
    );


    function activateMedia(){

      if(
        thisTransition !==
        transitionToken
      ){

        if(
          media.tagName ===
          "VIDEO"
        ){

          try{

            media.pause();

            media.muted =
              true;

          }

          catch(error){}

        }


        if(
          media.parentNode
        ){

          media.parentNode.removeChild(
            media
          );

        }


        return;

      }


      const allVideos =
        container.querySelectorAll(
          "video"
        );


      allVideos.forEach(
        function(video){

          if(
            video !==
            media
          ){

            try{

              video.pause();

              video.muted =
                true;

            }

            catch(error){}

          }

        }
      );


      media.style.visibility =
        "visible";


      if(
        type === "video"
      ){

        media.muted =
          false;


        const playPromise =
          media.play();


        if(
          playPromise &&
          typeof playPromise.catch ===
          "function"
        ){

          playPromise.catch(
            function(){

              const activeScreen =
                document.getElementById(
                  "ma7alak-full-story"
                );

              if(
                thisTransition !== transitionToken ||
                !activeScreen ||
                !activeScreen.classList.contains("active") ||
                !media.isConnected
              ){

                try{

                  media.pause();

                  media.muted =
                    true;

                  media.volume =
                    0;

                }
                catch(error){}

                return;

              }


              media.muted =
                true;


              const mutedPlay =
                media.play();

              if(
                mutedPlay &&
                typeof mutedPlay.catch ===
                "function"
              ){

                mutedPlay.catch(
                  function(){}
                );

              }

            }
          );

        }

      }


      requestAnimationFrame(
        function(){

          if(
            thisTransition !==
            transitionToken
          ){

            return;

          }


          media.style.opacity =
            "1";


          media.classList.add(
            "active"
          );


          const oldMedia =
            currentMedia;


          currentMedia =
            media;


          if(
            oldMedia &&
            oldMedia !==
            media
          ){

            oldMedia.style.opacity =
              "0";


            oldMedia.classList.remove(
              "active"
            );


            setTimeout(
              function(){

                if(
                  oldMedia &&
                  oldMedia !==
                  currentMedia
                ){

                  if(
                    oldMedia.tagName ===
                    "VIDEO"
                  ){

                    try{

                      oldMedia.pause();

                      oldMedia.muted =
                        true;

                      oldMedia.removeAttribute(
                        "src"
                      );

                      oldMedia.load();

                    }

                    catch(error){}

                  }


                  if(
                    oldMedia.parentNode
                  ){

                    oldMedia.parentNode.removeChild(
                      oldMedia
                    );

                  }

                }

              },
              360
            );

          }

        }
      );

    }


    if(
      type === "video"
    ){

      let activated =
        false;


      function activateVideoOnce(){

        if(activated){

          return;

        }


        activated =
          true;


        activateMedia();

      }


      media.addEventListener(
        "loadeddata",
        activateVideoOnce,
        {
          once:true
        }
      );


      media.addEventListener(
        "canplay",
        activateVideoOnce,
        {
          once:true
        }
      );


      if(
        media.readyState >=
        2
      ){

        activateVideoOnce();

      }


      media.addEventListener(
        "timeupdate",
        function(){

          if(
            media.duration &&
            isFinite(
              media.duration
            )
          ){

            updateProgressBars(
              currentStory,
              (
                media.currentTime /
                media.duration
              ) *
              100
            );

          }

        }
      );


      media.addEventListener(
        "ended",
        function(){

          if(
            thisTransition ===
            transitionToken &&
            currentMedia ===
            media
          ){

            nextStory();

          }

        }
      );

    }


    else{

      let activated =
        false;


      function activateImageOnce(){

        if(activated){

          return;

        }


        activated =
          true;


        activateMedia();


        const started =
          Date.now();


        timer =
          setInterval(
            function(){

              if(
                thisTransition !==
                transitionToken
              ){

                clearInterval(
                  timer
                );

                return;

              }


              const elapsed =
                Date.now() -
                started;


              const percent =
                Math.min(
                  100,
                  (
                    elapsed /
                    5000
                  ) *
                  100
                );


              updateProgressBars(
                currentStory,
                percent
              );


              if(
                percent >=
                100
              ){

                clearInterval(
                  timer
                );


                nextStory();

              }

            },
            50
          );

      }


      media.addEventListener(
        "load",
        activateImageOnce,
        {
          once:true
        }
      );


      if(
        media.complete
      ){

        activateImageOnce();

      }

    }

  }


  /* =========================================================
     NEXT
  ========================================================= */

  function nextStory(){

    if(
      !stories.length ||
      isDeletingStory
    ){

      return;

    }


    currentStory++;


    if(
      currentStory >=
      stories.length
    ){

      currentStory =
        0;

    }


    showStory(
      currentStory
    );

  }


  /* =========================================================
     PREVIOUS
  ========================================================= */

  function previousStory(){

    if(
      !stories.length ||
      isDeletingStory
    ){

      return;

    }


    currentStory--;


    if(
      currentStory < 0
    ){

      currentStory =
        stories.length - 1;

    }


    showStory(
      currentStory
    );

  }


  /* =========================================================
     STOP STORY PLAYBACK
  ========================================================= */

  function stopStoryPlayback(
    unloadMedia
  ){

    clearInterval(
      timer
    );

    transitionToken++;


    if(
      currentMedia &&
      currentMedia.tagName ===
      "VIDEO"
    ){

      try{

        currentMedia.pause();

        currentMedia.muted =
          true;

        currentMedia.volume =
          0;

        if(
          unloadMedia !==
          false
        ){

          currentMedia.removeAttribute(
            "src"
          );

          currentMedia.load();

        }

      }
      catch(error){}

    }


    const screen =
      document.getElementById(
        "ma7alak-full-story"
      );


    if(screen){

      const videos =
        screen.querySelectorAll(
          "video"
        );


      videos.forEach(
        function(video){

          try{

            video.pause();

            video.muted =
              true;

            video.volume =
              0;

            if(
              unloadMedia !==
              false
            ){

              video.removeAttribute(
                "src"
              );

              video.load();

            }

          }
          catch(error){}

        }
      );

    }


    currentMedia =
      null;

  }


  /* =========================================================
     CLOSE STORIES
  ========================================================= */

  function closeStories(fromHistory){

    const isHistoryClose =
      fromHistory === true;


    const screen =
      document.getElementById(
        "ma7alak-full-story"
      );


    stopStoryPlayback(
      true
    );


    if(
      !isHistoryClose &&
      storyHistoryPushed
    ){

      storyHistoryPushed =
        false;

      try{

        if(
          window.history.state &&
          window.history.state.ma7alakStoryOpen ===
          true
        ){

          window.history.back();

        }

      }
      catch(error){}

    }

    else if(isHistoryClose){

      storyHistoryPushed =
        false;

    }


    if(!screen){

      return;

    }


    try{

      if(
        document.fullscreenElement
      ){

        const exit =
          document.exitFullscreen();

        if(
          exit &&
          typeof exit.catch ===
          "function"
        ){

          exit.catch(
            function(){}
          );

        }

      }

      else if(
        document.webkitFullscreenElement &&
        document.webkitExitFullscreen
      ){

        document.webkitExitFullscreen();

      }

    }
    catch(error){}


    screen.classList.remove(
      "active"
    );


    document.documentElement.style.overflow =
      "";

    document.body.style.overflow =
      "";


    setTimeout(
      function(){

        if(
          !screen.classList.contains(
            "active"
          )
        ){

          const container =
            document.getElementById(
              "ma7alak-full-story-media"
            );

          if(container){

            container.innerHTML =
              "";

          }

          const burst =
            document.getElementById(
              "ma7alak-story-heart-burst"
            );

          if(burst){

            burst.innerHTML =
              "";

          }

        }

      },
      350
    );

  }


  /* =========================================================
     FULLSCREEN CHANGE
  ========================================================= */

  function fullscreenChanged(){

    const screen =
      document.getElementById(
        "ma7alak-full-story"
      );


    if(!screen){

      return;

    }


    if(
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      screen.classList.contains(
        "active"
      )
    ){

      /*
        Android/browser Back can exit native fullscreen
        without pressing the Story X. Use the exact same
        close path so playback is destroyed immediately.
      */
      closeStories(
        false
      );

    }

  }


  document.addEventListener(
    "fullscreenchange",
    fullscreenChanged
  );


  document.addEventListener(
    "webkitfullscreenchange",
    fullscreenChanged
  );


  /* =========================================================
     STOP STORY AUDIO WHEN LEAVING THE PAGE
  ========================================================= */

  function stopStoryOnPageExit(){

    stopStoryPlayback(
      true
    );

  }


  window.addEventListener(
    "pagehide",
    stopStoryOnPageExit
  );


  window.addEventListener(
    "beforeunload",
    stopStoryOnPageExit
  );


  window.addEventListener(
    "popstate",
    function(){

      const screen =
        document.getElementById(
          "ma7alak-full-story"
        );

      storyHistoryPushed =
        false;

      if(
        screen &&
        screen.classList.contains(
          "active"
        )
      ){

        closeStories(
          true
        );

      }

      else{

        stopStoryPlayback(
          true
        );

      }

    }
  );


  document.addEventListener(
    "visibilitychange",
    function(){

      if(
        document.visibilityState !==
        "hidden"
      ){

        return;

      }


      const screen =
        document.getElementById(
          "ma7alak-full-story"
        );


      if(
        screen &&
        screen.classList.contains(
          "active"
        )
      ){

        stopStoryPlayback(
          true
        );

      }

    }
  );


  /*
    Hostinger can render custom code inside an iframe.
    If the parent is same-origin, also stop playback when
    that parent page navigates or changes history.
  */
  try{

    if(
      window.parent &&
      window.parent !==
      window
    ){

      window.parent.addEventListener(
        "pagehide",
        stopStoryOnPageExit
      );

      window.parent.addEventListener(
        "beforeunload",
        stopStoryOnPageExit
      );

      window.parent.addEventListener(
        "popstate",
        function(){

          const screen =
            document.getElementById(
              "ma7alak-full-story"
            );

          if(
            screen &&
            screen.classList.contains(
              "active"
            )
          ){

            closeStories(
              true
            );

          }

          else{

            stopStoryPlayback(
              true
            );

          }

        }
      );

    }

  }
  catch(error){}


  /* =========================================================
     STORY BUTTON
  ========================================================= */

  storyButton.addEventListener(
    "click",
    openStories
  );


  /* =========================================================
     OWNER PLUS BUTTON
  ========================================================= */

  ownerAddButton.addEventListener(
    "click",
    function(event){

      event.preventDefault();

      event.stopPropagation();

      openOwnerUpload();

    }
  );


  /* =========================================================
     AUTH CHANGE
  ========================================================= */

  supabaseClient.auth.onAuthStateChange(
    function(){

      setTimeout(
        checkShopOwner,
        100
      );

    }
  );


  /* =========================================================
     KEYBOARD
  ========================================================= */

  document.addEventListener(
    "keydown",
    function(event){

      const screen =
        document.getElementById(
          "ma7alak-full-story"
        );


      if(
        !screen ||
        !screen.classList.contains(
          "active"
        )
      ){

        return;

      }


      if(
        event.key ===
        "Escape"
      ){

        closeStories();

      }

      else if(
        event.key ===
        "ArrowRight"
      ){

        nextStory();

      }

      else if(
        event.key ===
        "ArrowLeft"
      ){

        previousStory();

      }

      else if(
        event.key ===
        "Delete" &&
        isShopOwner
      ){

        deleteCurrentStory();

      }

    }
  );


  /* =========================================================
     UPDATE TIME WHILE STORY IS OPEN
     
     Keeps:
       الآن
       1 د
       2 د
       1 س
       etc.
     accurate.
  ========================================================= */

  setInterval(
    function(){

      const screen =
        document.getElementById(
          "ma7alak-full-story"
        );


      if(
        screen &&
        screen.classList.contains(
          "active"
        )
      ){

        updateStoryTime();

      }

    },
    30000
  );


  /* =========================================================
     INITIALIZE
  ========================================================= */

  createStoryScreen();

  checkShopOwner();

  loadStories();


  /* =========================================================
     CHECK FOR NEW STORIES
     EVERY 10 SECONDS
  ========================================================= */

  setInterval(
    function(){

      loadStories();

    },
    10000
  );


})();
  }

  function ensureSupabaseAndStart(){
    injectStoryUI();

    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){
      startMa7alakStories();
      return;
    }

    const existing = Array.from(
      document.querySelectorAll("script")
    ).find(function(script){
      return String(script.src || "").includes(
        "@supabase/supabase-js@2"
      );
    });

    if(existing){
      existing.addEventListener(
        "load",
        startMa7alakStories,
        {once:true}
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.onload = startMa7alakStories;
    script.onerror = function(){
      console.error("MA7ALAK: Supabase library failed to load.");
    };
    document.head.appendChild(script);
  }

  if(document.readyState === "loading"){
    document.addEventListener(
      "DOMContentLoaded",
      ensureSupabaseAndStart,
      {once:true}
    );
  } else {
    ensureSupabaseAndStart();
  }

})();

/* =========================================================
   WHAT CHANGED
   =========================================================
   1. Fixed Story video/audio continuing after phone/browser Back.
   2. Story open now creates a temporary same-page history entry so Back closes the Story first.
   3. Back/popstate, fullscreen exit, pagehide, beforeunload, visibility change, and same-origin parent navigation now destroy Story playback.
   4. Story playback cleanup now directly pauses, mutes, sets volume to 0, unloads currentMedia, and unloads every Story video.
   5. Fixed the rejected play() fallback race so a video cannot restart after the Story has already closed.
   6. Moved Masaya Cafe/shop name and Story time slightly higher.
   7. Moved the X/close and owner delete buttons slightly higher.
   8. Moved the Like heart lower to the bottom area.
   9. After a successful Like, floating heart icons now burst upward across the Story like Facebook reactions.
   10. Kept the separate owner upload-panel bridge, Story likes RPC, owner controls, navigation, Supabase data, and 24-hour Story behavior unchanged.
   11. No Story viewer-count/viewer-number system was added.
   12. Converted this exact Story source to GitHub-ready JavaScript: CSS and Story markup are injected by this file and Supabase is loaded automatically if needed.
   ========================================================= */
