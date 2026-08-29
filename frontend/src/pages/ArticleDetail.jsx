import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { fetchArticleBySlug } from '../api/articles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchArticleBySlug(slug)
      .then((data) => setArticle(data.article))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <div className="p-6">Article not found.</div>;
  if (!article) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span>{article.author?.username}</span>
        <span>·</span>
        <span>{article.readTimeMinutes} min read</span>
        <span>·</span>
        <span>{article.views} views</span>
      </div>

      <article className="prose max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>

      <div className="flex gap-2 mt-8">
        {article.tags?.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
