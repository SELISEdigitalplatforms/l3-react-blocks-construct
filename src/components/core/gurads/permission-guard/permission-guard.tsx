/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { UserX } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { PermissionGuardProps } from '@/models/permission';

export const PermissionGuard = ({
  permissions,
  children,
  fallback,
  showFallback = true,
  requireAll = false,
  fallbackType = 'dialog',
  checkOnClick = false,
}: Readonly<PermissionGuardProps>) => {
  const { hasPermission, isLoading, user } = usePermissions();
  const { toast } = useToast();

  const getRequirementText = (): string => {
    switch (requireAll) {
      case true:
        return 'all of';
      case false:
        return 'one of';
      default:
        return 'one of';
    }
  };

  const checkPermissionAccess = () => {
    return hasPermission(permissions, requireAll);
  };

  const getPermissionsArray = () => {
    return Array.isArray(permissions) ? permissions : [permissions];
  };

  const showInactiveAccountToast = () => {
    toast({
      variant: 'destructive',
      title: 'Account Inactive',
      description: 'Your account is inactive. Please contact your administrator.',
    });
  };

  const showPermissionDeniedToast = () => {
    const requiredPermissions = getPermissionsArray();
    const requirementText = getRequirementText(); // Using switch statement method

    toast({
      variant: 'destructive',
      title: 'Permission Required',
      description: `You need ${requirementText} these permissions: ${requiredPermissions.join(', ')}`,
    });
  };

  const isUserInactive = user && !user.active;
  const hasAccess = !isLoading && !isUserInactive && checkPermissionAccess();
  const isToastMode = fallbackType === 'toast';
  const isDialogMode = fallbackType === 'dialog';

  useEffect(() => {
    if (!showFallback) return;

    if (isUserInactive && isToastMode) {
      showInactiveAccountToast();
      return;
    }

    if (!isLoading && !isUserInactive && !hasAccess && !fallback) {
      if (isToastMode) {
        showPermissionDeniedToast();
      } else if (isDialogMode) {
        window.location.href = '/404';
      }
    }
  }, [
    isUserInactive,
    isLoading,
    hasAccess,
    showFallback,
    isToastMode,
    isDialogMode,
    permissions,
    requireAll,
  ]);

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

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const handleInactiveUser = () => {
    if (!showFallback) return null;
    if (isToastMode) return null;
    if (isDialogMode) return renderInactiveUserDialog();
    return null;
  };

  const handleAccessDenied = () => {
    if (fallback) return <>{fallback}</>;
    if (!showFallback || isToastMode || fallbackType === 'hidden') return null;
    return null;
  };

  if (isLoading) {
    return renderLoadingSpinner();
  }

  if (isUserInactive) {
    return handleInactiveUser();
  }

  if (checkOnClick) {
    return hasAccess ? <>{children}</> : null;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return handleAccessDenied();
};
