import { useState } from 'react';
import type { Filter } from '@/types';

export const useTableFilter = <T>(
  onFilterChange?: (filter: Filter<T>) => void
) => {
  const [activeFilter, setActiveFilter] = useState<Filter<T>>(null);

  const applyFilter = (filter: Filter<T>) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return { activeFilter, applyFilter };
};
