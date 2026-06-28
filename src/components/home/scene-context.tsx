"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

export interface MousePosition {
  x: number;
  y: number;
}

interface SceneInteractionContextValue {
  mouseRef: RefObject<MousePosition>;
  scrollRef: RefObject<number>;
  phaseCountRef: RefObject<number>;
}

const SceneInteractionContext =
  createContext<SceneInteractionContextValue | null>(null);

export function SceneInteractionProvider({ children }: { children: ReactNode }) {
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const phaseCountRef = useRef(6);

  return (
    <SceneInteractionContext.Provider
      value={{ mouseRef, scrollRef, phaseCountRef }}
    >
      {children}
    </SceneInteractionContext.Provider>
  );
}

export function useSceneInteraction() {
  const ctx = useContext(SceneInteractionContext);
  if (!ctx) {
    throw new Error("useSceneInteraction must be used within SceneInteractionProvider");
  }
  return ctx;
}
