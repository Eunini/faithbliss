'use client';

import { Heart } from 'lucide-react';

interface MatchNotificationProps {
  name: string;
}

export const MatchNotification = ({ name }: MatchNotificationProps) => {
  return (
    <div className="text-center py-6">
      <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 max-w-md mx-auto animate-in slide-in-from-top duration-500">
        <div className="flex items-center justify-center mb-3">
          <Heart className="w-8 h-8 text-pink-400 fill-current animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">You matched with {name}!</h3>
        <p className="text-gray-400 text-sm">Start the conversation with a friendly message</p>
        
        <div className="flex justify-center space-x-4 mt-4">
          <div className="flex items-center space-x-1 text-pink-400 text-sm">
            <Heart className="w-4 h-4 fill-current" />
            <span>Perfect Match</span>
          </div>
        </div>
      </div>
    </div>
  );
};