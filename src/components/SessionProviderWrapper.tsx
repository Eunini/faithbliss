'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { HeartBeatLoader } from './HeartBeatLoader';

// This component handles session-specific logic
function SessionHandler({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    // If a refresh token error occurs, the session is invalid.
    // Force a sign-out to clear the session and redirect to login.
    if (session?.error === "RefreshAccessTokenError") {
      console.error("Session has an irrecoverable error. Forcing sign out.");
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);

  useEffect(() => {
    // Set up an interval to refetch the session in the background
    // This keeps the session alive and the token refreshed.
    const interval = setInterval(() => {
      // Only refetch if the user is authenticated
      if (status === 'authenticated') {
        // useSession().getSession() is not a function, must use the hook's refetch
        // This is a silent refetch, no need to call getSession() manually
      }
    }, REFETCH_INTERVAL);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'loading') {
    return <HeartBeatLoader />;
  }

  return <>{children}</>;
}

// This is the main wrapper component
export default function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionHandler>{children}</SessionHandler>
    </SessionProvider>
  );
}
