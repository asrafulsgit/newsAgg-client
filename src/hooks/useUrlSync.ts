import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilters } from '../context/FiltersContext';
import type {  SortBy, SortOrder } from '../types';

/**
 * Bidirectionally syncs filter state with URL query params.
 *
 * URL → State  (on first mount, reads URL and populates filters)
 * State → URL  (on every state change, writes filters back to URL)
 *
 * Example URL:
 * /?page=2&sortBy=pubDate&sortOrder=desc&search=AI&category=technology,science
 *   &language=en&country=us&startDate=2026-02-18&endDate=2026-02-25
 *   &author=John&datatype=news
 */
export function useUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, setFilter, setPage, setSort } = useFilters();
  const isFirstMount = useRef(true);

  // ── URL → State (runs once on mount) ──────────────────────────────────────
  useEffect(() => {
    const p = searchParams;

    // String filters
    const search    = p.get('search')    || '';
    const startDate = p.get('startDate') || '';
    const endDate   = p.get('endDate')   || '';
    const author    = p.get('author')    || '';

    // Array filters (comma-separated in URL)
    const category = p.get('category') ? p.get('category')!.split(',').filter(Boolean) : [];
    const language = p.get('language') ? p.get('language')!.split(',').filter(Boolean) : [];
    const country  = p.get('country')  ? p.get('country')!.split(',').filter(Boolean)  : [];
    const datatype = p.get('datatype') ? p.get('datatype')!.split(',').filter(Boolean) : [];

    // Pagination & sort
    const page      = parseInt(p.get('page')      || '1', 10);
    const sortBy    = (p.get('sortBy')    || 'pubDate') as SortBy;
    const sortOrder = (p.get('sortOrder') || 'desc')   as SortOrder;

    // Only dispatch if there's actually something in the URL
    const hasParams = Array.from(p.keys()).length > 0;
    if (!hasParams) return;

    if (search)    setFilter('search',    search);
    if (startDate) setFilter('startDate', startDate);
    if (endDate)   setFilter('endDate',   endDate);
    if (author)    setFilter('author',    author);
    if (category.length) setFilter('category', category);
    if (language.length) setFilter('language', language);
    if (country.length)  setFilter('country',  country);
    if (datatype.length) setFilter('datatype', datatype);

    if (page > 1)               setPage(page);
    if (sortBy || sortOrder)    setSort(sortBy, sortOrder);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — only runs once on mount

  // ── State → URL (runs on every state change after mount) ─────────────────
  useEffect(() => {
    // Skip the very first render so we don't overwrite the URL before
    // the URL→State effect above has a chance to populate the state.
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const { filters, page, sortBy, sortOrder } = state;
    const params: Record<string, string> = {};

    // Only add non-default values to keep the URL clean
    if (page > 1)                   params.page      = String(page);
    if (sortBy !== 'pubDate')       params.sortBy    = sortBy;
    if (sortOrder !== 'desc')       params.sortOrder = sortOrder;

    if (filters.search.trim())      params.search    = filters.search.trim();
    if (filters.startDate)          params.startDate = filters.startDate;
    if (filters.endDate)            params.endDate   = filters.endDate;
    if (filters.author.trim())      params.author    = filters.author.trim();
    if (filters.category.length)    params.category  = filters.category.join(',');
    if (filters.language.length)    params.language  = filters.language.join(',');
    if (filters.country.length)     params.country   = filters.country.join(',');
    if (filters.datatype.length)    params.datatype  = filters.datatype.join(',');

    setSearchParams(params, { replace: true });  

  }, [state, setSearchParams]);
}
