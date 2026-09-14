/* =========================================================
   MA7ALAK MASTER LOADER
   ---------------------------------------------------------
   show-shops.js is NOT loaded here.

   show-shops.js is loaded DIRECTLY from Hostinger using
   its confirmed-working exact GitHub commit.
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

    if (
      !filename ||
      loadedFiles.has(filename)
    ) {
      return Promise.resolve();
    }

    loadedFiles.add(filename);

    return new Promise(function (resolve, reject) {

      const existing =
        document.querySelector(
          'script[data-ma7alak-github-file="' +
          filename +
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
        BASE +
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
        VERSION;

      script.addEventListener(
        "load",
        function () {

          script.dataset.ma7alakLoaded = "1";

          console.log(
            "MA7ALAK loaded:",
            filename
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

     DO NOT LOAD show-shops.js HERE.

     Hostinger loads show-shops.js directly from its
     confirmed-working exact commit.
  */

  loadScript("ma7alak-fresh-navigation.js");

 
 

  /* =========================================================
     DEBUG HELPER
  ========================================================= */

  window.ma7alakMasterLoader = {

    path: PATH,

    version: VERSION,

    base: BASE,

    load: loadScript,

    loadedFiles: loadedFiles

  };

})();
