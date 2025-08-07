import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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
jest.mock('components/blocks/data-table/data-table-column-header', () => ({
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
    Status: InvoiceStatus.PAID,
    Customer: [
      {
        CustomerName: 'Test Customer',
        CustomerImgUrl: 'https://example.com/avatar.jpg',
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
    expect(columns).toHaveLength(6);
    expect(columns.map((col) => col.id)).toEqual([
      'ItemId',
      'Customer',
      'DateIssued',
      'Amount',
      'DueDate',
      'Status',
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
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'Test Customer');
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
      const statusBadge = statusText.closest('div');
      expect(statusBadge).toHaveClass('bg-success/10');
    }
  });

  // Test filter functions by directly checking their implementation
  test('date filter function works correctly', () => {
    const dateIssuedColumn = columns.find((col) => col.id === 'DateIssued');
    if (!dateIssuedColumn?.filterFn || dateIssuedColumn.filterFn === 'auto') return;

    const filterFn = dateIssuedColumn.filterFn;

    // Test with date in range (inclusive of start date)
    const inRangeResult1 = filterFn(
      { original: { ...mockInvoice, DateIssued: '2025-06-01T00:00:00.000Z' } },
      'DateIssued',
      [new Date('2025-05-01T00:00:00.000Z'), new Date('2025-07-01T00:00:00.000Z')]
    );
    expect(inRangeResult1).toBe(true);

    // Test with date in range (inclusive of end date)
    const inRangeResult2 = filterFn(
      { original: { ...mockInvoice, DateIssued: '2025-06-30T23:59:59.999Z' } },
      'DateIssued',
      [new Date('2025-05-01T00:00:00.000Z'), new Date('2025-07-01T00:00:00.000Z')]
    );
    expect(inRangeResult2).toBe(true);

    // Test with date out of range (before range)
    const beforeRangeDate = '2025-04-30T00:00:00.000Z';
    const startDate = '2025-05-01T00:00:00.000Z';
    const endDate = '2025-07-01T00:00:00.000Z';

    const outOfRangeBeforeResult = filterFn(
      { original: { ...mockInvoice, DateIssued: beforeRangeDate } },
      'DateIssued',
      [new Date(startDate), new Date(endDate)]
    );

    expect(outOfRangeBeforeResult).toBe(false);

    // Test with date out of range (after range)
    const outOfRangeAfterResult = filterFn(
      { original: { ...mockInvoice, DateIssued: '2025-07-02T00:00:00.000Z' } }, // One day after end
      'DateIssued',
      [new Date('2025-05-01T00:00:00.000Z'), new Date('2025-07-01T00:00:00.000Z')]
    );
    expect(outOfRangeAfterResult).toBe(false);

    // Test with date exactly on start date (should be included)
    const onStartDateResult = filterFn(
      { original: { ...mockInvoice, DateIssued: '2025-05-01T00:00:00.000Z' } },
      'DateIssued',
      [new Date('2025-05-01T00:00:00.000Z'), new Date('2025-07-01T00:00:00.000Z')]
    );
    expect(onStartDateResult).toBe(true);

    // Test with date exactly on end date (should be excluded)
    const onEndDateResult = filterFn(
      { original: { ...mockInvoice, DateIssued: '2025-07-01T00:00:00.000Z' } },
      'DateIssued',
      [new Date('2025-05-01T00:00:00.000Z'), new Date('2025-07-01T00:00:00.000Z')]
    );
    expect(onEndDateResult).toBe(false);
  });

  test('status filter function works correctly', () => {
    const statusColumn = columns.find((col) => col.id === 'Status');
    if (!statusColumn?.filterFn || statusColumn.filterFn === 'auto') return;

    const filterFn = statusColumn.filterFn;

    // Test with status in filter
    const matchingResult = filterFn({ original: mockInvoice }, 'Status', [
      InvoiceStatus.PAID,
      InvoiceStatus.PENDING,
    ]);
    expect(matchingResult).toBe(true);

    // Test with status not in filter
    const nonMatchingResult = filterFn({ original: mockInvoice }, 'Status', [
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
