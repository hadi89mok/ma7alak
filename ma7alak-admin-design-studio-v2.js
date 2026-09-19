/* =========================================================
   MA7ALAK ADMIN — PAGE DESIGN STUDIO V2

   Single source of truth for Design Studio interaction:
   ✓ Identity/About colors stay independently editable
   ✓ Universal Accent links MODULE accents only
   ✓ Editing a module accent automatically unlinks modules
   ✓ Revert Unsaved restores the values loaded for the shop
   ✓ Reset Design restores clean defaults locally
   ✓ Reset keeps the shop's current Universal Accent
   ✓ Nothing is saved until the normal Save Changes button
========================================================= */
(function(){
  "use strict";

  if(
    location.pathname.replace(/\/+$/,"") !== "/admin" ||
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
    "hours_accent_color",
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
    hours_accent_color:"$ACCENT",
    hub_accent_color:"$ACCENT"
  };

  const snapshots = {
    "m7da-":null,
    "m7de-":null
  };

  let apiPatched = false;
  let applying = false;

  function safeHex(value,fallback){
    const raw = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(raw)
      ? raw
      : fallback;
  }

  function getPrefix(box){
    if(!box){
      return "";
    }

    const preset =
      box.querySelector(
        '[id$="page_design_preset"]'
      );

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
      document.getElementById(
        prefix + "story_color"
      )?.value,
      safeHex(
        document.getElementById(
          prefix + "card_color"
        )?.value,
        "#f2caed"
      )
    );
  }

  function trackedElements(box){
    const prefix = getPrefix(box);
    if(!prefix){
      return [];
    }

    const map = new Map();

    box
      .querySelectorAll(
        "input[id],select[id],textarea[id]"
      )
      .forEach(el=>{
        if(el.id.startsWith(prefix)){
          map.set(el.id,el);
        }
      });

    /*
      Status accent lives in the older Show Shops details fieldset,
      but Universal Accent also controls that module. Track it so
      Reset/Revert remain consistent.
    */
    const hours =
      document.getElementById(
        prefix + "hours_accent_color"
      );

    if(hours){
      map.set(hours.id,hours);
    }

    return [...map.values()];
  }

  function capture(box){
    const state = {};

    trackedElements(box)
      .forEach(el=>{
        state[el.id] =
          el.type === "checkbox"
            ? !!el.checked
            : String(el.value ?? "");
      });

    return state;
  }

  function dispatchValue(el,value){
    if(!el){
      return;
    }

    if(el.type === "checkbox"){
      el.checked = !!value;
    }
    else{
      el.value =
        value === undefined ||
        value === null
          ? ""
          : String(value);
    }

    el.dispatchEvent(
      new Event(
        "input",
        {bubbles:true}
      )
    );

    el.dispatchEvent(
      new Event(
        "change",
        {bubbles:true}
      )
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
        '[data-color-for="' +
        input.id +
        '"]'
      );

    if(code){
      code.textContent =
        String(
          input.value || ""
        ).toUpperCase();
    }
  }

  function universalToggle(box){
    const prefix = getPrefix(box);

    return prefix
      ? document.getElementById(
          prefix +
          "page_use_universal_accent"
        )
      : null;
  }

  function updateLinkState(box){
    const toggle =
      universalToggle(box);

    const note =
      box.querySelector(
        ".m7ds-v2-link-note"
      );

    const badge =
      box.querySelector(
        ".m7ds-v2-state"
      );

    if(!toggle){
      return;
    }

    const linked =
      !!toggle.checked;

    box.classList.toggle(
      "m7ds-modules-linked",
      linked
    );

    if(note){
      note.innerHTML =
        linked
          ? '<b>Module colors are linked.</b> Gallery, Videos, Follow, Live, Status and the Profile Hub use the Universal Shop Accent. <span>Identity and About controls still work independently.</span>'
          : '<b>Module colors are independent.</b> Each module uses its own saved accent color.';
    }

    if(badge){
      badge.textContent =
        linked
          ? "MODULE ACCENTS LINKED"
          : "MODULE ACCENTS INDEPENDENT";

      badge.classList.toggle(
        "independent",
        !linked
      );
    }
  }

  function applyState(box,state){
    if(!state){
      return;
    }

    applying = true;
    box.dataset.m7dsResetting = "1";

    try{
      Object.entries(state)
        .forEach(([id,value])=>{
          const el =
            document.getElementById(id);

          if(!el){
            return;
          }

          dispatchValue(el,value);

          if(box.contains(el)){
            syncColorCode(box,el);
          }
        });
    }
    finally{
      applying = false;
      delete box.dataset.m7dsResetting;
    }

    box.__m7dsRefresh?.();
    updateLinkState(box);
  }

  function buildResetState(box){
    const prefix = getPrefix(box);
    if(!prefix){
      return null;
    }

    const accent =
      getUniversalAccent(prefix);

    const state = {};

    Object.entries(RESET_VALUES)
      .forEach(([key,raw])=>{
        const id =
          prefix + key;

        const el =
          document.getElementById(id);

        if(!el){
          return;
        }

        state[id] =
          raw === "$ACCENT"
            ? accent
            : raw;
      });

    return state;
  }

  function flash(box,message){
    const status =
      box.querySelector(
        ".m7ds-v2-reset-status"
      );

    if(!status){
      return;
    }

    status.textContent =
      message;

    window.clearTimeout(
      box.__m7dsStatusTimer
    );

    box.__m7dsStatusTimer =
      window.setTimeout(
        ()=>{
          status.textContent = "";
        },
        5000
      );
  }

  function resetStudio(box){
    if(
      !window.confirm(
        "Reset Page Design Studio for this shop?\n\nThis restores clean design defaults but does NOT save until you press Save Changes."
      )
    ){
      return;
    }

    applyState(
      box,
      buildResetState(box)
    );

    const identityTab =
      box.querySelector(
        '[data-m7ds-tab="identity"]'
      );

    identityTab?.click();

    flash(
      box,
      "Design reset locally — press Save Changes to apply it to the website."
    );
  }

  function revertStudio(box){
    const prefix =
      getPrefix(box);

    if(
      !prefix ||
      !snapshots[prefix]
    ){
      flash(
        box,
        "Nothing to revert yet."
      );
      return;
    }

    applyState(
      box,
      snapshots[prefix]
    );

    flash(
      box,
      "Unsaved Design Studio changes reverted."
    );
  }

  function decorate(box){
    if(
      !box ||
      box.dataset.m7dsV2 === "1"
    ){
      return;
    }

    const prefix =
      getPrefix(box);

    if(!prefix){
      return;
    }

    box.dataset.m7dsV2 = "1";

    const check =
      universalToggle(box);

    if(check){
      const label =
        check.closest("label");

      const title =
        label?.querySelector("b");

      if(title){
        title.textContent =
          "Link module accents to Universal Shop Accent";
      }

      const small =
        label?.querySelector("small");

      if(small){
        small.textContent =
          "Gallery, Videos, Follow, Live, Status and Profile Hub only. Identity/About controls remain editable.";
      }
    }

    const intro =
      box.querySelector(
        ".m7ds-intro"
      );

    const actions =
      document.createElement("div");

    actions.className =
      "m7ds-v2-actions";

    actions.innerHTML = `
      <button
        type="button"
        class="m7ds-v2-button"
        data-m7ds-revert
      >↶ Revert Unsaved</button>

      <button
        type="button"
        class="m7ds-v2-button danger"
        data-m7ds-reset
      >↺ Reset Design</button>

      <span
        class="m7ds-v2-state"
        data-m7ds-state
      ></span>
    `;

    if(intro){
      intro.after(actions);
    }
    else{
      box.prepend(actions);
    }

    actions
      .querySelector(
        "[data-m7ds-revert]"
      )
      ?.addEventListener(
        "click",
        ()=>revertStudio(box)
      );

    actions
      .querySelector(
        "[data-m7ds-reset]"
      )
      ?.addEventListener(
        "click",
        ()=>resetStudio(box)
      );

    if(check){
      const note =
        document.createElement(
          "div"
        );

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
        actions.after(note);
      }

      check.addEventListener(
        "change",
        ()=>updateLinkState(box)
      );
    }

    const resetStatus =
      document.createElement(
        "div"
      );

    resetStatus.className =
      "m7ds-v2-reset-status";

    box.appendChild(
      resetStatus
    );

    box.addEventListener(
      "input",
      event=>{
        const input =
          event.target;

        if(
          input &&
          input.id &&
          input.id.startsWith(prefix)
        ){
          syncColorCode(
            box,
            input
          );
        }
      }
    );

    if(!snapshots[prefix]){
      snapshots[prefix] =
        capture(box);
    }

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
      document.createElement(
        "style"
      );

    style.id =
      "m7ds-v2-fix-css";

    style.textContent = `
      .m7ds-v2-actions{
        display:flex;
        align-items:center;
        gap:7px;
        flex-wrap:wrap;
        margin:0 0 10px;
      }

      .m7ds-v2-button{
        min-height:32px;
        padding:0 10px;
        border-radius:9px;
        border:1px solid rgba(216,170,88,.18);
        background:rgba(255,255,255,.025);
        color:#e4d2b3;
        cursor:pointer;
        font-size:8px;
        font-weight:900;
      }

      .m7ds-v2-button:hover{
        border-color:rgba(216,170,88,.38);
        background:rgba(216,170,88,.075);
      }

      .m7ds-v2-button.danger{
        color:#ffc1bd;
        border-color:rgba(255,96,86,.24);
        background:rgba(255,80,80,.045);
      }

      .m7ds-v2-state{
        margin-left:auto;
        padding:5px 8px;
        border-radius:999px;
        border:1px solid rgba(216,170,88,.18);
        background:rgba(216,170,88,.05);
        color:#d8b874;
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.25px;
      }

      .m7ds-v2-state.independent{
        color:#77e7ae;
        border-color:rgba(64,210,130,.22);
        background:rgba(64,210,130,.055);
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

      .m7ds-modules-linked
      [data-m7ds-pane="modules"]
      .m7ds-color-row{
        opacity:.62;
      }

      .m7ds-modules-linked
      [data-m7ds-pane="modules"]
      .m7ds-color-row::after{
        content:"Linked — change color to unlock";
        margin-left:3px;
        color:#8b7f6b;
        font-size:7px;
        white-space:nowrap;
      }

      @media(max-width:700px){
        .m7ds-v2-actions{
          display:grid;
          grid-template-columns:1fr 1fr;
        }

        .m7ds-v2-state{
          grid-column:1/-1;
          margin-left:0;
          text-align:center;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function mountAll(){
    document
      .querySelectorAll(
        ".m7-design-studio"
      )
      .forEach(decorate);
  }

  function boxForPrefix(prefix){
    return document
      .getElementById(
        prefix +
        "page_design_preset"
      )
      ?.closest(
        ".m7-design-studio"
      ) || null;
  }

  function patchApi(){
    if(apiPatched){
      return;
    }

    const api =
      window.Ma7alakDirectoryAdmin;

    if(
      !api ||
      typeof api.fill !== "function"
    ){
      return;
    }

    apiPatched = true;

    const oldFill =
      api.fill.bind(api);

    api.fill = function(shop){
      const result =
        oldFill(shop);

      window.setTimeout(
        ()=>{
          mountAll();

          const box =
            boxForPrefix(
              "m7de-"
            );

          if(box){
            snapshots["m7de-"] =
              capture(box);

            box.__m7dsRefresh?.();
            updateLinkState(box);
          }
        },
        0
      );

      return result;
    };
  }

  function bindGlobalModuleOverrideListener(){
    if(
      window.__MA7ALAK_DS_V2_MODULE_LISTENER__
    ){
      return;
    }

    window.__MA7ALAK_DS_V2_MODULE_LISTENER__ =
      true;

    document.addEventListener(
      "input",
      function(event){
        if(applying){
          return;
        }

        const input =
          event.target;

        if(
          !input ||
          input.type !== "color" ||
          !input.id
        ){
          return;
        }

        const prefix =
          input.id.startsWith("m7de-")
            ? "m7de-"
            : (
                input.id.startsWith("m7da-")
                  ? "m7da-"
                  : ""
              );

        if(!prefix){
          return;
        }

        const key =
          input.id.slice(
            prefix.length
          );

        if(
          !MODULE_KEYS.has(key)
        ){
          return;
        }

        const box =
          boxForPrefix(prefix);

        const toggle =
          universalToggle(box);

        if(
          !box ||
          !toggle ||
          !toggle.checked ||
          box.dataset.m7dsResetting === "1"
        ){
          return;
        }

        toggle.checked = false;

        toggle.dispatchEvent(
          new Event(
            "change",
            {bubbles:true}
          )
        );

        updateLinkState(box);
      },
      true
    );
  }

  function boot(){
    ensureCss();
    mountAll();
    patchApi();
    bindGlobalModuleOverrideListener();
  }

  async function start(){
    for(let i=0;i<200;i++){
      boot();

      if(
        document.querySelector(
          ".m7-design-studio"
        ) &&
        apiPatched
      ){
        break;
      }

      await new Promise(
        resolve=>
          setTimeout(
            resolve,
            50
          )
      );
    }

    boot();

    let queued = false;

    new MutationObserver(
      ()=>{
        if(queued){
          return;
        }

        queued = true;

        requestAnimationFrame(
          ()=>{
            queued = false;
            boot();
          }
        );
      }
    )
      .observe(
        document.documentElement,
        {
          childList:true,
          subtree:true
        }
      );
  }

  start().catch(
    error=>
      console.error(
        "MA7ALAK Design Studio V2:",
        error
      )
  );

})();
