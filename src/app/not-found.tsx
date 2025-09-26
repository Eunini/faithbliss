import Link from 'next/link';
import { Heart, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Heart className="h-12 w-12 text-pink-500" />
          <span className="text-3xl font-bold">FaithBliss</span>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="h-6 w-6 text-pink-400 animate-pulse" />
            <Heart className="h-8 w-8 text-pink-500 animate-pulse" style={{animationDelay: '0.1s'}} />
            <Heart className="h-6 w-6 text-pink-400 animate-pulse" style={{animationDelay: '0.2s'}} />
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
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <Link 
            href="/"
            className="bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-2xl backdrop-blur-sm border border-gray-600/50 flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Fun message */}
        <div className="mt-12 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <p className="text-gray-300 text-sm">
            While you are here, remember that even when we are lost, faith guides us back to where we belong. 
            <br />
            <span className="text-pink-400 font-medium flex items-center gap-1">Every journey has its purpose! <Heart className="h-4 w-4 inline" /></span>
          </p>
        </div>
      </div>
    </div>
  );
}