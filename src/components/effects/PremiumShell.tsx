"use client";

import type { ReactNode } from "react";
import { BackgroundAtmosphere } from "./BackgroundAtmosphere";
import { CustomCursor } from "./CustomCursor";

export function PremiumShell({ children }: { children: ReactNode }) {
  return (
    <>
      <BackgroundAtmosphere />
      <CustomCursor />
      {children}
    </>
  );
}
