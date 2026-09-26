/* =========================================================
   SHOUFHON — SHOP CATALOG / MENU & PRICES V1
   Phone-first viewer + full-screen owner manager.
========================================================= */
(function(){
"use strict";
if(window.__SHOUFHON_SHOP_CATALOG_V1__)return;
window.__SHOUFHON_SHOP_CATALOG_V1__=true;

var ROOT_ID="m7-shop-catalog";
var SB_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
var SB_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
var root=null,slug="",snap=null,ownerSnap=null,isOwner=false,activeSection="",pending=new Map();
var editorOpen=false,productOpen=false,browserOpen=false,launcherOnly=false,productIndex=0,productItems=[],editorView={mode:"home",sectionId:null,itemId:null};
var editorBusy=false,draftImage=null,lastHeight=-1,realtimeRegistered=false,resizeObserver=null;
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
var esc=function(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]})};
var truth=function(v){return v===true||["true","1","yes","on"].indexOf(String(v||"").trim().toLowerCase())>=0};

function target(){try{if(window.top&&window.top!==window)return window.top}catch(_){}try{if(window.parent&&window.parent!==window)return window.parent}catch(_){}return null}
function trusted(e){var t=target();return !!(e&&t&&e.source===t)}
function post(d){try{target()?.postMessage(d,"*")}catch(_){}}
function norm(v){var s=String(v||"").trim().toLowerCase();try{s=decodeURIComponent(s)}catch(_){}s=s.replace(/^\/+|\/+$/g,"");return /^[a-z0-9][a-z0-9._&-]{0,119}$/i.test(s)?s:""}
function hex(v,f){v=String(v||"").trim();return /^#[0-9a-f]{6}$/i.test(v)?v:f}
function num(v,f,min,max){var n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):f}

async function resolveSlug(){
  if(slug)return slug;
  root=$("#"+ROOT_ID);
  slug=norm(root?.getAttribute("data-shop-slug"));
  if(slug)return slug;
  try{
    var c=window.ShoufHonShopContextClient;
    if(c)slug=norm(await c.resolve({explicit:"",fallback:function(){return c.detectPageSlug()},timeout:1500}));
  }catch(_){}
  if(slug)return slug;
  try{
    var u=document.referrer?new URL(document.referrer):null,p=(u?.pathname||"").split("/").filter(Boolean);
    slug=norm(p[p.length-1]||"");
  }catch(_){}
  return slug;
}

function theme(s){
  if(!root)return;
  var o=s?.options||{},a=hex(o.gallery_accent_color||o.story_color||o.card_color,"#d9a441");
  root.style.setProperty("--cat-a",a);
  root.style.setProperty("--cat-title",hex(o.media_title_color,"#fff"));
  root.style.setProperty("--cat-muted",hex(o.media_count_color,"#d0c8bf"));
  root.style.setProperty("--cat-bg",hex(o.media_header_bg_color||o.profile_shell_bg_color,"#100e0c"));
  root.style.setProperty("--cat-edge",hex(o.media_header_frame_color||o.profile_shell_border_color,a));
  root.style.setProperty("--cat-symbol",hex(o.media_symbol_color,a));
  root.style.setProperty("--cat-symbol-bg",hex(o.media_symbol_bg_color,"#171411"));
  root.style.setProperty("--cat-btn-bg",hex(o.media_button_bg_color,"#17130f"));
  root.style.setProperty("--cat-btn-edge",hex(o.media_button_frame_color,a));
  root.style.setProperty("--cat-btn-text",hex(o.media_button_text_color,"#ded7cf"));
  root.style.setProperty("--cat-on-bg",hex(o.media_button_active_bg_color,"#2b241d"));
  root.style.setProperty("--cat-on-edge",hex(o.media_button_active_frame_color,a));
  root.style.setProperty("--cat-on-text",hex(o.media_button_active_text_color,"#fff"));
  root.style.setProperty("--cat-r",num(o.profile_shell_radius,22,12,34)+"px");
  ["--cat-a","--cat-title","--cat-muted","--cat-bg","--cat-edge","--cat-symbol","--cat-symbol-bg","--cat-btn-bg","--cat-btn-edge","--cat-btn-text","--cat-on-bg","--cat-on-edge","--cat-on-text","--cat-r"].forEach(function(k){
    document.documentElement.style.setProperty(k,root.style.getPropertyValue(k));
  });
}

async function publicLoad(){
  var r=await fetch(SB_URL+"/rest/v1/rpc/ma7alak_get_shop_catalog",{
    method:"POST",headers:{apikey:SB_KEY,"Content-Type":"application/json",Accept:"application/json"},
    body:JSON.stringify({p_shop_slug:slug}),cache:"no-store"
  });
  var tx=await r.text(),d=null;try{d=tx?JSON.parse(tx):null}catch(_){}
  if(!r.ok)throw new Error(d?.message||"Could not load Catalog.");
  return d||{enabled:false,sections:[]};
}
function emitSnapshot(){
  try{
    window.dispatchEvent(new CustomEvent("shoufhon:catalog-snapshot",{detail:{
      shopSlug:slug,
      snapshot:snap||null,
      enabled:!!snap?.enabled,
      isOwner:!!isOwner
    }}));
  }catch(_){}
}
async function refresh(){
  try{
    snap=await publicLoad();
    theme(snap);
    emitSnapshot();
    if(!launcherOnly)renderPublic();
  }catch(e){
    console.warn("[ShoufHon Catalog]",e);
    if(!launcherOnly)collapse();
  }
}

function request(op,extra){
  return new Promise(function(resolve,reject){
    var id=(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+"-"+Date.now();
    var timer=setTimeout(function(){pending.delete(id);reject(new Error("Catalog request timed out."))},60000);
    pending.set(id,{resolve:resolve,reject:reject,timer:timer});
    post(Object.assign({type:"SHOUFHON_OWNER_CATALOG_REQUEST",requestId:id,shopSlug:slug,op:op},extra||{}));
  });
}
function ownerState(){post({type:"MA7ALAK_OWNER_STATE_GET",shopSlug:slug})}
function registerRealtime(){if(realtimeRegistered||!slug)return;realtimeRegistered=true;post({type:"SHOUFHON_CATALOG_REALTIME_REGISTER",shopSlug:slug})}
function unregisterRealtime(){if(!realtimeRegistered)return;realtimeRegistered=false;post({type:"SHOUFHON_CATALOG_REALTIME_UNREGISTER",shopSlug:slug})}
function portal(open,kind){post({type:open?"SHOUFHON_EMBED_VIEWER_OPEN":"SHOUFHON_EMBED_VIEWER_CLOSE",viewerKind:kind,shopSlug:slug})}

function reportHeight(force){
  if(!root)return;
  requestAnimationFrame(function(){
    var hidden=root.dataset.hidden==="1";
    var h=hidden?0:Math.max(1,Math.ceil(document.documentElement.scrollHeight||document.body.scrollHeight||root.scrollHeight||1));
    if(!force&&h===lastHeight)return;
    lastHeight=h;post({type:"SHOUFHON_EMBED_HEIGHT",module:"catalog",shopSlug:slug,height:h});
  });
}
function heightObserver(){
  if(resizeObserver)return;
  resizeObserver=new ResizeObserver(function(){reportHeight(false)});
  resizeObserver.observe(document.documentElement);if(root)resizeObserver.observe(root);
  addEventListener("resize",function(){reportHeight(true)},{passive:true});
  addEventListener("load",function(){reportHeight(true)},{passive:true});
}
function collapse(){if(!root)return;root.dataset.hidden="1";root.innerHTML="";document.documentElement.classList.add("cat-zero");document.body.classList.add("cat-zero");reportHeight(true)}
function expand(){root.dataset.hidden="0";document.documentElement.classList.remove("cat-zero");document.body.classList.remove("cat-zero")}

function sections(s){
  return (s?.sections||[]).filter(function(x){return x&&x.is_visible!==false&&Array.isArray(x.items)&&x.items.some(function(i){return i&&i.is_visible!==false})});
}
function allItems(s){
  var out=[];sections(s).forEach(function(sec){(sec.items||[]).filter(function(i){return i&&i.is_visible!==false}).forEach(function(i){out.push(Object.assign({},i,{__sectionTitle:sec.title}))})});return out;
}
function money(v,c){
  if(v===null||v===undefined||v==="")return "";
  var n=Number(v);if(!Number.isFinite(n))return "";
  var s=Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,"").replace(/\.$/,"");
  c=String(c||"USD").toUpperCase();return c==="USD"?"$"+s:c==="LBP"?s+" LBP":s+" "+c;
}
function price(i,short){
  var m=String(i?.price_mode||"fixed");
  if(m==="free")return "Free";
  if(m==="contact")return i?.price_label||"Ask for price";
  if(m==="multiple"){
    var p=Array.isArray(i?.prices)?i.prices:[];
    if(!p.length)return "Options";
    var first=p[0],v=first.price_text||money(first.amount,first.currency);
    return short&&p.length>1?"From "+v:(short?v:"Multiple options");
  }
  var x=money(i?.base_price,i?.currency);
  return m==="from"?"From "+x:x;
}
function thumb(i){
  return i.image_url?'<div class="cat-thumb"><img src="'+esc(i.image_url)+'" alt="" loading="lazy"></div>':'<div class="cat-thumb blank"><span>✦</span></div>';
}

