import { NAV_LINKS, WORK_WITH_ME_SECTIONS } from "@/types/portfolio";

/** Page sections that each get a themed 3D backdrop layer. */
export const BACKGROUND_SECTIONS = [
  "home",
  "best-work",
  ...NAV_LINKS.map((l) => l.href.slice(1)),
  ...WORK_WITH_ME_SECTIONS,
] as const;

export type BackgroundSectionId = (typeof BACKGROUND_SECTIONS)[number];

export function isBackgroundSection(id: string): id is BackgroundSectionId {
  return (BACKGROUND_SECTIONS as readonly string[]).includes(id);
}
