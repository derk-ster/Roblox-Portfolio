import type { BackgroundSectionId } from "@/lib/background-sections";

export type ChatScrollTarget = BackgroundSectionId;

export interface ChatSectionMeta {
  id: ChatScrollTarget;
  label: string;
  keywords: string[];
}

/** Sections the chat can scroll to, with keyword hints for fallback detection. */
export const CHAT_SECTIONS: ChatSectionMeta[] = [
  {
    id: "best-work",
    label: "Best Work",
    keywords: ["best work", "featured", "highlight", "top work", "portfolio"],
  },
  {
    id: "scripting",
    label: "Scripting",
    keywords: ["script", "scripting", "lua", "code", "ui system", "systems"],
  },
  {
    id: "animation",
    label: "Animation",
    keywords: ["animation", "emote", "emotes", "r6", "blender", "dance"],
  },
  {
    id: "vfx",
    label: "VFX",
    keywords: ["vfx", "visual effect", "particles", "effects"],
  },
  {
    id: "building",
    label: "Building",
    keywords: ["build", "building", "map", "maps", "level"],
  },
  {
    id: "modeling",
    label: "3D Modeling",
    keywords: ["model", "modeling", "3d", "mesh", "blender model"],
  },
  {
    id: "pricing",
    label: "Pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "rate",
      "robux",
      "usd",
      "zelle",
      "venmo",
      "paypal",
      "cash app",
      "payment",
      "bundle",
    ],
  },
  {
    id: "why-hire-me",
    label: "Why Hire Me",
    keywords: ["hire", "why hire", "contact", "discord", "email", "reach"],
  },
  {
    id: "commission-process",
    label: "Commissions",
    keywords: ["commission", "commissions", "quote", "process", "delivery"],
  },
];

const VALID_IDS = new Set<string>(CHAT_SECTIONS.map((s) => s.id));

export function isValidScrollTarget(id: string | null | undefined): id is ChatScrollTarget {
  return !!id && VALID_IDS.has(id);
}

/** Client-side fallback when the model omits scrollTo. */
export function detectScrollTarget(text: string): ChatScrollTarget | null {
  const lower = text.toLowerCase();
  for (const section of CHAT_SECTIONS) {
    if (section.keywords.some((kw) => lower.includes(kw))) {
      return section.id;
    }
  }
  return null;
}

export function scrollToSection(id: ChatScrollTarget) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
