/* eslint-disable @typescript-eslint/no-unused-vars */
import { HingeStyleProfileCard } from './HingeStyleProfileCard';
import { NoProfilesState } from './NoProfilesState';
import { FloatingActionButtons } from './FloatingActionButtons';
import { User } from '@/services/api';

interface ProfileDisplayProps {
  currentProfile: User | null;
  onStartOver: () => void;
  onGoBack: () => void;
  onLike: () => void;
  onPass: () => void;
  onMessage: () => void;
}

export const ProfileDisplay = ({
  currentProfile,
  onStartOver,
  onGoBack,
  onLike,
  onPass,
  onMessage
}: ProfileDisplayProps) => {
  if (!currentProfile) {
    return <NoProfilesState onStartOver={onStartOver} />;
  }

  return (
    <>
      <HingeStyleProfileCard 
        profile={currentProfile} 
        onGoBack={onGoBack}
        onLike={onLike}
        onPass={onPass}
        onMessage={onMessage}
      />
    </>
  );
};