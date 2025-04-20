import { render, screen } from '@testing-library/react';
import { Help } from './help';

describe('Help Component', () => {
  test('renders the help heading', () => {
    render(<Help />);

    const headingElement = screen.getByText('Help');
    expect(headingElement).toBeInTheDocument();

    expect(headingElement).toHaveClass('text-2xl');
    expect(headingElement).toHaveClass('font-bold');
    expect(headingElement).toHaveClass('tracking-tight');
  });

  test('renders with correct container structure', () => {
    const { container } = render(<Help />);

    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('flex');
    expect(outerDiv).toHaveClass('w-full');
    expect(outerDiv).toHaveClass('flex-col');
  });
});
