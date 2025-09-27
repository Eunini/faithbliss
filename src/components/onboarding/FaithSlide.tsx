import { Heart, Church, Book, Star } from 'lucide-react';
import { FormData } from './types';

interface FaithSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | boolean) => void;
}

export const FaithSlide = ({ formData, updateFormData }: FaithSlideProps) => {
  const denominations = [
    'Catholic', 'Protestant', 'Orthodox', 'Pentecostal', 'Baptist',
    'Methodist', 'Presbyterian', 'Lutheran', 'Anglican', 'Non-denominational',
    'Other'
  ];

  const faithLevels = [
    'Very Spiritual',
    'Moderately Spiritual', 
    'Somewhat Spiritual',
    'Not Very Spiritual'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <Church className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Faith & Beliefs</h1>
        <p className="text-gray-400 text-sm md:text-base">Share your spiritual journey with us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What&apos;s your denomination? <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <Church className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <select
              value={formData.denomination}
              onChange={(e) => updateFormData('denomination', e.target.value)}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all appearance-none text-sm md:text-base"
            >
              <option value="">Select denomination</option>
              {denominations.map((denom) => (
                <option key={denom} value={denom} className="bg-gray-800">
                  {denom}
                </option>
              ))}
            </select>
          </div>
          
          {formData.denomination === 'Other' && (
            <div className="mt-3">
              <div className="relative">
                <Church className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.customDenomination || ''}
                  onChange={(e) => updateFormData('customDenomination', e.target.value.slice(0, 50))}
                  className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
                  placeholder="Enter your denomination"
                  maxLength={50}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(formData.customDenomination || '').length}/50 characters
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How spiritual are you? <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <Star className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <select
              value={formData.spiritualLevel}
              onChange={(e) => updateFormData('spiritualLevel', e.target.value)}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all appearance-none text-sm md:text-base"
            >
              <option value="">Select spiritual level</option>
              {faithLevels.map((level) => (
                <option key={level} value={level} className="bg-gray-800">
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Favorite Bible verse (optional)
          </label>
          <div className="relative">
            <Book className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <textarea
              value={formData.favoriteVerse}
              onChange={(e) => updateFormData('favoriteVerse', e.target.value.slice(0, 200))}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all resize-none text-sm md:text-base"
              rows={3}
              placeholder="Enter your favorite Bible verse"
              maxLength={200}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formData.favoriteVerse.length}/200 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What do you love most about your faith? <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <Heart className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <textarea
              value={formData.faithLove}
              onChange={(e) => updateFormData('faithLove', e.target.value.slice(0, 300))}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all resize-none text-sm md:text-base"
              rows={3}
              placeholder="Share what you love about your faith"
              maxLength={300}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formData.faithLove.length}/300 characters
          </div>
        </div>
      </div>
    </div>
  );
};