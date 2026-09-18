(function(){
"use strict";
if(window.__MA7ALAK_HOME_FEED_GLOBAL__)return;
if(location.pathname.replace(/\/+$/,"")!=="")return;
window.__MA7ALAK_HOME_FEED_GLOBAL__=1;
const KEY="live_offers_reels",SB_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co",SB_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
let db=null,cfg=null,offers=[],reels=[],fav=new Set(),offerCh=null,reelCh=null,layoutCh=null,timer=null;
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
async function client(){
 if(db)return db;
 if(window.Ma7alakAccount?.client)return db=window.Ma7alakAccount.client;
 if(window.Ma7alakSupabase?.ready){try{return db=await window.Ma7alakSupabase.ready()}catch(_){}}
 if(window.__MA7ALAK_SHARED_SUPABASE_CLIENT__)return db=window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;
 if(!window.supabase)await new Promise(ok=>{let s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=ok;s.onerror=ok;document.head.appendChild(s)});
 if(window.supabase)db=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,storageKey:"ma7alak-viewer-auth-v1"}});
 return db;
}
function css(){
 if(document.getElementById("m7-global-feed-css"))return;
 let s=document.createElement("style");s.id="m7-global-feed-css";s.textContent=`
#m7-global-home-feed{box-sizing:border-box;width:min(100% - 20px,900px);margin:28px auto;color:#fff;font-family:Arial,"Segoe UI",sans-serif;position:relative;z-index:2}
#m7-global-home-feed *{box-sizing:border-box}
#m7g-live{width:100%;padding:18px;border-radius:25px;background:linear-gradient(145deg,#12110f,#070707);border:1px solid rgba(228,170,79,.18);box-shadow:0 18px 45px #0004;overflow:hidden}
.m7g-head{margin-bottom:15px}.m7g-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.m7g-status{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:900;letter-spacing:2px}.m7g-status i{width:10px;height:10px;border-radius:50%;background:#777}.has-live .m7g-status i{background:#36dc82;animation:m7gPulse 1.25s ease-out infinite}.m7g-count{padding:6px 9px;border:1px solid #ffffff17;border-radius:99px;background:#ffffff0a;color:#ffffff7a;font-size:9px;font-weight:900}.m7g-head h2{margin:9px 0 5px;font-size:30px;line-height:1.04}.m7g-head p{margin:0;color:#ffffff7a;font-size:13px}
.m7g-cards{display:flex;gap:13px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 2px 9px}.m7g-cards::-webkit-scrollbar,.m7g-reels::-webkit-scrollbar{display:none}.m7g-card{position:relative;flex:0 0 88%;height:470px;scroll-snap-align:start;overflow:hidden;border-radius:23px;border:1px solid #36dc824d;background:#111;box-shadow:0 14px 34px #0006;cursor:pointer;isolation:isolate}.m7g-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.m7g-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 15%,#0002 40%,#000 100%)}.m7g-copy{position:absolute;z-index:2;left:17px;right:17px;bottom:17px}.m7g-badge{display:inline-flex;padding:7px 10px;border-radius:99px;background:#050505e0;border:1px solid #ffffff26;font-size:10px;font-weight:900}.m7g-title{margin:10px 0 9px;font-size:25px;line-height:1.08;font-weight:900}.m7g-shop{display:flex;align-items:center;gap:10px}.m7g-avatar{width:46px;height:46px;padding:3px;border-radius:50%;background:#07110c;box-shadow:0 0 18px #36dc8273}.m7g-avatar img,.m7g-avatar span{display:grid;place-items:center;width:100%;height:100%;border:2px solid #07100b;border-radius:50%;object-fit:cover;background:#171717;color:#efbd70;font-weight:900}.m7g-shopname{color:#efbd70;font-size:13px;font-weight:900}.m7g-now{margin-top:3px;color:#36dc82;font-size:9px;font-weight:900;letter-spacing:1px}.m7g-price{margin-top:9px;color:#f1bb61;font-size:23px;font-weight:900}.m7g-old{margin-right:7px;color:#ffffff73;text-decoration:line-through;font-size:13px}.m7g-times{display:grid;gap:4px;margin-top:11px;padding:10px 11px;border:1px solid #ffffff17;border-radius:13px;background:#050807b8;font-size:10px;font-weight:800}.m7g-times b{font-size:11px}.m7g-times small{color:#36dc82;font-weight:900}.m7g-times span{color:#ffffff9c}.m7g-empty{width:100%;min-height:105px;display:grid;place-items:center;padding:18px;text-align:center;border:1px solid #36dc8221;border-radius:18px;background:#36dc8208;color:#ffffff9a}
#m7g-reels-wrap{position:relative;width:100%;margin:28px 0 14px;padding:15px 0 14px;border-top:3px solid #ffffff1a;border-bottom:3px solid #ffffff1a}.m7g-reels-title{display:flex;align-items:center;gap:8px;margin:0 0 10px 4px;font-size:20px;font-weight:800}.m7g-reels{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;padding:5px 4px 14px;scrollbar-width:none;-webkit-overflow-scrolling:touch}.m7g-reel{position:relative;flex:0 0 290px;height:515px;border-radius:22px;overflow:hidden;background:#0d0d0e;border:1px solid #e2b45b38;scroll-snap-align:start}.m7g-reel video{width:100%;height:100%;display:block;object-fit:cover}.m7g-info{position:absolute;left:14px;right:14px;bottom:14px;display:flex;align-items:center;gap:11px;padding:10px 13px;border:1px solid #ffffff12;border-radius:15px;background:linear-gradient(to top,#0009,#0002);backdrop-filter:blur(5px);cursor:pointer}.m7g-icon{width:42px;height:42px;border:2px solid #f5d48a;border-radius:50%;object-fit:cover}.m7g-info div{min-width:0}.m7g-info strong,.m7g-info span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.m7g-info strong{font-size:17px}.m7g-info span{font-size:12px}.m7g-favs{display:flex;justify-content:flex-end;padding:0 6px}.m7g-favs button{padding:9px 15px;border:1px solid #e2b45b4d;border-radius:99px;background:#e2b45b18;color:#f5d48a;font-weight:700}
#m7g-view{position:fixed;inset:0;z-index:2147483647;display:none;background:#000;align-items:center;justify-content:center}#m7g-view.open{display:flex}#m7g-view video{width:100vw;height:100dvh;object-fit:contain}.m7g-close{position:absolute;right:12px;top:14px;z-index:3;width:46px;height:46px;border:1px solid #ffffff44;border-radius:50%;background:#000b;color:#fff;font-size:30px}.m7g-viewshop{position:absolute;left:12px;top:14px;z-index:3;padding:10px 14px;border:1px solid #ffffff44;border-radius:99px;background:#000b;color:#fff;font-weight:800}
@keyframes m7gPulse{0%{box-shadow:0 0 0 0 #36dc82cc}100%{box-shadow:0 0 0 13px #36dc8200}}
@media(max-width:600px){#m7-global-home-feed{width:calc(100% - 16px);margin:22px auto}#m7g-live{padding:16px;border-radius:23px}.m7g-head h2{font-size:27px}.m7g-card{flex-basis:90%;height:465px}.m7g-reel{flex-basis:68vw;height:auto;aspect-ratio:9/16;border-radius:18px}}
`;document.head.appendChild(s);
}
function root(){
 let r=document.getElementById("m7-global-home-feed");if(r)return r;
 r=document.createElement("div");r.id="m7-global-home-feed";
 r.innerHTML='<section id="m7g-live"><div class="m7g-head"><div class="m7g-top"><span class="m7g-status"><i></i> LIVE</span><span class="m7g-count">0 UPDATES</span></div><h2>🔥 Happening Today</h2><p class="m7g-sub">Offers, events & special things happening now</p></div><div class="m7g-cards"><div class="m7g-empty">Loading live updates…</div></div></section><section id="m7g-reels-wrap"><div class="m7g-reels-title">🎬 <span>Reels</span></div><div class="m7g-reels"></div><div class="m7g-favs"><button type="button">⭐ Favorites <b>0</b></button></div></section><div id="m7g-view"><button class="m7g-viewshop">View shop →</button><button class="m7g-close">×</button><video playsinline loop></video></div>';
 document.body.appendChild(r);bindStatic(r);return r;
}
function candidates(){
 let all=[...document.querySelectorAll("main > section, main > div, body > section")];
 return all.filter(x=>x.id!=="m7-global-home-feed"&&!x.closest("#m7-global-home-feed")&&x.offsetHeight>24&&!/header|footer/i.test(x.tagName));
}
function place(){
 let r=root();if(!cfg?.enabled){r.style.display="none";return}r.style.display="";
 r.style.maxWidth=(cfg.max_width_px||900)+"px";r.style.marginTop=(28+(cfg.offset_px||0))+"px";
 let a=candidates(),i=Math.max(0,Math.min(Number(cfg.position_index??3),a.length));
 if(a[i])a[i].before(r);else{let main=document.querySelector("main");(main||document.body).appendChild(r)}
}
function friendly(v){let d=new Date(v);return new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Beirut",weekday:"short",hour:"numeric",minute:"2-digit",hour12:true}).format(d)}
function remain(v){let s=Math.max(0,Math.floor((new Date(v)-Date.now())/1000)),h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60),q=s%60;return[h,m,q].map(x=>String(x).padStart(2,"0")).join(":")}
function started(v){let s=Math.max(0,Math.floor((Date.now()-new Date(v))/1000)),m=Math.floor(s/60),h=Math.floor(m/60);return h?("Started "+h+"h "+m%60+"m ago"):("Started "+m+"m ago")}
function renderOffers(){
 let r=root(),sec=r.querySelector("#m7g-live"),box=r.querySelector(".m7g-cards"),n=offers.length;sec.classList.toggle("has-live",!!n);r.querySelector(".m7g-count").textContent=n+" "+(n===1?"UPDATE":"UPDATES");r.querySelector(".m7g-sub").textContent=n?(n===1?"1 update happening now":n+" updates — swipe to see more"):"Offers, events & special things happening now";
 if(!n){box.innerHTML='<div class="m7g-empty">Nothing live right now</div>';return}
 box.innerHTML=offers.map(x=>{let media=x.media_type==="video"?'<video class="m7g-media" src="'+esc(x.media_url)+'" muted autoplay loop playsinline></video>':'<img class="m7g-media" src="'+esc(x.media_url||"")+'" alt="">',name=x.shop_name||x.shop_slug||"Shop",avatar=x.profile_image_url?'<img src="'+esc(x.profile_image_url)+'" alt="">':'<span>'+esc(name[0]||"M")+'</span>',price=x.post_type==="offer"&&x.offer_price!=null?'<div class="m7g-price">'+(x.original_price!=null?'<span class="m7g-old">$'+esc(x.original_price)+'</span>':"")+'$'+esc(x.offer_price)+'</div>':"";return '<article class="m7g-card" data-id="'+esc(x.id)+'">'+media+'<div class="m7g-copy"><span class="m7g-badge">'+({offer:"🏷️ OFFER",happening:"🟢 HAPPENING NOW",arrival:"✨ NEW ARRIVAL",event:"📅 EVENT"}[x.post_type]||"⚡ LIVE")+'</span><div class="m7g-title">'+esc(x.title)+'</div><div class="m7g-shop"><div class="m7g-avatar">'+avatar+'</div><div><div class="m7g-shopname">'+esc(name)+'</div><div class="m7g-now">● LIVE NOW</div></div></div>'+price+'<div class="m7g-times" data-start="'+esc(x.starts_at)+'" data-end="'+esc(x.ends_at)+'"></div></div></article>'}).join("");
 box.querySelectorAll(".m7g-card").forEach(el=>el.onclick=()=>window.postMessage({type:"MA7ALAK_LIVE_OFFERS_VIEW",id:el.dataset.id},"*"));tick();
}
function tick(){root().querySelectorAll(".m7g-times").forEach(el=>{let future=new Date(el.dataset.start)>Date.now();el.innerHTML=future?'<b>📅 Starts '+friendly(el.dataset.start)+'</b><small>⏳ '+remain(el.dataset.start)+' until start</small><span>Ends '+friendly(el.dataset.end)+' · Lebanon time</span>':'<b>🟢 Live now</b><small>'+started(el.dataset.start)+' · '+remain(el.dataset.end)+' remaining</small><span>Ends '+friendly(el.dataset.end)+' · Lebanon time</span>'})}
function renderReels(){
 let box=root().querySelector(".m7g-reels");box.innerHTML=reels.map((x,i)=>'<article class="m7g-reel" data-i="'+i+'"><video muted autoplay loop playsinline preload="metadata" src="'+esc(x.video_url)+'"></video><div class="m7g-info"><img class="m7g-icon" src="'+esc(x.shop_icon||"")+'" alt=""><div><strong>'+esc(x.shop_name||"Shop")+'</strong><span>'+esc(x.caption||"")+'</span></div></div></article>').join("")+'<article class="m7g-reel"><div style="height:100%;display:grid;place-items:center;color:#f5d48a">🎥 New video coming soon</div></article>';
 box.querySelectorAll("[data-i]").forEach(el=>{el.querySelector("video").onclick=e=>{e.stopPropagation();openReel(Number(el.dataset.i))};el.querySelector(".m7g-info").onclick=e=>{e.stopPropagation();let u=reels[Number(el.dataset.i)]?.shop_url;if(u)location.href=u}});
}
function openReel(i){let x=reels[i],v=root().querySelector("#m7g-view"),video=v.querySelector("video");if(!x)return;v.dataset.i=i;v.querySelector(".m7g-viewshop").dataset.url=x.shop_url||"";video.src=x.video_url;video.muted=false;v.classList.add("open");video.play().catch(()=>{video.muted=true;video.play().catch(()=>{})})}
function bindStatic(r){let v=r.querySelector("#m7g-view");r.querySelector(".m7g-close").onclick=()=>{v.querySelector("video").pause();v.classList.remove("open")};r.querySelector(".m7g-viewshop").onclick=e=>{if(e.currentTarget.dataset.url)location.href=e.currentTarget.dataset.url};r.querySelector(".m7g-favs button").onclick=()=>{try{window.postMessage({type:"ma7alak-scroll-favorites"},"*")}catch(_){}}}
async function load(){
 let c=await client();if(!c)return;
 let cr=await c.from("homepage_layout_settings").select("*").eq("key",KEY).maybeSingle();cfg=cr.data||{enabled:true,position_index:3,max_width_px:900,offset_px:0};place();
 let now=new Date().toISOString(),o=await c.from("shop_live_posts").select("*").eq("status","active").gt("ends_at",now).order("starts_at",{ascending:false}).limit(30);offers=o.error?[]:(o.data||[]);
 let slugs=[...new Set(offers.map(x=>x.shop_slug).filter(Boolean))];if(slugs.length){let p=await c.from("shop_profiles").select("shop_slug,profile_image_url,shop_url").in("shop_slug",slugs),m=new Map((p.data||[]).map(x=>[x.shop_slug,x]));offers=offers.map(x=>Object.assign({},x,m.get(x.shop_slug)||{}))}
 renderOffers();
 let rr=await c.from("shop_reels").select("reel_id,shop_slug,shop_name,shop_url,shop_icon,video_url,caption,created_at").eq("active",true).order("created_at",{ascending:false});reels=rr.error?[]:(rr.data||[]);renderReels();
 if(!offerCh)offerCh=c.channel("m7g-live").on("postgres_changes",{event:"*",schema:"public",table:"shop_live_posts"},loadOffers).subscribe();
 if(!reelCh)reelCh=c.channel("m7g-reels").on("postgres_changes",{event:"*",schema:"public",table:"shop_reels"},loadReels).subscribe();
 if(!layoutCh)layoutCh=c.channel("m7g-layout").on("postgres_changes",{event:"*",schema:"public",table:"homepage_layout_settings",filter:"key=eq."+KEY},loadLayout).subscribe();
}
async function loadOffers(){let c=await client(),now=new Date().toISOString(),o=await c.from("shop_live_posts").select("*").eq("status","active").gt("ends_at",now).order("starts_at",{ascending:false}).limit(30);offers=o.error?[]:(o.data||[]);let slugs=[...new Set(offers.map(x=>x.shop_slug).filter(Boolean))];if(slugs.length){let p=await c.from("shop_profiles").select("shop_slug,profile_image_url,shop_url").in("shop_slug",slugs),m=new Map((p.data||[]).map(x=>[x.shop_slug,x]));offers=offers.map(x=>Object.assign({},x,m.get(x.shop_slug)||{}))}renderOffers()}
async function loadReels(){let c=await client(),rr=await c.from("shop_reels").select("reel_id,shop_slug,shop_name,shop_url,shop_icon,video_url,caption,created_at").eq("active",true).order("created_at",{ascending:false});reels=rr.error?[]:(rr.data||[]);renderReels()}
async function loadLayout(){let c=await client(),r=await c.from("homepage_layout_settings").select("*").eq("key",KEY).maybeSingle();if(r.data){cfg=r.data;place()}}
css();root();setTimeout(load,50);setTimeout(place,900);setTimeout(place,2200);addEventListener("resize",()=>setTimeout(place,100));timer=setInterval(()=>{if(!document.hidden)tick()},1000);
})();