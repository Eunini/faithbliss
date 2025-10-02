import { FormData } from './types';

export const validateSlide = (currentSlide: number, formData: FormData): boolean => {
  switch (currentSlide) {
    case 0:
      const photosUploaded = [formData.profilePhoto1, formData.profilePhoto2, formData.profilePhoto3].filter(Boolean).length;
      return !!(formData.fullName && 
                formData.phoneNumber && 
                formData.countryCode && 
                formData.gender && 
                formData.birthday && 
                photosUploaded >= 2);
    
    case 1:
      const fieldOfStudyValid = formData.fieldOfStudy && 
        (formData.fieldOfStudy !== 'Other' || formData.customFieldOfStudy);
      return !!(fieldOfStudyValid && formData.degree && formData.profession);
    
    case 2:
      return !!(formData.grewUp && formData.hometown && formData.currentLocation);
    
    case 3:
      const denominationValid = formData.denomination && 
        (formData.denomination !== 'Other' || formData.customDenomination);
      return !!(denominationValid && 
                formData.completedClasses && 
                formData.churchDuration && 
                formData.faithJourney && 
                formData.faithInRelationships && 
                formData.favoriteVerse);
    
    case 4:
      return !!(formData.lookingFor && 
                formData.hobbies.length > 0 && 
                formData.values.length > 0 && 
                formData.sundayActivity && 
                formData.personality && 
                formData.aboutMe);
    
    default:
      return true;
  }
};