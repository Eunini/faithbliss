'use client';

import React, { useEffect, useState } from 'react';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { AlertTriangle, RefreshCw, X, Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatusBanner: React.FC = () => {
  const { hasConnectionError, retryConnection } = useNextAuth();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissed state when connection error changes
  useEffect(() => {
    if (!hasConnectionError) {
      setIsDismissed(false);
    }
  }, [hasConnectionError]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryConnection();
    } finally {
      setIsRetrying(false);
    }
  };

  // Don't show if dismissed or no error
  if (!hasConnectionError || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500/95 backdrop-blur-md text-white p-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WifiOff className="w-5 h-5 text-red-200 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              Connection Problem
            </p>
            <p className="text-xs text-red-200">
              Unable to connect to servers. Check your internet connection.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-700 disabled:cursor-not-allowed px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Retrying...</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3" />
                <span>Retry</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-red-600 rounded transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatusBanner;