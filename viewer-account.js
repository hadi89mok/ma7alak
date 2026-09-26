/* =========================================================
 SHOUFHON VIEWER ACCOUNT V9.2 — ONE ACCOUNT SYSTEM
 - One Google/ShoufHon account for viewers and shop owners
 - Personal viewer profile remains preserved underneath ownership
 - Safe signed-in-only Logout item in header menu
 - Shared Supabase library/client bootstrap for ShoufHon modules
 - Header watcher becomes targeted after header mount
========================================================= */
(function(){
"use strict";
if(window.__MA7ALAK_VIEWER_ACCOUNT_V92__)return;window.__MA7ALAK_VIEWER_ACCOUNT_V92__=true;
const URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl",STORAGE_KEY="ma7alak-viewer-auth-v1",BUCKET="viewer-avatars";let client=null,session=null,profile=null,initPromise=null,ownerState=false,headerObserver=null,headerMountObserver=null;
let personalNotificationRows=[],personalNotificationChannel=null,personalNotificationRefreshPromise=null;
const esc=v=>String(v||"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[m]));
function loadSB(){
  if(window.supabase?.createClient)return Promise.resolve(window.supabase);
  if(window.__MA7ALAK_SUPABASE_LIB_PROMISE__)return window.__MA7ALAK_SUPABASE_LIB_PROMISE__;
  window.__MA7ALAK_SUPABASE_LIB_PROMISE__=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-ma7alak-supabase-lib="1"],script[src*="@supabase/supabase-js@2"]');
    const done=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error("SUPABASE_LOAD_FAILED"));
    if(existing){existing.addEventListener("load",done,{once:true});existing.addEventListener("error",reject,{once:true});return}
    const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.async=true;s.dataset.ma7alakSupabaseLib="1";s.onload=done;s.onerror=()=>reject(new Error("SUPABASE_LOAD_FAILED"));document.head.appendChild(s);
  });
  return window.__MA7ALAK_SUPABASE_LIB_PROMISE__;
}
function syncEmbeddedAccount(){const detail={session,user:session?.user||null,profile,signedIn:!!session?.user};document.querySelectorAll("iframe").forEach(frame=>{try{frame.contentWindow?.postMessage({type:"MA7ALAK_ACCOUNT_CHANGED",signedIn:detail.signedIn},"*")}catch(_){}try{frame.contentWindow?.dispatchEvent(new frame.contentWindow.CustomEvent("ma7alak:account-change",{detail}))}catch(_){}try{frame.contentDocument?.querySelectorAll("#ma7alak-owner-add-story,.ma7alak-owner-add-story,[data-owner-only]").forEach(el=>{if(detail.signedIn)el.style.removeProperty("display");else{el.classList.remove("visible","active","show");el.style.setProperty("display","none","important")}})}catch(_){}})}
function emit(){const detail={session,user:session?.user||null,profile};dispatchEvent(new CustomEvent("ma7alak:account-change",{detail}));syncEmbeddedAccount()}

function emitPersonalNotifications(){
  const detail={
    userId:String(session?.user?.id||""),
    rows:Array.isArray(personalNotificationRows)
      ?personalNotificationRows.map(row=>({...row}))
      :[]
  };
  window.dispatchEvent(
    new CustomEvent(
      "ma7alak:personal-notifications",
      {detail}
    )
  );
}

async function refreshPersonalNotifications(force=false){
  if(!client||!session?.user){
    personalNotificationRows=[];
    emitPersonalNotifications();
    return personalNotificationRows;
  }

  if(personalNotificationRefreshPromise&&!force){
    return personalNotificationRefreshPromise;
  }

  personalNotificationRefreshPromise=(async()=>{
    const result=await client.rpc(
      "ma7alak_get_my_media_notifications"
    );

    if(result.error)throw result.error;

    personalNotificationRows=
      Array.isArray(result.data)
        ?result.data
        :[];

    emitPersonalNotifications();

    return personalNotificationRows;
  })();

  try{
    return await personalNotificationRefreshPromise;
  }catch(error){
    console.warn(
      "ShoufHon personal notifications:",
      error
    );
    return personalNotificationRows;
  }finally{
    personalNotificationRefreshPromise=null;
  }
}

