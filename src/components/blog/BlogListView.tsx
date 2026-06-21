import { useLocale, useTranslations } from "next-intl";
import { SiteSubpageHeader } from "@/components/layout/SiteSubpageHeader";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatBlogDate, type BlogPost } from "@/lib/blog";
import { Calendar, Clock } from "lucide-react";

export function BlogListView({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <div className="min-h-screen bg-[#050508] text-text-primary">
      <SiteSubpageHeader backHref="/" backLabel={tCommon("backHome")} />

      <main id="main-content" className="section-container py-12 md:py-16">
        <p className="section-label">{t("listLabel")}</p>
        <h1 className="section-title mt-2 gradient-text">{t("listTitle")}</h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-text-muted">{t("listSubtitle")}</p>

        {posts.length === 0 ? (
          <div className="glass-card mt-12 rounded-xl p-8 text-center font-mono text-sm text-text-muted">
            {t("empty")}
          </div>
        ) : (
          <div className="mt-12 grid gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="glass-card neon-border group rounded-xl p-6 transition-colors hover:border-neon-cyan/40"
              >
                <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-neon-cyan/70">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatBlogDate(post.meta.date, locale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingMinutes} {tCommon("minRead")}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-xl tracking-wide text-white group-hover:text-neon-cyan">
                  <Link href={`/blog/${post.slug}`}>{post.meta.title}</Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{post.meta.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex font-mono text-xs text-neon-green hover:underline"
                >
                  {t("readArticle")}
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
