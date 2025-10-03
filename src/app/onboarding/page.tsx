'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useToast } from '@/contexts/ToastContext';
import {
  OnboardingHeader,
  OnboardingNavigation,
  OnboardingSuccessModal,
  OnboardingSlideRenderer,
  validateSlide,
  FormData
} from '@/components/onboarding';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

const OnboardingPage = () => {
  const router = useRouter();
  const { showSuccess: showToast, showError } = useToast();
  // const { user, userProfile, completeOnboarding, loading: authLoading } = useAuth(); // Temporarily disabled
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Authentication temporarily disabled for testing
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, authLoading, router]);

  // useEffect(() => {
  //   if (!authLoading && user && userProfile?.onboardingCompleted) {
  //     router.push('/dashboard');
  //   }
  // }, [userProfile, authLoading, user, router]);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    countryCode: '+234', // Default to Nigeria
    gender: '',
    birthday: '',
    showAge: false,
    profilePhoto1: null,
    profilePhoto2: null,
    profilePhoto3: null,
    fieldOfStudy: '',
    customFieldOfStudy: '',
    degree: '',
    profession: '',
    grewUp: '',
    hometown: '',
    currentLocation: '',
    denomination: '',
    customDenomination: '',
    isWorker: false,
    churchDepartment: '',
    completedClasses: '',
    churchDuration: '',
    faithJourney: '',
    faithInRelationships: '',
    favoriteVerse: '',
    lookingFor: '',
    hobbies: [],
    values: [],
    sundayActivity: '',
    personality: '',
    aboutMe: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const updateFormData = (field: string, value: string | string[] | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  const nextSlide = async () => {
    if (!validateSlide(currentSlide, formData)) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 3000);
      return;
    }
    
    setShowValidationError(false);
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Complete onboarding (bypassing Firebase for testing)
      try {
        setSubmitting(true);
        // await completeOnboarding(formData); // Temporarily disabled
        console.log('Onboarding data:', formData); // Log for testing
        showToast('Welcome to FaithBliss! 🎉', 'Profile Complete!');
        setShowSuccessModal(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        showError('Failed to complete profile setup. Please try again.');
        setSubmitting(false);
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };



  // Loading Screen
  if (isLoading) {
    return <HeartBeatLoader />;
  }

  // Success Modal
  if (showSuccessModal) {
    return <OnboardingSuccessModal />;
  }

  return (
    <div className="min-h-screen bg-gray-900 no-horizontal-scroll dashboard-main">
      <OnboardingHeader
        currentSlide={currentSlide}
        totalSlides={5}
        onPrevious={prevSlide}
        canGoBack={currentSlide > 0}
      />

      <div className="px-4 sm:px-6 py-8 pb-24">
        <OnboardingSlideRenderer
          currentSlide={currentSlide}
          formData={formData}
          updateFormData={updateFormData}
        />

        <OnboardingNavigation
          currentSlide={currentSlide}
          totalSlides={5}
          canGoBack={currentSlide > 0}
          submitting={submitting}
          showValidationError={showValidationError}
          onPrevious={prevSlide}
          onNext={nextSlide}
        />
      </div>
    </div>
  );
};

export default function ProtectedOnboarding() {
  return (
    <ProtectedRoute>
      <OnboardingPage />
    </ProtectedRoute>
  );
}