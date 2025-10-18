import { ProfileData } from '@/types/profile';

interface LifestyleSectionProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
}

const LifestyleSection = ({ profileData, setProfileData }: LifestyleSectionProps) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Lifestyle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries({
          prayerLife: { label: 'Prayer Life', options: ['Daily', 'Weekly', 'Occasionally', 'Growing'] },
          bibleStudy: { label: 'Bible Study', options: ['Daily', 'Weekly', 'Monthly', 'Occasional'] },
          workout: { label: 'Physical Activity', options: ['Daily', 'Weekly', 'Occasionally', 'Rarely'] },
          diet: { label: 'Dietary Preference', options: ['Anything', 'Vegetarian', 'Vegan', 'Kosher', 'Halal', 'Organic'] },
          socialStyle: { label: 'Social Style', options: ['Outgoing', 'Reserved', 'Balanced', 'Adventurous'] },
          musicPreference: { label: 'Music Style', options: ['Worship', 'Gospel', 'Contemporary', 'Classical', 'Mixed'] }
        }).map(([key, config]) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-300 mb-4">{config.label}</label>
            <div className="grid grid-cols-2 gap-3">
              {config.options.map(option => (
                <button
                  key={option}
                  onClick={() => setProfileData(prev => prev ? ({
                    ...prev, 
                    lifestyle: {...prev.lifestyle, [key]: option}
                  }) : null)}
                  className={`p-3 rounded-2xl font-medium transition-all ${
                    profileData.lifestyle && profileData.lifestyle[key as keyof typeof profileData.lifestyle] === option
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LifestyleSection;
