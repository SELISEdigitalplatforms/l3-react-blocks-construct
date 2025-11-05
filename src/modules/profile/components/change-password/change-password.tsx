import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { PasswordInput, SharedPasswordStrengthChecker } from '@/components/core';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui-kit/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordSuccess } from '../change-password-success/change-password-success';
import {
  changePasswordFormType,
  getChangePasswordValidationSchemas,
  changePasswordFormDefaultValue,
} from '../utils/index.utils';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useToast } from '@/hooks/use-toast';
import { useChangePassword } from '../../hooks/use-account';

interface ChangePasswordProps {
  onClose: () => void;
  open?: boolean;
  onOpenChange?(open: boolean): void;
}

export const ChangePassword = ({ onClose, open, onOpenChange }: Readonly<ChangePasswordProps>) => {
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState(false);
  const [changePasswordSuccessModalOpen, setChangePasswordSuccessModalOpen] = useState(false);
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const { toast } = useToast();
  const form = useForm<changePasswordFormType>({
    defaultValues: changePasswordFormDefaultValue,
    resolver: zodResolver(getChangePasswordValidationSchemas(t)),
  });

  const { mutateAsync, isPending } = useChangePassword();

  const onSubmitHandler = async (values: changePasswordFormType) => {
    try {
      await mutateAsync(values);
      toast({
        variant: 'success',
        title: t('PASSWORD_UPDATED'),
        description: t('PASSWORD_HAS_UPDATED_SUCCESSFULLY'),
      });
      form.reset();
      onOpenChange?.(false);
      setChangePasswordSuccessModalOpen(true);
    } catch (error) {
      handleError(error, {
        title: t('UPDATE_FAILED'),
        defaultMessage: t('PLEASE_CHECK_PASSWORD_TRY_AGAIN'),
      });
    }
  };

  const password = form.watch('newPassword');
  const confirmPassword = form.watch('confirmNewPassword');
  const oldPassword = form.watch('oldPassword');

  const onModalClose = () => {
    setChangePasswordSuccessModalOpen(false);
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
                        <PasswordInput placeholder={t('ENTER_YOUR_CURRENT_PASSWORD')} {...field} />
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
                        <PasswordInput placeholder={t('ENTER_YOUR_NEW_PASSWORD')} {...field} />
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
                        <PasswordInput placeholder={t('CONFIRM_YOUR_NEW_PASSWORD')} {...field} />
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
        open={changePasswordSuccessModalOpen}
        onOpenChange={() => setChangePasswordSuccessModalOpen(false)}
      >
        <ChangePasswordSuccess
          onClose={() => {
            setChangePasswordSuccessModalOpen(false);
            onClose();
          }}
        />
      </Dialog>
    </>
  );
};
