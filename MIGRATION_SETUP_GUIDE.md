# FaithBliss Authentication & Image Upload Migration Guide

This guide covers migrating from Firebase to Google OAuth (NextAuth) and implementing Cloudinary for image uploads.

## 🔧 Google OAuth Setup with NextAuth

### 1. Create Google Cloud Project (if needed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "FaithBliss"
4. Click "Create"

### 2. Enable Required APIs

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search and enable:
   - **Google+ API** (for user profile access)
   - **Google Identity Toolkit API** (for authentication)

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in application information:
   - **App name**: FaithBliss
   - **User support email**: Your email
   - **Developer contact info**: Your email
4. Add scopes (if prompted):
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (your email addresses)
6. Save and continue

### 4. Create OAuth 2.0 Client

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure:
   - **Name**: FaithBliss Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     https://yourdomain.com/api/auth/callback/google
     ```
5. Save and copy the **Client ID** and **Client Secret**

## ☁️ Cloudinary Setup

### 1. Create Cloudinary Account

1. Visit [Cloudinary](https://cloudinary.com/users/register/free)
2. Sign up for free account
3. Verify your email

### 2. Get Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Copy from the dashboard:
   - **Cloud Name** (displayed prominently)
   - **API Key** (click "API Keys" if not visible)
   - **API Secret** (in API Keys section)

### 3. Configure Upload Settings (Optional)

1. Go to Settings → Upload
2. Enable auto-optimization
3. Set up image transformations if needed

## 📝 Environment Configuration

Update your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-secure-32-character-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Generate NextAuth Secret

Use one of these methods:

```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online
# Visit: https://generate-secret.vercel.app/32
```

## 🚀 Installation & Testing

### 1. Install Dependencies

```bash
npm install next-auth cloudinary uuid @types/uuid
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Authentication

1. Navigate to `http://localhost:3000/login`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Should redirect to onboarding page

### 4. Test Image Upload

1. Go through onboarding process
2. Upload profile photos
3. Verify images appear in Cloudinary dashboard
4. Check that optimized URLs are generated

## 🔄 Migration Checklist

- [ ] Google Cloud project created/configured
- [ ] OAuth consent screen configured  
- [ ] OAuth client credentials generated
- [ ] Cloudinary account created
- [ ] Environment variables updated
- [ ] Dependencies installed
- [ ] Authentication flow tested
- [ ] Image upload tested
- [ ] Backend integration tested

## 🐛 Common Issues

### Google OAuth Issues

**"redirect_uri_mismatch"**
- Ensure redirect URIs match exactly in Google Cloud Console
- Include the full path: `/api/auth/callback/google`

**"invalid_client"**  
- Double-check Client ID and Secret
- Remove any extra spaces in environment variables

**"access_blocked"**
- Add your email as test user in OAuth consent screen
- Ensure app is configured for external users

### Cloudinary Issues

**Upload fails**
- Verify API credentials are correct
- Check internet connection
- Ensure file size is under limits (10MB default)

**Images not displaying**
- Check that Cloud Name is correct
- Verify image URLs are properly generated
- Test with Cloudinary's sample images

### NextAuth Issues

**Session not persisting**
- Ensure NEXTAUTH_SECRET is set
- Check that NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

**Callback URL errors**
- Verify API route exists: `/app/api/auth/[...nextauth]/route.ts`
- Check that NextAuth configuration is imported correctly

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use different credentials for production
- Rotate secrets regularly
- Enable 2FA on Google and Cloudinary accounts
- Monitor API usage and billing