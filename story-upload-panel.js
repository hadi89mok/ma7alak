/* =========================================================
   SHOUFHON — TRUSTED EMBED MESSAGE SOURCE
   Prevent unrelated windows/tabs from invoking owner bridges.
========================================================= */
(function(){
  "use strict";
  if(window.ShoufHonMessageSecurity)return;

  function frameForSource(source){
    if(!source)return null;
    if(source===window)return null;

    let directChild=source;
    try{
      let cursor=source;
      for(let hop=0;hop<12;hop+=1){
        if(!cursor||cursor===window)break;
        const parentWindow=cursor.parent;
        if(!parentWindow||parentWindow===cursor)break;
        if(parentWindow===window){
          directChild=cursor;
          break;
        }
        cursor=parentWindow;
      }
    }catch(_){}

    return Array.from(document.querySelectorAll("iframe")).find(function(frame){
      try{
        return frame.contentWindow===source||frame.contentWindow===directChild;
      }catch(_){
        return false;
      }
    })||null;
  }

  function isTrustedEvent(event,allowSelf=true){
    if(!event)return false;
    if(allowSelf&&event.source===window)return true;
    return !!frameForSource(event.source);
  }

  window.ShoufHonMessageSecurity={
    frameForSource:frameForSource,
    isTrustedEvent:isTrustedEvent
  };
})();

