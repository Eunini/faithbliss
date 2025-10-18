import { User } from '@/services/api';

export interface ProfileData extends User {
  // Override location from User interface to be an object for UI convenience
  location?: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  // photos will be an array of strings for UI convenience
  photos: string[];

  // Add back fields that are used in the UI but not directly in the new User interface
  // or are mapped differently
  interests?: string[]; // Used in UI, maps to hobbies in UpdateProfileDto
  churchRole?: string;
  prompts?: Array<{
    question: string;
    answer: string;
  }>;
  lifestyle?: {
    prayerLife?: string;
    bibleStudy?: string;
    workout?: string;
    diet?: string;
    socialStyle?: string;
    musicPreference?: string;
  };
  passions?: string[];
  basics?: {
    height?: string;
    education?: string;
    jobTitle?: string;
    company?: string;
  };
}