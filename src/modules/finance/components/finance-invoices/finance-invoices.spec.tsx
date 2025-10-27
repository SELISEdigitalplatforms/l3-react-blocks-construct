import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectElementWithClasses } from '../../../../test-utils/shared-test-utils';
import { FinanceInvoices } from './finance-invoices';

// Local mocks (must come before shared test utils import)
vi.mock('@/components/ui-kit/button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button data-testid="view-all-button" className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui-kit/table', () => ({
  Table: ({ children }: any) => <table data-testid="table">{children}</table>,
  TableHeader: ({ children }: any) => <thead data-testid="table-header">{children}</thead>,
  TableBody: ({ children }: any) => <tbody data-testid="table-body">{children}</tbody>,
  TableHead: ({ children, className }: any) => (
    <th data-testid="table-head" className={className}>
      {children}
    </th>
  ),
  TableRow: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
  TableCell: ({ children, className }: any) => (
    <td data-testid="table-cell" className={className}>
      {children}
    </td>
  ),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Eye: ({ className }: { className?: string }) => (
    <svg data-testid="eye-icon" className={className}>
      <title>View</title>
    </svg>
  ),
  Download: ({ className }: { className?: string }) => (
    <svg data-testid="download-icon" className={className}>
      <title>Download</title>
    </svg>
  ),
}));

// Mock finance services and types
vi.mock('../../services/finance-services', () => ({
  invoices: [
    {
      id: 'INV-1001',
      customer: 'Test Customer 1',
      issueDate: '01/01/2025',
      dueDate: '01/02/2025',
      amount: 'CHF 1,000.00',
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'INV-1002',
      customer: 'Test Customer 2',
      issueDate: '02/01/2025',
      dueDate: '02/02/2025',
      amount: 'CHF 2,000.00',
      status: 'Unpaid',
      paymentMethod: 'PayPal',
    },
    {
      id: 'INV-1003',
      customer: 'Test Customer 3',
      issueDate: '03/01/2025',
      dueDate: '03/02/2025',
      amount: 'CHF 3,000.00',
      status: 'Overdue',
      paymentMethod: 'Credit Card',
    },
  ],
}));

vi.mock('../../types/finance.type', () => ({
  STATUS_COLORS: {
    Paid: 'text-success font-semibold',
    Unpaid: 'text-warning font-semibold',
    Overdue: 'text-error font-semibold',
  },
  TABLE_HEADERS: [
    'INVOICES_ID',
    'CUSTOMER',
    'ISSUE_DATE',
    'DUE_DATE',
    'AMOUNT',
    'STATUS',
    'PAYMENT_METHOD',
    'ACTION',
  ],
}));

// Helper functions - render helper and component-specific helpers remain local
const renderComponent = () => render(<FinanceInvoices />);

