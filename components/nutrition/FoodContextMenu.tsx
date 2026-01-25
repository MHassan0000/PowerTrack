'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy } from 'lucide-react'

interface FoodContextMenuProps {
    isOpen: boolean
    position: { x: number; y: number }
    onClose: () => void
    onLogAgain: () => void
}

export function FoodContextMenu({ isOpen, position, onClose, onLogAgain }: FoodContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 bg-[#18181B] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            >
                <button
                    onClick={() => {
                        onLogAgain()
                        onClose()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#27272A] transition-colors"
                >
                    <Copy className="w-4 h-4 text-[#10B981]" />
                    <span className="font-medium">Log again today</span>
                </button>
            </motion.div>
        </AnimatePresence>
    )
}
