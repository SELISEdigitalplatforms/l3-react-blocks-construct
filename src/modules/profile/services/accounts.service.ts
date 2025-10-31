import { clients } from '@/lib/https';
import { ChangePasswordPayload } from '../types/account.type';
import { User } from '@/types/user.type';
import { CreateUserFormType, ProfileFormType } from '../components/utils/index.utils';

export const changePassword = async (payload: ChangePasswordPayload) => {
  payload.projectKey = payload.projectKey ?? import.meta.env.VITE_X_BLOCKS_KEY;
  return clients.post('/iam/v1/Account/ChangePassword', JSON.stringify(payload));
};

export const getAccount = async (): Promise<User> => {
  const res = await clients.get<{ data: User }>('/iam/v1/User/GetAccount');
  return res.data;
};

export const updateAccount = (data: ProfileFormType) => {
  return clients.post<{
    itemId: string;
    errors: unknown;
    isSuccess: boolean;
  }>('/iam/v1/user/UpdateAccount', JSON.stringify(data));
};

export const createAccount = (data: CreateUserFormType) => {
  return clients.post<{
    itemId: string;
    errors: unknown;
    isSuccess: boolean;
  }>('/iam/v1/User/Create', JSON.stringify(data));
};
