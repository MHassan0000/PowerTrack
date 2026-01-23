'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Calendar, Dumbbell, Clock } from 'lucide-react'
import Link from 'next/link'
import type { WorkoutSession } from '@/lib/actions/workout-sessions'

interface WorkoutHistoryCardProps {
    session: WorkoutSession
}

export function WorkoutHistoryCard({ session }: WorkoutHistoryCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date)
    }

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return 'N/A'
        const mins = Math.floor(seconds / 60)
        const hrs = Math.floor(mins / 60)
        const remainingMins = mins % 60

        if (hrs > 0) {
            return `${hrs}h ${remainingMins}m`
        }
        return `${mins}m`
    }

    const isCompleted = !!session.completed_at

    return (
        <Link href={`/workouts/history/${session.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group bg-[#18181B] hover:bg-[#27272A] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-all duration-300 relative overflow-hidden"
            >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isCompleted ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' : 'bg-zinc-800/50 border-white/5 text-zinc-500'}`}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <Circle className="w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#10B981] transition-colors">{session.workout_name}</h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(session.completed_at || session.started_at)}
                                </div>
                            </div>
                        </div>
                        
                        {isCompleted && (
                             <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold uppercase tracking-wider border border-[#10B981]/20">
                                Completed
                            </span>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/5">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Dumbbell className="w-3 h-3" /> Sets
                            </span>
                            <span className="text-xl font-bold text-white">{session.total_sets}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                Volume
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-white">{Math.round(session.total_volume_kg)}</span>
                                <span className="text-xs text-zinc-500 font-bold">kg</span>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Time
                            </span>
                            <span className="text-xl font-bold text-white">{formatDuration(session.duration_seconds)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
