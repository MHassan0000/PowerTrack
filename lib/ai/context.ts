import { createClient } from '@/lib/supabase/server'

interface UserContext {
    profile: any
    recentWorkouts: any[]
    activePlans: any[]
}

/**
 * Build comprehensive user context for AI assistant
 */
export async function getUserContext(userId: string): Promise<UserContext> {
    const supabase = await createClient()

    try {
        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        // Fetch recent workouts (last 5)
        const { data: workouts } = await supabase
            .from('workouts')
            .select(`
                *,
                workout_exercises (
                    exercise_name,
                    sets,
                    reps,
                    weight
                )
            `)
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(5)

        // Fetch active workout plans
        const { data: plans } = await supabase
            .from('workout_plans')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)

        return {
            profile: profile || {},
            recentWorkouts: workouts || [],
            activePlans: plans || [],
        }
    } catch (error) {
        console.error('Error fetching user context:', error)
        return {
            profile: {},
            recentWorkouts: [],
            activePlans: [],
        }
    }
}

/**
 * Format user context into a readable string for AI
 */
export function formatContextForAI(context: UserContext): string {
    const { profile, recentWorkouts, activePlans } = context

    let contextString = '# User Profile\n'
    
    if (profile.fitness_goal) {
        contextString += `- Primary Goal: ${profile.fitness_goal}\n`
    }
    
    if (profile.experience_level) {
        contextString += `- Experience Level: ${profile.experience_level}\n`
    }

    if (recentWorkouts.length > 0) {
        contextString += '\n# Recent Workouts\n'
        recentWorkouts.slice(0, 3).forEach((workout, idx) => {
            contextString += `\nWorkout ${idx + 1} (${workout.date}):\n`
            if (workout.workout_exercises) {
                workout.workout_exercises.forEach((ex: any) => {
                    contextString += `  - ${ex.exercise_name}: ${ex.sets} sets × ${ex.reps} reps`
                    if (ex.weight) contextString += ` @ ${ex.weight}kg`
                    contextString += '\n'
                })
            }
        })
    }

    if (activePlans.length > 0) {
        contextString += '\n# Active Plans\n'
        activePlans.forEach(plan => {
            contextString += `- ${plan.name}: ${plan.description || 'No description'}\n`
        })
    }

    return contextString
}
