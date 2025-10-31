import { renderHook } from '@testing-library/react';
import { useTableData } from '@/components/Table/hooks/useTableData';

describe('useTableData', () => {
  const testData = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
    { id: 4, name: 'David', age: 40 },
    { id: 5, name: 'Eve', age: 45 },
  ];

  it('should return all data when no pagination', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        10,
        { key: 'id', direction: 'none' },
        null
      )
    );

    expect(result.current.rows).toHaveLength(5);
    expect(result.current.isLastPage).toBe(true);
  });

  it('should paginate data correctly', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        2,
        { key: 'id', direction: 'none' },
        null
      )
    );

    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].id).toBe(1);
    expect(result.current.rows[1].id).toBe(2);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should return second page of data', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        1,
        2,
        { key: 'id', direction: 'none' },
        null
      )
    );

    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].id).toBe(3);
    expect(result.current.rows[1].id).toBe(4);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should handle last page correctly', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        2,
        2,
        { key: 'id', direction: 'none' },
        null
      )
    );

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].id).toBe(5);
    expect(result.current.isLastPage).toBe(true);
  });

  it('should sort data in ascending order', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        10,
        { key: 'age', direction: 'asc' },
        null
      )
    );

    expect(result.current.rows[0].age).toBe(25);
    expect(result.current.rows[4].age).toBe(45);
  });

  it('should sort data in descending order', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        10,
        { key: 'age', direction: 'desc' },
        null
      )
    );

    expect(result.current.rows[0].age).toBe(45);
    expect(result.current.rows[4].age).toBe(25);
  });

  it('should filter data by value', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        10,
        { key: 'id', direction: 'none' },
        { key: 'name', value: 'li' }
      )
    );

    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].name).toBe('Alice');
    expect(result.current.rows[1].name).toBe('Charlie');
  });

  it('should filter case-insensitively', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        10,
        { key: 'id', direction: 'none' },
        { key: 'name', value: 'ALICE' }
      )
    );

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].name).toBe('Alice');
  });

  it('should return empty array when filter matches nothing', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        10,
        { key: 'id', direction: 'none' },
        { key: 'name', value: 'xyz' }
      )
    );

    expect(result.current.rows).toHaveLength(0);
    expect(result.current.isLastPage).toBe(true);
  });

  it('should combine filter, sort, and pagination', () => {
    const { result } = renderHook(() =>
      useTableData(
        testData,
        0,
        2,
        { key: 'age', direction: 'desc' },
        { key: 'name', value: 'e' }
      )
    );

    // Filter by 'e' gets: Alice (25), Charlie (35), Eve (45)
    // Sort by age desc: Eve (45), Charlie (35), Alice (25)
    // Paginate first 2: Eve (45), Charlie (35)
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].name).toBe('Eve');
    expect(result.current.rows[1].name).toBe('Charlie');
  });

  it('should handle empty data array', () => {
    const { result } = renderHook(() =>
      useTableData(
        [],
        0,
        10,
        { key: 'id', direction: 'none' },
        null
      )
    );

    expect(result.current.rows).toEqual([]);
    expect(result.current.isLastPage).toBe(true);
  });

  it('should update when data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) =>
        useTableData(
          data,
          0,
          10,
          { key: 'id', direction: 'none' },
          null
        ),
      { initialProps: { data: testData } }
    );

    expect(result.current.rows).toHaveLength(5);

    const newData = [{ id: 1, name: 'Alice', age: 25 }];
    rerender({ data: newData });

    expect(result.current.rows).toHaveLength(1);
  });
});
