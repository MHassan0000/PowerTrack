'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddToWorkoutModal } from './AddToWorkoutModal'
import { QuickSessionConfigModal } from './QuickSessionConfigModal'
import { createWorkout, addExerciseToWorkout, recalculateWorkoutDuration } from '@/lib/actions/workouts'
import { toast } from 'sonner'

interface ExerciseActionsProps {
    exerciseId: string
    exerciseName: string
}

export function ExerciseActions({ exerciseId, exerciseName }: ExerciseActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isQuickSessionModalOpen, setIsQuickSessionModalOpen] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const router = useRouter()

    const handleQuickSessionConfig = async (config: {
        sets: number
        reps: number
        duration: number | ''
        rest: number
    }) => {
        setIsQuickSessionModalOpen(false)
        setIsStarting(true)

        try {
            // Calculate estimated workout duration
            // Each set takes: duration (if set) + rest time
            // For non-timed exercises, estimate ~3-5 seconds per rep
            const setDuration = config.duration || (config.reps * 4) // 4 seconds per rep estimate
            const totalSeconds = config.sets * (setDuration + config.rest)
            const estimatedMinutes = Math.ceil(totalSeconds / 60)

            console.log('=== QUICK SESSION CREATION DEBUG ===')
            console.log('Estimated duration (minutes):', estimatedMinutes)

            // 1. Create a quick workout with estimated duration
            const formData = new FormData()
            formData.append('name', `${exerciseName} - Quick Session`)
            formData.append('description', 'Quick workout session')
            formData.append('is_template', 'true')
            formData.append('duration_minutes', estimatedMinutes.toString())

            const { data: workout, error: workoutError } = await createWorkout(formData)
            
            if (workoutError || !workout) {
                toast.error('Failed to create workout')
                setIsStarting(false)
                return
            }

            console.log('Created workout:', workout)
            console.log('Workout has duration_minutes:', workout.duration_minutes)

            // 2. Add exercise to workout with user configuration
            const { error: addError } = await addExerciseToWorkout(workout.id, exerciseId, {
                sets: config.sets,
                reps: config.reps > 0 ? config.reps : undefined,
                duration_seconds: config.duration || undefined,
                rest_seconds: config.rest,
            })

            if (addError) {
                toast.error('Failed to add exercise to workout')
                setIsStarting(false)
                return
            }

            console.log('Exercise added, recalculating duration...')
            // Recalculate to ensure consistency
            const recalcResult = await recalculateWorkoutDuration(workout.id)
            console.log('Recalculation result:', recalcResult)

            // 3. Navigate to workout (user can start session from there)
            toast.success('Workout created! Start your session now.')
            router.push(`/workouts/${workout.id}`)
        } catch (error) {
            console.error('Error starting workout:', error)
            toast.error('Failed to start workout session')
            setIsStarting(false)
        }
    }

    return (
        <>
            <div className="pt-2 space-y-3">
                <button
                    onClick={() => setIsQuickSessionModalOpen(true)}
                    disabled={isStarting}
                    className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-[#10B981]/20 flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4 fill-current" />
                    {isStarting ? 'Starting...' : 'Start Stats'}
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors border border-white/5 hover:border-white/10"
                >
                    Add to Workout
                </button>
            </div>

            <QuickSessionConfigModal
                isOpen={isQuickSessionModalOpen}
                onClose={() => setIsQuickSessionModalOpen(false)}
                onConfirm={handleQuickSessionConfig}
                exerciseName={exerciseName}
            />

            <AddToWorkoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exerciseId={exerciseId}
                exerciseName={exerciseName}
            />
        </>
    )
}
