import {
  DefaultError,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/auth";

export const useGlobalQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  option: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { error, ...rest } = useQuery(option);
  if (
    (error as { error: { error: string } })?.error?.error ===
    "invalid_refresh_token"
  ) {
    logout();
    navigate("/signin");
  }
  return { error, ...rest };
};

export const useGlobalMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  option: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  return useMutation(option);
};
