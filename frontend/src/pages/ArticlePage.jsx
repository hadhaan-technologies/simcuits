import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import { fetchArticleBySlug, fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";

export default function ArticlePage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [publishedArticles, setPublishedArticles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;

      setProgress(
        height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0,
      );
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);

        const [articleResponse, articlesResponse] = await Promise.all([
          fetchArticleBySlug(slug),
          fetchArticles(),
        ]);

        setArticle(articleResponse.article);
        setPublishedArticles(articlesResponse.articles || []);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("Article not found.");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">Loading article...</div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Article not found</h1>

        <Link to="/learn" className="mt-4 inline-flex text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learn
        </Link>
      </div>
    );
  }

  const index = publishedArticles.findIndex((item) => item._id === article._id);

  const prev = index > 0 ? publishedArticles[index - 1] : null;

  const next =
    index >= 0 && index < publishedArticles.length - 1
      ? publishedArticles[index + 1]
      : null;

  const related = publishedArticles
    .filter(
      (item) =>
        item._id !== article._id &&
        item.tags?.some((tag) => article.tags?.includes(tag)),
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Reading progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-1">
        <div
          className="h-full bg-primary transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main>
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          {/* Back */}
          <Link
            to="/learn"
            className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learn
          </Link>

          <article>
            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="mt-4 text-lg text-muted-foreground">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.author?.username && (
                <span className="font-medium text-foreground">
                  {article.author.username}
                </span>
              )}

              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              )}

              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTimeMinutes || 1} min read
              </span>
            </div>

            {/* Cover */}
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className="mt-8 w-full rounded-xl border border-white/10 object-cover"
              />
            )}

            {/* Content */}
            <div
              className="prose prose-invert mt-10 max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Previous / Next */}
            <nav className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={`/learn/${prev.slug}`}
                  className="rounded-xl border border-white/10 p-4 hover:border-primary/40"
                >
                  <span className="text-xs text-muted-foreground">
                    Previous
                  </span>

                  <p className="mt-1 text-sm font-medium">{prev.title}</p>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  to={`/learn/${next.slug}`}
                  className="rounded-xl border border-white/10 p-4 text-right hover:border-primary/40"
                >
                  <span className="text-xs text-muted-foreground">Next</span>

                  <p className="mt-1 text-sm font-medium">{next.title}</p>
                </Link>
              )}
            </nav>
          </article>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-white/10 bg-muted/40 py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Related reading</h2>

                <Link to="/learn" className="text-sm text-primary">
                  All articles
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <ArticleCard key={item._id} article={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
