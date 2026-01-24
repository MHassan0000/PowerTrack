-- =====================================================
-- Chat File Attachments
-- =====================================================
-- Creates storage bucket and table for chat file attachments

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Chat File Attachments Table
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_file_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    extracted_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS chat_file_attachments_message_id_idx 
    ON chat_file_attachments(message_id);

CREATE INDEX IF NOT EXISTS chat_file_attachments_user_id_idx 
    ON chat_file_attachments(user_id);

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE chat_file_attachments ENABLE ROW LEVEL SECURITY;

-- Users can view their own file attachments
CREATE POLICY "Users can view own file attachments"
    ON chat_file_attachments FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own file attachments
CREATE POLICY "Users can insert own file attachments"
    ON chat_file_attachments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own file attachments
CREATE POLICY "Users can delete own file attachments"
    ON chat_file_attachments FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Storage Policies
-- =====================================================

-- Users can upload their own files
CREATE POLICY "Users can upload own chat files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-attachments' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own files
CREATE POLICY "Users can view own chat files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
CREATE POLICY "Users can delete own chat files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE chat_file_attachments IS 'Stores metadata for files attached to chat messages';
COMMENT ON COLUMN chat_file_attachments.extracted_content IS 'Text content extracted from file for AI processing';
