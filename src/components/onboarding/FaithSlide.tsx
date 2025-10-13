/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/onboarding/FaithSlide.tsx
'use client';

import React from 'react';
import { OnboardingData } from './types';
import { motion } from 'framer-motion';

interface FaithSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const faithJourneyOptions = ['Growing', 'Rooted', 'Exploring', 'Passionate'];
const churchInvolvementOptions = ['Weekly', 'Biweekly', 'Monthly', 'Occasionally', 'Rarely'];
const relationshipGoalsOptions = ['Friendship', 'Dating', 'Marriage-minded'];
const denominations = [
  'BAPTIST', 'METHODIST', 'PRESBYTERIAN', 'PENTECOSTAL', 'CATHOLIC', 'ORTHODOX', 
  'ANGLICAN', 'LUTHERAN', 'ASSEMBLIES_OF_GOD', 'SEVENTH_DAY_ADVENTIST', 'OTHER'
];

export const FaithSlide: React.FC<FaithSlideProps> = ({
  onboardingData,
  setOnboardingData,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">About You</h2>
      <p className="text-gray-600">
        Tell us a bit about your faith and what you&apos;re looking for.
      </p>

      {/* Faith Journey */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          My Faith Journey is...
        </label>
        <div className="flex flex-wrap gap-2">
          {faithJourneyOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, faithJourney: option.toUpperCase() as any }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.faithJourney === option.toUpperCase()
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Church Involvement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I Attend Church...
        </label>
        <div className="flex flex-wrap gap-2">
          {churchInvolvementOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, churchAttendance: option.toUpperCase() as any }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.churchAttendance === option.toUpperCase()
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I&apos;m Looking For...
        </label>
        <div className="flex flex-wrap gap-2">
          {relationshipGoalsOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, relationshipGoals: option.replace('-', '_').toUpperCase() as any }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.relationshipGoals === option.replace('-', '_').toUpperCase()
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          My Age
        </label>
        <input
          type="number"
          id="age"
          value={onboardingData.age || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, age: parseInt(e.target.value, 10) }))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          placeholder="Enter your age"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          My Location
        </label>
        {/* TODO: Replace with a proper location autocomplete component */}
        <input
          type="text"
          id="location"
          value={onboardingData.location || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, location: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          placeholder="e.g., Lagos, Nigeria"
        />
      </div>

      {/* Denomination */}
      <div>
        <label htmlFor="denomination" className="block text-sm font-medium text-gray-700">
          My Denomination
        </label>
        <select
          id="denomination"
          value={onboardingData.denomination}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, denomination: e.target.value }))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
        >
          <option value="">Select denomination</option>
          {denominations.map((denom) => (
            <option key={denom} value={denom}>
              {denom.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};