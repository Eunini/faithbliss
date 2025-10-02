/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/NextAuthContext.tsx - New auth context using NextAuth
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';
import { CloudinaryService } from '@/lib/cloudinary';

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
  const loading = status === 'loading';
  const isAuthenticated = !!session?.user;

  // Sync session with user state
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.email || '',
        email: session.user.email || '',
        name: session.user.name || '',
        image: session.user.image || undefined,
        onboardingCompleted: false, // This will be fetched from backend
      });
    } else {
      setUser(null);
    }
  }, [session]);

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
      const uploadResults = await CloudinaryService.uploadMultipleImages(
        photos,
        'faithbliss/profile-photos',
        user.id
      );

      const photoUrls = uploadResults.map(result => result.secure_url);

      // Update user profile with new photo URLs
      setUser(prev => prev ? {
        ...prev,
        profilePhotos: {
          photo1: photoUrls[0] || prev.profilePhotos?.photo1,
          photo2: photoUrls[1] || prev.profilePhotos?.photo2,
          photo3: photoUrls[2] || prev.profilePhotos?.photo3,
        }
      } : null);

      return photoUrls;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  };

  const completeOnboarding = async (profileData: any): Promise<void> => {
    if (!user?.email) {
      throw new Error('User must be authenticated to complete onboarding');
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      
      const response = await fetch(`${backendUrl}/auth/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...profileData,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to complete onboarding');
      }

      const updatedUser = await response.json();
      
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        onboardingCompleted: true,
        ...updatedUser,
      } : null);

    } catch (error) {
      console.error('Onboarding completion error:', error);
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