'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  BasicInfoSlide,
  EducationSlide,
  LocationSlide,
  FaithSlide,
  PersonalSlide,
  FormData
} from '@/components/onboarding';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

const OnboardingPage = () => {
  const router = useRouter();
  const { user, userProfile, completeOnboarding, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Redirect to dashboard if already completed onboarding
  useEffect(() => {
    if (!authLoading && user && userProfile?.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [userProfile, authLoading, user, router]);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    countryCode: '+234', // Default to Nigeria
    gender: '',
    birthday: '',
    showAge: false,
    profilePhoto1: null,
    profilePhoto2: null,
    fieldOfStudy: '',
    customFieldOfStudy: '',
    degree: '',
    profession: '',
    grewUp: '',
    hometown: '',
    currentLocation: '',
    denomination: '',
    customDenomination: '',
    spiritualLevel: '',
    isWorker: false,
    churchDepartment: '',
    completedClasses: '',
    churchDuration: '',
    faithJourney: '',
    faithInRelationships: '',
    favoriteVerse: '',
    faithLove: '',
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

  const validateCurrentSlide = () => {
    switch (currentSlide) {
      case 0:
        return formData.fullName && formData.phoneNumber && formData.countryCode && formData.gender && formData.birthday && formData.profilePhoto1 && formData.profilePhoto2;
      case 1:
        const fieldOfStudyValid = formData.fieldOfStudy && (formData.fieldOfStudy !== 'Other' || formData.customFieldOfStudy);
        return fieldOfStudyValid && formData.degree && formData.profession;
      case 2:
        return formData.grewUp && formData.hometown && formData.currentLocation;
      case 3:
        const denominationValid = formData.denomination && (formData.denomination !== 'Other' || formData.customDenomination);
        return denominationValid && formData.spiritualLevel && formData.faithLove;
      case 4:
        return formData.lookingFor && formData.hobbies.length > 0 && formData.values.length > 0 && formData.sundayActivity && formData.personality && formData.aboutMe;
      default:
        return true;
    }
  };

  const nextSlide = async () => {
    if (!validateCurrentSlide()) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 3000);
      return;
    }
    
    setShowValidationError(false);
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Complete onboarding
      try {
        setSubmitting(true);
        await completeOnboarding(formData);
        setShowSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        setSubmitting(false);
        // Could add error state here
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
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 text-center max-w-md w-full border border-gray-700">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">You&apos;re In!</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your profile is ready. Now it&apos;s time to explore, connect, and maybe even find the one God has written into your story.
            </p>
            <p className="text-sm text-gray-400">
              Taking you to your dashboard...
            </p>
          </div>
          <div className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            Starting Your Journey
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Progress */}
      <div className="px-4 sm:px-6 py-4 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevSlide}
              className={`p-2 rounded-full transition-all ${currentSlide === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-sm font-medium text-gray-400">
              {currentSlide + 1} of 5
            </span>
            <div className="w-8"></div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentSlide + 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 pb-24">
        {/* Render current slide component */}
        {currentSlide === 0 && (
          <BasicInfoSlide 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}
        
        {currentSlide === 1 && (
          <EducationSlide 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}
        
        {currentSlide === 2 && (
          <LocationSlide 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}
        
        {currentSlide === 3 && (
          <FaithSlide 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}
        
        {currentSlide === 4 && (
          <PersonalSlide 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}

        {/* Navigation Buttons */}
        <div className="max-w-6xl mx-auto mt-12 px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={nextSlide}
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
                  {currentSlide === 4 ? 'Complete Profile' : 'Continue'}
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
      </div>
    </div>
  );
};

export default OnboardingPage;