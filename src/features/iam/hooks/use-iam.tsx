/* eslint-disable react-hooks/exhaustive-deps */
// // import { useGlobalMutation } from 'state/query-client/hooks';
// // import { getUsers, IamData } from '../services/user-service';

// // export interface UserFilter {
// //   email?: string;
// //   name?: string;
// // }

// // export interface GetUsersPayload {
// //   page: number;
// //   pageSize: number;
// //   filter?: UserFilter;
// // }

// // export interface GetUsersResponse {
// //   data: IamData[];
// //   totalCount: number;
// // }

// // export const useGetUsersMutation = () => {
// //   return useGlobalMutation<GetUsersResponse, Error, GetUsersPayload>({
// //     mutationKey: ['getUsers'],
// //     mutationFn: getUsers,
// //     onError: (error) => {
// //       console.error('Failed to fetch users:', error);
// //     },
// //   });
// // };

// import { useGlobalQuery } from 'state/query-client/hooks';
// import { getUsers, IamData } from '../services/user-service';

// export interface UserFilter {
//   email?: string;
//   name?: string;
// }

// export interface GetUsersPayload {
//   page: number;
//   pageSize: number;
//   filter?: UserFilter;
// }

// export interface GetUsersResponse {
//   data: IamData[];
//   totalCount: number;
// }

// // export const useGetUsersQuery = (payload: GetUsersPayload) => {
// //   return useGlobalQuery<GetUsersResponse>({
// //     queryKey: ['getUsers', payload],
// //     queryFn: () => getUsers(payload),
// //   });
// // };

// export const useGetUsersQuery = ({
//   page,
//   pageSize,
//   filter,
//   queryKey,
// }: GetUsersPayload & {
//   queryKey?: unknown[];
// }) => {
//   return useGlobalQuery<GetUsersResponse, Error>({
//     queryKey: queryKey || ['getUsers', { page, pageSize, filter }],
//     queryFn: () => getUsers({ page, pageSize, filter }),
//     staleTime: 5000, // Optional: Configure how long the data remains fresh
//     placeholderData: (previousData) => previousData, // This replaces keepPreviousData
//     refetchOnWindowFocus: false,
//   });
// };

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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Replaces keepPreviousData
  });
};
