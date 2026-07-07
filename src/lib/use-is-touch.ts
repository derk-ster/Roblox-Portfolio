"use client";

import { useEffect, useState } from "react";

export function useIsTouchDevice(): boolean {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setTouch(
        mq.matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return touch;
}
