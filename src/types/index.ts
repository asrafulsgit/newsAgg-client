export interface Article {
  _id: string;
  article_id: string;
  title: string;
  link?: string;
  keywords?: string[];
  creator?: string[];
  video_url?: string;
  description?: string;
  content?: string;
  pubDate?: string;
  image_url?: string;
  source_id?: string;
  source_name?: string;
  source_url?: string;
  source_icon?: string;
  country?: string[];
  category?: string[];
  language?: string;
  datatype?: string;
  sentiment?: string;
  ai_tag?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ArticlesResponse {
  success: boolean;
  data: Article[];
  pagination: Pagination;
}

export interface ArticleResponse {
  success: boolean;
  data: Article;
}

export interface FilterOptions {
  languages: string[];
  countries: string[];
  categories: string[];
  datatypes: string[];
  authors: string[];
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptions;
}

export interface StatsData {
  total: number;
  last24h: number;
  byCategory: { _id: string; count: number }[];
  byLanguage: { _id: string; count: number }[];
}

export interface Filters {
  startDate: string;
  endDate: string;
  author: string;
  language: string[];
  country: string[];
  category: string[];
  datatype: string[];
  search: string;
}

export type SortBy = 'pubDate' | 'title';
export type SortOrder = 'asc' | 'desc';
