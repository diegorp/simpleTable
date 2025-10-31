import type { Sort, Filter } from '@/types';
import TableFilter from './components/TableFilter';
import TableHead from './components/TableHead';
import TableBody from './components/TableBody';
import Pagination from './components/Pagination';
import {
  useTableColumns,
  useTableData,
  useTableSort,
  useTableFilter,
  useTablePagination,
} from './hooks';

interface Props<T> {
  title?: string;
  data: T[];
  rowIdKey: keyof T;
  hideRowId?: boolean;
  pagination?: boolean;
  sort?: boolean;
  filter?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sort: Sort<T>) => void;
  onFilterChange?: (filter: Filter<T>) => void;
}

export default function Table<T>({
  title,
  data,
  rowIdKey,
  hideRowId = false,
  pagination,
  sort,
  filter,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
}: Props<T>) {
  const columns = useTableColumns(data, rowIdKey, hideRowId);
  const { currentSort, toggleSort } = useTableSort(rowIdKey, onSortChange);
  const { activeFilter, applyFilter } = useTableFilter(onFilterChange);
  const { currentPage, currentPageSize, changePage, changePageSize } =
    useTablePagination(onPageChange, onPageSizeChange);
  const { rows, isLastPage, totalItems } = useTableData(
    data,
    currentPage,
    currentPageSize,
    currentSort,
    activeFilter
  );

  const updateFilter = (filter: Filter<T>) => {
    applyFilter(filter);
    changePage(0);
  };

  const shouldShowHeader = title || filter;

  return (
    <article className='flex flex-col gap-4 overflow-hidden'>
      {shouldShowHeader && (
        <header className='flex items-center justify-between'>
          {title && <h2 className='text-[15px]'>{title}</h2>}
          {filter && (
            <TableFilter
              initialFilter={activeFilter}
              filterCategories={columns}
              onFilterChange={updateFilter}
            />
          )}
        </header>
      )}
      <div className='flex-1 overflow-auto border border-[#E2E8F0]'>
        <table className='min-w-full table-fixed overflow-auto text-gray-800'>
          <TableHead
            columns={columns}
            sort={sort}
            currentSort={currentSort}
            onToggleSort={toggleSort}
          />
          <TableBody rows={rows} columns={columns} rowIdKey={rowIdKey} />
        </table>
      </div>
      {pagination && (
        <Pagination
          currentPage={currentPage}
          currentPageSize={currentPageSize}
          totalItems={totalItems}
          isLastPage={isLastPage}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />
      )}
    </article>
  );
}
