/* =========================================================
   SHOUFHON HOMEPAGE FOOTER MANAGER V1
   Standalone /admin control panel for ma7alak-home-footer.js
========================================================= */
(function(){
  "use strict";
  if(window.self!==window.top)return;
  const path=(location.pathname||"/").replace(/\/+$/,"")||"/";
  if(path!=="/admin")return;
  if(window.__MA7ALAK_HOME_FOOTER_ADMIN_V1__)return;
  window.__MA7ALAK_HOME_FOOTER_ADMIN_V1__=true;

  const TABLE="homepage_footer_settings";
  const ROW_ID="main";
  const BUCKET="shop-gallery";
  const DEFAULTS={
    enabled:true,background_url:"builtin",background_overlay:72,background_position:"center 54%",background_zoom:115,background_color:"#080604",accent_color:"#d9a441",accent_color_2:"#f2cc7b",panel_color:"#0b0805",text_color:"#f7dfaa",muted_color:"#d8c8a8",logo_url:"https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/hadi%20new.png",logo_size:190,logo_animation:"float-glow",title:"شوف هون المحلات",title_color:"#e7bd6b",title_size:31,title_animation:"glow",subtitle:"اكتشف محلات منطقتك بمكان واحد",subtitle_color:"#e8d5b5",subtitle_size:17,subtitle_animation:"fade",top_line_enabled:true,top_line_color:"#d9a441",top_line_animation:"travel",nav_color:"#f4d694",nav_animation:"none",navigation:[{label:"الرئيسية",url:"/",enabled:true},{label:"شوف المحلات",url:"/shwf-almhlat-",enabled:true},{label:"ضيف محلك",url:"/add-shop-",enabled:true}],social_icon_color:"#f1c86e",social_glow_color:"#d9a441",social_size:46,social_animation:"float",socials:[{type:"instagram",label:"Instagram",url:"",enabled:false},{type:"tiktok",label:"TikTok",url:"",enabled:false},{type:"whatsapp",label:"WhatsApp",url:"",enabled:false}],copyright_text:"© 2026 ShoufHon. All rights reserved.",copyright_color:"#f0e4d0",copyright_size:13,copyright_animation:"none",bottom_text:"Made with Love",bottom_color:"#f4d694",bottom_size:14,bottom_animation:"heartbeat",show_flag:true,footer_min_height:590,top_radius:34,content_max_width:760,overall_animation:"subtle",animation_speed:100,animation_intensity:65,cedar_enabled:true,side_note_enabled:true,side_note_text:"Lebanon\nLocal\nAlways ♡",side_note_color:"#cfa660"
  };

  let client=null,launcher=null,overlay=null,settings=clone(DEFAULTS),dirty=false,saving=false;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const clone=v=>JSON.parse(JSON.stringify(v));
  const clamp=(v,min,max,fb)=>{v=Number(v);return Number.isFinite(v)?Math.max(min,Math.min(max,v)):fb};
  const color=(v,fb)=>/^#[0-9a-f]{6}$/i.test(String(v||""))?String(v):fb;
  const ANIMS=["none","float","float-glow","glow","pulse","breathe","rise","fade","sway","shimmer","heartbeat"];
  const SOCIAL_TYPES=["instagram","tiktok","whatsapp","facebook","youtube","x","telegram","website"];

  function merged(raw){const x={...clone(DEFAULTS),...(raw&&typeof raw==="object"?raw:{})};x.navigation=Array.isArray(raw?.navigation)?clone(raw.navigation):clone(DEFAULTS.navigation);x.socials=Array.isArray(raw?.socials)?clone(raw.socials):clone(DEFAULTS.socials);return x}
  function val(id){return $("#"+id,overlay)?.value??""}
  function checked(id){return !!$("#"+id,overlay)?.checked}
  function num(id,fb){const n=Number(val(id));return Number.isFinite(n)?n:fb}
  function setStatus(msg,type=""){const x=$("[data-m7hfa-status]",overlay);if(!x)return;x.textContent=msg||"";x.dataset.type=type}
  function markDirty(){dirty=true;const b=$("[data-m7hfa-save]",overlay);if(b)b.textContent="Save Changes •"}

  function style(){
    if(document.getElementById("m7hfa-css"))return;
    const s=document.createElement("style");s.id="m7hfa-css";s.textContent=`
#m7hfa-launch{width:100%;margin:0 0 16px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #d9a44166;border-radius:17px;background:radial-gradient(circle at 95% 0,#d9a4411f,transparent 35%),linear-gradient(135deg,#1b130c,#0b0a08);color:#f3cf83;box-shadow:0 10px 26px #0005;cursor:pointer;text-align:left}#m7hfa-launch strong{display:block;font-size:15px}#m7hfa-launch small{display:block;margin-top:3px;color:#ffffff86;font-size:11px}#m7hfa-launch b{min-width:45px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid #d9a44155;border-radius:11px;background:#d9a44116;font-size:19px}
#m7hfa-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(2,2,2,.76);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:max(8px,env(safe-area-inset-top)) 8px max(8px,env(safe-area-inset-bottom));overflow:auto;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#fff}#m7hfa-overlay[hidden]{display:none!important}.m7hfa-modal{width:min(1180px,100%);min-height:calc(100dvh - 16px);margin:0 auto;border:1px solid #d9a44155;border-radius:23px;background:radial-gradient(circle at 100% 0,#d9a4411a,transparent 25%),#0b0c0d;box-shadow:0 30px 80px #000b;overflow:hidden}.m7hfa-head{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 15px;border-bottom:1px solid #ffffff12;background:rgba(10,11,12,.96);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.m7hfa-head h2{margin:0;color:#f0c36c;font-size:19px}.m7hfa-head small{display:block;margin-top:3px;color:#ffffff70}.m7hfa-head-actions{display:flex;gap:7px}.m7hfa-btn{min-height:40px;padding:8px 12px;border:1px solid #d9a44155;border-radius:11px;background:#24190f;color:#f3ca73;font-weight:850;cursor:pointer}.m7hfa-btn.primary{border:0;background:linear-gradient(110deg,#f5d384,#d59736);color:#211407}.m7hfa-btn.danger{border-color:#cc595955;background:#2b1010;color:#ff9b9b}.m7hfa-btn.icon{width:40px;padding:0;font-size:19px}.m7hfa-tabs{display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid #ffffff0f;overflow-x:auto;scrollbar-width:none;background:#0c0d0e}.m7hfa-tabs::-webkit-scrollbar{display:none}.m7hfa-tab{white-space:nowrap;min-height:38px;padding:7px 12px;border:1px solid #ffffff14;border-radius:10px;background:#121416;color:#bdb7aa;font-size:11px;font-weight:800;cursor:pointer}.m7hfa-tab.active{border-color:#d9a44166;background:#d9a44114;color:#f1ca75}.m7hfa-main{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,440px);gap:12px;padding:12px}.m7hfa-form{min-width:0}.m7hfa-pane{display:none}.m7hfa-pane.active{display:block}.m7hfa-card{margin-bottom:11px;padding:13px;border:1px solid #ffffff12;border-radius:16px;background:#101214}.m7hfa-card h3{margin:0 0 11px;color:#edc36e;font-size:13px}.m7hfa-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.m7hfa-field{display:grid;gap:5px;min-width:0;color:#cbbfa9;font-size:10px}.m7hfa-field.full{grid-column:1/-1}.m7hfa-field input,.m7hfa-field textarea,.m7hfa-field select{width:100%;min-width:0;min-height:42px;padding:9px 10px;border:1px solid #ffffff16;border-radius:10px;background:#090a0b;color:#fff;outline:0}.m7hfa-field input[type=color]{padding:3px;height:42px}.m7hfa-field input[type=range]{padding:0;accent-color:#d9a441}.m7hfa-field textarea{min-height:68px;resize:vertical}.m7hfa-check{display:flex;align-items:center;gap:8px;color:#dbcaa9;font-size:11px}.m7hfa-check input{width:18px;height:18px;accent-color:#d9a441}.m7hfa-list{display:grid;gap:8px}.m7hfa-row{display:grid;grid-template-columns:28px 110px minmax(95px,1fr) minmax(150px,1.4fr) auto;gap:6px;align-items:center;padding:8px;border:1px solid #ffffff10;border-radius:12px;background:#090a0b}.m7hfa-row.nav{grid-template-columns:28px minmax(110px,1fr) minmax(150px,1.2fr) auto}.m7hfa-row input,.m7hfa-row select{width:100%;min-width:0;height:38px;border:1px solid #ffffff14;border-radius:9px;background:#0f1112;color:#fff;padding:7px}.m7hfa-row input[type=checkbox]{width:18px;height:18px;accent-color:#d9a441}.m7hfa-row button{width:34px;height:34px;border:1px solid #c6575755;border-radius:9px;background:#2a1010;color:#ff8e8e;cursor:pointer}.m7hfa-preview-wrap{position:sticky;top:78px;align-self:start}.m7hfa-preview-label{display:flex;align-items:center;justify-content:space-between;margin:0 0 7px;color:#cdbd9e;font-size:10px}.m7hfa-preview{position:relative;min-height:510px;border:1px solid #d9a44155;border-radius:17px;overflow:hidden;background:#070503;isolation:isolate}.m7hfa-pbg{position:absolute;inset:-4%;z-index:-4;background-color:var(--pbg,#080604);background-image:var(--pimg);background-size:var(--pzoom,115%);background-position:var(--ppos,center 54%);background-repeat:no-repeat;filter:brightness(.76) saturate(1.05)}.m7hfa-pover{position:absolute;inset:0;z-index:-3;background:linear-gradient(180deg,rgba(6,3,2,.42),rgba(4,2,1,var(--pover,.72)) 64%,rgba(3,2,1,.96)),radial-gradient(circle at 50% 10%,#d9a44118,transparent 38%)}.m7hfa-pline{position:absolute;top:0;left:7%;right:7%;height:2px;background:linear-gradient(90deg,transparent,var(--paccent),#ffe4a1,var(--paccent),transparent);box-shadow:0 0 9px var(--paccent)}.m7hfa-pcontent{display:flex;min-height:510px;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:42px 18px 24px}.m7hfa-plogo{width:min(var(--plogo,155px),56%);height:116px;object-fit:contain;filter:drop-shadow(0 8px 16px #000b) drop-shadow(0 0 11px #d9a44138)}.m7hfa-ptitle{margin-top:7px;color:var(--ptitle);font-size:var(--ptitlesize);font-weight:900;direction:rtl}.m7hfa-psub{margin-top:6px;color:var(--psub);font-size:var(--psubsize);direction:rtl}.m7hfa-pcedar{margin:12px 0;color:var(--paccent2);font-size:23px}.m7hfa-pnav{display:flex;justify-content:center;flex-wrap:wrap;gap:6px}.m7hfa-pnav span{padding:4px 2px;color:var(--pnav);font-size:10px;font-weight:800;text-shadow:0 2px 8px #000}.m7hfa-pnav i{color:var(--paccent2);font-style:normal;opacity:.85}.m7hfa-psocial{display:flex;justify-content:center;gap:8px;margin:15px 0}.m7hfa-psocial b{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid var(--psglow);border-radius:50%;color:var(--psocial);background:#080706;box-shadow:0 0 8px #d9a4412b;font-size:10px;text-transform:uppercase}.m7hfa-prule{width:72%;height:1px;background:linear-gradient(90deg,transparent,#d9a44177,transparent);margin-bottom:12px}.m7hfa-pcopy{color:var(--pcopy);font-size:var(--pcopysize)}.m7hfa-pbottom{margin-top:7px;color:var(--pbottom);font-size:var(--pbottomsize);font-weight:750}.m7hfa-status{position:sticky;bottom:0;z-index:21;min-height:38px;display:flex;align-items:center;justify-content:center;padding:8px 12px;border-top:1px solid #ffffff10;background:rgba(10,11,12,.96);color:#e9c36f;font-size:11px}.m7hfa-status[data-type=error]{color:#ff8f8f}.m7hfa-status[data-type=success]{color:#7be2a7}
@media(max-width:820px){.m7hfa-main{grid-template-columns:1fr}.m7hfa-preview-wrap{position:relative;top:auto;order:-1}.m7hfa-preview{min-height:390px}.m7hfa-pcontent{min-height:390px;padding-top:32px}.m7hfa-grid{grid-template-columns:1fr}.m7hfa-field.full{grid-column:auto}.m7hfa-row,.m7hfa-row.nav{grid-template-columns:28px minmax(0,1fr) 34px}.m7hfa-row select,.m7hfa-row.nav input:nth-of-type(2){grid-column:2}.m7hfa-row input[type=text],.m7hfa-row input[type=url]{grid-column:2}.m7hfa-modal{border-radius:15px}.m7hfa-head{align-items:flex-start}.m7hfa-head-actions{flex-direction:column}.m7hfa-btn{min-height:36px}}
`;(document.head||document.documentElement).appendChild(s)
  }

  function field(label,id,type="text",extra="",full=false){return `<label class="m7hfa-field ${full?"full":""}"><span>${label}</span><input id="${id}" type="${type}" ${extra}></label>`}
  function selectField(label,id,options,full=false){return `<label class="m7hfa-field ${full?"full":""}"><span>${label}</span><select id="${id}">${options.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select></label>`}
  function check(label,id){return `<label class="m7hfa-check"><input id="${id}" type="checkbox"><span>${label}</span></label>`}

  function build(){
    overlay=document.createElement("div");overlay.id="m7hfa-overlay";overlay.hidden=true;
    overlay.innerHTML=`<div class="m7hfa-modal">
      <div class="m7hfa-head"><div><h2>🌙 Homepage Footer</h2><small>Full control · phone-ready animations · live preview</small></div><div class="m7hfa-head-actions"><button class="m7hfa-btn primary" type="button" data-m7hfa-save>Save Changes</button><button class="m7hfa-btn icon" type="button" data-m7hfa-close aria-label="Close">×</button></div></div>
      <div class="m7hfa-tabs" role="tablist">
        <button class="m7hfa-tab active" data-tab="content">Content</button><button class="m7hfa-tab" data-tab="design">Design</button><button class="m7hfa-tab" data-tab="background">Background</button><button class="m7hfa-tab" data-tab="navigation">Navigation</button><button class="m7hfa-tab" data-tab="socials">Social Icons</button><button class="m7hfa-tab" data-tab="animations">Animations</button><button class="m7hfa-tab" data-tab="advanced">Advanced</button>
      </div>
      <div class="m7hfa-main">
        <div class="m7hfa-form">
          <div class="m7hfa-pane active" data-pane="content">
            <div class="m7hfa-card"><h3>Footer Content</h3><div class="m7hfa-grid">${check("Enable footer","m7hfa-enabled")}${check("Show Lebanese flag","m7hfa-show-flag")}${field("Main title","m7hfa-title","text","",true)}${field("Subtitle","m7hfa-subtitle","text","",true)}${field("Copyright text","m7hfa-copyright","text","",true)}${field("Bottom text","m7hfa-bottom-text","text","",true)}${check("Show cedar ornament","m7hfa-cedar")}${check("Show side note","m7hfa-side-note-enabled")}${field("Side note text","m7hfa-side-note","text","",true)}</div></div>
          </div>
          <div class="m7hfa-pane" data-pane="design">
            <div class="m7hfa-card"><h3>Colors & Typography</h3><div class="m7hfa-grid">${field("Primary gold","m7hfa-accent","color")}${field("Second gold","m7hfa-accent2","color")}${field("Title color","m7hfa-title-color","color")}${field("Title size","m7hfa-title-size","range",'min="18" max="54" step="1"')}${field("Subtitle color","m7hfa-subtitle-color","color")}${field("Subtitle size","m7hfa-subtitle-size","range",'min="11" max="30" step="1"')}${field("Navigation color","m7hfa-nav-color","color")}${field("Social icon color","m7hfa-social-color","color")}${field("Social glow color","m7hfa-social-glow","color")}${field("Social icon size","m7hfa-social-size","range",'min="34" max="72" step="1"')}${field("Copyright color","m7hfa-copy-color","color")}${field("Copyright size","m7hfa-copy-size","range",'min="10" max="22" step="1"')}${field("Bottom text color","m7hfa-bottom-color","color")}${field("Bottom text size","m7hfa-bottom-size","range",'min="10" max="24" step="1"')}${field("Side note color","m7hfa-side-color","color")}${field("Top line color","m7hfa-line-color","color")}</div></div>
            <div class="m7hfa-card"><h3>Logo</h3><div class="m7hfa-grid">${field("Logo URL","m7hfa-logo-url","url","",true)}${field("Logo size","m7hfa-logo-size","range",'min="90" max="310" step="2"')}<label class="m7hfa-field"><span>Upload logo</span><input id="m7hfa-logo-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label></div><button class="m7hfa-btn" type="button" data-upload="logo">Upload Logo</button></div>
          </div>
          <div class="m7hfa-pane" data-pane="background">
            <div class="m7hfa-card"><h3>Lebanon Background</h3><div class="m7hfa-grid">${field("Background image URL","m7hfa-bg-url","url","",true)}${field("Background base color","m7hfa-bg-color","color")}${field("Dark overlay","m7hfa-bg-overlay","range",'min="0" max="95" step="1"')}${field("Image zoom","m7hfa-bg-zoom","range",'min="90" max="180" step="1"')}${field("Background position","m7hfa-bg-pos","text",'placeholder="center 54%"',true)}<label class="m7hfa-field"><span>Upload background</span><input id="m7hfa-bg-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label></div><button class="m7hfa-btn" type="button" data-upload="background">Upload Background</button></div>
          </div>
          <div class="m7hfa-pane" data-pane="navigation"><div class="m7hfa-card"><h3>Navigation Links</h3><div class="m7hfa-list" data-nav-list></div><button class="m7hfa-btn" type="button" data-add-nav>＋ Add Navigation Link</button></div></div>
          <div class="m7hfa-pane" data-pane="socials"><div class="m7hfa-card"><h3>Social Icons</h3><p style="margin:0 0 10px;color:#ffffff6b;font-size:10px">Add/remove icons. For WhatsApp you can paste a full link or just the phone number.</p><div class="m7hfa-list" data-social-list></div><button class="m7hfa-btn" type="button" data-add-social>＋ Add Social Icon</button></div></div>
          <div class="m7hfa-pane" data-pane="animations">
            <div class="m7hfa-card"><h3>Animate Anything</h3><div class="m7hfa-grid">${selectField("Overall motion","m7hfa-overall",["off","subtle","full"])}${field("Animation speed %","m7hfa-speed","range",'min="40" max="220" step="5"')}${field("Animation intensity %","m7hfa-intensity","range",'min="0" max="100" step="5"')}${selectField("Logo animation","m7hfa-logo-anim",ANIMS)}${selectField("Title animation","m7hfa-title-anim",ANIMS)}${selectField("Subtitle animation","m7hfa-subtitle-anim",ANIMS)}${selectField("Navigation animation","m7hfa-nav-anim",ANIMS)}${selectField("Social animation","m7hfa-social-anim",ANIMS)}${selectField("Copyright animation","m7hfa-copy-anim",ANIMS)}${selectField("Bottom text animation","m7hfa-bottom-anim",ANIMS)}${check("Animated top separator","m7hfa-line-enabled")}${selectField("Top line animation","m7hfa-line-anim",["none","travel"])}</div><p style="margin:11px 0 0;color:#72d89b;font-size:10px">Mobile-safe: animations use transform / opacity / filter and include WebKit animation paths.</p></div>
          </div>
          <div class="m7hfa-pane" data-pane="advanced"><div class="m7hfa-card"><h3>Layout</h3><div class="m7hfa-grid">${field("Footer minimum height","m7hfa-height","range",'min="430" max="900" step="10"')}${field("Top corner radius","m7hfa-radius","range",'min="0" max="70" step="1"')}${field("Content max width","m7hfa-content-width","range",'min="320" max="1000" step="10"')}</div></div><div class="m7hfa-card"><h3>Reset</h3><button class="m7hfa-btn danger" type="button" data-reset>Reset editor to ShoufHon defaults</button></div></div>
        </div>
        <aside class="m7hfa-preview-wrap"><div class="m7hfa-preview-label"><b>👁 Live Preview</b><span>Phone layout</span></div><div class="m7hfa-preview" data-preview></div></aside>
      </div>
      <div class="m7hfa-status" data-m7hfa-status></div>
    </div>`;
    document.body.appendChild(overlay);
    bind();
  }

  function fill(){
    const s=settings;
    const map={"m7hfa-enabled":s.enabled,"m7hfa-show-flag":s.show_flag,"m7hfa-title":s.title,"m7hfa-subtitle":s.subtitle,"m7hfa-copyright":s.copyright_text,"m7hfa-bottom-text":s.bottom_text,"m7hfa-cedar":s.cedar_enabled,"m7hfa-side-note-enabled":s.side_note_enabled,"m7hfa-side-note":s.side_note_text,"m7hfa-accent":s.accent_color,"m7hfa-accent2":s.accent_color_2,"m7hfa-title-color":s.title_color,"m7hfa-title-size":s.title_size,"m7hfa-subtitle-color":s.subtitle_color,"m7hfa-subtitle-size":s.subtitle_size,"m7hfa-nav-color":s.nav_color,"m7hfa-social-color":s.social_icon_color,"m7hfa-social-glow":s.social_glow_color,"m7hfa-social-size":s.social_size,"m7hfa-copy-color":s.copyright_color,"m7hfa-copy-size":s.copyright_size,"m7hfa-bottom-color":s.bottom_color,"m7hfa-bottom-size":s.bottom_size,"m7hfa-side-color":s.side_note_color,"m7hfa-line-color":s.top_line_color,"m7hfa-logo-url":s.logo_url,"m7hfa-logo-size":s.logo_size,"m7hfa-bg-url":s.background_url,"m7hfa-bg-color":s.background_color,"m7hfa-bg-overlay":s.background_overlay,"m7hfa-bg-zoom":s.background_zoom,"m7hfa-bg-pos":s.background_position,"m7hfa-overall":s.overall_animation,"m7hfa-speed":s.animation_speed,"m7hfa-intensity":s.animation_intensity,"m7hfa-logo-anim":s.logo_animation,"m7hfa-title-anim":s.title_animation,"m7hfa-subtitle-anim":s.subtitle_animation,"m7hfa-nav-anim":s.nav_animation,"m7hfa-social-anim":s.social_animation,"m7hfa-copy-anim":s.copyright_animation,"m7hfa-bottom-anim":s.bottom_animation,"m7hfa-line-enabled":s.top_line_enabled,"m7hfa-line-anim":s.top_line_animation,"m7hfa-height":s.footer_min_height,"m7hfa-radius":s.top_radius,"m7hfa-content-width":s.content_max_width};
    Object.entries(map).forEach(([id,v])=>{const e=$("#"+id,overlay);if(!e)return;if(e.type==="checkbox")e.checked=v!==false;else e.value=v??""});renderLists();renderPreview();dirty=false;const b=$("[data-m7hfa-save]",overlay);if(b)b.textContent="Save Changes";
  }

  function renderLists(){
    const nav=$("[data-nav-list]",overlay);nav.innerHTML=(settings.navigation||[]).map((x,i)=>`<div class="m7hfa-row nav" data-nav-row="${i}"><input type="checkbox" data-k="enabled" ${x.enabled!==false?"checked":""} aria-label="Enable"><input type="text" data-k="label" value="${esc(x.label||"")}" placeholder="Label"><input type="text" data-k="url" value="${esc(x.url||"")}" placeholder="/page"><button type="button" data-del-nav="${i}" aria-label="Delete">×</button></div>`).join("");
    const social=$("[data-social-list]",overlay);social.innerHTML=(settings.socials||[]).map((x,i)=>`<div class="m7hfa-row" data-social-row="${i}"><input type="checkbox" data-k="enabled" ${x.enabled===true?"checked":""} aria-label="Enable"><select data-k="type">${SOCIAL_TYPES.map(t=>`<option value="${t}" ${t===x.type?"selected":""}>${t}</option>`).join("")}</select><input type="text" data-k="label" value="${esc(x.label||"")}" placeholder="Label"><input type="text" data-k="url" value="${esc(x.url||"")}" placeholder="Link or WhatsApp number"><button type="button" data-del-social="${i}" aria-label="Delete">×</button></div>`).join("");
  }

  function collect(){
    const s={...settings};
    Object.assign(s,{enabled:checked("m7hfa-enabled"),show_flag:checked("m7hfa-show-flag"),title:val("m7hfa-title"),subtitle:val("m7hfa-subtitle"),copyright_text:val("m7hfa-copyright"),bottom_text:val("m7hfa-bottom-text")||"Made with Love",cedar_enabled:checked("m7hfa-cedar"),side_note_enabled:checked("m7hfa-side-note-enabled"),side_note_text:val("m7hfa-side-note"),accent_color:val("m7hfa-accent"),accent_color_2:val("m7hfa-accent2"),title_color:val("m7hfa-title-color"),title_size:num("m7hfa-title-size",31),subtitle_color:val("m7hfa-subtitle-color"),subtitle_size:num("m7hfa-subtitle-size",17),nav_color:val("m7hfa-nav-color"),social_icon_color:val("m7hfa-social-color"),social_glow_color:val("m7hfa-social-glow"),social_size:num("m7hfa-social-size",46),copyright_color:val("m7hfa-copy-color"),copyright_size:num("m7hfa-copy-size",13),bottom_color:val("m7hfa-bottom-color"),bottom_size:num("m7hfa-bottom-size",14),side_note_color:val("m7hfa-side-color"),top_line_color:val("m7hfa-line-color"),logo_url:val("m7hfa-logo-url"),logo_size:num("m7hfa-logo-size",190),background_url:val("m7hfa-bg-url"),background_color:val("m7hfa-bg-color"),background_overlay:num("m7hfa-bg-overlay",72),background_zoom:num("m7hfa-bg-zoom",115),background_position:val("m7hfa-bg-pos")||"center 54%",overall_animation:val("m7hfa-overall"),animation_speed:num("m7hfa-speed",100),animation_intensity:num("m7hfa-intensity",65),logo_animation:val("m7hfa-logo-anim"),title_animation:val("m7hfa-title-anim"),subtitle_animation:val("m7hfa-subtitle-anim"),nav_animation:val("m7hfa-nav-anim"),social_animation:val("m7hfa-social-anim"),copyright_animation:val("m7hfa-copy-anim"),bottom_animation:val("m7hfa-bottom-anim"),top_line_enabled:checked("m7hfa-line-enabled"),top_line_animation:val("m7hfa-line-anim"),footer_min_height:num("m7hfa-height",590),top_radius:num("m7hfa-radius",34),content_max_width:num("m7hfa-content-width",760)});
    s.navigation=$$("[data-nav-row]",overlay).map(row=>({enabled:$("[data-k=enabled]",row).checked,label:$("[data-k=label]",row).value.trim(),url:$("[data-k=url]",row).value.trim()}));
    s.socials=$$("[data-social-row]",overlay).map(row=>({enabled:$("[data-k=enabled]",row).checked,type:$("[data-k=type]",row).value,label:$("[data-k=label]",row).value.trim(),url:$("[data-k=url]",row).value.trim()}));
    settings=merged(s);return settings;
  }

  function renderPreview(){
    collect();const s=settings,p=$("[data-preview]",overlay);if(!p)return;
    const nav=(s.navigation||[]).filter(x=>x.enabled!==false&&x.label).map(x=>`<span>${esc(x.label)}</span>`).join('<i>•</i>');
    const social=(s.socials||[]).filter(x=>x.enabled===true&&x.url).map(x=>`<b>${esc((x.type||"web").slice(0,2))}</b>`).join("");
    const pbg=s.background_url==="builtin"?(window.__SHOUFHON_FOOTER_BUILTIN_BG__||""):String(s.background_url||"").replace(/["'\\()]/g,"");
    p.style.cssText=`--pbg:${color(s.background_color,"#080604")};--pimg:${pbg?`url("${pbg}")`:"none"};--pover:${clamp(s.background_overlay,0,95,72)/100};--pzoom:${clamp(s.background_zoom,90,180,115)}%;--ppos:${String(s.background_position||"center 54%").replace(/[;{}]/g,"")};--paccent:${color(s.accent_color,"#d9a441")};--paccent2:${color(s.accent_color_2,"#f2cc7b")};--ptitle:${color(s.title_color,"#e7bd6b")};--ptitlesize:${Math.min(clamp(s.title_size,18,54,31),31)}px;--psub:${color(s.subtitle_color,"#e8d5b5")};--psubsize:${Math.min(clamp(s.subtitle_size,11,30,17),16)}px;--pnav:${color(s.nav_color,"#f4d694")};--psocial:${color(s.social_icon_color,"#f1c86e")};--psglow:${color(s.social_glow_color,"#d9a441")};--pcopy:${color(s.copyright_color,"#f0e4d0")};--pcopysize:${Math.min(clamp(s.copyright_size,10,22,13),14)}px;--pbottom:${color(s.bottom_color,"#f4d694")};--pbottomsize:${Math.min(clamp(s.bottom_size,10,24,14),15)}px;--plogo:${Math.min(clamp(s.logo_size,90,310,190),180)}px`;
    p.innerHTML=`<div class="m7hfa-pbg"></div><div class="m7hfa-pover"></div>${s.top_line_enabled!==false?'<div class="m7hfa-pline"></div>':''}<div class="m7hfa-pcontent">${s.logo_url?`<img class="m7hfa-plogo" src="${esc(s.logo_url)}" alt="">`:""}<div class="m7hfa-ptitle">${esc(s.title||"")}</div><div class="m7hfa-psub">${esc(s.subtitle||"")}</div>${s.cedar_enabled!==false?'<div class="m7hfa-pcedar">♠</div>':''}${nav?`<div class="m7hfa-pnav">${nav}</div>`:""}${social?`<div class="m7hfa-psocial">${social}</div>`:""}<div class="m7hfa-prule"></div><div class="m7hfa-pcopy">${esc(s.copyright_text||"")}</div><div class="m7hfa-pbottom">${esc(s.bottom_text||"Made with Love")} ♥ ${s.show_flag!==false?"🇱🇧":""}</div></div>`;
  }

  async function upload(which){
    const input=$(which==="logo"?"#m7hfa-logo-file":"#m7hfa-bg-file",overlay);const file=input?.files?.[0];if(!file)return setStatus("Choose an image first.","error");
    if(!/^image\/(jpeg|png|webp|gif)$/i.test(file.type||""))return setStatus("Use JPG, PNG, WEBP or GIF.","error");
    if(file.size>15*1024*1024)return setStatus("Image must be under 15 MB.","error");
    try{
      setStatus("Uploading…");const c=await readyClient();const admin=await c.rpc("is_site_admin");if(admin.error||admin.data!==true)throw new Error("Admin session is not valid.");
      const ext=((file.name||"").split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
      const storagePath=`site-footer/${which}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const up=await c.storage.from(BUCKET).upload(storagePath,file,{cacheControl:"31536000",upsert:false,contentType:file.type||undefined});if(up.error)throw up.error;
      const pub=c.storage.from(BUCKET).getPublicUrl(storagePath);const url=pub?.data?.publicUrl||"";if(!url)throw new Error("Could not create public URL.");
      const target=$(which==="logo"?"#m7hfa-logo-url":"#m7hfa-bg-url",overlay);target.value=url;markDirty();renderPreview();setStatus("Image uploaded. Save Changes to publish.","success");
    }catch(e){setStatus(e?.message||"Upload failed.","error")}
  }

  async function readyClient(){
    for(let i=0;i<100&&!window.Ma7alakAdminClient;i++)await new Promise(r=>setTimeout(r,100));
    client=window.Ma7alakAdminClient||null;if(!client)throw new Error("Admin client is still loading.");return client;
  }

  async function load(){
    try{const c=await readyClient();const r=await c.from(TABLE).select("settings").eq("id",ROW_ID).maybeSingle();if(r.error)throw r.error;settings=merged(r.data?.settings||{});fill();setStatus("Footer settings loaded.","success")}catch(e){settings=merged({});fill();setStatus(e?.message||"Could not load footer settings.","error")}
  }

  async function save(){
    if(saving)return;saving=true;const b=$("[data-m7hfa-save]",overlay);if(b){b.disabled=true;b.textContent="Saving…"}
    try{const c=await readyClient();const admin=await c.rpc("is_site_admin");if(admin.error||admin.data!==true)throw new Error("Admin session is not valid.");const payload=collect();const r=await c.from(TABLE).upsert({id:ROW_ID,settings:payload,updated_at:new Date().toISOString()},{onConflict:"id"});if(r.error)throw r.error;dirty=false;if(b)b.textContent="Save Changes";setStatus("Saved. Homepage footer updates live.","success");window.dispatchEvent(new CustomEvent("ma7alak:homepage-footer-saved",{detail:{settings:clone(payload)}}))}catch(e){setStatus(e?.message||"Save failed.","error")}finally{saving=false;if(b)b.disabled=false}
  }

  function bind(){
    $("[data-m7hfa-close]",overlay).onclick=()=>{if(dirty&&!confirm("Close without saving footer changes?"))return;overlay.hidden=true;document.documentElement.style.overflow=""};
    $("[data-m7hfa-save]",overlay).onclick=save;
    $$(".m7hfa-tab",overlay).forEach(b=>b.onclick=()=>{$$(".m7hfa-tab",overlay).forEach(x=>x.classList.toggle("active",x===b));$$(".m7hfa-pane",overlay).forEach(x=>x.classList.toggle("active",x.dataset.pane===b.dataset.tab))});
    overlay.addEventListener("input",e=>{if(e.target.matches("input,textarea,select")){markDirty();renderPreview()}});
    overlay.addEventListener("change",e=>{if(e.target.matches("input,textarea,select")){markDirty();renderPreview()}});
    $("[data-add-nav]",overlay).onclick=()=>{collect();settings.navigation.push({label:"New link",url:"/",enabled:true});renderLists();markDirty();renderPreview()};
    $("[data-add-social]",overlay).onclick=()=>{collect();settings.socials.push({type:"instagram",label:"Instagram",url:"",enabled:true});renderLists();markDirty();renderPreview()};
    overlay.addEventListener("click",e=>{const dn=e.target.closest("[data-del-nav]");if(dn){collect();settings.navigation.splice(Number(dn.dataset.delNav),1);renderLists();markDirty();renderPreview();return}const ds=e.target.closest("[data-del-social]");if(ds){collect();settings.socials.splice(Number(ds.dataset.delSocial),1);renderLists();markDirty();renderPreview();return}const up=e.target.closest("[data-upload]");if(up)upload(up.dataset.upload);const reset=e.target.closest("[data-reset]");if(reset&&confirm("Reset the editor to the ShoufHon footer defaults?")){settings=merged({});fill();markDirty();setStatus("Defaults loaded in editor. Save to publish.")}});
  }

  function mountLauncher(){
    if(document.getElementById("m7hfa-launch"))return true;
    const dash=document.getElementById("ma-admin-dashboard");if(!dash)return false;
    launcher=document.createElement("button");launcher.id="m7hfa-launch";launcher.type="button";launcher.innerHTML='<span><strong>🌙 Homepage Footer</strong><small>Logo · Lebanon background · links · socials · colors · mobile animations</small></span><b>›</b>';
    launcher.onclick=async()=>{if(!overlay)build();overlay.hidden=false;document.documentElement.style.overflow="hidden";setStatus("Loading footer settings…");await load()};
    dash.prepend(launcher);return true;
  }

  function boot(){style();window.addEventListener("ma7alak:footer-builtin-bg-ready",()=>{if(overlay&&!overlay.hidden)renderPreview()});if(mountLauncher())return;let tries=0;const t=setInterval(()=>{tries++;if(mountLauncher()||tries>150)clearInterval(t)},100)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
