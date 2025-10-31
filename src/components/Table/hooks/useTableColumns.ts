import { useEffect, useState } from 'react';
import type { Column } from '@/types';

export const useTableColumns = <T>(
  data: T[],
  rowIdKey: keyof T,
  hideRowId: boolean
) => {
  const [columns, setColumns] = useState<Column<T>[]>([]);

  useEffect(() => {
    const mappedColumns: Column<T>[] = Object.keys(data[0] || {}).map(item => ({
      key: item as keyof T,
      label: item,
      render: (value: T[keyof T]) => String(value),
    }));
    setColumns(hideRowId ? mappedColumns.filter(column => column.key !== rowIdKey) : mappedColumns);
  }, [data, hideRowId, rowIdKey]);

  return columns;
};