function renderPublic(){
  if(!root)return;
  var s=snap||{},secs=sections(s);
  if(!s.enabled){collapse();return}
  if(!secs.length&&!isOwner){collapse();return}
  expand();theme(s);

  if(!secs.length&&isOwner){
    root.innerHTML='<section class="cat-shell cat-empty-owner"><div class="cat-empty-icon">▤</div><div><small>CATALOG</small><h3>Your price list is ready to set up.</h3><p>Create sections, products, prices and photos. Visitors will see it after your first visible item.</p></div><button type="button" data-cat-edit>＋ Set up Catalog</button></section>';
    $("[data-cat-edit]",root).onclick=openEditor;reportHeight(true);return;
  }

  if(!activeSection||!secs.some(function(sx){return String(sx.id)===String(activeSection)}))activeSection=String(secs[0].id);
  var sec=secs.find(function(sx){return String(sx.id)===String(activeSection)})||secs[0];
  var items=(sec.items||[]).filter(function(i){return i&&i.is_visible!==false});
  root.innerHTML=
    '<section class="cat-shell">'+
      '<header class="cat-head"><div class="cat-symbol">▤</div><div class="cat-title"><small>SHOP CATALOG</small><h2>'+esc(s.catalog?.title||"Menu & Prices")+'</h2>'+(s.catalog?.subtitle?'<p>'+esc(s.catalog.subtitle)+'</p>':'')+'</div>'+(isOwner?'<button type="button" class="cat-edit" data-cat-edit>Edit</button>':'')+'</header>'+
      '<nav class="cat-tabs" aria-label="Catalog sections">'+secs.map(function(x){return '<button type="button" data-cat-section="'+esc(x.id)+'" class="'+(String(x.id)===String(sec.id)?"on":"")+'">'+esc(x.title)+'</button>'}).join("")+'</nav>'+
      '<div class="cat-section-copy"><div><h3>'+esc(sec.title)+'</h3>'+(sec.description?'<p>'+esc(sec.description)+'</p>':'')+'</div><span>'+items.length+' '+(items.length===1?"item":"items")+'</span></div>'+
      '<div class="cat-list">'+items.map(function(i,index){
        return '<button type="button" class="cat-item '+(!i.is_available?"sold":"")+'" data-cat-item="'+esc(i.id)+'">'+thumb(i)+
        '<span class="cat-copy">'+(i.badge?'<em>'+esc(i.badge)+'</em>':'')+'<b>'+esc(i.name)+'</b>'+(i.description?'<small>'+esc(i.description)+'</small>':'')+(!i.is_available?'<strong>Currently unavailable</strong>':'')+'</span>'+
        '<span class="cat-price">'+esc(price(i,true))+'<i>›</i></span></button>';
      }).join("")+'</div>'+
      (secs.length>1?'<div class="cat-swipe-hint"><span>‹</span> Swipe categories <span>›</span></div>':'')+
    '</section>';

  $$(".cat-tabs button",root).forEach(function(b){b.onclick=function(){activeSection=String(b.dataset.catSection);renderPublic()}});
  $$("[data-cat-item]",root).forEach(function(b){b.onclick=function(){openProduct(Number(b.dataset.catItem))}});
  $("[data-cat-edit]",root)?.addEventListener("click",openEditor);
  bindCategorySwipe();
  reportHeight(true);
}

function bindCategorySwipe(){
  var shell=$(".cat-list",root);if(!shell)return;
  var sx=0,sy=0;
  shell.addEventListener("touchstart",function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY},{passive:true});
  shell.addEventListener("touchend",function(e){
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.25)return;
    var ss=sections(snap),idx=ss.findIndex(function(x){return String(x.id)===String(activeSection)});
    idx=dx<0?idx+1:idx-1;if(idx>=0&&idx<ss.length){activeSection=String(ss[idx].id);renderPublic()}
  },{passive:true});
}


function browserSections(){
  return sections(snap);
}
function openBrowser(){
  if(!snap?.enabled)return;
  var ss=browserSections();
  if(!ss.length){
    if(isOwner)openEditor();
    return;
  }
  browserOpen=true;
  if(!activeSection||!ss.some(function(x){return String(x.id)===String(activeSection)})){
    activeSection=String(ss[0].id);
  }
  renderBrowser();
  $("#cat-browser").classList.add("open");
  $("#cat-browser").setAttribute("aria-hidden","false");
  portal(true,"catalog-browser");
}
function closeBrowser(opt){
  if(!browserOpen)return;
  browserOpen=false;
  $("#cat-browser").classList.remove("open");
  $("#cat-browser").setAttribute("aria-hidden","true");
  if(!opt?.fromPortalBack)portal(false,"catalog-browser");
}
function renderBrowser(){
  var ss=browserSections();
  if(!ss.length){
    if(isOwner){closeBrowser({fromPortalBack:true});openEditor()}
    return;
  }
  var sec=ss.find(function(x){return String(x.id)===String(activeSection)})||ss[0];
  activeSection=String(sec.id);
  var items=(sec.items||[]).filter(function(i){return i&&i.is_visible!==false});
  var browser=$("#cat-browser");
  browser.innerHTML=
    '<div class="catbr-head"><button type="button" data-br-close>‹</button>'+
      '<div><small>SHOP CATALOG</small><h2>'+esc(snap?.catalog?.title||"Menu & Prices")+'</h2>'+
      (snap?.catalog?.subtitle?'<p>'+esc(snap.catalog.subtitle)+'</p>':'')+'</div>'+
      (isOwner?'<button type="button" class="catbr-edit" data-br-edit>Edit</button>':'<span class="catbr-spacer"></span>')+
    '</div>'+
    '<div class="catbr-body">'+
      '<nav class="catbr-tabs">'+ss.map(function(x){return '<button type="button" data-br-section="'+esc(x.id)+'" class="'+(String(x.id)===String(sec.id)?"on":"")+'">'+esc(x.title)+'</button>'}).join("")+'</nav>'+
      '<div class="catbr-section"><div><h3>'+esc(sec.title)+'</h3>'+(sec.description?'<p>'+esc(sec.description)+'</p>':'')+'</div><span>'+items.length+' '+(items.length===1?"item":"items")+'</span></div>'+
      '<div class="catbr-list">'+items.map(function(i){
        return '<button type="button" class="cat-item '+(!i.is_available?"sold":"")+'" data-br-item="'+esc(i.id)+'">'+thumb(i)+
          '<span class="cat-copy">'+(i.badge?'<em>'+esc(i.badge)+'</em>':'')+'<b>'+esc(i.name)+'</b>'+(i.description?'<small>'+esc(i.description)+'</small>':'')+(!i.is_available?'<strong>Currently unavailable</strong>':'')+'</span>'+
          '<span class="cat-price">'+esc(price(i,true))+'<i>›</i></span></button>';
      }).join("")+'</div>'+
      (ss.length>1?'<div class="catbr-swipe"><span>‹</span> Swipe between categories <span>›</span></div>':'')+
    '</div>';

  $("[data-br-close]",browser).onclick=function(){closeBrowser()};
  $("[data-br-edit]",browser)?.addEventListener("click",function(){closeBrowser({fromPortalBack:true});setTimeout(openEditor,40)});
  $$("[data-br-section]",browser).forEach(function(b){
    b.onclick=function(){activeSection=String(b.dataset.brSection);renderBrowser()};
  });
  $$("[data-br-item]",browser).forEach(function(b){
    b.onclick=function(){openProduct(Number(b.dataset.brItem))};
  });

  var list=$(".catbr-list",browser),sx=0,sy=0;
  list?.addEventListener("touchstart",function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY},{passive:true});
  list?.addEventListener("touchend",function(e){
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.25)return;
    var pos=ss.findIndex(function(x){return String(x.id)===String(activeSection)});
    pos=dx<0?pos+1:pos-1;
    if(pos>=0&&pos<ss.length){activeSection=String(ss[pos].id);renderBrowser()}
  },{passive:true});
}

