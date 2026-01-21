-- =============================================
-- Progress Tracking System
-- Migration: 006_progress_tracking.sql
-- Tables: body_stats, Views: personal_records
-- =============================================

-- =============================================
-- BODY STATS TABLE
-- =============================================
CREATE TABLE public.body_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Measurements
  weight_kg DECIMAL(5,2) NOT NULL,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX body_stats_user_id_idx ON public.body_stats(user_id);
CREATE INDEX body_stats_measured_at_idx ON public.body_stats(measured_at DESC);

-- Unique constraint: one entry per user per day
CREATE UNIQUE INDEX body_stats_user_date_idx 
  ON public.body_stats(user_id, measured_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================
ALTER TABLE public.body_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own body stats
CREATE POLICY "Users can view own body stats"
  ON public.body_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own body stats
CREATE POLICY "Users can insert own body stats"
  ON public.body_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own body stats
CREATE POLICY "Users can update own body stats"
  ON public.body_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own body stats
CREATE POLICY "Users can delete own body stats"
  ON public.body_stats FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- PERSONAL RECORDS VIEW
-- =============================================

-- Drop view if exists
DROP VIEW IF EXISTS public.personal_records;

-- Create view for personal records
CREATE VIEW public.personal_records AS
SELECT 
  sl.exercise_id,
  ws.user_id,
  e.name as exercise_name,
  e.primary_muscle,
  e.equipment,
  MAX(sl.weight_kg * COALESCE(sl.reps, 1)) as pr_volume,
  MAX(sl.weight_kg) as pr_weight,
  MAX(sl.reps) as pr_reps,
  MAX(ws.completed_at) as achieved_at
FROM public.set_logs sl
JOIN public.workout_sessions ws ON sl.session_id = ws.id
JOIN public.exercise_library e ON sl.exercise_id = e.id
WHERE ws.completed_at IS NOT NULL
  AND sl.weight_kg IS NOT NULL
GROUP BY sl.exercise_id, ws.user_id, e.name, e.primary_muscle, e.equipment;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update updated_at timestamp on body_stats
CREATE OR REPLACE FUNCTION update_body_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER body_stats_updated_at
  BEFORE UPDATE ON public.body_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_body_stats_updated_at();

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to get user's PRs
CREATE OR REPLACE FUNCTION get_user_personal_records(p_user_id UUID)
RETURNS TABLE (
  exercise_id UUID,
  exercise_name TEXT,
  primary_muscle TEXT,
  equipment TEXT,
  pr_volume DECIMAL,
  pr_weight DECIMAL,
  pr_reps INTEGER,
  achieved_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.exercise_id,
    pr.exercise_name,
    pr.primary_muscle,
    pr.equipment,
    pr.pr_volume,
    pr.pr_weight,
    pr.pr_reps::INTEGER,
    pr.achieved_at
  FROM public.personal_records pr
  WHERE pr.user_id = p_user_id
  ORDER BY pr.achieved_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_user_personal_records(UUID) TO authenticated;

-- Function to get volume chart data
CREATE OR REPLACE FUNCTION get_volume_chart_data(p_user_id UUID, p_days INTEGER DEFAULT 90)
RETURNS TABLE (
  workout_date DATE,
  workout_name TEXT,
  total_volume DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.completed_at::DATE as workout_date,
    ws.workout_name,
    ws.total_volume_kg as total_volume
  FROM public.workout_sessions ws
  WHERE ws.user_id = p_user_id
    AND ws.completed_at IS NOT NULL
    AND ws.completed_at >= NOW() - (p_days || ' days')::INTERVAL
  ORDER BY ws.completed_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_volume_chart_data(UUID, INTEGER) TO authenticated;

-- Function to get exercise weight progress
CREATE OR REPLACE FUNCTION get_exercise_weight_progress(p_user_id UUID, p_exercise_id UUID)
RETURNS TABLE (
  workout_date DATE,
  max_weight DECIMAL,
  max_reps INTEGER,
  max_volume DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.completed_at::DATE as workout_date,
    MAX(sl.weight_kg) as max_weight,
    MAX(sl.reps) as max_reps,
    MAX(sl.weight_kg * COALESCE(sl.reps, 1)) as max_volume
  FROM public.set_logs sl
  JOIN public.workout_sessions ws ON sl.session_id = ws.id
  WHERE ws.user_id = p_user_id
    AND sl.exercise_id = p_exercise_id
    AND ws.completed_at IS NOT NULL
    AND sl.weight_kg IS NOT NULL
  GROUP BY ws.completed_at::DATE
  ORDER BY ws.completed_at::DATE ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_exercise_weight_progress(UUID, UUID) TO authenticated;
