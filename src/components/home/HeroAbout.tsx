"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/** Experience durations in months only */
const EXPERIENCE_MAIN = [
  { label: "scripting", months: 24 },
  { label: "animation", months: 18 },
  { label: "building", months: 14 },
  { label: "modeling", months: 6 },
] as const;

const VFX_EXPERIENCE = { label: "VFX", months: 3 } as const;

function CountUpMonths({
  target,
  label,
  delay = 0,
}: {
  target: number;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? target : 0);
  const [showPlus, setShowPlus] = useState(!!reducedMotion);

  useEffect(() => {
    if (!inView || reducedMotion) return;

    let raf = 0;
    const duration = 1400;
    const startAt = performance.now() + delay;

    const tick = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
        setShowPlus(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, delay, reducedMotion]);

  return (
    <li ref={ref} className="text-center text-sm leading-relaxed text-muted sm:text-base">
      <span className="hero-exp-count font-bold tabular-nums">
        {value}
        {showPlus ? "+" : ""}
      </span>
      <span> months of {label}</span>
    </li>
  );
}

export function HeroAbout() {
  const leftExperience = EXPERIENCE_MAIN.filter((_, i) => i % 2 === 0);
  const rightExperience = EXPERIENCE_MAIN.filter((_, i) => i % 2 === 1);

  return (
    <motion.aside
      className="flex min-w-0 flex-col"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.p
        className="max-w-md text-sm leading-relaxed text-muted sm:text-base lg:mx-auto lg:text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        I take commissions through Discord and ship organized, documented work
        across client and server systems.
      </motion.p>

      <motion.div
        className="mt-5 w-full max-w-md lg:mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
      >
        <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Experience
        </p>
        <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <ul className="space-y-5">
            {leftExperience.map((item, i) => (
              <CountUpMonths
                key={item.label}
                target={item.months}
                label={item.label}
                delay={i * 120}
              />
            ))}
          </ul>
          <ul className="space-y-5">
            {rightExperience.map((item, i) => (
              <CountUpMonths
                key={item.label}
                target={item.months}
                label={item.label}
                delay={(i + leftExperience.length) * 120}
              />
            ))}
          </ul>
        </div>
        <ul className="mt-5">
          <CountUpMonths
            target={VFX_EXPERIENCE.months}
            label={VFX_EXPERIENCE.label}
            delay={EXPERIENCE_MAIN.length * 120}
          />
        </ul>
      </motion.div>
    </motion.aside>
  );
}
