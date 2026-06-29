"use client";

import {
  createContext,
  useCallback,
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
  layerOpacityRef: RefObject<number[]>;
  subscribeLayerVisibility: (listener: () => void) => () => void;
  notifyLayerVisibility: () => void;
}

const SceneInteractionContext =
  createContext<SceneInteractionContextValue | null>(null);

export function SceneInteractionProvider({ children }: { children: ReactNode }) {
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const phaseCountRef = useRef(6);
  const layerOpacityRef = useRef<number[]>([]);
  const listenersRef = useRef(new Set<() => void>());

  const subscribeLayerVisibility = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const notifyLayerVisibility = useCallback(() => {
    listenersRef.current.forEach((listener) => listener());
  }, []);

  return (
    <SceneInteractionContext.Provider
      value={{
        mouseRef,
        scrollRef,
        phaseCountRef,
        layerOpacityRef,
        subscribeLayerVisibility,
        notifyLayerVisibility,
      }}
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
