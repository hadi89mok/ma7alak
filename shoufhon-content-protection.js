(function () {
  "use strict";

  if (window.__SHOUFHON_CONTENT_PROTECTION__) return;
  window.__SHOUFHON_CONTENT_PROTECTION__ = true;

  var STYLE_ID = "shoufhon-content-protection-style";
  var DOC_FLAG = "__SHOUFHON_CONTENT_PROTECTION_DOC__";
  var FRAME_FLAG = "__SHOUFHON_CONTENT_PROTECTION_FRAME__";
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

  function protectVideo(video) {
    try {
      video.draggable = false;
      video.setAttribute("draggable", "false");
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
    } catch (_) {}
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
