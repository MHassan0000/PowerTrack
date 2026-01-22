'use server'

import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
    totalWorkoutsThisWeek: number
    totalDurationMinutes: number
    totalVolumeKg: number
    totalSets: number
    totalReps: number
    caloriesBurned: number
    streakDays: number
}

/**
 * Get dashboard statistics for today and this week
 */
export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    // Get start of current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    startOfWeek.setHours(0, 0, 0, 0)

    // Get all completed sessions this week
    const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select('duration_seconds, total_sets, total_reps, total_volume_kg, completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .gte('completed_at', startOfWeek.toISOString())

    if (error) {
        console.error('Error fetching dashboard stats:', error)
        return { data: null, error: error.message }
    }

    // Calculate totals
    const totalWorkoutsThisWeek = sessions?.length || 0
    const totalDurationMinutes = Math.round(
        (sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0) / 60
    )
    const totalVolumeKg = sessions?.reduce((acc, s) => acc + (s.total_volume_kg || 0), 0) || 0
    const totalSets = sessions?.reduce((acc, s) => acc + (s.total_sets || 0), 0) || 0
    const totalReps = sessions?.reduce((acc, s) => acc + (s.total_reps || 0), 0) || 0
    
    // Estimate calories burned (rough estimate: 5 cal per minute of workout)
    const caloriesBurned = totalDurationMinutes * 5

    // Calculate streak (consecutive days with workouts)
    let streakDays = 0
    if (sessions && sessions.length > 0) {
        const workoutDates = new Set(
            sessions.map(s => new Date(s.completed_at!).toDateString())
        )
        const today = new Date()
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(today.getDate() - i)
            if (workoutDates.has(checkDate.toDateString())) {
                streakDays++
            } else if (i > 0) {
                break
            }
        }
    }

    return {
        data: {
            totalWorkoutsThisWeek,
            totalDurationMinutes,
            totalVolumeKg,
            totalSets,
            totalReps,
            caloriesBurned,
            streakDays,
        },
        error: null
    }
}

/**
 * Get today's date formatted nicely
 */
export async function getFormattedDate(): Promise<string> {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    }
    return now.toLocaleDateString('en-US', options)
}

/**
 * Get appropriate greeting based on time of day
 */
export async function getGreeting(): Promise<string> {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}
