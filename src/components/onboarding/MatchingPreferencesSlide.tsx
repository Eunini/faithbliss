'use client';

import { motion } from 'framer-motion';
import { OnboardingData, Gender } from './types';
import SelectableCard from './SelectableCard';

interface MatchingPreferencesSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const genderOptions = [
  { value: Gender.MAN, label: 'Men', emoji: '👨' },
  { value: Gender.WOMAN, label: 'Women', emoji: '👩' },
  { value: Gender.OTHER, label: 'Everyone', emoji: '🧑‍🤝‍🧑' },
];

const MatchingPreferencesSlide = ({ onboardingData, setOnboardingData, isVisible }: MatchingPreferencesSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardSelect = (name: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({ ...prev, [name]: value }));
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
        <h2 className="text-3xl font-bold text-white">Who are you looking for? 🤔</h2>
        <p className="text-gray-400">Set your preferences to find the right match.</p>
      </div>

      {/* Preferred Gender */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">I&apos;m interested in...</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {genderOptions.map(option => (
            <SelectableCard
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              isSelected={onboardingData.preferredGender === option.value}
              onClick={() => handleCardSelect('preferredGender', option.value)}
            />
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Age Range</h3>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="number"
            name="minAge"
            value={onboardingData.minAge}
            onChange={handleChange}
            className="input-style w-24 text-center"
            min="18"
            max="99"
          />
          <span className="text-gray-400 text-lg">to</span>
          <input
            type="number"
            name="maxAge"
            value={onboardingData.maxAge}
            onChange={handleChange}
            className="input-style w-24 text-center"
            min="18"
            max="99"
          />
        </div>
      </div>

      {/* Max Distance */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Maximum Distance</h3>
        <div className="relative">
          <input
            type="range"
            id="maxDistance"
            name="maxDistance"
            min="1"
            max="100"
            value={onboardingData.maxDistance}
            onChange={handleChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-center text-lg font-semibold text-pink-400 mt-2">
            {onboardingData.maxDistance} miles
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Basic styles for inputs - should be moved to a global stylesheet
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
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default MatchingPreferencesSlide;