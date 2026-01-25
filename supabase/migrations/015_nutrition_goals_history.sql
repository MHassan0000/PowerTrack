-- =====================================================
-- Nutrition Goals History
-- =====================================================
-- Tracks user nutrition goals over time (Type 2 SCD)
-- Enables retroactive reporting without changing historical targets

-- 1. Create history table
CREATE TABLE IF NOT EXISTS public.nutrition_goals_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daily_calorie_goal INTEGER,
    daily_protein_goal_g DECIMAL,
    daily_carbs_goal_g DECIMAL,
    daily_fat_goal_g DECIMAL,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Ensure one goal set per day per user
    UNIQUE(user_id, effective_date)
);

-- 2. Enable RLS
ALTER TABLE public.nutrition_goals_history ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view their own goal history" 
    ON public.nutrition_goals_history FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal history" 
    ON public.nutrition_goals_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal history" 
    ON public.nutrition_goals_history FOR UPDATE 
    USING (auth.uid() = user_id);

-- 4. Indexes
CREATE INDEX idx_nutrition_goals_history_user_date 
    ON public.nutrition_goals_history(user_id, effective_date DESC);

-- 5. Backfill Data (Important!)
-- Insert current goals from 'users' table as the initial history entry
-- We use '2000-01-01' to ensure these cover all past dates until a new entry is made
INSERT INTO public.nutrition_goals_history 
    (user_id, daily_calorie_goal, daily_protein_goal_g, daily_carbs_goal_g, daily_fat_goal_g, effective_date)
SELECT 
    id, 
    daily_calorie_goal, 
    daily_protein_goal_g, 
    daily_carbs_goal_g, 
    daily_fat_goal_g, 
    '2000-01-01'::DATE
FROM public.users
WHERE daily_calorie_goal IS NOT NULL 
   OR daily_protein_goal_g IS NOT NULL 
   OR daily_carbs_goal_g IS NOT NULL 
   OR daily_fat_goal_g IS NOT NULL
ON CONFLICT (user_id, effective_date) DO NOTHING;
