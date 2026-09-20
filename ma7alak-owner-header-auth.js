/* =========================================================
 SHOUFHON UNIFIED ACCOUNT / OWNER BRIDGE V6
 - ONE identity circle beside the menu
 - Normal user: only right identity circle, no owner Likes circle, no rotation
 - Owner: same right circle becomes shop identity + rotating owner ring
 - Live ownership switching preserved
 - Admin existing-user assignment preserved
========================================================= */
(function(){
"use strict";
if(window.self!==window.top)return;
if(window.__MA7ALAK_UNIFIED_OWNER_V6__)return;window.__MA7ALAK_UNIFIED_OWNER_V6__=true;
let session=null,owner=null,shop=null,readyResolve,ownerChannel=null,shopChannel=null,pollTimer=null,lastOwnerKey="";
const readyPromise=new Promise(r=>readyResolve=r),path=()=>((location.pathname||"/").replace(/\/+$/,"")||"/"),esc=v=>String(v||"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[m])),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const OWNER_CACHE_KEY="ma7alak-owner-header-cache-v1";
function readOwnerCache(userId){try{const value=JSON.parse(localStorage.getItem(OWNER_CACHE_KEY)||"null");return value&&value.user_id===userId&&value.owner?.shop_slug?value:null}catch(_){return null}}
function writeOwnerCache(userId,nextOwner,nextShop){try{if(userId&&nextOwner?.shop_slug)localStorage.setItem(OWNER_CACHE_KEY,JSON.stringify({user_id:userId,owner:nextOwner,shop:nextShop||null,saved_at:Date.now()}));else localStorage.removeItem(OWNER_CACHE_KEY)}catch(_){}}
async function accountReady(){for(let i=0;i<150&&!window.Ma7alakAccount?.client;i++)await sleep(100);try{await window.Ma7alakAccount?.ready?.()}catch(_){}}
function client(){return window.Ma7alakAccount?.client||null}
function ownerStatePayload(){
  const verifiedOwner=!!(session?.user&&owner?.shop_slug);
  return {
    type:"MA7ALAK_OWNER_STATE",
    isOwner:verifiedOwner,
    shopSlug:verifiedOwner?String(owner.shop_slug||""):"",
    shop:verifiedOwner?(shop||null):null,
    sentAt:Date.now()
  };
}
function sendOwnerState(target){
  try{target?.postMessage(ownerStatePayload(),"*")}catch(_){}
}
function broadcastOwnerState(){
  const payload=ownerStatePayload();
  try{window.postMessage(payload,"*")}catch(_){}
  document.querySelectorAll("iframe").forEach(frame=>{
    try{frame.contentWindow?.postMessage(payload,"*")}catch(_){}
  });
}
function emit(){
  dispatchEvent(new CustomEvent("ma7alak:owner-auth-change",{detail:{session,user:session?.user||null,owner,shop}}));
  broadcastOwnerState();
}
function removeOldLogin(){document.querySelectorAll("#ma7alak-header-menu-panel a.ma7alak-header-menu-link").forEach(a=>{const main=(a.querySelector(".ma7alak-header-menu-main")?.textContent||"").trim(),sub=(a.querySelector(".ma7alak-header-menu-sub")?.textContent||"").trim(),href=(a.getAttribute("href")||"").toLowerCase();if(/^login$/i.test(main)||/shop owner access/i.test(sub)||/\/login\/?$/.test(href))a.remove()})}
function normalAvatar(){const p=window.Ma7alakAccount?.profile,u=session?.user;return p?.avatar_url||u?.user_metadata?.avatar_url||u?.user_metadata?.picture||""}
function normalName(){const p=window.Ma7alakAccount?.profile,u=session?.user;return p?.display_name||p?.username||u?.user_metadata?.full_name||u?.email||"ShoufHon User"}
function initials(name){const a=String(name||"M").trim().split(/\s+/).filter(Boolean);return a.slice(0,2).map(x=>x.charAt(0).toUpperCase()).join("")||"M"}
function ensureCss(){if(document.getElementById("m7-unified-identity-css"))return;const s=document.createElement("style");s.id="m7-unified-identity-css";s.textContent=`
#ma7alak-header-owner.ma7alak-unified-user{display:flex!important}
body.m7-unified-signed-in #ma7alak-header-login,body.m7-unified-signed-in #ma7alak-header-account,body.m7-unified-signed-in .ma7alak-account-button,body.m7-unified-signed-in [data-ma7alak-account]:not(#ma7alak-header-owner){display:none!important}
/* Normal viewers must NEVER get the old owner-only Likes/profile circle. */
body.m7-unified-signed-in:not(.m7-unified-owner-state) #ma7alak-header-likes-slot{display:none!important}
body.m7-unified-owner-state #ma7alak-header-likes-slot{display:flex!important}
#ma7alak-header-owner.ma7alak-unified-user:not(.ma7alak-unified-owner) .ma7alak-owner-avatar-wrap{animation:none!important;-webkit-animation:none!important;box-shadow:0 0 0 1px rgba(255,255,255,.14)!important;background:transparent!important}
#ma7alak-header-owner.ma7alak-unified-user:not(.ma7alak-unified-owner) .ma7alak-owner-avatar-wrap::before{opacity:0!important;animation:none!important;-webkit-animation:none!important}
#ma7alak-header-owner.ma7alak-unified-user:not(.ma7alak-unified-owner) .ma7alak-owner-sub{color:rgba(255,255,255,.55)!important}
#ma7alak-header-owner.ma7alak-unified-owner .ma7alak-owner-avatar-wrap{animation:ma7alakOwnerCircleSpin 8s linear infinite!important;-webkit-animation:ma7alakOwnerCircleSpin 8s linear infinite!important}
#ma7alak-header-owner.ma7alak-unified-owner .ma7alak-owner-avatar-wrap::before{opacity:1!important}
/* Move ShoufHon Lebanese-eye logo farther left on phones, but keep a safe rounded-edge gap. */
@media(max-width:900px){#ma7alak-social-header .ma7alak-header-brand{margin-left:0!important;padding-left:6px!important;overflow:hidden!important;box-sizing:border-box!important}}
@media(max-width:390px){#ma7alak-social-header .ma7alak-header-brand{margin-left:0!important;padding-left:5px!important}}
#m7-owner-assign-v4{margin-top:14px;padding:16px;border:1px solid rgba(217,164,65,.28);border-radius:18px;background:rgba(217,164,65,.045);color:#fff}#m7-owner-assign-v4 h3{margin:0;color:#f2bd68;font-size:17px}#m7-owner-assign-v4 p{margin:6px 0 13px;color:rgba(255,255,255,.55);font-size:11px;line-height:1.45}.m7oa4-current{display:flex;align-items:center;gap:10px;padding:11px;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(255,255,255,.035);margin-bottom:12px}.m7oa4-current img,.m7oa4-result img{width:40px;height:40px;border-radius:50%;object-fit:cover;background:#171717}.m7oa4-current-copy,.m7oa4-result-copy{min-width:0;flex:1}.m7oa4-current-copy strong,.m7oa4-result-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7oa4-current-copy small,.m7oa4-result-copy small{display:block;margin-top:3px;color:rgba(255,255,255,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7oa4-search{width:100%;box-sizing:border-box;padding:12px 13px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#15110f;color:#fff;outline:none}.m7oa4-search:focus{border-color:rgba(217,164,65,.55)}#m7oa4-results{display:grid;gap:7px;margin-top:9px;max-height:260px;overflow:auto}.m7oa4-result{display:flex;align-items:center;gap:10px;padding:9px;border:1px solid rgba(255,255,255,.07);border-radius:12px;background:rgba(255,255,255,.025)}.m7oa4-btn{border:0;border-radius:10px;padding:9px 11px;font-weight:850;cursor:pointer;background:#d99a45;color:#17100b}.m7oa4-btn.remove{background:#7b3434;color:#fff}.m7oa4-btn:disabled{opacity:.55;cursor:default}.m7oa4-status{min-height:17px;margin-top:9px;color:#efbd70;font-size:11px}.m7oa4-empty{padding:13px;text-align:center;color:rgba(255,255,255,.45);font-size:11px}`;document.head.appendChild(s)}
function setImage(image,fallback,src,name){if(!image||!fallback)return;if(src){image.style.display="block";fallback.style.display="none";if(image.src!==src)image.src=src;image.alt=name||"";image.onerror=()=>{image.style.display="none";fallback.style.display="flex";fallback.textContent=initials(name)}}else{image.style.display="none";fallback.style.display="flex";fallback.textContent=initials(name)}}
function syncCircle(){removeOldLogin();ensureCss();const el=document.getElementById("ma7alak-header-owner");if(!el)return false;const image=document.getElementById("ma7alak-header-owner-image")||el.querySelector("img"),fallback=document.getElementById("ma7alak-header-owner-fallback"),nameEl=document.getElementById("ma7alak-header-owner-name"),sub=el.querySelector(".ma7alak-owner-sub");if(!session?.user){document.body?.classList.remove("m7-unified-signed-in","m7-unified-owner-state","ma7alak-owner-heart-visible");el.classList.remove("ma7alak-unified-user","ma7alak-unified-owner","visible");return true}document.body?.classList.add("m7-unified-signed-in");document.body?.classList.toggle("m7-unified-owner-state",!!owner);/* owner heart is strictly tied to actual unified ownership */document.body?.classList.toggle("ma7alak-owner-heart-visible",!!owner);el.classList.add("ma7alak-unified-user","visible");el.classList.toggle("ma7alak-unified-owner",!!owner);const displayName=owner?(shop?.shop_name||owner.shop_slug):normalName(),src=owner?(shop?.profile_image_url||""):normalAvatar();setImage(image,fallback,src,displayName);if(nameEl&&nameEl.textContent!==displayName)nameEl.textContent=displayName;const subText=owner?"View Your Page →":"My Profile";if(sub&&sub.textContent!==subText)sub.textContent=subText;if(el.title!==displayName)el.title=displayName;el.setAttribute("aria-label",owner?"Open your shop":"Open your ShoufHon profile");el.href=owner?.shop_slug?"/"+encodeURIComponent(owner.shop_slug):"#";el.onclick=e=>{e.preventDefault();e.stopPropagation();if(owner?.shop_slug)location.href="/"+encodeURIComponent(owner.shop_slug);else window.Ma7alakAccount?.open?.()};return true}
async function refresh(silent){await accountReady();const c=client();session=window.Ma7alakAccount?.session||null;const userId=session?.user?.id||"";let nextOwner=null,nextShop=null;const cached=readOwnerCache(userId);if(cached){owner=cached.owner;shop=cached.shop;syncCircle()}if(c&&userId){const o=await c.from("shop_owners").select("shop_slug").eq("user_id",userId).limit(1).maybeSingle();if(!o.error&&o.data?.shop_slug){nextOwner=o.data;const p=await c.from("shop_profiles").select("shop_slug,shop_name,profile_image_url").eq("shop_slug",o.data.shop_slug).maybeSingle();if(!p.error)nextShop=p.data||null}}writeOwnerCache(userId,nextOwner,nextShop);const nextKey=userId+"|"+(nextOwner?.shop_slug||"")+"|"+(nextShop?.profile_image_url||"")+"|"+(nextShop?.shop_name||"");const changed=nextKey!==lastOwnerKey;owner=nextOwner;shop=nextShop;lastOwnerKey=nextKey;syncCircle();if(changed||!silent)emit()}
function startLiveOwnership(){const c=client();if(!c||!session?.user)return;try{if(ownerChannel)c.removeChannel(ownerChannel);if(shopChannel)c.removeChannel(shopChannel)}catch(_){}try{ownerChannel=c.channel("m7-owner-live-"+session.user.id).on("postgres_changes",{event:"*",schema:"public",table:"shop_owners"},()=>setTimeout(()=>refresh(true),20)).subscribe();shopChannel=c.channel("m7-owner-shop-live-"+session.user.id).on("postgres_changes",{event:"*",schema:"public",table:"shop_profiles"},payload=>{const slug=String(payload?.new?.shop_slug||payload?.old?.shop_slug||"");if(!owner?.shop_slug||slug===owner.shop_slug)setTimeout(()=>refresh(true),20)}).subscribe()}catch(_){}if(pollTimer)clearInterval(pollTimer);pollTimer=setInterval(()=>{if(!document.hidden)refresh(true).catch(()=>{})},30000)}
function adminClient(){return window.Ma7alakAdminClient||null}function adminStatus(text,bad){const x=document.getElementById("m7oa4-status");if(x){x.textContent=text||"";x.style.color=bad?"#ff8585":"#efbd70"}}async function getAssignment(slug){const c=adminClient();if(!c)return null;const r=await c.rpc("ma7alak_admin_owner_for_shop",{p_shop_slug:slug});if(r.error)throw r.error;return Array.isArray(r.data)?r.data[0]||null:r.data}function avatarHtml(url,name){return url?`<img src="${esc(url)}" alt="">`:`<div style="width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#26211d;color:#efbd70;font-weight:900">${esc(initials(name))}</div>`}function updateOwnerBadge(slug,has){const b=document.querySelector('[data-owner-badge="'+CSS.escape(slug)+'"]');if(b){b.textContent=has?"Owner Assigned":"No Owner";b.classList.toggle("linked",!!has)}}
async function renderOwnerManager(slug,shopName){const root=document.getElementById("m7-owner-assign-v4");if(!root)return;root.dataset.slug=slug;root.dataset.shopName=shopName||slug;root.innerHTML=`<h3>Assign Shop Owner</h3><p>Search an existing ShoufHon account. The same Google login becomes the shop owner.</p><div id="m7oa4-current"><div class="m7oa4-empty">Checking current owner…</div></div><input id="m7oa4-search" class="m7oa4-search" type="search" autocomplete="off" placeholder="Search signed-in email or name…"><div id="m7oa4-results"></div><div id="m7oa4-status" class="m7oa4-status"></div>`;const current=document.getElementById("m7oa4-current");try{const a=await getAssignment(slug);if(a?.user_id){current.innerHTML=`<div class="m7oa4-current">${avatarHtml(a.avatar_url,a.display_name||a.email)}<div class="m7oa4-current-copy"><strong>${esc(a.display_name||a.email||"ShoufHon user")}</strong><small>${esc(a.email||"")} · Owner of /${esc(slug)}</small></div><button class="m7oa4-btn remove" id="m7oa4-remove" type="button">Remove owner</button></div>`;document.getElementById("m7oa4-remove").onclick=async e=>{if(!confirm("Remove shop ownership from this user? Their normal ShoufHon profile will be restored live."))return;e.currentTarget.disabled=true;adminStatus("Removing owner…");const r=await adminClient().rpc("ma7alak_admin_remove_shop_owner",{p_user_id:a.user_id});if(r.error){adminStatus(r.error.message,true);e.currentTarget.disabled=false;return}adminStatus("Ownership removed.");await renderOwnerManager(slug,shopName);updateOwnerBadge(slug,false)}}else current.innerHTML='<div class="m7oa4-empty">No owner assigned to this shop.</div>'}catch(err){current.innerHTML=`<div class="m7oa4-empty">${esc(err.message||"Could not load owner")}</div>`}const input=document.getElementById("m7oa4-search"),results=document.getElementById("m7oa4-results");let timer=null,seq=0;input.oninput=()=>{clearTimeout(timer);const q=input.value.trim(),my=++seq;if(q.length<2){results.innerHTML=q?'<div class="m7oa4-empty">Type at least 2 characters.</div>':'';return}timer=setTimeout(async()=>{results.innerHTML='<div class="m7oa4-empty">Searching users…</div>';const r=await adminClient().rpc("ma7alak_admin_search_users",{p_query:q});if(my!==seq)return;if(r.error){results.innerHTML=`<div class="m7oa4-empty">${esc(r.error.message)}</div>`;return}const rows=r.data||[];if(!rows.length){results.innerHTML='<div class="m7oa4-empty">No signed-in users found.</div>';return}results.innerHTML=rows.map(u=>`<div class="m7oa4-result">${avatarHtml(u.avatar_url,u.display_name||u.email)}<div class="m7oa4-result-copy"><strong>${esc(u.display_name||u.email||"ShoufHon user")}</strong><small>${esc(u.email||"")}${u.shop_slug?` · currently /${esc(u.shop_slug)}`:""}</small></div><button class="m7oa4-btn" type="button" data-assign="${esc(u.user_id)}">Assign</button></div>`).join("");results.querySelectorAll("[data-assign]").forEach(b=>b.onclick=async()=>{const uid=b.dataset.assign,row=rows.find(x=>String(x.user_id)===uid);if(!uid)return;const warning=row?.shop_slug?`\n\nThis user currently owns /${row.shop_slug}. That assignment will be replaced.`:"";if(!confirm(`Assign ${row?.email||"this user"} as owner of /${slug}?${warning}`))return;b.disabled=true;adminStatus("Assigning owner…");const a=await adminClient().rpc("ma7alak_admin_assign_shop_owner",{p_user_id:uid,p_shop_slug:slug});if(a.error){adminStatus(a.error.message,true);b.disabled=false;return}adminStatus("Owner assigned.");await renderOwnerManager(slug,shopName);updateOwnerBadge(slug,true)})},250)}}
function openUnifiedOwnerAdmin(card){const slug=String(card?.dataset?.slug||"").trim();if(!slug)return;const shopName=(card.querySelector(".ma-admin-shop-name")?.textContent||slug).trim(),ownerCard=document.getElementById("ma-admin-owner-card");if(!ownerCard)return;const slugInput=document.getElementById("ma-owner-shop-slug");if(slugInput)slugInput.value=slug;const n=document.getElementById("ma-owner-selected-name");if(n)n.textContent=shopName;const s=document.getElementById("ma-owner-selected-slug");if(s)s.textContent="/"+slug;["ma-admin-owner-form","ma-owner-existing-panel","ma-owner-loading"].forEach(id=>{const x=document.getElementById(id);if(x)x.hidden=true});let root=document.getElementById("m7-owner-assign-v4");if(!root){root=document.createElement("div");root.id="m7-owner-assign-v4";ownerCard.appendChild(root)}ownerCard.hidden=false;renderOwnerManager(slug,shopName).catch(e=>adminStatus(e.message,true));setTimeout(()=>ownerCard.scrollIntoView({behavior:"smooth",block:"start"}),30)}
async function decorateAdmin(){if(path()!=="/admin")return;ensureCss();for(let i=0;i<150&&!window.Ma7alakAdminClient;i++)await sleep(100);if(!adminClient())return;document.addEventListener("click",e=>{const b=e.target.closest?.('button[data-action="owner"]');if(!b)return;const card=b.closest(".ma-admin-shop-item");if(!card)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openUnifiedOwnerAdmin(card)},true);const hideLegacy=()=>{["ma-admin-owner-form","ma-owner-existing-panel","ma-owner-loading"].forEach(id=>{const x=document.getElementById(id);if(x)x.hidden=true});document.querySelectorAll('button[data-action="owner"]').forEach(b=>{if(b.textContent!=="Assign Owner")b.textContent="Assign Owner"})};hideLegacy();const list=document.getElementById("ma-admin-shop-list");if(list)new MutationObserver(hideLegacy).observe(list,{childList:true,subtree:true})}
function watchForHeader(){if(syncCircle())return;const root=document.documentElement;if(!root)return;const mo=new MutationObserver(()=>{if(document.getElementById("ma7alak-header-owner")){mo.disconnect();syncCircle()}});mo.observe(root,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),30000)}
async function boot(){
  ensureCss();
  removeOldLogin();
  window.addEventListener("message",event=>{
    const data=event?.data||{};
    if(data.type!=="MA7ALAK_OWNER_STATE_GET")return;
    sendOwnerState(event.source);
  });
  if(path()==="/admin"){decorateAdmin().catch(console.error);readyResolve();return}
  await refresh(false);
  startLiveOwnership();
  addEventListener("ma7alak:account-change",()=>setTimeout(async()=>{await refresh(false);startLiveOwnership();syncCircle()},0));
  let ownerWakeAt=0;
  const refreshOwnerOnWake=()=>{
    const now=Date.now();
    if(document.hidden||now-ownerWakeAt<900)return;
    ownerWakeAt=now;
    refresh(true).catch(()=>{});
  };
  addEventListener("ma7alak:page-wake",refreshOwnerOnWake);
  addEventListener("pageshow",refreshOwnerOnWake);
  addEventListener("focus",refreshOwnerOnWake);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshOwnerOnWake()});
  document.addEventListener("load",event=>{
    const frame=event.target;
    if(frame&&frame.tagName==="IFRAME")sendOwnerState(frame.contentWindow);
  },true);
  watchForHeader();
  broadcastOwnerState();
  readyResolve()
}
window.Ma7alakOwnerAuth={open:()=>window.Ma7alakAccount?.open?.(),close:()=>window.Ma7alakAccount?.close?.(),logout:()=>window.Ma7alakAccount?.logout?.(),refresh,get client(){return client()},get session(){return session},get user(){return session?.user||null},get owner(){return owner},get shop(){return shop},ready:()=>readyPromise};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
