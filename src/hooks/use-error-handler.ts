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

  const parseJsonError = (jsonString: string): ErrorResponse | null => {
    try {
      const parsed = JSON.parse(jsonString);
      return {
        error: parsed?.error,
        error_description: parsed?.error_description,
        message: parsed?.message,
      };
    } catch {
      return null;
    }
  };

  const handleErrorDescription = (err: any): ErrorResponse | null => {
    if (!err.error_description) return null;

    const parsedDescription = parseJsonError(err.error_description);
    if (parsedDescription) {
      return {
        error: parsedDescription.error ?? err.error,
        error_description: parsedDescription.error_description,
        message: parsedDescription.message ?? err.message,
      };
    }

    return {
      error: err.error,
      error_description: err.error_description,
      message: err.message,
    };
  };

  const handleResponseData = (responseData: any): ErrorResponse | null => {
    if (!responseData) return null;

    if (typeof responseData === 'string') {
      const parsed = parseJsonError(responseData);
      return parsed || { message: responseData };
    }

    if (typeof responseData === 'object') {
      return {
        error: responseData.error,
        error_description: responseData.error_description,
        message: responseData.message,
      };
    }

    return null;
  };

  const handleErrorObject = (err: any): ErrorResponse => {
    const errorDescriptionResult = handleErrorDescription(err);
    if (errorDescriptionResult) return errorDescriptionResult;

    const responseDataResult = handleResponseData(err.response?.data);
    if (responseDataResult) return responseDataResult;

    return {
      error: err.error,
      error_description: err.error_description,
      message: err.message || t('UNKNOWN_ERROR_OCCURRED'),
    };
  };

  const normalizeError = (error: unknown): ErrorResponse => {
    if (error instanceof Error) {
      const parsed = parseJsonError(error.message);
      return parsed || { message: error.message };
    }

    if (typeof error === 'string') {
      const parsed = parseJsonError(error);
      return parsed || { message: error };
    }

    if (typeof error === 'object' && error !== null) {
      return handleErrorObject(error as any);
    }

    return { message: t('UNKNOWN_ERROR_OCCURRED') };
  };

  const getErrorMessage = (
    error: ErrorResponse,
    messageMap: Record<string, string> = {}
  ): string => {
    if (error.error_description) {
      return error.error_description;
    }

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
      error.message ??
      (typeof error.error === 'string' ? error.error : error.error?.message) ??
      defaultOptions.defaultMessage ??
      t('SOMETHING_WENT_WRONG')
    );
  };

  const handleError = (error: unknown, options: ErrorHandlerOptions = {}) => {
    const {
      messageMap = {},
      duration = 3000,
      variant = 'destructive',
      title = t('SOMETHING_WENT_WRONG'),
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
      const isBackendError = errorDetails.error_description ?? errorDetails.error;
      finalMessage = translate
        ? t(getErrorMessage(errorDetails, messageMap))
        : getErrorMessage(errorDetails, messageMap);

      if (isBackendError) {
        toast({
          title: t('SOMETHING_WENT_WRONG'),
          description: finalMessage,
          duration,
          variant,
        });
        return finalMessage;
      }
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
