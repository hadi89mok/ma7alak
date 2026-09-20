
/* =========================================================
   SHOUFHON PROFILE HUB — PAGE DESIGN STUDIO LIVE RUNTIME
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
        ring:"◇",
        star:"★",
        sparkle:"✦",
        dot:"•",
        circle:"●",
        heart:"♥",
        bolt:"⚡",
        crown:"♛",
        flame:"🔥",
        coffee:"☕",
        flower:"✿",
        moon:"☾",
        plus:"✚",
        chevron:"❯",
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
        " 0 1px,transparent 1px 3px," +
        color +
        " 3px 4px)"
      );
    }

    if(style === "dotted"){
      return (
        "radial-gradient(circle," +
        color +
        " 0 1.2px,transparent 1.4px) 0 50% / 7px 3px repeat-x"
      );
    }

    if(style === "dashed"){
      return (
        "repeating-linear-gradient(90deg," +
        color +
        " 0 9px,transparent 9px 15px)"
      );
    }

    if(style === "segmented"){
      return (
        "repeating-linear-gradient(90deg," +
        color +
        " 0 5px,transparent 5px 8px," +
        color +
        " 8px 16px,transparent 16px 23px)"
      );
    }

    if(style === "gradient"){
      return (
        "linear-gradient(90deg,transparent," +
        color +
        ",#ffffff," +
        color +
        ",transparent)"
      );
    }

    if(style === "neon"){
      return color;
    }

    if(style === "beam"){
      return (
        "linear-gradient(90deg,transparent 0 8%," +
        color +
        " 30% 70%,transparent 92%)"
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

  function clampNumber(value,min,max,fallback){
    const n=Number(value);
    return Number.isFinite(n)
      ? Math.max(min,Math.min(max,n))
      : fallback;
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

    const animationSpeed =
      clampNumber(
        options.page_animation_speed,
        .6,
        6,
        2.4
      );

    const animationIntensity =
      clampNumber(
        options.page_animation_intensity,
        0,
        100,
        55
      );

    const glowPower =
      clampNumber(
        options.page_glow_power,
        0,
        100,
        55
      );

    const shimmerBrightness =
      clampNumber(
        options.page_shimmer_brightness,
        0,
        100,
        75
      );

    const floatDistance =
      clampNumber(
        options.page_float_distance,
        0,
        20,
        6
      );

    const tunedSpeed =
      motionSubtle
        ? Math.min(9,animationSpeed*1.75)
        : animationSpeed;

    const tunedFloat =
      floatDistance*
      (.35+animationIntensity/100);

    const tunedScale =
      1+
      animationIntensity*.0007;

    const tunedRotate =
      .35+
      animationIntensity*.02;

    const glowNear =
      2+
      glowPower*.12;

    const glowFar =
      4+
      glowPower*.24;

    const shimmerAlpha =
      Math.min(
        1,
        .20+
        shimmerBrightness*.008
      );

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

    const rawTitleMode =
      String(
        options.about_title_animation ||
        "current"
      )
        .trim()
        .toLowerCase();

    const legacyTitleShimmerEnabled =
      options.about_fx_title_shimmer === undefined
        ? true
        : (
            options.about_fx_title_shimmer === true ||
            String(options.about_fx_title_shimmer).toLowerCase() === "true"
          );

    const titleMode =
      rawTitleMode === "current"
        ? (
            legacyTitleShimmerEnabled
              ? "shimmer"
              : "none"
          )
        : rawTitleMode;

    const titleRgb =
      hexToRgb(titleColor) ||
      rgb;

    const titleLight =
      mix(
        titleRgb,
        {r:255,g:255,b:255},
        .48
      );

    const titleSoft =
      mix(
        titleRgb,
        {r:255,g:255,b:255},
        .20
      );

    function buildTextAnimationCss(
      mode,
      color,
      colorRgb,
      lightColor,
      softColor
    ){
      const normalized =
        String(mode || "none")
          .trim()
          .toLowerCase();

      const base = `
        display:inline-block!important;
        transform-origin:center!important;
        animation-play-state:running!important;
        -webkit-animation-play-state:running!important;
        will-change:transform,filter,background-position,opacity!important;
        -webkit-backface-visibility:hidden!important;
        backface-visibility:hidden!important;
      `;

      let css = "";

      if(normalized === "glow"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:m7HubTitleGlow ${tunedSpeed}s ease-in-out infinite!important;
          -webkit-animation:m7HubTitleGlow ${tunedSpeed}s ease-in-out infinite!important;
        `;
      }
      else if(normalized === "breathe"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:m7HubTitleBreathe ${tunedSpeed}s ease-in-out infinite!important;
          -webkit-animation:m7HubTitleBreathe ${tunedSpeed}s ease-in-out infinite!important;
        `;
      }
      else if(normalized === "float"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:m7HubTitleFloat ${tunedSpeed}s ease-in-out infinite!important;
          -webkit-animation:m7HubTitleFloat ${tunedSpeed}s ease-in-out infinite!important;
        `;
      }
      else if(normalized === "pulse"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:m7HubTitlePulse ${tunedSpeed}s ease-in-out infinite!important;
          -webkit-animation:m7HubTitlePulse ${tunedSpeed}s ease-in-out infinite!important;
        `;
      }
      else if(normalized === "sway"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:m7HubTitleSway ${tunedSpeed}s ease-in-out infinite!important;
          -webkit-animation:m7HubTitleSway ${tunedSpeed}s ease-in-out infinite!important;
        `;
      }
      else if(normalized === "bounce"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:m7HubTitleBounce ${tunedSpeed}s ease-in-out infinite!important;
          -webkit-animation:m7HubTitleBounce ${tunedSpeed}s ease-in-out infinite!important;
        `;
      }
      else if(normalized === "flicker"){
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          text-shadow:
            0 0 ${glowNear}px ${rgba(colorRgb,.72)},
            0 0 ${glowFar}px ${rgba(colorRgb,.34)}!important;
          animation:m7HubTitleFlicker ${tunedSpeed}s linear infinite!important;
          -webkit-animation:m7HubTitleFlicker ${tunedSpeed}s linear infinite!important;
        `;
      }
      else if(normalized === "shimmer"){
        css = `
          background:
            linear-gradient(
              110deg,
              ${color} 0%,
              ${softColor} 30%,
              rgba(255,255,255,${shimmerAlpha}) 46%,
              #ffffff 51%,
              rgba(255,255,255,${shimmerAlpha}) 56%,
              ${lightColor} 70%,
              ${color} 100%
            )!important;
          background-size:320% 100%!important;
          background-position:145% 50%!important;
          background-repeat:no-repeat!important;
          -webkit-background-clip:text!important;
          background-clip:text!important;
          color:transparent!important;
          -webkit-text-fill-color:transparent!important;
          animation:m7HubTitleShimmer ${tunedSpeed}s linear infinite!important;
          -webkit-animation:m7HubTitleShimmer ${tunedSpeed}s linear infinite!important;
          filter:
            drop-shadow(
              0 0 ${Math.max(1,glowNear*.35)}px
              ${rgba(colorRgb,.34)}
            )!important;
        `;
      }
      else{
        css = `
          background:none!important;
          color:${color}!important;
          -webkit-text-fill-color:${color}!important;
          animation:none!important;
          -webkit-animation:none!important;
        `;
      }

      if(motionOff){
        css += `
          animation:none!important;
          -webkit-animation:none!important;
        `;
      }

      return base + css;
    }

    const titleVisualCss =
      buildTextAnimationCss(
        titleMode,
        titleColor,
        titleRgb,
        titleLight,
        titleSoft
      );

    const arabicColor =
      safeHex(
        options.about_arabic_color ||
        options.arabic_name_color,
        accent
      );

    const arabicRgb =
      hexToRgb(arabicColor) ||
      rgb;

    const arabicLight =
      mix(
        arabicRgb,
        {r:255,g:255,b:255},
        .48
      );

    const arabicSoft =
      mix(
        arabicRgb,
        {r:255,g:255,b:255},
        .20
      );

    const arabicMode =
      String(
        options.arabic_name_animation ||
        "none"
      )
        .trim()
        .toLowerCase();

    const arabicVisualCss =
      buildTextAnimationCss(
        arabicMode,
        arabicColor,
        arabicRgb,
        arabicLight,
        arabicSoft
      );

    const shopNameColor =
      safeHex(
        options.shop_name_color,
        accent
      );

    const shopNameRgb =
      hexToRgb(shopNameColor) ||
      rgb;

    const shopNameLight =
      mix(
        shopNameRgb,
        {r:255,g:255,b:255},
        .48
      );

    const shopNameSoft =
      mix(
        shopNameRgb,
        {r:255,g:255,b:255},
        .20
      );

    const rawShopNameMode =
      String(
        options.shop_name_animation ||
        "current"
      )
        .trim()
        .toLowerCase();

    const shopNameMode =
      rawShopNameMode === "current"
        ? (
            motionOff
              ? "none"
              : "shimmer"
          )
        : rawShopNameMode;

    const shopNameVisualCss =
      buildTextAnimationCss(
        shopNameMode,
        shopNameColor,
        shopNameRgb,
        shopNameLight,
        shopNameSoft
      );

    const labelLineColor =
      safeHex(
        options.shop_label_line_color,
        accent
      );

    const labelLineStyle =
      String(
        options.shop_label_line_style ||
        (
          preset === "minimal"
            ? "solid"
            : "fade"
        )
      )
        .trim()
        .toLowerCase();

    const labelSymbol =
      symbol(
        String(
          options.shop_label_symbol ||
          "diamond"
        )
          .trim()
          .toLowerCase(),
        options.shop_label_symbol_text
      );

    const dividerColor =
      safeHex(
        options.identity_divider_color,
        accent
      );

    const dividerStyle =
      String(
        options.identity_divider_style ||
        (
          preset === "minimal"
            ? "solid"
            : "fade"
        )
      )
        .trim()
        .toLowerCase();

    const dividerSymbol =
      symbol(
        String(
          options.identity_divider_symbol ||
          "diamond"
        )
          .trim()
          .toLowerCase(),
        options.identity_divider_symbol_text
      );

    const labelLineRgb =
      hexToRgb(labelLineColor) ||
      rgb;

    const dividerRgb =
      hexToRgb(dividerColor) ||
      rgb;

    const labelLineBg =
      lineBackground(
        labelLineStyle,
        labelLineColor,
        rgba(labelLineRgb,.58)
      );

    const dividerBg =
      lineBackground(
        dividerStyle,
        dividerColor,
        rgba(dividerRgb,.58)
      );

    const profileRingColor =
      safeHex(
        options.profile_ring_color,
        accent
      );

    const profileRingRgb =
      hexToRgb(profileRingColor) ||
      rgb;

    const profileRingLight =
      mix(
        profileRingRgb,
        {r:255,g:255,b:255},
        .46
      );

    const profileRingDark =
      mix(
        profileRingRgb,
        {r:0,g:0,b:0},
        .38
      );

    const labelTextColor =
      safeHex(
        options.shop_label_text_color,
        accent
      );

    const labelBorderColor =
      safeHex(
        options.shop_label_border_color,
        accent
      );

    const labelBgColor =
      safeHex(
        options.shop_label_bg_color,
        "#171217"
      );

    const labelIconColor =
      safeHex(
        options.shop_label_icon_color,
        accent
      );

    function applyInlineAnimation(
      element,
      css
    ){
      if(!element){
        return;
      }

      /*
        The manual Hostinger profile embed has an older inline Design Studio
        engine. Appending the authoritative V2 declarations here makes the
        latest Admin setting win without replacing the giant embed.
      */
      element.style.cssText +=
        ";" +
        String(css || "");
    }

    applyInlineAnimation(
      document.getElementById(
        "ma7alak-shop-name"
      ),
      shopNameVisualCss
    );

    applyInlineAnimation(
      document.getElementById(
        "ma7alak-shop-arabic-name"
      ),
      arabicVisualCss
    );

    const identityLines =
      [
        ...document.querySelectorAll(
          "#ma7alak-shop-identity .ma7alak-shop-identity-line"
        )
      ];

    identityLines.forEach(
      (line,index)=>{
        if(labelLineStyle === "none"){
          line.style.setProperty(
            "display",
            "none",
            "important"
          );
          return;
        }

        line.style.removeProperty(
          "display"
        );

        line.style.setProperty(
          "background",
          labelLineBg,
          "important"
        );

        line.style.setProperty(
          "height",
          labelLineStyle === "double"
            ? "4px"
            : (
                labelLineStyle === "beam"
                  ? "3px"
                  : "2px"
              ),
          "important"
        );

        line.style.setProperty(
          "box-shadow",
          labelLineStyle === "neon"
            ? (
                "0 0 " +
                glowNear +
                "px " +
                rgba(labelLineRgb,.86) +
                ",0 0 " +
                glowFar +
                "px " +
                rgba(labelLineRgb,.44)
              )
            : (
                "0 0 " +
                Math.max(
                  1,
                  glowNear*.45
                ) +
                "px " +
                rgba(labelLineRgb,.28)
              ),
          "important"
        );

        if(
          !motionOff &&
          [
            "fade",
            "gradient",
            "beam"
          ].includes(labelLineStyle)
        ){
          line.style.setProperty(
            "background-size",
            "260% 100%",
            "important"
          );

          line.style.setProperty(
            "animation",
            "m7HubIdentityLineFlow " +
            tunedSpeed +
            "s linear infinite",
            "important"
          );

          line.style.setProperty(
            "-webkit-animation",
            "m7HubIdentityLineFlow " +
            tunedSpeed +
            "s linear infinite",
            "important"
          );
        }
        else if(
          !motionOff &&
          labelLineStyle === "neon"
        ){
          line.style.setProperty(
            "animation",
            "m7HubIdentityLineGlow " +
            tunedSpeed +
            "s ease-in-out infinite",
            "important"
          );

          line.style.setProperty(
            "-webkit-animation",
            "m7HubIdentityLineGlow " +
            tunedSpeed +
            "s ease-in-out infinite",
            "important"
          );
        }
        else{
          line.style.setProperty(
            "animation",
            "none",
            "important"
          );

          line.style.setProperty(
            "-webkit-animation",
            "none",
            "important"
          );
        }

        line.style.setProperty(
          "animation-play-state",
          "running",
          "important"
        );

        line.style.setProperty(
          "-webkit-animation-play-state",
          "running",
          "important"
        );

        line.style.setProperty(
          "-webkit-backface-visibility",
          "hidden",
          "important"
        );

        line.style.setProperty(
          "backface-visibility",
          "hidden",
          "important"
        );

        if(index === 1){
          line.style.setProperty(
            "transform",
            "scaleX(-1)",
            "important"
          );
        }
      }
    );

    const categoryRow =
      document.getElementById(
        "ma7alak-shop-identity-category-row"
      );

    if(categoryRow){
      categoryRow
        .querySelectorAll(
          ".m7ds-label-symbol"
        )
        .forEach(node=>node.remove());

      if(labelSymbol){
        const left =
          document.createElement(
            "span"
          );

        const right =
          document.createElement(
            "span"
          );

        left.className =
          "m7ds-label-symbol";

        right.className =
          "m7ds-label-symbol";

        left.textContent =
          labelSymbol;

        right.textContent =
          labelSymbol;

        const pill =
          document.getElementById(
            "ma7alak-shop-category-pill"
          );

        if(pill){
          categoryRow.insertBefore(
            left,
            pill
          );

          pill.after(
            right
          );
        }
      }
    }

    const dividerCenter =
      document.querySelector(
        "#ma7alak-shop-identity-divider span"
      );

    if(dividerCenter){
      dividerCenter.textContent =
        dividerSymbol;
    }

    const categoryPill =
      document.getElementById(
        "ma7alak-shop-category-pill"
      );

    if(categoryPill){
      categoryPill.style.setProperty(
        "border-color",
        labelBorderColor,
        "important"
      );

      categoryPill.style.setProperty(
        "background",
        "linear-gradient(145deg," +
        labelBgColor +
        ",rgba(8,8,10,.98))",
        "important"
      );
    }

    const categoryText =
      document.getElementById(
        "ma7alak-shop-category-text"
      );

    categoryText?.style.setProperty(
      "color",
      labelTextColor,
      "important"
    );

    const categoryIcon =
      document.getElementById(
        "ma7alak-shop-category-icon"
      );

    if(categoryIcon){
      categoryIcon.style.setProperty(
        "color",
        labelIconColor,
        "important"
      );

      categoryIcon.style.setProperty(
        "border-color",
        rgba(
          hexToRgb(labelIconColor) ||
          rgb,
          .62
        ),
        "important"
      );
    }

    const storyButton =
      document.getElementById(
        "ma7alak-story-button"
      );

    storyButton?.style.setProperty(
      "border-color",
      profileRingColor,
      "important"
    );

    storyButton?.style.setProperty(
      "box-shadow",
      "0 0 0 1px " +
      rgba(profileRingRgb,.14) +
      ",0 0 " +
      glowNear +
      "px " +
      rgba(profileRingRgb,.34),
      "important"
    );

    const storyNewRing =
      document.getElementById(
        "ma7alak-story-new-ring"
      );

    storyNewRing?.style.setProperty(
      "border-color",
      rgba(profileRingRgb,.82),
      "important"
    );

    const storyActiveRing =
      document.getElementById(
        "ma7alak-story-active-ring"
      );

    if(storyActiveRing){
      storyActiveRing.style.setProperty(
        "background",
        "conic-gradient(" +
        profileRingColor +
        "," +
        profileRingLight +
        "," +
        profileRingDark +
        "," +
        profileRingColor +
        ")",
        "important"
      );

      storyActiveRing.style.setProperty(
        "filter",
        "drop-shadow(0 0 " +
        Math.max(3,glowNear*.55) +
        "px " +
        rgba(profileRingRgb,.62) +
        ")",
        "important"
      );

      if(motionOff){
        storyActiveRing.style.setProperty(
          "animation",
          "none",
          "important"
        );

        storyActiveRing.style.setProperty(
          "-webkit-animation",
          "none",
          "important"
        );
      }
      else{
        storyActiveRing.style.setProperty(
          "animation-duration",
          Math.max(
            2.4,
            tunedSpeed*2.4
          ) +
          "s",
          "important"
        );

        storyActiveRing.style.setProperty(
          "-webkit-animation-duration",
          Math.max(
            2.4,
            tunedSpeed*2.4
          ) +
          "s",
          "important"
        );
      }
    }

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

    root.style.setProperty(
      "--m7-page-animation-speed",
      tunedSpeed + "s"
    );

    root.style.setProperty(
      "--m7-page-animation-intensity",
      String(animationIntensity/100)
    );

    root.style.setProperty(
      "--m7-page-glow-power",
      String(glowPower/100)
    );

    root.style.setProperty(
      "--m7-page-float-distance",
      tunedFloat + "px"
    );

    root.style.setProperty(
      "--m7-page-float-distance-negative",
      (-tunedFloat) + "px"
    );

    root.style.setProperty(
      "--m7-page-scale-max",
      String(tunedScale)
    );

    root.style.setProperty(
      "--m7-page-glow-near",
      glowNear + "px"
    );

    root.style.setProperty(
      "--m7-page-glow-far",
      glowFar + "px"
    );

    root.style.setProperty(
      "--m7-page-shimmer-alpha",
      String(shimmerAlpha)
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
              animation-duration:${tunedSpeed}s!important;
              -webkit-animation-duration:${tunedSpeed}s!important;
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

      @keyframes m7HubTitleShimmer{
        from{background-position:145% 50%}
        to{background-position:-145% 50%}
      }

      @-webkit-keyframes m7HubTitleShimmer{
        from{background-position:145% 50%}
        to{background-position:-145% 50%}
      }

      @keyframes m7HubTitleGlow{
        0%,100%{
          text-shadow:
            0 0 ${Math.max(1,glowNear*.28)}px ${rgba(titleRgb,.26)},
            0 2px 10px rgba(0,0,0,.45);
        }
        50%{
          text-shadow:
            0 0 ${glowNear}px ${rgba(titleRgb,.88)},
            0 0 ${glowFar}px ${rgba(titleRgb,.44)},
            0 2px 10px rgba(0,0,0,.45);
        }
      }

      @-webkit-keyframes m7HubTitleGlow{
        0%,100%{
          text-shadow:
            0 0 ${Math.max(1,glowNear*.28)}px ${rgba(titleRgb,.26)},
            0 2px 10px rgba(0,0,0,.45);
        }
        50%{
          text-shadow:
            0 0 ${glowNear}px ${rgba(titleRgb,.88)},
            0 0 ${glowFar}px ${rgba(titleRgb,.44)},
            0 2px 10px rgba(0,0,0,.45);
        }
      }

      @keyframes m7HubTitleBreathe{
        0%,100%{transform:scale(1);opacity:.94}
        50%{transform:scale(${tunedScale});opacity:1}
      }

      @-webkit-keyframes m7HubTitleBreathe{
        0%,100%{-webkit-transform:scale(1);opacity:.94}
        50%{-webkit-transform:scale(${tunedScale});opacity:1}
      }

      @keyframes m7HubTitleFloat{
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(-${tunedFloat}px)}
      }

      @-webkit-keyframes m7HubTitleFloat{
        0%,100%{-webkit-transform:translateY(0)}
        50%{-webkit-transform:translateY(-${tunedFloat}px)}
      }

      @keyframes m7HubTitlePulse{
        0%,100%{transform:scale(1);opacity:1}
        50%{transform:scale(${tunedScale});opacity:${Math.max(.55,1-animationIntensity*.0035)}}
      }

      @-webkit-keyframes m7HubTitlePulse{
        0%,100%{-webkit-transform:scale(1);opacity:1}
        50%{-webkit-transform:scale(${tunedScale});opacity:${Math.max(.55,1-animationIntensity*.0035)}}
      }

      @keyframes m7HubTitleSway{
        25%{transform:rotate(-${tunedRotate}deg)}
        75%{transform:rotate(${tunedRotate}deg)}
      }

      @-webkit-keyframes m7HubTitleSway{
        25%{-webkit-transform:rotate(-${tunedRotate}deg)}
        75%{-webkit-transform:rotate(${tunedRotate}deg)}
      }

      @keyframes m7HubTitleBounce{
        0%,100%{transform:translateY(0)}
        45%{transform:translateY(-${tunedFloat}px)}
        62%{transform:translateY(${Math.max(.5,tunedFloat*.25)}px)}
      }

      @-webkit-keyframes m7HubTitleBounce{
        0%,100%{-webkit-transform:translateY(0)}
        45%{-webkit-transform:translateY(-${tunedFloat}px)}
        62%{-webkit-transform:translateY(${Math.max(.5,tunedFloat*.25)}px)}
      }

      @keyframes m7HubTitleFlicker{
        0%,18%,22%,25%,53%,57%,100%{opacity:1}
        20%,24%,55%{opacity:.38}
      }

      @-webkit-keyframes m7HubTitleFlicker{
        0%,18%,22%,25%,53%,57%,100%{opacity:1}
        20%,24%,55%{opacity:.38}
      }
      @keyframes m7HubIdentityLineFlow{
        from{background-position:140% 50%}
        to{background-position:-140% 50%}
      }

      @-webkit-keyframes m7HubIdentityLineFlow{
        from{background-position:140% 50%}
        to{background-position:-140% 50%}
      }

      @keyframes m7HubIdentityLineGlow{
        0%,100%{opacity:.58;filter:brightness(1)}
        50%{opacity:1;filter:brightness(1.42)}
      }

      @-webkit-keyframes m7HubIdentityLineGlow{
        0%,100%{opacity:.58;-webkit-filter:brightness(1)}
        50%{opacity:1;-webkit-filter:brightness(1.42)}
      }


      html body #ma7alak-shop-identity .ma7alak-shop-identity-line::before,
      html body #ma7alak-shop-identity .ma7alak-shop-identity-line::after{
        display:none!important;
        animation:none!important;
        -webkit-animation:none!important;
      }

      html body #ma7alak-shop-identity .m7ds-label-symbol{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        flex:0 0 auto!important;
        color:${labelLineColor}!important;
        font-size:10px!important;
        line-height:1!important;
        text-shadow:
          0 0 ${glowNear}px
          ${rgba(labelLineRgb,.56)}!important;
        animation-play-state:running!important;
        -webkit-animation-play-state:running!important;
      }

      html body #ma7alak-shop-identity #ma7alak-shop-identity-divider{
        display:${dividerStyle === "none" ? "none" : "flex"}!important;
        color:${dividerColor}!important;
      }

      html body #ma7alak-shop-identity #ma7alak-shop-identity-divider::before,
      html body #ma7alak-shop-identity #ma7alak-shop-identity-divider::after{
        background:${dividerBg}!important;
        height:${dividerStyle === "double" ? "4px" : dividerStyle === "beam" ? "3px" : "2px"}!important;
        box-shadow:
          ${dividerStyle === "neon"
            ? "0 0 "+glowNear+"px "+rgba(dividerRgb,.84)+",0 0 "+glowFar+"px "+rgba(dividerRgb,.42)
            : "0 0 "+Math.max(1,glowNear*.40)+"px "+rgba(dividerRgb,.24)}!important;
        ${(
          !motionOff &&
          ["fade","gradient","beam"].includes(dividerStyle)
        )
          ? (
              "background-size:260% 100%!important;" +
              "animation:m7HubIdentityLineFlow "+tunedSpeed+"s linear infinite!important;" +
              "-webkit-animation:m7HubIdentityLineFlow "+tunedSpeed+"s linear infinite!important;"
            )
          : (
              !motionOff &&
              dividerStyle === "neon"
                ? (
                    "animation:m7HubIdentityLineGlow "+tunedSpeed+"s ease-in-out infinite!important;" +
                    "-webkit-animation:m7HubIdentityLineGlow "+tunedSpeed+"s ease-in-out infinite!important;"
                  )
                : "animation:none!important;-webkit-animation:none!important;"
            )}
      }

      html body #ma7alak-shop-identity #ma7alak-shop-identity-divider span{
        display:${dividerSymbol ? "inline-flex" : "none"}!important;
        align-items:center!important;
        justify-content:center!important;
        width:auto!important;
        min-width:10px!important;
        height:auto!important;
        margin:0 8px!important;
        border:0!important;
        border-radius:0!important;
        background:none!important;
        color:${dividerColor}!important;
        transform:none!important;
        -webkit-transform:none!important;
        font-size:10px!important;
        line-height:1!important;
        text-shadow:
          0 0 ${glowNear}px
          ${rgba(dividerRgb,.58)}!important;
        box-shadow:none!important;
      }

      html body #ma7alak-exact-merged-hub #ma7alak-about-title{
        transform:translateZ(0);
        -webkit-transform:translateZ(0);
        ${titleVisualCss}
      }

      html body #ma7alak-exact-merged-hub #ma7alak-about-arabic-name{
        transform:translateZ(0);
        -webkit-transform:translateZ(0);
        ${arabicVisualCss}
      }

      html body #ma7alak-exact-merged-hub .zee-line,
      html body #ma7alak-exact-merged-hub .zee-line::after,
      html body #ma7alak-exact-merged-hub .zee-center-symbol,
      html body #ma7alak-exact-merged-hub .zee-title-sparkle,
      html body #ma7alak-exact-merged-hub .ma7alak-about-floating-sparkles span,
      html body #ma7alak-exact-merged-hub .zee-service-icon,
      html body #ma7alak-exact-merged-hub .zee-signature-text{
        animation-play-state:running;
        -webkit-animation-play-state:running;
        -webkit-backface-visibility:hidden;
        backface-visibility:hidden;
      }

      html body #ma7alak-exact-merged-hub .zee-line{
        ${ornamentStyle === "none" ? "display:none!important;" : ""}
        height:${ornamentStyle === "double" ? "4px" : ornamentStyle === "beam" ? "3px" : "2px"}!important;
        background:${ornamentBg}!important;
        animation-duration:${tunedSpeed}s!important;
        -webkit-animation-duration:${tunedSpeed}s!important;
        box-shadow:
          ${ornamentStyle === "neon"
            ? "0 0 "+glowNear+"px "+rgba(ornamentRgb,.86)+",0 0 "+glowFar+"px "+rgba(ornamentRgb,.44)
            : "0 0 "+Math.max(1,glowNear*.45)+"px "+rgba(ornamentRgb,.28)}!important;
      }

      html body #ma7alak-exact-merged-hub .zee-center-symbol{
        display:${ornamentSymbol ? "inline-block" : "none"}!important;
        color:${ornamentColor}!important;
        text-shadow:
          0 0 ${glowNear}px ${rgba(ornamentRgb,.62)},
          0 0 ${Math.max(glowNear,glowFar*.55)}px ${rgba(ornamentRgb,.28)}!important;
      }

      /*
        Do not write a fixed !important box-shadow here.
        The m7AboutPanelGlow keyframes in the hub own the animated shadow.
      */

      html body #ma7alak-exact-merged-hub .zee-service-icon{
        animation-duration:${tunedSpeed}s!important;
        -webkit-animation-duration:${tunedSpeed}s!important;
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
        animation-duration:${tunedSpeed}s!important;
        -webkit-animation-duration:${tunedSpeed}s!important;
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

      @media(max-width:600px){
        html body #ma7alak-exact-merged-hub #ma7alak-about-title,
        html body #ma7alak-exact-merged-hub #ma7alak-about-arabic-name,
        html body #ma7alak-exact-merged-hub .zee-center-symbol,
        html body #ma7alak-exact-merged-hub .zee-service-icon,
        html body #ma7alak-exact-merged-hub .zee-title-sparkle{
          -webkit-font-smoothing:antialiased;
          transform-style:preserve-3d;
          -webkit-transform-style:preserve-3d;
        }
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
        (
          document.getElementById(
            "ma7alak-about-title"
          ) ||
          document.getElementById(
            "ma7alak-shop-name"
          )
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
      "[ShoufHon Hub] Design Studio:",
      error
    )
  );

})();
