'use client';

import { useSession } from 'next-auth/react';
import { HeartBeatLoader } from '@/components/HeartBeatLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children
}: ProtectedRouteProps) {
  const { status } = useSession({ required: true });

  // Show loading while session is being validated
  if (status === 'loading') {
    return <HeartBeatLoader message="Authenticating..." />;
  }

  // If authenticated, render the children.
  // The `required: true` option in useSession handles redirection,
  // but we keep the loading check for a better UX.
  return <>{children}</>;
}