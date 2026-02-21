import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Globe, ExternalLink } from 'lucide-react';
import type { Article } from '../types';
import { formatRelativeDate, getCategoryColor } from '../utils/formatters';

interface ArticleListItemProps {
  article: Article;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ article }) => {
  const [imgError, setImgError] = useState(false);
  const author = article.creator?.filter(Boolean)[0];

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300 flex gap-4 p-4">
      {/* Thumbnail */}
      <Link
        to={`/article/${article.article_id}`}
        className="shrink-0 w-24 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 block"
      >
        {article.image_url && !imgError ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-700 dark:to-gray-600">
            <Globe className="w-8 h-8 text-brand-200 dark:text-gray-500" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {article.category?.slice(0, 2).map((cat) => (
            <span key={cat} className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getCategoryColor(cat)}`}>
              {cat}
            </span>
          ))}
        </div>

        <Link to={`/article/${article.article_id}`}>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 text-sm sm:text-base">
            {article.title}
          </h2>
        </Link>

        {article.description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          {author && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />{author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatRelativeDate(article.pubDate)}
          </span>
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-brand-500 hover:text-brand-600"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              Original
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleListItem;
