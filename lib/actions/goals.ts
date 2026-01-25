'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type GoalType = 'strength' | 'weight_loss' | 'weight_gain' | 'volume' | 'consistency'
export type GoalStatus = 'active' | 'completed' | 'archived'

export interface FitnessGoal {
    id: string
    user_id: string
    title: string
    description: string | null
    goal_type: GoalType
    target_value: number
    current_value: number
    unit: string
    exercise_id: string | null
    initial_value: number
    target_date: string | null
    started_at: string
    completed_at: string | null
    status: GoalStatus
    created_at: string
    updated_at: string
}

// CreateGoalData is imported from validations

import { createGoalSchema, updateGoalSchema, CreateGoalData } from '@/lib/validations/goals'

// ... existing code ...

/**
 * Create a new fitness goal
 */
export async function createGoal(data: CreateGoalData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const validationResult = createGoalSchema.safeParse(data)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    const { data: goal, error } = await supabase
        .from('fitness_goals')
        .insert({
            user_id: user.id,
            ...validatedData,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { data: goal, error: null }
}

/**
 * Get goals by status
 */
export async function getGoals(status?: GoalStatus) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    let query = supabase
        .from('fitness_goals')
        .select(`
      *,
      exercise:exercise_library(id, name, primary_muscle)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get active goals (for dashboard)
 */
export async function getDashboardGoals() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .rpc('get_active_goals', { p_user_id: user.id })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get goal by ID
 */
export async function getGoalById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('fitness_goals')
        .select(`
      *,
      exercise:exercise_library(id, name, primary_muscle, equipment)
    `)
        .eq('id', id)
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Update goal
 */
export async function updateGoal(id: string, updates: Partial<CreateGoalData> & { current_value?: number }) {
    const supabase = await createClient()
    
    // Validate inputs
    const validationResult = updateGoalSchema.safeParse(updates)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedUpdates = validationResult.data

    const { error } = await supabase
        .from('fitness_goals')
        .update(validatedUpdates)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { error: null }
}

/**
 * Delete goal
 */
export async function deleteGoal(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('fitness_goals')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { error: null }
}

/**
 * Complete goal manually
 */
export async function completeGoal(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('fitness_goals')
        .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { error: null }
}

/**
 * Archive goal
 */
export async function archiveGoal(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('fitness_goals')
        .update({ status: 'archived' })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { error: null }
}

/**
 * Update goal progress (call after relevant actions)
 */
export async function updateGoalProgress(goalId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get the goal to determine type
    const { data: goal } = await supabase
        .from('fitness_goals')
        .select('goal_type, exercise_id')
        .eq('id', goalId)
        .single()

    if (!goal) {
        return { error: 'Goal not found' }
    }

    // Call appropriate update function based on goal type
    let error = null

    switch (goal.goal_type) {
        case 'strength':
            if (goal.exercise_id) {
                const result = await supabase.rpc('update_strength_goal_progress', {
                    p_user_id: user.id,
                    p_exercise_id: goal.exercise_id,
                })
                error = result.error
            }
            break

        case 'volume':
            const volumeResult = await supabase.rpc('update_volume_goal_progress', {
                p_user_id: user.id,
            })
            error = volumeResult.error
            break

        case 'consistency':
            const consistencyResult = await supabase.rpc('update_consistency_goal_progress', {
                p_user_id: user.id,
            })
            error = consistencyResult.error
            break

        case 'weight_loss':
        case 'weight_gain':
            // Get latest body weight
            const { data: latestStat } = await supabase
                .from('body_stats')
                .select('weight_kg')
                .eq('user_id', user.id)
                .order('measured_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (latestStat) {
                await supabase
                    .from('fitness_goals')
                    .update({ current_value: latestStat.weight_kg })
                    .eq('id', goalId)
            }
            break
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { error: null }
}

/**
 * Update all user goals (call after workout completion)
 */
export async function updateAllGoals() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Update all goal types
    await Promise.all([
        supabase.rpc('update_volume_goal_progress', { p_user_id: user.id }),
        supabase.rpc('update_consistency_goal_progress', { p_user_id: user.id }),
    ])

    revalidatePath('/goals')
    revalidatePath('/dashboard')
    return { error: null }
}
