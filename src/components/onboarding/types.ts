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
  DATING = 'DATING',
  MARRIAGE_MINDED = 'MARRIAGE_MINDED',
}

export enum Gender {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  OTHER = 'OTHER',
}

export interface OnboardingData {
  // Step 1: User Profile Data
  faithJourney: FaithJourney | '';
  churchAttendance: ChurchAttendance | '';
  relationshipGoals: RelationshipGoals | '';
  age: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  denomination: string; // Assuming this comes from an enum/list as well

  // Optional fields for Step 1
  education?: string;
  occupation?: string;
  baptismStatus?: string;
  spiritualGifts?: string[];
  interests?: string[];
  bio?: string;

  // Step 2: Matching Preferences
  preferredFaithJourney: FaithJourney[];
  preferredChurchAttendance: ChurchAttendance[];
  preferredRelationshipGoals: RelationshipGoals[];
  preferredGender: Gender | '';
  minAge: number;
  maxAge: number;
  maxDistance: number;
}