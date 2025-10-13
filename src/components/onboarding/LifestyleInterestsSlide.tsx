'use client';

import { motion } from 'framer-motion';
import { OnboardingData } from './types';

interface LifestyleInterestsSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const LifestyleInterestsSlide = ({ onboardingData, setOnboardingData, isVisible }: LifestyleInterestsSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const value = Array.from(options).filter(option => option.selected).map(option => option.value);
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Lifestyle & Interests</h2>
        <p className="text-gray-400">Help others get to know you.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-300">
            Education
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={onboardingData.education}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-300">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={onboardingData.occupation}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-300">
            Interests (select multiple)
          </label>
          <select
            multiple
            id="interests"
            name="interests"
            value={onboardingData.interests}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full h-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {/* Add interests options here */}
            <option>Reading</option>
            <option>Hiking</option>
            <option>Music</option>
          </select>
        </div>

        <div>
          <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-300">
            Lifestyle
          </label>
          <input
            type="text"
            id="lifestyle"
            name="lifestyle"
            value={onboardingData.lifestyle}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={onboardingData.bio}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          ></textarea>
        </div>
      </div>
    </motion.div>
  );
};

export default LifestyleInterestsSlide;
