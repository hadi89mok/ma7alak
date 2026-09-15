/* =========================================================
   MA7ALAK VIEWER ACCOUNT V2 — ISOLATED VIEWER AUTH
   - Separate browser auth storage from existing shop-owner login
   - Email signup/login + Google
   - Device profile-photo picker + Supabase Storage upload
   - Circular avatar preview
   - Profile edit + logout
   - Exposes window.Ma7alakAccount
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_VIEWER_ACCOUNT_V2__) return;
window.__MA7ALAK_VIEWER_ACCOUNT_V2__ = true;

const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const STORAGE_KEY="ma7alak-viewer-auth-v1";
const AVATAR_BUCKET="viewer-avatars";

let client=null, session=null, profile=null, initPromise=null;

function loadSupabase(){
  if(window.supabase && window.supabase.createClient) return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  });
}
function esc(v){return String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function emit(){window.dispatchEvent(new CustomEvent("ma7alak:account-change",{detail:{session,user:session?.user||null,profile}}));}
async function loadProfile(){
  if(!session?.user){profile=null;emit();return null;}
  const r=await client.from("viewer_profiles").select("*").eq("user_id",session.user.id).maybeSingle();
  if(r.error) console.warn("Ma7alak viewer profile:",r.error);
  profile=r.data||null;emit();return profile;
}
function css(){
 if(document.getElementById("m7-account-css"))return;
 const st=document.createElement("style");st.id="m7-account-css";st.textContent=`
#m7-account-overlay{position:fixed;inset:0;background:rgba(0,0,0,.76);z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:18px;font-family:Arial,sans-serif}
#m7-account-card{width:min(430px,100%);max-height:92vh;overflow:auto;box-sizing:border-box;background:linear-gradient(160deg,#21150f,#0f0d0c);border:1px solid rgba(219,155,70,.38);border-radius:24px;padding:22px;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.65)}
#m7-account-card h2{margin:0 0 6px;color:#f4b85d}#m7-account-card p{color:#bdb5ad;font-size:13px}
.m7a-row{display:grid;gap:10px;margin-top:14px}.m7a-input{width:100%;box-sizing:border-box;border:1px solid #4a382c;background:#15110f;color:#fff;border-radius:13px;padding:13px;outline:none}
.m7a-btn{border:0;border-radius:13px;padding:12px 14px;font-weight:800;cursor:pointer;background:#d99a45;color:#17100b}.m7a-btn.alt{background:#fff;color:#171717}.m7a-btn.dark{background:#2c2521;color:#fff}.m7a-close{float:right;border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}
#m7a-status{min-height:18px;color:#f4b85d;font-size:12px;margin-top:8px}.m7a-tabs{display:flex;gap:8px}.m7a-tabs button{flex:1}
#m7a-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:9px;margin:14px 0 5px}
#m7a-avatar-circle{width:108px;height:108px;border-radius:50%;border:2px solid #d99a45;background:#1a1512;display:grid;place-items:center;overflow:hidden;cursor:pointer;position:relative;box-shadow:0 0 0 5px rgba(217,154,69,.08)}
#m7a-avatar-circle img{width:100%;height:100%;object-fit:cover;display:block}
#m7a-avatar-empty{text-align:center;color:#f4b85d;font-weight:900;font-size:12px;line-height:1.25}
#m7a-avatar-empty b{display:block;font-size:27px;margin-bottom:3px}
#m7a-avatar-change{font-size:12px;color:#c9b9a9;cursor:pointer}
`;document.head.appendChild(st);
}
function close(){document.getElementById("m7-account-overlay")?.remove();}
function status(t){const x=document.getElementById("m7a-status");if(x)x.textContent=t||"";}
function avatarMarkup(){
 const url=profile?.avatar_url||"";
 return url?`<img id="m7a-avatar-img" src="${esc(url)}" alt="Profile picture">`:`<div id="m7a-avatar-empty"><b>＋</b>Add profile<br>picture</div>`;
}
async function uploadAvatar(file){
 if(!file||!session?.user)return;
 if(!/^image\//.test(file.type)){status("Please choose an image.");return;}
 if(file.size>5*1024*1024){status("Image must be under 5 MB.");return;}
 status("Uploading photo...");
 const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
 const path=`${session.user.id}/avatar-${Date.now()}.${ext}`;
 const up=await client.storage.from(AVATAR_BUCKET).upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type});
 if(up.error){status(up.error.message);return;}
 const pub=client.storage.from(AVATAR_BUCKET).getPublicUrl(path);
 const avatarUrl=pub.data?.publicUrl||"";
 if(!avatarUrl){status("Could not create photo URL.");return;}
 const r=await client.rpc("ma7alak_update_my_profile",{
   p_display_name:document.getElementById("m7a-name")?.value||profile?.display_name||"",
   p_username:document.getElementById("m7a-user")?.value||profile?.username||null,
   p_avatar_url:avatarUrl,
   p_bio:document.getElementById("m7a-bio")?.value||profile?.bio||null
 });
 if(r.error){status(r.error.message);return;}
 await loadProfile();
 const circle=document.getElementById("m7a-avatar-circle");
 if(circle)circle.innerHTML=avatarMarkup();
 status("Profile picture updated ✓");
}
function open(){
 css();close();
 const logged=!!session?.user;
 const d=document.createElement("div");d.id="m7-account-overlay";
 d.innerHTML=`<div id="m7-account-card"><button class="m7a-close" id="m7a-close">×</button>
 <h2>${logged?"My Ma7alak Profile":"Ma7alak Account"}</h2>
 <p>${logged?esc(session.user.email):"Personal visitor account for following and messaging shops."}</p>
 ${logged?`
 <div id="m7a-avatar-wrap">
   <div id="m7a-avatar-circle">${avatarMarkup()}</div>
   <div id="m7a-avatar-change">Tap to choose a photo from your device</div>
   <input id="m7a-avatar-file" type="file" accept="image/*" hidden>
 </div>
 <div class="m7a-row">
 <input class="m7a-input" id="m7a-name" maxlength="60" placeholder="Display name" value="${esc(profile?.display_name||"")}">
 <input class="m7a-input" id="m7a-user" maxlength="30" placeholder="Username" value="${esc(profile?.username||"")}">
 <textarea class="m7a-input" id="m7a-bio" maxlength="160" placeholder="Bio">${esc(profile?.bio||"")}</textarea>
 <button class="m7a-btn" id="m7a-save">Save profile</button>
 <button class="m7a-btn dark" id="m7a-logout">Log out</button></div>`:`
 <div class="m7a-row"><input class="m7a-input" id="m7a-email" type="email" autocomplete="email" placeholder="Email">
 <input class="m7a-input" id="m7a-pass" type="password" autocomplete="current-password" minlength="8" placeholder="Password">
 <div class="m7a-tabs"><button class="m7a-btn" id="m7a-login">Log in</button><button class="m7a-btn dark" id="m7a-signup">Create account</button></div>
 <button class="m7a-btn alt" id="m7a-google">Continue with Google</button></div>`}
 <div id="m7a-status"></div></div>`;
 document.body.appendChild(d);
 document.getElementById("m7a-close").onclick=close;
 d.onclick=e=>{if(e.target===d)close();};
 if(logged){
  const picker=document.getElementById("m7a-avatar-file");
  document.getElementById("m7a-avatar-circle").onclick=()=>picker.click();
  document.getElementById("m7a-avatar-change").onclick=()=>picker.click();
  picker.onchange=()=>uploadAvatar(picker.files?.[0]);
  document.getElementById("m7a-save").onclick=async()=>{
   status("Saving...");
   const r=await client.rpc("ma7alak_update_my_profile",{
     p_display_name:document.getElementById("m7a-name").value,
     p_username:document.getElementById("m7a-user").value||null,
     p_avatar_url:profile?.avatar_url||null,
     p_bio:document.getElementById("m7a-bio").value||null
   });
   if(r.error){status(r.error.message);return;}
   await loadProfile();status("Saved ✓");
  };
  document.getElementById("m7a-logout").onclick=async()=>{await client.auth.signOut();close();};
 }else{
  const creds=()=>({email:document.getElementById("m7a-email").value.trim(),password:document.getElementById("m7a-pass").value});
  document.getElementById("m7a-login").onclick=async()=>{status("Logging in...");const r=await client.auth.signInWithPassword(creds());status(r.error?r.error.message:"Logged in ✓");if(!r.error)close();};
  document.getElementById("m7a-signup").onclick=async()=>{status("Creating account...");const r=await client.auth.signUp(creds());status(r.error?r.error.message:"Account created. Check your email if confirmation is enabled.");};
  document.getElementById("m7a-google").onclick=async()=>{
    const r=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname}});
    if(r.error)status(r.error.message);
  };
 }
}
async function init(){
 await loadSupabase();

 /* IMPORTANT:
    This is deliberately NOT window.__MA7ALAK_SHARED_SUPABASE_CLIENT__.
    The owner system keeps its own normal Supabase auth session.
    Viewer accounts use their own storage key/client.
 */
 client=window.supabase.createClient(URL,KEY,{
   auth:{
     storage:window.localStorage,
     storageKey:STORAGE_KEY,
     persistSession:true,
     autoRefreshToken:true,
     detectSessionInUrl:true
   }
 });

 const r=await client.auth.getSession();
 session=r.data.session;
 await loadProfile();

 client.auth.onAuthStateChange((_event,newSession)=>{
   session=newSession;
   setTimeout(()=>loadProfile().catch(console.error),0);
 });
}
window.Ma7alakAccount={
 open,close,
 get client(){return client;},
 get session(){return session;},
 get user(){return session?.user||null;},
 get profile(){return profile;},
 ready:()=>initPromise
};
initPromise=init().catch(console.error);
})();
