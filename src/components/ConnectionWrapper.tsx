'use client';

import React from 'react';
import { useNextAuth } from '@/contexts/NextAuthContext';
import CorsErrorFallback from './CorsErrorFallback';

interface ConnectionWrapperProps {
  children: React.ReactNode;
  showFallbackOnError?: boolean;
  fallbackComponent?: React.ReactNode;
}

export const ConnectionWrapper: React.FC<ConnectionWrapperProps> = ({
  children,
  showFallbackOnError = true,
  fallbackComponent
}) => {
  const { hasConnectionError, retryConnection, loading } = useNextAuth();

  // Don't show error during initial loading
  if (loading) {
    return <>{children}</>;
  }

  // Show CORS error fallback if we have a connection error
  if (hasConnectionError && showFallbackOnError) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <CorsErrorFallback 
        onRetry={retryConnection}
        isRetrying={false}
      />
    );
  }

  return <>{children}</>;
};

export default ConnectionWrapper;