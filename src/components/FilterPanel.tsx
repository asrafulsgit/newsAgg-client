import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useFilters } from '../context/FiltersContext';
import { useFilterOptions } from '../hooks/useFilterOptions';
import MultiSelect from './MultiSelect';
import { getLanguageName, getCountryName } from '../utils/formatters';

const FilterPanel: React.FC = () => {
  const { state, setFilter, resetFilters, activeFilterCount } = useFilters();
  const { options, loading } = useFilterOptions();
  const [collapsed, setCollapsed] = useState(false);

  const { filters } = state;

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 sticky top-20">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-500" />
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-500 hover:text-brand-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-brand-50 dark:hover:bg-gray-700 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition lg:hidden"
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filter Body */}
        <div className={`${collapsed ? 'hidden' : 'block'} lg:block`}>
          <div className="p-4 space-y-5">
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilter('search', e.target.value)}
                  placeholder="Search in articles..."
                  className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilter('search', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Date Range
              </label>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-400 mb-0.5 block">From</span>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilter('startDate', e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-400 mb-0.5 block">To</span>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilter('endDate', e.target.value)}
                    min={filters.startDate}
                    className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Author / Creator
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.author}
                  onChange={(e) => setFilter('author', e.target.value)}
                  placeholder="Search by author..."
                  list="authors-datalist"
                  className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
                {filters.author && (
                  <button
                    onClick={() => setFilter('author', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {options?.authors && (
                <datalist id="authors-datalist">
                  {options.authors.slice(0, 100).map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              )}
            </div>

            {/* Category */}
            <MultiSelect
              label="Category"
              options={loading ? [] : (options?.categories || [])}
              selected={filters.category}
              onChange={(vals) => setFilter('category', vals)}
              formatOption={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              placeholder="All Categories"
            />

            {/* Language */}
            <MultiSelect
              label="Language"
              options={loading ? [] : (options?.languages || [])}
              selected={filters.language}
              onChange={(vals) => setFilter('language', vals)}
              formatOption={getLanguageName}
              placeholder="All Languages"
            />

            {/* Country */}
            <MultiSelect
              label="Country"
              options={loading ? [] : (options?.countries || [])}
              selected={filters.country}
              onChange={(vals) => setFilter('country', vals)}
              formatOption={(v) => { try { return getCountryName(v); } catch { return v.toUpperCase(); } }}
              placeholder="All Countries"
            />

            {/* Content Type */}
            <MultiSelect
              label="Content Type"
              options={loading ? [] : (options?.datatypes || [])}
              selected={filters.datatype}
              onChange={(vals) => setFilter('datatype', vals)}
              formatOption={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              placeholder="All Types"
            />

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Active filters:</p>
                <div className="flex flex-wrap gap-1.5">
                  {filters.search && (
                    <FilterTag label={`"${filters.search}"`} onRemove={() => setFilter('search', '')} />
                  )}
                  {filters.author && (
                    <FilterTag label={filters.author} onRemove={() => setFilter('author', '')} />
                  )}
                  {(filters.startDate || filters.endDate) && (
                    <FilterTag
                      label={`${filters.startDate || '...'} → ${filters.endDate || '...'}`}
                      onRemove={() => { setFilter('startDate', ''); setFilter('endDate', ''); }}
                    />
                  )}
                  {filters.category.map((c) => (
                    <FilterTag
                      key={c}
                      label={c}
                      onRemove={() => setFilter('category', filters.category.filter((x) => x !== c))}
                    />
                  ))}
                  {filters.language.map((l) => (
                    <FilterTag
                      key={l}
                      label={getLanguageName(l)}
                      onRemove={() => setFilter('language', filters.language.filter((x) => x !== l))}
                    />
                  ))}
                  {filters.country.map((c) => (
                    <FilterTag
                      key={c}
                      label={c.toUpperCase()}
                      onRemove={() => setFilter('country', filters.country.filter((x) => x !== c))}
                    />
                  ))}
                  {filters.datatype.map((d) => (
                    <FilterTag
                      key={d}
                      label={d}
                      onRemove={() => setFilter('datatype', filters.datatype.filter((x) => x !== d))}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="flex items-center gap-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-full px-2 py-0.5 capitalize max-w-full">
    <span className="truncate">{label}</span>
    <button onClick={onRemove} className="shrink-0 hover:text-brand-900">
      <X className="w-3 h-3" />
    </button>
  </span>
);

export default FilterPanel;
