'use client';

import { ArrowLeft, X, Star, Heart, MessageCircle } from 'lucide-react';

interface FloatingActionButtonsProps {
  onGoBack: () => void;
  onPass: () => void;
  onBless: () => void;
  onLike: () => void;
  onMessage: () => void;
}

export const FloatingActionButtons = ({
  onGoBack,
  onPass,
  onBless,
  onLike,
  onMessage
}: FloatingActionButtonsProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 lg:left-[calc(50%+80px)] transform -translate-x-1/2 z-40">
      <div className="flex items-center justify-center space-x-3">
        {/* Go Back Button */}
        <button
          onClick={onGoBack}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Pass Button */}
        <button
          onClick={onPass}
          className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-xl border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] group"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Super Like Button */}
        <button
          onClick={onBless}
          className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 hover:from-yellow-400/30 hover:to-orange-500/30 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-300/50 text-yellow-400 hover:text-yellow-300 p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] group"
        >
          <Star className="w-7 h-7 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
        </button>

        {/* Like Button */}
        <button
          onClick={onLike}
          className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30 backdrop-blur-xl border border-pink-500/30 hover:border-pink-400/50 text-pink-400 hover:text-pink-300 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] group"
        >
          <Heart className="w-6 h-6 group-hover:scale-110 group-hover:fill-current transition-all duration-300" />
        </button>

        {/* Message Button */}
        <button
          onClick={onMessage}
          className="bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};