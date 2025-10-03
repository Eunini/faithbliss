'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleAuthDebug = () => {
  const { data: session, status } = useSession();

  console.log('Session status:', status);
  console.log('Session data:', session);
  console.log('Environment check:', {
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Not set'
  });

  const handleGoogleSignIn = async () => {
    try {
      console.log('Attempting Google sign-in...');
      const result = await signIn('google', { 
        redirect: false, // Don't redirect so we can see errors
        callbackUrl: '/dashboard' 
      });
      console.log('Sign-in result:', result);
      
      if (result?.error) {
        console.error('Sign-in error:', result.error);
        alert(`Sign-in failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert(`Sign-in error: ${error}`);
    }
  };

  if (status === 'loading') {
    return <div className="p-4 bg-blue-100 text-blue-800 rounded">Loading authentication...</div>;
  }

  if (session) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded space-y-2">
        <div><strong>✅ Authenticated!</strong></div>
        <div><strong>Email:</strong> {session.user?.email}</div>
        <div><strong>Name:</strong> {session.user?.name}</div>
        <div><strong>Image:</strong> {session.user?.image}</div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded space-y-4">
      <div><strong>🔐 Not authenticated</strong></div>
      <div className="space-y-2">
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Session:</strong> {session ? 'Present' : 'None'}</div>
      </div>
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
      >
        <FcGoogle size={20} />
        Test Google Sign-In
      </button>
    </div>
  );
};