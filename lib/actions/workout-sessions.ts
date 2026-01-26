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

import { setLogSchema, startSessionSchema, completeSessionSchema, SetData } from '@/lib/validations/workouts'

/**
 * Start a new workout session
 */
export async function startWorkoutSession(workoutId: string | null, workoutName: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const validationResult = startSessionSchema.safeParse({ workoutId, workoutName })
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const data = validationResult.data

    // Verify user doesn't have an active session
    const { data: activeSession } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .single()

    if (activeSession) {
        return { error: 'You already have an active session' }
    }

    const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
            user_id: user.id,
            workout_id: data.workoutId || null,
            workout_name: data.workoutName,
            started_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/workouts')
    return { data: session, error: null }
}

/**
 * Log a set
 */
export async function logSet(sessionId: string, setData: SetData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const validationResult = setLogSchema.safeParse(setData)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedSet = validationResult.data

    // Verify session belongs to user
    const { data: session } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single()

    if (!session) {
        return { error: 'Session not found' }
    }

    const { data, error } = await supabase
        .from('set_logs')
        .insert({
            session_id: sessionId,
            exercise_id: validatedSet.exercise_id,
            set_number: validatedSet.set_number,
            reps: validatedSet.reps || null,
            weight_kg: validatedSet.weight_kg || null,
            duration_seconds: validatedSet.duration_seconds || null,
            rest_seconds: validatedSet.rest_seconds || null,
            rpe: validatedSet.rpe || null,
            is_warmup: validatedSet.is_warmup || false,
            is_failure: validatedSet.is_failure || false,
            notes: validatedSet.notes || null,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    // Update session stats
    await updateSessionStats(sessionId)

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
        return { error: error.message }
    }

    return { error: null }
}

/**
 * Complete workout session
 */
export async function completeWorkoutSession(sessionId: string, notes?: string, activeDurationSeconds?: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const validationResult = completeSessionSchema.safeParse({ sessionId, notes })
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    // Get session start time to calculate duration
    const { data: session } = await supabase
        .from('workout_sessions')
        .select('started_at, workout_id')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single()

    if (!session) {
        return { error: 'Session not found' }
    }

    const completedAt = new Date()
    let finalDurationSeconds = 0

    if (activeDurationSeconds !== undefined) {
        finalDurationSeconds = activeDurationSeconds
    } else {
        const startedAt = new Date(session.started_at)
        finalDurationSeconds = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)
    }

    // Update session
    const { error: updateError } = await supabase
        .from('workout_sessions')
        .update({
            completed_at: completedAt.toISOString(),
            duration_seconds: finalDurationSeconds,
            notes: validatedData.notes || null,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)

    if (updateError) {
        console.error('Error completing workout session:', updateError)
        return { error: updateError.message }
    }

    // Calculate stats
    await updateSessionStats(sessionId)

    // Get updated session with stats
    const { data: finalSession } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

    // Don't revalidate here - let the user navigate manually from completion summary
    
    return { 
        data: {
            session: finalSession,
            durationSeconds: finalDurationSeconds,
            workoutId: session.workout_id
        },
        error: null 
    }
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
        return { error: error.message }
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
        return { error: error.message }
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
        return { error: error.message }
    }

    revalidatePath('/workouts/active')
    return { error: null }
}

/**
 * Clear all workout history for the current user
 */
export async function clearAllWorkoutHistory() {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Delete all workout sessions for this user
    const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/workouts/history')
    return { error: null }
}
