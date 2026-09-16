/* =========================================================
   MA7ALAK HEADER LOGOUT — SAFE MENU INTEGRATION
   - Adds Logout inside the existing 3-line Premium Header menu
   - Visible only while a Ma7alak account session exists
   - Works for Google viewers and assigned shop owners
   - Uses existing Ma7alakAccount.logout()
   - No persistent MutationObserver / no login freeze loop
========================================================= */
(function(){
  "use strict";

  if(window.self !== window.top) return;
  if(window.__MA7ALAK_HEADER_LOGOUT_LOADED__) return;
  window.__MA7ALAK_HEADER_LOGOUT_LOADED__ = true;

  const BTN_ID = "ma7alak-header-menu-logout";
  const STYLE_ID = "ma7alak-header-menu-logout-style";

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement("style");
    s.id=STYLE_ID;
    s.textContent=`
#${BTN_ID}{
  width:100%;
  min-height:46px;
  display:none;
  align-items:center;
  gap:11px;
  padding:0 14px;
  margin:6px 0 0;
  border:1px solid rgba(255,92,92,.16);
  border-radius:13px;
  background:rgba(255,72,72,.055);
  color:#ffb2b2;
  font:800 12px/1 Arial,"Segoe UI",sans-serif;
  text-align:left;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  transition:background .16s ease,border-color .16s ease,transform .12s ease;
}
#${BTN_ID}.visible{display:flex;}
#${BTN_ID}:hover{background:rgba(255,72,72,.10);border-color:rgba(255,92,92,.28);}
#${BTN_ID}:active{transform:scale(.98);}
#${BTN_ID} .m7logout-icon{width:25px;height:25px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:rgba(255,255,255,.045);font-size:16px;}
#${BTN_ID} .m7logout-copy{min-width:0;display:flex;flex-direction:column;gap:3px;}
#${BTN_ID} .m7logout-title{color:#fff;font-size:12px;font-weight:850;}
#${BTN_ID} .m7logout-sub{color:rgba(255,255,255,.42);font-size:9px;font-weight:650;}
`;
    document.head.appendChild(s);
  }

  function account(){
    return window.Ma7alakAccount || null;
  }

  function isLoggedIn(){
    const a=account();
    return !!(a && (a.user || a.session?.user));
  }

  function ensureButton(){
    const panel=document.getElementById("ma7alak-header-menu-panel");
    if(!panel) return null;

    let btn=document.getElementById(BTN_ID);
    if(btn) return btn;

    btn=document.createElement("button");
    btn.id=BTN_ID;
    btn.type="button";
    btn.setAttribute("aria-label","Log out");
    btn.innerHTML=`
      <span class="m7logout-icon" aria-hidden="true">↪</span>
      <span class="m7logout-copy">
        <span class="m7logout-title">Log out</span>
        <span class="m7logout-sub">Sign out of your Ma7alak account</span>
      </span>
    `;

    btn.addEventListener("click",async function(e){
      e.preventDefault();
      e.stopPropagation();
      if(btn.disabled) return;

      const a=account();
      if(!a || typeof a.logout!=="function") return;

      btn.disabled=true;
      const title=btn.querySelector(".m7logout-title");
      if(title) title.textContent="Logging out…";

      try{
        await a.logout();
      }catch(err){
        console.error("[Ma7alak Header Logout]",err);
      }finally{
        btn.disabled=false;
        if(title) title.textContent="Log out";
        sync();

        const menuButton=document.getElementById("ma7alak-header-menu-button");
        const menuPanel=document.getElementById("ma7alak-header-menu-panel");
        if(menuPanel){
          menuPanel.classList.remove("open");
          menuPanel.setAttribute("aria-hidden","true");
        }
        if(menuButton){
          menuButton.classList.remove("open");
          menuButton.setAttribute("aria-expanded","false");
        }
      }
    });

    panel.appendChild(btn);
    return btn;
  }

  function sync(){
    const btn=ensureButton();
    if(!btn) return false;
    btn.classList.toggle("visible",isLoggedIn());
    btn.setAttribute("aria-hidden",isLoggedIn()?"false":"true");
    return true;
  }

  async function boot(){
    injectStyle();

    // Wait for the Premium Header and unified account system without observing DOM mutations forever.
    let tries=0;
    const timer=setInterval(async function(){
      tries++;

      const a=account();
      if(a && typeof a.ready==="function"){
        try{ await a.ready(); }catch(_){ }
      }

      const ready=sync();
      if(ready || tries>=80) clearInterval(timer);
    },125);

    // Safe account-state hooks. These do not mutate/re-observe the whole document.
    window.addEventListener("ma7alak:account-change",sync);
    window.addEventListener("ma7alak:auth-change",sync);
    window.addEventListener("ma7alak:owner-auth-change",sync);
    window.addEventListener("ma7alak:account-updated",sync);

    // Supabase auth state is the authoritative fallback.
    let authHooked=false;
    const authTimer=setInterval(function(){
      if(authHooked){ clearInterval(authTimer); return; }
      const a=account();
      const c=a?.client;
      if(c?.auth?.onAuthStateChange){
        authHooked=true;
        clearInterval(authTimer);
        c.auth.onAuthStateChange(function(){
          setTimeout(sync,0);
        });
      }
    },250);
    setTimeout(function(){clearInterval(authTimer);},15000);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();
