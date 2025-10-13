'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useOnboarding } from '@/hooks/useAPI';
import {
  OnboardingHeader,
  OnboardingNavigation,
  OnboardingSuccessModal,
  OnboardingData,
} from '@/components/onboarding';
import CoreInfoSlide from '@/components/onboarding/CoreInfoSlide';
import FaithValuesSlide from '@/components/onboarding/FaithValuesSlide';
import LifestyleInterestsSlide from '@/components/onboarding/LifestyleInterestsSlide';
import RelationshipGoalsSlide from '@/components/onboarding/RelationshipGoalsSlide';
import MatchingPreferencesSlide from '@/components/onboarding/MatchingPreferencesSlide';
import ImageUploadSlide from '@/components/onboarding/ImageUploadSlide';

const OnboardingPage = () => {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 6;

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    // Step 1: Core Info
    birthday: '',
    phoneNumber: '',
    countryCode: '+1',
    location: '',
    latitude: null,
    longitude: null,

    // Step 2: Faith & Values
    faithJourney: '',
    churchAttendance: '',
    denomination: '',
    baptismStatus: '',
    spiritualGifts: [],

    // Step 3: Lifestyle & Interests
    education: '',
    occupation: '',
    interests: [],
    lifestyle: '',
    bio: '',

    // Step 4: Relationship Goals
    relationshipGoals: '',

    // Step 5: Preferences
    preferredFaithJourney: [],
    preferredChurchAttendance: [],
    preferredRelationshipGoals: [],
    preferredDenominations: [],
    preferredGender: '',
    minAge: 18,
    maxAge: 99,
    maxDistance: 50,

    // Step 6: Photos
    photos: [],
  });

  const nextStep = async () => {
    // TODO: Implement validation for each step
    if (currentStep === totalSteps - 1) {
      if (onboardingData.photos.length < 2) {
        setValidationError('You must upload at least 2 photos to continue.');
        return;
      }
    }
    
    setValidationError(null);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      try {
        setSubmitting(true);
        
        const formData = new FormData();

        // Append all fields from onboardingData to formData
        Object.entries(onboardingData).forEach(([key, value]) => {
          if (key === 'photos') {
            (value as File[]).forEach((photo: File) => {
              formData.append(`photos`, photo);
            });
          } else if (Array.isArray(value)) {
            value.forEach(item => formData.append(`${key}[]`, item));
          } else if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });

        await completeOnboarding(formData);
        
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
    <div className="min-h-screen bg--gray-900 text-white">
      <OnboardingHeader
        currentSlide={currentStep}
        totalSlides={totalSteps}
        onPrevious={prevStep}
        canGoBack={currentStep > 0}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 max-w-2xl">
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <CoreInfoSlide
            isVisible={currentStep === 0}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <FaithValuesSlide
            isVisible={currentStep === 1}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <LifestyleInterestsSlide
            isVisible={currentStep === 2}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <RelationshipGoalsSlide
            isVisible={currentStep === 3}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <MatchingPreferencesSlide
            isVisible={currentStep === 4}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <ImageUploadSlide
            isVisible={currentStep === 5}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
        </div>
      </main>

      <OnboardingNavigation
        currentSlide={currentStep}
        totalSlides={totalSteps}
        canGoBack={currentStep > 0}
        submitting={submitting}
        validationError={validationError}
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