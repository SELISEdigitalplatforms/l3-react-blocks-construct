import { useMemo } from 'react';
import { useAuthStore } from '.';

type UseIsProtectedOptions = {
  roles?: string[];
  permissions?: string[];
  opt?: 'all' | 'any';
};

const checkAllRoles = (userRoles: string[] | undefined, requiredRoles: string[]): boolean => {
  if (requiredRoles.length === 0) return true;
  return requiredRoles.every((role) => userRoles?.includes(role));
};

const checkAllPermissions = (
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean => {
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.every((permission) => userPermissions?.includes(permission));
};

const checkAnyRole = (userRoles: string[] | undefined, requiredRoles: string[]): boolean => {
  if (requiredRoles.length === 0) return false;
  return requiredRoles.some((role) => userRoles?.includes(role));
};

const checkAnyPermission = (
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean => {
  if (requiredPermissions.length === 0) return false;
  return requiredPermissions.some((permission) => userPermissions?.includes(permission));
};

export const useIsProtected = ({
  roles = [],
  permissions = [],
  opt = 'any',
}: UseIsProtectedOptions = {}) => {
  const { user, isAuthenticated } = useAuthStore();

  const isProtected = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    if (roles.length === 0 && permissions.length === 0) return false;

    if (opt === 'all') {
      const hasAllRoles = checkAllRoles(user.roles, roles);
      const hasAllPermissions = checkAllPermissions(user.permissions, permissions);
      return hasAllRoles && hasAllPermissions;
    }

    const hasAnyRole = checkAnyRole(user.roles, roles);
    const hasAnyPermission = checkAnyPermission(user.permissions, permissions);
    return hasAnyRole || hasAnyPermission;
  }, [isAuthenticated, user, roles, permissions, opt]);

  return {
    isProtected,
    isAuthenticated,
    user,
  };
};
