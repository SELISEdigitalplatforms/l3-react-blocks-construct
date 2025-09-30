import React from 'react';
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoicesFilterControls } from './invoices-filter-controls';
import { InvoiceStatus } from '../../types/invoices.types';
// Mock the DateRangeFilter component
vi.mock('components/blocks/data-table/data-table-date-filter', () => ({
  DateRangeFilter: ({ title, label }: { title?: string; label?: string }) => {
    const displayTitle = title || label || 'Date Filter';
    return <div data-testid={`date-filter-${displayTitle}`}>{displayTitle} Filter</div>;
  },
}));

// Mock the DataTableFacetedFilter component
vi.mock('components/blocks/data-table/data-table-faceted-filter', () => ({
  DataTableFacetedFilter: ({ title, options }: { title: string; options: any[] }) => (
    <div data-testid={`faceted-filter-${title}`}>
      {title} Filter ({options.length} options)
    </div>
  ),
}));

// Mock the react-i18next hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
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
      if (columnId === 'status') {
        return {
          id: 'status',
          setFilterValue: vi.fn(),
          getFilterValue: vi.fn().mockReturnValue([]),
          getFacetedUniqueValues: vi.fn().mockReturnValue(new Map([
            ['PAID', 5],
            ['PENDING', 3],
            ['OVERDUE', 2]
          ])),
        };
      }
      return {
        id: columnId,
        setFilterValue: vi.fn(),
        getFilterValue: vi.fn().mockReturnValue([]),
        getFacetedUniqueValues: vi.fn().mockReturnValue(new Map()),
      };
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all filter components', () => {
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
    expect(screen.getByTestId('date-filter-DATE_ISSUED')).toBeInTheDocument();
    expect(screen.getByTestId('date-filter-DUE_DATE')).toBeInTheDocument();

    // Check if status filter is rendered
    expect(screen.getByTestId('faceted-filter-STATUS')).toBeInTheDocument();

    // Check if status filter has the correct number of options (all enum values)
    const statusFilterText = screen.getByTestId('faceted-filter-STATUS').textContent;
    expect(statusFilterText).toContain(`${Object.values(InvoiceStatus).length} options`);
  });

  test('renders without date ranges when not provided', () => {
    render(
      <InvoicesFilterControls
        table={mockTable as any}
        onDateIssuedChange={mockOnDateIssuedChange}
        onDueDateChange={mockOnDueDateChange}
      />
    );

    // Check if filters are still rendered even without date ranges
    expect(screen.getByTestId('date-filter-DATE_ISSUED')).toBeInTheDocument();
    expect(screen.getByTestId('date-filter-DUE_DATE')).toBeInTheDocument();
    expect(screen.getByTestId('faceted-filter-STATUS')).toBeInTheDocument();
  });

  test('does not render status filter when column is not available', () => {
    // Mock table without status column
    const tableWithoutStatus = {
      getColumn: vi.fn().mockImplementation((columnId) => {
        if (columnId === 'Status') {
          // Changed from 'status' to 'Status' to match component
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
    expect(screen.getByTestId('date-filter-DATE_ISSUED')).toBeInTheDocument();
    expect(screen.getByTestId('date-filter-DUE_DATE')).toBeInTheDocument();

    // Status filter should not be rendered
    expect(screen.queryByTestId('faceted-filter-STATUS')).not.toBeInTheDocument();
  });
});
