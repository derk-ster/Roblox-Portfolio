"use client";

import dynamic from "next/dynamic";

const ScrollSceneBackdrop = dynamic(
  () =>
    import("@/components/home/ScrollSceneBackdrop").then(
      (m) => m.ScrollSceneBackdrop
    ),
  { ssr: false }
);

export function ScrollSceneBackdropLoader() {
  return <ScrollSceneBackdrop />;
}
