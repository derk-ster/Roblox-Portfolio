"use client";

import { useEffect, useState } from "react";
import { getActiveSectionFromScroll } from "@/lib/section-scroll";
import type { BackgroundSectionId } from "@/lib/background-sections";

export function useActiveSection(): BackgroundSectionId {
  const [active, setActive] = useState<BackgroundSectionId>("home");

  useEffect(() => {
    let raf = 0;
    let last: BackgroundSectionId = "home";

    const update = () => {
      const next = getActiveSectionFromScroll();
      if (next !== last) {
        last = next;
        setActive(next);
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return active;
}
