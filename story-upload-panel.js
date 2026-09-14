(function(){

  "use strict";

  /*
  =========================================================
  MA7ALAK
  GLOBAL PAGE-LEVEL STORY UPLOADER

  UPGRADE:
  - Modern/simple Add Story design
  - Automatic shop name + profile image from shop_profiles
  - Multiple photo/video selection
  - Individual optional status for every selected Story
  - status_text saved to shop_stories
  - Existing owner verification / storage / expiry / postMessage kept
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

  let activeShopName =
    null;

  let isUploading =
    false;

  let uploadSourceWindow =
    null;

  let selectedStories =
    [];


  /* =========================================================
     CONSTANTS
  ========================================================= */

  const MAX_FILE_SIZE =
    50 * 1024 * 1024;

  const MAX_STATUS_LENGTH =
    200;


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
     HELPERS
  ========================================================= */

  function escapeHTML(value){

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function safeShopFallbackName(slug){

    return String(slug || "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, function(letter){
        return letter.toUpperCase();
      });

  }


  function getFileType(file){

    if(
      file &&
      String(file.type || "").startsWith("video/")
    ){

      return "video";

    }

    return "image";

  }


  function getExtension(file, type){

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


  function makeUniqueId(){

    return (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    )
      ? window.crypto.randomUUID()
      :
      (
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2)
      );

  }


  function cleanupPreviewURLs(){

    selectedStories.forEach(function(item){

      if(
        item &&
        item.previewUrl
      ){

        try{
          URL.revokeObjectURL(
            item.previewUrl
          );
        }
        catch(error){}

      }

    });

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
   MA7ALAK — MODERN STORY UPLOADER
========================================================= */

#ma7alak-page-story-uploader{
  position:fixed!important;
  inset:0!important;
  width:100vw!important;
  height:100vh!important;
  width:100dvw!important;
  height:100dvh!important;
  display:none!important;
  align-items:center!important;
  justify-content:center!important;
  box-sizing:border-box!important;
  padding:
    max(14px,env(safe-area-inset-top))
    12px
    max(18px,env(safe-area-inset-bottom))
    12px!important;
  background:rgba(3,4,5,.91)!important;
  backdrop-filter:blur(16px)!important;
  -webkit-backdrop-filter:blur(16px)!important;
  z-index:2147483647!important;
  overflow:hidden!important;
  overscroll-behavior:none!important;
  -webkit-tap-highlight-color:transparent!important;
}

#ma7alak-page-story-uploader.active{
  display:flex!important;
}

#ma7alak-page-story-panel{
  position:relative!important;
  width:min(430px,calc(100vw - 24px))!important;
  max-height:calc(100dvh - 28px)!important;
  box-sizing:border-box!important;
  overflow:hidden!important;
  display:flex!important;
  flex-direction:column!important;
  margin:0!important;
  border:1px solid rgba(255,255,255,.09)!important;
  border-radius:28px!important;
  background:
    linear-gradient(
      180deg,
      rgba(23,24,26,.98),
      rgba(10,11,12,.99)
    )!important;
  box-shadow:
    0 28px 90px rgba(0,0,0,.72),
    0 0 0 1px rgba(217,164,65,.05)!important;
  color:#fff!important;
  font-family:Arial,"Segoe UI",sans-serif!important;
  animation:ma7alakStoryPanelIn .22s ease-out!important;
}

@keyframes ma7alakStoryPanelIn{
  from{
    opacity:0;
    transform:translateY(10px) scale(.97);
  }
  to{
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

#ma7alak-page-story-panel::before{
  content:"";
  position:absolute;
  left:50%;
  top:0;
  width:110px;
  height:2px;
  transform:translateX(-50%);
  border-radius:0 0 10px 10px;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(239,198,110,.92),
      transparent
    );
  pointer-events:none;
}

#ma7alak-page-story-scroll{
  width:100%!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior:contain!important;
  padding:
    26px 18px
    max(22px,env(safe-area-inset-bottom))!important;
  box-sizing:border-box!important;
}

