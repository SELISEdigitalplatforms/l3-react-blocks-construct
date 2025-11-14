import React from 'react';
import '../../../../lib/utils/test-utils/shared-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InvoiceDetailsPage } from './invoices-detail';
import { InvoiceItem } from '@/modules/invoices/types/invoices.types';
import { vi } from 'vitest';

// Mock UUID module
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-v4',
  v1: () => 'mock-uuid-v1',
}));

// Mock the useInvoiceDetails hook for both alias and relative paths
const { mockUseInvoiceDetails } = vi.hoisted(() => ({
  mockUseInvoiceDetails: vi.fn(),
}));
vi.mock('../../hooks/use-invoice-details', () => ({
  useInvoiceDetails: mockUseInvoiceDetails,
}));
vi.mock('@/modules/invoices/hooks/use-invoice-details', () => ({
  useInvoiceDetails: mockUseInvoiceDetails,
}));

// Mock the InvoicesDetail component using the exact module path used by the page
vi.mock('../../components/invoices-detail/invoices-detail', () => ({
  __esModule: true,
  default: ({ invoice }: { invoice: InvoiceItem }) => (
    <div data-testid="invoice-detail">
      <div data-testid="customer-name">{invoice.Customer[0].CustomerName}</div>
      <div data-testid="invoice-id">{invoice.ItemId}</div>
    </div>
  ),
}));

// i18n is mocked via shared-test-utils

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
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
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
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
    // Mock the useInvoiceDetails hook to return our test data
    mockUseInvoiceDetails.mockReturnValue({
      t: (key: string) => key,
      invoice: mockInvoice,
      isLoading: false,
    });

    renderWithRouter('test-invoice-id');

    await waitFor(() => {
      expect(screen.getByTestId('invoice-detail')).toBeInTheDocument();
      expect(screen.getByTestId('customer-name')).toHaveTextContent('Test Customer');
      expect(screen.getByTestId('invoice-id')).toHaveTextContent('test-invoice-id');
    });
  });

  test('renders not found message when invoice does not exist', async () => {
    // Mock the useInvoiceDetails hook to return no invoice
    mockUseInvoiceDetails.mockReturnValue({
      t: (key: string) => key,
      invoice: undefined,
      isLoading: false,
    });

    renderWithRouter('non-existent-id');

    await waitFor(() => {
      expect(screen.queryByTestId('invoice-detail')).not.toBeInTheDocument();
      expect(screen.getByText('INVOICE_DETAIL_NOT_FOUND')).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching data', () => {
    // Mock the loading state
    mockUseInvoiceDetails.mockReturnValue({
      t: (key: string) => key,
      invoice: undefined,
      isLoading: true,
    });

    renderWithRouter('test-invoice-id');

    // Check for the loading spinner by its class name
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
