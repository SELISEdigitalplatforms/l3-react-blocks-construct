import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useGlobalMutation, useGlobalQuery } from 'state/query-client/hooks';
import { changePassword, getAccount, updateAccount } from '../services/accounts.service';

export const useGetAccount = () => {
  return useGlobalQuery({
    queryKey: ['getAccount'],
    queryFn: getAccount,
  });
};
export const useUpdateAccount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationKey: ['updateAccount'],
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAccount'] });
      toast({
        color: 'blue',
        title: 'Sucesss',
        description: 'Profile sucessfully updated',
      });
    },
    onError: (error) => {
      toast({
        color: 'destructive',
        title: 'Error',
        description: error?.message || 'Something went wrong!',
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
    onError: (error) => {
      toast({
        color: 'text-destructive',
        title: 'Error',
        description: error?.message || "Something went wrong! You can't change the password.",
      });
    },
  });
};
