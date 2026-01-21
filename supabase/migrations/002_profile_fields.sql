-- =====================================================
-- Profile Schema Updates
-- =====================================================
-- Add missing profile fields to users table
-- Run this after the initial schema migration

-- Add new columns if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS experience_level TEXT 
  CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_units TEXT 
  DEFAULT 'metric'
  CHECK (preferred_units IN ('metric', 'imperial'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS age INTEGER 
  CHECK (age >= 13 AND age <= 120);

-- Update fitness_goal constraint to match requirements
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_fitness_goal_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_fitness_goal_check 
  CHECK (fitness_goal IN ('lose_fat', 'build_muscle', 'maintain', 'endurance', 'strength'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS users_fitness_goal_idx ON public.users(fitness_goal);
CREATE INDEX IF NOT EXISTS users_experience_level_idx ON public.users(experience_level);

-- Comment on columns
COMMENT ON COLUMN public.users.experience_level IS 'User fitness experience level';
COMMENT ON COLUMN public.users.preferred_units IS 'Preferred unit system (metric/imperial)';
COMMENT ON COLUMN public.users.age IS 'User age in years';
COMMENT ON COLUMN public.users.fitness_goal IS 'Primary fitness goal';

-- Verify the updates
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
