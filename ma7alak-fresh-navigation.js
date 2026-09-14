/* =========================================================
   MA7ALAK FRESH NAVIGATION
   ---------------------------------------------------------
   PURPOSE:
   - Prevent stale Hostinger/browser pages on internal navigation.
   - Force fresh document navigation for ALL internal Ma7alak links.
   - Remove the temporary ?fresh=... parameter after load.
   - Refresh pages restored from browser back/forward cache.

   Recommended filename:
   ma7alak-fresh-navigation.js

   Load this globally from ma7alak-master.js:
   loadScript("ma7alak-fresh-navigation.js");
========================================================= */

(function () {
  "use strict";

  if (window.__MA7ALAK_FRESH_NAVIGATION_LOADED__) {
    return;
  }

  window.__MA7ALAK_FRESH_NAVIGATION_LOADED__ = true;

  const FRESH_PARAM = "fresh";

  /* =========================================================
     HELPERS
  ========================================================= */

  function isInternalMa7alakUrl(url) {
    try {
      const parsed = new URL(url, window.location.href);

      const host = parsed.hostname.toLowerCase();

      return (
        host === "ma7alak.com" ||
        host === "www.ma7alak.com"
      );
    } catch (e) {
      return false;
    }
  }

  function shouldSkipLink(anchor, event) {
    if (!anchor) return true;

    const href =
      anchor.getAttribute("href");

    if (!href) return true;

    const trimmed =
      href.trim();

    if (!trimmed) return true;

    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("javascript:") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:") ||
      trimmed.startsWith("sms:") ||
      trimmed.startsWith("whatsapp:")
    ) {
      return true;
    }

    if (
      anchor.hasAttribute("download")
    ) {
      return true;
    }

    if (
      anchor.target &&
      anchor.target.toLowerCase() === "_blank"
    ) {
      return true;
    }

    if (
      event &&
      (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
    ) {
      return true;
    }

    return false;
  }

  function buildFreshUrl(url) {
    const parsed =
      new URL(
        url,
        window.location.href
      );

    parsed.searchParams.set(
      FRESH_PARAM,
      String(Date.now())
    );

    return parsed.href;
  }

  function cleanFreshParamFromCurrentUrl() {
    try {
      const current =
        new URL(
          window.location.href
        );

      if (
        !current.searchParams.has(
          FRESH_PARAM
        )
      ) {
        return;
      }

      current.searchParams.delete(
        FRESH_PARAM
      );

      const clean =
        current.pathname +
        (
          current.search
            ? current.search
            : ""
        ) +
        (
          current.hash
            ? current.hash
            : ""
        );

      window.history.replaceState(
        window.history.state,
        "",
        clean
      );
    } catch (e) {
      console.warn(
        "MA7ALAK fresh-navigation: could not clean URL.",
        e
      );
    }
  }

  /* =========================================================
     CLEAN TEMPORARY CACHE-BUSTER FROM ADDRESS BAR
  ========================================================= */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      cleanFreshParamFromCurrentUrl,
      {
        once:true
      }
    );
  } else {
    cleanFreshParamFromCurrentUrl();
  }

  /* =========================================================
     FORCE FRESH INTERNAL NAVIGATION
  ========================================================= */

  document.addEventListener(
    "click",
    function (event) {

      const target =
        event.target;

      if (!target) {
        return;
      }

      const anchor =
        target.closest
          ? target.closest("a[href]")
          : null;

      if (
        shouldSkipLink(
          anchor,
          event
        )
      ) {
        return;
      }

      const href =
        anchor.href;

      if (
        !isInternalMa7alakUrl(
          href
        )
      ) {
        return;
      }

      /*
         If link points to the exact same current page + hash only,
         do not convert it into a fresh navigation.
      */
      try {
        const destination =
          new URL(
            href,
            window.location.href
          );

        const current =
          new URL(
            window.location.href
          );

        const sameDocument =
          destination.origin === current.origin &&
          destination.pathname === current.pathname &&
          destination.search === current.search &&
          destination.hash &&
          destination.hash !== current.hash;

        if (
          sameDocument
        ) {
          return;
        }
      } catch (e) {}

      event.preventDefault();

      const freshUrl =
        buildFreshUrl(
          href
        );

      window.location.assign(
        freshUrl
      );

    },
    true
  );

  /* =========================================================
     BACK / FORWARD CACHE FIX
     ---------------------------------------------------------
     Browsers can restore an old page instantly from memory.
     If that happens, reload the document once.
  ========================================================= */

  window.addEventListener(
    "pageshow",
    function (event) {

      if (
        event.persisted
      ) {
        window.location.reload();
        return;
      }

      try {
        const entries =
          performance.getEntriesByType(
            "navigation"
          );

        if (
          entries &&
          entries[0] &&
          entries[0].type === "back_forward"
        ) {
          window.location.reload();
        }
      } catch (e) {}

    }
  );

  /* =========================================================
     PUBLIC HELPER
     ---------------------------------------------------------
     Optional:
     window.ma7alakFreshNavigate("/doze-3ale");
  ========================================================= */

  window.ma7alakFreshNavigate =
    function (url) {

      if (
        !isInternalMa7alakUrl(
          url
        )
      ) {
        window.location.assign(
          url
        );
        return;
      }

      window.location.assign(
        buildFreshUrl(
          url
        )
      );

    };

})();
