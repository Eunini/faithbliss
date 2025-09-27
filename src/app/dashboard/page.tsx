'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/dashboard/TopBar';
import { FloatingActionButtons } from '@/components/dashboard/FloatingActionButtons';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { SidePanel } from '@/components/dashboard/SidePanel';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { ProfileQueue } from '@/components/dashboard/ProfileQueue';
import { insertScrollbarStyles } from '@/components/dashboard/styles';
import { mockProfiles, type Profile } from '@/data/mockProfiles';

// Insert scrollbar styles
insertScrollbarStyles();

const DashboardPage = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);
  const [userName] = useState('Blessing'); // This would come from user context
  
  // Get current two profiles for side-by-side display
  const currentProfiles = [
    mockProfiles[currentProfileIndex],
    mockProfiles[currentProfileIndex + 1] || mockProfiles[0] // Loop back to start if needed
  ].filter(Boolean);

  const handleLike = (profileId?: number) => {
    const profile = profileId ? mockProfiles.find(p => p.id === profileId) : currentProfiles[0];
    console.log('Liked:', profile?.name);
    nextProfile();
  };

  const handlePass = (profileId?: number) => {
    const profile = profileId ? mockProfiles.find(p => p.id === profileId) : currentProfiles[0];
    console.log('Passed:', profile?.name);
    nextProfile();
  };

  const handleBless = (profileId?: number) => {
    const profile = profileId ? mockProfiles.find(p => p.id === profileId) : currentProfiles[0];
    console.log('Blessed:', profile?.name);
    // Show blessing sent animation
  };

  const handleMessage = (profileId?: number) => {
    const profile = profileId ? mockProfiles.find(p => p.id === profileId) : currentProfiles[0];
    console.log('Message:', profile?.name);
    // Open message interface
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 2) % mockProfiles.length); // Move by 2 since we show 2 cards
  };

  const handleGoBack = () => {
    setCurrentProfileIndex((prev) => (prev - 2 + mockProfiles.length) % mockProfiles.length);
  };

  const toggleExpandProfile = (profileId: number) => {
    setExpandedProfile(expandedProfile === profileId ? null : profileId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      {/* Top Bar */}
      <TopBar
        userName={userName}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
      />

      {/* Main Container - Responsive Layout */}
      <div className="flex min-h-screen pt-6 pb-20">
        {/* Desktop Side Panel - Always Visible */}
        <div className="hidden lg:block w-80 p-6">
          <SidePanel userName={userName} onClose={() => {}} />
        </div>
        
        {/* Main Content Area - Dual Cards */}
        <div className="flex-1 flex justify-center items-start px-4 lg:px-8">
          <div className="w-full max-w-4xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {currentProfiles.map((profile, index) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onLike={handleLike}
                  onPass={handlePass}
                  onToggleExpand={toggleExpandProfile}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButtons
          onGoBack={handleGoBack}
          onPass={handlePass}
          onBless={handleBless}
          onLike={handleLike}
          onMessage={handleMessage}
        />

        {/* Filters Sidebar - Enhanced */}
        {showFilters && (
          <div className="fixed inset-y-0 right-0 w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl z-50 transform transition-transform duration-300">
            <FilterPanel onClose={() => setShowFilters(false)} />
          </div>
        )}

        {/* Mobile Side Navigation Panel */}
        {showSidePanel && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowSidePanel(false)}
            ></div>
            
            {/* Side Panel - Mobile Only */}
            <div className="fixed inset-y-0 left-0 w-80 bg-gray-900/98 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden">
              <SidePanel userName={userName} onClose={() => setShowSidePanel(false)} />
            </div>
          </>
        )}

        {/* Profile Queue */}
        <ProfileQueue 
          profiles={mockProfiles}
          currentIndex={currentProfileIndex}
          showFilters={showFilters}
        />
      </div>
    </div>
  );
};





export default DashboardPage;