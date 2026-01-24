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
    const [uploadProgress, setUploadProgress] = useState(0)
    const abortControllerRef = useRef<AbortController | null>(null)
    const streamingContentRef = useRef<string>('')
    const animationFrameRef = useRef<number | null>(null)

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
                        attachments: m.attachments, // Include attachments from API
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
                    attachments: message.attachments, // Include attachments
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
                setUploadProgress(10)
                const formData = new FormData()
                files.forEach(file => formData.append('files', file))

                setUploadProgress(30)
                const uploadResponse = await fetch('/api/chat/upload', {
                    method: 'POST',
                    body: formData,
                })

                setUploadProgress(70)
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json()
                    // Just set error message, don't throw
                    setError(errorData.error || 'Failed to upload files')
                    setUploadProgress(0)
                    return
                }

                const uploadData = await uploadResponse.json()
                uploadedFiles = uploadData.files
                setUploadProgress(100)
                
                // Small delay to show 100% before clearing
                await new Promise(resolve => setTimeout(resolve, 300))
                setUploadProgress(0)
            } catch (err: any) {
                console.error('File upload error:', err)
                setError(err.message || 'Failed to upload files')
                setUploadProgress(0)
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

            // Read streaming response with typewriter animation
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullContent = ''
            let displayedContent = ''

            // Read all chunks first
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                const chunk = decoder.decode(value, { stream: true })
                fullContent += chunk
            }

            // Now display with smooth typewriter effect
            await new Promise<void>((resolve) => {
                let currentIndex = 0
                const typewriterSpeed = 20 // milliseconds per chunk (50 chars/sec)
                
                const typeNextChunk = () => {
                    if (currentIndex < fullContent.length) {
                        // Display 2-3 characters at a time for smoother effect
                        const chunkSize = Math.min(3, fullContent.length - currentIndex)
                        const displayedContent = fullContent.substring(0, currentIndex + chunkSize)
                        currentIndex += chunkSize

                        setMessages(prev => {
                            const updated = [...prev]
                            const lastMessage = updated[updated.length - 1]
                            if (lastMessage && lastMessage.role === 'assistant') {
                                lastMessage.content = displayedContent
                            }
                            return updated
                        })

                        // Continue typing
                        animationFrameRef.current = window.setTimeout(typeNextChunk, typewriterSpeed)
                    } else {
                        // Typing complete
                        animationFrameRef.current = null
                        resolve()
                    }
                }

                // Start typewriter animation
                typeNextChunk()
            })

            // Save AI response to database after animation completes
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
            streamingContentRef.current = ''
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current)
                animationFrameRef.current = null
            }
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
        // Stop typewriter animation
        if (animationFrameRef.current) {
            clearTimeout(animationFrameRef.current)
            animationFrameRef.current = null
        }
    }, [])

    return {
        messages,
        isLoading,
        isLoadingHistory,
        error,
        uploadProgress,
        sendMessage,
        clearChat,
        stopGeneration,
    }
}
