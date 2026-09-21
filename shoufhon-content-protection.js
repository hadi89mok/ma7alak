(function () {
  "use strict";

  if (window.__SHOUFHON_CONTENT_PROTECTION__) return;
  window.__SHOUFHON_CONTENT_PROTECTION__ = true;

  var STYLE_ID = "shoufhon-content-protection-style";
  var EDITABLE_SELECTOR =
    'input, textarea, [contenteditable="true"], [contenteditable=""], ' +
    '[data-shoufhon-allow-copy], .shoufhon-allow-copy';

  function isEditable(target) {
    return !!(
      target &&
      target.nodeType === 1 &&
      typeof target.closest === "function" &&
      target.closest(EDITABLE_SELECTOR)
    );
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
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

    (document.head || document.documentElement).appendChild(style);
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
      if (video.controlsList && typeof video.controlsList.add === "function") {
        video.controlsList.add("nodownload");
        video.controlsList.add("noremoteplayback");
      } else {
        video.setAttribute("controlslist", "nodownload noremoteplayback");
      }
    } catch (_) {
      try {
        video.setAttribute("controlslist", "nodownload noremoteplayback");
      } catch (__) {}
    }
  }

  function protectAudio(audio) {
    try {
      audio.disableRemotePlayback = true;
      audio.setAttribute("disableremoteplayback", "");
    } catch (_) {}

    try {
      if (audio.controlsList && typeof audio.controlsList.add === "function") {
        audio.controlsList.add("nodownload");
        audio.controlsList.add("noremoteplayback");
      } else {
        audio.setAttribute("controlslist", "nodownload noremoteplayback");
      }
    } catch (_) {
      try {
        audio.setAttribute("controlslist", "nodownload noremoteplayback");
      } catch (__) {}
    }
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
  }

  function protectTree(root) {
    if (!root) return;

    if (root.nodeType === 1) protectElement(root);

    if (typeof root.querySelectorAll !== "function") return;

    var nodes = root.querySelectorAll("img,video,audio,a[download]");
    for (var i = 0; i < nodes.length; i++) {
      protectElement(nodes[i]);
    }
  }

  function blockOutsideEditable(event) {
    if (isEditable(event.target)) return;
    event.preventDefault();
  }

  installStyles();
  protectTree(document);

  // Blocks browser long-press/right-click menus such as:
  // Download image/video, Copy image/frame, Save image, and similar options.
  document.addEventListener("contextmenu", blockOutsideEditable, true);

  // Stops dragging media/content out of the page.
  document.addEventListener("dragstart", blockOutsideEditable, true);

  // Stops selecting/copying normal on-screen content.
  document.addEventListener("selectstart", blockOutsideEditable, true);
  document.addEventListener("copy", blockOutsideEditable, true);
  document.addEventListener("cut", blockOutsideEditable, true);

  // Blocks common desktop browser shortcuts for copying/saving/printing page content.
  document.addEventListener(
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

  // If a browser still attempts Picture-in-Picture, immediately leave it.
  document.addEventListener(
    "enterpictureinpicture",
    function () {
      try {
        if (
          document.pictureInPictureElement &&
          typeof document.exitPictureInPicture === "function"
        ) {
          document.exitPictureInPicture().catch(function () {});
        }
      } catch (_) {}
    },
    true
  );

  // Re-apply protection to reels, stories, galleries, icons and other
  // media inserted dynamically after the initial page load.
  if (typeof MutationObserver === "function") {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          protectTree(added[j]);
        }
      }
    });

    var observeTarget = document.documentElement || document;
    observer.observe(observeTarget, {
      childList: true,
      subtree: true
    });
  }

  // A small public hook for rare fields/elements where copying must remain
  // available: add class="shoufhon-allow-copy" or data-shoufhon-allow-copy.
  window.ShoufHonContentProtection = {
    refresh: function () {
      installStyles();
      protectTree(document);
    }
  };
})();
