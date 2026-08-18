(function () {
  if (
    typeof window === "undefined" ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  var MAGNETIC_STRENGTH = 0.25;
  var MAGNETIC_RELEASE = 0.78;
  var RING_SETTLED_PX = 0.35;
  var GLOW_MIN_DELTA = 2;

  var TEXT_SELECTOR =
    'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), textarea, [contenteditable="true"]';
  var LINK_SELECTOR =
    'a, button, [role="button"], summary, label[for], select, .marquee-scrubber, [data-chat-toggle], [data-chat-send], [data-chat-close]';
  var CARD_SELECTOR =
    ".tilt-card, .calm-card, .certification-trigger, .impact-card";
  var MAGNETIC_SELECTOR = ".magnetic";

  function boot() {
    if (!document.body || window.__portfolioCursorInit) return;
    window.__portfolioCursorInit = true;

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");

    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");

    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add("has-custom-cursor");
    document.body.classList.add("has-custom-cursor");

    var glow = null;
    var glowX = -9999;
    var glowY = -9999;

    var pointer = {
      mouseX: -200,
      mouseY: -200,
      ringX: -200,
      ringY: -200,
      visible: false,
    };

    var magnetic = {
      el: null,
      offsetX: 0,
      offsetY: 0,
      releasing: false,
      cx: 0,
      cy: 0,
      radius: 0,
    };

    var rafId = 0;
    var hidden = document.hidden;
    var squashEl = null;
    var squashTimer = null;
    var hoverMode = null;
    var lastHoverTarget = null;

    var squashConfig = {
      MAX_X: 0.075,
      MAX_Y: 0.06,
      SQUISH: 0.028,
      CENTER_MIN: 0.32,
      PRESS_MS: "0.14s",
      RELEASE_MS: "0.58s",
    };

    function px(x, y) {
      return x.toFixed(1) + "px " + y.toFixed(1) + "px";
    }

    function moveDot(x, y) {
      dot.style.translate = px(x, y);
    }

    function moveRing(x, y) {
      ring.style.translate = px(x, y);
    }

    function moveGlow(x, y) {
      if (!glow) {
        glow = document.querySelector(".mouse-glow-bg");
        if (!glow) return;
      }
      if (
        Math.abs(x - glowX) < GLOW_MIN_DELTA &&
        Math.abs(y - glowY) < GLOW_MIN_DELTA
      ) {
        return;
      }
      glowX = x;
      glowY = y;
      glow.style.translate = px(x, y);
    }

    function ringSettled() {
      return (
        Math.abs(pointer.mouseX - pointer.ringX) < RING_SETTLED_PX &&
        Math.abs(pointer.mouseY - pointer.ringY) < RING_SETTLED_PX
      );
    }

    function magneticActive() {
      if (!magnetic.el) return false;
      if (
        Math.abs(magnetic.offsetX) >= 0.15 ||
        Math.abs(magnetic.offsetY) >= 0.15
      ) {
        return true;
      }
      if (magnetic.releasing || magnetic.radius <= 0) return false;
      var dx = pointer.mouseX - magnetic.cx;
      var dy = pointer.mouseY - magnetic.cy;
      return dx * dx + dy * dy < magnetic.radius * magnetic.radius;
    }

    function needsRaf() {
      return !ringSettled() || magneticActive();
    }

    function stopRaf() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function measureMagnetic() {
      if (!magnetic.el) return;
      var rect = magnetic.el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      magnetic.cx = rect.left + rect.width / 2;
      magnetic.cy = rect.top + rect.height / 2;
      magnetic.radius = Math.max(rect.width, rect.height) * 0.95;
    }

    function ringEaseForGap(gap) {
      if (gap > 30) return 0.32;
      if (gap > 14) return 0.3;
      if (gap > 5) return 0.27;
      return 0.23;
    }

    function advanceRing() {
      var dx = pointer.mouseX - pointer.ringX;
      var dy = pointer.mouseY - pointer.ringY;
      var gap = Math.hypot(dx, dy);

      if (gap < RING_SETTLED_PX) {
        pointer.ringX = pointer.mouseX;
        pointer.ringY = pointer.mouseY;
        return;
      }

      var ease = ringEaseForGap(gap);
      pointer.ringX += dx * ease;
      pointer.ringY += dy * ease;
    }

    function tickMagnetic() {
      if (!magnetic.el) return;

      if (magnetic.releasing) {
        magnetic.offsetX *= MAGNETIC_RELEASE;
        magnetic.offsetY *= MAGNETIC_RELEASE;
        if (
          Math.abs(magnetic.offsetX) < 0.2 &&
          Math.abs(magnetic.offsetY) < 0.2
        ) {
          magnetic.el.style.translate = "";
          magnetic.el = null;
          magnetic.offsetX = 0;
          magnetic.offsetY = 0;
          magnetic.releasing = false;
        } else {
          magnetic.el.style.translate =
            Math.round(magnetic.offsetX) +
            "px " +
            Math.round(magnetic.offsetY) +
            "px";
        }
        return;
      }

      if (magnetic.radius <= 0) return;

      var dx = pointer.mouseX - magnetic.cx;
      var dy = pointer.mouseY - magnetic.cy;
      var dist = Math.hypot(dx, dy);
      if (dist < magnetic.radius) {
        var pull = (1 - dist / magnetic.radius) * MAGNETIC_STRENGTH;
        magnetic.offsetX = dx * pull;
        magnetic.offsetY = dy * pull;
      } else {
        magnetic.offsetX *= 0.85;
        magnetic.offsetY *= 0.85;
      }
      magnetic.el.style.translate =
        Math.round(magnetic.offsetX) +
        "px " +
        Math.round(magnetic.offsetY) +
        "px";
    }

    function tick() {
      rafId = 0;
      if (hidden || !pointer.visible) return;

      advanceRing();
      moveRing(pointer.ringX, pointer.ringY);
      tickMagnetic();

      if (needsRaf()) rafId = requestAnimationFrame(tick);
    }

    function startRaf() {
      if (!hidden && pointer.visible && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function show() {
      if (pointer.visible) return;
      pointer.visible = true;
      dot.style.opacity = "";
      ring.style.opacity = "";
    }

    function hide() {
      if (!pointer.visible) return;
      pointer.visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      stopRaf();
    }

    function resetSquash(el) {
      el = el || squashEl;
      if (!el) return;
      if (squashTimer) {
        clearTimeout(squashTimer);
        squashTimer = null;
      }
      el.style.scale = "";
      el.style.transformOrigin = "";
      el.style.transition = "";
      if (squashEl === el) squashEl = null;
    }

    function applySquash(el, event) {
      if (squashEl && squashEl !== el) resetSquash();

      var rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      var ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      var originX = 50 - nx * 50;
      var originY = 50 - ny * 50;
      var stretchX = Math.min(1, Math.abs(nx) * 1.1 + squashConfig.CENTER_MIN);
      var stretchY = Math.min(1, Math.abs(ny) * 1.1 + squashConfig.CENTER_MIN);
      var scaleX = 1 + stretchX * squashConfig.MAX_X;
      var scaleY = 1 + stretchY * squashConfig.MAX_Y;
      var squishX = scaleX * (1 - stretchY * squashConfig.SQUISH);
      var squishY = scaleY * (1 - stretchX * squashConfig.SQUISH);

      if (squashTimer) {
        clearTimeout(squashTimer);
        squashTimer = null;
      }

      el.style.transformOrigin =
        originX.toFixed(2) + "% " + originY.toFixed(2) + "%";
      el.style.transition =
        "scale " +
        squashConfig.PRESS_MS +
        " cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.1s ease";
      squashEl = el;
      el.style.scale = squishX.toFixed(4) + " " + squishY.toFixed(4);
    }

    function releaseSquash() {
      if (!squashEl) return;
      var el = squashEl;
      el.style.transition =
        "scale " +
        squashConfig.RELEASE_MS +
        " cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.scale = "1 1";
      squashTimer = setTimeout(function () {
        if (squashEl === el) resetSquash(el);
      }, 620);
    }

    function setHoverMode(mode) {
      if (hoverMode === mode) return;
      hoverMode = mode;
      ring.classList.toggle("is-link", mode === "link");
      ring.classList.toggle("is-card", mode === "card");
      ring.classList.toggle("is-text", mode === "text");
      dot.classList.toggle("is-text", mode === "text");
    }

    function attachMagnetic(el) {
      if (magnetic.el === el) {
        magnetic.releasing = false;
        startRaf();
        return;
      }
      if (magnetic.el) {
        magnetic.el.style.translate = "";
        if (magnetic.el !== squashEl) resetSquash(magnetic.el);
      }
      magnetic.el = el;
      magnetic.offsetX = 0;
      magnetic.offsetY = 0;
      magnetic.releasing = false;
      measureMagnetic();
      startRaf();
    }

    function releaseMagnetic() {
      if (magnetic.el) {
        magnetic.releasing = true;
        startRaf();
      }
    }

    function closest(node, selector) {
      return node instanceof Element ? node.closest(selector) : null;
    }

    function applyHoverFrom(target) {
      var text = closest(target, TEXT_SELECTOR);
      if (text) {
        setHoverMode("text");
        releaseMagnetic();
        return;
      }

      var magneticTarget = closest(target, MAGNETIC_SELECTOR);
      if (magneticTarget instanceof HTMLElement) {
        setHoverMode("link");
        attachMagnetic(magneticTarget);
        return;
      }

      var link = closest(target, LINK_SELECTOR);
      if (link) {
        setHoverMode("link");
        releaseMagnetic();
        return;
      }

      var card = closest(target, CARD_SELECTOR);
      if (card) {
        setHoverMode("card");
        releaseMagnetic();
        return;
      }

      setHoverMode(null);
      releaseMagnetic();
    }

    function onPointerMove(event) {
      if (event.pointerType && event.pointerType !== "mouse") return;

      pointer.mouseX = event.clientX;
      pointer.mouseY = event.clientY;
      moveDot(pointer.mouseX, pointer.mouseY);
      moveGlow(pointer.mouseX, pointer.mouseY);

      if (!pointer.visible) {
        pointer.ringX = pointer.mouseX;
        pointer.ringY = pointer.mouseY;
        moveRing(pointer.ringX, pointer.ringY);
        show();
        return;
      }

      startRaf();
    }

    function onMouseOver(event) {
      var target = event.target;
      if (target === lastHoverTarget) return;
      lastHoverTarget = target;
      applyHoverFrom(target);
    }

    function onMouseOut(event) {
      if (
        !event.relatedTarget ||
        event.relatedTarget === document.documentElement
      ) {
        lastHoverTarget = null;
        setHoverMode(null);
        releaseMagnetic();
      }
    }

    function onPointerDown(event) {
      if (event.button !== 0) return;
      if (event.pointerType && event.pointerType !== "mouse") return;
      var magneticTarget = closest(event.target, MAGNETIC_SELECTOR);
      if (magneticTarget instanceof HTMLElement) {
        applySquash(magneticTarget, event);
      }
      ring.classList.add("is-pressed");
    }

    function onPointerUp() {
      releaseSquash();
      ring.classList.remove("is-pressed");
    }

    function isPointerInWindow(clientX, clientY) {
      return (
        clientX >= 0 &&
        clientY >= 0 &&
        clientX <= window.innerWidth &&
        clientY <= window.innerHeight
      );
    }

    function onDocumentMouseLeave(event) {
      if (isPointerInWindow(event.clientX, event.clientY)) {
        show();
        return;
      }
      hide();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onDocumentMouseLeave);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", measureMagnetic, { passive: true });
    window.addEventListener("resize", measureMagnetic, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
    document.addEventListener("visibilitychange", function () {
      hidden = document.hidden;
      if (hidden) stopRaf();
      else startRaf();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
