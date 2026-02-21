import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  formatOption?: (val: string) => string;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  formatOption = (v) => v,
  placeholder = 'Any',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter((o) =>
    formatOption(o).toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition text-left"
      >
        <span className="truncate text-gray-700 dark:text-gray-200">
          {selected.length === 0
            ? placeholder
            : selected.length === 1
            ? formatOption(selected[0])
            : `${selected.length} selected`}
        </span>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange([]); }}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-56 overflow-hidden flex flex-col">
          {options.length > 8 && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                autoFocus
              />
            </div>
          )}
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 p-3 text-center">No options found</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(option)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-brand-50 dark:hover:bg-gray-700 transition capitalize"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                    selected.includes(option)
                      ? 'bg-brand-500 border-brand-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selected.includes(option) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{formatOption(option)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
