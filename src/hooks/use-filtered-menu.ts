import { useMemo } from 'react';
import { MenuItem } from '../models/sidebar';
import { useAuth } from './use-auth';

export const useFilteredMenu = (menuItems: MenuItem[]): MenuItem[] => {
  const { hasRole, hasPermission } = useAuth();

  const filterMenuItem = (item: MenuItem): MenuItem | null => {
    const hasRequiredRoles = item.roles ? hasRole(item.roles, item.requireAllRoles) : true;

    const hasRequiredPermissions = item.permissions
      ? hasPermission(item.permissions, item.requireAllPermissions)
      : true;

    const hasAccess = item.requireBoth
      ? hasRequiredRoles && hasRequiredPermissions
      : hasRequiredRoles || hasRequiredPermissions;

    if (!hasAccess) return null;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menuItems, hasRole, hasPermission]
  );
};
