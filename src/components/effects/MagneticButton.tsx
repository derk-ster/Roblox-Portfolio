"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/** Wrapper for elements pulled by the shared custom cursor (cursor-init.js). */
export function MagneticButton({
  children,
  className,
  ...props
}: MagneticButtonProps) {
  return (
    <div className={cn("magnetic inline-flex", className)} {...props}>
      {children}
    </div>
  );
}
