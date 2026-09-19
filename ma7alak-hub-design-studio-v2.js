
/* =========================================================
   MA7ALAK PROFILE HUB — PAGE DESIGN STUDIO LIVE RUNTIME
   Uses directory_options saved from Admin.

   Controls About + shared Hub accent for:
     About
     Social
     Location / Availability
     Stats
========================================================= */
(function(){
  "use strict";

  if(window.__MA7ALAK_HUB_PAGE_DESIGN_STUDIO_V2__){
    return;
  }

  window.__MA7ALAK_HUB_PAGE_DESIGN_STUDIO_V2__ = true;

  function safeHex(value,fallback){
    const raw = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(raw)
      ? raw
      : fallback;
  }

  function hexToRgb(hex){
    const clean =
      String(hex || "")
        .trim()
        .replace("#","");

    if(!/^[0-9a-f]{6}$/i.test(clean)){
      return null;
    }

    return {
      r:parseInt(clean.slice(0,2),16),
      g:parseInt(clean.slice(2,4),16),
      b:parseInt(clean.slice(4,6),16)
    };
  }

  function mix(rgb,target,amount){
    const clamp = n =>
      Math.max(
        0,
        Math.min(
          255,
          Math.round(n)
        )
      );

    return (
      "#" +
      [
        clamp(rgb.r+(target.r-rgb.r)*amount),
        clamp(rgb.g+(target.g-rgb.g)*amount),
        clamp(rgb.b+(target.b-rgb.b)*amount)
      ]
        .map(v=>v.toString(16).padStart(2,"0"))
        .join("")
    );
  }

  function rgba(rgb,a){
    return (
      "rgba(" +
      rgb.r + "," +
      rgb.g + "," +
      rgb.b + "," +
      a +
      ")"
    );
  }

  function symbol(kind,custom){
    const own =
      String(custom || "").trim();

    if(
      kind === "custom" &&
      own
    ){
      return own.slice(0,5);
    }

    return (
      {
        diamond:"◆",
        star:"★",
        sparkle:"✦",
        dot:"•",
        none:""
      }[kind] ||
      "◆"
    );
  }

  function cssText(value){
    return String(value || "")
      .replace(/\\/g,"\\\\")
      .replace(/"/g,'\\"')
      .replace(/\n/g," ");
  }

  function lineBackground(
    style,
    color,
    rgbaColor
  ){
    if(style === "solid"){
      return color;
    }

    if(style === "double"){
      return (
        "linear-gradient(to bottom," +
        color +
        " 0 1px,transparent 1px 2px," +
        color +
        " 2px 3px)"
      );
    }

    if(style === "dotted"){
      return (
        "radial-gradient(circle," +
        color +
        " 0 1.2px,transparent 1.4px) 0 50% / 7px 3px repeat-x"
      );
    }

    return (
      "linear-gradient(90deg,transparent 0%," +
      rgbaColor +
      " 28%," +
      color +
      " 52%," +
      rgbaColor +
      " 70%,transparent 100%)"
    );
  }

  function apply(profile){
    const options =
      profile &&
      profile.directory_options &&
      typeof profile.directory_options === "object"
        ? profile.directory_options
        : {};

    const universal =
      safeHex(
        options.story_color ||
        options.card_color,
        "#f2caed"
      );

    const useUniversal =
      options.page_use_universal_accent === undefined
        ? true
        : (
            options.page_use_universal_accent === true ||
            String(options.page_use_universal_accent).toLowerCase() === "true"
          );

    const accent =
      useUniversal
        ? universal
        : safeHex(
            options.hub_accent_color,
            universal
          );

    const rgb =
      hexToRgb(accent) ||
      {
        r:242,
        g:202,
        b:237
      };

    const light =
      mix(
        rgb,
        {r:255,g:255,b:255},
        .44
      );

    const dark =
      mix(
        rgb,
        {r:0,g:0,b:0},
        .42
      );

    const preset =
      String(
        options.page_design_preset ||
        "premium"
      )
        .trim()
        .toLowerCase();

    const motionMode =
      String(
        options.page_motion_mode ||
        "preset"
      )
        .trim()
        .toLowerCase();

    const motionOff =
      motionMode === "off" ||
      (
        motionMode === "preset" &&
        (
          preset === "basic" ||
          preset === "minimal"
        )
      );

    const motionSubtle =
      motionMode === "subtle";

    function picked(key,fallback){
      /*
        Fine-grained About controls always win. The Universal Accent
        switch links module accents only (Gallery / Video / Follow /
        Live / Hub), so About colors remain directly editable.
      */
      return safeHex(
        options[key],
        fallback || accent
      );
    }

    const titleColor =
      picked(
        "about_title_color",
        accent
      );

    const kickerColor =
      picked(
        "about_kicker_color",
        accent
      );

    const ornamentColor =
      picked(
        "about_ornament_color",
        accent
      );

    const serviceText =
      safeHex(
        options.about_service_text_color,
        "#ffffff"
      );

    const serviceBorder =
      picked(
        "about_service_border_color",
        accent
      );

    const serviceIcon =
      picked(
        "about_service_icon_color",
        accent
      );

    const signatureColor =
      picked(
        "about_signature_color",
        accent
      );

    const bodyText =
      safeHex(
        options.about_text_color,
        "#ffffff"
      );

    const panelBg =
      safeHex(
        options.about_panel_bg_color,
        preset === "basic"
          ? "#17130d"
          : "#141014"
      );

    const panelBorder =
      picked(
        "about_panel_border_color",
        accent
      );

    const contentBg =
      safeHex(
        options.about_content_bg_color,
        preset === "basic"
          ? "#15130f"
          : "#161316"
      );

    const contentBorder =
      safeHex(
        options.about_content_border_color,
        "#453b43"
      );

    const serviceBg =
      safeHex(
        options.about_service_bg_color,
        "#151215"
      );

    const ornamentStyle =
      String(
        options.about_ornament_style ||
        (
          preset === "minimal"
            ? "solid"
            : "fade"
        )
      )
        .trim()
        .toLowerCase();

    const ornamentSymbol =
      symbol(
        String(
          options.about_ornament_symbol ||
          "diamond"
        )
          .trim()
          .toLowerCase(),
        options.about_ornament_symbol_text
      );

    const ornamentRgb =
      hexToRgb(ornamentColor) ||
      rgb;

    const ornamentBg =
      lineBackground(
        ornamentStyle,
        ornamentColor,
        rgba(
          ornamentRgb,
          .58
        )
      );

    const center =
      document.querySelector(
        ".zee-center-symbol"
      );

    if(center){
      center.textContent =
        ornamentSymbol;
    }

    /* Shared accent variables used by Social / Location / Stats. */
    const root =
      document.documentElement;

    root.style.setProperty(
      "--m7-shop-accent",
      accent
    );

    root.style.setProperty(
      "--m7-shop-accent-rgb",
      rgb.r + "," + rgb.g + "," + rgb.b
    );

    root.style.setProperty(
      "--m7-shop-accent-light",
      light
    );

    root.style.setProperty(
      "--m7-shop-accent-soft",
      mix(
        rgb,
        {r:255,g:255,b:255},
        .16
      )
    );

    root.style.setProperty(
      "--m7-shop-accent-dark",
      dark
    );

    root.style.setProperty(
      "--m7-exact-shell-accent-rgb",
      rgb.r + "," + rgb.g + "," + rgb.b
    );

    let style =
      document.getElementById(
        "m7-hub-page-design-studio"
      );

    if(!style){
      style =
        document.createElement(
          "style"
        );

      style.id =
        "m7-hub-page-design-studio";

      document.head.appendChild(
        style
      );
    }

    const staticCss =
      motionOff
        ? `
            html body #ma7alak-exact-merged-hub .zee-line,
            html body #ma7alak-exact-merged-hub .zee-line::after,
            html body #ma7alak-exact-merged-hub .zee-center-symbol,
            html body #ma7alak-exact-merged-hub .zee-title-word,
            html body #ma7alak-exact-merged-hub .zee-title-sparkle,
            html body #ma7alak-exact-merged-hub .zee-about-card,
            html body #ma7alak-exact-merged-hub .ma7alak-about-floating-sparkles span,
            html body #ma7alak-exact-merged-hub .zee-service-icon,
            html body #ma7alak-exact-merged-hub .zee-signature-text,
            html body #ma7alak-exact-merged-hub .ma7alak-location-section::before,
            html body #ma7alak-exact-merged-hub .ma7alak-info-row::before,
            html body #ma7alak-exact-merged-hub .ma7alak-location-icon,
            html body #ma7alak-exact-merged-hub .ma7alak-clock-icon,
            html body #ma7alak-exact-merged-hub #ma7alak-online-eye{
              animation:none!important;
              -webkit-animation:none!important;
            }

            html body #ma7alak-exact-merged-hub .zee-line::after,
            html body #ma7alak-exact-merged-hub .zee-title-sparkle,
            html body #ma7alak-exact-merged-hub #ma7alak-about-floating-sparkles{
              display:none!important;
            }
          `
        : "";

    const subtleCss =
      motionSubtle
        ? `
            html body #ma7alak-exact-merged-hub .zee-line,
            html body #ma7alak-exact-merged-hub .zee-title-word,
            html body #ma7alak-exact-merged-hub .zee-center-symbol,
            html body #ma7alak-exact-merged-hub .zee-service-icon{
              animation-duration:5s!important;
              -webkit-animation-duration:5s!important;
            }
          `
        : "";

    const basicCss =
      preset === "basic"
        ? `
            html body #ma7alak-exact-merged-hub .zee-about-card{
              box-shadow:
                0 12px 30px rgba(0,0,0,.28)!important;
              backdrop-filter:none!important;
              -webkit-backdrop-filter:none!important;
            }

            html body #ma7alak-exact-merged-hub .zee-about-glow{
              display:none!important;
            }
          `
        : "";

    style.textContent = `
      html body #ma7alak-exact-merged-hub .zee-about-card{
        border-color:${panelBorder}!important;
        background:
          linear-gradient(
            145deg,
            ${panelBg},
            #090909
          )!important;
      }

      html body #ma7alak-exact-merged-hub .zee-about-content{
        border-color:${contentBorder}!important;
        background:
          linear-gradient(
            145deg,
            ${contentBg},
            rgba(8,8,8,.96)
          )!important;
      }

      html body #ma7alak-exact-merged-hub .zee-kicker{
        color:${kickerColor}!important;
      }

      html body #ma7alak-exact-merged-hub #ma7alak-about-title{
        ${motionOff ? "animation:none!important;-webkit-animation:none!important;" : ""}
      }

      html body #ma7alak-exact-merged-hub .zee-line{
        ${ornamentStyle === "none" ? "display:none!important;" : ""}
        height:${ornamentStyle === "double" ? "3px" : "2px"}!important;
        background:${ornamentBg}!important;
        box-shadow:
          0 0 6px ${rgba(ornamentRgb,.18)}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-center-symbol{
        display:${ornamentSymbol ? "inline-block" : "none"}!important;
        color:${ornamentColor}!important;
        text-shadow:
          0 0 8px ${rgba(ornamentRgb,.48)}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-about-text{
        color:${bodyText}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-service-pill{
        color:${serviceText}!important;
        border-color:${serviceBorder}!important;
        background:
          linear-gradient(
            145deg,
            ${serviceBg},
            rgba(8,8,8,.96)
          )!important;
      }

      html body #ma7alak-exact-merged-hub .zee-service-icon{
        color:${serviceIcon}!important;
        border-color:${serviceIcon}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-signature-text{
        color:${signatureColor}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-signature-line{
        background:
          linear-gradient(
            90deg,
            transparent,
            ${signatureColor},
            transparent
          )!important;
      }

      html body #ma7alak-exact-merged-hub::before{
        border-color:${rgba(rgb,.26)}!important;
      }

      ${staticCss}
      ${subtleCss}
      ${basicCss}
    `;
  }

  async function load(){
    const slug =
      String(
        window.__MA7ALAK_EXACT_HUB_SLUG__ ||
        document
          .getElementById(
            "ma7alak-shop-profile-hub-mount"
          )
          ?.getAttribute(
            "data-shop-slug"
          ) ||
        ""
      )
        .trim()
        .toLowerCase();

    const client =
      window.__MA7ALAK_EXACT_HUB_REST_CLIENT__;

    if(
      !slug ||
      !client
    ){
      return;
    }

    const result =
      await client
        .from("shop_profiles")
        .select(
          "shop_slug,directory_options"
        )
        .eq(
          "shop_slug",
          slug
        )
        .maybeSingle();

    if(
      !result.error &&
      result.data
    ){
      apply(result.data);
    }
  }

  async function start(){
    for(let i=0;i<120;i++){
      if(
        document.getElementById(
          "ma7alak-about-title"
        ) &&
        window.__MA7ALAK_EXACT_HUB_REST_CLIENT__
      ){
        break;
      }

      await new Promise(resolve=>
        setTimeout(resolve,50)
      );
    }

    await load();

    if(
      typeof window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__ ===
        "function"
    ){
      window.__MA7ALAK_PROFILE_HUB_REGISTER_REFRESH__(
        load
      );
    }
  }

  start().catch(error=>
    console.warn(
      "[Ma7alak Hub] Design Studio:",
      error
    )
  );

})();
