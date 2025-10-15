'use client';

import { ArrowLeft, X, Heart, MessageCircle } from 'lucide-react';

interface FloatingActionButtonsProps {
  onGoBack: () => void;
  onPass: () => void;
  onLike: () => void;
  onMessage: () => void;
}

export const FloatingActionButtons = ({
  onGoBack,
  onPass,
  onLike,
  onMessage
}: FloatingActionButtonsProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 lg:left-[calc(50%+110px)] transform -translate-x-1/2 z-40">
      <div className="flex items-center justify-center space-x-3">
        {/* Go Back Button */}
        <div className="relative group">
          <button
            onClick={onGoBack}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <ArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900/90 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm border border-gray-700/50 whitespace-nowrap">
              Go Back
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
            </div>
          </div>
        </div>

        {/* Pass Button */}
        <div className="relative group">
          <button
            onClick={onPass}
            className="bg-red-700/30 hover:bg-red-600/40 backdrop-blur-xl border border-red-600/40 hover:border-red-500/50 text-red-400 hover:text-red-300 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900/90 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm border border-gray-700/50 whitespace-nowrap">
              Pass
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
            </div>
          </div>
        </div>

        {/* Like Button */}
        <div className="relative group">
          <button
            onClick={onLike}
            className="bg-gradient-to-r from-pink-700/30 to-purple-800/30 hover:from-pink-600/40 hover:to-purple-700/40 backdrop-blur-xl border border-pink-600/40 hover:border-pink-500/50 text-pink-400 hover:text-pink-300 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            <Heart className="w-6 h-6 group-hover:scale-110 group-hover:fill-current transition-all duration-300" />
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900/90 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm border border-gray-700/50 whitespace-nowrap">
              Like
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
            </div>
          </div>
        </div>

        {/* Message Button */}
        <div className="relative group">
          <button
            onClick={onMessage}
            className="bg-blue-700/30 hover:bg-blue-600/40 backdrop-blur-xl border border-blue-600/40 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900/90 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm border border-gray-700/50 whitespace-nowrap">
              Message
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};