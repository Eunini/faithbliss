import { Heart } from 'lucide-react';

interface HeartBeatLoaderProps {
  message?: string;
}

export const HeartBeatLoader = ({ message = "Finding your perfect match..." }: HeartBeatLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center z-50">
      <style jsx global>{`
        @keyframes heartbeat {
          0% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
          }
          14% { 
            transform: scale(1.3); 
            filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6));
          }
          28% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
          }
          42% { 
            transform: scale(1.3); 
            filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6));
          }
          70% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
          }
          100% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
          }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        .heartbeat-animation {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .pulse-ring {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      <div className="text-center">
        <div className="relative flex items-center justify-center">
          {/* Pulsing rings */}
          <div className="absolute w-32 h-32 rounded-full border-2 border-pink-500/30 pulse-ring"></div>
          <div className="absolute w-24 h-24 rounded-full border-2 border-pink-400/20 pulse-ring" style={{animationDelay: '0.5s'}}></div>
          
          {/* Main heart */}
          <Heart 
            className="w-20 h-20 text-pink-500 mx-auto heartbeat-animation relative z-10"
            fill="currentColor"
          />
        </div>
        <div className="mt-8 space-y-2">
          <p className="text-white text-lg font-medium animate-pulse">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};