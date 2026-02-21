import React, { useState } from "react";
import { AlertCircle, RefreshCw, Newspaper } from "lucide-react";
import { FiltersProvider, useFilters } from "../context/FiltersContext";
import FilterPanel from "../components/FilterPanel";
import ArticleCard from "../components/ArticleCard";
import ArticleListItem from "../components/ArticleListItem";
import SortControls from "../components/SortControls";
import Pagination from "../components/Pagination";
import { SkeletonGrid } from "../components/SkeletonCard";
import { useNews } from "../hooks/useNews";
import { useDebounce } from "../hooks/useDebounce";
import { useUrlSync } from "../hooks/useUrlSync";

const NewsContent: React.FC = () => {
  const { state, setPage, setSort } = useFilters();
  const { filters, page, limit, sortBy, sortOrder } = state;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Bidirectional URL ↔ state sync
  useUrlSync();

  const debouncedFilters = useDebounce(filters, 400);

  const { articles, pagination, loading, error, refetch } = useNews({
    page,
    limit,
    sortBy,
    sortOrder,
    filters: debouncedFilters,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filter Panel */}
      <FilterPanel />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          total={pagination?.total}
          loading={loading}
        />

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Failed to load articles
            </h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <SkeletonGrid count={viewMode === "grid" ? 9 : 6} />
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Newspaper className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No articles found
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
              Try adjusting your filters or search terms to find what you're
              looking for.
            </p>
          </div>
        )}

        {/* Articles */}
        {!loading && !error && articles.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                {articles.map((article) => (
                  <ArticleCard key={article.article_id} article={article} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 animate-fade-in">
                {articles.map((article) => (
                  <ArticleListItem key={article.article_id} article={article} />
                ))}
              </div>
            )}

            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

const HomePage: React.FC = () => (
  <FiltersProvider>
    <NewsContent />
  </FiltersProvider>
);

export default HomePage;
