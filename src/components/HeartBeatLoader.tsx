import { Heart } from 'lucide-react';

export const HeartBeatLoader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <style jsx global>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .heartbeat-animation {
          animation: heartbeat 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="text-center">
        <div className="relative">
          <Heart 
            className="w-20 h-20 text-pink-500 mx-auto heartbeat-animation"
            fill="currentColor"
          />
        </div>
        <p className="text-white mt-6 text-lg font-medium animate-pulse">Finding your perfect match...</p>
      </div>
    </div>
  );
};