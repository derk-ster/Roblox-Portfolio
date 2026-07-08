import type { PortfolioAsset } from "@/types/portfolio";

export const CERT_SECTIONS = [
  {
    id: "proof-of-certifications",
    title: "Proof of certifications",
    description:
      "Screenshots of monthly learning hours and platform activity as proof of consistent practice.",
  },
] as const;

export type CertSectionId = (typeof CERT_SECTIONS)[number]["id"];

export const CERT_GROUPS = [
  {
    id: "languages",
    title: "Language certifications",
    description:
      "Codecademy credentials across HTML, CSS, JavaScript, React, SQL, and full stack paths.",
  },
  {
    id: "monthly",
    title: "Monthly time logs",
    description:
      "Screenshots of monthly learning hours, proof of consistent practice over time.",
    section: "proof-of-certifications" as CertSectionId,
    columns: 5 as const,
  },
  {
    id: "proof",
    title: "Account & activity",
    description:
      "Profile overview and total practice time on the learning platform.",
    section: "proof-of-certifications" as CertSectionId,
  },
] as const;

export type CertGroupId = (typeof CERT_GROUPS)[number]["id"];

export function groupCertificationAssets(assets: PortfolioAsset[]) {
  const buckets = new Map<CertGroupId, PortfolioAsset[]>(
    CERT_GROUPS.map((g) => [g.id, []])
  );
  const ungrouped: PortfolioAsset[] = [];

  for (const asset of assets) {
    const group = asset.group as CertGroupId | undefined;
    if (group && buckets.has(group)) {
      buckets.get(group)!.push(asset);
    } else {
      ungrouped.push(asset);
    }
  }

  for (const list of buckets.values()) {
    list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }

  ungrouped.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  return { buckets, ungrouped };
}
