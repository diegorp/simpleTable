import { useState } from 'react';
import { PAGE_SIZES } from '@/constants';

export const useTablePagination = (
  onPageChange?: (page: number) => void,
  onPageSizeChange?: (pageSize: number) => void
) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(PAGE_SIZES.at(0)!);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const changePageSize = (newPageSize: number) => {
    if (newPageSize === currentPageSize) return;

    setCurrentPageSize(newPageSize);
    changePage(0);
    onPageSizeChange?.(newPageSize);
  };

  return {
    currentPage,
    currentPageSize,
    changePage,
    changePageSize,
  };
};
