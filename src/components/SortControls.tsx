import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, LayoutGrid, List } from 'lucide-react';
import type { SortBy, SortOrder } from '../types';

interface SortControlsProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  total?: number;
  loading: boolean;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  total,
  loading,
}) => {
  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  const SortIcon = sortOrder === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        {!loading && total !== undefined && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-200">{total.toLocaleString()}</span> articles
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Sort Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <SortButton
            label="Date"
            active={sortBy === 'pubDate'}
            icon={sortBy === 'pubDate' ? <SortIcon className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
            onClick={() => toggleSort('pubDate')}
          />
          <SortButton
            label="Title"
            active={sortBy === 'title'}
            icon={sortBy === 'title' ? <SortIcon className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
            onClick={() => toggleSort('title')}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'} transition`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'} transition`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SortButton: React.FC<{
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ label, active, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition ${
      active
        ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default SortControls;
