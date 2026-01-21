'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Dumbbell } from 'lucide-react'
import type { WorkoutSession } from '@/lib/actions/workout-sessions'

interface SetWithExercise {
    id: string
    set_number: number
    weight_kg: number | null
    reps: number | null
    duration_seconds: number | null
    exercise: {
        id: string
        name: string
        primary_muscle: string
        equipment: string
    }
}

interface SessionDetailViewProps {
    session: WorkoutSession
    sets: SetWithExercise[]
}

export function SessionDetailView({ session, sets }: SessionDetailViewProps) {
    // Group sets by exercise
    const setsByExercise = sets.reduce((acc, set) => {
        const exerciseName = set.exercise?.name || 'Unknown Exercise'
        if (!acc[exerciseName]) {
            acc[exerciseName] = []
        }
        acc[exerciseName].push(set)
        return acc
    }, {} as Record<string, SetWithExercise[]>)

    return (
        <div className="space-y-6">
            {/* Exercise Breakdown */}
            <div>
                <h2 className="text-xl font-bold mb-4">Exercise Breakdown</h2>
                <div className="space-y-4">
                    {Object.entries(setsByExercise).map(([exerciseName, exerciseSets], index) => (
                        <motion.div
                            key={exerciseName}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[rgb(var(--card))] rounded-xl p-5 glow-border"
                        >
                            {/* Exercise Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-[rgb(var(--primary))]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{exerciseName}</h3>
                                    <p className="text-sm text-[rgb(var(--foreground-muted))]">
                                        {exerciseSets.length} sets
                                    </p>
                                </div>
                            </div>

                            {/* Sets Table */}
                            <div className="space-y-2">
                                {exerciseSets.map((set: SetWithExercise, setIndex: number) => (
                                    <div
                                        key={set.id}
                                        className="flex items-center justify-between p-3 bg-[rgb(var(--background-secondary))] rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                Set {set.set_number}
                                            </span>
                                        </div>
                                        <div className="flex gap-6 text-sm">
                                            {set.weight_kg !== null && (
                                                <div>
                                                    <span className="text-[rgb(var(--foreground-muted))]">Weight: </span>
                                                    <span className="font-bold">{set.weight_kg}kg</span>
                                                </div>
                                            )}
                                            {set.reps !== null && (
                                                <div>
                                                    <span className="text-[rgb(var(--foreground-muted))]">Reps: </span>
                                                    <span className="font-bold">{set.reps}</span>
                                                </div>
                                            )}
                                            {set.duration_seconds !== null && (
                                                <div>
                                                    <span className="text-[rgb(var(--foreground-muted))]">Duration: </span>
                                                    <span className="font-bold">{set.duration_seconds}s</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Exercise Stats */}
                            <div className="mt-4 pt-4 border-t border-[rgb(var(--border))] grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-[rgb(var(--foreground-muted))] mb-1">
                                        Total Volume
                                    </div>
                                    <div className="font-bold">
                                        {Math.round(
                                            exerciseSets.reduce(
                                                (acc: number, set: SetWithExercise) =>
                                                    acc + (set.weight_kg || 0) * (set.reps || 0),
                                                0
                                            )
                                        )}
                                        kg
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-[rgb(var(--foreground-muted))] mb-1">
                                        Total Reps
                                    </div>
                                    <div className="font-bold">
                                        {exerciseSets.reduce((acc: number, set: SetWithExercise) => acc + (set.reps || 0), 0)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-[rgb(var(--foreground-muted))] mb-1">
                                        Best Set
                                    </div>
                                    <div className="font-bold">
                                        {Math.max(
                                            ...exerciseSets.map(
                                                (set: SetWithExercise) => (set.weight_kg || 0) * (set.reps || 0)
                                            )
                                        )}
                                        kg
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {session.notes && (
                <div className="bg-[rgb(var(--card))] rounded-xl p-5 glow-border">
                    <h3 className="font-bold mb-3">Notes</h3>
                    <p className="text-[rgb(var(--foreground-muted))] whitespace-pre-wrap">
                        {session.notes}
                    </p>
                </div>
            )}
        </div>
    )
}
