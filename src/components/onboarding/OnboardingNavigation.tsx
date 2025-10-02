'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingNavigationProps {
  currentSlide: number;
  totalSlides: number;
  canGoBack: boolean;
  submitting: boolean;
  showValidationError: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const OnboardingNavigation = ({
  currentSlide,
  totalSlides,
  canGoBack,
  submitting,
  showValidationError,
  onPrevious,
  onNext
}: OnboardingNavigationProps) => {
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {canGoBack && (
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={submitting}
          className="flex-1 sm:flex-initial py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105 min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Setting up your profile...
            </>
          ) : (
            <>
              {isLastSlide ? 'Complete Profile' : 'Continue'}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
      
      {showValidationError && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm text-center">
            Please fill in all required fields to continue
          </p>
        </div>
      )}
    </div>
  );
};