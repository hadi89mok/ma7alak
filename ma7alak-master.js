/* =========================================================
   MA7ALAK MASTER LOADER — SAFE WORKING VERSION
   ---------------------------------------------------------
   Keeps the current working @main system for all files.

   ONLY show-shops.js is pinned to its confirmed working
   exact commit so jsDelivr cannot serve the stale @main
   version for that file.
========================================================= */

(function () {
  "use strict";

  if (window.__MA7ALAK_MASTER_LOADER__) {
    return;
  }

  window.__MA7ALAK_MASTER_LOADER__ = true;

  const VERSION = "main";

  const BASE =
    "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@" +
    VERSION +
    "/";

  const SHOW_SHOPS_VERSION =
    "d4114b60d2fc0d7817deec3975c94b89a87592d7";

  /* =========================================================
     PAGE
  ========================================================= */

  function normalizePath(path) {
    let value =
      String(path || "/")
        .split("?")[0]
        .split("#")[0]
        .replace(/\/+/g, "/");

    if (
      value.length > 1 &&
      value.endsWith("/")
    ) {
      value = value.slice(0, -1);
    }

    return value || "/";
  }

  const PATH =
    normalizePath(
      window.location.pathname
    );

  /* =========================================================
     SCRIPT LOADER
  ========================================================= */

  const loadedFiles = new Set();

  function loadScript(filename, options) {

    options = options || {};

    const fileVersion =
      String(options.version || VERSION).trim();

    const fileKey =
      filename + "@" + fileVersion;

    if (
      !filename ||
      loadedFiles.has(fileKey)
    ) {
      return Promise.resolve();
    }

    loadedFiles.add(fileKey);

    return new Promise(function (resolve, reject) {

      const existing =
        document.querySelector(
          'script[data-ma7alak-github-file="' +
          filename +
          '"][data-ma7alak-github-version="' +
          fileVersion +
          '"]'
        );

      if (existing) {

        if (
          existing.dataset.ma7alakLoaded === "1"
        ) {
          resolve();
          return;
        }

        existing.addEventListener(
          "load",
          resolve,
          { once:true }
        );

        existing.addEventListener(
          "error",
          reject,
          { once:true }
        );

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@" +
        fileVersion +
        "/" +
        filename +
        "?v=" +
        Date.now();

      script.async =
        options.async === true;

      script.defer =
        options.defer === true;

      script.dataset.ma7alakGithubFile =
        filename;

      script.dataset.ma7alakGithubVersion =
        fileVersion;

      script.addEventListener(
        "load",
        function () {

          script.dataset.ma7alakLoaded = "1";

          console.log(
            "MA7ALAK loaded:",
            filename,
            "version:",
            fileVersion
          );

          resolve();
        },
        { once:true }
      );

      script.addEventListener(
        "error",
        function (error) {

          console.error(
            "MA7ALAK failed to load:",
            filename,
            "version:",
            fileVersion,
            error
          );

          reject(error);
        },
        { once:true }
      );

      (
        document.head ||
        document.documentElement
      ).appendChild(script);
    });
  }

  /* =========================================================
     GLOBAL WEBSITE FILES
  ========================================================= */

  loadScript("premium-social-header.js");
  loadScript("notifications.js");
  loadScript("ma7alak-live-presence.js");
  loadScript("story-upload-panel.js");
  loadScript("homepage-story-likes.js");

  /*
     IMPORTANT:
     show-shops.js is pinned to the exact confirmed-working
     commit because jsDelivr @main was serving an older copy.
  */
  loadScript(
    "show-shops.js",
    {
      version:
        SHOW_SHOPS_VERSION
    }
  );

  loadScript("ma7alak-fresh-navigation.js");

  /* =========================================================
     DOZE 3ALE
  ========================================================= */

  if (PATH === "/doze-3ale") {
    loadScript("doze-3ale-complete.js");
  }

  /* =========================================================
     ADMIN
     Admin panel runs ONLY on /admin
  ========================================================= */

  if (PATH === "/admin") {
    loadScript("ma7alak-admin-panel.js");
  }

  /* =========================================================
     DEBUG HELPER
  ========================================================= */

  window.ma7alakMasterLoader = {
    path: PATH,
    version: VERSION,
    base: BASE,
    showShopsVersion: SHOW_SHOPS_VERSION,
    load: loadScript,
    loadedFiles: loadedFiles
  };

})();
