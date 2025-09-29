// components/AuthTester.tsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const AuthTester = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSignIn = async () => {
    setLoading(true);
    setResult('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setResult(`✅ Sign-in SUCCESS: ${userCredential.user.email} (${userCredential.user.uid})`);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      setResult(`❌ Sign-in FAILED: ${firebaseError.code} - ${firebaseError.message}`);
    }
    setLoading(false);
  };

  const testSignUp = async () => {
    setLoading(true);
    setResult('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setResult(`✅ Sign-up SUCCESS: ${userCredential.user.email} (${userCredential.user.uid})`);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      setResult(`❌ Sign-up FAILED: ${firebaseError.code} - ${firebaseError.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50 border">
      <h3 className="font-bold mb-2">Firebase Auth Tester</h3>
      
      <div className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
        />
        
        <div className="flex gap-2">
          <button
            onClick={testSignIn}
            disabled={loading || !email || !password}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs disabled:opacity-50"
          >
            Test Sign In
          </button>
          <button
            onClick={testSignUp}
            disabled={loading || !email || !password}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs disabled:opacity-50"
          >
            Test Sign Up
          </button>
        </div>
        
        {result && (
          <div className={`mt-2 p-2 rounded text-xs ${result.includes('SUCCESS') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};