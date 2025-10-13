'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// Enhanced session provider with better token refresh handling
export default function SessionProviderWrapper({ children }: Props) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window regains focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      {children}
    </SessionProvider>
  );
}
