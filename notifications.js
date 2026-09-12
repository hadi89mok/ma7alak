(function(){

"use strict";


/* =========================================================
   SUPABASE
========================================================= */

const MA7ALAK_SUPABASE_URL =
  "https://wdtaiuwtqdepzdamgsrs.supabase.co";

const MA7ALAK_SUPABASE_KEY =
  "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


let ma7alakSupabase = null;

let ma7alakSupabaseLoading = null;


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
        "Ma7alak shop profiles:",
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
      "Ma7alak shop profile loading failed:",
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

let highlightedStories =
  new Set();


/*
   Badge is completely separate from highlight.

   This allows:

   badge = 0

   while notifications are still highlighted.
*/

let notificationBadgeCount = 0;


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
      620px,
      calc(100vh - 90px)
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
   LOAD NOTIFICATIONS
========================================================= */

async function loadNotifications(){

  try{

    const client =
      await loadMa7alakSupabase();


    /*
       Notifications older than 48 hours
       automatically disappear.

       The 48-hour cutoff is calculated
       every time notifications are loaded.
    */

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
        "Ma7alak notifications stories:",
        storiesError
      );

      return;

    }


    const activeStories =
      stories || [];


    if(
      activeStories.length === 0
    ){

      notifications = [];

      notificationBadgeCount = 0;

      highlightedStories.clear();

      showAllNotifications = false;

      updateNotificationBadge();

      renderNotifications();

      return;

    }


    /* -------------------------------------------------------
       GET SEEN STORIES
    ------------------------------------------------------- */

    const storyIds =
      activeStories.map(
        function(story){

          return story.id;

        }
      );


    const {
      data:seenRows,
      error:seenError
    } = await client

      .from(
        "story_notification_views"
      )

      .select(
        "story_id,seen_at"
      )

      .eq(
        "visitor_id",
        visitorId
      )

      .in(
        "story_id",
        storyIds
      );


    if(seenError){

      console.error(
        "Ma7alak notification views:",
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


    /* -------------------------------------------------------
       BUILD NOTIFICATIONS
    ------------------------------------------------------- */

    notifications =
      activeStories.map(
        function(story){

          return {
            ...story,

            seen:
              seenSet.has(
                story.id
              )

          };

        }
      );
        /*
       Only ADD new highlights.

       NEVER clear existing highlights here.

       This means refreshing data cannot
       accidentally remove individual highlights.
    */

    notifications.forEach(
      function(story){

        if(
          !story.seen
        ){

          highlightedStories.add(
            String(
              story.id
            )
          );

        }

      }
    );


    /*
       Remove highlights ONLY for stories
       that are no longer in the 48-hour
       notification list.
    */

    const activeIdSet =
      new Set(
        activeStories.map(
          function(story){

            return String(
              story.id
            );

          }
        )
      );


    highlightedStories =
      new Set(
        Array.from(
          highlightedStories
        ).filter(
          function(id){

            return activeIdSet.has(
              id
            );

          }
        )
      );


    /*
       Badge.

       If panel is open:
       badge stays zero.

       If panel is closed:
       unseen stories create badge.
    */

    if(
      notificationsOpen
    ){

      notificationBadgeCount =
        0;

    }
    else{

      notificationBadgeCount =
        notifications.filter(
          function(story){

            return !story.seen;

          }
        ).length;

    }


    updateNotificationBadge();

    renderNotifications();


    /*
       Refresh shop profile data so
       every notification has the
       correct image and name.
    */

    await loadShopProfiles();

  }
  catch(error){

    console.error(
      "Ma7alak notifications error:",
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


  /*
     FACEBOOK-STYLE DISPLAY

     Default:
     show only the latest 6.

     After clicking
     "See previous notifications":
     show everything.
  */

  const visibleNotifications =
    showAllNotifications
      ? notifications
      : notifications.slice(
          0,
          6
        );


  list.innerHTML =
    visibleNotifications
      .map(
        function(story){

          const storyId =
            String(
              story.id
            );


          /*
             Highlight is controlled ONLY
             by this specific story ID.
          */

          const highlighted =
            highlightedStories.has(
              storyId
            );


          const shopName =
            getShopName(
              story.shop_slug
            );


          const shopImage =
            getShopProfileImage(
              story.shop_slug
            );


          const time =
            formatNotificationTime(
              story.created_at
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
                      '<span class=&quot;fallback-emoji&quot;>🔥</span>'
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
                🔥
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
              data-story-id="${escapeAttribute(storyId)}"
              data-shop-slug="${escapeAttribute(story.shop_slug)}"
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

                  added a new story

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


  /*
     SEE PREVIOUS NOTIFICATIONS

     Only shown when there are more
     than 6 notifications.
  */

  if(
    !showAllNotifications &&
    notifications.length > 6
  ){

    const seePrevious =
      document.createElement(
        "button"
      );


    seePrevious.type =
      "button";


    seePrevious.className =
      "ma7alak-see-previous";


    seePrevious.textContent =
      "See previous notifications";


    seePrevious.addEventListener(
      "click",
      function(event){

        event.preventDefault();

        event.stopPropagation();


        showAllNotifications =
          true;


        renderNotifications();

      }
    );


    list.appendChild(
      seePrevious
    );

  }


  /* -------------------------------------------------------
     CLICK EACH NOTIFICATION
  ------------------------------------------------------- */

  list
    .querySelectorAll(
      ".ma7alak-notification-item"
    )
    .forEach(
      function(item){

        item.addEventListener(
          "click",
          async function(){

            const storyId =
              String(
                item.dataset.storyId
              );


            const shopSlug =
              item.dataset.shopSlug;


            /*
               Remove ONLY this story's
               highlight.
            */

            highlightedStories.delete(
              storyId
            );


            /*
               Mark ONLY this story as seen.
            */

            await markSingleStoryAsSeen(
              storyId
            );


            /*
               Other highlighted
               notifications remain highlighted.
            */

            renderNotifications();


            /*
               Open the shop.
            */

            if(shopSlug){

              window.location.href =
                "/" +
                encodeURIComponent(
                  shopSlug
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


    await client
      .from(
        "story_notification_views"
      )
      .upsert(
        {
          visitor_id:
            visitorId,

          story_id:
            Number(
              storyId
            )
        },
        {
          onConflict:
            "visitor_id,story_id",

          ignoreDuplicates:
            true
        }
      );

  }
  catch(error){

    console.error(
      "Ma7alak mark notification:",
      error
    );

  }

}


/* =========================================================
   OPEN NOTIFICATIONS
========================================================= */

async function openNotifications(){

  const panel =
    document.getElementById(
      "ma7alak-notification-panel"
    );


  if(
    !panel
  ){

    return;

  }


  notificationsOpen =
    true;


  /*
     INSTANT OPEN:

     Open the panel immediately using whatever
     notification data is already in memory.

     Do NOT wait for Supabase before showing it.
  */

  notificationBadgeCount =
    0;


  updateNotificationBadge();

  renderNotifications();


  panel.classList.add(
    "open"
  );


  /*
     Refresh latest notifications in the background.

     This keeps the button feeling instant while still
     updating the panel with fresh Supabase data.
  */

  try{

    await loadNotifications();


    if(
      notificationsOpen
    ){

      notificationBadgeCount =
        0;


      updateNotificationBadge();

      renderNotifications();

    }

  }
  catch(error){

    console.error(
      "Ma7alak instant notification refresh:",
      error
    );

  }

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


  /*
     Keep badge at zero after
     opening notifications.

     A new story will create
     a new badge.
  */

  notificationBadgeCount =
    0;


  updateNotificationBadge();

}


/* =========================================================
   REALTIME
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

            /*
               New story.

               Reload everything.
            */

            await loadNotifications();


            /*
               If panel is open:
               no badge.

               If panel is closed:
               show badge.
            */

            if(
              notificationsOpen
            ){

              notificationBadgeCount =
                0;

            }
            else{

              notificationBadgeCount =
                notifications.filter(
                  function(story){

                    return !story.seen;

                  }
                ).length;

            }


            updateNotificationBadge();

            renderNotifications();

          }
        )

        .subscribe();

  }
  catch(error){

    console.error(
      "Ma7alak realtime notification error:",
      error
    );

  }

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
     Refresh every minute.

     This also automatically removes
     notifications that pass the 48-hour
     cutoff.
  */

  refreshTimer =
    setInterval(
      async function(){

        await loadNotifications();


        if(
          notificationsOpen
        ){

          notificationBadgeCount =
            0;

        }
        else{

          notificationBadgeCount =
            notifications.filter(
              function(story){

                return !story.seen;

              }
            ).length;

        }


        updateNotificationBadge();

      },
      60000
    );

}


/* =========================================================
   START
========================================================= */

async function startMa7alakNotifications(){

  try{

    createNotificationUI();

    await loadMa7alakSupabase();

    await loadShopProfiles();

    await loadNotifications();

    await setupRealtime();

    startNotificationRefresh();

  }
  catch(error){

    console.error(
      "Ma7alak notification startup:",
      error
    );

  }

}


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
   END NOTIFICATIONS
========================================================= */

})();

/* =========================================================
   WHAT CHANGED
   =========================================================

   1. Notification panel now opens instantly when the bell is pressed.
   2. It no longer waits for Supabase/network requests before becoming visible.
   3. Existing notifications render immediately.
   4. Fresh notifications still load from Supabase in the background.
   5. All other notification behavior remains unchanged.
========================================================= */
