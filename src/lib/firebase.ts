/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;
let isInitialized = false;

const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  console.log('Firebase config check:', {
    hasApiKey: !!config.apiKey,
    hasAuthDomain: !!config.authDomain,
    hasProjectId: !!config.projectId,
    apiKeyPrefix: config.apiKey?.substring(0, 10) + '...'
  });
  
  return config;
};

const initializeFirebase = () => {
  if (isInitialized || typeof window === "undefined") return;
  
  try {
    const config = getFirebaseConfig();
    
    // Check if all required config values exist
    const hasAllConfig = config.apiKey && config.authDomain && config.projectId && 
                        config.storageBucket && config.messagingSenderId && config.appId;
    
    if (!hasAllConfig) {
      console.warn('Firebase config incomplete, skipping initialization');
      return;
    }
    
    // Initialize Firebase app
    app = getApps().length ? getApp() : initializeApp(config);
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize Google Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    
    isInitialized = true;
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
};

// Initialize Firebase immediately on client side
if (typeof window !== "undefined") {
  initializeFirebase();
}

// Export the actual service instances directly
export { app, auth, db, googleProvider };
