/* =========================================================
   MA7ALAK OWNER HEADER AUTH BRIDGE V1
   Separate from Viewer Account.
   Fixes Premium Header hamburger "Login" dead /login link.
   Logged-out owner: opens owner login modal.
   Logged-in owner: menu changes to Logout.
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_OWNER_HEADER_AUTH_V1__)return;
window.__MA7ALAK_OWNER_HEADER_AUTH_V1__=true;
const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
let c=null,session=null,owner=null,timer=null;

function client(){
 if(c)return c;
 if(!window.supabase?.createClient)return null;
 c=window.supabase.createClient(URL,KEY); // default OWNER auth storage
 return c;
}
function css(){
 if(document.getElementById("m7-owner-auth-css"))return;
 const s=document.createElement("style");s.id="m7-owner-auth-css";s.textContent=`
#m7-owner-auth-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:18px;font-family:Arial,sans-serif}
#m7-owner-auth-card{width:min(410px,100%);background:linear-gradient(155deg,#21150f,#0d0c0b);border:1px solid rgba(217,164,65,.42);border-radius:22px;padding:22px;color:#fff;box-shadow:0 25px 80px rgba(0,0,0,.7)}
#m7-owner-auth-card h2{margin:0 0 5px;color:#f2bd68}#m7-owner-auth-card p{margin:0 0 16px;color:#bfb5ab;font-size:13px}
.m7oa-input{box-sizing:border-box;width:100%;margin:6px 0;padding:13px;border-radius:12px;border:1px solid #49382d;background:#15110f;color:#fff;outline:none}
.m7oa-btn{width:100%;margin-top:10px;padding:12px;border:0;border-radius:12px;background:#d99a45;color:#17100b;font-weight:900;cursor:pointer}
#m7oa-close{float:right;border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}
#m7oa-status{min-height:18px;margin-top:9px;color:#efbd70;font-size:12px}
`;document.head.appendChild(s);
}
function close(){document.getElementById("m7-owner-auth-overlay")?.remove();}
async function refresh(){
 const x=client();if(!x)return;
 const r=await x.auth.getSession();session=r.data?.session||null;owner=null;
 if(session?.user){
   const o=await x.from("shop_owners").select("shop_slug").eq("user_id",session.user.id).limit(1).maybeSingle();
   if(!o.error&&o.data?.shop_slug)owner=o.data;
 }
 syncMenu();
}
function findLoginLink(){
 return [...document.querySelectorAll("#ma7alak-header-menu-panel a.ma7alak-header-menu-link")]
   .find(a=>/shop owner access/i.test(a.textContent||"")||/\/login\/?$/.test(a.getAttribute("href")||""));
}
function syncMenu(){
 const a=findLoginLink();if(!a)return;
 const main=a.querySelector(".ma7alak-header-menu-main");
 const sub=a.querySelector(".ma7alak-header-menu-sub");
 a.href="#";
 if(main)main.textContent=owner?"Logout":"Login";
 if(sub)sub.textContent=owner?"Sign out of shop owner account":"Shop owner access";
 if(a.dataset.m7OwnerBound!=="1"){
   a.dataset.m7OwnerBound="1";
   a.addEventListener("click",async e=>{
     e.preventDefault();e.stopPropagation();
     if(owner){
       const x=client();if(x)await x.auth.signOut();
       session=null;owner=null;syncMenu();
       location.reload();return;
     }
     open();
   });
 }
}
function open(){
 css();close();
 const d=document.createElement("div");d.id="m7-owner-auth-overlay";
 d.innerHTML=`<div id="m7-owner-auth-card"><button id="m7oa-close">×</button><h2>Shop Owner Login</h2>
 <p>This login is only for Ma7alak shop owners.</p>
 <input id="m7oa-email" class="m7oa-input" type="email" autocomplete="email" placeholder="Owner email">
 <input id="m7oa-pass" class="m7oa-input" type="password" autocomplete="current-password" placeholder="Password">
 <button id="m7oa-login" class="m7oa-btn">Log in</button><div id="m7oa-status"></div></div>`;
 document.body.appendChild(d);
 d.onclick=e=>{if(e.target===d)close();};document.getElementById("m7oa-close").onclick=close;
 document.getElementById("m7oa-login").onclick=async()=>{
   const st=document.getElementById("m7oa-status"),x=client();if(!x)return;
   st.textContent="Logging in...";
   const email=document.getElementById("m7oa-email").value.trim(),password=document.getElementById("m7oa-pass").value;
   const r=await x.auth.signInWithPassword({email,password});
   if(r.error){st.textContent=r.error.message;return;}
   const o=await x.from("shop_owners").select("shop_slug").eq("user_id",r.data.user.id).limit(1).maybeSingle();
   if(o.error||!o.data?.shop_slug){await x.auth.signOut();st.textContent="This account is not a shop-owner account.";return;}
   owner=o.data;session=r.data.session;st.textContent="Logged in ✓";
   setTimeout(()=>{close();location.reload();},300);
 };
}
async function boot(){
 let tries=0;while(!window.supabase?.createClient&&tries++<100)await new Promise(r=>setTimeout(r,100));
 await refresh();
 timer=setInterval(()=>{syncMenu();},500);
 setTimeout(()=>{if(timer){clearInterval(timer);timer=null;}},15000);
 const x=client();x?.auth.onAuthStateChange(()=>setTimeout(refresh,0));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
