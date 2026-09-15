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
      #ma-owner-reels-card{max-width:760px;margin:18px auto;padding:18px;border:1px solid rgba(255,183,77,.24);border-radius:22px;background:linear-gradient(145deg,#1a110d,#28170f);color:#fff;font-family:Arial,sans-serif;box-shadow:0 18px 45px rgba(0,0,0,.25)}
      #ma-owner-reels-card *{box-sizing:border-box} .ma-or-head{display:flex;gap:12px;align-items:center;margin-bottom:14px}.ma-or-head b{font-size:20px}.ma-or-head span{font-size:26px}.ma-or-sub{opacity:.72;font-size:13px;margin-top:3px}
      .ma-or-quota{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:13px 14px;border-radius:16px;background:rgba(255,255,255,.055);margin-bottom:14px}.ma-or-quota strong{color:#ffc46b}.ma-or-count{font-size:20px;font-weight:900}
      .ma-or-field{display:block;margin:12px 0}.ma-or-field span{display:block;font-size:13px;font-weight:800;margin-bottom:7px}.ma-or-field input{width:100%;padding:13px;border-radius:13px;border:1px solid rgba(255,255,255,.13);background:#100b08;color:#fff;font-size:16px;outline:none}
      .ma-or-upload,.ma-or-publish{width:100%;border:0;border-radius:15px;padding:14px;font-size:15px;font-weight:900;cursor:pointer}.ma-or-upload{display:block;text-align:center;background:#3b2518;color:#ffd59a;margin:10px 0}.ma-or-publish{background:linear-gradient(135deg,#ffb347,#d77a20);color:#211007}.ma-or-publish:disabled,.ma-or-upload.is-disabled{opacity:.45;pointer-events:none}
      .ma-owner-reel-status{min-height:20px;margin:10px 0;font-size:13px}.ma-owner-reel-status.is-error{color:#ff8c8c}.ma-owner-reel-status.is-success{color:#8ff0a4}
      .ma-or-list{display:grid;gap:10px;margin-top:14px}.ma-or-item{display:grid;grid-template-columns:88px 1fr auto;gap:10px;align-items:center;padding:10px;border-radius:15px;background:rgba(255,255,255,.05)}.ma-or-item video{width:88px;height:120px;object-fit:cover;border-radius:11px;background:#000}.ma-or-meta{min-width:0}.ma-or-meta b{display:block;overflow:hidden;text-overflow:ellipsis}.ma-or-meta small{opacity:.62}.ma-or-delete{border:1px solid rgba(255,100,100,.35);background:rgba(130,20,20,.2);color:#ffb0b0;border-radius:11px;padding:9px;cursor:pointer}
      @media(max-width:560px){#ma-owner-reels-card{margin:12px 0;padding:15px;border-radius:18px}.ma-or-item{grid-template-columns:70px 1fr}.ma-or-item video{width:70px;height:98px}.ma-or-delete{grid-column:2;width:100%}}
    `;
    document.head.appendChild(style);

    const card=document.createElement("section");
    card.id="ma-owner-reels-card";
    card.hidden=true;
    card.innerHTML=`
      <div class="ma-or-head"><span>🔥</span><div><b>Homepage Reels</b><div class="ma-or-sub" id="ma-or-shop">Checking owner account…</div></div></div>
      <div class="ma-or-quota"><div><strong>Your Reel quota</strong><div class="ma-or-sub">Active homepage Reels</div></div><div class="ma-or-count" id="ma-or-quota">0 / 0</div></div>
      <label id="ma-or-upload-label" class="ma-or-upload" for="ma-or-file">📱 Choose Reel from device</label>
      <input id="ma-or-file" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" hidden>
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
    document.getElementById("ma-or-upload-label").classList.toggle("is-disabled",blocked);
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

  async function start(){
    inject();
    try{
      await ensureSupabase();
      client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      const {data:{user}}=await client.auth.getUser();
      if(!user) return;
      document.getElementById("ma-owner-reels-card").hidden=false;
      await quota(); await list();

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
    }catch(error){
      const card=document.getElementById("ma-owner-reels-card"); if(card) card.hidden=false;
      status(error.message||"Could not load owner Reels.","error");
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
