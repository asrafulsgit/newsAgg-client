import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, User, Globe, ExternalLink, Tag,
  MapPin, BookOpen, Share2, Copy, Check
} from 'lucide-react';
import { newsApi } from '../services/api';
import type { Article } from '../types';
import { formatFullDate, getCategoryColor, getLanguageName, getCountryName, getSentimentColor } from '../utils/formatters';

const ArticleDetailSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6" />
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  </div>
);

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    newsApi
      .getArticle(id)
      .then((res) => setArticle(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} · NewsAgg`;
    }
    return () => { document.title = 'NewsAgg'; };
  }, [article?.title]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-8 px-4">
        <ArticleDetailSkeleton />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <BookOpen className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Article not found</h1>
        <p className="text-gray-500 mb-6">{error || 'This article may have been removed.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    );
  }

  const hasContent = article.content && article.content.trim().length > 50;
  const displayText = hasContent ? article.content : article.description;

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to feed
      </button>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.category?.map((cat) => (
          <Link
            key={cat}
            to={`/?category=${cat}`}
            className={`text-sm font-medium px-3 py-1 rounded-full capitalize transition hover:opacity-80 ${getCategoryColor(cat)}`}
          >
            {cat}
          </Link>
        ))}
        {article.datatype && (
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 capitalize">
            {article.datatype}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-6">
        {article.title}
      </h1>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-6 border-b border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
        {article.creator && article.creator.length > 0 && (
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-gray-400" />
            <span>{article.creator.filter(Boolean).join(', ')}</span>
          </div>
        )}
        {article.pubDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <time dateTime={article.pubDate}>{formatFullDate(article.pubDate)}</time>
          </div>
        )}
        {article.source_name && (
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-gray-400" />
            <span>{article.source_name}</span>
          </div>
        )}
        {article.language && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium uppercase">
              {getLanguageName(article.language)}
            </span>
          </div>
        )}
        {article.sentiment && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getSentimentColor(article.sentiment)}`}>
            {article.sentiment}
          </span>
        )}
      </div>

      {/* Hero Image */}
      {article.image_url && (
        <div className="my-6 rounded-2xl overflow-hidden max-h-[500px] bg-gray-100 dark:bg-gray-800">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Description / Snippet */}
      {article.description && (
        <div className="bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-400 rounded-r-lg px-5 py-4 my-6">
          <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed italic">
            {article.description}
          </p>
        </div>
      )}

      {/* Content */}
      {displayText ? (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {displayText.split('\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">Full content not available. Read the original article below.</p>
        </div>
      )}

      {/* Keywords */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((kw) => (
              <Link
                key={kw}
                to={`/?search=${encodeURIComponent(kw)}`}
                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 transition capitalize"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Countries */}
      {article.country && article.country.length > 0 && (
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Regions:</span>
          {article.country.map((c) => (
            <span key={c} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {getCountryName(c)}
            </span>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3">
        {article.link && (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Read Full Article
          </a>
        )}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button
          onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </article>
  );
};

export default ArticlePage;
