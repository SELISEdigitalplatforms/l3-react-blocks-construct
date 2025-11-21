import { useMemo } from 'react';
import { useAuthStore } from '.';

type UseIsProtectedOptions = {
  roles?: string[];
  permissions?: string[];
  opt?: 'all' | 'any';
};

export const useIsProtected = ({
  roles = [],
  permissions = [],
  opt = 'any',
}: UseIsProtectedOptions = {}) => {
  const { user, isAuthenticated } = useAuthStore();

  const isProtected = useMemo(() => {
    if (!isAuthenticated || !user) return false;

    // If no roles or permissions specified, grant access
    if (roles.length === 0 && permissions.length === 0) return false;

    if (opt === 'all') {
      // User must have ALL specified roles AND permissions
      if (roles.length > 0) {
        const hasAllRoles = roles.every((role) => user.roles?.includes(role));
        if (!hasAllRoles) return false;
      }
      if (permissions.length > 0) {
        const hasAllPermissions = permissions.every((permission) =>
          user.permissions?.includes(permission)
        );
        if (!hasAllPermissions) return false;
      }
      return true;
    } else {
      // User must have ANY of the specified roles OR permissions
      if (roles.length > 0) {
        const hasAnyRole = roles.some((role) => user.roles?.includes(role));
        if (hasAnyRole) return true;
      }
      if (permissions.length > 0) {
        const hasAnyPermission = permissions.some((permission) =>
          user.permissions?.includes(permission)
        );
        if (hasAnyPermission) return true;
      }
      return false;
    }
  }, [isAuthenticated, user, roles, permissions, opt]);

  return {
    isProtected,
    isAuthenticated,
    user,
  };
};
