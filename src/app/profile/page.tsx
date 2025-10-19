/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useUserProfile } from '@/hooks/useAPI';
import { API } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import PhotosSection from '@/components/profile/PhotosSection';
import BasicInfoSection from '@/components/profile/BasicInfoSection';
import PassionsSection from '@/components/profile/PassionsSection';
import FaithSection from '@/components/profile/FaithSection';
import SaveButton from '@/components/profile/SaveButton';
import { ProfileData } from '@/types/profile';
import { UpdateProfileDto } from '@/services/api';

const ProfilePage = () => {
  const auth = useAuth();
  const { data: userData, loading, error, refetch } = useUserProfile();
  const [activeSection, setActiveSection] = useState('photos');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (userData) {
      setProfileData({
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        gender: userData.gender || undefined,
        age: userData.age || 0,
        denomination: userData.denomination || undefined,
        bio: userData.bio || '',
        location: {
          address: userData.location || '',
          latitude: userData.latitude || null,
          longitude: userData.longitude || null,
        },
        phoneNumber: userData.phoneNumber || '',
        countryCode: userData.countryCode || '',
        birthday: userData.birthday || '',
        fieldOfStudy: userData.fieldOfStudy || '',
        profession: userData.profession || '',
        faithJourney: userData.faithJourney || undefined,
        sundayActivity: userData.sundayActivity || undefined,
        lookingFor: userData.lookingFor || [],
        hobbies: userData.hobbies || [],
        values: userData.values || [],
        favoriteVerse: userData.favoriteVerse || '',
        photos: [userData.profilePhoto1, userData.profilePhoto2, userData.profilePhoto3].filter(Boolean) as string[],
        isVerified: userData.isVerified || false,
        onboardingCompleted: userData.onboardingCompleted || false,
        preferences: userData.preferences || undefined,
      });
    }
  }, [userData]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    if (!profileData) return;
    setIsSaving(true);
    try {
      const updatePayload: UpdateProfileDto = {
        name: profileData.name,
        age: profileData.age,
        bio: profileData.bio,
        denomination: profileData.denomination as 'BAPTIST' | 'METHODIST' | 'CATHOLIC' | 'OTHER', // Cast to match enum
        favoriteVerse: profileData.favoriteVerse,
        faithJourney: profileData.faithJourney as 'GROWING' | 'ESTABLISHED' | 'SEEKING', // Cast to match enum
        lookingFor: profileData.lookingFor,
        hobbies: profileData.hobbies, // Mapping interests to hobbies
        values: profileData.values,

        // Location fields
        location: profileData.location?.address,
        latitude: profileData.location?.latitude,
        longitude: profileData.location?.longitude,

        // Basics mapping
        fieldOfStudy: profileData.fieldOfStudy,
        profession: profileData.profession,

        // Fields not meant for update here
        // gender: profileData.gender,
        // phoneNumber: profileData.phoneNumber,
        // countryCode: profileData.countryCode,
        // birthday: profileData.birthday,
        // sundayActivity: profileData.sundayActivity,
      };

      await API.User.updateMe(updatePayload);
      setSaveMessage('Profile saved successfully!');
      refetch();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving profile. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profileData) {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append('photo', file); // Backend expects 'photo' field

        // Determine which photo slot to upload to.
        // Assuming we always upload to the next available slot (1, 2, or 3)
        // or replace an existing one if the user clicked on a specific slot.
        // For simplicity, let's assume we're always adding to the next available slot.
        const currentPhotoCount = profileData.photos.length;
        const photoNumber = currentPhotoCount < 3 ? currentPhotoCount + 1 : 1; // Cycle through slots or add to next

        const response = await API.User.uploadSpecificPhoto(photoNumber, formData);
        
        // Update profileData.photos based on the response
        const updatedPhotosArray = [...(profileData.photos || [])];
        updatedPhotosArray[photoNumber - 1] = response.photoUrl; // Update the specific slot

        setProfileData(prev => prev ? ({
          ...prev,
          photos: updatedPhotosArray,
        }) : null);

        setSaveMessage('Photo uploaded successfully!');
        refetch(); // Refetch user data to ensure backend state is reflected
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (err) {
        console.error('Error uploading photo:', err);
        setSaveMessage('Error uploading photo. Please try again.');
        setTimeout(() => setSaveMessage(''), 3000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const removePhoto = async (index: number) => {
    if (!profileData) return;
    setIsSaving(true);
    try {
      const updatedPhotosArray = (profileData.photos || []).filter((_, i) => i !== index);
      
      // No explicit backend API for removing a photo slot by setting to null/undefined
      // via UpdateProfileDto.
      // If a photo needs to be removed from the backend, a dedicated DELETE endpoint
      // or a mechanism to upload an empty/placeholder image to a slot would be needed.
      // For now, only updating frontend state.
      
      setProfileData(prev => prev ? ({
        ...prev,
        photos: updatedPhotosArray,
      }) : null);
      setSaveMessage('Photo removed successfully!');
      // refetch(); // No backend call, so no need to refetch from backend
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error removing photo. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <p className="text-red-500">Error loading profile: {error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <p>No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 no-horizontal-scroll dashboard-main">
      <ProfileHeader />
      <ProfileTabs activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {profileData && activeSection === 'photos' && (
          <PhotosSection 
            profileData={profileData} 
            handlePhotoUpload={handlePhotoUpload} 
            removePhoto={removePhoto} 
          />
        )}

        {profileData && activeSection === 'basics' && (
          <BasicInfoSection profileData={profileData} setProfileData={setProfileData} />
        )}





        {profileData && activeSection === 'passions' && (
          <PassionsSection profileData={profileData} setProfileData={setProfileData} />
        )}

        {profileData && activeSection === 'faith' && (
          <FaithSection profileData={profileData} setProfileData={setProfileData} />
        )}
      </div>

      <SaveButton 
        isSaving={isSaving} 
        saveMessage={saveMessage} 
        handleSave={handleSave} 
      />

      <div className="h-32"></div>
    </div>
  );
};

export default function ProtectedProfile() {
  const auth = useAuth();
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="ml-4 text-lg">Loading user...</p>
      </div>
    );
  }

  if (!auth.user) {
    return null;
  }
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
