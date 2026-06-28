const VIDEO_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;

export function resolveMediaUrl(src: string): string {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");
  if (!base || !src.startsWith("/") || !VIDEO_EXT.test(src)) {
    return src;
  }
  return `${base}${src}`;
}
