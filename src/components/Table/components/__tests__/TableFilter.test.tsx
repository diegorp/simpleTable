import { render, fireEvent } from '@testing-library/react';
import TableFilter from '@/components/Table/components/TableFilter';
import type { Column, Filter } from '@/types';

beforeEach(() => {
  HTMLElement.prototype.hidePopover = vi.fn();
  HTMLElement.prototype.showPopover = vi.fn();
});

describe('<TableFilter />', () => {
  const mockColumns: Column<{ id: number; name: string; age: number }>[] = [
    { key: 'id', label: 'ID', render: (value) => String(value) },
    { key: 'name', label: 'Name', render: (value) => String(value) },
    { key: 'age', label: 'Age', render: (value) => String(value) },
  ];

  const defaultProps = {
    initialFilter: null,
    filterCategories: mockColumns,
    onFilterChange: vi.fn(),
  };

  it('should match snapshot', () => {
    const { container } = render(<TableFilter {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render filter button', () => {
    const { getByRole } = render(<TableFilter {...defaultProps} />);

    expect(getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  it('should display "Filter" text when no filter is active', () => {
    const { getByText } = render(<TableFilter {...defaultProps} />);

    expect(getByText('Filter')).toBeInTheDocument();
  });

  it('should display filter category when filter is active', () => {
    const activeFilter = {
      key: 'name',
      value: 'test',
    } satisfies Filter<{ id: number; name: string; age: number }>;

    const { getByText } = render(<TableFilter {...defaultProps} initialFilter={activeFilter} />);

    expect(getByText('Filter by Name')).toBeInTheDocument();
  });

  it('should render category dropdown', () => {
    const { getByRole, getByLabelText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering');
    expect(select).toBeInTheDocument();
  });

  it('should render all filter categories in dropdown', () => {
    const { getByRole, getByLabelText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering');
    const options = select.querySelectorAll('option');

    // +1 for "Select a category" option
    expect(options.length).toBe(mockColumns.length + 1);
  });

  it('should render filter input field', () => {
    const { getByRole, getByPlaceholderText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const input = getByPlaceholderText('Filter value...');
    expect(input).toBeInTheDocument();
  });

  it('should render Apply button', () => {
    const { getByRole, getByText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    expect(getByText('Apply')).toBeInTheDocument();
  });

  it('should render Clear button', () => {
    const { getByRole, getByText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    expect(getByText('Clear')).toBeInTheDocument();
  });

  it('should disable Apply button when no category selected', () => {
    const { getByRole, getByText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const applyButton = getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('should disable Apply button when no value entered', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <TableFilter {...defaultProps} />
    );

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering');
    fireEvent.change(select, { target: { value: 'name' } });

    const applyButton = getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('should enable Apply button when both category and value are set', () => {
    const { getByRole, getByPlaceholderText, getByLabelText, getByText } =
      render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering');
    fireEvent.change(select, { target: { value: 'name' } });

    const input = getByPlaceholderText('Filter value...');
    fireEvent.change(input, { target: { value: 'test' } });

    const applyButton = getByText('Apply');
    expect(applyButton).not.toBeDisabled();
  });

  it('should call onFilterChange with correct values when Apply is clicked', () => {
    const onFilterChange = vi.fn();
    const { getByRole, getByPlaceholderText, getByLabelText, getByText } = render(
      <TableFilter {...defaultProps} onFilterChange={onFilterChange} />
    );

    openPopover(getByRole);

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

  it('should call onFilterChange with null when Clear is clicked', () => {
    const onFilterChange = vi.fn();
    const { getByRole, getByText } = render(<TableFilter {...defaultProps} onFilterChange={onFilterChange} />);

    openPopover(getByRole);

    const clearButton = getByText('Clear');
    fireEvent.click(clearButton);

    expect(onFilterChange).toHaveBeenCalledWith(null);
  });

  it('should populate fields with initial filter values', () => {
    const activeFilter: Filter<{ id: number; name: string; age: number }> = {
      key: 'name',
      value: 'Alice',
    };

    const { getByRole, getByLabelText, getByPlaceholderText } = render(<TableFilter {...defaultProps} initialFilter={activeFilter} />);

    openPopover(getByRole, 'Filter by Name');

    const select = getByLabelText('Select a category for filtering') as HTMLSelectElement;
    expect(select.value).toBe('name');

    const input = getByPlaceholderText('Filter value...') as HTMLInputElement;
    expect(input.value).toBe('Alice');
  });

  it('should apply filter on Enter key press', () => {
    const onFilterChange = vi.fn();
    const { getByRole, getByPlaceholderText, getByLabelText } = render(<TableFilter {...defaultProps} onFilterChange={onFilterChange} />);

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering');
    fireEvent.change(select, { target: { value: 'name' } });

    const input = getByPlaceholderText('Filter value...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onFilterChange).toHaveBeenCalledWith({
      key: 'name',
      value: 'test',
    });
  });

  it('should not apply filter on Enter when Apply is disabled', () => {
    const onFilterChange = vi.fn();
    const { getByRole, getByPlaceholderText } = render(<TableFilter {...defaultProps} onFilterChange={onFilterChange} />);

    openPopover(getByRole);

    const input = getByPlaceholderText('Filter value...');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('should not apply filter on other key press', () => {
    const onFilterChange = vi.fn();
    const { getByRole, getByLabelText, getByPlaceholderText } = render(
      <TableFilter {...defaultProps} onFilterChange={onFilterChange} />
    );

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering');
    fireEvent.change(select, { target: { value: 'name' } });

    const input = getByPlaceholderText('Filter value...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('should update selected category on change', () => {
    const { getByRole, getByLabelText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const select = getByLabelText('Select a category for filtering') as HTMLSelectElement;
    expect(select.value).toBe('');

    fireEvent.change(select, { target: { value: 'age' } });
    expect(select.value).toBe('age');
  });

  it('should update filter value on change', () => {
    const { getByRole, getByPlaceholderText } = render(<TableFilter {...defaultProps} />);

    openPopover(getByRole);

    const input = getByPlaceholderText('Filter value...') as HTMLInputElement;
    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input.value).toBe('new value');
  });

  function openPopover(getByRole: ReturnType<typeof render>['getByRole'], buttonName = 'Filter') {
    const filterButton = getByRole('button', { name: buttonName });
    fireEvent.click(filterButton);
  }
});
