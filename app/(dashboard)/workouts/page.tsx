import { getWorkouts } from '@/lib/actions/workouts'
import { WorkoutCard } from '@/components/shared/WorkoutCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WorkoutsPage() {
    const { data: workouts, error } = await getWorkouts()

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-400">Error loading workouts: {error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold glow-text mb-2">My Workouts</h1>
                    <p className="text-[rgb(var(--foreground-muted))] text-lg">
                        Create and manage your workout templates
                    </p>
                </div>
                <Link
                    href="/workouts/new"
                    className="px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                >
                    + New Workout
                </Link>
            </div>

            {/* Workouts Grid */}
            {workouts && workouts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workouts.map((workout, index) => (
                        <WorkoutCard key={workout.id} workout={workout} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl">
                    <p className="text-6xl mb-4">🏋️</p>
                    <p className="text-xl font-bold mb-2">No Workouts Yet</p>
                    <p className="text-[rgb(var(--foreground-muted))] mb-6">
                        Create your first workout template to get started
                    </p>
                    <Link
                        href="/workouts/new"
                        className="inline-block px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                    >
                        Create Workout
                    </Link>
                </div>
            )}
        </div>
    )
}
