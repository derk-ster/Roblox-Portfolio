import { cn } from "@/lib/utils";

interface MediaLoadingSkeletonProps {
  className?: string;
}

/** Shared media placeholder — same shimmer everywhere cards/modals load. */
export function MediaLoadingSkeleton({ className }: MediaLoadingSkeletonProps) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden bg-white/5", className)}
      aria-hidden
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.03] via-white/[0.07] to-white/[0.03]" />
      <div className="media-shimmer absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