function openProduct(id){
  productItems=allItems(snap);productIndex=Math.max(0,productItems.findIndex(function(i){return Number(i.id)===Number(id)}));
  if(!productItems.length)return;
  productOpen=true;renderProduct();$("#cat-product").classList.add("open");$("#cat-product").setAttribute("aria-hidden","false");if(!browserOpen)portal(true,"catalog-product-viewer");
}
function closeProduct(opt){
  if(!productOpen)return;productOpen=false;$("#cat-product").classList.remove("open");$("#cat-product").setAttribute("aria-hidden","true");
  if(!opt?.fromPortalBack&&!browserOpen)portal(false,"catalog-product-viewer");
}
function renderProduct(){
  var i=productItems[productIndex];if(!i)return;
  var p=i.prices||[];
  $("#cat-product").innerHTML=
    '<div class="catpv-top"><button data-pv-close>×</button><div><small>'+esc(i.__sectionTitle||"CATALOG")+'</small><b>'+(productIndex+1)+' / '+productItems.length+'</b></div></div>'+
    '<div class="catpv-scroll">'+(i.image_url?'<div class="catpv-image"><img src="'+esc(i.image_url)+'" alt=""></div>':'')+
    '<article class="catpv-body">'+(i.badge?'<em>'+esc(i.badge)+'</em>':'')+'<h2>'+esc(i.name)+'</h2>'+(i.description?'<p>'+esc(i.description)+'</p>':'')+
    '<div class="catpv-main-price">'+esc(price(i,false))+'</div>'+
    (String(i.price_mode)==="multiple"?'<div class="catpv-options">'+p.map(function(x){return '<div><span>'+esc(x.label)+'</span><b>'+esc(x.price_text||money(x.amount,x.currency))+'</b></div>'}).join("")+'</div>':'')+
    (!i.is_available?'<div class="catpv-unavailable">Currently unavailable</div>':'')+
    '<div class="catpv-foot">Prices and availability are set by the shop.</div></article></div>'+
    (productItems.length>1?'<button class="catpv-arrow prev" data-pv-prev>‹</button><button class="catpv-arrow next" data-pv-next>›</button>':'');
  $("[data-pv-close]",$("#cat-product")).onclick=function(){closeProduct()};
  $("[data-pv-prev]",$("#cat-product"))?.addEventListener("click",function(){productIndex=(productIndex-1+productItems.length)%productItems.length;renderProduct()});
  $("[data-pv-next]",$("#cat-product"))?.addEventListener("click",function(){productIndex=(productIndex+1)%productItems.length;renderProduct()});
  var stage=$(".catpv-scroll",$("#cat-product")),x=0,y=0;
  stage?.addEventListener("touchstart",function(e){var t=e.touches[0];x=t.clientX;y=t.clientY},{passive:true});
  stage?.addEventListener("touchend",function(e){var t=e.changedTouches[0],dx=t.clientX-x,dy=t.clientY-y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.35&&productItems.length>1){productIndex=(productIndex+(dx<0?1:-1)+productItems.length)%productItems.length;renderProduct()}},{passive:true});
}

function toast(msg,error){
  var t=$("#cat-toast");if(!t)return;t.className="cate-toast "+(error?"error":"");t.innerHTML='<span>'+(error?"!":"✓")+'</span><b>'+esc(msg)+'</b>';
  requestAnimationFrame(function(){t.classList.add("show")});setTimeout(function(){t.classList.remove("show")},2200);
}
function setBusy(v){editorBusy=!!v;$("#cat-editor")?.classList.toggle("busy",editorBusy)}
function limits(){var o=ownerSnap?.options||{};return{sections:Math.round(num(o.catalog_max_sections,10,1,30)),items:Math.round(num(o.catalog_max_items,60,1,300)),prices:Math.round(num(o.catalog_max_prices,6,1,20)),images:o.catalog_images_enabled===undefined?true:truth(o.catalog_images_enabled)}}
function findSection(id){return (ownerSnap?.sections||[]).find(function(s){return String(s.id)===String(id)})||null}
function findItem(id){var hit=null;(ownerSnap?.sections||[]).some(function(s){hit=(s.items||[]).find(function(i){return String(i.id)===String(id)})||null;return !!hit});return hit}

async function openEditor(){
  if(!isOwner||editorBusy)return;
  editorOpen=true;editorView={mode:"home",sectionId:null,itemId:null};
  $("#cat-editor").classList.add("open");$("#cat-editor").setAttribute("aria-hidden","false");portal(true,"owner-catalog-editor");
  $("#cat-editor-main").innerHTML='<div class="cate-loading"><span></span>Loading Catalog Manager…</div>';
  try{ownerSnap=await request("load");snap=ownerSnap;theme(ownerSnap);renderEditor()}catch(e){toast(e.message||"Could not open Catalog.",true);closeEditor()}
}
function closeEditor(opt){
  if(!editorOpen||editorBusy)return;editorOpen=false;draftImage=null;$("#cat-editor").classList.remove("open");$("#cat-editor").setAttribute("aria-hidden","true");
  if(!opt?.fromPortalBack)portal(false,"owner-catalog-editor");refresh();
}
async function mutate(action,payload,imageFile,success){
  if(editorBusy)return;setBusy(true);
  try{
    var d=await request("mutate",{action:action,payload:payload||{},imageFile:imageFile||null});
    ownerSnap=d;snap=d;theme(d);draftImage=null;toast(success||"Saved");renderEditor();renderPublic();
  }catch(e){toast(e.message||"Could not save.",true)}finally{setBusy(false)}
}

function editorHeader(title,sub,back){
  return '<div class="cate-page-head">'+(back?'<button type="button" data-ed-back>‹</button>':'<span class="cate-head-spacer"></span>')+
  '<div><small>CATALOG MANAGER</small><h2>'+esc(title)+'</h2><p>'+esc(sub||"")+'</p></div>'+
  '<button type="button" data-ed-close>×</button></div>';
}
function hookHead(){
  $("[data-ed-close]",$("#cat-editor-main"))?.addEventListener("click",function(){closeEditor()});
  $("[data-ed-back]",$("#cat-editor-main"))?.addEventListener("click",function(){editorView={mode:"home",sectionId:null,itemId:null};renderEditor()});
}
function renderEditor(){
  if(!editorOpen||!ownerSnap)return;
  var m=editorView.mode;
  if(m==="section-form")return renderSectionForm();
  if(m==="section")return renderSectionManager();
  if(m==="item-form")return renderItemForm();
  if(m==="settings")return renderSettings();
  renderEditorHome();
}

function renderEditorHome(){
  var main=$("#cat-editor-main"),ss=ownerSnap.sections||[],lim=limits(),itemCount=ss.reduce(function(n,s){return n+(s.items||[]).length},0);
  main.innerHTML=editorHeader("Menu & Prices","Organize sections, products and pricing.",false)+
    '<div class="cate-summary"><div><b>'+ss.length+'</b><span>Sections</span></div><div><b>'+itemCount+'</b><span>Items</span></div><div><b>'+lim.prices+'</b><span>Prices/item</span></div></div>'+
    '<button type="button" class="cate-settings" data-ed-settings><span>⚙</span><div><b>Catalog settings</b><small>'+esc(ownerSnap.catalog?.title||"Menu & Prices")+' · '+esc(ownerSnap.catalog?.default_currency||"USD")+'</small></div><i>›</i></button>'+
    '<div class="cate-section-title"><div><b>Your sections</b><small>Visitors swipe between these.</small></div><button type="button" data-add-section '+(ss.length>=lim.sections?"disabled":"")+'>＋ Add section</button></div>'+
    (ss.length?'<div class="cate-sections">'+ss.map(function(s,idx){return '<article class="cate-section-row '+(s.is_visible===false?"hidden":"")+'"><button type="button" class="cate-section-open" data-open-section="'+esc(s.id)+'"><span class="cate-grip">⋮⋮</span><div><b>'+esc(s.title)+'</b><small>'+(s.items||[]).length+' items'+(s.is_visible===false?' · Hidden':'')+'</small></div><i>›</i></button><div class="cate-order"><button type="button" data-section-up="'+esc(s.id)+'" '+(idx===0?"disabled":"")+'>↑</button><button type="button" data-section-down="'+esc(s.id)+'" '+(idx===ss.length-1?"disabled":"")+'>↓</button></div></article>'}).join("")+'</div>':
    '<div class="cate-empty"><span>▤</span><b>No sections yet</b><small>Create your first category such as Coffee, Services or Accessories.</small></div>')+
    '<div class="cate-limit-note">Admin allowance · '+ss.length+'/'+lim.sections+' sections · '+itemCount+'/'+lim.items+' items</div>';
  hookHead();
  $("[data-ed-settings]",main).onclick=function(){editorView={mode:"settings"};renderEditor()};
  $("[data-add-section]",main)?.addEventListener("click",function(){editorView={mode:"section-form",sectionId:null};renderEditor()});
  $$("[data-open-section]",main).forEach(function(b){b.onclick=function(){editorView={mode:"section",sectionId:b.dataset.openSection};renderEditor()}});
  $$("[data-section-up],[data-section-down]",main).forEach(function(b){b.onclick=function(){
    var id=b.dataset.sectionUp||b.dataset.sectionDown,ids=ss.map(function(x){return x.id}),idx=ids.findIndex(function(x){return String(x)===String(id)}),to=b.dataset.sectionUp?idx-1:idx+1;
    if(to<0||to>=ids.length)return;var t=ids[idx];ids[idx]=ids[to];ids[to]=t;mutate("section-reorder",{ids:ids},null,"Section order saved");
  }});
}

