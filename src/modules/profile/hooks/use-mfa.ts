import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useToast } from '@/hooks/use-toast';
import { GenerateOTPPayload, SetUpTotp } from '../types/mfa.types';
import {
  disableUserMfa,
  generateOTP,
  getMfaTemplate,
  getSetUpTotp,
  resendOtp,
  verifyOTP,
} from '../services/mfa.services';

/**
 * Custom hook to generate a One-Time Password (OTP) for a given user.
 *
 * This hook utilizes a global mutation to call the OTP generation API.
 * It returns mutation utilities such as `mutate`, `mutateAsync`, `isLoading`, etc.
 *
 * @returns {UseMutationResult} A mutation object for triggering the OTP generation.
 *
 * @example
 * const { mutate } = useGenerateOTP();
 * mutate({ userId: 'user-id-123', mfaType: 1 }); // Triggers OTP generation for the given user ID and MFA type
 */
export const useGenerateOTP = () => {
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationKey: ['generateOTP'],
    mutationFn: (payload: GenerateOTPPayload) => generateOTP(payload),
    onError: (error) => {
      handleError(error, {
        variant: 'destructive',
      });
    },
  });
};

/**
 * Custom hook to verify the OTP (One-Time Password) entered by the user.
 *
 * This hook uses a global mutation to call the OTP verification API.
 * It returns mutation utilities such as `mutate`, `mutateAsync`, `isLoading`, etc.
 *
 * @returns {UseMutationResult} A mutation object for verifying the OTP.
 *
 * @example
 * const { mutate } = useVerifyOTP();
 * mutate({ verificationCode: '12345', mfaId: 'abc123', authType: 1 });
 */
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: verifyOTP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
    },
    onError: (error) => {
      handleError(error, {
        variant: 'destructive',
      });
    },
  });
};

/**
 * Custom hook to initialize TOTP (Time-based One-Time Password) setup for a user.
 *
 * This hook calls the `getSetUpTotp` API, which returns the necessary information
 * (e.g., QR code, secret) to configure a TOTP authenticator app.
 *
 * @returns {UseMutationResult} A mutation object that includes `mutate`, `mutateAsync`, `isLoading`, etc.
 *
 * @example
 * const { mutate } = useGetSetUpTotp();
 * mutate({ userId: 'user-123', userMfaType: 2 });
 */
export const useGetSetUpTotp = () => {
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationKey: ['getSetUpTotp'],
    mutationFn: (queryParams: SetUpTotp) =>
      getSetUpTotp({ queryKey: ['getSetUpTotp', queryParams] }),
    onError: (error) => {
      handleError(error, {
        variant: 'destructive',
      });
    },
  });
};

/**
 * Custom hook to resend the OTP (One-Time Password) to the user's email.
 *
 * This hook uses a global mutation to trigger the resend OTP process.
 * Upon success, it displays a success toast notification confirming the OTP has been resent.
 * If the request fails, it shows an error toast with a relevant message.
 *
 * @returns {UseMutationResult} A mutation object that includes mutation methods like `mutate`, `isLoading`, `isError`, etc.
 *
 * @example
 * const { mutate } = useResendOtp();
 * mutate(); // Trigger the OTP resend process
 */
export const useResendOtp = () => {
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationKey: ['resendOtp'],
    mutationFn: resendOtp,
    onError: (error) => {
      handleError(error, {
        variant: 'destructive',
      });
    },
  });
};

/**
 * Custom hook to fetch the MFA template configuration.
 *
 * This hook uses a query to fetch the MFA template configuration from the server.
 * It automatically handles caching and revalidation of the data.
 *
 * @returns {UseQueryResult} A query object that includes the data, loading state, and error state.
 *
 * @example
 * const { data, isLoading } = useGetMfaTemplate();
 * if (!isLoading) {
 *   console.log(data); // MFA template configuration
 * }
 */
export const useGetMfaTemplate = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['mfaTemplate'],
    queryFn: getMfaTemplate,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
    }
  }, [query.isSuccess, queryClient]);

  return query;
};

/**
 * Custom hook to disable Multi-Factor Authentication (MFA) for a user.
 *
 * This hook uses a global mutation to disable MFA for the user.
 *
 * @returns {UseMutationResult} A mutation object that includes mutation methods like `mutate`, `isLoading`, `isError`, etc.
 *
 * @example
 * const { mutate } = useDisableUserMfa();
 * mutate('user-123'); // Disable MFA for the user with ID 'user-123'
 */
export const useDisableUserMfa = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationKey: ['disableUserMfa'],
    mutationFn: (userId: string) => disableUserMfa(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
      toast({
        variant: 'success',
        title: t('MFA_DISABLED'),
        description: t('MULTI_FACTOR_AUTH_DISABLED_SUCCESSFULLY'),
      });
    },
    onError: (error) => {
      handleError(error, {
        variant: 'destructive',
      });
    },
  });
};
