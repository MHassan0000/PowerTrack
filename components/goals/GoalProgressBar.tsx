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
            <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                    {current.toFixed(1)}{unit}
                </span>
                <span className="text-zinc-500 font-medium">
                    Target: {target}{unit}
                </span>
            </div>

            {/* Progress Track */}
            <div className="relative h-2 bg-[#27272A] rounded-full overflow-hidden">
                <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${isComplete
                        ? 'bg-[#10B981]'
                        : isNearComplete
                            ? 'bg-[#34D399]'
                            : 'bg-[#10B981]'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Shine effect (Subtle) */}
                <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
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
                <span className={`text-xs font-bold ${isComplete ? 'text-[#10B981]' : 'text-zinc-400'
                    }`}>
                    {progress.toFixed(0)}%
                </span>
            </div>
        </div>
    )
}
