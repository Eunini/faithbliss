import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardPage } from '@/components/dashboard/DashboardPage'; // Assuming you move the component

export default async function ProtectedDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashboardPage session={session} />;
}