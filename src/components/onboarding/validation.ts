import { FormData } from './types';

export const validateSlide = (currentSlide: number, formData: FormData): boolean => {
  switch (currentSlide) {
    // Basic Info Slide
    case 0:
      const photosUploaded = [formData.profilePhoto1, formData.profilePhoto2, formData.profilePhoto3].filter(Boolean).length;
      return !!(formData.fullName && 
                formData.phoneNumber && 
                formData.countryCode && 
                formData.gender && 
                formData.birthday && 
                photosUploaded >= 2);
    
    // Education & Career Slide
    case 1:
      return !!(formData.education && formData.occupation);
    
    // Location Slide (assuming this is where 'location' is set)
    case 2:
      // The old fields grewUp, hometown, currentLocation are now just 'location'
      // We will assume the location slide sets formData.location
      return !!(formData.location);
    
    // Faith Slide
    case 3:
      const denominationValid = formData.denomination && 
        (formData.denomination !== 'OTHER' || formData.customDenomination);
      return !!(denominationValid && 
                formData.churchAttendance &&
                formData.baptismStatus);
    
    // Personal Slide (assuming this is where the bio and other details are set)
    case 4:
      // The old fields are replaced by bio, relationshipGoals, etc.
      // We will validate the main 'bio' field for now.
      // More complex validation can be added as the UI for this slide is built out.
      return !!(formData.bio && formData.bio.length > 10);
    
    default:
      return true;
  }
};