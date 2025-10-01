import { User, Camera, X } from 'lucide-react';
import { FormData } from './types';
import { CountryCodeSelect, defaultCountry, type Country } from '../CountryCodeSelect';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BasicInfoSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | boolean | null) => void;
}

export const BasicInfoSlide = ({ formData, updateFormData }: BasicInfoSlideProps) => {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  // Initialize country code if not set
  useEffect(() => {
    if (!formData.countryCode) {
      updateFormData('countryCode', defaultCountry.dialCode);
    }
  }, [formData.countryCode, updateFormData]);

  const handlePhotoUpload = (photoNumber: 1 | 2 | 3) => (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Photo upload triggered for photo', photoNumber);
    const file = event.target.files?.[0];
    
    if (file) {
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Check file size (max 15MB for iOS HEIC compatibility)
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        alert('File size too large. Please choose an image smaller than 15MB.');
        return;
      }

      // Enhanced validation with stricter rules for third photo
      const strictImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const strictImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      const allImageTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
        'image/heic', 'image/heif', 'image/avif', 'image/bmp', 'image/tiff'
      ];
      const allImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'avif', 'bmp', 'tiff', 'tif'];
      
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      let isValidType = false;
      let errorMessage = '';
      
      if (photoNumber === 3) {
        // Third photo: strictly images only - no HEIC, HEIF, or other formats
        isValidType = strictImageTypes.includes(file.type) || 
                     strictImageExtensions.includes(fileExtension || '') ||
                     (file.type.startsWith('image/') && strictImageTypes.some(type => file.type === type));
        errorMessage = 'Photo 3 must be a standard image file (JPG, PNG, GIF, or WebP only).';
      } else {
        // Photos 1 & 2: allow all image formats including iOS HEIC/HEIF
        isValidType = allImageTypes.includes(file.type) || 
                     allImageExtensions.includes(fileExtension || '') ||
                     file.type.startsWith('image/');
        errorMessage = 'Please select a valid image file (JPG, PNG, GIF, WebP, HEIC, HEIF, or other image formats).';
      }
      
      if (!isValidType) {
        console.error('Invalid file type for photo', photoNumber, ':', file.type, 'filename:', file.name, 'extension:', fileExtension);
        alert(errorMessage);
        return;
      }

      console.log('File validation passed, reading file...');
      
      // Show loading state (you could add a loading indicator here)
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        console.log('Starting to read file for photo', photoNumber);
        // You could set loading state here if needed
      };
      
      reader.onload = (e) => {
        console.log('File read successfully for photo', photoNumber);
        const result = e.target?.result as string;
        
        // Additional validation for the loaded image
        if (result && result.length > 0) {
          updateFormData(`profilePhoto${photoNumber}`, result);
        } else {
          console.error('Empty or invalid image data');
          alert('Failed to load image. Please try a different photo.');
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading file. Please try again or choose a different image.');
      };
      
      reader.onabort = () => {
        console.log('File reading was aborted');
      };
      
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error starting file read:', error);
        alert('Error processing image. Please try again.');
      }
    } else {
      console.log('No file selected');
    }

    // Reset the input value to allow selecting the same file again if needed
    event.target.value = '';
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    updateFormData('countryCode', country.dialCode);
  };
  const PhotoUpload = ({ photoNumber, photo }: { photoNumber: 1 | 2 | 3; photo: string | null }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 text-center">
        Photo {photoNumber} {photoNumber <= 2 ? <span className="text-pink-500">*</span> : <span className="text-gray-500">(optional)</span>}
        {photoNumber === 3 && <div className="text-xs text-gray-500 mt-1">Standard formats only</div>}
      </label>
      <div className="relative">
        {photo ? (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto">
            <Image
              src={photo}
              alt={`Profile ${photoNumber}`}
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-2xl border-2 border-gray-700 shadow-lg"
            />
            <button
              onClick={() => updateFormData(`profilePhoto${photoNumber}`, null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
              aria-label={`Remove photo ${photoNumber}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto">
            <label 
              className="block w-full h-full border-2 border-dashed border-gray-600 rounded-2xl hover:border-pink-500 cursor-pointer transition-all group hover:bg-gray-800/50 active:scale-95 touch-manipulation"
              style={{ minHeight: '44px', minWidth: '44px' }} // iOS minimum touch target
            >
              <div className="flex flex-col items-center justify-center h-full p-2">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mb-1 group-hover:text-pink-500 transition-colors" />
                <span className="text-xs text-gray-500 text-center px-1 group-hover:text-pink-500 transition-colors leading-tight">
                  Add Photo
                </span>
              </div>
              <input
                type="file"
                accept={photoNumber === 3 
                  ? "image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                  : "image/*,image/heic,image/heif,image/jpeg,image/jpg,image/png,image/webp,image/avif"
                }
                capture={photoNumber === 3 ? undefined : "environment"}
                onChange={handlePhotoUpload(photoNumber)}
                className="hidden"
                id={`photo-upload-${photoNumber}`}
                multiple={false}
                aria-label={`Upload photo ${photoNumber}${photoNumber === 3 ? ' (standard image formats only)' : ''}`}
              />
            </label>
          </div>
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
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Upload Your Photos</h3>
            <p className="text-sm text-gray-400 mb-2">Add 2-3 photos to showcase yourself (minimum 2 required)</p>
            <p className="text-xs text-gray-500 mb-4">Note: Photo 3 accepts standard image formats only (JPG, PNG, GIF, WebP)</p>
          </div>
          
          {/* Mobile: 3 photos in a responsive grid layout */}
          <div className="lg:hidden w-full max-w-sm mx-auto">
            {/* First photo centered */}
            <div className="flex justify-center mb-4">
              <PhotoUpload photoNumber={1} photo={formData.profilePhoto1} />
            </div>
            {/* Second and third photos side by side */}
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              <PhotoUpload photoNumber={2} photo={formData.profilePhoto2} />
              <PhotoUpload photoNumber={3} photo={formData.profilePhoto3} />
            </div>
          </div>
          
          {/* Desktop: 3 photos in a column layout */}
          <div className="hidden lg:flex lg:flex-col gap-6 justify-center">
            <PhotoUpload photoNumber={1} photo={formData.profilePhoto1} />
            <PhotoUpload photoNumber={2} photo={formData.profilePhoto2} />
            <PhotoUpload photoNumber={3} photo={formData.profilePhoto3} />
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