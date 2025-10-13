/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpenCageAutocompleteProps {
  apiKey: string;
  value: string;
  onSelect: (address: string, lat: number, lng: number) => void;
}

const OpenCageAutocomplete = ({ apiKey, value, onSelect }: OpenCageAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (inputValue.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=${apiKey}&limit=5`
          );
          const data = await response.json();
          setSuggestions(data.results || []);
        } catch (error) {
          console.error('Error fetching location suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [inputValue, apiKey]);

  const handleSelect = (suggestion: any) => {
    const { formatted, geometry } = suggestion;
    setInputValue(formatted);
    setSuggestions([]);
    onSelect(formatted, geometry.lat, geometry.lng);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-md"
        placeholder="e.g., Lagos, Nigeria"
      />
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.annotations.geohash}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-700 text-white"
              >
                {suggestion.formatted}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpenCageAutocomplete;