async function bindPersonalNotificationRealtime(){
  if(!client)return;

  if(personalNotificationChannel){
    try{
      await client.removeChannel(
        personalNotificationChannel
      );
    }catch(_){}
    personalNotificationChannel=null;
  }

  const userId=
    String(session?.user?.id||"").trim();

  if(!userId)return;

  personalNotificationChannel=
    client
      .channel(
        "shoufhon-account-media-notifications-"+userId
      )
      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"ma7alak_user_notifications",
          filter:"recipient_user_id=eq."+userId
        },
        ()=>{
          refreshPersonalNotifications(true)
            .catch(()=>{});
        }
      )
      .subscribe();
}

async function syncPersonalNotifications(){
  await refreshPersonalNotifications(true);
  await bindPersonalNotificationRealtime();
}
async function loadProfile(){if(!session?.user){profile=null;emit();syncHeaderFix();return}let r=await client.from("viewer_profiles").select("*").eq("user_id",session.user.id).maybeSingle();profile=r.data||null;if(profile?.account_status==="banned"){alert("This ShoufHon account is banned."+(profile.banned_reason?"\nReason: "+profile.banned_reason:""));await logout();return}if(profile?.account_status==="deleted"){alert("This ShoufHon account has been disabled.");await logout();return}emit();syncHeaderFix()}
function css(){if(document.getElementById("m7a-v91-css"))return;let s=document.createElement("style");s.id="m7a-v91-css";s.textContent=`#m7-account-overlay{position:fixed;inset:0;background:#000c;z-index:2147483600;display:grid;place-items:center;padding:18px;font-family:Arial}#m7-account-card{width:min(430px,100%);max-height:92vh;overflow:auto;background:linear-gradient(160deg,#21150f,#0f0d0c);border:1px solid #d99a4566;border-radius:24px;padding:22px;color:#fff;box-shadow:0 24px 70px #000a}#m7-account-card h2{margin:0;color:#f4b85d}.m7a-close{float:right;border:0;background:none;color:#fff;font-size:25px}.m7a-row{display:grid;gap:10px;margin-top:15px}.m7a-btn{border:0;border-radius:14px;padding:13px;font-weight:900;cursor:pointer;background:#d99a45}.m7a-btn.google{background:#fff;color:#171717}.m7a-btn.dark{background:#2d2723;color:#fff}.m7a-input{width:100%;box-sizing:border-box;background:#15110f;color:#fff;border:1px solid #4a382c;border-radius:13px;padding:12px}#m7a-avatar{width:104px;height:104px;border-radius:50%;overflow:hidden;border:2px solid #d99a45;margin:15px auto;display:grid;place-items:center;background:#1b1613;cursor:pointer}#m7a-avatar img{width:100%;height:100%;object-fit:cover}#m7a-status{font-size:12px;color:#f4b85d;margin-top:10px}.m7a-coming{margin-top:18px;padding:14px;border:1px solid #d99a4538;border-radius:15px;background:#ffffff08;text-align:center}.m7a-coming strong{display:block;color:#f4b85d;font-size:12px;letter-spacing:.4px}.m7a-coming span{display:block;margin-top:5px;color:#ffffff8f;font-size:10px;line-height:1.4}#m7a-header-logout{cursor:pointer!important}#m7a-toast{position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom));z-index:2147483647;transform:translate(-50%,18px);opacity:0;pointer-events:none;display:flex;align-items:center;gap:10px;max-width:calc(100vw - 30px);padding:13px 17px;border:1px solid #d99a4570;border-radius:14px;background:#17120f;color:#fff;font:700 14px/1.25 Arial;box-shadow:0 16px 45px #0009;transition:opacity .2s,transform .2s}#m7a-toast.visible{opacity:1;transform:translate(-50%,0)}#m7a-toast .m7a-toast-check{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#d99a45;color:#17120f;font-size:15px}`;document.head.appendChild(s)}
function ensureMenuLogout(){
  const panel=document.getElementById("ma7alak-header-menu-panel");
  let item=document.getElementById("m7a-header-logout");
  if(!session?.user){item?.remove();return}
  if(!panel||item)return;
  item=document.createElement("a");
  item.id="m7a-header-logout";
  item.href="#";
  item.className="ma7alak-header-menu-link ma7alak-header-menu-logout";
  item.innerHTML='<span class="ma7alak-header-menu-icon" aria-hidden="true">↪</span><span class="ma7alak-header-menu-text"><span class="ma7alak-header-menu-main">Log out</span><span class="ma7alak-header-menu-sub">Sign out of ShoufHon</span></span><span class="ma7alak-header-menu-chevron" aria-hidden="true">›</span>';
  item.addEventListener("click",async e=>{e.preventDefault();e.stopPropagation();await logout()});
  panel.appendChild(item);
}
function syncHeaderFix(){
  const likes=document.getElementById("ma7alak-header-likes-slot");
  if(likes){if(session?.user&&!ownerState)likes.style.setProperty("display","none","important");else likes.style.removeProperty("display")}
  const brand=document.querySelector("#ma7alak-social-header .ma7alak-header-brand");
  if(brand&&window.matchMedia("(max-width:900px)").matches){brand.style.setProperty("margin-left","-10px","important");brand.style.setProperty("padding-left","4px","important")}
  ensureMenuLogout();
}
function bindTargetedHeaderObserver(){
  const header=document.getElementById("ma7alak-social-header")||document.getElementById("ma7alak-header-menu-panel")?.parentElement;
  if(!header)return false;
  try{headerMountObserver?.disconnect()}catch(_){}
  if(headerObserver)return true;
  let queued=false;
  headerObserver=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncHeaderFix()})});
  headerObserver.observe(header,{childList:true,subtree:true});
  syncHeaderFix();
  return true;
}
function startHeaderFixWatcher(){
  syncHeaderFix();
  if(!bindTargetedHeaderObserver()&&document.documentElement){
    headerMountObserver=new MutationObserver(()=>{if(bindTargetedHeaderObserver())headerMountObserver=null});
    headerMountObserver.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>{try{headerMountObserver?.disconnect()}catch(_){}headerMountObserver=null;bindTargetedHeaderObserver();syncHeaderFix()},8000);
  }
  addEventListener("resize",syncHeaderFix,{passive:true});
  addEventListener("ma7alak:owner-auth-change",e=>{ownerState=!!e.detail?.owner;syncHeaderFix()});
}
function close(){document.getElementById("m7-account-overlay")?.remove()}
function status(t){let x=document.getElementById("m7a-status");if(x)x.textContent=t||""}
function toast(message){css();document.getElementById("m7a-toast")?.remove();const el=document.createElement("div");el.id="m7a-toast";el.setAttribute("role","status");el.setAttribute("aria-live","polite");el.innerHTML='<span class="m7a-toast-check">✓</span><span>'+esc(message)+'</span>';document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("visible"));setTimeout(()=>{el.classList.remove("visible");setTimeout(()=>el.remove(),250)},2800)}
window.addEventListener("pagehide",()=>closeEmbedViewerPortal());
window.addEventListener("beforeunload",()=>closeEmbedViewerPortal());

