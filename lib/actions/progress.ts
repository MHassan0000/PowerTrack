'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface BodyStat {
    id: string
    user_id: string
    weight_kg: number
    measured_at: string
    notes: string | null
    created_at: string
    updated_at: string
}

export interface PersonalRecord {
    exercise_id: string
    exercise_name: string
    primary_muscle: string
    equipment: string
    pr_volume: number
    pr_weight: number
    pr_reps: number
    achieved_at: string
}

export interface VolumeDataPoint {
    workout_date: string
    workout_name: string
    total_volume: number
}

export interface WeightProgressPoint {
    workout_date: string
    max_weight: number
    max_reps: number
    max_volume: number
}

import { bodyStatSchema, updateBodyStatSchema } from '@/lib/validations/progress'

// ... existing code ...

/**
 * Add body stat entry
 */
export async function addBodyStat(weight_kg: number, measured_at: string, notes?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const validationResult = bodyStatSchema.safeParse({ weight_kg, measured_at, notes })
    if (!validationResult.success) {
        return { data: null, error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    const { data, error } = await supabase
        .from('body_stats')
        .insert({
            user_id: user.id,
            weight_kg: validatedData.weight_kg,
            measured_at: validatedData.measured_at,
            notes: validatedData.notes || null,
        })
        .select()
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    revalidatePath('/progress')
    return { data, error: null }
}

/**
 * Get body stats for a user
 */
export async function getBodyStats(days: number = 90) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('body_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('measured_at', startDate.toISOString().split('T')[0])
        .order('measured_at', { ascending: true })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}


/**
 * Update body stat
 */
export async function updateBodyStat(id: string, updates: { weight_kg?: number; notes?: string }) {
    const supabase = await createClient()

    const validationResult = updateBodyStatSchema.safeParse(updates)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedUpdates = validationResult.data

    const { error } = await supabase
        .from('body_stats')
        .update(validatedUpdates)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/progress')
    return { error: null }
}

/**
 * Delete body stat
 */
export async function deleteBodyStat(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('body_stats')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/progress')
    return { error: null }
}

/**
 * Get personal records
 */
export async function getPersonalRecords() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .rpc('get_user_personal_records', { p_user_id: user.id })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data: data as PersonalRecord[], error: null }
}

/**
 * Get volume chart data
 */
export async function getVolumeChartData(days: number = 90) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .rpc('get_volume_chart_data', {
            p_user_id: user.id,
            p_days: days
        })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data: data as VolumeDataPoint[], error: null }
}

/**
 * Get exercise weight progress
 */
export async function getExerciseWeightProgress(exerciseId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .rpc('get_exercise_weight_progress', {
            p_user_id: user.id,
            p_exercise_id: exerciseId
        })

    if (error) {
        return { data: null, error: error.message }
    }

    return { data: data as WeightProgressPoint[], error: null }
}

/**
 * Get workout frequency (for stats)
 */
export async function getWorkoutFrequency(days: number = 30) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('workout_sessions')
        .select('completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .gte('completed_at', startDate.toISOString())

    if (error) {
        return { data: null, error: error.message }
    }

    return { data: data?.length || 0, error: null }
}
