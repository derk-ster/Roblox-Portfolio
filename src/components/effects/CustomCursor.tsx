"use client";

import { useEffect, useRef } from "react";
import { useIsTouchDevice } from "@/lib/use-is-touch";

/** Ring follow speed — frame-rate independent; higher = snappier trail. */
const RING_SMOOTHING = 24;

export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    targetX: -200,
    targetY: -200,
    ringX: -200,
    ringY: -200,
    visible: false,
    rafId: 0,
    lastTime: 0,
  });

  useEffect(() => {
    if (isTouch) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const move = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    };

    const tick = (now: number) => {
      const s = stateRef.current;
      s.rafId = requestAnimationFrame(tick);

      if (!s.visible) return;

      const dt = s.lastTime
        ? Math.min(0.05, (now - s.lastTime) / 1000)
        : 1 / 60;
      s.lastTime = now;

      move(dot, s.targetX, s.targetY);

      const blend = 1 - Math.exp(-RING_SMOOTHING * dt);
      s.ringX += (s.targetX - s.ringX) * blend;
      s.ringY += (s.targetY - s.ringY) * blend;
      move(ring, s.ringX, s.ringY);

      root.style.setProperty(
        "--mouse-x",
        `${(s.targetX / window.innerWidth) * 100}%`
      );
      root.style.setProperty(
        "--mouse-y",
        `${(s.targetY / window.innerHeight) * 100}%`
      );
    };

    stateRef.current.rafId = requestAnimationFrame(tick);

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;

      const s = stateRef.current;
      s.targetX = e.clientX;
      s.targetY = e.clientY;

      if (!s.visible) {
        s.visible = true;
        s.ringX = e.clientX;
        s.ringY = e.clientY;
        s.lastTime = 0;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const hide = () => {
      const s = stateRef.current;
      if (!s.visible) return;
      s.visible = false;
      s.lastTime = 0;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
      document.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      root.classList.remove("has-custom-cursor");
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
