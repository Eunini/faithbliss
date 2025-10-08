'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireOnboarding?: boolean; // If true, requires onboarding to be completed
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireOnboarding = true 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useNextAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to load
    }

    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      router.push(redirectTo);
      return;
    }

    // If authenticated, check onboarding status
    if (user) {
      if (requireOnboarding && !user.onboardingCompleted && pathname !== '/onboarding') {
        // If onboarding is required but not completed, and we are not on the onboarding page, redirect there
        router.push('/onboarding');
      } else if (user.onboardingCompleted && (pathname === '/onboarding' || pathname === '/login')) {
        // If onboarding is completed and the user is on the onboarding or login page, redirect to the dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router, redirectTo, user, requireOnboarding, pathname]);

  // While loading, show a loader
  if (loading || !isAuthenticated) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // If authenticated and onboarding is complete, or if we are on the onboarding page, render the children
  if (isAuthenticated && (user?.onboardingCompleted || pathname === '/onboarding')) {
    return <>{children}</>;
  }

  // Fallback loader while redirecting
  return <HeartBeatLoader message="Redirecting..." />;
}