"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { NAV_LINKS, WORK_WITH_ME_SECTIONS, isWorkWithMeSection } from "@/types/portfolio";
import { PORTFOLIO_LOGO, PORTFOLIO_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = [
      "home",
      ...NAV_LINKS.map((l) => l.href.slice(1)),
      ...WORK_WITH_ME_SECTIONS,
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-300",
          scrolled
            ? "border-white/6 bg-bg/65"
            : "border-transparent bg-bg/30"
        )}
        initial={reducedMotion ? false : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label={`${PORTFOLIO_NAME}, Roblox developer portfolio`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-navbar-logo
              src={PORTFOLIO_LOGO}
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 rounded-[22%] object-contain sm:h-9 sm:w-9"
              decoding="async"
            />
            <span className="text-lg font-bold gradient-text-animated sm:text-xl">
              {PORTFOLIO_NAME}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === link.href.slice(1)
                      ? "text-cyan bg-cyan/8"
                      : "text-muted hover:text-text hover:bg-white/5"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <a
              href="#why-hire-me"
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                isWorkWithMeSection(activeSection)
                  ? "border-cyan/40 bg-cyan/12 text-cyan"
                  : "border-cyan/25 bg-cyan/8 text-cyan hover:border-cyan/40 hover:bg-cyan/12"
              )}
            >
              Work With Me
            </a>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-text lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu onClose={() => setMobileOpen(false)} activeSection={activeSection} />
        )}
      </AnimatePresence>
    </>
  );
}
