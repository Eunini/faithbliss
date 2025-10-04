/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/NextAuthContext.tsx - New auth context using NextAuth
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { ErrorHandler, type ApiError } from '@/lib/errorHandler';


interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  onboardingCompleted?: boolean;
  profilePhotos?: {
    photo1?: string;
    photo2?: string;
    photo3?: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasConnectionError: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  uploadProfilePhotos: (photos: File[]) => Promise<string[]>;
  completeOnboarding: (profileData: any) => Promise<void>;
  retryConnection: () => Promise<void>;
}

const NextAuthContext = createContext<AuthContextType | null>(null);

export const useNextAuth = () => {
  const context = useContext(NextAuthContext);
  if (!context) {
    throw new Error('useNextAuth must be used within a NextAuthProvider');
  }
  return context;
};

interface NextAuthProviderProps {
  children: ReactNode;
}

const NextAuthProviderInner = ({ children }: NextAuthProviderProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Safe toast hook usage with fallback for SSR
  let showError: (message: string, title?: string) => void;
  let showWarning: (message: string, title?: string) => void;
  
  try {
    const toast = useToast();
    showError = toast.showError;
    showWarning = toast.showWarning;
  } catch {
    // Fallback for SSR or when context is not available
    showError = (message: string, title?: string) => {
      console.error(`${title || 'Error'}:`, message);
    };
    showWarning = (message: string, title?: string) => {
      console.warn(`${title || 'Warning'}:`, message);
    };
  }
  
  const loading = status === 'loading';
  const isAuthenticated = !!session?.user && !!session?.accessToken;

  // Sync session with user state and fetch from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          // Import API dynamically to avoid circular dependencies
          const { API } = await import('@/services/api');
          const backendUser = await API.User.getMe();
          
          setUser({
            id: backendUser.id || session.user.email,
            email: backendUser.email || session.user.email,
            name: backendUser.name || session.user.name || '',
            image: backendUser.profilePhotos?.photo1 || session.user.image || undefined,
            onboardingCompleted: backendUser.onboardingCompleted || false,
            profilePhotos: backendUser.profilePhotos,
          });
        } catch (error) {
          console.error('Failed to fetch user from backend:', error);
          
          const apiError = error as ApiError & { isAuthError?: boolean };
          
          // Check if it's an authentication error (invalid/expired JWT)
          if (apiError.statusCode === 401 || apiError.isAuthError) {
            console.log('🔄 JWT token expired, signing out user...');
            showError(
              'Your session has expired. Please sign in again.',
              'Session Expired'
            );
            // Sign out the user to clear invalid tokens
            const { signOut } = await import('next-auth/react');
            await signOut({ callbackUrl: '/login' });
            return;
          }
          
          // Check if it's a CORS or network error
          if (apiError.isCorsError || apiError.isNetworkError) {
            setHasConnectionError(true);
            showError(
              'Unable to connect to our servers. Please check your internet connection or try again later.',
              'Connection Problem'
            );
          } else {
            // Use centralized error handler for other errors
            ErrorHandler.handleApiError(
              apiError, 
              (type, message, title) => {
                if (type === 'error') {
                  showError(message, title);
                } else {
                  showWarning(message, title);
                }
              },
              {
                title: 'Profile Load Error',
                message: 'Unable to load your profile data. Some features may be limited.'
              }
            );
          }
          
          // Fallback to session data
          setUser({
            id: session.user.email,
            email: session.user.email,
            name: session.user.name || '',
            image: session.user.image || undefined,
            onboardingCompleted: false,
          });
        }
      } else {
        setUser(null);
      }
    };

    if (session?.user) {
      fetchUserData();
    } else {
      setUser(null);
    }
  }, [session, showError, showWarning]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      // Important: Set redirect to false to prevent NextAuth from handling redirects
      // We'll handle redirects ourselves in the useEffect based on user data
      const result = await signIn('google', { 
        redirect: false
      });
      
      if (!result?.ok) {
        console.error('Google sign-in failed:', result?.error);
        throw new Error(result?.error || 'Failed to sign in with Google');
      }
      
      // Don't redirect here - we'll do it in the useEffect hook
      // after the user data is loaded from the backend
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  const uploadProfilePhotos = async (photos: File[]): Promise<string[]> => {
    if (!user?.id) {
      throw new Error('User must be authenticated to upload photos');
    }

    try {
      // Use backend API for photo upload instead of direct Cloudinary
      const { API } = await import('@/services/api');
      
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photo${index + 1}`, photo);
      });
      
      const uploadResult = await API.User.uploadPhotos(formData);

      // Update user profile with new photo URLs
      setUser(prev => prev ? {
        ...prev,
        profilePhotos: {
          photo1: uploadResult[0]?.url,
          photo2: uploadResult[1]?.url,
          photo3: uploadResult[2]?.url,
        },
      } : null);

      const photoUrls = uploadResult.map(photo => photo.url).filter(Boolean);
      return photoUrls;
    } catch (error) {
      console.error('Photo upload error:', error);
      
      // Handle photo upload errors with user-friendly messages
      const apiError = error as ApiError;
      ErrorHandler.handleApiError(
        apiError,
        (type, message, title) => {
          if (type === 'error') {
            showError(message, title);
          } else {
            showWarning(message, title);
          }
        }
      );
      
      throw error;
    }
  };

  const completeOnboarding = async (profileData: any): Promise<void> => {
    if (!user?.email) {
      throw new Error('User must be authenticated to complete onboarding');
    }

    try {
      // Import API dynamically to avoid circular dependencies
      const { API } = await import('@/services/api');
      
      const updatedUser = await API.Auth.completeOnboarding({
        ...profileData,
        email: user.email,
      });
      
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        onboardingCompleted: true,
        ...updatedUser,
      } : null);

    } catch (error) {
      console.error('Onboarding completion error:', error);
      
      // Handle onboarding errors with user-friendly messages
      const apiError = error as ApiError;
      ErrorHandler.handleApiError(
        apiError,
        (type, message, title) => {
          if (type === 'error') {
            showError(message, title);
          } else {
            showWarning(message, title);
          }
        },
        {
          title: 'Onboarding Error',
          message: 'Unable to complete your profile setup. Please try again.'
        }
      );
      
      throw error;
    }
  };

  const retryConnection = async (): Promise<void> => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setHasConnectionError(false);
    
    try {
      if (session?.user?.email) {
        const { API } = await import('@/services/api');
        const backendUser = await API.User.getMe();
        
        setUser({
          id: backendUser.id || session.user.email,
          email: backendUser.email || session.user.email,
          name: backendUser.name || session.user.name || '',
          image: backendUser.profilePhotos?.photo1 || session.user.image || undefined,
          onboardingCompleted: backendUser.onboardingCompleted || false,
          profilePhotos: backendUser.profilePhotos,
        });
        
        setHasConnectionError(false);
      }
    } catch (error) {
      console.error('Retry connection failed:', error);
      const apiError = error as ApiError;
      
      if (apiError.isCorsError || apiError.isNetworkError) {
        setHasConnectionError(true);
        showError(
          'Connection is still unavailable. Please try again in a moment.',
          'Still Having Connection Issues'
        );
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    hasConnectionError,
    signInWithGoogle,
    signOutUser,
    uploadProfilePhotos,
    completeOnboarding,
    retryConnection,
  };

  return (
    <NextAuthContext.Provider value={contextValue}>
      {children}
    </NextAuthContext.Provider>
  );
};

// Main provider that wraps with SessionProvider
export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  return (
    <SessionProvider>
      <NextAuthProviderInner>
        {children}
      </NextAuthProviderInner>
    </SessionProvider>
  );
};