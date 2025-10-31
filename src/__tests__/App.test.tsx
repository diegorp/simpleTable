import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from '@/App';

beforeEach(() => {
  HTMLElement.prototype.hidePopover = vi.fn();
  HTMLElement.prototype.showPopover = vi.fn();
});

describe('<App />', () => {
  it('should match snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it('should render the table component', () => {
    const { getByRole } = render(<App />);

    const table = getByRole('table');
    expect(table).toBeInTheDocument();
  });
});
