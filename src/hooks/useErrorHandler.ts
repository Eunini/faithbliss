// hooks/useErrorHandler.ts - Hook for consistent error handling across the app

import { useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { ErrorHandler, type ApiError } from '@/lib/errorHandler';

export interface UseErrorHandlerOptions {
  defaultTitle?: string;
  defaultMessage?: string;
  showToast?: boolean;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { showError, showWarning } = useToast();
  const { showToast = true } = options;

  const handleError = useCallback((
    error: ApiError | Error,
    customMessage?: { title?: string; message?: string }
  ) => {
    const apiError = error as ApiError;
    
    console.error('Handled error:', apiError);

    if (showToast) {
      ErrorHandler.handleApiError(
        apiError,
        (type, message, title) => {
          if (type === 'error') {
            showError(message, title);
          } else {
            showWarning(message, title);
          }
        },
        customMessage || {
          title: options.defaultTitle,
          message: options.defaultMessage
        }
      );
    }

    return ErrorHandler.getUserMessage(apiError);
  }, [showError, showWarning, showToast, options.defaultTitle, options.defaultMessage]);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    errorMessage?: { title?: string; message?: string }
  ): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (error) {
      handleError(error as ApiError, errorMessage);
      return null;
    }
  }, [handleError]);

  const handleApiCallWithRetry = useCallback(async <T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 2,
    errorMessage?: { title?: string; message?: string }
  ): Promise<T | null> => {
    let lastError: ApiError | null = null;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as ApiError;
        
        // Don't retry on client errors (4xx) except for 429 (rate limit)
        if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500 && lastError.statusCode !== 429) {
          break;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries + 1) {
          break;
        }
        
        // Check if we should retry this error
        if (!ErrorHandler.shouldAllowRetry(lastError)) {
          break;
        }
        
        // Wait before retrying
        const delay = ErrorHandler.getRetryDelay(lastError, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Handle the final error
    if (lastError) {
      handleError(lastError, errorMessage);
    }
    
    return null;
  }, [handleError]);

  return {
    handleError,
    handleApiCall,
    handleApiCallWithRetry,
    shouldLogout: (error: ApiError) => ErrorHandler.shouldLogout(error),
    shouldAllowRetry: (error: ApiError) => ErrorHandler.shouldAllowRetry(error),
    getRetryDelay: (error: ApiError, attempt: number) => ErrorHandler.getRetryDelay(error, attempt)
  };
};

export default useErrorHandler;