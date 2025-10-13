'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onPrevious}
            className={`px-6 py-3 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 ${
              !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canGoBack}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onNext}
            disabled={submitting}
            className="px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                {isLastSlide ? 'Finish' : 'Next'}
                {isLastSlide ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
        {showValidationError && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">
              Please fill in all required fields to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
