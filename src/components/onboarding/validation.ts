// src/components/onboarding/validation.ts
import { OnboardingData } from './types';

export const validateStep1 = (data: OnboardingData): boolean => {
  return !!(
    data.faithJourney &&
    data.churchAttendance &&
    data.relationshipGoals &&
    data.age >= 18 &&
    data.location &&
    data.denomination
  );
};

export const validateStep2 = (data: OnboardingData): boolean => {
  return !!(
    data.preferredFaithJourney?.length > 0 &&
    data.preferredChurchAttendance?.length > 0 &&
    data.preferredRelationshipGoals?.length > 0 &&
    data.preferredGender &&
    data.minAge >= 18 &&
    data.maxAge > data.minAge &&
    data.maxDistance > 0
  );
};

// A wrapper function to call the correct validation based on the step
export const validateOnboardingStep = (step: number, data: OnboardingData): boolean => {
  if (step === 0) {
    return validateStep1(data);
  }
  if (step === 1) {
    return validateStep2(data);
  }
  return false;
};