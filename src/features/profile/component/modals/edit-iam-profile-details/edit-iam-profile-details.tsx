import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isPossiblePhoneNumber, isValidPhoneNumber, Value } from 'react-phone-number-input';
import { User } from 'types/user.type';
import { ACCOUNT_QUERY_KEY, useUpdateAccount } from 'features/profile/hooks/use-account';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { IamData } from 'features/iam/services/user-service';
import UIPhoneInput from 'components/core/phone-input/phone-input';
import { Badge } from 'components/ui/badge';
import { X } from 'lucide-react';
import { useGetRolesQuery } from 'features/iam/hooks/use-iam';

/**
 * `EditIamProfileDetails` component allows the user to edit their profile details, including their full name, email, phone number, and roles.
 * It integrates with the backend to fetch available roles, updates the account, and provides role selection with a limit of 5 roles.
 * The component supports form validation and ensures the changes are saved to the server.
 *
 * @component
 * @example
 * const userInfo = {
 *   fullName: 'John Doe',
 *   email: 'john.doe@example.com',
 *   phoneNumber: '+1234567890',
 *   roles: ['admin', 'user'],
 *   itemId: '12345'
 * };
 *
 * <EditIamProfileDetails userInfo={userInfo} onClose={() => {}} />
 *
 * @param {Object} props - The component's props
 * @param {User | IamData} props.userInfo - The user information object containing current details to be edited
 * @param {Function} props.onClose - Callback function to close the dialog/modal
 *
 * @returns {React.Element} The rendered component
 */

type FormData = {
  itemId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  currentRole: string;
};

type EditIamProfileDetailsProps = {
  userInfo: User | IamData;
  onClose: () => void;
};

const MAX_ROLES = 5;

export const EditIamProfileDetails: React.FC<EditIamProfileDetailsProps> = ({
  userInfo,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [availableRoles, setAvailableRoles] = useState<Array<{ name: string; slug: string }>>([]);

  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({
    page: 0,
    pageSize: 100,
    filter: { search: '' },
    sort: { property: 'name', isDescending: false },
  });

  useEffect(() => {
    if (rolesData?.data) {
      const mappedRoles = rolesData.data.map((role) => ({
        name: role.name,
        slug: role.name.toLowerCase().replace(/\s+/g, '-'),
      }));
      setAvailableRoles(mappedRoles);
    }
  }, [rolesData]);

  const { mutate: updateAccount, isPending } = useUpdateAccount({
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

  const [isFormChanged, setIsFormChanged] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      itemId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      roles: [],
      currentRole: '',
    },
  });

  const { watch, setValue, handleSubmit, control } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (userInfo) {
      setValue('fullName', `${userInfo.firstName ?? ''} ${userInfo.lastName ?? ''}`.trim());
      setValue('email', userInfo.email ?? '');
      setValue('phoneNumber', userInfo.phoneNumber ?? '');
      setValue('itemId', userInfo.itemId ?? '');
      if (userInfo.roles && Array.isArray(userInfo.roles)) {
        setValue('roles', userInfo.roles.slice(0, MAX_ROLES));
      }
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    if (!userInfo) return;

    const initialValues = {
      fullName: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
      phoneNumber: userInfo.phoneNumber || '',
      profileImageUrl: userInfo.profileImageUrl || '',
      roles: userInfo.roles || [],
    };

    const rolesEqual =
      Array.isArray(watchedValues.roles) &&
      Array.isArray(initialValues.roles) &&
      watchedValues.roles.length === initialValues.roles.length &&
      watchedValues.roles.every((role) => initialValues.roles.includes(role));

    setIsFormChanged(
      watchedValues.fullName !== initialValues.fullName ||
        watchedValues.phoneNumber !== initialValues.phoneNumber ||
        !rolesEqual
    );
  }, [watchedValues, userInfo]);

  const onSubmit = async (data: FormData) => {
    const names = data.fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const payload = {
      itemId: data.itemId,
      firstName,
      lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      roles: data.roles,
    };

    updateAccount(payload);
  };

  const handleAddRole = (roleSlug: string) => {
    if (!roleSlug) return;

    const currentRoles = form.getValues('roles') || [];

    if (currentRoles.length >= MAX_ROLES) return;

    if (!currentRoles.includes(roleSlug)) {
      setValue('roles', [...currentRoles, roleSlug]);
    }
    setValue('currentRole', '');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    const currentRoles = form.getValues('roles') || [];
    setValue(
      'roles',
      currentRoles.filter((role) => role !== roleToRemove)
    );
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const getAvailableRoles = () => {
    const selectedRoles = form.getValues('roles') || [];
    return availableRoles.filter((role) => !selectedRoles.includes(role.slug));
  };

  const getRoleNameBySlug = (slug: string) => {
    const role = availableRoles.find((r) => r.slug === slug);
    return role ? role.name : slug;
  };

  const isMaxRolesReached = () => {
    const selectedRoles = form.getValues('roles') || [];
    return selectedRoles.length >= MAX_ROLES;
  };

  return (
    <DialogContent
      className="rounded-md sm:max-w-[700px] overflow-y-auto max-h-screen"
      onClick={handleDialogClick}
    >
      <DialogHeader>
        <DialogTitle>Edit profile details</DialogTitle>
        <DialogDescription>Keep your details accurate and up to date.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="fullName"
              rules={{ required: 'Full Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <Label>Full Name*</Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter your full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="currentRole"
              render={({ field }) => (
                <FormItem>
                  <Label>Roles (max 5)</Label>
                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) => {
                        handleAddRole(value);
                      }}
                      value={field.value}
                      disabled={isMaxRolesReached() || isLoadingRoles}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingRoles
                                ? 'Loading roles...'
                                : isMaxRolesReached()
                                  ? 'Max roles reached'
                                  : 'Select roles'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableRoles().map((role) => (
                          <SelectItem key={role.slug} value={role.slug}>
                            <span>{role.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {watchedValues.roles?.map((roleSlug) => (
                        <Badge
                          key={roleSlug}
                          className="pr-1 flex items-center gap-1 text-white hover:bg-primary"
                        >
                          <span>{getRoleNameBySlug(roleSlug)}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveRole(roleSlug)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    {watchedValues.roles?.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {watchedValues.roles.length} of {MAX_ROLES} roles selected
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phoneNumber"
              rules={{
                validate: (value) => {
                  if (!value) return 'Phone number is required';
                  if (!isPossiblePhoneNumber(value)) return 'Phone number length is invalid';
                  if (!isValidPhoneNumber(value)) return 'Invalid phone number';
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <Label>Mobile No.</Label>
                  <FormControl>
                    <UIPhoneInput
                      {...field}
                      onChange={(value: Value) => setValue('phoneNumber', value ?? '')}
                      placeholder="Enter your mobile number"
                      defaultCountry="CH"
                      countryCallingCodeEditable={false}
                      international
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={isPending || !isFormChanged}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
