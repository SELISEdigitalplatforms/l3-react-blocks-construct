import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardSystemOverview } from './dashboard-system-overview';

jest.mock('components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardDescription: () => <div data-testid="card-description" />,
}));

jest.mock('components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-item">{children}</div>
  ),
}));

jest.mock('../circular-progress/circular-progress', () => ({
  CircularProgress: ({ percentage, strokeColor }: { percentage: number; strokeColor: string }) => (
    <div
      data-testid="circular-progress"
      data-percentage={percentage}
      data-stroke-color={strokeColor}
    />
  ),
}));

jest.mock('../../services/dashboard-service', () => ({
  daysOfWeek: [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ],
  statsData: [
    {
      title: 'CPU Usage',
      value: '50%',
      max: '100',
      percentage: 50,
      strokeColor: 'red',
    },
    {
      title: 'Memory Usage',
      value: '2GB',
      max: '4GB',
      percentage: 50,
      strokeColor: 'blue',
    },
    {
      title: 'Disk Usage',
      value: '80%',
      max: '100',
      percentage: 80,
      strokeColor: 'green',
    },
  ],
}));

describe('DashboardSystemOverview Component', () => {
  beforeEach(() => {
    render(<DashboardSystemOverview />);
  });

  test('renders the card title "System usage overview"', () => {
    expect(screen.getByTestId('card-title')).toHaveTextContent('System usage overview');
  });

  test('renders the select with default placeholder "Today"', () => {
    expect(screen.getByTestId('select-value')).toHaveTextContent('Today');
  });

  test('renders all days of the week in the select dropdown', () => {
    const selectItems = screen.getAllByTestId('select-item');
    const dayLabels = selectItems.map((item) => item.textContent);
    expect(dayLabels).toEqual(
      expect.arrayContaining([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ])
    );
  });

  test('renders each stat with its details and CircularProgress', () => {
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();

    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('2GB')).toBeInTheDocument();

    expect(screen.getByText('Disk Usage')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();

    // Handle multiple occurrences of `/100`
    expect(screen.getAllByText('/100').length).toBeGreaterThanOrEqual(1);

    const progressCircles = screen.getAllByTestId('circular-progress');
    expect(progressCircles).toHaveLength(3);

    // Verify attributes of CircularProgress components
    expect(progressCircles[0]).toHaveAttribute('data-percentage', '50');
    expect(progressCircles[0]).toHaveAttribute('data-stroke-color', 'red');

    expect(progressCircles[1]).toHaveAttribute('data-percentage', '50');
    expect(progressCircles[1]).toHaveAttribute('data-stroke-color', 'blue');

    expect(progressCircles[2]).toHaveAttribute('data-percentage', '80');
    expect(progressCircles[2]).toHaveAttribute('data-stroke-color', 'green');
  });
});
