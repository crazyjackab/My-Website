import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { handle } from "@/data/profile";
import { ArrowLeft } from "lucide-react";

interface SiteSubpageHeaderProps {
  backHref: string;
  backLabel: string;
}

export function SiteSubpageHeader({ backHref, backLabel }: SiteSubpageHeaderProps) {
  const t = useTranslations("common");

  return (
    <header className="border-b border-white/10 bg-bg-primary/90 backdrop-blur-xl">
      <div className="section-container flex h-16 items-center justify-between">
        <Link
          href={backHref}
          className="flex items-center gap-2 font-mono text-xs text-neon-cyan/80 transition-colors hover:text-neon-cyan"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </Link>
        <div className="flex items-center gap-4 font-mono text-xs">
          <Link href="/blog" className="text-text-muted transition-colors hover:text-neon-purple">
            {t("blog")}
          </Link>
          <Link href="/" className="text-text-muted transition-colors hover:text-neon-cyan">
            {handle}.dev
          </Link>
        </div>
      </div>
    </header>
  );
}
