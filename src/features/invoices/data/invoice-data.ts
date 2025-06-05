import womenImage from 'assets/images/women_profile.webp';
import menImage from 'assets/images/men_profile.webp';

export interface Invoice {
  id: string;
  customerName: string;
  customerImg: string;
  dateIssued: string;
  amount: number;
  dueDate: string;
  status: 'Draft' | 'Paid' | 'Pending' | 'Overdue';
}

export const invoiceData: Invoice[] = [
  {
    id: 'INV-10890',
    customerName: 'Luca Meier',
    customerImg: menImage,
    dateIssued: '2025-02-03T00:00:00.000Z',
    amount: 146.85,
    dueDate: '2025-06-12T00:00:00.000Z',
    status: 'Draft',
  },
  {
    id: 'INV-10765',
    customerName: 'Adrian Müller',
    customerImg: menImage,
    dateIssued: '2025-05-05T00:00:00.000Z',
    amount: 678.9,
    dueDate: '2025-06-18T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: 'INV-10987',
    customerName: 'Sophie Meier',
    customerImg: womenImage,
    dateIssued: '2025-02-22T00:00:00.000Z',
    amount: 215.5,
    dueDate: '2025-06-05T00:00:00.000Z',
    status: 'Draft',
  },
  {
    id: 'INV-10543',
    customerName: 'Emma Weber',
    customerImg: womenImage,
    dateIssued: '2025-04-18T00:00:00.000Z',
    amount: 829.3,
    dueDate: '2025-06-25T00:00:00.000Z',
    status: 'Overdue',
  },
  {
    id: 'INV-10456',
    customerName: 'Julian Schmid',
    customerImg: menImage,
    dateIssued: '2025-04-10T00:00:00.000Z',
    amount: 937.2,
    dueDate: '2025-06-15T00:00:00.000Z',
    status: 'Overdue',
  },
  {
    id: 'INV-10234',
    customerName: 'Elena Baumann',
    customerImg: womenImage,
    dateIssued: '2025-03-15T00:00:00.000Z',
    amount: 482.75,
    dueDate: '2025-06-10T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'INV-10321',
    customerName: 'Noah Huber',
    customerImg: menImage,
    dateIssued: '2025-01-12T00:00:00.000Z',
    amount: 354.6,
    dueDate: '2025-06-30T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'INV-10678',
    customerName: 'Mia Fischer',
    customerImg: womenImage,
    dateIssued: '2025-03-28T00:00:00.000Z',
    amount: 542.75,
    dueDate: '2025-07-15T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: 'INV-10789',
    customerName: 'Felix Schneider',
    customerImg: menImage,
    dateIssued: '2025-05-17T00:00:00.000Z',
    amount: 876.3,
    dueDate: '2025-07-05T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'INV-10890',
    customerName: 'Laura Zimmermann',
    customerImg: womenImage,
    dateIssued: '2025-01-25T00:00:00.000Z',
    amount: 328.45,
    dueDate: '2025-05-20T00:00:00.000Z',
    status: 'Overdue',
  },
  {
    id: 'INV-10901',
    customerName: 'David Hoffmann',
    customerImg: menImage,
    dateIssued: '2025-02-14T00:00:00.000Z',
    amount: 1245.6,
    dueDate: '2025-05-30T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: 'INV-10912',
    customerName: 'Sarah Wagner',
    customerImg: womenImage,
    dateIssued: '2025-04-05T00:00:00.000Z',
    amount: 689.2,
    dueDate: '2025-07-10T00:00:00.000Z',
    status: 'Draft',
  },
];
