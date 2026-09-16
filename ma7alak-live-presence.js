/*
=========================================================
MA7ALAK — UNIVERSAL LIVE PRESENCE + STATS ENGINE
HOSTINGER TOP-LEVEL SAFETY WRAPPER

Fix: Hostinger Embed/custom-code iframes must never create
visitor IDs or presence heartbeats. Only the real top-level
Ma7alak page loads the existing proven presence engine.
=========================================================
*/
(function () {
  "use strict";

  /* Never track Hostinger embed/iframe contexts as visitors. */
  if (window.self !== window.top) {
    return;
  }

  /* Avoid loading the proven engine more than once. */
  if (window.__MA7ALAK_LIVE_PRESENCE_LOADER__) {
    return;
  }
  window.__MA7ALAK_LIVE_PRESENCE_LOADER__ = true;

  /*
    Load the exact previous working engine from its immutable
    commit. The only behavioral change is the top-level guard
    above; all existing stats, shop detection, heartbeat,
    iframe postMessage display bridge and leave behavior stay
    on the proven implementation.
  */
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@544b0a440e81a53d9619587c5721c53c470b2b56/ma7alak-live-presence.js";
  script.async = false;
  script.dataset.ma7alakPresenceCore = "1";

  (document.head || document.documentElement).appendChild(script);
})();
