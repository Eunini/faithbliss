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
    } else if (!loading && isAuthenticated && user && !user.onboardingCompleted) {
      // Redirect to onboarding if user hasn't completed it
      router.push('/onboarding');
    }
  }, [isAuthenticated, loading, router, redirectTo, user]);

  // Show loading screen while checking authentication
  if (loading) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Don't render children if onboarding is not completed
  if (!user.onboardingCompleted) {
    return <HeartBeatLoader message="Redirecting to onboarding..." />;
  }

  return <>{children}</>;
}