import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useEffect } from 'react';

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

  const queryResult = useQuery(option);

  useEffect(() => {
    if (queryResult.error) {
      const errorMessage = (queryResult.error as ApiError).error?.error;

      if (errorMessage === 'invalid_refresh_token') {
        logout();
        navigate('/login');
      }
    }
  }, [queryResult.error, logout, navigate]);

  return queryResult;
};

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
