import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../services/accounts.service';

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword,
  });
};
