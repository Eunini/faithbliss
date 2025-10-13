'use client';

import { motion } from 'framer-motion';
import { OnboardingData, FaithJourney, ChurchAttendance, RelationshipGoals, Gender } from './types';

interface MatchingPreferencesSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const MatchingPreferencesSlide = ({ onboardingData, setOnboardingData, isVisible }: MatchingPreferencesSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <h2 className="text-3xl font-bold text-white">Matching Preferences</h2>
        <p className="text-gray-400">Who are you looking for?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="preferredFaithJourney" className="block text-sm font-medium text-gray-300">
            Preferred Faith Journey (select multiple)
          </label>
          <select
            multiple
            id="preferredFaithJourney"
            name="preferredFaithJourney"
            value={onboardingData.preferredFaithJourney}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full h-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(FaithJourney).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferredChurchAttendance" className="block text-sm font-medium text-gray-300">
            Preferred Church Attendance (select multiple)
          </label>
          <select
            multiple
            id="preferredChurchAttendance"
            name="preferredChurchAttendance"
            value={onboardingData.preferredChurchAttendance}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full h-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(ChurchAttendance).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferredRelationshipGoals" className="block text-sm font-medium text-gray-300">
            Preferred Relationship Goals (select multiple)
          </label>
          <select
            multiple
            id="preferredRelationshipGoals"
            name="preferredRelationshipGoals"
            value={onboardingData.preferredRelationshipGoals}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full h-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(RelationshipGoals).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferredDenominations" className="block text-sm font-medium text-gray-300">
            Preferred Denominations (select multiple)
          </label>
          <select
            multiple
            id="preferredDenominations"
            name="preferredDenominations"
            value={onboardingData.preferredDenominations}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full h-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {/* Add denomination options here */}
            <option>Pentecostal</option>
            <option>Catholic</option>
            <option>Baptist</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredGender" className="block text-sm font-medium text-gray-300">
            I'm interested in...
          </label>
          <select
            id="preferredGender"
            name="preferredGender"
            value={onboardingData.preferredGender}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(Gender).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-300">
            Age Range
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="number"
              id="minAge"
              name="minAge"
              value={onboardingData.minAge}
              onChange={handleChange}
              className="w-20 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
            <span className="mx-2 text-gray-400">to</span>
            <input
              type="number"
              id="maxAge"
              name="maxAge"
              value={onboardingData.maxAge}
              onChange={handleChange}
              className="w-20 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-300">
            Maximum Distance (in miles)
          </label>
          <input
            type="range"
            id="maxDistance"
            name="maxDistance"
            min="1"
            max="100"
            value={onboardingData.maxDistance}
            onChange={handleChange}
            className="mt-1 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-center text-gray-400">{onboardingData.maxDistance} miles</div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchingPreferencesSlide;
