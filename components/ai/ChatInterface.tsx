'use client'

import { useRef, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { SUGGESTED_PROMPTS } from '@/lib/ai/prompts'
import { motion, AnimatePresence } from 'framer-motion'

export function ChatInterface() {
    const { messages, isLoading, error, sendMessage } = useChat()
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            sendMessage(input)
            setInput('')
        }
    }

    const handleSuggestedPrompt = (prompt: string) => {
        setInput(prompt)
        inputRef.current?.focus()
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <AnimatePresence>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Your AI Fitness Coach
                                </h2>
                                <p className="text-zinc-400">
                                    Get personalized workout plans, form tips, and nutrition advice
                                </p>
                            </div>

                            {/* Suggested Prompts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl">
                                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestedPrompt(prompt)}
                                        className="px-4 py-3 bg-[#27272A] hover:bg-[#3F3F46] text-left text-sm text-zinc-300 rounded-xl border border-white/5 transition-all hover:border-[#10B981]/30"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        messages.map((message, index) => (
                            <ChatMessage
                                key={message.id || index}
                                message={message}
                                isLatest={index === messages.length - 1 && isLoading}
                            />
                        ))
                    )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/5 bg-[#18181B] p-4">
                <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit(e)
                                }
                            }}
                            placeholder="Ask me anything about fitness, workouts, or nutrition..."
                            rows={1}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 resize-none transition-all"
                            style={{ minHeight: '52px', maxHeight: '120px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="px-5 py-3 bg-[#10B981] hover:bg-[#10B981]/90 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

// Add missing import
import { useState } from 'react'
