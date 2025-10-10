'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// This wrapper now uses the built-in refetchInterval to keep the session alive.
// NextAuth.js will automatically refetch the session in the background,
// which triggers the `jwt` callback and our token refresh logic.
export default function SessionProviderWrapper({ children }: Props) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
}
