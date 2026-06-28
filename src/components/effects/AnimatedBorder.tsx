"use client";

import { type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  borderClassName?: string;
  glow?: boolean;
  accent?: "cyan" | "purple" | "pink" | "orange" | "lime";
}

const accentBorders: Record<string, string> = {
  cyan: "from-cyan/30 via-blue/20 to-purple/25",
  purple: "from-purple/30 via-pink/20 to-cyan/20",
  pink: "from-pink/30 via-purple/20 to-cyan/20",
  orange: "from-orange/30 via-lime/15 to-cyan/20",
  lime: "from-lime/25 via-cyan/20 to-purple/20",
};

export function AnimatedBorder({
  children,
  className,
  borderClassName,
  glow = true,
  accent = "cyan",
}: AnimatedBorderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group/border relative rounded-2xl p-px transition-shadow duration-300",
        glow && "hover:shadow-[0_8px_32px_rgba(56,189,248,0.08)]",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-80 transition-opacity duration-300 group-hover/border:opacity-100",
          accentBorders[accent],
          borderClassName,
          reducedMotion && "opacity-100"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative rounded-2xl bg-panel inner-glow",
          glow && "group-hover/border:inner-glow-accent"
        )}
        style={
          glow
            ? ({ "--glow-color": "rgba(56, 189, 248, 0.07)" } as CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
