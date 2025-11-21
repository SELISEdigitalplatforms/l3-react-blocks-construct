/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { MenuItem } from '../models/sidebar';
import { useAuth } from './use-auth';

export const useFilteredMenu = (menuItems: MenuItem[]): MenuItem[] => {
  const { hasRole, hasPermission } = useAuth();

  const filterMenuItem = (item: MenuItem): MenuItem | null => {
    const filteredChildren = item.children
      ? (item.children.map(filterMenuItem).filter(Boolean) as MenuItem[])
      : undefined;

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
