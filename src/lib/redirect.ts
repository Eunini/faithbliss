// lib/redirect.ts - Utility for managing redirects
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Constants for redirect paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ONBOARDING: '/onboarding',
  HOME: '/',
};

/**
 * Utility hook to handle authentication-based redirects
 */
export function useAuthRedirect(
  options: {
    ifAuthenticated?: string; // Redirect path if user is authenticated
    ifNotAuthenticated?: string; // Redirect path if user is not authenticated
    requireOnboarding?: boolean; // Whether to check for onboarding completion
    debug?: boolean; // Enable debug logging
  } = {}
) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Destructure options with defaults
  const {
    ifAuthenticated,
    ifNotAuthenticated,
    requireOnboarding = false,
    debug = process.env.NODE_ENV !== 'production',
  } = options;

  useEffect(() => {
    // Don't do anything while loading
    if (status === 'loading') {
      if (debug) {
        console.log('🔄 Auth status is loading, waiting...');
      }
      return;
    }

    // Check if user is authenticated
    const isAuth = !!session?.user;
    
    if (debug) {
      console.log('🔑 Auth status:', status);
      console.log('👤 Session user:', isAuth ? 'Present' : 'Not present');
      console.log('🎫 Access token:', session?.accessToken ? 'Present' : 'Not present');
      
      if (session?.user) {
        console.log('📋 User info:', {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        });
      }
    }

    // Get current path
    const currentPath = window.location.pathname;

    // Handle redirection for authenticated users
    if (isAuth && ifAuthenticated) {
      // Check for onboarding requirement using session data
      const needsOnboarding = requireOnboarding && 
                             !session.user?.onboardingCompleted && 
                             currentPath !== ROUTES.ONBOARDING;
      
      if (needsOnboarding) {
        if (debug) {
          console.log(`🔀 Redirecting to onboarding: ${ROUTES.ONBOARDING}`);
          console.log('   Onboarding status:', session.user?.onboardingCompleted);
        }
        router.replace(ROUTES.ONBOARDING);
      } else if (session.user?.onboardingCompleted && currentPath !== ifAuthenticated) {
        if (debug) {
          console.log(`🔀 User authenticated and onboarded, redirecting to: ${ifAuthenticated}`);
        }
        router.replace(ifAuthenticated);
      }
      return;
    }

    // Handle redirection for non-authenticated users
    if (!isAuth && ifNotAuthenticated && currentPath !== ifNotAuthenticated) {
      if (debug) {
        console.log(`🔀 User not authenticated, redirecting to: ${ifNotAuthenticated}`);
      }
      router.replace(ifNotAuthenticated);
      return;
    }
    
  }, [status, session, ifAuthenticated, ifNotAuthenticated, requireOnboarding, router, debug]);

  return { isLoading: status === 'loading', isAuthenticated: !!session?.user };
}