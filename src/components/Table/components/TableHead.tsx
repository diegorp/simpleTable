import type { Column, Sort } from '@/types';
import { ARIA_SORT_VALUES } from '@/constants';

interface Props<T> {
  columns: Column<T>[];
  sort?: boolean;
  currentSort: Sort<T>;
  onToggleSort: (key: keyof T) => void;
}

export default function TableHead<T>({
  columns,
  sort,
  currentSort,
  onToggleSort,
}: Props<T>) {
  return (
    <thead>
      <tr>
        {columns.map(({ key, label }) => (
          <th
            key={key as string}
            scope='col'
            className='p-0 text-left text-xs font-medium text-gray-500 capitalize tracking-wider sticky top-0 z-10 shadow-[inset_0_-1px_0] shadow-[#E2E8F0] border-r last:border-r-0 border-[#E2E8F0] bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out'
            aria-sort={ARIA_SORT_VALUES[currentSort.direction]}
          >
            {sort ? (
              <button
                onClick={() => onToggleSort(key)}
                className='w-full h-full px-6 py-3 flex items-center gap-2 capitalize cursor-pointer text-left'
                aria-label={`Sort by ${label}`}
              >
                {currentSort.key === key && (
                  <span className='text-gray-500 text-xs'>
                    {currentSort.direction === 'asc'
                      ? '↑'
                      : currentSort.direction === 'desc'
                      ? '↓'
                      : ''}
                  </span>
                )}
                {label}
              </button>
            ) : (
              label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
