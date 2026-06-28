"use client";

import {
  MessageCircle,
  Gamepad2,
  Mail,
  MessageSquare,
  Clock,
  Package,
  Video,
  Shield,
  CheckCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { CategorySection } from "@/components/portfolio/CategorySection";
import { AnimatedBorder } from "@/components/effects/AnimatedBorder";
import { MouseGlow } from "@/components/effects/MouseGlow";
import {
  DISCORD_URL,
  DISCORD_USERNAME,
  EMAIL,
  ROBLOX_PROFILE_URL,
} from "@/lib/constants";

const WHY_HIRE = [
  {
    icon: MessageSquare,
    title: "Clear communication",
    description: "Direct updates and honest timelines.",
  },
  {
    icon: Clock,
    title: "Progress updates",
    description: "You always know where things stand.",
  },
  {
    icon: Package,
    title: "Organized delivery",
    description: "Clean files and a clear handoff.",
  },
  {
    icon: Video,
    title: "Development proof",
    description: "Videos and screenshots during builds.",
  },
  {
    icon: Shield,
    title: "Clean systems",
    description: "Readable code and organized assets.",
  },
  {
    icon: CheckCircle,
    title: "Reliable delivery",
    description: "Work that matches what we agreed on.",
  },
];

const CONTACT_LINKS = [
  {
    icon: MessageCircle,
    label: "Discord",
    description: DISCORD_USERNAME,
    href: DISCORD_URL,
    color: "#5865F2",
    glow: "rgba(88, 101, 242, 0.12)",
  },
  {
    icon: Gamepad2,
    label: "Roblox",
    description: "View my profile",
    href: ROBLOX_PROFILE_URL,
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.12)",
  },
  {
    icon: Mail,
    label: "Email",
    description: EMAIL,
    href: `mailto:${EMAIL}`,
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.12)",
  },
];

export function WhyHireSection() {
  return (
    <CategorySection
      id="why-hire-me"
      eyebrow="Working Together"
      title="Why Hire Me"
      description="I focus on UI, emote systems, movement, and clean delivery with regular updates."
      accent="cyan"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_HIRE.map((item, i) => (
          <motion.div
            key={item.title}
            className="card-surface inner-glow rounded-xl p-4"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <item.icon className="mb-2 h-4 w-4 text-cyan" aria-hidden />
            <h3 className="text-sm font-semibold text-text">{item.title}</h3>
            <p className="mt-1 text-xs text-muted sm:text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-text">Get in touch</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {CONTACT_LINKS.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <MouseGlow color={link.glow}>
                <AnimatedBorder>
                  <a
                    href={link.href}
                    target={
                      link.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="group flex items-start gap-4 p-5 transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 rounded-2xl"
                  >
                    <div
                      className="rounded-lg p-2.5"
                      style={{ backgroundColor: `${link.color}12` }}
                    >
                      <link.icon
                        className="h-5 w-5"
                        style={{ color: link.color }}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-text group-hover:text-cyan transition-colors">
                        {link.label}
                      </h4>
                      <p className="mt-0.5 text-sm text-muted break-all">
                        {link.description}
                      </p>
                    </div>
                  </a>
                </AnimatedBorder>
              </MouseGlow>
            </motion.div>
          ))}
        </div>
      </div>
    </CategorySection>
  );
}
