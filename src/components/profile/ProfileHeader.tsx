import { ArrowLeft, Edit3, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileHeader = () => {
  const router = useRouter();

  return (
    <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-30 px-4 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        
        <div className="flex gap-3">
          <button className="p-2 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors">
            <Edit3 className="w-5 h-5 text-gray-300" />
          </button>
          <button className="p-2 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
