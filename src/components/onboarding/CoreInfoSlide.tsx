'use client';

import { motion } from 'framer-motion';
import { OnboardingData } from './types';

interface CoreInfoSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const CoreInfoSlide = ({ onboardingData, setOnboardingData, isVisible }: CoreInfoSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
        <h2 className="text-3xl font-bold text-white">Tell us about yourself</h2>
        <p className="text-gray-400">Let&apos;s start with the basics.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-300">
            Birthday
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={onboardingData.birthday}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
            Phone Number
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <select
              name="countryCode"
              id="countryCode"
              value={onboardingData.countryCode}
              onChange={handleChange}
              className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-white sm:text-sm"
            >
              {/* Add country codes here */}
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
            </select>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={onboardingData.phoneNumber}
              onChange={handleChange}
              className="flex-1 block w-full min-w-0 rounded-none rounded-r-md bg-gray-700 border-gray-600 text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300">
            Location
          </label>
          {/* Replace with a proper location autocomplete component */}
          <input
            type="text"
            id="location"
            name="location"
            value={onboardingData.location}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CoreInfoSlide;
