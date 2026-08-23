import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "emerald" | "champagne" | "dark" | "outline" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    default: "bg-black/5 text-luxury-ink border-transparent",
    emerald: "bg-emerald/10 text-emerald border-emerald/20",
    champagne: "bg-champagne/20 text-[#846522] border-champagne/40 font-medium",
    dark: "bg-luxury-dark/90 text-white/90 border-white/10 backdrop-blur-md",
    outline: "bg-transparent text-luxury-sage border-border-subtle",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase border select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
