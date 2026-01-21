import { getWorkoutById } from '@/lib/actions/workouts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton'

interface WorkoutDetailPageProps {
    params: {
        id: string
    }
}

export default async function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
    const { data: workout, error } = await getWorkoutById(params.id)

    if (error || !workout) {
        notFound()
    }

    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
    const estimatedDuration = workout.exercises.reduce((sum, ex) => {
        const setTime = ex.duration_seconds || (ex.reps ? ex.reps * 3 : 30) // Estimate 3 sec per rep
        const totalSetTime = setTime * ex.sets
        const totalRest = ex.rest_seconds * (ex.sets - 1)
        return sum + totalSetTime + totalRest
    }, 0)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                href="/workouts"
                className="inline-flex items-center gap-2 text-[rgb(var(--primary))] hover:underline"
            >
                ← Back to Workouts
            </Link>

            {/* Workout Header */}
            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold glow-text mb-2">{workout.name}</h1>
                        {workout.description && (
                            <p className="text-lg text-[rgb(var(--foreground-secondary))]">
                                {workout.description}
                            </p>
                        )}
                    </div>
                    <Link
                        href={`/workouts/${workout.id}/edit`}
                        className="px-4 py-2 bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] border border-[rgb(var(--primary))] rounded-lg hover:bg-[rgb(var(--primary))]/30 transition-all"
                    >
                        Edit Workout
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-4">
                        <div className="text-[rgb(var(--foreground-muted))] text-sm mb-1">Exercises</div>
                        <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                            {workout.exercises.length}
                        </div>
                    </div>
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-4">
                        <div className="text-[rgb(var(--foreground-muted))] text-sm mb-1">Total Sets</div>
                        <div className="text-2xl font-bold text-[rgb(var(--primary))]">{totalSets}</div>
                    </div>
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-4">
                        <div className="text-[rgb(var(--foreground-muted))] text-sm mb-1">Est. Duration</div>
                        <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                            {Math.round(estimatedDuration / 60)} min
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercise List */}
            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Exercises</h2>

                {workout.exercises.length > 0 ? (
                    <div className="space-y-4">
                        {workout.exercises.map((ex, index) => (
                            <div
                                key={ex.id}
                                className="flex gap-4 p-4 bg-[rgb(var(--background-secondary))] rounded-lg hover:bg-[rgb(var(--card-hover))] transition-colors"
                            >
                                {/* Order Number */}
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--primary))]/20 border border-[rgb(var(--primary))]/50 flex items-center justify-center font-bold text-[rgb(var(--primary))]">
                                    {index + 1}
                                </div>

                                {/* Exercise Image */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-[rgb(var(--background))] overflow-hidden">
                                    {ex.exercise_library.media_url ? (
                                        <Image
                                            src={ex.exercise_library.media_url}
                                            alt={ex.exercise_library.name}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                            💪
                                        </div>
                                    )}
                                </div>

                                {/* Exercise Details */}
                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">{ex.exercise_library.name}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-[rgb(var(--foreground-muted))]">
                                        <span>
                                            {ex.sets} sets × {ex.reps ? `${ex.reps} reps` : `${ex.duration_seconds}s`}
                                        </span>
                                        {ex.weight_kg && <span>@ {ex.weight_kg} kg</span>}
                                        <span>Rest: {ex.rest_seconds}s</span>
                                    </div>
                                    {ex.notes && (
                                        <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-2">
                                            💡 {ex.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Muscle & Equipment Tags */}
                                <div className="flex flex-col gap-2 text-xs">
                                    <span className="px-2 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded text-center">
                                        {ex.exercise_library.primary_muscle}
                                    </span>
                                    <span className="px-2 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded text-center">
                                        {ex.exercise_library.equipment}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-[rgb(var(--foreground-muted))]">
                        <p>No exercises added yet</p>
                        <Link
                            href={`/workouts/${workout.id}/edit`}
                            className="inline-block mt-4 text-[rgb(var(--primary))] hover:underline"
                        >
                            Add exercises →
                        </Link>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <StartWorkoutButton workoutId={workout.id} workoutName={workout.name} />
        </div>
    )
}
