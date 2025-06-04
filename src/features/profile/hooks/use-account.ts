import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useErrorHandler } from 'hooks/use-error-handler';
import { useGlobalMutation, useGlobalQuery } from 'state/query-client/hooks';
import {
  changePassword,
  createAccount,
  getAccount,
  updateAccount,
} from '../services/accounts.service';
import { useTranslation } from 'react-i18next';

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
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
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
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationKey: ['createAccount'],
    mutationFn: createAccount,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: t('USER_ADDED'),
        description: t('USER_HAS_ADDED_SUCCESSFULLY'),
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      handleError(error, {
        title: t('UNABLE_ADD_USER'),
        defaultMessage: t('ERROR_OCCURRED_WHILE_ADDING_USER'),
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
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationKey: ['updateAccount'],
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
      toast({
        variant: 'success',
        title: t('PROFILE_UPDATED'),
        description: t('PROFILE_HAS_UPDATED_SUCCESSFULLY'),
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      handleError(error, {
        title: t('UPDATE_FAILED'),
        defaultMessage: t('ERROR_OCCURRED_WHILE_UPDATING_PROFILE'),
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
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: t('PASSWORD_UPDATED'),
        description: t('PASSWORD_HAS_UPDATED_SUCCESSFULLY'),
      });
    },
    onError: (error) => {
      handleError(error, {
        title: t('UPDATE_FAILED'),
        defaultMessage: t('PLEASE_CHECK_PASSWORD_TRY_AGAIN'),
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
  return useGlobalQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: getAccount,
  });
};
