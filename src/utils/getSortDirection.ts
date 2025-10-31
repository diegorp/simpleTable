import type { SortDirection } from '@/types';

export const getSortDirection = (currentDirection: SortDirection) => {
  if (currentDirection === 'asc') return 'desc';
  if (currentDirection === 'desc') return 'none';
  return 'asc';
};
