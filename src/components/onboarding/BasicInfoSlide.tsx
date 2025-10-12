import { useSession } from 'next-auth/react';
import { User, Camera, X, Upload } from 'lucide-react';
import { FormData } from './types';
import { CountryCodeSelect, defaultCountry, type Country } from '../CountryCodeSelect';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CloudinaryService } from '@/lib/cloudinary';
import { useToast } from '@/contexts/ToastContext';

interface BasicInfoSlideProps {
  formData: FormData;
  updateFormData: (field: string, value: string | boolean | null) => void;
}

export const BasicInfoSlide = ({ formData, updateFormData }: BasicInfoSlideProps) => {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [uploadingPhotos, setUploadingPhotos] = useState<{[key: number]: boolean}>({});
  const { data: session } = useSession(); // <-- Use the standard useSession hook
  const { showSuccess, showError } = useToast();

  // Initialize country code if not set
  useEffect(() => {
    if (!formData.countryCode) {
      updateFormData('countryCode', defaultCountry.dialCode);
    }
  }, [formData.countryCode, updateFormData]);

  const handlePhotoUpload = (photoNumber: 1 | 2 | 3) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 Photo upload triggered for photo', photoNumber);
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log('❌ No file selected');
      return;
    }
    
    if (!session?.userId) {
      showError('You must be signed in to upload photos.', 'Authentication Error');
      return;
    }
    
    console.log('✅ File selected:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Check file size (max 15MB for iOS HEIC compatibility)
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      showError('File size too large. Please choose an image smaller than 15MB.', 'File Too Large');
      return;
    }

    // Validate file type - only allow standard picture formats for all photos
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    // Check if file type and extension are both valid picture formats
    const isValidType = allowedImageTypes.includes(file.type) || 
                       allowedImageExtensions.includes(fileExtension || '');
    
    if (!isValidType) {
      console.error('❌ Invalid file type for photo', photoNumber, ':', file.type, 'filename:', file.name, 'extension:', fileExtension);
      showError('Please select a standard picture file (JPG, PNG, GIF, or WebP only).', 'Invalid File Type');
      return;
    }

    console.log('✅ File validation passed, uploading to Cloudinary...');
    
    try {
      // Set uploading state
      setUploadingPhotos(prev => ({ ...prev, [photoNumber]: true }));
      console.log(`⏳ Upload started for photo ${photoNumber}...`);
      
      // Upload to Cloudinary
      const result = await CloudinaryService.uploadImage(
        file,
        'faithbliss/profile-photos',
        session.userId, 
        photoNumber
      );

      console.log('✅ Cloudinary upload successful:', {
        url: result.secure_url,
        publicId: result.public_id,
        dimensions: `${result.width}x${result.height}`,
        format: result.format
      });

      // Update form data with Cloudinary URL
      updateFormData(`profilePhoto${photoNumber}`, result.secure_url);
      
      // Show success feedback
      console.log(`🎉 Photo ${photoNumber} uploaded successfully to Cloudinary`);
      showSuccess(`Photo ${photoNumber} uploaded successfully!`, 'Upload Complete');
      
    } catch (error) {
      console.error(`❌ Cloudinary upload error for photo ${photoNumber}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to upload photo ${photoNumber}: ${errorMessage}`, 'Upload Failed');
    } finally {
      // Clear uploading state
      setUploadingPhotos(prev => ({ ...prev, [photoNumber]: false }));
      console.log(`✔️ Upload state cleared for photo ${photoNumber}`);
    }

    // Reset the input value to allow selecting the same file again if needed
    event.target.value = '';
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    updateFormData('countryCode', country.dialCode);
  };
  const PhotoUpload = ({ photoNumber, photo }: { photoNumber: 1 | 2 | 3; photo: string | null }) => {
    const isUploading = uploadingPhotos[photoNumber];
    
    const handleClick = () => {
      if (!isUploading) {
        console.log(`Clicked on photo ${photoNumber} upload area`);
        console.log(`User ID:`, session?.userId);
        console.log(`User authenticated:`, !!session);
        
        console.log(`📂 Triggering file picker for photo ${photoNumber}`);
        
        // Create a new input to ensure clean state
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
        
        console.log(`✨ Created new file input for photo ${photoNumber}`);
        
        // Attach the handler directly
        newInput.onchange = async (e) => {
          const target = e.target as HTMLInputElement;
          console.log('🎯 onChange fired!');
          console.log('📸 File input changed, files:', target.files?.length);
          console.log('📁 File details:', target.files?.[0] ? {
            name: target.files[0].name,
            size: target.files[0].size,
            type: target.files[0].type
          } : 'No file');
          
          if (target.files && target.files[0]) {
            const syntheticEvent = { target } as React.ChangeEvent<HTMLInputElement>;
            await handlePhotoUpload(photoNumber)(syntheticEvent);
          } else {
            console.warn('⚠️ onChange fired but no file found');
          }
        };
        
        // Add error handler
        newInput.onerror = (e) => {
          console.error('❌ File input error:', e);
        };
        
        // Log before click
        console.log('🎬 About to trigger click on file input...');
        
        // Trigger the click
        newInput.click();
        
        console.log('✅ Click triggered on file input');
      } else {
        console.warn(`⏳ Photo ${photoNumber} is already uploading, ignoring click`);
      }
    };
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 text-center">
          Photo {photoNumber} {photoNumber <= 2 ? <span className="text-pink-500">*</span> : <span className="text-gray-500">(optional)</span>}
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
                onError={() => {
                  console.error(`Failed to load photo ${photoNumber}:`, photo);
                  // Fallback or retry logic could go here
                }}
              />
              <button
                onClick={() => updateFormData(`profilePhoto${photoNumber}`, null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                aria-label={`Remove photo ${photoNumber}`}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </button>
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white animate-pulse" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto">
              <button
                type="button"
                onClick={handleClick}
                disabled={isUploading}
                className={`w-full h-full border-2 border-dashed border-gray-600 rounded-2xl hover:border-pink-500 cursor-pointer transition-all group hover:bg-gray-800/50 active:scale-95 touch-manipulation ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                style={{ minHeight: '44px', minWidth: '44px' }} // iOS minimum touch target
                aria-label={`Upload photo ${photoNumber}`}
              >
                <div className="flex flex-col items-center justify-center h-full p-2">
                  {isUploading ? (
                    <>
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 mb-1 animate-pulse" />
                      <span className="text-xs text-pink-500 text-center px-1 leading-tight">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mb-1 group-hover:text-pink-500 transition-colors" />
                      <span className="text-xs text-gray-500 text-center px-1 group-hover:text-pink-500 transition-colors leading-tight">
                        Add Photo
                      </span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

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