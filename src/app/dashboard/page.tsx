'use client';

import { DashboardPage } from '@/components/dashboard/DashboardPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { session } = useAuth(false);

  return (
    <ProtectedRoute requireOnboarding={false}>
      <DashboardPage session={session!} />
    </ProtectedRoute>
  );
}