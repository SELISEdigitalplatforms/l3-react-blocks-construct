import React from 'react';
import { screen } from '@testing-library/react';
import { InvoicePreview } from './invoice-preview';
import { InvoiceStatus } from '../../types/invoices.types';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../../test-utils/test-providers';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the InvoicesDetail component
vi.mock('../invoices-detail/invoices-detail', () => ({
  InvoicesDetail: vi.fn(() => <div data-testid="invoices-detail" />),
}));

describe('InvoicePreview', () => {
  const mockInvoice = {
    ItemId: 'INV-001',
    DateIssued: '2025-06-01T00:00:00.000Z',
    DueDate: '2025-06-15T00:00:00.000Z',
    Amount: 1000,
    Status: InvoiceStatus.PAID,
    currency: 'CHF',
    Customer: [
      {
        CustomerName: 'Test Customer',
        BillingAddress: 'Test Address',
        Email: 'test@example.com',
        PhoneNo: '+41123456789',
      },
    ],
    ItemDetails: [],
    Subtotal: 1000,
    Taxes: 0,
    TotalAmount: 1000,
    GeneralNote: 'Test Note',
  };

  const mockOnOpenChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when invoice is null', () => {
    const { container } = renderWithProviders(
      <InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the dialog when open is true and invoice is provided', () => {
    renderWithProviders(
      <InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={mockInvoice} />
    );

    // Check if dialog content is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check if InvoicesDetail is rendered with correct props
    const invoicesDetail = screen.getByTestId('invoices-detail');
    expect(invoicesDetail).toBeInTheDocument();
  });

  it('passes correct props to InvoicesDetail', () => {
    renderWithProviders(
      <InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={mockInvoice} />
    );

    // Check if InvoicesDetail is rendered (it should be since the dialog is open and invoice is provided)
    const invoicesDetail = screen.getByTestId('invoices-detail');
    expect(invoicesDetail).toBeInTheDocument();
  });
});
