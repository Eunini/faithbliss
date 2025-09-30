/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
// import { doc, getDoc, setDoc } from 'firebase/firestore'; // Commented out to avoid permissions error
import { auth, db, googleProvider } from '@/lib/firebase';
// import { retryFirestoreOperation } from '@/lib/firestoreUtils'; // Commented out with Firestore operations

interface AuthUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: any;
  userProfile: AuthUserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  completeOnboarding: (profileData: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is initialized
    if (!auth || !db) {
      console.warn('Firebase services not available, authentication disabled');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        setUser(user);
        // Load or create user profile with network error handling
        try {
          await loadUserProfile(user);
        } catch (error: any) {
          console.warn('Failed to load user profile, continuing with authentication only:', error.message);
          // Still set the user even if profile loading fails
          const fallbackProfile: AuthUserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (user: any) => {
    try {
      console.log('Loading profile for user:', user.uid, user.email);
      // FIRESTORE OPERATIONS COMMENTED OUT TO AVOID PERMISSIONS ERROR
      // Create a mock profile for testing without Firestore
      const mockProfile: AuthUserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Test User',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      console.log('Using mock profile data:', mockProfile);
      setUserProfile(mockProfile);
      
      // // Original Firestore operations (commented out)
      // if (!db) throw new Error('Firestore not initialized');
      // const userDocRef = doc(db, 'users', user.uid);
      // const userDoc: any = await retryFirestoreOperation(() => getDoc(userDocRef), 3, 1000);
      // if (userDoc.exists()) {
      //   const profileData = userDoc.data() as AuthUserProfile;
      //   setUserProfile(profileData);
      // } else {
      //   const newProfile: AuthUserProfile = { ... };
      //   await retryFirestoreOperation(() => setDoc(userDocRef, newProfile), 3, 1000);
      //   setUserProfile(newProfile);
      // }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  const signInWithGoogle = async () => {
    console.log('Firebase services check:', { auth: !!auth, db: !!db, googleProvider: !!googleProvider });
    
    if (!auth || !db || !googleProvider) {
      console.error('Firebase services not initialized:', { auth: !!auth, db: !!db, googleProvider: !!googleProvider });
      throw new Error('Firebase not initialized');
    }
    
    try {
      console.log('AuthContext: Starting Google sign-in...');
      
      // Check network status before attempting sign-in
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
      
      // Try popup first, fallback to redirect if popup is blocked
      const result = await signInWithPopup(auth, googleProvider);
      console.log('AuthContext: Popup sign-in successful, loading profile...');
      
      // Load profile with resilience - don't fail the entire sign-in if profile loading fails
      try {
        await loadUserProfile(result.user);
        console.log('AuthContext: Profile loaded successfully');
      } catch (profileError: any) {
        console.warn('Profile loading failed during sign-in, continuing with basic user data:', profileError.message);
        // Set basic profile data even if Firestore operations fail
        setUserProfile({
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        });
      }
      
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-blocked') {
        const enhancedError = new Error('Popup blocked by browser') as any;
        enhancedError.code = 'auth/popup-blocked';
        throw enhancedError;
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup - this is not really an error, just cancelled
        const enhancedError = new Error('Sign-in was cancelled. Please try again.') as any;
        enhancedError.code = 'auth/popup-closed-by-user';
        throw enhancedError;
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Another popup request was made before the previous one completed
        const enhancedError = new Error('Another sign-in attempt is already in progress') as any;
        enhancedError.code = 'auth/cancelled-popup-request';
        throw enhancedError;
      } else if (error.message?.includes('No internet connection')) {
        // Re-throw network errors as-is
        throw error;
      }
      
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    
    try {
      console.log('Attempting email sign-in for:', email);
      
      // Check network status first
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in successful, loading profile...');
      
      // Load profile with resilience
      try {
        await loadUserProfile(result.user);
        console.log('Profile loaded successfully after email sign-in');
      } catch (profileError: any) {
        console.warn('Profile loading failed during email sign-in, continuing with basic user data:', profileError.message);
        // Set basic profile data even if Firestore operations fail
        setUserProfile({
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || email.split('@')[0], // Use email prefix as fallback
          photoURL: result.user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Email sign in error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else if (error.message?.includes('No internet connection')) {
        throw error; // Re-throw network errors as-is
      } else {
        throw new Error(error.message || 'Sign-in failed. Please try again.');
      }
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    
    try {
      console.log('Creating account for:', email, 'with display name:', displayName);
      
      // Check network status first
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created successfully, setting up profile...');
      
      // Create user profile in Firestore
      const newProfile: AuthUserProfile = {
        uid: result.user.uid,
        email: result.user.email || email,
        displayName: displayName,
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // FIRESTORE OPERATIONS COMMENTED OUT TO AVOID PERMISSIONS ERROR
      // try {
      //   await retryFirestoreOperation(
      //     () => setDoc(doc(db, 'users', result.user.uid), newProfile),
      //     3,
      //     1000
      //   );
      //   console.log('Profile created successfully in Firestore');
      // } catch (firestoreError: any) {
      //   console.warn('Firestore profile creation failed, using local profile:', firestoreError.message);
      // }
      console.log('Profile creation bypassed (Firestore disabled for testing)');
      
      setUserProfile(newProfile);
    } catch (error: any) {
      console.error('Email sign up error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email sign-up is not enabled. Please contact support.');
      } else if (error.message?.includes('No internet connection')) {
        throw error; // Re-throw network errors as-is
      } else {
        throw new Error(error.message || 'Account creation failed. Please try again.');
      }
    }
  };

  const completeOnboarding = async (profileData: any) => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    if (!user || !userProfile) return;
    
    try {
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        onboardingCompleted: true,
        lastLoginAt: new Date().toISOString()
      };
      
      // FIRESTORE OPERATIONS COMMENTED OUT TO AVOID PERMISSIONS ERROR
      // await retryFirestoreOperation(
      //   () => setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true }),
      //   3,
      //   1000
      // );
      console.log('Profile update bypassed (Firestore disabled for testing)');
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    
    try {
      console.log('Sending password reset email to:', email);
      
      // Check network status first
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
      
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many password reset attempts. Please try again later.');
      } else if (error.message?.includes('No internet connection')) {
        throw error; // Re-throw network errors as-is
      } else {
        throw new Error(error.message || 'Failed to send password reset email. Please try again.');
      }
    }
  };

  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    
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
    resetPassword,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};