'use client'

import { useState, useRef, useCallback } from 'react'

export interface Message {
    role: 'user' | 'assistant'
    content: string
    id?: string
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return

        const userMessage: Message = {
            role: 'user',
            content: content.trim(),
            id: Date.now().toString(),
        }

        // Add user message
        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)
        setError(null)

        // Create AI message placeholder
        const aiMessage: Message = {
            role: 'assistant',
            content: '',
            id: (Date.now() + 1).toString(),
        }

        setMessages(prev => [...prev, aiMessage])

        try {
            // Create abort controller for this request
            abortControllerRef.current = new AbortController()

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
                signal: abortControllerRef.current.signal,
            })

            if (!response.ok) {
                throw new Error('Failed to get response from AI')
            }

            if (!response.body) {
                throw new Error('No response body')
            }

            // Read streaming response
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                
                // Update AI message with streamed content
                setMessages(prev => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage.role === 'assistant') {
                        lastMessage.content += chunk
                    }
                    return updated
                })
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Request aborted')
            } else {
                console.error('Chat error:', err)
                setError(err.message || 'Failed to send message')
                // Remove the placeholder AI message on error
                setMessages(prev => prev.slice(0, -1))
            }
        } finally {
            setIsLoading(false)
            abortControllerRef.current = null
        }
    }, [messages, isLoading])

    const clearChat = useCallback(() => {
        setMessages([])
        setError(null)
    }, [])

    const stopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        stopGeneration,
    }
}
