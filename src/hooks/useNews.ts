import { useState, useEffect, useCallback, useRef } from 'react';
import { newsApi, type FetchArticlesParams } from '../services/api';
import type { Article, Pagination } from '../types';

interface UseNewsReturn {
  articles: Article[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNews(params: FetchArticlesParams): UseNewsReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    // Cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    newsApi
      .getArticles(params)
      .then((res) => {
        setArticles(res.data);
        setPagination(res.pagination);
      })
      .catch((err: Error) => {
        if (err.message !== 'canceled') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), trigger]);

  return { articles, pagination, loading, error, refetch };
}
