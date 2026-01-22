'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    iconBg: 'bg-red-500/10',
                    button: 'bg-red-500 hover:bg-red-600 text-white'
                }
            case 'warning':
                return {
                    icon: 'text-orange-500',
                    iconBg: 'bg-orange-500/10',
                    button: 'bg-orange-500 hover:bg-orange-600 text-white'
                }
            case 'info':
            default:
                return {
                    icon: 'text-[#10B981]',
                    iconBg: 'bg-[#10B981]/10',
                    button: 'bg-[#10B981] hover:bg-[#059669] text-black'
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md bg-[#18181B] rounded-3xl border border-white/10 overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Content */}
                            <div className="p-8">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl ${styles.iconBg} flex items-center justify-center mx-auto mb-6`}>
                                    <AlertTriangle className={`w-8 h-8 ${styles.icon}`} />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-white text-center mb-3">
                                    {title}
                                </h2>

                                {/* Message */}
                                <p className="text-zinc-400 text-center mb-8">
                                    {message}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className={`flex-1 py-3.5 ${styles.button} font-bold rounded-xl transition-colors`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
