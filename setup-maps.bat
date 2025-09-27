@echo off
echo 🌍 FaithBliss - OpenCage Geocoding API Setup Helper
echo =================================================
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    echo Please create .env.local manually with OpenCage configuration
)

REM Check current API key status
findstr /C:"your_opencage_api_key_here" .env.local >nul 2>&1
if %errorlevel%==0 (
    echo ⚠️  OpenCage API key not configured yet
    echo.
    echo 📋 SUPER EASY SETUP STEPS:
    echo.
    echo 1. 🌐 Go to OpenCage Data:
    echo    https://opencagedata.com/api
    echo.
    echo 2. � Sign up for FREE ^(no credit card required!^)
    echo    • Click 'Sign Up'
    echo    • Enter your email
    echo    • Verify your email
    echo.
    echo 3. 🔑 Get your API Key:
    echo    • Login to your dashboard
    echo    • Copy your API key
    echo.
    echo 4. 📝 Add the key to .env.local:
    echo    Replace 'your_opencage_api_key_here' with your actual API key
    echo.
    echo 5. 🔄 Restart your development server:
    echo    npm run dev
    echo.
    echo ✨ WHAT YOU GET FOR FREE:
    echo    ✅ 2,500 requests per day ^(forever free!^)
    echo    ✅ No credit card required
    echo    ✅ Worldwide location data
    echo    ✅ Perfect for African countries
    echo.
    echo 💡 NOTE: The app works perfectly without the API key!
    echo    Location fields will just be regular text inputs without autocomplete.
) else (
    echo ✅ OpenCage API key appears to be configured!
    echo.
    echo 🧪 TESTING:
    echo 1. Start your dev server: npm run dev
    echo 2. Go to the onboarding location page
    echo 3. Type in a location field ^(3+ characters^)
    echo 4. You should see location suggestions appear!
    echo.
    echo 🐛 TROUBLESHOOTING:
    echo • Check browser console for API errors
    echo • Verify you have internet connection
    echo • Check if you've exceeded daily limit ^(2,500 requests^)
    echo • Ensure API key is correct ^(no extra spaces^)
)

echo.
echo 📖 For detailed setup instructions, see: LOCATION_SETUP.md
echo.
pause