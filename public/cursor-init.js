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

  var TEXT_SELECTOR =
    'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), textarea, [contenteditable="true"]';
  var LINK_SELECTOR =
    'a, button, [role="button"], summary, label[for], select, .marquee-scrubber, [data-chat-toggle], [data-chat-send], [data-chat-close]';
  var CARD_SELECTOR =
    ".tilt-card, .calm-card, .certification-trigger, .impact-card";
  var MAGNETIC_SELECTOR = ".magnetic";
  var PANEL_SCROLL_SELECTOR = ".scrollbar-visible, .scrollbar-thin";

  var priority = new Set();
  var rafId = 0;
  var hidden = document.hidden;

  function ensureRaf() {
    if (!hidden && priority.size > 0 && !rafId) {
      rafId = requestAnimationFrame(tickRaf);
    }
  }

  function tickRaf(now) {
    rafId = 0;
    if (hidden || priority.size === 0) return;
    priority.forEach(function (fn) {
      try {
        fn(now);
      } catch (error) {
        console.error("cursor raf error", error);
      }
    });
    if (priority.size > 0) rafId = requestAnimationFrame(tickRaf);
  }

  function subscribeRaf(fn) {
    priority.add(fn);
    ensureRaf();
    return function () {
      priority.delete(fn);
      if (!priority.size && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
  }

  document.addEventListener("visibilitychange", function () {
    hidden = document.hidden;
    if (hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      ensureRaf();
    }
  });

  function closest(node, selector) {
    return node instanceof Element ? node.closest(selector) : null;
  }

  function magneticOffset(x, y) {
    if (!x && !y) return "";
    return Math.round(x) + "px " + Math.round(y) + "px";
  }

  function ringEaseForGap(gap) {
    if (gap > 30) return 0.32;
    if (gap > 14) return 0.3;
    if (gap > 5) return 0.27;
    return 0.23;
  }

  function advanceRing(pointer) {
    var dx = pointer.mouseX - pointer.ringX;
    var dy = pointer.mouseY - pointer.ringY;
    var gap = Math.hypot(dx, dy);

    if (gap < RING_SETTLED_PX) {
      pointer.ringX = pointer.mouseX;
      pointer.ringY = pointer.mouseY;
      return gap;
    }

    var ease = ringEaseForGap(gap);
    pointer.ringX += dx * ease;
    pointer.ringY += dy * ease;
    return gap;
  }

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

  var unsubscribeRaf = null;
  var squashEl = null;
  var squashTimer = null;
  var hoverMode = null;

  var squashConfig = {
    MAX_X: 0.075,
    MAX_Y: 0.06,
    SQUISH: 0.028,
    CENTER_MIN: 0.32,
    PRESS_MS: "0.14s",
    RELEASE_MS: "0.58s",
  };

  function moveDot(x, y) {
    dot.style.translate = x + "px " + y + "px";
  }

  function moveRing(x, y) {
    ring.style.translate = x + "px " + y + "px";
  }

  function moveGlow(x, y) {
    if (!glow) {
      glow = document.querySelector(".mouse-glow-bg");
    }
    if (glow) {
      glow.style.translate = x + "px " + y + "px";
    }
  }

  function ringSettled() {
    return (
      Math.abs(pointer.mouseX - pointer.ringX) < RING_SETTLED_PX &&
      Math.abs(pointer.mouseY - pointer.ringY) < RING_SETTLED_PX
    );
  }

  function magneticActive() {
    if (!magnetic.el) return false;
    if (magnetic.releasing) {
      return (
        Math.abs(magnetic.offsetX) >= 0.15 ||
        Math.abs(magnetic.offsetY) >= 0.15
      );
    }
    if (
      Math.abs(magnetic.offsetX) >= 0.15 ||
      Math.abs(magnetic.offsetY) >= 0.15
    ) {
      return true;
    }
    if (magnetic.radius <= 0) return false;
    var dx = pointer.mouseX - magnetic.cx;
    var dy = pointer.mouseY - magnetic.cy;
    return Math.hypot(dx, dy) < magnetic.radius;
  }

  function needsRaf() {
    return !ringSettled() || magneticActive();
  }

  function stopRaf() {
    if (unsubscribeRaf) {
      unsubscribeRaf();
      unsubscribeRaf = null;
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

  function tick() {
    if (!pointer.visible) {
      stopRaf();
      return;
    }

    advanceRing(pointer);
    moveRing(pointer.ringX, pointer.ringY);

    if (magnetic.el) {
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
          magnetic.el.style.translate = magneticOffset(
            magnetic.offsetX,
            magnetic.offsetY
          );
        }
      } else if (magnetic.radius > 0) {
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
        magnetic.el.style.translate = magneticOffset(
          magnetic.offsetX,
          magnetic.offsetY
        );
      }
    }

    if (!needsRaf()) stopRaf();
  }

  function startRaf() {
    if (!unsubscribeRaf) {
      unsubscribeRaf = subscribeRaf(tick);
    }
  }

  function show() {
    if (!pointer.visible) {
      pointer.visible = true;
      dot.style.opacity = "";
      ring.style.opacity = "";
    }
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

    el.style.transformOrigin = originX.toFixed(2) + "% " + originY.toFixed(2) + "%";
    el.style.transition =
      "scale " +
      squashConfig.PRESS_MS +
      " cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.1s ease";
    squashEl = el;

    requestAnimationFrame(function () {
      el.style.scale = squishX.toFixed(4) + " " + squishY.toFixed(4);
    });
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
    ring.classList.remove("is-link", "is-card", "is-text");
    dot.classList.remove("is-text");
    if (mode === "link") ring.classList.add("is-link");
    else if (mode === "card") ring.classList.add("is-card");
    else if (mode === "text") {
      ring.classList.add("is-text");
      dot.classList.add("is-text");
    }
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

  function onPointer(event) {
    pointer.mouseX = event.clientX;
    pointer.mouseY = event.clientY;
    moveDot(event.clientX, event.clientY);
    moveGlow(event.clientX, event.clientY);

    if (!pointer.visible) {
      pointer.ringX = pointer.mouseX;
      pointer.ringY = pointer.mouseY;
      moveRing(pointer.ringX, pointer.ringY);
      show();
      return;
    }

    advanceRing(pointer);
    moveRing(pointer.ringX, pointer.ringY);

    if (needsRaf()) startRaf();
  }

  function onPointerMove(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    onPointer(event);
  }

  function onMouseOver(event) {
    var target = event.target;
    if (closest(target, TEXT_SELECTOR)) {
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

    if (closest(target, LINK_SELECTOR)) {
      setHoverMode("link");
      releaseMagnetic();
      return;
    }

    if (closest(target, CARD_SELECTOR)) {
      setHoverMode("card");
      releaseMagnetic();
      return;
    }

    setHoverMode(null);
    releaseMagnetic();
  }

  function onMouseOut(event) {
    if (
      !event.relatedTarget ||
      event.relatedTarget === document.documentElement
    ) {
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

  function isPointerInElementBox(el, clientX, clientY) {
    var rect = el.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  function isOverPageScrollbar(clientX, clientY) {
    var scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth <= 0) return false;
    return (
      clientX >= document.documentElement.clientWidth &&
      clientY >= 0 &&
      clientY <= window.innerHeight
    );
  }

  function isOverPanelScrollbar(clientX, clientY) {
    var nodes = document.querySelectorAll(PANEL_SCROLL_SELECTOR);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!(el instanceof HTMLElement)) continue;
      if (!isPointerInElementBox(el, clientX, clientY)) continue;

      var rect = el.getBoundingClientRect();
      var scrollbarWidth = el.offsetWidth - el.clientWidth;
      var scrollbarHeight = el.offsetHeight - el.clientHeight;

      if (
        scrollbarWidth > 0 &&
        clientX >= rect.right - scrollbarWidth &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return true;
      }

      if (
        scrollbarHeight > 0 &&
        clientY >= rect.bottom - scrollbarHeight &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right
      ) {
        return true;
      }
    }
    return false;
  }

  function isOverAnyScrollbar(clientX, clientY) {
    return (
      isOverPageScrollbar(clientX, clientY) ||
      isOverPanelScrollbar(clientX, clientY)
    );
  }

  function onDocumentMouseLeave(event) {
    // Native scrollbar gutters sit outside the document box on Windows;
    // keep the custom cursor visible while the pointer is still in-window.
    if (isPointerInWindow(event.clientX, event.clientY)) {
      show();
      return;
    }
    hide();
  }

  function onPanelScrollMouseLeave(event) {
    var el = event.currentTarget;
    if (el instanceof HTMLElement) {
      if (isPointerInElementBox(el, event.clientX, event.clientY)) {
        show();
        return;
      }
    }
    if (isPointerInWindow(event.clientX, event.clientY)) {
      show();
    }
  }

  var boundPanelScrolls = new WeakSet();

  function bindPanelScrollTargets() {
    document.querySelectorAll(PANEL_SCROLL_SELECTOR).forEach(function (node) {
      if (!(node instanceof HTMLElement) || boundPanelScrolls.has(node)) return;
      boundPanelScrolls.add(node);
      node.addEventListener("mouseleave", onPanelScrollMouseLeave, {
        passive: true,
      });
    });
  }

  function onPointerMoveTracked(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    onPointer(event);
    if (isOverAnyScrollbar(event.clientX, event.clientY)) {
      show();
    }
  }

  window.addEventListener("pointermove", onPointerMoveTracked, {
    passive: true,
    capture: true,
  });
  window.addEventListener("mousemove", function (event) {
    if (!pointer.visible && isPointerInWindow(event.clientX, event.clientY)) {
      onPointer(event);
    }
    if (isOverAnyScrollbar(event.clientX, event.clientY)) {
      show();
    }
  }, { passive: true });
  window.addEventListener("pointerenter", onPointerMoveTracked);
  document.addEventListener("mouseleave", onDocumentMouseLeave);
  window.addEventListener("blur", hide);
  window.addEventListener("scroll", measureMagnetic, {
    passive: true,
    capture: true,
  });
  window.addEventListener("resize", measureMagnetic, { passive: true });
  document.addEventListener("mouseover", onMouseOver);
  document.addEventListener("mouseout", onMouseOut);
  document.addEventListener("mousedown", function () {
    ring.classList.add("is-pressed");
  });
  document.addEventListener("mouseup", function () {
    ring.classList.remove("is-pressed");
  });
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("pointerup", onPointerUp);
  document.addEventListener("pointercancel", onPointerUp);

  bindPanelScrollTargets();
  var panelScrollObserver = new MutationObserver(function () {
    bindPanelScrollTargets();
  });
  panelScrollObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
