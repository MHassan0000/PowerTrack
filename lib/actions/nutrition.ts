'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNutritionLogSchema, updateNutritionLogSchema, CreateNutritionLogInput } from '@/lib/validations/nutrition'

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
    calorieGoal: number | null
    proteinGoal: number | null
    carbsGoal: number | null
    fatGoal: number | null
}

// CreateNutritionLogInput is now imported from validations

/**
 * Add a new nutrition log
 */
export async function addNutritionLog(input: CreateNutritionLogInput): Promise<{ data: NutritionLog | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const validationResult = createNutritionLogSchema.safeParse(input)
    if (!validationResult.success) {
        return { data: null, error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    const { data, error } = await supabase
        .from('nutrition_logs')
        .insert({
            user_id: user.id,
            meal_type: validatedData.meal_type,
            food_item: validatedData.food_item,
            calories: validatedData.calories || null,
            protein_g: validatedData.protein_g || null,
            carbs_g: validatedData.carbs_g || null,
            fat_g: validatedData.fat_g || null,
            fiber_g: validatedData.fiber_g || null,
            sugar_g: validatedData.sugar_g || null,
            notes: validatedData.notes || null,
            logged_at: validatedData.logged_at || new Date().toISOString(),
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
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return {
            data: { 
                totalCalories: 0, 
                totalProtein: 0, 
                totalCarbs: 0, 
                totalFat: 0, 
                totalFiber: 0, 
                totalSugar: 0, 
                mealCount: 0, 
                calorieGoal: null,
                proteinGoal: null,
                carbsGoal: null,
                fatGoal: null
            },
            error: 'Not authenticated'
        }
    }

    // Fetch effective nutrition goals for the target date
    // Query: Get the most recent goal history entry on or before the target date
    // If no entry found (e.g. date before 2000-01-01 implicit backfill), it returns null, handling graceful fallback optional
    const targetDateObj = date ? new Date(date) : new Date()
    const targetDateStr = targetDateObj.toISOString().split('T')[0]

    const { data: goalHistory } = await supabase
        .from('nutrition_goals_history')
        .select('*')
        .eq('user_id', user.id)
        .lte('effective_date', targetDateStr)
        .order('effective_date', { ascending: false })
        .limit(1)
        .maybeSingle()

    // Fallback: Use current user profile goals if no history found (shouldn't happen with migration backfill, but safe)
    let profileGoals = {
        daily_calorie_goal: null,
        daily_protein_goal_g: null,
        daily_carbs_goal_g: null,
        daily_fat_goal_g: null
    }

    if (goalHistory) {
        profileGoals = {
            daily_calorie_goal: goalHistory.daily_calorie_goal,
            daily_protein_goal_g: goalHistory.daily_protein_goal_g,
            daily_carbs_goal_g: goalHistory.daily_carbs_goal_g,
            daily_fat_goal_g: goalHistory.daily_fat_goal_g
        }
    } else {
        // Double fallback to live profile
        const { data: liveProfile } = await supabase
            .from('users')
            .select('daily_calorie_goal, daily_protein_goal_g, daily_carbs_goal_g, daily_fat_goal_g')
            .eq('id', user.id)
            .single()
        
        if (liveProfile) {
            profileGoals = liveProfile as any
        }
    }

    const { data: logs, error } = await getNutritionLogs(date)

    if (error) {
        return {
            data: { 
                totalCalories: 0, 
                totalProtein: 0, 
                totalCarbs: 0, 
                totalFat: 0, 
                totalFiber: 0, 
                totalSugar: 0, 
                mealCount: 0,
                calorieGoal: profileGoals.daily_calorie_goal || null,
                proteinGoal: profileGoals.daily_protein_goal_g || null,
                carbsGoal: profileGoals.daily_carbs_goal_g || null,
                fatGoal: profileGoals.daily_fat_goal_g || null
            },
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
        calorieGoal: profileGoals.daily_calorie_goal || null,
        proteinGoal: profileGoals.daily_protein_goal_g || null,
        carbsGoal: profileGoals.daily_carbs_goal_g || null,
        fatGoal: profileGoals.daily_fat_goal_g || null,
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
 * Update an existing nutrition log
 */
export async function updateNutritionLog(logId: string, input: Partial<CreateNutritionLogInput>): Promise<{ data: NutritionLog | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const validationResult = updateNutritionLogSchema.safeParse(input)
    if (!validationResult.success) {
        return { data: null, error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    const updateData: any = {}
    if (validatedData.food_item !== undefined) updateData.food_item = validatedData.food_item
    if (validatedData.meal_type !== undefined) updateData.meal_type = validatedData.meal_type
    if (validatedData.calories !== undefined) updateData.calories = validatedData.calories
    if (validatedData.protein_g !== undefined) updateData.protein_g = validatedData.protein_g
    if (validatedData.carbs_g !== undefined) updateData.carbs_g = validatedData.carbs_g
    if (validatedData.fat_g !== undefined) updateData.fat_g = validatedData.fat_g
    if (validatedData.fiber_g !== undefined) updateData.fiber_g = validatedData.fiber_g
    if (validatedData.sugar_g !== undefined) updateData.sugar_g = validatedData.sugar_g
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes

    const { data, error } = await supabase
        .from('nutrition_logs')
        .update(updateData)
        .eq('id', logId)
        .eq('user_id', user.id) // Ensure user owns this log
        .select()
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    revalidatePath('/nutrition')
    return { data, error: null }
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
/**
 * Duplicate a nutrition log for the current date
 * This creates a copy of an existing log entry with the same meal type and nutritional values
 */
export async function duplicateNutritionLog(logId: string, targetDate?: string): Promise<{ data: NutritionLog | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    // First, fetch the original log to ensure it belongs to the current user
    const { data: originalLog, error: fetchError } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('id', logId)
        .eq('user_id', user.id) // RLS protection: ensure user owns this log
        .single()

    if (fetchError || !originalLog) {
        return { data: null, error: 'Log not found or unauthorized' }
    }

    // Create a duplicate with the same nutritional data but new timestamp
    const { data, error } = await supabase
        .from('nutrition_logs')
        .insert({
            user_id: user.id,
            meal_type: originalLog.meal_type,
            food_item: originalLog.food_item,
            calories: originalLog.calories,
            protein_g: originalLog.protein_g,
            carbs_g: originalLog.carbs_g,
            fat_g: originalLog.fat_g,
            fiber_g: originalLog.fiber_g,
            sugar_g: originalLog.sugar_g,
            notes: originalLog.notes,
            logged_at: targetDate || new Date().toISOString(),
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
 * Copy all meals from yesterday to today
 * Idempotent - only copies if today has no entries yet
 */
export async function copyYesterdaysMeals(targetDate: string): Promise<{ data: NutritionLog[] | null; error: string | null; skipped?: boolean }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    // Parse target date and calculate yesterday
    const target = new Date(targetDate)
    const yesterday = new Date(target)
    yesterday.setDate(yesterday.getDate() - 1)

    const targetStartOfDay = new Date(target)
    targetStartOfDay.setHours(0, 0, 0, 0)
    const targetEndOfDay = new Date(target)
    targetEndOfDay.setHours(23, 59, 59, 999)

    const yesterdayStartOfDay = new Date(yesterday)
    yesterdayStartOfDay.setHours(0, 0, 0, 0)
    const yesterdayEndOfDay = new Date(yesterday)
    yesterdayEndOfDay.setHours(23, 59, 59, 999)

    // Check if target date already has entries (idempotent)
    const { data: existingLogs, error: checkError } = await supabase
        .from('nutrition_logs')
        .select('id')
        .eq('user_id', user.id)
        .gte('logged_at', targetStartOfDay.toISOString())
        .lte('logged_at', targetEndOfDay.toISOString())

    if (checkError) {
        return { data: null, error: checkError.message }
    }

    if (existingLogs && existingLogs.length > 0) {
        return { data: null, error: null, skipped: true }
    }

    // Fetch yesterday's meals (with ownership validation)
    const { data: yesterdayLogs, error: fetchError } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id) // RLS: ensure user owns these logs
        .gte('logged_at', yesterdayStartOfDay.toISOString())
        .lte('logged_at', yesterdayEndOfDay.toISOString())

    if (fetchError) {
        return { data: null, error: fetchError.message }
    }

    if (!yesterdayLogs || yesterdayLogs.length === 0) {
        return { data: [], error: null }
    }

    // Create duplicates with current timestamp
    const newEntries = yesterdayLogs.map(log => ({
        user_id: user.id,
        meal_type: log.meal_type,
        food_item: log.food_item,
        calories: log.calories,
        protein_g: log.protein_g,
        carbs_g: log.carbs_g,
        fat_g: log.fat_g,
        fiber_g: log.fiber_g,
        sugar_g: log.sugar_g,
        notes: log.notes,
        logged_at: targetDate,
    }))

    const { data, error } = await supabase
        .from('nutrition_logs')
        .insert(newEntries)
        .select()

    if (error) {
        return { data: null, error: error.message }
    }

    revalidatePath('/nutrition')
    return { data, error: null }
}
