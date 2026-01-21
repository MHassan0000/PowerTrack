# PowerTrack Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Code Quality

- [ ] Run TypeScript type check: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] All tests pass (if applicable)

### 2. Environment Variables

- [ ] `.env.local` exists locally (not committed)
- [ ] `.env.example` documented
- [ ] Vercel environment variables configured

### 3. Database

- [ ] All SQL migrations applied to production Supabase
- [ ] RLS policies enabled on all tables
- [ ] Supabase production settings configured

---

## 🗄️ Database Setup

### Run Migrations in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run migrations in this order:

```sql
-- 1. Initial setup
-- Run: supabase/migrations/001_initial_setup.sql

-- 2. Exercise library
-- Run: supabase/migrations/002_exercise_library.sql

-- 3. Workouts
-- Run: supabase/migrations/003_workouts.sql

-- 4. User profiles
-- Run: supabase/migrations/004_user_profiles.sql

-- 5. Workout logging
-- Run: supabase/migrations/005_workout_logging.sql

-- 6. Progress tracking
-- Run: supabase/migrations/006_progress_tracking.sql

-- 7. Goals
-- Run: supabase/migrations/007_goals.sql
```

### Verify RLS Policies

```sql
-- Check all tables have RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;

-- Should return empty (all tables have RLS)

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 🔧 Supabase Configuration

### Authentication Settings

1. **Email Authentication**

   - ✅ Enable Email provider
   - ✅ Enable Email confirmations
   - Set confirmation URL: `https://your-domain.vercel.app/auth/callback`

2. **OAuth Providers (if using Google)**

   - ✅ Enable Google provider
   - Add Google Client ID and Secret
   - Add redirect URL: `https://your-domain.vercel.app/auth/callback`

3. **URL Configuration**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs:
     - `https://your-domain.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local testing)

### Database Settings

- ✅ Enable connection pooling for better performance
- ✅ Use pooled connection string in production

### API Settings

- ✅ Enable CORS for your domain
- ✅ Set reasonable rate limits

---

## 🚀 Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import in Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Environment Variables**
   Add in Vercel project settings:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your site!

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
```

---

## ✅ Post-Deployment Verification

### Test Checklist

1. **Authentication**

   - [ ] Sign up new user
   - [ ] Email confirmation works
   - [ ] Login works
   - [ ] Logout works
   - [ ] Password reset works (if implemented)

2. **Core Features**

   - [ ] View exercise library
   - [ ] Create workout
   - [ ] Start workout session
   - [ ] Log sets
   - [ ] Complete workout
   - [ ] View workout history

3. **Progress Tracking**

   - [ ] Add body weight
   - [ ] View charts
   - [ ] Personal records display

4. **Goals**

   - [ ] Create goal
   - [ ] View goals
   - [ ] Progress updates automatically
   - [ ] Complete goal

5. **Performance**
   - [ ] Pages load quickly (< 2s)
   - [ ] No console errors
   - [ ] Mobile responsive
   - [ ] No layout shifts

---

## 🔒 Security Verification

### RLS Testing

Test each table's RLS policies:

```sql
-- As regular user (using anon key)
-- Should only see own data
SELECT * FROM workout_sessions;
SELECT * FROM fitness_goals;
SELECT * FROM body_stats;

-- Should not see other users' data
```

### Secret Exposure Check

```bash
# Search for accidental secret exposure
grep -r "SUPABASE_SERVICE_ROLE_KEY" .
grep -r "sk_live" .

# Should return no results in committed code
```

---

## 📊 Monitoring Setup (Optional)

### Vercel Analytics

1. Enable in Vercel project settings
2. View analytics in Vercel dashboard

### Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

Configure in `sentry.client.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🔄 Continuous Deployment

Once set up with GitHub + Vercel:

1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments for PRs

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes, commit, push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create PR on GitHub
# Vercel creates preview deployment automatically
```

---

## 🐛 Troubleshooting

### Build Fails

Check Vercel build logs:

- TypeScript errors
- Missing environment variables
- Missing dependencies

### Authentication Not Working

- Verify redirect URLs in Supabase
- Check NEXT_PUBLIC_APP_URL matches domain
- Ensure callback route exists: `/auth/callback`

### Database Queries Failing

- Check RLS policies
- Verify user is authenticated
- Check Supabase logs

### Environment Variables Not Working

- Ensure `NEXT_PUBLIC_` prefix for client-side vars
- Redeploy after adding new env vars
- Clear cache: `vercel --force`

---

## 📝 Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Database Backups

- Supabase automatically backs up daily
- Enable PITR (Point-in-Time Recovery) for Pro plan
- Manual backup: Database → Backups → Download

---

## 🎉 You're Live!

Your PowerTrack app is now deployed and ready for users!

**Next Steps:**

- Share your app URL
- Monitor for errors
- Gather user feedback
- Iterate and improve

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
