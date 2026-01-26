'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Pause, Play } from 'lucide-react'

interface DurationCounterProps {
    startedAt: string // ISO timestamp
    isPaused: boolean
    totalPaused: number
    onPauseToggle: () => void
    delaySeconds?: number // Optional delay to offset timer start
}

export function DurationCounter({ startedAt, isPaused, totalPaused, onPauseToggle, delaySeconds = 0 }: DurationCounterProps) {
    const [elapsed, setElapsed] = useState(0)
    
    // Internal pause tracking removed. Using parent's totalPaused prop.

    useEffect(() => {
        const startTime = new Date(startedAt).getTime() + (delaySeconds * 1000)
        
        const calculateElapsed = () => {
            const now = Date.now()
            const effectiveElapsed = now - startTime - totalPaused
            return Math.max(0, Math.floor(effectiveElapsed / 1000))
        }

        setElapsed(calculateElapsed())

        if (!isPaused) {
            const interval = setInterval(() => {
                setElapsed(calculateElapsed())
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [startedAt, isPaused, totalPaused, delaySeconds])

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex items-center gap-4 mt-2">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3"
            >
                <div className="relative">
                    {/* Animated background glow */}
                    <div className={`absolute inset-0 ${isPaused ? 'bg-orange-500/20' : 'bg-[#10B981]/20'} blur-xl rounded-full ${!isPaused && 'animate-pulse'}`} />
                    
                    {/* Icon container with glassmorphic effect */}
                    <div className={`relative w-12 h-12 rounded-xl bg-linear-to-br ${isPaused ? 'from-orange-500/20 to-orange-600/20 border-orange-500/30' : 'from-[#10B981]/20 to-[#059669]/20 border-[#10B981]/30'} border flex items-center justify-center backdrop-blur-sm transition-all duration-300`}>
                        <Timer className={`w-6 h-6 ${isPaused ? 'text-orange-500' : 'text-[#10B981]'}`} />
                    </div>
                </div>

                <div className="flex flex-col">
                    {/* Duration text with gradient effect */}
                    <motion.div
                        key={elapsed}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`text-4xl font-bold ${isPaused ? 'text-orange-400' : 'bg-linear-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent'} tabular-nums`}
                    >
                        {formatDuration(elapsed)}
                    </motion.div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium flex items-center gap-2">
                        {isPaused ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                Paused
                            </>
                        ) : (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                Elapsed
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Pause/Resume Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPauseToggle}
                className={`w-12 h-12 rounded-xl ${
                    isPaused 
                        ? 'bg-[#10B981] hover:bg-[#059669] text-black' 
                        : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30'
                } flex items-center justify-center transition-all duration-300 shadow-lg`}
                aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
            >
                <AnimatePresence mode="wait">
                    {isPaused ? (
                        <motion.div
                            key="play"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Play className="w-5 h-5" fill="currentColor" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="pause"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Pause className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
