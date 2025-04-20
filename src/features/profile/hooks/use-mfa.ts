import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobalMutation } from 'state/query-client/hooks';
import {
  generateOTP,
  verifyOTP,
  configureUserMfa,
  getSetUpTotp,
  resendOtp,
} from '../services/mfa.services';
import { useToast } from 'hooks/use-toast';
import { SetUpTotp } from '../types/mfa.types';

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
 * mutate('user-id-123'); // Triggers OTP generation for the given user ID
 */
export const useGenerateOTP = () => {
  return useGlobalMutation({
    mutationKey: ['generateOTP'],
    mutationFn: (userId: string) => generateOTP({ userId }),
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
  return useGlobalMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: verifyOTP,
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
  return useMutation({
    mutationFn: (queryParams: SetUpTotp) =>
      getSetUpTotp({ queryKey: ['getSetUpTotp', queryParams] }),
  });
};

/**
 * Custom hook to configure Multi-Factor Authentication (MFA) for the user.
 *
 * This hook uses a global mutation to enable or disable MFA for the user.
 * Upon success, it invalidates the account query cache to refresh the user's data.
 * It also handles error cases by showing a toast notification with an appropriate error message.
 *
 * @returns {UseMutationResult} A mutation object that includes mutation methods like `mutate`, `isLoading`, `isError`, etc.
 *
 * @example
 * const { mutate } = useConfigureUserMfa();
 * mutate({ userId: 'user-123', mfaEnabled: true, userMfaType: 1 });
 */
export const useConfigureUserMfa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useGlobalMutation({
    mutationKey: ['configureUserMfa'],
    mutationFn: configureUserMfa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Manage User MFA',
        description:
          error?.error?.message ?? 'An error occurred while managing user MFA. Please try again.',
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
 * mutate(mfaId); // Trigger the OTP resend process by passing the MFA ID.
 */
export const useResendOtp = () => {
  const { toast } = useToast();

  return useGlobalMutation({
    mutationKey: ['resendOtp'],
    mutationFn: resendOtp,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'OTP resent successfully',
        description: 'A new OTP has been sent to the email.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to resend OTP',
        description:
          error?.error?.message ?? 'An error occurred while resending OTP. Please try again.',
      });
    },
  });
};
