'use client';

import { motion } from 'framer-motion';
import { OnboardingData, FaithJourney, ChurchAttendance } from './types';
import SelectableCard from './SelectableCard';

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

const ProfileBuilderSlide = ({ onboardingData, setOnboardingData, isVisible }: ProfileBuilderSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <input type="text" name="denomination" value={onboardingData.denomination} onChange={handleChange} placeholder="Denomination (e.g., Baptist)" className="input-style" />
          <input type="text" name="occupation" value={onboardingData.occupation} onChange={handleChange} placeholder="Your Occupation" className="input-style" />
          <input type="date" name="birthday" value={onboardingData.birthday} onChange={handleChange} placeholder="Birthday" className="input-style" />
          <input type="text" name="location" value={onboardingData.location} onChange={handleChange} placeholder="Your Location (e.g., City, State)" className="input-style" />
        </div>
        <textarea name="bio" value={onboardingData.bio} onChange={handleChange} placeholder="Write a short bio..." rows={4} className="input-style w-full"></textarea>
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
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}


export default ProfileBuilderSlide;
