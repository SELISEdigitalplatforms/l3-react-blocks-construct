import { usePermissions } from './use-permissions';

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

    user,
    isActive: user?.active || false,
    isVerified: user?.isVarified || false,
    isLoading,

    userRoles,
    userPermissions,
  };
};
