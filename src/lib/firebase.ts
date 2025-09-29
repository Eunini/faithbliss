// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyDfp9hSAixfiNkT42ZXAblxpjQgLr_MSA8",
  authDomain: "faithbliss-2c799.firebaseapp.com",
  projectId: "faithbliss-2c799",
  storageBucket: "faithbliss-2c799.firebasestorage.app",
  messagingSenderId: "924057249769",
  appId: "1:924057249769:web:524a3d5de6bc93d8b80d78",
  measurementId: "G-C6QWDXQ76E"
};

// Ensure Firebase isn’t initialized more than once (Next.js hot reload issue)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Optional: Analytics (only in browser, not during SSR)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, analytics };
