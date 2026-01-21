-- =====================================================
-- Workout Management Schema
-- =====================================================
-- Run this in Supabase SQL Editor
-- Creates workout templates and workout_exercises junction table

-- =====================================================
-- Workouts Table (Templates/Plans)
-- =====================================================

-- Note: This extends the existing workouts table from initial migration
-- If it doesn't exist, create it:

CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT true, -- true = template, false = completed workout log
  scheduled_date DATE, -- For scheduled workouts
  completed_at TIMESTAMPTZ, -- For logged workouts
  duration_minutes INTEGER, -- Actual duration for completed workouts
  notes TEXT, -- User notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Workout Exercises Junction Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercise_library(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL, -- Order of exercise in workout
  sets INTEGER NOT NULL DEFAULT 3,
  reps INTEGER, -- Target reps (NULL for time-based)
  duration_seconds INTEGER, -- For time-based exercises
  rest_seconds INTEGER DEFAULT 60,
  weight_kg DECIMAL(5,2), -- Suggested weight
  notes TEXT, -- Exercise-specific notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique ordering within workout
  UNIQUE(workout_id, order_index)
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS workouts_user_id_idx ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS workouts_is_template_idx ON public.workouts(is_template);
CREATE INDEX IF NOT EXISTS workouts_scheduled_date_idx ON public.workouts(scheduled_date);
CREATE INDEX IF NOT EXISTS workout_exercises_workout_id_idx ON public.workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS workout_exercises_exercise_id_idx ON public.workout_exercises(exercise_id);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Workouts: Users can only see/modify their own workouts
CREATE POLICY "Users can view own workouts"
  ON public.workouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON public.workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON public.workouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON public.workouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Workout Exercises: Users can manage exercises in their own workouts
CREATE POLICY "Users can view exercises in own workouts"
  ON public.workout_exercises
  FOR SELECT
  USING (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert exercises in own workouts"
  ON public.workout_exercises
  FOR INSERT
  WITH CHECK (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exercises in own workouts"
  ON public.workout_exercises
  FOR UPDATE
  USING (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercises in own workouts"
  ON public.workout_exercises
  FOR DELETE
  USING (
    workout_id IN (
      SELECT id FROM public.workouts WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- Triggers
-- =====================================================

-- Update updated_at on workout changes
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
-- Helper Functions
-- =====================================================

-- Get workout with all exercises
CREATE OR REPLACE FUNCTION get_workout_details(workout_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'workout', row_to_json(w.*),
    'exercises', (
      SELECT json_agg(
        json_build_object(
          'workout_exercise', row_to_json(we.*),
          'exercise', row_to_json(el.*)
        )
        ORDER BY we.order_index
      )
      FROM workout_exercises we
      JOIN exercise_library el ON we.exercise_id = el.id
      WHERE we.workout_id = workout_uuid
    )
  ) INTO result
  FROM workouts w
  WHERE w.id = workout_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Sample Workout Templates
-- =====================================================

-- Note: Replace 'USER_ID' with actual user ID or remove this section
-- These are example workout templates

/*
-- Full Body Beginner Workout
WITH new_workout AS (
  INSERT INTO public.workouts (user_id, name, description, is_template)
  VALUES ('USER_ID', 'Full Body Beginner', 'A complete full-body workout for beginners', true)
  RETURNING id
)
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, rest_seconds)
SELECT 
  new_workout.id,
  el.id,
  ordinality,
  3,
  12,
  60
FROM new_workout,
  LATERAL (VALUES
    ('Push-ups'),
    ('Squats'),
    ('Pull-ups')
  ) AS ex(name) WITH ORDINALITY
  JOIN exercise_library el ON el.name = ex.name;

-- Upper Body Push Workout
WITH new_workout AS (
  INSERT INTO public.workouts (user_id, name, description, is_template)
  VALUES ('USER_ID', 'Upper Body Push', 'Chest, shoulders, and triceps focused workout', true)
  RETURNING id
)
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, rest_seconds, weight_kg)
SELECT 
  new_workout.id,
  el.id,
  ordinality,
  CASE 
    WHEN ex.name = 'Barbell Bench Press' THEN 4
    ELSE 3
  END,
  CASE 
    WHEN ex.name = 'Barbell Bench Press' THEN 8
    ELSE 12
  END,
  90,
  CASE 
    WHEN ex.name = 'Barbell Bench Press' THEN 60.0
    ELSE NULL
  END
FROM new_workout,
  LATERAL (VALUES
    ('Barbell Bench Press'),
    ('Push-ups')
  ) AS ex(name) WITH ORDINALITY
  JOIN exercise_library el ON el.name = ex.name;
*/

-- =====================================================
-- Verification
-- =====================================================

-- Check tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('workouts', 'workout_exercises')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('workouts', 'workout_exercises')
ORDER BY tablename;
