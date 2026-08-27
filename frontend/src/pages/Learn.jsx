import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";

export default function Learn() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);

        const data = await fetchArticles();

        console.log("PUBLISHED ARTICLES:", data);

        setArticles(data.articles || []);
      } catch (err) {
        console.error("Failed to fetch articles:", err);

        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return articles;
    }

    return articles.filter((article) => {
      const title = article.title?.toLowerCase() || "";
      const excerpt = article.excerpt?.toLowerCase() || "";

      const tags = article.tags?.join(" ").toLowerCase() || "";

      return (
        title.includes(query) || excerpt.includes(query) || tags.includes(query)
      );
    });
  }, [articles, search]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-white/5 bg-muted/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Learn</h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            A practical library for electronics, embedded systems, Verilog, FPGA
            and digital design.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, tags, topics..."
              className="w-full rounded-lg border border-white/10 bg-background px-9 py-2.5 text-sm outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-xl border border-white/10 bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">{error}</div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">No articles found</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