#ma7alak-page-story-close{
  position:absolute!important;
  top:13px!important;
  right:13px!important;
  width:36px!important;
  height:36px!important;
  border:1px solid rgba(255,255,255,.09)!important;
  border-radius:50%!important;
  background:rgba(255,255,255,.055)!important;
  color:rgba(255,255,255,.86)!important;
  font-size:24px!important;
  line-height:32px!important;
  text-align:center!important;
  padding:0!important;
  margin:0!important;
  cursor:pointer!important;
  outline:none!important;
  appearance:none!important;
  -webkit-appearance:none!important;
  -webkit-tap-highlight-color:transparent!important;
  z-index:20!important;
}

#ma7alak-page-story-close:active{
  transform:scale(.92)!important;
}

#ma7alak-page-story-title{
  margin:2px 42px 4px!important;
  padding:0!important;
  color:#fff!important;
  text-align:center!important;
  font-size:24px!important;
  line-height:1.2!important;
  font-weight:900!important;
  letter-spacing:-.4px!important;
}

#ma7alak-page-story-subtitle{
  margin:0 28px 18px!important;
  padding:0!important;
  color:rgba(255,255,255,.48)!important;
  font-size:12px!important;
  line-height:1.5!important;
  text-align:center!important;
}

#ma7alak-page-story-profile{
  width:100%!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  margin:0 0 20px!important;
}

#ma7alak-page-story-shop-image-wrap{
  width:74px!important;
  height:74px!important;
  border-radius:50%!important;
  padding:3px!important;
  box-sizing:border-box!important;
  background:
    linear-gradient(
      145deg,
      #efc66e,
      #8f6424,
      #efc66e
    )!important;
  box-shadow:
    0 8px 30px rgba(0,0,0,.38),
    0 0 22px rgba(217,164,65,.14)!important;
}

#ma7alak-page-story-shop-image{
  width:100%!important;
  height:100%!important;
  display:block!important;
  object-fit:cover!important;
  border-radius:50%!important;
  border:3px solid #111214!important;
  background:#17191b!important;
}

#ma7alak-page-story-shop-fallback{
  width:100%!important;
  height:100%!important;
  display:none!important;
  align-items:center!important;
  justify-content:center!important;
  border-radius:50%!important;
  border:3px solid #111214!important;
  box-sizing:border-box!important;
  background:#1b1d20!important;
  color:#d9a441!important;
  font-size:25px!important;
  font-weight:900!important;
}

#ma7alak-page-story-shop{
  max-width:90%!important;
  margin:9px 0 0!important;
  padding:0!important;
  color:#f7f7f7!important;
  font-size:14px!important;
  font-weight:800!important;
  text-align:center!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}

#ma7alak-page-story-picker{
  width:100%!important;
  display:grid!important;
  grid-template-columns:1fr 1fr!important;
  gap:10px!important;
  margin:0!important;
}

.ma7alak-page-story-option{
  width:100%!important;
  min-height:68px!important;
  border:1px solid rgba(217,164,65,.22)!important;
  border-radius:17px!important;
  background:
    linear-gradient(
      145deg,
      rgba(217,164,65,.10),
      rgba(255,255,255,.028)
    )!important;
  color:#fff!important;
  display:flex!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:11px!important;
  padding:13px 14px!important;
  margin:0!important;
  box-sizing:border-box!important;
  cursor:pointer!important;
  font-family:inherit!important;
  appearance:none!important;
  -webkit-appearance:none!important;
  outline:none!important;
  -webkit-tap-highlight-color:transparent!important;
  transition:
    transform .16s ease,
    border-color .16s ease,
    background .16s ease!important;
}

.ma7alak-page-story-option:active{
  transform:scale(.97)!important;
}

.ma7alak-page-story-option-icon{
  width:40px!important;
  height:40px!important;
  flex:0 0 40px!important;
  border-radius:13px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  background:rgba(255,255,255,.055)!important;
  font-size:22px!important;
}

.ma7alak-page-story-option-text{
  min-width:0!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:flex-start!important;
}

.ma7alak-page-story-option-title{
  color:#fff!important;
  font-size:12px!important;
  font-weight:900!important;
  line-height:1.2!important;
}

.ma7alak-page-story-option-small{
  margin-top:4px!important;
  color:rgba(255,255,255,.38)!important;
  font-size:9px!important;
  line-height:1.2!important;
}

#ma7alak-page-story-selected-head{
  width:100%!important;
  display:none!important;
  align-items:center!important;
  justify-content:space-between!important;
  margin:19px 0 9px!important;
}

#ma7alak-page-story-selected-head.visible{
  display:flex!important;
}

