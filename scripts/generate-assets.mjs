import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "public", "assets");
const VIDEO_FRAMES_DIR = path.join(ROOT, ".video-frames");
const OUTPUT_FILE = path.join(ROOT, "src", "generated", "portfolio-assets.ts");

const CATEGORIES = [
  "best-work",
  "scripting",
  "animation",
  "vfx",
  "building",
  "modeling",
  "wip",
];

const MEDIA_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".mp4",
  ".webm",
  ".mov",
]);

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

const DEFAULT_TAGS = {
  "best-work": ["Featured", "Portfolio"],
  scripting: ["Lua", "Roblox Studio", "Scripting"],
  animation: ["Animation", "Roblox", "R6"],
  vfx: ["Roblox VFX", "Particles", "Effects"],
  building: ["Building", "Environment", "Roblox Studio"],
  modeling: ["3D Modeling", "Blender", "Roblox"],
  wip: ["WIP", "In Progress"],
};

function titleFromFilename(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function slugify(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function loadMeta(categoryPath) {
  const metaPath = path.join(categoryPath, "meta.json");
  if (!fs.existsSync(metaPath)) return {};
  try {
    const raw = fs.readFileSync(metaPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Warning: Could not parse ${metaPath}:`, err.message);
    return {};
  }
}

function findThumbnail(categoryPath, basename, ext) {
  const thumbNames = [
    `${basename}-thumb.png`,
    `${basename}-thumb.jpg`,
    `${basename}-thumb.jpeg`,
    `${basename}-thumb.webp`,
    `${basename}.thumb.png`,
    `${basename}.thumb.jpg`,
  ];

  for (const thumb of thumbNames) {
    if (fs.existsSync(path.join(categoryPath, thumb))) {
      return thumb;
    }
  }

  if (!VIDEO_EXTENSIONS.has(ext)) return undefined;
  return undefined;
}

function findVideoFrameSource(category, basename) {
  if (!fs.existsSync(VIDEO_FRAMES_DIR)) return null;

  const prefix = `${category}_${basename}`;
  const preferred = [
    `${prefix}_mid.jpg`,
    `${prefix}.jpg`,
    `${prefix}_3s.jpg`,
    `${prefix}_5s.jpg`,
    `${prefix}_8s.jpg`,
  ];

  for (const name of preferred) {
    const full = path.join(VIDEO_FRAMES_DIR, name);
    if (fs.existsSync(full)) return full;
  }

  const match = fs
    .readdirSync(VIDEO_FRAMES_DIR)
    .find(
      (file) =>
        file.startsWith(prefix) &&
        file.endsWith(".jpg") &&
        !file.includes("_8s")
    );

  return match ? path.join(VIDEO_FRAMES_DIR, match) : null;
}

function hasFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function extractFrameWithFfmpeg(videoPath, outputPath) {
  if (!hasFfmpeg()) return false;

  try {
    execSync(
      `ffmpeg -y -ss 0.5 -i "${videoPath}" -vframes 1 -q:v 3 "${outputPath}"`,
      { stdio: "ignore" }
    );
    return fs.existsSync(outputPath);
  } catch {
    return false;
  }
}

function ensureVideoThumbnail(categoryPath, category, basename, videoFile) {
  const existing = findThumbnail(
    categoryPath,
    basename,
    path.extname(videoFile).toLowerCase()
  );
  if (existing) return `/assets/${category}/${existing}`;

  const thumbName = `${basename}-thumb.jpg`;
  const thumbPath = path.join(categoryPath, thumbName);

  if (!fs.existsSync(thumbPath)) {
    const frameSource = findVideoFrameSource(category, basename);
    if (frameSource) {
      fs.copyFileSync(frameSource, thumbPath);
    } else {
      const videoPath = path.join(categoryPath, videoFile);
      extractFrameWithFfmpeg(videoPath, thumbPath);
    }
  }

  if (fs.existsSync(thumbPath)) {
    return `/assets/${category}/${thumbName}`;
  }

  return undefined;
}

function scanCategory(category) {
  const categoryPath = path.join(ASSETS_DIR, category);
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
    return [];
  }

  const meta = loadMeta(categoryPath);
  const files = fs.readdirSync(categoryPath);
  const items = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!MEDIA_EXTENSIONS.has(ext)) continue;

    const basename = path.basename(file, ext);
    if (basename.endsWith("-thumb") || basename.endsWith(".thumb")) continue;
    const fileMeta = meta[file] || meta[`${basename}${ext}`] || {};
    const src = `/assets/${category}/${file}`;
    const type = VIDEO_EXTENSIONS.has(ext) ? "video" : "image";
    const thumbFile = findThumbnail(categoryPath, basename, ext);
    const thumbnail = thumbFile
      ? `/assets/${category}/${thumbFile}`
      : type === "video"
        ? ensureVideoThumbnail(categoryPath, category, basename, file) ||
          fileMeta.thumbnail
        : fileMeta.thumbnail;

    const isWip = category === "wip";
    const isBestWork = category === "best-work";

    items.push({
      id: fileMeta.id || `${category}-${slugify(file)}`,
      title: fileMeta.title || titleFromFilename(file),
      category,
      src,
      type,
      extension: ext.slice(1),
      thumbnail,
      description:
        fileMeta.description ||
        `Portfolio work from the ${category.replace("-", " ")} category.`,
      tags: fileMeta.tags || DEFAULT_TAGS[category] || [],
      date: fileMeta.date,
      status: fileMeta.status || (isWip ? "WIP" : "Completed"),
      featured: fileMeta.featured ?? isBestWork,
      order: fileMeta.order ?? 999,
    });
  }

  return items;
}

function generate() {
  if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  }

  const allItems = [];
  for (const category of CATEGORIES) {
    const categoryDir = path.join(ASSETS_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    allItems.push(...scanCategory(category));
  }

  allItems.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  const output = `// AUTO-GENERATED - do not edit manually.
// Run: pnpm generate:assets

import type { PortfolioAsset } from "@/types/portfolio";

export const portfolioAssets: PortfolioAsset[] = ${JSON.stringify(allItems, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(
    `Generated ${allItems.length} portfolio asset(s) → src/generated/portfolio-assets.ts`
  );
}

generate();
