import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Globe, ExternalLink } from 'lucide-react';
import type { Article } from '../types';
import { formatRelativeDate, truncateText, getCategoryColor } from '../utils/formatters';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imgError, setImgError] = useState(false);

  const author = article.creator?.filter(Boolean)[0]; 

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <Link to={`/article/${article.article_id}`} className="block relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-video">
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
            <Globe className="w-12 h-12 text-brand-200 dark:text-gray-500" />
          </div>
        )}
        {article.datatype && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full capitalize">
            {article.datatype}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {article.category?.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getCategoryColor(cat)}`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/article/${article.article_id}`}>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 line-clamp-3">
            {truncateText(article.description, 180)}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-3 min-w-0">
            {author && (
              <span className="flex items-center gap-1 truncate">
                <User className="w-3 h-3 shrink-0" />
                <span className="truncate">{author}</span>
              </span>
            )}
            {article.source_name && !author && (
              <span className="flex items-center gap-1 truncate">
                <Globe className="w-3 h-3 shrink-0" />
                <span className="truncate">{article.source_name}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{formatRelativeDate(article.pubDate)}</span>
          </div>
        </div>

        {/* External link */}
        {article.link && (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-brand-500 hover:text-brand-600 flex items-center gap-1 w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            Read original
          </a>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
