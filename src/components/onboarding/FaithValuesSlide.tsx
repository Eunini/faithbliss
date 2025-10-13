'use client';

import { motion } from 'framer-motion';
import { OnboardingData, FaithJourney, ChurchAttendance } from './types';

interface FaithValuesSlideProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isVisible: boolean;
}

const FaithValuesSlide = ({ onboardingData, setOnboardingData, isVisible }: FaithValuesSlideProps) => {
  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const value = Array.from(options).filter(option => option.selected).map(option => option.value);
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
        <h2 className="text-3xl font-bold text-white">Faith & Values</h2>
        <p className="text-gray-400">Share about your spiritual journey.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="faithJourney" className="block text-sm font-medium text-gray-300">
            My faith journey is...
          </label>
          <select
            id="faithJourney"
            name="faithJourney"
            value={onboardingData.faithJourney}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(FaithJourney).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="churchAttendance" className="block text-sm font-medium text-gray-300">
            I attend church...
          </label>
          <select
            id="churchAttendance"
            name="churchAttendance"
            value={onboardingData.churchAttendance}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {Object.values(ChurchAttendance).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="denomination" className="block text-sm font-medium text-gray-300">
            Denomination
          </label>
          <input
            type="text"
            id="denomination"
            name="denomination"
            value={onboardingData.denomination}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="baptismStatus" className="block text-sm font-medium text-gray-300">
            Baptism Status
          </label>
          <input
            type="text"
            id="baptismStatus"
            name="baptismStatus"
            value={onboardingData.baptismStatus}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="spiritualGifts" className="block text-sm font-medium text-gray-300">
            Spiritual Gifts (select multiple)
          </label>
          <select
            multiple
            id="spiritualGifts"
            name="spiritualGifts"
            value={onboardingData.spiritualGifts}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full h-32 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            {/* Add spiritual gifts options here */}
            <option>Teaching</option>
            <option>Service</option>
            <option>Mercy</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default FaithValuesSlide;
