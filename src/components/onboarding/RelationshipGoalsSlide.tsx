'use client';

import { motion } from 'framer-motion';
import { OnboardingData, RelationshipGoals } from './types';

interface RelationshipGoalsSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const RelationshipGoalsSlide = ({ onboardingData, setOnboardingData, isVisible }: RelationshipGoalsSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prev => ({ ...prev, [name]: value }));
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
        <h2 className="text-3xl font-bold text-white">Relationship Goals</h2>
        <p className="text-gray-400">What are you looking for?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="relationshipGoals" className="block text-sm font-medium text-gray-300">
            I'm looking for...
          </label>
          <select
            id="relationshipGoals"
            name="relationshipGoals"
            value={onboardingData.relationshipGoals}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(RelationshipGoals).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default RelationshipGoalsSlide;
