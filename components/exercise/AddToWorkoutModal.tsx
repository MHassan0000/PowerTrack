'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { addExerciseToWorkout, createWorkout, getWorkouts, recalculateWorkoutDuration } from '@/lib/actions/workouts'
import { toast } from 'sonner'

interface AddToWorkoutModalProps {
    isOpen: boolean
    onClose: () => void
    exerciseId: string
    exerciseName: string
}

interface Workout {
    id: string
    name: string
    is_template: boolean
}

export function AddToWorkoutModal({ isOpen, onClose, exerciseId, exerciseName }: AddToWorkoutModalProps) {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('')
    const [isCreatingNew, setIsCreatingNew] = useState(false)
    const [newWorkoutName, setNewWorkoutName] = useState('')
    
    // Configuration - Match ExerciseConfigModal (no weight, includes duration)
    const [sets, setSets] = useState(3)
    const [reps, setReps] = useState(10)
    const [duration, setDuration] = useState<number | ''>('')
    const [rest, setRest] = useState(60)
    
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch workouts when modal opens
    useEffect(() => {
        if (isOpen) {
            loadWorkouts()
        }
    }, [isOpen])

    const loadWorkouts = async () => {
        setIsLoading(true)
        const { data, error } = await getWorkouts()
        if (data) {
            setWorkouts(data as Workout[])
            if (data.length > 0) {
                setSelectedWorkoutId(data[0].id)
            }
        }
        setIsLoading(false)
    }

    const handleCreateNewWorkout = async () => {
        if (!newWorkoutName.trim()) {
            setError('Please enter a workout name')
            return
        }

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append('name', newWorkoutName)
        formData.append('description', '')
        formData.append('is_template', 'true')

        const { data, error } = await createWorkout(formData)
        
        if (error) {
            setError(error)
            setIsSubmitting(false)
            return
        }

        if (data) {
            setWorkouts([...workouts, data as Workout])
            setSelectedWorkoutId(data.id)
            setIsCreatingNew(false)
            setNewWorkoutName('')
            toast.success('Workout created!')
        }
        setIsSubmitting(false)
    }

    const handleSubmit = async () => {
        if (!selectedWorkoutId) {
            setError('Please select a workout')
            return
        }

        if (sets <= 0) {
            setError('Sets must be greater than 0')
            return
        }

        if (reps <= 0 && !duration) {
            setError('Either reps or duration must be provided')
            return
        }

        setIsSubmitting(true)
        setError(null)

        const { error } = await addExerciseToWorkout(selectedWorkoutId, exerciseId, {
            sets,
            reps: reps > 0 ? reps : undefined,
            duration_seconds: duration || undefined,
            rest_seconds: rest,
        })

        if (error) {
            setError(error)
            setIsSubmitting(false)
            return
        }

        // Recalculate workout duration
        console.log('=== ADD TO WORKOUT DEBUG ===')
        console.log('Calling recalculateWorkoutDuration for workout:', selectedWorkoutId)
        const recalcResult = await recalculateWorkoutDuration(selectedWorkoutId)
        console.log('Recalculation result:', recalcResult)

        // Success!
        toast.success(`${exerciseName} added to workout!`)
        setIsSubmitting(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#18181B] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Add to Workout</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-[#10B981] animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Workout Selection */}
                            {!isCreatingNew ? (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-zinc-300">Select Workout</label>
                                    {workouts.length > 0 ? (
                                        <select
                                            value={selectedWorkoutId}
                                            onChange={(e) => setSelectedWorkoutId(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#27272A] text-white rounded-xl border border-white/10 focus:border-[#10B981] focus:outline-none"
                                        >
                                            {workouts.map((workout) => (
                                                <option key={workout.id} value={workout.id}>
                                                    {workout.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-zinc-500 text-sm">No workouts found</p>
                                    )}
                                    
                                    <button
                                        onClick={() => setIsCreatingNew(true)}
                                        className="w-full py-2.5 text-[#10B981] hover:text-[#059669] font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create New Workout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-zinc-300">New Workout Name</label>
                                    <input
                                        type="text"
                                        value={newWorkoutName}
                                        onChange={(e) => setNewWorkoutName(e.target.value)}
                                        placeholder="e.g., Upper Body Push"
                                        className="w-full px-4 py-3 bg-[#27272A] text-white rounded-xl border border-white/10 focus:border-[#10B981] focus:outline-none"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCreateNewWorkout()
                                            }
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsCreatingNew(false)
                                                setNewWorkoutName('')
                                            }}
                                            className="flex-1 py-2.5 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreateNewWorkout}
                                            disabled={isSubmitting || !newWorkoutName.trim()}
                                            className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-medium rounded-xl transition-colors"
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-white/10" />

                            {/* Exercise Configuration */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-zinc-300">Exercise Configuration</h3>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Sets</label>
                                        <input
                                            type="number"
                                            value={sets}
                                            onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                                            min="1"
                                            max="10"
                                            className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Reps</label>
                                        <input
                                            type="number"
                                            value={reps}
                                            onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="50"
                                            placeholder="0 for timed"
                                            className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Duration (s)</label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : '')}
                                            min="0"
                                            placeholder="For timed"
                                            className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Rest (s)</label>
                                        <input
                                            type="number"
                                            value={rest}
                                            onChange={(e) => setRest(parseInt(e.target.value) || 0)}
                                            min="0"
                                            step="15"
                                            className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !selectedWorkoutId}
                                className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-[#10B981]/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add to Workout'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
