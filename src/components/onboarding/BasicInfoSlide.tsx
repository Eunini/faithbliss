import { User, Camera, X } from 'lucide-react';
import { FormData } from './types';
import { CountryCodeSelect, defaultCountry } from '../CountryCodeSelect';
import { useState, useEffect } from 'react';

interface BasicInfoSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

export const BasicInfoSlide = ({ formData, updateFormData }: BasicInfoSlideProps) => {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  // Initialize country code if not set
  useEffect(() => {
    if (!formData.countryCode) {
      updateFormData('countryCode', defaultCountry.dialCode);
    }
  }, [formData.countryCode, updateFormData]);

  const handlePhotoUpload = (photoNumber: 1 | 2) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData(`profilePhoto${photoNumber}`, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country);
    updateFormData('countryCode', country.dialCode);
  };
  const PhotoUpload = ({ photoNumber, photo }: { photoNumber: 1 | 2; photo: string | null }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 text-center">
        Photo {photoNumber} <span className="text-pink-500">*</span>
      </label>
      <div className="relative">
        {photo ? (
          <div className="relative w-32 h-32 mx-auto sm:w-28 sm:h-28">
            <img
              src={photo}
              alt={`Profile ${photoNumber}`}
              className="w-full h-full object-cover rounded-2xl border-2 border-gray-700"
            />
            <button
              onClick={() => updateFormData(`profilePhoto${photoNumber}`, null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block w-32 h-32 mx-auto border-2 border-dashed border-gray-600 rounded-2xl hover:border-pink-500 cursor-pointer transition-colors group sm:w-28 sm:h-28">
            <div className="flex flex-col items-center justify-center h-full">
              <Camera className="w-6 h-6 text-gray-500 mb-1 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs text-gray-500 text-center px-2 group-hover:text-pink-500 transition-colors">Add Photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload(photoNumber)}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to FaithBliss!</h1>
        <p className="text-gray-400 text-sm md:text-base">You made it to FaithBliss! Now let&apos;s spin up your profile and get you started.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Photo Upload Section */}
        <div className="lg:order-2 flex flex-col items-center space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upload Your Photos</h3>
          <div className="flex flex-row lg:flex-col gap-6 justify-center">
            <PhotoUpload photoNumber={1} photo={formData.profilePhoto1} />
            <PhotoUpload photoNumber={2} photo={formData.profilePhoto2} />
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2 lg:order-1 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
              placeholder="Enter your full name"
            />
          </div>

          <CountryCodeSelect
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            phoneNumber={formData.phoneNumber}
            onPhoneChange={(phone) => updateFormData('phoneNumber', phone)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender <span className="text-pink-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Male', 'Female'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => updateFormData('gender', gender)}
                  className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 text-sm md:text-base ${
                    formData.gender === gender
                      ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Birthday <span className="text-pink-500">*</span>
            </label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => updateFormData('birthday', e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white transition-all text-sm md:text-base"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
            <span className="text-sm text-gray-300">Show my age on my profile</span>
            <button
              onClick={() => updateFormData('showAge', !formData.showAge)}
              className={`w-12 h-6 rounded-full transition-all ${
                formData.showAge ? 'bg-pink-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${
                formData.showAge ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};