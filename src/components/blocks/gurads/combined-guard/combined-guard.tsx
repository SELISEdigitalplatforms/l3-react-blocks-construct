/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { CombinedGuardProps } from 'models/permission';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { useToast } from 'hooks/use-toast';
import { usePermissions } from 'hooks/use-permissions';
import { Button } from 'components/ui/button';
import { UserX } from 'lucide-react';

export const CombinedGuard: React.FC<
  CombinedGuardProps & {
    fallbackType?: 'dialog' | 'toast' | 'hidden';
    autoShowDialog?: boolean;
  }
> = ({
  roles,
  permissions,
  children,
  fallback,
  showFallback = true,
  requireAllRoles = false,
  requireAllPermissions = false,
  requireBoth = false,
  fallbackType = 'dialog',
}) => {
  const { hasRole, hasPermission, isLoading, user, userRoles, userPermissions } = usePermissions();
  const { toast } = useToast();

  const checkAccess = () => {
    const hasRoleAccess = roles ? hasRole(roles, requireAllRoles) : true;
    const hasPermissionAccess = permissions
      ? hasPermission(permissions, requireAllPermissions)
      : true;

    return requireBoth
      ? hasRoleAccess && hasPermissionAccess
      : hasRoleAccess || hasPermissionAccess;
  };

  const convertRolesToArray = (roles: any) => {
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  };

  const convertPermissionsToArray = (permissions: any) => {
    if (!permissions) return [];
    return Array.isArray(permissions) ? permissions : [permissions];
  };

  const getRequiredItems = () => {
    const requiredRoles = convertRolesToArray(roles);
    const requiredPermissions = convertPermissionsToArray(permissions);
    return { requiredRoles, requiredPermissions };
  };

  const buildAccessMessage = (requiredRoles: string[], requiredPermissions: string[]) => {
    const parts = [
      requiredRoles.length > 0 ? `Roles: ${requiredRoles.join(', ')}` : '',
      requiredPermissions.length > 0 ? `Permissions: ${requiredPermissions.join(', ')}` : '',
    ].filter(Boolean);

    return parts.join(' and ');
  };

  const isUserInactive = user && !user.active;
  const hasAccess = !isLoading && !isUserInactive && checkAccess();
  const shouldShowInactiveToast = isUserInactive && showFallback && fallbackType === 'toast';
  const shouldShowAccessDeniedToast =
    !isLoading &&
    !isUserInactive &&
    !hasAccess &&
    !fallback &&
    showFallback &&
    fallbackType === 'toast';
  const shouldRedirectTo404 =
    !isLoading &&
    !isUserInactive &&
    !hasAccess &&
    !fallback &&
    showFallback &&
    fallbackType === 'dialog';

  useEffect(() => {
    if (shouldShowInactiveToast) {
      toast({
        variant: 'destructive',
        title: 'Account Inactive',
        description: 'Your account is inactive. Please contact your administrator.',
      });
    }
  }, [shouldShowInactiveToast, toast]);

  useEffect(() => {
    if (shouldShowAccessDeniedToast) {
      const { requiredRoles, requiredPermissions } = getRequiredItems();
      const message = buildAccessMessage(requiredRoles, requiredPermissions);
      const currentAccess = `Current: Roles [${userRoles.join(', ') || 'None'}], Permissions [${userPermissions.join(', ') || 'None'}]`;

      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: `You need ${message}. ${currentAccess}`,
      });
    }
  }, [shouldShowAccessDeniedToast, toast, userRoles, userPermissions, roles, permissions]);

  useEffect(() => {
    if (shouldRedirectTo404) {
      window.location.href = '/404';
    }
  }, [shouldRedirectTo404]);

  const renderInactiveUserDialog = () => (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-500" />
            Account Inactive
          </DialogTitle>
          <DialogDescription>
            Your account is inactive. Please contact your administrator to reactivate your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Early returns for simple cases
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isUserInactive) {
    if (!showFallback) return null;

    if (fallbackType === 'toast') {
      return null;
    }

    if (fallbackType === 'dialog') {
      return renderInactiveUserDialog();
    }

    return null;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showFallback) {
    return null;
  }

  if (fallbackType === 'toast') {
    return null;
  }

  if (fallbackType === 'hidden') {
    return null;
  }

  return null;
};
