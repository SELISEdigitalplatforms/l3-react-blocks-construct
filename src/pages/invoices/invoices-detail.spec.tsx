import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InvoiceDetailsPage } from './invoices-detail';
import { useGetInvoiceItems } from 'features/invoices/hooks/use-invoices';
import { InvoiceItem } from 'features/invoices/types/invoices.types';

// Mock the useGetInvoiceItems hook
jest.mock('features/invoices/hooks/use-invoices', () => ({
  useGetInvoiceItems: jest.fn(),
}));

// Mock the InvoicesDetail component
jest.mock('features/invoices', () => ({
  InvoicesDetail: ({ invoice }: { invoice: InvoiceItem }) => (
    <div data-testid="invoice-detail">
      <div data-testid="customer-name">{invoice.Customer[0].CustomerName}</div>
      <div data-testid="invoice-id">{invoice.ItemId}</div>
    </div>
  ),
}));

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock the useToast hook
jest.mock('hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Sample invoice data
const mockInvoice: InvoiceItem = {
  ItemId: 'test-invoice-id',
  CreatedBy: 'test-user',
  CreatedDate: '2025-01-01T00:00:00.000Z',
  LastUpdatedBy: 'test-user',
  LastUpdatedDate: '2025-01-01T00:00:00.000Z',
  IsDeleted: false,
  Language: 'en',
  OrganizationIds: ['org-123'],
  Tags: ['test'],
  DateIssued: '2025-06-15T00:00:00.000Z',
  DueDate: '2025-06-30T00:00:00.000Z',
  Amount: 1000, // Required field
  Customer: [
    {
      CustomerName: 'Test Customer',
      BillingAddress: 'Test Address',
      Email: 'test@example.com',
      PhoneNo: '+41123456789',
    },
  ],
  Status: 'DRAFT',
  Currency: 'CHF',
  GeneralNote: '',
  ItemDetails: [],
  Subtotal: 1000,
  Taxes: 0,
  TotalAmount: 1000,
};

describe('InvoiceDetailsPage', () => {
  const mockUseGetInvoiceItems = useGetInvoiceItems as jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  const renderWithRouter = (invoiceId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/invoices/${invoiceId}`]}>
        <Routes>
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders invoice details when invoice exists', async () => {
    // Mock the useGetInvoiceItems hook to return our test data
    mockUseGetInvoiceItems.mockReturnValue({
      data: {
        items: [mockInvoice],
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 1,
        totalPages: 1,
        pageSize: 10,
        pageNo: 1,
      },
      isLoading: false,
      error: null,
    });

    renderWithRouter('test-invoice-id');

    await waitFor(() => {
      expect(screen.getByTestId('invoice-detail')).toBeInTheDocument();
      expect(screen.getByTestId('customer-name')).toHaveTextContent('Test Customer');
      expect(screen.getByTestId('invoice-id')).toHaveTextContent('test-invoice-id');
    });
  });

  test('renders not found message when invoice does not exist', async () => {
    // Mock the useGetInvoiceItems hook to return empty items
    mockUseGetInvoiceItems.mockReturnValue({
      data: {
        items: [],
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 0,
        totalPages: 0,
        pageSize: 10,
        pageNo: 1,
      },
      isLoading: false,
      error: null,
    });

    renderWithRouter('non-existent-id');

    await waitFor(() => {
      expect(screen.queryByTestId('invoice-detail')).not.toBeInTheDocument();
      expect(screen.getByText('INVOICE_DETAIL_NOT_FOUND')).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching data', () => {
    // Mock the loading state
    mockUseGetInvoiceItems.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithRouter('test-invoice-id');

    // Check for the loading spinner by its class name
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8', 'w-8');
  });
});
