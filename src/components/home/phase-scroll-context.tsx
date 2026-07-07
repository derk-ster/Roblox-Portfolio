"use client";

import { createContext, type ReactNode } from "react";

const PhaseScrollIndexContext = createContext(0);

export { PhaseScrollIndexContext };

export function PhaseScrollProvider({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <PhaseScrollIndexContext.Provider value={index}>
      {children}
    </PhaseScrollIndexContext.Provider>
  );
}
