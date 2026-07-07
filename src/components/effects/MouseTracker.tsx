"use client";

import { useEffect } from "react";
import { useIsTouchDevice } from "@/lib/use-is-touch";

/** Updates global --mouse-x / --mouse-y on mousemove only (no RAF loop). */
export function MouseTracker() {
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [isTouch]);

  return null;
}
