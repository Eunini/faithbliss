import { Church } from 'lucide-react';
import { FormData } from './types';

interface FaithSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | boolean) => void;
}

export const FaithSlide = ({ formData, updateFormData }: FaithSlideProps) => {
  const denominations = [
    'BAPTIST', 'METHODIST', 'PRESBYTERIAN', 'PENTECOSTAL', 'CATHOLIC', 'ORTHODOX', 
    'ANGLICAN', 'LUTHERAN', 'ASSEMBLIES_OF_GOD', 'SEVENTH_DAY_ADVENTIST', 'OTHER'
  ];

  const churchAttendanceOptions = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    OCCASIONALLY: 'Occasionally',
    HOLIDAYS_ONLY: 'Holidays Only',
    NEVER: 'Never',
  };

  const baptismStatusOptions = {
    YES: 'Yes',
    NO: 'No',
    PLANNING_TO: 'Planning To',
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <Church className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Faith Journey</h1>
        <p className="text-white/80 text-lg md:text-xl font-medium">Share a bit about your spiritual life.</p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Denomination */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Denomination <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.denomination}
            onChange={(e) => updateFormData('denomination', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all appearance-none text-sm md:text-base"
          >
            <option value="">Select denomination</option>
            {denominations.map((denom) => (
              <option key={denom} value={denom} className="bg-gray-800">
                {denom.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          
          {formData.denomination === 'OTHER' && (
            <div className="mt-3">
              <input
                type="text"
                value={formData.customDenomination || ''}
                onChange={(e) => updateFormData('customDenomination', e.target.value.slice(0, 50))}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
                placeholder="Please specify your denomination"
                maxLength={50}
              />
            </div>
          )}
        </div>

        {/* Church Attendance */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How Often Do You Attend Church? <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.churchAttendance}
            onChange={(e) => updateFormData('churchAttendance', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all text-sm md:text-base"
          >
            <option value="">Select attendance frequency</option>
            {Object.entries(churchAttendanceOptions).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Baptism Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Have You Been Baptized? <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(baptismStatusOptions).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateFormData('baptismStatus', key)}
                className={`p-3 rounded-xl border transition-all text-sm md:text-base ${
                  formData.baptismStatus === key
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};