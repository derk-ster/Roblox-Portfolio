import type { PortfolioAsset } from "@/types/portfolio";

export const PLACEHOLDER_ASSETS: Record<string, PortfolioAsset[]> = {
  "best-work": [
    {
      id: "placeholder-best-1",
      title: "Movement System Demo",
      category: "best-work",
      src: "/placeholder/demo-scripting.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder. Add your best work to public/assets/best-work.",
      tags: ["Lua", "Movement", "Demo"],
      date: "Placeholder",
      status: "Completed",
      featured: true,
      order: 1,
    },
    {
      id: "placeholder-best-2",
      title: "Combat Animation Reel",
      category: "best-work",
      src: "/placeholder/demo-animation.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder. Showcase your top animation clips here.",
      tags: ["Animation", "Combat", "Demo"],
      date: "Placeholder",
      status: "Completed",
      featured: true,
      order: 2,
    },
  ],
  scripting: [
    {
      id: "placeholder-script-1",
      title: "R6 Movement System",
      category: "scripting",
      src: "/placeholder/demo-scripting.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder for a movement system project. Add clips to public/assets/scripting.",
      tags: ["Lua", "Roblox Studio", "Movement", "R6"],
      date: "Placeholder",
      status: "Completed",
      featured: false,
      order: 1,
    },
  ],
  animation: [
    {
      id: "placeholder-anim-1",
      title: "Combat Animation Set",
      category: "animation",
      src: "/placeholder/demo-animation.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder for animation work. Add videos to public/assets/animation.",
      tags: ["Animation", "Combat", "R6", "Commission"],
      date: "Placeholder",
      status: "Completed",
      featured: false,
      order: 1,
    },
  ],
  vfx: [
    {
      id: "placeholder-vfx-1",
      title: "Dash VFX Effect",
      category: "vfx",
      src: "/placeholder/demo-vfx.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder for VFX clips. Add media to public/assets/vfx.",
      tags: ["Roblox VFX", "Particles", "Dash"],
      date: "Placeholder",
      status: "Completed",
      featured: false,
      order: 1,
    },
  ],
  building: [
    {
      id: "placeholder-build-1",
      title: "Lobby Environment",
      category: "building",
      src: "/placeholder/demo-building.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder for building work. Add images to public/assets/building.",
      tags: ["Building", "Environment", "Roblox Studio"],
      date: "Placeholder",
      status: "Completed",
      featured: false,
      order: 1,
    },
  ],
  modeling: [
    {
      id: "placeholder-model-1",
      title: "Blender Asset Pack",
      category: "modeling",
      src: "/placeholder/demo-modeling.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder for 3D modeling work. Add images to public/assets/modeling.",
      tags: ["3D Modeling", "Blender", "Roblox"],
      date: "Placeholder",
      status: "Completed",
      featured: false,
      order: 1,
    },
  ],
  wip: [
    {
      id: "placeholder-wip-1",
      title: "Work In Progress Preview",
      category: "wip",
      src: "/placeholder/demo-wip.svg",
      type: "image",
      extension: "svg",
      description:
        "Demo placeholder for WIP content. Add unfinished work to public/assets/wip.",
      tags: ["WIP", "In Progress"],
      date: "Placeholder",
      status: "WIP",
      featured: false,
      order: 1,
    },
  ],
};

export function getSectionAssets(
  category: keyof typeof PLACEHOLDER_ASSETS,
  realAssets: PortfolioAsset[]
): PortfolioAsset[] {
  return realAssets.length > 0
    ? realAssets
    : PLACEHOLDER_ASSETS[category] ?? [];
}
