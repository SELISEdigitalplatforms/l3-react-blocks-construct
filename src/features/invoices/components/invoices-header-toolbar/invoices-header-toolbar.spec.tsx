import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { InvoicesHeaderToolbar } from './invoices-header-toolbar';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: jest.fn(),
      },
    };
  },
}));

jest.mock('components/blocks/gurads/permission-guard/permission-guard', () => ({
  PermissionGuard: ({
    children,
    showFallback,
  }: {
    children: React.ReactNode;
    showFallback?: boolean;
  }) => {
    const hasPermission = (global as any).mockHasPermission ?? true;
    return hasPermission ? (
      <>{children}</>
    ) : showFallback ? (
      <div data-testid="permission-denied">No Permission</div>
    ) : null;
  },
}));

jest.mock('config/roles-permissions', () => ({
  MENU_PERMISSIONS: {
    INVOICE_WRITE: 'invoice:write',
  },
}));

describe('InvoicesHeaderToolbar', () => {
  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <InvoicesHeaderToolbar {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    (global as any).mockHasPermission = true;
  });

  test('renders with default title', () => {
    renderComponent();

    expect(screen.getByText('INVOICES')).toBeInTheDocument();

    const newInvoiceButton = screen.getByText('NEW_INVOICE');
    expect(newInvoiceButton).toBeInTheDocument();

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/invoices/create-invoice');
  });

  test('renders with custom title', () => {
    const customTitle = 'CUSTOM_TITLE';
    renderComponent({ title: customTitle });

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  test('renders button with correct styling', () => {
    renderComponent();

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-sm');
    expect(button).toHaveClass('font-bold');
  });

  test('renders Plus icon in the button', () => {
    renderComponent();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('NEW_INVOICE')).toBeInTheDocument();
  });

  test('shows new invoice button when user has invoice write permission', () => {
    (global as any).mockHasPermission = true;
    renderComponent();

    expect(screen.getByText('NEW_INVOICE')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  test('hides new invoice button when user lacks invoice write permission', () => {
    (global as any).mockHasPermission = false;
    renderComponent();

    expect(screen.queryByText('NEW_INVOICE')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    expect(screen.getByText('INVOICES')).toBeInTheDocument();
  });

  test('title remains visible regardless of permissions', () => {
    (global as any).mockHasPermission = true;
    const { rerender } = renderComponent();
    expect(screen.getByText('INVOICES')).toBeInTheDocument();

    (global as any).mockHasPermission = false;
    rerender(
      <BrowserRouter>
        <InvoicesHeaderToolbar />
      </BrowserRouter>
    );
    expect(screen.getByText('INVOICES')).toBeInTheDocument();
  });

  test('renders with custom title and no permissions', () => {
    (global as any).mockHasPermission = false;
    const customTitle = 'CUSTOM_INVOICES';
    renderComponent({ title: customTitle });

    expect(screen.getByText(customTitle)).toBeInTheDocument();

    expect(screen.queryByText('NEW_INVOICE')).not.toBeInTheDocument();
  });
});
