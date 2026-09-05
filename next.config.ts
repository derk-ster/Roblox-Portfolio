import type { NextConfig } from "next";

// Prefer GitHub raw over jsDelivr: portfolio videos are typically >20MB and
// jsDelivr returns 403 for those single-file requests.
const mediaCdnBase =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  (process.env.VERCEL === "1"
    ? "https://raw.githubusercontent.com/derk-ster/Roblox-Portfolio/main/public"
    : "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_MEDIA_BASE_URL: mediaCdnBase,
  },
  serverExternalPackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
