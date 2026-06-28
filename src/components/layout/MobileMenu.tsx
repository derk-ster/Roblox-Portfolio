"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { NAV_LINKS, isWorkWithMeSection } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  onClose: () => void;
  activeSection: string;
}

export function MobileMenu({ onClose, activeSection }: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden
      />
      <motion.nav
        className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-l border-white/10 bg-panel p-6"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        aria-label="Mobile navigation"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold gradient-text">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:text-text"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <a
                href={link.href}
                onClick={onClose}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  activeSection === link.href.slice(1)
                    ? "bg-cyan/10 text-cyan"
                    : "text-muted hover:bg-white/5 hover:text-text"
                )}
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <a
            href="#why-hire-me"
            onClick={onClose}
            className={cn(
              "block w-full rounded-lg border py-3 text-center font-medium transition-colors",
              isWorkWithMeSection(activeSection)
                ? "border-cyan/40 bg-cyan/12 text-cyan"
                : "border-cyan/25 bg-cyan/8 text-cyan"
            )}
          >
            Work With Me
          </a>
        </div>
      </motion.nav>
    </motion.div>
  );
}
