import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoicePreview } from './invoice-preview';
import { Invoice, InvoiceStatus } from '../../data/invoice-data';

// Mock the InvoicesDetail component
jest.mock('../invoices-detail/invoices-detail', () => ({
  InvoicesDetail: jest.fn(() => <div data-testid="invoices-detail" />),
}));

describe('InvoicePreview', () => {
  const mockInvoice: Invoice = {
    id: 'INV-001',
    customerName: 'Test Customer',
    customerImg: 'https://example.com/avatar.jpg',
    dateIssued: '2025-06-01T00:00:00.000Z',
    dueDate: '2025-06-15T00:00:00.000Z',
    amount: 1000,
    status: InvoiceStatus.Paid,
    currency: 'CHF',
    billingInfo: {
      address: 'Test Address',
      email: 'test@example.com',
      phone: '+41123456789',
    },
    orderDetails: {
      items: [],
      subtotal: 1000,
      taxes: 0,
      taxRate: 0,
      totalAmount: 1000,
      note: 'Test Note',
    },
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
    render(
      <InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={mockInvoice} />
    );

    // Check if dialog content is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Check if InvoicesDetail is rendered with correct props
    const invoicesDetail = screen.getByTestId('invoices-detail');
    expect(invoicesDetail).toBeInTheDocument();
  });

  it('passes correct props to InvoicesDetail', () => {
    render(
      <InvoicePreview open={true} onOpenChange={mockOnOpenChange} invoice={mockInvoice} />
    );

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
