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

  const getErrorDetails = (error: unknown): ErrorResponse => {
    if (error instanceof Error) {
      try {
        const parsedMessage = JSON.parse(error.message);
        if (parsedMessage.error_description) {
          return { error_description: parsedMessage.error_description };
        }
        return { message: parsedMessage.message || error.message };
      } catch {
        return { message: error.message };
      }
    }

    if (typeof error === 'string') {
      try {
        const parsedError = JSON.parse(error);
        if (parsedError.error_description) {
          return { error_description: parsedError.error_description };
        }
        return { message: error };
      } catch {
        return { message: error };
      }
    }

    if (typeof error === 'object' && error !== null) {
      const err = error as any;

      if (err.error_description) {
        return { error_description: err.error_description };
      }

      if (err.response?.data) {
        const data = err.response.data;
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          if (parsed.error_description) {
            return { error_description: parsed.error_description };
          }
        } catch {
          return { message: String(data) };
        }
      }

      if (err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.error_description) {
            return { error_description: parsed.error_description };
          }
        } catch {
          return { message: err.message };
        }
      }
    }

    return { message: t('UNKNOWN_ERROR_OCCURRED') };
  };

  const getErrorMessage = (
    error: ErrorResponse,
    messageMap: Record<string, string> = {}
  ): string => {
    if (error.error?.code && messageMap[`code_${error.error.code}`]) {
      return messageMap[`code_${error.error.code}`];
    }

    if (error.error?.details) {
      const messages: string[] = [];
      for (const [key, value] of Object.entries(error.error.details)) {
        if (messageMap[key]) {
          messages.push(messageMap[key]);
        } else if (typeof value === 'string') {
          messages.push(value);
        } else if (Array.isArray(value)) {
          messages.push(value.join(', '));
        }
      }
      if (messages.length) return messages.join('. ');
    }

    if (error.error_description) {
      return error.error_description;
    }

    if (error.message) {
      return error.message;
    }

    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (typeof error.error === 'object') {
        return error.error.message || error.error.error || JSON.stringify(error.error);
      }
    }

    return defaultOptions.defaultMessage || t('SOMETHING_WENT_WRONG');
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

    // Translate if enabled
    if (translate) {
      message = t(message);
    }

    toast({
      title: translate ? t('ERROR') : 'Error',
      description: message,
      duration,
      variant,
    });

    return message;
  };

  return {
    handleError,
    getErrorMessage,
  };
};
