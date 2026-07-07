import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoPlayOverlay({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] flex items-center justify-center",
        className
      )}
      aria-hidden
    >
      <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/20" />
      <span
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12",
          "bg-[var(--primary)] text-white",
          "shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_50%,transparent)]",
          "ring-2 ring-white/25",
          "transition-transform duration-200 group-hover/media:scale-110"
        )}
      >
        <Play className="ml-0.5 h-5 w-5 fill-current sm:h-[1.35rem] sm:w-[1.35rem]" />
      </span>
    </span>
  );
}
