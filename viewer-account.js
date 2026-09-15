/* =========================================================
   MA7ALAK VIEWER ACCOUNT V1
   - Email signup/login
   - Google login
   - Profile edit
   - Logout
   - Exposes window.Ma7alakAccount
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_VIEWER_ACCOUNT_V1__) return;
window.__MA7ALAK_VIEWER_ACCOUNT_V1__ = true;

const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
let client=null, session=null, profile=null;

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
  if(r.error) console.warn("Ma7alak profile:",r.error);
  profile=r.data||null;emit();return profile;
}
function css(){
 if(document.getElementById("m7-account-css"))return;
 const st=document.createElement("style");st.id="m7-account-css";st.textContent=`
#m7-account-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:18px;font-family:Arial,sans-serif}
#m7-account-card{width:min(430px,100%);background:linear-gradient(160deg,#21150f,#0f0d0c);border:1px solid rgba(219,155,70,.35);border-radius:24px;padding:22px;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.6)}
#m7-account-card h2{margin:0 0 6px;color:#f4b85d}#m7-account-card p{color:#bdb5ad;font-size:13px}
.m7a-row{display:grid;gap:10px;margin-top:14px}.m7a-input{width:100%;box-sizing:border-box;border:1px solid #4a382c;background:#15110f;color:#fff;border-radius:13px;padding:13px;outline:none}
.m7a-btn{border:0;border-radius:13px;padding:12px 14px;font-weight:800;cursor:pointer;background:#d99a45;color:#17100b}.m7a-btn.alt{background:#fff;color:#171717}.m7a-btn.dark{background:#2c2521;color:#fff}.m7a-close{float:right;border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}
#m7a-status{min-height:18px;color:#f4b85d;font-size:12px;margin-top:8px}.m7a-tabs{display:flex;gap:8px}.m7a-tabs button{flex:1}
`;document.head.appendChild(st);
}
function close(){document.getElementById("m7-account-overlay")?.remove();}
function status(t){const x=document.getElementById("m7a-status");if(x)x.textContent=t||"";}
function open(){
 css();close();
 const logged=!!session?.user;
 const d=document.createElement("div");d.id="m7-account-overlay";
 d.innerHTML=`<div id="m7-account-card"><button class="m7a-close" id="m7a-close">×</button>
 <h2>${logged?"My Ma7alak Profile":"Ma7alak Account"}</h2>
 <p>${logged?esc(session.user.email):"Sign in to message shops and keep your account across devices."}</p>
 ${logged?`
 <div class="m7a-row">
 <input class="m7a-input" id="m7a-name" maxlength="60" placeholder="Display name" value="${esc(profile?.display_name||"")}">
 <input class="m7a-input" id="m7a-user" maxlength="30" placeholder="Username" value="${esc(profile?.username||"")}">
 <input class="m7a-input" id="m7a-avatar" placeholder="Avatar image URL" value="${esc(profile?.avatar_url||"")}">
 <textarea class="m7a-input" id="m7a-bio" maxlength="160" placeholder="Bio">${esc(profile?.bio||"")}</textarea>
 <button class="m7a-btn" id="m7a-save">Save profile</button>
 <button class="m7a-btn dark" id="m7a-logout">Log out</button></div>`:`
 <div class="m7a-row"><input class="m7a-input" id="m7a-email" type="email" placeholder="Email">
 <input class="m7a-input" id="m7a-pass" type="password" minlength="8" placeholder="Password">
 <div class="m7a-tabs"><button class="m7a-btn" id="m7a-login">Log in</button><button class="m7a-btn dark" id="m7a-signup">Create account</button></div>
 <button class="m7a-btn alt" id="m7a-google">Continue with Google</button></div>`}
 <div id="m7a-status"></div></div>`;
 document.body.appendChild(d);
 document.getElementById("m7a-close").onclick=close;
 d.onclick=e=>{if(e.target===d)close();};
 if(logged){
  document.getElementById("m7a-save").onclick=async()=>{
   status("Saving...");
   const r=await client.rpc("ma7alak_update_my_profile",{p_display_name:document.getElementById("m7a-name").value,p_username:document.getElementById("m7a-user").value,p_avatar_url:document.getElementById("m7a-avatar").value,p_bio:document.getElementById("m7a-bio").value});
   if(r.error){status(r.error.message);return;} await loadProfile();status("Saved ✓");
  };
  document.getElementById("m7a-logout").onclick=async()=>{await client.auth.signOut();close();};
 }else{
  const creds=()=>({email:document.getElementById("m7a-email").value.trim(),password:document.getElementById("m7a-pass").value});
  document.getElementById("m7a-login").onclick=async()=>{status("Logging in...");const r=await client.auth.signInWithPassword(creds());status(r.error?r.error.message:"Logged in ✓");if(!r.error)close();};
  document.getElementById("m7a-signup").onclick=async()=>{status("Creating account...");const r=await client.auth.signUp(creds());status(r.error?r.error.message:"Account created. Check your email if confirmation is enabled.");};
  document.getElementById("m7a-google").onclick=async()=>{await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname}});};
 }
}
async function init(){
 await loadSupabase();
 client=window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||window.supabase.createClient(URL,KEY);
 window.__MA7ALAK_SHARED_SUPABASE_CLIENT__=client;
 const r=await client.auth.getSession();session=r.data.session;await loadProfile();
 client.auth.onAuthStateChange(async(_event,newSession)=>{session=newSession;await loadProfile();});
}
window.Ma7alakAccount={
 open,close,
 get client(){return client;},
 get session(){return session;},
 get user(){return session?.user||null;},
 get profile(){return profile;},
 ready:()=>initPromise
};
const initPromise=init().catch(console.error);
})();
