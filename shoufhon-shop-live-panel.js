/* =========================================================
   SHOUFHON — SHOP LIVE PANEL V10
   Premium compact shop-page Live / Offers panel.

   Modes:
   - Guest / viewer: offline, offers-only, or video-live CTA
   - Shop owner: direct Go Live / Resume + Add Offer controls
   - Broadcast and offers are separate states
   - No Supabase client inside the Hostinger iframe
   - Uses the existing top-level Live & Offers bridge
========================================================= */
(function(){
"use strict";

if(window.__SHOUFHON_SHOP_LIVE_PANEL_V10__)return;
window.__SHOUFHON_SHOP_LIVE_PANEL_V10__=true;

const ROOT_ID="m7-shop-live";
const CONTEXT_SRC="https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@940a075bff01ce379015e4a7cba8e3e27f3ded9c/shoufhon-shop-context.js";
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

let root=null;
let slug="";
let known=false;
let directOwnerKnown=false;
let directOwner=false;
let directOwnerSlug="";
let state={
  owner:false,
  broadcastLive:false,
  stream:null,
  items:[],
  offerCount:0,
  entitlement:null,
  directoryOptions:{},
  shop:{}
};

function safeHex(v){
  const x=String(v||"").trim();
  return /^#[0-9a-f]{6}$/i.test(x)?x:"";
}
function mixAlpha(hex,alpha){
  const h=safeHex(hex)||"#d9a441";
  const n=parseInt(h.slice(1),16);
  const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return "rgba("+r+","+g+","+b+","+alpha+")";
}
function accent(){
  const o=state.directoryOptions||{};
  return safeHex(o.live_accent_color)||safeHex(o.story_color)||safeHex(o.card_color)||"#d9a441";
}
function statusColor(){
  const o=state.directoryOptions||{};
  return safeHex(o.live_status_color)||"#2fe47b";
}
function firstOffer(){
  return Array.isArray(state.items)&&state.items.length?state.items[0]:null;
}
function imageUrl(){
  return String(
    state.stream?.media_url||
    state.stream?.profile_image_url||
    firstOffer()?.media_url||
    firstOffer()?.profile_image_url||
    state.shop?.profile_image_url||
    ""
  );
}
function shopName(){
  return String(
    state.shop?.name||
    state.stream?.shop_name||
    firstOffer()?.shop_name||
    slug||
    "Shop"
  );
}
function offerLimit(){
  return Math.max(0,Number(state.entitlement?.active_limit||0));
}
function offersEnabled(){
  return !!state.entitlement?.enabled;
}
function videoEnabled(){
  return !!state.entitlement?.video_live_enabled;
}
function offerUsed(){
  return Math.max(0,Number(state.offerCount||state.items?.length||0));
}

function ensureCss(){
  if($("#m7slp-v10-css"))return;
  const st=document.createElement("style");
  st.id="m7slp-v10-css";
  st.textContent=`
*{box-sizing:border-box}
html,body{
  margin:0!important;
  padding:0!important;
  background:transparent!important;
  font-family:Arial,"Segoe UI",sans-serif
}
body{overflow:hidden}

#m7-shop-live{
  --m7a:#d9a441;
  --m7status:#2fe47b;
  --m7surface:#11100e;
  --m7edge:#d9a441;
  --m7radius:24px;
  width:100%;
  min-width:0;
  padding:0;
  color:#fff;
}

#m7-shop-live button{
  font:inherit;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation
}

/* Same visual language as the unified profile shell above. */
.m7slp{
  position:relative;
  width:92%;
  max-width:560px;
  margin:0 auto;
  overflow:hidden;
  border:1px solid color-mix(in srgb,var(--m7edge) 72%,transparent);
  border-radius:clamp(15px,var(--m7radius),28px);
  background:
    radial-gradient(circle at 7% 0%,color-mix(in srgb,var(--m7a) 10%,transparent),transparent 37%),
    linear-gradient(160deg,color-mix(in srgb,var(--m7surface) 97%,#17120c 3%),color-mix(in srgb,var(--m7surface) 95%,#050505 5%));
  box-shadow:
    0 12px 28px rgba(0,0,0,.23),
    inset 0 1px 0 rgba(255,255,255,.035);
}

.m7slp:before{
  content:"";
  position:absolute;
  z-index:1;
  left:18px;
  right:18px;
  top:0;
  height:1px;
  background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--m7a) 86%,#fff 14%),transparent);
  opacity:.78;
  pointer-events:none
}

.m7slp:after{
  content:"";
  position:absolute;
  z-index:0;
  width:128px;
  height:128px;
  right:-76px;
  bottom:-82px;
  border-radius:50%;
  border:1px solid color-mix(in srgb,var(--m7a) 9%,transparent);
  box-shadow:0 0 0 20px color-mix(in srgb,var(--m7a) 2%,transparent);
  pointer-events:none
}

.m7slp.loading{
  min-height:48px;
  display:grid;
  place-items:center;
  color:rgba(255,255,255,.48);
  font-size:10px;
  font-weight:850
}

/* ---------------------------------------------------------
   VISITOR — nothing active: tiny extension of the profile.
--------------------------------------------------------- */
.m7slp-idle{
  position:relative;
  z-index:2;
  min-height:48px;
  display:grid;
  grid-template-columns:auto minmax(0,1fr);
  gap:9px;
  align-items:center;
  padding:8px 12px
}
.m7slp-idle>i{
  width:8px;height:8px;border-radius:50%;
  background:rgba(255,255,255,.18);
  box-shadow:0 0 0 4px rgba(255,255,255,.025)
}
.m7slp-idle-copy{min-width:0}
.m7slp-idle strong{
  display:block;
  color:rgba(255,255,255,.82);
  font-size:11.5px;
  line-height:1.15
}
.m7slp-idle small{
  display:block;
  margin-top:2px;
  color:rgba(255,255,255,.38);
  font-size:9px;
  line-height:1.3
}

/* ---------------------------------------------------------
   ACTIVE VIEWER / OWNER SUMMARY
--------------------------------------------------------- */
.m7slp-view{
  position:relative;
  z-index:2;
  width:100%;
  min-height:68px;
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  gap:9px;
  padding:9px 11px;
  border:0;
  background:transparent;
  color:#fff;
  text-align:left
}
.m7slp-view.can-open{cursor:pointer}
.m7slp-view:active{transform:scale(.997)}

.m7slp-copy{min-width:0}
.m7slp-kicker{
  display:flex;
  align-items:center;
  gap:5px;
  margin-bottom:3px;
  color:var(--m7a);
  font-size:8px;
  font-weight:950;
  letter-spacing:.65px;
  text-transform:uppercase
}
.m7slp-kicker.live{color:#ff6078}
.m7slp-kicker i{
  width:6px;height:6px;border-radius:50%;
  background:currentColor;
  animation:m7slpPulse 1.45s ease-out infinite
}
@keyframes m7slpPulse{
  70%{box-shadow:0 0 0 7px transparent}
  100%{box-shadow:0 0 0 0 transparent}
}
.m7slp-title{
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:#fff;
  font-size:14px;
  line-height:1.12;
  font-weight:950;
  letter-spacing:-.1px
}
.m7slp-sub{
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  margin-top:3px;
  color:rgba(255,255,255,.54);
  font-size:9.5px;
  font-weight:700
}
.m7slp-meta{
  display:flex;
  align-items:center;
  gap:5px;
  margin-top:5px;
  color:rgba(255,255,255,.38);
  font-size:8.5px;
  font-weight:850
}
.m7slp-meta b{color:#f1c26f}

.m7slp-cta{
  min-width:62px;
  min-height:32px;
  padding:0 9px;
  border:1px solid color-mix(in srgb,var(--m7a) 48%,transparent);
  border-radius:11px;
  background:linear-gradient(135deg,color-mix(in srgb,var(--m7a) 88%,#fff 12%),color-mix(in srgb,var(--m7a) 82%,#8a5516 18%));
  color:#171008;
  font-size:9.5px;
  font-weight:950;
  white-space:nowrap;
  box-shadow:0 7px 16px rgba(0,0,0,.17);
  display:grid;
  place-items:center
}
.m7slp-cta.live{
  border-color:rgba(255,80,110,.52);
  background:linear-gradient(135deg,#f5365b,#bd1637);
  color:#fff
}

/* ---------------------------------------------------------
   OWNER — compact, integrated profile controls.
--------------------------------------------------------- */
.m7slp-owner{
  position:relative;
  z-index:2;
  padding:8px 9px 9px
}
.m7slp-owner-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  margin-bottom:7px
}
.m7slp-owner-tag{
  display:inline-flex;
  align-items:center;
  gap:5px;
  padding:3px 6px;
  border:1px solid color-mix(in srgb,var(--m7a) 28%,transparent);
  border-radius:999px;
  background:color-mix(in srgb,var(--m7a) 6%,transparent);
  color:#edbd68;
  font-size:7.5px;
  font-weight:950;
  letter-spacing:.55px
}
.m7slp-owner-mini{
  color:rgba(255,255,255,.35);
  font-size:7.75px;
  font-weight:850;
  white-space:nowrap
}
.m7slp-owner-main{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  gap:9px
}
.m7slp-owner-state{
  display:flex;
  align-items:flex-start;
  gap:7px;
  min-width:0
}
.m7slp-owner-state>i{
  width:7px;height:7px;flex:0 0 7px;
  margin-top:3px;
  border-radius:50%;
  background:var(--m7status);
  box-shadow:0 0 8px color-mix(in srgb,var(--m7status) 55%,transparent)
}
.m7slp-owner-state strong{
  display:block;
  color:#fff;
  font-size:14px;
  line-height:1.15
}
.m7slp-owner-state small{
  display:block;
  margin-top:3px;
  color:rgba(255,255,255,.47);
  font-size:9px;
  line-height:1.35
}

.m7slp-owner-actions,
.m7slp-owner-active-actions{
  display:flex;
  align-items:center;
  gap:5px
}
.m7slp-owner-actions button,
.m7slp-owner-active-actions button{
  min-height:34px;
  padding:0 9px;
  border:0;
  border-radius:10px;
  font-size:9px;
  font-weight:950;
  white-space:nowrap;
  cursor:pointer
}
.m7slp-go,
.m7slp-owner-live{
  background:linear-gradient(135deg,#ef234b,#bd1738);
  color:#fff;
  box-shadow:0 6px 15px rgba(223,31,67,.17)
}
.m7slp-add,
.m7slp-owner-add,
.m7slp-owner-edit{
  background:linear-gradient(135deg,#efc36f,#c98b31);
  color:#171008
}
.m7slp-owner-manage{
  background:rgba(255,255,255,.055);
  color:rgba(255,255,255,.78);
  border:1px solid rgba(255,255,255,.09)!important
}
.m7slp-owner-actions button:disabled,
.m7slp-owner-active-actions button:disabled{opacity:.34}
.m7slp-owner-actions button.locked,
.m7slp-owner-active-actions button.locked{
  opacity:.42;
  filter:saturate(.55)
}

.m7slp-owner-bottom{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  margin-top:6px;
  padding-top:6px;
  border-top:1px solid rgba(255,255,255,.055)
}
.m7slp-slots-line{
  display:flex;
  align-items:center;
  gap:5px;
  color:rgba(255,255,255,.36);
  font-size:8.5px;
  font-weight:850
}
.m7slp-slots-line b{
  color:#efbe69;
  font-size:9.5px
}
.m7slp-progress{
  width:82px;
  height:2px;
  margin-top:3px;
  border-radius:99px;
  overflow:hidden;
  background:rgba(255,255,255,.065)
}
.m7slp-progress i{
  display:block;
  height:100%;
  background:linear-gradient(90deg,#cf9136,#f2ca78)
}
.m7slp-owner-badge{
  color:rgba(255,255,255,.34);
  font-size:7.5px;
  font-weight:850;
  white-space:nowrap
}

/* Active owner card: state on left, quick actions on right. */
.m7slp-view.owner-active{min-height:72px}
.m7slp-view.owner-active .m7slp-title{font-size:12.5px}

.m7slp-action-pressed{
  animation:m7slpTap .3s cubic-bezier(.2,.85,.3,1)!important;
  pointer-events:none
}
@keyframes m7slpTap{
  0%{transform:scale(1)}
  42%{transform:scale(.91)}
  76%{transform:scale(1.035)}
  100%{transform:scale(1)}
}

@media(max-width:420px){
  .m7slp{width:94%;border-radius:17px}
  .m7slp-view{gap:7px;padding:8px 9px;min-height:64px}
  .m7slp-title{font-size:13.5px}
  .m7slp-sub{font-size:9px}
  .m7slp-meta{font-size:8px}
  .m7slp-cta{min-width:58px;min-height:32px;padding:0 8px;font-size:9px}

  .m7slp-owner{padding:7px 8px 8px}
  .m7slp-owner-main{grid-template-columns:1fr}
  .m7slp-owner-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}
  .m7slp-owner-actions button{width:100%;min-height:35px}
  .m7slp-owner-state strong{font-size:13.5px}
  .m7slp-owner-state small{font-size:8.75px}
  .m7slp-slots-line{font-size:8.25px}
  .m7slp-slots-line b{font-size:9.25px}
  .m7slp-owner-mini{font-size:7.5px}
  .m7slp-owner-badge{font-size:7.25px}

  .m7slp-view.owner-active{
    grid-template-columns:1fr;
    gap:7px
  }
  .m7slp-owner-active-actions{
    width:100%;
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr))
  }
  .m7slp-owner-active-actions button{
    min-width:0;
    width:100%;
    padding:0 5px;
    font-size:8.4px
  }
}
`;
  document.head.appendChild(st);
}

function setTheme(){
  const o=state.directoryOptions||{};
  const a=accent();
  const status=statusColor();
  const surface=safeHex(o.profile_shell_bg_color)||"#11100e";
  const edge=safeHex(o.profile_shell_border_color)||a;
  const rawRadius=Number(o.profile_shell_radius);
  const radius=Number.isFinite(rawRadius)
    ?Math.max(15,Math.min(28,rawRadius))
    :22;

  root.style.setProperty("--m7a",a);
  root.style.setProperty("--m7status",status);
  root.style.setProperty("--m7surface",surface);
  root.style.setProperty("--m7edge",edge);
  root.style.setProperty("--m7radius",radius+"px");
}

function viewerMarkup(){
  const offers=offerUsed();
  const name=shopName();
  const live=!!state.broadcastLive;
  const hasOffers=offers>0;
  const canOpen=live||hasOffers;

  if(!canOpen){
    return '<div class="m7slp-idle" aria-disabled="true">'+
      '<i></i>'+
      '<span class="m7slp-idle-copy">'+
        '<strong>Nothing happening right now</strong>'+
        '<small>Live broadcasts and offers from '+esc(name)+' will appear here.</small>'+
      '</span>'+
    '</div>';
  }

  let kicker,title,sub,meta,cta="",ctaClass="";

  if(live){
    kicker='<span class="m7slp-kicker live"><i></i> LIVE NOW</span>';
    title="Live at "+name;
    sub=state.stream?.title||"Watch what is happening right now";
    meta=hasOffers
      ?offers+" active "+(offers===1?"offer":"offers")+" too"
      :"Broadcasting now";
    cta="Watch";
    ctaClass="live";
  }else{
    kicker='<span class="m7slp-kicker"><i></i> HAPPENING NOW</span>';
    title=offers===1
      ?"1 active offer at "+name
      :offers+" active offers at "+name;
    sub="Tap to see what is happening right now";
    meta="Open details";
    cta="View";
  }

  return '<div class="m7slp-view can-open" data-action="primary" role="button" tabindex="0">'+
    '<span class="m7slp-copy">'+
      kicker+
      '<strong class="m7slp-title">'+esc(title)+'</strong>'+
      '<small class="m7slp-sub">'+esc(sub)+'</small>'+
      '<span class="m7slp-meta">'+esc(meta)+'</span>'+
    '</span>'+
    '<span class="m7slp-cta '+ctaClass+'">'+esc(cta)+'</span>'+
  '</div>';
}

function ownerActiveMarkup(){
  const live=!!state.broadcastLive;
  const offers=offerUsed();
  const name=shopName();
  const canVideo=videoEnabled();
  const lim=offerLimit();
  const offerLocked=!offersEnabled()||lim<=0;
  const offerFull=!offerLocked&&offers>=lim;
  const firstOffer=(state.items||[]).find(x=>x&&x.id!=null)||null;

  const kicker=live
    ?'<span class="m7slp-kicker live"><i></i> OWNER · LIVE NOW</span>'
    :'<span class="m7slp-kicker"><i></i> OWNER · HAPPENING NOW</span>';

  const title=live
    ?("You are live at "+name)
    :(offers===1?"1 active offer":" "+offers+" active offers");

  const sub=live
    ?"Tap the card to resume the live viewer"
    :"Tap the card to preview what visitors see";

  const meta=live
    ?(offers?offers+" offer"+(offers===1?"":"s")+" also active":"Broadcast active")
    :"Offer controls are live";

  const liveLabel=live
    ?"Resume"
    :(canVideo?"Go Live":"🔒 Live");

  return '<div class="m7slp-view can-open owner-active" data-action="primary" role="button" tabindex="0">'+
    '<span class="m7slp-copy">'+
      kicker+
      '<strong class="m7slp-title">'+esc(title)+'</strong>'+
      '<small class="m7slp-sub">'+esc(sub)+'</small>'+
      '<span class="m7slp-meta">'+esc(meta)+'</span>'+
    '</span>'+
    '<span class="m7slp-owner-active-actions">'+
      '<button class="m7slp-owner-live '+(!canVideo&&!live?"locked":"")+'" type="button" data-action="go">'+esc(liveLabel)+'</button>'+
      '<button class="m7slp-owner-add '+(offerLocked?"locked":"")+'" type="button" data-action="add" '+(offerFull?"disabled":"")+'>'+(offerFull?"Full":(offerLocked?"🔒 Offer":"＋ Offer"))+'</button>'+
      '<button class="m7slp-owner-manage" type="button" data-action="manage" data-offer-id="'+esc(firstOffer?.id||"")+'">Manage</button>'+
    '</span>'+
  '</div>';
}

function ownerMarkup(){
  const live=!!state.broadcastLive;
  const used=offerUsed();

  if(live||used>0)return ownerActiveMarkup();

  const lim=offerLimit();
  const pct=lim>0?Math.min(100,used/lim*100):0;
  const canVideo=videoEnabled();
  const offerLocked=!offersEnabled()||lim<=0;
  const offerFull=!offerLocked&&used>=lim;
  const slotText=offersEnabled()?(used+" / "+lim):"OFF";

  return '<div class="m7slp-owner">'+
    '<div class="m7slp-owner-top">'+
      '<div class="m7slp-owner-tag">♛ SHOP OWNER</div>'+
      '<div class="m7slp-owner-mini">Profile activity controls</div>'+
    '</div>'+
    '<div class="m7slp-owner-main">'+
      '<div class="m7slp-owner-state">'+
        '<i></i>'+
        '<div>'+
          '<strong>Ready when you are</strong>'+
          '<small>Start a live broadcast or publish an offer.</small>'+
        '</div>'+
      '</div>'+
      '<div class="m7slp-owner-actions">'+
        '<button class="m7slp-go '+(canVideo?"":"locked")+'" type="button" data-action="go">'+(canVideo?"● Go Live":"🔒 Go Live")+'</button>'+
        '<button class="m7slp-add '+(offerLocked?"locked":"")+'" type="button" data-action="add" '+(offerFull?"disabled":"")+'>'+(offerFull?"Slots Full":(offerLocked?"🔒 Add Offer":"＋ Add Offer"))+'</button>'+
      '</div>'+
    '</div>'+
    '<div class="m7slp-owner-bottom">'+
      '<div>'+
        '<div class="m7slp-slots-line"><span>Offer slots</span><b>'+esc(slotText)+'</b></div>'+
        '<div class="m7slp-progress"><i style="width:'+pct+'%"></i></div>'+
      '</div>'+
      '<div class="m7slp-owner-badge">'+(canVideo?"Broadcast ready":"Video Live off")+'</div>'+
    '</div>'+
  '</div>';
}

function render(){
  if(!root)return;
  setTheme();

  if(!known){
    root.innerHTML='<section class="m7slp loading">Checking activity…</section>';
    return;
  }

  const active=!!state.broadcastLive||offerUsed()>0;
  const mode=state.owner
    ?(active?" owner-active-shell":" owner-idle-shell")
    :(active?" viewer-active-shell":" viewer-idle-shell");

  const html='<section class="m7slp'+mode+'">'+
    (state.owner?ownerMarkup():viewerMarkup())+
  '</section>';

  if(root.innerHTML===html)return;

  root.innerHTML=html;
  bind();
}

function post(type,extra){
  try{parent.postMessage(Object.assign({type,shopSlug:slug},extra||{}),"*")}catch(_){}
}
function primary(){
  if(state.broadcastLive)return post("MA7ALAK_LIVE_VIDEO_OPEN_SHOP");
  if(offerUsed()>0)return post("MA7ALAK_LIVE_OFFERS_OPEN_SHOP");
}
const actionBusy=new Set();
function pressAction(button,label){
  if(!button)return false;
  const key=String(button.dataset.action||"action");
  if(actionBusy.has(key))return false;
  actionBusy.add(key);
  const old=button.textContent||"";
  button.classList.add("m7slp-action-pressed");
  if(label)button.textContent=label;
  setTimeout(()=>{
    actionBusy.delete(key);
    if(button?.isConnected){button.classList.remove("m7slp-action-pressed");if(label)button.textContent=old}
  },900);
  return true;
}
function bind(){
  const primaryEl=$('[data-action="primary"]',root);
  primaryEl?.addEventListener("click",e=>{
    if(e.target.closest('[data-action="manage"],[data-action="go"]'))return;
    primary();
  });
  primaryEl?.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){e.preventDefault();primary()}
  });

  $('[data-action="manage"]',root)?.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    const b=e.currentTarget;
    if(!pressAction(b,"Opening…"))return;
    const offerId=String(b.dataset.offerId||"").trim();
    if(offerId)post("MA7ALAK_LIVE_OFFERS_EDIT",{id:offerId});
    else post("MA7ALAK_LIVE_OWNER_MANAGE");
  });

  $('[data-action="go"]',root)?.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    const b=e.currentTarget;
    if(!pressAction(b,"Opening…"))return;
    post("MA7ALAK_LIVE_VIDEO_GO");
  });

  $('[data-action="add"]',root)?.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    const b=e.currentTarget;
    if(!pressAction(b,"Opening…"))return;
    post("MA7ALAK_LIVE_OFFERS_CREATE");
  });
}

