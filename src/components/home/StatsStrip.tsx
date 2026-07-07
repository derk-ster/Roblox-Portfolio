"use client";

import { type CSSProperties } from "react";
import {
  Code2,
  Film,
  Sparkles,
  Hammer,
  Box,
  Star,
  Tags,
  ClipboardList,
  UserCheck,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { HorizontalMarquee } from "@/components/effects/HorizontalMarquee";
import { cn } from "@/lib/utils";

const NAV_CARDS: {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  color: string;
  glow: string;
}[] = [
  {
    icon: Code2,
    label: "Scripting",
    description: "UI and emote systems",
    href: "#scripting",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.14)",
  },
  {
    icon: Film,
    label: "Animation",
    description: "Emotes and movement",
    href: "#animation",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.14)",
  },
  {
    icon: Sparkles,
    label: "VFX",
    description: "Particles and trails",
    href: "#vfx",
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.14)",
  },
  {
    icon: Hammer,
    label: "Building",
    description: "Maps and environments",
    href: "#building",
    color: "#f97316",
    glow: "rgba(249, 115, 22, 0.14)",
  },
  {
    icon: Box,
    label: "3D Modeling",
    description: "Blender assets",
    href: "#modeling",
    color: "#84cc16",
    glow: "rgba(132, 204, 22, 0.14)",
  },
  {
    icon: Star,
    label: "Best Work",
    description: "Featured projects",
    href: "#best-work",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.14)",
  },
  {
    icon: Tags,
    label: "Pricing",
    description: "Starting rates",
    href: "#pricing",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.12)",
  },
  {
    icon: ClipboardList,
    label: "Commission Process",
    description: "How it works",
    href: "#commission-process",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.12)",
  },
  {
    icon: UserCheck,
    label: "Why Hire Me",
    description: "Why work with me",
    href: "#why-hire-me",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.12)",
  },
  {
    icon: Mail,
    label: "Contact",
    description: "Discord, email, Roblox",
    href: "#why-hire-me",
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.12)",
  },
];

function NavCard({ item }: { item: (typeof NAV_CARDS)[number] }) {
  return (
    <article className="w-44 shrink-0 sm:w-48">
      <a
        href={item.href}
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        aria-label={`Go to ${item.label}`}
      >
        <div
          className={cn(
            "card-surface inner-glow-accent flex min-h-[132px] flex-col items-center justify-center rounded-2xl p-4 text-center sm:min-h-[140px] sm:p-5"
          )}
          style={{ "--glow-color": `${item.color}18` } as CSSProperties}
        >
          <div
            className="mb-2 rounded-lg p-2.5"
            style={{ backgroundColor: `${item.color}12` }}
          >
            <item.icon
              className="h-5 w-5"
              style={{ color: item.color }}
              aria-hidden
            />
          </div>
          <h3 className="text-sm font-semibold text-text">{item.label}</h3>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            {item.description}
          </p>
        </div>
      </a>
    </article>
  );
}

export function StatsStrip() {
  return (
    <section
      className="relative z-20 py-8"
      aria-label="Portfolio navigation"
    >
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <HorizontalMarquee durationSeconds={55} showScrubber={false}>
          {NAV_CARDS.map((item) => (
            <NavCard key={item.label} item={item} />
          ))}
        </HorizontalMarquee>
      </div>
    </section>
  );
}
