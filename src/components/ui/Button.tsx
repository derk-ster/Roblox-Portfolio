"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: ReactNode;
  glow?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_28%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] hover:border-[color-mix(in_srgb,var(--primary)_42%,transparent)]",
  secondary:
    "bg-[color-mix(in_srgb,var(--secondary)_10%,transparent)] text-[var(--secondary)] border border-[color-mix(in_srgb,var(--secondary)_28%,transparent)] hover:bg-[color-mix(in_srgb,var(--secondary)_16%,transparent)] hover:border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
  ghost:
    "text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent",
  outline:
    "border border-[var(--border)] text-[var(--text)] hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)] hover:bg-white/[0.03]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      const external = isExternalHref(href);
      return (
        <a
          href={href}
          className={classes}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {icon}
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
