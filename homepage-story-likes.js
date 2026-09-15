(function(){

  "use strict";

  /* =========================================================
     SUPABASE
  ========================================================= */

  const MA7ALAK_LIKE_SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const MA7ALAK_LIKE_SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  let ma7alakLikeSupabase = null;
  let ma7alakLikeSupabaseLoading = null;

  let ma7alakLikeOwnerShopSlug = null;
  let ma7alakLikeNotifications = [];
  let ma7alakLikePanelOpen = false;
  let ma7alakLikeRealtimeChannel = null;
  let ma7alakLikeRefreshTimer = null;


  /* =========================================================
     LOAD SUPABASE
  ========================================================= */

  function loadMa7alakLikeSupabase(){

    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){

      if(!ma7alakLikeSupabase){

        ma7alakLikeSupabase =
          window.supabase.createClient(
            MA7ALAK_LIKE_SUPABASE_URL,
            MA7ALAK_LIKE_SUPABASE_KEY
          );

      }

      return Promise.resolve(
        ma7alakLikeSupabase
      );

    }


    if(ma7alakLikeSupabaseLoading){

      return ma7alakLikeSupabaseLoading;

    }


    ma7alakLikeSupabaseLoading =
      new Promise(function(resolve,reject){

        const script =
          document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.async = true;

        script.onload =
          function(){

            try{

              ma7alakLikeSupabase =
                window.supabase.createClient(
                  MA7ALAK_LIKE_SUPABASE_URL,
                  MA7ALAK_LIKE_SUPABASE_KEY
                );

              resolve(
                ma7alakLikeSupabase
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

      });


    return ma7alakLikeSupabaseLoading;

  }


  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");

  }


  /* =========================================================
     TIME
  ========================================================= */

  function formatLikeTime(dateString){

    const date =
      new Date(dateString);

    if(
      isNaN(date.getTime())
    ){

      return "";

    }

    let seconds =
      Math.floor(
        (
          Date.now() -
          date.getTime()
        ) / 1000
      );

    if(seconds < 0){

      seconds = 0;

    }


    if(seconds < 60){

      return "Just now";

    }


    const minutes =
      Math.floor(
        seconds / 60
      );


    if(minutes < 60){

      return minutes + "m ago";

    }


    const hours =
      Math.floor(
        minutes / 60
      );


    if(hours < 24){

      return hours + "h ago";

    }


    const days =
      Math.floor(
        hours / 24
      );


    if(days < 7){

      return days + "d ago";

    }


    return date.toLocaleDateString(
      "en-US",
      {
        month:"short",
        day:"numeric"
      }
    );

  }


  /* =========================================================
     CSS
  ========================================================= */

  function injectLikeCSS(){

    if(
      document.getElementById(
        "ma7alak-story-likes-style"
      )
    ){

      return;

    }


    const style =
      document.createElement("style");

    style.id =
      "ma7alak-story-likes-style";


    style.textContent = `

      #ma7alak-story-likes-wrapper{

        position:fixed;

        top:
          max(
            18px,
            env(safe-area-inset-top)
          );

        right:78px;

        z-index:2147483646;

        font-family:
          Arial,
          "Segoe UI",
          sans-serif;

      }


      #ma7alak-story-likes-button{

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
          background .18s ease,
          color .18s ease;

        -webkit-tap-highlight-color:
          transparent;

      }


      #ma7alak-story-likes-button:hover{

        transform:
          translateY(-2px);

        border-color:
          rgba(229,57,53,.75);

        background:
          rgba(28,28,28,.96);

      }


      #ma7alak-story-likes-button:active{

        transform:
          scale(.92);

      }


      #ma7alak-story-likes-icon{

        width:24px;

        height:24px;

        display:block;

        transition:
          fill .2s ease,
          color .2s ease,
          transform .2s ease;

      }


      /*
         NEW LIKE
         Keep the heart visually NORMAL.
         Only the notification number badge shows new likes.
      */

      #ma7alak-story-likes-button.has-new{

        color:#fff;

        border-color:
          rgba(217,164,65,.28);

        animation:none;

      }


      #ma7alak-story-likes-button.has-new
      #ma7alak-story-likes-icon{

        fill:none;

        color:#fff;

        transform:none;

      }


      @keyframes ma7alakLikePulse{

        0%,
        100%{

          transform:
            scale(1);

          box-shadow:
            0 8px 30px
            rgba(0,0,0,.35),
            0 0 0 0
            rgba(255,45,85,.00);

        }

        50%{

          transform:
            scale(1.08);

          box-shadow:
            0 8px 30px
            rgba(0,0,0,.35),
            0 0 0 10px
            rgba(255,45,85,.00);

        }

      }


      /*
         BADGE
      */

      #ma7alak-story-likes-badge{

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

        background:#e53935;

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


      #ma7alak-story-likes-badge.visible{

        display:flex;

      }


      /*
         PANEL
      */

      #ma7alak-story-likes-panel{

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
          rgba(229,57,53,.20);

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


      #ma7alak-story-likes-panel.open{

        display:flex;

        animation:
          ma7alakLikePanelIn
          .22s
          cubic-bezier(.2,.8,.2,1);

      }


      @keyframes ma7alakLikePanelIn{

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


      /*
         HEADER
      */

      #ma7alak-story-likes-header{

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


      #ma7alak-story-likes-title{

        margin:0;

        padding:0;

        color:#fff;

        font-size:19px;

        line-height:1.2;

        font-weight:900;

        letter-spacing:-.3px;

      }


      #ma7alak-story-likes-close{

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

      }


      /*
         LIST
      */

      #ma7alak-story-likes-list{

        flex:1;

        min-height:0;

        overflow-y:auto;

        overflow-x:hidden;

        overscroll-behavior:contain;

        -webkit-overflow-scrolling:touch;

        touch-action:pan-y;

        padding:7px;

      }


      /*
         ITEM
      */

      .ma7alak-story-like-item{

        display:flex;

        align-items:center;

        gap:12px;

        width:100%;

        box-sizing:border-box;

        padding:13px 12px;

        margin:2px 0;

        border-radius:15px;

        background:
          transparent;

      }


      .ma7alak-story-like-item.unseen{

        background:
          rgba(255,45,85,.09);

      }


      .ma7alak-story-like-icon{

        width:44px;

        height:44px;

        flex-shrink:0;

        display:flex;

        align-items:center;

        justify-content:center;

        border-radius:50%;

        background:
          rgba(255,45,85,.10);

        border:
          1px solid
          rgba(255,45,85,.22);

        color:#ff2d55;

      }


      .ma7alak-story-like-icon svg{

        width:21px;

        height:21px;

        display:block;

        fill:#ff2d55;

      }


      .ma7alak-story-like-content{

        min-width:0;

        flex:1;

      }


      .ma7alak-story-like-message{

        margin:0;

        padding:0;

        color:
          rgba(255,255,255,.92);

        font-size:13px;

        line-height:1.45;

        font-weight:600;

      }


      .ma7alak-story-like-message strong{

        color:#fff;

        font-weight:900;

      }


      .ma7alak-story-like-time{

        margin-top:5px;

        color:
          rgba(255,255,255,.40);

        font-size:11px;

        line-height:1;

      }


      .ma7alak-story-like-unseen-dot{

        width:8px;

        height:8px;

        flex-shrink:0;

        border-radius:50%;

        background:#ff2d55;

        box-shadow:
          0 0 0 3px
          rgba(255,45,85,.09);

      }


      .ma7alak-story-like-item:not(.unseen)
      .ma7alak-story-like-unseen-dot{

        display:none;

      }


      /*
         EMPTY
      */

      .ma7alak-story-like-empty{

        padding:
          42px 20px;

        text-align:center;

      }


      .ma7alak-story-like-empty-heart{

        font-size:32px;

        margin-bottom:10px;

      }


      .ma7alak-story-like-empty-title{

        color:
          rgba(255,255,255,.82);

        font-size:14px;

        font-weight:800;

      }


      .ma7alak-story-like-empty-text{

        margin-top:6px;

        color:
          rgba(255,255,255,.35);

        font-size:11px;

      }


      /*
         STORY THUMBNAIL
      */

      .ma7alak-story-like-thumbnail-wrap{
        width:52px;
        height:68px;
        flex:0 0 52px;
        overflow:hidden;
        border-radius:10px;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.10);
        box-shadow:0 5px 18px rgba(0,0,0,.28);
      }

      .ma7alak-story-like-thumbnail,
      .ma7alak-story-like-thumbnail-fallback{
        display:block;
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .ma7alak-story-like-thumbnail-fallback{
        display:flex;
        align-items:center;
        justify-content:center;
        color:rgba(255,255,255,.55);
        font-size:22px;
      }


      @media(max-width:600px){

        #ma7alak-story-likes-wrapper{

          top:
            max(
              12px,
              env(safe-area-inset-top)
            );

          right:68px;

        }


        #ma7alak-story-likes-button{

          width:46px;

          height:46px;

        }


        #ma7alak-story-likes-panel{

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

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================================
     CREATE UI
  ========================================================= */

  function createLikeUI(){

    if(
      document.getElementById(
        "ma7alak-story-likes-wrapper"
      )
    ){

      return;

    }


    injectLikeCSS();


    const wrapper =
      document.createElement("div");

    wrapper.id =
      "ma7alak-story-likes-wrapper";


    const button =
      document.createElement("button");

    button.id =
      "ma7alak-story-likes-button";

    button.type =
      "button";

    button.setAttribute(
      "aria-label",
      "Story likes"
    );


    button.innerHTML = `

      <svg
        id="ma7alak-story-likes-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >

        <path
          d="
            M20.84 4.61
            C19.32 3.09
             16.88 3.09
             15.36 4.61
            L12 7.97
            L8.64 4.61
            C7.12 3.09
             4.68 3.09
             3.16 4.61
            C0.05 7.72
             1.49 12.81
             4.6 15.92
            L12 23
            L19.4 15.92
            C22.51 12.81
             23.95 7.72
             20.84 4.61
            Z
          "
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />

      </svg>

      <span
        id="ma7alak-story-likes-badge"
      ></span>

    `;


    wrapper.appendChild(
      button
    );


    document.body.appendChild(
      wrapper
    );


    const panel =
      document.createElement("div");

    panel.id =
      "ma7alak-story-likes-panel";


    panel.innerHTML = `

      <div
        id="ma7alak-story-likes-header"
      >

        <h2
          id="ma7alak-story-likes-title"
        >
          Story Likes
        </h2>

        <button
          id="ma7alak-story-likes-close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>

      </div>


      <div
        id="ma7alak-story-likes-list"
      ></div>

    `;


    document.body.appendChild(
      panel
    );


    button.addEventListener(
      "click",
      async function(event){

        event.stopPropagation();

        if(
          ma7alakLikePanelOpen
        ){

          closeLikePanel();

        }
        else{

          await openLikePanel();

        }

      }
    );


    document
      .getElementById(
        "ma7alak-story-likes-close"
      )
      .addEventListener(
        "click",
        function(event){

          event.stopPropagation();

          closeLikePanel();

        }
      );


    document.addEventListener(
      "click",
      function(event){

        if(
          !ma7alakLikePanelOpen
        ){

          return;

        }


        if(
          panel.contains(event.target) ||
          wrapper.contains(event.target)
        ){

          return;

        }


        closeLikePanel();

      }
    );


    document.addEventListener(
      "keydown",
      function(event){

        if(
          event.key === "Escape" &&
          ma7alakLikePanelOpen
        ){

          closeLikePanel();

        }

      }
    );

  }


  /* =========================================================
     REMOVE UI
     Non-owners should see nothing.
  ========================================================= */

  function removeLikeUI(){

    const wrapper =
      document.getElementById(
        "ma7alak-story-likes-wrapper"
      );

    const panel =
      document.getElementById(
        "ma7alak-story-likes-panel"
      );

    if(wrapper){

      wrapper.remove();

    }

    if(panel){

      panel.remove();

    }

    ma7alakLikePanelOpen =
      false;

  }


  /* =========================================================
     CHECK OWNER
  ========================================================= */

  async function checkLikeOwner(){

    try{

      const client =
        await loadMa7alakLikeSupabase();


      const sessionResult =
        await client.auth.getSession();


      const session =
        sessionResult &&
        sessionResult.data &&
        sessionResult.data.session;


      if(!session){

        ma7alakLikeOwnerShopSlug =
          null;

        removeLikeUI();

        return false;

      }


      const ownerResult =
        await client
          .from("shop_owners")
          .select("shop_slug")
          .eq(
            "user_id",
            session.user.id
          )
          .limit(1)
          .maybeSingle();


      if(
        ownerResult.error ||
        !ownerResult.data ||
        !ownerResult.data.shop_slug
      ){

        ma7alakLikeOwnerShopSlug =
          null;

        removeLikeUI();

        return false;

      }


      ma7alakLikeOwnerShopSlug =
        ownerResult.data.shop_slug;


      createLikeUI();

      return true;

    }
    catch(error){

      console.error(
        "Ma7alak story likes owner check:",
        error
      );

      ma7alakLikeOwnerShopSlug =
        null;

      removeLikeUI();

      return false;

    }

  }


  /* =========================================================
     LOAD OWNER NOTIFICATIONS
  ========================================================= */

  async function loadLikeNotifications(){

    try{

      if(
        !ma7alakLikeOwnerShopSlug
      ){

        return;

      }


      const client =
        await loadMa7alakLikeSupabase();


      const result =
        await client.rpc(
          "get_owner_story_like_notifications"
        );


      if(result.error){

        console.error(
          "Ma7alak story likes load:",
          result.error
        );

        return;

      }


      ma7alakLikeNotifications =
        Array.isArray(result.data)
          ? result.data
          : [];


      updateLikeButton();

      renderLikeNotifications();

    }
    catch(error){

      console.error(
        "Ma7alak story likes load error:",
        error
      );

    }

  }


  /* =========================================================
     UPDATE BUTTON
  ========================================================= */

  function updateLikeButton(){

    const button =
      document.getElementById(
        "ma7alak-story-likes-button"
      );

    const badge =
      document.getElementById(
        "ma7alak-story-likes-badge"
      );


    if(
      !button ||
      !badge
    ){

      return;

    }


    /*
       LOGIN/REFRESH SAFETY:
       Always reset the heart itself to its normal outline state.
       The badge below remains the only new-like visual indicator.
    */
    const heartIcon =
      document.getElementById(
        "ma7alak-story-likes-icon"
      );

    button.style.color = "#fff";
    button.style.animation = "none";

    if(heartIcon){
      heartIcon.style.fill = "none";
      heartIcon.style.color = "#fff";
      heartIcon.style.transform = "none";
    }


    const unseenCount =
      ma7alakLikeNotifications.filter(
        function(item){

          return item &&
            item.seen === false;

        }
      ).length;


    if(unseenCount > 0){

      button.classList.add(
        "has-new"
      );


      badge.textContent =
        unseenCount > 99
          ? "99+"
          : String(
              unseenCount
            );


      badge.classList.add(
        "visible"
      );

    }
    else{

      button.classList.remove(
        "has-new"
      );


      badge.textContent =
        "";

      badge.classList.remove(
        "visible"
      );

    }

  }


  /* =========================================================
     RENDER
     Group likes from the same story into ONE notification.
     Each group includes the actual story thumbnail.
  ========================================================= */

  function ma7alakLikeMediaUrl(storagePath){

    if(!storagePath){
      return "";
    }

    return (
      MA7ALAK_LIKE_SUPABASE_URL +
      "/storage/v1/object/public/shop-stories/" +
      String(storagePath)
        .split("/")
        .map(function(part){
          return encodeURIComponent(part);
        })
        .join("/")
    );
  }


  function groupLikeNotificationsByStory(){

    const groups = new Map();

    ma7alakLikeNotifications.forEach(
      function(item){

        if(!item || item.story_id == null){
          return;
        }

        const storyId =
          String(item.story_id);

        if(!groups.has(storyId)){
          groups.set(
            storyId,
            {
              story_id: storyId,
              shop_slug: item.shop_slug || "",
              media_type: item.media_type || "",
              storage_path: item.storage_path || "",
              created_at: item.created_at,
              seen: true,
              like_count: 0
            }
          );
        }

        const group =
          groups.get(storyId);

        group.like_count += 1;

        if(item.seen === false){
          group.seen = false;
        }

        if(
          item.created_at &&
          (
            !group.created_at ||
            new Date(item.created_at) >
              new Date(group.created_at)
          )
        ){
          group.created_at = item.created_at;
        }

        if(
          !group.storage_path &&
          item.storage_path
        ){
          group.storage_path =
            item.storage_path;
        }

        if(
          !group.media_type &&
          item.media_type
        ){
          group.media_type =
            item.media_type;
        }
      }
    );

    return Array.from(groups.values()).sort(
      function(a,b){
        return new Date(b.created_at) -
          new Date(a.created_at);
      }
    );
  }


  function renderLikeNotifications(){

    const list =
      document.getElementById(
        "ma7alak-story-likes-list"
      );

    if(!list){
      return;
    }

    if(
      ma7alakLikeNotifications.length === 0
    ){
      list.innerHTML = `

        <div
          class="ma7alak-story-like-empty"
        >

          <div
            class="ma7alak-story-like-empty-heart"
          >
            ♡
          </div>

          <div
            class="ma7alak-story-like-empty-title"
          >
            No story likes yet
          </div>

          <div
            class="ma7alak-story-like-empty-text"
          >
            Likes on your stories will appear here.
          </div>

        </div>

      `;

      return;
    }


    const groups =
      groupLikeNotificationsByStory();


    list.innerHTML =
      groups
        .map(
          function(item){

            const unseen =
              item.seen === false;

            const time =
              formatLikeTime(
                item.created_at
              );

            const count =
              Number(item.like_count) || 0;

            const likeText =
              count === 1
                ? "Someone liked your story"
                : `${count} people liked your story`;

            const mediaUrl =
              ma7alakLikeMediaUrl(
                item.storage_path
              );

            const type =
              String(
                item.media_type || ""
              ).toLowerCase();

            let mediaHTML = "";

            if(mediaUrl && type === "video"){
              mediaHTML = `
                <video
                  class="ma7alak-story-like-thumbnail"
                  src="${escapeHtml(mediaUrl)}"
                  muted
                  playsinline
                  preload="metadata"
                  aria-label="Story preview"
                ></video>
              `;
            }
            else if(mediaUrl){
              mediaHTML = `
                <img
                  class="ma7alak-story-like-thumbnail"
                  src="${escapeHtml(mediaUrl)}"
                  alt="Story preview"
                  loading="lazy"
                >
              `;
            }
            else{
              mediaHTML = `
                <div
                  class="ma7alak-story-like-thumbnail-fallback"
                >
                  ♡
                </div>
              `;
            }

            return `

              <div
                class="ma7alak-story-like-item ${unseen ? "unseen" : ""}"
                data-story-id="${escapeHtml(item.story_id)}"
              >

                <div
                  class="ma7alak-story-like-icon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="
                        M20.84 4.61
                        C19.32 3.09
                         16.88 3.09
                         15.36 4.61
                        L12 7.97
                        L8.64 4.61
                        C7.12 3.09
                         4.68 3.09
                         3.16 4.61
                        C0.05 7.72
                         1.49 12.81
                         4.6 15.92
                        L12 23
                        L19.4 15.92
                        C22.51 12.81
                         23.95 7.72
                         20.84 4.61
                        Z
                      "
                    />
                  </svg>
                </div>


                <div
                  class="ma7alak-story-like-content"
                >

                  <p
                    class="ma7alak-story-like-message"
                  >
                    <strong>
                      ${escapeHtml(likeText)}
                    </strong>
                  </p>

                  <div
                    class="ma7alak-story-like-time"
                  >
                    ${escapeHtml(time)}
                  </div>

                </div>


                <div
                  class="ma7alak-story-like-thumbnail-wrap"
                >
                  ${mediaHTML}
                </div>


                <div
                  class="ma7alak-story-like-unseen-dot"
                ></div>

              </div>

            `;
          }
        )
        .join("");
  }


  /* =========================================================
     OPEN PANEL
     Opening it marks this owner's notifications seen.
  ========================================================= */

  async function openLikePanel(){

    const panel =
      document.getElementById(
        "ma7alak-story-likes-panel"
      );


    if(!panel){

      return;

    }


    ma7alakLikePanelOpen =
      true;


    panel.classList.add(
      "open"
    );


    await loadLikeNotifications();


    try{

      const client =
        await loadMa7alakLikeSupabase();


      const result =
        await client.rpc(
          "mark_owner_story_like_notifications_seen"
        );


      if(result.error){

        console.error(
          "Ma7alak mark story likes seen:",
          result.error
        );

      }
      else{

        /*
           Immediately remove the red pulse.
        */

        ma7alakLikeNotifications =
          ma7alakLikeNotifications.map(
            function(item){

              return {
                ...item,
                seen:true
              };

            }
          );


        updateLikeButton();

        renderLikeNotifications();

      }

    }
    catch(error){

      console.error(
        "Ma7alak mark story likes error:",
        error
      );

    }

  }


  /* =========================================================
     CLOSE PANEL
  ========================================================= */

  function closeLikePanel(){

    const panel =
      document.getElementById(
        "ma7alak-story-likes-panel"
      );


    ma7alakLikePanelOpen =
      false;


    if(panel){

      panel.classList.remove(
        "open"
      );

    }

  }


  /* =========================================================
     REALTIME
     Listen for new rows in story_like_notifications.
  ========================================================= */

  async function setupLikeRealtime(){

    try{

      const client =
        await loadMa7alakLikeSupabase();


      if(ma7alakLikeRealtimeChannel){

        try{

          await client.removeChannel(
            ma7alakLikeRealtimeChannel
          );

        }
        catch(error){}

        ma7alakLikeRealtimeChannel =
          null;

      }


      ma7alakLikeRealtimeChannel =
        client
          .channel(
            "ma7alak-owner-story-likes"
          )
          .on(
            "postgres_changes",
            {
              event:"INSERT",
              schema:"public",
              table:"story_like_notifications"
            },
            async function(payload){

              const row =
                payload &&
                payload.new;


              if(
                !row ||
                !row.shop_slug ||
                row.shop_slug !==
                  ma7alakLikeOwnerShopSlug
              ){

                return;

              }


              /*
                 New like for THIS owner.
              */

              await loadLikeNotifications();

            }
          )
          .subscribe();

    }
    catch(error){

      console.error(
        "Ma7alak story likes realtime:",
        error
      );

    }

  }


  /* =========================================================
     FALLBACK REFRESH
     Every 5 seconds in case Realtime is delayed.
  ========================================================= */

  function startLikeRefresh(){

    if(ma7alakLikeRefreshTimer){

      clearInterval(
        ma7alakLikeRefreshTimer
      );

    }


    ma7alakLikeRefreshTimer =
      setInterval(
        async function(){

          if(
            ma7alakLikeOwnerShopSlug
          ){

            await loadLikeNotifications();

          }

        },
        5000
      );

  }


  /* =========================================================
     AUTH STATE
  ========================================================= */

  async function setupLikeAuthListener(){

    try{

      const client =
        await loadMa7alakLikeSupabase();


      client.auth.onAuthStateChange(
        async function(){

          /*
             Give Supabase a moment to finish
             updating the session before checking.
          */

          setTimeout(
            async function(){

              const isOwner =
                await checkLikeOwner();


              if(isOwner){

                await loadLikeNotifications();

                await setupLikeRealtime();

              }

            },
            50
          );

        }
      );

    }
    catch(error){

      console.error(
        "Ma7alak story likes auth listener:",
        error
      );

    }

  }


  /* =========================================================
     START
  ========================================================= */

  async function startMa7alakStoryLikes(){

    try{

      await loadMa7alakLikeSupabase();


      const isOwner =
        await checkLikeOwner();


      if(!isOwner){

        return;

      }


      await loadLikeNotifications();

      await setupLikeRealtime();

      startLikeRefresh();

      setupLikeAuthListener();

    }
    catch(error){

      console.error(
        "Ma7alak story likes startup:",
        error
      );

    }

  }


  /* =========================================================
     PAGE LOAD
  ========================================================= */

  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      startMa7alakStoryLikes
    );

  }
  else{

    startMa7alakStoryLikes();

  }


})();