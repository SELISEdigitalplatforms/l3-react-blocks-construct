import { createContext, useContext } from 'react';
import { User } from '@/types/user.type';

export interface PermissionsContextType {
  user: User | null | undefined;
  hasRole: (role: string | string[], requireAll?: boolean) => boolean;
  hasPermission: (permission: string | string[], requireAll?: boolean) => boolean;
  isLoading: boolean;
  userRoles: string[];
  userPermissions: string[];
}

export const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
