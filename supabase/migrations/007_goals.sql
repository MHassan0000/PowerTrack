-- =============================================
-- Goals & Programs Feature
-- Migration: 007_goals.sql
-- Tables: fitness_goals
-- =============================================

-- =============================================
-- ENUM TYPES
-- =============================================
CREATE TYPE goal_type AS ENUM ('strength', 'weight_loss', 'weight_gain', 'volume', 'consistency');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'archived');

-- =============================================
-- FITNESS GOALS TABLE
-- =============================================
CREATE TABLE public.fitness_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Goal details
  title TEXT NOT NULL,
  description TEXT,
  goal_type goal_type NOT NULL,
  
  -- Target values
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT NOT NULL, -- 'kg', 'reps', 'workouts', etc.
  
  -- Exercise specific (for strength goals)
  exercise_id UUID REFERENCES public.exercise_library(id) ON DELETE SET NULL,
  
  -- Initial value (for tracking progress)
  initial_value DECIMAL(10,2) DEFAULT 0,
  
  -- Dates
  target_date DATE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Status
  status goal_status DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX fitness_goals_user_id_idx ON public.fitness_goals(user_id);
CREATE INDEX fitness_goals_status_idx ON public.fitness_goals(status);
CREATE INDEX fitness_goals_exercise_id_idx ON public.fitness_goals(exercise_id);
CREATE INDEX fitness_goals_goal_type_idx ON public.fitness_goals(goal_type);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================
ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;

-- Users can view their own goals
CREATE POLICY "Users can view own goals"
  ON public.fitness_goals FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own goals
CREATE POLICY "Users can insert own goals"
  ON public.fitness_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update own goals"
  ON public.fitness_goals FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own goals
CREATE POLICY "Users can delete own goals"
  ON public.fitness_goals FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fitness_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fitness_goals_updated_at
  BEFORE UPDATE ON public.fitness_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_fitness_goals_updated_at();

-- Auto-complete goal when target reached
CREATE OR REPLACE FUNCTION check_goal_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if goal target is reached
  IF NEW.current_value >= NEW.target_value AND NEW.status = 'active' THEN
    NEW.status = 'completed';
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER goal_completion_check
  BEFORE UPDATE ON public.fitness_goals
  FOR EACH ROW
  WHEN (NEW.current_value IS DISTINCT FROM OLD.current_value)
  EXECUTE FUNCTION check_goal_completion();

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get active goals for user
CREATE OR REPLACE FUNCTION get_active_goals(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  goal_type goal_type,
  target_value DECIMAL,
  current_value DECIMAL,
  unit TEXT,
  exercise_id UUID,
  target_date DATE,
  started_at TIMESTAMPTZ,
  status goal_status,
  progress_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fg.id,
    fg.title,
    fg.description,
    fg.goal_type,
    fg.target_value,
    fg.current_value,
    fg.unit,
    fg.exercise_id,
    fg.target_date,
    fg.started_at,
    fg.status,
    CASE 
      WHEN fg.target_value > 0 THEN 
        ROUND((fg.current_value / fg.target_value * 100)::NUMERIC, 1)
      ELSE 0
    END as progress_percentage
  FROM public.fitness_goals fg
  WHERE fg.user_id = p_user_id
    AND fg.status = 'active'
  ORDER BY fg.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_active_goals(UUID) TO authenticated;

-- Update strength goal progress
CREATE OR REPLACE FUNCTION update_strength_goal_progress(
  p_user_id UUID,
  p_exercise_id UUID
) RETURNS void AS $$
DECLARE
  v_max_weight DECIMAL;
BEGIN
  -- Get max weight for this exercise
  SELECT MAX(weight_kg) INTO v_max_weight
  FROM public.set_logs sl
  JOIN public.workout_sessions ws ON sl.session_id = ws.id
  WHERE ws.user_id = p_user_id
    AND sl.exercise_id = p_exercise_id
    AND ws.completed_at IS NOT NULL;
  
  -- Update all active strength goals for this exercise
  UPDATE public.fitness_goals
  SET current_value = COALESCE(v_max_weight, 0)
  WHERE user_id = p_user_id
    AND exercise_id = p_exercise_id
    AND goal_type = 'strength'
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_strength_goal_progress(UUID, UUID) TO authenticated;

-- Update volume goal progress
CREATE OR REPLACE FUNCTION update_volume_goal_progress(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.fitness_goals fg
  SET current_value = (
    SELECT COALESCE(SUM(ws.total_volume_kg), 0)
    FROM public.workout_sessions ws
    WHERE ws.user_id = p_user_id
      AND ws.completed_at >= fg.started_at
      AND ws.completed_at IS NOT NULL
  )
  WHERE fg.user_id = p_user_id
    AND fg.goal_type = 'volume'
    AND fg.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_volume_goal_progress(UUID) TO authenticated;

-- Update consistency goal progress
CREATE OR REPLACE FUNCTION update_consistency_goal_progress(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.fitness_goals fg
  SET current_value = (
    SELECT COUNT(*)
    FROM public.workout_sessions ws
    WHERE ws.user_id = p_user_id
      AND ws.completed_at >= fg.started_at
      AND ws.completed_at IS NOT NULL
  )
  WHERE fg.user_id = p_user_id
    AND fg.goal_type = 'consistency'
    AND fg.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_consistency_goal_progress(UUID) TO authenticated;
