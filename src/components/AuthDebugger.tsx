// components/AuthDebugger.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthDebugger = () => {
  const { user, userProfile } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded text-xs z-50"
      >
        Debug Auth
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm text-xs z-50 border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Auth Debug</h3>
        <button onClick={() => setShowDebug(false)} className="text-gray-400 hover:text-white">×</button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>User:</strong> {user ? '✓ Logged in' : '✗ Not logged in'}
        </div>
        {user && (
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        )}
        <div>
          <strong>Profile:</strong> {userProfile ? '✓ Loaded' : '✗ No profile'}
        </div>
        {userProfile && (
          <div>
            <strong>Onboarding:</strong> {userProfile.onboardingCompleted ? '✓ Complete' : '✗ Incomplete'}
          </div>
        )}
        <div>
          <strong>Network:</strong> {navigator.onLine ? '✓ Online' : '✗ Offline'}
        </div>
      </div>
    </div>
  );
};