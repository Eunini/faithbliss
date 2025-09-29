# Google OAuth Setup Guide for FaithBliss

## 🔧 Firebase Console Setup

### 1. Enable Google Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `faithbliss-2c799` project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable the toggle switch
6. Set your project support email
7. Click **Save**

### 2. Configure OAuth Consent Screen (if not done)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your `faithbliss-2c799` project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Fill in the required information:
   - App name: `FaithBliss`
   - User support email: Your email
   - App logo: Upload FaithBliss logo (optional)
   - App domain: `https://faithbliss-2c799.firebaseapp.com`
   - Authorized domains: Add your domains
   - Developer contact information: Your email
5. Click **Save and Continue**

### 3. Add Authorized Domains
1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost` (for development)
   - `faithbliss-2c799.firebaseapp.com` (Firebase hosting)
   - Your custom domain (if any)

## 🌐 Web App Configuration

### 1. Current Configuration Status ✅
- Firebase SDK installed and configured
- Google OAuth provider enabled in code
- Authentication context implemented
- Login/Signup pages with Google buttons created
- Onboarding flow integrated
- Protected routes configured

### 2. Environment Variables (if needed)
Create `.env.local` file in root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDfp9hSAixfiNkT42ZXAblxpjQgLr_MSA8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=faithbliss-2c799.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=faithbliss-2c799
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=faithbliss-2c799.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=924057249769
NEXT_PUBLIC_FIREBASE_APP_ID=1:924057249769:web:524a3d5de6bc93d8b80d78
```

## 🚀 Testing the Authentication Flow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test User Journey
1. **New User Flow:**
   - Visit `/signup`
   - Click "Continue with Google"
   - Complete Google sign-in
   - Automatically redirected to `/onboarding`
   - Complete profile setup
   - Redirected to `/dashboard`

2. **Returning User Flow:**
   - Visit `/login`
   - Click "Continue with Google"
   - If onboarded: Go to `/dashboard`
   - If not onboarded: Go to `/onboarding`

### 3. Protected Routes Testing
- Try accessing `/dashboard` without authentication
- Should redirect to `/login`
- After authentication, should access protected pages

## 🔒 Security Considerations

### 1. Firestore Security Rules
Update Firestore rules to secure user data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. Firebase Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues:
1. **"Invalid OAuth client"** - Check authorized domains in Firebase
2. **"Auth domain not whitelisted"** - Add domain to authorized domains
3. **Redirect loops** - Check onboarding completion logic
4. **Firebase not initialized** - Verify configuration in `firebase.ts`

### Debug Steps:
1. Check browser console for errors
2. Verify Firebase project configuration
3. Test with different browsers/incognito mode
4. Check network tab for failed requests

## 📱 Mobile Testing
- Test on different screen sizes
- Verify touch interactions work
- Check responsive design on auth pages

## 🔄 Production Deployment
1. Update authorized domains with production URL
2. Set up proper environment variables
3. Configure Firebase hosting (optional)
4. Test authentication flow on production