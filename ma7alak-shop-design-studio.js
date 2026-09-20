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
    ["profile","♙","Profile","Profile image, identity, label, banner, shell, Follow and Message"],
    ["story","◉","Story","Story/profile ring and new-Story effects"],
    ["live","◉","Live","Live panel, cards, status and offer styling"],
    ["media","▧","Media","Gallery, videos, filters and multi-layer frames"],
    ["about","●","About","About content, services, panel design and text"],
    ["hours","◷","Hours","Weekly opening hours and availability"],
    ["colors","◒","Colors","Every visible shop-page color in one compact place"],
    ["typography","Aa","Typography","Global and module fonts, sizes and individual About text"],
    ["animations","✦","Animations","Motion, shimmer, glow, pulse and animation tuning"],
    ["advanced","⚙","Advanced","Presets, lines, symbols and Directory Card design"]
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
      #ma-admin-edit-card.m7studio-fullscreen{position:fixed!important;inset:0!important;z-index:100000!important;width:100vw!important;height:100dvh!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;overflow:auto!important;overscroll-behavior:contain!important;border:0!important;border-radius:0!important;background:radial-gradient(circle at 8% 0%,rgba(218,170,82,.07),transparent 29%),linear-gradient(180deg,#0b0d0e,#070809 58%,#060707)!important;box-shadow:none!important;container-type:normal!important;color:#f4ead9!important}
      #ma-admin-edit-card.m7studio-fullscreen>.m7v4-panel-close{display:none!important}
      #ma-admin-edit-card.m7studio-fullscreen>:not(.m7studio-topbar):not(.m7studio-tabs):not(.m7v4-preview-grid){display:none!important}
      .m7studio-topbar{position:sticky;top:0;z-index:130;min-height:72px;display:flex;align-items:center;gap:14px;padding:10px clamp(16px,2.2vw,34px);border-bottom:1px solid rgba(218,170,82,.15);background:rgba(8,10,11,.965);box-shadow:0 10px 28px rgba(0,0,0,.30);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
      .m7studio-brand-icon{width:46px;height:46px;flex:0 0 46px;display:grid;place-items:center;border:1px solid rgba(218,170,82,.25);border-radius:14px;background:rgba(218,170,82,.07);color:#efc76e;font-size:20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
      .m7studio-title{min-width:0;margin-right:auto}.m7studio-title b{display:block;color:#f3ca70;font-size:clamp(18px,1.55vw,25px);line-height:1.1;font-weight:950}.m7studio-title small{display:block;margin-top:4px;color:#938878;font-size:10px;line-height:1.35}
      .m7studio-sync{display:flex;align-items:center;gap:6px;padding:7px 9px;border:1px solid rgba(72,219,138,.18);border-radius:999px;background:rgba(72,219,138,.055);color:#74e3a4;font-size:8px;font-weight:900;white-space:nowrap}.m7studio-sync:before{content:"";width:7px;height:7px;border-radius:50%;background:#46dc88;box-shadow:0 0 11px rgba(70,220,136,.65)}
      .m7studio-top-btn{min-height:42px;padding:0 15px;border:1px solid rgba(218,170,82,.28);border-radius:12px;background:rgba(218,170,82,.035);color:#e9c57b;font-size:10px;font-weight:900;cursor:pointer;white-space:nowrap}.m7studio-top-btn.primary{min-width:130px;border-color:#e4b355;background:linear-gradient(135deg,#f4d383,#d9a13f);color:#1a1208;box-shadow:0 8px 22px rgba(218,170,82,.12)}.m7studio-top-btn.close{width:42px;min-width:42px;padding:0;font-size:21px;line-height:1}
      .m7studio-tabs{position:sticky;top:72px;z-index:125;display:flex;gap:7px;padding:10px clamp(16px,2.2vw,34px);overflow-x:auto;border-bottom:1px solid rgba(218,170,82,.11);background:rgba(9,11,12,.955);scrollbar-width:none;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}.m7studio-tabs::-webkit-scrollbar{display:none}
      .m7studio-tab{flex:0 0 auto;min-height:42px;display:flex;align-items:center;gap:8px;padding:0 13px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:#101214;color:#b7aea1;font-size:9px;font-weight:900;cursor:pointer;transition:.15s ease}.m7studio-tab i{color:#d9aa58;font-style:normal;font-size:12px}.m7studio-tab.active{border-color:#d9aa58;background:radial-gradient(circle at 20% 0%,rgba(239,194,101,.17),transparent 58%),#17150f;color:#f2ce83;box-shadow:0 0 0 1px rgba(217,170,88,.10),0 0 16px rgba(217,170,88,.12)}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{display:grid!important;grid-template-columns:minmax(580px,1fr) minmax(360px,430px)!important;gap:18px!important;align-items:start!important;width:min(1760px,calc(100vw - 38px))!important;max-width:none!important;margin:16px auto 30px!important;overflow:visible!important}
      #ma-admin-edit-card.m7studio-fullscreen #ma-admin-edit-form{width:100%!important;max-width:none!important;min-width:0!important;padding:0!important;overflow:visible!important;background:transparent!important}
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
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-preview{position:sticky!important;top:137px!important;width:100%!important;max-width:none!important;max-height:calc(100dvh - 155px)!important;overflow:auto!important;border:1px solid rgba(218,170,82,.25)!important;border-radius:18px!important;background:#0b0d0e!important;box-shadow:0 18px 50px rgba(0,0,0,.46)!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-head{position:sticky!important;top:0!important;z-index:4!important;background:rgba(11,13,14,.97)!important}
      #ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-stage,#ma-admin-edit-card.m7studio-fullscreen .m7pv-note{display:none!important}
      .m7studio-real-preview{padding:12px 12px 14px}.m7studio-phone{position:relative;width:min(100%,386px);height:min(720px,calc(100dvh - 235px));min-height:500px;margin:0 auto;overflow:hidden;border:2px solid #342716;border-radius:32px;background:#000;box-shadow:0 20px 55px rgba(0,0,0,.58),0 0 28px rgba(218,170,82,.09),inset 0 0 0 4px #080808}.m7studio-phone:before{content:"";position:absolute;z-index:3;top:8px;left:50%;width:94px;height:20px;transform:translateX(-50%);border-radius:999px;background:#030303;border:1px solid rgba(255,255,255,.055);pointer-events:none}.m7studio-phone iframe{width:100%;height:100%;display:block;border:0;background:#050505}.m7studio-preview-note{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:9px;color:#82796d;font-size:8px;line-height:1.4;text-align:center}.m7studio-preview-note i{width:7px;height:7px;border-radius:50%;background:#46dc88;box-shadow:0 0 9px rgba(70,220,136,.55)}
      #ma-admin-edit-card.m7studio-fullscreen .m7studio-section-banner{display:flex;align-items:flex-start;gap:10px;margin:0 0 12px;padding:13px 14px;border:1px solid rgba(218,170,82,.15);border-radius:14px;background:radial-gradient(circle at 0 0,rgba(218,170,82,.075),transparent 42%),rgba(255,255,255,.014)}.m7studio-section-banner i{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border:1px solid rgba(218,170,82,.16);border-radius:10px;background:rgba(218,170,82,.06);color:#edc979;font-style:normal;font-size:14px}.m7studio-section-banner b{display:block;color:#efd49a;font-size:13px}.m7studio-section-banner small{display:block;margin-top:3px;color:#81776a;font-size:8px;line-height:1.45}
      .m7v4-actions-studio{grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr)!important}.m7v4-actions-studio [data-m7v4-action="design"]{border-color:rgba(217,170,88,.35)!important;background:radial-gradient(circle at 15% 0%,rgba(217,170,88,.11),transparent 50%),rgba(217,170,88,.035)!important}
      @media(max-width:1100px){#ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{grid-template-columns:minmax(0,1fr) 350px!important;width:calc(100vw - 24px)!important;gap:12px!important}#ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:820px){.m7studio-topbar{flex-wrap:wrap;min-height:auto;padding:9px 10px}.m7studio-title{flex:1 1 180px}.m7studio-sync{display:none}.m7studio-top-btn{min-height:37px;padding:0 10px}.m7studio-tabs{top:103px;padding:8px 10px}#ma-admin-edit-card.m7studio-fullscreen .m7v4-preview-grid{grid-template-columns:1fr!important;width:calc(100vw - 18px)!important;margin:10px auto 22px!important}#ma-admin-edit-card.m7studio-fullscreen .m7v4-edit-preview{position:relative!important;top:auto!important;order:-1!important;max-height:none!important}.m7studio-phone{height:590px}}
      @media(max-width:560px){.m7studio-brand-icon{display:none}.m7studio-title b{font-size:16px}.m7studio-title small{font-size:8px}.m7studio-top-btn.preview{display:none}.m7studio-tabs{top:94px}#ma-admin-edit-card.m7studio-fullscreen .m7ds-grid,#ma-admin-edit-card.m7studio-fullscreen .m7ds-top-grid,#ma-admin-edit-card.m7studio-fullscreen .m7studio-colors-mode .m7ds-grid{grid-template-columns:1fr!important}.m7v4-actions-studio{grid-template-columns:1fr!important}}
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
    [...form.children].forEach(child=>child.classList.remove("m7studio-hidden","m7studio-force-show"));
    form.querySelectorAll(".m7studio-field-hidden").forEach(node=>node.classList.remove("m7studio-field-hidden"));
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
    design.querySelectorAll(":scope > .m7ds-pane").forEach(pane=>pane.classList.toggle("m7studio-pane-on",names.includes(String(pane.dataset.m7dsPane||""))));
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

  function studioUrl(){
    const explicit=String(document.getElementById("ma-edit-url")?.value||"").trim();
    if(/^https?:\/\//i.test(explicit))return explicit;
    const slug=String(document.getElementById("ma-edit-original-slug")?.value||document.getElementById("ma-edit-slug")?.value||"").trim();
    return slug?"https://shoufhon.com/"+encodeURIComponent(slug):"";
  }

  function ensureRealPreview(panel){
    const dock=panel.querySelector(".m7v4-edit-preview");
    if(!dock)return;
    let real=dock.querySelector(".m7studio-real-preview");
    if(!real){
      real=document.createElement("div");
      real.className="m7studio-real-preview";
      real.innerHTML='<div class="m7studio-phone"><iframe data-m7studio-frame title="Live shop preview" loading="eager"></iframe></div><div class="m7studio-preview-note"><i></i><span>Real shop page · unsaved edits sync here live</span></div>';
      dock.appendChild(real);
    }
    const frame=real.querySelector("[data-m7studio-frame]");
    const url=studioUrl();
    if(frame&&url&&String(frame.dataset.currentUrl||"")!==url){frame.dataset.currentUrl=url;frame.src=url}
    const title=dock.querySelector("[data-m7v4-preview-title]");if(title)title.textContent="Live Preview · Real shop page";
    const copy=dock.querySelector(".m7v4-preview-head-copy small");if(copy)copy.textContent="Scroll the phone and watch unsaved changes instantly";
    const live=dock.querySelector(".m7v4-preview-live");if(live)live.textContent="SYNCED";
  }

  function ensureChrome(panel){
    let top=panel.querySelector(":scope > .m7studio-topbar");
    if(!top){
      top=document.createElement("div");
      top.className="m7studio-topbar";
      top.innerHTML='<div class="m7studio-brand-icon">🎨</div><div class="m7studio-title"><b>Shop Design Studio</b><small data-m7studio-subtitle>Design the shop page and see changes instantly.</small></div><span class="m7studio-sync">Synced to shop page</span><button type="button" class="m7studio-top-btn preview" data-m7studio-open>▣ Preview on Mobile</button><button type="button" class="m7studio-top-btn primary" data-m7studio-save>▣ Save Changes</button><button type="button" class="m7studio-top-btn close" data-m7studio-close aria-label="Close">×</button>';
      panel.prepend(top);
      top.querySelector("[data-m7studio-save]")?.addEventListener("click",()=>document.getElementById("ma-admin-save-edit")?.click());
      top.querySelector("[data-m7studio-open]")?.addEventListener("click",()=>{const url=studioUrl();if(url)window.open(url,"_blank","noopener")});
      top.querySelector("[data-m7studio-close]")?.addEventListener("click",()=>{closeStudio();document.getElementById("ma-admin-cancel-edit")?.click()});
    }
    let nav=panel.querySelector(":scope > .m7studio-tabs");
    if(!nav){
      nav=document.createElement("nav");
      nav.className="m7studio-tabs";
      nav.setAttribute("aria-label","Shop Design Studio sections");
      nav.innerHTML=TABS.map(([key,icon,label])=>'<button type="button" class="m7studio-tab" data-m7studio-tab="'+esc(key)+'"><i>'+esc(icon)+'</i><span>'+esc(label)+'</span></button>').join("");
      top.after(nav);
      nav.addEventListener("click",event=>{const button=event.target.closest("[data-m7studio-tab]");if(button)activateTab(button.dataset.m7studioTab)});
    }
    const name=String(document.getElementById("ma-edit-name")?.value||document.getElementById("ma-edit-original-slug")?.value||"Shop").trim();
    const subtitle=top.querySelector("[data-m7studio-subtitle]");if(subtitle)subtitle.textContent="Editing "+name+" · real controls, real Save, live shop sync.";
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

  function activateTab(key){
    const panel=document.getElementById("ma-admin-edit-card");
    const form=document.getElementById("ma-admin-edit-form");
    if(!panel||!form||!panel.classList.contains("m7studio-fullscreen"))return;
    if(!TABS.some(row=>row[0]===key))key="profile";
    activeTab=key;
    resetView(form);
    sectionBanner(form,key);
    const design=form.querySelector(".m7-design-studio");
    const extras=form.querySelector(".m7da-sectioned-extras");
    const markExtras=function(mode){if(!extras)return;["details","card","design","about","hours"].forEach(name=>extras.classList.remove("m7v4-extras-"+name));if(mode)extras.classList.add("m7v4-extras-"+mode)};

    if(key==="profile"){
      const roots=showRoots(form,[".m7labelbox",".m7-design-studio"]);
      showPanes(form,["identity","follow"]);
      markExtras("");
      filterFields(design?.querySelector('[data-m7ds-pane="identity"]'),id=>!id.includes("story_"));
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      hideFormRoots(form,roots);
    }else if(key==="story"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["identity"]);
      filterFields(design?.querySelector('[data-m7ds-pane="identity"]'),id=>/story_|profile_ring_color/.test(id));
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      hideFormRoots(form,roots);
    }else if(key==="live"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["modules"]);
      filterFields(design?.querySelector('[data-m7ds-pane="modules"]'),id=>id.includes("live_"));
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      hideFormRoots(form,roots);
    }else if(key==="media"){
      const roots=showRoots(form,[".m7-design-studio"]);
      showPanes(form,["modules"]);
      filterFields(design?.querySelector('[data-m7ds-pane="modules"]'),id=>/gallery_|media_|video_/.test(id));
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      hideFormRoots(form,roots);
    }else if(key==="about"){
      const roots=showRoots(form,[".m7-about-services-fields",".m7-about-text-style-box",".m7da-sectioned-extras",".m7-design-studio"]);
      showPanes(form,["about"]);
      markExtras("about");
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      hideFormRoots(form,roots);
    }else if(key==="hours"){
      const roots=showRoots(form,[".m7-hours-schedule-box",".m7-availability-extra-box",".m7da-sectioned-extras"]);
      markExtras("hours");
      hideFormRoots(form,roots);
    }else if(key==="colors"){
      form.classList.add("m7studio-colors-mode");
      const roots=showRoots(form,[".m7-design-studio",".m7-card-designer-box",".m7-about-text-style-box",".m7da-sectioned-extras"]);
      showPanes(form,["identity","lines","about","follow","modules","typography"]);
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      roots.forEach(root=>filterToColors(root));
      hideFormRoots(form,roots);
    }else if(key==="typography"){
      const roots=showRoots(form,[".m7-design-studio",".m7-about-text-style-box"]);
      showPanes(form,["typography"]);
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      const aboutText=form.querySelector(".m7-about-text-style-box");
      if(aboutText)aboutText.querySelectorAll('input[type="color"]').forEach(input=>fieldWrapper(input)?.classList.add("m7studio-field-hidden"));
      hideFormRoots(form,roots);
    }else if(key==="animations"){
      const roots=showRoots(form,[".m7-design-studio",".m7-card-designer-box"]);
      showPanes(form,["identity","motion","about","modules"]);
      const matcher=id=>/animation|motion|effect|pulse|glow|shimmer|intensity|speed|float|sparkle|bounce|sway|flicker/.test(id);
      roots.forEach(root=>filterFields(root,matcher));
      design?.querySelector(":scope > .m7ds-top-grid")?.classList.add("m7studio-field-hidden");
      design?.querySelector(":scope > .m7ds-intro")?.classList.add("m7studio-field-hidden");
      hideFormRoots(form,roots);
    }else{
      const roots=showRoots(form,[".m7-design-studio",".m7-card-designer-box",".m7da-sectioned-extras"]);
      showPanes(form,["lines"]);
      markExtras("card");
      hideFormRoots(form,roots);
    }

    ensureChrome(panel);
    ensureRealPreview(panel);
    panel.querySelectorAll("[data-m7studio-tab]").forEach(button=>button.classList.toggle("active",button.dataset.m7studioTab===key));
    const nudge=form.querySelector("input:not([type='file']),select,textarea");
    if(nudge){try{nudge.dispatchEvent(new Event("input",{bubbles:true}))}catch(_){}}
    panel.scrollTop=0;
  }

  function openStudio(){
    const panel=document.getElementById("ma-admin-edit-card");
    const form=document.getElementById("ma-admin-edit-form");
    if(!panel||!form||panel.hidden||!panel.classList.contains("m7v4-show")||!panel.classList.contains("m7v4-mode-design"))return false;
    css();
    panel.classList.add("m7studio-fullscreen");
    document.body.classList.add("m7studio-body-open");
    ensureChrome(panel);
    ensureRealPreview(panel);
    activateTab(activeTab);
    openingWanted=false;
    return true;
  }

  function closeStudio(){
    clearTimeout(openTimer);
    openingWanted=false;
    document.getElementById("ma-admin-edit-card")?.classList.remove("m7studio-fullscreen");
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
    if(event.target.closest("#ma-admin-cancel-edit")||event.target.closest(".m7v4-panel-close"))closeStudio();
  },true);

  document.addEventListener("input",event=>{
    if(!document.body.classList.contains("m7studio-body-open"))return;
    if(event.target?.id==="ma-edit-name")ensureChrome(document.getElementById("ma-admin-edit-card"));
  },true);

  document.addEventListener("change",event=>{
    if(!document.body.classList.contains("m7studio-body-open"))return;
    if(event.target?.id==="ma-edit-url"||event.target?.id==="ma-edit-slug"){
      const frame=document.querySelector("#ma-admin-edit-card .m7studio-real-preview iframe");
      const url=studioUrl();
      if(frame&&url){frame.dataset.currentUrl=url;frame.src=url}
    }
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
})();