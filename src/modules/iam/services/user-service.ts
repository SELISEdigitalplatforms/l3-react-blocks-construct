import { clients } from '@/lib/https';
import API_CONFIG from '../../../config/api';
import { GetUsersPayload } from '../hooks/use-iam';
import { IamData } from '../types/user.types';


export const getUsers = (payload: GetUsersPayload) => {
  const requestBody = {
    page: payload.page,
    pageSize: payload.pageSize,
    filter: {
      email: payload.filter?.email ?? '',
      name: payload.filter?.name ?? '',
    },
  };

  return clients.post<{
    data: IamData[];
    totalCount: number;
  }>('/iam/v1/User/GetUsers', JSON.stringify(requestBody));
};

export interface RoleData {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  lastUpdatedDate: string;
  permissions: string[];
  isDefault: boolean;
  active: boolean;
}

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

/**
 * Function to fetch a list of roles from the API with pagination, sorting, and filtering.
 *
 * @param {GetRolesPayload} payload - The payload containing pagination, sorting, and filter options.
 * @returns {Promise<{ data: RoleData[], totalCount: number }>} - A promise that resolves to an object containing the list of roles and the total count.
 */
export const getRoles = (payload: GetRolesPayload) => {
  const requestBody = {
    page: payload.page,
    pageSize: payload.pageSize,
    sort: payload.sort
      ? {
          property: payload.sort.property,
          isDescending: payload.sort.isDescending,
        }
      : undefined,
    filter: {
      search: payload.filter?.search ?? '',
    },
    projectKey: API_CONFIG.blocksKey,
  };

  return clients.post<{
    data: RoleData[];
    totalCount: number;
  }>('/iam/v1/Resource/GetRoles', JSON.stringify(requestBody));
};

export function compareValues(a: number, b: number) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}
