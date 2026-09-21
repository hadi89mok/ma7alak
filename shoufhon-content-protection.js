(function () {
  "use strict";

  if (window.__SHOUFHON_CONTENT_PROTECTION__) return;
  window.__SHOUFHON_CONTENT_PROTECTION__ = true;

  var STYLE_ID = "shoufhon-content-protection-style";
  var DOC_FLAG = "__SHOUFHON_CONTENT_PROTECTION_DOC__";
  var FRAME_FLAG = "__SHOUFHON_CONTENT_PROTECTION_FRAME__";
  var VIDEO_FLAG = "__SHOUFHON_CONTENT_PROTECTION_VIDEO__";
  var REEL_GUARD_CLASS = "shoufhon-reel-media-guard";
  var EDITABLE_SELECTOR =
    'input, textarea, [contenteditable="true"], [contenteditable=""], ' +
    '[data-shoufhon-allow-copy], .shoufhon-allow-copy';

  function isEditable(target) {
    try {
      return !!(
        target &&
        target.nodeType === 1 &&
        typeof target.closest === "function" &&
        target.closest(EDITABLE_SELECTOR)
      );
    } catch (_) {
      return false;
    }
  }

  function installStyles(doc) {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    var style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      "html,body,body *{" +
      "-webkit-touch-callout:none!important;" +
      "-webkit-user-select:none!important;" +
      "user-select:none!important;" +
      "}" +
      "img,video,audio,canvas,svg,picture{" +
      "-webkit-user-drag:none!important;" +
      "user-drag:none!important;" +
      "}" +
      ".shoufhon-reel-media-guard{" +
      "position:absolute!important;" +
      "inset:0!important;" +
      "z-index:5!important;" +
      "background:transparent!important;" +
      "-webkit-touch-callout:none!important;" +
      "-webkit-user-select:none!important;" +
      "user-select:none!important;" +
      "touch-action:pan-x pan-y!important;" +
      "}" +
      ".ma7alak-reel-viewer>.shoufhon-reel-media-guard{" +
      "z-index:2147483644!important;" +
      "touch-action:none!important;" +
      "}" +
      "#ma7alakReelViewerVideo,.ma7alak-reel-viewer-video{" +
      "pointer-events:none!important;" +
      "}" +
      "input,textarea,[contenteditable='true'],[contenteditable='']," +
      "[data-shoufhon-allow-copy],.shoufhon-allow-copy{" +
      "-webkit-touch-callout:default!important;" +
      "-webkit-user-select:text!important;" +
      "user-select:text!important;" +
      "}";

    try {
      (doc.head || doc.documentElement).appendChild(style);
    } catch (_) {}
  }

  function protectImage(img) {
    try {
      img.draggable = false;
      img.setAttribute("draggable", "false");
    } catch (_) {}
  }

  function isReelVideo(video) {
    try {
      return !!(
        video &&
        (
          video.id === "ma7alakReelViewerVideo" ||
          video.classList.contains("ma7alak-video") ||
          video.classList.contains("ma7alak-reel-viewer-video") ||
          video.closest(".ma7alak-reel") ||
          video.closest(".ma7alak-reel-viewer")
        )
      );
    } catch (_) {
      return false;
    }
  }

  function ensureReelGuard(video) {
    if (!isReelVideo(video)) return;

    var card = null;
    var viewer = null;

    try {
      card = video.closest(".ma7alak-reel");
      viewer = video.closest(".ma7alak-reel-viewer");
    } catch (_) {}

    var host = viewer || card;
    if (!host) return;

    try {
      var existing = host.querySelector(":scope > ." + REEL_GUARD_CLASS);
      if (existing) return;
    } catch (_) {
      try {
        if (host.querySelector("." + REEL_GUARD_CLASS)) return;
      } catch (__) {}
    }

    try {
      var doc = video.ownerDocument || document;
      var guard = doc.createElement("span");
      guard.className = REEL_GUARD_CLASS;
      guard.setAttribute("aria-hidden", "true");

      guard.addEventListener(
        "contextmenu",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
        },
        true
      );

      guard.addEventListener(
        "dragstart",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
        },
        true
      );

      // Homepage reel cards originally open from the <video> click handler.
      // Forward a normal tap from the transparent guard to that handler.
      if (card) {
        guard.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            event.stopPropagation();

            try {
              video.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: doc.defaultView || window
                })
              );
            } catch (_) {
              try {
                video.click();
              } catch (__) {}
            }
          },
          true
        );
      }

      host.appendChild(guard);
    } catch (_) {}
  }

  function protectVideo(video) {
    try {
      video.draggable = false;
      video.setAttribute("draggable", "false");
      video.style.setProperty("-webkit-touch-callout", "none", "important");
      video.style.setProperty("-webkit-user-select", "none", "important");
      video.style.setProperty("user-select", "none", "important");
    } catch (_) {}

    try {
      video.disablePictureInPicture = true;
      video.setAttribute("disablepictureinpicture", "");
    } catch (_) {}

    try {
      video.disableRemotePlayback = true;
      video.setAttribute("disableremoteplayback", "");
    } catch (_) {}

    try {
      video.setAttribute("controlslist", "nodownload noremoteplayback noplaybackrate");
      if (video.controlsList && typeof video.controlsList.add === "function") {
        video.controlsList.add("nodownload");
        video.controlsList.add("noremoteplayback");
        video.controlsList.add("noplaybackrate");
      }
    } catch (_) {}

    try {
      if (!video[VIDEO_FLAG]) {
        video[VIDEO_FLAG] = true;

        video.addEventListener(
          "contextmenu",
          function (event) {
            event.preventDefault();
            event.stopPropagation();
          },
          true
        );

        video.addEventListener(
          "dragstart",
          function (event) {
            event.preventDefault();
            event.stopPropagation();
          },
          true
        );

        video.addEventListener(
          "enterpictureinpicture",
          function () {
            try {
              var doc = video.ownerDocument;
              if (
                doc &&
                doc.pictureInPictureElement &&
                typeof doc.exitPictureInPicture === "function"
              ) {
                doc.exitPictureInPicture().catch(function () {});
              }
            } catch (_) {}
          },
          true
        );
      }
    } catch (_) {}

    ensureReelGuard(video);
  }

  function protectAudio(audio) {
    try {
      audio.disableRemotePlayback = true;
      audio.setAttribute("disableremoteplayback", "");
    } catch (_) {}

    try {
      audio.setAttribute("controlslist", "nodownload noremoteplayback noplaybackrate");
      if (audio.controlsList && typeof audio.controlsList.add === "function") {
        audio.controlsList.add("nodownload");
        audio.controlsList.add("noremoteplayback");
        audio.controlsList.add("noplaybackrate");
      }
    } catch (_) {}
  }

  function protectAnchor(anchor) {
    try {
      if (anchor.hasAttribute("download")) {
        anchor.removeAttribute("download");
      }
    } catch (_) {}
  }

  function protectElement(el) {
    if (!el || el.nodeType !== 1) return;

    var tag = String(el.tagName || "").toLowerCase();

    if (tag === "img") protectImage(el);
    else if (tag === "video") protectVideo(el);
    else if (tag === "audio") protectAudio(el);
    else if (tag === "a") protectAnchor(el);
    else if (tag === "iframe") protectFrame(el);
  }

  function protectTree(root) {
    if (!root) return;

    if (root.nodeType === 1) {
      protectElement(root);
    }

    if (typeof root.querySelectorAll !== "function") return;

    var nodes = root.querySelectorAll(
      "img,video,audio,a[download],iframe"
    );

    for (var i = 0; i < nodes.length; i++) {
      protectElement(nodes[i]);
    }
  }

  function protectFrame(frame) {
    if (!frame || frame.nodeType !== 1) return;

    try {
      if (!frame[FRAME_FLAG]) {
        frame[FRAME_FLAG] = true;

        frame.addEventListener(
          "load",
          function () {
            try {
              if (frame.contentDocument) {
                installInDocument(frame.contentDocument);
              }
            } catch (_) {}
          },
          true
        );
      }
    } catch (_) {}

    try {
      if (frame.contentDocument) {
        installInDocument(frame.contentDocument);
      }
    } catch (_) {
      // Cross-origin iframe: browser security prevents us from entering it.
    }
  }

  function blockOutsideEditable(event) {
    if (isEditable(event.target)) return;
    event.preventDefault();
    try {
      event.stopPropagation();
    } catch (_) {}
  }

  function installInDocument(doc) {
    if (!doc) return;

    try {
      if (doc[DOC_FLAG]) {
        protectTree(doc);
        return;
      }

      doc[DOC_FLAG] = true;
    } catch (_) {
      return;
    }

    installStyles(doc);
    protectTree(doc);

    // Block the native long-press/right-click menu inside this document.
    doc.addEventListener("contextmenu", blockOutsideEditable, true);

    // Stop dragging media/content out of the page.
    doc.addEventListener("dragstart", blockOutsideEditable, true);

    // Stop selecting/copying normal on-screen content.
    doc.addEventListener("selectstart", blockOutsideEditable, true);
    doc.addEventListener("copy", blockOutsideEditable, true);
    doc.addEventListener("cut", blockOutsideEditable, true);

    // Block common desktop save/copy/print/view-source shortcuts.
    doc.addEventListener(
      "keydown",
      function (event) {
        if (isEditable(event.target)) return;

        var key = String(event.key || "").toLowerCase();

        if (
          (event.ctrlKey || event.metaKey) &&
          (key === "c" ||
            key === "x" ||
            key === "s" ||
            key === "u" ||
            key === "p")
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );

    // Exit Picture-in-Picture if a browser still tries to enter it.
    doc.addEventListener(
      "enterpictureinpicture",
      function () {
        try {
          if (
            doc.pictureInPictureElement &&
            typeof doc.exitPictureInPicture === "function"
          ) {
            doc.exitPictureInPicture().catch(function () {});
          }
        } catch (_) {}
      },
      true
    );

    // Protect media and Hostinger Custom Embed iframes added later.
    try {
      var ViewMutationObserver =
        (doc.defaultView && doc.defaultView.MutationObserver) ||
        window.MutationObserver;

      if (typeof ViewMutationObserver === "function") {
        var observer = new ViewMutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            var added = mutations[i].addedNodes;

            for (var j = 0; j < added.length; j++) {
              protectTree(added[j]);
            }
          }
        });

        var observeTarget = doc.documentElement || doc;

        observer.observe(observeTarget, {
          childList: true,
          subtree: true
        });
      }
    } catch (_) {}

    // One extra pass after the embed has had time to build dynamic viewers.
    try {
      var view = doc.defaultView || window;
      view.setTimeout(function () {
        protectTree(doc);
      }, 250);

      view.setTimeout(function () {
        protectTree(doc);
      }, 1200);
    } catch (_) {}
  }

  installInDocument(document);

  // Public refresh hook. It now refreshes the main page and accessible
  // Hostinger Custom Embed iframes as well.
  window.ShoufHonContentProtection = {
    refresh: function () {
      installInDocument(document);
      protectTree(document);
    }
  };
})();
