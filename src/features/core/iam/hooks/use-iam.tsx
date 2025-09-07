import { useGlobalQuery } from 'state/query-client/hooks';
import { getUsers, IamData, getRoles, RoleData } from '../services/user-service';

export interface UserFilter {
  email?: string;
  name?: string;
}

export interface GetUsersPayload {
  page: number;
  pageSize: number;
  filter?: UserFilter;
}

export interface GetUsersResponse {
  data: IamData[];
  totalCount: number;
}

/**
 * Custom hook to fetch users from the API with pagination and optional filters.
 *
 * @param {GetUsersPayload} payload - The payload for the query containing pagination and filter options.
 * @returns {UseQueryResult<GetUsersResponse>} - The result of the query, including the fetched user data and loading state.
 *
 * @example
 * const { data, isLoading } = useGetUsersQuery({ page: 1, pageSize: 10 });
 */

export const useGetUsersQuery = (payload: GetUsersPayload) => {
  return useGlobalQuery({
    queryKey: ['getUsers', payload.page, payload.pageSize, payload.filter],
    queryFn: () => getUsers(payload),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

export interface RoleSort {
  property: string;
  isDescending: boolean;
}

export interface RoleFilter {
  search?: string;
}

export interface GetRolesPayload {
  page: number;
  pageSize: number;
  sort?: RoleSort;
  filter?: RoleFilter;
  projectKey?: string;
}

export interface GetRolesResponse {
  data: RoleData[];
  totalCount: number;
}

/**
 * Custom hook to fetch roles from the API with pagination, sorting, and filtering options.
 *
 * @param {GetRolesPayload} payload - The payload for the query containing pagination, sorting, and filter options.
 * @returns {UseQueryResult<GetRolesResponse>} - The result of the query, including the fetched roles data and loading state.
 *
 * @example
 * const { data, isLoading } = useGetRolesQuery({ page: 1, pageSize: 10 });
 */
export const useGetRolesQuery = (payload: GetRolesPayload) => {
  return useGlobalQuery({
    queryKey: [
      'getRoles',
      payload.page,
      payload.pageSize,
      payload.filter,
      payload.sort,
      payload.projectKey,
    ],
    queryFn: () => getRoles(payload),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};
