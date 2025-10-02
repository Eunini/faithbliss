'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FcGoogle } from 'react-icons/fc';
import { Heart, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { HeartBeatIcon } from '@/components/HeartBeatIcon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { data: session, status } = useSession();
  const { signInWithGoogle, user } = useNextAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Handle redirect after successful authentication
  useEffect(() => {
    if (status !== 'loading' && session?.user) {
      if (user?.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [session, user, status, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting Google sign-in...');
      
      await signInWithGoogle();
      showSuccess('Signed in successfully! 🎉', 'Welcome to FaithBliss');
      // NextAuth handles the redirect automatically
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google. Please try again.';
      setError(errorMessage);
      showError(errorMessage, 'Sign In Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // For now, we'll redirect to Google OAuth since we're migrating away from email/password
      setError('Email/password login is temporarily disabled. Please use Google sign-in.');
      
    } catch (error) {
      console.error('Email sign-in error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if NextAuth is still loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <HeartBeatIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <HeartBeatIcon className="w-16 h-16 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-300">Sign in to continue your faith journey</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl border border-gray-300 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FcGoogle className="w-6 h-6" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Email/Password Form (Disabled) */}
          <form onSubmit={handleEmailSignIn} className="space-y-4 opacity-50">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white/20 transition-all"
                  placeholder="Enter your email"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white/20 transition-all"
                  placeholder="Enter your password"
                  disabled
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-300"
                  disabled
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">
                Email/password login temporarily disabled
              </p>
            </div>

            <button
              type="submit"
              disabled
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In with Email
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-semibold">
                Sign up
              </Link>
            </p>
            <Link 
              href="/" 
              className="text-gray-400 hover:text-gray-300 text-sm inline-flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}