"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { MediaModal } from "@/components/portfolio/MediaModal";
import { getAssetsByCategory } from "@/lib/assets";
import { CERT_GROUPS, CERT_SECTIONS, groupCertificationAssets } from "@/lib/certifications";
import type { PortfolioAsset } from "@/types/portfolio";
import { cn } from "@/lib/utils";

function CertificationThumb({
  asset,
  onOpen,
}: {
  asset: PortfolioAsset;
  onOpen: (asset: PortfolioAsset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(asset)}
      className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] text-left transition-colors hover:border-[var(--primary)]/30 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={asset.src}
          alt={asset.title}
          fill
          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 33vw, 120px"
        />
      </div>
      <p className="truncate px-2 py-1.5 text-[10px] font-medium text-[var(--muted)] sm:text-xs">
        {asset.title}
      </p>
    </button>
  );
}

function CertGroupGallery({
  title,
  assets,
  onOpen,
  columns = 3,
}: {
  title: string;
  assets: PortfolioAsset[];
  onOpen: (asset: PortfolioAsset) => void;
  columns?: 3 | 5;
}) {
  if (assets.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
        {title}
      </h4>
      <div
        className={cn(
          "grid gap-2",
          columns === 5
            ? "grid-cols-3 sm:grid-cols-5"
            : "grid-cols-2 sm:grid-cols-3"
        )}
      >
        {assets.map((asset) => (
          <CertificationThumb key={asset.id} asset={asset} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function CertSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-[var(--text)]">{title}</h4>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function CertificationsGallery() {
  const assets = getAssetsByCategory("certifications").filter(
    (a) => a.type === "image"
  );
  const { buckets, ungrouped } = groupCertificationAssets(assets);
  const [modalAsset, setModalAsset] = useState<PortfolioAsset | null>(null);

  const standaloneGroups = CERT_GROUPS.filter((group) => !("section" in group));
  const sectionedGroups = CERT_SECTIONS.map((section) => ({
    section,
    groups: CERT_GROUPS.filter(
      (group) => "section" in group && group.section === section.id
    ),
  }));

  if (assets.length === 0) return null;

  return (
    <>
      <div className="mt-6 space-y-5 border-t border-white/[0.06] pt-5">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">
            Certification images
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
            Click any image to open it full size.
          </p>
        </div>

        {standaloneGroups.map((group) => (
          <CertGroupGallery
            key={group.id}
            title={group.title}
            assets={buckets.get(group.id) ?? []}
            onOpen={setModalAsset}
          />
        ))}

        {sectionedGroups.map(({ section, groups }) => {
          const hasAssets = groups.some(
            (group) => (buckets.get(group.id) ?? []).length > 0
          );
          if (!hasAssets) return null;

          return (
            <CertSection
              key={section.id}
              title={section.title}
              description={section.description}
            >
              {groups.map((group) => (
                <CertGroupGallery
                  key={group.id}
                  title={group.title}
                  assets={buckets.get(group.id) ?? []}
                  onOpen={setModalAsset}
                  columns={"columns" in group ? group.columns : 3}
                />
              ))}
            </CertSection>
          );
        })}

        {ungrouped.length > 0 && (
          <CertGroupGallery
            title="Other"
            assets={ungrouped}
            onOpen={setModalAsset}
          />
        )}
      </div>

      <MediaModal
        asset={modalAsset}
        assets={assets}
        onClose={() => setModalAsset(null)}
        onNavigate={setModalAsset}
      />
    </>
  );
}
