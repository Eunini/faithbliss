'use client';

// import { useState } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const commonEmojis = [
  '😊', '😂', '❤️', '😍', '🥰', '😘', '🤗', '🙏', '✨', '🌟',
  '👍', '👏', '🎉', '💖', '💕', '😇', '🔥', '💯', '🙌', '💪',
  '🌸', '🌹', '☀️', '⭐', '💝', '🎊', '🌈', '🦋', '🌺', '💐'
];

export const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }: EmojiPickerProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Emoji Picker */}
      <div className="absolute bottom-16 right-0 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-200">
        <div className="w-64">
          <h3 className="text-white font-medium mb-3 text-sm">Choose an emoji</h3>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onEmojiSelect(emoji);
                  onClose();
                }}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 text-2xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};