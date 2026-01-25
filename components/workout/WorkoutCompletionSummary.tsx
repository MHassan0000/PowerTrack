'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Clock, Target, TrendingUp, TrendingDown, Minus, X, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WorkoutCompletionSummaryProps {
    isOpen: boolean
    onClose: () => void
    stats: {
        workoutName: string
        totalSets: number
        totalReps: number
        totalVolume: number
        actualDurationSeconds: number
        estimatedDurationMinutes?: number | null
    }
}

export function WorkoutCompletionSummary({ isOpen, onClose, stats }: WorkoutCompletionSummaryProps) {
    const router = useRouter()

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m ${secs}s`
    }

    const estimatedSeconds = (stats.estimatedDurationMinutes || 0) * 60
    const difference = stats.actualDurationSeconds - estimatedSeconds
    const percentageDiff = estimatedSeconds > 0 
        ? Math.round((difference / estimatedSeconds) * 100) 
        : 0

    const getPerformanceIndicator = () => {
        if (!stats.estimatedDurationMinutes) {
            return { text: 'Great work!', color: 'text-[#10B981]', icon: Trophy, badge: null }
        }

        if (percentageDiff < -10) {
            return { 
                text: 'Beat the target!', 
                color: 'text-[#10B981]', 
                icon: TrendingUp,
                badge: 'Faster',
                badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
            }
        } else if (percentageDiff <= 10) {
            return { 
                text: 'Right on track!', 
                color: 'text-yellow-400', 
                icon: Target,
                badge: 'On Pace',
                badgeColor: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
            }
        } else {
            return { 
                text: 'Took your time!', 
                color: 'text-blue-400', 
                icon: Minus,
                badge: 'Steady',
                badgeColor: 'bg-blue-400/20 text-blue-400 border-blue-400/30'
            }
        }
    }

    const performance = getPerformanceIndicator()
    const PerformanceIcon = performance.icon

    const handleViewDetails = () => {
        router.push('/workouts/history')
    }

    const handleBackToWorkouts = () => {
        router.push('/workouts')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#18181B] rounded-3xl max-w-md w-full border border-white/10 relative max-h-[90vh] flex flex-col"
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl -z-10" />
                        
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Scrollable content */}
                        <div className="overflow-y-auto px-8 py-8">
                            {/* Trophy Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#10B981]/20 blur-2xl rounded-full animate-pulse" />
                                    <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-[#10B981]/20 to-[#059669]/20 border border-[#10B981]/30 flex items-center justify-center">
                                        <Trophy className="w-10 h-10 text-[#10B981]" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-center text-white mb-2">
                                Workout Complete!
                            </h2>
                            <p className="text-center text-zinc-400 mb-6">
                                {stats.workoutName}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <div className="text-2xl font-bold text-white">{stats.totalSets}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Sets</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <div className="text-2xl font-bold text-white">{stats.totalReps}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Reps</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <div className="text-2xl font-bold text-white">{stats.totalVolume}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">kg</div>
                                </div>
                            </div>

                            {/* Duration Comparison */}
                            <div className="bg-linear-to-br from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 rounded-2xl p-6 mb-6 relative overflow-hidden">
                                {/* Premium Badge - Only show if has estimate */}
                                {stats.estimatedDurationMinutes && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-xs font-bold text-purple-300">
                                        <Sparkles className="w-3 h-3" />
                                        <span>PRO</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-[#10B981]" />
                                        <span className="text-sm font-medium text-zinc-400">Duration</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-zinc-400">Actual Time</span>
                                        <span className="text-xl font-bold text-white">
                                            {formatDuration(stats.actualDurationSeconds)}
                                        </span>
                                    </div>

                                    {stats.estimatedDurationMinutes && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-400">Estimated</span>
                                                <span className="text-lg font-medium text-zinc-500">
                                                    {stats.estimatedDurationMinutes}m
                                                </span>
                                            </div>

                                            <div className={`flex items-center justify-center gap-2 pt-3 border-t border-white/10 ${performance.color}`}>
                                                <PerformanceIcon className="w-5 h-5" />
                                                <span className="font-bold text-sm">{performance.text}</span>
                                                {Math.abs(percentageDiff) > 0 && (
                                                    <span className="text-xs opacity-75">
                                                        ({percentageDiff > 0 ? '+' : ''}{percentageDiff}%)
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 px-8 pb-8">
                            <button
                                onClick={handleViewDetails}
                                className="w-full py-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold transition-colors shadow-lg shadow-[#10B981]/20"
                            >
                                View Details
                            </button>
                            <button
                                onClick={handleBackToWorkouts}
                                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                            >
                                Back to Workouts
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
