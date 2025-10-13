/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export const BackendConnectionTest = () => {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults(null);

    const results: any = {
      healthCheck: null,
      apiInfo: null,
      authTest: null,
      errors: []
    };

    try {
      // Test 1: Health Check
      try {
        const healthResponse = await fetch('https://faithbliss-backend.fly.dev/api/health', {
          method: 'GET',
          credentials: 'include'
        });
        results.healthCheck = {
          status: healthResponse.status,
          ok: healthResponse.ok,
          data: healthResponse.ok ? await healthResponse.json() : null
        };
      } catch (error) {
        results.errors.push(`Health check failed: ${error}`);
      }

      // Test 2: API Info
      try {
        const apiResponse = await fetch('https://faithbliss-backend.fly.dev/api', {
          method: 'GET',
          credentials: 'include'
        });
        results.apiInfo = {
          status: apiResponse.status,
          ok: apiResponse.ok,
          data: apiResponse.ok ? await apiResponse.json() : null
        };
      } catch (error) {
        results.errors.push(`API info failed: ${error}`);
      }

      // Test 3: Auth Test (if logged in)
      if (session?.accessToken) {
        try {
          const authResponse = await fetch('https://faithbliss-backend.fly.dev/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          results.authTest = {
            status: authResponse.status,
            ok: authResponse.ok,
            data: authResponse.ok ? await authResponse.json() : null
          };
        } catch (error) {
          results.errors.push(`Auth test failed: ${error}`);
        }
      } else {
        results.authTest = { status: 'skipped', reason: 'No access token available' };
      }

    } catch (error) {
      results.errors.push(`General error: ${error}`);
    } finally {
      setLoading(false);
      setTestResults(results);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Backend Connection Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Backend URL:</strong> https://faithbliss-backend.fly.dev
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Session Status:</strong> {session ? 'Logged In' : 'Not Logged In'}
        </p>
        {session?.accessToken && (
          <p className="text-sm text-gray-600 mb-4">
            <strong>Access Token:</strong> {session.accessToken.substring(0, 20)}...
          </p>
        )}
      </div>

      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>

      {testResults && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Test Results:</h3>
          
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium">Health Check:</h4>
            <pre className="text-sm mt-2">
              {JSON.stringify(testResults.healthCheck, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium">API Info:</h4>
            <pre className="text-sm mt-2">
              {JSON.stringify(testResults.apiInfo, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium">Auth Test:</h4>
            <pre className="text-sm mt-2">
              {JSON.stringify(testResults.authTest, null, 2)}
            </pre>
          </div>

          {testResults.errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-medium text-red-800">Errors:</h4>
              <ul className="text-sm text-red-700 mt-2">
                {testResults.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
