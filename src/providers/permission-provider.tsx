import { usePermissionsLogic } from '@/hooks/use-permissions';
import { useMemo } from 'react';
import { User } from '@/types/user.type';
import { PermissionsContext } from '@/context/permissions-context';

interface PermissionsProviderProps {
  user: User | null | undefined;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  user,
  isLoading = false,
  children,
}) => {
  const { hasRole, hasPermission, userRoles, userPermissions } = usePermissionsLogic(
    user,
    isLoading
  );

  const value = useMemo(
    () => ({
      user,
      hasRole,
      hasPermission,
      isLoading,
      userRoles,
      userPermissions,
    }),
    [user, hasRole, hasPermission, isLoading, userRoles, userPermissions]
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};
