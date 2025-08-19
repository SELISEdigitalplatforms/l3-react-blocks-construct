export const MENU_PERMISSIONS = {
  // Role-based access
  ADMIN_ONLY: 'admin',
  USER_ACCESS: ['user', 'admin'],
  ALL_AUTHENTICATED: ['user', 'admin', 'guest'],

  // Feature-based permissions
  INVOICE_READ: 'invoice_read',
  INVOICE_WRITE: 'invoice_write',
} as const;
