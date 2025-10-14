'use client';

import { motion } from 'framer-motion';
import { OnboardingData, RelationshipGoals } from './types';
import SelectableCard from './SelectableCard';

interface RelationshipGoalsSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const goalsOptions = [
  { value: RelationshipGoals.MARRIAGE_MINDED, label: 'Marriage Minded', emoji: '💍' },
  { value: RelationshipGoals.RELATIONSHIP, label: 'Relationship', emoji: '❤️' },
  { value: RelationshipGoals.FRIENDSHIP, label: 'Friendship', emoji: '🤝' },
];

const RelationshipGoalsSlide = ({ onboardingData, setOnboardingData, isVisible }: RelationshipGoalsSlideProps) => {
  if (!isVisible) return null;

  const handleSelect = (value: string) => {
    setOnboardingData(prev => ({ ...prev, relationshipGoals: value }));
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
        <h2 className="text-3xl font-bold text-white">What are your intentions? 💖</h2>
        <p className="text-gray-400">It&apos;s great to be on the same page.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {goalsOptions.map(option => (
          <SelectableCard
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            isSelected={onboardingData.relationshipGoals === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RelationshipGoalsSlide;