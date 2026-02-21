import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = (): (number | '...')[] => {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }
    const result: (number | '...')[] = [1];
    if (range[0] > 2) result.push('...');
    result.push(...range);
    if (range[range.length - 1] < totalPages - 1) result.push('...');
    if (totalPages > 1) result.push(totalPages);
    return result;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-200">{startItem}–{endItem}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-200">{total.toLocaleString()}</span> articles
      </p>

      <div className="flex items-center gap-1">
        <PageBtn onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">
          <ChevronsLeft className="w-4 h-4" />
        </PageBtn>
        <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
        </PageBtn>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          ) : (
            <PageBtn
              key={p}
              onClick={() => onPageChange(p)}
              active={p === page}
            >
              {p}
            </PageBtn>
          )
        )}

        <PageBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
          <ChevronRight className="w-4 h-4" />
        </PageBtn>
        <PageBtn onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">
          <ChevronsRight className="w-4 h-4" />
        </PageBtn>
      </div>
    </div>
  );
};

const PageBtn: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
}> = ({ onClick, disabled, active, children, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition flex items-center justify-center ${
      active
        ? 'bg-brand-500 text-white shadow-sm'
        : disabled
        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

export default Pagination;
