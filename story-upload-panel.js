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


  function broadcastStoriesUploaded(){

    const message = {
      type:"MA7ALAK_STORY_UPLOADED",
      shopSlug:activeShopSlug
    };


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
   SHOUFHON — OWNER + MENU / PROFILE STUDIO V2
   Existing Story/Reel chooser extended with Admin-controlled
   Profile Photo + Banner replacement.
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
  let profileMode="profile";
  let pendingFile=null;
  let pendingObjectUrl="";

  function bool(value){
    return value===true||String(value||"").toLowerCase()==="true"||String(value||"")==="1";
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
        const existing=document.querySelector('script[src*="@supabase/supabase-js"]');
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
    const fromName=String(file?.name||"").split(".").pop().toLowerCase();
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
      return decodeURIComponent(value.slice(at+marker.length).split("?")[0]);
    }catch(_){
      return value.slice(at+marker.length).split("?")[0];
    }
  }

  function ownedCleanupPath(path,slug){
    const parts=String(path||"").split("/").filter(Boolean);
    if(parts.length<2)return false;
    const roots=new Set(["owner-profile","owner-banner","profiles","profile-banners"]);
    return roots.has(parts[0])&&parts[1]===slug;
  }

  async function cleanupOldImage(url,slug){
    const path=publicStoragePath(url);
    if(!ownedCleanupPath(path,slug))return;
    try{
      const result=await (await getClient()).storage.from(IMAGE_BUCKET).remove([path]);
      if(result.error)console.warn("SHOUFHON old profile media cleanup:",result.error);
    }catch(error){
      console.warn("SHOUFHON old profile media cleanup:",error);
    }
  }

  async function loadOwnerProfile(slug){
    const c=await getClient();
    const session=await c.auth.getUser();
    const user=session.data?.user;
    if(!user)throw new Error("Owner login required.");

    const owner=await c
      .from("shop_owners")
      .select("shop_slug")
      .eq("user_id",user.id)
      .eq("shop_slug",slug)
      .maybeSingle();

    if(owner.error)throw owner.error;
    if(!owner.data)throw new Error("This account does not own this shop.");

    const profile=await c
      .from("shop_profiles")
      .select("shop_slug,shop_name,profile_image_url,story_logo_url,directory_options")
      .eq("shop_slug",slug)
      .maybeSingle();

    if(profile.error)throw profile.error;
    if(!profile.data)throw new Error("Shop profile was not found.");

    activeProfile=profile.data;
    profileEditAllowed=bool(profile.data.directory_options?.owner_profile_edit_enabled);
    ownerProfileCache.set(String(slug||"").trim().toLowerCase(),profile.data);
    return profile.data;
  }

  function revokePreview(){
    if(pendingObjectUrl){
      try{URL.revokeObjectURL(pendingObjectUrl)}catch(_){}
      pendingObjectUrl="";
    }
    pendingFile=null;
  }

  function injectChooser(){
    if(document.getElementById("ma7alak-owner-add-chooser"))return;

    const style=document.createElement("style");
    style.id="ma7alak-owner-add-chooser-style";
    style.textContent=`
      #ma7alak-owner-add-chooser,#m7-owner-profile-studio{
        position:fixed!important;inset:0!important;z-index:2147483647!important;
        display:none!important;align-items:center!important;justify-content:center!important;
        width:100vw!important;height:100vh!important;height:100dvh!important;
        padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;background:rgba(3,4,5,.91)!important;
        backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;
        font-family:Arial,"Segoe UI",sans-serif!important;overflow:auto!important;
        -webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;
      }
      #ma7alak-owner-add-chooser.active,#m7-owner-profile-studio.active{display:flex!important}
      #ma7alak-owner-add-panel,#m7-owner-profile-card{
        position:relative!important;width:min(460px,100%)!important;box-sizing:border-box!important;
        border:1px solid rgba(217,164,65,.30)!important;border-radius:26px!important;
        background:radial-gradient(circle at 15% 0,rgba(217,164,65,.10),transparent 36%),linear-gradient(180deg,#191613,#0d0d0e)!important;
        box-shadow:0 28px 90px rgba(0,0,0,.72)!important;color:#fff!important;
      }
      #ma7alak-owner-add-panel{padding:27px 18px 19px!important;text-align:center!important}
      #ma7alak-owner-add-close,#m7-owner-profile-close{
        position:absolute!important;right:12px!important;top:11px!important;width:40px!important;height:40px!important;
        border:1px solid rgba(255,255,255,.10)!important;border-radius:50%!important;
        background:rgba(255,255,255,.06)!important;color:#fff!important;font-size:25px!important;
        line-height:36px!important;padding:0!important;z-index:4!important;touch-action:manipulation!important;
      }
      .ma7alak-owner-add-title{font-size:22px!important;font-weight:900!important;margin:3px 42px 4px!important}
      .ma7alak-owner-add-sub{font-size:12px!important;color:rgba(255,255,255,.52)!important;margin:0 0 18px!important;line-height:1.45!important}
      .ma7alak-owner-add-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:11px!important}
      .ma7alak-owner-add-choice{
        min-height:126px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:20px!important;
        background:rgba(255,255,255,.045)!important;color:#fff!important;padding:15px 10px!important;
        font:inherit!important;font-weight:900!important;cursor:pointer!important;
        -webkit-tap-highlight-color:transparent!important;touch-action:manipulation!important;
      }
      .ma7alak-owner-add-choice.profile-tool{border-color:rgba(217,164,65,.24)!important;background:rgba(217,164,65,.055)!important}
      .ma7alak-owner-add-choice[hidden]{display:none!important}
      .ma7alak-owner-add-choice:active{transform:scale(.97)!important}
      .ma7alak-owner-add-icon{display:block!important;font-size:30px!important;margin-bottom:8px!important}
      .ma7alak-owner-add-choice small{display:block!important;margin-top:7px!important;color:rgba(255,255,255,.46)!important;font-size:10px!important;font-weight:600!important;line-height:1.4!important}
      #m7-owner-add-permission{min-height:16px;margin:11px 2px 0;color:#8f816d;font-size:9px;line-height:1.4}
      #m7-owner-profile-card{padding:18px!important;max-height:calc(100dvh - 28px)!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important}
      .m7ops-head{padding:3px 48px 14px 0}.m7ops-head b{display:block;font-size:19px}.m7ops-head small{display:block;margin-top:4px;color:#948773;font-size:10px;line-height:1.45}
      .m7ops-mode{display:flex;gap:7px;margin:5px 0 14px}
      .m7ops-mode button{flex:1;min-height:40px;border:1px solid rgba(217,164,65,.17);border-radius:12px;background:#11100e;color:#bbaa8e;font-size:10px;font-weight:900;touch-action:manipulation}
      .m7ops-mode button.active{border-color:#d9a441;background:rgba(217,164,65,.13);color:#f2ce87}
      .m7ops-preview{position:relative;display:grid;place-items:center;min-height:210px;margin-bottom:12px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:#080706;overflow:hidden}
      .m7ops-preview.banner{min-height:170px}
      .m7ops-preview img{display:block;max-width:100%;max-height:290px;object-fit:cover;background:#111}
      .m7ops-preview.profile img{width:150px;height:150px;border-radius:50%;border:3px solid #d9a441;box-shadow:0 0 22px rgba(217,164,65,.28)}
      .m7ops-preview.banner img{width:100%;height:170px;border-radius:0;object-fit:cover}
      .m7ops-preview span{padding:20px;color:#746b5e;font-size:10px;text-align:center}
      .m7ops-pick,.m7ops-save{
        width:100%;min-height:48px;border-radius:14px;font-size:12px;font-weight:950;touch-action:manipulation;cursor:pointer;
      }
      .m7ops-pick{display:grid;place-items:center;border:1px solid rgba(217,164,65,.28);background:rgba(217,164,65,.08);color:#edcb85}
      .m7ops-save{margin-top:9px;border:0;background:linear-gradient(135deg,#f1cf83,#c58b31);color:#211507}
      .m7ops-save:disabled{opacity:.45;pointer-events:none}
      #m7-owner-profile-file{position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0}
      #m7-owner-profile-status{min-height:20px;margin:9px 2px 0;color:#a99d8a;font-size:10px;line-height:1.45}
      #m7-owner-profile-status.ok{color:#80dda5}#m7-owner-profile-status.err{color:#ff9999}
      @media(max-width:390px){
        .ma7alak-owner-add-grid{grid-template-columns:1fr 1fr!important;gap:8px!important}
        .ma7alak-owner-add-choice{min-height:112px!important;padding:12px 8px!important}
        .ma7alak-owner-add-icon{font-size:26px!important}
        #m7-owner-profile-card{padding:14px!important}
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
        <button id="ma7alak-owner-add-story" class="ma7alak-owner-add-choice" type="button"><span class="ma7alak-owner-add-icon">📸</span>Add Story<small>Disappears automatically after 24 hours</small></button>
        <button id="ma7alak-owner-add-reel" class="ma7alak-owner-add-choice" type="button"><span class="ma7alak-owner-add-icon">🔥</span>Add Homepage Reel<small>Appears in Reels on the homepage</small></button>
        <button id="m7-owner-change-profile" class="ma7alak-owner-add-choice profile-tool" type="button" hidden><span class="ma7alak-owner-add-icon">◉</span>Profile Photo<small>Updates this circle and Show Shops</small></button>
        <button id="m7-owner-change-banner" class="ma7alak-owner-add-choice profile-tool" type="button" hidden><span class="ma7alak-owner-add-icon">▭</span>Profile Banner<small>Replace the banner above your profile</small></button>
      </div>
      <div id="m7-owner-add-permission" aria-live="polite"></div>
    </div>`;
    document.body.appendChild(overlay);

    const studio=document.createElement("div");
    studio.id="m7-owner-profile-studio";
    studio.innerHTML=`<section id="m7-owner-profile-card">
      <button id="m7-owner-profile-close" type="button" aria-label="Close">×</button>
      <div class="m7ops-head"><b id="m7-owner-profile-title">Change profile photo</b><small>Choose an image from your phone. The previous stored image is removed after the new one is saved.</small></div>
      <div class="m7ops-mode">
        <button type="button" data-m7ops-mode="profile">Profile photo</button>
        <button type="button" data-m7ops-mode="banner">Banner</button>
      </div>
      <div id="m7-owner-profile-preview" class="m7ops-preview profile"><span>Choose an image to preview it.</span></div>
      <button id="m7-owner-profile-pick" class="m7ops-pick" type="button">📱 Choose image from device</button>
      <input id="m7-owner-profile-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif">
      <button id="m7-owner-profile-save" class="m7ops-save" type="button" disabled>Save replacement</button>
      <div id="m7-owner-profile-status" aria-live="polite"></div>
    </section>`;
    document.body.appendChild(studio);

    const closeChooser=()=>overlay.classList.remove("active");
    const closeStudio=()=>{
      revokePreview();
      studio.classList.remove("active");
      document.getElementById("m7-owner-profile-status").textContent="";
      document.getElementById("m7-owner-profile-save").disabled=true;
      document.getElementById("m7-owner-profile-file").value="";
    };

    document.getElementById("ma7alak-owner-add-close").addEventListener("click",closeChooser);
    overlay.addEventListener("click",event=>{if(event.target===overlay)closeChooser();});
    document.getElementById("m7-owner-profile-close").addEventListener("click",closeStudio);
    studio.addEventListener("click",event=>{if(event.target===studio)closeStudio();});

    document.getElementById("ma7alak-owner-add-story").addEventListener("click",()=>{
      closeChooser();
      window.postMessage({
        type:"MA7ALAK_OPEN_STORY_UPLOADER",
        shopSlug:activeSlug,
        __ma7alakOpenStoryNow:true
      },"*");
    });

    document.getElementById("ma7alak-owner-add-reel").addEventListener("click",()=>{
      closeChooser();
      if(window.Ma7alakOwnerReels&&typeof window.Ma7alakOwnerReels.open==="function"){
        window.Ma7alakOwnerReels.open(activeSlug).catch(error=>console.error("SHOUFHON Reel uploader:",error));
      }else{
        window.postMessage({type:"MA7ALAK_OPEN_REEL_UPLOADER",shopSlug:activeSlug},"*");
      }
    });

    document.getElementById("m7-owner-change-profile").addEventListener("click",()=>{
      closeChooser();
      openProfileStudio("profile");
    });
    document.getElementById("m7-owner-change-banner").addEventListener("click",()=>{
      closeChooser();
      openProfileStudio("banner");
    });

    studio.querySelectorAll("[data-m7ops-mode]").forEach(button=>{
      button.addEventListener("click",()=>openProfileStudio(button.dataset.m7opsMode));
    });

    document.getElementById("m7-owner-profile-pick").addEventListener("click",()=>{
      document.getElementById("m7-owner-profile-file").click();
    });

    document.getElementById("m7-owner-profile-file").addEventListener("change",event=>{
      const file=event.target.files?.[0]||null;
      const status=document.getElementById("m7-owner-profile-status");
      try{
        validateImage(file);
        revokePreview();
        pendingFile=file;
        pendingObjectUrl=URL.createObjectURL(file);
        renderProfilePreview(pendingObjectUrl);
        document.getElementById("m7-owner-profile-save").disabled=false;
        status.textContent="Ready to save.";
        status.className="";
      }catch(error){
        revokePreview();
        event.target.value="";
        document.getElementById("m7-owner-profile-save").disabled=true;
        status.textContent=error.message||"Invalid image.";
        status.className="err";
      }
    });

    document.getElementById("m7-owner-profile-save").addEventListener("click",saveProfileReplacement);
  }

  function renderProfilePreview(url){
    const preview=document.getElementById("m7-owner-profile-preview");
    if(!preview)return;
    preview.className="m7ops-preview "+profileMode;
    preview.innerHTML=url
      ? '<img src="'+esc(url)+'" alt="Preview">'
      : "<span>Choose an image to preview it.</span>";
  }

  function currentModeUrl(){
    if(!activeProfile)return"";
    if(profileMode==="banner"){
      return String(activeProfile.directory_options?.profile_banner_image_url||"").trim();
    }
    return String(activeProfile.story_logo_url||activeProfile.profile_image_url||"").trim();
  }

  function openProfileStudio(mode){
    injectChooser();
    profileMode=mode==="banner"?"banner":"profile";
    revokePreview();

    const studio=document.getElementById("m7-owner-profile-studio");
    const title=document.getElementById("m7-owner-profile-title");
    title.textContent=profileMode==="banner"?"Change profile banner":"Change profile photo";

    studio.querySelectorAll("[data-m7ops-mode]").forEach(button=>{
      button.classList.toggle("active",button.dataset.m7opsMode===profileMode);
    });

    renderProfilePreview(currentModeUrl());
    document.getElementById("m7-owner-profile-save").disabled=true;
    document.getElementById("m7-owner-profile-file").value="";
    const status=document.getElementById("m7-owner-profile-status");
    status.textContent="";
    status.className="";
    studio.classList.add("active");
  }

  async function uploadReplacement(file,mode){
    validateImage(file);
    const c=await getClient();
    const ext=imageExtension(file);
    const folder=mode==="banner"?"owner-banner":"owner-profile";
    const path=
      folder+"/"+activeSlug+"/"+
      Date.now()+"-"+Math.random().toString(36).slice(2,10)+"."+ext;

    const upload=await c.storage.from(IMAGE_BUCKET).upload(path,file,{
      cacheControl:"0",
      upsert:false,
      contentType:file.type||undefined
    });
    if(upload.error)throw upload.error;

    const publicResult=c.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    const publicUrl=publicResult.data?.publicUrl||"";
    if(!publicUrl){
      await c.storage.from(IMAGE_BUCKET).remove([path]).catch(()=>{});
      throw new Error("Could not create the new image URL.");
    }

    return{path,publicUrl};
  }

  async function saveProfileReplacement(){
    const save=document.getElementById("m7-owner-profile-save");
    const status=document.getElementById("m7-owner-profile-status");
    if(!pendingFile||!activeSlug)return;

    save.disabled=true;
    save.textContent="Saving…";
    status.textContent="Uploading replacement…";
    status.className="";

    let uploaded=null;
    try{
      const c=await getClient();
      await loadOwnerProfile(activeSlug);
      if(!profileEditAllowed)throw new Error("Profile editing is disabled for this shop.");

      const oldProfile=String(activeProfile.profile_image_url||"").trim();
      const oldStoryLogo=String(activeProfile.story_logo_url||"").trim();
      const oldBanner=String(activeProfile.directory_options?.profile_banner_image_url||"").trim();

      uploaded=await uploadReplacement(pendingFile,profileMode);

      const rpc=await c.rpc("owner_update_profile_media",{
        p_shop_slug:activeSlug,
        p_profile_image_url:profileMode==="profile"?uploaded.publicUrl:null,
        p_banner_image_url:profileMode==="banner"?uploaded.publicUrl:null,
        p_update_profile:profileMode==="profile",
        p_update_banner:profileMode==="banner"
      });

      if(rpc.error)throw rpc.error;

      if(profileMode==="profile"){
        await cleanupOldImage(oldProfile,activeSlug);
        if(oldStoryLogo&&oldStoryLogo!==oldProfile){
          await cleanupOldImage(oldStoryLogo,activeSlug);
        }
      }else{
        await cleanupOldImage(oldBanner,activeSlug);
      }

      await loadOwnerProfile(activeSlug);
      ownerProfileCache.set(activeSlug.toLowerCase(),activeProfile);
      status.textContent=profileMode==="banner"
        ?"Banner updated."
        :"Profile photo updated everywhere.";
      status.className="ok";
      renderProfilePreview(currentModeUrl());
      revokePreview();

      try{
        originalSource?.postMessage({
          type:"MA7ALAK_OWNER_PROFILE_UPDATED",
          shopSlug:activeSlug,
          mode:profileMode
        },"*");
      }catch(_){}

      try{
        window.Ma7alakDirectory?.refresh?.();
      }catch(_){}

      setTimeout(()=>{
        document.getElementById("m7-owner-profile-studio")?.classList.remove("active");
      },750);
    }catch(error){
      if(uploaded?.path){
        try{await (await getClient()).storage.from(IMAGE_BUCKET).remove([uploaded.path])}catch(_){}
      }
      status.textContent=error?.message||"Could not update the image.";
      status.className="err";
      save.disabled=false;
    }finally{
      save.textContent="Save replacement";
    }
  }

  async function showChooser(slug,source){
    activeSlug=String(slug||"").trim();
    originalSource=source||null;
    if(!activeSlug)return;
    injectChooser();

    const overlay=document.getElementById("ma7alak-owner-add-chooser");
    const profileButton=document.getElementById("m7-owner-change-profile");
    const bannerButton=document.getElementById("m7-owner-change-banner");
    const permission=document.getElementById("m7-owner-add-permission");

    /*
       If owner-header-auth already broadcast the current shop profile,
       show Profile/Banner immediately. Then refresh silently in background.
       This removes the visible ~1 second permission delay on phone.
    */
    const cacheKey=activeSlug.toLowerCase();
    const cached=ownerProfileCache.get(cacheKey)||null;

    if(cached){
      activeProfile=cached;
      profileEditAllowed=bool(cached.directory_options?.owner_profile_edit_enabled);
      profileButton.hidden=!profileEditAllowed;
      bannerButton.hidden=!profileEditAllowed;
      permission.textContent=profileEditAllowed
        ?"Profile editing is enabled by Admin."
        :"Profile/banner editing is currently locked by Admin.";
    }else{
      profileButton.hidden=true;
      bannerButton.hidden=true;
      permission.textContent="Checking your shop permissions…";
    }

    overlay.classList.add("active");

    try{
      await loadOwnerProfile(activeSlug);
      profileButton.hidden=!profileEditAllowed;
      bannerButton.hidden=!profileEditAllowed;
      permission.textContent=profileEditAllowed
        ?"Profile editing is enabled by Admin."
        :"Profile/banner editing is currently locked by Admin.";
    }catch(error){
      if(!cached){
        profileEditAllowed=false;
        permission.textContent=error?.message||"Could not check profile editing permission.";
      }
    }
  }

  window.addEventListener("message",event=>{
    const data=event.data||{};

    if(data.type==="MA7ALAK_OWNER_STATE"){
      const ownerSlug=String(data.shopSlug||"").trim().toLowerCase();
      if(data.isOwner&&ownerSlug&&data.shop){
        ownerProfileCache.set(ownerSlug,data.shop);
      }
      return;
    }

    if(data.type!=="MA7ALAK_OPEN_STORY_UPLOADER")return;

    if(
      data.__ma7alakOpenStoryNow===true &&
      (!event.source||event.source===window)
    ){
      return;
    }

    const slug=String(data.shopSlug||"").trim();
    if(!slug)return;

    event.stopImmediatePropagation();
    showChooser(slug,event.source);
  },true);

  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    document.getElementById("ma7alak-owner-add-chooser")?.classList.remove("active");
    if(document.getElementById("m7-owner-profile-studio")?.classList.contains("active")){
      revokePreview();
      document.getElementById("m7-owner-profile-studio").classList.remove("active");
    }
  });
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

  function openFrame(source){
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

    activeFrames.set(frame,{
      host:host,
      hostHadClass:host.classList.contains("shoufhon-embed-viewer-host"),
      frameHadClass:frame.classList.contains("shoufhon-embed-viewer-frame"),
      ancestors:ancestors
    });

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
    document.documentElement.classList.add("shoufhon-embed-viewer-open");
    document.body.classList.add("shoufhon-embed-viewer-open");
  }

  function closeFrame(source){
    const frame=frameForSource(source);

    if(!frame){
      if(activeFrames.size===0){
        document.documentElement.classList.remove("shoufhon-embed-viewer-open");
        document.body.classList.remove("shoufhon-embed-viewer-open");
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
      }
      return;
    }

    activeFrames.delete(frame);

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
    }
  }

  window.addEventListener("message",function(event){
    const data=event?.data;

    if(!data||typeof data!=="object"){
      return;
    }

    if(data.type==="SHOUFHON_EMBED_VIEWER_OPEN"){
      openFrame(event.source);
      return;
    }

    if(data.type==="SHOUFHON_EMBED_VIEWER_CLOSE"){
      closeFrame(event.source);
    }
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
    /*
       Hostinger can nest Custom Embed frames. event.source may therefore be
       a descendant window that is not one of document.querySelectorAll("iframe")
       on the top page. Ownership + capability checks below are the real security
       boundary, so accept any WindowProxy that can receive a reply.
    */
    return !!source&&typeof source.postMessage==="function";
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

  function extension(file,type){
    var ext=String(file&&file.name||"").split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"");
    if(ext&&ext.length<=8)return ext;
    var mime=String(file&&file.type||"").toLowerCase();
    if(type==="video"){
      if(mime.indexOf("webm")>=0)return"webm";
      if(mime.indexOf("quicktime")>=0)return"mov";
      return"mp4";
    }
    if(mime.indexOf("png")>=0)return"png";
    if(mime.indexOf("webp")>=0)return"webp";
    if(mime.indexOf("gif")>=0)return"gif";
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
      client.from("shop_videos").select("id,video_url,storage_path,sort_order,created_at").eq("shop_slug",slug).order("sort_order",{ascending:true}).order("created_at",{ascending:true})
    ]);
    if(results[0].error)throw results[0].error;
    if(results[1].error)throw results[1].error;
    var options=profile.directory_options||{};
    return{
      photos:results[0].data||[],
      videos:results[1].data||[],
      photoLimit:numberLimit(options.owner_media_photo_limit,6),
      videoLimit:numberLimit(options.owner_media_video_limit,2)
    };
  }

  async function uploadMediaFile(client,slug,type,file,sortOrder){
    var video=type==="video";
    if(!file)throw new Error("No file selected.");
    if(video&&String(file.type||"").indexOf("video/")!==0)throw new Error("Choose video files only.");
    if(!video&&String(file.type||"").indexOf("image/")!==0)throw new Error("Choose image files only.");
    var max=(video?100:12)*1024*1024;
    if(Number(file.size||0)>max)throw new Error(String(file.name||"File")+" is too large.");

    var bucket=video?VIDEO_BUCKET:PHOTO_BUCKET;
    var path=newMediaPath(slug,type,file);
    var uploaded=false;

    try{
      var upload=await client.storage.from(bucket).upload(path,file,{
        cacheControl:"0",
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

      if(op==="add"){
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
      else if(op==="replace"){
        var replaceType=data.mediaType==="video"?"video":"photo";
        var replaceVideo=replaceType==="video";
        var replaceTable=replaceVideo?"shop_videos":"shop_gallery";
        var replaceBucket=replaceVideo?VIDEO_BUCKET:PHOTO_BUCKET;
        var replaceId=Number(data.id);
        var file=data.file;
        if(!Number.isFinite(replaceId)||!file)throw new Error("Replacement is incomplete.");

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
            cacheControl:"0",
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

  window.addEventListener("message",function(event){
    var data=event&&event.data||{};
    if(data.type==="SHOUFHON_OWNER_MEDIA_REQUEST"){
      handleMediaRequest(event);
      return;
    }
    if(data.type==="SHOUFHON_OWNER_ABOUT_REQUEST"){
      handleAboutRequest(event);
    }
  });
})();
