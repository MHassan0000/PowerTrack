'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { FilePreview } from './FilePreview'
import { SUGGESTED_PROMPTS } from '@/lib/ai/prompts'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidFileType } from '@/lib/ai/fileProcessor'

export function ChatInterface() {
    const { messages, isLoading, isLoadingHistory, error, uploadProgress, sendMessage, stopGeneration, clearChat } = useChat()
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [fileError, setFileError] = useState<string | null>(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
        }
    }, [input])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            sendMessage(input, selectedFiles.length > 0 ? selectedFiles : undefined)
            setInput('')
            setSelectedFiles([])
            setFileError(null)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setFileError(null)

        // Validate file count
        if (selectedFiles.length + files.length > 3) {
            setFileError('Maximum 3 files allowed')
            return
        }

        // Validate each file
        for (const file of files) {
            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setFileError(`File "${file.name}" exceeds 5MB limit`)
                return
            }

            // Check file type
            if (!isValidFileType(file.type, file.name)) {
                setFileError(`File type not supported: ${file.name}`)
                return
            }
        }

        setSelectedFiles(prev => [...prev, ...files])
        // Reset input so same file can be selected again
        if (e.target) e.target.value = ''
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
        setFileError(null)
    }

    const handleSuggestedPrompt = (prompt: string) => {
        sendMessage(prompt)
    }

    const handleClearChat = async () => {
        await clearChat()
        setShowClearConfirm(false)
    }

    return (
        <div className="flex flex-col h-full relative font-sans">
            {/* Messages Area */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                    {/* Loading History */}
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {messages.length === 0 ? (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12"
                                >
                                    {/* Title & Description */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-4"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 mb-6">
                                            {/* Abstract Green Logo */}
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M2 17L12 22L22 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M2 12L12 17L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-medium text-white tracking-tight">
                                            How can I help you today?
                                        </h2>
                                    </motion.div>

                                    {/* Suggested Prompts Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                                        {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestedPrompt(prompt)}
                                                className="px-5 py-4 bg-[#18181B] hover:bg-[#27272A] text-left text-[13px] text-zinc-400 hover:text-[#10B981] rounded-xl border border-zinc-800 hover:border-[#10B981]/30 transition-all duration-200"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    {messages.map((message, index) => (
                                        <ChatMessage
                                            key={message.id || index}
                                            message={message}
                                            isLatest={index === messages.length - 1 && isLoading}
                                        />
                                    ))}
                                </>
                            )}
                        </AnimatePresence>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-[#0F0F10]/80 backdrop-blur-lg pt-4 pb-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Clear Chat Button - only show when messages exist */}
                    {messages.length > 0 && !isLoadingHistory && (
                        <div className="mb-3 flex justify-center">
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="text-xs text-zinc-500 hover:text-[#10B981] transition-colors"
                            >
                                Clear Chat History
                            </button>
                        </div>
                    )}

                    {/* File Upload Error */}
                    {fileError && (
                        <div className="mb-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {fileError}
                        </div>
                    )}

                    {/* Upload Progress */}
                    {uploadProgress > 0 && (
                        <div className="mb-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="text-xs text-[#10B981] font-medium">
                                    Uploading files... {uploadProgress}%
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-linear-to-r from-[#10B981] to-[#059669] transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                                <FilePreview
                                    key={index}
                                    fileName={file.name}
                                    fileType={file.type}
                                    fileSize={file.size}
                                    onRemove={() => handleRemoveFile(index)}
                                />
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative flex items-end gap-2 bg-[#18181B] border border-zinc-800 rounded-2xl p-2 focus-within:border-[#10B981]/50 focus-within:ring-1 focus-within:ring-[#10B981]/20 transition-all duration-200">
                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".txt,.md,.csv,.json,.pdf,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* File Upload Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading || uploadProgress > 0 || selectedFiles.length >= 3}
                                className="shrink-0 w-10 h-10 rounded-xl bg-transparent text-zinc-400 hover:text-[#10B981] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
                                title={selectedFiles.length >= 3 ? 'Maximum 3 files' : 'Upload files'}
                            >
                                {/* Paperclip Icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                </svg>
                            </button>
                            
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
                                placeholder={uploadProgress > 0 ? "Uploading files..." : "Message PowerTrack AI..."}
                                rows={1}
                                disabled={uploadProgress > 0}
                                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-zinc-500 focus:outline-none resize-none max-h-30 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent text-[15px] disabled:opacity-50"
                                style={{ minHeight: '44px' }}
                            />
                            
                            {isLoading ? (
                                <button
                                    type="button"
                                    onClick={stopGeneration}
                                    className="shrink-0 w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 transition-colors"
                                >
                                    {/* Stop Icon */}
                                    <div className="w-3 h-3 bg-white rounded-sm" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!input.trim() || uploadProgress > 0}
                                    className="shrink-0 w-10 h-10 rounded-xl bg-[#10B981] disabled:bg-zinc-800 disabled:text-zinc-600 text-black flex items-center justify-center transition-all duration-200"
                                >
                                    {/* Arrow Up Icon */}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 19V5M5 12l7-7 7 7"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>
                    <p className="text-[11px] text-zinc-600 text-center mt-3">
                        AI can make mistakes. Check important info.
                    </p>
                </div>
            </div>

            {/* Clear Chat Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#18181B] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-white mb-2">Clear Chat History?</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            This will permanently delete all your chat messages. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearChat}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
