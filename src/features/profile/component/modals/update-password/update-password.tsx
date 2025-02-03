import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { UPasswordInput } from 'components/core/u-password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import {
  changePasswordFormDefaultValue,
  changePasswordFormType,
  changePasswordFormValidationSchema,
} from 'features/profile/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from 'features/profile/hooks/use-account';
import PasswordStrengthChecker from 'components/core/password-strength-checker';
import { UpdatePasswordSuccess } from '../update-password-success/update-password-success';

type UpdatePasswordProps = {
  onClose: () => void;
  open?: boolean;
  onOpenChange?(open: boolean): void;
};

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onClose, open, onOpenChange }) => {
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState(false);
  const [updatePasswordSuccessModalOpen, setUpdatePasswordSuccessModalOpen] = useState(false);

  const form = useForm<changePasswordFormType>({
    defaultValues: changePasswordFormDefaultValue,
    resolver: zodResolver(changePasswordFormValidationSchema),
  });

  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmitHandler = async (values: changePasswordFormType) => {
    if (values.newPassword !== values.confirmNewPassword) {
      form.setError('confirmNewPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    changePassword(
      {
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange?.(false);
          setUpdatePasswordSuccessModalOpen(true);
        },
        onError: (error) => {
          console.error('Error:', error);
          form.setError('oldPassword', {
            type: 'manual',
            message: error?.message || 'Failed to change password',
          });
        },
      }
    );
  };

  const onModalClose = () => {
    setUpdatePasswordSuccessModalOpen(false);
    onClose();
    form.reset();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-md sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>Secure your account with a new password.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-high-emphasis font-normal">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <UPasswordInput placeholder="Enter your current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-high-emphasis font-normal">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <UPasswordInput placeholder="Enter your new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-high-emphasis font-normal">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <UPasswordInput placeholder="Confirm your new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PasswordStrengthChecker
                  password={form.watch('newPassword')}
                  onRequirementsMet={setPasswordRequirementsMet}
                />
              </div>
              <DialogFooter className="mt-5 flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={isPending} onClick={onModalClose}>
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button type="submit" disabled={isPending || !passwordRequirementsMet}>
                  Change
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={updatePasswordSuccessModalOpen}
        onOpenChange={() => setUpdatePasswordSuccessModalOpen(false)}
      >
        <UpdatePasswordSuccess
          onClose={() => {
            setUpdatePasswordSuccessModalOpen(false);
            onClose();
          }}
        />
      </Dialog>
    </>
  );
};
