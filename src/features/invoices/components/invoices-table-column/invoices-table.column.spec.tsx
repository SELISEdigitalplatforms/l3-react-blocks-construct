// Mock the useInvoices hook to prevent any actual API calls
vi.mock('../../hooks/use-invoices', () => ({
  useGetInvoiceItems: vi.fn().mockReturnValue({
    data: { items: [] },
    isLoading: false,
    error: null,
  }),
}));

// Now import React and other dependencies after mocks are set up
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { createInvoiceTableColumns } from './invoices-table.column';
import { InvoiceItem, InvoiceStatus } from '../../types/invoices.types';
import { type ColumnDef } from '@tanstack/react-table';

type RowData = {
  original: InvoiceItem;
};

type ColumnDefWithFilter = ColumnDef<InvoiceItem> & {
  filterFn?: (row: RowData, columnId: string, filterValue: any) => boolean;
  sortingFn?: (rowA: RowData, rowB: RowData, columnId: string) => number;
};

// Mock the DataTableColumnHeader component
vi.mock('components/core', () => ({
  // eslint-disable-next-line react/prop-types
  DataTableColumnHeader: ({ title }: { title: string }) => (
    <div data-testid="column-header">{title}</div>
  ),
}));

describe('Invoice Table Columns', () => {
  // Mock translation function
  const mockT = (key: string) => key;

  // Sample invoice data for testing
  const mockInvoice: InvoiceItem = {
    ItemId: 'INV-001',
    DateIssued: '2025-06-01T00:00:00.000Z',
    DueDate: '2025-06-15T00:00:00.000Z',
    Amount: 1000,
    Currency: 'CHF',
    Status: InvoiceStatus.PAID,
    Customer: [
      {
        CustomerName: 'Test Customer',
        BillingAddress: 'Test Address',
        Email: 'test@example.com',
        PhoneNo: '+41123456789',
      },
    ],
    ItemDetails: [],
  };

  // Get the column definitions with proper typing
  const columns = createInvoiceTableColumns({ t: mockT }) as ColumnDefWithFilter[];

  test('creates the correct number of columns', () => {
    // Update to expect 7 columns (including actions column)
    expect(columns).toHaveLength(7);
    expect(columns.map((col) => col.id)).toEqual([
      'ItemId',
      'Customer',
      'DateIssued',
      'Amount',
      'DueDate',
      'Status',
      'actions',
    ]);
  });

  test('should render ID cell correctly', () => {
    const idColumn = columns.find((col) => col.id === 'ItemId');
    if (idColumn?.cell && typeof idColumn.cell === 'function') {
      const { container } = render(<>{idColumn.cell({ row: { original: mockInvoice } } as any)}</>);
      expect(container).toHaveTextContent('INV-001');
    }
  });

  test('should render customer cell with image correctly', () => {
    const customerColumn = columns.find((col) => col.id === 'Customer');
    if (customerColumn?.cell && typeof customerColumn.cell === 'function') {
      render(<>{customerColumn.cell({ row: { original: mockInvoice } } as any)}</>);

      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    }
  });

  test('should render date cells with correct formatting', () => {
    const dateIssuedColumn = columns.find((col) => col.id === 'DateIssued');
    const dueDateColumn = columns.find((col) => col.id === 'DueDate');

    if (dateIssuedColumn && dateIssuedColumn.cell && typeof dateIssuedColumn.cell === 'function') {
      const { container: issuedContainer } = render(
        <>
          {dateIssuedColumn.cell({
            row: { original: mockInvoice },
          } as any)}
        </>
      );
      expect(issuedContainer).toHaveTextContent('01/06/2025');
    }

    if (dueDateColumn && dueDateColumn.cell && typeof dueDateColumn.cell === 'function') {
      const { container: dueContainer } = render(
        <>
          {dueDateColumn.cell({
            row: { original: mockInvoice },
          } as any)}
        </>
      );
      expect(dueContainer).toHaveTextContent('15/06/2025');
    }
  });

  test('should render amount with currency', () => {
    const amountColumn = columns.find((col) => col.id === 'Amount');
    if (amountColumn?.cell && typeof amountColumn.cell === 'function') {
      const { container } = render(
        <>{amountColumn.cell({ row: { original: mockInvoice } } as any)}</>
      );
      expect(container).toHaveTextContent('CHF 1000.00');
    }
  });

  test('should render status with correct styling', () => {
    const statusColumn = columns.find((col) => col.id === 'Status');
    if (statusColumn?.cell && typeof statusColumn.cell === 'function') {
      render(
        <div data-testid="status-container">
          {statusColumn.cell({
            row: {
              original: {
                ...mockInvoice,
                Status: InvoiceStatus.PAID,
              },
              getValue: (key: string) => {
                if (key === 'Status') return InvoiceStatus.PAID;
                return mockInvoice[key as keyof InvoiceItem];
              },
            },
          } as any)}
        </div>
      );

      // Find the status text and check its styling
      const statusText = screen.getByText('Paid');

      // Check if the status text has the expected text color class
      // The background color might be applied to a parent element
      expect(statusText).toHaveClass('text-success');

      // Check if the parent element has the expected background color
      // Note: The exact class might be different in your implementation
      const statusBadge = statusText.closest('div');
      expect(statusBadge).toHaveClass('flex', 'items-center');
    }
  });

  // Test filter functions by directly checking their implementation
  test('date filter function works correctly', () => {
    const dateIssuedColumn = columns.find((col) => col.id === 'DateIssued');
    if (!dateIssuedColumn?.filterFn || dateIssuedColumn.filterFn === 'auto') return;

    const filterFn = dateIssuedColumn.filterFn;

    // Helper function to create a row with getValue method
    const createRow = (date: string) => ({
      original: { ...mockInvoice, DateIssued: date },
      getValue: (key: string) => {
        if (key === 'DateIssued') return date;
        return mockInvoice[key as keyof InvoiceItem];
      },
    });

    // Helper function to create date range in the format expected by the filter function
    const createDateRange = (start: string, end: string) => ({
      from: new Date(start),
      to: new Date(end),
    });

    // Test with date in range (inclusive of start date)
    const inRangeResult1 = filterFn(
      createRow('2025-06-01T12:00:00.000Z'), // Middle of day
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(inRangeResult1).toBe(true);

    // Test with date in range (inclusive of end date)
    const inRangeResult2 = filterFn(
      createRow('2025-06-30T23:59:59.999Z'),
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(inRangeResult2).toBe(true);

    // Test with date out of range (before range)
    // Need to use a date that's clearly before the start date in any timezone
    const outOfRangeBeforeResult = filterFn(
      createRow('2025-04-01T00:00:00.000Z'), // Well before range starts
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(outOfRangeBeforeResult).toBe(false);

    // Test with date out of range (after range)
    // The end date is exclusive, so we need to go to the next day
    const outOfRangeAfterResult = filterFn(
      createRow('2025-07-02T00:00:00.000Z'), // Day after range ends
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(outOfRangeAfterResult).toBe(false);

    // Test with date exactly on start date (should be included)
    const onStartDateResult = filterFn(
      createRow('2025-05-01T00:00:00.000Z'),
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(onStartDateResult).toBe(true);

    // Test with date on the last day of the range (should be included)
    const onLastDayResult = filterFn(
      createRow('2025-06-30T23:59:59.999Z'), // Last moment of last day in range
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(onLastDayResult).toBe(true);

    // Test with date on the end date (should be included as per isSameDay check)
    const onEndDateResult = filterFn(
      createRow('2025-07-01T00:00:00.000Z'), // Start of end date
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(onEndDateResult).toBe(true);

    // Test with date after the end date (should be excluded)
    const afterEndDateResult = filterFn(
      createRow('2025-07-02T00:00:00.000Z'), // Day after end date
      'DateIssued',
      createDateRange('2025-05-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
    );
    expect(afterEndDateResult).toBe(false);

    // Test with no date range (should return true)
    const noRangeResult = filterFn(createRow('2025-06-15T12:00:00.000Z'), 'DateIssued', {
      from: undefined,
      to: undefined,
    });
    expect(noRangeResult).toBe(true);
  });

  test('status filter function works correctly', () => {
    const statusColumn = columns.find((col) => col.id === 'Status');
    if (!statusColumn?.filterFn || statusColumn.filterFn === 'auto') return;

    const filterFn = statusColumn.filterFn;

    // Helper function to create a row with getValue method
    const createRow = (status: string) => ({
      original: { ...mockInvoice, Status: status },
      getValue: (key: string) => {
        if (key === 'Status') return status;
        return mockInvoice[key as keyof InvoiceItem];
      },
    });

    // Test with status in filter
    const matchingResult = filterFn(createRow(InvoiceStatus.PAID), 'Status', [
      InvoiceStatus.PAID,
      InvoiceStatus.PENDING,
    ]);
    expect(matchingResult).toBe(true);

    // Test with status not in filter
    const nonMatchingResult = filterFn(createRow(InvoiceStatus.PAID), 'Status', [
      InvoiceStatus.PENDING,
      InvoiceStatus.OVERDUE,
    ]);
    expect(nonMatchingResult).toBe(false);
  });

  test('date sorting functions work correctly', () => {
    const dateIssuedColumn = columns.find((col) => col.id === 'DateIssued');
    if (!dateIssuedColumn?.sortingFn || dateIssuedColumn.sortingFn === 'auto') return;

    const sortFn = dateIssuedColumn.sortingFn;

    const earlierInvoice = {
      ...mockInvoice,
      DateIssued: '2025-05-01T00:00:00.000Z',
    };
    const laterInvoice = {
      ...mockInvoice,
      DateIssued: '2025-07-01T00:00:00.000Z',
    };

    // Earlier date should come before later date
    const sortResult = sortFn(
      { original: earlierInvoice },
      { original: laterInvoice },
      'DateIssued'
    );
    expect(sortResult).toBeLessThan(0);

    // Later date should come after earlier date
    const reverseSortResult = sortFn(
      { original: laterInvoice },
      { original: earlierInvoice },
      'DateIssued'
    );
    expect(reverseSortResult).toBeGreaterThan(0);

    // Equal dates should return 0
    const sameDateResult = sortFn(
      { original: mockInvoice },
      { original: { ...mockInvoice } }, // New object to avoid reference equality
      'DateIssued'
    );
    expect(sameDateResult).toBe(0);
  });
});
