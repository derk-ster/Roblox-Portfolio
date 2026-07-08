"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { MediaModal } from "@/components/portfolio/MediaModal";
import { Button } from "@/components/ui/Button";
import { ModalPortal } from "@/components/ui/ModalPortal";
import type { PortfolioAsset } from "@/types/portfolio";

interface PortfolioLibraryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  assets: PortfolioAsset[];
  variant?: "default" | "vfx" | "wip" | "modeling" | "building";
}

export function PortfolioLibraryModal({
  open,
  onClose,
  title,
  assets,
  variant = "default",
}: PortfolioLibraryModalProps) {
  const [modalAsset, setModalAsset] = useState<PortfolioAsset | null>(null);

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

  useEffect(() => {
    if (!open) setModalAsset(null);
  }, [open]);

  return (
    <>
      <ModalPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-library-title"
          >
            <div
              className="absolute inset-0 bg-bg/90"
              onClick={onClose}
              aria-hidden
            />

            <motion.div
              className="relative z-10 flex max-h-[min(92vh,52rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[0_0_60px_color-mix(in_srgb,var(--primary)_18%,transparent)]"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--secondary)]">
                    Full library
                  </p>
                  <h2
                    id="portfolio-library-title"
                    className="text-lg font-semibold text-[var(--text)] sm:text-xl"
                  >
                    {title}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
                    {assets.length} item{assets.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/[0.04] p-2 text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                  aria-label="Close library"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-visible sm:px-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((asset, i) => (
                    <PortfolioCard
                      key={asset.id}
                      asset={asset}
                      index={i}
                      variant={variant}
                      isPlaceholder={asset.id.startsWith("placeholder-")}
                      onViewDetails={setModalAsset}
                      onOpenMedia={setModalAsset}
                    />
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 justify-end border-t border-white/[0.06] px-5 py-4 sm:px-6">
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </ModalPortal>

      <MediaModal
        asset={modalAsset}
        assets={assets}
        onClose={() => setModalAsset(null)}
        onNavigate={setModalAsset}
      />
    </>
  );
}
