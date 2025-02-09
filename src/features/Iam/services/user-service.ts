import { clients } from 'lib/https';

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

export const getUsers = (payload: { page: number; pageSize: number }) => {
  const requestBody = {
    ...payload,
    filter: {
      email: '',
      name: '',
    },
  };

  return clients.post<{
    data: IamData[];
    totalCount: number;
  }>('/iam/v1/User/GetUsers', JSON.stringify(requestBody));
};
