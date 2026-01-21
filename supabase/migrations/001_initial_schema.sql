-- =====================================================
-- PowerTrack Database Schema & RLS Policies
-- =====================================================
-- Run this in your Supabase SQL Editor
-- Project: PowerTrack Fitness Tracking Application
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (Profile Extension)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  height_cm DECIMAL,
  weight_kg DECIMAL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  fitness_goal TEXT CHECK (fitness_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- =====================================================
-- 2. WORKOUTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  workout_type TEXT CHECK (workout_type IN ('strength', 'cardio', 'flexibility', 'sports', 'other')),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  calories_burned INTEGER CHECK (calories_burned >= 0),
  intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high', 'extreme')),
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS workouts_user_id_idx ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS workouts_completed_at_idx ON public.workouts(completed_at DESC);

-- =====================================================
-- 3. EXERCISES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sets INTEGER CHECK (sets > 0),
  reps INTEGER CHECK (reps > 0),
  weight_kg DECIMAL CHECK (weight_kg >= 0),
  duration_seconds INTEGER CHECK (duration_seconds > 0),
  distance_meters DECIMAL CHECK (distance_meters >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS exercises_workout_id_idx ON public.exercises(workout_id);

-- =====================================================
-- 4. NUTRITION LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.nutrition_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'other')),
  food_item TEXT NOT NULL,
  calories INTEGER CHECK (calories >= 0),
  protein_g DECIMAL CHECK (protein_g >= 0),
  carbs_g DECIMAL CHECK (carbs_g >= 0),
  fat_g DECIMAL CHECK (fat_g >= 0),
  fiber_g DECIMAL CHECK (fiber_g >= 0),
  sugar_g DECIMAL CHECK (sugar_g >= 0),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_idx ON public.nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS nutrition_logs_logged_at_idx ON public.nutrition_logs(logged_at DESC);

-- =====================================================
-- 5. PROGRESS PHOTOS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  weight_kg DECIMAL,
  body_fat_percentage DECIMAL CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  notes TEXT,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS progress_photos_user_id_idx ON public.progress_photos(user_id);
CREATE INDEX IF NOT EXISTS progress_photos_taken_at_idx ON public.progress_photos(taken_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- =====================================================
-- WORKOUTS TABLE POLICIES
-- =====================================================

-- Users can view their own workouts
CREATE POLICY "Users can view own workouts" 
ON public.workouts FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own workouts
CREATE POLICY "Users can create own workouts" 
ON public.workouts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own workouts
CREATE POLICY "Users can update own workouts" 
ON public.workouts FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own workouts
CREATE POLICY "Users can delete own workouts" 
ON public.workouts FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- EXERCISES TABLE POLICIES
-- =====================================================

-- Users can view exercises from their workouts
CREATE POLICY "Users can view own exercises" 
ON public.exercises FOR SELECT 
USING (
  auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id)
);

-- Users can create exercises for their workouts
CREATE POLICY "Users can create own exercises" 
ON public.exercises FOR INSERT 
WITH CHECK (
  auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id)
);

-- Users can update exercises from their workouts
CREATE POLICY "Users can update own exercises" 
ON public.exercises FOR UPDATE 
USING (
  auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id)
);

-- Users can delete exercises from their workouts
CREATE POLICY "Users can delete own exercises" 
ON public.exercises FOR DELETE 
USING (
  auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id)
);

-- =====================================================
-- NUTRITION LOGS TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view own nutrition logs" 
ON public.nutrition_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own nutrition logs" 
ON public.nutrition_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs" 
ON public.nutrition_logs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs" 
ON public.nutrition_logs FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- PROGRESS PHOTOS TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view own progress photos" 
ON public.progress_photos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress photos" 
ON public.progress_photos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress photos" 
ON public.progress_photos FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress photos" 
ON public.progress_photos FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS workouts_updated_at ON public.workouts;
CREATE TRIGGER workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- STORAGE BUCKETS (For Profile Photos & Progress Photos)
-- =====================================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for progress photos
CREATE POLICY "Progress photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos');

CREATE POLICY "Users can upload their own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'progress-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own progress photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'progress-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own progress photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'progress-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify all tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Make sure to enable email confirmations in Supabase Auth settings
-- 2. Configure email templates in Supabase Dashboard > Authentication > Email Templates
-- 3. Set up redirect URLs in Supabase Dashboard > Authentication > URL Configuration
-- 4. For production, review and tighten RLS policies as needed
-- 5. Consider adding indexes for queries you'll run frequently
