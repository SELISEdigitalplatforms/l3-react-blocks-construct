/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { UserX } from 'lucide-react';
import { CombinedGuardProps } from '@/models/permission';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { Button } from '@/components/ui-kit/button';

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

  const convertToArray = (items: any) => {
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  };

  const buildAccessMessage = () => {
    const requiredRoles = convertToArray(roles);
    const requiredPermissions = convertToArray(permissions);

    const parts = [
      requiredRoles.length > 0 ? `Roles: ${requiredRoles.join(', ')}` : '',
      requiredPermissions.length > 0 ? `Permissions: ${requiredPermissions.join(', ')}` : '',
    ].filter(Boolean);

    return parts.join(' and ');
  };

  const showInactiveAccountToast = () => {
    toast({
      variant: 'destructive',
      title: 'Account Inactive',
      description: 'Your account is inactive. Please contact your administrator.',
    });
  };

  const showAccessDeniedToast = () => {
    const message = buildAccessMessage();
    const currentAccess = `Current: Roles [${userRoles.join(', ') || 'None'}], Permissions [${userPermissions.join(', ') || 'None'}]`;

    toast({
      variant: 'destructive',
      title: 'Access Denied',
      description: `You need ${message}. ${currentAccess}`,
    });
  };

  const isUserInactive = user && !user.active;
  const hasAccess = !isLoading && !isUserInactive && checkAccess();
  const isToastMode = fallbackType === 'toast';
  const isDialogMode = fallbackType === 'dialog';

  useEffect(() => {
    if (!showFallback || !isToastMode) return;

    if (isUserInactive) {
      showInactiveAccountToast();
    } else if (!isLoading && !hasAccess && !fallback) {
      showAccessDeniedToast();
    }
  }, [
    isUserInactive,
    isLoading,
    hasAccess,
    fallback,
    showFallback,
    isToastMode,
    userRoles,
    userPermissions,
    roles,
    permissions,
  ]);

  useEffect(() => {
    const shouldRedirect =
      !isLoading && !isUserInactive && !hasAccess && !fallback && showFallback && isDialogMode;
    if (shouldRedirect) {
      window.location.href = '/404';
    }
  }, [isLoading, isUserInactive, hasAccess, fallback, showFallback, isDialogMode]);

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

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (isLoading) {
    return renderLoadingSpinner();
  }

  if (isUserInactive) {
    if (!showFallback || isToastMode) return null;
    if (isDialogMode) return renderInactiveUserDialog();
    return null;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
};
