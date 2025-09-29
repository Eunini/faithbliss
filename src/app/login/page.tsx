'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signInWithGoogle, signInWithEmail, user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Handle redirect after successful authentication
  useEffect(() => {
    if (!authLoading && user && userProfile) {
      setLoading(false);
      if (userProfile.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, userProfile, authLoading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      // Note: Redirect logic will be handled by useEffect after auth state updates
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await signInWithEmail(email, password);
      // Note: Redirect logic will be handled by useEffect after auth state updates
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome Back! 💕
          </h1>
          <p className="text-gray-600">Sign in to continue your faithful journey</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-0 outline-0 rounded-xl focus:ring-pink-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-0 outline-0 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-pink-500 hover:text-pink-600">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-pink-500 hover:text-pink-600 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}