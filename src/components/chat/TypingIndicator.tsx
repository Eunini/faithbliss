'use client';

interface TypingIndicatorProps {
  name?: string;
}

export const TypingIndicator = ({ name = 'Someone' }: TypingIndicatorProps) => {
  return (
    <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-2xl rounded-bl-md mr-16">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-400">{name} is typing...</span>
        </div>
      </div>
    </div>
  );
};