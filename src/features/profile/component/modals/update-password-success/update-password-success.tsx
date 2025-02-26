import { useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import SecurityOn from '../../../../../assets/images/security_on.svg';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';
import { useLogoutAllMutation, useSignoutMutation } from 'features/auth/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'state/store/auth';
import { useToast } from 'hooks/use-toast';

type UpdatePasswordSuccessProps = {
  onClose: () => void;
};

export const UpdatePasswordSuccess: React.FC<UpdatePasswordSuccessProps> = ({ onClose }) => {
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const { mutateAsync: signoutMutateAsync } = useSignoutMutation();
  const { mutateAsync: logoutAllMutateAsync } = useLogoutAllMutation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toast } = useToast();

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
        title: 'Logout Error!',
        description: 'Something went wrong while logging out.',
      });
    }
  };

  return (
    <DialogContent className="rounded-md sm:max-w-[500px]">
      <div className="flex w-full items-center justify-center mb-3">
        <img src={SecurityOn} alt="security icon" />
      </div>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Password updated successfully</DialogTitle>
        <DialogDescription className="font-normal text-high-emphasis">
          Your password has been updated. For your security, we will sign you out of your current
          session. Please log in again to continue.
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
          Log out of all devices
        </Label>
      </div>
      <DialogFooter className="mt-5 flex justify-end">
        <Button onClick={logoutHandler}>Log out</Button>
      </DialogFooter>
    </DialogContent>
  );
};
