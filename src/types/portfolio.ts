export type PortfolioCategory =
  | "best-work"
  | "scripting"
  | "animation"
  | "vfx"
  | "building"
  | "modeling"
  | "wip";

export type PortfolioStatus = "Completed" | "WIP" | "Commission" | "Personal";

export type MediaType = "image" | "video";

export interface PortfolioAsset {
  id: string;
  title: string;
  category: PortfolioCategory;
  src: string;
  type: MediaType;
  extension: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  date?: string;
  status: PortfolioStatus;
  featured: boolean;
  order: number;
}

export const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  "best-work": "Best Work",
  scripting: "Scripting",
  animation: "Animation",
  vfx: "VFX",
  building: "Building",
  modeling: "3D Modeling",
  wip: "Work In Progress",
};

export const CATEGORY_COLORS: Record<PortfolioCategory, string> = {
  "best-work": "#38bdf8",
  scripting: "#38bdf8",
  animation: "#8b5cf6",
  vfx: "#c084fc",
  building: "#f97316",
  modeling: "#84cc16",
  wip: "#94a3b8",
};

export const NAV_LINKS = [
  { href: "#scripting", label: "Scripting" },
  { href: "#animation", label: "Animation" },
  { href: "#vfx", label: "VFX" },
  { href: "#building", label: "Building" },
  { href: "#modeling", label: "3D Modeling" },
] as const;

/** Sections grouped under the nav CTA (Work With Me). */
export const WORK_WITH_ME_SECTIONS = ["why-hire-me", "commission-process"] as const;

export function isWorkWithMeSection(sectionId: string): boolean {
  return (WORK_WITH_ME_SECTIONS as readonly string[]).includes(sectionId);
}

export type FilterType =
  | "all"
  | "featured"
  | "image"
  | "video"
  | "completed"
  | "wip";
