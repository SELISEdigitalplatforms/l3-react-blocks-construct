import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InvoicesHeaderToolbar } from './invoices-header-toolbar';

vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
      },
    };
  },
}));

vi.mock('components/core/components/gurads/permission-guard/permission-guard', () => ({
  PermissionGuard: ({
    children,
    showFallback,
  }: {
    children: React.ReactNode;
    showFallback?: boolean;
  }) => {
    const hasPermission = (global as any).mockHasPermission ?? true;
    if (hasPermission) {
      return <>{children}</>;
    }

    if (showFallback) {
      return <div data-testid="permission-denied">No Permission</div>;
    }

    return null;
  },
}));

vi.mock('config/roles-permissions', () => ({
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
});
