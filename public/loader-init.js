(function initPortfolioLoader() {
  var SESSION_KEY = "derk2104-loader-played";
  var html = document.documentElement;
  var loader = document.getElementById("loading-screen");
  var loaderLogo = document.getElementById("loading-screen-logo");

  function markPlayed() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {
      /* ignore */
    }
  }

  function removeLoader() {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  function dismissImmediately() {
    html.classList.remove("is-loading");
    removeLoader();
  }

  if (!loader) return;

  var alreadyPlayed = false;
  try {
    alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
  } catch (e) {
    alreadyPlayed = false;
  }

  if (alreadyPlayed || !html.classList.contains("is-loading")) {
    dismissImmediately();
    return;
  }

  var prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    setTimeout(function () {
      loader.classList.add("is-fading");
      html.classList.remove("is-loading");
      markPlayed();
      setTimeout(removeLoader, 700);
    }, 600);
    return;
  }

  function computeLandingTransform() {
    var headerLogo = document.querySelector("[data-navbar-logo]");
    if (!headerLogo || !loaderLogo) return null;

    var headerRect = headerLogo.getBoundingClientRect();
    var loaderRect = loaderLogo.getBoundingClientRect();
    if (!headerRect.width || !loaderRect.width) return null;

    var loaderCenterX = loaderRect.left + loaderRect.width / 2;
    var loaderCenterY = loaderRect.top + loaderRect.height / 2;
    var headerCenterX = headerRect.left + headerRect.width / 2;
    var headerCenterY = headerRect.top + headerRect.height / 2;

    var dx = headerCenterX - loaderCenterX;
    var dy = headerCenterY - loaderCenterY;
    var scale = headerRect.width / loaderRect.width;
    return "translate(" + dx + "px, " + dy + "px) scale(" + scale + ")";
  }

  function t(ms, fn) {
    setTimeout(fn, ms);
  }

  t(80, function () {
    loader.classList.add("is-intro");
  });

  t(900, function () {
    loader.classList.remove("is-intro");
    loader.classList.add("is-logo-in");
    loader.classList.add("is-spinning");
  });

  t(1700, function () {
    var attempts = 0;
    function fly() {
      var transform = computeLandingTransform();
      if (transform && loaderLogo) {
        loaderLogo.style.transform = transform;
        loader.classList.add("is-flying");
        loader.classList.remove("is-spinning");
        return;
      }
      if (attempts < 40) {
        attempts += 1;
        setTimeout(fly, 50);
      }
    }
    fly();
  });

  t(2500, function () {
    loader.classList.add("is-fading");
    html.classList.remove("is-loading");
    markPlayed();
  });

  t(3200, removeLoader);

  t(6000, function () {
    if (html.classList.contains("is-loading")) {
      html.classList.remove("is-loading");
    }
    markPlayed();
    removeLoader();
  });
})();
