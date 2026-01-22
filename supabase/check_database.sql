-- Quick Database Check
-- Run this in your Supabase SQL Editor to verify setup

-- 1. Check if exercise_library table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'exercise_library'
) as table_exists;

-- 2. If table exists, count exercises
SELECT COUNT(*) as exercise_count FROM public.exercise_library;

-- 3. Show all exercises (if any)
SELECT id, name, primary_muscle, equipment, difficulty 
FROM public.exercise_library 
ORDER BY name 
LIMIT 10;

-- 4. Check RLS policies on exercise_library
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'exercise_library';