function renderSectionForm(){
  var s=editorView.sectionId?findSection(editorView.sectionId):null,main=$("#cat-editor-main");
  main.innerHTML=editorHeader(s?"Edit section":"New section",s?"Update this category.":"Create a category for products or services.",true)+
    '<div class="cate-form"><label><span>SECTION NAME</span><input id="ed-sec-title" maxlength="80" value="'+esc(s?.title||"")+'" placeholder="e.g. Coffee"></label>'+
    '<label><span>SHORT DESCRIPTION <small>optional</small></span><textarea id="ed-sec-desc" maxlength="240" placeholder="What is inside this section?">'+esc(s?.description||"")+'</textarea></label>'+
    '<label class="cate-toggle"><span><b>Visible to visitors</b><small>Hidden sections stay saved.</small></span><input id="ed-sec-visible" type="checkbox" '+(s?.is_visible===false?"":"checked")+'><i></i></label>'+
    '<button class="cate-save" type="button" data-save-section>'+(s?"Save section":"Create section")+'</button>'+
    (s?'<button class="cate-delete" type="button" data-delete-section>Delete section</button>':'')+'</div>';
  hookHead();
  $("[data-save-section]",main).onclick=function(){
    var title=$("#ed-sec-title").value.trim(),description=$("#ed-sec-desc").value.trim();
    if(!title){toast("Give the section a name.",true);return}
    mutate("section-save",{id:s?.id||null,title:title,description:description,is_visible:$("#ed-sec-visible").checked},null,s?"Section updated":"Section created");
  };
  $("[data-delete-section]",main)?.addEventListener("click",function(){confirmBox("Delete section?","This removes the section and all items inside it.","Delete",async function(){await mutate("section-delete",{id:s.id},null,"Section deleted");editorView={mode:"home"};renderEditor()})});
}

function renderSectionManager(){
  var s=findSection(editorView.sectionId);if(!s){editorView={mode:"home"};return renderEditor()}
  var main=$("#cat-editor-main"),items=s.items||[],lim=limits();
  main.innerHTML=editorHeader(s.title,(s.description||"Manage the items in this section."),true)+
    '<div class="cate-section-tools"><button type="button" data-edit-section>✎ Edit section</button><button type="button" class="primary" data-add-item '+(((ownerSnap.sections||[]).reduce(function(n,x){return n+(x.items||[]).length},0))>=lim.items?"disabled":"")+'>＋ Add item</button></div>'+
    (items.length?'<div class="cate-items">'+items.map(function(i,idx){return '<article class="cate-item-row '+(i.is_visible===false?"hidden":"")+'"><button type="button" data-edit-item="'+esc(i.id)+'">'+thumb(i)+'<div><b>'+esc(i.name)+'</b><small>'+esc(price(i,true))+(i.is_available===false?' · Unavailable':'')+(i.is_visible===false?' · Hidden':'')+'</small></div><i>›</i></button><div class="cate-order"><button type="button" data-item-up="'+esc(i.id)+'" '+(idx===0?"disabled":"")+'>↑</button><button type="button" data-item-down="'+esc(i.id)+'" '+(idx===items.length-1?"disabled":"")+'>↓</button></div></article>'}).join("")+'</div>':
    '<div class="cate-empty"><span>＋</span><b>No items here yet</b><small>Add a product, service or menu item.</small></div>');
  hookHead();
  $("[data-edit-section]",main).onclick=function(){editorView={mode:"section-form",sectionId:s.id};renderEditor()};
  $("[data-add-item]",main)?.addEventListener("click",function(){editorView={mode:"item-form",sectionId:s.id,itemId:null};renderEditor()});
  $$("[data-edit-item]",main).forEach(function(b){b.onclick=function(){editorView={mode:"item-form",sectionId:s.id,itemId:b.dataset.editItem};renderEditor()}});
  $$("[data-item-up],[data-item-down]",main).forEach(function(b){b.onclick=function(){
    var id=b.dataset.itemUp||b.dataset.itemDown,ids=items.map(function(x){return x.id}),idx=ids.findIndex(function(x){return String(x)===String(id)}),to=b.dataset.itemUp?idx-1:idx+1;
    if(to<0||to>=ids.length)return;var t=ids[idx];ids[idx]=ids[to];ids[to]=t;mutate("item-reorder",{section_id:s.id,ids:ids},null,"Item order saved");
  }});
}

function priceEditorHtml(i,cur){
  var mode=i?.price_mode||"fixed",prices=i?.prices||[];
  return '<div class="cate-price-box"><div class="cate-price-head"><b>Price</b><small>Choose how this item should show its price.</small></div>'+
  '<div class="cate-price-modes">'+["fixed","from","multiple","contact","free"].map(function(m){return '<button type="button" data-price-mode="'+m+'" class="'+(mode===m?"on":"")+'">'+({fixed:"Fixed",from:"From",multiple:"Options",contact:"Ask",free:"Free"}[m])+'</button>'}).join("")+'</div>'+
  '<input type="hidden" id="ed-price-mode" value="'+esc(mode)+'">'+
  '<div id="ed-price-fields"></div></div>';
}
function renderPriceFields(i){
  var box=$("#ed-price-fields"),mode=$("#ed-price-mode").value,cur=$("#ed-currency")?.value||i?.currency||ownerSnap.catalog?.default_currency||"USD";
  if(mode==="fixed"||mode==="from"){
    box.innerHTML='<div class="cate-price-single"><span>'+(mode==="from"?"Starting price":"Price")+'</span><div><b>'+esc(cur)+'</b><input id="ed-base-price" type="number" inputmode="decimal" min="0" step="0.01" value="'+esc(i?.base_price??"")+'" placeholder="0.00"></div></div>';return;
  }
  if(mode==="contact"){box.innerHTML='<label class="compact"><span>DISPLAY TEXT</span><input id="ed-price-label" maxlength="80" value="'+esc(i?.price_label||"Ask for price")+'" placeholder="Ask for price"></label>';return}
  if(mode==="free"){box.innerHTML='<div class="cate-free">This item will show as <b>Free</b>.</div>';return}
  var rows=(i?.price_mode==="multiple"&&Array.isArray(i.prices)&&i.prices.length?i.prices:[{label:"Regular",amount:"",price_text:"",currency:cur}]);
  box.innerHTML='<div class="cate-option-list" id="ed-option-list">'+rows.map(optionRow).join("")+'</div><button type="button" class="cate-add-option" data-add-option>＋ Add price option <small>max '+limits().prices+'</small></button>';
  hookOptionRows();
}
function optionRow(p){
  return '<div class="cate-option-row"><input data-op-label maxlength="60" value="'+esc(p?.label||"")+'" placeholder="Size / option"><input data-op-amount type="number" inputmode="decimal" step="0.01" min="0" value="'+esc(p?.amount??"")+'" placeholder="Price"><input data-op-text maxlength="80" value="'+esc(p?.price_text||"")+'" placeholder="or text"><button type="button" data-op-remove>×</button></div>';
}
function hookOptionRows(){
  $$("[data-op-remove]",$("#ed-price-fields")).forEach(function(b){b.onclick=function(){var rows=$$(".cate-option-row",$("#ed-option-list"));if(rows.length<=1){toast("Keep at least one option.",true);return}b.closest(".cate-option-row").remove()}});
  $("[data-add-option]",$("#ed-price-fields"))?.addEventListener("click",function(){
    var box=$("#ed-option-list");if($$(".cate-option-row",box).length>=limits().prices){toast("Admin price-option limit reached.",true);return}
    box.insertAdjacentHTML("beforeend",optionRow({currency:$("#ed-currency").value}));hookOptionRows();
  });
}
function collectPrices(){
  return $$(".cate-option-row",$("#ed-option-list")).map(function(r){return{label:$("[data-op-label]",r).value.trim(),amount:$("[data-op-amount]",r).value.trim(),price_text:$("[data-op-text]",r).value.trim(),currency:$("#ed-currency").value.trim().toUpperCase()}}).filter(function(p){return p.label||p.amount||p.price_text});
}

