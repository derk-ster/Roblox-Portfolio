"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Light CSS-only card wrapper — no tilt, no per-card mouse tracking. */
export function GlowCard({ children, className, style }: GlowCardProps) {
  return (
    <div
      className={cn(
        "calm-card transition-transform duration-300 hover:-translate-y-0.5",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
