import React from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { Label } from '@/components/ui-kit/label';
import { Input } from '@/components/ui-kit/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui-kit/form';
import { ACCOUNT_QUERY_KEY, useCreateAccount } from '@/modules/profile/hooks/use-account';

/**
 * AddUser Component
 *
 * A dialog component that displays a form for creating a new user account. On successful submission,
 * it invalidates and refetches account-related queries and reloads the page to reflect the changes.
 *
 * Features:
 * - Uses `react-hook-form` for form state and validation
 * - Submits form data via `useCreateAccount` mutation
 * - Auto-refreshes relevant queries and reloads the window on success
 * - Provides input fields for first name, last name, and email
 * - Styled using Tailwind and ShadCN dialog components
 *
 * Props:
 * - `onClose` (function): Callback to close the dialog
 *
 * @param {AddUserProps} props - Component props
 *
 * @example
 * <AddUser onClose={() => setIsDialogOpen(false)} />
 */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salutation: string;
}

type AddUserProps = {
  onClose: () => void;
};

export const AddUser: React.FC<AddUserProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate: createAccount } = useCreateAccount({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });

      void queryClient.refetchQueries({
        queryKey: ACCOUNT_QUERY_KEY,
        type: 'active',
        exact: false,
      });

      onClose();
      window.location.reload();
    },
  });

  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      salutation: '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: FormData) => {
    const payload = {
      itemId: '',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      userPassType: 1,
      userCreationType: 1,
      platform: 'blocks_portal',
    };

    createAccount(payload);
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <DialogContent
      className="rounded-md sm:max-w-[480px] overflow-y-auto max-h-screen"
      onClick={handleDialogClick}
    >
      <DialogHeader>
        <DialogTitle className="mb-2">{t('ADD_USER')}</DialogTitle>
        <DialogDescription className="text-medium-emphasis font-normal">
          {t('ADD_USER_DESCRIPTION')}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="firstName"
              rules={{ required: t('FULL_NAME_REQUIRED') }}
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <Label className="text-high-emphasis">{t('FIRST_NAME')}*</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('ENTER_YOUR_FIRST_NAME')}
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              rules={{ required: t('FULL_NAME_REQUIRED') }}
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <Label className="text-high-emphasis">{t('LAST_NAME')}*</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('ENTER_YOUR_LAST_NAME')}
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <Label className="text-high-emphasis">{t('EMAIL')}</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('ENTER_YOUR_EMAIL_ADDRESS')}
                      className="rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-5 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              {t('CANCEL')}
            </Button>
            <Button type="submit">{t('INVITE_USER')}</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
