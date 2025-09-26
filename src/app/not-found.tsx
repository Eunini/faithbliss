"use client";

import Link from 'next/link';

// Separate component for the back button to handle client-side interaction
function BackButton() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <button 
      onClick={handleGoBack}
      className="bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-2xl backdrop-blur-sm border border-gray-600/50 flex items-center justify-center space-x-2"
    >
      <span>←</span>
      <span>Go Back</span>
    </button>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <span className="text-4xl">💖</span>
          <span className="text-3xl font-bold">FaithBliss</span>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-2xl animate-pulse">💕</span>
            <span className="text-3xl animate-pulse" style={{animationDelay: '0.1s'}}>💖</span>
            <span className="text-2xl animate-pulse" style={{animationDelay: '0.2s'}}>💕</span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Oops! This page got lost
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          It seems like this page went on its own faith journey and wandered off. 
          Don&apos;t worry, we&apos;ll help you find your way back to love!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-600 transition-all transform hover:scale-105 shadow-2xl backdrop-blur-sm border border-pink-400/20 flex items-center justify-center space-x-2"
          >
            <span>🏠</span>
            <span>Go Home</span>
          </Link>
          
          <BackButton />
        </div>

        {/* Fun message */}
        <div className="mt-12 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <p className="text-gray-300 text-sm">
            While you are here, remember that even when we are lost, faith guides us back to where we belong. 
            <br />
            <span className="text-pink-400 font-medium">Every journey has its purpose! 💕</span>
          </p>
        </div>
      </div>
    </div>
  );
}