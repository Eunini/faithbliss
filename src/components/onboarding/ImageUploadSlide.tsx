'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, X } from 'lucide-react';
import { OnboardingData } from './types';

interface ImageUploadSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const ImageUploadSlide = ({ onboardingData, setOnboardingData, isVisible }: ImageUploadSlideProps) => {
  const [uploading, setUploading] = useState(false);
  // Store File objects instead of URLs
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Create object URLs for previews
    const newPreviews = photos.map(file => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);

    // Cleanup object URLs on component unmount or when photos change
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      const newFiles = Array.from(files);
      const combinedPhotos = [...photos, ...newFiles].slice(0, 6); // Limit to 6 photos
      setPhotos(combinedPhotos);
      setOnboardingData(prev => ({ ...prev, photos: combinedPhotos }));
      setUploading(false);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const newPhotos = photos.filter((_, index) => index !== indexToRemove);
    setPhotos(newPhotos);
    setOnboardingData(prev => ({ ...prev, photos: newPhotos }));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Upload Your Photos 📸</h2>
        <p className="text-gray-400">
          Add at least 2 photos to complete your profile. The first two are required.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photoPreviews.map((previewUrl, index) => (
          <div key={index} className="relative group">
            <img src={previewUrl} alt={`photo-${index}`} className="w-full h-40 object-cover rounded-lg" />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {photos.length < 6 && (
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg h-40 flex items-center justify-center">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || photos.length >= 6}
            />
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <div className="text-center text-gray-400">
                <UploadCloud size={32} className="mx-auto" />
                <p>Upload</p>
              </div>
            )}
          </div>
        )}
      </div>
       {onboardingData.photos.length < 2 && (
        <p className="text-red-500 text-center">
          You must upload at least 2 photos.
        </p>
      )}
    </motion.div>
  );
};

export default ImageUploadSlide;