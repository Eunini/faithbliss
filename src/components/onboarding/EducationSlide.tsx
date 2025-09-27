import { GraduationCap, Briefcase } from 'lucide-react';
import { FormData } from './types';

interface EducationSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const EducationSlide = ({ formData, updateFormData }: EducationSlideProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Let Others Get to Know You!</h1>
        <p className="text-gray-400 text-sm md:text-base">Educational Background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What Did You Study? <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.fieldOfStudy}
            onChange={(e) => updateFormData('fieldOfStudy', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all text-sm md:text-base"
          >
            <option value="" className="text-gray-500">Select your field of study</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Law">Law</option>
            <option value="Psychology">Psychology</option>
            <option value="Education">Education</option>
            <option value="Arts">Arts</option>
            <option value="Other">Other</option>
          </select>
          
          {formData.fieldOfStudy === 'Other' && (
            <div className="mt-3">
              <div className="relative">
                <GraduationCap className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.customFieldOfStudy || ''}
                  onChange={(e) => updateFormData('customFieldOfStudy', e.target.value.slice(0, 50))}
                  className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
                  placeholder="Enter your field of study"
                  maxLength={50}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(formData.customFieldOfStudy || '').length}/50 characters
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What Degree Do You Have? <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.degree}
            onChange={(e) => updateFormData('degree', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all text-sm md:text-base"
          >
            <option value="" className="text-gray-500">Select your degree</option>
            <option value="High School">High School</option>
            <option value="Associate">Associate</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What is Your Current Profession? <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => updateFormData('profession', e.target.value.slice(0, 50))}
              className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
              placeholder="Enter your profession"
              maxLength={50}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formData.profession.length}/50 characters
          </div>
        </div>
      </div>
    </div>
  );
};