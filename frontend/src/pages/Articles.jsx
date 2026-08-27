import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArticles } from "../api/articles";

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then((data) => setArticles(data.articles));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>

      <div className="grid gap-6">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/articles/${article.slug}`}
            className="block border rounded-lg p-5 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 mb-3">{article.excerpt}</p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{article.author?.username}</span>
              <span>·</span>
              <span>{article.readTimeMinutes} min read</span>
              <span>·</span>
              <span>{article.views} views</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
