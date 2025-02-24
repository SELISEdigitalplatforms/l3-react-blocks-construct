/* eslint-disable react-hooks/exhaustive-deps */

import { useGlobalQuery } from 'state/query-client/hooks';
import { getUsers, IamData } from '../services/user-service';

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
