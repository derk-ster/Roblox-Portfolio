"use client";

import { useEffect, useRef } from "react";
import { useIsTouchDevice } from "@/lib/use-is-touch";

export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch) return;

    const move = (x: number, y: number) => {
      const transform = `translate(${x}px, ${y}px)`;
      if (dotRef.current) dotRef.current.style.transform = transform;
      if (ringRef.current) ringRef.current.style.transform = transform;
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onPointerMove = (e: PointerEvent) => move(e.clientX, e.clientY);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("pointermove", onPointerMove, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointermove", onPointerMove, true);
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
