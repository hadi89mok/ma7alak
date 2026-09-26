/* =========================================================
 SHOUFHON FOLLOWING NOTIFICATION FILTER V7 — PERSONAL ACTIVITY SAFE
 - top-level page only
 - reuses shared Following state from premium header
 - falls back to the existing Follow RPC only when shared state is unavailable
 - notification timestamps come directly from notification DOM rows
 - MutationObserver never queries Story/Reel/Live tables
 - only activity created AFTER follow timestamp
 - existing shop-owner visibility behavior preserved
 - live badge recalculation preserved
========================================================= */
(function(){
"use strict";

if(window.self!==window.top)return;
if(window.__M7_FOLLOW_FILTER_V7__)return;
window.__M7_FOLLOW_FILTER_V7__=true;

const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

let c=null;
let mo=null;
let applyQueued=false;
let stateLoadInFlight=false;
let stateReloadQueued=false;
let stateReady=false;
let own="";
let followed=new Map();
let lastStateLoadAt=0;

function client(){
  return c||(
    c=
      window.Ma7alakAccount?.client||
      window.Ma7alakOwnerAuth?.client||
      (
        window.supabase?.createClient
          ? window.supabase.createClient(URL,KEY)
          : null
      )
  );
}

function visitor(){
  try{
    return localStorage.getItem("ma7alak_visitor_id")||"";
  }catch(_){
    return "";
  }
}

async function ownerSlug(){
  try{
    await window.Ma7alakOwnerAuth?.ready?.();
  }catch(_){}
  return String(
    window.Ma7alakOwnerAuth?.owner?.shop_slug||
    ""
  ).trim();
}

function mapSharedState(state){
  const vid=visitor();

  if(
    !state||
    state.visitorId!==vid||
    !Array.isArray(state.slugs)||
    !state.followedAt||
    typeof state.followedAt!=="object"
  ){
    return null;
  }

  const next=new Map();

  state.slugs.forEach(function(value){
    const slug=String(value||"").trim();
    const time=Number(state.followedAt[slug]||0);

    if(
      slug&&
      Number.isFinite(time)&&
      time>0
    ){
      next.set(slug,time);
    }
  });

  return next;
}

function consumeSharedState(state){
  const next=mapSharedState(state);

  if(!next){
    return false;
  }

  followed=next;
  stateReady=true;
  lastStateLoadAt=Date.now();
  queueApply();
  return true;
}

async function loadState(force){
  if(
    !force&&
    stateReady&&
    Date.now()-lastStateLoadAt<30000
  ){
    queueApply();
    return;
  }

  if(stateLoadInFlight){
    stateReloadQueued=true;
    return;
  }

  stateLoadInFlight=true;

  try{
    own=await ownerSlug();

    if(
      consumeSharedState(
        window.Ma7alakFollowingState
      )
    ){
      return;
    }

    const sb=client();
    const vid=visitor();

    if(!sb||!vid){
      return;
    }

    const result=await sb.rpc(
      "get_visitor_followed_shops",
      {p_visitor_id:vid}
    );

    if(result.error){
      throw result.error;
    }

    const next=new Map();

    (Array.isArray(result.data)?result.data:[])
      .forEach(function(row){
        if(!row){
          return;
        }

        const slug=
          typeof row==="string"
            ? row.trim()
            : String(
                row.shop_slug||
                row.p_shop_slug||
                row.slug||
                ""
              ).trim();

        const followedAt=
          typeof row==="string"
            ? 0
            : new Date(
                row.followed_at||
                row.created_at||
                0
              ).getTime();

        if(
          slug&&
          Number.isFinite(followedAt)&&
          followedAt>0
        ){
          next.set(slug,followedAt);
        }
      });

    followed=next;
    stateReady=true;
    lastStateLoadAt=Date.now();
    queueApply();

  }catch(error){
    console.warn(
      "SHOUFHON follow notification filter:",
      error
    );
  }finally{
    stateLoadInFlight=false;

    if(stateReloadQueued){
      stateReloadQueued=false;
      setTimeout(function(){
        loadState(true);
      },0);
    }
  }
}

function apply(){
  if(!stateReady){
    return;
  }

  const list=
    document.getElementById(
      "ma7alak-notification-list"
    );

  if(!list){
    return;
  }

  const rows=[
    ...list.querySelectorAll(
      ".ma7alak-notification-item"
    )
  ];

  rows.forEach(function(row){
    const slug=
      String(
        row.dataset.shopSlug||
        ""
      ).trim();

    const created=
      new Date(
        row.dataset.notificationCreatedAt||
        0
      ).getTime();

    const followedAt=
      followed.get(slug);

    const notificationType=
      String(
        row.dataset.notificationType||
        ""
      ).trim();

    const notificationKey=
      String(
        row.dataset.notificationKey||
        ""
      ).trim();

    /*
       Replies / comment likes are personal ACCOUNT notifications.
       They must not depend on Following state.
    */
    const personalActivity=
      notificationKey.startsWith("media-social:") ||
      notificationType==="media_reply" ||
      notificationType==="comment_like" ||
      notificationType==="owner_comment_like";

    const visible=
      personalActivity ||
      (
        !own&&
        !!followedAt&&
        Number.isFinite(created)&&
        created>followedAt
      );

    row.style.display=
      visible
        ? ""
        : "none";

    row.dataset.m7FollowVisible=
      visible
        ? "1"
        : "0";
  });

  const visibleRows=
    rows.filter(function(row){
      return (
        row.dataset.m7FollowVisible===
        "1"
      );
    });

  const unread=
    visibleRows.filter(function(row){
      return row.classList.contains(
        "highlighted"
      );
    }).length;

  const badge=
    document.getElementById(
      "ma7alak-notification-badge"
    );

  if(badge){
    badge.textContent=
      unread>99
        ? "99+"
        : unread
          ? String(unread)
          : "";

    badge.classList.toggle(
      "visible",
      unread>0
    );
  }

  /*
     Never append a second explanatory empty message below the notification
     engine. Keep exactly one compact empty state in the panel.
  */
  list
    .querySelector(
      ".m7-follow-filter-empty"
    )
    ?.remove();

  let empty=
    list.querySelector(
      "#ma7alak-notification-empty"
    );

  if(!visibleRows.length){
    if(!empty){
      empty=document.createElement("div");
      empty.id="ma7alak-notification-empty";
      empty.innerHTML=
        '<div class="ma7alak-notification-empty-icon">🔔</div>'+
        '<div class="ma7alak-notification-empty-title">No notifications</div>'+
        '<div class="ma7alak-notification-empty-text">You\'re all caught up.</div>';

      const more=
        list.querySelector(
          "#ma7alak-notification-more"
        );

      if(more){
        more.before(empty);
      }else{
        list.appendChild(empty);
      }
    }
  }else if(empty){
    empty.remove();
  }
}

function queueApply(){
  if(applyQueued){
    return;
  }

  applyQueued=true;

  requestAnimationFrame(function(){
    applyQueued=false;
    apply();
  });
}

function watch(){
  const list=
    document.getElementById(
      "ma7alak-notification-list"
    );

  if(!list){
    return;
  }

  if(mo?.__target===list){
    queueApply();
    return;
  }

  try{
    mo?.disconnect();
  }catch(_){}

  mo=new MutationObserver(
    queueApply
  );

  mo.__target=list;

  mo.observe(
    list,
    {childList:true}
  );

  queueApply();
}

function schedule(){
  [0,120,450].forEach(function(ms){
    setTimeout(function(){
      watch();
      queueApply();
    },ms);
  });
}

function refreshIfStale(){
  if(
    !stateReady||
    Date.now()-lastStateLoadAt>=30000
  ){
    loadState(false);
  }else{
    queueApply();
  }
}

document.addEventListener(
  "click",
  function(event){
    if(
      event.target.closest?.(
        "#ma7alak-notification-bell,#ma7alak-see-previous"
      )
    ){
      schedule();
      refreshIfStale();
    }
  },
  true
);

window.addEventListener(
  "message",
  function(event){
    if(
      event.data?.type===
        "MA7ALAK_FOLLOW_CHANGED"||
      event.data?.type===
        "MA7ALAK_FOLLOW_STATE_CHANGED"
    ){
      loadState(true);
    }
  }
);

window.addEventListener(
  "ma7alak:follow-change",
  function(){
    loadState(true);
  }
);

window.addEventListener(
  "ma7alak:following-state",
  function(event){
    own=String(
      window.Ma7alakOwnerAuth?.owner?.shop_slug||
      own||
      ""
    ).trim();

    if(
      !consumeSharedState(
        event?.detail||
        window.Ma7alakFollowingState
      )
    ){
      loadState(true);
    }
  }
);

window.addEventListener(
  "ma7alak:owner-auth-change",
  function(){
    loadState(true);
  }
);

window.addEventListener(
  "focus",
  refreshIfStale
);

document.addEventListener(
  "visibilitychange",
  function(){
    if(!document.hidden){
      refreshIfStale();
    }
  }
);

function start(){
  schedule();
  loadState(true);
}

if(document.readyState==="loading"){
  document.addEventListener(
    "DOMContentLoaded",
    function(){
      setTimeout(start,500);
    },
    {once:true}
  );
}else{
  setTimeout(start,500);
}

})();