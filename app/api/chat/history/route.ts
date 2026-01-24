import { createClient } from '@/lib/supabase/server'
import { validateChatMessage, validateRole } from '@/lib/security/validation'

export const runtime = 'edge'

/**
 * GET - Fetch chat history for authenticated user
 * Returns last 50 messages ordered by creation time
 */
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user's chat history with file attachments (last 50 messages)
        const { data, error } = await supabase
            .from('chat_messages')
            .select(`
                id, 
                role, 
                content, 
                created_at,
                chat_file_attachments(
                    id,
                    file_name,
                    file_type,
                    file_size,
                    storage_path,
                    extracted_content
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(50)

        if (error) {
            console.error('Error fetching chat history:', error)
            return Response.json(
                { error: 'Failed to fetch chat history' },
                { status: 500 }
            )
        }

        // Transform data to include file URLs
        const messagesWithAttachments = await Promise.all((data || []).map(async (msg: any) => {
            const attachments = msg.chat_file_attachments || []
            
            // Get public URLs for each attachment
            const attachmentsWithUrls = attachments.map((file: any) => {
                const { data: { publicUrl } } = supabase.storage
                    .from('chat-attachments')
                    .getPublicUrl(file.storage_path)
                
                return {
                    fileName: file.file_name,
                    fileType: file.file_type,
                    fileSize: file.file_size,
                    storagePath: file.storage_path,
                    publicUrl,
                    extractedContent: file.extracted_content,
                }
            })

            return {
                id: msg.id,
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at,
                attachments: attachmentsWithUrls.length > 0 ? attachmentsWithUrls : undefined,
            }
        }))

        return Response.json(
            { messages: messagesWithAttachments },
            {
                headers: {
                    'Cache-Control': 'private, no-cache',
                    'X-Content-Type-Options': 'nosniff',
                },
            }
        )
    } catch (error) {
        console.error('Chat history error:', error)
        return Response.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}

/**
 * POST - Save a new message to chat history
 */
export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        let body: any
        try {
            body = await req.json()
        } catch (error) {
            return Response.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            )
        }

        const { role, content, attachments } = body

        // Validate role
        const roleValidation = validateRole(role)
        if (!roleValidation.valid) {
            return Response.json(
                { error: roleValidation.error },
                { status: 400 }
            )
        }

        // Validate content
        const contentValidation = validateChatMessage(content)
        if (!contentValidation.valid) {
            return Response.json(
                { error: contentValidation.error },
                { status: 400 }
            )
        }

        // Save message to database
        const { data: savedMessage, error } = await supabase
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
            return Response.json(
                { error: 'Failed to save message' },
                { status: 500 }
            )
        }

        // Save file attachments if present
        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            const attachmentRecords = attachments.map((file: any) => ({
                message_id: savedMessage.id,
                user_id: user.id,
                file_name: file.fileName,
                file_type: file.fileType,
                file_size: file.fileSize,
                storage_path: file.storagePath,
                extracted_content: file.extractedContent,
            }))

            const { error: attachmentError } = await supabase
                .from('chat_file_attachments')
                .insert(attachmentRecords)

            if (attachmentError) {
                console.error('Error saving file attachments:', attachmentError)
                // Don't fail the whole request, message is already saved
            }
        }

        return Response.json({ message: savedMessage })
    } catch (error) {
        console.error('Save message error:', error)
        return Response.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}

/**
 * DELETE - Clear all chat history for authenticated user
 */
export async function DELETE() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get all file attachments for this user to delete from storage
        const { data: attachments } = await supabase
            .from('chat_file_attachments')
            .select('storage_path')
            .eq('user_id', user.id)

        // Delete files from storage
        if (attachments && attachments.length > 0) {
            const paths = attachments.map((a: any) => a.storage_path)
            const { error: storageError } = await supabase.storage
                .from('chat-attachments')
                .remove(paths)

            if (storageError) {
                console.error('Error deleting files from storage:', storageError)
                // Continue with deletion even if storage cleanup fails
            }
        }

        // Delete all file attachments records
        await supabase
            .from('chat_file_attachments')
            .delete()
            .eq('user_id', user.id)

        // Delete all user's messages (cascade will handle attachments table)
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('user_id', user.id)

        if (error) {
            console.error('Error clearing chat history:', error)
            return Response.json(
                { error: 'Failed to clear chat history' },
                { status: 500 }
            )
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error('Clear history error:', error)
        return Response.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}
