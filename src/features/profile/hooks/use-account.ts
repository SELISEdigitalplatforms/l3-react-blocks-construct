import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useGlobalMutation, useGlobalQuery } from 'state/query-client/hooks';
import {
  changePassword,
  createAccount,
  getAccount,
  updateAccount,
} from '../services/accounts.service';

/**
 * Custom hook to fetch account details.
 * It uses a global query to fetch data related to the account.
 *
 * @returns {Object} The query result for getting the account.
 *
 * @example
 * const { data, error, isLoading } = useGetAccount();
 */
export const useGetAccount = () => {
  return useGlobalQuery({
    queryKey: ['getAccount'],
    queryFn: getAccount,
  });
};

/**
 * Custom hook to create a new account.
 * It uses a global mutation to create a new account and handle success or error states.
 *
 * @param {Object} [options] - Optional configuration for mutation.
 * @param {Function} [options.onSuccess] - Callback function to be called when the account creation is successful.
 *
 * @returns {Object} The mutation result for creating the account.
 *
 * @example
 * const { mutate } = useCreateAccount({
 *   onSuccess: () => {
 *     // handle success logic
 *   }
 * });
 */

export const useCreateAccount = (options?: { onSuccess?: () => void }) => {
  const { toast } = useToast();

  return useGlobalMutation({
    mutationKey: ['createAccount'],
    mutationFn: createAccount,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'The user has been added successfully',
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description:
          error?.error?.message ?? 'User creation failed. Please check your input and try again.',
      });
    },
  });
};

/**
 * Custom hook to update account details.
 * It uses a global mutation to update the account information and handle success or error states.
 * It also invalidates the account query cache upon success.
 *
 * @param {Object} [options] - Optional configuration for mutation.
 * @param {Function} [options.onSuccess] - Callback function to be called when the account update is successful.
 *
 * @returns {Object} The mutation result for updating the account.
 *
 * @example
 * const { mutate } = useUpdateAccount({
 *   onSuccess: () => {
 *     // handle success logic
 *   }
 * });
 */
export const useUpdateAccount = (options?: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useGlobalMutation({
    mutationKey: ['updateAccount'],
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Profile successfully updated',
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description:
          error?.error?.message ?? 'Profile update failed. Please check your input and try again.',
      });
    },
  });
};

/**
 * Custom hook to change the user's password.
 * It uses a global mutation to update the password and display appropriate success or error messages.
 *
 * @returns {Object} The mutation result for changing the password.
 *
 * @example
 * const { mutate } = useChangePassword();
 */
export const useChangePassword = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sucess',
        description: 'Password sucessfully updated',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong! ',
        description: 'Please check your password.',
      });
    },
  });
};

export const ACCOUNT_QUERY_KEY = ['account'];

/**
 * Custom hook to fetch the account details using a query.
 *
 * @returns {Object} The query result for fetching the account.
 *
 * @example
 * const { data, error, isLoading } = useAccountQuery();
 */
export const useAccountQuery = () => {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: getAccount,
  });
};
