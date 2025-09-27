'use client';

import Image from 'next/image';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  profilePicture: string;
  lookingFor: string;
  icebreaker: string;
  denomination: string;
  faithLevel: string;
  distance: string;
  isOnline: boolean;
  verse: string;
  hobbies: string[];
}

interface ProfileQueueProps {
  profiles: Profile[];
  currentIndex: number;
  showFilters: boolean;
}

export const ProfileQueue = ({ profiles, currentIndex, showFilters }: ProfileQueueProps) => {
  if (showFilters) return null;

  return (
    <div className="fixed top-24 right-4 z-30 lg:right-[400px] xl:right-[420px]">
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3 border border-gray-700/50 shadow-xl max-w-48">
        <div className="text-center mb-2">
          <h4 className="text-xs font-semibold text-gray-400">
            <span className="text-pink-400">{profiles.length - currentIndex - 1}</span> more nearby
          </h4>
        </div>
        <div className="flex justify-center space-x-1">
          {profiles.slice(currentIndex + 1, currentIndex + 4).map((profile) => (
            <div key={profile.id} className="w-8 h-8 rounded-lg overflow-hidden border border-gray-600 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative">
              <Image
                src={profile.profilePicture}
                alt={profile.name}
                fill
                className="w-full h-full object-cover"
                sizes="32px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};