'use client'

import { use, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Dumbbell, X, Trophy, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SetLogger } from './SetLogger'
import { RestTimer } from './RestTimer'
import { DurationCounter } from './DurationCounter'
import { WorkoutCompletionSummary } from './WorkoutCompletionSummary'
import { logSet, completeWorkoutSession, deleteWorkoutSession, updateSessionStart, type SetLog, type WorkoutSession } from '@/lib/actions/workout-sessions'
import { getWorkoutById, type WorkoutWithExercises } from '@/lib/actions/workouts'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface ActiveWorkoutViewProps {
    session: WorkoutSession
    sets: SetLog[]
}

export function ActiveWorkoutView({ session: initialSession, sets: initialSets }: ActiveWorkoutViewProps) {
    const router = useRouter()
    const [session, setSession] = useState(initialSession)
    const [sets, setSets] = useState(initialSets)
    const [hasStarted, setHasStarted] = useState(initialSets.length > 0)

    const [showRestTimer, setShowRestTimer] = useState(false)
    const [workoutExercises, setWorkoutExercises] = useState<any[]>([])
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [currentSetNumber, setCurrentSetNumber] = useState(1)
    const [completing, setCompleting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [setStartTime, setSetStartTime] = useState<number | null>(null)
    const [pausedTime, setPausedTime] = useState(0)
    const [totalWorkoutPaused, setTotalWorkoutPaused] = useState(0)
    const [activePauseStartTime, setActivePauseStartTime] = useState<number | null>(null)
    const [showCompletionSummary, setShowCompletionSummary] = useState(false)
    const [completionStats, setCompletionStats] = useState<any>(null)
    const [workoutData, setWorkoutData] = useState<WorkoutWithExercises | null>(null)
    const workoutEndTimeRef = useRef<number | null>(null)

    const handleStartTimer = async () => {
        const now = new Date().toISOString()
        setSession(prev => ({ ...prev, started_at: now }))
        setHasStarted(true)
        await updateSessionStart(session.id, now)
        toast.success('Timer Started! Go get it! 🚀')
    }

    // Load workout exercises
    useEffect(() => {
        const loadWorkout = async () => {
            if (session.workout_id) {
                const { data } = await getWorkoutById(session.workout_id)
                if (data?.exercises) {
                    setWorkoutExercises(data.exercises)
                    setWorkoutData(data)
                }
            }
            setLoading(false)
        }
        loadWorkout()
    }, [session.workout_id])

    // Track total active workout paused time (excluding rest which is active)
    useEffect(() => {
        const effectiveIsPaused = isPaused && !showRestTimer
        if (effectiveIsPaused) {
            const pauseStart = Date.now()
            setActivePauseStartTime(pauseStart)
            return () => {
                const pauseEnd = Date.now()
                setTotalWorkoutPaused(prev => prev + (pauseEnd - pauseStart))
                setActivePauseStartTime(null)
            }
        } else {
            setActivePauseStartTime(null)
        }
    }, [isPaused, showRestTimer])

    // Track set paused time (for set logging logic only)
    useEffect(() => {
        if (isPaused && setStartTime) {
            const pauseStart = Date.now()
            return () => {
                setPausedTime(prev => prev + (Date.now() - pauseStart))
            }
        }
    }, [isPaused, setStartTime])

    const currentExercise = workoutExercises[currentExerciseIndex]
    const progress = workoutExercises.length > 0 ? ((currentExerciseIndex + 1) / workoutExercises.length) * 100 : 0

    // Check if workout is truly complete
    const isWorkoutComplete = currentExerciseIndex >= workoutExercises.length - 1 && 
                              currentSetNumber > (currentExercise?.sets || 0)

    const handlePauseToggle = () => {
        const newIsPaused = !isPaused
        setIsPaused(newIsPaused)
        
        if (newIsPaused) {
            // Set pause start time IMMEDIATELY to prevent 1s lag in display
            setActivePauseStartTime(Date.now())
        } else {
            // Start tracking set duration when unpausing
            if (!setStartTime) {
                setSetStartTime(Date.now())
            }
        }
    }

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

        // Calculate set duration
        let setDuration = 0
        if (setStartTime) {
            setDuration = Math.floor((Date.now() - setStartTime - pausedTime) / 1000)
        }

        const result = await logSet(session.id, {
            exercise_id: currentExercise.exercise_id,
            set_number: currentSetNumber,
            weight_kg: data.weight_kg,
            reps: data.reps,
            duration_seconds: setDuration > 0 ? setDuration : undefined,
            rest_seconds: currentExercise.rest_seconds || 90,
        })

        if (result.data) {
            setSets([...sets, result.data as SetLog])
            
            // Reset set tracking
            setSetStartTime(null)
            setPausedTime(0)
            
            // Check if we completed all sets for this exercise
            if (currentSetNumber >= currentExercise.sets) {
                // Move to next exercise
                if (currentExerciseIndex < workoutExercises.length - 1) {
                    toast.success(`${currentExercise.exercise_library.name} complete! Moving to next exercise.`)
                    setCurrentExerciseIndex(currentExerciseIndex + 1)
                    setCurrentSetNumber(1)
                } else {
                    // Workout complete - auto-trigger completion
                    toast.success('All exercises complete! 🎉')
                    // Capture exact end time NOW before the delay
                    workoutEndTimeRef.current = Date.now()
                    
                    // Small delay then auto-complete
                    setTimeout(() => {
                        handleCompleteWorkout()
                    }, 1500)
                }
            } else {
                setCurrentSetNumber(currentSetNumber + 1)
                setShowRestTimer(true)
                // Auto-pause during rest
                setIsPaused(true)
            }
        }
    }

    const handleRestComplete = () => {
        setShowRestTimer(false)
        // Auto-resume after rest
        setIsPaused(false)
        setSetStartTime(Date.now())
    }

    const handleSkipRest = () => {
        setShowRestTimer(false)
        // Auto-resume after skipping rest
        setIsPaused(false)
        setSetStartTime(Date.now())
    }

    const handleSkipExercise = () => {
        if (currentExerciseIndex < workoutExercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1)
            setCurrentSetNumber(1)
        }
    }

    const handleSkipSet = () => {
        // Move to next set without logging
        if (currentSetNumber < currentExercise.sets) {
            setCurrentSetNumber(currentSetNumber + 1)
            setShowRestTimer(true)
            setIsPaused(true)
        } else if (currentExerciseIndex < workoutExercises.length - 1) {
            // Move to next exercise
            toast.success(`${currentExercise.exercise_library.name} complete! Moving to next exercise.`)
            setCurrentExerciseIndex(currentExerciseIndex + 1)
            setCurrentSetNumber(1)
        } else {
            // Workout complete
            toast.success('All exercises complete! 🎉')
            workoutEndTimeRef.current = Date.now()
            setTimeout(() => {
                handleCompleteWorkout()
            }, 1500)
        }
    }

    const handleCompleteWorkout = async () => {
        // Freeze time IMMEDIATELY when determining completion
        if (!workoutEndTimeRef.current) {
            workoutEndTimeRef.current = Date.now()
        }
        
        setCompleting(true)
        
        // Calculate active duration using client-side tracked pauses for consistency
        let currentTotalPaused = totalWorkoutPaused
        
        // Add pending pause if currently paused
        if (activePauseStartTime) {
            currentTotalPaused += (Date.now() - activePauseStartTime)
        }

        const endTime = workoutEndTimeRef.current || Date.now()
        const currentActiveDuration = Math.max(0, Math.floor((endTime - new Date(session.started_at).getTime() - currentTotalPaused) / 1000))

        const result = await completeWorkoutSession(session.id, undefined, currentActiveDuration)

        if (!result.error && result.data) {
            // Fetch estimated duration from workout if not already loaded
            let estimatedMinutes = workoutData?.duration_minutes
            
            // Try multiple sources for workout ID
            const workoutId = session.workout_id || result.data.workoutId
            
            // Always try to fetch if we don't have duration and we have a workout_id
            if (!estimatedMinutes && workoutId) {
                const { data: workoutInfo } = await getWorkoutById(workoutId)
                estimatedMinutes = workoutInfo?.duration_minutes || null
            }

            // Calculate active duration using client-side tracked pauses for consistency
            // Calculate active duration using client-side tracked pauses for consistency
            // Note: We use the already calculated currentActiveDuration from above, or recalculate if needed (but above value is sent to server so use that)
            // But for display consistency, we recalculate using the same logic just to be safe, or just reuse the var? 
            // Reuse the logic:
            let displayTotalPaused = totalWorkoutPaused
            if (activePauseStartTime) {
                displayTotalPaused += (Date.now() - activePauseStartTime)
            }
            const displayEndTime = workoutEndTimeRef.current || Date.now()
            const displayActiveDuration = Math.max(0, Math.floor((displayEndTime - new Date(session.started_at).getTime() - displayTotalPaused) / 1000))

            // Show completion summary
            setCompletionStats({
                workoutName: session.workout_name,
                totalSets: result.data.session?.total_sets || sets.length,
                totalReps: result.data.session?.total_reps || 0,
                totalVolume: result.data.session?.total_volume_kg || 0,
                actualDurationSeconds: displayActiveDuration, // Use our tracked active duration
                estimatedDurationMinutes: estimatedMinutes
            })
            setShowCompletionSummary(true)
            toast.success('Workout completed! Great job! 💪')
        } else {
            toast.error(result.error || 'Failed to complete workout')
            setCompleting(false)
        }
    }

    const handleCloseSummary = () => {
        setShowCompletionSummary(false)
        setCompleting(false)
    }

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
            router.push('/workouts')
        }
    }

    const handleCancelConfirm = async () => {
        await deleteWorkoutSession(session.id)
        router.push('/workouts')
    }

    const handleDiscardSession = async () => {
        if (confirm('This session seems to be broken (the workout template might have been deleted). Do you want to discard it?')) {
            await deleteWorkoutSession(session.id)
            router.push('/workouts')
        }
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

    // Start Overlay Logic
    if (!hasStarted && workoutExercises.length > 0) {
       return (
           <div className="container mx-auto px-4 py-6 relative min-h-[80vh]">
               {/* Blurred Background Content Preview */}
               <div className="opacity-10 pointer-events-none blur-xs filter select-none">
                    <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{session.workout_name}</h1>
                                <div className="text-4xl font-bold text-[#10B981] mt-2 font-mono">00:00</div>
                            </div>
                        </div>
                    </div>
                    {/* Fake Exercise Card Preview */}
                    <div className="bg-[#18181B] rounded-3xl p-8 border border-white/5 opacity-50">
                        <div className="text-center">
                             <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 rounded-full text-[#10B981] text-sm font-bold mb-4">
                                <Dumbbell className="w-4 h-4" />
                                SET 1
                            </div>
                        </div>
                    </div>
               </div>

               {/* Start Button Overlay */}
               <div className="absolute inset-0 flex items-center justify-center z-50">
                   <div className="text-center">
                       <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={handleStartTimer}
                           className="w-32 h-32 rounded-full bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-2 transition-all border-4 border-[#059669] cursor-pointer"
                       >
                           <Play className="w-8 h-8 fill-current" />
                           START
                       </motion.button>
                       <p className="text-zinc-400 mt-6 font-medium animate-pulse">
                           Ready to crush it?
                       </p>
                   </div>
               </div>
           </div>
       )
    }

    if (workoutExercises.length === 0) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center py-20">
                    <Dumbbell className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Workout Not Found</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                        The workout template for this session appears to be empty or deleted.
                    </p>
                    <div className="flex flex-col gap-3 min-w-[200px] mx-auto w-fit">
                        <button
                            onClick={() => router.push('/workouts')}
                            className="px-6 py-3 bg-[#27272A] text-white font-bold rounded-xl hover:bg-[#3F3F46] transition-colors"
                        >
                            Back to Workouts
                        </button>
                        <button
                            onClick={handleDiscardSession}
                            className="px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                            Discard Broken Session
                        </button>
                    </div>
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
                                <DurationCounter 
                                    startedAt={session.started_at}
                                    isPaused={isPaused && !showRestTimer}
                                    totalPaused={totalWorkoutPaused}
                                    activePauseStartTime={activePauseStartTime}
                                    onPauseToggle={handlePauseToggle}
                                />
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
                            className="h-full bg-linear-to-r from-[#10B981] to-[#059669]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Current Exercise */}
                {currentExercise && !isWorkoutComplete && (
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
                                    onSkip={handleSkipSet}
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

                {/* Complete Workout Button - Only show if not auto-completing */}
                {(sets.length > 0) && !completing && (
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

            {/* Workout Completion Summary */}
            {completionStats && (
                <WorkoutCompletionSummary
                    isOpen={showCompletionSummary}
                    onClose={handleCloseSummary}
                    stats={completionStats}
                />
            )}
        </>
    )
}
