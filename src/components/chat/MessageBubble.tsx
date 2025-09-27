'use client';

import { Check, CheckCheck } from 'lucide-react';

interface MessageProps {
  message: {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
    status?: 'sent' | 'delivered' | 'read';
  };
}

export const MessageBubble = ({ message }: MessageProps) => {
  return (
    <div
      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
    >
      <div className={`max-w-xs lg:max-w-md group ${
        message.sender === 'me' ? 'ml-16' : 'mr-16'
      }`}>
        <div className={`px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
          message.sender === 'me'
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md shadow-lg shadow-pink-500/25'
            : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-bl-md hover:bg-white/15'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        <div className={`flex items-center mt-1 space-x-1 ${
          message.sender === 'me' ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-400">{message.time}</span>
          {message.sender === 'me' && (
            <div>
              {message.status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-pink-400" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3 h-3 text-gray-400" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};