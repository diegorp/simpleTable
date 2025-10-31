import { renderHook } from '@testing-library/react';
import { useTableColumns } from '@/components/Table/hooks/useTableColumns';

describe('useTableColumns', () => {
  const testData = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
  ];

  it('should generate columns from data', () => {
    const { result } = renderHook(() =>
      useTableColumns(testData, 'id', false)
    );

    expect(result.current).toHaveLength(3);
    expect(result.current[0].key).toBe('id');
    expect(result.current[1].key).toBe('name');
    expect(result.current[2].key).toBe('age');
  });

  it('should hide row ID column when hideRowId is true', () => {
    const { result } = renderHook(() =>
      useTableColumns(testData, 'id', true)
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.find(col => col.key === 'id')).toBeUndefined();
  });

  it('should include row ID column when hideRowId is false', () => {
    const { result } = renderHook(() =>
      useTableColumns(testData, 'id', false)
    );

    expect(result.current).toHaveLength(3);
    expect(result.current.find(col => col.key === 'id')).toBeDefined();
  });

  it('should set label as the key name', () => {
    const { result } = renderHook(() =>
      useTableColumns(testData, 'id', false)
    );

    expect(result.current[0].label).toBe('id');
    expect(result.current[1].label).toBe('name');
    expect(result.current[2].label).toBe('age');
  });

  it('should render values as strings', () => {
    const { result } = renderHook(() =>
      useTableColumns(testData, 'id', false)
    );

    expect(result.current[0].render(123)).toBe('123');
    expect(result.current[1].render('test')).toBe('test');
  });
});
