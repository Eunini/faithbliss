'use client';

// import { useState } from 'react';
import Image from 'next/image';
import { 
  X, Heart, MoreHorizontal, MapPin, Target 
} from 'lucide-react';

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

interface ProfileCardProps {
  profile: Profile;
  onLike: (profileId: number) => void;
  onPass: (profileId: number) => void;
  onToggleExpand: (profileId: number) => void;
}

export const ProfileCard = ({ 
  profile, 
  onLike, 
  onPass, 
  onToggleExpand 
}: ProfileCardProps) => {
  return (
    <div className="relative">
      {/* Card Stack Effect */}
      <div className="absolute inset-0 bg-gray-700 rounded-3xl transform rotate-1 scale-95 opacity-30"></div>
      <div className="absolute inset-0 bg-gray-600 rounded-3xl transform -rotate-1 scale-97 opacity-20"></div>
      
      <div className="relative bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]">
        {/* Profile Image Container */}
        <div className="relative aspect-[4/5] md:aspect-[3/4] bg-gradient-to-b from-transparent via-transparent to-black/60">
          <Image
            src={profile.profilePicture}
            alt={profile.name}
            fill
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Online Status */}
          {profile.isOnline && (
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold">Active</span>
            </div>
          )}

          {/* Expand Button */}
          <button
            onClick={() => onToggleExpand(profile.id)}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Pass/Like Quick Actions */}
          <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onPass(profile.id)}
              className="bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-400 p-3 rounded-full transition-all hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => onLike(profile.id)}
              className="bg-pink-500/20 backdrop-blur-md hover:bg-pink-500/40 text-pink-400 p-3 rounded-full transition-all hover:scale-110"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="space-y-2">
              {/* Name & Age */}
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {profile.name}
                  </h2>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-base md:text-lg text-gray-300 font-medium">{profile.age}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs font-medium">{profile.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Looking For Badge */}
              <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">
                <Target className="w-3 h-3" />
                <span className="text-xs font-semibold">{profile.lookingFor}</span>
              </div>
              
              {/* Icebreaker Quote */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mt-2">
                <p className="text-white text-xs italic font-medium leading-relaxed line-clamp-2">
                  &quot;{profile.icebreaker}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};