function renderItemForm(){
  var i=editorView.itemId?findItem(editorView.itemId):null,s=findSection(editorView.sectionId||i?.section_id),main=$("#cat-editor-main"),lim=limits();
  if(!s){editorView={mode:"home"};return renderEditor()}
  var cur=i?.currency||ownerSnap.catalog?.default_currency||"USD";
  main.innerHTML=editorHeader(i?"Edit item":"Add item",s.title,true)+
    '<div class="cate-form">'+
    '<div class="cate-image-editor '+(!lim.images?"disabled":"")+'"><div id="ed-image-preview">'+(i?.image_url?'<img src="'+esc(i.image_url)+'" alt="">':'<span>＋</span><small>PHOTO</small>')+'</div><div><button type="button" data-pick-image '+(!lim.images?"disabled":"")+'>'+(i?.image_url?"Replace image":"Add image")+'</button>'+(i?.image_url?'<button type="button" data-remove-image>Remove</button>':'')+'<input id="ed-image-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif"><small>'+(lim.images?"Optional · JPG, PNG, WEBP or GIF.":"Images disabled by Admin.")+'</small></div></div>'+
    '<label><span>ITEM NAME</span><input id="ed-item-name" maxlength="120" value="'+esc(i?.name||"")+'" placeholder="e.g. Iced Latte"></label>'+
    '<label><span>DESCRIPTION <small>optional</small></span><textarea id="ed-item-desc" maxlength="600" placeholder="Short useful description">'+esc(i?.description||"")+'</textarea></label>'+
    '<div class="cate-grid2"><label><span>BADGE <small>optional</small></span><input id="ed-item-badge" maxlength="24" value="'+esc(i?.badge||"")+'" placeholder="Popular"></label><label><span>CURRENCY</span><input id="ed-currency" maxlength="6" value="'+esc(cur)+'" placeholder="USD"></label></div>'+
    priceEditorHtml(i,cur)+
    '<label class="cate-toggle"><span><b>Available now</b><small>Switch off for sold-out/unavailable items.</small></span><input id="ed-available" type="checkbox" '+(i?.is_available===false?"":"checked")+'><i></i></label>'+
    '<label class="cate-toggle"><span><b>Visible to visitors</b><small>Hidden items stay saved.</small></span><input id="ed-visible" type="checkbox" '+(i?.is_visible===false?"":"checked")+'><i></i></label>'+
    '<button class="cate-save" type="button" data-save-item>'+(i?"Save item":"Add item")+'</button>'+
    (i?'<button class="cate-delete" type="button" data-delete-item>Delete item</button>':'')+'</div>';
  hookHead();renderPriceFields(i);
  $$("[data-price-mode]",main).forEach(function(b){b.onclick=function(){$("#ed-price-mode").value=b.dataset.priceMode;$$("[data-price-mode]",main).forEach(function(x){x.classList.toggle("on",x===b)});renderPriceFields(i)}});
  $("#ed-currency").addEventListener("input",function(){if(["fixed","from"].includes($("#ed-price-mode").value))renderPriceFields(i)});
  $("[data-pick-image]",main)?.addEventListener("click",function(){$("#ed-image-file").click()});
  $("#ed-image-file").addEventListener("change",function(){var f=this.files?.[0];if(!f)return;draftImage=f;var u=URL.createObjectURL(f);$("#ed-image-preview").innerHTML='<img src="'+esc(u)+'" alt="">';this.dataset.mode="replace"});
  $("[data-remove-image]",main)?.addEventListener("click",function(){draftImage=null;$("#ed-image-file").dataset.mode="remove";$("#ed-image-preview").innerHTML='<span>＋</span><small>PHOTO</small>'});
  $("[data-save-item]",main).onclick=function(){
    var name=$("#ed-item-name").value.trim();if(!name){toast("Give the item a name.",true);return}
    var mode=$("#ed-price-mode").value,currency=$("#ed-currency").value.trim().toUpperCase()||"USD";
    var payload={id:i?.id||null,section_id:s.id,name:name,description:$("#ed-item-desc").value.trim(),badge:$("#ed-item-badge").value.trim(),price_mode:mode,currency:currency,price_label:$("#ed-price-label")?.value.trim()||"",base_price:$("#ed-base-price")?.value.trim()||"",is_available:$("#ed-available").checked,is_visible:$("#ed-visible").checked,prices:mode==="multiple"?collectPrices():[],image_mode:$("#ed-image-file").dataset.mode||(i?"keep":"remove")};
    if(mode==="multiple"&&!payload.prices.length){toast("Add at least one price option.",true);return}
    if(["fixed","from"].includes(mode)&&!payload.base_price){toast("Enter the price.",true);return}
    mutate("item-save",payload,draftImage,i?"Item updated":"Item added");
  };
  $("[data-delete-item]",main)?.addEventListener("click",function(){confirmBox("Delete this item?","The item and its price options will be removed.","Delete",async function(){await mutate("item-delete",{id:i.id},null,"Item deleted");editorView={mode:"section",sectionId:s.id};renderEditor()})});
}

function renderSettings(){
  var c=ownerSnap.catalog||{},main=$("#cat-editor-main");
  main.innerHTML=editorHeader("Catalog settings","Viewer heading and default currency.",true)+
    '<div class="cate-form"><label><span>VIEWER TITLE</span><input id="ed-cat-title" maxlength="80" value="'+esc(c.title||"Menu & Prices")+'" placeholder="Menu & Prices"></label>'+
    '<label><span>SUBTITLE <small>optional</small></span><textarea id="ed-cat-sub" maxlength="180" placeholder="A short line under the title">'+esc(c.subtitle||"")+'</textarea></label>'+
    '<label><span>DEFAULT CURRENCY</span><input id="ed-cat-currency" maxlength="6" value="'+esc(c.default_currency||"USD")+'" placeholder="USD"></label>'+
    '<div class="cate-info"><span>✦</span><div><b>Design follows this shop automatically</b><small>Colors, borders and accents come from Admin Design Studio. This screen only manages Catalog content.</small></div></div>'+
    '<button class="cate-save" type="button" data-save-settings>Save settings</button></div>';
  hookHead();
  $("[data-save-settings]",main).onclick=function(){
    var title=$("#ed-cat-title").value.trim(),currency=$("#ed-cat-currency").value.trim().toUpperCase();
    if(!title){toast("Catalog title is required.",true);return}
    mutate("settings-save",{title:title,subtitle:$("#ed-cat-sub").value.trim(),default_currency:currency||"USD"},null,"Catalog settings saved");
  };
}

function confirmBox(title,text,label,fn){
  var o=$("#cat-confirm");o.innerHTML='<div><span>!</span><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p><div><button type="button" data-confirm-cancel>Cancel</button><button type="button" class="danger" data-confirm-go>'+esc(label||"Confirm")+'</button></div></div>';o.setAttribute("aria-hidden","false");
  $("[data-confirm-cancel]",o).onclick=function(){o.setAttribute("aria-hidden","true")};
  $("[data-confirm-go]",o).onclick=async function(){o.setAttribute("aria-hidden","true");await fn()};
}

