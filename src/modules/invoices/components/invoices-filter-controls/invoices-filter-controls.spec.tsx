import { render, screen } from '@testing-library/react';
import { InvoicesFilterControls } from './invoices-filter-controls';
import { vi } from 'vitest';
import '../../../../test-utils/shared-test-utils';

// Mock the DateRangeFilter component
vi.mock('components/core/data-table/data-table-date-filter', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DateRangeFilter: ({ title, ..._props }: { title: string; [key: string]: any }) => (
    <div data-testid={`date-filter-${title}`}>{title} Filter</div>
  ),
}));

// Mock the DataTableFacetedFilter component
vi.mock('components/core/data-table/data-table-faceted-filter', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DataTableFacetedFilter: ({
    title,
    options,
  }: {
    title: string;
    options: any[];
    [key: string]: any;
  }) => (
    <div data-testid={`faceted-filter-${title}`}>
      {title} Filter ({options.length} options)
    </div>
  ),
}));

describe('InvoicesFilterControls', () => {
  // Create mock props
  const mockDateIssued = { from: new Date('2025-01-01'), to: new Date('2025-01-31') };
  const mockDueDate = { from: new Date('2025-02-01'), to: new Date('2025-02-28') };
  const mockOnDateIssuedChange = vi.fn();
  const mockOnDueDateChange = vi.fn();

  // Create a mock table for testing
  const mockTable = {
    getColumn: vi.fn().mockImplementation((columnId) => {
      if (columnId === 'Status') {
        return {
          id: 'Status',
          setFilterValue: vi.fn(),
          getFacetedUniqueValues: vi.fn().mockReturnValue(
            new Map([
              ['pending', 1],
              ['paid', 2],
              ['overdue', 1],
            ])
          ),
          getFilterValue: vi.fn().mockReturnValue([]),
        };
      }
      return {
        id: columnId,
        setFilterValue: vi.fn(),
      };
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter components', () => {
    render(
      <InvoicesFilterControls
        table={mockTable as any}
        dateIssued={mockDateIssued}
        dueDate={mockDueDate}
        onDateIssuedChange={mockOnDateIssuedChange}
        onDueDateChange={mockOnDueDateChange}
      />
    );

    // Check if date filters are rendered
    expect(screen.getByText('DATE_ISSUED')).toBeInTheDocument();
    expect(screen.getByText('DUE_DATE')).toBeInTheDocument();

    // Check if status filter is rendered
    expect(screen.getByText('STATUS')).toBeInTheDocument();
  });

  it('renders without date ranges when not provided', () => {
    render(
      <InvoicesFilterControls
        table={mockTable as any}
        onDateIssuedChange={mockOnDateIssuedChange}
        onDueDateChange={mockOnDueDateChange}
      />
    );

    // Check if filters are still rendered even without date ranges
    expect(screen.getByText('DATE_ISSUED')).toBeInTheDocument();
    expect(screen.getByText('DUE_DATE')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
  });

  it('does not render status filter when column is not available', () => {
    // Mock table without status column
    const tableWithoutStatus = {
      getColumn: vi.fn().mockImplementation((columnId) => {
        if (columnId === 'Status') {
          return null;
        }
        return {
          id: columnId,
          setFilterValue: vi.fn(),
        };
      }),
    };

    render(
      <InvoicesFilterControls
        table={tableWithoutStatus as any}
        dateIssued={mockDateIssued}
        dueDate={mockDueDate}
        onDateIssuedChange={mockOnDateIssuedChange}
        onDueDateChange={mockOnDueDateChange}
      />
    );

    // Date filters should still be rendered
    expect(screen.getByText('DATE_ISSUED')).toBeInTheDocument();
    expect(screen.getByText('DUE_DATE')).toBeInTheDocument();

    // Status filter should not be rendered
    expect(screen.queryByText('STATUS')).not.toBeInTheDocument();
  });
});
