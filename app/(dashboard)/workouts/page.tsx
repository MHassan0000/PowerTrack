import { getWorkouts } from '@/lib/actions/workouts'
import { WorkoutCard } from '@/components/shared/WorkoutCard'
import Link from 'next/link'
import { History } from 'lucide-react'

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Workouts</h1>
                    <p className="text-zinc-400">
                        Create and manage your workout templates
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/workouts/history"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#18181B] hover:bg-[#27272A] border border-white/5 text-white font-medium rounded-xl transition-all gap-2"
                    >
                        <History className="w-5 h-5" />
                        History
                    </Link>
                    <Link
                        href="/workouts/new"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#10B981] text-black font-bold rounded-xl hover:bg-[#059669] transition-all"
                    >
                        + New Workout
                    </Link>
                </div>
            </div>

            {/* Workouts Grid */}
            {workouts && workouts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workouts.map((workout, index) => (
                        <WorkoutCard key={workout.id} workout={workout} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-[#18181B] border border-white/5 rounded-2xl">
                    <p className="text-6xl mb-6 grayscale opacity-50">🏋️</p>
                    <p className="text-xl font-bold text-white mb-2">No Workouts Yet</p>
                    <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                        Create your first workout template to get started with your training journey.
                    </p>
                    <Link
                        href="/workouts/new"
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#10B981] text-black font-bold rounded-xl hover:bg-[#059669] transition-all"
                    >
                        Create Workout
                    </Link>
                </div>
            )}
        </div>
    )
}
