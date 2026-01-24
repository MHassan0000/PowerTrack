import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

/**
 * GET - Fetch chat history for authenticated user
 * Returns last 50 messages ordered by creation time
 */
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user's chat history (last 50 messages)
        const { data, error } = await supabase
            .from('chat_messages')
            .select('id, role, content, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(50)

        if (error) {
            console.error('Error fetching chat history:', error)
            return Response.json({ error: 'Failed to fetch history' }, { status: 500 })
        }

        return Response.json({ messages: data || [] })
    } catch (error) {
        console.error('Chat history error:', error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}

/**
 * POST - Save a new message to chat history
 */
export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { role, content } = await req.json()

        // Validate input
        if (!role || !content || !['user', 'assistant'].includes(role)) {
            return Response.json({ error: 'Invalid message data' }, { status: 400 })
        }

        // Save message
        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                user_id: user.id,
                role,
                content,
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving message:', error)
            return Response.json({ error: 'Failed to save message' }, { status: 500 })
        }

        return Response.json({ message: data })
    } catch (error) {
        console.error('Save message error:', error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}

/**
 * DELETE - Clear all chat history for authenticated user
 */
export async function DELETE() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Delete all user's messages
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('user_id', user.id)

        if (error) {
            console.error('Error clearing chat history:', error)
            return Response.json({ error: 'Failed to clear history' }, { status: 500 })
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error('Clear history error:', error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}
