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
  getValidationSchemas,
} from 'features/profile/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from 'features/profile/hooks/use-account';
import { UpdatePasswordSuccess } from '../update-password-success/update-password-success';
import { SharedPasswordStrengthChecker } from 'components/core/shared-password-strength-checker';
import { useTranslation } from 'react-i18next';

type UpdatePasswordProps = {
  onClose: () => void;
  open?: boolean;
  onOpenChange?(open: boolean): void;
};

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onClose, open, onOpenChange }) => {
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState(false);
  const [updatePasswordSuccessModalOpen, setUpdatePasswordSuccessModalOpen] = useState(false);
  const { t } = useTranslation();

  const form = useForm<changePasswordFormType>({
    defaultValues: changePasswordFormDefaultValue,
    resolver: zodResolver(getValidationSchemas(t).changePasswordFormValidationSchema),
  });

  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmitHandler = async (values: changePasswordFormType) => {
    if (values.newPassword !== values.confirmNewPassword) {
      form.setError('confirmNewPassword', {
        type: 'manual',
        message: t('PASSWORDS_DO_NOT_MATCH'),
      });
      return;
    }

    if (values.oldPassword === values.newPassword) {
      form.setError('newPassword', {
        type: 'manual',
        message: "New password shouldn't match current password",
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
            message: error?.error?.message ?? t('FAILED_TO_CHANGE_PASSWORD'),
          });
        },
      }
    );
  };

  const password = form.watch('newPassword');
  const confirmPassword = form.watch('confirmNewPassword');
  const oldPassword = form.watch('oldPassword');

  const onModalClose = () => {
    setUpdatePasswordSuccessModalOpen(false);
    onClose();
    form.reset();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-md sm:max-w-[500px] overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>{t('UPDATE_PASSWORD')}</DialogTitle>
            <DialogDescription>{t('SECURE_ACCOUNT_NEW_PASSWORD')}</DialogDescription>
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
                        {t('CURRENT_PASSWORD')}
                      </FormLabel>
                      <FormControl>
                        <UPasswordInput placeholder={t('ENTER_YOUR_CURRENT_PASSWORD')} {...field} />
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
                        {t('NEW_PASSWORD')}
                      </FormLabel>
                      <FormControl>
                        <UPasswordInput placeholder={t('ENTER_YOUR_NEW_PASSWORD')} {...field} />
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
                        {t('CONFIRM_NEW_PASSWORD')}
                      </FormLabel>
                      <FormControl>
                        <UPasswordInput placeholder={t('CONFIRM_YOUR_NEW_PASSWORD')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SharedPasswordStrengthChecker
                  password={password}
                  confirmPassword={confirmPassword}
                  excludePassword={oldPassword}
                  onRequirementsMet={setPasswordRequirementsMet}
                />
              </div>
              <DialogFooter className="mt-5 flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={isPending} onClick={onModalClose}>
                    {t('CANCEL')}
                  </Button>
                </DialogTrigger>
                <Button type="submit" disabled={isPending || !passwordRequirementsMet}>
                  {t('CHANGE')}
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
