"use client";

import type { ReactNode } from "react";
import { BackgroundAtmosphere } from "./BackgroundAtmosphere";
import { CustomCursor } from "./CustomCursor";
import { MouseTracker } from "./MouseTracker";

export function PremiumShell({ children }: { children: ReactNode }) {
  return (
    <>
      <MouseTracker />
      <BackgroundAtmosphere />
      <CustomCursor />
      {children}
    </>
  );
}
