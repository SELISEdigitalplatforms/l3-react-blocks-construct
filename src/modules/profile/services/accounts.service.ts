import { clients } from '@/lib/https';
import { ChangePasswordPayload } from '../types/account.type';

export const changePassword = async (payload: ChangePasswordPayload) => {
  payload.projectKey = payload.projectKey ?? import.meta.env.VITE_X_BLOCKS_KEY;
  return clients.post('/iam/v1/Account/ChangePassword', JSON.stringify(payload));
};
