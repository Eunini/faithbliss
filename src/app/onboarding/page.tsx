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
    // Basic Info
    fullName: '',
    phoneNumber: '',
    countryCode: '+234',
    gender: '',
    birthday: '',
    showAge: false,
    profilePhoto1: null,
    profilePhoto2: null,
    profilePhoto3: null,
    
    // Education & Career
    education: '',
    occupation: '',

    // Location
    location: '',
    latitude: null,
    longitude: null,

    // Faith
    denomination: '',
    customDenomination: '',
    churchAttendance: '',
    baptismStatus: '',

    // Personal
    spiritualGifts: [],
    interests: [],
    relationshipGoals: '',
    lifestyle: '',
    bio: '',
  });

  const updateFormData = (field: string, value: string | string[] | boolean | null | number) => {
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
        
        // Construct the final payload according to Swagger docs
        const onboardingData = {
          education: formData.education,
          occupation: formData.occupation,
          location: formData.location,
          latitude: formData.latitude || 0, // Default to 0 if null
          longitude: formData.longitude || 0, // Default to 0 if null
          denomination: formData.denomination === 'OTHER' ? formData.customDenomination.toUpperCase() : formData.denomination,
          churchAttendance: formData.churchAttendance,
          baptismStatus: formData.baptismStatus,
          spiritualGifts: formData.spiritualGifts,
          interests: formData.interests,
          relationshipGoals: formData.relationshipGoals,
          lifestyle: formData.lifestyle,
          bio: formData.bio,
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