(function(){

  "use strict";

  /*
  =========================================================
  SHOUFHON
  GLOBAL PAGE-LEVEL STORY UPLOADER

  IMPORTANT:
  - This code is GLOBAL.
  - Do NOT make one copy per shop.
  - Do NOT put this inside a Story Embed.
  - It creates NO visible/layout element until + is pressed.

  Works with:
    masaya-cafe
    doze-3ale
    future shops...
  =========================================================
  */


  /* =========================================================
     SUPABASE CONFIG
  ========================================================= */

  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";


  /* =========================================================
     STATE
  ========================================================= */

  let supabaseClient =
    null;

  let supabaseLoading =
    null;

  let activeShopSlug =
    null;

  let isUploading =
    false;

  let uploadSourceWindow =
    null;


  /* =========================================================
     LOAD SUPABASE ONLY WHEN NEEDED
  ========================================================= */

  function loadSupabase(){

    const sharedClient =
      (
        window.Ma7alakAccount &&
        window.Ma7alakAccount.client
      ) ||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
      (
        window.Ma7alakSupabaseBootstrap &&
        window.Ma7alakSupabaseBootstrap.client
      ) ||
      null;

    if(sharedClient){
      supabaseClient = sharedClient;
      return Promise.resolve(supabaseClient);
    }

    if(
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ){

      if(!supabaseClient){

        supabaseClient =
          window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
          );

      }

      return Promise.resolve(
        supabaseClient
      );

    }


    if(
      supabaseLoading
    ){

      return supabaseLoading;

    }


    supabaseLoading =
      new Promise(function(resolve, reject){

        const script =
          document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.async =
          true;

        script.onload =
          function(){

            try{

              supabaseClient =
                window.supabase.createClient(
                  SUPABASE_URL,
                  SUPABASE_KEY
                );

              resolve(
                supabaseClient
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


    return supabaseLoading;

  }


  /* =========================================================
     INJECT UPLOADER CSS ONLY WHEN NEEDED
  ========================================================= */

  function injectUploaderCSS(){

    if(
      document.getElementById(
        "ma7alak-page-story-uploader-style"
      )
    ){

      return;

    }


    const style =
      document.createElement("style");


    style.id =
      "ma7alak-page-story-uploader-style";


    style.textContent = `

/* =========================================================
   SHOUFHON PAGE STORY UPLOADER
========================================================= */

#ma7alak-page-story-uploader{

  position:fixed!important;

  inset:0!important;

  width:100vw!important;
  height:100vh!important;

  width:100dvw!important;
  height:100dvh!important;

  display:none;

  align-items:center!important;

  justify-content:center!important;

  box-sizing:border-box!important;

  padding:
    max(
      18px,
      env(safe-area-inset-top)
    )
    14px
    max(
      24px,
      env(safe-area-inset-bottom)
    )
    14px!important;

  background:

    radial-gradient(
      circle at 50% 15%,
      rgba(217,164,65,.14),
      transparent 34%
    ),

    radial-gradient(
      circle at 15% 90%,
      rgba(217,164,65,.06),
      transparent 30%
    ),

    linear-gradient(
      145deg,
      #050505,
      #111111 48%,
      #050505
    )!important;

  z-index:2147483647!important;

  overflow:hidden!important;

  overscroll-behavior:none!important;

  -webkit-tap-highlight-color:
    transparent!important;

}


#ma7alak-page-story-uploader.active{

  display:flex!important;

}


#ma7alak-page-story-uploader::before{

  content:"";

  position:absolute;

  width:500px;
  height:500px;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  border:
    1px solid
    rgba(217,164,65,.075);

  pointer-events:none;

}


#ma7alak-page-story-uploader::after{

  content:"";

  position:absolute;

  width:340px;
  height:340px;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(217,164,65,.08),
      transparent 68%
    );

  pointer-events:none;

}


#ma7alak-page-story-panel{

  position:relative!important;

  width:
    min(
      430px,
      calc(100vw - 28px)
    )!important;

  height:
    min(
      570px,
      calc(100dvh - 36px)
    )!important;

  min-height:500px!important;

  box-sizing:border-box!important;

  display:flex!important;

  flex-direction:column!important;

  align-items:center!important;

  justify-content:center!important;

  padding:
    60px 20px 42px!important;

  margin:0!important;

  border:
    1px solid
    rgba(217,164,65,.28)!important;

  border-radius:38px!important;

  background:

    linear-gradient(
      145deg,
      rgba(255,255,255,.085),
      rgba(255,255,255,.025)
    )!important;

  box-shadow:

    0 30px 100px
      rgba(0,0,0,.80),

    inset 0 1px 0
      rgba(255,255,255,.07)!important;

  color:#fff!important;

  font-family:
    Arial,
    "Segoe UI",
    sans-serif!important;

  animation:
    ma7alakPageUploaderAppear
    .28s
    cubic-bezier(.2,.8,.2,1);

  z-index:2!important;

}


@keyframes ma7alakPageUploaderAppear{

  from{

    opacity:0;

    transform:
      scale(.90)
      translateY(18px);

  }

  to{

    opacity:1;

    transform:
      scale(1)
      translateY(0);

  }

}


#ma7alak-page-story-panel::before{

  content:"";

  position:absolute;

  top:-1px;

  left:15%;

  right:15%;

  height:2px;

  border-radius:20px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #d9a441,
      transparent
    );

}


#ma7alak-page-story-close{

  position:absolute!important;

  top:15px!important;

  right:16px!important;

  width:44px!important;
  height:44px!important;

  border:
    1px solid
    rgba(255,255,255,.11)!important;

  border-radius:50%!important;

  background:
    rgba(255,255,255,.055)!important;

  color:#fff!important;

  font-size:28px!important;

  line-height:40px!important;

  text-align:center!important;

  padding:0!important;

  margin:0!important;

  cursor:pointer!important;

  outline:none!important;

  appearance:none!important;

  -webkit-appearance:none!important;

  -webkit-tap-highlight-color:
    transparent!important;

  z-index:10!important;

}


#ma7alak-page-story-close:active{

  transform:scale(.90)!important;

}


#ma7alak-page-story-title{

  margin:0!important;

  padding:0!important;

  color:#fff!important;

  text-align:center!important;

  font-size:28px!important;

  line-height:1.2!important;

  font-weight:900!important;

  letter-spacing:-.7px!important;

}


#ma7alak-page-story-subtitle{

  margin:
    9px 0 18px!important;

  padding:0!important;

  color:
    rgba(255,255,255,.46)!important;

  font-size:12px!important;

  line-height:1.6!important;

  text-align:center!important;

}


#ma7alak-page-story-shop{

  display:inline-flex!important;

  align-items:center!important;

  justify-content:center!important;

  max-width:85%!important;

  margin:
    0 0 32px!important;

  padding:
    8px 16px!important;

  border:
    1px solid
    rgba(217,164,65,.22)!important;

  border-radius:30px!important;

  background:
    rgba(217,164,65,.08)!important;

  color:#d9a441!important;

  font-size:11px!important;

  font-weight:800!important;

  white-space:nowrap!important;

  overflow:hidden!important;

  text-overflow:ellipsis!important;

}


#ma7alak-page-story-options{

  width:100%!important;

  display:flex!important;

  align-items:center!important;

  justify-content:center!important;

  gap:18px!important;

}


.ma7alak-page-story-option{

  position:relative!important;

  width:122px!important;
  height:122px!important;

  min-width:122px!important;
  min-height:122px!important;

  border-radius:50%!important;

  border:
    1px solid
    rgba(217,164,65,.42)!important;

  background:

    radial-gradient(
      circle at 35% 25%,
      rgba(217,164,65,.21),
      rgba(255,255,255,.035) 58%,
      rgba(0,0,0,.25)
    )!important;

  color:#fff!important;

  display:flex!important;

  flex-direction:column!important;

  align-items:center!important;

  justify-content:center!important;

  padding:0!important;

  margin:0!important;

  box-sizing:border-box!important;

  cursor:pointer!important;

  font-family:inherit!important;

  appearance:none!important;

  -webkit-appearance:none!important;

  outline:none!important;

  -webkit-tap-highlight-color:
    transparent!important;

  transition:
    transform .18s ease,
    border-color .18s ease!important;

}


.ma7alak-page-story-option::before{

  content:"";

  position:absolute;

  inset:7px;

  border-radius:50%;

  border:
    1px solid
    rgba(255,255,255,.055);

  pointer-events:none;

}


.ma7alak-page-story-option:hover{

  transform:
    translateY(-4px)
    scale(1.03)!important;

  border-color:
    rgba(217,164,65,.85)!important;

}


.ma7alak-page-story-option:active{

  transform:
    scale(.92)!important;

}


.ma7alak-page-story-option-icon{

  display:block!important;

  font-size:36px!important;

  line-height:1!important;

  margin:
    0 0 9px!important;

}


.ma7alak-page-story-option-title{

  display:block!important;

  color:#fff!important;

  font-size:12px!important;

  font-weight:900!important;

}


#ma7alak-page-story-quota{
  min-height:24px!important;
  margin:-14px 0 20px!important;
  padding:6px 11px!important;
  border:1px solid rgba(217,164,65,.18)!important;
  border-radius:999px!important;
  background:rgba(217,164,65,.055)!important;
  color:rgba(241,214,158,.82)!important;
  font-size:10px!important;
  font-weight:800!important;
  line-height:1.2!important;
  text-align:center!important;
}

#ma7alak-page-story-quota.off{
  border-color:rgba(255,92,92,.24)!important;
  background:rgba(255,92,92,.06)!important;
  color:#ffb1b1!important;
}

.ma7alak-page-story-option:disabled{
  opacity:.38!important;
  cursor:not-allowed!important;
  transform:none!important;
}

#ma7alak-page-story-status{

  width:100%!important;

  min-height:30px!important;

  margin:
    25px 0 0!important;

  text-align:center!important;

  color:
    rgba(255,255,255,.72)!important;

  font-size:12px!important;

  line-height:1.6!important;

  display:none!important;

}


#ma7alak-page-story-status.visible{

  display:block!important;

}


#ma7alak-page-story-progress{

  width:190px!important;

  height:5px!important;

  margin:
    10px auto 0!important;

  border-radius:20px!important;

  overflow:hidden!important;

  background:
    rgba(255,255,255,.08)!important;

  display:none!important;

}


#ma7alak-page-story-progress.visible{

  display:block!important;

}


#ma7alak-page-story-progress-bar{

  width:0%;

  height:100%;

  border-radius:20px;

  background:#d9a441;

  transition:
    width .20s ease;

}


#ma7alak-page-story-note{

  position:absolute!important;

  bottom:25px!important;

  left:20px!important;

  right:20px!important;

  margin:0!important;

  padding:0!important;

  text-align:center!important;

  color:
    rgba(255,255,255,.28)!important;

  font-size:9px!important;

}


@media(max-width:600px){

  #ma7alak-page-story-uploader{

    padding:
      max(
        12px,
        env(safe-area-inset-top)
      )
      10px
      max(
        18px,
        env(safe-area-inset-bottom)
      )
      10px!important;

  }


  #ma7alak-page-story-panel{

    width:
      calc(100vw - 20px)!important;

    height:
      min(
        540px,
        calc(100dvh - 24px)
      )!important;

    min-height:480px!important;

    border-radius:32px!important;

    padding:
      58px 12px 48px!important;

  }


  #ma7alak-page-story-title{

    font-size:25px!important;

  }


  #ma7alak-page-story-subtitle{

    margin-bottom:16px!important;

  }


  #ma7alak-page-story-shop{

    margin-bottom:27px!important;

  }


  #ma7alak-page-story-options{

    gap:14px!important;

  }


  .ma7alak-page-story-option{

    width:108px!important;
    height:108px!important;

    min-width:108px!important;
    min-height:108px!important;

  }


  .ma7alak-page-story-option-icon{

    font-size:32px!important;

  }


  .ma7alak-page-story-option-title{

    font-size:11px!important;

  }


  #ma7alak-page-story-note{

    bottom:22px!important;

  }

}


@media(max-width:380px){

  #ma7alak-page-story-panel{

    min-height:450px!important;

    padding:
      52px 8px 44px!important;

  }


  #ma7alak-page-story-title{

    font-size:23px!important;

  }


  #ma7alak-page-story-subtitle{

    font-size:11px!important;

  }


  #ma7alak-page-story-shop{

    margin-bottom:22px!important;

  }


  .ma7alak-page-story-option{

    width:96px!important;
    height:96px!important;

    min-width:96px!important;
    min-height:96px!important;

  }


  .ma7alak-page-story-option-icon{

    font-size:28px!important;

  }

}

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================================
     CREATE UPLOADER
  ========================================================= */

  function createUploader(){

    let overlay =
      document.getElementById(
        "ma7alak-page-story-uploader"
      );


    if(overlay){

      return overlay;

    }


    injectUploaderCSS();


    overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      "ma7alak-page-story-uploader";


    overlay.innerHTML = `

      <div
        id="ma7alak-page-story-panel"
      >

        <button
          id="ma7alak-page-story-close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>


        <div
          id="ma7alak-page-story-title"
        >
          Add Story
        </div>


        <div
          id="ma7alak-page-story-subtitle"
        >
          Share what’s new from your shop
        </div>


        <div
          id="ma7alak-page-story-shop"
        ></div>

        <div
          id="ma7alak-page-story-quota"
          aria-live="polite"
        >
          Story limit: loading…
        </div>


        <div
          id="ma7alak-page-story-options"
        >

          <button
            id="ma7alak-page-story-image"
            class="ma7alak-page-story-option"
            type="button"
          >

            <span
              class="ma7alak-page-story-option-icon"
            >
              📸
            </span>

            <span
              class="ma7alak-page-story-option-title"
            >
              Images
            </span>

          </button>


          <button
            id="ma7alak-page-story-video"
            class="ma7alak-page-story-option"
            type="button"
          >

            <span
              class="ma7alak-page-story-option-icon"
            >
              🎥
            </span>

            <span
              class="ma7alak-page-story-option-title"
            >
              Videos
            </span>

          </button>

        </div>


        <input
          id="ma7alak-page-story-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          style="display:none!important;"
        />


        <input
          id="ma7alak-page-story-video-input"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          multiple
          style="display:none!important;"
        />


        <div
          id="ma7alak-page-story-status"
        ></div>


        <div
          id="ma7alak-page-story-progress"
        >

          <div
            id="ma7alak-page-story-progress-bar"
          ></div>

        </div>


        <div
          id="ma7alak-page-story-note"
        >
          Select up to 10 photos or videos at once · Stories disappear after 24 hours
        </div>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    document
      .getElementById(
        "ma7alak-page-story-close"
      )
      .addEventListener(
        "click",
        closeUploader
      );


    document
      .getElementById(
        "ma7alak-page-story-image"
      )
      .addEventListener(
        "click",
        function(){

          if(
            !isUploading
          ){

            const input =
              document.getElementById(
                "ma7alak-page-story-image-input"
              );

            if(input){
              input.multiple = true;
              input.setAttribute("multiple","multiple");
              input.click();
            }

          }

        }
      );


    document
      .getElementById(
        "ma7alak-page-story-video"
      )
      .addEventListener(
        "click",
        function(){

          if(
            !isUploading
          ){

            const input =
              document.getElementById(
                "ma7alak-page-story-video-input"
              );

            if(input){
              input.multiple = true;
              input.setAttribute("multiple","multiple");
              input.click();
            }

          }

        }
      );


    document
      .getElementById(
        "ma7alak-page-story-image-input"
      )
      .addEventListener(
        "change",
        function(){

          if(
            this.files &&
            this.files.length
          ){

            uploadStories(
              this.files,
              "image"
            );

          }

        }
      );


    document
      .getElementById(
        "ma7alak-page-story-video-input"
      )
      .addEventListener(
        "change",
        function(){

          if(
            this.files &&
            this.files.length
          ){

            uploadStories(
              this.files,
              "video"
            );

          }

        }
      );


    overlay.addEventListener(
      "click",
      function(event){

        if(
          event.target === overlay &&
          !isUploading
        ){

          closeUploader();

        }

      }
    );


    return overlay;

  }


  /* =========================================================
     RESET
  ========================================================= */

  function resetUploader(){

    const status =
      document.getElementById(
        "ma7alak-page-story-status"
      );


    const progress =
      document.getElementById(
        "ma7alak-page-story-progress"
      );


    const bar =
      document.getElementById(
        "ma7alak-page-story-progress-bar"
      );


    if(status){

      status.textContent =
        "";

      status.classList.remove(
        "visible"
      );

    }


    if(progress){

      progress.classList.remove(
        "visible"
      );

    }


    if(bar){

      bar.style.width =
        "0%";

    }


    const quota=
      document.getElementById(
        "ma7alak-page-story-quota"
      );

    if(quota){
      quota.textContent=
        "Story limit: loading…";
      quota.classList.remove(
        "off"
      );
    }


    const imageButton=
      document.getElementById(
        "ma7alak-page-story-image"
      );

    const videoButton=
      document.getElementById(
        "ma7alak-page-story-video"
      );

    if(imageButton){
      imageButton.disabled=false;
    }

    if(videoButton){
      videoButton.disabled=false;
    }

  }


  /* =========================================================
     STATUS
  ========================================================= */

  function showStatus(
    message
  ){

    const status =
      document.getElementById(
        "ma7alak-page-story-status"
      );


    if(!status){

      return;

    }


    status.textContent =
      message;


    status.classList.add(
      "visible"
    );

  }


  /* =========================================================
     OPEN UPLOADER
  ========================================================= */

  async function openUploader(
    shopSlug,
    sourceWindow
  ){

    if(
      !shopSlug ||
      isUploading
    ){

      return;

    }


    try{

      const client =
        await loadSupabase();


      const sessionResult =
        await client.auth.getSession();


      const session =
        sessionResult &&
        sessionResult.data &&
        sessionResult.data.session;


      if(!session){

        alert(
          "You need to be signed in."
        );

        return;

      }


      const user =
        session.user;


      if(!user){

        return;

      }


      /* -----------------------------------------
         VERIFY OWNER
      ----------------------------------------- */

      const ownerResult =
        await client
          .from("shop_owners")
          .select("shop_slug")
          .eq("user_id", user.id)
          .eq("shop_slug", shopSlug)
          .maybeSingle();


      if(
        ownerResult.error ||
        !ownerResult.data
      ){

        alert(
          "You don’t have permission for this shop."
        );

        return;

      }


      activeShopSlug =
        shopSlug;


      uploadSourceWindow =
        sourceWindow || null;


      const overlay =
        createUploader();


      const shopLabel =
        document.getElementById(
          "ma7alak-page-story-shop"
        );


      if(shopLabel){

        shopLabel.textContent =
          shopSlug;

      }


      resetUploader();


      overlay.classList.add(
        "active"
      );

      refreshStoryQuotaDisplay(
        client
      ).catch(function(){});

    }

    catch(error){

      console.error(
        "SHOUFHON uploader open error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );

    }

  }


  /* =========================================================
     CLOSE
  ========================================================= */

  function closeUploader(){

    if(
      isUploading
    ){

      return;

    }


    const overlay =
      document.getElementById(
        "ma7alak-page-story-uploader"
      );


    if(!overlay){

      return;

    }


    overlay.classList.remove(
      "active"
    );


    activeShopSlug =
      null;


    uploadSourceWindow =
      null;


    const imageInput =
      document.getElementById(
        "ma7alak-page-story-image-input"
      );


    const videoInput =
      document.getElementById(
        "ma7alak-page-story-video-input"
      );


    if(imageInput){

      imageInput.value =
        "";

    }


    if(videoInput){

      videoInput.value =
        "";

    }

  }


  /* =========================================================
     MULTI-STORY UPLOAD
     ---------------------------------------------------------
     - Select up to 10 images OR 10 videos at once.
     - Files upload sequentially so phones do not upload many large files
       concurrently and overheat / exhaust memory.
     - Owner/session verification happens once per batch.
     - The Story embed is refreshed once after the whole batch, not once
       per file.
  ========================================================= */

  const MAX_STORY_BATCH_FILES = 10;
  const MAX_STORY_FILE_SIZE = 50 * 1024 * 1024;


  function renderStoryQuota(quota){

    const badge=
      document.getElementById(
        "ma7alak-page-story-quota"
      );

    if(!badge){
      return;
    }

    const limit=
      Math.max(
        0,
        Number(quota?.story_limit)||0
      );

    const active=
      Math.max(
        0,
        Number(quota?.active_count)||0
      );

    const remaining=
      Math.max(
        0,
        Number(quota?.remaining)||0
      );

    if(limit<=0){
      badge.textContent=
        "Story uploads are OFF for this shop";
      badge.classList.add("off");
    }
    else{
      badge.textContent=
        active+
        " / "+
        limit+
        " active Stories · "+
        remaining+
        " slot"+
        (remaining===1?"":"s")+
        " left";
      badge.classList.toggle(
        "off",
        remaining<=0
      );
    }

    const disabled=
      limit<=0 ||
      remaining<=0;

    const imageButton=
      document.getElementById(
        "ma7alak-page-story-image"
      );

    const videoButton=
      document.getElementById(
        "ma7alak-page-story-video"
      );

    if(imageButton){
      imageButton.disabled=disabled;
    }

    if(videoButton){
      videoButton.disabled=disabled;
    }
  }


  async function getStoryQuota(client){

    const result=
      await client.rpc(
        "get_my_story_quota",
        {
          p_shop_slug:
            activeShopSlug
        }
      );

    if(result.error){
      throw result.error;
    }

    const row=
      Array.isArray(result.data)
        ? result.data[0]
        : result.data;

    if(!row){
      throw new Error(
        "Could not load Story limit."
      );
    }

    return {
      story_limit:
        Math.max(
          0,
          Number(row.story_limit)||0
        ),
      active_count:
        Math.max(
          0,
          Number(row.active_count)||0
        ),
      remaining:
        Math.max(
          0,
          Number(row.remaining)||0
        )
    };
  }


  async function refreshStoryQuotaDisplay(client){

    const badge=
      document.getElementById(
        "ma7alak-page-story-quota"
      );

    if(badge){
      badge.textContent=
        "Story limit: loading…";
      badge.classList.remove("off");
    }

    try{
      const quota=
        await getStoryQuota(
          client ||
          await loadSupabase()
        );

      renderStoryQuota(
        quota
      );

      return quota;
    }
    catch(error){
      console.warn(
        "SHOUFHON Story quota:",
        error
      );

      if(badge){
        badge.textContent=
          "Story limit unavailable";
        badge.classList.add("off");
      }

      throw error;
    }
  }


  function storyUploadProgress(
    completedFiles,
    totalFiles,
    fileFraction
  ){

    const bar =
      document.getElementById(
        "ma7alak-page-story-progress-bar"
      );

    if(!bar || !totalFiles){
      return;
    }

    const fraction =
      Math.max(
        0,
        Math.min(
          1,
          (
            Number(completedFiles || 0) +
            Math.max(0,Math.min(1,Number(fileFraction || 0)))
          ) /
          totalFiles
        )
      );

    bar.style.width =
      Math.round(
        8 + fraction * 92
      ) + "%";

  }


  async function getStoryUploadContext(){

    const client =
      await loadSupabase();


    const sessionResult =
      await client.auth.getSession();


    const session =
      sessionResult &&
      sessionResult.data &&
      sessionResult.data.session;


    if(!session){
      throw new Error(
        "NO_SESSION"
      );
    }


    const user =
      session.user;


    const ownerResult =
      await client
        .from("shop_owners")
        .select("shop_slug")
        .eq("user_id", user.id)
        .eq("shop_slug", activeShopSlug)
        .maybeSingle();


    if(
      ownerResult.error ||
      !ownerResult.data
    ){
      throw new Error(
        "NOT_OWNER"
      );
    }


    return {
      client,
      user
    };

  }


  function storyExtension(
    file,
    type
  ){

    if(type === "video"){

      if(file.type === "video/webm"){
        return "webm";
      }

      if(file.type === "video/quicktime"){
        return "mov";
      }

      return "mp4";

    }


    if(file.type === "image/png"){
      return "png";
    }

    if(file.type === "image/webp"){
      return "webp";
    }

    if(file.type === "image/gif"){
      return "gif";
    }

    return "jpg";

  }


  async function publishStoryFile(
    file,
    type,
    context,
    completedFiles,
    totalFiles
  ){

    const client =
      context.client;

    const user =
      context.user;


    const uniqueId =
      crypto.randomUUID
        ? crypto.randomUUID()
        :
        (
          Date.now() +
          "_" +
          Math.random()
            .toString(36)
            .slice(2)
        );


    const storagePath =
      activeShopSlug +
      "/" +
      uniqueId +
      "." +
      storyExtension(
        file,
        type
      );


    storyUploadProgress(
      completedFiles,
      totalFiles,
      .18
    );


    const uploadResult =
      await client
        .storage
        .from("shop-stories")
        .upload(
          storagePath,
          file,
          {
            cacheControl:"86400",
            upsert:false,
            contentType:file.type
          }
        );


    if(uploadResult.error){
      throw uploadResult.error;
    }


    storyUploadProgress(
      completedFiles,
      totalFiles,
      .68
    );


    const expiresAt =
      new Date(
        Date.now() +
        24 * 60 * 60 * 1000
      ).toISOString();


    const insertResult =
      await client
        .from("shop_stories")
        .insert({
          user_id:user.id,
          shop_slug:activeShopSlug,
          media_type:type,
          storage_path:storagePath,
          expires_at:expiresAt
        })
        .select()
        .single();


    if(insertResult.error){

      await client
        .storage
        .from("shop-stories")
        .remove([
          storagePath
        ]);

      throw insertResult.error;

    }


    storyUploadProgress(
      completedFiles + 1,
      totalFiles,
      0
    );


    return insertResult.data;

  }


  function broadcastStoryMutation(
    action,
    shopSlug,
    storyId
  ){

    const normalizedSlug =
      String(
        shopSlug ||
        activeShopSlug ||
        ""
      )
        .trim()
        .toLowerCase();


    const message = {
      type:
        action === "delete"
          ? "MA7ALAK_STORY_DELETED"
          : "MA7ALAK_STORY_UPLOADED",
      action:
        String(
          action ||
          "update"
        ),
      shopSlug:
        normalizedSlug,
      storyId:
        Number.isFinite(
          Number(
            storyId
          )
        )
          ? Number(
              storyId
            )
          : null,
      at:
        Date.now()
    };


    /*
       Same-page listeners update immediately.
       BroadcastChannel updates another open ShoufHon tab.
       localStorage is the fallback for browsers where BroadcastChannel
       is unavailable or gets suspended.
    */
    try{
      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:story-mutation",
          {
            detail:
              message
          }
        )
      );
    }
    catch(error){}


    try{

      if(
        "BroadcastChannel" in
        window
      ){

        const channel =
          new BroadcastChannel(
            "shoufhon-stories"
          );

        channel.postMessage(
          message
        );

        channel.close();

      }

    }
    catch(error){}


    try{
      localStorage.setItem(
        "shoufhon_story_mutation",
        JSON.stringify(
          message
        )
      );
    }
    catch(error){}


    return message;

  }


  function broadcastStoriesUploaded(){

    const message =
      broadcastStoryMutation(
        "upload",
        activeShopSlug,
        null
      );


    if(uploadSourceWindow){

      try{
        uploadSourceWindow.postMessage(
          message,
          "*"
        );
      }
      catch(error){
        console.log(
          "SHOUFHON upload message error:",
          error
        );
      }

    }


    try{
      window.postMessage(
        message,
        "*"
      );
    }
    catch(error){}

  }


  async function uploadStories(
    fileList,
    type
  ){

    if(
      isUploading ||
      !activeShopSlug ||
      !fileList
    ){
      return;
    }


    const files =
      Array.from(
        fileList
      );


    if(!files.length){
      return;
    }


    if(
      files.length >
      MAX_STORY_BATCH_FILES
    ){

      alert(
        "Choose up to " +
        MAX_STORY_BATCH_FILES +
        " Stories at once."
      );

      return;

    }


    const tooLarge =
      files.find(
        function(file){
          return (
            file &&
            file.size >
              MAX_STORY_FILE_SIZE
          );
        }
      );


    if(tooLarge){

      alert(
        "Each Story must be 50 MB or smaller. " +
        (tooLarge.name || "One selected file") +
        " is too large."
      );

      return;

    }


    isUploading =
      true;


    const progress =
      document.getElementById(
        "ma7alak-page-story-progress"
      );


    if(progress){
      progress.classList.add(
        "visible"
      );
    }


    storyUploadProgress(
      0,
      files.length,
      0
    );


    let uploaded =
      0;


    try{

      showStatus(
        files.length === 1
          ? "Uploading Story…"
          : "Preparing " +
            files.length +
            " Stories…"
      );


      const context =
        await getStoryUploadContext();


      const quota =
        await getStoryQuota(
          context.client
        );


      renderStoryQuota(
        quota
      );


      if(quota.story_limit<=0){
        throw new Error(
          "STORY_PUBLISHING_DISABLED"
        );
      }


      if(quota.remaining<=0){
        throw new Error(
          "STORY_LIMIT_REACHED"
        );
      }


      if(files.length>quota.remaining){
        throw new Error(
          "STORY_BATCH_EXCEEDS_LIMIT:"+
          quota.remaining
        );
      }


      for(
        let index = 0;
        index < files.length;
        index++
      ){

        showStatus(
          "Uploading " +
          (index + 1) +
          " of " +
          files.length +
          "…"
        );


        await publishStoryFile(
          files[index],
          type,
          context,
          index,
          files.length
        );


        uploaded =
          index + 1;

      }


      broadcastStoriesUploaded();


      showStatus(
        uploaded === 1
          ? "✓ Story published!"
          : "✓ " +
            uploaded +
            " Stories published!"
      );


      const imageInput =
        document.getElementById(
          "ma7alak-page-story-image-input"
        );

      const videoInput =
        document.getElementById(
          "ma7alak-page-story-video-input"
        );

      if(imageInput){
        imageInput.value = "";
      }

      if(videoInput){
        videoInput.value = "";
      }


      setTimeout(
        function(){

          isUploading =
            false;

          closeUploader();

        },
        900
      );

    }


    catch(error){

      console.error(
        "SHOUFHON page uploader error:",
        error
      );


      isUploading =
        false;


      if(
        error &&
        error.message ===
          "NO_SESSION"
      ){

        showStatus(
          "You need to be signed in."
        );

      }

      else if(
        error &&
        error.message ===
          "NOT_OWNER"
      ){

        showStatus(
          "You don’t have permission for this shop."
        );

      }

      else if(
        String(error?.message||"") ===
          "STORY_PUBLISHING_DISABLED"
      ){

        showStatus(
          "Story uploads are turned OFF for this shop."
        );

        refreshStoryQuotaDisplay().catch(function(){});

      }

      else if(
        String(error?.message||"") ===
          "STORY_LIMIT_REACHED" ||
        String(error?.message||"")
          .includes("Story limit reached")
      ){

        if(uploaded>0){
          broadcastStoriesUploaded();
        }

        showStatus(
          "Story limit reached. Delete a Story or ask ShoufHon Admin to increase the limit."
        );

        refreshStoryQuotaDisplay().catch(function(){});

      }

      else if(
        String(error?.message||"")
          .startsWith(
            "STORY_BATCH_EXCEEDS_LIMIT:"
          )
      ){

        const remaining=
          Math.max(
            0,
            Number(
              String(error.message)
                .split(":")
                .pop()
            )||0
          );

        showStatus(
          remaining>0
            ? (
                "You can upload only "+
                remaining+
                " more active Stor"+
                (remaining===1?"y":"ies")+
                "."
              )
            : "Story limit reached."
        );

        refreshStoryQuotaDisplay().catch(function(){});

      }

      else if(uploaded > 0){

        /*
           Earlier files are already valid Stories. Refresh once so the shop
           sees those successful uploads, then leave the panel open so the
           owner can retry the remaining files.
        */
        broadcastStoriesUploaded();

        showStatus(
          "✓ " +
          uploaded +
          " uploaded · next file failed. Try the remaining files again."
        );

      }

      else{

        showStatus(
          "Upload failed. Please try again."
        );

      }


      if(progress){
        progress.classList.remove(
          "visible"
        );
      }

    }

  }


  /* =========================================================
     AUTHENTICATED STORY DELETE BRIDGE
     ---------------------------------------------------------
     Story UI may live inside a Hostinger iframe. Always perform owner
     Story deletion with this top-level authenticated client so Storage
     and table RLS evaluate the same owner session as Header / Live.
  ========================================================= */

  function isKnownStoryEmbedWindow(sourceWindow){
    if(!sourceWindow)return false;
    return Array.from(document.querySelectorAll("iframe")).some(function(frame){
      try{return frame.contentWindow===sourceWindow}catch(_){return false}
    });
  }

  function replyStoryDelete(sourceWindow,requestId,ok,error){
    try{
      sourceWindow?.postMessage(
        {
          type:"MA7ALAK_DELETE_STORY_RESULT",
          requestId:String(requestId||""),
          ok:!!ok,
          error:error?String(error):""
        },
        "*"
      );
    }
    catch(_){}
  }

  async function deleteStoryForOwnerRequest(event){

    const data=event.data||{};
    const sourceWindow=event.source||null;
    const requestId=String(data.requestId||"");
    const shopSlug=String(data.shopSlug||"").trim().toLowerCase();
    const storyId=Number(data.storyId);

    if(
      !requestId ||
      !shopSlug ||
      !Number.isFinite(storyId) ||
      !isKnownStoryEmbedWindow(sourceWindow)
    ){
      return;
    }

    try{

      const client=await loadSupabase();

      const userResult=await client.auth.getUser();
      const user=userResult?.data?.user||null;

      if(!user){
        throw new Error("You need to be signed in.");
      }

      const ownerResult=await client
        .from("shop_owners")
        .select("shop_slug")
        .eq("user_id",user.id)
        .eq("shop_slug",shopSlug)
        .maybeSingle();

      if(ownerResult.error)throw ownerResult.error;
      if(!ownerResult.data){
        throw new Error("You no longer have permission to manage this shop.");
      }

      const storyResult=await client
        .from("shop_stories")
        .select("id,storage_path")
        .eq("id",storyId)
        .eq("shop_slug",shopSlug)
        .maybeSingle();

      if(storyResult.error)throw storyResult.error;

      /*
         If Realtime already deleted this Story, treat the request as done.
      */
      if(!storyResult.data){
        broadcastStoryMutation(
          "delete",
          shopSlug,
          storyId
        );
        replyStoryDelete(sourceWindow,requestId,true,"");
        return;
      }

      const databaseResult=await client
        .from("shop_stories")
        .delete()
        .eq("id",storyId)
        .eq("shop_slug",shopSlug);

      if(databaseResult.error)throw databaseResult.error;

      /*
         The Story is already removed from the database at this point.
         Storage cleanup is best-effort so a temporary Storage problem never
         makes the deleted Story reappear to the owner.
      */
      const storagePath=String(storyResult.data.storage_path||"").trim();

      if(storagePath){
        const storageResult=await client
          .storage
          .from("shop-stories")
          .remove([storagePath]);

        if(storageResult.error){
          console.warn(
            "SHOUFHON Story storage cleanup:",
            storageResult.error
          );
        }
      }

      broadcastStoryMutation(
        "delete",
        shopSlug,
        storyId
      );

      replyStoryDelete(sourceWindow,requestId,true,"");

    }
    catch(error){

      console.error(
        "SHOUFHON Story delete bridge:",
        error
      );

      replyStoryDelete(
        sourceWindow,
        requestId,
        false,
        error?.message||"Could not delete Story."
      );

    }

  }


  /* =========================================================
     MESSAGE FROM STORY EMBED
  ========================================================= */

  window.addEventListener(
    "message",
    function(event){

      if(
        !window.ShoufHonMessageSecurity?.isTrustedEvent(event,true)
      ){
        return;
      }

      if(
        !event.data
      ){

        return;

      }


      if(
        event.data.type ===
        "MA7ALAK_DELETE_STORY_REQUEST"
      ){

        deleteStoryForOwnerRequest(event);
        return;

      }


      if(
        event.data.type !==
        "MA7ALAK_OPEN_STORY_UPLOADER"
      ){

        return;

      }

      /*
         Normal + click must show the Story/Reel chooser first.
         The real Story uploader opens only after Add Story is chosen.
      */
      if(
        event.data.__ma7alakOpenStoryNow !== true
      ){

        return;

      }

      /*
         Older shop embeds (including Zee) send the direct-Story
         flag from inside their iframe. Those clicks should now be
         handled by the Story/Reel chooser below. Only an explicit
         Add Story choice posted by this top-level page opens the
         Story uploader immediately.
      */
      if(
        event.source &&
        event.source !== window
      ){

        return;

      }


      const shopSlug =
        String(
          event.data.shopSlug ||
          ""
        ).trim();


      if(
        !shopSlug
      ){

        return;

      }


      openUploader(
        shopSlug,
        event.source
      );

    }
  );


  /* =========================================================
     ESCAPE
  ========================================================= */

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key !== "Escape"
      ){

        return;

      }


      const overlay =
        document.getElementById(
          "ma7alak-page-story-uploader"
        );


      if(
        overlay &&
        overlay.classList.contains(
          "active"
        )
      ){

        closeUploader();

      }

    }
  );


})();

