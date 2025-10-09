'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useOnboarding } from '@/hooks/useAPI';
import {
  OnboardingHeader,
  OnboardingNavigation,
  OnboardingSuccessModal,
  OnboardingSlideRenderer,
  validateSlide,
  FormData
} from '@/components/onboarding';

import { useSession } from 'next-auth/react';

const OnboardingPage = () => {
  const router = useRouter();
  const { update } = useSession();
  const { completeOnboarding } = useOnboarding();
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
      // Complete onboarding with real backend API
      try {
        setSubmitting(true);
        
        // Transform form data for the API call
        const finalDenomination = (formData.denomination === 'Other' ? formData.customDenomination : formData.denomination) || '';
        
        const onboardingData = {
          bio: formData.aboutMe,
          denomination: finalDenomination.toUpperCase(), // Convert to uppercase for the backend enum
          interests: [...formData.hobbies, ...formData.values],
          location: formData.currentLocation, // Send only the address string
          // The 'preferences' and 'profilePhotos' properties are removed as they are not expected by the backend
        };

        await completeOnboarding(onboardingData);
        
        // Update the session to reflect onboarding completion
        await update({ onboardingCompleted: true });
        
        setShowSuccessModal(true);
        
        // Redirect to dashboard after success modal
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        setSubmitting(false);
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

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