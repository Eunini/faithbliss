// lib/errorHandler.ts - Centralized error handling utilities

export interface ApiError extends Error {
  statusCode?: number;
  endpoint?: string;
  isNetworkError?: boolean;
  isCorsError?: boolean;
}

export class ErrorHandler {
  /**
   * Get user-friendly error message from API error
   */
  static getUserMessage(error: ApiError): { title: string; message: string; type: 'error' | 'warning' } {
    // CORS/Network errors
    if (error.isCorsError) {
      return {
        title: 'Connection Problem',
        message: 'Unable to connect to our servers. Please check your internet connection or try again later.',
        type: 'error'
      };
    }

    if (error.isNetworkError) {
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        type: 'error'
      };
    }

    // HTTP status code errors
    if (error.statusCode) {
      switch (error.statusCode) {
        case 400:
          return {
            title: 'Invalid Request',
            message: 'The request was invalid. Please check your input and try again.',
            type: 'warning'
          };
        
        case 401:
          return {
            title: 'Authentication Required',
            message: 'Your session has expired. Please sign in again.',
            type: 'warning'
          };
        
        case 403:
          return {
            title: 'Access Denied',
            message: 'You don\'t have permission to perform this action.',
            type: 'warning'
          };
        
        case 404:
          return {
            title: 'Not Found',
            message: 'The requested resource could not be found.',
            type: 'warning'
          };
        
        case 409:
          return {
            title: 'Conflict',
            message: 'This action conflicts with existing data. Please refresh and try again.',
            type: 'warning'
          };
        
        case 422:
          return {
            title: 'Validation Error',
            message: 'Please check your input and correct any errors.',
            type: 'warning'
          };
        
        case 429:
          return {
            title: 'Too Many Requests',
            message: 'You\'re making requests too quickly. Please wait a moment and try again.',
            type: 'warning'
          };
        
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            title: 'Server Error',
            message: 'Our servers are experiencing issues. Please try again in a few moments.',
            type: 'error'
          };
        
        default:
          return {
            title: 'Unexpected Error',
            message: 'Something went wrong. Please try again.',
            type: 'error'
          };
      }
    }

    // Fallback for unknown errors
    return {
      title: 'Unexpected Error',
      message: error.message || 'An unexpected error occurred. Please try again.',
      type: 'error'
    };
  }

  /**
   * Handle API error with toast notification
   */
  static handleApiError(
    error: ApiError, 
    showToast: (type: 'error' | 'warning', message: string, title?: string) => void,
    customMessage?: { title?: string; message?: string }
  ): void {
    const { title, message, type } = this.getUserMessage(error);
    
    showToast(
      type,
      customMessage?.message || message,
      customMessage?.title || title
    );
  }

  /**
   * Determine if error should trigger a logout
   */
  static shouldLogout(error: ApiError): boolean {
    return error.statusCode === 401 && !error.endpoint?.includes('/login');
  }

  /**
   * Determine if error should show a retry option
   */
  static shouldAllowRetry(error: ApiError): boolean {
    return (
      error.isCorsError ||
      error.isNetworkError ||
      (error.statusCode && error.statusCode >= 500) ||
      error.statusCode === 429
    );
  }

  /**
   * Get appropriate retry delay in milliseconds
   */
  static getRetryDelay(error: ApiError, attemptNumber: number = 1): number {
    if (error.statusCode === 429) {
      // Rate limiting - exponential backoff starting at 2 seconds
      return Math.min(2000 * Math.pow(2, attemptNumber - 1), 30000);
    }

    if (error.statusCode && error.statusCode >= 500) {
      // Server errors - shorter backoff starting at 1 second
      return Math.min(1000 * Math.pow(1.5, attemptNumber - 1), 10000);
    }

    // Network errors - moderate backoff starting at 1.5 seconds
    return Math.min(1500 * Math.pow(2, attemptNumber - 1), 15000);
  }
}

export default ErrorHandler;