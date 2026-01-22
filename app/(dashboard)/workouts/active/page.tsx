import { getActiveSession, getSessionSets } from '@/lib/actions/workout-sessions'
import { redirect } from 'next/navigation'
import { ActiveWorkoutView } from '@/components/workout/ActiveWorkoutView'

export default async function ActiveWorkoutPage() {
    const sessionResult = await getActiveSession()

    if (!sessionResult || sessionResult.error || !sessionResult.data) {
        redirect('/workouts')
    }

    const session = sessionResult.data
    const setsResult = await getSessionSets(session.id)

    return (
        <div className="min-h-screen pb-20">
            <ActiveWorkoutView session={session} sets={setsResult?.data || []} />
        </div>
    )
}
