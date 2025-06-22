import { MenuItem } from '../models/sidebar';

const createMenuItem = (
  id: string,
  name: string,
  path: string,
  icon?: MenuItem['icon'],
  options: Partial<Omit<MenuItem, 'id' | 'name' | 'path' | 'icon'>> = {}
): MenuItem => ({
  id,
  name,
  path,
  icon,
  ...options,
});

const createMenuItemWithChildren = (
  id: string,
  name: string,
  path: string,
  icon: MenuItem['icon'],
  children: MenuItem[],
  options: Partial<Omit<MenuItem, 'id' | 'name' | 'path' | 'icon' | 'children'>> = {}
): MenuItem => ({
  id,
  name,
  path,
  icon,
  children,
  ...options,
});

export const menuItems: MenuItem[] = [
  createMenuItem('dashboard', 'DASHBOARD', '/dashboard', 'LayoutDashboard'),
  createMenuItem('finance', 'FINANCE', '/finance', 'ChartNoAxesCombined'),
  createMenuItem('iam', 'IAM', '/identity-management', 'Users', { isIntegrated: true }),
  createMenuItem('inventory', 'INVENTORY', '/inventory', 'Store'),
  createMenuItem('mail', 'MAIL', '/mail/inbox', 'Inbox'),
  createMenuItem('calendar', 'CALENDAR', '/calendar', 'Calendar'),
  createMenuItem('activity-log', 'ACTIVITY_LOG', '/activity-log', 'FileClock'),
  createMenuItem('timeline', 'TIMELINE', '/timeline', 'History'),
  createMenuItem('task-manager', 'TASK_MANAGER', '/task-manager', 'Presentation'),
  createMenuItem('chat', 'CHAT', '/chat', 'MessageSquareText'),
  createMenuItem('invoices', 'INVOICES', '/invoices', 'ReceiptText'),
  createMenuItemWithChildren(
    'file-manager',
    'FILE_MANAGER',
    '/file-manager',
    'Folder',

    [
      createMenuItem('my-files', 'MY_FILES', '/file-manager/my-files'),
      createMenuItem('shared-files', 'SHARED_WITH_ME', '/file-manager/shared-files'),
      createMenuItem('trash', 'TRASH', '/file-manager/trash'),
    ]
  ),
  createMenuItem('404', 'ERROR_404', '/404', 'SearchX'),
  createMenuItem('503', 'ERROR_503', '/503', 'TriangleAlert'),
];
