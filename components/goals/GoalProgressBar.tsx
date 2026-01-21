'use client'

import { motion } from 'framer-motion'

interface GoalProgressBarProps {
    current: number
    target: number
    unit: string
}

export function GoalProgressBar({ current, target, unit }: GoalProgressBarProps) {
    const progress = Math.min((current / target) * 100, 100)
    const isNearComplete = progress >= 75
    const isComplete = progress >= 100

    return (
        <div className="space-y-2">
            {/* Labels */}
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                    {current.toFixed(1)}{unit}
                </span>
                <span className="text-[rgb(var(--foreground-muted))]">
                    Target: {target}{unit}
                </span>
            </div>

            {/* Progress Track */}
            <div className="relative h-3 bg-[rgb(var(--background-secondary))] rounded-full overflow-hidden">
                <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${isComplete
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : isNearComplete
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                : 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))]'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{
                        duration: 2,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatDelay: 3,
                    }}
                />
            </div>

            {/* Percentage */}
            <div className="text-right">
                <span className={`text-sm font-bold ${isComplete ? 'text-green-500' : 'text-[rgb(var(--primary))]'
                    }`}>
                    {progress.toFixed(0)}%
                </span>
            </div>
        </div>
    )
}
