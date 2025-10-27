/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { RoleGuardProps } from '@/models/permission';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { UserX } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';

export const RoleGuard: React.FC<
  RoleGuardProps & {
    fallbackType?: 'dialog' | 'toast' | 'hidden';
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

  const checkRoleAccess = () => {
    return hasRole(roles, requireAll);
  };

  const getRolesArray = () => {
    return Array.isArray(roles) ? roles : [roles];
  };

  const getRequirementText = () => {
    switch (requireAll) {
      case true:
        return 'all of';
      case false:
        return 'one of';
      default:
        return 'one of';
    }
  };

  const handleInactiveUser = () => {
    if (!showFallback) return null;
    if (fallbackType === 'toast') return null;
    if (fallbackType === 'dialog') return renderInactiveUserDialog();
    return null;
  };

  const isUserInactive = user && !user.active;
  const hasAccess = !isLoading && !isUserInactive && checkRoleAccess();
  const shouldShowInactiveToast = isUserInactive && showFallback && fallbackType === 'toast';
  const shouldShowRoleToast =
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
    if (shouldShowRoleToast) {
      const requiredRoles = getRolesArray();
      const requirementText = getRequirementText();

      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: `You need ${requirementText} these roles: ${requiredRoles.join(', ')}. Your current roles: ${userRoles.join(', ') || 'None'}`,
      });
    }
  }, [shouldShowRoleToast, toast, roles, requireAll, userRoles]);

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
    return handleInactiveUser();
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showFallback || fallbackType === 'toast' || fallbackType === 'hidden') {
    return null;
  }

  return null;
};
