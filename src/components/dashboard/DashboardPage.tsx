/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { DesktopLayout } from '@/components/dashboard/DesktopLayout';
import { MobileLayout } from '@/components/dashboard/MobileLayout';
import { ProfileDisplay } from '@/components/dashboard/ProfileDisplay';
import { OverlayPanels } from '@/components/dashboard/OverlayPanels';
import { insertScrollbarStyles } from '@/components/dashboard/styles';
import { usePotentialMatches, useMatching, useUserProfile, useAllUsers } from '@/hooks/useAPI';
import { Profile } from '@/components/dashboard/types';
import { Session } from 'next-auth';
import { API, User } from '@/services/api';

// Insert scrollbar styles
insertScrollbarStyles();

export const DashboardPage = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { showSuccess, showInfo } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [filteredProfiles, setFilteredProfiles] = useState<User[] | null>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  // Fetch real potential matches from backend
  const { data: profiles, loading: matchesLoading, error: matchesError, refetch } = usePotentialMatches();
  const { data: allUsersResponse, loading: allUsersLoading, error: allUsersError } = useAllUsers({ limit: 50 });
  const allUsers = allUsersResponse?.users;
  const { data: user, loading: userLoading } = useUserProfile();
  const { likeUser, passUser } = useMatching();

  const userName = user?.name || session?.user?.name || "User";
  const userImage = user?.profilePhotos?.photo1 || session?.user?.image || undefined;

  const activeProfiles = (profiles && profiles.length > 0) ? profiles : allUsersResponse?.users;

  useEffect(() => {
    setCurrentProfileIndex(0);
  }, [filteredProfiles, activeProfiles]);

  // Show loading state while fetching matches or refreshing the token.
  if (matchesLoading || userLoading || allUsersLoading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  }

  // Handle error state for profiles
  if (matchesError || allUsersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 mb-4">Failed to load profiles: {matchesError || allUsersError}</p>
          <button
            onClick={() => refetch()} // Assuming refetch from usePotentialMatches can re-fetch both
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle no profiles found
  if (!activeProfiles || activeProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-400 mb-4">No profiles found matching your criteria.</p>
          <button
            onClick={() => {
              setFilteredProfiles(null); // Clear any applied filters
              refetch(); // Re-fetch potential matches
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reset Filters & Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = activeProfiles?.[currentProfileIndex] as Profile;

  const goToNextProfile = () => {
    if (!activeProfiles) return;
    
    if (currentProfileIndex < activeProfiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      if (filteredProfiles) {
        showInfo("End of filtered results.");
      } else {
        refetch(); // Fetch more potential matches
        setCurrentProfileIndex(0);
      }
    }
  };

  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      await likeUser(currentProfile.id);
      console.log(`Liked profile ${currentProfile.id}`);
      goToNextProfile();
    } catch (error) {
      console.error('Failed to like user:', error);
    }
  };

  const handlePass = async () => {
    if (!currentProfile) return;
    
    try {
      await passUser(currentProfile.id);
      console.log(`Passed on profile ${currentProfile.id}`);
      goToNextProfile();
    } catch (error) {
      console.error('Failed to pass user:', error);
      // Still go to next profile even if pass fails
      goToNextProfile();
    }
  };


  const handleMessage = () => {
    if (currentProfile) {
      router.push(`/messages?profileId=${currentProfile.id}&profileName=${encodeURIComponent(currentProfile.name)}`);
    }
  };

  const handleApplyFilters = async (filters: any) => {
    setIsLoadingFilters(true);
    try {
      const results = await API.Discovery.filterProfiles(filters);
      setFilteredProfiles(results);
      showSuccess('Filters applied!');
    } catch (error) {
      console.error('Failed to apply filters:', error);
    } finally {
      setIsLoadingFilters(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pb-20 no-horizontal-scroll dashboard-main">
      {isLoadingFilters && <HeartBeatLoader message="Applying filters..." />}
      {/* Desktop Layout */}
      <DesktopLayout
        userName={userName}
        userImage={userImage}
        user={user}
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
          onMessage={handleMessage}
        />
      </DesktopLayout>

      {/* Mobile Layout */}
      <MobileLayout
        userName={userName}
        userImage={userImage}
        user={user}
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
          onMessage={handleMessage}
        />
      </MobileLayout>

      {/* Overlay Panels */}
      <OverlayPanels
        showFilters={showFilters}
        showSidePanel={showSidePanel}
        userName={userName}
        userImage={userImage}
        user={user}
        onCloseFilters={() => setShowFilters(false)}
        onCloseSidePanel={() => setShowSidePanel(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
