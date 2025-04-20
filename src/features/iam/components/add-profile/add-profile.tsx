import React from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from 'components/ui/form';
import { ACCOUNT_QUERY_KEY, useCreateAccount } from 'features/profile/hooks/use-account';

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
 * @returns {JSX.Element} A modal with a user invitation form
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

  const { mutate: createAccount } = useCreateAccount({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });

      await queryClient.refetchQueries({
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
        <DialogTitle className="mb-2">Add user</DialogTitle>
        <DialogDescription className="text-medium-emphasis font-normal">
          Please enter the user&apos;s email address to send an invitation.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="firstName"
              rules={{ required: 'Full Name is required' }}
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <Label className="text-high-emphasis">First Name*</Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter your first name" className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              rules={{ required: 'Full Name is required' }}
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <Label className="text-high-emphasis">Last Name*</Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter your last name" className="rounded-lg" />
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
                  <Label className="text-high-emphasis">Email</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email address"
                      className="rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-5 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Invite User</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
