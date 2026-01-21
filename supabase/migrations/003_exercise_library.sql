-- =====================================================
-- Exercise Library Schema
-- =====================================================
-- Run this in Supabase SQL Editor
-- Creates exercise library with public read, admin write

-- Create exercise_library table
CREATE TABLE IF NOT EXISTS public.exercise_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  primary_muscle TEXT NOT NULL,
  secondary_muscles TEXT[], -- Array of muscle groups
  equipment TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  media_url TEXT, -- URL to image/gif
  instructions TEXT, -- Step-by-step instructions
  tips TEXT, -- Form tips and safety notes
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS exercise_library_name_idx ON public.exercise_library(name);
CREATE INDEX IF NOT EXISTS exercise_library_primary_muscle_idx ON public.exercise_library(primary_muscle);
CREATE INDEX IF NOT EXISTS exercise_library_equipment_idx ON public.exercise_library(equipment);
CREATE INDEX IF NOT EXISTS exercise_library_difficulty_idx ON public.exercise_library(difficulty);

-- Enable full-text search on name and description
CREATE INDEX IF NOT EXISTS exercise_library_search_idx 
  ON public.exercise_library 
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;

-- Public read policy - Anyone can view exercises
CREATE POLICY "Anyone can view exercises"
  ON public.exercise_library
  FOR SELECT
  USING (true);

-- Admin write policy - Only admins can insert/update/delete
-- Note: You need to set is_admin in user metadata or create an admin role
CREATE POLICY "Admins can insert exercises"
  ON public.exercise_library
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update exercises"
  ON public.exercise_library
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete exercises"
  ON public.exercise_library
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to search exercises
CREATE OR REPLACE FUNCTION search_exercises(search_query TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  primary_muscle TEXT,
  secondary_muscles TEXT[],
  equipment TEXT,
  difficulty TEXT,
  media_url TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.description,
    e.primary_muscle,
    e.secondary_muscles,
    e.equipment,
    e.difficulty,
    e.media_url,
    ts_rank(
      to_tsvector('english', e.name || ' ' || COALESCE(e.description, '')),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM public.exercise_library e
  WHERE 
    to_tsvector('english', e.name || ' ' || COALESCE(e.description, '')) 
    @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC;
END;
$$;

-- =====================================================
-- Sample Data (Optional - for development)
-- =====================================================

-- Insert sample exercises (comment out for production)
INSERT INTO public.exercise_library (name, description, primary_muscle, secondary_muscles, equipment, difficulty, instructions, tips) VALUES
  ('Barbell Bench Press', 'Classic compound chest exercise for building upper body strength', 'Chest', ARRAY['Triceps', 'Shoulders'], 'Barbell', 'intermediate', 
   E'1. Lie flat on bench\n2. Grip bar slightly wider than shoulder width\n3. Lower bar to mid-chest\n4. Press up explosively',
   'Keep feet flat on floor. Maintain slight arch in lower back. Control the descent.'),
  
  ('Deadlift', 'Full-body compound movement targeting posterior chain', 'Back', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Barbell', 'advanced',
   E'1. Stand with feet hip-width apart\n2. Bend at hips and knees to grip bar\n3. Keep back straight, chest up\n4. Drive through heels to stand',
   'Keep bar close to body. Engage core throughout. Avoid rounding back.'),
  
  ('Push-ups', 'Bodyweight exercise for chest, shoulders, and triceps', 'Chest', ARRAY['Triceps', 'Shoulders', 'Core'], 'Bodyweight', 'beginner',
   E'1. Start in plank position\n2. Lower chest to ground\n3. Push back up\n4. Keep body straight throughout',
   'Engage core. Keep elbows at 45 degrees. Full range of motion.'),
  
  ('Pull-ups', 'Bodyweight back exercise for developing upper body strength', 'Back', ARRAY['Biceps', 'Forearms'], 'Pull-up Bar', 'intermediate',
   E'1. Hang from bar with overhand grip\n2. Pull up until chin over bar\n3. Lower with control\n4. Full extension at bottom',
   'Avoid swinging. Squeeze shoulder blades. Use assistance if needed.'),
  
  ('Squats', 'Compound lower body exercise for leg development', 'Quadriceps', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Barbell', 'intermediate',
   E'1. Bar on upper back\n2. Feet shoulder-width apart\n3. Squat down keeping knees aligned\n4. Drive through heels to stand',
   'Keep chest up. Knees track over toes. Go as deep as mobility allows.')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- Verification
-- =====================================================

-- Check that table was created
SELECT COUNT(*) as exercise_count FROM public.exercise_library;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'exercise_library' AND schemaname = 'public';
