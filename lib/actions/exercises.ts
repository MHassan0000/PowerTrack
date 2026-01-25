'use server'

import { createClient } from '@/lib/supabase/server'

export interface Exercise {
    id: string
    name: string
    description: string | null
    primary_muscle: string
    secondary_muscles: string[] | null
    equipment: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    media_url: string | null
    instructions: string | null
    tips: string | null
    created_at: string
    updated_at: string
}

export interface ExerciseFilters {
    muscle?: string
    equipment?: string
    difficulty?: string
    search?: string
}

/**
 * Get all exercises with optional filters
 */
export async function getExercises(filters?: ExerciseFilters) {
    const supabase = await createClient()

    let query = supabase
        .from('exercise_library')
        .select('*')
        .order('name', { ascending: true })

    // Apply filters
    if (filters?.muscle) {
        query = query.or(`primary_muscle.eq.${filters.muscle},secondary_muscles.cs.{${filters.muscle}}`)
    }

    if (filters?.equipment) {
        query = query.eq('equipment', filters.equipment)
    }

    if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
    }

    // Search in name and description using ILIKE for partial matching
    if (filters?.search && filters.search.trim().length > 0) {
        const searchTerm = filters.search.trim()
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,primary_muscle.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get single exercise by ID
 */
export async function getExerciseById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('exercise_library')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get unique muscle groups from exercises
 */
export async function getMuscleGroups() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('exercise_library')
        .select('primary_muscle')

    if (error) {
        return { data: [], error: error.message }
    }

    // Get unique muscles
    const muscles = [...new Set(data.map((e) => e.primary_muscle))].sort()
    return { data: muscles, error: null }
}

/**
 * Get unique equipment types
 */
export async function getEquipmentTypes() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('exercise_library')
        .select('equipment')

    if (error) {
        return { data: [], error: error.message }
    }

    // Get unique equipment
    const equipment = [...new Set(data.map((e) => e.equipment))].sort()
    return { data: equipment, error: null }
}

import { createExerciseSchema } from '@/lib/validations/exercises'

// ... existing code ...

/**
 * Create new exercise (admin only)
 */
export async function createExercise(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const rawData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        primary_muscle: formData.get('primary_muscle') as string,
        secondary_muscles: (formData.get('secondary_muscles') as string)?.split(',').filter(Boolean) || [],
        equipment: formData.get('equipment') as string,
        difficulty: formData.get('difficulty') as string,
        media_url: formData.get('media_url') as string,
        instructions: formData.get('instructions') as string,
        tips: formData.get('tips') as string,
    }

    const validationResult = createExerciseSchema.safeParse(rawData)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedData = validationResult.data

    const { data, error } = await supabase
        .from('exercise_library')
        .insert({
            ...validatedData,
            created_by: user.id
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { data, error: null }
}

