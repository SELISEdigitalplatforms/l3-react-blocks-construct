export interface RoleGuardProps {
  roles: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  requireAll?: boolean;
  fallbackType?: 'dialog' | 'toast' | 'hidden';
  autoShowDialog?: boolean;
}

export interface PermissionGuardProps {
  permissions: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  requireAll?: boolean;
  fallbackType?: 'dialog' | 'toast' | 'hidden';
  autoShowDialog?: boolean;
}

export interface CombinedGuardProps {
  roles?: string | string[];
  permissions?: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  requireAllRoles?: boolean;
  requireAllPermissions?: boolean;
  requireBoth?: boolean; // true = user needs roles AND permissions, false = user needs roles OR permissions
}
