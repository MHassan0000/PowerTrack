import { getGoals } from '@/lib/actions/goals'
import { getExercises } from '@/lib/actions/exercises'
import { GoalsPageContent } from '@/components/goals/GoalsPageContent'

export const metadata = {
    title: 'Goals | PowerTrack',
    description: 'Set and track your fitness goals',
}

export default async function GoalsPage() {
    const [goalsResult, exercisesResult] = await Promise.all([
        getGoals(),
        getExercises(),
    ])

    const goals = goalsResult.data || []
    const exercises = exercisesResult.data?.map((e: { id: string; name: string }) => ({ id: e.id, name: e.name })) || []

    return <GoalsPageContent initialGoals={goals} exercises={exercises} />
}
