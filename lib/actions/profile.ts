'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/validations/profile'

export interface ProfileFormData {
    full_name: string
    age: number
    height_cm: number
    weight_kg: number
    fitness_goal: 'lose_fat' | 'build_muscle' | 'maintain' | 'endurance' | 'strength'
    experience_level: 'beginner' | 'intermediate' | 'advanced'
    preferred_units: 'metric' | 'imperial'
    bio?: string
    daily_calorie_goal?: number
    daily_protein_goal_g?: number
    daily_carbs_goal_g?: number
    daily_fat_goal_g?: number
}

/**
 * Get user profile
 */
export async function getProfile() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        return { error: error.message }
    }

    return { data }
}

/**
 * Update user profile
 */
export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const rawData: any = {}
    if (formData.has('full_name')) rawData.full_name = formData.get('full_name')
    if (formData.has('bio')) rawData.bio = formData.get('bio')
    
    // Parse numbers
    if (formData.has('age')) rawData.age = parseInt(formData.get('age') as string)
    if (formData.has('height_cm')) rawData.height_cm = parseFloat(formData.get('height_cm') as string)
    if (formData.has('weight_kg')) rawData.weight_kg = parseFloat(formData.get('weight_kg') as string)
    
    // Enums - pass string, Zod will validate
    if (formData.has('fitness_goal')) rawData.fitness_goal = formData.get('fitness_goal')
    if (formData.has('experience_level')) rawData.experience_level = formData.get('experience_level')
    if (formData.has('preferred_units')) rawData.preferred_units = formData.get('preferred_units')

    // Goals
    if (formData.has('daily_calorie_goal')) rawData.daily_calorie_goal = parseInt(formData.get('daily_calorie_goal') as string)
    if (formData.has('daily_protein_goal_g')) rawData.daily_protein_goal_g = parseInt(formData.get('daily_protein_goal_g') as string)
    if (formData.has('daily_carbs_goal_g')) rawData.daily_carbs_goal_g = parseInt(formData.get('daily_carbs_goal_g') as string)
    if (formData.has('daily_fat_goal_g')) rawData.daily_fat_goal_g = parseInt(formData.get('daily_fat_goal_g') as string)

    const validationResult = profileSchema.safeParse(rawData)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    const { error } = await supabase
        .from('users')
        .update({
            ...validatedData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Update Goal History (Type 2 SCD)
    // Check if we have any goal fields to update
    const goalFields = ['daily_calorie_goal', 'daily_protein_goal_g', 'daily_carbs_goal_g', 'daily_fat_goal_g']
    const hasGoalUpdates = goalFields.some(field => field in validatedData)

    if (hasGoalUpdates) {
        const today = new Date().toISOString().split('T')[0]
        
        // Fetch current state to ensure complete snapshot from the DB (handles partial updates)
        const { data: updatedUser } = await supabase
            .from('users')
            .select('daily_calorie_goal, daily_protein_goal_g, daily_carbs_goal_g, daily_fat_goal_g')
            .eq('id', user.id)
            .single()
            
        if (updatedUser) {
             await supabase
                .from('nutrition_goals_history')
                .upsert({
                    user_id: user.id,
                    effective_date: today,
                    daily_calorie_goal: updatedUser.daily_calorie_goal,
                    daily_protein_goal_g: updatedUser.daily_protein_goal_g,
                    daily_carbs_goal_g: updatedUser.daily_carbs_goal_g,
                    daily_fat_goal_g: updatedUser.daily_fat_goal_g,
                }, { onConflict: 'user_id, effective_date' })
        }
    }

    revalidatePath('/settings')
    revalidatePath('/dashboard')
    revalidatePath('/nutrition') // Ensure nutrition page reflects new goals

    return { success: true, message: 'Profile updated successfully!' }
}

/**
 * Upload avatar - SIMPLIFIED VERSION WITHOUT STORAGE
 * Converts image to base64 and stores directly in database
 */
export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const file = formData.get('avatar') as File

    if (!file) {
        return { error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        return { error: 'Please upload an image file' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'Image must be less than 5MB' }
    }

    try {
        // Convert file to base64 data URL
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:${file.type};base64,${base64}`

        // Update user profile with base64 data URL
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: dataUrl })
            .eq('id', user.id)

        if (updateError) {
            return { error: `Database error: ${updateError.message}` }
        }

        revalidatePath('/settings')
        revalidatePath('/dashboard')

        return { success: true, avatarUrl: dataUrl }
    } catch (error: any) {
        return { error: error.message || 'Failed to process image' }
    }
}

/**
 * Convert height based on preferred units
 */
export async function convertHeight(cm: number, toUnit: 'metric' | 'imperial'): Promise<{ value: number; unit: string }> {
    if (toUnit === 'imperial') {
        const totalInches = cm / 2.54
        const feet = Math.floor(totalInches / 12)
        const inches = Math.round(totalInches % 12)
        return { value: feet + inches / 12, unit: `${feet}'${inches}"` }
    }
    return { value: cm, unit: 'cm' }
}

/**
 * Convert weight based on preferred units
 */
export async function convertWeight(kg: number, toUnit: 'metric' | 'imperial'): Promise<{ value: number; unit: string }> {
    if (toUnit === 'imperial') {
        return { value: Math.round(kg * 2.20462 * 10) / 10, unit: 'lbs' }
    }
    return { value: kg, unit: 'kg' }
}
