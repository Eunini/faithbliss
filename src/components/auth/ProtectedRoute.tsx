'use client';

import { useSession } from 'next-auth/react';
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // If user is authenticated but hasn't completed onboarding
      // and we're not on the onboarding page, redirect to onboarding
      if (requireOnboarding && !session.user.onboardingCompleted) {
        router.push('/onboarding');
        return;
      }

      // If user has completed onboarding but is trying to access onboarding page
      if (!requireOnboarding && session.user.onboardingCompleted) {
        router.push('/dashboard');
        return;
      }
    }
  }, [session, status, router, requireOnboarding]);

  // Show loading while session is being validated
  if (status === 'loading') {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (status === 'unauthenticated') {
    return <HeartBeatLoader message="Redirecting to login..." />;
  }

  // If authenticated, render the children
  return <>{children}</>;
}