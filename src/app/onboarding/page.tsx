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
import ImageUploadSlide from '@/components/onboarding/ImageUploadSlide';
import ProfileBuilderSlide from '@/components/onboarding/ProfileBuilderSlide';
import MatchingPreferencesSlide from '@/components/onboarding/MatchingPreferencesSlide';
import RelationshipGoalsSlide from '@/components/onboarding/RelationshipGoalsSlide';

const OnboardingPage = () => {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 4; // Photos -> Profile -> Goals -> Preferences

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    // Photos
    photos: [],
    // Profile
    birthday: '',
    location: '',
    latitude: null,
    longitude: null,
    faithJourney: '',
    churchAttendance: '',
    denomination: '',
    customDenomination: '',
    occupation: '',
    bio: '',
    personality: [],
    hobbies: [],
    values: [],
    favoriteVerse: '',
    // Goals
    relationshipGoals: '',
    // Preferences
    preferredGender: '',
    minAge: 18,
    maxAge: 35,
    maxDistance: 50,
    
    // Fields not in the new UI but required by the type (setting defaults)
    phoneNumber: '',
    countryCode: '+1',
    education: '',
    baptismStatus: '',
    spiritualGifts: [],
    interests: [],
    lifestyle: '',
    preferredFaithJourney: [],
    preferredChurchAttendance: [],
    preferredRelationshipGoals: [],
    preferredDenominations: [],
  });

  const nextStep = async () => {
    setValidationError(null);

    // --- Validation ---
    if (currentStep === 0 && onboardingData.photos.length < 2) {
      setValidationError('Please upload at least 2 photos to continue.');
      return;
    }
    if (currentStep === 1 && (!onboardingData.birthday || !onboardingData.location || !onboardingData.faithJourney)) {
      setValidationError('Please fill out the basics: birthday, location, and faith journey.');
      return;
    }
     if (currentStep === 2 && !onboardingData.relationshipGoals) {
      setValidationError('Please select your relationship goal.');
      return;
    }


    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // --- Final Submission ---
      try {
        setSubmitting(true);
        const formData = new FormData();

        Object.entries(onboardingData).forEach(([key, value]) => {
          if (key === 'photos') {
            (value as File[]).forEach((photo: File) => formData.append('photos', photo));
          } else if (key === 'denomination' && value === 'OTHER' && onboardingData.customDenomination) {
            formData.append('denomination', onboardingData.customDenomination);
          } else if (key === 'personality' && Array.isArray(value)) {
            formData.append('personality', value.join(', '));
          } else if (Array.isArray(value) && value.length > 0) {
            // Convert camelCase to snake_case for array fields
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            value.forEach(item => formData.append(`${snakeKey}[]`, item as string));
          } else if (value !== null && value !== undefined && value !== '' && key !== 'customDenomination') {
            // Convert camelCase to snake_case for regular fields
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            formData.append(snakeKey, String(value));
          }
        });

        await completeOnboarding(formData);
        setShowSuccessModal(true);
        setTimeout(() => router.push('/dashboard'), 3000);

      } catch (error) {
        console.error('Error completing onboarding:', error);
        setValidationError('Something went wrong. Please try again.');
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
    <div className="min-h-screen bg-gray-900 text-white">
      <OnboardingHeader
        currentSlide={currentStep}
        totalSlides={totalSteps}
        onPrevious={prevStep}
        canGoBack={currentStep > 0}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 max-w-2xl">
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <ImageUploadSlide
            isVisible={currentStep === 0}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <ProfileBuilderSlide
            isVisible={currentStep === 1}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <RelationshipGoalsSlide
            isVisible={currentStep === 2}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <MatchingPreferencesSlide
            isVisible={currentStep === 3}
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
