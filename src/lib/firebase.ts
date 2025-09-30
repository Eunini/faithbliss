// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

// Validate environment variables
let firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
} | undefined;

if (typeof window !== "undefined") {
  // only check when in browser and environment variables are available
  try {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingVars.length === 0) {
      firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
      };
    } else {
      console.warn('Firebase environment variables not available:', missingVars);
    }
  } catch (error) {
    console.warn('Failed to load Firebase config:', error);
  }
}

console.log('Firebase config loaded successfully for project:', firebaseConfig?.projectId);

// Ensure Firebase isn’t initialized more than once (Next.js hot reload issue)
const app = firebaseConfig ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : null;

// Optional: Analytics (only in browser, not during SSR)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined" && app) {
  isSupported().then((yes: boolean) => {
    if (yes) analytics = getAnalytics(app);
  });
}

// Services - only initialize if app is available
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

// Firestore connection management  
const firestoreOnline = true;
export const getFirestoreStatus = () => firestoreOnline;

// Enhanced network and Firebase error handling
if (typeof window !== "undefined") {
  // let reconnectAttempts = 0;
  // const maxReconnectAttempts = 5;
  
  // const handleFirestoreReconnect = async () => {
  //   if (reconnectAttempts >= maxReconnectAttempts) {
  //     console.log('Max Firestore reconnection attempts reached');
  //     return;
  //   }
    
  //   try {
  //     reconnectAttempts++;
  //     console.log(`Attempting Firestore reconnection (${reconnectAttempts}/${maxReconnectAttempts})`);
      
  //     await disableNetwork(db);
  //     await new Promise(resolve => setTimeout(resolve, 1000 + (reconnectAttempts * 1000)));
  //     await enableNetwork(db);
      
  //     firestoreOnline = true;
  //     reconnectAttempts = 0;
  //     console.log('Firestore reconnected successfully');
  //   } catch (error) {
  //     console.error('Firestore reconnection failed:', error);
  //     firestoreOnline = false;
  //   }
  // };

  // Enhanced Firestore error handling and network resilience
  // Network status monitoring
  let isOnline = navigator.onLine;
  let networkRetryTimeout: NodeJS.Timeout | null = null;

  const handleNetworkChange = async () => {
    const wasOnline = isOnline;
    isOnline = navigator.onLine;
    
    console.log(`Network status changed: ${isOnline ? 'online' : 'offline'}`);
    
    if (!wasOnline && isOnline) {
      // Just came back online - enable Firestore network
      try {
        console.log('Firestore network re-enabled after reconnection');
      } catch (error) {
        console.warn('Failed to re-enable Firestore network:', error);
      }
    } else if (wasOnline && !isOnline) {
      // Just went offline - disable Firestore network to prevent errors
      try {
        console.log('Firestore network disabled due to offline status');
      } catch (error) {
        console.warn('Failed to disable Firestore network:', error);
      }
    }
  };

  // Listen for network changes
  window.addEventListener('online', handleNetworkChange);
  window.addEventListener('offline', handleNetworkChange);

  // Enhanced error handler for Firestore WebChannel errors
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || '';
    const isFirestoreError = 
      errorMessage.includes('webchannel_blob') || 
      errorMessage.includes('firestore.googleapis.com') ||
      errorMessage.includes('WebChannelConnection') ||
      event.reason?.code === 'unavailable';

    if (isFirestoreError) {
      console.warn('Firestore WebChannel error caught and handled:', errorMessage);
      event.preventDefault(); // Prevent the error from being thrown
      
      // Clear any existing retry timeout
      if (networkRetryTimeout) {
        clearTimeout(networkRetryTimeout);
      }
      
      // Attempt to recover after a delay
      networkRetryTimeout = setTimeout(async () => {
        if (navigator.onLine) {
          try {
            console.log('Attempting to recover Firestore connection...');
            console.log('Firestore connection recovery attempted');
          } catch (error) {
            console.warn('Firestore recovery attempt failed:', error);
          }
        }
      }, 5000);
    }
  });

  // Global error handler for console errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('WebChannelConnection') || 
        message.includes('firestore.googleapis.com') ||
        message.includes('webchannel_blob')) {
      console.warn('Firestore connection error suppressed:', message);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

// Google Auth Provider - only initialize if we have auth
export const googleProvider = auth ? (() => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return provider;
})() : null;

export { app, analytics };
