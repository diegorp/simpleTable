import { useState } from 'react';
import { getSortDirection } from '@/utils/getSortDirection';
import type { Sort } from '@/types';

export const useTableSort = <T>(
  rowIdKey: keyof T,
  onSortChange?: (sort: Sort<T>) => void
) => {
  const [currentSort, setCurrentSort] = useState<Sort<T>>({
    key: rowIdKey,
    direction: 'none',
  });

  const toggleSort = (key: keyof T) => {
    setCurrentSort(prev => {
      const newDirection = getSortDirection(
        prev.key !== key ? 'none' : prev.direction
      );
      const newSort: Sort<T> = {
        key,
        direction: newDirection,
      };
      onSortChange?.(newSort);
      return newSort;
    });
  };

  return { currentSort, toggleSort };
};
