/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, Mail, Lock, User, Heart, Sparkles } from 'lucide-react';
import { PopupInstruction } from '@/components/auth/PopupInstruction';
import { SuccessModal } from '@/components/SuccessModal';
import { HeartBeatIcon } from '@/components/HeartBeatIcon';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopupInstruction, setShowPopupInstruction] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  // Only show success modal if redirected from an actual signup action
  useEffect(() => {
    const fromSignup = typeof window !== 'undefined' ? sessionStorage.getItem('fromSignup') : null;

    if (status === 'authenticated' && fromSignup) {
      setShowSuccessModal(true);
      // remove the flag so it doesn't trigger again on page reload
      sessionStorage.removeItem('fromSignup');
    }

    if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      // mark that user initiated signup (used to show welcome modal ONLY if this flow completes)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fromSignup', 'true');
      }

      // Let NextAuth handle the redirect flow automatically.
      // The middleware will route the user to the correct page (/onboarding or /dashboard)
      // after the sign-in is complete.
      await signIn('google', {
        callbackUrl: '/onboarding',
        redirect: true,
      });

    } catch (err: any) {
      console.error('Google sign-up error:', err);
      setError(err?.message || 'Failed to sign up with Google. Please try again.');
      if (typeof window !== 'undefined') sessionStorage.removeItem('fromSignup');
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return setError('Please enter your full name');
    if (!formData.email.trim()) return setError('Please enter your email address');
    if (!formData.password.trim()) return setError('Please enter a password');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters long');
    if (parseInt(formData.age) < 18) return setError('You must be at least 18 years old to join FaithBliss');

    try {
      setLoading(true);
      setError('Email signup is currently disabled. Please use Google Sign In.');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center px-4 py-8 no-horizontal-scroll dashboard-main">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-white">FaithBliss</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Join FaithBliss
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Your love journey starts here!</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-3 bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 text-white py-3 px-4 sm:px-6 rounded-xl font-medium hover:bg-gray-600/50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          <span className="text-sm sm:text-base">
            {loading ? 'Connecting...' : 'Continue with Google'}
          </span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/50 text-gray-400">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 placeholder-gray-400 transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 placeholder-gray-400 transition-all"
                placeholder="Create a secure password"
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

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="18"
              max="100"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 placeholder-gray-400 transition-all"
              placeholder="Your age"
              required
            />
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
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Join the Family
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
              Sign in here
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
      </div>

      {/* Popup Instruction Modal */}
      <PopupInstruction
        show={showPopupInstruction}
        onDismiss={() => setShowPopupInstruction(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/onboarding');
        }}
        title="Welcome to FaithBliss!"
        message="Your account has been created successfully! Let's complete your profile to find your perfect match."
        autoCloseMs={3000}
      />
    </div>
  );
}