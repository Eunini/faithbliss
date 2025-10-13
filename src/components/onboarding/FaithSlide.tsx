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
              onClick={() => setOnboardingData(prev => ({ ...prev, faithJourney: option.toUpperCase() }))}
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
              onClick={() => setOnboardingData(prev => ({ ...prev, churchAttendance: option.toUpperCase() }))}
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
              onClick={() => setOnboardingData(prev => ({ ...prev, relationshipGoals: option.replace('-', '_').toUpperCase() }))}
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

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <select
            value={onboardingData.countryCode || '+1'}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, countryCode: e.target.value }))}
            className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
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
            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-pink-500 focus:ring-pink-500 sm:text-sm px-3 py-2"
            placeholder="555-123-4567"
          />
        </div>
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

            {/* Education */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                Education Level
              </label>
              <select
                id="education"
                value={onboardingData.education || ''}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, education: e.target.value }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baptism Status
              </label>
              <div className="flex flex-wrap gap-2">
                {baptismStatusOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setOnboardingData(prev => ({ ...prev, baptismStatus: option.toUpperCase().replace(' ', '_') }))}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      onboardingData.baptismStatus === option.toUpperCase().replace(' ', '_')
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Spiritual Gifts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spiritual Gifts <span className="text-gray-500">(Select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
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
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      onboardingData.spiritualGifts?.includes(option)
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests <span className="text-gray-500">(Select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
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
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      onboardingData.interests?.includes(option)
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle
              </label>
              <div className="flex flex-wrap gap-2">
                {lifestyleOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setOnboardingData(prev => ({ ...prev, lifestyle: option.toUpperCase() }))}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      onboardingData.lifestyle === option.toUpperCase()
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation (Optional) */}

            <div>

              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">

                Occupation <span className="text-gray-500">(Optional)</span>

              </label>

              <input

                type="text"

                id="occupation"

                value={onboardingData.occupation || ''}

                onChange={(e) => setOnboardingData(prev => ({ ...prev, occupation: e.target.value }))}

                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"

                placeholder="e.g., Software Engineer"

              />

            </div>

      

            {/* Bio (Optional) */}

      

                  <div>

      

                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">

      

                      Bio <span className="text-gray-500">(Optional)</span>

      

                    </label>

      

                    <textarea

      

                      id="bio"

      

                      value={onboardingData.bio || ''}

      

                      onChange={(e) => setOnboardingData(prev => ({ ...prev, bio: e.target.value }))}

      

                      rows={4}

      

                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"

      

                      placeholder="Tell us a little about yourself and your faith..."

      

                    />

      

                  </div>

      

            

      

                  {/* Education */}

      

                  <div>

      

                    <label htmlFor="education" className="block text-sm font-medium text-gray-700">

      

                      Education

      

                    </label>

      

                    <select

      

                      id="education"

      

                      value={onboardingData.education || ''}

      

                      onChange={(e) => setOnboardingData(prev => ({ ...prev, education: e.target.value }))}

      

                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"

      

                    >

      

                      <option value="">Select education level</option>

      

                      <option value="HIGH_SCHOOL">High School</option>

      

                      <option value="BACHELORS">Bachelors</option>

      

                      <option value="MASTERS">Masters</option>

      

                      <option value="PHD">PhD</option>

      

                    </select>

      

                  </div>

      

            

      

                  {/* Baptism Status */}

      

                  <div>

      

                    <label className="block text-sm font-medium text-gray-700 mb-2">

      

                      Baptism Status

      

                    </label>

      

                    <div className="flex flex-wrap gap-2">

      

                      {['YES', 'NO', 'PLANNING_TO'].map((option) => (

      

                        <button

      

                          key={option}

      

                          type="button"

      

                          onClick={() => setOnboardingData(prev => ({ ...prev, baptismStatus: option }))}

      

                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${

      

                            onboardingData.baptismStatus === option

      

                              ? 'bg-pink-500 text-white'

      

                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'

      

                          }`}

      

                        >

      

                          {option.replace('_', ' ')}

      

                        </button>

      

                      ))}

      

                    </div>

      

                  </div>

      

            

      

                  {/* Spiritual Gifts */}

      

                  <div>

      

                    <label htmlFor="spiritualGifts" className="block text-sm font-medium text-gray-700">

      

                      Spiritual Gifts <span className="text-gray-500">(Optional, comma-separated)</span>

      

                    </label>

      

                    <input

      

                      type="text"

      

                      id="spiritualGifts"

      

                      value={onboardingData.spiritualGifts?.join(', ') || ''}

      

                      onChange={(e) => setOnboardingData(prev => ({ ...prev, spiritualGifts: e.target.value.split(',').map(s => s.trim()) }))}

      

                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"

      

                      placeholder="e.g., Teaching, Service, Mercy"

      

                    />

      

                  </div>

      

            

      

                  {/* Interests */}

      

                  <div>

      

                    <label htmlFor="interests" className="block text-sm font-medium text-gray-700">

      

                      Interests <span className="text-gray-500">(Optional, comma-separated)</span>

      

                    </label>

      

                    <input

      

                      type="text"

      

                      id="interests"

      

                      value={onboardingData.interests?.join(', ') || ''}

      

                      onChange={(e) => setOnboardingData(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()) }))}

      

                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"

      

                      placeholder="e.g., Reading, Hiking, Music"

      

                    />

      

                  </div>

      

            

      

                  {/* Lifestyle */}

      

                  <div>

      

                    <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700">

      

                      Lifestyle <span className="text-gray-500">(Optional)</span>

      

                    </label>

      

                    <input

      

                      type="text"

      

                      id="lifestyle"

      

                      value={onboardingData.lifestyle || ''}

      

                      onChange={(e) => setOnboardingData(prev => ({ ...prev, lifestyle: e.target.value }))}

      

                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"

      

                      placeholder="e.g., Active, Homebody, etc."

      

                    />

      

                  </div>

      

                </motion.div>

      

              );

      

            };

      

            

      