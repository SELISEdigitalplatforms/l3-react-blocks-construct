import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useGlobalMutation, useGlobalQuery } from 'state/query-client/hooks';
import { changePassword, getAccount, updateAccount } from '../services/accounts.service';

export const useGetAccount = () => {
  return useGlobalQuery({
    queryKey: ['getAccount'],
    queryFn: getAccount,
  });
};
export const useUpdateAccount = (options?: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useGlobalMutation({
    mutationKey: ['updateAccount'],
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
      toast({
        color: 'blue',
        title: 'Success',
        description: 'Profile successfully updated',
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description:
          error?.error?.message || 'Profile update failed. Please check your input and try again.',
      });
    },
  });
};

export const useChangePassword = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        color: 'blue',
        title: 'Sucess',
        description: 'Password sucessfully updated',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong! ',
        description: 'Please check your password.',
      });
    },
  });
};

export const ACCOUNT_QUERY_KEY = ['account'];

export const useAccountQuery = () => {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: getAccount,
  });
};
