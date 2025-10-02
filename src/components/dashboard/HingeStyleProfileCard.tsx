import { useState } from 'react';
import Image from 'next/image';
import { Profile } from './types';

interface HingeStyleProfileCardProps {
  profile: Profile;
}

export const HingeStyleProfileCard = ({ profile }: HingeStyleProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const mainPhoto = profile.profilePhotoUrl || profile.profilePicture || '';
  const photos = profile.photos || [mainPhoto];

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
        <div className="relative h-80 bg-gray-700 flex-shrink-0">
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h2 className="text-white text-2xl font-bold">{profile.name}, {profile.age}</h2>
            <p className="text-white/80">{profile.location}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4">
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
          {profile.church && (
            <p className="text-gray-400 text-sm mt-1">Attends: {profile.church}</p>
          )}
          {profile.faithLevel && (
            <p className="text-gray-400 text-sm mt-1">Faith Level: {profile.faithLevel}</p>
          )}
          {profile.verse && (
            <div className="mt-2 p-3 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300 italic text-sm">&ldquo;{profile.verse}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Education & Work */}
        {(profile.education || profile.jobTitle) && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Background</h3>
            {profile.jobTitle && (
              <p className="text-gray-300">{profile.jobTitle}</p>
            )}
            {profile.education && (
              <p className="text-gray-400 text-sm mt-1">{profile.education}</p>
            )}
          </div>
        )}

        {/* Looking For */}
        {profile.lookingFor && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Looking For</h3>
            <p className="text-gray-300">{profile.lookingFor}</p>
          </div>
        )}

        {/* Icebreaker */}
        {profile.icebreaker && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Let&apos;s Talk About</h3>
            <p className="text-gray-300 italic">&ldquo;{profile.icebreaker}&rdquo;</p>
          </div>
        )}

        {/* Hobbies */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div>
            <h3 className="text-pink-400 font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Distance */}
        {profile.distance && (
          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">{profile.distance} away</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};