import { useMemo } from 'react';
import { MenuItem } from '../models/sidebar';
import { useAuth } from './use-auth';

export const useFilteredMenu = (menuItems: MenuItem[]): MenuItem[] => {
  const { hasRole, hasPermission } = useAuth();

  const filterMenuItem = (item: MenuItem): MenuItem | null => {
    // If item has no restrictions at all, allow it
    if (!item.roles && !item.permissions) {
      return { ...item };
    }

    // Check roles only if specified
    const hasRequiredRoles = item.roles ? hasRole(item.roles, item.requireAllRoles) : true;

    // Check permissions only if specified
    const hasRequiredPermissions = item.permissions
      ? hasPermission(item.permissions, item.requireAllPermissions)
      : true;

    // Apply logic based on what's required
    let hasAccess = false;

    if (item.roles && item.permissions) {
      // Both roles AND permissions are specified
      hasAccess = item.requireBoth
        ? hasRequiredRoles && hasRequiredPermissions // Need BOTH
        : hasRequiredRoles || hasRequiredPermissions; // Need EITHER
    } else if (item.roles) {
      // Only roles specified
      hasAccess = hasRequiredRoles;
    } else if (item.permissions) {
      // Only permissions specified
      hasAccess = hasRequiredPermissions;
    }

    if (!hasAccess) return null;

    // Filter children recursively
    const filteredChildren = item.children
      ? (item.children.map(filterMenuItem).filter(Boolean) as MenuItem[])
      : undefined;

    if (
      item.children &&
      item.children.length > 0 &&
      (!filteredChildren || filteredChildren.length === 0)
    ) {
      return null;
    }

    return {
      ...item,
      children: filteredChildren,
    };
  };

  return useMemo(
    () => menuItems.map(filterMenuItem).filter(Boolean) as MenuItem[],
    [menuItems, hasRole, hasPermission]
  );
};
