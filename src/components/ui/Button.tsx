"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";
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
    "bg-cyan/10 text-cyan border border-cyan/25 hover:bg-cyan/15 hover:border-cyan/40",
  secondary:
    "bg-purple/10 text-purple border border-purple/25 hover:bg-purple/15 hover:border-purple/40",
  ghost: "text-muted hover:text-text hover:bg-white/5 border border-transparent",
  outline:
    "border border-white/15 text-text hover:border-white/25 hover:bg-white/[0.03]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

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
      "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none",
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <motion.a
          href={href}
          className={classes}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {icon}
          {children}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as object)}
      >
        {icon}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
