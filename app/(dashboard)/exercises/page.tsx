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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Exercises
                    </h1>
                    <p className="text-zinc-400">
                        {exercises?.length || 0} premium sessions available for your level
                    </p>
                </div>
                
                
            </div>

            {/* Filters */}
            <ExerciseFilters muscles={muscles || []} equipment={equipmentTypes || []} />

            {/* Exercise Grid */}
            {exercises && exercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {exercises.map((exercise, index) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-[#18181B] border border-white/5 rounded-3xl">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-zinc-400">
                        No exercises found. Try adjusting your filters.
                    </p>
                </div>
            )}
        </div>
    )
}
