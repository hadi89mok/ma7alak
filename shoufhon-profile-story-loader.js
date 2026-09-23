/* =========================================================
   SHOUFHON PROFILE + STORY LOADER V1
   Isolated migration test for the former giant Hostinger embed.

   Loads the exact migrated Profile/Story source from GitHub in two
   payload parts, joins them, then rebuilds this dedicated Hostinger
   Custom Embed document. Existing Profile IDs/events/modules remain.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_PROFILE_STORY_LOADER_V1__)return;
  window.__SHOUFHON_PROFILE_STORY_LOADER_V1__=true;

  const BASE="https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@dbea95322b02cc52347cb85d8aef45d74813e55a/";
  const PARTS=[
    BASE+".shoufhon-profile-story-stage-1.txt",
    BASE+".shoufhon-profile-story-stage-2.txt"
  ];

  function fail(error){
    console.error("[ShoufHon Profile Loader]",error);
    try{
      document.body.innerHTML=
        '<div style="padding:16px;font:14px Arial;color:#fff;background:#171717;border-radius:14px">'+
        'Profile temporarily unavailable. Restore the previous Profile embed.'+
        '</div>';
    }catch(_){}
  }

  Promise.all(
    PARTS.map(function(url){
      return fetch(url,{cache:"force-cache"}).then(function(response){
        if(!response.ok){
          throw new Error("PROFILE_SOURCE_HTTP_"+response.status);
        }
        return response.text();
      });
    })
  )
  .then(function(parts){
    const html=parts.join("\n");

    if(
      !html.includes('id="ma7alak-profile-shell"') ||
      !html.includes('id="ma7alak-story-wrapper"') ||
      !html.includes('id="ma7alak-follow-embed"') ||
      !html.includes("shoufhon-follow-security-bridge.js") ||
      !html.includes("shoufhon-shop-likes.js") ||
      !html.includes("shoufhon-vip-effects.js")
    ){
      throw new Error("PROFILE_SOURCE_VALIDATION_FAILED");
    }

    document.open();
    document.write(html);
    document.close();
  })
  .catch(fail);
})();
