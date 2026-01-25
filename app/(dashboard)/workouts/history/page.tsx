
import { getWorkoutHistory, type WorkoutSession } from '@/lib/actions/workout-sessions'
import { WorkoutHistoryCard } from '@/components/workout/WorkoutHistoryCard'
import { ClearHistoryButton } from '@/components/workout/ClearHistoryButton'
import Link from 'next/link'
import { Activity, Calendar, Award, TrendingUp } from 'lucide-react'

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
                    <p className="text-zinc-500">
                        Failed to load workout history
                    </p>
                </div>
            </div>
        )
    }

    const isEmpty = !sessions || sessions.length === 0

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Workout History</h1>
                    <p className="text-zinc-400">
                        Track your progress and consistency over time
                    </p>
                </div>
                {!isEmpty && <ClearHistoryButton />}
            </div>

            {/* Stats Summary */}
            {!isEmpty && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Sessions</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{sessions.length}</div>
                    </div>
                    
                    <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Sets</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                             {sessions.reduce((acc: number, s: WorkoutSession) => acc + s.total_sets, 0)}
                        </div>
                    </div>

                    <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Reps</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {sessions.reduce((acc: number, s: WorkoutSession) => acc + s.total_reps, 0).toLocaleString()}
                        </div>
                    </div>

                    <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <Award className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Volume</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                             {Math.round(sessions.reduce((acc: number, s: WorkoutSession) => acc + s.total_volume_kg, 0) / 1000)}k
                             <span className="text-sm text-zinc-500 font-medium ml-1">kg</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Workout List */}
            {isEmpty ? (
                <div className="text-center py-20 bg-[#18181B] rounded-3xl border border-white/5 border-dashed">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Workouts Yet</h2>
                    <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                        Your history is empty. Start your first workout to see your progress here.
                    </p>
                    <Link
                        href="/workouts"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#10B981] text-black font-bold rounded-xl hover:bg-[#059669] transition-colors"
                    >
                        Browse Workouts
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h2 className="text-lg font-bold text-white">Recent Sessions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sessions.map((session: WorkoutSession) => (
                            <WorkoutHistoryCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
