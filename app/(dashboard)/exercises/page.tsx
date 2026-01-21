import { getExercises, getMuscleGroups, getEquipmentTypes } from '@/lib/actions/exercises'
import { ExerciseCard } from '@/components/shared/ExerciseCard'
import { ExerciseFilters } from '@/components/shared/ExerciseFilters'

export const dynamic = 'force-dynamic'

interface ExercisesPageProps {
    searchParams: {
        search?: string
        muscle?: string
        equipment?: string
        difficulty?: string
    }
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
    // Fetch exercises with filters
    const { data: exercises, error } = await getExercises({
        search: searchParams.search,
        muscle: searchParams.muscle,
        equipment: searchParams.equipment,
        difficulty: searchParams.difficulty,
    })

    // Fetch filter options
    const { data: muscles } = await getMuscleGroups()
    const { data: equipmentTypes } = await getEquipmentTypes()

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-400">Error loading exercises: {error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold glow-text mb-2">Exercise Library</h1>
                <p className="text-[rgb(var(--foreground-muted))] text-lg">
                    Browse our comprehensive collection of exercises
                </p>
            </div>

            {/* Filters */}
            <ExerciseFilters muscles={muscles || []} equipment={equipmentTypes || []} />

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-[rgb(var(--foreground-muted))]">
                    {exercises?.length || 0} exercises found
                </p>
            </div>

            {/* Exercise Grid */}
            {exercises && exercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map((exercise, index) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl">
                    <p className="text-2xl mb-2">🔍</p>
                    <p className="text-[rgb(var(--foreground-muted))]">
                        No exercises found. Try adjusting your filters.
                    </p>
                </div>
            )}
        </div>
    )
}
