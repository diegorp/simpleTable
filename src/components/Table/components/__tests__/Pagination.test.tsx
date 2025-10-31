import { render, fireEvent } from '@testing-library/react';
import Pagination from '@/components/Table/components/Pagination';
import { PAGE_SIZES } from '@/constants';

describe('<Pagination />', () => {
  const defaultProps = {
    currentPage: 0,
    currentPageSize: 10,
    totalItems: 50,
    isLastPage: false,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it('should match snapshot', () => {
    const { container } = render(<Pagination {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should display current page range', () => {
    const { getByText } = render(<Pagination {...defaultProps} />);

    expect(getByText(/1 - 10 of 50/)).toBeInTheDocument();
  });

  it('should display correct range for second page', () => {
    const { getByText } = render(
      <Pagination {...defaultProps} currentPage={1} />
    );

    expect(getByText(/11 - 20 of 50/)).toBeInTheDocument();
  });

  it('should display correct range for last page', () => {
    const { getByText } = render(
      <Pagination
        {...defaultProps}
        currentPage={4}
        totalItems={45}
        isLastPage={true}
      />
    );

    expect(getByText(/41 - 45 of 45/)).toBeInTheDocument();
  });

  it('should calculate correct range with different page size', () => {
    const { getByText } = render(
      <Pagination {...defaultProps} currentPage={1} currentPageSize={25} />
    );

    expect(getByText('26 - 50 of 50')).toBeInTheDocument();
  });

  it('should render page size selector', () => {
    const { getByText, getByRole } = render(<Pagination {...defaultProps} />);

    expect(getByText('Rows per page:')).toBeInTheDocument();
    expect(
      getByRole('combobox', { name: 'Rows per page' })
    ).toBeInTheDocument();
  });

  it('should render previous and next buttons', () => {
    const { getAllByRole } = render(<Pagination {...defaultProps} />);

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('‹');
    expect(buttons[1]).toHaveTextContent('›');
  });

  it('should disable previous button on first page', () => {
    const { getByRole } = render(
      <Pagination {...defaultProps} currentPage={0} />
    );

    const prevButton = getByRole('button', { name: 'Previous page' });
    expect(prevButton).toBeDisabled();
  });

  it('should enable previous button when not on first page', () => {
    const { getByRole } = render(
      <Pagination {...defaultProps} currentPage={1} />
    );

    const prevButton = getByRole('button', { name: 'Previous page' });
    expect(prevButton).not.toBeDisabled();
  });

  it('should disable next button on last page', () => {
    const { getByRole } = render(
      <Pagination {...defaultProps} isLastPage={true} />
    );

    const nextButton = getByRole('button', { name: 'Next page' });
    expect(nextButton).toBeDisabled();
  });

  it('should enable next button when not on last page', () => {
    const { getByRole } = render(
      <Pagination {...defaultProps} isLastPage={false} />
    );

    const nextButton = getByRole('button', { name: 'Next page' });
    expect(nextButton).not.toBeDisabled();
  });

  it('should call onPageChange when previous button is clicked', () => {
    const onPageChange = vi.fn();
    const { getByRole } = render(
      <Pagination
        {...defaultProps}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );

    const prevButton = getByRole('button', { name: 'Previous page' });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('should call onPageChange when next button is clicked', () => {
    const onPageChange = vi.fn();
    const { getByRole } = render(
      <Pagination {...defaultProps} onPageChange={onPageChange} />
    );

    const nextButton = getByRole('button', { name: 'Next page' });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageSizeChange when page size is changed', () => {
    const onPageSizeChange = vi.fn();
    const { getByRole } = render(
      <Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />
    );

    const select = getByRole('combobox', { name: 'Rows per page' });
    fireEvent.change(select, { target: { value: '25' } });

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('should display available page size options', () => {
    const { getByRole } = render(<Pagination {...defaultProps} />);

    const select = getByRole('combobox', { name: 'Rows per page' });
    const options = select.querySelectorAll('option');

    expect(options.length).toEqual(PAGE_SIZES.length);
  });

  it('should handle single page scenario', () => {
    const { getByText, getByRole } = render(
      <Pagination
        currentPage={0}
        currentPageSize={50}
        totalItems={10}
        isLastPage={true}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(getByText(/1 - 10 of 10/)).toBeInTheDocument();
    expect(getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('should handle empty data', () => {
    const { getByText } = render(
      <Pagination
        currentPage={0}
        currentPageSize={10}
        totalItems={0}
        isLastPage={true}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(getByText(/1 - 0 of 0/)).toBeInTheDocument();
  });
});
