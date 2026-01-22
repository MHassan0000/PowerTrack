# PowerTrack Database Setup Guide

This guide will help you set up and populate the PowerTrack database with all necessary tables, storage buckets, and exercise data.

## Prerequisites

- Active Supabase project
- Access to Supabase SQL Editor

## Step-by-Step Setup

### 1. Run Core Migrations

Navigate to your Supabase Dashboard → SQL Editor and run each migration file in order:

#### Migration 001: Initial Schema

```sql
-- File: supabase/migrations/001_initial_schema.sql
-- Creates: users, workouts, exercises, nutrition_logs, progress_photos tables
```

#### Migration 002: Profile Fields

```sql
-- File: supabase/migrations/002_profile_fields.sql
-- Adds: age, height_cm, weight_kg, fitness_goal, etc.
```

#### Migration 003: Exercise Library

```sql
-- File: supabase/migrations/003_exercise_library.sql
-- Creates: exercise_library table with sample exercises
```

#### Migration 004: Workout Management

```sql
-- File: supabase/migrations/004_workout_management.sql
-- Creates: workouts and workout_exercises tables
```

#### Migration 005: Workout Logging

```sql
-- File: supabase/migrations/005_workout_logging.sql
-- Creates: workout_sessions and set_logs tables
```

#### Migration 006: Progress Tracking

```sql
-- File: supabase/migrations/006_progress_tracking.sql
-- Creates: body_stats table
```

#### Migration 007: Goals

```sql
-- File: supabase/migrations/007_goals.sql
-- Creates: fitness_goals table
```

### 2. Set Up Storage for Exercise Images

#### Migration 008: Exercise Images Storage

```sql
-- File: supabase/migrations/008_exercise_images_storage.sql
-- Creates: exercise-images storage bucket with public access
```

**Alternative Manual Setup:**

1. Go to Storage → Create new bucket
2. Name: `exercise-images`
3. Enable "Public bucket"
4. Click Create

### 3. Populate Exercise Library

#### Migration 009: Comprehensive Exercises

```sql
-- File: supabase/migrations/009_comprehensive_exercises.sql
-- Adds 35+ exercises with images and detailed instructions
```

This migration adds:

- 5 Chest exercises
- 5 Back exercises
- 3 Shoulder exercises
- 4 Arm exercises (biceps & triceps)
- 5 Leg exercises
- 4 Core exercises
- 3 Full-body/functional exercises

## Verification

After running all migrations, verify the setup:

### Check Exercise Count

```sql
SELECT COUNT(*) as total_exercises FROM public.exercise_library;
-- Expected: 35+ exercises
```

### Check Muscle Group Distribution

```sql
SELECT primary_muscle, COUNT(*) as count
FROM public.exercise_library
GROUP BY primary_muscle
ORDER BY count DESC;
```

### Verify Images

```sql
SELECT COUNT(*) as exercises_with_images
FROM public.exercise_library
WHERE media_url IS NOT NULL;
-- Should match total exercise count
```

### Check Storage Bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'exercise-images';
-- Should return 1 row with public = true
```

## Troubleshooting

### Issue: "relation already exists" errors

**Solution**: Some tables may already exist from previous migrations. This is normal. The migrations use `IF NOT EXISTS` or `ON CONFLICT` clauses to handle this.

### Issue: Storage bucket creation fails

**Solution**: Create the bucket manually in the Supabase Dashboard:

1. Storage → New bucket
2. Name: `exercise-images`
3. Public: Yes

### Issue: No exercises appear in the app

**Solution**:

1. Verify migration 009 ran successfully
2. Check RLS policies allow SELECT on exercise_library
3. Run: `SELECT COUNT(*) FROM exercise_library;`

### Issue: Images not loading

**Solution**:

1. Verify storage bucket is public
2. Check `media_url` values in exercise_library
3. Ensure Next.js config allows Unsplash domains

## Adding Your Own Exercises

To add custom exercises, use this SQL template:

```sql
INSERT INTO public.exercise_library (
  name,
  description,
  primary_muscle,
  secondary_muscles,
  equipment,
  difficulty,
  media_url,
  instructions,
  tips
) VALUES (
  'Exercise Name',
  'Brief description',
  'Primary Muscle',
  ARRAY['Secondary1', 'Secondary2'],
  'Equipment Type',
  'beginner', -- or 'intermediate', 'advanced'
  'https://your-image-url.com/image.jpg',
  E'1. Step one\n2. Step two\n3. Step three',
  'Safety tips and form cues'
);
```

## Database Cleanup (Optional)

To start fresh with exercises:

```sql
-- WARNING: This deletes ALL exercises
DELETE FROM public.exercise_library;

-- Then re-run migration 009
```

## Next Steps

After completing the database setup:

1. ✅ Start development server: `npm run dev`
2. ✅ Create a user account
3. ✅ Browse exercises at `/exercises`
4. ✅ Create your first workout at `/workouts`
5. ✅ Start tracking progress!

## Support

If you encounter issues:

1. Check Supabase logs in Dashboard → Logs
2. Verify RLS policies are enabled
3. Ensure all migrations ran successfully
4. Check browser console for errors
