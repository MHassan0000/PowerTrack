'use client'

import { Message } from '@/hooks/useChat'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { FilePreview } from './FilePreview'

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
            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed ${
                    isUser
                        ? 'bg-[#18181B] text-white border border-[#10B981]/30'
                        : 'bg-transparent text-zinc-100 pl-0'
                }`}
            >
                {/* AI specific header */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2 text-[#10B981] font-medium text-xs uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        PowerTrack AI
                    </div>
                )}
                
                <div className="prose prose-invert prose-sm max-w-none">
                    {isUser ? (
                        <p className="whitespace-pre-wrap m-0">{message.content}</p>
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-4 last:mb-0 text-zinc-300">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc ml-4 mb-4 space-y-1 text-zinc-300">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-4 space-y-1 text-zinc-300">{children}</ol>,
                                li: ({ children }) => <li className="pl-1">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                code: ({ children }) => (
                                    <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-[#10B981] text-xs font-mono border border-white/5">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="bg-[#18181B] p-4 rounded-xl overflow-x-auto my-4 border border-zinc-800">
                                        {children}
                                    </pre>
                                ),
                            }}
                        >
                            {message.content || (isLatest ? '...' : '')}
                        </ReactMarkdown>
                    )}
                </div>

                {/* File Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.attachments.map((file, index) => (
                            <FilePreview
                                key={index}
                                fileName={file.fileName}
                                fileType={file.fileType}
                                fileSize={file.fileSize}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
