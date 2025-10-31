import { renderHook, act } from '@testing-library/react';
import { useTableFilter } from '@/components/Table/hooks/useTableFilter';
import type { Filter } from '@/types';

describe('useTableFilter', () => {
  it('should initialize with null filter', () => {
    const { result } = renderHook(() => useTableFilter());

    expect(result.current.activeFilter).toBeNull();
  });

  it('should apply filter', () => {
    const { result } = renderHook(() => useTableFilter());

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'test' } as Filter<unknown>);
    });

    expect(result.current.activeFilter).toEqual({
      key: 'name',
      value: 'test',
    });
  });

  it('should clear filter when null is passed', () => {
    const { result } = renderHook(() => useTableFilter());

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'test' } as Filter<unknown>);
    });

    act(() => {
      result.current.applyFilter(null);
    });

    expect(result.current.activeFilter).toBeNull();
  });

  it('should call onFilterChange callback when filter is applied', () => {
    const onFilterChange = vi.fn();
    const { result } = renderHook(() => useTableFilter(onFilterChange));

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'test' } as Filter<unknown>);
    });

    expect(onFilterChange).toHaveBeenCalledWith({
      key: 'name',
      value: 'test',
    });
  });

  it('should call onFilterChange callback when filter is cleared', () => {
    const onFilterChange = vi.fn();
    const { result } = renderHook(() => useTableFilter(onFilterChange));

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'test' } as Filter<unknown>);
    });

    act(() => {
      result.current.applyFilter(null);
    });

    expect(onFilterChange).toHaveBeenCalledWith(null);
  });

  it('should not throw error when onFilterChange is undefined', () => {
    const { result } = renderHook(() => useTableFilter(undefined));

    expect(() => {
      act(() => {
        result.current.applyFilter({ key: 'name', value: 'test' } as Filter<unknown>);
      });
    }).not.toThrow();
  });

  it('should update filter value', () => {
    const { result } = renderHook(() => useTableFilter());

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'first' } as Filter<unknown>);
    });

    expect(result.current.activeFilter).toEqual({
      key: 'name',
      value: 'first',
    });

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'second' } as Filter<unknown>);
    });

    expect(result.current.activeFilter).toEqual({
      key: 'name',
      value: 'second',
    });
  });

  it('should change filter key', () => {
    const { result } = renderHook(() => useTableFilter());

    act(() => {
      result.current.applyFilter({ key: 'name', value: 'test' } as Filter<unknown>);
    });

    expect(result.current.activeFilter).toEqual({
      key: 'name',
      value: 'test',
    });

    act(() => {
      result.current.applyFilter({ key: 'age', value: '25' } as Filter<unknown>);
    });

    expect(result.current.activeFilter).toEqual({
      key: 'age',
      value: '25',
    });
  });
});
