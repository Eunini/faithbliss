import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';

interface OpenCageResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

interface OpenCageAutocompleteProps {
  value: string;
  onChange: (value: string, details?: OpenCageResult) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const OpenCageAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  icon = <MapPin className="w-5 h-5 text-gray-500" />,
  required = false,
  className = ""
}: OpenCageAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<OpenCageResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if API key is configured
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    setHasApiKey(!!apiKey && apiKey !== 'your_opencage_api_key_here');
  }, []);

  // Fetch location suggestions from OpenCage
  const fetchSuggestions = async (query: string) => {
    if (!hasApiKey || !query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      
      // OpenCage Geocoding API
      const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=5&countrycode=ng,za,ke,gh,et,eg,ma,ug,dz,tz,cm,ci,ao,mg,bf,ml,mw,ne,zm,sn,td,so,zw,gn,rw,bj,bi,tn,tg,sl,ly,lr,mr,ls,gm,gw,ga,bw,na,mu,sz,km,cv,dj,gq,er,st,sc&no_annotations=1&min_confidence=3`;

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setSuggestions(data.results);
        setShowSuggestions(data.results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('OpenCage API error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = (query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms delay to avoid too many API calls
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (hasApiKey && newValue.length > 2) {
      debouncedSearch(newValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: OpenCageResult) => {
    onChange(suggestion.formatted, suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  // Handle input focus
  const handleFocus = () => {
    if (hasApiKey && value.length > 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-pink-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-4 pointer-events-none">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-4 top-4">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {hasApiKey && showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 focus:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {suggestion.components.city || suggestion.components.state || 'Unknown City'}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {suggestion.formatted}
                  </div>
                </div>
                {suggestion.components.country_code && (
                  <div className="text-gray-500 text-xs uppercase font-medium">
                    {suggestion.components.country_code}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Status messages */}
      {!hasApiKey && (
        <div className="text-xs text-blue-400 mt-1 flex items-center space-x-1">
          <span>💡</span>
          <span>Basic text input mode. Add OpenCage API key for location autocomplete.</span>
        </div>
      )}
    </div>
  );
};