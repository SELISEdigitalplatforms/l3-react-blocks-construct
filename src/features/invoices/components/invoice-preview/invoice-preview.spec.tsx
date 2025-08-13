import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoicePreview } from './invoice-preview';
import { InvoiceStatus } from '../../types/invoices.types';

// Mock the InvoicesDetail component
jest.mock('../invoices-detail/invoices-detail', () => ({
  InvoicesDetail: jest.fn(() => <div data-testid="invoices-detail" />),
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

  const mockOnOpenChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when invoice is null', () => {
    const { container } = render(
      <InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the dialog when open is true and invoice is provided', () => {
    render(<InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={mockInvoice} />);

    // Check if dialog content is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check if InvoicesDetail is rendered with correct props
    const invoicesDetail = screen.getByTestId('invoices-detail');
    expect(invoicesDetail).toBeInTheDocument();
  });

  it('passes correct props to InvoicesDetail', () => {
    render(<InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={mockInvoice} />);

    // Check if InvoicesDetail is called with correct props
    const { InvoicesDetail } = jest.requireMock('../invoices-detail/invoices-detail');
    expect(InvoicesDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        invoice: mockInvoice,
        isPreview: true,
      }),
      {}
    );
  });
});
