/* =========================================================
   SHOUFHON PROFILE LIVE + STORY BRIDGE
   ---------------------------------------------------------
   Purpose:
   - Show a professional red LIVE state on the existing profile/Story circle.
   - Main profile circle opens the existing ShoufHon Agora live viewer instantly.
   - When Live + Story exist together, Live owns the main circle and a small
     gold Story shortcut appears so both remain available without overlapping.
   - Reuses the existing ma7alak-live-offers.js / ma7alak-live-video.js bridge.
   - No page navigation, no duplicated live viewer, no extra Supabase polling.
   - Hostinger iframe safe and phone-first.
========================================================= */

(function () {
  "use strict";

  if (window.__SHOUFHON_PROFILE_LIVE_STORY_BRIDGE_V1__) return;
  window.__SHOUFHON_PROFILE_LIVE_STORY_BRIDGE_V1__ = true;

  var state = {
    slug: "",
    stream: null,
    forceStoryClick: false,
    booted: false,
    openingLive: false,
    openResetTimer: 0,
    storyClassObserver: null
  };

  function cleanSlug(value) {
    var slug = String(value || "").trim().toLowerCase();

    try {
      slug = decodeURIComponent(slug);
    } catch (_) {}

    slug = slug.replace(/^\/+|\/+$/g, "");

    if (!/^[a-z0-9][a-z0-9._&-]*$/i.test(slug)) {
      return "";
    }

    return slug;
  }

  function detectSlugFromPath(pathname) {
    var parts = String(pathname || "")
      .split("/")
      .filter(Boolean);

    if (!parts.length) return "";

    var last = parts[parts.length - 1];

    try {
      last = decodeURIComponent(last);
    } catch (_) {}

    if (!last || last === "embed" || last === "editor") {
      return "";
    }

    return cleanSlug(last);
  }

  function detectSlug() {
    var shell = document.getElementById("ma7alak-profile-shell");

    var direct = cleanSlug(
      shell && shell.getAttribute("data-shop-slug")
    );

    if (direct) return direct;

    var contextSlug = cleanSlug(
      window.ShoufHonShopContextClient &&
      window.ShoufHonShopContextClient.slug
    );

    if (contextSlug) return contextSlug;

    try {
      if (
        window.parent &&
        window.parent !== window &&
        window.parent.location
      ) {
        var parentSlug = detectSlugFromPath(
          window.parent.location.pathname
        );

        if (parentSlug) return parentSlug;
      }
    } catch (_) {}

    try {
      if (document.referrer) {
        var refSlug = detectSlugFromPath(
          new URL(document.referrer).pathname
        );

        if (refSlug) return refSlug;
      }
    } catch (_) {}

    return detectSlugFromPath(window.location.pathname);
  }

  function parentWindow() {
    try {
      if (window.parent && window.parent !== window) {
        return window.parent;
      }
    } catch (_) {}

    return window;
  }

  function isTrustedSource(source) {
    var parent = parentWindow();

    if (parent === window) {
      return source === window;
    }

    return source === parent;
  }

  function getWrapper() {
    return document.getElementById("ma7alak-story-wrapper");
  }

  function getStoryButton() {
    return document.getElementById("ma7alak-story-button");
  }

  function storyExists() {
    var wrapper = getWrapper();

    return !!(
      wrapper &&
      wrapper.classList.contains("story-has-story")
    );
  }

  function injectCss() {
    if (document.getElementById("shoufhon-profile-live-story-css")) {
      return;
    }

    var style = document.createElement("style");

    style.id = "shoufhon-profile-live-story-css";

    style.textContent = `
/* =========================================================
   SHOUFHON PROFILE VIDEO LIVE — PROFESSIONAL PHONE-FIRST UI
========================================================= */

#ma7alak-profile-shell #ma7alak-story-wrapper{
  --m7-live-red:#ff2348;
  --m7-live-red-rgb:255,35,72;
  --m7-live-red-deep:#b60025;
  --m7-live-white:#fff7f9;
}

/* Actual LIVE ring. It occupies the SAME circle edge as Story. */
#ma7alak-profile-shell #m7-profile-live-ring{
  position:absolute!important;
  left:50%!important;
  top:50%!important;

  width:calc(var(--m7-profile-logo-size,210px) + 14px)!important;
  height:calc(var(--m7-profile-logo-size,210px) + 14px)!important;

  transform:translate(-50%,-50%)!important;
  -webkit-transform:translate(-50%,-50%)!important;

  border-radius:50%!important;
  padding:3px!important;

  box-sizing:border-box!important;
  pointer-events:none!important;

  opacity:0!important;
  visibility:hidden!important;

  z-index:18!important;

  background:
    conic-gradient(
      from 0deg,
      rgba(var(--m7-live-red-rgb),.12) 0deg,
      var(--m7-live-red) 30deg,
      #ff7890 58deg,
      #ffffff 76deg,
      var(--m7-live-red) 98deg,
      var(--m7-live-red-deep) 145deg,
      rgba(var(--m7-live-red-rgb),.22) 190deg,
      var(--m7-live-red) 232deg,
      #ffffff 272deg,
      #ff5b77 307deg,
      var(--m7-live-red) 340deg,
      rgba(var(--m7-live-red-rgb),.12) 360deg
    )!important;

  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0)!important;

  -webkit-mask-composite:xor!important;
  mask-composite:exclude!important;

  filter:
    drop-shadow(0 0 7px rgba(var(--m7-live-red-rgb),.82))
    drop-shadow(0 0 17px rgba(var(--m7-live-red-rgb),.40))
    drop-shadow(0 0 29px rgba(var(--m7-live-red-rgb),.16))!important;

  will-change:transform,opacity!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-ring{
  opacity:1!important;
  visibility:visible!important;

  animation:
    m7ProfileLiveOrbit
    2.15s
    linear
    infinite!important;

  -webkit-animation:
    m7ProfileLiveOrbit
    2.15s
    linear
    infinite!important;
}

@keyframes m7ProfileLiveOrbit{
  from{
    transform:translate(-50%,-50%) rotate(0deg);
  }
  to{
    transform:translate(-50%,-50%) rotate(360deg);
  }
}

@-webkit-keyframes m7ProfileLiveOrbit{
  from{
    -webkit-transform:translate(-50%,-50%) rotate(0deg);
  }
  to{
    -webkit-transform:translate(-50%,-50%) rotate(360deg);
  }
}

/* Soft breathing halo. This is glow only, not a second ring. */
#ma7alak-profile-shell #m7-profile-live-halo{
  position:absolute!important;
  left:50%!important;
  top:50%!important;

  width:var(--m7-profile-logo-size,210px)!important;
  height:var(--m7-profile-logo-size,210px)!important;

  transform:translate(-50%,-50%)!important;
  -webkit-transform:translate(-50%,-50%)!important;

  border-radius:50%!important;

  opacity:0!important;
  visibility:hidden!important;

  pointer-events:none!important;
  z-index:1!important;

  box-shadow:
    0 0 0 0 rgba(var(--m7-live-red-rgb),0)!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-halo{
  opacity:1!important;
  visibility:visible!important;

  animation:
    m7ProfileLiveHalo
    1.75s
    ease-in-out
    infinite!important;

  -webkit-animation:
    m7ProfileLiveHalo
    1.75s
    ease-in-out
    infinite!important;
}

@keyframes m7ProfileLiveHalo{
  0%,100%{
    box-shadow:
      0 0 12px rgba(var(--m7-live-red-rgb),.18),
      0 0 24px rgba(var(--m7-live-red-rgb),.08);
    opacity:.66;
  }
  50%{
    box-shadow:
      0 0 20px rgba(var(--m7-live-red-rgb),.38),
      0 0 42px rgba(var(--m7-live-red-rgb),.16);
    opacity:1;
  }
}

@-webkit-keyframes m7ProfileLiveHalo{
  0%,100%{
    box-shadow:
      0 0 12px rgba(var(--m7-live-red-rgb),.18),
      0 0 24px rgba(var(--m7-live-red-rgb),.08);
    opacity:.66;
  }
  50%{
    box-shadow:
      0 0 20px rgba(var(--m7-live-red-rgb),.38),
      0 0 42px rgba(var(--m7-live-red-rgb),.16);
    opacity:1;
  }
}

/* Compact premium LIVE badge attached to the circle. */
#ma7alak-profile-shell #m7-profile-live-badge{
  position:absolute!important;

  left:50%!important;
  bottom:7px!important;

  transform:translateX(-50%)!important;
  -webkit-transform:translateX(-50%)!important;

  height:29px!important;
  min-width:70px!important;

  padding:0 11px!important;
  margin:0!important;

  display:none!important;
  align-items:center!important;
  justify-content:center!important;
  gap:6px!important;

  border:2px solid rgba(13,13,15,.94)!important;
  border-radius:999px!important;

  background:
    linear-gradient(
      135deg,
      #ff3154 0%,
      #ee153d 48%,
      #b80027 100%
    )!important;

  color:#fff!important;

  font-family:Arial,"Segoe UI",sans-serif!important;
  font-size:10px!important;
  font-weight:950!important;
  line-height:1!important;
  letter-spacing:1.05px!important;

  box-shadow:
    0 7px 20px rgba(0,0,0,.46),
    0 0 14px rgba(var(--m7-live-red-rgb),.28),
    inset 0 1px 0 rgba(255,255,255,.22)!important;

  pointer-events:none!important;
  z-index:95!important;

  box-sizing:border-box!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-badge{
  display:flex!important;
}

#ma7alak-profile-shell #m7-profile-live-badge .m7-live-dot{
  width:7px!important;
  height:7px!important;
  flex:0 0 7px!important;

  display:block!important;
  border-radius:50%!important;

  background:#fff!important;

  box-shadow:
    0 0 0 0 rgba(255,255,255,.42),
    0 0 8px rgba(255,255,255,.92)!important;

  animation:
    m7ProfileLiveDot
    1.05s
    ease-in-out
    infinite!important;

  -webkit-animation:
    m7ProfileLiveDot
    1.05s
    ease-in-out
    infinite!important;
}

@keyframes m7ProfileLiveDot{
  0%,100%{
    transform:scale(1);
    opacity:1;
    box-shadow:
      0 0 0 0 rgba(255,255,255,.35),
      0 0 8px rgba(255,255,255,.92);
  }
  50%{
    transform:scale(.78);
    opacity:.72;
    box-shadow:
      0 0 0 5px rgba(255,255,255,0),
      0 0 5px rgba(255,255,255,.68);
  }
}

/* Main profile image remains the button. Add only a tiny live response. */
#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-button{
  border-color:var(--m7-live-red)!important;

  box-shadow:
    0 0 0 1px rgba(var(--m7-live-red-rgb),.18),
    0 0 18px rgba(var(--m7-live-red-rgb),.20)!important;

  cursor:pointer!important;

  animation:none!important;
  -webkit-animation:none!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-button:active{
  transform:translateZ(0) scale(.985)!important;
  -webkit-transform:translateZ(0) scale(.985)!important;
}

/* ---------------------------------------------------------
   LIVE TAKES MAIN-CIRCLE VISUAL PRIORITY.
   Story remains loaded and accessible through the Story chip.
   This prevents red Live + gold Story animations from fighting.
--------------------------------------------------------- */

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-button::before,

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-button::after,

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live.story-has-new::after,

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-active-ring,

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-new-ring{
  animation:none!important;
  -webkit-animation:none!important;

  opacity:0!important;
  visibility:hidden!important;
}

/* Do not pulse the profile image for Story while the shop is LIVE. */
#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live
#ma7alak-story-preview img{
  animation:none!important;
  -webkit-animation:none!important;
  filter:none!important;
  -webkit-filter:none!important;
}

/* =========================================================
   LIVE + STORY SHORTCUT
   Lower-left counterpart to owner's + button.
========================================================= */

#ma7alak-profile-shell #m7-profile-story-shortcut{
  position:absolute!important;

  left:calc(50% - (var(--m7-profile-logo-size,210px) / 2) - 7px)!important;
  bottom:18px!important;

  min-width:62px!important;
  height:32px!important;

  padding:0 10px!important;
  margin:0!important;

  display:none!important;
  align-items:center!important;
  justify-content:center!important;
  gap:6px!important;

  border:
    1px solid
    rgba(238,194,99,.74)!important;

  border-radius:999px!important;

  background:
    linear-gradient(
      145deg,
      rgba(36,27,13,.97),
      rgba(11,10,9,.96)
    )!important;

  color:#f3cb72!important;

  font-family:Arial,"Segoe UI",sans-serif!important;
  font-size:9px!important;
  font-weight:950!important;
  line-height:1!important;
  letter-spacing:.55px!important;

  box-shadow:
    0 6px 18px rgba(0,0,0,.42),
    0 0 12px rgba(217,164,65,.15),
    inset 0 1px 0 rgba(255,238,188,.10)!important;

  backdrop-filter:blur(10px)!important;
  -webkit-backdrop-filter:blur(10px)!important;

  cursor:pointer!important;
  touch-action:manipulation!important;
  -webkit-tap-highlight-color:transparent!important;

  user-select:none!important;
  -webkit-user-select:none!important;

  z-index:105!important;
  box-sizing:border-box!important;

  transition:
    transform .14s ease,
    border-color .16s ease,
    box-shadow .16s ease!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-video-live.story-has-story
#m7-profile-story-shortcut{
  display:flex!important;
}

#ma7alak-profile-shell #m7-profile-story-shortcut .m7-story-chip-ring{
  width:12px!important;
  height:12px!important;
  flex:0 0 12px!important;

  display:block!important;
  border-radius:50%!important;

  border:2px solid #e5b753!important;

  box-shadow:
    0 0 7px rgba(217,164,65,.35)!important;

  position:relative!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.story-has-new
#m7-profile-story-shortcut .m7-story-chip-ring::after{
  content:""!important;

  position:absolute!important;
  inset:2px!important;

  border-radius:50%!important;
  background:#f0c766!important;

  box-shadow:
    0 0 7px rgba(217,164,65,.58)!important;

  animation:
    m7StoryChipPulse
    1.4s
    ease-in-out
    infinite!important;

  -webkit-animation:
    m7StoryChipPulse
    1.4s
    ease-in-out
    infinite!important;
}

@keyframes m7StoryChipPulse{
  0%,100%{
    opacity:.62;
    transform:scale(.78);
  }
  50%{
    opacity:1;
    transform:scale(1);
  }
}

#ma7alak-profile-shell #m7-profile-story-shortcut:active{
  transform:scale(.93)!important;
  -webkit-transform:scale(.93)!important;
}

/* Brief visual acknowledgement while the existing Live viewer opens. */
#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-live-opening
#ma7alak-story-button{
  filter:brightness(.86)!important;
  -webkit-filter:brightness(.86)!important;
}

#ma7alak-profile-shell
#ma7alak-story-wrapper.m7-profile-live-opening
#m7-profile-live-badge{
  transform:translateX(-50%) scale(.96)!important;
  -webkit-transform:translateX(-50%) scale(.96)!important;
}

/* Verified badge and owner + stay above all decorative Live visuals. */
#ma7alak-profile-shell #ma7alak-profile-verified-badge{
  z-index:115!important;
}

#ma7alak-profile-shell #ma7alak-owner-add-story{
  z-index:120!important;
}

/* Phone tuning. */
@media(max-width:600px){
  #ma7alak-profile-shell #m7-profile-live-ring{
    width:calc(var(--m7-profile-logo-size,210px) + 13px)!important;
    height:calc(var(--m7-profile-logo-size,210px) + 13px)!important;
  }

  #ma7alak-profile-shell #m7-profile-live-badge{
    height:28px!important;
    min-width:68px!important;
    padding:0 10px!important;
    bottom:7px!important;
    font-size:9.5px!important;
  }

  #ma7alak-profile-shell #m7-profile-story-shortcut{
    left:calc(50% - (var(--m7-profile-logo-size,210px) / 2) - 6px)!important;
    bottom:18px!important;
    min-width:61px!important;
    height:32px!important;
    padding:0 9px!important;
    font-size:8.8px!important;
  }
}

@media(max-width:380px){
  #ma7alak-profile-shell #m7-profile-story-shortcut{
    min-width:58px!important;
    padding:0 8px!important;
  }

  #ma7alak-profile-shell #m7-profile-live-badge{
    min-width:65px!important;
  }
}

/* Global motion OFF / reduced remains authoritative. */
#ma7alak-profile-shell[data-motion-mode="off"]
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-ring,

#ma7alak-profile-shell[data-motion-mode="off"]
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-halo,

#ma7alak-profile-shell[data-motion-mode="off"]
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-badge .m7-live-dot,

#ma7alak-profile-shell[data-motion-mode="reduced"]
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-ring,

#ma7alak-profile-shell[data-motion-mode="reduced"]
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-halo,

#ma7alak-profile-shell[data-motion-mode="reduced"]
#ma7alak-story-wrapper.m7-profile-video-live
#m7-profile-live-badge .m7-live-dot{
  animation:none!important;
  -webkit-animation:none!important;
}
`;

    document.head.appendChild(style);
  }

  function ensureUi() {
    var wrapper = getWrapper();
    var storyButton = getStoryButton();

    if (!wrapper || !storyButton) {
      return false;
    }

    if (!document.getElementById("m7-profile-live-halo")) {
      var halo = document.createElement("div");
      halo.id = "m7-profile-live-halo";
      halo.setAttribute("aria-hidden", "true");
      wrapper.insertBefore(halo, storyButton);
    }

    if (!document.getElementById("m7-profile-live-ring")) {
      var ring = document.createElement("div");
      ring.id = "m7-profile-live-ring";
      ring.setAttribute("aria-hidden", "true");
      wrapper.insertBefore(ring, storyButton);
    }

    if (!document.getElementById("m7-profile-live-badge")) {
      var badge = document.createElement("div");
      badge.id = "m7-profile-live-badge";
      badge.setAttribute("aria-hidden", "true");
      badge.innerHTML =
        '<i class="m7-live-dot"></i><span>LIVE</span>';

      wrapper.appendChild(badge);
    }

    if (!document.getElementById("m7-profile-story-shortcut")) {
      var shortcut = document.createElement("button");

      shortcut.id = "m7-profile-story-shortcut";
      shortcut.type = "button";
      shortcut.setAttribute(
        "aria-label",
        "View shop stories"
      );

      shortcut.innerHTML =
        '<span class="m7-story-chip-ring" aria-hidden="true"></span>' +
        '<span>STORY</span>';

      wrapper.appendChild(shortcut);

      shortcut.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          if (!storyExists()) return;

          var button = getStoryButton();
          if (!button) return;

          state.forceStoryClick = true;

          try {
            /*
              Keep this synchronous inside the real user click.
              That preserves the current Story viewer's fullscreen behavior
              on browsers that require a direct user activation.
            */
            button.click();
          } catch (error) {
            console.error(
              "SHOUFHON profile Story shortcut:",
              error
            );
          } finally {
            state.forceStoryClick = false;
          }
        },
        true
      );
    }

    return true;
  }

  function extractVideoFromItems(items) {
    if (!Array.isArray(items)) return null;

    for (var i = 0; i < items.length; i++) {
      var item = items[i] || {};

      var itemSlug = cleanSlug(item.shop_slug);

      if (itemSlug !== state.slug) continue;

      var isVideo =
        item.is_video_live === true ||
        String(item.post_type || "").toLowerCase() === "video_live" ||
        String(item.id || "").indexOf("video:") === 0;

      if (!isVideo) continue;

      var streamId = String(
        item.stream_id ||
        (
          String(item.id || "").indexOf("video:") === 0
            ? String(item.id).slice(6)
            : ""
        ) ||
        ""
      ).trim();

      if (!streamId) continue;

      return {
        id: String(item.id || "video:" + streamId),
        stream_id: streamId,
        shop_slug: itemSlug,
        shop_name: String(item.shop_name || ""),
        title: String(item.title || "Live now"),
        profile_image_url: String(
          item.profile_image_url ||
          item.media_url ||
          ""
        )
      };
    }

    return null;
  }

  function normalizeStream(stream) {
    if (!stream || typeof stream !== "object") {
      return null;
    }

    var slug = cleanSlug(stream.shop_slug);

    if (slug && slug !== state.slug) {
      return null;
    }

    var streamId = String(
      stream.stream_id ||
      stream.id ||
      ""
    ).trim();

    if (streamId.indexOf("video:") === 0) {
      streamId = streamId.slice(6);
    }

    if (!streamId) {
      return null;
    }

    return {
      id: String(stream.id || streamId),
      stream_id: streamId,
      shop_slug: state.slug,
      shop_name: String(stream.shop_name || ""),
      title: String(stream.title || "Live now"),
      profile_image_url: String(
        stream.profile_image_url ||
        stream.media_url ||
        ""
      )
    };
  }

  function render() {
    var wrapper = getWrapper();
    var storyButton = getStoryButton();

    if (!wrapper || !storyButton) return;

    var live = !!state.stream;
    var hasStory = storyExists();

    wrapper.classList.toggle(
      "m7-profile-video-live",
      live
    );

    wrapper.toggleAttribute(
      "data-video-live",
      live
    );

    if (live) {
      wrapper.setAttribute(
        "data-live-stream-id",
        String(state.stream.stream_id || "")
      );

      storyButton.setAttribute(
        "aria-label",
        hasStory
          ? "Watch live broadcast. Story also available."
          : "Watch live broadcast"
      );

      storyButton.setAttribute(
        "title",
        "Watch Live"
      );
    } else {
      wrapper.removeAttribute("data-live-stream-id");

      storyButton.setAttribute(
        "aria-label",
        "View stories"
      );

      storyButton.removeAttribute("title");
    }

    var shortcut = document.getElementById(
      "m7-profile-story-shortcut"
    );

    if (shortcut) {
      shortcut.hidden = !(live && hasStory);

      if (live && hasStory) {
        shortcut.removeAttribute("aria-hidden");
      } else {
        shortcut.setAttribute("aria-hidden", "true");
      }
    }

    try {
      window.dispatchEvent(
        new CustomEvent(
          "shoufhon:profile-live-state",
          {
            detail: {
              shop_slug: state.slug,
              live: live,
              stream: state.stream,
              has_story: hasStory
            }
          }
        )
      );
    } catch (_) {}
  }

  function applyStateMessage(data) {
    if (
      !data ||
      data.type !== "MA7ALAK_LIVE_OFFERS_STATE"
    ) {
      return false;
    }

    var messageSlug = cleanSlug(data.shopSlug);

    /*
      Shop-specific reply from MA7ALAK_LIVE_OFFERS_GET.
      This is the most precise state.
    */
    if (messageSlug) {
      if (messageSlug !== state.slug) {
        return false;
      }

      state.stream =
        data.broadcastLive === true
          ? normalizeStream(data.stream)
          : null;

      render();

      return true;
    }

    /*
      Global broadcast from the parent Live system.
      Its items array contains all live posts including video:<stream id>.
      This is what makes the profile circle react immediately when another
      device starts or ends the shop's broadcast.
    */
    state.stream =
      extractVideoFromItems(data.items);

    render();

    return true;
  }

  function requestState() {
    if (!state.slug) {
      state.slug = detectSlug();
    }

    if (!state.slug) return;

    try {
      parentWindow().postMessage(
        {
          type: "MA7ALAK_LIVE_OFFERS_GET",
          shopSlug: state.slug
        },
        "*"
      );
    } catch (_) {}
  }

  function clearOpeningState() {
    state.openingLive = false;

    if (state.openResetTimer) {
      clearTimeout(state.openResetTimer);
      state.openResetTimer = 0;
    }

    var wrapper = getWrapper();

    if (wrapper) {
      wrapper.classList.remove(
        "m7-profile-live-opening"
      );
    }
  }

  function openLive() {
    if (!state.stream || state.openingLive) {
      return false;
    }

    state.openingLive = true;

    var wrapper = getWrapper();

    if (wrapper) {
      wrapper.classList.add(
        "m7-profile-live-opening"
      );
    }

    state.openResetTimer = window.setTimeout(
      clearOpeningState,
      1600
    );

    /*
      Fast same-origin path when available.
      This opens the EXACT existing Agora viewer used by homepage Live.
    */
    try {
      var host = parentWindow();

      if (
        host &&
        host.ShoufHonLiveVideo &&
        typeof host.ShoufHonLiveVideo.open === "function" &&
        state.stream.stream_id
      ) {
        Promise.resolve(
          host.ShoufHonLiveVideo.open(
            state.stream.stream_id
          )
        )
          .catch(function (error) {
            console.warn(
              "SHOUFHON profile direct Live open:",
              error
            );

            requestState();
          })
          .finally(clearOpeningState);

        return true;
      }
    } catch (_) {}

    /*
      Hostinger iframe path.
      ma7alak-live-offers.js receives this and calls the same
      window.ShoufHonLiveVideo.open(...) viewer without navigating pages.
    */
    try {
      parentWindow().postMessage(
        {
          type: "MA7ALAK_LIVE_VIDEO_OPEN_SHOP",
          shopSlug: state.slug,
          streamId: String(
            state.stream.stream_id ||
            ""
          )
        },
        "*"
      );

      return true;
    } catch (error) {
      clearOpeningState();

      console.error(
        "SHOUFHON profile Live open:",
        error
      );

      return false;
    }
  }

  function bindMainCircle() {
    var storyButton = getStoryButton();

    if (!storyButton) return;

    if (storyButton.dataset.m7ProfileLiveBound === "1") {
      return;
    }

    storyButton.dataset.m7ProfileLiveBound = "1";

    /*
      Capture phase deliberately runs before the existing Story click handler.
      Only intercept while Live is active. When Live is off, the old Story
      code is untouched.
    */
    storyButton.addEventListener(
      "click",
      function (event) {
        if (
          state.forceStoryClick ||
          !state.stream
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        openLive();
      },
      true
    );
  }

  function watchStoryClass() {
    var wrapper = getWrapper();

    if (
      !wrapper ||
      state.storyClassObserver
    ) {
      return;
    }

    state.storyClassObserver =
      new MutationObserver(
        function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            if (
              mutations[i].type === "attributes" &&
              mutations[i].attributeName === "class"
            ) {
              render();
              break;
            }
          }
        }
      );

    state.storyClassObserver.observe(
      wrapper,
      {
        attributes: true,
        attributeFilter: ["class"]
      }
    );
  }

  function bindMessages() {
    window.addEventListener(
      "message",
      function (event) {
        if (!isTrustedSource(event.source)) {
          return;
        }

        applyStateMessage(event.data);
      }
    );
  }

  function bindWakeRefresh() {
    window.addEventListener(
      "pageshow",
      requestState
    );

    window.addEventListener(
      "focus",
      requestState
    );

    document.addEventListener(
      "visibilitychange",
      function () {
        if (
          document.visibilityState === "visible"
        ) {
          requestState();
        }
      }
    );

    /*
      Low-frequency recovery only.
      Realtime/broadcast messages are the primary path.
    */
    window.setInterval(
      function () {
        if (
          document.visibilityState === "visible"
        ) {
          requestState();
        }
      },
      60000
    );
  }

  function start() {
    if (state.booted) return;

    state.slug = detectSlug();

    var attempts = 0;

    function tryBoot() {
      attempts += 1;

      if (!state.slug) {
        state.slug = detectSlug();
      }

      if (
        !state.slug ||
        !getWrapper() ||
        !getStoryButton()
      ) {
        if (attempts < 80) {
          window.setTimeout(
            tryBoot,
            attempts < 20 ? 100 : 250
          );
        }

        return;
      }

      state.booted = true;

      injectCss();
      ensureUi();
      bindMainCircle();
      watchStoryClass();
      bindMessages();
      bindWakeRefresh();

      render();
      requestState();

      /*
        Ask once more after the parent Live scripts have had time to finish
        booting on a cold page load.
      */
      window.setTimeout(
        requestState,
        650
      );

      window.setTimeout(
        requestState,
        1800
      );
    }

    tryBoot();
  }

  start();
})();
