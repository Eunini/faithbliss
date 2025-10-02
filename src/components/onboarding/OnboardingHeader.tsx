'use client';

import { ChevronLeft } from 'lucide-react';

interface OnboardingHeaderProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  canGoBack: boolean;
}

export const OnboardingHeader = ({ 
  currentSlide, 
  totalSlides, 
  onPrevious, 
  canGoBack 
}: OnboardingHeaderProps) => {
  return (
    <div className="px-4 sm:px-6 py-4 bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onPrevious}
            className={`p-2 rounded-full transition-all ${
              !canGoBack 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            disabled={!canGoBack}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm font-medium text-gray-400">
            {currentSlide + 1} of {totalSlides}
          </span>
          <div className="w-8"></div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};