export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  profilePhotoUrl?: string;
  profilePicture?: string;
  bio?: string;
  denomination: string;
  education?: string;
  jobTitle?: string;
  church?: string;
  photos?: string[];
  lookingFor?: string;
  icebreaker?: string;
  faithLevel?: string;
  distance?: string;
  isOnline?: boolean;
  verse?: string;
  hobbies?: string[];
}