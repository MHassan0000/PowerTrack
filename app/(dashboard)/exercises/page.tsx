import { getExercises } from '@/lib/actions/exercises'
import{ ExerciseLibraryClient} from '@/components/shared/ExerciseLibraryClient'

export const dynamic = 'force-dynamic'

export default async function ExercisesPage() {
    // Fetch ALL exercises once on server
    const exercisesResult = await getExercises()
    const allExercises = exercisesResult?.data || []
    
    // Get unique values for filters
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

            {/* Client Component handles filtering */}
            <ExerciseLibraryClient 
                exercises={allExercises}
                muscles={muscles as string[]}
                equipment={equipment as string[]}
            />
        </div>
    )
}
