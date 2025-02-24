import React from 'react';
import { render, screen } from '@testing-library/react';
import { CircularProgress } from './circular-progress';

describe('CircularProgress', () => {
  test('renders with default props', () => {
    render(<CircularProgress percentage={50} />);

    // Test percentage text is displayed
    expect(screen.getByText('50%')).toBeInTheDocument();

    // Test SVG elements exist
    const circles = document.querySelectorAll('circle');
    expect(circles.length).toBe(2);

    // Background circle
    expect(circles[0]).toHaveAttribute('cx', '50');
    expect(circles[0]).toHaveAttribute('cy', '50');
    expect(circles[0]).toHaveAttribute('r', '45');
    expect(circles[0]).toHaveAttribute('stroke', '#F3F5F9');

    // Progress circle
    expect(circles[1]).toHaveAttribute('cx', '50');
    expect(circles[1]).toHaveAttribute('cy', '50');
    expect(circles[1]).toHaveAttribute('r', '45');
    expect(circles[1]).toHaveAttribute('stroke-linecap', 'round');

    // Test stroke dash properties for 50% progress
    const circumference = 2 * Math.PI * 45;
    const expectedOffset = circumference - (50 / 100) * circumference;
    expect(circles[1]).toHaveAttribute('stroke-dasharray', circumference.toString());
    expect(circles[1]).toHaveAttribute('stroke-dashoffset', expectedOffset.toString());
  });

  test('renders with custom stroke color', () => {
    render(<CircularProgress percentage={75} strokeColor="#FF0000" />);

    // Test percentage text
    expect(screen.getByText('75%')).toBeInTheDocument();

    // Test progress circle has custom color
    const progressCircle = document.querySelectorAll('circle')[1];
    expect(progressCircle).toHaveAttribute('stroke', '#FF0000');

    // Test stroke dash properties for 75% progress
    const circumference = 2 * Math.PI * 45;
    const expectedOffset = circumference - (75 / 100) * circumference;
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset.toString());
  });

  test('renders with 0% progress', () => {
    render(<CircularProgress percentage={0} />);

    expect(screen.getByText('0%')).toBeInTheDocument();

    const progressCircle = document.querySelectorAll('circle')[1];
    const circumference = 2 * Math.PI * 45;
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', circumference.toString());
  });

  test('renders with 100% progress', () => {
    render(<CircularProgress percentage={100} />);

    expect(screen.getByText('100%')).toBeInTheDocument();

    const progressCircle = document.querySelectorAll('circle')[1];
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', '0');
  });
});
