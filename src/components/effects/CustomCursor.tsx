"use client";

import { useEffect } from "react";
import { subscribePriorityRaf } from "@/lib/raf-bus";

const RING_EASE = 0.28;
const RING_SETTLED_PX = 0.45;
const MAGNETIC_STRENGTH = 0.25;
const MAGNETIC_RELEASE = 0.78;

const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), textarea, [contenteditable="true"]';

const LINK_SELECTOR =
  'a, button, [role="button"], summary, label[for], select, .marquee-scrubber, [data-chat-toggle], [data-chat-send], [data-chat-close]';

const CARD_SELECTOR =
  ".tilt-card, .calm-card, .certification-trigger, .impact-card";

const MAGNETIC_SELECTOR = ".magnetic";

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

function closestTarget(node: EventTarget | null, selector: string) {
  return node instanceof Element ? node.closest(selector) : null;
}

function magneticOffset(x: number, y: number) {
  if (x === 0 && y === 0) return "";
  return `${Math.round(x)}px ${Math.round(y)}px`;
}

/**
 * Desktop custom cursor — ported from dereks-website-services.com Layout script.
 * Dot snaps on mousemove; ring eases via on-demand RAF only while catching up.
 */
export function CustomCursor() {
  useEffect(() => {
    if (!canUseCustomCursor()) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ringEase = reducedMotion ? 1 : RING_EASE;

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");

    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");

    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.body.classList.add("has-custom-cursor");

    const pointer = {
      mouseX: -200,
      mouseY: -200,
      ringX: -200,
      ringY: -200,
      visible: false,
    };

    const magnetic = {
      el: null as HTMLElement | null,
      offsetX: 0,
      offsetY: 0,
      releasing: false,
      cx: 0,
      cy: 0,
      radius: 0,
    };

    let unsubscribeRaf: (() => void) | null = null;
    let squashEl: HTMLElement | null = null;
    let squashTimer: ReturnType<typeof setTimeout> | null = null;

    const squashConfig = {
      MAX_X: 0.075,
      MAX_Y: 0.06,
      SQUISH: 0.028,
      CENTER_MIN: 0.32,
      PRESS_MS: "0.14s",
      RELEASE_MS: "0.58s",
    };

    const moveDot = (x: number, y: number) => {
      dot.style.translate = `${x}px ${y}px`;
    };

    const moveRing = (x: number, y: number) => {
      ring.style.translate = `${x}px ${y}px`;
    };

    const updateMouseGlow = (x: number, y: number) => {
      const root = document.documentElement;
      root.style.setProperty(
        "--mouse-x",
        `${(x / window.innerWidth) * 100}%`
      );
      root.style.setProperty(
        "--mouse-y",
        `${(y / window.innerHeight) * 100}%`
      );
    };

    const ringSettled = () =>
      Math.abs(pointer.mouseX - pointer.ringX) < RING_SETTLED_PX &&
      Math.abs(pointer.mouseY - pointer.ringY) < RING_SETTLED_PX;

    const magneticActive = () => {
      if (!magnetic.el || reducedMotion) return false;
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
      const dx = pointer.mouseX - magnetic.cx;
      const dy = pointer.mouseY - magnetic.cy;
      return Math.hypot(dx, dy) < magnetic.radius;
    };

    const needsRaf = () => !ringSettled() || magneticActive();

    const stopRaf = () => {
      if (unsubscribeRaf) {
        unsubscribeRaf();
        unsubscribeRaf = null;
      }
    };

    const measureMagnetic = () => {
      if (!magnetic.el) return;
      const rect = magnetic.el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      magnetic.cx = rect.left + rect.width / 2;
      magnetic.cy = rect.top + rect.height / 2;
      magnetic.radius = Math.max(rect.width, rect.height) * 0.95;
    };

    const tick = () => {
      if (!pointer.visible) {
        stopRaf();
        return;
      }

      pointer.ringX += (pointer.mouseX - pointer.ringX) * ringEase;
      pointer.ringY += (pointer.mouseY - pointer.ringY) * ringEase;
      moveRing(pointer.ringX, pointer.ringY);

      if (magnetic.el && !reducedMotion) {
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
          const dx = pointer.mouseX - magnetic.cx;
          const dy = pointer.mouseY - magnetic.cy;
          const dist = Math.hypot(dx, dy);
          if (dist < magnetic.radius) {
            const pull = (1 - dist / magnetic.radius) * MAGNETIC_STRENGTH;
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
    };

    const startRaf = () => {
      if (!unsubscribeRaf) {
        unsubscribeRaf = subscribePriorityRaf(tick);
      }
    };

    const show = () => {
      if (!pointer.visible) {
        pointer.visible = true;
        dot.style.opacity = "";
        ring.style.opacity = "";
      }
    };

    const hide = () => {
      if (!pointer.visible) return;
      pointer.visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      stopRaf();
    };

    const resetSquash = (el: HTMLElement | null = squashEl) => {
      if (!el) return;
      if (squashTimer) {
        clearTimeout(squashTimer);
        squashTimer = null;
      }
      el.style.scale = "";
      el.style.transformOrigin = "";
      el.style.transition = "";
      if (squashEl === el) squashEl = null;
    };

    const applySquash = (el: HTMLElement, event: PointerEvent) => {
      if (reducedMotion) return;
      if (squashEl && squashEl !== el) resetSquash();

      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const originX = 50 - nx * 50;
      const originY = 50 - ny * 50;
      const stretchX = Math.min(
        1,
        Math.abs(nx) * 1.1 + squashConfig.CENTER_MIN
      );
      const stretchY = Math.min(
        1,
        Math.abs(ny) * 1.1 + squashConfig.CENTER_MIN
      );
      const scaleX = 1 + stretchX * squashConfig.MAX_X;
      const scaleY = 1 + stretchY * squashConfig.MAX_Y;
      const squishX = scaleX * (1 - stretchY * squashConfig.SQUISH);
      const squishY = scaleY * (1 - stretchX * squashConfig.SQUISH);

      if (squashTimer) {
        clearTimeout(squashTimer);
        squashTimer = null;
      }

      el.style.transformOrigin = `${originX.toFixed(2)}% ${originY.toFixed(2)}%`;
      el.style.transition = `scale ${squashConfig.PRESS_MS} cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.1s ease`;
      squashEl = el;

      requestAnimationFrame(() => {
        el.style.scale = `${squishX.toFixed(4)} ${squishY.toFixed(4)}`;
      });
    };

    const releaseSquash = () => {
      if (!squashEl || reducedMotion) return;
      const el = squashEl;
      el.style.transition = `scale ${squashConfig.RELEASE_MS} cubic-bezier(0.34, 1.56, 0.64, 1)`;
      el.style.scale = "1 1";
      squashTimer = setTimeout(() => {
        if (squashEl === el) resetSquash(el);
      }, 620);
    };

    const setHoverMode = (mode: "link" | "card" | "text" | null) => {
      ring.classList.remove("is-link", "is-card", "is-text");
      dot.classList.remove("is-text");

      if (mode === "link") ring.classList.add("is-link");
      else if (mode === "card") ring.classList.add("is-card");
      else if (mode === "text") {
        ring.classList.add("is-text");
        dot.classList.add("is-text");
      }
    };

    const attachMagnetic = (el: HTMLElement) => {
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
    };

    const releaseMagnetic = () => {
      if (magnetic.el) {
        magnetic.releasing = true;
        startRaf();
      }
    };

    const onPointer = (event: { clientX: number; clientY: number }) => {
      pointer.mouseX = event.clientX;
      pointer.mouseY = event.clientY;
      moveDot(event.clientX, event.clientY);
      updateMouseGlow(event.clientX, event.clientY);

      if (!pointer.visible) {
        pointer.ringX = pointer.mouseX;
        pointer.ringY = pointer.mouseY;
        moveRing(pointer.ringX, pointer.ringY);
        show();
        return;
      }

      startRaf();
    };

    const onMouseMove = (event: MouseEvent) => {
      onPointer(event);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      onPointer(event);
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target;
      if (closestTarget(target, TEXT_SELECTOR)) {
        setHoverMode("text");
        releaseMagnetic();
        return;
      }

      const magneticTarget = closestTarget(target, MAGNETIC_SELECTOR);
      if (magneticTarget instanceof HTMLElement) {
        setHoverMode("link");
        attachMagnetic(magneticTarget);
        return;
      }

      if (closestTarget(target, LINK_SELECTOR)) {
        setHoverMode("link");
        releaseMagnetic();
        return;
      }

      if (closestTarget(target, CARD_SELECTOR)) {
        setHoverMode("card");
        releaseMagnetic();
        return;
      }

      setHoverMode(null);
      releaseMagnetic();
    };

    const onMouseOut = (event: MouseEvent) => {
      if (
        !event.relatedTarget ||
        event.relatedTarget === document.documentElement
      ) {
        setHoverMode(null);
        releaseMagnetic();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (event.pointerType && event.pointerType !== "mouse") return;
      const magneticTarget = closestTarget(event.target, MAGNETIC_SELECTOR);
      if (magneticTarget instanceof HTMLElement) {
        applySquash(magneticTarget, event);
      }
      ring.classList.add("is-pressed");
    };

    const onPointerUp = () => {
      releaseSquash();
      ring.classList.remove("is-pressed");
    };

    const onMouseDown = () => ring.classList.add("is-pressed");
    const onMouseUp = () => ring.classList.remove("is-pressed");

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseenter", onMouseMove);
    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
      capture: true,
    });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", measureMagnetic, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", measureMagnetic, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    return () => {
      stopRaf();
      if (squashTimer) clearTimeout(squashTimer);
      resetSquash();
      if (magnetic.el) magnetic.el.style.translate = "";

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseMove);
      window.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", measureMagnetic, true);
      window.removeEventListener("resize", measureMagnetic);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);

      dot.remove();
      ring.remove();
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return null;
}
