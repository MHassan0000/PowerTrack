'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center p-8 rounded-2xl glow-border bg-[rgb(var(--card))] backdrop-blur-xl",
                className
            )}
        >
            {Icon && (
                <div className="w-16 h-16 rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-[rgb(var(--primary))]" />
                </div>
            )}

            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-[rgb(var(--foreground-muted))] max-w-sm mb-6">
                {description}
            </p>

            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </motion.div>
    )
}
