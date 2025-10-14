'use client';

import { useState } from 'react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { DesktopLayout } from '@/components/dashboard/DesktopLayout';
import { MobileLayout } from '@/components/dashboard/MobileLayout';
import { ProfileDisplay } from '@/components/dashboard/ProfileDisplay';
import { OverlayPanels } from '@/components/dashboard/OverlayPanels';
import { insertScrollbarStyles } from '@/components/dashboard/styles';
import { usePotentialMatches, useMatching, useUserProfile } from '@/hooks/useAPI';
import { Profile } from '@/components/dashboard/types';
import { Session } from 'next-auth';

// Insert scrollbar styles
insertScrollbarStyles();

export const DashboardPage = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { showSuccess, showInfo } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  
  // Fetch real potential matches from backend
  const { data: profiles, loading: matchesLoading, error, refetch } = usePotentialMatches();
  const { data: user, loading: userLoading } = useUserProfile();
  const { likeUser, passUser } = useMatching();

  const userName = user?.name || session?.user?.name || "User";
  const userImage = user?.profilePhotos?.photo1 || session?.user?.image || undefined;

  // Show loading state while fetching matches or refreshing the token.
  if (matchesLoading || userLoading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  }
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
          onBless={handleBless}
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
          onBless={handleBless}
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
      />