async function logout(){const buttons=[document.getElementById("m7a-logout"),document.getElementById("m7a-header-logout")].filter(Boolean);buttons.forEach(button=>{if(button.id==="m7a-header-logout"){button.dataset.logoutHtml=button.innerHTML;const main=button.querySelector(".ma7alak-header-menu-main");if(main)main.textContent="Logging out…"}else{button.dataset.logoutText=button.textContent;button.textContent="Logging out…"}button.style.pointerEvents="none"});try{const result=await client?.auth.signOut({scope:"local"});if(result?.error)throw result.error;session=null;profile=null;ownerState=false;emit();syncHeaderFix();close();toast("You’re logged out");return true}catch(error){buttons.forEach(button=>{if(button.id==="m7a-header-logout"&&button.dataset.logoutHtml){button.innerHTML=button.dataset.logoutHtml}else{button.textContent=button.dataset.logoutText||"Log out"}button.style.pointerEvents=""});status(error?.message||"Could not log out. Please try again.");console.error("SHOUFHON logout:",error);return false}}
async function saveProfile(name,avatarUrl){return client.rpc("ma7alak_update_my_profile",{p_display_name:name,p_username:profile?.username||null,p_avatar_url:avatarUrl||null,p_bio:profile?.bio||null})}
async function upload(file){if(!file||!session?.user)return;if(!file.type.startsWith("image/")||file.size>5*1024*1024){status("Choose an image under 5 MB.");return}let ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,""),path=`${session.user.id}/avatar-${Date.now()}.${ext}`;let u=await client.storage.from(BUCKET).upload(path,file,{contentType:file.type});if(u.error){status(u.error.message);return}let url=client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,name=document.getElementById("m7a-name")?.value.trim()||profile?.display_name||session.user.user_metadata?.full_name||"ShoufHon User";let r=await saveProfile(name,url);if(r.error){status(r.error.message);return}await loadProfile();open()}
async function open(){window.dispatchEvent(new CustomEvent("ma7alak:panel-open",{detail:{panel:"account"}}));css();close();let logged=!!session?.user,d=document.createElement("div");d.id="m7-account-overlay";if(!logged)d.innerHTML=`<div id="m7-account-card"><button class="m7a-close">×</button><h2>ShoufHon Account</h2><p>Follow shops, receive updates and message businesses.</p><div class="m7a-row"><button id="m7a-google" class="m7a-btn google">G&nbsp;&nbsp; Continue with Google</button></div><div class="m7a-coming"><strong>NEW FEATURES COMING SOON</strong><span>More ways to discover, connect and interact with local shops are on the way.</span></div><div id="m7a-status"></div></div>`;else{let av=profile?.avatar_url||session.user.user_metadata?.avatar_url||"",name=profile?.display_name||session.user.user_metadata?.full_name||"";d.innerHTML=`<div id="m7-account-card"><button class="m7a-close">×</button><h2>My ShoufHon Profile</h2><p>${esc(session.user.email)}</p><div id="m7a-avatar">${av?`<img src="${esc(av)}">`:"＋ Photo"}</div><input id="m7a-file" type="file" accept="image/*" hidden><div class="m7a-row"><input class="m7a-input" id="m7a-name" placeholder="Display name" value="${esc(name)}"><button id="m7a-save" class="m7a-btn">Save profile</button><button id="m7a-logout" class="m7a-btn dark">Log out</button></div><div class="m7a-coming"><strong>NEW FEATURES COMING SOON</strong><span>More ways to discover, connect and interact with local shops are on the way.</span></div><div id="m7a-status"></div></div>`}document.body.appendChild(d);d.querySelector(".m7a-close").onclick=close;d.onclick=e=>{if(e.target===d)close()};if(!logged){document.getElementById("m7a-google").onclick=async()=>{status("Opening Google...");let r=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:"select_account"}}});if(r.error)status(r.error.message)}}else{let f=document.getElementById("m7a-file");document.getElementById("m7a-avatar").onclick=()=>f.click();f.onchange=()=>upload(f.files?.[0]);document.getElementById("m7a-save").onclick=async()=>{let name=document.getElementById("m7a-name").value.trim();if(!name){status("Display name required.");return}let r=await saveProfile(name,profile?.avatar_url||session.user.user_metadata?.avatar_url||null);if(r.error){status(r.error.message);return}await loadProfile();close()};document.getElementById("m7a-logout").onclick=logout}}
async function init(){
  await loadSB();
  if(!window.__MA7ALAK_SHARED_SUPABASE_CLIENT__){window.__MA7ALAK_SHARED_SUPABASE_CLIENT__=window.supabase.createClient(URL,KEY,{auth:{storage:localStorage,storageKey:STORAGE_KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}
  client=window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;
  let r=await client.auth.getSession();
  session=r.data.session;
  startHeaderFixWatcher();
  await loadProfile();
  await syncPersonalNotifications();
  client.auth.onAuthStateChange((_e,s)=>{
    session=s;
    setTimeout(async()=>{
      try{
        await loadProfile();
        await syncPersonalNotifications();
      }catch(error){
        console.warn("ShoufHon account refresh:",error);
      }
    },0);
  });
}

/* =========================================================
   SHOUFHON AUTHENTICATED MEDIA BRIDGE
   ---------------------------------------------------------
   Hostinger Custom Embeds may run in isolated iframe contexts.
   This bridge lets only child frames on the current ShoufHon page
   call a small allow-list of media RPCs through the real account
   session. SQL still derives auth.uid() server-side.
========================================================= */
const MEDIA_RPC_READ_ALLOWLIST=new Set([
  "ma7alak_get_shop_media_engagement",
  "ma7alak_get_shop_media_catalog",
  "ma7alak_get_media_comments"
]);
const MEDIA_RPC_WRITE_ALLOWLIST=new Set([
  "ma7alak_toggle_media_like",
  "ma7alak_create_media_comment",
  "ma7alak_edit_media_comment",
  "ma7alak_delete_media_comment",
  "ma7alak_toggle_media_comment_like"
]);
const MEDIA_RPC_ALLOWLIST=new Set([
  ...MEDIA_RPC_READ_ALLOWLIST,
  ...MEDIA_RPC_WRITE_ALLOWLIST
]);
function trustedEmbedSource(source){
  if(!source)return false;
  if(source===window)return true;
  try{
    return Array.from(document.querySelectorAll("iframe")).some(frame=>{
      try{return frame.contentWindow===source}catch(_){return false}
    });
  }catch(_){return false}
}

let activeEmbedViewerPortal=null;

function embedFrameForSource(source){
  if(!source)return null;
  try{
    return Array.from(document.querySelectorAll("iframe")).find(frame=>{
      try{return frame.contentWindow===source}catch(_){return false}
    })||null;
  }catch(_){
    return null;
  }
}

function captureInlineStyle(node){
  if(!node)return null;
  return node.getAttribute("style");
}

function restoreInlineStyle(node,value){
  if(!node)return;
  if(value===null||value===undefined)node.removeAttribute("style");
  else node.setAttribute("style",value);
}

function portalHistoryToken(){
  return "m7portal-"+Date.now()+"-"+Math.random().toString(36).slice(2);
}

function closeEmbedViewerPortal(source,options={}){
  const state=activeEmbedViewerPortal;
  if(!state)return false;
  if(source&&state.source&&source!==state.source)return false;

  const requestedKind=
    String(options.viewerKind||"").trim();

  if(
    requestedKind &&
    state.viewerKind &&
    requestedKind!==state.viewerKind
  ){
    return false;
  }

  activeEmbedViewerPortal=null;

  restoreInlineStyle(state.frame,state.frameStyle);

  (state.ancestors||[]).forEach(item=>{
    restoreInlineStyle(item.node,item.style);
  });

  restoreInlineStyle(
    document.documentElement,
    state.htmlStyle
  );
  restoreInlineStyle(
    document.body,
    state.bodyStyle
  );

  try{
    state.frame.removeAttribute(
      "data-shoufhon-viewer-portal"
    );
  }catch(_){}

  /*
     If the child closed with its own X button, remove the temporary
     history sentinel without navigating away from the shop page.
  */
  if(
    options.fromHistory!==true &&
    state.historyToken &&
    history.state?.__shoufhonEmbedPortal===
      state.historyToken
  ){
    try{history.back()}catch(_){}
  }

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      try{
        window.scrollTo(
          state.scrollX||0,
          state.scrollY||0
        );
      }catch(_){}
    });
  });

  return true;
}

