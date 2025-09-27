# Location & Phone Number Setup Guide

## Features Added

### 🌍 OpenCage Geocoding Autocomplete
- **Auto-detection**: Automatically suggests locations as users type
- **African Focus**: Prioritizes cities in African countries for better local relevance  
- **Smart Suggestions**: Shows up to 5 relevant location predictions
- **Real-time Search**: Updates suggestions as you type (minimum 3 characters)
- **Free Forever**: 2,500 requests per day with no credit card required
- **Simple API**: Clean REST API, no complex JavaScript SDKs

### 📱 Country Code Dropdown
- **African Countries**: Comprehensive list of all African country codes
- **Search Function**: Type to quickly find any country
- **Flag Display**: Visual country flags for easy identification
- **Smart Layout**: Responsive design that works on mobile and desktop

## Setup Instructions

### 1. OpenCage Geocoding API Setup (Recommended - FREE!)

1. **Go to OpenCage Data**: https://opencagedata.com/api
2. **Sign Up for Free**:
   - Click "Sign Up" (no credit card required!)
   - Enter your email address
   - Verify your email
3. **Get Your API Key**:
   - Login to your dashboard
   - Copy your API key from the dashboard
4. **That's it!** - Much simpler than Google Maps

### 2. Environment Configuration

Update your `.env.local` file:

```env
NEXT_PUBLIC_OPENCAGE_API_KEY=your_actual_api_key_here
```

### 3. Test the Features

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Location Autocomplete**:
   - Go to the Location slide in onboarding
   - Type in any location field (minimum 3 characters)
   - You should see location suggestions appear

3. **Test Country Code Selector**:
   - Go to the Basic Info slide
   - Click on the country code dropdown
   - Search for countries by typing in the search box

## Components Overview

### `OpenCageAutocomplete.tsx`
- Handles OpenCage Geocoding API integration
- Provides real-time location suggestions with 300ms debouncing
- Focuses on African cities and locations (47+ country codes)
- Gracefully handles API failures and network issues
- Smart request cancellation to prevent race conditions
- Rate-limited to respect OpenCage's 1 request/second limit

### `CountryCodeSelect.tsx`
- Comprehensive African country code dropdown
- Built-in search functionality
- Flag display for visual identification
- Responsive design for mobile/desktop

## Troubleshooting

### Location Autocomplete Not Working
1. **Check API Key**: Verify `NEXT_PUBLIC_OPENCAGE_API_KEY` is set in `.env.local`
2. **Check API Key Format**: Ensure no extra spaces or characters
3. **Check Browser Console**: Look for network or API errors
4. **Check Daily Limits**: Verify you haven't exceeded 2,500 requests/day
5. **Check Internet**: OpenCage requires internet connection

### Country Dropdown Issues
- This component works offline and doesn't require any API keys
- If flags don't display, it's likely a font/emoji rendering issue

### Network Considerations
- OpenCage API requires internet connection
- Fallbacks are in place for offline usage
- Component gracefully degrades when API is unavailable
- 300ms debouncing prevents too many API calls

## Cost Considerations

OpenCage Geocoding API pricing (as of 2024):
- **FREE TIER**: 2,500 requests per day (forever!)
- **No Credit Card**: Required for free tier
- **Perfect for small apps**: Free tier covers most use cases
- **Paid plans**: Start at €50/month for 10,000 requests/day

### Why OpenCage vs Google Maps?
✅ **Simpler setup** - Just email signup, no complex console setup
✅ **No credit card** - Free tier doesn't require payment info
✅ **Better for Africa** - Excellent coverage of African locations
✅ **No SDKs** - Simple REST API calls
✅ **Transparent pricing** - Clear, predictable costs

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile Browsers**: Responsive design works on all mobile devices
- **Internet Explorer**: Not supported (uses modern JavaScript features)