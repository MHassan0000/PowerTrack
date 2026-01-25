import { getSessionDetails } from '@/lib/actions/workout-sessions'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Dumbbell } from 'lucide-react'
import Link from 'next/link'
import { SessionDetailView } from '@/components/workout/SessionDetailView'
import { DeleteSessionButton } from '@/components/workout/DeleteSessionButton'

interface SessionDetailPageProps {
    params: Promise<{ sessionId: string }>
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
    const { sessionId } = await params
    const { data, error } = await getSessionDetails(sessionId)

    if (error || !data) {
        notFound()
    }

    const { session, sets } = data

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(dateString))
    }

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return 'N/A'
        const mins = Math.floor(seconds / 60)
        const hrs = Math.floor(mins / 60)
        const remainingMins = mins % 60

        if (hrs > 0) {
            return `${hrs}h ${remainingMins}m`
        }
        return `${mins}m`
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/workouts/history"
                    className="inline-flex items-center gap-2 text-[#10B981] hover:underline mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to History</span>
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{session.workout_name}</h1>
                        <p className="text-zinc-400">
                            {formatDate(session.completed_at || session.started_at)}
                        </p>
                    </div>

                    <DeleteSessionButton sessionId={sessionId} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sets</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{session.total_sets}</div>
                </div>

                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Reps</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{session.total_reps}</div>
                </div>

                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Volume</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {Math.round(session.total_volume_kg)}
                        <span className="text-sm font-normal text-zinc-400 ml-1">kg</span>
                    </div>
                </div>

                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5 hover:border-[#10B981]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Duration</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {formatDuration(session.duration_seconds)}
                    </div>
                </div>
            </div>

            {/* Session Detail View */}
            <SessionDetailView session={session} sets={sets} />
        </div>
    )
}