function openEmbedViewerPortal(source,data={}){
  const frame=embedFrameForSource(source);
  if(!frame)return false;

  const viewerKind=
    String(data.viewerKind||"media-viewer").trim()||
    "media-viewer";

  if(
    activeEmbedViewerPortal &&
    activeEmbedViewerPortal.frame===frame &&
    activeEmbedViewerPortal.viewerKind===viewerKind
  ){
    return true;
  }

  closeEmbedViewerPortal();

  const ancestors=[];
  let node=frame.parentElement;

  while(
    node &&
    node!==document.body &&
    node!==document.documentElement
  ){
    ancestors.push({
      node,
      style:captureInlineStyle(node)
    });

    node.style.setProperty(
      "overflow","visible","important"
    );
    node.style.setProperty(
      "transform","none","important"
    );
    node.style.setProperty(
      "filter","none","important"
    );
    node.style.setProperty(
      "perspective","none","important"
    );
    node.style.setProperty(
      "contain","none","important"
    );
    node.style.setProperty(
      "clip-path","none","important"
    );
    node.style.setProperty(
      "isolation","auto","important"
    );
    node.style.setProperty(
      "z-index","2147483645","important"
    );

    node=node.parentElement;
  }

  const historyToken=portalHistoryToken();

  const state={
    source,
    frame,
    viewerKind,
    shopSlug:String(data.shopSlug||"").trim(),
    frameStyle:captureInlineStyle(frame),
    ancestors,
    htmlStyle:captureInlineStyle(
      document.documentElement
    ),
    bodyStyle:captureInlineStyle(
      document.body
    ),
    scrollX:window.scrollX||0,
    scrollY:window.scrollY||0,
    historyToken
  };

  activeEmbedViewerPortal=state;

  try{
    history.pushState(
      {
        ...(history.state||{}),
        __shoufhonEmbedPortal:historyToken
      },
      "",
      location.href
    );
  }catch(_){}

  document.documentElement.style.setProperty(
    "overflow","hidden","important"
  );
  document.body.style.setProperty(
    "overflow","hidden","important"
  );

  frame.setAttribute(
    "data-shoufhon-viewer-portal",
    viewerKind
  );
  frame.style.setProperty(
    "position","fixed","important"
  );
  frame.style.setProperty(
    "inset","0","important"
  );
  frame.style.setProperty(
    "left","0","important"
  );
  frame.style.setProperty(
    "top","0","important"
  );
  frame.style.setProperty(
    "width","100vw","important"
  );
  frame.style.setProperty(
    "height","100dvh","important"
  );
  frame.style.setProperty(
    "min-width","100vw","important"
  );
  frame.style.setProperty(
    "min-height","100vh","important"
  );
  frame.style.setProperty(
    "max-width","none","important"
  );
  frame.style.setProperty(
    "max-height","none","important"
  );
  frame.style.setProperty(
    "margin","0","important"
  );
  frame.style.setProperty(
    "padding","0","important"
  );
  frame.style.setProperty(
    "border","0","important"
  );
  frame.style.setProperty(
    "border-radius","0","important"
  );
  frame.style.setProperty(
    "transform","none","important"
  );
  frame.style.setProperty(
    "z-index","2147483646","important"
  );
  frame.style.setProperty(
    "background","#050505","important"
  );
  frame.style.setProperty(
    "display","block","important"
  );
  frame.style.setProperty(
    "visibility","visible","important"
  );
  frame.style.setProperty(
    "opacity","1","important"
  );

  return true;
}

