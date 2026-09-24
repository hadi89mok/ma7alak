/* =========================================================
   SHOUFHON HOMEPAGE SIGNATURE FOOTER V1
   - Homepage-only premium footer/end section
   - Supabase-controlled settings
   - Mobile-first animations (transform/opacity/filter)
   - Dynamic navigation + social links
   - Realtime settings refresh
   - Internal ma7alak_* identifiers intentionally preserved
========================================================= */
(function(){
  "use strict";

  if(window.self!==window.top)return;

  /* Built-in footer background derived from the approved ShoufHon footer mockup.
     Stored as base64 text in the repository so it stays exact and cacheable. */
  const M7HF_BUILTIN_BG_SOURCE =
    "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@fd93b0f2f0f7914eadf521b13d4c1b463f83a0dc/assets/shoufhon-footer-background.b64.txt";

  if(!window.__SHOUFHON_FOOTER_BUILTIN_BG_PROMISE__){
    window.__SHOUFHON_FOOTER_BUILTIN_BG_PROMISE__ = fetch(M7HF_BUILTIN_BG_SOURCE,{cache:"force-cache"})
      .then(r=>{if(!r.ok)throw new Error("Footer background unavailable");return r.text()})
      .then(t=>{
        const uri="data:image/jpeg;base64,"+String(t||"").trim();
        window.__SHOUFHON_FOOTER_BUILTIN_BG__=uri;
        window.dispatchEvent(new CustomEvent("ma7alak:footer-builtin-bg-ready"));
        return uri;
      })
      .catch(e=>{console.warn("ShoufHon footer background:",e);return ""});
  }


  if(window.__MA7ALAK_HOME_FOOTER_V1__)return;

  const path=(location.pathname||"/").replace(/\/+$/,"")||"/";
  if(path!=="/")return;
  window.__MA7ALAK_HOME_FOOTER_V1__=true;

  const SB_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SB_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const TABLE="homepage_footer_settings";
  const ROW_ID="main";

  const DEFAULTS={
    enabled:true,
    background_url:"builtin",
    background_overlay:50,
    background_position:"center 54%",
    background_zoom:105,
    background_color:"#080604",
    accent_color:"#d9a441",
    accent_color_2:"#f2cc7b",
    panel_color:"#0b0805",
    text_color:"#f7dfaa",
    muted_color:"#d8c8a8",
    logo_url:"https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/hadi%20new.png",
    logo_size:150,
    logo_animation:"float-glow",
    title:"شوف هون المحلات",
    title_color:"#e7bd6b",
    title_size:31,
    title_animation:"glow",
    subtitle:"اكتشف محلات منطقتك بمكان واحد",
    subtitle_color:"#e8d5b5",
    subtitle_size:17,
    subtitle_animation:"fade",
    top_line_enabled:true,
    top_line_color:"#d9a441",
    top_line_animation:"travel",
    nav_color:"#f4d694",
    nav_animation:"none",
    navigation:[
      {label:"الرئيسية",url:"/",enabled:true},
      {label:"شوف المحلات",url:"/shwf-almhlat-",enabled:true},
      {label:"ضيف محلك",url:"/add-shop-",enabled:true}
    ],
    social_icon_color:"#f1c86e",
    social_glow_color:"#d9a441",
    social_size:46,
    social_animation:"float",
    socials:[
      {type:"instagram",label:"Instagram",url:"",custom_icon_url:"",enabled:false},
      {type:"tiktok",label:"TikTok",url:"",custom_icon_url:"",enabled:false},
      {type:"whatsapp",label:"WhatsApp",url:"",custom_icon_url:"",enabled:false}
    ],
    copyright_text:"© 2026 ShoufHon. All rights reserved.",
    copyright_color:"#f0e4d0",
    copyright_size:13,
    copyright_animation:"none",
    bottom_text:"Made with Love",
    bottom_color:"#f4d694",
    bottom_size:14,
    bottom_animation:"heartbeat",
    show_flag:true,
    footer_min_height:360,
    top_radius:34,
    content_max_width:760,
    overall_animation:"subtle",
    animation_speed:100,
    animation_intensity:65,
    cedar_enabled:true,
    side_note_enabled:true,
    side_note_text:"Lebanon\nLocal\nAlways ♡",
    side_note_color:"#cfa660"
  };

  let client=null;
  let channel=null;
  let current={...DEFAULTS};
  let root=null;
  let style=null;
  let loading=false;

  const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const clamp=(v,min,max,fb)=>{v=Number(v);return Number.isFinite(v)?Math.max(min,Math.min(max,v)):fb};
  const color=(v,fb)=>/^#[0-9a-f]{6}$/i.test(String(v||""))?String(v):fb;
  const cssUrl=v=>String(v||"").replace(/["'\\()\n\r]/g,"");
  const pct=v=>clamp(v,0,100,50);

  function safeNavUrl(v){
    v=String(v||"").trim();
    if(!v)return "#";
    if(/^\/(?!\/)/.test(v))return v;
    if(/^https?:\/\//i.test(v))return v;
    return "#";
  }

  function safeSocialUrl(v,type){
    v=String(v||"").trim();
    if(!v)return "#";
    if(type==="whatsapp"&&/^\+?[0-9][0-9\s()-]{5,}$/.test(v)){
      const digits=v.replace(/\D/g,"");
      return digits?"https://wa.me/"+digits:"#";
    }
    if(/^https?:\/\//i.test(v)||/^mailto:/i.test(v)||/^tel:/i.test(v))return v;
    return "#";
  }

  function safeImageUrl(v){
    v=String(v||"").trim();
    return /^https?:\/\//i.test(v)?v:"";
  }

  const ICONS={
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6" fill="#E4405F"/><rect x="6.1" y="6.1" width="11.8" height="11.8" rx="3.5" fill="none" stroke="#fff" stroke-width="1.75"/><circle cx="12" cy="12" r="3.05" fill="none" stroke="#fff" stroke-width="1.75"/><circle cx="16.55" cy="7.45" r="1.05" fill="#fff"/></svg>',
    tiktok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.25 3.1v10.55a4.65 4.65 0 1 1-3.65-4.54v2.72a2.08 2.08 0 1 0 1.05 1.82V3.1h2.6Zm0 1.18c.73 1.87 2.12 3.06 4.35 3.45v2.65a7.26 7.26 0 0 1-4.35-1.76V4.28Z" fill="#25F4EE" transform="translate(-.65 .45)"/><path d="M14.25 3.1v10.55a4.65 4.65 0 1 1-3.65-4.54v2.72a2.08 2.08 0 1 0 1.05 1.82V3.1h2.6Zm0 1.18c.73 1.87 2.12 3.06 4.35 3.45v2.65a7.26 7.26 0 0 1-4.35-1.76V4.28Z" fill="#FE2C55" transform="translate(.55 -.3)"/><path d="M14.25 3.1v10.55a4.65 4.65 0 1 1-3.65-4.54v2.72a2.08 2.08 0 1 0 1.05 1.82V3.1h2.6Zm0 1.18c.73 1.87 2.12 3.06 4.35 3.45v2.65a7.26 7.26 0 0 1-4.35-1.76V4.28Z" fill="#fff"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#25D366"/><path d="M7.35 18.2 8.2 15.1a6.25 6.25 0 1 1 2.25 2.15l-3.1.95Zm3.25-9.85c-.15-.36-.3-.37-.45-.38h-.4c-.13 0-.35.05-.53.25-.18.2-.68.67-.68 1.63s.7 1.9.8 2.03c.1.13 1.38 2.1 3.34 2.95 1.56.68 1.88.54 2.22.5.34-.04 1.1-.45 1.25-.89.16-.44.16-.82.11-.9-.05-.08-.18-.13-.38-.23l-1.29-.63c-.19-.09-.33-.14-.47.07l-.64.79c-.12.16-.25.18-.45.08-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.1-1.38-.12-.2-.01-.31.09-.41l.3-.35c.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35l-.6-1.46Z" fill="#fff"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#1877F2"/><path d="M13.45 19v-6.15h2.08l.31-2.4h-2.39V8.91c0-.7.2-1.17 1.2-1.17h1.28V5.59c-.22-.03-.98-.1-1.87-.1-1.85 0-3.12 1.13-3.12 3.2v1.76H8.85v2.4h2.09V19h2.51Z" fill="#fff"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.15a3 3 0 0 0-2.1-2.12C17.05 5.5 12 5.5 12 5.5s-5.05 0-6.9.53A3 3 0 0 0 3 8.15 31.5 31.5 0 0 0 2.5 12 31.5 31.5 0 0 0 3 15.85a3 3 0 0 0 2.1 2.12c1.85.53 6.9.53 6.9.53s5.05 0 6.9-.53a3 3 0 0 0 2.1-2.12A31.5 31.5 0 0 0 21.5 12 31.5 31.5 0 0 0 21 8.15Z" fill="currentColor"/><path d="m10 15.4 5.2-3.4L10 8.6v6.8Z" fill="#0b0805"/></svg>',
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h3.8l4 5.35L17.4 4H19l-5.45 6.55L19.5 20h-3.8l-4.55-6.08L6.1 20H4.5l5.9-7.27L5 4Zm2 1.35 9.38 13.3H17L7.63 5.35H7Z" fill="currentColor"/></svg>',
    telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3.15 15.1c-.24 1.06-.86 1.32-1.75.82l-4.8-3.54-2.32 2.23c-.25.25-.47.47-.96.47l.34-4.9 8.93-8.07c.39-.34-.08-.53-.6-.19L5.65 12.88.9 11.4c-1.03-.32-1.05-1.03.22-1.53L19.7 2.7C20.56 2.38 21.32 2.9 21 4Z" fill="currentColor"/></svg>',
    website:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.8 12h16.4M12 3.5c2.1 2.3 3.1 5.13 3.1 8.5S14.1 18.2 12 20.5M12 3.5C9.9 5.8 8.9 8.63 8.9 12s1 6.2 3.1 8.5" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>'
  };

  const ORIGINAL_LOGO_URL="https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/hadi%20new.png";
  const CROPPED_LOGO_URL=ORIGINAL_LOGO_URL+"?rect=76,215,223,152&fit=crop&w=669&h=456&fm=png&auto=compress";
  function footerLogoUrl(value){
    const v=String(value||"").trim();
    if(!v)return "";
    if(v===ORIGINAL_LOGO_URL || v.startsWith(ORIGINAL_LOGO_URL+"?"))return CROPPED_LOGO_URL;
    return v;
  }

  function animationClass(name){
    name=String(name||"none").toLowerCase().replace(/[^a-z0-9-]/g,"");
    return "m7hf-anim-"+(name||"none");
  }

  function mergedSettings(raw){
    const next={...DEFAULTS,...(raw&&typeof raw==="object"?raw:{})};
    next.navigation=Array.isArray(raw?.navigation)?raw.navigation:DEFAULTS.navigation;
    next.socials=Array.isArray(raw?.socials)?raw.socials:DEFAULTS.socials;
    return next;
  }

  function ensureStyle(){
    if(style&&style.isConnected)return;
    style=document.createElement("style");
    style.id="ma7alak-home-footer-v1-css";
    style.textContent=`
#shoufhon-home-footer,#shoufhon-home-footer *{box-sizing:border-box}
#shoufhon-home-footer{--m7hf-accent:#d9a441;--m7hf-accent2:#f2cc7b;--m7hf-text:#f7dfaa;--m7hf-muted:#d8c8a8;--m7hf-social:#f1c86e;--m7hf-social-glow:#d9a441;--m7hf-speed:1;--m7hf-intensity:.65;position:relative;width:100%;margin:44px 0 0!important;padding:0 max(10px,calc((100vw - 1180px)/2)) max(92px,env(safe-area-inset-bottom))!important;background:#050403;color:#fff;overflow:hidden;isolation:isolate;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;-webkit-font-smoothing:antialiased}
#shoufhon-home-footer[hidden]{display:none!important}
.m7hf-shell{position:relative;min-height:var(--m7hf-minh,590px);border-radius:var(--m7hf-radius,34px) var(--m7hf-radius,34px) 0 0;overflow:hidden;border:1px solid color-mix(in srgb,var(--m7hf-accent) 32%,transparent);background:var(--m7hf-bg,#080604);box-shadow:0 -12px 38px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.035);isolation:isolate}
.m7hf-bg{position:absolute;inset:-5%;z-index:-4;background-color:var(--m7hf-bg,#080604);background-image:var(--m7hf-bg-img);background-size:cover;background-position:var(--m7hf-bg-pos,center 54%);background-repeat:no-repeat;transform:translate3d(0,0,0) scale(var(--m7hf-bg-scale,1.15));will-change:transform,filter;filter:saturate(1.05) contrast(1.06) brightness(.82)}
.m7hf-overlay{position:absolute;inset:0;z-index:-3;background:linear-gradient(180deg,rgba(7,4,2,var(--m7hf-overlay-top,.45)),rgba(5,3,2,var(--m7hf-overlay,.72)) 56%,rgba(3,2,1,.97)),radial-gradient(circle at 50% 12%,rgba(217,164,65,.12),transparent 38%)}
.m7hf-vignette{position:absolute;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(ellipse at center,transparent 16%,rgba(0,0,0,.15) 58%,rgba(0,0,0,.72) 100%),linear-gradient(90deg,rgba(0,0,0,.38),transparent 22% 78%,rgba(0,0,0,.38))}
.m7hf-topline{position:absolute;top:0;left:5%;right:5%;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,var(--m7hf-line),var(--m7hf-accent2),var(--m7hf-line),transparent);box-shadow:0 0 14px color-mix(in srgb,var(--m7hf-line) 58%,transparent);overflow:hidden}
.m7hf-topline::after{content:"";position:absolute;top:-3px;left:-20%;width:18%;height:8px;background:linear-gradient(90deg,transparent,#fff7cc,transparent);filter:blur(1px);opacity:.85}
.m7hf-topline.m7hf-line-travel::after{animation:m7hfLineTravel var(--m7hf-dur-line,4.4s) linear infinite;-webkit-animation:m7hfLineTravel var(--m7hf-dur-line,4.4s) linear infinite}
.m7hf-content{position:relative;width:min(var(--m7hf-content,760px),calc(100% - 28px));min-height:inherit;margin:0 auto;padding:74px 12px 34px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:2}
.m7hf-logo{display:block;width:min(var(--m7hf-logo,190px),62vw);height:auto;max-height:190px;object-fit:contain;filter:drop-shadow(0 9px 24px rgba(0,0,0,.55)) drop-shadow(0 0 var(--m7hf-logo-glow,12px) color-mix(in srgb,var(--m7hf-accent) 32%,transparent));transform:translate3d(0,0,0);transform-origin:center;will-change:transform,filter,opacity;-webkit-backface-visibility:hidden;backface-visibility:hidden}
.m7hf-title{margin:13px 0 0;color:var(--m7hf-title-color);font-size:var(--m7hf-title-size,31px);font-weight:900;line-height:1.2;direction:rtl;text-shadow:0 3px 15px rgba(0,0,0,.74);will-change:transform,filter,opacity}
.m7hf-subtitle{margin:8px 0 0;color:var(--m7hf-subtitle-color);font-size:var(--m7hf-subtitle-size,17px);font-weight:550;line-height:1.55;direction:rtl;text-shadow:0 2px 10px rgba(0,0,0,.72);will-change:transform,filter,opacity}
.m7hf-cedar{display:flex;align-items:center;justify-content:center;gap:9px;width:min(330px,82vw);margin:20px auto 17px;color:var(--m7hf-accent2);opacity:.9}.m7hf-cedar::before,.m7hf-cedar::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--m7hf-accent))}.m7hf-cedar::after{background:linear-gradient(90deg,var(--m7hf-accent),transparent)}.m7hf-cedar svg{width:26px;height:26px;display:block;filter:drop-shadow(0 0 8px color-mix(in srgb,var(--m7hf-accent) 30%,transparent))}
.m7hf-nav{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px 12px;margin:3px 0 15px}.m7hf-nav a{min-height:34px;display:inline-flex;align-items:center;justify-content:center;padding:5px 3px;color:var(--m7hf-nav-color)!important;text-decoration:none!important;font-size:14px;font-weight:850;direction:rtl;text-shadow:0 2px 10px rgba(0,0,0,.78);will-change:transform,filter,opacity}.m7hf-nav-dot{color:var(--m7hf-accent2);font-size:14px;opacity:.86;filter:drop-shadow(0 0 5px color-mix(in srgb,var(--m7hf-accent) 36%,transparent))}.m7hf-nav a:active{transform:scale(.96)}
.m7hf-socials{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;margin:0 0 18px}.m7hf-social{width:var(--m7hf-social-size,46px);height:var(--m7hf-social-size,46px);display:inline-flex;align-items:center;justify-content:center;border:1px solid color-mix(in srgb,var(--m7hf-social-glow) 62%,transparent);border-radius:50%;background:linear-gradient(145deg,rgba(22,16,10,.88),rgba(6,5,4,.94));color:var(--m7hf-social)!important;text-decoration:none!important;box-shadow:0 8px 20px rgba(0,0,0,.34),0 0 var(--m7hf-social-glow-radius,10px) color-mix(in srgb,var(--m7hf-social-glow) 24%,transparent),inset 0 1px 0 rgba(255,255,255,.04);will-change:transform,filter,opacity;-webkit-backface-visibility:hidden;backface-visibility:hidden}.m7hf-social svg{width:64%;height:64%;display:block;overflow:visible}.m7hf-social img{width:72%;height:72%;display:block;object-fit:contain;border-radius:22%;filter:drop-shadow(0 1px 3px rgba(0,0,0,.38))}.m7hf-social-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.m7hf-social-fallback[hidden]{display:none!important}.m7hf-social:active{transform:scale(.92)}
.m7hf-social.m7hf-social-whatsapp{position:relative;top:-9px;width:calc(var(--m7hf-social-size,46px) * 1.22);height:calc(var(--m7hf-social-size,46px) * 1.22);border:0!important;background:transparent!important;box-shadow:none!important}
.m7hf-social.m7hf-social-whatsapp svg{width:96%;height:96%;filter:drop-shadow(0 0 7px rgba(37,211,102,.34)) drop-shadow(0 2px 3px rgba(0,0,0,.18))}
.m7hf-social.m7hf-social-whatsapp img{width:94%;height:94%;filter:drop-shadow(0 0 7px rgba(37,211,102,.32)) drop-shadow(0 2px 3px rgba(0,0,0,.18))}
.m7hf-rule{width:min(470px,86%);height:1px;margin:0 auto 14px;background:linear-gradient(90deg,transparent 4%,color-mix(in srgb,var(--m7hf-accent2) 90%,transparent),transparent 96%);box-shadow:0 0 8px color-mix(in srgb,var(--m7hf-accent) 24%,transparent)}
.m7hf-copyright{color:var(--m7hf-copy-color);font-size:var(--m7hf-copy-size,13px);line-height:1.4;will-change:transform,filter,opacity}
.m7hf-bottom{margin-top:9px;display:flex;align-items:center;justify-content:center;gap:7px;color:var(--m7hf-bottom-color);font-size:var(--m7hf-bottom-size,14px);font-weight:750;will-change:transform,filter,opacity}.m7hf-heart{display:inline-block;color:#ff4d54;font-size:16px;filter:drop-shadow(0 0 6px rgba(255,77,84,.32));transform-origin:center}.m7hf-flag{font-size:18px;line-height:1}
.m7hf-side-note{position:absolute;right:22px;bottom:74px;z-index:1;color:var(--m7hf-side-color);font:italic 18px/1.08 Georgia,"Times New Roman",serif;white-space:pre-line;text-align:center;transform:rotate(-7deg);opacity:.74;text-shadow:0 2px 12px rgba(0,0,0,.72);pointer-events:none}
.m7hf-side-cedar{position:absolute;left:24px;bottom:68px;z-index:1;width:54px;height:54px;color:color-mix(in srgb,var(--m7hf-accent) 70%,#7b471c);opacity:.28;filter:drop-shadow(0 0 16px rgba(217,164,65,.13));pointer-events:none}.m7hf-side-cedar svg{width:100%;height:100%;display:block}

@keyframes m7hfFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,var(--m7hf-float-y,-5px),0)}}
@-webkit-keyframes m7hfFloat{0%,100%{-webkit-transform:translate3d(0,0,0)}50%{-webkit-transform:translate3d(0,var(--m7hf-float-y,-5px),0)}}
@keyframes m7hfGlow{0%,100%{filter:brightness(1) drop-shadow(0 0 4px transparent)}50%{filter:brightness(1.08) drop-shadow(0 0 var(--m7hf-glow-radius,10px) color-mix(in srgb,var(--m7hf-accent) 70%,transparent))}}
@-webkit-keyframes m7hfGlow{0%,100%{-webkit-filter:brightness(1) drop-shadow(0 0 4px transparent)}50%{-webkit-filter:brightness(1.08) drop-shadow(0 0 var(--m7hf-glow-radius,10px) rgba(217,164,65,.55))}}
@keyframes m7hfPulse{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(0,0,0) scale(var(--m7hf-pulse-scale,1.018))}}
@-webkit-keyframes m7hfPulse{0%,100%{-webkit-transform:translate3d(0,0,0) scale(1)}50%{-webkit-transform:translate3d(0,0,0) scale(1.02)}}
@keyframes m7hfBreathe{0%,100%{opacity:.86;transform:translate3d(0,0,0) scale(.99)}50%{opacity:1;transform:translate3d(0,0,0) scale(1.015)}}
@-webkit-keyframes m7hfBreathe{0%,100%{opacity:.86;-webkit-transform:translate3d(0,0,0) scale(.99)}50%{opacity:1;-webkit-transform:translate3d(0,0,0) scale(1.015)}}
@keyframes m7hfRise{0%,100%{opacity:.72;transform:translate3d(0,5px,0)}50%{opacity:1;transform:translate3d(0,-2px,0)}}
@-webkit-keyframes m7hfRise{0%,100%{opacity:.72;-webkit-transform:translate3d(0,5px,0)}50%{opacity:1;-webkit-transform:translate3d(0,-2px,0)}}
@keyframes m7hfFade{0%,100%{opacity:.62}50%{opacity:1}}
@-webkit-keyframes m7hfFade{0%,100%{opacity:.62}50%{opacity:1}}
@keyframes m7hfSway{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
@-webkit-keyframes m7hfSway{0%,100%{-webkit-transform:rotate(-1deg)}50%{-webkit-transform:rotate(1deg)}}
@keyframes m7hfHeartbeat{0%,70%,100%{transform:scale(1)}78%{transform:scale(1.11)}84%{transform:scale(1)}90%{transform:scale(1.075)}}
@-webkit-keyframes m7hfHeartbeat{0%,70%,100%{-webkit-transform:scale(1)}78%{-webkit-transform:scale(1.11)}84%{-webkit-transform:scale(1)}90%{-webkit-transform:scale(1.075)}}
@keyframes m7hfShimmer{0%,100%{filter:brightness(.92)}50%{filter:brightness(1.3) drop-shadow(0 0 var(--m7hf-shimmer-radius,8px) rgba(242,204,123,.42))}}
@-webkit-keyframes m7hfShimmer{0%,100%{-webkit-filter:brightness(.92)}50%{-webkit-filter:brightness(1.3) drop-shadow(0 0 10px rgba(242,204,123,.42))}}
@keyframes m7hfLineTravel{from{transform:translate3d(-10%,0,0)}to{transform:translate3d(700%,0,0)}}
@-webkit-keyframes m7hfLineTravel{from{-webkit-transform:translate3d(-10%,0,0)}to{-webkit-transform:translate3d(700%,0,0)}}
@keyframes m7hfBgDrift{0%,100%{transform:translate3d(-.35%,0,0) scale(var(--m7hf-bg-scale,1.15))}50%{transform:translate3d(.35%,-.3%,0) scale(var(--m7hf-bg-scale-peak,1.17))}}
@-webkit-keyframes m7hfBgDrift{0%,100%{-webkit-transform:translate3d(-.35%,0,0) scale(var(--m7hf-bg-scale,1.15))}50%{-webkit-transform:translate3d(.35%,-.3%,0) scale(var(--m7hf-bg-scale-peak,1.17))}}

.m7hf-anim-float{animation:m7hfFloat var(--m7hf-dur-float,3.2s) ease-in-out infinite!important;-webkit-animation:m7hfFloat var(--m7hf-dur-float,3.2s) ease-in-out infinite!important}
.m7hf-anim-glow{animation:m7hfGlow var(--m7hf-dur-glow,2.8s) ease-in-out infinite!important;-webkit-animation:m7hfGlow var(--m7hf-dur-glow,2.8s) ease-in-out infinite!important}
.m7hf-anim-pulse{animation:m7hfPulse var(--m7hf-dur-pulse,2.4s) ease-in-out infinite!important;-webkit-animation:m7hfPulse var(--m7hf-dur-pulse,2.4s) ease-in-out infinite!important}
.m7hf-anim-breathe{animation:m7hfBreathe var(--m7hf-dur-breathe,3.1s) ease-in-out infinite!important;-webkit-animation:m7hfBreathe var(--m7hf-dur-breathe,3.1s) ease-in-out infinite!important}
.m7hf-anim-rise{animation:m7hfRise var(--m7hf-dur-rise,3s) ease-in-out infinite!important;-webkit-animation:m7hfRise var(--m7hf-dur-rise,3s) ease-in-out infinite!important}
.m7hf-anim-fade{animation:m7hfFade var(--m7hf-dur-fade,2.7s) ease-in-out infinite!important;-webkit-animation:m7hfFade var(--m7hf-dur-fade,2.7s) ease-in-out infinite!important}
.m7hf-anim-sway{animation:m7hfSway var(--m7hf-dur-sway,3.4s) ease-in-out infinite!important;-webkit-animation:m7hfSway var(--m7hf-dur-sway,3.4s) ease-in-out infinite!important}
.m7hf-anim-heartbeat{animation:m7hfHeartbeat var(--m7hf-dur-heart,2.9s) ease-in-out infinite!important;-webkit-animation:m7hfHeartbeat var(--m7hf-dur-heart,2.9s) ease-in-out infinite!important}
.m7hf-anim-shimmer{animation:m7hfShimmer var(--m7hf-dur-shimmer,2.6s) ease-in-out infinite!important;-webkit-animation:m7hfShimmer var(--m7hf-dur-shimmer,2.6s) ease-in-out infinite!important}
.m7hf-anim-float-glow{animation:m7hfFloat var(--m7hf-dur-float,3.2s) ease-in-out infinite!important;-webkit-animation:m7hfFloat var(--m7hf-dur-float,3.2s) ease-in-out infinite!important;filter:drop-shadow(0 9px 24px rgba(0,0,0,.55)) drop-shadow(0 0 var(--m7hf-logo-glow,12px) color-mix(in srgb,var(--m7hf-accent) 38%,transparent))}
.m7hf-anim-none{animation:none!important;-webkit-animation:none!important}
.m7hf-overall-subtle .m7hf-bg{animation:m7hfBgDrift var(--m7hf-dur-bg-subtle,14s) ease-in-out infinite;-webkit-animation:m7hfBgDrift var(--m7hf-dur-bg-subtle,14s) ease-in-out infinite}
.m7hf-overall-full .m7hf-bg{animation:m7hfBgDrift var(--m7hf-dur-bg-full,9s) ease-in-out infinite;-webkit-animation:m7hfBgDrift var(--m7hf-dur-bg-full,9s) ease-in-out infinite}
.m7hf-overall-off *{animation:none!important;-webkit-animation:none!important}

@media(max-width:700px){
  #shoufhon-home-footer{margin-top:30px!important;padding-left:0!important;padding-right:0!important;padding-bottom:max(88px,env(safe-area-inset-bottom))!important}
  .m7hf-shell{min-height:max(560px,var(--m7hf-minh,590px));border-radius:min(28px,var(--m7hf-radius,34px)) min(28px,var(--m7hf-radius,34px)) 0 0;border-left:0;border-right:0}
  .m7hf-content{width:calc(100% - 22px);padding:62px 8px 30px}
  .m7hf-logo{width:min(var(--m7hf-logo,190px),58vw);max-height:168px}
  .m7hf-title{font-size:min(var(--m7hf-title-size,31px),8.2vw)}
  .m7hf-subtitle{font-size:min(var(--m7hf-subtitle-size,17px),4.2vw);max-width:92%}
  .m7hf-nav{gap:7px 10px;margin-bottom:19px}.m7hf-nav a{min-height:32px;padding:5px 2px;font-size:12px}
  .m7hf-socials{gap:11px}.m7hf-social{width:min(var(--m7hf-social-size,46px),13vw);height:min(var(--m7hf-social-size,46px),13vw)}
  .m7hf-side-note{right:10px;bottom:80px;font-size:13px;opacity:.5}
  .m7hf-side-cedar{left:10px;bottom:82px;font-size:38px;opacity:.18}
}
@media(max-width:390px){.m7hf-content{padding-top:56px}.m7hf-nav a{font-size:11px;padding:7px 11px}.m7hf-side-note{display:none}.m7hf-side-cedar{display:none}}


/* =========================================================
   V2 — APPROVED MOCKUP MATCH + SEAM FIX
========================================================= */
html.m7hf-home-mounted,
body.m7hf-home-mounted{background:#050403!important}

#shoufhon-home-footer{
  width:100vw!important;
  max-width:none!important;
  margin:0 calc(50% - 50vw)!important;
  padding:0 0 max(84px,env(safe-area-inset-bottom))!important;
  background:#050403!important;
  overflow:visible!important;
}
#shoufhon-home-footer::before{
  content:"";
  position:absolute;
  left:0;right:0;top:-36px;height:38px;
  background:linear-gradient(180deg,transparent,#050403 72%);
  pointer-events:none;z-index:-1
}
.m7hf-shell{
  min-height:var(--m7hf-minh,520px)!important;
  border-radius:var(--m7hf-radius,34px) var(--m7hf-radius,34px) 22px 22px!important;
  border:1px solid color-mix(in srgb,var(--m7hf-line) 50%,transparent)!important;
  border-bottom-color:color-mix(in srgb,var(--m7hf-line) 34%,transparent)!important;
  box-shadow:0 -12px 38px rgba(0,0,0,.48),0 0 28px color-mix(in srgb,var(--m7hf-line) 7%,transparent),0 10px 24px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.035)!important
}
.m7hf-shell::before{
  content:"";
  position:absolute;inset:0;z-index:7;pointer-events:none;
  border:2px solid var(--m7hf-line);
  border-bottom-color:transparent;
  border-left-color:color-mix(in srgb,var(--m7hf-line) 62%,transparent);
  border-right-color:color-mix(in srgb,var(--m7hf-line) 62%,transparent);
  border-radius:inherit;
  clip-path:inset(0 0 calc(100% - 64px) 0);
  filter:drop-shadow(0 0 5px color-mix(in srgb,var(--m7hf-line) 76%,transparent)) drop-shadow(0 0 13px color-mix(in srgb,var(--m7hf-line) 24%,transparent));
  opacity:.92
}
.m7hf-shell::after{
  content:"";
  position:absolute;top:0;left:-24%;z-index:8;width:24%;height:3px;border-radius:999px;pointer-events:none;
  background:linear-gradient(90deg,transparent,#fff3bd 42%,#ffd16f 56%,transparent);
  box-shadow:0 0 8px #ffd16f,0 0 16px color-mix(in srgb,var(--m7hf-line) 60%,transparent);
  opacity:.96;will-change:transform;-webkit-backface-visibility:hidden;backface-visibility:hidden
}
.m7hf-line-off .m7hf-shell::before,.m7hf-line-off .m7hf-shell::after{display:none!important}
.m7hf-line-traveling .m7hf-shell::after{
  animation:m7hfEdgeTravel var(--m7hf-dur-line,4.4s) linear infinite!important;
  -webkit-animation:m7hfEdgeTravel var(--m7hf-dur-line,4.4s) linear infinite!important
}
.m7hf-topline{
  display:block!important;
  position:absolute!important;
  top:7px!important;
  left:50%!important;
  right:auto!important;
  z-index:9!important;
  width:9px!important;
  height:9px!important;
  border:1px solid var(--m7hf-accent2)!important;
  border-radius:1px!important;
  background:color-mix(in srgb,var(--m7hf-accent) 68%,#2a1708)!important;
  box-shadow:0 0 5px #fff1b0,0 0 13px color-mix(in srgb,var(--m7hf-line) 74%,transparent)!important;
  transform:translateX(-50%) rotate(45deg)!important;
  -webkit-transform:translateX(-50%) rotate(45deg)!important;
  overflow:visible!important;
  pointer-events:none!important
}
.m7hf-topline::after{
  content:""!important;
  position:absolute!important;
  inset:2px!important;
  border:1px solid rgba(255,244,194,.85)!important;
  background:transparent!important;
  filter:none!important;
  opacity:1!important;
  animation:none!important;
  -webkit-animation:none!important
}
.m7hf-bg{
  inset:0!important;
  background-size:cover!important;
  background-position:var(--m7hf-bg-pos,center 54%)!important;
  filter:saturate(1.08) contrast(1.08) brightness(1.05)!important;
  opacity:1!important
}
.m7hf-overlay{
  background:linear-gradient(180deg,rgba(6,3,1,.16) 0%,rgba(5,3,2,var(--m7hf-overlay,.50)) 54%,rgba(3,2,1,.82) 100%),radial-gradient(circle at 50% 16%,rgba(217,164,65,.08),transparent 38%)!important
}
.m7hf-vignette{
  background:radial-gradient(ellipse at 50% 35%,transparent 28%,rgba(0,0,0,.10) 62%,rgba(0,0,0,.54) 100%),linear-gradient(90deg,rgba(0,0,0,.26),transparent 18% 82%,rgba(0,0,0,.26))!important
}
.m7hf-content{min-height:0!important;padding:46px 12px 32px!important}
.m7hf-logo{
  width:min(var(--m7hf-logo,245px),72vw)!important;height:auto!important;max-height:none!important;margin:0 auto!important;
  object-fit:contain!important;transform-origin:center center!important;-webkit-transform-origin:center center!important;
  will-change:transform,filter,opacity!important;-webkit-backface-visibility:hidden!important;backface-visibility:hidden!important
}
.m7hf-title{margin-top:8px!important}
.m7hf-subtitle{margin-top:7px!important}
.m7hf-cedar{margin:17px auto 14px!important}
.m7hf-nav{margin:0 0 16px!important}
.m7hf-socials{margin-bottom:18px!important}
.m7hf-rule{margin-bottom:14px!important}
@keyframes m7hfEdgeTravel{from{transform:translate3d(0,0,0)}to{transform:translate3d(620%,0,0)}}
@-webkit-keyframes m7hfEdgeTravel{from{-webkit-transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(620%,0,0)}}
@media(max-width:700px){
  #shoufhon-home-footer{margin:0 calc(50% - 50vw)!important;padding-left:0!important;padding-right:0!important;padding-bottom:max(84px,calc(env(safe-area-inset-bottom) + 60px))!important}
  #shoufhon-home-footer::before{top:-24px;height:26px}
  .m7hf-shell{min-height:0!important;border-radius:min(24px,var(--m7hf-radius,34px)) min(24px,var(--m7hf-radius,34px)) 20px 20px!important}
  .m7hf-content{width:calc(100% - 18px)!important;padding:18px 8px 18px!important}
  .m7hf-logo{width:min(var(--m7hf-logo,150px),132px,36vw)!important;max-height:92px!important}
  .m7hf-title{margin-top:3px!important;font-size:min(var(--m7hf-title-size,31px),7.4vw)!important;line-height:1.12!important}
  .m7hf-subtitle{margin-top:4px!important;font-size:min(var(--m7hf-subtitle-size,17px),3.8vw)!important;line-height:1.35!important}
  .m7hf-cedar{width:min(220px,68vw)!important;margin:9px auto 7px!important}.m7hf-cedar svg{width:19px!important;height:19px!important}
  .m7hf-nav{gap:4px 8px!important;margin:0 0 4px!important}
  .m7hf-nav a{min-height:27px!important;font-size:11px!important;padding:3px 2px!important}
  .m7hf-socials{gap:8px!important;margin-bottom:2px!important}
  .m7hf-social{width:min(var(--m7hf-social-size,42px),42px,11vw)!important;height:min(var(--m7hf-social-size,42px),42px,11vw)!important}
  .m7hf-social.m7hf-social-whatsapp{width:min(calc(var(--m7hf-social-size,46px) * 1.30),56px,15.5vw)!important;height:min(calc(var(--m7hf-social-size,46px) * 1.30),56px,15.5vw)!important;top:-9px!important}
  .m7hf-rule{margin-top:-3px!important;margin-bottom:7px!important}
  .m7hf-copyright{font-size:min(var(--m7hf-copy-size,13px),11px)!important}
  .m7hf-bottom{margin-top:5px!important;font-size:min(var(--m7hf-bottom-size,14px),12px)!important}
  .m7hf-side-note,.m7hf-side-cedar{display:none!important}
}
@media(max-width:390px){
  .m7hf-content{padding:15px 7px 16px!important}
  .m7hf-logo{width:min(var(--m7hf-logo,140px),116px,34vw)!important;max-height:80px!important}
  .m7hf-nav a{font-size:10px!important;padding:3px 5px!important}
}
/* Keep deliberate footer motion alive on phone browsers even when reduced-motion
   is reported by the OS/browser. This is an admin-controlled branded section. */
@media(prefers-reduced-motion:reduce){
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-float,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-glow,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-pulse,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-breathe,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-rise,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-fade,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-sway,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-heartbeat,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-shimmer,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-anim-float-glow,
  #shoufhon-home-footer:not(.m7hf-overall-off) .m7hf-line-travel::after,
  #shoufhon-home-footer.m7hf-overall-subtle .m7hf-bg,
  #shoufhon-home-footer.m7hf-overall-full .m7hf-bg{animation-play-state:running!important;-webkit-animation-play-state:running!important}
}
`;
    (document.head||document.documentElement).appendChild(style);
  }

  function socialHtml(s,i){
    if(!s||s.enabled!==true)return "";
    const type=String(s.type||"website").toLowerCase();
    const url=safeSocialUrl(s.url,type);
    if(url==="#")return "";
    const icon=ICONS[type]||ICONS.website;
    const customIcon=safeImageUrl(s.custom_icon_url);
    const target=/^https?:\/\//i.test(url)?' target="_blank" rel="noopener noreferrer"':'';
    const typeClass=type.replace(/[^a-z0-9_-]/g,"")||"website";
    const art=customIcon
      ? `<img src="${esc(customIcon)}" alt="" loading="lazy" decoding="async"><span class="m7hf-social-fallback" hidden>${icon}</span>`
      : `<span class="m7hf-social-fallback">${icon}</span>`;
    return `<a class="m7hf-social m7hf-social-${typeClass} ${animationClass(current.social_animation)}" href="${esc(url)}"${target} aria-label="${esc(s.label||type)}" title="${esc(s.label||type)}" style="animation-delay:${(i%5)*.11}s;-webkit-animation-delay:${(i%5)*.11}s">${art}</a>`;
  }

  const CEDAR_SVG='<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M32 5 26 16h4l-10 11h7L15 39h13L13 50h16v9h6v-9h16L36 39h13L37 27h7L34 16h4L32 5Z"/></svg>';

  function navHtml(x,i){
    if(!x||x.enabled===false)return "";
    const url=safeNavUrl(x.url);
    const target=/^https?:\/\//i.test(url)&&!url.startsWith(location.origin)?' target="_blank" rel="noopener noreferrer"':'';
    return `<a class="${animationClass(current.nav_animation)}" href="${esc(url)}"${target} style="animation-delay:${(i%4)*.1}s;-webkit-animation-delay:${(i%4)*.1}s">${esc(x.label||"Link")}</a>`;
  }

  function footerHost(){
    return document.querySelector("main")||document.body;
  }

  function ensureRootConnected(){
    const host=footerHost();
    if(!host)return null;

    if(!root){
      root=document.createElement("footer");
      root.id="shoufhon-home-footer";
      root.setAttribute("aria-label","ShoufHon footer");
    }

    /* Hostinger can rebuild/replace page content after Custom Code has run.
       If that removes the footer node, reconnect the SAME footer instance
       to the current live page instead of letting the one-time guard hide it forever. */
    if(!root.isConnected||root.parentNode!==host){
      host.appendChild(root);
    }

    document.documentElement.classList.add("m7hf-home-mounted");
    document.body?.classList.add("m7hf-home-mounted");
    return root;
  }

  function render(){
    ensureStyle();
    if(!ensureRootConnected())return;

    root.hidden=current.enabled===false;
    if(root.hidden)return;

    const overall=["off","full","subtle"].includes(String(current.overall_animation))?String(current.overall_animation):"subtle";
    root.className="m7hf-overall-"+overall+" "+(current.top_line_enabled===false?"m7hf-line-off":"m7hf-line-on")+" "+(String(current.top_line_animation)==="travel"?"m7hf-line-traveling":"");

    const accent=color(current.accent_color,DEFAULTS.accent_color);
    const accent2=color(current.accent_color_2,DEFAULTS.accent_color_2);
    const bg=color(current.background_color,DEFAULTS.background_color);
    const bgUrl=current.background_url==="builtin"?window.__SHOUFHON_FOOTER_BUILTIN_BG__:cssUrl(current.background_url||"");
    const speed=clamp(current.animation_speed,40,220,100)/100;
    const intensity=clamp(current.animation_intensity,0,100,65)/100;
    const bgZoom=clamp(current.background_zoom,90,180,115);
    const nav=(Array.isArray(current.navigation)?current.navigation:[]).map(navHtml).filter(Boolean).join('<span class="m7hf-nav-dot" aria-hidden="true">•</span>');
    const socials=(Array.isArray(current.socials)?current.socials:[]).map(socialHtml).join("");

    root.style.cssText=`
      --m7hf-accent:${accent};
      --m7hf-accent2:${accent2};
      --m7hf-text:${color(current.text_color,DEFAULTS.text_color)};
      --m7hf-muted:${color(current.muted_color,DEFAULTS.muted_color)};
      --m7hf-bg:${bg};
      --m7hf-bg-img:${bgUrl?`url("${bgUrl}")`:"none"};
      --m7hf-bg-pos:${String(current.background_position||"center 54%").replace(/[;{}]/g,"")};
      --m7hf-bg-scale:${(bgZoom/100).toFixed(3)};
      --m7hf-bg-scale-peak:${(bgZoom/100+0.018).toFixed(3)};
      --m7hf-overlay:${pct(current.background_overlay)/100};
      --m7hf-overlay-top:${(pct(current.background_overlay)/100*0.62).toFixed(3)};
      --m7hf-line:${color(current.top_line_color,accent)};
      --m7hf-nav-color:${color(current.nav_color,DEFAULTS.nav_color)};
      --m7hf-social:${color(current.social_icon_color,DEFAULTS.social_icon_color)};
      --m7hf-social-glow:${color(current.social_glow_color,accent)};
      --m7hf-social-size:${clamp(current.social_size,34,72,46)}px;
      --m7hf-logo:${clamp(current.logo_size,90,310,190)}px;
      --m7hf-title-color:${color(current.title_color,DEFAULTS.title_color)};
      --m7hf-title-size:${clamp(current.title_size,18,54,31)}px;
      --m7hf-subtitle-color:${color(current.subtitle_color,DEFAULTS.subtitle_color)};
      --m7hf-subtitle-size:${clamp(current.subtitle_size,11,30,17)}px;
      --m7hf-copy-color:${color(current.copyright_color,DEFAULTS.copyright_color)};
      --m7hf-copy-size:${clamp(current.copyright_size,10,22,13)}px;
      --m7hf-bottom-color:${color(current.bottom_color,DEFAULTS.bottom_color)};
      --m7hf-bottom-size:${clamp(current.bottom_size,10,24,14)}px;
      --m7hf-side-color:${color(current.side_note_color,DEFAULTS.side_note_color)};
      --m7hf-minh:${clamp(current.footer_min_height,430,900,590)}px;
      --m7hf-radius:${clamp(current.top_radius,0,70,34)}px;
      --m7hf-content:${clamp(current.content_max_width,320,1000,760)}px;
      --m7hf-speed:${speed};
      --m7hf-intensity:${intensity};
      --m7hf-float-y:${(-8*intensity).toFixed(2)}px;
      --m7hf-glow-radius:${(14*intensity).toFixed(2)}px;
      --m7hf-logo-glow:${(18*intensity).toFixed(2)}px;
      --m7hf-social-glow-radius:${(15*intensity).toFixed(2)}px;
      --m7hf-shimmer-radius:${(12*intensity).toFixed(2)}px;
      --m7hf-pulse-scale:${(1+0.028*intensity).toFixed(4)};
      --m7hf-dur-float:${(3.2/speed).toFixed(3)}s;
      --m7hf-dur-glow:${(2.8/speed).toFixed(3)}s;
      --m7hf-dur-pulse:${(2.4/speed).toFixed(3)}s;
      --m7hf-dur-breathe:${(3.1/speed).toFixed(3)}s;
      --m7hf-dur-rise:${(3.0/speed).toFixed(3)}s;
      --m7hf-dur-fade:${(2.7/speed).toFixed(3)}s;
      --m7hf-dur-sway:${(3.4/speed).toFixed(3)}s;
      --m7hf-dur-heart:${(2.9/speed).toFixed(3)}s;
      --m7hf-dur-shimmer:${(2.6/speed).toFixed(3)}s;
      --m7hf-dur-line:${(4.4/speed).toFixed(3)}s;
      --m7hf-dur-bg-subtle:${(14/speed).toFixed(3)}s;
      --m7hf-dur-bg-full:${(9/speed).toFixed(3)}s;
    `;

    const line=current.top_line_enabled===false?"":`<div class="m7hf-topline ${String(current.top_line_animation)==="travel"?"m7hf-line-travel":""}" aria-hidden="true"></div>`;
    const logo=current.logo_url?`<img class="m7hf-logo ${animationClass(current.logo_animation)}" src="${esc(footerLogoUrl(current.logo_url))}" alt="ShoufHon" decoding="async" loading="lazy">`:"";
    const cedar=current.cedar_enabled===false?"":`<div class="m7hf-cedar" aria-hidden="true">${CEDAR_SVG}</div>`;
    const side=current.side_note_enabled===false?"":`<div class="m7hf-side-note" aria-hidden="true">${esc(current.side_note_text||"")}</div>`;
    const sideCedar=current.cedar_enabled===false?"":`<div class="m7hf-side-cedar" aria-hidden="true">${CEDAR_SVG}</div>`;
    const flag=current.show_flag===false?"":'<span class="m7hf-flag" aria-label="Lebanon flag">🇱🇧</span>';

    root.innerHTML=`<div class="m7hf-shell">
      <div class="m7hf-bg" aria-hidden="true"></div>
      <div class="m7hf-overlay" aria-hidden="true"></div>
      <div class="m7hf-vignette" aria-hidden="true"></div>
      ${line}${side}${sideCedar}
      <div class="m7hf-content">
        ${logo}
        <div class="m7hf-title ${animationClass(current.title_animation)}">${esc(current.title||"")}</div>
        <div class="m7hf-subtitle ${animationClass(current.subtitle_animation)}">${esc(current.subtitle||"")}</div>
        ${cedar}
        ${nav?`<nav class="m7hf-nav" aria-label="Footer navigation">${nav}</nav>`:""}
        ${socials?`<div class="m7hf-socials" aria-label="Social media links">${socials}</div>`:""}
        <div class="m7hf-rule" aria-hidden="true"></div>
        <div class="m7hf-copyright ${animationClass(current.copyright_animation)}">${esc(current.copyright_text||"")}</div>
        <div class="m7hf-bottom ${animationClass(current.bottom_animation)}"><span>${esc(current.bottom_text||"Made with Love")}</span><span class="m7hf-heart" aria-hidden="true">♥</span>${flag}</div>
      </div>
    </div>`;

    root.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{
      if(img.closest(".m7hf-social")){
        img.hidden=true;
        const fallback=img.nextElementSibling;
        if(fallback)fallback.hidden=false;
      }else{
        img.style.visibility="hidden";
      }
    },{once:true}));
  }

  async function getClient(){
    if(client)return client;
    client=window.Ma7alakSupabase?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null;
    if(client)return client;
    if(!window.supabase?.createClient){
      await new Promise((resolve,reject)=>{
        const old=document.querySelector('script[data-m7hf-supabase="1"]');
        if(old){old.addEventListener("load",resolve,{once:true});old.addEventListener("error",reject,{once:true});return}
        const s=document.createElement("script");
        s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.async=true;s.dataset.m7hfSupabase="1";s.onload=resolve;s.onerror=reject;
        document.head.appendChild(s);
      });
    }
    client=window.Ma7alakSupabase?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    return client;
  }

  async function load(){
    if(loading)return;
    loading=true;
    try{
      const c=await getClient();
      const {data,error}=await c.from(TABLE).select("settings,updated_at").eq("id",ROW_ID).maybeSingle();
      if(error)throw error;
      current=mergedSettings(data?.settings||{});
      render();
    }catch(e){
      console.warn("ShoufHon homepage footer settings:",e);
      current=mergedSettings({});
      render();
    }finally{loading=false}
  }

  async function subscribe(){
    try{
      const c=await getClient();
      if(channel)try{c.removeChannel(channel)}catch(_){ }
      channel=c.channel("shoufhon-home-footer-v1")
        .on("postgres_changes",{event:"*",schema:"public",table:TABLE,filter:"id=eq.main"},payload=>{
          if(payload?.new?.settings){current=mergedSettings(payload.new.settings);render()}else load();
        })
        .subscribe();
    }catch(e){console.warn("ShoufHon footer realtime:",e)}
  }

  let reconnectTimer=null;
  let stabilizationTimers=[];

  function clearStabilizationTimers(){
    stabilizationTimers.forEach(clearTimeout);
    stabilizationTimers=[];
  }

  function stabilizeFooterMount(){
    clearStabilizationTimers();

    [0,90,240,520,950,1600,2800,4800].forEach(delay=>{
      stabilizationTimers.push(
        setTimeout(()=>{
          if(!document.hidden)reconnect();
        },delay)
      );
    });
  }

  function reconnect(){
    if((location.pathname||"/").replace(/\/+$/,"")!=="/")return;
    const wasConnected=!!root?.isConnected;
    const hadShell=!!root?.querySelector?.(".m7hf-shell");

    if(!ensureRootConnected())return;

    if(
      !wasConnected ||
      !hadShell
    ){
      render();
    }
  }

  async function boot(){
    ensureStyle();

    /* Load the saved state before the first visible render. */
    current=mergedSettings({});
    await load();

    stabilizeFooterMount();
    subscribe();

    /* Keep the footer alive through later Hostinger soft refreshes.
       This stays a small connection check, not a document MutationObserver. */
    clearInterval(reconnectTimer);
    reconnectTimer=setInterval(()=>{
      if(!document.hidden)reconnect();
    },1500);

    setInterval(()=>{if(!document.hidden)load()},45000);
  }

  let footerWakeAt=0;
  function refreshFooterOnWake(){
    const now=Date.now();
    if(document.hidden||now-footerWakeAt<900)return;
    footerWakeAt=now;
    reconnect();
    load();
  }

  window.addEventListener("ma7alak:page-wake",refreshFooterOnWake);
  window.addEventListener("ma7alak:footer-builtin-bg-ready",()=>{if(current.background_url==="builtin")render()});
  window.addEventListener("load",stabilizeFooterMount,{once:true});
  window.addEventListener("pageshow",()=>{
    reconnect();
    stabilizeFooterMount();
  });
  window.addEventListener("popstate",reconnect);
  window.addEventListener("focus",reconnect);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")reconnect()});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();


/* =========================================================
   SHOUFHON FOOTER BOTTOM GAP FIX V1
   ---------------------------------------------------------
   Removes the artificial 84–92px space below the footer card.
   Only the real device safe-area is retained.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_FOOTER_BOTTOM_GAP_FIX_V1__)return;
  window.__SHOUFHON_FOOTER_BOTTOM_GAP_FIX_V1__=true;

  const style=document.createElement("style");
  style.id="shoufhon-footer-bottom-gap-fix-v1";
  style.textContent=`
    #shoufhon-home-footer{
      margin-bottom:0!important;
      padding-bottom:max(6px,env(safe-area-inset-bottom))!important;
    }

    html.m7hf-home-mounted,
    body.m7hf-home-mounted{
      margin-bottom:0!important;
      padding-bottom:0!important;
    }

    body.m7hf-home-mounted > #shoufhon-home-footer:last-of-type{
      margin-bottom:0!important;
    }

    @media(max-width:700px){
      #shoufhon-home-footer{
        padding-bottom:max(6px,env(safe-area-inset-bottom))!important;
      }
    }
  `;
  (document.head||document.documentElement).appendChild(style);
})();
