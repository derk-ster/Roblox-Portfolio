import { MediaLoadingSkeleton } from "@/components/ui/MediaLoadingSkeleton";

export function SceneLoadingFallback() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <MediaLoadingSkeleton />
    </div>
  );
}
