import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

export default function ArticleCard({ article, featured = false }) {
  return (
    <Link
      to={`/learn/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {article.coverImage && (
        <div
          className={featured ? "h-56 overflow-hidden" : "h-40 overflow-hidden"}
        >
          <img
            src={`http://localhost:5000${article.coverImage}`}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="mt-3 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTimeMinutes || 1} min
          </span>

          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.views || 0}
          </span>

          {article.author?.username && (
            <span className="ml-auto">{article.author.username}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
