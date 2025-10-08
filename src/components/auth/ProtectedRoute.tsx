'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useNextAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Wait for the authentication status to resolve
    }

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
      if (pathname !== redirectTo) {
        router.push(redirectTo);
      }
      return;
    }

    // If the user is authenticated, proceed with onboarding checks
    if (user) {
      const onboardingComplete = user.onboardingCompleted;
      const isOnboardingPage = pathname === '/onboarding';

      // If onboarding is not complete and the user is not on the onboarding page, redirect them there
      if (!onboardingComplete && !isOnboardingPage) {
        router.push('/onboarding');
        return;
      }

      // If onboarding is complete but the user is on the onboarding or login page, redirect to the dashboard
      if (onboardingComplete && (isOnboardingPage || pathname === redirectTo)) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, user, pathname, router, redirectTo]);

  // --- Render Logic ---

  // While authentication is in progress, show a loader
  if (loading) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // If authenticated and the user's status allows access to the current page, render the content
  if (isAuthenticated && user) {
    const onboardingComplete = user.onboardingCompleted;
    const isOnboardingPage = pathname === '/onboarding';

    // Render children if:
    // 1. Onboarding is complete and the user is NOT on a restricted page (like onboarding).
    // 2. Onboarding is NOT complete and the user IS on the onboarding page.
    if ((onboardingComplete && !isOnboardingPage) || (!onboardingComplete && isOnboardingPage)) {
      return <>{children}</>;
    }
  }

  // If the user is being redirected, show a loader to prevent flashing content
  return <HeartBeatLoader message="Verifying access..." />;
}