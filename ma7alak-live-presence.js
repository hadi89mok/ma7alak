/*
=========================================================
MA7ALAK — UNIVERSAL LIVE PRESENCE + STATS ENGINE
ONE FILE FOR THE ENTIRE WEBSITE
=========================================================

WHAT IT DOES
------------
• Runs website presence on every Ma7alak page.
• Auto-detects whether the current URL is a real shop page by checking shop_profiles.
• If it is a shop page, also runs:
    - record_shop_view
    - update_shop_presence
    - get_shop_stats
    - get_shop_online
• Updates homepage stats IDs if/when they exist:
    - ma7alak-web-online
    - ma7alak-shop-online
    - ma7alak-web-total
• Updates shop stats IDs if/when they exist:
    - ma7alak-online
    - ma7alak-week
    - ma7alak-today
    - ma7alak-total
• Does NOT depend on scrolling or the stats box loading.
• Keeps running even if the visual stats section is lazy-loaded later.
• Uses the existing Ma7alak RPC functions.
• Optional immediate-leave RPCs are called if you install the supplied SQL:
    - leave_website_presence
    - leave_shop_presence
• If those optional leave RPCs are not installed yet, normal heartbeat expiry still works.
=========================================================
*/

(function () {
  "use strict";

  if (window.__MA7ALAK_UNIVERSAL_LIVE_ENGINE__) {
    return;
  }

  window.__MA7ALAK_UNIVERSAL_LIVE_ENGINE__ = true;

  const SUPABASE_URL =
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

  const HEARTBEAT_MS = 2000;
  const STATS_REFRESH_MS = 2000;

  let client = null;
  let detectedShopSlug = "";
  let shopDetectionFinished = false;
  let stopped = false;
  let heartbeatTimer = null;
  let statsTimer = null;
  let domObserver = null;

  let latestWebsiteStats = {
    online: 0,
    total: 0,
    shopsOnline: 0
  };

  let latestShopStats = {
    online: 0,
    week: 0,
    today: 0,
    total: 0
  };


  /* =========================================================
     SMALL HELPERS
  ========================================================= */

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function numberValue(value) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function createId() {
    try {
      if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
      ) {
        return window.crypto.randomUUID();
      }
    } catch (error) {}

    return (
      "visitor_" +
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2)
    );
  }

  function getStoredId(key) {
    let id = "";

    try {
      id = localStorage.getItem(key) || "";
    } catch (error) {}

    if (!id) {
      id = createId();

      try {
        localStorage.setItem(key, id);
      } catch (error) {}
    }

    return id;
  }

  /*
    KEEP THE SAME EXISTING STORAGE KEYS.
    This avoids changing your current unique-view behavior.
  */
  const websiteVisitorId =
    getStoredId("ma7alak_website_visitor_id");

  const shopVisitorId =
    getStoredId("ma7alak_visitor_id");


  /* =========================================================
     CURRENT URL -> POSSIBLE SHOP SLUG
  ========================================================= */

  function getCurrentPathSlug() {
    let path = "";

    try {
      path =
        decodeURIComponent(
          window.location.pathname || ""
        );
    } catch (error) {
      path = window.location.pathname || "";
    }

    path =
      path
        .replace(/^\/+|\/+$/g, "")
        .trim();

    if (!path) {
      return "";
    }

    const parts =
      path
        .split("/")
        .filter(Boolean);

    if (!parts.length) {
      return "";
    }

    return text(parts[parts.length - 1]).toLowerCase();
  }


  /* =========================================================
     LOAD SUPABASE
  ========================================================= */

  function loadSupabase() {
    return new Promise(function (resolve, reject) {

      if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
      ) {
        resolve(window.supabase);
        return;
      }

      const existing =
        document.querySelector(
          'script[src*="@supabase/supabase-js"]'
        );

      if (existing) {
        let attempts = 0;

        const timer =
          setInterval(
            function () {
              attempts++;

              if (
                window.supabase &&
                typeof window.supabase.createClient === "function"
              ) {
                clearInterval(timer);
                resolve(window.supabase);
                return;
              }

              if (attempts >= 50) {
                clearInterval(timer);
                reject(
                  new Error("SUPABASE_LOAD_TIMEOUT")
                );
              }
            },
            100
          );

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

      script.async = true;

      script.onload = function () {
        if (
          window.supabase &&
          typeof window.supabase.createClient === "function"
        ) {
          resolve(window.supabase);
        } else {
          reject(
            new Error("SUPABASE_LOAD_FAILED")
          );
        }
      };

      script.onerror = function () {
        reject(
          new Error("SUPABASE_LOAD_FAILED")
        );
      };

      (
        document.head ||
        document.documentElement
      ).appendChild(script);
    });
  }


  /* =========================================================
     AUTO-DETECT REAL SHOP PAGE
     NO HARDCODED SHOP LIST
  ========================================================= */

  async function detectShop() {
    if (!client) {
      shopDetectionFinished = true;
      return "";
    }

    const candidate =
      getCurrentPathSlug();

    if (!candidate) {
      shopDetectionFinished = true;
      return "";
    }

    try {
      const result =
        await client
          .from("shop_profiles")
          .select("shop_slug")
          .eq("shop_slug", candidate)
          .limit(1);

      if (
        !result.error &&
        Array.isArray(result.data) &&
        result.data.length
      ) {
        detectedShopSlug =
          text(result.data[0].shop_slug);
      }
    } catch (error) {}

    shopDetectionFinished = true;

    return detectedShopSlug;
  }


  /* =========================================================
     WEBSITE VISIT — EXISTING ONCE-PER-DAY BEHAVIOR
  ========================================================= */

  async function recordWebsiteVisitOncePerDay() {
    if (!client || stopped) return;

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    let lastVisit = "";

    try {
      lastVisit =
        localStorage.getItem(
          "ma7alak_last_website_visit"
        ) || "";
    } catch (error) {}

    if (lastVisit === today) {
      return;
    }

    try {
      const result =
        await client.rpc(
          "record_website_visit",
          {
            p_visitor_id:
              websiteVisitorId
          }
        );

      if (!result.error) {
        try {
          localStorage.setItem(
            "ma7alak_last_website_visit",
            today
          );
        } catch (error) {}
      }
    } catch (error) {}
  }


  /* =========================================================
     WEBSITE PRESENCE
  ========================================================= */

  async function updateWebsitePresence() {
    if (!client || stopped) return;

    try {
      await client.rpc(
        "update_website_presence",
        {
          p_visitor_id:
            websiteVisitorId
        }
      );
    } catch (error) {}
  }


  /* =========================================================
     SHOP VIEW + PRESENCE
  ========================================================= */

  async function recordShopView() {
    if (
      !client ||
      stopped ||
      !detectedShopSlug
    ) {
      return;
    }

    try {
      await client.rpc(
        "record_shop_view",
        {
          p_shop_id:
            detectedShopSlug,

          p_visitor_id:
            shopVisitorId
        }
      );
    } catch (error) {}
  }

  async function updateShopPresence() {
    if (
      !client ||
      stopped ||
      !detectedShopSlug
    ) {
      return;
    }

    try {
      await client.rpc(
        "update_shop_presence",
        {
          p_shop_id:
            detectedShopSlug,

          p_visitor_id:
            shopVisitorId
        }
      );
    } catch (error) {}
  }


  /* =========================================================
     LOAD WEBSITE STATS
  ========================================================= */

  async function loadWebsiteStats() {
    if (!client || stopped) return;

    try {
      const result =
        await client.rpc(
          "get_website_stats"
        );

      if (
        !result.error &&
        result.data
      ) {
        let row = result.data;

        if (Array.isArray(row)) {
          row = row[0] || {};
        }

        latestWebsiteStats.online =
          numberValue(
            row.online ??
            row.online_count ??
            row.visitors_online ??
            0
          );

        latestWebsiteStats.total =
          numberValue(
            row.total ??
            row.total_visits ??
            row.total_views ??
            0
          );
      }
    } catch (error) {}
  }

  async function loadAllShopsOnline() {
    if (!client || stopped) return;

    try {
      const result =
        await client.rpc(
          "get_all_shops_online"
        );

      if (!result.error) {
        latestWebsiteStats.shopsOnline =
          numberValue(result.data);
      }
    } catch (error) {}
  }


  /* =========================================================
     LOAD CURRENT SHOP STATS
  ========================================================= */

  async function loadCurrentShopStats() {
    if (
      !client ||
      stopped ||
      !detectedShopSlug
    ) {
      return;
    }

    try {
      const result =
        await client.rpc(
          "get_shop_stats",
          {
            p_shop_id:
              detectedShopSlug
          }
        );

      if (
        !result.error &&
        result.data
      ) {
        let row = result.data;

        if (Array.isArray(row)) {
          row = row[0] || {};
        }

        latestShopStats.week =
          numberValue(
            row.views_this_week ??
            row.week_views ??
            row.weekly_views ??
            row.views_week ??
            0
          );

        latestShopStats.today =
          numberValue(
            row.visitors_today ??
            row.today_visitors ??
            row.views_today ??
            row.today_views ??
            0
          );

        latestShopStats.total =
          numberValue(
            row.total_views ??
            row.views_total ??
            row.total ??
            0
          );
      }
    } catch (error) {}

    try {
      const result =
        await client.rpc(
          "get_shop_online",
          {
            p_shop_id:
              detectedShopSlug
          }
        );

      if (!result.error) {
        let value = result.data;

        if (Array.isArray(value)) {
          const first = value[0];

          if (
            first &&
            typeof first === "object"
          ) {
            value =
              first.online ??
              first.online_count ??
              first.viewing_now ??
              Object.values(first)[0] ??
              0;
          } else {
            value = first || 0;
          }
        } else if (
          value &&
          typeof value === "object"
        ) {
          value =
            value.online ??
            value.online_count ??
            value.viewing_now ??
            Object.values(value)[0] ??
            0;
        }

        latestShopStats.online =
          numberValue(value);
      }
    } catch (error) {}
  }



  /* =========================================================
     HOSTINGER EMBED / IFRAME BRIDGE
     Stats designs may live inside isolated Hostinger iframes.
     The universal engine stays in the main page and sends
     the latest values into every iframe via postMessage.
  ========================================================= */

  function getStatsMessage() {
    return {
      type: "MA7ALAK_LIVE_STATS",
      website: {
        online: latestWebsiteStats.online,
        shopsOnline: latestWebsiteStats.shopsOnline,
        total: latestWebsiteStats.total
      },
      shop: detectedShopSlug
        ? {
            slug: detectedShopSlug,
            online: latestShopStats.online,
            week: latestShopStats.week,
            today: latestShopStats.today,
            total: latestShopStats.total
          }
        : null
    };
  }

  function broadcastStatsToEmbeds() {
    const message = getStatsMessage();

    try {
      const frames = document.querySelectorAll("iframe");

      frames.forEach(function (frame) {
        try {
          if (frame.contentWindow) {
            frame.contentWindow.postMessage(
              message,
              "*"
            );
          }
        } catch (error) {}
      });
    } catch (error) {}
  }

  /* =========================================================
     DESIGN-INDEPENDENT DISPLAY BINDING
     IF AN ELEMENT DOESN'T EXIST YET, NOTHING BREAKS.
     WHEN HOSTINGER RENDERS IT LATER, WE FILL IT.
  ========================================================= */

  function setNumber(id, value) {
    const el =
      document.getElementById(id);

    if (!el) return;

    const next =
      numberValue(value);

    if (
      el.textContent !== String(next)
    ) {
      el.textContent = String(next);
    }
  }

  function paintStats() {
    /*
      HOMEPAGE / GLOBAL LIVE BOX
    */
    setNumber(
      "ma7alak-web-online",
      latestWebsiteStats.online
    );

    setNumber(
      "ma7alak-shop-online",
      latestWebsiteStats.shopsOnline
    );

    setNumber(
      "ma7alak-web-total",
      latestWebsiteStats.total
    );

    /*
      ANY SHOP DESIGN USING THESE EXISTING IDs
    */
    if (detectedShopSlug) {
      setNumber(
        "ma7alak-online",
        latestShopStats.online
      );

      setNumber(
        "ma7alak-week",
        latestShopStats.week
      );

      setNumber(
        "ma7alak-today",
        latestShopStats.today
      );

      setNumber(
        "ma7alak-total",
        latestShopStats.total
      );
    }

    /*
      ALSO SEND THE SAME VALUES INTO HOSTINGER EMBED IFRAMES.
      This is what lets the visual boxes update even though
      they are isolated from the main page DOM.
    */
    broadcastStatsToEmbeds();
  }


  /* =========================================================
     REFRESH
  ========================================================= */

  async function refreshPresence() {
    if (stopped) return;

    const tasks = [
      updateWebsitePresence()
    ];

    if (detectedShopSlug) {
      tasks.push(
        updateShopPresence()
      );
    }

    await Promise.all(tasks);
  }

  async function refreshStats() {
    if (stopped) return;

    const tasks = [
      loadWebsiteStats(),
      loadAllShopsOnline()
    ];

    if (detectedShopSlug) {
      tasks.push(
        loadCurrentShopStats()
      );
    }

    await Promise.all(tasks);

    paintStats();
  }


  /* =========================================================
     OPTIONAL IMMEDIATE LEAVE
     Uses fetch keepalive because normal async work may be killed
     while the browser is closing the page.
  ========================================================= */

  function callLeaveRpc(
    functionName,
    body
  ) {
    try {
      fetch(
        SUPABASE_URL +
          "/rest/v1/rpc/" +
          functionName,
        {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type":
              "application/json",

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY
          },
          body:
            JSON.stringify(body)
        }
      ).catch(function () {});
    } catch (error) {}
  }

  function leaveNow() {
    if (stopped) return;

    stopped = true;

    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }

    if (statsTimer) {
      clearInterval(statsTimer);
      statsTimer = null;
    }

    callLeaveRpc(
      "leave_website_presence",
      {
        p_visitor_id:
          websiteVisitorId
      }
    );

    if (detectedShopSlug) {
      callLeaveRpc(
        "leave_shop_presence",
        {
          p_shop_id:
            detectedShopSlug,

          p_visitor_id:
            shopVisitorId
        }
      );
    }
  }


  /* =========================================================
     RESUME FROM BROWSER BACK/FORWARD CACHE
  ========================================================= */

  async function resume() {
    if (!stopped) return;

    stopped = false;

    await refreshPresence();
    await refreshStats();

    startTimers();
  }


  /* =========================================================
     TIMERS
  ========================================================= */

  function startTimers() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }

    if (statsTimer) {
      clearInterval(statsTimer);
    }

    heartbeatTimer =
      setInterval(
        refreshPresence,
        HEARTBEAT_MS
      );

    statsTimer =
      setInterval(
        refreshStats,
        STATS_REFRESH_MS
      );
  }


  /* =========================================================
     LAZY-DOM WATCHER
     DOES NOT START TRACKING.
     TRACKING IS ALREADY RUNNING.
     IT ONLY PAINTS VALUES WHEN A STATS DESIGN APPEARS LATER.
  ========================================================= */

  function startDomWatcher() {
    if (
      !window.MutationObserver ||
      domObserver
    ) {
      return;
    }

    domObserver =
      new MutationObserver(
        function () {
          paintStats();

          /*
            Hostinger can create the iframe first and finish
            loading its contents a moment later. Send again
            shortly after so the receiver cannot miss it.
          */
          setTimeout(
            broadcastStatsToEmbeds,
            250
          );

          setTimeout(
            broadcastStatsToEmbeds,
            900
          );
        }
      );

    domObserver.observe(
      document.documentElement,
      {
        childList: true,
        subtree: true
      }
    );
  }


  /* =========================================================
     START ENGINE
  ========================================================= */

  async function startEngine() {
    try {
      const supabase =
        await loadSupabase();

      client =
        supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        );

      /*
        WEBSITE PRESENCE STARTS IMMEDIATELY.
        NO SCROLL / NO STATS BOX REQUIRED.
      */
      await Promise.all([
        recordWebsiteVisitOncePerDay(),
        updateWebsitePresence(),
        detectShop()
      ]);

      /*
        If this URL is a real shop, start shop tracking immediately.
      */
      if (detectedShopSlug) {
        await Promise.all([
          recordShopView(),
          updateShopPresence()
        ]);
      }

      await refreshStats();

      startTimers();
      startDomWatcher();
      broadcastStatsToEmbeds();

      window.MA7ALAK_LIVE_ENGINE = {
        active: true,
        shopSlug:
          detectedShopSlug || null,

        refresh:
          refreshStats,

        presence:
          refreshPresence
      };

      window.dispatchEvent(
        new CustomEvent(
          "MA7ALAK_LIVE_ENGINE_READY",
          {
            detail: {
              shopSlug:
                detectedShopSlug || null
            }
          }
        )
      );

    } catch (error) {
      console.error(
        "MA7ALAK universal live engine failed:",
        error
      );
    }
  }



  /*
    An iframe receiver can announce itself after Hostinger
    finishes loading it. Reply immediately with current values.
  */
  window.addEventListener(
    "message",
    function (event) {
      const data = event && event.data;

      if (
        data &&
        data.type === "MA7ALAK_STATS_EMBED_READY"
      ) {
        broadcastStatsToEmbeds();
      }
    }
  );

  /* =========================================================
     PAGE EVENTS
  ========================================================= */

  window.addEventListener(
    "pagehide",
    leaveNow,
    {
      capture: true
    }
  );

  window.addEventListener(
    "pageshow",
    function (event) {
      if (event.persisted) {
        resume();
      }
    }
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      /*
        Do NOT mark hidden tabs as offline.
        A person still has the page open.
        When they return, refresh immediately.
      */
      if (
        document.visibilityState === "visible" &&
        !stopped
      ) {
        refreshPresence();
        refreshStats();
      }
    }
  );

  /*
    START NOW.
    No DOMContentLoaded.
    No IntersectionObserver.
    No scroll dependency.
  */
  startEngine();

})();
