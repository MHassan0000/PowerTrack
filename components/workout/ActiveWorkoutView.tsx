'use client'

import { use, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Dumbbell, X ,Clock, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SetLogger } from './SetLogger'
import { RestTimer } from './RestTimer'
import { logSet, completeWorkoutSession, type SetLog, type WorkoutSession } from '@/lib/actions/workout-sessions'
import { getWorkoutById } from '@/lib/actions/workouts'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface ActiveWorkoutViewProps {
    session: WorkoutSession
    sets: SetLog[]
}

export function ActiveWorkoutView({ session, sets: initialSets }: ActiveWorkoutViewProps) {
    const router = useRouter()
    const [sets, setSets] = useState(initialSets)
    const [showRestTimer, setShowRestTimer] = useState(false)
    const [workoutExercises, setWorkoutExercises] = useState<any[]>([])
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [currentSetNumber, setCurrentSetNumber] = useState(1)
    const [completing, setCompleting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showCancelDialog, setShowCancelDialog] = useState(false)

    // Load workout exercises
    useEffect(() => {
        const loadWorkout = async () => {
            if (session.workout_id) {
                const { data } = await getWorkoutById(session.workout_id)
                if (data?.exercises) {
                    setWorkoutExercises(data.exercises)
                }
            }
            setLoading(false)
        }
        loadWorkout()
    }, [session.workout_id])

    const currentExercise = workoutExercises[currentExerciseIndex]
    const progress = workoutExercises.length > 0 ? ((currentExerciseIndex + 1) / workoutExercises.length) * 100 : 0

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
        if (!currentExercise) return

        const result = await logSet(session.id, {
            exercise_id: currentExercise.exercise_id,
            set_number: currentSetNumber,
            weight_kg: data.weight_kg,
            reps: data.reps,
            rest_seconds: currentExercise.rest_seconds || 90,
        })

        if (result.data) {
            setSets([...sets, result.data as SetLog])
            
            // Check if we completed all sets for this exercise
            if (currentSetNumber >= currentExercise.sets) {
                // Move to next exercise
                if (currentExerciseIndex < workoutExercises.length - 1) {
                    toast.success(`${currentExercise.exercise_library.name} complete! Moving to next exercise.`)
                    setCurrentExerciseIndex(currentExerciseIndex + 1)
                    setCurrentSetNumber(1)
                } else {
                    // Workout complete
                    toast.success('All exercises complete! 🎉')
                }
            } else {
                setCurrentSetNumber(currentSetNumber + 1)
                setShowRestTimer(true)
            }
        }
    }

    const handleRestComplete = () => {
        setShowRestTimer(false)
    }

    const handleSkipRest = () => {
        setShowRestTimer(false)
    }

    const handleSkipExercise = () => {
        if (currentExerciseIndex < workoutExercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1)
            setCurrentSetNumber(1)
        }
    }

    const handleCompleteWorkout = async () => {
        setCompleting(true)
        const result = await completeWorkoutSession(session.id)

        if (!result.error) {
            toast.success('Workout completed! Great job! 💪')
            router.push('/workouts/history')
        } else {
            toast.error(result.error)
            setCompleting(false)
        }
    }

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
            router.push('/workouts')
        }
    }

    const handleCancelConfirm = () => {
        router.push('/workouts')
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Dumbbell className="w-12 h-12 text-[#10B981] animate-pulse mx-auto mb-4" />
                    <p className="text-zinc-400">Loading workout...</p>
                </div>
            </div>
        )
    }

    if (workoutExercises.length === 0) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center py-20">
                    <p className="text-zinc-400 mb-4">This workout has no exercises</p>
                    <button
                        onClick={() => router.push('/workouts')}
                        className="px-6 py-3 bg-[#10B981] text-black font-bold rounded-xl hover:bg-[#059669] transition-colors"
                    >
                        Back to Workouts
                    </button>
                </div>
            </div>
        )
    }

    const allExercisesComplete = currentExerciseIndex >= workoutExercises.length - 1 && 
                                 currentSetNumber > (currentExercise?.sets || 0)

    return (
        <>
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{session.workout_name}</h1>
                                <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Started {new Date(session.started_at).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCancelDialog(true)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 bg-[#18181B] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#10B981] to-[#059669]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Current Exercise */}
                {currentExercise && !allExercisesComplete && (
                    <div className="mb-8">
                        <div className="bg-[#18181B] rounded-3xl p-8 border border-white/5">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 rounded-full text-[#10B981] text-sm font-bold mb-4">
                                    <Dumbbell className="w-4 h-4" />
                                    SET {currentSetNumber} OF {currentExercise.sets}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {currentExercise.exercise_library.name}
                                </h2>
                                <p className="text-zinc-400">
                                    {currentExercise.exercise_library.primary_muscle} • {currentExercise.exercise_library.equipment}
                                </p>
                            </div>

                            {!showRestTimer && (
                                <SetLogger
                                    exerciseName={currentExercise.exercise_library.name}
                                    setNumber={currentSetNumber}
                                    previousSet={setsByExercise[currentExercise.exercise_id]?.slice(-1)[0]}
                                    onLogSet={handleLogSet}
                                    onSkip={handleSkipExercise}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Logged Sets Summary */}
                {sets.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Completed Sets</h3>
                        <div className="space-y-2">
                            {sets.slice(-5).reverse().map((set) => (
                                <motion.div
                                    key={set.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-[#18181B] rounded-xl border border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                                        </div>
                                        <div className="text-sm text-zinc-400">
                                            Set {set.set_number}
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-white">
                                        {set.weight_kg}kg × {set.reps}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Complete Workout Button */}
                {(allExercisesComplete || sets.length > 0) && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleCompleteWorkout}
                        disabled={completing}
                        className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {completing ? (
                            'Completing...'
                        ) : (
                            <>
                                <Trophy className="w-5 h-5" />
                                Complete Workout
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Rest Timer Overlay */}
            <AnimatePresence>
                {showRestTimer && currentExercise && (
                    <RestTimer
                        duration={currentExercise.rest_seconds || 90}
                        onComplete={handleRestComplete}
                        onSkip={handleSkipRest}
                    />
                )}
            </AnimatePresence>

            {/* Cancel Workout Confirmation */}
            <ConfirmDialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelConfirm}
                title="Cancel Workout?"
                message="Are you sure you want to cancel this workout? All progress will be lost and cannot be recovered."
                confirmText="Yes, Cancel Workout"
                cancelText="Keep Working Out"
                variant="danger"
            />
        </>
    )
}
