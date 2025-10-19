import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/services/api';

import { FloatingActionButtons } from './FloatingActionButtons';

interface HingeStyleProfileCardProps {
  profile: User;
  onGoBack: () => void;
  onPass: () => void;
  onLike: () => void;
  onMessage: () => void;
}

export const HingeStyleProfileCard = ({ profile, onGoBack, onPass, onLike, onMessage }: HingeStyleProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Handle different photo sources from backend
  const getPhotos = () => {
    const photos: string[] = [];
    if (profile.profilePhoto1) photos.push(profile.profilePhoto1);
    if (profile.profilePhoto2) photos.push(profile.profilePhoto2);
    if (profile.profilePhoto3) photos.push(profile.profilePhoto3);

    if (photos.length === 0) {
      photos.push('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'); // Default placeholder
    }
    return photos;
  };
  
  const photos = getPhotos();

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 shadow-xl">
      {/* Scrollable Container for entire content */}
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700">
        
        {/* Photo Section */}
        <div className="relative h-[70vh] bg-gray-700 flex-shrink-0">
          <Image
            src={photos[currentPhotoIndex]}
            alt={profile.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Photo Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                ←
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                →
              </button>
            </>
          )}

          {/* Photo Indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Basic Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h2 className="text-white text-2xl font-bold">
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </h2>
            <p className="text-white/80">
              {profile.location || 'Location not specified'}
            </p>
          </div>

          {/* Floating Action Buttons */}
          <FloatingActionButtons
            onGoBack={onGoBack}
            onLike={onLike}
            onPass={onPass}
            onMessage={onMessage}
          />
        </div>

        {/* Profile Details */}
        <div className="p-4 space-y-3">
        {/* Bio Section */}
        {profile.bio && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">About Me</h3>
            <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Faith Section */}
        <div>
          <h3 className="text-pink-400 font-semibold mb-2">Faith</h3>
          <p className="text-gray-300">{profile.denomination}</p>
          {profile.faithJourney && (
            <p className="text-gray-400 text-sm mt-1">Faith Level: {profile.faithJourney}</p>
          )}
          {profile.favoriteVerse && (
            <div className="mt-2 p-3 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300 italic text-sm">&ldquo;{profile.favoriteVerse}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Education & Work */}
        {(profile.fieldOfStudy || profile.profession) && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Background</h3>
            {profile.profession && (
              <p className="text-gray-300">{profile.profession}</p>
            )}
            {profile.fieldOfStudy && (
              <p className="text-gray-400 text-sm mt-1">{profile.fieldOfStudy}</p>
            )}
          </div>
        )}

        {/* Looking For */}
        {profile.lookingFor && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Looking For</h3>
            <p className="text-gray-300">{profile.lookingFor.join(', ')}</p>
          </div>
        )}

        {/* Interests & Hobbies */}
        {(profile.hobbies && profile.hobbies.length > 0) && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies?.map((hobby, index) => (
                <span
                  key={`hobby-${index}`}
                  className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};