"use client";

import { type CSSProperties } from "react";
import { Code2, Film, Sparkles, Hammer, Box } from "lucide-react";
import { motion } from "motion/react";
import { TiltCard } from "@/components/effects/TiltCard";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { cn } from "@/lib/utils";

const STATS = [
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
];

export function StatsStrip() {
  return (
    <section className="relative z-20 pb-10 pt-2" aria-label="Portfolio highlights">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="h-full"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <TiltCard className="h-full" intensity={3}>
                <MouseGlow color={stat.glow} className="h-full">
                  <a
                    href={stat.href}
                    className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    aria-label={`Go to ${stat.label}`}
                  >
                    <div
                      className={cn(
                        "card-surface inner-glow-accent flex h-full min-h-[132px] flex-col items-center justify-center rounded-2xl p-4 text-center sm:min-h-[140px] sm:p-5"
                      )}
                      style={
                        {
                          "--glow-color": `${stat.color}18`,
                        } as CSSProperties
                      }
                    >
                      <div
                        className="mb-2 rounded-lg p-2.5"
                        style={{
                          backgroundColor: `${stat.color}12`,
                        }}
                      >
                        <stat.icon
                          className="h-5 w-5"
                          style={{ color: stat.color }}
                          aria-hidden
                        />
                      </div>
                      <h3 className="flex min-h-[1.5rem] items-center text-sm font-semibold text-text">
                        {stat.label}
                      </h3>
                      <p className="mt-0.5 text-xs leading-snug text-muted">
                        {stat.description}
                      </p>
                    </div>
                  </a>
                </MouseGlow>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
