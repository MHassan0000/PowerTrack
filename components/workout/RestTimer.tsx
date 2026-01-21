'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, SkipForward } from 'lucide-react'

interface RestTimerProps {
    duration: number // seconds
    onComplete: () => void
    onSkip: () => void
}

export function RestTimer({ duration, onComplete, onSkip }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration)
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return

        const endTime = Date.now() + timeLeft * 1000
        const interval = setInterval(() => {
            const remaining = Math.ceil((endTime - Date.now()) / 1000)

            if (remaining <= 0) {
                setTimeLeft(0)
                setIsActive(false)
                onComplete()
                // Play sound (if supported)
                try {
                    const audio = new Audio('/notification.mp3')
                    audio.play().catch(() => { })
                } catch { }
            } else {
                setTimeLeft(remaining)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [timeLeft, isActive, onComplete])

    const addTime = (seconds: number) => {
        setTimeLeft(prev => prev + seconds)
        setIsActive(true)
    }

    const progress = ((duration - timeLeft) / duration) * 100

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-[rgb(var(--card))] rounded-3xl p-8 glow-border w-full max-w-md"
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-6 h-6 text-[rgb(var(--primary))]" />
                        <h3 className="text-xl font-bold">Rest Timer</h3>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-64 h-64 mx-auto mb-8">
                        <svg className="w-full h-full -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                fill="none"
                                stroke="rgb(var(--border))"
                                strokeWidth="8"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                fill="none"
                                stroke="rgb(var(--primary))"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 120}`}
                                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                            />
                        </svg>

                        {/* Time Display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl font-bold glow-text mb-2">
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-sm text-[rgb(var(--foreground-muted))]">
                                    {timeLeft === 0 ? 'Ready!' : 'Rest time'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => addTime(15)}
                            className="flex-1 min-h-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center gap-2 font-medium"
                            type="button"
                        >
                            <Plus className="w-4 h-4" />
                            <span>15s</span>
                        </button>
                        <button
                            onClick={() => addTime(30)}
                            className="flex-1 min-h-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center gap-2 font-medium"
                            type="button"
                        >
                            <Plus className="w-4 h-4" />
                            <span>30s</span>
                        </button>
                        <button
                            onClick={() => addTime(60)}
                            className="flex-1 min-h-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center gap-2 font-medium"
                            type="button"
                        >
                            <Plus className="w-4 h-4" />
                            <span>1m</span>
                        </button>
                    </div>

                    {/* Skip Button */}
                    <button
                        onClick={onSkip}
                        className="w-full min-h-14 rounded-lg bg-[rgb(var(--primary))] text-[rgb(var(--background))] hover:bg-[rgb(var(--primary-hover))] transition-colors font-bold shadow-lg shadow-[rgb(var(--primary))]/30 flex items-center justify-center gap-2"
                        type="button"
                    >
                        <SkipForward className="w-5 h-5" />
                        <span>Skip Rest</span>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
