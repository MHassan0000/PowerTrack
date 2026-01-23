import { getExercises } from '@/lib/actions/exercises'
import { ExerciseCard } from '@/components/shared/ExerciseCard'
import { ExerciseFilters } from '@/components/shared/ExerciseFilters'

export const dynamic = 'force-dynamic'

interface ExercisesPageProps {
    searchParams: Promise<{
        search?: string
        muscle?: string
        equipment?: string
        difficulty?: string
    }>
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
    // Await the searchParams Promise (Server Component can use await)
    const params = await searchParams
    
    // Fetch exercises with filters
    const exercisesResult = await getExercises({
        search: params.search,
        muscle: params.muscle,
        equipment: params.equipment,
        difficulty: params.difficulty,
    })

    const exercises = exercisesResult?.data || []

    // Get unique values for filters from all exercises
    const allResult = await getExercises()
    const allExercises = allResult?.data || []
    
    const muscles = [...new Set(allExercises.map((e: any) => e.primary_muscle).filter(Boolean))]
    const equipment = [...new Set(allExercises.map((e: any) => e.equipment).filter(Boolean))]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Exercise Library</h1>
                <p className="text-zinc-400">
                    Browse our extensive collection of exercises with detailed instructions
                </p>
            </div>

            {/* Filters */}
            <ExerciseFilters
                muscles={muscles as string[]}
                equipment={equipment as string[]}
            />

            {/* Results */}
            <div>
                <p className="text-sm text-zinc-500 mb-4">
                    {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} found
                </p>

                {exercises.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.map((exercise: any, index: number) => (
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
        </div>
    )
}
