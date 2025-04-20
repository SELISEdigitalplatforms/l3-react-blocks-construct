import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { publicRoutes } from 'constant/auth-public-routes';

/**
 * useGlobalQuery Hook
 *
 * An enhanced React Query useQuery hook that handles authentication errors globally
 * by automatically logging out users and redirecting to login when refresh tokens expire.
 *
 * Features:
 * - Wraps React Query's useQuery with authentication error handling
 * - Automatically redirects to login page on invalid refresh tokens
 * - Preserves all original useQuery functionality and return values
 * - Supports public routes where auth errors shouldn't trigger logout
 * - Fully typed with generics for query data, errors and variables
 *
 * @template TQueryFnData The type of data returned by the query function
 * @template TError The type of error returned by the query function (defaults to ApiError)
 * @template TData The type of transformed data returned by the select option
 * @template TQueryKey The type of the query key
 *
 * @param {UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>} option - Standard React Query options
 * @returns {UseQueryResult<TData, TError>} The query result object from React Query
 *
 * @example
 * // Basic usage
 * const { data, isLoading } = useGlobalQuery({
 *   queryKey: ['users'],
 *   queryFn: () => clients.get('users'),
 * });
 */

interface ApiError {
  error?: {
    error?: string;
    message?: string;
    code?: number;
  };
}

export const useGlobalQuery = <
  TQueryFnData = unknown,
  TError = ApiError, // Use the custom error type
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  option: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const queryResult = useQuery(option);
  const isPublicRoute = publicRoutes.includes(currentPath);

  useEffect(() => {
    if (queryResult.error) {
      const errorMessage = (queryResult.error as ApiError).error?.error;

      if (errorMessage === 'invalid_refresh_token' && !isPublicRoute) {
        logout();
        navigate('/login');
      }
    }
  }, [queryResult.error, logout, isPublicRoute, navigate]);

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
  TError = ApiError, // Use the custom error type
  TVariables = void,
  TContext = unknown,
>(
  option: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    ...option,
    onError: (error, variables, context) => {
      const errorMessage = (error as ApiError).error?.error;

      if (errorMessage === 'invalid_refresh_token') {
        logout();
        navigate('/login');
      }

      if (option.onError) {
        option.onError(error, variables, context);
      }
    },
  });
};
