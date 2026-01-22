'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { getExercises, type Exercise } from '@/lib/actions/exercises'
import Image from 'next/image'

interface ExercisePickerProps {
    onSelect: (exercise: Exercise) => void
    onClose: () => void
}

export function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedMuscle, setSelectedMuscle] = useState<string>('')

    const muscles = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quadriceps', 'Hamstrings', 'Glutes', 'Core', 'Calves']

    const fetchExercises = async (muscle?: string, searchQuery?: string) => {
        setLoading(true)
        const { data } = await getExercises({
            muscle: muscle || undefined,
            search: searchQuery || undefined,
        })
        setExercises(data || [])
        setLoading(false)
    }

    useState(() => {
        fetchExercises()
    })

    const handleMuscleFilter = (muscle: string) => {
        const newMuscle = selectedMuscle === muscle ? '' : muscle
        setSelectedMuscle(newMuscle)
        fetchExercises(newMuscle, search)
    }

    const handleSearch = (query: string) => {
        setSearch(query)
        fetchExercises(selectedMuscle, query)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#18181B] rounded-3xl border border-white/10 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Add Exercise</h2>
                        <p className="text-zinc-400 text-sm mt-1">Choose from {exercises.length} exercises</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                 {/* Search & Filters */}
                <div className="p-6 border-b border-white/5 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                        />
                    </div>

                    {/* Muscle Filters */}
                    <div className="flex flex-wrap gap-2">
                        {muscles.map((muscle) => (
                            <button
                                key={muscle}
                                onClick={() => handleMuscleFilter(muscle)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    selectedMuscle === muscle
                                        ? 'bg-[#10B981] text-black'
                                        : 'bg-[#27272A] text-zinc-400 hover:bg-[#3F3F46] hover:text-white'
                                }`}
                            >
                                {muscle}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exercise List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-12 text-zinc-500">Loading exercises...</div>
                    ) : exercises.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">No exercises found</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exercises.map((exercise) => (
                                <button
                                    key={exercise.id}
                                    onClick={() => onSelect(exercise)}
                                    className="group text-left p-4 bg-[#27272A] hover:bg-[#3F3F46] border border-white/5 hover:border-[#10B981]/30 rounded-xl transition-all"
                                >
                                    <div className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0">
                                            {exercise.media_url ? (
                                                <Image
                                                    src={exercise.media_url}
                                                    alt={exercise.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                    💪
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white group-hover:text-[#10B981] transition-colors truncate">
                                                {exercise.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500 mt-1">
                                                {exercise.primary_muscle} • {exercise.equipment}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
