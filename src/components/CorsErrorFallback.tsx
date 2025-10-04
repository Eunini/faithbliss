'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Globe, Settings } from 'lucide-react';

interface CorsErrorFallbackProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const CorsErrorFallback: React.FC<CorsErrorFallbackProps> = ({ 
  onRetry, 
  isRetrying = false 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Globe className="w-16 h-16 text-gray-400" />
            <AlertTriangle className="w-8 h-8 text-red-400 absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Connection Issue
          </h1>
          <p className="text-gray-400 text-sm">
            Unable to connect to our servers
          </p>
        </div>

        {/* Description */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-gray-300 mb-2">
                This appears to be a server configuration issue. Our backend isn&apos;t properly configured to accept requests from this domain.
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Check your internet connection</p>
                <p>• Try refreshing the page</p>
                <p>• The issue may resolve itself shortly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Retrying...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>

        {/* Technical Info */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          <p>Error: CORS policy blocking requests</p>
          <p className="mt-1">Backend: faithbliss-backend.fly.dev</p>
        </div>
      </div>
    </div>
  );
};

export default CorsErrorFallback;