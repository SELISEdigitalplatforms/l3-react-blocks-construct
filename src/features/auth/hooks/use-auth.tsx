import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  accountActivation,
  forgotPassword,
  resendActivation,
  resetPassword,
  signin,
  signout,
  logoutAll,
  PasswordSigninPayload,
  MFASigninPayload,
} from '../services/auth.service';
import { useGlobalMutation } from 'state/query-client/hooks';
import { ErrorResponse, useCustomToast } from './use-custom-toast/use-custom-toast';

/**
 * Authentication Mutations
 *
 * A collection of reusable hooks for handling authentication-related operations using `useGlobalMutation`.
 * These hooks manage server communication, error handling, and success feedback for various auth flows,
 * including sign-in, sign-out, password reset, and account activation.
 *
 * Hooks:
 * - `useSigninMutation`: Handles password or MFA-based sign-in logic with error messaging
 * - `useSignoutMutation`: Handles user sign-out
 * - `useAccountActivation`: Activates a newly registered user account with toast notifications
 * - `useForgotPassword`: Sends a password reset link to the user's email
 * - `useResetPassword`: Resets user password after verification
 * - `useResendActivation`: Resends account activation link to user's email
 * - `useLogoutAllMutation`: Logs out user from all devices
 *
 * Features:
 * - Generic mutation handling using a global mutation wrapper
 * - Custom toast notifications for success and error feedback
 * - Flexible payload typing for sign-in variants (password or MFA)
 * - Detailed error parsing and user-friendly messaging
 *
 * Example:
 * ```tsx
 * const { mutate: signin, errorDetails } = useSigninMutation<'password'>();
 * signin({ username, password });
 * ```
 *
 * @module authMutations
 */

export const useSigninMutation = <T extends 'password' | 'mfa_code'>() => {
  const { t } = useTranslation();
  const [errorDetails, setErrorDetails] = useState({
    title: '',
    message: '',
  });

  const mutation = useGlobalMutation({
    mutationKey: ['signin'],
    mutationFn: async (payload: PasswordSigninPayload | MFASigninPayload) => signin<T>(payload),
    onSuccess: () => {
      setErrorDetails({ title: '', message: '' });
    },
    onError: (error: any) => {
      let errorObj = error;
      try {
        if (typeof error === 'string') {
          errorObj = JSON.parse(error);
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      const isInvalidCredentials =
        (errorObj?.status === 400 && errorObj?.error?.error === 'invalid_username_password') ||
        (errorObj?.response?.status === 400 &&
          (errorObj?.response?.data?.error === 'invalid_username_password' ||
            errorObj?.response?.data?.error?.error === 'invalid_username_password'));

      setErrorDetails({
        title: t(isInvalidCredentials ? 'INVALID_CREDENTIALS' : 'SOMETHING_WENT_WRONG'),
        message: t(isInvalidCredentials ? 'EMAIL_PASSWORD_NOT_VALID' : 'PLEASE_TRY_AGAIN'),
      });
    },
  });

  return {
    ...mutation,
    errorDetails,
  };
};

export const useSignoutMutation = () => {
  return useGlobalMutation({
    mutationKey: ['signout'],
    mutationFn: signout,
  });
};

export const useAccountActivation = () => {
  const { t } = useTranslation();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  return useGlobalMutation({
    mutationKey: ['accountActivation'],
    mutationFn: accountActivation,

    onSuccess: () => {
      showSuccessToast({
        description: t('ACCOUNT_ACTIVATED_SUCCESSFULLY'),
      });
    },
    onError: ({ error }: ErrorResponse) => {
      showErrorToast(error);
    },
  });
};

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  return useGlobalMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: forgotPassword,
    onSuccess: () => {
      showSuccessToast({
        description: t('RESET_PASSWORD_LINK_SENT_EMAIL'),
      });
    },
    onError: ({ error }: ErrorResponse) => {
      showErrorToast(error);
    },
  });
};

export const useResetPassword = () => {
  const { t } = useTranslation();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  return useGlobalMutation({
    mutationKey: ['resetPassword'],
    mutationFn: resetPassword,
    onSuccess: () => {
      showSuccessToast({
        description: t('SUCCESSFULLY_SET_PASSWORD'),
      });
    },
    onError: ({ error }: ErrorResponse) => {
      showErrorToast(error);
    },
  });
};

export const useResendActivation = () => {
  const { t } = useTranslation();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  return useGlobalMutation({
    mutationKey: ['resendActivation'],
    mutationFn: resendActivation,
    onSuccess: () => {
      showSuccessToast({
        description: t('RESET_PASSWORD_LINK_SENT_EMAIL'),
      });
    },
    onError: ({ error }: ErrorResponse) => {
      showErrorToast(error);
    },
  });
};

export const useLogoutAllMutation = () => {
  return useGlobalMutation({
    mutationKey: ['logoutAll'],
    mutationFn: logoutAll,
  });
};
