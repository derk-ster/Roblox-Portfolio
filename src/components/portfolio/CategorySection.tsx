"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: "cyan" | "purple" | "pink" | "orange" | "lime";
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function CategorySection({
  id,
  eyebrow,
  title,
  description,
  accent = "cyan",
  children,
  className,
  glow = false,
}: CategorySectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 py-10 sm:py-12",
        className
      )}
      aria-labelledby={`${id}-heading`}
    >
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink/3 blur-3xl" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id={`${id}-heading`}
          eyebrow={eyebrow}
          title={title}
          description={description}
          accent={accent}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>

      <div
        className="mx-auto mt-8 h-px max-w-3xl bg-white/8"
        aria-hidden
      />
    </section>
  );
}
