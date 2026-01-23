'use client'

import { useRouter } from 'next/navigation'
import { Play, Loader2 } from 'lucide-react'
import { startWorkoutSession } from '@/lib/actions/workout-sessions'
import { useState } from 'react'
import { toast } from 'sonner'

interface StartWorkoutButtonProps {
    workoutId: string
    workoutName: string
}

export function StartWorkoutButton({ workoutId, workoutName }: StartWorkoutButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleStartWorkout = async () => {
        setLoading(true)
        const toastId = toast.loading('Starting workout...')

        try {
            const result = await startWorkoutSession(workoutId, workoutName)

            if (result.error) {
                toast.error(result.error, { id: toastId })
            } else if (result.data) {
                toast.success(`Started ${workoutName}! Let's crush it! 💪`, { id: toastId })
                router.push(`/workouts/active`)
            }
        } catch (error) {
            toast.error('Failed to start workout', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleStartWorkout}
            disabled={loading}
            className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Play className="w-5 h-5 fill-current" />
            )}
            {loading ? 'Starting...' : 'Start Workout'}
        </button>
    )
}
