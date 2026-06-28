"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface MouseGlowProps {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
}

export function MouseGlow({
  children,
  className = "",
  color = "rgba(56, 189, 248, 0.12)",
  size = 360,
}: MouseGlowProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [glow, setGlow] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => setMounted(true), []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    setGlow({ x: e.clientX, y: e.clientY, visible: true });
  };

  const handleLeave = () => {
    setGlow((prev) => ({ ...prev, visible: false }));
  };

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const half = size / 2;

  const glowPortal =
    mounted && glow.visible
      ? createPortal(
          <motion.div
            className="pointer-events-none fixed z-[5] rounded-full blur-3xl"
            style={{
              width: size,
              height: size,
              left: glow.x - half,
              top: glow.y - half,
              background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
          />,
          document.body
        )
      : null;

  return (
    <>
      {glowPortal}
      <div
        className={cn("relative", className)}
        onMouseMove={handleMove}
        onMouseEnter={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </div>
    </>
  );
}
