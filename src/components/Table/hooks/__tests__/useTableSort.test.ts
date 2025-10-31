import { renderHook, act } from '@testing-library/react';
import { useTableSort } from '@/components/Table/hooks/useTableSort';

type TestData = {
  id: number;
  name: string;
  age: number;
};

describe('useTableSort', () => {
  it('should initialize with none direction', () => {
    const { result } = renderHook(() => useTableSort<TestData>('id'));

    expect(result.current.currentSort).toEqual({
      key: 'id',
      direction: 'none',
    });
  });

  it('should toggle sort to ascending on first click', () => {
    const { result } = renderHook(() => useTableSort<TestData>('id'));

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'asc',
    });
  });

  it('should toggle sort to descending on second click', () => {
    const { result } = renderHook(() => useTableSort<TestData>('id'));

    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'desc',
    });
  });

  it('should toggle sort to none on third click', () => {
    const { result } = renderHook(() => useTableSort<TestData>('id'));

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'asc',
    });

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'desc',
    });

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'none',
    });
  });

  it('should reset to ascending when clicking different column', () => {
    const { result } = renderHook(() => useTableSort<TestData>('id'));

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'asc',
    });

    act(() => {
      result.current.toggleSort('age');
    });

    expect(result.current.currentSort).toEqual({
      key: 'age',
      direction: 'asc',
    });
  });

  it('should call onSortChange callback when provided', () => {
    const onSortChange = vi.fn();
    const { result } = renderHook(() => useTableSort<TestData>('id', onSortChange));

    act(() => {
      result.current.toggleSort('name');
    });

    expect(onSortChange).toHaveBeenCalledWith({
      key: 'name',
      direction: 'asc',
    });
  });

  it('should not throw error when onSortChange is undefined', () => {
    const { result } = renderHook(() => useTableSort<TestData>('id', undefined));

    expect(() => {
      act(() => {
        result.current.toggleSort('name');
      });
    }).not.toThrow();
  });
});
