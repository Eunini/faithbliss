// src/components/onboarding/types.ts

export enum FaithJourney {
  GROWING = 'GROWING',
  ROOTED = 'ROOTED',
  EXPLORING = 'EXPLORING',
  PASSIONATE = 'PASSIONATE',
}

export enum ChurchAttendance {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  OCCASIONALLY = 'OCCASIONALLY',
  RARELY = 'RARELY',
}

export enum RelationshipGoals {
  FRIENDSHIP = 'FRIENDSHIP',
  RELATIONSHIP = 'RELATIONSHIP',
  MARRIAGE_MINDED = 'MARRIAGE_MINDED',
}

export enum Gender {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  OTHER = 'OTHER',
}

export interface OnboardingData {
  // Step 1: User Profile Data
  faithJourney: string;
  churchAttendance: string;
  relationshipGoals: string[];
  location: string;
  latitude: number | null;
  longitude: number | null;
  denomination: string;
  customDenomination?: string;
  phoneNumber: string;
  countryCode: string;
  birthday: string;
  education: string;
  occupation: string;
  baptismStatus: string;
  spiritualGifts: string[];
  interests: string[];
  lifestyle: string;
  bio: string;
  personality: string[];
  hobbies: string[];
  values: string[];
  favoriteVerse: string;

  // Step 2: Matching Preferences
  preferredFaithJourney?: string[] | null;
  preferredChurchAttendance?: string[] | null;
  preferredRelationshipGoals?: string[] | null;
  preferredDenomination?: string | null;
  preferredGender?: 'MALE' | 'FEMALE' | null;
  minAge?: number | null;
  maxAge?: number | null;
  maxDistance?: number | null;

  // Step 3: Photos
  photos: File[];
}