/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import { CombinedGuardProps } from '/models/permission';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { useToast } from 'hooks/use-toast';
import { usePermissions } from '/hooks/use-permissions';
import { Button } from 'components/ui/button';
import { Lock, Shield, UserX } from 'lucide-react';

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
  autoShowDialog = false,
}) => {
  const { hasRole, hasPermission, isLoading, user, userRoles, userPermissions } = usePermissions();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="opacity-50 cursor-not-allowed">
              <UserX className="h-4 w-4 mr-2" />
              Restricted Access
            </Button>
          </DialogTrigger>
          <DialogContent>
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
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  }

  const hasRoleAccess = roles ? hasRole(roles, requireAllRoles) : true;
  const hasPermissionAccess = permissions
    ? hasPermission(permissions, requireAllPermissions)
    : true;

  const hasAccess = requireBoth
    ? hasRoleAccess && hasPermissionAccess
    : hasRoleAccess || hasPermissionAccess;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showFallback) {
    return null;
  }

  const requiredRoles = roles ? (Array.isArray(roles) ? roles : [roles]) : [];
  const requiredPermissions = permissions
    ? Array.isArray(permissions)
      ? permissions
      : [permissions]
    : [];

  if (fallbackType === 'toast') {
    useEffect(() => {
      const message = [
        requiredRoles.length > 0 ? `Roles: ${requiredRoles.join(', ')}` : '',
        requiredPermissions.length > 0 ? `Permissions: ${requiredPermissions.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(' and ');

      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: `You need ${message}. Current: Roles [${userRoles.join(', ') || 'None'}], Permissions [${userPermissions.join(', ') || 'None'}]`,
      });
    }, [toast, requiredRoles, requiredPermissions, userRoles, userPermissions]);
    return null;
  }

  if (fallbackType === 'hidden') {
    return null;
  }

  return (
    <Dialog open={autoShowDialog || dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="opacity-50">
          <Lock className="h-4 w-4 mr-2" />
          Restricted Access
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Access Required
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>You need the required roles {requireBoth ? 'and' : 'or'} permissions:</p>

            {requiredRoles.length > 0 && (
              <div>
                <p className="font-medium">Required Roles:</p>
                <p className="text-sm">
                  <strong>{requiredRoles.join(', ')}</strong>
                </p>
              </div>
            )}

            {requiredPermissions.length > 0 && (
              <div>
                <p className="font-medium">Required Permissions:</p>
                <p className="text-sm">
                  <strong>{requiredPermissions.join(', ')}</strong>
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Your current roles: {userRoles.join(', ') || 'None'}</p>
              <p>Your current permissions: {userPermissions.join(', ') || 'None'}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
