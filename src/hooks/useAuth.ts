'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

export function useAuth(requireAuth: boolean = true) {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/login');
    }

    // This is a failsafe. If the session has an error (e.g., RefreshAccessTokenError),
    // it indicates the refresh token is invalid. In this case, we should force a sign-out.
    if (session?.error === "RefreshAccessTokenError") {
      handleSignOut();
    }
  }, [status, requireAuth, router, session, handleSignOut]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    accessToken: session?.accessToken,
    update, // Expose the update function
    signOut: handleSignOut, // Expose a safe sign-out function
  };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useOptionalAuth() {
  return useAuth(false);
}
