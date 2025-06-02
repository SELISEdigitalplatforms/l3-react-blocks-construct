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
  messageMap?: Record<string, string>;
  defaultMessage?: string;
  duration?: number;
  translate?: boolean;
  variant?: 'default' | 'destructive' | 'success';
  title?: string;
}

export const useErrorHandler = (defaultOptions: ErrorHandlerOptions = {}) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const normalizeError = (error: unknown): ErrorResponse => {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        return {
          error: parsed?.error,
          error_description: parsed?.error_description,
          message: parsed?.message,
        };
      } catch {
        return { message: error.message };
      }
    }

    if (typeof error === 'string') {
      try {
        const parsed = JSON.parse(error);
        return {
          error: parsed?.error,
          error_description: parsed?.error_description,
          message: parsed?.message,
        };
      } catch {
        return { message: error };
      }
    }

    if (typeof error === 'object' && error !== null) {
      const err = error as any;

      // Check if the error object itself has the properties we need
      if (err.error_description) {
        try {
          // Try to parse error_description if it's a stringified JSON
          const parsedDescription = JSON.parse(err.error_description);
          return {
            error: parsedDescription.error || err.error,
            error_description: parsedDescription.error_description,
            message: parsedDescription.message || err.message,
          };
        } catch {
          // If parsing fails, use the error_description as is
          return {
            error: err.error,
            error_description: err.error_description,
            message: err.message,
          };
        }
      }

      const responseData = err.response?.data;

      if (responseData) {
        if (typeof responseData === 'string') {
          try {
            const parsed = JSON.parse(responseData);
            return {
              error: parsed?.error,
              error_description: parsed?.error_description,
              message: parsed?.message,
            };
          } catch {
            return { message: responseData };
          }
        }

        // If responseData is an object, use it directly
        if (typeof responseData === 'object') {
          return {
            error: responseData.error,
            error_description: responseData.error_description,
            message: responseData.message,
          };
        }
      }

      // If we have a direct error object with the structure we expect
      if (err.error && err.error_description) {
        try {
          // Try to parse error_description if it's a stringified JSON
          const parsedDescription = JSON.parse(err.error_description);
          return {
            error: parsedDescription.error || err.error,
            error_description: parsedDescription.error_description,
            message: parsedDescription.message || err.message,
          };
        } catch {
          return {
            error: err.error,
            error_description: err.error_description,
            message: err.message,
          };
        }
      }

      return {
        error: err.error,
        error_description: err.error_description,
        message: err.message || t('UNKNOWN_ERROR_OCCURRED'),
      };
    }

    return { message: t('UNKNOWN_ERROR_OCCURRED') };
  };

  const getErrorMessage = (
    error: ErrorResponse,
    messageMap: Record<string, string> = {}
  ): string => {
    // First check for error_description as it's more descriptive
    if (error.error_description) {
      return error.error_description;
    }

    // Then check for error code mapping
    if (error.error?.code && messageMap[`code_${error.error.code}`]) {
      return messageMap[`code_${error.error.code}`];
    }

    // Then check for error details
    if (error.error?.details) {
      const messages = Object.entries(error.error.details)
        .map(([key, value]) => messageMap[key] || (Array.isArray(value) ? value.join(', ') : value))
        .filter(Boolean);
      if (messages.length) return messages.join('. ');
    }

    // Finally fallback to other error messages
    return (
      error.message ||
      (typeof error.error === 'string' ? error.error : error.error?.message) ||
      defaultOptions.defaultMessage ||
      t('SOMETHING_WENT_WRONG')
    );
  };

  const handleError = (error: unknown, options: ErrorHandlerOptions = {}) => {
    const {
      messageMap = {},
      duration = 3000,
      variant = 'destructive',
      title = t('ERROR'),
      translate = true,
    } = {
      ...defaultOptions,
      ...options,
    };

    const finalTitle = translate ? t(title) : title;
    let finalMessage: string;

    if (typeof error === 'string' && translate) {
      finalMessage = t(error);
    } else {
      const errorDetails = normalizeError(error);
      finalMessage = translate
        ? t(getErrorMessage(errorDetails, messageMap))
        : getErrorMessage(errorDetails, messageMap);
    }

    toast({
      title: finalTitle,
      description: finalMessage,
      duration,
      variant,
    });

    return finalMessage;
  };

  return { handleError, getErrorMessage };
};
