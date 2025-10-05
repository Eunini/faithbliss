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
    if (!loading && !isAuthenticated) {
      // Not authenticated - redirect to login
      router.push(redirectTo);
    } else if (!loading && isAuthenticated && user && requireOnboarding) {
      // Authenticated but need to check onboarding
      if (!user.onboardingCompleted && pathname !== '/onboarding') {
        // Not onboarded and not on onboarding page - redirect to onboarding
        router.push('/onboarding');
      } else if (user.onboardingCompleted && pathname === '/onboarding') {
        // Already onboarded but on onboarding page - redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router, redirectTo, user, requireOnboarding, pathname]);

  // Show loading screen while checking authentication
  if (loading) {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // For onboarding page specifically, allow rendering even if not onboarded
  if (pathname === '/onboarding' && !user.onboardingCompleted) {
    return <>{children}</>;
  }

  // For other pages, check if onboarding is required and completed
  if (requireOnboarding && !user.onboardingCompleted) {
    return <HeartBeatLoader message="Redirecting to onboarding..." />;
  }

  return <>{children}</>;
}