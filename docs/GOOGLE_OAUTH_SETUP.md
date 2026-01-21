# Google OAuth Setup Guide for PowerTrack

## 🎯 Overview

This guide walks you through setting up Google OAuth authentication for your PowerTrack fitness app using Supabase.

---

## ✅ Prerequisites

- Supabase project created
- Google Cloud Console account
- PowerTrack app deployed (or use localhost for testing)

---

## 📋 Step-by-Step Setup

### Step 1: Configure Google Cloud Console

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (if needed)

   - Click "Select a project" → "New Project"
   - Name: "PowerTrack"
   - Click "Create"

3. **Enable Google+ API**

   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**

   - Go to "APIs & Services" → "OAuth consent screen"
   - User Type: Select "External"
   - Click "Create"

   **App Information:**

   - App name: `PowerTrack`
   - User support email: `your-email@example.com`
   - App logo: (Optional) Upload your PowerTrack logo
   - Application home page: `https://your-domain.com`
   - Privacy policy: `https://your-domain.com/privacy`
   - Terms of service: `https://your-domain.com/terms`

   **Developer contact:**

   - Email: `your-email@example.com`

   **Scopes:**

   - Click "Add or Remove Scopes"
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
   - Click "Update" → "Save and Continue"

   **Test users:** (for development)

   - Click "Add Users"
   - Add your test emails
   - Click "Save and Continue"

5. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "PowerTrack Web Client"

   **Authorized JavaScript origins:**

   ```
   http://localhost:3000
   https://your-vercel-domain.vercel.app
   https://your-custom-domain.com
   ```

   **Authorized redirect URIs:**

   ```
   http://localhost:3000/auth/callback
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-custom-domain.com/auth/callback
   ```

   **⚠️ IMPORTANT:** Replace `<YOUR_SUPABASE_PROJECT_REF>` with your actual Supabase project reference ID

   - Click "Create"
   - **Copy** the Client ID and Client Secret (you'll need these next)

---

### Step 2: Configure Supabase

1. **Go to Supabase Dashboard**

   - Visit: https://app.supabase.com
   - Select your PowerTrack project

2. **Enable Google Provider**

   - Navigate to "Authentication" → "Providers"
   - Find "Google" in the list
   - Toggle **Enabled** to ON

3. **Add Google Credentials**

   - **Client ID:** Paste from Google Cloud Console
   - **Client Secret:** Paste from Google Cloud Console
   - Click "Save"

4. **Configure Callback URL**

   - Copy your Supabase callback URL:
     ```
     https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
     ```
   - You already added this to Google Cloud Console in Step 1

5. **Update Site URL (if needed)**
   - Go to "Authentication" → "URL Configuration"
   - Set Site URL to your production domain
   - Add redirect URLs:
     ```
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     ```

---

### Step 3: Update Your Code

The Google OAuth action is already implemented in `lib/actions/auth.ts`:

```typescript
export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data, error: null };
}
```

---

### Step 4: Add Google Sign-In Button to UI

Update your login page to include Google OAuth:

**File:** `app/(auth)/login/page.tsx`

Add this button after the password login form:

```tsx
'use client'

import { signInWithGoogle } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'

// ... existing code ...

// Add this function
async function handleGoogleSignIn() {
  const result = await signInWithGoogle()

  if (result.error) {
    alert(`Error: ${result.error}`)
  } else if (result.data?.url) {
    window.location.href = result.data.url
  }
}

// Add this button in your return JSX
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-[rgb(var(--border))]"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-4 bg-[rgb(var(--card))] text-[rgb(var(--foreground-muted))]">
      Or continue with
    </span>
  </div>
</div>

<button
  type="button"
  onClick={handleGoogleSignIn}
  className="w-full py-3 px-4 flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue with Google
</button>
```

---

### Step 5: Test the Integration

**Local Testing:**

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Continue with Google"

4. You should be redirected to Google OAuth consent screen

5. Select your Google account

6. Grant permissions

7. You should be redirected back to `/dashboard`

**Verify in Supabase:**

1. Go to Supabase Dashboard → Authentication → Users
2. Your Google account should appear in the users table
3. Check that user metadata includes Google profile info

---

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit OAuth secrets to Git:

```env
# .env.local (already in .gitignore)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 2. Redirect URL Validation

Ensure your Google Cloud Console only has approved redirect URLs

### 3. Scope Minimization

Only request necessary scopes:

- `userinfo.email`
- `userinfo.profile`

### 4. HTTPS in Production

Always use HTTPS for OAuth redirects in production

---

## 🚨 Troubleshooting

### "Redirect URI Mismatch" Error

**Problem:** Google shows error about redirect URI

**Solution:**

1. Check Google Cloud Console → Credentials
2. Ensure redirect URI exactly matches:
   ```
   https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
   ```
3. No trailing slashes
4. Correct protocol (http vs https)

### "User Not Found" After Sign-In

**Problem:** User redirected but not logged in

**Solution:**

1. Check callback route exists: `app/auth/callback/route.ts`
2. Verify callback URL in Supabase matches your domains
3. Check browser console for errors

### Google Consent Screen Shows "Unverified App"

**Problem:** Warning during OAuth flow

**Solution:**

- Normal for development
- For production, submit app for verification in Google Cloud Console
- Or add test users in OAuth consent screen

### Profile Creation Fails

**Problem:** User authenticated but no profile in database

**Solution:**

1. Check database trigger exists: `handle_new_user`
2. Run migration: `supabase/migrations/001_initial_schema.sql`
3. Verify trigger is active in Supabase SQL Editor

---

## 📊 User Data from Google

After Google sign-in, Supabase stores:

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "user_metadata": {
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "email": "user@gmail.com",
    "email_verified": true,
    "full_name": "John Doe",
    "iss": "https://accounts.google.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "provider_id": "1234567890",
    "sub": "1234567890"
  }
}
```

Access in your app:

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();
console.log(user?.user_metadata?.full_name);
console.log(user?.user_metadata?.avatar_url);
```

---

## ✅ Production Checklist

Before going live:

- [ ] Google OAuth credentials created
- [ ] Production redirect URLs added to Google Cloud Console
- [ ] Supabase Google provider configured
- [ ] Callback route implemented
- [ ] Google button added to login page
- [ ] Tested OAuth flow on localhost
- [ ] Verified user creation in database
- [ ] Configured production redirect URLs
- [ ] Updated Supabase Site URL
- [ ] Tested on production domain
- [ ] (Optional) Submit app for Google verification

---

## 🎉 You're Done!

Your PowerTrack app now supports Google OAuth authentication! Users can sign in with one click using their Google accounts.

**Next Steps:**

- Add more OAuth providers (GitHub, Apple)
- Customize user onboarding for OAuth users
- Add profile photo sync from Google
- Implement account linking (merge email + Google accounts)
