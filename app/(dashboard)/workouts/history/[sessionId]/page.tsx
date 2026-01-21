import { getSessionDetails, deleteWorkoutSession } from '@/lib/actions/workout-sessions'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Dumbbell, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { SessionDetailView } from '@/components/workout/SessionDetailView'

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

    async function handleDelete(formData: FormData) {
        'use server'
        const sessionId = formData.get('sessionId') as string
        await deleteWorkoutSession(sessionId)
        redirect('/workouts/history')
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/workouts/history"
                    className="inline-flex items-center gap-2 text-[rgb(var(--primary))] hover:underline mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to History</span>
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{session.workout_name}</h1>
                        <p className="text-[rgb(var(--foreground-muted))]">
                            {formatDate(session.completed_at || session.started_at)}
                        </p>
                    </div>

                    <form action={handleDelete}>
                        <input type="hidden" name="sessionId" value={sessionId} />
                        <button
                            type="submit"
                            className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this workout session?')) {
                                    e.preventDefault()
                                }
                            }}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-[rgb(var(--primary))]" />
                        <span className="text-sm text-[rgb(var(--foreground-muted))]">Sets</span>
                    </div>
                    <div className="text-3xl font-bold glow-text">{session.total_sets}</div>
                </div>

                <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-[rgb(var(--primary))]" />
                        <span className="text-sm text-[rgb(var(--foreground-muted))]">Reps</span>
                    </div>
                    <div className="text-3xl font-bold glow-text">{session.total_reps}</div>
                </div>

                <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-[rgb(var(--primary))]" />
                        <span className="text-sm text-[rgb(var(--foreground-muted))]">Volume</span>
                    </div>
                    <div className="text-3xl font-bold glow-text">
                        {Math.round(session.total_volume_kg)}
                        <span className="text-sm font-normal">kg</span>
                    </div>
                </div>

                <div className="bg-[rgb(var(--card))] rounded-xl p-4 glow-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[rgb(var(--primary))]" />
                        <span className="text-sm text-[rgb(var(--foreground-muted))]">Duration</span>
                    </div>
                    <div className="text-3xl font-bold glow-text">
                        {formatDuration(session.duration_seconds)}
                    </div>
                </div>
            </div>

            {/* Session Detail View */}
            <SessionDetailView session={session} sets={sets} />
        </div>
    )
}
