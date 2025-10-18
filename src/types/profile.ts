import { User } from '@/services/api';

export interface ProfileData extends User {
  hobbies?: string[]; // Maps to interests
  values?: string[];
  faithJourney?: string;
  lookingFor?: string;
  churchRole?: string;
  photos: string[]; // Derived from profilePhotos
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