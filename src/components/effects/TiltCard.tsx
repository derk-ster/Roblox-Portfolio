"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type TiltAccent = "cyan" | "purple" | "pink";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  accent?: TiltAccent;
}

const GLOW_RGB: Record<TiltAccent, string> = {
  cyan: "56, 189, 248",
  purple: "139, 92, 246",
  pink: "192, 132, 252",
};

const MAX_DEG = 12;
const HOVER_SCALE = 1.045;
const LERP = 0.22;
const EDGE_LERP = 0.16;
const LIFT_PX = 6;

function pointerAngleDeg(mx: number, my: number, width: number, height: number) {
  const dx = (mx - 0.5) * width;
  const dy = (my - 0.5) * height;
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) return 90;
  return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
}

function edgeGlowGradient(
  mx: number,
  my: number,
  width: number,
  height: number,
  rgb: string
) {
  const angleDeg = pointerAngleDeg(mx, my, width, height);
  const pxX = mx * width;
  const pxY = my * height;
  const edgeProxPx = Math.min(pxX, width - pxX, pxY, height - pxY);
  const edgeFactor = 1 - Math.min(edgeProxPx / (Math.min(width, height) * 0.48), 1);
  const spread = 88 + edgeFactor * 104;
  const peak = 0.55 + edgeFactor * 0.45;
  const mid = 0.32 + edgeFactor * 0.18;
  const half = spread / 2;
  const peakStop = half * 0.55;
  const fromAngle = angleDeg - peakStop;

  return `conic-gradient(from ${fromAngle.toFixed(2)}deg at 50% 50%, transparent 0deg, rgba(${rgb}, 0) ${(half * 0.2).toFixed(2)}deg, rgba(${rgb}, ${peak.toFixed(3)}) ${peakStop.toFixed(2)}deg, rgba(${rgb}, ${mid.toFixed(3)}) ${half.toFixed(2)}deg, rgba(${rgb}, 0) ${(half * 1.35).toFixed(2)}deg, transparent 360deg)`;
}

export function TiltCard({
  children,
  className,
  accent = "cyan",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const rgb = GLOW_RGB[accent];

  const state = useRef({
    rafId: 0,
    active: false,
    targetRx: 0,
    targetRy: 0,
    curRx: 0,
    curRy: 0,
    targetScale: 1,
    curScale: 1,
    mxPct: 50,
    myPct: 50,
    targetMx: 0.5,
    targetMy: 0.5,
    curMx: 0.5,
    curMy: 0.5,
  });

  const applyVars = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const s = state.current;
    el.style.setProperty("--rx", `${s.curRx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${s.curRy.toFixed(2)}deg`);
    el.style.setProperty("--mx", `${s.mxPct.toFixed(1)}%`);
    el.style.setProperty("--my", `${s.myPct.toFixed(1)}%`);
    el.style.setProperty("--tilt-scale", s.curScale.toFixed(3));
    el.style.setProperty("--tilt-lift", `${LIFT_PX}px`);
    el.style.setProperty("--tilt-glow-rgb", rgb);
  }, [rgb]);

  const updateEdgeGlow = useCallback(
    (mx: number, my: number) => {
      const card = ref.current;
      const glow = glowRef.current;
      if (!card || !glow) return;
      const w = card.clientWidth;
      const h = card.clientHeight;
      if (w <= 0 || h <= 0) return;
      glow.style.background = edgeGlowGradient(mx, my, w, h, rgb);
    },
    [rgb]
  );

  const clearEdgeGlow = useCallback(() => {
    glowRef.current?.style.removeProperty("background");
  }, []);

  const edgeGlowSettled = useCallback(() => {
    const s = state.current;
    return (
      Math.abs(s.curMx - s.targetMx) < 0.004 &&
      Math.abs(s.curMy - s.targetMy) < 0.004
    );
  }, []);

  const tickEdgeGlow = useCallback(() => {
    const s = state.current;
    const prevMx = s.curMx;
    const prevMy = s.curMy;
    if (s.active) {
      s.curMx = s.targetMx;
      s.curMy = s.targetMy;
    } else {
      s.curMx += (s.targetMx - s.curMx) * EDGE_LERP;
      s.curMy += (s.targetMy - s.curMy) * EDGE_LERP;
    }
    if (
      Math.abs(s.curMx - prevMx) > 0.003 ||
      Math.abs(s.curMy - prevMy) > 0.003
    ) {
      updateEdgeGlow(s.curMx, s.curMy);
    }
  }, [updateEdgeGlow]);

  const frame = useCallback(() => {
    const el = ref.current;
    const s = state.current;
    if (!el) return;

    if (s.active || !edgeGlowSettled()) tickEdgeGlow();

    s.curRx += (s.targetRx - s.curRx) * LERP;
    s.curRy += (s.targetRy - s.curRy) * LERP;
    s.curScale += (s.targetScale - s.curScale) * LERP;
    applyVars();

    const edgeNeeds = s.active || !edgeGlowSettled();
    const settled =
      Math.abs(s.curRx - s.targetRx) < 0.05 &&
      Math.abs(s.curRy - s.targetRy) < 0.05 &&
      Math.abs(s.curScale - s.targetScale) < 0.002 &&
      !edgeNeeds;

    if (!settled || s.active) {
      s.rafId = requestAnimationFrame(frame);
    } else {
      s.rafId = 0;
      el.classList.remove("is-tilting");
      clearEdgeGlow();
    }
  }, [applyVars, clearEdgeGlow, edgeGlowSettled, tickEdgeGlow]);

  const ensureFrame = useCallback(() => {
    if (!state.current.rafId) {
      state.current.rafId = requestAnimationFrame(frame);
    }
  }, [frame]);

  useEffect(() => {
    const s = state.current;
    return () => {
      if (s.rafId) cancelAnimationFrame(s.rafId);
    };
  }, []);

  const pointerLocal = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return null;
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / w)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / h)),
    };
  };

  const applyPointer = (x: number, y: number) => {
    const s = state.current;
    s.targetMx = x;
    s.targetMy = y;
    s.mxPct = x * 100;
    s.myPct = y * 100;
    s.curMx = x;
    s.curMy = y;
  };

  const handlePointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;

    const s = state.current;
    s.active = true;
    el.classList.add("is-tilting");
    s.targetScale = HOVER_SCALE;

    const pt = pointerLocal(e);
    if (pt) {
      applyPointer(pt.x, pt.y);
      updateEdgeGlow(pt.x, pt.y);
    }
    applyVars();
    ensureFrame();
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !state.current.active) return;
    const pt = pointerLocal(e);
    if (!pt) return;

    const nx = Math.max(-1, Math.min(1, pt.x * 2 - 1));
    const ny = Math.max(-1, Math.min(1, pt.y * 2 - 1));
    const s = state.current;
    s.targetRx = ny * MAX_DEG;
    s.targetRy = -nx * MAX_DEG;
    s.targetMx = pt.x;
    s.targetMy = pt.y;
    s.mxPct = pt.x * 100;
    s.myPct = pt.y * 100;
    ensureFrame();
  };

  const handlePointerLeave = () => {
    const s = state.current;
    s.active = false;
    s.targetRx = 0;
    s.targetRy = 0;
    s.targetScale = 1;
    ensureFrame();
  };

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("tilt-card relative h-full", className)}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <span
        ref={glowRef}
        className="tilt-card-edge-glow"
        aria-hidden
      />
      <div className="tilt-card-inner relative z-[2] h-full [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}
