import { portfolioAssets } from "@/generated/portfolio-assets";
import type {
  FilterType,
  MediaType,
  PortfolioAsset,
  PortfolioCategory,
} from "@/types/portfolio";

export function getAllAssets(): PortfolioAsset[] {
  return [...portfolioAssets];
}

export function getAssetsByCategory(
  category: PortfolioCategory
): PortfolioAsset[] {
  return sortAssets(
    portfolioAssets.filter((asset) => asset.category === category)
  );
}

export function getFeaturedAssets(): PortfolioAsset[] {
  return sortAssets(portfolioAssets.filter((asset) => asset.featured));
}

export function getAssetCategories(): PortfolioCategory[] {
  const categories = new Set(
    portfolioAssets.map((asset) => asset.category)
  );
  return Array.from(categories);
}

export function getMediaType(src: string): MediaType {
  const ext = src.split(".").pop()?.toLowerCase() ?? "";
  const videoExtensions = ["mp4", "webm", "mov"];
  return videoExtensions.includes(ext) ? "video" : "image";
}

export function sortAssets(assets: PortfolioAsset[]): PortfolioAsset[] {
  return [...assets].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export function filterAssets(
  assets: PortfolioAsset[],
  filter: FilterType,
  tagFilter?: string
): PortfolioAsset[] {
  let filtered = [...assets];

  switch (filter) {
    case "featured":
      filtered = filtered.filter((a) => a.featured);
      break;
    case "image":
      filtered = filtered.filter((a) => a.type === "image");
      break;
    case "video":
      filtered = filtered.filter((a) => a.type === "video");
      break;
    case "completed":
      filtered = filtered.filter((a) => a.status === "Completed");
      break;
    case "wip":
      filtered = filtered.filter((a) => a.status === "WIP");
      break;
    default:
      break;
  }

  if (tagFilter && tagFilter !== "all") {
    filtered = filtered.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())
    );
  }

  return sortAssets(filtered);
}

export function getUniqueTags(assets: PortfolioAsset[]): string[] {
  const tags = new Set<string>();
  assets.forEach((asset) => asset.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getAssetsWithPlaceholders(
  category: PortfolioCategory,
  placeholders: PortfolioAsset[]
): PortfolioAsset[] {
  const assets = getAssetsByCategory(category);
  return assets.length > 0 ? assets : placeholders;
}
