import womenImage from 'assets/images/women_profile.webp';
import menImage from 'assets/images/men_profile.webp';

export enum InvoiceStatus {
  Draft = 'Draft',
  Paid = 'Paid',
  Pending = 'Pending',
  Overdue = 'Overdue',
}

export interface OrderItem {
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export const Categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'apparel', label: 'Apparel' },
];

export interface OrderDetails {
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  taxRate: number;
  discount?: number;
  totalAmount: number;
  note?: string;
}

export interface BillingInfo {
  address: string;
  email: string;
  phone: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerImg: string;
  dateIssued: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  currency: string;
  billingInfo: BillingInfo;
  orderDetails: OrderDetails;
}

export const statusColors: Record<InvoiceStatus, { text: string; border: string; bg: string }> = {
  [InvoiceStatus.Paid]: {
    text: 'text-success',
    border: 'border-success',
    bg: 'bg-success-background',
  },
  [InvoiceStatus.Pending]: {
    text: 'text-warning',
    border: 'border-warning',
    bg: 'bg-warning-background',
  },
  [InvoiceStatus.Overdue]: {
    text: 'text-error',
    border: 'border-error',
    bg: 'bg-error-background',
  },
  [InvoiceStatus.Draft]: {
    text: 'text-neutral',
    border: 'border-neutral',
    bg: 'bg-surface',
  },
};

