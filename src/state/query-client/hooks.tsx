import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  QueryKey
} from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { useErrorHandler, ErrorResponse } from '../../hooks/use-error-handler';

type ToastVariant = 'default' | 'destructive';

type ApiError = ErrorResponse;

const createOverlay = () => {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  overlay.style.zIndex = '40';
  overlay.id = 'session-expired-overlay';
  return overlay;
};

/**
 * A wrapper around React Query's useQuery that adds global error handling
 */
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export const useGlobalQuery = <
  TQueryFnData = unknown,
  TError = ErrorResponse,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    messageMap?: Record<string, string>;
    variant?: ToastVariant;
    duration?: number;
  }
) => {
  const { handleError } = useErrorHandler();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  const queryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
  });

  if (queryResult.error) {
    handleError(queryResult.error);
  }

  useEffect(() => {
    if (queryResult.error) {
      const errorMessage = (queryResult.error as ApiError).error?.error;

      if (errorMessage === 'invalid_refresh_token' && !isPublicRoute) {
        const overlay = createOverlay();
        document.body.appendChild(overlay);

        handleError(queryResult.error, {
          messageMap: {
            invalid_refresh_token: 'LOGGING_OUT_SESSION_EXPIRATION',
          },
          variant: 'success',
          duration: 2000,
        });

        new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
          logout();
          navigate('/login');

          const existingOverlay = document.getElementById('session-expired-overlay');
          if (existingOverlay?.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
          }
        });
      } else {
        handleError(queryResult.error);
      }
    }
  }, [queryResult.error, logout, isPublicRoute, navigate, t, handleError]);

  return queryResult;
};

/**
 * useGlobalMutation Hook
 *
 * An enhanced React Query useMutation hook that handles authentication errors globally
 * by automatically logging out users and redirecting to login when refresh tokens expire.
 *
 * Features:
 * - Wraps React Query's useMutation with authentication error handling
 * - Automatically redirects to login page on invalid refresh tokens
 * - Preserves original onError callback functionality
 * - Fully typed with generics for mutation data, errors, variables and context
 *
 * @template TData The type of data returned by the mutation function
 * @template TError The type of error returned by the mutation function (defaults to ApiError)
 * @template TVariables The type of variables passed to the mutation function
 * @template TContext The type of context returned by onMutate
 *
 * @param {UseMutationOptions<TData, TError, TVariables, TContext>} option - Standard React Query mutation options
 * @returns {UseMutationResult<TData, TError, TVariables, TContext>} The mutation result object from React Query
 *
 * @example
 * // Basic usage
 * const { mutate, isLoading } = useGlobalMutation({
 *   mutationFn: (userData) => clients.post('users', JSON.stringify(userData)),
 *   onSuccess: (data) => {
 *     console.log('User created:', data);
 *   }
 * });
 */

export const useGlobalMutation = <
  TData = unknown,
  TError = ApiError,
  TVariables = void,
  TContext = unknown,
>(
  option: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler({
    defaultMessage: 'OPERATION_FAILED',
  });

  return useMutation({
    ...option,
    onError: (error, variables, context) => {
      // Try to extract error from different possible formats
      const err = error as any;
      const apiError = {
        error_description: err.error_description || err.message || (err.response?.data?.error_description),
        error: {
          error: err.error?.error || err.response?.data?.error,
          message: err.error?.message || err.response?.data?.message,
          details: err.error?.details || err.response?.data?.details,
        }
      };

      // Handle session expiration
      if (apiError.error.error === 'invalid_refresh_token') {
        handleError(apiError, {
          messageMap: {
            invalid_refresh_token: 'SESSION_EXPIRED_LOGGING_OUT',
          },
          variant: 'destructive',
          duration: 3000,
        });

        setTimeout(() => {
          logout();
          navigate('/login');
        }, 1500);
        return;
      }

      // Handle validation errors
      if (apiError.error.error === 'validation_failed' && apiError.error.details) {
        handleError(apiError, {
          variant: 'destructive',
        });
        return;
      }

      // Handle specific error messages
      if (apiError.error_description || apiError.error.message) {
        handleError(apiError, {
          variant: 'destructive',
        });
        return;
      }

      // Default error handling
      handleError(apiError, {
        variant: 'destructive',
      });

      // Call the original onError if provided
      option.onError?.(error, variables, context);
    },
  });
};
