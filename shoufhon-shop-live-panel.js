/* =========================================================
   SHOUFHON — SHOP LIVE PANEL V9
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

if(window.__SHOUFHON_SHOP_LIVE_PANEL_V9__)return;
window.__SHOUFHON_SHOP_LIVE_PANEL_V9__=true;

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
  if($("#m7slp-v9-css"))return;
  const st=document.createElement("style");
  st.id="m7slp-v9-css";
  st.textContent=`
*{box-sizing:border-box}
html,body{margin:0!important;padding:0!important;background:transparent!important;font-family:Arial,"Segoe UI",sans-serif}
body{overflow:hidden}
#m7-shop-live{
  --m7a:#d9a441;
  --m7status:#2fe47b;
  width:100%;
  min-width:0;
  padding:5px 0;
  color:#fff;
}
#m7-shop-live button{font:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.m7slp{
  position:relative;
  width:92%;
  max-width:560px;
  min-height:76px;
  margin:0 auto;
  overflow:hidden;
  border:1px solid color-mix(in srgb,var(--m7a) 58%,transparent);
  border-radius:18px;
  background:
    radial-gradient(circle at 0 0,color-mix(in srgb,var(--m7a) 11%,transparent),transparent 40%),
    linear-gradient(145deg,rgba(20,20,18,.985),rgba(7,8,8,.99));
  box-shadow:0 14px 34px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035);
}
.m7slp::after{
  content:"";
  position:absolute;
  inset:auto -42px -64px auto;
  width:150px;height:150px;border-radius:50%;
  border:1px solid color-mix(in srgb,var(--m7a) 12%,transparent);
  box-shadow:0 0 0 20px color-mix(in srgb,var(--m7a) 3%,transparent),0 0 0 42px color-mix(in srgb,var(--m7a) 2%,transparent);
  pointer-events:none;
}
.m7slp.loading{display:grid;place-items:center;color:rgba(255,255,255,.55);font-size:10px;font-weight:850;letter-spacing:.3px}
.m7slp-view{
  position:relative;z-index:2;
  width:100%;min-height:76px;
  display:grid;grid-template-columns:minmax(0,1fr) auto;
  align-items:center;gap:10px;
  padding:11px 13px;
  border:0;background:transparent;color:#fff;text-align:left;
}
.m7slp-view.can-open{cursor:pointer}
.m7slp-thumb{
  position:relative;width:76px;height:76px;border-radius:17px;
  overflow:hidden;display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--m7a) 55%,transparent);
  background:linear-gradient(145deg,#1d1d1d,#0d0d0d);
  box-shadow:0 7px 18px rgba(0,0,0,.26);
}
.m7slp-thumb img{width:100%;height:100%;object-fit:cover}
.m7slp-thumb-placeholder{font-size:22px;color:var(--m7a);font-weight:950}
.m7slp-live-chip{
  position:absolute;left:6px;top:6px;
  display:flex;align-items:center;gap:5px;height:22px;padding:0 7px;
  border-radius:999px;background:linear-gradient(135deg,#f52b52,#c91438);
  color:#fff;font-size:8px;font-weight:950;letter-spacing:.4px;
  box-shadow:0 5px 14px rgba(227,27,65,.25)
}
.m7slp-live-chip i{width:6px;height:6px;border-radius:50%;background:#64f39a;box-shadow:0 0 8px rgba(100,243,154,.9)}
.m7slp-copy{min-width:0}
.m7slp-kicker{display:flex;align-items:center;gap:6px;margin-bottom:4px;color:var(--m7a);font-size:8px;font-weight:950;letter-spacing:.7px;text-transform:uppercase}
.m7slp-kicker.live{color:var(--m7status)}
.m7slp-kicker i{width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 0 currentColor;animation:m7slpPulse 1.45s ease-out infinite}
@keyframes m7slpPulse{70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
.m7slp-title{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:15px;line-height:1.08;font-weight:950;letter-spacing:-.15px}
.m7slp-sub{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:4px;color:rgba(255,255,255,.58);font-size:9px;font-weight:700}
.m7slp-meta{display:flex;align-items:center;gap:6px;margin-top:7px;color:rgba(255,255,255,.48);font-size:8px;font-weight:850}
.m7slp-meta b{color:#f1c26f}
.m7slp-cta{
  min-width:70px;min-height:36px;padding:0 10px;border:1px solid color-mix(in srgb,var(--m7a) 48%,transparent);
  border-radius:13px;background:linear-gradient(135deg,color-mix(in srgb,var(--m7a) 88%,#fff 12%),color-mix(in srgb,var(--m7a) 82%,#8a5516 18%));
  color:#171008;font-size:10px;font-weight:950;white-space:nowrap;
  box-shadow:0 8px 18px rgba(0,0,0,.18);
  display:grid;place-items:center;align-self:center;line-height:1
}
.m7slp-cta.icon{min-width:36px;width:36px;height:36px;padding:0;border-radius:50%;font-size:19px;font-weight:700}
.m7slp-cta.edit{position:relative;z-index:4;cursor:pointer;background:linear-gradient(135deg,#f0c36d,#c98a31);color:#171008}
.m7slp-view.owner-active{cursor:pointer}
.m7slp-view.owner-active:active{transform:scale(.995)}

.m7slp-cta.live{border-color:rgba(255,80,110,.52);background:linear-gradient(135deg,#f5365b,#bd1637);color:#fff}
.m7slp-cta.ghost{background:rgba(255,255,255,.045);border-color:rgba(255,255,255,.10);color:rgba(255,255,255,.55);box-shadow:none}
.m7slp-owner{
  position:relative;z-index:2;
  padding:10px 11px 11px;
}
.m7slp-owner-tag{display:inline-flex;align-items:center;gap:5px;margin-bottom:8px;padding:4px 7px;border:1px solid color-mix(in srgb,var(--m7a) 34%,transparent);border-radius:999px;background:color-mix(in srgb,var(--m7a) 7%,transparent);color:#f0bf69;font-size:7.5px;font-weight:950;letter-spacing:.55px}
.m7slp-owner-main{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px}
.m7slp-owner-state{display:flex;align-items:flex-start;gap:8px;min-width:0}
.m7slp-owner-state>i{width:8px;height:8px;flex:0 0 8px;margin-top:3px;border-radius:50%;background:var(--m7status);box-shadow:0 0 9px color-mix(in srgb,var(--m7status) 55%,transparent)}
.m7slp-owner.is-live .m7slp-owner-state>i{background:#ff3154;box-shadow:0 0 9px rgba(255,49,84,.6)}
.m7slp-owner-state strong{display:block;color:#fff;font-size:14px;line-height:1.1}
.m7slp-owner-state small{display:block;margin-top:3px;color:rgba(255,255,255,.56);font-size:8px;line-height:1.25}
.m7slp-owner-actions{display:flex;gap:7px}
.m7slp-owner-actions button{min-height:40px;padding:0 12px;border:0;border-radius:12px;font-size:9.5px;font-weight:950;white-space:nowrap}
.m7slp-go{background:linear-gradient(135deg,#f33156,#bf1738);color:#fff;box-shadow:0 7px 18px rgba(223,31,67,.18)}
.m7slp-add{background:linear-gradient(135deg,#efc36f,#c98b31);color:#171008}
.m7slp-owner-actions button:disabled{opacity:.38}
.m7slp-owner-actions button.locked{opacity:.38;filter:saturate(.55);cursor:pointer}
.m7slp-owner-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;padding-top:7px;border-top:1px solid rgba(255,255,255,.065)}
.m7slp-slots{width:150px;max-width:48%;min-width:110px}
.m7slp-slots-line{display:flex;align-items:center;justify-content:space-between;gap:7px;color:rgba(255,255,255,.42);font-size:7px;font-weight:850}
.m7slp-slots-line b{color:#efbe69;font-size:9px}
.m7slp-progress{width:104px;max-width:100%;height:3px;margin-top:4px;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.075)}
.m7slp-progress i{display:block;height:100%;background:linear-gradient(90deg,#cf9136,#f2ca78)}
.m7slp-owner-badge{padding:4px 6px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:rgba(255,255,255,.025);color:rgba(255,255,255,.54);font-size:6.7px;font-weight:900;white-space:nowrap}
.m7slp-owner.is-live .m7slp-owner-badge{border-color:rgba(255,49,84,.24);background:rgba(255,49,84,.06);color:#ff8ca2}
@media(max-width:420px){
  .m7slp{width:94%;border-radius:17px}
  .m7slp-view{grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:10px 11px;min-height:72px}
  .m7slp-title{font-size:14px}.m7slp-sub{font-size:8px}.m7slp-meta{font-size:7px}
  .m7slp-cta{min-width:64px;min-height:34px;padding:0 9px;font-size:8.5px}.m7slp-cta.icon{min-width:34px;width:34px;height:34px;padding:0;font-size:18px}
  .m7slp-owner{padding:9px}
  .m7slp-owner-main{grid-template-columns:1fr}
  .m7slp-owner-actions{width:100%}.m7slp-owner-actions button{flex:1}
  .m7slp-owner-state strong{font-size:13px}
}
`;
  document.head.appendChild(st);
}

function setTheme(){
  const a=accent(),status=statusColor();
  root.style.setProperty("--m7a",a);
  root.style.setProperty("--m7status",status);
}

function viewerMarkup(){
  const offers=offerUsed();
  const name=shopName();
  const live=!!state.broadcastLive;
  const hasOffers=offers>0;
  const canOpen=live||hasOffers;
  let kicker,title,sub,meta,cta="",ctaClass="";
  if(live){
    kicker='<span class="m7slp-kicker live"><i></i> VIDEO LIVE</span>';
    title="Live now at "+name;
    sub=state.stream?.title||"Watch what is happening right now";
    meta=hasOffers?offers+" active "+(offers===1?"offer":"offers")+" during this live":"Broadcasting now";
    cta="Watch";
    ctaClass="live";
  }else if(hasOffers){
    kicker='<span class="m7slp-kicker"><i></i> HAPPENING NOW</span>';
    title=offers===1?"1 live offer / update":offers+" live offers / updates";
    sub="See what "+name+" has happening right now";
    meta="Tap to see details";
    cta="View";
  }else{
    kicker='<span class="m7slp-kicker">○ CURRENT STATUS</span>';
    title="Nothing live right now";
    sub="Check back soon for offers, events and live broadcasts";
    meta="No active offers or broadcast";
  }
  return '<div class="m7slp-view '+(canOpen?"can-open":"")+'" '+(canOpen?'data-action="primary" role="button" tabindex="0"':'aria-disabled="true"')+'>'+
    '<span class="m7slp-copy">'+kicker+'<strong class="m7slp-title">'+esc(title)+'</strong><small class="m7slp-sub">'+esc(sub)+'</small><span class="m7slp-meta">'+esc(meta)+'</span></span>'+
    (canOpen?'<span class="m7slp-cta '+ctaClass+'">'+esc(cta)+'</span>':"")+
  '</div>';
}
function ownerActiveMarkup(){
  const live=!!state.broadcastLive;
  const offers=offerUsed();
  const img=imageUrl();
  const name=shopName();
  const kicker=live
    ? '<span class="m7slp-kicker live"><i></i> OWNER · VIDEO LIVE</span>'
    : '<span class="m7slp-kicker"><i></i> OWNER · HAPPENING NOW</span>';
  const title=live
    ? "You are live at "+name
    : (offers===1?"1 active offer / update":offers+" active offers / updates");
  const sub=live
    ? "Tap the card to resume your broadcast"
    : "Tap the card to preview exactly what visitors see";
  const meta=live
    ? (offers?offers+" active "+(offers===1?"offer":"offers")+" · Edit to manage content":"Edit to manage your live content")
    : "Edit text, media, timing or end an update";
  const chip=live?'<span class="m7slp-live-chip"><i></i> LIVE</span>':"";
  return '<div class="m7slp-view can-open owner-active" data-action="primary" role="button" tabindex="0">'+
    '<span class="m7slp-thumb">'+(img?'<img src="'+esc(img)+'" alt="">':'<span class="m7slp-thumb-placeholder">S</span>')+chip+'</span>'+
    '<span class="m7slp-copy">'+kicker+'<strong class="m7slp-title">'+esc(title)+'</strong><small class="m7slp-sub">'+esc(sub)+'</small><span class="m7slp-meta">'+esc(meta)+'</span></span>'+
    '<button class="m7slp-cta edit" type="button" data-action="manage">Edit</button>'+
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
  const title="Ready to go live";
  const sub=(canVideo||!offerLocked)?"Start a broadcast or publish an offer.":"Premium access is required for Live features.";
  const slotText=offersEnabled()?(used+" / "+lim):"OFF";

  return '<div class="m7slp-owner">'+
    '<div class="m7slp-owner-tag">♛ SHOP OWNER CONTROLS</div>'+
    '<div class="m7slp-owner-main">'+
      '<div class="m7slp-owner-state"><i></i><div><strong>'+esc(title)+'</strong><small>'+esc(sub)+'</small></div></div>'+
      '<div class="m7slp-owner-actions">'+
        '<button class="m7slp-go '+(canVideo?"":"locked")+'" type="button" data-action="go">'+(canVideo?"▣ Go Live":"🔒 Go Live")+'</button>'+
        '<button class="m7slp-add '+(offerLocked?"locked":"")+'" type="button" data-action="add" '+(offerFull?"disabled":"")+'>'+(offerFull?"Slots Full":(offerLocked?"🔒 Add Offer":"＋ Add Offer"))+'</button>'+
      '</div>'+
    '</div>'+
    '<div class="m7slp-owner-bottom">'+
      '<div class="m7slp-slots"><div class="m7slp-slots-line"><span>Offer slots</span><b>'+esc(slotText)+'</b></div><div class="m7slp-progress"><i style="width:'+pct+'%"></i></div></div>'+
      '<div class="m7slp-owner-badge">'+(canVideo?"○ Broadcast ready":"○ Video Live off")+'</div>'+
    '</div>'+
  '</div>';
}
function render(){
  if(!root)return;
  setTheme();
  if(!known){
    root.innerHTML='<section class="m7slp loading">Checking live status…</section>';
    return;
  }
  const html='<section class="m7slp">'+(state.owner?ownerMarkup():viewerMarkup())+'</section>';
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
function bind(){
  const primaryEl=$('[data-action="primary"]',root);
  primaryEl?.addEventListener("click",e=>{
    if(e.target.closest('[data-action="manage"]'))return;
    primary();
  });
  primaryEl?.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){e.preventDefault();primary()}
  });
  $('[data-action="manage"]',root)?.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    post("MA7ALAK_LIVE_OWNER_MANAGE");
  });
  $('[data-action="go"]',root)?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();post("MA7ALAK_LIVE_VIDEO_GO")});
  $('[data-action="add"]',root)?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();post("MA7ALAK_LIVE_OFFERS_CREATE")});
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