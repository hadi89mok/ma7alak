/* =========================================================
 MA7ALAK VIEWER ACCOUNT V5 — GOOGLE ONLY + MODERATION
 Full replacement for viewer-account.js
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_VIEWER_ACCOUNT_V5__)return;
window.__MA7ALAK_VIEWER_ACCOUNT_V5__=true;
const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const STORAGE_KEY="ma7alak-viewer-auth-v1", BUCKET="viewer-avatars";
let client=null,session=null,profile=null,initPromise=null;
const esc=v=>String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function loadSB(){if(window.supabase?.createClient)return Promise.resolve();return new Promise((a,b)=>{let s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=a;s.onerror=b;document.head.appendChild(s)})}
function emit(){dispatchEvent(new CustomEvent("ma7alak:account-change",{detail:{session,user:session?.user||null,profile}}))}
async function ownerActive(){try{await window.Ma7alakOwnerAuth?.ready?.();return !!window.Ma7alakOwnerAuth?.owner}catch(_){return false}}
async function isOwner(){if(!session?.user)return false;try{let r=await client.rpc("ma7alak_is_current_user_shop_owner");return !r.error&&r.data===true}catch(_){return false}}
async function loadProfile(){
 if(!session?.user){profile=null;emit();return}
 if(await isOwner()){await logout();return}
 let r=await client.from("viewer_profiles").select("*").eq("user_id",session.user.id).maybeSingle();
 profile=r.data||null;
 if(profile?.account_status==="banned"){alert("This Ma7alak account is banned."+ (profile.banned_reason?"\nReason: "+profile.banned_reason:""));await logout();return}
 if(profile?.account_status==="deleted"){alert("This Ma7alak account has been disabled.");await logout();return}
 emit();
}
function css(){if(document.getElementById("m7a-v5-css"))return;let s=document.createElement("style");s.id="m7a-v5-css";s.textContent=`
#m7-account-overlay{position:fixed;inset:0;background:#000c;z-index:2147483600;display:grid;place-items:center;padding:18px;font-family:Arial}
#m7-account-card{width:min(430px,100%);max-height:92vh;overflow:auto;background:linear-gradient(160deg,#21150f,#0f0d0c);border:1px solid #d99a4566;border-radius:24px;padding:22px;color:#fff;box-shadow:0 24px 70px #000a}
#m7-account-card h2{margin:0;color:#f4b85d}.m7a-close{float:right;border:0;background:none;color:#fff;font-size:25px}.m7a-row{display:grid;gap:10px;margin-top:15px}.m7a-btn{border:0;border-radius:14px;padding:13px;font-weight:900;cursor:pointer;background:#d99a45}.m7a-btn.google{background:#fff;color:#171717}.m7a-btn.dark{background:#2d2723;color:#fff}.m7a-input{width:100%;box-sizing:border-box;background:#15110f;color:#fff;border:1px solid #4a382c;border-radius:13px;padding:12px}
#m7a-avatar{width:104px;height:104px;border-radius:50%;overflow:hidden;border:2px solid #d99a45;margin:15px auto;display:grid;place-items:center;background:#1b1613;cursor:pointer}#m7a-avatar img{width:100%;height:100%;object-fit:cover}#m7a-status{font-size:12px;color:#f4b85d;margin-top:10px}`;document.head.appendChild(s)}
function close(){document.getElementById("m7-account-overlay")?.remove()}
function status(t){let x=document.getElementById("m7a-status");if(x)x.textContent=t||""}
async function logout(){try{await client?.auth.signOut({scope:"local"})}catch(_){}session=null;profile=null;emit();close()}
async function upload(file){
 if(!file||!session?.user)return;if(!file.type.startsWith("image/")||file.size>5*1024*1024){status("Choose an image under 5 MB.");return}
 let ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,""),path=`${session.user.id}/avatar-${Date.now()}.${ext}`;
 let u=await client.storage.from(BUCKET).upload(path,file,{contentType:file.type});if(u.error){status(u.error.message);return}
 let url=client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
 let r=await client.rpc("ma7alak_update_my_profile",{p_display_name:document.getElementById("m7a-name").value||profile?.display_name||session.user.user_metadata?.full_name||"Ma7alak User",p_username:document.getElementById("m7a-user").value||null,p_avatar_url:url,p_bio:document.getElementById("m7a-bio").value||null});
 if(r.error){status(r.error.message);return}await loadProfile();open()
}
async function open(){
 css();close();
 if(await ownerActive()){alert("You are logged in as a Shop Owner. Log out first.");return}
 let logged=!!session?.user,d=document.createElement("div");d.id="m7-account-overlay";
 if(!logged)d.innerHTML=`<div id="m7-account-card"><button class="m7a-close">×</button><h2>Ma7alak Account</h2><p>Follow shops, receive updates and message businesses.</p><div class="m7a-row"><button id="m7a-google" class="m7a-btn google">G&nbsp;&nbsp; Continue with Google</button></div><div id="m7a-status"></div></div>`;
 else{let av=profile?.avatar_url||session.user.user_metadata?.avatar_url||"",name=profile?.display_name||session.user.user_metadata?.full_name||"";d.innerHTML=`<div id="m7-account-card"><button class="m7a-close">×</button><h2>My Ma7alak Profile</h2><p>${esc(session.user.email)}</p><div id="m7a-avatar">${av?`<img src="${esc(av)}">`:"＋ Photo"}</div><input id="m7a-file" type="file" accept="image/*" hidden><div class="m7a-row"><input class="m7a-input" id="m7a-name" placeholder="Display name" value="${esc(name)}"><input class="m7a-input" id="m7a-user" placeholder="Username" value="${esc(profile?.username||"")}"><textarea class="m7a-input" id="m7a-bio" placeholder="Bio">${esc(profile?.bio||"")}</textarea><button id="m7a-save" class="m7a-btn">Save profile</button><button id="m7a-logout" class="m7a-btn dark">Log out</button></div><div id="m7a-status"></div></div>`}
 document.body.appendChild(d);d.querySelector(".m7a-close").onclick=close;d.onclick=e=>{if(e.target===d)close()};
 if(!logged){document.getElementById("m7a-google").onclick=async()=>{status("Opening Google...");let r=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:"select_account"}}});if(r.error)status(r.error.message)}}
 else{
  let f=document.getElementById("m7a-file");document.getElementById("m7a-avatar").onclick=()=>f.click();f.onchange=()=>upload(f.files?.[0]);
  document.getElementById("m7a-save").onclick=async()=>{let name=document.getElementById("m7a-name").value.trim();if(!name){status("Display name required.");return}let r=await client.rpc("ma7alak_update_my_profile",{p_display_name:name,p_username:document.getElementById("m7a-user").value||null,p_avatar_url:profile?.avatar_url||session.user.user_metadata?.avatar_url||null,p_bio:document.getElementById("m7a-bio").value||null});if(r.error)status(r.error.message);else{await loadProfile();status("Saved ✓")}};
  document.getElementById("m7a-logout").onclick=logout;
 }
}
async function init(){await loadSB();client=window.supabase.createClient(URL,KEY,{auth:{storage:localStorage,storageKey:STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});let r=await client.auth.getSession();session=r.data.session;await loadProfile();client.auth.onAuthStateChange((_e,s)=>{session=s;setTimeout(()=>loadProfile(),0)});addEventListener("ma7alak:owner-auth-change",e=>{if(e.detail?.owner&&session)logout()})}
window.Ma7alakAccount={open,close,logout,get client(){return client},get session(){return session},get user(){return session?.user||null},get profile(){return profile},ready:()=>initPromise};
initPromise=init().catch(console.error);
})();
