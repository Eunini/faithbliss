'use client';

import { useNextAuth } from '@/contexts/NextAuthContext';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useNextAuth();

  // Show loading while checking authentication
  if (loading) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // If not authenticated, don't render (middleware handles redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // User is authenticated, render children (middleware handles onboarding redirects)
  return <>{children}</>;
}