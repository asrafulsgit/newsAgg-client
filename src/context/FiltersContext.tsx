import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Filters, SortBy, SortOrder } from '../types';

interface FiltersState {
  filters: Filters;
  page: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  limit: number;
}

const defaultFilters: Filters = {
  startDate: '',
  endDate: '',
  author: '',
  language: [],
  country: [],
  category: [],
  datatype: [],
  search: '',
};

const initialState: FiltersState = {
  filters: defaultFilters,
  page: 1,
  sortBy: 'pubDate',
  sortOrder: 'desc',
  limit: 20,
};

type Action =
  | { type: 'SET_FILTER'; key: keyof Filters; value: Filters[keyof Filters] }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_SORT'; sortBy: SortBy; sortOrder: SortOrder }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_LIMIT'; limit: number };

function reducer(state: FiltersState, action: Action): FiltersState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.key]: action.value }, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.page };
    case 'SET_SORT':
      return { ...state, sortBy: action.sortBy, sortOrder: action.sortOrder, page: 1 };
    case 'RESET_FILTERS':
      return { ...initialState };
    case 'SET_LIMIT':
      return { ...state, limit: action.limit, page: 1 };
    default:
      return state;
  }
}

interface FiltersContextType {
  state: FiltersState;
  setFilter: (key: keyof Filters, value: Filters[keyof Filters]) => void;
  setPage: (page: number) => void;
  setSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  resetFilters: () => void;
  setLimit: (limit: number) => void;
  activeFilterCount: number;
}

const FiltersContext = createContext<FiltersContextType | null>(null);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFilter = useCallback((key: keyof Filters, value: Filters[keyof Filters]) => {
    dispatch({ type: 'SET_FILTER', key, value });
  }, []);

  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), []);

  const setSort = useCallback((sortBy: SortBy, sortOrder: SortOrder) => {
    dispatch({ type: 'SET_SORT', sortBy, sortOrder });
  }, []);

  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), []);

  const setLimit = useCallback((limit: number) => dispatch({ type: 'SET_LIMIT', limit }), []);

  const activeFilterCount = Object.entries(state.filters).reduce((count, [, value]) => {
    if (Array.isArray(value) && value.length > 0) return count + 1;
    if (typeof value === 'string' && value.trim()) return count + 1;
    return count;
  }, 0);

  return (
    <FiltersContext.Provider value={{ state, setFilter, setPage, setSort, resetFilters, setLimit, activeFilterCount }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider');
  return ctx;
};
