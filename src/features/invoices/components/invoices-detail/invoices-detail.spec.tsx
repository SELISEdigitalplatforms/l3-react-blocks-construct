import { render, screen, fireEvent } from '@testing-library/react';
import { InvoicesDetail } from './invoices-detail';
import { InvoiceStatus } from '../../types/invoices.types';
import { renderWithProviders } from '@/test-utils/test-providers';
import { vi } from 'vitest';
import '../../../../test-utils/shared-test-utils';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/styles/theme/theme-provider', () => ({
  __esModule: true,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
    width: 800,
    height: 1200,
  }),
}));

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: vi.fn().mockReturnValue(210),
      },
    },
    addImage: vi.fn(),
    save: vi.fn(),
  })),
}));

vi.mock('@/components/core', async () => {
  const actual = await vi.importActual('@/components/core');

  return {
    ...actual,
    ConfirmationModal: ({
      open,
      onConfirm,
      title,
      description,
      confirmText = 'Confirm',
      onOpenChange,
    }: {
      open: boolean;
      onConfirm: () => void;
      title: string;
      description: string | React.ReactNode;
      confirmText?: string;
      onOpenChange?: (open: boolean) => void;
    }) =>
      open ? (
        <div role="alertdialog" data-testid="confirmation-modal">
          <h2>{title}</h2>
          <div>{description}</div>
          <button
            onClick={() => {
              onConfirm?.();
              onOpenChange?.(false);
            }}
            data-testid="confirm-button"
          >
            {confirmText}
          </button>
          <button onClick={() => onOpenChange?.(false)}>Cancel</button>
        </div>
      ) : null,
  };
});

vi.mock('hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
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

vi.mock('assets/images/construct_logo_dark.svg', () => ({
  default: 'mock-logo-path',
}));
vi.mock('assets/images/construct_logo_light.svg', () => ({
  default: 'mock-logo-path',
}));

describe('InvoicesDetail', () => {
  const mockInvoice = {
    ItemId: 'INV-001',
    Customer: [
      {
        CustomerName: 'Test Customer',
        BillingAddress: 'Test Address',
        Email: 'test@example.com',
        PhoneNo: '+41123456789',
      },
    ],
    DateIssued: '2025-06-01T00:00:00.000Z',
    DueDate: '2025-06-15T00:00:00.000Z',
    Amount: 1000,
    Status: InvoiceStatus.PAID,
    Currency: 'CHF',
    GeneralNote: 'Test Note',
    ItemDetails: [
      {
        ItemId: 'ITEM-001',
        ItemName: 'Test Item',
        Note: 'Test Description',
        Category: 'Test Category',
        Quantity: 2,
        UnitPrice: 500,
        Amount: 1000,
        Taxes: 0,
        Discount: 0,
      },
    ],
    Subtotal: 1000,
    Taxes: 0,
    TotalAmount: 1000,
  };

  beforeEach(() => {
    (global as any).mockHasPermission = true;
  });

  test('renders invoice details correctly', () => {
    renderWithProviders(<InvoicesDetail invoice={mockInvoice} />);

    expect(screen.getAllByText('INV-001').length).toBeGreaterThan(0);

    expect(screen.getByText('Test Customer')).toBeInTheDocument();

    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('+41123456789')).toBeInTheDocument();

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const currencySpans = screen.getAllByText('CHF');

    const amount500 = screen.getByText('500');
    const amount1000 = screen.getByText('1000');

    expect(currencySpans.length).toBeGreaterThan(0);
    expect(amount500).toBeInTheDocument();
    expect(amount1000).toBeInTheDocument();

    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  test('renders in preview mode correctly', () => {
    render(<InvoicesDetail invoice={mockInvoice} isPreview={true} />);

    expect(screen.queryByText('DOWNLOAD')).not.toBeInTheDocument();
    expect(screen.queryByText('EDIT')).not.toBeInTheDocument();
    expect(screen.queryByText('SEND')).not.toBeInTheDocument();

    expect(screen.getAllByText('INV-001').length).toBeGreaterThan(0);
  });

  test('shows send dialog when send button is clicked', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    // The buttons should be: back, download, edit, send (index 3)
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons[3]; // Index 3 should be the send button

    expect(sendButton).toBeInTheDocument();
    if (sendButton) {
      fireEvent.click(sendButton);
    }

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('SEND_INVOICE')).toBeInTheDocument();
  });

  test('handles send confirmation correctly', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    // Use the same approach as the previous test
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons[3]; // Index 3 should be the send button

    if (sendButton) {
      fireEvent.click(sendButton);
    }

    fireEvent.click(screen.getByTestId('confirm-button'));

    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
  });

  test('renders status badge with correct styling', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    const badges = screen.getAllByText('Paid');
    expect(badges.length).toBeGreaterThan(0);
    expect(badges.some((badge) => badge.className.includes('text-success'))).toBe(true);
  });

  test('shows edit button when user has invoice write permission', () => {
    (global as any).mockHasPermission = true;
    render(<InvoicesDetail invoice={mockInvoice} />);

    expect(screen.getByText('EDIT')).toBeInTheDocument();
  });

  test('shows all action buttons when user has permissions', () => {
    (global as any).mockHasPermission = true;
    render(<InvoicesDetail invoice={mockInvoice} />);

    expect(screen.getByText('DOWNLOAD')).toBeInTheDocument();
    expect(screen.getByText('EDIT')).toBeInTheDocument();
    expect(screen.getByText('SEND')).toBeInTheDocument();
  });
});
