import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/security/rateLimit'
import { processFile, isValidFileType } from '@/lib/ai/fileProcessor'

export const runtime = 'edge'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 3

export async function POST(req: Request) {
    try {
        // 1. Authenticate user
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. Check daily upload limit (1 upload per day)
        const today = new Date().toISOString().split('T')[0]
        
        const { data: uploadRecord } = await supabase
            .from('upload_tracking')
            .select('*')
            .eq('user_id', user.id)
            .eq('upload_date', today)
            .single()

        if (uploadRecord && uploadRecord.upload_count >= 1) {
            return Response.json(
                { error: 'Daily upload limit reached. You can upload files again tomorrow.' },
                { status: 429 }
            )
        }

        // 3. Rate limiting (5 uploads per minute for spam prevention)
        const rateLimitPassed = checkRateLimit(`upload:${user.id}`, 5, 60000)
        
        if (!rateLimitPassed) {
            return Response.json(
                { error: 'Too many upload attempts. Please wait a minute.' },
                { status: 429 }
            )
        }

        // 4. Parse form data
        const formData = await req.formData()
        const files = formData.getAll('files') as File[]

        // 5. Validate file count
        if (files.length === 0) {
            return Response.json(
                { error: 'No files provided' },
                { status: 400 }
            )
        }

        if (files.length > MAX_FILES) {
            return Response.json(
                { error: `Maximum ${MAX_FILES} files allowed per upload` },
                { status: 400 }
            )
        }

        // 6. Validate and process each file
        const processedFiles = []
        const uploadedFiles = []

        for (const file of files) {
            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                return Response.json(
                    { error: `File "${file.name}" exceeds 5MB limit` },
                    { status: 400 }
                )
            }

            // Validate file type
            if (!isValidFileType(file.type, file.name)) {
                return Response.json(
                    { error: `File type not supported: ${file.name}` },
                    { status: 400 }
                )
            }

            // Process file to extract content
            const processed = await processFile(file)
            processedFiles.push(processed)

            // Upload to Supabase storage
            const timestamp = Date.now()
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
            const storagePath = `${user.id}/${timestamp}_${sanitizedFileName}`

            const arrayBuffer = await file.arrayBuffer()
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('chat-attachments')
                .upload(storagePath, arrayBuffer, {
                    contentType: file.type,
                    upsert: false,
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                return Response.json(
                    { error: `Failed to upload file: ${file.name}` },
                    { status: 500 }
                )
            }

            // Get public URL (will be protected by RLS)
            const { data: { publicUrl } } = supabase.storage
                .from('chat-attachments')
                .getPublicUrl(storagePath)

            uploadedFiles.push({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                storagePath,
                publicUrl,
                extractedContent: processed.extractedContent,
                contentType: processed.contentType,
            })
        }

        // 7. Update daily upload tracking
        if (uploadRecord) {
            await supabase
                .from('upload_tracking')
                .update({ 
                    upload_count: uploadRecord.upload_count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('id', uploadRecord.id)
        } else {
            await supabase
                .from('upload_tracking')
                .insert({
                    user_id: user.id,
                    upload_date: today,
                    upload_count: 1
                })
        }

        // 8. Return processed files
        return Response.json(
            { 
                success: true,
                files: uploadedFiles,
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('File upload error:', error)
        return Response.json(
            { error: 'Failed to upload files' },
            { status: 500 }
        )
    }
}