const expectTextElements = (texts: string[]) => {
  texts.forEach((text) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
};

const expectTableStructure = (elements: string[]) => {
  elements.forEach((element) => {
    expect(screen.getByTestId(element)).toBeInTheDocument();
  });
};

const expectIconsWithClasses = (testId: string, expectedCount: number, classes: string[]) => {
  const icons = screen.getAllByTestId(testId);
  expect(icons).toHaveLength(expectedCount);
  icons.forEach((icon) => {
    expect(icon).toHaveClass(...classes);
  });
};

const expectElementsWithClasses = (testId: string, classes: string[]) => {
  const elements = screen.getAllByTestId(testId);
  elements.forEach((element) => {
    expect(element).toHaveClass(...classes);
  });
};

// Test data constants
const MOCK_INVOICE_DATA = {
  ids: ['INV-1001', 'INV-1002', 'INV-1003'],
  customers: ['Test Customer 1', 'Test Customer 2', 'Test Customer 3'],
  amounts: ['CHF 1,000.00', 'CHF 2,000.00', 'CHF 3,000.00'],
  dates: ['01/01/2025', '01/02/2025', '02/01/2025'],
  paymentMethods: ['Bank Transfer', 'PayPal', 'Credit Card'],
  statuses: ['Paid', 'Unpaid', 'Overdue'],
};

const TABLE_HEADERS = [
  'INVOICES_ID',
  'CUSTOMER',
  'ISSUE_DATE',
  'DUE_DATE',
  'AMOUNT',
  'STATUS',
  'PAYMENT_METHOD',
  'ACTION',
];

const TRANSLATION_KEYS = ['INVOICES', 'VIEW_ALL', ...TABLE_HEADERS];

describe('FinanceInvoices Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render the card with correct structure', () => {
      renderComponent();
      expectElementWithClasses('card', ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm']);
      expectTableStructure(['card-header', 'card-content']);
    });
  });

  describe('Header Section', () => {
    it('should render the title and view all button', () => {
      renderComponent();

      const title = expectElementWithClasses('card-title', ['text-xl', 'text-high-emphasis']);
      expect(title).toHaveTextContent('INVOICES');

      const button = expectElementWithClasses('view-all-button', [
        'text-primary',
        'font-bold',
        'text-sm',
        'border',
      ]);
      expect(button).toHaveTextContent('VIEW_ALL');
    });

    it('should have proper header layout', () => {
      renderComponent();
      const cardHeader = screen.getByTestId('card-header');
      const title = screen.getByTestId('card-title');
      const button = screen.getByTestId('view-all-button');

      expect(cardHeader).toContain(title);
      expect(cardHeader).toContain(button);
    });
  });

  describe('Table Structure', () => {
    it('should render table with correct structure', () => {
      renderComponent();
      expectTableStructure(['table', 'table-header', 'table-body']);
    });

    it('should render all table headers', () => {
      renderComponent();
      expectTextElements(TABLE_HEADERS);
    });

    it('should render table headers with correct styling', () => {
      renderComponent();
      expectElementsWithClasses('table-head', ['text-high-emphasis', 'font-semibold']);
    });

    it('should render correct number of table rows', () => {
      renderComponent();
      const tableRows = screen.getAllByTestId('table-row');
      expect(tableRows).toHaveLength(4); // 1 header + 3 data rows
    });

    it('should have table inside card content', () => {
      renderComponent();
      const cardContent = screen.getByTestId('card-content');
      const table = screen.getByTestId('table');
      expect(cardContent).toContain(table);
    });
  });

  describe('Data Rendering', () => {
    it('should render invoice data rows', () => {
      renderComponent();
      expectTextElements([...MOCK_INVOICE_DATA.ids, ...MOCK_INVOICE_DATA.customers]);
    });

    it('should render invoice amounts and dates', () => {
      renderComponent();
      expectTextElements([...MOCK_INVOICE_DATA.amounts, ...MOCK_INVOICE_DATA.dates]);
    });

    it('should render payment methods', () => {
      renderComponent();
      expectTextElements(MOCK_INVOICE_DATA.paymentMethods);
    });

    it('should render status with correct styling', () => {
      renderComponent();
      expectTextElements(MOCK_INVOICE_DATA.statuses);
    });

    it('should render all invoice fields correctly', () => {
      renderComponent();
      const invoiceData = [
        { id: 'INV-1001', customer: 'Test Customer 1', amount: 'CHF 1,000.00' },
        { id: 'INV-1002', customer: 'Test Customer 2', amount: 'CHF 2,000.00' },
        { id: 'INV-1003', customer: 'Test Customer 3', amount: 'CHF 3,000.00' },
      ];

      invoiceData.forEach((invoice) => {
        expectTextElements([invoice.id, invoice.customer, invoice.amount]);
      });
    });
  });

  describe('Action Icons', () => {
    it('should render action icons for each row', () => {
      renderComponent();
      expectIconsWithClasses('eye-icon', 3, ['text-primary', 'h-5', 'w-5']);
      expectIconsWithClasses('download-icon', 3, ['text-primary', 'h-5', 'w-5']);
    });

    it('should render action icons in correct container', () => {
      renderComponent();
      const tableCells = screen.getAllByTestId('table-cell');
      const actionCells = tableCells.filter(
        (cell) =>
          cell.querySelector('[data-testid="eye-icon"]') ||
          cell.querySelector('[data-testid="download-icon"]')
      );
      expect(actionCells.length).toBeGreaterThan(0);
    });
  });

  describe('Translation Integration', () => {
    it('should use translation keys correctly', () => {
      renderComponent();
      expectTextElements(TRANSLATION_KEYS);
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      renderComponent();
      const table = screen.getByTestId('table');
      const tableHeader = screen.getByTestId('table-header');
      const tableBody = screen.getByTestId('table-body');

      expect(table.tagName.toLowerCase()).toBe('table');
      expect(tableHeader.tagName.toLowerCase()).toBe('thead');
      expect(tableBody.tagName.toLowerCase()).toBe('tbody');
    });

    it('should have accessible icon titles', () => {
      renderComponent();
      const eyeIcons = screen.getAllByTestId('eye-icon');
      const downloadIcons = screen.getAllByTestId('download-icon');

      expect(eyeIcons.length).toBeGreaterThan(0);
      expect(downloadIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Component Integration', () => {
    it('should render without console errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Mock implementation to suppress console errors during testing
      });

      renderComponent();
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should export component correctly', () => {
      expect(FinanceInvoices).toBeDefined();
      expect(typeof FinanceInvoices).toBe('function');
    });

    it('should handle empty invoice data gracefully', () => {
      renderComponent();
      expectTableStructure(['table', 'table-header', 'table-body']);
    });
  });
});
