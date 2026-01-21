'use client'

import { motion } from 'framer-motion'

interface FadeInProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
