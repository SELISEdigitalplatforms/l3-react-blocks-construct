import { useContext, useMemo } from 'react';
import { PermissionsContext } from '@/context/permissions-context';
import { User } from '@/types/user.type';

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const usePermissionsLogic = (user: User | null | undefined, isLoading = false) => {
  const userRoles = useMemo(() => user?.roles || [], [user]);
  const userPermissions = useMemo(() => user?.permissions || [], [user]);

  const hasRole = useMemo(
    () =>
      (role: string | string[], requireAll = false): boolean => {
        if (!user || isLoading || !user.active) return false;

        const rolesToCheck = Array.isArray(role) ? role : [role];

        if (requireAll) {
          return rolesToCheck.every((r) => userRoles.includes(r));
        } else {
          return rolesToCheck.some((r) => userRoles.includes(r));
        }
      },
    [user, userRoles, isLoading]
  );

  const hasPermission = useMemo(
    () =>
      (permission: string | string[], requireAll = false): boolean => {
        if (!user || isLoading || !user.active) return false;

        const permissionsToCheck = Array.isArray(permission) ? permission : [permission];

        if (requireAll) {
          return permissionsToCheck.every((p) => userPermissions.includes(p));
        } else {
          return permissionsToCheck.some((p) => userPermissions.includes(p));
        }
      },
    [user, userPermissions, isLoading]
  );

  return {
    hasRole,
    hasPermission,
    userRoles,
    userPermissions,
  };
};
