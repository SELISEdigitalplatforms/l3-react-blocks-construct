import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  QueryKey,
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

type GlobalQueryOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'onError'
> & {
  messageMap?: Record<string, string>;
  variant?: ToastVariant;
  duration?: number;
  onError?: (error: TError) => void;
};

export const useGlobalQuery = <
  TQueryFnData = unknown,
  TError = ErrorResponse,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: GlobalQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => {
  const { handleError } = useErrorHandler();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  const hasHandledError = useRef(false);

  const queryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    retry: false,
  });

  useEffect(() => {
    if (queryResult.error && !hasHandledError.current) {
      hasHandledError.current = true;
      const err = queryResult.error as any;
      const apiError = {
        error_description:
          err.error_description || err.message || err.response?.data?.error_description,
        error: {
          error: err.error?.error || err.response?.data?.error,
          message: err.error?.message || err.response?.data?.message,
          details: err.error?.details || err.response?.data?.details,
        },
      };

      if (apiError.error.error === 'invalid_refresh_token' && !isPublicRoute) {
        if (!document.getElementById('session-expired-overlay')) {
          const overlay = createOverlay();
          document.body.appendChild(overlay);

          setTimeout(() => {
            logout();
            navigate('/login');
            const existingOverlay = document.getElementById('session-expired-overlay');
            if (existingOverlay?.parentNode) {
              existingOverlay.parentNode.removeChild(existingOverlay);
            }

            // Show the toast after redirecting
            handleError(
              {
                error: {
                  error: 'invalid_refresh_token',
                  message: 'SESSION_EXPIRED_LOGGING_OUT',
                },
              },
              {
                variant: 'destructive',
                duration: 3000,
              }
            );
          }, 1500);
        }
      } else {
        handleError(apiError);
      }

      // Call the original onError if it exists
      if (options.onError) {
        options.onError(queryResult.error);
      }
    }

    // Reset the flag when the error changes
    if (!queryResult.error) {
      hasHandledError.current = false;
    }
  }, [queryResult.error, isPublicRoute, handleError, logout, navigate, options]);

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
        error_description:
          err.error_description || err.message || err.response?.data?.error_description,
        error: {
          error: err.error?.error || err.response?.data?.error,
          message: err.error?.message || err.response?.data?.message,
          details: err.error?.details || err.response?.data?.details,
        },
      };

      // Handle session expiration
      if (apiError.error.error === 'invalid_refresh_token') {
        setTimeout(() => {
          logout();
          navigate('/login');

          // Show the toast after redirecting
          handleError(
            {
              error: {
                error: 'invalid_refresh_token',
                message: 'SESSION_EXPIRED_LOGGING_OUT',
              },
            },
            {
              variant: 'destructive',
              duration: 3000,
            }
          );
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
