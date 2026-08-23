import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "champagne" | "ghost" | "dark" | "disabled";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      children,
      icon,
      iconPosition = "right",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const sizeStyles = {
      sm: "h-10 px-5 text-[13px] rounded-full gap-2",
      md: "h-[52px] px-7 text-[15px] rounded-full gap-2.5",
      lg: "h-[58px] px-9 text-[16px] rounded-full gap-3",
    };

    const variantStyles = {
      primary:
        "bg-emerald text-white hover:bg-emerald-hover hover:-translate-y-0.5 shadow-sm hover:shadow-md",
      secondary:
        "bg-transparent border border-emerald/30 text-luxury-ink hover:bg-emerald/5 hover:border-emerald hover:-translate-y-0.5",
      champagne:
        "bg-champagne text-luxury-ink hover:bg-[#cfb276] hover:-translate-y-0.5 font-semibold shadow-sm",
      dark:
        "bg-luxury-dark text-white hover:bg-[#132c26] hover:-translate-y-0.5 border border-white/10",
      ghost:
        "bg-transparent text-luxury-ink hover:text-emerald underline-offset-4 hover:underline p-0 h-auto",
      disabled:
        "bg-gray-200 text-luxury-muted cursor-not-allowed border-transparent",
    };

    const isDisabled = disabled || variant === "disabled";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[isDisabled ? "disabled" : variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "right" && <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
