import { renderHook, act } from '@testing-library/react';
import { useTablePagination } from '@/components/Table/hooks/useTablePagination';

describe('useTablePagination', () => {
  it('should initialize with page 0 and default page size', () => {
    const { result } = renderHook(() => useTablePagination());

    expect(result.current.currentPage).toBe(0);
    expect(result.current.currentPageSize).toBe(5);
  });

  it('should change page', () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.changePage(2);
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should call onPageChange callback when page changes', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() => useTablePagination(onPageChange));

    act(() => {
      result.current.changePage(1);
    });

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should change page size', () => {
    const { result } = renderHook(() => useTablePagination());

    act(() => {
      result.current.changePageSize(25);
    });

    expect(result.current.currentPageSize).toBe(25);
  });

  it('should call onPageSizeChange callback when page size changes', () => {
    const onPageSizeChange = vi.fn();
    const { result } = renderHook(() =>
      useTablePagination(undefined, onPageSizeChange)
    );

    act(() => {
      result.current.changePageSize(50);
    });

    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it('should not change page size if same value', () => {
    const onPageSizeChange = vi.fn();
    const { result } = renderHook(() =>
      useTablePagination(undefined, onPageSizeChange)
    );

    act(() => {
      result.current.changePageSize(5);
    });

    expect(onPageSizeChange).not.toHaveBeenCalled();
    expect(result.current.currentPageSize).toBe(5);
  });

  it('should not throw error when callbacks are undefined', () => {
    const { result } = renderHook(() =>
      useTablePagination(undefined, undefined)
    );

    expect(() => {
      act(() => {
        result.current.changePage(1);
        result.current.changePageSize(25);
      });
    }).not.toThrow();
  });

  it('should handle multiple page changes', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() => useTablePagination(onPageChange));

    act(() => {
      result.current.changePage(1);
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.changePage(2);
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.changePage(0);
    });

    expect(result.current.currentPage).toBe(0);
    expect(onPageChange).toHaveBeenCalledTimes(3);
  });
});
