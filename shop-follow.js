/* =========================================================
   MA7ALAK — SHOP FOLLOW V1 (LIVE)
   File: shop-follow.js

   ✓ One global file for all shop pages
   ✓ Detects shop slug from URL
   ✓ Uses existing ma7alak_visitor_id when available
   ✓ Follow / Following updates instantly
   ✓ Follower count updates instantly
   ✓ Cross-device/tab live count through Supabase Realtime
   ✓ Lightweight fallback sync
   ✓ Does NOT modify Stories / Reels / Bell / Story Likes

   REQUIRED SQL:
   MA7ALAK-FOLLOW-V1-SQL.txt
========================================================= */

(function () {
  "use strict";

  if (window.__MA7ALAK_SHOP_FOLLOW_V1_LOADED__) return;
  window.__MA7ALAK_SHOP_FOLLOW_V1_LOADED__ = true;

  /* =========================================================
     CONFIG
  ========================================================= */

  var SUPABASE_URL = "https://wdtaiuwtqdepzdamgsrs.supabase.co";
  var SUPABASE_KEY = "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  var VISITOR_ID_KEY = "ma7alak_visitor_id";
  var FOLLOW_ROOT_ID = "ma7alak-shop-follow-root";

  /* If realtime is interrupted, quietly re-check the count. */
  var FALLBACK_SYNC_MS = 15000;

  /* =========================================================
     PAGE / SHOP DETECTION
  ========================================================= */

  function getShopSlug() {
    var explicit =
      document.documentElement.getAttribute("data-ma7alak-shop-slug") ||
      document.body && document.body.getAttribute("data-ma7alak-shop-slug");

    if (explicit) return String(explicit).trim();

    var path = String(window.location.pathname || "")
      .replace(/^\/+|\/+$/g, "");

    if (!path || path.indexOf("/") !== -1) return "";

    try {
      return decodeURIComponent(path);
    } catch (_) {
      return path;
    }
  }

  var SHOP_SLUG = getShopSlug();

  /*
    Do not inject on known non-shop pages.
    The database RPC also verifies that SHOP_SLUG exists in shop_profiles.
  */
  var RESERVED_PATHS = {
    "": true,
    "admin": true,
    "dhyf-mhlk-": true,
    "shwf-almhlat-": true
  };

  if (!SHOP_SLUG || RESERVED_PATHS[SHOP_SLUG.toLowerCase()]) return;

  /* =========================================================
     VISITOR ID
  ========================================================= */

  function randomPart() {
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.prototype.map.call(bytes, function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    }

    return (
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2)
    );
  }

  function getVisitorId() {
    var current = "";

    try {
      current = String(localStorage.getItem(VISITOR_ID_KEY) || "").trim();
    } catch (_) {}

    if (current && current.length >= 8 && current.length <= 200) {
      return current;
    }

    var created =
      "v_" +
      Date.now().toString(36) +
      "_" +
      randomPart();

    try {
      localStorage.setItem(VISITOR_ID_KEY, created);
    } catch (_) {}

    return created;
  }

  var VISITOR_ID = getVisitorId();

  /* =========================================================
     SUPABASE
  ========================================================= */

  function waitForSupabase(timeoutMs) {
    timeoutMs = timeoutMs || 10000;

    return new Promise(function (resolve, reject) {
      var started = Date.now();

      (function check() {
        if (
          window.supabase &&
          typeof window.supabase.createClient === "function"
        ) {
          resolve(window.supabase);
          return;
        }

        if (Date.now() - started >= timeoutMs) {
          reject(new Error("Supabase library not available"));
          return;
        }

        setTimeout(check, 100);
      })();
    });
  }

  var client = null;

  /* =========================================================
     STYLE
  ========================================================= */

  function injectStyle() {
    if (document.getElementById("ma7alak-shop-follow-style")) return;

    var style = document.createElement("style");
    style.id = "ma7alak-shop-follow-style";
    style.textContent = `
      #${FOLLOW_ROOT_ID}{
        width:min(100%,560px);
        box-sizing:border-box;
        margin:12px auto 14px;
        padding:0 12px;
        position:relative;
        z-index:25;
        font-family:Arial,Helvetica,sans-serif;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-card{
        width:100%;
        min-height:62px;
        box-sizing:border-box;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:9px 10px 9px 14px;
        border:1px solid rgba(217,164,65,.25);
        border-radius:18px;
        background:
          linear-gradient(135deg,rgba(27,27,27,.97),rgba(13,13,13,.98));
        box-shadow:
          0 10px 30px rgba(0,0,0,.25),
          inset 0 1px 0 rgba(255,255,255,.025);
        color:#fff;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-info{
        min-width:0;
        display:flex;
        flex-direction:column;
        justify-content:center;
        gap:3px;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-count{
        color:#f4f4f4;
        font-size:14px;
        line-height:1.2;
        font-weight:800;
        white-space:nowrap;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-hint{
        color:rgba(255,255,255,.55);
        font-size:11px;
        line-height:1.2;
        white-space:nowrap;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-btn{
        min-width:126px;
        height:43px;
        flex:0 0 auto;
        border:1px solid rgba(217,164,65,.65);
        border-radius:14px;
        padding:0 17px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        cursor:pointer;
        touch-action:manipulation;
        -webkit-tap-highlight-color:transparent;
        background:
          linear-gradient(135deg,#d9a441,#b8781e);
        color:#111;
        font-size:14px;
        line-height:1;
        font-weight:900;
        box-shadow:
          0 6px 18px rgba(217,164,65,.14),
          inset 0 1px 0 rgba(255,255,255,.22);
        transition:
          transform .16s ease,
          background .18s ease,
          border-color .18s ease,
          color .18s ease,
          box-shadow .18s ease;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-btn:active{
        transform:scale(.96);
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-btn.is-following{
        background:rgba(255,255,255,.055);
        color:#f4c96f;
        border-color:rgba(217,164,65,.34);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.015);
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-btn.is-busy{
        opacity:.68;
        cursor:wait;
        pointer-events:none;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-btn-icon{
        font-size:16px;
        line-height:1;
      }

      #${FOLLOW_ROOT_ID}.ma7alak-follow-loading{
        opacity:.72;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-error{
        display:none;
        margin-top:7px;
        padding:7px 10px;
        border-radius:10px;
        background:rgba(190,45,45,.12);
        border:1px solid rgba(255,80,80,.22);
        color:#ff9d9d;
        font-size:11px;
        line-height:1.35;
        text-align:center;
      }

      #${FOLLOW_ROOT_ID} .ma7alak-follow-error.visible{
        display:block;
      }

      @media(max-width:600px){
        #${FOLLOW_ROOT_ID}{
          width:100%;
          margin:10px auto 12px;
          padding:0 10px;
        }

        #${FOLLOW_ROOT_ID} .ma7alak-follow-card{
          min-height:58px;
          border-radius:16px;
          padding:8px 8px 8px 12px;
          gap:8px;
        }

        #${FOLLOW_ROOT_ID} .ma7alak-follow-btn{
          min-width:116px;
          height:41px;
          padding:0 14px;
          border-radius:13px;
          font-size:13px;
        }

        #${FOLLOW_ROOT_ID} .ma7alak-follow-count{
          font-size:13px;
        }

        #${FOLLOW_ROOT_ID} .ma7alak-follow-hint{
          font-size:10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     UI
  ========================================================= */

  var root = null;
  var button = null;
  var buttonIcon = null;
  var buttonText = null;
  var countText = null;
  var errorBox = null;

  var following = false;
  var followerCount = 0;
  var busy = false;
  var initialized = false;

  function followerLabel(count) {
    count = Math.max(0, Number(count) || 0);

    if (count === 1) return "1 Follower";
    return count.toLocaleString("en-US") + " Followers";
  }

  function render() {
    if (!root) return;

    countText.textContent = followerLabel(followerCount);

    if (following) {
      button.classList.add("is-following");
      buttonIcon.textContent = "✓";
      buttonText.textContent = "Following";
      button.setAttribute("aria-label", "Unfollow this shop");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("is-following");
      buttonIcon.textContent = "+";
      buttonText.textContent = "Follow";
      button.setAttribute("aria-label", "Follow this shop");
      button.setAttribute("aria-pressed", "false");
    }

    button.classList.toggle("is-busy", busy);
    button.disabled = busy;

    root.classList.toggle("ma7alak-follow-loading", !initialized);
  }

  function showError(message) {
    if (!errorBox) return;

    errorBox.textContent =
      message || "Follow is temporarily unavailable. Please try again.";

    errorBox.classList.add("visible");

    clearTimeout(showError._timer);
    showError._timer = setTimeout(function () {
      if (errorBox) errorBox.classList.remove("visible");
    }, 3500);
  }

  function buildUI() {
    if (document.getElementById(FOLLOW_ROOT_ID)) {
      root = document.getElementById(FOLLOW_ROOT_ID);
      return;
    }

    root = document.createElement("div");
    root.id = FOLLOW_ROOT_ID;
    root.className = "ma7alak-follow-loading";

    root.innerHTML = `
      <div class="ma7alak-follow-card">
        <div class="ma7alak-follow-info">
          <div class="ma7alak-follow-count">Followers</div>
          <div class="ma7alak-follow-hint">Stay connected with this shop</div>
        </div>

        <button
          class="ma7alak-follow-btn"
          type="button"
          aria-pressed="false"
        >
          <span class="ma7alak-follow-btn-icon">+</span>
          <span class="ma7alak-follow-btn-text">Follow</span>
        </button>
      </div>

      <div class="ma7alak-follow-error" role="status"></div>
    `;

    /*
      Preferred location: immediately after the existing Story circle.
      This avoids changing the Story code itself.
    */
    var storyWrapper = document.getElementById("ma7alak-story-wrapper");

    if (storyWrapper && storyWrapper.parentNode) {
      storyWrapper.insertAdjacentElement("afterend", root);
    } else {
      /*
        Safe fallback if a shop page has no Story block.
        Put it near the beginning of the visible page.
      */
      var main =
        document.querySelector("main") ||
        document.querySelector('[role="main"]') ||
        document.body;

      if (main.firstChild) {
        main.insertBefore(root, main.firstChild);
      } else {
        main.appendChild(root);
      }
    }

    button = root.querySelector(".ma7alak-follow-btn");
    buttonIcon = root.querySelector(".ma7alak-follow-btn-icon");
    buttonText = root.querySelector(".ma7alak-follow-btn-text");
    countText = root.querySelector(".ma7alak-follow-count");
    errorBox = root.querySelector(".ma7alak-follow-error");

    button.addEventListener("click", toggleFollow);
  }

  /* =========================================================
     RPC HELPERS
  ========================================================= */

  function firstRpcRow(data) {
    if (Array.isArray(data)) return data[0] || null;
    return data || null;
  }

  async function loadState(options) {
    options = options || {};

    if (!client) return;

    var result = await client.rpc("get_shop_follow_state", {
      p_shop_slug: SHOP_SLUG,
      p_visitor_id: VISITOR_ID
    });

    if (result.error) {
      /*
        If this URL is not actually a shop, RPC may return Shop-related
        errors. In that case remove the injected control.
      */
      if (!initialized && root) {
        root.remove();
        root = null;
      }

      if (!options.silent) {
        console.warn("[Ma7alak Follow] State error:", result.error);
      }
      return;
    }

    var row = firstRpcRow(result.data);

    if (!row) return;

    following = !!row.following;
    followerCount = Math.max(0, Number(row.follower_count) || 0);
    initialized = true;
    render();
  }

  async function loadCountOnly() {
    if (!client || busy) return;

    var result = await client.rpc("get_shop_follower_count", {
      p_shop_slug: SHOP_SLUG
    });

    if (result.error) return;

    var nextCount = Math.max(0, Number(result.data) || 0);

    if (nextCount !== followerCount) {
      followerCount = nextCount;
      render();
    }
  }

  /* =========================================================
     FOLLOW / UNFOLLOW
     Optimistic UI = instant response on the phone.
  ========================================================= */

  async function toggleFollow() {
    if (!client || busy || !initialized) return;

    busy = true;

    var previousFollowing = following;
    var previousCount = followerCount;

    /*
      Update immediately before waiting for the network.
    */
    following = !previousFollowing;

    if (following) {
      followerCount = previousCount + 1;
    } else {
      followerCount = Math.max(0, previousCount - 1);
    }

    render();

    var functionName = following ? "follow_shop" : "unfollow_shop";

    try {
      var result = await client.rpc(functionName, {
        p_shop_slug: SHOP_SLUG,
        p_visitor_id: VISITOR_ID
      });

      if (result.error) throw result.error;

      var row = firstRpcRow(result.data);

      if (row) {
        following = !!row.following;
        followerCount = Math.max(0, Number(row.follower_count) || 0);
      }

      busy = false;
      render();

      /*
        Tell any other Ma7alak scripts on this page that the follow
        relationship changed. Useful later for notifications/feed.
      */
      try {
        window.dispatchEvent(
          new CustomEvent("ma7alak:follow-changed", {
            detail: {
              shopSlug: SHOP_SLUG,
              following: following,
              followerCount: followerCount
            }
          })
        );
      } catch (_) {}

    } catch (error) {
      following = previousFollowing;
      followerCount = previousCount;
      busy = false;
      render();

      console.warn("[Ma7alak Follow] Toggle error:", error);
      showError("Couldn't update Follow. Please try again.");
    }
  }

  /* =========================================================
     REALTIME
     Listen for INSERT / DELETE on this shop's follow rows.

     IMPORTANT:
     Supabase Realtime publication must include shop_follows.
     The SQL patch provided with this JS enables it.
  ========================================================= */

  var realtimeChannel = null;

  function startRealtime() {
    if (!client || realtimeChannel) return;

    realtimeChannel = client
      .channel(
        "ma7alak-follow-" +
        SHOP_SLUG.replace(/[^A-Za-z0-9_-]/g, "_") +
        "-" +
        Math.random().toString(36).slice(2, 8)
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shop_follows",
          filter: "shop_slug=eq." + SHOP_SLUG
        },
        function () {
          /*
            We intentionally ask the server for the authoritative count.
            This handles multiple simultaneous follows/unfollows safely.
          */
          loadCountOnly();
        }
      )
      .subscribe(function (status) {
        if (status === "CHANNEL_ERROR") {
          console.warn("[Ma7alak Follow] Realtime channel error");
        }
      });
  }

  /* =========================================================
     LIVE FALLBACK
  ========================================================= */

  var fallbackTimer = null;

  function startFallbackSync() {
    if (fallbackTimer) return;

    fallbackTimer = setInterval(function () {
      if (document.visibilityState === "visible") {
        loadCountOnly();
      }
    }, FALLBACK_SYNC_MS);

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        loadState({ silent: true });
      }
    });
  }

  /* =========================================================
     CLEANUP
  ========================================================= */

  window.addEventListener("pagehide", function () {
    if (fallbackTimer) {
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }

    if (client && realtimeChannel) {
      try {
        client.removeChannel(realtimeChannel);
      } catch (_) {}
      realtimeChannel = null;
    }
  });

  /* =========================================================
     START
  ========================================================= */

  async function start() {
    injectStyle();
    buildUI();

    try {
      var supabaseLib = await waitForSupabase();

      client = supabaseLib.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

      await loadState();

      if (!root || !initialized) return;

      startRealtime();
      startFallbackSync();

    } catch (error) {
      console.warn("[Ma7alak Follow] Startup error:", error);

      if (root) {
        showError("Follow is temporarily unavailable.");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

})();