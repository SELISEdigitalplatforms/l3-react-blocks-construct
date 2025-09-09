import { ReactNode } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';

export type ErrorResponse = {
  status: number;
  error: {
    isSuccess: boolean;
    errors: Record<string, string>;
  };
};

export type ToastOptions = {
  title?: string;
  description?: ReactNode;
  variant?: 'default' | 'destructive';
  color?: string;
};

type MutationFn<TData = unknown> = (...args: any[]) => Promise<TData>;

export type GlobalMutationResult<TData = unknown> = UseMutationResult<
  TData,
  ErrorResponse,
  Parameters<MutationFn<TData>>[0]
>;

export const useCustomToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (options: ToastOptions = {}) => {
    toast({
      color: options.color ?? 'blue',
      title: options.title ?? 'Success',
      description: options.description,
      variant: options.variant ?? 'default',
    });
  };

  const showErrorToast = (error: ErrorResponse['error'], options: ToastOptions = {}) => {
    toast({
      variant: options.variant ?? 'destructive',
      color: options.color ?? 'blue',
      title: options.title ?? 'Error',
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
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};
