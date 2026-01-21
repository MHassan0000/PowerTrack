'use client'

import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[rgb(var(--card))] rounded-xl p-5 glow-border hover:border-[rgb(var(--primary))] transition-colors cursor-pointer"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold mb-1">{session.workout_name}</h3>
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                            {formatDate(session.completed_at || session.started_at)}
                        </p>
                    </div>
                    {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-500" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                            <Circle className="w-5 h-5 text-[rgb(var(--primary))]" />
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-2xl font-bold glow-text">{session.total_sets}</div>
                        <div className="text-xs text-[rgb(var(--foreground-muted))]">Sets</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold glow-text">{session.total_reps}</div>
                        <div className="text-xs text-[rgb(var(--foreground-muted))]">Reps</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold glow-text">
                            {Math.round(session.total_volume_kg)}
                        </div>
                        <div className="text-xs text-[rgb(var(--foreground-muted))]">kg</div>
                    </div>
                </div>

                {/* Duration */}
                {isCompleted && (
                    <div className="mt-4 pt-4 border-t border-[rgb(var(--border))]">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[rgb(var(--foreground-muted))]">Duration</span>
                            <span className="font-medium">{formatDuration(session.duration_seconds)}</span>
                        </div>
                    </div>
                )}

                {/* Notes Preview */}
                {session.notes && (
                    <div className="mt-3 p-3 bg-[rgb(var(--background-secondary))] rounded-lg">
                        <p className="text-sm text-[rgb(var(--foreground-muted))] line-clamp-2">
                            {session.notes}
                        </p>
                    </div>
                )}
            </motion.div>
        </Link>
    )
}
