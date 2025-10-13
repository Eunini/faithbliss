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
const educationOptions = ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Other'];
const baptismStatusOptions = ['Baptized', 'Not Baptized', 'Planning to be Baptized'];
const spiritualGiftsOptions = ['Teaching', 'Encouragement', 'Leadership', 'Service', 'Giving', 'Mercy', 'Wisdom', 'Knowledge', 'Faith', 'Healing', 'Miracles', 'Prophecy', 'Discernment', 'Tongues', 'Interpretation'];
const interestsOptions = ['Reading', 'Sports', 'Music', 'Art', 'Cooking', 'Travel', 'Volunteering', 'Prayer Groups', 'Bible Study', 'Worship', 'Community Service', 'Fitness', 'Hiking', 'Photography', 'Writing'];
const lifestyleOptions = ['Active', 'Calm', 'Adventurous', 'Homebody', 'Social', 'Introverted', 'Traditional', 'Modern'];

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
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Tell Us About Yourself 💖</h2>
        <p className="text-gray-400">
          Let&apos;s get to know you a little better.
        </p>
      </div>

      {/* Faith Journey */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🌱 My Faith Journey is...
        </label>
        <div className="flex flex-wrap gap-3">
          {faithJourneyOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, faithJourney: option.toUpperCase() }))}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.faithJourney === option.toUpperCase()
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Church Involvement */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          ⛪ I Attend Church...
        </label>
        <div className="flex flex-wrap gap-3">
          {churchInvolvementOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, churchAttendance: option.toUpperCase() }))}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.churchAttendance === option.toUpperCase()
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Goals */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🎯 I&apos;m Looking For...
        </label>
        <div className="flex flex-wrap gap-3">
          {relationshipGoalsOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, relationshipGoals: option.replace('-', '_').toUpperCase() }))}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.relationshipGoals === option.replace('-', '_').toUpperCase()
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Birthday */}
      <div>
        <label htmlFor="birthday" className="block text-lg font-medium text-gray-300">
          🎂 My Birthday
        </label>
        <input
          type="date"
          id="birthday"
          value={onboardingData.birthday || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, birthday: e.target.value }))}
          className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-lg font-medium text-gray-300">
          📱 Phone Number
        </label>
        <div className="mt-2 flex rounded-lg shadow-sm">
          <select
            value={onboardingData.countryCode || '+1'}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, countryCode: e.target.value }))}
            className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-600 bg-gray-800 text-gray-300 text-md"
          >
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+234">+234 (NG)</option>
            <option value="+91">+91 (IN)</option>
            <option value="+86">+86 (CN)</option>
          </select>
          <input
            type="tel"
            id="phone"
            value={onboardingData.phoneNumber || ''}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className="block w-full flex-1 rounded-none rounded-r-lg border-gray-600 bg-gray-700 text-white focus:border-pink-500 focus:ring-pink-500 sm:text-md px-4 py-3"
            placeholder="555-123-4567"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-lg font-medium text-gray-300">
          📍 My Location
        </label>
        <input
          type="text"
          id="location"
          value={onboardingData.location || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, location: e.target.value }))}
          className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
          placeholder="e.g., Lagos, Nigeria"
        />
      </div>

      {/* Denomination */}
      <div>
        <label htmlFor="denomination" className="block text-lg font-medium text-gray-300">
          🕊️ My Denomination
        </label>
        <select
          id="denomination"
          value={onboardingData.denomination}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, denomination: e.target.value }))}
          className="mt-2 block w-full pl-4 pr-10 py-3 text-white bg-gray-700 border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md rounded-lg"
        >
          <option value="">Select denomination</option>
          {denominations.map((denom) => (
            <option key={denom} value={denom}>
              {denom.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Education */}
      <div>
        <label htmlFor="education" className="block text-lg font-medium text-gray-300">
          🎓 Education Level
        </label>
        <select
          id="education"
          value={onboardingData.education || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, education: e.target.value }))}
          className="mt-2 block w-full pl-4 pr-10 py-3 text-white bg-gray-700 border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md rounded-lg"
        >
          <option value="">Select education level</option>
          {educationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Baptism Status */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          💧 Baptism Status
        </label>
        <div className="flex flex-wrap gap-3">
          {baptismStatusOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, baptismStatus: option.toUpperCase().replace(' ', '_') }))}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.baptismStatus === option.toUpperCase().replace(' ', '_')
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Spiritual Gifts */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🎁 Spiritual Gifts <span className="text-gray-500">(Select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {spiritualGiftsOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                const currentGifts = onboardingData.spiritualGifts || [];
                const newGifts = currentGifts.includes(option)
                  ? currentGifts.filter(gift => gift !== option)
                  : [...currentGifts, option];
                setOnboardingData(prev => ({ ...prev, spiritualGifts: newGifts }));
              }}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.spiritualGifts?.includes(option)
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🎨 Interests <span className="text-gray-500">(Select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {interestsOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                const currentInterests = onboardingData.interests || [];
                const newInterests = currentInterests.includes(option)
                  ? currentInterests.filter(interest => interest !== option)
                  : [...currentInterests, option];
                setOnboardingData(prev => ({ ...prev, interests: newInterests }));
              }}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.interests?.includes(option)
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-3">
          🏃 Lifestyle
        </label>
        <div className="flex flex-wrap gap-3">
          {lifestyleOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOnboardingData(prev => ({ ...prev, lifestyle: option.toUpperCase() }))}
              className={`px-5 py-3 rounded-full text-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                onboardingData.lifestyle === option.toUpperCase()
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Occupation */}
      <div>
        <label htmlFor="occupation" className="block text-lg font-medium text-gray-300">
          💼 Occupation
        </label>
        <input
          type="text"
          id="occupation"
          value={onboardingData.occupation || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, occupation: e.target.value }))}
          className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
          placeholder="e.g., Software Engineer"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-lg font-medium text-gray-300">
          ✍️ Bio
        </label>
        <textarea
          id="bio"
          value={onboardingData.bio || ''}
          onChange={(e) => setOnboardingData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
          placeholder="Tell us a little about yourself and your faith..."
        />
      </div>
    </motion.div>
  );
};