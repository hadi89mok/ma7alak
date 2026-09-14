/* =========================================================
   MA7ALAK MASTER GITHUB LOADER
   ---------------------------------------------------------
   Put ONLY this one loader in Hostinger Custom Website Code.

   It loads the correct GitHub JavaScript files automatically.

   Repo:
   https://github.com/hadi89mok/ma7alak

   IMPORTANT:
   - Keep this file in the ROOT of the repo.
   - Recommended filename: ma7alak-master.js
   - Child scripts are loaded from @main.
========================================================= */

(function () {
  "use strict";

  if (window.__MA7ALAK_MASTER_LOADER__) {
    return;
  }

  window.__MA7ALAK_MASTER_LOADER__ = true;

  const BASE =
    "https://cdn.jsdelivr.net/gh/hadi89mok/ma7alak@main/";

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
      value =
        value.slice(0, -1);
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

  const loadedFiles =
    new Set();

  function loadScript(
    filename,
    options
  ) {

    options =
      options || {};

    if (
      !filename ||
      loadedFiles.has(filename)
    ) {
      return Promise.resolve();
    }

    loadedFiles.add(filename);

    return new Promise(
      function (
        resolve,
        reject
      ) {

        const existing =
          document.querySelector(
            'script[data-ma7alak-github-file="' +
            filename +
            '"]'
          );

        if (existing) {

          if (
            existing.dataset.ma7alakLoaded ===
            "1"
          ) {
            resolve();
            return;
          }

          existing.addEventListener(
            "load",
            resolve,
            {
              once:true
            }
          );

          existing.addEventListener(
            "error",
            reject,
            {
              once:true
            }
          );

          return;
        }

        const script =
          document.createElement(
            "script"
          );

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

        script.addEventListener(
          "load",
          function () {

            script.dataset.ma7alakLoaded =
              "1";

            console.log(
              "MA7ALAK loaded:",
              filename
            );

            resolve();

          },
          {
            once:true
          }
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
          {
            once:true
          }
        );

        (
          document.head ||
          document.documentElement
        ).appendChild(
          script
        );

      }
    );

  }


  /* =========================================================
     GLOBAL WEBSITE FILES
     ---------------------------------------------------------
     These are available throughout Ma7alak.
  ========================================================= */

  loadScript(
    "premium-social-header.js"
  );

  loadScript(
    "notifications.js"
  );

  loadScript(
    "ma7alak-live-presence.js"
  );

  loadScript(
    "story-upload-panel.js"
  );

  loadScript(
    "homepage-story-likes.js"
  );

  loadScript(
    "show-shops.js"
  );

     loadScript(
    "ma7alak-fresh-navigation.js"
  );


  /* =========================================================
     DOZE 3ALE
  ========================================================= */

  if (
    PATH ===
    "/doze-3ale"
  ) {

    loadScript(
      "doze-3ale-complete.js"
    );

  }


  /* =========================================================
     ADMIN
     IMPORTANT:
     Admin panel runs ONLY on /admin
  ========================================================= */

  if (
    PATH ===
    "/admin"
  ) {

    loadScript(
      "ma7alak-admin-panel.js"
    );

  }


  /* =========================================================
     FUTURE SHOP FILES
     ---------------------------------------------------------
     Add future shops here later.

     Example:

     if(PATH === "/masaya-cafe"){
       loadScript("masaya-cafe.js");
     }

     if(PATH === "/zee-tattoos-and-piercing"){
       loadScript("zee-tattoos-and-piercing.js");
     }
  ========================================================= */


  /* =========================================================
     DEBUG HELPER
  ========================================================= */

  window.ma7alakMasterLoader = {

    path:
      PATH,

    base:
      BASE,

    load:
      loadScript,

    loadedFiles:
      loadedFiles

  };

})();
