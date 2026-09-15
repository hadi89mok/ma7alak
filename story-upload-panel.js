/* =========================================================
   MA7ALAK — OWNER + MENU (STORY OR HOMEPAGE REEL)
   Companion for story-upload-panel.js baseline:
   b2126297f74e3d3a1b35224e5cc59b4e71d55a88

   IMPORTANT:
   - Does NOT replace or rewrite the working Story uploader.
   - Intercepts the existing owner + request.
   - Story continues into the existing b212 Story uploader.
   - Reel opens the Owner Homepage Reel uploader below.
   ========================================================= */
(function(){
  "use strict";
  if(window.__MA7ALAK_OWNER_ADD_CHOOSER__) return;
  window.__MA7ALAK_OWNER_ADD_CHOOSER__=true;

  let activeSlug="";
  let originalSource=null;
  let storyPassThrough=false;

  function injectChooser(){
    if(document.getElementById("ma7alak-owner-add-chooser")) return;
    const style=document.createElement("style");
    style.textContent=`
      #ma7alak-owner-add-chooser{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none!important;align-items:center!important;justify-content:center!important;padding:18px!important;background:rgba(3,4,5,.90)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;font-family:Arial,"Segoe UI",sans-serif!important}
      #ma7alak-owner-add-chooser.active{display:flex!important}
      #ma7alak-owner-add-panel{position:relative!important;width:min(430px,100%)!important;padding:27px 18px 19px!important;box-sizing:border-box!important;border:1px solid rgba(217,164,65,.28)!important;border-radius:26px!important;background:linear-gradient(180deg,#191613,#0d0d0e)!important;box-shadow:0 28px 90px rgba(0,0,0,.7)!important;color:#fff!important;text-align:center!important}
      #ma7alak-owner-add-close{position:absolute!important;right:12px!important;top:11px!important;width:37px!important;height:37px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:50%!important;background:rgba(255,255,255,.06)!important;color:#fff!important;font-size:24px!important;line-height:32px!important;padding:0!important}
      .ma7alak-owner-add-title{font-size:22px!important;font-weight:900!important;margin:3px 38px 4px!important}.ma7alak-owner-add-sub{font-size:12px!important;color:rgba(255,255,255,.5)!important;margin:0 0 18px!important}
      .ma7alak-owner-add-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:11px!important}
      .ma7alak-owner-add-choice{min-height:137px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:20px!important;background:rgba(255,255,255,.045)!important;color:#fff!important;padding:17px 10px!important;font:inherit!important;font-weight:900!important;cursor:pointer!important;-webkit-tap-highlight-color:transparent!important}
      .ma7alak-owner-add-choice:active{transform:scale(.97)!important}.ma7alak-owner-add-icon{display:block!important;font-size:32px!important;margin-bottom:9px!important}.ma7alak-owner-add-choice small{display:block!important;margin-top:7px!important;color:rgba(255,255,255,.45)!important;font-size:10px!important;font-weight:600!important;line-height:1.4!important}
      @media(max-width:380px){.ma7alak-owner-add-grid{grid-template-columns:1fr!important}.ma7alak-owner-add-choice{min-height:105px!important}}
    `;
    document.head.appendChild(style);

    const overlay=document.createElement("div");
    overlay.id="ma7alak-owner-add-chooser";
    overlay.innerHTML=`<div id="ma7alak-owner-add-panel">
      <button id="ma7alak-owner-add-close" type="button" aria-label="Close">×</button>
      <div class="ma7alak-owner-add-title">شو بدك تضيف؟</div>
      <div class="ma7alak-owner-add-sub">اختار Story أو Homepage Reel</div>
      <div class="ma7alak-owner-add-grid">
        <button id="ma7alak-owner-add-story" class="ma7alak-owner-add-choice" type="button"><span class="ma7alak-owner-add-icon">📸</span>Add Story<small>بتختفي تلقائياً بعد 24 ساعة</small></button>
        <button id="ma7alak-owner-add-reel" class="ma7alak-owner-add-choice" type="button"><span class="ma7alak-owner-add-icon">🔥</span>Add Homepage Reel<small>بتظهر بقسم Reels على الصفحة الرئيسية</small></button>
      </div>
    </div>`;
    document.body.appendChild(overlay);

    const close=()=>overlay.classList.remove("active");
    document.getElementById("ma7alak-owner-add-close").addEventListener("click",close);
    overlay.addEventListener("click",e=>{if(e.target===overlay) close();});

    document.getElementById("ma7alak-owner-add-story").addEventListener("click",function(){
      close();

      /*
         ADD STORY FIX:
         Allow exactly one normal Story uploader request to pass through
         the chooser's capture listener into the untouched b212 uploader.
      */
      storyPassThrough=true;

      window.postMessage(
        {
          type:"MA7ALAK_OPEN_STORY_UPLOADER",
          shopSlug:activeSlug
        },
        "*"
      );

      setTimeout(function(){
        storyPassThrough=false;
      },1000);
    });

    document.getElementById("ma7alak-owner-add-reel").addEventListener("click",function(){
      close();
      if(window.Ma7alakOwnerReels && typeof window.Ma7alakOwnerReels.open==="function"){
        window.Ma7alakOwnerReels.open(activeSlug).catch(function(error){console.error("MA7ALAK Reel uploader:",error);});
      }else{
        window.postMessage({type:"MA7ALAK_OPEN_REEL_UPLOADER",shopSlug:activeSlug},"*");
      }
    });
  }

  function showChooser(slug,source){
    activeSlug=String(slug||"").trim();
    originalSource=source||null;
    if(!activeSlug) return;
    injectChooser();
    document.getElementById("ma7alak-owner-add-chooser").classList.add("active");
  }

  // Capture phase is intentional: it prevents the original b212 uploader
  // from opening immediately, so the owner sees the choice first.
  window.addEventListener("message",function(event){
    if(!event.data || event.data.type!=="MA7ALAK_OPEN_STORY_UPLOADER") return;

    /*
       Let ONE request pass to the original Story uploader.
       This fixes Add Story doing nothing while keeping the Reel chooser.
    */
    if(storyPassThrough){
      storyPassThrough=false;
      return;
    }

    const slug=String(event.data.shopSlug||"").trim();
    if(!slug) return;

    event.stopImmediatePropagation();
    showChooser(slug,event.source);
  },true);

  document.addEventListener("keydown",function(event){
    if(event.key!=="Escape") return;
    const el=document.getElementById("ma7alak-owner-add-chooser");
    if(el) el.classList.remove("active");
  });
})();

