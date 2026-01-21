import { getActiveSession, getSessionSets } from '@/lib/actions/workout-sessions'
import { redirect } from 'next/navigation'
import { ActiveWorkoutView } from '@/components/workout/ActiveWorkoutView'

export default async function ActiveWorkoutPage() {
    const { data: session, error } = await getActiveSession()

    if (error || !session) {
        redirect('/workouts')
    }

    const { data: sets } = await getSessionSets(session.id)

    return (
        <div className="min-h-screen pb-20">
            <ActiveWorkoutView session={session} sets={sets || []} />
        </div>
    )
}
