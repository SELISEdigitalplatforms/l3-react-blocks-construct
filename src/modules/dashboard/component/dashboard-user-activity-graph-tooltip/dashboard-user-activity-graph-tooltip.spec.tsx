import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardUserActivityGraphTooltip } from './dashboard-user-activity-graph-tooltip';
import { vi } from 'vitest';
import { Payload, ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardUserActivityGraphTooltip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockPayload = (value: number): Payload<ValueType, NameType>[] => [
    {
      value,
      dataKey: 'noOfActions',
      name: 'noOfActions',
      color: '#8884d8',
      payload: { week: 'Week 1', noOfActions: value },
    } as Payload<ValueType, NameType>,
  ];

  test('renders tooltip with valid data', () => {
    const mockPayload = createMockPayload(150);
    const mockLabel = 'Week 1';

    render(<DashboardUserActivityGraphTooltip payload={mockPayload} label={mockLabel} />);

    // Check if label is rendered
    expect(screen.getByText('Week 1:')).toBeInTheDocument();

    // Check if formatted value and translation key are rendered
    expect(screen.getByText('150 ACTIONS')).toBeInTheDocument();
  });

  test('renders tooltip with large number formatting', () => {
    const mockPayload = createMockPayload(1500);
    const mockLabel = 'Week 2';

    render(<DashboardUserActivityGraphTooltip payload={mockPayload} label={mockLabel} />);

    // Check if label is rendered
    expect(screen.getByText('Week 2:')).toBeInTheDocument();

    // Check if large number is formatted with locale string (e.g., "1,500")
    expect(screen.getByText('1,500 ACTIONS')).toBeInTheDocument();
  });

  test('renders tooltip with zero value', () => {
    const mockPayload = createMockPayload(0);
    const mockLabel = 'Week 3';

    render(<DashboardUserActivityGraphTooltip payload={mockPayload} label={mockLabel} />);

    // Check if label is rendered
    expect(screen.getByText('Week 3:')).toBeInTheDocument();

    // Check if zero value is rendered
    expect(screen.getByText('0 ACTIONS')).toBeInTheDocument();
  });

  test('returns null when payload is undefined', () => {
    const { container } = render(
      <DashboardUserActivityGraphTooltip payload={undefined} label="Week 1" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('returns null when payload is empty array', () => {
    const { container } = render(<DashboardUserActivityGraphTooltip payload={[]} label="Week 1" />);

    expect(container.firstChild).toBeNull();
  });

  test('returns null when payload first item has null value', () => {
    const mockPayload = [
      {
        value: null as any,
        dataKey: 'noOfActions',
        name: 'noOfActions',
        color: '#8884d8',
        payload: { week: 'Week 1', noOfActions: null },
      } as Payload<ValueType, NameType>,
    ];

    const { container } = render(
      <DashboardUserActivityGraphTooltip payload={mockPayload} label="Week 1" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('returns null when payload first item has undefined value', () => {
    const mockPayload = [
      {
        value: undefined,
        dataKey: 'noOfActions',
        name: 'noOfActions',
        color: '#8884d8',
        payload: { week: 'Week 1', noOfActions: undefined },
      } as Payload<ValueType, NameType>,
    ];

    const { container } = render(
      <DashboardUserActivityGraphTooltip payload={mockPayload} label="Week 1" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('applies correct CSS classes for styling', () => {
    const mockPayload = createMockPayload(100);
    const mockLabel = 'Week 1';

    render(<DashboardUserActivityGraphTooltip payload={mockPayload} label={mockLabel} />);

    // Check container classes
    const container = screen.getByText('Week 1:').parentElement;
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'gap-1',
      'bg-white',
      'p-2',
      'shadow-md',
      'rounded-[4px]'
    );

    // Check label classes
    const labelElement = screen.getByText('Week 1:');
    expect(labelElement).toHaveClass('text-sm', 'text-high-emphasis');

    // Check value classes
    const valueElement = screen.getByText('100 ACTIONS');
    expect(valueElement).toHaveClass('text-sm', 'font-semibold', 'text-medium-emphasis');
  });

  test('uses translation function for ACTIONS text', () => {
    const mockPayload = createMockPayload(50);
    const mockLabel = 'Week 1';

    render(<DashboardUserActivityGraphTooltip payload={mockPayload} label={mockLabel} />);

    // Since we mock t to return the key, it should show 'ACTIONS'
    expect(screen.getByText('50 ACTIONS')).toBeInTheDocument();
  });

  test('handles different label formats', () => {
    const mockPayload = createMockPayload(75);
    const longLabel = 'This is a very long week label';

    render(<DashboardUserActivityGraphTooltip payload={mockPayload} label={longLabel} />);

    expect(screen.getByText(`${longLabel}:`)).toBeInTheDocument();
    expect(screen.getByText('75 ACTIONS')).toBeInTheDocument();
  });
});
