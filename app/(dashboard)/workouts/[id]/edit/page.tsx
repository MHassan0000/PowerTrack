'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getWorkoutById, addExerciseToWorkout, removeExerciseFromWorkout, updateWorkout } from '@/lib/actions/workouts'
import { ExercisePicker } from '@/components/workout/ExercisePicker'
import { ExerciseConfigModal } from '@/components/workout/ExerciseConfigModal'
import type { Exercise } from '@/lib/actions/exercises'
import Image from 'next/image'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
interface WorkoutEditPageProps {
    params: Promise<{ id: string }>
}

export default function WorkoutEditPage({ params }: WorkoutEditPageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [workout, setWorkout] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showExercisePicker, setShowExercisePicker] = useState(false)
    const [saving, setSaving] = useState(false)
    const [exerciseToRemove, setExerciseToRemove] = useState<{id: string, name: string} | null>(null)
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

    // Load workout data
    useEffect(() => {
        const loadWorkout = async () => {
            const { data } = await getWorkoutById(id)
            setWorkout(data)
            setLoading(false)
        }
        loadWorkout()
    }, [id])

    const handleSelectExercise = (exercise: Exercise) => {
        setShowExercisePicker(false)
        setSelectedExercise(exercise)
    }

    const handleAddExercise = async (config: {
        sets: number
        reps?: number
        duration_seconds?: number
        rest_seconds: number
        weight_kg?: number
        notes?: string
    }) => {
        if (!selectedExercise) return

        setSelectedExercise(null)
        
        const toastId = toast.loading('Adding exercise...')
        
        const result = await addExerciseToWorkout(id, selectedExercise.id, config)

        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success(`Added ${selectedExercise.name}`, { id: toastId })
            // Reload workout
            const { data } = await getWorkoutById(id)
            setWorkout(data)
        }
    }

    const handleRemoveExercise = async () => {
        if (!exerciseToRemove) return

        const toastId = toast.loading('Removing exercise...')
        
        const result = await removeExerciseFromWorkout(exerciseToRemove.id)
        
        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success('Exercise removed', { id: toastId })
            // Reload workout
            const { data } = await getWorkoutById(id)
            setWorkout(data)
        }
        
        setExerciseToRemove(null)
    }

    const handleSave = async () => {
        setSaving(true)
        toast.success('Workout saved!')
        setSaving(false)
        router.push(`/workouts/${id}`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
            </div>
        )
    }

    if (!workout) {
        return (
            <div className="text-center py-20">
                <p className="text-zinc-400">Workout not found</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/workouts/${id}`}
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
                    <p className="text-zinc-400 text-sm mt-1">Edit your workout</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                </button>
            </div>

            {/* Add Exercise Button */}
            <button
                onClick={() => setShowExercisePicker(true)}
                className="w-full mb-6 py-4 bg-[#18181B] hover:bg-[#27272A] border-2 border-dashed border-white/10 hover:border-[#10B981]/30 rounded-2xl text-zinc-400 hover:text-[#10B981] font-medium transition-all flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Add Exercise
            </button>

            {/* Exercise List */}
            <div className="space-y-4">
                {workout.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((ex: any, index: number) => (
                        <div
                            key={ex.id}
                            className="group bg-[#18181B] hover:bg-[#27272A] border border-white/5 rounded-2xl p-4 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                {/* Drag Handle */}
                                <div className="cursor-grab text-zinc-600 hover:text-zinc-400">
                                    <GripVertical className="w-5 h-5" />
                                </div>

                                {/* Order */}
                                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-bold text-sm">
                                    {index + 1}
                                </div>

                                {/* Image */}
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0">
                                    {ex.exercise_library.media_url ? (
                                        <Image
                                            src={ex.exercise_library.media_url}
                                            alt={ex.exercise_library.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">💪</div>
                                    )}
                                </div>

                                {/* Exercise Info */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{ex.exercise_library.name}</h3>
                                    <p className="text-sm text-zinc-500">{ex.exercise_library.primary_muscle}</p>
                                </div>

                                {/* Config */}
                                <div className="flex gap-3">
                                    <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                                        <span className="text-xs text-zinc-500">Sets:</span>{' '}
                                        <span className="text-sm font-bold text-white">{ex.sets}</span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                                        <span className="text-xs text-zinc-500">Reps:</span>{' '}
                                        <span className="text-sm font-bold text-white">{ex.reps || '-'}</span>
                                    </div>
                                </div>

                                {/* Delete */}
                                <button
                                    onClick={() => setExerciseToRemove({ id: ex.id, name: ex.exercise_library.name })}
                                    className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-[#18181B] rounded-2xl border border-white/5 border-dashed">
                        <p className="text-zinc-500 mb-4">No exercises added yet</p>
                        <button
                            onClick={() => setShowExercisePicker(true)}
                            className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Your First Exercise
                        </button>
                    </div>
                )}
            </div>

            {/* Exercise Picker Modal */}
            {showExercisePicker && (
                <ExercisePicker onSelect={handleSelectExercise} onClose={() => setShowExercisePicker(false)} />
            )}

            {/* Exercise Config Modal */}
            <ExerciseConfigModal
                exercise={selectedExercise}
                onClose={() => setSelectedExercise(null)}
                onConfirm={handleAddExercise}
            />

            {/* Confirm Remove Dialog */}
            <ConfirmDialog
                open={!!exerciseToRemove}
                onClose={() => setExerciseToRemove(null)}
                onConfirm={handleRemoveExercise}
                title="Remove Exercise?"
                message={`Are you sure you want to remove ${exerciseToRemove?.name || 'this exercise'} from your workout?`}
                confirmText="Remove"
                variant="danger"
            />
        </div>
    )
}
