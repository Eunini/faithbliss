import { Heart, FileText } from 'lucide-react';
import { FormData } from './types';

interface PersonalSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

export const PersonalSlide = ({ formData, updateFormData }: PersonalSlideProps) => {
  const relationshipGoalOptions: { [key: string]: string } = {
    MARRIAGE: 'Marriage',
    LONG_TERM_RELATIONSHIP: 'Long-term Relationship',
    FRIENDSHIP: 'Friendship',
    NOT_SURE_YET: 'Not Sure Yet',
  };

  const interestOptions = [
    'Reading', 'Music', 'Singing', 'Sports', 'Fitness', 'Cooking', 'Baking', 'Traveling', 
    'Photography', 'Art', 'Crafts', 'Movies', 'TV Shows', 'Dancing', 'Writing', 'Blogging',
    'Volunteering', 'Community Service', 'Hiking', 'Nature', 'Swimming', 'Gaming',
    'Fashion', 'Learning', 'Prayer', 'Meditation', 'Bible Study'
  ];

  const lifestyleOptions: { [key: string]: string } = {
    ACTIVE_OUTDOORSY: 'Active & Outdoorsy',
    COZY_HOMEBODY: 'Cozy & Homebody',
    SOCIAL_OUTGOING: 'Social & Outgoing',
    CREATIVE_ARTSY: 'Creative & Artsy',
    ACADEMIC_INTELLECTUAL: 'Academic & Intellectual',
    SPONTANEOUS_ADVENTUROUS: 'Spontaneous & Adventurous',
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateFormData('interests', newInterests);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Tell Us About You</h1>
        <p className="text-white/80 text-lg md:text-xl font-medium">A little more about your personality and goals.</p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Relationship Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What are your relationship goals? <span className="text-pink-500">*</span>
          </label>
          <div className="relative max-w-md">
            <Heart className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <select
              value={formData.relationshipGoals || ''}
              onChange={(e) => updateFormData('relationshipGoals', e.target.value)}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white transition-all appearance-none text-sm md:text-base"
            >
              <option value="">Select your goal</option>
              {Object.entries(relationshipGoalOptions).map(([key, value]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Select a few of your interests <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-3 rounded-xl text-sm transition-all hover:scale-105 ${
                  (formData.interests || []).includes(interest)
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Which best describes your lifestyle? <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(lifestyleOptions).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateFormData('lifestyle', key)}
                className={`p-3 rounded-xl text-sm transition-all text-left ${
                  formData.lifestyle === key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Bio <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <textarea
              value={formData.bio || ''}
              onChange={(e) => updateFormData('bio', e.target.value.slice(0, 500))}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-gray-500 transition-all resize-none text-sm md:text-base"
              rows={4}
              placeholder="Tell us a little about yourself, your faith, and what you're looking for."
              maxLength={500}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(formData.bio || '').length}/500 characters
          </div>
        </div>
      </div>
    </div>
  );
};