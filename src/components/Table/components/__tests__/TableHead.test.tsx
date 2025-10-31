import { render, fireEvent } from '@testing-library/react';
import TableHead from '../TableHead';
import type { Column, Sort } from '@/types';

describe('<TableHead />', () => {
  const mockColumns: Column<{ id: number; name: string; age: number }>[] = [
    { key: 'id', label: 'ID', render: (value) => String(value) },
    { key: 'name', label: 'Name', render: (value) => String(value) },
    { key: 'age', label: 'Age', render: (value) => String(value) },
  ];

  const mockSort: Sort<{ id: number; name: string; age: number }> = {
    key: 'id',
    direction: 'none',
  };

  it('should match snapshot', () => {
    const { container } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={false}
          currentSort={mockSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );
    expect(container).toMatchSnapshot();
  });

  it('should render all column headers', () => {
    const { getByText } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={false}
          currentSort={mockSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    expect(getByText('ID')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Age')).toBeInTheDocument();
  });

  it('should render sortable headers when sort is enabled', () => {
    const { getAllByRole } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={true}
          currentSort={mockSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('should not render sortable headers when sort is disabled', () => {
    const { queryAllByRole } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={false}
          currentSort={mockSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    const buttons = queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should call onToggleSort when header is clicked', () => {
    const onToggleSort = vi.fn();
    const { getByRole } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={true}
          currentSort={mockSort}
          onToggleSort={onToggleSort}
        />
      </table>
    );

    const nameButton = getByRole('button', { name: 'Sort by Name' });
    fireEvent.click(nameButton);

    expect(onToggleSort).toHaveBeenCalledWith('name');
  });

  it('should display ascending sort indicator', () => {
    const ascSort: Sort<{ id: number; name: string; age: number }> = {
      key: 'name',
      direction: 'asc',
    };

    const { getByText } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={true}
          currentSort={ascSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    expect(getByText('↑')).toBeInTheDocument();
  });

  it('should display descending sort indicator', () => {
    const descSort: Sort<{ id: number; name: string; age: number }> = {
      key: 'name',
      direction: 'desc',
    };

    const { getByText } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={true}
          currentSort={descSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    expect(getByText('↓')).toBeInTheDocument();
  });

  it('should not display sort indicator for none direction', () => {
    const noneSort: Sort<{ id: number; name: string; age: number }> = {
      key: 'name',
      direction: 'none',
    };

    const { queryByText } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={true}
          currentSort={noneSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    expect(queryByText('↑')).not.toBeInTheDocument();
    expect(queryByText('↓')).not.toBeInTheDocument();
  });

  it('should only show sort indicator on sorted column', () => {
    const sortedByName: Sort<{ id: number; name: string; age: number }> = {
      key: 'name',
      direction: 'asc',
    };

    const { getAllByText } = render(
      <table>
        <TableHead
          columns={mockColumns}
          sort={true}
          currentSort={sortedByName}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    const indicators = getAllByText('↑');
    expect(indicators).toHaveLength(1);
  });

  it('should handle empty columns array', () => {
    const { queryAllByRole } = render(
      <table>
        <TableHead
          columns={[]}
          sort={false}
          currentSort={mockSort}
          onToggleSort={vi.fn()}
        />
      </table>
    );

    const headers = queryAllByRole('columnheader');
    expect(headers).toHaveLength(0);
  });
});
