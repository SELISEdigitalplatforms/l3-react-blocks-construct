/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { usePermissions } from 'hooks/use-permissions';
import { useToast } from 'hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Shield, UserX } from 'lucide-react';
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
  const { hasPermission, isLoading, user, userPermissions } = usePermissions();
  const { toast } = useToast();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && !user.active) {
    if (!showFallback) return null;

    if (fallbackType === 'toast') {
      useEffect(() => {
        toast({
          variant: 'destructive',
          title: 'Account Inactive',
          description: 'Your account is inactive. Please contact your administrator.',
        });
      }, [toast]);
      return null;
    }

    if (fallbackType === 'dialog') {
      return (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-500" />
                Account Inactive
              </DialogTitle>
              <DialogDescription>
                Your account is inactive. Please contact your administrator to reactivate your
                account.
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
    }

    return null;
  }

  if (checkOnClick) {
    const handleClick = (e: React.MouseEvent) => {
      const hasAccess = hasPermission(permissions, requireAll);

      if (!hasAccess) {
        e.preventDefault();
        e.stopPropagation();

        if (fallbackType === 'toast') {
          const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
          const requirementText = requireAll ? 'all of' : 'one of';
          toast({
            variant: 'destructive',
            title: 'Permission Required',
            description: `You need ${requirementText} these permissions: ${requiredPermissions.join(', ')}`,
          });
        } else if (fallbackType === 'dialog') {
          setShowPermissionDialog(true);
        }
      }
    };

    return (
      <>
        {React.cloneElement(children as React.ReactElement, {
          onClick: handleClick,
        })}

        {showPermissionDialog && fallbackType === 'dialog' && (
          <Dialog open={true} onOpenChange={() => setShowPermissionDialog(false)}>
            <DialogContent className="sm:max-w-md bg-background">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 mb-4 text-high-emphasis">
                  <Shield className="h-5 w-5 text-amber-500" />
                  Permission Required
                </DialogTitle>
                <DialogDescription className="space-y-2  text-high-emphasis">
                  <p>
                    You need {requireAll ? 'all of' : 'one of'} these permissions:{' '}
                    <strong>
                      {(Array.isArray(permissions) ? permissions : [permissions]).join(', ')}
                    </strong>
                  </p>
                  <p className="text-sm">
                    Your current permissions: {userPermissions.join(', ') || 'None'}
                  </p>
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  const hasAccess = hasPermission(permissions, requireAll);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showFallback) {
    return null;
  }

  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  const requirementText = requireAll ? 'all of' : 'one of';

  if (fallbackType === 'toast') {
    useEffect(() => {
      toast({
        variant: 'destructive',
        title: 'Permission Required',
        description: `You need ${requirementText} these permissions: ${requiredPermissions.join(', ')}`,
      });
    }, [toast, requirementText, requiredPermissions]);
    return null;
  }

  if (fallbackType === 'hidden') {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => (window.location.href = '/dashboard')}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-4  text-high-emphasis">
            <Shield className="h-5 w-5 text-amber-500" />
            Permission Required
          </DialogTitle>
          <DialogDescription className="space-y-2  text-high-emphasis">
            <p>
              You need {requirementText} these permissions:{' '}
              <strong>{requiredPermissions.join(', ')}</strong>
            </p>
            <p className="text-sm ">
              Your current permissions: {userPermissions.join(', ') || 'None'}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
