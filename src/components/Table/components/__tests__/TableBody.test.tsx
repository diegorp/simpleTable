import { render } from '@testing-library/react';
import TableBody from '@/components/Table/components/TableBody';
import type { Column } from '@/types';

describe('<TableBody />', () => {
  const mockColumns: Column<{ id: number; name: string; age: number }>[] = [
    { key: 'id', label: 'ID', render: (value) => String(value) },
    { key: 'name', label: 'Name', render: (value) => String(value) },
    { key: 'age', label: 'Age', render: (value) => String(value) },
  ];

  const mockRows = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
  ];

  it('should match snapshot', () => {
    const { container } = render(
      <table>
        <TableBody rows={mockRows} columns={mockColumns} rowIdKey="id" />
      </table>
    );
    expect(container).toMatchSnapshot();
  });

  it('should render all rows', () => {
    const { getByText } = render(
      <table>
        <TableBody rows={mockRows} columns={mockColumns} rowIdKey="id" />
      </table>
    );

    expect(getByText('Alice')).toBeInTheDocument();
    expect(getByText('Bob')).toBeInTheDocument();
  });

  it('should render all columns for each row', () => {
    const { getByText } = render(
      <table>
        <TableBody rows={mockRows} columns={mockColumns} rowIdKey="id" />
      </table>
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('Alice')).toBeInTheDocument();
    expect(getByText('25')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('Bob')).toBeInTheDocument();
    expect(getByText('30')).toBeInTheDocument();
  });

  it('should display "No data to display" when rows are empty', () => {
    const { getByText } = render(
      <table>
        <TableBody rows={[]} columns={mockColumns} rowIdKey="id" />
      </table>
    );

    expect(getByText('No data to display.')).toBeInTheDocument();
  });

  it('should use custom render function for columns', () => {
    const customColumns: Column<{ id: number; name: string; age: number }>[] = [
      { key: 'id', label: 'ID', render: (value) => `ID: ${value}` },
      { key: 'name', label: 'Name', render: (value) => String(value).toUpperCase() },
      { key: 'age', label: 'Age', render: (value) => `${value} years` },
    ];

    const { getByText } = render(
      <table>
        <TableBody rows={mockRows} columns={customColumns} rowIdKey="id" />
      </table>
    );

    expect(getByText('ID: 1')).toBeInTheDocument();
    expect(getByText('ALICE')).toBeInTheDocument();
    expect(getByText('25 years')).toBeInTheDocument();
  });

  it('should render correct number of rows', () => {
    const { container } = render(
      <table>
        <TableBody rows={mockRows} columns={mockColumns} rowIdKey="id" />
      </table>
    );

    const rows = container.querySelectorAll('tbody > tr');
    expect(rows).toHaveLength(2);
  });

  it('should render correct number of cells per row', () => {
    const { container } = render(
      <table>
        <TableBody rows={mockRows} columns={mockColumns} rowIdKey="id" />
      </table>
    );

    const firstRow = container.querySelector('tbody > tr:first-child');
    const cells = firstRow?.querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('should handle single row', () => {
    const { getByText, queryByText } = render(
      <table>
        <TableBody
          rows={[mockRows[0]]}
          columns={mockColumns}
          rowIdKey="id"
        />
      </table>
    );

    expect(getByText('Alice')).toBeInTheDocument();
    expect(queryByText('Bob')).not.toBeInTheDocument();
  });

  it('should span all columns in empty state', () => {
    const { container } = render(
      <table>
        <TableBody rows={[]} columns={mockColumns} rowIdKey="id" />
      </table>
    );

    const emptyCell = container.querySelector('td[colspan="3"]');
    expect(emptyCell).toBeInTheDocument();
  });
});
