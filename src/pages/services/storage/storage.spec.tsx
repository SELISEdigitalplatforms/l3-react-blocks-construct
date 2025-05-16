import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Storage } from './storage';

describe('Storage Component', () => {
  test('renders the Storage heading', () => {
    render(<Storage />);

    const headingElement = screen.getByText('STORAGE');
    expect(headingElement).toBeInTheDocument();

    expect(headingElement).toHaveClass('text-2xl');
    expect(headingElement).toHaveClass('font-bold');
    expect(headingElement).toHaveClass('tracking-tight');
  });

  test('renders with the correct structure', () => {
    const { container } = render(<Storage />);

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('w-full');
    expect(mainDiv).toHaveClass('flex-col');

    if (!mainDiv) {
      throw new Error('Main div not found');
    }
    const innerDiv = mainDiv.firstChild;
    expect(innerDiv).toHaveClass('mb-[18px]');
    expect(innerDiv).toHaveClass('flex');
    expect(innerDiv).toHaveClass('items-center');
    expect(innerDiv).toHaveClass('text-base');
    expect(innerDiv).toHaveClass('text-high-emphasis');
    expect(innerDiv).toHaveClass('md:mb-[24px]');
  });
});
