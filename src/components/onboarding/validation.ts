import { OnboardingData } from './types';

// Basic phone number regex (adjust as needed for more strict validation)
const phoneRegex = /^[0-9]{7,15}$/;

export const validateStep1 = (data: OnboardingData): boolean => {
  // Birthday validation (must be at least 18 years old)
  if (!data.birthday) return false;
  const birthDate = new Date(data.birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) return false;

  // Phone number validation
  if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber.replace(/\D/g, ''))) {
    return false;
  }

  return !!(
    data.faithJourney &&
    data.churchAttendance &&
    data.relationshipGoals &&

    data.location &&
    data.denomination &&
    data.countryCode &&
    data.education &&
    data.baptismStatus
  );
};

export const validateStep2 = (data: OnboardingData): boolean => {
  return !!(
    data.preferredFaithJourney?.length > 0 &&
    data.preferredChurchAttendance?.length > 0 &&
    data.preferredRelationshipGoals?.length > 0 &&
    data.preferredDenominations?.length > 0 &&
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