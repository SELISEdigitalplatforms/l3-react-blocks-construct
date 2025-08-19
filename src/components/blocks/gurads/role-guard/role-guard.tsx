/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { RoleGuardProps } from 'models/permission';
import { usePermissions } from '/hooks/use-permissions';
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

export const RoleGuard: React.FC<
  RoleGuardProps & {
    fallbackType?: 'dialog' | 'toast' | 'hidden';
    autoShowDialog?: boolean;
  }
> = ({
  roles,
  children,
  fallback,
  showFallback = true,
  requireAll = false,
  fallbackType = 'dialog',
}) => {
  const { hasRole, isLoading, user, userRoles } = usePermissions();
  const { toast } = useToast();

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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  const hasAccess = hasRole(roles, requireAll);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showFallback) {
    return null;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const requirementText = requireAll ? 'all of' : 'one of';

  if (fallbackType === 'toast') {
    useEffect(() => {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: `You need ${requirementText} these roles: ${requiredRoles.join(', ')}. Your current roles: ${userRoles.join(', ') || 'None'}`,
      });
    }, [toast, requirementText, requiredRoles, userRoles]);
    return null;
  }

  if (fallbackType === 'hidden') {
    return null;
  }

  window.location.href = '/404';
  return null;
};
