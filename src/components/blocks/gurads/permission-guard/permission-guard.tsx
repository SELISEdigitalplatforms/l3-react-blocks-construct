/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { usePermissions } from 'hooks/use-permissions';
import { useToast } from 'hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { UserX } from 'lucide-react';
import { Button } from 'components/ui/button';
import { PermissionGuardProps } from 'models/permission';

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  children,
  fallback,
  showFallback = true,
  requireAll = false,
  fallbackType = 'dialog',
  checkOnClick = false,
}) => {
  const { hasPermission, isLoading, user } = usePermissions();
  const { toast } = useToast();

  const checkPermissionAccess = () => {
    return hasPermission(permissions, requireAll);
  };

  const getPermissionsArray = () => {
    return Array.isArray(permissions) ? permissions : [permissions];
  };

  const getRequirementText = () => {
    return requireAll ? 'all of' : 'one of';
  };

  const isUserInactive = user && !user.active;
  const hasAccess = !isLoading && !isUserInactive && checkPermissionAccess();
  const shouldShowInactiveToast = isUserInactive && showFallback && fallbackType === 'toast';
  const shouldShowPermissionToast =
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
    if (shouldShowPermissionToast) {
      const requiredPermissions = getPermissionsArray();
      const requirementText = getRequirementText();

      toast({
        variant: 'destructive',
        title: 'Permission Required',
        description: `You need ${requirementText} these permissions: ${requiredPermissions.join(', ')}`,
      });
    }
  }, [shouldShowPermissionToast, toast, permissions, requireAll]);

  useEffect(() => {
    if (shouldRedirectTo404) {
      window.location.href = '/404';
    }
  }, [shouldRedirectTo404]);

  const renderInactiveUserDialog = () => (
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

  if (checkOnClick) {
    return hasAccess ? <>{children}</> : null;
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
