import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoicesDetail } from './invoices-detail';
import { InvoiceStatus } from '../../types/invoices.types';

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

jest.mock('styles/theme/theme-provider', () => ({
  __esModule: true,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
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

jest.mock('assets/images/construct_logo_dark.svg', () => 'mock-logo-path');
jest.mock('assets/images/construct_logo_light.svg', () => 'mock-logo-path');

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
    render(<InvoicesDetail invoice={mockInvoice} />);

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

    const sendButton = screen.getByText('SEND');
    expect(sendButton).toBeInTheDocument();

    fireEvent.click(sendButton);

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('SEND_INVOICE')).toBeInTheDocument();
  });

  test('handles send confirmation correctly', () => {
    render(<InvoicesDetail invoice={mockInvoice} />);

    fireEvent.click(screen.getByText('SEND'));

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

  test('hides edit button when user lacks invoice write permission', () => {
    (global as any).mockHasPermission = false;
    render(<InvoicesDetail invoice={mockInvoice} />);

    expect(screen.queryByText('EDIT')).not.toBeInTheDocument();

    expect(screen.getByText('DOWNLOAD')).toBeInTheDocument();
    expect(screen.getByText('SEND')).toBeInTheDocument();
  });

  test('shows all action buttons when user has permissions', () => {
    (global as any).mockHasPermission = true;
    render(<InvoicesDetail invoice={mockInvoice} />);

    expect(screen.getByText('DOWNLOAD')).toBeInTheDocument();
    expect(screen.getByText('EDIT')).toBeInTheDocument();
    expect(screen.getByText('SEND')).toBeInTheDocument();
  });
});
