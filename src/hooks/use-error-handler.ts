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

  const getMessage = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return value.Message || value.message || value.error || null;
  };

  const normalizeError = (error: unknown): ErrorResponse => {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        return {
          error_description: parsed?.error_description,
          message: getMessage(parsed) || error.message,
        };
      } catch {
        return { message: error.message };
      }
    }

    if (typeof error === 'string') return { message: error };

    if (typeof error === 'object' && error !== null) {
      const err = error as any;
      const responseData = err.response?.data;

      try {
        return {
          error: err.error,
          error_description: getMessage(JSON.parse(err.error_description || '')) || undefined,
          message: getMessage(responseData) || getMessage(err) || t('UNKNOWN_ERROR_OCCURRED'),
        };
      } catch {
        return {
          error: err.error,
          message: getMessage(responseData) || getMessage(err) || t('UNKNOWN_ERROR_OCCURRED'),
        };
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
      const messages = Object.entries(error.error.details)
        .map(([key, value]) => messageMap[key] || (Array.isArray(value) ? value.join(', ') : value))
        .filter(Boolean);
      if (messages.length) return messages.join('. ');
    }

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
