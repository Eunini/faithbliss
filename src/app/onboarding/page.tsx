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
import { CompleteOnboardingDto } from '@/services/api';
import ImageUploadSlide from '@/components/onboarding/ImageUploadSlide';
import ProfileBuilderSlide from '@/components/onboarding/ProfileBuilderSlide';
import MatchingPreferencesSlide from '@/components/onboarding/MatchingPreferencesSlide';
import PartnerPreferencesSlide from '@/components/onboarding/PartnerPreferencesSlide';
import RelationshipGoalsSlide from '@/components/onboarding/RelationshipGoalsSlide';

const OnboardingPage = () => {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 5; // Photos -> Profile -> Goals -> Partner Preferences -> Matching Preferences

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
    relationshipGoals: [],
    // Preferences
    preferredGender: null,
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
    preferredFaithJourney: null,
    preferredChurchAttendance: null,
    preferredRelationshipGoals: null,
    preferredDenomination: null,
  });

  const nextStep = async () => {
    setValidationError(null);

    // --- Validation ---
    if (currentStep === 0 && onboardingData.photos.length < 2) {
      setValidationError('Please upload at  least 2 photos to continue.');
      return;
    }
    if (currentStep === 1 && (
      !onboardingData.birthday ||
      !onboardingData.location ||
      !onboardingData.faithJourney ||
      !onboardingData.denomination ||
      !onboardingData.occupation ||
      !onboardingData.bio ||
      onboardingData.personality.length === 0 ||
      onboardingData.hobbies.length === 0 ||
      onboardingData.values.length === 0 ||
      !onboardingData.favoriteVerse.trim() ||
      !onboardingData.phoneNumber ||
      !onboardingData.countryCode ||
      !onboardingData.education ||
      !onboardingData.baptismStatus
    )) {
      setValidationError('Please fill out all required profile information.');
      return;
    }

    if (currentStep === 2 && (!onboardingData.relationshipGoals || onboardingData.relationshipGoals.length === 0)) {
      setValidationError('Please select your relationship goal.');
      return;
    }
    if (
      currentStep === 3 &&
      (!onboardingData.preferredFaithJourney || onboardingData.preferredFaithJourney.length === 0 ||
        !onboardingData.preferredChurchAttendance || onboardingData.preferredChurchAttendance.length === 0 ||
        !onboardingData.preferredRelationshipGoals || onboardingData.preferredRelationshipGoals.length === 0 ||
        !onboardingData.preferredDenomination || onboardingData.preferredDenomination.length === 0)
    ) {
      setValidationError('Please select at least one option for each preference.');
      return;
    }

    // Validation for Step 4 (MatchingPreferencesSlide)
    if (currentStep === 4 && (
      !onboardingData.preferredGender ||
      onboardingData.minAge === null || onboardingData.minAge === undefined ||
      onboardingData.maxAge === null || onboardingData.maxAge === undefined ||
      onboardingData.maxDistance === null || onboardingData.maxDistance === undefined
    )) {
      setValidationError('Please fill out all matching preferences.');
      return;
    }


    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // --- Final Submission ---
      try {
        setSubmitting(true);
        const formData = new FormData();
        
        // Basic Information (using backend expected field names)
        formData.append('phone_number', onboardingData.phoneNumber);
        formData.append('country_code', onboardingData.countryCode);
        formData.append('birthday', onboardingData.birthday);
        
        // Educational Background
        formData.append('education', onboardingData.education);
        formData.append('occupation', onboardingData.occupation);
        
        // Location
        formData.append('location', onboardingData.location);
        if (onboardingData.latitude) formData.append('latitude', onboardingData.latitude.toString());
        if (onboardingData.longitude) formData.append('longitude', onboardingData.longitude.toString());
        
        // Faith Journey
        const denominationToSend = onboardingData.denomination === 'OTHER' && onboardingData.customDenomination 
          ? onboardingData.customDenomination 
          : onboardingData.denomination;
        formData.append('denomination', denominationToSend);
        formData.append('church_attendance', onboardingData.churchAttendance);
        formData.append('baptism_status', onboardingData.baptismStatus);
        formData.append('faith_journey', onboardingData.faithJourney);
        formData.append('spiritual_gifts', JSON.stringify(onboardingData.spiritualGifts));
        
        // Personal Preferences
        formData.append('interests', JSON.stringify(onboardingData.interests));
        formData.append('relationship_goals', JSON.stringify(onboardingData.relationshipGoals));
        formData.append('bio', onboardingData.bio);
        formData.append('favorite_verse', onboardingData.favoriteVerse);
        
        // Add hobbies, values, and personality (backend merges these with other fields)
        formData.append('hobbies', JSON.stringify(onboardingData.hobbies));
        formData.append('values', JSON.stringify(onboardingData.values));
        formData.append('personality', JSON.stringify(onboardingData.personality));
        
        // Matching Preferences
        const genderMapping = {
          'MALE': 'MALE',
          'FEMALE': 'FEMALE', 
          'MAN': 'MALE',
          'WOMAN': 'FEMALE'
        };
        const preferredGender = genderMapping[onboardingData.preferredGender as keyof typeof genderMapping] || onboardingData.preferredGender;
        formData.append('preferred_gender', preferredGender!);
        formData.append('min_age', onboardingData.minAge!.toString());
        formData.append('max_age', onboardingData.maxAge!.toString());
        formData.append('max_distance', onboardingData.maxDistance!.toString());
        
        // Partner Preferences (arrays)
        if (onboardingData.preferredFaithJourney) {
          formData.append('preferred_faith_journey', JSON.stringify(onboardingData.preferredFaithJourney));
        }
        if (onboardingData.preferredChurchAttendance) {
          formData.append('preferred_church_attendance', JSON.stringify(onboardingData.preferredChurchAttendance));
        }
        if (onboardingData.preferredRelationshipGoals) {
          formData.append('preferred_relationship_goals', JSON.stringify(onboardingData.preferredRelationshipGoals));
        }
        if (onboardingData.preferredDenomination) {
          formData.append('preferred_denominations', JSON.stringify(onboardingData.preferredDenomination));
        }
        
        // Photos
        onboardingData.photos.forEach((photo) => {
          formData.append('photos', photo);
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
          <PartnerPreferencesSlide
            isVisible={currentStep === 3}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
          <MatchingPreferencesSlide
            isVisible={currentStep === 4}
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
