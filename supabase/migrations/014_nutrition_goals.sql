-- =====================================================
-- User-Defined Nutrition Goals
-- =====================================================
-- Adds columns for users to set their daily nutrition targets
-- Goals apply to all dates (current goals used for historical view)

-- Add nutrition goal columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER,
ADD COLUMN IF NOT EXISTS daily_protein_goal_g DECIMAL,
ADD COLUMN IF NOT EXISTS daily_carbs_goal_g DECIMAL,
ADD COLUMN IF NOT EXISTS daily_fat_goal_g DECIMAL;

-- Add helpful comments
COMMENT ON COLUMN public.users.daily_calorie_goal IS 'User-defined daily calorie target';
COMMENT ON COLUMN public.users.daily_protein_goal_g IS 'User-defined daily protein target in grams';
COMMENT ON COLUMN public.users.daily_carbs_goal_g IS 'User-defined daily carbs target in grams';
COMMENT ON COLUMN public.users.daily_fat_goal_g IS 'User-defined daily fat target in grams';
