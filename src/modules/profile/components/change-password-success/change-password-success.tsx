import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import SecurityOn from '@/assets/images/security_on.svg';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Label } from '@/components/ui-kit/label';
import { useLogoutAllMutation, useSignoutMutation } from '@/modules/auth/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/state/store/auth';
import { useToast } from '@/hooks/use-toast';

/**
 * Component to display a success message after a password has been updated.
 * It provides an option to log out from all devices and redirects the user to the login page after the update.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onClose - The function to call when the modal/dialog should be closed.
 *
 * @example
 * // Example usage
 * <ChangePasswordSuccess onClose={() => setDialogOpen(false)} />
 */

interface ChangePasswordSuccessProps {
  onClose: () => void;
}

export const ChangePasswordSuccess = ({ onClose }: Readonly<ChangePasswordSuccessProps>) => {
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const { mutateAsync: signoutMutateAsync } = useSignoutMutation();
  const { mutateAsync: logoutAllMutateAsync } = useLogoutAllMutation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const logoutHandler = async () => {
    try {
      if (logoutAllDevices) {
        await logoutAllMutateAsync();
      }
      await signoutMutateAsync();
      logout();
      navigate('/login');
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('UNEXPECTED_ERROR'),
        description: t('LOGGED_OUT_YOUR_SECURITY'),
      });
    }
  };

  return (
    <DialogContent className="rounded-md sm:max-w-[500px]">
      <div className="flex w-full items-center justify-center mb-3">
        <img src={SecurityOn} alt="security icon" />
      </div>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          {t('PASSWORD_UPDATED_SUCCESSFULLY')}
        </DialogTitle>
        <DialogDescription className="font-normal text-high-emphasis">
          {t('YOUR_PASSWORD_UPDATED_SECURITY_REASONS')}
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-2">
        <Checkbox
          id="logout-all-devices"
          checked={logoutAllDevices}
          disabled
          className="cursor-not-allowed opacity-50"
          onCheckedChange={(checked) => setLogoutAllDevices(!!checked)}
        />
        <Label htmlFor="logout-all-devices" className="font-normal">
          {t('LOG_OUT_OF_ALL_DEVICES')}
        </Label>
      </div>
      <DialogFooter className="mt-5 flex justify-end">
        <Button onClick={logoutHandler}>{t('LOG_OUT')}</Button>
      </DialogFooter>
    </DialogContent>
  );
};
