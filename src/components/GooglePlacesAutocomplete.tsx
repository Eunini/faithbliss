import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GooglePlacesPrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string, placeDetails?: GooglePlacesPrediction) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}

interface GoogleMapsAPI {
  maps: {
    places: {
      AutocompleteService: new () => GoogleAutocompleteService;
      PlacesServiceStatus: {
        OK: string;
      };
    };
  };
}

interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: {
      input: string;
      types: string[];
      componentRestrictions: { country: string[] };
    },
    callback: (predictions: GooglePlacesPrediction[], status: string) => void
  ) => void;
}

declare global {
  interface Window {
    google: GoogleMapsAPI;
    initGooglePlaces: () => void;
  }
}

export const GooglePlacesAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  icon = <MapPin className="w-5 h-5 text-gray-500" />,
  required = false,
  className = ""
}: GooglePlacesAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleAutocompleteService | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<GooglePlacesPrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // Initialize Google Places API
  useEffect(() => {
    const initializeGooglePlaces = () => {
      // Check if API key is available
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
        console.warn('Google Maps API key not configured. Using basic text input.');
        return;
      }

      // Check if Google Places API is already loaded
      if (window.google?.maps?.places) {
        setIsLoaded(true);
        return;
      }

      // Load Google Places API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API. Please check your API key and network connection.');
      };
      
      window.initGooglePlaces = () => {
        setIsLoaded(true);
      };
      
      script.onload = () => {
        window.initGooglePlaces();
      };
      
      document.head.appendChild(script);
    };

    initializeGooglePlaces();
  }, []);

  // Initialize autocomplete when Google Places API is loaded
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Create autocomplete service for predictions
      const service = new window.google.maps.places.AutocompleteService();
      autocompleteRef.current = service;
    }
  }, [isLoaded]);

  // Get place predictions
  const getPlacePredictions = (input: string) => {
    if (!autocompleteRef.current || !input.trim() || !isLoaded) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoadingPlaces(true);
    
    const request = {
      input,
      types: ['(cities)'], // Focus on cities
      componentRestrictions: { country: ['ng', 'za', 'ke', 'gh', 'et', 'eg', 'ma', 'ug', 'dz', 'tz'] } // African countries
    };

    autocompleteRef.current.getPlacePredictions(
      request,
      (predictions: GooglePlacesPrediction[], status: string) => {
        setIsLoadingPlaces(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions.slice(0, 5)); // Limit to 5 predictions
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Only try to get predictions if Google Places API is loaded
    if (isLoaded && newValue.length > 2) {
      getPlacePredictions(newValue);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction: GooglePlacesPrediction) => {
    onChange(prediction.description, prediction);
    setPredictions([]);
    setShowPredictions(false);
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding predictions to allow for clicks
    setTimeout(() => {
      setShowPredictions(false);
    }, 150);
  };

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
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => value.length > 2 && predictions.length > 0 && setShowPredictions(true)}
          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-500 transition-all text-sm md:text-base"
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoadingPlaces && (
          <div className="absolute right-4 top-4">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Predictions Dropdown */}
      {isLoaded && showPredictions && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id || index}
              type="button"
              onClick={() => handlePredictionSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 focus:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {prediction.structured_formatting?.secondary_text || ''}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Status messages */}
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
       process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here' ? (
        <div className="text-xs text-blue-400 mt-1 flex items-center space-x-1">
          <span>💡</span>
          <span>Basic text input mode. Add Google Maps API key for location autocomplete.</span>
        </div>
      ) : !isLoaded ? (
        <div className="text-xs text-gray-500 mt-1">
          Loading location services...
        </div>
      ) : null}
    </div>
  );
};