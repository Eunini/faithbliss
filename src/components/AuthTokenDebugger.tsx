/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const AuthTokenDebugger: React.FC = () => {
  const { data: session } = useSession();
  const { user } = useNextAuth();
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testJWTToken = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Import API dynamically
      const { API } = await import('@/services/api');
      
      console.log('Testing JWT token...');
      console.log('Session access token:', session?.accessToken ? 'Present' : 'Missing');
      console.log('Token preview:', session?.accessToken?.substring(0, 20) + '...');
      
      // Test the /users/me endpoint
      const userData = await API.User.getMe();
      
      setTestResult({
        success: true,
        message: 'JWT token is working correctly!',
        details: {
          userId: userData.id,
          email: userData.email,
          name: userData.name,
          tokenType: session?.accessToken?.startsWith('ya29.') ? 'Google OAuth (WRONG)' : 'JWT (CORRECT)',
        }
      });
    } catch (error: any) {
      console.error('JWT test failed:', error);
      
      setTestResult({
        success: false,
        message: 'JWT token test failed',
        details: {
          error: error.message,
          statusCode: error.statusCode,
          isCorsError: error.isCorsError,
          isNetworkError: error.isNetworkError,
          tokenType: session?.accessToken?.startsWith('ya29.') ? 'Google OAuth (WRONG)' : 'JWT or Missing',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Auth Token Debug</h3>
        <button
          onClick={testJWTToken}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Test JWT</span>
            </>
          )}
        </button>
      </div>

      {/* Session Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Session Status:</span>
          <span className={`${session ? 'text-green-400' : 'text-red-400'}`}>
            {session ? 'Active' : 'None'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Access Token:</span>
          <span className={`${session?.accessToken ? 'text-green-400' : 'text-red-400'}`}>
            {session?.accessToken ? 'Present' : 'Missing'}
          </span>
        </div>

        {session?.accessToken && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Token Type:</span>
            <span className={`${
              session.accessToken.startsWith('ya29.') 
                ? 'text-red-400' 
                : 'text-green-400'
            }`}>
              {session.accessToken.startsWith('ya29.') ? 'Google OAuth' : 'JWT'}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">User Loaded:</span>
          <span className={`${user ? 'text-green-400' : 'text-red-400'}`}>
            {user ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className={`p-3 rounded border ${
          testResult.success 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {testResult.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span className="font-medium">{testResult.message}</span>
          </div>
          
          {testResult.details && (
            <pre className="text-xs bg-black/20 p-2 rounded overflow-auto">
              {JSON.stringify(testResult.details, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-400 p-2 bg-blue-500/10 rounded border border-blue-500/30">
        <AlertCircle className="w-3 h-3 inline mr-1" />
        Click &spot;Test JWT&apot; to verify if your backend is receiving the correct JWT token instead of the Google OAuth token.
      </div>
    </div>
  );
};

export default AuthTokenDebugger;