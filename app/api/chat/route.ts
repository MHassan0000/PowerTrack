import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { getUserContext, formatContextForAI } from '@/lib/ai/context'
import { getSystemPrompt } from '@/lib/ai/prompts'

export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        // Auth check
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request
        const { messages } = await req.json()

        if (!messages || !Array.isArray(messages)) {
            return Response.json({ error: 'Invalid messages format' }, { status: 400 })
        }

        // Check API key
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY not configured')
            return Response.json({ error: 'AI service not configured' }, { status: 500 })
        }

        // Get user context
        const context = await getUserContext(user.id)
        const formattedContext = formatContextForAI(context)

        // Create OpenRouter client
        const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'X-Title': 'PowerTrack Fitness App',
            },
        })

        // Create chat completion with streaming
        const stream = await openai.chat.completions.create({
            model: 'anthropic/claude-3-haiku', // Fast and affordable for development
            messages: [
                {
                    role: 'system',
                    content: getSystemPrompt(formattedContext),
                },
                ...messages,
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 1000,
        })

        // Convert OpenAI stream to ReadableStream
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content
                        if (content) {
                            controller.enqueue(encoder.encode(content))
                        }
                    }
                    controller.close()
                } catch (error) {
                    console.error('Streaming error:', error)
                    controller.error(error)
                }
            },
        })

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        })
    } catch (error) {
        console.error('Chat API error:', error)
        return Response.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        )
    }
}
