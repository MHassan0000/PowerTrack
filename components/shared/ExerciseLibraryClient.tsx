'use client'

import { useState, useMemo } from 'react'
import { ExerciseCard } from '@/components/shared/ExerciseCard'
import { ExerciseFilters } from '@/components/shared/ExerciseFilters'
import { Exercise } from '@/lib/actions/exercises'

interface ExerciseLibraryClientProps {
    exercises: Exercise[]
    muscles: string[]
    equipment: string[]
}

export function ExerciseLibraryClient({ exercises, muscles, equipment }: ExerciseLibraryClientProps) {
    const [search, setSearch] = useState('')
    const [activeMuscle, setActiveMuscle] = useState('')
    const [activeEquipment, setActiveEquipment] = useState('')
    const [activeDifficulty, setActiveDifficulty] = useState('')

    // Client-side filtering - INSTANT, no server calls
    const filteredExercises = useMemo(() => {
        return exercises.filter((exercise) => {
            // Search filter
            if (search) {
                const searchLower = search.toLowerCase()
                const matchesSearch = 
                    exercise.name.toLowerCase().includes(searchLower) ||
                    exercise.description?.toLowerCase().includes(searchLower) ||
                    exercise.primary_muscle.toLowerCase().includes(searchLower)
                
                if (!matchesSearch) return false
            }

            // Muscle filter
            if (activeMuscle && exercise.primary_muscle !== activeMuscle) {
                return false
            }

            // Equipment filter
            if (activeEquipment && exercise.equipment !== activeEquipment) {
                return false
            }

            // Difficulty filter
            if (activeDifficulty && exercise.difficulty !== activeDifficulty) {
                return false
            }

            return true
        })
    }, [exercises, search, activeMuscle, activeEquipment, activeDifficulty])

    return (
        <>
            {/* Filters */}
            <ExerciseFilters
                muscles={muscles}
                equipment={equipment}
                search={search}
                setSearch={setSearch}
                activeMuscle={activeMuscle}
                setActiveMuscle={setActiveMuscle}
                activeEquipment={activeEquipment}
                setActiveEquipment={setActiveEquipment}
                activeDifficulty={activeDifficulty}
                setActiveDifficulty={setActiveDifficulty}
            />

            {/* Results */}
            <div>
                <p className="text-sm text-zinc-500 mb-4">
                    {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'} found
                </p>

                {filteredExercises.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExercises.map((exercise, index) => (
                            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#18181B] rounded-2xl border border-white/5">
                        <p className="text-zinc-400 text-lg mb-2">No exercises found</p>
                        <p className="text-zinc-600 text-sm">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
