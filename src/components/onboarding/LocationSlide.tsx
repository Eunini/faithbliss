import { MapPin } from 'lucide-react';
import { FormData } from './types';
import { OpenCageAutocomplete } from '../OpenCageAutocomplete';

interface LocationSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
}

export const LocationSlide = ({ formData, updateFormData }: LocationSlideProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Where are you located?</h1>
        <p className="text-gray-400 text-sm md:text-base">This helps us find matches near you.</p>
      </div>

      <div className="max-w-xl mx-auto">
        <OpenCageAutocomplete
          value={formData.location || ''}
          onChange={(value) => updateFormData('location', value)}
          placeholder="Enter your city and country"
          label="Your Location"
          icon={<MapPin className="w-5 h-5 text-gray-500" />}
          required
        />
      </div>
    </div>
  );
};