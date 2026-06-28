"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { CategorySection } from "@/components/portfolio/CategorySection";
import { AnimatedBorder } from "@/components/effects/AnimatedBorder";
import { Button } from "@/components/ui/Button";
import { DISCORD_URL } from "@/lib/constants";

const STEPS = [
  {
    step: 1,
    title: "Tell me the job",
    description: "Share what you need, any references, and your timeline.",
  },
  {
    step: 2,
    title: "Quote",
    description: "I send a price and delivery estimate before work starts.",
  },
  {
    step: 3,
    title: "Build",
    description: "I work in organized files with clear milestones.",
  },
  {
    step: 4,
    title: "Updates",
    description: "You get videos and screenshots to review progress.",
  },
  {
    step: 5,
    title: "Delivery",
    description: "Full files are sent after final payment is confirmed.",
  },
];

const POLICIES = [
  "No full files before final payment",
  "Progress proof can be shared during development",
  "Big scope changes may cost extra",
  "Final price depends on complexity",
];

export function ProcessSection() {
  return (
    <CategorySection
      id="commission-process"
      eyebrow="Commissions"
      title="Commission Process"
      description="A simple path from first message to final delivery."
      accent="purple"
      className="pb-14"
    >
      <div className="grid auto-rows-fr gap-4 lg:grid-cols-5">
        {STEPS.map((item, i) => (
          <motion.div
            key={item.step}
            className="h-full"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <AnimatedBorder accent="purple" className="h-full">
              <div className="flex h-full min-h-[140px] flex-col p-5">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-xs font-semibold text-purple">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-text">{item.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted sm:text-sm">
                  {item.description}
                </p>
              </div>
            </AnimatedBorder>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <AnimatedBorder accent="orange">
          <div className="flex gap-4 p-5">
            <AlertTriangle
              className="h-5 w-5 shrink-0 text-orange"
              aria-hidden
            />
            <div>
              <h3 className="text-sm font-semibold text-text">Policy</h3>
              <ul className="mt-2 space-y-1.5">
                {POLICIES.map((policy) => (
                  <li
                    key={policy}
                    className="flex items-start gap-2 text-xs text-muted sm:text-sm"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange" />
                    {policy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedBorder>
      </motion.div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Button href={DISCORD_URL} size="lg">
          Message on Discord
        </Button>
      </motion.div>
    </CategorySection>
  );
}
