'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  ArrowLeft, Heart, X, MessageCircle, MapPin, Church, BookOpen, Coffee, Music,
  Trophy, Verified, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  profilePhotos?: {
    photo1?: string;
    photo2?: string;
    photo3?: string;
  };
  preferences?: {
    ageRange: [number, number];
    maxDistance: number;
    denomination?: string;
    lookingFor?: string;
  };
  onboardingCompleted?: boolean;
  isActive?: boolean;
  bio?: string;
  age?: number;
  denomination?: string;
  interests?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  // Extended profile data for display
  lookingFor?: string;
  icebreaker?: string;
  faithLevel?: string;
  distance?: string;
  isOnline?: boolean;
  verse?: string;
  hobbies?: string[];
  occupation?: string;
  education?: string;
  height?: string;
  churchInvolvement?: string;
  prayerFrequency?: string;
  bibleReading?: string;
  ministry?: string;
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    exercise?: string;
    diet?: string;
  };
  values?: string[];
}

// Helper function to get profile photos
const getProfilePhotos = (user: User): string[] => {
  const photos: string[] = [];
  if (user.profilePhotos?.photo1) photos.push(user.profilePhotos.photo1);
  if (user.profilePhotos?.photo2) photos.push(user.profilePhotos.photo2);
  if (user.profilePhotos?.photo3) photos.push(user.profilePhotos.photo3);
  return photos.length > 0 ? photos : ['/default-avatar.png'];
};

const getProfilePhoto = (user: User, index: number): string => {
  const photos = getProfilePhotos(user);
  return photos[index] || photos[0] || '/default-avatar.png';
};

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = params.id as string;
        const userData = await API.User.getUserById(profileId);
        
        // Add extended data for demo purposes (would normally come from API)
        const extendedProfile: User = {
          ...userData,
          bio: userData.bio || "Passionate believer seeking a God-centered relationship. I love exploring new places, serving in my local church, and building meaningful connections.",
          occupation: "Marketing Manager",
          education: "Bachelor's in Communications", 
          height: "5'7\"",
          churchInvolvement: "Small Group Leader",
          prayerFrequency: "Daily",
          bibleReading: "Daily devotions",
          ministry: "Youth Ministry Volunteer",
          interests: userData.interests || ["Photography", "Hiking", "Cooking", "Reading", "Volunteering", "Music"],
          lifestyle: {
            drinking: "Never",
            smoking: "Never",
            exercise: "Regularly", 
            diet: "Balanced"
          },
          values: ["Faith-Centered", "Family-Oriented", "Community Service", "Personal Growth", "Authenticity"],
          lookingFor: "Long-term relationship",
          icebreaker: "What's your favorite way to spend a Sunday afternoon?",
          faithLevel: "Strong",
          distance: "2.5 miles away",
          isOnline: true,
          verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future. - Jeremiah 29:11",
          hobbies: userData.interests || []
        };
        
        setProfile(extendedProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Profile not found or error occurred
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  const handleLike = () => {
    // Add like logic
    console.log('Liked profile:', profile?.name);
    // Could show a success toast or navigate back
  };

  const handlePass = () => {
    // Add pass logic
    console.log('Passed profile:', profile?.name);
    router.back();
  };

  const handleMessage = () => {
    // Navigate to messages
    if (profile) {
      router.push(`/messages?profileId=${profile.id}&profileName=${encodeURIComponent(profile.name)}`);
    }
  };

  const nextPhoto = () => {
    if (profile) {
      const photos = getProfilePhotos(profile);
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (profile) {
      const photos = getProfilePhotos(profile);
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  if (loading) {
    return <HeartBeatLoader message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <button 
            onClick={() => router.back()}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-full font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-x-hidden no-horizontal-scroll dashboard-main">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50">
        <div className="flex items-center justify-between p-4 max-w-full">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">{profile.name}&apos;s Profile</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Photo Gallery */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/5] md:aspect-[16/10] relative overflow-hidden">
            <Image
              src={getProfilePhoto(profile, currentPhotoIndex)}
              alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            
            {/* Photo Navigation */}
            {profile && getProfilePhotos(profile).length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {getProfilePhotos(profile).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Online Status */}
            {profile.isOnline && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Active Now</span>
              </div>
            )}

            {/* Verified Badge */}
            <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-md text-white p-2 rounded-full">
              <Verified className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{profile.name}, {profile.age}</h1>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location?.address || 'Location not specified'} • Distance calculation needed</span>
                  </div>
                  {/* Occupation - not available in current User interface */}
                </div>
                <div className="flex items-center space-x-2">
                  {/* Looking For - not available in current User interface */}
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 text-sm">
                    {profile.denomination}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="bg-gray-800/50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold mb-2">About Me</h3>
                <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Favorite Verse */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/30">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">Favorite Verse</h3>
                  <p className="text-white italic">&quot;{profile.verse}&quot;</p>
                </div>
              </div>
            </div>

            {/* Icebreaker */}
            <div className="bg-gray-800/50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-yellow-400" />
                <span>Conversation Starter</span>
              </h3>
              <p className="text-gray-300 italic">&quot;{profile.icebreaker}&quot;</p>
            </div>
          </div>

          {/* Faith & Values */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Church className="w-6 h-6 text-blue-400" />
              <span>Faith & Values</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Faith Level</h4>
                <p className="text-gray-300">{profile.faithLevel}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Church Involvement</h4>
                <p className="text-gray-300">{profile.churchInvolvement}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Prayer</h4>
                <p className="text-gray-300">{profile.prayerFrequency}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Bible Reading</h4>
                <p className="text-gray-300">{profile.bibleReading}</p>
              </div>
            </div>

            {/* Values */}
            {profile.values && (
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-3">Core Values</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.values.map((value, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lifestyle */}
          {profile.lifestyle && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-green-400" />
                <span>Lifestyle</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <h4 className="font-semibold text-green-300 mb-1">Exercise</h4>
                  <p className="text-gray-300 text-sm">{profile.lifestyle.exercise}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <h4 className="font-semibold text-green-300 mb-1">Diet</h4>
                  <p className="text-gray-300 text-sm">{profile.lifestyle.diet}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <h4 className="font-semibold text-green-300 mb-1">Drinking</h4>
                  <p className="text-gray-300 text-sm">{profile.lifestyle.drinking}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <h4 className="font-semibold text-green-300 mb-1">Smoking</h4>
                  <p className="text-gray-300 text-sm">{profile.lifestyle.smoking}</p>
                </div>
              </div>
            </div>
          )}

          {/* Interests & Hobbies */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Music className="w-6 h-6 text-purple-400" />
              <span>Interests & Hobbies</span>
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {(profile.interests || profile.hobbies)?.map((hobby, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {hobby}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Additional Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-300 mb-1">Education</h4>
                <p className="text-gray-400">{profile.education}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-300 mb-1">Height</h4>
                <p className="text-gray-400">{profile.height}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-300 mb-1">Ministry</h4>
                <p className="text-gray-400">{profile.ministry}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-300 mb-1">Occupation</h4>
                <p className="text-gray-400">{profile.occupation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-700/50 p-4">
          <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
            <button
              onClick={handlePass}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 p-4 rounded-full transition-all hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
            
            <button
              onClick={handleLike}
              className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-400 p-4 rounded-full transition-all hover:scale-110"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProtectedProfileView() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}