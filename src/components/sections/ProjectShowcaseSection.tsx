"use client";

import {
  Code2,
  Film,
  Layout,
  Sparkles,
  Handshake,
} from "lucide-react";
import { AnimatedBorder } from "@/components/effects/AnimatedBorder";
import { TiltCard } from "@/components/effects/TiltCard";
import { CategorySection } from "@/components/portfolio/CategorySection";
import { cn } from "@/lib/utils";

const SHOWCASE = [
  {
    title: "Scripting",
    description:
      "UI, combat, movement, and gameplay logic built in Roblox Studio.",
    href: "#scripting",
    icon: Code2,
    accent: "cyan" as const,
    tools: ["Luau", "Roblox Studio", "RemoteEvents"],
  },
  {
    title: "Animation",
    description:
      "R6 emotes and movement animations created in Blender for Roblox.",
    href: "#animation",
    icon: Film,
    accent: "purple" as const,
    tools: ["Blender", "R6", "Graph Editor"],
  },
  {
    title: "UI Systems",
    description:
      "Menus, shops, inventory, and polished in-game interfaces.",
    href: "#scripting",
    icon: Layout,
    accent: "cyan" as const,
    tools: ["Luau", "UI Scripting", "DataStores"],
  },
  {
    title: "VFX",
    description:
      "Ability effects, trails, impacts, and cinematic particle work.",
    href: "#vfx",
    icon: Sparkles,
    accent: "pink" as const,
    tools: ["Particles", "Roblox Studio", "Timing"],
  },
  {
    title: "Commissions",
    description:
      "Paid work with clear quotes, progress updates, and clean delivery.",
    href: "#commission-process",
    icon: Handshake,
    accent: "purple" as const,
    tools: ["Discord", "Robux", "USD"],
  },
];

const ICON_STYLES = {
  cyan: "bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)]",
  purple:
    "bg-[color-mix(in_srgb,var(--secondary)_12%,transparent)] text-[var(--secondary)]",
  pink: "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]",
} as const;

function ShowcaseCard({ item }: { item: (typeof SHOWCASE)[number] }) {
  return (
    <article className="h-full min-h-[276px]">
      <TiltCard className="h-full" accent={item.accent}>
        <AnimatedBorder accent="purple" glow={false} className="h-full">
          <a
            href={item.href}
            className="relative flex h-full min-h-[276px] flex-col overflow-hidden rounded-2xl p-5 transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
          >
            <div
              className={cn(
                "mb-2 inline-flex w-fit shrink-0 rounded-lg p-2.5",
                ICON_STYLES[item.accent]
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden />
            </div>

            <h3 className="shrink-0 text-sm font-semibold leading-snug text-[var(--text)] sm:text-base">
              {item.title}
            </h3>

            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              {item.description}
            </p>

            <div className="relative z-[1] mt-3 shrink-0 border-t border-white/[0.06] pt-3">
              <div className="flex flex-wrap gap-1.5">
                {item.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-[var(--border)] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-[var(--muted)] sm:text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-purple/20 via-purple/8 to-transparent"
              aria-hidden
            />
          </a>
        </AnimatedBorder>
      </TiltCard>
    </article>
  );
}

export function ProjectShowcaseSection() {
  return (
    <CategorySection
      id="project-showcase"
      eyebrow="Showcase"
      title="What I Build"
      description="Roblox systems, animation, UI, VFX, and commission work. Click a card to jump in."
      accent="cyan"
      contentClassName="!overflow-visible px-1 py-3"
    >
      <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SHOWCASE.map((item) => (
          <ShowcaseCard key={item.title} item={item} />
        ))}
      </div>
    </CategorySection>
  );
}