#ma7alak-page-story-selected-title{
  color:rgba(255,255,255,.78)!important;
  font-size:11px!important;
  font-weight:800!important;
}

#ma7alak-page-story-selected-count{
  color:#d9a441!important;
  font-size:10px!important;
  font-weight:900!important;
}

#ma7alak-page-story-list{
  width:100%!important;
  display:flex!important;
  flex-direction:column!important;
  gap:10px!important;
}

.ma7alak-story-selected-card{
  width:100%!important;
  display:grid!important;
  grid-template-columns:68px 1fr!important;
  gap:10px!important;
  box-sizing:border-box!important;
  padding:9px!important;
  border:1px solid rgba(255,255,255,.075)!important;
  border-radius:17px!important;
  background:rgba(255,255,255,.027)!important;
}

.ma7alak-story-selected-media{
  position:relative!important;
  width:68px!important;
  height:86px!important;
  overflow:hidden!important;
  border-radius:12px!important;
  background:#050505!important;
}

.ma7alak-story-selected-media img,
.ma7alak-story-selected-media video{
  width:100%!important;
  height:100%!important;
  display:block!important;
  object-fit:cover!important;
}

.ma7alak-story-selected-type{
  position:absolute!important;
  left:5px!important;
  bottom:5px!important;
  min-width:25px!important;
  height:20px!important;
  padding:0 6px!important;
  border-radius:20px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  box-sizing:border-box!important;
  background:rgba(0,0,0,.72)!important;
  color:#fff!important;
  font-size:9px!important;
  font-weight:800!important;
}

.ma7alak-story-selected-info{
  min-width:0!important;
  display:flex!important;
  flex-direction:column!important;
  justify-content:center!important;
}

.ma7alak-story-selected-top{
  width:100%!important;
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:8px!important;
  margin:0 0 7px!important;
}

.ma7alak-story-selected-name{
  min-width:0!important;
  color:rgba(255,255,255,.72)!important;
  font-size:10px!important;
  font-weight:700!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}

.ma7alak-story-remove{
  width:27px!important;
  height:27px!important;
  flex:0 0 27px!important;
  border:1px solid rgba(255,255,255,.08)!important;
  border-radius:50%!important;
  background:rgba(255,255,255,.05)!important;
  color:rgba(255,255,255,.72)!important;
  font-size:17px!important;
  line-height:24px!important;
  padding:0!important;
  margin:0!important;
  cursor:pointer!important;
  appearance:none!important;
  -webkit-appearance:none!important;
}

.ma7alak-story-status-wrap{
  position:relative!important;
  width:100%!important;
}

.ma7alak-story-status-input{
  width:100%!important;
  height:56px!important;
  resize:none!important;
  box-sizing:border-box!important;
  border:1px solid rgba(255,255,255,.075)!important;
  border-radius:12px!important;
  outline:none!important;
  background:rgba(0,0,0,.24)!important;
  color:#fff!important;
  padding:10px 42px 10px 10px!important;
  font-family:inherit!important;
  font-size:11px!important;
  line-height:1.4!important;
  appearance:none!important;
  -webkit-appearance:none!important;
}

.ma7alak-story-status-input::placeholder{
  color:rgba(255,255,255,.30)!important;
}

.ma7alak-story-status-input:focus{
  border-color:rgba(217,164,65,.50)!important;
}

.ma7alak-story-char-count{
  position:absolute!important;
  right:8px!important;
  bottom:7px!important;
  color:rgba(255,255,255,.28)!important;
  font-size:8px!important;
  font-weight:700!important;
}

#ma7alak-page-story-publish{
  width:100%!important;
  height:48px!important;
  display:none!important;
  align-items:center!important;
  justify-content:center!important;
  margin:14px 0 0!important;
  border:1px solid rgba(239,198,110,.50)!important;
  border-radius:15px!important;
  background:
    linear-gradient(
      135deg,
      #d9a441,
      #b67a21
    )!important;
  color:#0c0c0c!important;
  font-size:12px!important;
  font-weight:900!important;
  letter-spacing:.1px!important;
  cursor:pointer!important;
  appearance:none!important;
  -webkit-appearance:none!important;
  box-shadow:0 8px 24px rgba(217,164,65,.12)!important;
}

#ma7alak-page-story-publish.visible{
  display:flex!important;
}

#ma7alak-page-story-publish:disabled{
  opacity:.45!important;
  cursor:default!important;
}

