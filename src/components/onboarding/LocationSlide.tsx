import { MapPin, Home, Compass } from 'lucide-react';
import { FormData } from './types';
import { OpenCageAutocomplete } from '../OpenCageAutocomplete';

interface LocationSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const LocationSlide = ({ formData, updateFormData }: LocationSlideProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">State/Location</h1>
        <p className="text-gray-400 text-sm md:text-base">Tell us about where you&apos;re from</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <OpenCageAutocomplete
          value={formData.grewUp}
          onChange={(value) => updateFormData('grewUp', value)}
          placeholder="Enter where you grew up"
          label="Where did you grow up?"
          icon={<Home className="w-5 h-5 text-gray-500" />}
          required
        />

        <OpenCageAutocomplete
          value={formData.hometown}
          onChange={(value) => updateFormData('hometown', value)}
          placeholder="Enter your hometown"
          label="Where are you from?"
          icon={<MapPin className="w-5 h-5 text-gray-500" />}
          required
        />

        <OpenCageAutocomplete
          value={formData.currentLocation}
          onChange={(value) => updateFormData('currentLocation', value)}
          placeholder="Enter your current location"
          label="Where are you based?"
          icon={<Compass className="w-5 h-5 text-gray-500" />}
          required
          className="md:col-span-2"
        />
      </div>
    </div>
  );
};