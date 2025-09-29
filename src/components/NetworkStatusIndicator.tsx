/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);
  const [firestoreIssues, setFirestoreIssues] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setFirestoreIssues(false);
      setShowIndicator(true);
      // Hide success indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    // Listen for Firestore connection issues
    const handleFirestoreError = (event: any) => {
      const errorMessage = event.reason?.message || '';
      const isFirestoreError = 
        errorMessage.includes('webchannel_blob') || 
        errorMessage.includes('firestore.googleapis.com') ||
        errorMessage.includes('WebChannelConnection');

      if (isFirestoreError) {
        setFirestoreIssues(true);
        setShowIndicator(true);
        // Hide Firestore issue indicator after 10 seconds
        setTimeout(() => {
          setFirestoreIssues(false);
          if (isOnline) setShowIndicator(false);
        }, 10000);
      }
    };

    // Set initial state
    setIsOnline(navigator.onLine);
    setShowIndicator(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('unhandledrejection', handleFirestoreError);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('unhandledrejection', handleFirestoreError);
    };
  }, [isOnline]);

  if (!showIndicator) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      !isOnline 
        ? 'bg-red-500 text-white' 
        : firestoreIssues 
          ? 'bg-yellow-500 text-white'
          : 'bg-green-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        {!isOnline ? (
          <WifiOff className="w-4 h-4" />
        ) : firestoreIssues ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Wifi className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {!isOnline 
            ? 'You are offline' 
            : firestoreIssues 
              ? 'Connection issues detected'
              : 'Back online'
          }
        </span>
      </div>
    </div>
  );
};