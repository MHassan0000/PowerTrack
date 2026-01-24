'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export interface FileAttachment {
    fileName: string
    fileType: string
    fileSize: number
    storagePath: string
    publicUrl: string
    extractedContent?: string
    contentType?: string
}

export interface Message {
    role: 'user' | 'assistant'
    content: string
    id?: string
    attachments?: FileAttachment[]
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Load chat history on mount
    useEffect(() => {
        async function loadHistory() {
            try {
                const response = await fetch('/api/chat/history')
                if (response.ok) {
                    const { messages: history } = await response.json()
                    setMessages(history.map((m: any) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                    })))
                }
            } catch (error) {
                console.error('Failed to load chat history:', error)
            } finally {
                setIsLoadingHistory(false)
            }
        }

        loadHistory()
    }, [])

    // Save message to database
    const saveMessage = useCallback(async (message: Message) => {
        try {
            await fetch('/api/chat/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: message.role,
                    content: message.content,
                }),
            })
        } catch (error) {
            console.error('Failed to save message:', error)
        }
    }, [])

    const sendMessage = useCallback(async (content: string, files?: File[]) => {
        if (!content.trim() || isLoading) return

        let uploadedFiles: FileAttachment[] = []

        // Upload files first if provided
        if (files && files.length > 0) {
            try {
                const formData = new FormData()
                files.forEach(file => formData.append('files', file))

                const uploadResponse = await fetch('/api/chat/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json()
                    throw new Error(errorData.error || 'Failed to upload files')
                }

                const uploadData = await uploadResponse.json()
                uploadedFiles = uploadData.files
            } catch (err: any) {
                console.error('File upload error:', err)
                setError(err.message || 'Failed to upload files')
                return
            }
        }

        const userMessage: Message = {
            role: 'user',
            content: content.trim(),
            id: Date.now().toString(),
            attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        }

        // Add user message to UI
        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)
        setError(null)

        // Save user message to database
        await saveMessage(userMessage)

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
                    attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
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
            let fullContent = ''

            while (true) {
                const { done, value } = await reader.read()
                
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                fullContent += chunk
                
                // Update AI message with streamed content
                setMessages(prev => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage.role === 'assistant') {
                        lastMessage.content = fullContent
                    }
                    return updated
                })
            }

            // Save AI response to database after streaming completes
            if (fullContent) {
                await saveMessage({
                    role: 'assistant',
                    content: fullContent,
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
    }, [messages, isLoading, saveMessage])

    const clearChat = useCallback(async () => {
        try {
            const response = await fetch('/api/chat/history', { method: 'DELETE' })
            if (response.ok) {
                setMessages([])
                setError(null)
            }
        } catch (error) {
            console.error('Failed to clear chat:', error)
            setError('Failed to clear chat history')
        }
    }, [])

    const stopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    return {
        messages,
        isLoading,
        isLoadingHistory,
        error,
        sendMessage,
        clearChat,
        stopGeneration,
    }
}
