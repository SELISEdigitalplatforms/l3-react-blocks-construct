import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoicesDetail } from './invoices-detail';
import { Invoice, InvoiceStatus } from '../../data/invoice-data';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.mock('html2canvas', () =>
  jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockImageData'),
    width: 800,
    height: 1200,
  })
);

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: jest.fn().mockReturnValue(210),
      },
    },
    addImage: jest.fn(),
    save: jest.fn(),
  }));
});

jest.mock('hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('components/blocks/confirmation-modal/confirmation-modal', () => ({
  __esModule: true,
  default: ({
    open,
    onConfirm,
    title,
    description,
  }: {
    open: boolean;
    onConfirm: () => void;
    title: string;
    description: string;
  }) =>
    open ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onConfirm} data-testid="confirm-button">
          Confirm
        </button>
      </div>
    ) : null,
}));

// Mock image import
jest.mock('assets/images/construct_logo.svg', () => 'mock-logo-path');

describe('InvoicesDetail', () => {
  // Sample invoice data for testing
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
      items: [
        {
          name: 'Test Item',
          description: 'Test Description',
          category: 'Test Category',
          quantity: 2,
          unitPrice: 500,
          amount: 1000,
        },
      ],
      subtotal: 1000,
      taxes: 0,
      taxRate: 0,
      totalAmount: 1000,
      note: 'Test Note',
    },
  };

  test('renders invoice details correctly', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    // Check if invoice ID is displayed
    expect(screen.getAllByText('INV-001').length).toBeGreaterThan(0);

    // Check if customer name is displayed
    expect(screen.getByText('Test Customer')).toBeInTheDocument();

    // Check if billing info is displayed
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('+41123456789')).toBeInTheDocument();

    // Check if order details are displayed
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Check if financial details are displayed
    expect(screen.getByText('CHF 500.00')).toBeInTheDocument();
    expect(screen.getAllByText('CHF 1000.00').length).toBeGreaterThan(0);

    // Check if note is displayed
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  test('renders in preview mode correctly', () => {
    render(<InvoicesDetail invoice={mockInvoice} isPreview={true} />);

    // In preview mode, there should be no action buttons
    expect(screen.queryByText('DOWNLOAD')).not.toBeInTheDocument();
    expect(screen.queryByText('EDIT')).not.toBeInTheDocument();
    expect(screen.queryByText('SEND')).not.toBeInTheDocument();

    // But invoice ID should still be visible
    expect(screen.getAllByText('INV-001').length).toBeGreaterThan(0);
  });

  test('shows send dialog when send button is clicked', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    // Send button should be visible
    const sendButton = screen.getByText('SEND');
    expect(sendButton).toBeInTheDocument();

    // Click send button
    fireEvent.click(sendButton);

    // Confirmation modal should be visible
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('SEND_INVOICE')).toBeInTheDocument();
  });

  test('handles send confirmation correctly', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    // Click send button to show dialog
    fireEvent.click(screen.getByText('SEND'));

    // Confirm sending
    fireEvent.click(screen.getByTestId('confirm-button'));

    // Modal should be closed
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
  });

  test('renders status badge with correct styling', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    // Find all badge elements with the text 'Paid'
    const badges = screen.getAllByText('Paid');
    expect(badges.length).toBeGreaterThan(0);
    // Check if at least one badge has the correct styling class based on status
    expect(badges.some((badge) => badge.className.includes('text-success'))).toBe(true);
  });
});
