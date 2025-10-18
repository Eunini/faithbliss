import { ProfileData } from '@/types/profile';

interface FaithSectionProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
}

const FaithSection = ({ profileData, setProfileData }: FaithSectionProps) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Faith Journey</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Denomination</label>
          <select
            value={profileData.denomination}
            onChange={(e) => setProfileData(prev => prev ? ({...prev, denomination: e.target.value}) : null)}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white focus:border-pink-500 focus:outline-none transition-colors"
          >
            <option value="Pentecostal">Pentecostal</option>
            <option value="Baptist">Baptist</option>
            <option value="Catholic">Catholic</option>
            <option value="Anglican">Anglican</option>
            <option value="Methodist">Methodist</option>
            <option value="Presbyterian">Presbyterian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Faith Journey Stage</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Exploring Faith 🌱',
              'Growing in Faith 🌿',
              'Rooted & Steady 🪴',
              'Passionate Believer 🔥'
            ].map(stage => (
              <button
                key={stage}
                onClick={() => setProfileData(prev => prev ? ({...prev, faithJourney: stage}) : null)}
                className={`p-4 rounded-2xl font-medium transition-all ${
                  profileData.faithJourney && profileData.faithJourney === stage
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Church Role</label>
          <input
            type="text"
            value={profileData.churchRole}
            onChange={(e) => setProfileData(prev => prev ? ({...prev, churchRole: e.target.value}) : null)}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Creative Team Lead"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Favorite Bible Verse</label>
          <textarea
            value={profileData.favoriteVerse}
            onChange={(e) => setProfileData(prev => prev ? ({...prev, favoriteVerse: e.target.value}) : null)}
            rows={3}
            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Share a verse that speaks to your heart..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Looking For</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              'Christian Friendship 💫',
              'Dating with Purpose 💕',
              'Life Partner 💍'
            ].map(goal => (
              <button
                key={goal}
                onClick={() => setProfileData(prev => prev ? ({...prev, lookingFor: goal}) : null)}
                className={`p-4 rounded-2xl font-medium transition-all ${
                  profileData.lookingFor && profileData.lookingFor === goal
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FaithSection;
