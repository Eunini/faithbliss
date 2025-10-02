import { HingeStyleProfileCard } from './HingeStyleProfileCard';
import { NoProfilesState } from './NoProfilesState';
import { FloatingActionButtons } from './FloatingActionButtons';
import { Profile } from './types';

interface ProfileDisplayProps {
  currentProfile: Profile | null;
  onStartOver: () => void;
  onGoBack: () => void;
  onLike: () => void;
  onPass: () => void;
  onBless: () => void;
  onMessage: () => void;
}

export const ProfileDisplay = ({
  currentProfile,
  onStartOver,
  onGoBack,
  onLike,
  onPass,
  onBless,
  onMessage
}: ProfileDisplayProps) => {
  if (!currentProfile) {
    return <NoProfilesState onStartOver={onStartOver} />;
  }

  return (
    <>
      <HingeStyleProfileCard profile={currentProfile} />
      
      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onGoBack={() => onGoBack()}
        onLike={onLike}
        onPass={onPass}
        onBless={onBless}
        onMessage={onMessage}
      />
    </>
  );
};