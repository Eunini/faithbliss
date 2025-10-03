'use client';

import { useState } from 'react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { useRouter } from 'next/navigation';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { useToast } from '@/contexts/ToastContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DesktopLayout } from '@/components/dashboard/DesktopLayout';
import { MobileLayout } from '@/components/dashboard/MobileLayout';
import { ProfileDisplay } from '@/components/dashboard/ProfileDisplay';
import { OverlayPanels } from '@/components/dashboard/OverlayPanels';
import { insertScrollbarStyles } from '@/components/dashboard/styles';
import { usePotentialMatches, useMatching } from '@/hooks/useAPI';
import { Profile } from '@/components/dashboard/types';

// Insert scrollbar styles
insertScrollbarStyles();

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useNextAuth();
  const { showSuccess, showInfo } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  
  // Fetch real potential matches from backend
  const { data: profiles, loading: matchesLoading, error, refetch } = usePotentialMatches();
  const { likeUser, passUser } = useMatching();

  const userName = user?.name || user?.email || "Tester";

  // Show loading while checking authentication or fetching matches
  if (loading || matchesLoading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  }

  // Handle errors or no profiles
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center p-8">
          <p className="text-red-600 mb-4">Failed to load matches: {error}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">No potential matches found</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex] as Profile;

  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      await likeUser(currentProfile.id);
      console.log(`Liked profile ${currentProfile.id}`);
      showSuccess(`You liked ${currentProfile.name}! 💕`, 'Great Choice!');
      goToNextProfile();
    } catch (error) {
      console.error('Failed to like user:', error);
      showInfo('Failed to send like. Please try again.', 'Error');
    }
  };

  const handlePass = async () => {
    if (!currentProfile) return;
    
    try {
      await passUser(currentProfile.id);
      console.log(`Passed on profile ${currentProfile.id}`);
      showInfo(`Passed on ${currentProfile.name}`, 'No worries!');
      goToNextProfile();
    } catch (error) {
      console.error('Failed to pass user:', error);
      // Still go to next profile even if pass fails
      goToNextProfile();
    }
  };

  const handleBless = () => {
    console.log(`Blessed profile ${currentProfile?.id}`);
    showSuccess(`You blessed ${currentProfile?.name}! ✨`, 'Blessing Sent!');
    goToNextProfile();
  };

  const handleMessage = () => {
    if (currentProfile) {
      router.push(`/messages?profileId=${currentProfile.id}&profileName=${encodeURIComponent(currentProfile.name)}`);
    }
  };

  const goToNextProfile = () => {
    if (!profiles) return;
    
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // No more profiles - fetch more or show end state
      refetch(); // Fetch more potential matches
      setCurrentProfileIndex(0);
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 no-horizontal-scroll dashboard-main">
      {/* Desktop Layout */}
      <DesktopLayout
        userName={userName}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
        onLogout={handleLogout}
      >
        <ProfileDisplay
          currentProfile={currentProfile}
          onStartOver={() => setCurrentProfileIndex(0)}
          onGoBack={() => setCurrentProfileIndex(Math.max(0, currentProfileIndex - 1))}
          onLike={handleLike}
          onPass={handlePass}
          onBless={handleBless}
          onMessage={handleMessage}
        />
      </DesktopLayout>

      {/* Mobile Layout */}
      <MobileLayout
        userName={userName}
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
      >
        <ProfileDisplay
          currentProfile={currentProfile}
          onStartOver={() => setCurrentProfileIndex(0)}
          onGoBack={() => setCurrentProfileIndex(Math.max(0, currentProfileIndex - 1))}
          onLike={handleLike}
          onPass={handlePass}
          onBless={handleBless}
          onMessage={handleMessage}
        />
      </MobileLayout>

      {/* Overlay Panels */}
      <OverlayPanels
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        userName={userName}
        onCloseFilters={() => setShowFilters(false)}
        onCloseSidePanel={() => setShowSidePanel(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}