'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FcGoogle } from 'react-icons/fc';
import { Heart, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthTokenDebugger } from '@/components/AuthTokenDebugger';
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
    // Only proceed if we have a session and are not in loading state
    if (status !== 'loading' && session?.user) {
      console.log('Authentication successful, preparing redirect...');
      
      if (session?.accessToken) {
        console.log('JWT token present, user authenticated');
        
        // If we have user data from the backend
        if (user) {
          console.log('User data loaded from backend');
          showSuccess('Signed in successfully! 🎉', 'Welcome to FaithBliss');
          
          // Redirect based on onboarding status
          if (user.onboardingCompleted) {
            console.log('User has completed onboarding, redirecting to dashboard');
            router.push('/dashboard');
          } else {
            console.log('User needs to complete onboarding');
            router.push('/onboarding');
          }
        } else {
          // User authenticated but backend data not loaded yet
          console.log('Waiting for backend user data...');
        }
      } else {
        console.warn('Session exists but no JWT token found');
      }
    }
  }, [session, user, status, router, showSuccess]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting Google sign-in...');
      
      // Clear any URL parameters that might be causing issues
      if (window.location.search) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      await signInWithGoogle();
      // We're no longer redirecting here. Instead, the useEffect above
      // will handle redirects after the user data is loaded from the backend
      
      console.log('Google sign-in initiated successfully');
      
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
      
      // Use NextAuth credentials provider (you'll need to set this up)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        showSuccess('Signed in successfully! 🎉', 'Welcome back to FaithBliss');
        // Redirect will be handled by useEffect
      }
      
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <HeartBeatIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center px-4 py-8 no-horizontal-scroll dashboard-main">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-white">FaithBliss</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Sign in to continue your faith journey</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-3 bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 text-white py-3 px-4 sm:px-6 rounded-xl font-medium hover:bg-gray-600/50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          <span className="text-sm sm:text-base">{loading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/50 text-gray-400">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 placeholder-gray-400 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 placeholder-gray-400 transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <HeartBeatIcon size="md" className="text-white" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        {/* Auth Token Debugger - only visible in development */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Debug Authentication</h3>
            
            {/* Authentication status */}
            <div className="mb-3 text-xs text-gray-400">
              <div>Status: {status}</div>
              <div>Has Session: {session ? '✓' : '✗'}</div>
              <div>Has User: {user ? '✓' : '✗'}</div>
              <div>Has Token: {session?.accessToken ? '✓' : '✗'}</div>
              {session?.accessToken && (
                <div>Token Preview: {session.accessToken.substring(0, 15)}...</div>
              )}
            </div>
            
            {session && <AuthTokenDebugger />}
          </div>
        )}
      </div>
    </div>
  );
}