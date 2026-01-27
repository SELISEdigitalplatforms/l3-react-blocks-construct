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
    if (errorDescriptionResult) {
      return {
        ...errorDescriptionResult,
        status: err.response?.status ?? err.status,
      };
    }

    const responseDataResult = handleResponseData(err.response?.data);
    if (responseDataResult) {
      return {
        ...responseDataResult,
        status: err.response?.status ?? err.status,
      };
    }

    return {
      error: err.error,
      error_description: err.error_description,
      message: err.message || t('UNKNOWN_ERROR_OCCURRED'),
      status: err.response?.status ?? err.status,
    };
  };

  const normalizeError = (error: unknown): ErrorResponse => {
    if (error instanceof Error) {
      const parsed = parseJsonError(error.message);
      const errorObj = error as any;
      // Check for status in multiple locations: direct property, response.status, or status property
      const status = errorObj.status ?? errorObj.response?.status;

      // If error has an 'error' property (like HttpError), merge it
      if (errorObj.error) {
        // HttpError stores the full error response in the error property
        // Extract error_description if it exists in the error object
        const errorResponse = errorObj.error;
        return {
          ...(parsed || {}),
          error: errorResponse.error ?? errorResponse,
          error_description: errorResponse.error_description,
          message: errorResponse.error_description || error.message,
          status,
        };
      }

      return parsed ? { ...parsed, status } : { message: error.message, status };
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
    const defaultErrorMap: Record<string, string> = {
      invalid_request: 'EMAIL_PASSWORD_NOT_VALID',
      Password: 'SEEN_PASSWORD_TOO_MANY_TIMES',
      ...messageMap,
    };

    if (error.error_description) {
      return error.error_description;
    }

    if (error.error?.code && defaultErrorMap[`code_${error.error.code}`]) {
      return defaultErrorMap[`code_${error.error.code}`];
    }

    if (error.error?.details) {
      const messages = Object.entries(error.error.details)
        .map(
          ([key, value]) =>
            defaultErrorMap[key] || (Array.isArray(value) ? value.join(', ') : value)
        )
        .filter(Boolean);
      if (messages.length) return messages.join('. ');
    }

    const errorString =
      error.message ?? (typeof error.error === 'string' ? error.error : error.error?.message);
    if (errorString && defaultErrorMap[errorString]) {
      return defaultErrorMap[errorString];
    }

    return errorString ?? defaultOptions.defaultMessage ?? t('SOMETHING_WENT_WRONG');
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

    const errorDetails = normalizeError(error);

    // Handle 403 Forbidden errors specifically
    if (errorDetails.status === 403) {
      toast({
        title: t('FORBIDDEN'),
        description: t('YOU_ARE_NOT_ALLOWED_PERFORM_ACTION'),
        duration,
        variant,
      });
      return t('YOU_ARE_NOT_ALLOWED_PERFORM_ACTION');
    }

    const finalTitle = translate ? t(title) : title;
    let finalMessage: string;

    if (typeof error === 'string' && translate) {
      finalMessage = t(error);
    } else {
      const isBackendError = errorDetails.error_description ?? errorDetails.error;
      const errorMessage = getErrorMessage(errorDetails, messageMap);

      // Don't translate error_description as it's already human-readable from backend
      // Only translate if it's a translation key (uppercase with underscores)
      const isTranslationKey = /^[A-Z_]+$/.test(errorMessage);
      finalMessage = translate && isTranslationKey ? t(errorMessage) : errorMessage;

      if (isBackendError) {
        // Check the error code field for authentication errors
        const errorCode =
          typeof errorDetails.error === 'string' ? errorDetails.error : errorDetails.error?.error;
        const isAuthError = ['invalid_request', 'invalid_username_password'].includes(
          errorCode ?? ''
        );

        toast({
          title: isAuthError ? t('INVALID_CREDENTIALS') : t('SOMETHING_WENT_WRONG'),
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
