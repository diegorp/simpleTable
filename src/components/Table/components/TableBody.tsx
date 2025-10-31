import type { Column } from '@/types';

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  rowIdKey: keyof T;
}

export default function TableBody<T>({ rows, columns, rowIdKey }: Props<T>) {
  return (
    <tbody className='bg-white'>
      {rows.length === 0 ? (
        <tr className='border-b last:border-b-0 border-[#E2E8F0]'>
          <td colSpan={columns.length} className='px-6 py-4 text-center'>
            No data to display.
          </td>
        </tr>
      ) : (
        rows.map(row => (
          <tr
            key={row[rowIdKey] as string}
            className='border-b last:border-b-0 border-[#E2E8F0] hover:bg-gray-50 transition-colors duration-200 ease-in-out'
          >
            {columns.map(column => (
              <td
                key={column.key as string}
                className='px-6 py-4 whitespace-nowrap border-r last:border-r-0 border-[#E2E8F0]'
              >
                {column.render(row[column.key])}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}
