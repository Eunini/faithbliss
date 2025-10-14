'use client';

import { motion } from 'framer-motion';
import { OnboardingData } from './types';
import {
  FaithJourney,
  ChurchAttendance,
  RelationshipGoals,
} from './types';

interface PartnerPreferencesSlideProps {
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
  { value: ChurchAttendance.RARELY, label: 'Rarely', emoji: '🤔' },
];

const relationshipGoalsOptions = [
  { value: RelationshipGoals.MARRIAGE_MINDED, label: 'Marriage Minded', emoji: '💍' },
  { value: RelationshipGoals.RELATIONSHIP, label: 'Relationship', emoji: '❤️' },
  { value: RelationshipGoals.FRIENDSHIP, label: 'Friendship', emoji: '🤝' },
];

const denominationOptions = [
  "BAPTIST", "METHODIST", "PRESBYTERIAN", "PENTECOSTAL", "CATHOLIC",
  "ORTHODOX", "ANGLICAN", "LUTHERAN", "ASSEMBLIES_OF_GOD",
  "SEVENTH_DAY_ADVENTIST", "OTHER"
];

const PartnerPreferencesSlide = ({ onboardingData, setOnboardingData, isVisible }: PartnerPreferencesSlideProps) => {
  if (!isVisible) return null;

  const handleMultiSelect = (
    name: 'preferredFaithJourney' | 'preferredChurchAttendance' | 'preferredRelationshipGoals' | 'preferredDenominations',
    value: string
  ) => {
    setOnboardingData(prev => {
      const list = prev[name] || [];
      const newList: string[] = list.includes(value)
        ? list.filter((item: string) => item !== value)
        : [...list, value];
      return { ...prev, [name]: newList };
    });
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
        <h2 className="text-3xl font-bold text-white">What are you looking for? 🧐</h2>
        <p className="text-gray-400">Describe what you'd like to see in a partner.</p>
      </div>

      {/* Preferred Faith Journey */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Their ideal faith journey?</h3>
        <div className="flex flex-wrap gap-2">
          {faithJourneyOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleMultiSelect('preferredFaithJourney', option.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredFaithJourney?.includes(option.value)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Church Attendance */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">How often should they attend church?</h3>
        <div className="flex flex-wrap gap-2">
          {churchAttendanceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleMultiSelect('preferredChurchAttendance', option.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredChurchAttendance?.includes(option.value)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Relationship Goals */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">What kind of relationship are they seeking?</h3>
        <div className="flex flex-wrap gap-2">
          {relationshipGoalsOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleMultiSelect('preferredRelationshipGoals', option.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredRelationshipGoals?.includes(option.value)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Denominations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Any denomination preferences?</h3>
        <div className="flex flex-wrap gap-2">
          {denominationOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => handleMultiSelect('preferredDenominations', option)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                onboardingData.preferredDenominations?.includes(option)
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PartnerPreferencesSlide;
