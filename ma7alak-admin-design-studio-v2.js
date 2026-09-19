/* =========================================================
   MA7ALAK ADMIN — PAGE DESIGN STUDIO V2 FIX

   ✓ Fine-grained Identity/About colors always work
   ✓ Universal Accent now links MODULE accents only
   ✓ Changing a module override automatically unlinks modules
   ✓ Clear linked/unlinked status
   ✓ Functional Reset Design button
   ✓ Reset keeps the shop's current Universal Accent
   ✓ Reset does not save until normal Save Changes is pressed
========================================================= */
(function(){
  "use strict";

  if(
    location.pathname.replace(/\/+$/,"" ) !== "/admin" ||
    window.__MA7ALAK_ADMIN_PAGE_DESIGN_STUDIO_V2_FIX__
  ){
    return;
  }

  window.__MA7ALAK_ADMIN_PAGE_DESIGN_STUDIO_V2_FIX__ = true;

  const MODULE_KEYS = new Set([
    "gallery_accent_color",
    "video_accent_color",
    "follow_accent_color",
    "live_accent_color",
    "hub_accent_color"
  ]);

  const RESET_VALUES = {
    page_design_preset:"premium",
    page_motion_mode:"preset",
    page_use_universal_accent:true,

    profile_ring_color:"$ACCENT",

    shop_label_text_color:"$ACCENT",
    shop_label_border_color:"$ACCENT",
    shop_label_bg_color:"#171217",
    shop_label_icon_color:"$ACCENT",
    shop_label_line_color:"$ACCENT",
    shop_label_line_style:"fade",
    shop_label_symbol:"diamond",
    shop_label_symbol_text:"",

    shop_name_color:"$ACCENT",
    shop_name_animation:"current",

    arabic_name_color:"$ACCENT",
    arabic_name_animation:"none",

    identity_divider_color:"$ACCENT",
    identity_divider_style:"fade",
    identity_divider_symbol:"diamond",
    identity_divider_symbol_text:"",

    about_title_color:"$ACCENT",
    about_title_animation:"current",
    about_kicker_color:"$ACCENT",
    about_text_color:"#ffffff",
    about_panel_bg_color:"#141014",
    about_panel_border_color:"$ACCENT",
    about_content_bg_color:"#161316",
    about_content_border_color:"#453b43",
    about_ornament_color:"$ACCENT",
    about_ornament_style:"fade",
    about_ornament_symbol:"diamond",
    about_ornament_symbol_text:"",
    about_service_text_color:"#ffffff",
    about_service_border_color:"$ACCENT",
    about_service_bg_color:"#151215",
    about_service_icon_color:"$ACCENT",
    about_signature_color:"$ACCENT",

    gallery_accent_color:"$ACCENT",
    video_accent_color:"$ACCENT",
    follow_accent_color:"$ACCENT",
    live_accent_color:"$ACCENT",
    hub_accent_color:"$ACCENT"
  };

  function safeHex(value,fallback){
    const raw = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(raw)
      ? raw
      : fallback;
  }

  function getPrefix(box){
    const preset = box.querySelector('[id$="page_design_preset"]');
    if(!preset){
      return "";
    }
    return preset.id.slice(
      0,
      -"page_design_preset".length
    );
  }

  function getUniversalAccent(prefix){
    return safeHex(
      document.getElementById(prefix+"story_color")?.value,
      safeHex(
        document.getElementById(prefix+"card_color")?.value,
        "#f2caed"
      )
    );
  }

  function dispatchValue(el,value){
    if(!el){
      return;
    }

    if(el.type === "checkbox"){
      el.checked = !!value;
    }
    else{
      el.value = value;
    }

    el.dispatchEvent(
      new Event("input",{bubbles:true})
    );

    el.dispatchEvent(
      new Event("change",{bubbles:true})
    );
  }

  function syncColorCode(box,input){
    if(
      !input ||
      input.type !== "color"
    ){
      return;
    }

    const code =
      box.querySelector(
        '[data-color-for="'+input.id+'"]'
      );

    if(code){
      code.textContent =
        String(input.value || "").toUpperCase();
    }
  }

  function updateLinkState(box){
    const prefix = getPrefix(box);
    if(!prefix){
      return;
    }

    const toggle =
      document.getElementById(
        prefix+
        "page_use_universal_accent"
      );

    const note =
      box.querySelector(
        ".m7ds-v2-link-note"
     );

    if(!toggle || !note){
      return;
    }

    box.classList.toggle(
      "m7ds-modules-linked",
      !!toggle.checked
    );

    if(toggle.checked){
      note.innerHTML =
        '<b>Module colors are linked.</b> Gallery, Videos, Follow, Live, Status and the Profile Hub use the Universal Shop Accent. <span>Identity and About controls below still work independently.</span>';
    }
    else{
      note.innerHTML =
        '<b>Module colors are independent.</b> Gallery, Videos, Follow, Live and the Profile Hub use their own colors below.';
    }
  }

  function resetStudio(box){
    const prefix = getPrefix(box);
    if(!prefix){
      return;
    }

    if(
      !window.confirm(
        "Reset Page Design Studio for this shop?\n\nThis restores clean design defaults but does NOT save until you press Save Changes."
      )
    ){
      return;
    }

    const accent =
      getUniversalAccent(prefix);

    box.dataset.m7dsResetting = "1";

    Object.entries(RESET_VALUES)
      .forEach(([key,raw])=>{
        const el =
          document.getElementById(
            prefix + key
          );

        if(!el){
          return;
        }

        const value =
          raw === "$ACCENT"
            ? accent
            : raw;

        dispatchValue(el,value);
        syncColorCode(box,el);
      });

    delete box.dataset.m7dsResetting;

    const firstTab =
      box.querySelector(
        '[data-m7ds-tab="identity"]'
      );

    if(firstTab){
      firstTab.click();
    }

    updateLinkState(box);

    const flash =
      box.querySelector(
        ".m7ds-v2-reset-status"
      );

    if(flash){
      flash.textContent =
        "Design reset locally — press Save Changes to apply it to the website.";

      window.setTimeout(()=>{
        flash.textContent = "";
      },5000);
    }
  }

  function decorate(box){
    if(
      !box ||
      box.dataset.m7dsV2 === "1"
    ){
      return;
    }

    const prefix = getPrefix(box);
    if(!prefix){
      return;
    }

    box.dataset.m7dsV2 = "1";

    const check =
      document.getElementById(
        prefix+
        "page_use_universal_accent"
      );

    if(check){
      const title =
        check
          .closest("label")
          ?.querySelector("b");

      if(title){
        title.textContent =
          "Link module accents to Universal Shop Accent";
      }

      const small =
        check
          .closest("label")
          ?.querySelector("small");

      if(small){
        small.textContent =
          "Gallery, Videos, Follow, Live, Status and Profile Hub only. Identity/About controls remain editable.";
      }
    }

    const intro =
      box.querySelector(
        ".m7ds-intro"
      );

    if(intro){
      const actions =
        document.createElement("div");

      actions.className =
        "m7ds-v2-actions";

      actions.innerHTML = `
        <button
          type="button"
          class="m7ds-v2-reset"
        >↺ Reset Design</button>
      `;

      actions
        .querySelector("button")
        .addEventListener(
          "click",
          ()=>resetStudio(box)
        );

      intro.appendChild(actions);
    }

    if(check){
      const note =
        document.createElement("div");

      note.className =
        "m7ds-v2-link-note";

      const topGrid =
        box.querySelector(
          ".m7ds-top-grid"
        );

      if(topGrid){
        topGrid.after(note);
      }
      else{
        box.prepend(note);
      }

      check.addEventListener(
        "change",
        ()=>updateLinkState(box)
      );
    }

    const resetStatus =
      document.createElement("div");

    resetStatus.className =
      "m7ds-v2-reset-status";

    box.appendChild(resetStatus);

    box.addEventListener(
      "input",
      event=>{
        const input = event.target;

        if(
          !input ||
          !input.id ||
          !input.id.startsWith(prefix)
        ){
          return;
        }

        syncColorCode(
          box,
          input
        );

        const key =
          input.id.slice(
            prefix.length
          );

        /*
          Module override pickers should immediately work.
          If modules are linked, touching one automatically unlinks them.
        */
        if(
          input.type === "color" &&
          MODULE_KEYS.has(key) &&
          check &&
          check.checked &&
          box.dataset.m7dsResetting !== "1"
        ){
          check.checked = false;
          check.dispatchEvent(
            new Event(
              "change",
              {bubbles:true}
            )
          );
        }
      }
    );

    updateLinkState(box);
  }

  function ensureCss(){
    if(
      document.getElementById(
        "m7ds-v2-fix-css"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "m7ds-v2-fix-css";

    style.textContent = `
      .m7ds-v2-actions{
        margin-left:auto;
        display:flex;
        gap:6px;
      }

      .m7ds-v2-reset{
        min-height:30px;
        padding:0 10px;
        border-radius:9px;
        border:1px solid rgba(255,134,134,.24);
        background:rgba(255,80,80,.055);
        color:#ffc0c0;
        cursor:pointer;
        font-size:8px;
        font-weight:900;
        white-space:nowrap;
      }

      .m7ds-v2-reset:hover{
        background:rgba(255,80,80,.10);
        border-color:rgba(255,134,134,.42);
      }

      .m7ds-v2-link-note{
        margin:4px 0 10px;
        padding:9px 10px;
        border-radius:10px;
        border:1px solid rgba(216,170,88,.13);
        background:rgba(216,170,88,.035);
        color:#9f927d;
        font-size:8px;
        line-height:1.55;
      }

      .m7ds-v2-link-note b{
        color:#e4c78f;
      }

      .m7ds-v2-link-note span{
        color:#b7a990;
      }

      .m7ds-v2-reset-status{
        min-height:14px;
        margin-top:8px;
        color:#7ee1a6;
        font-size:8px;
        font-weight:750;
      }

      .m7ds-modules-linked [data-m7ds-pane="modules"] .m7ds-color-row{
        opacity:.62;
      }

      .m7ds-modules-linked [data-m7ds-pane="modules"] .m7ds-color-row::after {
        content:"Linked — change color to unlock";
        margin-left:3px;
        color:#8b7f6b;
        font-size:7px;
        white-space:nowrap;
      }

      @media(max-width:700px){
        .m7ds-intro{
          flex-wrap:wrap;
        }

        .m7ds-v2-actions{
          width:100%;
          margin-left:0;
        }

        .m7ds-v2-reset{
          width:100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function scan(){
    ensureCss();

    document
      .querySelectorAll(
        ".m7-design-studio"
      )
      .forEach(decorate);
  }

  async function start(){
    for(let i=0;i<200;i++){
      scan();

      if(
        document.querySelector(
          ".m7-design-studio"
        )
      ){
        break;
      }

      await new Promise(resolve=>
        setTimeout(resolve,50)
      );
    }

    scan();

    let queued = false;

    new MutationObserver(()=>{
      if(queued){
        return;
      }

      queued = true;

      requestAnimationFrame(()=>{
        queued = false;
        scan();
      });
    })
      .observe(
        document.documentElement,
        {
          childList:true,
          subtree:true
        }
      );
  }

  start().catch(error=>
    console.error(
      "MA7ALAK Design Studio V2:",
      error
    )
  );

})();
