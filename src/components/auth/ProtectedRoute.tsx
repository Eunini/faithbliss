'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({
  children,
  requireOnboarding = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      // Force onboarding completion check - treat undefined/null as false
      const hasCompletedOnboarding = user.onboardingCompleted === true;
      
      // If user hasn't completed onboarding and is trying to access a NON-onboarding page
      if (!hasCompletedOnboarding && !requireOnboarding) {
        router.push('/onboarding');
        return;
      }

      // If user has completed onboarding but is trying to access the onboarding page
      if (hasCompletedOnboarding && requireOnboarding) {
        router.push('/dashboard');
        return;
      }

      // If we reach here, user is authenticated and on the correct route for their status
    }
  }, [isAuthenticated, isLoading, user, router, requireOnboarding]);

  // Show loading while checking auth
  if (isLoading) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // Show loading while redirecting unauthenticated users
  if (!isAuthenticated) {
    return <HeartBeatLoader message="Redirecting to login..." />;
  }

  // Additional check: Don't render content if user exists but onboarding logic should redirect
  if (user) {
    const hasCompletedOnboarding = user.onboardingCompleted === true;
    
    // Block rendering for incomplete users on non-onboarding pages
    if (!hasCompletedOnboarding && !requireOnboarding) {
      return <HeartBeatLoader message="Redirecting to onboarding..." />;
    }
    
    // Block rendering for complete users on onboarding page
    if (hasCompletedOnboarding && requireOnboarding) {
      return <HeartBeatLoader message="Redirecting to dashboard..." />;
    }
  }

  // If authenticated and passed all checks, render the children
  return <>{children}</>;
}