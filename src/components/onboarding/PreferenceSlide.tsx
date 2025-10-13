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
const genderOptions = ['Male', 'Female', 'Other'];

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
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">What You&apos;re Looking For</h2>
      <p className="text-gray-600">
        Help us understand your preferences for potential matches.
      </p>

      {/* Preferred Faith Journey */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Faith Journey
        </label>
        <div className="flex flex-wrap gap-2">
          {faithJourneyOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredFaithJourney', option.toUpperCase())}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredFaithJourney?.includes(option.toUpperCase())
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Church Involvement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Church Involvement
        </label>
        <div className="flex flex-wrap gap-2">
          {churchInvolvementOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredChurchAttendance', option.toUpperCase())}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredChurchAttendance?.includes(option.toUpperCase())
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Relationship Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Relationship Goals
        </label>
        <div className="flex flex-wrap gap-2">
          {relationshipGoalsOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredRelationshipGoals', option.replace('-', '_').toUpperCase())}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredRelationshipGoals?.includes(option.replace('-', '_').toUpperCase())
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Denominations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Denominations
        </label>
        <div className="flex flex-wrap gap-2">
          {['BAPTIST', 'METHODIST', 'PENTECOSTAL', 'CATHOLIC', 'OTHER'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelectChange('preferredDenominations', option)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredDenominations?.includes(option)
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Preferred Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am interested in
        </label>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, preferredGender: option.toUpperCase() }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredGender === option.toUpperCase()
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Age Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">
            Minimum Age
          </label>
          <input
            type="number"
            id="minAge"
            value={onboardingData.minAge || ''}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, minAge: parseInt(e.target.value, 10) }))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            placeholder="18"
          />
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">
            Maximum Age
          </label>
          <input
            type="number"
            id="maxAge"
            value={onboardingData.maxAge || ''}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, maxAge: parseInt(e.target.value, 10) }))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            placeholder="99"
          />
        </div>
      </div>

      {/* Preferred Distance */}
      <div>
        <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700">
          Maximum Distance (in kilometers)
        </label>
        <input
          type="range"
          id="maxDistance"
          min="1"
          max="500"
          value={onboardingData.maxDistance || 50}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, maxDistance: parseInt(e.target.value, 10) }))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center text-gray-600 mt-1">
          {onboardingData.maxDistance || 50} km
        </div>
      </div>
    </motion.div>
  );
};

export default PreferenceSlide;