function inject(){
  if(!$("#cat-style")){
    var st=document.createElement("style");st.id="cat-style";st.textContent=
'*{box-sizing:border-box}html,body{margin:0!important;padding:0!important;background:transparent!important}html.cat-zero,html.cat-zero body{height:0!important;min-height:0!important;overflow:hidden!important}#'+ROOT_ID+'{--cat-a:#d9a441;--cat-title:#fff;--cat-muted:#d0c8bf;--cat-bg:#100e0c;--cat-edge:#d9a441;--cat-symbol:#d9a441;--cat-symbol-bg:#171411;--cat-btn-bg:#17130f;--cat-btn-edge:#44382c;--cat-btn-text:#ded7cf;--cat-on-bg:#2b241d;--cat-on-edge:#d9a441;--cat-on-text:#fff;--cat-r:22px;width:min(92vw,580px);margin:12px auto;padding:0;font-family:Arial,"Segoe UI",sans-serif;color:#fff}button,input,textarea{font:inherit;-webkit-tap-highlight-color:transparent}.cat-shell{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--cat-edge) 50%,transparent);border-radius:var(--cat-r);background:radial-gradient(circle at 12% 0%,color-mix(in srgb,var(--cat-a) 9%,transparent),transparent 34%),linear-gradient(155deg,color-mix(in srgb,var(--cat-bg) 96%,#17120c 4%),#090909);box-shadow:0 14px 32px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.035)}.cat-shell:before{content:"";position:absolute;left:16%;right:16%;top:0;height:1px;background:linear-gradient(90deg,transparent,var(--cat-a),transparent);opacity:.68}.cat-head{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:10px;align-items:center;padding:14px 13px 10px}.cat-symbol{width:40px;height:40px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--cat-a) 35%,transparent);border-radius:13px;background:var(--cat-symbol-bg);color:var(--cat-symbol);box-shadow:0 8px 20px rgba(0,0,0,.22)}.cat-title{min-width:0}.cat-title small{display:block;color:var(--cat-a);font-size:7px;font-weight:950;letter-spacing:1.35px}.cat-title h2{margin:3px 0 0;color:var(--cat-title);font:800 25px/1 Georgia,"Times New Roman",serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cat-title p{margin:5px 0 0;color:var(--cat-muted);font-size:8px;line-height:1.35}.cat-edit{height:34px;padding:0 11px;border:1px solid color-mix(in srgb,var(--cat-a) 35%,transparent);border-radius:10px;background:color-mix(in srgb,var(--cat-a) 8%,#111);color:var(--cat-a);font-size:8px;font-weight:900}.cat-tabs{display:flex;gap:7px;overflow:auto;padding:2px 12px 10px;scrollbar-width:none}.cat-tabs::-webkit-scrollbar{display:none}.cat-tabs button{flex:0 0 auto;min-height:34px;padding:0 13px;border:1px solid var(--cat-btn-edge);border-radius:999px;background:var(--cat-btn-bg);color:var(--cat-btn-text);font-size:8px;font-weight:850;white-space:nowrap}.cat-tabs button.on{border-color:var(--cat-on-edge);background:var(--cat-on-bg);color:var(--cat-on-text);box-shadow:0 0 14px color-mix(in srgb,var(--cat-a) 9%,transparent)}.cat-section-copy{display:flex;justify-content:space-between;gap:12px;align-items:end;padding:6px 14px 9px}.cat-section-copy h3{margin:0;font-size:13px}.cat-section-copy p{margin:4px 0 0;color:rgba(255,255,255,.42);font-size:8px;line-height:1.35}.cat-section-copy>span{color:var(--cat-muted);font-size:7.5px;white-space:nowrap}.cat-list{padding:0 8px 8px}.cat-item{width:100%;display:grid;grid-template-columns:58px minmax(0,1fr) auto;gap:10px;align-items:center;min-height:70px;padding:8px;border:0;border-top:1px solid rgba(255,255,255,.055);background:transparent;color:#fff;text-align:left}.cat-item:first-child{border-top:0}.cat-item:active{background:color-mix(in srgb,var(--cat-a) 5%,transparent)}.cat-thumb{width:58px;height:58px;overflow:hidden;border-radius:14px;border:1px solid color-mix(in srgb,var(--cat-a) 20%,rgba(255,255,255,.05));background:#0b0b0c}.cat-thumb img{width:100%;height:100%;display:block;object-fit:cover}.cat-thumb.blank{display:grid;place-items:center;color:color-mix(in srgb,var(--cat-a) 65%,#fff);font-size:16px}.cat-copy{min-width:0}.cat-copy em{display:inline-block;margin:0 0 4px;padding:3px 6px;border-radius:999px;background:color-mix(in srgb,var(--cat-a) 12%,transparent);color:var(--cat-a);font-size:6.5px;font-style:normal;font-weight:900;letter-spacing:.45px}.cat-copy b{display:block;font-size:11px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cat-copy small{display:-webkit-box;margin-top:4px;color:rgba(255,255,255,.45);font-size:7.8px;line-height:1.35;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cat-copy strong{display:block;margin-top:4px;color:#f1a4aa;font-size:7px}.cat-price{display:flex;align-items:center;gap:5px;max-width:105px;color:var(--cat-a);font-size:9px;font-weight:950;text-align:right}.cat-price i{color:rgba(255,255,255,.25);font-size:18px;font-style:normal}.cat-item.sold{opacity:.68}.cat-swipe-hint{text-align:center;padding:5px 0 11px;color:rgba(255,255,255,.25);font-size:7px;letter-spacing:.5px}.cat-swipe-hint span{color:var(--cat-a)}.cat-empty-owner{display:grid;grid-template-columns:42px minmax(0,1fr);gap:11px;align-items:center;padding:14px}.cat-empty-owner>button{grid-column:1/-1;height:42px;border:1px solid color-mix(in srgb,var(--cat-a) 45%,transparent);border-radius:12px;background:color-mix(in srgb,var(--cat-a) 10%,#111);color:var(--cat-a);font-size:9px;font-weight:900}.cat-empty-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:color-mix(in srgb,var(--cat-a) 8%,#111);color:var(--cat-a)}.cat-empty-owner small{color:var(--cat-a);font-size:7px;font-weight:900}.cat-empty-owner h3{margin:3px 0 0;font-size:12px}.cat-empty-owner p{margin:4px 0 0;color:rgba(255,255,255,.4);font-size:8px;line-height:1.35}#cat-browser,#cat-product,#cat-editor{position:fixed!important;z-index:2147483647!important;inset:0!important;width:100vw!important;height:100vh!important;width:100dvw!important;height:100dvh!important;display:none;background:#070708;color:#fff;font-family:Arial,"Segoe UI",sans-serif}#cat-browser.open,#cat-product.open,#cat-editor.open{display:block}#cat-browser{background:radial-gradient(circle at 50% -12%,color-mix(in srgb,var(--cat-a) 11%,transparent),transparent 31%),linear-gradient(180deg,#0d0c0b,#070708 48%,#050506);overflow:hidden}.catbr-head{height:auto;min-height:74px;display:grid;grid-template-columns:42px minmax(0,1fr) 42px;gap:10px;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 12px 10px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(9,9,10,.94);backdrop-filter:blur(14px)}.catbr-head>button:first-child{width:42px;height:42px;border:1px solid rgba(255,255,255,.09);border-radius:50%;background:#151517;color:#fff;font-size:26px}.catbr-head>div{min-width:0;text-align:center}.catbr-head small{display:block;color:var(--cat-a);font-size:6.7px;font-weight:950;letter-spacing:1.35px}.catbr-head h2{margin:3px 0 0;font:800 20px/1 Georgia,"Times New Roman",serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.catbr-head p{margin:4px 0 0;color:rgba(255,255,255,.37);font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.catbr-edit{width:42px;height:34px;border:1px solid color-mix(in srgb,var(--cat-a) 38%,transparent);border-radius:10px;background:color-mix(in srgb,var(--cat-a) 9%,#121214);color:var(--cat-a);font-size:7px;font-weight:900}.catbr-spacer{width:42px}.catbr-body{height:calc(100dvh - 74px - env(safe-area-inset-top));overflow:auto;padding:12px 10px calc(24px + env(safe-area-inset-bottom))}.catbr-tabs{display:flex;gap:7px;overflow:auto;padding:0 1px 11px;scrollbar-width:none}.catbr-tabs::-webkit-scrollbar{display:none}.catbr-tabs button{flex:0 0 auto;min-height:36px;padding:0 14px;border:1px solid var(--cat-btn-edge);border-radius:999px;background:var(--cat-btn-bg);color:var(--cat-btn-text);font-size:8px;font-weight:850}.catbr-tabs button.on{border-color:var(--cat-on-edge);background:var(--cat-on-bg);color:var(--cat-on-text);box-shadow:0 0 16px color-mix(in srgb,var(--cat-a) 10%,transparent)}.catbr-section{display:flex;align-items:end;justify-content:space-between;gap:10px;padding:5px 5px 9px}.catbr-section h3{margin:0;font:800 17px/1.1 Georgia,"Times New Roman",serif}.catbr-section p{margin:5px 0 0;color:rgba(255,255,255,.4);font-size:8px;line-height:1.35}.catbr-section>span{color:var(--cat-a);font-size:7.5px;white-space:nowrap}.catbr-list{overflow:hidden;border:1px solid rgba(255,255,255,.06);border-radius:18px;background:rgba(255,255,255,.018)}.catbr-list .cat-item{padding:9px 8px;min-height:72px}.catbr-swipe{text-align:center;padding:12px 0 4px;color:rgba(255,255,255,.24);font-size:7px}.catbr-swipe span{color:var(--cat-a)}..catpv-top{position:absolute;z-index:5;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;padding:calc(10px + env(safe-area-inset-top)) 12px 9px;background:linear-gradient(#060607,rgba(6,6,7,.88),transparent)}.catpv-top button,.cate-page-head>button{width:42px;height:42px;border:1px solid rgba(255,255,255,.1);border-radius:50%;background:rgba(20,20,22,.82);color:#fff;font-size:23px}.catpv-top>div{text-align:right}.catpv-top small{display:block;color:var(--cat-a);font-size:7px;font-weight:900}.catpv-top b{font-size:8px;color:rgba(255,255,255,.56)}.catpv-scroll{height:100%;overflow:auto;padding-bottom:env(safe-area-inset-bottom)}.catpv-image{width:100%;height:55dvh;min-height:300px;background:#050505}.catpv-image img{width:100%;height:100%;object-fit:contain}.catpv-body{width:min(100%,560px);margin:0 auto;padding:20px 18px 34px}.catpv-body>em{display:inline-block;padding:4px 8px;border-radius:999px;background:color-mix(in srgb,var(--cat-a) 12%,transparent);color:var(--cat-a);font-size:7px;font-style:normal;font-weight:900}.catpv-body h2{margin:10px 0 0;font:800 26px/1.05 Georgia,"Times New Roman",serif}.catpv-body>p{margin:10px 0 0;color:rgba(255,255,255,.55);font-size:11px;line-height:1.5}.catpv-main-price{margin-top:16px;color:var(--cat-a);font-size:22px;font-weight:950}.catpv-options{margin-top:16px;border:1px solid rgba(255,255,255,.07);border-radius:15px;overflow:hidden}.catpv-options div{display:flex;justify-content:space-between;gap:12px;padding:12px;border-top:1px solid rgba(255,255,255,.055)}.catpv-options div:first-child{border-top:0}.catpv-options span{color:rgba(255,255,255,.56);font-size:10px}.catpv-options b{font-size:10px;color:var(--cat-a)}.catpv-unavailable{margin-top:14px;padding:10px;border:1px solid rgba(255,100,110,.18);border-radius:11px;background:rgba(100,20,30,.12);color:#ffb0b7;font-size:9px}.catpv-foot{margin-top:18px;color:rgba(255,255,255,.22);font-size:7.5px}.catpv-arrow{position:fixed;z-index:6;top:50%;width:38px;height:54px;border:1px solid rgba(255,255,255,.08);background:rgba(10,10,11,.72);color:#fff;font-size:26px}.catpv-arrow.prev{left:5px;border-radius:0 13px 13px 0}.catpv-arrow.next{right:5px;border-radius:13px 0 0 13px}#cat-editor{background:radial-gradient(circle at 50% -10%,color-mix(in srgb,var(--cat-a) 10%,transparent),transparent 30%),#080809;overflow:hidden}.cate-topbar{height:calc(52px + env(safe-area-inset-top));padding:env(safe-area-inset-top) 13px 0;display:flex;align-items:center;border-bottom:1px solid rgba(255,255,255,.055);background:#0d0d0f}.cate-topbar div{min-width:0}.cate-topbar small{display:block;color:var(--cat-a);font-size:7px;font-weight:950;letter-spacing:1.25px}.cate-topbar b{display:block;margin-top:2px;font-size:12px}.cate-main{height:calc(100dvh - 52px - env(safe-area-inset-top));overflow:auto;padding:0 12px calc(26px + env(safe-area-inset-bottom))}.cate-page-head{display:grid;grid-template-columns:42px minmax(0,1fr) 42px;gap:9px;align-items:center;padding:15px 0 12px}.cate-head-spacer{width:42px}.cate-page-head>div{text-align:center}.cate-page-head small{display:block;color:var(--cat-a);font-size:6.8px;font-weight:950;letter-spacing:1.2px}.cate-page-head h2{margin:3px 0 0;font-size:17px}.cate-page-head p{margin:4px 0 0;color:rgba(255,255,255,.34);font-size:7.5px}.cate-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:10px}.cate-summary div{padding:11px 7px;border:1px solid rgba(255,255,255,.065);border-radius:13px;background:#101012;text-align:center}.cate-summary b{display:block;color:var(--cat-a);font-size:18px}.cate-summary span{display:block;margin-top:3px;color:rgba(255,255,255,.38);font-size:7px}.cate-settings{width:100%;display:grid;grid-template-columns:35px minmax(0,1fr) auto;gap:9px;align-items:center;padding:9px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:#111113;color:#fff;text-align:left}.cate-settings>span{width:35px;height:35px;display:grid;place-items:center;border-radius:11px;background:color-mix(in srgb,var(--cat-a) 8%,#171719);color:var(--cat-a)}.cate-settings b{display:block;font-size:9px}.cate-settings small{display:block;margin-top:3px;color:rgba(255,255,255,.34);font-size:7px}.cate-settings i{color:rgba(255,255,255,.28);font-size:18px;font-style:normal}.cate-section-title{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:16px 2px 8px}.cate-section-title b{display:block;font-size:10px}.cate-section-title small{display:block;margin-top:3px;color:rgba(255,255,255,.3);font-size:7px}.cate-section-title button,.cate-section-tools button{height:36px;padding:0 10px;border:1px solid color-mix(in srgb,var(--cat-a) 26%,rgba(255,255,255,.06));border-radius:10px;background:#141416;color:var(--cat-a);font-size:8px;font-weight:850}.cate-section-title button:disabled,.cate-section-tools button:disabled{opacity:.35}.cate-sections,.cate-items{display:grid;gap:7px}.cate-section-row,.cate-item-row{display:grid;grid-template-columns:minmax(0,1fr) 68px;overflow:hidden;border:1px solid rgba(255,255,255,.065);border-radius:14px;background:#101012}.cate-section-row.hidden,.cate-item-row.hidden{opacity:.55}.cate-section-open,.cate-item-row>button:first-child{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;width:100%;padding:9px;border:0;background:transparent;color:#fff;text-align:left}.cate-item-row>button:first-child{grid-template-columns:50px minmax(0,1fr) auto}.cate-item-row .cat-thumb{width:50px;height:50px}.cate-grip{color:rgba(255,255,255,.2)}.cate-section-row b,.cate-item-row b{display:block;font-size:9.5px}.cate-section-row small,.cate-item-row small{display:block;margin-top:3px;color:rgba(255,255,255,.34);font-size:7px}.cate-section-row i,.cate-item-row i{color:rgba(255,255,255,.25);font-size:17px;font-style:normal}.cate-order{display:grid;grid-template-columns:1fr 1fr;border-left:1px solid rgba(255,255,255,.055)}.cate-order button{border:0;border-left:1px solid rgba(255,255,255,.045);background:#141416;color:rgba(255,255,255,.48);font-size:15px}.cate-order button:disabled{opacity:.2}.cate-limit-note{text-align:center;margin:12px 0;color:rgba(255,255,255,.22);font-size:7px}.cate-empty{padding:24px 14px;border:1px dashed color-mix(in srgb,var(--cat-a) 20%,rgba(255,255,255,.06));border-radius:15px;text-align:center}.cate-empty>span{display:block;color:var(--cat-a);font-size:24px}.cate-empty b{display:block;margin-top:6px;font-size:10px}.cate-empty small{display:block;margin-top:5px;color:rgba(255,255,255,.34);font-size:7.5px;line-height:1.4}.cate-section-tools{display:grid;grid-template-columns:1fr 1.2fr;gap:7px;margin-bottom:10px}.cate-section-tools button.primary{background:color-mix(in srgb,var(--cat-a) 12%,#141416);border-color:color-mix(in srgb,var(--cat-a) 40%,transparent)}.cate-form{padding:4px 1px}.cate-form label:not(.cate-toggle),.cate-form .compact{display:block;margin-bottom:13px}.cate-form label>span,.cate-form .compact>span{display:block;margin:0 0 6px;color:rgba(255,255,255,.46);font-size:7px;font-weight:900;letter-spacing:.55px}.cate-form label>span small{font-weight:500}.cate-form input:not([type=checkbox]),.cate-form textarea{width:100%;border:1px solid rgba(255,255,255,.085);border-radius:12px;background:#111113;color:#fff;outline:0}.cate-form input:not([type=checkbox]){height:44px;padding:0 11px}.cate-form textarea{min-height:88px;padding:11px;resize:none;line-height:1.4}.cate-form input:focus,.cate-form textarea:focus{border-color:color-mix(in srgb,var(--cat-a) 50%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cat-a) 5%,transparent)}.cate-toggle{display:flex!important;align-items:center;justify-content:space-between;gap:12px;margin:8px 0!important;padding:11px;border:1px solid rgba(255,255,255,.07);border-radius:13px;background:#101012}.cate-toggle span{margin:0!important}.cate-toggle b{display:block;font-size:9px}.cate-toggle small{display:block;margin-top:3px;color:rgba(255,255,255,.34);font-size:7px}.cate-toggle input{display:none}.cate-toggle i{position:relative;width:44px;height:26px;flex:0 0 44px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:#202023}.cate-toggle i:after{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.17s}.cate-toggle input:checked+i{background:color-mix(in srgb,var(--cat-a) 24%,#202023);border-color:color-mix(in srgb,var(--cat-a) 50%,transparent)}.cate-toggle input:checked+i:after{transform:translateX(18px)}.cate-save,.cate-delete{width:100%;height:47px;margin-top:14px;border-radius:13px;font-size:9px;font-weight:950}.cate-save{border:1px solid color-mix(in srgb,var(--cat-a) 55%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--cat-a) 20%,#171719),#111);color:#fff}.cate-delete{margin-top:8px;border:1px solid rgba(255,90,105,.18);background:rgba(98,20,30,.13);color:#ffa2ab}.cate-grid2{display:grid;grid-template-columns:1fr .7fr;gap:8px}.cate-info{display:flex;gap:9px;padding:11px;border:1px solid color-mix(in srgb,var(--cat-a) 15%,rgba(255,255,255,.06));border-radius:13px;background:color-mix(in srgb,var(--cat-a) 4%,#0c0c0d)}.cate-info>span{color:var(--cat-a)}.cate-info b{font-size:8.5px}.cate-info small{display:block;margin-top:4px;color:rgba(255,255,255,.36);font-size:7px;line-height:1.4}.cate-image-editor{display:grid;grid-template-columns:86px minmax(0,1fr);gap:10px;align-items:center;margin-bottom:14px;padding:9px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:#101012}.cate-image-editor>div:first-child{width:86px;height:86px;display:grid;place-items:center;overflow:hidden;border-radius:13px;border:1px dashed color-mix(in srgb,var(--cat-a) 26%,rgba(255,255,255,.06));background:#09090a;color:var(--cat-a)}.cate-image-editor img{width:100%;height:100%;object-fit:cover}.cate-image-editor>div:nth-child(2){display:flex;flex-wrap:wrap;gap:6px}.cate-image-editor button{height:34px;padding:0 9px;border:1px solid rgba(255,255,255,.08);border-radius:9px;background:#171719;color:#fff;font-size:7.5px;font-weight:850}.cate-image-editor input{display:none}.cate-image-editor small{width:100%;color:rgba(255,255,255,.29);font-size:6.8px}.cate-image-editor.disabled{opacity:.5}.cate-price-box{padding:11px;margin:0 0 13px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:#0f0f10}.cate-price-head b{font-size:9px}.cate-price-head small{display:block;margin-top:3px;color:rgba(255,255,255,.35);font-size:7px}.cate-price-modes{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:9px}.cate-price-modes button{height:33px;padding:0 2px;border:1px solid rgba(255,255,255,.075);border-radius:8px;background:#151517;color:rgba(255,255,255,.5);font-size:7px;font-weight:850}.cate-price-modes button.on{border-color:color-mix(in srgb,var(--cat-a) 45%,transparent);background:color-mix(in srgb,var(--cat-a) 10%,#151517);color:#fff}.cate-price-single{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;margin-top:11px}.cate-price-single>span{color:rgba(255,255,255,.47);font-size:8px}.cate-price-single>div{display:grid;grid-template-columns:auto 1fr;align-items:center;border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden;background:#111113}.cate-price-single b{padding-left:8px;color:var(--cat-a);font-size:7px}.cate-price-single input{border:0!important;background:transparent!important}.cate-free{margin-top:10px;padding:10px;border-radius:10px;border:1px solid rgba(87,210,132,.16);background:rgba(47,130,76,.09);color:#9fdfb6;font-size:8px}.cate-option-list{display:grid;gap:5px;margin-top:10px}.cate-option-row{display:grid;grid-template-columns:1fr .65fr .8fr 30px;gap:4px}.cate-option-row input{height:38px!important;padding:0 7px!important;border-radius:8px!important;font-size:7.5px!important}.cate-option-row button{width:30px;border:1px solid rgba(255,90,105,.14);border-radius:8px;background:rgba(95,20,28,.12);color:#ff9fa8}.cate-add-option{width:100%;height:35px;margin-top:7px;border:1px dashed color-mix(in srgb,var(--cat-a) 26%,rgba(255,255,255,.05));border-radius:9px;background:transparent;color:var(--cat-a);font-size:7.5px;font-weight:850}.cate-add-option small{color:rgba(255,255,255,.25)}.cate-loading{height:55dvh;display:grid;place-items:center;align-content:center;gap:10px;color:rgba(255,255,255,.45);font-size:9px}.cate-loading span{width:26px;height:26px;border:2px solid rgba(255,255,255,.08);border-top-color:var(--cat-a);border-radius:50%;animation:catspin .8s linear infinite}@keyframes catspin{to{transform:rotate(360deg)}}.cate-toast{position:fixed;z-index:20;left:50%;bottom:20px;transform:translate(-50%,20px);display:flex;align-items:center;gap:7px;max-width:calc(100% - 24px);padding:9px 12px;border:1px solid rgba(85,215,133,.24);border-radius:999px;background:#102418;color:#b8ecc9;opacity:0;pointer-events:none;transition:.2s;box-shadow:0 12px 30px rgba(0,0,0,.38)}.cate-toast.show{opacity:1;transform:translate(-50%,0)}.cate-toast.error{background:#2b1116;border-color:rgba(255,90,105,.24);color:#ffb3ba}.cate-toast span{width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.07)}.cate-toast b{font-size:8px}.cate-confirm{position:fixed;z-index:25;inset:0;display:none;place-items:center;padding:18px;background:rgba(0,0,0,.75);backdrop-filter:blur(10px)}.cate-confirm[aria-hidden=false]{display:grid}.cate-confirm>div{width:min(100%,360px);padding:19px;border:1px solid rgba(255,255,255,.085);border-radius:18px;background:#111113;text-align:center}.cate-confirm>div>span{width:38px;height:38px;margin:auto;display:grid;place-items:center;border-radius:50%;background:rgba(255,90,105,.11);color:#ff9da7}.cate-confirm h3{margin:10px 0 0;font-size:14px}.cate-confirm p{margin:6px 0 0;color:rgba(255,255,255,.4);font-size:8px;line-height:1.4}.cate-confirm>div>div{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:14px}.cate-confirm button{height:40px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:#18181a;color:#fff;font-size:8px;font-weight:850}.cate-confirm button.danger{border-color:rgba(255,90,105,.2);background:rgba(95,20,28,.15);color:#ffabb2}#cat-editor.busy:after{content:"Saving…";position:fixed;z-index:30;inset:52px 0 0;display:grid;place-items:center;background:rgba(4,4,5,.42);backdrop-filter:blur(3px);font-size:9px;font-weight:900}@media(min-width:650px){.cate-main{width:min(100%,640px);margin:auto}.catpv-body{border-left:1px solid rgba(255,255,255,.05);border-right:1px solid rgba(255,255,255,.05)}}@media(max-width:380px){#'+ROOT_ID+'{width:calc(100vw - 16px)}.cat-head{padding-left:10px;padding-right:10px}.cat-title h2{font-size:22px}.cat-item{grid-template-columns:50px minmax(0,1fr) auto;gap:7px}.cat-thumb{width:50px;height:50px}.cate-main{padding-left:8px;padding-right:8px}.cate-price-modes{gap:2px}.cate-price-modes button{font-size:6.5px}.cate-option-row{grid-template-columns:1fr .62fr .7fr 28px}}';
    document.head.appendChild(st);
  }
  if(!$("#cat-browser")){var br=document.createElement("div");br.id="cat-browser";br.setAttribute("aria-hidden","true");document.body.appendChild(br)}
  if(!$("#cat-product")){var p=document.createElement("div");p.id="cat-product";p.setAttribute("aria-hidden","true");document.body.appendChild(p)}
  if(!$("#cat-editor")){
    var e=document.createElement("div");e.id="cat-editor";e.setAttribute("aria-hidden","true");
    e.innerHTML='<div class="cate-topbar"><div><small>SHOUFHON</small><b>Catalog Manager</b></div></div><main id="cat-editor-main" class="cate-main"></main><div id="cat-toast" class="cate-toast"></div><div id="cat-confirm" class="cate-confirm" aria-hidden="true"></div>';
    document.body.appendChild(e);
  }
}

