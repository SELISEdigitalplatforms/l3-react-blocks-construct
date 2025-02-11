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
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ApiError extends Error {
  response?: {
    status: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
  };
}

export const useSigninMutation = () => {
  const [errorDetails, setErrorDetails] = useState({
    title: '',
    message: '',
  });

  const { toast } = useToast();

  const mutation = useGlobalMutation({
    mutationKey: ['signin'],
    mutationFn: signin,
    onSuccess: () => {
      setErrorDetails({ title: '', message: '' });
      toast({
        color: 'blue',
        title: 'Success',
        description: 'You are successfully logged in',
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorObj = error;
      try {
        if (typeof error === 'string') {
          errorObj = JSON.parse(error);
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      const isInvalidCredentials =
        (errorObj?.status === 400 && errorObj?.error?.error === 'invalid_username_password') ||
        (errorObj?.response?.status === 400 &&
          (errorObj?.response?.data?.error === 'invalid_username_password' ||
            errorObj?.response?.data?.error?.error === 'invalid_username_password'));

      setErrorDetails({
        title: isInvalidCredentials ? 'Invalid Credentials' : 'Something went wrong',
        message: isInvalidCredentials
          ? 'Your email or password is not valid.'
          : 'Please try again.',
      });
    },
  });

  return {
    ...mutation,
    errorDetails,
  };
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
        description: (
          <div className="flex flex-col gap-1">
            {Object.values(error.errors)
              .filter(Boolean)
              .map((message) => (
                <div key={message}>{message}</div>
              ))}
          </div>
        ),
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
        description: (
          <div className="flex flex-col gap-1">
            {Object.values(error.errors)
              .filter(Boolean)
              .map((message) => (
                <div key={message}>{message}</div>
              ))}
          </div>
        ),
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
        description: (
          <div className="flex flex-col gap-1">
            {Object.values(error.errors)
              .filter(Boolean)
              .map((message) => (
                <div key={message}>{message}</div>
              ))}
          </div>
        ),
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
        description: (
          <div className="flex flex-col gap-1">
            {Object.values(error.errors)
              .filter(Boolean)
              .map((message) => (
                <div key={message}>{message}</div>
              ))}
          </div>
        ),
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
