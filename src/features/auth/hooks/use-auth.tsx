import {
  accountActivation,
  forgotPassword,
  resendActivation,
  resetPassword,
  signin,
  signout,
  logoutAll,
} from '../services/auth.service';
import { useToast } from '../../../hooks/use-toast';
import { useGlobalMutation } from '../../../state/query-client/hooks';

export const useSigninMutation = () => {
  const { toast } = useToast();

  return useGlobalMutation({
    mutationKey: ['signin'],
    mutationFn: signin,
    onSuccess: () => {
      toast({
        color: 'blue',
        title: 'Sucesss',
        description: 'You are sucessfully logged in',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Invalid user name and password.',
      });
    },
  });
};

export const useSignoutMutation = () => {
  return useGlobalMutation({
    mutationKey: ['signout'],
    mutationFn: signout,
  });
};

export const useAccountActivation = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ['accountActivation'],
    mutationFn: accountActivation,
    onSuccess: () => {
      toast({
        color: 'blue',
        title: 'Sucesss',
        description: 'You are sucessfully acctivated your account',
      });
    },
    onError: ({
      error,
    }: {
      status: number;
      error: { isSuccess: boolean; errors: { Code: string } };
    }) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.errors.Code,
      });
    },
  });
};

export const useForgotPassword = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast({
        color: 'blue',
        title: 'Sucesss',
        description: 'A link has been sent your email',
      });
    },
    onError: ({
      error,
    }: {
      status: number;
      error: { isSuccess: boolean; errors: { Code: string } };
    }) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.errors.Code,
      });
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ['resetPassword'],
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        color: 'blue',
        title: 'Sucesss',
        description: 'You have sucessfully set your password',
      });
    },
    onError: ({
      error,
    }: {
      status: number;
      error: { isSuccess: boolean; errors: { Code: string } };
    }) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.errors.Code,
      });
    },
  });
};

export const useResendActivation = () => {
  const { toast } = useToast();
  return useGlobalMutation({
    mutationKey: ['resendActivation'],
    mutationFn: resendActivation,
    onSuccess: () => {
      toast({
        color: 'blue',
        title: 'Sucesss',
        description: 'A link has been sent your email',
      });
    },
    onError: ({
      error,
    }: {
      status: number;
      error: { isSuccess: boolean; errors: { Code: string } };
    }) => {
      toast({
        variant: 'destructive',
        color: 'blue',
        title: 'Error',
        description: error.errors.Code,
      });
    },
  });
};

export const useLogoutAllMutation = () => {
  return useGlobalMutation({
    mutationKey: ['logoutAll'],
    mutationFn: logoutAll,
  });
};
