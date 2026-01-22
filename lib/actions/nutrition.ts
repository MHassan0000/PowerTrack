'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other'

export interface NutritionLog {
    id: string
    user_id: string
    meal_type: MealType
    food_item: string
    calories: number | null
    protein_g: number | null
    carbs_g: number | null
    fat_g: number | null
    fiber_g: number | null
    sugar_g: number | null
    notes: string | null
    logged_at: string
    created_at: string
}

export interface DailyNutritionSummary {
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
    totalFiber: number
    totalSugar: number
    mealCount: number
}

export interface CreateNutritionLogInput {
    meal_type: MealType
    food_item: string
    calories?: number
    protein_g?: number
    carbs_g?: number
    fat_g?: number
    fiber_g?: number
    sugar_g?: number
    notes?: string
    logged_at?: string
}

/**
 * Add a new nutrition log
 */
export async function addNutritionLog(input: CreateNutritionLogInput): Promise<{ data: NutritionLog | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('nutrition_logs')
        .insert({
            user_id: user.id,
            meal_type: input.meal_type,
            food_item: input.food_item,
            calories: input.calories || null,
            protein_g: input.protein_g || null,
            carbs_g: input.carbs_g || null,
            fat_g: input.fat_g || null,
            fiber_g: input.fiber_g || null,
            sugar_g: input.sugar_g || null,
            notes: input.notes || null,
            logged_at: input.logged_at || new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    revalidatePath('/nutrition')
    return { data, error: null }
}

/**
 * Get nutrition logs for a specific date
 */
export async function getNutritionLogs(date?: string): Promise<{ data: NutritionLog[]; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: [], error: 'Not authenticated' }
    }

    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', startOfDay.toISOString())
        .lte('logged_at', endOfDay.toISOString())
        .order('logged_at', { ascending: true })

    if (error) {
        return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
}

/**
 * Get daily nutrition summary for a specific date
 */
export async function getDailyNutritionSummary(date?: string): Promise<{ data: DailyNutritionSummary; error: string | null }> {
    const { data: logs, error } = await getNutritionLogs(date)

    if (error) {
        return {
            data: { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0, totalSugar: 0, mealCount: 0 },
            error
        }
    }

    const summary: DailyNutritionSummary = {
        totalCalories: logs.reduce((acc, log) => acc + (log.calories || 0), 0),
        totalProtein: logs.reduce((acc, log) => acc + (Number(log.protein_g) || 0), 0),
        totalCarbs: logs.reduce((acc, log) => acc + (Number(log.carbs_g) || 0), 0),
        totalFat: logs.reduce((acc, log) => acc + (Number(log.fat_g) || 0), 0),
        totalFiber: logs.reduce((acc, log) => acc + (Number(log.fiber_g) || 0), 0),
        totalSugar: logs.reduce((acc, log) => acc + (Number(log.sugar_g) || 0), 0),
        mealCount: logs.length,
    }

    return { data: summary, error: null }
}

/**
 * Delete a nutrition log
 */
export async function deleteNutritionLog(id: string): Promise<{ error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/nutrition')
    return { error: null }
}

/**
 * Get nutrition logs grouped by meal type for a day
 */
export async function getNutritionLogsByMeal(date?: string): Promise<{ data: Record<MealType, NutritionLog[]>; error: string | null }> {
    const { data: logs, error } = await getNutritionLogs(date)

    if (error) {
        return {
            data: { breakfast: [], lunch: [], dinner: [], snack: [], other: [] },
            error
        }
    }

    const grouped: Record<MealType, NutritionLog[]> = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
        other: [],
    }

    logs.forEach(log => {
        if (grouped[log.meal_type]) {
            grouped[log.meal_type].push(log)
        }
    })

    return { data: grouped, error: null }
}
