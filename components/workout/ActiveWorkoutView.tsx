'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Dumbbell, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SetLogger } from './SetLogger'
import { RestTimer } from './RestTimer'
import { logSet, completeWorkoutSession, type SetLog, type WorkoutSession } from '@/lib/actions/workout-sessions'

interface ActiveWorkoutViewProps {
    session: WorkoutSession
    sets: SetLog[]
}

// Note: In a real app, we'd fetch the workout exercises from the workout_id
// For now, we'll show a simplified version
export function ActiveWorkoutView({ session, sets: initialSets }: ActiveWorkoutViewProps) {
    const router = useRouter()
    const [sets, setSets] = useState(initialSets)
    const [showRestTimer, setShowRestTimer] = useState(false)
    const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null)
    const [currentSetNumber, setCurrentSetNumber] = useState(1)
    const [completing, setCompleting] = useState(false)

    // Group sets by exercise
    const setsByExercise = sets.reduce((acc, set) => {
        const exerciseId = set.exercise_id
        if (!acc[exerciseId]) {
            acc[exerciseId] = []
        }
        acc[exerciseId].push(set)
        return acc
    }, {} as Record<string, SetLog[]>)

    const handleLogSet = async (data: { weight_kg: number; reps: number }) => {
        if (!currentExerciseId) return

        const result = await logSet(session.id, {
            exercise_id: currentExerciseId,
            set_number: currentSetNumber,
            weight_kg: data.weight_kg,
            reps: data.reps,
            rest_seconds: 90, // Default rest time
        })

        if (result.data) {
            setSets([...sets, result.data as SetLog])
            setCurrentSetNumber(currentSetNumber + 1)
            setShowRestTimer(true)
        }
    }

    const handleRestComplete = () => {
        setShowRestTimer(false)
    }

    const handleSkipRest = () => {
        setShowRestTimer(false)
    }

    const handleCompleteWorkout = async () => {
        setCompleting(true)
        const result = await completeWorkoutSession(session.id)

        if (!result.error) {
            router.push('/workouts/history')
        } else {
            setCompleting(false)
        }
    }

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
            router.push('/workouts')
        }
    }

    return (
        <>
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{session.workout_name}</h1>
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                            {sets.length} sets logged
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="w-10 h-10 rounded-full bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Instruction */}
                {!currentExerciseId && sets.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-lg"
                    >
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                            💪 Select an exercise below to start logging sets
                        </p>
                    </motion.div>
                )}

                {/* Set Logger */}
                {currentExerciseId && !showRestTimer && (
                    <div className="mb-6">
                        <SetLogger
                            exerciseName="Exercise" // In real app, get from exercise_id
                            setNumber={currentSetNumber}
                            previousSet={
                                setsByExercise[currentExerciseId]?.slice(-1)[0] || undefined
                            }
                            onLogSet={handleLogSet}
                            onSkip={() => setCurrentSetNumber(currentSetNumber + 1)}
                        />
                    </div>
                )}

                {/* Logged Sets */}
                {sets.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3">Logged Sets</h2>
                        <div className="space-y-2">
                            {sets.map((set, index) => (
                                <motion.div
                                    key={set.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-4 bg-[rgb(var(--card))] rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <div className="font-medium">Set {set.set_number}</div>
                                            <div className="text-sm text-[rgb(var(--foreground-muted))]">
                                                Exercise {/* In real app, show exercise name */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">
                                            {set.weight_kg}kg × {set.reps}
                                        </div>
                                        <div className="text-xs text-[rgb(var(--foreground-muted))]">
                                            {new Date(set.logged_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Exercise Buttons (Temporary - In real app, load from workout) */}
                {!currentExerciseId && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3">Select Exercise</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCurrentExerciseId('temp-1')}
                                className="min-h-20 rounded-lg bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))] transition-colors p-4 text-left glow-border"
                            >
                                <Dumbbell className="w-6 h-6 mb-2 text-[rgb(var(--primary))]" />
                                <div className="font-medium">Bench Press</div>
                            </button>
                            <button
                                onClick={() => setCurrentExerciseId('temp-2')}
                                className="min-h-20 rounded-lg bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))] transition-colors p-4 text-left glow-border"
                            >
                                <Dumbbell className="w-6 h-6 mb-2 text-[rgb(var(--primary))]" />
                                <div className="font-medium">Squat</div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Complete Workout Button */}
                {sets.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleCompleteWorkout}
                        disabled={completing}
                        className="w-full min-h-14 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition-colors disabled:opacity-50"
                    >
                        {completing ? 'Completing...' : 'Complete Workout'}
                    </motion.button>
                )}
            </div>

            {/* Rest Timer Overlay */}
            <AnimatePresence>
                {showRestTimer && (
                    <RestTimer
                        duration={90}
                        onComplete={handleRestComplete}
                        onSkip={handleSkipRest}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
