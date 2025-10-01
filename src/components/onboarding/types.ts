export interface FormData {
  // Basic Information
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  gender: string;
  birthday: string;
  showAge: boolean;
  profilePhoto1: string | null;
  profilePhoto2: string | null;
  profilePhoto3: string | null;

  // Educational Background
  fieldOfStudy: string;
  customFieldOfStudy: string;
  degree: string;
  profession: string;

  // Location
  grewUp: string;
  hometown: string;
  currentLocation: string;

  // Faith
  denomination: string;
  customDenomination: string;
  isWorker: boolean;
  churchDepartment: string;
  completedClasses: string;
  churchDuration: string;
  faithJourney: string;
  faithInRelationships: string;
  favoriteVerse: string;

  // Personal
  lookingFor: string;
  hobbies: string[];
  values: string[];
  sundayActivity: string;
  personality: string;
  aboutMe: string;
}