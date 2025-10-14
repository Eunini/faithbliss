export interface Profile {
  id: string;
  name: string;
  age?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  profilePhotoUrl?: string;
  profilePicture?: string;
  profilePhoto1?: string;
  profilePhoto2?: string;
  profilePhoto3?: string;
  profilePhotos?: {
    photo1?: string;
    photo2?: string;
    photo3?: string;
  };
  bio?: string;
  denomination?: string;
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
  interests?: string[];
  email?: string;
}