"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useIsTouchDevice } from "@/lib/use-is-touch";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** Pull strength toward the cursor (0–1) */
  strength?: number;
  /** Pixels from center where pull reaches zero */
  influenceRadius?: number;
}

/**
 * Pulls a button toward the cursor while hovered; eases back when the pointer
 * leaves or moves outside the influence radius.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.38,
  influenceRadius = 140,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const apply = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const ease = hoveringRef.current ? 0.18 : 0.12;
    current.current.x += (target.current.x - current.current.x) * ease;
    current.current.y += (target.current.y - current.current.y) * ease;

    const { x, y } = current.current;
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

    const settled =
      Math.abs(target.current.x - x) < 0.15 &&
      Math.abs(target.current.y - y) < 0.15 &&
      !hoveringRef.current;

    if (!settled) {
      rafRef.current = requestAnimationFrame(apply);
    } else {
      rafRef.current = null;
      if (!hoveringRef.current) {
        el.style.transform = "";
        current.current = { x: 0, y: 0 };
      }
    }
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(apply);
    }
  }, [apply]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - dist / influenceRadius);

    target.current = {
      x: dx * strength * falloff,
      y: dy * strength * falloff,
    };
    startLoop();
  };

  const handleEnter = () => {
    hoveringRef.current = true;
  };

  const handleLeave = () => {
    hoveringRef.current = false;
    target.current = { x: 0, y: 0 };
    startLoop();
  };

  if (isTouch) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("magnetic-btn inline-flex", className)}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </div>
  );
}
