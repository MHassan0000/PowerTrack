-- =====================================================
-- Workout Management Schema
-- =====================================================
-- Run this in Supabase SQL Editor
-- Creates workout templates and workout_exercises junction table

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS public.workout_exercises CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;

-- =====================================================
-- Workouts Table (Templates/Plans)
-- =====================================================

CREATE TABLE public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT true,
  scheduled_date DATE,
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Workout Exercises Junction Table
-- =====================================================

CREATE TABLE public.workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercise_library(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps INTEGER,
  duration_seconds INTEGER,
  rest_seconds INTEGER DEFAULT 60,
  weight_kg DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_id, order_index)
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX workouts_user_id_idx ON public.workouts(user_id);
CREATE INDEX workouts_is_template_idx ON public.workouts(is_template);
CREATE INDEX workouts_scheduled_date_idx ON public.workouts(scheduled_date);
CREATE INDEX workout_exercises_workout_id_idx ON public.workout_exercises(workout_id);
CREATE INDEX workout_exercises_exercise_id_idx ON public.workout_exercises(exercise_id);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Workouts Policies
CREATE POLICY "Users can view own workouts"
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON public.workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON public.workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON public.workouts FOR DELETE
  USING (auth.uid() = user_id);

-- Workout Exercises Policies
CREATE POLICY "Users can view exercises in own workouts"
  ON public.workout_exercises FOR SELECT
  USING (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert exercises in own workouts"
  ON public.workout_exercises FOR INSERT
  WITH CHECK (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exercises in own workouts"
  ON public.workout_exercises FOR UPDATE
  USING (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercises in own workouts"
  ON public.workout_exercises FOR DELETE
  USING (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- Triggers
-- =====================================================

CREATE OR REPLACE FUNCTION update_workout_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_workout_updated_at();

-- =====================================================
-- Sample Workout Templates
-- =====================================================
-- NOTE: Sample data will ONLY be inserted if you're authenticated
-- When running in SQL Editor, these will be skipped

-- Full Body Beginner
DO $$
DECLARE
  workout_id UUID;
  ex_pushups UUID;
  ex_squats UUID;
  ex_pullups UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT id INTO ex_pushups FROM public.exercise_library WHERE name = 'Push-ups' LIMIT 1;
    SELECT id INTO ex_squats FROM public.exercise_library WHERE name = 'Squats' LIMIT 1;
    SELECT id INTO ex_pullups FROM public.exercise_library WHERE name = 'Pull-ups' LIMIT 1;

    IF ex_pushups IS NOT NULL AND ex_squats IS NOT NULL AND ex_pullups IS NOT NULL THEN
      INSERT INTO public.workouts (user_id, name, description, is_template)
      VALUES (
        current_user_id,
        'Full Body Beginner',
        'A complete full-body workout perfect for beginners. Builds strength and endurance using bodyweight and compound movements.',
        true
      )
      RETURNING id INTO workout_id;

      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, rest_seconds)
      VALUES
        (workout_id, ex_pushups, 0, 3, 12, 60),
        (workout_id, ex_squats, 1, 3, 15, 60),
        (workout_id, ex_pullups, 2, 3, 8, 90);
      
      RAISE NOTICE 'Created Full Body Beginner workout';
    END IF;
  ELSE
    RAISE NOTICE 'Skipping sample data - no authenticated user';
  END IF;
END $$;

-- Upper Body Push
DO $$
DECLARE
  workout_id UUID;
  ex_bench UUID;
  ex_pushups UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT id INTO ex_bench FROM public.exercise_library WHERE name = 'Barbell Bench Press' LIMIT 1;
    SELECT id INTO ex_pushups FROM public.exercise_library WHERE name = 'Push-ups' LIMIT 1;

    IF ex_bench IS NOT NULL AND ex_pushups IS NOT NULL THEN
      INSERT INTO public.workouts (user_id, name, description, is_template)
      VALUES (
        current_user_id,
        'Upper Body Push',
        'Focused on chest, shoulders, and triceps. Great for building upper body pressing strength.',
        true
      )
      RETURNING id INTO workout_id;

      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, rest_seconds, weight_kg, notes)
      VALUES
        (workout_id, ex_bench, 0, 4, 8, 120, 60.0, 'Warm up with empty bar first'),
        (workout_id, ex_pushups, 1, 3, 15, 60, NULL, 'Go to failure on last set');
      
      RAISE NOTICE 'Created Upper Body Push workout';
    END IF;
  END IF;
END $$;

-- Lower Body Strength
DO $$
DECLARE
  workout_id UUID;
  ex_squats UUID;
  ex_deadlift UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT id INTO ex_squats FROM public.exercise_library WHERE name = 'Squats' LIMIT 1;
    SELECT id INTO ex_deadlift FROM public.exercise_library WHERE name = 'Deadlift' LIMIT 1;

    IF ex_squats IS NOT NULL AND ex_deadlift IS NOT NULL THEN
      INSERT INTO public.workouts (user_id, name, description, is_template)
      VALUES (
        current_user_id,
        'Lower Body Strength',
        'Build powerful legs and posterior chain with these compound movements.',
        true
      )
      RETURNING id INTO workout_id;

      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, rest_seconds, weight_kg, notes)
      VALUES
        (workout_id, ex_squats, 0, 4, 6, 180, 80.0, 'Focus on depth and form'),
        (workout_id, ex_deadlift, 1, 3, 5, 180, 100.0, 'Keep back straight, engage core');
      
      RAISE NOTICE 'Created Lower Body Strength workout';
    END IF;
  END IF;
END $$;

-- Pull Day
DO $$
DECLARE
  workout_id UUID;
  ex_deadlift UUID;
  ex_pullups UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT id INTO ex_deadlift FROM public.exercise_library WHERE name = 'Deadlift' LIMIT 1;
    SELECT id INTO ex_pullups FROM public.exercise_library WHERE name = 'Pull-ups' LIMIT 1;

    IF ex_deadlift IS NOT NULL AND ex_pullups IS NOT NULL THEN
      INSERT INTO public.workouts (user_id, name, description, is_template)
      VALUES (
        current_user_id,
        'Pull Day',
        'Complete back and biceps workout for building a strong, wide back.',
        true
      )
      RETURNING id INTO workout_id;

      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
      VALUES
        (workout_id, ex_deadlift, 0, 4, 5, 180, 'Main strength movement'),
        (workout_id, ex_pullups, 1, 4, 10, 90, 'Use assistance if needed');
      
      RAISE NOTICE 'Created Pull Day workout';
    END IF;
  END IF;
END $$;

-- =====================================================
-- Verification
-- =====================================================

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('workouts', 'workout_exercises')
ORDER BY table_name;

SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('workouts', 'workout_exercises')
ORDER BY tablename;

SELECT COUNT(*) as workout_count FROM public.workouts;
