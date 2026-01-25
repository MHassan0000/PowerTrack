'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface WorkoutExercise {
    id: string
    workout_id: string
    exercise_id: string
    order_index: number
    sets: number
    reps: number | null
    duration_seconds: number | null
    rest_seconds: number
    weight_kg: number | null
    notes: string | null
    created_at: string
}

export interface Workout {
    id: string
    user_id: string
    name: string
    description: string | null
    is_template: boolean
    scheduled_date: string | null
    completed_at: string | null
    duration_minutes: number | null
    notes: string | null
    created_at: string
    updated_at: string
}

export interface WorkoutWithExercises extends Workout {
    exercises: (WorkoutExercise & {
        exercise_library: {
            id: string
            name: string
            primary_muscle: string
            equipment: string
            difficulty: string
            media_url: string | null
        }
    })[]
}

/**
 * Get all workouts for current user
 */
export async function getWorkouts(templatesOnly = false) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    let query = supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (templatesOnly) {
        query = query.eq('is_template', true)
    }

    const { data, error } = await query

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

/**
 * Get single workout with exercises
 */
export async function getWorkoutById(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    // Get workout
    const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (workoutError) {
        return { data: null, error: workoutError.message }
    }

    // Get workout exercises with exercise details
    const { data: exercises, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(
            `
      *,
      exercise_library (
        id,
        name,
        primary_muscle,
        equipment,
        difficulty,
        media_url
      )
    `
        )
        .eq('workout_id', id)
        .order('order_index', { ascending: true })

    if (exercisesError) {
        return { data: null, error: exercisesError.message }
    }

    return {
        data: {
            ...workout,
            exercises: exercises || [],
        } as WorkoutWithExercises,
        error: null,
    }
}

import { createWorkoutSchema, updateWorkoutSchema, workoutExerciseSchema, updateWorkoutExerciseSchema } from '@/lib/validations/workouts'

/**
 * Create new workout
 */
export async function createWorkout(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const rawData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        is_template: formData.get('is_template') === 'true',
        scheduled_date: formData.get('scheduled_date') as string,
        notes: formData.get('notes') as string,
    }

    const validationResult = createWorkoutSchema.safeParse(rawData)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const data = validationResult.data

    const { data: workout, error } = await supabase
        .from('workouts')
        .insert({
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            is_template: data.is_template || false,
            scheduled_date: data.scheduled_date || null,
            notes: data.notes || null,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/workouts')
    return { data: workout, error: null }
}

/**
 * Update workout
 */
export async function updateWorkout(id: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const rawData: any = {}
    if (formData.has('name')) rawData.name = formData.get('name')
    if (formData.has('description')) rawData.description = formData.get('description')
    if (formData.has('is_template')) rawData.is_template = formData.get('is_template') === 'true'
    if (formData.has('scheduled_date')) rawData.scheduled_date = formData.get('scheduled_date')
    if (formData.has('notes')) rawData.notes = formData.get('notes')

    const validationResult = updateWorkoutSchema.safeParse(rawData)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const data = validationResult.data

    const { error } = await supabase
        .from('workouts')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/workouts')
    revalidatePath(`/workouts/${id}`)
    return { error: null }
}

/**
 * Delete workout
 */
export async function deleteWorkout(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/workouts')

    return { success: true, error: null }
}

/**
 * Add exercise to workout
 */
export async function addExerciseToWorkout(
    workoutId: string,
    exerciseId: string,
    config: {
        sets: number
        reps?: number
        duration_seconds?: number
        rest_seconds: number
        weight_kg?: number
        notes?: string
    }
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const validationResult = workoutExerciseSchema.safeParse({
        exercise_id: exerciseId,
        ...config
    })

    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedConfig = validationResult.data

    // Get current max order index
    const { data: exercises } = await supabase
        .from('workout_exercises')
        .select('order_index')
        .eq('workout_id', workoutId)
        .order('order_index', { ascending: false })
        .limit(1)

    const nextOrderIndex = (exercises?.[0]?.order_index ?? -1) + 1

    const { data, error } = await supabase
        .from('workout_exercises')
        .insert({
            workout_id: workoutId,
            exercise_id: validatedConfig.exercise_id,
            order_index: nextOrderIndex,
            sets: validatedConfig.sets,
            reps: validatedConfig.reps || null,
            duration_seconds: validatedConfig.duration_seconds || null,
            rest_seconds: validatedConfig.rest_seconds,
            weight_kg: validatedConfig.weight_kg || null,
            notes: validatedConfig.notes || null,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    await recalculateWorkoutDuration(workoutId)

    revalidatePath(`/workouts/${workoutId}`)
    return { data, error: null }
}

/**
 * Recalculate and update workout estimated duration based on all exercises
 */
export async function recalculateWorkoutDuration(workoutId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get all exercises for this workout
    const { data: exercises, error: fetchError } = await supabase
        .from('workout_exercises')
        .select('sets, reps, duration_seconds, rest_seconds')
        .eq('workout_id', workoutId)

    if (fetchError || !exercises || exercises.length === 0) {
        // No exercises, set duration to null
        await supabase
            .from('workouts')
            .update({ duration_minutes: null })
            .eq('id', workoutId)
            .eq('user_id', user.id)
        
        return { data: null, error: null }
    }

    // Calculate total estimated duration
    // Formula: (sets × duration) + ((sets - 1) × rest)
    // No rest after the last set!
    let totalSeconds = 0
    exercises.forEach(exercise => {
        const setDuration = exercise.duration_seconds || (exercise.reps ? exercise.reps * 4 : 0)
        const restTime = exercise.rest_seconds || 60
        const sets = exercise.sets || 1
        
        // Total time = all sets + rest between sets (not after last set)
        totalSeconds += (sets * setDuration) + ((sets - 1) * restTime)
    })

    const estimatedMinutes = Math.ceil(totalSeconds / 60)

    // Update workout duration
    const { error: updateError } = await supabase
        .from('workouts')
        .update({ duration_minutes: estimatedMinutes })
        .eq('id', workoutId)
        .eq('user_id', user.id)

    if (updateError) {
        return { error: updateError.message }
    }

    revalidatePath(`/workouts/${workoutId}`)

    return { data: estimatedMinutes, error: null }
}

/**
 * Update workout exercise
 */
export async function updateWorkoutExercise(
    id: string,
    updates: {
        sets?: number
        reps?: number
        duration_seconds?: number
        rest_seconds?: number
        weight_kg?: number
        notes?: string
    }
) {
    const supabase = await createClient()

    const validationResult = updateWorkoutExerciseSchema.safeParse(updates)
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }
    const validatedUpdates = validationResult.data

    const { error } = await supabase
        .from('workout_exercises')
        .update({
             ...validatedUpdates,
             // Ensure optional fields are handled if explicit null/undefined logic needed, 
             // but here we just spread validated partial updates
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    // Get workout_id to revalidate and recalculate duration
    const { data: we } = await supabase.from('workout_exercises').select('workout_id').eq('id', id).single()
    if (we) {
        await recalculateWorkoutDuration(we.workout_id)
        revalidatePath(`/workouts/${we.workout_id}`)
    }

    return { error: null }
}

/**
 * Remove exercise from workout
 */
export async function removeExerciseFromWorkout(workoutExerciseId: string) {
    const supabase = await createClient()

    // Get workout_id before deleting
    const { data: exercise } = await supabase
        .from('workout_exercises')
        .select('workout_id')
        .eq('id', workoutExerciseId)
        .single()

    const { error } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('id', workoutExerciseId)

    if (error) {
        return { error: error.message }
    }

    if (exercise?.workout_id) {
        revalidatePath(`/workouts/${exercise.workout_id}`)
    }

    return { success: true, error: null }
}

/**
 * Reorder exercises in workout
 */
export async function reorderWorkoutExercises(
    workoutId: string,
    exerciseIds: string[]
) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    try {
        // Two-pass update to avoid unique constraint violation
        // Pass 1: Set all to temporary negative values
        for (let i = 0; i < exerciseIds.length; i++) {
            const { error } = await supabase
                .from('workout_exercises')
                .update({ order_index: -(i + 1) })
                .eq('id', exerciseIds[i])

            if (error) {
                return { success: false, error: error.message }
            }
        }

        // Pass 2: Set to final positive values
        for (let i = 0; i < exerciseIds.length; i++) {
            const { error } = await supabase
                .from('workout_exercises')
                .update({ order_index: i })
                .eq('id', exerciseIds[i])

            if (error) {
                return { success: false, error: error.message }
            }
        }

        revalidatePath(`/workouts/${workoutId}`)
        revalidatePath(`/workouts/${workoutId}/edit`)

        return { success: true, error: null }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Duplicate workout as template
 */
export async function duplicateWorkout(workoutId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get original workout with exercises
    const { data: original } = await getWorkoutById(workoutId)

    if (!original) {
        return { error: 'Workout not found' }
    }

    // Create new workout
    const { data: newWorkout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
            user_id: user.id,
            name: `${original.name} (Copy)`,
            description: original.description,
            is_template: true,
        })
        .select()
        .single()

    if (workoutError) {
        return { error: workoutError.message }
    }

    // Copy exercises
    if (original.exercises && original.exercises.length > 0) {
        const exercisesToCopy = original.exercises.map((ex) => ({
            workout_id: newWorkout.id,
            exercise_id: ex.exercise_id,
            order_index: ex.order_index,
            sets: ex.sets,
            reps: ex.reps,
            duration_seconds: ex.duration_seconds,
            rest_seconds: ex.rest_seconds,
            weight_kg: ex.weight_kg,
            notes: ex.notes,
        }))

        await supabase.from('workout_exercises').insert(exercisesToCopy)
    }

    revalidatePath('/workouts')

    return { data: newWorkout, error: null }
}
