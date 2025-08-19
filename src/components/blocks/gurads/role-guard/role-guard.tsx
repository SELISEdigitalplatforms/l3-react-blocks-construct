/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { RoleGuardProps } from 'models/permission';
import { usePermissions } from '/hooks/use-permissions';
import { useToast } from 'hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Lock, Shield, UserX } from 'lucide-react';
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
  autoShowDialog = false,
}) => {
  const { hasRole, isLoading, user, userRoles } = usePermissions();
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
            Role Required
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              You need {requirementText} these roles: <strong>{requiredRoles.join(', ')}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Your current roles: {userRoles.join(', ') || 'None'}
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
