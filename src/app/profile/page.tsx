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
import PromptsSection from '@/components/profile/PromptsSection';
import LifestyleSection from '@/components/profile/LifestyleSection';
import PassionsSection from '@/components/profile/PassionsSection';
import FaithSection from '@/components/profile/FaithSection';
import SaveButton from '@/components/profile/SaveButton';
import { ProfileData } from '@/types/profile';

const ProfilePage = () => {
  const auth = useAuth();
  const { data: userData, loading, error, refetch } = useUserProfile();
  const [activeSection, setActiveSection] = useState('photos');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (userData) {
      setProfileData({
        ...userData,
        name: userData.name || '',
        age: userData.age || 0,
        location: userData.location || undefined,
        profession: userData.jobTitle || '',
        denomination: userData.denomination || '',
        favoriteVerse: userData.favoriteVerse || '',
        bio: userData.bio || '',
        hobbies: userData.interests || [],
        values: [], // Assuming default empty array if not in userData
        faithJourney: '',
        lookingFor: '',
        churchRole: '',
        photos: userData.profilePhotos ? Object.values(userData.profilePhotos).filter(Boolean) as string[] : [],
        prompts: [], // Assuming default empty array if not in userData
        lifestyle: {
          prayerLife: '',
          bibleStudy: '',
          workout: '',
          diet: '',
          socialStyle: '',
          musicPreference: '',
        },
        passions: [], // Assuming default empty array if not in userData
        basics: {
          height: '',
          education: '',
          jobTitle: '',
          company: ''
        },
      });
    }
  }, [userData]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    if (!profileData) return;
    setIsSaving(true);
    try {
      await API.User.updateMe({
        name: profileData.name,
        bio: profileData.bio,
        age: profileData.age,
        denomination: profileData.denomination,
        interests: profileData.hobbies,
        values: profileData.values,
        faithJourney: profileData.faithJourney,
        lookingFor: profileData.lookingFor,
        churchRole: profileData.churchRole,
        prompts: profileData.prompts,
        lifestyle: profileData.lifestyle,
        passions: profileData.passions,
        basics: profileData.basics,
        location: profileData.location,
      });
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
        formData.append('file', file);
        formData.append('upload_preset', 'faithbliss');
        const res = await fetch('https://api.cloudinary.com/v1_1/faithbliss/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        const newPhoto = {
          url: data.secure_url,
          publicId: data.public_id,
        };
        const updatedPhotosArray = [...(profileData.photos || []), newPhoto.url];
        const newProfilePhotos: { [key: string]: string } = {};
        updatedPhotosArray.forEach((url, index) => {
          newProfilePhotos[`photo${index + 1}`] = url;
        });
        await API.User.updateMe({
          profilePhotos: newProfilePhotos,
        });
        setProfileData(prev => prev ? ({
          ...prev,
          photos: updatedPhotosArray,
        }) : null);
        setSaveMessage('Photo uploaded successfully!');
        refetch();
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
      const newProfilePhotos: { [key: string]: string } = {};
      updatedPhotosArray.forEach((url, index) => {
        newProfilePhotos[`photo${index + 1}`] = url;
      });
      await API.User.updateMe({
        profilePhotos: newProfilePhotos,
      });
      setProfileData(prev => prev ? ({
        ...prev,
        photos: updatedPhotosArray,
      }) : null);
      setSaveMessage('Photo removed successfully!');
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

        {profileData && activeSection === 'prompts' && (
          <PromptsSection profileData={profileData} setProfileData={setProfileData} />
        )}

        {profileData && activeSection === 'lifestyle' && (
          <LifestyleSection profileData={profileData} setProfileData={setProfileData} />
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
