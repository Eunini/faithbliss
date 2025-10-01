import { Church, Book } from 'lucide-react';
import { FormData } from './types';

interface FaithSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | boolean) => void;
}

export const FaithSlide = ({ formData, updateFormData }: FaithSlideProps) => {
  const denominations = [
    'Baptist', 'Pentecostal', 'Methodist', 'Presbyterian', 'Catholic',
    'Anglican', 'Orthodox', 'Lutheran', 'Assemblies of God', 'Seventh-day Adventist',
    'Non-denominational', 'Deeper Life', 'RCCG', 'Winners Chapel', 'Mountain of Fire',
    'Christ Embassy', 'Other'
  ];

  const churchDepartments = [
    'Choir/Music Ministry', 'Ushering', 'Children Ministry', 'Youth Ministry',
    'Technical/Media', 'Protocol', 'Hospitality', 'Evangelism', 'Prayer Ministry',
    'Drama Ministry', 'Dance Ministry', 'Welfare/Benevolence', 'Security',
    'Counseling', 'Sanctuary Keeping', 'Other'
  ];

  const completedClasses = [
    'Foundational Class', 'Membership Class', 'None'
  ];

  const faithJourneyOptions = [
    'new & grooming', 'rooted & steady', 'still exploring & learning', 'on fire & passionate'
  ];

  const faithInRelationshipsOptions = [
    'the foundation', 'a guiding compass', 'a shared growth journey', 'something I\'m still discovering'
  ];



  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <Church className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Now, Let&apos;s Dive Deeper Into Your Faith!</h1>
        <p className="text-white/80 text-lg md:text-xl font-medium">Share your spiritual journey with us</p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Denomination */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Which Denomination Are You In? <span className="text-pink-500">*</span>
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
            </div>
          )}
        </div>

        {/* Church Worker */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Are You A Worker? <span className="text-pink-500">*</span>
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updateFormData('isWorker', true)}
              className={`flex-1 p-3 rounded-xl border transition-all text-sm md:text-base ${
                formData.isWorker === true
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateFormData('isWorker', false)}
              className={`flex-1 p-3 rounded-xl border transition-all text-sm md:text-base ${
                formData.isWorker === false
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Church Department - Only show if isWorker is true */}
        {formData.isWorker && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Which Department Are You In Church?
            </label>
            <select
              value={formData.churchDepartment}
              onChange={(e) => updateFormData('churchDepartment', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all text-sm md:text-base"
            >
              <option value="">Select department</option>
              {churchDepartments.map((dept) => (
                <option key={dept} value={dept} className="bg-gray-800">
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Completed Classes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Which Have You Completed? <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.completedClasses}
            onChange={(e) => updateFormData('completedClasses', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all text-sm md:text-base"
          >
            <option value="">Select completed classes</option>
            {completedClasses.map((cls) => (
              <option key={cls} value={cls} className="bg-gray-800">
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Church Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How Long Have You Been In Your Current Church? <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            value={formData.churchDuration}
            onChange={(e) => updateFormData('churchDuration', e.target.value.slice(0, 50))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
            placeholder="e.g., 2 years, 6 months, since childhood"
            maxLength={50}
          />
        </div>

        {/* Faith Journey */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Which Best Describes Your Faith Journey Right Now? <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faithJourneyOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateFormData('faithJourney', option)}
                className={`p-3 rounded-xl border transition-all text-sm md:text-base text-left ${
                  formData.faithJourney === option
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Faith in Relationships */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What Role Does Faith Play In Your Relationships? <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faithInRelationshipsOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateFormData('faithInRelationships', option)}
                className={`p-3 rounded-xl border transition-all text-sm md:text-base text-left ${
                  formData.faithInRelationships === option
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Bible Verse */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What&apos;s A Bible Verse That Inspires You? <span className="text-pink-500">*</span>
            <span className="text-gray-500 text-xs">(will be shown in your bio)</span>
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
      </div>
    </div>
  );
};