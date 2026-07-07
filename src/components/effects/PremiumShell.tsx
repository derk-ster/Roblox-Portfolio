"use client";

import type { ReactNode } from "react";
import { BackgroundAtmosphere } from "./BackgroundAtmosphere";

export function PremiumShell({ children }: { children: ReactNode }) {
  return (
    <>
      <BackgroundAtmosphere />
      {children}
    </>
  );
}
