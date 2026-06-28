"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  accent?: "cyan" | "purple" | "pink" | "orange" | "lime";
  className?: string;
}

const accentColors = {
  cyan: "from-cyan/80 to-blue/60",
  purple: "from-purple/80 to-pink/60",
  pink: "from-pink/80 to-purple/60",
  orange: "from-orange/80 to-lime/50",
  lime: "from-lime/70 to-cyan/60",
};

const dividerColors = {
  cyan: "bg-cyan/50",
  purple: "bg-purple/50",
  pink: "bg-pink/50",
  orange: "bg-orange/50",
  lime: "bg-lime/50",
};

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  accent = "cyan",
  className,
}: SectionHeaderProps) {
  return (
    <motion.header
      id={id}
      className={cn(
        "mb-6",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-2 inline-block text-xs font-medium uppercase tracking-wider bg-gradient-to-r bg-clip-text text-transparent",
            accentColors[accent]
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      )}
      <div
        className={cn(
          "mt-4 h-px w-12",
          dividerColors[accent],
          align === "center" && "mx-auto"
        )}
        aria-hidden
      />
    </motion.header>
  );
}
