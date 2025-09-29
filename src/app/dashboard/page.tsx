/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState, useRef, useEffect } from 'react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TopBar } from '@/components/dashboard/TopBar';
import { FloatingActionButtons } from '@/components/dashboard/FloatingActionButtons';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { SidePanel } from '@/components/dashboard/SidePanel';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { ProfileQueue } from '@/components/dashboard/ProfileQueue';
import { insertScrollbarStyles } from '@/components/dashboard/styles';
import { mockProfiles } from '@/data/mockProfiles';

// Insert scrollbar styles
insertScrollbarStyles();

const DashboardPage = () => {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!loading && user && userProfile && !userProfile.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, userProfile, loading, router]);

  const userName = userProfile?.displayName || user?.displayName || "Friend";
  
  // Show loading while checking authentication
  if (loading) {
    return <HeartBeatLoader message="Preparing your matches..." />;
  }
  
  // Get current profiles to display (current + next 3)
  const currentProfiles = mockProfiles.slice(currentProfileIndex, currentProfileIndex + 4);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLike = () => {
    // Desktop animation
    if (!isMobile) {
      setDragOffset({ x: 300, y: 0 });
      setTimeout(() => {
        setCurrentProfileIndex(prev => prev + 1);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
      return;
    }
    
    // Mobile behavior
    setCurrentProfileIndex(prev => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePass = () => {
    // Desktop animation
    if (!isMobile) {
      setDragOffset({ x: -300, y: 0 });
      setTimeout(() => {
        setCurrentProfileIndex(prev => prev + 1);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
      return;
    }
    
    // Mobile behavior
    setCurrentProfileIndex(prev => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleBless = () => {
    // Changed from "send blessing" to bookmark functionality
    console.log('Bookmarked profile');
  };

  const handleMessage = () => {
    const profile = currentProfiles[0];
    if (profile) {
      router.push(`/messages?profileId=${profile.id}&profileName=${encodeURIComponent(profile.name)}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) return;
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        handleLike();
      } else {
        handlePass();
      }
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (isMobile || !isDragging) return;
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        handleLike();
      } else {
        handlePass();
      }
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleExpandProfile = (profileId: number) => {
    setExpandedProfile(expandedProfile === profileId ? null : profileId);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading your faithful connections...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-x-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen overflow-x-hidden">
        {/* Desktop Side Panel - Full Height, No Top Padding */}
        <div className="w-80 flex-shrink-0">
          <SidePanel userName={userName} onClose={() => {}} onLogout={handleLogout} />
        </div>
        
        {/* Main Content Area - With TopBar and scrollable content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Bar */}
          <TopBar
            userName={userName}
            showFilters={showFilters}
            showSidePanel={showSidePanel}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
          />
          
          {/* Scrollable Content Area */}
          <div className="flex-1 flex justify-center items-start px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
            <div className="w-full max-w-lg mx-auto relative overflow-hidden">
              {/* Desktop: Card Stack Layout */}
              <div className="relative h-[450px] w-full">
                {currentProfiles.map((profile, index) => {
                  const isMain = index === 0;
                  const rotation = isMain ? 0 : (index - 1) * 6 + Math.random() * 8 - 4;
                  const scale = isMain ? 1 : 0.95 - (index * 0.02);
                  const xOffset = isMain ? 0 : (index - 1) * 15 + Math.random() * 20 - 10;
                  const yOffset = isMain ? 0 : (index - 1) * -5;
                  const zIndex = currentProfiles.length - index;

                  return (
                    <div
                      key={profile.id}
                      className="absolute inset-0 transition-all duration-300 ease-out"
                      style={{
                        transform: `translateX(${xOffset + (isMain ? dragOffset.x : 0)}px) translateY(${yOffset + (isMain ? dragOffset.y : 0)}px) rotate(${rotation + (isMain ? dragOffset.x * 0.1 : 0)}deg) scale(${scale})`,
                        zIndex: zIndex,
                        opacity: isMain ? Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300) : 0.8 - (index * 0.15)
                      }}
                    >
                      <ProfileCard
                        profile={profile}
                        onLike={handleLike}
                        onPass={handlePass}
                        onToggleExpand={toggleExpandProfile}
                        isStackCard={!isMain}
                        onTouchStart={isMain ? handleTouchStart : undefined}
                        onTouchMove={isMain ? handleTouchMove : undefined}
                        onTouchEnd={isMain ? handleTouchEnd : undefined}
                        onMouseDown={isMain ? handleMouseDown : undefined}
                        onMouseMove={isMain ? handleMouseMove : undefined}
                        onMouseUp={isMain ? handleMouseUp : undefined}
                        onMouseLeave={isMain ? handleMouseUp : undefined}
                        onClick={() => toggleExpandProfile(profile.id)}
                        expanded={expandedProfile === profile.id}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Floating Action Buttons - Desktop */}
              <FloatingActionButtons
                onGoBack={handleGoBack}
                onPass={handlePass}
                onBless={handleBless}
                onLike={handleLike}
                onMessage={handleMessage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <TopBar
          userName={userName}
          showFilters={showFilters}
          showSidePanel={showSidePanel}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
        />

        {/* Main Container - Mobile */}
        <div className="flex min-h-screen pt-4 pb-20 overflow-x-hidden">
          {/* Main Content Area - Mobile Single Card */}
          <div className="flex-1 flex justify-center items-center px-4 min-w-0">
            <div className="w-full max-w-sm mx-auto relative overflow-hidden">
              <div className="relative w-full">
                <div
                  ref={cardRef}
                  className="relative"
                  style={{
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
                    transition: isDragging ? 'none' : 'all 0.3s ease'
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {currentProfiles[0] && (
                    <ProfileCard
                      profile={currentProfiles[0]}
                      onLike={handleLike}
                      onPass={handlePass}
                      onToggleExpand={toggleExpandProfile}
                      expanded={expandedProfile === currentProfiles[0].id}
                    />
                  )}
                </div>
              </div>

              {/* Floating Action Buttons - Mobile */}
              <FloatingActionButtons
                onGoBack={handleGoBack}
                onPass={handlePass}
                onBless={handleBless}
                onLike={handleLike}
                onMessage={handleMessage}
              />
            </div>
          </div>
        </div>
      </div>

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
            <SidePanel userName={userName} onClose={() => setShowSidePanel(false)} onLogout={handleLogout} />
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
  );
};

export default DashboardPage;