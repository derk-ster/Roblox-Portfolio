"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { AnimatedBorder } from "@/components/effects/AnimatedBorder";
import { HorizontalMarquee } from "@/components/effects/HorizontalMarquee";
import { Button } from "@/components/ui/Button";
import { DISCORD_URL, PAYMENT_METHODS, PAYMENT_SUMMARY } from "@/lib/constants";
import {
  PRICING_CATEGORIES,
  type PriceItem,
  type PricingCategory,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

function formatPrice(item: PriceItem) {
  const parts: string[] = [];
  if (item.robux) parts.push(`${item.robux} Robux`);
  if (item.usd) {
    const alreadyLabeled = /usd|quote|per second/i.test(item.usd);
    parts.push(alreadyLabeled ? item.usd : `${item.usd} USD`);
  }
  return parts.join(" · ");
}

const ACCENT_STYLES: Record<
  PricingCategory["accent"],
  { border: string; badge: string; price: string }
> = {
  cyan: {
    border: "from-cyan/30 via-blue/20 to-purple/25",
    badge: "bg-cyan/15 text-cyan",
    price: "text-cyan",
  },
  purple: {
    border: "from-purple/30 via-pink/20 to-cyan/20",
    badge: "bg-purple/15 text-purple",
    price: "text-purple",
  },
  pink: {
    border: "from-pink/30 via-purple/20 to-cyan/20",
    badge: "bg-pink/15 text-pink",
    price: "text-pink",
  },
  orange: {
    border: "from-orange/30 via-lime/15 to-cyan/20",
    badge: "bg-orange/15 text-orange",
    price: "text-orange",
  },
  lime: {
    border: "from-lime/25 via-cyan/20 to-purple/20",
    badge: "bg-lime/15 text-lime",
    price: "text-lime",
  },
};

function PricingCard({ category }: { category: PricingCategory }) {
  const styles = ACCENT_STYLES[category.accent];

  return (
    <article className="h-full w-[min(88vw,20rem)] shrink-0 sm:w-80">
      <AnimatedBorder accent={category.accent} glow={false} className="h-full">
        <div className="flex h-[28rem] flex-col p-5 sm:h-[30rem]">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-text">{category.title}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                styles.badge
              )}
            >
              Starting at
            </span>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-visible">
            {category.groups.map((group, gi) => (
              <div key={gi}>
                {group.title && (
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {group.title}
                  </p>
                )}
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item.label}
                      className="rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2"
                    >
                      <p className="text-xs leading-snug text-text/90">{item.label}</p>
                      <p className={cn("mt-1 text-xs font-medium", styles.price)}>
                        {formatPrice(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 shrink-0 border-t border-white/8 pt-4">
            <ul className="max-h-32 space-y-1 overflow-y-auto pr-1 scrollbar-visible">
              {category.info.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-[10px] leading-relaxed text-muted sm:text-xs"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/25" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] leading-relaxed text-muted/90 sm:text-xs">
              {category.cta}
            </p>
          </div>
        </div>
      </AnimatedBorder>
    </article>
  );
}

function PricingMarquee() {
  return (
    <HorizontalMarquee durationSeconds={80}>
      {PRICING_CATEGORIES.map((category) => (
        <PricingCard key={category.id} category={category} />
      ))}
    </HorizontalMarquee>
  );
}

export function PricingSection() {
  return (
    <CategorySection
      id="pricing"
      eyebrow="Commissions"
      title="Pricing"
      description={`Starting rates for scripting, animation, modeling, building, VFX, and bundles. I accept ${PAYMENT_SUMMARY}.`}
      accent="cyan"
      className="overflow-hidden"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((method) => (
          <span
            key={method}
            className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-muted"
          >
            {method}
          </span>
        ))}
      </div>

      <PricingMarquee />

      <div className="mt-8 text-center">
        <Button href={DISCORD_URL} size="lg">
          Message on Discord
        </Button>
      </div>
    </CategorySection>
  );
}
