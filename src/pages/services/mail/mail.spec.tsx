import React from 'react';
import { render, screen } from '@testing-library/react';
import { Mail } from './mail';

describe('Mail Component', () => {
  test('renders the Mail heading', () => {
    render(<Mail />);

    const headingElement = screen.getByText('MAIL');
    expect(headingElement).toBeInTheDocument();

    expect(headingElement).toHaveClass('text-2xl');
    expect(headingElement).toHaveClass('font-bold');
    expect(headingElement).toHaveClass('tracking-tight');
  });

  test('renders with the correct structure', () => {
    const { container } = render(<Mail />);

    const mainDiv = container.querySelector('div.flex.w-full.flex-col');
    expect(mainDiv).toBeInTheDocument();

    const headerDiv = container.querySelector(
      'div.mb-\\[18px\\].flex.items-center.text-base.text-high-emphasis.md\\:mb-\\[24px\\]'
    );
    expect(headerDiv).toBeInTheDocument();
  });
});
