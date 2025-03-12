import { useNavigate } from 'react-router-dom';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { useAuthStore } from 'state/store/auth';
import { useSignoutMutation } from 'features/auth/hooks/use-auth';
import { useToast } from 'hooks/use-toast';

export const EnableMfa = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { mutateAsync } = useSignoutMutation();
  const { toast } = useToast();

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
        title: 'Logout Error!',
        description: 'Something went wrong while logging out.',
      });
    }
  };

  return (
    <DialogContent className="rounded-md sm:max-w-[700px] overflow-y-auto max-h-screen">
      <DialogHeader>
        <DialogTitle>MFA required for your account</DialogTitle>
        <DialogDescription>
          To keep your account secure, Multi-Factor Authentication (MFA) is required. Please enable
          MFA from your Profile page before proceeding.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={logoutHandler}>
          Logout
        </Button>
        <Button onClick={() => navigate('/profile')}>Go To Profile</Button>
      </DialogFooter>
    </DialogContent>
  );
};
