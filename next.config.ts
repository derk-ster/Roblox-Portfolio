import type { NextConfig } from "next";

const mediaCdnBase =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  (process.env.VERCEL === "1"
    ? "https://cdn.jsdelivr.net/gh/derk-ster/Roblox-Portfolio@main/public"
    : "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_MEDIA_BASE_URL: mediaCdnBase,
  },
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