/* =========================================================
   MA7ALAK — OWNER HOMEPAGE REEL UPLOADER
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
    const {error}=await client.storage.from(STORAGE_BUCKET).upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type||undefined});
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
    if(!window.confirm("Delete this homepage Reel?")) return;
    button.disabled=true;
    try{
      const {data,error}=await client.rpc("delete_my_reel",{p_reel_id:id});
      if(error) throw error;
      const path=storagePathFromUrl(data);
      if(path && path.indexOf("reels/"+ownerInfo.shop_slug+"/")===0) await cleanup(path);
      await quota(); await list();
      status("Reel deleted. One quota slot is free again.","success");
    }catch(error){ status(error.message||"Could not delete Reel.","error"); button.disabled=false; }
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
    if(!client) throw new Error("Reel uploader is still loading. Try again.");
    const {data:{user}}=await client.auth.getUser();
    if(!user) throw new Error("You must be signed in.");
    await quota();
    if(requestedSlug && ownerInfo && String(ownerInfo.shop_slug)!==String(requestedSlug)){
      throw new Error("This owner account is not linked to this shop.");
    }
    await list();
    lockPageScroll();
    document.getElementById("ma-owner-reels-backdrop").hidden=false;
    document.getElementById("ma-owner-reels-card").hidden=false;
  }

  async function start(){
    inject();
    try{
      await ensureSupabase();
      client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      const {data:{user}}=await client.auth.getUser();
      if(user){ await quota(); await list(); }

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

      window.Ma7alakOwnerReels={open:openPanel,close:closePanel};
      window.addEventListener("message",function(event){
        if(!event.data || event.data.type!=="MA7ALAK_OPEN_REEL_UPLOADER") return;
        openPanel(String(event.data.shopSlug||"").trim()).catch(function(error){
          lockPageScroll();
          document.getElementById("ma-owner-reels-backdrop").hidden=false;
          document.getElementById("ma-owner-reels-card").hidden=false;
          status(error.message||"Could not open Reel uploader.","error");
        });
      });
    }catch(error){
      console.error("MA7ALAK owner Reel uploader:",error);
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
