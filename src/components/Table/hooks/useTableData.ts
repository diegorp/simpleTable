import { sortList } from '@/utils/sortList';
import type { Sort, Filter } from '@/types';

export const useTableData = <T>(
  initialData: T[],
  currentPage: number,
  currentPageSize: number,
  currentSort: Sort<T>,
  activeFilter: Filter<T>
) => {
  let filteredData = initialData;
  if (activeFilter?.key && activeFilter?.value) {
    filteredData = initialData.filter(item => {
      const itemValue = String(item[activeFilter.key]).toLowerCase();
      const filterValue = activeFilter.value.toLowerCase();
      return itemValue.includes(filterValue);
    });
  }

  const sortedData = sortList(
    filteredData,
    currentSort.key,
    currentSort.direction
  );

  const startIndex = currentPage * currentPageSize;
  const endIndex = Math.min(startIndex + currentPageSize, sortedData.length);
  const rows = sortedData.slice(startIndex, endIndex);

  const isLastPage = rows.length < currentPageSize;

  return {
    rows,
    isLastPage,
    totalItems: sortedData.length,
  };
};
