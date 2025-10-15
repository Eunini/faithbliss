/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingData, FaithJourney, ChurchAttendance } from './types';
import SelectableCard from './SelectableCard';
import { CountryCodeSelect, defaultCountry } from '../CountryCodeSelect';
import { Country } from '../CountryCodeSelect';
import SelectWithOtherInput from './SelectWithOtherInput'; // Import the new component

interface ProfileBuilderSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const faithJourneyOptions = [
  { value: FaithJourney.ROOTED, label: 'Rooted', emoji: '🌳' },
  { value: FaithJourney.GROWING, label: 'Growing', emoji: '🌱' },
  { value: FaithJourney.EXPLORING, label: 'Exploring', emoji: '🧭' },
  { value: FaithJourney.PASSIONATE, label: 'Passionate', emoji: '🔥' },
];

const churchAttendanceOptions = [
  { value: ChurchAttendance.WEEKLY, label: 'Weekly', emoji: '🙌' },
  { value: ChurchAttendance.BIWEEKLY, label: 'Bi-weekly', emoji: '🙏' },
  { value: ChurchAttendance.MONTHLY, label: 'Monthly', emoji: '🗓️' },
  { value: ChurchAttendance.OCCASIONALLY, label: 'Occasionally', emoji: '⛪' },
];

const denominationOptions = [
  "BAPTIST", "METHODIST", "PRESBYTERIAN", "PENTECOSTAL", "CATHOLIC",
  "ORTHODOX", "ANGLICAN", "LUTHERAN", "ASSEMBLIES_OF_GOD",
  "SEVENTH_DAY_ADVENTIST", "OTHER"
];

const occupationOptions = [
  "Software Engineer", "Doctor", "Teacher", "Nurse", "Accountant",
  "Marketing Specialist", "Graphic Designer", "Project Manager",
  "Sales Representative", "Customer Service", "Student", "Unemployed", "Other"
];

const fieldOfStudyOptions = [
  "Computer Science", "Medicine", "Education", "Nursing",
  "Business Administration", "Marketing", "Graphic Design", "Engineering",
  "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
  "History", "English", "Art", "Other"
];

const personalityOptions = ["Adventurous", "Outgoing", "Creative", "Reserved", "Analytical", "Charismatic"];
const hobbiesOptions = ["Reading", "Hiking", "Photography", "Cooking", "Gaming", "Traveling", "Sports", "Music"];
const valuesOptions = ["Love", "Faith", "Hope", "Honesty", "Kindness", "Compassion", "Family", "Friendship"];
const spiritualGiftsOptions = ["Serving", "Teaching", "Encouragement", "Giving", "Leadership", "Mercy", "Wisdom", "Faith"];
const interestsOptions = ["Volunteering", "Travel", "Brunch", "Coffee", "Movies", "Concerts", "Art", "Tech"];

const ProfileBuilderSlide = ({ onboardingData, setOnboardingData, isVisible }: ProfileBuilderSlideProps) => {
  if (!isVisible) return null;

  const [selectedCountry, setSelectedCountry] = React.useState<Country>(defaultCountry);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectWithOtherChange = (name: string, value: string) => {
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardSelect = (name: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: 'personality' | 'hobbies' | 'values' | 'spiritualGifts' | 'interests', value: string) => {
    setOnboardingData(prev => {
      const list = prev[name] || [];
      const newList: string[] = list.includes(value)
        ? list.filter((item: string) => item !== value)
        : [...list, value];
      return { ...prev, [name]: newList };
    });
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setOnboardingData(prev => ({ ...prev, countryCode: country.dialCode }));
  };

  const handlePhoneChange = (phone: string) => {
    setOnboardingData(prev => ({ ...prev, phoneNumber: phone }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Let&apos;s build your profile! ✨</h2>
        <p className="text-gray-400">Help others get to know the real you.</p>
      </div>

      {/* Faith Journey */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">How would you describe your faith journey?</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {faithJourneyOptions.map(option => (
            <SelectableCard
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              isSelected={onboardingData.faithJourney === option.value}
              onClick={() => handleCardSelect('faithJourney', option.value)}
            />
          ))}
        </div>
      </div>

      {/* Church Attendance */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">How often do you attend church?</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {churchAttendanceOptions.map(option => (
            <SelectableCard
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              isSelected={onboardingData.churchAttendance === option.value}
              onClick={() => handleCardSelect('churchAttendance', option.value)}
            />
          ))}
        </div>
      </div>

      {/* Other Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white text-center">A little more about you...</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Denomination Dropdown */}
          <select name="denomination" value={onboardingData.denomination} onChange={handleChange} className="input-style">
            <option value="" disabled>Select your denomination</option>
            {denominationOptions.map(option => (
              <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>
            ))}
          </select>
          
          <SelectWithOtherInput
            label="Occupation"
            name="occupation"
            options={occupationOptions}
            selectedValue={onboardingData.occupation}
            onChange={handleSelectWithOtherChange}
            placeholder="Select your Occupation"
          />
          <input type="date" name="birthday" value={onboardingData.birthday} onChange={handleChange} placeholder="Birthday" className="input-style" />
          <input type="text" name="location" value={onboardingData.location} onChange={handleChange} placeholder="Your Location (e.g., City, State)" className="input-style" />
          <SelectWithOtherInput
            label="Field of Study"
            name="education"
            options={fieldOfStudyOptions}
            selectedValue={onboardingData.education}
            onChange={handleSelectWithOtherChange}
            placeholder="Select your Field of Study"
          />
          <input type="text" name="favoriteVerse" value={onboardingData.favoriteVerse} onChange={handleChange} placeholder="Favorite Bible Verse" className="input-style" />

        </div>
          <CountryCodeSelect
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            phoneNumber={onboardingData.phoneNumber}
            onPhoneChange={handlePhoneChange}
          />

        <textarea name="bio" value={onboardingData.bio} onChange={handleChange} placeholder="Write a short bio..." rows={4} className="input-style w-full"></textarea>
        
        {/* Personality */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Describe your personality</h3>
          <div className="flex flex-wrap gap-2">
            {personalityOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect('personality', option)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  onboardingData.personality?.includes(option)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Hobbies */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">What are your hobbies?</h3>
          <div className="flex flex-wrap gap-2">
            {hobbiesOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect('hobbies', option)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  onboardingData.hobbies?.includes(option)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>


        {/* Values */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">What are your values?</h3>
          <div className="flex flex-wrap gap-2">
            {valuesOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect('values', option)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  onboardingData.values?.includes(option)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Spiritual Gifts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">What are your spiritual gifts?</h3>
          <div className="flex flex-wrap gap-2">
            {spiritualGiftsOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect('spiritualGifts', option)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  onboardingData.spiritualGifts?.includes(option)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">What are your interests?</h3>
          <div className="flex flex-wrap gap-2">
            {interestsOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect('interests', option)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  onboardingData.interests?.includes(option)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add a new style block to globals.css or a styled component for this
// For now, I'll define the class in the component file for simplicity, but this should be moved.
const styles = `
  .input-style {
    background-color: #374151;
    border: 1px solid #4B5563;
    color: white;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-style:focus {
    outline: none;
    border-color: #EC4899;
    box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.5);
  }
  .input-style::placeholder {
    color: #9CA3AF;
  }
  /* Style for date input placeholder */
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
  input[type="date"] {
    color-scheme: dark;
  }
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}


export default ProfileBuilderSlide;