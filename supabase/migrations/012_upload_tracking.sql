-- =====================================================
-- Upload Tracking for Daily Limits
-- =====================================================

CREATE TABLE IF NOT EXISTS upload_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    upload_date DATE DEFAULT CURRENT_DATE NOT NULL,
    upload_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, upload_date)
);

-- Create index for fast queries
CREATE INDEX IF NOT EXISTS upload_tracking_user_date_idx 
    ON upload_tracking(user_id, upload_date DESC);

-- Enable Row Level Security
ALTER TABLE upload_tracking ENABLE ROW LEVEL SECURITY;

-- Users can view their own upload tracking
CREATE POLICY "Users can view own upload tracking"
    ON upload_tracking FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own upload tracking
CREATE POLICY "Users can insert own upload tracking"
    ON upload_tracking FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own upload tracking
CREATE POLICY "Users can update own upload tracking"
    ON upload_tracking FOR UPDATE
    USING (auth.uid() = user_id);

COMMENT ON TABLE upload_tracking IS 'Tracks daily file upload counts per user';
