import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InvoiceDetailsPage } from './invoices-detail';
import { invoiceData } from 'features/invoices/data/invoice-data';

// Mock the invoice store
jest.mock('features/invoices/store/invoice-store', () => ({
  useInvoice: () => ({
    getInvoice: (id: string) => {
      if (id === 'test-invoice-id') {
        return {
          id: 'test-invoice-id',
          customerName: 'Test Customer',
          status: 'draft',
          currency: 'CHF',
          dueDate: '2025-06-15',
          billingInfo: {
            email: 'test@example.com',
            phone: '+41123456789',
            address: 'Test Address',
          },
          orderDetails: {
            items: [],
            note: '',
          },
        };
      }
      return undefined;
    },
  }),
}));

// Mock the InvoicesDetail component
jest.mock('features/invoices', () => ({
  InvoicesDetail: ({ invoice }: { invoice: (typeof invoiceData)[0] }) => (
    <div data-testid="invoice-detail">
      <div data-testid="customer-name">{invoice.customerName}</div>
      <div data-testid="invoice-id">{invoice.id}</div>
    </div>
  ),
}));

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('InvoiceDetailsPage', () => {
  const renderWithRouter = (invoiceId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/invoices/${invoiceId}`]}>
        <Routes>
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders invoice details when invoice exists', () => {
    renderWithRouter('test-invoice-id');

    expect(screen.getByTestId('invoice-detail')).toBeInTheDocument();
    expect(screen.getByTestId('customer-name')).toHaveTextContent('Test Customer');
    expect(screen.getByTestId('invoice-id')).toHaveTextContent('test-invoice-id');
  });

  test('renders not found message when invoice does not exist', () => {
    renderWithRouter('non-existent-id');

    expect(screen.queryByTestId('invoice-detail')).not.toBeInTheDocument();
    expect(screen.getByText('INVOICE_DETAIL_NOT_FOUND')).toBeInTheDocument();
  });
});
