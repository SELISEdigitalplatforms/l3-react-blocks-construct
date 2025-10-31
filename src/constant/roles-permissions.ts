export const MENU_PERMISSIONS = {
  // Role-based access
  ADMIN_ONLY: 'admin',

  // Feature-based permissions
  INVOICE_READ: 'invoice.read',
  INVOICE_WRITE: 'invoice.write',

  IAM_READ: 'iam.read',
  IAM_WRITE: 'iam.write',

  ACTIVITY_LOG_READ: 'activity.read',
  ACTIVITY_LOG_WRITE: 'activity.write',
} as const;
