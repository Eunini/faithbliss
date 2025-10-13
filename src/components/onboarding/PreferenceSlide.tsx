// src/components/onboarding/PreferenceSlide.tsx
'use client';

import React from 'react';
import { OnboardingData } from './types';
import { motion } from 'framer-motion';

interface PreferenceSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const faithJourneyOptions = ['Growing', 'Rooted', 'Exploring', 'Passionate'];
const churchInvolvementOptions = ['Weekly', 'Biweekly', 'Monthly', 'Occasionally', 'Rarely'];
const relationshipGoalsOptions = ['Friendship', 'Dating', 'Marriage-minded'];
const genderOptions = ['Male', 'Female'];
const denominations = [
  'BAPTIST', 'METHODIST', 'PRESBYTERIAN', 'PENTECOSTAL', 'CATHOLIC', 'ORTHODOX', 
  'ANGLICAN', 'LUTHERAN', 'ASSEMBLIES_OF_GOD', 'SEVENTH_DAY_ADVENTIST', 'OTHER'
];

const PreferenceSlide: React.FC<PreferenceSlideProps> = ({
  onboardingData,
  setOnboardingData,
  isVisible,
}) => {
  const handleMultiSelectChange = (field: keyof OnboardingData, value: string) => {
    const currentValues = (onboardingData[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setOnboardingData((prev) => ({ ...prev, [field]: newValues }));
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
        <h2 className="text-3xl font-bold text-white">Your Preferences  preferences 🎯</h2>
        <p className="text-gray-400">
          Help us find the right match for you.
        </p>
      </div>

      {/* Preferred Faith Journey */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🌱 Preferred Faith Journey
        </label>
        <div className="flex flex-wrap gap-3">
          {faithJourneyOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredFaithJourney', option.toUpperCase())}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                onboardingData.preferredFaithJourney?.includes(option.toUpperCase())
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Church Involvement */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          ⛪ Preferred Church Involvement
        </label>
        <div className="flex flex-wrap gap-3">
          {churchInvolvementOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredChurchAttendance', option.toUpperCase())}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                onboardingData.preferredChurchAttendance?.includes(option.toUpperCase())
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Relationship Goals */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🎯 Preferred Relationship Goals
        </label>
        <div className="flex flex-wrap gap-3">
          {relationshipGoalsOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredRelationshipGoals', option.replace('-', '_').toUpperCase())}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                onboardingData.preferredRelationshipGoals?.includes(option.replace('-', '_').toUpperCase())
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Denominations */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🕊️ Preferred Denominations
        </label>
        <div className="flex flex-wrap gap-3">
          {denominations.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredDenominations', option)}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                onboardingData.preferredDenominations?.includes(option)
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Preferred Gender */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🧑‍🤝‍🧑 I am interested in
        </label>
        <div className="flex flex-wrap gap-3">
          {genderOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, preferredGender: option.toUpperCase() }))}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                onboardingData.preferredGender === option.toUpperCase()
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Age Range */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="minAge" className="block text-lg font-medium text-gray-300">
            Minimum Age
          </label>
          <input
            type="number"
            id="minAge"
            value={onboardingData.minAge || ''}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, minAge: parseInt(e.target.value, 10) }))}
            className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
            placeholder="18"
          />
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-lg font-medium text-gray-300">
            Maximum Age
          </label>
          <input
            type="number"
            id="maxAge"
            value={onboardingData.maxAge || ''}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, maxAge: parseInt(e.target.value, 10) }))}
            className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
            placeholder="99"
          />
        </div>
      </div>

      {/* Preferred Distance */}
      <div>
        <label htmlFor="maxDistance" className="block text-lg font-medium text-gray-300">
          📍 Maximum Distance (in kilometers)
        </label>
        <input
          type="range"
          id="maxDistance"
          min="1"
          max="500"
          value={onboardingData.maxDistance || 50}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, maxDistance: parseInt(e.target.value, 10) }))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-3 accent-pink-500"
        />
        <div className="text-center text-gray-400 mt-2 text-lg">
          {onboardingData.maxDistance || 50} km
        </div>
      </div>
    </motion.div>
  );
};

export default PreferenceSlide;