"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScrollSceneBackdrop = dynamic(
  () =>
    import("@/components/home/ScrollSceneBackdrop").then(
      (m) => m.ScrollSceneBackdrop
    ),
  { ssr: false }
);

function scheduleIdle(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const requestIdle = window.requestIdleCallback?.bind(window);
  if (requestIdle) {
    const id = requestIdle(callback, { timeout: 250 });
    return () => window.cancelIdleCallback(id);
  }

  const timeout = window.setTimeout(callback, 1);
  return () => window.clearTimeout(timeout);
}

/** Defer WebGL until the first paint so hero content is not blocked. */
export function ScrollSceneBackdropLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => scheduleIdle(() => setReady(true)), []);

  if (!ready) return null;
  return <ScrollSceneBackdrop />;
}
