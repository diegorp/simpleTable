import type { SortDirection } from '@/types';

export const sortList = <T>(
  list: T[],
  key: keyof T,
  direction: SortDirection,
) => {
  if (direction === 'none') return list;

  return list.toSorted((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    const multiplier = direction === 'asc' ? 1 : -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * multiplier;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * multiplier;
    }
    return 0;
  });
};
