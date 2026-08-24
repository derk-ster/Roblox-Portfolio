"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LazyMountProps {
  children: ReactNode;
  className?: string;
  /** Keep layout stable until the real content mounts. */
  minHeight?: string;
  /** Start loading before the block is on screen. */
  rootMargin?: string;
}

/**
 * Mounts children only when they are near the viewport, then keeps them mounted.
 * Off-screen sections never pay React/image cost until you scroll close.
 */
export function LazyMount({
  children,
  className,
  minHeight = "24rem",
  rootMargin = "640px 0px",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown, rootMargin]);

  const style: CSSProperties | undefined = shown ? undefined : { minHeight };

  return (
    <div ref={ref} className={cn(className)} style={style}>
      {shown ? children : null}
    </div>
  );
}
