import { Heart, FileText } from 'lucide-react';
import { FormData } from './types';

interface PersonalSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

export const PersonalSlide = ({ formData, updateFormData }: PersonalSlideProps) => {
  const lookingForOptions = [
    'friendship',
    'life partner'
  ];

  const hobbyOptions = [
    'Reading', 'Music & Singing', 'Sports & Fitness', 'Cooking & Baking', 'Traveling', 
    'Photography', 'Art & Crafts', 'Movies & TV', 'Dancing', 'Writing & Blogging',
    'Volunteering & Community Service', 'Hiking & Nature', 'Swimming', 'Gaming',
    'Fashion & Style', 'Learning New Skills', 'Prayer & Meditation', 'Bible Study'
  ];

  const valueOptions = [
    'Strong Faith & Spirituality', 'Honesty & Transparency', 'Kindness & Compassion', 
    'Loyalty & Commitment', 'Good Sense of Humor', 'Intelligence & Wisdom', 
    'Family-Oriented', 'Ambition & Goals', 'Emotional Maturity', 'Good Communication',
    'Respect & Understanding', 'Integrity & Character', 'Generosity & Giving Heart',
    'Patience & Grace', 'Adventure & Fun-loving', 'Stability & Reliability'
  ];

  const sundayActivityOptions = [
    'be at church or serving',
    'resting & recharging', 
    'grabbing lunch with friends',
    'out on a fun adventure'
  ];

  const personalityOptions = [
    'introvert',
    'extrovert', 
    'ambivert'
  ];

  const toggleArrayItem = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFormData(field, newArray);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Finally, Let&apos;s Dive Deeper Into Your Bliss!</h1>
        <p className="text-white/80 text-lg md:text-xl font-medium">Tell us more about yourself</p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What are you looking for? <span className="text-pink-500">*</span>
          </label>
          <div className="relative max-w-md">
            <Heart className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <select
              value={formData.lookingFor}
              onChange={(e) => updateFormData('lookingFor', e.target.value)}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white transition-all appearance-none text-sm md:text-base"
            >
              <option value="">Select what you&apos;re looking for</option>
              {lookingForOptions.map((option) => (
                <option key={option} value={option} className="bg-gray-800">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Your hobbies <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {hobbyOptions.map((hobby) => (
              <button
                key={hobby}
                type="button"
                onClick={() => toggleArrayItem(formData.hobbies, hobby, 'hobbies')}
                className={`p-3 rounded-xl text-sm transition-all hover:scale-105 ${
                  formData.hobbies.includes(hobby)
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {hobby}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Your values <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {valueOptions.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleArrayItem(formData.values, value, 'values')}
                className={`p-3 rounded-xl text-sm transition-all hover:scale-105 ${
                  formData.values.includes(value)
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Sunday Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            On A Sunday Afternoon, You&apos;re Most Likely To? <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sundayActivityOptions.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => updateFormData('sundayActivity', activity)}
                className={`p-3 rounded-xl text-sm transition-all text-left ${
                  formData.sundayActivity === activity
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Personality Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Which Are You? <span className="text-pink-500">*</span>
          </label>
          <div className="flex gap-4 max-w-md">
            {personalityOptions.map((trait) => (
              <button
                key={trait}
                type="button"
                onClick={() => updateFormData('personality', trait)}
                  className={`p-3 rounded-xl text-sm transition-all hover:scale-105 ${
                    formData.personality === trait
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {trait}
                </button>
            ))}
          </div>
        </div>

        {/* About Me */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe Yourself In One Sentence! Something You&apos;d Love Others To Know About You! <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <textarea
              value={formData.aboutMe}
              onChange={(e) => updateFormData('aboutMe', e.target.value.slice(0, 500))}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-gray-500 transition-all resize-none text-sm md:text-base"
              rows={4}
              placeholder="Share something about yourself that others would find interesting"
              maxLength={500}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formData.aboutMe.length}/500 characters
          </div>
        </div>
      </div>
    </div>
  );
};