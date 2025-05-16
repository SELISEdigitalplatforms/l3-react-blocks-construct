import { MenuItem } from '../models/sidebar';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'DASHBOARD',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'finance',
    name: 'FINANCE',
    path: '/finance',
    icon: 'ChartNoAxesCombined',
  },
  {
    id: 'iam',
    name: 'IAM',
    path: '/identity-management',
    icon: 'Users',
    isIntegrated: true,
  },
  {
    id: 'inventory',
    name: 'INVENTORY',
    path: '/inventory',
    icon: 'Store',
  },
  {
    id: 'mail',
    name: 'MAIL',
    path: '/mail/inbox',
    icon: 'Inbox',
  },
  {
    id: 'calendar',
    name: 'CALENDAR',
    path: '/calendar',
    icon: 'Calendar',
  },
  {
    id: 'activity-log',
    name: 'ACTIVITY_LOG',
    path: '/activity-log',
    icon: 'FileClock',
  },
  {
    id: 'timeline',
    name: 'TIMELINE',
    path: '/timeline',
    icon: 'History',
  },
  {
    id: 'task-manager',
    name: 'TASK_MANAGER',
    path: '/task-manager',
    icon: 'Presentation',
  },
  {
    id: '404',
    name: 'ERROR_404',
    path: '/404',
    icon: 'SearchX',
  },
  {
    id: '503',
    name: 'ERROR_503',
    path: '/503',
    icon: 'TriangleAlert',
  },
];
