/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

// Types for direct authentication
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  denomination: string;
  location: string;
  bio: string;
}

interface AuthResponse {
  message: string;
  accessToken: string;
  id: string;
  email: string;
  name: string;
  onboardingCompleted: boolean;
  accessTokenExpiresIn: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  onboardingCompleted: boolean;
}

export function useAuth(requireAuth: boolean = true) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  
  // Auth state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [directUser, setDirectUser] = useState<User | null>(null);
  const [directAccessToken, setDirectAccessToken] = useState<string | null>(null);

  // Check for stored direct auth data on mount
  useEffect(() => {
    const checkDirectAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setDirectAccessToken(token);
          setDirectUser(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        // Only set loading to false when both NextAuth and direct auth are checked
        if (status !== 'loading') {
          setIsLoading(false);
        }
      }
    };

    checkDirectAuth();
  }, [status]);

  // Update loading state when NextAuth status changes
  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  // Determine authentication status (either NextAuth OR direct auth)
  const isNextAuthAuthenticated = status === 'authenticated' && !!session?.user;
  const isDirectAuthenticated = !!(directAccessToken && directUser);
  const isAuthenticated = isNextAuthAuthenticated || isDirectAuthenticated;

  // Get user data from either auth method - Fixed type issue
  const user: User | null = directUser || (session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    onboardingCompleted: session.user.onboardingCompleted || false,
  } : null);

  // Get access token from either auth method
  const accessToken = directAccessToken || session?.accessToken;
  
  // Token refresh function
  const refreshTokenIfNeeded = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) return token;

      // Check if token is expired by making a test request
      const response = await fetch(`${backendUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshResponse = await fetch(`${backendUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('accessToken', data.accessToken);
          setDirectAccessToken(data.accessToken);
          return data.accessToken;
        } else {
          // Refresh failed - clear auth state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setDirectUser(null);
          setDirectAccessToken(null);
          return null;
        }
      }

      return token;
    } catch (error) {
      console.error('Token refresh check failed:', error);
      return token; // Return existing token if check fails
    }
  }, []);

  // Function to refetch user data after successful operations
  const refetchUser = useCallback(async () => {
    const token = directAccessToken || localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) return;

      const response = await fetch(`${backendUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        const userToStore: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          onboardingCompleted: userData.onboardingCompleted,
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        setDirectUser(userToStore);
      }
    } catch (error) {
      console.error('Failed to refetch user data:', error);
    }
  }, [directAccessToken]);

  // Periodically check and refresh token
  useEffect(() => {
    if (directAccessToken) {
      const interval = setInterval(refreshTokenIfNeeded, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [directAccessToken, refreshTokenIfNeeded]);

  // Direct login function
  const directLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoggingIn(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL not configured');
      }

      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const result = await response.json();
      
      // Fetch user data from backend
      const userResponse = await fetch(`${backendUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.accessToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      let userData = null;
      if (userResponse.ok) {
        userData = await userResponse.json();
      }

      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', result.accessToken);
        if (userData) {
          const userToStore: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            onboardingCompleted: userData.onboardingCompleted,
          };
          localStorage.setItem('user', JSON.stringify(userToStore));
          setDirectUser(userToStore);
        }
        setDirectAccessToken(result.accessToken);
      }

      showSuccess('Welcome back!', 'Login Successful');
      return result;
    } catch (error: any) {
      showError(error.message || 'Login failed', 'Authentication Error');
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, [showSuccess, showError]);

  // Direct register function
  const directRegister = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsRegistering(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL not configured');
      }

      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      
      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', result.accessToken);
        const userToStore: User = {
          id: result.id,
          email: result.email,
          name: result.name,
          onboardingCompleted: result.onboardingCompleted || false,
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        setDirectAccessToken(result.accessToken);
        setDirectUser(userToStore);
      }

      showSuccess('Account created successfully!', 'Registration Successful');
      return result;
    } catch (error: any) {
      showError(error.message || 'Registration failed', 'Registration Error');
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [showSuccess, showError]);

  // Universal logout function (handles both auth methods)
  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      // Clear direct auth
      const token = localStorage.getItem('accessToken');
      if (token) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (backendUrl) {
          try {
            await fetch(`${backendUrl}/auth/logout`, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
              },
              credentials: 'include',
            });
          } catch (error) {
            console.error('Backend logout failed:', error);
            // Continue with client-side cleanup even if backend fails
          }
        }
      }

      // Clear ALL client-side storage
      if (typeof window !== 'undefined') {
        localStorage.clear(); // Clear everything to be safe
        sessionStorage.clear(); // Clear session storage too
        
        // Clear any cookies by setting them to expire
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      }
      
      setDirectAccessToken(null);
      setDirectUser(null);

      // Clear NextAuth session (in case user used Google)
      if (session) {
        await signOut({ redirect: false });
      }

      showSuccess('You have been logged out', 'Logout Successful');
      
      // Force a hard redirect to ensure complete cleanup
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push('/login');
      }
    } catch (error: any) {
      // Clear everything even if requests fail
      console.error('Logout error:', error);
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      }
      
      setDirectAccessToken(null);
      setDirectUser(null);
      
      if (session) {
        await signOut({ redirect: false });
      }
      
      // Force hard redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push('/login');
      }
    } finally {
      setIsLoggingOut(false);
    }
  }, [showSuccess, router, session]);

  // Redirect logic
  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  return {
    // Auth state
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    session, // For NextAuth compatibility
    status,  // For NextAuth compatibility
    
    // Auth functions
    directLogin,
    directRegister,
    logout,
    refreshTokenIfNeeded,
    refetchUser,
    
    // Loading states
    isLoggingIn,
    isRegistering,
    isLoggingOut,
  };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useOptionalAuth() {
  return useAuth(false);
}