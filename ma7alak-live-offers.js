/* SHOUFHON LIVE & OFFERS V5 — multi-media galleries + video sound + owner media manager */
(function(){
"use strict";if(window.__M7_LIVE_V5__)return;window.__M7_LIVE_V5__=1;
const BUCKET="live-offers",SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";let c,session,ownerSlug="",ent=null,items=[],ownerItems=[],channel,refreshing=false,viewId=null,lockedY=0,lastRenderSignature="",profileOptions=new Map();
const $=(s,r=document)=>r.querySelector(s),$all=(s,r=document)=>[...r.querySelectorAll(s)],sleep=m=>new Promise(r=>setTimeout(r,m)),esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function resolveClient(){
  const account=window.Ma7alakAccount?.client||null;
  if(account)return account;
  const shared=
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
    window.Ma7alakSupabaseBootstrap?.client||
    window.__MA7ALAK_HOME_FEED_FALLBACK_SUPABASE__||
    window.__MA7ALAK_LIVE_FALLBACK_SUPABASE__||
    null;
  if(shared)return shared;
  if(window.supabase&&typeof window.supabase.createClient==="function"){
    try{
      window.__MA7ALAK_LIVE_FALLBACK_SUPABASE__=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      return window.__MA7ALAK_LIVE_FALLBACK_SUPABASE__;
    }catch(err){
      console.warn("SHOUFHON Live & Offers: Supabase client creation delayed",err);
    }
  }
  return null;
}
const meta=t=>({offer:["🏷️","OFFER"],happening:["🟢","HAPPENING NOW"],arrival:["✨","NEW ARRIVAL"],event:["📅","EVENT"]}[t]||["⚡","LIVE"]),money=v=>v==null||v===""?"":`${Number(v).toFixed(Number(v)%1?2:0)}`;


const LIVE_CACHE_KEY="ma7alak-live-public-cache-v1";
function activeCachedItems(value){
  const now=Date.now();
  return (Array.isArray(value)?value:[]).filter(x=>{
    if(!x||String(x.status||"active")!=="active")return false;
    const end=new Date(x.ends_at).getTime();
    return Number.isFinite(end)&&end>now;
  });
}
function readLiveCache(){
  try{
    const raw=localStorage.getItem(LIVE_CACHE_KEY);
    if(!raw)return[];
    const parsed=JSON.parse(raw);
    const cached=activeCachedItems(parsed&&parsed.items);
    if(!cached.length&&Array.isArray(parsed&&parsed.items)&&(parsed.items||[]).length){
      localStorage.removeItem(LIVE_CACHE_KEY);
    }
    return cached;
  }catch(_){
    return[];
  }
}
function writeLiveCache(list){
  try{
    const active=activeCachedItems(list);
    if(active.length){
      localStorage.setItem(LIVE_CACHE_KEY,JSON.stringify({items:active,saved_at:Date.now()}));
    }else{
      localStorage.removeItem(LIVE_CACHE_KEY);
    }
  }catch(_){}
}
function hydrateLiveCache(){
  const cached=readLiveCache();
  if(!cached.length)return false;
  items=cached;
  return true;
}
function m7loFontStack(mode){
  return({
    system:'"Segoe UI",Arial,Helvetica,sans-serif',
    modern:'"Trebuchet MS","Segoe UI",Arial,sans-serif',
    elegant:'Georgia,"Times New Roman",serif',
    classic:'"Times New Roman",Georgia,serif',
    mono:'"Courier New",Courier,monospace'
  }[String(mode||"").trim().toLowerCase()]||"")
}

function m7loFontPercent(value){
  let n=Number(value);
  return Number.isFinite(n)?Math.max(70,Math.min(150,n)):100
}

function m7loApplyTypography(root,options){
  if(!root)return;
  options=options&&typeof options==="object"?options:{};
  let globalStyle=String(options.global_font_style||"current").trim().toLowerCase();
  let moduleStyle=String(options.live_font_style||"inherit").trim().toLowerCase();
  let finalStyle=moduleStyle==="inherit"?globalStyle:moduleStyle;
  let family=m7loFontStack(finalStyle);
  let scale=(m7loFontPercent(options.global_font_size)*m7loFontPercent(options.live_font_size))/10000;
  [root,...root.querySelectorAll("*")].forEach(el=>{
    if(!el||!el.tagName)return;
    let tag=el.tagName.toUpperCase();
    if(["STYLE","SCRIPT","SVG","PATH","IMG","VIDEO"].includes(tag))return;
    let direct=[...(el.childNodes||[])].some(n=>n.nodeType===3&&String(n.textContent||"").trim());
    let form=["BUTTON","INPUT","TEXTAREA","SELECT","OPTION","A"].includes(tag);
    if(!direct&&!form)return;
    if(family)el.style.setProperty("font-family",family,"important");
    else el.style.removeProperty("font-family");
    let base=Number(el.dataset.m7BaseFontSize);
    if(!Number.isFinite(base)||base<=0){
      base=parseFloat(getComputedStyle(el).fontSize);
      if(!Number.isFinite(base)||base<=0)return;
      el.dataset.m7BaseFontSize=String(base);
    }
    el.style.setProperty("font-size",(base*scale).toFixed(2)+"px","important");
  })
}
function m7loSafeHex(value){
  let raw=String(value||"").trim();
  return /^#[0-9a-f]{6}$/i.test(raw)?raw:""
}
function m7loNum(value,min,max,fallback){
  let n=Number(value);
  return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback
}
function m7loBool(value,fallback=true){
  if(value===undefined||value===null||value==="")return fallback;
  return value===true||String(value).toLowerCase()==="true"
}
function m7loApplyDesign(root,options){
  if(!root)return;
  options=options&&typeof options==="object"?options:{};

  let universal=m7loSafeHex(options.story_color||options.card_color);
  let useUniversal=options.page_use_universal_accent===undefined?true:m7loBool(options.page_use_universal_accent,true);
  let accent=useUniversal?universal:m7loSafeHex(options.live_accent_color||universal);
  if(!accent)accent="#e4aa4f";

  const panelBg=m7loSafeHex(options.live_panel_bg_color);
  const panelBorder=m7loSafeHex(options.live_panel_border_color)||accent;
  const title=m7loSafeHex(options.live_title_color);
  const subtitle=m7loSafeHex(options.live_subtitle_color);
  const icon=m7loSafeHex(options.live_icon_color)||accent;
  const status=m7loSafeHex(options.live_status_color);
  const emptyBg=m7loSafeHex(options.live_empty_bg_color);
  const emptyText=m7loSafeHex(options.live_empty_text_color);
  const cardBg=m7loSafeHex(options.live_card_bg_color);
  const cardBorder=m7loSafeHex(options.live_card_border_color);
  const cardTitle=m7loSafeHex(options.live_card_title_color);
  const cardText=m7loSafeHex(options.live_card_text_color);
  const price=m7loSafeHex(options.live_price_color);
  const countdown=m7loSafeHex(options.live_countdown_color);
  const buttonBg=m7loSafeHex(options.live_button_bg_color);
  const buttonText=m7loSafeHex(options.live_button_text_color);
  const panelRadius=m7loNum(options.live_panel_radius,0,42,NaN);
  const cardRadius=m7loNum(options.live_card_radius,0,32,NaN);
  const shadow=m7loNum(options.live_panel_shadow,0,100,NaN);
  const glow=m7loNum(options.live_panel_glow,0,100,NaN);
  const pulse=m7loBool(options.live_live_pulse,true);

  if(panelBg)root.style.setProperty("background",panelBg,"important");
  if(panelBorder)root.style.setProperty("border-color",panelBorder,"important");
  if(Number.isFinite(panelRadius))root.style.setProperty("border-radius",panelRadius+"px","important");

  if(
    panelBg||
    options.live_panel_border_color||
    Number.isFinite(panelRadius)||
    Number.isFinite(shadow)||
    Number.isFinite(glow)
  ){
    root.style.setProperty("border-style","solid","important");
    root.style.setProperty("border-width","1px","important");
    root.style.setProperty("padding","14px","important");
  }

  if(Number.isFinite(shadow)||Number.isFinite(glow)){
    let sh=Number.isFinite(shadow)?shadow:35;
    let gl=Number.isFinite(glow)?glow:15;
    root.style.setProperty(
      "box-shadow",
      "0 14px "+(18+sh*.36).toFixed(0)+"px rgba(0,0,0,"+(0.12+sh*.0048).toFixed(3)+"),"+
      "0 0 "+(4+gl*.24).toFixed(0)+"px color-mix(in srgb,"+accent+" "+Math.min(75,12+gl*.58).toFixed(0)+"%,transparent)",
      "important"
    );
  }

  $all(".m7lo-title",root).forEach(el=>{if(title)el.style.setProperty("color",title,"important")});
  $all(".m7lo-sub,.m7lo-desc",root).forEach(el=>{if(subtitle||cardText)el.style.setProperty("color",cardText||subtitle,"important")});
  $all(".m7lo-kicker",root).forEach(el=>el.style.setProperty("color",icon,"important"));
  $all(".m7lo-dot,.m7lo-view-dot",root).forEach(el=>{
    if(status)el.style.setProperty("background",status,"important");
    if(!pulse){
      el.style.setProperty("animation","none","important");
      el.style.setProperty("-webkit-animation","none","important");
    }else{
      el.style.removeProperty("animation");
      el.style.removeProperty("-webkit-animation");
    }
  });
  $all(".m7lo-live-label",root).forEach(el=>{if(status)el.style.setProperty("color",status,"important")});
  $all(".m7lo-empty",root).forEach(el=>{
    if(emptyBg)el.style.setProperty("background",emptyBg,"important");
    if(emptyText)el.style.setProperty("color",emptyText,"important");
  });
  $all(".m7lo-card,.m7lo-center-card",root).forEach(el=>{
    if(cardBg)el.style.setProperty("background",cardBg,"important");
    if(cardBorder)el.style.setProperty("border-color",cardBorder,"important");
    if(Number.isFinite(cardRadius))el.style.setProperty("border-radius",cardRadius+"px","important");
  });
  $all(".m7lo-card h3,.m7lo-center-card h2",root).forEach(el=>{if(cardTitle)el.style.setProperty("color",cardTitle,"important")});
  $all(".m7lo-card .m7lo-shop,.m7lo-center-card .m7lo-shop",root).forEach(el=>el.style.setProperty("color",accent,"important"));
  $all(".m7lo-price",root).forEach(el=>{if(price)el.style.setProperty("color",price,"important")});
  $all(".m7lo-times",root).forEach(el=>{if(countdown)el.style.setProperty("color",countdown,"important")});
  $all(".m7lo-btn,.m7lo-visit",root).forEach(el=>{
    if(buttonBg)el.style.setProperty("background",buttonBg,"important");
    if(buttonText)el.style.setProperty("color",buttonText,"important");
  });

  m7loApplyTypography(root,options);
}
function remain(end){let s=Math.max(0,Math.floor((new Date(end)-Date.now())/1000)),d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60),q=s%60;return d?`${d}d ${h}h ${m}m`:`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(q).padStart(2,"0")}`}
function startText(x){let t=new Date(x.starts_at).getTime(),n=Date.now();if(t>n)return`Starts in ${remain(x.starts_at)}`;let s=Math.max(0,Math.floor((n-t)/1000));if(s<60)return`Started ${s}s ago`;let m=Math.floor(s/60);if(m<60)return`Started ${m}m ago`;let h=Math.floor(m/60);return h<24?`Started ${h}h ${m%60}m ago`:`Started ${Math.floor(h/24)}d ago`}
function dateLabel(v){let d=new Date(v);return d.toLocaleString(undefined,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}
function timing(x){return`<div class="m7lo-times"><div>Starts: ${esc(dateLabel(x.starts_at))}</div><div>Ends: ${esc(dateLabel(x.ends_at))}</div><div data-m7-start="${esc(x.id)}">${startText(x)}</div><div data-m7-endtime="${esc(x.ends_at)}">Ends in ${remain(x.ends_at)}</div></div>`}
function css(){if($("#m7lo-v4-css"))return;let s=document.createElement("style");s.id="m7lo-v4-css";s.textContent=`:root{--m7g:#e4aa4f;--m7green:#36dc82;--m7red:#ff4747}.m7lo{font-family:Arial,"Segoe UI",sans-serif;color:#fff;width:100%;box-sizing:border-box}.m7lo-head{margin-bottom:14px}.m7lo-kicker{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:950;letter-spacing:1.4px}.m7lo-dot,.m7lo-view-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--m7red);animation:m7pulse 1.35s infinite}.m7lo.has .m7lo-dot,.m7lo-view-dot{background:var(--m7green)}@keyframes m7pulse{0%{box-shadow:0 0 0 0 #36dc8288}70%{box-shadow:0 0 0 9px #36dc8200}100%{box-shadow:0 0 0 0 #36dc8200}}.m7lo-title{font-size:clamp(22px,5vw,31px);font-weight:950;letter-spacing:-.7px;margin-top:4px}.m7lo-sub{font-size:11px;color:#ffffff7d;margin-top:4px}.m7lo-grid{display:flex!important;gap:13px!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important;padding:2px 2px 10px!important}.m7lo-grid::-webkit-scrollbar{display:none}.m7lo-card{position:relative;flex:0 0 min(86%,360px)!important;scroll-snap-align:start!important;min-height:310px;overflow:hidden;border-radius:22px;border:1px solid #ffffff18;background:linear-gradient(145deg,#211a15,#0b0b0b);box-shadow:0 15px 42px #0007;cursor:pointer;isolation:isolate}.m7lo-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}.m7lo-card:after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#0000 8%,#0004 43%,#050505fa 100%)}.m7lo-copy{position:absolute;left:15px;right:15px;bottom:15px}.m7lo-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid #ffffff1c;border-radius:99px;background:#080808d9;font-size:9px;font-weight:950}.m7lo-card h3{font-size:20px;line-height:1.08;margin:9px 0 4px}.m7lo-shop{font-size:11px;color:#f1bd70;font-weight:850}.m7lo-price{font-size:19px;font-weight:950;color:#f3c16f;margin-top:7px}.m7lo-old{text-decoration:line-through;color:#fff7;font-size:12px;margin-right:6px}.m7lo-times{display:grid;gap:3px;margin-top:9px;color:#ffffff9c;font-size:10px;font-weight:800}.m7lo-empty{padding:27px 16px;border:1px dashed #ffffff1d;border-radius:20px;background:#ffffff04;text-align:center;color:#ffffff73}.m7lo-owner{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;margin-bottom:10px;padding:14px;border:1px solid #e4aa4f38;border-radius:18px;background:linear-gradient(135deg,#15120f,#0d0d0d)}.m7lo-owner strong{display:block;color:#f1bd70;font-size:15px}.m7lo-owner small{display:block;margin-top:4px;color:#fff8;font-size:10px}.m7lo-owner-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:flex-end}.m7lo-btn,.m7lo-video-btn{border:0;border-radius:12px;padding:11px 13px;font-weight:950;cursor:pointer;white-space:nowrap;-webkit-tap-highlight-color:transparent!important;outline:none!important}.m7lo-btn:focus-visible,.m7lo-video-btn:focus-visible{box-shadow:0 0 0 2px rgba(241,191,108,.35)!important}.m7lo-btn{background:linear-gradient(135deg,#f1bf6c,#c98931);color:#17100a}.m7lo-video-btn{background:linear-gradient(135deg,#f23d59,#bb1632);color:#fff;box-shadow:0 8px 22px rgba(226,29,65,.18)}.m7lo-btn:disabled,.m7lo-video-btn:disabled{opacity:.38}.m7lo-owner-active{margin-top:8px}.m7lo-owner-active-title{margin:0 0 8px;color:#ffffff80;font-size:9px;font-weight:950;letter-spacing:.8px;text-transform:uppercase}.m7lo-owner-active .m7lo-grid{padding-bottom:2px}.m7lo-owner-empty{padding:10px 2px 0;color:#ffffff61;font-size:10px}.m7lo-video-live-card{border-color:rgba(239,51,79,.55)!important;background:radial-gradient(circle at 18% 10%,rgba(239,51,79,.18),transparent 38%),linear-gradient(145deg,#1b1013,#090909)!important}.m7lo-video-live-card .m7lo-badge{background:#d91f43;border-color:#ff6b82;color:#fff}.m7lo-video-live-card .m7lo-media{filter:brightness(.5) saturate(.85);transform:scale(1.03)}.m7lo-manage{position:absolute;right:10px;top:10px;z-index:4;display:flex;gap:6px}.m7lo-edit,.m7lo-end{border:1px solid #ffffff22;border-radius:10px;padding:7px 9px;font-size:9px;font-weight:900;color:#fff}.m7lo-edit{background:#8a6526e8}.m7lo-end{background:#6d2020e8}.m7lo-slots{height:5px;width:120px;margin-top:7px;border-radius:9px;overflow:hidden;background:#ffffff12}.m7lo-slots i{display:block;height:100%;background:var(--m7g)}html.m7lo-locked,html.m7lo-locked body{overflow:hidden!important;overscroll-behavior:none!important}#m7lo-overlay{position:fixed!important;inset:0!important;z-index:2147483646!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:12px!important;background:#050505f4!important;backdrop-filter:blur(14px)!important;font-family:Arial,"Segoe UI",sans-serif!important;color:#fff!important;overscroll-behavior:contain!important;touch-action:pan-y!important}#m7lo-overlay.m7lo-shop-overlay{background:rgba(4,4,4,.64)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}#m7lo-overlay.m7lo-shop-overlay #m7lo-panel{width:min(470px,100%)!important;max-height:min(72dvh,620px)!important;margin:auto!important;box-shadow:0 24px 70px rgba(0,0,0,.55)!important}#m7lo-panel{position:relative;width:min(520px,100%);max-height:calc(100dvh - 24px);overflow:auto;box-sizing:border-box;border:1px solid #e4aa4f55;border-radius:28px;background:#11100f;box-shadow:0 30px 100px #000;padding:20px}.m7lo-close{position:absolute;right:13px;top:12px;z-index:8;width:40px;height:40px;border:1px solid #ffffff18;border-radius:50%;background:#111d;color:#fff;font-size:23px}.m7lo-view{padding:0!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;width:min(470px,100%)!important;display:flex;flex-direction:column;max-height:calc(100dvh - 24px)!important;overscroll-behavior:contain!important}.m7lo-view-media{display:block;width:100%;height:min(48dvh,520px);object-fit:cover;background:#000;flex:none}.m7lo-view-body{padding:18px 20px 20px;overflow:auto}.m7lo-view-live{display:flex;align-items:center;gap:8px}.m7lo-view h2{font-size:27px;margin:10px 0 5px}.m7lo-desc{font-size:13px;line-height:1.5;color:#ffffffb5;margin:8px 0}.m7lo-cta{display:block;text-align:center;text-decoration:none;margin-top:14px}.m7lo-nav{position:absolute;top:45%;z-index:9;width:40px;height:48px;border:1px solid #ffffff20;background:#090909bb;color:#fff;border-radius:15px;font-size:25px}.m7lo-prev{left:8px}.m7lo-next{right:8px}.m7lo-panel-title{font-size:25px;font-weight:950;margin:4px 50px 4px 0}.m7lo-types{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:17px 0 15px}.m7lo-type{min-height:58px;padding:9px 10px;border:1px solid #ffffff12;border-radius:15px;background:linear-gradient(145deg,#171717,#0d0d0d);color:#fff;display:grid;grid-template-columns:32px minmax(0,1fr);align-items:center;gap:8px;text-align:left;cursor:pointer;appearance:none;-webkit-appearance:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;box-shadow:inset 0 1px 0 #ffffff05;transition:border-color .16s ease,background .16s ease,transform .12s ease}.m7lo-type:active{transform:scale(.98)}.m7lo-type.on{border-color:#e4aa4f99;background:linear-gradient(145deg,#2a2114,#15110d);box-shadow:inset 0 1px 0 #ffffff08,0 0 0 1px #e4aa4f16}.m7lo-type-icon{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:#ffffff08;font-size:15px}.m7lo-type.on .m7lo-type-icon{background:#e4aa4f18}.m7lo-type-copy{min-width:0;display:flex;flex-direction:column;gap:2px}.m7lo-type-copy b{font-size:9.5px;line-height:1.1;font-weight:950;color:#fff}.m7lo-type.on .m7lo-type-copy b{color:#f5c879}.m7lo-type-copy small{font-size:7.5px;line-height:1.15;color:#ffffff70;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.m7lo-form{display:grid;gap:11px}.m7lo-in,.m7lo-ta{width:100%;box-sizing:border-box;padding:13px;border:1px solid #ffffff16;border-radius:14px;background:#080808;color:#fff;outline:none}.m7lo-in:focus,.m7lo-ta:focus{border-color:#e4aa4f66;box-shadow:0 0 0 3px #e4aa4f0b}.m7lo-ta{min-height:88px}.m7lo-two{display:grid;grid-template-columns:1fr 1fr;gap:9px}.m7lo-field{min-width:0;display:grid;gap:6px}.m7lo-label{position:relative;z-index:1;font-size:8px;line-height:1.1;color:#ffffff78;font-weight:900;letter-spacing:.8px;margin:0 0 0 2px}.m7lo-time-row{margin-top:1px}.m7lo-time-row .m7lo-in{min-height:50px;padding-top:12px;padding-bottom:12px;color-scheme:dark}.m7lo-time-row input[type="datetime-local"]::-webkit-date-and-time-value{text-align:left}.m7lo-file{padding:16px;border:1px dashed #e4aa4f66;border-radius:16px;background:#e4aa4f09;text-align:center}.m7lo-status{min-height:18px;color:#efbd70;font-size:11px}@media(max-width:520px){#m7lo-overlay{align-items:flex-start!important;padding:max(10px,env(safe-area-inset-top)) 8px max(10px,env(safe-area-inset-bottom))!important}#m7lo-overlay.m7lo-shop-overlay{align-items:center!important;padding:14px 10px!important;background:rgba(3,3,3,.58)!important}#m7lo-overlay.m7lo-shop-overlay #m7lo-panel{margin:0!important;width:100%!important;max-height:min(68dvh,560px)!important;border-radius:24px!important;padding:17px 15px 18px!important}#m7lo-panel{border-radius:23px;max-height:calc(100dvh - max(20px,env(safe-area-inset-top) + env(safe-area-inset-bottom)))!important;padding:18px 16px 20px}.m7lo-card{flex-basis:88%!important;min-height:330px}.m7lo-types{gap:7px;margin-top:15px}.m7lo-type{min-height:55px;padding:8px;grid-template-columns:29px minmax(0,1fr);gap:7px}.m7lo-type-icon{width:29px;height:29px;border-radius:9px;font-size:14px}.m7lo-type-copy b{font-size:8.8px}.m7lo-type-copy small{font-size:7px}.m7lo-two{grid-template-columns:1fr}.m7lo-time-row{gap:11px}.m7lo-time-row .m7lo-field{gap:6px}.m7lo-label{font-size:8px;margin-left:3px}.m7lo-view-media{height:46dvh}.m7lo-nav{display:none}}`;document.head.appendChild(s)}
function galleryCss(){if($("#m7lo-gallery-css"))return;let s=document.createElement("style");s.id="m7lo-gallery-css";s.textContent=`.m7lo-media-count{position:absolute;right:12px;bottom:12px;z-index:4;padding:7px 10px;border:1px solid #ffffff33;border-radius:99px;background:#050505c9;color:#fff;font-size:9px;font-weight:900;backdrop-filter:blur(9px)}.m7lo-media-btn{background:#225441e8!important}.m7lo-view{width:min(520px,100%)!important;background:#090909!important}.m7lo-hero{position:relative;height:min(57dvh,590px);flex:none;overflow:hidden;background:#000}.m7lo-hero .m7lo-view-media{width:100%;height:100%;object-fit:cover}.m7lo-hero:after{content:"";position:absolute;inset:45% 0 0;pointer-events:none;background:linear-gradient(transparent,#090909)}.m7lo-media-progress{position:absolute;z-index:7;left:14px;right:70px;top:13px;display:flex;gap:5px}.m7lo-media-progress i{height:4px;flex:1;border-radius:5px;background:#ffffff48}.m7lo-media-progress i.on{background:#f0bc60;box-shadow:0 0 9px #f0bc6088}.m7lo-play{position:absolute;z-index:7;left:50%;top:48%;transform:translate(-50%,-50%);display:grid;place-items:center;width:82px;height:82px;border:1px solid #f1c36f;border-radius:50%;background:#0909098c;color:#fff;font-size:34px;backdrop-filter:blur(8px);box-shadow:0 0 28px #0009}.m7lo-play small{position:absolute;top:88px;width:130px;font-size:10px;font-weight:900}.m7lo-gallery-pill{position:absolute;z-index:7;right:13px;bottom:17px;padding:9px 12px;border:1px solid #e4aa4f8c;border-radius:99px;background:#080808cf;color:#fff;font-size:10px;font-weight:900}.m7lo-center-card{position:relative;z-index:4;margin:-48px 14px 14px;padding:57px 18px 18px;border:1px solid #e4aa4f77;border-radius:26px;background:linear-gradient(145deg,#29241dcc,#090909f2);text-align:center;box-shadow:0 18px 50px #000b;backdrop-filter:blur(15px)}.m7lo-avatar{position:absolute;left:50%;top:-45px;transform:translateX(-50%);width:88px;height:88px;padding:4px;border-radius:50%;background:conic-gradient(#36dc82,#baffd7,#195e3d,#36dc82);box-shadow:0 0 25px #36dc8299;animation:m7loAvatarSpin 2s linear infinite}.m7lo-avatar img,.m7lo-avatar span{display:grid;place-items:center;width:100%;height:100%;border:3px solid #08110d;border-radius:50%;object-fit:cover;background:#171717;color:#e4aa4f;font-size:25px;font-weight:950;animation:m7loAvatarCounter 2s linear infinite}@keyframes m7loAvatarSpin{to{transform:translateX(-50%) rotate(360deg)}}@keyframes m7loAvatarCounter{to{transform:rotate(-360deg)}}.m7lo-owner-tools{position:absolute;z-index:8;left:12px;top:42px;display:flex;gap:6px}.m7lo-owner-tools button{padding:8px 10px;border:1px solid #ffffff33;border-radius:99px;background:#080808c9;color:#fff;font-size:9px;font-weight:900}.m7lo-center-card h2{margin:8px 0 6px!important}.m7lo-center-card .m7lo-shop{font-size:15px}.m7lo-live-label{margin:3px 0 11px;color:#36dc82;font-size:10px;font-weight:950;letter-spacing:1px}.m7lo-schedule{margin:13px 0;padding:12px;border:1px solid #ffffff17;border-radius:15px;background:#ffffff08;text-align:left}.m7lo-schedule .m7lo-times{margin:0}.m7lo-visit{display:block;margin-top:14px;padding:14px;border-radius:16px;background:linear-gradient(135deg,#f1c36f,#cf8e31);color:#161009!important;text-decoration:none;font-weight:950}.m7lo-dots{display:flex;justify-content:center;gap:7px;margin-top:12px}.m7lo-dots i{width:7px;height:7px;border-radius:50%;background:#ffffff3d}.m7lo-dots i.on{background:#f0bc60}.m7lo-gallery{padding:0!important;overflow:hidden!important}.m7lo-gallery-stage{position:relative;height:75dvh;background:#000}.m7lo-gallery-stage img,.m7lo-gallery-stage video{width:100%;height:100%;object-fit:contain}.m7lo-gallery-caption{padding:13px;text-align:center;color:#fff}.m7lo-gallery-nav{position:absolute;z-index:7;top:48%;width:42px;height:52px;border:1px solid #ffffff33;border-radius:15px;background:#080808b8;color:#fff;font-size:26px}.m7lo-gallery-prev{left:8px}.m7lo-gallery-next{right:8px}.m7lo-gallery-close{position:absolute;z-index:9;right:12px;top:12px}@media(max-width:520px){#m7lo-overlay{padding:6px!important}.m7lo-view{max-height:calc(100dvh - 12px)!important}.m7lo-hero{height:min(40dvh,360px)}.m7lo-center-card{margin:-36px 9px 9px;padding:50px 14px 14px;border-radius:22px}.m7lo-visit{position:relative;z-index:2;min-height:46px;display:flex;align-items:center;justify-content:center}}.m7lo-media-row{display:grid;grid-template-columns:58px 1fr auto auto;align-items:center;gap:8px;padding:8px;border:1px solid #ffffff14;border-radius:13px;background:#ffffff06}.m7lo-media-thumb{width:58px;height:58px;border-radius:10px;object-fit:cover;background:#000}.m7lo-media-list{display:grid;gap:8px}.m7lo-small-btn{padding:8px;border:1px solid #ffffff22;border-radius:10px;background:#292929;color:#fff;font-size:9px;font-weight:900}.m7lo-danger{background:#692424}.m7lo-cover{background:#6e5427}.m7lo-swipe-in-next{animation:m7loSwipeNext .42s cubic-bezier(.16,1,.3,1)}.m7lo-swipe-in-prev{animation:m7loSwipePrev .42s cubic-bezier(.16,1,.3,1)}@keyframes m7loSwipeNext{from{opacity:0;transform:translateY(60px) scale(.96)}to{opacity:1;transform:none}}@keyframes m7loSwipePrev{from{opacity:0;transform:translateY(-60px) scale(.96)}to{opacity:1;transform:none}}`;document.head.appendChild(s)}
function motionCss(){if($("#m7lo-motion-css"))return;let s=document.createElement("style");s.id="m7lo-motion-css";s.textContent=`.m7lo-view{will-change:transform,opacity}.m7lo-view.m7lo-dragging{transition:none!important}.m7lo-swipe-in-next{animation:m7loReelInNext .46s cubic-bezier(.16,1,.3,1)}.m7lo-swipe-in-prev{animation:m7loReelInPrev .46s cubic-bezier(.16,1,.3,1)}.m7lo-swipe-out-up{animation:m7loReelOutUp .24s cubic-bezier(.7,0,.84,0) forwards}.m7lo-swipe-out-down{animation:m7loReelOutDown .24s cubic-bezier(.7,0,.84,0) forwards}@keyframes m7loReelInNext{from{opacity:.1;transform:translateY(100%) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes m7loReelInPrev{from{opacity:.1;transform:translateY(-100%) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes m7loReelOutUp{to{opacity:.05;transform:translateY(-100%) scale(.97)}}@keyframes m7loReelOutDown{to{opacity:.05;transform:translateY(100%) scale(.97)}}`;document.head.appendChild(s)}
function panelPremiumCss(){
  if($("#m7lo-panel-v6-css"))return;
  const s=document.createElement("style");
  s.id="m7lo-panel-v6-css";
  s.textContent=`
.m7lo-owner.m7lo-owner-v6{position:relative;display:block;margin:0 0 12px;padding:14px;border:1px solid rgba(228,170,79,.46);border-radius:22px;background:
  radial-gradient(circle at 4% 0%,rgba(228,170,79,.13),transparent 34%),
  linear-gradient(145deg,rgba(24,21,17,.98),rgba(8,8,8,.98));box-shadow:0 16px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.04);overflow:hidden}
.m7lo-owner-v6.is-video-live{border-color:rgba(255,63,94,.55);background:
  radial-gradient(circle at 5% 0%,rgba(255,49,84,.17),transparent 34%),
  linear-gradient(145deg,rgba(25,13,16,.99),rgba(8,8,8,.98))}
.m7lo-owner-mark{display:inline-flex;align-items:center;gap:6px;margin-bottom:10px;padding:5px 8px;border:1px solid rgba(228,170,79,.34);border-radius:999px;background:rgba(228,170,79,.07);color:#f1c06c;font-size:8px;font-weight:950;letter-spacing:.7px}
.m7lo-owner-main{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}
.m7lo-owner-status{min-width:0;display:flex;align-items:flex-start;gap:9px}
.m7lo-owner-status-dot{width:9px;height:9px;flex:0 0 9px;margin-top:4px;border-radius:50%;background:#36dc82;box-shadow:0 0 0 0 rgba(54,220,130,.45);animation:m7OwnerPulse 1.5s ease-out infinite}
.m7lo-owner-v6.is-video-live .m7lo-owner-status-dot{background:#ff3154;box-shadow:0 0 0 0 rgba(255,49,84,.5)}
@keyframes m7OwnerPulse{70%{box-shadow:0 0 0 8px rgba(54,220,130,0)}100%{box-shadow:0 0 0 0 rgba(54,220,130,0)}}
.m7lo-owner-v6 .m7lo-owner-status strong{display:block;color:#fff;font-size:15px;line-height:1.1}
.m7lo-owner-v6 .m7lo-owner-status small{display:block;margin-top:4px;color:rgba(255,255,255,.58);font-size:9px;line-height:1.3}
.m7lo-owner-v6 .m7lo-owner-actions{display:flex;align-items:center;gap:7px;justify-content:flex-end;flex-wrap:nowrap}
.m7lo-owner-v6 .m7lo-video-btn,.m7lo-owner-v6 .m7lo-btn{min-height:42px;border-radius:13px;padding:0 13px;font-size:10px}
.m7lo-owner-v6 .m7lo-video-btn{background:linear-gradient(135deg,#f03457,#bd1635);box-shadow:0 8px 20px rgba(224,31,67,.20)}
.m7lo-owner-v6 .m7lo-btn{background:linear-gradient(135deg,#efc36f,#c88a31)}
.m7lo-owner-meta{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:10px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07)}
.m7lo-owner-slots b{display:block;color:#f0bc60;font-size:13px}.m7lo-owner-slots span{display:block;margin-top:2px;color:rgba(255,255,255,.52);font-size:8px}
.m7lo-owner-v6 .m7lo-slots{width:100%;max-width:180px;height:5px;margin-top:6px;background:rgba(255,255,255,.08)}
.m7lo-owner-v6 .m7lo-slots i{background:linear-gradient(90deg,#d79c3d,#f4ca78)}
.m7lo-owner-video-state{display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.035);color:rgba(255,255,255,.66);font-size:8px;font-weight:900;white-space:nowrap}
.m7lo-owner-v6.is-video-live .m7lo-owner-video-state{border-color:rgba(255,49,84,.25);color:#ff8fa4;background:rgba(255,49,84,.07)}
#m7lo-overlay.m7lo-shop-overlay #m7lo-panel.m7lo-shop-panel{overflow:auto!important}
#m7lo-overlay.m7lo-shop-overlay .m7lo{padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
#m7lo-overlay.m7lo-shop-overlay .m7lo-card{border-width:0!important;box-shadow:none!important;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.018))!important}
#m7lo-overlay.m7lo-shop-overlay .m7lo-card.no-media{min-height:190px!important}
#m7lo-overlay.m7lo-shop-overlay .m7lo-card.no-media .m7lo-copy{position:absolute;left:18px;right:18px;bottom:18px}
#m7lo-overlay.m7lo-shop-overlay .m7lo-card.no-media:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 15%,rgba(228,170,79,.08),transparent 42%);pointer-events:none}
#m7lo-overlay.m7lo-shop-overlay .m7lo-head{padding:1px 2px 0;margin-bottom:12px}

#m7lo-overlay.m7lo-shop-overlay #m7lo-panel.m7lo-shop-panel{border-color:rgba(228,170,79,.42)!important;background:
  radial-gradient(circle at 0 0,rgba(228,170,79,.07),transparent 30%),#0b0b0b!important}
.m7lo-shop-panel>.m7lo-owner-v6{margin-top:2px}
@media(max-width:520px){
  .m7lo-owner.m7lo-owner-v6{padding:12px;border-radius:19px}
  .m7lo-owner-main{grid-template-columns:1fr;gap:10px}
  .m7lo-owner-v6 .m7lo-owner-actions{justify-content:stretch}
  .m7lo-owner-v6 .m7lo-owner-actions button{flex:1}
  .m7lo-owner-meta{margin-top:10px}
}
`;
  document.head.appendChild(s);
}

async function ready(){
  for(let i=0;i<240;i++){
    c=resolveClient();
    if(c)return true;
    await sleep(250);
  }
  return false;
}
async function identity(){
  session=window.Ma7alakAccount?.session||null;
  ownerSlug="";
  ent=null;
  if(!c)return;

  const bridgedSlug=String(window.Ma7alakOwnerAuth?.owner?.shop_slug||"").trim().toLowerCase();
  if(bridgedSlug)ownerSlug=bridgedSlug;

  if(!ownerSlug&&session?.user){
    const o=await c.from("shop_owners").select("shop_slug").eq("user_id",session.user.id).limit(1).maybeSingle();
    if(!o.error&&o.data?.shop_slug)ownerSlug=String(o.data.shop_slug).toLowerCase();
  }

  if(ownerSlug){
    const e=await c.from("shop_live_entitlements").select("*").eq("shop_slug",ownerSlug).maybeSingle();
    if(!e.error)ent=e.data||null;
  }
}
async function load(){
  if(!c||refreshing)return;
  refreshing=true;
  try{
    const n=new Date().toISOString();
    const r=await c.from("shop_live_posts").select("*").eq("status","active").gt("ends_at",n).order("starts_at",{ascending:false}).limit(80);

    if(r.error){
      console.warn("SHOUFHON Live & Offers: public refresh failed; keeping last valid Live state",r.error);
      items=activeCachedItems(items);
      if(!items.length)items=readLiveCache();
      broadcast();
      return;
    }

    items=r.data||[];
    ownerItems=[];

    if(ownerSlug){
      const q=await c.from("shop_live_posts").select("*").eq("shop_slug",ownerSlug).eq("status","active").gt("ends_at",n).order("starts_at",{ascending:false});
      if(!q.error)ownerItems=q.data||[];
    }

    const all=[...items,...ownerItems];
    const slugs=[...new Set([...all.map(x=>String(x.shop_slug||"").trim().toLowerCase()),ownerSlug].filter(Boolean))];
    const ids=[...new Set(all.map(x=>Number(x.id)).filter(Boolean))];
    const profiles=new Map(),mediaByPost=new Map();

    if(slugs.length){
      const p=await c.from("shop_profiles").select("shop_slug,shop_name,arabic_name,profile_image_url,shop_url,directory_options").in("shop_slug",slugs);
      (p.error?[]:(p.data||[])).forEach(x=>profiles.set(String(x.shop_slug||"").toLowerCase(),x));
      profileOptions=profiles;
    }

    if(ids.length){
      const m=await c.from("shop_live_post_media").select("id,post_id,shop_slug,media_url,storage_path,media_type,sort_order,is_cover,created_at").in("post_id",ids).order("sort_order",{ascending:true}).order("id",{ascending:true});
      (m.error?[]:(m.data||[])).forEach(row=>{
        const a=mediaByPost.get(String(row.post_id))||[];
        a.push(row);
        mediaByPost.set(String(row.post_id),a);
      });
    }

    const decorate=x=>{
      const profile=profiles.get(String(x.shop_slug||"").toLowerCase())||{};
      const gallery=(mediaByPost.get(String(x.id))||[]).slice();
      if(!gallery.length&&x.media_url){
        gallery.push({id:"legacy-"+x.id,post_id:x.id,shop_slug:x.shop_slug,media_url:x.media_url,storage_path:null,media_type:x.media_type||"image",sort_order:0,is_cover:true});
      }
      gallery.sort((a,b)=>(b.is_cover-a.is_cover)||(a.sort_order-b.sort_order));
      const cover=gallery[0]||{};
      return {...x,profile_image_url:profile.profile_image_url||null,shop_url:profile.shop_url||null,directory_options:profile.directory_options||{},media:gallery,media_url:cover.media_url||x.media_url||null,media_type:cover.media_type||x.media_type||null};
    };

    items=items.map(decorate);
    ownerItems=ownerItems.map(decorate);
    writeLiveCache(items);

    const signature=JSON.stringify({ownerSlug,ent,items,ownerItems});
    if(signature!==lastRenderSignature){
      lastRenderSignature=signature;
      render();
    }
    broadcast();
  }finally{
    refreshing=false;
  }
}
function media(x,cl="m7lo-media"){if(!x.media_url)return"";return x.media_type==="video"?`<video class="${cl}" src="${esc(x.media_url)}" muted autoplay loop playsinline preload="metadata"></video>`:`<img class="${cl}" src="${esc(x.media_url)}" alt="">`}
function card(x,manage){let [ic,lab]=meta(x.post_type),count=(x.media||[]).length,hasMedia=!!x.media_url;return`<article class="m7lo-card ${hasMedia?"has-media":"no-media"}" data-m7-id="${esc(x.id)}">${media(x)}${count>1?`<span class="m7lo-media-count">▣ View all ${count}</span>`:""}${manage?`<div class="m7lo-manage"><button class="m7lo-edit" data-m7-edit="${esc(x.id)}">EDIT</button><button class="m7lo-edit m7lo-media-btn" data-m7-media="${esc(x.id)}">MEDIA</button><button class="m7lo-end" data-m7-end="${esc(x.id)}">END</button></div>`:""}<div class="m7lo-copy"><span class="m7lo-badge">${ic} ${lab}</span><h3>${esc(x.title)}</h3><div class="m7lo-shop">${esc(x.shop_name||x.shop_slug)}</div>${x.post_type==="offer"&&(x.original_price!=null||x.offer_price!=null)?`<div class="m7lo-price">${x.original_price!=null?`<span class="m7lo-old">${money(x.original_price)}</span>`:""}${money(x.offer_price)}</div>`:""}${timing(x)}</div></article>`}
function videoLiveRows(shopSlug){
  try{
    const rows=Array.isArray(window.ShoufHonLiveVideo?.bridgeItems)?window.ShoufHonLiveVideo.bridgeItems:[];
    const slug=String(shopSlug||"").trim().toLowerCase();
    return slug?rows.filter(x=>String(x?.shop_slug||"").trim().toLowerCase()===slug):rows.slice();
  }catch(_){return[]}
}
function videoCard(x){
  const img=x.profile_image_url||x.media_url||"";
  return`<article class="m7lo-card m7lo-video-live-card" data-m7-video-stream="${esc(x.stream_id)}">${img?`<img class="m7lo-media" src="${esc(img)}" alt="" loading="lazy" decoding="async">`:""}<div class="m7lo-copy"><span class="m7lo-badge">🔴 VIDEO LIVE</span><h3>${esc(x.title||"Live now")}</h3><div class="m7lo-shop">${esc(x.shop_name||x.shop_slug)}</div><div class="m7lo-times"><span>● Broadcasting now · tap to watch</span></div></div></article>`;
}
function section(list,shopMode,manage,shopSlug=""){
  const videos=videoLiveRows(shopSlug);
  const total=list.length+videos.length;
  const has=total>0;
  const sub=has
    ? (videos.length&&list.length
        ? `${total} live updates · ${videos.length} video live`
        : videos.length
          ? (videos.length===1?"🔴 1 shop is video live now":`🔴 ${videos.length} video lives happening now`)
          : (list.length===1?"1 update happening now":`${list.length} updates — swipe to see more`))
    : (shopMode?"":"Nothing live right now — new updates will appear here");
  const cards=[...videos.map(videoCard),...list.map(x=>card(x,manage))].join("");
  const subHtml=sub?`<div class="m7lo-sub">${sub}</div>`:"";
  const emptyHtml=shopMode
    ? `<div class="m7lo-empty">Nothing live right now.</div>`
    : `<div class="m7lo-empty">Nothing live right now.<br><small>New offers and updates will appear here automatically.</small></div>`;
  return`<div class="m7lo ${has?"has":""}"><div class="m7lo-head"><div class="m7lo-kicker"><i class="m7lo-dot"></i> LIVE</div><div class="m7lo-title">${shopMode?"Happening Here":"🔥 Happening Today"}</div>${subHtml}</div>${has?`<div class="m7lo-grid">${cards}</div>`:emptyHtml}</div>`}
function ownerActivityHtml(list,shopSlug){
  const videos=videoLiveRows(shopSlug);
  if(!videos.length&&!list.length)return "";
  return `<div class="m7lo-owner-active"><div class="m7lo-owner-active-title">Active now</div><div class="m7lo-grid">${[...videos.map(videoCard),...list.map(x=>card(x,true))].join("")}</div></div>`;
}
function ownerBar(list){
  const lim=Math.max(0,Number(ent?.active_limit||0));
  const used=list.length;
  const pct=lim?Math.min(100,used/lim*100):0;
  const offersEnabled=!!ent?.enabled;
  const videoEnabled=!!ent?.video_live_enabled;
  const activeVideo=videoLiveRows(currentOwnerSlug())[0]||null;
  const statusTitle=activeVideo?"You are LIVE":"Ready to go live";
  const statusSub=activeVideo
    ? "Your broadcast is active. Re-open it to manage camera, chat and viewers."
    : (videoEnabled?"Start a broadcast or publish an offer for your followers.":"Video Live is disabled for this shop.");
  const slotText=offersEnabled?(lim?`${used}/${lim}`:`${used}`):"—";
  return`<div class="m7lo-owner m7lo-owner-v6 ${activeVideo?"is-video-live":""}">
    <div class="m7lo-owner-mark">♛ SHOP OWNER CONTROLS</div>
    <div class="m7lo-owner-main">
      <div class="m7lo-owner-status"><i class="m7lo-owner-status-dot"></i><div><strong>${statusTitle}</strong><small>${statusSub}</small></div></div>
      <div class="m7lo-owner-actions">
        <button class="m7lo-video-btn" data-m7-video-live ${!videoEnabled?"disabled":""}>${activeVideo?"● Resume Live":"▣ Go Live"}</button>
        <button class="m7lo-btn" data-m7-create ${!offersEnabled||used>=lim&&lim>0?"disabled":""}>${offersEnabled&&lim>0&&used>=lim?"Slots Full":"＋ Add Offer"}</button>
      </div>
    </div>
    <div class="m7lo-owner-meta">
      <div class="m7lo-owner-slots"><b>${slotText}</b><span>${offersEnabled?"Active offer slots":"Offers disabled"}</span><div class="m7lo-slots"><i style="width:${pct}%"></i></div></div>
      <div class="m7lo-owner-video-state">${activeVideo?"● Broadcast active":(videoEnabled?"○ Broadcast ready":"○ Video Live off")}</div>
    </div>
  </div>`;
}
function bind(root){
  $all('[data-m7-video-stream]',root).forEach(el=>el.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    window.ShoufHonLiveVideo?.open?.(el.dataset.m7VideoStream);
  });
  $all('[data-m7-id]',root).forEach(el=>el.onclick=e=>{if(!e.target.closest('[data-m7-edit],[data-m7-end],[data-m7-media]'))view(el.dataset.m7Id)});
  $all('[data-m7-end]',root).forEach(b=>b.onclick=e=>{e.stopPropagation();endPost(b.dataset.m7End)});
  $all('[data-m7-edit]',root).forEach(b=>b.onclick=e=>{e.stopPropagation();editor(b.dataset.m7Edit)});
  $all('[data-m7-media]',root).forEach(b=>b.onclick=e=>{e.stopPropagation();mediaManager(b.dataset.m7Media)});
  $("[data-m7-create]",root)?.addEventListener("click",creator);
  $("[data-m7-video-live]",root)?.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    close();
    setTimeout(()=>window.ShoufHonLiveVideo?.goLive?.(),0);
  });
}
function render(){let ps=((location.pathname||"/").replace(/^\/+|\/+$/g,"").split("/")[0]||"").toLowerCase();$all('[data-ma7alak-live="home"]').forEach(r=>{r.innerHTML=section(items,false,false,"");bind(r)});$all('[data-ma7alak-live="shop"]').forEach(r=>{let s=String(r.dataset.shopSlug||ps).toLowerCase(),own=s===ownerSlug,list=items.filter(x=>String(x.shop_slug).toLowerCase()===s),management=own?ownerItems.filter(x=>String(x.shop_slug).toLowerCase()===s):list,videoCount=videoLiveRows(s).length;r.style.display=(!list.length&&!own&&!videoCount)?"none":"";r.innerHTML=own?(ownerBar(management)+ownerActivityHtml(management,s)):section(list,true,false,s);bind(r);m7loApplyDesign(r,(profileOptions.get(s)||{}).directory_options||{})});timers()}
function timers(){$all('[data-m7-start]').forEach(e=>{let x=[...items,...ownerItems].find(q=>String(q.id)===e.dataset.m7Start);if(x)e.textContent=startText(x)});$all('[data-m7-endtime]').forEach(e=>e.textContent="Ends in "+remain(e.dataset.m7Endtime));if(items.some(x=>new Date(x.ends_at)<=new Date()))load()}
function lock(){if(document.documentElement.classList.contains("m7lo-locked"))return;lockedY=scrollY;document.documentElement.classList.add("m7lo-locked");Object.assign(document.body.style,{position:"fixed",top:`-${lockedY}px`,left:"0",right:"0",width:"100%"})}
function unlock(){document.documentElement.classList.remove("m7lo-locked");["position","top","left","right","width"].forEach(k=>document.body.style[k]="");scrollTo(0,lockedY)}
function close(){let o=$("#m7lo-overlay");if(o)o.remove();viewId=null;unlock()}
function liveToast(message){
  let old=$("#m7lo-publish-toast");
  if(old)old.remove();
  let t=document.createElement("div");
  t.id="m7lo-publish-toast";
  t.textContent=String(message||"✓ Published — You are now live!");
  Object.assign(t.style,{
    position:"fixed",
    left:"50%",
    top:"max(18px,env(safe-area-inset-top))",
    transform:"translateX(-50%)",
    zIndex:"2147483647",
    maxWidth:"calc(100vw - 28px)",
    padding:"12px 18px",
    borderRadius:"999px",
    background:"rgba(12,12,12,.96)",
    color:"#fff",
    border:"1px solid rgba(228,170,79,.55)",
    boxShadow:"0 12px 34px rgba(0,0,0,.45)",
    font:"800 13px/1.25 Arial,Segoe UI,sans-serif",
    textAlign:"center",
    pointerEvents:"none",
    opacity:"1"
  });
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity="0";t.style.transition="opacity .2s ease"},1350);
  setTimeout(()=>t.remove(),1600);
}
function navList(){return items.filter(x=>new Date(x.ends_at)>new Date())}
function avatarHtml(x){let name=String(x.shop_name||x.shop_slug||"Shop"),letter=esc(name.charAt(0).toUpperCase());return`<div class="m7lo-avatar">${x.profile_image_url?`<img src="${esc(x.profile_image_url)}" alt="${esc(name)}">`:`<span>${letter}</span>`}</div>`}
function heroHtml(x){let cover=(x.media||[])[0]||{media_url:x.media_url,media_type:x.media_type},count=(x.media||[]).length||(+!!x.media_url);if(!cover?.media_url)return`<div class="m7lo-hero"></div>`;let visual=cover.media_type==="video"?`<video class="m7lo-view-media" src="${esc(cover.media_url)}" muted loop playsinline preload="metadata"></video>`:`<img class="m7lo-view-media" src="${esc(cover.media_url)}" alt="">`;return`<div class="m7lo-hero"><div class="m7lo-media-progress">${Array.from({length:Math.max(1,count)},(_,i)=>`<i class="${i===0?"on":""}"></i>`).join("")}</div>${visual}${cover.media_type==="video"?'<button class="m7lo-play" type="button">▶<small>Play with sound</small></button>':""}${count>1?`<button class="m7lo-gallery-pill" type="button">▣ View all ${count} ›</button>`:""}</div>`}
function view(id,direction){let x=items.find(q=>String(q.id)===String(id))||ownerItems.find(q=>String(q.id)===String(id));if(!x)return;let old=$("#m7lo-overlay");if(old)old.remove();else lock();viewId=x.id;let [ic,lab]=meta(x.post_type),own=String(x.shop_slug).toLowerCase()===ownerSlug,d=document.createElement("div");d.id="m7lo-overlay";d.innerHTML=`<div id="m7lo-panel" class="m7lo-view ${direction?`m7lo-swipe-in-${direction}`:""}"><button class="m7lo-close">×</button>${own?`<div class="m7lo-owner-tools"><button data-view-edit="${esc(x.id)}">✎ Edit</button><button data-view-media="${esc(x.id)}">▣ Manage media</button></div>`:""}${heroHtml(x)}<div class="m7lo-center-card">${avatarHtml(x)}<div class="m7lo-shop">${esc(x.shop_name||x.shop_slug)}</div><div class="m7lo-live-label">● LIVE NOW</div><span class="m7lo-badge">${ic} ${lab}</span><h2>${esc(x.title)}</h2>${x.description?`<p class="m7lo-desc">${esc(x.description)}</p>`:""}${x.location_text?`<p class="m7lo-desc">📍 ${esc(x.location_text)}</p>`:""}${x.post_type==="offer"&&(x.original_price!=null||x.offer_price!=null)?`<div class="m7lo-price">${x.original_price!=null?`<span class="m7lo-old">${money(x.original_price)}</span>`:""}${money(x.offer_price)}</div>`:""}<div class="m7lo-schedule">${timing(x)}</div><a class="m7lo-visit" href="${esc(x.shop_url||`/${encodeURIComponent(x.shop_slug)}`)}">Visit Shop →</a><div class="m7lo-dots">${navList().map(q=>`<i class="${String(q.id)===String(x.id)?"on":""}"></i>`).join("")}</div></div></div>`;document.body.appendChild(d);m7loApplyDesign(d.querySelector("#m7lo-panel")||d,x.directory_options||((profileOptions.get(String(x.shop_slug||"").toLowerCase())||{}).directory_options||{}));$(".m7lo-close",d).onclick=close;$("[data-view-edit]",d)?.addEventListener("click",()=>editor(x.id));$("[data-view-media]",d)?.addEventListener("click",()=>mediaManager(x.id));$(".m7lo-gallery-pill",d)?.addEventListener("click",()=>openGallery(x.id,0));let play=$(".m7lo-play",d),video=$(".m7lo-view-media",d);if(play&&video)play.onclick=()=>{video.muted=false;video.controls=true;video.play().catch(()=>{});play.remove()};let sx=0,sy=0,st=0;d.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now()},{passive:true});d.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Date.now()-st<750&&Math.abs(dy)>65&&Math.abs(dy)>Math.abs(dx)*1.15)navigate(dy<0?1:-1)},{passive:true});d.onclick=e=>{if(e.target===d)close()}}
function navigate(dir){let a=navList(),panel=$("#m7lo-panel");if(a.length<2||panel?.dataset.m7Moving==="1")return;let i=a.findIndex(x=>String(x.id)===String(viewId));if(i<0)i=0;let next=a[(i+dir+a.length)%a.length];if(!panel)return view(next.id,dir>0?"next":"prev");panel.dataset.m7Moving="1";panel.classList.add(dir>0?"m7lo-swipe-out-up":"m7lo-swipe-out-down");setTimeout(()=>view(next.id,dir>0?"next":"prev"),220)}
function openGallery(postId,index=0){let x=items.find(q=>String(q.id)===String(postId))||ownerItems.find(q=>String(q.id)===String(postId)),a=x?.media||[];if(!a.length)return;index=(index+a.length)%a.length;let old=$("#m7lo-overlay");if(old)old.remove();let row=a[index],d=document.createElement("div");d.id="m7lo-overlay";d.innerHTML=`<div id="m7lo-panel" class="m7lo-gallery"><button class="m7lo-close m7lo-gallery-close">×</button><div class="m7lo-media-progress">${a.map((_,i)=>`<i class="${i===index?"on":""}"></i>`).join("")}</div><div class="m7lo-gallery-stage">${row.media_type==="video"?`<video src="${esc(row.media_url)}" controls autoplay playsinline></video>`:`<img src="${esc(row.media_url)}" alt="">`}${a.length>1?'<button class="m7lo-gallery-nav m7lo-gallery-prev">‹</button><button class="m7lo-gallery-nav m7lo-gallery-next">›</button>':""}</div><div class="m7lo-gallery-caption">${index+1} / ${a.length} · ${esc(x.title)}</div></div>`;document.body.appendChild(d);$(".m7lo-close",d).onclick=()=>view(postId);$(".m7lo-gallery-prev",d)?.addEventListener("click",()=>openGallery(postId,index-1));$(".m7lo-gallery-next",d)?.addEventListener("click",()=>openGallery(postId,index+1));let sx=0;d.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});d.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)openGallery(postId,index+(dx<0?1:-1))},{passive:true})}
function openShopPanel(slug){
  let shopSlug=String(slug||"").trim().toLowerCase();
  if(!shopSlug)return;
  let own=shopSlug===currentOwnerSlug();
  let list=items.filter(x=>String(x.shop_slug||"").toLowerCase()===shopSlug);
  let management=own?ownerItems.filter(x=>String(x.shop_slug||"").toLowerCase()===shopSlug):list;
  let old=$("#m7lo-overlay");
  if(old)old.remove();else lock();
  let d=document.createElement("div");
  d.id="m7lo-overlay";
  d.className="m7lo-shop-overlay";
  d.innerHTML=`<div id="m7lo-panel" class="m7lo-shop-panel" data-shop-slug="${esc(shopSlug)}"><button class="m7lo-close">×</button>${own?(ownerBar(management)+ownerActivityHtml(management,shopSlug)):section(management,true,false,shopSlug)}</div>`;
  document.body.appendChild(d);
  $(".m7lo-close",d).onclick=close;
  d.onclick=e=>{if(e.target===d)close()};
  bind(d);
  const designRoot=d.querySelector(".m7lo")||d.querySelector("#m7lo-panel")||d;
  m7loApplyDesign(
    designRoot,
    (profileOptions.get(shopSlug)||{}).directory_options||{}
  );
  if(designRoot?.classList?.contains("m7lo")){
    designRoot.style.setProperty("border","0","important");
    designRoot.style.setProperty("box-shadow","none","important");
    designRoot.style.setProperty("background","transparent","important");
    designRoot.style.setProperty("padding","0","important");
    designRoot.querySelectorAll(".m7lo-card").forEach(cardEl=>{
      cardEl.style.setProperty("border-width","0","important");
      cardEl.style.setProperty("box-shadow","none","important");
    });
  }
  timers();
}
function managerRow(m,i,total){let preview=m.media_type==="video"?`<video class="m7lo-media-thumb" src="${esc(m.media_url)}" muted playsinline preload="metadata"></video>`:`<img class="m7lo-media-thumb" src="${esc(m.media_url)}" alt="">`;return`<div class="m7lo-media-row" data-manager-id="${esc(m.id)}">${preview}<div><strong>${m.is_cover?"COVER":"Media "+(i+1)}</strong><div class="m7lo-sub">${m.media_type}</div><button class="m7lo-small-btn" data-move="up" ${i===0?"disabled":""}>↑</button><button class="m7lo-small-btn" data-move="down" ${i===total-1?"disabled":""}>↓</button></div><button class="m7lo-small-btn m7lo-cover" data-cover ${m.is_cover?"disabled":""}>${m.is_cover?"Cover":"Set cover"}</button><button class="m7lo-small-btn m7lo-danger" data-delete>Delete</button></div>`}
function mediaManager(id){let x=ownerItems.find(q=>String(q.id)===String(id));if(!x||String(x.shop_slug).toLowerCase()!==ownerSlug)return;$("#m7lo-overlay")?.remove();lock();let a=x.media||[],d=document.createElement("div");d.id="m7lo-overlay";d.innerHTML=`<div id="m7lo-panel"><button class="m7lo-close">×</button><div class="m7lo-panel-title">Manage media</div><p class="m7lo-sub">Choose the cover, change the order, add more, or delete individual files. Maximum 8.</p><div class="m7lo-media-list">${a.map((m,i)=>managerRow(m,i,a.length)).join("")||'<div class="m7lo-empty">No media yet.</div>'}</div><label class="m7lo-file" style="display:block;margin-top:12px">＋ Add photos / videos<input id="m7lo-manager-files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" hidden></label><div id="m7lo-manager-status" class="m7lo-status"></div></div>`;document.body.appendChild(d);$(".m7lo-close",d).onclick=close;$("#m7lo-manager-files",d).onchange=e=>addMedia(x,[...(e.target.files||[])]);$all('[data-manager-id]',d).forEach(row=>{let mid=row.dataset.managerId,m=a.find(q=>String(q.id)===String(mid));$("[data-cover]",row).onclick=()=>setCover(x,m);$("[data-delete]",row).onclick=()=>deleteMedia(x,m);$all('[data-move]',row).forEach(b=>b.onclick=()=>moveMedia(x,m,b.dataset.move))})}
async function refreshManager(postId,message){await load();mediaManager(postId);let st=$("#m7lo-manager-status");if(st&&message)st.textContent=message}
async function addMedia(x,files){let st=$("#m7lo-manager-status");try{let existing=(x.media||[]).length;if(!files.length)return;if(existing+files.length>8)throw new Error(`You can add ${Math.max(0,8-existing)} more file(s).`);let uploaded=[];for(let file of files)uploaded.push(await uploadLiveFile(file,String(x.id),st));let rows=uploaded.map((m,i)=>({post_id:Number(x.id),shop_slug:ownerSlug,media_url:m.media_url,storage_path:m.storage_path,media_type:m.media_type,sort_order:existing+i,is_cover:existing===0&&i===0,created_by:session.user.id})),r=await c.from("shop_live_post_media").insert(rows);if(r.error)throw r.error;if(existing===0&&rows[0])await c.rpc("ma7alak_update_live_post",{p_post_id:Number(x.id),p_post:{media_url:rows[0].media_url,media_type:rows[0].media_type}});await refreshManager(x.id,"Media added.")}catch(err){if(st)st.textContent=err.message||String(err)}}
async function setCover(x,m){let st=$("#m7lo-manager-status");try{st.textContent="Updating cover…";let a=await c.from("shop_live_post_media").update({is_cover:false}).eq("post_id",Number(x.id));if(a.error)throw a.error;let b=await c.from("shop_live_post_media").update({is_cover:true}).eq("id",Number(m.id)).eq("post_id",Number(x.id));if(b.error)throw b.error;let r=await c.rpc("ma7alak_update_live_post",{p_post_id:Number(x.id),p_post:{media_url:m.media_url,media_type:m.media_type}});if(r.error)throw r.error;await refreshManager(x.id,"Cover updated.")}catch(err){st.textContent=err.message||String(err)}}
async function deleteMedia(x,m){if(!confirm("Delete this photo / video?"))return;let st=$("#m7lo-manager-status");try{let r=await c.from("shop_live_post_media").delete().eq("id",Number(m.id)).eq("post_id",Number(x.id));if(r.error)throw r.error;if(m.storage_path){let s=await c.storage.from(BUCKET).remove([m.storage_path]);if(s.error)console.warn("Media file cleanup:",s.error)}let remaining=(x.media||[]).filter(q=>String(q.id)!==String(m.id));if(m.is_cover){let next=remaining[0]||null;if(next){await c.from("shop_live_post_media").update({is_cover:true}).eq("id",Number(next.id));let u=await c.rpc("ma7alak_update_live_post",{p_post_id:Number(x.id),p_post:{media_url:next.media_url,media_type:next.media_type}});if(u.error)throw u.error}else{let u=await c.rpc("ma7alak_update_live_post",{p_post_id:Number(x.id),p_post:{media_url:null,media_type:null}});if(u.error)throw u.error}}await refreshManager(x.id,"Media deleted.")}catch(err){st.textContent=err.message||String(err)}}
async function moveMedia(x,m,dir){let a=(x.media||[]).slice().sort((p,q)=>p.sort_order-q.sort_order),i=a.findIndex(q=>String(q.id)===String(m.id)),j=dir==="up"?i-1:i+1;if(i<0||j<0||j>=a.length)return;let first=a[i],second=a[j],r1=await c.from("shop_live_post_media").update({sort_order:second.sort_order}).eq("id",Number(first.id)),r2=await c.from("shop_live_post_media").update({sort_order:first.sort_order}).eq("id",Number(second.id));if(r1.error||r2.error)return alert((r1.error||r2.error).message);await refreshManager(x.id,"Order updated.")}
function liveStoragePath(url){
  const marker="/storage/v1/object/public/"+BUCKET+"/";
  const value=String(url||"");
  const index=value.indexOf(marker);
  if(index<0)return"";
  try{return decodeURIComponent(value.slice(index+marker.length).split("?")[0])}catch(_){return""}
}
async function endPost(id){
  if(!confirm("End and permanently delete this Live / Offer now?"))return;

  const post=ownerItems.find(x=>String(x.id)===String(id));
  const paths=[...new Set([
    ...((post?.media||[]).map(m=>String(m.storage_path||liveStoragePath(m.media_url)||"").trim())),
    liveStoragePath(post?.media_url)
  ].filter(Boolean))];

  const r=await c.rpc("ma7alak_end_live_post",{p_post_id:Number(id)});
  if(r.error)return alert(r.error.message);

  removeLocalPost(id);

  if(document.querySelector("#m7lo-overlay .m7lo-shop-panel")){
    openShopPanel(post?.shop_slug||currentOwnerSlug());
  }else if(String(viewId)===String(id)){
    close();
  }

  if(paths.length){
    c.storage.from(BUCKET).remove(paths).then(cleanup=>{
      if(cleanup.error){
        console.warn("SHOUFHON Live media cleanup retry:",cleanup.error);
        setTimeout(()=>c.storage.from(BUCKET).remove(paths).catch(()=>{}),1800);
      }
    }).catch(()=>{});
  }

  setTimeout(load,220);
}
function formHtml(x){let edit=!!x;const type=x?.post_type||"offer";const types=[["offer","🏷️","OFFER","Deal / price"],["happening","●","HAPPENING NOW","Right now"],["arrival","✨","NEW ARRIVAL","Just landed"],["event","▣","EVENT","Date / activity"]];return`<div id="m7lo-panel"><button class="m7lo-close">×</button><div class="m7lo-panel-title">${edit?"Edit Live / Offer":"Add Live / Offer"}</div><div class="m7lo-types">${types.map(a=>`<button class="m7lo-type ${a[0]===type?"on":""}" data-m7-type="${a[0]}" type="button"><span class="m7lo-type-icon">${a[1]}</span><span class="m7lo-type-copy"><b>${a[2]}</b><small>${a[3]}</small></span></button>`).join("")}</div><form id="m7lo-form" class="m7lo-form"><input id="m7lo-type" type="hidden" value="${esc(type)}"><input id="m7lo-title" class="m7lo-in" maxlength="70" required placeholder="Title" value="${esc(x?.title||"")}"><textarea id="m7lo-desc" class="m7lo-ta" maxlength="400" placeholder="Description">${esc(x?.description||"")}</textarea><input id="m7lo-location" class="m7lo-in" maxlength="120" placeholder="📍 Location" value="${esc(x?.location_text||"")}"><div id="m7lo-prices" class="m7lo-two" style="display:${type==="offer"?"grid":"none"}"><input id="m7lo-original" class="m7lo-in" type="number" min="0" step=".01" placeholder="Original $" value="${x?.original_price??""}"><input id="m7lo-offer" class="m7lo-in" type="number" min="0" step=".01" placeholder="Offer $" value="${x?.offer_price??""}"></div><div class="m7lo-two m7lo-time-row"><label class="m7lo-field"><span class="m7lo-label">STARTS</span><input id="m7lo-start" class="m7lo-in" type="datetime-local"></label><label class="m7lo-field"><span class="m7lo-label">ENDS *</span><input id="m7lo-finish" class="m7lo-in" type="datetime-local" required></label></div>${edit?"":`<label class="m7lo-file">📷 Add up to 8 photos / videos<input id="m7lo-file" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" hidden></label><div id="m7lo-file-name" class="m7lo-sub"></div>`}<button class="m7lo-btn" type="submit">${edit?"Save Changes":"⚡ Publish"}</button><div id="m7lo-status" class="m7lo-status"></div></form></div>`}
function localValue(v){let d=new Date(v);return new Date(d-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
function wireForm(d,x){$(".m7lo-close",d).onclick=close;$all('[data-m7-type]',d).forEach(b=>b.onclick=()=>{$all('[data-m7-type]',d).forEach(q=>q.classList.remove("on"));b.classList.add("on");$("#m7lo-type").value=b.dataset.m7Type;$("#m7lo-prices").style.display=b.dataset.m7Type==="offer"?"grid":"none"});if(x){$("#m7lo-start").value=localValue(x.starts_at);$("#m7lo-finish").value=localValue(x.ends_at);$("#m7lo-form").onsubmit=e=>saveEdit(e,x.id)}else{let h=Math.min(6,Math.max(1,Number(ent?.max_duration_hours||48))),f=new Date(Date.now()+h*3600000);$("#m7lo-finish").value=localValue(f);$("#m7lo-file").onchange=e=>{let n=e.target.files?.length||0;$("#m7lo-file-name").textContent=n?`${n} file${n===1?"":"s"} selected · first file becomes the cover`:""};$("#m7lo-form").onsubmit=publish}}
function creator(){if(!ent?.enabled||ownerItems.length>=Number(ent.active_limit||0))return;$("#m7lo-overlay")?.remove();let d=document.createElement("div");d.id="m7lo-overlay";lock();d.innerHTML=formHtml(null);document.body.appendChild(d);wireForm(d,null)}
function editor(id){let x=ownerItems.find(q=>String(q.id)===String(id));if(!x||String(x.shop_slug).toLowerCase()!==ownerSlug)return;$("#m7lo-overlay")?.remove();let d=document.createElement("div");d.id="m7lo-overlay";lock();d.innerHTML=formHtml(x);document.body.appendChild(d);wireForm(d,x)}
function payloadBase(){let type=$("#m7lo-type").value;return{post_type:type,title:$("#m7lo-title").value.trim(),description:$("#m7lo-desc").value.trim()||null,location_text:$("#m7lo-location").value.trim()||null,starts_at:new Date($("#m7lo-start").value||Date.now()).toISOString(),ends_at:new Date($("#m7lo-finish").value).toISOString(),original_price:type==="offer"&&$("#m7lo-original").value?Number($("#m7lo-original").value):null,offer_price:type==="offer"&&$("#m7lo-offer").value?Number($("#m7lo-offer").value):null}}
async function saveEdit(e,id){e.preventDefault();let st=$("#m7lo-status"),p=payloadBase();st.textContent="Saving…";if(new Date(p.ends_at)<=new Date(p.starts_at)){st.textContent="End time must be after start.";return}let existing=ownerItems.find(x=>String(x.id)===String(id))||items.find(x=>String(x.id)===String(id));let r=await c.rpc("ma7alak_update_live_post",{p_post_id:Number(id),p_post:p});if(r.error){st.textContent=r.error.message;return}if(existing)upsertLocalPost({...existing,...p,id:Number(id),status:"active"});close();setTimeout(load,180)}
async function uploadLiveFile(file,postKey,statusEl){if(file.size>50*1024*1024)throw new Error(`${file.name}: maximum file size is 50 MB.`);let mediaType=file.type.startsWith("video/")?"video":"image",ext=(file.name.split(".").pop()||"bin").replace(/[^a-z0-9]/gi,""),path=`${ownerSlug}/${postKey}/${crypto.randomUUID?crypto.randomUUID():Date.now()+Math.random()}.${ext}`;statusEl&&(statusEl.textContent=`Uploading ${file.name}…`);let u=await c.storage.from(BUCKET).upload(path,file,{contentType:file.type,cacheControl:"86400",upsert:false});if(u.error)throw u.error;return{media_url:c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,media_type:mediaType,storage_path:path}}
async function publish(e){e.preventDefault();let st=$("#m7lo-status"),btn=e.submitter;btn.disabled=true;try{await identity();if(!ownerSlug||!ent?.enabled)throw new Error("Live & Offers is not enabled.");let p=payloadBase(),start=new Date(p.starts_at),finish=new Date(p.ends_at),max=Number(ent.max_duration_hours||48),files=[...($("#m7lo-file").files||[])];if(files.length>8)throw new Error("You can upload up to 8 photos / videos per offer.");if(!finish.getTime()||finish<=start)throw new Error("End time must be after start.");if(finish-start>max*3600000)throw new Error(`Maximum duration is ${max} hours.`);let uploaded=[];for(let i=0;i<files.length;i++)uploaded.push(await uploadLiveFile(files[i],`pending-${Date.now()}`,st));let sp=await c.from("shop_profiles").select("shop_name,profile_image_url,shop_url,directory_options").eq("shop_slug",ownerSlug).maybeSingle(),cover=uploaded[0]||{};Object.assign(p,{shop_slug:ownerSlug,shop_name:sp.data?.shop_name||ownerSlug,media_url:cover.media_url||null,media_type:cover.media_type||null});st.textContent="Publishing…";let r=await c.rpc("ma7alak_create_live_post",{p_post:p});if(r.error)throw r.error;let postId=Number(r.data),rows=[];if(uploaded.length){rows=uploaded.map((m,i)=>({post_id:postId,shop_slug:ownerSlug,media_url:m.media_url,storage_path:m.storage_path,media_type:m.media_type,sort_order:i,is_cover:i===0,created_by:session.user.id}));let ins=await c.from("shop_live_post_media").insert(rows);if(ins.error)throw ins.error}let localMedia=rows.map((m,i)=>({...m,id:"local-"+postId+"-"+i}));upsertLocalPost({...p,id:postId,status:"active",profile_image_url:sp.data?.profile_image_url||null,shop_url:sp.data?.shop_url||null,directory_options:sp.data?.directory_options||{},media:localMedia,media_url:cover.media_url||null,media_type:cover.media_type||null});st.textContent="✓ Published — You are now live!";liveToast("✓ Published — You are now live!");setTimeout(()=>{close();load().catch(err=>console.warn("SHOUFHON Live refresh:",err))},650)}catch(err){st.textContent=err.message||String(err);btn.disabled=false}}
function sortLocalLive(list){return list.sort((a,b)=>new Date(b.starts_at||b.created_at||0)-new Date(a.starts_at||a.created_at||0))}
function commitLocalLiveState(){
  items=sortLocalLive(activeCachedItems(items));
  ownerItems=sortLocalLive(activeCachedItems(ownerItems));
  writeLiveCache(items);
  lastRenderSignature="";
  render();
  broadcast();
}
function upsertLocalPost(post){
  if(!post||post.id==null)return;
  const id=String(post.id);
  items=[post,...items.filter(x=>String(x.id)!==id)];
  if(String(post.shop_slug||"").toLowerCase()===currentOwnerSlug()){
    ownerItems=[post,...ownerItems.filter(x=>String(x.id)!==id)];
  }
  commitLocalLiveState();
}
function removeLocalPost(id){
  const key=String(id);
  items=items.filter(x=>String(x.id)!==key);
  ownerItems=ownerItems.filter(x=>String(x.id)!==key);
  commitLocalLiveState();
}
function publicData(shop){
  const slug=String(shop||"").trim().toLowerCase();
  const list=slug?items.filter(x=>String(x.shop_slug).toLowerCase()===slug):items;
  let video=[];
  try{
    video=(Array.isArray(window.ShoufHonLiveVideo?.bridgeItems)?window.ShoufHonLiveVideo.bridgeItems:[]);
    if(slug)video=video.filter(x=>String(x?.shop_slug||"").trim().toLowerCase()===slug);
  }catch(_){video=[]}
  return [...list.map(x=>({...x})),...video.map(x=>({...x}))];
}
async function ensureProfileOptions(shopSlug){
  let s=String(shopSlug||"").trim().toLowerCase();
  if(!s)return{};
  let cached=profileOptions.get(s);
  if(cached&&cached.directory_options)return cached.directory_options;
  c=resolveClient()||c;
  if(!c)return{};
  try{
    let r=await c.from("shop_profiles").select("shop_slug,profile_image_url,shop_url,directory_options").eq("shop_slug",s).maybeSingle();
    if(!r.error&&r.data){
      profileOptions.set(s,r.data);
      return r.data.directory_options&&typeof r.data.directory_options==="object"?r.data.directory_options:{};
    }
  }catch(err){
    console.warn("SHOUFHON Live profile design:",err);
  }
  return{};
}
function currentOwnerSlug(){
  return String(window.Ma7alakOwnerAuth?.owner?.shop_slug||ownerSlug||"").trim().toLowerCase();
}
function send(win,type,shop){
  try{
    const s=String(shop||"").trim().toLowerCase();
    const activeOwner=currentOwnerSlug();
    const own=!!(s&&activeOwner===s);
    const offerItems=publicData(s);
    const videos=videoLiveRows(s);
    const stream=videos[0]||null;
    const p=s?(profileOptions.get(s)||{}):{};
    const first=offerItems[0]||stream||{};
    win?.postMessage({
      type,
      shopSlug:s,
      items:offerItems,
      owner:own,
      entitlement:own?ent:null,
      ownerActive:own?ownerItems.filter(x=>String(x.shop_slug||"").toLowerCase()===s).length:0,
      directoryOptions:p.directory_options||{},
      broadcastLive:!!stream,
      stream:stream?{
        id:stream.id,
        stream_id:stream.stream_id,
        shop_slug:stream.shop_slug,
        shop_name:stream.shop_name,
        title:stream.title,
        profile_image_url:stream.profile_image_url||null,
        media_url:stream.media_url||null
      }:null,
      offerCount:offerItems.length,
      shop:{
        name:String(p.shop_name||p.arabic_name||first.shop_name||s||"Shop"),
        profile_image_url:String(p.profile_image_url||first.profile_image_url||""),
        shop_url:String(p.shop_url||first.shop_url||"")
      }
    },"*");
  }catch(_){}
}
function broadcast(){
  const allItems=publicData("");
  try{window.postMessage({type:"MA7ALAK_LIVE_OFFERS_UPDATED",items:allItems},"*")}catch(_){}
  const activeOwner=currentOwnerSlug();
  document.querySelectorAll("iframe").forEach(f=>{
    try{
      send(f.contentWindow,"MA7ALAK_LIVE_OFFERS_STATE","");
      if(activeOwner)send(f.contentWindow,"MA7ALAK_LIVE_OFFERS_STATE",activeOwner);
    }catch(_){}
  });
}
let liveStateRefreshPromise=null;
async function ensureFreshLiveState(){
  if(liveStateRefreshPromise)return liveStateRefreshPromise;
  liveStateRefreshPromise=(async()=>{
    if(!c){
      try{await ready()}catch(_){}
      c=resolveClient()||c;
    }
    if(!c)return false;

    let wait=0;
    while(refreshing&&wait<40){
      await sleep(50);
      wait++;
    }

    await identity();

    if(!refreshing){
      await load();
    }else{
      wait=0;
      while(refreshing&&wait<40){
        await sleep(50);
        wait++;
      }
    }

    return true;
  })().finally(()=>{
    liveStateRefreshPromise=null;
  });
  return liveStateRefreshPromise;
}
async function refreshOwnerStateForShop(shopSlug){
  c=resolveClient()||c;
  if(!c)return false;
  await identity();
  return currentOwnerSlug()===String(shopSlug||"").trim().toLowerCase();
}
function trustedBridgeSource(source){
  if(!source)return false;
  if(source===window)return true;
  try{
    return [...document.querySelectorAll("iframe")].some(frame=>frame.contentWindow===source);
  }catch(_){return false}
}
function bridge(){
  addEventListener("message",e=>{
    if(!trustedBridgeSource(e.source))return;
    const d=e.data||{},s=String(d.shopSlug||"").trim().toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,60);

    if(d.type==="MA7ALAK_LIVE_OFFERS_GET"){
      send(e.source,"MA7ALAK_LIVE_OFFERS_STATE",s);
      (async()=>{
        await ensureFreshLiveState();
        if(s)await ensureProfileOptions(s);
        send(e.source,"MA7ALAK_LIVE_OFFERS_STATE",s);
      })().catch(err=>console.warn("SHOUFHON Live state refresh:",err));
      return;
    }

    if(d.type==="MA7ALAK_DESIGN_PREVIEW"){
      const previewSlug=String(d.shop_slug||d.shopSlug||"").trim().toLowerCase();
      if(!previewSlug)return;

      const draft=
        d.profile&&typeof d.profile==="object"
          ? d.profile
          : {};

      const old=profileOptions.get(previewSlug)||{shop_slug:previewSlug};

      profileOptions.set(previewSlug,{
        ...old,
        ...draft,
        shop_slug:previewSlug,
        directory_options:{
          ...(old.directory_options&&typeof old.directory_options==="object"?old.directory_options:{}),
          ...(d.directory_options&&typeof d.directory_options==="object"?d.directory_options:{})
        }
      });

      /*
         Existing Live rows contain a saved snapshot of shop identity.
         Overlay the unsaved Admin draft locally so name/avatar/shop URL
         change instantly without touching the database until Save.
      */
      const patchIdentity=function(row){
        if(String(row&&row.shop_slug||"").trim().toLowerCase()!==previewSlug){
          return row;
        }

        return {
          ...row,
          shop_name:
            String(draft.shop_name||"").trim() ||
            row.shop_name,
          profile_image_url:
            String(draft.profile_image_url||"").trim() ||
            row.profile_image_url,
          shop_url:
            String(draft.shop_url||"").trim() ||
            row.shop_url
        };
      };

      items=items.map(patchIdentity);
      ownerItems=ownerItems.map(patchIdentity);

      lastRenderSignature="";
      render();

      if(
        viewId!=null &&
        [...items,...ownerItems]
          .some(row=>String(row.id)===String(viewId)&&String(row.shop_slug||"").trim().toLowerCase()===previewSlug)
      ){
        view(viewId);
      }

      return;
    }

    if(d.type==="MA7ALAK_LIVE_OFFERS_VIEW"){
      const id=String(d.id||"");
      if(id.startsWith("video:"))return window.ShoufHonLiveVideo?.open?.(id.slice(6));
      return view(d.id);
    }

    if(d.type==="MA7ALAK_LIVE_OFFERS_OPEN_SHOP"){
      openShopPanel(s);
      (async()=>{
        await ensureFreshLiveState();
        if(document.querySelector("#m7lo-overlay .m7lo-shop-panel"))openShopPanel(s);
      })().catch(err=>console.warn("SHOUFHON Live shop panel refresh:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_OWNER_MANAGE"){
      (async()=>{
        if(!await refreshOwnerStateForShop(s))return;
        await ensureFreshLiveState();
        openShopPanel(s);
      })().catch(err=>console.warn("SHOUFHON Live owner manage:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_VIDEO_OPEN_SHOP"){
      (async()=>{
        await ensureFreshLiveState();
        const live=videoLiveRows(s)[0];
        if(live?.stream_id)window.ShoufHonLiveVideo?.open?.(live.stream_id);
        else openShopPanel(s);
      })().catch(err=>console.warn("SHOUFHON Live video open:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_VIDEO_GO"){
      (async()=>{
        if(!await refreshOwnerStateForShop(s))return;
        close();
        setTimeout(()=>window.ShoufHonLiveVideo?.goLive?.(),0);
      })().catch(err=>console.warn("SHOUFHON Live video start:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_OFFERS_VIEW_FIRST"){
      (async()=>{
        await ensureFreshLiveState();
        const first=publicData(s)[0];
        if(first)view(first.id);else openShopPanel(s);
      })().catch(err=>console.warn("SHOUFHON Live first offer:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_OFFERS_CREATE"){
      (async()=>{if(await refreshOwnerStateForShop(s))creator()})().catch(err=>console.warn("SHOUFHON Live create:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_OFFERS_END"){
      (async()=>{if(await refreshOwnerStateForShop(s))endPost(d.id)})().catch(err=>console.warn("SHOUFHON Live end:",err));
      return;
    }

    if(d.type==="MA7ALAK_LIVE_OFFERS_EDIT"){
      (async()=>{if(await refreshOwnerStateForShop(s))editor(d.id)})().catch(err=>console.warn("SHOUFHON Live edit:",err));
    }
  });
}
async function realtime(){try{if(channel)c.removeChannel(channel)}catch(_){}channel=c.channel("m7-live-offers-v5").on("postgres_changes",{event:"*",schema:"public",table:"shop_live_posts"},()=>{load();setTimeout(load,300)}).on("postgres_changes",{event:"*",schema:"public",table:"shop_live_post_media"},()=>{load();setTimeout(load,300)}).on("postgres_changes",{event:"*",schema:"public",table:"shop_live_entitlements"},async()=>{await identity();await load()}).on("postgres_changes",{event:"UPDATE",schema:"public",table:"shop_profiles"},payload=>{let s=String(payload?.new?.shop_slug||payload?.old?.shop_slug||"").trim().toLowerCase();(async()=>{if(s){profileOptions.delete(s);await ensureProfileOptions(s)}await load();broadcast()})().catch(()=>load())}).subscribe()}
function openLiveDeepLinkFromUrl(){
  try{
    const url=new URL(window.location.href);
    const id=String(url.searchParams.get("live")||"").trim();

    if(!id)return false;

    const exists=
      [...items,...ownerItems]
        .some(row=>String(row?.id)===id);

    if(!exists)return false;

    view(id);

    url.searchParams.delete("live");

    const next=
      url.pathname+
      (url.searchParams.toString()
        ? "?"+url.searchParams.toString()
        : "")+
      url.hash;

    history.replaceState(
      history.state,
      "",
      next
    );

    return true;
  }catch(error){
    console.warn(
      "SHOUFHON Live deep link:",
      error
    );
    return false;
  }
}

async function init(){
  css();
  galleryCss();
  motionCss();
  panelPremiumCss();
  bridge();

  if(hydrateLiveCache()){
    lastRenderSignature="";
    render();
    broadcast();
  }

  window.Ma7alakLiveOffers={
    refresh:load,
    open:view,
    close:close,
    create:creator,
    edit:editor,
    media:mediaManager,
    get items(){return publicData("")},
    get ownerSlug(){return ownerSlug}
  };

  while(!await ready())await sleep(1000);
  await identity();
  await load();
  openLiveDeepLinkFromUrl();
  await realtime();

  setInterval(timers,1000);
  setInterval(()=>{if(!document.hidden)load()},60000);

  addEventListener("ma7alak:account-change",async()=>{
    c=resolveClient()||c;
    lastRenderSignature="";
    await identity();
    await load();
  });

  addEventListener("ma7alak:owner-auth-change",async()=>{
    c=resolveClient()||c;
    lastRenderSignature="";
    await identity();
    await load();
  });

  addEventListener("shoufhon:live-video-state",()=>{
    lastRenderSignature="";
    render();
    broadcast();
  });

  let wakeSyncing=false,lastWakeSyncAt=0;
  const wakeSync=async()=>{
    const now=Date.now();
    if(wakeSyncing||document.hidden||now-lastWakeSyncAt<900)return;
    lastWakeSyncAt=now;
    wakeSyncing=true;
    try{
      c=resolveClient()||c;
      lastRenderSignature="";
      await identity();
      await load();
    }finally{
      wakeSyncing=false;
    }
  };

  addEventListener("ma7alak:page-wake",wakeSync);
  addEventListener("message",event=>{
    if(event.data?.type==="MA7ALAK_PAGE_WAKE"&&trustedBridgeSource(event.source))wakeSync();
  });
  addEventListener("pageshow",wakeSync);
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible")wakeSync();
  });
}
init().catch(e=>console.error("SHOUFHON Live & Offers:",e));
})();


/* =========================================================
   SHOUFHON LIVE VIDEO LOADER
   Keeps the existing Live & Offers install line as the single
   Hostinger entry point for realtime Agora broadcasting.
   ========================================================= */
(function(){
  "use strict";
  if(window.self!==window.top)return;
  if(window.__SHOUFHON_LIVE_VIDEO_LOADER__)return;
  window.__SHOUFHON_LIVE_VIDEO_LOADER__=true;
  var s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@5819b7a1373e903257ba5f86e02a64bda3dd444f/ma7alak-live-video.js";
  s.async=true;
  s.onerror=function(){console.error("SHOUFHON Live Video: failed to load");};
  document.head.appendChild(s);
})();
