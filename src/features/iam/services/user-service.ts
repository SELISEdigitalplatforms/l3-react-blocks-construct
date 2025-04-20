import { clients } from 'lib/https';
import API_CONFIG from '../../../config/api';

export interface IamData {
  itemId: string;
  createdDate: string;
  lastUpdatedDate: string;
  lastLoggedInTime: string;
  language: string;
  salutation: string;
  firstName: string;
  lastName: string | null;
  email: string;
  userName: string;
  phoneNumber: string | null;
  roles: string[];
  permissions: string[];
  active: boolean;
  isVarified: boolean;
  profileImageUrl: string | null;
  mfaEnabled: boolean;
}

export interface UserFilter {
  email?: string;
  name?: string;
}

export interface GetUsersPayload {
  page: number;
  pageSize: number;
  filter?: UserFilter;
}

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

// export const getAllRolesForProject = async ({
//   newPassword,
//   oldPassword,
// }: {
//   newPassword: string;
//   oldPassword: string;
// }) => {
//   const payload = {
//     newPassword,
//     oldPassword,
//     projectKey: API_CONFIG.blocksKey,
//   };

//   return clients.post('/iam/v1/Resource/GetRoles', JSON.stringify(payload));
// };

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
