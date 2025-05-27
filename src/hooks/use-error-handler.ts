import { useTranslation } from 'react-i18next';
import { useToast } from './use-toast';

export interface ErrorResponse {
  error?: {
    error?: string;
    message?: string;
    code?: number;
    details?: Record<string, string | string[]>;
  };
  error_description?: string;
  status?: number;
  message?: string;
}

interface ErrorHandlerOptions {
  /** Custom error messages mapping */
  messageMap?: Record<string, string>;
  /** Default message to show when no specific error is found */
  defaultMessage?: string;
  /** Toast duration in milliseconds */
  duration?: number;
  /** Whether to translate error messages */
  translate?: boolean;
  /** Custom toast variant */
  variant?: 'default' | 'destructive' | 'success';
}

export const useErrorHandler = (defaultOptions: ErrorHandlerOptions = {}) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const parseJsonSafely = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const extractMessage = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return value.Message || value.message || value.error || null;
  };

  const getErrorDetails = (error: unknown): ErrorResponse => {
    // Handle Error instances
    if (error instanceof Error) {
      const parsed = parseJsonSafely(error.message);
      return {
        error_description: parsed?.error_description,
        message: extractMessage(parsed) || error.message,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      const parsed = parseJsonSafely(error);
      return {
        error_description: parsed?.error_description,
        message: extractMessage(parsed) || error,
      };
    }

    // Handle object errors
    if (typeof error === 'object' && error !== null) {
      const err = error as any;
      const responseData = err.response?.data;

      return {
        error: err.error,
        error_description: extractMessage(parseJsonSafely(err.error_description)) || undefined,
        message: extractMessage(responseData) || extractMessage(err) || t('UNKNOWN_ERROR_OCCURRED'),
      };
    }

    return { message: t('UNKNOWN_ERROR_OCCURRED') };
  };

  const getErrorMessage = (
    error: ErrorResponse,
    messageMap: Record<string, string> = {}
  ): string => {
    // Check for error code mapping
    if (error.error?.code && messageMap[`code_${error.error.code}`]) {
      return messageMap[`code_${error.error.code}`];
    }

    // Handle error details
    if (error.error?.details) {
      const messages = Object.entries(error.error.details)
        .map(([key, value]) => {
          if (messageMap[key]) return messageMap[key];
          return Array.isArray(value) ? value.join(', ') : value;
        })
        .filter(Boolean);

      if (messages.length) return messages.join('. ');
    }

    // Return the first available message
    return (
      error.error_description ||
      error.message ||
      (typeof error.error === 'string' ? error.error : error.error?.message) ||
      defaultOptions.defaultMessage ||
      t('SOMETHING_WENT_WRONG')
    );
  };

  const handleError = (error: unknown, options: ErrorHandlerOptions = {}) => {
    const {
      messageMap = {},
      duration = 5000,
      translate = true,
      variant = 'destructive',
    } = { ...defaultOptions, ...options };

    const errorDetails = getErrorDetails(error);
    let message = getErrorMessage(errorDetails, messageMap);
    message = translate ? t(message) : message;

    toast({
      title: translate ? t('ERROR') : 'Error',
      description: message,
      duration,
      variant,
    });

    return message;
  };

  return { handleError, getErrorMessage };
};