#ma7alak-page-story-status{
  width:100%!important;
  min-height:20px!important;
  margin:12px 0 0!important;
  text-align:center!important;
  color:rgba(255,255,255,.72)!important;
  font-size:11px!important;
  line-height:1.5!important;
  display:none!important;
}

#ma7alak-page-story-status.visible{
  display:block!important;
}

#ma7alak-page-story-progress{
  width:100%!important;
  height:4px!important;
  margin:9px auto 0!important;
  border-radius:20px!important;
  overflow:hidden!important;
  background:rgba(255,255,255,.07)!important;
  display:none!important;
}

#ma7alak-page-story-progress.visible{
  display:block!important;
}

#ma7alak-page-story-progress-bar{
  width:0%;
  height:100%;
  border-radius:20px;
  background:
    linear-gradient(
      90deg,
      #b67a21,
      #efc66e
    );
  transition:width .18s ease;
}

#ma7alak-page-story-note{
  width:100%!important;
  box-sizing:border-box!important;
  margin:15px 0 0!important;
  padding:10px 12px!important;
  border-radius:12px!important;
  background:rgba(255,255,255,.035)!important;
  color:rgba(255,255,255,.56)!important;
  text-align:center!important;
  font-size:10px!important;
  font-weight:600!important;
  line-height:1.35!important;
}

@media(max-width:600px){

  #ma7alak-page-story-uploader{
    padding:
      max(8px,env(safe-area-inset-top))
      8px
      max(12px,env(safe-area-inset-bottom))
      8px!important;
  }

  #ma7alak-page-story-panel{
    width:calc(100vw - 16px)!important;
    max-height:calc(100dvh - 16px)!important;
    border-radius:24px!important;
  }

  #ma7alak-page-story-scroll{
    padding:
      23px 14px
      max(18px,env(safe-area-inset-bottom))!important;
  }

  #ma7alak-page-story-title{
    font-size:22px!important;
  }

  #ma7alak-page-story-shop-image-wrap{
    width:68px!important;
    height:68px!important;
  }

  .ma7alak-page-story-option{
    min-height:64px!important;
    padding:11px!important;
  }

  .ma7alak-page-story-option-icon{
    width:37px!important;
    height:37px!important;
    flex-basis:37px!important;
    font-size:20px!important;
  }

}

