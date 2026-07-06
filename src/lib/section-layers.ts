import type { ComponentType } from "react";
import type { BackgroundSectionId } from "@/lib/background-sections";

export interface BackgroundLayer {
  /** Page section IDs that activate this backdrop layer. */
  sections: BackgroundSectionId[];
  /** Dynamic import key — resolved in ScrollSceneBackdrop. */
  scene: BackgroundSceneId;
}

export type BackgroundSceneId =
  | "hero"
  | "showcase"
  | "scripting"
  | "animation"
  | "vfx"
  | "building"
  | "modeling"
  | "work-with-me";

/**
 * Each layer maps one or more page sections to a themed 3D scene.
 * Sections sharing a layer (e.g. why-hire-me + commission-process) keep the same backdrop.
 */
export const BACKGROUND_LAYERS: BackgroundLayer[] = [
  { sections: ["home"], scene: "hero" },
  { sections: ["best-work"], scene: "showcase" },
  { sections: ["scripting"], scene: "scripting" },
  { sections: ["animation"], scene: "animation" },
  { sections: ["vfx"], scene: "vfx" },
  { sections: ["building"], scene: "building" },
  { sections: ["modeling"], scene: "modeling" },
  {
    sections: ["why-hire-me", "commission-process"],
    scene: "work-with-me",
  },
];

const SECTION_TO_LAYER = new Map<BackgroundSectionId, number>(
  BACKGROUND_LAYERS.flatMap((layer, index) =>
    layer.sections.map((section) => [section, index] as const)
  )
);

export function getLayerIndexForSection(
  section: BackgroundSectionId
): number {
  return SECTION_TO_LAYER.get(section) ?? 0;
}

export type SceneComponentMap = Record<BackgroundSceneId, ComponentType>;
