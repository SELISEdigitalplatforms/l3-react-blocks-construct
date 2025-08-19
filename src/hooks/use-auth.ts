import { usePermissions } from './use-permissions';

export const useAuth = () => {
  const { hasRole, hasPermission, user, userRoles, userPermissions } = usePermissions();

  return {
    hasRole,
    hasPermission,

    isAdmin: hasRole('admin'),
    isUser: hasRole('user'),
    isGuest: hasRole('guest'),

    canViewInvoices: hasPermission('invoice_read'),
    canEditInvoices: hasPermission('invoice_write'),
    canDeleteInvoices: hasPermission('invoice_delete'),

    user,
    isActive: user?.active || false,
    isVerified: user?.isVarified || false,

    userRoles,
    userPermissions,
  };
};
