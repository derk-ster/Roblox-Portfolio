"use client";

import { ArrowDown, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { DISCORD_URL } from "@/lib/constants";

const CHIPS = ["UI Systems", "Emotes", "Movement", "VFX", "Blender", "Roblox Studio"];

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="home" className="relative scroll-mt-0">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg/50 to-transparent" />

      <MouseGlow
        className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-4 pb-6 pt-28 sm:px-6 sm:pb-8 sm:pt-32 lg:px-8"
        color="rgba(56, 189, 248, 0.1)"
        size={420}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="cyan" className="mb-3 px-3 py-0.5 text-xs">
            Roblox Portfolio
          </Badge>
        </motion.div>

        <motion.div
          className="inline-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text-animated">
            DErk2104
          </h1>
          <div className="title-underline mt-2 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px]" />
        </motion.div>

        <motion.p
          className="mt-3 max-w-xl text-base font-medium text-text/90 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          Roblox scripter, animator, VFX, builder, and 3D modeler
        </motion.p>

        <motion.p
          className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          I build UI, emote systems, movement, VFX, maps, and Blender assets
          for Roblox games.
        </motion.p>

        <motion.div
          className="mt-4 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-md border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs text-muted"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button href="#best-work" size="lg">
            View Work
          </Button>
          <Button href="#commission-process" size="lg" variant="secondary">
            Commissions
          </Button>
          <Button
            href={DISCORD_URL}
            size="lg"
            variant="outline"
            icon={<MessageCircle className="h-4 w-4" aria-hidden />}
          >
            Discord
          </Button>
        </motion.div>

        <motion.a
          href="#best-work"
          className="mt-6 flex items-center gap-2 text-sm text-muted transition-colors hover:text-cyan"
          animate={reducedMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          aria-label="Scroll to work section"
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
          View portfolio
        </motion.a>
      </MouseGlow>
    </section>
  );
}
