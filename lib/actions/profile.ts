'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ProfileFormData {
    full_name: string
    age: number
    height_cm: number
    weight_kg: number
    fitness_goal: 'lose_fat' | 'build_muscle' | 'maintain' | 'endurance' | 'strength'
    experience_level: 'beginner' | 'intermediate' | 'advanced'
    preferred_units: 'metric' | 'imperial'
    bio?: string
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Extract and validate form data
    const full_name = formData.get('full_name') as string
    const age = parseInt(formData.get('age') as string)
    const height_cm = parseFloat(formData.get('height_cm') as string)
    const weight_kg = parseFloat(formData.get('weight_kg') as string)
    const fitness_goal = formData.get('fitness_goal') as string
    const experience_level = formData.get('experience_level') as string
    const preferred_units = formData.get('preferred_units') as string
    const bio = formData.get('bio') as string

    // Validation
    if (!full_name || full_name.trim().length === 0) {
        return { error: 'Name is required' }
    }

    if (!age || age < 13 || age > 120) {
        return { error: 'Please enter a valid age (13-120)' }
    }

    if (!height_cm || height_cm <= 0) {
        return { error: 'Please enter a valid height' }
    }

    if (!weight_kg || weight_kg <= 0) {
        return { error: 'Please enter a valid weight' }
    }

    // Update profile
    const { error } = await supabase
        .from('users')
        .update({
            full_name,
            age,
            height_cm,
            weight_kg,
            fitness_goal,
            experience_level,
            preferred_units,
            bio: bio || null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/settings')
    revalidatePath('/dashboard')

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

        console.log('📝 Storing avatar as base64 data URL')

        // Update user profile with base64 data URL
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: dataUrl })
            .eq('id', user.id)

        if (updateError) {
            console.error('❌ Database update error:', updateError)
            return { error: `Database error: ${updateError.message}` }
        }

        console.log('✅ Avatar stored successfully!')

        revalidatePath('/settings')
        revalidatePath('/dashboard')

        return { success: true, avatarUrl: dataUrl }
    } catch (error: any) {
        console.error('❌ Avatar upload error:', error)
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
