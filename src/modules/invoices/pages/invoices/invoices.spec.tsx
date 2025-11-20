import React from 'react';
import { mockNavigate } from '../../../../lib/utils/test-utils/shared-test-utils';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as columnsModule from '../../components/invoices-table-column/invoices-table.column';
import { MemoryRouter } from 'react-router-dom';
import { InvoicesPage } from './invoices';
import { InvoiceItem } from '@/modules/invoices/types/invoices.types';
import { vi, Mock } from 'vitest';

// Mock UUID module
vi.mock('uuid', () => ({
  v4: () => 'cmock-uuid-v4',
  v1: () => 'mock-uuid-v1',
}));

// Mock the useGetInvoiceItems hook
const mockData = {
  items: [
    {
      ItemId: '1',
      Customer: [
        {
          CustomerName: 'Test Customer 1',
          Email: 'test1@example.com',
          PhoneNo: '+41123456789',
          BillingAddress: 'Test Address 1',
        },
      ],
      Status: 'Draft',
      DateIssued: '2025-06-15',
      DueDate: '2025-07-15',
      Amount: 1000,
      currency: 'CHF',
      ItemDetails: [],
    },
    {
      ItemId: '2',
      Customer: [
        {
          CustomerName: 'Test Customer 2',
          Email: 'test2@example.com',
          PhoneNo: '+41987654321',
          BillingAddress: 'Test Address 2',
        },
      ],
      Status: 'Paid',
      DateIssued: '2025-07-15',
      DueDate: '2025-08-15',
      Amount: 2000,
      currency: 'CHF',
      ItemDetails: [],
    },
  ],
  totalCount: 2,
  pageNo: 1,
  pageSize: 10,
};

const mockUseGetInvoiceItems = vi.fn();

vi.mock('../../hooks/use-invoices', () => ({
  useGetInvoiceItems: () => mockUseGetInvoiceItems(),
}));

// Mock columns creator used by the page
vi.mock('../../components/invoices-table-column/invoices-table.column', () => ({
  createInvoiceTableColumns: vi.fn(() => [
    { id: 'customerName', header: 'Customer Name' },
    { id: 'status', header: 'Status' },
  ]),
}));

// Mock table and toolbar components used by the page
vi.mock('../../components/invoices-overview-table/invoices-overview-table', () => ({
  InvoicesOverviewTable: ({
    data,
    onRowClick,
    toolbar,
  }: {
    data: InvoiceItem[];
    onRowClick: (invoice: InvoiceItem) => void;
    toolbar: (table: any) => React.ReactNode;
  }) => (
    <div data-testid="invoices-table">
      <div data-testid="table-toolbar">
        {toolbar({ getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }) })}
      </div>
      <table>
        <tbody>
          {data.map((invoice: InvoiceItem) => (
            <tr
              key={invoice.ItemId}
              data-testid={`invoice-row-${invoice.ItemId}`}
              onClick={() => onRowClick(invoice)}
            >
              <td>{invoice.Customer?.[0]?.CustomerName}</td>
              <td>{invoice.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

vi.mock('../../components/invoices-header-toolbar/invoices-header-toolbar', () => ({
  default: () => <div data-testid="invoices-header-toolbar">Header Toolbar</div>,
}));

vi.mock('../../components/invoices-filter-toolbar/invoices-filter-toolbar', () => ({
  default: () => <div data-testid="invoices-filter-toolbar">Filter Toolbar</div>,
}));

// react-router and i18n are mocked via shared-test-utils

describe('InvoicesPage', () => {
  const createInvoiceTableColumns = columnsModule.createInvoiceTableColumns as Mock;
  const renderInvoicesPage = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <InvoicesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('renders the invoices page with header toolbar', () => {
    mockUseGetInvoiceItems.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
    renderInvoicesPage();
    expect(screen.getByTestId('invoices-header-toolbar')).toBeInTheDocument();
  });

  test('renders the invoices table with filter toolbar', () => {
    mockUseGetInvoiceItems.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
    renderInvoicesPage();
    expect(screen.getByTestId('invoices-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('invoices-filter-toolbar')).toBeInTheDocument();
  });

  test('calls createInvoiceTableColumns with translation function', () => {
    mockUseGetInvoiceItems.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
    renderInvoicesPage();
    expect(createInvoiceTableColumns).toHaveBeenCalledWith(
      expect.objectContaining({
        t: expect.any(Function),
      })
    );
  });

  test('renders with correct container structure', () => {
    mockUseGetInvoiceItems.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
    const { container } = renderInvoicesPage();

    const outerDiv = container.querySelector('div.flex.w-full.gap-5.flex-col');
    expect(outerDiv).toBeInTheDocument();
  });
});
