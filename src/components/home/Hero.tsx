"use client";

import { Info, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { HeroAbout } from "@/components/home/HeroAbout";
import { ScriptingInfoModal } from "@/components/sections/ScriptingInfoModal";
import { Button } from "@/components/ui/Button";
import { DISCORD_URL } from "@/lib/constants";

const CHIPS = ["UI Systems", "Emotes", "Movement", "VFX", "Blender", "Roblox Studio"];

/** Consistent vertical rhythm between hero content blocks */
const BLOCK_GAP = "mt-5";

export function Hero() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative z-10 scroll-mt-0 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 lg:px-8">
        <motion.div
          className="mb-8 flex justify-center sm:-translate-x-4 lg:-translate-x-8 xl:-translate-x-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-title-wrap">
            <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl gradient-text-animated">
              DErk2104
            </h1>
            <span className="hero-title-underline" aria-hidden />
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-6 xl:gap-12">
          <div className="relative flex min-w-0 flex-col">
            <motion.p
              className="mb-4 text-center text-sm font-medium tracking-wide text-muted sm:text-base"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              Roblox Portfolio
            </motion.p>

            <motion.p
              className="max-w-xl text-base font-medium text-text/90 sm:text-lg lg:mx-auto lg:text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Roblox scripter, animator, VFX, builder, and 3D modeler
            </motion.p>

            <motion.div
              className={`${BLOCK_GAP} flex flex-wrap justify-center gap-2 lg:justify-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16 }}
            >
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="hero-chip rounded-md border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-muted"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.p
              className={`${BLOCK_GAP} max-w-xl text-sm leading-relaxed text-muted sm:text-base lg:mx-auto lg:text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
            >
              I build UI, emote systems, movement, VFX, maps, and Blender assets
              for Roblox games.
            </motion.p>

            <motion.div
              className={`${BLOCK_GAP} flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:flex-nowrap`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MagneticButton strength={0.4} influenceRadius={150}>
                <Button href="#best-work" size="lg" className="hero-cta">
                  View Work
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.4} influenceRadius={150}>
                <Button href="#commission-process" size="lg" variant="secondary" className="hero-cta">
                  Commissions
                </Button>
              </MagneticButton>
              <Button
                href={DISCORD_URL}
                size="lg"
                variant="outline"
                icon={<MessageCircle className="h-4 w-4" aria-hidden />}
              >
                Discord
              </Button>
              <MagneticButton strength={0.4} influenceRadius={150} className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="hero-cta whitespace-nowrap"
                  icon={<Info className="h-4 w-4" aria-hidden />}
                  onClick={() => setInfoOpen(true)}
                >
                  Extra Info &amp; Certs
                </Button>
              </MagneticButton>
            </motion.div>
          </div>

          <div className="relative flex min-w-0 flex-col">
            <motion.p
              className="mb-4 text-center text-sm font-medium tracking-wide text-muted sm:text-base"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              About Me
            </motion.p>
            <HeroAbout />
          </div>
        </div>
      </div>

      <ScriptingInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </section>
  );
}
