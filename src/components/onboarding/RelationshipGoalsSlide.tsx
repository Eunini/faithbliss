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
    const currentGoals = onboardingData.relationshipGoals || [];
    if (currentGoals.includes(value)) {
      setOnboardingData(prev => ({ ...prev, relationshipGoals: currentGoals.filter(goal => goal !== value) }));
    } else {
      setOnboardingData(prev => ({ ...prev, relationshipGoals: [...currentGoals, value] }));
    }
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

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          What are you looking for? <span className="text-red-400">*</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {goalsOptions.map(option => (
            <SelectableCard
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              isSelected={(onboardingData.relationshipGoals || []).includes(option.value)}
              onClick={() => handleSelect(option.value)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RelationshipGoalsSlide;