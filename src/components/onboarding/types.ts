export interface FormData {
  // Basic Info (from slide 1)
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  gender: string;
  birthday: string;
  showAge: boolean;
  profilePhoto1: string | null;
  profilePhoto2: string | null;
  profilePhoto3: string | null;
  
  // New fields from Swagger (will be added to slides)
  education: string; // e.g., 'HIGH_SCHOOL', 'BACHELORS'
  occupation: string;
  location: string; // The address string
  latitude: number | null;
  longitude: number | null;
  denomination: string; // e.g., 'BAPTIST'
  customDenomination: string;
  churchAttendance: string; // e.g., 'WEEKLY'
  baptismStatus: string; // e.g., 'YES'
  spiritualGifts: string[];
  interests: string[];
  relationshipGoals: string;
  lifestyle: string;
  bio: string;

  // Deprecated fields (to be removed or mapped from)
  // These will be kept temporarily to prevent breaking the UI immediately
  // and will be cleaned up as we refactor the slides.
  fieldOfStudy?: string;
  customFieldOfStudy?: string;
  degree?: string;
  profession?: string;
  grewUp?: string;
  hometown?: string;
  currentLocation?: string;
  isWorker?: boolean;
  churchDepartment?: string;
  completedClasses?: string;
  churchDuration?: string;
  faithJourney?: string;
  faithInRelationships?: string;
  favoriteVerse?: string;
  lookingFor?: string;
  hobbies?: string[];
  values?: string[];
  sundayActivity?: string;
  personality?: string;
  aboutMe?: string;
}