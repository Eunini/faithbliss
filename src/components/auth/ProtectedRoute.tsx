'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useNextAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  // Show loading screen while checking authentication
  if (loading) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}