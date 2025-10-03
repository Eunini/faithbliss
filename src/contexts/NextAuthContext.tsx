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
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  uploadProfilePhotos: (photos: File[]) => Promise<string[]>;
  completeOnboarding: (profileData: any) => Promise<void>;
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
  const { showError, showWarning } = useToast();
  const loading = status === 'loading';
  const isAuthenticated = !!session?.user;

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
          
          // Use centralized error handler
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
              title: 'Profile Load Error',
              message: 'Unable to load your profile data. Some features may be limited.'
            }
          );
          
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
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
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

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    signInWithGoogle,
    signOutUser,
    uploadProfilePhotos,
    completeOnboarding,
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