/* =========================================================
   WHAT CHANGED
   =========================================================
   1. Converted this exact GLOBAL PAGE-LEVEL STORY UPLOADER
      to GitHub-ready JavaScript.
   2. Removed only the outer <script> and </script> tags.
   3. Uploader panel, owner verification, image/video upload,
      Supabase logic, 24-hour expiry, and postMessage behavior
      are unchanged.
   4. This file should be loaded separately from the Story viewer.
   ========================================================= */


/* =========================================================
   SHOUFHON — OWNER + MENU / PROFILE MEDIA STUDIO V3
   ---------------------------------------------------------
   One simple owner panel for:
   - Profile photo
   - Profile banner
   Both can be replaced or removed, then saved together.
========================================================= */
(function(){
  "use strict";
  if(window.__MA7ALAK_OWNER_ADD_CHOOSER__)return;
  window.__MA7ALAK_OWNER_ADD_CHOOSER__=true;

  const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const IMAGE_BUCKET="shop-gallery";
  const MAX_IMAGE_BYTES=12*1024*1024;

  let activeSlug="";
  let originalSource=null;
  let client=null;
  let activeProfile=null;
  let profileEditAllowed=false;
  const ownerProfileCache=new Map();

  const mediaDraft={
    profile:{file:null,objectUrl:"",remove:false,dirty:false},
    banner:{file:null,objectUrl:"",remove:false,dirty:false}
  };

  function bool(value){
    return value===true||
      String(value||"").toLowerCase()==="true"||
      String(value||"")==="1";
  }

  function esc(value){
    return String(value??"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  async function getClient(){
    if(client)return client;

    client=
      window.Ma7alakAccount?.client||
      window.Ma7alakSupabase?.client||
      window.Ma7alakSupabaseBootstrap?.client||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
      null;

    if(client)return client;

    if(!window.supabase?.createClient){
      await new Promise((resolve,reject)=>{
        const existing=
          document.querySelector('script[src*="@supabase/supabase-js"]');

        if(existing){
          const started=Date.now();
          const timer=setInterval(()=>{
            if(window.supabase?.createClient){
              clearInterval(timer);
              resolve();
            }else if(Date.now()-started>12000){
              clearInterval(timer);
              reject(new Error("Supabase did not load."));
            }
          },80);
          return;
        }

        const script=document.createElement("script");
        script.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async=true;
        script.onload=resolve;
        script.onerror=()=>reject(new Error("Could not load Supabase."));
        document.head.appendChild(script);
      });
    }

    client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__=
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||client;

    return client;
  }

  function imageExtension(file){
    const fromName=
      String(file?.name||"")
        .split(".")
        .pop()
        .toLowerCase();

    if(["jpg","jpeg","png","webp","gif"].includes(fromName)){
      return fromName==="jpeg"?"jpg":fromName;
    }

    const mime=String(file?.type||"").toLowerCase();
    if(mime==="image/png")return"png";
    if(mime==="image/webp")return"webp";
    if(mime==="image/gif")return"gif";
    return"jpg";
  }

  function validateImage(file){
    if(!file)throw new Error("Choose an image first.");

    if(!/^image\/(jpeg|png|webp|gif)$/i.test(String(file.type||""))){
      throw new Error("Use JPG, PNG, WEBP or GIF.");
    }

    if(file.size>MAX_IMAGE_BYTES){
      throw new Error("Image must be smaller than 12 MB.");
    }
  }

  function publicStoragePath(url){
    const value=String(url||"").trim();
    const marker="/storage/v1/object/public/"+IMAGE_BUCKET+"/";
    const at=value.indexOf(marker);
    if(at<0)return"";

    try{
      return decodeURIComponent(
        value.slice(at+marker.length).split("?")[0]
      );
    }catch(_){
      return value.slice(at+marker.length).split("?")[0];
    }
  }

  function ownedCleanupPath(path,slug){
    const parts=String(path||"").split("/").filter(Boolean);
    if(parts.length<2)return false;

    const roots=
      new Set([
        "owner-profile",
        "owner-banner",
        "profiles",
        "profile-banners"
      ]);

    return roots.has(parts[0])&&parts[1]===slug;
  }

  async function cleanupOldImage(url,slug){
    const path=publicStoragePath(url);
    if(!ownedCleanupPath(path,slug))return;

    try{
      const result=
        await (await getClient())
          .storage
          .from(IMAGE_BUCKET)
          .remove([path]);

      if(result.error){
        console.warn(
          "SHOUFHON old profile media cleanup:",
          result.error
        );
      }
    }catch(error){
      console.warn(
        "SHOUFHON old profile media cleanup:",
        error
      );
    }
  }

  async function loadOwnerProfile(slug){
    const c=await getClient();
    const session=await c.auth.getUser();
    const user=session.data?.user;

    if(!user){
      throw new Error("Owner login required.");
    }

    const owner=
      await c
        .from("shop_owners")
        .select("shop_slug")
        .eq("user_id",user.id)
        .eq("shop_slug",slug)
        .maybeSingle();

    if(owner.error)throw owner.error;
    if(!owner.data){
      throw new Error("This account does not own this shop.");
    }

    const profile=
      await c
        .from("shop_profiles")
        .select(
          "shop_slug,shop_name,profile_image_url,story_logo_url,directory_options"
        )
        .eq("shop_slug",slug)
        .maybeSingle();

    if(profile.error)throw profile.error;
    if(!profile.data){
      throw new Error("Shop profile was not found.");
    }

    activeProfile=profile.data;
    profileEditAllowed=
      bool(profile.data.directory_options?.owner_profile_edit_enabled);

    ownerProfileCache.set(
      String(slug||"").trim().toLowerCase(),
      profile.data
    );

    return profile.data;
  }

  function draftFor(kind){
    return mediaDraft[kind==="banner"?"banner":"profile"];
  }

  function revokeDraft(kind){
    const draft=draftFor(kind);

    if(draft.objectUrl){
      try{URL.revokeObjectURL(draft.objectUrl)}catch(_){}
    }

    draft.objectUrl="";
    draft.file=null;
  }

  function resetDraft(){
    ["profile","banner"].forEach(kind=>{
      const draft=draftFor(kind);
      revokeDraft(kind);
      draft.remove=false;
      draft.dirty=false;
    });
  }

  function currentMediaUrl(kind){
    if(!activeProfile)return"";

    if(kind==="banner"){
      return String(
        activeProfile.directory_options?.profile_banner_image_url||
        ""
      ).trim();
    }

    return String(
      activeProfile.profile_image_url||
      activeProfile.story_logo_url||
      ""
    ).trim();
  }

  function effectiveMediaUrl(kind){
    const draft=draftFor(kind);

    if(draft.dirty){
      if(draft.remove)return"";
      if(draft.objectUrl)return draft.objectUrl;
    }

    return currentMediaUrl(kind);
  }

  function renderMediaSlot(kind){
    const preview=
      document.getElementById(
        kind==="banner"
          ?"m7-owner-banner-preview"
          :"m7-owner-profile-preview"
      );

    if(!preview)return;

    const url=effectiveMediaUrl(kind);
    preview.innerHTML="";

    if(url){
      const image=document.createElement("img");
      image.src=url;
      image.alt=
        kind==="banner"
          ?"Banner preview"
          :"Profile preview";
      preview.appendChild(image);
      preview.classList.add("has-image");
    }else{
      const placeholder=document.createElement("span");
      placeholder.textContent=
        kind==="banner"
          ?"Default banner"
          :"Default profile";
      preview.appendChild(placeholder);
      preview.classList.remove("has-image");
    }

    const remove=
      document.getElementById(
        kind==="banner"
          ?"m7-owner-banner-remove"
          :"m7-owner-profile-remove"
      );

    if(remove){
      remove.disabled=
        !url &&
        !draftFor(kind).dirty;
    }
  }

  function renderAllMedia(){
    renderMediaSlot("profile");
    renderMediaSlot("banner");
  }

  function updateSaveState(){
    const save=
      document.getElementById("m7-owner-profile-save");

    if(save){
      save.disabled=
        !mediaDraft.profile.dirty &&
        !mediaDraft.banner.dirty;
    }
  }

  function markFile(kind,file){
    validateImage(file);

    const draft=draftFor(kind);
    revokeDraft(kind);

    draft.file=file;
    draft.objectUrl=URL.createObjectURL(file);
    draft.remove=false;
    draft.dirty=true;

    renderMediaSlot(kind);
    updateSaveState();
  }

  function markRemove(kind){
    const draft=draftFor(kind);
    revokeDraft(kind);

    draft.remove=true;
    draft.dirty=true;

    renderMediaSlot(kind);
    updateSaveState();

    const status=
      document.getElementById("m7-owner-profile-status");

    if(status){
      status.textContent=
        kind==="banner"
          ?"Banner will return to default after Save."
          :"Profile photo will return to default after Save.";
      status.className="";
    }
  }

  function closeStudio(){
    resetDraft();

    const studio=
      document.getElementById("m7-owner-profile-studio");

    studio?.classList.remove("active");

    const status=
      document.getElementById("m7-owner-profile-status");

    if(status){
      status.textContent="";
      status.className="";
    }

    const profileInput=
      document.getElementById("m7-owner-profile-file");
    const bannerInput=
      document.getElementById("m7-owner-banner-file");

    if(profileInput)profileInput.value="";
    if(bannerInput)bannerInput.value="";

    updateSaveState();
  }

  function injectChooser(){
    if(document.getElementById("ma7alak-owner-add-chooser")){
      return;
    }

    const style=document.createElement("style");
    style.id="ma7alak-owner-add-chooser-style";
    style.textContent=`
      #ma7alak-owner-add-chooser,
      #m7-owner-profile-studio{
        position:fixed!important;
        inset:0!important;
        z-index:2147483647!important;
        display:none!important;
        align-items:center!important;
        justify-content:center!important;
        width:100vw!important;
        height:100vh!important;
        height:100dvh!important;
        padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
        background:rgba(3,4,5,.91)!important;
        backdrop-filter:blur(14px)!important;
        -webkit-backdrop-filter:blur(14px)!important;
        font-family:Arial,"Segoe UI",sans-serif!important;
        overflow:auto!important;
        -webkit-overflow-scrolling:touch!important;
        overscroll-behavior:contain!important
      }

      #ma7alak-owner-add-chooser.active,
      #m7-owner-profile-studio.active{
        display:flex!important
      }

      #ma7alak-owner-add-panel,
      #m7-owner-profile-card{
        position:relative!important;
        width:min(470px,100%)!important;
        box-sizing:border-box!important;
        border:1px solid rgba(217,164,65,.30)!important;
        border-radius:24px!important;
        background:
          radial-gradient(circle at 15% 0,rgba(217,164,65,.10),transparent 36%),
          linear-gradient(180deg,#191613,#0d0d0e)!important;
        box-shadow:0 28px 90px rgba(0,0,0,.72)!important;
        color:#fff!important
      }

      #ma7alak-owner-add-panel{
        padding:27px 18px 19px!important;
        text-align:center!important
      }

      #ma7alak-owner-add-close,
      #m7-owner-profile-close{
        position:absolute!important;
        right:12px!important;
        top:11px!important;
        width:40px!important;
        height:40px!important;
        border:1px solid rgba(255,255,255,.10)!important;
        border-radius:50%!important;
        background:rgba(255,255,255,.06)!important;
        color:#fff!important;
        font-size:25px!important;
        line-height:36px!important;
        padding:0!important;
        z-index:4!important;
        touch-action:manipulation!important
      }

      .ma7alak-owner-add-title{
        font-size:22px!important;
        font-weight:900!important;
        margin:3px 42px 4px!important
      }

      .ma7alak-owner-add-sub{
        font-size:12px!important;
        color:rgba(255,255,255,.52)!important;
        margin:0 0 18px!important;
        line-height:1.45!important
      }

      .ma7alak-owner-add-grid{
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:11px!important
      }

      .ma7alak-owner-add-choice{
        min-height:122px!important;
        border:1px solid rgba(255,255,255,.09)!important;
        border-radius:19px!important;
        background:rgba(255,255,255,.045)!important;
        color:#fff!important;
        padding:15px 10px!important;
        font:inherit!important;
        font-weight:900!important;
        cursor:pointer!important;
        -webkit-tap-highlight-color:transparent!important;
        touch-action:manipulation!important
      }

      .ma7alak-owner-add-choice.profile-tool{
        grid-column:1/-1!important;
        min-height:96px!important;
        border-color:rgba(217,164,65,.30)!important;
        background:rgba(217,164,65,.07)!important
      }

      .ma7alak-owner-add-choice[hidden]{
        display:none!important
      }

      .ma7alak-owner-add-choice:active{
        transform:scale(.97)!important
      }

      .ma7alak-owner-add-icon{
        display:block!important;
        font-size:29px!important;
        margin-bottom:7px!important
      }

      .ma7alak-owner-add-choice small{
        display:block!important;
        margin-top:7px!important;
        color:rgba(255,255,255,.46)!important;
        font-size:10px!important;
        font-weight:600!important;
        line-height:1.4!important
      }

      #m7-owner-add-permission{
        min-height:16px;
        margin:11px 2px 0;
        color:#8f816d;
        font-size:9px;
        line-height:1.4
      }

      #m7-owner-profile-card{
        padding:18px!important;
        max-height:calc(100dvh - 28px)!important;
        overflow:auto!important;
        -webkit-overflow-scrolling:touch!important
      }

      .m7ops-head{
        padding:3px 48px 13px 0
      }

      .m7ops-head b{
        display:block;
        font-size:19px
      }

      .m7ops-head small{
        display:block;
        margin-top:4px;
        color:#948773;
        font-size:10px;
        line-height:1.45
      }

      .m7ops-media-grid{
        display:grid;
        grid-template-columns:1fr;
        gap:10px
      }

      .m7ops-media-card{
        padding:12px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:17px;
        background:rgba(255,255,255,.025)
      }

      .m7ops-media-title{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        margin-bottom:9px
      }

      .m7ops-media-title b{
        color:#f0d39a;
        font-size:11px
      }

      .m7ops-media-title small{
        color:#756b5d;
        font-size:8px
      }

      .m7ops-preview{
        display:grid;
        place-items:center;
        overflow:hidden;
        background:#080706;
        color:#746b5e;
        font-size:10px;
        text-align:center
      }

      .m7ops-preview.profile{
        width:116px;
        height:116px;
        margin:0 auto 10px;
        border:3px solid rgba(217,164,65,.75);
        border-radius:50%;
        box-shadow:0 0 20px rgba(217,164,65,.14)
      }

      .m7ops-preview.profile img{
        width:100%;
        height:100%;
        object-fit:cover
      }

      .m7ops-preview.banner{
        width:100%;
        height:118px;
        margin-bottom:10px;
        border:1px solid rgba(217,164,65,.18);
        border-radius:14px
      }

      .m7ops-preview.banner img{
        width:100%;
        height:100%;
        object-fit:cover
      }

      .m7ops-actions{
        display:grid;
        grid-template-columns:1fr auto;
        gap:7px
      }

      .m7ops-pick,
      .m7ops-remove,
      .m7ops-save{
        min-height:42px;
        border-radius:12px;
        font-size:10px;
        font-weight:950;
        touch-action:manipulation;
        cursor:pointer
      }

      .m7ops-pick{
        border:1px solid rgba(217,164,65,.28);
        background:rgba(217,164,65,.08);
        color:#edcb85
      }

      .m7ops-remove{
        min-width:88px;
        border:1px solid rgba(255,120,120,.18);
        background:rgba(255,90,90,.06);
        color:#ffb1b1
      }

      .m7ops-remove:disabled{
        opacity:.38;
        pointer-events:none
      }

      .m7ops-save{
        width:100%;
        min-height:48px;
        margin-top:11px;
        border:0;
        background:linear-gradient(135deg,#f1cf83,#c58b31);
        color:#211507;
        font-size:12px
      }

      .m7ops-save:disabled{
        opacity:.45;
        pointer-events:none
      }

      #m7-owner-profile-file,
      #m7-owner-banner-file{
        position:fixed;
        left:-9999px;
        top:-9999px;
        width:1px;
        height:1px;
        opacity:0
      }

      #m7-owner-profile-status{
        min-height:20px;
        margin:9px 2px 0;
        color:#a99d8a;
        font-size:10px;
        line-height:1.45
      }

      #m7-owner-profile-status.ok{
        color:#80dda5
      }

      #m7-owner-profile-status.err{
        color:#ff9999
      }

      @media(max-width:390px){
        .ma7alak-owner-add-grid{
          grid-template-columns:1fr 1fr!important;
          gap:8px!important
        }

        .ma7alak-owner-add-choice{
          min-height:108px!important;
          padding:12px 8px!important
        }

        .ma7alak-owner-add-choice.profile-tool{
          min-height:88px!important
        }

        .ma7alak-owner-add-icon{
          font-size:25px!important
        }

        #m7-owner-profile-card{
          padding:14px!important
        }

        .m7ops-preview.banner{
          height:104px
        }
      }
    `;
    document.head.appendChild(style);

    const overlay=document.createElement("div");
    overlay.id="ma7alak-owner-add-chooser";
    overlay.innerHTML=`<div id="ma7alak-owner-add-panel">
      <button id="ma7alak-owner-add-close" type="button" aria-label="Close">×</button>
      <div class="ma7alak-owner-add-title">Create & manage</div>
      <div class="ma7alak-owner-add-sub">Choose what you want to update for this shop.</div>

      <div class="ma7alak-owner-add-grid">
        <button id="ma7alak-owner-add-story" class="ma7alak-owner-add-choice" type="button">
          <span class="ma7alak-owner-add-icon">📸</span>
          Add Story
          <small>Disappears automatically after 24 hours</small>
        </button>

        <button id="ma7alak-owner-add-reel" class="ma7alak-owner-add-choice" type="button">
          <span class="ma7alak-owner-add-icon">🔥</span>
          Add Homepage Reel
          <small>Appears in Reels on the homepage</small>
        </button>

        <button id="m7-owner-change-profile" class="ma7alak-owner-add-choice profile-tool" type="button" hidden>
          <span class="ma7alak-owner-add-icon">◉ ▭</span>
          Profile & Banner
          <small>Change or remove both from one place</small>
        </button>
      </div>

      <div id="m7-owner-add-permission" aria-live="polite"></div>
    </div>`;
    document.body.appendChild(overlay);

    const studio=document.createElement("div");
    studio.id="m7-owner-profile-studio";
    studio.innerHTML=`<section id="m7-owner-profile-card">
      <button id="m7-owner-profile-close" type="button" aria-label="Close">×</button>

      <div class="m7ops-head">
        <b>Profile & Banner</b>
        <small>Change either image, remove it to return to the default, then save once.</small>
      </div>

      <div class="m7ops-media-grid">
        <div class="m7ops-media-card">
          <div class="m7ops-media-title">
            <b>Profile photo</b>
            <small>Profile + Show Shops</small>
          </div>

          <div id="m7-owner-profile-preview" class="m7ops-preview profile">
            <span>Default profile</span>
          </div>

          <div class="m7ops-actions">
            <button id="m7-owner-profile-pick" class="m7ops-pick" type="button">Choose photo</button>
            <button id="m7-owner-profile-remove" class="m7ops-remove" type="button">Remove</button>
          </div>

          <input id="m7-owner-profile-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif">
        </div>

        <div class="m7ops-media-card">
          <div class="m7ops-media-title">
            <b>Profile banner</b>
            <small>Profile + Show Shops</small>
          </div>

          <div id="m7-owner-banner-preview" class="m7ops-preview banner">
            <span>Default banner</span>
          </div>

          <div class="m7ops-actions">
            <button id="m7-owner-banner-pick" class="m7ops-pick" type="button">Choose banner</button>
            <button id="m7-owner-banner-remove" class="m7ops-remove" type="button">Remove</button>
          </div>

          <input id="m7-owner-banner-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif">
        </div>
      </div>

      <button id="m7-owner-profile-save" class="m7ops-save" type="button" disabled>Save changes</button>
      <div id="m7-owner-profile-status" aria-live="polite"></div>
    </section>`;
    document.body.appendChild(studio);

    const closeChooser=()=>{
      overlay.classList.remove("active");
    };

    document
      .getElementById("ma7alak-owner-add-close")
      .addEventListener("click",closeChooser);

    overlay.addEventListener("click",event=>{
      if(event.target===overlay)closeChooser();
    });

    document
      .getElementById("m7-owner-profile-close")
      .addEventListener("click",closeStudio);

    studio.addEventListener("click",event=>{
      if(event.target===studio)closeStudio();
    });

    document
      .getElementById("ma7alak-owner-add-story")
      .addEventListener("click",()=>{
        closeChooser();

        window.postMessage({
          type:"MA7ALAK_OPEN_STORY_UPLOADER",
          shopSlug:activeSlug,
          __ma7alakOpenStoryNow:true
        },"*");
      });

    document
      .getElementById("ma7alak-owner-add-reel")
      .addEventListener("click",()=>{
        closeChooser();

        if(
          window.Ma7alakOwnerReels &&
          typeof window.Ma7alakOwnerReels.open==="function"
        ){
          window.Ma7alakOwnerReels
            .open(activeSlug)
            .catch(error=>
              console.error(
                "SHOUFHON Reel uploader:",
                error
              )
            );
        }else{
          window.postMessage({
            type:"MA7ALAK_OPEN_REEL_UPLOADER",
            shopSlug:activeSlug
          },"*");
        }
      });

    document
      .getElementById("m7-owner-change-profile")
      .addEventListener("click",()=>{
        closeChooser();
        openProfileStudio();
      });

    document
      .getElementById("m7-owner-profile-pick")
      .addEventListener("click",()=>{
        document
          .getElementById("m7-owner-profile-file")
          .click();
      });

    document
      .getElementById("m7-owner-banner-pick")
      .addEventListener("click",()=>{
        document
          .getElementById("m7-owner-banner-file")
          .click();
      });

    document
      .getElementById("m7-owner-profile-remove")
      .addEventListener("click",()=>markRemove("profile"));

    document
      .getElementById("m7-owner-banner-remove")
      .addEventListener("click",()=>markRemove("banner"));

    document
      .getElementById("m7-owner-profile-file")
      .addEventListener("change",event=>{
        const status=
          document.getElementById("m7-owner-profile-status");

        try{
          markFile(
            "profile",
            event.target.files?.[0]||null
          );

          status.textContent=
            "Profile photo ready. Press Save changes.";
          status.className="";
        }catch(error){
          event.target.value="";
          status.textContent=
            error.message||"Invalid profile image.";
          status.className="err";
        }
      });

    document
      .getElementById("m7-owner-banner-file")
      .addEventListener("change",event=>{
        const status=
          document.getElementById("m7-owner-profile-status");

        try{
          markFile(
            "banner",
            event.target.files?.[0]||null
          );

          status.textContent=
            "Banner ready. Press Save changes.";
          status.className="";
        }catch(error){
          event.target.value="";
          status.textContent=
            error.message||"Invalid banner image.";
          status.className="err";
        }
      });

    document
      .getElementById("m7-owner-profile-save")
      .addEventListener("click",saveProfileMedia);
  }

  function openProfileStudio(){
    injectChooser();
    resetDraft();
    renderAllMedia();
    updateSaveState();

    const status=
      document.getElementById("m7-owner-profile-status");

    if(status){
      status.textContent="";
      status.className="";
    }

    document
      .getElementById("m7-owner-profile-studio")
      ?.classList
      .add("active");
  }

  async function uploadReplacement(file,kind){
    validateImage(file);

    const c=await getClient();
    const ext=imageExtension(file);
    const folder=
      kind==="banner"
        ?"owner-banner"
        :"owner-profile";

    const path=
      folder+"/"+
      activeSlug+"/"+
      Date.now()+"-"+
      Math.random().toString(36).slice(2,10)+
      "."+ext;

    const upload=
      await c
        .storage
        .from(IMAGE_BUCKET)
        .upload(
          path,
          file,
          {
            cacheControl:"31536000",
            upsert:false,
            contentType:file.type||undefined
          }
        );

    if(upload.error)throw upload.error;

    const publicResult=
      c
        .storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(path);

    const publicUrl=
      publicResult.data?.publicUrl||"";

    if(!publicUrl){
      await c
        .storage
        .from(IMAGE_BUCKET)
        .remove([path])
        .catch(()=>{});

      throw new Error(
        "Could not create the new image URL."
      );
    }

    return{path,publicUrl};
  }

  async function saveProfileMedia(){
    const save=
      document.getElementById("m7-owner-profile-save");

    const status=
      document.getElementById("m7-owner-profile-status");

    const profileChanged=mediaDraft.profile.dirty;
    const bannerChanged=mediaDraft.banner.dirty;

    if(
      !activeSlug ||
      (!profileChanged&&!bannerChanged)
    ){
      return;
    }

    save.disabled=true;
    save.textContent="Saving…";
    status.textContent="Saving profile…";
    status.className="";

    let uploadedProfile=null;
    let uploadedBanner=null;

    try{
      const c=await getClient();

      await loadOwnerProfile(activeSlug);

      if(!profileEditAllowed){
        throw new Error(
          "Profile editing is disabled for this shop."
        );
      }

      const oldProfile=
        String(
          activeProfile.profile_image_url||
          ""
        ).trim();

      const oldStoryLogo=
        String(
          activeProfile.story_logo_url||
          ""
        ).trim();

      const oldBanner=
        String(
          activeProfile.directory_options
            ?.profile_banner_image_url||
          ""
        ).trim();

      if(
        profileChanged &&
        !mediaDraft.profile.remove &&
        mediaDraft.profile.file
      ){
        status.textContent=
          "Uploading profile photo…";

        uploadedProfile=
          await uploadReplacement(
            mediaDraft.profile.file,
            "profile"
          );
      }

      if(
        bannerChanged &&
        !mediaDraft.banner.remove &&
        mediaDraft.banner.file
      ){
        status.textContent=
          "Uploading banner…";

        uploadedBanner=
          await uploadReplacement(
            mediaDraft.banner.file,
            "banner"
          );
      }

      const profileValue=
        profileChanged
          ?(
              mediaDraft.profile.remove
                ?""
                :uploadedProfile?.publicUrl||""
            )
          :null;

      const bannerValue=
        bannerChanged
          ?(
              mediaDraft.banner.remove
                ?""
                :uploadedBanner?.publicUrl||""
            )
          :null;

      const rpc=
        await c.rpc(
          "owner_update_profile_media",
          {
            p_shop_slug:activeSlug,
            p_profile_image_url:profileValue,
            p_banner_image_url:bannerValue,
            p_update_profile:profileChanged,
            p_update_banner:bannerChanged
          }
        );

      if(rpc.error)throw rpc.error;

      if(profileChanged){
        await cleanupOldImage(
          oldProfile,
          activeSlug
        );

        if(
          oldStoryLogo &&
          oldStoryLogo!==oldProfile
        ){
          await cleanupOldImage(
            oldStoryLogo,
            activeSlug
          );
        }
      }

      if(bannerChanged){
        await cleanupOldImage(
          oldBanner,
          activeSlug
        );
      }

      await loadOwnerProfile(activeSlug);

      ownerProfileCache.set(
        activeSlug.toLowerCase(),
        activeProfile
      );

      resetDraft();
      renderAllMedia();
      updateSaveState();

      status.textContent=
        "Profile saved.";
      status.className="ok";

      try{
        originalSource?.postMessage({
          type:"MA7ALAK_OWNER_PROFILE_UPDATED",
          shopSlug:activeSlug,
          mode:"profile-media",
          profileChanged,
          bannerChanged
        },"*");
      }catch(_){}

      try{
        window.Ma7alakDirectory
          ?.refresh?.();
      }catch(_){}

      setTimeout(()=>{
        document
          .getElementById("m7-owner-profile-studio")
          ?.classList
          .remove("active");
      },650);
    }catch(error){
      if(uploadedProfile?.path){
        try{
          await (await getClient())
            .storage
            .from(IMAGE_BUCKET)
            .remove([uploadedProfile.path]);
        }catch(_){}
      }

      if(uploadedBanner?.path){
        try{
          await (await getClient())
            .storage
            .from(IMAGE_BUCKET)
            .remove([uploadedBanner.path]);
        }catch(_){}
      }

      status.textContent=
        error?.message||
        "Could not update profile media.";
      status.className="err";
      save.disabled=false;
    }finally{
      save.textContent="Save changes";
    }
  }

  async function showChooser(slug,source){
    activeSlug=
      String(slug||"").trim();

    originalSource=source||null;

    if(!activeSlug)return;

    injectChooser();

    const overlay=
      document.getElementById(
        "ma7alak-owner-add-chooser"
      );

    const profileButton=
      document.getElementById(
        "m7-owner-change-profile"
      );

    const permission=
      document.getElementById(
        "m7-owner-add-permission"
      );

    const cacheKey=
      activeSlug.toLowerCase();

    const cached=
      ownerProfileCache.get(cacheKey)||
      null;

    if(cached){
      activeProfile=cached;

      profileEditAllowed=
        bool(
          cached.directory_options
            ?.owner_profile_edit_enabled
        );

      profileButton.hidden=
        !profileEditAllowed;

      permission.textContent=
        profileEditAllowed
          ?"Profile editing is enabled by Admin."
          :"Profile/banner editing is currently locked by Admin.";
    }else{
      profileButton.hidden=true;
      permission.textContent=
        "Checking your shop permissions…";
    }

    overlay.classList.add("active");

    try{
      await loadOwnerProfile(activeSlug);

      profileButton.hidden=
        !profileEditAllowed;

      permission.textContent=
        profileEditAllowed
          ?"Profile editing is enabled by Admin."
          :"Profile/banner editing is currently locked by Admin.";
    }catch(error){
      if(!cached){
        profileEditAllowed=false;

        permission.textContent=
          error?.message||
          "Could not check profile editing permission.";
      }
    }
  }

  window.addEventListener(
    "message",
    event=>{
      if(!window.ShoufHonMessageSecurity?.isTrustedEvent(event,true))return;
      const data=event.data||{};

      if(data.type==="MA7ALAK_OWNER_STATE"){
        const ownerSlug=
          String(data.shopSlug||"")
            .trim()
            .toLowerCase();

        if(
          data.isOwner &&
          ownerSlug &&
          data.shop
        ){
          ownerProfileCache.set(
            ownerSlug,
            data.shop
          );
        }

        return;
      }

      if(
        data.type!==
        "MA7ALAK_OPEN_STORY_UPLOADER"
      ){
        return;
      }

      if(
        data.__ma7alakOpenStoryNow===true &&
        (!event.source||event.source===window)
      ){
        return;
      }

      const slug=
        String(data.shopSlug||"").trim();

      if(!slug)return;

      event.stopImmediatePropagation();

      showChooser(
        slug,
        event.source
      );
    },
    true
  );

  document.addEventListener(
    "keydown",
    event=>{
      if(event.key!=="Escape")return;

      document
        .getElementById("ma7alak-owner-add-chooser")
        ?.classList
        .remove("active");

      if(
        document
          .getElementById("m7-owner-profile-studio")
          ?.classList
          .contains("active")
      ){
        closeStudio();
      }
    }
  );
})();

/* =========================================================
   SHOUFHON — OWNER HOMEPAGE REEL UPLOADER
   Separate from Stories. Does NOT modify the Story uploader.

   Load on the existing owner dashboard/page after login.
   It identifies the shop from shop_owners + auth.uid().
   ========================================================= */
(function(){
  "use strict";

  if(window.__MA7ALAK_OWNER_REEL_UPLOADER__) return;
  window.__MA7ALAK_OWNER_REEL_UPLOADER__ = true;

  const SUPABASE_URL = "https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_KEY = "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const STORAGE_BUCKET = "shop-videos";
  const MAX_FILE_MB = 100;

  let client = null;
  let clientReadyPromise = null;
  let ownerInfo = null;
  let pendingPath = "";

  function esc(v){
    return String(v == null ? "" : v)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function cleanName(name){
    return String(name || "reel")
      .replace(/\.[^.]+$/,"")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g,"-")
      .replace(/-+/g,"-")
      .replace(/^-|-$/g,"") || "reel";
  }

  function extension(file){
    const x = String(file && file.name || "").split(".").pop().toLowerCase();
    if(["mp4","webm","mov"].includes(x)) return x;
    if(file && file.type === "video/webm") return "webm";
    if(file && file.type === "video/quicktime") return "mov";
    return "mp4";
  }

  function status(message,type){
    const el=document.getElementById("ma-owner-reel-status");
    if(!el) return;
    el.textContent=message || "";
    el.className="ma-owner-reel-status"+(type ? " is-"+type : "");
  }

  async function ensureReelClient(){
    if(client)return client;
    if(clientReadyPromise)return clientReadyPromise;

    clientReadyPromise=(async function(){
      try{
        if(window.Ma7alakAccount?.ready)await window.Ma7alakAccount.ready();
      }catch(_){}
      try{
        if(window.Ma7alakSupabaseBootstrap?.ready)await window.Ma7alakSupabaseBootstrap.ready();
      }catch(_){}

      client=
        window.Ma7alakAccount?.client||
        window.Ma7alakOwnerAuth?.client||
        window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
        null;

      if(client)return client;

      await ensureSupabase();
      client=
        window.Ma7alakAccount?.client||
        window.Ma7alakOwnerAuth?.client||
        window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
        window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__=
        window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||client;

      return client;
    })();

    try{
      return await clientReadyPromise;
    }finally{
      clientReadyPromise=null;
    }
  }

  function ensureSupabase(){
    return new Promise(function(resolve,reject){
      if(window.supabase && typeof window.supabase.createClient === "function") return resolve();
      const existing=document.querySelector('script[src*="@supabase/supabase-js"]');
      if(existing){
        const started=Date.now();
        const timer=setInterval(function(){
          if(window.supabase && typeof window.supabase.createClient === "function"){ clearInterval(timer); resolve(); }
          else if(Date.now()-started>15000){ clearInterval(timer); reject(new Error("Supabase did not load.")); }
        },100);
        return;
      }
      const script=document.createElement("script");
      script.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async=true;
      script.onload=resolve;
      script.onerror=function(){reject(new Error("Could not load Supabase."));};
      document.head.appendChild(script);
    });
  }

  function inject(){
    const style=document.createElement("style");
    style.textContent=`
      #ma-owner-reels-card{position:fixed;z-index:2147483647;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,calc(100vw - 24px));max-height:92vh;overflow:auto;margin:0;padding:18px;border:1px solid rgba(255,183,77,.24);border-radius:22px;background:linear-gradient(145deg,#1a110d,#28170f);color:#fff;font-family:Arial,sans-serif;box-shadow:0 18px 45px rgba(0,0,0,.25)}
      #ma-owner-reels-card *{box-sizing:border-box} .ma-or-head{display:flex;gap:12px;align-items:center;margin-bottom:14px}.ma-or-head b{font-size:20px}.ma-or-head span{font-size:26px}.ma-or-sub{opacity:.72;font-size:13px;margin-top:3px}
      .ma-or-quota{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:13px 14px;border-radius:16px;background:rgba(255,255,255,.055);margin-bottom:14px}.ma-or-quota strong{color:#ffc46b}.ma-or-count{font-size:20px;font-weight:900}
      .ma-or-field{display:block;margin:12px 0}.ma-or-field span{display:block;font-size:13px;font-weight:800;margin-bottom:7px}.ma-or-field input{width:100%;padding:13px;border-radius:13px;border:1px solid rgba(255,255,255,.13);background:#100b08;color:#fff;font-size:16px;outline:none}
      .ma-or-upload,.ma-or-publish{width:100%;border:0;border-radius:15px;padding:14px;font-size:15px;font-weight:900;cursor:pointer}.ma-or-upload{display:block;text-align:center;background:#3b2518;color:#ffd59a;margin:10px 0}.ma-or-publish{background:linear-gradient(135deg,#ffb347,#d77a20);color:#211007}.ma-or-publish:disabled,.ma-or-upload:disabled,.ma-or-upload.is-disabled{opacity:.45;pointer-events:none}
      .ma-owner-reel-status{min-height:20px;margin:10px 0;font-size:13px}.ma-owner-reel-status.is-error{color:#ff8c8c}.ma-owner-reel-status.is-success{color:#8ff0a4}
      .ma-or-list{display:grid;gap:10px;margin-top:14px}.ma-or-item{display:grid;grid-template-columns:88px 1fr auto;gap:10px;align-items:center;padding:10px;border-radius:15px;background:rgba(255,255,255,.05)}.ma-or-item video{width:88px;height:120px;object-fit:cover;border-radius:11px;background:#000}.ma-or-meta{min-width:0}.ma-or-meta b{display:block;overflow:hidden;text-overflow:ellipsis}.ma-or-meta small{opacity:.62}.ma-or-delete{border:1px solid rgba(255,100,100,.35);background:rgba(130,20,20,.2);color:#ffb0b0;border-radius:11px;padding:9px;cursor:pointer}
      #ma-owner-reels-backdrop{position:fixed;z-index:2147483646;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);overscroll-behavior:none;touch-action:none} .ma-or-close{position:absolute;right:12px;top:10px;width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;font-size:25px;cursor:pointer}
      @media(max-width:560px){#ma-owner-reels-card{width:calc(100vw - 18px);margin:0;padding:15px;border-radius:18px}.ma-or-item{grid-template-columns:70px 1fr}.ma-or-item video{width:70px;height:98px}.ma-or-delete{grid-column:2;width:100%}}
    `;
    document.head.appendChild(style);

    const backdrop=document.createElement("div");
    backdrop.id="ma-owner-reels-backdrop";
    backdrop.hidden=true;
    document.body.appendChild(backdrop);

    const card=document.createElement("section");
    card.id="ma-owner-reels-card";
    card.hidden=true;
    card.innerHTML=`
      <button id="ma-or-close" class="ma-or-close" type="button" aria-label="Close">×</button>
      <div class="ma-or-head"><span>🔥</span><div><b>Homepage Reels</b><div class="ma-or-sub" id="ma-or-shop">Checking owner account…</div></div></div>
      <div class="ma-or-quota"><div><strong>Your Reel quota</strong><div class="ma-or-sub">Active homepage Reels</div></div><div class="ma-or-count" id="ma-or-quota">0 / 0</div></div>
      <button id="ma-or-upload-label" class="ma-or-upload" type="button">📱 Choose Reel from device</button>
      <input id="ma-or-file" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" style="position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none">
      <label class="ma-or-field"><span>Video URL</span><input id="ma-or-url" type="url" inputmode="url" placeholder="Upload from device or paste a direct MP4 URL"></label>
      <label class="ma-or-field"><span>Caption (optional)</span><input id="ma-or-caption" type="text" maxlength="180" placeholder="Fresh today 🔥"></label>
      <button id="ma-or-publish" class="ma-or-publish" type="button">Publish to Homepage</button>
      <div id="ma-owner-reel-status" class="ma-owner-reel-status" aria-live="polite"></div>
      <div class="ma-or-list" id="ma-or-list"></div>`;

    const mount=document.getElementById("ma7alak-owner-reels-mount");
    (mount || document.body).appendChild(card);
  }

  async function quota(){
    const {data,error}=await client.rpc("get_my_reel_quota");
    if(error) throw error;
    const row=Array.isArray(data) ? data[0] : data;
    if(!row) throw new Error("No shop is linked to this owner account.");
    ownerInfo=row;
    document.getElementById("ma-or-shop").textContent=(row.shop_name || row.shop_slug)+"  /"+row.shop_slug;
    document.getElementById("ma-or-quota").textContent=Number(row.active_reels||0)+" / "+Number(row.reel_limit||0);
    const blocked=Number(row.remaining||0)<=0;
    document.getElementById("ma-or-publish").disabled=blocked;
    const uploadButton=document.getElementById("ma-or-upload-label");
    uploadButton.classList.toggle("is-disabled",blocked);
    uploadButton.disabled=blocked;
    if(Number(row.reel_limit||0)<=0) status("Homepage Reels are not enabled for your shop yet.");
    else if(blocked) status("You reached your Reel limit. Delete one below to free a slot.");
    else status("");
    return row;
  }

  async function list(){
    if(!ownerInfo) return;
    const {data,error}=await client.from("shop_reels")
      .select("reel_id,video_url,caption,active,created_at")
      .eq("shop_slug",ownerInfo.shop_slug)
      .eq("active",true)
      .order("created_at",{ascending:false});
    if(error) throw error;
    const box=document.getElementById("ma-or-list");
    const rows=data||[];
    if(!rows.length){ box.innerHTML='<div class="ma-or-sub">No homepage Reels yet.</div>'; return; }
    box.innerHTML=rows.map(function(r){
      return '<article class="ma-or-item" data-id="'+esc(r.reel_id)+'"><video muted playsinline preload="metadata" src="'+esc(r.video_url)+'"></video><div class="ma-or-meta"><b>'+esc(r.caption||"Reel")+'</b><small>'+(r.active===false?"Hidden":"Live")+'</small></div><button class="ma-or-delete" type="button">Delete</button></article>';
    }).join("");
  }

  async function cleanup(path){
    if(!path) return;
    try{ await client.storage.from(STORAGE_BUCKET).remove([path]); }catch(_){ }
  }

  function storagePathFromUrl(url){
    const marker="/storage/v1/object/public/"+STORAGE_BUCKET+"/";
    const i=String(url||"").indexOf(marker);
    if(i<0) return "";
    try{return decodeURIComponent(String(url).slice(i+marker.length).split("?")[0]);}catch(_){return "";}
  }

  async function upload(file){
    if(!ownerInfo) return;
    if(Number(ownerInfo.remaining||0)<=0) throw new Error("You reached your Reel limit.");
    const ext=extension(file);
    if(!["mp4","webm","mov"].includes(ext)) throw new Error("Only MP4, WEBM and MOV videos are allowed.");
    if(file.size > MAX_FILE_MB*1024*1024) throw new Error("Reel is too large. Maximum is "+MAX_FILE_MB+" MB.");
    if(pendingPath) await cleanup(pendingPath);
    const path="reels/"+ownerInfo.shop_slug+"/"+Date.now()+"-"+Math.random().toString(36).slice(2,9)+"-"+cleanName(file.name)+"."+ext;
    status("Uploading Reel…");
    const {error}=await client.storage.from(STORAGE_BUCKET).upload(path,file,{cacheControl:"31536000",upsert:false,contentType:file.type||undefined});
    if(error) throw error;
    const {data}=client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    if(!data || !data.publicUrl){ await cleanup(path); throw new Error("Could not create Reel URL."); }
    pendingPath=path;
    document.getElementById("ma-or-url").value=data.publicUrl;
    status("Upload complete. Add a caption if you want, then publish.","success");
  }

  async function publish(){
    const btn=document.getElementById("ma-or-publish");
    const url=document.getElementById("ma-or-url").value.trim();
    const caption=document.getElementById("ma-or-caption").value.trim();
    if(!/^https?:\/\//i.test(url)) throw new Error("Upload a Reel or enter a valid direct video URL.");
    btn.disabled=true; btn.textContent="Publishing…"; status("Publishing to homepage…");
    try{
      const {error}=await client.rpc("publish_my_reel",{p_video_url:url,p_caption:caption});
      if(error) throw error;
      pendingPath="";
      document.getElementById("ma-or-file").value="";
      document.getElementById("ma-or-url").value="";
      document.getElementById("ma-or-caption").value="";
      await quota(); await list();
      status("Reel published to the homepage successfully.","success");
    }catch(error){
      if(pendingPath){ await cleanup(pendingPath); pendingPath=""; document.getElementById("ma-or-url").value=""; }
      throw error;
    }finally{ btn.textContent="Publish to Homepage"; if(ownerInfo && Number(ownerInfo.remaining||0)>0) btn.disabled=false; }
  }

  async function removeReel(id,button){
    if(!window.confirm("Permanently delete this homepage Reel?")) return;
    button.disabled=true;
    try{
      const target=await client
        .from("shop_reels")
        .select("reel_id,video_url")
        .eq("reel_id",id)
        .eq("shop_slug",ownerInfo.shop_slug)
        .maybeSingle();

      if(target.error) throw target.error;
      if(!target.data) throw new Error("Reel not found.");

      const path=storagePathFromUrl(target.data.video_url);

      if(path && path.indexOf("reels/"+ownerInfo.shop_slug+"/")===0){
        const storageResult=await client.storage.from(STORAGE_BUCKET).remove([path]);
        if(storageResult.error) throw storageResult.error;
      }

      const {error}=await client.rpc("delete_my_reel",{p_reel_id:id});
      if(error) throw error;

      await quota();
      await list();
      status("Reel permanently deleted. One quota slot is free again.","success");
    }catch(error){
      status(error.message||"Could not delete Reel.","error");
      button.disabled=false;
    }
  }

  let pageScrollY=0;
  let pageLockState=null;

  function lockPageScroll(){
    if(pageLockState) return;
    pageScrollY=window.scrollY || window.pageYOffset || 0;
    pageLockState={
      htmlOverflow:document.documentElement.style.overflow,
      bodyOverflow:document.body.style.overflow,
      bodyPosition:document.body.style.position,
      bodyTop:document.body.style.top,
      bodyWidth:document.body.style.width
    };
    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";
    document.body.style.position="fixed";
    document.body.style.top=(-pageScrollY)+"px";
    document.body.style.width="100%";
  }

  function unlockPageScroll(){
    if(!pageLockState) return;
    document.documentElement.style.overflow=pageLockState.htmlOverflow;
    document.body.style.overflow=pageLockState.bodyOverflow;
    document.body.style.position=pageLockState.bodyPosition;
    document.body.style.top=pageLockState.bodyTop;
    document.body.style.width=pageLockState.bodyWidth;
    const y=pageScrollY;
    pageLockState=null;
    window.scrollTo(0,y);
  }

  function closePanel(){
    const card=document.getElementById("ma-owner-reels-card");
    const backdrop=document.getElementById("ma-owner-reels-backdrop");
    if(card) card.hidden=true;
    if(backdrop) backdrop.hidden=true;
    unlockPageScroll();
  }

  async function openPanel(requestedSlug){
    /*
       Open the panel immediately on the user's tap so mobile never looks dead.
       Owner/client/quota loading continues with visible status feedback.
    */
    lockPageScroll();
    document.getElementById("ma-owner-reels-backdrop").hidden=false;
    document.getElementById("ma-owner-reels-card").hidden=false;
    status("Loading Reel uploader…");

    try{
      client=await ensureReelClient();
      const {data:{user}}=await client.auth.getUser();
      if(!user) throw new Error("You must be signed in.");
      await quota();
      if(requestedSlug && ownerInfo && String(ownerInfo.shop_slug)!==String(requestedSlug)){
        throw new Error("This owner account is not linked to this shop.");
      }
      await list();
      status("");
    }catch(error){
      status(error?.message||"Could not open Reel uploader.","error");
      throw error;
    }
  }

  async function start(){
    inject();

    /*
       Bind UI + public API BEFORE any network/auth preload.
       Add Reel must always react immediately to a phone tap.
    */
    window.Ma7alakOwnerReels={open:openPanel,close:closePanel};

    document.getElementById("ma-or-close").addEventListener("click",closePanel);
    document.getElementById("ma-owner-reels-backdrop").addEventListener("click",closePanel);
    document.getElementById("ma-or-upload-label").addEventListener("click",function(){
      if(this.disabled || this.classList.contains("is-disabled")) return;
      const input=document.getElementById("ma-or-file");
      if(input) input.click();
    });
    document.getElementById("ma-or-file").addEventListener("change",async function(){
      const file=this.files&&this.files[0]; if(!file) return;
      try{await upload(file);}catch(error){status(error.message||"Upload failed.","error");this.value="";}
    });
    document.getElementById("ma-or-publish").addEventListener("click",async function(){
      try{await publish();}catch(error){status(error.message||"Could not publish Reel.","error"); try{await quota();}catch(_){} }
    });
    document.getElementById("ma-or-list").addEventListener("click",function(e){
      const btn=e.target.closest(".ma-or-delete"); if(!btn) return;
      const row=btn.closest("[data-id]"); if(row) removeReel(row.dataset.id,btn);
    });

    window.addEventListener("message",function(event){
      if(!window.ShoufHonMessageSecurity?.isTrustedEvent(event,true)) return;
      if(!event.data || event.data.type!=="MA7ALAK_OPEN_REEL_UPLOADER") return;
      openPanel(String(event.data.shopSlug||"").trim()).catch(function(error){
        console.error("SHOUFHON Reel uploader:",error);
      });
    });

    try{
      client=await ensureReelClient();
      const {data:{user}}=await client.auth.getUser();
      if(user){
        await quota();
        await list();
      }
    }catch(error){
      console.warn("SHOUFHON owner Reel preload:",error);
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();


/* =========================================================
   SHOUFHON — EMBED VIEWER PORTAL V4
   Hostinger-safe viewport promotion.
   The immediate Custom Embed wrapper becomes the fixed viewport host;
   the iframe itself fills that host. Ancestors are only unclipped.
   This avoids the boxed/offset Story viewer while still avoiding the
   browser Fullscreen API and its Android/iOS system banner.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_EMBED_VIEWER_PORTAL_V4__){
    return;
  }
  window.__SHOUFHON_EMBED_VIEWER_PORTAL_V4__ = true;

  const activeFrames=new Map();
  let savedPageOverflow=null;
  let suppressNextViewerPop=false;
  let ownerMediaScrollRestoreTimer=0;

  function ensureStyle(){
    if(document.getElementById("shoufhon-embed-viewer-portal-css")){
      return;
    }

    const style=document.createElement("style");
    style.id="shoufhon-embed-viewer-portal-css";
    style.textContent=`
      .shoufhon-embed-viewer-host{
        position:fixed!important;
        inset:0!important;
        top:0!important;
        left:0!important;
        right:0!important;
        bottom:0!important;
        width:100vw!important;
        height:100vh!important;
        height:100dvh!important;
        max-width:none!important;
        max-height:none!important;
        min-width:0!important;
        min-height:0!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:0!important;
        overflow:visible!important;
        background:#000!important;
        z-index:2147483646!important;
        transform:none!important;
        -webkit-transform:none!important;
        translate:none!important;
        scale:none!important;
        rotate:none!important;
        filter:none!important;
        -webkit-filter:none!important;
        perspective:none!important;
        contain:none!important;
        clip-path:none!important;
        -webkit-clip-path:none!important;
        isolation:isolate!important;
      }

      .shoufhon-embed-viewer-host > iframe.shoufhon-embed-viewer-frame,
      iframe.shoufhon-embed-viewer-frame{
        position:absolute!important;
        inset:0!important;
        top:0!important;
        left:0!important;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        max-height:none!important;
        min-width:0!important;
        min-height:0!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:0!important;
        display:block!important;
        background:#000!important;
        transform:none!important;
        -webkit-transform:none!important;
        opacity:1!important;
        visibility:visible!important;
      }

      /*
         Edit Media must cover the physical phone viewport, not merely the
         Hostinger embed rectangle. Keep this special rule scoped to Media so
         Story/other viewers retain their existing portal behavior.
      */
      .shoufhon-owner-media-editor-host{
        overflow:hidden!important;
        width:100vw!important;
        width:100dvw!important;
        height:100vh!important;
        height:100dvh!important;
        background:#050506!important;
      }

      iframe.shoufhon-owner-media-editor-frame{
        position:fixed!important;
        inset:0!important;
        top:0!important;
        left:0!important;
        right:0!important;
        bottom:0!important;
        width:100vw!important;
        width:100dvw!important;
        height:100vh!important;
        height:100dvh!important;
        max-width:none!important;
        max-height:none!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:0!important;
        background:#050506!important;
        z-index:2147483647!important;
        transform:none!important;
        -webkit-transform:none!important;
      }

      /*
         OWNER MEDIA ISOLATION
         Hostinger's fixed global header / Live panel can use equally high
         z-index values. Hiding every sibling outside the active embed path is
         more reliable than another z-index fight and is fully reversible.
      */
      body.shoufhon-owner-media-editor-open >
      *:not(.shoufhon-embed-viewer-ancestor):not(.shoufhon-owner-media-editor-host){
        visibility:hidden!important;
        pointer-events:none!important;
      }

      body.shoufhon-owner-media-editor-open
      .shoufhon-embed-viewer-ancestor >
      *:not(.shoufhon-embed-viewer-ancestor):not(.shoufhon-owner-media-editor-host){
        visibility:hidden!important;
        pointer-events:none!important;
      }

      body.shoufhon-owner-media-editor-open
      .shoufhon-owner-media-editor-host,
      body.shoufhon-owner-media-editor-open
      .shoufhon-owner-media-editor-host *{
        visibility:visible!important;
      }

      .shoufhon-embed-viewer-ancestor{
        overflow:visible!important;
        transform:none!important;
        -webkit-transform:none!important;
        translate:none!important;
        scale:none!important;
        rotate:none!important;
        filter:none!important;
        -webkit-filter:none!important;
        perspective:none!important;
        contain:none!important;
        clip-path:none!important;
        -webkit-clip-path:none!important;
        mask:none!important;
        -webkit-mask:none!important;
        isolation:auto!important;
      }

      html.shoufhon-embed-viewer-open,
      body.shoufhon-embed-viewer-open{
        overflow:hidden!important;
        overscroll-behavior:none!important;
        touch-action:none!important;
        background:#000!important;
        transform:none!important;
        -webkit-transform:none!important;
        filter:none!important;
        -webkit-filter:none!important;
        perspective:none!important;
        contain:none!important;
        clip-path:none!important;
        -webkit-clip-path:none!important;
      }
    `;

    document.head.appendChild(style);
  }

  function frameForSource(source){
    if(!source){
      return null;
    }

    /*
       Hostinger may nest Custom Embed iframes. event.source can therefore be
       a descendant WindowProxy instead of the direct iframe mounted on the
       page. Walk the WindowProxy parent chain until we reach the top page,
       then match that direct child against the real Hostinger iframe.
    */
    let directChild=source;

    try{
      let cursor=source;

      for(let hop=0;hop<12;hop+=1){
        if(!cursor||cursor===window){
          break;
        }

        const parentWindow=cursor.parent;

        if(!parentWindow||parentWindow===cursor){
          break;
        }

        if(parentWindow===window){
          directChild=cursor;
          break;
        }

        cursor=parentWindow;
      }
    }
    catch(_){}

    return Array.from(document.querySelectorAll("iframe")).find(function(frame){
      try{
        return (
          frame.contentWindow===source ||
          frame.contentWindow===directChild
        );
      }
      catch(_){
        return false;
      }
    })||null;
  }

  function syncOwnerMediaIsolation(){
    const open=Array.from(activeFrames.values()).some(function(state){
      return state&&(state.viewerKind==="owner-media-editor"||state.viewerKind==="owner-catalog-editor");
    });

    document.documentElement.classList.toggle(
      "shoufhon-owner-media-editor-open",
      open
    );
    document.body.classList.toggle(
      "shoufhon-owner-media-editor-open",
      open
    );
  }

  function openFrame(source,data){
    const frame=frameForSource(source);

    if(!frame||activeFrames.has(frame)){
      return;
    }

    const host=frame.parentElement;

    if(!host){
      return;
    }

    ensureStyle();

    const ancestors=[];
    let node=host.parentElement;

    while(
      node &&
      node!==document.body &&
      node!==document.documentElement
    ){
      ancestors.push({
        node:node,
        hadClass:node.classList.contains("shoufhon-embed-viewer-ancestor")
      });

      node.classList.add("shoufhon-embed-viewer-ancestor");
      node=node.parentElement;
    }

    const state={
      source:source,
      host:host,
      hostHadClass:host.classList.contains("shoufhon-embed-viewer-host"),
      frameHadClass:frame.classList.contains("shoufhon-embed-viewer-frame"),
      ancestors:ancestors,
      viewerKind:String(data&&data.viewerKind||""),
      shopSlug:String(data&&data.shopSlug||""),
      historyArmed:false,
      scrollX:Number(window.scrollX||0),
      scrollY:Number(window.scrollY||0),
      previousScrollRestoration:
        ("scrollRestoration" in history)
          ?String(history.scrollRestoration||"auto")
          :""
    };

    activeFrames.set(frame,state);
    syncOwnerMediaIsolation();

    if(savedPageOverflow===null){
      const htmlOverflow=document.documentElement.style.overflow;
      const bodyOverflow=document.body.style.overflow;
      const htmlPriority=document.documentElement.style.getPropertyPriority("overflow");
      const bodyPriority=document.body.style.getPropertyPriority("overflow");

      /*
         Older Story embeds could promote the iframe directly BEFORE this
         portal opened, temporarily setting both parent overflow values to
         hidden!important. Never save that temporary lock as the page's
         original scroll state.
      */
      const looksLikePrePromotedLock=
        htmlOverflow==="hidden" &&
        bodyOverflow==="hidden" &&
        htmlPriority==="important" &&
        bodyPriority==="important";

      savedPageOverflow={
        html:looksLikePrePromotedLock?"":htmlOverflow,
        body:looksLikePrePromotedLock?"":bodyOverflow,
        htmlPriority:looksLikePrePromotedLock?"":htmlPriority,
        bodyPriority:looksLikePrePromotedLock?"":bodyPriority
      };
    }

    host.classList.add("shoufhon-embed-viewer-host");
    frame.classList.add("shoufhon-embed-viewer-frame");

    if((state.viewerKind==="owner-media-editor"||state.viewerKind==="owner-catalog-editor")){
      host.classList.add("shoufhon-owner-media-editor-host");
      frame.classList.add("shoufhon-owner-media-editor-frame");
    }

    document.documentElement.classList.add("shoufhon-embed-viewer-open");
    document.body.classList.add("shoufhon-embed-viewer-open");

    if((state.viewerKind==="owner-media-editor"||state.viewerKind==="owner-catalog-editor")){
      /*
         Same-document history.back() can restore an older scroll position
         before Hostinger has finished demoting the fullscreen Media iframe.
         Keep history restoration manual only for the lifetime of this editor.
      */
      try{
        if("scrollRestoration" in history){
          history.scrollRestoration="manual";
        }
      }catch(_){}

      try{
        const base=
          history.state &&
          typeof history.state==="object"
            ? history.state
            : {};

        history.pushState(
          {...base,__shoufhonEmbedViewer:"owner-media-editor"},
          "",
          location.href
        );

        state.historyArmed=true;
      }catch(_){}
    }
  }

  function closeFrame(source,options={}){
    const frame=frameForSource(source);
    const fromPopstate=options.fromPopstate===true;

    if(!frame){
      if(activeFrames.size===0){
        document.documentElement.classList.remove("shoufhon-embed-viewer-open");
        document.body.classList.remove("shoufhon-embed-viewer-open");
        document.documentElement.classList.remove("shoufhon-owner-media-editor-open");
        document.body.classList.remove("shoufhon-owner-media-editor-open");
        if(savedPageOverflow){
          const restoreOverflow=function(node,value,priority){
            if(value)node.style.setProperty("overflow",value,priority||"");
            else node.style.removeProperty("overflow");
          };
          restoreOverflow(document.documentElement,savedPageOverflow.html,savedPageOverflow.htmlPriority);
          restoreOverflow(document.body,savedPageOverflow.body,savedPageOverflow.bodyPriority);
          savedPageOverflow=null;
        }else{
          document.documentElement.style.removeProperty("overflow");
          document.body.style.removeProperty("overflow");
        }
      }
      return;
    }

    const state=activeFrames.get(frame);

    if(!state){
      frame.classList.remove("shoufhon-embed-viewer-frame");
      if(activeFrames.size===0){
        document.documentElement.classList.remove("shoufhon-embed-viewer-open");
        document.body.classList.remove("shoufhon-embed-viewer-open");
        document.documentElement.classList.remove("shoufhon-owner-media-editor-open");
        document.body.classList.remove("shoufhon-owner-media-editor-open");
      }
      return;
    }

    activeFrames.delete(frame);
    syncOwnerMediaIsolation();

    const restoreScroll=function(){
      if(
        !state ||
        state.viewerKind!=="owner-media-editor"
      ){
        return;
      }

      try{
        window.scrollTo({
          left:Number(state.scrollX||0),
          top:Number(state.scrollY||0),
          behavior:"instant"
        });
      }catch(_){
        try{
          window.scrollTo(
            Number(state.scrollX||0),
            Number(state.scrollY||0)
          );
        }catch(__){}
      }
    };

    const restoreHistoryScrollMode=function(){
      if(
        !state ||
        state.viewerKind!=="owner-media-editor" ||
        !("scrollRestoration" in history)
      ){
        return;
      }

      try{
        history.scrollRestoration=
          state.previousScrollRestoration==="manual"
            ?"manual"
            :"auto";
      }catch(_){}
    };

    if(state.historyArmed&&!fromPopstate){
      state.historyArmed=false;
      suppressNextViewerPop=true;
      try{history.back()}catch(_){suppressNextViewerPop=false}
    }

    if((state.viewerKind==="owner-media-editor"||state.viewerKind==="owner-catalog-editor")){
      frame.classList.remove("shoufhon-owner-media-editor-frame");
      state.host?.classList.remove("shoufhon-owner-media-editor-host");
    }

    if(!state.frameHadClass){
      frame.classList.remove("shoufhon-embed-viewer-frame");
    }

    if(state.host&&!state.hostHadClass){
      state.host.classList.remove("shoufhon-embed-viewer-host");
    }

    (state.ancestors||[]).forEach(function(item){
      if(item?.node&&!item.hadClass){
        item.node.classList.remove("shoufhon-embed-viewer-ancestor");
      }
    });

    if(activeFrames.size===0){
      document.documentElement.classList.remove("shoufhon-embed-viewer-open");
      document.body.classList.remove("shoufhon-embed-viewer-open");
      document.documentElement.classList.remove("shoufhon-owner-media-editor-open");
      document.body.classList.remove("shoufhon-owner-media-editor-open");

      if(savedPageOverflow){
        const restoreOverflow=function(node,value,priority){
          if(value){
            node.style.setProperty("overflow",value,priority||"");
          }else{
            node.style.removeProperty("overflow");
          }
        };

        restoreOverflow(
          document.documentElement,
          savedPageOverflow.html,
          savedPageOverflow.htmlPriority
        );
        restoreOverflow(
          document.body,
          savedPageOverflow.body,
          savedPageOverflow.bodyPriority
        );
      }else{
        /*
           Safety cleanup: if a CLOSE message arrives after an iframe/host was
           rebuilt, make sure the Story portal itself cannot leave scrolling
           disabled.
        */
        document.documentElement.style.removeProperty("overflow");
        document.body.style.removeProperty("overflow");
      }

      savedPageOverflow=null;

      /*
         Closing the owner Media editor must leave the page exactly where the
         owner opened it. history.back() can otherwise restore an older scroll
         position before Hostinger finishes removing the promoted iframe.
      */
      /*
         Everything is restored inside one visual frame while native history
         restoration remains disabled. Re-apply a few times only to defeat
         late Hostinger layout measurements, not browser history movement.
      */
      restoreScroll();
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll,40);
      setTimeout(restoreScroll,120);
      setTimeout(restoreScroll,260);

      clearTimeout(ownerMediaScrollRestoreTimer);
      ownerMediaScrollRestoreTimer=setTimeout(function(){
        restoreScroll();
        restoreHistoryScrollMode();
      },520);
    }
  }

  window.addEventListener("message",function(event){
    const data=event?.data;

    if(!data||typeof data!=="object"){
      return;
    }

    if(data.type==="SHOUFHON_EMBED_VIEWER_OPEN"){
      openFrame(event.source,data);
      return;
    }

    if(data.type==="SHOUFHON_EMBED_VIEWER_CLOSE"){
      closeFrame(event.source);
    }
  });

  window.addEventListener("popstate",function(){
    if(suppressNextViewerPop){
      suppressNextViewerPop=false;
      return;
    }

    let targetFrame=null;
    let targetState=null;

    for(const [frame,state] of activeFrames.entries()){
      if(
        state &&
        state.historyArmed &&
        (state.viewerKind==="owner-media-editor"||state.viewerKind==="owner-catalog-editor")
      ){
        targetFrame=frame;
        targetState=state;
        break;
      }
    }

    if(!targetFrame||!targetState){
      return;
    }

    targetState.historyArmed=false;

    try{
      targetState.source?.postMessage({
        type:"SHOUFHON_EMBED_VIEWER_BACK",
        viewerKind:targetState.viewerKind,
        shopSlug:targetState.shopSlug
      },"*");
    }catch(_){}

    closeFrame(targetState.source,{fromPopstate:true});
  });
})();



/* =========================================================
   SHOUFHON — OWNER EMBED ACTION BRIDGE V1
   Authenticated top-level bridge for Hostinger Custom Embeds.
   Media + About actions execute here using the real owner session.
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_OWNER_EMBED_ACTION_BRIDGE_V1__)return;
  window.__SHOUFHON_OWNER_EMBED_ACTION_BRIDGE_V1__=true;

  var PHOTO_BUCKET="shop-gallery";
  var VIDEO_BUCKET="shop-videos";

  function truthy(v){
    return v===true||["true","1","yes","on"].indexOf(String(v||"").trim().toLowerCase())>=0;
  }

  function numberLimit(v,fallback){
    var n=Number(v);
    return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):fallback;
  }

  function sourceCanReply(source){
    if(!source||typeof source.postMessage!=="function")return false;
    if(source===window)return true;
    return !!window.ShoufHonMessageSecurity?.frameForSource(source);
  }

  async function ownerClient(){
    try{
      if(window.Ma7alakAccount&&typeof window.Ma7alakAccount.ready==="function"){
        await window.Ma7alakAccount.ready();
      }
    }catch(_){}
    try{
      if(window.Ma7alakSupabaseBootstrap&&typeof window.Ma7alakSupabaseBootstrap.ready==="function"){
        await window.Ma7alakSupabaseBootstrap.ready();
      }
    }catch(_){}
    return (window.Ma7alakAccount&&window.Ma7alakAccount.client)||
      (window.Ma7alakOwnerAuth&&window.Ma7alakOwnerAuth.client)||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
      null;
  }

  async function requireOwner(slug,capability){
    var client=await ownerClient();
    if(!client)throw new Error("Owner account is still loading.");

    var userResult=await client.auth.getUser();
    var user=userResult&&userResult.data&&userResult.data.user;
    if(!user)throw new Error("Owner login required.");

    var ownerResult=await client
      .from("shop_owners")
      .select("shop_slug")
      .eq("user_id",user.id)
      .eq("shop_slug",slug)
      .maybeSingle();

    if(ownerResult.error)throw ownerResult.error;
    if(!ownerResult.data)throw new Error("This account does not own this shop.");

    var profileResult=await client
      .from("shop_profiles")
      .select("shop_slug,shop_name,profile_image_url,about_text,directory_options")
      .eq("shop_slug",slug)
      .maybeSingle();

    if(profileResult.error)throw profileResult.error;
    if(!profileResult.data)throw new Error("Shop profile was not found.");

    if(capability&&!truthy((profileResult.data.directory_options||{})[capability])){
      throw new Error("This editing ability is disabled by Admin.");
    }

    return{
      client:client,
      user:user,
      profile:profileResult.data
    };
  }

  function reply(source,type,requestId,ok,data,error){
    try{
      source&&source.postMessage({
        type:type,
        requestId:String(requestId||""),
        ok:!!ok,
        data:data||null,
        error:error?String(error):""
      },"*");
    }catch(_){}
  }

  function validateOwnerMediaFile(file,type){
    if(!file)throw new Error("No file selected.");

    var mime=String(file.type||"").trim().toLowerCase();
    var allowed=type==="video"
      ?["video/mp4","video/webm","video/quicktime"]
      :["image/jpeg","image/png","image/webp","image/gif"];

    if(allowed.indexOf(mime)<0){
      throw new Error(
        type==="video"
          ?"Use MP4, WEBM or MOV video."
          :"Use JPG, PNG, WEBP or GIF image."
      );
    }

    var max=(type==="video"?100:12)*1024*1024;
    var size=Number(file.size||0);
    if(!Number.isFinite(size)||size<=0)throw new Error("The selected file is empty.");
    if(size>max)throw new Error(String(file.name||"File")+" is too large.");

    return mime;
  }

  function extension(file,type){
    var mime=validateOwnerMediaFile(file,type);
    if(type==="video"){
      if(mime==="video/webm")return"webm";
      if(mime==="video/quicktime")return"mov";
      return"mp4";
    }
    if(mime==="image/png")return"png";
    if(mime==="image/webp")return"webp";
    if(mime==="image/gif")return"gif";
    return"jpg";
  }

  function newMediaPath(slug,type,file){
    var id=(window.crypto&&crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2))+"-"+Date.now();
    return(type==="video"?"owner-media/":"owner-gallery/")+slug+"/"+id+"."+extension(file,type);
  }

  async function removeStorage(client,bucket,path){
    path=String(path||"").trim();
    if(!path)return;
    var result=await client.storage.from(bucket).remove([path]);
    if(result.error)throw result.error;
  }

  async function mediaSnapshot(client,slug,profile){
    var results=await Promise.all([
      client.from("shop_gallery").select("id,image_url,storage_path,sort_order,is_featured,created_at").eq("shop_slug",slug).order("sort_order",{ascending:true}).order("created_at",{ascending:true}),
      client.from("shop_videos").select("id,video_url,storage_path,sort_order,created_at").eq("shop_slug",slug).order("sort_order",{ascending:true}).order("created_at",{ascending:true}),
      client.from("shop_media_albums").select("id,shop_slug,title,description,sort_order,created_at,updated_at").eq("shop_slug",slug).order("sort_order",{ascending:true}).order("id",{ascending:true}),
      client.from("shop_media_album_items").select("id,album_id,shop_slug,media_type,media_id,sort_order,is_cover,created_at").eq("shop_slug",slug).order("album_id",{ascending:true}).order("sort_order",{ascending:true}).order("id",{ascending:true})
    ]);
    if(results[0].error)throw results[0].error;
    if(results[1].error)throw results[1].error;
    if(results[2].error)throw results[2].error;
    if(results[3].error)throw results[3].error;
    var options=profile.directory_options||{};
    return{
      photos:results[0].data||[],
      videos:results[1].data||[],
      albums:results[2].data||[],
      albumItems:results[3].data||[],
      photoLimit:numberLimit(options.owner_media_photo_limit,6),
      videoLimit:numberLimit(options.owner_media_video_limit,2),
      albumLimit:numberLimit(options.owner_media_album_item_limit,8),
      commentsEnabled:
        !(
          options.media_comments_enabled===false ||
          String(options.media_comments_enabled||"").trim().toLowerCase()==="false"
        )
    };
  }

  async function uploadMediaFile(client,slug,type,file,sortOrder){
    var video=type==="video";
    validateOwnerMediaFile(file,type);

    var bucket=video?VIDEO_BUCKET:PHOTO_BUCKET;
    var path=newMediaPath(slug,type,file);
    var uploaded=false;

    try{
      var upload=await client.storage.from(bucket).upload(path,file,{
        cacheControl:"31536000",
        upsert:false,
        contentType:file.type||undefined
      });
      if(upload.error)throw upload.error;
      uploaded=true;

      var publicUrl=client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      if(!publicUrl)throw new Error("Could not create Media URL.");

      var payload=video
        ?{shop_slug:slug,video_url:publicUrl,storage_path:path,sort_order:sortOrder}
        :{shop_slug:slug,image_url:publicUrl,storage_path:path,sort_order:sortOrder,is_featured:false};

      var insert=await client.from(video?"shop_videos":"shop_gallery").insert(payload);
      if(insert.error)throw insert.error;
      return{path:path,url:publicUrl};
    }catch(error){
      if(uploaded){
        try{await removeStorage(client,bucket,path)}catch(_){}
      }
      throw error;
    }
  }

  async function handleMediaRequest(event){
    var data=event.data||{};
    var source=event.source||null;
    var requestId=String(data.requestId||"");
    var slug=String(data.shopSlug||"").trim().toLowerCase();
    var op=String(data.op||"");

    if(!requestId||!slug||!sourceCanReply(source))return;

    try{
      var context=await requireOwner(slug,"owner_media_edit_enabled");
      var client=context.client;
      var snapshot=await mediaSnapshot(client,slug,context.profile);

      if(op==="load"){
        reply(source,"SHOUFHON_OWNER_MEDIA_RESULT",requestId,true,snapshot,"");
        return;
      }

      if(op==="comments-toggle"){
        var commentsToggle=await client.rpc(
          "owner_set_media_comments_enabled",
          {
            p_shop_slug:slug,
            p_enabled:data.enabled===true
          }
        );
        if(commentsToggle.error)throw commentsToggle.error;
      }
      else if(op==="add"){
        var type=data.mediaType==="video"?"video":"photo";
        var files=Array.isArray(data.files)?data.files:[];
        if(!files.length)throw new Error("Choose at least one file.");

        var current=type==="video"?snapshot.videos.length:snapshot.photos.length;
        var max=type==="video"?snapshot.videoLimit:snapshot.photoLimit;
        if(current+files.length>max){
          throw new Error("Admin limit: "+max+" "+(type==="video"?"videos":"photos")+". Current: "+current+".");
        }

        var rows=type==="video"?snapshot.videos:snapshot.photos;
        var order=Math.max.apply(Math,[-1].concat(rows.map(function(row){return Number(row.sort_order)||0})))+1;

        for(var i=0;i<files.length;i++){
          await uploadMediaFile(client,slug,type,files[i],order+i);
        }
      }
      else if(op==="album-save-device"){
        var deviceAlbumItems=Array.isArray(data.items)?data.items:[];
        var deviceAlbumFiles=Array.isArray(data.files)?data.files:[];
        var deviceAlbumId=data.albumId===null||data.albumId===undefined||data.albumId===""
          ?null
          :Number(data.albumId);

        var deviceExistingPayload=deviceAlbumItems.map(function(item){
          return{
            media_type:item&&item.mediaType==="video"?"video":"photo",
            media_id:Number(item&&item.mediaId)
          };
        });

        if(deviceExistingPayload.some(function(item){return !Number.isFinite(item.media_id)})){
          throw new Error("One current album item is invalid.");
        }

        if(!Number.isFinite(deviceAlbumId))deviceAlbumId=null;

        var deviceTotal=deviceExistingPayload.length+deviceAlbumFiles.length;
        if(deviceTotal<2)throw new Error("Choose at least 2 photos for the album.");
        if(deviceTotal>snapshot.albumLimit){
          throw new Error("Admin limit: maximum "+snapshot.albumLimit+" items in one album.");
        }

        if(snapshot.photos.length+deviceAlbumFiles.length>snapshot.photoLimit){
          throw new Error(
            "Admin photo limit: "+snapshot.photoLimit+
            ". Current: "+snapshot.photos.length+
            ". New album photos: "+deviceAlbumFiles.length+"."
          );
        }

        deviceAlbumFiles.forEach(function(file){
          validateOwnerMediaFile(file,"photo");
        });

        var deviceUploadedPaths=[];
        var deviceUploadedRows=[];
        var devicePhotoOrder=Math.max.apply(
          Math,
          [-1].concat(snapshot.photos.map(function(row){return Number(row.sort_order)||0}))
        )+1;

        try{
          for(var deviceIndex=0;deviceIndex<deviceAlbumFiles.length;deviceIndex++){
            var deviceUploaded=await uploadMediaFile(
              client,
              slug,
              "photo",
              deviceAlbumFiles[deviceIndex],
              devicePhotoOrder+deviceIndex
            );
            deviceUploadedPaths.push(String(deviceUploaded.path||""));
          }

          if(deviceUploadedPaths.length){
            var uploadedLookup=await client
              .from("shop_gallery")
              .select("id,storage_path,sort_order")
              .eq("shop_slug",slug)
              .in("storage_path",deviceUploadedPaths);

            if(uploadedLookup.error)throw uploadedLookup.error;

            var rowsByPath=new Map(
              (uploadedLookup.data||[]).map(function(row){
                return[String(row.storage_path||""),row];
              })
            );

            deviceUploadedRows=deviceUploadedPaths.map(function(path){
              return rowsByPath.get(String(path||""))||null;
            });

            if(deviceUploadedRows.some(function(row){return !row||!Number.isFinite(Number(row.id))})){
              throw new Error("One uploaded album photo could not be linked.");
            }
          }

          var deviceNewPayload=deviceUploadedRows.map(function(row){
            return{media_type:"photo",media_id:Number(row.id)};
          });

          var deviceFullPayload=deviceExistingPayload.concat(deviceNewPayload);
          var deviceCover=null;

          if(
            data.coverExisting &&
            Number.isFinite(Number(data.coverExisting.mediaId))
          ){
            var requestedCover={
              media_type:data.coverExisting.mediaType==="video"?"video":"photo",
              media_id:Number(data.coverExisting.mediaId)
            };
            var requestedExists=deviceFullPayload.some(function(item){
              return item.media_type===requestedCover.media_type &&
                Number(item.media_id)===Number(requestedCover.media_id);
            });
            if(requestedExists)deviceCover=requestedCover;
          }

          if(
            !deviceCover &&
            Number.isInteger(Number(data.coverNewIndex)) &&
            deviceUploadedRows[Number(data.coverNewIndex)]
          ){
            deviceCover={
              media_type:"photo",
              media_id:Number(deviceUploadedRows[Number(data.coverNewIndex)].id)
            };
          }

          if(!deviceCover&&deviceFullPayload.length){
            deviceCover=deviceFullPayload[0];
          }

          var deviceSavedAlbum=await client.rpc("owner_save_media_album",{
            p_shop_slug:slug,
            p_album_id:deviceAlbumId,
            p_title:String(data.title||"").trim(),
            p_description:String(data.description||"").trim()||null,
            p_items:deviceFullPayload,
            p_cover:deviceCover
          });

          if(deviceSavedAlbum.error)throw deviceSavedAlbum.error;
        }catch(deviceAlbumError){
          /*
             A failed album save must not leave orphan phone uploads behind.
             Only paths created by this request are removed.
          */
          for(var rollbackIndex=0;rollbackIndex<deviceUploadedPaths.length;rollbackIndex++){
            var rollbackPath=deviceUploadedPaths[rollbackIndex];
            if(!rollbackPath)continue;
            try{
              await client
                .from("shop_gallery")
                .delete()
                .eq("shop_slug",slug)
                .eq("storage_path",rollbackPath);
            }catch(_){}
            try{
              await removeStorage(client,PHOTO_BUCKET,rollbackPath);
            }catch(_){}
          }
          throw deviceAlbumError;
        }
      }
      else if(op==="album-save"){
        var albumItems=Array.isArray(data.items)?data.items:[];
        var albumPayload=albumItems.map(function(item){
          return{
            media_type:item&&item.mediaType==="video"?"video":"photo",
            media_id:Number(item&&item.mediaId)
          };
        });
        var coverPayload=data.cover&&data.cover.mediaId
          ?{
              media_type:data.cover.mediaType==="video"?"video":"photo",
              media_id:Number(data.cover.mediaId)
            }
          :null;
        var albumId=data.albumId===null||data.albumId===undefined||data.albumId===""
          ?null
          :Number(data.albumId);

        if(albumPayload.some(function(item){return !Number.isFinite(item.media_id)})){
          throw new Error("One selected album item is invalid.");
        }

        var savedAlbum=await client.rpc("owner_save_media_album",{
          p_shop_slug:slug,
          p_album_id:Number.isFinite(albumId)?albumId:null,
          p_title:String(data.title||"").trim(),
          p_description:String(data.description||"").trim()||null,
          p_items:albumPayload,
          p_cover:coverPayload
        });
        if(savedAlbum.error)throw savedAlbum.error;
      }
      else if(op==="album-remove-items"){
        var removeAlbumId=Number(data.albumId);
        var removeAlbumItems=Array.isArray(data.items)?data.items:[];

        if(!Number.isFinite(removeAlbumId)){
          throw new Error("Album was not found.");
        }

        var removeKeys=new Set(
          removeAlbumItems
            .map(function(item){
              var type=item&&item.mediaType==="video"?"video":"photo";
              var id=Number(item&&item.mediaId);
              return Number.isFinite(id)?type+":"+id:"";
            })
            .filter(Boolean)
        );

        if(!removeKeys.size){
          throw new Error("Select at least one album item.");
        }

        var removeAlbumRow=await client
          .from("shop_media_albums")
          .select("id,title,description")
          .eq("shop_slug",slug)
          .eq("id",removeAlbumId)
          .maybeSingle();

        if(removeAlbumRow.error)throw removeAlbumRow.error;
        if(!removeAlbumRow.data)throw new Error("Album was not found.");

        var removeAlbumRows=await client
          .from("shop_media_album_items")
          .select("media_type,media_id,sort_order,is_cover")
          .eq("album_id",removeAlbumId)
          .order("sort_order",{ascending:true});

        if(removeAlbumRows.error)throw removeAlbumRows.error;

        var remainingAlbumRows=(removeAlbumRows.data||[]).filter(function(row){
          var key=(row.media_type==="video"?"video":"photo")+":"+Number(row.media_id);
          return !removeKeys.has(key);
        });

        /*
           Albums are grouping only. If fewer than two items remain, remove the
           album frame entirely and leave every Media file untouched.
        */
        if(remainingAlbumRows.length<2){
          var autoUngroupAlbum=await client.rpc("owner_delete_media_album",{
            p_shop_slug:slug,
            p_album_id:removeAlbumId
          });
          if(autoUngroupAlbum.error)throw autoUngroupAlbum.error;
        }else{
          var remainingPayload=remainingAlbumRows.map(function(row){
            return{
              media_type:row.media_type==="video"?"video":"photo",
              media_id:Number(row.media_id)
            };
          });

          var remainingCoverRow=
            remainingAlbumRows.find(function(row){return row.is_cover===true})||
            remainingAlbumRows[0];

          var remainingCover={
            media_type:remainingCoverRow.media_type==="video"?"video":"photo",
            media_id:Number(remainingCoverRow.media_id)
          };

          var saveReducedAlbum=await client.rpc("owner_save_media_album",{
            p_shop_slug:slug,
            p_album_id:removeAlbumId,
            p_title:String(removeAlbumRow.data.title||"").trim(),
            p_description:String(removeAlbumRow.data.description||"").trim()||null,
            p_items:remainingPayload,
            p_cover:remainingCover
          });

          if(saveReducedAlbum.error)throw saveReducedAlbum.error;
        }
      }
      else if(op==="album-delete"){
        var deleteAlbumId=Number(data.albumId);
        if(!Number.isFinite(deleteAlbumId))throw new Error("Album was not found.");
        var deleteAlbum=await client.rpc("owner_delete_media_album",{
          p_shop_slug:slug,
          p_album_id:deleteAlbumId
        });
        if(deleteAlbum.error)throw deleteAlbum.error;
      }
      else if(op==="album-delete-batch"){
        var albumIds=Array.isArray(data.albumIds)?data.albumIds:[];
        albumIds=albumIds
          .map(function(id){return Number(id)})
          .filter(function(id,index,array){
            return Number.isFinite(id)&&array.indexOf(id)===index;
          });

        if(!albumIds.length)throw new Error("Select at least one album.");
        if(albumIds.length>30)throw new Error("Too many albums selected.");

        for(var albumBatchIndex=0;albumBatchIndex<albumIds.length;albumBatchIndex++){
          var albumBatchDelete=await client.rpc("owner_delete_media_album",{
            p_shop_slug:slug,
            p_album_id:albumIds[albumBatchIndex]
          });
          if(albumBatchDelete.error)throw albumBatchDelete.error;
        }
      }
      else if(op==="feature-photo"){
        var featurePhotoId=Number(data.id);
        if(!Number.isFinite(featurePhotoId)){
          throw new Error("Photo was not found.");
        }

        var featureTarget=await client
          .from("shop_gallery")
          .select("id")
          .eq("shop_slug",slug)
          .eq("id",featurePhotoId)
          .maybeSingle();

        if(featureTarget.error)throw featureTarget.error;
        if(!featureTarget.data)throw new Error("Photo was not found.");

        /*
           Keep one featured gallery photo per shop.
           Mark the requested photo first, then clear the flag from all others.
        */
        var makeFeatured=await client
          .from("shop_gallery")
          .update({is_featured:true})
          .eq("shop_slug",slug)
          .eq("id",featurePhotoId);

        if(makeFeatured.error)throw makeFeatured.error;

        var clearOtherFeatured=await client
          .from("shop_gallery")
          .update({is_featured:false})
          .eq("shop_slug",slug)
          .neq("id",featurePhotoId)
          .eq("is_featured",true);

        if(clearOtherFeatured.error)throw clearOtherFeatured.error;
      }
      else if(op==="batch-delete"){
        var batchItems=Array.isArray(data.items)?data.items:[];
        var seenBatch=new Set();
        batchItems=batchItems
          .map(function(item){
            var mediaType=item&&item.mediaType==="video"?"video":"photo";
            var mediaId=Number(item&&item.id);
            return{mediaType:mediaType,id:mediaId};
          })
          .filter(function(item){
            if(!Number.isFinite(item.id))return false;
            var key=item.mediaType+":"+item.id;
            if(seenBatch.has(key))return false;
            seenBatch.add(key);
            return true;
          });

        if(!batchItems.length)throw new Error("Select at least one Media item.");
        if(batchItems.length>100)throw new Error("Too many Media items selected.");

        for(var batchIndex=0;batchIndex<batchItems.length;batchIndex++){
          var batchItem=batchItems[batchIndex];
          var batchVideo=batchItem.mediaType==="video";
          var batchTable=batchVideo?"shop_videos":"shop_gallery";
          var batchBucket=batchVideo?VIDEO_BUCKET:PHOTO_BUCKET;

          var batchOld=await client
            .from(batchTable)
            .select("id,storage_path")
            .eq("id",batchItem.id)
            .eq("shop_slug",slug)
            .maybeSingle();

          if(batchOld.error)throw batchOld.error;
          if(!batchOld.data)continue;

          var batchDeleted=await client
            .from(batchTable)
            .delete()
            .eq("id",batchItem.id)
            .eq("shop_slug",slug);

          if(batchDeleted.error)throw batchDeleted.error;

          if(batchOld.data.storage_path){
            try{
              await removeStorage(
                client,
                batchBucket,
                batchOld.data.storage_path
              );
            }catch(batchCleanupError){
              console.warn(
                "SHOUFHON batch deleted Media cleanup:",
                batchCleanupError
              );
            }
          }
        }
      }
      else if(op==="replace"){
        var replaceType=data.mediaType==="video"?"video":"photo";
        var replaceVideo=replaceType==="video";
        var replaceTable=replaceVideo?"shop_videos":"shop_gallery";
        var replaceBucket=replaceVideo?VIDEO_BUCKET:PHOTO_BUCKET;
        var replaceId=Number(data.id);
        var file=data.file;
        if(!Number.isFinite(replaceId)||!file)throw new Error("Replacement is incomplete.");
        validateOwnerMediaFile(file,replaceType);

        var oldResult=await client
          .from(replaceTable)
          .select(replaceVideo?"id,video_url,storage_path,sort_order":"id,image_url,storage_path,sort_order,is_featured")
          .eq("id",replaceId)
          .eq("shop_slug",slug)
          .maybeSingle();
        if(oldResult.error)throw oldResult.error;
        if(!oldResult.data)throw new Error("Media item was not found.");

        var newPath=newMediaPath(slug,replaceType,file);
        var uploaded=false;
        try{
          var up=await client.storage.from(replaceBucket).upload(newPath,file,{
            cacheControl:"31536000",
            upsert:false,
            contentType:file.type||undefined
          });
          if(up.error)throw up.error;
          uploaded=true;
          var newUrl=client.storage.from(replaceBucket).getPublicUrl(newPath).data.publicUrl;
          if(!newUrl)throw new Error("Could not create Media URL.");

          var patch=replaceVideo
            ?{video_url:newUrl,storage_path:newPath}
            :{image_url:newUrl,storage_path:newPath};

          var update=await client.from(replaceTable).update(patch).eq("id",replaceId).eq("shop_slug",slug);
          if(update.error)throw update.error;

          if(oldResult.data.storage_path&&oldResult.data.storage_path!==newPath){
            try{await removeStorage(client,replaceBucket,oldResult.data.storage_path)}
            catch(cleanupError){console.warn("SHOUFHON old Media cleanup:",cleanupError)}
          }
        }catch(error){
          if(uploaded){
            try{await removeStorage(client,replaceBucket,newPath)}catch(_){}
          }
          throw error;
        }
      }
      else if(op==="delete"){
        var deleteType=data.mediaType==="video"?"video":"photo";
        var deleteVideo=deleteType==="video";
        var deleteTable=deleteVideo?"shop_videos":"shop_gallery";
        var deleteBucket=deleteVideo?VIDEO_BUCKET:PHOTO_BUCKET;
        var deleteId=Number(data.id);
        if(!Number.isFinite(deleteId))throw new Error("Media item was not found.");

        var old=await client
          .from(deleteTable)
          .select("id,storage_path")
          .eq("id",deleteId)
          .eq("shop_slug",slug)
          .maybeSingle();
        if(old.error)throw old.error;
        if(!old.data)throw new Error("Media item was not found.");

        var deleted=await client.from(deleteTable).delete().eq("id",deleteId).eq("shop_slug",slug);
        if(deleted.error)throw deleted.error;

        if(old.data.storage_path){
          try{await removeStorage(client,deleteBucket,old.data.storage_path)}
          catch(cleanupError){console.warn("SHOUFHON deleted Media cleanup:",cleanupError)}
        }
      }
      else{
        throw new Error("Unknown Media action.");
      }

      var freshProfile=await client
        .from("shop_profiles")
        .select("directory_options")
        .eq("shop_slug",slug)
        .maybeSingle();
      if(freshProfile.error)throw freshProfile.error;
      var fresh=await mediaSnapshot(client,slug,{directory_options:freshProfile.data&&freshProfile.data.directory_options||{}});
      reply(source,"SHOUFHON_OWNER_MEDIA_RESULT",requestId,true,fresh,"");
    }catch(error){
      reply(source,"SHOUFHON_OWNER_MEDIA_RESULT",requestId,false,null,error&&error.message||"Could not update Media.");
    }
  }

  async function handleAboutRequest(event){
    var data=event.data||{};
    var source=event.source||null;
    var requestId=String(data.requestId||"");
    var slug=String(data.shopSlug||"").trim().toLowerCase();

    if(!requestId||!slug||!sourceCanReply(source))return;

    try{
      var context=await requireOwner(slug,"owner_about_edit_enabled");
      var result=await context.client.rpc("owner_update_about_text",{
        p_shop_slug:slug,
        p_about_text:String(data.aboutText||"")
      });
      if(result.error)throw result.error;

      reply(source,"SHOUFHON_OWNER_ABOUT_RESULT",requestId,true,{aboutText:String(result.data||"")},"");
    }catch(error){
      reply(source,"SHOUFHON_OWNER_ABOUT_RESULT",requestId,false,null,error&&error.message||"Could not update About.");
    }
  }

  async function handleHubLocationRequest(event){
    var data=event.data||{};
    var source=event.source||null;
    var requestId=String(data.requestId||"");
    var slug=String(data.shopSlug||"").trim().toLowerCase();

    if(!requestId||!slug||!sourceCanReply(source))return;

    try{
      var context=await requireOwner(slug,"owner_about_edit_enabled");
      var result=await context.client.rpc("owner_update_hub_details",{
        p_shop_slug:slug,
        p_address_text:String(data.addressText||""),
        p_availability_days:String(data.availabilityDays||""),
        p_availability_time:String(data.availabilityTime||"")
      });
      if(result.error)throw result.error;

      reply(
        source,
        "SHOUFHON_OWNER_HUB_LOCATION_RESULT",
        requestId,
        true,
        result.data||{},
        ""
      );
    }catch(error){
      reply(
        source,
        "SHOUFHON_OWNER_HUB_LOCATION_RESULT",
        requestId,
        false,
        null,
        error&&error.message||"Could not update Location."
      );
    }
  }

  window.addEventListener("message",function(event){
    if(!window.ShoufHonMessageSecurity?.isTrustedEvent(event,true))return;
    var data=event&&event.data||{};
    if(data.type==="SHOUFHON_OWNER_MEDIA_REQUEST"){
      handleMediaRequest(event);
      return;
    }
    if(data.type==="SHOUFHON_OWNER_ABOUT_REQUEST"){
      handleAboutRequest(event);
      return;
    }
    if(data.type==="SHOUFHON_OWNER_HUB_LOCATION_REQUEST"){
      handleHubLocationRequest(event);
    }
  });
})();


/* =========================================================
   SHOUFHON — CATALOG OWNER / REALTIME / HEIGHT BRIDGE V1
   - Authenticated owner RPC bridge for Hostinger Catalog iframe
   - Catalog image upload + cleanup in shop-gallery/owner-catalog
   - Realtime invalidation through catalog header/profile changes
   - Dynamic iframe/Hostinger host height
========================================================= */
(function(){
  "use strict";
  if(window.__SHOUFHON_CATALOG_PARENT_BRIDGE_V1__)return;
  window.__SHOUFHON_CATALOG_PARENT_BRIDGE_V1__=true;

  var realtimeBySource=new Map();

  function trusted(event){
    return !!window.ShoufHonMessageSecurity?.isTrustedEvent(event,true);
  }

  function frameFor(source){
    try{return window.ShoufHonMessageSecurity?.frameForSource(source)||null}catch(_){return null}
  }

  async function clientReady(){
    try{
      if(window.Ma7alakAccount&&typeof window.Ma7alakAccount.ready==="function"){
        await window.Ma7alakAccount.ready();
      }
    }catch(_){}
    try{
      if(window.Ma7alakSupabaseBootstrap&&typeof window.Ma7alakSupabaseBootstrap.ready==="function"){
        await window.Ma7alakSupabaseBootstrap.ready();
      }
    }catch(_){}
    return (window.Ma7alakAccount&&window.Ma7alakAccount.client)||
      (window.Ma7alakOwnerAuth&&window.Ma7alakOwnerAuth.client)||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
      null;
  }

  function cleanSlug(v){
    var s=String(v||"").trim().toLowerCase();
    return /^[a-z0-9][a-z0-9._&-]{0,119}$/i.test(s)?s:"";
  }

  function reply(source,requestId,ok,data,error){
    try{
      source?.postMessage({
        type:"SHOUFHON_OWNER_CATALOG_RESULT",
        requestId:String(requestId||""),
        ok:!!ok,
        data:data||null,
        error:error?String(error):""
      },"*");
    }catch(_){}
  }

  async function requireCatalogOwner(client,slug){
    if(!client)throw new Error("Owner account is still loading.");
    var u=await client.auth.getUser();
    var user=u&&u.data&&u.data.user;
    if(!user)throw new Error("Owner login required.");

    var own=await client.from("shop_owners")
      .select("shop_slug")
      .eq("user_id",user.id)
      .eq("shop_slug",slug)
      .maybeSingle();
    if(own.error)throw own.error;
    if(!own.data)throw new Error("This account does not own this shop.");

    var profile=await client.from("shop_profiles")
      .select("shop_slug,directory_options")
      .eq("shop_slug",slug)
      .maybeSingle();
    if(profile.error)throw profile.error;
    if(!profile.data)throw new Error("Shop profile was not found.");

    var opts=profile.data.directory_options||{};
    var enabled=["true","1","yes","on"].includes(String(opts.catalog_enabled||"").toLowerCase())||opts.catalog_enabled===true;
    if(!enabled)throw new Error("Catalog is disabled by Admin.");

    return {user:user,profile:profile.data,options:opts};
  }

  function imageExtension(file){
    var mime=String(file?.type||"").toLowerCase();
    if(mime==="image/png")return"png";
    if(mime==="image/webp")return"webp";
    if(mime==="image/gif")return"gif";
    return"jpg";
  }

  function validateImage(file){
    if(!file)throw new Error("No image selected.");
    var allowed=["image/jpeg","image/png","image/webp","image/gif"];
    if(!allowed.includes(String(file.type||"").toLowerCase())){
      throw new Error("Use JPG, PNG, WEBP or GIF image.");
    }
    var size=Number(file.size||0);
    if(!Number.isFinite(size)||size<=0)throw new Error("The selected image is empty.");
    if(size>12*1024*1024)throw new Error("Catalog image must be under 12 MB.");
  }

  async function removePaths(client,paths){
    var list=(Array.isArray(paths)?paths:[]).map(function(v){return String(v||"").trim()}).filter(Boolean);
    if(!list.length)return;
    try{await client.storage.from("shop-gallery").remove(list)}catch(_){}
  }

  async function handleOwner(event){
    var d=event.data||{};
    var source=event.source;
    var requestId=String(d.requestId||"");
    var slug=cleanSlug(d.shopSlug);
    if(!requestId||!slug||!source)return;

    try{
      var client=await clientReady();
      await requireCatalogOwner(client,slug);

      if(d.op==="load"){
        var got=await client.rpc("ma7alak_owner_get_catalog",{p_shop_slug:slug});
        if(got.error)throw got.error;
        reply(source,requestId,true,got.data,"");
        return;
      }

      if(d.op!=="mutate")throw new Error("Unknown Catalog request.");

      var action=String(d.action||"").trim();
      var payload=(d.payload&&typeof d.payload==="object")?{...d.payload}:{};
      var uploadedPath="";

      if(d.imageFile){
        validateImage(d.imageFile);
        var current=await client.from("shop_profiles")
          .select("directory_options")
          .eq("shop_slug",slug)
          .maybeSingle();
        if(current.error)throw current.error;
        var options=current.data?.directory_options||{};
        var imagesEnabled=options.catalog_images_enabled===true||
          ["true","1","yes","on"].includes(String(options.catalog_images_enabled||"").toLowerCase());
        if(!imagesEnabled)throw new Error("Catalog images are disabled by Admin.");

        var id=(window.crypto&&crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2))+"-"+Date.now();
        uploadedPath="owner-catalog/"+slug+"/"+id+"."+imageExtension(d.imageFile);

        var up=await client.storage.from("shop-gallery").upload(uploadedPath,d.imageFile,{
          cacheControl:"31536000",
          upsert:false,
          contentType:d.imageFile.type||undefined
        });
        if(up.error)throw up.error;

        var publicUrl=client.storage.from("shop-gallery").getPublicUrl(uploadedPath).data.publicUrl;
        if(!publicUrl){
          await removePaths(client,[uploadedPath]);
          throw new Error("Could not create Catalog image URL.");
        }

        payload.image_mode="replace";
        payload.image_url=publicUrl;
        payload.image_storage_path=uploadedPath;
      }

      var result=await client.rpc("ma7alak_owner_catalog_mutate",{
        p_shop_slug:slug,
        p_action:action,
        p_payload:payload
      });

      if(result.error){
        if(uploadedPath)await removePaths(client,[uploadedPath]);
        throw result.error;
      }

      await removePaths(client,result.data?.cleanup_paths||[]);
      reply(source,requestId,true,result.data?.snapshot||result.data,"");
    }catch(error){
      reply(source,requestId,false,null,error?.message||"Catalog action failed.");
    }
  }

  async function unregister(source){
    var state=realtimeBySource.get(source);
    if(!state)return;
    realtimeBySource.delete(source);
    try{
      var client=state.client||await clientReady();
      if(client&&state.channel)client.removeChannel(state.channel);
    }catch(_){}
  }

  async function register(event){
    var source=event.source;
    var slug=cleanSlug(event.data?.shopSlug);
    if(!source||!slug)return;
    await unregister(source);
    var client=await clientReady();
    if(!client||typeof client.channel!=="function")return;

    var invalidate=function(){
      try{
        source.postMessage({
          type:"SHOUFHON_CATALOG_INVALIDATE",
          shopSlug:slug
        },"*");
      }catch(_){}
    };

    var channel=client.channel("shoufhon-catalog-"+slug+"-"+Math.random().toString(36).slice(2))
      .on("postgres_changes",{event:"*",schema:"public",table:"shop_catalogs",filter:"shop_slug=eq."+slug},invalidate)
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"shop_profiles",filter:"shop_slug=eq."+slug},invalidate)
      .subscribe();

    realtimeBySource.set(source,{client:client,channel:channel,slug:slug});
  }

  function applyHeight(event){
    var d=event.data||{};
    if(d.module!=="catalog")return;
    var frame=frameFor(event.source);
    if(!frame)return;
    var h=Math.max(0,Math.min(10000,Math.ceil(Number(d.height)||0)));
    var px=h+"px";

    frame.style.setProperty("height",px,"important");
    frame.style.setProperty("min-height",px,"important");
    frame.style.setProperty("max-height",px,"important");
    frame.style.setProperty("overflow","hidden","important");
    frame.setAttribute("scrolling","no");

    var host=frame.parentElement;
    if(host){
      host.style.setProperty("height",px,"important");
      host.style.setProperty("min-height",px,"important");
      host.style.setProperty("max-height",px,"important");
      host.style.setProperty("overflow","hidden","important");
      host.dataset.shoufhonCatalogAutoHeight="1";
    }
  }

  window.addEventListener("message",function(event){
    if(!trusted(event))return;
    var d=event.data||{};

    if(d.type==="SHOUFHON_OWNER_CATALOG_REQUEST"){
      handleOwner(event);
      return;
    }
    if(d.type==="SHOUFHON_CATALOG_REALTIME_REGISTER"){
      register(event);
      return;
    }
    if(d.type==="SHOUFHON_CATALOG_REALTIME_UNREGISTER"){
      unregister(event.source);
      return;
    }
    if(d.type==="SHOUFHON_EMBED_HEIGHT"){
      applyHeight(event);
    }
  });

  window.addEventListener("beforeunload",function(){
    Array.from(realtimeBySource.keys()).forEach(function(source){unregister(source)});
  });
})();
