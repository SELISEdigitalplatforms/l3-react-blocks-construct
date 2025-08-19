export const MENU_PERMISSIONS = {
  // Feature-based permissions
  INVOICE_READ: 'invoice_read',
  MAIL_ACCESS: 'mail_access',
  FILES_READ: 'files_read',
  FILES_SHARED: 'files_shared',
  FILES_DELETE: 'files_delete',

  // Role-based access
  ADMIN_ONLY: 'admin',
  USER_ACCESS: ['user', 'admin'],
  ALL_AUTHENTICATED: ['user', 'admin', 'guest'],
} as const;
