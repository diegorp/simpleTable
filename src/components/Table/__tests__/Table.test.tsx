import { render, fireEvent } from '@testing-library/react';
import Table from '@/components/Table';

beforeEach(() => {
  HTMLElement.prototype.hidePopover = vi.fn();
  HTMLElement.prototype.showPopover = vi.fn();
});

describe('<Table />', () => {
  const mockData = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  const defaultProps = {
    data: mockData,
    rowIdKey: 'id' as const,
  };

  describe('Rendering', () => {
    it('should match snapshot', () => {
      const { container } = render(<Table {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should render table with data', () => {
      const { getByText } = render(<Table {...defaultProps} />);

      expect(getByText('Alice')).toBeInTheDocument();
      expect(getByText('Bob')).toBeInTheDocument();
      expect(getByText('Charlie')).toBeInTheDocument();
    });

    it('should display empty state when no data provided', () => {
      const { getByText } = render(<Table data={[]} rowIdKey="id" />);

      expect(getByText('No data to display.')).toBeInTheDocument();
    });

    it('should handle data updates through rerender', () => {
      const { rerender, getByText, queryByText } = render(
        <Table {...defaultProps} />
      );

      expect(getByText('Alice')).toBeInTheDocument();

      const newData = [
        { id: 4, name: 'David', age: 40 },
        { id: 5, name: 'Eve', age: 45 },
      ];

      rerender(<Table data={newData} rowIdKey='id' />);

      expect(queryByText('Alice')).not.toBeInTheDocument();
      expect(getByText('David')).toBeInTheDocument();
      expect(getByText('Eve')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      const { getByText } = render(<Table {...defaultProps} title="Test Table" />);

      expect(getByText('Test Table')).toBeInTheDocument();
    });

    it('should not render header when no title and no filter', () => {
      const { container } = render(<Table {...defaultProps} />);

      const header = container.querySelector('header');
      expect(header).not.toBeInTheDocument();
    });

    it('should render header when title is provided', () => {
      const { container } = render(<Table {...defaultProps} title="Test" />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render header when filter is enabled', () => {
      const { container } = render(<Table {...defaultProps} filter={true} />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Column Configuration', () => {
    it('should hide row ID column when hideRowId is true', () => {
      const { queryByText } = render(<Table {...defaultProps} hideRowId={true} />);

      expect(queryByText('id')).not.toBeInTheDocument();
    });

    it('should show row ID column when hideRowId is false', () => {
      const { getByText } = render(<Table {...defaultProps} hideRowId={false} />);

      expect(getByText('id')).toBeInTheDocument();
    });
  });

  describe('Pagination Integration', () => {
    it('should render Pagination component when pagination is enabled', () => {
      const { getByText } = render(<Table {...defaultProps} pagination={true} />);

      expect(getByText('Rows per page:')).toBeInTheDocument();
    });

    it('should not render Pagination component when pagination is disabled', () => {
      const { queryByText } = render(<Table {...defaultProps} pagination={false} />);

      expect(queryByText('Rows per page:')).not.toBeInTheDocument();
    });
  });

  describe('Sort Integration', () => {
    it('should render sortable TableHead when sort is enabled', () => {
      const { getByRole } = render(
        <Table {...defaultProps} sort={true} hideRowId={true} />
      );

      const nameHeader = getByRole('button', { name: 'Sort by name' });
      expect(nameHeader).toBeInTheDocument();
    });

    it('should render non-sortable TableHead when sort is disabled', () => {
      const { queryByRole } = render(
        <Table {...defaultProps} sort={false} hideRowId={true} />
      );

      const nameHeader = queryByRole('button', { name: 'Sort by name' });
      expect(nameHeader).not.toBeInTheDocument();
    });
  });

  describe('Filter Integration', () => {
    it('should render TableFilter component when filter is enabled', () => {
      const { getByRole } = render(<Table {...defaultProps} filter={true} />);

      expect(getByRole('button', { name: 'Filter' })).toBeInTheDocument();
    });

    it('should not render TableFilter component when filter is disabled', () => {
      const { queryByRole } = render(<Table {...defaultProps} filter={false} />);

      expect(queryByRole('button', { name: 'Filter' })).not.toBeInTheDocument();
    });
  });

  describe('Callback Integration', () => {
    it('should call onPageChange callback when pagination changes', () => {
      const onPageChange = vi.fn();
      const paginatedData = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 35 },
        { id: 4, name: 'David', age: 40 },
        { id: 5, name: 'Eve', age: 45 },
        { id: 6, name: 'Frank', age: 50 },
      ];
      const { getByRole } = render(
        <Table data={paginatedData} rowIdKey="id" pagination={true} onPageChange={onPageChange} />
      );

      const nextButton = getByRole('button', { name: 'Next page' });
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageSizeChange callback when page size changes', () => {
      const onPageSizeChange = vi.fn();
      const { getByRole } = render(
        <Table
          {...defaultProps}
          pagination={true}
          onPageSizeChange={onPageSizeChange}
        />
      );

      const select = getByRole('combobox', {
        name: 'Rows per page',
      });
      fireEvent.change(select, { target: { value: '25' } });

      expect(onPageSizeChange).toHaveBeenCalledWith(25);
    });

    it('should call onSortChange callback when sort changes', () => {
      const onSortChange = vi.fn();
      const { getByRole } = render(
        <Table
          {...defaultProps}
          sort={true}
          hideRowId={true}
          onSortChange={onSortChange}
        />
      );

      const nameHeader = getByRole('button', { name: 'Sort by name' });
      fireEvent.click(nameHeader);

      expect(onSortChange).toHaveBeenCalledWith({
        key: 'name',
        direction: 'asc',
      });
    });

    it('should call onFilterChange callback when filter is applied', () => {
      const onFilterChange = vi.fn();
      const { getByRole, getByPlaceholderText, getByLabelText, getByText } =
        render(
          <Table
            {...defaultProps}
            filter={true}
            onFilterChange={onFilterChange}
          />
        );

      const filterButton = getByRole('button', { name: 'Filter' });
      fireEvent.click(filterButton);

      const select = getByLabelText('Select a category for filtering');
      fireEvent.change(select, { target: { value: 'name' } });

      const input = getByPlaceholderText('Filter value...');
      fireEvent.change(input, { target: { value: 'Alice' } });

      const applyButton = getByText('Apply');
      fireEvent.click(applyButton);

      expect(onFilterChange).toHaveBeenCalledWith({
        key: 'name',
        value: 'Alice',
      });
    });
  });
});