let lastStateRequestAt=0;
function requestState(){
  if(!slug)return;
  const now=Date.now();
  if(now-lastStateRequestAt<250)return;
  lastStateRequestAt=now;
  post("MA7ALAK_LIVE_OFFERS_GET");

  /* Ask for owner cosmetics once in a while, but never use it as access truth. */
  if(!directOwnerKnown||now%5000<300)post("MA7ALAK_OWNER_STATE_GET");
}

function onState(data){
  const incoming=String(data.shopSlug||"").trim().toLowerCase();
  if(!incoming||incoming!==slug)return;
  known=true;
  state={
    ...state,
    owner:!!data.owner,
    broadcastLive:!!data.broadcastLive,
    stream:data.stream&&typeof data.stream==="object"?data.stream:null,
    items:Array.isArray(data.items)?data.items:[],
    offerCount:Number.isFinite(Number(data.offerCount))?Number(data.offerCount):(Array.isArray(data.items)?data.items.length:0),
    entitlement:data.entitlement&&typeof data.entitlement==="object"?data.entitlement:null,
    directoryOptions:data.directoryOptions&&typeof data.directoryOptions==="object"?data.directoryOptions:{},
    shop:data.shop&&typeof data.shop==="object"?data.shop:{}
  };
  render();
}

async function loadContext(){
  if(window.ShoufHonShopContextClient)return true;
  await new Promise(resolve=>{
    const old=[...document.scripts].find(x=>String(x.src||"").includes("shoufhon-shop-context.js"));
    if(old){
      if(window.ShoufHonShopContextClient)return resolve();
      old.addEventListener("load",resolve,{once:true});
      old.addEventListener("error",resolve,{once:true});
      setTimeout(resolve,1100);
      return;
    }
    const s=document.createElement("script");
    s.src=CONTEXT_SRC;s.async=true;s.onload=resolve;s.onerror=resolve;
    document.head.appendChild(s);
    setTimeout(resolve,1400);
  });
  return !!window.ShoufHonShopContextClient;
}

