import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { InvoicesPage } from './invoices';
import { invoiceData } from 'features/invoices/data/invoice-data';

// Mock the react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the invoice components
jest.mock('features/invoices', () => ({
  InvoicesOverviewTable: ({ data, onRowClick, toolbar }: { 
    data: Array<typeof invoiceData[0]>; 
    onRowClick: (invoice: typeof invoiceData[0]) => void; 
    toolbar: (table: { getState: () => { pagination: { pageIndex: number; pageSize: number } } }) => React.ReactNode;
  }) => (
    <div data-testid="invoices-table">
      <div data-testid="table-toolbar">
        {toolbar({ getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }) })}
      </div>
      <table>
        <tbody>
          {data.map((invoice: typeof invoiceData[0]) => (
            <tr 
              key={invoice.id} 
              data-testid={`invoice-row-${invoice.id}`} 
              onClick={() => onRowClick(invoice)}
            >
              <td>{invoice.id}</td>
              <td>{invoice.customerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  InvoicesHeaderToolbar: () => <div data-testid="invoices-header-toolbar">Header Toolbar</div>,
  InvoicesFilterToolbar: () => <div data-testid="invoices-filter-toolbar">Filter Toolbar</div>,
  createInvoiceTableColumns: () => [
    { id: 'id', header: 'ID' },
    { id: 'customerName', header: 'Customer Name' },
  ],
}));

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('InvoicesPage', () => {
  const renderInvoicesPage = () => {
    return render(
      <MemoryRouter>
        <InvoicesPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders the invoices page with header toolbar', () => {
    renderInvoicesPage();
    expect(screen.getByTestId('invoices-header-toolbar')).toBeInTheDocument();
  });

  test('renders the invoices table with filter toolbar', () => {
    renderInvoicesPage();
    expect(screen.getByTestId('invoices-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('invoices-filter-toolbar')).toBeInTheDocument();
  });

  test('shows loading state initially and then loads data', async () => {
    renderInvoicesPage();

    // Initially no invoice rows should be visible (loading state)
    expect(screen.queryByTestId(/invoice-row-/)).not.toBeInTheDocument();

    // Advance timers to complete the loading
    jest.advanceTimersByTime(500);

    // After loading, invoice rows should be visible
    await waitFor(() => {
      const invoiceRows = screen.getAllByTestId(/invoice-row-/);
      expect(invoiceRows.length).toBeGreaterThan(0);
    });
  });

  test('navigates to invoice detail page when clicking on a row', async () => {
    renderInvoicesPage();

    // Advance timers to complete the loading
    jest.advanceTimersByTime(500);

    // Wait for the invoice rows to be rendered
    await waitFor(() => {
      const invoiceRows = screen.getAllByTestId(/invoice-row-/);
      expect(invoiceRows.length).toBeGreaterThan(0);
    });

    // Get all invoice rows and click on the first one
    const invoiceRows = screen.getAllByTestId(/invoice-row-/);
    const firstInvoiceId = invoiceRows[0].getAttribute('data-testid')?.replace('invoice-row-', '');
    
    // Click on the first invoice row
    fireEvent.click(invoiceRows[0]);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith(`/invoices/${firstInvoiceId}`);
  });

  test('renders with correct container structure', () => {
    const { container } = renderInvoicesPage();

    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('flex');
    expect(outerDiv).toHaveClass('w-full');
    expect(outerDiv).toHaveClass('gap-5');
    expect(outerDiv).toHaveClass('flex-col');
  });
});
