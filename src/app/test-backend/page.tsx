import { BackendConnectionTest } from '@/components/BackendConnectionTest';

export default function TestBackendPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <BackendConnectionTest />
      </div>
    </div>
  );
}
