'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useOnboarding } from '@/hooks/useAPI';
import {
  OnboardingHeader,
  OnboardingNavigation,
  OnboardingSuccessModal,
  FaithSlide,
  OnboardingData,
} from '@/components/onboarding';
import PreferenceSlide from '@/components/onboarding/PreferenceSlide';

const OnboardingPage = () => {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    // Step 1: About You
    faithJourney: '',
    churchAttendance: '',
    relationshipGoals: '',
    age: 18,
    location: '',
    latitude: null,
    longitude: null,
    denomination: '',
    phoneNumber: '',
    countryCode: '+1',
    birthday: '',
    
    // Optional fields from previous setup
    education: '',
    occupation: '',
    baptismStatus: '',
    spiritualGifts: [],
    interests: [],
    lifestyle: '',
    bio: '',

    // Step 2: Preferences
    preferredFaithJourney: [],
    preferredChurchAttendance: [],
    preferredRelationshipGoals: [],
    preferredDenominations: [],
    preferredGender: '',
    minAge: 18,
    maxAge: 99,
    maxDistance: 50,
  });

  const nextStep = async () => {
    // TODO: Implement validation for Step 1
    // if (!validateStep1(onboardingData)) {
    //   setShowValidationError(true);
    //   setTimeout(() => setShowValidationError(false), 3000);
    //   return;
    // }
    
    setShowValidationError(false);
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      try {
        setSubmitting(true);
        
        // The payload should match the API expectations
        await completeOnboarding(onboardingData);
        
        setShowSuccessModal(true);
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        setSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showSuccessModal) {
    return <OnboardingSuccessModal />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <OnboardingHeader
        currentSlide={currentStep}
        totalSlides={2}
        onPrevious={prevStep}
        canGoBack={currentStep > 0}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 max-w-2xl">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-pink-500 mb-2">
            Step {currentStep + 1} of 2
          </p>
          
          <FaithSlide 
            isVisible={currentStep === 0}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />

          <PreferenceSlide
            isVisible={currentStep === 1}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
        </div>
      </main>

      <OnboardingNavigation
        currentSlide={currentStep}
        totalSlides={2}
        canGoBack={currentStep > 0}
        submitting={submitting}
        showValidationError={showValidationError}
        onPrevious={prevStep}
        onNext={nextStep}
      />
    </div>
  );
};

export default function ProtectedOnboarding() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <OnboardingPage />
    </ProtectedRoute>
  );
}