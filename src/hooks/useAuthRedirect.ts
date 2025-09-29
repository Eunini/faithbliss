'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requireOnboarding?: boolean;
}

export const useAuthRedirect = ({ 
  redirectTo = '/login', 
  requireOnboarding = false 
}: UseAuthRedirectOptions = {}) => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to load

    // Redirect to login if not authenticated
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Redirect to onboarding if required and not completed
    if (requireOnboarding && userProfile && !userProfile.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    // Redirect to dashboard if user is authenticated but on auth pages
    if (user && userProfile?.onboardingCompleted && 
        (window.location.pathname === '/login' || 
         window.location.pathname === '/signup' || 
         window.location.pathname === '/onboarding')) {
      router.push('/dashboard');
    }
  }, [user, userProfile, loading, router, redirectTo, requireOnboarding]);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isOnboarded: !!userProfile?.onboardingCompleted
  };
};