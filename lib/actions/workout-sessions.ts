'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface WorkoutSession {
    id: string
    user_id: string
    workout_id: string | null
    workout_name: string
    started_at: string
    completed_at: string | null
    duration_seconds: number | null
    total_sets: number
    total_reps: number
    total_volume_kg: number
    notes: string | null
    created_at: string
    updated_at: string
}

export interface SetLog {
    id: string
    session_id: string
    exercise_id: string
    set_number: number
    reps: number | null
    weight_kg: number | null
    duration_seconds: number | null
    rest_seconds: number | null
    rpe: number | null
    is_warmup: boolean
    is_failure: boolean
    notes: string | null
    logged_at: string
    created_at: string
}

export interface SetData {
    exercise_id: string
    set_number: number
    reps?: number
    weight_kg?: number
    duration_seconds?: number
    rest_seconds?: number
    rpe?: number
    is_warmup?: boolean
    is_failure?: boolean
    notes?: string
}

/**
 * Start a new workout session
 */
export async function startWorkoutSession(workoutId: string | null, workoutName: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
            user_id: user.id,
            workout_id: workoutId,
            workout_name: workoutName,
            started_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        console.error('Error starting workout session:', error)
        return { error: error.message }
    }

    revalidatePath('/workouts')
    return { data, error: null }
}

/**
 * Log a set
 */
export async function logSet(sessionId: string, setData: SetData) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('set_logs')
        .insert({
            session_id: sessionId,
            ...setData,
        })
        .select()
        .single()

    if (error) {
        console.error('Error logging set:', error)
        return { error: error.message }
    }

    revalidatePath('/workouts/active')
    return { data, error: null }
}

/**
 * Update session statistics
 */
export async function updateSessionStats(sessionId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .rpc('calculate_session_stats', { p_session_id: sessionId })

    if (error) {
        console.error('Error updating session stats:', error)
        return { error: error.message }
    }

    return { error: null }
}

/**
 * Complete workout session
 */
export async function completeWorkoutSession(sessionId: string, notes?: string) {
    const supabase = await createClient()

    // Get session start time to calculate duration
    const { data: session } = await supabase
        .from('workout_sessions')
        .select('started_at')
        .eq('id', sessionId)
        .single()

    if (!session) {
        return { error: 'Session not found' }
    }

    const startedAt = new Date(session.started_at)
    const completedAt = new Date()
    const durationSeconds = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)

    // Update session
    const { error: updateError } = await supabase
        .from('workout_sessions')
        .update({
            completed_at: completedAt.toISOString(),
            duration_seconds: durationSeconds,
            notes: notes || null,
        })
        .eq('id', sessionId)

    if (updateError) {
        console.error('Error completing workout session:', updateError)
        return { error: updateError.message }
    }

    // Calculate stats
    await updateSessionStats(sessionId)

    revalidatePath('/workouts')
    revalidatePath('/workouts/history')
    return { error: null }
}

/**
 * Get active session (not completed)
 */
export async function getActiveSession() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error('Error fetching active session:', error)
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get workout history
 */
export async function getWorkoutHistory(limit: number = 20) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching workout history:', error)
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get session details with all sets
 */
export async function getSessionDetails(sessionId: string) {
    const supabase = await createClient()

    // Get session
    const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

    if (sessionError) {
        return { data: null, error: sessionError.message }
    }

    // Get all sets with exercise details
    const { data: sets, error: setsError } = await supabase
        .from('set_logs')
        .select(`
      *,
      exercise:exercise_library(id, name, primary_muscle, equipment)
    `)
        .eq('session_id', sessionId)
        .order('logged_at', { ascending: true })

    if (setsError) {
        return { data: null, error: setsError.message }
    }

    return {
        data: {
            session,
            sets,
        },
        error: null,
    }
}

/**
 * Get sets for a session
 */
export async function getSessionSets(sessionId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('set_logs')
        .select(`
      *,
      exercise:exercise_library(id, name, primary_muscle, equipment)
    `)
        .eq('session_id', sessionId)
        .order('logged_at', { ascending: true })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Delete workout session
 */
export async function deleteWorkoutSession(sessionId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId)

    if (error) {
        console.error('Error deleting workout session:', error)
        return { error: error.message }
    }

    revalidatePath('/workouts/history')
    return { error: null }
}

/**
 * Delete a set log
 */
export async function deleteSetLog(setId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('set_logs')
        .delete()
        .eq('id', setId)

    if (error) {
        console.error('Error deleting set:', error)
        return { error: error.message }
    }

    revalidatePath('/workouts/active')
    return { error: null }
}

