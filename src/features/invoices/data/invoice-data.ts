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
    dateIssued: '03.02.2025',
    amount: 146.85,
    dueDate: '12.06.2025',
    status: 'Draft',
  },
  {
    id: 'INV-10765',
    customer: {
      name: 'Adrian Müller',
      avatar: '/avatars/avatar-2.png',
    },
    dateIssued: '05.05.2025',
    amount: 678.9,
    dueDate: '18.06.2025',
    status: 'Paid',
  },
  {
    id: 'INV-10987',
    customer: {
      name: 'Sophie Meier',
      avatar: '/avatars/avatar-3.png',
    },
    dateIssued: '22.02.2025',
    amount: 215.5,
    dueDate: '05.06.2025',
    status: 'Draft',
  },
  {
    id: 'INV-10543',
    customer: {
      name: 'Emma Weber',
      avatar: '/avatars/avatar-4.png',
    },
    dateIssued: '18.04.2025',
    amount: 829.3,
    dueDate: '25.06.2025',
    status: 'Overdue',
  },
  {
    id: 'INV-10456',
    customer: {
      name: 'Julian Schmid',
      avatar: '/avatars/avatar-5.png',
    },
    dateIssued: '10.04.2025',
    amount: 937.2,
    dueDate: '15.06.2025',
    status: 'Overdue',
  },
  {
    id: 'INV-10234',
    customer: {
      name: 'Elena Baumann',
      avatar: '/avatars/avatar-6.png',
    },
    dateIssued: '15.03.2025',
    amount: 482.75,
    dueDate: '10.06.2025',
    status: 'Pending',
  },
  {
    id: 'INV-10321',
    customer: {
      name: 'Noah Huber',
      avatar: '/avatars/avatar-7.png',
    },
    dateIssued: '12.01.2025',
    amount: 354.6,
    dueDate: '30.06.2025',
    status: 'Pending',
  },
];
