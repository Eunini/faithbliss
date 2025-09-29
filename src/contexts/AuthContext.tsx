'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  completeOnboarding: (profileData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Load or create user profile
        await loadUserProfile(user);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile;
        setUserProfile(profileData);
        
        // Update last login
        await setDoc(userDocRef, {
          ...profileData,
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await loadUserProfile(result.user);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await loadUserProfile(result.user);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const newProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: displayName,
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newProfile);
      setUserProfile(newProfile);
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  };

  const completeOnboarding = async (profileData: any) => {
    if (!user || !userProfile) return;
    
    try {
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        onboardingCompleted: true,
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    completeOnboarding,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};