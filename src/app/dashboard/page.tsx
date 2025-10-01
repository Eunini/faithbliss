'use client';

import { useState } from 'react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TopBar } from '@/components/dashboard/TopBar';
import { SidePanel } from '@/components/dashboard/SidePanel';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { FloatingActionButtons } from '@/components/dashboard/FloatingActionButtons';
import { insertScrollbarStyles } from '@/components/dashboard/styles';
import { mockProfiles } from '@/data/mockProfiles';
import Image from 'next/image';

// Insert scrollbar styles
insertScrollbarStyles();

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  profilePhotoUrl?: string;
  profilePicture?: string;
  bio?: string;
  denomination: string;
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
}

const HingeStyleProfileCard = ({ profile }: { profile: Profile }) => {
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

const DashboardPage = () => {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [profiles] = useState(mockProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const userName = userProfile?.displayName || user?.displayName || "Tester";

  // Show loading while checking authentication
  if (loading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  }

  const currentProfile = profiles[currentProfileIndex];

  const handleLike = () => {
    console.log(`Liked profile ${currentProfile?.id}`);
    goToNextProfile();
  };

  const handlePass = () => {
    console.log(`Passed on profile ${currentProfile?.id}`);
    goToNextProfile();
  };

  const handleBless = () => {
    console.log(`Blessed profile ${currentProfile?.id}`);
    goToNextProfile();
  };

  const handleMessage = () => {
    if (currentProfile) {
      router.push(`/messages?profileId=${currentProfile.id}&profileName=${encodeURIComponent(currentProfile.name)}`);
    }
  };

  const goToNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Reset to start or show "no more profiles" state
      setCurrentProfileIndex(0);
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Side Panel */}
        <div className="w-80 flex-shrink-0">
          <SidePanel userName={userName} onClose={() => {}} onLogout={handleLogout} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <TopBar
            userName={userName}
            showFilters={showFilters}
            showSidePanel={showSidePanel}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
          />
          
          {/* Main Profile Display */}
          <div className="flex-1 flex justify-center items-center px-4 py-6 overflow-hidden">
            <div className="w-full max-w-lg h-full max-h-[calc(100vh-120px)] relative">
              {currentProfile ? (
                <HingeStyleProfileCard profile={currentProfile} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💫</div>
                  <h2 className="text-2xl font-bold mb-2">No more profiles!</h2>
                  <p className="text-gray-400 mb-4">Check back later for new matches</p>
                  <button
                    onClick={() => setCurrentProfileIndex(0)}
                    className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-full transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              )}

              {/* Floating Action Buttons */}
              {currentProfile && (
                <FloatingActionButtons
                  onGoBack={() => setCurrentProfileIndex(Math.max(0, currentProfileIndex - 1))}
                  onLike={handleLike}
                  onPass={handlePass}
                  onBless={handleBless}
                  onMessage={handleMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen">
        {/* Mobile Top Bar */}
        <TopBar
          userName={userName}
          showFilters={showFilters}
          showSidePanel={showSidePanel}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
        />
        
        {/* Mobile Profile Display */}
        <div className="px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
          <div className="flex-1 relative">
            {currentProfile ? (
              <HingeStyleProfileCard profile={currentProfile} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💫</div>
                <h2 className="text-2xl font-bold mb-2">No more profiles!</h2>
                <p className="text-gray-400 mb-4">Check back later for new matches</p>
                <button
                  onClick={() => setCurrentProfileIndex(0)}
                  className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-full transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}

            {/* Floating Action Buttons */}
            {currentProfile && (
              <FloatingActionButtons
                onGoBack={() => setCurrentProfileIndex(Math.max(0, currentProfileIndex - 1))}
                onLike={handleLike}
                onPass={handlePass}
                onBless={handleBless}
                onMessage={handleMessage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
          <FilterPanel onClose={() => setShowFilters(false)} />
        </div>
      )}

      {/* Mobile Side Navigation Panel */}
      {showSidePanel && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setShowSidePanel(false)}
          />
          
          <div className="fixed inset-y-0 left-0 w-80 bg-gray-900/98 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden">
            <SidePanel userName={userName} onClose={() => setShowSidePanel(false)} onLogout={handleLogout} />
          </div>
        </>
      )}
      
    </div>
  );
};

export default DashboardPage;