async function resolveSlug(){
  const explicit=String(root.getAttribute("data-shop-slug")||"").trim().toLowerCase();
  if(explicit)return explicit;
  await loadContext();
  if(window.ShoufHonShopContextClient){
    try{
      return await window.ShoufHonShopContextClient.resolve({
        explicit:"",
        fallback:function(){return window.ShoufHonShopContextClient.detectPageSlug();},
        timeout:1400
      });
    }catch(_){}
  }
  return "";
}

async function boot(){
  root=document.getElementById(ROOT_ID)||document.querySelector("[data-shoufhon-shop-live]");
  if(!root)return;
  ensureCss();render();
  slug=String(await resolveSlug()||"").trim().toLowerCase();
  if(!slug){
    root.innerHTML='<section class="m7slp loading">Shop context unavailable.</section>';
    return;
  }
  requestState();
  [180,500,1000,1900,3400].forEach(ms=>setTimeout(requestState,ms));
  setInterval(()=>{if(!document.hidden)requestState()},15000);
}

window.addEventListener("message",event=>{
  const d=event.data||{};
  if(d.type==="MA7ALAK_LIVE_OFFERS_STATE"){onState(d);return}
  if(d.type==="MA7ALAK_PAGE_WAKE"){requestState();return}
  if(d.type==="MA7ALAK_OWNER_STATE"){
    directOwnerKnown=true;
    directOwner=!!d.isOwner;
    directOwnerSlug=String(d.shopSlug||"").trim().toLowerCase();

    /* Use this message only for identity cosmetics. Ownership/access itself
       comes from MA7ALAK_LIVE_OFFERS_STATE so the panel cannot flash OFF/LOCKED
       while header auth is still restoring after back/forward navigation. */
    if(d.shop&&typeof d.shop==="object"){
      state.shop={
        ...state.shop,
        name:String(d.shop.shop_name||d.shop.arabic_name||state.shop?.name||""),
        profile_image_url:String(d.shop.profile_image_url||state.shop?.profile_image_url||""),
        shop_url:String(d.shop.shop_url||state.shop?.shop_url||"")
      };
    }
    post("MA7ALAK_LIVE_OFFERS_GET");
  }
  if(d.type==="MA7ALAK_DESIGN_PREVIEW"){
    const ds=String(d.shop_slug||d.shopSlug||"").trim().toLowerCase();
    if(ds!==slug)return;
    state.directoryOptions=d.directory_options&&typeof d.directory_options==="object"?d.directory_options:{};
    render();
  }
});
window.addEventListener("pageshow",requestState);
window.addEventListener("focus",requestState);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")requestState()});

boot().catch(err=>console.warn("ShoufHon shop Live panel:",err));
})();