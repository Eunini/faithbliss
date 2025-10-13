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
    <div className="px-4 sm:px-6 py-4 bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onPrevious}
            className={`p-2 rounded-full transition-colors duration-300 ${
              !canGoBack 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-white hover:bg-gray-800'
            }`}
            disabled={!canGoBack}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-8"></div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-pink-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
