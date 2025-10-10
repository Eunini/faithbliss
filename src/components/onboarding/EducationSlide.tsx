import { GraduationCap, Briefcase } from 'lucide-react';
import { FormData } from './types';

interface EducationSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
}

const educationLevels = {
  HIGH_SCHOOL: 'High School',
  BACHELORS: 'Bachelor\'s Degree',
  MASTERS: 'Master\'s Degree',
  PHD: 'PhD / Doctorate',
  VOCATIONAL: 'Vocational School',
  OTHER: 'Other',
};

export const EducationSlide = ({ formData, updateFormData }: EducationSlideProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Background</h1>
        <p className="text-white/80 text-lg md:text-xl font-medium">Help others get to know you better.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Highest Level of Education <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.education}
            onChange={(e) => updateFormData('education', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all text-sm md:text-base"
          >
            <option value="" className="text-gray-500">Select your education level</option>
            {Object.entries(educationLevels).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Occupation <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => updateFormData('occupation', e.target.value.slice(0, 50))}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
              placeholder="e.g., Software Engineer, Nurse"
              maxLength={50}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(formData.occupation || '').length}/50 characters
          </div>
        </div>
      </div>
    </div>
  );
};