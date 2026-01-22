'use client'

import { useRouter } from 'next/navigation'
import { Play, Calendar, Loader2 } from 'lucide-react'
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
        <div className="flex gap-4">
            <button
                onClick={handleStartWorkout}
                disabled={loading}
                className="flex-1 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Play className="w-5 h-5 fill-current" />
                )}
                {loading ? 'Starting...' : 'Start Workout'}
            </button>
            <button className="px-6 py-3 bg-[rgb(var(--card-hover))] text-[rgb(var(--foreground-secondary))] font-medium rounded-lg hover:bg-[rgb(var(--border))] transition-all flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule
            </button>
        </div>
    )
}
