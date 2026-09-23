(function(){

"use strict";

if(window.self!==window.top)return;
if(window.__MA7ALAK_NOTIFICATIONS_ENGINE__)return;
window.__MA7ALAK_NOTIFICATIONS_ENGINE__=true;


/* =========================================================
   SUPABASE
========================================================= */

const MA7ALAK_SUPABASE_URL =
  "https://wdtaiuwtqdepzdamgsrs.supabase.co";

const MA7ALAK_SUPABASE_KEY =
  "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

const MA7ALAK_NOTIFICATIONS_SCRIPT_SRC =
  document.currentScript?.src || "";

let ma7alakSupabase = null;

let ma7alakSupabaseLoading = null;

let ma7alakNotificationStoryViewerPromise = null;


/* =========================================================
   SHOP NAMES
========================================================= */

const MA7ALAK_SHOP_NAMES = {

  "doze-3ale":
    "Doze 3ale",

  "masaya-cafe":
    "Masaya Cafe"

};


/* =========================================================
   SHOP PROFILES
========================================================= */

const MA7ALAK_SHOP_PROFILES = {};


async function loadShopProfiles(){

  try{

    const client =
      await loadMa7alakSupabase();


    const {
      data,
      error
    } = await client

      .from(
        "shop_profiles"
      )

      .select(
        "shop_slug,shop_name,profile_image_url"
      );


    if(error){

      console.error(
        "ShoufHon shop profiles:",
        error
      );

      return;

    }


    Object.keys(
      MA7ALAK_SHOP_PROFILES
    ).forEach(
      function(key){

        delete
          MA7ALAK_SHOP_PROFILES[key];

      }
    );


    (data || []).forEach(
      function(profile){

        if(
          !profile ||
          !profile.shop_slug
        ){

          return;

        }


        MA7ALAK_SHOP_PROFILES[
          profile.shop_slug
        ] = {

          shop_name:
            profile.shop_name || "",

          profile_image_url:
            profile.profile_image_url || ""

        };

      }
    );


    renderNotifications();

  }
  catch(error){

    console.error(
      "ShoufHon shop profile loading failed:",
      error
    );

  }

}


/* =========================================================
   GET SHOP PROFILE IMAGE
========================================================= */

function getShopProfileImage(
  shopSlug
){

  if(!shopSlug){

    return "";

  }


  const profile =
    MA7ALAK_SHOP_PROFILES[
      shopSlug
    ];


  if(!profile){

    return "";

  }


  return (
    profile.profile_image_url || ""
  );

}


/* =========================================================
   STATE
========================================================= */

let notifications = [];

let notificationsOpen = false;

let visitorId = null;

let realtimeChannel = null;

let refreshTimer = null;


/*
   Controls whether the panel shows:

   FALSE = latest 6 notifications
   TRUE  = all notifications
*/

let showAllNotifications = false;


/*
   IMPORTANT:

   This Set controls the visual highlight.

   A notification stays highlighted until
   THAT EXACT notification is clicked.

   Opening the bell does NOT clear this Set.
*/

let highlightedNotifications =
  new Set();


/*
   Badge is completely separate from highlight.

   This allows:

   badge = 0

   while notifications are still highlighted.
*/

let notificationBadgeCount = 0;


/* =========================================================
   FACEBOOK-STYLE BADGE ACKNOWLEDGEMENT
   ---------------------------------------------------------
   - Opening the bell clears the RED NUMBER immediately.
   - Rows stay highlighted until THAT row is clicked.
   - A newer Story/Reel/Live update creates a new signature, so the badge
     comes back for the new activity.
========================================================= */

const MA7ALAK_BADGE_ACK_KEY =
  "ma7alak_notification_badge_ack_v1";

let lastShopProfilesLoadAt = 0;


function getNotificationSignature(notification){

  if(!notification){
    return "";
  }

  return [
    String(notification.type || "story"),
    String(notification.shop_slug || ""),
    String(notification.id || "")
  ].join(":");

}


function getBadgeAcknowledgedSet(){

  try{

    const raw =
      localStorage.getItem(
        MA7ALAK_BADGE_ACK_KEY
      );

    const parsed =
      raw ? JSON.parse(raw) : [];

    return new Set(
      Array.isArray(parsed)
        ? parsed.map(function(value){
            return String(value || "");
          }).filter(Boolean)
        : []
    );

  }
  catch(error){

    return new Set();

  }

}


function saveBadgeAcknowledgedSet(set){

  try{

    const values =
      Array.from(set || [])
        .filter(Boolean)
        .slice(-500);

    localStorage.setItem(
      MA7ALAK_BADGE_ACK_KEY,
      JSON.stringify(values)
    );

  }
  catch(error){}

}


function acknowledgeCurrentBadgeNotifications(){

  const acknowledged =
    getBadgeAcknowledgedSet();

  notifications.forEach(
    function(notification){

      const signature =
        getNotificationSignature(
          notification
        );

      if(signature){
        acknowledged.add(signature);
      }

    }
  );

  saveBadgeAcknowledgedSet(
    acknowledged
  );

  notificationBadgeCount = 0;

  updateNotificationBadge();

}


function calculateBadgeCount(){

  if(notificationsOpen){
    return 0;
  }

  const acknowledged =
    getBadgeAcknowledgedSet();

  return notifications.filter(
    function(notification){

      const signature =
        getNotificationSignature(
          notification
        );

      return (
        !notification.seen &&
        signature &&
        !acknowledged.has(signature)
      );

    }
  ).length;

}


/* =========================================================
   VISITOR ID
========================================================= */

function getVisitorId(){

  let id =
    localStorage.getItem(
      "ma7alak_visitor_id"
    );


  if(!id){

    if(
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
    ){

      id =
        window.crypto.randomUUID();

    }
    else{

      id =
        "visitor_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .substring(2);

    }


    localStorage.setItem(
      "ma7alak_visitor_id",
      id
    );

  }


  return id;

}


visitorId =
  getVisitorId();


/* =========================================================
   LOAD SUPABASE
========================================================= */

function loadMa7alakSupabase(){

  const sharedClient =
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
    window.Ma7alakSupabase?.client ||
    window.Ma7alakSupabaseBootstrap?.client ||
    window.Ma7alakAccount?.client ||
    null;

  if(sharedClient){
    ma7alakSupabase = sharedClient;
    return Promise.resolve(ma7alakSupabase);
  }

  if(
    window.supabase &&
    typeof window.supabase.createClient ===
      "function"
  ){

    if(!ma7alakSupabase){

      ma7alakSupabase =
        window.supabase.createClient(
          MA7ALAK_SUPABASE_URL,
          MA7ALAK_SUPABASE_KEY
        );

    }


    return Promise.resolve(
      ma7alakSupabase
    );

  }


  if(ma7alakSupabaseLoading){

    return ma7alakSupabaseLoading;

  }


  ma7alakSupabaseLoading =
    new Promise(
      function(resolve,reject){

        const script =
          document.createElement("script");


        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


        script.async =
          true;


        script.onload =
          function(){

            try{

              ma7alakSupabase =
                window.supabase.createClient(
                  MA7ALAK_SUPABASE_URL,
                  MA7ALAK_SUPABASE_KEY
                );


              resolve(
                ma7alakSupabase
              );

            }
            catch(error){

              reject(error);

            }

          };


        script.onerror =
          function(){

            reject(
              new Error(
                "SUPABASE_LOAD_FAILED"
              )
            );

          };


        document.head.appendChild(
          script
        );

      }
    );


  return ma7alakSupabaseLoading;

}


/* =========================================================
   CSS
========================================================= */

function injectNotificationCSS(){

  if(
    document.getElementById(
      "ma7alak-global-notifications-style"
    )
  ){

    return;

  }


  const style =
    document.createElement("style");


  style.id =
    "ma7alak-global-notifications-style";


  style.textContent = `


/* =========================================================
   NOTIFICATION BELL
========================================================= */

#ma7alak-notification-wrapper{

  position:fixed;

  top:
    max(
      18px,
      env(safe-area-inset-top)
    );

  right:18px;

  z-index:2147483646;

  font-family:
    Arial,
    "Segoe UI",
    sans-serif;

}


#ma7alak-notification-bell{

  position:relative;

  width:48px;

  height:48px;

  display:flex;

  align-items:center;

  justify-content:center;

  border-radius:50%;

  border:
    1px solid
    rgba(217,164,65,.28);

  background:
    rgba(18,18,18,.90);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);

  color:#fff;

  cursor:pointer;

  box-shadow:
    0 8px 30px
    rgba(0,0,0,.35);

  transition:
    transform .18s ease,
    border-color .18s ease,
    background .18s ease;

  -webkit-tap-highlight-color:
    transparent;

}


#ma7alak-notification-bell:hover{

  transform:
    translateY(-2px);

  border-color:
    rgba(217,164,65,.65);

  background:
    rgba(28,28,28,.96);

}


#ma7alak-notification-bell:active{

  transform:
    scale(.92);

}


#ma7alak-notification-bell-icon{

  width:23px;

  height:23px;

  display:block;

}


#ma7alak-notification-bell.shake{

  animation:
    ma7alakBellShake
    .9s
    ease-in-out
    infinite;

}


@keyframes ma7alakBellShake{

  0%,
  100%{

    transform:
      rotate(0deg);

  }

  15%{

    transform:
      rotate(12deg);

  }

  30%{

    transform:
      rotate(-12deg);

  }

  45%{

    transform:
      rotate(8deg);

  }

  60%{

    transform:
      rotate(-8deg);

  }

  75%{

    transform:
      rotate(4deg);

  }

}


/* =========================================================
   BADGE
========================================================= */

#ma7alak-notification-badge{

  position:absolute;

  top:-4px;

  right:-4px;

  min-width:19px;

  height:19px;

  padding:
    0 5px;

  display:none;

  align-items:center;

  justify-content:center;

  box-sizing:border-box;

  border-radius:20px;

  background:
    #e53935;

  color:#fff;

  border:
    2px solid
    #111;

  font-size:10px;

  line-height:1;

  font-weight:900;

  box-shadow:
    0 3px 12px
    rgba(229,57,53,.35);

}


#ma7alak-notification-badge.visible{

  display:flex;

}


/* =========================================================
   PANEL
========================================================= */

#ma7alak-notification-panel{

  position:fixed;

  top:
    calc(
      max(
        18px,
        env(safe-area-inset-top)
      ) + 58px
    );

  right:18px;

  width:
    min(
      380px,
      calc(100vw - 28px)
    );

  max-height:
    min(
      455px,
      calc(100dvh - 92px)
    );

  display:none;

  flex-direction:column;

  overflow:hidden;

  border:
    1px solid
    rgba(217,164,65,.22);

  border-radius:22px;

  background:
    rgba(13,13,13,.97);

  backdrop-filter:
    blur(22px);

  -webkit-backdrop-filter:
    blur(22px);

  box-shadow:
    0 25px 80px
    rgba(0,0,0,.62);

  z-index:2147483645;

}


#ma7alak-notification-panel.open{

  display:flex;

  animation:
    ma7alakNotificationPanelIn
    .22s
    cubic-bezier(.2,.8,.2,1);

}


@keyframes ma7alakNotificationPanelIn{

  from{

    opacity:0;

    transform:
      translateY(-8px)
      scale(.97);

  }

  to{

    opacity:1;

    transform:
      translateY(0)
      scale(1);

  }

}


/* =========================================================
   HEADER
========================================================= */

#ma7alak-notification-header{

  flex-shrink:0;

  display:flex;

  align-items:center;

  justify-content:space-between;

  padding:
    18px
    18px
    14px;

  border-bottom:
    1px solid
    rgba(255,255,255,.07);

}


#ma7alak-notification-title{

  margin:0;

  padding:0;

  color:#fff;

  font-size:19px;

  line-height:1.2;

  font-weight:900;

  letter-spacing:-.3px;

}


#ma7alak-notification-close{

  width:32px;

  height:32px;

  display:flex;

  align-items:center;

  justify-content:center;

  border:0;

  border-radius:50%;

  background:
    rgba(255,255,255,.07);

  color:
    rgba(255,255,255,.75);

  font-size:19px;

  line-height:1;

  cursor:pointer;

  transition:
    background .18s ease,
    transform .18s ease;

}


#ma7alak-notification-close:hover{

  background:
    rgba(255,255,255,.12);

}


#ma7alak-notification-close:active{

  transform:
    scale(.88);

}


/* =========================================================
   LIST

   IMPORTANT MOBILE FIX:
   flex:1 + min-height:0 allows the
   notification list to actually scroll
   inside the fixed panel.
========================================================= */

#ma7alak-notification-list{

  flex:1;

  min-height:0;

  overflow-y:auto;

  overflow-x:hidden;

  overscroll-behavior:contain;

  -webkit-overflow-scrolling:touch;

  touch-action:pan-y;

  padding:7px;

  max-height:
    min(
      370px,
      calc(100dvh - 170px)
    );

  scrollbar-width:thin;
  scrollbar-color:rgba(217,164,65,.28) transparent;

}


#ma7alak-notification-list::-webkit-scrollbar{

  width:5px;

}


#ma7alak-notification-list::-webkit-scrollbar-track{

  background:transparent;

}


#ma7alak-notification-list::-webkit-scrollbar-thumb{

  background:
    rgba(255,255,255,.12);

  border-radius:20px;

}


/* =========================================================
   NOTIFICATION
========================================================= */

.ma7alak-notification-item{

  position:relative;

  display:flex;

  align-items:center;

  gap:12px;

  width:100%;

  box-sizing:border-box;

  padding:12px;

  margin:2px 0;

  border:0;

  border-radius:15px;

  background:
    transparent;

  color:#fff;

  text-align:left;

  cursor:pointer;

  transition:
    background .18s ease,
    transform .18s ease;

}


.ma7alak-notification-item:hover{

  background:
    rgba(255,255,255,.055);

}


.ma7alak-notification-item:active{

  transform:
    scale(.985);

}


/* =========================================================
   HIGHLIGHT

   ONLY THE SPECIFIC NOTIFICATION
   THAT HAS NOT BEEN CLICKED.
========================================================= */

.ma7alak-notification-item.highlighted{

  background:
    rgba(217,164,65,.115);

}


.ma7alak-notification-item.highlighted:hover{

  background:
    rgba(217,164,65,.17);

}


/* =========================================================
   SHOP PROFILE IMAGE
========================================================= */

.ma7alak-notification-icon{

  position:relative;

  flex-shrink:0;

  width:46px;

  height:46px;

  display:flex;

  align-items:center;

  justify-content:center;

  overflow:hidden;

  border-radius:50%;

  background:
    linear-gradient(
      145deg,
      rgba(217,164,65,.23),
      rgba(217,164,65,.07)
    );

  border:
    1px solid
    rgba(217,164,65,.28);

  font-size:19px;

}


.ma7alak-notification-icon img{

  width:100%;

  height:100%;

  display:block;

  object-fit:cover;

  border-radius:50%;

}


.ma7alak-notification-item.highlighted
.ma7alak-notification-icon{

  border-color:
    rgba(217,164,65,.70);

  box-shadow:
    0 0 0 3px
    rgba(217,164,65,.07);

}


/* =========================================================
   TEXT
========================================================= */

.ma7alak-notification-content{

  min-width:0;

  flex:1;

}


.ma7alak-notification-message{

  margin:0;

  padding:0;

  color:
    rgba(255,255,255,.92);

  font-size:13px;

  line-height:1.45;

  font-weight:600;

}


.ma7alak-notification-message strong{

  color:#fff;

  font-weight:900;

}


.ma7alak-notification-time{

  margin-top:5px;

  color:
    rgba(255,255,255,.40);

  font-size:11px;

  line-height:1;

  font-weight:500;

}


/* =========================================================
   HIGHLIGHT DOT
========================================================= */

.ma7alak-notification-unread-dot{

  flex-shrink:0;

  width:8px;

  height:8px;

  border-radius:50%;

  background:
    #d9a441;

  box-shadow:
    0 0 0 3px
    rgba(217,164,65,.09);

}


/*
   LIVE notifications use a larger green activity dot.
   Explicit WebKit keyframes keep the pulse visible on iOS/Safari as well
   as Android and desktop browsers.
*/
.ma7alak-notification-item[data-notification-type="live"]
.ma7alak-notification-unread-dot{

  width:11px;

  height:11px;

  background:#39d978;

  box-shadow:
    0 0 0 3px rgba(57,217,120,.12),
    0 0 12px rgba(57,217,120,.56);

  animation:
    ma7alakLiveNotificationDotPulse
    1.25s
    ease-in-out
    infinite;

  -webkit-animation:
    ma7alakLiveNotificationDotPulse
    1.25s
    ease-in-out
    infinite;

  transform-origin:center;
  -webkit-transform-origin:center;

  animation-play-state:running;
  -webkit-animation-play-state:running;

  will-change:transform,box-shadow,opacity;
  -webkit-backface-visibility:hidden;
  backface-visibility:hidden;
}


@keyframes ma7alakLiveNotificationDotPulse{

  0%,100%{
    transform:scale(.88);
    opacity:.78;
    box-shadow:
      0 0 0 2px rgba(57,217,120,.10),
      0 0 8px rgba(57,217,120,.42);
  }

  50%{
    transform:scale(1.20);
    opacity:1;
    box-shadow:
      0 0 0 6px rgba(57,217,120,.10),
      0 0 18px rgba(57,217,120,.82);
  }

}


@-webkit-keyframes ma7alakLiveNotificationDotPulse{

  0%,100%{
    -webkit-transform:scale(.88);
    opacity:.78;
    box-shadow:
      0 0 0 2px rgba(57,217,120,.10),
      0 0 8px rgba(57,217,120,.42);
  }

  50%{
    -webkit-transform:scale(1.20);
    opacity:1;
    box-shadow:
      0 0 0 6px rgba(57,217,120,.10),
      0 0 18px rgba(57,217,120,.82);
  }

}


.ma7alak-notification-item:not(.highlighted)
.ma7alak-notification-unread-dot{

  display:none;

}


/* =========================================================
   SEE PREVIOUS NOTIFICATIONS
========================================================= */

.ma7alak-see-previous{

  width:100%;

  box-sizing:border-box;

  margin:6px 0 2px;

  padding:12px 10px;

  border:0;

  border-radius:13px;

  background:
    rgba(255,255,255,.055);

  color:
    rgba(255,255,255,.78);

  font-family:
    Arial,
    "Segoe UI",
    sans-serif;

  font-size:12px;

  font-weight:800;

  text-align:center;

  cursor:pointer;

  transition:
    background .18s ease,
    transform .18s ease;

}


.ma7alak-see-previous:hover{

  background:
    rgba(217,164,65,.12);

  color:#fff;

}


.ma7alak-see-previous:active{

  transform:
    scale(.985);

}


/* =========================================================
   EMPTY
========================================================= */

#ma7alak-notification-empty{

  padding:
    42px 20px;

  text-align:center;

}


.ma7alak-notification-empty-icon{

  font-size:32px;

  margin-bottom:10px;

  opacity:.75;

}


.ma7alak-notification-empty-title{

  color:
    rgba(255,255,255,.82);

  font-size:14px;

  font-weight:800;

}


.ma7alak-notification-empty-text{

  margin-top:6px;

  color:
    rgba(255,255,255,.35);

  font-size:11px;

}


/* =========================================================
   MOBILE
========================================================= */

@media(max-width:600px){

  #ma7alak-notification-wrapper{

    top:
      max(
        12px,
        env(safe-area-inset-top)
      );

    right:12px;

  }


  #ma7alak-notification-bell{

    width:46px;

    height:46px;

  }


  #ma7alak-notification-panel{

    top:
      calc(
        max(
          12px,
          env(safe-area-inset-top)
        ) + 55px
      );

    right:10px;

    width:
      calc(100vw - 20px);

    height:
      min(
        620px,
        calc(100vh - 80px)
      );

    max-height:
      calc(100vh - 80px);

    border-radius:20px;

  }


  #ma7alak-notification-title{

    font-size:18px;

  }


  .ma7alak-notification-item{

    padding:11px;

  }

}


  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   CREATE UI
========================================================= */

function createNotificationUI(){

  if(
    document.getElementById(
      "ma7alak-notification-wrapper"
    )
  ){

    return;

  }


  injectNotificationCSS();


  /* -------------------------------------------------------
     WRAPPER
  ------------------------------------------------------- */

  const wrapper =
    document.createElement("div");


  wrapper.id =
    "ma7alak-notification-wrapper";


  /* -------------------------------------------------------
     BELL
  ------------------------------------------------------- */

  const bell =
    document.createElement("button");


  bell.id =
    "ma7alak-notification-bell";


  bell.type =
    "button";


  bell.setAttribute(
    "aria-label",
    "Notifications"
  );


  bell.innerHTML = `

    <svg
      id="ma7alak-notification-bell-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <path
        d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 14 3.5 16 3.5 16H20.5C20.5 16 18 14 18 8Z"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M10 20C10.4 21.2 11.1 22 12 22C12.9 22 13.6 21.2 14 20"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />

    </svg>


    <span
      id="ma7alak-notification-badge"
    ></span>

  `;


  wrapper.appendChild(
    bell
  );


  document.body.appendChild(
    wrapper
  );


  /* -------------------------------------------------------
     PANEL
  ------------------------------------------------------- */

  const panel =
    document.createElement("div");


  panel.id =
    "ma7alak-notification-panel";


  panel.innerHTML = `

    <div id="ma7alak-notification-header">

      <h2 id="ma7alak-notification-title">
        Notifications
      </h2>


      <button
        id="ma7alak-notification-close"
        type="button"
        aria-label="Close"
      >
        ×
      </button>

    </div>


    <div
      id="ma7alak-notification-list"
    ></div>

  `;


  document.body.appendChild(
    panel
  );


  /* -------------------------------------------------------
     BELL CLICK
  ------------------------------------------------------- */

  bell.addEventListener(
    "click",
    async function(event){

      event.stopPropagation();


      if(
        notificationsOpen
      ){

        closeNotifications();

        return;

      }


      await openNotifications();

    }
  );


  /* -------------------------------------------------------
     CLOSE BUTTON
  ------------------------------------------------------- */

  document
    .getElementById(
      "ma7alak-notification-close"
    )
    .addEventListener(
      "click",
      function(event){

        event.stopPropagation();

        closeNotifications();

      }
    );


  /* -------------------------------------------------------
     OUTSIDE CLICK
  ------------------------------------------------------- */

  document.addEventListener(
    "click",
    function(event){

      if(!notificationsOpen){

        return;

      }


      if(
        panel.contains(event.target) ||
        wrapper.contains(event.target)
      ){

        return;

      }


      closeNotifications();

    }
  );


  /* -------------------------------------------------------
     ESC
  ------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key === "Escape" &&
        notificationsOpen
      ){

        closeNotifications();

      }

    }
  );

}


/* =========================================================
   SHOP NAME
========================================================= */

function getShopName(
  slug
){

  const profile =
    MA7ALAK_SHOP_PROFILES[
      slug
    ];


  if(
    profile &&
    profile.shop_name
  ){

    return profile.shop_name;

  }


  if(
    MA7ALAK_SHOP_NAMES[slug]
  ){

    return MA7ALAK_SHOP_NAMES[slug];

  }


  return String(
    slug || "A shop"
  )
    .split("-")
    .map(
      function(word){

        if(!word){

          return "";

        }


        return (
          word.charAt(0).toUpperCase() +
          word.slice(1)
        );

      }
    )
    .join(" ");

}


/* =========================================================
   TIME
========================================================= */

function formatNotificationTime(
  dateString
){

  const date =
    new Date(dateString);


  if(
    isNaN(
      date.getTime()
    )
  ){

    return "";

  }


  const now =
    new Date();


  let seconds =
    Math.floor(
      (
        now.getTime() -
        date.getTime()
      ) / 1000
    );


  if(seconds < 0){

    seconds = 0;

  }


  /* -------------------------------------------------------
     JUST NOW
  ------------------------------------------------------- */

  if(seconds < 60){

    return "Just now";

  }


  /* -------------------------------------------------------
     MINUTES
  ------------------------------------------------------- */

  const minutes =
    Math.floor(
      seconds / 60
    );


  if(minutes < 60){

    return (
      minutes +
      "m ago"
    );

  }


  /* -------------------------------------------------------
     HOURS
  ------------------------------------------------------- */

  const hours =
    Math.floor(
      minutes / 60
    );


  if(hours < 24){

    return (
      hours +
      "h ago"
    );

  }


  /* -------------------------------------------------------
     YESTERDAY
  ------------------------------------------------------- */

  const yesterday =
    new Date();


  yesterday.setDate(
    yesterday.getDate() - 1
  );


  if(
    date.getFullYear() ===
      yesterday.getFullYear() &&
    date.getMonth() ===
      yesterday.getMonth() &&
    date.getDate() ===
      yesterday.getDate()
  ){

    return "Yesterday";

  }


  /* -------------------------------------------------------
     DAYS
  ------------------------------------------------------- */

  const days =
    Math.floor(
      hours / 24
    );


  if(days < 7){

    return (
      days +
      "d ago"
    );

  }


  /* -------------------------------------------------------
     OLDER
  ------------------------------------------------------- */

  return date.toLocaleDateString(
    "en-US",
    {
      month:"short",
      day:"numeric"
    }
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
  value
){

  return String(
    value || ""
  )
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

function escapeAttribute(
  value
){

  return escapeHtml(
    value
  );

}


/* =========================================================
   STORY + REEL NOTIFICATIONS — LATEST PER SHOP
   ---------------------------------------------------------
   - One Story row per shop.
   - One Reel row per shop.
   - A newer Story/Reel REUSES that shop's row.
   - Seen row = faded/normal background.
   - New post = same row becomes highlighted again + new time.
========================================================= */

const MA7ALAK_REELS_LIVE_CACHE_KEY =
  "ma7alak_live_reels_catalog_v1";

const MA7ALAK_REEL_NOTIFICATION_STATE_KEY =
  "ma7alak_reel_notification_state_v1";

let currentReelsState = {
  reelIds:[],
  reels:[]
};


function normalizeStringArray(values){

  if(!Array.isArray(values)){
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(function(value){
          return String(value || "").trim();
        })
        .filter(Boolean)
    )
  );

}


function getReelNotificationState(){

  try{

    const raw =
      localStorage.getItem(
        MA7ALAK_REEL_NOTIFICATION_STATE_KEY
      );

    const parsed =
      raw ? JSON.parse(raw) : null;

    if(!parsed || typeof parsed !== "object"){
      throw new Error("EMPTY_REEL_NOTIFICATION_STATE");
    }

    return {
      initialized:Boolean(parsed.initialized),
      known:normalizeStringArray(parsed.known),
      seen:normalizeStringArray(parsed.seen),
      detectedAt:
        parsed.detectedAt &&
        typeof parsed.detectedAt === "object"
          ? parsed.detectedAt
          : {}
    };

  }
  catch(error){

    return {
      initialized:false,
      known:[],
      seen:[],
      detectedAt:{}
    };

  }

}


function saveReelNotificationState(state){

  try{

    localStorage.setItem(
      MA7ALAK_REEL_NOTIFICATION_STATE_KEY,
      JSON.stringify({
        initialized:Boolean(state.initialized),
        known:normalizeStringArray(state.known),
        seen:normalizeStringArray(state.seen),
        detectedAt:
          state.detectedAt &&
          typeof state.detectedAt === "object"
            ? state.detectedAt
            : {}
      })
    );

  }
  catch(error){}

}


function getReelFingerprintId(
  fingerprint
){

  return String(
    fingerprint || ""
  ).split("::")[0].trim();

}


function deriveReelShopKey(
  reel,
  fingerprint
){

  const shopUrl =
    String(
      reel && reel.shopUrl
        ? reel.shopUrl
        : ""
    ).trim();

  if(shopUrl){

    try{

      const parsed =
        new URL(
          shopUrl,
          window.location.origin
        );

      const path =
        parsed.pathname
          .replace(/^\/+|\/+$/g,"")
          .trim();

      if(path){
        return path.toLowerCase();
      }

    }
    catch(error){}

  }

  const reelId =
    getReelFingerprintId(
      fingerprint
    );

  if(reelId){

    const cleaned =
      reelId.replace(
        /-\d+$/,
        ""
      );

    if(cleaned){
      return cleaned.toLowerCase();
    }

  }

  return String(
    reel && reel.shop
      ? reel.shop
      : "shop"
  )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"") || "shop";

}


function findReelForFingerprint(
  fingerprint,
  reels
){

  const reelId =
    getReelFingerprintId(
      fingerprint
    );

  if(!reelId){
    return null;
  }

  return (
    reels || []
  ).find(
    function(reel){

      return String(
        reel && reel.id
          ? reel.id
          : ""
      ).trim() === reelId;

    }
  ) || null;

}


function readReelsFromHeaderCache(){

  try{

    const cached =
      JSON.parse(
        localStorage.getItem(
          MA7ALAK_REELS_LIVE_CACHE_KEY
        ) || "{}"
      );

    return {
      reelIds:normalizeStringArray(
        cached.reelIds || []
      ),
      reels:Array.isArray(cached.reels)
        ? cached.reels
        : []
    };

  }
  catch(error){

    return {
      reelIds:[],
      reels:[]
    };

  }

}


function syncReelNotificationState(
  reelIds,
  reels
){

  const ids =
    normalizeStringArray(
      reelIds || []
    );

  const catalog =
    Array.isArray(reels)
      ? reels.filter(Boolean)
      : [];

  if(!ids.length){
    return;
  }

  currentReelsState = {
    reelIds:ids,
    reels:catalog.length
      ? catalog
      : currentReelsState.reels
  };

  const state =
    getReelNotificationState();

  const now =
    Date.now();

  /*
     First run after installing this version:
     current Reels become the baseline, so old Reels do NOT
     suddenly appear as brand-new notifications.
  */
  if(!state.initialized){

    state.initialized = true;
    state.known = ids.slice();
    state.seen = ids.slice();

    ids.forEach(
      function(id,index){

        if(!state.detectedAt[id]){
          state.detectedAt[id] =
            new Date(
              now - index
            ).toISOString();
        }

      }
    );

    saveReelNotificationState(
      state
    );

    return;

  }

  const knownSet =
    new Set(
      state.known
    );

  ids.forEach(
    function(id,index){

      if(!knownSet.has(id)){

        state.known.push(id);

        /*
           This is the moment this visitor first received the new Reel.
           It becomes the notification time shown in the panel.
        */
        state.detectedAt[id] =
          new Date(
            now - index
          ).toISOString();

      }
      else if(!state.detectedAt[id]){

        state.detectedAt[id] =
          new Date(
            now - index
          ).toISOString();

      }

    }
  );

  /* Keep state reasonably small. */
  const keep =
    new Set(
      state.known.slice(-250)
    );

  state.known =
    state.known.filter(
      function(id){
        return keep.has(id);
      }
    );

  state.seen =
    state.seen.filter(
      function(id){
        return keep.has(id);
      }
    );

  Object.keys(
    state.detectedAt
  ).forEach(
    function(id){

      if(!keep.has(id)){
        delete state.detectedAt[id];
      }

    }
  );

  saveReelNotificationState(
    state
  );

}


function buildReelNotifications(){

  const cached =
    readReelsFromHeaderCache();

  if(cached.reelIds.length){

    syncReelNotificationState(
      cached.reelIds,
      cached.reels
    );

  }

  const reelIds =
    currentReelsState.reelIds.length
      ? currentReelsState.reelIds
      : cached.reelIds;

  const reels =
    currentReelsState.reels.length
      ? currentReelsState.reels
      : cached.reels;

  if(!reelIds.length){
    return [];
  }

  const state =
    getReelNotificationState();

  const seenSet =
    new Set(
      state.seen
    );

  const latestByShop =
    new Map();

  reelIds.forEach(
    function(fingerprint){

      const reel =
        findReelForFingerprint(
          fingerprint,
          reels
        );

      if(!reel){
        return;
      }

      const shopKey =
        deriveReelShopKey(
          reel,
          fingerprint
        );

      const createdAt =
        reel.created_at ||
        state.detectedAt[fingerprint] ||
        new Date().toISOString();

      const candidate = {
        key:"reel:" + shopKey,
        type:"reel",
        id:fingerprint,
        reel_id:String(reel.id || "").trim(),
        shop_slug:shopKey,
        shop_name:String(reel.shop || "").trim(),
        shop_url:String(reel.shopUrl || "").trim(),
        icon:String(reel.icon || "").trim(),
        created_at:createdAt,
        seen:seenSet.has(fingerprint)
      };

      const existing =
        latestByShop.get(
          shopKey
        );

      if(
        !existing ||
        new Date(candidate.created_at).getTime() >
        new Date(existing.created_at).getTime()
      ){

        latestByShop.set(
          shopKey,
          candidate
        );

      }

    }
  );

  return Array.from(
    latestByShop.values()
  );

}


function markReelFingerprintAsSeen(
  fingerprint
){

  const id =
    String(
      fingerprint || ""
    ).trim();

  if(!id){
    return;
  }

  const state =
    getReelNotificationState();

  const seenSet =
    new Set(
      state.seen
    );

  seenSet.add(id);

  state.seen =
    Array.from(
      seenSet
    );

  saveReelNotificationState(
    state
  );

}


function markAllCurrentReelsAsSeen(){

  const reelNotifications =
    notifications.filter(
      function(notification){
        return notification.type === "reel";
      }
    );

  if(!reelNotifications.length){
    return;
  }

  const state =
    getReelNotificationState();

  const seenSet =
    new Set(
      state.seen
    );

  reelNotifications.forEach(
    function(notification){

      if(notification.id){
        seenSet.add(
          String(notification.id)
        );
      }

    }
  );

  state.seen =
    Array.from(
      seenSet
    );

  saveReelNotificationState(
    state
  );

}


/* =========================================================
   LIVE NOTIFICATIONS — ONE ROW PER SHOP
   ---------------------------------------------------------
   - One Live notification row per followed shop.
   - Multiple active Live cards NEVER create notification spam.
   - If the row was already read and the shop publishes a NEW
     Live card, the same row becomes unread again.
   - Existing Live cards are seeded as the first-run baseline.
========================================================= */

const MA7ALAK_LIVE_NOTIFICATION_STATE_KEY =
  "ma7alak_live_notification_state_v1";

function getLiveNotificationState(){
  try{
    const parsed=JSON.parse(localStorage.getItem(MA7ALAK_LIVE_NOTIFICATION_STATE_KEY)||"null");
    if(!parsed||typeof parsed!=="object")throw new Error("EMPTY_LIVE_STATE");
    return {
      initialized:Boolean(parsed.initialized),
      seenByShop:parsed.seenByShop&&typeof parsed.seenByShop==="object" ? parsed.seenByShop : {}
    };
  }catch(error){
    return {initialized:false,seenByShop:{}};
  }
}

function saveLiveNotificationState(state){
  try{
    localStorage.setItem(
      MA7ALAK_LIVE_NOTIFICATION_STATE_KEY,
      JSON.stringify({
        initialized:Boolean(state&&state.initialized),
        seenByShop:state&&state.seenByShop&&typeof state.seenByShop==="object" ? state.seenByShop : {}
      })
    );
  }catch(error){}
}

function markLiveNotificationAsSeen(shopSlug,postId){
  const slug=String(shopSlug||"").trim();
  const id=String(postId||"").trim();
  if(!slug||!id)return;
  const state=getLiveNotificationState();
  state.initialized=true;
  state.seenByShop[slug]=id;
  saveLiveNotificationState(state);
}

function markAllCurrentLivesAsSeen(){
  const liveRows=notifications.filter(function(notification){return notification&&notification.type==="live";});
  if(!liveRows.length)return;
  const state=getLiveNotificationState();
  state.initialized=true;
  liveRows.forEach(function(notification){
    const slug=String(notification.shop_slug||"").trim();
    const id=String(notification.id||"").trim();
    if(slug&&id)state.seenByShop[slug]=id;
  });
  saveLiveNotificationState(state);
}

async function openExactLiveFromNotification(postId){
  const id=String(postId||"").trim();
  if(!id)return false;
  try{
    const api=window.Ma7alakLiveOffers;
    if(api){
      if(typeof api.refresh==="function")await api.refresh();
      if(typeof api.open==="function"){api.open(id);return true;}
    }
  }catch(error){}
  try{
    window.postMessage({type:"MA7ALAK_LIVE_OFFERS_VIEW",id:id},"*");
    return true;
  }catch(error){return false;}
}

/* =========================================================
   FOLLOW-ONLY NOTIFICATIONS
   ---------------------------------------------------------
   The bell now shows Story/Reel activity ONLY from shops
   followed by this visitor.

   Uses the SAME persistent visitor ID as the Follow system:
   ma7alak_visitor_id

   Security behavior:
   If the Follow RPC cannot be read, fail CLOSED (show no
   shop activity) instead of falling back to notifying the
   visitor about every shop.
========================================================= */

function getSharedFollowingSlugSet(){

  try{

    const state =
      window.Ma7alakFollowingState;

    if(
      !state ||
      state.visitorId !== visitorId ||
      !Array.isArray(state.slugs) ||
      !Number.isFinite(Number(state.updatedAt)) ||
      Date.now() - Number(state.updatedAt) > 60000
    ){
      return null;
    }

    return new Set(
      state.slugs
        .map(function(value){
          return String(value || "").trim();
        })
        .filter(Boolean)
    );

  }
  catch(error){

    return null;

  }

}


async function getFollowedShopSlugSet(client){

  const shared =
    getSharedFollowingSlugSet();

  if(shared){
    return shared;
  }

  try{

    const {
      data,
      error
    } = await client.rpc(
      "get_visitor_followed_shops",
      {
        p_visitor_id:
          visitorId
      }
    );


    if(error){

      console.error(
        "ShoufHon followed shops:",
        error
      );

      return new Set();

    }


    const rows =
      Array.isArray(data)
        ? data
        : [];


    return new Set(
      rows
        .map(
          function(row){

            if(
              typeof row ===
              "string"
            ){
              return row.trim();
            }

            return String(
              (
                row &&
                (
                  row.shop_slug ||
                  row.p_shop_slug ||
                  row.slug
                )
              ) ||
              ""
            ).trim();

          }
        )
        .filter(Boolean)
    );

  }
  catch(error){

    console.error(
      "ShoufHon followed shops failed:",
      error
    );

    return new Set();

  }

}


/* =========================================================
   LOAD NOTIFICATIONS
========================================================= */

async function loadNotifications(){

  try{

    const client =
      await loadMa7alakSupabase();


    /*
       LIVE FOLLOW FILTER:
       Re-read the visitor's followed shops on every notification
       refresh. The existing refresh loop means Follow/Unfollow
       changes affect the bell without a page refresh.
    */
    const followedShopSlugs =
      await getFollowedShopSlugSet(
        client
      );


    const notificationCutoff =
      new Date(
        Date.now() -
        (
          48 *
          60 *
          60 *
          1000
        )
      ).toISOString();


    /* -------------------------------------------------------
       STORIES WITHIN THE 48 HOUR WINDOW
    ------------------------------------------------------- */

    const {
      data:stories,
      error:storiesError
    } = await client

      .from(
        "shop_stories"
      )

      .select(
        "id,shop_slug,media_type,storage_path,expires_at,created_at"
      )

      .gt(
        "expires_at",
        new Date().toISOString()
      )

      .gte(
        "created_at",
        notificationCutoff
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );


    if(storiesError){

      console.error(
        "ShoufHon notifications stories:",
        storiesError
      );

      return;

    }


    const activeStories =
      (stories || []).filter(
        function(story){

          return !!(
            story &&
            story.shop_slug &&
            followedShopSlugs.has(
              String(
                story.shop_slug
              ).trim()
            )
          );

        }
      );


    /* -------------------------------------------------------
       ONE STORY ROW PER SHOP — KEEP ONLY LATEST STORY
    ------------------------------------------------------- */

    const latestStoryByShop =
      new Map();

    activeStories.forEach(
      function(story){

        if(
          !story ||
          !story.shop_slug
        ){
          return;
        }

        if(
          !latestStoryByShop.has(
            story.shop_slug
          )
        ){

          latestStoryByShop.set(
            story.shop_slug,
            story
          );

        }

      }
    );


    const latestStories =
      Array.from(
        latestStoryByShop.values()
      );


    /* -------------------------------------------------------
       GET SEEN STATE FOR ONLY THE LATEST STORY OF EACH SHOP
    ------------------------------------------------------- */

    let storyNotifications = [];

    if(latestStories.length){

      const storyIds =
        latestStories.map(
          function(story){
            return story.id;
          }
        );


      const {
        data:seenRows,
        error:seenError
      } = await client.rpc(
        "get_story_notification_seen_state",
        {
          p_visitor_id:visitorId,
          p_story_ids:storyIds
        }
      );


      if(seenError){

        console.error(
          "ShoufHon notification views:",
          seenError
        );

      }


      const seenSet =
        new Set(
          (
            seenRows || []
          ).map(
            function(row){
              return row.story_id;
            }
          )
        );


      storyNotifications =
        latestStories.map(
          function(story){

            return {
              ...story,
              key:
                "story:" +
                story.shop_slug,
              type:"story",
              seen:seenSet.has(
                story.id
              )
            };

          }
        );

    }


    /* -------------------------------------------------------
       LIVE REEL NOTIFICATIONS — DIRECT DATABASE SOURCE
       -------------------------------------------------------
       IMPORTANT:
       Do NOT depend on the Reels embed being visible/loaded.
       Hostinger can lazy-load that embed only after scrolling,
       which made the bell wait until the visitor reached Reels.

       We read shop_reels DIRECTLY here on every notification
       refresh. The existing 1.5s backup refresh therefore makes
       new Admin Panel Reels appear in the bell even if Realtime
       or the Reel iframe/header bridge is late.
    ------------------------------------------------------- */

    const {
      data:directReels,
      error:directReelsError
    } = await client
      .from("shop_reels")
      .select(
        "reel_id,shop_slug,shop_name,shop_url,shop_icon,video_url,caption,sort_order,active,created_at"
      )
      .eq("active", true)
      .order("sort_order", { ascending:true })
      .order("created_at", { ascending:false });

    if(!directReelsError){

      const followedDirectReels =
        (directReels || []).filter(
          function(row){

            return !!(
              row &&
              row.shop_slug &&
              followedShopSlugs.has(
                String(
                  row.shop_slug
                ).trim()
              )
            );

          }
        );

      const directReelIds =
        followedDirectReels
          .map(function(row){
            return String(row.reel_id || "").trim();
          })
          .filter(Boolean);

      const directReelCatalog =
        followedDirectReels
          .map(function(row){
            return {
              id:String(row.reel_id || "").trim(),
              shop:String(row.shop_name || row.shop_slug || "Shop").trim(),
              shopSlug:String(row.shop_slug || "").trim(),
              shopUrl:String(
                row.shop_url ||
                (row.shop_slug
                  ? ("https://shoufhon.com/" + row.shop_slug)
                  : "")
              ).trim(),
              icon:String(row.shop_icon || "").trim(),
              video:String(row.video_url || "").trim(),
              created_at:row.created_at || null
            };
          })
          .filter(function(reel){
            return reel.id;
          });

      if(directReelIds.length){
        syncReelNotificationState(
          directReelIds,
          directReelCatalog
        );
      }

      /*
         IMPORTANT:
         Set the current state even when the visitor follows ZERO
         shops. This prevents an old/global Reel cache from leaking
         unrelated shop notifications back into the bell.
      */
      currentReelsState = {
        reelIds:directReelIds,
        reels:directReelCatalog
      };

      try{
        localStorage.setItem(
          MA7ALAK_REELS_LIVE_CACHE_KEY,
          JSON.stringify(currentReelsState)
        );
      }
      catch(error){}

    }
    else{
      console.error(
        "ShoufHon notifications direct reels:",
        directReelsError
      );
    }

    const reelNotifications =
      buildReelNotifications()
        .filter(
          function(notification){

            return !!(
              notification &&
              notification.shop_slug &&
              followedShopSlugs.has(
                String(
                  notification.shop_slug
                ).trim()
              )
            );

          }
        );


    /* -------------------------------------------------------
       LIVE NOTIFICATIONS — LATEST ACTIVE CARD PER SHOP
    ------------------------------------------------------- */

    const liveNow = new Date().toISOString();
    const {data:directLivePosts,error:directLivePostsError} = await client
      .from("shop_live_posts")
      .select("id,shop_slug,shop_name,post_type,title,starts_at,ends_at,status,created_at")
      .eq("status","active")
      .lte("starts_at",liveNow)
      .gt("ends_at",liveNow)
      .order("created_at",{ascending:false});

    let liveNotifications = [];
    if(!directLivePostsError){
      const latestLiveByShop=new Map();
      (directLivePosts||[]).forEach(function(row){
        const slug=String(row&&row.shop_slug?row.shop_slug:"").trim();
        if(!slug||!followedShopSlugs.has(slug)||latestLiveByShop.has(slug))return;
        latestLiveByShop.set(slug,row);
      });
      const liveState=getLiveNotificationState();
      if(!liveState.initialized){
        liveState.initialized=true;
        latestLiveByShop.forEach(function(row,slug){liveState.seenByShop[slug]=String(row.id||"");});
        saveLiveNotificationState(liveState);
      }
      liveNotifications=Array.from(latestLiveByShop.entries()).map(function(entry){
        const slug=entry[0],row=entry[1],id=String(row.id||"");
        return {
          ...row,
          key:"live:"+slug,
          type:"live",
          id:id,
          shop_slug:slug,
          shop_name:String(row.shop_name||getShopName(slug)||slug).trim(),
          created_at:row.created_at||row.starts_at||liveNow,
          seen:String(liveState.seenByShop[slug]||"")===id
        };
      });
    }else{
      console.error("ShoufHon notifications live:",directLivePostsError);
    }

    /* -------------------------------------------------------
       COMBINE + SORT
    ------------------------------------------------------- */

    notifications =
      storyNotifications
        .concat(
          reelNotifications
        )
        .concat(
          liveNotifications
        )
        .sort(
          function(a,b){

            return (
              new Date(
                b.created_at || 0
              ).getTime() -
              new Date(
                a.created_at || 0
              ).getTime()
            );

          }
        );


    /* -------------------------------------------------------
       HIGHLIGHT ONLY CURRENT UNREAD ROWS
       key is type + shop, so the SAME row gets reused.
       A newer story/reel has a different ID and becomes unread again.
    ------------------------------------------------------- */

    notifications.forEach(
      function(notification){

        if(!notification.seen){

          highlightedNotifications.add(
            notification.key
          );

        }

      }
    );


    const activeKeySet =
      new Set(
        notifications.map(
          function(notification){
            return notification.key;
          }
        )
      );


    highlightedNotifications =
      new Set(
        Array.from(
          highlightedNotifications
        ).filter(
          function(key){
            return activeKeySet.has(key);
          }
        )
      );


    notificationBadgeCount =
      calculateBadgeCount();


    updateNotificationBadge();

    renderNotifications();


    /*
       Do not re-query shop_profiles every fast refresh.
       Profile data changes rarely, notifications change often.
    */
    if(
      !lastShopProfilesLoadAt ||
      Date.now() - lastShopProfilesLoadAt > 60000
    ){

      lastShopProfilesLoadAt =
        Date.now();

      loadShopProfiles();

    }

  }
  catch(error){

    console.error(
      "ShoufHon notifications error:",
      error
    );

  }

}


/* =========================================================
   BADGE
========================================================= */

function updateNotificationBadge(){

  const badge =
    document.getElementById(
      "ma7alak-notification-badge"
    );


  const bell =
    document.getElementById(
      "ma7alak-notification-bell"
    );


  if(
    !badge ||
    !bell
  ){

    return;

  }


  if(
    notificationBadgeCount > 0
  ){

    badge.textContent =
      notificationBadgeCount > 99
        ? "99+"
        : String(
            notificationBadgeCount
          );


    badge.classList.add(
      "visible"
    );


    bell.classList.add(
      "shake"
    );

  }
  else{

    badge.textContent =
      "";


    badge.classList.remove(
      "visible"
    );


    bell.classList.remove(
      "shake"
    );

  }

}



/* =========================================================
   OPEN EXACT REEL FROM NOTIFICATION
   ---------------------------------------------------------
   Uses the existing premium header Reel viewer WITHOUT
   rewriting it. We open the viewer, detect its current Reel,
   then move through the existing viewer until the exact
   notification Reel ID/video is active.
========================================================= */

function getNotificationReelCatalog(){

  const cached =
    readReelsFromHeaderCache();

  const liveReels =
    currentReelsState.reels &&
    currentReelsState.reels.length
      ? currentReelsState.reels
      : cached.reels;

  return Array.isArray(liveReels)
    ? liveReels.filter(Boolean)
    : [];

}


function normalizeMediaUrl(value){

  try{

    return new URL(
      String(value || ""),
      window.location.href
    ).href;

  }
  catch(error){

    return String(value || "").trim();

  }

}


function openExactReelFromNotification(
  fingerprint
){

  const targetId =
    getReelFingerprintId(
      fingerprint
    );

  if(!targetId){
    return false;
  }

  /*
     NEW EXACT-ID PATH.
     The premium header owns the Reel viewer/catalog, so ask it to
     open this exact reel_id directly. No random Reel, no ArrowUp
     stepping, and no video-URL comparison. This also works when two
     Reel rows intentionally use the same Bunny video URL.
  */
  if(
    typeof window.ma7alakOpenExactReel ===
      "function"
  ){
    try{
      return window.ma7alakOpenExactReel(
        targetId
      ) !== false;
    }
    catch(error){}
  }

  /* Load-order fallback. The header listens for this event and keeps
     the exact Reel ID pending until its live catalog is available. */
  try{
    window.dispatchEvent(
      new CustomEvent(
        "MA7ALAK_OPEN_EXACT_REEL",
        {
          detail:{
            reelId:targetId
          }
        }
      )
    );

    return true;
  }
  catch(error){
    return false;
  }

}


/* =========================================================
   FAST REEL STATE REQUEST
========================================================= */

function requestCurrentReelsState(){

  document.querySelectorAll(
    "iframe"
  ).forEach(
    function(frame){

      try{

        if(frame.contentWindow){

          frame.contentWindow.postMessage(
            {
              type:
                "MA7ALAK_REQUEST_REELS_STATE"
            },
            "*"
          );

        }

      }
      catch(error){}

    }
  );

}

/* =========================================================
   NOTIFICATION CONTENT DEEP LINKS
========================================================= */

function buildNotificationUrl(path,params){
  const url=new URL(path||"/",window.location.origin);
  Object.keys(params||{}).forEach(function(key){
    const value=String(params[key]||"").trim();
    if(value)url.searchParams.set(key,value);
  });
  return url.href;
}

const SHOUFHON_STORY_DEEP_LINK_PENDING_KEY =
  "shoufhon_story_deep_link_v1";

function rememberStoryDeepLink(url){
  try{
    const parsed =
      new URL(
        url,
        window.location.href
      );

    const storyId =
      String(
        parsed.searchParams.get("story") ||
        ""
      ).trim();

    if(!storyId){
      return;
    }

    const shopSlug =
      String(
        parsed.searchParams.get("shop") ||
        parsed.pathname
          .split("/")
          .filter(Boolean)
          .pop() ||
        ""
      )
        .trim()
        .toLowerCase();

    sessionStorage.setItem(
      SHOUFHON_STORY_DEEP_LINK_PENDING_KEY,
      JSON.stringify({
        storyId:storyId,
        shopSlug:shopSlug,
        savedAt:Date.now()
      })
    );
  }
  catch(error){}
}

function navigateFromNotification(url){
  rememberStoryDeepLink(url);

  if(typeof window.ma7alakFreshNavigate==="function"){
    window.ma7alakFreshNavigate(url);
  }
  else{
    window.location.assign(url);
  }
}

function ensureExactReelOpened(reelId){
  const targetId=getReelFingerprintId(reelId);
  if(!targetId)return;
  setTimeout(function(){
    const viewer=document.getElementById("ma7alakGlobalReelViewer");
    if(viewer&&viewer.classList.contains("open"))return;
    navigateFromNotification(buildNotificationUrl("/",{reel:targetId}));
  },500);
}

function readPendingStoryDeepLink(){
  try{
    const raw =
      sessionStorage.getItem(
        SHOUFHON_STORY_DEEP_LINK_PENDING_KEY
      );

    if(!raw){
      return null;
    }

    const value =
      JSON.parse(raw);

    const savedAt =
      Number(
        value && value.savedAt
      ) || 0;

    if(
      !savedAt ||
      Date.now() - savedAt >
        2 * 60 * 1000
    ){
      sessionStorage.removeItem(
        SHOUFHON_STORY_DEEP_LINK_PENDING_KEY
      );
      return null;
    }

    const storyId =
      String(
        value && value.storyId ||
        ""
      ).trim();

    if(!storyId){
      return null;
    }

    return {
      storyId:storyId,
      shopSlug:String(
        value && value.shopSlug ||
        ""
      )
        .trim()
        .toLowerCase()
    };
  }
  catch(error){
    return null;
  }
}

function clearPendingStoryDeepLink(){
  try{
    sessionStorage.removeItem(
      SHOUFHON_STORY_DEEP_LINK_PENDING_KEY
    );
  }
  catch(error){}
}

function pageShopSlug(params){
  const fromQuery =
    String(
      params &&
      params.get("shop") ||
      ""
    )
      .trim()
      .toLowerCase();

  if(fromQuery){
    return fromQuery;
  }

  try{
    return String(
      decodeURIComponent(
        window.location.pathname
          .split("/")
          .filter(Boolean)
          .pop() ||
        ""
      )
    )
      .trim()
      .toLowerCase();
  }
  catch(error){
    return "";
  }
}

function findStoryViewerSurface(){
  const selector =
    "#ma7alak-story-button," +
    ".ma7alak-story-button," +
    "#ma7alak-story-active-ring," +
    "#ma7alak-story-new-ring";

  const ownButton =
    document.querySelector(
      selector
    );

  if(ownButton){
    return {
      doc:document,
      button:ownButton,
      frame:null
    };
  }

  const frames =
    Array.from(
      document.querySelectorAll(
        "iframe"
      )
    );

  for(
    let index = 0;
    index < frames.length;
    index++
  ){
    const frame =
      frames[index];

    try{
      const doc =
        frame.contentDocument;

      if(!doc){
        continue;
      }

      const button =
        doc.querySelector(
          selector
        );

      if(button){
        return {
          doc:doc,
          button:button,
          frame:frame
        };
      }
    }
    catch(error){}
  }

  return null;
}

function normalizeStoryMediaUrl(value){
  const raw =
    String(
      value ||
      ""
    ).trim();

  if(!raw){
    return "";
  }

  try{
    const url =
      new URL(
        raw,
        window.location.href
      );

    let path =
      url.pathname;

    try{
      path =
        decodeURIComponent(
          path
        );
    }
    catch(error){}

    return (
      url.origin +
      path
    ).replace(/\/+$/,"");
  }
  catch(error){
    return raw;
  }
}

function storyViewerHasTargetMedia(
  doc,
  targetUrl
){
  if(
    !doc ||
    !targetUrl
  ){
    return false;
  }

  const expected =
    normalizeStoryMediaUrl(
      targetUrl
    );

  if(!expected){
    return false;
  }

  const media =
    Array.from(
      doc.querySelectorAll(
        "#ma7alak-full-story-media img," +
        "#ma7alak-full-story-media video"
      )
    );

  return media.some(
    function(element){
      const current =
        String(
          element.currentSrc ||
          element.src ||
          element.getAttribute("src") ||
          ""
        ).trim();

      return (
        current &&
        normalizeStoryMediaUrl(
          current
        ) === expected
      );
    }
  );
}

function storyPublicMediaUrl(
  client,
  story
){
  const raw =
    String(
      story &&
      story.storage_path ||
      ""
    ).trim();

  if(!raw){
    return "";
  }

  if(/^https?:\/\//i.test(raw)){
    return raw;
  }

  try{
    return (
      client
        .storage
        .from("shop-stories")
        .getPublicUrl(raw)
        .data
        .publicUrl ||
      ""
    );
  }
  catch(error){
    return "";
  }
}

async function waitForStorySurface(
  timeoutMs
){
  const started =
    Date.now();

  while(
    Date.now() - started <
    timeoutMs
  ){
    const surface =
      findStoryViewerSurface();

    if(surface){
      return surface;
    }

    await new Promise(
      function(resolve){
        setTimeout(
          resolve,
          200
        );
      }
    );
  }

  return null;
}

async function waitForStoryViewerOpen(
  surface,
  timeoutMs
){
  const started =
    Date.now();

  while(
    Date.now() - started <
    timeoutMs
  ){
    try{
      const screen =
        surface &&
        surface.doc &&
        surface.doc.getElementById(
          "ma7alak-full-story"
        );

      if(
        screen &&
        screen.classList.contains(
          "active"
        )
      ){
        return true;
      }
    }
    catch(error){}

    await new Promise(
      function(resolve){
        setTimeout(
          resolve,
          120
        );
      }
    );
  }

  return false;
}

function notificationStoryViewerUrl(){
  try{
    return new URL(
      "shoufhon-story-viewer.js",
      MA7ALAK_NOTIFICATIONS_SCRIPT_SRC ||
      window.location.href
    ).href;
  }
  catch(error){
    return "shoufhon-story-viewer.js";
  }
}

function ensureNotificationStoryViewer(){
  if(
    window.ShoufHonStoryViewer &&
    typeof window.ShoufHonStoryViewer.open ===
      "function"
  ){
    return Promise.resolve(
      window.ShoufHonStoryViewer
    );
  }

  if(
    ma7alakNotificationStoryViewerPromise
  ){
    return ma7alakNotificationStoryViewerPromise;
  }

  ma7alakNotificationStoryViewerPromise =
    new Promise(
      function(resolve){

        const existing =
          Array.from(
            document.scripts
          ).find(
            function(script){
              return /shoufhon-story-viewer\.js(?:$|[?#])/.test(
                script.src || ""
              );
            }
          );

        if(existing){
          let tries = 0;

          const wait = function(){
            if(
              window.ShoufHonStoryViewer &&
              typeof window.ShoufHonStoryViewer.open ===
                "function"
            ){
              resolve(
                window.ShoufHonStoryViewer
              );
              return;
            }

            tries++;

            if(tries < 125){
              setTimeout(
                wait,
                40
              );
            }
            else{
              resolve(
                null
              );
            }
          };

          wait();
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          notificationStoryViewerUrl();

        script.onload =
          function(){
            resolve(
              window.ShoufHonStoryViewer ||
              null
            );
          };

        script.onerror =
          function(){
            resolve(
              null
            );
          };

        document.head.appendChild(
          script
        );
      }
    );

  return ma7alakNotificationStoryViewerPromise;
}

function cleanStoryDeepLinkFromAddress(){
  try{
    const url =
      new URL(
        window.location.href
      );

    const hadStory =
      url.searchParams.has(
        "story"
      );

    const hadShop =
      url.searchParams.has(
        "shop"
      );

    if(
      !hadStory &&
      !hadShop
    ){
      return;
    }

    url.searchParams.delete(
      "story"
    );

    url.searchParams.delete(
      "shop"
    );

    history.replaceState(
      history.state,
      "",
      url.pathname +
      (
        url.search ||
        ""
      ) +
      (
        url.hash ||
        ""
      )
    );
  }
  catch(error){}
}

async function openExactStoryInExistingViewer(
  storyId,
  shopSlug
){
  if(
    !storyId ||
    !shopSlug
  ){
    return false;
  }

  const viewer =
    await ensureNotificationStoryViewer();

  if(
    !viewer ||
    typeof viewer.open !==
      "function"
  ){
    return false;
  }

  return Boolean(
    await viewer.open({
      shopSlug:shopSlug,
      storyId:storyId,
      preferUnseen:false
    })
  );
}

async function openStoryDeepLinkOnShopPage(){
  let params;

  try{
    params =
      new URLSearchParams(
        window.location.search
      );
  }
  catch(error){
    params =
      null;
  }

  const pending =
    readPendingStoryDeepLink();

  const storyId =
    String(
      (
        params &&
        params.get("story")
      ) ||
      (
        pending &&
        pending.storyId
      ) ||
      ""
    ).trim();

  if(!storyId){
    return;
  }

  const queryShop =
    pageShopSlug(
      params
    );

  const pendingShop =
    String(
      pending &&
      pending.shopSlug ||
      ""
    )
      .trim()
      .toLowerCase();

  const pathShop =
    String(
      (
        window.location.pathname ||
        ""
      )
        .split("/")
        .filter(Boolean)
        .pop() ||
      ""
    )
      .trim()
      .toLowerCase();

  const shopSlug =
    queryShop ||
    pendingShop ||
    pathShop;

  if(!shopSlug){
    return;
  }

  if(
    pathShop &&
    shopSlug !== pathShop
  ){
    return;
  }

  /*
     Consume the deep link BEFORE opening the viewer.
     A refresh after this point must never replay the same Story.
  */
  clearPendingStoryDeepLink();
  cleanStoryDeepLinkFromAddress();

  try{
    await openExactStoryInExistingViewer(
      storyId,
      shopSlug
    );
  }
  catch(error){
    console.warn(
      "ShoufHon Story deep link:",
      error
    );
  }
}

if(
  document.readyState ===
    "loading"
){
  document.addEventListener(
    "DOMContentLoaded",
    function(){
      setTimeout(
        function(){
          openStoryDeepLinkOnShopPage()
            .catch(function(){});
        },
        120
      );
    },
    {
      once:true
    }
  );
}
else{
  setTimeout(
    function(){
      openStoryDeepLinkOnShopPage()
        .catch(function(){});
    },
    120
  );
}


/* =========================================================
   RENDER
========================================================= */

function renderNotifications(){

  const list =
    document.getElementById(
      "ma7alak-notification-list"
    );


  if(!list){
    return;
  }


  if(
    notifications.length === 0
  ){

    list.innerHTML = `

      <div
        id="ma7alak-notification-empty"
      >

        <div
          class="ma7alak-notification-empty-icon"
        >
          🔔
        </div>


        <div
          class="ma7alak-notification-empty-title"
        >
          No notifications
        </div>


        <div
          class="ma7alak-notification-empty-text"
        >
          You're all caught up.
        </div>

      </div>

    `;

    return;

  }


  const visibleNotifications =
    notifications;


  list.innerHTML =
    visibleNotifications
      .map(
        function(notification){

          const notificationKey =
            String(
              notification.key || ""
            );


          const highlighted =
            highlightedNotifications.has(
              notificationKey
            );


          const isReel =
            notification.type === "reel";

          const isLive =
            notification.type === "live";


          const shopName =
            (isReel || isLive) && notification.shop_name
              ? notification.shop_name
              : getShopName(
                  notification.shop_slug
                );


          const profileImage =
            getShopProfileImage(
              notification.shop_slug
            );


          const shopImage =
            isReel
              ? (
                  profileImage ||
                  notification.icon ||
                  ""
                )
              : profileImage;


          const time =
            formatNotificationTime(
              notification.created_at
            );


          let iconHTML;


          if(shopImage){

            iconHTML = `

              <img
                src="${escapeAttribute(shopImage)}"
                alt="${escapeAttribute(shopName)}"
                loading="lazy"
                onerror="
                  this.style.display='none';
                  this.parentElement.classList.add('fallback-icon');
                  if(!this.parentElement.querySelector('.fallback-emoji')){
                    this.parentElement.insertAdjacentHTML(
                      'beforeend',
                      '<span class=&quot;fallback-emoji&quot;>${isLive ? "🟢" : (isReel ? "▶️" : "🔥")}</span>'
                    );
                  }
                "
              >

            `;

          }
          else{

            iconHTML = `

              <span
                class="fallback-emoji"
              >
                ${isLive ? "🟢" : (isReel ? "▶️" : "🔥")}
              </span>

            `;

          }


          return `

            <button
              type="button"
              class="
                ma7alak-notification-item
                ${highlighted ? "highlighted" : ""}
              "
              data-notification-key="${escapeAttribute(notificationKey)}"
              data-notification-type="${escapeAttribute(notification.type || "story")}"
              data-notification-id="${escapeAttribute(String(notification.id || ""))}"
              data-notification-created-at="${escapeAttribute(notification.created_at || "")}"
              data-shop-slug="${escapeAttribute(notification.shop_slug || "")}"
              data-shop-url="${escapeAttribute(notification.shop_url || "")}"
            >

              <div
                class="ma7alak-notification-icon"
              >

                ${iconHTML}

              </div>


              <div
                class="ma7alak-notification-content"
              >

                <p
                  class="ma7alak-notification-message"
                >

                  <strong>
                    ${escapeHtml(shopName)}
                  </strong>

                  ${isLive ? "is now live!" : (isReel ? "added a new Reel" : "added a new story")}

                </p>


                <div
                  class="ma7alak-notification-time"
                >
                  ${escapeHtml(time)}
                </div>

              </div>


              <div
                class="ma7alak-notification-unread-dot"
              ></div>

            </button>

          `;

        }
      )
      .join("");


  /* All loaded notifications stay in the fixed-height list.
     Older items are reached by scrolling inside the panel. */

  list
    .querySelectorAll(
      ".ma7alak-notification-item"
    )
    .forEach(
      function(item){

        item.addEventListener(
          "click",
          async function(){

            const notificationKey =
              String(
                item.dataset.notificationKey || ""
              );


            const notificationType =
              String(
                item.dataset.notificationType || "story"
              );


            const notificationId =
              String(
                item.dataset.notificationId || ""
              );


            const shopSlug =
              item.dataset.shopSlug || "";


            const shopUrl =
              item.dataset.shopUrl || "";


            /*
               FACEBOOK STYLE:
               Clicking the ROW is what removes its unread background.
               Merely opening the bell never changes this row state.
            */

            let contentOpened =
              false;

            let storyOpenedDirectly =
              false;


            if(
              notificationType === "reel"
            ){

              contentOpened =
                openExactReelFromNotification(
                  notificationId
                );

              if(contentOpened){
                ensureExactReelOpened(
                  notificationId
                );
              }


              /*
                 If the exact Reel viewer is unavailable on this page,
                 fall back to the shop URL instead of doing nothing.
              */
              if(
                !contentOpened &&
                shopUrl
              ){

                contentOpened =
                  true;

                window.location.href =
                  shopUrl;

              }

            }
            else if(
              notificationType === "live"
            ){

              contentOpened =
                await openExactLiveFromNotification(
                  notificationId
                );

            }
            else{

              /*
                 Open the shared Story viewer directly from THIS tap so
                 Android Chrome/Brave still has user activation for native
                 fullscreen instead of navigating first and showing browser UI.
              */
              const viewer =
                window.ShoufHonStoryViewer;

              if(
                viewer &&
                typeof viewer.open === "function" &&
                shopSlug &&
                notificationId
              ){

                closeNotifications();

                storyOpenedDirectly =
                  true;

                contentOpened =
                  true;

                Promise.resolve(
                  viewer.open({
                    shopSlug:shopSlug,
                    storyId:notificationId,
                    preferUnseen:false
                  })
                )
                  .then(function(opened){
                    if(!opened&&shopSlug){
                      navigateFromNotification(buildNotificationUrl("/"+encodeURIComponent(shopSlug),{story:notificationId,shop:shopSlug}));
                    }
                  })
                  .catch(function(){
                    if(shopSlug){
                      navigateFromNotification(buildNotificationUrl("/"+encodeURIComponent(shopSlug),{story:notificationId,shop:shopSlug}));
                    }
                  });

              }
              else{

                contentOpened =
                  Boolean(shopSlug);

              }

            }


            if(!contentOpened){
              return;
            }


            highlightedNotifications.delete(
              notificationKey
            );


            if(
              notificationType === "reel"
            ){

              markReelFingerprintAsSeen(
                notificationId
              );

            }
            else if(
              notificationType === "live"
            ){

              markLiveNotificationAsSeen(
                shopSlug,
                notificationId
              );

            }
            else{

              /*
                 Do not delay navigation/UI waiting on Supabase.
                 Save the read state in the background.
              */
              markSingleStoryAsSeen(
                notificationId
              );

            }


            notifications =
              notifications.map(
                function(notification){

                  if(
                    notification.key ===
                    notificationKey
                  ){

                    return {
                      ...notification,
                      seen:true
                    };

                  }

                  return notification;

                }
              );


            renderNotifications();


            if(
              notificationType === "story" &&
              shopSlug &&
              !storyOpenedDirectly
            ){

              navigateFromNotification(
                buildNotificationUrl(
                  "/" + encodeURIComponent(shopSlug),
                  {
                    story:notificationId,
                    shop:shopSlug
                  }
                )
              );

            }

          }
        );

      }
    );

}


/* =========================================================
   MARK ONE STORY AS SEEN
========================================================= */

async function markSingleStoryAsSeen(
  storyId
){

  try{

    const client =
      await loadMa7alakSupabase();


    const numericStoryId =
      Number(
        storyId
      );


    if(
      !Number.isFinite(
        numericStoryId
      )
    ){
      return;
    }


    const {
      error
    } = await client.rpc(
      "mark_story_notifications_seen",
      {
        p_visitor_id:visitorId,
        p_story_ids:[numericStoryId]
      }
    );

    if(error){
      console.error(
        "ShoufHon mark notification:",
        error
      );
    }

  }
  catch(error){

    console.error(
      "ShoufHon mark notification:",
      error
    );

  }

}


/* =========================================================
   MARK ALL CURRENT NOTIFICATIONS AS SEEN
========================================================= */

async function markAllCurrentNotificationsAsSeen(){

  if(
    !notifications.length
  ){
    return;
  }


  try{

    const client =
      await loadMa7alakSupabase();


    const storyRows =
      notifications
        .filter(
          function(notification){
            return notification.type === "story";
          }
        )
        .map(
          function(notification){

            const storyId =
              Number(
                notification.id
              );


            if(
              !Number.isFinite(
                storyId
              )
            ){
              return null;
            }


            return {
              visitor_id:
                visitorId,

              story_id:
                storyId
            };

          }
        )
        .filter(Boolean);


    if(storyRows.length){

      const {
        error
      } =
        await client.rpc(
          "mark_story_notifications_seen",
          {
            p_visitor_id:visitorId,
            p_story_ids:
              storyRows.map(function(row){
                return row.story_id;
              })
          }
        );


      if(error){

        console.error(
          "ShoufHon mark all story notifications:",
          error
        );

      }

    }


    markAllCurrentReelsAsSeen();

    markAllCurrentLivesAsSeen();


    notifications =
      notifications.map(
        function(notification){

          return {
            ...notification,
            seen:true
          };

        }
      );


    highlightedNotifications.clear();

  }
  catch(error){

    console.error(
      "ShoufHon mark all notifications:",
      error
    );

  }

}


/* =========================================================
   OPEN NOTIFICATIONS
========================================================= */

function openNotifications(){

  const panel =
    document.getElementById(
      "ma7alak-notification-panel"
    );


  if(!panel){
    return;
  }


  notificationsOpen =
    true;


  /*
     INSTANT OPEN:
     Never wait for Supabase before showing the panel.
  */
  panel.classList.add(
    "open"
  );


  renderNotifications();


  /*
     FACEBOOK-STYLE BADGE:
     Opening the bell acknowledges the current badge count only.
     It does NOT mark any notification row as read.
  */
  acknowledgeCurrentBadgeNotifications();


  /*
     Refresh in the background after the panel is already visible.
  */
  loadNotifications();


  /*
     Ask the live Reel embed for its newest state immediately too.
  */
  requestCurrentReelsState();

}


/* =========================================================
   CLOSE
========================================================= */

function closeNotifications(){

  const panel =
    document.getElementById(
      "ma7alak-notification-panel"
    );


  notificationsOpen =
    false;


  if(panel){

    panel.classList.remove(
      "open"
    );

  }


  notificationBadgeCount =
    calculateBadgeCount();


  updateNotificationBadge();

}


/* =========================================================
   DIRECT REEL REALTIME
   ---------------------------------------------------------
   The old notification system depended on the homepage Reel
   iframe/header bridge to notice a new Reel. Reels published
   from the Admin Panel now arrive directly from shop_reels,
   so we register the INSERT immediately here too.
========================================================= */

function registerRealtimeReelNotification(row){

  if(!row){
    return;
  }

  const reelId =
    String(row.reel_id || "").trim();

  if(!reelId){
    return;
  }

  const liveReel = {
    id:reelId,
    shop:String(row.shop_name || row.shop_slug || "Shop").trim(),
    shopUrl:String(row.shop_url || (row.shop_slug ? ("https://shoufhon.com/" + row.shop_slug) : "")).trim(),
    icon:String(row.shop_icon || "").trim(),
    video:String(row.video_url || "").trim()
  };

  const existingIds =
    normalizeStringArray(
      currentReelsState.reelIds || []
    );

  const nextIds =
    [reelId].concat(
      existingIds.filter(function(id){
        return id !== reelId;
      })
    );

  const existingCatalog =
    Array.isArray(currentReelsState.reels)
      ? currentReelsState.reels
      : [];

  const nextCatalog =
    [liveReel].concat(
      existingCatalog.filter(function(reel){
        return String(reel && reel.id ? reel.id : "").trim() !== reelId;
      })
    );

  currentReelsState = {
    reelIds:nextIds,
    reels:nextCatalog
  };

  try{
    localStorage.setItem(
      MA7ALAK_REELS_LIVE_CACHE_KEY,
      JSON.stringify(currentReelsState)
    );
  }
  catch(error){}

  const state =
    getReelNotificationState();

  /* If this visitor has never initialized Reel notifications,
     preserve the already-loaded Reels as the baseline but keep
     THIS realtime INSERT unread. */
  if(!state.initialized){

    state.initialized = true;

    const baseline =
      existingIds.filter(function(id){
        return id !== reelId;
      });

    state.known = baseline.slice();
    state.seen = baseline.slice();
  }

  if(!state.known.includes(reelId)){
    state.known.push(reelId);
  }

  /* New Reel must be unread so the red notification badge returns. */
  state.seen =
    state.seen.filter(function(id){
      return id !== reelId;
    });

  state.detectedAt[reelId] =
    row.created_at || new Date().toISOString();

  saveReelNotificationState(state);
}


/* =========================================================
   STORY + REEL REALTIME
========================================================= */

async function setupRealtime(){

  try{

    const client =
      await loadMa7alakSupabase();


    if(realtimeChannel){

      try{

        await client
          .removeChannel(
            realtimeChannel
          );

      }
      catch(error){}


      realtimeChannel =
        null;

    }


    realtimeChannel =
      client

        .channel(
          "ma7alak-global-story-notifications"
        )

        .on(
          "postgres_changes",
          {
            event:"INSERT",
            schema:"public",
            table:"shop_stories"
          },
          async function(){

            await loadNotifications();

          }
        )

        .on(
          "postgres_changes",
          {
            event:"INSERT",
            schema:"public",
            table:"shop_reels"
          },
          async function(payload){

            registerRealtimeReelNotification(
              payload && payload.new
                ? payload.new
                : null
            );

            await loadNotifications();

            /* Also ask the live Reel block to send its refreshed catalog. */
            requestCurrentReelsState();

          }
        )

        .on(
          "postgres_changes",
          {
            event:"INSERT",
            schema:"public",
            table:"shop_live_posts"
          },
          async function(){

            await loadNotifications();

          }
        )

        .subscribe(
          function(status){

            if(
              status === "CHANNEL_ERROR" ||
              status === "TIMED_OUT"
            ){

              setTimeout(
                function(){
                  setupRealtime();
                },
                1200
              );

            }

          }
        );

  }
  catch(error){

    console.error(
      "ShoufHon realtime notification error:",
      error
    );

  }

}


/* =========================================================
   LIVE REELS BRIDGE
   ---------------------------------------------------------
   The existing Header/Reels system already sends:
   MA7ALAK_REELS_STATE

   We listen to the SAME message here.
   No Reel panel code is changed.
========================================================= */

function setupReelNotificationBridge(){

  const cached =
    readReelsFromHeaderCache();

  if(cached.reelIds.length){

    syncReelNotificationState(
      cached.reelIds,
      cached.reels
    );

  }


  window.addEventListener(
    "message",
    function(event){

      if(
        !event.data ||
        event.data.type !==
          "MA7ALAK_REELS_STATE"
      ){
        return;
      }


      const reelIds =
        normalizeStringArray(
          event.data.reelIds || []
        );


      const reels =
        Array.isArray(
          event.data.reels
        )
          ? event.data.reels
          : [];


      if(!reelIds.length){
        return;
      }


      syncReelNotificationState(
        reelIds,
        reels
      );


      loadNotifications()
        .catch(function(){});

    }
  );


  /*
     Request the current Reel catalog from Hostinger/Reels embeds.
     This matches the existing header bridge and does not move/alter them.
  */
  setTimeout(
    requestCurrentReelsState,
    80
  );

}


/* =========================================================
   AUTO REFRESH
========================================================= */

function startNotificationRefresh(){

  if(refreshTimer){

    clearInterval(
      refreshTimer
    );

  }


  /*
     REALTIME is the primary path.
     This 2 minute refresh is only a recovery safety net in case Hostinger
     or the browser misses a realtime/message event. Hidden tabs do no work.
  */
  refreshTimer =
    setInterval(
      function(){

        if(document.visibilityState !== "visible"){
          return;
        }

        requestCurrentReelsState();

        loadNotifications()
          .catch(function(){});

      }, 120000 );

}


let lastSharedFollowingSignature = "";

function getSharedFollowingSignature(state){

  if(
    !state ||
    state.visitorId !== visitorId ||
    !Array.isArray(state.slugs)
  ){
    return "";
  }

  return state.slugs
    .map(function(value){
      return String(value || "").trim();
    })
    .filter(Boolean)
    .sort()
    .join("|");

}

window.addEventListener(
  "ma7alak:following-state",
  function(event){

    const state =
      (event && event.detail) ||
      window.Ma7alakFollowingState ||
      null;

    const signature =
      getSharedFollowingSignature(
        state
      );

    if(
      !signature &&
      lastSharedFollowingSignature === ""
    ){
      return;
    }

    if(
      signature ===
      lastSharedFollowingSignature
    ){
      return;
    }

    lastSharedFollowingSignature =
      signature;

    loadNotifications()
      .catch(function(){});

  }
);


/* =========================================================
   START
========================================================= */

async function startMa7alakNotifications(){

  try{

    createNotificationUI();

    /*
       Preload the shared Story viewer without blocking Notifications.
       By the time a Story row is tapped, viewer.open() can run directly
       inside the tap and request native fullscreen.
    */
    ensureNotificationStoryViewer().catch(function(){});

    await loadMa7alakSupabase();

    await loadShopProfiles();

    setupReelNotificationBridge();

    await loadNotifications();

    await setupRealtime();

    startNotificationRefresh();

  }
  catch(error){

    console.error(
      "ShoufHon notification startup:",
      error
    );

  }

}


let lastNotificationResumeRefreshAt = 0;

function refreshNotificationsAfterResume(){

  if(document.visibilityState !== "visible"){
    return;
  }

  const now = Date.now();

  if(
    now - lastNotificationResumeRefreshAt <
    1000
  ){
    return;
  }

  lastNotificationResumeRefreshAt = now;

  requestCurrentReelsState();

  loadNotifications()
    .catch(function(){});

}

document.addEventListener(
  "visibilitychange",
  function(){

    if(
      document.visibilityState ===
      "visible"
    ){
      refreshNotificationsAfterResume();
    }

  }
);

window.addEventListener(
  "focus",
  refreshNotificationsAfterResume
);

window.addEventListener(
  "ma7alak:page-wake",
  refreshNotificationsAfterResume
);


/* =========================================================
   START AFTER PAGE LOAD
========================================================= */

if(
  document.readyState ===
    "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    startMa7alakNotifications
  );

}
else{

  startMa7alakNotifications();

}



/* =========================================================
   V2 — LIVE / INSTANT / FACEBOOK-STYLE READ STATE
   =========================================================
   1. Bell panel opens immediately; no Supabase wait.
   2. Opening bell clears only the red number badge.
   3. Notification row highlight remains until that row is clicked.
   4. New Story/Reel/Live update gets a new signature and brings the badge back.
   5. Story realtime INSERT updates immediately.
   6. Reel state messages update immediately.
   7. 30s recovery refresh requests Story + Reel + Live state if an event is missed.
   8. Reel notification opens the exact Reel ID in the existing header viewer.
========================================================= */

})();


/* =========================================================
   WHAT CHANGED — STORY + REEL + LIVE SMART NOTIFICATIONS
   =========================================================
   1. Stories now use ONE notification row per shop.
   2. If the same shop posts again, its row updates to the newest Story.
   3. Opening Notifications marks the current row read and fades it.
   4. A later Story from that same shop makes the SAME row new/highlighted again.
   5. Reels now appear in the SAME notification panel.
   6. Reels use shop name + shop profile/icon + "added a new Reel".
   7. Reels also use ONE row per shop and update/re-highlight on a newer Reel.
   8. Existing Story realtime, 48-hour Story window, badge, bell shake,
      phone UI, shop profile images and existing Reel panel/header remain intact.
   9. Existing Reels are seeded as the baseline on first run, so deployment
      does not create fake notifications for old Reels.
========================================================= */


/* =========================================================
   EXACT REEL NOTIFICATION FIX
   - Notification rows now open the exact reel_id directly.
   - Removed random-first + video-URL matching/ArrowUp stepping path.
========================================================= */
