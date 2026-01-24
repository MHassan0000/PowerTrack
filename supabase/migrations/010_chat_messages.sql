-- Create chat_messages table for AI chat history
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for fast user queries (most recent first)
CREATE INDEX IF NOT EXISTS chat_messages_user_id_created_at_idx 
    ON chat_messages(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own messages
CREATE POLICY "Users can view own chat messages"
    ON chat_messages FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert their own messages
CREATE POLICY "Users can insert own chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own messages
CREATE POLICY "Users can delete own chat messages"
    ON chat_messages FOR DELETE
    USING (auth.uid() = user_id);

-- Comment for documentation
COMMENT ON TABLE chat_messages IS 'Stores AI chat conversation history for each user';
COMMENT ON COLUMN chat_messages.role IS 'Message sender: user or assistant';
COMMENT ON COLUMN chat_messages.content IS 'Message text content';
