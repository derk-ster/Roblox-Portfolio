import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "cyan" | "purple" | "pink" | "orange" | "lime" | "wip";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-muted border-white/10",
  cyan: "bg-cyan/8 text-cyan border-cyan/20",
  purple: "bg-purple/8 text-purple border-purple/20",
  pink: "bg-pink/8 text-pink border-pink/20",
  orange: "bg-orange/8 text-orange border-orange/20",
  lime: "bg-lime/8 text-lime border-lime/20",
  wip: "bg-orange/10 text-orange border-orange/25",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
