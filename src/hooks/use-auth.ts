import { usePermissions } from './use-permissions';
import { MENU_PERMISSIONS } from 'config/roles-permissions';

export const useAuth = () => {
  const { hasRole, hasPermission, user, userRoles, userPermissions, isLoading } = usePermissions();

  const safeHasRole = (role: string | string[], requireAll?: boolean) => {
    if (isLoading || !user?.active) return false;
    return hasRole(role, requireAll);
  };

  const safeHasPermission = (permission: string | string[], requireAll?: boolean) => {
    if (isLoading || !user?.active) return false;
    return hasPermission(permission, requireAll);
  };

  return {
    hasRole: safeHasRole,
    hasPermission: safeHasPermission,

    isAdmin: !isLoading && user?.active && hasRole('admin'),
    isUser: !isLoading && user?.active && hasRole('user'),
    isGuest: !isLoading && user?.active && hasRole('guest'),

    canViewInvoices: !isLoading && user?.active && hasPermission(MENU_PERMISSIONS.INVOICE_READ),
    canEditInvoices: !isLoading && user?.active && hasPermission('invoice_write'),
    canDeleteInvoices: !isLoading && user?.active && hasPermission('invoice_delete'),

    user,
    isActive: user?.active || false,
    isVerified: user?.isVarified || false,
    isLoading,

    userRoles,
    userPermissions,
  };
};
