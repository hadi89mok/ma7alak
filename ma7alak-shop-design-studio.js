/* =========================================================
   SHOUFHON SHOP DESIGN STUDIO — FULLSCREEN V1
   Full-screen PC editor using the REAL Edit Shop controls.
   No duplicate fake settings; Save + live-preview stay authoritative.
========================================================= */
(function(){
  "use strict";

  if((location.pathname.replace(/\/+$/,"")||"/")!=="/admin")return;
  if(window.__SHOUFHON_FULLSCREEN_SHOP_STUDIO_V1__)return;
  window.__SHOUFHON_FULLSCREEN_SHOP_STUDIO_V1__=true;

  const TABS=[
    ["details","✎","Details","Shop name, Arabic name, category, area, location and page link"],
    ["profile","♙","Profile & Banner","Circle, image, banner, identity, shell, stats, Follow / Message, colors and typography"],
    ["story","◉","Story","Story motion, upload burst, glow color/strength, speed, sparkles and logo pulse"],
    ["vip","♛","VIP Effects","Custom rings, branded orbit objects, particles, colors, motion and phone performance"],
    ["live","◉","Live","Live panel, offer cards, colors, typography, radius, glow and pulse"],
    ["media","▧","Media","Photo + Video accents, Media typography, filters, Gallery frame shape/layers and animation"],
    ["uploads","↑","Uploads","Manage photos and videos here. Media actions save immediately."],
    ["reels","▶","Reels","Upload and manage homepage reels and owner limits. Actions save immediately."],
    ["offers","⚡","Offers","Owner access, offer limits and existing offers. Actions save immediately."],
    ["publishing","✓","Access & Visibility","Owner editing permissions, media quotas, visibility and badges. Actions save immediately."],
    ["about","●","About / Hub","ABOUT + HUB: description, services, social links, location, colors, typography and effects"],
    ["hours","◷","Hours","Status pill, colors, typography, weekly schedule and availability"],
    ["advanced","⚙","Global","Global preset, universal accent, motion, typography and Directory Card design"]
  ];

  let activeTab="profile";
  let openingWanted=false;
  let openTimer=0;

  function esc(value){
    return String(value??"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function css(){
    if(document.getElementById("m7-shop-studio-fullscreen-css"))return;
    const style=document.createElement("style");
    style.id="m7-shop-studio-fullscreen-css";
    style.textContent=`
      body.m7studio-body-open{overflow:hidden!important}
      body.m7studio-body-open #m7savebar{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen{position:fixed!important;inset:0!important;z-index:100000!important;width:100vw!important;height:100dvh!important;min-height:0!important;max-width:none!important;max-height:none!important;display:flex!important;flex-direction:column!important;margin:0!important;padding:0!important;overflow:hidden!important;touch-action:auto!important;border:0!important;border-radius:0!important;background:radial-gradient(circle at 8% 0%,rgba(218,170,82,.07),transparent 29%),linear-gradient(180deg,#0b0d0e,#070809 58%,#060707)!important;box-shadow:none!important;container-type:normal!important;color:#f4ead9!important}
      #ma-admin-edit-card.m7studio-fullscreen>.m7v4-panel-close{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen>:not(.m7studio-topbar):not(.m7studio-tabs):not(.m7v4-preview-grid){display:none!important}
      .m7studio-topbar{position:relative;flex:0 0 auto;z-index:130;min-height:72px;display:flex;align-items:center;gap:14px;padding:10px clamp(16px,2.2vw,34px);border-bottom:1px solid rgba(218,170,82,.15);background:rgba(8,10,11,.965);box-shadow:0 10px 28px rgba(0,0,0,.30);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
      .m7studio-brand-icon{width:46px;height:46px;flex:0 0 46px;display:grid;place-items:center;border:1px solid rgba(218,170,82,.25);border-radius:14px;background:rgba(218,170,82,.07);color:#efc76e;font-size:20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
      .m7studio-title{min-width:0;margin-right:auto}.m7studio-title b{display:block;color:#f3ca70;font-size:clamp(18px,1.55vw,25px);line-height:1.1;font-weight:950}.m7studio-title small{display:block;margin-top:4px;color:#938878;font-size:10px;line-height:1.35}
      .m7studio-sync{display:flex;align-items:center;gap:6px;padding:7px 9px;border:1px solid rgba(72,219,138,.18);border-radius:999px;background:rgba(72,219,138,.055);color:#74e3a4;font-size:8px;font-weight:900;white-space:nowrap}.m7studio-sync:before{content:"";width:7px;height:7px;border-radius:50%;background:#46dc88;box-shadow:0 0 11px rgba(70,220,136,.65)}
      .m7studio-top-btn{min-height:42px;padding:0 15px;border:1px solid rgba(218,170,82,.28);border-radius:12px;background:rgba(218,170,82,.035);color:#e9c57b;font-size:10px;font-weight:900;cursor:pointer;white-space:nowrap}.m7studio-top-btn.primary{min-width:130px;border-color:#e4b355;background:linear-gradient(135deg,#f4d383,#d9a13f);color:#1a1208;box-shadow:0 8px 22px rgba(218,170,82,.12)}.m7studio-top-btn.close{width:42px;min-width:42px;padding:0;font-size:21px;line-height:1}
      .m7studio-tabs{position:relative;flex:0 0 auto;z-index:125;display:flex;gap:7px;padding:10px clamp(16px,2.2vw,34px);overflow-x:auto;border-bottom:1px solid rgba(218,170,82,.11);background:rgba(9,11,12,.955);scrollbar-width:none;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}.m7studio-tabs::-webkit-scrollbar{display:none}
      .m7studio-tab{flex:0 0 auto;min-height:42px;display:flex;align-items:center;gap:8px;padding:0 13px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:#101214;color:#b7aea1;font-size:9px;font-weight:900;cursor:pointer;transition:.15s ease}.m7studio-tab i{color:#d9aa58;font-style:normal;font-size:12px}.m7studio-tab.active{border-color:#d9aa58;background:radial-gradient(circle at 20% 0%,rgba(239,194,101,.17),transparent 58%),#17150f;color:#f2ce83;box-shadow:0 0 0 1px rgba(217,170,88,.10),0 0 16px rgba(217,170,88,.12)}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{display:grid!important;grid-template-columns:minmax(580px,1fr) minmax(360px,430px)!important;gap:18px!important;align-items:stretch!important;flex:1 1 auto!important;width:min(1760px,calc(100vw - 38px))!important;max-width:none!important;min-height:0!important;height:auto!important;margin:0 auto!important;padding:14px 0 18px!important;overflow:hidden!important;box-sizing:border-box!important}
      #ma-admin-edit-card.m7studio-fullscreen #ma-admin-edit-form{width:100%!important;max-width:none!important;min-width:0!important;height:100%!important;min-height:0!important;padding:0 8px 56px 0!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;scrollbar-gutter:stable!important;touch-action:pan-y!important;background:transparent!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-context{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-hidden,#ma-admin-edit-card.m7studio-fullscreen .m7studio-field-hidden{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-section-off.m7studio-force-show{display:block!important}
      #ma-admin-edit-card.m7studio-fullscreen fieldset{margin:0 0 12px!important;padding:16px!important;border:1px solid rgba(218,170,82,.13)!important;border-radius:16px!important;background:radial-gradient(circle at 4% 0%,rgba(218,170,82,.045),transparent 27%),rgba(17,19,20,.88)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.018)!important}
      #ma-admin-edit-card.m7studio-fullscreen fieldset legend{padding:0 8px!important;color:#eac77e!important;font-size:11px!important;font-weight:950!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7-design-studio{display:block!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7-design-studio>legend,#ma-admin-edit-card.m7studio-fullscreen .m7-design-studio>.m7ds-tabs,#ma-admin-edit-card.m7studio-fullscreen .m7-design-studio>.m7ft{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7-design-studio>.m7ds-intro{margin:0 0 11px!important;border-radius:14px!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7-design-studio>.m7ds-pane{display:none!important;margin:0 0 12px!important;padding:14px!important;border:1px solid rgba(218,170,82,.09)!important;border-radius:14px!important;background:rgba(255,255,255,.012)!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7-design-studio>.m7ds-pane.m7studio-pane-on{display:block!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-grid,#ma-admin-edit-card.m7studio-fullscreen .m7ds-top-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-field,#ma-admin-edit-card.m7studio-fullscreen .m7da-field,#ma-admin-edit-card.m7studio-fullscreen .m7cd-field{min-width:0!important}
      #ma-admin-edit-card.m7studio-fullscreen input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),#ma-admin-edit-card.m7studio-fullscreen select,#ma-admin-edit-card.m7studio-fullscreen textarea{min-height:42px!important;border-radius:10px!important;background:#0b0d0e!important;border-color:rgba(218,170,82,.15)!important;color:#f3eadc!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-field:has(input[type="color"]),#ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7da-field:has(input[type="color"]),#ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ats-row:has(input[type="color"]){min-height:74px!important;padding:10px!important;border:1px solid rgba(218,170,82,.12)!important;border-radius:12px!important;background:rgba(255,255,255,.016)!important;box-sizing:border-box!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-color-row{display:grid!important;grid-template-columns:38px minmax(0,1fr)!important;gap:8px!important;align-items:center!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode input[type="color"]{width:38px!important;min-width:38px!important;height:38px!important;min-height:38px!important;padding:3px!important;border-radius:9px!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-color-row code{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;padding:6px 7px!important;font-size:7px!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-group-hidden{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="about_text"],
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="facebook_url"],
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="tiktok_url"],
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="instagram_url"],
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="whatsapp_url"],
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="address_text"],
      #ma-admin-edit-card.m7studio-fullscreen .m7da-sectioned-extras.m7studio-hub-extras [data-m7-extra-key="menu_image_url"]{display:flex!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-hub-note{margin:0 0 12px;padding:11px 12px;border:1px solid rgba(95,199,255,.20);border-radius:11px;background:rgba(95,199,255,.055);color:#a9dfff;font-size:8px;line-height:1.55}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-hub-note b{color:#d9f2ff}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-section-title{margin:16px 0 10px!important;padding:8px 10px!important;border:1px solid rgba(244,191,80,.24)!important;border-left:4px solid #f4bf50!important;border-radius:9px!important;background:linear-gradient(90deg,rgba(244,191,80,.10),rgba(244,191,80,.025))!important;color:#ffd878!important;font-size:10px!important;font-weight:950!important;letter-spacing:.8px!important;text-transform:uppercase!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-pane>.m7ds-section-title:first-child{margin-top:0!important;padding-top:0!important;border-top:0!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-field:has(input[type="color"]){padding:8px!important;border:1px solid rgba(218,170,82,.10)!important;border-radius:11px!important;background:rgba(255,255,255,.012)!important}
      #ma-admin-edit-card.m7studio-fullscreen #ma-admin-edit-form::-webkit-scrollbar,#ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-preview::-webkit-scrollbar{width:9px}
      #ma-admin-edit-card.m7studio-fullscreen #ma-admin-edit-form::-webkit-scrollbar-thumb,#ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-preview::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:999px;background:rgba(217,170,88,.32);background-clip:padding-box}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-preview{position:relative!important;top:auto!important;width:100%!important;max-width:none!important;height:100%!important;min-height:0!important;max-height:none!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;border:1px solid rgba(218,170,82,.25)!important;border-radius:18px!important;background:#0b0d0e!important;box-shadow:0 18px 50px rgba(0,0,0,.46)!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-head{position:sticky!important;top:0!important;z-index:4!important;background:rgba(11,13,14,.97)!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-stage,#ma-admin-edit-card.m7studio-fullscreen .m7pv-note{display:none!important}
      .m7studio-real-preview{padding:12px 12px 14px}.m7studio-phone{position:relative;width:min(100%,386px);height:min(720px,calc(100dvh - 235px));min-height:500px;margin:0 auto;overflow:hidden;border:2px solid #342716;border-radius:32px;background:#050606;box-shadow:0 20px 55px rgba(0,0,0,.58),0 0 28px rgba(218,170,82,.09),inset 0 0 0 4px #080808}.m7studio-phone:before{content:"";position:absolute;z-index:8;top:8px;left:50%;width:94px;height:20px;transform:translateX(-50%);border-radius:999px;background:#030303;border:1px solid rgba(255,255,255,.055);pointer-events:none}.m7studio-phone-scroll{position:absolute;inset:0;overflow:auto;overscroll-behavior:contain;padding:42px 12px 24px;box-sizing:border-box;background:radial-gradient(circle at 50% 0%,rgba(217,164,65,.055),transparent 34%),linear-gradient(180deg,#090a0b,#050606 58%,#040505);scrollbar-width:thin}.m7studio-phone-content{min-height:100%;display:flex;flex-direction:column;justify-content:flex-start;gap:12px}.m7studio-phone-content>.m7ds-profile-shell-demo,.m7studio-phone-content>.m7ds-live-offers-demo,.m7studio-phone-content>.m7ds-gallery-frame-sample{width:100%!important;max-width:none!important;margin:0 auto!important;box-sizing:border-box!important}.m7studio-phone-content .m7ds-profile-shell-demo{transform:none!important}.m7studio-phone-content .m7ds-profile-shell-logo{flex:0 0 auto}.m7studio-phone-content .m7ds-profile-shell-logo img{width:100%;height:100%;display:block;object-fit:cover;border-radius:50%}.m7studio-phone-content .m7v4-preview-phone{width:100%!important;max-width:none!important;min-height:0!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}.m7studio-phone-content .m7v4-preview-stage{display:block!important}.m7studio-preview-empty{min-height:390px;display:grid;place-items:center;text-align:center;padding:24px;color:#918675;font-size:10px;line-height:1.55}.m7studio-preview-empty b{display:block;margin-bottom:6px;color:#ebc774;font-size:13px}.m7studio-preview-note{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:9px;color:#82796d;font-size:8px;line-height:1.4;text-align:center}.m7studio-preview-note i{width:7px;height:7px;border-radius:50%;background:#46dc88;box-shadow:0 0 9px rgba(70,220,136,.55)}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-section-banner{display:flex;align-items:flex-start;gap:10px;margin:0 0 12px;padding:13px 14px;border:1px solid rgba(218,170,82,.15);border-radius:14px;background:radial-gradient(circle at 0 0,rgba(218,170,82,.075),transparent 42%),rgba(255,255,255,.014)}.m7studio-section-banner i{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border:1px solid rgba(218,170,82,.16);border-radius:10px;background:rgba(218,170,82,.06);color:#edc979;font-style:normal;font-size:14px}.m7studio-section-banner b{display:block;color:#efd49a;font-size:13px}.m7studio-section-banner small{display:block;margin-top:3px;color:#81776a;font-size:8px;line-height:1.45}
      .m7studio-profile-image-card{display:grid!important;grid-template-columns:minmax(170px,1fr) 132px minmax(170px,.85fr);gap:18px;align-items:center;margin:0 0 12px!important;padding:16px!important;border:1px solid rgba(218,170,82,.14)!important;border-radius:16px!important;background:radial-gradient(circle at 14% 0%,rgba(218,170,82,.06),transparent 45%),rgba(17,19,20,.88)!important;box-sizing:border-box}.m7studio-profile-image-copy small{display:block;color:#907f64;font-size:7px;font-weight:950;letter-spacing:.9px}.m7studio-profile-image-copy b{display:block;margin-top:5px;color:#efd49a;font-size:15px}.m7studio-profile-image-copy span{display:block;margin-top:5px;color:#847a6d;font-size:8px;line-height:1.5}.m7studio-profile-image-preview{width:112px;height:112px;margin:auto;display:grid;place-items:center;overflow:hidden;border:3px solid #d9aa58;border-radius:50%;background:#0a0b0c;color:#e3bc6c;font-size:30px;font-weight:950;box-shadow:0 0 24px rgba(217,170,88,.18)}.m7studio-profile-image-preview img{width:100%;height:100%;display:block;object-fit:cover}.m7studio-profile-image-actions{display:grid;gap:8px}.m7studio-profile-image-actions button,.m7studio-image-upload{position:relative;min-height:38px;display:flex;align-items:center;justify-content:center;padding:0 11px;border:1px solid rgba(218,170,82,.20);border-radius:10px;background:rgba(218,170,82,.045);color:#e7c57d;font-size:9px;font-weight:900;cursor:pointer;box-sizing:border-box}.m7studio-profile-image-actions button{border-color:rgba(255,91,91,.22);background:rgba(255,91,91,.045);color:#ff9c94}.m7studio-image-upload input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.m7studio-profile-image-actions small{min-height:15px;color:#78dca0;font-size:7px;line-height:1.4}.m7studio-profile-core{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
      .m7v4-actions-studio{grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr)!important}.m7v4-actions-studio [data-m7v4-action="design"]{border-color:rgba(217,170,88,.35)!important;background:radial-gradient(circle at 15% 0%,rgba(217,170,88,.11),transparent 50%),rgba(217,170,88,.035)!important}
      @media(max-width:1100px){#ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{grid-template-columns:minmax(0,1fr) 350px!important;width:calc(100vw - 24px)!important;gap:12px!important}#ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      #ma-admin-edit-card.m7studio-fullscreen{box-sizing:border-box!important;height:100vh!important;height:100dvh!important}
      #ma-admin-edit-card.m7studio-fullscreen *{box-sizing:border-box;min-width:0}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{grid-template-columns:minmax(0,1fr) minmax(300px,390px)!important}
      #ma-admin-edit-card.m7studio-fullscreen label,#ma-admin-edit-card.m7studio-fullscreen .m7ds-field>span{font-size:13px!important;line-height:1.5!important}
      #ma-admin-edit-card.m7studio-fullscreen small,#ma-admin-edit-card.m7studio-fullscreen .m7ds-help{font-size:12px!important;line-height:1.5!important;color:#b8b1a6!important}
      #ma-admin-edit-card.m7studio-fullscreen button{min-height:44px;font-size:13px}
      #ma-admin-edit-card.m7studio-fullscreen input:not([type=checkbox]):not([type=radio]),#ma-admin-edit-card.m7studio-fullscreen select,#ma-admin-edit-card.m7studio-fullscreen textarea{font-size:16px!important;max-width:100%!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-tabs{scrollbar-width:thin}
      #ma-admin-edit-card[data-studio-tab="profile"] #ma-admin-edit-form{display:flex!important;flex-direction:column}
      #ma-admin-edit-card[data-studio-tab="profile"] .m7studio-section-banner{order:0;flex-shrink:0}
      #ma-admin-edit-card[data-studio-tab="profile"] .m7-design-studio{order:1;flex-shrink:0}
      #ma-admin-edit-card[data-studio-tab="profile"] .m7labelbox{order:2;flex-shrink:0}
      .m7studio-section-picker{display:none}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-banner-status{font-size:12px!important;line-height:1.4!important;overflow-wrap:anywhere}
      #ma-admin-edit-card.m7studio-fullscreen .m7ds-banner-actions{flex-wrap:wrap}
      .m7studio-save-status{flex-basis:100%;font-size:12px;color:#dfc68c}
      .m7studio-save-status:empty{display:none}
      .m7studio-topbar{flex-wrap:wrap;padding-top:max(10px,env(safe-area-inset-top))}
      .m7studio-top-btn[data-m7studio-preview]{display:none}
      #ma-admin-edit-card .m7studio-topbar [hidden]{display:none!important}
      .m7studio-manager-dock{display:none;min-height:0;overflow:auto;padding:0 4px 24px}
      #ma-admin-edit-card.m7studio-manager-mode .m7studio-manager-dock{display:block!important;grid-column:1/-1}
      #ma-admin-edit-card.m7studio-manager-mode #ma-admin-edit-form,#ma-admin-edit-card.m7studio-manager-mode .m7v4-edit-preview{display:none!important}
      #ma-admin-edit-card .m7studio-manager-dock section{max-width:100%!important;margin:0 0 16px!important}
      #ma-admin-edit-card .m7studio-manager-dock .m7v4-legacy-panel{display:block!important}
      #ma-admin-edit-card .m7studio-manager-dock .m7v4-panel-close,#ma-admin-edit-card .m7studio-manager-dock #ma-gallery-close,#ma-admin-edit-card .m7studio-manager-dock #ma-video-close,#ma-admin-edit-card .m7studio-manager-dock #ma-reels-close,#ma-admin-edit-card .m7studio-manager-dock #m7-live-admin-close{display:none!important}
      #ma-admin-edit-card .m7studio-manager-dock #m7-live-admin-panel{width:100%!important;max-height:none!important;overflow:visible!important}
      .m7studio-manager-dock .m7v4-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .m7studio-upload-tabs{display:flex;gap:8px;margin-bottom:14px}
      .m7studio-upload-tabs button{padding:10px 16px;background:#211b12;color:#f0cc84;border:1px solid #6b542d;border-radius:12px}
      .m7studio-upload-tabs button[aria-pressed=true]{background:#e5b85e;color:#17120a}
      #ma-admin-edit-card .m7studio-global-extras .m7da-field:not(.m7studio-field-hidden){display:flex!important}
      #ma-admin-edit-card .m7studio-global-extras .m7studio-field-hidden{display:none!important}
      .m7v4-actions-studio{grid-template-columns:1fr!important}
      @media(max-width:820px){
        #ma-admin-edit-card.m7studio-fullscreen{display:flex!important;overflow:hidden!important}
        .m7studio-topbar{display:grid;grid-template-columns:minmax(0,1fr) auto 44px;gap:8px;padding:10px;padding-top:max(10px,env(safe-area-inset-top))}
        .m7studio-title{grid-column:1/3;grid-row:1}
        .m7studio-top-btn.close{grid-column:3;grid-row:1}
        .m7studio-top-btn.primary{grid-column:1;grid-row:2}
        .m7studio-top-btn[data-m7studio-preview]{grid-column:2/4;grid-row:2;display:block}
        .m7studio-save-status{grid-column:1/-1}
        .m7studio-brand-icon,.m7studio-sync,.m7studio-top-btn.preview{display:none}
        .m7studio-title b{font-size:16px}.m7studio-title small{font-size:12px}
        .m7studio-top-btn{padding:0 10px}.m7studio-top-btn.primary{min-width:80px}
        .m7studio-tabs{position:relative;top:auto;padding:8px 10px;min-height:62px}
        .m7studio-tab{display:none}.m7studio-section-picker{display:block;width:100%;padding:10px;color:#efd49a;border:1px solid #6b542d;background:#111315;border-radius:10px}
        #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{display:flex!important;flex-direction:column!important;width:100%!important;margin:0!important;padding:10px 10px max(10px,env(safe-area-inset-bottom))!important;gap:0!important;overflow:hidden!important}
        #ma-admin-edit-card.m7studio-fullscreen #ma-admin-edit-form{flex:1;height:100%!important;overflow-y:auto!important;padding:0 0 30px!important;scrollbar-gutter:auto!important}
        #ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-preview{display:none!important}
        #ma-admin-edit-card.m7studio-preview-open #ma-admin-edit-form{display:none!important}
        #ma-admin-edit-card.m7studio-preview-open .m7v4-edit-preview{display:block!important}
        #ma-admin-edit-card.m7studio-fullscreen .m7ds-grid,#ma-admin-edit-card.m7studio-fullscreen .m7ds-top-grid,#ma-admin-edit-card.m7studio-fullscreen .m7da-grid,#ma-admin-edit-card.m7studio-fullscreen .m7studio-profile-core{grid-template-columns:minmax(0,1fr)!important}
        #ma-admin-edit-card.m7studio-fullscreen fieldset{min-inline-size:0!important;padding:12px!important}
        #ma-admin-edit-card.m7studio-fullscreen .m7ds-layer-grid{grid-template-columns:minmax(0,1fr)!important}
        .m7studio-manager-dock{flex:1;width:100%;overscroll-behavior:contain}
        .m7studio-manager-dock .m7v4-actions{grid-template-columns:1fr}
        .m7studio-phone{width:100%;min-height:420px;height:calc(100dvh - 260px)}
      }
    `;
    document.head.appendChild(style);
  }

  function directFormChild(form,node){
    let current=node;
    while(current&&current.parentElement&&current.parentElement!==form){current=current.parentElement}
    return current&&current.parentElement===form?current:null;
  }

  function rootsFor(form,selectors){
    const roots=new Set();
    selectors.forEach(selector=>{
      form.querySelectorAll(selector).forEach(node=>{
        const root=directFormChild(form,node);
        if(root)roots.add(root);
      });
    });
    return [...roots];
  }

  function resetView(form){
    form.classList.remove("m7studio-colors-mode");
    form.querySelector(":scope > .m7studio-profile-image-card")?.remove();
    form.querySelector(":scope > .m7studio-hub-note")?.remove();
    form.querySelector(".m7da-sectioned-extras")?.classList.remove("m7studio-hub-extras","m7studio-global-extras");
    [...form.children].forEach(child=>child.classList.remove("m7studio-hidden","m7studio-force-show"));
    form.querySelectorAll(".m7studio-field-hidden,.m7studio-group-hidden").forEach(node=>node.classList.remove("m7studio-field-hidden","m7studio-group-hidden"));
    const design=form.querySelector(".m7-design-studio");
    if(design){
      design.querySelectorAll(":scope > .m7ds-pane").forEach(pane=>pane.classList.remove("m7studio-pane-on"));
      design.querySelector(":scope > .m7ds-top-grid")?.classList.remove("m7studio-field-hidden");
      design.querySelector(":scope > .m7ds-intro")?.classList.remove("m7studio-field-hidden");
    }
  }

  function hideFormRoots(form,keep){
    const keepSet=new Set(keep);
    [...form.children].forEach(child=>{
      if(child.classList.contains("m7studio-section-banner")){
        child.classList.remove("m7studio-hidden");
        return;
      }
      if(child.classList.contains("m7v4-edit-context")){child.classList.add("m7studio-hidden");return}
      if(!keepSet.has(child)){child.classList.add("m7studio-hidden")}
      else{child.classList.remove("m7studio-hidden","m7v4-section-off");child.classList.add("m7studio-force-show")}
    });
  }

  function showPanes(form,names){
    const design=form.querySelector(".m7-design-studio");
    if(!design)return null;
    design.classList.remove("m7v4-section-off","m7studio-hidden");
    const root=directFormChild(form,design);
    if(root){root.classList.remove("m7v4-section-off","m7studio-hidden");root.classList.add("m7studio-force-show")}
    design.querySelectorAll(":scope > .m7ds-tabs [data-m7ds-tab]").forEach(button=>button.classList.remove("active"));
    design.querySelectorAll(":scope > .m7ds-pane").forEach(pane=>{
      pane.classList.remove("active");
      pane.classList.toggle("m7studio-pane-on",names.includes(String(pane.dataset.m7dsPane||"")));
    });
    return design;
  }

  function fieldWrapper(input){
    return input.closest(".m7ds-field,.m7ds-check,.m7da-field,.m7cd-field,.m7ats-row,.m7as-row,.m7-availability-extra-row")||input.closest("label")||input.parentElement;
  }

  function filterFields(scope,predicate){
    if(!scope)return;
    const seen=new Set();
    scope.querySelectorAll("input[id],select[id],textarea[id]").forEach(input=>{
      const wrap=fieldWrapper(input);
      if(!wrap||seen.has(wrap))return;
      seen.add(wrap);
      if(!predicate(String(input.id||""),input,wrap))wrap.classList.add("m7studio-field-hidden");
      else wrap.classList.remove("m7studio-field-hidden");
    });
  }

  function filterToColors(scope){
    if(!scope)return;
    scope.querySelectorAll(".m7ds-field,.m7da-field,.m7cd-field,.m7ats-row").forEach(wrap=>{
      if(!wrap.querySelector('input[type="color"]'))wrap.classList.add("m7studio-field-hidden");
    });
  }

  /*
     Hide empty headings/previews left behind after a module-specific filter.
     The real inputs remain in their original Admin form; this only makes the
     fullscreen Studio read like one clean panel per component.
  */
  function tidyPane(scope){
    if(!scope)return;
    const children=[...scope.children];
    let segment=[];

    const flush=()=>{
      if(!segment.length)return;
      const inputs=segment.flatMap(node=>[...node.querySelectorAll("input[id],select[id],textarea[id]")]);
      const hasVisibleInput=inputs.some(input=>{
        const wrap=fieldWrapper(input);
        return wrap&&!wrap.classList.contains("m7studio-field-hidden");
      });

      segment.forEach(node=>{
        if(node.classList.contains("m7ds-section-title")||!node.matches(".m7ds-grid,.m7ds-layer-grid")){
          node.classList.toggle("m7studio-group-hidden",!hasVisibleInput);
        }else{
          const visibleChild=[...node.children].some(child=>!child.classList.contains("m7studio-field-hidden"));
          node.classList.toggle("m7studio-group-hidden",!visibleChild);
        }
      });
      segment=[];
    };

    children.forEach(node=>{
      if(node.classList.contains("m7ds-section-title")){
        flush();
        segment=[node];
      }else if(segment.length){
        segment.push(node);
      }
    });
    flush();
  }

  function syncProfileImageCardAccent(){
    const ring=String(document.getElementById("m7de-profile_ring_color")?.value||"#d9aa58").trim();
    const circle=document.querySelector("#ma-admin-edit-form > .m7studio-profile-image-card .m7studio-profile-image-preview");
    if(!circle)return;
    const color=/^#[0-9a-f]{6}$/i.test(ring)?ring:"#d9aa58";
    circle.style.borderColor=color;
    circle.style.boxShadow="0 0 0 1px "+color+"33,0 0 24px "+color+"38";
  }

  function profileImageUrl(){
    return String(
      document.getElementById("ma-edit-image")?.value||
      ""
    ).trim();
  }

  function profileImageSlug(){
    return String(
      document.getElementById("ma-edit-original-slug")?.value||
      document.getElementById("ma-edit-slug")?.value||
      ""
    )
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._&-]+/g,"-")
      .replace(/-+/g,"-")
      .replace(/^-|-$/g,"");
  }

  async function uploadProfileImage(file,status){
    if(!file)return;

    if(!/^image\/(jpeg|png|webp|gif)$/i.test(file.type||"")){
      throw new Error("Profile image must be JPG, PNG, WEBP or GIF.");
    }

    if(file.size>12*1024*1024){
      throw new Error("Profile image must be smaller than 12 MB.");
    }

    const client=window.Ma7alakAdminClient;
    const slug=profileImageSlug();

    if(!client||!client.storage){
      throw new Error("Admin storage is still loading. Try again.");
    }

    if(!slug){
      throw new Error("Shop slug is missing.");
    }

    if(status)status.textContent="Uploading profile image…";

    const check=await client.rpc("is_site_admin");
    if(check.error||check.data!==true){
      throw new Error("Admin session is no longer valid. Login again.");
    }

    const ext=(
      String(file.name||"")
        .split(".")
        .pop()||
      "jpg"
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g,"")||
      "jpg";

    const path=
      "profiles/"+
      slug+
      "/"+
      Date.now()+
      "-"+
      Math.random().toString(36).slice(2,8)+
      "."+
      ext;

    const upload=await client
      .storage
      .from("shop-gallery")
      .upload(
        path,
        file,
        {
          cacheControl:"31536000",
          upsert:false,
          contentType:file.type||undefined
        }
      );

    if(upload.error)throw upload.error;

    const data=client
      .storage
      .from("shop-gallery")
      .getPublicUrl(path);

    const url=
      data&&data.data&&data.data.publicUrl
        ?data.data.publicUrl
        :"";

    if(!url){
      throw new Error("Could not create the public profile image URL.");
    }

    const target=document.getElementById("ma-edit-image");
    if(target){
      target.value=url;
      target.dispatchEvent(new Event("input",{bubbles:true}));
      target.dispatchEvent(new Event("change",{bubbles:true}));
    }

    if(status){
      status.textContent="Uploaded — Save Changes to publish.";
    }
  }

  function studioPublicUrl(){
    const explicit=String(document.getElementById("ma-edit-url")?.value||"").trim();
    if(/^https?:\/\//i.test(explicit))return explicit;
    const slug=String(document.getElementById("ma-edit-original-slug")?.value||document.getElementById("ma-edit-slug")?.value||"").trim();
    return slug?"https://shoufhon.com/"+encodeURIComponent(slug):"";
  }

  let previewRefreshTimer=0;

  function studioPreviewSource(){
    const form=document.getElementById("ma-admin-edit-form");
    const panel=document.getElementById("ma-admin-edit-card");
    if(!form||!panel)return null;

    if(activeTab==="profile"||activeTab==="story"||activeTab==="vip"){
      return form.querySelector("[data-m7-profile-shell-preview]");
    }

    if(activeTab==="live"){
      return form.querySelector("[data-m7-live-offers-preview]");
    }

    if(activeTab==="media"){
      return form.querySelector("[data-m7-gallery-frame-preview]");
    }

    return panel.querySelector("[data-m7v4-preview-body]");
  }

  function hydrateProfilePreview(clone){
    if(!clone)return;

    const byId=id=>document.getElementById(id);
    const num=(id,min,max,fallback)=>{
      const n=Number(byId(id)?.value);
      return Number.isFinite(n)
        ?Math.max(min,Math.min(max,n))
        :fallback;
    };
    const value=(id,fallback="")=>
      String(byId(id)?.value??fallback).trim();

    const name=String(
      byId("ma-edit-name")?.value||
      "Shop Name"
    ).trim()||"Shop Name";

    const arabic=String(
      byId("ma-edit-arabic")?.value||
      ""
    ).trim();

    const image=profileImageUrl();

    const nameNode=clone.querySelector(".m7ds-profile-shell-name");
    if(nameNode)nameNode.textContent=name;
    const styleText=(node,key)=>{
      const style=window.Ma7alakAdminStudioBridge?.textStyle(key);if(!node||!style)return;
      node.style.cssText+=';'+style.css;node.style.color=style.color;node.style.fontFamily=style.typography.family;
      node.style.fontSize=(key==="shop_name"?20:14)*style.typography.size/100+"px";
      if(style.classes)node.classList.add(...style.classes.trim().split(/\s+/));
    };
    styleText(nameNode,"shop_name");

    const arabicNode=clone.querySelector(".m7ds-profile-shell-arabic");
    if(arabicNode){
      arabicNode.textContent=arabic||"اسم المحل";
      arabicNode.hidden=!arabic;styleText(arabicNode,"arabic_name");
    }

    /*
       Apply the two most important visual controls directly to the fullscreen
       phone clone. This avoids stale sample state/event-order problems.
    */
    const bannerEnabled=!!byId("m7de-profile_banner_enabled")?.checked;
    const bannerHeight=num("m7de-profile_banner_height",80,260,150);
    const bannerOverlay=num("m7de-profile_banner_overlay",0,85,30)/100;
    const bannerPosition=num("m7de-profile_banner_position_y",0,100,50);
    const bannerWidth=num("m7de-profile_banner_border_width",0,4,1);
    const bannerColor=value("m7de-profile_banner_color","#171217");
    const bannerBorder=value("m7de-profile_banner_border_color","#d9a441");
    const bannerImage=value("m7de-profile_banner_image_url","");
    const bannerStyle=value("m7de-profile_banner_style","rounded-fade").toLowerCase();
    const logoSize=num("m7de-profile_logo_size",120,270,210);
    const logoOverlap=num("m7de-profile_logo_overlap",0,130,62);

    clone.classList.toggle("has-banner",bannerEnabled);
    clone.dataset.bannerStyle=bannerStyle;

    const banner=clone.querySelector(".m7ds-profile-shell-banner");
    if(banner){
      const safeImage=bannerImage
        .replace(/\\/g,"%5C")
        .replace(/"/g,"%22")
        .replace(/[\r\n]/g,"");

      banner.style.setProperty(
        "display",
        bannerEnabled?"grid":"none",
        "important"
      );
      banner.style.setProperty(
        "height",
        Math.max(62,bannerHeight*.55)+"px",
        "important"
      );
      banner.style.setProperty(
        "border",
        bannerWidth+"px solid "+bannerBorder,
        "important"
      );
      banner.style.setProperty(
        "background-color",
        bannerColor,
        "important"
      );
      banner.style.setProperty(
        "background-image",
        bannerEnabled&&/^https?:\/\//i.test(bannerImage)
          ?"linear-gradient(rgba(0,0,0,"+bannerOverlay+"),rgba(0,0,0,"+bannerOverlay+")),url(\""+safeImage+"\")"
          :"linear-gradient(rgba(0,0,0,"+bannerOverlay+"),rgba(0,0,0,"+bannerOverlay+"))",
        "important"
      );
      banner.style.setProperty("background-size","cover","important");
      banner.style.setProperty(
        "background-position",
        "center "+bannerPosition+"%",
        "important"
      );
      banner.style.setProperty("background-repeat","no-repeat","important");

      if(bannerStyle==="fade"||bannerStyle==="rounded-fade"){
        const mask="linear-gradient(to bottom,#000 0 72%,rgba(0,0,0,.82) 84%,transparent 100%)";
        banner.style.setProperty("-webkit-mask-image",mask,"important");
        banner.style.setProperty("mask-image",mask,"important");
      }else{
        banner.style.setProperty("-webkit-mask-image","none","important");
        banner.style.setProperty("mask-image","none","important");
      }
    }

    const logo=clone.querySelector(".m7ds-profile-shell-logo");
    if(logo){
      const scaled=Math.max(64,Math.min(136,logoSize*.50));
      logo.style.setProperty("width",scaled+"px","important");
      logo.style.setProperty("height",scaled+"px","important");
      logo.style.setProperty(
        "margin-top",
        bannerEnabled
          ?(-Math.min(82,logoOverlap*.58))+"px"
          :"8px",
        "important"
      );

      if(/^https?:\/\//i.test(image)){
        logo.innerHTML='<img src="'+esc(image)+'" alt="">';
      }
      else{
        const letters=name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0,2)
          .map(part=>part.charAt(0).toUpperCase())
          .join("")||"LOGO";
        logo.textContent=letters;
      }
    }

    const labelText=String(
      document.querySelector("#ma-admin-edit-form .m7labelbox input[type='text']")?.value||
      clone.querySelector(".m7ds-profile-shell-pill")?.textContent||
      "SHOP LABEL"
    ).trim();

    const label=clone.querySelector(".m7ds-profile-shell-pill");
    if(label&&labelText)label.textContent=labelText;
  }

  function refreshStudioPreviewSource(){
    const form=document.getElementById("ma-admin-edit-form");
    const design=form?.querySelector(".m7-design-studio");
    if(!design)return;

    /*
       Do not rely on event ordering. The fullscreen phone is a view of the
       real Admin preview surfaces, so recompute those surfaces directly from
       the current controls before cloning them.
    */
    try{
      if(activeTab==="profile"||activeTab==="story"||activeTab==="vip"){
        design.__m7ProfileShellRefresh?.();
        design.__m7BannerRefresh?.();
      }
      else if(activeTab==="live"){
        design.__m7LiveOffersRefresh?.();
      }
      else if(activeTab==="media"){
        design.__m7GalleryFrameRefresh?.();
      }
      else{
        design.__m7dsRefresh?.();
      }
    }catch(_){}
  }

  function renderStudioPreview(panel){
    if(!panel||!panel.classList.contains("m7studio-fullscreen"))return;

    window.Ma7alakAdminStudioBridge?.preview(activeTab);
    refreshStudioPreviewSource();

    const dock=panel.querySelector(".m7v4-edit-preview");
    if(!dock)return;

    let real=dock.querySelector(".m7studio-real-preview");
    if(!real){
      real=document.createElement("div");
      real.className="m7studio-real-preview";
      real.innerHTML='<div class="m7studio-phone"><div class="m7studio-phone-scroll"><div class="m7studio-phone-content" data-m7studio-phone-content></div></div></div><div class="m7studio-preview-note"><i></i><span>Instant Studio preview · Open site to verify the real shop page</span></div>';
      dock.appendChild(real);
    }

    const host=real.querySelector("[data-m7studio-phone-content]");
    if(!host)return;

    const source=studioPreviewSource();
    host.innerHTML="";

    if(source){
      const clone=source.cloneNode(true);
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach(el=>el.removeAttribute("id"));

      if(activeTab==="profile"||activeTab==="story"||activeTab==="vip"){
        hydrateProfilePreview(clone);
      }

      if(source.matches&&source.matches("[data-m7v4-preview-body]")){
        clone.classList.add("m7studio-base-preview");
      }

      host.appendChild(clone);
    }
    else{
      host.innerHTML='<div class="m7studio-preview-empty"><div><b>Preview unavailable</b>This section has no local preview surface yet. The controls and Save Changes still use the real Admin form.</div></div>';
    }

    const row=TABS.find(item=>item[0]===activeTab)||TABS[0];
    const title=dock.querySelector("[data-m7v4-preview-title]");
    if(title)title.textContent="Studio Preview · "+row[2];

    const copy=dock.querySelector(".m7v4-preview-head-copy small");
    if(copy)copy.textContent="Unsaved controls update this preview immediately";

    const live=dock.querySelector(".m7v4-preview-live");
    if(live)live.textContent="DRAFT";
  }

  function scheduleStudioPreview(panel){
    clearTimeout(previewRefreshTimer);
    previewRefreshTimer=setTimeout(
      ()=>renderStudioPreview(
        panel||document.getElementById("ma-admin-edit-card")
      ),
      16
    );
  }

  function ensureStudioPreview(panel){
    panel?.querySelector(".m7studio-real-preview")?.remove();
    renderStudioPreview(panel);
  }

  function ensureChrome(panel){
    let top=panel.querySelector(":scope > .m7studio-topbar");
    if(!top){
      top=document.createElement("div");
      top.className="m7studio-topbar";
      top.innerHTML='<div class="m7studio-brand-icon">🎨</div><div class="m7studio-title"><b>Shop Design Studio</b><small data-m7studio-subtitle>Design the shop page and see changes instantly.</small></div><span class="m7studio-sync">Studio preview ready</span><button type="button" class="m7studio-top-btn preview" data-m7studio-open>Open shop ↗</button><button type="button" class="m7studio-top-btn" data-m7studio-preview>Preview</button><button type="button" class="m7studio-top-btn primary" data-m7studio-save>▣ Save Changes</button><button type="button" class="m7studio-top-btn close" data-m7studio-close aria-label="Close">×</button>';
      panel.prepend(top);
      top.querySelector("[data-m7studio-save]")?.addEventListener("click",()=>{
        const form=document.getElementById("ma-admin-edit-form");
        const invalid=[...form.elements].find(el=>el.willValidate&&!el.validity.valid);
        if(invalid){
          const id=invalid.id;
          activateTab(id.startsWith("ma-edit-")?"details":id.includes("hours")?"hours":id.includes("about")?"about":id.includes("profile")?"profile":"advanced");
          invalid.scrollIntoView({block:"center"});invalid.reportValidity();return;
        }
        document.getElementById("ma-admin-save-edit")?.click();
      });
      top.querySelector("[data-m7studio-preview]")?.addEventListener("click",()=>{
        panel.classList.toggle("m7studio-preview-open");
        top.querySelector("[data-m7studio-preview]").textContent=panel.classList.contains("m7studio-preview-open")?"Edit":"Preview";
        scheduleStudioPreview(panel);
      });
      const status=document.createElement("span");status.className="m7studio-save-status";status.setAttribute("role","status");status.dataset.m7studioSaveStatus="";top.append(status);
      top.querySelector("[data-m7studio-open]")?.addEventListener("click",()=>{const url=studioPublicUrl();if(url)window.open(url,"_blank","noopener")});
      top.querySelector("[data-m7studio-close]")?.addEventListener("click",()=>{closeStudio();document.getElementById("ma-admin-cancel-edit")?.click()});
    }
    let nav=panel.querySelector(":scope > .m7studio-tabs");
    if(!nav){
      nav=document.createElement("nav");
      nav.className="m7studio-tabs";
      nav.setAttribute("aria-label","Shop Design Studio sections");
      nav.innerHTML=TABS.map(([key,icon,label])=>'<button type="button" class="m7studio-tab" data-m7studio-tab="'+esc(key)+'"><i>'+esc(icon)+'</i><span>'+esc(label)+'</span></button>').join("");
      const picker=document.createElement("select");picker.className="m7studio-section-picker";picker.setAttribute("aria-label","Studio section");
      picker.innerHTML=TABS.map(([key,icon,label])=>'<option value="'+esc(key)+'">'+esc(label)+'</option>').join("");
      picker.addEventListener("change",()=>activateTab(picker.value));nav.prepend(picker);
      top.after(nav);

      /*
         The legacy Admin has several delegated click handlers. Bind Studio
         tabs directly and stop the event at the button so About / Hub can
         never fall through to an old Homepage/About navigation action.
      */
      nav.querySelectorAll("[data-m7studio-tab]").forEach(button=>{
        ["pointerdown","mousedown","touchstart"].forEach(type=>{
          button.addEventListener(type,event=>{
            event.stopPropagation();
          },{capture:true,passive:true});
        });

        button.addEventListener("click",event=>{
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          activateTab(button.dataset.m7studioTab);
        },true);
      });
    }
    const picker=nav.querySelector(".m7studio-section-picker");if(picker)picker.value=activeTab;
    const name=String(document.getElementById("ma-edit-name")?.value||document.getElementById("ma-edit-original-slug")?.value||"Shop").trim();
    const subtitle=top.querySelector("[data-m7studio-subtitle]");if(subtitle)subtitle.textContent="Editing "+name;
    nav.querySelectorAll("[data-m7studio-tab]").forEach(button=>button.classList.toggle("active",button.dataset.m7studioTab===activeTab));
  }

  function sectionBanner(form,key){
    form.querySelector(":scope > .m7studio-section-banner")?.remove();
    const row=TABS.find(item=>item[0]===key)||TABS[0];
    const box=document.createElement("div");
    box.className="m7studio-section-banner";
    box.innerHTML='<i>'+esc(row[1])+'</i><div><b>'+esc(row[2])+'</b><small>'+esc(row[3])+'</small></div>';
    form.prepend(box);
  }

  function showRoots(form,selectors){
    const roots=rootsFor(form,selectors);
    hideFormRoots(form,roots);
    return roots;
  }

  const managerHomes=new Map();
  let managerRequest=0;
  function rememberManager(node){
    if(node&&!managerHomes.has(node)){const marker=document.createComment("Studio manager home");node.before(marker);managerHomes.set(node,marker)}
    return node;
  }
  function restoreManagers(){
    managerRequest++;
    for(const [node,marker] of managerHomes){if(marker.parentNode)marker.replaceWith(node);if(node.id!=="m7-live-admin-panel")node.hidden=true}
    managerHomes.clear();document.getElementById("m7-live-admin-overlay")?.classList.remove("active");
  }
  function hideManagerDock(panel){
    restoreManagers();panel.classList.remove("m7studio-manager-mode");panel.querySelector(".m7studio-manager-dock")?.replaceChildren();
    for(const selector of ["[data-m7studio-save]","[data-m7studio-preview]"]){const el=panel.querySelector(selector);if(el)el.hidden=false}
  }
  async function mountManager(host,key){
    restoreManagers();const request=++managerRequest;
    const shop=window.Ma7alakAdminStudioBridge?.shop();if(!shop)return;
    const rows={gallery:["ma-admin-gallery-card",window.Ma7alakAdminOpenGalleryManager],video:["ma-admin-video-card",window.Ma7alakAdminOpenVideoManager],reels:["ma-admin-reels-card",window.Ma7alakAdminOpenReelsManager]};
    host.textContent="Loading…";
    try{
      if(key==="offers"){
        const pending=window.Ma7alakAdminOpenLiveOffers(shop.shop_slug,shop.shop_name);
        document.getElementById("m7-live-admin-overlay")?.classList.remove("active");
        const node=rememberManager(document.getElementById("m7-live-admin-panel"));if(node)host.replaceChildren(node);
        await pending;
      }else{
        const [id,open]=rows[key];if(typeof open!=="function")throw Error("This manager is still loading. Try again.");
        const node=rememberManager(document.getElementById(id));if(!node)throw Error("This manager is unavailable.");
        host.replaceChildren(node);await open(shop);
        if(request===managerRequest){node.hidden=false;node.classList.add("m7v4-show")}
      }
    }catch(error){if(request===managerRequest)host.textContent=error.message||"Could not load this manager."}
  }
  function showManagerDock(panel,key){
    panel.classList.add("m7studio-manager-mode");
    let dock=panel.querySelector(".m7studio-manager-dock");
    if(!dock){dock=document.createElement("div");dock.className="m7studio-manager-dock";panel.querySelector(".m7v4-preview-grid").append(dock)}
    for(const selector of ["[data-m7studio-save]","[data-m7studio-preview]"]){const el=panel.querySelector(selector);if(el)el.hidden=true}
    const note=document.createElement("p");note.textContent="Changes in this section save immediately. Your unsaved design edits stay in the Studio.";dock.append(note);
    const host=document.createElement("div");
    if(key==="publishing"){
      dock.append(host);const render=()=>{host.innerHTML=window.Ma7alakAdminStudioBridge?.publishing()||"Select a shop first."};render();
      host.addEventListener("click",async event=>{
        const button=event.target.closest("[data-m7v4-action],[data-m7v4-save-owner-media-limits]");if(!button)return;
        button.disabled=true;
        try{
          const bridge=window.Ma7alakAdminStudioBridge;
          if(button.hasAttribute("data-m7v4-save-owner-media-limits")){
            const value=selector=>{const n=Number(host.querySelector(selector).value);if(!Number.isInteger(n)||n<0||n>100)throw Error("Media limits must be whole numbers from 0 to 100.");return n};
            const photos=value("[data-m7v4-owner-photo-limit]"),videos=value("[data-m7v4-owner-video-limit]");
            await bridge.limits(photos,videos);
            const form=document.getElementById("ma-admin-edit-form");form.dataset.directoryOptions=JSON.stringify({...JSON.parse(form.dataset.directoryOptions||"{}"),owner_media_photo_limit:photos,owner_media_video_limit:videos});
          }else await bridge.action(button.dataset.m7v4Action);
          render();note.textContent="Saved. Your unsaved design edits are still here.";
        }catch(error){note.textContent=error.message||"Could not save."}finally{button.disabled=false}
      });return;
    }
    if(key==="uploads"){
      const nav=document.createElement("div");nav.className="m7studio-upload-tabs";nav.innerHTML='<button type="button" data-manager="gallery" aria-pressed="true">Photos</button><button type="button" data-manager="video" aria-pressed="false">Videos</button>';
      nav.addEventListener("click",event=>{const button=event.target.closest("[data-manager]");if(!button)return;nav.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));mountManager(host,button.dataset.manager)});
      dock.append(nav,host);mountManager(host,"gallery");
    }else{dock.append(host);mountManager(host,key)}
  }
  function ensureProfileUpload(form){
    const pane=form.querySelector('[data-m7ds-pane="profile"]');if(!pane||pane.querySelector("[data-m7studio-profile-file]"))return;
    const label=document.createElement("label");label.className="m7studio-image-upload";label.innerHTML='Upload profile image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-m7studio-profile-file>';
    const status=pane.querySelector("[data-m7-profile-image-status]");pane.querySelector(".m7ds-profile-image-preview")?.before(label);
    label.querySelector("input").addEventListener("change",async event=>{
      const input=event.target,file=input.files[0];if(!file)return;input.disabled=true;
      try{await uploadProfileImage(file,status);form.querySelector(".m7-design-studio")?.__m7ProfileImageSync?.();scheduleStudioPreview()}
      catch(error){if(status)status.textContent=error.message||"Upload failed."}finally{input.disabled=false;input.value=""}
    });
  }
  function bindSaveFeedback(panel){
    if(panel.__studioSaveFeedback)return;panel.__studioSaveFeedback=true;
    const status=panel.querySelector("[data-m7studio-save-status]"),source=document.getElementById("ma-admin-edit-status");
    if(source)new MutationObserver(()=>{status.textContent=source.textContent}).observe(source,{childList:true,characterData:true,subtree:true});
    window.addEventListener("ma7alak:studio-save-state",event=>{
      const button=panel.querySelector("[data-m7studio-save]");button.disabled=event.detail.state==="saving";button.textContent=button.disabled?"Saving…":"Save Changes";
      status.textContent=event.detail.state==="saved"?"Saved successfully.":event.detail.message||"Saving…";
    });
  }
  function simplifyAddShop(){
    const form=document.getElementById("ma-admin-shop-form");if(!form)return;form.classList.add("m7studio-simple-add");
    const allowed=new Set(["ma-shop-name","ma-shop-arabic","ma-shop-slug","ma-shop-image","ma-shop-image-file","ma-shop-url","ma-shop-area","ma-shop-location","ma-shop-category","ma-shop-category-name","ma-shop-city-v2","ma-shop-v2-area-smart","ma-shop-v2-category-smart"]);
    for(const child of form.children){
      const keep=child.classList.contains("m7-design-studio")||child.id==="ma-admin-add-shop-btn"||child.id==="ma-image-preview-wrap"||[...child.querySelectorAll("input,select,textarea")].some(el=>allowed.has(el.id));
      child.classList.toggle("m7studio-add-hidden",!keep);
    }
    const card=form.closest("section");
    card?.querySelectorAll(".m7-collapse-btn").forEach(button=>button.remove());
    card?.querySelectorAll(".m7-collapsed-body").forEach(node=>node.classList.remove("m7-collapsed-body"));
    const design=form.querySelector(".m7-design-studio");
    if(design){
      document.getElementById("ma-image-preview-wrap")?.after(design);
      const submit=document.getElementById("ma-admin-add-shop-btn");if(submit)form.append(submit);
      for(const child of design.children){child.classList.toggle("m7studio-add-hidden",child.dataset.m7dsPane!=="profile");if(child.dataset.m7dsPane)child.classList.toggle("active",child.dataset.m7dsPane==="profile")}
      const pane=design.querySelector('[data-m7ds-pane="profile"]');
      if(pane){
        for(const child of pane.children){const keep=child.querySelector("#m7da-profile_banner_enabled,[data-m7-banner-upload],[data-m7-banner-clear]")||child.hasAttribute("data-m7-banner-preview")||child.id==="m7da-profile_banner_image_url";child.classList.toggle("m7studio-add-hidden",!keep)}
        pane.querySelectorAll(".m7ds-banner-grid > *").forEach(el=>el.classList.toggle("m7studio-add-hidden",!el.querySelector("[data-m7-banner-upload]")));
      }
    }
    if(!document.getElementById("m7studio-add-css")){
      const style=document.createElement("style");style.id="m7studio-add-css";
      style.textContent='#ma-admin-shop-form.m7studio-simple-add .m7studio-add-hidden{display:none!important}#ma-admin-shop-form.m7studio-simple-add{max-width:760px;margin:auto}#ma-admin-shop-form.m7studio-simple-add input,#ma-admin-shop-form.m7studio-simple-add select{font-size:16px!important}#ma-admin-shop-form.m7studio-simple-add .m7-design-studio{display:block!important}#ma-admin-shop-form.m7studio-simple-add .m7ds-pane.active:not(.m7studio-add-hidden){display:block!important}#ma-admin-shop-form.m7studio-simple-add .m7ds-banner-grid{grid-template-columns:1fr!important}';document.head.append(style);
    }
  }
  document.addEventListener("click",event=>{if(event.target.closest("[data-m7v4-add]"))setTimeout(simplifyAddShop,0)});

  function activateTab(key){
    const panel=document.getElementById("ma-admin-edit-card");
    const form=document.getElementById("ma-admin-edit-form");
    if(!panel||!form||!panel.classList.contains("m7studio-fullscreen"))return;
    if(!TABS.some(row=>row[0]===key))key="profile";

    activeTab=key;panel.dataset.studioTab=key;
    resetView(form);
    sectionBanner(form,key);

    const design=form.querySelector(".m7-design-studio");
    const extras=form.querySelector(".m7da-sectioned-extras");
    const markExtras=function(mode){
      if(!extras)return;
      ["details","card","design","about","hours"].forEach(name=>extras.classList.remove("m7v4-extras-"+name));
      if(mode)extras.classList.add("m7v4-extras-"+mode);
    };

    const hideDesignChrome=()=>{
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
    };

    hideManagerDock(panel);
    if(["uploads","reels","offers","publishing"].includes(key)){
      hideFormRoots(form,[]);showManagerDock(panel,key);
    }
    else if(key==="details"){
      const roots=showRoots(form,["#ma-edit-name","#ma-edit-arabic","#ma-edit-slug","#ma-edit-url","#ma-edit-location","#ma-edit-area","#ma-edit-category","#ma-edit-category-name","#ma-edit-city-v2","#ma-edit-v2-area-smart","#ma-edit-v2-category-smart"]);
      roots.forEach(root=>root.classList.remove("m7studio-profile-core"));
    }
    else if(key==="profile"){
      const roots=showRoots(form,[
        ".m7labelbox",
        ".m7-design-studio"
      ]);

      showPanes(form,["profile","identity","lines","follow","typography"]);
      markExtras("");

      const identity=design?.querySelector('[data-m7ds-pane="identity"]');
      const identityTitle=identity?.querySelector(":scope > .m7ds-section-title");
      if(identityTitle)identityTitle.textContent="Profile & Shop Identity";
      const typography=design?.querySelector('[data-m7ds-pane="typography"]');

      /* Profile owns the ring color. Story owns only Story motion. */
      filterFields(identity,id=>!id.includes("story_"));
      filterFields(typography,id=>/(?:profile|follow)_font_(?:style|size)$/.test(id));

      hideDesignChrome();
      ["identity","lines","follow","typography"].forEach(name=>
        tidyPane(design?.querySelector('[data-m7ds-pane="'+name+'"]'))
      );

      hideFormRoots(form,roots);
      ensureProfileUpload(form);
    }
    else if(key==="story"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["identity"]);
      const storyPane=design?.querySelector('[data-m7ds-pane="identity"]');
      filterFields(
        storyPane,
        id=>id.includes("story_")
      );
      const storyTitle=storyPane?.querySelector(":scope > .m7ds-section-title");
      if(storyTitle)storyTitle.textContent="Story Effects";
      hideDesignChrome();
      tidyPane(design?.querySelector('[data-m7ds-pane="identity"]'));
      hideFormRoots(form,roots);
    }
    else if(key==="vip"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["vip"]);
      const vipPane=design?.querySelector('[data-m7ds-pane="vip"]');
      const vipTitle=vipPane?.querySelector(":scope > .m7ds-section-title");
      if(vipTitle)vipTitle.textContent="VIP Story Identity";
      hideDesignChrome();
      tidyPane(vipPane);
      hideFormRoots(form,roots);
    }
    else if(key==="live"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["modules","typography"]);

      const liveModules=design?.querySelector('[data-m7ds-pane="modules"]');
      filterFields(
        liveModules,
        id=>id.includes("live_")
      );
      const liveHeading=liveModules?.querySelector(":scope > .m7ds-section-title");
      if(liveHeading)liveHeading.textContent="Live / Offers Accent & Design";
      filterFields(
        design?.querySelector('[data-m7ds-pane="typography"]'),
        id=>/live_font_(?:style|size)$/.test(id)
      );

      hideDesignChrome();
      tidyPane(design?.querySelector('[data-m7ds-pane="modules"]'));
      tidyPane(design?.querySelector('[data-m7ds-pane="typography"]'));
      hideFormRoots(form,roots);
    }
    else if(key==="media"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["modules","typography"]);

      const mediaModules=design?.querySelector('[data-m7ds-pane="modules"]');
      filterFields(
        mediaModules,
        id=>/gallery_|media_|video_/.test(id)
      );
      const mediaHeading=mediaModules?.querySelector(":scope > .m7ds-section-title");
      if(mediaHeading)mediaHeading.textContent="Photos & Videos — Accent Colors";
      const galleryHeading=[...mediaModules?.querySelectorAll(".m7ds-section-title")||[]]
        .find(el=>/Gallery Multi-Color Frame/i.test(el.textContent||""));
      if(galleryHeading)galleryHeading.textContent="Gallery Photo Frame";
      filterFields(
        design?.querySelector('[data-m7ds-pane="typography"]'),
        id=>/media_font_(?:style|size)$/.test(id)
      );

      hideDesignChrome();
      tidyPane(design?.querySelector('[data-m7ds-pane="modules"]'));
      tidyPane(design?.querySelector('[data-m7ds-pane="typography"]'));
      hideFormRoots(form,roots);
    }
    else if(key==="about"){
      const roots=showRoots(form,[
        ".m7-about-services-fields",
        ".m7-about-text-style-box",
        ".m7da-sectioned-extras",
        ".m7-design-studio"
      ]);

      showPanes(form,["about","typography","modules"]);
      markExtras("");

      if(extras){
        extras.classList.add("m7studio-hub-extras");
      }

      const hubNote=document.createElement("div");
      hubNote.className="m7studio-hub-note";
      hubNote.innerHTML="<b>Profile Hub controls</b><br>About text, services, social links, address/location styling and Hub appearance are grouped here. Followers / Following / Likes are live stats and are not manually editable.";
      form.insertBefore(hubNote,form.firstChild.nextSibling);

      filterFields(
        design?.querySelector('[data-m7ds-pane="typography"]'),
        id=>/(?:about|hub)_font_(?:style|size)$/.test(id)
      );

      /*
         Main About title + Arabic subtitle now live together inside the
         About / Hub heading editor. Hide the older duplicate title
         color/animation controls from the legacy About pane.
      */
      const aboutDesignPane=design?.querySelector('[data-m7ds-pane="about"]');
      filterFields(
        aboutDesignPane,
        id=>![
          "m7de-about_title_color",
          "m7de-about_title_animation"
        ].includes(id)
      );

      const hubModules=design?.querySelector('[data-m7ds-pane="modules"]');
      filterFields(
        hubModules,
        id=>id.includes("hub_")
      );
      const hubHeading=hubModules?.querySelector(":scope > .m7ds-section-title");
      if(hubHeading)hubHeading.textContent="Profile Hub Accent";

      hideDesignChrome();
      tidyPane(design?.querySelector('[data-m7ds-pane="about"]'));
      tidyPane(design?.querySelector('[data-m7ds-pane="typography"]'));
      tidyPane(design?.querySelector('[data-m7ds-pane="modules"]'));
      hideFormRoots(form,roots);
    }
    else if(key==="hours"){
      const roots=showRoots(form,[
        ".m7-hours-schedule-box",
        ".m7-availability-extra-box",
        ".m7da-sectioned-extras",
        ".m7-design-studio"
      ]);

      showPanes(form,["typography"]);
      markExtras("hours");

      filterFields(
        design?.querySelector('[data-m7ds-pane="typography"]'),
        id=>/hours_font_(?:style|size)$/.test(id)
      );

      hideDesignChrome();
      tidyPane(design?.querySelector('[data-m7ds-pane="typography"]'));
      hideFormRoots(form,roots);
    }
    else{
      const roots=showRoots(form,[
        ".m7-design-studio",
        ".m7-card-designer-box",
        ".m7da-home-fields",
        ".m7da-sectioned-extras"
      ]);

      showPanes(form,["motion","typography"]);
      /* story_color is the real saved Universal Accent field. */
      markExtras("");
      if(extras){extras.classList.add("m7studio-global-extras");filterFields(extras,id=>/m7de-(story_color|cover|price|order|latitude|longitude|rating|review_count)$/.test(id))}

      filterFields(
        design?.querySelector('[data-m7ds-pane="typography"]'),
        id=>/global_font_(?:style|size)$/.test(id)
      );

      /* Global preset / universal accent belong here, not repeated per module. */
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.remove("m7studio-field-hidden");

      tidyPane(design?.querySelector('[data-m7ds-pane="motion"]'));
      tidyPane(design?.querySelector('[data-m7ds-pane="typography"]'));
      hideFormRoots(form,roots);
    }

    ensureChrome(panel);
    ensureStudioPreview(panel);

    panel.querySelectorAll("[data-m7studio-tab]").forEach(button=>
      button.classList.toggle("active",button.dataset.m7studioTab===key)
    );

    scheduleStudioPreview(panel);
    form.scrollTop=0;panel.scrollTop=0;
    panel.classList.remove("m7studio-preview-open");
    const previewToggle=panel.querySelector("[data-m7studio-preview]");if(previewToggle)previewToggle.textContent="Preview";
  }

  function openStudio(){
    const panel=document.getElementById("ma-admin-edit-card");
    const form=document.getElementById("ma-admin-edit-form");
    if(!panel||!form||panel.hidden||!panel.classList.contains("m7v4-show")||!panel.classList.contains("m7v4-mode-design"))return false;
    css();

    if(form.__m7v4SectionObserver){
      try{form.__m7v4SectionObserver.disconnect()}catch(_){}
      form.__m7studioDisconnectedObserver=true;
    }

    panel.classList.add("m7studio-fullscreen");
    document.body.classList.add("m7studio-body-open");
    ensureChrome(panel);bindSaveFeedback(panel);
    activateTab(activeTab);
    openingWanted=false;
    return true;
  }

  function closeStudio(){
    clearTimeout(openTimer);
    openingWanted=false;

    const form=document.getElementById("ma-admin-edit-form");
    if(form&&form.__m7studioDisconnectedObserver){
      try{form.__m7v4SectionObserver?.disconnect?.()}catch(_){}
      form.__m7v4SectionObserver=null;
      form.__m7studioDisconnectedObserver=false;
    }

    const panel=document.getElementById("ma-admin-edit-card");
    restoreManagers();if(form)resetView(form);
    panel?.classList.remove("m7studio-fullscreen","m7studio-preview-open","m7studio-manager-mode","m7v4-show");
    if(panel)panel.hidden=true;
    document.getElementById("m7savebar")?.classList.remove("on");
    clearTimeout(previewRefreshTimer);
    document.body.classList.remove("m7studio-body-open");
  }

  function waitAndOpen(){
    clearTimeout(openTimer);
    let tries=0;
    const run=()=>{
      if(!openingWanted)return;
      if(openStudio())return;
      tries++;
      if(tries<100)openTimer=setTimeout(run,50);
    };
    run();
  }

  document.addEventListener("click",event=>{
    const designButton=event.target.closest('[data-m7v4-action="design"]');
    if(designButton){activeTab="profile";openingWanted=true;waitAndOpen();return}
    if(event.target.closest("#ma-admin-cancel-edit")||event.target.closest("#ma-admin-edit-card > .m7v4-panel-close"))closeStudio();
  },true);

  document.addEventListener("input",event=>{
    if(!document.body.classList.contains("m7studio-body-open"))return;
    if(event.target?.id==="ma-edit-name")ensureChrome(document.getElementById("ma-admin-edit-card"));
    if(event.target?.id==="m7de-profile_ring_color")syncProfileImageCardAccent();
    scheduleStudioPreview();
  },true);

  document.addEventListener("change",event=>{
    if(!document.body.classList.contains("m7studio-body-open"))return;
    scheduleStudioPreview();
  },true);

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&document.body.classList.contains("m7studio-body-open")){
      event.preventDefault();
      closeStudio();
      document.getElementById("ma-admin-cancel-edit")?.click();
    }
  });

  window.Ma7alakShopDesignStudio={open:function(){openingWanted=true;waitAndOpen()},close:closeStudio,tab:activateTab};
  css();

  setTimeout(()=>{
    const panel=document.getElementById("ma-admin-edit-card");
    if(
      panel &&
      !panel.hidden &&
      panel.classList.contains("m7v4-show") &&
      panel.classList.contains("m7v4-mode-design")
    ){
      openingWanted=true;
      waitAndOpen();
    }
  },0);
})();
