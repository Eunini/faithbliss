'use client';

import {
  BasicInfoSlide,
  EducationSlide,
  LocationSlide,
  FaithSlide,
  PersonalSlide,
  FormData
} from '@/components/onboarding';

interface OnboardingSlideRendererProps {
  currentSlide: number;
  formData: FormData;
  updateFormData: (field: string, value: string | string[] | boolean | null | number) => void;
}

export const OnboardingSlideRenderer = ({ 
  currentSlide, 
  formData, 
  updateFormData 
}: OnboardingSlideRendererProps) => {
  switch (currentSlide) {
    case 0:
      return (
        <BasicInfoSlide 
          formData={formData} 
          updateFormData={updateFormData}
        />
      );
    case 1:
      return (
        <EducationSlide 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      );
    case 2:
      return (
        <LocationSlide 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      );
    case 3:
      return (
        <FaithSlide 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      );
    case 4:
      return (
        <PersonalSlide 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      );
    default:
      return null;
  }
};