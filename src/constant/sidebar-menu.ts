import { MenuItem } from '../models/sidebar';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
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
    name: 'Inventory',
    path: '/inventory',
    icon: 'Store',
  },
  {
    id: 'mail',
    name: 'Mail',
    path: '/mail/inbox',
    icon: 'Inbox',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
  },
  {
    id: 'activity-log',
    name: 'Activity log',
    path: '/activity-log',
    icon: 'FileClock',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    path: '/timeline',
    icon: 'History',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    path: '/task-manager',
    icon: 'Presentation',
  },
];
