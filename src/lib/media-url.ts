const VIDEO_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;

/** Encode path segments so CDN/local URLs with spaces resolve correctly. */
export function encodeMediaPath(src: string): string {
  return src
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function resolveMediaUrl(src: string): string {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");
  const encoded = encodeMediaPath(src);

  if (!base || !src.startsWith("/") || !VIDEO_EXT.test(src)) {
    return VIDEO_EXT.test(src) ? encoded : src;
  }

  return `${base}${encoded}`;
}
