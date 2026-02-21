import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="flex justify-between mt-4">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 9 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
