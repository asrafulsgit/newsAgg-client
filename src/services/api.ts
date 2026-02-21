import axios from 'axios';
import type {
  ArticlesResponse,
  ArticleResponse,
  FilterOptionsResponse,
  Filters,
  SortBy,
  SortOrder,
} from '../types';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export interface FetchArticlesParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  filters?: Partial<Filters>;
}

const buildParams = ({ page = 1, limit = 20, sortBy = 'pubDate', sortOrder = 'desc', filters = {} }: FetchArticlesParams) => {
  const params: Record<string, string | string[] | number> = {
    page,
    limit,
    sortBy,
    sortOrder,
  };

  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.author?.trim()) params.author = filters.author.trim();
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.language?.length) params.language = filters.language;
  if (filters.country?.length) params.country = filters.country;
  if (filters.category?.length) params.category = filters.category;
  if (filters.datatype?.length) params.datatype = filters.datatype;

  return params;
};

export const newsApi = {
  getArticles: (params: FetchArticlesParams = {}): Promise<ArticlesResponse> =>
    api.get('/news', { params: buildParams(params) }).then((r) => r.data),

  getArticle: (id: string): Promise<ArticleResponse> =>
    api.get(`/news/${id}`).then((r) => r.data),

  getFilterOptions: (): Promise<FilterOptionsResponse> =>
    api.get('/news/filters').then((r) => r.data),

  getStats: () => api.get('/news/stats').then((r) => r.data),

  triggerIngestion: () => api.post('/news/ingest').then((r) => r.data),
};
