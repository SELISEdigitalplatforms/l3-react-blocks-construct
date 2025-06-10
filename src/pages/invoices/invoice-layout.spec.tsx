import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { InvoiceLayout } from './invoice-layout';

// Mock the InvoiceProvider
jest.mock('../../features/invoices/store/invoice-store', () => ({
  InvoiceProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="invoice-provider">{children}</div>
  ),
}));

// Mock the Outlet component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="router-outlet">Outlet Content</div>,
}));

describe('InvoiceLayout', () => {
  test('renders the InvoiceProvider with Outlet', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <InvoiceLayout />
      </MemoryRouter>
    );

    // Check that the provider is rendered
    const providerElement = getByTestId('invoice-provider');
    expect(providerElement).toBeInTheDocument();

    // Check that the Outlet is rendered inside the provider
    const outletElement = getByTestId('router-outlet');
    expect(outletElement).toBeInTheDocument();
    expect(providerElement).toContainElement(outletElement);
  });

  test('renders with correct structure', () => {
    const { container } = render(
      <MemoryRouter>
        <InvoiceLayout />
      </MemoryRouter>
    );

    // The component should have a simple structure with the provider as the root
    expect(container.firstChild).toHaveAttribute('data-testid', 'invoice-provider');
  });
});
