    /* =========================================================
     MA7ALAK UPLOADER + STORY VIEWER UX HOTFIX V1
     Load AFTER story-upload-panel.js.
     - Story/Reel uploader visible text -> English
     - sharper small text
     - multiple Story images/videos in one selection
     - after deleting a Story item, keep/reopen viewer on remaining items
    ========================================================= */
    (function(){
    "use strict";
    if(window.__M7_UPLOADER_UX_V1__)return;window.__M7_UPLOADER_UX_V1__=true;
    const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
    let sb=null,batch=false;
    function client(){return sb||(sb=window.Ma7alakOwnerAuth?.client||(window.supabase?.createClient?window.supabase.createClient(URL,KEY):null))}
    function css(){
     if(document.getElementById("m7-uploader-ux-css"))return;
     const s=document.createElement("style");s.id="m7-uploader-ux-css";s.textContent=`
     #ma7alak-page-story-subtitle,#ma7alak-page-story-note,.ma7alak-owner-add-sub,.ma7alak-owner-add-choice small,.ma-or-sub,#ma7alak-page-story-status,.ma-owner-reel-status{
       -webkit-font-smoothing:antialiased!important;text-rendering:geometricPrecision!important;font-weight:600!important;letter-spacing:.01em!important
     }
     #ma7alak-page-story-subtitle{color:rgba(255,255,255,.68)!important;font-size:12px!important}
     #ma7alak-page-story-note{color:rgba(255,255,255,.52)!important;font-size:10px!important}
     .ma7alak-owner-add-sub,.ma7alak-owner-add-choice small,.ma-or-sub{color:rgba(255,255,255,.65)!important}
     `;document.head.appendChild(s);
    }
    function english(){
     const set=(sel,text)=>{const e=document.querySelector(sel);if(e&&e.textContent.trim()!==text)e.textContent=text};
     set("#ma7alak-page-story-title","Add Story");
     set("#ma7alak-page-story-subtitle","Share something new from your shop");
     set("#ma7alak-page-story-note","Stories automatically disappear after 24 hours");
     const opts=document.querySelectorAll(".ma7alak-page-story-option-title");if(opts[0])opts[0].textContent="Images";if(opts[1])opts[1].textContent="Videos";
     set(".ma7alak-owner-add-title","What do you want to add?");
     set(".ma7alak-owner-add-sub","Choose Story or Homepage Reel");
     const choices=document.querySelectorAll(".ma7alak-owner-add-choice");
     if(choices[0]){const sm=choices[0].querySelector("small");if(sm)sm.textContent="Disappears automatically after 24 hours"}
     if(choices[1]){const sm=choices[1].querySelector("small");if(sm)sm.textContent="Appears in Homepage Reels"}
     set(".ma-or-title","Add Homepage Reel");
     set(".ma-or-sub","Upload a vertical video from your device");
    }
    function inputs(){
     document.querySelectorAll('#ma7alak-page-story-modal input[type="file"]').forEach(i=>{i.multiple=true;i.setAttribute("multiple","")});
    }
    async function uploadFile(file,owner){
     const c=client();if(!c)throw new Error("Supabase not ready");
     const ext=(file.name.split(".").pop()||"bin").toLowerCase(),path=`${owner.shop_slug}/${Date.now()}-${crypto?.randomUUID?.()||Math.random().toString(36).slice(2)}.${ext}`;
     let r=await c.storage.from("stories").upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type||undefined});
     if(r.error)throw r.error;
     return c.storage.from("stories").getPublicUrl(path).data.publicUrl;
    }
    async function batchUpload(input){
     if(batch||!input.files||input.files.length<2)return false;
     const owner=window.Ma7alakOwnerAuth?.owner;if(!owner)return false;
     batch=true;const files=[...input.files],status=document.getElementById("ma7alak-page-story-status");
     try{
      for(let n=0;n<files.length;n++){
       if(status)status.textContent=`Uploading ${n+1} of ${files.length}...`;
       const f=files[n],url=await uploadFile(f,owner),kind=(f.type||"").startsWith("video/")?"video":"image";
       const c=client(),row={shop_slug:owner.shop_slug,media_url:url,media_type:kind};
       let r=await c.from("stories").insert(row);if(r.error){r=await c.from("stories").insert({shop_slug:owner.shop_slug,url,media_type:kind});if(r.error)throw r.error}
      }
      if(status)status.textContent="Stories uploaded ✓";
      dispatchEvent(new CustomEvent("ma7alak:story-uploaded",{detail:{shop_slug:owner.shop_slug,count:files.length}}));
      setTimeout(()=>{document.getElementById("ma7alak-page-story-modal")?.classList.remove("open")},650);
     }catch(e){console.warn(e);if(status)status.textContent=e.message||"Upload failed"}
     finally{batch=false;input.value=""}
     return true;
    }
    function bind(){
     document.addEventListener("change",async e=>{
      const i=e.target;if(!(i instanceof HTMLInputElement)||i.type!=="file"||!i.closest("#ma7alak-page-story-modal"))return;
      if(i.files?.length>1){e.stopImmediatePropagation();e.preventDefault();await batchUpload(i)}
     },true);
     document.addEventListener("click",e=>{
      const del=e.target.closest?.("[data-story-delete],.ma7alak-story-delete,.ma7alak-story-owner-delete");if(!del)return;
      const viewer=del.closest(".ma7alak-story-viewer,#ma7alak-story-viewer");if(!viewer)return;
      const slug=window.Ma7alakOwnerAuth?.owner?.shop_slug||"";
      setTimeout(()=>{if(document.querySelector(".ma7alak-story-viewer,#ma7alak-story-viewer"))return;dispatchEvent(new CustomEvent("ma7alak:open-story",{detail:{shop_slug:slug}}))},650);
     },true);
    }
    function boot(){css();english();inputs();bind();new MutationObserver(()=>{english();inputs()}).observe(document.body,{subtree:true,childList:true})}
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
    })();