window.addEventListener("popstate",()=>{
  const state=activeEmbedViewerPortal;
  if(!state)return;

  try{
    state.source?.postMessage(
      {
        type:"SHOUFHON_EMBED_VIEWER_BACK",
        viewerKind:state.viewerKind,
        shopSlug:state.shopSlug||""
      },
      "*"
    );
  }catch(_){}

  closeEmbedViewerPortal(
    state.source,
    {
      fromHistory:true,
      viewerKind:state.viewerKind
    }
  );
});

function safeBridgeError(error){
  return {
    message:String(error?.message||"REQUEST_FAILED"),
    code:String(error?.code||""),
    details:String(error?.details||""),
    hint:String(error?.hint||"")
  };
}
async function handleMediaBridge(event){
  const data=event?.data||{};
  if(!trustedEmbedSource(event?.source))return;

  if(data.type==="SHOUFHON_EMBED_VIEWER_OPEN"){
    openEmbedViewerPortal(
      event.source,
      data
    );
    return;
  }

  if(data.type==="SHOUFHON_EMBED_VIEWER_CLOSE"){
    closeEmbedViewerPortal(
      event.source,
      {
        viewerKind:String(
          data.viewerKind||""
        ).trim()
      }
    );
    return;
  }

  if(data.type==="SHOUFHON_ACCOUNT_OPEN_REQUEST"){
    open();
    return;
  }

  if(data.type==="SHOUFHON_MEDIA_DEEPLINK_CONSUMED"){
    try{
      const url=new URL(window.location.href);
      url.searchParams.delete("media");
      url.searchParams.delete("comments");
      url.searchParams.delete("comment");
      history.replaceState(history.state,"",url.pathname+url.search+url.hash);
    }catch(_){}
    return;
  }

  if(data.type==="SHOUFHON_ACCOUNT_STATE_REQUEST"){
    try{await initPromise}catch(_){}
    const meta=session?.user?.user_metadata||{};
    event.source?.postMessage({
      type:"SHOUFHON_ACCOUNT_STATE_RESPONSE",
      requestId:String(data.requestId||""),
      loggedIn:!!session?.user,
      user:session?.user?{
        id:session.user.id,
        display_name:profile?.display_name||meta.full_name||meta.name||"ShoufHon user",
        avatar_url:profile?.avatar_url||meta.avatar_url||meta.picture||""
      }:null
    },"*");
    return;
  }

  if(data.type!=="SHOUFHON_MEDIA_RPC_REQUEST")return;

  const requestId=String(data.requestId||"");
  const fn=String(data.fn||"");

  if(!MEDIA_RPC_ALLOWLIST.has(fn)){
    event.source?.postMessage({
      type:"SHOUFHON_MEDIA_RPC_RESPONSE",
      requestId,
      error:{message:"RPC_NOT_ALLOWED"}
    },"*");
    return;
  }

  try{
    await initPromise;
    if(!client)throw new Error("CLIENT_NOT_READY");
    if(MEDIA_RPC_WRITE_ALLOWLIST.has(fn)&&!session?.user)throw new Error("LOGIN_REQUIRED");
    const result=await client.rpc(
      fn,
      data.args&&typeof data.args==="object"?data.args:{}
    );
    if(result.error)throw result.error;
    event.source?.postMessage({
      type:"SHOUFHON_MEDIA_RPC_RESPONSE",
      requestId,
      data:result.data
    },"*");
  }catch(error){
    event.source?.postMessage({
      type:"SHOUFHON_MEDIA_RPC_RESPONSE",
      requestId,
      error:safeBridgeError(error)
    },"*");
  }
}
window.addEventListener("message",handleMediaBridge);

window.Ma7alakAccount={
  open,
  close,
  logout,
  get client(){return client},
  get session(){return session},
  get user(){return session?.user||null},
  get profile(){return profile},
  get personalNotifications(){
    return Array.isArray(personalNotificationRows)
      ?personalNotificationRows.map(row=>({...row}))
      :[];
  },
  refreshPersonalNotifications:()=>refreshPersonalNotifications(true),
  ready:()=>initPromise
};
window.Ma7alakSupabase={get client(){return client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null},ready:async()=>{await initPromise;return client},loadLibrary:loadSB,url:URL,key:KEY};
initPromise=init().catch(error=>{console.error("SHOUFHON account init:",error);throw error});
})();