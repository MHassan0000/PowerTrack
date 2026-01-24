'use client'

import { Message } from '@/hooks/useChat'
import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
    message: Message
    isLatest?: boolean
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
    const isUser = message.role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isUser ? 'bg-[#10B981]' : 'bg-purple-500/20'
            }`}>
                {isUser ? (
                    <User className="w-5 h-5 text-black" />
                ) : (
                    <Sparkles className="w-5 h-5 text-purple-400" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                    isUser
                        ? 'bg-[#10B981] text-black'
                        : 'bg-[#27272A] text-white border border-white/5'
                }`}>
                    {isUser ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                    code: ({ children }) => (
                                        <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-purple-400 text-xs">
                                            {children}
                                        </code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-zinc-900 p-3 rounded-lg overflow-x-auto my-2">
                                            {children}
                                        </pre>
                                    ),
                                }}
                            >
                                {message.content || (isLatest ? '...' : '')}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
