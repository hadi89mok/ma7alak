(function(){

  "use strict";

  /*
  =========================================================
  MA7ALAK
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
   MA7ALAK PAGE STORY UPLOADER
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

  border-radius:50%!important;

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
          إضافة ستوري
        </div>


        <div
          id="ma7alak-page-story-subtitle"
        >
          شارك آخر شي جديد من محلك
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
              صورة
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
              فيديو
            </span>

          </button>

        </div>


        <input
          id="ma7alak-page-story-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style="display:none!important;"
        />


        <input
          id="ma7alak-page-story-video-input"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
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
          الستوري بتختفي تلقائياً بعد 24 ساعة
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

            document
              .getElementById(
                "ma7alak-page-story-image-input"
              )
              .click();

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

            document
              .getElementById(
                "ma7alak-page-story-video-input"
              )
              .click();

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
            this.files[0]
          ){

            uploadStory(
              this.files[0],
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
            this.files[0]
          ){

            uploadStory(
              this.files[0],
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
          "لازم تكون مسجّل الدخول."
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
          "ما عندك صلاحية لهذا المحل."
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
        "MA7ALAK uploader open error:",
        error
      );


      alert(
        "صار خطأ. جرّب مرة ثانية."
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
     UPLOAD STORY
  ========================================================= */

  async function uploadStory(
    file,
    type
  ){

    if(
      isUploading ||
      !activeShopSlug ||
      !file
    ){

      return;

    }


    const maxSize =
      50 * 1024 * 1024;


    if(
      file.size >
      maxSize
    ){

      alert(
        "حجم الملف كبير. الحد الأقصى 50MB."
      );

      return;

    }


    try{

      isUploading =
        true;


      const progress =
        document.getElementById(
          "ma7alak-page-story-progress"
        );


      const bar =
        document.getElementById(
          "ma7alak-page-story-progress-bar"
        );


      if(progress){

        progress.classList.add(
          "visible"
        );

      }


      if(bar){

        bar.style.width =
          "10%";

      }


      showStatus(
        "جاري رفع الستوري..."
      );


      const client =
        await loadSupabase();


      /* -----------------------------------------
         SESSION
      ----------------------------------------- */

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


      /* -----------------------------------------
         OWNER CHECK
      ----------------------------------------- */

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


      /* -----------------------------------------
         EXTENSION
      ----------------------------------------- */

      let extension =
        "jpg";


      if(
        type === "video"
      ){

        if(
          file.type === "video/webm"
        ){

          extension =
            "webm";

        }

        else if(
          file.type === "video/quicktime"
        ){

          extension =
            "mov";

        }

        else{

          extension =
            "mp4";

        }

      }

      else{

        if(
          file.type === "image/png"
        ){

          extension =
            "png";

        }

        else if(
          file.type === "image/webp"
        ){

          extension =
            "webp";

        }

        else if(
          file.type === "image/gif"
        ){

          extension =
            "gif";

        }

      }


      /* -----------------------------------------
         UNIQUE ID
      ----------------------------------------- */

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
        extension;


      if(bar){

        bar.style.width =
          "25%";

      }


      /* -----------------------------------------
         STORAGE
      ----------------------------------------- */

      const uploadResult =
        await client
          .storage
          .from("shop-stories")
          .upload(
            storagePath,
            file,
            {

              cacheControl:
                "3600",

              upsert:
                false,

              contentType:
                file.type

            }
          );


      if(
        uploadResult.error
      ){

        throw uploadResult.error;

      }


      if(bar){

        bar.style.width =
          "70%";

      }


      /* -----------------------------------------
         24 HOURS
      ----------------------------------------- */

      const expiresAt =
        new Date(
          Date.now() +
          24 * 60 * 60 * 1000
        ).toISOString();


      /* -----------------------------------------
         DATABASE
      ----------------------------------------- */

      const insertResult =
        await client
          .from("shop_stories")
          .insert({

            user_id:
              user.id,

            shop_slug:
              activeShopSlug,

            media_type:
              type,

            storage_path:
              storagePath,

            expires_at:
              expiresAt

          })
          .select()
          .single();


      if(
        insertResult.error
      ){

        await client
          .storage
          .from("shop-stories")
          .remove([
            storagePath
          ]);

        throw insertResult.error;

      }


      if(bar){

        bar.style.width =
          "100%";

      }


      showStatus(
        "✓ تم نشر الستوري!"
      );


      /* -----------------------------------------
         TELL STORY EMBED
      ----------------------------------------- */

      if(
        uploadSourceWindow
      ){

        try{

          uploadSourceWindow.postMessage(

            {

              type:
                "MA7ALAK_STORY_UPLOADED",

              shopSlug:
                activeShopSlug

            },

            "*"

          );

        }

        catch(error){

          console.log(
            "MA7ALAK upload message error:",
            error
          );

        }

      }


      /* -----------------------------------------
         ALSO TELL PAGE
      ----------------------------------------- */

      try{

        window.postMessage(

          {

            type:
              "MA7ALAK_STORY_UPLOADED",

            shopSlug:
              activeShopSlug

          },

          "*"

        );

      }

      catch(error){}


      setTimeout(
        function(){

          isUploading =
            false;

          closeUploader();

        },
        850
      );

    }

    catch(error){

      console.error(
        "MA7ALAK page uploader error:",
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
          "لازم تكون مسجّل الدخول."
        );

      }

      else if(
        error &&
        error.message ===
        "NOT_OWNER"
      ){

        showStatus(
          "ما عندك صلاحية لهذا المحل."
        );

      }

      else{

        showStatus(
          "صار خطأ أثناء الرفع. جرّب مرة ثانية."
        );

      }


      const progress =
        document.getElementById(
          "ma7alak-page-story-progress"
        );


      if(progress){

        progress.classList.remove(
          "visible"
        );

      }

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
        event.data.type !==
        "MA7ALAK_OPEN_STORY_UPLOADER"
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
