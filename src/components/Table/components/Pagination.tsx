import { PAGE_SIZES } from '@/constants';

interface Props {
  currentPage: number;
  currentPageSize: number;
  totalItems: number;
  isLastPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  currentPage,
  currentPageSize,
  totalItems,
  isLastPage,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <nav
      className='flex shrink-0 gap-12 w-full text-sm text-gray-500 items-center justify-start'
      aria-label='Table pagination'
    >
      <div className='flex items-center gap-2'>
        <span>Rows per page: </span>
        <select
          onChange={({ currentTarget }) =>
            onPageSizeChange(Number(currentTarget?.value ?? currentPageSize))
          }
          aria-label='Rows per page'
          aria-valuenow={currentPageSize}
        >
          {PAGE_SIZES.map(pageSizeOption => (
            <option key={pageSizeOption} value={pageSizeOption}>
              {pageSizeOption}
            </option>
          ))}
        </select>
      </div>
      <div className='flex items-center gap-2'>
        <span role='status'>
          {currentPage * currentPageSize + 1} -{' '}
          {Math.min((currentPage + 1) * currentPageSize, totalItems)} of{' '}
          {totalItems}
        </span>
        <button
          className='text-xl cursor-pointer mr-2 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label='Previous page'
        >
          ‹
        </button>
        <button
          className='text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label='Next page'
        >
          ›
        </button>
      </div>
    </nav>
  );
}
