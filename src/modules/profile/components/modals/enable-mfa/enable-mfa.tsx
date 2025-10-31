import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { useAuthStore } from '@/state/store/auth';
import { useSignoutMutation } from '@/modules/auth/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

/**
 * `EnableMfa` component is used to prompt the user that Multi-Factor Authentication (MFA) is required for their account.
 * It provides options to either log out the user or navigate them to their profile page to enable MFA.
 *
 * @component
 * @example
 * <EnableMfa />
 *
 * @returns {React.Element} The rendered component
 */

export const EnableMfa = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { mutateAsync, isPending } = useSignoutMutation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const logoutHandler = async () => {
    try {
      const res = await mutateAsync();
      if (res.isSuccess) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('UNEXPECTED_ERROR'),
        description: t('LOGGED_OUT_YOUR_SECURITY'),
      });
    }
  };

  return (
    <DialogContent hideClose className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen">
      <DialogHeader>
        <DialogTitle>{t('MFA_REQUIRED_YOUR_ACCOUNT')}</DialogTitle>
        <DialogDescription>
          {t('KEEP_ACCOUNT_SECURE_MULTI_FACTOR_AUTHENTICATION_REQUIRED')}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-5 flex justify-end gap-3">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={logoutHandler}
          className="min-w-[118px]"
        >
          {t('LOGOUT')}
        </Button>
        <Button onClick={() => navigate('/profile')} className="min-w-[118px]">
          {t('GO_TO_PROFILE')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