@media(max-width:370px){

  #ma7alak-page-story-picker{
    grid-template-columns:1fr!important;
  }

  .ma7alak-story-selected-card{
    grid-template-columns:60px 1fr!important;
  }

  .ma7alak-story-selected-media{
    width:60px!important;
    height:80px!important;
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
          id="ma7alak-page-story-scroll"
        >

          <div
            id="ma7alak-page-story-title"
          >
            Add Story
          </div>

          <div
            id="ma7alak-page-story-subtitle"
          >
            Share something new from your shop
          </div>

          <div
            id="ma7alak-page-story-profile"
          >

            <div
              id="ma7alak-page-story-shop-image-wrap"
            >

              <img
                id="ma7alak-page-story-shop-image"
                alt=""
              />

              <div
                id="ma7alak-page-story-shop-fallback"
              >
                M
              </div>

            </div>

            <div
              id="ma7alak-page-story-shop"
            ></div>

          </div>

          <div
            id="ma7alak-page-story-picker"
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
                class="ma7alak-page-story-option-text"
              >
                <span
                  class="ma7alak-page-story-option-title"
                >
                  Photos
                </span>

                <span
                  class="ma7alak-page-story-option-small"
                >
                  Select multiple
                </span>
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
                class="ma7alak-page-story-option-text"
              >
                <span
                  class="ma7alak-page-story-option-title"
                >
                  Videos
                </span>

                <span
                  class="ma7alak-page-story-option-small"
                >
                  Select multiple
                </span>
              </span>
            </button>

          </div>

          <input
            id="ma7alak-page-story-image-input"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            style="display:none!important;"
          />

          <input
            id="ma7alak-page-story-video-input"
            type="file"
            multiple
            accept="video/mp4,video/webm,video/quicktime"
            style="display:none!important;"
          />

          <div
            id="ma7alak-page-story-selected-head"
          >
            <div
              id="ma7alak-page-story-selected-title"
            >
              Selected Stories
            </div>

            <div
              id="ma7alak-page-story-selected-count"
            >
              0
            </div>
          </div>

          <div
            id="ma7alak-page-story-list"
          ></div>

          <button
            id="ma7alak-page-story-publish"
            type="button"
          >
            Publish Stories
          </button>

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
            Story disappears automatically after 24 hours
          </div>

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

          if(!isUploading){

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

          if(!isUploading){

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
            this.files.length
          ){

            addSelectedFiles(
              Array.from(
                this.files
              )
            );

          }

          this.value =
            "";

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

            addSelectedFiles(
              Array.from(
                this.files
              )
            );

          }

          this.value =
            "";

        }
      );


    document
      .getElementById(
        "ma7alak-page-story-publish"
      )
      .addEventListener(
        "click",
        publishSelectedStories
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
     SHOP PROFILE
  ========================================================= */

  async function loadShopProfile(
    client,
    shopSlug
  ){

    const nameElement =
      document.getElementById(
        "ma7alak-page-story-shop"
      );

    const image =
      document.getElementById(
        "ma7alak-page-story-shop-image"
      );

    const fallback =
      document.getElementById(
        "ma7alak-page-story-shop-fallback"
      );


    activeShopName =
      safeShopFallbackName(
        shopSlug
      );


    if(nameElement){

      nameElement.textContent =
        activeShopName;

    }


    if(fallback){

      fallback.textContent =
        (
          activeShopName
            .charAt(0) || "M"
        ).toUpperCase();

      fallback.style.display =
        "flex";

    }


    if(image){

      image.style.display =
        "none";

      image.removeAttribute(
        "src"
      );

    }


    try{

      const profileResult =
        await client
          .from("shop_profiles")
          .select(
            "shop_name,profile_image_url"
          )
          .eq(
            "shop_slug",
            shopSlug
          )
          .maybeSingle();


      if(
        profileResult.error ||
        !profileResult.data
      ){

        return;

      }


      const profile =
        profileResult.data;


      activeShopName =
        String(
          profile.shop_name ||
          activeShopName
        ).trim();


      if(nameElement){

        nameElement.textContent =
          activeShopName;

      }


      if(fallback){

        fallback.textContent =
          (
            activeShopName
              .charAt(0) || "M"
          ).toUpperCase();

      }


      const imageUrl =
        String(
          profile.profile_image_url ||
          ""
        ).trim();


      if(
        image &&
        imageUrl
      ){

        image.onload =
          function(){

            image.style.display =
              "block";

            if(fallback){

              fallback.style.display =
                "none";

            }

          };


        image.onerror =
          function(){

            image.style.display =
              "none";

            if(fallback){

              fallback.style.display =
                "flex";

            }

          };


        image.src =
          imageUrl;

      }

    }

    catch(error){

      console.log(
        "MA7ALAK shop profile:",
        error
      );

    }

  }


  /* =========================================================
     SELECTED FILES
  ========================================================= */

  function addSelectedFiles(files){

    if(
      isUploading ||
      !Array.isArray(files)
    ){

      return;

    }


    let added =
      0;


    files.forEach(function(file){

      if(!file){
        return;
      }


      const type =
        getFileType(
          file
        );


      const allowed =
        type === "video"
          ? [
              "video/mp4",
              "video/webm",
              "video/quicktime"
            ]
          : [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/gif"
            ];


      if(
        !allowed.includes(
          file.type
        )
      ){

        return;

      }


      if(
        file.size >
        MAX_FILE_SIZE
      ){

        alert(
          file.name +
          "\n\nFile is larger than 50MB."
        );

        return;

      }


      selectedStories.push({

        id:
          makeUniqueId(),

        file:
          file,

        type:
          type,

        previewUrl:
          URL.createObjectURL(
            file
          ),

        statusText:
          ""

      });


      added +=
        1;

    });


    if(added > 0){

      renderSelectedStories();

      showStatus(
        ""
      );

    }

  }


  function removeSelectedStory(
    itemId
  ){

    if(isUploading){
      return;
    }


    const index =
      selectedStories.findIndex(
        function(item){
          return item.id === itemId;
        }
      );


    if(index < 0){
      return;
    }


    const item =
      selectedStories[index];


    if(
      item &&
      item.previewUrl
    ){

      try{
        URL.revokeObjectURL(
          item.previewUrl
        );
      }
      catch(error){}

    }


    selectedStories.splice(
      index,
      1
    );


    renderSelectedStories();

  }


  function renderSelectedStories(){

    const list =
      document.getElementById(
        "ma7alak-page-story-list"
      );

    const head =
      document.getElementById(
        "ma7alak-page-story-selected-head"
      );

    const count =
      document.getElementById(
        "ma7alak-page-story-selected-count"
      );

    const publish =
      document.getElementById(
        "ma7alak-page-story-publish"
      );


    if(!list){
      return;
    }


    list.innerHTML =
      "";


    if(count){

      count.textContent =
        String(
          selectedStories.length
        );

    }


    if(
      selectedStories.length === 0
    ){

      if(head){

        head.classList.remove(
          "visible"
        );

      }

      if(publish){

        publish.classList.remove(
          "visible"
        );

      }

      return;

    }


    if(head){

      head.classList.add(
        "visible"
      );

    }


    if(publish){

      publish.classList.add(
        "visible"
      );

      publish.textContent =
        selectedStories.length === 1
          ? "Publish Story"
          : (
              "Publish " +
              selectedStories.length +
              " Stories"
            );

    }


    selectedStories.forEach(
      function(item, index){

        const card =
          document.createElement(
            "div"
          );


        card.className =
          "ma7alak-story-selected-card";


        const media =
          item.type === "video"
            ? (
                '<video src="' +
                escapeHTML(item.previewUrl) +
                '" muted playsinline preload="metadata"></video>'
              )
            : (
                '<img src="' +
                escapeHTML(item.previewUrl) +
                '" alt="">'
              );


        card.innerHTML = `

          <div
            class="ma7alak-story-selected-media"
          >
            ${media}

            <div
              class="ma7alak-story-selected-type"
            >
              ${item.type === "video" ? "VIDEO" : "PHOTO"}
            </div>
          </div>

          <div
            class="ma7alak-story-selected-info"
          >

            <div
              class="ma7alak-story-selected-top"
            >

              <div
                class="ma7alak-story-selected-name"
              >
                ${escapeHTML(item.file.name)}
              </div>

              <button
                class="ma7alak-story-remove"
                type="button"
                aria-label="Remove"
              >
                ×
              </button>

            </div>

            <div
              class="ma7alak-story-status-wrap"
            >

              <textarea
                class="ma7alak-story-status-input"
                maxlength="${MAX_STATUS_LENGTH}"
                placeholder="Write a status..."
              >${escapeHTML(item.statusText)}</textarea>

              <div
                class="ma7alak-story-char-count"
              >
                ${String(item.statusText || "").length}/${MAX_STATUS_LENGTH}
              </div>

            </div>

          </div>

        `;


        const removeButton =
          card.querySelector(
            ".ma7alak-story-remove"
          );


        const textarea =
          card.querySelector(
            ".ma7alak-story-status-input"
          );


        const charCount =
          card.querySelector(
            ".ma7alak-story-char-count"
          );


        removeButton.addEventListener(
          "click",
          function(){

            removeSelectedStory(
              item.id
            );

          }
        );


        textarea.addEventListener(
          "input",
          function(){

            let value =
              String(
                this.value || ""
              )
              .slice(
                0,
                MAX_STATUS_LENGTH
              );


            this.value =
              value;


            const current =
              selectedStories.find(
                function(story){
                  return story.id === item.id;
                }
              );


            if(current){

              current.statusText =
                value;

            }


            if(charCount){

              charCount.textContent =
                value.length +
                "/" +
                MAX_STATUS_LENGTH;

            }

          }
        );


        list.appendChild(
          card
        );


        const video =
          card.querySelector(
            "video"
          );


        if(video){

          video
            .play()
            .catch(
              function(){}
            );

        }

      }
    );

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


    cleanupPreviewURLs();


    selectedStories =
      [];


    renderSelectedStories();


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

  function showStatus(message){

    const status =
      document.getElementById(
        "ma7alak-page-story-status"
      );


    if(!status){
      return;
    }


    const cleanMessage =
      String(
        message || ""
      );


    status.textContent =
      cleanMessage;


    if(cleanMessage){

      status.classList.add(
        "visible"
      );

    }

    else{

      status.classList.remove(
        "visible"
      );

    }

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


      resetUploader();


      overlay.classList.add(
        "active"
      );


      await loadShopProfile(
        client,
        shopSlug
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

    if(isUploading){
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


    cleanupPreviewURLs();


    selectedStories =
      [];


    activeShopSlug =
      null;


    activeShopName =
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


    renderSelectedStories();

  }


  /* =========================================================
     PUBLISH SELECTED STORIES
  ========================================================= */

  async function publishSelectedStories(){

    if(
      isUploading ||
      !activeShopSlug ||
      selectedStories.length === 0
    ){

      return;

    }


    let client =
      null;

    let uploadedStoragePaths =
      [];


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


      const publishButton =
        document.getElementById(
          "ma7alak-page-story-publish"
        );


      if(progress){

        progress.classList.add(
          "visible"
        );

      }


      if(bar){

        bar.style.width =
          "3%";

      }


      if(publishButton){

        publishButton.disabled =
          true;

      }


      showStatus(
        "Preparing Stories..."
      );


      client =
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
         UPLOAD EACH STORY
      ----------------------------------------- */

      const total =
        selectedStories.length;


      for(
        let index = 0;
        index < total;
        index++
      ){

        const item =
          selectedStories[index];


        const file =
          item.file;


        const type =
          item.type;


        const extension =
          getExtension(
            file,
            type
          );


        const uniqueId =
          makeUniqueId();


        const storagePath =
          activeShopSlug +
          "/" +
          uniqueId +
          "." +
          extension;


        showStatus(
          "Uploading Story " +
          (index + 1) +
          " of " +
          total +
          "..."
        );


        if(bar){

          const startPercent =
            Math.round(
              (
                index /
                total
              ) *
              82
            ) +
            5;

          bar.style.width =
            startPercent +
            "%";

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


        if(uploadResult.error){

          throw uploadResult.error;

        }


        uploadedStoragePaths.push(
          storagePath
        );


        /* -----------------------------------------
           24 HOURS
        ----------------------------------------- */

        const expiresAt =
          new Date(
            Date.now() +
            24 * 60 * 60 * 1000
          ).toISOString();


        const statusText =
          String(
            item.statusText || ""
          )
          .trim()
          .slice(
            0,
            MAX_STATUS_LENGTH
          );


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

              status_text:
                statusText || null,

              expires_at:
                expiresAt

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


          uploadedStoragePaths =
            uploadedStoragePaths.filter(
              function(path){
                return path !== storagePath;
              }
            );


          throw insertResult.error;

        }


        if(bar){

          const endPercent =
            Math.round(
              (
                (index + 1) /
                total
              ) *
              90
            ) +
            5;

          bar.style.width =
            Math.min(
              96,
              endPercent
            ) +
            "%";

        }

      }


      if(bar){

        bar.style.width =
          "100%";

      }


      showStatus(
        total === 1
          ? "✓ Story published!"
          : "✓ Stories published!"
      );


      /* -----------------------------------------
         TELL STORY EMBED
      ----------------------------------------- */

      if(uploadSourceWindow){

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

          const publishButton =
            document.getElementById(
              "ma7alak-page-story-publish"
            );

          if(publishButton){

            publishButton.disabled =
              false;

          }

          closeUploader();

        },
        900
      );

    }

    catch(error){

      console.error(
        "MA7ALAK page uploader error:",
        error
      );


      isUploading =
        false;


      const publishButton =
        document.getElementById(
          "ma7alak-page-story-publish"
        );


      if(publishButton){

        publishButton.disabled =
          false;

      }


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
          "Upload failed. Please try again."
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

      if(!event.data){
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


      if(!shopSlug){
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
   1. Changed title to "Add Story".
   2. Rebuilt uploader into a simpler modern mobile-first panel.
   3. Added automatic shop_name + profile_image_url loading from
      public.shop_profiles using the active shop_slug.
   4. Added MULTIPLE file selection for Photos and Videos.
   5. Added a selected Stories preview list before publishing.
   6. Added an optional individual "Write a status..." field
      for every selected Story, max 200 characters.
   7. Saves each status into shop_stories.status_text.
   8. Multiple Stories are uploaded in the exact order selected.
   9. Existing owner verification remains in place.
   10. Existing shop-stories Storage bucket remains in place.
   11. Existing 24-hour expiration remains in place.
   12. Existing MA7ALAK_STORY_UPLOADED postMessage remains.
   13. Bottom note now clearly says:
       "Story disappears automatically after 24 hours".
   ========================================================= */
