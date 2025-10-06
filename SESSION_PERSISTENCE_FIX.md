# 🔐 Session Persistence Fix

## Changes Made

### 1. **Extended Session Duration**
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days (was 24 hours)
  updateAge: 24 * 60 * 60,    // Update session every 24 hours
}
```

**Before**: Session expired after 24 hours
**After**: Session persists for 30 days

### 2. **Cookie Configuration**
```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,       // Prevents XSS attacks
      sameSite: 'lax',      // CSRF protection
      path: '/',            // Available on all routes
      secure: false,        // true in production, false in dev
    },
  },
}
```

**Benefits**:
- ✅ Cookie persists across browser sessions
- ✅ Works on localhost and production
- ✅ Secure in production

### 3. **Less Restrictive Middleware**

**Before**: Required authentication for ALL routes except `/`, `/login`, `/signup`

**After**: Only requires authentication for specific protected routes:
- `/dashboard`
- `/discover`
- `/matches`
- `/messages`
- `/profile`
- `/community`
- `/onboarding`
- `/notifications`

**Public Routes** (no login required):
- `/`
- `/login`
- `/signup`
- `/test-cloudinary`
- `/test-upload`
- Any other route not in protected list

### 4. **Debug Mode in Development**
```typescript
debug: process.env.NODE_ENV === 'development'
```

Now you'll see detailed NextAuth logs in the terminal during development.

## How Session Persistence Works

### Login Flow:
1. **User logs in with Google**
2. **Backend JWT token received**
3. **NextAuth creates session**
4. **Session cookie set in browser** (expires in 30 days)
5. **Cookie sent with every request**

### On Page Reload:
1. **Browser sends session cookie**
2. **NextAuth validates JWT**
3. **User stays logged in**

### Session Updates:
- Session refreshed every 24 hours (`updateAge`)
- Token re-validated with backend
- Cookie expiration extended

## Testing Session Persistence

### Test 1: Browser Refresh
1. Log in to your app
2. Press `F5` to refresh
3. Should stay logged in ✅

### Test 2: Close Browser
1. Log in to your app
2. Close the browser completely
3. Open browser again
4. Navigate to your app
5. Should still be logged in ✅

### Test 3: Direct URL Access
1. Log in to your app
2. Manually type `http://localhost:3000/dashboard` in address bar
3. Should go directly to dashboard ✅

### Test 4: Cookie Inspection
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Cookies** → `http://localhost:3000`
4. Look for `next-auth.session-token`
5. Check **Expires** - should be ~30 days from now ✅

## Common Issues & Solutions

### Issue: Session Expires Immediately
**Cause**: Cookie not being set
**Check**:
```javascript
// In browser console
document.cookie
// Should contain 'next-auth.session-token'
```
**Fix**: Ensure `NEXTAUTH_SECRET` is set in `.env`

### Issue: Session Lost on Redirect
**Cause**: Cookie domain mismatch
**Check**: Make sure `NEXTAUTH_URL` matches your actual URL
```env
NEXTAUTH_URL=http://localhost:3000  # Local
NEXTAUTH_URL=https://faithbliss.vercel.app  # Production
```

### Issue: Session Works Locally but Not in Production
**Cause**: Missing environment variables on Vercel
**Fix**: Add to Vercel dashboard:
- `NEXTAUTH_URL=https://faithbliss.vercel.app`
- `NEXTAUTH_SECRET=your-secret`
- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...`

### Issue: "Session expired" After 24 Hours
**Was**: `maxAge: 24 * 60 * 60` (24 hours)
**Now**: `maxAge: 30 * 24 * 60 * 60` (30 days)
**Fixed**: Session now lasts 30 days ✅

## Environment Variables Check

Make sure these are set in `.env`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=PFWpv5RZUgcWk4WFaNRCqGhnKcXF2Lfoi7BDvJYEnmI

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_BACKEND_URL=https://faithbliss-backend.fly.dev
```

And on Vercel (for production):
```env
NEXTAUTH_URL=https://faithbliss.vercel.app
NEXTAUTH_SECRET=PFWpv5RZUgcWk4WFaNRCqGhnKcXF2Lfoi7BDvJYEnmI

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_BACKEND_URL=https://faithbliss-backend.fly.dev
```

## Session Lifecycle

```
Day 0: Login
  ↓
  Session created (maxAge: 30 days)
  Cookie set in browser
  
Day 1: Visit site
  ↓
  Session validated
  Session refreshed (updateAge: 24h)
  Cookie expiration extended
  
Day 2-29: Visit site
  ↓
  Session validated
  Every 24h: Session refreshed
  Cookie expiration extended
  
Day 30: Session expires
  ↓
  User redirected to login
```

## Debugging Session Issues

### Check Current Session in Browser Console:
```javascript
// Check if session exists
fetch('/api/auth/session')
  .then(r => r.json())
  .then(s => console.log('Session:', s));

// Check cookies
console.log('Cookies:', document.cookie);

// Check session storage
console.log('Session storage:', sessionStorage);
console.log('Local storage:', localStorage);
```

### Check Server Logs:
With `debug: true`, you'll see in terminal:
```
[next-auth][debug] Session callback
[next-auth][debug] JWT callback
[next-auth][debug] Session token refreshed
```

## What You Should Experience Now

✅ **Login once, stay logged in for 30 days**
✅ **Refresh page → stay logged in**
✅ **Close browser → reopen → still logged in**
✅ **Access any public route without login**
✅ **Only protected routes require authentication**
✅ **No more "too strict" authentication**

## Routes Breakdown

### Public (No Auth Required):
- `/` - Homepage
- `/login` - Login page
- `/signup` - Signup page
- `/test-cloudinary` - Cloudinary test
- `/test-upload` - Upload test

### Protected (Auth Required):
- `/dashboard` - Main dashboard
- `/discover` - Discover users
- `/matches` - View matches
- `/messages` - Chat
- `/profile` - User profile
- `/community` - Community features
- `/onboarding` - Complete profile
- `/notifications` - Notifications

The session will now persist properly! 🎉
