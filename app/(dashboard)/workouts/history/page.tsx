import { getWorkoutHistory, type WorkoutSession } from '@/lib/actions/workout-sessions'
import { WorkoutHistoryCard } from '@/components/workout/WorkoutHistoryCard'
import Link from 'next/link'
import { Activity, Calendar } from 'lucide-react'

export const metadata = {
    title: 'Workout History | PowerTrack',
    description: 'View your workout history and progress over time',
}

export default async function WorkoutHistoryPage() {
    const { data: sessions, error } = await getWorkoutHistory(50)

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center py-12">
                    <p className="text-[rgb(var(--foreground-muted))]">
                        Failed to load workout history
                    </p>
                </div>
            </div>
        )
    }

    const isEmpty = !sessions || sessions.length === 0

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Workout History</h1>
                <p className="text-[rgb(var(--foreground-muted))]">
                    Track your progress over time
                </p>
            </div>

            {/* Stats Summary */}
            {!isEmpty && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-[rgb(var(--primary))]" />
                            <span className="text-sm text-[rgb(var(--foreground-muted))]">
                                Total Workouts
                            </span>
                        </div>
                        <div className="text-2xl font-bold glow-text">{sessions.length}</div>
                    </div>
                    <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[rgb(var(--primary))]" />
                            <span className="text-sm text-[rgb(var(--foreground-muted))]">
                                Total Sets
                            </span>
                        </div>
                        <div className="text-2xl font-bold glow-text">
                            {sessions.reduce((acc: number, s: WorkoutSession) => acc + s.total_sets, 0)}
                        </div>
                    </div>
                    <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[rgb(var(--primary))]" />
                            <span className="text-sm text-[rgb(var(--foreground-muted))]">
                                Total Reps
                            </span>
                        </div>
                        <div className="text-2xl font-bold glow-text">
                            {sessions.reduce((acc: number, s: WorkoutSession) => acc + s.total_reps, 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[rgb(var(--primary))]" />
                            <span className="text-sm text-[rgb(var(--foreground-muted))]">
                                Total Volume
                            </span>
                        </div>
                        <div className="text-2xl font-bold glow-text">
                            {Math.round(sessions.reduce((acc: number, s: WorkoutSession) => acc + s.total_volume_kg, 0)).toLocaleString()}
                            <span className="text-sm font-normal">kg</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Workout List */}
            {isEmpty ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-[rgb(var(--primary))]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Workouts Yet</h2>
                    <p className="text-[rgb(var(--foreground-muted))] mb-6">
                        Start your first workout to see it here
                    </p>
                    <Link
                        href="/workouts"
                        className="inline-block px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium"
                    >
                        Browse Workouts
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session: WorkoutSession) => (
                        <WorkoutHistoryCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    )
}
