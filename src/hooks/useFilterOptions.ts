import { useState, useEffect } from 'react';
import { newsApi } from '../services/api';
import type { FilterOptions } from '../types';

export function useFilterOptions() {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    newsApi
      .getFilterOptions()
      .then((res) => setOptions(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { options, loading, error };
}
