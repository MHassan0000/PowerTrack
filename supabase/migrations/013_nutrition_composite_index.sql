-- =====================================================
-- Nutrition Logs Composite Index
-- =====================================================
-- Optimizes queries that filter by user_id AND logged_at (date range)
-- Used by getNutritionLogs, copyYesterdaysMeals, and getDailyNutritionSummary

-- Composite index for efficient user + date queries
CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_logged_at_idx 
ON public.nutrition_logs(user_id, logged_at DESC);

-- This replaces the need for separate indexes when queries filter by both columns
-- Query planner will use this composite index for:
-- - WHERE user_id = X AND logged_at >= Y AND logged_at <= Z
-- - Significantly improves performance for daily nutrition queries
