"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { CertificationsGallery } from "@/components/sections/CertificationsGallery";
import {
  SCRIPTING_CERTIFICATIONS,
  SCRIPTING_CERTS_NOTE,
  SCRIPTING_EXPERIENCE,
  SCRIPTING_INFO_CTA,
  SCRIPTING_INFO_INTRO,
  SCRIPTING_WORK,
} from "@/lib/scripting-info";

interface ScriptingInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScriptingInfoModal({ open, onClose }: ScriptingInfoModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="scripting-info-title"
        >
          <div
            className="absolute inset-0 bg-bg/90"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            className="relative z-10 flex max-h-[min(92vh,48rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[0_0_60px_color-mix(in_srgb,var(--primary)_18%,transparent)]"
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--secondary)]">
                  About Me
                </p>
                <h2
                  id="scripting-info-title"
                  className="text-lg font-semibold text-[var(--text)] sm:text-xl"
                >
                  Extra Info &amp; Certifications
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/[0.04] p-2 text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-none sm:px-6">
              <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                {SCRIPTING_INFO_INTRO}
              </p>

              <div className="mt-5">
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Certifications
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SCRIPTING_CERTIFICATIONS.map((cert) => (
                    <span
                      key={cert}
                      className="rounded-md border border-[var(--border)] bg-white/[0.04] px-2 py-0.5 text-xs text-[var(--muted)]"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {SCRIPTING_CERTS_NOTE}
                </p>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Experience
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {SCRIPTING_EXPERIENCE}
                </p>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Work
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">
                  {SCRIPTING_WORK}
                </p>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                {SCRIPTING_INFO_CTA.text}
              </p>

              <CertificationsGallery />
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 border-t border-white/[0.06] px-5 py-4 sm:px-6">
              <Button
                href={SCRIPTING_INFO_CTA.discordUrl}
                size="sm"
                variant="secondary"
              >
                DM on Discord
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