export const invoiceData: Invoice[] = [
  {
    id: 'INV-10890',
    customerName: 'Luca Meier',
    customerImg: menImage,
    currency: 'CHF',
    dateIssued: '2025-02-03T00:00:00.000Z',
    amount: 146.85,
    dueDate: '2025-06-12T00:00:00.000Z',
    status: InvoiceStatus.Draft,
    billingInfo: {
      address: 'Via della Posta 15, 6600 Locarno, Switzerland',
      email: 'email@email.com',
      phone: '+41151515151',
    },
    orderDetails: {
      items: [
        {
          name: 'Monitor',
          description: 'Includes setup assistance and extended warranty coverage for 2 years.',
          category: 'Electronics',
          quantity: 2,
          unitPrice: 200.0,
          amount: 400.0,
        },
        {
          name: 'Monitor Arm',
          category: 'Accessories',
          quantity: 2,
          unitPrice: 20.0,
          amount: 80.0,
        },
        {
          name: 'Wireless Mouse',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 20.0,
          amount: 20.0,
        },
      ],
      subtotal: 500.0,
      taxes: 37.5,
      taxRate: 7.5,
      discount: 50.0,
      totalAmount: 146.85,
      note: 'All items will be delivered within 3-5 business days. Basic installation support is included.',
    },
  },
  {
    id: 'INV-10765',
    customerName: 'Adrian Müller',
    customerImg: menImage,
    currency: 'CHF',
    dateIssued: '2025-05-05T00:00:00.000Z',
    amount: 678.9,
    dueDate: '2025-06-18T00:00:00.000Z',
    status: InvoiceStatus.Paid,
    billingInfo: {
      address: 'Bahnhofstrasse 25, 8001 Zürich, Switzerland',
      email: 'adrian.mueller@email.com',
      phone: '+41152525252',
    },
    orderDetails: {
      items: [
        {
          name: 'Gaming Laptop',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 678.9,
          amount: 678.9,
        },
      ],
      subtotal: 678.9,
      taxes: 50.92,
      taxRate: 7.5,
      totalAmount: 678.9,
    },
  },
  {
    id: 'INV-10987',
    customerName: 'Sophie Meier',
    customerImg: womenImage,
    currency: 'CHF',
    dateIssued: '2025-02-22T00:00:00.000Z',
    amount: 215.5,
    dueDate: '2025-06-05T00:00:00.000Z',
    status: InvoiceStatus.Draft,
    billingInfo: {
      address: 'Rue du Rhône 68, 1204 Geneva, Switzerland',
      email: 'sophie.meier@email.com',
      phone: '+41153535353',
    },
    orderDetails: {
      items: [
        {
          name: 'Wireless Keyboard',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 215.5,
          amount: 215.5,
        },
      ],
      subtotal: 215.5,
      taxes: 16.16,
      taxRate: 7.5,
      totalAmount: 215.5,
    },
  },
  {
    id: 'INV-10543',
    customerName: 'Emma Weber',
    customerImg: womenImage,
    currency: 'CHF',
    dateIssued: '2025-04-18T00:00:00.000Z',
    amount: 829.3,
    dueDate: '2025-06-25T00:00:00.000Z',
    status: InvoiceStatus.Overdue,
    billingInfo: {
      address: 'Marktplatz 10, 4001 Basel, Switzerland',
      email: 'emma.weber@email.com',
      phone: '+41154545454',
    },
    orderDetails: {
      items: [
        {
          name: '4K Monitor',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 829.3,
          amount: 829.3,
        },
      ],
      subtotal: 829.3,
      taxes: 62.2,
      taxRate: 7.5,
      totalAmount: 829.3,
    },
  },
  {
    id: 'INV-10456',
    customerName: 'Julian Schmid',
    customerImg: menImage,
    currency: 'CHF',
    dateIssued: '2025-04-10T00:00:00.000Z',
    amount: 937.2,
    dueDate: '2025-06-15T00:00:00.000Z',
    status: InvoiceStatus.Overdue,
    billingInfo: {
      address: 'Bundesplatz 3, 3011 Bern, Switzerland',
      email: 'julian.schmid@email.com',
      phone: '+41155555555',
    },
    orderDetails: {
      items: [
        {
          name: 'Gaming PC',
          description: 'Custom built gaming PC with RTX 4080',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 937.2,
          amount: 937.2,
        },
      ],
      subtotal: 937.2,
      taxes: 70.29,
      taxRate: 7.5,
      totalAmount: 937.2,
    },
  },
  {
    id: 'INV-10234',
    customerName: 'Elena Baumann',
    customerImg: womenImage,
    currency: 'CHF',
    dateIssued: '2025-03-15T00:00:00.000Z',
    amount: 482.75,
    dueDate: '2025-06-10T00:00:00.000Z',
    status: InvoiceStatus.Pending,
    billingInfo: {
      address: 'St. Gallerstrasse 42, 9000 St. Gallen, Switzerland',
      email: 'elena.baumann@email.com',
      phone: '+41156565656',
    },
    orderDetails: {
      items: [
        {
          name: 'Office Chair',
          category: 'Furniture',
          quantity: 1,
          unitPrice: 482.75,
          amount: 482.75,
        },
      ],
      subtotal: 482.75,
      taxes: 36.21,
      taxRate: 7.5,
      totalAmount: 482.75,
    },
  },
  {
    id: 'INV-10321',
    customerName: 'Noah Huber',
    customerImg: menImage,
    currency: 'CHF',
    dateIssued: '2025-01-12T00:00:00.000Z',
    amount: 354.6,
    dueDate: '2025-06-30T00:00:00.000Z',
    status: InvoiceStatus.Pending,
    billingInfo: {
      address: 'Pilatusstrasse 15, 6003 Lucerne, Switzerland',
      email: 'noah.huber@email.com',
      phone: '+41157575757',
    },
    orderDetails: {
      items: [
        {
          name: 'Standing Desk',
          category: 'Furniture',
          quantity: 1,
          unitPrice: 354.6,
          amount: 354.6,
        },
      ],
      subtotal: 354.6,
      taxes: 26.6,
      taxRate: 7.5,
      totalAmount: 354.6,
    },
  },
  {
    id: 'INV-10678',
    customerName: 'Mia Fischer',
    customerImg: womenImage,
    currency: 'CHF',
    dateIssued: '2025-03-28T00:00:00.000Z',
    amount: 542.75,
    dueDate: '2025-07-15T00:00:00.000Z',
    status: InvoiceStatus.Paid,
    billingInfo: {
      address: 'Bahnhofplatz 5, 8400 Winterthur, Switzerland',
      email: 'mia.fischer@email.com',
      phone: '+41158585858',
    },
    orderDetails: {
      items: [
        {
          name: 'Laptop',
          description: 'Business laptop with docking station',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 542.75,
          amount: 542.75,
        },
      ],
      subtotal: 542.75,
      taxes: 40.71,
      taxRate: 7.5,
      totalAmount: 542.75,
    },
  },
  {
    id: 'INV-10789',
    customerName: 'Felix Schneider',
    customerImg: menImage,
    currency: 'CHF',
    dateIssued: '2025-05-17T00:00:00.000Z',
    amount: 876.3,
    dueDate: '2025-07-05T00:00:00.000Z',
    status: InvoiceStatus.Pending,
    billingInfo: {
      address: 'Seestrasse 89, 2502 Biel, Switzerland',
      email: 'felix.schneider@email.com',
      phone: '+41159595959',
    },
    orderDetails: {
      items: [
        {
          name: 'Workstation',
          description: 'Professional workstation setup',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 876.3,
          amount: 876.3,
        },
      ],
      subtotal: 876.3,
      taxes: 65.72,
      taxRate: 7.5,
      totalAmount: 876.3,
    },
  },
  {
    id: 'INV-10890',
    customerName: 'Laura Zimmermann',
    customerImg: womenImage,
    currency: 'CHF',
    dateIssued: '2025-01-25T00:00:00.000Z',
    amount: 328.45,
    dueDate: '2025-05-20T00:00:00.000Z',
    status: InvoiceStatus.Overdue,
    billingInfo: {
      address: 'Schaffhauserstrasse 30, 8200 Schaffhausen, Switzerland',
      email: 'laura.zimmermann@email.com',
      phone: '+41151010101',
    },
    orderDetails: {
      items: [
        {
          name: 'Printer',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 328.45,
          amount: 328.45,
        },
      ],
      subtotal: 328.45,
      taxes: 24.63,
      taxRate: 7.5,
      totalAmount: 328.45,
    },
  },
  {
    id: 'INV-10901',
    customerName: 'David Hoffmann',
    customerImg: menImage,
    currency: 'CHF',
    dateIssued: '2025-02-14T00:00:00.000Z',
    amount: 1245.6,
    dueDate: '2025-05-30T00:00:00.000Z',
    status: InvoiceStatus.Paid,
    billingInfo: {
      address: 'Centralstrasse 12, 6300 Zug, Switzerland',
      email: 'david.hoffmann@email.com',
      phone: '+41151111111',
    },
    orderDetails: {
      items: [
        {
          name: 'Server Equipment',
          description: 'Complete server rack setup',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 1245.6,
          amount: 1245.6,
        },
      ],
      subtotal: 1245.6,
      taxes: 93.42,
      taxRate: 7.5,
      totalAmount: 1245.6,
    },
  },
  {
    id: 'INV-10912',
    customerName: 'Sarah Wagner',
    customerImg: womenImage,
    currency: 'CHF',
    dateIssued: '2025-04-05T00:00:00.000Z',
    amount: 689.2,
    dueDate: '2025-07-10T00:00:00.000Z',
    status: InvoiceStatus.Draft,
    billingInfo: {
      address: 'Hauptstrasse 55, 5000 Aarau, Switzerland',
      email: 'sarah.wagner@email.com',
      phone: '+41151212121',
    },
    orderDetails: {
      items: [
        {
          name: 'Network Equipment',
          description: 'Enterprise networking setup',
          category: 'Electronics',
          quantity: 1,
          unitPrice: 689.2,
          amount: 689.2,
        },
      ],
      subtotal: 689.2,
      taxes: 51.69,
      taxRate: 7.5,
      totalAmount: 689.2,
    },
  },
];
