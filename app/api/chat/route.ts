import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { getUserContext, formatContextForAI } from '@/lib/ai/context'
import { getSystemPrompt } from '@/lib/ai/prompts'
import { checkRateLimit, getRemainingRequests } from '@/lib/security/rateLimit'
import { validateMessageArray } from '@/lib/security/validation'

export const runtime = 'edge'

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

        // 2. Rate limiting (10 requests per minute per user)
        const rateLimitPassed = checkRateLimit(user.id, 10, 60000)
        const remaining = getRemainingRequests(user.id, 10)

        if (!rateLimitPassed) {
            return Response.json(
                { 
                    error: 'Rate limit exceeded. Please wait a minute before trying again.',
                    retryAfter: 60 
                },
                { 
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '10',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
                    }
                }
            )
        }

        // 3. Parse and validate request body
        let body: any
        try {
            body = await req.json()
        } catch (error) {
            return Response.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            )
        }

        const { messages } = body

        // 4. Validate messages array
        const validation = validateMessageArray(messages)
        if (!validation.valid) {
            return Response.json(
                { error: validation.error || 'Invalid message format' },
                { status: 400 }
            )
        }

        // 5. Verify API key is configured (server-side only - never exposed to client)
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY not configured')
            return Response.json(
                { error: 'AI service temporarily unavailable' },
                { status: 503 }
            )
        }

        // 6. Get user context for personalization
        const context = await getUserContext(user.id)
        const formattedContext = formatContextForAI(context)

        // 7. Initialize OpenAI client with OpenRouter
        // API key is only used server-side, never sent to client
        const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
                'X-Title': 'PowerTrack AI Coach',
            },
        })

        // 8. Create streaming chat completion
        const stream = await openai.chat.completions.create({
            model: 'anthropic/claude-3-haiku',
            messages: [
                {
                    role: 'system',
                    content: getSystemPrompt(formattedContext),
                },
                ...messages.map((m: any) => ({
                    role: m.role,
                    content: m.content,
                })),
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 1000,
        })

        // 9. Stream response to client
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.choices[0]?.delta?.content || ''
                        if (text) {
                            controller.enqueue(encoder.encode(text))
                        }
                    }
                    controller.close()
                } catch (error) {
                    console.error('Streaming error:', error)
                    controller.error(error)
                }
            },
        })

        // 10. Return streaming response with security headers
        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'X-Content-Type-Options': 'nosniff',
                'X-RateLimit-Limit': '10',
                'X-RateLimit-Remaining': remaining.toString(),
            },
        })
    } catch (error) {
        // Log error server-side but don't expose details to client
        console.error('Chat API error:', error)
        
        // Return generic error message (security best practice)
        return Response.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
