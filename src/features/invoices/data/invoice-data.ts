export interface Invoice {
  id: string;
  customer: {
    name: string;
    avatar: string;
  };
  dateIssued: string;
  amount: number;
  dueDate: string;
  status: 'Draft' | 'Paid' | 'Pending' | 'Overdue';
}

export const invoiceData: Invoice[] = [
  {
    id: 'INV-10890',
    customer: {
      name: 'Luca Meier',
      avatar: '/avatars/avatar-1.png',
    },
    dateIssued: '2025-02-03T00:00:00.000Z',
    amount: 146.85,
    dueDate: '2025-06-12T00:00:00.000Z',
    status: 'Draft',
  },
  {
    id: 'INV-10765',
    customer: {
      name: 'Adrian Müller',
      avatar: '/avatars/avatar-2.png',
    },
    dateIssued: '2025-05-05T00:00:00.000Z',
    amount: 678.9,
    dueDate: '2025-06-18T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: 'INV-10987',
    customer: {
      name: 'Sophie Meier',
      avatar: '/avatars/avatar-3.png',
    },
    dateIssued: '2025-02-22T00:00:00.000Z',
    amount: 215.5,
    dueDate: '2025-06-05T00:00:00.000Z',
    status: 'Draft',
  },
  {
    id: 'INV-10543',
    customer: {
      name: 'Emma Weber',
      avatar: '/avatars/avatar-4.png',
    },
    dateIssued: '2025-04-18T00:00:00.000Z',
    amount: 829.3,
    dueDate: '2025-06-25T00:00:00.000Z',
    status: 'Overdue',
  },
  {
    id: 'INV-10456',
    customer: {
      name: 'Julian Schmid',
      avatar: '/avatars/avatar-5.png',
    },
    dateIssued: '2025-04-10T00:00:00.000Z',
    amount: 937.2,
    dueDate: '2025-06-15T00:00:00.000Z',
    status: 'Overdue',
  },
  {
    id: 'INV-10234',
    customer: {
      name: 'Elena Baumann',
      avatar: '/avatars/avatar-6.png',
    },
    dateIssued: '2025-03-15T00:00:00.000Z',
    amount: 482.75,
    dueDate: '2025-06-10T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'INV-10321',
    customer: {
      name: 'Noah Huber',
      avatar: '/avatars/avatar-7.png',
    },
    dateIssued: '2025-01-12T00:00:00.000Z',
    amount: 354.6,
    dueDate: '2025-06-30T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'INV-10678',
    customer: {
      name: 'Mia Fischer',
      avatar: '/avatars/avatar-8.png',
    },
    dateIssued: '2025-03-28T00:00:00.000Z',
    amount: 542.75,
    dueDate: '2025-07-15T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: 'INV-10789',
    customer: {
      name: 'Felix Schneider',
      avatar: '/avatars/avatar-9.png',
    },
    dateIssued: '2025-05-17T00:00:00.000Z',
    amount: 876.3,
    dueDate: '2025-07-05T00:00:00.000Z',
    status: 'Pending',
  },
  {
    id: 'INV-10890',
    customer: {
      name: 'Laura Zimmermann',
      avatar: '/avatars/avatar-10.png',
    },
    dateIssued: '2025-01-25T00:00:00.000Z',
    amount: 328.45,
    dueDate: '2025-05-20T00:00:00.000Z',
    status: 'Overdue',
  },
  {
    id: 'INV-10901',
    customer: {
      name: 'David Hoffmann',
      avatar: '/avatars/avatar-11.png',
    },
    dateIssued: '2025-02-14T00:00:00.000Z',
    amount: 1245.6,
    dueDate: '2025-05-30T00:00:00.000Z',
    status: 'Paid',
  },
  {
    id: 'INV-10912',
    customer: {
      name: 'Sarah Wagner',
      avatar: '/avatars/avatar-12.png',
    },
    dateIssued: '2025-04-05T00:00:00.000Z',
    amount: 689.2,
    dueDate: '2025-07-10T00:00:00.000Z',
    status: 'Draft',
  },
];