window.addEventListener("message",function(event){
  if(!trusted(event))return;
  var d=event.data||{};
  if(d.type==="MA7ALAK_OWNER_STATE"){
    var incoming=norm(d.shopSlug||d.shop_slug);if(incoming&&incoming!==slug)return;
    isOwner=!!d.isOwner;emitSnapshot();if(!launcherOnly)renderPublic();if(browserOpen)renderBrowser();return;
  }
  if(d.type==="SHOUFHON_OWNER_CATALOG_RESULT"){
    var id=String(d.requestId||""),job=pending.get(id);if(!job)return;
    clearTimeout(job.timer);pending.delete(id);if(d.ok)job.resolve(d.data);else job.reject(new Error(d.error||"Catalog action failed."));return;
  }
  if(d.type==="SHOUFHON_CATALOG_INVALIDATE"){
    var s=norm(d.shopSlug||d.shop_slug);if(s&&s!==slug)return;
    if(editorOpen){request("load").then(function(x){ownerSnap=x;snap=x;theme(x);emitSnapshot();renderEditor()}).catch(function(){})}else refresh().then(function(){if(browserOpen)renderBrowser()});
    return;
  }
  if(d.type==="SHOUFHON_EMBED_VIEWER_BACK"){
    if(d.shopSlug&&norm(d.shopSlug)!==slug)return;
    if(editorOpen){closeEditor({fromPortalBack:true});return}
    if(productOpen){
      closeProduct({fromPortalBack:true});
      if(browserOpen)closeBrowser({fromPortalBack:true});
      return;
    }
    if(browserOpen){closeBrowser({fromPortalBack:true});return}
  }
});

async function start(){
  root=$("#"+ROOT_ID);if(!root)return;
  launcherOnly=String(root.getAttribute("data-launcher-only")||"")==="1";
  inject();
  if(launcherOnly){
    root.style.display="none";
  }else{
    heightObserver();
  }
  var s=await resolveSlug();
  if(!s){if(!launcherOnly)collapse();return}
  root.setAttribute("data-shop-slug",s);

  window.ShoufHonCatalog={
    open:function(){openBrowser()},
    edit:function(){if(isOwner)openEditor()},
    refresh:function(){return refresh()},
    getSnapshot:function(){return snap},
    isEnabled:function(){return !!snap?.enabled}
  };

  registerRealtime();
  ownerState();
  setTimeout(ownerState,400);
  setTimeout(ownerState,1200);
  await refresh();
}
addEventListener("pagehide",function(){
  unregisterRealtime();
  if(editorOpen){editorBusy=false;closeEditor({fromPortalBack:true})}
  if(productOpen)closeProduct({fromPortalBack:true});
  if(browserOpen)closeBrowser({fromPortalBack:true});
});
start().catch(function(e){console.warn("[ShoufHon Catalog start]",e);if(!launcherOnly)collapse()});
})();