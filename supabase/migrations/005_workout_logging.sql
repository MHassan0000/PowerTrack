-- =============================================
-- Workout Logging System
-- Migration: 005_workout_logging.sql
-- Tables: workout_sessions, set_logs
-- =============================================

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS public.set_logs CASCADE;
DROP TABLE IF EXISTS public.workout_sessions CASCADE;

-- =============================================
-- WORKOUT SESSIONS TABLE
-- =============================================
CREATE TABLE public.workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  
  -- Session metadata
  workout_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  -- Session stats (calculated on completion)
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  total_volume_kg DECIMAL(10,2) DEFAULT 0,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX workout_sessions_user_id_idx ON public.workout_sessions(user_id);
CREATE INDEX workout_sessions_completed_at_idx ON public.workout_sessions(completed_at);
CREATE INDEX workout_sessions_started_at_idx ON public.workout_sessions(started_at DESC);
CREATE INDEX workout_sessions_workout_id_idx ON public.workout_sessions(workout_id);

-- =============================================
-- SET LOGS TABLE
-- =============================================
CREATE TABLE public.set_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercise_library(id) ON DELETE CASCADE,
  
  -- Set data
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  
  -- Performance metrics
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  is_warmup BOOLEAN DEFAULT false,
  is_failure BOOLEAN DEFAULT false,
  
  -- Metadata
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX set_logs_session_id_idx ON public.set_logs(session_id);
CREATE INDEX set_logs_exercise_id_idx ON public.set_logs(exercise_id);
CREATE INDEX set_logs_logged_at_idx ON public.set_logs(logged_at DESC);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on workout_sessions
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own sessions" ON public.workout_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.workout_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.workout_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.workout_sessions;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON public.workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON public.workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON public.workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on set_logs
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view sets from own sessions" ON public.set_logs;
DROP POLICY IF EXISTS "Users can insert sets in own sessions" ON public.set_logs;
DROP POLICY IF EXISTS "Users can update sets in own sessions" ON public.set_logs;
DROP POLICY IF EXISTS "Users can delete sets from own sessions" ON public.set_logs;

-- Users can view sets from their own sessions
CREATE POLICY "Users can view sets from own sessions"
  ON public.set_logs FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can insert sets in their own sessions
CREATE POLICY "Users can insert sets in own sessions"
  ON public.set_logs FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can update sets in their own sessions
CREATE POLICY "Users can update sets in own sessions"
  ON public.set_logs FOR UPDATE
  USING (
    session_id IN (
      SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can delete sets from their own sessions
CREATE POLICY "Users can delete sets from own sessions"
  ON public.set_logs FOR DELETE
  USING (
    session_id IN (
      SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- TRIGGERS
-- =============================================

-- Update updated_at timestamp on workout_sessions
CREATE OR REPLACE FUNCTION update_workout_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workout_sessions_updated_at
  BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_workout_session_updated_at();

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to calculate session statistics
CREATE OR REPLACE FUNCTION calculate_session_stats(p_session_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.workout_sessions
  SET 
    total_sets = (
      SELECT COUNT(*) FROM public.set_logs WHERE session_id = p_session_id
    ),
    total_reps = (
      SELECT COALESCE(SUM(reps), 0) FROM public.set_logs WHERE session_id = p_session_id
    ),
    total_volume_kg = (
      SELECT COALESCE(SUM(weight_kg * reps), 0) 
      FROM public.set_logs 
      WHERE session_id = p_session_id AND weight_kg IS NOT NULL AND reps IS NOT NULL
    )
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION calculate_session_stats(UUID) TO authenticated;
