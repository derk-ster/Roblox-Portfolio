import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "public", "assets");
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

if (process.env.VERCEL !== "1") {
  process.exit(0);
}

function removeVideos(dir) {
  if (!fs.existsSync(dir)) return 0;

  let removed = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removed += removeVideos(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!VIDEO_EXTENSIONS.has(ext)) continue;

    fs.unlinkSync(fullPath);
    removed += 1;
  }

  return removed;
}

const removed = removeVideos(ASSETS_DIR);
console.log(
  `Vercel deploy: removed ${removed} video file(s) from public/assets (served via CDN)`
);
