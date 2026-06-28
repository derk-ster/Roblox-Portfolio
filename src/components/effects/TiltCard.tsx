"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({
  children,
  className,
  intensity = 3,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const target = useRef({ rotateX: 0, rotateY: 0 });
  const current = useRef({ rotateX: 0, rotateY: 0 });

  const applyTransform = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const ease = hoveringRef.current ? 0.12 : 0.08;
    current.current.rotateX +=
      (target.current.rotateX - current.current.rotateX) * ease;
    current.current.rotateY +=
      (target.current.rotateY - current.current.rotateY) * ease;

    el.style.transform = `perspective(900px) rotateX(${current.current.rotateX.toFixed(2)}deg) rotateY(${current.current.rotateY.toFixed(2)}deg)`;

    const settled =
      Math.abs(target.current.rotateX - current.current.rotateX) < 0.02 &&
      Math.abs(target.current.rotateY - current.current.rotateY) < 0.02 &&
      !hoveringRef.current;

    if (!settled) {
      rafRef.current = requestAnimationFrame(applyTransform);
    } else {
      rafRef.current = null;
      if (!hoveringRef.current) {
        el.style.transform = "";
        current.current = { rotateX: 0, rotateY: 0 };
      }
    }
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(applyTransform);
    }
  }, [applyTransform]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    target.current = {
      rotateX: -y * intensity,
      rotateY: x * intensity,
    };
    startLoop();
  };

  const handleMouseEnter = () => {
    hoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    hoveringRef.current = false;
    target.current = { rotateX: 0, rotateY: 0 };
    startLoop();
  };

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn("relative will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
