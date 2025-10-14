// src/components/onboarding/index.ts

// Main Slides/Views
export { default as ProfileBuilderSlide } from './ProfileBuilderSlide';
export { default as PreferenceSlide } from './PreferenceSlide';
// Note: Other slides like BasicInfo, Education, etc., are now deprecated 
// in favor of the consolidated FaithSlide and the new PreferenceSlide.

// Core UI Components
export { OnboardingHeader } from './OnboardingHeader';
export { OnboardingNavigation } from './OnboardingNavigation';
export { OnboardingSuccessModal } from './OnboardingSuccessModal';

// Validation and Types
export { validateOnboardingStep } from './validation';
export type { OnboardingData } from './types';
export { 
  FaithJourney, 
  ChurchAttendance, 
  RelationshipGoals, 
  Gender 
} from './types';