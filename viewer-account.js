/* =========================================================
 MA7ALAK VIEWER ACCOUNT V9 — ONE ACCOUNT SYSTEM
 - One Google/Ma7alak account for viewers and shop owners
 - Personal viewer profile remains preserved underneath ownership
 - V9: enforce one normal-user identity circle in the header
 - V9: move mobile Ma7alak logo left with a safe edge gap
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_VIEWER_ACCOUNT_V9__)return;window.__MA7ALAK_VIEWER_ACCOUNT_V9__=true;
const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl",STORAGE_KEY="ma7alak-viewer-auth-v1",BUCKET="viewer-avatars";let client=null,session=null,profile=null,initPromise=null,ownerState=false;
const esc=v=>String(v||"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[m]));
function loadSB(){if(window.supabase?.createClient)return Promise.resolve();return new Promise((a,b)=>{let s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=a;s.onerror=b;document.head.appendChild(s)})}
function emit(){dispatchEvent(new CustomEvent("ma7alak:account-change",{detail:{session,user:session?.user||null,profile}}))}
async function loadProfile(){if(!session?.user){profile=null;emit();syncHeaderFix();return}let r=await client.from("viewer_profiles").select("*").eq("user_id",session.user.id).maybeSingle();profile=r.data||null;if(profile?.account_status==="banned"){alert("This Ma7alak account is banned."+(profile.banned_reason?"\nReason: "+profile.banned_reason:""));await logout();return}if(profile?.account_status==="deleted"){alert("This Ma7alak account has been disabled.");await logout();return}emit();syncHeaderFix()}
function css(){if(document.getElementById("m7a-v9-css"))return;let s=document.createElement("style");s.id="m7a-v9-css";s.textContent=`#m7-account-overlay{position:fixed;inset:0;background:#000c;z-index:2147483600;display:grid;place-items:center;padding:18px;font-family:Arial}#m7-account-card{width:min(430px,100%);max-height:92vh;overflow:auto;background:linear-gradient(160deg,#21150f,#0f0d0c);border:1px solid #d99a4566;border-radius:24px;padding:22px;color:#fff;box-shadow:0 24px 70px #000a}#m7-account-card h2{margin:0;color:#f4b85d}.m7a-close{float:right;border:0;background:none;color:#fff;font-size:25px}.m7a-row{display:grid;gap:10px;margin-top:15px}.m7a-btn{border:0;border-radius:14px;padding:13px;font-weight:900;cursor:pointer;background:#d99a45}.m7a-btn.google{background:#fff;color:#171717}.m7a-btn.dark{background:#2d2723;color:#fff}.m7a-input{width:100%;box-sizing:border-box;background:#15110f;color:#fff;border:1px solid #4a382c;border-radius:13px;padding:12px}#m7a-avatar{width:104px;height:104px;border-radius:50%;overflow:hidden;border:2px solid #d99a45;margin:15px auto;display:grid;place-items:center;background:#1b1613;cursor:pointer}#m7a-avatar img{width:100%;height:100%;object-fit:cover}#m7a-status{font-size:12px;color:#f4b85d;margin-top:10px}.m7a-coming{margin-top:18px;padding:14px;border:1px solid #d99a4538;border-radius:15px;background:#ffffff08;text-align:center}.m7a-coming strong{display:block;color:#f4b85d;font-size:12px;letter-spacing:.4px}.m7a-coming span{display:block;margin-top:5px;color:#ffffff8f;font-size:10px;line-height:1.4}`;document.head.appendChild(s)}
function syncHeaderFix(){
  const likes=document.getElementById("ma7alak-header-likes-slot");
  if(likes){
    if(session?.user&&!ownerState)likes.style.setProperty("display","none","important");
    else likes.style.removeProperty("display");
  }
  const brand=document.querySelector("#ma7alak-social-header .ma7alak-header-brand");
  if(brand&&window.matchMedia("(max-width:900px)").matches){
    brand.style.setProperty("margin-left","-10px","important");
    brand.style.setProperty("padding-left","4px","important");
  }
}
function startHeaderFixWatcher(){
  syncHeaderFix();
  let queued=false;
  const mo=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncHeaderFix()})});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener("resize",syncHeaderFix,{passive:true});
  addEventListener("ma7alak:owner-auth-change",e=>{ownerState=!!e.detail?.owner;syncHeaderFix()});
}
function close(){document.getElementById("m7-account-overlay")?.remove()}
function status(t){let x=document.getElementById("m7a-status");if(x)x.textContent=t||""}
async function logout(){try{await client?.auth.signOut({scope:"local"})}catch(_){}session=null;profile=null;ownerState=false;emit();syncHeaderFix();close()}
async function saveProfile(name,avatarUrl){return client.rpc("ma7alak_update_my_profile",{p_display_name:name,p_username:profile?.username||null,p_avatar_url:avatarUrl||null,p_bio:profile?.bio||null})}
async function upload(file){if(!file||!session?.user)return;if(!file.type.startsWith("image/")||file.size>5*1024*1024){status("Choose an image under 5 MB.");return}let ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,""),path=`${session.user.id}/avatar-${Date.now()}.${ext}`;let u=await client.storage.from(BUCKET).upload(path,file,{contentType:file.type});if(u.error){status(u.error.message);return}let url=client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,name=document.getElementById("m7a-name")?.value.trim()||profile?.display_name||session.user.user_metadata?.full_name||"Ma7alak User";let r=await saveProfile(name,url);if(r.error){status(r.error.message);return}await loadProfile();open()}
async function open(){window.dispatchEvent(new CustomEvent("ma7alak:panel-open",{detail:{panel:"account"}}));css();close();let logged=!!session?.user,d=document.createElement("div");d.id="m7-account-overlay";if(!logged)d.innerHTML=`<div id="m7-account-card"><button class="m7a-close">×</button><h2>Ma7alak Account</h2><p>Follow shops, receive updates and message businesses.</p><div class="m7a-row"><button id="m7a-google" class="m7a-btn google">G&nbsp;&nbsp; Continue with Google</button></div><div class="m7a-coming"><strong>NEW FEATURES COMING SOON</strong><span>More ways to discover, connect and interact with local shops are on the way.</span></div><div id="m7a-status"></div></div>`;else{let av=profile?.avatar_url||session.user.user_metadata?.avatar_url||"",name=profile?.display_name||session.user.user_metadata?.full_name||"";d.innerHTML=`<div id="m7-account-card"><button class="m7a-close">×</button><h2>My Ma7alak Profile</h2><p>${esc(session.user.email)}</p><div id="m7a-avatar">${av?`<img src="${esc(av)}">`:"＋ Photo"}</div><input id="m7a-file" type="file" accept="image/*" hidden><div class="m7a-row"><input class="m7a-input" id="m7a-name" placeholder="Display name" value="${esc(name)}"><button id="m7a-save" class="m7a-btn">Save profile</button><button id="m7a-logout" class="m7a-btn dark">Log out</button></div><div class="m7a-coming"><strong>NEW FEATURES COMING SOON</strong><span>More ways to discover, connect and interact with local shops are on the way.</span></div><div id="m7a-status"></div></div>`}document.body.appendChild(d);d.querySelector(".m7a-close").onclick=close;d.onclick=e=>{if(e.target===d)close()};if(!logged){document.getElementById("m7a-google").onclick=async()=>{status("Opening Google...");let r=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:"select_account"}}});if(r.error)status(r.error.message)}}else{let f=document.getElementById("m7a-file");document.getElementById("m7a-avatar").onclick=()=>f.click();f.onchange=()=>upload(f.files?.[0]);document.getElementById("m7a-save").onclick=async()=>{let name=document.getElementById("m7a-name").value.trim();if(!name){status("Display name required.");return}let r=await saveProfile(name,profile?.avatar_url||session.user.user_metadata?.avatar_url||null);if(r.error){status(r.error.message);return}await loadProfile();close()};document.getElementById("m7a-logout").onclick=logout}}
async function init(){await loadSB();client=window.supabase.createClient(URL,KEY,{auth:{storage:localStorage,storageKey:STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});let r=await client.auth.getSession();session=r.data.session;startHeaderFixWatcher();await loadProfile();client.auth.onAuthStateChange((_e,s)=>{session=s;setTimeout(()=>loadProfile(),0)})}
window.Ma7alakAccount={open,close,logout,get client(){return client},get session(){return session},get user(){return session?.user||null},get profile(){return profile},ready:()=>initPromise};initPromise=init().catch(console.error);
})();