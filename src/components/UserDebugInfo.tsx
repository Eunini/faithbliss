// components/UserDebugInfo.tsx - Debug component to show user information
'use client';

import { useNextAuth } from '@/contexts/NextAuthContext';
import { useSession } from 'next-auth/react';

export const UserDebugInfo = () => {
  const { user, isAuthenticated } = useNextAuth();
  const { data: session } = useSession();

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 left-4 bg-red-900 text-white p-4 rounded-lg text-sm max-w-xs z-50">
        <h3 className="font-bold mb-2">🔓 Not Authenticated</h3>
        <p>User is not signed in</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-green-900 text-white p-4 rounded-lg text-sm max-w-xs z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">👤 User Debug Info</h3>
      
      <div className="space-y-2">
        <div>
          <strong>User ID (from context):</strong>
          <p className="text-xs break-all">{user?.id || 'N/A'}</p>
        </div>
        
        <div>
          <strong>Email:</strong>
          <p className="text-xs break-all">{user?.email || 'N/A'}</p>
        </div>
        
        <div>
          <strong>Name:</strong>
          <p className="text-xs">{user?.name || 'N/A'}</p>
        </div>

        <div>
          <strong>Session User ID:</strong>
          <p className="text-xs break-all">{session?.userId || 'N/A'}</p>
        </div>

        <div>
          <strong>Session Email:</strong>
          <p className="text-xs break-all">{session?.user?.email || 'N/A'}</p>
        </div>

        <div>
          <strong>ID matches Email:</strong>
          <p className="text-xs">{user?.id === user?.email ? '✅ Yes' : '❌ No'}</p>
        </div>

        <div>
          <strong>Onboarding:</strong>
          <p className="text-xs">{user?.onboardingCompleted ? '✅ Complete' : '❌ Incomplete'}</p>
        </div>
      </div>
      
      <button
        onClick={() => console.log('Full session data:', session, 'User context:', user)}
        className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
      >
        Log to Console
      </button>
    </div>
  );
};