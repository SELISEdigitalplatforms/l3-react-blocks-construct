import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { InvoicesHeaderToolbar } from './invoices-header-toolbar';
import {
  setMockPermission,
  resetMockPermission,
  expectElementToHaveClasses,
} from '../../../../lib/utils/test-utils/shared-test-utils';

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
  MENU_PERMISSIONS: { INVOICE_WRITE: 'invoice:write' },
}));

const expectNewInvoiceButton = () => {
  expect(screen.getByText('NEW_INVOICE')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/invoices/create-invoice');
};

describe('InvoicesHeaderToolbar', () => {
  beforeEach(() => {
    resetMockPermission();
    render(
      <BrowserRouter>
        <InvoicesHeaderToolbar />
      </BrowserRouter>
    );
  });

  test('renders with default title and new invoice button', () => {
    expect(screen.getByText('INVOICES')).toBeInTheDocument();
    expectNewInvoiceButton();
    expectElementToHaveClasses(screen.getByRole('button'), 'text-sm', 'font-bold');
  });

  test('renders with custom title', () => {
    render(
      <BrowserRouter>
        <InvoicesHeaderToolbar title="CUSTOM_TITLE" />
      </BrowserRouter>
    );
    expect(screen.getByText('CUSTOM_TITLE')).toBeInTheDocument();
  });

  test('title remains visible regardless of permissions', () => {
    expect(screen.getAllByText('INVOICES')[0]).toBeInTheDocument();

    setMockPermission(false);
    expect(screen.getAllByText('INVOICES')[0]).toBeInTheDocument();
  });
});
