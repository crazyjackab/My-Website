"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { handleHashLinkClick } from "@/lib/smooth-scroll";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-mono text-xs tracking-wider uppercase transition-all duration-300";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: undefined;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
};

function getVariantClass(variant: Variant, recruiterMode: boolean): string {
  if (recruiterMode) {
    switch (variant) {
      case "primary":
        return "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 shadow-sm";
      case "secondary":
        return "border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-300";
      case "ghost":
        return "border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900";
    }
  }

  switch (variant) {
    case "primary":
      return "border border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/15 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]";
    case "secondary":
      return "border border-neon-purple/40 bg-neon-purple/5 text-neon-purple hover:border-neon-purple hover:bg-neon-purple/15";
    case "ghost":
      return "border border-white/10 text-text-muted hover:border-white/30 hover:text-white";
  }
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const { recruiterMode } = useTheme();
    const classes = cn(baseClass, getVariantClass(variant, recruiterMode), className);

    if ("href" in props && props.href) {
      const { href, onClick, ...linkProps } = props;
      const isExternal = href.startsWith("http") || href.startsWith("mailto");
      if (href.startsWith("#")) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={classes}
            onClick={(e) => {
              handleHashLinkClick(e, href);
              onClick?.(e);
            }}
            {...linkProps}
          >
            {children}
          </a>
        );
      }
      if (isExternal) {
        return (
          <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...linkProps}>
            {children}
          </a>
        );
      }
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...linkProps}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...(props as ButtonProps)}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
