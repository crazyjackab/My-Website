import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, Info, Lightbulb } from "lucide-react";

type CalloutType = "info" | "tip" | "warn";

function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  const styles: Record<CalloutType, string> = {
    info: "border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan/90",
    tip: "border-neon-green/30 bg-neon-green/5 text-neon-green/90",
    warn: "border-neon-amber/30 bg-neon-amber/5 text-neon-amber/90",
  };

  const icons = {
    info: Info,
    tip: Lightbulb,
    warn: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={cn("my-6 rounded-lg border p-4", styles[type])}>
      <div className="flex gap-3">
        <Icon size={16} className="mt-0.5 shrink-0" />
        <div className="min-w-0 text-sm leading-relaxed text-text-primary">{children}</div>
      </div>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-10 mb-4 font-display text-xl tracking-wide text-white first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 font-mono text-sm tracking-widest text-neon-cyan/90 uppercase" {...props} />
  ),
  p: (props) => <p className="my-4 text-sm leading-relaxed text-text-muted" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-5 text-sm text-text-muted" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-5 text-sm text-text-muted" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon-cyan underline underline-offset-2 hover:text-neon-purple"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href ?? "#"} className="text-neon-cyan underline underline-offset-2 hover:text-neon-purple" {...props}>
        {children}
      </Link>
    );
  },
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-neon-purple/50 pl-4 font-mono text-sm text-neon-purple/80"
      {...props}
    />
  ),
  code: ({ children, className, ...props }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className={cn("font-mono text-[13px] text-neon-green/90", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[12px] text-neon-cyan"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-neon-green/90"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  Callout,
};
