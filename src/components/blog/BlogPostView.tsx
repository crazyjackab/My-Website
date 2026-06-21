import { useLocale, useTranslations } from "next-intl";
import { MdxContent } from "@/components/blog/MdxContent";
import { SiteSubpageHeader } from "@/components/layout/SiteSubpageHeader";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatBlogDate, getAllPosts, type BlogPost } from "@/lib/blog";
import { Calendar, Clock } from "lucide-react";

export function BlogPostView({ post }: { post: BlogPost }) {
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const related = getAllPosts(locale)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#050508] text-text-primary">
      <SiteSubpageHeader backHref="/blog" backLabel={tCommon("backBlog")} />

      <main id="main-content" className="section-container py-12 md:py-16">
        <article className="mx-auto max-w-3xl">
          <p className="section-label">{t("postLabel")}</p>
          <h1 className="section-title mt-2 gradient-text">{post.meta.title}</h1>
          <p className="mt-4 font-mono text-sm text-neon-purple">{post.meta.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[10px] text-neon-cyan/70">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatBlogDate(post.meta.date, locale)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingMinutes} {tCommon("minRead")}
            </span>
          </div>

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

          <div className="prose-blog glass-card mt-10 rounded-xl p-6 md:p-8">
            <MdxContent source={post.content} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/blog" variant="secondary">← {tCommon("allPosts")}</Button>
            <Button href="/#contact" variant="ghost">{tCommon("contactMe")}</Button>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="related-posts">
            <h2
              id="related-posts"
              className="font-mono text-xs tracking-widest text-neon-purple/80 uppercase"
            >
              {tCommon("morePosts")}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="glass-card rounded-xl p-5 transition-colors hover:border-neon-cyan/30"
                >
                  <p className="font-mono text-[10px] text-neon-amber">
                    {formatBlogDate(item.meta.date, locale)}
                  </p>
                  <h3 className="mt-2 font-display text-base text-white hover:text-neon-cyan">
                    {item.meta.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted line-clamp-2">{item.meta.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
